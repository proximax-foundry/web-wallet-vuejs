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
        <div v-if="showNoBalance" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('accounts.insufficientbalance')}}</div>
        </div>
        <div v-else-if="isNotCosigner" class="rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"><font-awesome-icon icon="exclamation" class="text-yellow-500 h-3 w-3 absolute" style="top: 5px; left:7px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('accounts.cosigwarning2')}}</div>
        </div>
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <div class="mt-4">
          <SelectInputAccount @select-account="changeSelection" v-model="selectedAccAdd" :selectDefault="walletState.currentLoggedInWallet.selectDefaultAccount().address" />
          <div v-if="getMultiSigCosigner.cosignerList.length > 0">
            <div class="text-tsm text-left mt-3">{{$t('transfer.cosigner')}}:
              <span class="font-bold" v-if="getMultiSigCosigner.cosignerList.length == 1">{{ getMultiSigCosigner.cosignerList[0].name }} ({{$t('services.balance')}}: {{ Helper.amountFormatterSimple(getMultiSigCosigner.cosignerList[0].balance, 0) }} {{currentNativeTokenName}}) <span v-if="getMultiSigCosigner.cosignerList[0].balance < lockFundTotalFee" class="error">- {{$t('accounts.insufficientbalance')}}</span></span>
              <span class="font-bold" v-else><select v-model="cosignerAddress"><option v-for="(cosigner, item) in getMultiSigCosigner.cosignerList" :value="cosigner.address" :key="item">{{ cosigner.name }} (Balance: {{ cosigner.balance }} {{ currentNativeTokenName }})</option></select></span>
              <div v-if="cosignerBalanceInsufficient" class="error">- {{$t('accounts.insufficientbalance')}}</div>
            </div>
          </div>
          <div class="lg:grid lg:grid-cols-2 mt-5">
            <div class="lg:mr-2"><SupplyInputClean :disabled="showNoBalance||isNotCosigner" v-model="supply" :balance="Number.MAX_VALUE" :placeholder="$t('services.supply')" type="text" @show-error="updateSupplyErr" :showError="showSupplyErr" :errorMessage="$t('scriptvalues.requiredfield')" :decimal="Number(divisibility)" toolTip="Please put the meaning of supply here.<br><br>Maximum supply is 900T.<br>Example: 900,000,000,000,000" /></div>
            <div class="lg:ml-2"><NumberInputClean :disabled="showNoBalance||isNotCosigner" v-model="divisibility" :max="6" :placeholder="$t('services.divisibility')" :showError="showDivisibilityErr" errorMessage="Required Field - Only Numbers (0 - 6)" toolTip="Please put the meaning of divisibility here.<br><br>Maximum divisibility is 6.<br>Example: 0.000000" /></div>
          </div>
          <div class="lg:grid lg:grid-cols-2">
            <div class="mb-5 lg:mb-0 lg:mr-2"><CheckInput :disabled="showNoBalance||isNotCosigner" v-model="isTransferable" title="Transferable" toolTip='If you tick "Transferable",<br>asset can be transferred.' @click="!showNoBalance?(isTransferable = !isTransferable):''" /></div>
            <div class="mb-5 lg:mb-0 lg:ml-2"><CheckInput :disabled="showNoBalance||isNotCosigner" v-model="isMutable" title="Supply Mutable" toolTip='If you tick "Supply Mutable", supply can be changed.' @click="!showNoBalance?(isMutable = !isMutable):''" /></div>
          </div>
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
        <div class="flex justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-3">
          <div class="font-semibold">Rental Fee</div>
          <div v-html="splitCurrency(rentalFeeCurrency)"></div>
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
        <div class='text-xs text-white my-5'>Enter your password to continue</div>
        <PasswordInput :placeholder="$t('signin.enterpassword')" errorMessage="Wallet password is required" :showError="showPasswdError" v-model="walletPassword" :disabled="disabledPassword" />
        <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white" :disabled="disableCreate" @click="createAsset">Create Asset</button>
        <div class="text-center">
          <button class="content-center text-xs text-white border-b-2 border-white" >Cancel</button>
        </div>
      </div>
    </div>

    <div class="sm:grid sm:grid-cols-2 mt-10 lg:mt-16">
      <div class="mb-8">
        <a href="https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/" target=_new class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm flex items-start">What is asset?</a>
        <div class="text-gray-400 text-xs lg:text-tsm my-3 sm:pr-2">Mosaics are part of what makes the Smart Asset System unique and flexible. They are fixed assets on the Sirius Chain that can represent a set of multiple identical things that do not change.</div>
      </div>
      <div class="mb-8">
        <a href="https://t.me/proximaxhelpdesk" target=_new class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex">Give us feedback about your experience here</a>
        <div class="text-gray-400 text-tsm my-3">We are eager to keep improving our products.</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useRouter } from "vue-router";
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
import { multiSign } from '@/util/multiSignatory';

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
    const router = useRouter();

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
    const disabledPassword = computed(() => showNoBalance.value||isNotCosigner.value);
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

    const defaultDuration = ref(10 * 365);

    const ownerPublicAccount = ref(WalletUtils.createPublicAccount(walletState.currentLoggedInWallet.selectDefaultAccount().publicKey, networkState.currentNetworkProfile.network.type));

    const transactionFee = ref( Helper.amountFormatterSimple(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, isMutable.value, isTransferable.value, divisibility.value, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility));
    const transactionFeeExact = ref(Helper.convertToExact(AssetsUtils.createAssetTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, isMutable.value, isTransferable.value, divisibility.value, defaultDuration.value, true), networkState.currentNetworkProfile.network.currency.divisibility));

    const rentalFee = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.mosaicRentalFee, networkState.currentNetworkProfile.network.currency.divisibility) );
    const rentalFeeCurrency = computed(()=> Helper.convertToCurrency(networkState.currentNetworkProfileConfig.mosaicRentalFee, networkState.currentNetworkProfile.network.currency.divisibility) );

    const lockFund = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))
    const lockFundCurrency = computed(()=> Helper.convertToCurrency(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))

    const lockFundTxFee = ref(0.0445);
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);

    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && (divisibility.value != '') && (supply.value > 0) && (!showSupplyErr.value) && (!showDurationErr.value) && (!showNoBalance.value) && (!isNotCosigner.value)
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

    const fetchAccount = (publicKey) => {
      return walletState.currentLoggedInWallet.accounts.find(account => account.publicKey === publicKey);
    };

    const getMultiSigCosigner = computed(() => {
      // return AssetsUtils.getCosignerList(selectedAccAdd.value);
      let cosigners = multiSign.getCosignerInWallet(accounts.value.find(account => account.address == selectedAccAdd.value).publicKey);
      let list = [];
      cosigners.cosignerList.forEach( publicKey => {
        list.push({
          publicKey,
          name: fetchAccount(publicKey).name,
          balance: fetchAccount(publicKey).balance
        });
      });

      cosigners.cosignerList = list;
      return cosigners;
    });

    const isNotCosigner = computed(() => getMultiSigCosigner.value.cosignerList.length == 0 && isMultiSig(selectedAccAdd.value));

    const showNoBalance = computed(() => {
      if(isNotCosigner.value){
        return balanceNumber.value < (rentalFee.value + transactionFeeExact.value);
      }else{
        return balanceNumber.value < (rentalFee.value + transactionFeeExact.value + lockFundTotalFee.value);
      }
    });

    if(balanceNumber.value < (rentalFee.value + transactionFee.value)){
      if(!isNotCosigner.value){
        // showNoBalance.value = true;
      }
      disabledClear.value = true;
      disabledDuration.value = true;
      durationCheckDisabled.value = true;
    }else{
      disabledClear.value = false;
      disabledDuration.value = false;
      durationCheckDisabled.value = false;
    }

    const moreThanOneAccount = computed(()=>{
      return accounts.value.length > 1;
    });

    const changeSelection = (address) => {
      let account = walletState.currentLoggedInWallet.accounts.find(account => account.address == address);
      if(!account){
        account = walletState.currentLoggedInWallet.others.find(account => account.address == address);
      }
      selectedAccName.value = account.name;
      selectedAccAdd.value = address;
      balance.value = Helper.toCurrencyFormat(account.balance, networkState.currentNetworkProfile.network.currency.divisibility);
      balanceNumber.value = account.balance;
      // showNoBalance.value = ((account.balance < (rentalFee.value + transactionFeeExact.value)) && !isNotCosigner.value) ?true:false;
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
      if(balanceNumber.value < n && !isNotCosigner.value){
        showNoBalance.value = true;
      }else{
        showNoBalance.value = false;
      }
    });

    watch(isNotCosigner, (n) => {
      if(n){
        showNoBalance.value = true;
      }else{
        showNoBalance.value = false;
      }
    });

    const updateSupplyErr = (bolError) => {
      showSupplyErr.value = bolError;
    }

    const createAsset = () => {
      if(cosigner.value){
        AssetsUtils.createAssetMultiSig( cosigner.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, supply.value, isMutable.value, isTransferable.value, divisibility.value, defaultDuration.value, selectedAccAdd.value); 
      }else{
        AssetsUtils.createAsset( selectedAccAdd.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, ownerPublicAccount.value, supply.value, isMutable.value, isTransferable.value, divisibility.value, defaultDuration.value);
      }
      clearInput();
      router.push({ name: "ViewServicesAssets"});
    };

    const cosigner = computed(() => {
      if(getMultiSigCosigner.value.cosignerList.length > 0){
        if(getMultiSigCosigner.value.cosignerList.length > 1){
          return cosignerAddress.value;
        }else{
          return fetchAccount(getMultiSigCosigner.value.cosignerList[0].publicKey).address;
        }
      }else{
        return '';
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

    return {
      fetchAccount,
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
      disabledPassword,
      disabledClear,
      createAsset,
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
      networkState,
      Helper,
      splitCurrency,
      updateSupplyErr,
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