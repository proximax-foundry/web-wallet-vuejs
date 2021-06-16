import { walletState } from "../walletState";
import { Wallets } from "../../models/wallets"
import { Wallet } from "../../models/wallet";
import { SessionService } from "../../models/stores/sessionService"

const sessionWalletKey = "loggedInWallet";

export class WalletStateUtils{

  static refreshWallets(): void{
    walletState.wallets = new Wallets();
  }

  static updateLoggedIn(wallet: Wallet): void{
    walletState.currentLoggedInWallet = wallet;
    walletState.isLogin = true;
    SessionService.setObject(sessionWalletKey, wallet);
  }

  static checkWalletUpdate(): void{
    if(walletState.wallets.isWalletOutdated())
      walletState.wallets = new Wallets();
  }

  static doLogout(): void{
    walletState.currentLoggedInWallet = null;
    walletState.isLogin = false;
    sessionStorage.removeItem(sessionWalletKey);
  }

  static checkFromSession(): boolean{

    const wallet = SessionService.getJSONParse(sessionWalletKey);

    if(wallet){
      walletState.currentLoggedInWallet = wallet;
      walletState.isLogin = true;
      return true;
    }
    else{
      return false;
    }
  }
}