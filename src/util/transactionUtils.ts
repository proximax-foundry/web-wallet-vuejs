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
  NamespaceId,
  Transaction,
  TransactionType,
  AggregateTransaction,
  CosignatureTransaction,
  QueryParams,
  AddressAliasTransaction,
  AddExchangeOfferTransaction,
  ChainConfigTransaction,
  ChainUpgradeTransaction,
  ExchangeOfferTransaction,
  RemoveExchangeOfferTransaction,
  AccountLinkTransaction,
  LockFundsTransaction,
  ModifyMetadataTransaction,
  AccountMosaicRestrictionModificationTransaction,
  AccountOperationRestrictionModificationTransaction,
  AccountAddressRestrictionModificationTransaction,
  ModifyMultisigAccountTransaction,
  MosaicAliasTransaction,
  MosaicDefinitionTransaction,
  MosaicSupplyChangeTransaction,
  RegisterNamespaceTransaction,
  SecretLockTransaction,
  SecretProofTransaction,
  InnerTransaction,
  ExchangeOfferType,
  HashType,
  RestrictionType,
  AccountRestrictionModification,
  SignedTransaction,
  CosignatureSignedTransaction
} from "tsjs-xpx-chain-sdk";
// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';
import { walletState } from "../state/walletState";
import { networkState } from "../state/networkState";
import { ChainUtils } from "../util/chainUtils";
import { WalletUtils } from "../util/walletUtils";
import { ChainAPICall } from "../models/REST/chainAPICall";
import { BuildTransactions } from "../util/buildTransactions";
import { Helper } from "./typeHelper";
import { Duration } from "js-joda";
import { faBreadSlice } from "@fortawesome/free-solid-svg-icons";

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

  static async getAccInfo(address: Address): Promise<AccountInfo> {

    const chainAPICall = new ChainAPICall(networkAPIEndpoint.value);

    const accountInfo = await chainAPICall.accountAPI.getAccountInfo(address);
    // console.log(publicKey);
    return accountInfo;
  }

  static getTransactionTypeNameByEnum(transactionType: TransactionType): string{

    let name = "";

    for(let key in transactionTypeName){
      if(transactionType === transactionTypeName[key].id){
        name = transactionTypeName[key].name;
        break;
      }
    }

    return name;
  }

  static getFee(transaction: Transaction): number{

    return transaction.maxFee.compact();
  }

  static getFakeEncryptedMessageSize(message: string): number{
    return EncryptedMessage.create(message, PublicAccount.createFromPublicKey("0".repeat(64), ChainUtils.getNetworkType(localNetworkType.value)), "0".repeat(64)).size();
  }

  static getPlainMessageSize(message: string): number{
    return PlainMessage.create(message).size();
  }

  static signTransaction(transaction: Transaction, account: Account, generationHash: string): SignedTransaction {
    return account.sign(transaction, generationHash);
  }

  static aggregateToCosignatureTransaction(aggregateTransaction: AggregateTransaction): CosignatureTransaction {
    return CosignatureTransaction.create(aggregateTransaction);
  }

  static cosignTransaction(transactionToCosign: AggregateTransaction, account: Account): CosignatureSignedTransaction {
    const cosignatureTransaction = TransactionUtils.aggregateToCosignatureTransaction(transactionToCosign);

    return account.signCosignatureTransaction(cosignatureTransaction);
  }

  static async getTransactions(publicAccount: PublicAccount, queryParams?: QueryParams): Promise<Transaction[]> {

    let transactions = await ChainUtils.getAccountTransactions(publicAccount, queryParams);

    return transactions;
  }

  static async getUnconfirmedTransactions(publicAccount: PublicAccount, queryParams?: QueryParams): Promise<Transaction[]> {

    let transactions = await ChainUtils.getAccountUnconfirmedTransactions(publicAccount, queryParams);

    return transactions;
  }

  static announceTransaction(signedTx: SignedTransaction): void {

    ChainUtils.announceTransaction(signedTx);
  }

  static announceBondedTransaction(signedTx: SignedTransaction): void {

    ChainUtils.announceBondedTransaction(signedTx);
  }

  static getTransactionTypeName(type: number): string | null {

    let typeName = "";

    switch (type) {
      case TransactionType.ADDRESS_ALIAS:
        typeName = transactionTypeName.addressAlias.name
        break;
      case TransactionType.ADD_EXCHANGE_OFFER:
        typeName = transactionTypeName.addExchangeOffer.name
        break;
      case TransactionType.AGGREGATE_BONDED:
        typeName = transactionTypeName.aggregateBonded.name
        break;
      case TransactionType.AGGREGATE_COMPLETE:
        typeName = transactionTypeName.aggregateComplete.name
        break;
      case TransactionType.CHAIN_CONFIGURE:
        typeName = transactionTypeName.chainConfigure.name
        break;
      case TransactionType.CHAIN_UPGRADE:
        typeName = transactionTypeName.chainUpgrade.name
        break;
      case TransactionType.EXCHANGE_OFFER:
        typeName = transactionTypeName.exchangeOffer.name
        break;
      case TransactionType.REMOVE_EXCHANGE_OFFER:
        typeName = transactionTypeName.removeExchangeOffer.name
        break;
      case TransactionType.LINK_ACCOUNT:
        typeName = transactionTypeName.accountLink.name
        break;
      case TransactionType.LOCK:
        typeName = transactionTypeName.lock.name
        break;
      case TransactionType.MODIFY_ACCOUNT_METADATA:
        typeName = transactionTypeName.modifyAccountMetadata.name
        break;
      case TransactionType.MODIFY_MOSAIC_METADATA:
        typeName = transactionTypeName.modifyMosaicMetadata.name
        break;
      case TransactionType.MODIFY_NAMESPACE_METADATA:
        typeName = transactionTypeName.modifyNamespaceMetadata.name
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
        typeName = transactionTypeName.modifyAccountRestrictionAddress.name
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
        typeName = transactionTypeName.modifyAccountRestrictionMosaic.name
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
        typeName = transactionTypeName.modifyAccountRestrictionOperation.name
        break;
      case TransactionType.MODIFY_MULTISIG_ACCOUNT:
        typeName = transactionTypeName.modifyMultisigAccount.name
        break;
      case TransactionType.MOSAIC_ALIAS:
        typeName = transactionTypeName.mosaicAlias.name
        break;
      case TransactionType.MOSAIC_DEFINITION:
        typeName = transactionTypeName.mosaicDefinition.name
        break;
      case TransactionType.MOSAIC_SUPPLY_CHANGE:
        typeName = transactionTypeName.mosaicSupplyChange.name
        break;
      case TransactionType.REGISTER_NAMESPACE:
        typeName = transactionTypeName.registerNameSpace.name
        break;
      case TransactionType.SECRET_LOCK:
        typeName = transactionTypeName.secretLock.name
        break;
      case TransactionType.SECRET_PROOF:
        typeName = transactionTypeName.secretProof.name
        break;
      case TransactionType.TRANSFER:
        typeName = transactionTypeName.transfer.name
        break;

      default:
        typeName = null;
        break;
    }

    return typeName;
  }
}