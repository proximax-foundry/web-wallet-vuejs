import { PartialTransaction } from "./partialTransaction";

export class PartialChainTransaction extends PartialTransaction{

  applyHeightDelta: number = null;
  networkConfig: string = null; // not assigning for dashboard
  supportedEntityVersions: string = null; // not assigning for dashboard
  newVersion: string = null;
  upgradePeriod: number = null;

  constructor(txnHash: string){
    super(txnHash);
  }
}