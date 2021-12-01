<template>
 <div>
  <div class="flex cursor-pointer mt-8 ml-8 lg:ml-0 lg:absolute">
    <img src='@/assets/img/chevron_left.svg'>
    <router-link :to="{name: 'ViewServicesNamespace'}" class='text-blue-primary text-xs mt-0.5'>Back</router-link>
  </div>
  <div class='w-10/12 ml-auto mr-auto'>
    <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
      <div class="xl:col-span-2 p-12">
        <div class='font-semibold mb-4'>Create Namespace</div>
        <div v-if="showNoBalance" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('accounts.insufficientbalance')}}</div>
        </div>
        <div v-else-if="isNotCosigner" class="rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center">
          <div class="rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"><font-awesome-icon icon="exclamation" class="text-yellow-500 h-3 w-3 absolute" style="top: 5px; left:7px"></font-awesome-icon></div><div class="inline-block text-xs">{{$t('accounts.cosigwarning2')}}</div>
        </div>
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <div class="mt-4">
          <SelectInputAccount @select-account="changeSelection" v-model="selectedAccAdd" :selectDefault="walletState.currentLoggedInWallet.selectDefaultAccount().address" />
          <div v-if="getMultiSigCosigner.list.length > 0">
            <div class="text-tsm text-left mt-3">{{$t('transfer.cosigner')}}:
              <span class="font-bold" v-if="getMultiSigCosigner.list.length == 1">{{ getMultiSigCosigner.list[0].name }} ({{$t('services.balance')}}: {{ Helper.amountFormatterSimple(getMultiSigCosigner.list[0].balance, 0) }} {{ currentNativeTokenName }}) <span v-if="getMultiSigCosigner.list[0].balance < lockFundTotalFee" class="error">- {{$t('accounts.insufficientbalance')}}</span></span>
              <div v-if="cosignerBalanceInsufficient" class="error">- {{$t('accounts.insufficientbalance')}}</div>
            </div>
          </div>
          <SelectInputParentNamespace @select-namespace="updateNamespaceSelection" v-model="selectNamespace" :address="selectedAccAdd" class="mt-5" :disabled="disableSelectNamespace" />
          <div class="lg:grid lg:grid-cols-2 mt-5">
            <div class="mb-5 lg:mb-0 lg:mr-2"><TextInputTooltip :disabled="disableNamespaceName" placeholder="Name" errorMessage="Fill in a valid name" v-model="namespaceName" icon="id-card-alt" :showError="showNamespaceNameError" class="w-full inline-block" toolTip="A namespace can have a maximium length of 16 alphanumerical characters while sub-namespaces can have a maximium length of 64 alphanumerical characters.<br><br>Three layers can be created. A namespace can have a subnamespace, and a subnamespace can have its own subnamespace (e.g., test1.test2.test3).<br><br>Certain phrases are already reserved." /></div>
            <div class="mb-5 lg:mb-0 lg:ml-2"><DurationInputClean :disabled="disabledDuration" v-model="duration" :max="365" placeholder="Duration (number of days)" :showError="showDurationErr" errorMessage="Required Field - Only Numbers (0 - 6)" toolTip="Maximum rental duration is<br>1 year (365 days)." /></div>
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
        <div class='text-xs text-white mt-5'>Enter your password to continue</div>
        <div class='text-xs text-gray-400 mt-0.5 mb-1.5' >For security, this is required before proceeding to payment.</div>
        <PasswordInput :placeholder="$t('signin.enterpassword')" errorMessage="Wallet password is required" :showError="showPasswdError" v-model="walletPassword" :disabled="disabledPassword" />
        <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white" :disabled="disableCreate" @click="createNamespace">Register Namespace</button>
        <div class="text-center">
          <button class="content-center text-xs text-white border-b-2 border-white" >Cancel</button>
        </div>
      </div>
    </div>

    <div class="lg:grid lg:grid-cols-3 mt-10 lg:mt-16">
      <div>
        <a href="https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/" target=_new class="text-blue-primary font-bold inline-block text-tsm">What is Namespace?</a>
        <div class="text-gray-400 text-tsm my-3 sm:pr-2">A namespace starts with a name that you choose, similar to an internet domain name.</div>
      </div>
      <div>
        <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="text-blue-primary font-bold inline-block text-tsm">The complete guide about Namespace</router-link>
        <div class="text-gray-400 text-tsm my-3">What is namespace? Refer to the complete guide on Namespace here.</div>
      </div>
      <div>
        <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="text-blue-primary font-bold inline-block text-tsm">Give us feedback about your experience here</router-link>
        <div class="text-gray-400 text-tsm my-3">Give us feedback about your experience here</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import TextInputTooltip from '@/components/TextInputTooltip.vue';
import SelectInputAccount from '@/components/SelectInputAccount.vue';
import SelectInputParentNamespace from '@/modules/services/submodule/namespaces/components/SelectInputParentNamespace.vue';
import DurationInputClean from '@/modules/services/submodule/namespaces/components/DurationInputClean.vue';
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { NamespaceUtils } from '@/util/namespaceUtils';

