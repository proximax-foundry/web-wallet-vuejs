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
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">{{$t('dashboard.txHash')}}</div>
            <div class="uppercase font-bold text-txs"><span class="text-txs" v-tooltip.right="data.hash">{{data.hash.substring(0, 20) }}...</span></div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('dashboard.type')}}</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-txs mr-2">{{data.type}}</div>
              <div>
                <img src="@/modules/dashboard/img/icon-txn-in.svg" class="inline-block w-5" v-if="data.in_out === true">
                <img src="@/modules/dashboard/img/icon-txn-out.svg" class="inline-block w-5" v-else-if="data.in_out === false">
              </div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5" v-if="data.recipient != '' && data.recipient != null">Receipient</div>
            <div class="uppercase font-bold text-txs">
              <span v-if="data.recipient === '' || data.recipient === null"></span>
              <span v-tooltip.right="Helper.createAddress(data.recipient).pretty()" v-else-if="data.recipientNamespaceName" class="truncate inline-block text-txs">{{ data.recipientNamespaceName }}</span>
              <span v-tooltip.right="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-block text-txs">{{ data.recipient.substring(0, 20) }}...</span>
            </div>
          </div>
        </template>
      </Column>
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('general.sender')}}</div>
            <div class="uppercase font-bold text-txs">
              <span v-if="data.sender === '' || data.sender === null"></span>
              <span v-else v-tooltip.right="Helper.createAddress(data.sender).pretty()" class="truncate inline-block text-txs">
                <a :href="getPublicKeyExplorerUrl(data.sender)" target="_blank">
                  {{ data.sender.substring(0, 20) }}...
                </a>
              </span>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('dashboard.txAmount')}}</div>
            <div class="text-txs uppercase font-bold" >{{ data.amountTransfer ? data.amountTransfer:'-' }} <b v-if="data.amountTransfer">{{ nativeTokenName }}</b></div>
          </div>
        </template>
      </Column>
      <Column :header="$t('dashboard.inOut')" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-txn-in.svg" class="inline-block" v-if="data.in_out === true">
            <img src="@/modules/dashboard/img/icon-txn-out.svg" class="inline-block" v-else-if="data.in_out === false">
          </div>
        </template>
      </Column>
      <Column field="hash" :header="$t('dashboard.txHash')" headerStyle="width:100px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column field="type" :header="$t('dashboard.type')" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="signer" :header="$t('general.sender')" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span v-if="data.sender === '' || data.sender === null"></span>
          <span v-else v-tooltip.bottom="Helper.createAddress(data.sender).pretty()" class="truncate inline-block text-txs">
            <a :href="getPublicKeyExplorerUrl(data.sender)" target="_blank">
              {{ data.sender }}
            </a>
          </span>
        </template>
      </Column>
      <Column field="recipient" :header="$t('dashboard.txHash')" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span v-if="data.recipient === '' || data.recipient === null"></span>
          <span v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else-if="data.recipientNamespaceName" class="truncate inline-block text-txs">{{ data.recipientNamespaceName }}</span>
          <span v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-block text-txs">{{ data.recipient.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column :header="$t('general.amount')" headerStyle="width:90px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-txs" >{{ data.amountTransfer ? data.amountTransfer:'-' }} <b v-if="data.amountTransfer">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column :header="$t('general.sda')" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-center">
            <img src="@/modules/dashboard/img/icon-sda.svg" class="inline-block" v-if="checkOtherAsset(data.sda)" v-tooltip.left="'<tiptitle>' +t('general.sdaFull')+'</tiptitle><tiptext>' + displaySDAs(data.sda) + '</tiptext>'">
            <span v-else>-</span>
          </div>
        </template>
      </Column>
      <Column :header="$t('general.message')" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-message.svg" v-tooltip.left="'<tiptitle>' + data.messageTypeTitle + '</tiptitle><tiptext>' + data.message + '</tiptext>'" class="inline-block" v-if="data.message && data.messageType !== 1">
            <div v-else class="w-full text-center">-</div>
          </div>
        </template>
      </Column>
      <Column headerStyle="width:50px">
        <template #body="{data}">
          <img src="@/modules/dashboard/img/icon-open_in_new_black.svg" @click="gotoHashExplorer(data.hash)" class="cursor-pointer">
        </template>
      </Column>
      <template #empty>
        {{$t('general.noRecord')}}
      </template>
      <template #loading>
          {{$t('dashboard.fetchingTx')}}
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
import { walletState } from '@/state/walletState';
import { DashboardService } from '@/modules/dashboard/service/dashboardService';
import { AppState } from "@/state/appState";

export default defineComponent({
  components: {
    DataTable,
    Column,
    // SplitButton
  },
  name: 'UnconfirmedTransactionDataTable',
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

    const nativeTokenName = computed(()=> networkState.currentNetworkProfile?.network.currency.name);

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

    const convertLocalTime = (dateTimeInJSON)=>{
      return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
    };

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
      let arrayAsset = []
      arrayAsset.push(asset.assetid);

      let nsAsset = await chainAPICall.assetAPI.getMosaicsNames(arrayAsset);
      if(nsAsset[0].names.length > 0){
        asset_div = (Helper.convertToExact(asset.amount, otherAsset.divisibility) + ' ' + nsAsset[0].names[0].name);
      }else{
        asset_div = (asset.asset + ' - ' + Helper.convertToExact(asset.amount, otherAsset.divisibility) + AppState.nativeToken.label);
      }
      return asset_div;
    }

    const transactions = ref([]);

    let currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount() ? walletState.currentLoggedInWallet.selectDefaultAccount() : walletState.currentLoggedInWallet.accounts[0];

    let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);

    let transactionGroupType = Helper.getTransactionGroupType();

    let dashboardService = new DashboardService(walletState.currentLoggedInWallet, currentAccount);

    let loadUnconfirmedTransactions = async()=>{
      let txnQueryParams = Helper.createTransactionQueryParams();
      txnQueryParams.pageSize = 1;
      txnQueryParams.address = currentAccount.address;
      txnQueryParams.embedded = true;
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);

      let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.UNCONFIRMED, txnQueryParams);
      let formattedTxns = await dashboardService.formatUnconfirmedMixedTxns(transactionSearchResult.transactions);
      console.log(formattedTxns)
      transactions.value = formattedTxns;
    };

    loadUnconfirmedTransactions();

    emitter.on("TXN_UNCONFIRMED", (num) => {
      if(num> 0){
        loadUnconfirmedTransactions();
      }
    });

    emitter.on("TXN_CONFIRMED", (num) => {
      if(num> 0){
        loadUnconfirmedTransactions();
      }
    });

    emitter.on('DEFAULT_ACCOUNT_SWITCHED', payload => {
      currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount();
      loadUnconfirmedTransactions();
    });

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
      nativeTokenName,
      wideScreen,
      checkOtherAsset,
      transactions,
      Helper,
      convertLocalTime,
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