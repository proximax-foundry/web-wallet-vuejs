import { PartialTransaction } from "./partialTransaction";
import type { RestrictionModification } from "../restrictionModification";

export class PartialRestrictionTransaction extends PartialTransaction {
  restrictionTypeOutput: string = ""; // Allow / Block
  restrictionType: number = 0;
  modification: RestrictionModification[] = [];

  constructor(txnHash: string) {
    super(txnHash);
  }
}
