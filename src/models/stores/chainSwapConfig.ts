import { StoreProperties } from "./storeProperties";

export class ChainSwapConfig extends StoreProperties{

    swap_XPX_ETH_URL: string = "";
    swap_XPX_BSC_URL: string = "";
    swap_IN_SERVICE_URL: string = "";
    BSCScanUrl: string = '';
    ETHScanUrl: string = '';

    BSCChainId: number = 0; //97, 5
    ETHChainId: number = 0; //5, 1, 3, 4, 42
    
    ETHNetworkName: string = '';
    BSCNetworkName: string = '';

    gasPriceConsultURL: string = "";
    priceConsultURL: string = "";

    constructor(storeName: string){
        super(storeName + "_swapConfig");
    }

    updateConfig(config: any): void{
        Object.assign(this, config);
    }
}
