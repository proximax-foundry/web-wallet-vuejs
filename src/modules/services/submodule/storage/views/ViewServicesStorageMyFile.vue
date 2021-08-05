<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('welcome.storage')}} ></span> <span class="text-blue-primary font-bold">Files</span></div>
    <div>
      <router-link :to="{ name: 'ViewServicesStorageUploadFile'}" class="font-bold">{{$t('services.uploadfile')}}</router-link> |
      <router-link :to="{ name: 'ViewServices'}" class="font-bold">{{$t('services.allservices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line'>
    <div class="grid xs:grid-cols-1 sm:grid-cols-7">
      <div class="xs:col-span-1 sm:col-span-3 md:col-span-2 lg:col-span-2">
          <SelectInputPlugin selectDefault="name" showSelectTitleProp="true" placeholder="Search" errorMessage="Select Search" v-model="searchType" :options="searchOption()" class="flex-grow" />
      </div>
      <div class="xs:col-span-1 sm:col-span-4 md:col-span-4 md:px-10 sm:my-5">
        <div class="flex transition ease-in duration-300 w-full rounded-full px-5 py-1" :class="borderColor" style="height: 45px;">
          <input type="text" v-model="filters['global'].value" class="w-full outline-none text-sm self-center" placeholder="Search" @click="clickInputText()" @blur="blurInputText()">
        </div>
      </div>
      <div class=" col-span-1 sm:col-span-7 md:col-span-1 my-5 sm:my-0 md:my-5 flex">
        <button class="default-btn py-1 flex-grow">{{$t('services.search')}}</button>
      </div>
    </div>
    <DataTable
      class="mt-10"
      :value="files"
      v-model:filters="filters"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      :globalFilterFields="filterBy">
      <Column field="date" header="Date" headerStyle="width:300px"></Column>
      <Column field="name" header="Name" headerStyle="width:250px">
        <template #body="{data}">
          <img src="@/modules/services/submodule/storage/img/icon-doc-type-unknown-16h-proximax-sirius-wallet.svg" class="w-7 h-7 inline-block mr-3"> {{ data.name }}
        </template>
      </Column>
      <Column field="action" header="Action" headerStyle="width:100px">
        <template #body="{data}">
          <img src="@/modules/services/submodule/storage/img/icon-download-green-16h-proximax-sirius-wallet.svg" class="w-7 h-7 inline-block mr-3 cursor-pointer" @click="openDownloadModal(data)">
        </template>
      </Column>
      <template #empty>
       {{$t('services.norecord')}}
      </template>
    </DataTable>
    <DownloadFileModal :showModal="showDownloadFileModel" :fileName="fileName" />
  </div>
</template>
<script>
import { computed, getCurrentInstance, ref } from "vue";
import DownloadFileModal from '@/modules/services/submodule/storage/components/DownloadFileModal.vue';
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import {FilterMatchMode} from 'primevue/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
  name: 'ViewServicesStorageMyFile',
  components: {
    SelectInputPlugin,
    DataTable,
    Column,
    DownloadFileModal,
  },

  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const searchType = ref('all');
    const borderColor = ref('border border-gray-400');

    const searchOption = () => {
      let search = [];
      search.push({ label: 'File Name', value: 'name'});
      search.push({ label: 'Data Hash', value: 'hash'});
      search.push({ label: 'Private (Encrypted)', value: 'private'});
      return search;
    }

    const filterBy = computed( () => {
      switch (searchType.value){
        case 'name':
          return ['name'];
        case 'hash':
          return ['name'];
        case 'private':
          return ['name'];
        default:
          return ['name'];
      }
    });

    const clickInputText = () => {
      borderColor.value = 'border border-white-100 drop-shadow';
    };

    const blurInputText = () => {
      borderColor.value = 'border border-gray-400';
    };

    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });

    const files = ref([
      {
        id: '23543543535435',
        date: 'Mon, 31 May 2021 09:42:12 GMT',
        name: 'file1.txt',
      },
      {
        id: '23543543535440',
        date: 'Tue, 4 May 2021 12:40:14 GMT',
        name: 'file2.txt',
      },
      {
        id: '23543543535444',
        date: 'Mon, 3 May 2021 10:18:37 GMT',
        name: 'file3.txt',
      },
    ]);

    const showDownloadFileModel = ref(false);
    const fileName = ref('');

    const openDownloadModal = (data) => {
      fileName.value = data.name;
      showDownloadFileModel.value = true;
    }

    emitter.on("CLOSE_MODAL", payload => {
      showDownloadFileModel.value = payload;
    });

    return {
      searchType,
      searchOption,
      borderColor,
      clickInputText,
      blurInputText,
      files,
      filters,
      filterBy,
      openDownloadModal,
      showDownloadFileModel,
      fileName,
    };
  },
}
</script>
<style lang="scss" scoped>
/deep/ .p-datatable-wrapper{
  .p-datatable-tbody{
    tr{
      td{
        cursor: auto !important;
      }
    }
  }
}

</style>