<template>
 <div>
  
  <div class='w-10/12 ml-auto mr-auto'>
    <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
      <div class="xl:col-span-2 p-6 lg:p-12">
        <div class="lg:flex lg:justify-between lg:items-center">
          <div class='font-semibold mb-4 inline-block mt-1'>{{$t('general.linkToNamespace')}}</div>
          <div class="flex items-center">
            <div v-html="svgString" class="inline-block" />
            <div class="ml-2">
              <div class="text-blue-primary text-xxs font-bold uppercase mb-1">{{$t('asset.assetCreatedBy')}}</div>
              <div class="font-bold text-black text-sm">{{ selectedAccName }}</div>
            </div>
          </div>
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
              <div class="uppercase text-black font-bold text-sm">{{ assetTransferable?$t('general.yes'):$t('general.no') }}</div>
            </div>
            <div class="my-3">
              <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">{{$t('general.supplyMutable')}}<img src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;" v-tooltip.bottom="{value:'<tiptext>'+ $t('asset.supplyMutableMsg')+'</tiptext>', escape: false}"></div>
              <div class="uppercase text-black font-bold text-sm">{{ assetMutable?$t('general.yes'):$t('general.no') }}</div>
            </div>
          </div>
        </div>
        <div class="lg:grid lg:grid-cols-2 mt-5">
          <SelectLinkType :title="$t('asset.modificationType')" class="lg:mr-4" v-model="selectAction" :disabled="disabledSelectAction" />
          <SelectInputNamespace :action="selectAction" v-model="selectNamespace" :address="selectedAccAdd" :assetId="selectAsset" />
        </div>
      </div>
      <div class="bg-navy-primary py-6 px-12 xl:col-span-1">
        <TransactionFeeDisplay :transaction-fee="transactionFee" :total-fee-formatted="totalFeeFormatted" :get-multi-sig-cosigner="getMultiSigCosigner" :check-cosign-balance="checkCosignBalance" :lock-fund-currency="lockFundCurrency" :lock-fund-tx-fee="String(lockFundTxFee)" :balance="balance" :selected-acc-add="selectedAccAdd"/>
        <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white" :disabled="disableCreate" @click="linkNamespace">{{ (selectAction=='link')?$t('general.linkToNamespace'):$t('namespace.unlinkNamespace') }}</button>
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
import SelectLinkType from '@/modules/services/submodule/assets/components/SelectLinkType.vue';
import SelectInputNamespace from '@/modules/services/submodule/assets/components/SelectInputNamespace.vue';
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
import { AliasActionType, MosaicId, NamespaceId, UInt64 } from 'tsjs-xpx-chain-sdk';

