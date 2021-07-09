import {
  PublicAccount,
} from 'tsjs-xpx-chain-sdk';
import { appStore } from "@/store/app";

let networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;

export class ProximaxProvider {
  // constructor() {
  // }

  createPublicAccount(publicKey) {
    return PublicAccount.createFromPublicKey(publicKey, networkType);
  }
}