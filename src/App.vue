<template>
  <loading
    v-model:active="isLoading"
    :can-cancel="false"
    :is-full-page="true"
  />
  <ConfirmDialog></ConfirmDialog>
  <ToastComponent />
  <BaseLayout v-if="walletState.isLogin">
    <RouterView />
  </BaseLayout>
  <HomeLayoutVue v-else>
    <RouterView />
  </HomeLayoutVue>
</template>

<script setup lang="ts">
import Loading from "vue-loading-overlay";
import ConfirmDialog from "primevue/confirmdialog";
import "vue-loading-overlay/dist/css/index.css";
import { RouterView, useRouter } from "vue-router";
import { AppState } from "./state/appState";
import { computed, watch, ref } from "vue";
import { walletState } from "./state/walletState";
import BaseLayout from "./components/BaseLayout.vue";
import { WalletStateUtils } from "./state/utils/walletStateUtils";
import { AppStateUtils } from "./state/utils/appStateUtils";
import { ListenerStateUtils } from "./state/utils/listenerStateUtils";
import { networkState } from "./state/networkState";
import { WalletUtils } from "./util/walletUtils";
import { UnitConverter } from "./util/unitConverter";
import { TimeUnit } from "./models/const/timeUnit";
import { NotificationUtils } from "./util/notificationUtils";
import { TransactionGroupType } from "tsjs-xpx-chain-sdk";
import { AnnounceType, listenerState } from "./state/listenerState";
import type { ToastMessageOptions } from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import ding from "@/assets/audio/ding.ogg";
import HomeLayoutVue from "./components/HomeLayout.vue";
import ToastComponent from "./modules/transfer/components/ToastComponent.vue";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";

const isLoading = computed(() => !AppState.isReady);

const router = useRouter();

const { t } = useI18n();

const toast = useToast();

interface failedTxn {
  txnHash: string;
  accPubKey: string | string[];
  announced?: boolean;
  status: string;
  statusMsg: string;
  relatedAddress: string[];
  checkedNum: number;
}

const setFailedTxns = (failedTxn: failedTxn) => {
  const rawTxn = sessionStorage.getItem("allFailedTransactions");

  if (rawTxn) {
    let existingFailedTxns: failedTxn[] = JSON.parse(rawTxn);
    let findFailedTxnsHashAndPubKey = existingFailedTxns.find(
      (x) =>
        x.txnHash === failedTxn.txnHash && x.accPubKey === failedTxn.accPubKey
    );
    if (!findFailedTxnsHashAndPubKey) {
      existingFailedTxns.push(failedTxn);
      sessionStorage.setItem(
        "allFailedTransactions",
        JSON.stringify(existingFailedTxns)
      );
    }
  } else {
    sessionStorage.setItem(
      "allFailedTransactions",
      JSON.stringify([failedTxn])
    );
  }
};

