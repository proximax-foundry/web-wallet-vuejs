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
    accounts.forEach((account) => {
      const accountDetail = Address.createFromPublicKey(account.publicAccount.publicKey, account.network)
      listener.confirmed(accountDetail).subscribe(() => {  // (transaction)
        transferEmitter.emit('TRANSACTION_CONFIRMED_NOTIFICATION', true);
        appStore.updateXPXBalance(appStore.state.currentLoggedInWallet.name, siriusStore);
      }, error => {
          console.error(error);
      }, () => {
          console.log('done.');
      })
    });
  });
}

//isOpen()

export{
  transferEmitter,
  subscribeConfirmed,
}