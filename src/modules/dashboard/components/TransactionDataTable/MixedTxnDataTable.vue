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
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5" v-if="data.recipient != '' && data.recipient != null">{{$t('general.recipient')}}</div>
            <div class="uppercase font-bold text-txs">
              <span v-if="data.recipient === '' || data.recipient === null"></span>
              <span v-tooltip.right="Helper.createAddress(data.recipient).pretty()" v-else-if="data.recipientNamespaceName" class="truncate inline-block text-txs">{{ data.recipientNamespaceName }}</span>
              <span v-tooltip.right="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-block text-txs">{{ walletState.currentLoggedInWallet.convertAddressToNamePretty(data.recipient).substring(0, 20) }}</span>
            </div>
          </div>
        </template>
      </Column>
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{data}">
          <div v-if="selectedGroupType === transactionGroupType.CONFIRMED">
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">{{$t('dashboard.timestamp')}}</div>
            <div class="uppercase font-bold text-txs">{{ convertLocalTime(data.timestamp) }}</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('general.sender')}}</div>
            <div class="uppercase font-bold text-txs">
              <span v-if="data.sender === '' || data.sender === null"></span>
              <span v-else v-tooltip.right="Helper.createAddress(data.sender).pretty()" class="truncate inline-block text-txs">
                <a :href="getPublicKeyExplorerUrl(data.sender)" target="_blank">
                  {{ walletState.currentLoggedInWallet.convertAddressToNamePretty(data.sender).substring(0, 20) }}
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
      <Column field="timestamp" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" :header="$t('dashboard.timestamp')" headerStyle="width:110px;text-transform:uppercase">
        <template #body="{data}">
          <span class="text-txs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="type" :header="$t('dashboard.type')" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="block" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" :header="$t('general.block')" headerStyle="width:60px;text-transform:uppercase">
        <template #body="{data}">
          <div class="text-txs">{{ data.block }}</div>
        </template>
      </Column>
      <Column field="signer" :header="$t('general.sender')" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span v-if="data.sender === '' || data.sender === null"></span>
          <span v-else v-tooltip.bottom="Helper.createAddress(data.sender).pretty()" class="truncate inline-block text-txs">
            <a :href="getPublicKeyExplorerUrl(data.sender)" target="_blank">
              {{ walletState.currentLoggedInWallet.convertAddressToNamePretty(data.sender).substring(0, 20) }}
            </a>
          </span>
        </template>
      </Column>
      <Column field="recipient" :header="$t('general.recipient')" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span v-if="data.recipient === '' || data.recipient === null"></span>
          <span v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else-if="data.recipientNamespaceName" class="truncate inline-block text-txs">{{ data.recipientNamespaceName }}</span>
          <span v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-block text-txs">{{ walletState.currentLoggedInWallet.convertAddressToNamePretty(data.recipient).substring(0, 20) }}</span>
        </template>
      </Column>
      <Column :header="$t('dashboard.txFee')" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:90px;text-transform:uppercase">
        <template #body="{data}">
          <div class="text-txs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
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
            <img src="@/modules/dashboard/img/icon-proximax-logo-gray.svg" class="inline-block" v-if="checkOtherAsset(data.sda)" v-tooltip.left="'<tiptitle>' + $t('general.sdaFull') + '</tiptitle><tiptext>' + displaySDAs(data.sda) + '</tiptext>'">
            <span v-else>-</span>
          </div>
        </template>
      </Column>
      <Column :header="$t('general.message')" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-message.svg" v-tooltip.left="'<tiptitle>' + data.messageTypeTitle + '</tiptitle><tiptext>' + data.message + '</tiptext>'" class="inline-block" v-if="data.message && data.messageType !== 1">
            <DecryptMessageModal v-if="data.message && data.messageType !== 0"  :messageTypeTitle="data.messageTypeTitle" :message="data.message" :recipientAddress="data.recipient" :initiator="data.initiator"/>
            <div v-else class="w-full text-center">-</div>
          </div>
        </template>
      </Column>
      <Column header="" headerStyle="width:50px">
        <template #body="{data}">
          <div class="flex justify-center">
            <img src="@/modules/dashboard/img/icon-open_in_new_black.svg" @click="gotoHashExplorer(data.hash)" class="cursor-pointer">
          </div>
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
import { walletState } from "@/state/walletState";
import DecryptMessageModal from "@/modules/dashboard/components/DecryptMessageModal.vue"
// import SplitButton from 'primevue/splitbutton';

export default {
  components: {
    DataTable,
    Column,
    DecryptMessageModal
    // SplitButton
  },
  name: 'MixedTxnDataTable',
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
      transactionGroupType,
      wideScreen,
      Helper,
      walletState,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/transactions-data-table.scss";
</style>