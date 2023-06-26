import { walletState } from "../walletState";
import { AppState } from "../appState";
import { Wallets } from "../../models/wallets";
import type { Wallet } from "../../models/wallet";
import { SessionService } from "../../models/stores/sessionService";

const sessionWalletKey = "loggedInWallet";
const sessionNetworkNameKey = "networkName";
import * as jose from "jose"
import { sha3_256, sha3_512 } from "js-sha3";
import cryptoRandomString from "crypto-random-string";

export class WalletStateUtils {
  static refreshWallets(): void {
    walletState.wallets = new Wallets();
  }

  static async updateLoggedIn(wallet: Wallet):Promise<void> {
    walletState.currentLoggedInWallet = wallet;
    walletState.isLogin = true;
    const walletToken = await WalletSessionToken.create(
      wallet.name,
      wallet.networkName
    );
    SessionService.setRaw(sessionWalletKey, walletToken);
  }

  static doLogout(): void {
    walletState.currentLoggedInWallet = null;
    walletState.isLogin = false;
    sessionStorage.removeItem(sessionWalletKey);
    sessionStorage.removeItem("allFailedTransactions")
    sessionStorage.removeItem("notification");
    sessionStorage.removeItem("defaultAcc");
  }

  static async checkFromSession(): Promise<boolean> {
    const sessionWalletToken = SessionService.getRaw(sessionWalletKey);
    const sessionNetworkName = SessionService.getRaw(sessionNetworkNameKey);

    if (sessionWalletToken && sessionNetworkName) {
      const verifiableToken: jose.JWTPayload =
        WalletSessionToken.decode(sessionWalletToken);
      if (!verifiableToken || typeof verifiableToken == "string") {
        throw new Error("Service unavailable");
      }
      const isValid = await WalletSessionToken.verify(
        sessionWalletToken,
        verifiableToken.name,
        sessionNetworkName,
        verifiableToken.salt
      );
      const passToken = verifiableToken;
      if (isValid && passToken) {
        const wallet = walletState.wallets.wallets.find(
          (wallet) =>
            wallet.name === passToken.name &&
            wallet.networkName === sessionNetworkName
        );
        if (wallet) {
          walletState.currentLoggedInWallet = wallet;
          walletState.isLogin = true;
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  static checkSessionLoadedData() {
    const sessionAssetsInfo = SessionService.getRaw("assetsInfo");
    const sessionNamespacesInfo = SessionService.getRaw("namespacesInfo");

    try {
      if (sessionAssetsInfo) {
        AppState.assetsInfo = JSON.parse(sessionAssetsInfo);
      }
    } catch (error) {
      console.log("Error when parsing session assets info");
    }

    try {
      if (sessionNamespacesInfo) {
        AppState.namespacesInfo = JSON.parse(sessionNamespacesInfo);
      }
    } catch (error) {
      console.log("Error when parsing session namespaces info");
    }
  }
}

class WalletSessionToken {
  static decode(token: string): jose.JWTPayload  {
    return jose.decodeJwt(token)

  }

  static async verify(
    token: string,
    walletName: any,
    networkName: string,
    salt: any
  ) :Promise<boolean> {
    //let verifiedData: VerifiableToken;
    const secret = WalletSessionToken.generateWalletSessionToken(
      walletName,
      salt,
      networkName
    );

    try {
      const {protectedHeader} = await jose.jwtVerify(token, new TextEncoder().encode(secret) )
      if(JSON.stringify(protectedHeader) == JSON.stringify({alg:"HS256"})){
        return true
      }
      return false
    } catch (error: unknown) {
      /* if (error instanceof Error) {
        if (error.name === "TokenExpiredError") {
          console.log("Login Expired");
        }
      } */
      return false;
    }
  }

  static async create(walletName: string, networkName: string): Promise<string> {
    const salt = WalletSessionToken.genToken(10);

    const verifiableToken = {
      name: walletName,
      sub: "sessionLogin",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3, // 3 hours
      salt: salt,
    };

    const secret = WalletSessionToken.generateWalletSessionToken(
      walletName,
      salt,
      networkName
    );
    const token = await new jose.SignJWT(verifiableToken)
    .setProtectedHeader({alg:"HS256"})
    .sign(new TextEncoder().encode(secret))
    return token;
  }

  static generateWalletSessionToken(s1: string, s2: string, s3: string) {
    const secret = sha3_512(sha3_256(s1) + s2 + sha3_256(s3));

    return secret;
  }

  static genToken(length: number) {
    /*'hex' | 'base64' | 'url-safe' | 'numeric' | 'distinguishable' | 'ascii-printable' | 'alphanumeric' */
    const token = cryptoRandomString({
      length: length,
      type: "ascii-printable",
    });

    return token;
  }
}

export interface VerifiableToken {
  sub: string;
  name: string;
  iat: number;
  exp: number;
  salt: string;
}