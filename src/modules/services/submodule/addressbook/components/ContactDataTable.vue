<template>
  <div>
    <div class="flex justify-between">
      <div class="flex items-center">
        <div class='font-semibold mr-10'>Address Book</div>
        <SelectInputPluginClean v-model="selectContactGroups" :options="contactGroups" selectDefault="" class="w-60 mr-4" />
        <div class="w-30 px-3 py-1" :class="borderColor">
          <input v-model="filters['global'].value" type="text" class="w-26 outline-none text-xs" :placeholder="$t('services.search')" @click="clickInputText()" @blur="blurInputText()">
          <img src="@/modules/services/submodule/addressbook/img/icon-search_black.svg" class="inline-block">
        </div>
      </div>
      <router-link :to="{ name: 'ViewServicesAddressBookAddContact' }"  class="bg-blue-primary text-gray-50 text-tsm px-5 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300">+ Add New Address</router-link>
    </div>
    <div class='mt-2 py-3 gray-line'>
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
        :globalFilterFields="['name','address']">
        <Column field="name" headerStyle="width:95%">
          <template #body="{data}">
            <div class="flex items-center">
              <div v-html="data.svgString" class="mr-2 inline-block"></div>
              <div class="inline-block">
                <div class="text-blue-primary text-tsm">{{data.name}} <span class="inline-block ml-5 rounded-md text-blue-primary bg-blue-200 px-2 py-1 text-xxs font-bold" v-if="data.group!='-none-'">{{ data.group }}</span></div>
                <div class="mt-1 text-tsm">{{data.address}}</div>
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 50px;">
          <template #body="{data}">
            <div class="text-txs text-center lg:mr-2" @mouseover="hoverOverMenu(data.i)" @mouseout="hoverOutMenu">
              <img src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block" @click="showMenu(data.i)">
              <div v-if="isMenuShow[data.i]" class="mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <div role="none" class="my-2">
                  <router-link :to="{ name: 'ViewServicesAddressBookEditContact' , params: { contactAddress: data.address }}" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Edit</router-link>
                  <ConfirmDeleteContactModal :data="data" class="block" />
                </div>
              </div>
            </div>
          </template>
        </Column>
        <template #empty>
          <div>Nothing to show</div>
          <div>You can add multiple wallet addresses to keep for your future transactions.</div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import { computed, ref, getCurrentInstance } from "vue";
import SelectInputPluginClean from "@/components/SelectInputPluginClean.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import ConfirmDeleteContactModal from '@/modules/services/submodule/addressbook/components/ConfirmDeleteContactModal.vue';
import { Helper } from "@/util/typeHelper";
import { walletState } from '@/state/walletState';
import { toSvg } from "jdenticon";

export default{
  components: {
    SelectInputPluginClean,
    DataTable,
    Column,
    ConfirmDeleteContactModal,
  },
  name: 'ContactDataTable',

  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const isMenuShow = ref([]);
    const selectContactGroups = ref('');
    const borderColor = ref('border border-gray-200');
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });

    const clickInputText = () => {
      borderColor.value = 'border border-white-100 drop-shadow-md';
    };

    const blurInputText = () => {
      borderColor.value = 'border border-gray-200';
    };

    const contactGroupsList = ref([]);

    const formattedContacts = computed(() => {

      let jdenticonconfig = {
          hues: [211],
          lightness: {
              color: [0.32, 0.80],
              grayscale: [0.17, 0.82]
          },
          saturation: {
              color: 1.00,
              grayscale: 0.00
          },
          backColor: "#fff"
      };
      let contracts = []
      if(walletState.currentLoggedInWallet.contacts != undefined){
        if(walletState.currentLoggedInWallet.contacts.length > 0){
          if(selectContactGroups.value == ''){
            walletState.currentLoggedInWallet.contacts.forEach((contact, i) => {
              let data = {
                i: i,
                name: contact.name,
                address: Helper.createAddress(contact.address).pretty(),
                group: contact.group,
                svgString: toSvg(contact.address, 45, jdenticonconfig),
              };
              contracts.push(data);
              isMenuShow.value[i] = false;
              contactGroupsList.value.push(contact.group);
            });
          }else{
            walletState.currentLoggedInWallet.contacts.filter((contact) => contact.group == selectContactGroups.value).forEach((contact, i) => {
              let data = {
                i: i,
                name: contact.name,
                address: Helper.createAddress(contact.address).pretty(),
                group: contact.group,
                svgString: toSvg(contact.address, 45, jdenticonconfig),
              };
              contracts.push(data);
              isMenuShow.value[i] = false;
              contactGroupsList.value.push(contact.group);
            });
          }
          contracts.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
          });
        }
      }
      return contracts;
    });

    const dt = ref();

    function uniqueValue(value, index, self) {
      return self.indexOf(value) === index;
    }

    const contactGroups = computed(() => {
      var uniqueGroupLabels = contactGroupsList.value.filter(uniqueValue);
      uniqueGroupLabels = uniqueGroupLabels.filter((value) => value != '-none-');
      uniqueGroupLabels.sort();
      let action = [];
      action.push(
        {value: '', label: 'Show All'},
      );
      uniqueGroupLabels.forEach(label => {
        action.push({value: label, label});
      })
      return action;
    });

    const showMenu = (i) => {
      currentMenu.value = i;
      isMenuShow.value[i] = !isMenuShow.value[i];
    }

    const currentMenu = ref('');

    // emitted from App.vue when click on any part of the page
    emitter.on('PAGE_CLICK', () => {
      var k = 0;
      while(k < isMenuShow.value.length){
        if(k != currentMenu.value){
          isMenuShow.value[k] = false;
        }
        k++;
      }
    });

    emitter.on('CLOSE_CONTACTMENU_PANEL', () => {
      var k = 0;
      while(k < isMenuShow.value.length){
        isMenuShow.value[k] = false;
        k++;
      }
    });

    const hoverOverMenu = (i) => {
      currentMenu.value = i;
    };

    const hoverOutMenu = () => {
      currentMenu.value = 'e';
    };

    return {
      formattedContacts,
      selectContactGroups,
      contactGroups,
      dt,
      borderColor,
      filters,
      clickInputText,
      blurInputText,
      Helper,
      showMenu,
      isMenuShow,
      hoverOverMenu,
      hoverOutMenu,
    }
  },
}
</script>

<style lang="scss" scoped>
.p-datatable-tbody{
  td > div{
    font-size: 13px;
  }

  tr:hover td{
    @apply bg-blue-100 ;cursor: auto;

    > div > svg{
      @apply text-gray-200;
    }

    > div > svg:hover{
      @apply text-white;
    }
  }
}

.export-icon:hover {
  @apply border-blue-primary bg-blue-primary;
  >div{
    @apply text-white;
  }
  svg{
    @apply text-white
  }
}

.p-datatable-tbody{
  td{
    font-size: 11px;
  }
}

.pop-option:after {
  content: '';
  display: block;
  position: absolute;
  top: -6px;
  right: 20px;
  width: 10px;
  height: 10px;
  background: #FFFFFF;
  border-left:1px solid #E4E4E4;
  border-top:1px solid #E4E4E4;
  -moz-transform:rotate(45deg);
  -webkit-transform:rotate(45deg);
  z-index: 2;
}
</style>