<template>
  <div @click='toggleSelection = !toggleSelection' class= "border ml-auto mr-auto py-3 px-2 cursor-pointer rounded-md flex justify-between sm:block">
    <div class='sm:flex items-center sm:justify-between'>
      <div class="flex">
        <div v-html="toSvg('account', 25, jdenticonConfig)" v-if='!selectedImg'></div>
        <div v-html="selectedImg" v-else></div>
        <div class="flex flex-col ml-2 text-left">
          <div class="text-blue-primary font-semibold text-xxs uppercase" style="line-height: 9px;">{{ placeholder?placeholder:'Account' }}</div>
          <div v-if='selectedAccount!=""' class="mt-1 text-tsm font-bold text-left">{{selectedAccount}}</div>
          <div v-else class="text-tsm font-bold mt-1 text-left">Select Account</div>
        </div>
      </div>
      <div class="sm:flex ml-8 mt-2 sm:ml-0 sm:mt-0 text-left sm:text-right">
        <div class="text-xs mr-3" v-if="selectedAccount!=''">Balance: <span v-html="selectedAccountBalanceFormatted"></span></div>
        <div v-if='!toggleSelection && selectedAccount==""' class="hidden sm:block text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"><img src="@/modules/services/submodule/mainnetSwap/img/icon-caret-down.svg"></div>
        <div v-if='!toggleSelection && selectedAccount!=""'  class="hidden sm:block text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"><img src="@/modules/services/submodule/mainnetSwap/img/icon-caret-down.svg"></div>
        <img v-if='toggleSelection' @click="selectedAccount='';$emit('update:modelValue', '');" src="@/assets/img/delete.svg" class="hidden sm:block h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto">
      </div>
    </div>
    <div class="sm:hidden items-center flex">
      <div v-if='!toggleSelection && selectedAccount==""' class="text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"><img src="@/modules/services/submodule/mainnetSwap/img/icon-caret-down.svg"></div>
      <div v-if='!toggleSelection && selectedAccount!=""'  class="text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"><img src="@/modules/services/submodule/mainnetSwap/img/icon-caret-down.svg"></div>
      <img v-if='toggleSelection' @click="selectedAccount='';$emit('update:modelValue', '');" src="@/assets/img/delete.svg" class="h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto">
    </div>
  </div>
  <div class='relative'>
  <div v-if='toggleSelection' class='absolute border border-t-0 w-full z-50 bg-white max-h-40 overflow-auto px-3 filter drop-shodow-xl'>
    <div v-if='accounts.length>0' class="pl-2 pt-4 text-xxs text-gray-400 text-left">SELECT ACCOUNT</div>
    <div v-else class='text-xxs pt-2 pl-2 pb-2' >The list is empty.</div>
    <div v-for='(items,index) in accounts' :key="items" class="px-2 py-3 flex cursor-pointer items-center" @click="selectAccount(items.label, items.value, items.disabled);" :class='`${(index != accounts.length - 1)?"border-b border-gray-200":""}`'>
      <div v-html="toSvg(items.value, 20, jdenticonConfig)"></div>
      <div class='text-xs ml-2 font-semibold' :class="`${ items.disabled?'text-gray-400':'' }`">{{items.label}}</div>
      <div v-if='items.label!=selectedAccount && !items.disabled' class='cursor-pointer text-blue-primary text-xxs mt-0.5 ml-auto font-semibold'>SELECT</div>
      <div v-else-if="items.disabled" class='text-gray-400 text-xxs mt-0.5 ml-auto'>DISABLED</div>
      <div v-else class='text-gray-500 text-xxs mt-0.5 ml-auto'>CURRENT</div>
    </div>
  </div>
  </div>
</template>

<script>
import { networkState } from '@/state/networkState';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { walletState } from '@/state/walletState';
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { toSvg } from "jdenticon";
import { Helper } from "@/util/typeHelper";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { Nis1SwapUtils } from '@/util/nis1SwapUtils';

export default defineComponent({
  emits:[
    'select-account','update:modelValue',
  ],
  name: 'SelectInputNIS1Account',
  props: [
    'modelValue',
    'selectDefault',
    'placeholder',
  ],

  setup(p, {emit}){
    const toggleSelection = ref(false);

    // const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);

    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();
    let jdenticonConfig = themeConfig.jdenticonConfig;

    // get nis1 account info
    var accountList = [];
    const concatOther = walletState.currentLoggedInWallet.accounts.concat(walletState.currentLoggedInWallet.others);
    const nis1Accounts = concatOther.filter(account => account.nis1Account != undefined || account.nis1Account != null);
    if(nis1Accounts.length > 0){
      nis1Accounts.forEach(async(account) => {
        const balances = await Nis1SwapUtils.getNIS1AccountBalance(account.nis1Account.publicKey);
        if(balances.length > 0){
          account.nis1Account.balance = [];
          balances.forEach(balance => {
            const assetId = balance.assetId;
            const divisibility = balance.divisibility;
            const quantity = balance.amount;
            account.nis1Account.balance.push({
              assetId, divisibility, amount:quantity
            });
          });
          walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
        }
      });
    }

    const accounts = computed(() => {
      if(nis1Accounts.length > 0){
        nis1Accounts.forEach(account => {
          accountList.push({
            value: account.address,
            label: account.name,
            disabled: (account.nis1Account.balance.length > 0)?false:true,
          });
        });
      }
      return accountList;
    });

    const selectedAccount = ref('');
    const selectedAddress = ref('');
    const selectedAccountBalance = ref([]);
    const selectedImg = ref('');
    const selectAccount = (accountName, accountAddress, disabled) => {
      if(!disabled){
        selectedAccount.value = accountName;
        selectedAddress.value = accountAddress;
        selectedImg.value = toSvg(accountAddress, 25, jdenticonConfig);
        toggleSelection.value = !toggleSelection.value;
        const selectedAcc = nis1Accounts.find(account => account.address == accountAddress);
        selectedAccountBalance.value = selectedAcc.nis1Account.balance;
        emit('update:modelValue', selectedAddress.value);
        emit('select-account', selectedAddress.value);
      }
    };

    const selectedAccountBalanceFormatted = computed(() => {
      let balanceStr = '';
      selectedAccountBalance.value.forEach(asset => {
        let balance = Helper.convertToCurrency(asset.amount, 0).split('.');
        balanceStr += ('<span class="font-bold text-xs ml-2">' + balance[0] + '</span>' + (balance[1]?'.<span class="text-xxs">' + balance[1] + '</span>':'') + ' ' + asset.assetId.name );
      });
      return balanceStr;
    });

    return {
      selectAccount,
      selectedAddress,
      selectedImg,
      accounts,
      toggleSelection,
      selectedAccount,
      jdenticonConfig,
      toSvg,
      selectedAccountBalanceFormatted,
      // currentNativeTokenName,
    };
  }
})
</script>

