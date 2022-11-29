<template>
  <div>
      <Dropdown
        :style="{'width':'100%'}"
        v-model=selectedAccount
        :options=filteredAccounts
        :filter="true"
      >
        <template #value="selectedAccount">
          <div v-if="selectedAccount.value" class="country-item country-item-value">
              <div class='flex'>
                <div v-html="toSvg(selectedAccount.value.value, 25, jdenticonConfig)"/>
                <div class='flex flex-col ml-2 text-left'>
                  <div class='text-blue-primary font-semibold text-xxs uppercase'  style="line-height: 9px;">{{$t('transfer.transferFrom')}}</div>
                  <div class='mt-1 text-tsm font-bold'>{{selectedAccount.value.label}}</div>
                </div>
              </div>
          </div>
          <!-- For original account, when first time clicked in -->
          <span v-else>
            {{selectedAccount.placeholder}}
          </span>
        </template>
        <!-- For the dropdown option -->
        <template #option="slotProps">
          <div class="country-item">
            <div class='flex'>
              <div v-html="toSvg(slotProps.option.value, 20, jdenticonConfig)" />
                <div class='text-xs ml-2 font-semibold'>{{ slotProps.option.label }}</div>
            </div>
          </div>
        </template>
      </Dropdown>
  </div>

  <!-- 
    When toggling selection
    <div @click='toggleSelection = !toggleSelection' class= "border ml-auto mr-auto py-3 px-2 cursor-pointer rounded-md">
    Flex so that can differentiate image and text
    <div class='flex'>
      if there is no selected image transfer to svg, else selected image is displayed
      <div v-html="toSvg('account', 25, jdenticonConfig)" v-if='!selectedImg'></div>
      <div v-html="selectedImg" v-else></div>
    	display the information
      <div class='flex flex-col ml-2 text-left'>
        display the transfer from
        <div class='text-blue-primary font-semibold text-xxs uppercase'  style="line-height: 9px;">{{$t('transfer.transferFrom')}}</div>
        if there is no selected account choose default account
        <div v-if='selectedAccount!=""' class='mt-1 text-tsm font-bold'>{{selectedAccount}}</div>
        <div v-else class='text-txs mt-1 font-bold '>{{$t('general.selectAccount')}}</div>
      </div>
      if there is no toggle for selection and there is no account 
      <div v-if='!toggleSelection && selectedAccount!=""'  class='text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'>{{$t('general.change')}}</div>
    </div>
  </div>

  the drop down selection
  <div class='relative'>
    toggling the selection
    <div v-if='toggleSelection' class='absolute border border-t-0 w-full z-50 bg-gray-100 max-h-40 overflow-auto px-3 filter drop-shodow-xl'>
      check if there is account check is which one and change the text to selected
      <div v-if='accounts.length>0' class="pl-2 pt-4 text-xxs text-gray-400 uppercase">{{$t('general.selectAccount')}}</div>
      <div v-else class='text-xxs pt-2 pl-2 pb-2' >{{$t('general.listEmpty')}}</div>
      this is a place holder for search
      <input v-model="filterQuery" type="text" class="pl-2 pt-4 outline-none text-xs text-black bg-gray-100" :placeholder="$t('general.search')">
      for each item in the accounts
      <div v-for='(items,index) in filteredAccounts' :key="items" class="px-2 py-3 flex cursor-pointer items-center" @click="selectAccount(items.label, items.value);$emit('update:modelValue', selectedAddress);$emit('select-account', selectedAddress);" :class='`${(index != accounts.length - 1)?"border-b border-gray-200":""}`'>
        <div v-html="toSvg(items.value, 20, jdenticonConfig)"></div>
        <div class='text-xs ml-2 font-semibold'>{{items.label}}</div>
        <div v-if='items.label!=selectedAccount' class='cursor-pointer text-blue-primary text-xxs mt-0.5 ml-auto font-semibold uppercase'>{{$t('general.select')}}</div>
        <div v-else class='text-gray-500 text-xxs mt-0.5 ml-auto uppercase'>{{$t('general.current')}}</div>
      </div>
    </div>
  </div> -->
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
      if(walletState.currentLoggedInWallet){
        var accountList = [];
        const concatOther = walletState.currentLoggedInWallet.accounts.concat(walletState.currentLoggedInWallet.others)
        concatOther.forEach(account => {
          accountList.push({
            value: account.address,
            label: walletState.currentLoggedInWallet.convertAddressToName(account.address,true)
          });
        });
        
        return accountList;
      }else{
        return []
      }
      
    });
    const selectedAccount = ref(accounts.value.length?accounts.value.find(acc => acc.value == p.selectDefault).label:'');
    const selectedAddress = ref(p.selectDefault);
    const selectedImg = ref(toSvg(p.selectDefault, 25, jdenticonConfig));
    const selectAccount = (accountName, accountAddress) => {
      emitter.emit("select-account",accountAddress)
      selectedAccount.value = accountName;
      selectedAddress.value = accountAddress;
      selectedImg.value = toSvg(accountAddress, 25, jdenticonConfig);
      toggleSelection.value = !toggleSelection.value;
    };
    const filterQuery = ref("");
    const filteredAccounts = computed(() => {
      const query = filterQuery.value.toLowerCase();
      if(filterQuery.value == ""){
        return accounts.value;
      }
      return accounts.value.filter((items) =>{
        return Object.values(items).some((word) =>
          String(word).toLowerCase().includes(query));
      });
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
      filterQuery,
      filteredAccounts
    };
}
})
</script>

<style>
</style>