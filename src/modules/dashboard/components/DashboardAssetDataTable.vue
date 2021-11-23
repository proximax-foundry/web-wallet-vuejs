<template>
  <div>
    <DataTable
      :value="accountAssets"
      :paginator="true"
      :rows="20"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      tableStyle=""
      >
      <Column :style="{ width: '50px' }">
      </Column>
      <Column field="assetId" :header="$t('dashboard.assetid')" :style="{ width: '200px' }">
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{data.idHex}}</span>
        </template>
      </Column>
      <Column field="linkedNamespace" header="NAMESPACE" :style="{ width: '180px' }">
        <template #body="{data}">
          <div v-if="data.linkedNamespace.length > 0">
            <div v-if="data.linkedNamespace.length == 1">
              <div v-for="namespace, item in data.linkedNamespace" :key="item">
                <div class="mb-1 text-txs">{{ namespace.name }}</div>
              </div>
            </div>
            <div v-else>
              
                <div class="mb-1 text-txs">{{ data.linkedNamespace[0].name }} <div class="inline-block border border-gray-300 p-1 rounded-sm ml-2 cursor-pointer" @click="showNsList(data.i)" @mouseover="hoverOverNsList(data.i)" @mouseout="hoverOutNsList">+ <span class="font-bold">{{ data.linkedNamespace.length -1 }}</span></div></div>
                <div class="border p-3 w-28 border-gray-100 shadow-sm absolute bg-white" v-if="isNsListShow[data.i]" @mouseover="hoverOverNsList(data.i)" @mouseout="hoverOutNsList">
                  <div v-for="namespace, item in data.linkedNamespace.slice(1)" :key="item">
                    {{ namespace.name }}
                  </div>
                </div>
              </div>
          </div>
          <div v-else>no linked namespace</div>
        </template>
      </Column>
      <Column field="supply" header="SUPPLY" :style="{ width: '180px' }">
        <template #body="{data}">
          <span class="uppercase text-txs">{{data.supply}}</span>
        </template>
      </Column>
      <Column field="amount" header="AMOUNT" :style="{ width: '180px' }">
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{data.amount}}</span>
        </template>
      </Column>
      <Column field="creator" header="CREATOR" style="width: 180px;">
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{ data.owner == currentPublicKey ? 'yes': 'no'}}</span>
          <img v-if="data.owner == currentPublicKey" src="@/modules/dashboard/img/icon-info.svg" class="ml-2 inline-block cursor-pointer" v-tooltip.bottom="'<tiptitle>WALLET ADDRESS</tiptitle><tiptext>' + data.address + '</tiptext><tipbottom>MY PERSONAL ACCOUNT <img src=&quot;/icons/icon-personal-blue.png&quot;></tipbottom>'">
          <img v-else src="@/modules/dashboard/img/icon-info.svg" class="ml-2 inline-block cursor-pointer" v-tooltip.bottom="'<tiptitle>WALLET ADDRESS</tiptitle><tiptext>' + data.address + '</tiptext>'">
        </template>
      </Column>
      <Column field="height" header="BLOCK HEIGHT" style="width: 180px;">
        <template #body="{data}">
          <span class="text-txs">{{data.height}}</span>
        </template>
      </Column>
      <Column style="width: 50px;">
        <template #body="{data}">
          <div class="text-txs text-center lg:mr-2" @mouseover="hoverOverMenu(data.i)" @mouseout="hoverOutMenu">
            <img src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block" @click="showMenu(data.i)">
            <div v-if="isMenuShow[data.i]" class="mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div role="none" class="my-2">
                <router-link :to="{ name: 'ViewServicesAssetsModifySupplyChange' }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Asset Details</router-link>
                <router-link :to="{ name: 'ViewServicesAssetsModifySupplyChange' }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Modify Supply</router-link>
                <router-link :to="{ name: 'ViewServicesAssetsLinkToNamespace' }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Linked to namespace</router-link>
                <a :href="data.explorerLink" class="block hover:bg-gray-100 transition duration-200 p-2 z-20" target=_new>View in Explorer<img src="@/modules/dashboard/img/icon-link-new.svg" class="inline-block ml-2 relative -top-1"></a>
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
import { ref, onMounted, getCurrentInstance, watch, toRefs } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Helper } from '@/util/typeHelper';
import { networkState } from "@/state/networkState";
import { WalletAccount } from '@/models/walletAccount';
import Tooltip from 'primevue/tooltip';
import { PublicAccount } from 'tsjs-xpx-chain-sdk';

