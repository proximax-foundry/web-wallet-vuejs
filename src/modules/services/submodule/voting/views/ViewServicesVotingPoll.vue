<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('common.vote')}} ></span> <span class="text-blue-primary font-bold">{{$t('common.viewAll')}}</span></div>
    <div>
      <router-link :to="{ name: 'ViewServicesVotingCreatePoll'}" class="font-bold">{{$t('common.new')}}</router-link> |
      <router-link :to="{ name: 'ViewServices'}" class="font-bold">{{$t('common.allServices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line'>
    <div class="grid xs:grid-cols-1 sm:grid-cols-7">
      <div class="xs:col-span-1 sm:col-span-3 md:col-span-2 lg:col-span-2">
          <SelectInputPlugin selectDefault="all" showSelectTitleProp="true" placeholder="Search" errorMessage="Select Search" v-model="searchType" :options="searchOption()" class="flex-grow" />
      </div>
      <div class="xs:col-span-1 sm:col-span-4 md:col-span-4 md:px-10 sm:my-5">
        <div class="flex transition ease-in duration-300 w-full rounded-full px-5 py-1" :class="borderColor" style="height: 45px;">
          <input type="text" v-model="filters['global'].value" class="w-full outline-none text-sm self-center" placeholder="Search" @click="clickInputText()" @blur="blurInputText()">
        </div>
      </div>
      <div class=" col-span-1 sm:col-span-7 md:col-span-1 my-5 sm:my-0 md:my-5 flex">
        <button class="default-btn py-1 flex-grow">{{$t('common.refresh')}}</button>
      </div>
    </div>
    <DataTable
      class="mt-10"
      :value="poll"
      v-model:filters="filters"
      @row-click="rowClick"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      :globalFilterFields="filterBy">
      <Column field="name" header="Name" headerStyle="width:250px"></Column>
      <Column field="pollType" header="Poll Type" headerStyle="width:200px"></Column>
      <Column field="endDate" header="EndDate" headerStyle="width:200px"></Column>
      <Column field="status" header="Status" headerStyle="width:100px"></Column>
      <template #empty>
        {{$t('services.noRecord')}}
      </template>
    </DataTable>
  </div>
</template>
<script>
import { computed, ref } from "vue";
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import {FilterMatchMode} from 'primevue/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRouter } from "vue-router";

export default {
  name: 'ViewServicesVotingPoll',
  components: {
    SelectInputPlugin,
    DataTable,
    Column
  },

  setup() {
    const router = useRouter();
    const searchType = ref('all');
    const borderColor = ref('border border-gray-400');

    const searchOption = () => {
      let search = [];
      search.push({ label: 'All', value: 'all'});
      search.push({ label: 'Name', value: 'name'});
      search.push({ label: 'Type', value: 'pollType'});
      search.push({ label: 'Status', value: 'status'});
      search.push({ label: 'ID Address (private poll)', value: 'address'});
      return search;
    }

    const filterBy = computed( () => {
      switch (searchType.value){
        case 'all':
          return ['name','pollType','endDate', 'status'];
        case 'name':
          return ['name'];
        case 'pollType':
          return ['pollType'];
        case 'status':
          return ['status'];
        case 'address':
          return ['name','pollType','endDate', 'status'];
        default:
          return ['name','pollType','endDate', 'status'];
      }
    });

    const clickInputText = () => {
      borderColor.value = 'border border-white-100 drop-shadow';
    };

    const blurInputText = () => {
      borderColor.value = 'border border-gray-400';
    };

    const rowClick = (e) => {
      router.push({ name: "ViewServicesVotingViewPoll", params: {pollid: e.data.id, pollname: encodeURI(e.data.name) }});
    }

    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });

    const poll = ref([
      {
        id: '23543543535435',
        name: 'Poll 1',
        pollType: 'Open',
        endDate: '3/7/21 5:00pm',
        status: 'Ongoing',
      },
      {
        id: '3454354354334',
        name: 'Poll 2',
        pollType: 'Open',
        endDate: '15/6/21 3:00pm',
        status: 'Ongoing',
      },
      {
        id: '23447684567546',
        name: 'Poll 3',
        pollType: 'Open',
        endDate: '10/6/21 5:00pm',
        status: 'Ongoing',
      },
      {
        id: '945675463454',
        name: 'Poll 4',
        pollType: 'Open',
        endDate: '8/6/21 2:00pm',
        status: 'Ongoing',
      },
      {
        id: '945675463455',
        name: 'Poll 5',
        pollType: 'Whitelist',
        endDate: '6/6/21 4:00pm',
        status: 'Ongoing',
      },
      {
        id: '945675463456',
        name: 'Poll 6',
        pollType: 'Open',
        endDate: '4/6/21 6:00pm',
        status: 'Ongoing',
      },
      {
        id: '945675463457',
        name: 'Poll 7',
        pollType: 'Open',
        endDate: '3/6/21 5:00pm',
        status: 'Ongoing',
      },
      {
        id: '945675463458',
        name: 'Poll 8',
        pollType: 'Whitelist',
        endDate: '3/5/21 5:00pm',
        status: 'Ended',
      },
    ]);

    return {
      searchType,
      searchOption,
      borderColor,
      clickInputText,
      blurInputText,
      rowClick,
      poll,
      filters,
      filterBy,
    };
  },
}
</script>
