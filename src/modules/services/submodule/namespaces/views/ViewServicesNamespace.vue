<template>
  <div>
    <div class='ml-2 mr-2 w-full lg:ml-auto lg:mr-auto mt-5'>
      <div v-if="namespaces.length > 0">
        <NamespaceDataTable class="mt-10 w-full" :key="defaultIndex" :address="address"></NamespaceDataTable>
        <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="mt-10 lg:mt-0 bg-blue-primary px-5 py-3 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-60"><img src="@/assets/img/icon-plus.svg" class="inline-block mr-2">{{$t('namespace.registerNewNamespace')}}</router-link>
      </div>
      <div v-else class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <div class="flex justify-between text-sm mb-5">
          <div><span class="text-gray-700">{{$t('general.namespace',2)}}</span></div>
        </div>
        <div class="border border-gray-200 filter drop-shadow-xl py-2 sm:py-14 px-2 sm:px-28 text-center bg-white">
          <img src="@/modules/services/submodule/namespaces/img/namespace_default.svg" class="inline-block h-18 w-18">
          <div class="text-gray-700 text-sm my-5">{{$t('namespace.noNamespace2')}}</div>
          <div class="text-gray-600 text-tsm my-5">{{$t('namespace.namespaceDescription')}}</div>
          <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="bg-blue-primary py-2 px-7 rounded-lg text-white font-bold mt-4 inline-block">{{$t('namespace.registerNamespace')}}</router-link>
        </div>
        <div class="sm:grid sm:grid-cols-2 mt-10 lg:mt-16">
          <div class="mb-8 sm:pr-1">
            <a href="https://bcdocs.xpxsirius.io/docs/built-in-features/namespace/" target=_new class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex">{{$t('general.namespaceQues')}}</a>
            <div class="text-gray-400 text-tsm my-3 sm:pr-2">{{$t('namespace.namespaceAns')}}</div>
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
import { AssetsUtils } from '@/util/namespaceUtils';
import { WalletUtils } from '@/util/walletUtils';
import NamespaceDataTable from '@/modules/services/submodule/namespaces/components/NamespaceDataTable.vue';

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

    // get namespaces
    const namespaces = ref([]);
    if(walletState.currentLoggedInWallet){
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
    }

    emitter.on("TXN_CONFIRMED", txLength => {
      setTimeout(() => {
        ++defaultIndex.value;
      }, 1000);
    });

    return {
      namespaces,
      defaultIndex,
      // currentBlock,
    }
  },

}
</script>
<style scoped lang="scss">

</style>
