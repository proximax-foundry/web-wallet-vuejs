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
      <Column style="width: 200px" headerClass="invisible" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">{{$t('dashboard.txHash')}}</div>
            <div class="flex items-center">
              <div @click="gotoHashExplorer(data.hash)" class="uppercase font-bold text-txs"><span class="text-txs text-blue-primary cursor-pointer" v-tooltip.right="data.hash">{{data.hash.substring(0, 20) }}...</span></div>
              <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy(data.hash)" class="ml-0.5 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('dashboard.type')}}</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-txs mr-2">{{data.type}}</div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('general.account')}}</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-txs mr-2 truncate" v-tooltip.right="Helper.createAddress(data.signerAddress).pretty()">{{ walletState.currentLoggedInWallet.convertAddressToNamePretty(data.signerAddress) }}</div>
            </div>
          </div>
        </template>
      </Column>
      <Column style="width: 200px" headerClass="invisible" v-if="!wideScreen">
        <template #body="{data}">
          <div v-if="selectedGroupType === transactionGroupType.CONFIRMED">
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">{{$t('dashboard.timestamp')}}</div>
            <div class="uppercase font-bold text-txs">{{ convertLocalTime(data.timestamp) }}</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('dashboard.approvalAndRemoval')}}</div>
            <div class="flex items-center">
              <div class="text-txs">
                {{ data.oldApprovalNumber ? data.oldApprovalNumber + " " : '' }}{{ data.approvalDelta > 0 ? `+${data.approvalDelta}`: data.approvalDelta }}
              </div>
              <div class="text-txs ml-5">
                {{ data.oldRemovalNumber ? data.oldRemovalNumber + " " : '' }}{{ data.removalDelta > 0 ? `+${data.removalDelta}`: data.removalDelta }}
              </div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('dashboard.info')}}</div>
            <div class="flex items-center">
              <span v-bind:key="cosigner" v-tooltip.bottom="{ value: $t('dashboard.addingAcc') +'<br><br>' + cosigner, escape: false}" v-for="cosigner in data.addedCosigner" class="inline-block bg-green-200 font-bold text-green-700 text-txs rounded py-1 px-2 my-1">
                {{ cosigner.substring(0, 20) }}...
              </span>
              <span v-bind:key="cosigner" v-tooltip.bottom="{ value: $t('dashboard.removingAcc') +'<br><br>' + cosigner, escape: false}" v-for="cosigner in data.removedCosigner" class="inline-block bg-red-200 font-bold text-red-700 text-txs py-1 px-1 my-1">
                {{ cosigner.substring(0, 20) }}...
              </span>
              <span v-if="data.addedCosigner.length ==0  && data.removedCosigner.length ==0">-</span>
            </div>
          </div>
        </template>
      </Column>
      <Column field="hash" :header="$t('dashboard.txHash')" headerStyle="width:100px;"  v-if="wideScreen">
        <template #body="{data}">
          <div class="flex items-center">
            <span @click="gotoHashExplorer(data.hash)" class="text-txs text-blue-primary cursor-pointer" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</span>
            <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy(data.hash)" class="ml-0.5 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
          </div>
        </template>
      </Column>
      <Column field="timestamp" :header="$t('dashboard.timestamp')" headerStyle="width:110px;"  v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" >
        <template #body="{data}">
          <span class="text-txs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" :header="$t('dashboard.type')" headerStyle="width:110px;" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">{{data.type}}</span>
        </template>
      </Column>
      <!-- <Column field="block" :header="$t('general.block')"  v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;">
        <template #body="{data}">
          <div class="text-txs">{{ data.block }}</div>
        </template>
      </Column> -->
      <Column :header="$t('dashboard.txFee')" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;">
        <template #body="{data}">
          <div class="text-txs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column :header="$t('general.account')" headerStyle="width:110px;" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-txs truncate inline-block" v-tooltip.bottom="Helper.createAddress(data.signerAddress).pretty()">{{ walletState.currentLoggedInWallet.convertAddressToNamePretty(data.signerAddress) }}</div>
        </template>
      </Column>
      <Column :header="$t('dashboard.approvalDelta')" headerStyle="width:60px;" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">
            {{ data.oldApprovalNumber ? data.oldApprovalNumber + " " : '' }}{{ data.approvalDelta > 0 ? `+${data.approvalDelta}`: data.approvalDelta }}
          </span>
        </template>
      </Column>
      <Column :header="$t('dashboard.removalDelta')" headerStyle="width:60px;" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">
            {{ data.oldRemovalNumber ? data.oldRemovalNumber + " " : '' }}{{ data.removalDelta > 0 ? `+${data.removalDelta}`: data.removalDelta }}
          </span>
        </template>
      </Column>
      <Column :header="$t('dashboard.info')" headerStyle="width:40px;" v-if="wideScreen">
        <template #body="{data}">
          <span v-bind:key="cosigner" v-tooltip.bottom="{ value: $t('dashboard.addingAcc') +'<br><br>' + cosigner, escape: false}" v-for="cosigner in data.addedCosigner" class="inline-block bg-green-200 font-bold text-green-700 text-txs rounded py-1 px-2 my-1 mx-1">
            {{ cosigner.substring(0, 20) }}...
          </span>
          <span v-bind:key="cosigner" v-tooltip.bottom="{ value: $t('dashboard.removingAcc') +'<br><br>' + cosigner, escape: false}" v-for="cosigner in data.removedCosigner" class="inline-block bg-red-200 font-bold text-red-700 text-txs rounded py-1 px-1 my-1 mx-1">
            {{ cosigner.substring(0, 20) }}...
          </span>
          <span v-if="data.addedCosigner.length ==0  && data.removedCosigner.length ==0">-</span>
        </template>
      </Column>
     <!--  <Column header="" headerStyle="width:50px">
        <template #body="{data}">
          <div class="flex justify-center">
            <img src="@/modules/dashboard/img/icon-open_in_new_black.svg" @click="gotoHashExplorer(data.hash)" class="cursor-pointer">
          </div>
        </template>
      </Column> -->
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
import { copyToClipboard } from '@/util/functions';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
// import SplitButton from 'primevue/splitbutton';

export default defineComponent({
  components: {
    DataTable,
    Column,
    // SplitButton
  },
  name: 'AccountTxnDataTable',
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
    const toast = useToast();
    const {t} = useI18n();
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

    const constructValueDisplay = (data) => {

      let display = "Size:" + (data.sizeChanged > 0 ? `+${data.sizeChanged}`: data.sizeChanged);

      if(data.oldValue){
        display += `<br>Old Value: ${data.oldValue}`;
      }
      if(data.newValue){
        display += `<br>New Value: ${data.newValue}`;
      }

      display += `<br>Value Change: ${data.valueChange}`;
      return display;
    }

    const convertLocalTime = (dateTimeInJSON)=>{
      return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
    };

    const copy = (data) =>{
      let stringToCopy = data;
      let copySubject = t('dashboard.txHash')
      copyToClipboard(stringToCopy);

      toast.add({severity:'info', detail: copySubject +' ' + t('general.copied'), group: 'br-custom', life: 3000});
    };

    return {
      constructValueDisplay,
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
      wideScreen,
      Helper,
      walletState,
      copy
    }
  }
})
</script>

