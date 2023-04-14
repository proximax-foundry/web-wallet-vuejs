import { readonly } from "vue";
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
} from "tsjs-xpx-chain-sdk";

import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { WalletUtils } from '@/util/walletUtils'
import { Helper } from "@/util/typeHelper";
import { AppState } from "@/state/appState";
import { WalletAccount } from "@/models/walletAccount";
import { OtherAccount } from "@/models/otherAccount";
import { TransactionUtils } from "./transactionUtils";

async function getAccInfo(address :string) :Promise<PublicAccount> {
  let accountInfo = await WalletUtils.getAccInfo(address).then(accountinfo => accountinfo.publicAccount);
  return accountInfo;
}


export const createTransaction = async (recipient :string, sendXPX :string, messageText :string, mosaicsSent :{amount: number ,id :string}[], mosaicDivisibility :number[], walletPassword :string, senderAccPublicKey :string, selectedCosigner :string, encryptedMsg :string) : Promise<boolean>  => {
  // verify password
  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword)
  
  if (!verify) {
    return false
  }

  const hash = networkState.currentNetworkProfile.generationHash

  let networkType =AppState.networkType
  const recipientAddress = recipient;

  let xpxAmount = parseFloat(sendXPX) * Math.pow(10, AppState.nativeToken.divisibility);

  let mosaics = [];
  if (xpxAmount > 0) {
    mosaics.push(new Mosaic(new MosaicId(AppState.nativeToken.assetId), UInt64.fromUint(Number(xpxAmount))));
  }
  if (mosaicsSent.length > 0) {
    mosaicsSent.forEach((mosaicSentInfo, index) => {
      if (mosaicSentInfo.amount > 0) {
        mosaics.push(
          new Mosaic(
            new MosaicId(mosaicSentInfo.id),
            UInt64.fromUint(Number(mosaicSentInfo.amount * Math.pow(10, mosaicDivisibility[index])))
          )
        );
      }
    });
  }
  let transactionBuilder = AppState.buildTxn

  let initiatorAcc :WalletAccount
  let senderAcc :WalletAccount | OtherAccount
  let senderPublicAccount :PublicAccount;
  if (!selectedCosigner) { 
    initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.publicKey === senderAccPublicKey);
  } else {
    // initiator acc details
    initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedCosigner);
    let publicKey = senderAccPublicKey
    senderPublicAccount = PublicAccount.createFromPublicKey(publicKey, networkType);
  }

  
  let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), initiatorAcc.encrypted, initiatorAcc.iv)


  // sending encrypted message

  let msg;
  if (encryptedMsg) {
    let accountInfo = await getAccInfo(recipientAddress)
    msg = EncryptedMessage.create(messageText, accountInfo, privateKey);
  } else {
    msg = PlainMessage.create(messageText);
  }

  let transferTransaction = transactionBuilder.transferBuilder()
  .recipient(Address.createFromRawAddress(recipientAddress))
  .mosaics(mosaics)
  .message(msg)
  .build()

  const account = Account.createFromPrivateKey(privateKey, networkType);

  if (!selectedCosigner) { // no cosigner, normal transaction
    const signedTransaction = account.sign(transferTransaction, hash);
    TransactionUtils.announceTransaction(signedTransaction)
  } else { // there is a cosigner, aggregate  bonded transaction
    let selectedWalletSigner = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==selectedCosigner) 
    let selectedSignerPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), selectedWalletSigner.encrypted, selectedWalletSigner.iv);
    let selectedSignerAccount = Account.createFromPrivateKey(selectedSignerPrivateKey,networkType)
    const innerTxn = [transferTransaction.toAggregate(senderPublicAccount)];
    const aggregateBondedTransaction = transactionBuilder.aggregateBonded(innerTxn)
    const aggregateBondedTransactionSigned = selectedSignerAccount.sign(aggregateBondedTransaction, hash);

    const hashLockTransaction = TransactionUtils.lockFundTx(aggregateBondedTransactionSigned)
    const hashLockTransactionSigned = selectedSignerAccount.sign(hashLockTransaction, hash)
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(hashLockTransactionSigned,aggregateBondedTransactionSigned)
  }
  
  return true
}



/**
 *
 *
 * @param message
 * @memberof ViewTransferComponent
 */
//random account info

const test_publicKey = "0".repeat(64)
const test_address = PublicAccount.createFromPublicKey(test_publicKey,AppState.networkType).address.plain() 

const getMosaic =(amount :string, mosaic :{id :string ,amount :string}[]) :Mosaic[]=>{
  let mosaics :Mosaic[]= []
  if (parseInt(amount) > 0) {
    mosaics.push(new Mosaic(new MosaicId(AppState.nativeToken.assetId), UInt64.fromUint(Number(amount))));
  }
  if (mosaic.length > 0) {
    mosaic.forEach((mosaicSentInfo, index) => {
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

const calculate_aggregate_fee = (message :string , amount :string, mosaic :{id :string ,amount :string}[]):string=> {
  
  let transactionBuilder = AppState.buildTxn
  let mosaics = getMosaic(amount,mosaic)
  let transferTransaction = transactionBuilder.transferBuilder()
  .recipient(Address.createFromRawAddress(test_address))
  .mosaics(mosaics)
  .message(PlainMessage.create(message))
  .build()
  let innerTxn= [transferTransaction.toAggregate(PublicAccount.createFromPublicKey(test_publicKey,AppState.networkType))]
  let aggregateBondedTx = transactionBuilder.aggregateBondedBuilder()
  .innerTransactions(innerTxn)
  .build()
  return  Helper.amountFormatterSimple(aggregateBondedTx.maxFee.compact(),AppState.nativeToken.divisibility)
}

const calculate_fee = (message :string , amount :string, mosaic :{id :string ,amount :string}[]) :string=> {
 
  let transactionBuilder = AppState.buildTxn
  let mosaics = getMosaic(amount,mosaic)
  let transferTransaction = transactionBuilder.transferBuilder()
  .recipient(Address.createFromRawAddress(test_address))
  .mosaics(mosaics)
  .message(PlainMessage.create(message))
  .build()
  return Helper.amountFormatterSimple(transferTransaction.maxFee.compact(), AppState.nativeToken.divisibility)
 
}

export const makeTransaction = readonly({
  calculate_fee,
  calculate_aggregate_fee
})

