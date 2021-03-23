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
import { computed, inject } from "vue";
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
  data() {
    return {
      toggleModal: false,
      showMenu: [],
    };
  },
  setup() {
    const appStore = inject("appStore");
    const accounts = computed(
      () => {
        // return appStore.state.currentLoggedInWallet.accounts;
        // console.log(appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts)
        return appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts;
      }
    );
    return {
      appStore,
      accounts
    };
  },
  created(){
    // get num of accounts
    var num_acc = this.appStore.getWalletByName(this.appStore.state.currentLoggedInWallet.name).accounts.length;
    var i = 0;
    while(i < num_acc){
      this.showMenu[i] = false;
      i++;
    }

    this.emitter.on("SHOW_MENU_TRIGGER", payload => {
      this.showMenu[payload] = true;
    });
    this.emitter.on("CLOSE_MENU_TRIGGER", payload => {
      this.showMenu[payload] = false;
    });
    this.emitter.on("CLOSE_ALL_MENU_TRIGGER", () => {
      var j = 0;
      while(j < num_acc){
        this.showMenu[j] = false;
        j++;
      }
    });

    if(this.deleteAccount=='success'){
      this.toggleModal = true;
    }
    this.emitter.on("CLOSE_NOTIFICATION", payload => {
      this.toggleModal = payload;
    });
  },
}
</script>
