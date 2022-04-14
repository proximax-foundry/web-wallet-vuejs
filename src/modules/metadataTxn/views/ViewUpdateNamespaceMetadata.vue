<template>
  <div>
    <div class='flex cursor-pointer'>
        <img src='@/assets/img/chevron_left.svg'>
        <router-link :to="{name: 'ViewServicesAssets'}" class='text-blue-primary text-xs mt-0.5'>{{$t('general.back')}}</router-link>
    </div>
    <div class='w-10/12 ml-auto mr-auto'>
        <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
            <div class="xl:col-span-2 p-12">
                <div class="font-semibold mb-4">Update Namespace Metadata</div>
                <div v-if="showBalanceErr" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
                    <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2">
                        <font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon>
                    </div>
                    <div class="inline-block text-xs">{{$t('general.insufficientBalance')}}</div>
                </div>
                 <div class=" error error_box mb-5" v-if="err!=''">{{ err }}</div>
                <div class="flex items-center">
                    <div v-html="svgString" class="inline-block" />
                    <div class="ml-2">
                    <div class="text-blue-primary text-xxs font-bold uppercase mb-1">{{$t('namespace.namespaceCreatedBy')}}</div>
                    <div class="font-bold text-black text-sm">{{ accountName}}</div>
                    </div>
                </div>
                 <div v-if="targetAccIsMultisig" class="text-left mt-2 mb-5 ml-4"> 
                    <div v-if="cosigners.length > 0">
                        <div class="text-tsm">
                            {{$t('general.initiateBy')}}:
                            <span class="font-bold" v-if="cosigners.length == 1"> 
                            {{ cosigners[0].name }} 
                            </span>
                            <span class="font-bold" v-else>
                            <select class="" v-model="selectedCosigner">
                                <option v-for="(cosigner, item) in  cosigners" :value="findAcc(cosigner.publicKey).publicKey" :key="item">
                                {{ cosigner.name }} 
                                </option>
                            </select>
                            </span>
                        </div>
                    </div>
                    <div class="error" v-else>
                    {{$t('general.noCosigner')}} 
                    </div>
                </div>
                <div class="border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5">
                    <img src="@/modules/services/submodule/namespaces/img/icon-namespace.svg">
                    <div class="ml-1">
                        <div class="uppercase text-blue-primary font-semibold text-xxs">NAMESPACE ID</div>
                        <div class="text-black text-sm font-bold">{{ targetId }}</div>
                    </div>
                </div>
                <MetadataInput :hex="scopedMetadataKeyType==2" class="mt-5" v-model="inputScopedMetadataKey" placeholder="Scoped Metadata Key" v-debounce:1000="checkOldValue" :toolTip="`${scopedMetadataKeyType==1?'Accepts 8 characters':'Accepts 16 hexadecimals'}`" :showError="showScopedKeyErr" :errorMessage="`${scopedMetadataKeyType==1?'Exceeded 8 characters':inputScopedMetadataKey.length>16?'Exceeded 16 hexadecimals':'Input needs to be even number'}`" />
                <div class="flex gap-3 ">
                    <div class="flex gap-2">
                        <input type="radio" id="regular" value="1" v-model="scopedMetadataKeyType">
                        <label for="regular">Regular</label>
                    </div>
                    <div class="flex gap-2">
                        <input type="radio" id="hexa" value="2" v-model="scopedMetadataKeyType">
                        <label for="hexa">Hexadecimal</label>
                    </div>
                </div>
                <MetadataInput class="mt-2" v-model="oldValue" :disabled="true" placeholder="Old Value"/>
                <MetadataInput class="mt-2" v-model="newValue"  placeholder="New Value"/>
            </div>
            <div class="bg-navy-primary py-6 px-12 xl:col-span-1">
                <div v-if="!targetAccIsMultisig" class='font-semibold text-xxs text-blue-primary uppercase'>{{$t('general.accCurrentBalance')}}</div>
                <div v-else class='font-semibold text-xxs text-blue-primary uppercase'>{{$t('general.initiatorCurrentBalance')}}</div>
                <div class="flex my-1 text-white">
                    <div class = 'text-md font-bold '>{{splitBalance.left}} </div>
                    <div class = 'text-md font-bold ' v-if='splitBalance.right!=null'>.</div>
                    <div class='text-xs mt-1.5 font-bold'>{{splitBalance.right}}</div>
                    <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
                    <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5 mt-0.5'>
                </div>
                <div class="flex  text-white">
                    <div class='text-xs '>{{$t('general.lockFund')}}</div>
                    <div class="text-xs  ml-auto">{{lockFund}}</div>
                    <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
                </div>
                <div class="flex  text-white">
                    <div class='text-xs '>{{$t('general.lockFundTxFee')}}</div>
                    <div class="text-xs  ml-auto">{{lockFundTxFee}}</div>
                    <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
                </div>
                <div class='border-b-2 border-gray-600 my-2'/>
                <div class="flex  text-white">
                    <div class='text-xs '>{{$t('general.aggregateFee')}}</div>
                    <div class="text-xs  ml-auto">{{aggregateFee}}</div>
                    <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
                </div>
                <div class='border-b-2 border-gray-600 my-2'/>
                <div class="flex  text-white">
                    <div class='text-xs '>{{$t('general.total')}}</div>
                    <div class="text-xs  ml-auto">{{totalFee}}</div>
                    <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
                </div>
                <div class='text-xs text-white my-5'>{{$t('general.enterPasswordContinue')}}</div>
                <PasswordInput  :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')"  v-model="walletPassword" icon="lock" class="mt-5 mb-3" />
                <button type="submit" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="updateMetadata()" :disabled="disableAddBtn">
                    Update Namespace Metadata
                </button>
                <div class="text-center">
                <router-link :to="{name: 'ViewServicesNamespace'}" class='content-center text-xs text-white border-b-2 border-white'>{{$t('general.cancel')}}</router-link>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Helper } from "@/util/typeHelper";
