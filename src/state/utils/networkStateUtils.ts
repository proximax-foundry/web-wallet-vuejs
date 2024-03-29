import { networkState } from "../networkState";
import { AppState } from "../appState";
import { SessionService } from "../../models/stores/sessionService"
import { ChainProfile, ChainProfileConfig, ChainProfileNames, ChainProfilePreferences } from "../../models/stores/"
import { ChainAPICall } from "@/models/REST/chainAPICall";
import { BuildTransactions } from "@/util/buildTransactions";
import { ChainUtils } from "@/util/chainUtils"
import { FeeCalculationStrategy, NetworkType } from "tsjs-xpx-chain-sdk";

const sessionNetworkName = "networkName";
const sessionNetworkIndex = "network";
const sessionSelectedAPINode = "selectedChainNode";
const lastAccessNetworkName = "lastAccessNetworkName";

export class NetworkStateUtils{

  static refreshAvailableNetwork(): void{
    networkState.availableNetworks = ChainProfileNames.createDefault().names.map(value => value.name);
  }

  static changeNetworkByName(networkName:string): void{
    const chainProfileNames = ChainProfileNames.createDefault();

    let networkChain = chainProfileNames.getIndexByName(networkName);

    if(networkChain < 0){
      networkChain = 0;
      networkState.chainNetworkName = chainProfileNames.names[0].name;
    }
    else{
      networkState.chainNetworkName = networkName;
    }

     networkState.chainNetwork = networkChain;

     SessionService.setRaw(sessionNetworkIndex, networkChain.toString());
     SessionService.setRaw(sessionNetworkName, networkState.chainNetworkName);

     NetworkStateUtils.updateNetworkProfile();
  }

  static changeNetworkByIndex(index: number): void{
    const chainProfileNames = ChainProfileNames.createDefault();
    let selectedIndex = index < 0 ? 0 : index;
    let selectedNetworkName = "";

    try {

      selectedNetworkName = chainProfileNames.names[selectedIndex].name;

    } catch (error) {
      selectedIndex = 0;
      selectedNetworkName = chainProfileNames.names[selectedIndex].name;
    }

    networkState.chainNetworkName = selectedNetworkName;
    networkState.chainNetwork = selectedIndex;

    SessionService.setNumber(sessionNetworkIndex, selectedIndex);
    SessionService.setRaw(sessionNetworkName, selectedNetworkName);

    NetworkStateUtils.updateNetworkProfile();
  }

  static updateNetworkProfile(): void{
    const chainProfile = new ChainProfile(networkState.chainNetworkName);
    chainProfile.init();
    networkState.currentNetworkProfile = chainProfile;
    if(chainProfile.network.currency.assetId){
      AppState.nativeToken.assetId = chainProfile.network.currency.assetId;
    }
    AppState.nativeToken.divisibility = chainProfile.network.currency.divisibility;
    AppState.nativeToken.label = chainProfile.network.currency.name;
    AppState.nativeToken.fullNamespace = chainProfile.network.currency.namespace;
    AppState.networkType = ChainUtils.getNetworkType(chainProfile.network.type);
    // AppState.trackingTxnHash = [];
    AppState.txnActivityLog = [];
    AppState.txnCosignLog = [];
    AppState.txnSwapLog = [];
    if(AppState.networkType === NetworkType.PRIVATE || AppState.networkType === NetworkType.PRIVATE_TEST){
      AppState.buildTxn = new BuildTransactions(chainProfile.network.type, chainProfile.generationHash, FeeCalculationStrategy.ZeroFeeCalculationStrategy);
    }
    else{
      AppState.buildTxn = new BuildTransactions(chainProfile.network.type, chainProfile.generationHash);
    }

    const chainProfileConfig = new ChainProfileConfig(networkState.chainNetworkName);

    chainProfileConfig.init();
    networkState.currentNetworkProfileConfig = chainProfileConfig;

    NetworkStateUtils.setAPINodeInit();
  }

