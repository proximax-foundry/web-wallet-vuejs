const walletKey = 'sw';

class StoreProperties{

    constructor(storeName){
        this.storeName = storeName;
    }

    init() {
        let stateFromLocalStorage = localStorage.getItem(this.storeName);

        if (stateFromLocalStorage) {
                if(typeof stateFromLocalStorage === 'string' || stateFromLocalStorage instanceof String){
                    Object.assign(this, JSON.parse(stateFromLocalStorage));
                }
                else{
                    Object.assign(this, stateFromLocalStorage);
                }
        }
    }

    saveToLocalStorage(){
        const stateCopy = Object.assign({}, this);
        delete stateCopy.storeName;
        localStorage.setItem(this.storeName, JSON.stringify(stateCopy));
    }
}

export class ChainProfile extends StoreProperties{

    constructor(storeName){
        super(storeName);
        this.version = '0.0.0';
        this.apiNodes = [];
        this.httpPort = 3000;
        this.generationHash = "";
        this.network = new Network();
        this.chainExplorer = new ChainExplorer();
    }

    getVersion(){
        return this.version;
    }

    serialize(){
        return {
            version: this.version,
            apiNodes: this.apiNodes,
            httpPort: this.httpPort,
            generationHash: this.generationHash,
            network: this.network.serialize(),
            chainExplorer: this.chainExplorer.serialize()
        };
    }
}

export class Network{

    constructor(){
        this.type = 168;
        this.currency = new Currency();
    }

    serialize(){
        return {
            type: this.type,
            currency: this.currency.serialize()
        };
    }
}

export class Currency{

    constructor(){
        this.name = "XPX";
        this.namespace = "prx.xpx";
        this.mosaicId = "";
        this.namespaceId = "bffb42a19116bdf6";
        this.divisibility = 6;
    }

    serialize(){
        return {
            name: this.name,
            namespace: this.namespace,
            mosaicId: this.mosaicId,
            namespaceId: this.namespaceId,
            divisibility: this.divisibility
        };
    }
}

export class ChainExplorer{

    constructor(){
        this.url = "https://bctestnetexplorer.xpxsirius.io";
        this.blockRoute = "#/result/blockHeight";
        this.publicKeyRoute = "#/result/publicKey";
        this.addressRoute = "#/result/address";
        this.hashRoute = "#/result/hash";
        this.namespaceInfoRoute = "#/result/namespaceInfo";
        this.assetInfoRoute = "#/result/assetInfo";
        this.payloadInfoRoute = "#/result/payloadInfo";
    }

    serialize(){
        return {
            url: this.url,
            blockRoute: this.blockRoute,
            publicKeyRoute: this.publicKeyRoute,
            addressRoute: this.addressRoute,
            hashRoute: this.hashRoute,
            namespaceInfoRoute: this.namespaceInfoRoute,
            assetInfoRoute: this.assetInfoRoute,
            payloadInfoRoute: this.payloadInfoRoute
        };
    }
}

export class ChainProfileConfig extends StoreProperties {
    constructor(storeName){
        super(storeName);
        this.chainHeight = null;
        this.publicKey = '';
        this.blockGenerationTargetTime = '';
        this.blockTimeSmoothingFactor = null;
        this.greedDelta = null;
        this.greedExponent = null;
        this.importanceGrouping = null;
        this.maxRollbackBlocks = null;
        this.maxDifficultyBlocks = null;
        this.maxTransactionLifetime = '';
        this.maxBlockFutureTime = '';
        this.maxMosaicAtomicUnits = null;
        this.totalChainImportance = null;
        this.minHarvesterBalance = null;
        this.harvestBeneficiaryPercentage = null;
        this.blockPruneInterval = null;
        this.maxTransactionsPerBlock = null;
        this.maxTransactionsPerAggregate = null;
        this.maxCosignaturesPerAggregate = null;
        this.enableStrictCosignatureCheck = null; // boolean
        this.enableBondedAggregateSupport = null; // boolean
        this.maxBondedTransactionLifetime = '';
        this.maxBlockChainConfigSize = '';
        this.maxSupportedEntityVersionsSize = '';
        this.minPercentageOfApproval = null;
        this.minPercentageOfRemoval = null;
        this.maxOfferDuration = null;
        this.longOfferKey = '';
        this.lockedFundsPerAggregate = null;
        this.maxHashLockDuration = '';
        this.maxSecretLockDuration = '';
        this.minProofSize = null;
        this.maxProofSize = null;
        this.maxFields = null;
        this.maxFieldKeySize = null;
        this.maxFieldValueSize = null;
        this.maxMosaicsPerAccount = null;
        this.maxMosaicDuration = '';
        this.maxMosaicDivisibility = null;
        this.mosaicRentalFeeSinkPublicKey = '';
        this.mosaicRentalFee = null;
        this.maxMultisigDepth = null;
        this.maxCosignersPerAccount = null;
        this.maxCosignedAccountsPerAccount = null;
        this.newCosignersMustApprove = null; // boolean
        this.maxNameSize = null;
        this.maxNamespaceDuration = '';
        this.namespaceGracePeriodDuration = '';
        this.reservedRootNamespaceNames = '';
        this.namespaceRentalFeeSinkPublicKey = '';
        this.rootNamespaceRentalFeePerBlock = null;
        this.childNamespaceRentalFee = null;
        this.maxChildNamespaces = null;
        this.maxOperationDuration = '';
        this.maxPropertyValues = null;
        this.maxMessageSize = null;
        this.maxMosaicsSize = null;
        this.minUpgradePeriod = null;
        this.maxFilesOnDrive = null;
        this.verificationFee = null;
        this.verificationDuration = null;
        this.downloadDuration = null;
        this.downloadCacheEnabled  = null; // boolean
        this.maxSuperContractsOnDrive = null
    }

    updateConfig(config){
        Object.assign(this, config);
    }
}

export class ChainProfileNames extends StoreProperties {
    constructor(storeName){
        super(storeName);
        this.names = [];
    }

    static createDefault(){
        var newObj = new ChainProfileNames("ChainProfilesName");
        newObj.init();
        return newObj;
    }

    replaceFirst2Names(names) {

        var count = 0;

        for(var i = 0; i < 2; i++){
            var updated = this.replaceAndUpdateWallet(this.names[i], names[i], i);

            count += updated ? 1 : 0;
        }

       return count;
    }

    replaceFirst3Names(names) {

        var count = 0;

        for(var i = 0; i < 3; i++){
            var updated = this.replaceAndUpdateWallet(this.names[i], names[i], i);

            count += updated ? 1 : 0;
        }

        return count;
    }

    replaceAndUpdateWallet(oldName, newName, index){
        if(oldName !== newName){
            var allWallets = JSON.parse(localStorage.getItem(walletKey));
            var newWallets = [];

            if(allWallets){
                newWallets = allWallets.map((wallet)=>{
                    if(wallet.networkName === oldName){
                        wallet.networkName = newName;
                    }
                    
                    return wallet;
                });
            }

            localStorage.setItem(walletKey, JSON.stringify(newWallets));

            this.names[index] = newName;

            return true;
        }

        return false;
    }
}

export class ChainProfilePreferences extends StoreProperties {
    constructor(storeName){
        super(storeName);
        this.apiNode = "";
    }
}