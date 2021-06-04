import { 
    NamespaceHttp, NetworkHttp,
    Address, QueryParams, NamespaceId
} from "tsjs-xpx-chain-sdk";

export class NamespaceAPI {

    namespaceHttp: NamespaceHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.namespaceHttp = new NamespaceHttp(endpoint, networkHttp);
    }

    getLinkedAddress(namespaceId: NamespaceId){
        return this.namespaceHttp.getLinkedAddress(namespaceId).toPromise();
    }

    getLinkedMosaicId(namespaceId: NamespaceId){
        return this.namespaceHttp.getLinkedMosaicId(namespaceId).toPromise();
    }

    getNamespace(namespaceId: NamespaceId){
        return this.namespaceHttp.getNamespace(namespaceId).toPromise();
    }

    getNamespacesFromAccount(address: Address, queryParams: QueryParams){
        return this.namespaceHttp.getNamespacesFromAccount(address, queryParams).toPromise();
    }

    getNamespacesFromAccounts(addresses: Address[], queryParams: QueryParams){
        return this.namespaceHttp.getNamespacesFromAccounts(addresses, queryParams).toPromise();
    }

    getNamespacesName(namespaceIds: NamespaceId[]){
        return this.namespaceHttp.getNamespacesName(namespaceIds).toPromise();
    }
}