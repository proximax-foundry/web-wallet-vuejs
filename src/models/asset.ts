export class Asset{

    idHex: string;
    amount: number = 0; // store absolute amount
    supply: number = 0;
    divisibility: number;
    duration: number | null = null;
    expirationBlock: number | null = null;
    supplyMutable: boolean;
    transferable: boolean;
    owner: string | null;
    namespaceId: string[] = []; 

    constructor(idHex: string, divisibility: number, supplyMutable: boolean, transferable: boolean, owner?: string){
        
        this.idHex = idHex;
        this.divisibility = divisibility;
        this.owner = owner ? owner: null;
        this.supplyMutable = supplyMutable;
        this.transferable = transferable;
    }

    duplicateNewInstance(): Asset{
        let newAsset = new Asset(this.idHex, this.divisibility, this.supplyMutable, this.transferable, this.owner);

        newAsset.duration = this.duration;
        newAsset.expirationBlock = this.expirationBlock;
        newAsset.namespaceId = this.namespaceId;
        newAsset.supply = this.supply;
        newAsset.amount = this.amount;
        return newAsset;
    }

    getExactAmount(): number{
        return this.amount / Math.pow(10, this.divisibility);
    }
}