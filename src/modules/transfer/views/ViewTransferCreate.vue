<template>
<div>
  <AddContactModal :toggleModal="togglaAddContact" :saveAddress="recipientInput" />
  <ConfirmSendModal :toggleModal="toggleConfirm" />
  <div class='w-10/12 ml-auto mr-auto mt-5'>
    <div class="border filter shadow-lg lg:grid lg:grid-cols-3" >
      <div class="lg:col-span-2 py-6 px-6">
        <div class="text-sm font-semibold ">{{$t('transfer.newTransfer')}}</div>
        <div class=" error error_box mb-5" v-if="err!=''">{{ err }}</div>
        <div class="mt-4"/>
        <SelectInputSender  v-model="selectedAccAdd" :selectDefault="selectedAccAdd"/>
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
             {{$t('general.initiateBy')}} 
            </div>
          </div>
        <div class="flex mt-3 gap-1">
          <AddressInputClean :placeholder="$t('transfer.transferPlaceholder')" v-model="recipientInput" v-debounce:1000="checkRecipient" :showError="showAddressError" :disabled="disableRecipient"/>
          <div @click="toggleContact=!toggleContact" class=' border rounded-md cursor-pointer flex flex-col justify-around p-2 ' >
            <font-awesome-icon icon="id-card-alt" class=" text-blue-primary ml-auto mr-auto "></font-awesome-icon>
            <div class='text-xxs text-blue-primary font-semibold uppercase'>{{$t('general.select')}}</div>
          </div>
        </div>
        <div v-if="toggleContact" class=" border ">
          <div class='text-xxs text-gray-300 font-semibold py-2 px-2 uppercase'>{{$t('general.importFromAB')}}</div>
          <div v-for="(item, number) in contacts" :key="number" class="cursor-pointer">
            <div @click="recipientInput=item.value;toggleContact=false" class="flex justify-center">
              <div v-if="number%2==0" class="text-xs py-2 bg-gray-100 pl-2 w-full">{{item.label}}</div>
              <div v-if="number%2==1" class="text-xs py-2 pl-2 w-full">{{item.label}}</div>
              <div v-if="number%2==0" class="ml-auto pr-2 text-xxs py-2 font-semibold text-blue-primary bg-gray-100 uppercase">{{$t('general.select')}}</div>
              <div v-if="number%2==1" class="ml-auto mr-2 text-xxs py-2 font-semibold text-blue-primary uppercase">{{$t('general.select')}}</div>
            </div>
          </div>
        </div>
        <div v-for="(mosaic, index) in mosaicsCreated" :key="index">
          <MosaicInput :placeholder="$t('transfer.selectAsset')" errorMessage="" v-model="selectedMosaic[index].id" :index="index" :options="mosaics" :disableOptions="selectedMosaic" @show-mosaic-selection="updateMosaic" @remove-mosaic-selected="removeMosaic"/>
          <TransferInputClean v-if="selectedMosaic[index].id != 0" v-model="selectedMosaic[index].amount" :balance="getSelectedMosaicBalance[index]" :placeholder="$t('transfer.assetAmount')" type="text" :showError="showAssetBalanceErr[index]" :errorMessage="$t('general.insufficientBalance')" :decimal="mosaicSupplyDivisibility[index]"  />
        </div>
        <div>
          <button class="my-2 font-semibold text-xs text-blue-primary outline-none focus:outline-none disabled:opacity-50" :disabled="addMosaicsButton || mosaics.length==0" @click="displayMosaicsOption">
           + {{$t('transfer.addAssets')}}
          </button>
        </div>
        <TransferInputClean  v-model="sendXPX" :balance="Number(balance)" :placeholder="$t('transfer.transferAmount')" :logo="true" type="text" :showError="showBalanceErr" :errorMessage="$t('general.insufficientBalance')" :decimal="6"  :disabled="disableSupply"/>
        <TransferTextareaInput :placeholder="$t('general.message')" :errorMessage="$t('general.limitExceed')" v-model="messageText" :remainingChar="remainingChar" :showError="showLimitErr"   :limit="messageLimit" icon="comment" :msgOpt="msgOption" :disabled="disableMsgInput" />
        <div class="mb-5" v-if="!encryptedMsgDisable">
          <input id="encryptedMsg"  type="checkbox" value="encryptedMsg" v-model="encryptedMsg" :disabled="disableEncryptMsg == 1"/>
          <label for="encryptedMsg" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">
            {{$t('transfer.enableEncryption')}}
          </label>
        </div>
      </div>
      <div class='bg-navy-primary p-6 lg:col-span-1'>
        <div class='font-semibold text-xxs text-blue-primary uppercase'>{{$t('general.accCurrentBalance')}}</div>
        <div class="flex my-1 text-white">
          <div class = 'text-md font-bold '>{{splitBalance.left}} </div>
          <div class = 'text-md font-bold ' v-if='splitBalance.right!=null'>.</div>
          <div class='text-xs mt-2 font-bold'>{{splitBalance.right}}</div>
          <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
          <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5 mt-0.5'>
        </div>
         <div class="flex mt-4 text-white">
          <div class='text-xs '>{{$t('transfer.transferAmount')}}</div>
          <div class="text-xs  ml-auto">{{sendXPX}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div class="flex mt-0.5 text-white">
          <div v-if="!isMultiSig(selectedAccAdd)" class='text-xs '>{{$t('general.transactionFee')}}</div>
          <div v-else class='text-xs '>{{$t('general.aggregateFee')}}</div>
          <div class="text-xs  ml-auto">{{effectiveFee}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div v-if="isMultiSig(selectedAccAdd) " class='border-b-2 border-gray-600 my-2'/>
        <div v-if="isMultiSig(selectedAccAdd) " class="flex  text-white">
          <div class='text-xs '>{{$t('general.lockFund')}}</div>
          <div class="text-xs  ml-auto">{{lockFundCurrency}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div v-if="isMultiSig(selectedAccAdd)" class="flex  text-white">
          <div class='text-xs '>{{$t('general.lockFundTxFee')}}</div>
          <div class="text-xs  ml-auto">{{lockFundTxFee}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div class='border-b-2 border-gray-600 my-2'/>
        <div class="flex text-white">
          <div class=' font-bold text-xs uppercase'>{{$t('general.total')}}</div>
          <div class="text-xs  ml-auto">{{totalFee}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div class="mt-5"/>
        <div class='font-semibold text-xs text-white mb-1.5'>{{$t('general.enterPasswordContinue')}}</div>
        <PasswordInput  :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')" :showError="showPasswdError" v-model="walletPassword" icon="lock" class="mt-5 mb-3" :disabled="disablePassword"/>
        <button type="submit" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" :disabled="disableCreate" @click="makeTransfer()">
            {{$t('general.transfer')}}
          </button>
        <div class="text-center">
          <router-link :to="{name: 'ViewDashboard'}" class="content-center text-xs text-white underline" >{{$t('general.cancel')}}</router-link>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script >
import { Helper } from "@/util/typeHelper";
import { computed, ref, getCurrentInstance, watch, effect } from "vue";
import TextInput from "@/components/TextInput.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import SelectInputPlugin from "@/components/SelectInputPlugin.vue";
import MosaicInput from "@/modules/transfer/components/MosaicInput.vue";
import SupplyInput from "@/components/SupplyInput.vue";
import TransferTextareaInput from "@/modules/transfer/components/TransferTextareaInput.vue";
import {
  createTransaction,
  makeTransaction,
  enableACT
} from "@/util/transfer"; //getMosaicsAllAccounts
import AddContactModal from "@/modules/transfer/components/AddContactModal.vue";
import ConfirmSendModal from "@/modules/transfer/components/ConfirmSendModal.vue";
import {useI18n} from 'vue-i18n'
import { multiSign } from "@/util/multiSignatory";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { accountUtils } from "@/util/accountUtils";
import { TransactionUtils } from "@/util/transactionUtils";
import { WalletUtils } from "@/util/walletUtils";
import { ChainUtils } from '@/util/chainUtils';
import { NamespaceUtils } from '@/util/namespaceUtils';
import SelectInputSender from "@/modules/transfer/components/SelectInputSender.vue";
import AddressInputClean from "@/modules/transfer/components/AddressInputClean.vue"
import TransferInputClean from "@/modules/transfer/components/TransferInputClean.vue"
import { AppState } from '@/state/appState';

import { Address } from 'tsjs-xpx-chain-sdk';
import { useRouter } from 'vue-router';
export default { 
  name: "ViewTransferCreate",
  components: {
    AddressInputClean,
    SelectInputSender,
    TransferInputClean,
    TransferTextareaInput,
    PasswordInput,
    AddContactModal,
    ConfirmSendModal,
    MosaicInput
  },
  setup() {
    const router = useRouter()
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const toggleContact = ref(false)
    const {t} = useI18n();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const showContactSelection = ref(false);
    const showAssetBalanceErr = ref([])
    const selectContact = ref("0");
    const recipientInput = ref("");
    const msgOption = ref("regular");
    const messageText = ref("");
    const walletPassword = ref("");
    const err = ref("");
    const showMenu = ref(false);
    const encryptedMsg = ref("");
    const togglaAddContact = ref(false);
    const selectedMosaic = ref([]);
    const mosaicsCreated = ref([]);
    const mosaicsSelected = ref([]);
    const selectedMosaicAmount = ref([]);
    const mosaicSupplyDivisibility = ref([]);
    const currentlySelectedMosaic = ref([]);
    const sendXPX = ref("0");
    const encryptedMsgDisable = ref(true);
    const toggleConfirm = ref(false);
    const forceSend = ref(false);
    
    const cosignAddress = ref("");
    const disableAllInput = ref(false);
    const disableRecipient = computed(() => disableAllInput.value);
    const disableSupply = computed(() => disableAllInput.value);
    const disableRegularMsg = computed(() => disableAllInput.value);
    const disableHexMsg = computed(() => disableAllInput.value);
    const disableEncryptMsg = computed(() => disableAllInput.value);
    const disableMsgInput = computed(() => disableAllInput.value);
    const disablePassword = computed(() => disableAllInput.value);
    const cosignerBalanceInsufficient = ref(false);
    const namespace = ref('');
    const networkType = AppState.networkType;
    const chainAPIEndpoint = computed(()=> ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
    const walletName = walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.name : ''
    const currencyName = computed(
      () => networkState.currentNetworkProfile.network.currency.name
    );
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
   
    const messageLimit = computed(
      () => networkState.currentNetworkProfileConfig.maxMessageSize - 1
    );
    const addressPatternShort = "^[0-9A-Za-z]{40}$";
    const addressPatternLong = "^[0-9A-Za-z-]{46}$";
    const remainingChar = ref(0);
    const showAddressError = ref(true);
    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const showLimitErr = ref(false);
    
    
    const selectedAccName = ref(
      walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.selectDefaultAccount().name : ''
    );
    const selectedAccAdd = ref(
      walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.selectDefaultAccount().address : ''
    );
    const findAcc = (publicKey)=>{
      return walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==publicKey)
    }

    const findAccWithAddress = address =>{
      return walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==address)
    }
    
    const accounts = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return [];
      }
      let accounts = walletState.currentLoggedInWallet.accounts.map(
        (acc)=>{ 
          return { 
            name: acc.name,
            balance: acc.balance,
            address: acc.address,
            publicKey: acc.publicKey,
            isMultisig: acc.getDirectParentMultisig().length ? true: false
          }; 
        });
        
       
       let otherAccounts =walletState.currentLoggedInWallet.others.filter((acc)=> acc.type === "MULTISIG").map(
        (acc)=>{ 
          return { 
            name: acc.name,
            balance: acc.balance,
            address: acc.address,
            publicKey: acc.publicKey,
            isMultisig: true
          }; 
        });
        return accounts.concat(otherAccounts);
      
    });
     const getWalletCosigner = computed(() =>{
      let cosigners= multiSign.getCosignerInWallet(accounts.value.find(acc=>acc.address==selectedAccAdd.value).publicKey)
      let list =[]
      
      cosigners.cosignerList.forEach(publicKey=>{
        list.push({publicKey:publicKey,name:findAcc(publicKey).name,balance:findAcc(publicKey).balance })
      })
      cosigners.cosignerList = list
      return cosigners
    })
    
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
    const isMultiSigBool = ref(
          isMultiSig(
            selectedAccAdd.value
          )
        );

    const effectiveFee = ref(isMultiSigBool.value?makeTransaction.calculate_aggregate_fee(
      messageText.value,
      sendXPX.value,
      selectedMosaic.value
    ) :makeTransaction.calculate_fee(
      messageText.value,
      sendXPX.value,
      selectedMosaic.value
    ))
    if (isMultiSigBool.value) {
      let cosigner = getWalletCosigner.value.cosignerList
      if (cosigner.length > 0) {
        cosignAddress.value = walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==cosigner[0].publicKey).address 
        if (findAccWithAddress(cosignAddress.value).balance < lockFundTotalFee.value + Number(effectiveFee.value) ) {
          disableAllInput.value = true;
          cosignerBalanceInsufficient.value = true;
        } else {
          disableAllInput.value = false;
          cosignerBalanceInsufficient.value = false;
        }
      } else {
        disableAllInput.value = true;
      }
    }
    
    const balance = computed(() => {
        if (walletState.currentLoggedInWallet) {
          if (accounts.value.find((element) => element.address === selectedAccAdd.value) == undefined){
            return 0 
          }else{
            return accounts.value.find((element) => element.address === selectedAccAdd.value).balance
          }
        } else {
          return 0;
        }
      });
    const splitBalance = computed(()=>{
      let accBalance = Helper.toCurrencyFormat(balance.value, AppState.nativeToken.divisibility)
      let split = accBalance.split(".")
      if (split[1]!=undefined){
        return {left:split[0],right:split[1]}
      }else{
        return {left:split[0], right:null}
      }
    })
   
   
    const moreThanOneAccount = computed(() => {
      return accounts.value.length> 1;
    });
 
    const contacts = computed(() => {
      if(!walletState.currentLoggedInWallet){
        return [];
      }
      const wallet = walletState.currentLoggedInWallet;
      var contact = [];
      accounts.value.forEach((element) => {
        contact.push({
          value: Address.createFromRawAddress(element.address).pretty() ,
          label: element.name + " - "+t('general.ownerAcc'),
        });
      });
      if (wallet.contacts != undefined) {
        wallet.contacts.forEach((element) => {
          contact.push({
            value: Address.createFromRawAddress(element.address).pretty(),
            label: element.name + " - "+t('general.contact'),
          });
        });
      }
      return contact;
     
    });
  
    const clearInput = () => {
      selectContact.value = "0";
      walletPassword.value = "";
      recipientInput.value = "";
      encryptedMsgDisable.value = true;
      messageText.value = "";
      sendXPX.value = "0";
      emitter.emit("CLEAR_SELECT", 0);
      selectedMosaic.value = [];
      mosaicsCreated.value = [];
      selectedMosaicAmount.value = [];
      mosaicSupplyDivisibility.value = [];
      showContactSelection.value = false;
    };
    const clearMsg = () => {
      messageText.value = "";
      emitter.emit("CLEAR_TEXTAREA", 0);
    };
  
  const updateAdd = (e) => {
    recipientInput.value = e;
  };
  const makeTransfer = async() => {
    if (sendXPX.value == "0" && !forceSend.value) {
      toggleConfirm.value = true;
    } else {
      
      let selectedCosign;
      if (isMultiSigBool.value) {
        
        let selectedCosignList = getWalletCosigner.value.cosignerList;
        if (selectedCosignList.length > 1) {
          selectedCosign = cosignAddress.value;
        } else {
          selectedCosign = walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==selectedCosignList[0].publicKey).address
        }
      }
      let transferStatus = await createTransaction(
        recipientInput.value.toUpperCase(),
        sendXPX.value,
        messageText.value,
        selectedMosaic.value,
        mosaicSupplyDivisibility.value,
        walletPassword.value,
        selectedAccAdd.value,
        selectedCosign,
        encryptedMsg.value
      );
      if (!transferStatus) {
        err.value = t('general.walletPasswordInvalid',{name : walletState.currentLoggedInWallet.name});
      } else {
        
        err.value = "";
       
        if (!accountUtils.checkAvailableContact(recipientInput.value)) {
          
          // add new contact
          togglaAddContact.value = true;
        } else {
          router.push({ name: "ViewAccountPendingTransactions",params:{address:selectedAccAdd.value} })
          clearInput();
        }
        forceSend.value = false;
        
      }
    }
  };
 
  const addMosaicsButton = computed(() => {
    if (!disableSupply.value) {
      let account;
      if(!walletState.currentLoggedInWallet){
        account = undefined;
      }else{
        account = walletState.currentLoggedInWallet.accounts.find(
          (element) => element.name == selectedAccName.value) ||
          walletState.currentLoggedInWallet.others.find(
          (element) => element.name == selectedAccName.value)
      }
      
      if (account != undefined) {
        if (account.assets != undefined) {
          if (
            account.assets.length == 0 ||
            mosaicsCreated.value.length == mosaics.value.length
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
      
      return true;
    } else {
      return true;
    }
  });
  const totalFee = computed(()=>{
    let tokenDivisibility = AppState.nativeToken.divisibility
    if(!isMultiSig(selectedAccAdd.value) ){
      if(tokenDivisibility==0){
        return Math.trunc(parseFloat(sendXPX.value.replace(/,/g, '')) + parseFloat(effectiveFee.value))
      }else{
        return Math.round((parseFloat(sendXPX.value.replace(/,/g, '')) + parseFloat(effectiveFee.value))*Math.pow(10,tokenDivisibility))/Math.pow(10,tokenDivisibility)
      }
    }else {
      if(tokenDivisibility== 0){
        return Math.trunc((parseFloat(sendXPX.value.replace(/,/g, '')) + parseFloat(effectiveFee.value)+ lockFundTxFee.value + lockFund.value))
      }else{
        return Math.round((parseFloat(sendXPX.value.replace(/,/g, '')) + parseFloat(effectiveFee.value)+ lockFundTxFee.value + lockFund.value)*Math.pow(10,tokenDivisibility))/ Math.pow(10,tokenDivisibility)
      }
    }
  })

  const showBalanceErr = computed(()=>{
    if(isMultiSigBool.value){
      if (sendXPX.value>balance.value){
        return true
      }else{
        return false
      }
    }else{
      if(totalFee.value > balance.value){
        return true
      }else{
        return false
      }
    }
  })
    const disableCreate = computed(() => {
      return !(
        walletPassword.value.match(passwdPattern) &&
        !showAddressError.value &&
        recipientInput.value.length > 0  &&
        (showAssetBalanceErr.value.every(value => value == false)) &&
        !showBalanceErr.value &&
        !showLimitErr.value

      );
    });

  const mosaics = computed(() => {
    var mosaicOption = [];
    if(!walletState.currentLoggedInWallet){
      return mosaicOption;
    }
    const account = walletState.currentLoggedInWallet.accounts.find(
      (element) => element.name == selectedAccName.value
    ) ||  walletState.currentLoggedInWallet.others.find(
      (element) => element.name == selectedAccName.value)
    if (account.assets.length > 0) {
      account.assets.forEach((i, index) => {
        if(i.namespaceNames!= AppState.nativeToken.fullNamespace){
          mosaicOption.push({
            val: i.idHex,
            text: (i.namespaceNames.length>0?i.namespaceNames:i.idHex) + " >"+t('general.balance') +": " +Helper.amountFormatterSimple(i.amount,i.divisibility),
            id: index + 1,
          });
        }
      });
    }
    return mosaicOption;
  });
  for(let i=0;i<mosaics.value.length;i++){
    showAssetBalanceErr.value.push(false)
  }

  const displayMosaicsOption = () => {
    mosaicsCreated.value.push(0);
    selectedMosaic.value.push({ id: 0, amount: "0" });
  };
  // update mosaic
  const updateMosaic = (e) => {
    // get mosaic info and format divisibility in supply input
    const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address === selectedAccAdd.value) || walletState.currentLoggedInWallet.others.find((account) => account.address === selectedAccAdd.value)
    let mosaic = account.assets.find(
      (asset) => asset.idHex == selectedMosaic.value[e.index].id
    );
    selectedMosaic.value[e.index].amount = "0";
    mosaicSupplyDivisibility.value[e.index] = mosaic.divisibility;
    emitter.emit("CLOSE_MOSAIC_INSUFFICIENT_ERR", false);
  };
  const removeMosaic = (e) => {
    mosaicsCreated.value.splice(e.index, 1);
    selectedMosaic.value.splice(e.index, 1);
    showAssetBalanceErr.value.splice(e.index,1)
    mosaicSupplyDivisibility.value.splice(e.index, 1);
  };
  
  const getSelectedMosaicBalance = (index) => {
    const account = walletState.currentLoggedInWallet.accounts.find(
      (account) => account.address === selectedAccAdd.value) ||
      walletState.currentLoggedInWallet.others.find(
      (account) => account.address === selectedAccAdd.value) 
    let mosaic = account.assets.find(
      (asset) => asset.idHex == mosaics.value[index].val
    );
    
    if (mosaic != undefined) {
      return mosaic.getExactAmount();
    } else {
      return 0;
    }
  };
  
  watch(selectedAccAdd, (n, o) => {
    showAssetBalanceErr.value = []
    for(let i=0;i<mosaics.value.length;i++){
      showAssetBalanceErr.value.push(false)
    }
    isMultiSigBool.value = isMultiSig(n);
    if (isMultiSigBool.value) {
      
        let cosigner = getWalletCosigner.value.cosignerList
        if (cosigner.length > 0) {
          cosignAddress.value = walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey== cosigner[0].publicKey).address;
          if (cosigner[0].balance < lockFundTotalFee.value) {
            disableAllInput.value = true;
          } else {
            disableAllInput.value = false;
          }
        } else {
          disableAllInput.value = true;
        }
    }
    else {
      disableAllInput.value = false;
    }   
  })
  
  watch(cosignAddress, (n, o) => {
    if (n != o) {
        if (
        accounts.value.find((element) => element.address == n).balance <
        lockFundTotalFee.value + Number(effectiveFee.value)
      ) {
        cosignerBalanceInsufficient.value = true;
        disableAllInput.value = true;
      } else {
        cosignerBalanceInsufficient.value = false;
        disableAllInput.value = false
      }
      
    }
  });
 
  watch(recipientInput,n=>{
    checkEncryptable(n);
    if(n.length==40 || n.length==46){
      checkEncryptable(n);
      checkRecipient()
    }else{
      showAddressError.value = true
    }
  })
  const checkRecipient = () =>{
    if(!walletState.currentLoggedInWallet){
        return;
    }
    try {
      let recipientAddress = Helper.createAddress(recipientInput.value);
      let networkOk = Helper.checkAddressNetwork(recipientAddress, networkType);
      if(!networkOk){
        showAddressError.value = true;
      }
      else{
        checkEncryptable(recipientInput.value);
        showAddressError.value = false;
      }
    } catch (error) {
      try{
        let namespaceId = Helper.createNamespaceId(recipientInput.value);
        checkNamespace(namespaceId).then((address)=>{
          recipientInput.value = address.plain();
          showAddressError.value = false;
          checkEncryptable(recipientInput.value);
        }).catch((error)=>{
          showAddressError.value = true;
        });
      }
      catch(error){
        /* console.log(error); */
        showAddressError.value = true;
      }
    }
  }
  const checkEncryptable = (add) =>{
    // show and hide encrypted message option
    if (add.match(addressPatternLong) || add.match(addressPatternShort)) {
        accountUtils.verifyPublicKey(recipientInput.value).then(verify =>
        encryptedMsgDisable.value = verify
        ).catch(err=>encryptedMsgDisable.value=true)
    } else {
      encryptedMsgDisable.value = true;
      showAddressError.value=true
    }
  }
  const checkNamespace = async (nsId)=>{
    return await NamespaceUtils.getLinkedAddress(nsId, chainAPIEndpoint.value);
  }
  const updateFee = ()=>{
     effectiveFee.value = isMultiSig(selectedAccAdd.value)? makeTransaction.calculate_aggregate_fee(
        messageText.value,
        sendXPX.value,
        selectedMosaic.value
      ) : makeTransaction.calculate_fee(
        messageText.value,
        sendXPX.value,
        selectedMosaic.value
      );
  }
  watch(selectedAccName, (n, o) => {
    if (n != o) {
      recipientInput.value = "";
      updateFee()
    }
  });
  watch(sendXPX, (n, o) => {
    if (n != o) {
      updateFee()
    }
  });
  
  watch(messageText, (n, o) => {
    if (n != o) {
      updateFee()
      if (encryptedMsg.value && messageText.value) {
        remainingChar.value = TransactionUtils.getFakeEncryptedMessageSize(messageText.value);
      } else {
        remainingChar.value = TransactionUtils.getPlainMessageSize(messageText.value);
      }
    if (messageText.value.length > messageLimit.value || remainingChar.value > messageLimit.value) {
      showLimitErr.value = true;
    }
    else {
      showLimitErr.value = false;
      }
    }
  });
  const getMosaicBalanceById = (id) =>{
    let accAddress = selectedAccAdd.value
    let acc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==accAddress)? walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==accAddress):walletState.currentLoggedInWallet.others.find(acc=>acc.address==accAddress)
    return acc.getAssetBalance(id)
  }
  
  watch(encryptedMsgDisable, (n) => {
    if (!n) {
      encryptedMsg.value = "";
    }
  });
  watch(encryptedMsg, (n) => {
    if (n) {
      if (messageText.value) {
        remainingChar.value = TransactionUtils.getFakeEncryptedMessageSize(messageText.value);
    if (messageText.value.length > messageLimit.value || remainingChar.value > messageLimit.value) {
      showLimitErr.value = true;
    }
    else {
      showLimitErr.value = false;
       }
      }
    } else {
      remainingChar.value = TransactionUtils.getPlainMessageSize(messageText.value);
          if (messageText.value.length > messageLimit.value || remainingChar.value > messageLimit.value) {
      showLimitErr.value = true;
    }
    else {
      showLimitErr.value = false;
      }
    }
  });

   watch(() => [...selectedMosaic.value], (n) => {
     updateFee()
      for(let i = 0; i < n.length; i++){
           if(n[i].amount> getMosaicBalanceById(n[i].id)){
          showAssetBalanceErr.value[i]= true
          }else{
            showAssetBalanceErr.value[i]= false
          }
         
        
      }
    }, {deep:true});
  emitter.on("CLOSE_CONTACT_MODAL", (payload) => {
    togglaAddContact.value = payload;
    clearInput();
  });
  emitter.on("select-account", (address) => {
    selectedAccName.value = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==address)? walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==address).name : walletState.currentLoggedInWallet.others.find(acc=>acc.address==address).name
    selectedAccAdd.value = address;
    selectedMosaic.value = [];
    mosaicsCreated.value = [];
    selectedMosaicAmount.value = [];
    mosaicSupplyDivisibility.value = [];
  });
  
    
  
  // confirm modal
  emitter.on("CLOSE_CONFIRM_SEND_MODAL", (payload) => {
    toggleConfirm.value = payload;
  });
  emitter.on("CONFIRM_PROCEED_SEND", (payload) => {
  
    if (payload) {
      forceSend.value = payload;
      toggleConfirm.value = false;
      makeTransfer();
    }
  });
    return {
      showAssetBalanceErr,
      findAcc,
      totalFee,
      contacts,
      toggleContact,
      splitBalance,
      moreThanOneAccount,
      showMenu,
      selectedAccName,
      selectedAccAdd,
      showAddressError,
      balance,
      showBalanceErr,
      err,
      /* contact, */
      recipientInput,
      namespace,
      sendXPX,
      messageText,
      msgOption,
      showContactSelection,
      selectContact,
      walletPassword,
      disableCreate,
      clearInput,
      showPasswdError,
      updateAdd,
      addMosaicsButton,
      clearMsg,
      accounts,
      encryptedMsgDisable,
      encryptedMsg,
      makeTransfer,
      togglaAddContact,
      displayMosaicsOption,
      selectedMosaic,
      mosaicsCreated,
      mosaicsSelected,
      mosaics,
      selectedMosaicAmount,
      getSelectedMosaicBalance,
      mosaicSupplyDivisibility,
      updateMosaic,
      currentlySelectedMosaic,
      removeMosaic,
      toggleConfirm,
      isMultiSig,
      isMultiSigBool,
      effectiveFee,
      cosignAddress,
      getWalletCosigner,
      disableRecipient,
      checkRecipient,
      disableSupply,
      disableRegularMsg,
      disableHexMsg,
      disableEncryptMsg,
      disableMsgInput,
      disablePassword,
      cosignerBalanceInsufficient,
      messageLimit,
      remainingChar,
      lockFundCurrency,
      currencyName,
      lockFundTxFee,
      lockFundTotalFee,
      walletName,
      checkNamespace,
      currentNativeTokenName,
      showLimitErr
    };
  },
};
</script>
<style scoped lang="scss">
.slide-enter-active {
  -moz-transition-duration: 1s;
  -webkit-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}
.slide-leave-active {
  -moz-transition-duration: 1s;
  -webkit-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
  -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}
.slide-enter-to,
.slide-leave-from {
  max-height: 1000px;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
.optionDiv:hover {
  background: #d9ebff;
}
</style>