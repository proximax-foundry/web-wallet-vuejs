import utils from "@/utils";
import { ChainProfile, ChainProfileConfig, ChainProfilePreferences } from "./storeClasses";
import { computed, reactive, ref } from "vue";
import {
  AccountHttp,
  BlockHttp,
  ChainHttp,
  Listener,
  NetworkHttp,
  NodeHttp,
  MosaicHttp,
  Account,
  NamespaceHttp,
  ChainConfigHttp
} from "tsjs-xpx-chain-sdk";
const config = require("@/../config/config.json");

const state = reactive({
  chainNetwork: 1,
  chainNetworkName:'',
  currentNetworkProfile: {},
  currentNetworkProfileConfig: {},
  networkAPIEndpoints: computed(() => formatNetwork()),
  selectedChainNode: computed(() =>
    getSelectedChainNode()
  )
});

function updateCurrentProfile(){
  let profile = state.chainNetworkName ? new ChainProfile(state.chainNetworkName) : null;

  if(profile){
    profile.init();
    state.currentNetworkProfile = profile;
  }
}

function updateCurrentProfileConfig(){
  let profileConfig = state.chainNetworkName ? new ChainProfileConfig(state.chainNetworkName + '_config') : null;

  if(profileConfig){
    profileConfig.init();
    state.currentNetworkProfileConfig = profileConfig;
  }
}

function getCurrentProfile(){
  return state.currentNetworkProfile;
}

function getCurrentProfileConfig(){
  return state.currentNetworkProfileConfig;
}

function refreshselectedNetwork() {
  state.chainNetwork = sessionStorage.getItem('selectedNetwork');
  state.chainNetworkName = sessionStorage.getItem('selectedNetworkName');

  updateCurrentProfile();
  updateCurrentProfileConfig();
}

function getChainNodes() {
  return state.currentNetworkProfile.apiNodes ? state.currentNetworkProfile.apiNodes : [];
}

function getNetworkType(){
  return state.currentNetworkProfile.network.type;
}

function formatNetwork(){
  var list = getChainNodes();
  var n = [];
  for(var i = 0; i < list.length; ++i){
    n.push(buildAPIEndpointURL(list[i]));
  }
  return n;
}

function getNetworkByType(typeid){
  return config.network.find((element) => element.type == typeid);
}

function getSelectedChainNode(){
  var chainProfilePreferences = new ChainProfilePreferences(state.chainNetworkName + "_preferences");

  chainProfilePreferences.init();

  if(chainProfilePreferences.apiNode && getChainNodes().includes(chainProfilePreferences.apiNode)){
    return chainProfilePreferences.apiNode;
  }
  else{
    if(chainProfilePreferences.apiNode.length){
      var randomAPINodeIndex = Math.floor(Math.random() * chainProfilePreferences.apiNode.length);
      chainProfilePreferences.apiNode = chainProfilePreferences.apiNode[randomAPINodeIndex];
      chainProfilePreferences.saveToLocalStorage();
      return chainProfilePreferences.apiNode[randomAPINodeIndex];
    }
    else{
      return '';
    }
  }
}

// function getNetworkByName(name){
//   return config.network.find((element) => element.name == name);
// }

// ALWAYS use function selectNewChainNode to change currentChainNode value, to avoid web socket listening on old node
//const currentChainNode = ref(getChainNodes()[0]);
const listenerChainWS = ref(null);

const accountHttp = computed(() => new AccountHttp(buildAPIEndpointURL(state.selectedChainNode)));
const blockHttp = computed(() => new BlockHttp(buildAPIEndpointURL(state.selectedChainNode)));
const chainHttp = computed(() => new ChainHttp(buildAPIEndpointURL(state.selectedChainNode)));
const networkHttp = computed(() => new NetworkHttp(buildAPIEndpointURL(state.selectedChainNode)));
const nodeHttp = computed(() => new NodeHttp(buildAPIEndpointURL(state.selectedChainNode)));
const mosaicHttp = computed(() => new MosaicHttp(buildAPIEndpointURL(state.selectedChainNode)));
const namespaceHttp = computed(() => new NamespaceHttp(buildAPIEndpointURL(state.selectedChainNode)));
const chainConfigHttp = computed(() => new ChainConfigHttp(buildAPIEndpointURL(state.selectedChainNode)));

