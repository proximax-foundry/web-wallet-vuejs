import { first, timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import qrcode from 'qrcode-generator';
// import { Account, Address, AggregateTransaction, SignedTransaction } from "tsjs-xpx-chain-sdk";
import {
  NEMLibrary,
  Address,
  AccountHttp,
  Password,
  SimpleWallet,
  AccountOwnedAssetService,
  AssetHttp,
  AssetTransferable,
  ServerConfig,
  Account,
  TransferTransaction,
  TimeWindow,
  PlainMessage,
  PublicAccount,
  AssetId,
  TransactionHttp,
  MultisigTransaction,
  Transaction,
  NetworkTypes
} from 'nem-library';

import { pdfImg } from '@/modules/services/submodule/mainnetSwap/pdfBackground';
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletUtils } from "@/util/walletUtils";
import { ChainUtils } from "@/util/chainUtils";
import { ChainAPICall } from "@/models/REST/chainAPICall";
import { nis1Account } from "@/models/nis1Account";
import { WalletAccount } from "@/models/WalletAccount";

NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

export class nis1SwapUtils {

  accountHttp: AccountHttp;

  static createNIS1Account = (walletPassword: string, accountDetails: WalletAccount): nis1Account => {
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv)
    let nis1Wallet = Account.createWithPrivateKey(privateKey);
  const nis1Address = nis1Wallet.address.plain();
    return {
      address: nis1Address,
      publicKey: nis1Wallet.publicKey,
      balance: []
    };
  }

  // getAccountInfo(address: Address): Promise<AccountInfo>{
  //   return this.accountHttp.getAccountInfo(address).toPromise();
  // }

  static fetchNis1Properties = async() => {
    try {
      return await fetch('./applicationConfig.json', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma' : 'no-cache'
        }
      }).then((res) => res.json()).then((configInfo) => { return configInfo });
    } catch (e) {
      console.error(e);
    }
  }
  

  // create Address for nis1
  static createAddressToString(address: string): Address {
    return new Address(address);
  }

  // create Public Account for nis1
  static createPublicAccount(publicKey: string): PublicAccount {
    return PublicAccount.createWithPublicKey(publicKey);
  }

  // get nis1 account info
  static async getAccountInfo(address: Address) {
    const appSetting = await nis1SwapUtils.fetchNis1Properties();
    try {
      let headers = {}
      console.log(`${appSetting.nis1.url}/account/get?address=${address.plain()}`)
      let nis1Acc = await fetch(`${appSetting.nis1.url}/account/get?address=${address.plain()}`, {
        method: 'GET',
        mode: 'cors',
        headers: headers,
      })
        .then( response => {return response.json(); })
        .then( data => { return data; })
      // if(nis1Acc.meta.cosignatories.length > 0){
      //   // info account multisig
      //   if(nis1Acc.meta.cosignatoryOf.length > 0){
      //     nis1Acc.meta.cosignatoryOf.forEach(account => {
      //       try {
      //         const nis1Address = new Address(account.address);
      //         const ownedMosaic = await nis1SwapUtils.getOwnedMosaics(nis1Address);
      //       } catch (error) {
              
      //       }
      //     });
      //   }
      // }
      // const ownedMosaic = nis1SwapUtils.getOwnedMosaics(address);
      return nis1Acc;
    } catch (e) {
      console.log(e);
      console.error(e);
    }
  }

  static getOwnedMosaics(address: Address, nodes: ServerConfig[]): Observable<AssetTransferable[]> {
  // static getOwnedMosaics(address: Address) {
    const assetHttp = new AssetHttp(nodes);
    const accountHttp = new AccountHttp(nodes);
    // const nodes: ServerConfig[] = [];
    const accountOwnedMosaics = new AccountOwnedAssetService(accountHttp, assetHttp);
    console.log(accountOwnedMosaics)
    return accountOwnedMosaics.fromAddress(address);
    // accountOwnedMosaics.filter()
    // return accountOwnedMosaics.fromAddress(address);
  }

  static getNIS1AccountInfo = async (publicKey: string) => {
    const appSetting = await nis1SwapUtils.fetchNis1Properties();
    // console.log(appSetting);
    const nis1PublicAccount = nis1SwapUtils.createPublicAccount(publicKey);
    const nis1AddressToSwap = nis1SwapUtils.createAddressToString(nis1PublicAccount.address.pretty());
    // console.log(nis1AddressToSwap);
    const accountInfoOwnedSwap = await nis1SwapUtils.getAccountInfo(nis1AddressToSwap);
    // console.log(accountInfoOwnedSwap);
    const ownedMosaic = await nis1SwapUtils.getOwnedMosaics(nis1AddressToSwap, appSetting.nis1.nodes).pipe(first()).pipe((timeout(appSetting.timeOutTransactionNis1))).toPromise();
    // const xpxFound = ownedMosaic.find(el => el.assetId.namespaceId === 'prx' && el.assetId.name === 'xpx');
    console.log(ownedMosaic);
    const mosaicsFound = ownedMosaic.filter(e => appSetting.swapAllowedMosaics.find(d => d.namespaceId === e.assetId.namespaceId && d.name === e.assetId.name));
    console.log(mosaicsFound);
  }
}
