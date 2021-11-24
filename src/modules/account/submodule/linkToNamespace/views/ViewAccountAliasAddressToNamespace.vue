<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">{{$t('NavigationMenu.Accounts')}} ></span> <span class="text-blue-primary font-bold">{{$t('services.linktonamespace')}}</span></div>
    <div>
      <router-link :to="{name: 'ViewAccountDisplayAll'}" class="font-bold" active-class="accounts">{{$t('accounts.viewall')}}</router-link>
    </div>
  </div>

  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-60'>
    <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8 mt-3" v-if="noNamespace">
      <div class="text-center w-full" > 
        <p class="text-xs">{{$t('namespace.namespacemessage')}}</p>
      </div>
    </div>         
    <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8 mt-3" v-if="!isCosigner && !noNamespace">
      <div class="text-center w-full" > 
        <p class="text-xs">{{$t('accounts.cosigwarning2')}}</p>
      </div>
    </div>     
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
      <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">{{$t('namespace.transactionfee')}} {{trxFee}} XPX</div>
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
  </div>
</template>

<script>
import SelectInputPlugin from "@/components/SelectInputPlugin.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import TextInput from "@/components/TextInput.vue";
import { networkState } from "@/state/networkState";
import { accountUtils } from "@/util/accountUtils";
import { walletState } from "@/state/walletState";
import { WalletUtils } from "@/util/walletUtils";
import { useToast } from "primevue/usetoast";
import { Address } from "tsjs-xpx-chain-sdk";
import { ref, computed, watch } from "vue";
import { Helper } from "@/util/typeHelper";
import { useI18n } from 'vue-i18n'

export default {
  name: 'ViewAccountAliasAddressToNamespace',

  components: {
    PasswordInput,
    SelectInputPlugin,
    TextInput,
  },
  props: {
    address: String,
  },
  
  setup(p) {
    const { t } = useI18n();
    const selectNamespaceRef = ref(null);
    const selectActionRef = ref(null);
    const currentAddress = ref(p.address);
    const err = ref("");
    const selectContactRef = ref(null);
    const selectContact = ref(null);
    const selectNamespace = ref("");
    const walletPassword = ref("");
    const selectAction = ref("");
    const trxFee = ref("0.000000");
    const namespaceAddress = ref("");
    const showAddressError = ref(false);
    const showPwdError = ref(false);
    const showContactSelection = ref(false);
    const addressErrorMsg = ref("");    
    const passwordPattern = "^[^ ]{8,}$";
    const addressPatternShort = "^[0-9A-Za-z]{40}$";
    const addressPatternLong = "^[0-9A-Za-z-]{46}$";      
    const lockFundTxFee = 0.0445;  
    const toast = useToast();   
    const pwdErrorMsg = ref("");
    const walletName = walletState.currentLoggedInWallet.name;
   
    const currencyName = computed(() => networkState.currentNetworkProfile.network.currency.name);

    const lockFund = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))
    
    const lockFundCurrency = computed(()=> Helper.convertToCurrency(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))
    

    const disableCreate = computed(() => !(walletPassword.value.match(passwordPattern) && selectAction.value != null && namespaceAddress.value != null && selectNamespace.value != null));

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

    const isMultiSig = computed(() => {
      let isMultisig = false;
      if(walletState.currentLoggedInWallet){
        isMultisig = accountUtils.getMultisig(currentAddress.value);
      }
      return isMultisig;
     });
   
    const getCosignerList = () =>{
      return accountUtils.getCosignerList(currentAddress.value);
    }

    const isCosigner = computed(() =>{
      return (getCosignerList().length == 0 && isMultiSig.value == true)?false:true;
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
        trxFee.value = "0.000000"; 
        namespaceAddress.value = '';
        selectNamespaceRef.value.clear();
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
        trxFee.value = Helper.amountFormatterSimple(accountUtils.getLinkAddressToNamespaceTransactionFee(namespaceAdd, selectNamespace.value, selectAction.value), networkState.currentNetworkProfile.network.currency.divisibility);
      } else {
        trxFee.value = "0.000000";
      }
    });
    
    watch(selectContact,(contactValues)=>{          
      if(disableContactSelection.value == false && showContactSelection.value == true && contactValues == null){
        namespaceAddress.value = "";
        showAddressError.value = false;
        addressErrorMsg.value = ""; 
      } 
    });

    watch(walletPassword,(currentPwdValue)=>{
      if(currentPwdValue == null){
        pwdErrorMsg.value = $t('scriptvalues.enterpassword',{name: walletName });
        showPwdError.value = true;
      } 
    });

    const updateAdd = (e) => {
      addressErrorMsg.value = "";
      showAddressError.value = false;
      namespaceAddress.value = e;
    };

    const contact = computed(() => {
      return accountUtils.getContact();
    });

    watch(namespaceAddress, (namespaceAddressValue) => {
      if((namespaceAddressValue.length == 46 && namespaceAddressValue.match(addressPatternLong)) || (namespaceAddressValue.length == 40 && namespaceAddressValue.match(addressPatternShort)) && namespaceAddressValue != null){
        const verifynamespaceAddress = accountUtils.verifyAddress(currentAddress.value, namespaceAddress.value);
       if(verifynamespaceAddress.isPassed == false){
          addressErrorMsg.value = "Invalid Address";
          showAddressError.value = true;
          trxFee.value = "0.000000";
        } else if(namespaceAddressValue !=null && selectNamespace.value != '' && selectAction.value != ''){
          let namespaceAdd = Address.createFromRawAddress(namespaceAddressValue).plain();
          trxFee.value = Helper.amountFormatterSimple(accountUtils.getLinkAddressToNamespaceTransactionFee(namespaceAdd, selectNamespace.value, selectAction.value), networkState.currentNetworkProfile.network.currency.divisibility);
          addressErrorMsg.value = "";
          showAddressError.value = false;
        }
      } else {
         trxFee.value = "0.000000";
      } 
    });

    const alisesAddressToNamespaces = () =>{
      if(!WalletUtils.verifyWalletPassword(walletName,networkState.chainNetworkName,walletPassword.value)){
        err.value = t('scriptvalues.walletpasswordvalidation',{name : walletName}) ;  
        walletPassword.value = "";
      } else {
        err.value = "";  
        if(isCosigner.value == true && isMultiSig.value == true){
          const cosigner = accountUtils.getCosignerList(currentAddress.value);
          accountUtils.linkAddressToNamespace(cosigner[0].address, walletPassword.value, selectNamespace.value, selectAction.value, namespaceAddress.value, currentAddress.value);
          toast.add({severity:'success', detail: 'Address Linked Successfully. Please Wait...', group: 'br', life: 10000});
        } else if(isMultiSig.value == false){
          accountUtils.linkAddressToNamespace(currentAddress.value, walletPassword.value, selectNamespace.value, selectAction.value, namespaceAddress.value, null);       
          toast.add({severity:'success', detail: 'Address Linked Successfully. Please Wait...', group: 'br', life: 10000});
        }          
        clearInput();
      }
    }

    const clearInput = () => {
      showContactSelection.value = false;
      selectNamespaceRef.value.clear();
      selectActionRef.value.clear();
      showAddressError.value = false;
      walletPassword.value = "";
      addressErrorMsg.value = "";
      err.value = "";
      pwdErrorMsg.value = "";
      showPwdError.value = false;
      namespaceAddress.value = "";
      trxFee.value = "0.000000";
    };
    
    return {
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
      updateAdd,
      alisesAddressToNamespaces,
      isCosigner,
      lockFundCurrency,
      lockFund,
      showPwdError,
      pwdErrorMsg
    };
  },
}
</script>

