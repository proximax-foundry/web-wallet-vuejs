<template>
  <div class="md:grid md:grid-cols-2 mb-8">
    <div class="w-full text-center md:text-left mx-0 lg:mx-5">
      <div class="font-bold hover:bg-gray-100 cursor-pointer inline-block py-1 px-2 pl-0 rounded-lg" @click="openSetDefaultModal = !openSetDefaultModal"><font-awesome-icon icon="caret-down" class="h-5 w-5 text-gray-600 inline-block"></font-awesome-icon>&nbsp;{{ primaryAccountName }} <div class="text-xs font-normal ml-1 inline-block px-2 py-1 rounded bg-yellow-200">Default</div></div>
      <div class="text-xs mb-2">
        <div class="relative inline-block overflow-x-hidden address_div">
          <div class="absolute z-20 h-full"></div>
          <input
            id="address"
            class=" outline-none z-10 break-all"
            type="text"
            :value="primaryAccount"
          />
        </div>
        <div class="mt-2 sm:inline-block relative">
          <font-awesome-icon icon="copy" @click="copy('address')" class="w-5 h-5 text-gray-500 text-md cursor-pointer inline mx-2" style="top: 3px;"></font-awesome-icon><img src="@/modules/dashboard/img/icon-qr-code.svg" class="w-5 inline absolute">
        </div>
      </div>
      <div class="text-center md:text-left">
        <div class="inline-block mr-4"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 h-5 inline mr-1"><span class="text-xs">{{ primaryAccountBalance }} XPX</span></div>
        <div class="inline-block"><img src="@/assets/img/icon-usd-blue.svg" class="w-5 inline mr-1"><span class="text-xs">USD {{ currencyConvert }}</span></div>
      </div>
    </div>
    <div class="w-full mt-5 md:mt-0">
      <div class="text-md text-center sm:text-right lg:text-left">Transactions: <span>{{ confirmedTransactions.length + unconfirmedTransactions.length }}</span></div>
      <div class="xs:text-center sm:text-right lg:text-left">
        <div class="mt-2">
          <div class="rounded-full bg-blue-primary text-white w-24 h-15 px-2 py-1 mr-3 inline-block" :class="confirmedTransactions.length>0?'cursor-pointer':''" @click="clickConfirmedTransaction()">
            <div class="flex justify-between">
              <div class="rounded-full text-white border pt-1 pl-1 w-6 h-6 relative"><font-awesome-icon icon="check" class="w-4 h-3 absolute" style="top: 6px;"></font-awesome-icon></div>
              <div class="text-xs font-bold flex items-center">{{ confirmedTransactions.length }}</div>
            </div>
          </div>
          <div class="rounded-full bg-blue-300 text-white w-24 h-15 px-2 py-1 mr-3 inline-block" :class="unconfirmedTransactions.length>0?'cursor-pointer':''" @click="clickUnconfirmedTransaction()">
            <div class="flex justify-between">
              <div class="rounded-full text-white border pt-1 pl-1 w-6 h-6 relative"><font-awesome-icon icon="exclamation" class="w-4 h-3 absolute" style="left: 8px; top: 6px;"></font-awesome-icon></div>
              <div class="text-xs font-bold flex items-center">{{ unconfirmedTransactions.length }}</div>
            </div>
          </div>
          <div class="rounded-full bg-yellow-500 text-white w-24 h-15 px-2 py-1 inline-block" :class="aggregateBondedTransactions.length>0?'cursor-pointer':''" @click="clickAggregateBondedTransactions()">
            <div class="flex justify-between">
              <img src="@/modules/dashboard/img/icon-transaction-partial-white.svg" class="w-6 h-6" />
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

<script lang="ts">
import { computed, defineComponent, ref, getCurrentInstance, watch } from 'vue';
import DashboardDataTable from '@/modules/dashboard/components/DashboardDataTable.vue';
import PartialDashboardDataTable from '@/components/PartialDashboardDataTable.vue';
import SetAccountDefaultModal from '@/modules/dashboard/components/SetAccountDefaultModal.vue';
import { copyKeyFunc, currencyconverter } from '@/util/functions';
import { transactions } from '@/util/transactions.js';
// eslint-disable-next-line no-unused-vars
import { PublicAccount, Order, QueryParams } from "tsjs-xpx-chain-sdk";
import { transferEmitter } from '@/util/listener.js';
import { useToast } from "primevue/usetoast";
import { Wallet } from "@/models/wallet";
import { walletState } from '@/state/walletState';
import { ChainUtils } from '@/util/chainUtils';
import { networkState } from "@/state/networkState";
import { AccountAPI } from '@/models/REST/account';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
// import { dashboardUtils } from '@/util/dashboardUtils';
// import { ConfirmedTransaction, UnconfirmedTransaction, AggregateBondedTransaction, contactInterface } from '@/models/interface/transaction';


