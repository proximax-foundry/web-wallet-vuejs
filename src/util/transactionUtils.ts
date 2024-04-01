import {
  Address,
  Account,
  EncryptedMessage,
  Mosaic,
  UInt64,
  PlainMessage,
  PublicAccount,
  NamespaceId,
  Transaction,
  TransactionType,
  AggregateTransaction,
  CosignatureTransaction,
  TransactionQueryParams,
  InnerTransaction,
  SignedTransaction,
  CosignatureSignedTransaction,
  TransactionGroupType,
  TransactionSearch,
  TransactionHash,
  HashLockTransaction,
  TransactionAnnounceResponse,
  AddExchangeOfferTransaction,
  ExchangeOfferTransaction,
  AccountLinkTransaction,
  ModifyMultisigAccountTransaction,
  SecretProofTransaction,
  TransferTransaction,
  NetworkType,
  Password,
  TransactionMapping,
} from "tsjs-xpx-chain-sdk";
import { AppState } from "@/state/appState";
import { ChainConfigUtils } from "./chainConfigUtils";
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";
import {
  AnnounceType,
  AutoAnnounceSignedTransaction,
  HashAnnounceBlock,
} from "@/state/listenerState";
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { WalletUtils } from "./walletUtils";

export const transactionTypeName = {
  transfer: {
    id: TransactionType.TRANSFER,
    name: "Transfer",
  },
  registerNameSpace: {
    id: TransactionType.REGISTER_NAMESPACE,
    name: "Register Namespace",
  },
  mosaicDefinition: {
    id: TransactionType.MOSAIC_DEFINITION,
    name: "Mosaic Definition",
  },
  mosaicSupplyChange: {
    id: TransactionType.MOSAIC_SUPPLY_CHANGE,
    name: "Mosaic Supply Change",
  },
  modifyMultisigAccount: {
    id: TransactionType.MODIFY_MULTISIG_ACCOUNT,
    name: "Modify Multisig Account",
  },
  aggregateComplete: {
    id: TransactionType.AGGREGATE_COMPLETE_V1,
    name: "Aggregate Complete",
  },
  aggregateBonded: {
    id: TransactionType.AGGREGATE_BONDED_V1,
    name: "Aggregate Bonded",
  },
  mosaicAlias: {
    id: TransactionType.MOSAIC_ALIAS,
    name: "Mosaic Alias",
  },
  addressAlias: {
    id: TransactionType.ADDRESS_ALIAS,
    name: "Address Alias",
  },
  lock: {
    id: TransactionType.HASH_LOCK,
    name: "LockFund",
  },
  accountLink: {
    id: TransactionType.LINK_ACCOUNT,
    name: "Account Link",
  },
  exchangeOffer: {
    id: TransactionType.EXCHANGE_OFFER,
    name: "Exchange Offer",
  },
  addExchangeOffer: {
    id: TransactionType.ADD_EXCHANGE_OFFER,
    name: "Add Exchange Offer",
  },
  removeExchangeOffer: {
    id: TransactionType.REMOVE_EXCHANGE_OFFER,
    name: "Remove Exchange Offer",
  },
  modifyAccountMetadata: {
    id: TransactionType.MODIFY_ACCOUNT_METADATA,
    name: "Modify Account Metadata",
  },
  modifyMosaicMetadata: {
    id: TransactionType.MODIFY_MOSAIC_METADATA,
    name: "Modify Asset Metadata",
  },
  modifyNamespaceMetadata: {
    id: TransactionType.MODIFY_NAMESPACE_METADATA,
    name: "Modify Namespace Metadata",
  },
  modifyAccountRestrictionAddress: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS,
    name: "Modify Account Restriction Address",
  },
  modifyAccountRestrictionMosaic: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC,
    name: "Modify Account Restriction Asset",
  },
  modifyAccountRestrictionOperation: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION,
    name: "Modify Account Restriction Operation",
  },
  chainConfigure: {
    id: TransactionType.CHAIN_CONFIGURE,
    name: "Chain Configure",
  },
  chainUpgrade: {
    id: TransactionType.CHAIN_UPGRADE,
    name: "Chain Upgrade",
  },
  secretLock: {
    id: TransactionType.SECRET_LOCK,
    name: "Secret lock",
  },
  secretProof: {
    id: TransactionType.SECRET_PROOF,
    name: "Secret proof",
  },
  modifyAccountMetadata_v2: {
    id: TransactionType.ACCOUNT_METADATA_V2,
    name: "Account Metadata",
  },
  modifyMosaicMetadata_v2: {
    id: TransactionType.MOSAIC_METADATA_V2,
    name: "Sirius Digital Assets Metadata",
  },
  modifyNamespaceMetadata_v2: {
    id: TransactionType.NAMESPACE_METADATA_V2,
    name: "Namespace Metadata",
  },
  modifyMosaicLevy: {
    id: TransactionType.MODIFY_MOSAIC_LEVY,
    name: "Modify Mosaic Levy",
  },
  removeRemoveLevy: {
    id: TransactionType.REMOVE_MOSAIC_LEVY,
    name: "Remove Mosaic Levy",
  },
  sdaExchangeOffer: {
    id: TransactionType.PLACE_SDA_EXCHANGE_OFFER,
    name: "Place SDA Exchange Offer",
  },
  sdaExchangeRemoveOffer: {
    id: TransactionType.REMOVE_SDA_EXCHANGE_OFFER,
    name: "Remove SDA Exchange Offer",
  },
};

