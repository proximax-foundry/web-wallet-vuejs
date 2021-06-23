import { readonly, computed } from "vue";
import {
  Account,
  Address,
  Deadline,
  EncryptedMessage,
  // NetworkCurrencyMosaic,
  // FeeCalculationStrategy,
  Mosaic,
  MosaicId,
  UInt64,
  MosaicProperties,
  MosaicSupplyType,
  // MosaicService,
  MosaicNonce,
  PlainMessage,
  TransferTransaction,
  TransactionHttp,
  TransactionBuilderFactory,
  PublicAccount,
  AccountHttp,
  AccountInfo,
  FeeCalculationStrategy,
  NetworkType,
  Transaction,
  TransactionType,
  AggregateTransaction,
  CosignatureTransaction
} from "tsjs-xpx-chain-sdk";
// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';
import { walletState } from "../state/walletState";
import { networkState } from "../state/networkState";
import { ChainUtils } from "../util/chainUtils";
import { WalletUtils } from "../util/walletUtils";
import { ChainAPICall } from "../models/REST/chainAPICall";
import { BuildTransactions } from "../util/buildTransactions";
import { Helper } from "./typeHelper";

const divisibility = 6;
const xpxMosaicId = "";
const lockFundDuration = 10000;

const networkAPIEndpoint = computed(() => ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));
const localNetworkType = computed(() => ChainUtils.getNetworkType(networkState.currentNetworkProfile?.network.type));

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
  }
};

export class TransactionUtils {

  static async getAccInfo(address: Address, accountHttp: AccountHttp): Promise<AccountInfo> {

    const chainAPICall = new ChainAPICall(networkAPIEndpoint.value);

    const accountInfo = await chainAPICall.accountAPI.getAccountInfo(address);
    // console.log(publicKey);
    return accountInfo;
  }

  static getFee = (transaction: Transaction) => {

    return transaction.maxFee.compact();
  }

  static getFakeEncryptedMessageSize = (message: string) => {
    return EncryptedMessage.create(message, PublicAccount.createFromPublicKey("0".repeat(64), ChainUtils.getNetworkType(localNetworkType.value)), "0".repeat(64)).size();
  }

  static getPlainMessageSize = (message: string) => {
    return PlainMessage.create(message).size();
  }

  static signTransaction(transaction: Transaction, account: Account, generationHash: string) {
    return account.sign(transaction, generationHash);
  }

  static aggregateToCosignatureTransaction(aggregateTransaction: AggregateTransaction) {
    return CosignatureTransaction.create(aggregateTransaction);
  }

  static cosignTransaction(transactionToCosign: AggregateTransaction, account: Account) {
    const cosignatureTransaction = TransactionUtils.aggregateToCosignatureTransaction(transactionToCosign);

    return account.signCosignatureTransaction(cosignatureTransaction);
  }
}