<template>
 <div>
  
  <div class='w-10/12 ml-auto mr-auto'>
    <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
      <div class="xl:col-span-2 p-6 lg:p-12">
        <div class="lg:flex lg:justify-between lg:items-center">
          <div class='font-semibold mb-4 inline-block mt-1'>{{$t('general.extendDuration')}}</div>
          <div class="flex items-center">
            <div v-html="svgString" class="inline-block" />
            <div class="ml-2">
              <div class="text-blue-primary text-xxs font-bold uppercase mb-1">{{$t('namespace.namespaceCreatedBy')}}</div>
              <div class="font-bold text-black text-sm">{{ selectedAccName }}</div>
            </div>
          </div>
        </div>

        <div v-if="showNoBalance" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('general.insufficientBalance')}}</div>
        </div>
        <div v-else-if="isNotCosigner" class="rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"><font-awesome-icon icon="exclamation" class="text-yellow-500 h-3 w-3 absolute" style="top: 5px; left:7px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('general.noCosigner')}}</div>
        </div>
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <div class="text-right w-full">
          <div v-if="getMultiSigCosigner?getMultiSigCosigner.cosignerList.length:0 > 0" class="inline-block">
            <div class="text-tsm text-left mt-3">{{$t('general.initiateBy')}}:
              <span class="font-bold" v-if="getMultiSigCosigner.cosignerList.length == 1">{{ getMultiSigCosigner.cosignerList[0].name }} ({{$t('general.balance')}}: {{ Helper.amountFormatterSimple(getMultiSigCosigner.cosignerList[0].balance, 0) }} {{ currentNativeTokenName }}) <span v-if="getMultiSigCosigner.cosignerList[0].balance < lockFundTotalFee" class="error">- {{$t('general.insufficientBalance')}}</span></span>
              <span class="font-bold" v-else><select v-model="cosignerAddress"><option v-for="(cosigner, item) in getMultiSigCosigner.cosignerList" :value="cosigner.address" :key="item">{{ cosigner.name }} ({{$t('general.balance')}}: {{ cosigner.balance }} {{ currentNativeTokenName }})</option></select></span>
              <div v-if="cosignerBalanceInsufficient" class="error">- {{$t('general.insufficientBalance')}}</div>
            </div>
          </div>
        </div>
        <div class="border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5">
          <img src="@/modules/services/submodule/namespaces/img/icon-namespace.svg">
          <div class="ml-1">
            <div class="uppercase text-blue-primary font-semibold text-xxs">{{$t('general.namespace')}}</div>
            <div class="text-black text-sm font-bold">{{ selectNamespace }}</div>
          </div>
        </div>
        <DurationInputClean class="mt-5" :disabled="disabledDuration" v-model="duration" @set-default-duration="setDefaultDuration" :max="maxDurationInDays" :placeholder="$t('namespace.duration')" :showError="showDurationErr"  :toolTip="$t('namespace.durationMsg')+'<br>' +`${maxDurationInDays === 365 ? '1 ' + $t('general.year') : ''}` +' ('+`${maxDurationInDays}`+ $t('general.day',maxDurationInDays) +').'" />
        <div v-if="showMaxDaysLabel" class="text-xs inline-block text-gray-400">{{$t('namespace.durationMsg2')}} {{ maxDurationInDays-numDaysleft }} {{$t('general.day',maxDurationInDays-numDaysleft)}}</div>
      </div>
      <div class="bg-navy-primary py-6 px-12 xl:col-span-1">
        <TransactionFeeDisplay :namespace-rental-fee-currency="rentalFeeCurrency" :transaction-fee="transactionFee" :total-fee-formatted="totalFeeFormatted" :get-multi-sig-cosigner="getMultiSigCosigner" :check-cosign-balance="checkCosignBalance" :lock-fund-currency="lockFundCurrency" :lock-fund-tx-fee="String(lockFundTxFee)" :balance="balance" :selected-acc-add="selectedAccAdd"/>
        <div class='text-xs text-white my-5'>{{$t('general.enterPasswordContinue')}}</div>
        <PasswordInput :placeholder="$t('general.password')" :errorMessage="$t('general.passwordRequired')" :showError="showPasswdError" v-model="walletPassword" :disabled="disabledPassword" />
        <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white" :disabled="disableCreate" @click="extendNamespace">{{$t('general.extendDuration')}}</button>
        <div class="text-center">
          <router-link :to="{name: 'ViewDashboard'}" class='content-center text-xs text-white border-b-2 border-white'>{{$t('general.cancel')}}</router-link>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { computed, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import DurationInputClean from '@/modules/services/submodule/namespaces/components/DurationInputClean.vue';
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { NamespaceUtils } from '@/util/namespaceUtils';
import { ChainAPICall } from "@/models/REST/chainAPICall";
import { ChainUtils } from "@/util/chainUtils";
import { listenerState} from "@/state/listenerState";
import { toSvg } from "jdenticon";
import { useToast } from "primevue/usetoast";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { UnitConverter } from '@/util/unitConverter';
import { TimeUnit } from '@/models/const/timeUnit';
import {MultisigUtils} from '@/util/multisigUtils'
import { AppState } from '@/state/appState';
import { isMultiSig, TransactionUtils, findAcc, findAccWithAddress } from '@/util/transactionUtils';
import { WalletUtils } from '@/util/walletUtils';
import { useI18n } from 'vue-i18n';
import { TransactionState } from '@/state/transactionState'

export default {
  name: 'ViewServicesNamespaceExtend',
  components: {
    PasswordInput,
    DurationInputClean,
    TransactionFeeDisplay,
  },
  props: {
    namespaceId: String,
    address: String,
  },
  setup(props){
    const { t } = useI18n();
    const router = useRouter();
    const toast = useToast();
    const namespaceSelect = ref(null);
    const showDurationErr = ref(false);
    const duration = ref("1");
    const walletPassword = ref('');
    const err = ref('');
    const disabledPassword = ref(false);
    const disabledDuration = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const selectNamespace = ref('');
    const showDuration = ref(false);
    const cosignerBalanceInsufficient = ref(false);
    const cosignerAddress = ref('');
    // const startBlock = ref(0);
    const block = ref(0);
    const endBlock = ref(0);
    const numDaysleft = ref(0);
    const showMaxDaysLabel = ref(false);
    const maxDurationInDays = computed(()=>{
      if(networkState.currentNetworkProfileConfig){
        return Math.floor(UnitConverter.configReturn(networkState.currentNetworkProfileConfig.maxNamespaceDuration, TimeUnit.DAY))
      }else{
        return 0
      }
    })

    const blockListener = computed(()=> AppState.readBlockHeight);

    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);

    (async() => {
      const endpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?networkState.currentNetworkProfile.httpPort:3000);
      const chainAPICall = new ChainAPICall(endpoint);
      block.value = await chainAPICall.chainAPI.getBlockchainHeight();
    })();

    const namespaceOption = computed(() => {
      let namespace = [];
      const namespacesList = NamespaceUtils.listRootNamespaces(selectedAccAdd.value);
      namespace.push.apply(namespace, namespacesList);
      return namespace;
    });

    const currencyName = computed(() => AppState.nativeToken.label);
    const rentalFee = computed(()=> {
      if(networkState.currentNetworkProfileConfig){
        if(duration.value > 0){
          return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock * NamespaceUtils.calculateDuration(duration.value), AppState.nativeToken.divisibility);
        }else{
          return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock, AppState.nativeToken.divisibility);
        }
      }else{
        return 0
      }
    });

    const rentalFeeCurrency = computed(()=> Helper.toCurrencyFormat(rentalFee.value, 6) );

    const lockFund = computed(()=> {
      if(networkState.currentNetworkProfileConfig){
        return Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, AppState.nativeToken.divisibility)
      }else{
        return 0
      }
    })
    const lockFundCurrency = computed(()=>{
      if(networkState.currentNetworkProfileConfig){
        return Helper.amountFormatterSimple(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, AppState.nativeToken.divisibility)
      }else{
        return 0
      }
    })

    const lockFundTxFee = computed(()=>{
      if(networkState.currentNetworkProfile){ 
        return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
      }
      return 0;  
    });
    const isNotCosigner = computed(() => (getMultiSigCosigner.value?getMultiSigCosigner.value.cosignerList.length: 0) == 0 && isMultiSig(selectedAccAdd.value));
    const lockFundTxFeeCurrency = ref(lockFundTxFee.value.toString());
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);

    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && (!showDurationErr.value) && (!showNoBalance.value) && (!isNotCosigner.value)
    ));

    const selectedAccName = ref('');
    const selectedAccAdd = ref('');
    const balance = ref('');
    const balanceNumber = ref('');
    const defaultAcc = computed(()=>{
      if(walletState.currentLoggedInWallet){
        return walletState.currentLoggedInWallet.selectDefaultAccount()
      }else{
        return null
      }
    })
    const isMultiSigBool = ref(defaultAcc.value? isMultiSig(defaultAcc.value.address) : false)

    const plainAddress = Helper.createAddress(props.address).plain()
    let account = computed(()=>{
      if(walletState.currentLoggedInWallet){
        return walletState.currentLoggedInWallet.accounts.find(account => account.address == plainAddress) || walletState.currentLoggedInWallet.others.find(account => account.address == plainAddress);
      }else{
        return null
      }
    })

    if(account.value){
      selectedAccName.value = account.value.name;
      selectedAccAdd.value = account.value.address;
      balance.value = Helper.toCurrencyFormat(account.value.balance, AppState.nativeToken.divisibility);
      balanceNumber.value = account.value.balance;
    }

    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();

    const svgString = ref(toSvg(props.address, 40, themeConfig.jdenticonConfig));

    if(account.value){
      let namespace = account.value.namespaces.find( namespace => namespace.idHex === props.namespaceId);
      if(namespace != undefined){
        endBlock.value = namespace.endHeight;
        const nsElement = namespace.name.split('.');
        if(nsElement.length > 1){
          selectNamespace.value = nsElement[0];
        }else{
          selectNamespace.value = namespace.name;
        }
      }
    }
    
    const transactionFee = ref('0');
    const transactionFeeExact = ref(0);
    try{
      transactionFee.value = Helper.convertToCurrency(NamespaceUtils.getRootNamespaceTransactionFee( selectNamespace.value, duration.value), AppState.nativeToken.divisibility);
      transactionFeeExact.value = Helper.convertToExact(NamespaceUtils.getRootNamespaceTransactionFee( selectNamespace.value, duration.value), AppState.nativeToken.divisibility);
    }catch{e=>console.log(e)}
    

    let isMaxDuration = false;
    watch(duration, (n) => {
      if(n > maxDurationInDays.value){
        duration.value = maxDurationInDays.value;
      }else {
        let remainingBlock = endBlock.value - block.value;
        let availableDays = 0;
        numDaysleft.value = Math.ceil(remainingBlock/(24 * 60 * 4));
        if((parseInt(n) + numDaysleft.value) > maxDurationInDays.value){
          availableDays = maxDurationInDays.value - numDaysleft.value;
          duration.value = availableDays.toString();
          showMaxDaysLabel.value = true;
          isMaxDuration = true;
        }else{
          if(!isMaxDuration){
            showMaxDaysLabel.value = false;
          }
          isMaxDuration = false;
        }
      }
    });

    const setDefaultDuration = () => {
      duration.value = '1';
    }

    // calculate fees
    const totalFee = computed(() => {
      // if multisig
      if(isMultiSig(Helper.createAddress(props.address).plain())){
        return parseFloat(lockFundTotalFee.value) + rentalFee.value + transactionFeeExact.value;
      }else{
        return rentalFee.value + transactionFeeExact.value;
      }
    });

    const totalFeeFormatted = computed(() => {
      return Helper.amountFormatterSimple(totalFee.value, 0);
    });

    watch(totalFee, (n) => {
      if(balance.value < n && !isNotCosigner.value){
        // showNoBalance.value = true;
        disabledPassword.value = true;
      }else{
        // showNoBalance.value = false;
        disabledPassword.value = false;
      }
    });

    watch(blockListener, (n) => {
      block.value = n;
    });

    const extendNamespace = () => {
      let verifyPassword = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPassword.value)
      if(!verifyPassword){
        err.value = t('general.walletPasswordInvalid',{name : walletState.currentLoggedInWallet.name})
        return
      }
      let txnPayload = {}
      if(cosigner.value){
        txnPayload = NamespaceUtils.extendNamespaceMultisigPayload(cosigner.value, walletPassword.value, selectNamespace.value, duration.value, selectedAccAdd.value);
      }else{
        txnPayload = NamespaceUtils.extendNamespacePayload(selectedAccAdd.value, walletPassword.value, selectNamespace.value, duration.value);
      }
      TransactionState.lockHashPayload = txnPayload.hashLockTxnPayload
      TransactionState.transactionPayload = txnPayload.txnPayload
      router.push({ name: "ViewConfirmTransaction", params: { selectedAddress: selectedAccAdd.value  } })
    };

    const getMultiSigCosigner = computed(()=>{
      if(!account.value){
        return
      }
      if(networkState.currentNetworkProfileConfig){
        let cosigners = MultisigUtils.getCosignerInWallet(account.value?account.value.publicKey:'');
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
        return{hasCosigner:cosigners.hasCosigner,cosignerList:cosigners.cosignerList}
      }else{
        return {hasCosigner:false,cosignerList: []}
      }
    })

    cosignerAddress.value = getMultiSigCosigner.value?getMultiSigCosigner.value.cosignerList.length>0?getMultiSigCosigner.value.cosignerList[0].address:'':''
    
    watch(getMultiSigCosigner,n=>{
      if(n){
        if(n.cosignerList.length>0){
          cosignerAddress.value = n.cosignerList.length>0?getMultiSigCosigner.value.cosignerList[0].address:''
        }
      }
      
    })

    const checkCosignBalance = computed(() => {
      let cosignBalance = findAccWithAddress(cosignerAddress.value)?findAccWithAddress(cosignerAddress.value).balance:0;
      return Helper.toCurrencyFormat(cosignBalance);
    })

    const showNoBalance = computed(() => {
      if(cosignerAddress.value.length <= 0){
        return balanceNumber.value < (transactionFeeExact.value);
      }else{
        return Number(checkCosignBalance.value) < (transactionFeeExact.value + lockFundTotalFee.value);
      }
    });

    watch(isNotCosigner, (n) => {
      if(n){
        disabledPassword.value = true;
        disabledDuration.value = true;
      }else{
        disabledPassword.value = false;
        disabledDuration.value = false;
      }
    });

    // get cosigner
    // if it is a multisig
    const cosigner = computed(() => {
      if(getMultiSigCosigner.value.cosignerList.length > 0){
        if(getMultiSigCosigner.value.cosignerList.length > 1){
          return cosignerAddress.value;
        }else{
          return findAcc(getMultiSigCosigner.value.cosignerList[0].publicKey).address;
        }
      }else{
        return '';
      }
    });

    return {
      namespaceSelect,
      selectedAccName,
      selectedAccAdd,
      balance,
      showNoBalance,
      err,
      walletPassword,
      disableCreate,
      showPasswdError,
      disabledPassword,
      showDuration,
      disabledDuration,
      duration,
      showDurationErr,
      isMultiSigBool,
      rentalFee,
      rentalFeeCurrency,
      lockFundTxFee,
      lockFundCurrency,
      currencyName,
      lockFundTxFeeCurrency,
      lockFundTotalFee,
      totalFeeFormatted,
      selectNamespace,
      namespaceOption,
      extendNamespace,
      transactionFee,
      getMultiSigCosigner,
      cosignerBalanceInsufficient,
      cosignerAddress,
      isNotCosigner,
      // startBlock,
      block,
      endBlock,
      numDaysleft,
      showMaxDaysLabel,
      svgString,
      Helper,
      currentNativeTokenName,
      maxDurationInDays,
      setDefaultDuration,
      checkCosignBalance,
    }
  },

}
</script>
<style scoped lang="scss">
</style>
