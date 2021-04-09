import utils from "@/utils";
import { computed, reactive, ref, readonly } from "vue";
import {
  AccountHttp,
  BlockHttp,
  ChainHttp,
  Listener,
  NetworkHttp,
  NodeHttp,
  MosaicHttp,
  Account
} from "tsjs-xpx-chain-sdk";
const sdk = require('tsjs-xpx-chain-sdk');
const config = require("@/../config/config.json");

function getChainNodes() {
  const existingNodes = localStorage.getItem(config.localStorage.chainNodesKey);
  return existingNodes ? JSON.parse(existingNodes) : config.chainNodes;
}

function formatNetwork(){
  var n = [];
  for(var i = 0; i < config.network.length; ++i){
    n.push({ val: config.network[i].type, text: config.network[i].name, id: (i+1)});
  }
  return n;
}

function getNetworkByType(typeid){
  return config.network.find((element) => element.type == typeid);
}

// function getNetworkByName(name){
//   return config.network.find((element) => element.name == name);
// }

// ALWAYS use function selectNewChainNode to change currentChainNode value, to avoid web socket listening on old node
const currentChainNode = ref(getChainNodes()[0]);
const listenerChainWS = ref(null);

const state = reactive({
  chainNodes: getChainNodes(),
  // network: config.network,
  network: formatNetwork(),
  selectedChainNode: computed(() =>
    utils.parseNodeConfig(currentChainNode.value)
  ),
});

const accountHttp = computed(() => new AccountHttp(state.selectedChainNode));
const blockHttp = computed(() => new BlockHttp(state.selectedChainNode));
const chainHttp = computed(() => new ChainHttp(state.selectedChainNode));
const networkHttp = computed(() => new NetworkHttp(state.selectedChainNode));
const nodeHttp = computed(() => new NodeHttp(state.selectedChainNode));
const mosaicHttp = computed(() => new MosaicHttp(state.selectedChainNode));
const namespaceHttp = computed(() => new sdk.NamespaceHttp(state.selectedChainNode));

const chainWSListener = computed(() => {
  if (listenerChainWS.value == null) {
    console.log('open new socket')
    listenerChainWS.value = new Listener(
      `${
        currentChainNode.value.protocol.startsWith("http") ? "ws://" : "wss://"
      }${currentChainNode.value.hostname}:${currentChainNode.value.port}`,
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
  currentChainNode.value = found;
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


export const siriusStore = readonly({
  state,
  // getNetworkByName,
  accountHttp,
  blockHttp,
  chainHttp,
  networkHttp,
  mosaicHttp,
  namespaceHttp,
  nodeHttp,
  chainWSListener,
  addChainNode,
  selectNewChainNode,
  stopChainWSListener,
  getNetworkByType,
  createNewAccount,
  createNewAccountPrivateKey
});
