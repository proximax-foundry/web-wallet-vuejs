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
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">RECEIPIENT</div>
            <div class="uppercase font-bold text-txs" v-if="data.recipient!=null">
              <div v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()">{{ data.recipientNamespaceName?data.rrecipientNamespaceName:data.recipient }}</div>
            </div>
            <div v-else>-</div>
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
      <Column field="signer" header="SENDER" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <span v-tooltip.bottom="Helper.createAddress(data.signerAddress).pretty()" class="truncate inline-block text-txs">
            <a :href="getPublicKeyExplorerUrl(data.signer)" target="_blank">
              {{ data.signerAddress }}
            </a>
          </span>
        </template>
      </Column>
      <Column field="recipient" header="RECIPIENT" headerStyle="width:110px" v-if="wideScreen">
        <template #body="{data}">
          <div v-if="data.recipient!=null">
            <span class="truncate inline-block text-txs" v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()">{{ data.recipientNamespaceName?data.rrecipientNamespaceName:data.recipient }}</span>
          </div>
          <span v-else>-</span>
        </template>
      </Column>
      <Column field="sign" header="" headerStyle="width:110px">
        <template #body="{data}">
          <router-link :to="{ name: 'ViewTransactionSign', params: {txnHash: data.hash}}" v-if="data.signerAddress != currentAddress" class="bg-orange-action text-white font-bold text-xxs text-center p-3 flex items-center justify-center"><img src="@/modules/transaction/img/icon-sign-own.svg" class="mr-2">Waiting for Your Signature(s)</router-link>
          <div v-else class="bg-orange-light text-orange-action font-bold text-xxs text-center p-3 flex items-center justify-center"><img src="@/modules/transaction/img/icon-sign.svg" class="mr-2">Waiting for Signature(s)</div>
        </template>
      </Column>
      <template #empty>
        {{$t('services.norecord')}}
      </template>
    </DataTable>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, onMounted, onUnmounted } from "vue";
import DataTable from 'primevue/datatable';
import Tooltip from 'primevue/tooltip';
import Column from 'primevue/column';
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
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

    /*const transactions = [
      {
        hash: "04836EC9CFAF9423E60122E7CB39AE8C171B16604CDE86DEA4CA9B80658E12E3",
        extractedData: {
          recipient: "VAOYQCVXM2ENSIA4JIV6DF4UBNOLQDJTSCMTKJEB",
          recipientName: "acc4",
          recipientType: "address",
        },
        signer: '60122E74CDE86DEA71B166CB39AE8C13E0658E12E34CA9B80CFAF94204836EC9',
        signerDisplay: 'ABC123',
        signerAddress: "VXM2ENBNOLQDJTSCMTKJEBSIA4JIV6DF4UVAOYQC",
        signerAddressPretty: "VXM2EN-BNOLQD-JTSCMT-KJEB-SIA4JI-V6DF4U-VAOYQC",
        formattedDeadline: "12/1/2021, 19:00:18",
        sign: true
      },
      {
        hash: "CFAF94204836EC9CB39AE8C13E60122E74CDE86DEA71B1660658E12E34CA9B80",
        extractedData: {
          recipient: "VAOYQCVXM2ENSIA4JIV6DF4UBNOLQDJTSCMTKJEB",
          recipientName: "acc2",
          recipientType: "address",
        },
        signer: 'CFAF94204836EC9CB39AE8C13E60122E74CDE86DEA71B1660658E12E34CA9B80',
        signerDisplay: 'nameABC',
        signerAddress: "VAOYQCVXM2ENSIA4JIV6DF4UBNOLQDJTSCMTKJEB",
        signerAddressPretty: "VAOYQC-VXM2EN-SIA4JI-V6DF4U-BNOLQD-JTSCMT-KJEB",
        formattedDeadline: "12/1/2021, 19:00:18",
        sign: false
      }
    ];*/

    const formatTime = (timestamp) => {
      return Helper.formatDeadline(timestamp);
    }

    const transactions = ref([]);
    const currentAddress = ref('');

    let currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount() ? walletState.currentLoggedInWallet.selectDefaultAccount() : walletState.currentLoggedInWallet.accounts[0];
    currentAddress.value = currentAccount.address;
    let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);

    let transactionGroupType = Helper.getTransactionGroupType();

    let dashboardService = new DashboardService(walletState.currentLoggedInWallet, currentAccount);

    let loadUnconfirmedTransactions = async() => {
      let txnQueryParams = Helper.createTransactionQueryParams();
      txnQueryParams.pageSize = 1;
      txnQueryParams.address = currentAccount.address;
      txnQueryParams.embedded = true;
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);

      let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.PARTIAL, txnQueryParams);
      let formattedTxns = await dashboardService.formatPartialMixedTxns(transactionSearchResult.transactions);
      transactions.value = formattedTxns;
    };

    loadUnconfirmedTransactions();

    emitter.on("TXN_UNCONFIRMED", (num) => {
      if(num> 0){
        loadUnconfirmedTransactions();
      }
    });

    emitter.on("TXN_CONFIRMED", (num) => {
      if(num> 0){
        loadUnconfirmedTransactions();
      }
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