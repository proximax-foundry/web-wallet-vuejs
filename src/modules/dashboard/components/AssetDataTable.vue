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
          <div v-for="namespace, item in data.linkedNamespace" :key="item">
            <div class="mb-1 text-txs">{{namespace.name}}</div>
          </div>
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

export default{
  components: { DataTable, Column },
  name: 'AssetDataTable',
  props: {
    assets: Array,
    currentPublicKey: String,
    account: WalletAccount
  },

  setup(props, context){
    const { assets, account } = toRefs(props);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const accountAssets = ref();
    const isMenuShow = ref([]);

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
            amount: Helper.toCurrencyFormat(assets[i].getExactAmount(), assets[i].divisibility),
            supply: Helper.toCurrencyFormat(assets[i].getExactSupply(), assets[i].divisibility),
            linkedNamespace: namespaceAlias,
            height: assets[i].height,
          };
          formattedAssets.push(data);
          isMenuShow.value[i] = false;
        }
      }
      return formattedAssets;
    }

      // return formattedAssets;
    const borderColor = ref('border border-gray-400');

    const showMenu = (i) => {
      currentMenu.value = i;
      isMenuShow.value[i] = !isMenuShow.value[i];
    }

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

    const currentMenu = ref('empty');

    const hoverOverMenu = (i) => {
      currentMenu.value = i;
    };

    const hoverOutMenu = () => {
      currentMenu.value = 'empty';
    };

    return {
      borderColor,
      showMenu,
      isMenuShow,
      accountAssets,
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
  z-index: 2;
}
</style>