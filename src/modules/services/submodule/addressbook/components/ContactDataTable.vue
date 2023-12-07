<template>
  <div>
    <div class="font-semibold mr-10 mb-4">{{ $t("general.addressBook") }}</div>
    <div class="xl:flex xl:justify-between pb-3 xl:pb-0">
      <div class="md:flex md:items-center md:justify-items-start">
      
        <Dropdown
          v-model="selectContactGroups"
          :options="contactGroups"
          option-label="label"
          placeholder="Select a City"
          class="w-full md:w-60 mr-4 text-xs"
        />
        <div
          class="w-full md:w-60 px-3 py-1 flex justify-between mb-3 mt-3 md:mt-0 md:mb-0 border border-gray-200"
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
      </div>
      <div class="mt-5 lg:mt-5 xl:mt-0">
        <router-link
          :to="{ name: 'ViewServicesAddressBookAddContact' }"
          class="default-btn transition-all duration-300"
          style="padding: auto 3px"
          >+ {{ $t("general.new") }}</router-link
        >
      </div>
    </div>
    <div class="mt-2 py-3 gray-line">
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
        :globalFilterFields="['name', 'address']"
      >
        <Column field="name" headerStyle="width:95%" headerClass="hidden">
          <template #body="{ data }">
            <div class="flex items-center">
              <div v-html="data.svgString" class="mr-2 inline-block"></div>
              <div class="inline-block">
                <div class="text-blue-primary text-tsm">
                  {{ data.name }}
                  <span
                    class="inline-block ml-5 rounded-md text-blue-primary bg-blue-200 px-2 py-1 text-xxs font-bold"
                    v-if="data.group != '-none-'"
                    >{{ data.group }}</span
                  >
                </div>
                <div class="mt-1 text-xs md:text-tsm">{{ data.address }}</div>
                <div
                  class="mt-1 text-xs md:text-tsm flex items-center bg-green-100 w-24"
                >
                  <div>{{ $t("general.publicKey") }}</div>
                  <font-awesome-icon
                    icon="check"
                    class="w-3 h-3 ml-3 inline-block text-blue-primary"
                    v-if="data.publicKey"
                  ></font-awesome-icon>
                  <font-awesome-icon
                    icon="times"
                    class="w-3 h-3 ml-3 inline-block text-blue-primary"
                    v-else
                  ></font-awesome-icon>
                </div>
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 50px" headerClass="hidden">
          <template #body="{ data }">
            <ContactAction
              :address="data.address"
              :publicKey="data.publicKey"
              :group="data.group"
              :name="data.name"
            ></ContactAction>
          </template>
        </Column>
        <template #empty>
          <div class="text-center my-5">
            <img
              src="@/modules/services/submodule/addressbook/img/open-book.svg"
              class="inline-block h-20 w-20"
            />
          </div>
          <div
            class="text-center text-blue-primary mb-2"
            style="font-size: 15px"
          >
            {{ $t("general.ntgToShow") }}
          </div>
          <div class="text-center text-gray-400" style="font-size: 12px">
            {{ $t("addressBook.addressBookTitle") }}
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { FilterMatchMode } from "primevue/api";
import { Helper } from "@/util/typeHelper";
import { walletState } from "@/state/walletState";
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from "@/models/stores/themeStyleConfig";
import { useI18n } from "vue-i18n";
import ContactAction from "./ContactAction.vue";

const { t } = useI18n();
const selectContactGroups = ref({
  value:'',
  label:  t("general.showAll") 
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

let themeConfig = new ThemeStyleConfig("ThemeStyleConfig");
themeConfig.init();
const formattedContacts = computed(() => {
  const contacts = walletState.currentLoggedInWallet?.contacts.map(
    (contact) => {
      return {
        name: contact.name,
        address: Helper.createAddress(contact.address).pretty(),
        group: contact.group,
        publicKey: contact.publicKey ? contact.publicKey : null,
        svgString: toSvg(contact.address, 45, themeConfig.jdenticonConfig),
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
</script>
