import { ref, reactive } from "vue";
import {
  // Account
  Address,
  Listener,
} from "tsjs-xpx-chain-sdk";

import mitt from 'mitt';
const transferEmitter = mitt();
import { appStore } from "@/store/app";
import { siriusStore, chainNetwork } from "@/store/sirius";
import { multiSign } from '../util/multiSignatory.js';
import { transactions } from '../util/transactions.js';

const connectorListen = ref({});

const state = reactive({
  connector: []
});

const startListening = (accounts) => {
  // console.log(location.protocol);
  accounts.forEach((account) => {
    let connect = new Listener(chainNetwork.buildWSEndpointURL(siriusStore.state.selectedChainNode), WebSocket);
    state.connector.push({listener: connect, account: account});
    state.connector.find((element) => element.account.address == account.address).listener.open().then(() => {
      enableListeners(account, connect);
    });
  });
  let connect_block = new Listener(chainNetwork.buildWSEndpointURL(siriusStore.state.selectedChainNode), WebSocket);
  state.connector.push({listener: connect_block, type: 'Bridge'});
  state.connector.find((element) => element.type === 'Bridge').listener.open().then(() => {
    newBlockListener(connect_block);
  });
}


const stopListening = () => {
  // console.log('Connector length before stopping: ' + state.connector.length);
  state.connector.forEach((connect) => {
    // console.log(connect)
    // console.log('Is connector listening: ' + connect.listener.isOpen());
    if(connect.listener.isOpen()){
      connect.listener.close();
      connect.listener.terminate();
    }
  });
  state.connector = [];

  connectorListen.value = {};
}

// add listener to single account
const addListenerstoAccount = (account) => {
  let connect = new Listener(chainNetwork.buildWSEndpointURL(siriusStore.state.selectedChainNode), WebSocket);
  state.connector.push({listener: connect, account: account});
  state.connector.find((element) => (element.account != undefined)?(element.account.address == account.address):'').listener.open().then(() => {
    enableListeners(account, connect);
  });
}

const checkListener = () => {
  state.connector.forEach((connect) => {
    if(!connect.listener.isOpen()){
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
const newBlockListener = (listener) => {
  // console.log(listener);
  // eslint-disable-next-line no-unused-vars
  listener.newBlock().subscribe(blockInfo => {
    chainNetwork.updateBlockHeight(blockInfo);
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
    const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
    // console.log(transaction)
    transferEmitter.emit('CONFIRMED_NOTIFICATION', {
      status: true,
      message: 'Transaction confirmed',
      notificationType: 'noti'
    });
    // check to list multisig account
    if(transactions.getNameTypeTransaction(transaction.type) == 'aggregateBonded'){
      let cosigneeCheck = false;
      transaction.cosignatures.forEach((cosignee) => {
        // console.log(cosignee.signer.address.address);
        const account = wallet.accounts.find((element) => element.address == cosignee.signer.address.address);
        // console.log(account);
        if(account){
          cosigneeCheck = true;
        }
      });
      if(cosigneeCheck){
        transaction.innerTransactions.forEach((innerTran) => {
          if(transactions.getNameTypeTransaction(innerTran.type) == 'modifyMultisigAccount'){
            // create multisig account
            // console.log('List multisign account into wallet');
            multiSign.createNewMultiSigAccount(innerTran.signer);
            // update multisign info on all accounts
            // multiSign.updateAccountsMultiSign(appStore.state.currentLoggedInWallet.name);
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
    // update multisign info on all accounts
    multiSign.updateAccountsMultiSign(appStore.state.currentLoggedInWallet.name);
    // clean wallet from removed multisig account of cosigners
    multiSign.removeUnrelatedMultiSig(appStore.state.currentLoggedInWallet.name);
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })
}

// transaction unconfirmed
// eslint-disable-next-line no-unused-vars
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
// eslint-disable-next-line no-unused-vars
const statusListener = (accountDetail, listener) => {
  listener.status(accountDetail).subscribe(transactionStatusError => {
    // console.log('status listener');
    // console.log(transactionStatusError);
    transferEmitter.emit('STATUS_NOTIFICATION', {
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
// eslint-disable-next-line no-unused-vars
const unconfirmedRemovedListener = (accountDetail, listener) => {
  listener.unconfirmedRemoved(accountDetail).subscribe(hash => {
    // console.log('Unconfirmed removed: ' + hash + ' ' + accountDetail.address);
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
// eslint-disable-next-line no-unused-vars
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
// eslint-disable-next-line no-unused-vars
const aggregateBondedRemovedListener = (accountDetail, listener) => {
  listener.aggregateBondedRemoved(accountDetail).subscribe(hash => {
    // console.log('Aggregate bonded removed: ' + hash + ' ' + accountDetail.address);
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

// eslint-disable-next-line no-unused-vars
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
          // console.log('Lockfund (' + lockHash + ') confirmed at height: ' + confirmedTx.transactionInfo.height.compact());
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
        // console.error('Lockfund confirmation (' + lockHash + ') subscription failed: ' + error);
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
              // console.log('Lockfund transaction (' + lockHash + ') announced');
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
      // console.error('Lockfund transaction (' + lockHash + ') listener exception caught: ' + reason);
      announceLockfundListener.terminate();
      reject(reason);
    });
  });
}

function announceAggregateBonded(senderAddress, aggBondTx, aggBondHash, txConfirmed, transactionHttp){
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
        // console.error('Aggregate bonded transaction (' + aggBondHash + ') subscription failed: ' + error);
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
      // console.error('Aggregate bonded transaction (' + aggBondHash + ') listener exception caught: ' + reason);
      announceAggregateBondedListener.terminate();
      reject(reason);
    });
  });
}

async function modifyMultisigAnnounceLockfundAndWaitForConfirmation(announceLockfundListener, senderAddress, signedLockFundsTransaction, lockHash, transactionHttp){
  return new Promise((resolve, reject) => {
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
      // console.error('Lockfund transaction (' + lockHash + ') listener exception caught: ' + reason);
      announceLockfundListener.terminate();
      reject(reason);
    });
  });
}

function modifyMultisigAnnounceAggregateBonded(announceAggregateBondedListener, senderAddress, aggBondTx, aggBondHash, txConfirmed, transactionHttp){
  return new Promise((resolve, reject) => {
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
          // console.log('Aggregate bonded transaction (' + aggBondHash + ') added');
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
        // console.error('Aggregate bonded transaction (' + aggBondHash + ') subscription failed: ' + error);
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
          // console.log('Aggregate transaction (' + aggBondHash + ') announced');
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
      // console.error('Aggregate bonded transaction (' + aggBondHash + ') listener exception caught: ' + reason);
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
  modifyMultisigAnnounceLockfundAndWaitForConfirmation,
  modifyMultisigAnnounceAggregateBonded,
}