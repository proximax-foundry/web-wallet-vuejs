<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div class='flex text-xs font-semibold border-b-2 menu_title_div'>
        <router-link :to="{ name: 'ViewServicesAddressBook' }"
          class='w-18 text-center border-b pb-3'>{{ $t('general.list') }}</router-link>
        <router-link :to="{ name: 'ViewServicesAddressBookImport' }"
          class='w-18 text-center border-b pb-3'>{{ $t('general.import') }}</router-link>
        <router-link :to="{ name: 'ViewServicesAddressBookExport' }"
          class='w-18 text-center border-b pb-3'>{{ $t('general.export') }}</router-link>
      </div>
      <div class="border border-gray-100 p-5 filter drop-shadow-xl mt-10 bg-white">
        <div class="text-md mb-5 font-semibold">{{ $t('addressBook.addNewContact') }}</div>
        <div class="error error_box mb-5" v-if="err != ''">{{ err }}</div>
        <div class='mt-2 py-3 px-0 md:flex'>
          <TextInputClean :placeholder="$t('general.name')" :errorMessage="$t('general.nameRequired')"
            v-model="contactName" icon="id-card-alt" :showError="showNameErr" class="w-full md:w-52 inline-block mr-2" />
          <TextInputClean :placeholder="$t('multisig.addressOrPk')" :errorMessage="addErr" v-model="addressOrPk"
            icon="wallet" :showError="showAddErr" class="w-full md:w-96 inline-block mr-2" />
          <SelectInputPluginClean v-model="selectContactGroups" :placeholder="$t('general.group')"
            :options="contactGroups" selectDefault="-none-" ref="selectGroupDropdown"
            class="w-full md:w-60 inline-block mr-2" />
          <button type="submit" class="mt-5 md:mt-0 default-btn py-1 disabled:opacity-50 h-12 flex items-center"
            :disabled="disableSave" @click="SaveContact()"><img
              src="@/modules/services/submodule/addressbook/img/icon-save.svg" class="inline-block mr-2">
            {{ $t('addressBook.saveAddress') }}</button>
        </div>
      </div>
    </div>
    <AddCustomGroupModal :toggleModal="isDisplayAddCustomPanel" :groups="contactGroups" />
  </div>
</template>
<script lang="ts" setup>
import { Address } from "tsjs-xpx-chain-sdk";
import { computed, ref, watch, getCurrentInstance } from 'vue';
import TextInputClean from '@/components/TextInputClean.vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { AddressBook } from '@/models/addressBook';
import { AddressBookUtils } from '@/util/addressBookUtils';
import { walletState } from '@/state/walletState';
import { useI18n } from 'vue-i18n'
import SelectInputPluginClean from "@/components/SelectInputPluginClean.vue";
import AddCustomGroupModal from "@/modules/services/submodule/addressbook/components/AddCustomGroupModal.vue";
import { WalletUtils } from "@/util/walletUtils";
import { AppState } from "@/state/appState";
import type { Account } from "@/models/account";

const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;

const selectGroupDropdown = ref(null);

const { t } = useI18n();
const toast = useToast();
const contactName = ref('');
const address = ref('');
const addressOrPk = ref('');
const publicKey = ref<string | null>('');
const err = ref('');
const verifyAdd = ref(false);
const addMsg = ref('');
const router = useRouter();
const selectContactGroups = ref('');

const defaultGroups = ['-none-', 'Work', 'Friend', 'Family', 'Employee', 'Director'];
let customGroup :string[] = [];

const removeDuplicates = (arr :string[]) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const action = ref<{value:string,label:string}[]>([]);
action.value.push(
  { value: '-none-', label: ' - ' },
  { value: 'Work', label: t('addressBook.work') },
  { value: 'Friend', label: t('addressBook.friend') },
  { value: 'Family', label: t('addressBook.family') },
  { value: 'Employee', label: t('addressBook.employee') },
  { value: 'Director', label: t('addressBook.director') },
);

