import { Wallet } from './wallet';

const walletKey = "sw";
const walletUpdateTimeKey = "sw_updated"

export class Wallets {
    wallets: Wallet[] = [];
    updateTime: number = 0;

    constructor(){
        this.fetchFromLocalStorage();
    }

    static fetchUpdateTime(){
        const tempUpdateTime = localStorage.getItem(walletUpdateTimeKey);
        return tempUpdateTime ?  parseInt(tempUpdateTime) : 0;
    }

    fetchFromLocalStorage(){
        const tempWallets = localStorage.getItem(walletKey);

        try {
            if(tempWallets){
                this.wallets = JSON.parse(tempWallets);
            }
            else{
                this.wallets = [];
            }
        } catch (error) {
            this.wallets = [];
        }

        const tempUpdateTime = localStorage.getItem(walletUpdateTimeKey);

        this.updateTime = tempUpdateTime ?  parseInt(tempUpdateTime) : new Date().getTime();
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
        const index = this.getWalletIndex(networkName, name);
        
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