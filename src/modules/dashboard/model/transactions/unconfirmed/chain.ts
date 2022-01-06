import { UnconfirmedTransaction } from "./unconfirmedTransaction";

export class UnconfirmedChainTransaction extends UnconfirmedTransaction{

  applyHeightDelta: number = null;
  networkConfig: string = null; // not assigning for dashboard
  supportedEntityVersions: string = null; // not assigning for dashboard
  newVersion: string = null;
  upgradePeriod: number = null;

  constructor(txnHash: string){
    super(txnHash);
  }
}