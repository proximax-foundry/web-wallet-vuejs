import { StoreProperties } from "./storeProperties";

export class ChainSwapConfig extends StoreProperties{

    sinkFeeAddress: string = "";
    sinkFundAddress: string = "";
    swap_XPX_ETH_URL: string = "";
    swap_XPX_BSC_URL: string = "";
    BSCScanUrl: string = '';
    ETHScanUrl: string = '';
    BSCChainId: number = 0; //97, 5
    ETHChainId: number = 0; //5, 1, 3, 4, 42
    ETHNetworkName: string = '';
    BSCNetworkName: string = '';
    BXPXContractAddress: string = '';
    EXPXContractAddress: string = '';
    sinkFundExpxSwap: string = '';
    sinkFundBxpxSwap: string = '';

    gasPriceConsultURL: string = "";
    priceConsultURL: string = "";

    constructor(storeName: string){
        super(storeName + "_swapConfig");
    }

    updateConfig(config: any): void{
        Object.assign(this, config);
    }
}