export class TransactionUtils {
  static getTransactionTypeNameByEnum(
    transactionType: TransactionType
  ): string {
    let name = "";

    for (let key in transactionTypeName) {
      if (transactionType === transactionTypeName[key].id) {
        name = transactionTypeName[key].name;
        break;
      }
    }

    return name;
  }

  static getFee(transaction: Transaction): number {
    return transaction.maxFee.compact();
  }

  static getFakeEncryptedMessageSize(message: string): number {
    return EncryptedMessage.create(
      message,
      PublicAccount.createFromPublicKey("0".repeat(64), AppState.networkType, 1),
      "0".repeat(64)
    ).size();
  }

  static getPlainMessageSize(message: string): number {
    return PlainMessage.create(message).size();
  }

  static signTransaction(
    transaction: Transaction,
    account: Account,
    generationHash: string
  ): SignedTransaction {
    return account.sign(transaction, generationHash);
  }

  static aggregateToCosignatureTransaction(
    aggregateTransaction: AggregateTransaction
  ): CosignatureTransaction {
    return CosignatureTransaction.create(aggregateTransaction);
  }

  static cosignTransaction(
    transactionToCosign: AggregateTransaction,
    account: Account
  ): CosignatureSignedTransaction {
    const cosignatureTransaction =
      TransactionUtils.aggregateToCosignatureTransaction(transactionToCosign);

    return account.signCosignatureTransaction(cosignatureTransaction);
  }

  static async getTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    let transactions = await AppState.chainAPI.accountAPI.transactions(
      publicAccount,
      queryParams
    );

