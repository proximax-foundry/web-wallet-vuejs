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
import { WalletUtils } from "@/util/walletUtils";
import { Helper } from "@/util/typeHelper";
import { AppState } from "@/state/appState";
import type { WalletAccount } from "@/models/walletAccount";
import type { OtherAccount } from "@/models/otherAccount";
import { TransactionUtils } from "./transactionUtils";

async function getAccInfo(address: string): Promise<PublicAccount> {
  const accountInfo = await WalletUtils.getAccInfo(address).then(
    (accountinfo) => accountinfo.publicAccount
  );
  return accountInfo;
}

export const createTransaction = async (
  recipient: string,
  sendXPX: string,
  messageText: string,
  mosaicsSent: { amount: string; id: string }[],
  mosaicDivisibility: number[],
  walletPassword: string,
  senderAccAddress: string,
  selectedCosigner: string,
  encryptedMsg: string
): Promise<boolean> => {
  // verify password
  const transactionBuilder = AppState.buildTxn;

  const wallet = walletState.currentLoggedInWallet;
  if (!wallet || !networkState.currentNetworkProfile || !transactionBuilder) {
    throw new Error("Service unavailable");
  }
  if (
    !WalletUtils.verifyWalletPassword(
      wallet.name,
      networkState.chainNetworkName,
      walletPassword
    )
  ) {
    return false;
  }

  const hash = networkState.currentNetworkProfile.generationHash;

  const networkType = AppState.networkType;
  const recipientAddress = recipient;

  const xpxAmount =
    parseFloat(sendXPX) * Math.pow(10, AppState.nativeToken.divisibility);

  const mosaics = [];
  if (xpxAmount > 0) {
    mosaics.push(
      new Mosaic(
        new MosaicId(AppState.nativeToken.assetId),
        UInt64.fromUint(Number(xpxAmount))
      )
    );
  }
  if (mosaicsSent.length > 0) {
    mosaicsSent.forEach((mosaicSentInfo, index) => {
      if (parseFloat(mosaicSentInfo.amount) > 0) {
        mosaics.push(
          new Mosaic(
            new MosaicId(mosaicSentInfo.id),
            UInt64.fromUint(
              Number(
                parseFloat(mosaicSentInfo.amount) * Math.pow(10, mosaicDivisibility[index])
              )
            )
          )
        );
      }
    });
  }

  let initiatorAcc: WalletAccount | undefined;
  let senderAcc: WalletAccount | OtherAccount | undefined;
  let senderPublicAccount: PublicAccount | null = null;
  if (!selectedCosigner) {
    initiatorAcc = wallet.accounts.find(
      (element) => element.address === senderAccAddress
    );
  } else {
    // initiator acc details
    initiatorAcc = wallet.accounts.find(
      (element) => element.address === selectedCosigner
    );
    //sender acc details
    senderAcc =
      wallet.others.find((element) => element.address === senderAccAddress) ||
      wallet.accounts.find((element) => element.address === senderAccAddress);
    if (!senderAcc) {
      throw new Error("Account not found");
    }
    const publicKey = senderAcc.publicKey;
    senderPublicAccount = PublicAccount.createFromPublicKey(
      publicKey,
      networkType
    );
  }
  if (!initiatorAcc) {
    throw new Error("Account not found");
  }

  const privateKey = WalletUtils.decryptPrivateKey(
    new Password(walletPassword),
    initiatorAcc.encrypted,
    initiatorAcc.iv
  );

  // sending encrypted message

  let msg;
  if (encryptedMsg) {
    const accountInfo = await getAccInfo(recipientAddress);
    msg = EncryptedMessage.create(messageText, accountInfo, privateKey);
  } else {
    msg = PlainMessage.create(messageText);
  }

  const transferTransaction = transactionBuilder
    .transferBuilder()
    .recipient(Address.createFromRawAddress(recipientAddress))
    .mosaics(mosaics)
    .message(msg)
    .build();

  const account = Account.createFromPrivateKey(privateKey, networkType);

  if (!selectedCosigner) {
    // no cosigner, normal transaction
    const signedTransaction = account.sign(transferTransaction, hash);
    TransactionUtils.announceTransaction(signedTransaction);
  } else {
    // there is a cosigner, aggregate  bonded transaction
    const selectedWalletSigner = wallet.accounts.find(
      (acc) => acc.address == selectedCosigner
    );
    if (!selectedWalletSigner) {
      throw new Error("Account not found");
    }
    const selectedSignerPrivateKey = WalletUtils.decryptPrivateKey(
      new Password(walletPassword),
      selectedWalletSigner.encrypted,
      selectedWalletSigner.iv
    );
    const selectedSignerAccount = Account.createFromPrivateKey(
      selectedSignerPrivateKey,
      networkType
    );
    if (!senderPublicAccount) {
      throw new Error("Account not found");
    }
    const innerTxn = [transferTransaction.toAggregate(senderPublicAccount)];
    const aggregateBondedTransaction =
      transactionBuilder.aggregateBonded(innerTxn);
    const aggregateBondedTransactionSigned = selectedSignerAccount.sign(
      aggregateBondedTransaction,
      hash
    );

    const hashLockTransaction = TransactionUtils.lockFundTx(
      aggregateBondedTransactionSigned
    );
    const hashLockTransactionSigned = selectedSignerAccount.sign(
      hashLockTransaction,
      hash
    );
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(
      hashLockTransactionSigned,
      aggregateBondedTransactionSigned
    );
  }

  return true;
};

