export class ResolvedNamespace{
    
    namespaces: NamespaceCommon[] = [];
  
}

export class NamespaceCommon{
    
    namespaceIdHex: string;
    fullName: string = "";
    address: string = "";
    assetIdHex: string = "";
    endBlock?: number;

    constructor(namespaceIdHex){
        this.namespaceIdHex = namespaceIdHex;
    }
}