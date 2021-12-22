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
  static createNIS1Account = (walletPassword: string, accountDetails: WalletAccount): nis1Account => {
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv)
    let nis1Wallet = Account.createWithPrivateKey(privateKey);
    const nis1Address = nis1Wallet.address.plain();
    return {
      address: nis1Address,
      publicKey: nis1Wallet.publicKey,
      balance: {
        xpx: 0,
        xar: 0
      }
    };
  }
}
