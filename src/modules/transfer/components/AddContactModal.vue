<template>
  <div>
    <transition enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp">
      <div v-if="toggleModal" class="popup-outer fixed flex z-50" style="top: 110px !important">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="isAddContactQues = true; closeModal()">
            </font-awesome-icon>
          </div>
          <div class="w-104" v-if="isAddContactQues && !isSuccessAdded">
            <h1 class="text-md text-center my-5">{{ $t('transfer.addContacts') }}</h1>
            <div type="button" class="blue-btn py-2  font-semibold cursor-pointer text-center ml-auto mr-auto w-7/12"
              @click="proceed()">{{ $t('general.yes') }}</div>
            <div type="button" class="text-center cursor-pointer text-xs font-semibold text-blue-link mt-2"
              @click="closeModal()">{{ $t('general.no') }}</div>
          </div>
          <div class="w-104" v-if="!isAddContactQues && !isSuccessAdded">
            <h1 class="default-title font-bold mt-4 text-center">
              {{ $t('transfer.addContacts') }}
            </h1>
            <form @submit.prevent="$event.preventDefault()" class="mt-4">
              <fieldset class="w-full">
                <div class="error error_box mb-5" v-if="err != ''">
                  {{ err }}
                </div>
                <TextInput class="mb-3" :placeholder="$t('general.name')" :errorMessage="$t('general.nameRequired')"
                  v-model="contactName" icon="id-card-alt" :showError="showNameErr" />
                <TextInput :placeholder="$t('general.address')" v-model="address" icon="wallet" :showError="showAddErr"
                  :disabled="true" />
                <div class="mt-4 text-center">
                  <!-- <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput()">
                    {{$t('signin.clear')}}
                  </button> -->
                  <button type="submit"
                    class="blue-btn py-2  font-semibold cursor-pointer text-center ml-auto mr-auto w-7/12"
                    :disabled="disableSave" @click="SaveContact()">
                    {{ $t('general.save') }}
                  </button>
                  <div class="text-center cursor-pointer text-xs font-semibold text-blue-link mt-2"
                    :disabled="disableSave" @click="isAddContactQues = true">
                    {{ $t('general.cancel') }}
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
          <div class="w-104" v-if="isSuccessAdded">
            <h1 class="text-md my-5">
              {{ $t('transfer.successfullySaved', { name: contactName }) }}
            </h1>
          </div>
        </div>
      </div>
    </transition>
    <!-- <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div> -->
    <div v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-gray-100 z-20"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance } from "vue";
import TextInput from "@/components/TextInput.vue";
import { walletState } from "@/state/walletState";
import { AddressBook } from "@/models/addressBook";
import { useI18n } from 'vue-i18n';
import { AppState } from "@/state/appState";
import { Address } from "tsjs-xpx-chain-sdk";


const p = defineProps({
  toggleModal: Boolean,
  saveAddress: {
    type: String,
    required: true
  },
})
const { t } = useI18n();
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const contactName = ref("");
const address = ref(p.saveAddress);
const publicKey = ref<string | null>("");
const err = ref("");
const verifyAdd = ref(true);
// const addMsg = ref('');
const isAddContactQues = ref(true);
const isSuccessAdded = ref(false);
const disableSave = computed(
  () => !(verifyAdd.value && contactName.value != "")
);

const showAddErr = computed(() => !verifyAdd.value && address.value != "");

const showNameErr = ref(false);

const getPublicKey = async (address: string) => {
  if (!AppState.chainAPI) {
    return
  }
  try {
    let accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(address))
    if (accInfo.publicKey == "0000000000000000000000000000000000000000000000000000000000000000") {
      publicKey.value = null
    }
    else {
      publicKey.value = accInfo.publicKey
    }
  }
  catch {
    publicKey.value = null
  }
}


const SaveContact = async () => {
  if (!walletState.currentLoggedInWallet) {
    return
  }
  if (contactName.value !== '' && address.value !== '') {
    let contact = walletState.currentLoggedInWallet.contacts
    if (contact.find(item => item.name == contactName.value)) {
      err.value = t('addressBook.nameExist')
    } else {
      await getPublicKey(address.value)
      walletState.currentLoggedInWallet.addAddressBook(
        new AddressBook(contactName.value, address.value, '-none-', publicKey.value)
      );
      walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
      err.value = "";
      isSuccessAdded.value = true;
    }
  }
};


const closeModal = () => {

  emitter.emit("CLOSE_CONTACT_MODAL", false);
};

const proceed = () => (isAddContactQues.value = false);

watch(
  () => p.saveAddress,
  () => (address.value = p.saveAddress)
);


</script>
