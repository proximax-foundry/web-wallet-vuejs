import { NetworkType, PublicAccount } from 'tsjs-xpx-chain-sdk';

export class SimpleAccount{
    name: string;
    publicKey: string;
    address: string;
    algo: string;
    encrypted: string;
    iv: string;
    version: number;

    constructor(name: string, 
        publicKey: string, address: string, 
        algo: string, encrypted: string, iv: string, 
        version: number = 0
    ){
        this.name = name;
        this.publicKey = publicKey;
        this.address = address;
        this.algo = algo;
        this.encrypted = encrypted;
        this.iv = iv;
        this.version = version;
    }

    fixAddress(networkType: NetworkType): void{
        this.address = PublicAccount.createFromPublicKey(this.publicKey, networkType).address.plain();
    }
}