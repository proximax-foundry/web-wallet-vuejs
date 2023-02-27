import { StoreProperties } from "./storeProperties";
import { FeeCalculationStrategy } from "tsjs-xpx-chain-sdk";

export class ChainProfilePreferences extends StoreProperties {
  apiNode: string = "";
  feeStrategy: FeeCalculationStrategy =
    FeeCalculationStrategy.MiddleFeeCalculationStrategy;

  constructor(storeName: string) {
    super(storeName + "_preferences");
  }
}
