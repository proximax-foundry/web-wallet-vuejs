<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Address Book ></span> <span class="text-blue-primary font-bold">Add Contacts</span></div>
    <div>
      <router-link :to="{name: 'ViewServicesAddressBook'}" class="font-bold" active-class="accounts">Address Book</router-link> | 
      <router-link :to="{name: 'ViewServices'}" class="font-bold" active-class="accounts">All Services</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'>
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
import { computed, ref, watch } from 'vue';
import TextInput from '@/components/TextInput.vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { AddressBook } from '@/models/addressBook';
import { AddressBookUtils } from '@/util/addressBookUtils';
import { Wallet } from "@/models/wallet";
import { Wallets } from "@/models/wallets";
import { walletState } from '@/state/walletState';
import { WalletStateUtils } from '@/state/utils/walletStateUtils';

export default {
  name: 'ViewCreateContacts',
  components: {
    TextInput
  },
  setup(){
    const toast = useToast();
    // const appStore = inject("appStore");
    const contactName = ref('');
    const address = ref('');
    const err = ref('');
    const verifyAdd = ref(false);
    const addMsg = ref('');
    const router = useRouter();

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
      const defaultAccount = walletState.currentLoggedInWallet.accounts.find((account) => account.default == true);
      const verifyContactAddress = AddressBookUtils.verifyNetworkAddress(defaultAccount.address, address.value);
      verifyAdd.value = verifyContactAddress.isPassed;
      addMsg.value = verifyContactAddress.errMessage;
    });

    const SaveContact = () => {
      const formattedAddress = address.value.split('-').join('');
      let addressBook = new AddressBook(contactName.value, formattedAddress);
      const wallet = walletState.currentLoggedInWallet;

      // check for existing account address in wallet
      const accountAddIndex = wallet.accounts.findIndex((account) => account.address == formattedAddress);
      // check for existing account name in wallet
      const accountNameIndex = wallet.accounts.findIndex((account) => account.name.toLowerCase() == contactName.value.toLowerCase());
      const contactAddIndex = (wallet.contacts!=undefined)?wallet.contacts.findIndex((contact) => contact.address == formattedAddress):(-1);
      const contactNameIndex =(wallet.contacts!=undefined)?wallet.contacts.findIndex((contact) => contact.name.toLowerCase() == contactName.value.toLowerCase()):(-1);

      if(contactAddIndex >= 0 || accountAddIndex >= 0){
        err.value = 'Address is already exists in account or address book.';
      }else if( contactNameIndex >= 0 || accountNameIndex >= 0 ){
        err.value = 'Name is already exists in account or address book.';
      }else{
        walletState.currentLoggedInWallet.addAddressBook(addressBook);
        walletState.wallets.savetoLocalStorage();
        err.value = '';
        contactName.value = '';
        address.value = '';
        toast.add({severity:'info', summary: 'Address Book', detail: 'New contact added to Address Book', group: 'br', life: 5000});
        router.push({ name: 'ViewServicesAddressBook' });
      }
    }

    const clearInput =() => {
      contactName.value = '';
      address.value = '';
      err.value = '';
    };

    return {
      err,
      addErr,
      contactName,
      address,
      disableSave,
      showAddErr,
      showNameErr,
      SaveContact,
      clearInput,
    }
  },

}
</script>
