import { Mosaic, MosaicId } from "tsjs-xpx-chain-sdk";

export class DashboardTip{
    
  tipType: string = "";
  displayValue: string = "";
  value: string = "";
  valueType: string = "";
  displayValue2: string = "";
  value2: string = "";
  valueType2: string = "";
  displayValue3: string = "";
  value3: string = "";
  valueType3: string = "";

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
  PUBLIC_KEY_STRING = "publicKeyString",
  TO_RIGHT_ARROW = "toRightArrow",
  MESSAGE = "message",
  TX_HASH = "txHash",
  ABSOLUTE_AMOUNT = "absoluteAmount",
  EXACT_AMOUNT = "exactAmount",
  TEMPLATE = "template",
  STRING = "string",
  DURATION = "duration",
  HASH = "hash",
  ASSET_AMOUNT = "assetAmount",
  NAMESPACE_AMOUNT = "namespaceAmount",
  ADDRESS_RESTRICTION_MODIFICATION = "addressRestrictMod",
  TRANSFER = "transfer",
  TRANSFER_UNRESOLVED = "transferUnresolved",
  ASSET_ALIAS = "assetAlias",
  REMOVE_ASSET_ALIAS = "removeAssetAlias",
  ADDRESS_ALIAS = "addressAlias",
  REMOVE_ADDRESS_ALIAS = "removeAddressAlias",
  SUPPLY_AMOUNT = "supplyAmount",
  SUPPLY_ASSET_AMOUNT = "supplyAssetAmount",
  MSG_NAMESPACE = "msgNamespace",
  LINK_PUBLICKEY = "linkPublicKey",
  UNLINK_PUBLICKEY = "unlinkPublicKey",
  AMOUNT_ASSET_VIA_NAMESPACE = "amountAssetViaNamespace"
}

export enum AmountType{
  RAW = "raw",
  EXACT = "exact"
}

export class OtherAsset{
  asset: string = '';
  amount: number = 0;
  assetid: MosaicId;
  isLinked: boolean = false;
}