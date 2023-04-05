import { StoreProperties } from "./storeProperties";

export interface NetworkConfig {
  chainHeight: number | null;
  publicKey: string;
  blockGenerationTargetTime: string;
  blockTimeSmoothingFactor: number | null;
  greedDelta: number | null;
  greedExponent: number | null;
  importanceGrouping: number | null;
  maxRollbackBlocks: number | null;
  maxDifficultyBlocks: number | null;
  maxTransactionLifetime: string;
  maxBlockFutureTime: string;
  maxMosaicAtomicUnits: number | null;
  totalChainImportance: number | null;
  minHarvesterBalance: number | null;
  harvestBeneficiaryPercentage: number | null;
  blockPruneInterval: number | null;
  maxTransactionsPerBlock: number | null;
  maxTransactionsPerAggregate: number | null;
  maxCosignaturesPerAggregate: number | null;
  enableStrictCosignatureCheck: boolean | null;
  enableBondedAggregateSupport: boolean | null;
  maxBondedTransactionLifetime: string;
  maxBlockChainConfigSize: string;
  maxSupportedEntityVersionsSize: string;
  minPercentageOfApproval: number | null;
  minPercentageOfRemoval: number | null;
  maxOfferDuration: number | null;
  longOfferKey: string;
  lockedFundsPerAggregate: number | null;
  maxHashLockDuration: string;
  maxSecretLockDuration: string;
  minProofSize: number | null;
  maxProofSize: number | null;
  maxFields: number | null;
  maxFieldKeySize: number | null;
  maxFieldValueSize: number | null;
  maxMosaicsPerAccount: number | null;
  maxMosaicDuration: string;
  maxMosaicDivisibility: number | null;
  mosaicRentalFeeSinkPublicKey: string;
  mosaicRentalFee: number | null;
  maxMultisigDepth: number | null;
  maxCosignersPerAccount: number | null;
  maxCosignedAccountsPerAccount: number | null;
  newCosignersMustApprove: boolean | null;
  maxNameSize: number | null;
  maxNamespaceDuration: string;
  namespaceGracePeriodDuration: string;
  reservedRootNamespaceNames: string;
  namespaceRentalFeeSinkPublicKey: string;
  rootNamespaceRentalFeePerBlock: number | null;
  childNamespaceRentalFee: number | null;
  maxChildNamespaces: number | null;
  maxOperationDuration: string;
  maxPropertyValues: number | null;
  maxMessageSize: number | null;
  maxMosaicsSize: number | null;
  minUpgradePeriod: number | null;
  maxFilesOnDrive: number | null;
  verificationFee: number | null;
  verificationDuration: number | null;
  downloadDuration: number | null;
  downloadCacheEnabled: boolean | null;
  maxSuperContractsOnDrive: number | null;
}

export class ChainProfileConfig
  extends StoreProperties
  implements NetworkConfig
{
  chainHeight: number | null = null;
  publicKey: string = "";
  blockGenerationTargetTime: string = "";
  blockTimeSmoothingFactor: number | null = null;
  greedDelta: number | null = null;
  greedExponent: number | null = null;
  importanceGrouping: number | null = null;
  maxRollbackBlocks: number | null = null;
  maxDifficultyBlocks: number | null = null;
  maxTransactionLifetime: string = "";
  maxBlockFutureTime: string = "";
  maxMosaicAtomicUnits: number | null = null;
  totalChainImportance: number | null = null;
  minHarvesterBalance: number | null = null;
  harvestBeneficiaryPercentage: number | null = null;
  blockPruneInterval: number | null = null;
  maxTransactionsPerBlock: number | null = null;
  maxTransactionsPerAggregate: number | null = null;
  maxCosignaturesPerAggregate: number | null = null;
  enableStrictCosignatureCheck: boolean | null = null;
  enableBondedAggregateSupport: boolean | null = null;
  maxBondedTransactionLifetime: string = "";
  maxBlockChainConfigSize: string = "";
  maxSupportedEntityVersionsSize: string = "";
  minPercentageOfApproval: number | null = null;
  minPercentageOfRemoval: number | null = null;
  maxOfferDuration: number | null = null;
  longOfferKey: string = "";
  lockedFundsPerAggregate: number | null = null;
  maxHashLockDuration: string = "";
  maxSecretLockDuration: string = "";
  minProofSize: number | null = null;
  maxProofSize: number | null = null;
  maxFields: number | null = null;
  maxFieldKeySize: number | null = null;
  maxFieldValueSize: number | null = null;
  maxMosaicsPerAccount: number | null = null;
  maxMosaicDuration: string = "";
  maxMosaicDivisibility: number | null = null;
  mosaicRentalFeeSinkPublicKey: string = "";
  mosaicRentalFee: number | null = null;
  maxMultisigDepth: number | null = null;
  maxCosignersPerAccount: number | null = null;
  maxCosignedAccountsPerAccount: number | null = null;
  newCosignersMustApprove: boolean | null = null;
  maxNameSize: number | null = null;
  maxNamespaceDuration: string = "";
  namespaceGracePeriodDuration: string = "";
  reservedRootNamespaceNames: string = "";
  namespaceRentalFeeSinkPublicKey: string = "";
  rootNamespaceRentalFeePerBlock: number | null = null;
  childNamespaceRentalFee: number | null = null;
  maxChildNamespaces: number | null = null;
  maxOperationDuration: string = "";
  maxPropertyValues: number | null = null;
  maxMessageSize: number | null = null;
  maxMosaicsSize: number | null = null;
  minUpgradePeriod: number | null = null;
  maxFilesOnDrive: number | null = null;
  verificationFee: number | null = null;
  verificationDuration: number | null = null;
  downloadDuration: number | null = null;
  downloadCacheEnabled: boolean | null = null;
  maxSuperContractsOnDrive: number | null = null;

  constructor(storeName: string) {
    super(storeName + "_config");
  }

  updateConfig(config: NetworkConfig): void {
    Object.assign(this, config);
  }
}
