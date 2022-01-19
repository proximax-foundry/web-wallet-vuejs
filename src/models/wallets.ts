import { Asset } from './asset';
import { Namespace } from './namespace';
import { Wallet } from './wallet';
import { WalletAccount } from './walletAccount';
import { OtherAccount } from './otherAccount';
import { Address, AliasType } from "tsjs-xpx-chain-sdk";
import { MultisigInfo } from './multisigInfo';
import { nis1Account } from './nis1Account';
import { AddressBook } from './addressBook';
import { WalletAcountType } from './const/otherAccountType';

const walletKey = "sw";
const walletUpdateTimeKey = "sw_updated"

export class Wallets {
    wallets: Wallet[] = [];
    updateTime: number = 0;
    isReady: boolean = false;

    constructor(){
        this.fetchFromLocalStorage();
    }

    static fetchUpdateTime(): number{
        const tempUpdateTime = localStorage.getItem(walletUpdateTimeKey);
        return tempUpdateTime ?  parseInt(tempUpdateTime) : 0;
    }

    fetchFromLocalStorage(): void{
        const tempWallets = localStorage.getItem(walletKey);

        try {
            if(tempWallets){
                this.wallets = Reconstruct.reconstruct(JSON.parse(tempWallets));
            }
            else{
                this.wallets = [];
            }
        } catch (error) {
            this.wallets = [];
        }
        this.isReady = true;

        const tempUpdateTime = localStorage.getItem(walletUpdateTimeKey);

        this.updateTime = tempUpdateTime ?  parseInt(tempUpdateTime) : new Date().getTime();
    }

    isWalletOutdated(): boolean{

        if(this.updateTime < Wallets.fetchUpdateTime()){
            return true;
        }

        return false;
    }

    savetoLocalStorage(): void{
        localStorage.setItem(walletKey, JSON.stringify(this.wallets));
        this.updateTime = new Date().getTime();
        localStorage.setItem(walletUpdateTimeKey, this.updateTime.toString());
    }

    saveMyWalletOnlytoLocalStorage(myWallet: Wallet): void{

        let newWalletsInstance = new Wallets();

        let walletIndex = newWalletsInstance.wallets.findIndex((wallet)=> wallet.name === myWallet.name && wallet.networkName === myWallet.networkName)

        newWalletsInstance.wallets[walletIndex] = myWallet;

        localStorage.setItem(walletKey, JSON.stringify(newWalletsInstance.wallets));
        this.updateTime = new Date().getTime();
        localStorage.setItem(walletUpdateTimeKey, this.updateTime.toString());
    }

    removeWallet(index: number): void{
        try {
            this.wallets.splice(index, 1);
            this.savetoLocalStorage();
        } catch (error) {
            throw new Error("Wallet with specify index not exist");
        }
    }

    removeWalletByNetworkNameAndName(networkName: string, name: string): boolean{
        const index = this.getWalletIndex(networkName, name);
        
        if(index > -1){
            this.removeWallet(index);
        }

        return index > -1 ? true: false;
    }

    getWalletIndex(networkName: string, name: string): number{
        return this.wallets.findIndex((wallet)=> wallet.networkName == networkName && wallet.name == name)
    }

    filterByNetworkName(networkName: string): Wallet[]{
        return this.wallets.filter((wallet)=> wallet.networkName == networkName)
    }

    filterByNetworkNameAndName (networkName: string, name: string): Wallet{
        return this.wallets.find((wallet)=> wallet.networkName == networkName && wallet.name == name)
    }
}


class Reconstruct{

    static reconstruct(JSON_Wallets: Wallet[]): Wallet[]{

        let wallets: Wallet[] = [];

        for(let i =0; i < JSON_Wallets.length; ++i){

            let accounts: WalletAccount[] = [];

            for(let k =0; k < JSON_Wallets[i].accounts.length; ++k){
                
                let tempAccount = JSON_Wallets[i].accounts[k];

                let newWalletAccount = Reconstruct.recreateWalletAccount(tempAccount);

                newWalletAccount.assets = [];

                for(let x =0; x < tempAccount.assets.length; ++x){
                    let tempAsset = tempAccount.assets[x];
                    
                    newWalletAccount.addAsset(Reconstruct.recreateAsset(tempAsset));
                }

                newWalletAccount.namespaces = [];

                for(let x =0; x < tempAccount.namespaces.length; ++x){
                    let tempNamespace = tempAccount.namespaces[x];

                    newWalletAccount.addNamespace(Reconstruct.recreateNamespace(tempNamespace));
                }

                newWalletAccount.multisigInfo = [];

                for(let x =0; x < tempAccount.multisigInfo.length; ++x){
                    let tempMultisigInfo = tempAccount.multisigInfo[x];

                    newWalletAccount.multisigInfo.push(Reconstruct.recreateMutlisigInfo(tempMultisigInfo));
                }
                
                newWalletAccount.nis1Account = tempAccount.nis1Account ? Reconstruct.recreateNis1Account(tempAccount.nis1Account)  : null;

                accounts.push(newWalletAccount);
            }

            

            let otherAccounts: OtherAccount[] = [];

            for(let k =0; k < JSON_Wallets[i].others.length; ++k){
                
                let tempOtherAccount = JSON_Wallets[i].others[k];

                let newOtherAccount = Reconstruct.recreateOtherAccount(tempOtherAccount);

                newOtherAccount.assets = [];

                for(let x =0; x < tempOtherAccount.assets.length; ++x){
                    let tempAsset = tempOtherAccount.assets[x];
                    
                    newOtherAccount.addAsset(Reconstruct.recreateAsset(tempAsset));
                }

                newOtherAccount.namespaces = [];

                for(let x =0; x < tempOtherAccount.namespaces.length; ++x){
                    let tempNamespace = tempOtherAccount.namespaces[x];

                    newOtherAccount.addNamespace(Reconstruct.recreateNamespace(tempNamespace));
                }

                newOtherAccount.multisigInfo = [];

                for(let x =0; x < tempOtherAccount.multisigInfo.length; ++x){
                    let tempMultisigInfo = tempOtherAccount.multisigInfo[x];

                    newOtherAccount.multisigInfo.push(Reconstruct.recreateMutlisigInfo(tempMultisigInfo));
                }

                otherAccounts.push(newOtherAccount);
            }

            let contacts: AddressBook[] = [];

            for(let k =0; k < JSON_Wallets[i].contacts.length; ++k){
                let tempContact = JSON_Wallets[i].contacts[k];

                contacts.push(Reconstruct.recreateAddressBook(tempContact));
            }

            let newWallet = new Wallet(JSON_Wallets[i].name, JSON_Wallets[i].networkName, accounts);
            newWallet.others = otherAccounts;
            newWallet.contacts = contacts;

            wallets.push(newWallet);
        }

        return wallets;
    }

