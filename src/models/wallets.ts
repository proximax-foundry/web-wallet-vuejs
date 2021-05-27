import { Wallet } from './wallet';

const walletKey = "sw";
const walletUpdateTimeKey = "sw_updated"

export class Wallets {
    wallets: Wallet[];
    updateTime: number;

    constructor(){
        this.fetchFromLocalStorage();
    }

    static fetchUpdateTime(){
        return localStorage.getItem(walletUpdateTimeKey) ? parseInt(localStorage.getItem(walletUpdateTimeKey)): 0;
    }

    fetchFromLocalStorage(){
        this.wallets = JSON.parse(localStorage.getItem(walletKey)) || [];
        this.updateTime = localStorage.getItem(walletUpdateTimeKey) ? parseInt(localStorage.getItem(walletUpdateTimeKey)) : new Date().getTime();
    }

    isWalletOutdated(){

        if(this.updateTime < Wallets.fetchUpdateTime()){
            return true;
        }

        return false;
    }

    savetoLocalStorage(){
        localStorage.setItem(walletKey, JSON.stringify(this.wallets));
        this.updateTime = new Date().getTime();
        localStorage.setItem(walletUpdateTimeKey, this.updateTime.toString());
    }

    removeWallet(index: number){
        try {
            this.wallets.splice(index, 1);
            this.savetoLocalStorage();
        } catch (error) {
            throw new Error("Wallet with specify index not exist");
        }
    }

    removeWalletByNetworkNameAndName(networkName: string, name: string){
        var index = this.getWalletIndex(networkName, name);
        
        if(index){
            this.removeWallet(index);
        }

        return index ? true: false;
    }

    getWalletIndex(networkName: string, name: string){
        return this.wallets.findIndex((wallet)=> wallet.networkName == networkName && wallet.name == name)
    }

    filterByNetworkName(networkName: string){
        return this.wallets.filter((wallet)=> wallet.networkName == networkName)
    }

    filterByNetworkNameAndName (networkName: string, name: string){
        return this.wallets.find((wallet)=> wallet.networkName == networkName && wallet.name == name)
    }
}