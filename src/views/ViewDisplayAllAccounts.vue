<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Accounts ></span> <span class="text-blue-primary font-bold">View All</span></div>
    <div>
      <router-link to="/select-type-creation-account" class="font-bold" active-class="accounts">Create a New Account</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line'>
    <div class="grid xs-grid-cols-1 sm:grid-cols-2">
      <AccountTile :key="index" :account="item" :showMenuCall="showMenu[index]" :i="index" v-for="(item, index) in accounts" />
    </div>
  </div>
  <NotificationModal :toggleModal="toggleModal" msg="Account has been removed successfully" notiType="noti" time='1500' />
</template>
<script>
import { computed, inject, getCurrentInstance, ref } from "vue";
import AccountTile from '@/components/AccountTile.vue';
import NotificationModal from '@/components/NotificationModal.vue';

export default {
  name: 'ViewDisplayAllAccounts',
  props:[
    'deleteAccount'
  ],
  components: {
    AccountTile,
    NotificationModal,
  },

  setup(p) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    const currentMenu = ref('');
    const toggleModal = false;
    const showMenu = ref([]);

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

    if(p.deleteAccount=='success'){
      toggleModal.value = true;
    }

    emitter.on("CLOSE_NOTIFICATION", payload => {
      toggleModal.value = payload;
    });

    const accounts = computed(
      () => {
        // return appStore.state.currentLoggedInWallet.accounts;
        // console.log(appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts)
        return appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts;
      }
    );

    emitter.on('PAGE_CLICK', () => {
      console.log('click: ' + currentMenu.value);
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
      toggleModal,
      showMenu,
    };
  },
}
</script>
