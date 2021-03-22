<template>
  <div class="inline-block">
    <button @click="toggleModal = !toggleModal" class="default-btn w-50">Proceed</button>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <div class="w-104">
            <div class="error error_box" v-if="err!=''">{{ err }}</div>
            <div class="mt-10 mb-5"><div class="font-bold text-xl text-gray-900">{{ name }}</div> <span class="text-lg text-gray-700">will be deleted from your device.</span></div>
            <div class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
              <div class="text-center w-full">
                <div class="border border-gray-600 rounded-full w-8 h-8 inline-block relative">
                  <font-awesome-icon icon="exclamation" class="w-5 h-5 text-gray-600 inline-block absolute" style="top:5px; left: 12px"></font-awesome-icon>
                </div>
                <div class="font-bold text-sm">Warning!</div>
                <p class="text-sm mt-3">This action will delete this Account. It cannot be undone. If you have not saved your private keys, access to the accounts contained in this wallet will be permanently lost.</p>
              </div>
            </div>
            <fieldset class="w-full">
              <PasswordInput placeholder="Enter Wallet Password" errorMessage="Password is required to remove account" :showError="showPasswdError" v-model="passwd" icon="lock" />
              <label class="inline-flex items-center mb-10">
                <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="readCheck">
                <span class="ml-2 cursor-pointer text-xs">I have read the warning, understand the consequences, and wish to proceed.</span>
              </label>
              <div>
                <button type="button" class="default-btn mr-5 focus:outline-none" @click="toggleModal = !toggleModal">Cancel</button>
                <button type="submit" class="default-btn py-1 disabled:opacity-50" @click="deleteAccount();" :disabled="disableDelete">Delete Now</button>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>
import { computed, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import PasswordInput from '@/components/PasswordInput.vue'

export default{
  name: 'ConfirmDeleteAccountModal',
  props:['name', 'address'],
  data() {
    return {
      toggleModal: false,
    };
  },

  setup(p){
    const appStore = inject("appStore");
    const router = useRouter();
    const passwd = ref('');
    const showPasswdError = false;
    const err = ref("");
    const readCheck = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const disableDelete = computed(
      () => !(
          passwd.value.match(passwdPattern) && readCheck.value
      )
    );
    const deleteAccount = () => {
      var a = appStore.deleteAccount(passwd.value, p.address);
      if(a>0){
        // this.emitter.emit("DELETE_WALLET", true);
        router.push({ name: 'ViewDisplayAllAccounts', params: {deleteAccount: 'success' } });
      }else if(a == 0){
        err.value = "Password is incorrect.";
      }else{
        err.value = "Unable to remove account";
      }
    };
    return {
      err,
      passwd,
      readCheck,
      showPasswdError,
      disableDelete,
      deleteAccount,
    };
  },

  components: {
    PasswordInput
  }
}
</script>