const checkTxnStatus = async () => {
  if (!AppState.chainAPI) {
    return;
  }
  let endStatuses = ["failed", TransactionGroupType.CONFIRMED];
  let txnsHash1 = AppState.txnActivityLog
    .filter((x) => x.checkedNum < 10 && !endStatuses.includes(x.status))
    .map((x) => x.txnHash);
  let txnsHash2 = AppState.txnCosignLog
    .filter((x) => x.checkedNum < 10 && !endStatuses.includes(x.status))
    .map((x) => x.txnHash);
  let txnsHash3 = AppState.txnSwapLog
    .filter((x) => x.checkedNum < 10 && !endStatuses.includes(x.status))
    .map((x) => x.txnHash);
  let allTransasctionHash = txnsHash1.concat(txnsHash2, txnsHash3);

  if (allTransasctionHash.length === 0) {
    return;
  }

  let dataPerRequest = 50;

  let numOfRequest = Math.ceil(allTransasctionHash.length / dataPerRequest);

  let requests = [];

  for (let i = 0; i < numOfRequest; ++i) {
    let startIndex = i * dataPerRequest;
    let endIndex = (i + 1) * dataPerRequest;

    let requestData = allTransasctionHash.slice(startIndex, endIndex);

    try {
      requests.push(
        AppState.chainAPI.transactionAPI.getTransactionsStatuses(requestData)
      );
    } catch (error) {
      continue;
    }
  }

  let tempTransactionStatuses = await Promise.all(requests);

  let transactionStatuses = tempTransactionStatuses.flat();

  let txnsHashFound: string[] = [];
  let txnHashesConfirmed: string[] = [];
  let displayedTxn: string[] = [];

  for (let i = 0; i < transactionStatuses.length; ++i) {
    const transactionStatus = transactionStatuses[i];
    if (!transactionStatus.hash) {
      continue;
    }
    txnsHashFound.push(transactionStatus.hash);

    if (txnsHash1.includes(transactionStatus.hash)) {
      let txnActivity = AppState.txnActivityLog.find(
        (x) => x.txnHash === transactionStatus.hash
      );
      if (!txnActivity) {
        continue;
      }
      if (
        txnActivity.status !== transactionStatus.group &&
        transactionStatus.group
      ) {
        txnActivity.status = transactionStatus.group;

        if (txnActivity.status === "failed") {
          txnActivity.statusMsg = transactionStatus.status;
          setFailedTxns(txnActivity);
        } else if (txnActivity.status === TransactionGroupType.CONFIRMED) {
          txnHashesConfirmed.push(txnActivity.txnHash);
          listenerState.allConfirmedTransactionsHash.push(txnActivity.txnHash);
        }

        displayedTxn.push(transactionStatus.hash);
        addTxnToastMessage(
          txnActivity.status,
          transactionStatus.hash,
          txnActivity.statusMsg
        );
      }
    } else if (txnsHash2.includes(transactionStatus.hash)) {
      let txnCosign = AppState.txnCosignLog.find(
        (x) => x.txnHash === transactionStatus.hash
      );
      if (!txnCosign) {
        continue;
      }
      if (
        txnCosign.status !== transactionStatus.group &&
        transactionStatus.group
      ) {
        txnCosign.status = transactionStatus.group;

        if (txnCosign.status === "failed") {
          txnCosign.statusMsg = transactionStatus.status;
          setFailedTxns(txnCosign);
        } else if (txnCosign.status === TransactionGroupType.CONFIRMED) {
          txnHashesConfirmed.push(txnCosign.txnHash);
          listenerState.allConfirmedTransactionsHash.push(txnCosign.txnHash);
        }

        if (!displayedTxn.includes(transactionStatus.hash)) {
          addTxnToastMessage(
            txnCosign.status,
            transactionStatus.hash,
            txnCosign.statusMsg
          );
        }
      }
    } else {
      let txnSwap = AppState.txnSwapLog.find(
        (x) => x.txnHash === transactionStatus.hash
      );
      if (!txnSwap) {
        continue;
      }
      if (
        txnSwap.status !== transactionStatus.group &&
        transactionStatus.group
      ) {
        txnSwap.status = transactionStatus.group;

        if (txnSwap.status === "failed") {
          txnSwap.statusMsg = transactionStatus.status;
          setFailedTxns(txnSwap);
        } else if (txnSwap.status === TransactionGroupType.CONFIRMED) {
          txnHashesConfirmed.push(txnSwap.txnHash);
          listenerState.allConfirmedTransactionsHash.push(txnSwap.txnHash);
        }

        addTxnToastMessage(
          txnSwap.status,
          transactionStatus.hash,
          txnSwap.statusMsg,
          "swap"
        );
      }
    }
  }

  if (txnHashesConfirmed.length) {
    ListenerStateUtils.fireRecountConfirmed();
  }
  WalletUtils.transactionConfirmed(txnHashesConfirmed);

  let txnsHashNotFound = allTransasctionHash.filter(
    (x) => !txnsHashFound.includes(x)
  );

  for (let i = 0; i < txnsHashNotFound.length; ++i) {
    if (txnsHash1.includes(txnsHashNotFound[i])) {
      let txnActivity = AppState.txnActivityLog.find(
        (x) => x.txnHash === txnsHashNotFound[i]
      );
      txnActivity!.checkedNum = txnActivity!.checkedNum + 1;
    } else if (txnsHash2.includes(txnsHashNotFound[i])) {
      let txnCosign = AppState.txnCosignLog.find(
        (x) => x.txnHash === txnsHashNotFound[i]
      );
      txnCosign!.checkedNum = txnCosign!.checkedNum + 1;
    } else {
      let txnSwap = AppState.txnSwapLog.find(
        (x) => x.txnHash === txnsHashNotFound[i]
      );
      txnSwap!.checkedNum = txnSwap!.checkedNum + 1;
    }
  }
};