import { computed, ref, getCurrentInstance, watch} from "vue";
import PasswordInput from "@/components/PasswordInput.vue";
import {useI18n} from 'vue-i18n'
import { multiSign } from "@/util/multiSignatory";
import { walletState } from "@/state/walletState";

import { TransactionUtils } from "@/util/transactionUtils";

import { AppState } from '@/state/appState';
import { 
  Address, PublicAccount, Convert, NamespaceMetadataTransactionBuilder, 
  AggregateTransaction, AggregateBondedTransactionBuilder, UInt64,
  MetadataQueryParams, MetadataType, NamespaceMetadataTransaction,
  NamespaceId,
  Account
} from 'tsjs-xpx-chain-sdk';
import { WalletAccount } from '@/models/walletAccount';
import { OtherAccount } from '@/models/otherAccount';
import { ThemeStyleConfig } from '@/models/stores';
import { toSvg } from 'jdenticon';
import { networkState } from '@/state/networkState';
import MetadataInput from '@/modules/metadataTxn/components/MetadataInput.vue'
import { WalletUtils } from '@/util/walletUtils';
export default { 
  name: "ViewUpdateNamespaceMetadata",
  props:{
    targetId: String,
    scopedMetadataKey: String,
  },
  components: {
    MetadataInput,
    PasswordInput,
   
  },
  setup(props) {
    let targetNamespaceSelectable = ref(true);
    let scopedMetadataKeySelectable = ref(true);
    let scopedMetadataKeyType = ref(1);
    let targetPublicAccount = ref(null);
    let targetNamespace: NamespaceId = null;
    let targetAccIsMultisig = ref(false);
    let scopedMetadataKeyHex = "";
    let inputScopedMetadataKey = ref("");
    let selectedAcc = ref<WalletAccount | OtherAccount>(null); 
    let txnBuilder: NamespaceMetadataTransactionBuilder;
    let aggregateTxnBuilder: AggregateBondedTransactionBuilder;
    let metadataTxn: NamespaceMetadataTransaction;
    let aggregateTxn: AggregateTransaction;
    const oldValue = ref("");
    const newValue = ref(""); 
     const themeConfig :any = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();
    const svgString = computed(()=>toSvg(selectedAcc.value?selectedAcc.value.address:'', 40, themeConfig.jdenticonConfig))
    const accountName = computed(()=>selectedAcc.value?walletState.currentLoggedInWallet.convertAddressToName(selectedAcc.value.address,true):'')
    const handleParamTargetId = async ()=>{
      if(props.targetId.length === 16 && Convert.isHexString(props.targetId)){
        targetNamespaceSelectable.value = false;
        let uint64Id = UInt64.fromHex(props.targetId);
        let namespaceId = new NamespaceId([uint64Id.lower, uint64Id.higher]);
        targetNamespace = namespaceId;
        txnBuilder.targetNamespaceId(targetNamespace);
      }
      else{
        try {
          let namespaceId = new NamespaceId(props.targetId);
          targetNamespace = namespaceId;
          txnBuilder.targetNamespaceId(targetNamespace);
        } catch (error) {
          return;
        }
      }

      let namespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespace(targetNamespace);
      targetPublicAccount.value = namespaceInfo.owner;
      txnBuilder.targetPublicKey(targetPublicAccount);

       if(!walletState.currentLoggedInWallet){
          return
        }
        selectedAcc.value = walletState.currentLoggedInWallet.accounts.find(acc=> acc.publicKey === namespaceInfo.owner.publicKey) || walletState.currentLoggedInWallet.others.find(acc=> acc.publicKey === namespaceInfo.owner.publicKey);
        if(selectedAcc.value){
          targetAccIsMultisig.value = selectedAcc.value.getDirectParentMultisig().length? true: false
        }
    }
    const otherAcc = computed(()=>{
      if(!walletState.currentLoggedInWallet){
          return null
      }
      if(targetPublicAccount.value){
        return walletState.currentLoggedInWallet.others.find(acc=> acc.publicKey === targetPublicAccount.value.publicKey)
      }
      return null
    })

    watch(otherAcc,async(n)=>{
      if(n){
        selectedAcc.value = walletState.currentLoggedInWallet.accounts.find(acc=> acc.publicKey === targetPublicAccount.value.publicKey) || walletState.currentLoggedInWallet.others.find(acc=> acc.publicKey === targetPublicAccount.value.publicKey);
        if(selectedAcc.value){
          targetAccIsMultisig.value = selectedAcc.value.getDirectParentMultisig().length? true: false
        }
      }
    },{deep:true})

    const handleParamScopedMetadataKey = ()=>{
      if(props.scopedMetadataKey){
        scopedMetadataKeySelectable.value = false;

        inputScopedMetadataKey.value = props.scopedMetadataKey;

        if(props.scopedMetadataKey.length === 16 && Convert.isHexString(props.scopedMetadataKey)){
          scopedMetadataKeyType.value = 2;
          scopedMetadataKeyHex = props.scopedMetadataKey;
          txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex));
          
        }
        else{
          scopedMetadataKeyType.value = 1;
          let tempHexData = Convert.utf8ToHex(props.scopedMetadataKey);
          const hexDataBytes = tempHexData.length / 2;

          if(tempHexData.length && hexDataBytes <= 8){
            if((tempHexData.length/2) < 8){
              tempHexData = tempHexData + "00".repeat(8 - hexDataBytes);
            }
            scopedMetadataKeyHex = tempHexData;
            txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex));
            
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
        
      }
      txnBuilder.oldValue(oldValue.value);
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
        aggregateFee.value =  aggregateTxn.maxFee.compact()/Math.pow(10,AppState.nativeToken.divisibility)
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
    const {t} = useI18n();
    const walletPassword = ref("");
    const err = ref("");
    const walletName = walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.name:''
    const lockFund = computed(() =>{ 
      if(!networkState.currentNetworkProfileConfig){
        return 0
      }
      return Helper.convertToExact(
        networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
        AppState.nativeToken.divisibility
      )
    });
    const lockFundCurrency = computed(() =>{
      if(!networkState.currentNetworkProfileConfig){
        return 0
      }
      return Helper.convertToCurrency(
        networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
        AppState.nativeToken.divisibility
      )
    });
    
    const lockFundTxFee = computed(()=>{
      if(networkState.currentNetworkProfile){
        return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
      }
      return 0;  
    });

    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const showScopedKeyErr = computed(()=>{
      if(scopedMetadataKeyType.value==1){ //regular
        let tempHexData = Convert.utf8ToHex(inputScopedMetadataKey.value);
        let hexDataBytes = tempHexData.length / 2;
        if(hexDataBytes>8){
            return true
        }else{
            return false
        }
      }else{ //hexa
        if((inputScopedMetadataKey.value.length>16) ){
          return true
        }
        else if(inputScopedMetadataKey.value.length%2===1){
          return true
        }
        else{
          return false
        }
      }
    })

    const showBalanceErr = computed(()=>{
      if(balance.value<totalFee.value){
          return true
      }else{
          return false
      }
    })
    
    const disableAddBtn = computed(()=>{
        return (showScopedKeyErr.value==true ||inputScopedMetadataKey.value==''||newValue.value==''||!walletPassword.value.match(passwdPattern)||showBalanceErr.value==true)
    })

    const findAcc = (publicKey)=>{
      if(!walletState.currentLoggedInWallet){
        return
      }
      return walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==publicKey)
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

  const aggregateFee = ref(0);

  watch(scopedMetadataKeyType,n=>{
      checkOldValue()
      if(n==2){
        if(!Convert.isHexString(inputScopedMetadataKey.value)){
          inputScopedMetadataKey.value = ''
        }
      }
    })
    const checkOldValue = async()=>{
      if(showScopedKeyErr.value || inputScopedMetadataKey.value.length==0){
        return
      }
      let tempHexData = ''
      if(scopedMetadataKeyType.value==1){ //utf8
        let hexValue = Convert.utf8ToHex(inputScopedMetadataKey.value)
        tempHexData = hexValue + "00".repeat((16-hexValue.length)/2)
      }else{ //hex
        tempHexData = "00".repeat((16-inputScopedMetadataKey.value.length)/2) + inputScopedMetadataKey.value 
      }
      let metadataQueryParams = new MetadataQueryParams();
      metadataQueryParams.targetId = targetNamespace;
      metadataQueryParams.metadataType = MetadataType.NAMESPACE;
      metadataQueryParams.scopedMetadataKey = UInt64.fromHex(tempHexData);
      let searchResults = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);
      if(searchResults.metadataEntries.length){
        oldValue.value = searchResults.metadataEntries[0].value;
      }else{
        oldValue.value = ""
      }
    }
  
    const updateMetadata = () => {   
      if(!walletState.currentLoggedInWallet){
        return
      }
      if(!WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPassword.value)){
        err.value = t('general.walletPasswordInvalid',{name: walletName})
        return
      }
      
      let tempHexData = ''
      if(scopedMetadataKeyType.value==1){ //utf8
        let hexValue = Convert.utf8ToHex(inputScopedMetadataKey.value)
        tempHexData = hexValue + "00".repeat((16-hexValue.length)/2)
      }else{ //hex
        tempHexData = "00".repeat((16-inputScopedMetadataKey.value.length)/2)+inputScopedMetadataKey.value 
      }
      let namespaceMetadataTransaction = txnBuilder
      .targetPublicKey(targetPublicAccount.value)
      .scopedMetadataKey(UInt64.fromHex(tempHexData))
      .value(newValue.value)
      .oldValue(oldValue.value)
      .calculateDifferences()
      .build()
      let abtTx = aggregateTxn = aggregateTxnBuilder.innerTransactions([namespaceMetadataTransaction.toAggregate(targetPublicAccount.value)]).build()
      let signer = targetAccIsMultisig.value? 
      walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == selectedCosigner.value):
      walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == targetPublicAccount.value.publicKey) 
      let encryptedPassword = WalletUtils.createPassword(walletPassword.value);
      let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, signer.encrypted, signer.iv);
      let signerAcc = Account.createFromPrivateKey(privateKey, AppState.networkType);
      let signedAbtTransaction = signerAcc.sign(abtTx, networkState.currentNetworkProfile.generationHash);
      let lockHashTx = TransactionUtils.lockFundTx(signedAbtTransaction)
      let signedLockHashTransaction = signerAcc.sign(lockHashTx, networkState.currentNetworkProfile.generationHash);
      TransactionUtils.announceLF_AND_addAutoAnnounceABT(signedLockHashTransaction,signedAbtTransaction) 
      inputScopedMetadataKey.value=""
      oldValue.value = ""
      newValue.value=""
      walletPassword.value=""
    }

    const totalFee = computed(()=>{
      let tokenDivisibility = AppState.nativeToken.divisibility
      if(tokenDivisibility==0){
          return Math.trunc(lockFund.value+lockFundTxFee.value+aggregateFee.value)
      }else{
          return Math.round((lockFund.value+lockFundTxFee.value+aggregateFee.value)*Math.pow(10,tokenDivisibility))/Math.pow(10,tokenDivisibility)
      }
    })

    const cosigners = computed(()=>{
      if(!walletState.currentLoggedInWallet || !targetPublicAccount.value){
        return []
      }
      if(multiSign.getCosignerInWallet(targetPublicAccount.value.publicKey).cosignerList.length){
        if(accounts.value){
          return multiSign.getCosignerInWallet(targetPublicAccount.value.publicKey).cosignerList.map(cosigner=>{
            let foundCosigner = accounts.value.find(acc=>acc.publicKey==cosigner)
            return{
              name: foundCosigner.name,
              publicKey:cosigner,
              balance:foundCosigner.balance
            }
          })
        }else{
          return []
        }
      }else{
        return []
      }
    })
    const selectedCosigner = ref('')

    if(cosigners.value.length>0){
        selectedCosigner.value = cosigners.value[0].publicKey
    }

    watch(()=>cosigners,n=>{
      if(n.value.length){
        selectedCosigner.value = cosigners.value[0].publicKey
      }
    },{deep:true})

    const balance = computed(() => {
      if (!walletState.currentLoggedInWallet) {
        return 0
      }
      if(targetAccIsMultisig.value){
        if(selectedCosigner.value){
            return findAcc(selectedCosigner.value).balance
        }else{
            return 0
        }
    }else{
        if(selectedAcc.value){
            return selectedAcc.value.balance
        }else{
            return 0
        }
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

  
    return {
      findAcc,
      totalFee,
      err,
      walletPassword,
      showPasswdError,
      accounts,
      updateMetadata,
      targetAccIsMultisig,
      lockFundCurrency,
      lockFund,
      aggregateFee,
      lockFundTxFee,
      splitBalance,
      walletName,
      currentNativeTokenName,
      oldValue,
      newValue,
      cosigners,
      scopedMetadataKeyType,
      svgString,
      accountName,
      disableAddBtn,
      showBalanceErr,
      showScopedKeyErr,
      inputScopedMetadataKey,
      checkOldValue,
      selectedCosigner
    };
  },
};
</script>