const chainWSListener = computed(() => {
  if (listenerChainWS.value == null) {
    console.log('open new socket')
    listenerChainWS.value = new Listener(
      buildWSEndpointURL(state.selectedChainNode.value),
      WebSocket
    );
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

function selectNewChainNode(APIString) {
  const found = state.chainNodes.find(
    (element) =>
      element  === APIString
  );

  if (!found) {
    if (config.debug) {
      console.error(
        "selectNewChainNode triggered with invalid node url",
        APIString
      );
    }
    return false;
  }

  if (config.debug) {
    console.log("selectNewChainNode triggered with", APIString);
  }
  state.selectedChainNode.value = found;
  stopChainWSListener();
  return true;
}

function stopChainWSListener() {
  if (config.debug) {
    console.log("stopChainWSListener triggered");
  }

  if (listenerChainWS.value != null) {
    listenerChainWS.value.terminate();
    listenerChainWS.value = null;
  }
}


/* Account section - benjamin lai */
function createNewAccount(networkType){
  const account = Account.generateNewAccount(networkType);
  const account_para = {
    address: account.address,
    addressPretty: account.address.pretty(),
    public: account.publicKey,
    private: account.privateKey
  }
  return account_para;
}

function createNewAccountPrivateKey(pk, networkType){
  const account = Account.createFromPrivateKey(pk, networkType);
  const account_para = {
    address: account.address,
    addressPretty: account.address.pretty(),
    public: account.publicKey,
    private: account.privateKey
  }
  return account_para;
}

function buildChainConfigHttp(apiURL){
  return new ChainConfigHttp(apiURL);
}

function buildChainHttp(apiURL){

  return new ChainHttp(apiURL);
}

async function getChainConfig(chainHeight, chainConfigHttp){
    
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
        blockTimeSmoothingFactor: convertConfigNumberToInteger(networkConfig['blockTimeSmoothingFactor']),
        greedDelta: Number(networkConfig['greedDelta']),
        greedExponent: Number(networkConfig['greedExponent']),
        importanceGrouping: convertConfigNumberToInteger(networkConfig['importanceGrouping']),
        maxRollbackBlocks: convertConfigNumberToInteger(networkConfig['maxRollbackBlocks']),
        maxDifficultyBlocks: convertConfigNumberToInteger(networkConfig['maxDifficultyBlocks']),
        maxTransactionLifetime: networkConfig['maxTransactionLifetime'],
        maxBlockFutureTime: networkConfig['maxBlockFutureTime'],
        maxMosaicAtomicUnits: convertConfigNumberToInteger(networkConfig['maxMosaicAtomicUnits']),
        totalChainImportance: convertConfigNumberToInteger(networkConfig['totalChainImportance']),
        minHarvesterBalance: convertConfigNumberToInteger(networkConfig['minHarvesterBalance']),
        harvestBeneficiaryPercentage: convertConfigNumberToInteger(networkConfig['harvestBeneficiaryPercentage']),
        blockPruneInterval: convertConfigNumberToInteger(networkConfig['blockPruneInterval']),
        maxTransactionsPerBlock: convertConfigNumberToInteger(networkConfig['maxTransactionsPerBlock']),
        maxTransactionsPerAggregate: convertConfigNumberToInteger(networkConfig['maxTransactionsPerAggregate']),
        maxCosignaturesPerAggregate: convertConfigNumberToInteger(networkConfig['maxCosignaturesPerAggregate']),
        enableStrictCosignatureCheck: networkConfig['enableStrictCosignatureCheck'] === 'true' ? true : false,
        enableBondedAggregateSupport: networkConfig['enableBondedAggregateSupport'] === 'true' ? true : false,
        maxBondedTransactionLifetime: networkConfig['maxBondedTransactionLifetime'],
        maxBlockChainConfigSize: networkConfig['maxBlockChainConfigSize'],
        maxSupportedEntityVersionsSize: networkConfig['maxSupportedEntityVersionsSize'],
        minPercentageOfApproval: convertConfigNumberToInteger(networkConfig['minPercentageOfApproval']),
        minPercentageOfRemoval: convertConfigNumberToInteger(networkConfig['minPercentageOfRemoval']),
        maxOfferDuration: convertConfigNumberToInteger(networkConfig['maxOfferDuration']),
        longOfferKey: networkConfig['longOfferKey'],
        lockedFundsPerAggregate: convertConfigNumberToInteger(networkConfig['lockedFundsPerAggregate']),
        maxHashLockDuration: networkConfig['maxHashLockDuration'],
        maxSecretLockDuration: networkConfig['maxSecretLockDuration'],
        minProofSize: convertConfigNumberToInteger(networkConfig['minProofSize']),
        maxProofSize: convertConfigNumberToInteger(networkConfig['maxProofSize']),
        maxFields: convertConfigNumberToInteger(networkConfig['maxFields']),
        maxFieldKeySize: convertConfigNumberToInteger(networkConfig['maxFieldKeySize']),
        maxFieldValueSize: convertConfigNumberToInteger(networkConfig['maxFieldValueSize']),
        maxMosaicsPerAccount: convertConfigNumberToInteger(networkConfig['maxMosaicsPerAccount']),
        maxMosaicDuration: networkConfig['maxMosaicDuration'],
        maxMosaicDivisibility: convertConfigNumberToInteger(networkConfig['maxMosaicDivisibility']),
        mosaicRentalFeeSinkPublicKey: networkConfig['mosaicRentalFeeSinkPublicKey'],
        mosaicRentalFee: convertConfigNumberToInteger(networkConfig['mosaicRentalFee']),
        maxMultisigDepth: convertConfigNumberToInteger(networkConfig['maxMultisigDepth']),
        maxCosignersPerAccount: convertConfigNumberToInteger(networkConfig['maxCosignersPerAccount']),
        maxCosignedAccountsPerAccount: convertConfigNumberToInteger(networkConfig['maxCosignedAccountsPerAccount']),
        newCosignersMustApprove: networkConfig['newCosignersMustApprove'] === 'true' ? true : false,
        maxNameSize: convertConfigNumberToInteger(networkConfig['maxNameSize']),
        maxNamespaceDuration: networkConfig['maxNamespaceDuration'],
        namespaceGracePeriodDuration: networkConfig['namespaceGracePeriodDuration'],
        reservedRootNamespaceNames: networkConfig['reservedRootNamespaceNames'],  
        namespaceRentalFeeSinkPublicKey: networkConfig['namespaceRentalFeeSinkPublicKey'],
        rootNamespaceRentalFeePerBlock: convertConfigNumberToInteger(networkConfig['rootNamespaceRentalFeePerBlock']),
        childNamespaceRentalFee: convertConfigNumberToInteger(networkConfig['childNamespaceRentalFee']),
        maxChildNamespaces: convertConfigNumberToInteger(networkConfig['maxChildNamespaces']),
        maxOperationDuration: networkConfig['maxOperationDuration'],
        maxPropertyValues: convertConfigNumberToInteger(networkConfig['maxPropertyValues']),
        maxMessageSize: convertConfigNumberToInteger(networkConfig['maxMessageSize']),
        maxMosaicsSize: convertConfigNumberToInteger(networkConfig['maxMosaicsSize']),
        minUpgradePeriod: convertConfigNumberToInteger(networkConfig['minUpgradePeriod']),
        maxFilesOnDrive: convertConfigNumberToInteger(networkConfig['maxFilesOnDrive']),
        verificationFee: convertConfigNumberToInteger(networkConfig['verificationFee']),
        verificationDuration: convertConfigNumberToInteger(networkConfig['verificationDuration']),
        downloadDuration: convertConfigNumberToInteger(networkConfig['downloadDuration']),
        downloadCacheEnabled: networkConfig['downloadCacheEnabled'] === 'true' ? true : false,
        maxSuperContractsOnDrive: convertConfigNumberToInteger(networkConfig['maxSuperContractsOnDrive']),
      };

      resolve(chainConfig);
    },
    (error)=>{
      reject(error);
    });
  });
}

