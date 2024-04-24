<template>
  <div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
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
          {{ $t("addressBook.addNewContact") }}
        </div>
        <div class="error error_box mb-5" v-if="err != ''">{{ err }}</div>
        <div class="py-3 px-0 flex flex-wrap items-center gap-2 flex-grow">
          <TextInputClean
            :placeholder="$t('general.name')"
            :errorMessage="$t('general.nameRequired')"
            v-model="contactName"
            icon="id-card-alt"
            :showError="showNameErr"
          />
          <TextInputClean
            :placeholder="$t('multisig.addressOrPk')"
            :errorMessage="addErr"
            v-model="addressOrPk"
            icon="wallet"
            :showError="showAddErr"
          />
          <Dropdown
            v-model="selectContactGroups"
            :options="contactGroups"
            option-label="label"
            placeholder="Group "
          />
          <button
            type="submit"
            class="bg-blue-primary  text-white px-2 rounded-lg py-2 font-semibold disabled:opacity-50 flex items-center"
            :disabled="disableSave"
            @click="SaveContact()"
          >
            <img
              src="@/modules/services/submodule/addressbook/img/icon-save.svg"
              class="mr-2"
            />{{ $t("addressBook.saveAddress") }}
          </button>
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
        @click="isDisplayAddCustomPanel = false, selectContactGroups = { value: `-none-`, label: ` - ` }"
      >
        {{ $t("general.cancel") }}
      </div>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
import { Address } from "tsjs-xpx-chain-sdk";
import { computed, ref, watch, getCurrentInstance } from "vue";
import TextInputClean from "@/components/TextInputClean.vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { AddressBook } from "@/models/addressBook";
import { AddressBookUtils } from "@/util/addressBookUtils";
import { walletState } from "@/state/walletState";
import { useI18n } from "vue-i18n";
import { WalletUtils } from "@/util/walletUtils";
import { AppState } from "@/state/appState";
import Dialog from "primevue/dialog";
import { Wallet } from "@/models/wallet";

    const customGroup = ref("");
    const customGroupPattern = "^[0-9A-Za-z]{1,}$";
    const disableAdd = computed(
      () => !customGroup.value.match(customGroupPattern)
    );

    const { t } = useI18n();
    const toast = useToast();
    const contactName = ref("");
    const address = ref("");
    const addressOrPk = ref("");
    const publicKey = ref("");
    const accVersion = ref(2);
    const err = ref("");
    const verifyAdd = ref(false);
    const addMsg = ref("");
    const router = useRouter();

    const selectContactGroups = ref({ value: "-none-", label: " - " });
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

    const getAccVersion = async (publicKey) => {
      try {
        let accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(
          Address.createFromPublicKey(publicKey, AppState.networkType)
        );
        
        accVersion.value = accInfo.version ?? 2;
      } catch {
        accVersion.value = 2;
      }
    };

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
        } else {
          publicKey.value = accInfo.publicKey;
        }
        accVersion.value = accInfo.version ?? 2;
      } catch {
        publicKey.value = null;
        accVersion.value = 2;
      }
    };

    const SaveContact = async () => {
      if (contactName.value == " ") {
        err.value = t("general.nameRequired");
        return;
      }
      if (addressOrPk.value.length == 64) {
        publicKey.value = addressOrPk.value;
        await getAccVersion(publicKey.value);
      } else {
        await getPublicKey(address.value);
      }
      
      const rawAddress = Address.createFromRawAddress(address.value);
      // let addressBook = new AddressBook(contactName.value, rawAddress.address);
      let addressBook = new AddressBook(
        contactName.value.trim(),
        rawAddress.plain(),
        selectContactGroups.value.value,
        accVersion.value,
        publicKey.value
      );
      const wallet = walletState.currentLoggedInWallet;

      // check for existing account name in wallet
      const accountNameIndex = wallet.accounts.findIndex(
        (account) =>
          account.name.toLowerCase() == contactName.value.toLowerCase().trim()
      );
      const contactAddIndex =
        wallet.contacts != undefined
          ? wallet.contacts.findIndex(
              (contact) =>
                Address.createFromRawAddress(contact.address).plain() ==
                rawAddress.plain()
            )
          : -1;
      const contactNameIndex =
        wallet.contacts != undefined
          ? wallet.contacts.findIndex(
              (contact) =>
                contact.name.toLowerCase() ==
                contactName.value.toLowerCase().trim()
            )
          : -1;

      if (contactAddIndex >= 0) {
        err.value = t("addressBook.addressExist");
      } else if (contactNameIndex >= 0 || accountNameIndex >= 0) {
        err.value = t("addressBook.nameExist");
      } else {
        walletState.currentLoggedInWallet.addAddressBook(addressBook);
        walletState.wallets.saveMyWalletOnlytoLocalStorage(
          walletState.currentLoggedInWallet as Wallet
        );
        err.value = "";
        contactName.value = "";
        addressOrPk.value = "";
        toast.add({
          severity: "info",
          summary: t("general.addressBook"),
          detail: t("addressBook.newContactAdded"),
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
