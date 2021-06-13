import { WalletAccount } from './walletAccount';
import { AddressBook } from './addressBook';
import { OtherAccount } from './otherAccount';

export class Wallet{

    name: string;
    networkName: string;
    accounts: WalletAccount[];
    others: OtherAccount[] = [];
    contacts: AddressBook[] = [];

    constructor(name: string, networkName: string, accounts: WalletAccount[]){
        this.name = name;
        this.networkName = networkName;
        this.accounts = accounts;
    }

    updateAccount(index: number, WalletAccount: WalletAccount){
        this.accounts[index] = WalletAccount;
    }

    removeAccount(accountName: string){
        const index = this.accounts.findIndex((account)=> account.name == accountName);

        this.accounts.splice(index, 1);
    }

    convertAddressToName(address: string){
        let aliasName :string = "";

        const addressBook = this.contacts.find((addressBook)=> addressBook.address === address);

        if(addressBook){
            aliasName = addressBook.name;
        }else{
            const walletAccount = this.accounts.find((walletAccount)=> walletAccount.address === address);

            if(walletAccount){
                aliasName = walletAccount.name;
            }
        }

        return aliasName ? aliasName : address;
    }

    addAddressBook(addressBook: AddressBook){
        this.contacts.push(addressBook);
    }

    removeAddressBook(index: number){
        this.contacts.splice(index, 1);
    }

    updateAddressBook(index: number, addressBook: AddressBook){
        this.contacts[index] = addressBook;
    }

    selectDefaultAccount(){
        return this.accounts.find((walletAccount)=> walletAccount.default === true);
    }
}