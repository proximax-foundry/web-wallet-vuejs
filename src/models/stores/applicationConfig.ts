import { StoreProperties } from "./storeProperties";

export class ApplicationConfig extends StoreProperties{

  constructor(storeName: string){
    super(storeName);
  }

  updateConfig(config: any): void{
    Object.assign(this, config);
  }
}