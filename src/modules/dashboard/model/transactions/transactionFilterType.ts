import { TransactionType } from "tsjs-xpx-chain-sdk";

export class TransactionFilterTypes {
  static getTransferTypes() {
    return [TransactionType.TRANSFER];
  }

  static getAliasTypes() {
    return [TransactionType.ADDRESS_ALIAS, TransactionType.MOSAIC_ALIAS];
  }

  static getMetadataTypes() {
    return [
      TransactionType.ACCOUNT_METADATA_V2,
      TransactionType.MOSAIC_METADATA_V2,
      TransactionType.NAMESPACE_METADATA_V2,
    ];
  }

  static getAccountTypes() {
    return [TransactionType.MODIFY_MULTISIG_ACCOUNT];
  }

  static getSecretTypes() {
    return [TransactionType.SECRET_LOCK, TransactionType.SECRET_PROOF];
  }

  static getNamespaceTypes() {
    return [TransactionType.REGISTER_NAMESPACE];
  }

  static getAssetTypes() {
    return [
      TransactionType.MODIFY_MOSAIC_LEVY,
      TransactionType.REMOVE_MOSAIC_LEVY,
      TransactionType.MOSAIC_DEFINITION,
      TransactionType.MOSAIC_SUPPLY_CHANGE,
    ];
  }

  static getRestrictionTypes() {
    return [
      TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS,
      TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC,
      TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION,
    ];
  }

  static getLockTypes() {
    return [TransactionType.LOCK];
  }

  static getLinkTypes() {
    return [TransactionType.LINK_ACCOUNT];
  }

  static getExchangeTypes() {
    return [
      TransactionType.EXCHANGE_OFFER,
      TransactionType.ADD_EXCHANGE_OFFER,
      TransactionType.REMOVE_EXCHANGE_OFFER,
    ];
  }

  static getChainTypes() {
    return [TransactionType.CHAIN_CONFIGURE, TransactionType.CHAIN_UPGRADE];
  }

  static getAggregateTypes() {
    return [
      TransactionType.AGGREGATE_BONDED,
      TransactionType.AGGREGATE_COMPLETE,
    ];
  }
}

export enum TransactionFilterType {
  TRANSFER = "Transfer",
  ACCOUNT = "Account",
  AGGREGATE = "Aggregate",
  ALIAS = "Alias",
  ASSET = "Asset",
  NAMESPACE = "Namespace",
  METADATA = "Metadata",
  EXCHANGE = "Exchange",
  LOCK = "Lock",
  LINK = "Link",
  RESTRICTION = "Restriction",
  SECRET = "Secret",
  CHAIN = "Chain",
}
