<template>
  <div>
    <div class="pt-5 lg:pt-10 text-left px-2 sm:px-10 bg-gray-200">
      <div class="transition-all flex items-end">
        <div class="text-xs inline-block px-3 rounded-t-sm py-3" :class="`${ displayBoard=='unconfirmed'?'bg-white text-gray-primary':'cursor-pointer' }`" @click="displayBoard='unconfirmed'">Unconfirmed Transactions</div>
        <div class="text-xs inline-block px-3 rounded-t-sm py-3" :class="`${ displayBoard=='partial'?'bg-white text-gray-primary':'cursor-pointer' }`" @click="displayBoard='partial'">Waiting for Signatures</div>
      </div>
    </div>
    <div class="bg-white px-2 sm:px-10 pt-12" v-if="displayBoard=='unconfirmed'">
      <div class="text-xxs font-bold uppercase">Unconfirmed Transactions of <b>{{ selectedAccount.name }}</b> <span class="font-normal">({{ accountUnconfirmedTxnsCount }})</span></div>
      <UnconfirmedTransactionDataTable />
    </div>
    <div class="bg-white px-2 sm:px-10 pt-12" v-else>
      <div class="text-xxs font-bold uppercase">Waiting for signatures of <b>{{selectedAccount.name}}</b> <span class="font-normal">({{ accountPartialTxnsCount }})</span></div>
      <PartialDashboardDataTable />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, getCurrentInstance, toRef, watch } from 'vue';
import UnconfirmedTransactionDataTable from '@/modules/transaction/components/UnconfirmedTransactionDataTable.vue';
import PartialDashboardDataTable from '@/modules/transaction/components/PartialDashboardDataTable.vue';
import { Helper } from '@/util/typeHelper';
// eslint-disable-next-line no-unused-vars
import { useToast } from "primevue/usetoast";
import { Wallet } from "@/models/wallet";
import { walletState } from '@/state/walletState';
import { ChainUtils } from '@/util/chainUtils';
import { networkState } from "@/state/networkState";
import { AccountAPI } from '@/models/REST/account';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { listenerState } from '@/state/listenerState';
import { WalletUtils } from '@/util/walletUtils';
import { DashboardService } from '@/modules/dashboard/service/dashboardService';
import {AppState} from '@/state/appState'

export default defineComponent({
  name: 'ViewTransactionStatus',
  components: {
    UnconfirmedTransactionDataTable,
    PartialDashboardDataTable,
  },
  props:{
    transactionType: String
  },

  setup(props){
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    let txnType;
    if(props.transactionType == 'partial'){
      txnType = 'partial'
    }else{
      txnType = 'unconfirmed'
    }
    const displayBoard = ref(txnType);

    watch(props, (n)=> {
      if(n.transactionType == 'partial'){
        txnType = 'partial'
      }else{
        txnType = 'unconfirmed'
      }
      displayBoard.value = txnType;
    });
    let currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount() ? walletState.currentLoggedInWallet.selectDefaultAccount() : walletState.currentLoggedInWallet.accounts[0];
    currentAccount.default = true;

    const selectedAccount = ref(currentAccount);

    let accountUnconfirmedTxnsCount = ref(0);
    let accountPartialTxnsCount = ref(0);

    let dashboardService = new DashboardService(walletState.currentLoggedInWallet, selectedAccount.value);

    let updateAccountTransactionCount = async()=>{
      let transactionsCount = await dashboardService.getAccountTransactionsCount(currentAccount);
      accountUnconfirmedTxnsCount.value = transactionsCount.unconfirmed;
      accountPartialTxnsCount.value = transactionsCount.partial;
    };

    const init = ()=>{
      updateAccountTransactionCount();
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
        updateAccountTransactionCount();
      }
    });

    emitter.on("TXN_CONFIRMED", (num) => {
      if(num> 0){
        updateAccountTransactionCount();
      }
    });

    emitter.on("ABT_ADDED", (num) => {
      if(num> 0){
        updateAccountTransactionCount();
      }
    });

    emitter.on('DEFAULT_ACCOUNT_SWITCHED', payload => {
      currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount();
      selectedAccount.value = currentAccount;
      updateAccountTransactionCount();
    });

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);

    let unconfirmedTransactions = ref([]);
    let partialTransactions = ref([]);

    const isShowConfirmed = ref(true);
    const isShowUnconfirmed = ref(false);
    const isShowPartial = ref(false);

    return {
      displayBoard,
      selectedAccount,
      unconfirmedTransactions,
      partialTransactions,
      isShowConfirmed,
      isShowUnconfirmed,
      isShowPartial,
      currentNativeTokenName,
      accountUnconfirmedTxnsCount,
      accountPartialTxnsCount,
    };
  }
});
</script>
<style lang="scss" scoped>

.address_div{
  top: 4px;
}

.p-dialog .p-dialog-header{
  padding: 1rem 1.25rem;
}

.p-dialog .p-dialog-header .p-dialog-title{
  font-size: 1rem;
}

#address{
  @extend .text-xs !optional;
}

.default-div{
  @apply text-gray-100;
  background: #33344A;
  background-position: right top;
  background-repeat: no-repeat;
  background-size: 250px;
  height: 184px;
}

.balance-div{
  height: 184px;
}

.transaction-div{
  height: 184px;
}


@media (min-width: 640px) {
  .address_div{
    top: 0px;
  }
}

@media (min-width: 1280px) {
  .address_div{
    top: 4px;
  }

  #address{
    @extend .text-sm !optional;
  }
}

.dashboard-link{
  position: relative; top: -4px;
}

</style>