<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Accounts ></span> <span class="text-blue-primary font-bold">View All</span></div>
    <div>
      <router-link :to="{ name: 'ViewAccountCreateSelectType'}" class="font-bold" active-class="accounts">Create a New Account</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line'>
    <div class="grid xs-grid-cols-1 sm:grid-cols-2">
      <AccountTile :key="index" :account="item" :showMenuCall="showMenu[index]" :i="index" v-for="(item, index) in accounts" />
    </div>
  </div>
</template>
<script>
import { computed, getCurrentInstance, ref } from "vue";
import AccountTile from '@/modules/account/components/AccountTile.vue';
import { useToast } from "primevue/usetoast";
import { walletState } from '@/state/walletState';


export default {
  name: 'ViewAccountDisplayAll',
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
    const currentMenu = ref('');
    const showMenu = ref([]);

    // get num of accounts
    /* var num_other_acc = walletState.currentLoggedInWallet.others.length; */
    var num_acc = walletState.currentLoggedInWallet.accounts.length;
    var i = 0;
    while(i < num_acc){
      showMenu.value[i] = false;
      i++;
    }
    //console.log(walletState.currentLoggedInWallet.accounts);
    /* while(i < num_other_acc){
    showMenu.value[i] = false;
     i++;
    }  */
    
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
        return walletState.currentLoggedInWallet.accounts;
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
     walletState,
      accounts,
      showMenu,
    };
  },
}
</script>
