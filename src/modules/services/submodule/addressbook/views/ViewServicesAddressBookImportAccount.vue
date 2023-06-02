<template>
    <div>
        <div class='w-9/12 ml-auto mr-auto mt-5'>
            <div class ='flex text-xs font-semibold border-b-2 menu_title_div'>
            <router-link :to="{ name: 'ViewServicesAddressBook' }" class= 'w-18 text-center border-b pb-3'>{{$t('general.list')}}</router-link>
            <div class='w-18 text-center border-b-2 pb-3 border-yellow-500'>{{$t('general.import')}}</div>
            <router-link :to="{ name: 'ViewServicesAddressBookExport' }" class= 'w-18 text-center border-b pb-3'>{{$t('general.export')}}</router-link>
            </div>
            <div class="mt-10">
                <div class="text-md my-5 font-semibold">{{$t('addressBook.importContacts')}}</div>
                <div class="flex cursor-pointer">
                    <router-link :to="{ name: 'ViewServicesAddressBookImport' }"
                        class="border-2 border-blue-primary p-1 mb-3 w-20 text-blue-primary text-xs text-center font-semibold "> {{ $t('wallet.importFile') }}
                    </router-link>
                    <div class="border-2 border-blue-primary p-1 mb-3 w-16 text-white bg-blue-primary text-xs text-center font-semibold ">
                        {{ $t('general.account') }}
                    </div>
                </div>
                <div class="text-tsm">{{$t('addressBook.addAccountContact')}}</div>
                <div class="bg-blue-200 text-left text-sm p-2 rounded-lg text-gray-800 mb-2" v-if="contactAdded > 0">{{ contactAdded }} {{$t('general.contact',contactAdded)}} {{$t('addressBook.addressBookMessage1')}}</div>
                <div class="bg-yellow-200 text-left text-sm p-2 rounded-lg text-gray-800 mb-2" v-if="contactExisted > 0">{{ contactExisted }} {{$t('general.contact',contactExisted)}} {{$t('addressBook.addressBookMessage2')}}</div>
                <div class="mt-4">
                    <MultiSelect v-model="selectedAccount" :options="accounts" filter optionLabel="name" placeholder="Accounts" class="w-60 inline-block mr-2" />
                </div>
                <div @click="importAccount()" class="w-36 cursor-pointer mt-5 py-2 px-5 rounded-md bg-blue-primary text-white text-tsm drop-shadow-lg filter hover:bg-blue-600 transition-all duration-500"><img src="@/modules/services/submodule/addressbook/img/icon-download.svg" class="inline-block mr-4 relative top-1">{{$t('general.import')}}</div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from "vue";
import { walletState } from '@/state/walletState';
import {useI18n} from 'vue-i18n';
import MultiSelect from 'primevue/multiselect';
import { AddressBookUtils } from '@/util/addressBookUtils';
import { AddressBook } from '@/models/addressBook';
import { useToast } from "primevue/usetoast";

const {t} = useI18n();
const toast = useToast();
const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
const list = ref([]);
const contactAdded = ref(0);
const contactExisted = ref(0);
const selectedAccount = ref([])

const contactName = (acc) =>{
    const contact = walletState.currentLoggedInWallet.contacts.find((contact) => contact.address == acc.address);
    if(contact){
        return contact.name;
      }else{
        return acc.name;
      }
}
const accounts = computed(() => {
    if(!walletState.currentLoggedInWallet){
        return []
    }
    let accounts = walletState.currentLoggedInWallet.accounts.map(
        (acc) => {
            return {
                name: contactName(acc),
                address: acc.address,
                publicKey: acc.publicKey,
                group: 'Account'
            }
        }
    )
    let otherAccounts = walletState.currentLoggedInWallet.others.map(
        (acc) => {
            return {
                name: contactName(acc),
                address: acc.address,
                publicKey: acc.publicKey,
                group: 'OtherAccount'
            }
        }
    )
    return accounts.concat(otherAccounts)
})

const refreshList = () => {
    if (!walletState.currentLoggedInWallet) {
      return
    }
    list.value  = [];
    if (walletState.currentLoggedInWallet.contacts != undefined) {
      if (walletState.currentLoggedInWallet.contacts.length > 0) {
        walletState.currentLoggedInWallet.contacts.forEach((contact) => {
          list.value.push(contact);
        });
        list.value.sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
      }
    }
}
refreshList();
    
emitter.on('REFRESH_CONTACT_LIST', (status :boolean)=> {
if (status) {
  // refresh list
  setTimeout(() => {
    refreshList();
  }, 1000);
}
});

const importAccount = () => {
    if(!walletState.currentLoggedInWallet){
        return;
    }
    const wallet = walletState.currentLoggedInWallet;
    let exist = [];
    let addContact = [];
    selectedAccount.value.forEach(element => {
        let label = element.name
        let address = element.address
        let group = element.group
        let publicKey = element.publicKey

        const contactAddIndex = (wallet.contacts!=undefined)?wallet.contacts.findIndex((contact) => contact.address == address):(-1);
        const contactNameIndex =(wallet.contacts!=undefined)?wallet.contacts.findIndex((contact) => contact.name.toLowerCase() == label.toLowerCase()):(-1);

        const defaultAccount = walletState.currentLoggedInWallet.accounts.find((account) => account.default == true);

        if(contactAddIndex >= 0){
            exist.push({label, address, group, publicKey });
        }else if( contactNameIndex >= 0 ){
            const verifyContactAddress = AddressBookUtils.verifyNetworkAddress(defaultAccount.address, address);
            if(verifyContactAddress.isPassed){
                addContact.push({label: label + ' - 2', address, group, publicKey });
            }
        }else{
            const verifyContactAddress = AddressBookUtils.verifyNetworkAddress(defaultAccount.address, address);
            if(verifyContactAddress.isPassed){
                addContact.push({label, address, group, publicKey });
            }
        }
    })
    if(exist.length > 0){
        // display error
        contactExisted.value = exist.length;
    }
    if(addContact.length > 0){
        addContact.forEach((element) => {
          let addressBook = new AddressBook(element.label, element.address, element.group, element.publicKey);
          walletState.currentLoggedInWallet.addAddressBook(addressBook);
        });
        walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
        contactAdded.value = addContact.length;
        emitter.emit('REFRESH_CONTACT_LIST', true);
        toast.add({severity:'info', summary: t('general.addressBook'), detail: t('addressBook.newContactImported',contactAdded.value) , group: 'br-custom', life: 5000});
    }
}

watch(selectedAccount,n => {
    console.log(n)
})

</script>