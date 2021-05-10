import utils from "@/utils";
import { ChainProfile, ChainProfileConfig, ChainProfilePreferences, ChainProfileNames } from "./storeClasses";
import { computed, ref, watch, reactive, readonly } from "vue";
import {
  AccountHttp,
  BlockHttp,
  ChainHttp,
  NetworkHttp,
  NodeHttp,
  MosaicHttp,
  NamespaceHttp,
  ChainConfigHttp,
  Password,
  SimpleWallet,
  TransactionHttp,
} from "tsjs-xpx-chain-sdk";
const config = require("@/../config/config.json");

export const siriusState = reactive({
  chainNetwork: 0,
  chainNetworkName:'',
  currentNetworkProfile: {},
  currentNetworkProfileConfig: {},
  selectedChainNode: '',
  networkAPIEndpoints: [],
  availableNetworks: []
});

class Sirius {
  constructor() {
    //this.name = "Sirius Wallet";

    // this.availableNetworks = ref([]);
    // this.chainNetwork = ref(0);
    // this.chainNetworkName = ref('');
    // this.currentNetworkProfile = ref({});
    // this.currentNetworkProfileConfig = ref({});
    //this.networkAPIEndpoints = computed(() => this.formatNetwork());
    //this.selectedChainNode = ref('');

    this.state = siriusState;

    this.accountHttp = computed(() => new AccountHttp(this.buildAPIEndpointURL(siriusState.selectedChainNode)));
    this.blockHttp = computed(() => new BlockHttp(this.buildAPIEndpointURL(siriusState.selectedChainNode)));
    this.chainHttp = computed(() => new ChainHttp(this.buildAPIEndpointURL(siriusState.selectedChainNode)));
    this.networkHttp = computed(() => new NetworkHttp(this.buildAPIEndpointURL(siriusState.selectedChainNode)));
    this.nodeHttp = computed(() => new NodeHttp(this.buildAPIEndpointURL(siriusState.selectedChainNode)));
    this.mosaicHttp = computed(() => new MosaicHttp(this.buildAPIEndpointURL(siriusState.selectedChainNode)));
    this.namespaceHttp = computed(() => new NamespaceHttp(this.buildAPIEndpointURL(siriusState.selectedChainNode)));
    this.chainConfigHttp = computed(() => new ChainConfigHttp(this.buildAPIEndpointURL(siriusState.selectedChainNode)));
    this.transactionHttp = computed(()=> new TransactionHttp(this.buildAPIEndpointURL(siriusState.selectedChainNode)));
    this.connectors = ref([]);

  }

  startWatch(){
    watch(
      ()=> siriusState.currentNetworkProfile, 
      (newValues) => {

        siriusState.networkAPIEndpoints = this.formatNetwork();

        var chainProfilePreferences = new ChainProfilePreferences( siriusState.chainNetworkName + "_preferences");
      
        chainProfilePreferences.init();
      
        let endpoints = this.getChainNodes();
  
        if(chainProfilePreferences.apiNode && endpoints.includes(chainProfilePreferences.apiNode)){
          siriusState.selectedChainNode = chainProfilePreferences.apiNode;
        }
        else{
          if(endpoints.length > 0){
            var randomAPINodeIndex = Math.floor(Math.random() * endpoints.length);
            chainProfilePreferences.apiNode = endpoints[randomAPINodeIndex];
            chainProfilePreferences.saveToLocalStorage();

            siriusState.selectedChainNode = endpoints[randomAPINodeIndex];
          }
          else{
            siriusState.selectedChainNode = "";
          }
        }

        sessionStorage.setItem('nodePort', newValues.httpPort);
        sessionStorage.setItem('selectedChainNode', siriusState.selectedChainNode);
      }
    );

    watch(
      ()=> siriusState.availableNetworks, 
      (newValues) => {

        let selectedNetwork = 0;
        //let selectedNetworkName = "";
        let sessionSelectedNetwork = sessionStorage.getItem("selectedNetwork") ? parseInt(sessionStorage.getItem("selectedNetwork")) : 0;
        //let sessionSelectedNetworkName = sessionStorage.getItem("selectedNetworkName") ? sessionStorage.getItem("selectedNetworkName") : "";
        let lastAccessNetwork = localStorage.getItem("lastAccessNetwork") ? parseInt(localStorage.getItem("lastAccessNetwork")) : 0;
        //let lastAccessNetworkName = localStorage.getItem("lastAccessNetworkName") ? localStorage.getItem("lastAccessNetwork") : "";

        if(sessionSelectedNetwork){
          selectedNetwork = parseInt(sessionSelectedNetwork);
          //selectedNetworkName = sessionSelectedNetworkName;
        }
        else{
          selectedNetwork = lastAccessNetwork;
          //selectedNetworkName = lastAccessNetworkName;
        }

        if(newValues[selectedNetwork] === undefined){
          selectedNetwork = 0;
        }
        /*
        else if(newValues[selectedNetwork] !== selectedNetworkName){
          selectedNetwork = 0;
        }
        */

        siriusState.chainNetwork = selectedNetwork;
    });

    watch(
      ()=> siriusState.chainNetwork, 
      (newValues) => {

        sessionStorage.setItem('selectedNetwork', newValues);

        siriusState.chainNetworkName = siriusState.availableNetworks[newValues];

        sessionStorage.setItem('selectedNetworkName', siriusState.chainNetworkName);

        this.updateCurrentProfile();
        this.updateCurrentProfileConfig();
    });

    this.updateAvailableNetworks();
  }

