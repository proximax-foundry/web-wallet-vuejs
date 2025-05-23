<script setup lang="ts">
import { ref, watch, computed, getCurrentInstance } from 'vue'
import { 
  AccountHttp, MosaicHttp, Convert, Address,
  UInt64
} from 'tsjs-xpx-chain-sdk';

import { SimpleSDA } from '@/models/sda'
import {sum} from 'mathjs'
import {DistributeListInterface, Sirius} from "@/models/sirius"
import { AppState } from '@/state/appState';
import {networkState} from "@/state/networkState";
import * as mathjs from "mathjs"
import { walletState } from '@/state/walletState';
import Dropdown from 'primevue/dropdown';
import { MultisigUtils } from '@/util/multisigUtils';
import { Helper } from '@/util/typeHelper';
import { TransactionUtils, isMultiSig } from '@/util/transactionUtils';
import { WalletUtils } from '@/util/walletUtils';
import {useI18n} from 'vue-i18n'
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInputAccount from '@/components/SelectInputAccount.vue';
import SelectInputMultisigAccount from '@/components/SelectInputMultisigAccount.vue';
import MultisigInput from "@/components/MultisigInput.vue"
import type { Account } from '@/models/account';
import type { WalletAccount } from '@/models/walletAccount';
import { parse } from 'csv-parse';
import type { TreeNode } from 'primevue/treenode';

const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;

const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
const cosignerBalanceInsufficient = ref(false);
const selectedAddress = ref<string | null>(null)
const selectedMultisigAddress = ref<string | null>(null)
const selectedMultisigName = ref<string | null>(null)
const selectedMultisigPublicKey = ref("")
const toggleMultisig = ref(false)
const selectedMultisig = ref({})
const disableAllInput = ref(false);
const cosignAddress = ref("");
const showPasswdError = ref(false);
const disablePassword = computed(() => disableAllInput.value);
const walletPassword = ref("");
const {t} = useI18n();
const err = ref('');
const initiateBy = computed(() => {
  if(selectedMultisigAddress.value){
    return true
  } else {
    return false
  }
})

let assetList = ref<SimpleSDA[]>([]);
let assetSelected = ref(null);
let aggregateNum = ref(10);
let distributionList = ref<DistributeListInterface[]>([]);
let totalRecipients = ref(0);
let totalDistributeAmount = ref(0);
let txnsHash = ref<string[]>([]);

// all status flags
let noAssetFound = ref(false);
let fileError = ref(false);
let assetNotEnough = ref(false);
let assetWrongDivisibility = ref("");
let distributeDone = ref(false);
let sdaError = ref("");
let recipientError = ref("");
let distributionError = ref("");
let distributing = ref(false);
let knownToken = [{
    namespace: "prx.xpx",
    name: "XPX"
  },
  {
    namespace: "prx.metx",
    name: "METX"
  },{
    namespace: "xarcade.xar",
    name: "XAR"
  }];

let scanDistributorAsset = async() =>{
  noAssetFound.value = false;
  assetSelected.value = null;
  if(selectedMultisigAddress.value){
    selectedMultisigPublicKey.value = (await WalletUtils.getAccInfo(selectedMultisigAddress.value)).publicKey
  }
  let assets = await Sirius.scanAsset(selectedMultisigPublicKey.value ? selectedMultisigPublicKey.value : selectedAccount.value ? selectedAccount.value.publicKey : "");

  assetList.value = assets;

  if(assets.length === 0){
    noAssetFound.value = true;
  }
}

let aggregateOption = [
  {label: "5", value: 5},
  {label: "10", value: 10},
  {label: "15", value: 15},
  {label: "20", value: 20}
]

