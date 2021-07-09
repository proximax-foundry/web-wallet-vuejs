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
            <div class="mt-10 mb-5"><div class="font-bold text-xl text-gray-900">{{ name }}</div> <span class="text-lg text-gray-700">{{$t('deletewallet.deletemessage')}}</span></div>
            <div class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
              <div class="text-center w-full">
                <div class="border border-gray-600 rounded-full w-8 h-8 inline-block relative">
                  <font-awesome-icon icon="exclamation" class="w-5 h-5 text-gray-600 inline-block absolute" style="top:5px; left: 12px"></font-awesome-icon>
                </div>
                <div class="font-bold text-sm">{{$t('deletewallet.warning')}}</div>
                <p class="text-sm mt-3">{{$t('deletewallet.warningmessage')}}</p>
              </div>
            </div>
            <fieldset class="w-full">
              <label class="inline-flex items-center mb-10">
                <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="readCheck">
                <span class="ml-2 cursor-pointer text-xs">{{$t('deletewallet.deleteconsent')}}</span>
              </label>
              <div>
                <button type="button" class="default-btn mr-5 focus:outline-none" @click="toggleModal = !toggleModal">{{$t('deletewallet.cancel')}}</button>
                <button type="submit" class="default-btn py-1 disabled:opacity-50" @click="deleteAccount();" :disabled="disableDelete">{{$t('deletewallet.delete')}}</button>
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
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { walletState } from '@/state/walletState';

export default{
  name: 'ConfirmDeleteAccountModal',
  props:['name', 'address'],
  data() {
    return {
      toggleModal: false,
    };
  },

  setup(p){
    const router = useRouter();
    const err = ref("");
    const readCheck = ref(false);
    const disableDelete = computed(
      () => !(
        readCheck.value
      )
    );

    const deleteAccount = () => {
      const accountIndex = walletState.currentLoggedInWallet.accounts.findIndex((element) => element.name == p.name);
      if(accountIndex > -1){
        walletState.currentLoggedInWallet.removeAccount(p.name);
        walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
        router.push({ name: 'ViewAccountDisplayAll', params: {deleteAccount: 'success' } });
      }else{
        err.value = "Unable to remove account";
      }
    };

    return {
      err,
      readCheck,
      disableDelete,
      deleteAccount,
    };
  },
}
</script>
