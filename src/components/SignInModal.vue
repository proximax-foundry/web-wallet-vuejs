<template>
  <div>
    <a href="#" @click="toggleModal = !toggleModal" class=" block big-default-btn my-3 self-center w-full">Sign In</a>
    <transition 
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="fixed overflow-x-hidden overflow-y-auto inset-0 flex mt-10 z-50">
        <div class="relative mx-auto">
          <div class="popup-box">
            <div class="delete-position">
              <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
            </div>
            <div class="w-104">
              <h1 class="default-title font-bold my-10">Sign in to your Wallet</h1>
              <form action="">
                <fieldset class="w-full">
                  <SelectInput placeholder="Select a Wallet" errorMessage="Select a Wallet" v-model="selectedWallet" :options="wallets"  />
                  <PasswordInput placeholder="Enter Wallet Password" errorMessage="Password Required" v-model="walletPassword" icon="lock" />
                  <div class="mt-10">
                    <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">Clear</button>
                    <button type="submit" class="default-btn py-1 disabled:opacity-50" disabled>Sign In</button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div v-if="toggleModal" class="fixed inset-0 z-40 opacity-90 bg-blue-primary" @click="toggleModal = !toggleModal">
    </div>
  </div>
</template>

<script>
import SelectInput from '@/components/SelectInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'

export default{
  name: 'SignInModal',
  data() {
    return {
      toggleModal: false,
      disableLogin: true,
      selectedWallet: 0,
      walletPassword: '',
      wallets: [
        { id: 1, text: "wallet 1", val: "w1" },
        { id: 2, text: "wallet 2", val: "w2" },
      ],
    };
  },

  methods: {
    clearInput: function() {
      this.selectedWallet = 0;
      this.walletPassword = "";
      this.emitter.emit("CLEAR_SELECT", this.selectedWallet);
      this.emitter.emit("CLEAR_PASSWORD", this.walletPassword);
    }
  },

  components: {
    SelectInput,
    PasswordInput
  }
}
</script>
