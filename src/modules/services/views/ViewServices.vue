<template>
  <div class=" mt-10 px-5 pt-5">
    <div class="w-11/12 mx-auto mt-3 py-3">
      <div>Services</div>
      <div class='border mt-6  filter shadow-lg'>
        <div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5   p-3 gap-2'>
          <router-link :to="{ name: 'ViewServicesAssetsCreate' }" class='mx-auto'>
            <img src="@/assets/img/navi/icon-asset.svg" 
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18">
            <div class='text-center text-xs font-semibold'>Assets</div>
          </router-link>
          <router-link :to="{ name: 'ViewServicesNamespaceCreate' }" class='mx-auto '>
            <img src="@/assets/img/navi/icon-namespace.svg"
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18">
            <div class='text-center text-xs font-semibold'>Namespace</div>
          </router-link>
          <router-link  v-if="nodeEnv != 'production'" :to="{ name: 'ViewServicesPortfolio' }" class='mx-auto '>
            <img src="@/modules/services/submodule/portfolio/img/icon-portfolio.svg"
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18">
            <div class='text-center text-xs font-semibold'>Portfolio</div>
          </router-link>
          <router-link :to="{ name: 'ViewServicesAirdropToken' }" class='mx-auto '>
            <img src="@/assets/img/navi/icon-airdrop.svg"
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18">
            <div class='text-center text-xs font-semibold'>Airdrop Token Utility</div>
          </router-link>
          <div class="mx-auto" v-if="networkState.currentNetworkProfileConfig?.supportedEntities.find(entity=>entity.type==TransactionType.PLACE_SDA_EXCHANGE_OFFER)" @click="toggle">
            <img src="@/assets/img/navi/icon-exchange.svg"
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18">
            <div class='text-center text-xs font-semibold'>SDA Exchange</div>
          </div>
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
          <router-link :to="{ name: 'ViewHarvesterTxn' }" class='mx-auto '>
            <img src="@/modules/services/submodule/portfolio/img/icon-portfolio.svg"
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18">
            <div class='text-center text-xs font-semibold'>Harvester Transaction</div>
          </router-link>
          <router-link :to="{ name: 'ViewWallets' }" class='mx-auto '>
           <!--  <img src="@/assets/img/icon-wallet.svg"
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18"> -->
              <font-awesome-icon icon="fa-solid fa-wallet" class="ml-auto mr-auto mt-4 mb-3 h-20 w-20"/>
            <div class='text-center text-xs font-semibold'>Wallets</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from 'primevue/menu';
import { useRouter } from 'vue-router'
import { ref} from "vue";
import { networkState } from "@/state/networkState";
import { TransactionType } from 'tsjs-xpx-chain-sdk';

const nodeEnv =  import.meta.env.VITE_NODE_ENV
const menu = ref();
const toggle = (event :Event) => {
  menu.value.toggle(event);
};
const router = useRouter()

const items = ref([
  {
    label: 'Create SDA Exchange',
    command: () => {
      router.push('/exchange/create')
    }
  },
  {
    label: 'View SDA Listing',
    command: () => {
      router.push('/exchange/listing')
    }
  }
]);


</script>

