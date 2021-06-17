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

    getCosignaturiesAddress(networkType: number): string[]{

        return this.cosignaturies.map((publicKey)=> Address.createFromPublicKey(publicKey, networkType).pretty());
    }

    getMultisigAccountsAddress(networkType: number): string[]{

        return this.multisigAccounts.map((publicKey)=> Address.createFromPublicKey(publicKey, networkType).pretty());
    }
}