let distribute = async()=>{
  distributionError.value = "";
  distributeDone.value = false;
  if(distributing.value){
    return;
  }

  if(assetNotEnough.value || assetWrongDivisibility.value){
    return;
  }
  else if(assetSelected.value === null){
    sdaError.value = "Please select SDA";
    return;
  }
  else if(totalRecipients.value === 0){
    recipientError.value = "No recipient to distribute";
    return;
  }
  else if(walletPassword.value){
    let verifyPassword = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPassword.value)
      if(!verifyPassword){
        err.value = t('general.walletPasswordInvalid',{name : walletState.currentLoggedInWallet.name})
        return
      }
  }

  let totalLockHashTxn = Math.ceil(totalRecipients.value/ aggregateNum.value);

  let totalLockHashFee = totalLockHashTxn * Sirius.getLockFundTransactionFee();
  let totalLockHashToken = totalLockHashTxn * networkState.currentNetworkProfileConfig!.lockedFundsPerAggregate!;

  let selectedSda = assetList.value.find(x => x.id === assetSelected.value.id);
  const nodeTime = await AppState.chainAPI.nodeAPI.getNodeTime();
  let aggregateTxns = Sirius.createDistributeAggregateTransactions(
    selectedMultisigPublicKey.value ? selectedMultisigPublicKey.value : selectedAccount.value.publicKey, 
    distributionList.value, 
    aggregateNum.value, 
    selectedSda!,
    new UInt64(nodeTime.sendTimeStamp!)
  );
  let totalAggregateTxnsFee = sum(aggregateTxns.map(x=> x.maxFee.compact()));
  let totalInitiatorFee = sum(totalLockHashFee, totalLockHashToken, totalAggregateTxnsFee);
  let xpxNeeded = totalInitiatorFee / Math.pow(10, AppState.nativeToken.divisibility);
  const passwordInstance = WalletUtils.createPassword(walletPassword.value);
  let selectedCosign: string;
  if (isMultiSigBool.value) {
   let selectedCosignList = getWalletCosigner.value.cosignerList;
   if (selectedCosignList.length > 1) {
      selectedCosign = cosignAddress.value;
    } else {
      let findAccount = walletState.currentLoggedInWallet?.accounts.find(acc => acc.publicKey == selectedCosignList[0].publicKey)
      selectedCosign = findAccount ? findAccount.address : ""
    }
   }
  let initiatorAcc;
  if(!selectedCosign){
    initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedAccount.value.address) as WalletAccount;
  }else{
    initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedCosign) as WalletAccount;
  }
  const walletPrivateKey = WalletUtils.decryptPrivateKey(passwordInstance,initiatorAcc.encrypted, initiatorAcc.iv);
  let privateKey = walletPrivateKey.toUpperCase();
  let initiator = Sirius.createAccount(privateKey);
  let initiatorSda = await Sirius.scanAsset(initiator.publicKey);

  let initiatorXPX = initiatorSda.find(x => x.namespaceName === AppState.nativeToken.fullNamespace.trim());

  if(initiatorXPX){
    if(xpxNeeded > initiatorXPX.amount){
      distributionError.value = `Initiator do not have enough XPX (${initiatorXPX.amount}), need ${xpxNeeded}`;
      return;
    }
  }
  else{
    distributionError.value = "Initiator do not have any XPX";
    return;
  }

  distributing.value = true;
  let allTxnsHash  = await Sirius.signAllAbtAndAnnounce(aggregateTxns, initiator);
  distributing.value = false;
  distributeDone.value = true;
  txnsHash.value = allTxnsHash;
}

const parseCSV = async (data) =>{
  const promise = () => new Promise((resolve, reject) => {
    const parseData = [];
    const parser = parse(data, {
      trim: true,
      skip_empty_lines: true
    })
    parser.on('readable', function(){
      let record; while ((record = parser.read()) !== null) {
        parseData.push(record);
      }
    })
    parser.on('end', function(){
      resolve(parseData)
    });
  })
  const parseData = await promise()
  return parseData
}

