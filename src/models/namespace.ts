import { AliasType } from "tsjs-xpx-chain-sdk";

export class Namespace{

    idHex: string;
    name: string = "";
    linkType: AliasType = AliasType.None;
    linkedId: string = "";

    constructor(idHex: string, name: string){
        
        this.idHex = idHex;
        this.name = name;
    }
}