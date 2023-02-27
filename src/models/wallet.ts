import type { WalletAccount } from './walletAccount';
import type { AddressBook } from './addressBook';
import type { OtherAccount } from './otherAccount';
import { Address } from 'tsjs-xpx-chain-sdk';
import type {Label} from './label'
import { SimpleWallet } from './simpleWallet';
import type { SimpleAccount } from './simpleAccount';

export class Wallet{

    name: string;
    networkName: string;
    accounts: WalletAccount[];
    others: OtherAccount[] = [];
    contacts: AddressBook[] = [];
    isReady: boolean = false;
    labels: Label[] = [];

    constructor(name: string, networkName: string, accounts: WalletAccount[]){
        this.name = name;
        this.networkName = networkName;
        this.accounts = accounts;
    }

    updateAccount(index: number, WalletAccount: WalletAccount): void{
        this.accounts[index] = WalletAccount;
    }

    removeAccount(accountName: string): void{
        const index = this.accounts.findIndex((account)=> account.name == accountName);

        if(index > -1){
            this.accounts.splice(index, 1);
        }
    }

    removeOtherAccount(pubKey: string): void{
        const index = this.others.findIndex((account)=> account.publicKey == pubKey);

        if(index > -1){
            this.others.splice(index, 1);
        }
    }

    convertAddressToName(address: string, includeOthers: boolean = false): string{

        let aliasName :string = "";

        const addressBook = this.contacts.find((addressBook)=> addressBook.address === address);

        if(addressBook){
            aliasName = addressBook.name;
        }else{
            const walletAccount = this.accounts.find((walletAccount)=> walletAccount.address === address);

            if(walletAccount){
                aliasName = walletAccount.name;
            }

            if(includeOthers){
                const othersAccount = this.others.find((otherAccount)=> otherAccount.address === address);

                if(othersAccount){
                    aliasName = othersAccount.name;
                }
            }
        }

        return aliasName ? aliasName : address;
    }

    convertAddressToNamePretty(address: string, includeOthers: boolean = false): string{
        let aliasName :string = "";

        const addressBook = this.contacts.find((addressBook)=> addressBook.address === address);

        if(addressBook){
            aliasName = addressBook.name;
        }else{
            const walletAccount = this.accounts.find((walletAccount)=> walletAccount.address === address);

            if(walletAccount){
                aliasName = walletAccount.name;
            }

            if(includeOthers){
                const othersAccount = this.others.find((otherAccount)=> otherAccount.address === address);

                if(othersAccount){
                    aliasName = othersAccount.name;
                }
            }
        }

        return aliasName ? aliasName : Address.createFromRawAddress(address).pretty();
    }

    addAddressBook(addressBook: AddressBook): void{
        this.contacts.push(addressBook);
    }

    removeAddressBook(index: number): void{
        this.contacts.splice(index, 1);
    }

    addLabel(label: Label): void{
        this.labels.push(label);
    }

    removeLabel(index: number): void{
        this.labels.splice(index, 1);
    }

    updateAddressBook(index: number, addressBook: AddressBook): void{
        this.contacts[index] = addressBook;
    }

    selectDefaultAccount(): WalletAccount | null{
        const defaultAcc = this.accounts.find((walletAccount)=> walletAccount.default === true)
        if(!defaultAcc){
            return null
        }
        return defaultAcc
    }

    setDefaultAccountByAddress(address: string): void{
        let accounts: WalletAccount[] = this.accounts.filter((account)=> account.default === true);

        for(let i = 0; i < accounts.length; ++i){
            accounts[i].default = false;
        }

        let account= this.accounts.find((account)=> account.address === address);
        if(account){
            account.default = true;
        }

    }

    setDefaultAccountByName(name: string): void{
        let accounts: WalletAccount[] = this.accounts.filter((account)=> account.default === true);

        for(let i = 0; i < accounts.length; ++i){
            accounts[i].default = false;
        }

        let account = this.accounts.find((account)=> account.name === name);

        if(account){
            account.default = true;
        }
    }

    fixNonManagableAccounts(){
        this.accounts = this.accounts.filter(acc => acc.encrypted);
    }

    convertToSimpleWallet(): SimpleWallet{
        let simpleAccounts: SimpleAccount[] = this.accounts.map(x =>{
            return x.convertToSimpleAccount();
        });

        let newSimpleWallet = new SimpleWallet(this.name, this.networkName, simpleAccounts);
        newSimpleWallet.contacts = this.contacts;
        newSimpleWallet.labels = this.labels;

        return newSimpleWallet;
    }
}