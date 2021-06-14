import { networkState } from "../networkState";
import { SessionService } from "../../models/stores/sessionService"
import { ChainProfile, ChainProfileConfig, ChainProfileNames, ChainProfilePreferences } from "../../models/stores/"

const sessionNetworkName = "networkName";
const sessionNetworkIndex = "network";
const sessionSelectedAPINode = "selectedChainNode";
const lastAccessNetworkName = "lastAccessNetworkName";

export class NetworkStateUtils{

  static refreshAvailableNetwork(){
    networkState.availableNetworks = ChainProfileNames.createDefault().names;
  }

  static changeNetworkByName(networkName:string){
    const chainProfileNames = ChainProfileNames.createDefault();

    let networkChain = chainProfileNames.getIndexByName(networkName);

    if(networkChain < 0){
      networkChain = 0;
      networkState.chainNetworkName = chainProfileNames.names[0];
    }
    else{
      networkState.chainNetworkName = networkName;
    }

     networkState.chainNetwork = networkChain;

     SessionService.setRaw(sessionNetworkIndex, networkChain.toString());
     SessionService.setRaw(sessionNetworkName, networkState.chainNetworkName);

     NetworkStateUtils.updateNetworkProfile();
  }

  static changeNetworkByIndex(index: number){
    const chainProfileNames = ChainProfileNames.createDefault();
    let selectedIndex = index < 0 ? 0 : index;
    let selectedNetworkName = "";

    try {

      selectedNetworkName = chainProfileNames.names[selectedIndex];

    } catch (error) {
      selectedIndex = 0;
      selectedNetworkName = chainProfileNames.names[selectedIndex];
    }

    networkState.chainNetworkName = selectedNetworkName;
    networkState.chainNetwork = selectedIndex;

    SessionService.setNumber(sessionNetworkIndex, selectedIndex);
    SessionService.setRaw(sessionNetworkName, selectedNetworkName);

    NetworkStateUtils.updateNetworkProfile();
  }

  static updateNetworkProfile(){
    const chainProfile = new ChainProfile(networkState.chainNetworkName);
    chainProfile.init();
    networkState.currentNetworkProfile = chainProfile;

    const chainProfileConfig = new ChainProfileConfig(networkState.chainNetworkName);

    chainProfileConfig.init();
    networkState.currentNetworkProfileConfig = chainProfileConfig;

    NetworkStateUtils.setAPINodeInit();
  }

  static setAPINodeInit(){
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
    SessionService.setNumber('nodePort', networkState.currentNetworkProfile?.httpPort || 3000);
    SessionService.setRaw('selectedChainNode', networkState.selectedAPIEndpoint);
  }

  static updateChainNode(apiNode: string){
    const chainProfilePreferences = new ChainProfilePreferences(networkState.chainNetworkName);
    chainProfilePreferences.apiNode = apiNode;
    chainProfilePreferences.saveToLocalStorage();
    networkState.selectedAPIEndpoint = apiNode;
    SessionService.setRaw(sessionSelectedAPINode, networkState.selectedAPIEndpoint);
  }

  static buildAPIEndpointURL(url: string): string{
    const portNumber = networkState.currentNetworkProfile ? networkState.currentNetworkProfile.httpPort : 3000;

    return location.protocol=='https:' ? `https://${url}` : `http://${url}:${portNumber}`;
  }

  static buildWSEndpointURL(url: string): string{

    const portNumber = networkState.currentNetworkProfile ? networkState.currentNetworkProfile.httpPort : 3000;

    return location.protocol=='https:' ? `wss://${url}` : `ws://${url}:${portNumber}`;
  }

  static setLocalDefaultNetwork(networkName: string){
    localStorage.setItem(lastAccessNetworkName, networkName);
  }

  static checkDefaultNetwork(){
    const networkName = localStorage.getItem(lastAccessNetworkName);

    if(networkName){
      NetworkStateUtils.changeNetworkByName(networkName);
    }
    else{
      NetworkStateUtils.changeNetworkByIndex(0);
    }
  }

  static updateBlockHeight(height: number){
    networkState.blockHeight = height;
  }
}