  static setAPINodeInit(): void{
    const chainProfilePreferences = new ChainProfilePreferences(networkState.chainNetworkName);

    chainProfilePreferences.init();

    const endpoints = networkState.currentNetworkProfile ? networkState.currentNetworkProfile.apiNodes : [];

    if(chainProfilePreferences.apiNode && endpoints.includes(chainProfilePreferences.apiNode)){
      networkState.selectedAPIEndpoint = chainProfilePreferences.apiNode;
    }
    else{
      if(endpoints.length > 0){
        const randomAPINodeIndex = Math.floor(Math.random() * endpoints.length);
        chainProfilePreferences.apiNode = endpoints[randomAPINodeIndex];
        chainProfilePreferences.saveToLocalStorage();
  
        networkState.selectedAPIEndpoint = endpoints[randomAPINodeIndex];
      }
      else{
        networkState.selectedAPIEndpoint = "";
      }
    }
    let portNumber = networkState.currentNetworkProfile?.httpPort;

    SessionService.setNumber('nodePort', portNumber !== null ? portNumber : 3000);
    SessionService.setRaw('selectedChainNode', networkState.selectedAPIEndpoint);

    AppState.nodeFullURL = NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint);
    AppState.nodeURL = networkState.selectedAPIEndpoint;
    AppState.wsNodeFullURL = NetworkStateUtils.buildWSEndpointURL(networkState.selectedAPIEndpoint);
    AppState.chainAPI = new ChainAPICall(AppState.nodeFullURL);
  }

  static updateChainNode(apiNode: string): void{
    const chainProfilePreferences = new ChainProfilePreferences(networkState.chainNetworkName);
    chainProfilePreferences.apiNode = apiNode;
    chainProfilePreferences.saveToLocalStorage();
    networkState.selectedAPIEndpoint = apiNode;
    AppState.nodeFullURL = NetworkStateUtils.buildAPIEndpointURL(apiNode);
    AppState.nodeURL = apiNode;
    AppState.wsNodeFullURL = NetworkStateUtils.buildWSEndpointURL(apiNode);
    AppState.chainAPI = new ChainAPICall(AppState.nodeFullURL);
    SessionService.setRaw(sessionSelectedAPINode, networkState.selectedAPIEndpoint);
  }

  static buildAPIEndpointURL(url: string): string{
    const portNumber = networkState.currentNetworkProfile !== null ? networkState.currentNetworkProfile.httpPort : 3000;

    return ChainUtils.buildAPIEndpoint(url, portNumber);
  }

  static buildWSEndpointURL(url: string): string{

    const portNumber = networkState.currentNetworkProfile !== null ? networkState.currentNetworkProfile.httpPort : 3000;

    return ChainUtils.buildWSEndpoint(url, portNumber);
  }

  static setLocalDefaultNetwork(networkName: string): void{
    localStorage.setItem(lastAccessNetworkName, networkName);
  }

  static checkDefaultNetwork(): void{
    const networkName = localStorage.getItem(lastAccessNetworkName);

    const sessionSelectedNetworkName = sessionStorage.getItem(sessionNetworkName);

    if(sessionSelectedNetworkName){
      NetworkStateUtils.changeNetworkByName(sessionSelectedNetworkName);
    }
    else if(networkName){
      NetworkStateUtils.changeNetworkByName(networkName);
    }
    else{
      NetworkStateUtils.changeNetworkByIndex(0);
    }
  }

  static updateBlockHeight(height: number): void{
    networkState.blockHeight = height;
  }

  static updateLastAccessNetworkName(networkName: string): void{
    sessionStorage.setItem("lastNetworkName", networkName);
    localStorage.setItem(lastAccessNetworkName, networkName);
  }

  static async updateNetworkConfig(){
    if(AppState.chainAPI === null){
      return false;
    }

    try {
      let chainAPICall = AppState.chainAPI as ChainAPICall;

      const chainHeight = await chainAPICall.chainAPI.getBlockchainHeight();
    
      const config = await ChainUtils.getChainConfig(chainHeight, chainAPICall.chainConfigAPI);
    
      const chainProfileConfigStore = new ChainProfileConfig(networkState.chainNetworkName);
    
      chainProfileConfigStore.init();
    
      if (typeof config !== "string") {
          config.chainHeight = chainHeight;
          chainProfileConfigStore.updateConfig(config);
          chainProfileConfigStore.saveToLocalStorage();
          networkState.currentNetworkProfileConfig = chainProfileConfigStore;
          return true;
      }
      else{
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  static checkSession(){
    const sessionNetworkAuth = SessionService.getRaw("secured_auth");

    if(sessionNetworkAuth){
      networkState.currentNetworkProfile.apikey = sessionNetworkAuth;
    }
  }
}