function convertConfigNumberToInteger(amount){

  if(!amount){
    return 0;
  }

  return parseInt(amount.split("'").join(""));
}

async function getChainHeight(chainHttp){
    
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

function buildAPIEndpointURL(url, port = undefined){

  var portNumber;

  if(port){
    portNumber = port;
  }
  else if(state.currentNetworkProfile.httpPort){
    portNumber = state.currentNetworkProfile.httpPort;
  }
    
  return location.protocol=='https:' ? `https://${url}` : `http://${url}:${portNumber}`;
}

function buildWSEndpointURL(url, port = undefined){

  var portNumber;

  if(port){
    portNumber = port;
  }
  else if(state.currentNetworkProfile.httpPort){
    portNumber = state.currentNetworkProfile.httpPort;
  }
    
  return location.protocol=='https:' ? `wss://${url}` : `ws://${url}:${portNumber}`;
}


export const siriusStore = {
  state,
  // getNetworkByName,
  accountHttp,
  blockHttp,
  chainHttp,
  networkHttp,
  mosaicHttp,
  namespaceHttp,
  nodeHttp,
  chainConfigHttp,
  chainWSListener,
  addChainNode,
  selectNewChainNode,
  stopChainWSListener,
  getNetworkByType,
  createNewAccount,
  createNewAccountPrivateKey,
  getChainConfig,
  getChainHeight,
  buildChainConfigHttp,
  buildChainHttp,
  buildAPIEndpointURL,
  refreshselectedNetwork,
  getNetworkType,
  getCurrentProfileConfig,
  getCurrentProfile,
  buildWSEndpointURL
};
