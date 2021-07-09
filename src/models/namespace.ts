import { AliasType } from "tsjs-xpx-chain-sdk";

export class Namespace{

    idHex: string;
    name: string = ""; // store full name
    linkType: AliasType = AliasType.None;
    linkedId: string = "";
    parentId: string = "";
    startHeight: number | null; 
    endHeight: number | null;
    active: boolean = true;

    constructor(idHex: string, name?: string){
        
        this.idHex = idHex;
        this.name = name ? name : "";
    }
}