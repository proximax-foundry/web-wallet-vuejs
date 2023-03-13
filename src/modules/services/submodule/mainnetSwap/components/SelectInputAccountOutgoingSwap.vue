<template>
  <div @click='toggleSelection = !toggleSelection' class= "border ml-auto mr-auto py-3 px-2 cursor-pointer rounded-md">
    <div class='flex items-center justify-between'>
      <div class="flex">
        <div v-html="toSvg('account', 25, jdenticonConfig)" v-if='!selectedImg'></div>
        <div v-html="selectedImg" v-else></div>
        <div class="flex flex-col ml-2 text-left">
          <div class="text-blue-primary font-semibold text-xxs uppercase"  style="line-height: 9px;">{{ placeholder?placeholder:$t('general.account') }}</div>
          <div v-if='selectedAccount!=""' class="mt-1 text-tsm font-bold text-left">{{selectedAccount}}</div>
          <div v-else class="text-tsm font-bold mt-1 text-left">{{$t('general.selectAccount')}}</div>
        </div>
      </div>
      <div class="flex">
        <div class="text-xs mr-3" v-if="selectedAccount!=''">
           
          <div class="flex gap-2">
            {{$t('general.balance')}}
            <div class="flex gap-2">
              <div v-if="otherToken!='prx.xpx'" v-html="otherTokenBalanceFormatted"></div> 
              <div v-if="otherToken!='prx.xpx'" class="text-xs uppercase">{{otherToken!='prx.xpx'?name: currentNativeTokenName }}</div> 
            </div>
            <div class="flex gap-2">
              <div  v-html="nativeTokenBalanceFormatted"></div> 
              <div  class="text-xs">{{currentNativeTokenName }}</div>
            </div>
          </div>
         
         
        </div>
        <div v-if='!toggleSelection && selectedAccount==""' class="text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"><img src="@/modules/services/submodule/mainnetSwap/img/icon-caret-down.svg"></div>
        <div v-if='!toggleSelection && selectedAccount!=""'  class="text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto"><img src="@/modules/services/submodule/mainnetSwap/img/icon-caret-down.svg"></div>
        <img v-if='toggleSelection' @click="selectedAccount='';$emit('update:modelValue', '');" src="@/assets/img/delete.svg" class="h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto">
      </div>
    </div>
  </div>
  <div class='relative'>
  <div v-if='toggleSelection' class='absolute border border-t-0 w-full z-50 bg-white max-h-40 overflow-auto px-3 filter drop-shodow-xl uppercase'>
    <div v-if='accounts.length>0' class="pl-2 pt-4 text-xxs text-gray-400 text-left">{{$t('general.selectAccount')}}</div>
    <div v-else class='text-xxs pt-2 pl-2 pb-2' >{{$t('general.listEmpty')}}</div>
    <div v-for='(items,index) in accounts' :key="items" class="px-2 py-3 flex cursor-pointer items-center" @click="selectAccount(items.label, items.value);$emit('update:modelValue', selectedAddress);$emit('select-account', selectedAddress);" :class='`${(index != accounts.length - 1)?"border-b border-gray-200":""}`'>
      <div v-html="toSvg(items.value, 20, jdenticonConfig)"></div>
      <div class='text-xs ml-2 font-semibold'>{{items.label}}</div>
      <div v-if='items.label!=selectedAccount' class='cursor-pointer text-blue-primary text-xxs mt-0.5 ml-auto font-semibold uppercase'>{{$t('general.select')}}</div>
      <div v-else class='text-gray-500 text-xxs mt-0.5 ml-auto uppercase'>{{$t('general.current')}}</div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { networkState } from '@/state/networkState';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { walletState } from '@/state/walletState';
