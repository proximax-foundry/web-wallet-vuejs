<template>
  <header class=" w-full" v-if="!walletState.isLogin">
    <div
      class="container mx-auto px-8 flex bg-gold-100 items-center justify-between h-12 pt-8"
    >
      <img src="@/assets/img/sirius-logo-whitetext.svg" class="w-32 h-32" />
      <div class="flex">
        <div class="w-20">
          <router-link
            :to="{ name: 'Home' }"
            class="hover:font-bold text-white"
            >{{ $t("home.home") }}</router-link
          >
        </div>
        <div class="w-20">
          <router-link
            :to="{ name: 'ViewWallets' }"
            class="hover:font-bold text-white"
            >{{ $t("general.wallet", 2) }}</router-link
          >
        </div>
        <SelectLanguageVue />
      </div>
    </div>
  </header>

  <header
    v-else
    class="flex items-center justify-between px-6 py-4 bg-white drop-shadow-xl filter"
  >
    <div class="hidden lg:flex">
      Wallet {{ walletState.currentLoggedInWallet!.name }}
    </div>
    <font-awesome-icon
      class="lg:hidden cursor-pointer"
      icon="fa-solid fa-bars"
      @click="isOpen = true"
    />

    <router-link :to="{ name: 'ViewDashboard' }" class="lg:hidden">
      <img src="@/assets/img/sirius-logo-blacktext.svg" class="h-6" />
    </router-link>

    <div class="flex items-center gap-2">
      <div
        class="hidden lg:flex w-16 flex-row items-center left-gray-line relative"
      >
        <div
          class="text-center w-full h-7 cursor-pointer"
          @mouseover="setHoverSupportToTrue"
          @mouseout="setHoverSupportToFalse"
        >
          <img
            src="@/assets/img/icon-support-contact.svg"
            class="opacity-80 hover:opacity-100 inline-block h-4 w-4 lg:h-5 lg:w-5"
          />
        </div>
        <div
          class="absolute z-20 w-96 text-left bg-gray-50 shadow-sm rounded-md right-0 p-2 text-tsm transition duration-200 block"
          style="top: 60px"
          v-if="isShowSupport"
          @mouseover="
            isShowSupport = true;
            isHoverSupportPanel = true;
          "
          @mouseout="hideSupportPanel"
        >
          <div class="font-bold p-2 text-txs uppercase">
            {{ $t("home.beginnerGuide") }}
          </div>
          <div class="grid grid-cols-2">
            <div>
              <div class="p-2">
                <a
                  class="mb-2 block text-blue-primary"
                  href="https://bcdocs.xpxsirius.io/"
                  target="_new"
                  >{{ $t("home.gettingStarted")
                  }}<img
                    src="@/assets/img/icon-open_in_new.svg"
                    class="inline-block -top-1 ml-1.5"
                /></a>
                <div class="text-txs h-10">{{ $t("home.allInfo") }}</div>
              </div>
              <div class="p-2">
                <a
                  class="mb-2 block text-blue-primary"
                  href="https://bcdocs.xpxsirius.io/docs/getting-started/what-is-proximax-sirius-chain/"
                  target="_new"
                  >{{ $t("home.siriusChain")
                  }}<img
                    src="@/assets/img/icon-open_in_new.svg"
                    class="inline-block -top-1 ml-1.5"
                /></a>
                <div class="text-txs h-10">
                  {{ $t("home.siriusChainTitle") }}
                </div>
              </div>
            </div>
            <div>
              <div class="p-2">
                <a
                  class="mb-2 block text-blue-primary"
                  href="https://bcdocs.xpxsirius.io/docs/built-in-features/namespace/"
                  target="_new"
                  >{{ $t("general.namespaceQues")
                  }}<img
                    src="@/assets/img/icon-open_in_new.svg"
                    class="inline-block -top-1 ml-1.5"
                /></a>
                <div class="text-txs h-10">{{ $t("home.namespaceAns") }}</div>
              </div>
              <div class="p-2">
                <a
                  class="mb-2 block text-blue-primary"
                  href="https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/"
                  target="_new"
                  >{{ $t("general.assetQues")
                  }}<img
                    src="@/assets/img/icon-open_in_new.svg"
                    class="inline-block -top-1 ml-1.5"
                /></a>
                <div class="text-txs h-10">{{ $t("home.assetAns") }}</div>
              </div>
            </div>
          </div>
          <div class="w-full p-2 pt-3 border-t border-gray-100">
            <a
              href="https://t.me/proximaxhelpdesk"
              target="_new"
              class="text-xs text-blue-primary"
              >{{ $t("home.contactTeam") }}</a
            >
          </div>
        </div>
      </div>

      <router-link :to="{ name: 'ViewNotification' }" class="text-center h-7">
        <div
          class="flex h-5 w-5 items-center justify-center absolute z-10"
          v-if="isNewNotification"
        >
          <div
            class="animate-ping absolute inline-flex rounded-full bg-orange-primary opacity-75 h-4 w-4"
          ></div>
          <div
            class="relative inline-flex rounded-full h-3 w-3 bg-orange-primary"
          ></div>
        </div>
        <div class="flex items-center justify-center absolute" v-else>
          <div
            v-if="newNotificationCount > 0"
            class="relative inline-flex rounded-full z-20 h-4 w-4 z-10 bg-orange-primary text-xxs text-white items-center justify-center"
          >
            {{ newNotificationCount }}
          </div>
        </div>

        <div class="mt-2 h-3 w-3 lg:mt-1 lg:h-5 lg:w-5">
          <img
            src="@/assets/img/icon-bell.svg"
            class="opacity-80 hover:opacity-100"
          />
        </div>
      </router-link>

      <div class="hidden pl-3 text-center lg:flex items-center left-gray-line">
        <img
          src="@/assets/img/icon-testnet-block.svg"
          class="w-3 lg:w-7 hidden lg:inline-block"
          :title="AppState.nodeFullURL"
        />
        <div class="text-txs text-white text-left lg:ml-2">
          <div class="text-xxs lg:text-tsm text-navy-primary">
            {{ networkState.chainNetworkName }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import SelectLanguageVue from "@/modules/home/components/selectLanguageModal.vue";
import { walletState } from "@/state/walletState";
import { useSidebar } from "@/composables/useSidebar";
import { AppState } from "@/state/appState";
import { networkState } from "@/state/networkState";
import { ref, watch } from "vue";
import { NotificationUtils } from "@/util/notificationUtils";

const { isOpen } = useSidebar();

const notificationLoading = ref(false);
const notificationTimeout = ref<NodeJS.Timeout>();
const isNewNotification = ref(false);
const newNotificationCount = ref(0);

const isHoverSupport = ref(false);
const isShowSupport = ref(false);
const isHoverSupportPanel = ref(false);
const setHoverSupportToTrue = () => {
  isHoverSupport.value = true;
  isShowSupport.value = true;
};
const setHoverSupportToFalse = () => {
  isHoverSupport.value = false;
  setTimeout(() => {
    if (!isHoverSupportPanel.value && !isHoverSupport.value) {
      isShowSupport.value = false;
    }
  }, 100);
};
const hideSupportPanel = () => {
  isHoverSupportPanel.value = false;
  setTimeout(() => {
    if (!isHoverSupport.value && !isHoverSupportPanel.value) {
      isShowSupport.value = false;
    }
  }, 100);
};

const doGetNotification = async () => {
  if (!notificationLoading.value) {
    if (notificationTimeout.value) {
      try {
        clearTimeout(notificationTimeout.value);
      } catch (error) {}
    }
    notificationLoading.value = true;
    newNotificationCount.value = (
      await NotificationUtils.getNotification()
    ).length;
    isNewNotification.value = NotificationUtils.highlightNewNotification();
    notificationLoading.value = false;
    notificationTimeout.value = setTimeout(doGetNotification, 90000); // 1.5 minutes- 90 seconds
  }
};

watch(
  [() => walletState.isLogin, () => AppState.isReady],
  async ([loginState, readyState], o) => {
    if (!loginState && !(o[0] ?? false)) {
      return;
    }

    if (loginState && readyState) {
      doGetNotification();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.notification_counter {
  right: 8px;
  top: -58x;
}

@media (min-width: 1024px) {
  .notification_counter {
    right: 15px;
    top: -2px;
  }
}
</style>
