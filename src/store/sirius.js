import utils from "@/utils";
import { computed, reactive, ref, readonly, watch } from "vue";
import {
  AccountHttp,
  BlockHttp,
  ChainHttp,
  ChainConfigHttp,
  Listener,
  NetworkHttp,
  NamespaceHttp,
  NodeHttp,
  MosaicHttp,
  TransactionHttp,
  UInt64,
} from "tsjs-xpx-chain-sdk";
import { ChainProfile, ChainProfileConfig, ChainProfilePreferences, ChainProfileNames } from "./storeClasses";

const config = require("@/../config/config.json");

function getChainNodes() {
  const existingNodes = localStorage.getItem(config.localStorage.chainNodesKey);
  return existingNodes ? JSON.parse(existingNodes) : config.chainNodes;
}

// function formatNetwork(){
//   var n = [];
//   for(var i = 0; i < config.network.length; ++i){
//     n.push({ value: config.network[i].type, label: config.network[i].name, id: (i+1)});
//   }
//   return n;
// }

function getNetworkByType(typeid){
  return config.network.find((element) => element.type == typeid);
}

// function getNetworkByName(name){
//   return config.network.find((element) => element.name == name);
// }

// ALWAYS use function selectNewChainNode to change currentChainNode value, to avoid web socket listening on old node
// const currentChainNode = ref(getChainNodes()[0]);
const listenerChainWS = ref(null);

const state = reactive({
  chainNodes: getChainNodes(),
  // network: config.network,
  // network: formatNetwork(),
  // selectedChainNode: computed(() =>
  //   utils.parseNodeConfig(currentChainNode.value)
  // ),
  selectedChainNode: '',
  selectedNetwork: '',
  chainNetwork: 0,
  chainNetworkName:'',
  currentNetworkProfile: {},
  currentNetworkProfileConfig: {},
  networkAPIEndpoints: [],
  availableNetworks: [],
  blockHeight: '',
});

function _buildAPIEndpointURL(url, port = undefined){
  var portNumber;
  if(port){
    portNumber = port;
  }
  else if(state.currentNetworkProfile.httpPort){
    portNumber = state.currentNetworkProfile.httpPort;
  }
  return location.protocol=='https:' ? `https://${url}` : `http://${url}:${portNumber}`;
}

const accountHttp = computed(() => new AccountHttp(_buildAPIEndpointURL(state.selectedChainNode)));
const blockHttp = computed(() => new BlockHttp(_buildAPIEndpointURL(state.selectedChainNode)));
const chainHttp = computed(() => new ChainHttp(_buildAPIEndpointURL(state.selectedChainNode)));
const chainConfigHttp = computed(() => new ChainConfigHttp(_buildAPIEndpointURL(state.selectedChainNode)));
const networkHttp = computed(() => new NetworkHttp(_buildAPIEndpointURL(state.selectedChainNode)));
const nodeHttp = computed(() => new NodeHttp(_buildAPIEndpointURL(state.selectedChainNode)));
const mosaicHttp = computed(() => new MosaicHttp(_buildAPIEndpointURL(state.selectedChainNode)));
const transactionHttp = computed(() => new TransactionHttp(_buildAPIEndpointURL(state.selectedChainNode)));
const namespaceHttp = computed(() => new NamespaceHttp(_buildAPIEndpointURL(state.selectedChainNode)));

const chainWSListener = computed(() => {
  if (listenerChainWS.value == null) {
    // console.log('open new socket')
    listenerChainWS.value = new Listener(chainNetworkInstance.buildWSEndpointURL(state.selectedChainNode), WebSocket);
  }
  return listenerChainWS.value;
});

