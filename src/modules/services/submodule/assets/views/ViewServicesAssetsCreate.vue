<template>
 <div>
  <div class="flex cursor-pointer mt-8 ml-8 lg:ml-0 lg:absolute">
    <img src='@/assets/img/chevron_left.svg'>
    <router-link :to="{name: 'ViewServicesAssets'}" class='text-blue-primary text-xs mt-0.5'>Back</router-link>
  </div>
  <div class='w-10/12 ml-auto mr-auto'>
    <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
      <div class="xl:col-span-2 p-12">
        <div class='font-semibold mb-4'>Create Asset</div>
        <div class='pl-6'>
          <div class=" error error_box mb-5" v-if="err!=''">{{ err }}</div>
        </div>
        <div class="mt-4">
          <SelectInputAccount @select-account="changeSelection" v-model="selectedAccAdd" :selectDefault="walletState.currentLoggedInWallet.selectDefaultAccount().address" />
          <div class="lg:grid lg:grid-cols-2 mt-5">
            <div class="lg:mr-2"><SupplyInputClean :disabled="showNoBalance" v-model="supply" :balance="balanceNumber" :placeholder="$t('services.supply')" type="text" icon="coins" :showError="showSupplyErr" :errorMessage="(!supply)? $t('scriptvalues.requiredfield'): $t('accounts.insufficientbalance')" :decimal="Number(divisibility)" toolTip="Please put the meaning of supply here.<br><br>Maximum supply is 900T.<br>Example: 900,000,000,000,000" /></div>
            <div class="lg:ml-2"><NumberInputClean :disabled="showNoBalance" v-model="divisibility" :max="6" :placeholder="$t('services.divisibility')" :showError="showDivisibilityErr" errorMessage="Required Field - Only Numbers (0 - 6)" toolTip="Please put the meaning of divisibility here.<br><br>Maximum divisibility is 6.<br>Example: 0.000000" /></div>
          </div>
          <div class="lg:grid lg:grid-cols-2">
            <div class="mb-5 lg:mb-0 lg:mr-2"><CheckInput :disabled="showNoBalance" v-model="isTransferable" title="Transferable" toolTip='If you tick "Transferable",<br>asset can be transferred.' @click="!showNoBalance?(isTransferable = !isTransferable):''" /></div>
            <div class="mb-5 lg:mb-0 lg:ml-2"><CheckInput :disabled="showNoBalance" v-model="isMutable" title="Supply Mutable" toolTip='If you tick "Supply Mutable", supply can be changed.' @click="!showNoBalance?(isMutable = !isMutable):''" /></div>
          </div>
        </div>
      </div>
      <div class="bg-navy-primary py-6 px-12 xl:col-span-1">
        <div class="font-semibold text-xxs text-blue-primary">ACCOUNT CURRENT BALANCE</div>
        <div class="flex text-gray-200 mb-5" v-if="!showNoBalance">
          <!-- <div class = 'text-md font-bold '>{{splitBalance.left}} </div>
          <div class = 'text-md font-bold' v-if='splitBalance.right!=null'>.</div>
          <div class='text-xs mt-1.5 font-bold'>{{splitBalance.right}}</div> -->
          <div>{{ balance }}</div>
          <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
          <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
        </div>
        <div v-else class="flex text-red-primary mb-5">{{$t('accounts.insufficientbalance')}}</div>
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-sm py-3">
          <div class="font-bold">Transaction Fee</div>
          <div>{{ transactionFee }}</div>
        </div>
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-sm py-3">
          <div class="font-bold">Rental Fee</div>
          <div>{{ rentalFeeCurrency }}</div>
        </div>
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-sm py-3" v-if="isMultiSig(selectedAccAdd)">
          <div class="font-bold">{{$t('accounts.lockfund')}}</div>
          <div>{{ lockFundCurrency }}</div>
        </div>
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-sm py-3" v-if="isMultiSig(selectedAccAdd)">
          <div class="font-bold">{{$t('accounts.unconfirmed')}}</div>
          <div>{{ lockFundTxFee }}</div>
        </div>
        <div class="flex justify-between border-gray-600 text-gray-200 text-sm py-5">
          <div class="font-bold">Total</div>
          <div>{{ totalFeeFormatted }}</div>
        </div>
        <div class='text-xs text-white mt-5'>Enter your password to continue</div>
        <div class='text-xs text-gray-400 mt-0.5 mb-1.5' >For security, this is required before proceeding to payment.</div>
        <PasswordInput :placeholder="$t('signin.enterpassword')" errorMessage="Wallet password is required" :showError="showPasswdError" v-model="walletPassword" :disabled="disabledPassword" />
        <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white" :disabled="disableCreate">Create Asset</button>
        <div class="text-center">
          <button class="content-center text-xs text-white border-b-2 border-white" >Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { computed, ref, watch } from 'vue';
