<template>
  <div>
    <div class='mt-4 w-11/12 ml-auto mr-auto '>
      <div class = 'flex text-xxs md:text-xs font-semibold border-b-2 '>
        <router-link :to="{ name: 'ViewAccountDisplayAll'}" class= 'w-18 text-center '>Overview</router-link>
        <router-link :to="{ name: 'ViewNormalAccount'}" class=" w-28 text-center "  style="width:6.5rem">My Accounts</router-link>
        <router-link :to="{ name: 'ViewMultisigAccount'}" class="text-center " style="width:9rem">Multisig Accounts</router-link>
        <div class="text-center border-b-2 pb-4 lg:pb-3 border-yellow-500" style="width:8rem">Other Accounts</div>
      </div>
    </div>
    <div class='my-4 w-11/12 ml-auto mr-auto '>
      <router-link :to="{name:'ViewAccountCreateSelectType'}" >
          <div class="float-right mb-4 text-center w-44 text-white bg-blue-primary rounded-md font-semibold text-xs p-2">+ Create New Account</div>
      </router-link>
    </div>
    <div class='mt-2 py-3 '>
      <div class="w-11/12 ml-auto mr-auto flex flex-col gap-3">
        <AccountTile :key="index" :account="item" :showMenuCall="showMenu[index]" :i="index" v-for="(item, index) in accounts" />
      </div>
    </div>
  </div>
</template>

<script>

import { computed, getCurrentInstance, ref } from "vue";
import AccountTile from '@/modules/account/components/AccountTile.vue';
import { useToast } from "primevue/usetoast";
import { walletState } from '@/state/walletState';
import { WalletUtils } from '@/util/walletUtils';
import { networkState } from "@/state/networkState";

export default {
  name: 'ViewOtherAccount',
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
    
    
    //WalletUtils.confirmedTransactionRefresh(walletState.currentLoggedInWallet, AppState.nativeToken.assetId);
    // get num of accounts
    const otherAcc = [].concat(walletState.currentLoggedInWallet.others)
    var num_acc = otherAcc.length;
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
        if(walletState.currentLoggedInWallet.others){
            return walletState.currentLoggedInWallet.others;
        } else{
          return null;
        }
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
      showMenu
    };
  },
}
</script>

<style>

</style>