<template>
  <div>

    <div class='w-9/12 ml-auto mr-auto mt-5'>
      <div class='flex text-xs font-semibold border-b-2 menu_title_div'>
        <router-link :to="{ name: 'ViewServicesAddressBook' }"
          class='w-18 text-center border-b pb-3'>{{ $t('general.list') }}</router-link>
        <router-link :to="{ name: 'ViewServicesAddressBookImport' }"
          class='w-18 text-center border-b pb-3'>{{ $t('general.import') }}</router-link>
        <router-link :to="{ name: 'ViewServicesAddressBookExport' }"
          class='w-18 text-center border-b pb-3'>{{ $t('general.export') }}</router-link>
      </div>
      <div class="border border-gray-100 p-5 filter drop-shadow-xl mt-10 bg-white">
        <div class="text-md mb-5 font-semibold">{{ $t('addressBook.editContact') }}</div>
        <div class="error error_box mb-5" v-if="err != ''">{{ err }}</div>
        <div class='mt-2 py-3 text-center px-0 flex'>
          <TextInputClean :placeholder="$t('general.name')" :errorMessage="$t('general.nameRequired')"
            v-model="contactName" icon="id-card-alt" :showError="showNameErr" class="w-52 inline-block mr-2" />
          <TextInputClean :placeholder="$t('general.address')" :errorMessage="addErr" v-model="addressOrPk" icon="wallet"
            :showError="showAddErr" class="w-96 inline-block mr-2" />
          <SelectInputPluginClean v-model="selectContactGroups" placeholder="Group" :options="contactGroups"
            selectDefault="-none-" ref="selectGroupDropdown" class="w-60 inline-block mr-2" />
          <button type="submit" class="default-btn py-1 disabled:opacity-50 h-12 flex items-center"
            :disabled="disableSave" @click="SaveContact()"><img
              src="@/modules/services/submodule/addressbook/img/icon-save.svg"
              class="inline-block mr-2">{{ $t('addressBook.saveAddress') }}</button>
        </div>
        <div v-if="!existingPublicKey && !showAddErr && !newPublicKey">
          <div v-if="!publicKey && isLoaded" class="px-3 py-2 mt-1 bg-red-300">{{ $t('general.publicKeyNotAvailable') }}
          </div>
          <div v-else class="px-3 py-2 mt-1 bg-green-100">{{ $t('general.publicKeyAvailable') }}</div>
        </div>
      </div>
    </div>
    <AddCustomGroupModal :toggleModal="isDisplayAddCustomPanel" :groups="contactGroups" />
  </div>
</template>
<script lang="ts" setup>
import { Address } from "tsjs-xpx-chain-sdk";
import { computed, ref, watch, getCurrentInstance, onMounted } from 'vue';
import TextInputClean from '@/components/TextInputClean.vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { AddressBookUtils } from '@/util/addressBookUtils';
import { walletState } from '@/state/walletState';
import { useI18n } from 'vue-i18n';
import { Helper } from "@/util/typeHelper";
import SelectInputPluginClean from "@/components/SelectInputPluginClean.vue";
import AddCustomGroupModal from "@/modules/services/submodule/addressbook/components/AddCustomGroupModal.vue";
import { AppState } from "@/state/appState";
import { WalletUtils } from "@/util/walletUtils";
import type { Account } from "@/models/account";

const props = defineProps({
  contactAddress: {
    type:String,
    required:true
  },
  contactPublicKey: {
    type:String,
    required:true
  },
})

const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;

const selectGroupDropdown = ref(null);

const { t } = useI18n();
const toast = useToast();
const err = ref('');
const verifyAdd = ref(true);
const addMsg = ref('');
const router = useRouter();
const selectContactGroups = ref('');

// load particulars
var contact :{name:string,address:string,group:string,publicKey:string | null} | null = null
if (walletState.currentLoggedInWallet) {
  contact = walletState.currentLoggedInWallet.contacts.find((contact) => Helper.createAddress(contact.address).pretty() == props.contactAddress) as {name:string,address:string,group:string,publicKey:string | null}
}

