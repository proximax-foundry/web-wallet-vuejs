<template>
  <div>
    <DataTable
      :value="transactions"
      :paginator="true"
      :rows="10"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      responsiveLayout="scroll"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      >
      <Column field="hash" header="TX HASH" headerStyle="width:100px">
        <template #body="{data}">
          <span class="text-txs" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column field="timestamp" header="TIMESTAMP" v-if="selectedGroupType === transactionGroupType.CONFIRMED" headerStyle="width:110px">
        <template #body="{data}">
          <span class="text-txs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" header="TYPE" headerStyle="width:110px">
        <template #body="{data}">
          <span class="text-txs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="block" header="BLOCK" v-if="selectedGroupType === transactionGroupType.CONFIRMED" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs">{{ data.block }}</div>
        </template>
      </Column>
      <Column header="TX FEE" v-if="selectedGroupType === transactionGroupType.CONFIRMED" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>

      <Column header="ASSET ID" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs">{{ data.assetId }}{{ data.namespaceName ? `(${data.namespaceName})`: "" }}</div>
        </template>
      </Column>
      <Column header="INFO" headerStyle="width:40px">
        <template #body="{data}">
          <span class="inline-block bg-blue-500 text-white py-1 px-1 my-1 mx-1" v-if="data.nonce">{{ `Nonce: ${data.nonce}` }}</span>
          <span class="inline-block bg-blue-500 text-white py-1 px-1 my-1 mx-1" v-if="data.divisibility !== null">{{ `Divisibility: ${data.divisibility}` }}</span>
          <span v-bind:class="['inline-block','text-black', 'py-1', 'px-1', 'my-1', 'mx-1', (data.transferable) ? 'bg-green-300' : 'bg-red-300']" v-if="data.transferable !== null">Transferable</span>
          <span v-bind:class="['inline-block','text-black', 'py-1', 'px-1', 'my-1', 'mx-1', (data.supplyMutable) ? 'bg-green-300' : 'bg-red-300']" v-if="data.supplyMutable !== null">Supply Mutable</span>
          <span class="inline-block bg-blue-500 text-white py-1 px-1 my-1 mx-1" v-if="data.duration">{{ `Duration: ${data.duration}` }}</span>
          <span class="inline-block bg-blue-500 text-white py-1 px-1 my-1 mx-1" v-if="data.supplyDelta !== null">Supply:{{ data.supplyDelta > 0 ? "+" + data.supplyDelta : data.supplyDelta }}</span>
          <span v-if="data.levyAssetId">
            <span class="inline-block bg-blue-500 text-white py-1 px-1 my-1 mx-1">
              Levy: {{ data.levyAssetId }}{{ data.levyAssetName ? `(${data.levyAssetName})`: "" }}
            </span>
            <span class="inline-block bg-blue-500 text-white py-1 px-1 my-1 mx-1" >
              Levy Amount: {{ data.levyAssetAmount }}
            </span>
            <span v-tooltip.bottom="data.levyRecipient" class="inline-block bg-blue-500 text-white py-1 px-1 my-1 mx-1 truncate inline-block">
              Levy Recipient: {{ data.levyRecipient }}
            </span>
          </span>
        </template>
      </Column>
      <Column header="" headerStyle="width:20px">
        <template #body="{data}">
          <img src="@/modules/dashboard/img/icon-open_in_new_black.svg" @click="gotoHashExplorer(data.hash)" class="cursor-pointer">
        </template>
      </Column>
      <template #empty>
        {{$t('services.norecord')}}
      </template>
      <template #loading>
          {{$t('dashboard.loadingmessage')}}
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getCurrentInstance, ref, computed, watch } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import { networkState } from "@/state/networkState";
import Tooltip from 'primevue/tooltip';
import { ChainUtils } from "@/util/chainUtils";
import { ChainAPICall } from "@/models/REST/chainAPICall";
import { Helper } from "@/util/typeHelper";
// import SplitButton from 'primevue/splitbutton';

