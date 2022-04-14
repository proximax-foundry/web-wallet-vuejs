<template>
  <div>
    <DataTable
      :value="generateAssetDatatable"
      :paginator="true"
      :rows="20"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      tableStyle=""
      class="w-full"
      >
      <template #header>
        <div class="flex justify-between">
          <span class="text-sm pt-1 text-gray-700 ml-2 lg:ml-7">{{$t('general.asset',2)}} ({{getNameByAddress(filterAssets)==''?$t('asset.assetCreatedInWallet',{walletName: walletName}): $t('asset.assetCreatedByAcc',{accountName: getNameByAddress(filterAssets)}) }})</span>
          <SelectInputPluginClean v-model="filterAssets" :options="listAccounts" :selectDefault="selectedAddress" class="w-48 lg:w-60 inline-block" />
        </div>
      </template>
      <Column style="width: 250px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">{{$t('general.assetId')}}</div>
            <div class="uppercase font-bold text-txs">{{data.idHex}}</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('general.namespace')}}</div>
            <div class="uppercase font-bold text-txs">
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
              <div v-else>{{$t('general.noLinkedNamespace')}}</div>
            </div>
          </div>
        </template>
      </Column>
      <Column style="width: 250px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">{{$t('general.supply')}}</div>
            <div class="uppercase font-bold text-txs">{{data.supply}}</div>
            <div class="uppercase text-xxs text-gray-300 font-bold mt-2 mb-1">{{$t('general.amount')}}</div>
            <div class="uppercase font-bold text-txs">{{data.amount}}</div>
            <div class="uppercase text-xxs text-gray-300 font-bold mt-2 mb-1">{{$t('general.blockHeight')}}</div>
            <div class="uppercase font-bold text-txs">{{data.height}}</div>
          </div>
        </template>
      </Column>
      <Column style="width: 50px" v-if="wideScreen">
      </Column>
      <Column field="assetId" :header="$t('general.assetId')" headerStyle="text-transform:uppercase" style="`wideScreen?'min-width: 200px'?'width: 200px'`" v-if="wideScreen">
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{data.idHex}}</span>
        </template>
      </Column>
      <Column field="linkedNamespace" :header="$t('general.namespace')" headerStyle="text-transform:uppercase" style="`wideScreen?'min-width: 180px'?'width: 180px'`" v-if="wideScreen">
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
          <div v-else>{{$t('general.noLinkedNamespace')}}</div>
        </template>
      </Column>
      <Column field="supply" :header="$t('general.supply')" headerStyle="text-transform:uppercase" style="`wideScreen?'min-width: 180px'?'width: 180px'`" v-if="wideScreen">
        <template #body="{data}">
          <span class="uppercase text-txs">{{data.supply}}</span>
        </template>
      </Column>
      <Column field="amount" :header="$t('general.amount')" headerStyle="text-transform:uppercase" style="`wideScreen?'min-width: 180px'?'width: 180px'`" v-if="wideScreen">
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{data.amount}}</span>
        </template>
      </Column>
      <Column field="height" :header="$t('general.blockHeight')" headerStyle="text-transform:uppercase" style="`wideScreen?'min-width: 180px'?'width: 180px'`" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">{{data.height}}</span>
        </template>
      </Column>
      <Column style="width: 50px">
        <template #body="{data}">
          <div class="text-txs text-center lg:mr-2" @mouseover="hoverOverMenu(data.i)" @mouseout="hoverOutMenu">
            <img src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block" @click="showMenu(data.i)">
            <div v-if="isMenuShow[data.i]" class="mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div role="none" class="my-2">
                <router-link :to="{ name: 'ViewServicesAssetsModifySupplyChange', params: {assetId: data.idHex, address: data.address} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.modifySupply')}}</router-link>
                <router-link :to="{ name: 'ViewServicesAssetsLinkToNamespace', params: {assetId: data.idHex, address: data.address} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.linkToNamespace')}}</router-link>
                <router-link :to="{ name: 'ViewUpdateAssetMetadata', params: {targetId: data.idHex} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Update Metadata</router-link>
                <a :href="data.explorerLink" class="block hover:bg-gray-100 transition duration-200 p-2 z-20" target=_new>{{$t('general.viewInExplorer')}}<img src="@/modules/dashboard/img/icon-link-new.svg" class="inline-block ml-2 relative -top-1"></a>
              </div>
            </div>
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

<script>
import { computed, ref, getCurrentInstance, toRefs, onMounted, onUnmounted } from "vue";
import { Address } from "tsjs-xpx-chain-sdk";
import SelectInputPluginClean from "@/components/SelectInputPluginClean.vue";
import { walletState } from "@/state/walletState";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Helper } from '@/util/typeHelper';
import { networkState } from "@/state/networkState";
import { WalletAccount } from '@/models/walletAccount';
import Tooltip from 'primevue/tooltip';
import { PublicAccount } from 'tsjs-xpx-chain-sdk';
import { AppState } from '@/state/appState';
import { useI18n } from 'vue-i18n';

