<template>
  <div class="card flex justify-content-center">
    <img
      src="@/modules/dashboard/img/icon-more-options.svg"
      class="w-4 h-4 cursor-pointer inline-block"
      @click="toggle"
    />
    <Menu ref="menu" :model="items" :popup="true">
      <template #item="{ item }">
        <div class="flex flex-col">
          <router-link
            v-if="item.label == 'Edit'"
            class="hover:bg-gray-100 bg-white transition duration-200 p-2 z-20"
            :to="{
              name: 'ViewServicesAddressBookEditContact',
              params: {
                contactAddress: address,
                contactPublicKey: publicKey ? 'true' : 'false',
              },
            }"
          >
            Edit
          </router-link>
          <div
            v-if="item.label == 'Delete'"
            class="block hover:bg-gray-100 transition duration-200 p-2 z-20 cursor-pointer text-red-600"
            @click="toggleModal = true"
          >
            {{ $t("general.remove") }}
          </div>
        </div>
      </template>
    </Menu>
  </div>
  <Dialog
    v-model:visible="toggleModal"
    modal
    :draggable="false"
    :dismissableMask="true"
    :closable="false"
    class="w-96"
  >
    <div class="w-104 font-normal">
      <div class="mb-5">
        <span class="text-sm text-gray-700">{{
          $t("addressBook.removeContactFromAB")
        }}</span>
      </div>
      <div class="flex justify-between rounded-xl mb-4 text-gray-600">
        <div class="w-full text-left">
          <div class="text-xs mt-3">
            <div class="inline-block w-20 font-bold">
              {{ $t("general.name") }}:
            </div>
            <div class="inline-block">{{ name }}</div>
          </div>
          <div class="text-xs mt-3">
            <div class="inline-block w-20 font-bold">
              {{ $t("general.address") }}:
            </div>
            <div class="inline-block mt-2">{{ address }}</div>
          </div>
          <div class="text-xs mt-3">
            <div class="inline-block w-20 font-bold">Group:</div>
            <div class="inline-block">{{ group }}</div>
          </div>
        </div>
      </div>
      <fieldset class="w-full">
        <div class="text-center mt-5">
          <div
            class="inline-block font-bold text-blue-primary mr-5 cursor-pointer"
            @click="toggleModal = false"
          >
            {{ $t("general.cancel") }}
          </div>
          <button
            type="submit"
            class="bg-red-primary text-white text-xs py-2 px-4 rounded-md"
            @click="deleteContact()"
          >
            {{ $t("addressBook.removeContact") }}
          </button>
        </div>
      </fieldset>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Menu from "primevue/menu";
import { useRouter } from "vue-router";
import { walletState } from "@/state/walletState";
import Dialog from "primevue/dialog";
import { Wallet } from "@/models/wallet";
const { address, publicKey, name } = defineProps<{
  name: string;
  group: string;
  address: string;
  publicKey?: string;
}>();

const toggleModal = ref(false);

const router = useRouter();
const menu = ref();
const items = ref([
  {
    label: "Edit",
    command: () => {
      router.push({
        name: "ViewServicesAddressBookEditContact",
        params: {
          contactAddress: address,
          contactPublicKey: publicKey ? "true" : "false",
        },
      });
    },
  },
  {
    label: "Delete",
    command: () => {},
  },
]);

const toggle = (event: Event) => {
  menu.value.toggle(event);
};

const deleteContact = () => {
  walletState.currentLoggedInWallet.contacts =
    walletState.currentLoggedInWallet.contacts.filter(
      (contact) => contact.name != name
    );
  walletState.wallets.saveMyWalletOnlytoLocalStorage(
    walletState.currentLoggedInWallet as Wallet
  );
  toggleModal.value = false;
};
</script>
