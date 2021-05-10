<template>
  <div class="md:grid md:grid-cols-2 mb-8">
    <div class="w-full text-center md:text-left mx-5">
      <div class="font-bold hover:bg-gray-100 cursor-pointer inline-block py-1 px-2 pl-0 rounded-lg" @click="openSetDefaultModal = !openSetDefaultModal"><font-awesome-icon icon="caret-down" class="h-5 w-5 text-gray-600 inline-block"></font-awesome-icon>&nbsp;{{ primaryAccountName }} <div class="text-xs font-normal ml-1 inline-block px-2 py-1 rounded bg-yellow-200">Default</div></div>
      <div class="text-xs my-2">
        <div class="relative inline-block">
          <div class="absolute z-20 h-full"></div>
          <input
            id="address"
            class="text-xs outline-none z-10"
            type="text"
            :value="primaryAccount"
            style="width: 325px;"
          />
        </div>
        <font-awesome-icon icon="copy" @click="copy('address')" class="w-5 h-5 text-gray-500 cursor-pointer inline mx-2"></font-awesome-icon><img src="../assets/img/icon-qr-code.svg" class="w-5 inline">
      </div>
      <div class="text-center md:text-left">
        <div class="inline-block mr-4"><img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1"><span class="text-xs">{{ primaryAccountBalance }} XPX</span></div>
        <div class="inline-block"><img src="../assets/img/icon-usd-blue.svg" class="w-5 inline mr-1"><span class="text-xs">USD 204.451</span></div>
      </div>
    </div>
    <div class="w-full lg:w-6/12 mt-5 md:mt-0">
      <div class="text-md text-center md:text-left">Transactions: <span>{{ confirmedTransactions.length + unconfirmedTransactions.length }}</span></div>
      <div class="text-center md:text-left">
        <div class="mt-2">
          <div class="rounded-full bg-blue-primary text-white w-24 h-15 px-2 py-1 mr-3 inline-block" :class="confirmedTransactions.length>0?'cursor-pointer':''" @click="clickConfirmedTransaction()">
            <div class="flex justify-between">
              <div class="rounded-full text-white border pt-1 pl-1 w-6 h-6"><font-awesome-icon icon="check" class="w-4 h-3"></font-awesome-icon></div>
              <div class="text-xs font-bold flex items-center">{{ confirmedTransactions.length }}</div>
            </div>
          </div>
          <div class="rounded-full bg-blue-300 text-white w-24 h-15 px-2 py-1 mr-3 inline-block" :class="unconfirmedTransactions.length>0?'cursor-pointer':''" @click="clickUnconfirmedTransaction()">
            <div class="flex justify-between">
              <div class="rounded-full text-white border pt-1 pl-1 w-6 h-6"><font-awesome-icon icon="exclamation" class="w-4 h-3"></font-awesome-icon></div>
              <div class="text-xs font-bold flex items-center">{{ unconfirmedTransactions.length }}</div>
            </div>
          </div>
          <div class="rounded-full bg-yellow-500 text-white w-24 h-15 px-2 py-1 inline-block" :class="aggregateBondedTransactions.length>0?'cursor-pointer':''" @click="clickAggregateBondedTransactions()">
            <div class="flex justify-between">
              <img src="../assets/img/icon-transaction-partial-white.svg" class="w-6 h-6" />
              <div class="text-xs font-bold flex items-center">{{ aggregateBondedTransactions.length }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <DashboardDataTable :transactions="confirmedTransactions.sort((a, b) => b.block - a.block)" v-if="isShowConfirmed"></DashboardDataTable>
    <DashboardDataTable :transactions="unconfirmedTransactions.sort((a, b) => b.block - a.block)" v-if="isShowUnconfirmed"></DashboardDataTable>
    <PartialDashboardDataTable :transactions="aggregateBondedTransactions.sort((a, b) => b.deadline - a.deadline)" v-if="isShowAggregateBonded"></PartialDashboardDataTable>
    <SetAccountDefaultModal :toggleModal="openSetDefaultModal" />
  </div>
</template>

<script>
import { computed, inject, ref, getCurrentInstance } from 'vue';
import DashboardDataTable from '@/components/DashboardDataTable.vue'
import PartialDashboardDataTable from '@/components/PartialDashboardDataTable.vue'
import SetAccountDefaultModal from '@/components/SetAccountDefaultModal.vue'
import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';
import { copyKeyFunc } from '../util/functions.js';
import { transactions } from '../util/transactions.js';
// eslint-disable-next-line no-unused-vars
import { PublicAccount, Order, QueryParams } from "tsjs-xpx-chain-sdk";
import { transferEmitter } from '../util/listener.js';

import { App } from '../store/app';

export default {
  name: 'ViewDashboard',
  components: {
    FontAwesomeIcon,
    DashboardDataTable,
    PartialDashboardDataTable,
    SetAccountDefaultModal,
  },

  setup(){
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const openSetDefaultModal = ref(false);

    const copy = (id) => copyKeyFunc(id);
    const primaryAccount = computed(
      () => {
          if (appStore.state.currentLoggedInWallet) {
            return App.pretty(appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).address);
          }else{
            return 0;
          }
      }
    );

    const primaryAccountBalance = computed(
      () => {
          if (appStore.state.currentLoggedInWallet) {
            return appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).balance;
          }else{
            return 0;
          }
      }
    );

    const primaryAccountName = computed(
      () => {
          if (appStore.state.currentLoggedInWallet) {
            return appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).name;
          }else{
            return 0;
          }
      }
    );

    const confirmedTransactions = ref([]);
    const unconfirmedTransactions = ref([]);
    const aggregateBondedTransactions = ref([]);
    const pageSize = 10;
    const isShowConfirmed = ref(true);
    const isShowUnconfirmed = ref(false);
    const isShowAggregateBonded = ref(false);

    const clickConfirmedTransaction = () => {
      isShowConfirmed.value = true;
      isShowUnconfirmed.value = false;
      isShowAggregateBonded.value = false;
    };

    const clickUnconfirmedTransaction = () => {
      if(unconfirmedTransactions.value.length > 0){
        isShowUnconfirmed.value = true;
        isShowConfirmed.value = false;
        isShowAggregateBonded.value = false;
      }
    };

    const clickAggregateBondedTransactions = () => {
      if(aggregateBondedTransactions.value.length > 0){
        isShowAggregateBonded.value = true;
        isShowConfirmed.value = false;
        isShowUnconfirmed.value = false;
      }
    };

    // balance(xpxUsd) {
    //   this.subscription.push(this.transactionService.getBalance$().subscribe(
    //     next => {
    //       this.vestedBalance = this.transactionService.getDataPart(next, 6);
    //       if (this.xpxUsd != undefined) {
    //         this.coinUsd = Number(next.replace(/,/g, '')) * xpxUsd;
    //       }
    //     },
    //     error => this.vestedBalance = {
    //       part1: '0',
    //       part2: '000000'
    //     }
    //   ));
    // }

    const generateNames = () => {
      const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
      var contact = [];
      var accountCount = wallet.accounts.length;
      wallet.accounts.forEach((element, index) => {
        contact.push({
          address: element.address,
          name: element.name + ' - Owner\'s account',
          id: (index + 1),
        });
      });
      if(wallet.contacts!=undefined){
        wallet.contacts.forEach((element, index) => {
          contact.push({
            address: element.address,
            name: element.name + ' - Contact',
            id: (accountCount + index + 1),
          });
        });
      }
      return contact;
    }
    let names = generateNames();

    const getTransaction = (publicAccount, item, pageSize, lastId = null) => {
      let order = Order.ASC;
      let qp = new QueryParams(pageSize, lastId, order);
      let lastTransactionID = lastId;
      // format names

      siriusStore.accountHttp.transactions(publicAccount, qp).subscribe(tx => {
        if( tx.length > 0 ){
          tx.forEach((t)=>{
            let formattedTransaction = transactions.formatTransaction(t, names);
            confirmedTransactions.value.push(formattedTransaction);
            lastTransactionID = t.transactionInfo.id;
          })
        }
        if(tx.length == pageSize){
          // run again
          getTransaction(publicAccount, item, pageSize, lastTransactionID);
        }
      }, error => {
        console.error(error);
      });
    };

    const getUnconfirmedTransaction = (publicAccount, item, pageSize, lastId = null) => {
      let order = Order.ASC;
      let qp = new QueryParams(pageSize, lastId, order);
      let lastTransactionID = lastId;
      siriusStore.accountHttp.unconfirmedTransactions(publicAccount, qp).subscribe(tx => {
        if( tx.length > 0 ){
          tx.forEach((t)=>{
            let formattedTransaction = transactions.formatTransaction(t, names);
            unconfirmedTransactions.value.push(formattedTransaction);
            lastTransactionID = t.transactionInfo.id;
          })
        }
        if(tx.length == pageSize){
          // run again
          getUnconfirmedTransaction(publicAccount, item, pageSize, lastTransactionID);
        }
      }, error => {
        console.error(error);
      });
    };

    const getAggregateBondedTransaction = (publicAccount, item, pageSize, lastId = null) => {
      let order = Order.ASC;
      let qp = new QueryParams(pageSize, lastId, order);
      let lastTransactionID = lastId;
      siriusStore.accountHttp.aggregateBondedTransactions(publicAccount, qp).subscribe(tx => {
        if( tx.length > 0 ){
          tx.forEach((t)=>{
            let formattedTransaction = transactions.formatAggregateBondedTransaction(t, names);
            aggregateBondedTransactions.value.push(formattedTransaction);
            lastTransactionID = t.transactionInfo.id;
          });
        }
        if(tx.length == pageSize){
          // run again
          getAggregateBondedTransaction(publicAccount, item, pageSize, lastTransactionID);
        }
      }, error => {
        console.error(error);
      });
    };

    const getConfirmedAllTransactions = () => {
      const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
      const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
      wallet.accounts.forEach((item) => {
        const publicAccount = PublicAccount.createFromPublicKey(item.publicAccount.publicKey, networkType);
        getTransaction(publicAccount, item, pageSize);
        getUnconfirmedTransaction(publicAccount, item, pageSize);
        getAggregateBondedTransaction(publicAccount, item, pageSize);
      });
    };

    getConfirmedAllTransactions();

    transferEmitter.on("UPDATE_DASHBOARD", payload => {
        switch(payload.from){
          case 'confirmed':{
            // console.log(payload.from)
            // console.log(payload.transaction)
            let formattedconfirmedListenerTransaction = transactions.formatTransaction(payload.transaction, names);
            confirmedTransactions.value.push(formattedconfirmedListenerTransaction);
            // console.log('Confirmed rows after addition: ' + confirmedTransactions.value.length)
            break;
          }
          case 'unconfirmedAdded':{
            // console.log(payload.from)
            // console.log(payload.transaction)
            let formattedUnconfirmedAddedTransaction = transactions.formatTransaction(payload.transaction, names);
            unconfirmedTransactions.value.push(formattedUnconfirmedAddedTransaction);
            break;
          }
          case 'aggregateBondedAdded':{
            // console.log(payload.from);
            // console.log(payload.transaction);
            payload.transaction.innerTransactions.forEach( (innerTransaction) =>{
              if(transactions.getNameTypeTransaction(innerTransaction.type) == 'modifyMultisigAccount'){
                let formattedaggregateBondedAddedListenerTransaction = transactions.formatAggregateBondedTransaction(payload.transaction, names);
                aggregateBondedTransactions.value.push(formattedaggregateBondedAddedListenerTransaction);
              }else{
                let formattedConfirmedListenerTransaction = transactions.formatTransaction(payload.transaction, names);
                confirmedTransactions.value.push(formattedConfirmedListenerTransaction);
              }
            });
            // console.log('Aggregate bonded rows after addition: ' + confirmedTransactions.value.length)
            break;
          }
          case 'cosignatureAdded':{
            console.log(payload.from)
            console.log(payload.transaction)
            // let formattedCosignatureAddedListenerTransaction = transactions.formatTransaction(payload.transaction, names);
            // confirmedTransactions.value.push(formattedCosignatureAddedListenerTransaction);
            break;
          }
          case 'unconfirmedRemoved':{
            // console.log(payload.from)
            // console.log('Hash to remove: ' + payload.hash)
            let remaining = unconfirmedTransactions.value.filter((element) => element.hash != payload.hash);
            // console.log('after unconfirmedRemoved: ' + remaining.length);
            // unconfirmedTransactions.value = Object.assign({}, remaining);
            unconfirmedTransactions.value = remaining;
            break;
          }
          case 'aggregateBondedRemoved':{
            // console.log(payload.from)
            // console.log('Hash to remove: ' + payload.hash)
            // check on dashboarddatatable
            let remaining = unconfirmedTransactions.value.filter((element) => element.hash != payload.hash);
            // console.log('after aggregateBondedRemoved: ' + remaining.length);
            unconfirmedTransactions.value = remaining;
            // check on partialdatatable
            let partialRemaining = aggregateBondedTransactions.value.filter((element) => element.hash != payload.hash);
            // console.log('after partialAggregateBondedRemoved: ' + partialRemaining.length);
            aggregateBondedTransactions.value = partialRemaining;
            break;
          }
        }
        // getConfirmedAllTransactions();
    });

    emitter.on('CLOSE_SET_DEFAULT_ACCOUNT_MODAL', payload => {
      if(payload){
        openSetDefaultModal.value = false;
      }
    });

    return {
      copy,
      primaryAccount,
      primaryAccountBalance,
      primaryAccountName,
      confirmedTransactions,
      unconfirmedTransactions,
      aggregateBondedTransactions,
      isShowConfirmed,
      isShowUnconfirmed,
      isShowAggregateBonded,
      clickConfirmedTransaction,
      clickUnconfirmedTransaction,
      clickAggregateBondedTransactions,
      openSetDefaultModal,
    };
  }
}
</script>