const doTxnCheckingInterval = ref<NodeJS.Timer>();

const doConfirmedTxnCheckingInterval = ref<NodeJS.Timer>();

const doRecheckAssetsNamesInterval = ref<NodeJS.Timer>();

const targetBlockSeconds = computed(() => {
  return UnitConverter.configReturn(
    networkState.currentNetworkProfileConfig!.blockGenerationTargetTime,
    TimeUnit.SECOND
  );
});

const doTxnChecking = () => {
  doTxnCheckingInterval.value = setInterval(
    checkTxnStatus,
    targetBlockSeconds.value * 1000
  );
};

const doLogin = async () => {
  await WalletUtils.refreshAllAccountDetails(
    walletState.currentLoggedInWallet!,
    networkState.currentNetworkProfile!
  );
};

const doLogout = () => {
  try {
    if (doRecheckAssetsNamesInterval.value) {
      clearInterval(doRecheckAssetsNamesInterval.value);
    }

    if (doConfirmedTxnCheckingInterval.value) {
      clearInterval(doConfirmedTxnCheckingInterval.value);
    }

    if (doTxnCheckingInterval.value) {
      clearInterval(doTxnCheckingInterval.value);
    }
  } catch (error) {}
};

const logout = () => {
  doLogout();
  WalletStateUtils.doLogout();
  AppStateUtils.doLogout();
  ListenerStateUtils.reset();
  router.push({ name: "Home" });
};

const doAutoAnnounce = async () => {
  let currentBlockHeight =
    await AppState.chainAPI.chainAPI.getBlockchainHeight();

  for (let i = 0; i < listenerState.autoAnnounceSignedTransaction.length; ++i) {
    let letAnnouce = false;

    let currentAutoAnnounceTx = listenerState.autoAnnounceSignedTransaction[i];

    if (currentAutoAnnounceTx.announced) {
      continue;
    }

    if (
      currentAutoAnnounceTx.announceAtBlock &&
      currentBlockHeight >= currentAutoAnnounceTx.announceAtBlock
    ) {
      letAnnouce = true;
    } else if (
      currentAutoAnnounceTx.hashAnnounceBlock &&
      currentAutoAnnounceTx.hashAnnounceBlock.hashFoundAtBlock
    ) {
      if (
        currentBlockHeight >
        currentAutoAnnounceTx.hashAnnounceBlock.hashFoundAtBlock +
          currentAutoAnnounceTx.hashAnnounceBlock.annouceAfterBlockNum
      ) {
        letAnnouce = true;
      }
    } else if (currentAutoAnnounceTx.hashAnnounceBlock) {
      try {
        let txnStatusInfo =
          await AppState.chainAPI.transactionAPI.getTransactionStatus(
            currentAutoAnnounceTx.hashAnnounceBlock.trackHash
          );

        if (txnStatusInfo.group === TransactionGroupType.CONFIRMED) {
          currentAutoAnnounceTx.hashAnnounceBlock.hashFound = true;
          currentAutoAnnounceTx.hashAnnounceBlock.hashFoundAtBlock =
            txnStatusInfo.height.compact();

          if (
            currentBlockHeight >
            currentAutoAnnounceTx.hashAnnounceBlock.hashFoundAtBlock +
              currentAutoAnnounceTx.hashAnnounceBlock.annouceAfterBlockNum
          ) {
            letAnnouce = true;
          }
        }
      } catch (error) {
        currentAutoAnnounceTx.checkCount += 1;
      }
    }

    if (letAnnouce) {
      if (currentAutoAnnounceTx.type === AnnounceType.NORMAL) {
        await AppState.chainAPI.transactionAPI.announce(
          currentAutoAnnounceTx.signedTransaction
        );
      } else {
        await AppState.chainAPI.transactionAPI.announceAggregateBonded(
          currentAutoAnnounceTx.signedTransaction
        );
      }

      currentAutoAnnounceTx.announced = true;
    }
  }

  let remainingTransactionsToAnnounce =
    listenerState.autoAnnounceSignedTransaction.filter(
      (autoTx) => !autoTx.announced
    );

  listenerState.autoAnnounceSignedTransaction = remainingTransactionsToAnnounce;

  if (listenerState.autoAnnounceSignedTransaction.length) {
    setTimeout(doAutoAnnounce, 15000);
  } else {
    AppState.isPendingTxnAnnounce = false;
  }
};

