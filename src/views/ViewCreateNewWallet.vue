<template>
  <div class="container mx-auto text-center">
    <h1 class="font-bold big-title">Create Wallet</h1>
      <div class="mx-auto page-title-gray-line pt-5">
        <div class="w-10/12 lg:w-8/12 self-center inline-block">
          <SelectInput placeholder="Select network" errorMessage="Select a Network" v-model="selectedNetwork" :options="networks" />
          <TextInput placeholder="Wallet Name" errorMessage="Insert wallet name" v-model="walletName" icon="wallet" />
          <div class="grid xs:grid-cols-1 md:grid-cols-2">
            <PasswordInput placeholder="Enter a New Password" errorMessage="Min. length 8, max. length 30." icon="lock" v-model="walletPasword" class="mr-1" />
            <PasswordInput placeholder="Confirm New Password" errorMessage="Password doesn't match." icon="lock" v-model="walletConfirmPassword" class="ml-1" />
          </div>
          <div class="mt-10">
            <button type="button" class="default-btn mr-5" @click="clearInput();">Clear</button>
            <button type="submit" class="default-btn disabled:opacity-50" disabled>Create</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import SelectInput from '@/components/SelectInput.vue'
import TextInput from '@/components/TextInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'

export default {
  name: 'ViewCreateNewWallet',
  components: {
    SelectInput, TextInput, PasswordInput
  },
  data() {
    return {
      selectedNetwork: 'pub-test',
      walletName: '',
      walletPasword: '',
      walletConfirmPassword: '',
      networks: [
        { id: 1, text: "PUBLIC TEST", val: "pub-test" },
      ],
    };
  },

  methods: {
    clearInput: function() {
      this.selectedNetwork = 0;
      this.walletName = '';
      this.walletPassword = "";
      this.walletConfirmPassword = "";
      this.emitter.emit("CLEAR_SELECT", 0);
      this.emitter.emit("CLEAR_TEXT", "");
      this.emitter.emit("CLEAR_PASSWORD", "");
    }
  },

}
</script>
