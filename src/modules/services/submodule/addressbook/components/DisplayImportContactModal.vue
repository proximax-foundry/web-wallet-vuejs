<template>
  <div>
    <div @click="toggleModal = !toggleModal"
      class="cursor-pointer mt-5 py-2 px-5 rounded-md bg-blue-primary text-white text-tsm drop-shadow-lg filter hover:bg-blue-600 transition-all duration-500">
      <img src="@/modules/services/submodule/addressbook/img/icon-download.svg"
        class="inline-block mr-4 relative top-1">{{ $t('general.import') }}</div>
    <transition enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp">
      <div v-if="toggleModal" class="popup-outer fixed flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style"
              @click="toggleModal = !toggleModal; closeModel()"></font-awesome-icon>
          </div>
          <div class="w-104">
            <h1 class="default-title font-bold mt-0 mb-5">{{ $t('addressBook.importAddress') }}</h1>
            <div class="bg-blue-200 text-left text-sm p-2 rounded-lg text-gray-800 mb-2" v-if="contactAdded > 0">{{
              contactAdded }} {{ $t('general.contact', contactAdded) }} {{ $t('addressBook.addressBookMessage1') }}</div>
            <div class="bg-yellow-200 text-left text-sm p-2 rounded-lg text-gray-800 mb-2" v-if="contactExisted > 0">{{
              contactExisted }} {{ $t('general.contact', contactExisted) }} {{ $t('addressBook.addressBookMessage2') }}</div>
            <div class="bg-red-200 text-left text-sm p-2 rounded-lg text-gray-800 mb-2"
              v-if="contactInvalidAddress.length > 0">{{ contactInvalidAddress.length }}
              {{ $t('general.contact', contactInvalidAddress.length) }} {{ $t('addressBook.addressBookMessage3') }}</div>
            <div v-if="contactInvalidAddress.length > 0" class="text-left text-gray-800 mt-5">
              <div class="font-bold mb-2">{{ $t('general.contact', contactInvalidAddress.length) }}
                {{ $t('addressBook.addressBookMessage4') }}:</div>
              <div v-for="contact, index in contactInvalidAddress" :key="index" class="text-left mb-2">
                <div class="inline-block mr-3 w-40">{{ contact.label }}</div>
                <div class="inline-block">{{ contact.address }}</div>
              </div>
            </div>
            <div class="py-5 my-5 text-tsm">
              <form enctype="multipart/form-data">
                <input type="file" @change="onFileChange">
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal; closeModel()" v-if="toggleModal"
      class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref } from "vue";
import { AddressBookUtils } from '@/util/addressBookUtils';
import { AddressBook } from '@/models/addressBook';
import { walletState } from '@/state/walletState';
import { useToast } from "primevue/usetoast";
import { useI18n } from 'vue-i18n';
import type { Account } from "@/models/account";

const toggleModal = ref(false);
const { t } = useI18n();
const toast = useToast();
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const contactAdded = ref(0);
const contactExisted = ref(0);
const contactInvalidAddress = ref<{label:string,address:string,group:string,publicKey:string|null}[]>([]);
const onFileChange = (e :Event) => {
  const target = e.target as HTMLInputElement
  var files = target.files
  if (!files || !files.length ) return;
  createInput(files[0]);
};

const closeModel = () => {
  contactAdded.value = 0;
  contactExisted.value = 0;
  contactInvalidAddress.value = [];
};

const createInput = (file :Blob) => {
  if(walletState.currentLoggedInWallet){
    return
  }
  let promise = new Promise<string>((resolve) => {
    var reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsText(file);
  });

  promise.then(
    result => {
      
      const wallet = walletState.currentLoggedInWallet;
      /* handle a successful result */
      var array = result.match(/[^\r\n]+/g) as RegExpMatchArray
      let exist = [];
      let addContact :{label:string,address:string,group:string,publicKey:string|null}[]= [];
      let errContact:{label:string,address:string,group:string,publicKey:string|null}[] = [];
      array.shift();
      array.forEach(element => {
        var label :string, address :string, group, publicKey;
        var arr = element.split(',');
        if (arr.length > 4) {
          // merge all array as label except the last
          let str = '';
          for (var a = 0; a < arr.length - 1; ++a) {
            str = str + arr[a] + ',';
          }
          label = str.replace(/['"]+/g, '');
        } else {
          label = arr[0].replace(/['"]+/g, '');
        }
        address = arr[1].replace(/['"]+/g, '');
        if (arr[2]) {
          group = arr[2].replace(/['"]+/g, '');
        } else {
          group = '-none-';
        }
        if (arr[3]) {
          publicKey = arr[3].replace(/['"]+/g, '');
        } else {
          publicKey = null;
        }


        // check if address or name is already in the contact book
        // check for existing account address in wallet
        // const accountAddIndex = wallet.accounts.findIndex((account) => account.address == address);
        // check for existing account name in wallet
        if (!wallet) {
          return;
        }
        const accountNameIndex = wallet.accounts.findIndex((account) => account.name.toLowerCase() == label.toLowerCase());
        const contactAddIndex = (wallet.contacts != undefined) ? wallet.contacts.findIndex((contact) => contact.address == address) : (-1);
        const contactNameIndex = (wallet.contacts != undefined) ? wallet.contacts.findIndex((contact) => contact.name.toLowerCase() == label.toLowerCase()) : (-1);
        
        const defaultAccount = wallet.accounts.find((account) => account.default == true) as Account

        if (contactAddIndex >= 0) {
          exist.push({ label, address, group, publicKey });
        } else if (contactNameIndex >= 0 || accountNameIndex >= 0) {
          const verifyContactAddress = AddressBookUtils.verifyNetworkAddress(defaultAccount.address, address);
          if (verifyContactAddress.isPassed) {
            addContact.push({ label: label + ' - 2', address, group, publicKey });
          } else {
            errContact.push({ label, address, group, publicKey });
          }
        } else {
          const verifyContactAddress = AddressBookUtils.verifyNetworkAddress(defaultAccount.address, address);
          if (verifyContactAddress.isPassed) {
            addContact.push({ label, address, group, publicKey });
          } else {
            errContact.push({ label, address, group, publicKey });
          }
        }
      });
      if (exist.length > 0) {
        // display error
        contactExisted.value = exist.length;
      }
      if (!wallet) {
          return;
        }
      if (addContact.length > 0) {
        addContact.forEach((element) => {
          let addressBook = new AddressBook(element.label, element.address, element.group, element.publicKey);
          wallet.addAddressBook(addressBook);
        });
        walletState.wallets.saveMyWalletOnlytoLocalStorage(wallet);
        contactAdded.value = addContact.length;
        emitter.emit('REFRESH_CONTACT_LIST', true);
        toast.add({ severity: 'info', summary: t('general.addressBook'), detail: t('addressBook.newContactImported', contactAdded.value), group: 'br-custom', life: 5000 });
      }
      contactInvalidAddress.value = errContact;
    },
    error => {
      /* handle an error */
      console.log(error);
    }
  );
};

</script>
<style lang="scss" scoped>
.import-icon:hover {
  @apply border-blue-primary bg-blue-primary;

  >div {
    @apply text-white;
  }

  svg {
    @apply text-white
  }
}</style>