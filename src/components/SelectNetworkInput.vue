<template>
  <div
    @click="toggleSelection = !toggleSelection"
    class="border w-8/12 ml-auto mr-auto py-3 px-2 cursor-pointer"
  >
    <div class="flex">
      <img
        v-if="selectedNetwork.label == 'Sirius Mainnet'"
        src="@/assets/img/icon-mainnet-block.svg"
        class="h-5 w-5 mt-auto mb-auto"
      />
      <img
        v-else
        src="@/assets/img/icon-testnet-block.svg"
        class="h-5 w-5 mt-auto mb-auto"
      />
      <div class="flex flex-col ml-2 text-left">
        <div
          class="text-blue-primary font-semibold uppercase"
          style="font-size: 7px; line-height: 9px"
        >
          {{ $t("general.network") }}
        </div>
        <div class="text-xs font-bold">{{ selectedNetwork.label }}</div>
      </div>
      <div
        v-if="!toggleSelection"
        class="text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"
      >
        {{ $t("general.change") }}
      </div>
      <img
        v-if="toggleSelection"
        src="@/assets/img/delete.svg"
        class="h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"
      />
    </div>
  </div>
  <div class="relative" style="left: 16.7%">
    <div
      v-if="toggleSelection"
      class="absolute border border-t-0 w-8/12 z-50 bg-white"
    >
      <div
        class="my-3 pl-2 font-semibold uppercase"
        style="font-size: 7px; line-height: 9px"
      >
        {{ $t("general.selectNetwork") }}
      </div>
      <div
        v-for="(items, index) in chainNetworks"
        :key="index"
        class="px-2 py-1"
      >
        <div @click="selectNetwork(index)" class="flex cursor-pointer">
          <img
            v-if="items.label == 'Sirius Mainnet'"
            src="@/assets/img/icon-mainnet-block.svg"
            class="h-5 w-5 mt-auto mb-auto"
          />
          <img
            v-else
            src="@/assets/img/icon-testnet-block.svg"
            class="h-5 w-5 mt-auto mb-auto"
          />
          <div class="text-xs ml-1 mt-0.5 font-bold">{{ items.label }}</div>
          <div
            v-if="items.label != selectedNetwork.label"
            class="cursor-pointer text-blue-primary font-semibold text-xxs mt-0.5 ml-auto uppercase"
          >
            {{ $t("general.select") }}
          </div>
          <div
            v-if="items.label == selectedNetwork.label"
            class="text-gray-500 text-xxs mt-0.5 ml-auto uppercase"
          >
            {{ $t("general.current") }}
          </div>
        </div>
        <div
          v-if="index != chainNetworks.length - 1"
          class="gray-line mt-2"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { networkState } from "@/state/networkState";
import { NetworkStateUtils } from "@/state/utils/networkStateUtils";
import { computed, ref, getCurrentInstance } from "vue";

defineEmits(["switchNetwork"]);

const toggleSelection = ref(false);
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;

const selectedNetwork = computed(() => {
  return {
    label: networkState.chainNetworkName,
    value: networkState.chainNetwork,
  };
});
const chainNetworks = computed(() => {
  let options: { label: String; value: number }[] = [];
  networkState.availableNetworks.forEach((network, index) => {
    options.push({ label: network, value: index });
  });
  return options;
});

const selectNetwork = (e: number) => {
  emitter.emit("switchNetwork");
  NetworkStateUtils.changeNetworkByIndex(e);
  toggleSelection.value = !toggleSelection.value;
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/multiselect.scss";
</style>
