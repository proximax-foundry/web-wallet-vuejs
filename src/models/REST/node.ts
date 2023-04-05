import { NodeHttp, NodeInfo, NodeTime } from "tsjs-xpx-chain-sdk";
import { RequestAuth } from "./auth";

export class NodeAPI {
  nodeHttp: NodeHttp;

  constructor(endpoint: string) {
    this.nodeHttp = new NodeHttp(endpoint);
  }

  getNodeInfo(): Promise<NodeInfo> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.nodeHttp.getNodeInfo(authHeader).toPromise();
  }

  getNodeTime(): Promise<NodeTime> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.nodeHttp.getNodeTime(authHeader).toPromise();
  }
}
