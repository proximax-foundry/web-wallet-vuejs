<template>
<div>
  <div class='flex cursor-pointer'>
    <img src='@/assets/img/chevron_left.svg'>
    <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
  </div>
  <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
    <AccountComponent :address="address" class="mb-10"/>
    <div class = 'flex text-xs font-semibold border-b-2 menu_title_div'>
      <router-link :to="{name: 'ViewAccountDetails',params:{address:address}}" class= 'w-32 text-center '>Account Details</router-link>
      <router-link :to="{name:'ViewMultisigHome', params: { name: acc.name}}" class= 'w-18 text-center'>Multisig</router-link>
      <router-link v-if="isMultiSig" :to="{name:'ViewMultisigScheme', params: { address: address}}" class= 'w-18 text-center'>Scheme</router-link>
      <router-link :to="{name:'ViewAccountSwap', params: { address: address}}" class= 'w-18 text-center'>Swap</router-link>
      <MoreAccountOptions :address="address" :selected="true"/>
    </div>
    <div class="border-2 border-t-0 filter shadow-lg lg:grid lg:grid-cols-3" >
      <div class="lg:col-span-2 py-6 px-6">
        <div v-if="selectAction== 'Link'" class="font-semibold ">Link to Namespace</div>
        <div v-if="selectAction== 'Unlink'" class="font-semibold ">Manage Linked Namespace</div>
        <div class=" error error_box mb-5" v-if="err!=''">{{ err }}</div>
        <SelectInputPluginClean class="my-3 " placeholder="Select action" errorMessage="" v-model="selectAction" :options="actionsOptions" ref="selectActionRef" :disabled="disableNamespaces" selectDefault="Link" />
        <SelectInputPluginClean placeholder="Select namespace" noOptionsText="No namespace created for this account" errorMessage="" ref="selectNamespaceRef" v-model="selectNamespace" :options="namespaceOptions" :disabled="disableNamespaces" />
        <div class="flex mt-3 gap-1">
          <AddressInputClean placeholder="ADD ACCOUNT ADDRESS" v-model="namespaceAddress"  :errorMessage="addressErrorMsg" :showError="showAddressError" :disabled="disableNamespaces ||selectAction=='Unlink' || selectNamespace==null" />
          <div v-if="selectNamespace!=null && selectAction =='Link'" @click="showContactSelection=!showContactSelection" class=' border rounded-md cursor-pointer flex flex-col justify-around p-2 ' >
            <font-awesome-icon icon="id-card-alt" class=" text-blue-primary ml-auto mr-auto "></font-awesome-icon>
            <div class='text-xxs text-blue-primary font-semibold'>SELECT</div>
          </div>
          <div v-else  class=' border rounded-md cursor-pointer flex flex-col justify-around p-2 '>
            <font-awesome-icon icon="id-card-alt" class=" text-gray-400 ml-auto mr-auto "></font-awesome-icon>
            <div class='text-xxs text-gray-400 font-semibold'>SELECT</div>
          </div>
        </div>
        <div v-if="showContactSelection" class=" border " >
          <div class='text-xxs text-gray-300 font-semibold py-2 px-2'>IMPORT FROM ADDRESS BOOK</div>
          <div v-for="(item, number) in contact" :key="number" class="cursor-pointer">
            <div @click="namespaceAddress=item.value;showContactSelection=false" class="flex justify-center">
              <div v-if="number%2==0" class="text-xs py-2 bg-gray-100 pl-2 w-full">{{item.label}}</div>
              <div v-if="number%2==1" class="text-xs py-2 pl-2 w-full">{{item.label}}</div>
              <div v-if="number%2==0" class="ml-auto pr-2 text-xxs py-2 font-semibold text-blue-primary bg-gray-100">SELECT</div>
              <div v-if="number%2==1" class="ml-auto mr-2 text-xxs py-2 font-semibold text-blue-primary">SELECT</div>
            </div>
          </div>
        </div>
      </div>
      <div class='bg-navy-primary p-6 lg:col-span-1'>
        <div class='font-semibold text-xxs text-blue-primary'>ACCOUNT CURRENT BALANCE</div>
        <div class='flex text-white'>
          <div class = 'text-md font-bold '>{{splitBalance.left}} </div>
          <div class = 'text-md font-bold' v-if='splitBalance.right!=null'>.</div>
          <div class='text-xs mt-1.5 font-bold'>{{splitBalance.right}}</div>
          <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
          <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
        </div>
        <div v-if="isMultiSig &&!isCosigner && !noNamespace" class="mt-2 bg-yellow-50 p-3 rounded-md mb-2" >
          <div class="flex items-center gap-2">
            <img  src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
            <div class="text-txs">No eligible cosigner in this wallet.</div>
          </div>
        </div>
        <div v-if="noNamespace" class="mt-2 bg-yellow-50 p-3 rounded-md mb-2" >
          <div class="flex items-center gap-2">
            <img  src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
            <div class="text-txs">You have not created a namespace.</div>
          </div>
        </div>
        <div v-if="onPartial " class="mt-2 grid bg-yellow-50 p-3 rounded-md" >
          <div class="flex gap-2">
            <img  src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
            <div class="text-txs">Your account has transaction(s) on partial.</div>
          </div>
        </div>
        <div class="flex mt-4 text-white">
          <div  v-if="!isMultiSig"  class='text-xs '>Transaction Fee</div>
          <div  v-else  class='text-xs '>Aggregate Fee</div>
          <div class="text-xs  ml-auto">{{trxFee}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div v-if="isMultiSig" class="flex mt-4 text-white">
          <div class='text-xs '>LockFund</div>
          <div class="text-xs  ml-auto">{{lockFund}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
       <div v-if="isMultiSig" class="flex mt-4 text-white">
          <div class='text-xs '>LockFund TxFee</div>
          <div class="text-xs  ml-auto">{{lockFundTxFee}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div class='border-b-2 border-gray-600 my-2'/>
        <div class="flex text-white">
          <div class=' font-bold text-xs '>TOTAL</div>
          <div class="text-xs  ml-auto">{{totalFee}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div class="mt-5"/>
        <div class='font-semibold text-xs text-white mb-1.5'>Enter your password to continue</div>
        <PasswordInput :placeholder="$t('signin.enterpassword')" :errorMessage="pwdErrorMsg" v-model="walletPassword" icon="lock" :showError="showPwdError" :disabled="disableNamespaces"  />
        <div class="mt-3"></div>
        <button v-if="selectAction== 'Link' && !pending" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="alisesAddressToNamespaces" :disabled="disableCreate">Link to Namespace</button>
        <button v-if="selectAction== 'Link'&& pending" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="alisesAddressToNamespaces" :disabled="disableCreate">Linking to Namespace...Please wait</button>
        <button v-if="selectAction== 'Unlink' && !pending" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="alisesAddressToNamespaces" :disabled="disableCreate">Unlink Namespace</button>
         <button v-if="selectAction== 'Unlink' &&pending" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="alisesAddressToNamespaces" :disabled="disableCreate">Unlinking to Namespace...Please wait</button>

       <div class="text-center">
          <router-link :to="{name: 'ViewAccountDetails',params:{name:address}}" class="content-center text-xs text-white underline" >Cancel</router-link>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-60'>    
    <div class="error error_box mb-2" v-if="err!=''">{{ err }}</div>
    <SelectInputPlugin placeholder="Select action" errorMessage="" v-model="selectAction" :options="actionsOptions" ref="selectActionRef" :disabled="disableNamespaces" selectDefault="Link" />
    <SelectInputPlugin placeholder="Select namespace" noOptionsText="No namespace created for this account" errorMessage="" ref="selectNamespaceRef" v-model="selectNamespace" :options="namespaceOptions" :disabled="disableNamespaces" />
    <SelectInputPlugin v-if="showContactSelection" :placeholder="$t('accounts.contacts')" errorMessage="" ref="selectContactRef" v-model="selectContact" :options="contact" @show-selection="updateAdd" :disabled="disableContactSelection"/>
    <div class="flex">
      <div class="flex-grow mr-5">
        <TextInput :placeholder="$t('createsuccessful.address')" :errorMessage="addressErrorMsg" :showError="showAddressError" v-model="namespaceAddress" icon="wallet" :disabled="disableNamespaces"/>
      </div>
      <div class="flex-none">
        <div class="rounded-full bg-gray-300 w-14 h-14 cursor-pointer relative" style="top: -5px" @click="showContactSelection = !showContactSelection && !disableContactSelection"  >
          <font-awesome-icon icon="id-card-alt" class="h-20 w-20 inline text-blue-primary absolute" style="top: -12px; left: 19px" > 
          </font-awesome-icon>
        </div>
      </div>
    </div>
    <div class="rounded-2xl bg-gray-100 p-5 my-5">
      <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}} {{trxFee}} {{ currencyName }}</div>
    </div>
    <div class="p-4 rounded-xl bg-gray-100 mt-2 items-center w-full text-xs text-gray-800 mb-5" v-if="isMultiSig">
      <div class="text-center">
        <div class="inline-block">
          <div class="flex">
            <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline-block mr-1 self-center">
              <div class="inline-block self-center text-left">
                <div>{{$t('accounts.lockfund')}}: {{ lockFundCurrency }} {{ currencyName }}</div>
                <div>{{$t('accounts.unconfirmed')}}: {{ lockFundTxFee }} {{ currencyName }}</div>
              </div>
          </div>
        </div>
      </div>
    </div>
    <PasswordInput :placeholder="$t('signin.enterpassword')" :errorMessage="pwdErrorMsg" v-model="walletPassword" icon="lock" :showError="showPwdError" :disabled="disableNamespaces"  />
    <div class="mt-10">
      <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50 disabled:cursor-auto" :disabled="disableNamespaces" @click="clearInput()" >{{$t('signin.clear')}}</button>
      <button type="submit" class="default-btn py-1 disabled:opacity-50 disabled:cursor-auto" @click="alisesAddressToNamespaces" :disabled="disableCreate">{{$t('welcome.create')}}</button>
    </div>
  </div> -->
</div>
</template>

<script>
import SelectInputPluginClean from "@/components/SelectInputPluginClean.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import TextInput from "@/components/TextInput.vue";
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
import MoreAccountOptions from "@/modules/account/components/MoreAccountOptions.vue";
import { multiSign } from '@/util/multiSignatory';
import AddressInputClean from "@/modules/transfer/components/AddressInputClean.vue"
import { listenerState } from '@/state/listenerState';
import { AppState } from '@/state/appState';
import { TransactionUtils } from '@/util/transactionUtils';
export default {
  name: 'ViewAccountAliasAddressToNamespace_a',

  components: {
    PasswordInput,
    SelectInputPluginClean,
    /* TextInput, */
    AccountComponent,
    MoreAccountOptions,
    AddressInputClean
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
    const acc = ref(totalAcc.value.find(acc=>acc.address==p.address))
    const onPartial = ref(false);
    const checkIsPartial = ()=>{ 
      multiSign.onPartial(PublicAccount.createFromPublicKey(acc.value.publicKey,networkState.currentNetworkProfile.network.type))
      .then(onPartialBoolean => onPartial.value = onPartialBoolean)
      .catch(err=>{
        onPartial.value = false
      })
    }
    checkIsPartial()
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
    const showPwdError = ref(false);
    const showContactSelection = ref(false);
    const addressErrorMsg = ref("");    
    const passwordPattern = "^[^ ]{8,}$";
    const addressPatternShort = "^[0-9A-Za-z]{40}$";
    const addressPatternLong = "^[0-9A-Za-z-]{46}$";  
    const lockFund = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))    
    const lockFundTxFee = computed(()=>{ 
      if(networkState.currentNetworkProfile){ 
        return Helper.convertToExact(TransactionUtils.getLockFundFee(AppState.networkType, networkState.currentNetworkProfile.generationHash), AppState.nativeToken.divisibility);
      }else{
        return 0
      }
    })
    const toast = useToast();   
    const pwdErrorMsg = ref("");
    const walletName = walletState.currentLoggedInWallet.name;
    let txHash = ref('')
    let pending = ref(false)
    let recordAction = ref('')
    
    const trxFee = ref(0)

    const totalFee = computed(()=>{
      if(isMultiSig.value){
        return Math.round((parseFloat(trxFee.value) + lockFund.value + lockFundTxFee.value)*Math.pow(10,AppState.nativeToken.divisibility))/Math.pow(10,AppState.nativeToken.divisibility)
      }else{
        return trxFee.value
      }
    })
    const confirmedTxLength = computed(()=> listenerState.confirmedTxLength);
    const aggregateBondedTxLength = computed(()=> listenerState.aggregateBondedTxLength);
    const currencyName = computed(() => networkState.currentNetworkProfile.network.currency.name);

    
    
    const accountBalance = computed(() => {
       let accountBalance = 0
       if (acc.value == undefined){
         return 0
       }
        accountBalance = acc.value.balance
       
       return accountBalance 
    })
    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);
    const accountDisplayBalance = computed(() => {
      if(walletState.currentLoggedInWallet){ 
        return Helper.toCurrencyFormat(accountBalance.value, currentNativeTokenDivisibility.value);
      }else{
        return 0 
      }
    });
    const splitBalance = computed(()=>{
      let split = accountDisplayBalance.value.split(".")
      if (split[1]!=undefined){
        return {left:split[0],right:split[1]}
      }else{
        return {left:split[0], right:null}
      }
    })

    const disableCreate = computed(() => {
      return !(onPartial.value==false && walletPassword.value.match(passwordPattern) && selectAction.value != null && namespaceAddress.value != '' && selectNamespace.value != null && showAddressError.value ==false);
    })

    const actionsOptions = computed(() => {
      let action = [];
      action.push({value: 'Link', label: 'Link'} , {value: 'Unlink', label: 'Unlink'});
      return action;
    });


    const namespaceOptions = computed(() => {
      let namespace = [];
      if(selectAction.value != null){
        namespace = accountUtils.namespacesOption(currentAddress.value, selectAction.value);
      } 
      return namespace;
    });

    const noNamespace = computed(() => {
      if(walletState.currentLoggedInWallet){
        if(accountUtils.getNamespacesListByAddress(currentAddress.value).length == 0){
          return true;
        }else {
          return false;
        }
      } else {
        return null;
      }
    });

    
   
    const getCosignerList = () =>{
      return multiSign.getCosignerInWallet(acc.value.publicKey).cosignerList;
    }

    const isCosigner = computed(() =>{
      return (multiSign.getCosignerInWallet(acc.value.publicKey).cosignerList.length>0)?true: false;
    });

    const disableContactSelection = computed(()=>{
      const disableContact = (isCosigner.value == false && isMultiSig.value == true || noNamespace.value == true || selectAction.value == 'Unlink')? true:false;
      return disableContact;
    });

    const disableNamespaces = computed(()=>{
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

    watch(selectNamespace,(namespacesValues)=>{   
      const getnamespacelist = accountUtils.getNamespacesListByAddress(currentAddress.value);   
      const namespacelist = getnamespacelist.find(namespace => namespace.name === selectNamespace.value);
      if(selectAction.value == 'Unlink' && namespacesValues !=null){
        namespaceAddress.value = Address.createFromRawAddress(namespacelist.linkedId).pretty();
      } else if(selectAction.value=="Link" && namespaceAddress.value!="" && namespacesValues!=null){
        let namespaceAdd = Address.createFromRawAddress(namespaceAddress.value).plain();
        trxFee.value = Helper.amountFormatterSimple(accountUtils.getLinkAddressToNamespaceTransactionFee(isMultiSig.value,namespaceAdd, selectNamespace.value, selectAction.value), networkState.currentNetworkProfile.network.currency.divisibility);
      } else {
        
      }
    });
    

    watch(walletPassword,(currentPwdValue)=>{
      if(currentPwdValue == null){
        pwdErrorMsg.value = $t('scriptvalues.enterpassword',{name: walletName });
        showPwdError.value = true;
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
          trxFee.value = Helper.amountFormatterSimple(accountUtils.getLinkAddressToNamespaceTransactionFee(isMultiSig.value,namespaceAdd, selectNamespace.value, selectAction.value), networkState.currentNetworkProfile.network.currency.divisibility);
          addressErrorMsg.value = "";
          showAddressError.value = false;
        }
      } else {
         
         showAddressError.value = true;
      } 
    });
   
    const alisesAddressToNamespaces = () =>{
      if(!WalletUtils.verifyWalletPassword(walletName,networkState.chainNetworkName,walletPassword.value)){
        err.value = t('scriptvalues.walletpasswordvalidation',{name : walletName}) ;  
        walletPassword.value = "";
      } else {
        let acc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==p.address)? walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==p.address) : walletState.currentLoggedInWallet.others.find(acc=>acc.address==p.address) 
        err.value = "";  
        /* if(isCosigner.value == true && isMultiSig.value == true){ */
          const cosigner = getCosignerList();
          /* accountUtils.linkAddressToNamespace(cosigner[0].address, walletPassword.value, selectNamespace.value, selectAction.value, namespaceAddress.value, currentAddress.value); */
          recordAction.value = selectAction.value
          let signedTx = accountUtils.linkAddressToNamespace(isMultiSig.value,cosigner,acc,walletPassword.value,selectNamespace.value, selectAction.value, namespaceAddress.value)
          txHash.value = signedTx.hash.toUpperCase()
         /*  toast.add({severity:'success', detail: 'Address Linked Successfully. Please Wait...', group: 'br', life: 10000});
        } */ /* else if(isMultiSig.value == false){
          accountUtils.linkAddressToNamespace(currentAddress.value, walletPassword.value, selectNamespace.value, selectAction.value, namespaceAddress.value, null);       
          toast.add({severity:'success', detail: 'Address Linked Successfully. Please Wait...', group: 'br', life: 10000});
        }      */     
        clearInput();
        pending.value = true
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
      pwdErrorMsg.value = "";
      showPwdError.value = false;
      namespaceAddress.value = "";
     
    };

    watch(confirmedTxLength, (n, o) => {
      if (n != o){ 
        if(listenerState.allConfirmedTransactionsHash.find(hash=> hash ==txHash.value)){
          txHash.value=""
          pending.value=false
          if(recordAction.value!=""){
            toast.add({severity:'success', summary: 'Notification', detail: recordAction.value =="Link"? 'Linked Successfully' :'Unlinked Successfully', group: 'br', life: 5000})
          }
          checkIsPartial()
          /* showSuccess.value=true */
        }
      }
    })

     watch(aggregateBondedTxLength, (n, o) => {
      if (n != o){
        checkIsPartial()
      }
    })
    
    return {
      splitBalance,
      currentNativeTokenName,
      acc,
      walletState, 
      clearInput,
      actionsOptions,
      disableNamespaces,
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
      currencyName,
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
      alisesAddressToNamespaces,
      isCosigner,
      lockFund,
      showPwdError,
      pwdErrorMsg,
      pending,
      totalFee,
      onPartial
    };
  },
}
</script>

