<template>
    <Dropdown
      v-model="selectedWallet"
      :options="wallets"
      optionLabel="name"
      class="w-full px-2"
    >
      <template #value="{ value }">
        <div class="flex items-center gap-2">
          <img src="@/assets/img/icon-wallet.svg" class="h-5 w-5" />
          <div class="flex flex-col gap-0.5">
            <div
              class="text-blue-primary font-semibold uppercase text-[7px] leading-[9px]"
            >
              {{ $t("general.wallet") }}
            </div>
            <div v-if="value" class="font-bold text-xs" >{{ value.label }}</div>
            <div v-else class="text-xs font-bold">
              {{ $t("home.selectWallet") }}
            </div>
          </div>
        </div>
      </template>
      <template #dropdownicon>
        <div
          v-if="!selectedWallet"
          class="text-xxs ml-auto cursor-pointer text-blue-primary font-semibold"
        >
          {{ $t("general.change") }}
        </div>
        <img
          v-else
          @click="selectedWallet = null"
          src="@/assets/img/delete.svg"
          class="h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"
        />
      </template>

      <template #option="{ option }">
        <div class="flex items-center justify-between">
          <div class="flex gap-2 items-center">
            <img src="@/assets/img/icon-wallet.svg" class="h-5 w-5" />
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
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";

const selectedWallet = defineModel<{ value: string; label: string } | null>();

const wallets = computed(() => {
  return walletState.wallets
    .filterByNetworkName(networkState.chainNetworkName)
    .map(({ name }) => {
      return {
        value: name,
        label: name,
      };
    })
    .sort((a, b) => {
      if (a.label > b.label) return 1;
      if (a.label < b.label) return -1;
      return 0;
    });
});
</script>