    static recreateAsset(tempAsset: Asset): Asset{
        let newAsset = new Asset(tempAsset.idHex, tempAsset.divisibility, tempAsset.supplyMutable, tempAsset.transferable, tempAsset.owner);
        newAsset.amount = tempAsset.amount ? tempAsset.amount : 0;
        newAsset.duration = tempAsset.duration ? tempAsset.duration : null;
        newAsset.expirationBlock = tempAsset.expirationBlock ? tempAsset.expirationBlock : null;
        newAsset.namespaceNames = tempAsset.namespaceNames ? tempAsset.namespaceNames : [];
        newAsset.owner = tempAsset.owner ? tempAsset.owner : null;
        newAsset.supply = tempAsset.supply ? tempAsset.supply : 0;

        return newAsset;
    }

    static recreateNamespace(tempNamespace: Namespace): Namespace{
        let newNamespace = new Namespace(tempNamespace.idHex, tempNamespace.name);

        newNamespace.active = tempNamespace.active ? tempNamespace.active : false;
        newNamespace.parentId = tempNamespace.parentId ? tempNamespace.parentId : "";
        newNamespace.startHeight = tempNamespace.startHeight ? tempNamespace.startHeight : null;
        newNamespace.endHeight = tempNamespace.endHeight ? tempNamespace.endHeight : null;
        newNamespace.linkedId = tempNamespace.linkedId ? tempNamespace.linkedId : "";

        if(tempNamespace.linkType){
            switch (tempNamespace.linkType) {
                case AliasType.Address:
                    newNamespace.linkType = AliasType.None;
                    break;
                case AliasType.Mosaic:
                    newNamespace.linkType = AliasType.Mosaic;
                    break;
                default:
                    newNamespace.linkType = AliasType.None;
                    break;
            }
        }
        else{
            newNamespace.linkType = AliasType.None;
        }

        return newNamespace;
    }

    static recreateMutlisigInfo(multisigInfo: MultisigInfo): MultisigInfo{

        let newMultisigInfo = new MultisigInfo(multisigInfo.publicKey, multisigInfo.level,  
            multisigInfo.cosignaturies, multisigInfo.multisigAccounts, 
            multisigInfo.minApproval, multisigInfo.minRemoval);

        return newMultisigInfo;
    }

    static recreateAddressBook(addressBook: AddressBook): AddressBook{
        let group;
        if(!addressBook.group){
            group = '-none-'
        }else{
            group = addressBook.group;
        }
        let newAddressBook = new AddressBook(addressBook.name, addressBook.address, group);
        return newAddressBook;
    }

    static recreateOtherAccount(tempAccount: OtherAccount): OtherAccount{

        let accountType: WalletAcountType = WalletAcountType.MULTISIG_CHILD;

        switch(tempAccount.type){
            case WalletAcountType.MULTISIG_CHILD:
                accountType = WalletAcountType.MULTISIG_CHILD;
                break;
            case WalletAcountType.DELEGATE_VALIDATE:
                accountType = WalletAcountType.DELEGATE_VALIDATE;
                break;
            default:
                accountType = WalletAcountType.MULTISIG_CHILD;
                break;
        }

        let newAccount = new OtherAccount(tempAccount.name, tempAccount.publicKey, 
            tempAccount.address, accountType);

        newAccount.balance = tempAccount.balance ? tempAccount.balance : 0;

        return newAccount;
    }

    static recreateWalletAccount(tempAccount: WalletAccount): WalletAccount{
        let newAccount = new WalletAccount(tempAccount.name, tempAccount.publicKey, 
            tempAccount.address, tempAccount.algo, tempAccount.encrypted, tempAccount.iv);

        newAccount.balance = tempAccount.balance ? tempAccount.balance : 0;
        newAccount.default = tempAccount.default ? tempAccount.default : false;
        newAccount.isBrain = tempAccount.isBrain ? tempAccount.isBrain : false;

        return newAccount;
    }

    static recreateNis1Account(temp_nis1Account: nis1Account): nis1Account{
        let new_nisAccount = new nis1Account(temp_nis1Account.address, temp_nis1Account.publicKey, temp_nis1Account.balance);
        return new_nisAccount;
    }
}