  updateChainNetwork(network){
    siriusState.chainNetwork = network;
  }

  updateAvailableNetworks(){
    let names = ChainProfileNames.createDefault().names;

    if(names.length === 0){
      console.log("Is empty");
      setTimeout(()=>{
        this.updateAvailableNetworks();
      }, 100);
    }
    else{
      siriusState.availableNetworks = names;
    }
  }

  updateCurrentProfile(){
    let profile = siriusState.chainNetworkName ? new ChainProfile(siriusState.chainNetworkName) : null;
  
    if(profile){
      profile.init();
      siriusState.currentNetworkProfile = profile;
    }
  }

  updateCurrentProfileConfig(){
    let profileConfig = siriusState.chainNetworkName ? new ChainProfileConfig(siriusState.chainNetworkName+ '_config') : null;
  
    if(profileConfig){
      profileConfig.init();
      siriusState.currentNetworkProfileConfig = profileConfig;
    }
  }

  getCurrentProfile(){
    return siriusState.currentNetworkProfile;
  }
  
  getCurrentProfileConfig(){
    return siriusState.currentNetworkProfileConfig;
  }
  
  refreshselectedNetwork() {
    siriusState.chainNetwork = sessionStorage.getItem('selectedNetwork');
  }
  
  getChainNodes() {
    return siriusState.currentNetworkProfile.apiNodes ? siriusState.currentNetworkProfile.apiNodes : [];
  }
  
  getNetworkType(){
    return siriusState.currentNetworkProfile.network.type;
  }
  
  formatNetwork(){
    var list = this.getChainNodes();
    var n = [];
    for(var i = 0; i < list.length; ++i){
      n.push(this.buildAPIEndpointURL(list[i]));
    }
    return n;
  }
  
  getNetworkByType(typeid){
    return config.network.find((element) => element.type == typeid);
  }

  async addChainNode(nodeConfigString){
    const newNodeConfig = JSON.parse(nodeConfigString);
    if (config.debug) {
      console.log("addChainNode triggered with", newNodeConfig.hostname);
    }
  
    if (
      this.chainNodes.value.find(
        (element) =>
          element.protocol == newNodeConfig.protocol &&
          element.hostname == newNodeConfig.hostname &&
          element.port == newNodeConfig.port
      )
    ) {
      return -1;
    }
  
    try {
      const http = new BlockHttp(utils.parseNodeConfig(newNodeConfig));
      const blockInfo = await http.getBlockByHeight(1).toPromise();
      if (
        blockInfo.generationHash.toUpperCase() !=
        config.network.generationHash.toUpperCase()
      ) {
        return 0;
      }
  
      this.chainNodes.value.unshift({
        protocol: newNodeConfig.protocol,
        hostname: newNodeConfig.hostname,
        port: newNodeConfig.port,
      });
      localStorage.setItem(
        config.localStorage.chainNodesKey,
        JSON.stringify(this.chainNodes.value)
      );
      return 1;
    } catch (err) {
      if (config.debug) {
        console.error("addChainNode error caught", err);
      }
      return 0;
    }
  }

  stopChainWSListener() {
    console.log("stopChainWSListener triggered");
  
    if (this.connectors.value.length > 0) {
      for (const listener in this.connectors.value) {
        listener.terminate();
      }
    }

    this.connectors.value = [];
  }

  createNewAccount(walletName, networkType){
    // const account = Account.generateNewAccount(networkType);
    const encryptedPasswd = new Password(sessionStorage.getItem('walletPassword'));
    const account = SimpleWallet.create(walletName, encryptedPasswd, networkType);
    const acc = account.open(encryptedPasswd);
    account.publicKey = acc.publicKey;
    account.privateKey = acc.privateKey;
    return account;
  }

