<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">Address Book ></span> <span class="text-blue-primary font-bold">Add Contacts</span></div>
    <div>
      <router-link to="/" class="font-bold">List</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center'>
    <form @submit.prevent="create" class="mt-10">
      <fieldset class="w-full">
        <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
        <TextInput placeholder="Name" errorMessage="Name required" v-model="contactName" icon="id-card-alt" :showError="showNameErr" />
        <TextInput placeholder="Address" :errorMessage="addErr" v-model="address" icon="wallet" :showError="showAddErr" />
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">Clear</button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableSave" @click="SaveContact()">Save</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>
import { computed, ref, inject, watch } from 'vue';
import TextInput from '@/components/TextInput.vue';
import { verifyAddress } from '../util/functions.js';

export default {
  name: 'ViewCreateAccount',
  components: {
    TextInput
  },
  setup(){
    const appStore = inject("appStore");
    // const siriusStore = inject("siriusStore");
    const contactName = ref('');
    const address = ref('');
    const err = ref('');
    const verifyAdd = ref(false);
    const addMsg = ref('');

    const disableSave = computed(
      () => !(
        verifyAdd.value && contactName.value != ''
      )
    );

    const showAddErr = computed(
      () => !verifyAdd.value && address.value != ''
    );

    const showNameErr = computed(
      () => address.value != '' && contactName.value == ''
    );

    const addErr = computed(
      () => {
        let addErrDefault = 'Address required';
        return addMsg.value?addMsg.value:addErrDefault;
      }
    );

    watch(address, ()=>{
      const verifyContactAddress = verifyAddress(appStore.getCurrentAdd(appStore.state.currentLoggedInWallet.name), address.value);
      verifyAdd.value = verifyContactAddress.isPassed.value;
      addMsg.value = verifyContactAddress.errMessage.value;
    });

    const SaveContact = () => {
      let added = appStore.saveContact(contactName.value, address.value);
      if(added===true){
        err.value = '';
        contactName.value = '';
        address.value = '';
        alert('Contact added');
      }else{
        err.value = added;
      }
    }

    return {
      err,
      addErr,
      contactName,
      address,
      disableSave,
      showAddErr,
      showNameErr,
      SaveContact
    }
  },

}
</script>
