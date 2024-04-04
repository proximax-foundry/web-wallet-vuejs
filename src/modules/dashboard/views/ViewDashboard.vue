<template>
  <div>
    <div class="px-2 sm:px-10 bg-gray-200 pb-4 pt-5">
      <div class="max-w-screen-sm m-auto">
        <div
          class="shadow-md w-full overflow-x-hidden address_div px-7 py-3 rounded flex flex-col bg-white text-black"
        >
          <div class="text-center py-3">
            <div class="text-center my-2">
              <div class="inline-block">
                <span class="font-bold text-xl">{{
                  selectedAccountBalanceFront
                }}</span
                >{{ selectedAccountBalanceBack ? "." : ""
                }}<span class="text-md">{{ selectedAccountBalanceBack }}</span>
                <span class="font-bold text-xl">{{
                  currentNativeTokenName
                }}</span>
              </div>
              <img
                src="@/modules/dashboard/img/icon-xpx.svg"
                class="inline-block w-6 h-6 ml-3 mb-2"
              />
            </div>
            <router-link
              :to="'/details-account/' + selectedAccountAddressPlain"
              class="inline-block text-xs font-bold text-blue-primary cursor-pointer"
              >{{ selectedAccountName
              }}<img
                src="@/modules/dashboard/img/icon-blue-chevron-right.svg"
                class="inline-block w-5 h-5 ml-1 mb-0.5"
            /></router-link>
            <div class="mb-8">
              <div class="flex items-center justify-center">
                <div
                  id="address"
                  class="inline-block font-bold outline-none break-all text-xs lg:text-tsm"
                  :copyValue="selectedAccountAddressPlain"
                  :copySubject="$t('general.address')"
                >
                  {{ selectedAccountAddressShort }}
                </div>

                <img
                  src="@/modules/dashboard/img/icon-copy.svg"
                  class="w-4 cursor-pointer ml-4 inline-block"
                  @click="copy('address')"
                />
                <AddressQRModal
                  :accountAddressQR="addressQR"
                  :notIncludeWord="true"
                />
              </div>
            </div>
            <div>
              <a
                :href="faucetLink"
                target="_new"
                class="inline-block text-center mr-2"
                v-if="faucetLink"
              >
                <div class="inline-block rounded-full bg-blue-primary w-8 h-8">
                  <div class="h-full w-full flex items-center justify-center">
                    <img
                      src="@/modules/dashboard/img/icon-balance-white.svg"
                      class="w-5 h-5"
                    />
                  </div>
                </div>
                <br />
                <div class="text-xxs text-gray-400 inline-block uppercase">
                  {{ $t("general.topUp") }}
                </div>
              </a>
              <router-link
                :to="{ name: 'ViewTransferCreate' }"
                class="inline-block text-center mx-2"
              >
                <div class="inline-block rounded-full bg-blue-primary w-8 h-8">
                  <div class="h-full w-full flex items-center justify-center">
                    <img
                      src="@/modules/dashboard/img/icon-transfer-white.svg"
                      class="w-5 h-5"
                    />
                  </div>
                </div>
                <br />
                <div class="text-xxs text-gray-400 inline-block uppercase">
                  {{ $t("general.transfer") }}
                </div>
              </router-link>
              <!-- <router-link :to="{ name: 'ViewServicesStackingBuy'}" class="inline-block text-center mx-2.5" v-if="isPublicNetwork">
                <div class="inline-block rounded-full bg-blue-primary w-8 h-8">
                  <div class="flex items-center justify-center h-full w-full">
                    <font-awesome-icon icon="shopping-bag" class="h-5 w-5 text-white" />
                  </div>
                </div><br>
                <div class="text-xxs text-gray-400 inline-block uppercase">{{$t('general.buy')}}</div>
              </router-link> -->
              <router-link
                :to="{ name: 'ViewServicesMainnetSwap' }"
                class="inline-block text-center mx-3"
                v-if="isPublicNetwork"
              >
                <div class="inline-block rounded-full bg-blue-primary w-8 h-8">
                  <div class="h-full w-full flex items-center justify-center">
                    <img
                      src="@/modules/dashboard/img/icon-swap-white.svg"
                      class="w-5 h-5"
                    />
                  </div>
                </div>
                <br />
                <div class="text-xxs text-gray-400 inline-block uppercase">
                  {{ $t("general.swap") }}
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-left px-2 sm:px-10 bg-gray-200">
      <div class="transition-all flex items-end">
        <div
          class="text-xs inline-block px-3 rounded-t-sm py-3"
          :class="`${
            displayBoard == 'asset'
              ? 'bg-white text-gray-primary'
              : 'cursor-pointer'
          }`"
          @click="displayBoard = 'asset'"
        >
          {{ $t("general.asset", 2) }}
        </div>
        <div
          class="text-xs inline-block px-3 rounded-t-sm py-3"
          :class="`${
            displayBoard == 'overview'
              ? 'bg-white text-gray-primary'
              : 'cursor-pointer'
          }`"
          @click="displayBoard = 'overview'"
        >
          Activities
        </div>
      </div>
    </div>
    <div class="bg-white px-2 sm:px-10" v-if="displayBoard == 'overview'">
      <div class="text-txs text-gray-400 mt-10 mb-2">
        <b class="text-gray-700 uppercase">Pending Transactions</b>
      </div>
      <PendingDataTable :transaction="pendingTransactions" />
      <div class="text-txs text-gray-400 mt-10 mb-2">
        <b class="text-gray-700 uppercase">{{
          $t("dashboard.recentTransactions")
        }}</b>
      </div>
      <MixedTxnDataTable
        :selectedGroupType="transactionGroupType.CONFIRMED"
        :transactions="recentTransactions"
        @openDecryptMsg="openDecryptMsgModal"
      ></MixedTxnDataTable>
      <a
        :href="linkToExplorer()"
        target="_blank"
        v-if="searchedTransactions.length == 10"
        ><div class="text-right text-xs text-blue-primary mt-3">
          View more...
        </div></a
      >
    </div>
    <div
      class="bg-white px-2 sm:px-10 pt-12"
      v-else-if="displayBoard == 'asset'"
    >
      <DashboardAssetDataTable :assets="accountAssets" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PendingDataTable from "@/modules/account/components/PendingDataTable.vue";
import { computed,  ref, getCurrentInstance, watch } from "vue";
import {
  TransactionFilterTypes,
} from "@/modules/dashboard/model/transactions/transaction";
import MixedTxnDataTable from "@/modules/dashboard/components/TransactionDataTable/MixedTxnDataTable.vue";
import DashboardAssetDataTable from "@/modules/dashboard/components/DashboardAssetDataTable.vue";
import AddressQRModal from "@/modules/dashboard/components/AddressQRModal.vue";
import { copyToClipboard } from "@/util/functions";
import { Helper } from "@/util/typeHelper";
import { useToast } from "primevue/usetoast";
import { walletState } from "@/state/walletState";
import { ChainUtils } from "@/util/chainUtils";
import { networkState } from "@/state/networkState";
import { DashboardService } from "@/modules/dashboard/service/dashboardService";
import qrcode from "qrcode-generator";
import { listenerState } from "@/state/listenerState";
import { WalletUtils } from "@/util/walletUtils";
import { AppState } from "@/state/appState";
import { useI18n } from "vue-i18n";
import {  NetworkType, TransactionMapping } from "tsjs-xpx-chain-sdk";
import { TransactionUtils } from "@/util/transactionUtils";


const { t } = useI18n();
const toast = useToast();
const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
const displayBoard = ref("asset");
const showAddressQRModal = ref(false);
const showMessageModal = ref(false);
const showDecryptMessageModal = ref(false);
const showCosignModal = ref(false);
const messagePayload = ref("");
const publicKeyToUse = ref("");

const manualPublicKey = ref(false);
const initialSignerPublicKey = ref("");
const isInitialSender = ref(false);
const decryptMessageKey = ref(0);

const isPublicNetwork = computed(() => {
  return (
    AppState.networkType == NetworkType.TEST_NET ||
    AppState.networkType == NetworkType.MAIN_NET
  );
});

const openDecryptMsgModal = async (data) => {
  let txType = data.txType;
  let recipient = data.recipient;
  let recipientType = data.recipientType;
  let autoRecipientPublicKey = false;
  isInitialSender.value = false;
  let txSender = data.sender;
  initialSignerPublicKey.value = data.initialSigner;
  messagePayload.value = data.message;
  publicKeyToUse.value = "";
  manualPublicKey.value = false;
  //recipientAddress.value = data.recipient;
  if (txType === "Transfer" || txType === "Aggregate Complete") {
    autoRecipientPublicKey = true;
    let senderAccount = WalletUtils.findWalletAccountByPublicKey(
      walletState.currentLoggedInWallet,
      txSender
    );
    if (senderAccount) {
      isInitialSender.value = true;
    }
  } else {
    let senderAccount = WalletUtils.findWalletAccountByPublicKey(
      walletState.currentLoggedInWallet,
      initialSignerPublicKey.value
    );
    if (senderAccount) {
      isInitialSender.value = true;
    }
  }
  if (recipientType === "address") {
    let accountPublicKey = WalletUtils.findAccountPublicKeyByAddress(
      walletState.currentLoggedInWallet,
      recipient
    );
    if (accountPublicKey) {
      publicKeyToUse.value = accountPublicKey;
    } else {
      let accountInfo = await ChainUtils.getAccountInfo(
        Helper.createAddress(recipient)
      );
      if (accountInfo.publicKey === "0".repeat(64)) {
        manualPublicKey.value = true;
      } else {
        publicKeyToUse.value = accountInfo.publicKey;
      }
    }
  } else {
    let address = await ChainUtils.getNamespaceLinkedAddress(recipient);
    if (address) {
      let accountPublicKey = WalletUtils.findAccountPublicKeyByAddress(
        walletState.currentLoggedInWallet,
        recipient
      );
      if (accountPublicKey) {
        publicKeyToUse.value = accountPublicKey;
      } else {
        let accountInfo = await ChainUtils.getAccountInfo(address);
        if (accountInfo.publicKey === "0".repeat(64)) {
          manualPublicKey.value = true;
        } else {
          publicKeyToUse.value = accountInfo.publicKey;
        }
      }
    } else {
      manualPublicKey.value = true;
    }
  }
  if (!autoRecipientPublicKey) {
    manualPublicKey.value = true;
  }
  decryptMessageKey.value++;
  showDecryptMessageModal.value = true;
};


const currentNativeTokenName = computed(() => AppState.nativeToken.label);
const currentNativeTokenDivisibility = computed(
  () => AppState.nativeToken.divisibility
);
const displyFaucet = computed(() => {
  return AppState.networkType == NetworkType.TEST_NET ? true : false;
});
const faucetLink = computed(() => {
  if (displyFaucet.value) {
    if (networkState.chainNetworkName == "Sirius Testnet 1") {
      return "https://bctestnetfaucet.xpxsirius.io/#/";
    } else if (networkState.chainNetworkName == "Sirius Testnet 2") {
      return "https://bctestnet2faucet.xpxsirius.io/#/";
    } else {
      return false;
    }
  } else {
    if (AppState.networkType == NetworkType.MAIN_NET) {
      return "https://www.proximax.io/en/xpx";
    } else {
      return false;
    }
  }
});

let selectedAccount = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return null;
  } else if (!walletState.currentLoggedInWallet.selectDefaultAccount()) {
    return walletState.currentLoggedInWallet.accounts[0];
  }
  return walletState.currentLoggedInWallet.selectDefaultAccount();
});
const accountAssets = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return [];
  }
  let defaultAccAsset = selectedAccount.value.assets;
  let filteredAsset = defaultAccAsset.filter((asset) => asset.rawAmount != 0);
  return filteredAsset;
});


const selectedAccountAddress = computed(() => {
  if (selectedAccount.value) {
    return Helper.createAddress(selectedAccount.value.address).pretty();
  } else {
    return null;
  }
});
const selectedAccountAddressPlain = computed(() =>
  selectedAccount.value ? selectedAccount.value.address : null
);
const selectedAccountAddressShort = computed(() => {
  if (selectedAccount.value) {
    let prettyAddress = Helper.createAddress(
      selectedAccount.value.address
    ).pretty();
    let firstPartAddress = prettyAddress.substring(0, 11);
    let secondPartAddress = prettyAddress.substring(prettyAddress.length - 11);
    return firstPartAddress + "..." + secondPartAddress;
  } else {
    return null;
  }
});


const selectedAccountBalance = computed(() => {
  if (!selectedAccount.value) {
    return null;
  } else {
    return Helper.toCurrencyFormat(
      selectedAccount.value ? selectedAccount.value.balance : 0,
      currentNativeTokenDivisibility.value
    );
  }
});
const selectedAccountBalanceFront = computed(() => {
  if (selectedAccountBalance.value) {
    let balance = selectedAccountBalance.value.split(".");
    return balance[0];
  } else {
    return null;
  }
});
const selectedAccountBalanceBack = computed(() => {
  if (selectedAccountBalance.value) {
    let balance = selectedAccountBalance.value.split(".");
    return balance[1];
  } else {
    return null;
  }
});
const selectedAccountName = computed(() => {
  if (selectedAccount.value) {
    return selectedAccount.value.name;
  } else {
    return null;
  }
});
const addressQR = computed(() => {
  if (selectedAccountAddress.value) {
    let qr = qrcode(15, "H");
    qr.addData(selectedAccountAddress.value);
    qr.make();
    return qr.createDataURL();
  } else {
    return null;
  }
});
let dashboardService = new DashboardService(
  walletState.currentLoggedInWallet,
  selectedAccount.value
);
let accountConfirmedTxnsCount = ref(0);
let updateAccountTransactionCount = async () => {
  let transactionsCount = await dashboardService.getAccountTransactionsCount(
    selectedAccount.value
  );
  accountConfirmedTxnsCount.value = transactionsCount.confirmed;
};
const copy = (id) => {
  let stringToCopy = document.getElementById(id).getAttribute("copyValue");
  let copySubject = document.getElementById(id).getAttribute("copySubject");
  copyToClipboard(stringToCopy);

  toast.add({
    severity: "info",
    detail: copySubject + " " + t("general.copied"),
    group: "br-custom",
    life: 3000,
  });
};
// setup transaction loading
const recentTransactions = ref([]);
const searchedTransactions = ref([]);
const recentTransferTransactions = ref([]);
let allTxnQueryParams = Helper.createTransactionQueryParams();
let transactionGroupType = Helper.getTransactionGroupType();

let blockDescOrderSortingField = Helper.createTransactionFieldOrder(
  Helper.getQueryParamOrder_v2().DESC,
  Helper.getTransactionSortField().BLOCK
);
allTxnQueryParams.updateFieldOrder(blockDescOrderSortingField);
allTxnQueryParams.embedded = true;
let loadRecentTransactions = async () => {
  let txnQueryParams = Helper.createTransactionQueryParams();
  txnQueryParams.pageSize = 1;
  txnQueryParams.publicKey = selectedAccount.value.publicKey;
  txnQueryParams.embedded = true;
  txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
  let transactionSearchResult = await dashboardService.searchTxns(
    transactionGroupType.CONFIRMED,
    txnQueryParams
  );
  let formattedTxns = await dashboardService.formatConfirmedMixedTxns(
    transactionSearchResult.transactions
  );
  recentTransactions.value = formattedTxns.slice(0, 5);
  searchedTransactions.value = formattedTxns;
};
let loadRecentTransferTransactions = async () => {
  let txnQueryParams = Helper.createTransactionQueryParams();
  txnQueryParams.pageSize = 20;
  txnQueryParams.type = TransactionFilterTypes.getTransferTypes();
  txnQueryParams.publicKey = selectedAccount.value.publicKey;
  txnQueryParams.embedded = true;
  txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
  let transactionSearchResult = await dashboardService.searchTxns(
    transactionGroupType.CONFIRMED,
    txnQueryParams
  );
  if (transactionSearchResult.transactions.length) {
    let formattedTxns = await dashboardService.formatConfirmedMixedTxns(
      transactionSearchResult.transactions
    );
    recentTransferTransactions.value = formattedTxns;
    recentTransferTxnRow.value = formatRecentTransfer(formattedTxns).slice(
      0,
      3
    );
  }
};



const recentTransferTxnRow = ref([]);

const formatRecentTransfer = (transactions) => {
  let transferTxn = [];
  let nativeTokenTxns = transactions.filter((txn) => txn.amountTransfer > 0);
  for (const txn of nativeTokenTxns) {
    let formattedTransferTxn ;
    if (
      selectedAccountAddressPlain.value == txn.sender &&
      selectedAccountAddressPlain.value == txn.recipient
    ) {
      continue;
    } else if (selectedAccountAddressPlain.value == txn.sender) {
      formattedTransferTxn.transferContact =
        walletState.currentLoggedInWallet.convertAddressToNamePretty(
          txn.recipient,
          true
        );
      formattedTransferTxn.transferContactAddress = txn.recipient;
      formattedTransferTxn.amount =
        "-" +
        Helper.toCurrencyFormat(
          txn.amountTransfer,
          AppState.nativeToken.divisibility
        );
    } else {
      formattedTransferTxn.transferContact = walletState.currentLoggedInWallet
        .convertAddressToNamePretty(txn.sender, true)
        .substring(0, 30);
      formattedTransferTxn.transferContactAddress = txn.sender;
      formattedTransferTxn.amount = Helper.toCurrencyFormat(
        txn.amountTransfer,
        AppState.nativeToken.divisibility
      );
    }

    if (formattedTransferTxn.transferContact.length > 20) {
      formattedTransferTxn.transferContact =
        formattedTransferTxn.transferContact.substring(0, 17) + "...";
    }
    formattedTransferTxn.hash = txn.hash;
    transferTxn.push(formattedTransferTxn);
  }
  return transferTxn;
};

emitter.on("CLOSE_MODAL", () => {
  showAddressQRModal.value = false;
  showMessageModal.value = false;
  showCosignModal.value = false;
  showDecryptMessageModal.value = false;
});

emitter.on("DEFAULT_ACCOUNT_SWITCHED", async (payload) => {
  // currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount();
  // currentAccount.default = true;
  // selectedAccount.value = currentAccount;
  // recentTransferTxn();
  updateAccountTransactionCount();
  loadRecentTransactions();
  loadRecentTransferTransactions();
  await loadUnconfirmedTransactions();
  await loadPartialTransactions();
  loadInQueueTransactions();
});

const unconfirmedTxns = ref([]);
const partialTxns = ref([]);
const inQueueTxns = ref([]);
const pendingTransactions = computed(() => {
  return unconfirmedTxns.value
    .concat(inQueueTxns.value)
    .concat(partialTxns.value);
});
let loadUnconfirmedTransactions = async () => {
  if (!selectedAccount.value) {
    return;
  }
  let txnQueryParams = Helper.createTransactionQueryParams();
  txnQueryParams.pageSize = 1;
  txnQueryParams.address = selectedAccountAddressPlain.value;
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
  if (!selectedAccount.value) {
    return;
  }
  let dashboardService = new DashboardService(
    walletState.currentLoggedInWallet,
    selectedAccount.value
  );
  let txnQueryParams = Helper.createTransactionQueryParams();
  txnQueryParams.pageSize = 100;
  txnQueryParams.address = selectedAccountAddressPlain.value;
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
  if (!selectedAccount.value) {
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
        (tx) => tx.signer.address.plain() == selectedAccount.value.address
      ) != undefined ||
      tx.signedTransaction.signer == selectedAccount.value.publicKey
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
const init = async () => {
  updateAccountTransactionCount();
  loadRecentTransactions();
  loadRecentTransferTransactions();
  await loadUnconfirmedTransactions();
  await loadPartialTransactions();
  loadInQueueTransactions();
};
if (AppState.isReady) {
  init();
} else {
  let readyWatcher = watch(AppState, (value) => {
    if (value.isReady) {
      init();
      readyWatcher();
    }
  });
}

const linkToExplorer = () => {
  if (!networkState.currentNetworkProfile) {
    return "";
  }
  return (
    networkState.currentNetworkProfile.chainExplorer.url +
    "/" +
    networkState.currentNetworkProfile.chainExplorer.addressRoute +
    "/" +
    selectedAccount.value.address
  );
};
</script>
<style lang="scss" scoped>
.address_div {
  top: 4px;
}
.p-dialog .p-dialog-header {
  padding: 1rem 1.25rem;
}
.p-dialog .p-dialog-header .p-dialog-title {
  font-size: 1rem;
}
#address {
  @extend .text-xs !optional;
}
.default-div {
  @apply text-gray-100;
  background: #33344a;
  background-position: right top;
  background-repeat: no-repeat;
  background-size: 250px;
  height: 184px;
}
.balance-div {
  height: 184px;
}
.transaction-div {
  height: 184px;
}
@media (min-width: 640px) {
  .address_div {
    top: 0px;
  }
}
@media (min-width: 1280px) {
  .address_div {
    top: 4px;
  }
  #address {
    @extend .text-sm !optional;
  }
}
.dashboard-link {
  position: relative;
  top: -4px;
}
</style>
