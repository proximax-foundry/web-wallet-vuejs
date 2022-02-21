<template>
  <div>
    <div class='ml-2 mr-2 w-full lg:ml-auto lg:mr-auto mt-5'>
      <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <div class="flex justify-between text-sm mb-5">
          <div><span class="text-gray-700">{{$t('general.notification',2)}}</span></div>
        </div>
        <div v-if="notifications.length > 0">
          <div v-for="notification, index in notifications" :key="index">
            <div v-if="notification.type=='Partial'">
              <router-link :to="{ name : 'ViewTransactionStatus', params: {transactionType: 'partial' } }" @click="updateDefaultAccount(notification.address)" class="flex items-center border border-gray-100 w-full p-5 mb-3 text-tsm hover:bg-blue-50 transition-all duration-300">
                <div v-html="toSvg(notification.address, 40, themeStyleConfig)" class="mr-2"></div>
                <div class="text-gray-600 text-xs">
                  <div class="mb-1 text-sm text-gray-700 font-bold">{{ walletState.currentLoggedInWallet.convertAddressToNamePretty(notification.address, true) }}</div>
                  {{ notification.label }} {{$t('notification.pendingSignature',{time:NotificationUtils.relativeTime(notification.timestamp)})}}
                </div>
              </router-link>
            </div>
            <div v-if="notification.type=='Namespace'">
              <router-link :to="{ name: 'ViewServicesNamespaceExtend', params: { address: Helper.createAddress(notification.address).pretty(), namespaceId: notification.id }}" class="flex items-center border border-gray-100 w-full p-5 mb-3 text-tsm hover:bg-blue-50 transition-all duration-300">
                <div v-html="toSvg(notification.address, 40, themeStyleConfig)" class="mr-2"></div>
                <div class="text-gray-600 text-xs">
                  <div class="mb-1 text-sm text-gray-700 font-bold">{{ walletState.currentLoggedInWallet.convertAddressToNamePretty(notification.address, true) }}</div>
                  Namespace <b>{{ notification.label }}</b> {{$t('notification.isExpiring',{time:NotificationUtils.relativeTime(notification.timestamp)})}} 
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div v-else class="text-xs text-gray-500">
          {{$t('notification.noNotification')}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch, getCurrentInstance } from 'vue';
// import { useRouter } from "vue-router";
import { ChainProfileConfig } from "@/models/stores/";
import { walletState } from "@/state/walletState";
import { Wallet } from "@/models/wallet";
import { networkState } from "@/state/networkState";
import { Currency } from "@/models/currency";
import { Helper } from '@/util/typeHelper';
import { ChainUtils } from '@/util/chainUtils';
import { AppState } from '@/state/appState';
import { NotificationUtils } from '@/util/notificationUtils';
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { toSvg } from "jdenticon";

export default {
  name: 'ViewNotification',

  setup(){
    const notifications = ref([]);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();
    const themeStyleConfig = ref(themeConfig.jdenticonConfig);

    const iniNotification = () => {
      if(!AppState.isReady){
        setTimeout(iniNotification, 100);
        return ;
      }
      notifications.value = NotificationUtils.getNotificationFromStorage();
      NotificationUtils.saveVisitedNotification();
      emitter.emit("VIEW_NOTIFICATION");
    }

    const updateDefaultAccount = (address) => {
      walletState.currentLoggedInWallet.setDefaultAccountByAddress(address);
      const name = walletState.currentLoggedInWallet.accounts.find(account => account.address == address);
      if(!name){
        name = walletState.currentLoggedInWallet.others.find(account => account.address == address);
      }
      emitter.emit("DEFAULT_ACCOUNT_SWITCHED", name);
    }

    const init = async() =>{
      iniNotification();
    }

    if(AppState.isReady){
      init();
    }
    else{
      let readyWatcher = watch(AppState.isReady, (value) => {
        if(value){
          init();
          readyWatcher();
        }
      });
    }

    return {
      notifications,
      NotificationUtils,
      updateDefaultAccount,
      Helper,
      themeStyleConfig,
      toSvg,
      walletState,
    }
  },

}
</script>
<style scoped lang="scss">

</style>
