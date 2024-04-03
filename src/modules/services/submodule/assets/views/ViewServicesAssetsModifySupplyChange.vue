<template>
 <div>
  
  <div class='w-10/12 ml-auto mr-auto'>
    <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
      <div class="xl:col-span-2 p-6 lg:p-12">
        <div class="lg:flex lg:justify-between lg:items-center">
          <div class='font-semibold mb-4 inline-block mt-1'>{{$t('asset.modifyAssetSupply')}}</div>
          <div class="flex items-center">
            <div v-html="svgString" class="inline-block" />
            <div class="ml-2">
              <div class="text-blue-primary text-xxs font-bold uppercase mb-1">{{$t('asset.assetCreatedBy')}}</div>
              <div class="font-bold text-black text-sm">{{ selectedAccName }}</div>
            </div>
          </div>
        </div>
        <div v-if="!assetMutable" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div><div class="inline-block text-xs">Asset is immutable</div>
        </div>
        <SelectCosigner :cosignerAddress="cosignerAddress" :showNoBalance="showNoBalance" :errorMessage="err" :selectedAcc="account" :cosignerBalanceInsufficient="cosignerBalanceInsufficient"/>
        <div class="border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5">
          <img src="@/modules/services/submodule/assets/img/icon-asset.svg">
          <div class="ml-1">
            <div class="uppercase text-blue-primary font-semibold text-xxs">{{$t('general.assetId')}}</div>
            <div class="text-black text-sm font-bold">{{ selectAsset }}</div>
          </div>
        </div>
        <div class="border border-gray-200 p-4 rounded mt-5">
          <div class="lg:grid lg:grid-cols-2">
            <div class="my-3">
              <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">{{$t('asset.currentSupply')}}<img src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;" v-tooltip.bottom="{value:'<tiptext>'+$t('asset.supplyMsg2')+'<br>'+$t('asset.supplyMsg3')+'</tiptext>', escape: false}"></div>
              <div class="text-black font-bold text-sm">{{ assetAmount }}</div>
            </div>
            <div class="my-3">
              <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">{{$t('general.divisibility')}}<img src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;" v-tooltip.bottom="{value:'<tiptext>' + $t('asset.divisibilityMsg4') + '<br><br>' + $t('asset.divisibilityMsg2') + '<br>' + $t('asset.divisibilityMsg3') + '</tiptext>', escape: false}"></div>
              <div class="text-black font-bold text-sm">{{ assetDivisibility }}</div>
            </div>
            <div class="my-3">
              <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">{{$t('general.transferable')}}<img src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;" v-tooltip.bottom="{value:'<tiptext>'+ $t('asset.transferableMsg')+'</tiptext>', escape: false}"></div>
              <div class="uppercase text-black font-bold text-sm">{{ assetTransferable?$t('general.yes'): $t('general.no') }}</div>
            </div>
            <div class="my-3">
              <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">{{$t('general.supplyMutable')}}<img src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;" v-tooltip.bottom="{value:'<tiptext>'+ $t('asset.supplyMutableMsg')+'</tiptext>', escape: false}"></div>
              <div class="uppercase text-black font-bold text-sm">{{ assetMutable?$t('general.yes') : $t('general.no') }}</div>
            </div>
          </div>
        </div>
        <div class="lg:grid lg:grid-cols-2 mt-5">
          <SelectModificationType :title="$t('asset.modificationType')" class="lg:mr-4" v-model="selectIncreaseDecrease" />
          <SupplyInputClean :disabled="showNoBalance||isNotCosigner" v-model="supply" :balance="(maxAssetSupply - assetSupply.value)" :placeholder="$t('asset.quantityOf',{value:selectIncreaseDecrease})" type="text" icon="coins" :showError="showSupplyErr" :errorMessage="selectIncreaseDecrease == 'increase'? ' The total asset supply should not exceed 900T' : ' You have exceeded the maximum value for decrease asset supply.'" :decimal="Number(assetDivisibility)" class="lg:ml-4" />
        </div>
      </div>
      <div class="bg-navy-primary py-6 px-12 xl:col-span-1">
        <TransactionFeeDisplay :transaction-fee="transactionFee" :total-fee-formatted="totalFeeFormatted" :get-multi-sig-cosigner="getMultiSigCosigner" :check-cosign-balance="checkCosignBalance" :lock-fund-currency="lockFundCurrency" :lock-fund-tx-fee="String(lockFundTxFee)" :balance="balance" :selected-acc-add="selectedAccAdd"/>
        <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white" :disabled="disableModify" @click="modifyAsset">{{$t('asset.modifyAssetSupply')}}</button>
        <div class="text-center">
          <router-link :to="{name: 'ViewDashboard'}" class='content-center text-xs text-white border-b-2 border-white'>{{$t('general.cancel')}}</router-link>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { computed, ref, watch, getCurrentInstance } from 'vue';
