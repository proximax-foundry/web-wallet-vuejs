import { StoreProperties } from "./storeProperties";
import { Wallets } from "../wallets";
import { Wallet } from "../wallet";

const key = "ChainProfilesName";

export class ChainProfileNames extends StoreProperties {

    names: string[] = [];

    constructor(storeName: string){
        super(storeName);
    }

    static createDefault(){
        var newObj = new ChainProfileNames(key);
        newObj.init();
        return newObj;
    }

    fetchFromLocalStorage(){
        this.init();
    }

    replaceFirst2Names(names: string[]) {

        var count = 0;

        for(var i = 0; i < 2; i++){
            var updated = this.replaceAndUpdateWallet(this.names[i], names[i], i);

            count += updated ? 1 : 0;
        }

       return count;
    }

    replaceFirst3Names(names: string[]) {

        var count = 0;

        for(var i = 0; i < 3; i++){
            var updated = this.replaceAndUpdateWallet(this.names[i], names[i], i);

            count += updated ? 1 : 0;
        }

        return count;
    }

    replaceAndUpdateWallet(oldName: string, newName: string, index: number){
        if(oldName !== newName){
            var allWallets = new Wallets();
            var newWallets: Wallet[];

            if(allWallets){
                newWallets = allWallets.wallets.map((wallet)=>{
                    if(wallet.networkName === oldName){
                        wallet.networkName = newName;
                    }
                    
                    return wallet;
                });

                allWallets.wallets = newWallets;

                allWallets.savetoLocalStorage();
            }

            this.names[index] = newName;

            return true;
        }

        return false;
    }

    getIndexByName(name: string){
        return this.names.findIndex(currentName=> currentName == name)
    }
}