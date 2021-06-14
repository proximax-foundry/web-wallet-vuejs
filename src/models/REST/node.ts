import { 
    NodeHttp
} from "tsjs-xpx-chain-sdk";

export class NodeAPI {

    nodeHttp: NodeHttp;

    constructor(endpoint: string){
        this.nodeHttp = new NodeHttp(endpoint);
    }

    getNodeInfo(){
        return this.nodeHttp.getNodeInfo().toPromise();
    }

    getNodeTime(){
        return this.nodeHttp.getNodeTime().toPromise();
    }
}

