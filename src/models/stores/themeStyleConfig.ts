import { StoreProperties } from "./storeProperties";
import type { JdenticonConfig } from "jdenticon";
export class ThemeStyleConfig extends StoreProperties {
  jdenticonConfig: JdenticonConfig = {};
  constructor(storeName: string) {
    super(storeName);
  }

  updateConfig(config: any): void {
    Object.assign(this, config);
  }
}
