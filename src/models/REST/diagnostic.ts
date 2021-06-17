import { 
    DiagnosticHttp, BlockchainStorageInfo, ServerInfo
} from "tsjs-xpx-chain-sdk";

export class DiagnosticAPI {

    diagnosticHttp: DiagnosticHttp;

    constructor(endpoint: string){
        this.diagnosticHttp = new DiagnosticHttp(endpoint);
    }

    getServerInfo(): Promise<ServerInfo>{
        return this.diagnosticHttp.getServerInfo().toPromise();
    }

    getDiagnosticStorage(): Promise<BlockchainStorageInfo>{
        return this.diagnosticHttp.getDiagnosticStorage().toPromise();
    }
}