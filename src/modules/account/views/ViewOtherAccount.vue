<template>
  <div>
    <div class='mt-4 w-11/12 ml-auto mr-auto '>
      <div class = 'flex text-xxs md:text-xs font-semibold border-b-2 '>
        <router-link :to="{ name: 'ViewAccountDisplayAll'}" class= 'w-18 text-center '>{{$t('general.overview')}}</router-link>
        <router-link :to="{ name: 'ViewNormalAccount'}" class=" w-28 text-center "  style="width:6.5rem">{{$t('account.myAcc')}}</router-link>
        <router-link :to="{ name: 'ViewMultisigAccount'}" class="text-center " style="width:9rem">{{$t('account.multisigAcc')}}</router-link>
        <div class="text-center border-b-2 pb-4 lg:pb-3 border-yellow-500" style="width:8rem">{{$t('account.otherAcc')}}</div>
      </div>
    </div>
    <div class='my-4 w-11/12 ml-auto mr-auto '>
      <router-link :to="{name:'ViewAccountCreateSelectType'}" >
          <div class="float-right mb-4 text-center w-44 text-white bg-blue-primary rounded-md font-semibold text-xs p-2">+ {{$t('general.createNewAcc')}}</div>
      </router-link>
    </div>
    <div class='mt-2 py-3 '>
      <div class="w-11/12 ml-auto mr-auto flex flex-col gap-3">
        <AccountTile :key="index" :account="item" v-for="(item, index) in accounts" />
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
  components: {
    AccountTile,
  },

  setup() {

    const accounts = computed(
      () => {
        if(walletState.currentLoggedInWallet.others){
            return walletState.currentLoggedInWallet.others;
        } else{
          return null;
        }
      }
    );
   
    return {
      accounts,
    };
  },
}
</script>

<style>

</style>