export default {
  name: 'ViewServicesNamespaceCreate',
  components: {
    PasswordInput,
    TextInputTooltip,
    DurationInputClean,
    SelectInputAccount,
    SelectInputParentNamespace
  },
  setup(){
    const router = useRouter();

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);

    const disableNamespaceName = ref(false);
    const disableSelectNamespace = ref(false);
    const namespaceName = ref('');
    const showDurationErr = ref(false);
    const duration = ref("1");
    const walletPassword = ref('');
    const err = ref('');
    const currentSelectedName = ref('');
    const disabledPassword = ref(false);
    const disabledDuration = ref(false);
    const disabledClear = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const namespacePattern = "^[0-9a-zA-Z]{2,16}$";
    const childNamespacePattern = "^[0-9a-zA-Z]{2,64}$";

    const showNamespaceNameError = computed(() => {
      if(namespaceName.value.length > 0){
        if(selectNamespace.value == '1'){
          return (namespaceName.value.match(namespacePattern)?false:true);
        }else{
          return (namespaceName.value.match(childNamespacePattern)?false:true);
        }
      }else{
        return false;
      }
    });

    const selectNamespace = ref('');
    const cosignerBalanceInsufficient = ref(false);
    const cosignerAddress = ref('');

    const namespaceOption = computed(() => {
      let namespace = [];
      namespace.push({
        value: '1',
        label: 'New Root Namespace',
        level: 0,
        disabled: false,
      });
      const namespacesList = NamespaceUtils.listNamespaces(selectedAccAdd.value);
      if(namespacesList.length > 0){
        namespace.push.apply(namespace, namespacesList);
      }
      return namespace;
    });
    const currencyName = computed(() => networkState.currentNetworkProfile.network.currency.name);

    const rentalFee = computed(()=> {
      if(selectNamespace.value){
        if(selectNamespace.value == '1'){
          if(duration.value > 0){
            return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock * NamespaceUtils.calculateDuration(duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
          }else{
            return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock, networkState.currentNetworkProfile.network.currency.divisibility);
          }
        }else{
          return Helper.convertToExact(networkState.currentNetworkProfileConfig.childNamespaceRentalFee, 6);
        }
      }else{
        return 0;
      }
    });

    const rentalFeeCurrency = computed(()=> Helper.toCurrencyFormat(rentalFee.value, 6) );

    const lockFund = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))
    const lockFundCurrency = computed(()=> Helper.toCurrencyFormat(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))

    const lockFundTxFee = ref(0.0445);
    const lockFundTxFeeCurrency = ref('0.044500');
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);

    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && namespaceName.value.match(namespacePattern) && (!showDurationErr.value) && (!showNoBalance.value) && (!isNotCosigner.value)
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
    const selectedAccAdd = ref(walletState.currentLoggedInWallet.selectDefaultAccount().address);
    const balance = ref(Helper.toCurrencyFormat(walletState.currentLoggedInWallet.selectDefaultAccount().balance, networkState.currentNetworkProfile.network.currency.divisibility));
    const balanceNumber = ref(walletState.currentLoggedInWallet.selectDefaultAccount().balance);

    const isMultiSigBool = computed( () => isMultiSig(walletState.currentLoggedInWallet.selectDefaultAccount().address));

    const isNotCosigner = computed(() => getMultiSigCosigner.value.list.length == 0 && isMultiSig(selectedAccAdd.value));

    const showNoBalance = computed(() => {
      if(isNotCosigner.value){
        return balanceNumber.value < (rentalFee.value + transactionFeeExact.value);
      }else{
        return balanceNumber.value < (rentalFee.value + transactionFeeExact.value + lockFundTotalFee.value);
      }
    });

    // validate enough fee to create namespace
    if(balance.value < rentalFee.value){
      disabledPassword.value = true;
      disabledClear.value = true;
      disabledDuration.value = true;
      disableNamespaceName.value = true;
      disableSelectNamespace.value = true;
    }else{
      disabledPassword.value = false;
      disabledClear.value = false;
      disabledDuration.value = false;
      disableNamespaceName.value = false;
      disableSelectNamespace.value = false;
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

    const moreThanOneAccount = computed(()=> {
      return accounts.value.length > 1;
    });

    const transactionFee = ref(0);
    const transactionFeeExact = ref(0);

    const getMultiSigCosigner = computed(() => {
      return NamespaceUtils.getCosignerList(selectedAccAdd.value);
    });

    const changeSelection = (address) => {
      let account = walletState.currentLoggedInWallet.accounts.find(account => account.address == address);
      if(!account){
        account = walletState.currentLoggedInWallet.others.find(account => account.address == address);
      }
      selectNamespace.value = '';
      selectedAccName.value = account.name;
      selectedAccAdd.value = account.address;
      balance.value = Helper.toCurrencyFormat(account.balance, networkState.currentNetworkProfile.network.currency.divisibility);
      balanceNumber.value = account.balance;
      currentSelectedName.value = account.name;
    }

    const updateNamespaceSelection = (namespaceNameSelected) => {
      if(namespaceNameSelected == '1'){
        //root
        disabledDuration.value = false;
        if(namespaceName.value.length > 0){
          transactionFee.value = Helper.convertToCurrency(NamespaceUtils.getRootNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
          transactionFeeExact.value = Helper.convertToExact(NamespaceUtils.getRootNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
        }
      }else{
        duration.value = '0';
        //subnamespace
        disabledDuration.value = true;
        if(namespaceName.value.length > 0){
          transactionFee.value = Helper.convertToCurrency(NamespaceUtils.getSubNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceNameSelected, namespaceName.value), networkState.currentNetworkProfile.network.currency.divisibility);
          transactionFeeExact.value = Helper.convertToExact(NamespaceUtils.getSubNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceNameSelected, namespaceName.value), networkState.currentNetworkProfile.network.currency.divisibility);
        }
      }
    };

    const clearNamespaceSelection = () => {
      duration.value = '0';
    };

    const createNamespace = () => {
      if(cosigner.value){
        // for multisig
        if(selectNamespace.value==='1'){
          NamespaceUtils.createRootNamespaceMultisig(cosigner.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, duration.value, selectedAccAdd.value);
        }else{
          NamespaceUtils.createSubNamespaceMultisig(cosigner.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, selectNamespace.value, selectedAccAdd.value);
        }
      }else{
        if(selectNamespace.value==='1'){
          NamespaceUtils.createRootNamespace(selectedAccAdd.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, duration.value);
        }else{
          NamespaceUtils.createSubNamespace(selectedAccAdd.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, selectNamespace.value);
        }
      }
      router.push({ name: "ViewServicesNamespace", params: { address: Helper.createAddress(selectedAccAdd.value).pretty()} });
    };

    watch(duration, (n) => {
      if(n > 365){
        duration.value = '365';
      }
    });

    watch(namespaceName, (n) => {
      if(namespaceName.value.length > 0){
        if(selectNamespace.value==='1'){
          if(namespaceName.value.match(namespacePattern)){
            transactionFee.value = Helper.convertToCurrency(NamespaceUtils.getRootNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, n, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
            transactionFeeExact.value = Helper.convertToExact(NamespaceUtils.getRootNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, n, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
          }else{
            transactionFee.value = '0';
            transactionFeeExact.value = 0;
          }
        }else{
          if(namespaceName.value.match(childNamespacePattern)){
            transactionFee.value = Helper.convertToCurrency(NamespaceUtils.getSubNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, n, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
            transactionFeeExact.value = Helper.convertToExact(NamespaceUtils.getSubNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, n, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
          }else{
            transactionFee.value = '0';
            transactionFeeExact.value = 0;
          }
        }
      }else{
        transactionFee.value = '0';
        transactionFeeExact.value = 0;
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

    watch(totalFee, (n) => {
      if(balance.value < n && !isNotCosigner.value){
        disabledPassword.value = true;
        disableSelectNamespace.value = true;
      }else{
        disabledPassword.value = false;
        disableSelectNamespace.value = false;
      }
    });

    const totalFeeFormatted = computed(() => {
      return Helper.amountFormatterSimple(totalFee.value, 0);
    });

    watch(isNotCosigner, (n) => {
      if(n){
        disabledPassword.value = true;
        disabledDuration.value = true;
        disableNamespaceName.value = true;
        disableSelectNamespace.value = true;
      }else{
        disabledPassword.value = false;
        disabledDuration.value = false;
        disableNamespaceName.value = false;
        disableSelectNamespace.value = false;
      }
    });

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

    const splitCurrency = (amount) => {
      let split = amount.toString().split(".")
      if (split[1]!=undefined){
        return '<span class="font-semibold text-sm">' + split[0] + '</span>.<span class="font-semibold text-xs">' + split[1] + ' ' + currentNativeTokenName.value + '</span>';
      }else{
        return '<span class="font-semibold text-sm">' + split[0] + '</span> <span class="font-semibold text-xs">' + currentNativeTokenName.value + '</span>';
      }
    };

    return {
      Helper,
      accounts,
      moreThanOneAccount,
      currentSelectedName,
      selectedAccName,
      selectedAccAdd,
      balance,
      showNoBalance,
      err,
      showNamespaceNameError,
      namespaceName,
      disableNamespaceName,
      walletPassword,
      disableCreate,
      showPasswdError,
      changeSelection,
      disableSelectNamespace,
      disabledPassword,
      disabledClear,
      disabledDuration,
      duration,
      showDurationErr,
      isMultiSig,
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
      createNamespace,
      transactionFee,
      updateNamespaceSelection,
      clearNamespaceSelection,
      getMultiSigCosigner,
      cosignerBalanceInsufficient,
      cosignerAddress,
      isNotCosigner,
      splitCurrency,
      walletState,
      currentNativeTokenName,
    }
  },

}
</script>
<style scoped lang="scss">

.slide-enter-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
   -moz-transition-timing-function: ease-in;
   -webkit-transition-timing-function: ease-in;
   -o-transition-timing-function: ease-in;
   transition-timing-function: ease-in;
}

.slide-leave-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave-from {
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}

.optionDiv:hover{
  background: #D9EBFF;
}
</style>
