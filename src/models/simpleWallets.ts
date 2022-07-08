import { SimpleWallet } from './simpleWallet';
import { AddressBook } from './addressBook';
import { Label } from './label';
import { SimpleAccount } from './simpleAccount';

const walletKey = "sw";
const walletUpdateTimeKey = "sw_updated"

export class SimpleWallets {
    wallets: SimpleWallet[] = [];

    constructor(){
        this.fetchFromLocalStorage();
    }

    fetchFromLocalStorage(): void{
        const tempWallets = localStorage.getItem(walletKey);

        try {
            if(tempWallets){
                this.wallets = Reconstruct.reconstructAll(JSON.parse(tempWallets));
            }
            else{
                this.wallets = [];
            }
        } catch (error) {
            this.wallets = [];
        }
    }

    savetoLocalStorage(): void{
        localStorage.setItem(walletKey, JSON.stringify(this.wallets));
    }

    saveMyWalletOnlytoLocalStorage(myWallet: SimpleWallet): void{

        let newWalletsInstance = new SimpleWallets();

        let walletIndex = newWalletsInstance.wallets.findIndex((wallet)=> wallet.name === myWallet.name && wallet.networkName === myWallet.networkName)

        newWalletsInstance.wallets[walletIndex] = myWallet;

        localStorage.setItem(walletKey, JSON.stringify(newWalletsInstance.wallets));
    }
}


class Reconstruct{

    static reconstructAll(JSON_Wallets: SimpleWallet[]): SimpleWallet[]{

        let wallets: SimpleWallet[] = [];

        for(let i =0; i < JSON_Wallets.length; ++i){

            let accounts: SimpleAccount[] = [];

            for(let k =0; k < JSON_Wallets[i].accounts.length; ++k){
                
                let tempAccount = JSON_Wallets[i].accounts[k];

                let newWalletAccount = Reconstruct.recreateSimpleAccount(tempAccount);
                                 
                accounts.push(newWalletAccount);
            }
    
            let contacts: AddressBook[] = [];

            for(let k =0; k < JSON_Wallets[i].contacts.length; ++k){
                let tempContact = JSON_Wallets[i].contacts[k];

                contacts.push(Reconstruct.recreateAddressBook(tempContact));
            }
            let labels :Label[] = []
            if(JSON_Wallets[i].labels){
                for(let k =0; k < JSON_Wallets[i].labels.length; ++k){
                    let tempLabel = JSON_Wallets[i].labels[k];
                    labels.push(Reconstruct.recreateLabel(tempLabel));
                }
            }
            
            let newWallet = new SimpleWallet(JSON_Wallets[i].name, JSON_Wallets[i].networkName, accounts);
            newWallet.contacts = contacts;
            newWallet.labels = labels;
            wallets.push(newWallet);
        }

        return wallets;
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

    static recreateLabel(label: Label): Label{
        return new Label(label.name, label.addresses);
    }

    static recreateSimpleAccount(tempAccount: SimpleAccount): SimpleAccount{
        let newAccount = new SimpleAccount(tempAccount.name, tempAccount.publicKey, 
            tempAccount.address, tempAccount.algo, tempAccount.encrypted, tempAccount.iv);

        return newAccount;
    }
}