if (walletState.currentLoggedInWallet) {
  if (walletState.currentLoggedInWallet.contacts.length > 0) {
    walletState.currentLoggedInWallet.contacts.forEach(contact => {
      if (!defaultGroups.includes(contact.group)) {
        customGroup.push(contact.group);
      }
    })

    let uniqueCustomGroups = removeDuplicates(customGroup);
    if (uniqueCustomGroups.length > 0) {
      uniqueCustomGroups.sort();
      uniqueCustomGroups.forEach((group) => {
        action.value.push(
          { value: group, label: group },
        );
      });
    }
  }
}

action.value.push(
  { value: 'Custom', label: t('addressBook.custom') },
);
const contactGroups = computed(() => {
  return action.value;
});

const disableSave = computed(
  () => !(
    verifyAdd.value && contactName.value != ''
  )
);

const showAddErr = computed(
  () => !verifyAdd.value && address.value != ''
);

const showNameErr = computed(
  () => (address.value != '' && contactName.value == '') || (addressOrPk.value != '' && contactName.value == '')
);

const addErr = computed(
  () => {
    let addErrDefault = t('general.invalidInput');
    return addMsg.value ? addMsg.value : addErrDefault;
  }
);

watch(addressOrPk, () => {
  if (!walletState.currentLoggedInWallet) {
    return;
  }
  if (addressOrPk.value.length <= 63 || addressOrPk.value.length >= 65) {
    address.value = addressOrPk.value
    const defaultAccount = walletState.currentLoggedInWallet.accounts.find((account) => account.default == true) as Account
    const verifyContactAddress = AddressBookUtils.verifyNetworkAddress(defaultAccount.address, address.value);
    verifyAdd.value = verifyContactAddress.isPassed;
    addMsg.value = verifyContactAddress.errMessage;
  }
  else if (addressOrPk.value.length == 64) {
    verifyAdd.value = true
    address.value = WalletUtils.createAddressFromPublicKey(addressOrPk.value, AppState.networkType).plain()
  }
});

const isDisplayAddCustomPanel = ref(false);
watch(selectContactGroups, (value) => {
  if (value == 'Custom') {
    isDisplayAddCustomPanel.value = true;
  }
});

const getPublicKey = async (address :string) => {
  if(!AppState.chainAPI){
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
  if (contactName.value == ' ') {
    err.value = t('general.nameRequired');
    return
  }
  if (addressOrPk.value.length == 64) {
    publicKey.value = addressOrPk.value
  }
  else {
    await getPublicKey(address.value)
  }
  console.log(address.value)
  const rawAddress = Address.createFromRawAddress(address.value);
  // let addressBook = new AddressBook(contactName.value, rawAddress.address);
  let addressBook = new AddressBook(contactName.value.trim(), rawAddress.plain(), selectContactGroups.value, publicKey.value);
  const wallet = walletState.currentLoggedInWallet;
  if(!wallet){
    return
  }
  // check for existing account name in wallet
  const accountNameIndex = wallet.accounts.findIndex((account) => account.name.toLowerCase() == contactName.value.toLowerCase().trim());
  const contactAddIndex = (wallet.contacts != undefined) ? wallet.contacts.findIndex((contact) => Address.createFromRawAddress(contact.address).plain() == rawAddress.plain()) : (-1);
  const contactNameIndex = (wallet.contacts != undefined) ? wallet.contacts.findIndex((contact) => contact.name.toLowerCase() == contactName.value.toLowerCase().trim()) : (-1);

  if (contactAddIndex >= 0) {
    err.value = t('addressBook.addressExist');
  } else if (contactNameIndex >= 0 || accountNameIndex >= 0) {
    err.value = t('addressBook.nameExist');
  } else {
    wallet.addAddressBook(addressBook);
    walletState.wallets.saveMyWalletOnlytoLocalStorage(wallet);
    err.value = '';
    contactName.value = '';
    addressOrPk.value = '';
    toast.add({ severity: 'info', summary: t('general.addressBook'), detail: t('addressBook.newContactAdded'), group: 'br-custom', life: 5000 });
    router.push({ name: 'ViewServicesAddressBook' });
  }
}

emitter.on('CLOSE_ADDCUSTOMGROUP_PANEL', () => {
  isDisplayAddCustomPanel.value = false;
});

emitter.on('ADD_CUSTOM_GROUP', (customGroup :string) => {
  action.value.push({ value: customGroup, label: customGroup });

  isDisplayAddCustomPanel.value = false;
});

</script>