export default defineComponent({
  name: 'ViewDashboard',
  components: {
    DashboardDataTable,
    PartialDashboardDataTable,
    SetAccountDefaultModal,
  },

  setup(){
    const toast = useToast();
    // const appStore = inject("appStore");
    // const siriusStore = inject("siriusStore");
    // const chainNetwork = inject("chainNetwork");
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance?.appContext.config.globalProperties.emitter;

    const openSetDefaultModal = ref(false);

    const copy = (id) => copyKeyFunc(id);
    const primaryAccount = computed(
      () => {
        // if (appStore.state.currentLoggedInWallet) {
        //   return appStore.pretty(appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).address);
        // }else{
        //   return 0;
        // }
        if (walletState.currentLoggedInWallet) {
          let wallet = new Wallet(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletState.currentLoggedInWallet.accounts);
          return wallet.selectDefaultAccount.name;
        }else{
          return '';
        }
      }
    );

    const primaryAccountBalance = computed(
      () => {          
        return '[balance]';
      }
    );

    const primaryAccountName = computed(
      () => {
        return '[name]';
      }
    );

    // get USD conversion
    const currencyConvert = ref('0');
    const getCurrencyConvert = () => {
      currencyConvert.value = '[total.toFixed(6)]';
    };
    getCurrencyConvert();
    // watch(primaryAccountBalance, () => {
    //   let balance = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).balance;
    //   currencyconverter(balance).then((total) => {
    //     currencyConvert.value = total.toFixed(6);
    //   });
    // });

    

    // const confirmedTransactions = ref<ConfirmedTransaction[]>([]);
    // const unconfirmedTransactions = ref<UnconfirmedTransaction[]>([]);
    // const aggregateBondedTransactions = ref<AggregateBondedTransaction[]>([]);
    // const pageSize:number = 10;
    // const isShowConfirmed = ref(true);
    // const isShowUnconfirmed = ref(false);
    // const isShowAggregateBonded = ref(false);

    // const clickConfirmedTransaction = () => {
    //   isShowConfirmed.value = true;
    //   isShowUnconfirmed.value = false;
    //   isShowAggregateBonded.value = false;
    // };

    // const clickUnconfirmedTransaction = () => {
    //   if(unconfirmedTransactions.value.length > 0){
    //     isShowUnconfirmed.value = true;
    //     isShowConfirmed.value = false;
    //     isShowAggregateBonded.value = false;
    //   }
    // };

    // const clickAggregateBondedTransactions = () => {
    //   if(aggregateBondedTransactions.value.length > 0){
    //     isShowAggregateBonded.value = true;
    //     isShowConfirmed.value = false;
    //     isShowUnconfirmed.value = false;
    //   }
    // };

    // const generateNames = () => {
    //   // let wallet = new Wallet(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletState.currentLoggedInWallet.accounts);
    //   if (walletState.currentLoggedInWallet) {

    //     let contact : Array<contactInterface> = [];
    //     var accountCount = walletState.currentLoggedInWallet.accounts.length;
    //     walletState.currentLoggedInWallet.accounts.forEach((element, index) => {
    //       contact.push({
    //         address: element.address,
    //         name: element.name + ' - Owner\'s account',
    //         id: (index + 1),
    //       });
    //     });
    //     if(walletState.currentLoggedInWallet.contacts!=undefined){
    //       walletState.currentLoggedInWallet.contacts.forEach((element, index) => {
    //         contact.push({
    //           address: element.address,
    //           name: element.name + ' - Contact',
    //           id: (accountCount + index + 1),
    //         });
    //       });
    //     }
    //     return contact;
    //   }else{
    //     return '';
    //   }
    // };
    // let names = generateNames();

    // let accountApiInstance = new AccountAPI(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint));

    // const getTransaction = (publicAccount, item, pageSize:number, lastId:string = '') => {
    //   let order = Order.ASC;
    //   let qp = new QueryParams(pageSize, lastId, order);
    //   let lastTransactionID = lastId;
    //   // format names
    //   accountApiInstance.transactions(publicAccount, qp).then(tx => {
    //     if( tx.length > 0 ){
    //       tx.forEach((t)=>{
    //         let formattedTransaction = dashboardUtils.formatTransaction(t, names);
    //         confirmedTransactions.value.push(formattedTransaction);
    //         // lastTransactionID = t.transactionInfo.id;
    //         lastTransactionID = null;
    //       })
    //     }
    //     if(tx.length == pageSize){
    //       // run again
    //       getTransaction(publicAccount, item, pageSize, lastTransactionID);
    //     }
    //   }, error => {
    //     console.error(error);
    //   });
    // };

    // const getUnconfirmedTransaction = (publicAccount, item, pageSize, lastId = null) => {
    //   let order = Order.ASC;
    //   let qp = new QueryParams(pageSize, lastId, order);
    //   let lastTransactionID = lastId;
    //   accountApiInstance.unconfirmedTransactions(publicAccount, qp).then(tx => {
    //     if( tx.length > 0 ){
    //       tx.forEach((t)=>{
    //         let formattedTransaction = dashboardUtils.formatTransaction(t, names);
    //         unconfirmedTransactions.value.push(formattedTransaction);
    //         // lastTransactionID = t.transactionInfo.id;
    //         lastTransactionID = null;
    //       })
    //     }
    //     if(tx.length == pageSize){
    //       // run again
    //       getUnconfirmedTransaction(publicAccount, item, pageSize, lastTransactionID);
    //     }
    //   }, error => {
    //     console.error(error);
    //   });
    // };

    // const getAggregateBondedTransaction = (publicAccount, item, pageSize, lastId = null) => {
    //   let order = Order.ASC;
    //   let qp = new QueryParams(pageSize, lastId, order);
    //   let lastTransactionID = lastId;
    //   accountApiInstance.aggregateBondedTransactions(publicAccount, qp).then(tx => {
    //     // console.log('AggregateBonded - partial length: ' + tx.length);
    //     if( tx.length > 0 ){
    //       tx.forEach((t)=>{
    //         // console.log(t)
    //         let formattedTransaction = dashboardUtils.formatAggregateBondedTransaction(t, names);
    //         aggregateBondedTransactions.value.push(formattedTransaction);
    //         lastTransactionID = t.transactionInfo.id;
    //       });
    //     }
    //     if(tx.length == pageSize){
    //       // run again
    //       getAggregateBondedTransaction(publicAccount, item, pageSize, lastTransactionID);
    //     }
    //   }, error => {
    //     console.error(error);
    //   });
    // };

    // // eslint-disable-next-line no-unused-vars
    // const getConfirmedAllTransactions = () => {
    //   walletState.currentLoggedInWallet.accounts.forEach((item) => {
    //     const publicAccount = PublicAccount.createFromPublicKey(item.publicAccount.publicKey, ChainUtils.getNetworkType(networkState.chainNetwork));
    //     getTransaction(publicAccount, item, pageSize);
    //     getUnconfirmedTransaction(publicAccount, item, pageSize);
    //     getAggregateBondedTransaction(publicAccount, item, pageSize);
    //   });
    // };

    // getConfirmedAllTransactions();

    /*transferEmitter.on("UPDATE_DASHBOARD", payload => {
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
    });*/

    return {
      copy,
      primaryAccount,
      primaryAccountBalance,
      primaryAccountName,
      // confirmedTransactions,
      // unconfirmedTransactions,
      // aggregateBondedTransactions,
      // isShowConfirmed,
      // isShowUnconfirmed,
      // isShowAggregateBonded,
      // clickConfirmedTransaction,
      // clickUnconfirmedTransaction,
      // clickAggregateBondedTransactions,
      openSetDefaultModal,
      currencyConvert,
    };
  }
});
</script>
<style lang="scss" scoped>
.address_div{
    top: 4px;
}

#address{
  width: 350px;
  @apply text-xs;
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
    width: 480px;
    @apply text-sm;
  }
}

</style>