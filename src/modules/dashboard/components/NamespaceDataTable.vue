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
      <Column field="namespaceId" header="Namespace ID" >
        <template #body="{data}">
          <span class="uppercase">{{data.idHex}}</span>
        </template>
      </Column>
      <Column field="name" header="Name" >
        <template #body="{data}">
          {{data.name}}
        </template>
      </Column>
      <Column field="linkType" header="Link Type" >
        <template #body="{data}">
          {{data.linkType}}
        </template>
      </Column>
      <Column field="linkedId" header="Asset ID/Address" >
        <template #body="{data}">
          <span class="uppercase">{{data.linkedId}}</span>
        </template>
      </Column>
      <Column field="Active" header="Active" >
        <template #body="{data}">
          <span class="uppercase ">{{data.active}}</span>{
        </template>
      </Column>
      <template #empty>
        No records found
      </template>
      <template #loading>
          Loading transactions data. Please wait.
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

    emitter.on("CLOSE_MODAL", payload => {
      showTransactionModel.value = payload;
    });

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
</style>