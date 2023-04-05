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
  type InnerTransaction,
  SignedTransaction,
  CosignatureSignedTransaction,
  TransactionGroupType,
  TransactionSearch,
  TransactionHash,
  HashLockTransaction,
  TransactionAnnounceResponse,
  ExchangeOfferTransaction,
  AccountLinkTransaction,
  ModifyMultisigAccountTransaction,
  SecretProofTransaction,
  TransferTransaction,
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
import type { WalletAccount } from "@/models/walletAccount";




export const transactionTypeName = {
  transfer: {
    id: TransactionType.TRANSFER,
    name: 'Transfer'
  },
  registerNameSpace: {
    id: TransactionType.REGISTER_NAMESPACE,
    name: 'Register Namespace'
  },
  mosaicDefinition: {
    id: TransactionType.MOSAIC_DEFINITION,
    name: 'Mosaic Definition'
  },
  mosaicSupplyChange: {
    id: TransactionType.MOSAIC_SUPPLY_CHANGE,
    name: 'Mosaic Supply Change'
  },
  modifyMultisigAccount: {
    id: TransactionType.MODIFY_MULTISIG_ACCOUNT,
    name: 'Modify Multisig Account'
  },
  aggregateComplete: {
    id: TransactionType.AGGREGATE_COMPLETE,
    name: 'Aggregate Complete'
  },
  aggregateBonded: {
    id: TransactionType.AGGREGATE_BONDED,
    name: 'Aggregate Bonded'
  },
  mosaicAlias: {
    id: TransactionType.MOSAIC_ALIAS,
    name: 'Mosaic Alias'
  },
  addressAlias: {
    id: TransactionType.ADDRESS_ALIAS,
    name: 'Address Alias'
  },
  lock: {
    id: TransactionType.LOCK,
    name: 'LockFund'
  },
  accountLink: {
    id: TransactionType.LINK_ACCOUNT,
    name: 'Account Link'
  },
  exchangeOffer: {
    id: TransactionType.EXCHANGE_OFFER,
    name: 'Exchange Offer'
  },
  addExchangeOffer: {
    id: TransactionType.ADD_EXCHANGE_OFFER,
    name: 'Add Exchange Offer'
  },
  removeExchangeOffer: {
    id: TransactionType.REMOVE_EXCHANGE_OFFER,
    name: 'Remove Exchange Offer'
  },
  modifyAccountMetadata: {
    id: TransactionType.MODIFY_ACCOUNT_METADATA,
    name: 'Modify Account Metadata'
  },
  modifyMosaicMetadata: {
    id: TransactionType.MODIFY_MOSAIC_METADATA,
    name: 'Modify Asset Metadata'
  },
  modifyNamespaceMetadata: {
    id: TransactionType.MODIFY_NAMESPACE_METADATA,
    name: 'Modify Namespace Metadata'
  },
  modifyAccountRestrictionAddress: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS,
    name: 'Modify Account Restriction Address'
  },
  modifyAccountRestrictionMosaic: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC,
    name: 'Modify Account Restriction Asset'
  },
  modifyAccountRestrictionOperation: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION,
    name: 'Modify Account Restriction Operation'
  },
  chainConfigure: {
    id: TransactionType.CHAIN_CONFIGURE,
    name: 'Chain Configure'
  },
  chainUpgrade: {
    id: TransactionType.CHAIN_UPGRADE,
    name: 'Chain Upgrade'
  },
  secretLock: {
    id: TransactionType.SECRET_LOCK,
    name: "Secret lock"
  },
  secretProof: {
    id: TransactionType.SECRET_PROOF,
    name: "Secret proof"
  },
  modifyAccountMetadata_v2: {
    id: TransactionType.ACCOUNT_METADATA_V2,
    name:'Account Metadata'
  },
  modifyMosaicMetadata_v2: {
    id: TransactionType.MOSAIC_METADATA_V2,
    name: 'Sirius Digital Assets Metadata'
  },
  modifyNamespaceMetadata_v2: {
    id: TransactionType.NAMESPACE_METADATA_V2,
    name: 'Namespace Metadata'
  },
  modifyMosaicLevy: {
    id: TransactionType.MODIFY_MOSAIC_LEVY,
    name: 'Modify Mosaic Levy'
  },
  removeRemoveLevy: {
    id: TransactionType.REMOVE_MOSAIC_LEVY,
    name: 'Remove Mosaic Levy'
  }
};

export class TransactionUtils {
  static getTransactionTypeNameByEnum(
    transactionType: TransactionType
  ): string {
    const transactionTypes = Object.values(transactionTypeName);
    const foundType = transactionTypes.find(
      (txnType) => txnType.id == transactionType
    );

    return foundType ? foundType.name : "UNKNOWN";
  }

  static getFee(transaction: Transaction): number {
    return transaction.maxFee.compact();
  }

  static getFakeEncryptedMessageSize(message: string): number {
    return EncryptedMessage.create(
      message,
      PublicAccount.createFromPublicKey("0".repeat(64), AppState.networkType),
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
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const transactions = await AppState.chainAPI.accountAPI.transactions(
      publicAccount,
      queryParams
    );

    return transactions;
  }

  static async searchTransactions(
    txnGroupType: TransactionGroupType,
    queryParams?: TransactionQueryParams
  ): Promise<TransactionSearch> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const transactionsResult =
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
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const transactions =
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
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const transactions =
      await AppState.chainAPI.accountAPI.aggregateBondedTransactions(
        publicAccount,
        queryParams
      );

    return transactions;
  }

