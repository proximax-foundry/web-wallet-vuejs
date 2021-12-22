<template>
  <div>
    <div class='ml-2 mr-2 w-full lg:ml-auto lg:mr-auto mt-5'>
      <div v-if="namespaces.length > 0">
        <NamespaceDataTable class="mt-10 w-full" :key="defaultIndex" :currentBlockHeight="currentBlock" :address="address"></NamespaceDataTable>
        <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="mt-10 lg:mt-0 bg-blue-primary px-5 py-3 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-60"><img src="@/assets/img/icon-plus.svg" class="inline-block mr-2"> Register New Namespace</router-link>
      </div>
      <div v-else class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <div class="flex justify-between text-sm mb-5">
          <div><span class="text-gray-700">{{$t('services.namespaces')}}</span></div>
        </div>
        <div class="border border-gray-200 filter drop-shadow-xl py-2 sm:py-14 px-2 sm:px-28 text-center bg-white">
          <img src="@/modules/services/submodule/namespaces/img/namespace_default.svg" class="inline-block h-18 w-18">
          <div class="text-gray-700 text-sm my-5">Looks like you don’t have any namespaces yet.</div>
          <div class="text-gray-600 text-tsm my-5"><a href="https://bcdocs.xpxsirius.io/docs/built-in-features/namespace/" target=_new>Namespaces</a> allow you to create an on-chain unique place for your business and your namespaces on the Sirius Chain.</div>
          <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="bg-blue-primary py-2 px-7 rounded-lg text-white font-bold mt-4 inline-block">Register Namespace</router-link>
        </div>
        <div class="grid grid-cols-3 mt-16">
          <div>
            <a href="https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/" target=_new class="text-blue-primary font-bold inline-block text-tsm">What is Namespace?</a>
            <div class="text-gray-400 text-tsm my-3 sm:pr-2">A namespace starts with a name that you choose, similar to an internet domain name.</div>
          </div>
          <div>
            <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="text-blue-primary font-bold inline-block text-tsm">The complete guide about Namespace</router-link>
            <div class="text-gray-400 text-tsm my-3">What is namespace? Refer to the complete guide on Namespace here.</div>
          </div>
          <div>
            <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="text-blue-primary font-bold inline-block text-tsm">Give us feedback about your experience here</router-link>
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
import { AssetsUtils } from '@/util/namespaceUtils';
import { WalletUtils } from '@/util/walletUtils';
import NamespaceDataTable from '@/modules/services/submodule/namespaces/components/NamespaceDataTable.vue';
import { listenerState } from '@/state/listenerState';

export default {
  name: 'ViewServicesNamespace',
  components: {
    NamespaceDataTable
  },
  props: {
    address: String,
  },

  setup(){
    const defaultIndex = ref(0);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const currentBlock = computed(() => listenerState.currentBlock);

    // get namespaces
    const namespaces = ref([]);
    walletState.currentLoggedInWallet.accounts.forEach(account => {
      account.namespaces.forEach(ns => {
        namespaces.value.push(ns);
      });
    });

    walletState.currentLoggedInWallet.others.forEach(account => {
      account.namespaces.forEach(ns => {
        namespaces.value.push(ns);
      });
    });

    emitter.on("TXN_CONFIRMED", txLength => {
      setTimeout(() => {
        ++defaultIndex.value;
      }, 1000);
    });

    return {
      namespaces,
      defaultIndex,
      currentBlock,
    }
  },

}
</script>
<style scoped lang="scss">

</style>
