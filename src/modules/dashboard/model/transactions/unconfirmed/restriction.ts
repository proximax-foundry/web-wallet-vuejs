import { UnconfirmedTransaction } from "./unconfirmedTransaction";
import { RestrictionModification } from "../restrictionModification";

export class UnconfirmedRestrictionTransaction extends UnconfirmedTransaction{

    restrictionTypeOutput: string = ""; // Allow / Block
    restrictionType: number = 0;
    modification: RestrictionModification[] = [];
  
    constructor(txnHash: string){
      super(txnHash);
    }
}
