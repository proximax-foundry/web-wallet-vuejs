<template>
  <div>
    <div class='w-10/12 ml-auto mr-auto'>
        <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
            <div class="xl:col-span-2 p-12">
                <div class="font-semibold mb-4">Update Asset Metadata</div>
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
                    <div class="text-blue-primary text-xxs font-bold uppercase mb-1">{{$t('asset.assetCreatedBy')}}</div>
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
                    <img src="@/modules/services/submodule/assets/img/icon-asset.svg">
                    <div class="ml-1">
                        <div class="uppercase text-blue-primary font-semibold text-xxs">ASSET ID</div>
                        <div class="text-black text-sm font-bold">{{ targetId }}</div>
                    </div>
                </div>
                <div class="mt-2" v-if="existingScopedMetadataKeys.length && scopedMetadataKeySelectable" >
                  <div @click="showKeys = !showKeys" class="text-blue-primary text-xs cursor-pointer mb-1.5">Select Existing Scoped Metadata Key</div>
                  <div v-for="(metadata,index) in existingScopedMetadataKeys" :key="index" >
                    <div v-if="showKeys" class="flex justify-center cursor-pointer" @click="scopedMetadataKeyType=metadata.type,inputScopedMetadataKey=metadata.value,checkOldValue(),showKeys = false">
                      <div v-if="index%2==0" class="text-xs py-2 bg-gray-100 pl-2 w-full">{{metadata.value}}</div>
                      <div v-if="index%2==1" class="text-xs py-2 pl-2 w-full">{{metadata.value}}</div>
                      <div v-if="index%2==0" class="ml-auto pr-2 text-xxs py-2 font-semibold uppercase text-blue-primary bg-gray-100">{{$t('general.select')}}</div>
                      <div v-if="index%2==1" class="ml-auto mr-2 text-xxs py-2 font-semibold uppercase text-blue-primary">{{$t('general.select')}}</div>
                    </div>
                  </div>
                </div>
                <div v-if="scopedMetadataKeySelectable">
                  <MetadataInput :hex="scopedMetadataKeyType==2" class="mt-5" v-model="inputScopedMetadataKey"  placeholder="Scoped Metadata Key" v-debounce:1000="checkOldValue" :toolTip="`${scopedMetadataKeyType==1?'Accepts up to 8 bytes':'Accepts up to 16 hexadecimals'}`" :showError="showScopedKeyErr" :errorMessage="`${scopedMetadataKeyType==1?'Exceeded 8 bytes':inputScopedMetadataKey.length>16?'Exceeded 16 hexadecimals':'Input needs to be even number'}`" />
                  <div class="flex gap-3 ">
                      <div class="flex gap-2">
                          <input  type="radio" id="regular" value="1" v-model="scopedMetadataKeyType">
                          <label for="regular">UTF-8</label>
                      </div>
                      <div class="flex gap-2">
                          <input  type="radio" id="hexa" value="2" v-model="scopedMetadataKeyType">
                          <label for="hexa">Hexadecimal</label>
                      </div>
                  </div>
                  <MetadataInput class="mt-2" v-model="oldValue" :disabled="true" placeholder="Current Value"/>
                </div>
                <div class="my-3" v-else>
                  <div class="border border-blue-primary p-4 bg-blue-100 rounded mt-5">
                    <div class="flex flex-col gap-0.5">
                        <div class="uppercase text-xxs font-semibold text-blue-primary">Selected Scoped Metadata Key</div>
                        <div class="flex">
                          <div class="font-semibold" >{{scopedMetadataKey}}</div>
                          <div class="ml-3 text-gray-400 font-semibold">{{scopedMetadataKeyType==1?"UTF-8":"HEX"}}</div>
                        </div>
                        <div class="flex">
                          <div class="font-semibold" v-if="scopedMetadataKeyType==1">{{scopedMetadataKeyHex}}</div>
                          <div v-if="scopedMetadataKeyType==1" class="ml-3 text-gray-400 font-semibold">HEX</div>
                        </div>
                    </div>
                  </div>
                  <div class="border border-blue-primary p-4 bg-blue-100 rounded mt-5">
                    <div class="uppercase text-xxs text-blue-primary font-semibold">CURRENT VALUE</div>
                    <div class="font-semibold">{{oldValue}}</div>
                  </div>
                </div>
                <MetadataInput class="mt-2" v-model="newValue"  placeholder="New Value"/>
            </div>
            <div class="bg-navy-primary py-6 px-12 xl:col-span-1">
                <TransactionFeeDisplay :transaction-fee="transactionFee" :total-fee-formatted="totalFeeFormatted" :get-multi-sig-cosigner="getMultiSigCosigner" :check-cosign-balance="checkCosignBalance" :lock-fund-currency="String(lockFundCurrency)" :lock-fund-tx-fee="String(lockFundTxFee)" :balance="accBalance" :selected-acc-add="selectedAccAdd"/>
                <div class='text-xs text-white my-5'>{{$t('general.enterPasswordContinue')}}</div>
                <PasswordInput  :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')"  v-model="walletPassword" icon="lock" class="mt-5 mb-3" />
                <button type="submit" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="updateMetadata()" :disabled="disableAddBtn">
                    Update Asset Metadata
                </button>
                <div class="text-center">
                <router-link :to="{name: 'ViewServicesAssets'}" class='content-center text-xs text-white border-b-2 border-white'>{{$t('general.cancel')}}</router-link>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Helper } from "@/util/typeHelper";