export default{
  components: { DataTable, Column, SelectInputPluginClean },
  name: 'AssetDataTable',
  props: {
    assets: Array,
    account: WalletAccount,
    address: String,
  },
  directives: {
    'tooltip': Tooltip
  },

  setup(props){
    const {t} = useI18n();
    const wideScreen = ref(false);
    const screenResizeHandler = () => {
      if(window.innerWidth < '1024'){
        wideScreen.value = false;
      }else{
        wideScreen.value = true;
      }
    };
    screenResizeHandler();

    onMounted(() => {
      window.addEventListener("resize", screenResizeHandler);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", screenResizeHandler);
    });

    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const isMenuShow = ref([]);
    const isNsListShow = ref([]);

    const selectedAddress = ref('');
    const {address} = toRefs(props);
    if(props.address){
      selectedAddress.value = Address.createFromRawAddress(address.value).plain();
    }

    const listAccounts = computed(() => {
      let accountOption = [];
      accountOption.push(
        {value: '', label: t('general.showAll')},
      );
      walletState.currentLoggedInWallet.accounts.forEach(account => {
        accountOption.push(
          {value: account.address, label: account.name},
        );
      });
      walletState.currentLoggedInWallet.others.forEach(account => {
        accountOption.push(
          {value: account.address, label: account.name},
        );
      });
      return accountOption;
    });

    const generateAssetDatatable = computed(() => {
      let accountAssets = [];
      if(filterAssets.value){
        let account = walletState.currentLoggedInWallet.accounts.find(account => account.address == filterAssets.value)
        if(!account){
          account = walletState.currentLoggedInWallet.others.find(account => account.address == filterAssets.value)
        }
        account.assets.filter(asset => asset.owner === account.publicKey).forEach(asset => {
          accountAssets.push({asset, account});
        });
      }else{
        walletState.currentLoggedInWallet.accounts.forEach(account => {
          account.assets.filter(asset => asset.owner === account.publicKey).forEach(asset => {
            accountAssets.push({asset, account});
          });
        });
        walletState.currentLoggedInWallet.others.forEach(other => {
          other.assets.filter(asset => asset.owner === other.publicKey).forEach(asset => {
            accountAssets.push({asset, account:other});
          });
        });
      }

      let formattedAssets = [];

      for(let i=0; i < accountAssets.length; ++i){
        let namespaceAlias = [];
        let assetId = accountAssets[i].asset.idHex;

        if(assetId != AppState.nativeToken.assetId){
          let namespaces = accountAssets[i].account.findNamespaceNameByAsset(assetId);
          for(let j = 0; j < namespaces.length; ++j){
            let aliasData = {
              name: namespaces[j].name
            };

            namespaceAlias.push(aliasData);
          }

          let data = {
            i: i,
            idHex: assetId,
            owner: accountAssets[i].asset.owner,
            address: PublicAccount.createFromPublicKey(accountAssets[i].asset.owner, AppState.networkType).address.pretty(),
            amount: Helper.toCurrencyFormat(accountAssets[i].asset.getExactAmount(), accountAssets[i].asset.divisibility),
            supply: Helper.toCurrencyFormat(accountAssets[i].asset.getExactSupply(), accountAssets[i].asset.divisibility),
            linkedNamespace: namespaceAlias,
            height: accountAssets[i].asset.height,
            explorerLink: networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.assetInfoRoute + '/' + assetId
          };
          formattedAssets.push(data);
          // isMenuShow.value[i] = false;
          // isNsListShow.value[i] = false;
        }
      }
      return formattedAssets;
    });

    const filterAssets = ref('');

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

    const getNameByAddress = address =>{
      if(walletState.currentLoggedInWallet){
        let foundAcc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==address) || walletState.currentLoggedInWallet.others.find(acc=>acc.address==address)
        if(foundAcc){
          return foundAcc.name
        }else{
          return ''
        }
      }else{
        return ''
      }
    }

    const walletName = computed(()=>{
      if(walletState.currentLoggedInWallet){
        return walletState.currentLoggedInWallet.name
      }else{
        return ''
      }
    })

    return {
      borderColor,
      showMenu,
      showNsList,
      isMenuShow,
      isNsListShow,
      hoverOverMenu,
      hoverOutMenu,
      hoverOverNsList,
      hoverOutNsList,
      listAccounts,
      filterAssets,
      walletState,
      generateAssetDatatable,
      selectedAddress,
      wideScreen,
      getNameByAddress,
      walletName
    }
  }
}
</script>

<style lang="scss" scoped>

.p-datatable table{
  min-width: 100%;
}
.p-datatable-tbody{
  td{
    font-size: 11px;
    padding-left: 10px;
    padding-right: 10px;
    display: block;
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