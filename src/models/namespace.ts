import { AliasType } from "tsjs-xpx-chain-sdk";

export class Namespace{

    idHex: string;
    name: string = ""; // store full name
    linkType: AliasType = AliasType.None;
    linkedId: string = "";
    parentId: string = "";
    startHeight: number | null = null; 
    endHeight: number | string | null = null;
    active: boolean = true;
    owner: string = "";

    constructor(idHex: string, name?: string){
        
        this.idHex = idHex;
        this.name = name ? name : "";
    }
}