    return transactions;
  }

  static async searchTransactions(
    txnGroupType: TransactionGroupType,
    queryParams?: TransactionQueryParams
  ): Promise<TransactionSearch> {
    let transactionsResult =
      await AppState.chainAPI.transactionAPI.searchTransactions(
        txnGroupType,
        queryParams
      );

    return transactionsResult;
  }

  static async getUnconfirmedTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    let transactions =
      await AppState.chainAPI.accountAPI.unconfirmedTransactions(
        publicAccount,
        queryParams
      );

    return transactions;
  }

  static async getPartialTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    let transactions =
      await AppState.chainAPI.accountAPI.aggregateBondedTransactions(
        publicAccount,
        queryParams
      );

    return transactions;
  }

  static announceTransaction(
    signedTx: SignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    return AppState.chainAPI.transactionAPI.announce(signedTx);
  }

  static announceBondedTransaction(
    signedTx: SignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    return AppState.chainAPI.transactionAPI.announceAggregateBonded(signedTx);
  }

  static announceCosignatureSignedTransaction(
    signedTx: CosignatureSignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    return AppState.chainAPI.transactionAPI.announceAggregateBondedCosignature(
      signedTx
    );
  }

  static getTransactionTypeName(type: number): string | null {
    let typeName = "";

    switch (type) {
      case TransactionType.ADDRESS_ALIAS:
        typeName = transactionTypeName.addressAlias.name;
        break;
      case TransactionType.ADD_EXCHANGE_OFFER:
        typeName = transactionTypeName.addExchangeOffer.name;
        break;
      case TransactionType.AGGREGATE_BONDED_V1:
        typeName = transactionTypeName.aggregateBonded.name;
        break;
      case TransactionType.AGGREGATE_COMPLETE_V1:
        typeName = transactionTypeName.aggregateComplete.name;
        break;
      case TransactionType.CHAIN_CONFIGURE:
        typeName = transactionTypeName.chainConfigure.name;
        break;
      case TransactionType.CHAIN_UPGRADE:
        typeName = transactionTypeName.chainUpgrade.name;
        break;
      case TransactionType.EXCHANGE_OFFER:
        typeName = transactionTypeName.exchangeOffer.name;
        break;
      case TransactionType.REMOVE_EXCHANGE_OFFER:
        typeName = transactionTypeName.removeExchangeOffer.name;
        break;
      case TransactionType.LINK_ACCOUNT:
        typeName = transactionTypeName.accountLink.name;
        break;
      case TransactionType.HASH_LOCK:
        typeName = transactionTypeName.lock.name;
        break;
      case TransactionType.MODIFY_ACCOUNT_METADATA:
        typeName = transactionTypeName.modifyAccountMetadata.name;
        break;
      case TransactionType.MODIFY_MOSAIC_METADATA:
        typeName = transactionTypeName.modifyMosaicMetadata.name;
        break;
      case TransactionType.MODIFY_NAMESPACE_METADATA:
        typeName = transactionTypeName.modifyNamespaceMetadata.name;
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
        typeName = transactionTypeName.modifyAccountRestrictionAddress.name;
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
        typeName = transactionTypeName.modifyAccountRestrictionMosaic.name;
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
        typeName = transactionTypeName.modifyAccountRestrictionOperation.name;
        break;
      case TransactionType.MODIFY_MULTISIG_ACCOUNT:
        typeName = transactionTypeName.modifyMultisigAccount.name;
        break;
      case TransactionType.MOSAIC_ALIAS:
        typeName = transactionTypeName.mosaicAlias.name;
        break;
      case TransactionType.MOSAIC_DEFINITION:
        typeName = transactionTypeName.mosaicDefinition.name;
        break;
      case TransactionType.MOSAIC_SUPPLY_CHANGE:
        typeName = transactionTypeName.mosaicSupplyChange.name;
        break;
      case TransactionType.REGISTER_NAMESPACE:
        typeName = transactionTypeName.registerNameSpace.name;
        break;
      case TransactionType.SECRET_LOCK:
        typeName = transactionTypeName.secretLock.name;
        break;
      case TransactionType.SECRET_PROOF:
        typeName = transactionTypeName.secretProof.name;
        break;
      case TransactionType.TRANSFER:
        typeName = transactionTypeName.transfer.name;
        break;
      case TransactionType.ACCOUNT_METADATA_V2:
        typeName = transactionTypeName.modifyAccountMetadata_v2.name;
        break;
      case TransactionType.MOSAIC_METADATA_V2:
        typeName = transactionTypeName.modifyMosaicMetadata_v2.name;
        break;
      case TransactionType.NAMESPACE_METADATA_V2:
        typeName = transactionTypeName.modifyNamespaceMetadata_v2.name;
        break;
      case TransactionType.MODIFY_MOSAIC_LEVY:
        typeName = transactionTypeName.modifyMosaicLevy.name;
        break;
      case TransactionType.REMOVE_MOSAIC_LEVY:
        typeName = transactionTypeName.removeRemoveLevy.name;
        break;

      case TransactionType.PLACE_SDA_EXCHANGE_OFFER:
        typeName = transactionTypeName.sdaExchangeOffer.name;
        break;

      case TransactionType.REMOVE_SDA_EXCHANGE_OFFER:
        typeName = transactionTypeName.sdaExchangeRemoveOffer.name;
        break;

      default:
        typeName = null;
        break;
    }

    return typeName;
  }

  static aggregateBondedTx(
    innerTX: InnerTransaction[],
    currentNodeTime?: UInt64
  ): AggregateTransaction {
    let txBuilder = AppState.buildTxn;
    return txBuilder.aggregateBonded(innerTX, currentNodeTime);
  }

  static lockFundTx(
    signedABT: SignedTransaction | TransactionHash
  ): HashLockTransaction {
    const nativeTokenNamespace = AppState.nativeToken.fullNamespace;
    const lockingAtomicFee =
      networkState.currentNetworkProfileConfig.lockedFundsPerAggregate ?? 0;
    let txBuilder = AppState.buildTxn;
    return txBuilder
      .hashLockBuilder()
      .transactionHash(signedABT)
      .duration(UInt64.fromUint(ChainConfigUtils.getABTMaxSafeDuration()))
      .mosaic(
        new Mosaic(
          new NamespaceId(nativeTokenNamespace),
          UInt64.fromUint(lockingAtomicFee)
        )
      )
      .build();
  }

  static announceLF_AND_addAutoAnnounceABT(
    lockFundTxSigned: SignedTransaction,
    signedAggregateBondedTx: SignedTransaction
  ): void {
    let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(
      signedAggregateBondedTx
    );
    autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(
      lockFundTxSigned.hash
    );
    autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
    autoAnnounceSignedTx.type = AnnounceType.BONDED;
    AppState.chainAPI.transactionAPI.announce(lockFundTxSigned);
    ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);
    AppState.isPendingTxnAnnounce = true;
  }

  static getLockFundFee(): number {
    let abtType = TransactionType.AGGREGATE_BONDED_V2;
    let txHash = new TransactionHash("0".repeat(64), abtType);
    const lockFundTx = TransactionUtils.lockFundTx(txHash);
    return lockFundTx.maxFee.compact();
  }

  static castToAggregate(tx: Transaction) {
    return tx as AggregateTransaction;
  }

  static extractConfirmedRelatedAddressByTransactionType(
    txn: Transaction
  ): Address[] {
    let addresses: Address[] = [];

    addresses.push(txn.signer.address);

    switch (txn.type) {
      case TransactionType.AGGREGATE_BONDED_V1:
      case TransactionType.AGGREGATE_COMPLETE_V1:
      case TransactionType.AGGREGATE_BONDED_V2:
      case TransactionType.AGGREGATE_COMPLETE_V2:
        {
          let aggregateTxn = txn as AggregateTransaction;
          let addressInDeep = aggregateTxn.innerTransactions.map(
            (x) => {
              return TransactionUtils.extractConfirmedRelatedAddressByTransactionType(
                x
              );
            }
          );
          let allNewAddress = addressInDeep.flat();
          addresses = addresses.concat(allNewAddress);
        }
        break;
      case TransactionType.ACCOUNT_METADATA_V2:
        break;
      case TransactionType.ADDRESS_ALIAS:
        break;
      case TransactionType.ADD_EXCHANGE_OFFER:
        {
        }
        break;
      case TransactionType.CHAIN_CONFIGURE:
        break;
      case TransactionType.CHAIN_UPGRADE:
        break;
      case TransactionType.EXCHANGE_OFFER:
        {
          let exchangeOffer = txn as ExchangeOfferTransaction;
          let allNewAddress = exchangeOffer.offers.map((x) => x.owner.address);
          addresses = addresses.concat(allNewAddress);
        }
        break;
      case TransactionType.LINK_ACCOUNT:
        {
          let tempTxn = txn as AccountLinkTransaction;
          let linkAccountAddress = PublicAccount.createFromPublicKey(
            tempTxn.remoteAccountKey,
            AppState.networkType, 1
          ).address;
          addresses.push(linkAccountAddress);
        }
        break;
      case TransactionType.HASH_LOCK:
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
        break;
      case TransactionType.MODIFY_MOSAIC_LEVY:
        break;
      case TransactionType.MODIFY_MULTISIG_ACCOUNT:
        let tempTxn = txn as ModifyMultisigAccountTransaction;
        let affectedAddress = tempTxn.modifications.map((x) => {
          return x.cosignatoryPublicAccount.address;
        });
        addresses = addresses.concat(affectedAddress);
        break;
      // case TransactionType.MODIFY_MOSAIC_METADATA:
      //   break;
      // case TransactionType.MODIFY_NAMESPACE_METADATA:
      //   break;
      // case TransactionType.MODIFY_ACCOUNT_METADATA:
      //   break;
      case TransactionType.MOSAIC_DEFINITION:
        break;
      case TransactionType.MOSAIC_ALIAS:
        break;
      case TransactionType.MOSAIC_METADATA_V2:
        break;
      case TransactionType.MOSAIC_SUPPLY_CHANGE:
        break;
      case TransactionType.NAMESPACE_METADATA_V2:
        break;
      case TransactionType.REGISTER_NAMESPACE:
        break;
      case TransactionType.REMOVE_EXCHANGE_OFFER:
        break;
      case TransactionType.REMOVE_MOSAIC_LEVY:
        break;
      case TransactionType.SECRET_LOCK:
        break;
      case TransactionType.SECRET_PROOF:
        {
          let tempTxn = txn as SecretProofTransaction;
          let recipientAddress = tempTxn.recipient;
          addresses.push(recipientAddress);
        }
        break;
      case TransactionType.TRANSFER:
        {
          let tempTxn = txn as TransferTransaction;
          if (tempTxn.recipient instanceof Address) {
            let recipientAddress = tempTxn.recipient as Address;
            addresses.push(recipientAddress);
          }
        }
        break;
    }

    return addresses;
  }

  static async signAbtWithTxnAndPassword(
    selectedAddress: string,
    selectedMultisigAddress: string,
    walletPassword: string,
    transaction?: string|string[],
    currentNodeTime?: UInt64
  ): Promise<{ txnPayload: string; hashLockTxnPayload?: string }> {
    return await TransactionUtils.signTxnWithPassword(
      selectedAddress,
      selectedMultisigAddress,
      walletPassword,
      transaction,
      currentNodeTime
    );
  }

  static signTxnWithPassword = async (
    selectedAddress: string,
    selectedMultisigAddress: string,
    walletPassword: string,
    transaction?: string|string[],
    currentNodeTime?: UInt64
  ): Promise<{ txnPayload: string; hashLockTxnPayload?: string }> => {
    const genHash = networkState.currentNetworkProfile.generationHash;

    let transactionBuilder = AppState.buildTxn;

    const accAddress = Address.createFromRawAddress(selectedAddress);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find(
      (account) => account.address == accAddress.plain()
    );
    const passwordInstance = WalletUtils.createPassword(walletPassword);
    let privateKey = WalletUtils.decryptPrivateKey(
      passwordInstance,
      accountDetails.encrypted,
      accountDetails.iv
    );
    const account = Account.createFromPrivateKey(
      privateKey,
      AppState.networkType,
      1
    );

    if (!selectedMultisigAddress && typeof transaction === "string") {
      // no cosigner, normal transaction
      let txn = TransactionMapping.createFromPayload(transaction)
      const signedTransaction = account.sign(txn, genHash);
      return { txnPayload: signedTransaction.payload };
    } else {
      // there is a cosigner, aggregate  bonded transaction
      let innerTxn = []
      const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(
        Address.createFromRawAddress(selectedMultisigAddress)
      );
      const multisigPublicAccount = PublicAccount.createFromPublicKey(
        accInfo.publicKey,
        AppState.networkType, 1
      );
      if(typeof transaction !== "string"){
        for(let i=0; i<transaction.length; ++i){
          innerTxn.push(TransactionMapping.createFromPayload(transaction[i]).toAggregate(multisigPublicAccount))
        }
      }
      else{
        let txn = TransactionMapping.createFromPayload(transaction)
        innerTxn = [txn.toAggregate(multisigPublicAccount)];
      }
      const aggregateBondedTransaction = transactionBuilder.aggregateBonded(
        innerTxn,
        currentNodeTime
      );
      const aggregateBondedTransactionSigned = account.sign(
        aggregateBondedTransaction,
        genHash
      );

      const hashLockTransaction = TransactionUtils.lockFundTx(
        aggregateBondedTransactionSigned
      );
      const hashLockTransactionSigned = account.sign(
        hashLockTransaction,
        genHash
      );
      return {
        txnPayload: aggregateBondedTransactionSigned.payload,
        hashLockTxnPayload: hashLockTransactionSigned.payload,
      };
    }
  };

  static confirmAnnounceTransaction = async (
    signedTxnPayload: string,
    signedHashLockTxnPayload: string
  ) => {
    const genHash = networkState.currentNetworkProfile.generationHash;
    if (!signedHashLockTxnPayload) {
      // normal transaction
      let signTxn = SignedTransaction.createFromPayload(
        signedTxnPayload,
        genHash
      );
      TransactionUtils.announceTransaction(signTxn);
    } else {
      // aggregate  bonded transaction
      const hashLockTransactionSigned = SignedTransaction.createFromPayload(
        signedHashLockTxnPayload,
        genHash
      );
      const aggregateBondedTransactionSigned =
        SignedTransaction.createFromPayload(signedTxnPayload, genHash);
      TransactionUtils.announceLF_AND_addAutoAnnounceABT(
        hashLockTransactionSigned,
        aggregateBondedTransactionSigned
      );
    }
  };
}

export const isMultiSig = (address) => {
  if (walletState.currentLoggedInWallet) {
    const account =
      walletState.currentLoggedInWallet.accounts.find(
        (account) => account.address == address
      ) ||
      walletState.currentLoggedInWallet.others.find(
        (account) => account.address == address
      );
    if (account) {
      const isMulti =
        account.getDirectParentMultisig().length > 0 ? true : false;
      return isMulti;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const findAccWithAddress = (address) => {
  if (!walletState.currentLoggedInWallet) {
    return null;
  }
  return walletState.currentLoggedInWallet.accounts.find(
    (acc) => acc.address == address
  );
};

export const findAcc = (publicKey) => {
  if (!walletState.currentLoggedInWallet) {
    return null;
  }
  return walletState.currentLoggedInWallet.accounts.find(
    (acc) => acc.publicKey == publicKey
  );
};
