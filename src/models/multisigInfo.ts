import { Address } from 'tsjs-xpx-chain-sdk';
import { Account } from './account';

export class MultisigInfo{ 

    level: number;
    cosignaturies: string[];
    multisigAccounts: string[];
    publicKey: string;
    minApproval: number;
    minRemoval: number;

    constructor(publicKey: string, level: number, cosignaturies: string[], multisigAccounts: string[], minApproval: number, minRemoval: number){
        this.publicKey = publicKey;
        this.level = level;
        this.cosignaturies = cosignaturies;
        this.multisigAccounts = multisigAccounts;
        this.minApproval = minApproval;
        this.minRemoval = minRemoval;
    }

    getCosignaturiesAddress(networkType: number, pretty: boolean = false): string[]{

        if(pretty){
            return this.cosignaturies.map((publicKey)=> Address.createFromPublicKey(publicKey, networkType).pretty());
        }
    
        return this.cosignaturies.map((publicKey)=> Address.createFromPublicKey(publicKey, networkType).plain());
    }

    getMultisigAccountsAddress(networkType: number, pretty: boolean = false): string[]{

        if(pretty){
            return this.multisigAccounts.map((publicKey)=> Address.createFromPublicKey(publicKey, networkType).pretty());
        }

        return this.multisigAccounts.map((publicKey)=> Address.createFromPublicKey(publicKey, networkType).plain());
    }
}