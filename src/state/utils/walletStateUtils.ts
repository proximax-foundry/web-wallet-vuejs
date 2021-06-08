import { walletState } from "../walletState";
import { Wallets } from "../../models/wallets"
import { Wallet } from "../../models/wallet";
import { SessionService } from "../../models/stores/sessionService"

const sessionWalletKey = "loggedInWallet";

export class WalletStateUtils{

  static refreshWallets(){
    walletState.wallets = new Wallets();
  }

  static updateLoggedIn(wallet: Wallet){
    walletState.currentLoggedInWallet = wallet;
    walletState.isLogin = true;
    SessionService.setObject(sessionWalletKey, wallet);
  }

  static checkWalletUpdate(){
    if(walletState.wallets.isWalletOutdated())
      walletState.wallets = new Wallets();
  }

  static checkFromSession(){

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