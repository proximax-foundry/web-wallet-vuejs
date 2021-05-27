import { StoreProperties } from "./storeProperties";

export class ChainProfilePreferences extends StoreProperties {

    apiNode: string = "";

    constructor(storeName: string){
        super(storeName + "_preferences");
    }
}