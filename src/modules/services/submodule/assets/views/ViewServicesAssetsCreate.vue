<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">Assets ></span> <span class="text-blue-primary font-bold">Create</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">All Services</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center md:grid md:grid-cols-4'>
    <div class="md:col-span-3">
      <form @submit.prevent="create">
        <fieldset class="w-full">
          <div class="mb-5 border-b border-gray-200">
            <div v-if="showNoBalance" class="border-2 rounded-3xl border-red-700 w-full h-24 text-center p-4">
              <div class="h-5 text-center">
                <div class="rounded-full w-8 h-8 border border-gray-500 inline-block relative"><font-awesome-icon icon="times" class="text-gray-500 h-5 w-5 absolute" style="top: 5px; left:4px"></font-awesome-icon></div><br>
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
                <div :key="item.address" :i="index" v-for="(item, index) in accounts" class="p-2 cursor-pointer" :class="item.name==selectedAccName?'bg-blue-primary text-white font-bold':'text-gray-800 bg-gray-50 optionDiv'" @click="changeSelection(item)" :title="'Address is ' + item.address" @update-divisibility="updateDivisibility">
                  <div>{{ item.name }} <span v-if="isMultiSig(item.address)" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">Multisig</span></div>
                </div>
              </div>
              </transition>
              <input type="hidden" v-model="currentSelectedName">
            </div>
          </div>
          <div class="text-left p-3 pb-0 border-l-8 border-gray-100">
            <div class="bg-gray-100 rounded-2xl p-3">
              <div class="inline-block mr-4 text-tsm"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1">Balance: <span class="text-xs">{{ appStore.getBalanceByAddress(selectedAccAdd) }} XPX</span></div>
            </div>
          </div>
          <NumberInput :disabled="disabledDivisibility" v-model="divisibility" :max="6" placeholder="Divisibility" title="Divisibility" icon="coins" :showError="showDivisibilityErr" errorMessage="Required Field - Only Numbers (0 - 6)" class="mt-5" />
          <SupplyInput :disabled="disabledSupply" v-model="supply" title="Supply" :balance="Number(appStore.getBalanceByAddress(selectedAccAdd))" placeholder="Supply" type="text" icon="coins" :showError="showSupplyErr" :errorMessage="(!supply)?'Required Field':'Insufficient balance'" :decimal="Number(supplyPrecision)" />
          <!-- <div class="text-center p-3 pb-3 border-l-8 border-gray-100">
            <div class="rounded-2xl bg-gray-100 p-5">
              <input id="month" type="radio" value="month" name="durationOption" v-model="durationOption" :disabled="disabledDuration" /><label for="month" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">Month</label>
              <input id="year" type="radio" value="year" name="durationOption" v-model="durationOption" :disabled="disabledDuration" /><label for="year"  class="cursor-pointer font-bold ml-4 mr-5 text-tsm">Year</label>
            </div>
            <NumberInput :disabled="disabledDuration" v-model="duration" :max="(durationOption=='year')?'10':'120'" placeholder="Duration" title="Duration" type="text" icon="coins" :showError="showDurationErr" :errorMessage="(durationOption=='year')?'Max is 10 years':'Max is 120 months'" class="mt-5" />
            <input id="disabledDuration" type="checkbox" v-model="disabledDuration" value="true" :disabled="durationCheckDisabled"><label for="disabledDuration"  class="cursor-pointer font-bold ml-4 mr-5 text-tsm">No duration</label>
          </div> -->
          <div class="mb-5 border-t pt-4 border-gray-200">
            <div class="rounded-2xl bg-gray-100 p-5">
              <input id="transferable" type="checkbox" value="transferable" v-model="isTransferable" :disabled="disabledTransferableCheck" /><label for="transferable" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">Transferable</label>
              <input id="mutable" type="checkbox" value="mutable" v-model="isMutable" :disabled="disabledMutableCheck" /><label for="mutable"  class="cursor-pointer font-bold ml-4 mr-5 text-tsm">Supply Mutable</label>
            </div>
          </div>
          <div class="rounded-2xl bg-gray-100 p-5 mb-5">
            <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Transaction Fee: 0.<span class="text-txs">062750</span> XPX</div>
          </div>
          <div class="rounded-2xl bg-gray-100 p-5 mb-5">
            <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Rental Fee: {{ rentalFeeCurrency }} {{currencyName}}</div>
          </div>
          <div class="p-4 rounded-xl bg-gray-100 mt-2 items-center w-full text-xs text-gray-800" v-if="isMultiSig(selectedAccAdd)">
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
            <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate" @click="createMosaic()">Create</button>
          </div>
        </fieldset>
      </form>
    </div>
    <div class="px-10 text-left text-tsm mt-5 md:mt-0">
      <div class="mb-2">
        <i>Maximum divisibility is 6.</i><br>
        <b>Example: 0.000000</b>
      </div>
      <div class="mb-2">
        <i>Maximum supply is 900T.</i><br>
        <b>Example: 900,000,000,000,000</b>
      </div>
      <div class="mb-2">
        <div class="mb-3"><i>If you tick "Transferable", mosaic can be transferred.</i></div>
        <div><i>If you tick "Supply Mutable", supply can be changed.</i></div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, inject, getCurrentInstance, watch } from 'vue';
