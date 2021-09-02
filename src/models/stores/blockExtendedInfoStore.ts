import { BlockExtendedInfo, Resolution } from "../blockExtendedInfo";
import { StoreProperties } from "./storeProperties";

export class BlockExtendedInfoStore extends StoreProperties{

    blockData: BlockExtendedInfo[] = [];
    isReady: boolean = false;

    constructor(storeName: string){
        super(storeName + "_blockExtendedInfo");
        this.fetchFromLocalStorage();
    }

    fetchFromLocalStorage(): void{
        this.isReady = false;
        const tempBlockData = localStorage.getItem(this.storeName);

        try {
            if(tempBlockData){
                this.blockData = Reconstruct.reconstruct(JSON.parse(tempBlockData));
            }
            else{
                this.blockData = [];
            }
        } catch (error) {
            this.blockData = [];
        }
        this.isReady = true;
    }
}

class Reconstruct{

    static reconstruct(JSON_blockData: BlockExtendedInfo[]): BlockExtendedInfo[]{

        let blocksExtendedInfo: BlockExtendedInfo[] = [];

        for(let i =0; i < JSON_blockData.length; ++i){

            let tempBlockExtendedInfo = new BlockExtendedInfo(JSON_blockData[i].block);
            tempBlockExtendedInfo.feeMultiplier = JSON_blockData[i].feeMultiplier;

            if(JSON_blockData[i].receipts){
                tempBlockExtendedInfo.receipts = JSON_blockData[i].receipts;
            }

            let addressResolution: Resolution[] = [];

            for(let k =0; k < JSON_blockData[i].addressResolutions.length; ++k){
                
                let tempAddressResolution = new Resolution(JSON_blockData[i].addressResolutions[k].unresolved, JSON_blockData[i].addressResolutions[k].resolved);

                addressResolution.push(tempAddressResolution);
            }

            let assetResolution: Resolution[] = [];

            for(let k =0; k < JSON_blockData[i].assetResolutions.length; ++k){
                
                let tempAssetResolution = new Resolution(JSON_blockData[i].assetResolutions[k].unresolved, JSON_blockData[i].assetResolutions[k].resolved);

                assetResolution.push(tempAssetResolution);
            }

            tempBlockExtendedInfo.addressResolutions = addressResolution;
            tempBlockExtendedInfo.assetResolutions = assetResolution;

            blocksExtendedInfo.push(tempBlockExtendedInfo);
        }

        return blocksExtendedInfo;
    }
}