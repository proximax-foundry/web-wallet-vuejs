<template>
  <div>
    <DataTable
      :value="transactions"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      >
      <Column style="width: 250px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">TX HASH</div>
            <div class="text-txs font-bold inline-block" v-tooltip.right="data.hash">{{data.hash.substring(0, 20) }}...</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Deadline</div>
            <div class="uppercase font-bold text-txs">{{ formatTime(data.deadline) }}</div>
          </div>
        </template>
      </Column>
      <Column style="width: 250px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">SENDER</div>
            <div class="uppercase font-bold text-txs" v-tooltip.bottom="Helper.createAddress(data.signerAddress).pretty()">
              <a :href="getPublicKeyExplorerUrl(data.signer)" target="_blank">{{ data.signerAddress.substring(0, 20) }}</a>
            </div>
          </div>
        </template>
      </Column>
      <Column field="hash" header="TX HASH" headerStyle="width:100px" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column field="formattedDeadline" header="Deadline" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">{{Helper.formatDeadline(data.deadline)}}</span>
        </template>
      </Column>
      <Column field="signer" header="INITIATOR" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <span v-tooltip.bottom="Helper.createAddress(data.signerAddress).pretty()" class="truncate inline-block text-txs">
            <a :href="getPublicKeyExplorerUrl(data.signer)" target="_blank">
              {{ data.signerAddress }}
            </a>
          </span>
        </template>
      </Column>
      <Column field="sign" header="" headerStyle="width:110px">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewTransactionSign', params: {txnHash: data.hash}}" class="bg-orange-action text-white font-bold text-xxs text-center p-3 flex items-center justify-center"><img src="@/modules/transaction/img/icon-sign-own.svg" class="mr-2">Waiting for signature(s)</router-link>
          <!--<router-link :to="{ name: 'ViewTransactionWaitingSign', params: {txnHash: data.hash}}" v-else class="bg-orange-light text-orange-action font-bold text-xxs text-center p-3 flex items-center justify-center"><img src="@/modules/transaction/img/icon-sign.svg" class="mr-2">Waiting for Signature(s)</router-link>-->
        </template>
      </Column>
      <template #empty>
        {{$t('services.norecord')}}
      </template>
    </DataTable>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, onMounted, onUnmounted, watch } from "vue";
import DataTable from 'primevue/datatable';
import Tooltip from 'primevue/tooltip';
import Column from 'primevue/column';
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { AppState } from '@/state/appState';
import { Helper } from "@/util/typeHelper";
import { DashboardService } from '@/modules/dashboard/service/dashboardService';

export default{
  components: {
    DataTable,
    Column
  },
  directives: {
    'tooltip': Tooltip
  },
  name: 'PartialDashboardDataTable',

  setup(){
    const wideScreen = ref(false);
    const screenResizeHandler = () => {
      if(window.innerWidth < 1024){
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
    const showTransactionModel = ref(false);
    const modalData = ref(null);

    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const publicKeyExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.publicKeyRoute);
    const getPublicKeyExplorerUrl = (publicKey) =>{
      return explorerBaseURL.value + publicKeyExplorerURL.value + "/" + publicKey
    }

    const formatTime = (timestamp) => {
      return Helper.formatDeadline(timestamp);
    }

    const transactions = ref([]);
    const currentAddress = ref('');

    let currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount() ? walletState.currentLoggedInWallet.selectDefaultAccount() : walletState.currentLoggedInWallet.accounts[0];
    currentAddress.value = currentAccount.address;
    
    let transactionGroupType = Helper.getTransactionGroupType();

    let loadPartialTransactions = async() => {
      let dashboardService = new DashboardService(walletState.currentLoggedInWallet, currentAccount);
      let txnQueryParams = Helper.createTransactionQueryParams();
      txnQueryParams.pageSize = 100;
      txnQueryParams.address = currentAccount.address;

      let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.PARTIAL, txnQueryParams);
      let formattedTxns = await dashboardService.formatPartialMixedTxns(transactionSearchResult.transactions);
      transactions.value = formattedTxns;
    };

    const checkIsSigned =(data)=>{

      let allCosignedPublicKey = data.cosignedPublickKey.concat([data.signer]);

      return allCosignedPublicKey.includes(currentAccount.publicKey);
    }

    const init = ()=>{
      loadPartialTransactions();
    }

    if(AppState.isReady){
      init();
    }
    else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
          init();
          readyWatcher();
        }     
      });
    }

    emitter.on("TXN_UNCONFIRMED", (num) => {
      if(num> 0){
        loadPartialTransactions();
      }
    });

    emitter.on("TXN_CONFIRMED", (num) => {
      if(num> 0){
        loadPartialTransactions();
      }
    });

    emitter.on('DEFAULT_ACCOUNT_SWITCHED', payload => {
      currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount();
      currentAddress.value = currentAccount.address;
      loadPartialTransactions();
    });

    return {
      wideScreen,
      transactions,
      modalData,
      showTransactionModel,
      getPublicKeyExplorerUrl,
      currentAddress,
      formatTime,
      Helper,
      checkIsSigned
    }
  },
}
</script>

<style lang="scss" scoped>
.p-datatable-tbody{
  td{
    font-size: 11px;
  }
}
</style>