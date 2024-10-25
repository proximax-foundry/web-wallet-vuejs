<template>
  <div>
    <DataTable
      :value="transactions"
      :paginator="false"
      :rows="10"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      responsiveLayout="scroll"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
    >
      <Column
        field="hash"
        :header="$t('dashboard.txHash')"
        headerStyle="width:100px;"
      >
        <template #body="{ data }">
          <div class="flex items-center">
            <span
              @click="gotoHashExplorer(data.hash)"
              class="text-txs text-blue-primary cursor-pointer"
              v-tooltip.bottom="data.hash"
              >{{ data.hash.substring(0, 20) }}...</span
            >
            <font-awesome-icon
              icon="copy"
              :title="$t('general.copy')"
              @click="copy(data.hash)"
              class="ml-0.5 w-5 h-5 text-blue-link cursor-pointer"
            ></font-awesome-icon>
          </div>
        </template>
      </Column>
      <Column
        field="timestamp"
        :header="$t('dashboard.timestamp')"
        headerStyle="width:110px;"
      >
        <template #body="{ data }">
          <span class="text-txs">{{ convertLocalTime(data.timestamp) }}</span>
        </template>
      </Column>
      <Column
        field="typeName"
        :header="$t('dashboard.type')"
        headerStyle="width:110px;"
      >
        <template #body="{ data }">
          <span class="text-txs">{{ data.type }}</span>
        </template>
      </Column>
      <Column
        field="block"
        header="Block"
        headerStyle="width:110px;text-transform:uppercase"
      >
      </Column>
      <Column :header="$t('dashboard.txFee')" headerStyle="width:110px;">
        <template #body="{ data }">
          <div class="text-txs">
            {{ data.fee }}
            <b v-if="data.fee">{{ AppState.nativeToken.label }}</b>
          </div>
        </template>
      </Column>
      <Column header="OFFERS(GIVE/GET/DURATION)" headerStyle="width:150px">
        <template #body="{ data }">
          <span
            class="inline-block bg-blue-100 font-bold text-xs py-1 px-2 my-1 mx-1 rounded"
            v-for="(item, index) in data.sdaExchange"
            :key="index"
            v-tooltip.left="{
              value: `<tiptext>Approximately ${durationTime(
                item.duration
              )} Day${durationTime(item.duration) > 1 ? 's' : ''}</tiptext>`,
              disabled: Boolean(item.duration === undefined),
              escape: false,
            }"
          >
            <div>
              <span v-if="item.amountGive" class="mr-2">{{
                item.amountGive
              }}</span>
              <div class="inline-block">
                <div
                  v-if="item.sdaGiveNamespace"
                  @click="gotoNamespaceExplorer(item.sdaGiveNamespace)"
                  class="text-blue-600 hover:text-blue-primary flex hover:underline"
                >
                  {{ item.sdaGiveNamespace }}
                </div>
                <div
                  v-else
                  @click="gotoAssetExplorer(item.sdaIdGive)"
                  class="text-blue-600 hover:text-blue-primary flex hover:underline"
                >
                  {{ item.sdaIdGive }}
                </div>
              </div>
            </div>
            <div>
              <span v-if="item.amountGet" class="mr-2">{{
                item.amountGet
              }}</span>
              <div class="inline-block">
                <div
                  v-if="item.sdaGetNamespace"
                  @click="gotoNamespaceExplorer(item.sdaGetNamespace)"
                  class="text-blue-600 hover:text-blue-primary flex hover:underline"
                >
                  {{ item.sdaGetNamespace }}
                </div>
                <div
                  v-else
                  @click="gotoAssetExplorer(item.sdaIdGet)"
                  class="text-blue-600 hover:text-blue-primary flex hover:underline"
                >
                  {{ item.sdaIdGet }}
                </div>
              </div>
            </div>
            <div v-if="item.duration">
              {{
                item.duration
                  ? item.duration + " Block" + (item.duration > 1 ? "s" : "")
                  : "-"
              }}
            </div>
          </span>
        </template>
      </Column>
      <template #empty> No transaction found </template>
      <template #loading> Fetching transactions </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ChainProfileConfig } from "@/models/stores";
import { ConfirmedSdaExchangeTransaction } from "@/modules/dashboard/model/transactions/confirmed/sdaExchange";
import { AppState } from "@/state/appState";
import { networkState } from "@/state/networkState";
import { copyToClipboard } from "@/util/functions";
import { Helper } from "@/util/typeHelper";
import { useToast } from "primevue/usetoast";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

defineProps({
  transactions: {
    type: Array<ConfirmedSdaExchangeTransaction>,
    required: true,
  },
});
const convertLocalTime = (dateTimeInJSON: string) => {
  return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
};
let chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
chainConfig.init();
let blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);

const durationTime = (block: number) => {
  let durationByHour = block / ((60 / blockTargetTime) * 60);
  let durationByDay = durationByHour / 24;
  return durationByDay;
};

const namespaceExplorerURL = computed(
  () => networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute
);
const assetExplorerURL = computed(
  () => networkState.currentNetworkProfile.chainExplorer.assetInfoRoute
);
const hashExplorerURL = computed(
  () => networkState.currentNetworkProfile.chainExplorer.hashRoute
);

const explorerBaseURL = computed(
  () => networkState.currentNetworkProfile.chainExplorer.url
);

const gotoHashExplorer = (hash: string) => {
  window.open(
    explorerBaseURL.value + hashExplorerURL.value + "/" + hash,
    "_blank"
  );
};

const gotoNamespaceExplorer = (namespace: string) => {
  window.open(
    explorerBaseURL.value + namespaceExplorerURL.value + "/" + namespace,
    "_blank"
  );
};

const gotoAssetExplorer = (assetIdHex: string) => {
  window.open(
    explorerBaseURL.value + assetExplorerURL.value + "/" + assetIdHex,
    "_blank"
  );
};
const { t } = useI18n();
const toast = useToast();
const copy = (data: string) => {
  let stringToCopy = data;
  let copySubject = t("dashboard.txHash");
  copyToClipboard(stringToCopy);

  toast.add({
    severity: "info",
    detail: copySubject + " " + t("general.copied"),
    group: "br-custom",
    life: 3000,
  });
};
</script>
