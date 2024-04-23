<template>
<div>
  
  <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
    <AccountComponent :address="address" class="mb-6"/>
    <AccountTabs :address="address" selected="details"/>
    <div class="border-2 border-t-0 filter shadow-lg lg:grid lg:grid-cols-3" >
      <div class="lg:col-span-2 py-6 pr-6">
        <div class='pl-6'>
           <div class=" error error_box mb-5" v-if="err!=''">{{ err }}</div>
        </div>
         <div v-if="isMultisig" class="text-left mt-2 mb-5 ml-6"> 
            <div v-if="walletCosignerList.length > 0">
              <div class="text-tsm">
                {{$t('general.initiateBy')}}:
                <span class="font-bold" v-if="walletCosignerList.length == 1"> 
                  {{ walletCosignerList[0].name }}
                </span>
                <span class="font-bold" v-else>
                  <select class="" v-model="selectedCosignPublicKey">
                    <option v-for="(element, item) in  walletCosignerList" :value="findAcc(element.publicKey).publicKey" :key="item">
                      {{ element.name }} 
                    </option>
                  </select>
                </span>
              </div>
            </div>
          </div>
        <div v-if="!delegateValue">
          <div class="text-xs font-semibold pl-6">{{$t('general.delegate')}}</div>
          <div class="text-xxs pl-6 mt-2">{{$t('delegate.notLinked')}}</div>
          <div class="mt-4"></div>
          <div class="ml-6 my-7 gray-line"/>
          <div class="pl-6">
            <div class = 'text-xs text-blue-primary mt-0.5 font-semibold uppercase'>{{$t('general.privateKey')}}</div>
            <div class="flex">
              <div id="private" class="truncate text-xs mt-1 font-semibold" type="text" :copyValue="privateKey" :copySubject="$t('general.privateKey')">{{privateKey}}</div>
              <font-awesome-icon :title="$t('general.copy')" icon="copy" @click="copy('private')" class="ml-2 pb-1 w-5 h-5 text-blue-link mt-0.5 cursor-pointer "></font-awesome-icon>
            </div>
            <div class = 'text-txs mt-1 text-red-400 border px-1.5 py-2 border-red-400 rounded-md'>{{$t('general.pkWarning')}}</div>
          </div>
        </div>
        <div v-else>
          <div class="text-xs font-semibold pl-6">{{$t('delegate.accDelegated')}}</div>
          <div class="ml-6 px-3 py-2 mt-3 bg-green-100">
            <img src='@/assets/img/icon-blue-tick.svg' class='h-3 w-3 inline-block mr-2'>
            <div class="text-xs  mt-2 inline-block">{{$t('delegate.linked')}}</div>
          </div>
          
          <div class="border border-blue-300 rounded-md ml-6 p-3 mt-3 bg-blue-50 overflow-x-auto">
            <div class="text-xs inline-block">{{$t('delegate.publicKeyOfDelegate')}}</div>
            <font-awesome-icon icon="copy" @click="copy('delegatePublicKey')" :title="$t('general.copy')" class="inline-block float-right mt-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
            <div class="text-xs mt-0.5 font-semibold" id="delegatePublicKey" :copyValue="delegateAcc" :copySubject="$t('delegate.delegatePublicKey')">{{delegateAcc}}</div>
          </div>
        </div>
      </div>
      <div class='bg-navy-primary p-6 lg:col-span-1'>
        <TransactionFeeDisplay :fund-status="fundStatus" :is-multisig="isMultisig" :is-cosigner="isCosigner" :on-partial="onPartial" :transaction-fee="transactionFee" :total-fee-formatted="totalFeeFormatted" :get-multi-sig-cosigner="getMultiSigCosigner" :check-cosign-balance="checkCosignBalance" :lock-fund-currency="lockFund" :lock-fund-tx-fee="lockFundTxFee" :balance="accBalance" :selected-acc-add="selectedAccAdd"/>
        <div class="mt-5"/>
        <div class="mt-3">
          <button type="submit" class=' w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto'  @click="createDelegate" v-if="delegateValue " :disabled="disableLinkBtn">{{$t('delegate.unlinkAcc')}}</button>
          <button type="submit" class=' w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto'  @click="createDelegate" v-if="!delegateValue " :disabled="disableLinkBtn">{{$t('delegate.delegateAcc')}}</button>
        </div>
        <div class="text-center">
          <router-link :to="{name: 'ViewAccountDetails',params:{address:address}}" class="content-center text-xs text-white underline" >{{$t('general.cancel')}}</router-link>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>

