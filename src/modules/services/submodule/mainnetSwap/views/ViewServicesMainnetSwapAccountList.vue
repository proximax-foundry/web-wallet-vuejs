<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Mainnet Swap ></span> <span class="text-blue-primary font-bold">Accounts List</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">All Services</router-link>
    </div>
</div>
  <div class='mt-2 py-3 gray-line px-0 lg:px-10 xl:px-80'>
    <p class="text-sm my-5">This is a list of your imported NIS1 accounts available in this wallet.</p>
    <div class="text-lg mt-10">Please select a NIS1 account</div>
    <div class="mt-5 flex justify-between bg-gray-200 rounded-2xl p-3 text-left">
      <div>
        <div>accountName</div>
        <div>account address</div>
      </div>
      <div class="self-center relative bg-gray-400 rounded-lg p-2 flex justify-between hover:bg-blue-primary cursor-pointer">
        <div class="text-tsm inline-block text-gray-100 mr-3 relative select-text">Select</div>
        <font-awesome-icon icon="check" class="text-gray-100 w-7 h-7"></font-awesome-icon>&nbsp;
      </div>
    </div>
  </div>
</template>
<script>
// import { inject, getCurrentInstance, ref } from "vue";
// import { useToast } from "primevue/usetoast";

export default {
  name: 'ViewServicesMainnetSwapAccountList',
  setup() {
    // const toast = useToast();
    // const appStore = inject("appStore");


    return {
    };
  },
}
</script>
<style lang="scss" scoped>
.select-text{
  top: 5px;
}
</style>