async function addChainNode(nodeConfigString) {
  const newNodeConfig = JSON.parse(nodeConfigString);
  if (config.debug) {
    console.log("addChainNode triggered with", newNodeConfig.hostname);
  }

  if (
    state.chainNodes.find(
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

    state.chainNodes.unshift({
      protocol: newNodeConfig.protocol,
      hostname: newNodeConfig.hostname,
      port: newNodeConfig.port,
    });
    localStorage.setItem(
      config.localStorage.chainNodesKey,
      JSON.stringify(state.chainNodes)
    );
    return 1;
  } catch (err) {
    if (config.debug) {
      console.error("addChainNode error caught", err);
    }
    return 0;
  }
}

function selectNewChainNode(nodeConfigString) {
  const nodeConfig = JSON.parse(nodeConfigString);
  const found = state.chainNodes.find(
    (element) =>
      element.protocol == nodeConfig.protocol &&
      element.hostname == nodeConfig.hostname &&
      element.port == nodeConfig.port
  );

  if (!found) {
    if (config.debug) {
      console.error(
        "selectNewChainNode triggered with invalid node url",
        nodeConfig.hostname
      );
    }
    return false;
  }

  if (config.debug) {
    console.log("selectNewChainNode triggered with", nodeConfig.hostname);
  }
  // currentChainNode.value = found;
  stopChainWSListener();
  return true;
}

function stopChainWSListener() {
  console.log("stopChainWSListener triggered");

  if (listenerChainWS.value != null) {
    listenerChainWS.value.terminate();
    listenerChainWS.value = null;
  }
}

function getSelectedNetworkSessionStorage(){
  return sessionStorage.getItem('selectedNetworkName');
}

// update session storage for network
function updateNetworkSessionStorage(networkId){
  sessionStorage.setItem('selectedNetwork', networkId);
  state.chainNetworkName = state.availableNetworks[networkId];
  sessionStorage.setItem('selectedNetworkName', state.chainNetworkName);
  chainNetworkInstance.updateCurrentProfile();
  chainNetworkInstance.updateCurrentProfileConfig();
}

function restoreSiriusStateFromSessionStorage(selectedChainNode, selectedNetwork, selectedNetworkName){
  state.chainNetworkName = selectedNetworkName;
  state.selectedChainNode = selectedChainNode;
  state.chainNetwork = selectedNetwork;
  chainNetworkInstance.updateCurrentProfile();
  chainNetworkInstance.updateCurrentProfileConfig();
}

export const siriusStore = readonly({
  state,
  // currentChainNode,
  getChainNodes,
  // getNetworkByName,
  accountHttp,
  blockHttp,
  chainHttp,
  chainConfigHttp,
  networkHttp,
  mosaicHttp,
  transactionHttp,
  namespaceHttp,
  nodeHttp,
  chainWSListener,
  addChainNode,
  selectNewChainNode,
  stopChainWSListener,
  getNetworkByType,
  _buildAPIEndpointURL,
  updateNetworkSessionStorage,
  getSelectedNetworkSessionStorage,
  restoreSiriusStateFromSessionStorage,
});

watch( () => state.currentNetworkProfile, (newValues) => {
  state.networkAPIEndpoints = chainNetworkInstance.formatNetwork();
  var chainProfilePreferences = new ChainProfilePreferences( state.chainNetworkName + "_preferences");
  chainProfilePreferences.init();
  let endpoints = chainNetworkInstance.getChainNodes();

  if(chainProfilePreferences.apiNode && endpoints.includes(chainProfilePreferences.apiNode)){
    state.selectedChainNode = chainProfilePreferences.apiNode;
  }
  else{
    if(endpoints.length > 0){
      var randomAPINodeIndex = Math.floor(Math.random() * endpoints.length);
      chainProfilePreferences.apiNode = endpoints[randomAPINodeIndex];
      chainProfilePreferences.saveToLocalStorage();

      state.selectedChainNode = endpoints[randomAPINodeIndex];
    }
    else{
      state.selectedChainNode = "";
    }
  }
  sessionStorage.setItem('nodePort', newValues.httpPort);
  sessionStorage.setItem('selectedChainNode', state.selectedChainNode);
}, {deep: true});

watch( ()=> state.availableNetworks, (newValues) => {
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
  state.chainNetwork = selectedNetwork;
});

watch( ()=> state.chainNetwork, (newValues) => {
  updateNetworkSessionStorage(newValues);
});

// chainNode class
class ChainNetwork{
  constructor() {
    this.httpPort = 3000;
    this.getSelectedNetwork();
  }

  getSelectedNetwork(){
    const selectedNetwork = sessionStorage.getItem('selectedNetwork') ? parseInt(sessionStorage.getItem('selectedNetwork')) : -1;
    if(selectedNetwork >= 0){
      state.selectedNetwork = parseInt(sessionStorage.getItem('selectedNetwork'));
    }
  }

  updateChainNetwork(network){
    state.chainNetwork = network;
  }

  updateAvailableNetworks(){
    let names = ChainProfileNames.createDefault().names;
    if(names.length === 0){
      console.log("Is empty");
      setTimeout(()=>{
        this.updateAvailableNetworks();
      }, 50);
    }
    else{
      state.availableNetworks = names;
    }
  }

  updateCurrentProfile(){
    let profile = state.chainNetworkName ? new ChainProfile(state.chainNetworkName) : null;
    if(profile){
      profile.init();
      state.currentNetworkProfile = profile;
      // console.log(state.currentNetworkProfile)
    }
  }

  updateCurrentProfileConfig(){
    let profileConfig = state.chainNetworkName ? new ChainProfileConfig(state.chainNetworkName + '_config') : null;

    if(profileConfig){
      profileConfig.init();
      state.currentNetworkProfileConfig = profileConfig;
      // console.log('state.currentNetworkProfileConfig')
      // console.log(state.currentNetworkProfileConfig)
    }
  }

  getCurrentProfile(){
    return state.currentNetworkProfile;
  }

  getCurrentProfileConfig(){
    return state.currentNetworkProfileConfig;
  }

  refreshselectedNetwork() {
    state.chainNetwork = sessionStorage.getItem('selectedNetwork');
  }

  // another declared in siriusStore
  getChainNodes() {
    return state.currentNetworkProfile.apiNodes ? state.currentNetworkProfile.apiNodes : [];
  }

  getProfileConfig() {
    return state.currentNetworkProfileConfig ? state.currentNetworkProfileConfig : null;
  }

  getProfileNetwork(){
    return this.getCurrentProfile().network;
  }

  getCurrency(){
    return this.getProfileNetwork().currency;
  }

  getCurrencyDivisibility(){
    return this.getCurrency().divisibility;
  }

  getCurrencyName(){
    return this.getCurrency().name;
  }

  getNetworkPort(){
    return state.currentNetworkProfile.httpPort;
  }

  getNetworkType(){
    return state.currentNetworkProfile.network.type;
  }

  formatNetwork(){
    var list = this.getChainNodes();
    var n = [];
    for(var i = 0; i < list.length; ++i){
      n.push(this.buildAPIEndpointURL(list[i]));
    }
    return n;
  }

  // getNetworkByType(typeid){
  //   return config.network.find((element) => element.type == typeid);
  // }

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
    else if(state.currentNetworkProfile.httpPort){
      portNumber = state.currentNetworkProfile.httpPort;
    }
    return location.protocol=='https:' ? `https://${url}` : `http://${url}:${portNumber}`;
  }

  buildWSEndpointURL(url, port = undefined){

    var portNumber;
    if(port){
      portNumber = port;
    }
    else if(state.currentNetworkProfile.httpPort){
      portNumber = state.currentNetworkProfile.httpPort;
    }
    return location.protocol=='https:' ? `wss://${url}` : `ws://${url}:${portNumber}`;
  }

  updateBlockHeight(blockInfo){
    let blockHeight = new UInt64([blockInfo.height.lower, blockInfo.height.higher]).compact()
    state.blockHeight = blockHeight;
  }

  updateChainNode(apiNode){
    var chainProfilePreferences = new ChainProfilePreferences( state.chainNetworkName + "_preferences");
    chainProfilePreferences.apiNode = apiNode;
    chainProfilePreferences.saveToLocalStorage();
    state.selectedChainNode = apiNode;
    sessionStorage.setItem('selectedChainNode', state.selectedChainNode);
    // this.dashboardService.destroySubscription();
    // this.dataBridgeService.reconnect();
    // this.nemProvider.validaTransactionsSwap();
    // const address: Address[] = [];
    // for (let account of this.walletService.currentWallet.accounts) {
    //   address.push(this.proximaxProvider.createFromRawAddress(account.address));
    // }

    // this.mosaicService.getMosaicXPX();
    // this.namespaces.searchNamespacesFromAccounts(address);
    // this.transactionService.searchAccountsInfo(this.walletService.currentWallet.accounts);
    // this.dataBridgeService.searchBlockInfo();
    // this.dataBridgeService.searchBlockInfo(true);
  }
}

const chainNetworkInstance = new ChainNetwork();
export const chainNetwork = readonly(chainNetworkInstance);