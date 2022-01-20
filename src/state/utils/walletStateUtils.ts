import { walletState } from "../walletState";
import { AppStateUtils } from "../utils/appStateUtils";
import { Wallets } from "../../models/wallets"
import { Wallet } from "../../models/wallet";
import { SessionService } from "../../models/stores/sessionService"

const sessionWalletKey = "loggedInWallet";
const sessionNetworkNameKey = "networkName";

import jwt from "jsonwebtoken";
import { sha3_256, sha3_512 } from "js-sha3";
import cryptoRandomString from "crypto-random-string";

export class WalletStateUtils{

  static refreshWallets(): void{
    walletState.wallets = new Wallets();
  }

  static updateLoggedIn(wallet: Wallet): void{
    walletState.currentLoggedInWallet = wallet;
    walletState.isLogin = true;
    let walletToken = WalletSessionToken.create(wallet.name, wallet.networkName);
    SessionService.setRaw(sessionWalletKey, walletToken);
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

    AppStateUtils.addNewReadyStates('checkSession');

    const sessionWalletToken = SessionService.getRaw(sessionWalletKey);
    const sessionNetworkName = SessionService.getRaw(sessionNetworkNameKey);

    if(sessionWalletToken && sessionNetworkName){

      let verifiableToken: VerifiableToken = WalletSessionToken.decode(sessionWalletToken);

      let isValid = WalletSessionToken.verify(sessionWalletToken, verifiableToken.name, sessionNetworkName, verifiableToken.salt);

      if(isValid){
        let wallet = walletState.wallets.wallets.find((wallet)=>wallet.name === verifiableToken.name && wallet.networkName === sessionNetworkName);
        if(wallet){
          walletState.currentLoggedInWallet = wallet;
          walletState.isLogin = true;
          return true;
        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }
}

class WalletSessionToken{

  static decode(token: string): VerifiableToken{
    let decoded = jwt.decode(token);

    return decoded;
  }

  static verify(token: string, walletName: string, networkName: string, salt: string){

    //let verifiedData: VerifiableToken;
    let secret = WalletSessionToken.generateWalletSessionToken(walletName, salt, networkName);

    try {
      jwt.verify(token, secret, { algorithms : "HS512"});
    } catch (error: unknown) {
      if (error instanceof Error) {
        if(error.name === "TokenExpiredError"){
          console.log("Login Expired");
        }
      }
      return false;
    }

    return true;
  }

  static create(walletName: string, networkName: string): string{
    let salt = WalletSessionToken.genToken(10);

    let verifiableToken:VerifiableToken = {
      name: walletName,
      sub: "sessionLogin",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3), // 3 hours
      salt: salt
    }

    let secret = WalletSessionToken.generateWalletSessionToken(walletName, salt, networkName);

    let token = jwt.sign(verifiableToken, secret, { algorithm: 'HS512' } );

    return token;
  }

  static generateWalletSessionToken(s1: string, s2: string, s3: string){

    let secret = sha3_512(sha3_256(s1) + s2 + sha3_256(s3));

    return secret;
  }

  static genToken(length: number){

    /*'hex' | 'base64' | 'url-safe' | 'numeric' | 'distinguishable' | 'ascii-printable' | 'alphanumeric' */
    let token = cryptoRandomString({length: length, type: 'ascii-printable'});

    return token;
  }
}

export interface VerifiableToken{
  sub: string;
  name: string;
  iat: number;
  exp: number;
  salt: string;
}