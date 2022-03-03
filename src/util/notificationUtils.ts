import { Account, Address, AggregateTransaction, SignedTransaction } from "tsjs-xpx-chain-sdk";
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletUtils } from "@/util/walletUtils";
import { ChainUtils } from "@/util/chainUtils";
import { Helper } from '@/util/typeHelper';
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";
import { ChainAPICall } from "@/models/REST/chainAPICall";
import { DashboardService } from '@/modules/dashboard/service/dashboardService';
import { AppState } from '@/state/appState';
import { WalletAccount } from '@/models/walletAccount';
import { computed } from 'vue';
import { listenerState } from '@/state/listenerState';
import { SessionService } from '@/models/stores/sessionService';
import i18n from '@/i18n';
import { useI18n } from "vue-i18n";

interface Notification {
  id: string,
  type: string,
  label: string,
  address: string,
  timestamp: number,
}

const currentBlock = computed(() => listenerState.currentBlock);

const fetchPartialTxn = async(account: WalletAccount):Promise<Notification[]> => {
  const notifications:Array<Notification> = [];
  let transactionGroupType = Helper.getTransactionGroupType();
  let dashboardService = new DashboardService(walletState.currentLoggedInWallet, account);
  let txnQueryParams = Helper.createTransactionQueryParams();
  txnQueryParams.pageSize = 100;
  txnQueryParams.address = account.address;
  let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.PARTIAL, txnQueryParams);
  let formattedTxns = await dashboardService.formatPartialMixedTxns(transactionSearchResult.transactions);
  formattedTxns.forEach(txn => {
    notifications.push({
      id: txn.hash,
      type: 'Partial',
      label: walletState.currentLoggedInWallet.convertAddressToNamePretty(account.address, true),
      address: account.address,
      timestamp: Helper.formatDeadlineTimestamp(txn.deadline)
    });
  });
  return notifications;
}

const loadPartialTransactions = async(): Promise<Notification[]> => {

  const notifications:Array<Notification> = [];
  let accounts = [];
  let accountsAddress = walletState.currentLoggedInWallet.accounts.map((acc)=> {
    return { 
      address: acc.address,
      namespaces: acc.namespaces,
    };
  });
  let othersAddress = walletState.currentLoggedInWallet.others.map((acc)=> {
    return { 
      address: acc.address,
      namespaces: acc.namespaces,
    };
  });
  accounts = accountsAddress.concat(othersAddress);

  for (const account of accounts) {
    let noti = await fetchPartialTxn(account);
    for (const notification of noti) {
      notifications.push(notification);
    }
  }
  return notifications;
};

const loadExpiringNamespace = (): Notification[] => {
  let accounts = [];
  let notifications:Array<Notification> = [];

  let chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
  chainConfig.init();
  let blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);

  let minBlockBeforeExpire = (30 * 60 * 60 * 24)/blockTargetTime;

  let accountsAddress = walletState.currentLoggedInWallet.accounts.map((acc)=> {
    return { 
      address: acc.address,
      namespaces: acc.namespaces,
    };
  });
  let othersAddress = walletState.currentLoggedInWallet.others.map((acc)=> {
    return { 
      address: acc.address,
      namespaces: acc.namespaces,
    };
  });
  accounts = accountsAddress.concat(othersAddress);
  accounts.forEach(account => {
    account.namespaces.forEach(namespace => {
      let differenceHeight = namespace.endHeight - namespace.startHeight;
      let remainingBlockHeight = namespace.endHeight - currentBlock.value;
      if(differenceHeight < minBlockBeforeExpire){
        notifications.push({
          id: namespace.idHex,
          type: 'Namespace',
          label: namespace.name,
          address: account.address,
          timestamp: Math.floor(Date.now()) + (remainingBlockHeight*blockTargetTime*1000)
        });
      }
    });
  });
  return notifications;
}
const { t } = i18n.global;
export class NotificationUtils {
  
  static relativeTime = (timestamp:number) => {
    let current = new Date();
    let expired = new Date(timestamp);
    let timeDiff = {
      years: expired.getFullYear() - current.getFullYear(),
      months: expired.getMonth() - current.getMonth(),
      days: expired.getDate()  - current.getDate(),
      hours: expired.getHours() - current.getHours(),
      mins: expired.getMinutes() - current.getMinutes(),
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
      const copyCurrent = new Date(current.getTime());
      copyCurrent.setDate(32);
      timeDiff.days = 32 - current.getDate() - copyCurrent.getDate() + expired.getDate();
    }
    if (timeDiff.months < 0) {
      timeDiff.years--;
      timeDiff.months+=12;
    }
    if(timeDiff.years > 0){
      return timeDiff.years + ' ' + t('general.year',timeDiff.years);
    }else if(timeDiff.months > 0){
      return timeDiff.months + ' ' + t('general.month',timeDiff.months);
    }else if(timeDiff.days > 0){
      return timeDiff.days + ' ' + t('general.day',timeDiff.days);
    }else if(timeDiff.hours > 0){
      return timeDiff.hours + ' ' + t('general.hour',timeDiff.hours);
    }else{
      return timeDiff.mins + ' ' + t('general.minute',timeDiff.mins);
    }
  }

  static async getNotification(){
    let expiringNamespaceNotifications = loadExpiringNamespace();
    let partialTxnNotifications = await loadPartialTransactions()
    let notifications = [];
    if(partialTxnNotifications.length > 0){
      partialTxnNotifications.forEach(notification => {
        notifications.push(notification);
      })
    }
    partialTxnNotifications.concat(expiringNamespaceNotifications);
    if(expiringNamespaceNotifications.length > 0){
      expiringNamespaceNotifications.forEach(notification => {
        notifications.push(notification);
      });
    }
    notifications.sort(function (a, b){
      return a.timestamp - b.timestamp;
    });
    SessionService.setObject('notification', notifications);
    return notifications;
  }

  static getNotificationFromStorage(){
    return SessionService.getJSONParse('notification');
  }

  static saveVisitedNotification(){
    const notifications = SessionService.getJSONParse('notification');
    let notificationID = [];
    notifications.forEach(notification => {
      notificationID.push(notification.id);
    });
    localStorage.setItem('VisitedNotification', JSON.stringify(notificationID));
  }

  static highlightNewNotification(){
    let visitedNotification = JSON.parse(localStorage.getItem('VisitedNotification'));
    const notifications = NotificationUtils.getNotificationFromStorage();
    let newNotification = false;
    if(notifications.length > 0){
      if(visitedNotification.length > 0){
        notifications.forEach(notification => {
          let matchId = visitedNotification.find(noti => noti == notification.id);
          if(!matchId){
            newNotification = true;
            return newNotification;
          }
        });
      }else{
        newNotification = true;
        return newNotification;
      }
    }
    return newNotification;
  }



}

