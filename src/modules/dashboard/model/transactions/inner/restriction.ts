import { InnerTransaction } from "./innerTxn";
import type { RestrictionModification } from "../restrictionModification";

export class InnerRestrictionTransaction extends InnerTransaction {
  restrictionTypeOutput: string = ""; // Allow / Block
  restrictionType: number = 0;
  modification: RestrictionModification[] = [];

  constructor() {
    super();
  }
}
