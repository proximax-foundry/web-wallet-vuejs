<template>
  <div>
    <div class='my-4 w-11/12 ml-auto mr-auto flex flex-col sm:flex-row justify-between'>
      <LabelComponent />
      <div class="absolute invisible 2xl:visible text-gray-500 mt-1 explicitLeft">Labels</div>
      <router-link :to="{ name: 'ViewAccountCreateSelectType' }">
        <div class="mt-3 sm:mt-0 text-center w-44 text-white bg-blue-primary rounded-md font-semibold text-xs p-2">+
          {{ $t('general.createNewAcc') }}</div>
      </router-link>
    </div>
    <div class='mt-2 py-3 '>
      <div class="w-11/12 ml-auto mr-auto flex flex-col gap-3">
        <div class="flex items-center">
          <font-awesome-icon icon="search" class="text-blue-link mr-1"></font-awesome-icon>
          <input v-model="filterQuery" type="text" class="py-2 px-2 outline-none text-xs text-black"
            :placeholder="$t('general.search')">
        </div>
        <AccountTile :key="index" :account="item" v-for="(item, index) in filteredAccounts" />
      </div>
    </div>
    <div class="mb-36" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, getCurrentInstance } from "vue";
import AccountTile from '@/modules/account/components/AccountTile.vue';
import { walletState } from '@/state/walletState';
import LabelComponent from '@/modules/account/components/LabelComponent.vue'

import type { Account } from "@/models/account";

const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;


const labelNames = ref<string[]>([])
const accounts = computed(
  () => {
    const wallet = walletState.currentLoggedInWallet
    if (!wallet) {
      return null
    }
    if (wallet.others) {
      const acc = wallet.accounts.map(
      (x) => x as Account
    );
    const otherAcc = wallet.others.map(
      (x) => x as Account
    );
      const concatOther:Account[] = acc.concat(otherAcc)
      let filteredAcc: Account[] = []
      labelNames.value.forEach(name => {
        let findLabel = wallet.labels.find(label => label.name == name)
        if (findLabel) {
          findLabel.addresses.forEach(address => {
            let findAcc = concatOther.find(acc => acc.address == address)
            if (findAcc) {
              filteredAcc.push(findAcc)
            }
          })
        }
      })
      filteredAcc = Array.from(new Set(filteredAcc))
      if (labelNames.value.length) {
        return filteredAcc
      } else {
        return concatOther
      }
    } else {
      const acc = wallet.accounts.map(
      (x) => x as Account
    );
      let filteredAcc: Account[] = []
      labelNames.value.forEach(name => {
        let findLabel = wallet.labels.find(label => label.name == name)
        if (findLabel) {
          findLabel.addresses.forEach(address => {
            let findAcc = acc.find(acc => acc.address == address)
            if (findAcc) {
              filteredAcc.push(findAcc)
            }
          })
        }

      })
      filteredAcc = Array.from(new Set(filteredAcc))
      if (labelNames.value.length) {
        return filteredAcc
      } else {
        return acc
      }
    }

  }
);

emitter.on('filterByLabel', (e: string[]) => {
  labelNames.value = e
})

const filterQuery = ref("");
const filteredAccounts = computed(() => {
  const query = filterQuery.value.toLowerCase();
  if (filterQuery.value == "") {
    return filterDuplicate(accounts.value);
  }
  if(!accounts.value){
    return []
  }
  return accounts.value.filter(item => {
    return item.name.toLowerCase().includes(query) || item.address.toLowerCase().includes(query.replace(/-/g, ""))
  });
});

function filterDuplicate(data :Account[] | null) :Account[] {
  if (!data) {
    return []
  }
  else {
    var result = data.reduce((unique :Account[], o: Account) => {
      if (!unique.some(obj => obj.address === o.address && obj.name === o.name)) {
        unique.push(o);
      }
      return unique;
    }, []);
    return result
  }
}


</script>

<style scoped>
.explicitLeft {
  @media (min-width: 1024px) {
    margin-left: 40rem
  }

}
</style>