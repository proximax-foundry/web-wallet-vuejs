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
                <div class="uppercase cursor-pointer font-bold text-txs">
                    <span class="text-txs" v-tooltip.right="data.txnHash">{{ data.txnHash.substring(0, 20) }}...</span></div>
              </div>
            </div>
          </template>
        </Column>
        <Column style="width: 200px" headerClass="invisible" v-if="!wideScreen">
          <template #body="{ data }">
            <div>
              <div class="uppercase text-xxs font-bold mb-1"> Status </div>
              <div class="flex items-center">
                <span class="text-txs">{{ data.statusMsg }}</span>
              </div>
            </div>
          </template>
        </Column>
        <Column field="hash" :header="$t('dashboard.txHash')" headerStyle="width:100px" v-if="wideScreen">
          <template #body="{ data }">
            <div class="flex items-center">
              <span class="text-txs cursor-pointer" v-tooltip.bottom="data.txnHash">{{ data.txnHash.substring(0, 20) }}...</span>
            </div>
          </template>
        </Column>
        <Column field="status" :header="'Status'" headerStyle="width:110px" v-if="wideScreen">
          <template #body="{ data }">
            <span class="text-txs">{{ data.statusMsg }}</span>
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

  <script lang="ts">
  import Tooltip from 'primevue/tooltip';
  export default {
     directives: {
     'tooltip': Tooltip
    },
  }
  </script>
  
  <script lang="ts" setup>
  import { getCurrentInstance, ref, onMounted, onUnmounted } from "vue";
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';

  defineProps({
    transactions: Array
  })

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
  emitter.on("CLOSE_MODAL", (payload: boolean) => {
    showTransactionModel.value = payload;
  });


  </script>
