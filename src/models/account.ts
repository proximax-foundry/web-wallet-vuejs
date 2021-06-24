import { NetworkType, PublicAccount } from 'tsjs-xpx-chain-sdk';

export class Account{
    name: string;
    balance: number = 0;
    publicKey: string;
    address: string;

    constructor(name: string, publicKey: string, address: string){
        this.name = name;
        this.publicKey = publicKey;
        this.address = address;
    }

    fixAddress(networkType: NetworkType): void{
        this.address = PublicAccount.createFromPublicKey(this.publicKey, networkType).address.plain();
    }
}