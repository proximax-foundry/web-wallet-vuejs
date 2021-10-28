<template>
  <div>
    <DataTable
      :value="transactions"
      :paginator="true"
      :rows="10"
      scrollDirection="horizontal"
      responsiveLayout="scroll"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      >
      <Column header="IN/OUT" headerStyle="width:30px">
        <template #body="{data}">
          <div class="ml-2">
            <img src="@/modules/dashboard/img/icon-txn-in.svg" class="inline-block" v-if="data.extractedData.recipient==currentAddress">
            <img src="@/modules/dashboard/img/icon-txn-out.svg" class="inline-block rotate-180 transform" v-else>
          </div>
        </template>
      </Column>
      <Column field="typeName" header="TX HASH" headerStyle="width:100px">
        <template #body="{data}">
          <span class="text-txs" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column field="typeName" header="TIMESTAMP" headerStyle="width:110px">
        <template #body="{data}">
          <span class="text-txs">{{data.formattedDeadline}}</span>
        </template>
      </Column>
      <Column field="typeName" header="TYPE" headerStyle="width:110px">
        <template #body="{data}">
          <span class="text-txs">{{data.typeName}}</span>
        </template>
      </Column>
      <Column field="block" header="BLOCK" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs">{{ data.block }}</div>
        </template>
      </Column>
      <Column field="signer" header="SENDER" headerStyle="width:110px">
        <template #body="{data}">
          <span v-tooltip.bottom="data.signerAddress" class="truncate inline-block text-txs">
            <a :href="getPublicKeyExplorerUrl(data.signer)" target="_blank">
              {{ data.signerDisplay === data.signerAddressPretty ? data.signer : data.signerDisplay }}
            </a>
          </span>
        </template>
      </Column>
      <Column field="recipient" header="RECIPIENT" headerStyle="width:110px">
        <template #body="{data}">
          <span v-tooltip.bottom="data.extractedData.recipient" class="truncate inline-block text-txs">{{ data.extractedData.recipientName?data.extractedData.recipientName:data.extractedData.recipient }}</span>
        </template>
      </Column>
      <Column header="TX FEE" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs">{{ data.maxFee }} <b v-if="data.maxFee">XPX</b></div>
        </template>
      </Column>
      <Column header="AMOUNT" headerStyle="width:110px">
        <template #body="{data}">
          <div class="text-txs" v-if="data.typeName=='Transfer'">{{ data.extractedData.amount?data.extractedData.amount:'0' }} <b>XPX</b></div>
          <div class="text-txs" v-else>{{ data.extractedData.amount?data.extractedData.amount:'-' }} <b v-if="data.extractedData.amount">XPX</b></div>
        </template>
      </Column>
      <Column header="SDA" headerStyle="width:40px">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-sda.svg" class="inline-block" v-if="checkOtherAsset(data.otherAssets)" v-tooltip.left="'<tiptitle>Sirius Digital Asset</tiptitle><tiptext>' + d(data.otherAssets) + '</tiptext>'">
          </div>
        </template>
      </Column>
      <Column header="MESSAGE" headerStyle="width:40px">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-message.svg" v-tooltip.left="'<tiptitle>' + data.extractedData.messageTypeString + '</tiptitle><tiptext>' + data.extractedData.messagePayload + '</tiptext>'" class="inline-block" v-if="data.extractedData.messageType != 'empty' && data.extractedData.messageType">
          </div>
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
import { TipType} from '../model/dashboardClasses'
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
  name: 'DashboardDataTable',
  props: {
    transactions: Array,
    showBlock: Boolean,
    showAction: Boolean,
    type: String,
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
    const modalData = ref(null);
    const filterText = ref("");
    const isShowConfirmed = p.type === "confirmed" ? true : false;
    const isShowUnconfirmed = p.type === "unconfirmed" ? true : false;
    const isShowPartial = p.type === "partial" ? true : false;
    /*
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    */
    watch(
     ()=> filterText.value, (newValue)=>{
       context.emit('confirmedFilter', newValue);
    });

    // const nsHint = "\`ns:\` - filter by Namespace (ID or name)";
    // const nsHint2 = "\`ns:-\` - filter with Namespace Name alias";
    // const nsHint3 = "\`ns:'\` - convert namespace name to Namespace ID, will ignore when invalid";
    // const hashHint = "\`hash:\` - filter Transaction Hash ";
    // const pkHint = "\`pk:\` - Public Key";
    // const assetHint = "\`asset:\` - filter by Asset ID";
    // const addressHint = "\`add:\` - filter by Address"; 

    // const hints = [hashHint, assetHint, pkHint, addressHint, nsHint, nsHint2, nsHint3].join('\n');

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

    emitter.on("CLOSE_MODAL", payload => {
      showTransactionModel.value = payload;
    });

    const setSplitButtonItems = (data) =>{

      let items = [
        /*
            {
                label: 'Sample',
                icon: 'pi pi-external-link',
                command: () => {
                    window.open(explorerBaseURL.value + hashExplorerURL.value + "/" + data.hash, "_blank");
                }
            },
        
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    //toast.add({severity:'success', summary:'Updated', detail:'Data Updated', life: 3000});
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    //toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
                }
            },
            {
                label: 'Vue Website',
                icon: 'pi pi-external-link',
                command: () => {
                    window.location.href = 'https://vuejs.org/'
                }
            },
            {   label: 'Upload',
                icon: 'pi pi-upload',
                command: () => {
					          //window.location.hash = "/fileupload"
				        }
            }
            */
        ];

      return items;
    }

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


    let apiEndpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort);
    let chainAPICall = new ChainAPICall(apiEndpoint);

    const d = (assets) :Promise<string> => {
      return displayAsset(assets).then(data => {
        return data;
      })
    }

    const displayAsset = async (assets) => {
      let asset_divs = '';
      if(assets.length > 0){
        for(const asset of assets){
          let asset_div = await displayAssetDiv(asset);
          asset_divs += asset_div;
        }
        return asset_divs;
      }
    }

    const displayAssetDiv = async (asset) => {
      let otherAsset = await chainAPICall.assetAPI.getMosaic(asset.assetid);
      let asset_div;
      let assetarray = []
      assetarray.push(asset.assetid);

      let nsAsset = await chainAPICall.assetAPI.getMosaicsNames(assetarray);
      if(nsAsset[0].names.length > 0){
        asset_div = (Helper.convertToExact(asset.amount, otherAsset.divisibility) + ' ' + nsAsset[0].names[0].name);
      }else{
        asset_div = (asset.asset + ' - ' + Helper.convertToExact(asset.amount, otherAsset.divisibility) + ' xpx');
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
      modalData,
      rowClick,
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
      setSplitButtonItems,
      gotoHashExplorer,
      isShowConfirmed,
      isShowUnconfirmed,
      isShowPartial,
      d,
      checkOtherAsset,
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