export default defineComponent({
  components: {
    DataTable,
    Column,
    // SplitButton
  },
  name: 'AssetTxnDataTable',
  props: {
    transactions: Array,
    selectedGroupType: String,
    currentAddress: String
  },
  emits: ['openMessage', 'openDecryptMsg'],
  directives: {
    'tooltip': Tooltip
  },
  setup(p, context){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const borderColor = ref('border border-gray-400');
    const showTransactionModel = ref(false);
    const transactionGroupType = Helper.getTransactionGroupType();
    
    const nativeTokenName = computed(()=> networkState.currentNetworkProfile?.network.currency.name);
    
    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const blockExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.blockRoute);
    const publicKeyExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.publicKeyRoute);
    const addressExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.addressRoute);
    const hashExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.hashRoute);
    const namespaceExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute);
    const assetExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.assetInfoRoute);

    const dynamicModelComponentDisplay = ref('TransferTransactionModal');

    const clickInputText = () => {
      borderColor.value = 'border border-white-100 drop-shadow';
    };

    const blurInputText = () => {
      borderColor.value = 'border border-gray-400';
    };

    emitter.on("CLOSE_MODAL", payload => {
      showTransactionModel.value = payload;
    });

    const getPublicKeyExplorerUrl = (publicKey) =>{

      return explorerBaseURL.value + publicKeyExplorerURL.value + "/" + publicKey
    }

    const getNamespaceExplorerUrl = (namespaceIdHex) =>{

      return explorerBaseURL.value + namespaceExplorerURL.value + "/" + namespaceIdHex
    }

    const getAssetExplorerUrl = (assetIdHex) =>{

      return explorerBaseURL.value + assetExplorerURL.value + "/" + assetIdHex
    }

    const getAddressExplorerUrl = (address) =>{

      return explorerBaseURL.value + addressExplorerURL.value + "/" + address
    }

    const getHashExplorerUrl = (hash) =>{

      return explorerBaseURL.value + hashExplorerURL.value + "/" + hash
    }

    const gotoHashExplorer = (hash)=>{
      window.open(explorerBaseURL.value + hashExplorerURL.value + "/" + hash, "_blank");
    }

    const constructSDA = (assetId, amount, namespaceName) => {
      return namespaceName ? amount + ' ' + namespaceName : assetId + ' - ' + amount;
    }

    const convertLocalTime = (dateTimeInJSON)=>{
      return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
    };

    return {
      borderColor,
      clickInputText,
      blurInputText,
      showTransactionModel,
      dynamicModelComponentDisplay,
      blockExplorerURL,
      addressExplorerURL,
      assetExplorerURL,
      namespaceExplorerURL,
      hashExplorerURL,
      publicKeyExplorerURL,
      explorerBaseURL,
      getPublicKeyExplorerUrl,
      getNamespaceExplorerUrl,
      getAssetExplorerUrl,
      getAddressExplorerUrl,
      getHashExplorerUrl,
      gotoHashExplorer,
      nativeTokenName,
      convertLocalTime,
      transactionGroupType,
      constructSDA
    }
  }
})
</script>

<style lang="scss">
.p-datatable-tbody{
  td{
    font-size: 11px;
  }
}

.truncate {
  max-width: 10em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate-lg {
  max-width: 15em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate-lg.inline-block{
  vertical-align: middle;
}

.truncate.inline-block{
  vertical-align: middle;
}

.inline-block{
  .truncate{
    vertical-align: middle;
  }

  .truncate-lg{
    vertical-align: middle;
  }
}

.p-splitbutton-defaultbutton{
  .p-button-label{
    padding-left: 5px;
    padding-right: 5px;
  }
}

.p-menu{
  background-color: white;
  min-width: 105px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 10px;
  padding-bottom: 10px;

  .p-menuitem-link{
    padding-bottom: 3px;
    padding-top: 3px;

    .p-menuitem-icon{
      padding: 5px;
    }

    .p-menuitem-text{
      padding-right: 30px;
    }

    &:hover{
      --tw-bg-opacity: 1;
      background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
    }
  }
}

</style>