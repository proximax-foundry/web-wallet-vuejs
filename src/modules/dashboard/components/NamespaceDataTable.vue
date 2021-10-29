<template>
  <div>
    <DataTable
      :value="accountNamespaces"
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
          <div class="data.expiryRelative">in {{ data.expiryRelative }}</div>
        </template>
      </Column>
      <Column field="Active" header="EXPIRATION TIMESTAMP ESTIMATE" :style="{ width: '180px' }">
        <template #body="{data}">
          <span :class="data.expiring?'text-yellow-600':'text-gray-700'">{{ data.expiry }}</span>
        </template>
      </Column>
      <Column style="width: 50px;">
        <template #body="{data}">
          <div class="text-txs text-center lg:mr-2" @mouseover="hoverOverMenu(data.i)" @mouseout="hoverOutMenu">
            <img src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block" @click="showMenu(data.i)">
            <div v-if="isMenuShow[data.i]" class="mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div role="none" class="my-2">
                <router-link :to="{ name: 'ViewServicesNamespaceCreate' }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Namespace Details</router-link>
                <router-link :to="{ name: 'ViewServicesNamespaceExtend' }"  class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Extend Duration</router-link>
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
import { getCurrentInstance, ref, computed, watch, onMounted, toRefs  } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {Namespace} from '@/models/namespace';
import { listenerState } from '@/state/listenerState';
import { Helper } from '@/util/typeHelper';
import { networkState } from "@/state/networkState";
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";
import { WalletAccount } from '@/models/walletAccount';
import moment from 'moment';


export default{
  components: { DataTable, Column },
  name: 'NamespaceDataTable',
  props: {
    namespaces: Array,
    currentBlockHeight: Number,
    account: WalletAccount
  },

  setup(props, context){
    const rowLimit = 5;
    const { namespaces, currentBlockHeight } = toRefs(props);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const accountNamespaces = ref();
    const isMenuShow = ref([]);

    let chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
    chainConfig.init();
    let blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);

    watch([currentBlockHeight, namespaces], ([newBlockHeight, namespaces]) => {
      accountNamespaces.value = generateDatatable(namespaces, newBlockHeight);
    });

    onMounted(() => {
      accountNamespaces.value = generateDatatable(namespaces.value, currentBlockHeight.value);
    });

    const generateDatatable = (namespaces, currentBlockHeight) => {
      let formattedNamespaces = [];
      let namespaceCount;
      if(namespaces.length < rowLimit + 1){
        namespaceCount = namespaces.length;
      }else{
        namespaceCount = rowLimit + 1;
      }

      for(let i=0; i < namespaceCount; ++i){
        let linkName = "";

        switch (namespaces[i].linkType) {
          case 1:
            linkName = "Asset";
            break;
          case 2:
            linkName = "Address";
            break;
          default:
            break;
        }

        let blockDifference = namespaces[i].endHeight - currentBlockHeight;
        let blockTargetTimeByDay = (60 / blockTargetTime) * 60 * 24;
        let blockTargetTimeByHour = (60 / blockTargetTime) * 60;
        let expiryDay = Math.floor(blockDifference / blockTargetTimeByDay);
        let expiryHour = Math.floor((blockDifference % blockTargetTimeByDay ) / blockTargetTimeByHour);
        let expiryMin = (blockDifference % blockTargetTimeByDay ) % blockTargetTimeByHour;
        let expiryDate = moment().add(expiryDay, 'd').add(expiryHour, 'h').add(expiryMin, 'm').format('MM/D/YYYY hh:mm:ss');
        let data = {
          i: i,
          idHex: namespaces[i].idHex,
          name: namespaces[i].name,
          linkType: linkName,
          linkedId: linkName === "Address" ? Helper.createAddress(namespaces[i].linkedId).pretty() : namespaces[i].linkedId,
          endHeight: namespaces[i].endHeight,
          expiring: (blockDifference < (blockTargetTimeByDay * 14)),
          expiryRelative: currentBlockHeight?moment().add(expiryDay, 'd').fromNow(true):'',
          expiry: currentBlockHeight?expiryDate:'',
        };

        formattedNamespaces.push(data);
        isMenuShow.value[i] = false;
      }
      return formattedNamespaces;
    }




    const showMenu = (i) => {
      currentMenu.value = i;
      isMenuShow.value[i] = !isMenuShow.value[i];
    }

    const currentMenu = ref('');

    // emitted from App.vue when click on any part of the page
    emitter.on('PAGE_CLICK', () => {
      var k = 0;
      while(k < isMenuShow.value.length){
        if(k != currentMenu.value){
          isMenuShow.value[k] = false;
        }
        k++;
      }
    });

    const hoverOverMenu = (i) => {
      currentMenu.value = i;
    };

    const hoverOutMenu = () => {
      currentMenu.value = 'e';
    };

    const borderColor = ref('border border-gray-400');
    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const publicKeyExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.publicKeyRoute);
    const addressExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.addressRoute);
    const namespaceExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute);
    const assetExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.assetInfoRoute);

    return {
      borderColor,
      addressExplorerURL,
      assetExplorerURL,
      namespaceExplorerURL,
      publicKeyExplorerURL,
      explorerBaseURL,
      showMenu,
      isMenuShow,
      accountNamespaces,
      hoverOverMenu,
      hoverOutMenu
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