  createNewAccountPrivateKey(walletName, pk, networkType){
    // const account = Account.createFromPrivateKey(pk, networkType);
    const encryptedPasswd = new Password(sessionStorage.getItem('walletPassword'));
    const account = SimpleWallet.createFromPrivateKey(
      walletName,
      encryptedPasswd,
      pk,
      networkType
    );
    const acc = account.open(encryptedPasswd);
    account.publicKey = acc.publicKey;
    account.privateKey = acc.privateKey;
    return account;
  }

  static buildChainConfigHttp(apiURL){
    return new ChainConfigHttp(apiURL);
  }

  static buildChainHttp(apiURL){

    return new ChainHttp(apiURL);
  }

  static async getChainConfig(chainHeight, chainConfigHttp){
    
    return new Promise((resolve, reject)=>{
      chainConfigHttp.getChainConfig(chainHeight).subscribe((configString)=>{
  
        var regex = /[^=\n{1}]+=\s*(.*)/g;
  
        var configs = configString.networkConfig.match(regex);
  
        var networkConfig = configs.reduce((result, data)=>{
          var [config, value] = data.split("=");
          result[config.trim()] = value.trim();
          return result;
        }, {});
  
        const chainConfig = {
          publicKey: networkConfig['publicKey'],
          blockGenerationTargetTime: networkConfig['blockGenerationTargetTime'],
          blockTimeSmoothingFactor: this.convertConfigNumberToInteger(networkConfig['blockTimeSmoothingFactor']),
          greedDelta: Number(networkConfig['greedDelta']),
          greedExponent: Number(networkConfig['greedExponent']),
          importanceGrouping: this.convertConfigNumberToInteger(networkConfig['importanceGrouping']),
          maxRollbackBlocks: this.convertConfigNumberToInteger(networkConfig['maxRollbackBlocks']),
          maxDifficultyBlocks: this.convertConfigNumberToInteger(networkConfig['maxDifficultyBlocks']),
          maxTransactionLifetime: networkConfig['maxTransactionLifetime'],
          maxBlockFutureTime: networkConfig['maxBlockFutureTime'],
          maxMosaicAtomicUnits: this.convertConfigNumberToInteger(networkConfig['maxMosaicAtomicUnits']),
          totalChainImportance: this.convertConfigNumberToInteger(networkConfig['totalChainImportance']),
          minHarvesterBalance: this.convertConfigNumberToInteger(networkConfig['minHarvesterBalance']),
          harvestBeneficiaryPercentage: this.convertConfigNumberToInteger(networkConfig['harvestBeneficiaryPercentage']),
          blockPruneInterval: this.convertConfigNumberToInteger(networkConfig['blockPruneInterval']),
          maxTransactionsPerBlock: this.convertConfigNumberToInteger(networkConfig['maxTransactionsPerBlock']),
          maxTransactionsPerAggregate: this.convertConfigNumberToInteger(networkConfig['maxTransactionsPerAggregate']),
          maxCosignaturesPerAggregate: this.convertConfigNumberToInteger(networkConfig['maxCosignaturesPerAggregate']),
          enableStrictCosignatureCheck: networkConfig['enableStrictCosignatureCheck'] === 'true' ? true : false,
          enableBondedAggregateSupport: networkConfig['enableBondedAggregateSupport'] === 'true' ? true : false,
          maxBondedTransactionLifetime: networkConfig['maxBondedTransactionLifetime'],
          maxBlockChainConfigSize: networkConfig['maxBlockChainConfigSize'],
          maxSupportedEntityVersionsSize: networkConfig['maxSupportedEntityVersionsSize'],
          minPercentageOfApproval: this.convertConfigNumberToInteger(networkConfig['minPercentageOfApproval']),
          minPercentageOfRemoval: this.convertConfigNumberToInteger(networkConfig['minPercentageOfRemoval']),
          maxOfferDuration: this.convertConfigNumberToInteger(networkConfig['maxOfferDuration']),
          longOfferKey: networkConfig['longOfferKey'],
          lockedFundsPerAggregate: this.convertConfigNumberToInteger(networkConfig['lockedFundsPerAggregate']),
          maxHashLockDuration: networkConfig['maxHashLockDuration'],
          maxSecretLockDuration: networkConfig['maxSecretLockDuration'],
          minProofSize: this.convertConfigNumberToInteger(networkConfig['minProofSize']),
          maxProofSize: this.convertConfigNumberToInteger(networkConfig['maxProofSize']),
          maxFields: this.convertConfigNumberToInteger(networkConfig['maxFields']),
          maxFieldKeySize: this.convertConfigNumberToInteger(networkConfig['maxFieldKeySize']),
          maxFieldValueSize: this.convertConfigNumberToInteger(networkConfig['maxFieldValueSize']),
          maxMosaicsPerAccount: this.convertConfigNumberToInteger(networkConfig['maxMosaicsPerAccount']),
          maxMosaicDuration: networkConfig['maxMosaicDuration'],
          maxMosaicDivisibility: this.convertConfigNumberToInteger(networkConfig['maxMosaicDivisibility']),
          mosaicRentalFeeSinkPublicKey: networkConfig['mosaicRentalFeeSinkPublicKey'],
          mosaicRentalFee: this.convertConfigNumberToInteger(networkConfig['mosaicRentalFee']),
          maxMultisigDepth: this.convertConfigNumberToInteger(networkConfig['maxMultisigDepth']),
          maxCosignersPerAccount: this.convertConfigNumberToInteger(networkConfig['maxCosignersPerAccount']),
          maxCosignedAccountsPerAccount: this.convertConfigNumberToInteger(networkConfig['maxCosignedAccountsPerAccount']),
          newCosignersMustApprove: networkConfig['newCosignersMustApprove'] === 'true' ? true : false,
          maxNameSize: this.convertConfigNumberToInteger(networkConfig['maxNameSize']),
          maxNamespaceDuration: networkConfig['maxNamespaceDuration'],
          namespaceGracePeriodDuration: networkConfig['namespaceGracePeriodDuration'],
          reservedRootNamespaceNames: networkConfig['reservedRootNamespaceNames'],  
          namespaceRentalFeeSinkPublicKey: networkConfig['namespaceRentalFeeSinkPublicKey'],
          rootNamespaceRentalFeePerBlock: this.convertConfigNumberToInteger(networkConfig['rootNamespaceRentalFeePerBlock']),
          childNamespaceRentalFee: this.convertConfigNumberToInteger(networkConfig['childNamespaceRentalFee']),
          maxChildNamespaces: this.convertConfigNumberToInteger(networkConfig['maxChildNamespaces']),
          maxOperationDuration: networkConfig['maxOperationDuration'],
          maxPropertyValues: this.convertConfigNumberToInteger(networkConfig['maxPropertyValues']),
          maxMessageSize: this.convertConfigNumberToInteger(networkConfig['maxMessageSize']),
          maxMosaicsSize: this.convertConfigNumberToInteger(networkConfig['maxMosaicsSize']),
          minUpgradePeriod: this.convertConfigNumberToInteger(networkConfig['minUpgradePeriod']),
          maxFilesOnDrive: this.convertConfigNumberToInteger(networkConfig['maxFilesOnDrive']),
          verificationFee: this.convertConfigNumberToInteger(networkConfig['verificationFee']),
          verificationDuration: this.convertConfigNumberToInteger(networkConfig['verificationDuration']),
          downloadDuration: this.convertConfigNumberToInteger(networkConfig['downloadDuration']),
          downloadCacheEnabled: networkConfig['downloadCacheEnabled'] === 'true' ? true : false,
          maxSuperContractsOnDrive: this.convertConfigNumberToInteger(networkConfig['maxSuperContractsOnDrive']),
        };
  
        resolve(chainConfig);
      },
      (error)=>{
        reject(error);
      });
    });
  }

