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
        <div class="w-18 text-center border-b-2 pb-3 border-yellow-500">
          {{ $t("general.export") }}
        </div>
      </div>
      <div class="mt-10">
        <div class="text-md my-5 font-semibold">
          {{ $t("addressBook.exportContacts") }}
        </div>
        <div class="flex cursor-pointer">
          <div
            class="border-2 border-blue-primary p-1 mb-3 w-16 text-white bg-blue-primary text-xs text-center font-semibold"
          >
            {{ $t("general.group") }}
          </div>
          <router-link
            :to="{ name: 'ViewServicesAddressBookExportSelect' }"
            class="border-2 border-blue-primary p-1 mb-3 w-16 text-blue-primary text-xs text-center font-semibold"
            >{{ $t("general.name") }}
          </router-link>
        </div>
        <div class="text-tsm">{{ $t("addressBook.exportBackUpContact") }}</div>
        <div class="my-4 flex flex-wrap gap-2 justify-between">
          <Dropdown
            v-model="selectContactGroups"
            :options="contactGroups"
            option-label="label"
            placeholder="Group"
            class="w-60 mr-2 text-xs"
          />
          <div class="flex gap-3 items-center">
            <div
              class="w-60 px-3 py-1 flex justify-between mb-3 mt-3 md:mt-0 md:mb-0 border border-gray-200"
            >
              <input
                v-model="filters['global'].value"
                type="text"
                class="w-28 outline-none text-xs float-left"
                :placeholder="$t('general.search')"
              />
              <img
                src="@/modules/services/submodule/addressbook/img/icon-search_black.svg"
                class="inline-block"
              />
            </div>
            <div
              @click="exportCSV()"
              class="cursor-pointer px-5 py-0.5 rounded-md w-36 bg-blue-primary text-white text-tsm shadow-lg filter hover:bg-blue-600 transition-all duration-500"
            >
              <img
                src="@/modules/services/submodule/addressbook/img/icon-upload.svg"
                class="inline-block mr-4 relative "
              />{{ $t("general.export") }}
            </div>
          </div>
        </div>
      </div>

      <DataTable
        :value="formattedContacts"
        ref="dt"
        v-model:filters="filters"
        :paginator="true"
        :rows="10"
        responsiveLayout="scroll"
        scrollDirection="horizontal"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate=""
        :globalFilterFields="['group']"
      >
        <Column
          field="name"
          :header="$t('general.label')"
          headerStyle="width:30%"
        >
          <template #body="{ data }">
            {{ data.name }}
          </template>
        </Column>
        <Column
          field="address"
          :header="$t('general.address')"
          headerStyle="width:55%"
        >
          <template #body="{ data }">
            {{ Helper.createAddress(data.address).pretty() }}
          </template>
        </Column>
        <Column
          field="group"
          :header="$t('general.group')"
          headerStyle="width:30%"
        >
          <template #body="{ data }">
            {{ data.group }}
          </template>
        </Column>
        <Column
          field="publicKey"
          :header="$t('general.publicKey')"
          headerStyle="width:55%"
        >
          <template #body="{ data }">
            {{ data.publicKey }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { walletState } from "@/state/walletState";
import { Helper } from "@/util/typeHelper";
import DataTable from "primevue/datatable";
import { FilterMatchMode } from "primevue/api";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const selectContactGroups = ref({
  value: "",
  label: t("general.showAll"),
});

const contactGroups = computed(() => {
  const groups = [
    ...new Set(
      walletState.currentLoggedInWallet?.contacts.map(
        (contact) => contact.group
      )
    ),
  ];
  const filteredGroups = groups.filter((group) => group != "-none-");

  return [{ value: "", label: t("general.showAll") }].concat(
    filteredGroups.map((group) => {
      return {
        label: group,
        value: group,
      };
    })
  );
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const formattedContacts = computed(() => {
  const contacts = walletState.currentLoggedInWallet?.contacts.map(
    (contact) => {
      return {
        name: contact.name,
        address: Helper.createAddress(contact.address).pretty(),
        group: contact.group,
        publicKey: contact.publicKey ? contact.publicKey : null,
      };
    }
  );
  return selectContactGroups.value.value == ""
    ? contacts.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      })
    : contacts
        .filter((contact) => contact.group == selectContactGroups.value.value)
        .sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
});

const dt = ref();

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
