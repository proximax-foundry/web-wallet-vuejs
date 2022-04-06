import {WalletUtils} from "../util/walletUtils";
import { AppState } from "../state/appState";
import {ChainProfile} from "./stores/chainProfile"
import {networkState} from "../state/networkState";
import { NetworkType } from "tsjs-xpx-chain-sdk";

const latestPatchVersion: number = 1;

export class WalletMigration{
    version: number;

    constructor(){
        this.version = WalletMigration.getMigrationVersion();
    }

    async runPatching(){
        while(this.version < latestPatchVersion){

            let newPatchVersion = this.version + 1;

            await WalletMigration["patchV" + newPatchVersion]();

            this.version = newPatchVersion;
            WalletMigration.updateMigrationVersion(newPatchVersion);
        }
    }

    static async patchV1(){

        while(!AppState.readyStates.get("chainProfile") && !AppState.readyStates.get("checkSession")){
            await new Promise(res => setTimeout(res, 1000));
        }

        if(localStorage.getItem("sw-mainnet")){
            WalletMigration.doLocalStorageBackup("sw", 1);
            let storedWallets: any = JSON.parse(localStorage.getItem("sw-mainnet"));
            let networkName = WalletMigration.getFistChainProfileWithNetworkType(networkState.availableNetworks, NetworkType.MAIN_NET);
            
            if(networkName){
                WalletUtils.initFixOldFormat(storedWallets, networkName, NetworkType.MAIN_NET);
            }   
        }
        else if(localStorage.getItem("sw-testnet")){
            WalletMigration.doLocalStorageBackup("sw", 1);
            let storedWallets: any = JSON.parse(localStorage.getItem("sw-testnet"));
            let networkName = WalletMigration.getFistChainProfileWithNetworkType(networkState.availableNetworks, NetworkType.TEST_NET);

            if(networkName){
                WalletUtils.initFixOldFormat(storedWallets, networkName, NetworkType.TEST_NET);
            }   
        }

        console.log("Patching v1 done");
    }

    static updateMigrationVersion(version: number){
        localStorage.setItem("migration", version.toString())
    }

    static getMigrationVersion(): number{
        if(localStorage.getItem("migration")){
            return parseInt(localStorage.getItem("migration"));
        }
        else{
            return 0;
        }
    }

    static doLocalStorageBackup(storageName: string, version: number){
        if(localStorage.getItem(storageName)){
            let backupData = localStorage.getItem(storageName);
            localStorage.setItem(`pre${version}-${storageName}`, backupData);
        }
    }

    static getFistChainProfileWithNetworkType(allNetworkName: string[], networkType: NetworkType){

        let returnNetworkName = "";

        for(let i = 0; i < allNetworkName.length; ++i){
            const chainProfile = new ChainProfile(allNetworkName[i]);
            chainProfile.init();

            if(networkType === chainProfile.network.type){
                returnNetworkName = allNetworkName[i];
                break;
            }
        }

        return returnNetworkName;
    }
}