  convertConfigNumberToInteger(amount){

    if(!amount){
      return 0;
    }
  
    return parseInt(amount.split("'").join(""));
  }

  async getChainHeight(chainHttp){
    
    return new Promise((resolve, reject)=>{
      chainHttp.getBlockchainHeight().subscribe((height)=>{
  
        const chainHeight = height.compact();
  
        resolve(chainHeight);
      },
      (error)=>{
        reject(error);
      });
    });
  }

  buildAPIEndpointURL(url, port = undefined){

    var portNumber;
  
    if(port){
      portNumber = port;
    }
    else if(siriusState.currentNetworkProfile.httpPort){
      portNumber = siriusState.currentNetworkProfile.httpPort;
    }
      
    return location.protocol=='https:' ? `https://${url}` : `http://${url}:${portNumber}`;
  }

  buildWSEndpointURL(url, port = undefined){

    var portNumber;
  
    if(port){
      portNumber = port;
    }
    else if(siriusState.currentNetworkProfile.httpPort){
      portNumber = siriusState.currentNetworkProfile.httpPort;
    }
      
    return location.protocol=='https:' ? `wss://${url}` : `ws://${url}:${portNumber}`;
  }
}

const siriusStore_1 = new Sirius();

export const siriusStore = readonly(siriusStore_1);