import { computed, ref, watch } from "vue";
import PasswordInput from "@/components/PasswordInput.vue";
import {useI18n} from 'vue-i18n'
import {MultisigUtils} from '@/util/multisigUtils'
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { TransactionUtils, findAcc } from "@/util/transactionUtils";
import { WalletUtils } from "@/util/walletUtils";
import { AppState } from '@/state/appState';
import MetadataInput from '@/modules/metadataTxn/components/MetadataInput.vue'
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
import { 
  Convert, MosaicMetadataTransactionBuilder, 
  AggregateTransaction,UInt64,
  MetadataQueryParams, MetadataType, MosaicMetadataTransaction,
  MosaicId,
  Account,
AggregateBondedV1TransactionBuilder
} from 'tsjs-xpx-chain-sdk';
import { WalletAccount } from '@/models/walletAccount';
import { OtherAccount } from '@/models/otherAccount';
import { ThemeStyleConfig } from '@/models/stores';
import { toSvg } from 'jdenticon';
import UTF8 from 'utf-8';
import { useRouter } from 'vue-router';
import { TransactionState } from "@/state/transactionState";
export default { 
  name: "ViewUpdateAssetMetadata",
  props:{
    targetId: String,
    scopedMetadataKey: String,
  },
  components: {
    MetadataInput,
    PasswordInput,
    TransactionFeeDisplay,
  },
  setup(props) { 
    const router = useRouter()
    let showKeys = ref(false)
    let scopedMetadataKeySelectable = ref(true);
    let scopedMetadataKeyType = ref(1);
    let targetPublicAccount = ref(null);
    let targetAsset: MosaicId = null;
    let targetAccIsMultisig = ref(false);
    let scopedMetadataKeyHex = ref("");
    let inputScopedMetadataKey = ref("");
    let selectedAcc = ref<WalletAccount | OtherAccount>(null);
    let txnBuilder: MosaicMetadataTransactionBuilder;
    let aggregateTxnBuilder: AggregateBondedV1TransactionBuilder;
    let metadataTxn: MosaicMetadataTransaction;
    let aggregateTxn: AggregateTransaction;
    const oldValue = ref("");
    const newValue = ref("");
    const themeConfig :any = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();
    const svgString = computed(()=>toSvg(selectedAcc.value?selectedAcc.value.address:'', 40, themeConfig.jdenticonConfig))
    const accountName = computed(()=>selectedAcc.value?walletState.currentLoggedInWallet.convertAddressToName(selectedAcc.value.address,true):'')
    const existingScopedMetadataKeys = ref<{value:string,type:number}[]>([])
    const defaultAcc = walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.selectDefaultAccount(): null
    const selectedAccAdd = ref(defaultAcc?defaultAcc.address:'');
    const accBalance = ref(Helper.toCurrencyFormat(defaultAcc?defaultAcc.balance:0, AppState.nativeToken.divisibility));
     const removeDoubleZero = (string :string) =>{
        let isZero = string.endsWith('00')
        if(isZero){
            string = string.substring(0, string.length - 2);
            string = removeDoubleZero(string)
        }
        return string
    }

    const convertUtf8 = (scopedMetadataKey :string)=>{
        scopedMetadataKey =  removeDoubleZero(scopedMetadataKey )
        let bytes = Convert.hexToUint8(scopedMetadataKey );
        if(!UTF8.isNotUTF8(bytes)){
            scopedMetadataKey  = Convert.decodeHexToUtf8(scopedMetadataKey)
        }
        return scopedMetadataKey
        
    }
    const fetchExistingKeys = ()=>{
      let metadataQueryParams = new MetadataQueryParams()
      metadataQueryParams.metadataType = MetadataType.MOSAIC
      metadataQueryParams.targetId = targetAsset
      AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams).then(metadata=>{
        metadata.metadataEntries.forEach(metadataEntry=>{
           existingScopedMetadataKeys.value.push({
              value: metadataEntry.scopedMetadataKey.toHex() == convertUtf8(metadataEntry.scopedMetadataKey.toHex())?metadataEntry.scopedMetadataKey.toHex(): convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
              type: metadataEntry.scopedMetadataKey.toHex() == convertUtf8(metadataEntry.scopedMetadataKey.toHex())? 2: 1
           })
        })
      })
    }
    const handleParamTargetId = async ()=>{
      if(props.targetId && props.targetId.length === 16 && Convert.isHexString(props.targetId)){
        let assetId = new MosaicId(props.targetId);
        targetAsset = assetId;
        txnBuilder.targetMosaicId(targetAsset);

        let assetInfo = await AppState.chainAPI.assetAPI.getMosaic(assetId);
        targetPublicAccount.value = assetInfo.owner;
        txnBuilder.targetPublicKey(targetPublicAccount.value);
        if(!walletState.currentLoggedInWallet){
          return
        }
        selectedAcc.value = walletState.currentLoggedInWallet.accounts.find(acc=> acc.publicKey === assetInfo.owner.publicKey) || walletState.currentLoggedInWallet.others.find(acc=> acc.publicKey === assetInfo.owner.publicKey);
        if(selectedAcc.value){
          targetAccIsMultisig.value = selectedAcc.value.getDirectParentMultisig().length? true: false
        }
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
          scopedMetadataKeyHex.value = props.scopedMetadataKey;
          txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex.value));
          
        }
        else{
          scopedMetadataKeyType.value = 1;
          let tempHexData = Convert.utf8ToHex(props.scopedMetadataKey);
          const hexDataBytes = tempHexData.length / 2;

          if(tempHexData.length && hexDataBytes <= 8){
            if((tempHexData.length/2) < 8){
              tempHexData = tempHexData + "00".repeat(8 - hexDataBytes);
            }
            scopedMetadataKeyHex.value = tempHexData;
            txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex.value));
            
          }
        }
      }
    }

    const createTxnBuilder = () =>{
      txnBuilder = AppState.buildTxn.assetMetadataBuilder();
      aggregateTxnBuilder = AppState.buildTxn.aggregateBondedBuilder();
    }

    const loadCurrentMetadataValue = async () =>{
      if(targetAsset && scopedMetadataKeyHex.value){

        let metadataQueryParams = new MetadataQueryParams();
        metadataQueryParams.targetId = targetAsset;
        metadataQueryParams.metadataType = MetadataType.MOSAIC;
        metadataQueryParams.scopedMetadataKey = UInt64.fromHex(scopedMetadataKeyHex.value);

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

    const buildMetadataTxn = ()=>{
      metadataTxn = txnBuilder.calculateDifferences().build();
    }

    const buildAggregateTxn = ()=>{
      if(metadataTxn){
        aggregateTxn = aggregateTxnBuilder.innerTransactions([metadataTxn.toAggregateV1(targetPublicAccount.value)]).build();
      }
    }

    const updateAggregateFee = ()=>{
      if(aggregateTxn){
        aggregateFee.value = aggregateTxn.maxFee.compact()/Math.pow(10,AppState.nativeToken.divisibility)
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
      fetchExistingKeys()
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
    const err = ref('');
    const walletName = walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.name : ''
    
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
      metadataQueryParams.targetId = targetAsset;
      metadataQueryParams.metadataType = MetadataType.MOSAIC;
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
      let mosaicMetadataTransaction = txnBuilder
      .targetPublicKey(targetPublicAccount.value)
      .targetMosaicId(targetAsset)
      .scopedMetadataKey(UInt64.fromHex(tempHexData))
      .value(newValue.value)
      .oldValue(oldValue.value)
      .calculateDifferences()
      .build()
      let aggregateTx = targetAccIsMultisig.value?
      aggregateTxnBuilder.innerTransactions([mosaicMetadataTransaction.toAggregateV1(targetPublicAccount.value)]).build():
      AppState.buildTxn.aggregateCompleteBuilder().innerTransactions([mosaicMetadataTransaction.toAggregateV1(targetPublicAccount.value)]).build()
      let signer = targetAccIsMultisig.value? 
      walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == selectedCosigner.value):
      walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == targetPublicAccount.value.publicKey) 
      let encryptedPassword = WalletUtils.createPassword(walletPassword.value);
      let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, signer.encrypted, signer.iv);
      let signerAcc = Account.createFromPrivateKey(privateKey, AppState.networkType,1);
      let signedAggregateTransaction = signerAcc.preV2Sign(aggregateTx, networkState.currentNetworkProfile.generationHash);
      if(targetAccIsMultisig.value){
        let lockHashTx = TransactionUtils.lockFundTx(signedAggregateTransaction)
        let signedLockHashTransaction = signerAcc.preV2Sign(lockHashTx, networkState.currentNetworkProfile.generationHash);
        TransactionState.lockHashPayload = signedLockHashTransaction.payload
        //TransactionUtils.announceLF_AND_addAutoAnnounceABT(signedLockHashTransaction,signedAggregateTransaction) 
      }
      /*else{
        TransactionUtils.announceTransaction(signedAggregateTransaction)
      }*/
      inputScopedMetadataKey.value=""
      oldValue.value = ""
      newValue.value=""
      walletPassword.value=""
      TransactionState.transactionPayload = signedAggregateTransaction.payload
      router.push({ name: "ViewConfirmTransaction", params: { txnPayload: TransactionState.transactionPayload.toString(), hashLockTxnPayload: TransactionState.lockHashPayload?TransactionState.lockHashPayload.toString():null, selectedAddress: targetPublicAccount.value.address.plain()} })
      
    }

    const totalFee = computed(()=>{
      let tokenDivisibility = AppState.nativeToken.divisibility
      if(targetAccIsMultisig.value){
        if(tokenDivisibility==0){
          return Math.trunc(lockFund.value+lockFundTxFee.value+aggregateFee.value)
        }else{
          return Math.round((lockFund.value+lockFundTxFee.value+aggregateFee.value)*Math.pow(10,tokenDivisibility))/Math.pow(10,tokenDivisibility)
        }
      }else{
        return aggregateFee.value
      }
      
    })
    const cosigners = computed(()=>{
      if(!walletState.currentLoggedInWallet || !targetPublicAccount.value){
        return []
      }
      if(MultisigUtils.getCosignerInWallet(targetPublicAccount.value.publicKey).cosignerList.length){
        if(accounts.value){
          return MultisigUtils.getCosignerInWallet(targetPublicAccount.value.publicKey).cosignerList.map(cosigner=>{
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

    const transactionFee = computed(() => {
      return aggregateFee.value.toString()
    })

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
      let cosignBalance = findAcc(selectedCosigner.value)?findAcc(selectedCosigner.value).balance:0;
      return Helper.toCurrencyFormat(cosignBalance,3);
    })

    watch(oldValue,n=>{
      txnBuilder.oldValue(n) 
      buildMetadataTxn()
      buildAggregateTxn()
      updateAggregateFee()
    })
    watch(newValue,n=>{
      txnBuilder.value(n) 
      buildMetadataTxn()
      buildAggregateTxn()
      updateAggregateFee()
    })
    watch(inputScopedMetadataKey,n=>{
      if(n==""){
        oldValue.value = ""
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
      selectedCosigner,
      existingScopedMetadataKeys,
      showKeys,
      scopedMetadataKeySelectable,
      scopedMetadataKeyHex,
      transactionFee,
      totalFeeFormatted,
      selectedAccAdd,
      accBalance,
      getMultiSigCosigner,
      checkCosignBalance
    };
  },
};
</script>
