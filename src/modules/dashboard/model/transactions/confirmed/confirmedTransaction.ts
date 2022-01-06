import { CommonTransaction } from "../commonTransaction"

export class ConfirmedTransaction extends CommonTransaction{

    timestamp: string = "";
    block: number = 0;
    fee: number | null = 0;
    groupType: string = "confirmed";

    constructor(txnHash: string){
        super(txnHash);
    }

    static convertToSubClass(subclass: typeof ConfirmedTransaction, instance: ConfirmedTransaction){
        let newTxn = new subclass(instance.hash);

        Object.assign(newTxn, instance);
        return newTxn;
    }
}