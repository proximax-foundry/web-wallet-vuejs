<template>
  <div>
    <div class='mt-4 w-11/12 ml-auto mr-auto '>
      <div class = 'flex text-xxs md:text-xs font-semibold border-b-2 '>
        <router-link :to="{ name: 'ViewAccountDisplayAll'}" class= 'w-18 text-center '>Overview</router-link>
        <router-link :to="{ name: 'ViewNormalAccount'}" class=" w-28 text-center "  style="width:6.5rem">My Accounts</router-link>
        <div class="text-center border-b-2 pb-4 lg:pb-3 border-yellow-500" style="width:9rem">Multisig Accounts</div>
        <router-link :to="{ name: 'ViewOtherAccount'}" class="text-center " style="width:8rem">Other Accounts</router-link>
        <div class="flex flex-row gap-1 ml-auto">
          <img src="@/modules/account/img/icon-account-settings.svg" class="w-4 h-4">
          <div>Accounts Settings</div>
        </div>
      </div>
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
  name: 'ViewMultisigAccount',
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
    
    
    //WalletUtils.confirmedTransactionRefresh(walletState.currentLoggedInWallet, networkState.currentNetworkProfile.network.currency.assetId);
    // get num of accounts
    const multisigAcc = [].concat(walletState.currentLoggedInWallet.others.filter(account=>account.type=="MULTISIG"),walletState.currentLoggedInWallet.accounts.filter(account=>account.getDirectParentMultisig().length>0))
    var num_acc = multisigAcc.length;
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
        if(walletState.currentLoggedInWallet){
          if(walletState.currentLoggedInWallet.others){
            const concatOther = walletState.currentLoggedInWallet.accounts.filter(account=>account.getDirectParentMultisig().length>0).concat(walletState.currentLoggedInWallet.others.filter(account=>account.type=="MULTISIG"))
            return concatOther;
          } else{
            return walletState.currentLoggedInWallet.accounts.filter(account=>account.getDirectParentMultisig().length>0);
          }
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