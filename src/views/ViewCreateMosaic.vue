<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">Mosaics ></span> <span class="text-blue-primary font-bold">Create</span></div>
    <div>
      <!-- <router-link :to="{ name: 'ViewAllServices' }" class="font-bold">Back to Services</router-link> -->
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
                <div class="font-bold text-xs">{{ selectedAccName }}</div>
                <div class="text-gray-400 mt-1 text-sm ">{{ selectedAccAdd }}</div>
              </div>
              <transition name="slide">
              <div v-if="showMenu" class="z-10">
                <div :key="item.address" :i="index" v-for="(item, index) in accounts" class="p-2 cursor-pointer" :class="item.name==selectedAccName?'bg-blue-primary text-white font-bold':'text-gray-800 bg-gray-50 optionDiv'" @click="changeSelection(item)" :title="'Address is ' + item.address">
                  <div>{{ item.name }}</div>
                </div>
              </div>
              </transition>
              <input type="hidden" v-model="currentSelectedName">
            </div>
          </div>
          <div class="text-left p-3 pb-0 border-l-8 border-gray-100">
            <div class="bg-gray-100 rounded-2xl p-3">
              <div class="inline-block mr-4 text-tsm"><img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1">Balance: <span class="text-xs">{{ appStore.getFirstAccBalance(selectedAccAdd) }} XPX</span></div>
            </div>
          </div>
          <NumberInput :disabled="disabledDivisibility" v-model="divisibility" max="6" placeholder="Divisibility" title="Divisibility" type="text" icon="coins" :showError="showDivisibilityErr" errorMessage="Required Field - Only Numbers (0 - 6)" class="mt-5" />
          <SupplyInput :disabled="disabledSupply" v-model="supply" title="Supply" :balance="Number(appStore.getFirstAccBalance(selectedAccAdd))" placeholder="Supply" type="text" icon="coins" :showError="showSupplyErr" :errorMessage="(!supply)?'Required Field':'Insufficient balance'" :decimal="Number(supplyPrecision)" />
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
            <div class="inline-block mr-4 text-xs"><img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Unconfirmed/Recommended Fee: 0.<span class="text-txs">062750</span> XPX</div>
          </div>
          <div class="rounded-2xl bg-gray-100 p-5 mb-5">
            <div class="inline-block mr-4 text-xs"><img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Rental Fee: {{ rentalFee }} XPX<span class="text-txs">000000</span> XPX</div>
          </div>
          <PasswordInput placeholder="Enter Your Wallet Password" :errorMessage="'Please enter your wallet password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" :disabled="disabledPassword" />
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
    <NotificationModal :toggleModal="toggleAnounceNotification" msg="Unconfirmed transaction" notiType="noti" time='2500' />
  </div>
</template>
<script>
import { computed, ref, inject, getCurrentInstance, watch } from 'vue';
// import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import SupplyInput from '@/components/SupplyInput.vue';
import NumberInput from '@/components/NumberInput.vue';
import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';
import { mosaicTransaction, convertToCurrency } from '../util/transfer.js';
import NotificationModal from '@/components/NotificationModal.vue';

export default {
  name: 'ViewCreateMosaic',
  components: {
    PasswordInput,
    SupplyInput,
    FontAwesomeIcon,
    NumberInput,
    NotificationModal,
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
    const toggleAnounceNotification = ref(false);
    const supplyPrecision = ref(divisibility.value);
    const disabledDuration = ref(false);
    const durationOption =ref('month');
    const duration = ref('1');
    const showDurationErr = ref(false);

    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const durationCheckDisabled = ref(false);

    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && !disabledMutableCheck.value && (divisibility.value != '') && (supply.value > 0) && (!showDurationErr.value)
    ));

    const selectedAccName = ref(appStore.getFirstAccName());
    const selectedAccAdd = ref(appStore.getFirstAccAdd());
    const balance = ref(appStore.getFirstAccBalance(selectedAccAdd.value));
    // balance.value = appStore.getFirstAccBalance();

    const showNoBalance = ref(false);
    if(balance.value < 10000){
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
      balance.value = i.balance;
      (balance.value < 10000)?showNoBalance.value = true:showNoBalance.value = false;
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;
    }

    const clearInput = () => {
      walletPassword.value = '';
      divisibility.value = '0';
      supply.value = '0';
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
      if(n < 10000){
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
        toggleAnounceNotification.value = true;
        var audio = new Audio(require('@/assets/audio/ding.ogg'));
        audio.play();
        clearInput();
      }
    };

    const rentalFee = computed(()=> convertToCurrency(chainNetwork.getProfileConfig().mosaicRentalFee, chainNetwork.getCurrencyDivisibility()));

    emitter.on("CLOSE_NOTIFICATION", payload => {
      toggleAnounceNotification.value = payload;
    });

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
      toggleAnounceNotification,
      disabledDuration,
      durationOption,
      duration,
      showDurationErr,
      durationCheckDisabled,
      rentalFee,
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
