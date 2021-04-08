<template>
  <div class="md:grid md:grid-cols-2 mb-8">
    <div class="w-full text-center md:text-left mx-5">
      <div class="font-bold">{{ primaryAccountName }} <span class="text-xs italic text-blue-700">Current default</span></div>
      <div class="text-xs my-2">
        <div class="relative inline-block">
          <div class="absolute z-20 w-96 h-full"></div>
          <input
            id="address"
            class="text-xs outline-none z-10 w-96"
            type="text"
            :value="primaryAccount"
          />
        </div>
        <font-awesome-icon icon="copy" @click="copy('address')" class="w-5 h-5 text-gray-500 cursor-pointer inline mx-2"></font-awesome-icon><img src="../assets/img/icon-qr-code.svg" class="w-5 inline">
      </div>
      <div class="text-center md:text-left">
        <div class="inline-block mr-4"><img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1"><span class="text-xs">{{ primaryAccountBalance }} XPX</span></div>
        <div class="inline-block"><img src="../assets/img/icon-usd-blue.svg" class="w-5 inline mr-1"><span class="text-sm">USD 204.451</span></div>
      </div>
    </div>
    <div class="w-full lg:w-6/12 mt-5 md:mt-0">
      <div class="text-md text-center md:text-left">Transactions: <span>1</span></div>
      <div class="text-center md:text-left">
        <div class="mt-2">
          <div class="rounded-full bg-blue-primary text-white w-24 h-15 px-2 py-1 mr-3 inline-block">
            <div class="flex justify-between">
              <div class="rounded-full text-white border pt-1 pl-1 w-6 h-6"><font-awesome-icon icon="check" class="w-4 h-3"></font-awesome-icon></div>
              <div class="text-xs font-bold flex items-center">1</div>
            </div>
          </div>
          <div class="rounded-full bg-blue-300 text-white w-24 h-15 px-2 py-1 mr-3 inline-block">
            <div class="flex justify-between">
              <div class="rounded-full text-white border pt-1 pl-1 w-6 h-6"><font-awesome-icon icon="exclamation" class="w-4 h-3"></font-awesome-icon></div>
              <div class="text-xs font-bold flex items-center">1</div>
            </div>
          </div>
          <div class="rounded-full bg-yellow-500 text-white w-24 h-15 px-2 py-1 inline-block">
            <div class="flex justify-between">
              <img src="../assets/img/icon-transaction-partial-white.svg" class="w-6 h-6" />
              <div class="text-xs font-bold flex items-center">1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <DashboardDataTable></DashboardDataTable>
  </div>

</template>

<script>
import { computed, inject} from 'vue';
import DashboardDataTable from '@/components/DashboardDataTable.vue'
import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';
import { copyKeyFunc } from '../util/functions.js';

export default {
  name: 'ViewDashboard',
  components: {
    FontAwesomeIcon,
    DashboardDataTable
  },

  setup(){
    const appStore = inject("appStore");
    const copy = (id) => copyKeyFunc(id);
    const primaryAccount = computed(
      () => {
          if (appStore.state.currentLoggedInWallet) {
            return appStore.pretty(appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).address);
          }else{
            return 0;
          }
      }
    );

    const primaryAccountBalance = computed(
      () => {
          if (appStore.state.currentLoggedInWallet) {
            return appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).balance;
          }else{
            return 0;
          }
      }
    );

    const primaryAccountName = computed(
      () => {
          if (appStore.state.currentLoggedInWallet) {
            return appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).name;
          }else{
            return 0;
          }
      }
    );

    return {
      copy,
      primaryAccount,
      primaryAccountBalance,
      primaryAccountName,
    };
  }
}
</script>