import { 
    DiagnosticHttp
} from "tsjs-xpx-chain-sdk";

export class DiagnosticAPI {

    diagnosticHttp: DiagnosticHttp;

    constructor(endpoint: string){
        this.diagnosticHttp = new DiagnosticHttp(endpoint);
    }

    getServerInfo(){
        return this.diagnosticHttp.getServerInfo().toPromise();
    }

    getDiagnosticStorage(){
        return this.diagnosticHttp.getDiagnosticStorage().toPromise();
    }
}