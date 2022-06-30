export class AssetInfo{

    idHex: string;
    supply: number = 0; // smallest denomination
    divisibility: number | null = null;
    duration: number | null = null;
    supplyMutable: boolean | null = null;
    transferable: boolean | null = null;
    creator: string | null; 
    namespaceNames: string[] = []; 
    height: number = 0;

    constructor(idHex: string, divisibility: number, supplyMutable: boolean, transferable: boolean, creator: string){
        this.idHex = idHex;
        this.divisibility = divisibility;
        this.creator = creator;
        this.supplyMutable = supplyMutable;
        this.transferable = transferable;
    }
}