// import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import SupplyInput from '@/components/SupplyInput.vue';
import NumberInput from '@/modules/services/submodule/assets/components/NumberInput.vue';
import { mosaicTransaction, convertToCurrency, convertToExact } from '@/util/transfer.js';

export default {
  name: 'ViewMosaicCreate',
  components: {
    PasswordInput,
    SupplyInput,
    NumberInput,
  },
  setup(){
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const chainNetwork = inject("chainNetwork");
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const showSupplyErr = ref(false);
    const recipient = ref('');
    const msgOption = ref('regular');
    const messageText = ref('');
    const walletPassword = ref('');
    const err = ref('');
    const showMenu = ref(false);
    const currentSelectedName = ref('');
    const divisibility = ref("0");
    const showDivisibilityErr = ref(false);
    const isTransferable = ref('');
    const isMutable = ref('');
    const disabledMutableCheck = ref(false);
    const disabledTransferableCheck = ref(false);
    const disabledPassword = ref(false);
    const disabledSupply = ref(false);
    const disabledDivisibility = ref(false);
    const disabledClear = ref(false);
    const supplyPrecision = ref(divisibility.value);
    const disabledDuration = ref(false);
    const durationOption =ref('month');
    const duration = ref('1');
    const showDurationErr = ref(false);

    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const durationCheckDisabled = ref(false);

    const currencyName = computed(() => chainNetwork.getCurrencyName());
    const rentalFee = computed(()=> convertToExact(chainNetwork.getProfileConfig().mosaicRentalFee, chainNetwork.getCurrencyDivisibility()));
    const rentalFeeCurrency = computed(()=> convertToCurrency(chainNetwork.getProfileConfig().mosaicRentalFee, chainNetwork.getCurrencyDivisibility()));

    const lockFund = computed(()=> convertToExact(chainNetwork.getProfileConfig().lockedFundsPerAggregate, chainNetwork.getCurrencyDivisibility()))
    const lockFundCurrency = computed(()=> convertToCurrency(chainNetwork.getProfileConfig().lockedFundsPerAggregate, chainNetwork.getCurrencyDivisibility()))

    const lockFundTxFee = ref(0.0445);
    const lockFundTotalFee = computed(()=> lockFund.value + lockFundTxFee.value);


    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && !disabledMutableCheck.value && (divisibility.value != '') && (supply.value > 0) && (!showDurationErr.value)
    ));

    const isMultiSig = (address) => {
      const account = appStore.getAccDetailsByAddress(address);
      let isMulti = false;
      if(account.isMultisign != undefined){
        if(account.isMultisign != '' || account.isMultisign != null){
          if(account.isMultisign.cosignatories != undefined){
            if(account.isMultisign.cosignatories.length > 0){
              isMulti = true;
            }
          }
        }
      }
      return isMulti;
    };

    const selectedAccName = ref(appStore.getFirstAccName());
    const selectedAccAdd = ref(appStore.getFirstAccAdd());
    const balance = computed( () => {
      return appStore.getBalanceByAddress(selectedAccAdd.value)
    });

    const isMultiSigBool = ref(isMultiSig(appStore.getFirstAccAdd()));
    // balance.value = appStore.getFirstAccBalance();

    const showNoBalance = ref(false);
    if(balance.value < rentalFee.value){
      showNoBalance.value = true;
      disabledMutableCheck.value = true;
      disabledTransferableCheck.value = true;
      disabledPassword.value = true;
      disabledSupply.value = true;
      disabledDivisibility.value = true;
      disabledClear.value = true;
      disabledDuration.value = true;
      durationCheckDisabled.value = true;
    }else{
      disabledMutableCheck.value = false;
      disabledTransferableCheck.value = false;
      disabledPassword.value = false;
      disabledSupply.value = false;
      disabledDivisibility.value = false;
      disabledClear.value = false;
      disabledDuration.value = false;
      durationCheckDisabled.value = false;
    }

    const supply = ref(0);
    const accounts = computed( () => appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts);
    const sendXPX = ref(0);
    const moreThanOneAccount = computed(()=> (appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts.length > 1)?true:false);

    const changeSelection = (i) => {
      selectedAccName.value = i.name;
      selectedAccAdd.value = i.address;
      isMultiSigBool.value = isMultiSig(i.address);
      // balance.value = i.balance;
      (balance.value < rentalFee.value)?showNoBalance.value = true:showNoBalance.value = false;
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;
    }

    const clearInput = () => {
      walletPassword.value = '';
      divisibility.value = 0;
      supply.value = 0;
      duration.value = '1';
      durationOption.value = 'month';
      disabledDuration.value = '';
      isTransferable.value = '';
      isMutable.value = '';
      emitter.emit("CLEAR_SELECT", 0);
    };

    watch(currentSelectedName, (n, o) => {
      if(n!=o){
        recipient.value = '';
      }
    });

    watch(divisibility, (n) => {
      supplyPrecision.value = parseInt(n);
    });

    watch(balance, (n) => {
      if(n < rentalFee.value){
        showNoBalance.value = true;
        disabledMutableCheck.value = true;
        disabledTransferableCheck.value = true;
        disabledPassword.value = true;
        disabledSupply.value = true;
        disabledDivisibility.value = true;
        disabledClear.value = true;
        disabledDuration.value = true;
        durationCheckDisabled.value = true;
      }else{
        disabledMutableCheck.value = false;
        disabledTransferableCheck.value = false;
        disabledPassword.value = false;
        disabledSupply.value = false;
        disabledDivisibility.value = false;
        disabledClear.value = false;
        disabledDuration.value = false;
        durationCheckDisabled.value = false;
      }
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

    const createMosaic = () => {
      let createStatus = mosaicTransaction(divisibility.value, supply.value, duration.value, durationOption.value, isMutable.value, isTransferable.value, walletPassword.value, selectedAccName.value, appStore, siriusStore);
      if(!createStatus){
        err.value = 'Invalid wallet password';
      }else{
        // transaction made
        err.value = '';
        clearInput();
      }
    };

    const updateDivisibility = (e) => {
      console.log('e' + e)
      divisibility.value = e;
    }

    return {
      appStore,
      accounts,
      moreThanOneAccount,
      showMenu,
      currentSelectedName,
      selectedAccName,
      selectedAccAdd,
      isTransferable,
      isMutable,
      balance,
      showNoBalance,
      showSupplyErr,
      showDivisibilityErr,
      err,
      recipient,
      sendXPX,
      messageText,
      msgOption,
      walletPassword,
      disableCreate,
      clearInput,
      showPasswdError,
      changeSelection,
      supply,
      divisibility,
      disabledMutableCheck,
      disabledTransferableCheck,
      disabledPassword,
      disabledSupply,
      disabledDivisibility,
      disabledClear,
      supplyPrecision,
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
      updateDivisibility,
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
