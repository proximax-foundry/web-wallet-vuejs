<template>
  <div>
    <div class="text-right">
      <SelectInputPluginClean v-model="filterNamespaces" :options="listAccounts" :selectDefault="selectedAddress" class="w-60 mr-4 inline-block" />
    </div>
    <DataTable
      :value="generateDatatable"
      :paginator="true"
      :rows="20"
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
      <Column field="name" header="NAME" :style="{ width: '200px' }">
        <template #body="{data}">
          <span class="text-xs">{{data.name}}</span>
        </template>
      </Column>
      <Column field="namespaceId" header="NAMESPACE ID" :style="{ width: '180px' }">
        <template #body="{data}">
          <span class="text-xs uppercase">{{data.idHex}}</span>
        </template>
      </Column>
      <Column field="linkedId" header="LINKED ASSET / ADDRESS" :style="{ width: '250px' }">
        <template #body="{data}">
          <span class="uppercase text-xs" v-if="data.linkedId">{{ data.linkedId }}</span>
          <span class="text-xs" v-else>No linked asset</span>
        </template>
      </Column>
      <Column field="linkType" header="EXPIRES" :style="{ width: '150px' }">
        <template #body="{data}">
          <div class="data.expiryRelative text-xs" v-if="data.expiryRelative">in {{ data.expiryRelative }}</div>
          <div class="text-gray-300 text-xs" v-else>Fetching..</div>
        </template>
      </Column>
      <Column field="Active" header="EXPIRATION TIMESTAMP ESTIMATE" :style="{ width: '210px' }">
        <template #body="{data}">
          <span class="text-xs" :class="data.expiring?'text-yellow-600':'text-gray-700'">{{ data.expiry }}</span>
        </template>
      </Column>
      <Column field="Account" header="ACCOUNT" :style="{ width: '120px' }">
        <template #body="{data}">
          <div v-html="data.icon" class="inline-block" v-tooltip.bottom="'<tiptitle>WALLET ADDRESS</tiptitle><tiptext>' + data.address + '</tiptext>'"></div>
        </template>
      </Column>
      <Column style="width: 50px;">
        <template #body="{data}">
          <div class="text-txs text-center lg:mr-2" @mouseover="hoverOverMenu(data.i)" @mouseout="hoverOutMenu">
            <img src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block" @click="showMenu(data.i)">
            <div v-if="isMenuShow[data.i]" class="mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div role="none" class="my-2">
                <router-link :to="{ name: 'ViewServicesNamespaceExtend', params: { address: data.address, namespaceId: data.idHex } }"  class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Extend Duration</router-link>
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
import { getCurrentInstance, ref, computed, watch, onMounted, toRefs  } from "vue";
import { Address } from "tsjs-xpx-chain-sdk";
import SelectInputPluginClean from "@/components/SelectInputPluginClean.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { walletState } from "@/state/walletState";
import {Namespace} from '@/models/namespace';
import { listenerState } from '@/state/listenerState';
import { Helper } from '@/util/typeHelper';
import { networkState } from "@/state/networkState";
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";
import { WalletAccount } from '@/models/walletAccount';
import { toSvg } from "jdenticon";
import Tooltip from 'primevue/tooltip';
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';

