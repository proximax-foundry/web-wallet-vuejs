<template>
  <div class="lg:ml-60 mt-10 lg:mt-16 flex-grow px-5 pt-5">
    <div class="w-11/12 ml-auto mr-auto">
      <div class="flex">
        <div class='py-3 px-6 lg:flex items-center'>
          <div class="text-xl mr-2 mb-2">Portfolio</div>
          <MultiDropdownPortfolioAccountComponent :account="accounts" @checked='onCheck' />
        </div>
      </div>
    </div>
    <div class='mt-2 py-3 '>
      <div class="w-11/12 ml-auto mr-auto border-2">
        <PortfolioAssetDataTable :assets="mosaics" />
      </div>
    </div>
    <div class="mb-36" />
  </div>
</template>

<script setup lang="ts">
import PortfolioAssetDataTable from '@/modules/services/submodule/portfolio/components/PortfolioAssetDataTable.vue';
import { walletState } from '@/state/walletState';
import { computed, ref } from "vue";
import MultiDropdownPortfolioAccountComponent from '@/modules/services/submodule/portfolio/components/MultiDropdownPortfolioAccountComponent.vue'
import type { Account } from '@/models/account';

const selectedAccount = ref<Account[]>([])
const accounts = computed(
  () => {
    if (!walletState.currentLoggedInWallet) {
      return []
    }
    const accounts = walletState.currentLoggedInWallet.accounts.map((acc) => acc as Account)
    const filteredOthers = walletState.currentLoggedInWallet.others.filter(acc => acc.type != "DELEGATE")
    const otherAccounts = filteredOthers.map((acc) => acc as Account)
    return accounts.concat(otherAccounts)

  }
);

const onCheck = (val: Account[]) => {
  selectedAccount.value = val
}

const mosaics = computed(() => {
  if (selectedAccount.value.length) {
    var walletAsset: { i: number, id: string, name: string, balance: number }[] = [];
    var totalAsset = []
    for (let j = 0; j < selectedAccount.value.length; j++) {
      selectedAccount.value[j].assets.forEach((i, index) => {
        walletAsset.push({
          i: index,
          id: i.idHex,
          name: (i.namespaceNames.length > 0 ? i.namespaceNames[0] : ""),
          balance: i.amount,
        });
      });
    }
    totalAsset = walletAsset.reduce((obj: { i: number, id: string, name: string, balance: number }[], item) => {
      let find = obj.find(i => i.id === item.id);
      let _d = {
        ...item
      }
      find ? (find.balance += item.balance) : obj.push(_d);
      return obj;
    }, [])
    return totalAsset
  } else {
    return []
  }
})

</script>