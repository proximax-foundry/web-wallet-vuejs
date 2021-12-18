<template>
  <div @click='toggleSelection = !toggleSelection' class= "border ml-auto mr-auto py-3 px-2 cursor-pointer rounded-md">
    <div class='flex items-center justify-between'>
      <div class="flex">
        <div v-html="toSvg('account', 25, jdenticonConfig)" v-if='!selectedImg'></div>
        <div v-html="selectedImg" v-else></div>
        <div class="flex flex-col ml-2">
          <div class="text-blue-primary font-semibold text-xxs uppercase"  style="line-height: 9px;">{{ placeholder?placeholder:'Account' }}</div>
          <div v-if='selectedAccount!=""' class="mt-1 text-tsm font-bold text-left">{{selectedAccount}}</div>
          <div v-else class="text-tsm font-bold mt-1 text-left">Select Account</div>
        </div>
      </div>
      <div class="flex">
      <div class="text-xs mr-3" v-if="selectedAccount!=''">Balance <span v-html="selectedAccountBalanceFormatted"></span> <span class="text-xxs">{{ currentNativeTokenName }}</span></div>
      <div v-if='!toggleSelection && selectedAccount==""' class="text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"><img src="@/modules/services/submodule/mainnetSwap/img/icon-caret-down.svg"></div>
      <div v-if='!toggleSelection && selectedAccount!=""'  class="text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"><img src="@/modules/services/submodule/mainnetSwap/img/icon-caret-down.svg"></div>
      <img v-if='toggleSelection' @click="selectedAccount='';$emit('update:modelValue', '');" src="@/assets/img/delete.svg" class="h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto">
      </div>
    </div>
  </div>
  <div class='relative'>
  <div v-if='toggleSelection' class='absolute border border-t-0 w-full z-50 bg-white max-h-40 overflow-auto px-3 filter drop-shodow-xl'>
    <div v-if='accounts.length>0' class="pl-2 pt-4 text-xxs text-gray-400 text-left">SELECT ACCOUNT</div>
    <div v-else class='text-xxs pt-2 pl-2 pb-2' >The list is empty.</div>
    <div v-for='(items,index) in accounts' :key="items" class="px-2 py-3 flex cursor-pointer items-center" @click="selectAccount(items.label, items.value);$emit('update:modelValue', selectedAddress);$emit('select-account', selectedAddress);" :class='`${(index != accounts.length - 1)?"border-b border-gray-200":""}`'>
      <div v-html="toSvg(items.value, 20, jdenticonConfig)"></div>
      <div class='text-xs ml-2 font-semibold'>{{items.label}}</div>
      <div v-if='items.label!=selectedAccount' class='cursor-pointer text-blue-primary text-xxs mt-0.5 ml-auto font-semibold'>SELECT</div>
      <div v-else class='text-gray-500 text-xxs mt-0.5 ml-auto'>CURRENT</div>
    </div>
  </div>
  </div>
</template>

<script>
import { networkState } from '@/state/networkState';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { walletState } from '@/state/walletState';
import { computed, defineComponent, ref } from 'vue';
import { toSvg } from "jdenticon";
import { Helper } from "@/util/typeHelper";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';

export default defineComponent({
  emits:[
    'select-account','update:modelValue',
  ],
  name: 'SelectInputAccountOutgoingSwap',
  props: [
    'modelValue',
    'selectDefault',
    'placeholder',
  ],

  setup(p){

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    
    const toggleSelection = ref(false);

    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();
    let jdenticonConfig = themeConfig.jdenticonConfig;

    const includeMultisig = ref(false);

    // const allAvailableAccounts = computed(()=>{

    //   if(!walletState.currentLoggedInWallet){
    //     return [];
    //   }

    //   let accounts = walletState.currentLoggedInWallet.accounts.map(
    //     (acc)=>{ 
    //       return { 
    //         name: acc.name,
    //         balance: acc.balance,
    //         balanceDisplay: Helper.toCurrencyFormat(acc.balance, 6),
    //         type: "",
    //         address: Helper.createAddress(acc.address).pretty(),
    //         publicKey: acc.publicKey,
    //         isMultisig: acc.getDirectParentMultisig().length ? true: false
    //       };  
    //     });

    //   if(includeMultisig.value){
    //     let otherAccounts = walletState.currentLoggedInWallet.others.filter((acc)=> acc.type === "MULTISIG").map(
    //     (acc)=>{ 
    //       return { 
    //         name: acc.name,
    //         balance: acc.balance,
    //         balanceDisplay: Helper.toCurrencyFormat(acc.balance, 6),
    //         type: "MULTISIG",
    //         address: Helper.createAddress(acc.address).pretty(),
    //         publicKey: acc.publicKey,
    //         isMultisig: true
    //       }; 
    //     });

    //     return accounts.concat(otherAccounts);
    //   }
    //   else{
    //     return accounts;
    //   }
    // });

    const accounts = computed(() =>{
      var accountList = [];
      let accounts;
      if(includeMultisig.value){
        accounts = walletState.currentLoggedInWallet.accounts.concat(walletState.currentLoggedInWallet.others)
      }else{
        accounts = walletState.currentLoggedInWallet.accounts;
      }

      accounts.forEach(account => {
        accountList.push({
          value: account.address,
          label: account.name,
        });
      });
      // accountList.sort((a, b) => {
      //   if (a.label > b.label) return 1;
      //   if (a.label < b.label) return -1;
      //   return 0;
      // });
      return accountList;
    });

    // const selectedAccount = ref(accounts.value.find(acc => acc.value == p.selectDefault).label);
    const selectedAccount = ref('');
    const selectedAddress = ref('');
    const selectedAccountBalance = ref(0);
    // const selectedAddress = ref(p.selectDefault);
    // const selectedImg = ref(toSvg(p.selectDefault, 25, jdenticonConfig));
    const selectedImg = ref('');
    const selectAccount = (accountName, accountAddress) => {
      selectedAccount.value = accountName;
      selectedAddress.value = accountAddress;
      let accounts;
      if(includeMultisig.value){
        accounts = walletState.currentLoggedInWallet.accounts.concat(walletState.currentLoggedInWallet.others)
      }else{
        accounts = walletState.currentLoggedInWallet.accounts;
      }
      selectedAccountBalance.value = accounts.find(account => account.address == accountAddress).balance;
      selectedImg.value = toSvg(accountAddress, 25, jdenticonConfig);
      toggleSelection.value = !toggleSelection.value;
    };

    const selectedAccountBalanceFormatted = computed(() => {
      let balance = Helper.convertToCurrency(selectedAccountBalance.value, 0).split('.');
      return '<span class="font-bold text-xs">' + balance[0] + '</span>' + (balance[1]?'.<span class="text-xxs">' + balance[1] + '</span>':'');
    });

    return {
      currentNativeTokenName,
      selectAccount,
      selectedAddress,
      selectedAccountBalance,
      selectedAccountBalanceFormatted,
      selectedImg,
      accounts,
      toggleSelection,
      selectedAccount,
      jdenticonConfig,
      toSvg
    };
  }
})
</script>

