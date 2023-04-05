import { AccountAPI } from "./account";
import { AssetAPI } from "./asset";
import { BlockAPI } from "./block";
import { ChainAPI } from "./chain";
import { ChainConfigAPI } from "./chainConfig";
import { DiagnosticAPI } from "./diagnostic";
import { ExchangeAPI } from "./exchange";
import { MetadataAPI } from "./metadata";
import { NamespaceAPI } from "./namespace";
import { NetworkAPI } from "./network";
import { NodeAPI } from "./node";
import { TransactionAPI } from "./transaction";

export class ChainAPICall {
  endpoint: string;
  accountAPI: AccountAPI;
  assetAPI: AssetAPI;
  blockAPI: BlockAPI;
  chainAPI: ChainAPI;
  chainConfigAPI: ChainConfigAPI;
  diagnosticAPI: DiagnosticAPI;
  exchangeAPI: ExchangeAPI;
  metadataAPI: MetadataAPI;
  namespaceAPI: NamespaceAPI;
  networkAPI: NetworkAPI;
  nodeAPI: NodeAPI;
  transactionAPI: TransactionAPI;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.accountAPI = new AccountAPI(endpoint);

    this.networkAPI = new NetworkAPI(endpoint);
    this.assetAPI = new AssetAPI(endpoint, this.networkAPI.networkHttp);
    this.accountAPI = new AccountAPI(endpoint, this.networkAPI.networkHttp);
    this.blockAPI = new BlockAPI(endpoint, this.networkAPI.networkHttp);
    this.exchangeAPI = new ExchangeAPI(endpoint, this.networkAPI.networkHttp);
    this.metadataAPI = new MetadataAPI(endpoint, this.networkAPI.networkHttp);
    this.namespaceAPI = new NamespaceAPI(endpoint, this.networkAPI.networkHttp);

    this.chainAPI = new ChainAPI(endpoint);
    this.chainConfigAPI = new ChainConfigAPI(endpoint);
    this.diagnosticAPI = new DiagnosticAPI(endpoint);
    this.nodeAPI = new NodeAPI(endpoint);
    this.transactionAPI = new TransactionAPI(endpoint);
  }
}
