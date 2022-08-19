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
          <button v-if="!toggleSelection" @click="toggleSelection=!toggleSelection" class='ml-6 w-44 blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto' >{{$t('delegate.selectAccToLink')}}</button>
          <div v-if="toggleSelection && !fromNew && !fromPk">
            <div class='pl-6 text-xs font-semibold'>{{$t('general.selectCreationType')}}</div>
            <div class='mt-3'></div>
            <div class='flex gap-2 ml-6'>
              <div class='border p-6 w-44 cursor-pointer'  @click="fromNew=true">
                <img src="@/modules/wallet/img/icon-add-new.svg" class="ml-auto mr-auto mt-4 mb-3 h-12 w-12 ">
                <div class='text-center text-xs font-semibold'>{{$t('general.createNew')}}</div>
              </div>
              <div class='border p-6 w-44 cursor-pointer' @click="fromPk=true">
                <img src="@/modules/wallet/img/icon-private-key.svg" class=" ml-auto mr-auto mt-4 mb-3 h-12 w-12 ">
                <div class='text-center text-xs font-semibold'>{{$t('general.fromPrivateKey')}}</div>
              </div>
            </div> 
          </div>
          <div v-if="fromPk" class="pl-6">
            <div class="text-xs font-semibold">{{$t('general.fromPrivateKey')}}</div>
            <div class="text-xxs mt-2">{{$t('delegate.enterPk')}}</div>
            <PkInputClean :placeholder="$t('general.privateKey')" class="my-3" v-model="privateKey" :showError="showPrivateKeyError" />
            <div class="text-xs text-blue-primary font-semibold cursor-pointer" @click="fromPk=!fromPk">{{$t('general.back')}}</div>
          </div>
          <div v-if="fromNew" class="pl-6">
            <div class="text-xs font-semibold">{{$t('delegate.newAcc')}}</div>
            <div class="text-xxs my-2">{{$t('delegate.newAccSelected')}}</div>
             <div class="text-xs text-blue-primary font-semibold cursor-pointer" @click="fromNew=!fromNew">{{$t('general.back')}}</div>
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
        <div v-if="!isMultisig" class='font-semibold text-xxs text-blue-primary uppercase'>{{$t('general.accCurrentBalance')}}</div>
        <div v-else class='font-semibold text-xxs text-blue-primary uppercase'>{{$t('general.initiatorCurrentBalance')}}</div>
        <div class='flex text-white'>
          <div class = 'text-md font-bold '>{{splitBalance.left}} </div>
          <div class = 'text-md font-bold' v-if='splitBalance.right!=null'>.</div>
          <div class='text-xs mt-1.5 font-bold'>{{splitBalance.right}}</div>
          <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
          <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
        </div>
        <div v-if="fundStatus" class="mt-2 grid bg-yellow-50 p-3 rounded-md" >
          <div class="flex gap-2">
            <img  src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
            <div class="flex-cols">
               <div class="text-txs">{{$t('general.insufficientBalanceWarning',{tokenName:currentNativeTokenName})}}</div>
               <a v-if="networkType ==168" class="text-xs text-blue-primary font-semibold underline " :href="topUpUrl" target="_blank">{{$t('general.topUp',{tokenName: currentNativeTokenName})}}<img src="@/modules/dashboard/img/icon-new-page-link.svg" class="w-3 h-3 ml-2 inline-block"></a>
            </div>
          </div>
        </div>
        <div v-if="isMultisig && !isCosigner " class="mt-2 bg-yellow-50 p-3 rounded-md mb-2" >
          <div class="flex items-center gap-2">
            <img  src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
            <div class="text-txs">{{$t('general.noCosigner')}}</div>
          </div>
        </div>
        <div v-if="onPartial " class="mt-2 grid bg-yellow-50 p-3 rounded-md" >
          <div class="flex gap-2">
            <img  src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
            <div class="text-txs">{{$t('general.hasPartial')}}</div>
          </div>
        </div>
        <div v-if="!(isMultisig)" class="flex mt-4 text-white">
          <div class='text-xs '>{{$t('general.transactionFee')}}</div>
          <div class="text-xs  ml-auto">{{transactionFee}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div v-if="isMultisig" class="flex mt-4 text-white">
          <div class='text-xs '>{{$t('general.aggregateFee')}}</div>
          <div class="text-xs  ml-auto">{{transactionFee}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div v-if=" isMultisig" class="flex mt-4 text-white">
          <div class='text-xs '>{{$t('general.lockFund')}}</div>
          <div class="text-xs  ml-auto">{{lockFund}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div v-if=" isMultisig" class="flex mt-4 text-white">
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
        <PasswordInput  :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')" :showError="showPasswdError" v-model="walletPassword" />
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
import PkInputClean from '@/modules/account/submodule/delegate/components/PkInputClean.vue';
import { walletState } from '@/state/walletState';
import { WalletUtils } from "@/util/walletUtils";
import { networkState } from "@/state/networkState";
import { ChainAPICall } from "@/models/REST/chainAPICall"
import { ChainUtils } from "@/util/chainUtils"
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { LinkAction, PublicAccount } from "tsjs-xpx-chain-sdk";
import { useI18n } from 'vue-i18n';
import { accountUtils } from "@/util/accountUtils";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { Account } from "tsjs-xpx-chain-sdk";
import { listenerState } from '@/state/listenerState';
import { multiSign } from '@/util/multiSignatory';
import { AppState } from '@/state/appState';
import { TransactionUtils } from '@/util/transactionUtils';
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
export default {
  name: 'ViewAccountDelegate',
  components: {
    AccountComponent,
    PasswordInput,
    PkInputClean,
    AccountTabs
  },
  props: {
    address: String,
  },
  setup(p) {
    const { t } = useI18n();
    const privKeyPattern = "^(0x|0X)?[a-fA-F0-9].{63,65}$"; 
    let privateKey = ref('')
    let showPrivateKeyError = ref(true)
    const walletPassword = ref("");
    const showPasswdError = ref(false);
    const err = ref(false); 
    let fromNew = ref(false)
    let fromPk = ref(false)
    let toggleSelection = ref(false)
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
      return multiSign.getCosignerInWallet(acc.value.publicKey).cosignerList;
    }
    const findAcc = (publicKey)=>{
      if(!walletState.currentLoggedInWallet){
        return null
      }
      return walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==publicKey)
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
      return (multiSign.getCosignerInWallet(acc.value.publicKey).cosignerList.length>0)?true: false;
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
       multiSign.onPartial(PublicAccount.createFromPublicKey(acc.value.publicKey,AppState.networkType))
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
      }else if(!fromNew.value && !fromPk.value && !delegateValue.value){
        return true
      }else if(delegateValue.value){
        if(walletPassword.value.match(passwdPattern)){
          return false
        }else{
          return true
        }
      }else if(fromNew.value){
        if(walletPassword.value.match(passwdPattern)){
          return false
        }else{
          return true
        }
      }else if(fromPk.value){
        if(walletPassword.value.match(passwdPattern) && showPrivateKeyError.value==false){
          return false
        }else{
          return true
        }
      }else{
        return true
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

    const createDelegate = async() => {
      if(privateKey.value!=""){
        const networkType = AppState.networkType;
        const accountDetail = Account.createFromPrivateKey(privateKey.value, networkType);
        const accountAPIResponse = await accountUtils.getValidAccount(accountDetail.address.address);
        if(accountAPIResponse == true){        
          if(accountDetail){
            AccPublicKey.value = accountDetail.publicKey;
          }      
        } else {          
          err.value = t('delegate.privateKeyErr')
        }  
      }else{
        const account = WalletUtils.generateNewAccount(AppState.networkType);
        if(account){
          AccPublicKey.value = account.publicKey;
         
        }
      }
      if (WalletUtils.verifyWalletPassword(walletName,networkState.chainNetworkName,walletPassword.value)) {
        if (delegateAcc.value !== "0".repeat(64)) { //unlink
          accountUtils.createDelegateTransaction(selectedCosignPublicKey.value,isMultisig.value,acc.value, walletPassword.value, delegateAcc.value, LinkAction.Unlink);
          walletPassword.value=""
          err.value=""
        } else if (AccPublicKey.value != "" && (fromPk.value || fromNew.value)) { //link
          accountUtils.createDelegateTransaction(selectedCosignPublicKey.value,isMultisig.value,acc.value, walletPassword.value, AccPublicKey.value, LinkAction.Link);
          walletPassword.value=""
          err.value=""
        } else {
          
        }
        router.push({ name: "ViewAccountPendingTransactions",params:{address:p.address} })
      } else {
        err.value = t('general.walletPasswordInvalid',{name : walletName});
      }
    };
    
    const topUpUrl = computed(()=>{
      if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 1'){
        return 'https://bctestnetfaucet.xpxsirius.io/#/'
      }else if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 2'){
        return 'https://bctestnet2faucet.xpxsirius.io/#/'
      }else{
        return ''
      }
    }) 

    const networkType = computed(()=>AppState.networkType)
    

    return {
      showPrivateKeyError,
      privateKey,
      fromNew,
      fromPk,
      toggleSelection,
      currentNativeTokenName,
      splitBalance,
      isMultisig,
      acc,
      walletPassword,
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
      findAcc,
      fundStatus,
      topUpUrl,
      networkType
    };
  },
}
</script>
<style> 
    [v-cloak] {
        display: none;
    }
</style>