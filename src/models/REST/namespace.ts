import { 
    NamespaceHttp, NetworkHttp, MosaicId,
    Address, QueryParams, NamespaceId, NamespaceName, NamespaceInfo
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
export class NamespaceAPI {

    namespaceHttp: NamespaceHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.namespaceHttp = new NamespaceHttp(endpoint, networkHttp);
    }

    getLinkedAddress(namespaceId: NamespaceId): Promise<Address>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.namespaceHttp.getLinkedAddress(namespaceId, authHeader));
    }

    getLinkedMosaicId(namespaceId: NamespaceId): Promise<MosaicId>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.namespaceHttp.getLinkedMosaicId(namespaceId, authHeader));
    }

    getNamespace(namespaceId: NamespaceId): Promise<NamespaceInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.namespaceHttp.getNamespace(namespaceId, authHeader));
    }

    getNamespacesFromAccount(address: Address, queryParams?: QueryParams): Promise<NamespaceInfo[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.namespaceHttp.getNamespacesFromAccount(address, queryParams, authHeader));
    }

    getNamespacesFromAccounts(addresses: Address[], queryParams?: QueryParams): Promise<NamespaceInfo[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.namespaceHttp.getNamespacesFromAccounts(addresses, queryParams, authHeader));
    }

    getNamespacesName(namespaceIds: NamespaceId[]): Promise<NamespaceName[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.namespaceHttp.getNamespacesName(namespaceIds, authHeader));
    }
}