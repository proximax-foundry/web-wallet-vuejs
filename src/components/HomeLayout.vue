<template>
  <div class="flex flex-col justify-between min-h-screen bg-navy-primary">
    <HeaderComponent />
    <div class="container py-14 mb-auto mx-auto lg:px-20 gap-4  md:my-auto md:py-0">
      <div v-if="route.path!='/wallets'" class="md:grid md:grid-cols-2 lg:px-20 xl:px-40 gap-4 mt-8 md:mt-0">
        <IntroTextComponent />
        <slot />
      </div>
      <slot v-else/>
    </div>

    <div class="w-full items-center px-2">
      <footer
        class="mx-auto text-center flex text-txs lg:text-xs justify-between container text-black-primary pb-5 items-center"
      >
        <div class="ml-2 sm:ml-0 text-white">
          {{ $t("home.copyright", { date: lastActiveYear }) }}
          <a
            href="https://t.me/proximaxhelpdesk"
            target="_new"
            class="text-blue-primary hover:underline"
            >{{ $t("home.helpdesk") }}</a
          >
        </div>
        <div class="mr-2 sm:mr-0 py-2 sm:py-0 text-white">
          <span> {{ $t("home.version") }} {{ version }}</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from "@/components/HeaderComponent.vue";
import packageData from "../../package.json";
import IntroTextComponent from "@/components/IntroTextComponent.vue";
import { useRoute } from "vue-router";

const version = packageData.version;
const lastActiveYear = BUILD_YEAR;
const route = useRoute();
</script>
