<template>
  <div class="flex flex-col">
    <div class="border p-2 cursor-pointer w-52 bg-white text-xs flex justify-between" @click="show=!show">
        <div>Account</div>
        <img v-if="!show" src="@/modules/account/img/icon-arrow-down.svg" class="w-3 ml-2 h-3" style="margin-top: 0.12em;">
        <img v-else src="@/modules/account/img/icon-arrow-down.svg" class="w-3 ml-2 h-3" style="margin-top: 0.12em;transform: rotate(180deg);">
    </div>
    <div v-if="show" class="relative z-50">
      <div class="absolute border-t-0 w-96 border bg-white">
        <input v-model="filterQuery" type="text" class="pl-2 pt-4 text-xs outline-none text-black" :placeholder="$t('general.search')">
        <div class="flex justify-between p-2 text-xs">
          <div v-if="selectedAccount.length == 0" @click="selectAll">Select all</div>
          <div v-if="selectedAccount.length > 0" @click="clearAll">Clear all</div>
          <div>{{selectedAccount.length}} SELECTED</div>
        </div>
        <ul class="max-h-40 overflow-auto px-2 filter drop-shadow-xl">
            <li v-for="(acc, index) in filteredAccount" :key="index">
                <input type="checkbox" :id="index" :value="acc" v-model="selectedAccount">
                <label for="index" class="pl-1">{{acc.name}}</label>
            </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'


export default{
    name: "MultiDropdownPortfolioAccountComponent",
    props : ['account'],
    setup(p){
        const selectedAccount = ref([]);
        const show = ref(false);
        const filterQuery = ref("");
        const filteredAccount = computed(() => {
        const query = filterQuery.value.toLowerCase();
          if(filterQuery.value == ""){
          return p.account;
        }
          return p.account.filter(item => {
          return item.name.toLowerCase().includes(query);
      });
    });
        const selectAll = () => {
            selectedAccount.value = p.account
        }
        const clearAll = () => {
            selectedAccount.value = []
        }
        
        return {
            show,
            filterQuery,
            filteredAccount,
            clearAll,
            selectAll,
            selectedAccount
        }
    },
    watch: {
    selectedAccount(val) {
      this.$emit('checked', val)
    }
  }
}

</script>

<style lang="scss" scoped>
.dropdown { 
  position: relative; 
  cursor: pointer;
}

.multiselect {
  position: relative;
  
  ul {
    border: 1px solid #ddd;
    border-top: 0;
    border-radius: 0 0 3px 3px;
    left: 0px;
    padding: 8px 8px;
    position: absolute;
    top: -1rem;
    width: 100%;
    list-style: none;
    max-height: 150px;
    overflow: auto;
  }
}

.overselect {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>