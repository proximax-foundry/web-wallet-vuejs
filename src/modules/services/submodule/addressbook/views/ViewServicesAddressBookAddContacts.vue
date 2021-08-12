<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('services.addressBook')}} ></span> <span class="text-blue-primary font-bold">{{$t('services.addContacts')}}</span></div>
    <div>
      <router-link :to="{name: 'ViewServicesAddressBook'}" class="font-bold" active-class="accounts">{{$t('services.addressBook')}}</router-link> | 
      <router-link :to="{name: 'ViewServices'}" class="font-bold" active-class="accounts">{{$t('common.allServices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'>
    <form @submit.prevent="SaveContact" class="mt-10">
      <fieldset class="w-full">
        <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
        <TextInput :placeholder="$t('common.name')" :errorMessage="$t('addressBook.nameRequired')" v-model="contactName" icon="id-card-alt" :showError="showNameErr" />
        <TextInput :placeholder="$t('common.address')" :errorMessage="addErr" v-model="address" icon="wallet" :showError="showAddErr" />
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">{{$t('common.clear')}}</button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableSave" @click="SaveContact()">{{$t('common.save')}}</button>
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
import {useI18n} from 'vue-i18n'
export default {
  name: 'ViewCreateContacts',
  components: {
    TextInput
  },
  setup(){
    const {t} = useI18n();
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
        let addErrDefault = t('addressBook.addressRequired');
        return addMsg.value?addMsg.value:addErrDefault;
      }
    );

    watch(address, ()=>{
      if(!walletState.currentLoggedInWallet){
        return;
      }
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
        err.value = t('addressBook.addressRequired');
      }else if( contactNameIndex >= 0 || accountNameIndex >= 0 ){
        err.value = t('addressBook.nameRequired');
      }else{
        walletState.currentLoggedInWallet.addAddressBook(addressBook);
        walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
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
