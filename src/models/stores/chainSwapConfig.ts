import { StoreProperties } from "./storeProperties";

export class ChainSwapConfig extends StoreProperties{

    sinkFeeAddress: string = "";
    sinkFundAddress: string = "";
    swap_XPX_ETH_URL: string = "";
    swap_XPX_BSC_URL: string = "";
    swap_ETH_XPX_URL: string = "";
    swap_BSC_XPX_URL: string = "";
    BSCScanUrl: string = '';
    ETHScanUrl: string = '';
    BSCChainId: Array<number> = []; //97, 5
    ETHChainId: Array<number> = []; //5, 1, 3, 4, 42
    BXPXContractAddress: string = '';
    EXPXContractAddress: string = '';
    sinkFundExpxSwap: string = '';
    sinkFundBxpxSwap: string = '';

    gasPriceConsultURL:string = "";

    constructor(storeName: string){
        super(storeName + "_swapConfig");
    }

    updateConfig(config: any): void{
        Object.assign(this, config);
    }
}
