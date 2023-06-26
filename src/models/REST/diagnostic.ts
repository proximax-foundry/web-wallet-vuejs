import { 
    DiagnosticHttp, BlockchainStorageInfo, ServerInfo
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
export class DiagnosticAPI {

    diagnosticHttp: DiagnosticHttp;

    constructor(endpoint: string){
        this.diagnosticHttp = new DiagnosticHttp(endpoint);
    }

    getServerInfo(): Promise<ServerInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.diagnosticHttp.getServerInfo(authHeader));
    }

    getDiagnosticStorage(): Promise<BlockchainStorageInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.diagnosticHttp.getDiagnosticStorage(authHeader));
    }
}