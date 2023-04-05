import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedChainTransaction extends ConfirmedTransaction {
  applyHeightDelta: number | null = null;
  networkConfig: string | null = null; // not assigning for dashboard
  supportedEntityVersions: string | null = null; // not assigning for dashboard
  newVersion: string | null = null;
  upgradePeriod: number | null = null;

  constructor(txnHash: string) {
    super(txnHash);
  }
}
