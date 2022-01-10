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
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">Tx Hash</div>
            <div class="uppercase font-bold text-txs"><span class="text-txs" v-tooltip.right="data.hash">{{data.hash.substring(0, 20) }}...</span></div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Type</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-txs mr-2">{{data.type}}</div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Asset ID</div>
            <div class="flex items-center">
              <div class="text-txs font-bold">{{ data.assetId }}{{ data.namespaceName ? `(${data.namespaceName})`: "" }}</div>
            </div>
          </div>
        </template>
      </Column>
      <Column headerStyle="width:200px" v-if="!wideScreen">
        <template #body="{data}">
          <div v-if="selectedGroupType === transactionGroupType.CONFIRMED">
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">Timestamp</div>
            <div class="uppercase font-bold text-txs">{{ convertLocalTime(data.timestamp) }}</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Info</div>
            <div>
              <div class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mr-1 rounded" v-if="data.nonce">{{ `Nonce: ${data.nonce}` }}</div>
              <div class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mr-1 rounded" v-if="data.divisibility !== null">{{ `Divisibility: ${data.divisibility}` }}</div>
              <div v-bind:class="['inline-block','text-black', 'py-1', 'px-2', 'my-1', 'mr-1', 'text-txs', 'font-bold', 'rounded', (data.transferable) ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700']" v-if="data.transferable !== null">Transferable</div>
              <div v-bind:class="['inline-block','text-black', 'py-1', 'px-2', 'my-1', 'mr-1', 'text-txs', 'font-bold', 'rounded', (data.supplyMutable) ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700']" v-if="data.supplyMutable !== null">Supply Mutable</div>
              <div class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mr-1 rounded" v-if="data.duration">{{ `Duration: ${data.duration}` }}</div>
              <div class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mr-1 rounded" v-if="data.supplyDelta !== null">Supply:{{ data.supplyDelta > 0 ? "+" + data.supplyDelta : data.supplyDelta }}</div>
              <div v-if="data.levyAssetId">
                <div class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mr-1 rounded">
                  Levy: {{ data.levyAssetId }}{{ data.levyAssetName ? `(${data.levyAssetName})`: "" }}
                </div>
                <div class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mr-1 rounded" >
                  Levy Amount: {{ data.levyAssetAmount }}
                </div>
                <div v-tooltip.bottom="data.levyRecipient" class="inline-block bg-blue-100 text-blue-700 font-bold text-txs rounded py-1 px-2 my-1 mr-1 truncate">
                  Levy Recipient: {{ data.levyRecipient }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </Column>
      <Column field="hash" header="TX HASH" headerStyle="width:100px" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column field="timestamp" header="TIMESTAMP" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px">
        <template #body="{data}">
          <span class="text-txs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" header="TYPE" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="block" header="BLOCK" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs">{{ data.block }}</div>
        </template>
      </Column>
      <Column header="TX FEE" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>

      <Column header="ASSET ID" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-txs">{{ data.assetId }}{{ data.namespaceName ? `(${data.namespaceName})`: "" }}</div>
        </template>
      </Column>
      <Column header="INFO" headerStyle="width:40px" v-if="wideScreen">
        <template #body="{data}">
          <span class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mx-1 rounded" v-if="data.nonce">{{ `Nonce: ${data.nonce}` }}</span>
          <span class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mx-1 rounded" v-if="data.divisibility !== null">{{ `Divisibility: ${data.divisibility}` }}</span>
          <span v-bind:class="['inline-block','text-black', 'py-1', 'px-2', 'my-1', 'mx-1', 'text-txs', 'font-bold', 'rounded', (data.transferable) ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700']" v-if="data.transferable !== null">Transferable</span>
          <span v-bind:class="['inline-block','text-black', 'py-1', 'px-2', 'my-1', 'mx-1', 'text-txs', 'font-bold', 'rounded', (data.supplyMutable) ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700']" v-if="data.supplyMutable !== null">Supply Mutable</span>
          <span class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mx-1 rounded" v-if="data.duration">{{ `Duration: ${data.duration}` }}</span>
          <span class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mx-1 rounded" v-if="data.supplyDelta !== null">Supply:{{ data.supplyDelta > 0 ? "+" + data.supplyDelta : data.supplyDelta }}</span>
          <span v-if="data.levyAssetId">
            <span class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mx-1 rounded">
              Levy: {{ data.levyAssetId }}{{ data.levyAssetName ? `(${data.levyAssetName})`: "" }}
            </span>
            <span class="inline-block bg-blue-100 text-blue-700 font-bold text-txs py-1 px-2 my-1 mx-1 rounded" >
              Levy Amount: {{ data.levyAssetAmount }}
            </span>
            <span v-tooltip.bottom="data.levyRecipient" class="inline-block bg-blue-100 text-blue-700 font-bold text-txs rounded py-1 px-2 my-1 mx-1 truncate">
              Levy Recipient: {{ data.levyRecipient }}
            </span>
          </span>
        </template>
      </Column>
      <Column header="" headerStyle="width:50px">
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
import { getCurrentInstance, ref, computed, watch, onMounted, onUnmounted } from "vue";
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
    const wideScreen = ref(false);
    const screenResizeHandler = () => {
      if(window.innerWidth < 1024){
        wideScreen.value = false;
      }else{
        wideScreen.value = true;
      }
    };
    screenResizeHandler();

    onUnmounted(() => {
      window.removeEventListener("resize", screenResizeHandler);
    });

    onMounted(() => {
      window.addEventListener("resize", screenResizeHandler);
    });

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
      constructSDA,
      wideScreen,
      Helper,
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/transactions-data-table.scss";
</style>