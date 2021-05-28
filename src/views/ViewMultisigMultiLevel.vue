<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Accounts ></span> <span class="text-blue-primary font-bold">Multisig</span></div>
    <div>
      <router-link :to="{ name: 'ViewConvertAccountMultisig'}" class="font-bold" active-class="accounts">Convert to Multisig Account</router-link> |
      <router-link :to="{ name: 'ViewAllServices'}" class="font-bold" active-class="accounts">Services</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line'>
    <div class="grid xs-grid-cols-1 sm:grid-cols-2" v-if="accounts.length > 0">
      <multiSigTile :key="index" :account="item" :i="index" v-for="(item, index) in accounts" />
    </div>
    <div v-else class="mt-10">
      No multisig account in this wallet
    </div>
    <div class="mt-10">
      <router-link :to="{ name: 'ViewConvertAccountMultisig'}" class="my-8 hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none">(+) Multisig Account</router-link>
    </div>
  </div>
</template>
<script>
import { computed, inject } from "vue";
import multiSigTile from '@/components/MultiSigTile.vue';
import { multiSign } from '../util/multiSignatory.js';


export default {
  name: 'ViewDisplayAllAccounts',
  components: {
    multiSigTile,
  },

  setup() {
    const appStore = inject("appStore");

    (async()=> {
      await multiSign.checkToCreateMultiSigAccount(appStore.state.currentLoggedInWallet.name);
      // await multiSign.updateAccountsMultiSign(appStore.state.currentLoggedInWallet.name);
      // clean wallet from removed multisig account of cosigners
      await multiSign.removeUnrelatedMultiSig(appStore.state.currentLoggedInWallet.name);
    })();

    const accounts = computed(
      () => {
        // return appStore.state.currentLoggedInWallet.accounts;
        // return appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts;
        let multisig = [];
        const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
        wallet.accounts.find(element => {
          if(element.isMultisign != undefined){
            if(element.isMultisign != '' || element.isMultisign != null){
              if(element.isMultisign.cosignatories != undefined){
                if(element.isMultisign.cosignatories.length > 0){
                  multisig.push(element);
                }
              }
            }
          }
        });
        multisig.sort(compare);
        return multisig;
      }
    );

    function compare( a, b ) {
      if ( a.name.toLowerCase() < b.name.toLowerCase() ){
        return -1;
      }
      if ( a.name.toLowerCase() > b.name.toLowerCase() ){
        return 1;
      }
      return 0;
    }

    return {
      appStore,
      accounts,
    };
  },
}
</script>
