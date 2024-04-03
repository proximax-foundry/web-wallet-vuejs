<template>
   
      <div
        class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md"
      >
        <router-link
          :to="{ name: 'Home' }"
          class="text-xs m-2 text-blue-link items-center flex"
          ><img
            src="@/assets/img/chevron_left.svg"
            class="w-5 inline-block"
          />{{ $t("general.back") }}</router-link
        >
        <div class="text-sm text-center mt-20 mb-6 font-semibold">
          {{ $t("wallet.createWallet") }}
        </div>
        <div class="border flex flex-col w-8/12 mx-auto">
          <button @click="currentValue = 0"
            class="flex justify-between px-3 py-2 border-b-[1px] cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <img
                src="@/modules/wallet/img/icon-add-new.svg"
                class="h-6 w-6"
              />
              <div class="text-xs">{{ $t("wallet.newWallet") }}</div>
            </div>

            <font-awesome-icon
              v-if="currentValue == 0"
              class="px-1.5 py-1 text-gray-200 bg-blue-primary rounded-full text-sm"
              icon="check"
            ></font-awesome-icon>
          </button>
          <button @click="currentValue = 1"
            class="flex justify-between px-3 py-2 border-b-[1px] "
          >
            <div class="flex items-center gap-3">
              <img
                src="@/modules/wallet/img/icon-private-key.svg"
                class="h-6 w-6"
              />
              <div class="text-xs">{{ $t("general.fromPrivateKey") }}</div>
            </div>

            <font-awesome-icon
              v-if="currentValue == 1"
              class="px-1.5 py-1 text-gray-200 bg-blue-primary rounded-full text-sm"
              icon="check"
            ></font-awesome-icon>
          </button>
          <button class="flex justify-between px-3 py-2" @click="currentValue = 2">
            <div class="flex items-center gap-3">
              <img
                src="@/modules/wallet/img/icon-wallet-import.svg"
                class="h-6 w-6 inline-block mr-1"
              />
              <div class="text-xs">{{ $t("wallet.fromBackUp") }}</div>
            </div>

            <font-awesome-icon
              v-if="currentValue == 2"
              class="px-1.5 py-1 text-gray-200 bg-blue-primary rounded-full text-sm"
              icon="check"
            ></font-awesome-icon>
          </button>
        </div>

        <router-link
          :to="{ name: currentValue == 0?  'ViewWalletCreate': currentValue == 1? 'ViewWalletCreatePrivateKey':'ViewWalletImport' }"
          class="mt-3 font-bold text-center blue-btn py-2 px-10 block ml-auto mr-auto w-8/12"
          >{{ $t("general.next") }}</router-link
        >
     
        <div class="h-28"></div>
      </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const currentValue = ref(0);
</script>