// import { useRouter } from "vue-router";
import SelectInputAccount from '@/components/SelectInputAccount.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import SupplyInputClean from '@/components/SupplyInputClean.vue';
import CheckInput from '@/components/CheckInput.vue';
import NumberInputClean from '@/modules/services/submodule/assets/components/NumberInputClean.vue';
import { ChainProfileConfig } from "@/models/stores/";
import { Wallet } from "@/models/wallet";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Currency } from "@/models/currency";
import { Helper } from '@/util/typeHelper';
import { ChainUtils } from '@/util/chainUtils';
import { AssetsUtils } from '@/util/assetsUtils';
import { WalletUtils } from '@/util/walletUtils';
export default {
  name: 'ViewServicesAssetsCreate',
  components: {
    CheckInput,
    PasswordInput,
    SupplyInputClean,
    NumberInputClean,
    SelectInputAccount,
    /* AddCosignModal, */
  },
  setup(){
    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);
    const showSupplyErr = ref(false);
    const walletPassword = ref('');
    const err = ref('');
    const currentSelectedName = ref('');
    const divisibility = ref('0');
    const showDivisibilityErr = ref(false);
    const isTransferable = ref(false);
    const isMutable = ref(false);
    const disabledMutableCheck = ref(false);
    const disabledTransferableCheck = ref(false);
    const disabledPassword = ref(false);
    const disabledClear = ref(false);
    const disabledDuration = ref(false);
    const durationOption =ref('month');
    const duration = ref('1');
    const showDurationErr = ref(false);
    const walletName = walletState.currentLoggedInWallet.name
    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const durationCheckDisabled = ref(false);
    const cosignerBalanceInsufficient = ref(false);
    const cosignerAddress = ref('');

    const currencyName = computed(() => networkState.currentNetworkProfile.network.currency.name);
    const rentalFee = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.mosaicRentalFee, networkState.currentNetworkProfile.network.currency.divisibility) );
    const rentalFeeCurrency = computed(()=> Helper.convertToCurrency(networkState.currentNetworkProfileConfig.mosaicRentalFee, networkState.currentNetworkProfile.network.currency.divisibility) );

    const lockFund = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))
    const lockFundCurrency = computed(()=> Helper.convertToCurrency(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))

    const lockFundTxFee = ref(0.0445);
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);

    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && !disabledMutableCheck.value && (divisibility.value != '') && (supply.value > 0) && (!showDurationErr.value)
    ));

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

    const selectedAccName = ref(walletState.currentLoggedInWallet.selectDefaultAccount().name);
    // const selectedAccAdd = ref('');
    const selectedAccAdd = ref(walletState.currentLoggedInWallet.selectDefaultAccount().address);
    const balance = ref(Helper.toCurrencyFormat(walletState.currentLoggedInWallet.selectDefaultAccount().balance, networkState.currentNetworkProfile.network.currency.divisibility));
    // const balanceNumber = ref('');
    const balanceNumber = ref(walletState.currentLoggedInWallet.selectDefaultAccount().balance);
    const isMultiSigBool = ref(isMultiSig(walletState.currentLoggedInWallet.selectDefaultAccount().address));

    const supply = ref('0');

    const showNoBalance = ref(false);

    const getMultiSigCosigner = computed(() => {
      return AssetsUtils.getCosignerList(selectedAccAdd.value);
    });

    const isNotCosigner = computed(() => getMultiSigCosigner.value.list.length == 0 && isMultiSig(selectedAccAdd.value));

    if(balance.value < rentalFee.value){
      if(!isNotCosigner.value){
        showNoBalance.value = true;
      }
      disabledMutableCheck.value = true;
      disabledTransferableCheck.value = true;
      disabledPassword.value = true;
      disabledClear.value = true;
      disabledDuration.value = true;
      durationCheckDisabled.value = true;
    }else{
      disabledMutableCheck.value = false;
      disabledTransferableCheck.value = false;
      disabledPassword.value = false;
      disabledClear.value = false;
      disabledDuration.value = false;
      durationCheckDisabled.value = false;
    }

    const accounts = computed( () => {
      if(walletState.currentLoggedInWallet){
        if(walletState.currentLoggedInWallet.others){
          const concatOther = walletState.currentLoggedInWallet.accounts.concat(walletState.currentLoggedInWallet.others)
          return concatOther;
        } else{
          return walletState.currentLoggedInWallet.accounts;
        }
      } else{
        return [];
      }
    });

    const moreThanOneAccount = computed(()=>{
      return accounts.value.length > 1;
    });

    const defaultDuration = ref(10 * 365);

    const ownerPublicAccount = ref(WalletUtils.createPublicAccount(walletState.currentLoggedInWallet.selectDefaultAccount().publicKey, networkState.currentNetworkProfile.network.type));
    const transactionFee = ref( Helper.amountFormatterSimple(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, isMutable.value, isTransferable.value, divisibility.value, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility));
    const transactionFeeExact = ref(Helper.convertToExact(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, isMutable.value, isTransferable.value, divisibility.value, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility));

    const changeSelection = (address) => {
      let account = walletState.currentLoggedInWallet.accounts.find(account => account.address == address);
      selectedAccName.value = account.name;
      selectedAccAdd.value = address;
      balance.value = Helper.toCurrencyFormat(account.balance, networkState.currentNetworkProfile.network.currency.divisibility);
      showNoBalance.value = ((balance.value < rentalFee.value) && !isNotCosigner.value)?true:false;
      currentSelectedName.value = account.name;
      ownerPublicAccount.value = WalletUtils.createPublicAccount(account.publicKey, networkState.currentNetworkProfile.network.type);
    }

    const clearInput = () => {
      walletPassword.value = '';
      divisibility.value = '0';
      supply.value = '0';
      duration.value = '1';
      durationOption.value = 'month';
      disabledDuration.value = '';
      isTransferable.value = false;
      isMutable.value = false;
    };

    watch(divisibility, (n) => {
      transactionFee.value = Helper.amountFormatterSimple(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, supply.value, isMutable.value, isTransferable.value, n, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility);
      transactionFeeExact.value = Helper.convertToExact(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, supply.value, isMutable.value, isTransferable.value, n, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility);
    });

    watch(isMutable, (n) => {
      transactionFee.value = Helper.amountFormatterSimple(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, supply.value, n, isTransferable.value, divisibility.value, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility);
      transactionFeeExact.value = Helper.convertToExact(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, supply.value, n, isTransferable.value, divisibility.value, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility);
    });

    watch(isTransferable, (n) => {
      transactionFee.value = Helper.amountFormatterSimple(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, supply.value, isMutable.value, n, divisibility.value, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility);
      transactionFeeExact.value = Helper.convertToExact(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, supply.value, isMutable.value, n, divisibility.value, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility);
    });

    watch(supply, (n) => {
      transactionFee.value = Helper.amountFormatterSimple(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, n, isMutable.value, isTransferable.value, divisibility.value, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility);
      transactionFeeExact.value = Helper.convertToExact(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, n, isMutable.value, isTransferable.value, divisibility.value, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility);
    });

    watch(durationOption, () => {
      duration.value = '1';
    });

    watch(disabledDuration, (n) => {
      (n)?duration.value = '':duration.value = '1';
    });

    watch(duration, (n) =>{
      if(durationOption.value=='year' && n > 10){
        showDurationErr.value = true;
      }else if(durationOption.value=='month' && n > 120){
        showDurationErr.value = true;
      }else{
        showDurationErr.value = false;
      }
    });

    // calculate fees
    const totalFee = computed(() => {
      // if multisig
      if(isMultiSig(selectedAccAdd.value)){
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
        showNoBalance.value = true;
        disabledMutableCheck.value = true;
        disabledTransferableCheck.value = true;
        disabledPassword.value = true;
      }else{
        showNoBalance.value = false;
        disabledMutableCheck.value = false;
        disabledTransferableCheck.value = false;
        disabledPassword.value = false;
      }
    });

    watch(isNotCosigner, (n) => {
      if(n){
        showNoBalance.value = true;
        disabledMutableCheck.value = true;
        disabledTransferableCheck.value = true;
        disabledPassword.value = true;
      }else{
        showNoBalance.value = false;
        disabledMutableCheck.value = false;
        disabledTransferableCheck.value = false;
        disabledPassword.value = false;
      }
    });

    const createMosaic = () => {
      if(cosigner.value){
        AssetsUtils.createAssetMultiSig( cosigner.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, supply.value, isMutable.value, isTransferable.value, divisibility.value, defaultDuration.value, selectedAccAdd.value); 
      }else{
        AssetsUtils.createAsset( selectedAccAdd.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, supply.value, isMutable.value, isTransferable.value, divisibility.value, defaultDuration.value);
      }
      clearInput();
      // to be replaced by new method to create new asset
      // let createStatus = mosaicTransaction(divisibility.value, supply.value, duration.value, durationOption.value, isMutable.value, isTransferable.value, walletPassword.value, selectedAccName.value, appStore, siriusStore);
      // if(!createStatus){
      //   err.value = 'Invalid wallet password';
      // }else{
      //   // transaction made
      //   err.value = '';
      //   clearInput();
      // }
    };

    const cosigner = ref('');
    // get cosigner
    watch(getMultiSigCosigner, (n) => {
      // if it is a multisig
      if(n.list.length > 0){
        if(n.list.length > 1){
          cosigner.value = cosignerAddress.value;
        }else{
          cosigner.value = n.list[0].address;
        }
      }else{
        cosigner.value = '';
      }
    });

    return {
      accounts,
      moreThanOneAccount,
      currentSelectedName,
      selectedAccName,
      selectedAccAdd,
      isTransferable,
      isMutable,
      balance,
      balanceNumber,
      showNoBalance,
      showSupplyErr,
      showDivisibilityErr,
      err,
      walletPassword,
      disableCreate,
      clearInput,
      showPasswdError,
      changeSelection,
      supply,
      divisibility,
      transactionFee,
      disabledMutableCheck,
      disabledTransferableCheck,
      disabledPassword,
      disabledClear,
      createMosaic,
      disabledDuration,
      durationOption,
      duration,
      showDurationErr,
      durationCheckDisabled,
      isMultiSig,
      isMultiSigBool,
      rentalFeeCurrency,
      lockFundCurrency,
      currencyName,
      lockFundTxFee,
      lockFundTotalFee,
      totalFeeFormatted,
      getMultiSigCosigner,
      cosignerBalanceInsufficient,
      cosignerAddress,
      isNotCosigner,
      walletName,
      currentNativeTokenName,
      currentNativeTokenDivisibility,
      walletState,
    }
  },
}
</script>
<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>