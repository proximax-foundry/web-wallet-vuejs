<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('common.transactions',2)}} ></span> <span class="text-blue-primary font-bold">{{$t('common.partial')}}</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices'}" class="font-bold">{{$t('common.allServices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line pt-10 px-20'>
    <PartialDashboardDataTable :transactions="aggregateBondedTransactions.sort((a, b) => b.deadline - a.deadline)"></PartialDashboardDataTable>
  </div>
</template>
<script>
import { inject, ref } from "vue";
import PartialDashboardDataTable from '@/components/PartialDashboardDataTable.vue';
import { PublicAccount, Order, QueryParams } from "tsjs-xpx-chain-sdk";
import { transactions } from '@/util/transactions.js';
import { transferEmitter } from '@/util/listener.js';

export default {
  name: 'ViewServicesExplorerPartial',
  components: {
    PartialDashboardDataTable,
  },

  setup() {
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const pageSize = 10;

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

    const aggregateBondedTransactions = ref([]);
       const getAggregateBondedTransaction = (publicAccount, item, pageSize, lastId = null) => {
      let order = Order.ASC;
      let qp = new QueryParams(pageSize, lastId, order);
      let lastTransactionID = lastId;
      siriusStore.accountHttp.aggregateBondedTransactions(publicAccount, qp).subscribe(tx => {
        // console.log('AggregateBonded - partial length: ' + tx.length);
        if( tx.length > 0 ){
          tx.forEach((t)=>{
            // console.log(t)
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

    const getPartialTransactions = () => {
      const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
      const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
      wallet.accounts.forEach((item) => {
        const publicAccount = PublicAccount.createFromPublicKey(item.publicAccount.publicKey, networkType);
        getAggregateBondedTransaction(publicAccount, item, pageSize);
      });
    };

    getPartialTransactions();

    transferEmitter.on("UPDATE_DASHBOARD", payload => {
      switch(payload.from){
        case 'aggregateBondedAdded':{
          // console.log(payload.from);
          // console.log(payload.transaction);
          payload.transaction.innerTransactions.forEach( (innerTransaction) =>{
            if(transactions.getNameTypeTransaction(innerTransaction.type) == 'modifyMultisigAccount'){
              let formattedaggregateBondedAddedListenerTransaction = transactions.formatAggregateBondedTransaction(payload.transaction, names);
              aggregateBondedTransactions.value.push(formattedaggregateBondedAddedListenerTransaction);
            }
          });
          // console.log('Aggregate bonded rows after addition: ' + confirmedTransactions.value.length)
          break;
        }
        case 'aggregateBondedRemoved':{
          // check on partialdatatable
          let partialRemaining = aggregateBondedTransactions.value.filter((element) => element.hash != payload.hash);
          // console.log('after partialAggregateBondedRemoved: ' + partialRemaining.length);
          aggregateBondedTransactions.value = partialRemaining;
          break;
        }
      }
    });

    return {
      aggregateBondedTransactions,
    };
  },
}
</script>
