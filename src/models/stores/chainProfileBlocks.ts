import { StoreProperties } from "./storeProperties";
import { BlockAggregatedInfo } from "../blockAggregatedInfo";

export class ChainProfileBlocks extends StoreProperties{

    blocks: BlockAggregatedInfo[];

    constructor(storeName: string){
        super(storeName + "_blockInfo");
    }

    serialize(){
        return {
            
        };
    }
}