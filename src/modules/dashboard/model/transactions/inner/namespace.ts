import { InnerTransaction } from "./innerTxn";

export class InnerNamespaceTransaction extends InnerTransaction{

    namespaceId: string = "";
    namespaceName: string = "";
    registerType: number = 0;
    registerTypeName: string = "";
    isExtend: boolean = false;
    duration?: number = 0;
    parentId?: string = "";
    parentName?: string = ""; 

    constructor(){
      super();
    }
}