<template>
  <div>
    <div class="flex justify-between text-sm">
      <div><span class="text-gray-300">{{$t('services.namespaces')}} ></span> <span class="text-blue-primary font-bold">{{$t('welcome.create')}}</span></div>
      <div>
        <router-link :to="{ name: 'ViewServices' }" class="font-bold">{{$t('services.allservices')}}</router-link>
      </div>
    </div>
    <div class='mt-2 py-3 gray-line text-center md:grid md:grid-cols-4'>
      <div class="md:col-span-3">
        <form @submit.prevent="createNamespace">
          <fieldset class="w-full">
            <div class="mb-5">
              <div v-if="showNoBalance" class="border-2 rounded-3xl border-red-700 w-full h-24 text-center p-4">
                <div class="h-5 text-center">
                  <div class="rounded-full w-8 h-8 border border-gray-500 inline-block relative"><font-awesome-icon icon="times" class="text-gray-500 h-5 w-5 absolute" style="top: 5px; left:8px"></font-awesome-icon></div><br>
                  <div class="inline-block text-tsm">{{$t('accounts.insufficientbalance')}}</div>
                </div>
              </div>
              <div v-if="isNotCosigner" class="border-2 rounded-3xl border-yellow-400 w-full h-24 text-center p-4">
                <div class="h-5 text-center">
                  <div class="rounded-full w-8 h-8 border border-yellow-500 inline-block relative"><font-awesome-icon icon="exclamation" class="text-yellow-500 h-5 w-5 absolute" style="top: 5px; left:11px"></font-awesome-icon></div><br>
                  <div class="inline-block text-tsm">{{$t('accounts.cosigwarning1')}}</div>
                </div>
              </div>
              <div class="error error_box" v-if="err!=''">{{ err }}</div>
              <div v-if="moreThanOneAccount" class="text-left p-4">
                <div class="mb-1 cursor-pointer z-20 border-b border-gray-200" @click="showMenu = !showMenu">
                  <div class="font-bold text-xs">{{ selectedAccName }} <span v-if="isMultiSigBool" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">{{$t('accounts.multisig')}}</span></div>
                  <div class="text-gray-400 mt-1 text-sm ">{{ selectedAccAdd }}</div>
                </div>
                <transition name="slide">
                <div v-if="showMenu" class="z-10">
                  <div :key="item.address" :i="index" v-for="(item, index) in accounts" class="p-2 cursor-pointer" :class="item.name==selectedAccName?'bg-blue-primary text-white font-bold':'text-gray-800 bg-gray-50 optionDiv'" @click="changeSelection(item)" :title="'Address is ' + item.address">
                    <div>{{ item.name }} <span v-if="isMultiSig(item.address)" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">{{$t('accounts.multisig')}}</span></div>
                  </div>
                </div>
                </transition>
                <input type="hidden" v-model="currentSelectedName">
              </div>
              <div v-else class="text-left mb-2">
                <div class="mb-1 z-20 border-b border-gray-200">
                  <div class="font-bold text-xs">{{ selectedAccName }} <span v-if="isMultiSigBool" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">{{$t('accounts.multisig')}}</span></div>
                  <div class="text-gray-400 mt-1 text-sm ">{{ selectedAccAdd }}</div>
                </div>
              </div>
              <div v-if="getMultiSigCosigner.list.length > 0">
                <div class="text-tsm text-left ml-4">{{$t('transfer.cosigner')}}:
                  <span class="font-bold" v-if="getMultiSigCosigner.list.length == 1">{{ getMultiSigCosigner.list[0].name }} ({{$t('services.balance')}}: {{ getMultiSigCosigner.list[0].balance }} XPX) <span v-if="getMultiSigCosigner.list[0].balance < lockFundTotalFee" class="error">- {{$t('accounts.insufficientbalance')}}</span></span>
                  <span class="font-bold" v-else><select v-model="cosignerAddress"><option v-for="(cosigner, item) in getMultiSigCosigner.list" :value="cosigner.address" :key="item">{{ cosigner.name }} ({{$t('services.balance')}}: {{ cosigner.balance }} XPX)</option></select></span>
                  <div v-if="cosignerBalanceInsufficient" class="error">- {{$t('accounts.insufficientbalance')}}</div>
                </div>
              </div>
            </div>
            <div class="text-left p-3 pb-0 border-l-8 border-gray-100">
              <div class="bg-gray-100 rounded-2xl p-3">
                <div class="inline-block mr-4 text-tsm"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1">{{$t('services.balance')}}: <span class="text-xs">{{ balance }} XPX</span></div>
              </div>
            </div>
            <div class="mt-5">
              <TextInput placeholder="Enter Name" :disabled="disableNamespaceName" :showError="showNamespaceNameError" v-model="namespaceName" :imgRequired="true" errorMessage="Required field, minlength 2, max length 16. Alphanumeric characters" icon="modules/services/submodule/namespaces/img/icon-namespaces-green-16h-proximax-sirius-wallet.svg" />
            </div>
            <SelectInputPlugin showSelectTitleProp="true" placeholder="Select namespace" :disabled="disableSelectNamespace" ref="namespaceSelect" errorMessage="" v-model="selectNamespace" :options="namespaceOption" selectDefault="1" @show-selection="updateNamespaceSelection" @clear-selection="clearNamespaceSelection" />
            <DurationInput :disabled="disabledDuration" v-if="showDuration" v-model="duration" :max="365" placeholder="Days" title="Duration (number of days)" :imgRequired="true" icon="modules/services/submodule/namespaces/img/icon-namespaces-green-16h-proximax-sirius-wallet.svg" :showError="showDurationErr" errorMessage="Maximum rental duration is 365" class="mt-5" />
            <div class="rounded-2xl bg-gray-100 p-5 mb-5 mt-10">
              <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-2 text-gray-500">{{$t('namespace.transactionfee')}} <span class="text-xs">{{ transactionFee }}</span> XPX</div>
            </div>
            <div class="rounded-2xl bg-gray-100 p-5 mb-5">
              <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-2 text-gray-500">{{$t('services.rentalfee')}}: {{ rentalFee }} {{currencyName}}</div>
            </div>
            <div class="p-4 rounded-xl bg-gray-100 mt-2 items-center w-full text-xs text-gray-800 mb-5" v-if="isMultiSig(selectedAccAdd)">
              <div class="text-center">
                <div class="inline-block">
                  <div class="flex">
                    <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline-block mr-1 self-center">
                    <div class="inline-block self-center text-left ml-2">
                      <div>{{$t('accounts.lockfund')}}: {{ lockFundCurrency }} {{ currencyName }}</div>
                      <div class="mt-1">{{$t('accounts.unconfirmed')}}: {{ lockFundTxFee }} {{ currencyName }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <PasswordInput placeholder="Enter Wallet Password" :errorMessage="'Please enter wallet password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" :disabled="disabledPassword" />
            <div class="mt-10">
              <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50" :disabled="disabledClear" @click="clearInput()">{{$t('siginin.clear')}}</button>
              <button type="button" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate" @click="createNamespace">{{$t('welcome.create')}}</button>
            </div>
          </fieldset>
        </form>
      </div>
      <div class="px-10 text-left text-tsm mt-5 md:mt-0">
        <div class="mb-2">
        {{$t('namespace.namespacemessage2')}}.
        </div>
        <div class="mb-2">
          {{$t('namespace.namespacemessage3')}}.
        </div>
        <div class="mb-2">
          {{$t('namespace.namespacemessage4')}}.
        </div>
        <div class="mb-2 font-bold">
          {{$t('namespace.namespacemessage5')}}.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue';
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import DurationInput from '@/modules/services/submodule/namespaces/components/DurationInput.vue';
import TextInput from '@/components/TextInput.vue';
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { NamespacesUtils } from '@/util/namespacesUtils';

export default {
  name: 'ViewServicesNamespaceCreate',
  components: {
    PasswordInput,
    DurationInput,
    TextInput,
    SelectInputPlugin,
  },
  setup(){
    const namespaceSelect = ref(null);
    const disableNamespaceName = ref(false);
    const disableSelectNamespace = ref(false);
    const namespaceName = ref('');
    const showDuration = ref(true);
    const showDurationErr = ref(false);
    const duration = ref("1");
    const walletPassword = ref('');
    const err = ref('');
    const showMenu = ref(false);
    const currentSelectedName = ref('');
    const disabledPassword = ref(false);
    const disabledDuration = ref(false);
    const disabledClear = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const namespacePattern = "^[0-9a-zA-Z]{2,16}$";
    const showNamespaceNameError = computed(() => !((namespaceName.value.length > 0)?namespaceName.value.match(namespacePattern):true) );
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
      const namespacesList = NamespacesUtils.listNamespaces(selectedAccAdd.value);
      if(namespacesList.length > 0){
        namespace.push.apply(namespace, namespacesList);
      }
      return namespace;
    });

    const currencyName = computed(() => networkState.currentNetworkProfile.network.currency.name);
    const rentalFee = computed(()=> {
      if(duration.value > 0){
        return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock * NamespacesUtils.calculateDuration(duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
      }else{
        return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock, networkState.currentNetworkProfile.network.currency.divisibility);
      }
    });

    const lockFund = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))
    const lockFundCurrency = computed(()=> Helper.amountFormatterSimple(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))

    const lockFundTxFee = ref(0.0445);
    const lockFundTxFeeCurrency = ref('0.044500');
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);

    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && namespaceName.value.match(namespacePattern) && (!showDurationErr.value)
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
    const isMultiSigBool = computed( () => isMultiSig(walletState.currentLoggedInWallet.selectDefaultAccount().address));

    const showNoBalance = ref(false);
    const isNotCosigner = computed(() => getMultiSigCosigner.value.list.length == 0 && isMultiSig(selectedAccAdd.value));

    // validate enough fee to create namespace
    if(balance.value < rentalFee.value){
      if(!isNotCosigner.value){
        showNoBalance.value = true;
      }
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

    const transactionFee = ref('0.000000');
    const transactionFeeExact = ref(0);

    const getMultiSigCosigner = computed(() => {
      return NamespacesUtils.getCosignerList(selectedAccAdd.value);
    });

    const changeSelection = (i) => {
      namespaceSelect.value.clear();
      selectedAccName.value = i.name;
      selectedAccAdd.value = i.address;
      balance.value = i.balance;
      showNoBalance.value = ((balance.value < rentalFee.value) && !isNotCosigner.value)?true:false;
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;
    }

    const updateNamespaceSelection = (namespaceNameSelected) => {
      if(namespaceNameSelected == '1'){
        showDuration.value = true;
        //root
        if(namespaceName.value.length > 0){
          transactionFee.value = Helper.amountFormatterSimple(NamespacesUtils.getRootNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
          transactionFeeExact.value = Helper.convertToExact(NamespacesUtils.getRootNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
        }
      }else{
        duration.value = '0';
        showDuration.value = false;
        //subnamespace
        if(namespaceName.value.length > 0){
          transactionFee.value = Helper.amountFormatterSimple(NamespacesUtils.getSubNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceNameSelected, namespaceName.value), networkState.currentNetworkProfile.network.currency.divisibility);
          transactionFeeExact.value = Helper.convertToExact(NamespacesUtils.getSubNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceNameSelected, namespaceName.value), networkState.currentNetworkProfile.network.currency.divisibility);
        }
      }
    };

    const clearNamespaceSelection = () => {
      duration.value = '0';
      showDuration.value = false;
    };

    const clearInput = () => {
      walletPassword.value = '';
      duration.value = '0';
      namespaceName.value = '';
      namespaceSelect.value.clear();
    };

    const createNamespace = () => {
      if(cosigner.value){
        // for multisig
        if(selectNamespace.value==='1'){
          NamespacesUtils.createRootNamespaceMultisig(cosigner.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, duration.value, selectedAccAdd.value);
        }else{
          NamespacesUtils.createSubNamespaceMultisig(cosigner.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, selectNamespace.value, selectedAccAdd.value);
        }
      }else{
        if(selectNamespace.value==='1'){
          NamespacesUtils.createRootNamespace(selectedAccAdd.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, duration.value);
        }else{
          NamespacesUtils.createSubNamespace(selectedAccAdd.value, walletPassword.value, networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, namespaceName.value, selectNamespace.value);
        }
      }
      clearInput();
    };

    watch(duration, (n) => {
      if(n > 365){
        duration.value = '365';
      }
    });

    watch(namespaceName, (n) => {
      if(namespaceName.value.length > 0){
        if(namespaceName.value.match(namespacePattern)){
          transactionFee.value = Helper.amountFormatterSimple(NamespacesUtils.getRootNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, n, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
          transactionFeeExact.value = Helper.convertToExact(NamespacesUtils.getRootNamespaceTransactionFee(networkState.currentNetworkProfile.network.type, networkState.currentNetworkProfile.generationHash, n, duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
        }else{
          transactionFee.value = '0.000000';
          transactionFeeExact.value = 0;
        }
      }else{
        transactionFee.value = '0.000000';
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
        showNoBalance.value = true;
        disabledPassword.value = true;
        disableSelectNamespace.value = true;
      }else{
        showNoBalance.value = false;
        disabledPassword.value = false;
        disableSelectNamespace.value = false;
      }
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

    return {
      Helper,
      namespaceSelect,
      accounts,
      moreThanOneAccount,
      showMenu,
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
      clearInput,
      showPasswdError,
      changeSelection,
      disableSelectNamespace,
      disabledPassword,
      disabledClear,
      disabledDuration,
      showDuration,
      duration,
      showDurationErr,
      isMultiSig,
      isMultiSigBool,
      rentalFee,
      lockFundTxFee,
      lockFundCurrency,
      currencyName,
      lockFundTxFeeCurrency,
      lockFundTotalFee,
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
