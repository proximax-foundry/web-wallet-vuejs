import { first, timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as js_joda from 'js-joda';
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

export interface TransactionsNis1Interface {
  siriusAddres: string;
  nis1Timestamp: string;
  nis1PublicKey: string;
  nis1TransactionHash: string;
}

export interface swapData {
  code: string;
  message: string;
  hash: string;
  link: string;
}

export interface WalletTransactionsNis1Interface {
  name: string;
  transactions: TransactionsNis1Interface[];
}

export class Nis1SwapUtils {

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
    const appSetting = await Nis1SwapUtils.fetchNis1Properties();
    try {
      let headers = {}
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
      //         const ownedMosaic = await Nis1SwapUtils.getOwnedMosaics(nis1Address);
      //       } catch (error) {
              
      //       }
      //     });
      //   }
      // }
      // const ownedMosaic = Nis1SwapUtils.getOwnedMosaics(address);
      return nis1Acc;
    } catch (e) {
      console.log(e);
      console.error(e);
    }
  }

  static getOwnedMosaics(address: Address, nodes: ServerConfig[]): Observable<AssetTransferable[]> {
    const assetHttp = new AssetHttp(nodes);
    const accountHttp = new AccountHttp(nodes);
    const accountOwnedMosaics = new AccountOwnedAssetService(accountHttp, assetHttp);
    return accountOwnedMosaics.fromAddress(address);
  }

  static getNIS1AccountBalance = async (publicKey: string) => {
    const appSetting = await Nis1SwapUtils.fetchNis1Properties();
    const nis1PublicAccount = Nis1SwapUtils.createPublicAccount(publicKey);
    const nis1AddressToSwap = Nis1SwapUtils.createAddressToString(nis1PublicAccount.address.pretty());
    const accountInfoOwnedSwap = await Nis1SwapUtils.getAccountInfo(nis1AddressToSwap);
    const ownedMosaic = await Nis1SwapUtils.getOwnedMosaics(nis1AddressToSwap, appSetting.nis1.nodes).pipe(first()).pipe((timeout(appSetting.timeOutTransactionNis1))).toPromise();
    // const xpxFound = ownedMosaic.find(el => el.assetId.namespaceId === 'prx' && el.assetId.name === 'xpx');
    const mosaicsFound = ownedMosaic.filter(e => appSetting.swapAllowedMosaics.find(d => d.namespaceId === e.assetId.namespaceId && d.name === e.assetId.name));
    return mosaicsFound;
  }

  static async createTransaction(message: PlainMessage, assetId: AssetId, quantity: number, decimal: number) {
    const appSetting = await Nis1SwapUtils.fetchNis1Properties();
    const assetHttp = new AssetHttp(appSetting.nis1.nodes);
    const resultAssets: any = await assetHttp.getAssetTransferableWithAbsoluteAmount(assetId, quantity).toPromise();

    resultAssets['quantity'] = quantity * Math.pow(10, decimal);
    return TransferTransaction.createWithAssets(
      Nis1SwapUtils.createWithDeadline(),
      new Address(appSetting.nis1.burnAddress),
      [resultAssets],
      message
    );
  }

  static createWithDeadline = (deadline: number = 2, chronoUnit: any = js_joda.ChronoUnit.HOURS): TimeWindow => {
    const currentTimeStamp = (new Date()).getTime() - 600000;
    const timeStampDateTime = js_joda.LocalDateTime.ofInstant(js_joda.Instant.ofEpochMilli(currentTimeStamp), js_joda.ZoneId.SYSTEM);
    const deadlineDateTime = timeStampDateTime.plus(deadline, chronoUnit);
    if (deadline <= 0) {
      throw new Error('deadline should be greater than 0');
    } else if (timeStampDateTime.plus(24, js_joda.ChronoUnit.HOURS).compareTo(deadlineDateTime) !== 1) {
      throw new Error('deadline should be less than 24 hours');
    }
    return new TimeWindow(timeStampDateTime, deadlineDateTime);
  };

  static initiateNis1Swap = async (walletPassword: string, quantity: number, decimal: number, token:string, accountDetails: WalletAccount) => {
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv)
    let nis1Account = Account.createWithPrivateKey(privateKey);
    const asset = accountDetails.nis1Account.balance.find(asset => asset.assetId.name == token);
    const msg = PlainMessage.create(accountDetails.nis1Account.publicKey);
    const transaction = await Nis1SwapUtils.createTransaction(msg, asset.assetId, quantity, decimal);
    const publicAccount = Nis1SwapUtils.createPublicAccount(accountDetails.nis1Account.publicKey);
    return await Nis1SwapUtils.anounceTransaction(transaction, nis1Account, publicAccount);
  }

  static async anounceTransaction(transaction: TransferTransaction | MultisigTransaction, account: Account, siriusAccount: PublicAccount):Promise<swapData> {
    // console.log('\nIN ANNOUNCE TXN --->', transaction);
    const appSetting = await Nis1SwapUtils.fetchNis1Properties();
    const signedTransaction = account.signTransaction(transaction);
    let headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    };
    let nis1Acc = await fetch(`${appSetting.nis1.url}/transaction/announce`, {
      method: 'post',
      mode: 'cors',
      body: JSON.stringify(signedTransaction),
      headers: headers,
    })
      .then( response => {return response.json(); })
      .then( data => { return data; })

    const returnData = {
      code: nis1Acc.code,
      message: nis1Acc.message,
      hash: nis1Acc.transactionHash.data,
      link: appSetting.nis1.urlExplorer + nis1Acc.transactionHash.data,
    }
    return returnData;
  }

  static generateNis1PdfCert = (networkName: string, swapTimestamp: string, siriusAddress: string, asset: string, transactionHash: string, qrImage: string) => {
    const imgData = pdfImg;
    let doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'b1'
    })

    doc.addImage(imgData, 'JPEG', 1, 1, 1000, 707, '', 'NONE')
    doc.setFontSize(50)

    let leftCol = 45, secCol = 280, dateCol = 380;
    let dateRow = 255, addressRow = 315, swapIDRow = 385,
    hashRow = 455, qrRpw = 515;

    doc.text(swapTimestamp, dateCol, dateRow)

    doc.text('Sirius Address:', leftCol, addressRow);
    doc.text(siriusAddress, secCol, addressRow );

    doc.text('Asset Transfer:', leftCol, swapIDRow);
    doc.text(asset, secCol, swapIDRow);

    doc.text( networkName + ' Transaction Hash:', leftCol, hashRow);
    doc.text(transactionHash, secCol, hashRow);

    let img = new Image();
    img.src = qrImage;
    doc.addImage(img, 'png', leftCol, qrRpw, 120, 120)

    doc.setProperties({ title: 'Swap Certificate'});
    doc.save('swap_certificate.pdf');
  }
}