let loadCSV = (e: any)=>{
  fileError.value = false;
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = async (e: any) => {
    const fileData = e.target.result;
    
    try {
      let distResultCsvData: any[] = [];

      let totalLine = fileData.split(/\r?\n/);

      for(let i =1; i < totalLine.length; i++){
        let lineData = totalLine[i].trim();
        if(lineData === ""){
          break;
        }
        const data = await parseCSV(lineData);
        distResultCsvData.push({
          publicKeyOrAddress: data[0][0],
          amount: data[0][1],
          message: data[0][2]?data[0][2]:""
        });
      }

      let isInvalidData = false;
      distributionList.value = [];
      let tempData: DistributeListInterface[] = [];

      if(distResultCsvData && distResultCsvData.length){

        for(let i=0; i < distResultCsvData.length; ++i){
          let publicKeyOrAddress = distResultCsvData[i].publicKeyOrAddress.trim().replaceAll("-","");
          let originAmount = distResultCsvData[i].amount.trim();
          let amount = parseFloat(distResultCsvData[i].amount.trim());
          let message = distResultCsvData[i].message

          if(publicKeyOrAddress.length === 64){
            if(!Convert.isHexString(publicKeyOrAddress)){
              isInvalidData = true; 
              break;
            }
          }
          else if(publicKeyOrAddress.length === 40){
            let tempAddress = Address.createFromRawAddress(publicKeyOrAddress);
            if(tempAddress.networkType !== AppState.networkType){
              isInvalidData = true;
              break;
            }
          }
          else{
            isInvalidData = true;
            break;
          }
          
          let newAmountLength = amount.toString().length;

          if(isNaN(amount)){
            isInvalidData = true;
            break;
          }
          else if(newAmountLength !== originAmount.length){
            let strippedDecimal = originAmount.length - newAmountLength;

            if(amount.toString() + "0".repeat(strippedDecimal) !== originAmount){
              isInvalidData = true;
              // console.log("Invalid amount found");
              break;
            }
          }

          let newData: DistributeListInterface = {
            publicKeyOrAddress: publicKeyOrAddress,
            amount: amount,
            message: message,
          }; 

          tempData.push(newData);
        }
      }

      if(!isInvalidData){
        totalRecipients.value = distResultCsvData.length;
        totalDistributeAmount.value = sum(tempData.map( (x) => x.amount));
        distributionList.value = tempData; 
      }
      else{
        fileError.value = true;
        distributionList.value = [];
        totalRecipients.value = 0;
        totalDistributeAmount.value = 0;
      }
      
    } catch (error) {
      fileError.value = true;
    }
       
  }
  reader.readAsText(file);
}

let createTxnExplorerLink = (txnHash: string) =>{
  let explorerRoute = networkState.currentNetworkProfile!.chainExplorer;
  return explorerRoute.url + "/" + explorerRoute.hashRoute + "/" + txnHash
}

let dropFieldActive = ref(false);

let setInactive = () =>{
  dropFieldActive.value = false;
}

let setActive = () =>{
  dropFieldActive.value = true;
}

let checkDistributorAssetAmount = (selectedAssetId)=>{
  if(selectedAssetId){
    let data = assetList.value.find(x => x.id === selectedAssetId.id);

    if(totalDistributeAmount.value > data!.amount){
      assetNotEnough.value = true;
    }
    else{
      assetNotEnough.value = false;
    }
  }
  else{
    assetNotEnough.value = false;
  }
}

let checkDistributorAssetAmountDecimal = (selectedAssetId)=>{
  if(selectedAssetId){
    let data = assetList.value.find(x => x.id === selectedAssetId.id);

    let invalidDivisibility = distributionList.value.find(x =>{
      let bigNumberAmount = mathjs.bignumber(x.amount);
      let atomicAmount = mathjs.multiply(bigNumberAmount, Math.pow(10, data!.divisibility));
      let atomic = Number(atomicAmount.toString());
      return Math.trunc(atomic) !== atomic
    });

    if(invalidDivisibility){
      assetWrongDivisibility.value = "Invalid distribution amount, maximum decimal place is " + data!.divisibility;
    }
    else{
      assetWrongDivisibility.value = "";
    }
  }
  else{
    assetWrongDivisibility.value = "";
  }
}
const selectedAccount = ref<Account>()