export default{
  components: { DataTable, Column },
  name: 'AssetDataTable',
  props: {
    assets: Array,
    currentPublicKey: String,
    account: WalletAccount
  },
  directives: {
    'tooltip': Tooltip
  },

  setup(props, context){
    const { assets, account } = toRefs(props);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const accountAssets = ref();
    const isMenuShow = ref([]);
    const isNsListShow = ref([]);

    watch(assets, (updatedAssets) => {
      accountAssets.value = generateAssetDatatable(updatedAssets, account.value);
    });

    onMounted(() => {
      accountAssets.value = generateAssetDatatable(assets.value, account.value);
    });

    const generateAssetDatatable = (assets, account) => {
      let formattedAssets = [];

      for(let i=0; i < assets.length; ++i){
        let namespaceAlias = [];
        let assetId = assets[i].idHex;

        if(assetId != networkState.currentNetworkProfile.network.currency.assetId){
          let namespaces = account.findNamespaceNameByAsset(assetId);
          for(let j = 0; j < namespaces.length; ++j){
            let aliasData = {
              name: namespaces[j].name
            };

            namespaceAlias.push(aliasData);
          }

          let data = {
            i: i,
            idHex: assetId,
            owner: assets[i].owner,
            address: PublicAccount.createFromPublicKey(assets[i].owner, networkState.currentNetworkProfile.network.type).address.pretty(),
            amount: Helper.toCurrencyFormat(assets[i].getExactAmount(), assets[i].divisibility),
            supply: Helper.toCurrencyFormat(assets[i].getExactSupply(), assets[i].divisibility),
            linkedNamespace: namespaceAlias,
            height: assets[i].height,
            explorerLink: networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.assetInfoRoute + '/' + assetId
          };
          formattedAssets.push(data);
          isMenuShow.value[i] = false;
          isNsListShow.value[i] = false;
        }
      }
      return formattedAssets;
    }

      // return formattedAssets;
    const borderColor = ref('border border-gray-400');

    const showNsList = (i) => {
      currentNsMenu.value = i;
      isNsListShow.value[i] = !isNsListShow.value[i];
    }

    const showMenu = (i) => {
      currentMenu.value = i;
      isMenuShow.value[i] = !isMenuShow.value[i];
    }

    // emitted from App.vue when click on any part of the page
    emitter.on('PAGE_CLICK', () => {
      var j = 0;
      while(j < isNsListShow.value.length){
        if(j != currentNsMenu.value){
          isNsListShow.value[j] = false;
        }
        j++;
      }

      var k = 0;
      while(k < isMenuShow.value.length){
        if(k != currentMenu.value){
          isMenuShow.value[k] = false;
        }
        k++;
      }
    });

    const currentMenu = ref('empty');
    const currentNsMenu = ref('empty');

    const hoverOverMenu = (i) => {
      currentMenu.value = i;
    };

    const hoverOutMenu = () => {
      currentMenu.value = 'empty';
    };

    const hoverOverNsList = (i) => {
      currentNsMenu.value = i;
    };

    const hoverOutNsList = () => {
      currentNsMenu.value = 'empty';
    };

    return {
      borderColor,
      showMenu,
      showNsList,
      isMenuShow,
      isNsListShow,
      accountAssets,
      hoverOverMenu,
      hoverOutMenu,
      hoverOverNsList,
      hoverOutNsList
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
  z-index: 2;
}
</style>