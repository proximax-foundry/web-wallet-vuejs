<template>
  <div>
    <transition enter-active-class="animate__animated animate__fadeInDown" leave-active-class="animate__animated animate__fadeOutUp">
      <div v-if="toggleModal" class="popup-outer absolute flex z-50" style="top: 110px !important">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="closeModal()">
            </font-awesome-icon>
          </div>
          <div class="w-104" v-if="isAddContactQues && !isSuccessAdded">
            <h1 class="text-md my-5">{{$t('services.addcontact')}}</h1>
            <div>
              <button type="button" class="default-btn mr-5 focus:outline-none" @click="closeModal()">
                {{$t('services.no')}}
              </button>
              <button type="button" class="default-btn py-1" @click="proceed()">
                {{$t('services.yes')}}
              </button>
            </div>
          </div>
          <div class="w-104" v-if="!isAddContactQues && !isSuccessAdded">
            <h1 class="default-title font-bold my-10">
              {{$t('services.addcontacts')}}
            </h1>
            <form @submit.prevent="create" class="mt-10">
              <fieldset class="w-full">
                <div class="error error_box mb-5" v-if="err != ''">
                  {{ err }}
                </div>
                <TextInput :placeholder="$t('services.name')" :errorMessage="$t('services.namevalidation')" v-model="contactName" icon="id-card-alt" :showError="showNameErr"/>
                <TextInput :placeholder="$t('createsuccessful.address')" v-model="address" icon="wallet" :showError="showAddErr" :disabled="true"/>
                <div class="mt-10">
                  <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput()">
                    {{$t('signin.clear')}}
                  </button>
                  <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableSave" @click="SaveContact()">
                    {{$t('accounts.save')}}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
          <div class="w-104" v-if="isSuccessAdded">
            <h1 class="text-md my-5">
             {{$t('services.contact')}} <b>{{ contactName }}</b> {{$t('services.successfullysaved')}}
            </h1>
          </div>
        </div>
      </div>
    </transition>
    <!-- <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div> -->
    <div
      v-if="toggleModal"
      class="fixed inset-0 bg-opacity-90 bg-blue-primary"
    ></div>
  </div>
</template>

<script >
import { computed, ref, watch, getCurrentInstance, inject } from "vue";
import TextInput from "@/components/TextInput.vue";
import { walletState } from "@/state/walletState";
import { AddressBook } from "@/models/addressBook";

export default {
  name: "SignInModal",
  props: {
    toggleModal: Boolean,
    saveAddress: String,
  },

  setup(p) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const contactName = ref("");
    const address = ref(p.saveAddress);
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

    // watch(address, ()=>{
    //   const verifyAdd = verifyAddress(appStore.getCurrentAdd(appStore.state.currentLoggedInWallet.name), address.value);
    //   verifyAdd.value = verifyAdd.verify.value;
    //   addMsg.value = verifyAdd.msg.value;
    // });

    const SaveContact = () => {
      if (contactName.value !== ''&& address.value !== ''){
      walletState.currentLoggedInWallet.addAddressBook(
        new AddressBook(contactName.value, address.value)
      );

      err.value = "";
      isSuccessAdded.value = true;
      setTimeout(() => {
        contactName.value = "";
        emitter.emit("CLOSE_MODAL", false);
        isAddContactQues.value = true;
        isSuccessAdded.value = false;
      }, 2500);
    }
    };

    const clearInput = () => (contactName.value = "");

    const closeModal = () => {
      emitter.emit("CLOSE_MODAL", false);
    };

    const proceed = () => (isAddContactQues.value = false);

    watch(
      () => p.saveAddress,
      () => (address.value = p.saveAddress)
    );

    return {
      err,
      contactName,
      address,
      disableSave,
      showAddErr,
      showNameErr,
      SaveContact,
      isAddContactQues,
      closeModal,
      proceed,
      clearInput,
      isSuccessAdded,
    };
  },

  components: {
    TextInput,
  },
};
</script>
