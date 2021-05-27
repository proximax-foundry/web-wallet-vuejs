import { StoreProperties } from "./storeProperties";

export class ChainProfileConfig extends StoreProperties {

    chainHeight: number = null;
    publicKey: string = '';
    blockGenerationTargetTime: string = '';
    blockTimeSmoothingFactor: number = null;
    greedDelta: number = null;
    greedExponent: number = null;
    importanceGrouping: number = null;
    maxRollbackBlocks: number = null;
    maxDifficultyBlocks: number = null;
    maxTransactionLifetime: string = '';
    maxBlockFutureTime: string = '';
    maxMosaicAtomicUnits: number = null;
    totalChainImportance: number = null;
    minHarvesterBalance: number = null;
    harvestBeneficiaryPercentage: number = null;
    blockPruneInterval: number = null;
    maxTransactionsPerBlock: number = null;
    maxTransactionsPerAggregate: number = null;
    maxCosignaturesPerAggregate: number = null;
    enableStrictCosignatureCheck: boolean = null;
    enableBondedAggregateSupport: boolean = null;
    maxBondedTransactionLifetime: string = '';
    maxBlockChainConfigSize: string = '';
    maxSupportedEntityVersionsSize: string = '';
    minPercentageOfApproval: number = null;
    minPercentageOfRemoval: number = null;
    maxOfferDuration: number = null;
    longOfferKey: string = '';
    lockedFundsPerAggregate: number = null;
    maxHashLockDuration: string = '';
    maxSecretLockDuration: string = '';
    minProofSize: number = null;
    maxProofSize: number = null;
    maxFields: number = null;
    maxFieldKeySize: number = null;
    maxFieldValueSize: number = null;
    maxMosaicsPerAccount: number = null;
    maxMosaicDuration: string = '';
    maxMosaicDivisibility: number = null;
    mosaicRentalFeeSinkPublicKey: string = '';
    mosaicRentalFee: number = null;
    maxMultisigDepth: number = null;
    maxCosignersPerAccount: number = null;
    maxCosignedAccountsPerAccount: number = null;
    newCosignersMustApprove: boolean = null;
    maxNameSize: number = null;
    maxNamespaceDuration: string = '';
    namespaceGracePeriodDuration: string = '';
    reservedRootNamespaceNames: string = '';
    namespaceRentalFeeSinkPublicKey: string = '';
    rootNamespaceRentalFeePerBlock: number = null;
    childNamespaceRentalFee: number = null;
    maxChildNamespaces: number = null;
    maxOperationDuration: string = '';
    maxPropertyValues: number = null;
    maxMessageSize: number = null;
    maxMosaicsSize: number = null;
    minUpgradePeriod: number = null;
    maxFilesOnDrive: number = null;
    verificationFee: number = null;
    verificationDuration: number = null;
    downloadDuration: number = null;
    downloadCacheEnabled: boolean  = null;
    maxSuperContractsOnDrive: number = null

    constructor(storeName: string){
        super(storeName + "_config");
    }

    updateConfig(config: object){
        Object.assign(this, config);
    }
}