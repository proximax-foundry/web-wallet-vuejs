<template>
  <div>
    <DataTable :value="transactions" :paginator="true" :rows="10" scrollDirection="horizontal"
      :alwaysShowPaginator="false" responsiveLayout="scroll"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="">
      <Column style="width: 200px" headerClass="invisible" v-if="!wideScreen">
        <template #body="{ data }">
          <div>
            <div class="uppercase text-xxs font-bold mb-1">{{ $t('dashboard.txHash') }}</div>
            <div class="flex items-center">
              <div @click="gotoHashExplorer(data.hash)"
                class="uppercase cursor-pointer font-bold text-txs text-blue-primary "><span class="text-txs"
                  v-tooltip.right="data.hash">{{ data.hash.substring(0, 20) }}...</span></div>
              <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy(data.hash)"
                class="ml-0.5 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{ $t('dashboard.type') }}</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-txs mr-2">{{ data.type }}</div>
              <div>
                <img src="@/modules/dashboard/img/icon-txn-in.svg" class="inline-block w-5" v-if="data.in_out === true">
                <img src="@/modules/dashboard/img/icon-txn-out.svg" class="inline-block w-5"
                  v-else-if="data.in_out === false">
              </div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5"
              v-if="data.recipient != '' && data.recipient != null">{{ $t('general.recipient') }}</div>
            <div class="uppercase font-bold text-txs">
              <span v-if="data.recipient === '' || data.recipient === null"></span>
              <span v-tooltip.right="Helper.createAddress(data.recipient).pretty()"
                v-else-if="data.recipientNamespaceName" class="truncate inline-block text-txs">{{
                  data.recipientNamespaceName }}</span>
              <span v-tooltip.right="Helper.createAddress(data.recipient).pretty()" v-else
                class="truncate inline-block text-txs">{{ walletState.currentLoggedInWallet ?
                  walletState.currentLoggedInWallet.convertAddressToNamePretty(data.recipient).substring(0, 20) : ""
                }}</span>
            </div>
          </div>
        </template>
      </Column>
      <Column style="width: 200px" headerClass="invisible" v-if="!wideScreen">
        <template #body="{ data }">
          <div v-if="selectedGroupType === transactionGroupType.CONFIRMED">
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">{{ $t('dashboard.timestamp') }}</div>
            <div class="uppercase font-bold text-txs">{{ convertLocalTime(data.timestamp) }}</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{ $t('general.sender') }}</div>
            <div class="uppercase font-bold text-txs">
              <span v-if="data.sender === '' || data.sender === null"></span>
              <span v-else v-tooltip.right="Helper.createAddress(data.sender).pretty()"
                class="truncate inline-block text-txs">
                <a :href="getPublicKeyExplorerUrl(data.sender)" target="_blank">
                  {{ walletState.currentLoggedInWallet ?
                    walletState.currentLoggedInWallet.convertAddressToNamePretty(data.sender).substring(0, 20) : "" }}
                </a>
              </span>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{ $t('dashboard.txAmount') }}</div>
            <div class="text-txs uppercase font-bold">{{ data.amountTransfer ? data.amountTransfer : '-' }} <b
                v-if="data.amountTransfer">{{ nativeTokenName }}</b></div>
          </div>
        </template>
      </Column>
      <Column :header="$t('dashboard.inOut')" headerStyle="width:40px" v-if="wideScreen">
        <template #body="{ data }">
          <div>
            <img src="@/modules/dashboard/img/icon-txn-in.svg" class="inline-block" v-if="data.in_out === true">
            <img src="@/modules/dashboard/img/icon-txn-out.svg" class="inline-block" v-else-if="data.in_out === false">
          </div>
        </template>
      </Column>
      <Column field="hash" :header="$t('dashboard.txHash')" headerStyle="width:100px" v-if="wideScreen">
        <template #body="{ data }">
          <div class="flex items-center">
            <span @click="gotoHashExplorer(data.hash)" class="text-txs text-blue-primary cursor-pointer"
              v-tooltip.bottom="data.hash">{{ data.hash.substring(0, 20) }}...</span>
            <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy(data.hash)"
              class="ml-0.5 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
          </div>
        </template>
      </Column>
      <Column field="timestamp" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen"
        :header="$t('dashboard.timestamp')" headerStyle="width:110px">
        <template #body="{ data }">
          <span class="text-txs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column field="type" :header="$t('dashboard.type')" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{ data }">
          <span class="text-txs">{{ data.type }}</span>
        </template>
      </Column>
      <!-- <Column field="block" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen" :header="$t('general.block')" headerStyle="width:60px">
        <template #body="{data}">
          <div class="text-txs">{{ data.block }}</div>
        </template>
      </Column> -->
      <Column field="signer" :header="$t('general.sender')" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{ data }">
          <span v-if="data.sender === '' || data.sender === null"></span>
          <span v-else v-tooltip.bottom="Helper.createAddress(data.sender).pretty()"
            class="truncate inline-block text-txs">
            <a :href="getPublicKeyExplorerUrl(data.sender)" target="_blank">
              {{ walletState.currentLoggedInWallet ?
                walletState.currentLoggedInWallet.convertAddressToNamePretty(data.sender).substring(0, 20) : '' }}
            </a>
          </span>
        </template>
      </Column>
      <Column field="recipient" :header="$t('general.recipient')" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{ data }">
          <span v-if="data.recipient === '' || data.recipient === null"></span>
          <span v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else-if="data.recipientNamespaceName"
            class="truncate inline-block text-txs">{{ data.recipientNamespaceName }}</span>
          <span v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else
            class="truncate inline-block text-txs">{{ walletState.currentLoggedInWallet ?
              walletState.currentLoggedInWallet.convertAddressToNamePretty(data.recipient).substring(0, 20) : '' }}</span>
        </template>
      </Column>
      <Column :header="$t('dashboard.txFee')" v-if="selectedGroupType === transactionGroupType.CONFIRMED && wideScreen"
        headerStyle="width:90px">
        <template #body="{ data }">
          <div class="text-txs">{{ data.fee }} <b v-if="data.fee">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column :header="$t('general.amount')" headerStyle="width:90px" v-if="wideScreen">
        <template #body="{ data }">
          <div class="text-txs">{{ data.amountTransfer ? data.amountTransfer : '-' }} <b v-if="data.amountTransfer">{{
            nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column :header="$t('general.sda')" headerStyle="width:40px" v-if="wideScreen">
        <template #body="{ data }">
          <div class="flex items-center">
            <img src="@/modules/dashboard/img/icon-proximax-logo-gray.svg" class="inline-block"
              v-if="checkOtherAsset(data.sda)"
              v-tooltip.left="{ value: '<tiptitle>' + $t('general.sdaFull') + '</tiptitle><tiptext>' + displaySDAs(data.sda) + '</tiptext>', escape: true }">
            <span v-else class="flex">-</span>
          </div>
        </template>
      </Column>
      <Column :header="$t('general.message')" headerStyle="width:40px" v-if="wideScreen">
        <template #body="{ data }">
          <div class="flex justify-center">
            <img src="@/modules/dashboard/img/icon-message.svg"
              v-tooltip.left="'<tiptitle>' + data.messageTypeTitle + '</tiptitle><tiptext>' + data.message + '</tiptext>'"
              class="inline-block" v-if="data.message && data.messageType !== 1">
            <DecryptMessageModal v-else-if="data.message && data.messageType !== 0"
              :messageTypeTitle="data.messageTypeTitle" :message="data.message" :recipientAddress="data.recipient"
              :initiator="data.initiator" />
            <div v-else class="w-full text-center">-</div>
          </div>
        </template>
      </Column>
      <template #empty>
        {{ $t('general.noRecord') }}
      </template>
      <template #loading>
        {{ $t('dashboard.fetchingTx') }}
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, computed, onMounted, onUnmounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { networkState } from "@/state/networkState";
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
import { useToast } from 'primevue/usetoast';
import { walletState } from "@/state/walletState";
import type { SDA } from "../../model/transactions/sda";
import type { ConfirmedTransferTransaction } from "../../model/transactions/transaction";
import DecryptMessageModal from "../DecryptMessageModal.vue";
import { useI18n } from 'vue-i18n';

defineProps({
  transactions:{
    type:  Array<ConfirmedTransferTransaction>,
    required:true
  },
  selectedGroupType: String,
  currentAddress: String
})

const checkOtherAsset = (assets: SDA[]) => {
  if (assets) {
    if (assets.length > 0) {
      return true;
    }
  }
  return false;
}

const displaySDAs = (sdas: SDA[]) => {
  let sda_rows = [];
  if (sdas.length > 0) {
    for (const sda of sdas) {
      let asset_div = displayAssetDiv(sda);
      sda_rows.push(asset_div);
    }
    return sda_rows.join("<br>");
  }
}

const displayAssetDiv = (sda: SDA) => {
  let asset_div;
  let assetArray = []
  assetArray.push(sda.id);

  if (sda.currentAlias && sda.currentAlias.length) {
    asset_div = (sda.amount + ' ' + sda.currentAlias[0].name);
  }
  else {
    asset_div = (sda.amount + ' - ' + sda.id);
  }
  return asset_div;
}

const toast = useToast();
const { t } = useI18n();
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
const publicKeyExplorerURL = computed(() => networkState.currentNetworkProfile ? networkState.currentNetworkProfile.chainExplorer.publicKeyRoute : "");


const getPublicKeyExplorerUrl = (publicKey: string) => {

  return explorerBaseURL.value + publicKeyExplorerURL.value + "/" + publicKey
}


emitter.on("CLOSE_MODAL", (payload: boolean) => {
  showTransactionModel.value = payload;
});

const gotoHashExplorer = (hash: string) => {
  window.open(explorerBaseURL.value + hashExplorerURL.value + "/" + hash, "_blank");
}

const convertLocalTime = (dateTimeInJSON: string) => {
  return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
};

const copy = (data:string) => {
      let stringToCopy = data;
      let copySubject = t('dashboard.txHash')
      copyToClipboard(stringToCopy);

      toast.add({ severity: 'info', detail: copySubject + ' ' + t('general.copied'), group: 'br-custom', life: 3000 });
    };

</script>

<style lang="scss" scoped>
@import "@/assets/scss/transactions-data-table.scss";
</style>