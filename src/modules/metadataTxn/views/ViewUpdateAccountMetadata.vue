<template>
<div>
    <div class='flex cursor-pointer'>
        <img src='@/assets/img/chevron_left.svg'>
        <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>{{$t('general.back')}}</router-link>
    </div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <AccountComponent :address="accountAddress" class="mb-10"/>
        <AccountTabs :address="accountAddress" selected="metadata" />
        <div class="border-2 border-t-0 filter shadow-lg lg:grid lg:grid-cols-5" >
            <div class="lg:col-span-3 py-6 px-6">
                <div class='pl-6'>
                    <div class=" error error_box mb-5" v-if="err!=''">{{ err }}</div>
                </div>
                <div v-if="targetAccIsMultisig" class="text-left mt-2 mb-5 "> 
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
                <div class="font-semibold mb-4">Update Account Metadata</div>
                <div class="border border-blue-300 rounded-md p-3 mt-3 bg-blue-50">
                    <div class="flex items-center gap-2">
                        <div v-html="svgString"  />
                        <div class="flex flex-col gap-0.5">
                            <div class="uppercase text-xxs text-blue-primary">Selected Account</div>
                            <div class="font-semibold">{{accountName}}</div>
                        </div>
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
                  <div class="border border-blue-300 rounded-md p-3 mt-3 bg-blue-50">
                    <div class="flex flex-col gap-0.5">
                        <div class="uppercase text-xxs text-blue-primary">Selected Scoped Metadata Key</div>
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
                  <div class="border border-blue-300 rounded-md p-3 mt-3 bg-blue-50">
                    <div class="uppercase text-xxs text-blue-primary">CURRENT VALUE</div>
                    <div class="font-semibold">{{oldValue}}</div>
                  </div>
                </div>
                
                <MetadataInput class="mt-2" v-model="newValue"  placeholder="New Value"/>
            </div>
            <div class='bg-navy-primary p-6 lg:col-span-2'>
              <TransactionFeeDisplay :transaction-fee="transactionFee" :total-fee-formatted="totalFeeFormatted" :get-multi-sig-cosigner="getMultiSigCosigner" :check-cosign-balance="checkCosignBalance" :lock-fund-currency="String(lockFundCurrency)" :lock-fund-tx-fee="String(lockFundTxFee)" :balance="accBalance" :selected-acc-add="selectedAccAdd"/>
                <button type="submit" class="w-full blue-btn px-3 py-3 mt-3 disabled:opacity-50 disabled:cursor-auto" @click="updateMetadata()" :disabled="disableAddBtn">
                    Update Account Metadata
                </button>
                <div class="text-center">
                    <router-link :to="{name: 'ViewAccountMetadata', params: { address: accountAddress}}" class="content-center text-xs text-white underline" >{{$t('general.cancel')}}</router-link>
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
import {MultisigUtils} from '@/util/multisigUtils'
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { TransactionUtils, findAcc } from "@/util/transactionUtils";
import { AppState } from '@/state/appState';
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import MetadataInput from '@/modules/metadataTxn/components/MetadataInput.vue'
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
import { 
  PublicAccount, Convert, AccountMetadataTransactionBuilder, 
  AggregateTransaction, UInt64,
  MetadataQueryParams, MetadataType, AccountMetadataTransaction, Account, AggregateBondedTransactionBuilder
} from 'tsjs-xpx-chain-sdk';
import { WalletAccount } from '@/models/walletAccount';
import { OtherAccount } from '@/models/otherAccount';
import { toSvg } from 'jdenticon';
import { ThemeStyleConfig } from '@/models/stores';
import { WalletUtils } from '@/util/walletUtils';
import UTF8 from 'utf-8';
import { useRouter } from 'vue-router';
import { TransactionState } from "@/state/transactionState";
export default { 
  name: "ViewUpdateAccountMetadata",
  props:{
    targetPublicKey: String,
    scopedMetadataKey: String,
  },
  components: {
    AccountComponent,
    MetadataInput,
    PasswordInput,
    AccountTabs,
    TransactionFeeDisplay
  },
  setup(props) {
    const router = useRouter()
    let showKeys = ref(false)
    let scopedMetadataKeySelectable = ref(true);
    let scopedMetadataKeyType = ref(1);
    let targetPublicAccount = ref<PublicAccount>();
    let targetAccIsMultisig = ref(false);
    let scopedMetadataKeyHex = ref('');
    let inputScopedMetadataKey = ref(""); 
    let selectedAcc = ref<WalletAccount | OtherAccount>(null);
    let txnBuilder: AccountMetadataTransactionBuilder;
    let aggregateTxnBuilder: AggregateBondedTransactionBuilder;
    let metadataTxn: AccountMetadataTransaction;
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

    const fetchExistingKey = ()=>{
      let metadataQueryParams = new MetadataQueryParams()
      metadataQueryParams.metadataType = MetadataType.ACCOUNT
      metadataQueryParams.targetKey = targetPublicAccount.value
      AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams).then(metadata=>{
        metadata.metadataEntries.forEach(metadataEntry=>{
           existingScopedMetadataKeys.value.push({
              value: metadataEntry.scopedMetadataKey.toHex() == convertUtf8(metadataEntry.scopedMetadataKey.toHex())?metadataEntry.scopedMetadataKey.toHex(): convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
              type: metadataEntry.scopedMetadataKey.toHex() == convertUtf8(metadataEntry.scopedMetadataKey.toHex())? 2: 1
           })
        })
      })
    }
    const accountAddress = computed(()=>selectedAcc.value?selectedAcc.value.address:'0'.repeat(40))
    const handleParamTargetPublicKey = async ()=>{
      if(props.targetPublicKey.length === 64 && Convert.isHexString(props.targetPublicKey)){
        targetPublicAccount.value = PublicAccount.createFromPublicKey(props.targetPublicKey, AppState.networkType);
        try {
          let accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(targetPublicAccount.value.address);
          targetPublicAccount.value = PublicAccount.createFromPublicKey(props.targetPublicKey, AppState.networkType, accInfo.version);
        } catch (error) {
          targetPublicAccount.value = PublicAccount.createFromPublicKey(props.targetPublicKey, AppState.networkType, 2);
        }
        txnBuilder.targetPublicKey(targetPublicAccount.value);
      }
      if(!walletState.currentLoggedInWallet){
        return
      }
      selectedAcc.value = walletState.currentLoggedInWallet.accounts.find(acc=> acc.publicKey === props.targetPublicKey) || walletState.currentLoggedInWallet.others.find(acc=> acc.publicKey === props.targetPublicKey);
      if(selectedAcc.value){
        targetAccIsMultisig.value = selectedAcc.value.getDirectParentMultisig().length? true: false
      }
    }
    const otherAcc = computed(()=>{
      if(!walletState.currentLoggedInWallet){
          return null
      }
      if(targetPublicAccount.value){
        return walletState.currentLoggedInWallet.others.find(acc=> acc.publicKey === props.targetPublicKey)
      }
      return null
    })

    watch(otherAcc,async(n)=>{
      if(n){
        if(!walletState.currentLoggedInWallet){
          return
        }
        selectedAcc.value = walletState.currentLoggedInWallet.accounts.find(acc=> acc.publicKey === props.targetPublicKey) || walletState.currentLoggedInWallet.others.find(acc=> acc.publicKey === props.targetPublicKey);
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
          let tempHexData = Convert.utf8ToHex(props.scopedMetadataKey);
          const hexDataBytes = tempHexData.length / 2;

          if(tempHexData.length && hexDataBytes <= 8){
            scopedMetadataKeyType.value = 1;
            if((tempHexData.length/2) < 8){
              tempHexData = tempHexData + "00".repeat(8 - hexDataBytes);
            }
            scopedMetadataKeyHex.value = tempHexData;
            txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex.value));
            
          }
        }
      }
    }

    const createTxnBuilder = async () =>{
      txnBuilder = AppState.buildTxn.accountMetadataBuilder();
      const nodeTime = await AppState.chainAPI.nodeAPI.getNodeTime();
      aggregateTxnBuilder = AppState.buildTxn.aggregateBondedBuilder(new UInt64(nodeTime.sendTimeStamp!));
    }

    const loadCurrentMetadataValue = async () =>{
      if(targetPublicAccount.value && scopedMetadataKeyHex.value){
        let metadataQueryParams = new MetadataQueryParams();
        metadataQueryParams.metadataType = MetadataType.ACCOUNT;
        metadataQueryParams.targetKey = targetPublicAccount.value;
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
        aggregateTxn = aggregateTxnBuilder.innerTransactions([metadataTxn.toAggregate(targetPublicAccount.value)]).build();
      }
    }

    const updateAggregateFee = ()=>{
      if(aggregateTxn){
        aggregateFee.value = aggregateTxn.maxFee.compact()/Math.pow(10,AppState.nativeToken.divisibility)
      } 
    }
    

    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const {t} = useI18n();
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
        return (showScopedKeyErr.value==true ||inputScopedMetadataKey.value==''||newValue.value==''||showBalanceErr.value==true)
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
      metadataQueryParams.targetKey = targetPublicAccount.value;
      metadataQueryParams.metadataType = MetadataType.ACCOUNT;
      metadataQueryParams.scopedMetadataKey = UInt64.fromHex(tempHexData);
      let searchResults = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);
      if(searchResults.metadataEntries.length){
        oldValue.value = searchResults.metadataEntries[0].value;
      }else{
        oldValue.value = ""
      }
    }
    const updateMetadata = async() => {   
       if(!walletState.currentLoggedInWallet){
        return
      }
      
      let tempHexData = ''
      let unsignedTxnPayload: string | string[]
      if(scopedMetadataKeyType.value==1){ //utf8
        let hexValue = Convert.utf8ToHex(inputScopedMetadataKey.value)
        tempHexData = hexValue + "00".repeat((16-hexValue.length)/2)
      }else{ //hex
        tempHexData = "00".repeat((16-inputScopedMetadataKey.value.length)/2)+inputScopedMetadataKey.value 
      }
      let accountMetadataTransaction = txnBuilder
      .targetPublicKey(targetPublicAccount.value)
      .scopedMetadataKey(UInt64.fromHex(tempHexData))
      .value(newValue.value)
      .oldValue(oldValue.value)
      .calculateDifferences()
      .build()
      let aggregateTxPayload = AppState.buildTxn.aggregateCompleteBuilder().innerTransactions([accountMetadataTransaction.toAggregate(targetPublicAccount.value)]).build().serialize()
      let selectedAddress = walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == targetPublicAccount.value.publicKey).address 
      if(targetAccIsMultisig.value){
        let cosignerAddress = walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == selectedCosigner.value).address
        unsignedTxnPayload = accountMetadataTransaction.toAggregate(targetPublicAccount.value).serialize()
        TransactionState.selectedAddress = cosignerAddress
        TransactionState.selectedMultisigAddress = selectedAddress
      }else{
        unsignedTxnPayload = aggregateTxPayload
        TransactionState.selectedAddress = selectedAddress
      }
      inputScopedMetadataKey.value=""
      oldValue.value = ""
      newValue.value=""
      TransactionState.unsignedTransactionPayload = unsignedTxnPayload
      router.push({ name: "ViewConfirmTransaction" })
    }
    const aggregateFee = ref(0);
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
      if(MultisigUtils.getCosignerInWallet(props.targetPublicKey).cosignerList.length){
        if(accounts.value){
          return MultisigUtils.getCosignerInWallet(props.targetPublicKey).cosignerList.map(cosigner=>{
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
    const init = async ()=>{
      await createTxnBuilder();
      await handleParamTargetPublicKey();
      await handleParamScopedMetadataKey();
      await loadCurrentMetadataValue();
      await metadataTxnAssignNewValue();
      buildMetadataTxn();
      buildAggregateTxn();
      updateAggregateFee();
      fetchExistingKey()
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
    return {
      findAcc,
      totalFee,
      err,
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
      accountAddress,
      disableAddBtn,
      showBalanceErr,
      showScopedKeyErr,
      inputScopedMetadataKey,
      checkOldValue,
      selectedCosigner,
      showKeys,
      existingScopedMetadataKeys,
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
