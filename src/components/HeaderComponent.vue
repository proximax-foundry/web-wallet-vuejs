<template>
  <header class="fixed w-full" v-if="!walletState.isLogin">
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
      <img src="@/assets/img/sirius-logo-blacktext.svg" class=" h-6 " />
    </router-link>
    <font-awesome-icon icon="fa-solid fa-bell" class="" />
  </header>
</template>

<script setup lang="ts">
import SelectLanguageVue from "@/modules/home/components/selectLanguageModal.vue";
import { walletState } from "@/state/walletState";
import { useSidebar } from "@/composables/useSidebar";

const { isOpen } = useSidebar();
</script>
