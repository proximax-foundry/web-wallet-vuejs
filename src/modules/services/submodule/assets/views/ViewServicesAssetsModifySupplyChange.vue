<template>
 <div>
  <div class="flex cursor-pointer mt-8 ml-8 lg:ml-0 lg:absolute">
    <img src='@/assets/img/chevron_left.svg'>
    <router-link :to="{name: 'ViewServicesAssets'}" class='text-blue-primary text-xs mt-0.5'>Back</router-link>
  </div>
  <div class='w-10/12 ml-auto mr-auto'>
    <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
      <div class="xl:col-span-2 p-6 lg:p-12">
        <div class="lg:flex lg:justify-between lg:items-center">
          <div class='font-semibold mb-4 inline-block mt-1'>Modify Asset Supply</div>
          <div class="flex items-center">
            <div v-html="svgString" class="inline-block" />
            <div class="ml-2">
              <div class="text-blue-primary text-xxs font-bold uppercase mb-1">Asset created in</div>
              <div class="font-bold text-black text-sm">{{ selectedAccName }}</div>
            </div>
          </div>
        </div>{{ showSupplyErr }} {{ selectIncreaseDecrease }}
        <div v-if="showNoBalance" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('accounts.insufficientbalance')}}</div>
        </div>
        <div v-else-if="isNotCosigner" class="rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"><font-awesome-icon icon="exclamation" class="text-yellow-500 h-3 w-3 absolute" style="top: 5px; left:7px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('accounts.cosigwarning2')}}</div>
        </div>
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <div class="text-right w-full">
          <div v-if="getMultiSigCosigner.list.length > 0" class="inline-block">
            <div class="text-tsm text-left mt-3">{{$t('transfer.cosigner')}}:
              <span class="font-bold" v-if="getMultiSigCosigner.list.length == 1">{{ getMultiSigCosigner.list[0].name }} ({{$t('services.balance')}}: {{ Helper.amountFormatterSimple(getMultiSigCosigner.list[0].balance, 0) }} {{currentNativeTokenName}}) <span v-if="getMultiSigCosigner.list[0].balance < lockFundTotalFee" class="error">- {{$t('accounts.insufficientbalance')}}</span></span>
              <div v-if="cosignerBalanceInsufficient" class="error">- {{$t('accounts.insufficientbalance')}}</div>
            </div>
          </div>
        </div>
        <div class="border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5">
          <img src="@/modules/services/submodule/assets/img/icon-asset.svg">
          <div class="ml-1">
            <div class="uppercase text-blue-primary font-semibold text-xxs">Asset ID</div>
            <div class="text-black text-sm font-bold">{{ selectAsset }}</div>
          </div>
        </div>
        <div class="border border-gray-200 p-4 rounded mt-5">
          <div class="lg:grid lg:grid-cols-2">
            <div class="my-3">
              <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">CURRENT SUPPLY<img src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;" v-tooltip.bottom="'<tiptext>Maximum supply is 900T.<br>Example: 900,000,000,000,000</tiptext>'"></div>
              <div class="text-black font-bold text-sm">{{ assetSupply }}</div>
            </div>
            <div class="my-3">
              <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">Divisibility<img src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;" v-tooltip.bottom="'<tiptext>Determines up to what decimal place the asset can be divided.<br><br>Maximum divisibility is 6.<br>Example: 0.000000</tiptext>'"></div>
              <div class="text-black font-bold text-sm">{{ assetDivisibility }}</div>
            </div>
            <div class="my-3">
              <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">Transferable<img src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;" v-tooltip.bottom="'<tiptext>If you tick \'Transferable\',<br>asset can be transferred.</tiptext>'"></div>
              <div class="uppercase text-black font-bold text-sm">{{ assetTransferable?'Yes':'No' }}</div>
            </div>
            <div class="my-3">
              <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">Supply Mutable<img src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;" v-tooltip.bottom="'<tiptext>If you tick \'Supply Mutable\',<br>supply can be changed.</tiptext>'"></div>
              <div class="uppercase text-black font-bold text-sm">{{ assetMutable?'Yes':'No' }}</div>
            </div>
          </div>
        </div>
        <div class="lg:grid lg:grid-cols-2 mt-5">
          <SelectModificationType title="modification type" class="lg:mr-4" v-model="selectIncreaseDecrease" />
          <SupplyInputClean :disabled="showNoBalance||isNotCosigner" v-model="supply" :balance="balanceNumber" :placeholder="'Quantity of ' + selectIncreaseDecrease" type="text" icon="coins" :showError="showSupplyErr" :errorMessage="(!supply)? $t('scriptvalues.requiredfield'): $t('accounts.insufficientbalance')" :decimal="Number(assetDivisibility)" ckass="lg:ml-4" />
        </div>
      </div>
      <div class="bg-navy-primary py-6 px-12 xl:col-span-1">
        <div class="font-semibold text-xxs text-blue-primary">ACCOUNT CURRENT BALANCE</div>
        <div class="flex text-gray-200 mb-5">
          <span v-html="splitCurrency(balance)"></span>
          <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
        </div>
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-3">
          <div class="font-semibold">Transaction Fee</div>
          <div v-html="splitCurrency(transactionFee)"></div>
        </div>
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-3" v-if="isMultiSig(selectedAccAdd)">
          <div class="font-semibold">{{$t('accounts.lockfund')}}</div>
          <div v-html="splitCurrency(lockFundCurrency)"></div>
        </div>
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-3" v-if="isMultiSig(selectedAccAdd)">
          <div class="font-semibold">{{$t('accounts.unconfirmed')}}</div>
          <div v-html="splitCurrency(lockFundTxFee)"></div>
        </div>
        <div class="flex justify-between border-gray-600 text-white text-xs py-5">
          <div class="font-bold uppercase">Total</div>
          <div v-html="splitCurrency(totalFeeFormatted)"></div>
        </div>
        <div class='text-xs text-white mt-5'>Enter your password to continue</div>
        <div class='text-xs text-gray-400 mt-0.5 mb-1.5' >For security, this is required before proceeding to payment.</div>
        <PasswordInput :placeholder="$t('signin.enterpassword')" errorMessage="Wallet password is required" :showError="showPasswdError" v-model="walletPassword" :disabled="disabledPassword" />
        <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white" :disabled="disableModify" @click="modifyAsset">Modify Asset Supply</button>
        <div class="text-center">
          <router-link :to="{name: 'ViewServicesAssets'}" class='content-center text-xs text-white border-b-2 border-white'>Cancel</router-link>
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
import SupplyInputClean from '@/components/SupplyInputClean.vue';
import SelectModificationType from '@/modules/services/submodule/assets/components/SelectModificationType.vue';
import { ChainProfileConfig } from "@/models/stores/";
import { Wallet } from "@/models/wallet";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Currency } from "@/models/currency";
import { Helper } from '@/util/typeHelper';
import { ChainUtils } from '@/util/chainUtils';
import { AssetsUtils } from '@/util/assetsUtils';
import { WalletUtils } from '@/util/walletUtils';
import { toSvg } from "jdenticon";
import { useI18n } from 'vue-i18n';
import { useToast } from "primevue/usetoast";
import Tooltip from 'primevue/tooltip';
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';