const accounts = computed(
  () => {
    if (!walletState.currentLoggedInWallet) {
      return []
    }
    if (walletState.currentLoggedInWallet.others) {
      const accounts = walletState.currentLoggedInWallet.accounts.map((acc) => acc as Account)
      const filteredOthers = walletState.currentLoggedInWallet.others.filter(acc => acc.type != "DELEGATE")
      const otherAccounts = filteredOthers.map((acc) => acc as Account)
      return accounts.concat(otherAccounts)
    } else {
      const accounts = walletState.currentLoggedInWallet.accounts.map((acc) => acc as Account)
      return accounts
    }
  }
);

  selectedAccount.value = accounts.value[0]
  scanDistributorAsset()
  const currentAccount = ref(selectedAccount.value.address)

const isMultiSigBool = computed(() => {
      return isMultiSig(selectedAccount.value.address)
  }
)

const selectableMultisig = computed(() => {
  const wallet = walletState.currentLoggedInWallet;
  if(!wallet){
    return []
  }
  let account = wallet.accounts.find(acc => acc.address == selectedAccount.value.address)
  if(!account){
    return []
  }
  let accountMultisigs = account.multisigInfo.filter((info) => info.level < 0).map(
    (info, index) => {
      return {
        key: index.toString(),
        label: wallet.contacts.find((contacts) => contacts.address == WalletUtils.createAddressFromPublicKey(info.publicKey,AppState.networkType).plain())?wallet.contacts.find((contacts) => contacts.address == WalletUtils.createAddressFromPublicKey(info.publicKey,AppState.networkType).plain()).name:wallet.accounts.find((acc) => acc.publicKey == info.publicKey)?wallet.accounts.find((acc) => acc.publicKey == info.publicKey).name:"MULTISIG-" + WalletUtils.createAddressFromPublicKey(info.publicKey,AppState.networkType).plain().slice(-4),
        data: info.publicKey,
        selectable: true
      }
    }
  )
  var selectableMultisig = accountMultisigs
  return selectableMultisig
})

const haveSelectableMultisig = computed(() => {
  if(selectableMultisig.value.length==0){
    return false
  } else {
    return true
  }
})

const onSelectMultisig = (event) => {
  toggleMultisig.value = false
  selectedMultisigAddress.value = WalletUtils.createAddressFromPublicKey(event.data,AppState.networkType).plain()
  selectedMultisigName.value = event.label
  selectedMultisigPublicKey.value = event.data
  cosignAddress.value = selectedAccount.value.address
  // this is too make it turn blue
  selectedMultisig.value[event.key] = true
  scanDistributorAsset()
}

const findAcc = (publicKey)=>{
      return walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==publicKey)
    }

const findAccWithAddress = address =>{
  if(!walletState.currentLoggedInWallet){
    return null
  }
  return walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==address)
 }

const getWalletCosigner = computed(() =>{
        const account = accounts.value.find((acc: Account) => acc.address == selectedAccount.value?.address) as Account
        let cosigners = MultisigUtils.getCosignerInWallet(account.publicKey)
        let list: { hasCosigner: boolean, cosignerList: { publicKey: string, name: string, balance: number, address: string }[] } = { hasCosigner: cosigners.hasCosigner, cosignerList: [] }
        cosigners.cosignerList.forEach((publicKey: string) => {
          const acc = findAcc(publicKey)
          if (acc) {
            list.cosignerList.push({ publicKey: publicKey, name: acc.name, balance: acc.balance, address: acc.address })
          }
        })
        return list
    })

