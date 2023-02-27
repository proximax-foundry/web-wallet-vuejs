import {WalletUtils} from "../util/walletUtils";
import { AppState } from "../state/appState";
import {ChainProfile} from "./stores/chainProfile"
import {networkState} from "../state/networkState";
import { NetworkType } from "tsjs-xpx-chain-sdk";

const latestPatchVersion: number = 1;
type MethodMap = { [name: string]: (any :any) => void };

export class WalletMigration{
    version: number;

    constructor(){
        this.version = WalletMigration.getMigrationVersion();
    }

    
    private static methodMap :MethodMap= {
        'patchV1': WalletMigration.patchV1
    };

    public static async do(commandType: string, params?: any) {
        if (WalletMigration.methodMap.hasOwnProperty(commandType)) {
            const method = WalletMigration.methodMap[commandType];
            method(params);
        }
    }

    async runPatching(){
        while(this.version < latestPatchVersion){
            let newPatchVersion = this.version + 1;

            const funcName = "patchV" + newPatchVersion.toString()
           
            await WalletMigration.do(funcName)

            this.version = newPatchVersion;
            WalletMigration.updateMigrationVersion(newPatchVersion);
        }
    }


    static async patchV1(){

        while(!AppState.readyStates.get("chainProfile") && !AppState.readyStates.get("checkSession")){
            await new Promise(res => setTimeout(res, 1000));
        }
        let storedWallets = localStorage.getItem("sw-mainnet")

        if(storedWallets){
            WalletMigration.doLocalStorageBackup("sw", 1);
            let storedWalletsObj: any = JSON.parse(storedWallets);
            let networkName = WalletMigration.getFistChainProfileWithNetworkType(networkState.availableNetworks, NetworkType.MAIN_NET);
            
            if(networkName){
                WalletUtils.initFixOldFormat(storedWalletsObj, networkName, NetworkType.MAIN_NET);
            }   
            return
        }
        storedWallets =localStorage.getItem("sw-testnet")
        if(storedWallets){
            WalletMigration.doLocalStorageBackup("sw",1);
            let storedWalletsObj: any = JSON.parse(storedWallets);
            let networkName = WalletMigration.getFistChainProfileWithNetworkType(networkState.availableNetworks, NetworkType.TEST_NET);

            if(networkName){
                WalletUtils.initFixOldFormat(storedWalletsObj, networkName, NetworkType.TEST_NET);
            }   
        }
    }

    static updateMigrationVersion(version: number){
        localStorage.setItem("migration", version.toString())
    }

    static getMigrationVersion(): number{
        const migrationVersion = localStorage.getItem("migration")
        if(migrationVersion){
            return parseInt(migrationVersion);
        }
        else{
            return 0;
        }
    }

    static doLocalStorageBackup(storageName: string, version: number){
        let backupData = localStorage.getItem(storageName)
        if(backupData){
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