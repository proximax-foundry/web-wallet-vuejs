<template>
<div>
  <div @click='toggleSelection = !toggleSelection' class= "border ml-auto mr-auto py-3 px-2 cursor-pointer rounded-md">
    <div class='flex'>
      <div v-html="toSvg('account', 25, jdenticonConfig)" v-if='!selectedImg'></div>
      <div v-html="selectedImg" v-else></div>
      <div class='flex flex-col ml-2 text-left'>
        <div class='text-blue-primary font-semibold text-xxs'  style="line-height: 9px;">TRANSFER FROM</div>
        <div v-if='selectedAccount!=""' class='mt-1 text-tsm font-bold'>{{selectedAccount}}</div>
        <div v-else class='text-txs mt-1 font-bold '>SELECT ACCOUNT</div>
      </div>
      <!-- <div v-if='!toggleSelection && selectedAccount==""' class='text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'>Select</div> -->
      <div v-if='!toggleSelection && selectedAccount!=""'  class='text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'>Change</div>
      <!-- <img v-if='toggleSelection' @click='selectedAccount=""' src="@/assets/img/delete.svg" class='h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'> -->
    </div>
  </div>
  <div class='relative'>
    <div v-if='toggleSelection' class='absolute border border-t-0 w-full z-50 bg-white max-h-40 overflow-auto px-3 filter drop-shodow-xl'>
      <div v-if='accounts.length>0' class="pl-2 pt-4 text-xxs text-gray-400">SELECT ACCOUNT</div>
      <div v-else class='text-xxs pt-2 pl-2 pb-2' >The list is empty.</div>
      <div v-for='(items,index) in accounts' :key="items" class="px-2 py-3 flex cursor-pointer items-center" @click="selectAccount(items.label, items.value);$emit('update:modelValue', selectedAddress);$emit('select-account', selectedAddress);" :class='`${(index != accounts.length - 1)?"border-b border-gray-200":""}`'>
        <div v-html="toSvg(items.value, 20, jdenticonConfig)"></div>
        <div class='text-xs ml-2 font-semibold'>{{items.label}}</div>
        <div v-if='items.label!=selectedAccount' class='cursor-pointer text-blue-primary text-xxs mt-0.5 ml-auto font-semibold'>SELECT</div>
        <div v-else class='text-gray-500 text-xxs mt-0.5 ml-auto'>CURRENT</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { walletState } from '@/state/walletState';
import { computed, defineComponent, ref, getCurrentInstance } from 'vue';
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
export default defineComponent({
name: 'SelectInputSender',
emits:[
    'select-account','update:modelValue',
  ],
props: [
    'modelValue',
    'selectDefault'
  ],
setup(p){
    const toggleSelection = ref(false);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();
    let jdenticonConfig = themeConfig.jdenticonConfig;
    const accounts = computed(() =>{
      var accountList = [];
      const concatOther = walletState.currentLoggedInWallet.accounts.concat(walletState.currentLoggedInWallet.others)
      concatOther.forEach(account => {
        accountList.push({
          value: account.address,
          label: account.name,
        });
      });
      
      return accountList;
    });
    const selectedAccount = ref(accounts.value.find(acc => acc.value == p.selectDefault).label);
    const selectedAddress = ref(p.selectDefault);
    const selectedImg = ref(toSvg(p.selectDefault, 25, jdenticonConfig));
    const selectAccount = (accountName, accountAddress) => {
      emitter.emit("select-account",accountAddress)
      selectedAccount.value = accountName;
      selectedAddress.value = accountAddress;
      selectedImg.value = toSvg(accountAddress, 25, jdenticonConfig);
      toggleSelection.value = !toggleSelection.value;
    };
   
  
    return {
      selectAccount,
      selectedAddress,
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

<style>
</style>