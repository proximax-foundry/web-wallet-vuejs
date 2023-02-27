import { StoreProperties } from "./storeProperties";


const key = "ChainProfilesName";

export interface ChainProfileName{
    name:string;
    isPreset: boolean;
}

export class ChainProfileNames extends StoreProperties {

    names: ChainProfileName[] = [];

    constructor(storeName: string){
        super(storeName);
    }

    static createDefault(): ChainProfileNames{
        const newObj = new ChainProfileNames(key);
        newObj.init();
        return newObj;
    }

    fetchFromLocalStorage(): void{
        this.init();
    }

    // replaceFirstNames(names: string[]): number {

    //     let count = 0;

    //     for(let i = 0; i < 1; i++){
    //         const updated = this.replaceAndUpdateWallet(this.names[i], names[i], i);

    //         count += updated ? 1 : 0;
    //     }

    //    return count;
    // }

    // replaceFirst2Names(names: string[]): number {

    //     let count = 0;

    //     for(let i = 0; i < 2; i++){
    //         const updated = this.replaceAndUpdateWallet(this.names[i], names[i], i);

    //         count += updated ? 1 : 0;
    //     }

    //    return count;
    // }

    // replaceFirst3Names(names: string[]): number {

    //     let count = 0;

    //     for(let i = 0; i < 3; i++){
    //         const updated = this.replaceAndUpdateWallet(this.names[i], names[i], i);

    //         count += updated ? 1 : 0;
    //     }

    //     return count;
    // }

    // replaceAndUpdateWallet(oldName: string, newName: string, index: number): boolean{
    //     if(this.names.includes(newName) || this.names.includes(oldName)){
    //         return false;
    //     }
    //     if(oldName !== newName){
    //         const allWallets = new Wallets();
    //         let newWallets: Wallet[];

    //         if(allWallets){
    //             newWallets = allWallets.wallets.map((wallet)=>{
    //                 if(wallet.networkName === oldName){
    //                     wallet.networkName = newName;
    //                 }
                    
    //                 return wallet;
    //             });

    //             allWallets.wallets = newWallets;

    //             allWallets.savetoLocalStorage();
    //         }

    //         this.names[index] = newName;

    //         return true;
    //     }

    //     return false;
    // }

    getIndexByName(name: string): number{
        return this.names.findIndex(currentName=> currentName.name == name)
    }
}