import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import SupplyInputClean from '@/components/SupplyInputClean.vue';
import SelectModificationType from '@/modules/services/submodule/assets/components/SelectModificationType.vue';
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
import SelectCosigner from '@/components/SelectCosigner.vue';
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { AssetsUtils } from '@/util/assetsUtils';
import { WalletUtils } from '@/util/walletUtils';
import { toSvg } from "jdenticon";
import { useI18n } from 'vue-i18n';
import { useToast } from "primevue/usetoast";
import Tooltip from 'primevue/tooltip';
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import {MultisigUtils} from '@/util/multisigUtils'
import { AppState } from '@/state/appState';
import { TransactionState } from '@/state/transactionState'
import { isMultiSig, TransactionUtils, findAcc, findAccWithAddress } from '@/util/transactionUtils';
import { MosaicId, MosaicSupplyType, UInt64 } from 'tsjs-xpx-chain-sdk';

export default {
  name: 'ViewServicesAssetsModifySupplyChange',
  directives: { 'tooltip': Tooltip },
  components: {
    PasswordInput,
    SupplyInputClean,
    SelectModificationType,
    TransactionFeeDisplay,
    SelectCosigner,
  },
  props: {
    assetId: String,
    address: String
  },
  setup(props){
    const {t} = useI18n();
    const router = useRouter();
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    let maxAmount = 900000000000000;
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const showSupplyErr = ref(false);
    const err = ref('');
    const disabledPassword = ref(false);
    const disabledSupply = ref(false);
    const disabledSelectIncreaseDecrease = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);

    const cosignerBalanceInsufficient = ref(false);
    const cosignerAddress = ref('');
    const getMultiSigCosigner = ref({hasCosigner:false,cosignerList: []});
    const checkCosignBalance = ref('0');
    const isNotCosigner = ref(false);
    const lockFundTxFee = ref(0);
    const lockFundTotalFee  = ref(0);

    const currencyName = computed(() => AppState.nativeToken.label);

    const lockFundCurrency = computed(()=> {
      if(networkState.currentNetworkProfileConfig){
        return Helper.convertToCurrency(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, AppState.nativeToken.divisibility)
      }else{
        return 0
      }
    })

    const disableModify = computed(() => !(
      (supply.value > 0) && !showSupplyErr.value && !showNoBalance.value & !isNotCosigner.value
    ));

    
    const selectedAccName = computed(()=>{
      if(!account.value){
        return ''
      }
      return account.value.name
    })
    const selectedAccAdd = computed(()=>{
      if(!account.value){
        return ''
      }
      return account.value.address
    })
    const balanceNumber = computed(()=>{
      if(!account.value){
        return 0
      }
      return account.value.balance
    })

    const balance = computed(()=>{
      if(!account.value){
        return 
      }
      return Helper.toCurrencyFormat(account.value.balance, AppState.nativeToken.divisibility)
    })

    const supply = ref('0');
    const plainAddress = Helper.createAddress(props.address).plain()
    let account = computed(()=>{
      if(walletState.currentLoggedInWallet){
        return walletState.currentLoggedInWallet.accounts.find(account => account.address == plainAddress) || walletState.currentLoggedInWallet.others.find(account => account.address == plainAddress);
      }else{
        return null
      }
    })

    
    const isMultiSigBool = ref(isMultiSig(selectedAccAdd.value));
    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();

    const svgString = ref(toSvg(props.address, 40, themeConfig.jdenticonConfig));

    const selectIncreaseDecrease = ref('increase');
    let maxAssetSupply = 900000000000000;

    const asset = computed(()=>{
      if(!account.value){
        return null
      }
      return  account.value.assets.find( asset => asset.idHex === props.assetId);
    })
    const assetAmount = computed(()=>{
      if(!asset.value){
        return 0
      }
      return asset.value.amount
    })
    const selectAsset = computed(()=>{
      if(!asset.value){
        return ''
      }
      return asset.value.idHex
    })
    const assetTransferable = computed(()=>{
      if(!asset.value){
        return false
      }
      return asset.value.transferable
    })
    const assetMutable = computed(()=>{
      if(!asset.value){
        return false
      }
      return asset.value.supplyMutable
    })
    const assetDivisibility = computed(()=>{
      if(!asset.value){
        return 0
      }
      return asset.value.divisibility
    })

    const assetSupply = computed(()=>{
      if(!asset.value){
        return 0
      }
      return asset.value.supply/Math.pow(10,asset.value.divisibility)
    })

    emitter.on("select-cosigner", (cosginerAddress) => {
      cosignerAddress.value = cosginerAddress
    })

    emitter.on("get-multisig-cosigner", (multiSigCosigner) => {
      getMultiSigCosigner.value = multiSigCosigner
    })

    emitter.on("check-cosigner", (cosignerStatus) => {
      isNotCosigner.value = cosignerStatus
    })

    emitter.on("check-cosign-balance", (cosginerBalance) => {
      checkCosignBalance.value = cosginerBalance
    })

    emitter.on("check-lock-fund", (fee) => {
      lockFundTxFee.value = fee
    })
    emitter.on("check-total-lock-fund", (totalFee) => {
      lockFundTotalFee.value = totalFee
    })

    const showNoBalance = computed(() => {
      if(cosignerAddress.value.length <= 0){
        return balanceNumber.value < (transactionFeeExact.value);
      }else{
        return Number(checkCosignBalance.value) < (transactionFeeExact.value + lockFundTotalFee.value);
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

    const transactionFee = computed(()=>{
      if(!AppState.isReady){
        return '0'
      }
      return Helper.convertToCurrency(AssetsUtils.getMosaicSupplyChangeTransactionFee(props.assetId, selectIncreaseDecrease.value, parseFloat(supply.value), assetDivisibility.value), AppState.nativeToken.divisibility);
    })
    const transactionFeeExact = computed(()=>{
      if(!AppState.isReady){
        return 0
      }
      return Helper.convertToExact(AssetsUtils.getMosaicSupplyChangeTransactionFee( props.assetId, selectIncreaseDecrease.value, parseFloat(supply.value), assetDivisibility.value), AppState.nativeToken.divisibility);
    })
  
    watch(assetMutable,n=>{
      if(!n){
        disabledSelectIncreaseDecrease.value = true;
        disabledSupply.value = true;
        disabledPassword.value = true;
      }else{
        disabledSelectIncreaseDecrease.value = false;
        disabledSupply.value = false;
        disabledPassword.value = false;
      }
    },{immediate:true})
    

    const modifyAsset = () => {
      const buildTransactions = AppState.buildTxn;
      let supplyChangeType = (selectIncreaseDecrease.value == 'increase')?MosaicSupplyType.Increase:MosaicSupplyType.Decrease;
      let unsignedAssetAggregateTransaction = buildTransactions.buildMosaicSupplyChange(new MosaicId(selectAsset.value), supplyChangeType, UInt64.fromUint(AssetsUtils.addZeros(assetDivisibility.value, Number(supply.value))));
      if(cosigner.value){
        TransactionState.selectedAddress = cosigner.value
        TransactionState.selectedMultisigAddress = selectedAccAdd.value
      }else{
        TransactionState.selectedAddress = selectedAccAdd.value
      }
      TransactionState.unsignedTransactionPayload = unsignedAssetAggregateTransaction.serialize()
      router.push({ name: "ViewConfirmTransaction" })
    };

    watch(selectIncreaseDecrease, (n) => {
      if(n == 'increase'){
        showSupplyErr.value = parseFloat(supply.value) > (maxAssetSupply - assetSupply.value);
      }
      else { 
        if (assetSupply.value == assetAmount.value ){
          showSupplyErr.value = parseFloat(supply.value) > assetSupply.value-1;
        }
        else{
          showSupplyErr.value = parseFloat(supply.value) > (assetAmount.value-1);
        }
      }
    });

    watch(supply, (n) => {
      if(selectIncreaseDecrease.value == 'increase'){ 
        showSupplyErr.value = parseFloat(n) > (maxAssetSupply - assetSupply.value);
      }
      else { 
        if (assetSupply.value == assetAmount.value ){
          showSupplyErr.value = parseFloat(n) > assetSupply.value - 1;
        }
        else{
          showSupplyErr.value = parseFloat(n) > (assetAmount.value - 1);
        }
      } 
    });

    const totalFee = computed(() => {
      // if multisig
      if(isMultiSig(selectedAccAdd.value)){
        return parseFloat(lockFundTotalFee.value) + transactionFeeExact.value;
      }else{
        return transactionFeeExact.value;
      }
    });

    const totalFeeFormatted = computed(() => {
      return Helper.amountFormatterSimple(totalFee.value, 0);
    });

    const setFormInput = (isValidate) => {
      disabledPassword.value = isValidate;
      disabledSupply.value = isValidate;
      disabledSelectIncreaseDecrease.value = isValidate;
    };

    watch(totalFee, (n) => {
      if(balance.value < n){
        setFormInput(true);
      }else{
        setFormInput(false);
      }
    });

    watch(showNoBalance, (n) => {
      if(n){
        setFormInput(true);
      }else{
        setFormInput(false);
      }
    });

    watch(isNotCosigner, (n) => {
      if(n){
        setFormInput(true)
      }else{
        setFormInput(false);
      }
    });

    watch([cosignerAddress, checkCosignBalance], ([newValue, newBalance]) => {
      if(newValue !== null){
        cosignerAddress.value = newValue
      }
      if(newBalance !== null){
        checkCosignBalance.value = newBalance
      }
    })

    return{
      currentNativeTokenName,
      selectedAccName,
      selectedAccAdd,
      balance,
      balanceNumber,
      showNoBalance,
      lockFundTxFee,
      lockFundCurrency,
      lockFundTotalFee,
      totalFeeFormatted,
      showSupplyErr,
      err,
      disableModify,
      showPasswdError,
      supply,
      disabledPassword,
      disabledSupply,
      currencyName,
      isMultiSig,
      isMultiSigBool,
      selectAsset,
      selectIncreaseDecrease,
      modifyAsset,
      transactionFee,
      transactionFeeExact,
      assetSupply,
      assetAmount,
      assetDivisibility,
      assetTransferable,
      assetMutable,
      getMultiSigCosigner,
      cosignerBalanceInsufficient,
      cosignerAddress,
      cosigner,
      isNotCosigner,
      disabledSelectIncreaseDecrease,
      Helper,
      svgString,
      maxAmount,
      maxAssetSupply,
      checkCosignBalance,
      account
    }
  },

}
</script>
<style scoped lang="scss">

</style>