import { 
    NamespaceHttp, NetworkHttp, MosaicId,
    Address, QueryParams, NamespaceId, NamespaceName, NamespaceInfo
} from "tsjs-xpx-chain-sdk";

export class NamespaceAPI {

    namespaceHttp: NamespaceHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.namespaceHttp = new NamespaceHttp(endpoint, networkHttp);
    }

    getLinkedAddress(namespaceId: NamespaceId): Promise<Address>{
        return this.namespaceHttp.getLinkedAddress(namespaceId).toPromise();
    }

    getLinkedMosaicId(namespaceId: NamespaceId): Promise<MosaicId>{
        return this.namespaceHttp.getLinkedMosaicId(namespaceId).toPromise();
    }

    getNamespace(namespaceId: NamespaceId): Promise<NamespaceInfo>{
        return this.namespaceHttp.getNamespace(namespaceId).toPromise();
    }

    getNamespacesFromAccount(address: Address, queryParams?: QueryParams): Promise<NamespaceInfo[]>{
        return this.namespaceHttp.getNamespacesFromAccount(address, queryParams).toPromise();
    }

    getNamespacesFromAccounts(addresses: Address[], queryParams?: QueryParams): Promise<NamespaceInfo[]>{
        return this.namespaceHttp.getNamespacesFromAccounts(addresses, queryParams).toPromise();
    }

    getNamespacesName(namespaceIds: NamespaceId[]): Promise<NamespaceName[]>{
        return this.namespaceHttp.getNamespacesName(namespaceIds).toPromise();
    }
}