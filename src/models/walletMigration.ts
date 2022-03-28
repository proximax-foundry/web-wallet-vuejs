import {WalletUtils} from "../util/walletUtils";
import {Wallets} from "../models/wallets";
import { AppState } from "../state/appState";
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
            let newWallet = new Wallets();
            newWallet.wallets = storedWallets;
            WalletUtils.initFixOldFormat(newWallet, networkState.availableNetworks[0], NetworkType.MAIN_NET);
        }
        else if(localStorage.getItem("sw-testnet")){
            WalletMigration.doLocalStorageBackup("sw", 1);
            let storedWallets: any = JSON.parse(localStorage.getItem("sw-testnet"));
            let newWallet = new Wallets();
            newWallet.wallets = storedWallets;
            WalletUtils.initFixOldFormat(newWallet, networkState.availableNetworks[0], NetworkType.TEST_NET);
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
}