/**
 *
 *
 * @param message
 * @memberof ViewTransferComponent
 */
//random account info

const test_publicKey = "0".repeat(64);
const test_address = PublicAccount.createFromPublicKey(
  test_publicKey,
  AppState.networkType
).address.plain();

const getMosaic = (
  amount: string,
  mosaic: { id: string; amount: string }[]
): Mosaic[] => {
  const mosaics: Mosaic[] = [];
  if (parseInt(amount) > 0) {
    mosaics.push(
      new Mosaic(
        new MosaicId(AppState.nativeToken.assetId),
        UInt64.fromUint(Number(amount))
      )
    );
  }
  if (mosaic.length > 0) {
    mosaic.forEach((mosaicSentInfo) => {
      if (parseInt(mosaicSentInfo.amount) > 0) {
        mosaics.push(
          new Mosaic(
            new MosaicId(mosaicSentInfo.id),
            UInt64.fromUint(Number(mosaicSentInfo.amount))
          )
        );
      }
    });
  }
  return mosaics;
};

const calculate_aggregate_fee = (
  message: string,
  amount: string,
  mosaic: { id: string; amount: string }[]
): number => {
  const transactionBuilder = AppState.buildTxn;
  if (!transactionBuilder) {
    throw new Error("Service unavailable");
  }
  const mosaics = getMosaic(amount, mosaic);
  const transferTransaction = transactionBuilder
    .transferBuilder()
    .recipient(Address.createFromRawAddress(test_address))
    .mosaics(mosaics)
    .message(PlainMessage.create(message))
    .build();
  const innerTxn = [
    transferTransaction.toAggregate(
      PublicAccount.createFromPublicKey(test_publicKey, AppState.networkType)
    ),
  ];
  const aggregateBondedTx = transactionBuilder
    .aggregateBondedBuilder()
    .innerTransactions(innerTxn)
    .build();

  return aggregateBondedTx.maxFee.compact() / AppState.nativeToken.divisibility

};

const calculate_fee = (
  message: string,
  amount: string,
  mosaic: { id: string; amount: string }[]
): number => {
  const transactionBuilder = AppState.buildTxn;
  if (!transactionBuilder) {
    throw new Error("Service unavailable");
  }
  const mosaics = getMosaic(amount, mosaic);
  const transferTransaction = transactionBuilder
    .transferBuilder()
    .recipient(Address.createFromRawAddress(test_address))
    .mosaics(mosaics)
    .message(PlainMessage.create(message))
    .build();
  return transferTransaction.maxFee.compact() / AppState.nativeToken.divisibility

};

export const makeTransaction = readonly({
  calculate_fee,
  calculate_aggregate_fee,
});
