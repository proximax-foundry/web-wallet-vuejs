<template>
  <div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="address" class="mb-6" />
      <AccountTabs :address="address" selected="txn" />
      <div class="flex my-2 gap-5 flex-none text-xs md:text-sm">
        <router-link
          :to="{
            name: 'ViewAccountConfirmedTransactions',
            params: { address: address },
          }"
          class="border opacity-60 hover:opacity-100 cursor-pointer rounded-md text-white py-2 px-4"
          style="background: #007cff"
          >Confirmed</router-link
        >
        <div
          class="border rounded-md text-white py-2 px-5"
          style="background: #f3a91d"
        >
          Pending
        </div>
        <router-link
          :to="{
            name: 'ViewAccountFailedTransactions',
            params: { address: address },
          }"
          class="border opacity-60 hover:opacity-100 cursor-pointer rounded-md text-white py-2 px-5"
          style="background: #dc143c"
          >Failed</router-link
        >
      </div>

      <PendingDataTable :transaction="transactions" class="mt-3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import PendingDataTable from "@/modules/account/components/PendingDataTable.vue";
import { DashboardService } from "@/modules/dashboard/service/dashboardService";
import { listenerState } from "@/state/listenerState";
import { walletState } from "@/state/walletState";
import { Helper } from "@/util/typeHelper";
import { TransactionMapping } from "tsjs-xpx-chain-sdk";
import { computed, ref, watch } from "vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { TransactionUtils } from "@/util/transactionUtils";

const props = defineProps({
  address: String,
});

let blockDescOrderSortingField = Helper.createTransactionFieldOrder(
  Helper.getQueryParamOrder_v2().DESC,
  Helper.getTransactionSortField().BLOCK
);
const acc = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return null;
  }
  let acc =
    walletState.currentLoggedInWallet.accounts.find(
      (add) => add.address == props.address
    ) ||
    walletState.currentLoggedInWallet.others.find(
      (add) => add.address == props.address
    );
  if (!acc) {
    return null;
  }
  return acc;
});
const unconfirmedTxns = ref([]);
const partialTxns = ref([]);
const inQueueTxns = ref([]);
const transactions = computed(() => {
  return unconfirmedTxns.value
    .concat(inQueueTxns.value)
    .concat(partialTxns.value);
});

let dashboardService = new DashboardService(
  walletState.currentLoggedInWallet,
  acc.value
);
let transactionGroupType = Helper.getTransactionGroupType();
let loadUnconfirmedTransactions = async () => {
  if (!acc.value) {
    return;
  }
  let txnQueryParams = Helper.createTransactionQueryParams();
  txnQueryParams.pageSize = 1;
  txnQueryParams.address = acc.value.address;
  txnQueryParams.embedded = true;
  txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
  let transactionSearchResult = await dashboardService.searchTxns(
    transactionGroupType.UNCONFIRMED,
    txnQueryParams
  );
  let formattedTxns = await dashboardService.formatUnconfirmedMixedTxns(
    transactionSearchResult.transactions
  );
  //groupType = 'unconfirmed'
  unconfirmedTxns.value = formattedTxns;
};

let loadPartialTransactions = async () => {
  if (!acc.value) {
    return;
  }
  let dashboardService = new DashboardService(
    walletState.currentLoggedInWallet,
    acc.value
  );
  let txnQueryParams = Helper.createTransactionQueryParams();
  txnQueryParams.pageSize = 100;
  txnQueryParams.address = acc.value.address;
  let transactionSearchResult = await dashboardService.searchTxns(
    transactionGroupType.PARTIAL,
    txnQueryParams
  );
  let formattedTxns = await dashboardService.formatPartialMixedTxns(
    transactionSearchResult.transactions
  );
  //groupType = 'partial'
  partialTxns.value = formattedTxns;
};

let loadInQueueTransactions = () => {
  if (!acc.value) {
    return;
  }
  let txns = [];
  listenerState.autoAnnounceSignedTransaction.forEach((tx) => {
    let txn = TransactionMapping.createFromPayload(
      tx.signedTransaction.payload
    );
    let aggregateTxn = TransactionUtils.castToAggregate(txn);
    if (
      aggregateTxn.innerTransactions.find(
        (tx) => tx.signer.address.plain() == props.address
      ) != undefined ||
      tx.signedTransaction.signer == acc.value.publicKey
    ) {
      txns.push({
        type: "Aggregate Bonded",
        hash: tx.signedTransaction.hash,
        deadline: txn.deadline.value,
        groupType: "In Queue",
        recipient: "",
        sender: "",
        amount: "",
        message: "",
        sda: "",
      });
    }
  });
  inQueueTxns.value = txns;
};
watch(
  [
     listenerState.unconfirmedTransactions,
   listenerState.autoAnnounceSignedTransaction,
   ()=>listenerState.aggregateBondedTxLength,
   listenerState.confirmedTransactions
  ],
  async ()=> {
      await loadUnconfirmedTransactions();
      await loadPartialTransactions();
      await loadUnconfirmedTransactions();
      loadInQueueTransactions();

  },{immediate:true,deep:true}
);

</script>