const doConfirmedTxnChecking = () => {
  doConfirmedTxnCheckingInterval.value = setInterval(
    WalletUtils.checkConfirmedTxnChecking,
    60000
  ); // 1 minute
};
watch(
  [() => AppState.isPendingTxnAnnounce, () => AppState.isReady],
  async (n) => {
    if (n[0] && n[1]) {
      doAutoAnnounce();
    } else {
      toast.removeGroup("tr-wait");
    }
  },
  { immediate: true }
);

const doRecheckAssetsNames = () => {
  doRecheckAssetsNamesInterval.value = setInterval(
    WalletUtils.recheckAssetsNames,
    60000 * 5
  ); // 5 minute
};
watch(
  [() => walletState.isLogin, () => AppState.isReady],
  async ([loginState, readyState], o) => {
    if (!loginState && !(o[0] ?? false)) {
      return;
    }
    if (!loginState) {
      logout();
      return;
    }

    if (loginState && readyState) {
      await doLogin();
      doTxnChecking();
      doConfirmedTxnChecking();
      doRecheckAssetsNames();
    }
  },
  { immediate: true }
);

const createTxnHashExplorerLink = (txnHash: string) => {
  return `${networkState.currentNetworkProfile!.chainExplorer.url}/${
    networkState.currentNetworkProfile!.chainExplorer.hashRoute
  }/${txnHash}`;
};

interface myToastMessageOptions extends ToastMessageOptions {
  detail2?: string;
  detail3?: string;
  detail4?: string;
  url?: string;
}

const modifiedToast = (data: myToastMessageOptions) => {
  return toast.add(data);
};
const addTxnToastMessage = (
  status: string,
  txnHash: string,
  statusMessage: string,
  extraData = ""
) => {
  let txnHashExplorerLink = createTxnHashExplorerLink(txnHash);

  if (status === "failed") {
    modifiedToast({
      severity: "error",
      summary: t("transaction.txError"),
      detail: "Transaction Failed with error",
      detail2: "Transaction Hash: ",
      detail3: txnHash.slice(0, 20) + "...",
      detail4: statusMessage,
      group: "br-custom",
      life: 10000,
    });
  } else if (status === TransactionGroupType.UNCONFIRMED) {
    modifiedToast({
      severity: "warn",
      summary: t("transaction.txAdded", 1),
      detail: t("transaction.txUnconfirmed", 1),
      detail2: "Transaction Hash: ",
      detail3: txnHash.slice(0, 20) + "...",
      url: txnHashExplorerLink,
      group: "br-custom",
      life: 5000,
    });
  } else if (status === TransactionGroupType.PARTIAL) {
    modifiedToast({
      severity: "warn",
      summary: t("transaction.partialAdded", 1),
      detail: "Transaction Hash: ",
      detail3: txnHash.slice(0, 20) + "...",
      url: txnHashExplorerLink,
      group: "br-custom",
      life: 6000,
    });
  } else if (status === TransactionGroupType.CONFIRMED) {
    if (extraData === "swap") {
      modifiedToast({
        severity: "success",
        summary: t("transaction.swapTx", 1),
        detail: "Transaction Hash: ",
        detail3: txnHash.slice(0, 20) + "...",
        url: txnHashExplorerLink,
        group: "br-custom",
        life: 8000,
      });
    } else {
      modifiedToast({
        severity: "success",
        summary: t("transaction.txConfirmed", 1),
        detail: "Transaction Hash: ",
        detail3: txnHash.slice(0, 20) + "...",
        url: txnHashExplorerLink,
        group: "br-custom",
        life: 8000,
      });
      let verifySwitch = sessionStorage.getItem("soundSetting");
      if (verifySwitch === "true") {
        beep();
      }
    }
  }
};

const beep = () => {
  return new Promise<void>((resolve, reject) => {
    /*volume = volume || 100;*/

    try {
      let sound = new Audio(ding);

      // Set volume
      /*sound.volume = volume / 100;*/

      sound.onended = () => {
        resolve();
      };

      sound.play();
    } catch (error) {
      reject(error);
    }
  });
};
</script>
