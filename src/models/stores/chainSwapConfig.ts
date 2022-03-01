import { StoreProperties } from "./storeProperties";
import {
    ServerConfig
  } from 'nem-library';


interface swapAllowedMosaics{
    namespaceId: string;
    name: string;
    divisibility: number;
}

interface nis1SwapData {
    timeOutTransactionNis1: number;
    url: string;
    urlExplorer: string;
    networkType: number;
    burnAddress:string;
    nodes: ServerConfig[];
    swapAllowedMosaics: Array<swapAllowedMosaics>;
}

// "nis1SwapData": {
    
//   "nis1SwapAllowedMosaics": [
//     { "namespaceId": "xarcade", "name": "xar", "divisibility": 4 },
//     { "namespaceId": "prx", "name": "xpx", "divisibility": 6 }
//   ]

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

    nis1SwapData:nis1SwapData = {
        timeOutTransactionNis1: 0,
        url: '',
        urlExplorer: '',
        networkType: 0,
        burnAddress: '',
        nodes: [{
            protocol: 'https',
            domain: '',
            port: 0
        }],
        swapAllowedMosaics: [{
            namespaceId: '',
            name: '',
            divisibility: 0
        }]
    };


    constructor(storeName: string){
        super(storeName + "_swapConfig");
    }

    updateConfig(config: any): void{
        Object.assign(this, config);
    }
}
