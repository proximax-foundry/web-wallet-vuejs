import { 
  Account, Address, AggregateTransaction, ResolutionEntry, SignedTransaction,
  TransactionSearch
 } from "tsjs-xpx-chain-sdk";
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
import { Wallet } from '@/models/wallet';
import { computed } from 'vue';
import { listenerState } from '@/state/listenerState';
import { SessionService } from '@/models/stores/sessionService';
import i18n from '@/i18n';
import { useI18n } from "vue-i18n";
import {UnitConverter} from "./unitConverter";
import {TimeUnit} from "../models/const/timeUnit";
import { Account as MyAccount } from "@/models/account";

interface Notification {
  id: string,
  type: string,
  label: string,
  address: string,
  timestamp: number,
}

const dataPerRequest = 50;
const delay = ms => new Promise(res => setTimeout(res, ms));

const fetchPartialTxn = async(accounts: WalletAccount[], wallet: Wallet):Promise<Notification[]> => {
  const notifications:Array<Notification> = [];
  let transactionGroupType = Helper.getTransactionGroupType();
  // let dashboardService = new DashboardService(walletState.currentLoggedInWallet, account);
  let txnQueryParams = Helper.createTransactionQueryParams();
  txnQueryParams.pageSize = 100;
  txnQueryParams.firstLevel = false;

  let allTxnSearches: TransactionSearch[] = [];
  let requests = [];

  for(let i = 0; i < accounts.length; ++i){

    txnQueryParams.address = accounts[i].address;

    requests.push(AppState.chainAPI.transactionAPI.searchTransactions(transactionGroupType.PARTIAL, txnQueryParams));

    if(requests.length === dataPerRequest){

      let txnSearchResults = await Promise.all<TransactionSearch>(requests);
      requests = [];

      allTxnSearches = allTxnSearches.concat(txnSearchResults);

      await delay(250);
    }
  }

  if(requests.length){

    let txnSearchResults = await Promise.all<TransactionSearch>(requests);
    requests = [];

    allTxnSearches = allTxnSearches.concat(txnSearchResults);
  }
  
  for(let i =0; i < allTxnSearches.length; ++i){

    let txns = allTxnSearches[i].transactions;

    for(let x=0; x < txns.length; ++x){
      notifications.push({
        id: txns[x].transactionInfo.hash,
        type: 'Partial',
        label: wallet.convertAddressToNamePretty(accounts[i].address, true),
        address: accounts[i].address,
        timestamp: Helper.formatDeadlineTimestamp(txns[x].deadline.adjustedValue.compact())
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
}

const loadPartialTransactions = async(): Promise<Notification[]> => {

  if(walletState.currentLoggedInWallet === null){
    return;
  }

  let wallet = walletState.currentLoggedInWallet;

  // const notifications:Notification[] = [];
  let accounts = wallet.accounts as WalletAccount[];//.map(x => x as MyAccount); //.concat(wallet.others.map(x => x as MyAccount));

  let returnNotifications = await fetchPartialTxn(accounts, wallet);

  // for (const account of accounts) {
  //   let noti = await fetchPartialTxn(account);
  //   for (const notification of noti) {
  //     notifications.push(notification);
  //   }
  // }
  return returnNotifications;
};

const loadExpiringNamespace = (): Notification[] => {

  if(walletState.currentLoggedInWallet === null){
    return;
  }

  let wallet = walletState.currentLoggedInWallet;

  let notifications: Notification[] = [];

  let blockTargetTime = UnitConverter.configReturn(networkState.currentNetworkProfileConfig.blockGenerationTargetTime, TimeUnit.SECOND);
  
  let daysInSeconds = (30 * 60 * 60 * 24); // 30 days

  let minBlockBeforeExpire = Math.ceil(daysInSeconds/blockTargetTime);

  let allAccs = wallet.accounts.map(x => x as MyAccount).concat(wallet.others.map(x => x as MyAccount));
  let allAccsPubKey = allAccs.map(x => x.publicKey);

  let namespaces = AppState.namespacesInfo.filter(x => allAccsPubKey.includes(x.owner));

  for(let i =0; i < namespaces.length; ++i){
    let namespace = namespaces[i];
    if(typeof namespace.endHeight !== 'string'){
      let differenceHeight = namespace.endHeight - namespace.startHeight;
      let remainingBlockHeight = namespace.endHeight - AppState.readBlockHeight;

      if(differenceHeight < minBlockBeforeExpire){
        notifications.push({
          id: namespace.idHex,
          type: 'Namespace',
          label: namespace.name,
          address: allAccs.find(x => x.publicKey === namespace.owner).address,
          timestamp: Math.floor(Date.now()) + (remainingBlockHeight*blockTargetTime*1000)
        });
      }
    }
  }

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
    let expiringNamespaceNotifications = await loadExpiringNamespace();
    let partialTxnNotifications = await loadPartialTransactions()
    let notifications = [];
    
    notifications = partialTxnNotifications.concat(expiringNamespaceNotifications);

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
      if(visitedNotification){
        let matchId = notifications.find(x => visitedNotification.includes(x.id));

        if(matchId){
          newNotification = true;
        }
      }else{
        newNotification = true;
      }
    }
    return newNotification;
  }
}

