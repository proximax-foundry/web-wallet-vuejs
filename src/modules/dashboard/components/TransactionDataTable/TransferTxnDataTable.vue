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
          <div class="ml-2">
            <img src="@/modules/dashboard/img/icon-txn-in.svg" class="inline-block" v-if="data.in_out === true">
            <img src="@/modules/dashboard/img/icon-txn-out.svg" class="inline-block" v-else-if="data.in_out === false">
          </div>
        </template>
      </Column>
      <Column field="typeName" header="TX HASH" headerStyle="width:100px">
        <template #body="{data}">
          <span class="text-txs" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column field="typeName" v-if="selectedGroupType === transactionGroupType.CONFIRMED" header="TIMESTAMP" headerStyle="width:110px">
        <template #body="{data}">
          <span class="text-txs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" header="TYPE" headerStyle="width:110px">
        <template #body="{data}">
          <span class="text-txs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="block" v-if="selectedGroupType === transactionGroupType.CONFIRMED" header="BLOCK" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs">{{ data.block }}</div>
        </template>
      </Column>
      <Column field="signer" header="SENDER" headerStyle="width:110px">
        <template #body="{data}">
          <span v-if="data.sender === '' || data.sender === null"></span>
          <span v-else v-tooltip.bottom="data.sender" class="truncate inline-block text-txs">
            <a :href="getPublicKeyExplorerUrl(data.sender)" target="_blank">
              {{ data.sender }}
            </a>
          </span>
        </template>
      </Column>
      <Column field="recipient" header="RECIPIENT" headerStyle="width:110px">
        <template #body="{data}">
          <span v-if="data.recipient === '' || data.recipient === null"></span>
          <span v-tooltip.bottom="data.recipient" v-else class="truncate inline-block text-txs">{{ data.recipient }}</span>
        </template>
      </Column>
      <Column header="TX FEE" v-if="selectedGroupType === transactionGroupType.CONFIRMED" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column header="AMOUNT" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs" >{{ data.amountTransfer ? data.amountTransfer:'-' }} <b v-if="data.amountTransfer">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column header="SDA" headerStyle="width:40px">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-sda.svg" class="inline-block" v-if="checkOtherAsset(data.sda)" v-tooltip.left="'<tiptitle>Sirius Digital Asset</tiptitle><tiptext>' + displaySDAs(data.sda) + '</tiptext>'">
          </div>
        </template>
      </Column>
      <Column header="MESSAGE" headerStyle="width:40px">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-message.svg" v-tooltip.left="'<tiptitle>' + data.messageTypeTitle + '</tiptitle><tiptext>' + data.message + '</tiptext>'" class="inline-block" v-if="data.message && data.messageType !== 1">
          </div>
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
  name: 'TransferTxnDataTable',
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
    const filterText = ref("");
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

    const displaySDAs = (sdas) => {
      let sda_rows = [];
      if(sdas.length > 0){
        for(const sda of sdas){
          let asset_div = displayAssetDiv(sda);
          sda_rows.push(asset_div);
        }
        return sda_rows.join("<br>");
      }
    }

    const convertLocalTime = (dateTimeInJSON)=>{
      return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
    };

    const displayAssetDiv = (sda) => {
      let asset_div;
      let assetArray = []
      assetArray.push(sda.id);

      if(sda.currentAlias && sda.currentAlias.length){
        asset_div = (sda.amount + ' ' + sda.currentAlias[0].name);
      }
      else{
        asset_div = (sda.amount + ' - ' + sda.id);
      }
      return asset_div;
    }

    const checkOtherAsset = (assets) => {
      if(assets){
        if(assets.length > 0){
          return true;
        }
      }
      return false;
    }

    return {
      borderColor,
      filterText,
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
      // hints,
      getPublicKeyExplorerUrl,
      getNamespaceExplorerUrl,
      getAssetExplorerUrl,
      getAddressExplorerUrl,
      getHashExplorerUrl,
      gotoHashExplorer,
      displaySDAs,
      checkOtherAsset,
      nativeTokenName,
      convertLocalTime,
      transactionGroupType
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