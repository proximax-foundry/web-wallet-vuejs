import { ConfirmedTransaction } from "./confirmedTransaction";
import type { RestrictionModification } from "../restrictionModification";

export class ConfirmedRestrictionTransaction extends ConfirmedTransaction {
  restrictionTypeOutput: string = ""; // Allow / Block
  restrictionType: number = 0;
  modification: RestrictionModification[] = [];

  constructor(txnHash: string) {
    super(txnHash);
  }
}
