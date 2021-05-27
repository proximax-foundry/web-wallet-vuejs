export class Asset{

    idHex: string;
    amount: number = 0;
    supply: number = 0;
    divisibility: number;
    duration: number | null = null;
    expirationBlock: number | null = null;
    supplyMutable: boolean;
    transferable: boolean;
    owner: string;
    namespaceId: string[] = []; 

    constructor(idHex: string, owner: string, divisibility: number, supplyMutable: boolean, transferable: boolean){
        
        this.idHex = idHex;
        this.divisibility = divisibility;
        this.owner = owner;
        this.supplyMutable = supplyMutable;
        this.transferable = transferable;
    }
}