<template>
<div>
    <div class='flex cursor-pointer'>
        <img src='@/assets/img/chevron_left.svg'>
        <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>{{$t('general.back')}}</router-link>
    </div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <AccountComponent :address="accountAddress" class="mb-10"/>
        <div class = 'flex text-xs font-semibold border-b-2 menu_title_div'>
        <router-link :to="{name: 'ViewAccountDetails',params:{address:accountAddress}}" class= 'w-32 text-center '>{{$t('account.accountDetails')}}</router-link>
        <router-link :to="{name:'ViewAccountAssets', params: { address: accountAddress}}" class= 'w-18 text-center'>{{$t('general.asset',2)}}</router-link>
        <router-link :to="{name:'ViewMultisigHome', params: { address: accountAddress}}" class= 'w-18 text-center'>{{$t('general.multisig')}}</router-link>
        <router-link v-if="targetAccIsMultisig" :to="{name:'ViewMultisigScheme', params: { address: accountAddress}}" class= 'w-18 text-center'>{{$t('general.scheme')}}</router-link>
        <router-link :to="{name:'ViewAccountSwap', params: { address: accountAddress}}" class= 'w-18 text-center'>{{$t('general.swap')}}</router-link>
        <MoreAccountOptions :address="accountAddress" :selected="true"/>
        </div>
        <div class="border-2 border-t-0 filter shadow-lg lg:grid lg:grid-cols-3" >
            <div class="lg:col-span-2 py-6 px-6">
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
                  <div @click="showKeys = !showKeys" class="text-blue-primary text-xs cursor-pointer mb-1.5">Select Existing Scoped Metadata Key (Hexadecimal)</div>
                  <div v-for="(metadata,index) in existingScopedMetadataKeys" :key="index" >
                    <div v-if="showKeys" class="flex justify-center cursor-pointer" @click="scopedMetadataKeyType=2,inputScopedMetadataKey=metadata,checkOldValue(),showKeys = false">
                      <div v-if="index%2==0" class="text-xs py-2 bg-gray-100 pl-2 w-full">{{metadata}}</div>
                      <div v-if="index%2==1" class="text-xs py-2 pl-2 w-full">{{metadata}}</div>
                      <div v-if="index%2==0" class="ml-auto pr-2 text-xxs py-2 font-semibold uppercase text-blue-primary bg-gray-100">{{$t('general.select')}}</div>
                      <div v-if="index%2==1" class="ml-auto mr-2 text-xxs py-2 font-semibold uppercase text-blue-primary">{{$t('general.select')}}</div>
                    </div>
                  </div>
                </div>
                <MetadataInput :hex="scopedMetadataKeyType==2" class="mt-5" v-model="inputScopedMetadataKey" :disabled="!scopedMetadataKeySelectable" placeholder="Scoped Metadata Key" v-debounce:1000="checkOldValue" :toolTip="`${scopedMetadataKeyType==1?'Accepts 8 characters':'Accepts 16 hexadecimals'}`" :showError="showScopedKeyErr" :errorMessage="`${scopedMetadataKeyType==1?'Exceeded 8 characters':inputScopedMetadataKey.length>16?'Exceeded 16 hexadecimals':'Input needs to be even number'}`" />
                <div class="flex gap-3 ">
                    <div class="flex gap-2">
                        <input :disabled="!scopedMetadataKeySelectable" type="radio" id="regular" value="1" v-model="scopedMetadataKeyType">
                        <label for="regular">Regular</label>
                    </div>
                    <div class="flex gap-2">
                        <input :disabled="!scopedMetadataKeySelectable" type="radio" id="hexa" value="2" v-model="scopedMetadataKeyType">
                        <label for="hexa">Hexadecimal</label>
                    </div>
                </div>
                <MetadataInput class="mt-2" v-model="oldValue" :disabled="true" placeholder="Old Value"/>
                <MetadataInput class="mt-2" v-model="newValue"  placeholder="New Value"/>
            </div>
            <div class='bg-navy-primary p-6 lg:col-span-1'>
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
                    Update Account Metadata
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
import { computed, ref, getCurrentInstance, watch} from "vue";
import PasswordInput from "@/components/PasswordInput.vue";
import {useI18n} from 'vue-i18n'
import { multiSign } from "@/util/multiSignatory";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { TransactionUtils } from "@/util/transactionUtils";
import { AppState } from '@/state/appState';
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import MoreAccountOptions from "@/modules/account/components/MoreAccountOptions.vue";
import MetadataInput from '@/modules/metadataTxn/components/MetadataInput.vue'
import { 
  PublicAccount, Convert, AccountMetadataTransactionBuilder, 
  AggregateTransaction, AggregateBondedTransactionBuilder, UInt64,
  MetadataQueryParams, MetadataType, AccountMetadataTransaction, Account
} from 'tsjs-xpx-chain-sdk';
import { WalletAccount } from '@/models/walletAccount';
import { OtherAccount } from '@/models/otherAccount';
import { toSvg } from 'jdenticon';
import { ThemeStyleConfig } from '@/models/stores';
import { WalletUtils } from '@/util/walletUtils';
export default { 
  name: "ViewUpdateAccountMetadata",
  props:{
    targetPublicKey: String,
    scopedMetadataKey: String,
  },
  components: {
    AccountComponent,
    MoreAccountOptions,
    MetadataInput,
    PasswordInput,
    
  },
  setup(props) {
    let showKeys = ref(false)
    let scopedMetadataKeySelectable = ref(true);
    let scopedMetadataKeyType = ref(1);
    let targetPublicAccount = ref(null);
    let targetAccIsMultisig = ref(false);
    let scopedMetadataKeyHex = "";
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
    const existingScopedMetadataKeys = ref([])
    const fetchExistingKey = ()=>{
      let metadataQueryParams = new MetadataQueryParams()
      metadataQueryParams.metadataType = MetadataType.ACCOUNT
      metadataQueryParams.targetKey = targetPublicAccount.value
      AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams).then(metadata=>{
        metadata.metadataEntries.forEach(metadataEntry=>{
           existingScopedMetadataKeys.value.push(metadataEntry.scopedMetadataKey.toHex())
        })
      })
    }
    const accountAddress = computed(()=>selectedAcc.value?selectedAcc.value.address:'0'.repeat(40))
    const handleParamTargetPublicKey = ()=>{
      if(props.targetPublicKey.length === 64 && Convert.isHexString(props.targetPublicKey)){
        targetPublicAccount.value = PublicAccount.createFromPublicKey(props.targetPublicKey, AppState.networkType);
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
          scopedMetadataKeyHex = props.scopedMetadataKey;
          txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex));
        }
        else{
          let tempHexData = Convert.utf8ToHex(props.scopedMetadataKey);
          const hexDataBytes = tempHexData.length / 2;

          if(tempHexData.length && hexDataBytes <= 8){
            scopedMetadataKeyType.value = 1;
            if((tempHexData.length/2) < 8){
              tempHexData = tempHexData + "00".repeat(8 - hexDataBytes);
            }
            scopedMetadataKeyHex = tempHexData;
            txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex));
            
          }
        }
      }
    }

    const createTxnBuilder = () =>{
      txnBuilder = AppState.buildTxn.accountMetadataBuilder();
      aggregateTxnBuilder = AppState.buildTxn.aggregateBondedBuilder();
    }

    const loadCurrentMetadataValue = async () =>{
      if(targetPublicAccount.value && scopedMetadataKeyHex){
        let metadataQueryParams = new MetadataQueryParams();
        metadataQueryParams.metadataType = MetadataType.ACCOUNT;
        metadataQueryParams.targetKey = targetPublicAccount.value;
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
        aggregateFee.value = aggregateTxn.maxFee.compact()/Math.pow(10,AppState.nativeToken.divisibility)
      } 
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
      .scopedMetadataKey(UInt64.fromHex(tempHexData))
      .value(newValue.value)
      .oldValue(oldValue.value)
      .calculateDifferences()
      .build()
      let abtTx = aggregateTxn = aggregateTxnBuilder.innerTransactions([mosaicMetadataTransaction.toAggregate(targetPublicAccount.value)]).build()
      let signer = targetAccIsMultisig.value? 
      walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == selectedCosigner.value):
      walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == props.targetPublicKey) 
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
    const aggregateFee = ref(0);
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
      if(multiSign.getCosignerInWallet(props.targetPublicKey).cosignerList.length){
        if(accounts.value){
          return multiSign.getCosignerInWallet(props.targetPublicKey).cosignerList.map(cosigner=>{
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
      createTxnBuilder();
      handleParamTargetPublicKey();
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
      accountAddress,
      disableAddBtn,
      showBalanceErr,
      showScopedKeyErr,
      inputScopedMetadataKey,
      checkOldValue,
      selectedCosigner,
      showKeys,
      existingScopedMetadataKeys,
      scopedMetadataKeySelectable
    };
  },
};
</script>
