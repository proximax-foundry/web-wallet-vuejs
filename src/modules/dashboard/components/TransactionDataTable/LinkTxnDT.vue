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
              <div @click="gotoHashExplorer(data.hash)"  class="uppercase font-bold text-txs"><span class="text-txs text-blue-primary cursor-pointer" v-tooltip.right="data.hash">{{data.hash.substring(0, 20) }}...</span></div>
              <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy(data.hash)" class="ml-0.5 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('dashboard.type')}}</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-txs mr-2">{{data.type}}</div>
            </div>
          </div>
        </template>
      </Column>
      <Column style="width: 200px" headerClass="invisible" v-if="!wideScreen">
        <template #body="{data}">
          <div v-if="selectedGroupType === transactionGroupType.CONFIRMED">
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">{{$t('dashboard.remotePublicKey')}}</div>
            <div class="uppercase font-bold text-txs" v-tooltip.bottom="data.remotePublicKey">{{data.remotePublicKey.substring(0, 20) }}...</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('dashboard.info')}}</div>
            <div v-if="data.action === 'Link'" class="inline-block bg-green-200 font-bold text-green-700 text-txs rounded py-1 px-2">
              <font-awesome-icon icon="link" class="text-green-700" />&nbsp;&nbsp;{{$t('general.linked')}}
            </div>
            <div v-else class="inline-block bg-red-200 font-bold text-red-700 text-txs rounded py-1 px-2">
              <font-awesome-icon icon="unlink" class="text-red-700" />&nbsp;&nbsp;{{$t('general.unlinked')}}
            </div>
          </div>
        </template>
      </Column>
      <Column field="hash" :header="$t('dashboard.txHash')" headerStyle="width:100px;" v-if="wideScreen">
        <template #body="{data}">
          <div class="flex items-center">
            <span @click="gotoHashExplorer(data.hash)"  class="text-txs text-blue-primary cursor-pointer" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</span>
            <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy(data.hash)" class="ml-0.5 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
          </div>
        </template>
      </Column>
      <Column field="timestamp" :header="$t('dashboard.timestamp')" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;">
        <template #body="{data}">
          <span class="text-txs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="typeName" :header="$t('dashboard.type')" headerStyle="width:110px;" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">{{data.type}}</span>
        </template>
      </Column>
      <!-- <Column field="block" :header="$t('general.block')" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;">
        <template #body="{data}">
          <div class="text-txs">{{ data.block }}</div>
        </template>
      </Column> -->
      <Column :header="$t('dashboard.txFee')" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" headerStyle="width:110px;">
        <template #body="{data}">
          <div class="text-txs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column :header="$t('dashboard.remotePublicKey')" headerStyle="width:40px;" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs" v-tooltip.bottom="data.remotePublicKey">{{data.remotePublicKey.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column :header="$t('dashboard.info')" headerStyle="width:40px;" v-if="wideScreen">
        <template #body="{data}">
          <div v-if="data.action === 'Link'" class="inline-block bg-green-200 font-bold text-green-700 text-txs rounded py-1 px-2">
            <font-awesome-icon icon="link" class="text-green-700" />&nbsp;&nbsp;{{$t('general.linked')}}
          </div>
          <div v-else class="inline-block bg-red-200 font-bold text-red-700 text-txs rounded py-1 px-2">
            <font-awesome-icon icon="unlink" class="text-red-700" />&nbsp;&nbsp;{{$t('general.unlinked')}}
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

<script lang="ts" setup>
import { getCurrentInstance, ref, computed,onMounted, onUnmounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { networkState } from "@/state/networkState";
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
import { useToast } from 'primevue/usetoast';
import type { Transaction } from "tsjs-xpx-chain-sdk";

defineProps({
  transactions: Array<Transaction>,
  selectedGroupType: String,
  currentAddress: String
})

const toast = useToast();
const wideScreen = ref(false);
const screenResizeHandler = () => {
  if (window.innerWidth < 1024) {
    wideScreen.value = false;
  } else {
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
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const showTransactionModel = ref(false);
const transactionGroupType = Helper.getTransactionGroupType();

const nativeTokenName = computed(() => networkState.currentNetworkProfile?.network.currency.name);

const explorerBaseURL = computed(() => networkState.currentNetworkProfile ? networkState.currentNetworkProfile.chainExplorer.url : "");

const hashExplorerURL = computed(() => networkState.currentNetworkProfile ? networkState.currentNetworkProfile.chainExplorer.hashRoute : "");

emitter.on("CLOSE_MODAL", (payload: boolean) => {
  showTransactionModel.value = payload;
});

const gotoHashExplorer = (hash: string) => {
  window.open(explorerBaseURL.value + hashExplorerURL.value + "/" + hash, "_blank");
}

const convertLocalTime = (dateTimeInJSON :string) => {
  return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
};

const copy = (id: string) => {
  let element = document.getElementById(id);
  if (element) {
    let stringToCopy = element.getAttribute("copyValue");
    let copySubject = element.getAttribute("copySubject");
    if (stringToCopy) {
      copyToClipboard(stringToCopy);
      toast.add({
        severity: "info",
        detail: copySubject + " copied",
        group: "br-custom",
        life: 3000,
      });
    }
  }
};

</script>

<style lang="scss" scoped>
@import "@/assets/scss/transactions-data-table.scss";
</style>