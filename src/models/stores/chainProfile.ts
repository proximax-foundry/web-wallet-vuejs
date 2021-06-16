import { StoreProperties } from "./storeProperties";
import { Network } from "../network";
import { ChainExplorer } from "../chainExplorer";

export class ChainProfile extends StoreProperties{

    version: string = '0.0.0';
    apiNodes: string[] = [];
    httpPort: number = 3000;
    generationHash: string = "";
    network: Network = Network.createDefault();
    chainExplorer: ChainExplorer = ChainExplorer.createDefault();

    constructor(storeName: string){
        super(storeName);
    }

    getVersion(): string{
        return this.version;
    }

    serialize(){
        return {
            version: this.version,
            apiNodes: this.apiNodes,
            httpPort: this.httpPort,
            generationHash: this.generationHash,
            network: this.network.serialize(),
            chainExplorer: this.chainExplorer.serialize()
        };
    }
}