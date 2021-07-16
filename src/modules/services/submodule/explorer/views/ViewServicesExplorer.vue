<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">{{$t('services.txexplorer')}} ></span> <span class="text-blue-primary font-bold">{{$t('services.explorer')}}</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices'}" class="font-bold">{{$t('services.allservices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line pt-10 px-20'>
    <div class="grid xs:grid-cols-1 sm:grid-cols-7">
      <div class="xs:col-span-1 sm:col-span-3 md:col-span-2 lg:col-span-2">
          <SelectInputPlugin placeholder="Search Type" errorMessage="Select Search Type" v-model="searchType" :options="searchOption()" class="flex-grow" />
      </div>
      <div class="xs:col-span-1 sm:col-span-4 md:col-span-4 md:px-10 sm:my-5">
        <div class="flex transition ease-in duration-300 w-full rounded-full px-5 py-1" :class="borderColor" style="height: 45px;">
          <input type="text" v-model="searchInput" class="w-full outline-none text-sm self-center" placeholder="Search" @click="clickInputText()" @blur="blurInputText()">
        </div>
      </div>
      <div class=" col-span-1 sm:col-span-7 md:col-span-1 my-5 sm:my-0 md:my-5 flex">
        <button class="default-btn py-1 flex-grow" @click="SearchTransaction()">{{$t('services.search')}}</button>
      </div>
    </div>
    <DataTable
      v-show="displayResult"
      :value="searchedTransaction"
      v-model:filters="filters"
      @row-click="rowClick"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      :globalFilterFields="searchFilterBy">
      <Column field="typeName" header="Type" headerStyle="width:110px">
        <template #body="{data}">
          {{data.typeName}}<div v-show="false">{{data.hash}}</div>
        </template>
      </Column>
      <Column field="transferType" header="In/Out" headerStyle="width:10px">
        <template #body="{data}">
          <img src="@/modules/dashboard/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg" class="w-5 h-5 inline-block" v-if="data.transferType=='in'">
          <img src="@/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg" class="w-5 h-5 inline-block" v-else>
        </template>
      </Column>
      <Column field="senderName" header="Sender" headerStyle="width:300px">
        <template #body="{data}">
          <span :title="data.senderAddress" v-if="data.senderName">{{data.senderName}}</span>
          <span v-else>{{data.senderAddress}}</span>
        </template>
      </Column>
      <Column field="recipient" header="Recipient" headerStyle="width:300px">
        <template #body="{data}">
          <span :title="data.recipientAddress" v-if="data.recipientName">{{data.recipientName}}</span>
          <span v-else>{{data.recipientAddress}}</span>
        </template>
      </Column>
      <template #empty>
        {{$t('services.norecord')}}
      </template>
    </DataTable>
    <DataTable
      v-show="!displayResult"
      :value="searchedTransaction"
      v-model:filters="filters"
      :rows="10"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
    >
      <Column field="typeName" header="Type" headerStyle="width:110px" />
      <Column field="transferType" header="In/Out" headerStyle="width:10px" />
      <Column field="senderName" header="Sender" headerStyle="width:300px" />
      <Column field="recipient" header="Recipient" headerStyle="width:300px" />
      <template #empty>
        {{$t('services.norecord')}}
      </template>
    </DataTable>
    <DynamicModelComponent :modelName="dynamicModelComponentDisplay" :showModal="showTransactionModel" :transaction="modalData" />
  </div>
</template>
<script>
import { computed, getCurrentInstance, inject, ref } from "vue";
import { PublicAccount, Order, QueryParams } from "tsjs-xpx-chain-sdk";
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import { transactions } from '@/util/transactions.js';
import { transferEmitter } from '@/util/listener.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import DynamicModelComponent from '@/modules/dashboard/components/DynamicModelComponent.vue'

export default {
  name: 'ViewServicesExplorerPartial',
  components: {
    DataTable, Column, DynamicModelComponent, SelectInputPlugin
  },

  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const modalData = ref(null);
    const showTransactionModel = ref(false);
    const displayResult = ref(true);
    const searchInput = ref('');
    const searchType = ref('');
    const searchFilterBy= ref([]);
    const borderColor = ref('border border-gray-400');
    const clickInputText = () => {
      borderColor.value = 'border border-white-100 drop-shadow';
    };

    const blurInputText = () => {
      borderColor.value = 'border border-gray-400';
    };

    const searchOption = () => {
      let search = [];
      search.push({ label: 'Address', value: 'address'});
      search.push({ label: 'Public Key', value: 'publicKey'});
      search.push({ label: 'Hash', value: 'hash'});
      return search;
    }

    const filterBy = computed( () => {
      switch (searchType.value){
        case 'address':
          return ['recipientAddress', 'recipientAddressRaw', 'senderAddress', 'senderAddressRaw'];
        case 'publicKey':
          return ['recipientAddress', 'recipientAddressRaw', 'senderAddress', 'senderAddressRaw'];
        case 'hash':
          return ['hash'];
        default:
          return [];
      }
    });

    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });

    const confirmedTransactions = ref([]);
    const searchedTransaction = ref([]);

    const dynamicModelComponentDisplay = ref('TransferTransactionModal');

    const pageSize = 10;

    const generateNames = () => {
      const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
      var contact = [];
      var accountCount = wallet.accounts.length;
      wallet.accounts.forEach((element, index) => {
        contact.push({
          address: element.address,
          name: element.name + ' - Owner\'s account',
          id: (index + 1),
        });
      });
      if(wallet.contacts!=undefined){
        wallet.contacts.forEach((element, index) => {
          contact.push({
            address: element.address,
            name: element.name + ' - Contact',
            id: (accountCount + index + 1),
          });
        });
      }
      return contact;
    }
    let names = generateNames();

    const getTransaction = (publicAccount, item, pageSize, lastId = null) => {
      let order = Order.ASC;
      let qp = new QueryParams(pageSize, lastId, order);
      let lastTransactionID = lastId;
      // format names

      siriusStore.accountHttp.transactions(publicAccount, qp).subscribe(tx => {
        if( tx.length > 0 ){
          tx.forEach((t)=>{
            let formattedTransaction = transactions.formatTransaction(t, names);
            confirmedTransactions.value.push(formattedTransaction);
            lastTransactionID = t.transactionInfo.id;
          })
        }
        if(tx.length == pageSize){
          // run again
          getTransaction(publicAccount, item, pageSize, lastTransactionID);
        }
      }, error => {
        console.error(error);
      });
    };

    const getConfirmedTransactions = () => {
      const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
      const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
      wallet.accounts.forEach((item) => {
        const publicAccount = PublicAccount.createFromPublicKey(item.publicAccount.publicKey, networkType);
        getTransaction(publicAccount, item, pageSize);
      });
    };
    getConfirmedTransactions();

    const rowClick = (e) => {
      // console.log(e.data.typeName);
      console.log(e.data);
      switch(e.data.typeName){
        case 'Transfer':
          dynamicModelComponentDisplay.value = 'TransferTransactionModal';
          break;
        case 'LockFund':
          dynamicModelComponentDisplay.value = 'LockFundModal';
          break;
        case 'Aggregate Bonded':
          dynamicModelComponentDisplay.value = 'AggregateBondedModal';
          break;
        case 'Aggregate Complete':
          dynamicModelComponentDisplay.value = 'AggregateBondedModal';
          break;
        default:
          dynamicModelComponentDisplay.value = 'TransferTransactionModal';
      }
      showTransactionModel.value = true;
      // modalData.value = Object.assign({}, e.data);
      modalData.value = e.data;
    };

    const SearchTransaction = () => {
      if(searchType.value == 'publicKey'){
        const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
        try {
          let publicAccount = PublicAccount.createFromPublicKey(searchInput.value, networkType);
          filters.value['global'].value = publicAccount.address.address;
        } catch (error) {
          filters.value['global'].value = '--';
        }
      }else{
        filters.value['global'].value = searchInput.value;
      }
      searchFilterBy.value = filterBy.value;
      searchedTransaction.value = confirmedTransactions.value;
    };


    emitter.on("CLOSE_MODAL", payload => {
      showTransactionModel.value = payload;
    });

    transferEmitter.on("UPDATE_DASHBOARD", payload => {
        switch(payload.from){
          case 'confirmed':{
            // console.log(payload.from)
            // console.log(payload.transaction)
            let formattedconfirmedListenerTransaction = transactions.formatTransaction(payload.transaction, names);
            confirmedTransactions.value.push(formattedconfirmedListenerTransaction);
            // console.log('Confirmed rows after addition: ' + confirmedTransactions.value.length)
            break;
          }
        }
    });

    return {
      modalData,
      filters,
      filterBy,
      searchFilterBy,
      searchOption,
      searchType,
      searchInput,
      borderColor,
      clickInputText,
      blurInputText,
      rowClick,
      showTransactionModel,
      dynamicModelComponentDisplay,
      confirmedTransactions,
      searchedTransaction,
      displayResult,
      SearchTransaction,
    };
  },
}
</script>
