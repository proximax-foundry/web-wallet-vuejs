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
  MosaicId,
  MosaicNames
} from "tsjs-xpx-chain-sdk";
import { AppState } from "@/state/appState";
import { ChainConfigUtils } from "./chainConfigUtils";
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";
import { AnnounceType, AutoAnnounceSignedTransaction, HashAnnounceBlock } from "@/state/listenerState";
import { networkState } from "@/state/networkState";
import i18n from "@/i18n";


const {t} = i18n.global
export const transactionTypeName = {
  transfer: {
    id: TransactionType.TRANSFER,
    name: t('general.transfer')
  },
  registerNameSpace: {
    id: TransactionType.REGISTER_NAMESPACE,
    name: t('namespace.registerNamespace')
  },
  mosaicDefinition: {
    id: TransactionType.MOSAIC_DEFINITION,
    name: t('transaction.sdaDefinition')
  },
  mosaicSupplyChange: {
    id: TransactionType.MOSAIC_SUPPLY_CHANGE,
    name: t('transaction.sdaSupplyChange')
  },
  modifyMultisigAccount: {
    id: TransactionType.MODIFY_MULTISIG_ACCOUNT,
    name: t('transaction.modifyMultisig')
  },
  aggregateComplete: {
    id: TransactionType.AGGREGATE_COMPLETE,
    name: t('transaction.aggregateComplete')
  },
  aggregateBonded: {
    id: TransactionType.AGGREGATE_BONDED,
    name: t('transaction.aggregateBonded')
  },
  mosaicAlias: {
    id: TransactionType.MOSAIC_ALIAS,
    name: t('transaction.sdaAlias')
  },
  addressAlias: {
    id: TransactionType.ADDRESS_ALIAS,
    name: t('transaction.addressAlias')
  },
  lock: {
    id: TransactionType.LOCK,
    name: t('general.lockFund')
  },
  accountLink: {
    id: TransactionType.LINK_ACCOUNT,
    name: t('transaction.accountLink')
  },
  exchangeOffer: {
    id: TransactionType.EXCHANGE_OFFER,
    name: t('transaction.exchangeOffer')
  },
  addExchangeOffer: {
    id: TransactionType.ADD_EXCHANGE_OFFER,
    name: t('transaction.addExchangeOffer')
  },
  removeExchangeOffer: {
    id: TransactionType.REMOVE_EXCHANGE_OFFER,
    name: t('transaction.removeExchangeOffer')
  },
  modifyAccountMetadata: {
    id: TransactionType.MODIFY_ACCOUNT_METADATA,
    name: t('transaction.modifyAccMetadata')
  },
  modifyMosaicMetadata: {
    id: TransactionType.MODIFY_MOSAIC_METADATA,
    name: t('transaction.modifySdaMetadata')
  },
  modifyNamespaceMetadata: {
    id: TransactionType.MODIFY_NAMESPACE_METADATA,
    name: t('transaction.modifyNsMetadata')
  },
  modifyAccountRestrictionAddress: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS,
    name: t('transaction.modifyAddressRestriction')
  },
  modifyAccountRestrictionMosaic: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC,
    name: t('transaction.modifySdaRestriction')
  },
  modifyAccountRestrictionOperation: {
    id: TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION,
    name: t('transaction.modifyOperationRestriction')
  },
  chainConfigure: {
    id: TransactionType.CHAIN_CONFIGURE,
    name: t('transaction.chainConfigure')
  },
  chainUpgrade: {
    id: TransactionType.CHAIN_UPGRADE,
    name: t('transaction.chainUpgrade')
  },
  secretLock: {
    id: TransactionType.SECRET_LOCK,
    name: t('transaction.secretLock')
  },
  secretProof: {
    id: TransactionType.SECRET_PROOF,
    name: t('transaction.secretProof')
  },
  modifyAccountMetadata_v2: {
    id: TransactionType.ACCOUNT_METADATA_V2,
    name:t('transaction.accountMetadata')
  },
  modifyMosaicMetadata_v2: {
    id: TransactionType.MOSAIC_METADATA_V2,
    name: t('transaction.sdaMetadata')
  },
  modifyNamespaceMetadata_v2: {
    id: TransactionType.NAMESPACE_METADATA_V2,
    name: t('transaction.namespaceMetadata')
  },
  modifyMosaicLevy: {
    id: TransactionType.MODIFY_MOSAIC_LEVY,
    name: t('transaction.modifySdaLevy')
  },
  removeRemoveLevy: {
    id: TransactionType.REMOVE_MOSAIC_LEVY,
    name: t('transaction.removeSdaLevy')
  }
};

