<template>
  <Dropdown
    v-model="selectedNetwork"
    :options="networkOptions"
    @change="onChange"
    optionLabel="name"
    class="w-full px-2"
  >
    <template #value="{ value }">
      <div class="flex items-center gap-2">
        <img v-if='value.label== "Sirius Mainnet"' src="@/assets/img/icon-mainnet-block.svg" class='h-5 w-5 mt-auto mb-auto'>
        <img v-else src="@/assets/img/icon-testnet-block.svg" class='h-5 w-5 mt-auto mb-auto'>
        <div class="flex flex-col gap-0.5">
          <div
            class="text-blue-primary font-semibold uppercase text-[7px] leading-[9px]"
          >
          {{$t('general.network')}}
          </div>
          <div v-if="value" class="font-bold text-xs">{{ value.label }}</div>
          <div v-else class="text-xs font-bold">
            {{ $t("home.selectWallet") }}
          </div>
        </div>
      </div>
    </template>
    <template #dropdownicon>
      <div
        class="text-xxs ml-auto cursor-pointer text-blue-primary font-semibold"
      >
        {{ $t("general.change") }}
      </div>
    
    </template>

    <template #option="{ option }">
      <div class="flex items-center justify-between">
        <div class="flex gap-2 items-center">
          <img v-if='option.label== "Sirius Mainnet"' src="@/assets/img/icon-mainnet-block.svg" class='h-5 w-5 mt-auto mb-auto'>
        <img v-else src="@/assets/img/icon-testnet-block.svg" class='h-5 w-5 mt-auto mb-auto'>
          <div class="font-bold text-xs">{{ option.label }}</div>
        </div>
        <div
          class="cursor-pointer text-blue-primary text-xxs font-semibold uppercase"
        >
          {{ $t("general.select") }}
        </div>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { networkState } from "@/state/networkState";
import { DropdownChangeEvent } from "primevue/dropdown";
import { NetworkStateUtils } from "@/state/utils/networkStateUtils";

const onChange = (e: DropdownChangeEvent) =>{
    NetworkStateUtils.changeNetworkByIndex(e.value.value)

}
const selectedNetwork = computed(()=>{ return {label: networkState.chainNetworkName, value: networkState.chainNetwork }});
const networkOptions = computed(() => {
  return networkState.availableNetworks.map((network, index) => {
    return { label: network, value: index };
  });
});
</script>
