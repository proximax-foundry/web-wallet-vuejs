import { 
    NodeHttp, NodeInfo, NodeTime
} from "tsjs-xpx-chain-sdk";

export class NodeAPI {

    nodeHttp: NodeHttp;

    constructor(endpoint: string){
        this.nodeHttp = new NodeHttp(endpoint);
    }

    getNodeInfo(): Promise<NodeInfo>{
        return this.nodeHttp.getNodeInfo().toPromise();
    }

    getNodeTime(): Promise<NodeTime>{
        return this.nodeHttp.getNodeTime().toPromise();
    }
}