import { ref, computed, getCurrentInstance,watch } from "vue";
import PasswordInput from '@/components/PasswordInput.vue';
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
import { walletState } from '@/state/walletState';
import { WalletUtils } from "@/util/walletUtils";
import { networkState } from "@/state/networkState";
import { ChainAPICall } from "@/models/REST/chainAPICall"
import { ChainUtils } from "@/util/chainUtils"
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { LinkAction, NetworkType, PublicAccount, UInt64 } from "tsjs-xpx-chain-sdk";
import { useI18n } from 'vue-i18n';
import { accountUtils } from "@/util/accountUtils";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { Account } from "tsjs-xpx-chain-sdk";
import { AppState } from '@/state/appState';
import { TransactionUtils, findAcc } from '@/util/transactionUtils';
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import {MultisigUtils} from '@/util/multisigUtils'
import { TransactionState } from "@/state/transactionState";
export default {
  name: 'ViewAccountDelegate',
  components: {
    AccountComponent,
    PasswordInput,
    AccountTabs,
    TransactionFeeDisplay
  },
  props: {
    address: String,
  },
  setup(p) {
    const { t } = useI18n();
    const privKeyPattern = "^(0x|0X)?[a-fA-F0-9].{63,65}$"; 
    let privateKey = ref('')
    let showPrivateKeyError = ref(true)

    const showPasswdError = ref(false);
    const err = ref(false);
    const defaultAcc = walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.selectDefaultAccount(): null
    const selectedAccAdd = ref(defaultAcc?defaultAcc.address:'');
    const accBalance = ref(Helper.toCurrencyFormat(defaultAcc?defaultAcc.balance:0, AppState.nativeToken.divisibility)); 
    const acc = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return null
      }
      let acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == p.address) || walletState.currentLoggedInWallet.others.find((add) => add.address == p.address);
      if(!acc){
        return null
      }
      return acc
    })
    const getCosignerList = () =>{
      if(!acc.value){
        return []
      }
      return MultisigUtils.getCosignerInWallet(acc.value.publicKey).cosignerList;
    }

    const walletCosignerList = computed(() =>{
      let cosigners= getCosignerList()
      let list =[]
      cosigners.forEach(publicKey=>{
        list.push({publicKey:publicKey,name:findAcc(publicKey).name,balance:findAcc(publicKey).balance })
      })
      return list
    })
    const isCosigner = computed(() =>{
      if(!acc.value){
        return false
      }
      return (MultisigUtils.getCosignerInWallet(acc.value.publicKey).cosignerList.length>0)?true: false;
    });
    const selectedCosignPublicKey = ref(walletCosignerList.value[0]?walletCosignerList.value[0].publicKey:'')
    
    watch(walletCosignerList,n=>{
      if(n.length){
         selectedCosignPublicKey.value = n[0]?n[0].publicKey:''
      }
    },{deep:true})
    let onPartial = ref(false) 
    const checkIsPartial = ()=>{
       if(!acc.value){
        return 
      }
       MultisigUtils.onPartial(PublicAccount.createFromPublicKey(acc.value.publicKey,AppState.networkType))
       .then(onPartialBoolean => onPartial.value = onPartialBoolean)
       .catch(err=>{
         onPartial.value = false
       })
    }
    checkIsPartial()
   
    const lockFund = computed(()=> {
      if(!networkState.currentNetworkProfileConfig){
        return 0
      }
      return Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, AppState.nativeToken.divisibility)
    })
    const lockFundTxFee = computed(()=>{ 
      if(networkState.currentNetworkProfile){ 
        return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
      }
      return 0;  
    });
    const isMultisig = computed(() => {
      if(!acc.value){
        return false
      }
      let isMulti = acc.value.getDirectParentMultisig().length? true: false
      return isMulti;
    });  
    let transactionFee = computed(()=>{
      return accountUtils.getDelegateFee(isMultisig.value)
      
    })
    

    const totalFee = computed(()=>{
      if(isMultisig.value){ //aggregate bonded
        return transactionFee.value+lockFund.value + lockFundTxFee.value
      }else{
        return transactionFee.value
      }
    })
    const accountBalance = computed(() => {
      if(!acc.value){
        return 0
      }
      return acc.value.balance
    })

   
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const currentNativeTokenDivisibility = computed(()=> AppState.nativeToken.divisibility);
    const accountDisplayBalance = computed(() => {
      if(walletState.currentLoggedInWallet){ 
        if(!isMultisig.value){
           return Helper.toCurrencyFormat(accountBalance.value, currentNativeTokenDivisibility.value);
        }else{
          if(findAcc(selectedCosignPublicKey.value)){
            return  Helper.toCurrencyFormat(findAcc(selectedCosignPublicKey.value).balance, currentNativeTokenDivisibility.value);
          }else{
            return '0'
          }
        }
      }else{
        return '0'
      }
    });
    const fundStatus = computed(()=>{
      var fundStatus = false
      if(isMultisig.value){
        if(findAcc(selectedCosignPublicKey.value)){
          if(findAcc(selectedCosignPublicKey.value).balance<totalFee.value){
            fundStatus = true
          }else{
            fundStatus = false
          }
        }
      }else{
        if(accountBalance.value<totalFee.value){
          fundStatus=true
        }
      }
      return fundStatus
    })


    const splitBalance = computed(()=>{
      let split = accountDisplayBalance.value.split(".")
      if (split[1]!=undefined){
        return {left:split[0],right:split[1]}
      }else{
        return {left:split[0], right:null}
      }
    })
    watch(privateKey,n=>{
      if(!n.match(privKeyPattern)){
        showPrivateKeyError.value = true
      }else{
        showPrivateKeyError.value = false
      }
    })
    //const delegateValue = ref(false);
    
    const delegateAcc = ref('');
    const AccPublicKey = ref("");
    const AccPrivateKey = ref("")
    const router = useRouter();
    const toast = useToast();
    const accAddress = ref(p.address);
    const passwdPattern = "^[^ ]{8,}$";
    const internalInstance = getCurrentInstance();
    const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
    const emitter = internalInstance.appContext.config.globalProperties.emitter;    
    const walletName = walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.name:''
    const disableLinkBtn = computed(() => {
      if(onPartial.value || fundStatus.value || (!isCosigner.value && isMultisig.value) ){
        return true
      }
      else{
        return false
      }
    });
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject + ' '+ t('general.copied'), group: 'br-custom', life: 3000});
    };

    const verifyDelegateAcc = async() => {
      if(!acc.value){
        return 
      }
           
      if (acc.value) {
        const publicAccount = Helper.createPublicAccount(acc.value.publicKey, AppState.networkType); 
        const accountInfo = await chainAPICall.accountAPI.getAccountInfo(publicAccount.address);
     
        delegateAcc.value = accountInfo.linkedAccountKey;
      }
     
    };

    verifyDelegateAcc();
    watch(()=>acc,n=>{
      verifyDelegateAcc()
    },{deep:true})

    const delegateValue = computed(()=>{
      let delegateBoolean = false
      if(delegateAcc.value!=''){
        if(delegateAcc.value === "0".repeat(64)){
          delegateBoolean = false;
        }else if(delegateAcc.value !== "0".repeat(64)){
          delegateBoolean = true;
        }
      }
      return delegateBoolean;
    });

    const generatePrivateKey = async() =>{
          privateKey.value= Account.generateNewAccount(AppState.networkType, networkState.currentNetworkProfileConfig.accountVersion ?? 2).privateKey;
    }
    generatePrivateKey();

    const createDelegate = async() => {
      const account = WalletUtils.createAccountFromPrivateKey(privateKey.value , AppState.networkType, networkState.currentNetworkProfileConfig.accountVersion ?? 2);
      if(account){
        AccPublicKey.value = account.publicKey;
         
        }
      let unsignedTxnPayload = ""
      const txBuilder = AppState.buildTxn
        if (delegateAcc.value !== "0".repeat(64)) { //unlink
          const delegateUnlinkTransaction = txBuilder.accountLinkBuilder() 
          .remoteAccountKey(delegateAcc.value)
          .linkAction(LinkAction.Unlink)
          .build() 
          unsignedTxnPayload = delegateUnlinkTransaction.serialize()
          err.value=""
        } else if (AccPublicKey.value != "") { //link
          const delegateLinkTransaction = txBuilder.accountLinkBuilder() 
          .remoteAccountKey(AccPublicKey.value)
          .linkAction(LinkAction.Link)
          .build()
          unsignedTxnPayload = delegateLinkTransaction.serialize()
          err.value=""
        }
        if(isMultisig.value){
          let selectedCosignAddress = walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == selectedCosignPublicKey.value).address
          TransactionState.selectedAddress = selectedCosignAddress
          TransactionState.selectedMultisigAddress = acc.value.address
        }
        else{
          TransactionState.selectedAddress = acc.value.address
        }
        TransactionState.unsignedTransactionPayload = unsignedTxnPayload
        router.push({ name: "ViewConfirmTransaction"})
    };

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

    const totalFeeFormatted = computed(() => {
      return Helper.amountFormatterSimple(totalFee.value, 0);
    });

    const getMultiSigCosigner = computed(() => {
      if(networkState.currentNetworkProfileConfig){
        let cosigners = MultisigUtils.getCosignerInWallet(accounts.value.find(account => account.address == selectedAccAdd.value)?accounts.value.find(account => account.address == selectedAccAdd.value).publicKey:'');
        let list = [];
        cosigners.cosignerList.forEach( publicKey => {
          list.push({
            publicKey,
            name: findAcc(publicKey).name,
            balance: findAcc(publicKey).balance,
            address: findAcc(publicKey).address
          });
        });

        cosigners.cosignerList = list;
        return cosigners;
      }else{
        return {hasCosigner:false,cosignerList:[]}
      }
      
    });

    const checkCosignBalance = computed(() => {
      let cosignBalance = findAcc(selectedCosignPublicKey.value)?findAcc(selectedCosignPublicKey.value).balance:0;
      return Helper.toCurrencyFormat(cosignBalance,3);
    })
    

    return {
      showPrivateKeyError,
      findAcc,
      privateKey,
      currentNativeTokenName,
      splitBalance,
      isMultisig,
      acc,
      showPasswdError,
      walletState,
      createDelegate,
      verifyDelegateAcc,
      delegateAcc,
      AccPublicKey,
      AccPrivateKey,
      disableLinkBtn,
      copy,
      err,
      walletName,
      delegateValue,
      isCosigner,
      lockFund,
      transactionFee,
      totalFee,
      lockFundTxFee,
      onPartial,
      walletCosignerList,
      selectedCosignPublicKey,
      fundStatus,
      generatePrivateKey,
      totalFeeFormatted,
      selectedAccAdd,
      accBalance,
      getMultiSigCosigner,
      checkCosignBalance
    };
  },
}
</script>
<style> 
    [v-cloak] {
        display: none;
    }
</style>