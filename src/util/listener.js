import {
  // Account
  Address,
} from "tsjs-xpx-chain-sdk";

import mitt from 'mitt';
const transferEmitter = mitt();
import { appStore } from "@/store/app";
import { siriusStore } from "@/store/sirius";

const listener = siriusStore.chainWSListener;

/* address: address.address, address:network */
// const subscribeConfirmed = (address, appStore, siriusStore) => {

//   console.log(address);
//   listener.open().then(() => {
//     listener.confirmed(address).subscribe(() => {  // (transaction)
//       console.log('Transaction')
//       // console.log(JSON.stringify(transaction));
//       transferEmitter.emit('TRANSACTION_CONFIRMED_NOTIFICATION', true);
//       appStore.updateXPXBalance(appStore.state.currentLoggedInWallet.name, siriusStore);
//     }, error => {
//         console.error(error);
//     }, () => {
//         console.log('done.');
//     })
//   });
// }

const subscribeConfirmed = (accounts) => {

  listener.open().then(() => {

    // subscribe new block
    // listener.newBlock().subscribe(blockInfo => {
    //   transferEmitter.emit('CONFIRMED_NOTIFICATION', {
    //     status: true,
    //     message: 'Subscribe new block ' + blockInfo
    //   });
    // }, error => {
    //     console.error(error);
    // }, () => {
    //     console.log('done.');
    // })

    accounts.forEach((account) => {
      enableListeners(account);
    });
  });
}

const addListenerstoAccount = (account) => {
  enableListeners(account);
}

//isOpen()

function enableListeners(account){
  const accountDetail = Address.createFromPublicKey(account.publicAccount.publicKey, account.network)

  // transaction confirmed
  listener.confirmed(accountDetail).subscribe(() => {  // (transaction)
    transferEmitter.emit('CONFIRMED_NOTIFICATION', {
      status: true,
      message: 'Transaction confirmed',
      notificationType: 'noti'
    });
    appStore.updateXPXBalance(appStore.state.currentLoggedInWallet.name, siriusStore);
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })

  // transaction unconfirmed
  listener.unconfirmedAdded(accountDetail).subscribe(() => {
    // console.log(JSON.stringify(transaction));
    transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
      status: true,
      message: 'Transaction unconfirmed',
      notificationType: 'noti'
    });
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })

  // subscribe status
  // listener.status(accountDetail).subscribe(transactionStatusError => {
  //   transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
  //     status: true,
  //     message: transactionStatusError,
  //     notificationType: 'noti'
  //   });
  // }, error => {
  //     console.error(error);
  // }, () => {
  //     console.log('done.');
  // })

  // Unconfirmed removed
  // listener.unconfirmedRemoved(accountDetail).subscribe(hash => {
  //   transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
  //     status: true,
  //     message: hash
  //   });
  // }, error => {
  //     console.error(error);
  // }, () => {
  //     console.log('done.');
  // })

  // partially added
  // listener.aggregateBondedAdded(accountDetail).subscribe(aggregateTransaction => {
  //   transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
  //     status: true,
  //     message: aggregateTransaction,
  //     notificationType: 'noti'
  //   });
  // }, error => {
  //     console.error(error);
  // }, () => {
  //     console.log('done.');
  // })

  // aggregate bonded removed
  listener.aggregateBondedRemoved(accountDetail).subscribe(hash => {
    transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
      status: true,
      message: hash,
      notificationType: 'noti'
    });
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })

  listener.cosignatureAdded(accountDetail).subscribe(cosignatureSignedTransaction => {
    transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
      status: true,
      message: cosignatureSignedTransaction,
      notificationType: 'noti'
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
  subscribeConfirmed,
  addListenerstoAccount,
  announceAggregateBonded,
  announceLockfundAndWaitForConfirmation,
}