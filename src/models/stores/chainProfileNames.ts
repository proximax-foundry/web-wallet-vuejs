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
        const newObj = new ChainProfileNames(key);
        newObj.init();
        return newObj;
    }

    fetchFromLocalStorage(){
        this.init();
    }

    replaceFirst2Names(names: string[]) {

        let count = 0;

        for(let i = 0; i < 2; i++){
            const updated = this.replaceAndUpdateWallet(this.names[i], names[i], i);

            count += updated ? 1 : 0;
        }

       return count;
    }

    replaceFirst3Names(names: string[]) {

        let count = 0;

        for(let i = 0; i < 3; i++){
            const updated = this.replaceAndUpdateWallet(this.names[i], names[i], i);

            count += updated ? 1 : 0;
        }

        return count;
    }

    replaceAndUpdateWallet(oldName: string, newName: string, index: number){
        if(oldName !== newName){
            const allWallets = new Wallets();
            let newWallets: Wallet[];

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