export default {
  name: 'ViewServicesAssetsLinkToNamespace',
  directives: { 'tooltip': Tooltip },
  components: {
    PasswordInput,
    SelectLinkType,
    SelectInputNamespace,
    TransactionFeeDisplay,
    SelectCosigner,
  },
  props: {
    assetId: String,
    address: String,
  },
  setup(props){
    const {t} = useI18n();
    const router = useRouter();
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const err = ref('');
    const disabledPassword = ref(false);
    const disabledSelectAction = ref(false);
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



    const disableCreate = computed(() => !(
      (selectNamespace.value != '')
    ));

    const selectedAccName = ref('');
    const selectedAccAdd = ref(Helper.createAddress(props.address).plain());
    const balance = ref('');
    const balanceNumber = ref(0);

    const isMultiSigBool = ref(isMultiSig(selectedAccAdd.value));

    const showNoBalance = computed(() => {
      if(cosignerAddress.value.length <= 0){
        return balanceNumber.value < (transactionFeeExact.value);
      }else{
        return Number(checkCosignBalance.value) < (transactionFeeExact.value + lockFundTotalFee.value);
      }
    });

    const supply = ref('0');

    let account = computed(()=>{
      if(walletState.currentLoggedInWallet){
        return walletState.currentLoggedInWallet.accounts.find(account => account.address == selectedAccAdd.value) || walletState.currentLoggedInWallet.others.find(account => account.address == selectedAccAdd.value);
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

    const selectAsset = ref('');
    const assetDivisibility = ref(0);
    const assetSupply = ref(0);
    const assetAmount = ref(0);
    const assetTransferable = ref(false);
    const assetMutable = ref(false);
    const selectAction = ref('link');
    const selectNamespace = ref('');

    if(account.value){
      let asset = account.value.assets.find( asset => asset.idHex === props.assetId);
      if(asset != undefined){
        selectAsset.value = asset.idHex;
        assetTransferable.value = asset.transferable;
        assetMutable.value = asset.supplyMutable;
        assetDivisibility.value = asset.divisibility;
        assetSupply.value = Helper.convertToCurrency(asset.supply, asset.divisibility);
        assetAmount.value = asset.amount
      }
    }

    const transactionFee = ref('0.000000');
    const transactionFeeExact = ref(0);

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
    
    try {
      transactionFee.value = Helper.convertToCurrency(AssetsUtils.getMosaicSupplyChangeTransactionFee( selectAsset.value, selectAction.value, supply.value, assetDivisibility.value), AppState.nativeToken.divisibility);
      transactionFeeExact.value = Helper.convertToExact(AssetsUtils.getMosaicSupplyChangeTransactionFee( selectAsset.value, selectAction.value, supply.value, assetDivisibility.value), AppState.nativeToken.divisibility);
    } catch (error) {
      console.log(error)
    }

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
   

    const linkNamespace = () => {
      let assetId;
      if(selectAction.value=='link'){ 
        assetId = selectAsset.value;
      }else{
        let account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == selectedAccAdd.value);
        if(!account){
          account = walletState.currentLoggedInWallet.others.find((account) => account.address == selectedAccAdd.value);
        }
        assetId = account.namespaces.find(namespace => namespace.name === selectNamespace.value).linkedId;
      }
      const buildTransactions = AppState.buildTxn;
      let aliasActionType = (selectAction.value == 'link')?AliasActionType.Link:AliasActionType.Unlink;
      const unsignedLinkAssetToNamespaceTx = buildTransactions.assetAlias(aliasActionType, new NamespaceId(selectNamespace.value), new MosaicId(assetId));
      if(cosigner.value){
        TransactionState.selectedAddress = cosigner.value
        TransactionState.selectedMultisigAddress = selectedAccAdd.value
      }else{
        TransactionState.selectedAddress = selectedAccAdd.value
      }
      TransactionState.unsignedTransactionPayload = unsignedLinkAssetToNamespaceTx.serialize()
      router.push({ name: "ViewConfirmTransaction" })
    };

    watch(selectAction, (n) => {
      transactionFee.value = Helper.convertToCurrency(AssetsUtils.getMosaicSupplyChangeTransactionFee(selectAsset.value, n, supply.value, assetDivisibility.value), AppState.nativeToken.divisibility);
      transactionFeeExact.value = Helper.convertToExact(AssetsUtils.getMosaicSupplyChangeTransactionFee( selectAsset.value, n, supply.value, assetDivisibility.value), AppState.nativeToken.divisibility);
    });

    watch(supply, (n) => {
      if(selectAsset.value){
        transactionFee.value = Helper.convertToCurrency(AssetsUtils.getMosaicSupplyChangeTransactionFee( selectAsset.value, selectAction.value, n, assetDivisibility.value), AppState.nativeToken.divisibility);
        transactionFeeExact.value = Helper.convertToExact(AssetsUtils.getMosaicSupplyChangeTransactionFee( selectAsset.value, selectAction.value, n, assetDivisibility.value), AppState.nativeToken.divisibility);
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
      disabledSelectAction.value = isValidate;
    };

    watch(totalFee, (n) => {
      if(balance.value < n){
        // if(!showNoAsset.value){
        //   if(!isNotCosigner.value){
        //     showNoBalance.value = true;
        //   }
        // }
        setFormInput(true);
      }else{
        // showNoBalance.value = false;
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
      err,
      disableCreate,
      showPasswdError,
      supply,
      disabledPassword,
      currencyName,
      isMultiSigBool,
      selectAsset,
      selectAction,
      linkNamespace,
      transactionFee,
      transactionFeeExact,
      assetSupply,
      assetAmount,
      assetDivisibility,
      assetTransferable,
      assetMutable,
      selectNamespace,
      getMultiSigCosigner,
      cosignerBalanceInsufficient,
      cosignerAddress,
      cosigner,
      isNotCosigner,
      disabledSelectAction,
      Helper,
      svgString,
      checkCosignBalance,
      account
    }
  },

}
</script>
<style scoped lang="scss">

</style>