  static announceTransaction(
    signedTx: SignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    return AppState.chainAPI.transactionAPI.announce(signedTx);
  }

  static announceBondedTransaction(
    signedTx: SignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    return AppState.chainAPI.transactionAPI.announceAggregateBonded(signedTx);
  }

  static announceCosignatureSignedTransaction(
    signedTx: CosignatureSignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    return AppState.chainAPI.transactionAPI.announceAggregateBondedCosignature(
      signedTx
    );
  }

  static getTransactionTypeName(type: number): string {
    let typeName: string | null = "";

    switch (type) {
      case TransactionType.ADDRESS_ALIAS:
        typeName = transactionTypeName.addressAlias.name;
        break;
      case TransactionType.ADD_EXCHANGE_OFFER:
        typeName = transactionTypeName.addExchangeOffer.name;
        break;
      case TransactionType.AGGREGATE_BONDED:
        typeName = transactionTypeName.aggregateBonded.name;
        break;
      case TransactionType.AGGREGATE_COMPLETE:
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
      case TransactionType.LOCK:
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

      default:
        typeName = "UNKNOWN";
        break;
    }

    return typeName;
  }

  static aggregateBondedTx(innerTX: InnerTransaction[]): AggregateTransaction {
    const txBuilder = AppState.buildTxn;
    if (!txBuilder) {
      throw new Error("Service unavailable");
    }
    return txBuilder.aggregateBonded(innerTX);
  }

  static lockFundTx(
    signedABT: SignedTransaction | TransactionHash
  ): HashLockTransaction {
    const txBuilder = AppState.buildTxn;
    if (!networkState.currentNetworkProfileConfig || !txBuilder) {
      throw new Error("Service unavailable");
    }
    const nativeTokenNamespace = AppState.nativeToken.fullNamespace;
    const lockingAtomicFee =
      networkState.currentNetworkProfileConfig.lockedFundsPerAggregate ?? 0;
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
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(
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
    const abtType = TransactionType.AGGREGATE_BONDED;
    const txHash = new TransactionHash("0".repeat(64), abtType);
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
    if (!txn.signer) {
      throw new Error("Service unavailable");
    }
    addresses.push(txn.signer.address);

    switch (txn.type) {
      case TransactionType.AGGREGATE_BONDED:
        {
          const aggregateBondedTxn = txn as AggregateTransaction;
          const addressInDeep = aggregateBondedTxn.innerTransactions.map(
            (x) => {
              return TransactionUtils.extractConfirmedRelatedAddressByTransactionType(
                x
              );
            }
          );
          const allNewAddress = addressInDeep.flat();
          addresses = addresses.concat(allNewAddress);
        }
        break;
      case TransactionType.AGGREGATE_COMPLETE:
        {
          const aggregateCompleteTxn = txn as AggregateTransaction;
          const addressInDeep = aggregateCompleteTxn.innerTransactions.map(
            (x) => {
              return TransactionUtils.extractConfirmedRelatedAddressByTransactionType(
                x
              );
            }
          );
          const allNewAddress = addressInDeep.flat();
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
          const exchangeOffer = txn as ExchangeOfferTransaction;
          const allNewAddress = exchangeOffer.offers.map(
            (x) => x.owner.address
          );
          addresses = addresses.concat(allNewAddress);
        }
        break;
      case TransactionType.LINK_ACCOUNT:
        {
          const tempTxn = txn as AccountLinkTransaction;
          const linkAccountAddress = PublicAccount.createFromPublicKey(
            tempTxn.remoteAccountKey,
            AppState.networkType
          ).address;
          addresses.push(linkAccountAddress);
        }
        break;
      case TransactionType.LOCK:
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
        const tempTxn = txn as ModifyMultisigAccountTransaction;
        const affectedAddress = tempTxn.modifications.map((x) => {
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
          const tempTxn = txn as SecretProofTransaction;
          const recipientAddress = tempTxn.recipient;
          addresses.push(recipientAddress);
        }
        break;
      case TransactionType.TRANSFER:
        {
          const tempTxn = txn as TransferTransaction;
          if (tempTxn.recipient instanceof Address) {
            const recipientAddress = tempTxn.recipient as Address;
            addresses.push(recipientAddress);
          }
        }
        break;
    }

    return addresses;
  }
}

export const isMultiSig = (address: string): boolean => {
  const wallet = walletState.currentLoggedInWallet;
  if (!wallet) {
    throw new Error("Service unavailable");
  }
  const account =
    wallet.accounts.find((account) => account.address == address) ||
    wallet.others.find((account) => account.address == address);
  if (account) {
    return account.getDirectParentMultisig().length > 0;
  }
  return false;
};

export const findAccWithAddress = (
  address: string
): WalletAccount | undefined => {
  if (!walletState.currentLoggedInWallet) {
    throw new Error("Service unavailable");
  }
  return walletState.currentLoggedInWallet.accounts.find(
    (acc) => acc.address == address
  );
};

export const findAcc = (publicKey: string): WalletAccount | undefined => {
  if (!walletState.currentLoggedInWallet) {
    throw new Error("Service unavailable");
  }
  return walletState.currentLoggedInWallet.accounts.find(
    (acc) => acc.publicKey == publicKey
  );
};
