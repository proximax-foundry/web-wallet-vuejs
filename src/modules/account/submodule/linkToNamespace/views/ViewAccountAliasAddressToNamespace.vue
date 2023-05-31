<template>
<div>
  
  <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
    <AccountComponent :address="address" class="mb-6"/>
    <AccountTabs :address="address" selected="details"/>
    <div class="border-2 border-t-0 filter shadow-lg lg:grid lg:grid-cols-3" >
      <div class="lg:col-span-2 py-6 px-6">
        <div v-if="isMultiSig" class="text-left mt-2 mb-5 "> 
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
        <div v-if="selectAction== 'Link'" class="font-semibold ">{{$t('general.linkToNamespace')}}</div>
        <div v-if="selectAction== 'Unlink'" class="font-semibold ">{{$t('namespace.manageNamespace')}}</div>
        <div class=" error error_box mb-5" v-if="err!=''">{{ err }}</div>
        <SelectInputPluginClean class="my-3 " :placeholder="$t('namespace.selectAction')"  v-model="selectAction" :options="actionsOptions" ref="selectActionRef" :disabled="disableNamespace"/>
        <SelectInputPluginClean :placeholder="$t('namespace.selectNamespace')" ref="selectNamespaceRef" v-model="selectNamespace" :options="namespaceOptions" :disabled="disableNamespace || disableSelectNamespace" />
        <div class="flex mt-3 gap-1">
          <AddressInputClean :placeholder="$t('general.addAccAddress')" v-model="namespaceAddress"  :errorMessage="addressErrorMsg" :showError="showAddressError" :disabled="disableNamespace ||selectAction=='Unlink' || selectNamespace==null" />
          <div v-if="selectNamespace!=null && selectAction =='Link'" @click="showContactSelection=!showContactSelection" class=' border rounded-md cursor-pointer flex flex-col justify-around p-2 ' >
            <font-awesome-icon icon="id-card-alt" class=" text-blue-primary ml-auto mr-auto "></font-awesome-icon>
            <div class='text-xxs text-blue-primary font-semibold uppercase'>{{$t('general.select')}}</div>
          </div>
          <div v-else  class=' border rounded-md cursor-pointer flex flex-col justify-around p-2 '>
            <font-awesome-icon icon="id-card-alt" class=" text-gray-400 ml-auto mr-auto "></font-awesome-icon>
            <div class='text-xxs text-gray-400 font-semibold uppercase'>{{$t('general.select')}}</div>
          </div>
        </div>
        <div v-if="showContactSelection" class=" border " >
          <div class='text-xxs text-gray-300 font-semibold py-2 px-2 uppercase'>{{$t('general.importFromAB')}}</div>
          <div v-for="(item, number) in contact" :key="number" class="cursor-pointer">
            <div @click="namespaceAddress=item.value;showContactSelection=false" class="flex justify-center">
              <div v-if="number%2==0" class="text-xs py-2 bg-gray-100 pl-2 w-full">{{item.label}}</div>
              <div v-if="number%2==1" class="text-xs py-2 pl-2 w-full">{{item.label}}</div>
              <div v-if="number%2==0" class="ml-auto pr-2 text-xxs py-2 font-semibold text-blue-primary bg-gray-100 uppercase">{{$t('general.select')}}</div>
              <div v-if="number%2==1" class="ml-auto mr-2 text-xxs py-2 font-semibold text-blue-primary uppercase">{{$t('general.select')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class='bg-navy-primary p-6 lg:col-span-1'>
        <TransactionFeeDisplay :transaction-fee="Number(trxFee)" :total-fee-formatted="String(totalFee)"
            :get-multi-sig-cosigner="walletCosignerList" :check-cosign-balance="String(checkCosignBalance)"
            :lock-fund-currency="lockFund" :lock-fund-tx-fee="lockFundTxFee" :balance="accountDisplayBalance"
            :selected-acc-add="address" :no-namespace="noNamespace"
            :on-partial="onPartial" :is-cosigner="isCosigner" :fund-status="fundStatus" />
        <div class='font-semibold text-xs text-white mb-1.5'>{{$t('general.enterPasswordContinue')}}</div>
        <PasswordInput :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')" v-model="walletPassword" icon="lock"  :disabled="disableNamespace"  />
        <div class="mt-3"></div>
        <button v-if="selectAction== 'Link' " class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="aliasAddressToNamespace" :disabled="disableCreate">{{$t('general.linkToNamespace')}}</button>
        <button v-if="selectAction== 'Unlink'" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="aliasAddressToNamespace" :disabled="disableCreate">{{$t('namespace.unlinkNamespace')}}</button>
       <div class="text-center">
          <router-link :to="{name: 'ViewAccountDetails',params:{address: address}}" class="content-center text-xs text-white underline" >{{$t('general.cancel')}}</router-link>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SelectInputPluginClean from "@/components/SelectInputPluginClean.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import { networkState } from "@/state/networkState";
import { accountUtils } from "@/util/accountUtils";
import { walletState } from "@/state/walletState";
import { WalletUtils } from "@/util/walletUtils";
import { useToast } from "primevue/usetoast";
import { Address, PublicAccount } from "tsjs-xpx-chain-sdk";
import { ref, computed, watch } from "vue";
import { Helper } from "@/util/typeHelper";
import { useI18n } from 'vue-i18n'
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { multiSign } from '@/util/multiSignatory';
import AddressInputClean from "@/modules/transfer/components/AddressInputClean.vue"
import { listenerState } from '@/state/listenerState';
import { AppState } from '@/state/appState';
import { TransactionUtils } from '@/util/transactionUtils';
import { useRouter } from 'vue-router';
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
export default {
  name: 'ViewAccountAliasAddressToNamespace',

  components: {
    PasswordInput,
    SelectInputPluginClean,
    AccountComponent,
    AddressInputClean,
    AccountTabs,
    TransactionFeeDisplay
  },
  props: {
    address: String,
  },
  
  setup(p) {
    const { t } = useI18n();
    const totalAcc = computed(()=>{
    
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
          isMultisig: acc.getDirectParentMultisig().length ? true: false,
          multisigInfo: acc.multisigInfo,
        }; 
      });
      
      
      let otherAccounts =walletState.currentLoggedInWallet.others.filter((acc)=> acc.type === "MULTISIG").map(
      (acc)=>{ 
        return { 
          name: acc.name,
          balance: acc.balance,
          address: acc.address,
          publicKey: acc.publicKey,
          isMultisig: true,
          multisigInfo: acc.multisigInfo,
        }; 
      });

      return accounts.concat(otherAccounts);
    
    });
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
    const findAcc = (publicKey)=>{
      return totalAcc.value.find(acc=>acc.publicKey==publicKey)
    }
    const onPartial = ref(false);
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
    const disableSelectNamespace = computed(() => {
      if(selectAction.value == ''){
        return true
      }else{
        return false
      }
    })
    const selectNamespaceRef = ref(null);
    const selectActionRef = ref(null);
    const currentAddress = ref(p.address);
    const err = ref("");
    const selectContactRef = ref(null);
    const selectContact = ref(null);
    const selectNamespace = ref("");
    const walletPassword = ref("");
    const selectAction = ref("");
    const isMultiSig = computed(() => {
      let isMultisig = false;
      if(walletState.currentLoggedInWallet){
        isMultisig = accountUtils.getMultisig(currentAddress.value);
      }
      return isMultisig;
     });
    const namespaceAddress = ref("");
    const showAddressError = ref(true);
    const showContactSelection = ref(false);
    const addressErrorMsg = ref("");    
    const passwordPattern = "^[^ ]{8,}$";
    const addressPatternShort = "^[0-9A-Za-z]{40}$";
    const addressPatternLong = "^[0-9A-Za-z-]{46}$";  
    const lockFund = computed(()=> {
      if(!networkState.currentNetworkProfileConfig){
        return 0
      }
      return Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, AppState.nativeToken.divisibility)
    })   
    const lockFundTxFee = computed(()=>{ 
      if(networkState.currentNetworkProfile){ 
        return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
      }else{
        return 0
      }
    })
    const toast = useToast();   
    const walletName = walletState.currentLoggedInWallet? walletState.currentLoggedInWallet.name:''
    let recordAction = ref('')
    
    const trxFee = ref(0)

    const totalFee = computed(()=>{
    let tokenDivisibility = AppState.nativeToken.divisibility
      if(isMultiSig.value){
        if(tokenDivisibility==0){
          return Math.trunc(parseFloat(trxFee.value) + lockFund.value + lockFundTxFee.value)
        }else{
          return Math.round((parseFloat(trxFee.value) + lockFund.value + lockFundTxFee.value)*Math.pow(10,AppState.nativeToken.divisibility))/Math.pow(10,AppState.nativeToken.divisibility)
        }
      }else{
        return trxFee.value
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
        return Helper.toCurrencyFormat(accountBalance.value, currentNativeTokenDivisibility.value);
      }else{
        return '0'
      }
    });

    const fundStatus = computed(()=>{
      var fundStatus = false
      if(isMultiSig.value){
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

    const disableCreate = computed(() => {
      return !(onPartial.value==false && fundStatus.value == false && walletPassword.value.match(passwordPattern) && selectAction.value != null && namespaceAddress.value != '' && selectNamespace.value != null && showAddressError.value ==false);
    })

    const actionsOptions = computed(() => {
      let action = [];
      action.push({value: 'Link', label: t('general.link')} , {value: 'Unlink', label: t('general.unlink')});
      return action;
    });


    const namespaceOptions = computed(() => {
      let namespace = [];
      if(selectAction.value != null){
        namespace = accountUtils.namespaceOption(currentAddress.value, selectAction.value);
      } 
      return namespace;
    });

    const noNamespace = computed(() => {
      if(walletState.currentLoggedInWallet){
        if(accountUtils.getNamespaceListByAddress(currentAddress.value).length == 0){
          return true;
        }else {
          return false;
        }
      } else {
        return null;
      }
    });

    const walletCosignerList = computed(() =>{
      if(networkState.currentNetworkProfileConfig){
        let cosigners = multiSign.getCosignerInWallet(acc.value.publicKey?acc.value.publicKey:'');
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
    })

    const selectedCosignPublicKey = ref(walletCosignerList.value.cosignerList[0]?walletCosignerList.value.cosignerList[0].publicKey:'')
    watch(walletCosignerList,n=>{
      if(n.cosignerList.length){
        selectedCosignPublicKey.value = n.cosignerList[0]?n.cosignerList[0].publicKey:''
      }
    },{deep:true})

    const isCosigner = computed(() =>{
      if(!acc.value){
        return false
      }
      return (multiSign.getCosignerInWallet(acc.value.publicKey).cosignerList.length>0)?true: false;
    });

    const disableContactSelection = computed(()=>{
      const disableContact = (isCosigner.value == false && isMultiSig.value == true || noNamespace.value == true || selectAction.value == 'Unlink')? true:false;
      return disableContact;
    });

    const disableNamespace = computed(()=>{
      return (isCosigner.value == false && isMultiSig.value == true || noNamespace.value == true)?true:false;
    });
    
    watch(selectAction,(actionValue,prevActionValue)=>{
      if(actionValue!=prevActionValue){
        
        namespaceAddress.value = '';
        selectNamespaceRef.value.clear();
        selectNamespace.value=null
        showContactSelection.value = false;
      }
    });

    watch(selectNamespace,(namespaceValues)=>{   
      const getnamespacelist = accountUtils.getNamespaceListByAddress(currentAddress.value);   
      const namespacelist = getnamespacelist.find(namespace => namespace.name === selectNamespace.value);
      if(selectAction.value == 'Unlink' && namespaceValues !=null){
        namespaceAddress.value = Address.createFromRawAddress(namespacelist.linkedId).pretty();
      } else if(selectAction.value=="Link" && namespaceAddress.value!="" && namespaceValues!=null){
        let namespaceAdd = Address.createFromRawAddress(namespaceAddress.value).plain();
        trxFee.value = Helper.amountFormatterSimple(accountUtils.getLinkNamespaceToAddressTransactionFee(isMultiSig.value,namespaceAdd, selectNamespace.value, selectAction.value), AppState.nativeToken.divisibility);
      } else {
        
      }
    });

    const contact = computed(() => {
      return accountUtils.getContact();
    });
  
    watch(namespaceAddress, (namespaceAddressValue) => {
      if((namespaceAddressValue.length == 46 && namespaceAddressValue.match(addressPatternLong)) || (namespaceAddressValue.length == 40 && namespaceAddressValue.match(addressPatternShort))){
        const verifynamespaceAddress = accountUtils.verifyAddress(currentAddress.value, namespaceAddress.value);
       if(verifynamespaceAddress.isPassed == false){
          addressErrorMsg.value = "Invalid Address";
          showAddressError.value = true;
          
        } else{
          let namespaceAdd = Address.createFromRawAddress(namespaceAddressValue).plain();
          trxFee.value = Helper.amountFormatterSimple(accountUtils.getLinkNamespaceToAddressTransactionFee(isMultiSig.value,namespaceAdd, selectNamespace.value, selectAction.value), AppState.nativeToken.divisibility);
          addressErrorMsg.value = "";
          showAddressError.value = false;
        }
      } else {
         
         showAddressError.value = true;
      } 
    });
    const router = useRouter()
    const aliasAddressToNamespace = () =>{
      if(!WalletUtils.verifyWalletPassword(walletName,networkState.chainNetworkName,walletPassword.value)){
        err.value = t('general.walletPasswordInvalid',{name : walletName}) ;  
        walletPassword.value = "";
      } else {
        let acc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==p.address)? walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==p.address) : walletState.currentLoggedInWallet.others.find(acc=>acc.address==p.address) 
        err.value = "";  
        recordAction.value = selectAction.value
        accountUtils.linkNamespaceToAddress(selectedCosignPublicKey.value,isMultiSig.value,acc,walletPassword.value,selectNamespace.value, selectAction.value, namespaceAddress.value)
          
        clearInput();
        router.push({ name: "ViewAccountPendingTransactions",params:{address:p.address} })
      }
    }

    const clearInput = () => {
      showContactSelection.value = false;
      selectNamespaceRef.value.clear();
      /* selectActionRef.value.clear(); */
      showAddressError.value = false;
      walletPassword.value = "";
      addressErrorMsg.value = "";
      err.value = "";
      namespaceAddress.value = "";
     
    };
    const networkType = computed(()=>AppState.networkType)

    const topUpUrl = computed(()=>{
      if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 1'){
        return 'https://bctestnetfaucet.xpxsirius.io/#/'
      }else if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 2'){
        return 'https://bctestnet2faucet.xpxsirius.io/#/'
      }else{
        return ''
      }
    }) 

    const checkCosignBalance = computed(() => {
      let findAccount = findAcc(selectedCosignPublicKey.value)
      return findAccount ? findAccount.balance : 0;
    })    
    
    return {
      currentNativeTokenName,
      acc,
      walletState, 
      clearInput,
      actionsOptions,
      disableNamespace,
      selectAction,
      walletPassword,
      disableCreate,
      noNamespace,
      namespaceOptions,
      selectNamespace,
      showContactSelection,
      isMultiSig,
      selectContactRef,
      selectContact,
      disableContactSelection,
      namespaceAddress,
      lockFundTxFee,
      showAddressError,
      err,
      addressErrorMsg,
      trxFee,
      contact,
      walletName,
      selectNamespaceRef,
      selectActionRef,
      /* updateAdd, */
      aliasAddressToNamespace,
      isCosigner,
      lockFund,
      totalFee,
      onPartial,
      walletCosignerList,
      selectedCosignPublicKey,
      findAcc,
      fundStatus,
      topUpUrl,
      networkType,
      disableSelectNamespace,
      checkCosignBalance,
      accountDisplayBalance
    };
  },
}
</script>

