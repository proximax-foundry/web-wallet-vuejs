import { 
    NodeHttp, NodeInfo, NodeTime
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
}

