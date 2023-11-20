import {
  Account,
  Address,
  EncryptedMessage,
  Mosaic,
  MosaicId,
  UInt64,
  PlainMessage,
  PublicAccount,
  Password,
  Message,
} from "tsjs-xpx-chain-sdk";

import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { WalletUtils } from '@/util/walletUtils'
import { AppState } from "@/state/appState";
import { WalletAccount } from "@/models/walletAccount";
import { OtherAccount } from "@/models/otherAccount";
import { TransactionUtils } from "./transactionUtils";


const test_publicKey = "0".repeat(64)
const test_address = PublicAccount.createFromPublicKey(test_publicKey, AppState.networkType).address.plain()

const getMosaic = (amount: string, mosaic: { id: string, amount: string }[]): Mosaic[] => {
  let mosaics: Mosaic[] = []
  if (parseInt(amount) > 0) {
    mosaics.push(new Mosaic(new MosaicId(AppState.nativeToken.assetId), UInt64.fromUint(Number(amount))));
  }
  if (mosaic.length > 0) {
    mosaic.forEach((mosaicSentInfo) => {
      if (parseInt(mosaicSentInfo.amount) > 0) {
        mosaics.push(
          new Mosaic(
            new MosaicId(mosaicSentInfo.id),
            UInt64.fromUint(Number(mosaicSentInfo.amount)))
        )
      }

    })
  }
  return mosaics
}

export class TransferUtils {



  static createTransaction = async (recipientAddress: string, nativeTokenAmount: string, messageText: string, mosaicsSent: { amount: number, id: string,divisibility:number }[],walletPassword: string, selectedAddress: string, selectedMultisigAddress: string, isEncrypted: boolean, recipientPublicKey: string): Promise<boolean> => {
    // verify password
    let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword)

    if (!verify) {
      return false
    }

    const hash = networkState.currentNetworkProfile.generationHash

    let networkType = AppState.networkType

    let xpxAmount = parseFloat(nativeTokenAmount) * Math.pow(10, AppState.nativeToken.divisibility);

    let mosaics = [];
    if (xpxAmount > 0) {
      mosaics.push(new Mosaic(new MosaicId(AppState.nativeToken.assetId), UInt64.fromUint(Number(xpxAmount))));
    }
    if (mosaicsSent.length > 0) {
      mosaicsSent.forEach((mosaicSentInfo) => {
        if (mosaicSentInfo.amount > 0) {
          mosaics.push(
            new Mosaic(
              new MosaicId(mosaicSentInfo.id),
              UInt64.fromUint(Number(mosaicSentInfo.amount * Math.pow(10, mosaicSentInfo.divisibility)))
            )
          );
        }
      });
    }
    let transactionBuilder = AppState.buildTxn

    let initiatorAcc: WalletAccount
    let senderPublicAccount: PublicAccount;
    if (!selectedMultisigAddress) {
      initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedAddress);
    } else {
      // initiator acc details
      initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedAddress);
      const accountInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(selectedMultisigAddress))
      senderPublicAccount = PublicAccount.createFromPublicKey(accountInfo.publicKey, networkType);
    }


    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), initiatorAcc.encrypted, initiatorAcc.iv)


    // sending encrypted message

    let msg :Message;
   

    if (isEncrypted &&  messageText.length>0) {
      try {
        const accountInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(recipientAddress))
        msg = EncryptedMessage.create(messageText, accountInfo.publicAccount, privateKey);
      } catch (error) {
        msg = EncryptedMessage.create(messageText, PublicAccount.createFromPublicKey(recipientPublicKey,AppState.networkType) , privateKey)
      }
    } else {
      msg = PlainMessage.create(messageText);
    }

    let transferTransaction = transactionBuilder.transferBuilder()
      .recipient(Address.createFromRawAddress(recipientAddress))
      .mosaics(mosaics)
      .message(msg)
      .build()

    const account = Account.createFromPrivateKey(privateKey, networkType, 1);

    if (!selectedMultisigAddress) { // no cosigner, normal transaction
      const signedTransaction = account.preV2Sign(transferTransaction, hash);
      TransactionUtils.announceTransaction(signedTransaction)
    } else { // there is a cosigner, aggregate  bonded transaction
      let selectedWalletSigner = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == selectedAddress)
      let selectedSignerPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), selectedWalletSigner.encrypted, selectedWalletSigner.iv);
      let selectedSignerAccount = Account.createFromPrivateKey(selectedSignerPrivateKey, networkType, 1)
      const innerTxn = [transferTransaction.toAggregateV1(senderPublicAccount)];
      const aggregateBondedTransaction = transactionBuilder.aggregateBonded(innerTxn)
      const aggregateBondedTransactionSigned = selectedSignerAccount.preV2Sign(aggregateBondedTransaction, hash);

      const hashLockTransaction = TransactionUtils.lockFundTx(aggregateBondedTransactionSigned)
      const hashLockTransactionSigned = selectedSignerAccount.preV2Sign(hashLockTransaction, hash)
      TransactionUtils.announceLF_AND_addAutoAnnounceABT(hashLockTransactionSigned, aggregateBondedTransactionSigned)
    }

    return true
  }

  static calculateAggregateFee = (message: string, amount: string, mosaic: { id: string, amount: string }[], isEncrypted: boolean): number => {

    let transactionBuilder = AppState.buildTxn
    let mosaics = getMosaic(amount, mosaic)
    let transferTransaction = transactionBuilder.transferBuilder()
      .recipient(Address.createFromRawAddress(test_address))
      .mosaics(mosaics)
      .message(isEncrypted && message.length>0? EncryptedMessage.create(message, PublicAccount.createFromPublicKey('0'.repeat(64), AppState.networkType), '0'.repeat(64)) : PlainMessage.create(message))
      .build()
    let innerTxn = [transferTransaction.toAggregateV1(PublicAccount.createFromPublicKey(test_publicKey, AppState.networkType))]
    let aggregateBondedTx = transactionBuilder.aggregateBondedBuilder()
      .innerTransactions(innerTxn)
      .build()
    return aggregateBondedTx.maxFee.compact() / Math.pow(10,AppState.nativeToken.divisibility) 
  }

  static calculateFee = (message: string, amount: string, mosaic: { id: string, amount: string }[], isEncrypted: boolean): number => {

    let transactionBuilder = AppState.buildTxn
    let mosaics = getMosaic(amount, mosaic)
    let transferTransaction = transactionBuilder.transferBuilder()
      .recipient(Address.createFromRawAddress(test_address))
      .mosaics(mosaics)
      .message(isEncrypted && message.length>0?  EncryptedMessage.create(message, PublicAccount.createFromPublicKey('0'.repeat(64), AppState.networkType), '0'.repeat(64)) : PlainMessage.create(message))
      .build()
    return transferTransaction.maxFee.compact() / Math.pow(10,AppState.nativeToken.divisibility) 

  }

}