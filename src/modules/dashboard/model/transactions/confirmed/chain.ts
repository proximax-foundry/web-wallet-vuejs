import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedChainTransaction extends ConfirmedTransaction{

  applyHeightDelta: number = null;
  networkConfig: string = null; // not assigning for dashboard
  supportedEntityVersions: string = null; // not assigning for dashboard
  newVersion: string = null;
  upgradePeriod: number = null;

  constructor(txnHash: string){
    super(txnHash);
  }
}