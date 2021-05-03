import { ref, reactive } from "vue";
import {
  // Account
  Address,
  Listener,
} from "tsjs-xpx-chain-sdk";

import mitt from 'mitt';
const transferEmitter = mitt();
import { appStore } from "@/store/app";
import { siriusStore } from "@/store/sirius";
import { multiSign } from '../util/multiSignatory.js';
import { transactions } from '../util/transactions.js';

const connectorListen = ref({});

const state = reactive({
  connector: []
});

const startListening = (accounts) => {
  // console.log(location.protocol);
  accounts.forEach((account) => {
    let connect = new Listener(
      `${
        siriusStore.currentChainNode.protocol.startsWith("http:") ? "ws://" : "wss://"
        // location.protocol=='http:' ? "ws://" : "wss://"
      // }${siriusStore.currentChainNode.hostname}:${siriusStore.currentChainNode.port}`,
      }${siriusStore.currentChainNode.hostname}${siriusStore.currentChainNode.protocol.startsWith("http:")?(':'+siriusStore.currentChainNode.port):''}`,
      WebSocket
    );

    state.connector.push({listener: connect, account: account});

    state.connector.find((element) => element.account.address == account.address).listener.open().then(() => {
      enableListeners(account, connect);
    });
  });
}


const stopListening = () => {
  // console.log('Connector length before stopping: ' + state.connector.length);
  state.connector.forEach((connect) => {
    // console.log('Is connector listening: ' + connect.listener.isOpen());
    if(connect.listener.isOpen()){
      connect.listener.terminate();
    }
  });

  connectorListen.value = {};
}

// add listener to single account
const addListenerstoAccount = (account) => {
  let connect = new Listener(
    `${
      siriusStore.currentChainNode.protocol.startsWith("http:") ? "ws://" : "wss://"
      // location.protocol=='http:' ? "ws://" : "wss://"
    }${siriusStore.currentChainNode.hostname}${siriusStore.currentChainNode.protocol.startsWith("http:")?(':'+siriusStore.currentChainNode.port):''}`,
    WebSocket
  );
  state.connector.push({listener: connect, account: account});
  state.connector.find((element) => element.account.address == account.address).listener.open().then(() => {
    enableListeners(account, connect);
  });
}

const checkListener = () => {
  state.connector.forEach((connect) => {
    // console.log('Connector for ' + connect.account.address + ': ' + connect.listener.isOpen());
    // console.log(connect.listener);
    if(!connect.listener.isOpen()){
      // console.log('open connect again for ' + connect.account.address);
      connect.listener.open();
    }
  });
}



setInterval(() => {
  // console.log('Num of connectors: ' + state.connector.length);
  if(state.connector.length > 0){
    // console.log('Checking connection every 10 sec');
    checkListener();
  }
}, 10000);


function enableListeners(account, listener){
  // console.log('Connector for ' + account.address + ': ' + listener.isOpen());
  const accountDetail = Address.createFromPublicKey(account.publicAccount.publicKey, account.network);
  // newBlockListener(accountDetail, listener);
  console.log(accountDetail);
  confirmedListener(accountDetail, listener);
  unconfirmedListener(accountDetail, listener);
  statusListener(accountDetail, listener);
  unconfirmedRemovedListener(accountDetail, listener);
  aggregateBondedAddedListener(accountDetail, listener);
  aggregateBondedRemovedListener(accountDetail, listener);
  cosignatureAddedListener(accountDetail, listener);
}

// subscribe new block
// eslint-disable-next-line no-unused-vars
const newBlockListener = (accountDetail, listener) => {
  // eslint-disable-next-line no-unused-vars
  listener.newBlock().subscribe(blockInfo => {
    console.log('Confirmed new block ' + blockInfo)
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })
}

// transaction confirmed
const confirmedListener = (accountDetail, listener) => {
  listener.confirmed(accountDetail).subscribe((transaction) => {
    console.log('Confirmed notification ' + accountDetail.address)
    console.log(transaction)
    transferEmitter.emit('CONFIRMED_NOTIFICATION', {
      status: true,
      message: 'Transaction confirmed',
      notificationType: 'noti'
    });
    // check to list multisig account
    if(transactions.getNameTypeTransaction(transaction.type) == 'aggregateBonded'){
      const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
      let cosigneeCheck = false;
      transaction.cosignatures.forEach((cosignee) => {
        console.log(cosignee.signer.address.address);
        const account = wallet.accounts.find((element) => element.address == cosignee.signer.address.address);
        console.log(account);
        if(account){
          cosigneeCheck = true;
        }
      });
      if(cosigneeCheck){
        transaction.innerTransactions.forEach((innerTransaction) => {
          if(transactions.getNameTypeTransaction(innerTransaction.type) == 'modifyMultisigAccount'){
            // create multisig account
            console.log('List multisign account into wallet');
            multiSign.createNewMultiSigAccount(transaction.signer);
            // update multisign info on all accounts
            multiSign.updateAccountsMultiSign(appStore.state.currentLoggedInWallet.name);
          }
        });
      }
    }
    transferEmitter.emit('UPDATE_DASHBOARD', {
      status: true,
      from: 'confirmed',
      // transaction: Object.assign({}, transaction),
      transaction: transaction,
    });
    appStore.updateXPXBalance(appStore.state.currentLoggedInWallet.name, siriusStore);
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })
}

// transaction unconfirmed
const unconfirmedListener = (accountDetail, listener) => {
  listener.unconfirmedAdded(accountDetail).subscribe((transaction) => {
    console.log('Unconfirmed notification ' + accountDetail.address);
    if(transactions.getNameTypeTransaction(transaction.type) != 'aggregateBonded'){
      transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
        status: true,
        message: 'Transaction unconfirmed',
        notificationType: 'noti'
      });
      transferEmitter.emit('UPDATE_DASHBOARD', {
        status: true,
        from: 'unconfirmedAdded',
        transaction: Object.assign({}, transaction),
      });
    }
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })
}

// subscribe status
const statusListener = (accountDetail, listener) => {
  listener.status(accountDetail).subscribe(transactionStatusError => {
    console.log('status listener');
    console.log(transactionStatusError);
    transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
      status: true,
      message: transactionStatusError,
      notificationType: 'noti'
    });
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })
}

// Unconfirmed removed
const unconfirmedRemovedListener = (accountDetail, listener) => {
  listener.unconfirmedRemoved(accountDetail).subscribe(hash => {
    console.log('Unconfirmed removed: ' + hash + ' ' + accountDetail.address);
    transferEmitter.emit('UPDATE_DASHBOARD', {
      status: true,
      from: 'unconfirmedRemoved',
      hash: hash,
    });
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })
}

// partially added
const aggregateBondedAddedListener = (accountDetail, listener) => {
  listener.aggregateBondedAdded(accountDetail).subscribe(aggregateTransaction => {
    // console.log('Emitting from aggregateBondedAddedListener ');
    // console.log(aggregateTransaction);
    // choose btw aggregateBondedAdded to partialdatatable or unconfirmedAdded to dashboarddatatable
    let innerTransactions = aggregateTransaction.innerTransactions;
    let innerTransactionType, message;
    innerTransactions.forEach( (innerTransaction) =>{
      if(transactions.getNameTypeTransaction(innerTransaction.type) == 'modifyMultisigAccount'){
        innerTransactionType = 'aggregateBondedAdded';
        message = 'Transaction aggregate bonded added';
      }else{
        innerTransactionType = 'unconfirmedAdded';
        message = 'Transaction unconfirmed';
      }
    });
    transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
      status: true,
      message: message,
      notificationType: 'noti'
    });
    transferEmitter.emit('UPDATE_DASHBOARD', {
      status: true,
      from: innerTransactionType,
      // transaction: Object.assign({}, aggregateTransaction),
      transaction: aggregateTransaction,
    });
    multiSign.updateAccountsMultiSign(appStore.state.currentLoggedInWallet.name);
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })
}

// aggregate bonded removed
const aggregateBondedRemovedListener = (accountDetail, listener) => {
  listener.aggregateBondedRemoved(accountDetail).subscribe(hash => {
    console.log('Aggregate bonded removed: ' + hash + ' ' + accountDetail.address);
    transferEmitter.emit('UPDATE_DASHBOARD', {
      status: true,
      from: 'aggregateBondedRemoved',
      hash: hash,
    });
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })
}

const cosignatureAddedListener = (accountDetail, listener) => {
  // eslint-disable-next-line no-unused-vars
  listener.cosignatureAdded(accountDetail).subscribe(cosignatureSignedTransaction => {
    transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
      status: true,
      message: 'Cosignature added',
      notificationType: 'noti'
    });
    // update viewconvertaccountmultisig
    transferEmitter.emit('ANNOUNCE_COSIGNITURE_ADDED', {
      status: true,
    });
    transferEmitter.emit('UPDATE_DASHBOARD', {
      status: true,
      from: 'cosignatureAdded',
      transaction: Object.assign({}, cosignatureSignedTransaction),
    });
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })
}

async function announceLockfundAndWaitForConfirmation(senderAddress, signedLockFundsTransaction, lockHash, transactionHttp){
  return new Promise((resolve, reject) => {
    const announceLockfundListener = siriusStore.chainWSListener;
    announceLockfundListener.open().then(() => {
      const txStatus = announceLockfundListener.status(senderAddress).subscribe(txStatusError => {
        if (txStatusError.hash === lockHash) {
          console.error('Lockfund status (' + lockHash + ') error: ' + txStatusError.status);
          if (txConfirmed) {
            txConfirmed.unsubscribe();
          }
          if (txStatus) {
            txStatus.unsubscribe();
          }
          announceLockfundListener.close();
          reject(txStatusError.status);
        }
      });

      const txConfirmed = announceLockfundListener.confirmed(senderAddress).subscribe(confirmedTx => {
        if (confirmedTx && confirmedTx.transactionInfo && confirmedTx.transactionInfo.hash === lockHash) {
          console.log('Lockfund (' + lockHash + ') confirmed at height: ' + confirmedTx.transactionInfo.height.compact());
          if (txConfirmed) {
            txConfirmed.unsubscribe();
          }
          if (txStatus) {
            txStatus.unsubscribe();
          }
          announceLockfundListener.close();
          resolve(confirmedTx);
        }
      }, error => {
        console.error('Lockfund confirmation (' + lockHash + ') subscription failed: ' + error);
        if (txConfirmed) {
          txConfirmed.unsubscribe();
        }
        if (txStatus) {
          txStatus.unsubscribe();
        }
        announceLockfundListener.close();
        reject(error);
      });

      transactionHttp.announce(signedLockFundsTransaction).subscribe(
          // eslint-disable-next-line no-unused-vars
          (message)=>{
              console.log('Lockfund transaction (' + lockHash + ') announced');
              transferEmitter.emit('CONFIRMED_NOTIFICATION', {
                status: true,
                message: 'Lockfund transaction announced',
                notificationType: 'noti'
              });
              appStore.updateXPXBalance(appStore.state.currentLoggedInWallet.name, siriusStore);
          },
          (error)=>{
              console.log(error);
              if (txConfirmed) {
                  txConfirmed.unsubscribe();
              }
              if (txStatus) {
                  txStatus.unsubscribe();
              }
              reject(error);
          }
      );

    }).catch(reason => {
      console.error('Lockfund transaction (' + lockHash + ') listener exception caught: ' + reason);
      announceLockfundListener.terminate();
      reject(reason);
    });
  });
}

async function announceAggregateBonded(senderAddress, aggBondTx, aggBondHash, txConfirmed, transactionHttp){
  return new Promise((resolve, reject) => {
    const announceAggregateBondedListener = siriusStore.chainWSListener;
    announceAggregateBondedListener.open().then(() => {
      const txStatus = announceAggregateBondedListener.status(senderAddress).subscribe(txStatusError => {
        if (txStatusError.hash === aggBondHash) {
          console.error('Aggregate status (' + aggBondHash + ') error: ' + txStatusError.status);
          if (partialAdded) {
            partialAdded.unsubscribe();
          }
          if (txStatus) {
            txStatus.unsubscribe();
          }
          announceAggregateBondedListener.close();
          reject(txStatusError.status);
        }
      });

      const partialAdded = announceAggregateBondedListener.aggregateBondedAdded(senderAddress).subscribe(aggTransaction => {
        if (aggTransaction && aggTransaction.transactionInfo && aggTransaction.transactionInfo.hash === aggBondHash) {
          console.log('Aggregate bonded transaction (' + aggBondHash + ') added');
          if (partialAdded) {
            partialAdded.unsubscribe();
          }
          if (txStatus) {
            txStatus.unsubscribe();
          }
          announceAggregateBondedListener.close();
          resolve(aggTransaction);
        }
      }, error => {
        console.error('Aggregate bonded transaction (' + aggBondHash + ') subscription failed: ' + error);
        if (partialAdded) {
          partialAdded.unsubscribe();
        }
        if (txStatus) {
          txStatus.unsubscribe();
        }
        announceAggregateBondedListener.close();
        reject(error);
      });

      transactionHttp.announceAggregateBonded(aggBondTx).subscribe(
        // eslint-disable-next-line no-unused-vars
        (message)=>{
          transferEmitter.emit('CONFIRMED_NOTIFICATION', {
            status: true,
            message: 'Aggregate transaction announced',
            notificationType: 'noti'
          });
          transferEmitter.emit('ANNOUNCE_AGGREGATE_BONDED', {
            status: true,
          });
          console.log('Aggregate transaction (' + aggBondHash + ') announced');
        }, 
        (error)=>{
          console.log(error);
          if (txConfirmed) {
              txConfirmed.unsubscribe();
          }
          if (txStatus) {
              txStatus.unsubscribe();
          }
          reject(error);
        }
      );

    }).catch(reason => {
      console.error('Aggregate bonded transaction (' + aggBondHash + ') listener exception caught: ' + reason);
      announceAggregateBondedListener.terminate();
      reject(reason);
    });
  });
}


export{
  transferEmitter,
  startListening,
  stopListening,
  addListenerstoAccount,
  announceAggregateBonded,
  announceLockfundAndWaitForConfirmation,
}