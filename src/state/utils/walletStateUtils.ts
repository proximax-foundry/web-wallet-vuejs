import { walletState } from "../walletState";
import { Wallets } from "../../models/wallets"
import { WalletAccount } from "../../models/walletAccount";
import { SessionService } from "../../models/stores/sessionService"

const sessionWalletKey = "loggedInWallet";

export class WalletStateUtils{

  static refreshWallets(){
    walletState.wallets = new Wallets();
  }

  static updateLoggedIn(wallet: WalletAccount){
    walletState.currentLoggedInWallet = wallet;
    walletState.isLogin = true;
    SessionService.setObject(sessionWalletKey, wallet);
  }

  static checkWalletUpdate(){
    if(walletState.wallets.isWalletOutdated())
      walletState.wallets = new Wallets();
  }
}