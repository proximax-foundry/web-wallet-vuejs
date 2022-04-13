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
        <button type="submit" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" :disabled="disableCreate" @click="updateMetadata()">
            Update Namespace Metadata
          </button>
        <div class="text-center">
          <router-link :to="{name: 'ViewDashboard'}" class="content-center text-xs text-white underline" >{{$t('general.cancel')}}</router-link>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script lang="ts">
import { Helper } from "@/util/typeHelper";
import { computed, ref, getCurrentInstance, watch, effect } from "vue";
import TextInput from "@/components/TextInput.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import SelectInputPlugin from "@/components/SelectInputPlugin.vue";
import MosaicInput from "@/modules/transfer/components/MosaicInput.vue";
import SupplyInput from "@/components/SupplyInput.vue";
import TransferTextareaInput from "@/modules/transfer/components/TransferTextareaInput.vue";
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
import { 
  Address, PublicAccount, Convert, NamespaceMetadataTransactionBuilder, 
  AggregateTransaction, AggregateBondedTransactionBuilder, UInt64,
  MetadataQueryParams, MetadataType, NamespaceMetadataTransaction,
  NamespaceId
} from 'tsjs-xpx-chain-sdk';
export default { 
  name: "ViewUpdateNamespaceMetadata",
  props:{
    targetId: String,
    scopedMetadataKey: String,
  },
  components: {
    SelectInputSender,
    PasswordInput,
    AddContactModal,
    ConfirmSendModal
  },
  setup(props) {
    let targetNamespaceSelectable = ref(true);
    let scopedMetadataKeySelectable = ref(true);
    let scopedMetadataKeyType = ref(1);
    let targetPublicAccount: PublicAccount = null;
    let targetNamespace: NamespaceId = null;
    let targetAccIsMultisig = ref(false);
    let scopedMetadataKeyHex = "";
    let inputScopedMetadataKey = ref("");
    let selectedAcc = null;
    let selectedNamespace = ref("");
    let txnBuilder: NamespaceMetadataTransactionBuilder;
    let aggregateTxnBuilder: AggregateBondedTransactionBuilder;
    let metadataTxn: NamespaceMetadataTransaction;
    let aggregateTxn: AggregateTransaction;
    const oldValue = ref("");
    const newValue = ref("");

    const handleParamTargetId = async ()=>{
      if(props.targetId){
        targetNamespaceSelectable.value = false;

        if(props.targetId.length === 16 && Convert.isHexString(props.targetId)){
          let uint64Id = UInt64.fromHex(props.targetId);
          let namespaceId = new NamespaceId([uint64Id.lower, uint64Id.higher]);
          console.log(namespaceId.toHex());
          targetNamespace = namespaceId;
          selectedNamespace.value = namespaceId.toHex();
          txnBuilder.targetNamespaceId(targetNamespace);
        }
        else{
          try {
            let namespaceId = new NamespaceId(props.targetId);
            targetNamespace = namespaceId;
            selectedNamespace.value = props.targetId;
            txnBuilder.targetNamespaceId(targetNamespace);
          } catch (error) {
            return;
          }
        }

        let namespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespace(targetNamespace);
        targetPublicAccount = namespaceInfo.owner;
        txnBuilder.targetPublicKey(targetPublicAccount);

        let selectedAcc = walletState.currentLoggedInWallet.accounts.find(acc=> acc.publicKey === namespaceInfo.owner.publicKey);

        if(selectedAcc){
          let directParent = selectedAcc.getDirectParentMultisig();
          if(directParent.length){
            targetAccIsMultisig.value = true;
          }
        }
        else{
          let selectedAcc = walletState.currentLoggedInWallet.others.find(acc=> acc.publicKey === namespaceInfo.owner.publicKey);

          if(selectedAcc){
            
            let directParent = selectedAcc.getDirectParentMultisig();
            if(directParent.length){
              targetAccIsMultisig.value = true;
            }
          }
        }
      }
    }

    const handleParamScopedMetadataKey = ()=>{
      if(props.scopedMetadataKey){
        scopedMetadataKeySelectable.value = false;

        inputScopedMetadataKey.value = props.scopedMetadataKey;

        if(props.scopedMetadataKey.length === 16 && Convert.isHexString(props.scopedMetadataKey)){
          scopedMetadataKeyHex = props.scopedMetadataKey;
          txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex));
          scopedMetadataKeyType.value = 2;
        }
        else{
          let tempHexData = Convert.utf8ToHex(props.scopedMetadataKey);
          const hexDataBytes = tempHexData.length / 2;

          if(tempHexData.length && hexDataBytes <= 8){
            if((tempHexData.length/2) < 8){
              tempHexData = tempHexData + "00".repeat(8 - hexDataBytes);
            }
            scopedMetadataKeyHex = tempHexData;
            txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex));
            scopedMetadataKeyType.value = 1;
          }
        }

        scopedMetadataKeySelectable.value = false;
      }
    }

    const createTxnBuilder = () =>{
      txnBuilder = AppState.buildTxn.namespaceMetadataBuilder();
      aggregateTxnBuilder = AppState.buildTxn.aggregateBondedBuilder();
    }

    const loadCurrentMetadataValue = async () =>{
      if(targetNamespace && scopedMetadataKeyHex){

        let metadataQueryParams = new MetadataQueryParams();
        metadataQueryParams.targetId = targetNamespace;
        metadataQueryParams.metadataType = MetadataType.NAMESPACE;
        metadataQueryParams.scopedMetadataKey = UInt64.fromHex(scopedMetadataKeyHex);

        let searchResults = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);
        if(searchResults.metadataEntries.length){
            oldValue.value = searchResults.metadataEntries[0].value;
            
        }
        txnBuilder.oldValue(oldValue.value);
      }
    }

    const metadataTxnAssignNewValue = () =>{
      txnBuilder.value(newValue.value);
    }

    const setNewScopedKey = () =>{
      if(scopedMetadataKeySelectable.value)
        txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex));
    }

    const setNewTargetNamespace = () =>{
      if(targetNamespaceSelectable.value)
        txnBuilder.targetNamespaceId(targetNamespace);
    }

    const buildMetadataTxn = ()=>{
      metadataTxn = txnBuilder.calculateDifferences().build();
    }

    const buildAggregateTxn = ()=>{
      if(metadataTxn){
        aggregateTxn = aggregateTxnBuilder.innerTransactions([metadataTxn.toAggregate(targetPublicAccount)]).build();
      }
    }

    const updateAggregateFee = ()=>{
      if(aggregateTxn){
        effectiveFee.value = Helper.convertToCurrency(aggregateTxn.maxFee.compact(), AppState.nativeToken.divisibility);
      } 
    }
    
    const init = async ()=>{
      createTxnBuilder();
      await handleParamTargetId();
      handleParamScopedMetadataKey();
      await loadCurrentMetadataValue();
      metadataTxnAssignNewValue();
      buildMetadataTxn();
      buildAggregateTxn();
      updateAggregateFee();
    }

    if(AppState.isReady){
      init();
    }
    else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
          init();
          readyWatcher();
        }
      });
    }

    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const toggleContact = ref(false)
    const {t} = useI18n();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const walletPassword = ref("");
    const err = ref("");
    const showMenu = ref(false);
    const toggleConfirm = ref(false);
    const forceSend = ref(false);
    
    const cosignAddress = ref("");
    const disableAllInput = ref(false);
    const disablePassword = computed(() => disableAllInput.value);
    const cosignerBalanceInsufficient = ref(false);
    const walletName = walletState.currentLoggedInWallet.name
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

    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    
    
    const selectedAccName = ref(
      walletState.currentLoggedInWallet.selectDefaultAccount().name
    );
    const selectedAccAdd = ref(
      walletState.currentLoggedInWallet.selectDefaultAccount().address
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

    const effectiveFee = ref("0");

    // const effectiveFee = ref(isMultiSigBool.value?makeTransaction.calculate_aggregate_fee(
    //   messageText.value,
    //   sendXPX.value,
    //   selectedMosaic.value
    // ) :makeTransaction.calculate_fee(
    //   messageText.value,
    //   sendXPX.value,
    //   selectedMosaic.value
    // ))
    
    
    const clearInput = () => {
      walletPassword.value = "";
      emitter.emit("CLEAR_SELECT", 0);
    };
  
  const updateMetadata = async() => {   
      // let selectedCosign;
      // if (isMultiSigBool.value) {
        
      //   let selectedCosignList = getWalletCosigner.value.cosignerList;
      //   if (selectedCosignList.length > 1) {
      //     selectedCosign = cosignAddress.value;
      //   } else {
      //     selectedCosign = walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==selectedCosignList[0].publicKey).address
      //   }
      // }
      // let transferStatus = await createTransaction(
      //   recipientInput.value.toUpperCase(),
      //   sendXPX.value,
      //   messageText.value,
      //   selectedMosaic.value,
      //   mosaicSupplyDivisibility.value,
      //   walletPassword.value,
      //   selectedAccAdd.value,
      //   selectedCosign,
      //   encryptedMsg.value
      // );
      // if (!transferStatus) {
      //   err.value = t('general.walletPasswordInvalid',{name : walletState.currentLoggedInWallet.name});
      // } else {
        
      //   err.value = "";
       
      //   if (!accountUtils.checkAvailableContact(recipientInput.value)) {
          
      //     // add new contact
      //     togglaAddContact.value = true;
      //   } else {
      //     clearInput();
      //   }
      //   forceSend.value = false;
      // }
  }

  const totalFee = computed(()=>{
    let tokenDivisibility = AppState.nativeToken.divisibility
    if(!isMultiSig(selectedAccAdd.value) ){
      if(tokenDivisibility==0){
        return Math.trunc(parseFloat(effectiveFee.value))
      }else{
        return Math.round((parseFloat(effectiveFee.value))*Math.pow(10,tokenDivisibility))/Math.pow(10,tokenDivisibility)
      }
    }else {
      if(tokenDivisibility== 0){
        return Math.trunc((parseFloat(effectiveFee.value)+ lockFundTxFee.value + lockFund.value))
      }else{
        return Math.round((parseFloat(effectiveFee.value)+ lockFundTxFee.value + lockFund.value)*Math.pow(10,tokenDivisibility))/ Math.pow(10,tokenDivisibility)
      }
    }
  })

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

  emitter.on("select-account", (address) => {
    selectedAccName.value = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==address)? walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==address).name : walletState.currentLoggedInWallet.others.find(acc=>acc.address==address).name
    selectedAccAdd.value = address;
  });
  
    
  
  // confirm modal
  emitter.on("CLOSE_CONFIRM_SEND_MODAL", (payload) => {
    toggleConfirm.value = payload;
  });
  emitter.on("CONFIRM_PROCEED_SEND", (payload) => {
    if (payload) {
      forceSend.value = payload;
      toggleConfirm.value = false;
      updateMetadata();
    }
  });
    return {
      findAcc,
      totalFee,
      toggleContact,
      showMenu,
      selectedAccName,
      selectedAccAdd,
      err,
      walletPassword,
      clearInput,
      showPasswdError,
      accounts,
      updateMetadata,
      toggleConfirm,
      isMultiSig,
      isMultiSigBool,
      effectiveFee,
      cosignAddress,
      getWalletCosigner,
      disablePassword,
      cosignerBalanceInsufficient,
      lockFundCurrency,
      currencyName,
      lockFundTxFee,
      lockFundTotalFee,
      splitBalance,
      walletName,
      currentNativeTokenName,
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