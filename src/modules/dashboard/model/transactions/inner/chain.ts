import { InnerTransaction } from "./innerTxn";

export class InnerChainTransaction extends InnerTransaction {
  applyHeightDelta: number | null = null;
  networkConfig: string | null = null; // not assigning for dashboard
  supportedEntityVersions: string | null = null; // not assigning for dashboard
  newVersion: string | null = null;
  upgradePeriod: number | null = null;

  constructor() {
    super();
  }
}