import { watch, computed, defineComponent, ref, toRefs } from 'vue';
import { toSvg } from "jdenticon";
import { Helper } from "@/util/typeHelper";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { AppState } from '@/state/appState';
import type { Account } from '@/models/account';


  defineEmits([
    'select-account','update:modelValue',
  ])

  const p = defineProps([
    'modelValue',
    'selectDefault',
    'placeholder',
    'otherToken',
    'otherTokenId',
    'name',
    'divisibility'
  ])

    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
  
    const toggleSelection = ref(false);
    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();
    let jdenticonConfig = themeConfig.jdenticonConfig;
    const { otherToken,divisibility,otherTokenId } = toRefs(p)
    const includeMultisig = ref(false);

    const accounts = computed(() =>{
      var accountList:Array<{value:string, label:string}> = [];
      let accounts;
      if(includeMultisig.value){
        if(!walletState.currentLoggedInWallet){
          return []
        }
        const acc = walletState.currentLoggedInWallet.accounts.map((x) => x as Account);
        const otherAcc = walletState.currentLoggedInWallet.others.map((x) => x as Account);
        if (walletState.currentLoggedInWallet.others) {
          const accounts = acc.concat(otherAcc)
          return accounts;
        } 
      }else{
        accounts = walletState.currentLoggedInWallet?.accounts.filter(acc=>acc.getDirectParentMultisig().length==0)
      }
      accounts?.forEach(account => {
        accountList.push({
          value: account.address,
          label: account.name,
        });
      });
      return accountList;
    });

    const selectedAccount = ref('');
    const selectedAddress = ref('');
    const otherTokenBalance = ref(0);
    const nativeTokenBalance = ref(0)
    const selectedImg = ref('');
    const selectAccount = (accountName:string, accountAddress:string) => {
      selectedAccount.value = accountName;
      selectedAddress.value = accountAddress;
      let accounts;
      if(includeMultisig.value){
        if(!walletState.currentLoggedInWallet){
          return []
        }
        const acc = walletState.currentLoggedInWallet.accounts.map((x) => x as Account);
        const otherAcc = walletState.currentLoggedInWallet.others.map((x) => x as Account);
        if (walletState.currentLoggedInWallet.others) {
          const accounts = acc.concat(otherAcc)
          return accounts;
        } 
      }else{
        accounts = walletState.currentLoggedInWallet?.accounts.map((x) => x as Account);
      }
      if(!accounts){
        return
      }
      let acc = accounts.find(account => account.address == accountAddress)
      otherTokenBalance.value = otherToken?.value!='prx.xpx'? //if otherToken
      acc?.assets.find(asset=>asset.idHex==otherTokenId?.value)? //check if found otherToken
      acc.assets.find(asset=>asset.idHex==otherTokenId?.value).amount : 0 //0 if not found
      :0 //if xpx(doesnt matter, wont display)

      nativeTokenBalance.value = accounts.find(account => account.address == accountAddress).balance
      selectedImg.value = toSvg(accountAddress, 25, jdenticonConfig);
      toggleSelection.value = !toggleSelection.value;
    };
    watch(otherToken,(n:string)=>{
      let accounts = walletState.currentLoggedInWallet?.accounts;
      let acc = accounts.find(account => account.address == selectedAddress.value)
      if(acc){
        otherTokenBalance.value = n!='prx.xpx'? 
        acc.assets.find(asset=>asset.idHex==otherTokenId?.value)? 
        acc.assets.find(asset=>asset.idHex==otherTokenId.value).amount : 0 
        :0 //if xpx
        nativeTokenBalance.value = accounts.find(account => account.address == selectedAddress.value).balance
      }
      
    })
    
    const otherTokenBalanceFormatted = computed(() => {
      let balance = Helper.convertToCurrency(otherTokenBalance.value, 0).split('.');
      return '<span class="font-bold text-xs">' + balance[0] + '</span>' + (balance[1]?'.<span class="text-xxs">' + balance[1] + '</span>':'');
    });

    const nativeTokenBalanceFormatted = computed(() => {
      let balance = Helper.convertToCurrency(nativeTokenBalance.value, 0).split('.');
      return '<span class="font-bold text-xs">' + balance[0] + '</span>' + (balance[1]?'.<span class="text-xxs">' + balance[1] + '</span>':'');
    });
</script>

