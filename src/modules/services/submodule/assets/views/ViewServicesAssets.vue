<template>
  <div>
    <div class='w-9/12 ml-auto mr-auto mt-5'>
      <div v-if="assets.length > 0">
        <div class="flex justify-between text-sm">
          <div><span class="text-gray-700">{{$t('services.assets')}}</span></div>
        </div>
        <AssetDataTable class="mt-10"></AssetDataTable>
      </div>
      <div v-else>

      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue';
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

  setup(){
    // get assets
    const assets = ref([]);
    walletState.currentLoggedInWallet.accounts.forEach(account => {
      account.assets.forEach(asset => {
        assets.value.push(asset);
      });
    });

    return {
      assets
    }
  },

}
</script>
<style scoped lang="scss">

.slide-enter-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
   -moz-transition-timing-function: ease-in;
   -webkit-transition-timing-function: ease-in;
   -o-transition-timing-function: ease-in;
   transition-timing-function: ease-in;
}

.slide-leave-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave-from {
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}

.optionDiv:hover{
  background: #D9EBFF;
}
</style>
