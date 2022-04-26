import { 
    NamespaceHttp, NetworkHttp, MosaicId,
    Address, QueryParams, NamespaceId, NamespaceName, NamespaceInfo
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';

export class NamespaceAPI {

    namespaceHttp: NamespaceHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.namespaceHttp = new NamespaceHttp(endpoint, networkHttp);
    }

    getLinkedAddress(namespaceId: NamespaceId): Promise<Address>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.namespaceHttp.getLinkedAddress(namespaceId, authHeader).toPromise();
    }

    getLinkedMosaicId(namespaceId: NamespaceId): Promise<MosaicId>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.namespaceHttp.getLinkedMosaicId(namespaceId, authHeader).toPromise();
    }

    getNamespace(namespaceId: NamespaceId): Promise<NamespaceInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.namespaceHttp.getNamespace(namespaceId, authHeader).toPromise();
    }

    getNamespacesFromAccount(address: Address, queryParams?: QueryParams): Promise<NamespaceInfo[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.namespaceHttp.getNamespacesFromAccount(address, queryParams, authHeader).toPromise();
    }

    getNamespacesFromAccounts(addresses: Address[], queryParams?: QueryParams): Promise<NamespaceInfo[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.namespaceHttp.getNamespacesFromAccounts(addresses, queryParams, authHeader).toPromise();
    }

    getNamespacesName(namespaceIds: NamespaceId[]): Promise<NamespaceName[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.namespaceHttp.getNamespacesName(namespaceIds, authHeader).toPromise();
    }
}