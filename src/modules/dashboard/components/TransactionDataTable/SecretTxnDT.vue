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
      <Column header="IN/OUT" headerStyle="width:30px">
        <template #body="{data}">
          <div class="ml-2" v-if="data.recipient">
            <img src="@/modules/dashboard/img/icon-txn-in.svg" class="inline-block" v-if="isRecipient(data.recipient, currentAddress)">
            <img src="@/modules/dashboard/img/icon-txn-out.svg" class="inline-block" v-else >
          </div>
        </template>
      </Column>
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
      <!-- Display it in explorer, hide it if filter by signer -->
      <!-- <Column field="signer" header="SENDER" headerStyle="width:110px">
        <template #body="{data}">
          <span v-tooltip.bottom="data.signerAddress" class="truncate inline-block text-txs">
            <a :href="getAddressExplorerUrl(data.signerAddress)" target="_blank">
              {{ data.signerAddress }}
            </a>
          </span>
        </template>
      </Column> -->
      <Column field="recipient" header="RECIPIENT" headerStyle="width:110px">
        <template #body="{data}">
          <span v-tooltip.bottom="data.recipient" class="truncate inline-block text-txs">
            <a :href="getAddressExplorerUrl(data.recipient)" target="_blank">
              {{ data.recipient }}
            </a>
          </span>
        </template>
      </Column>
      <Column header="TX FEE" v-if="selectedGroupType === transactionGroupType.CONFIRMED" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column header="HASH TYPE" headerStyle="width:40px">
        <template #body="{data}">
          <div>
            {{ data.hashType }}
          </div>
        </template>
      </Column>
      <Column header="SECRET" headerStyle="width:40px">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-message.svg" v-tooltip.left="'<tiptitle>Secret</tiptitle><tiptext>' + data.secret + '</tiptext>'" class="inline-block">
          </div>
        </template>
      </Column>
      <Column header="Proof" headerStyle="width:40px">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-message.svg" v-if="data.proof" v-tooltip.left="'<tiptitle>Proof</tiptitle><tiptext>' + data.proof + '</tiptext>'" class="inline-block">
          </div>
        </template>
      </Column>
      <Column header="SDA" headerStyle="width:40px">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-sda.svg" v-if="data.assetId" class="inline-block" v-tooltip.left="'<tiptitle>Sirius Digital Asset</tiptitle><tiptext>' + constructSDA(data.assetId, data.amount, data.namespaceName) + '</tiptext>'">
          </div>
        </template>
      </Column>
      <Column header="Info" headerStyle="width:40px">
        <template #body="{data}">
          <!-- <span class="inline-block bg-blue-500 text-white py-1 px-1 my-1 mx-1">{{ `Hash Type: ${data.hashType}` }}</span> -->
          <span class="inline-block bg-blue-500 text-white py-1 px-1 my-1 mx-1" v-if="data.duration">{{ `Duration: ${data.duration} blocks` }}</span>
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
  name: 'SecretTxnDataTable',
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

    const isRecipient = (address, selectedAddress)=>{
      let currentAddress = Helper.createAddress(selectedAddress);
      let recipientAddress = Helper.createAddress(address);
      return currentAddress.plain() === recipientAddress.plain();
    }
    
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
      isRecipient,
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

<style lang="scss" scoped>
@import "@/assets/scss/transactions-data-table.scss";
</style>