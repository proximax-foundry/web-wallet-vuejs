import { MultisigAccountInfo } from "tsjs-xpx-chain-sdk";

export class CosignUtils{

    static findCosigner(multisigAccountsInfo: MultisigAccountInfo[]): string[]{

        let cosigners: string[] = [];

        for(let i =0; i < MultisigAccountInfo.length; ++i){
            if(!multisigAccountsInfo[i].isMultisig()){
                cosigners.push(multisigAccountsInfo[i].account.publicKey);
            }
        }

        return cosigners;
    }
}