const lockFund = computed(() =>
  Helper.convertToExact(
    networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
    AppState.nativeToken.divisibility
  )
);
const lockFundCurrency = computed(() =>
  Helper.convertToCurrency(
     networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
    AppState.nativeToken.divisibility
  )
);
    
const lockFundTxFee = computed(()=>{
  if(networkState.currentNetworkProfile){
    return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
  }
  return 0;  
});
const lockFundTotalFee = computed(
  () => lockFund.value + lockFundTxFee.value
);

if (isMultiSigBool.value) {
  let cosigner = getWalletCosigner.value.cosignerList
  if (cosigner.length > 0) {
    cosignAddress.value = walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==cosigner[0].publicKey).address 
      disableAllInput.value = false;
      cosignerBalanceInsufficient.value = false;
  } else {
    disableAllInput.value = true;
  }
}

  watch(assetSelected, (value:string) => {
    checkDistributorAssetAmount(value);
    checkDistributorAssetAmountDecimal(value);
  });

  watch(totalDistributeAmount, (value) => {
    checkDistributorAssetAmount(assetSelected.value);
    checkDistributorAssetAmountDecimal(assetSelected.value);
  });

  watch(selectedAddress, async (n,o) => {
    //reload asset
    if(n == null){
        selectedMultisigName.value = null
        selectedMultisigAddress.value = null
    }
    else if(n != o){
        selectedMultisigName.value = null
        selectedMultisigAddress.value = null
    }
})

  // Cancel transfer from multisig
  const closeMultisig = () => {
    selectedMultisigName.value = null
    selectedMultisigAddress.value = null
    selectedMultisigPublicKey.value = ""
    scanDistributorAsset()
}

  // account is clicked
  const selectAccountAddress = (address: string) => {
    selectedAddress.value = address
    for (let i = 0; i < accounts.value.length; i++){
      if (accounts.value[i].address == address){
        selectedAccount.value = accounts.value[i]
        scanDistributorAsset()
        currentAccount.value = selectedAccount.value.address
      }
    }
  }

  const selectMultisigAccount = (node: TreeNode) => {
    selectedMultisigName.value = node.label
    selectedMultisigAddress.value = node.value
    scanDistributorAsset()
}
</script>

