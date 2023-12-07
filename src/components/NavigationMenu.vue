<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      class="fixed z-20 inset-0 transition-opacity bg-black opacity-50 lg:hidden"
      @click="isOpen = false;"
    />
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-64 flex flex-col justify-between overflow-y-auto transition duration-300 transform bg-navy-primary rounded-r-xl lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="w-full">
        <div class="flex justify-center" @click="isOpen=false">
          <router-link :to="{ name: 'ViewDashboard' }">
            <img
              src="@/assets/img/sirius-logo-whitetext.svg"
              class="w-auto h-36 mt-[-40px]"
            />
          </router-link>
        </div>
        <!-- <div class="text-white text-xs ml-6 font-semibold">CREATE NEW</div> -->

          <router-link
          @click="isOpen=false"
            class="flex items-center px-12  py-2 mt-4"
            :class="[
              $route.name === 'transfer'
                ? 'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100'
                : 'border-gray-900 text-white hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
            ]"
            to="/transfer"
          >
            <font-awesome-icon icon="fa-solid fa-share" />

            <span class="mx-4">Transfer</span>
          </router-link>

          <router-link
          @click="isOpen=false"
            class="flex items-center px-12  py-2 mt-4"
            :class="[
              $route.name === 'swap'
                ? 'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100'
                : 'border-gray-900 text-white hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
            ]"
            to="/swap"
          >
          <font-awesome-icon icon="fa-solid fa-right-left" />

            <span class="mx-4">Swap</span>
          </router-link>

          <router-link
          @click="isOpen=false"
            class="flex items-center px-12  py-2 mt-4"
            :class="[
              $route.name === 'services'
                ? 'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100'
                : 'border-gray-900 text-white hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
            ]"
            to="/services"
          >
          <font-awesome-icon icon="fa-solid fa-toolbox" />

            <span class="mx-4">Services</span>
          </router-link>
          <router-link
          @click="isOpen=false"
          :class="[
              $route.name === 'view-all-accounts'
                ? 'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100'
                : 'border-gray-900 text-white hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
            ]"
            class="flex items-center px-12  py-2 mt-4"
            to="/view-all-accounts"
          >
            <font-awesome-icon class="text-white" icon="fa-solid fa-user-group" />
            <span class="text-white mx-4">Accounts</span>
          </router-link>

          <router-link
          @click="isOpen=false"
            class="flex items-center px-12  py-2 mt-4"
            to="/address-book"
            :class="[
              $route.name === 'address-book'
                ? 'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100'
                : 'border-gray-900 text-white hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
            ]"
          >
            <font-awesome-icon class="text-white" icon="fa-solid fa-address-book " />

            <span class="mx-4 text-white">Address Book</span>
          </router-link>

          <router-link
          @click="isOpen=false"
            class="flex items-center px-12  py-2 mt-4"
            :class="[
              $route.name === 'settings'
                ? 'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100'
                : 'border-gray-900 text-white hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
            ]"
            to="/settings"
          >
            <font-awesome-icon icon="fa-solid fa-gear" />
            <span class="mx-4">Settings</span>
          </router-link>
      </div>

      <div class="text-white px-8 pb-4">
        <font-awesome-icon
          icon="fa-solid fa-arrow-right-from-bracket"
          class="text-red-500"
        />
        <button @click="signOut()" class="mx-4">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from "@/composables/useSidebar";
import router from "@/router";
import { walletState } from "@/state/walletState";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const { isOpen } = useSidebar();

const signOut = () => {
  walletState.isLogin = false;
  router.push({ name: "Home" });
  isOpen.value = false;
};
</script>
