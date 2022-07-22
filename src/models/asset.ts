export class Asset{

    idHex: string;
    amount: number = 0; // store exact amount
    rawAmount: number = 0; // smallest denomination
    supply: number = 0; // smallest denomination
    divisibility: number | null = null;
    duration: number | null = null;
    expirationBlock: number | null = null;
    supplyMutable: boolean | null = null;
    transferable: boolean | null = null;
    creator: string | null; 
    namespaceNames: string[] = []; 
    height: number = 0;

    constructor(idHex: string){
        this.idHex = idHex;
    }

    duplicateNewInstance(): Asset{
        let newAsset = new Asset(this.idHex);

        newAsset.divisibility = this.divisibility;
        newAsset.supplyMutable = this.supplyMutable;
        newAsset.transferable = this.transferable;
        newAsset.creator = this.creator;
        newAsset.duration = this.duration;
        newAsset.expirationBlock = this.expirationBlock;
        newAsset.namespaceNames = this.namespaceNames;
        newAsset.supply = this.supply;
        newAsset.amount = this.amount;
        newAsset.height = this.height;
        return newAsset;
    }

    updateExactAmount(): void{
        if(this.divisibility === 0){
            this.amount = this.rawAmount;
        }else if(this.divisibility !== null){
            this.amount = this.rawAmount / Math.pow(10, this.divisibility);
        }
    }

    updateExpirationBlock(): void{
        if(this.duration){
            this.expirationBlock = this.height + this.duration;
        }
    }

    /*
    getExactAmount(): number{
        return this.rawAmount / Math.pow(10, this.divisibility);
    }
    */

    getExactSupply(): number{
        if(this.divisibility === 0){
            return this.supply
        }else if(this.divisibility !== null){
            return this.supply / Math.pow(10, this.divisibility);
        }
        else{
            return this.supply;
        }
    }
}