export default {
  name: 'ViewServicesAssetsModifySupplyChange',
  directives: { 'tooltip': Tooltip },
  components: {
    PasswordInput,
    SupplyInputClean,
    SelectModificationType,
  },
  props: {
    assetId: String,
    address: String,
  },
  setup(props){
    const {t} = useI18n();
    const router = useRouter();
    const toast = useToast();
    let maxAmount = 9999999999.999999;

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);

    const showSupplyErr = ref(false);
    const walletPassword = ref('');
    const err = ref('');
    const disabledPassword = ref(false);
    const disabledSupply = ref(false);
    const disabledSelectIncreaseDecrease = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);

    const cosignerBalanceInsufficient = ref(false);
    const cosignerAddress = ref('');

    const currencyName = computed(() => networkState.currentNetworkProfile.network.currency.name);
    const lockFund = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))
    const lockFundCurrency = computed(()=> Helper.convertToCurrency(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))

    const lockFundTxFee = ref(0.0445);
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);


    const disableModify = computed(() => !(
      walletPassword.value.match(passwdPattern) && (supply.value > 0) && !showSupplyErr.value && !showNoBalance.value & !isNotCosigner.value
    ));

    const selectedAccName = ref('');
    const selectedAccAdd = ref('');
    const balance = ref('');
    const balanceNumber = ref(maxAmount);

    const isMultiSig = (address) => {
      const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address);
      const other = walletState.currentLoggedInWallet.others.find((account) => account.address == address);
      let isMulti = false;
      const accountDirectParent = account?account.getDirectParentMultisig():[];
      const otherDirectParent = other?other.getDirectParentMultisig():[];
      if((accountDirectParent.length + otherDirectParent.length) > 0){
        isMulti = true;
      }
      return isMulti;
    };

    const isMultiSigBool = ref(isMultiSig(selectedAccAdd.value));

    const showNoBalance = computed(() => {
      if(isNotCosigner.value){
        return balanceNumber.value < (transactionFeeExact.value);
      }else{
        return balanceNumber.value < (transactionFeeExact.value + lockFundTotalFee.value);
      }
    });

    const isNotCosigner = computed(() => getMultiSigCosigner.value.list.length == 0 && isMultiSig(selectedAccAdd.value));

    const supply = ref('0');

    let account = walletState.currentLoggedInWallet.accounts.find((account) => Helper.createAddress(account.address).pretty() == props.address);
    if(!account){
      account = walletState.currentLoggedInWallet.others.find((account) => Helper.createAddress(account.address).pretty() == props.address);
    }

    if(account != undefined){
      selectedAccName.value = account.name;
      selectedAccAdd.value = account.address;
      balance.value = Helper.toCurrencyFormat(account.balance, networkState.currentNetworkProfile.network.currency.divisibility);
      balanceNumber.value = account.balance;
    }else{
      toast.add({severity:'error', detail: 'Addres is invalid', group: 'br', life: 3000});
      router.push({ name: "ViewServicesAssets" });
    }

    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();

    const svgString = ref(toSvg(Helper.createAddress(selectedAccAdd.value).pretty(), 40, themeConfig.jdenticonConfig));

    const selectAsset = ref('');
    const assetDivisibility = ref(0);
    const assetSupply = ref(0);
    const assetSupplyExact = ref(false);
    const assetTransferable = ref(false);
    const assetMutable = ref(false);
    const selectIncreaseDecrease = ref('increase');

    if(account){
      let asset = account.assets.find( asset => asset.idHex === props.assetId);
      if(asset != undefined){
        selectAsset.value = asset.idHex;
        assetTransferable.value = asset.transferable;
        assetMutable.value = asset.supplyMutable;
        assetDivisibility.value = asset.divisibility;
        assetSupply.value = Helper.convertToCurrency(asset.supply, asset.divisibility);
        assetSupplyExact.value = asset.supply, asset.divisibility;
      }else{
        toast.add({severity:'error', detail: 'Asset ID is invalid', group: 'br', life: 3000});
        router.push({ name: "ViewServicesAssets" });
      }
    }

    const transactionFee = ref('0.000000');
    const transactionFeeExact = ref(0);

    const ownerPublicAccount = ref(WalletUtils.createPublicAccount(walletState.currentLoggedInWallet.selectDefaultAccount().publicKey, networkState.currentNetworkProfile.network.type));

    const getMultiSigCosigner = computed(() => {
      return AssetsUtils.getCosignerList(selectedAccAdd.value);
    });

    const cosigner = ref('');
    // get cosigner
    // if it is a multisig
    if(getMultiSigCosigner.value.list.length > 0){
      if(getMultiSigCosigner.value.list.length > 1){
        cosigner.value = cosignerAddress.value;
      }else{
        cosigner.value = getMultiSigCosigner.value.list[0].address;
      }
    }else{
      cosigner.value = '';
    }

    transactionFee.value = Helper.convertToCurrency(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectAsset.value, selectIncreaseDecrease.value, supply.value, assetDivisibility.value), networkState.currentNetworkProfile.network.currency.divisibility);
    transactionFeeExact.value = Helper.convertToExact(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectAsset.value, selectIncreaseDecrease.value, supply.value, assetDivisibility.value), networkState.currentNetworkProfile.network.currency.divisibility);

    const modifyAsset = () => {
      if(cosigner.value){
        AssetsUtils.changeAssetSupplyMultiSig(cosigner.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectAsset.value, selectIncreaseDecrease.value, supply.value, assetDivisibility.value, selectedAccAdd.value);
      }else{
        AssetsUtils.changeAssetSupply(selectedAccAdd.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectAsset.value, selectIncreaseDecrease.value, supply.value, assetDivisibility.value);
      }
      router.push({ name: "ViewServicesAssets", params: { address: Helper.createAddress(selectedAccAdd.value).pretty()}});
    };

    watch(selectIncreaseDecrease, (n) => {
      if(selectAsset.value){
        transactionFee.value = Helper.convertToCurrency(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectAsset.value, n, supply.value, assetDivisibility.value), networkState.currentNetworkProfile.network.currency.divisibility);
        transactionFeeExact.value = Helper.convertToExact(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectAsset.value, n, supply.value, assetDivisibility.value), networkState.currentNetworkProfile.network.currency.divisibility);
      }
      if(n== 'increase'){
        showSupplyErr.value = supply.value > (balanceNumber.value - totalFee.value);
      }else{
        showSupplyErr.value = supply.value > Helper.convertToExact(assetSupplyExact.value, assetDivisibility.value);
      }
    });

    watch(supply, (n) => {
      if(selectAsset.value){
        transactionFee.value = Helper.convertToCurrency(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectAsset.value, selectIncreaseDecrease.value, n, assetDivisibility.value), networkState.currentNetworkProfile.network.currency.divisibility);
        transactionFeeExact.value = Helper.convertToExact(AssetsUtils.getMosaicSupplyChangeTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, selectAsset.value, selectIncreaseDecrease.value, n, assetDivisibility.value), networkState.currentNetworkProfile.network.currency.divisibility);
      }
      if(selectIncreaseDecrease.value == 'increase'){
        showSupplyErr.value = supply.value > (balanceNumber.value - totalFee.value);
      }else{
        showSupplyErr.value = n > Helper.convertToExact(assetSupplyExact.value, assetDivisibility.value);
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

    const splitCurrency = (amount) => {
      let split = amount.toString().split(".")
      if (split[1]!=undefined){
        return '<span class="font-semibold text-sm">' + split[0] + '</span>.<span class="font-semibold text-xs">' + split[1] + ' ' + currentNativeTokenName.value + '</span>';
      }else{
        return '<span class="font-semibold text-sm">' + split[0] + '</span> <span class="font-semibold text-xs">' + currentNativeTokenName.value + '</span>';
      }
    };

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
      walletPassword,
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
      assetDivisibility,
      assetTransferable,
      assetMutable,
      getMultiSigCosigner,
      cosignerBalanceInsufficient,
      cosignerAddress,
      cosigner,
      isNotCosigner,
      disabledSelectIncreaseDecrease,
      splitCurrency,
      Helper,
      svgString,
    }
  },

}
</script>
<style scoped lang="scss">

</style>