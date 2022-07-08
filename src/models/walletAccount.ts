import { Account } from './account';
import { nis1Account } from './nis1Account';
import { SimpleAccount } from './simpleAccount';

export class WalletAccount extends Account{

    default: boolean = false;
    isBrain: boolean = false;
    algo: string;
    encrypted: string;
    iv: string;
    nis1Account: nis1Account | null = null;

    constructor(name: string, publicKey: string, address: string, algo: string, encrypted: string, iv: string){
        super(name, publicKey, address);
        
        this.algo = algo;
        this.encrypted = encrypted;
        this.iv = iv;
    }

    convertToSimpleAccount(): SimpleAccount{
        return new SimpleAccount(this.name, this.publicKey, this.address, this.algo, this.encrypted, this.iv);
    }
}