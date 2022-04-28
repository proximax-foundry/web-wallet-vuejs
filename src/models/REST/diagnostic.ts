import { 
    DiagnosticHttp, BlockchainStorageInfo, ServerInfo
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';

export class DiagnosticAPI {

    diagnosticHttp: DiagnosticHttp;

    constructor(endpoint: string){
        this.diagnosticHttp = new DiagnosticHttp(endpoint);
    }

    getServerInfo(): Promise<ServerInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.diagnosticHttp.getServerInfo(authHeader).toPromise();
    }

    getDiagnosticStorage(): Promise<BlockchainStorageInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.diagnosticHttp.getDiagnosticStorage(authHeader).toPromise();
    }
}