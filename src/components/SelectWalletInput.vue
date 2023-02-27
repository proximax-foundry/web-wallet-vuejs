<template>
  <div
    @click="toggleSelection = !toggleSelection"
    class="border w-8/12 ml-auto mr-auto py-3 px-2 cursor-pointer"
  >
    <div class="flex">
      <img src="@/assets/img/icon-wallet.svg" class="h-5 w-5 mt-auto mb-auto" />
      <div class="flex flex-col ml-2 text-left">
        <div
          class="text-blue-primary font-semibold uppercase"
          style="font-size: 7px; line-height: 9px"
        >
          {{ $t("general.wallet") }}
        </div>
        <div v-if="selectedWallet != ''" class="text-xs font-bold">
          {{ selectedWallet }}
        </div>
        <div v-if="selectedWallet == ''" class="text-xs font-bold">
          {{ $t("home.selectWallet") }}
        </div>
      </div>
      <div
        v-if="!toggleSelection && selectedWallet == ''"
        class="text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"
      >
        {{ $t("general.select") }}
      </div>
      <div
        v-if="!toggleSelection && selectedWallet != ''"
        class="text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"
      >
        {{ $t("general.change") }}
      </div>
      <img
        v-if="toggleSelection"
        @click="selectedWallet = ''"
        src="@/assets/img/delete.svg"
        class="h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"
      />
    </div>
  </div>
  <div class="relative" style="left: 16.7%">
    <div
      v-if="toggleSelection"
      class="absolute border border-t-0 w-8/12 z-50 bg-white max-h-32 overflow-auto"
    >
      <div
        v-if="wallets.length > 0"
        class="pt-2 pl-2 pb-2 font-semibold uppercase"
        style="font-size: 7px; line-height: 9px"
      >
        {{ $t("home.selectWallet") }}
      </div>
      <div v-else class="text-xxs pt-2 pl-2 pb-2">
        {{ $t("general.listEmpty") }}
      </div>
      <div v-for="(items, index) in wallets" :key="index" class="px-2 py-1">
        <div @click="selectWallet(items.label)" class="flex cursor-pointer">
          <img
            src="@/assets/img/icon-wallet.svg"
            class="h-5 w-5 mt-auto mb-auto"
          />
          <div class="text-xs ml-1 mt-0.5 font-bold">{{ items.label }}</div>
          <div
            v-if="items.label != selectedWallet"
            class="cursor-pointer text-blue-primary text-xxs mt-0.5 ml-auto font-semibold uppercase"
          >
            {{ $t("general.select") }}
          </div>
          <div
            v-if="items.label == selectedWallet"
            class="text-gray-500 text-xxs mt-0.5 ml-auto uppercase"
          >
            {{ $t("general.current") }}
          </div>
        </div>
        <div v-if="index != wallets.length - 1" class="gray-line mt-2"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { computed, ref, watch, getCurrentInstance } from "vue";

defineEmits(["select-wallet"]);
const toggleSelection = ref(false);
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const selectedWallet = ref("");
const selectWallet = (wallet: string) => {
  selectedWallet.value = wallet;
  toggleSelection.value = !toggleSelection.value;
};
const wallets = computed(() => {
  var wallets: { value: string; label: string }[] = [];
  walletState.wallets
    .filterByNetworkName(networkState.chainNetworkName)
    .forEach((wallet) => {
      wallets.push({
        value: wallet.name,
        label: wallet.name,
      });
    });
  wallets.sort((a, b) => {
    if (a.label > b.label) return 1;
    if (a.label < b.label) return -1;
    return 0;
  });
  return wallets;
});
const updateWalletValue = () => {
  emitter.emit("select-wallet", selectedWallet.value);
};
watch(selectedWallet, () => {
  updateWalletValue();
});

emitter.on("switchNetwork", () => {
  selectedWallet.value = "";
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/multiselect.scss";
</style>
