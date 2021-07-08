export class DashboardTip{
    
  displayValue: string = "";
  tipType: string = "";
  event: string = "";
  value: string = "";
  valueType: string = "";

  constructor(tipType: string){
    this.tipType = tipType;
  }
}

export class RowDashboardTip{
    
  rowTips: DashboardTip[] = [];

}

export class DashboardTipList{
    
  list: RowDashboardTip[] = [];
  
}

export enum TipType{
  ADDRESS = "address",
  ASSET = "asset",
  NAMESPACE_STR = "namespace",
  NAMESPACE_ID = "namespaceId",
  PUBLIC_KEY = "publicKey",
  TO_RIGHT_ARROW = "toRightArrow",
  MESSAGE = "message",
  TX_HASH = "txHash",
  ABSOLUTE_AMOUNT = "absoluteAmount",
  EXACT_AMOUNT = "exactAmount",
}