import { Account } from './account';
import { OtherAcountType } from "./const/otherAccountType"

export class OtherAccount extends Account{

    type: OtherAcountType;

    constructor(name: string, 
        publicKey: string, address: string, 
        type: OtherAcountType, version: number){
            
        super(name, publicKey, address, version);
        this.type = type;
    }
}