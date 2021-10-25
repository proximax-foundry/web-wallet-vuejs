<template>
  <div>
    <DataTable
      :value="namespaces"
      :paginator="true"
      :rows="5"
      responsiveLayout="scroll"
      :alwaysShowPaginator="false"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      >
      <Column :style="{ width: '50px' }">
        <template #body="{data}">
          <div class="text-center">
            <div class="rounded-full w-2 h-2 inline-block" :class="data.expiring?'bg-yellow-500':'bg-green-500'"></div>
          </div>
        </template>
      </Column>
      <Column field="name" :header="$t('services.name')" :style="{ width: '200px' }">
        <template #body="{data}">
          {{data.name}}
        </template>
      </Column>
      <Column field="namespaceId" :header="$t('namespace.namespaceid')" :style="{ width: '180px' }">
        <template #body="{data}">
          <span class="uppercase">{{data.idHex}}</span>
        </template>
      </Column>
      <Column field="linkedId" header="LINKED ASSET / ADDRESS" :style="{ width: '360px' }">
        <template #body="{data}">
          <span class="uppercase">{{ data.linkedId }}</span>
        </template>
      </Column>
      <Column field="linkType" header="BLOCK EXPIRES" :style="{ width: '180px' }">
        <template #body="{data}">
          in {{ data.expiryRelative }}
        </template>
      </Column>
      <Column field="Active" header="EXPIRATION TIMESTAMP ESTIMATE" :style="{ width: '180px' }">
        <template #body="{data}">
          <span :class="data.expiring?'text-yellow-600':'text-gray-700'">{{ data.expiry }}</span>
        </template>
      </Column>
      <Column style="width: 50px;">
        <template #body="">
          <div class="text-txs text-center lg:mr-2">
            <img src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block">
            <div  class="mt-1 pop-option absolute right-0 w-32 rounded-sm p-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-40 text-left lg:mr-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div class="py-1" role="none">
                <router-link :to="{ name: 'ViewServicesNamespaceCreate' }" class="block my-1">Namespace Details</router-link>
                <router-link :to="{ name: 'ViewServicesNamespaceExtend' }" class="block my-1">Extend Duration</router-link>
              </div>
            </div>
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

<script>
import { getCurrentInstance, ref, computed, watch  } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { networkState } from "@/state/networkState";


export default{
  components: { DataTable, Column },
  name: 'NamespaceDataTable',
  props: {
    namespaces: Array
  },

  setup(p, context){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const borderColor = ref('border border-gray-400');

    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const publicKeyExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.publicKeyRoute);
    const addressExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.addressRoute);
    const namespaceExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute);
    const assetExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.assetInfoRoute);

    // emitter.on("CLOSE_MODAL", payload => {
    //   showTransactionModel.value = payload;
    // });

    return {
      borderColor,
      addressExplorerURL,
      assetExplorerURL,
      namespaceExplorerURL,
      publicKeyExplorerURL,
      explorerBaseURL
    }
  }
}
</script>

<style lang="scss" scoped>
.p-datatable-tbody{
  td{
    font-size: 11px;
  }
}

.pop-option:after {
  content: '';
  display: block;
  position: absolute;
  top: -6px;
  right: 20px;
  width: 10px;
  height: 10px;
  background: #FFFFFF;
  border-left:1px solid #E4E4E4;
  border-top:1px solid #E4E4E4;
  -moz-transform:rotate(45deg);
  -webkit-transform:rotate(45deg);
}
</style>