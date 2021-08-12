<template>
<div class="flex justify-between text-xs sm:text-sm">
  <div><span class="text-gray-400">{{$t('common.account',2)}} ></span> <span class="text-blue-primary font-bold">{{$t('common.delete')}}</span></div>
  <div>
    <router-link :to="{name: 'ViewAccountDisplayAll'}" class="font-bold" active-class="accounts">{{$t('common.viewAllAccounts')}}</router-link>
  </div>
</div>
<div class='mt-2 py-3 gray-line'>
  <div class="container mx-auto text-center">
    <div class="mx-auto pt-5 lg:px-20">
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-8 items-center">
        <div class="text-left w-full relative">
          <div class="text-xs font-bold mb-1">{{$t('common.name')}}:</div>
          <div>{{ accountNameDisplay }}</div>
        </div>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
        <div class="text-left w-full relative">
          <div class="absolute z-20 w-full h-full"></div>
          <div class="text-xs font-bold mb-1">{{$t('common.address')}}:</div>
          <div
            id="address"
            class="text-sm w-full outline-none bg-gray-100 z-10"
            :copyValue="prettyAddress" copySubject="Address"
          >{{prettyAddress}}</div>
        </div>
        <font-awesome-icon icon="copy" @click="copy('address')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
      </div>
      <div class="text-xl mt-10">{{$t('accounts.deleteAccountQuestion')}}</div>
      <div class="xs:w-full inline-block lg:w-4/12 text-center mt-5">
        <div class="w-full flex justify-around">
          <router-link :to="{name: 'ViewAccountDisplayAll'}" class="default-btn w-38 mr-2">{{$t('common.goBack')}}</router-link>
          <ConfirmDeleteAccountModal :name="name" :address="acc.address" />
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import ConfirmDeleteAccountModal from '@/modules/account/components/ConfirmDeleteAccountModal.vue';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { walletState } from '@/state/walletState';
import { Helper } from '@/util/typeHelper';

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
    const err = ref(false);
    const accountName = ref(p.name);
    const accountNameDisplay = ref(p.name);
    const router = useRouter();
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);

      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    const getAcccountDetails = () => {
      const account = walletState.currentLoggedInWallet.accounts.find((accname) => accname.name == (p.name));
      const other_acc = walletState.currentLoggedInWallet.others.find((accname) => accname.name == p.name);
      if(!account){
        if(other_acc){
          return other_acc;
        }
      }else{
        return account;
      }
    };

    // get account details
    const acc = getAcccountDetails();
    const prettyAddress = Helper.createAddress(acc.address).pretty();

    if(acc==-1 && acc.default){
      router.push({ name: "ViewAccountDisplayAll"});
    }

    return {
      err,
      accountNameDisplay,
      accountName,
      prettyAddress,
      acc,
      copy
    };
  },
}
</script>