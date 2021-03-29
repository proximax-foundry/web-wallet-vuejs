<template>
  <div>
    <a href="#" @click="toggleModal = !toggleModal" class="block big-default-btn my-3 self-center w-full">Sign In</a>
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
            <h1 class="default-title font-bold my-10">Sign in to your Wallet</h1>
            <form @submit.prevent="login">
              <fieldset class="w-full">
                <div class="error error_box" v-if="err!=''">{{ err }}</div>
                <SelectInput placeholder="Select a Wallet" errorMessage="Select a Wallet" v-model="selectedWallet" :options="wallets" @default-selected="selectedWallet=0" />
                <PasswordInput placeholder="Enter Wallet Password" errorMessage="Password Required" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
                <div class="mt-10">
                  <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">Clear</button>
                  <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableSignin">Sign In</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>
import { computed, inject, ref } from 'vue';
import { useRouter } from "vue-router";
import SelectInput from '@/components/SelectInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'

export default{
  name: 'SignInModal',
  data() {
    return {
      toggleModal: false,
    };
  },

  setup(){
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const router = useRouter();
    const err = ref("");
    const walletPassword = ref("");
    const selectedWallet = ref("0");
    const showPasswdError = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const disableSignin = computed(
      () => !(
        walletPassword.value.match(passwdPattern) &&
        selectedWallet.value != '0'
      )
    );
    const wallets = computed(
      () =>{
        var w = [];
        appStore.state.wallets.forEach((i, index)=>{
          w.push({
            val: i.name,
            text: i.name,
            id: (index+1),
          });
        });
        return w;
      }
    );

    const login = () => {
      // if (disableLogin.value) {
      //   err.value = "Please enter a valid password";
      //   loading.value = false;
      //   return;
      // }

      var result = appStore.loginToWallet(selectedWallet.value, walletPassword.value, siriusStore.accountHttp, siriusStore.namespaceHttp);
      if (result == -1) {
        err.value = "Invalid wallet name";
      } else if (result == 0) {
        err.value = "Invalid password";
      } else {
        router.push({ path: "/dashboard" });
      }
    };

    return{
      err,
      wallets,
      walletPassword,
      selectedWallet,
      showPasswdError,
      disableSignin,
      login,
    };
  },

  methods: {
    clearInput: function() {
      this.selectedWallet = 0;
      this.walletPassword = "";
      this.emitter.emit("CLEAR_SELECT", this.selectedWallet);
      this.emitter.emit("CLEAR_PASSWORD", this.walletPassword);
    },
  },

  components: {
    SelectInput,
    PasswordInput
  }
}
</script>