<template>
  <div class="container">
    <div class="p-2">
      <div class="flex gap-1">
        <SelectInputAccount :type="'airdrop'" :label="'create airdrop token'" @select-account="selectAccountAddress" />
        <SelectInputMultisigAccount :selected-address="selectedAddress" @select-multisig-account="selectMultisigAccount" />
      </div>
      <div v-if="selectedMultisigAddress" class="mt-3">
        <MultisigInput :select-default-address="selectedMultisigAddress" :select-default-name="selectedMultisigName" :type="'airdrop'" :label="'TRANSFER FROM MULTISIG'" @close-multisig="closeMultisig" />
      </div>
      <div v-if="noAssetFound" class="error error_box" role="alert">
          No SDA found
      </div>
    </div>
    <div class="p-2">
      <div>
        <div class="flex flex-col-reverse">
          <!-- Dropdown for select SDA -->
          <div class="error error_box" v-if="sdaError!=''">{{ sdaError }}</div>
            <Dropdown
              v-model="assetSelected"
              :options="assetList"
              placeholder="Select SDA to distribute"
              :style="{'width':'100%'}"
              :filter="true"
              :filterFields="['label']"
              optionLabel="text"
              option-disabled="disabled"
              :showClear="true"
            >
              <template  #value="slotProps">
                <div v-if="slotProps.value">
                  <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{slotProps.value.label}} <span class="text-tsm text-gray-400"> ({{Helper.toCurrencyFormat(slotProps.value.amount,slotProps.value.divisibility)}})</span></div>
                </div>
                <span v-else>
                  {{slotProps.placeholder}}
                </span>
              </template>
              <template #option="slotProps">
                <div style="display: flex;justify-content: space-between;">
                  <span class="text-sm">{{slotProps.option.label}}</span>
                  <span class="text-tsm text-gray-500">Balance:{{Helper.toCurrencyFormat(slotProps.option.amount,slotProps.option.divisibility)}}</span>
                </div>
              </template>
            </Dropdown>
          <label class="font-medium text-gray-400" for="floatingSelect">Sirius Digital Asset</label>
        </div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <!-- Dropdown for aggregate number -->
        <div class="flex flex-col-reverse">
          <Dropdown v-model="aggregateNum" :options="aggregateOption" :style="{'width':'100%'}" optionLabel="label" optionValue="value" />
          <label class="font-medium text-gray-400" for="floatingSelect">Transactions per aggregate</label>
        </div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <div class="border rounded-md border-gray-200 mb-3 w-full">
          <input type="file" class="form-control" @change="loadCSV" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload">
        </div>
        <div class="error error_box" v-if="recipientError!=''">{{ recipientError }}</div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <div v-if="fileError" class="error error_box" role="alert">
          Invalid file
        </div>
        
        <div v-if="assetNotEnough" class="error error_box" role="alert">
          Total distribution amount exceed selected asset amount (need {{ totalDistributeAmount }})
        </div>
        <div v-if="assetWrongDivisibility" class="error error_box" role="alert">
          {{ assetWrongDivisibility }}
        </div>
      </div>
    </div>
    <div class="p-2 overflow-auto" v-if="distributionList.length">
      <div>
        <div class="table table-auto w-full">
          <div class="table-header-group">
            <div class="table-row">
              <div class="table-cell border-b-2 font-semibold p-4 pt-0 pb-3">Recipient (Public Key or Address)</div>
              <div class="table-cell border-b-2 font-semibold p-4 pt-0 pb-3">Amount</div>
              <div class="table-cell border-b-2 font-semibold p-4 pt-0 pb-3">Message</div>
            </div>
          </div>
          <div class="table-row-group">
            <div class="table-row" v-for="row, index in distributionList" :key="index">
              <div class="table-cell border-b p-4 pt-0 pb-3">{{ row.publicKeyOrAddress }}</div>
              <div class="table-cell border-b p-4 pt-0 pb-3">{{ row.amount }}</div>
              <div class="table-cell border-b p-4 pt-0 pb-3">{{ row.message }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-2">
      <div class="mb-3 w-full px-2 py-1">
        <div class='font-semibold'>Enter your password to continue</div>
        <PasswordInput  :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')" :showError="showPasswdError" v-model="walletPassword" icon="lock" class="mt-5 mb-3" :disabled="disablePassword"/>
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <button type="button" @click="distribute()" v-if="!distributing" :disabled="distributing && !distributeDone" class="blue-btn px-3 py-3 text-md">Distribute</button>
        <button v-if="distributing" class="blue-btn px-3 py-3 text-md flex items-center" type="button" disabled>
          <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Distributing...
        </button>
        <div v-if="distributionError" class="font-semibold text-red-600 mt-2" role="alert">
          {{ distributionError }}
        </div>
        <div v-if="distributeDone" class="font-semibold text-red-600 mt-2" role="alert">
          Distribution Done
        </div>
      </div>
    </div>
    <div class="p-2 overflow-auto" v-if="txnsHash.length">
      <div>
        <div class="table w-full">
          <div class="table-header-group">
            <div class="table-row">
              <div class="table-cell border-b-2 p-4 pt-0 pb-3">Transaction Hash</div>
            </div>
          </div>
          <div class="table-row-group">
            <div class="table-row" v-for="txnHash, index in txnsHash" :key="index">
              <div class="table-cell border-b p-4 pt-0 pb-3"><a :href="createTxnExplorerLink(txnHash)" target="_blank">{{ txnHash }}</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}



</style>
