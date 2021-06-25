<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">Namespaces ></span> <span class="text-blue-primary font-bold">Extend</span></div>
    <div>
      <!-- <router-link :to="{ name: 'ViewServices' }" class="font-bold">Back to Services</router-link> -->
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center md:grid md:grid-cols-5'>
    <div class="md:col-span-3">
      <form @submit.prevent="createNamespace">
        <fieldset class="w-full">
          <div class="mb-5">
            <div v-if="showNoBalance" class="border-2 rounded-3xl border-red-700 w-full h-24 text-center p-4">
              <div class="h-5 text-center">
                <div class="rounded-full w-8 h-8 border border-gray-500 inline-block relative"><font-awesome-icon icon="times" class="text-gray-500 h-5 w-5 absolute" style="top: 5px; left:8px"></font-awesome-icon></div><br>
                <div class="inline-block text-tsm">Insufficient Balance</div>
              </div>
            </div>
            <div class="error error_box" v-if="err!=''">{{ err }}</div>
            <div v-if="moreThanOneAccount" class="text-left p-4">
              <div class="mb-1 cursor-pointer z-20 border-b border-gray-200" @click="showMenu = !showMenu">
                <div class="font-bold text-xs">{{ selectedAccName }} <span v-if="isMultiSigBool" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">Multisig</span></div>
                <div class="text-gray-400 mt-1 text-sm ">{{ selectedAccAdd }}</div>
              </div>
              <transition name="slide">
              <div v-if="showMenu" class="z-10">
                <div :key="item.address" :i="index" v-for="(item, index) in accounts" class="p-2 cursor-pointer" :class="item.name==selectedAccName?'bg-blue-primary text-white font-bold':'text-gray-800 bg-gray-50 optionDiv'" @click="changeSelection(item)" :title="'Address is ' + item.address">
                  <div>{{ item.name }} <span v-if="isMultiSig(item.address)" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">Multisig</span></div>
                </div>
              </div>
              </transition>
              <input type="hidden" v-model="currentSelectedName">
            </div>
            <div v-else class="text-left mb-2">
              <div class="mb-1 z-20 border-b border-gray-200">
                <div class="font-bold text-xs">{{ selectedAccName }} <span v-if="isMultiSigBool" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">Multisig</span></div>
                <div class="text-gray-400 mt-1 text-sm ">{{ selectedAccAdd }}</div>
              </div>
            </div>
          </div>
          <div class="text-left p-3 pb-0 border-l-8 border-gray-100 mb-5">
            <div class="bg-gray-100 rounded-2xl p-3">
              <div class="inline-block mr-4 text-tsm"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1">Balance: <span class="text-xs">{{ balance }} XPX</span></div>
            </div>
          </div>
          <SelectInputPlugin showSelectTitleProp="true" placeholder="Select namespace" errorMessage="" v-model="selectNamespace" :options="namespaceOption()"  />
          <DurationInput :disabled="disabledDuration" v-model="duration" :max="365" placeholder="Days" title="Duration (number of days)" :imgRequired="true" icon="modules/services/submodule/namespaces/img/icon-namespaces-green-16h-proximax-sirius-wallet.svg" :showError="showDurationErr" errorMessage="Maximum rental duration is 365" class="mt-5" />
          <div class="rounded-2xl bg-gray-100 p-5 mb-5">
            <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Transaction Fee: 0.<span class="text-xs">062750</span> XPX</div>
          </div>
          <div class="rounded-2xl bg-gray-100 p-5 mb-5">
            <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Rental Fee: {{ rentalFee }} {{currencyName}}</div>
          </div>
          <div class="p-4 rounded-xl bg-gray-100 mt-2 items-center w-full text-xs text-gray-800 mb-5" v-if="isMultiSig(selectedAccAdd)">
            <div class="text-center">
              <div class="inline-block">
                <div class="flex">
                  <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline-block mr-1 self-center">
                  <div class="inline-block self-center text-left">
                    <div>LockFund: {{ lockFundCurrency }} {{ currencyName }}</div>
                    <div>Unconfirmed/Recommended Fee: {{ lockFundTxFee }} {{ currencyName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PasswordInput placeholder="Enter Wallet Password" :errorMessage="'Please enter wallet password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" :disabled="disabledPassword" />
          <div class="mt-10">
            <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50" :disabled="disabledClear" @click="clearInput()">Clear</button>
            <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate" @click="createNamespace()">Create</button>
          </div>
        </fieldset>
      </form>
    </div>
    <div class="px-10 text-left text-tsm mt-5 md:mt-0 md:col-span-2">
      <div class="flex justify-around">
      <div class="text-center">
        <img src="@/modules/services/submodule/namespaces/img/icon-namespace-mosaic-duration-01.svg" class="w-24 mb-2">
        <div class="italic">Start block: <br></div>
      </div>
      <div class="text-center">
        <img src="@/modules/services/submodule/namespaces/img/icon-namespace-mosaic-duration-02.svg" class="w-24 mb-2">
        <div class="italic">Start block: <br></div>
      </div>
      <div class="text-center">
        <img src="@/modules/services/submodule/namespaces/img/icon-namespace-mosaic-duration-03.svg" class="w-24 mb-2">
        <div class="italic">Start block: <br></div>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, getCurrentInstance, watch } from 'vue';
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import DurationInput from '@/modules/services/submodule/namespaces/components/DurationInput.vue';
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { NamespacesUtils } from '@/util/namespacesUtils';

export default {
  name: 'ViewServicesNamespaceCreate',
  components: {
    PasswordInput,
    DurationInput,
    SelectInputPlugin,
  },
  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const showDurationErr = ref(false);
    const duration = ref("0");
    const walletPassword = ref('');
    const err = ref('');
    const showMenu = ref(false);
    const currentSelectedName = ref('');
    const disabledPassword = ref(false);
    const disabledDuration = ref(false);
    const disabledClear = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const selectNamespace = ref('');

    const namespaceOption = () => {
      let namespace = [];
      // namespace.push({
      //   value: '1',
      //   label: 'New Root Namespace',
      // })//disabled: true
      return namespace;
    };

    const currencyName = computed(() => networkState.currentNetworkProfile.network.currency.name);
    const rentalFee = computed(()=> {
      if(duration.value > 0){
        return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock * NamespacesUtils.calculateDuration(duration.value), networkState.currentNetworkProfile.network.currency.divisibility);
      }else{
        return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock, networkState.currentNetworkProfile.network.currency.divisibility);
      }
    });

    const lockFund = computed(()=> Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))
    const lockFundCurrency = computed(()=> Helper.convertToCurrency(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, networkState.currentNetworkProfile.network.currency.divisibility))

    const lockFundTxFee = ref(0.0445);
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);

    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && (!showDurationErr.value)
    ));

    const isMultiSig = (address) => {
      const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address);
      let isMulti = false;
      if(account.multisigInfo != undefined){
        if(account.multisigInfo[0].cosignaturies.length > 0){
          isMulti = true;
        }
      }
      return isMulti;
    };

    const selectedAccName = ref(walletState.currentLoggedInWallet.selectDefaultAccount().name);
    const selectedAccAdd = ref(walletState.currentLoggedInWallet.selectDefaultAccount().address);
    const balance = ref(Helper.toCurrencyFormat(walletState.currentLoggedInWallet.selectDefaultAccount().balance, networkState.currentNetworkProfile.network.currency.divisibility));
    const isMultiSigBool = ref(isMultiSig(walletState.currentLoggedInWallet.selectDefaultAccount().address));

    const showNoBalance = ref(false);
    if(balance.value < rentalFee.value){
      showNoBalance.value = true;
      disabledPassword.value = true;
      disabledClear.value = true;
      disabledDuration.value = true;
    }else{
      disabledPassword.value = false;
      disabledClear.value = false;
      disabledDuration.value = false;
    }

    const accounts = computed( () => walletState.currentLoggedInWallet.accounts);
    const moreThanOneAccount = computed(()=> (walletState.currentLoggedInWallet.accounts.length > 1)?true:false);
    const transactionFee = ref('0.000000');

    const changeSelection = (i) => {
      selectedAccName.value = i.name;
      selectedAccAdd.value = i.address;
      isMultiSigBool.value = isMultiSig(i.address);
      balance.value = i.balance;
      (balance.value < rentalFee.value)?showNoBalance.value = true:showNoBalance.value = false;
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;
    }

    const clearInput = () => {
      walletPassword.value = '';
      duration.value = '0';
      emitter.emit("CLEAR_SELECT", 0);
    };

    watch(balance, (n) => {
      if(n < rentalFee.value){
        showNoBalance.value = true;
        disabledPassword.value = true;
        disabledClear.value = true;
        disabledDuration.value = true;
      }else{
        disabledPassword.value = false;
        disabledClear.value = false;
        disabledDuration.value = false;
      }
    });

    watch(duration, (n) => {
      if(n > 365){
        duration.value = '365';
      }
      if(balance.value < rentalFee.value){
        showNoBalance.value = true;
        disabledPassword.value = true;
      }else{
        showNoBalance.value =false;
        disabledPassword.value = false;
      }
    });

    const createNamespace = () => {
      console.log('Create namespace');
    };

    return {
      accounts,
      moreThanOneAccount,
      showMenu,
      currentSelectedName,
      selectedAccName,
      selectedAccAdd,
      balance,
      showNoBalance,
      err,
      walletPassword,
      disableCreate,
      clearInput,
      showPasswdError,
      changeSelection,
      disabledPassword,
      disabledClear,
      disabledDuration,
      duration,
      showDurationErr,
      isMultiSig,
      isMultiSigBool,
      rentalFee,
      lockFundCurrency,
      currencyName,
      lockFundTxFee,
      lockFundTotalFee,
      selectNamespace, 
      namespaceOption,
      createNamespace,
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
