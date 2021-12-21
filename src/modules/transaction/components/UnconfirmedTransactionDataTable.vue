<template>
  <div>
    <DataTable
      :value="transactions"
      :paginator="true"
      :rows="20"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      responsiveLayout="scroll"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      >
      <Column style="width: 250px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">TX HASH</div>
            <div class="text-txs" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">TYPE</div>
            <div class="uppercase font-bold text-txs">{{data.typeName}}</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">RECEIPIENT</div>
            <div class="uppercase font-bold text-txs" v-tooltip.bottom="data.extractedData.recipient" v-if="data.extractedData.recipient">{{ data.extractedData.recipientName?data.extractedData.recipientName:data.extractedData.recipient }}</div>
          </div>
        </template>
      </Column>
      <Column style="width: 250px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">TIMESTAMP</div>
            <div class="uppercase font-bold text-txs">{{data.formattedDeadline}}</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mt-5 mb-1">SENDER</div>
            <div class="uppercase font-bold text-txs">{{ data.signerDisplay === data.signerAddressPretty ? data.signer : data.signerDisplay }}</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mt-5 mb-1">TX AMOUNT</div>
            <div class="uppercase font-bold text-txs" v-if="data.typeName=='Transfer'">{{ data.extractedData.amount?data.extractedData.amount:'0' }} <b>{{currentNativeTokenName}}</b> <img src="@/modules/dashboard/img/icon-sda.svg" class="inline-block" v-if="checkOtherAsset(data.otherAssets)" v-tooltip.left="'<tiptitle>Sirius Digital Asset</tiptitle><tiptext>' + d(data.otherAssets) + '</tiptext>'"> <img src="@/modules/dashboard/img/icon-message.svg" v-tooltip.left="'<tiptitle>' + data.extractedData.messageTypeString + '</tiptitle><tiptext>' + data.extractedData.messagePayload + '</tiptext>'" class="inline-block" v-if="data.extractedData.messageType != 'empty' && data.extractedData.messageType"></div>
            <div class="uppercase font-bold text-txs" v-else>{{ data.extractedData.amount?data.extractedData.amount:'-' }} <b v-if="data.extractedData.amount">{{currentNativeTokenName}}</b></div>
          </div>
        </template>
      </Column>
      <Column header="IN/OUT" headerStyle="width:30px" v-if="wideScreen">
        <template #body="{data}">
          <div class="ml-2">
            <img src="@/modules/dashboard/img/icon-txn-in.svg" class="inline-block" v-if="data.extractedData.recipient==currentAddress">
            <img src="@/modules/dashboard/img/icon-txn-out.svg" class="inline-block" v-else>
          </div>
        </template>
      </Column>
      <Column field="hash" header="TX HASH" headerStyle="width:100px" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column field="formattedDeadline" header="TIMESTAMP" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">{{data.formattedDeadline}}</span>
        </template>
      </Column>
      <Column field="typeName" header="TYPE" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">{{data.typeName}}</span>
        </template>
      </Column>
      <Column field="block" header="BLOCK" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-txs">{{ data.block }}</div>
        </template>
      </Column>
      <Column field="signer" header="SENDER" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <span v-tooltip.bottom="data.signerAddress" class="truncate inline-block text-txs">
            <a :href="getPublicKeyExplorerUrl(data.signer)" target="_blank">
              {{ data.signerDisplay === data.signerAddressPretty ? data.signer : data.signerDisplay }}
            </a>
          </span>
        </template>
      </Column>
      <Column field="recipient" header="RECIPIENT" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <span v-tooltip.bottom="data.extractedData.recipient" v-if="data.extractedData.recipient" class="truncate inline-block text-txs">{{ data.extractedData.recipientName?data.extractedData.recipientName:data.extractedData.recipient }}</span>
        </template>
      </Column>
      <Column header="TX FEE" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-txs">{{ data.maxFee }} <b v-if="data.maxFee">{{currentNativeTokenName}}</b></div>
        </template>
      </Column>
      <Column header="AMOUNT" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-txs" v-if="data.typeName=='Transfer'">{{ data.extractedData.amount?data.extractedData.amount:'0' }} <b>{{currentNativeTokenName}}</b></div>
          <div class="text-txs" v-else>{{ data.extractedData.amount?data.extractedData.amount:'-' }} <b v-if="data.extractedData.amount">{{currentNativeTokenName}}</b></div>
        </template>
      </Column>
      <Column header="SDA" headerStyle="width:40px" v-if="wideScreen">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-sda.svg" class="inline-block" v-if="checkOtherAsset(data.otherAssets)" v-tooltip.left="'<tiptitle>Sirius Digital Asset</tiptitle><tiptext>' + d(data.otherAssets) + '</tiptext>'">
          </div>
        </template>
      </Column>
      <Column header="MESSAGE" headerStyle="width:40px" v-if="wideScreen">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-message.svg" v-tooltip.left="'<tiptitle>' + data.extractedData.messageTypeString + '</tiptitle><tiptext>' + data.extractedData.messagePayload + '</tiptext>'" class="inline-block" v-if="data.extractedData.messageType != 'empty' && data.extractedData.messageType">
          </div>
        </template>
      </Column>
      <Column header="" headerStyle="width:70px">
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
import { defineComponent, getCurrentInstance, ref, computed, watch, onMounted, onUnmounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { networkState } from "@/state/networkState";
import Tooltip from 'primevue/tooltip';
import { ChainUtils } from "@/util/chainUtils";
import { ChainAPICall } from "@/models/REST/chainAPICall";
import { Helper } from "@/util/typeHelper";

export default defineComponent({
  components: {
    DataTable,
    Column,
    // SplitButton
  },
  name: 'DashboardDataTable',
  props: {
    showBlock: Boolean,
    showAction: Boolean,
    type: String,
    currentAddress: String
  },
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

    onMounted(() => {
      window.addEventListener("resize", screenResizeHandler);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", screenResizeHandler);
    });

    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const isShowConfirmed = p.type === "confirmed" ? true : false;
    const isShowUnconfirmed = p.type === "unconfirmed" ? true : false;
    const isShowPartial = p.type === "partial" ? true : false;

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);

    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const blockExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.blockRoute);
    const publicKeyExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.publicKeyRoute);
    const addressExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.addressRoute);
    const hashExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.hashRoute);
    const namespaceExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute);
    const assetExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.assetInfoRoute);

    const dynamicModelComponentDisplay = ref('TransferTransactionModal');


    const getPublicKeyExplorerUrl = (publicKey) =>{
      return explorerBaseURL.value + publicKeyExplorerURL.value + "/" + publicKey
    }


    const getHashExplorerUrl = (hash) =>{

      return explorerBaseURL.value + hashExplorerURL.value + "/" + hash
    }

    const gotoHashExplorer = (hash)=>{
      window.open(explorerBaseURL.value + hashExplorerURL.value + "/" + hash, "_blank");
    }


    let apiEndpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort);
    let chainAPICall = new ChainAPICall(apiEndpoint);

    const checkOtherAsset = (assets) => {
      if(assets){
        if(assets.length > 0){
          return true;
        }
      }
      return false;
    }

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

    const transactions = [
      {
        hash: 'CFAF94204836EC9CB39AE8C13E60122E74CDE86DEA71B1660658E12E34CA9B80',
        typeName: 'Transfer',
        extractedData: {
          recipient: "VAOYQCVXM2ENSIA4JIV6DF4UBNOLQDJTSCMTKJEB",
          recipientName: "acc2",
          recipientType: "address",
          amount: '1000',
          messageTypeString: "Plain message",
          messagePayload: 'Hello'
        },
        block: 12344,
        signer: 'CFAF94204836EC9CB39AE8C13E60122E74CDE86DEA71B1660658E12E34CA9B80',
        signerDisplay: 'nameABC',
        signerAddress: "VAOYQCVXM2ENSIA4JIV6DF4UBNOLQDJTSCMTKJEB",
        signerAddressPretty: "VAOYQC-VXM2EN-SIA4JI-V6DF4U-BNOLQD-JTSCMT-KJEB",
        formattedDeadline: "12/1/2021, 19:00:18",
        otherAssets: undefined
      }
    ];

    return {
      d,
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
      getHashExplorerUrl,
      gotoHashExplorer,
      isShowConfirmed,
      isShowUnconfirmed,
      isShowPartial,
      currentNativeTokenName,
      wideScreen,
      checkOtherAsset,
      transactions,
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