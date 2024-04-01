export class AssetInfo{

    idHex: string;
    supply: number = 0; // smallest denomination
    divisibility: number | null = null;
    duration: number | null = null;
    supplyMutable: boolean | null = null;
    transferable: boolean | null = null;
    supplyForceImmutable: boolean | null = null;
    restrictable: boolean | null = null;
    disableLocking: boolean | null = null;
    creator: string | null; 
    namespaceNames: string[] = [];
    doneChecking: boolean = false; 
    height: number = 0;
    nonce: number | null = null;

    constructor(idHex: string, divisibility: number, 
        supplyMutable: boolean, transferable: boolean, 
        restrictable: boolean, supplyForceImmutable: boolean, disableLocking: boolean,
        creator: string){
        this.idHex = idHex;
        this.divisibility = divisibility;
        this.creator = creator;
        this.supplyMutable = supplyMutable;
        this.transferable = transferable;
        this.restrictable = restrictable;
        this.supplyForceImmutable = supplyForceImmutable;
        this.disableLocking = disableLocking;
    }
}