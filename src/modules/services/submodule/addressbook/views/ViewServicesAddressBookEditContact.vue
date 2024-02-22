<template>
  <div>
    <div class="w-9/12 ml-auto mr-auto mt-5">
      <div class="flex text-xs font-semibold border-b-2 menu_title_div">
        <router-link
          :to="{ name: 'ViewServicesAddressBook' }"
          class="w-18 text-center border-b pb-3"
          >{{ $t("general.list") }}</router-link
        >
        <router-link
          :to="{ name: 'ViewServicesAddressBookImport' }"
          class="w-18 text-center border-b pb-3"
          >{{ $t("general.import") }}</router-link
        >
        <router-link
          :to="{ name: 'ViewServicesAddressBookExport' }"
          class="w-18 text-center border-b pb-3"
          >{{ $t("general.export") }}</router-link
        >
      </div>
      <div
        class="border border-gray-100 p-5 filter drop-shadow-xl mt-10 bg-white"
      >
        <div class="text-md mb-5 font-semibold">
          {{ $t("addressBook.editContact") }}
        </div>
        <div class="error error_box mb-5" v-if="err != ''">{{ err }}</div>
        <div class="py-3 px-0 flex flex-wrap items-center gap-2">
          <TextInputClean
            :placeholder="$t('general.name')"
            :errorMessage="$t('general.nameRequired')"
            v-model="contactName"
            icon="id-card-alt"
            :showError="showNameErr"
            class="w-52"
          />
          <TextInputClean
            :placeholder="$t('general.address')"
            :errorMessage="addErr"
            v-model="addressOrPk"
            icon="wallet"
            :showError="showAddErr"
            class="w-96"
          />

          <Dropdown
            v-model="selectContactGroups"
            :options="contactGroups"
            option-label="label"
            placeholder="Group "
          />
          <button
            type="submit"
            class="bg-blue-primary w-fit text-white px-2 rounded-lg py-2 font-semibold disabled:opacity-50 flex items-center"
            :disabled="disableSave"
            @click="SaveContact()"
          >
            <img
              src="@/modules/services/submodule/addressbook/img/icon-save.svg"
              class="mr-2"
            />{{ $t("addressBook.saveAddress") }}
          </button>
        </div>
        <div v-if="!existingPublicKey && !showAddErr && !newPublicKey">
          <div v-if="!publicKey && isLoaded" class="px-3 py-2 mt-1 bg-red-300">
            {{ $t("general.publicKeyNotAvailable") }}
          </div>
          <div v-else class="px-3 py-2 mt-1 bg-green-100">
            {{ $t("general.publicKeyAvailable") }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="isDisplayAddCustomPanel"
    modal
    :draggable="false"
    :dismissableMask="true"
    :closable="false"
    class="w-96"
  >
    <div class="flex flex-col justify-center items-center">
      <div class="mt-2 text-xs font-semibold">
        {{ $t("addressBook.addCustomGroup") }}
      </div>
      <div class="error error_box mb-3" v-if="err != ''">{{ err }}</div>
      <input
        type="text"
        v-model="customGroup"
        :placeholder="$t('addressBook.customGroup')"
        class="border border-gray-300 p-3 my-5 text-tsm text-center focus:outline-none"
      />
      <button
        class="rounded-md cursor-pointer text-xs text-white py-2 text-center ml-auto mr-auto btn-default bg-blue-primary w-14 mb-2 disabled:opacity-50"
        @click="addCustomGroup"
        :disabled="disableAdd"
      >
        {{ $t("general.add") }}
      </button>
      <div
        class="text-center cursor-pointer font-semibold text-xs text-gray-500 mt-2"
        @click="isDisplayAddCustomPanel = false"
      >
        {{ $t("general.cancel") }}
      </div>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
import { Address } from "tsjs-xpx-chain-sdk";
import { computed, ref, watch } from "vue";
import TextInputClean from "@/components/TextInputClean.vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { AddressBookUtils } from "@/util/addressBookUtils";
import { walletState } from "@/state/walletState";
import { useI18n } from "vue-i18n";
import { Helper } from "@/util/typeHelper";
import { AppState } from "@/state/appState";
import { WalletUtils } from "@/util/walletUtils";
import { AddressBook } from "@/models/addressBook";
import Dialog from "primevue/dialog";

const props = defineProps<{
  contactAddress: string;
  contactPublicKey: string;
}>();

const { t } = useI18n();
const toast = useToast();
const err = ref("");
const verifyAdd = ref(true);
const addMsg = ref("");
const router = useRouter();
const contact: AddressBook = walletState.currentLoggedInWallet.contacts.find(
  (contact) =>
    Helper.createAddress(contact.address).pretty() == props.contactAddress
);
const selectContactGroups = ref(
  contact?.group
    ? { value: contact.group, label: contact.group }
    : { value: "", label: "" }
);
const customGroup = ref("");
const customGroupPattern = "^[0-9A-Za-z]{1,}$";
const disableAdd = computed(() => !customGroup.value.match(customGroupPattern));

const contactName = ref(contact ? contact.name : "");
const addressOrPk = ref(props.contactAddress);
const address = ref("");
const publicKey = ref("");
address.value = addressOrPk.value;

const existingPublicKey = ref(false);
const isLoaded = ref(false);
if (props.contactPublicKey == "true") {
  existingPublicKey.value = true;
}

const newPublicKey = computed(() => {
  if (addressOrPk.value.length == 64) {
    return true;
  } else {
    return false;
  }
});

const allGroupList = ref<string[]>([
  t("addressBook.work"),
  t("addressBook.friend"),
  t("addressBook.family"),
  t("addressBook.employee"),
  t("addressBook.director"),
]);

const contactGroups = computed(() => {
  return [
    { value: "-none-", label: " - " },
    { value: "Custom", label: t("addressBook.custom") },
  ].concat(
    allGroupList.value.map((group) => {
      return {
        value: group,
        label: group,
      };
    })
  );
});

const disableSave = computed(
  () => !(verifyAdd.value && contactName.value != "")
);

const showAddErr = computed(() => !verifyAdd.value && address.value != "");

const showNameErr = computed(
  () =>
    (address.value != "" && contactName.value == "") ||
    (addressOrPk.value != "" && contactName.value == "")
);

const addErr = computed(() => {
  let addErrDefault = t("general.invalidInput");
  return addMsg.value ? addMsg.value : addErrDefault;
});

const getPublicKey = async (address) => {
  try {
    let accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(
      Address.createFromRawAddress(address)
    );
    if (
      accInfo.publicKey ==
      "0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      publicKey.value = null;
      isLoaded.value = true;
    } else {
      publicKey.value = accInfo.publicKey;
      isLoaded.value = true;
    }
  } catch {
    publicKey.value = null;
    isLoaded.value = true;
  }
};

watch(addressOrPk, () => {
  if (!walletState.currentLoggedInWallet) {
    return;
  }
  if (addressOrPk.value.length <= 63 || addressOrPk.value.length >= 65) {
    address.value = addressOrPk.value;
    const defaultAccount = walletState.currentLoggedInWallet.accounts.find(
      (account) => account.default == true
    );
    const verifyContactAddress = AddressBookUtils.verifyNetworkAddress(
      defaultAccount.address,
      address.value
    );
    verifyAdd.value = verifyContactAddress.isPassed;
    addMsg.value = verifyContactAddress.errMessage;
    getPublicKey(address.value);
  } else if (addressOrPk.value.length == 64) {
    verifyAdd.value = true;
    address.value = WalletUtils.createAddressFromPublicKey(
      addressOrPk.value,
      AppState.networkType
    ).plain();
  }
});

const isDisplayAddCustomPanel = ref(false);
watch(selectContactGroups, (value) => {
  if (value.value == "Custom") {
    isDisplayAddCustomPanel.value = true;
  }
});

const SaveContact = async () => {
  const wallet = walletState.currentLoggedInWallet;

  if (addressOrPk.value.length == 64) {
    publicKey.value = addressOrPk.value;
  } else {
    await getPublicKey(address.value);
  }
  //get index of editing contact
  const contactIndex = walletState.currentLoggedInWallet.contacts.findIndex(
    (contact) =>
      Helper.createAddress(contact.address).pretty() == props.contactAddress
  );
  //contact list excluding editing contact itself
  let tempContactList = wallet.contacts.filter(
    (tempContact) =>
      tempContact.name.toLowerCase() != contact.name.toLowerCase().trim()
  );
  let findNameInTempContact = tempContactList.find(
    (contact) =>
      contact.name.toLowerCase() == contactName.value.toLowerCase().trim()
  );
  let findNameInAcc = wallet.accounts.find(
    (acc) => acc.name.toLowerCase() == contactName.value.toLowerCase().trim()
  );
  let findAddressInTempContact = tempContactList.find(
    (contact) =>
      Address.createFromRawAddress(contact.address).plain() ==
      Address.createFromRawAddress(address.value).plain()
  );
  if (findNameInTempContact != undefined || findNameInAcc != undefined) {
    err.value = t("addressBook.nameExist");
  } else if (findAddressInTempContact != undefined) {
    err.value = t("addressBook.addressExist");
  } else {
    walletState.currentLoggedInWallet.updateAddressBook(contactIndex, {
      name: contactName.value.trim(),
      address: Address.createFromRawAddress(address.value).plain(),
      group: selectContactGroups.value.value,
      publicKey: publicKey.value,
    });
    walletState.wallets.saveMyWalletOnlytoLocalStorage(
      walletState.currentLoggedInWallet
    );
    toast.add({
      severity: "info",
      summary: t("general.addressBook"),
      detail: t("addressBook.contactUpdated"),
      group: "br-custom",
      life: 5000,
    });
    router.push({ name: "ViewServicesAddressBook" });
  }
};

const addCustomGroup = () => {
  // check existing group
  if (
    contactGroups.value.find(
      ({ value }) => value.toLowerCase() === customGroup.value.toLowerCase()
    ) ||
    allGroupList.value.includes(customGroup.value.toLowerCase())
  ) {
    err.value = t("addressBook.groupValidation");
  } else {
    allGroupList.value.push(customGroup.value);
    selectContactGroups.value = {
      value: customGroup.value,
      label: customGroup.value,
    };
    isDisplayAddCustomPanel.value = false;
    customGroup.value = "";
  }
};

watch(
  () => AppState.isReady,
  (n) => {
    if (n) {
      getPublicKey(address.value);
    }
  }
);

watch(
  () => walletState.currentLoggedInWallet,
  (n) => {
    if (n) {
      const contactGroup = [
        ...new Set(n.contacts.map((contact) => contact.group)),
      ].filter((value) => value != "-none-");

      allGroupList.value = allGroupList.value.concat(contactGroup);
    }
  },
  { immediate: true }
);
</script>
