import { 
    ChainConfigHttp
} from "tsjs-xpx-chain-sdk";

export class ChainConfigAPI {

    chainConfigHttp: ChainConfigHttp;

    constructor(endpoint: string){
        this.chainConfigHttp = new ChainConfigHttp(endpoint);
    }

    getChainConfig(height: number){
        return this.chainConfigHttp.getChainConfig(height).toPromise();
    }

}