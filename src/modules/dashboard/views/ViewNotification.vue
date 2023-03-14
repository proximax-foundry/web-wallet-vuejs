<template>
  <div>
    <div class='ml-2 mr-2 w-full lg:ml-auto lg:mr-auto mt-5'>
      <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <div class="flex justify-between text-sm mb-5">
          <div><span class="text-gray-700">{{ $t('general.notification', 2) }}</span></div>
        </div>
        <div v-if="notifications != null && notifications.length > 0">
          <div v-for="notification, index in notifications" :key="index">
            <div v-if="notification.type == 'Partial'">
              <router-link :to="{ name: 'ViewAccountPendingTransactions', params: { address: notification.address } }"
                @click="updateDefaultAccount(notification.address)"
                class="flex items-center border border-gray-100 w-full p-5 mb-3 text-tsm hover:bg-blue-50 transition-all duration-300">
                <div v-html="toSvg(notification.address, 40, themeStyleConfig)" class="mr-2"></div>
                <div class="text-gray-600 text-xs">
                  <div class="mb-1 text-sm text-gray-700 font-bold">{{
                    walletState.currentLoggedInWallet ? walletState.currentLoggedInWallet.convertAddressToNamePretty(notification.address,
                      true) : '' }}</div>
                  {{ notification.label }}
                  {{ $t('notification.pendingSignature', { time: relativeTime(notification.timestamp) }) }}
                </div>
              </router-link>
            </div>
            <div v-if="notification.type == 'Namespace'">
              <router-link
                :to="{ name: 'ViewServicesNamespaceExtend', params: { address: Helper.createAddress(notification.address).pretty(), namespaceId: notification.id } }"
                class="flex items-center border border-gray-100 w-full p-5 mb-3 text-tsm hover:bg-blue-50 transition-all duration-300">
                <div v-html="toSvg(notification.address, 40, themeStyleConfig)" class="mr-2"></div>
                <div class="text-gray-600 text-xs">
                  <div class="mb-1 text-sm text-gray-700 font-bold">{{
                    walletState.currentLoggedInWallet?.convertAddressToNamePretty(notification.address, true) }}</div>
                  {{ $t('general.namespace') }} <b>{{ notification.label }}</b> <span
                    v-if="currentTimestamp() > notification.timestamp">has expired</span><span
                    v-else>{{ $t('notification.isExpiring', { time: relativeTime(notification.timestamp) }) }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div v-else class="text-xs text-gray-500">
          {{ $t('notification.noNotification') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, getCurrentInstance } from 'vue';
import { walletState } from "@/state/walletState";
import { Helper } from '@/util/typeHelper';
import { AppState } from '@/state/appState';
import { NotificationUtils, type Notification } from '@/util/notificationUtils';
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { toSvg } from "jdenticon";
import { useI18n } from 'vue-i18n';

const {t} = useI18n()

const relativeTime = (timestamp :number) => {
  let current = new Date();
  let expired = new Date(timestamp);
  let timeDiff = {
    years: expired.getFullYear() - current.getFullYear(),
    months: expired.getMonth() - current.getMonth(),
    days: expired.getDate() - current.getDate(),
    hours: expired.getHours() - current.getHours(),
    mins: expired.getMinutes() - current.getMinutes(),
  }

  if (timeDiff.mins < 0) {
    timeDiff.hours--;
    timeDiff.mins += 60;
  }
  if (timeDiff.hours < 0) {
    timeDiff.days--;
    timeDiff.hours += 24;
  }
  if (timeDiff.days < 0) {
    timeDiff.months--;
    // days = days left in current's month,
    //   plus days that have passed in expiry's month
    const copyCurrent = new Date(current.getTime());
    copyCurrent.setDate(32);
    timeDiff.days = 32 - current.getDate() - copyCurrent.getDate() + expired.getDate();
  }
  if (timeDiff.months < 0) {
    timeDiff.years--;
    timeDiff.months += 12;
  }
  if (timeDiff.years > 0) {
    return timeDiff.years + ' ' + t('general.year', timeDiff.years.toString());
  } else if (timeDiff.months > 0) {
    return timeDiff.months + ' ' + t('general.month', timeDiff.months.toString());
  } else if (timeDiff.days > 0) {
    return timeDiff.days + ' ' + t('general.day', timeDiff.days.toString());
  } else if (timeDiff.hours > 0) {
    return timeDiff.hours + ' ' + t('general.hour', timeDiff.hours.toString());
  } else {
    return timeDiff.mins + ' ' + t('general.minute', timeDiff.mins.toString());
  }
}
const notifications = ref<Notification[]>([]);
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;

let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
themeConfig.init();
const themeStyleConfig = ref(themeConfig.jdenticonConfig);

const iniNotification = () => {
  if (!AppState.isReady) {
    setTimeout(iniNotification, 100);
    return;
  }
  notifications.value = NotificationUtils.getNotificationFromStorage();
  NotificationUtils.saveVisitedNotification();
  emitter.emit("VIEW_NOTIFICATION");
}

const updateDefaultAccount = (address :string) => {
  if (!walletState.currentLoggedInWallet) {
    return
  }
  walletState.currentLoggedInWallet.setDefaultAccountByAddress(address);
  emitter.emit("DEFAULT_ACCOUNT_SWITCHED")
}

const currentTimestamp = () => {
  let current = new Date();
  return current.getTime();
}

const init = async () => {
  iniNotification();
}

if (AppState.isReady) {
  init();
}
else {
  let readyWatcher = watch(AppState, (value) => {
    if (value.isReady) {
      init();
      readyWatcher();
    }
  });
}


</script>
<style scoped lang="scss"></style>
