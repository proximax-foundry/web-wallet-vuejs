<script setup lang="ts">
import { ref, watch, computed, getCurrentInstance } from 'vue'
import { 
  PublicAccount, NetworkType, MosaicId, Account,
  AccountHttp, MosaicHttp, Convert, Address
} from 'tsjs-xpx-chain-sdk';

import { SimpleSDA } from '@/models/sda'
// import {parse} from 'csv-parse'
import {sum} from 'mathjs'
import {DistributeListInterface, Sirius} from "@/models/sirius"
import { AppState } from '@/state/appState';
import {networkState} from "@/state/networkState";
import * as mathjs from "mathjs"
import { walletState } from '@/state/walletState';
import Dropdown from 'primevue/dropdown';
import { multiSign } from "@/util/multiSignatory";
import { Helper } from '@/util/typeHelper';
import { TransactionUtils } from '@/util/transactionUtils';
import { WalletUtils } from '@/util/walletUtils';
import {useI18n} from 'vue-i18n'
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInputAccount from "@/components/SelectInputAccount.vue";

const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;

const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
const cosignerBalanceInsufficient = ref(false);
const disableAllInput = ref(false);
const cosignAddress = ref("");
const showPasswdError = ref(false);
const disablePassword = computed(() => disableAllInput.value);
const walletPassword = ref("");
const {t} = useI18n();
const err = ref('');
const distributePublicKey = ref("");
let intiatorPrivateKey = ref('');

let api = "https://api-2.testnet2.xpxsirius.io";
let explorerURL = "https://bctestnetexplorer.xpxsirius.io";
let accountHttp = new AccountHttp(api);
let mosaicHttp = new MosaicHttp(api);
// let data = reactive<DataInterface>({
//   assetList: []
// });

let assetList = ref<SimpleSDA[]>([]);
let assetSelected = ref("");
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
  // console.log(selectedAccount.value.publicKey)
  // console.log(selectedAccount.value)
  noAssetFound.value = false;
  assetSelected.value = "";
  let assets = await Sirius.scanAsset(selectedAccount.value.publicKey);

  assetList.value = assets;

  if(assets.length === 0){
    noAssetFound.value = true;
  }
}

