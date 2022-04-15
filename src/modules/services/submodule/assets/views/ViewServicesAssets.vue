<template>
  <div>
    <div class='ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div v-if="assets.length > 0">
        <AssetDataTable class="mt-10 w-full" :key="walletState" :address="address"></AssetDataTable>
        <router-link :to="{ name : 'ViewServicesAssetsCreate'}" class="mt-10 lg:mt-0 bg-blue-primary px-5 py-3 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-44"><img src="@/assets/img/icon-plus.svg" class="inline-block mr-2">{{$t('asset.createNewAsset')}}</router-link>
      </div>
      <div v-else class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <div class="flex justify-between text-sm mb-5">
          <div><span class="text-gray-700">{{$t('general.asset',2)}}</span></div>
        </div>
        <div class="border border-gray-200 filter drop-shadow-xl py-2 sm:py-14 px-2 sm:px-28 text-center bg-white">
          <img src="@/modules/services/submodule/assets/img/asset_default.svg" class="inline-block h-18 w-18">
          <div class="text-gray-700 text-sm my-5">{{$t('asset.noAsset')}}</div>
          <div class="text-gray-600 text-tsm my-5">{{$t('asset.assetDescription')}}</div>
          <router-link :to="{ name : 'ViewServicesAssetsCreate'}" class="bg-blue-primary py-2 px-7 rounded-lg text-white font-bold mt-4 inline-block">{{$t('asset.createAssets',2)}}</router-link>
        </div>
        <div class="sm:grid sm:grid-cols-2 mt-10 lg:mt-16">
          <div class="mb-8">
            <a href="https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/" target=_new class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm flex items-start">{{$t('general.assetQues')}}</a>
            <div class="text-gray-400 text-xs lg:text-tsm my-3 sm:pr-2">{{$t('asset.assetAns')}}</div>
          </div>
          <div class="mb-8">
            <a href="https://t.me/proximaxhelpdesk" target=_new class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex">{{$t('general.feedback')}}</a>
            <div class="text-gray-400 text-tsm my-3">{{$t('general.feedbackDescription')}}</div>
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
