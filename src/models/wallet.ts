import { WalletAccount } from './walletAccount';
import { AddressBook } from './addressBook';
import { OtherAccount } from './otherAccount';
import { Address } from 'tsjs-xpx-chain-sdk';
import { Helper } from '@/util/typeHelper';
import {Label} from './label'
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

        this.accounts.splice(index, 1);
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

    selectDefaultAccount(): WalletAccount{
        return this.accounts.find((walletAccount)=> walletAccount.default === true);
    }

    setDefaultAccountByAddress(address: string): void{
        let accounts: WalletAccount[] = this.accounts.filter((account)=> account.default === true);

        for(let i = 0; i < accounts.length; ++i){
            accounts[i].default = false;
        }

        let account: WalletAccount = this.accounts.find((account)=> account.address === address);

        account.default = true;
    }

    setDefaultAccountByName(name: string): void{
        let accounts: WalletAccount[] = this.accounts.filter((account)=> account.default === true);

        for(let i = 0; i < accounts.length; ++i){
            accounts[i].default = false;
        }

        let account: WalletAccount = this.accounts.find((account)=> account.name === name);

        account.default = true;
    }

    createEmptifyVersion(){
        let emptifiedAccounts = this.accounts.map(acc =>{

            // acc.assets = [];
            // acc.balance = 0;
            // acc.namespaces = [];
            // acc.multisigInfo = [];
            return acc;
        });

        return new Wallet(this.name, this.networkName, emptifiedAccounts);
    }

    fixNonManagableAccounts(){
        this.accounts = this.accounts.filter(acc => acc.encrypted);
    }
}