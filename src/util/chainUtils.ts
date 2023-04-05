import {
  Convert,
  NetworkType,
  NamespaceId,
  MosaicId,
  Address,
  PublicAccount,
  CosignatureSignedTransaction,
  Statement,
  AccountInfo,
  Transaction,
  TransactionQueryParams,
  SignedTransaction,
  TransactionType,
  NamespaceName,
  MosaicInfo,
  NamespaceInfo,
  TransactionGroupType,
  TransactionSearch,
} from "tsjs-xpx-chain-sdk";
import type { NetworkConfig } from "../models/stores/chainProfileConfig";
import { ChainAPICall } from "../models/REST/chainAPICall";
import type { ChainConfigAPI } from "../models/REST/chainConfig";
import { networkState } from "../state/networkState";
import { computed } from "vue";
import { AppState } from "@/state/appState";
import type { LooseObject } from "./typeHelper";

const currentEndPoint = computed(() => networkState.selectedAPIEndpoint);
const connectionPort = computed(
  () => networkState.currentNetworkProfile?.httpPort
);
const currentNetworkType = computed(() => AppState.networkType);

export class ChainUtils {
  static buildWSEndpoint(endpoint: string, port: number | undefined) {
    const protocols = ["https:", "file:"];

    let requestProtocol = "ws";
    let usePort = port;

    if (protocols.includes(location.protocol)) {
      requestProtocol = "wss";
      usePort = 0;
    }

    return `${requestProtocol}://${endpoint}${usePort ? ":" + usePort : ""}`;

    // return location.protocol=='https:' ? `wss://${endpoint}` : `ws://${endpoint}:${port}`;
  }

  static buildAPIEndpoint(endpoint: string, port: number | undefined) {
    const protocols = ["https:", "file:"];

    let requestProtocol = "http";
    let usePort = port;

    if (protocols.includes(location.protocol)) {
      requestProtocol = "https";
      usePort = 0;
    }

    return `${requestProtocol}://${endpoint}${usePort ? ":" + usePort : ""}`;

    //return location.protocol=='https:' ? `https://${endpoint}` : `http://${endpoint}:${port}`;
  }

