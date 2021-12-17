<template>
  <div>
    <div class='ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div v-if="assets.length > 0">
        <AssetDataTable class="mt-10 w-full" :key="walletState" :address="address"></AssetDataTable>
        <router-link :to="{ name : 'ViewServicesAssetsCreate'}" class="mt-10 lg:mt-0 bg-blue-primary px-5 py-3 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-44"><img src="@/assets/img/icon-plus.svg" class="inline-block mr-2"> Create New Asset</router-link>
      </div>
      <div v-else class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <div class="flex justify-between text-sm">
          <div><span class="text-gray-700">{{$t('services.assets')}}</span></div>
        </div>
        <div class="border border-gray-200 filter drop-shadow-xl py-2 sm:py-14 px-2 sm:px-28 text-center bg-white">
          <img src="@/modules/services/submodule/assets/img/asset_default.svg" class="inline-block h-18 w-18">
          <div class="text-gray-700 text-sm my-5">Looks like you don’t have any assets yet.</div>
          <div class="text-gray-600 text-tsm my-5">An asset could be a token, but it could also be a collection of more specialized assets such as reward points, shares of stock, signatures, status flags, votes or even other currencies.</div>
          <router-link :to="{ name : 'ViewServicesAssetsCreate'}" class="bg-blue-primary py-2 px-7 rounded-lg text-white font-bold mt-4 inline-block">Create assets</router-link>
        </div>
        <div class="grid grid-cols-3 mt-16">
          <div>
            <a href="https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/" target=_new class="text-blue-primary font-bold inline-block text-tsm">What is asset?</a>
            <div class="text-gray-400 text-tsm my-3 sm:pr-2">Mosaics are part of what makes the Smart Asset System unique and flexible. They are fixed assets on the Sirius Chain that can represent a set of multiple identical things that do not change.</div>
          </div>
          <div>
            <router-link :to="{ name : 'ViewServicesAssetsCreate'}" class="text-blue-primary font-bold inline-block text-tsm">The complete guide about Digital Asset</router-link>
            <div class="text-gray-400 text-tsm my-3">What is asset?</div>
          </div>
          <div>
            <router-link :to="{ name : 'ViewServicesAssetsCreate'}" class="text-blue-primary font-bold inline-block text-tsm">Give us feedback about your experience here</router-link>
            <div class="text-gray-400 text-tsm my-3">Give us feedback about your experience here</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch, getCurrentInstance } from 'vue';
// import { useRouter } from "vue-router";
import { ChainProfileConfig } from "@/models/stores/";
import { walletState } from "@/state/walletState";
import { Wallet } from "@/models/wallet";
import { networkState } from "@/state/networkState";
import { Currency } from "@/models/currency";
import { Helper } from '@/util/typeHelper';
import { ChainUtils } from '@/util/chainUtils';
import { AssetsUtils } from '@/util/assetsUtils';
import { WalletUtils } from '@/util/walletUtils';
import AssetDataTable from '@/modules/services/submodule/assets/components/AssetDataTable.vue';

export default {
  name: 'ViewServicesAssets',
  components: {
    AssetDataTable
  },
  props: {
    address: String,
  },

  setup(){
    const defaultIndex = ref(0);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    // get assets
    const assets = ref([]);
    walletState.currentLoggedInWallet.accounts.forEach(account => {
      account.assets.forEach(asset => {
        assets.value.push(asset);
      });
    });

    walletState.currentLoggedInWallet.others.forEach(account => {
      account.assets.forEach(asset => {
        assets.value.push(asset);
      });
    });

    emitter.on("TXN_CONFIRMED", txLength => {
      setTimeout(() => {
        ++defaultIndex.value;
      }, 1000);
    });

    return {
      assets,
      defaultIndex,
      walletState
    }
  },

}
</script>
<style scoped lang="scss">

</style>
