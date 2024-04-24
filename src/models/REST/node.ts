import { 
    NodeHttp, NodeInfo, NodeTime, 
    // NodePeers, NodeUnlockedAccount
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
export class NodeAPI {

    nodeHttp: NodeHttp;

    constructor(endpoint: string){
        this.nodeHttp = new NodeHttp(endpoint);
    }

    getNodeInfo(): Promise<NodeInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.nodeHttp.getNodeInfo(authHeader));
    }

    getNodeTime(): Promise<NodeTime>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.nodeHttp.getNodeTime(authHeader));
    }

    getNodePeers(){
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.nodeHttp.getNodePeers(authHeader));
    }

    getNodeUnlockedAccounts(){
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.nodeHttp.getNodeUnlockedAccounts(authHeader));
    }
}