let distribute = async()=>{
  distributionError.value = "";
  distributeDone.value = false;
  if(distributing.value){
    return;
  }

  if(assetNotEnough.value || assetWrongDivisibility.value){
    return;
  }
  else if(assetSelected.value === ""){
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

  let selectedSda = assetList.value.find(x => x.id === assetSelected.value);
  let aggregateTxns = Sirius.createDistributeAggregateTransactions(selectedAccount.value.publicKey, distributionList.value, aggregateNum.value, selectedSda!);
  let totalAggregateTxnsFee = sum(aggregateTxns.map(x=> x.maxFee.compact()));
  let totalInitiatorFee = sum(totalLockHashFee, totalLockHashToken, totalAggregateTxnsFee);
  let xpxNeeded = totalInitiatorFee / Math.pow(10, AppState.nativeToken.divisibility);
  const passwordInstance = WalletUtils.createPassword(walletPassword.value);
  let selectedCosign;
  if (isMultiSigBool.value) {
   let selectedCosignList = getWalletCosigner.value.cosignerList;
   if (selectedCosignList.length > 1) {
      selectedCosign = cosignAddress.value;
    } else {
      selectedCosign = walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==selectedCosignList[0].publicKey).address
    }
   }
  let initiatorAcc;
  if(!selectedCosign){
    initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedAccount.value.address);
  }else{
    initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedCosign)
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
        let data = lineData.split(",");
        distResultCsvData.push({
          publicKeyOrAddress: data[0],
          amount: data[1]
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
            amount: amount
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

let checkDistributorAssetAmount = (selectedAssetId: string)=>{
  if(selectedAssetId){
    let data = assetList.value.find(x => x.id === selectedAssetId);

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

let checkDistributorAssetAmountDecimal = (selectedAssetId: string)=>{
  if(selectedAssetId){
    let data = assetList.value.find(x => x.id === selectedAssetId );

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
interface Account{
  name: string,
  balance: number,
  publicKey: string,
  address: string,
  type?: string,
  encrypted?: string,
  iv?: string,
  isMultisig: boolean
}
const selectedAccount = ref<Account[]>([])

const accounts = computed(
      () => {
        if(walletState.currentLoggedInWallet){
          if(walletState.currentLoggedInWallet.others){
          const accounts = walletState.currentLoggedInWallet.accounts.map((acc)=>{
            return {
              name: acc.name,
              balance: acc.balance,
              publicKey: acc.publicKey,
              address: acc.address,
              encrypted: acc.encrypted,
              iv: acc.iv,
              isMultisig: acc.getDirectParentMultisig().length ? true: false
            }
          })
          const otherAccounts = walletState.currentLoggedInWallet.others.map((acc)=>{
            return {
              name: acc.name,
              balance: acc.balance,
              publicKey: acc.publicKey,
              address: acc.address,
              type: acc.type,
              isMultisig: true
            }
          }).filter(item => {
            return item.type !== "DELEGATE";
          })
          const concatOther = accounts.concat(otherAccounts)
          return concatOther
          }else{
            const accounts =  walletState.currentLoggedInWallet.accounts.map((acc)=>{
                return {
                name: acc.name,
                balance: acc.balance,
                publicKey: acc.publicKey,
                address: acc.address,
                encrypted: acc.encrypted,
                iv: acc.iv,
                isMultisig: acc.getDirectParentMultisig().length ? true: false
                }
            });
            return accounts
          }
        }else{
            return null
        }
      }
    );

  selectedAccount.value = accounts.value[0]
  scanDistributorAsset()
  const currentAccount = ref(selectedAccount.value.address)

  const isMultiSig = (address) => {
  const account = accounts.value.find(
    (account) => account.address === address
  );
  let isMulti = false;
     
  if (account != undefined) {
    isMulti = account.isMultisig;
  }
  return isMulti;
};
const isMultiSigBool = computed(() => {
      return isMultiSig(selectedAccount.value.address)
  }
)

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
      if(networkState.currentNetworkProfileConfig){
      let cosigners= multiSign.getCosignerInWallet(accounts.value.find(acc=>acc.address==selectedAccount.value.address)?accounts.value.find(acc => acc.address == selectedAccount.value.address).publicKey:'')
      let list =[]
      
      cosigners.cosignerList.forEach(publicKey=>{
        list.push({publicKey:publicKey,name:findAcc(publicKey).name,balance:findAcc(publicKey).balance })
      })
      cosigners.cosignerList = list
      return cosigners
      }else{
        return {hasCosigner:false,cosignerList:[]}
      }
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
    // if (findAccWithAddress(cosignAddress.value).balance < lockFundTotalFee.value + Number(effectiveFee.value) ) {
    //   disableAllInput.value = true;
    //   cosignerBalanceInsufficient.value = true;
    // } else {
      disableAllInput.value = false;
      cosignerBalanceInsufficient.value = false;
    // }
  } else {
    disableAllInput.value = true;
  }
}

const clearInput = () => {
      walletPassword.value = "";
    };

  watch(assetSelected, (value) => {
    checkDistributorAssetAmount(value);
    checkDistributorAssetAmountDecimal(value);
  });

  watch(totalDistributeAmount, (value) => {
    checkDistributorAssetAmount(assetSelected.value);
    checkDistributorAssetAmountDecimal(assetSelected.value);
  });

  emitter.on("select-account", (address) => {
    for (let i = 0; i < accounts.value.length; i++){
      if (accounts.value[i].address == address){
        selectedAccount.value = accounts.value[i]
        scanDistributorAsset()
        currentAccount.value = ref(selectedAccount.value.address)
      }
    }
  })
</script>

<template>
  <div class="container">
    <div class="p-2">
      <div class="flex flex-col">
        <SelectInputAccount v-model="currentAccount" :selectDefault="currentAccount"/>
        <div v-if="isMultiSigBool" class="text-left mt-2 mb-5 ml-4">
          <div v-if="getWalletCosigner.cosignerList.length > 0">
              <div class="text-tsm">
                {{$t('general.initiateBy')}}:
                <span class="font-bold" v-if="getWalletCosigner.cosignerList.length == 1"> 
                  {{ getWalletCosigner.cosignerList[0].name }} ({{$t('general.balance')}}:{{  getWalletCosigner.cosignerList[0].balance }} {{ currentNativeTokenName }})
                </span>
                <span class="font-bold" v-else>
                  <select class="" v-model="cosignAddress">
                    <option v-for="(element, item) in  getWalletCosigner.cosignerList" :value="findAcc(element.publicKey).address" :key="item">
                      {{ element.name }} ({{$t('general.balance')}}: {{ element.balance }} {{ currentNativeTokenName }})
                    </option>
                  </select>
                </span>
                <div v-if="cosignerBalanceInsufficient" class="error">
                  {{$t('general.insufficientBalance')}}
                </div>
              </div>
            </div>
            <div class="error" v-else>
             {{$t('general.noCosigner')}} 
            </div>
        </div>
        <div v-if="noAssetFound" class="error error_box" role="alert">
          No SDA found
        </div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <div class="flex flex-col-reverse">
          <div class="error error_box" v-if="sdaError!=''">{{ sdaError }}</div>
          <select class="w-3/4" v-model="assetSelected" aria-label="Floating label select example">
            <option value="" selected>Select SDA to distribute</option>
                      <option v-for='asset, index in assetList' :key='index' :value="asset.id">
                        {{ asset.amount }} - {{ asset.label }}
                      </option>
          </select>
          <label class="font-medium text-gray-400" for="floatingSelect">Sirius Digital Asset</label>
        </div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <div class="flex flex-col-reverse">
          <select class="w-3/4" v-model="aggregateNum" aria-label="Floating label select example">
            <option value="5" >5</option>
            <option value="10" >10</option>
            <option value="15" >15</option>
            <option value="20" >20</option>
          </select>
          <label class="font-medium text-gray-400" for="floatingSelect">Transactions per aggregate</label>
        </div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <div class="border rounded-md border-gray-200 mb-3 w-3/4">
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
        <div class="table w-3/4">
          <div class="table-header-group">
            <div class="table-row">
              <div class="table-cell border-b-2 font-semibold p-4 pt-0 pb-3">Recipient (Public Key or Address)</div>
              <div class="table-cell border-b-2 font-semibold p-4 pt-0 pb-3">Amount</div>
            </div>
          </div>
          <div class="table-row-group">
            <div class="table-row" v-for="row, index in distributionList" :key="index">
              <div class="table-cell border-b p-4 pt-0 pb-3">{{ row.publicKeyOrAddress }}</div>
              <div class="table-cell border-b p-4 pt-0 pb-3">{{ row.amount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-2">
      <div class="mb-3 w-3/4 px-2 py-1">
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
        <div class="table w-3/4">
          <div class="table-header-group">
            <div class="table-row">
              <div class="table-cell border-b-2 p-4 pt-0 pb-3">Transaction Hash</div>
            </div>
          </div>
          <div class="table-row-group">
            <div class="table-row" v-for="txnHash, index in txnsHash" :key="index">
              <div class="table-cell border-b p-4 pt-0 pb-3"><a :href="createTxnExplorerLink(txnHash)" >{{ txnHash }}</a></div>
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