  static async getChainConfig(
    chainHeight: number,
    chainConfigAPI: ChainConfigAPI
  ): Promise<NetworkConfig | string> {
    const configString = await chainConfigAPI.getChainConfig(chainHeight);

    const regex = /[^=\n{1}]+=\s*(.*)/g;
    const configs = configString.networkConfig.match(regex);

    if (configs?.length) {
      const networkConfig: LooseObject = {};
      configs.forEach((data) => {
        const [config, value] = data.split("=");
        networkConfig[config.trim()] = value.trim();
      });
      const chainConfig = <NetworkConfig>{
        chainHeight: chainHeight,
        publicKey: networkConfig["publicKey"],
        blockGenerationTargetTime: networkConfig["blockGenerationTargetTime"],
        blockTimeSmoothingFactor: ChainUtils.convertConfigNumberToInteger(
          networkConfig["blockTimeSmoothingFactor"]
        ),
        greedDelta: Number(networkConfig["greedDelta"]),
        greedExponent: Number(networkConfig["greedExponent"]),
        importanceGrouping: ChainUtils.convertConfigNumberToInteger(
          networkConfig["importanceGrouping"]
        ),
        maxRollbackBlocks: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxRollbackBlocks"]
        ),
        maxDifficultyBlocks: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxDifficultyBlocks"]
        ),
        maxTransactionLifetime: networkConfig["maxTransactionLifetime"],
        maxBlockFutureTime: networkConfig["maxBlockFutureTime"],
        maxMosaicAtomicUnits: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxMosaicAtomicUnits"]
        ),
        totalChainImportance: ChainUtils.convertConfigNumberToInteger(
          networkConfig["totalChainImportance"]
        ),
        minHarvesterBalance: ChainUtils.convertConfigNumberToInteger(
          networkConfig["minHarvesterBalance"]
        ),
        harvestBeneficiaryPercentage: ChainUtils.convertConfigNumberToInteger(
          networkConfig["harvestBeneficiaryPercentage"]
        ),
        blockPruneInterval: ChainUtils.convertConfigNumberToInteger(
          networkConfig["blockPruneInterval"]
        ),
        maxTransactionsPerBlock: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxTransactionsPerBlock"]
        ),
        maxTransactionsPerAggregate: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxTransactionsPerAggregate"]
        ),
        maxCosignaturesPerAggregate: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxCosignaturesPerAggregate"]
        ),
        enableStrictCosignatureCheck:
          networkConfig["enableStrictCosignatureCheck"] === "true"
            ? true
            : false,
        enableBondedAggregateSupport:
          networkConfig["enableBondedAggregateSupport"] === "true"
            ? true
            : false,
        maxBondedTransactionLifetime:
          networkConfig["maxBondedTransactionLifetime"],
        maxBlockChainConfigSize: networkConfig["maxBlockChainConfigSize"],
        maxSupportedEntityVersionsSize:
          networkConfig["maxSupportedEntityVersionsSize"],
        minPercentageOfApproval: ChainUtils.convertConfigNumberToInteger(
          networkConfig["minPercentageOfApproval"]
        ),
        minPercentageOfRemoval: ChainUtils.convertConfigNumberToInteger(
          networkConfig["minPercentageOfRemoval"]
        ),
        maxOfferDuration: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxOfferDuration"]
        ),
        longOfferKey: networkConfig["longOfferKey"],
        lockedFundsPerAggregate: ChainUtils.convertConfigNumberToInteger(
          networkConfig["lockedFundsPerAggregate"]
        ),
        maxHashLockDuration: networkConfig["maxHashLockDuration"],
        maxSecretLockDuration: networkConfig["maxSecretLockDuration"],
        minProofSize: ChainUtils.convertConfigNumberToInteger(
          networkConfig["minProofSize"]
        ),
        maxProofSize: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxProofSize"]
        ),
        maxFields: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxFields"]
        ),
        maxFieldKeySize: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxFieldKeySize"]
        ),
        maxFieldValueSize: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxFieldValueSize"]
        ),
        maxMosaicsPerAccount: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxMosaicsPerAccount"]
        ),
        maxMosaicDuration: networkConfig["maxMosaicDuration"],
        maxMosaicDivisibility: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxMosaicDivisibility"]
        ),
        mosaicRentalFeeSinkPublicKey:
          networkConfig["mosaicRentalFeeSinkPublicKey"],
        mosaicRentalFee: ChainUtils.convertConfigNumberToInteger(
          networkConfig["mosaicRentalFee"]
        ),
        maxMultisigDepth: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxMultisigDepth"]
        ),
        maxCosignersPerAccount: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxCosignersPerAccount"]
        ),
        maxCosignedAccountsPerAccount: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxCosignedAccountsPerAccount"]
        ),
        newCosignersMustApprove:
          networkConfig["newCosignersMustApprove"] === "true" ? true : false,
        maxNameSize: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxNameSize"]
        ),
        maxNamespaceDuration: networkConfig["maxNamespaceDuration"],
        namespaceGracePeriodDuration:
          networkConfig["namespaceGracePeriodDuration"],
        reservedRootNamespaceNames: networkConfig["reservedRootNamespaceNames"],
        namespaceRentalFeeSinkPublicKey:
          networkConfig["namespaceRentalFeeSinkPublicKey"],
        rootNamespaceRentalFeePerBlock: ChainUtils.convertConfigNumberToInteger(
          networkConfig["rootNamespaceRentalFeePerBlock"]
        ),
        childNamespaceRentalFee: ChainUtils.convertConfigNumberToInteger(
          networkConfig["childNamespaceRentalFee"]
        ),
        maxChildNamespaces: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxChildNamespaces"]
        ),
        maxOperationDuration: networkConfig["maxOperationDuration"],
        maxPropertyValues: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxPropertyValues"]
        ),
        maxMessageSize: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxMessageSize"]
        ),
        maxMosaicsSize: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxMosaicsSize"]
        ),
        minUpgradePeriod: ChainUtils.convertConfigNumberToInteger(
          networkConfig["minUpgradePeriod"]
        ),
        maxFilesOnDrive: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxFilesOnDrive"]
        ),
        verificationFee: ChainUtils.convertConfigNumberToInteger(
          networkConfig["verificationFee"]
        ),
        verificationDuration: ChainUtils.convertConfigNumberToInteger(
          networkConfig["verificationDuration"]
        ),
        downloadDuration: ChainUtils.convertConfigNumberToInteger(
          networkConfig["downloadDuration"]
        ),
        downloadCacheEnabled:
          networkConfig["downloadCacheEnabled"] === "true" ? true : false,
        maxSuperContractsOnDrive: ChainUtils.convertConfigNumberToInteger(
          networkConfig["maxSuperContractsOnDrive"]
        ),
      };

      return chainConfig;
    } else {
      return "Error parsing config";
    }
  }

  static convertConfigNumberToInteger(amount: string) {
    if (!amount) {
      return 0;
    }
    return parseInt(amount.split("'").join(""));
  }

  static getNetworkType(id: number | undefined): NetworkType {
    switch (id) {
      case NetworkType.MAIN_NET:
        return NetworkType.MAIN_NET;
        break;
      case NetworkType.TEST_NET:
        return NetworkType.TEST_NET;
        break;
      case NetworkType.PRIVATE:
        return NetworkType.PRIVATE;
        break;
      case NetworkType.PRIVATE_TEST:
        return NetworkType.PRIVATE_TEST;
        break;

      default:
        return NetworkType.TEST_NET;
        break;
    }
  }

  static isPrivateKeyValid(privateKey: string) {
    if (privateKey.length !== 64 && privateKey.length !== 66) {
      return false;
    } else if (!Convert.isHexString(privateKey)) {
      return false;
    } else {
      return true;
    }
  }

  static async getLinkedMosaicId(namespaceId: NamespaceId): Promise<MosaicId> {
    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const mosaicId: MosaicId =
      await chainRESTCall.namespaceAPI.getLinkedMosaicId(namespaceId);

    return mosaicId;
  }

  static async getAccountInfo(address: Address): Promise<AccountInfo> {
    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const accountInfo = await chainRESTCall.accountAPI.getAccountInfo(address);

    return accountInfo;
  }

  static async getAccountTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const transactions = await chainRESTCall.accountAPI.transactions(
      publicAccount,
      queryParams
    );

    return transactions;
  }

  static async searchTransactions(
    txnGroupType: TransactionGroupType,
    queryParams?: TransactionQueryParams
  ): Promise<TransactionSearch> {
    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const transactions = await chainRESTCall.transactionAPI.searchTransactions(
      txnGroupType,
      queryParams
    );

    return transactions;
  }

  static async getAccountUnconfirmedTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const transactions = await chainRESTCall.accountAPI.unconfirmedTransactions(
      publicAccount,
      queryParams
    );

    return transactions;
  }

  static async getAccountPartialTransactions(
    publicAccount: PublicAccount,
    queryParams?: TransactionQueryParams
  ): Promise<Transaction[]> {
    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const transactions =
      await chainRESTCall.accountAPI.aggregateBondedTransactions(
        publicAccount,
        queryParams
      );

    return transactions;
  }

  static announceTransaction(signedTx: SignedTransaction): void {
    if (signedTx.type === TransactionType.AGGREGATE_BONDED) {
      throw new Error("Invalid, cannot be aggregate bonded transaction");
    }

    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    chainRESTCall.transactionAPI.announce(signedTx);
  }

  static announceBondedTransaction(signedTx: SignedTransaction): void {
    if (signedTx.type !== TransactionType.AGGREGATE_BONDED) {
      throw new Error("Invalid, not aggregate bonded transaction");
    }

    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    chainRESTCall.transactionAPI.announceAggregateBonded(signedTx);
  }

  static announceCosignTransaction(
    signedTx: CosignatureSignedTransaction
  ): void {
    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    chainRESTCall.transactionAPI.announceAggregateBondedCosignature(signedTx);
  }

  static async getAccountInfoByAddress(address: string): Promise<AccountInfo> {
    const addressInstance = Address.createFromRawAddress(address);

    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const accountInfo = await chainRESTCall.accountAPI.getAccountInfo(
      addressInstance
    );

    return accountInfo;
  }

  static async getAccountInfoByPublicKey(
    publicKey: string
  ): Promise<AccountInfo> {
    const addressInstance = Address.createFromPublicKey(
      publicKey,
      currentNetworkType.value
    );

    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const accountInfo = await chainRESTCall.accountAPI.getAccountInfo(
      addressInstance
    );

    return accountInfo;
  }

  static async getNamespaceLinkedAddress(
    namespaceIdHex: string
  ): Promise<Address> {
    const namespaceId = NamespaceId.createFromEncoded(namespaceIdHex);

    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const address = await chainRESTCall.namespaceAPI.getLinkedAddress(
      namespaceId
    );

    return address;
  }

  static async getNamespaceFullName(
    namespaceIdHex: string
  ): Promise<NamespaceName> {
    const namespaceId = NamespaceId.createFromEncoded(namespaceIdHex);
    const namespaceIds = [namespaceId];

    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const namespaceNames = await chainRESTCall.namespaceAPI.getNamespacesName(
      namespaceIds
    );

    return namespaceNames[0];
  }

  static async getNamespacesFullName(
    namespaceIds: NamespaceId[]
  ): Promise<NamespaceName[]> {
    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const namespaceNames = await chainRESTCall.namespaceAPI.getNamespacesName(
      namespaceIds
    );

    return namespaceNames;
  }

  static async getAssetProperties(assetIdHex: string): Promise<MosaicInfo> {
    const assetId = new MosaicId(assetIdHex);

    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const assetInfo = await chainRESTCall.assetAPI.getMosaic(assetId);

    return assetInfo;
  }

  static async getAssetsProperties(
    assetIds: MosaicId[]
  ): Promise<MosaicInfo[]> {
    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const assetInfos = await chainRESTCall.assetAPI.getMosaics(assetIds);

    return assetInfos;
  }

  static async getBlockReceipt(blockHeight: number): Promise<Statement> {
    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const statement = await chainRESTCall.blockAPI.getBlockReceipts(
      blockHeight
    );

    return statement;
  }

  static async getNamespaceInfo(
    namespaceId: NamespaceId
  ): Promise<NamespaceInfo> {
    const chainRESTCall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value)
    );

    const namespaceInfo = await chainRESTCall.namespaceAPI.getNamespace(
      namespaceId
    );

    return namespaceInfo;
  }
}
