import { ChainConfigHttp, ChainHttp, AccountHttp, NamespaceHttp, MosaicHttp, Convert,
  NetworkType } from "tsjs-xpx-chain-sdk";
import { NetworkConfig } from "../models/stores/chainProfileConfig";

export class ChainUtils{

    static buildWSEndpoint(endpoint :string, port: number | undefined){

      if(!port)
        port = 3000;

      return location.protocol=='https:' ? `wss://${endpoint}` : `ws://${endpoint}:${port}`;
    }

    static buildAPIEndpoint(endpoint :string, port: number | undefined){

      if(!port)
        port = 3000;

      return location.protocol=='https:' ? `https://${endpoint}` : `http://${endpoint}:${port}`;
    }

    static async getChainConfig(chainHeight: number, chainConfigHttp: ChainConfigHttp): Promise<NetworkConfig | string>{
        return new Promise((resolve, reject)=>{
          chainConfigHttp.getChainConfig(chainHeight).subscribe((configString)=>{
            const regex = /[^=\n{1}]+=\s*(.*)/g;
            const configs = configString.networkConfig.match(regex);

            if(configs){
              const networkConfig = configs.reduce((result, data)=>{
                const [config, value] = data.split("=");
                result[config.trim()] = value.trim();
                return result;
              }, {});
              const chainConfig = <NetworkConfig>
              {
                chainHeight: chainHeight,
                publicKey: networkConfig['publicKey'],
                blockGenerationTargetTime: networkConfig['blockGenerationTargetTime'],
                blockTimeSmoothingFactor: ChainUtils.convertConfigNumberToInteger(networkConfig['blockTimeSmoothingFactor']),
                greedDelta: Number(networkConfig['greedDelta']),
                greedExponent: Number(networkConfig['greedExponent']),
                importanceGrouping: ChainUtils.convertConfigNumberToInteger(networkConfig['importanceGrouping']),
                maxRollbackBlocks: ChainUtils.convertConfigNumberToInteger(networkConfig['maxRollbackBlocks']),
                maxDifficultyBlocks: ChainUtils.convertConfigNumberToInteger(networkConfig['maxDifficultyBlocks']),
                maxTransactionLifetime: networkConfig['maxTransactionLifetime'],
                maxBlockFutureTime: networkConfig['maxBlockFutureTime'],
                maxMosaicAtomicUnits: ChainUtils.convertConfigNumberToInteger(networkConfig['maxMosaicAtomicUnits']),
                totalChainImportance: ChainUtils.convertConfigNumberToInteger(networkConfig['totalChainImportance']),
                minHarvesterBalance: ChainUtils.convertConfigNumberToInteger(networkConfig['minHarvesterBalance']),
                harvestBeneficiaryPercentage: ChainUtils.convertConfigNumberToInteger(networkConfig['harvestBeneficiaryPercentage']),
                blockPruneInterval: ChainUtils.convertConfigNumberToInteger(networkConfig['blockPruneInterval']),
                maxTransactionsPerBlock: ChainUtils.convertConfigNumberToInteger(networkConfig['maxTransactionsPerBlock']),
                maxTransactionsPerAggregate: ChainUtils.convertConfigNumberToInteger(networkConfig['maxTransactionsPerAggregate']),
                maxCosignaturesPerAggregate: ChainUtils.convertConfigNumberToInteger(networkConfig['maxCosignaturesPerAggregate']),
                enableStrictCosignatureCheck: networkConfig['enableStrictCosignatureCheck'] === 'true' ? true : false,
                enableBondedAggregateSupport: networkConfig['enableBondedAggregateSupport'] === 'true' ? true : false,
                maxBondedTransactionLifetime: networkConfig['maxBondedTransactionLifetime'],
                maxBlockChainConfigSize: networkConfig['maxBlockChainConfigSize'],
                maxSupportedEntityVersionsSize: networkConfig['maxSupportedEntityVersionsSize'],
                minPercentageOfApproval: ChainUtils.convertConfigNumberToInteger(networkConfig['minPercentageOfApproval']),
                minPercentageOfRemoval: ChainUtils.convertConfigNumberToInteger(networkConfig['minPercentageOfRemoval']),
                maxOfferDuration: ChainUtils.convertConfigNumberToInteger(networkConfig['maxOfferDuration']),
                longOfferKey: networkConfig['longOfferKey'],
                lockedFundsPerAggregate: ChainUtils.convertConfigNumberToInteger(networkConfig['lockedFundsPerAggregate']),
                maxHashLockDuration: networkConfig['maxHashLockDuration'],
                maxSecretLockDuration: networkConfig['maxSecretLockDuration'],
                minProofSize: ChainUtils.convertConfigNumberToInteger(networkConfig['minProofSize']),
                maxProofSize: ChainUtils.convertConfigNumberToInteger(networkConfig['maxProofSize']),
                maxFields: ChainUtils.convertConfigNumberToInteger(networkConfig['maxFields']),
                maxFieldKeySize: ChainUtils.convertConfigNumberToInteger(networkConfig['maxFieldKeySize']),
                maxFieldValueSize: ChainUtils.convertConfigNumberToInteger(networkConfig['maxFieldValueSize']),
                maxMosaicsPerAccount: ChainUtils.convertConfigNumberToInteger(networkConfig['maxMosaicsPerAccount']),
                maxMosaicDuration: networkConfig['maxMosaicDuration'],
                maxMosaicDivisibility: ChainUtils.convertConfigNumberToInteger(networkConfig['maxMosaicDivisibility']),
                mosaicRentalFeeSinkPublicKey: networkConfig['mosaicRentalFeeSinkPublicKey'],
                mosaicRentalFee: ChainUtils.convertConfigNumberToInteger(networkConfig['mosaicRentalFee']),
                maxMultisigDepth: ChainUtils.convertConfigNumberToInteger(networkConfig['maxMultisigDepth']),
                maxCosignersPerAccount: ChainUtils.convertConfigNumberToInteger(networkConfig['maxCosignersPerAccount']),
                maxCosignedAccountsPerAccount: ChainUtils.convertConfigNumberToInteger(networkConfig['maxCosignedAccountsPerAccount']),
                newCosignersMustApprove: networkConfig['newCosignersMustApprove'] === 'true' ? true : false,
                maxNameSize: ChainUtils.convertConfigNumberToInteger(networkConfig['maxNameSize']),
                maxNamespaceDuration: networkConfig['maxNamespaceDuration'],
                namespaceGracePeriodDuration: networkConfig['namespaceGracePeriodDuration'],
                reservedRootNamespaceNames: networkConfig['reservedRootNamespaceNames'],
                namespaceRentalFeeSinkPublicKey: networkConfig['namespaceRentalFeeSinkPublicKey'],
                rootNamespaceRentalFeePerBlock: ChainUtils.convertConfigNumberToInteger(networkConfig['rootNamespaceRentalFeePerBlock']),
                childNamespaceRentalFee: ChainUtils.convertConfigNumberToInteger(networkConfig['childNamespaceRentalFee']),
                maxChildNamespaces: ChainUtils.convertConfigNumberToInteger(networkConfig['maxChildNamespaces']),
                maxOperationDuration: networkConfig['maxOperationDuration'],
                maxPropertyValues: ChainUtils.convertConfigNumberToInteger(networkConfig['maxPropertyValues']),
                maxMessageSize: ChainUtils.convertConfigNumberToInteger(networkConfig['maxMessageSize']),
                maxMosaicsSize: ChainUtils.convertConfigNumberToInteger(networkConfig['maxMosaicsSize']),
                minUpgradePeriod: ChainUtils.convertConfigNumberToInteger(networkConfig['minUpgradePeriod']),
                maxFilesOnDrive: ChainUtils.convertConfigNumberToInteger(networkConfig['maxFilesOnDrive']),
                verificationFee: ChainUtils.convertConfigNumberToInteger(networkConfig['verificationFee']),
                verificationDuration: ChainUtils.convertConfigNumberToInteger(networkConfig['verificationDuration']),
                downloadDuration: ChainUtils.convertConfigNumberToInteger(networkConfig['downloadDuration']),
                downloadCacheEnabled: networkConfig['downloadCacheEnabled'] === 'true' ? true : false,
                maxSuperContractsOnDrive: ChainUtils.convertConfigNumberToInteger(networkConfig['maxSuperContractsOnDrive']),
              };
              resolve(chainConfig);
            }
          },
          (error)=>{
            reject(new Error(error));
          });
        });
    }

    static convertConfigNumberToInteger(amount){
        if(!amount){
            return 0;
        }
        return parseInt(amount.split("'").join(""));
    }

    static getNetworkType(id: number | undefined): NetworkType{

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

    static isPrivateKeyValid(privateKey) {
      if (privateKey.length !== 64 && privateKey.length !== 66) {
        return false;
      } else if (!Convert.isHexString(privateKey)) {
        return false;
      } else {
        return true;
      }
    }
}