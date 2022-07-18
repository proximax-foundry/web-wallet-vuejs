import { Account } from './account';
import { OtherAcountType } from "./const/otherAccountType"

export class OtherAccount extends Account{

    type: OtherAcountType;

    constructor(name: string, publicKey: string, address: string, type: OtherAcountType){
        super(name, publicKey, address);
        this.type = type;
    }
}