import type { TransactionSearch } from "tsjs-xpx-chain-sdk";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from "@/util/typeHelper";
import { AppState } from "@/state/appState";
import type { WalletAccount } from "@/models/walletAccount";
import type { Wallet } from "@/models/wallet";
import { SessionService } from "@/models/stores/sessionService";
import { UnitConverter } from "./unitConverter";
import { TimeUnit } from "../models/const/timeUnit";
import type { Account as MyAccount } from "@/models/account";
import { useI18n } from "vue-i18n";

interface Notification {
  id: string;
  type: string;
  label: string;
  address: string;
  timestamp: number;
}

const dataPerRequest = 50;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchPartialTxn = async (
  accounts: WalletAccount[],
  wallet: Wallet
): Promise<Notification[]> => {
  const notifications: Array<Notification> = [];
  const transactionGroupType = Helper.getTransactionGroupType();
  // let dashboardService = new DashboardService(walletState.currentLoggedInWallet, account);
  const txnQueryParams = Helper.createTransactionQueryParams();
  txnQueryParams.pageSize = 100;
  txnQueryParams.firstLevel = false;

  let allTxnSearches: TransactionSearch[] = [];
  let requests = [];
  if (!AppState.chainAPI) {
    throw new Error("Service unavailable");
  }
  for (let i = 0; i < accounts.length; ++i) {
    txnQueryParams.address = accounts[i].address;

    requests.push(
      AppState.chainAPI.transactionAPI.searchTransactions(
        transactionGroupType.PARTIAL,
        txnQueryParams
      )
    );

    if (requests.length === dataPerRequest) {
      const txnSearchResults = await Promise.all<TransactionSearch>(requests);
      requests = [];

      allTxnSearches = allTxnSearches.concat(txnSearchResults);

      await delay(250);
    }
  }

  if (requests.length) {
    const txnSearchResults = await Promise.all<TransactionSearch>(requests);
    requests = [];

    allTxnSearches = allTxnSearches.concat(txnSearchResults);
  }

  for (let i = 0; i < allTxnSearches.length; ++i) {
    const txns = allTxnSearches[i].transactions;

    for (let x = 0; x < txns.length; ++x) {
      const { transactionInfo } = txns[x];
      if (!transactionInfo || !transactionInfo.hash) {
        throw new Error("Service unavailable");
      }
      notifications.push({
        id: transactionInfo.hash,
        type: "Partial",
        label: wallet.convertAddressToNamePretty(accounts[i].address, true),
        address: accounts[i].address,
        timestamp: Helper.formatDeadlineTimestamp(
          txns[x].deadline.adjustedValue.compact()
        ),
      });
    }
  }

  // let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.PARTIAL, txnQueryParams);
  // let formattedTxns = await dashboardService.formatPartialMixedTxns(transactionSearchResult.transactions);
  // formattedTxns.forEach(txn => {
  //   notifications.push({
  //     id: txn.hash,
  //     type: 'Partial',
  //     label: walletState.currentLoggedInWallet.convertAddressToNamePretty(account.address, true),
  //     address: account.address,
  //     timestamp: Helper.formatDeadlineTimestamp(txn.deadline)
  //   });
  // });
  return notifications;
};

const loadPartialTransactions = async (): Promise<Notification[]> => {
  const wallet = walletState.currentLoggedInWallet;
  if (!wallet) {
    throw new Error("Service unavailable");
  }
  // const notifications:Notification[] = [];
  const accounts = wallet.accounts as WalletAccount[]; //.map(x => x as MyAccount); //.concat(wallet.others.map(x => x as MyAccount));

  const returnNotifications = await fetchPartialTxn(accounts, wallet);

  // for (const account of accounts) {
  //   let noti = await fetchPartialTxn(account);
  //   for (const notification of noti) {
  //     notifications.push(notification);
  //   }
  // }
  return returnNotifications;
};

