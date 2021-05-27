import { networkState } from "../networkState";
import { SessionService } from "../../models/stores/sessionService"
import { ChainProfile, ChainProfileConfig, ChainProfileNames, ChainProfilePreferences } from "../../models/stores/"

const sessionNetworkName = "networkName";
const sessionNetworkIndex = "network";
const localStorageSelectedChainNode = "selectedChainNode";

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

    SessionService.setRaw(sessionNetworkIndex, selectedIndex.toString());
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
  }

  static updateChainNode(apiNode: string){
    const chainProfilePreferences = new ChainProfilePreferences(networkState.chainNetworkName);
    chainProfilePreferences.apiNode = apiNode;
    chainProfilePreferences.saveToLocalStorage();
    networkState.selectedAPIEndpoint = apiNode;
    SessionService.setRaw(localStorageSelectedChainNode, networkState.selectedAPIEndpoint);
  }

  static buildAPIEndpointURL(url: string): string{
    const portNumber = networkState.currentNetworkProfile ? networkState.currentNetworkProfile.httpPort : 3000;

    return location.protocol=='https:' ? `https://${url}` : `http://${url}:${portNumber}`;
  }

  static buildWSEndpointURL(url: string): string{

    const portNumber = networkState.currentNetworkProfile ? networkState.currentNetworkProfile.httpPort : 3000;

    return location.protocol=='https:' ? `wss://${url}` : `ws://${url}:${portNumber}`;
  }
}