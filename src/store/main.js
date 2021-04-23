import { reactive, readonly, ref } from 'vue';
import { ChainProfile } from './storeClasses'
export class Store {
    constructor(storeName) {
        this.storeName = storeName;
        let data = this.data();
        this.state = reactive(data);
    }
    getState() {
        return readonly(this.state);
    }
}
export class PersistentStore extends Store {
    constructor(storeName) {
        super(storeName);
        this.storeName = storeName;
        this.isInitialized = ref(false);
    }

    init() {
        if (!this.isInitialized.value) {
            let stateFromLocalStorage = localStorage.getItem(this.storeName);

            if (stateFromLocalStorage) {
                    if(typeof stateFromLocalStorage === 'string' || stateFromLocalStorage instanceof String){
                        Object.assign(this.state, JSON.parse(stateFromLocalStorage));
                    }
                    else{
                        Object.assign(this.state, stateFromLocalStorage);
                    }
            }
            this.isInitialized.value = true;
        }
    }
    getIsInitialized() {
        return this.isInitialized;
    }

    saveToLocalStorage(){
        const stateCopy = Object.assign({}, this.state);
        localStorage.setItem(this.storeName, JSON.stringify(stateCopy));
    }
}

export class ChainProfileStore extends PersistentStore {
    data() {
        return new ChainProfile().serialize();
    }

    getNetworkType() {
        return this.state.network.type;
    }

    getNetworkAPINodes() {
        return this.state.apiNodes;
    }

    getNetworkCurrency() {
        return this.state.network.currency;
    }

    setNetworkCurrency(currencyObj) {
        this.state.network.currency = currencyObj;
    }

    getNetworkCurrencyName() {
        return this.state.network.currency.name;
    }

    setNetworkCurrencyName(name) {
        this.state.network.currency.name = name;
    }

    getHTTPPort(){
        return this.state.httpPort;
    }

    getChainExplorer() {
        return this.state.chainExplorer;
    }

    getGenerationHash() {
        return this.state.generationHash;
    }

    getVersion() {
        return this.state.version;
    }

    setVersion(version) {
        this.state.version = version;
    }
    
}

class ChainProfilesNameStore extends PersistentStore {
    data() {
        return {
            names : []
        };
    }

    getNames() {
        return this.state.names;
    }

    setNames(names) {
        this.state.names = names;
    }

    replaceFirst2Names(names) {
        this.state.names[0] = names[0];
        this.state.names[1] = names[1];
    }
}

let _chainProfilesNameStore = new ChainProfilesNameStore("ChainProfilesName"); 

export const chainProfilesNameStore = _chainProfilesNameStore;

export class ChainProfileConfigStore extends PersistentStore {
    data() {
        return {
            chainHeight: null,
            publicKey: '',
            blockGenerationTargetTime: '',
            blockTimeSmoothingFactor: null,
            greedDelta: null,
            greedExponent: null,
            importanceGrouping: null,
            maxRollbackBlocks: null,
            maxDifficultyBlocks: null,
            maxTransactionLifetime: '',
            maxBlockFutureTime: '',
            maxMosaicAtomicUnits: null,
            totalChainImportance: null,
            minHarvesterBalance: null,
            harvestBeneficiaryPercentage: null,
            blockPruneInterval: null,
            maxTransactionsPerBlock: null,
            maxTransactionsPerAggregate: null,
            maxCosignaturesPerAggregate: null,
            enableStrictCosignatureCheck: null, // boolean
            enableBondedAggregateSupport: null, // boolean
            maxBondedTransactionLifetime: '', 
            maxBlockChainConfigSize: '',
            maxSupportedEntityVersionsSize: '',
            minPercentageOfApproval: null,
            minPercentageOfRemoval: null,
            maxOfferDuration: null,
            longOfferKey: '',
            lockedFundsPerAggregate: null,
            maxHashLockDuration: '',
            maxSecretLockDuration: '',
            minProofSize: null,
            maxProofSize: null,
            maxFields: null,
            maxFieldKeySize: null,
            maxFieldValueSize: null,
            maxMosaicsPerAccount: null,
            maxMosaicDuration: '',
            maxMosaicDivisibility: null,
            mosaicRentalFeeSinkPublicKey: '',
            mosaicRentalFee: null,
            maxMultisigDepth: null,
            maxCosignersPerAccount: null,
            maxCosignedAccountsPerAccount: null,
            newCosignersMustApprove: null, // boolean
            maxNameSize: null,
            maxNamespaceDuration: '',
            namespaceGracePeriodDuration: '',
            reservedRootNamespaceNames: '',  
            namespaceRentalFeeSinkPublicKey: '',
            rootNamespaceRentalFeePerBlock: null,
            childNamespaceRentalFee: null,
            maxChildNamespaces: null,
            maxOperationDuration: '',
            maxPropertyValues: null,
            maxMessageSize: null,
            maxMosaicsSize: null,
            minUpgradePeriod: null,
            maxFilesOnDrive: null,
            verificationFee: null,
            verificationDuration: null,
            downloadDuration: null,
            downloadCacheEnabled: null, // boolean
            maxSuperContractsOnDrive: null
        };
    }
}