export default{
  components: { DataTable, Column, SelectInputPluginClean },
  name: 'NamespaceDataTable',
  props: {
    currentBlockHeight: Number,
    account: WalletAccount,
    address: String,
  },
  directives: {
    'tooltip': Tooltip
  },

  setup(props, context){
    const rowLimit = 5;
    const { currentBlockHeight, address } = toRefs(props);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    // const accountNamespaces = ref();
    const isMenuShow = ref([]);

    const selectedAddress = ref('');
    if(props.address){
      selectedAddress.value = Address.createFromRawAddress(address.value).plain();
    }

    const listAccounts = computed(() => {
      let accountOption = [];
      accountOption.push(
        {value: '', label: 'Show all'},
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

    let chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
    chainConfig.init();
    let blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);

    // watch([currentBlockHeight], ([newBlockHeight]) => {
    //   accountNamespaces.value = generateDatatable(newBlockHeight);
    // });

    // onMounted(() => {
    //   accountNamespaces.value = generateDatatable(currentBlockHeight.value);
    // });

    const relativeTime = (day, hour, min) => {
      let current = new Date();
      let expiry = calculateExpiryDate(day, hour, min);
      let timeDiff = {
        years: expiry.getFullYear() - current.getFullYear(),
        months: expiry.getMonth() - current.getMonth(),
        days: expiry.getDate()  - current.getDate(),
        hours: expiry.getHours() - current.getHours(),
        mins: expiry.getMinutes() - current.getMinutes(),
      }

      if (timeDiff.mins < 0) {
        timeDiff.hours--;
        timeDiff.mins += 60;
      }
      if (timeDiff.hours < 0) {
        timeDiff.days--;
        timeDiff.hours += 24;
      }
      if (timeDiff.days < 0) {
        timeDiff.months--;
        // days = days left in current's month,
        //   plus days that have passed in expiry's month
        var copyCurrent = new Date(current.getTime());
        copyCurrent.setDate(32);
        timeDiff.days = 32-current.getDate()-copyCurrent.getDate()+expiry.getDate();
      }
      if (timeDiff.months < 0) {
        timeDiff.years--;
        timeDiff.months+=12;
      }
      if(timeDiff.years > 0){
        return timeDiff.years + ' year' + ((timeDiff.years>1)?'s':'');
      }else if(timeDiff.months > 0){
        return timeDiff.months + ' month' + ((timeDiff.months>1)?'s':'');
      }else if(timeDiff.days > 0){
        return timeDiff.days + ' day' + ((timeDiff.days>1)?'s':'');
      }else if(timeDiff.hours > 0){
        return timeDiff.hours + ' hour' + ((timeDiff.hours>1)?'s':'');
      }else{
        return timeDiff.mins + ' minute' + ((timeDiff.mins>1)?'s':'');
      }
    }

    const calculateExpiryDate = (day, hour, min) => {
      let current = new Date();
      current.setTime(current.getTime() + (day * 24 * 60 * 60 * 1000 ));
      current.setTime(current.getTime() + (hour * 60 * 60 * 1000));
      current.setTime(current.getTime() + (min * 60 * 1000));
      return current;
    }

    const generateDatatable = computed(() => {
      let namespaces = [];

      if(filterNamespaces.value){
        let account = walletState.currentLoggedInWallet.accounts.find(account => account.address == filterNamespaces.value)
        if(!account){
          account = walletState.currentLoggedInWallet.others.find(account => account.address == filterNamespaces.value)
        }
        account.namespaces.forEach(namespace => {
          namespaces.push({namespace, account });
        });
      }else{
        walletState.currentLoggedInWallet.accounts.forEach(account => {
          account.namespaces.forEach(namespace => {
            namespaces.push({namespace, account });
          });
        });
        walletState.currentLoggedInWallet.others.forEach(other => {
          other.namespaces.forEach(namespace => {
            namespaces.push({namespace, account: other });
          });
        });
      }

      let formattedNamespaces = [];

      let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
      themeConfig.init();

      for(let i=0; i < namespaces.length; ++i){
        let linkName = "";

        switch (namespaces[i].namespace.linkType) {
          case 1:
            linkName = "Asset";
            break;
          case 2:
            linkName = "Address";
            break;
          default:
            break;
        }

        let blockDifference = namespaces[i].namespace.endHeight - currentBlockHeight.value;
        let blockTargetTimeByDay = Math.floor((60 * 60 * 24) / blockTargetTime);
        let blockTargetTimeByHour = Math.floor((60 * 60) / blockTargetTime);
        let expiryDay = Math.floor(blockDifference / blockTargetTimeByDay);
        let expiryHour = Math.floor((blockDifference % blockTargetTimeByDay ) / blockTargetTimeByHour);
        let expiryMin = (blockDifference % blockTargetTimeByDay ) % blockTargetTimeByHour;
        let expiryDate = Helper.convertDisplayDateTimeFormat24(calculateExpiryDate(expiryDay, expiryHour, expiryMin));
        let data = {
          i: i,
          idHex: namespaces[i].namespace.idHex,
          name: namespaces[i].namespace.name,
          linkType: linkName,
          linkedId: linkName === "Address" ? Helper.createAddress(namespaces[i].namespace.linkedId).pretty() : namespaces[i].namespace.linkedId,
          endHeight: namespaces[i].namespace.endHeight,
          expiring: (blockDifference < (blockTargetTimeByDay * 14)),
          expiryRelative: currentBlockHeight.value?relativeTime(expiryDay, expiryHour, expiryMin):'',
          expiry: currentBlockHeight.value?expiryDate:'',
          explorerLink: networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute + '/' + namespaces[i].namespace.idHex,
          address: Helper.createAddress(namespaces[i].account.address).pretty(),
          icon: toSvg(namespaces[i].account.address, 30, themeConfig.jdenticonConfig)
        };
        formattedNamespaces.push(data);
        // isMenuShow.value[i] = false;
      }
      return formattedNamespaces;
    });

    const filterNamespaces = ref('');

    // if(filterNamespaces.value == ''){
    //   accountNamespaces.value = generateDatatable(currentBlockHeight.value);
    // }else{
    //   accountNamespaces.value = generateDatatable(currentBlockHeight.value);
    // }

    // watch(filterNamespaces, (n) => {
    //   if(n == ''){
    //     accountNamespaces.value = generateDatatable(currentBlockHeight.value);
    //   }else{
    //     accountNamespaces.value = generateDatatable(currentBlockHeight.value);
    //   }
    // });

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

    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const publicKeyExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.publicKeyRoute);
    const addressExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.addressRoute);
    const namespaceExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute);
    const assetExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.assetInfoRoute);

    return {
      addressExplorerURL,
      assetExplorerURL,
      namespaceExplorerURL,
      publicKeyExplorerURL,
      explorerBaseURL,
      showMenu,
      isMenuShow,
      hoverOverMenu,
      hoverOutMenu,
      listAccounts,
      filterNamespaces,
      generateDatatable,
      selectedAddress,
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