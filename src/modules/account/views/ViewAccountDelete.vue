<template>
<div class="flex justify-between text-sm">
  <div><span class="text-gray-400">Accounts ></span> <span class="text-blue-primary font-bold">Delete</span></div>
  <div>
    <router-link :to="{name: 'ViewAccountDisplayAll'}" class="font-bold" active-class="accounts">View All Accounts</router-link>
  </div>
</div>
<div class='mt-2 py-3 gray-line'>
  <div class="container mx-auto text-center">
    <div class="mx-auto pt-5 lg:px-20">
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-8 items-center">
        <div class="text-left w-full relative">
          <div class="text-xs font-bold mb-1">Account Name:</div>
          <div>{{ accountNameDisplay }}</div>
        </div>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
        <div class="text-left w-full relative">
          <div class="absolute z-20 w-full h-full"></div>
          <div class="text-xs font-bold mb-1">Address:</div>
          <input
            id="address"
            class="text-sm w-full outline-none bg-gray-100 z-10"
            type="text"
            :value="acc.pretty"
          />
        </div>
        <font-awesome-icon icon="copy" @click="copy('address')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
      </div>
      <div class="text-xl mt-10">Would you like to permanently delete this account?</div>
      <div class="xs:w-full inline-block lg:w-4/12 text-center mt-5">
        <div class="w-full flex justify-around">
          <router-link :to="{name: 'ViewAccountDisplayAll'}" class="default-btn w-38 mr-2">Go Back</router-link>
          <ConfirmDeleteAccountModal :name="name" :address="acc.address" />
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref, inject } from 'vue';
import { useRouter } from "vue-router";
import ConfirmDeleteAccountModal from '@/modules/account/components/ConfirmDeleteAccountModal.vue';
import { copyKeyFunc } from '@/util/functions';
import { useToast } from "primevue/usetoast";

export default {
  name: 'ViewAccountDelete',
  components: {
    ConfirmDeleteAccountModal,
  },
  props: {
    name: String,
  },
  setup(p){
    const toast = useToast();
    const appStore = inject("appStore");
    const err = ref(false);
    const accountName = ref(p.name);
    const accountNameDisplay = ref(p.name);
    const router = useRouter();
    const copy = (id) => copyKeyFunc(id, toast);

    const getAcccountDetails = () => {
      return appStore.getAccDetails(p.name);
    };

    // get account details
    const acc = getAcccountDetails();
    acc.pretty = appStore.pretty(acc.address);
    if(acc==-1 && acc.default){
      router.push({ name: "ViewAccountDisplayAll"});
    }

    return {
      err,
      accountNameDisplay,
      accountName,
      acc,
      copy
    };
  },
}
</script>