const contactName = ref(contact ? contact.name : '');
const addressOrPk = ref(props.contactAddress)
const address = ref('');
const publicKey = ref<string | null>('');
address.value = addressOrPk.value

const existingPublicKey = ref(false)
const isLoaded = ref(false)
if (props.contactPublicKey == "true") {
  existingPublicKey.value = true
}

const newPublicKey = computed(() => {
  if (addressOrPk.value.length == 64) {
    return true
  } else {
    return false
  }
})

const contactGroupsList = ref<string[]>([]);
if (walletState.currentLoggedInWallet) {
  walletState.currentLoggedInWallet.contacts.forEach((contact) => {
    contactGroupsList.value.push(contact.group);
  });
}


function uniqueValue(value :string, index :number, self:string[]) {
  return self.indexOf(value) === index;
}

const defaultList = [t('addressBook.work'), t('addressBook.friend'), t('addressBook.family'), t('addressBook.employee'), t('addressBook.director')];
const addressBookList = defaultList.concat(contactGroupsList.value);
var uniqueGroupLabels = addressBookList.filter(uniqueValue);
uniqueGroupLabels = uniqueGroupLabels.filter((value) => value != '-none-');
uniqueGroupLabels.sort();

const action = ref<{value:string,label:string}[]>([]);
action.value.push({ value: '-none-', label: ' - ' });
uniqueGroupLabels.forEach((label) => {
  action.value.push({ value: label, label });
});
action.value.push({ value: 'Custom', label: t('addressBook.custom') });

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
    init()
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
      isLoaded.value = true
    }
    else {
      publicKey.value = accInfo.publicKey
      isLoaded.value = true
    }
  }
  catch {
    publicKey.value = null
    isLoaded.value = true
  }
}

const SaveContact = async () => {
  const wallet = walletState.currentLoggedInWallet
  if (!wallet) {
    return;
  }
  if (addressOrPk.value.length == 64) {
    publicKey.value = addressOrPk.value
  }
  else {
    await getPublicKey(address.value)
  }
  //get index of editing contact
  const contactIndex = wallet.contacts.findIndex((contact) => Helper.createAddress(contact.address).pretty() == props.contactAddress);
  //contact list excluding editing contact itself
  
  let tempContactList = wallet.contacts.filter(tempContact => tempContact.name.toLowerCase() != (contact as {name:string,address:string,group:string,publicKey:string | null}).name.toLowerCase().trim())
  let findNameInTempContact = tempContactList.find(contact => contact.name.toLowerCase() == contactName.value.toLowerCase().trim())
  let findNameInAcc = wallet.accounts.find(acc => acc.name.toLowerCase() == contactName.value.toLowerCase().trim())
  let findAddressInTempContact = tempContactList.find(contact => Address.createFromRawAddress(contact.address).plain() == Address.createFromRawAddress(address.value).plain())
  if (findNameInTempContact != undefined || findNameInAcc != undefined) {
    err.value = t('addressBook.nameExist');
  } else if (findAddressInTempContact != undefined) {
    err.value = t('addressBook.addressExist');
  } else {
    wallet.updateAddressBook(contactIndex, { name: contactName.value.trim(), address: Address.createFromRawAddress(address.value).plain(), group: selectContactGroups.value, publicKey: publicKey.value });
    walletState.wallets.saveMyWalletOnlytoLocalStorage(wallet);
    toast.add({ severity: 'info', summary: t('general.addressBook'), detail: t('addressBook.contactUpdated'), group: 'br-custom', life: 5000 });
    router.push({ name: "ViewServicesAddressBook" });
  }



}

emitter.on('CLOSE_ADDCUSTOMGROUP_PANEL', () => {
  isDisplayAddCustomPanel.value = false;
});

emitter.on('ADD_CUSTOM_GROUP', (customGroup :string) => {
  action.value.push({ value: customGroup, label: customGroup });
  
  isDisplayAddCustomPanel.value = false;
});

const init = () => {
  if (AppState.isReady) {
    getPublicKey(address.value)
  } else {
    let readyWatcher = watch(AppState, (value) => {
      if (value.isReady) {
        getPublicKey(address.value)
        readyWatcher();
      }
    });
  }
}
init()


</script>
