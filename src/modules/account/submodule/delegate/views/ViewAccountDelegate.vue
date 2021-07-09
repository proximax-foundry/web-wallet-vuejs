<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Accounts ></span> <span class="text-blue-primary font-bold">Delegate</span></div>
    <div>
      <router-link :to="{name: 'ViewAccountDisplayAll'}" class="font-bold" active-class="accounts">View all accounts</router-link>
    </div>
  </div>

  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'>
    <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8 mt-3">
      <div class="text-center w-full">
        <p class="text-sm">Your account is not linked to a delegated account</p>
      </div>
    </div>
    <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-7 items-center">
      <div class="text-left w-full relative">
        <div class="text-xs font-bold mb-1">Linking Account:</div>
        <div>None selected</div>
      </div>
      <div class="inline-block ml-2">
        <SelectAccountTypeModal />
      </div>
    </div>
    <PasswordInput placeholder="Enter Wallet Password" :errorMessage="'Please enter wallet ' + appStore.state.currentLoggedInWallet.name + '\'s password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
    <div class="mt-10">
      <button type="submit" class="default-btn py-1">Link New Account</button>
    </div>
  </div>
</template>
<script>
import { inject, ref } from "vue";
import PasswordInput from '@/components/PasswordInput.vue';
import SelectAccountTypeModal from '@/modules/account/submodule/delegate/components/SelectAccountTypeModal.vue';
// import { useToast } from "primevue/usetoast";

export default {
  name: 'ViewAccountDelegate',
  components: {
    PasswordInput,
    SelectAccountTypeModal,
  },

  setup() {
    // const toast = useToast();
    const appStore = inject("appStore");
    const walletPassword = ref('');
    const showPasswdError = ref(false);
    // const siriusStore = inject("siriusStore");
    return {
      appStore,
      walletPassword,
      showPasswdError,
    };
  },
}
</script>