const loadExpiringNamespace = (): Notification[] => {
  const wallet = walletState.currentLoggedInWallet;
  if (!wallet) {
    throw new Error("Service unavailable");
  }
  if (!networkState.currentNetworkProfileConfig) {
    throw new Error("Service unavailable");
  }
  const notifications: Notification[] = [];

  const blockTargetTime = UnitConverter.configReturn(
    networkState.currentNetworkProfileConfig.blockGenerationTargetTime,
    TimeUnit.SECOND
  );

  const daysInSeconds = 30 * 60 * 60 * 24; // 30 days

  const minBlockBeforeExpire = Math.ceil(daysInSeconds / blockTargetTime);

  const allAccs = wallet.accounts
    .map((x) => x as MyAccount)
    .concat(wallet.others.map((x) => x as MyAccount));

  const allAccsPubKey = allAccs.map((x) => x.publicKey);

  const namespaces = AppState.namespacesInfo.filter((x) =>
    allAccsPubKey.includes(x.owner)
  );

  for (let i = 0; i < namespaces.length; ++i) {
    const namespace = namespaces[i];
    if (typeof namespace.endHeight !== "string") {
      if (!namespace.endHeight || !namespace.startHeight) {
        throw new Error("Service unavailable");
      }
      const remainingBlockHeight =
        namespace.endHeight - AppState.readBlockHeight;

      if (remainingBlockHeight < minBlockBeforeExpire) {
        const findAcc = allAccs.find((x) => x.publicKey === namespace.owner);
        if (!findAcc) {
          throw new Error("Account not found");
        }
        notifications.push({
          id: namespace.idHex,
          type: "Namespace",
          label: namespace.name,
          address: findAcc.address,
          timestamp:
            Math.floor(Date.now()) +
            remainingBlockHeight * blockTargetTime * 1000,
        });
      }
    }
  }

  return notifications;
};
const { t } = useI18n({ useScope: "global" });
export class NotificationUtils {
  static relativeTime = (timestamp: number): string => {
    const current = new Date();
    const expired = new Date(timestamp);
    const timeDiff = {
      years: expired.getFullYear() - current.getFullYear(),
      months: expired.getMonth() - current.getMonth(),
      days: expired.getDate() - current.getDate(),
      hours: expired.getHours() - current.getHours(),
      mins: expired.getMinutes() - current.getMinutes(),
    };

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
      const copyCurrent = new Date(current.getTime());
      copyCurrent.setDate(32);
      timeDiff.days =
        32 - current.getDate() - copyCurrent.getDate() + expired.getDate();
    }
    if (timeDiff.months < 0) {
      timeDiff.years--;
      timeDiff.months += 12;
    }
    if (timeDiff.years > 0) {
      return (
        timeDiff.years + " " + t("general.year", timeDiff.years.toString())
      );
    } else if (timeDiff.months > 0) {
      return (
        timeDiff.months + " " + t("general.month", timeDiff.months.toString())
      );
    } else if (timeDiff.days > 0) {
      return timeDiff.days + " " + t("general.day", timeDiff.days.toString());
    } else if (timeDiff.hours > 0) {
      return (
        timeDiff.hours + " " + t("general.hour", timeDiff.hours.toString())
      );
    } else {
      return (
        timeDiff.mins + " " + t("general.minute", timeDiff.mins.toString())
      );
    }
  };

  static async getNotification(): Promise<Notification[]> {
    const expiringNamespaceNotifications = loadExpiringNamespace();
    const partialTxnNotifications = await loadPartialTransactions();
    let notifications: Notification[] = [];

    notifications = partialTxnNotifications.concat(
      expiringNamespaceNotifications
    );

    notifications.sort(function (a, b) {
      return a.timestamp - b.timestamp;
    });
    SessionService.setObject("notification", notifications);
    return notifications;
  }

  static getNotificationFromStorage(): Notification[] {
    return SessionService.getJSONParse("notification");
  }

  static saveVisitedNotification() {
    const notifications: Notification[] =
      SessionService.getJSONParse("notification");
    const notificationID: string[] = [];
    if (!notifications) {
      return;
    }
    notifications.forEach((notification) => {
      notificationID.push(notification.id);
    });
    localStorage.setItem("VisitedNotification", JSON.stringify(notificationID));
  }

  static highlightNewNotification(): boolean {
    const data = localStorage.getItem("VisitedNotification");
    if (!data) {
      return false;
    }
    const visitedNotification: string[] = JSON.parse(data);
    const notifications = NotificationUtils.getNotificationFromStorage();
    let newNotification = false;
    if (notifications.length > 0) {
      if (visitedNotification) {
        const matchId = notifications.find((x) =>
          visitedNotification.includes(x.id)
        );

        if (matchId) {
          newNotification = true;
        }
      } else {
        newNotification = true;
      }
    }
    return newNotification;
  }
}
