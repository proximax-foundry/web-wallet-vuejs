<template>
  <div class="flex flex-col">
    <div class="border p-2 cursor-pointer w-40 bg-white text-xs flex justify-between" @click="show = !show">
      <div>Account</div>
      <img v-if="!show" src="@/modules/account/img/icon-arrow-down.svg" class="w-3 ml-2 h-3" style="margin-top: 0.12em;">
      <img v-else src="@/modules/account/img/icon-arrow-down.svg" class="w-3 ml-2 h-3"
        style="margin-top: 0.12em;transform: rotate(180deg);">
    </div>
    <div v-if="show" class="relative z-50">
      <div class="absolute w-60 border bg-white">
        <input v-model="filterQuery" type="text" class="pl-2 pt-2 text-xs outline-none text-black"
          :placeholder="$t('general.search')">
        <div class="flex justify-between p-2 text-xs">
          <div v-if="selectedAccount">
            <div v-if="selectedAccount.length == 0" @click="selectAll">Select all</div>
            <div v-if="selectedAccount.length > 0" @click="clearAll">Clear all</div>
            <div>{{ selectedAccount.length }} SELECTED</div>
          </div>
        </div>
        <ul class="max-h-40 overflow-auto px-2 filter drop-shadow-xl">
          <li v-for="(acc, index) in filteredAccount" :key="index">
            <input type="checkbox" :id?="index" :value="acc" v-model="selectedAccount">
            <label for="index" class="pl-1">{{ acc.name }}</label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Account } from '@/models/account';
import { ref, computed, watch } from 'vue'

const props = defineProps({
  account: {
    type: Array<Account>,
    required: true
  }
})
const emit = defineEmits(['checked'])

const selectedAccount = ref<Account[]>([]);
const show = ref(false);
const filterQuery = ref("");
const filteredAccount = computed(() => {
  const query = filterQuery.value.toLowerCase();
  if (filterQuery.value == "") {
    return props.account;
  }
  return props.account?.filter(item => {
    return item.name.toLowerCase().includes(query);
  });
});
const selectAll = () => {
  selectedAccount.value = props.account
}
const clearAll = () => {
  selectedAccount.value = []
}

watch(selectedAccount, (val) => {
  emit('checked', val)
})


</script>