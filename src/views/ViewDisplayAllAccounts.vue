<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Accounts ></span> <span class="text-blue-primary font-bold">View All</span></div>
    <div>
      <router-link :to="{ name: 'SelectTypeCreateAccount'}" class="font-bold" active-class="accounts">Create a New Account</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line'>
    <div class="grid xs-grid-cols-1 sm:grid-cols-2">
      <AccountTile :key="index" :account="item" :showMenuCall="showMenu[index]" :i="index" v-for="(item, index) in accounts" />
    </div>
  </div>
</template>
<script>
import { computed, inject, getCurrentInstance, ref } from "vue";
import AccountTile from '@/components/AccountTile.vue';
import { multiSign } from '../util/multiSignatory.js';
import { useToast } from "primevue/usetoast";

export default {
  name: 'ViewDisplayAllAccounts',
  props:[
    'deleteAccount'
  ],
  components: {
    AccountTile,
  },

  setup(p) {
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    const currentMenu = ref('');
    const showMenu = ref([]);

    (async()=> {
      await multiSign.checkToCreateMultiSigAccount(appStore.state.currentLoggedInWallet.name);
      // await multiSign.updateAccountsMultiSign(appStore.state.currentLoggedInWallet.name);
      // clean wallet from removed multisig account of cosigners
      await multiSign.removeUnrelatedMultiSig(appStore.state.currentLoggedInWallet.name);
    })();

    // get num of accounts
    var num_acc = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts.length;
    var i = 0;
    while(i < num_acc){
      showMenu.value[i] = false;
      i++;
    }

    emitter.on("SHOW_MENU_TRIGGER", payload => {
      showMenu.value[payload] = true;
      currentMenu.value = payload;
    });
    emitter.on("CLOSE_MENU_TRIGGER", payload => {
      showMenu.value[payload] = false;
      currentMenu.value = payload;
    });

    emitter.on("CLOSE_ALL_MENU_TRIGGER", () => {
      var j = 0;
      while(j < num_acc){
        showMenu.value[j] = false;
        j++;
      }
    });

    if(p.deleteAccount == 'success'){
      toast.add({severity:'success', summary: 'Notification', detail: 'Account has been removed successfully', group: 'br', life: 5000});
    }

    const accounts = computed(
      () => {
        // return appStore.state.currentLoggedInWallet.accounts;
        // console.log(appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts)
        return appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts;
      }
    );

    // emitted from App.vue when click on any part of the page
    emitter.on('PAGE_CLICK', () => {
      if(currentMenu.value === ''){
        var k = 0;
        while(k < num_acc){
          showMenu.value[k] = false;
          k++;
        }
      }
    });

    emitter.on('HOVER_OVER_MENU_TRIGGER', index => {
      currentMenu.value = index;
    });

    emitter.on('HOVER_OUT_MENU_TRIGGER', () => {
      currentMenu.value = '';
    });

    return {
      appStore,
      accounts,
      showMenu,
    };
  },
}
</script>
