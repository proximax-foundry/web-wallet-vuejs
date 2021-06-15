<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">Assets ></span> <span class="text-blue-primary font-bold">Link to Namespace</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">All Services</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'>
    <div class="md:col-span-3">
      <form @submit.prevent="create">
        <fieldset class="w-full">
          <div class="mb-5">
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
                <div :key="item.address" :i="index" v-for="(item, index) in accounts" class="p-2 cursor-pointer" :class="item.name==selectedAccName?'bg-blue-primary text-white font-bold':'text-gray-800 bg-gray-50 optionDiv'" @click="changeSelection(item)" :title="'Address is ' + item.address">
                  <div>{{ item.name }} <span v-if="isMultiSig(item.address)" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">Multisig</span></div>
                </div>
              </div>
              </transition>
              <input type="hidden" v-model="currentSelectedName">
            </div>
          </div>
          <div class="text-left p-3 pb-0 border-l-8 border-gray-100 mb-5">
            <div class="bg-gray-100 rounded-2xl p-3">
              <div class="inline-block mr-4 text-tsm"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1">Balance: <span class="text-xs">{{ appStore.getBalanceByAddress(selectedAccAdd) }} XPX</span></div>
            </div>
          </div>
          <SelectInputPlugin selectDefault="0" showSelectTitleProp="true" placeholder="Select action" errorMessage="" v-model="selectAction" :options="actions()"  />
          <SelectInputPlugin showSelectTitleProp="true" placeholder="Select namespace" errorMessage="" v-model="selectNamespace" :options="namespaceOption()"  />
          <SelectInputPlugin showSelectTitleProp="true" placeholder="Select asset" errorMessage="" v-model="selectAsset" :options="assetOptions()"  />
          <div class="rounded-2xl bg-gray-100 p-5 mb-5">
            <div class="inline-block mr-4 text-xs"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Transaction Fee: <span class="text-txs"></span> XPX</div>
          </div>
          <PasswordInput placeholder="Enter Wallet Password" :errorMessage="'Please enter wallet password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" :disabled="disabledPassword" />
          <div class="mt-10">
            <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50" :disabled="disabledClear" @click="clearInput()">Clear</button>
            <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate" @click="createMosaic()">Create</button>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
<script>
import { computed, ref, inject, getCurrentInstance } from 'vue';
// import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
// import {  convertToCurrency, convertToExact } from '@/util/transfer.js';

export default {
  name: 'ViewMosaicLinkToNamespace',
  components: {
    PasswordInput,
    SelectInputPlugin,
  },
  setup(){
    const appStore = inject("appStore");
    // const siriusStore = inject("siriusStore");
    const chainNetwork = inject("chainNetwork");
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const walletPassword = ref('');
    const err = ref('');
    const showMenu = ref(false);
    const currentSelectedName = ref('');
    const disabledPassword = ref(false);
    const disabledClear = ref(false);

    const selectAction = ref('');
    const actions = () => {
      let action = [];
      action.push({value: 0, label: 'Link'});
      action.push({value: 1, label: 'Unlink'});
      return action;
    };
    const selectNamespace = ref('');

    const namespaceOption = () => {
      let namespace = [];
      return namespace;
    };

    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);

    const currencyName = computed(() => chainNetwork.getCurrencyName());
    // const rentalFee = computed(()=> convertToExact(chainNetwork.getProfileConfig().mosaicRentalFee, chainNetwork.getCurrencyDivisibility()));
    // const rentalFeeCurrency = computed(()=> convertToCurrency(chainNetwork.getProfileConfig().mosaicRentalFee, chainNetwork.getCurrencyDivisibility()));

    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern)
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
    const balance = ref(appStore.getBalanceByAddress(selectedAccAdd.value));
    const isMultiSigBool = ref(isMultiSig(appStore.getFirstAccAdd()));
    // balance.value = appStore.getFirstAccBalance();

    const showNoBalance = ref(false);
    // if(balance.value < rentalFee.value){
    //   showNoBalance.value = true;
    //   disabledPassword.value = true;
    //   disabledSupply.value = true;
    //   disabledClear.value = true;
    // }else{
    //   disabledPassword.value = false;
    //   disabledSupply.value = false;
    //   disabledClear.value = false;
    // }

    const accounts = computed( () => appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts);
    const moreThanOneAccount = computed(()=> (appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts.length > 1)?true:false);

    const changeSelection = (i) => {
      selectedAccName.value = i.name;
      selectedAccAdd.value = i.address;
      balance.value = i.balance;
      // (balance.value < rentalFee.value)?showNoBalance.value = true:showNoBalance.value = false;
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;
      isMultiSigBool.value = isMultiSig(i.address);
    }

    const assetOptions = () => {
      let asset = [];
      return asset;
    };

    const increaseDecreaseOption = () => {
      let action = [];
      action.push({value: 0, label: 'Decrease'});
      action.push({value: 1, label: 'Increase'});
      return action;
    };

    const selectAsset = ref('');
    const selectIncreaseDecrease = ref(0);

    const clearInput = () => {
      walletPassword.value = '';
      emitter.emit("CLEAR_SELECT", 0);
    };

    // watch(balance, (n) => {
    //   if(n < rentalFee.value){
    //     showNoBalance.value = true;
    //     disabledPassword.value = true;
    //     disabledSupply.value = true;
    //     disabledClear.value = true;
    //   }else{
    //     disabledPassword.value = false;
    //     disabledSupply.value = false;
    //     disabledClear.value = false;
    //   }
    // });

    return {
      appStore,
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
      currencyName,
      isMultiSig,
      isMultiSigBool,
      assetOptions,
      increaseDecreaseOption,
      selectAsset,
      selectIncreaseDecrease,
      actions,
      selectAction,
      namespaceOption,
      selectNamespace,
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

.property-table{
  > div {
    margin-bottom: 7px;
    > div{
      display: inline-block;
    }
    > div:first-child{
      width: 120px;
      margin-right: 15px;
    }
  }
}
</style>