export class TransactionUtils {

  static async getAssetsName(mosaicIds: MosaicId[]): Promise<MosaicNames[]>{
    let assetNames = await AppState.chainAPI.assetAPI.getMosaicsNames(mosaicIds);

    return assetNames;
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
    return EncryptedMessage.create(message, PublicAccount.createFromPublicKey("0".repeat(64), AppState.networkType), "0".repeat(64)).size();
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

  static async getTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]> {

    let transactions = await AppState.chainAPI.accountAPI.transactions(publicAccount, queryParams);

    return transactions;
  }

  static async searchTransactions(txnGroupType: TransactionGroupType, queryParams?: TransactionQueryParams): Promise<TransactionSearch> {

    let transactionsResult = await AppState.chainAPI.transactionAPI.searchTransactions(txnGroupType, queryParams);

    return transactionsResult;
  }

  static async getUnconfirmedTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]> {

    let transactions = await  AppState.chainAPI.accountAPI.unconfirmedTransactions(publicAccount, queryParams);

    return transactions;
  }

  static async getPartialTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]> {

    let transactions = await AppState.chainAPI.accountAPI.aggregateBondedTransactions(publicAccount, queryParams);

    return transactions;
  }

  static announceTransaction(signedTx: SignedTransaction): Promise<TransactionAnnounceResponse>{

    return AppState.chainAPI.transactionAPI.announce(signedTx);
  }

  static announceBondedTransaction(signedTx: SignedTransaction): Promise<TransactionAnnounceResponse> {

    return AppState.chainAPI.transactionAPI.announceAggregateBonded(signedTx);
  }

  static announceCosignatureSignedTransaction(signedTx: CosignatureSignedTransaction): Promise<TransactionAnnounceResponse>{

    return AppState.chainAPI.transactionAPI.announceAggregateBondedCosignature(signedTx);
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
      case TransactionType.ACCOUNT_METADATA_V2:
        typeName = transactionTypeName.modifyAccountMetadata_v2.name
        break;
      case TransactionType.MOSAIC_METADATA_V2:
        typeName = transactionTypeName.modifyMosaicMetadata_v2.name
        break;
      case TransactionType.NAMESPACE_METADATA_V2:
        typeName = transactionTypeName.modifyNamespaceMetadata_v2.name
        break;
      case TransactionType.MODIFY_MOSAIC_LEVY:
        typeName = transactionTypeName.modifyMosaicLevy.name
        break;
      case TransactionType.REMOVE_MOSAIC_LEVY:
        typeName = transactionTypeName.removeRemoveLevy.name
        break;  

      default:
        typeName = null;
        break;
    }

    return typeName;
  }

  static aggregateBondedTx(innerTX :InnerTransaction[]) :AggregateTransaction{
    let txBuilder = AppState.buildTxn;
    return txBuilder.aggregateBonded(innerTX)
  }

  static lockFundTx(signedABT :SignedTransaction | TransactionHash) :HashLockTransaction{
    const nativeTokenNamespace = AppState.nativeToken.fullNamespace
    const lockingAtomicFee = networkState.currentNetworkProfileConfig.lockedFundsPerAggregate ?? 0;
    let txBuilder = AppState.buildTxn 
    return txBuilder.hashLockBuilder()
    .transactionHash(signedABT)
    .duration(UInt64.fromUint(ChainConfigUtils.getABTMaxSafeDuration()))
    .mosaic(new Mosaic(new NamespaceId(nativeTokenNamespace), UInt64.fromUint(lockingAtomicFee)))
    .build()
  }

  static announceLF_AND_addAutoAnnounceABT ( lockFundTxSigned :SignedTransaction, signedAggregateBondedTx :SignedTransaction ) :void {
    let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(signedAggregateBondedTx);
    autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(lockFundTxSigned.hash);
    autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
    autoAnnounceSignedTx.type = AnnounceType.BONDED; 
    AppState.chainAPI.transactionAPI.announce(lockFundTxSigned);
    ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);
    AppState.isPendingTxnAnnounce = true;
  }

  static getLockFundFee() :number {
    let abtType = TransactionType.AGGREGATE_BONDED
    let txHash = new TransactionHash("0".repeat(64),abtType)
    const lockFundTx = TransactionUtils.lockFundTx(txHash)
    return lockFundTx.maxFee.compact();
  }  

  static castToAggregate(tx :Transaction){
    return tx as AggregateTransaction;
  }
  
  static extractConfirmedRelatedAddressByTransactionType(txn: Transaction): Address[]{
    let addresses: Address[] = [];

    addresses.push(txn.signer.address);

    switch(txn.type){
      case TransactionType.AGGREGATE_BONDED:{
        let aggregateBondedTxn = txn as AggregateTransaction; 
        let addressInDeep = aggregateBondedTxn.innerTransactions.map(x =>{
          return TransactionUtils.extractConfirmedRelatedAddressByTransactionType(x);
        });
        let allNewAddress = addressInDeep.flat();
        addresses = addresses.concat(allNewAddress);
      }  break;
      case TransactionType.AGGREGATE_COMPLETE:{
        let aggregateCompleteTxn = txn as AggregateTransaction; 
        let addressInDeep = aggregateCompleteTxn.innerTransactions.map(x =>{
          return TransactionUtils.extractConfirmedRelatedAddressByTransactionType(x);
        });
        let allNewAddress = addressInDeep.flat();
        addresses = addresses.concat(allNewAddress);
      }  break;
      case TransactionType.ACCOUNT_METADATA_V2:
        break;
      case TransactionType.ADDRESS_ALIAS:
        break;
      case TransactionType.ADD_EXCHANGE_OFFER:{
      }
        break;
      case TransactionType.CHAIN_CONFIGURE:
        break;
      case TransactionType.CHAIN_UPGRADE:
        break;
      case TransactionType.EXCHANGE_OFFER:{
        let exchangeOffer = txn as ExchangeOfferTransaction;
        let allNewAddress = exchangeOffer.offers.map(x => x.owner.address);
        addresses = addresses.concat(allNewAddress);
      }
        break;
      case TransactionType.LINK_ACCOUNT:{
        let tempTxn = txn as AccountLinkTransaction;
        let linkAccountAddress = PublicAccount.createFromPublicKey(tempTxn.remoteAccountKey, AppState.networkType).address;
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
        let tempTxn = txn as ModifyMultisigAccountTransaction;
        let affectedAddress = tempTxn.modifications.map(x=>{
          return x.cosignatoryPublicAccount.address
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
      case TransactionType.SECRET_PROOF:{
        let tempTxn = txn as SecretProofTransaction;
        let recipientAddress = tempTxn.recipient;
        addresses.push(recipientAddress);
      }
        break;
      case TransactionType.TRANSFER:{
        let tempTxn = txn as TransferTransaction;
        if(tempTxn.recipient instanceof Address){
          let recipientAddress = tempTxn.recipient as Address;
          addresses.push(recipientAddress);
        }
      }  break;
    }

    return addresses;
  }
}

