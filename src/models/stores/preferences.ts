import { StoreProperties } from "./storeProperties";

const key = "preferences";

export class Preferences extends StoreProperties {
  darkTheme: boolean = false;

  constructor() {
    super(key);
  }
}
