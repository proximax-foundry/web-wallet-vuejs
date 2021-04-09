import {
  // Account
  Address
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
      message: 'Transaction confirmed'
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
      message: 'Transaction unconfirmed'
    });
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })

  // subscribe status
  listener.status(accountDetail).subscribe(transactionStatusError => {
    transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
      status: true,
      message: transactionStatusError
    });
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })

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
  listener.aggregateBondedAdded(accountDetail).subscribe(aggregateTransaction => {
    transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
      status: true,
      message: aggregateTransaction
    });
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })

  // aggregate bonded removed
  listener.aggregateBondedRemoved(accountDetail).subscribe(hash => {
    transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
      status: true,
      message: hash
    });
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })

  listener.cosignatureAdded(accountDetail).subscribe(cosignatureSignedTransaction => {
    transferEmitter.emit('UNCONFIRMED_NOTIFICATION', {
      status: true,
      message: cosignatureSignedTransaction
    });
  }, error => {
      console.error(error);
  }, () => {
      console.log('done.');
  })

}


export{
  transferEmitter,
  subscribeConfirmed,
  addListenerstoAccount,
}