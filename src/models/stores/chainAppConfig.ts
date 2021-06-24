import { StoreProperties } from "./storeProperties";
import { NetworkTypes } from "nem-library";

export class ChainAppConfig extends StoreProperties{

    defaultPollPublicKey: string = "";
    attestationAddress: string = "";
    swapAccount: SwapAccount | null = null;
    swapAllowedMosaics: SwapAllowedMosaic[] = [];
    coingeckoUrl: string = "";
    nis1Config: nis1Config | null = null;

    constructor(storeName: string){
        super(storeName + "_appConfig");
    }

    serialize(){
        return {
            defaultPollPublicKey: this.defaultPollPublicKey,
            attestationAddress: this.attestationAddress,
            swapAccount: this.swapAccount ? this.swapAccount.serialize(): null,
            swapAllowedMosaics:  this.swapAllowedMosaics ? this.swapAllowedMosaics.map((i)=>i.serialize()): null,
            coingeckoUrl: this.coingeckoUrl,
            nis1Config: this.nis1Config ? this.nis1Config.serialize() : null
        };
    }
}

class SwapAccount{
    addressAccountMultisig: string;
    addressAccountSimple: string;

    constructor(addressAccountMultisig: string, addressAccountSimple: string){
        this.addressAccountMultisig = addressAccountMultisig;
        this.addressAccountSimple = addressAccountSimple;
    }

    serialize(){
        return {
            addressAccountMultisig: this.addressAccountMultisig,
            addressAccountSimple: this.addressAccountSimple
        };
    }
}

class SwapAllowedMosaic{
    fullName: string;
    namespace: string;
    name: string; 
    divisibility: number;

    constructor(namespace: string, name: string, divisibility: number, fullName: string){
        this.namespace = namespace;
        this.name = name;
        this.divisibility = divisibility;
        this.fullName = fullName;
    }

    serialize(){
        return {
            namespace: this.namespace,
            name : this.name,
            divisibility : this.divisibility,
            fullName : this.fullName
        };
    }
}

class nis1Config{
    url: string = "";
    urlExplorer: string = "";
    networkType: NetworkTypes = NetworkTypes.MAIN_NET;
    burnAddress: string = "";
    nodes: nis1Node[] = [];

    constructor(url: string, urlExplorer: string, networkType: NetworkTypes, burnAddress: string, nodes: nis1Node[]){
        this.burnAddress = burnAddress;
        this.url = url;
        this.urlExplorer = urlExplorer;
        this.networkType = networkType;
        this.nodes = nodes;
    }

    serialize(){
        return {
            url: this.url,
            urlExplorer: this.urlExplorer,
            networkType: this.networkType,
            burnAddress: this.burnAddress,
            nodes: this.nodes.length ? this.nodes.map((node)=> node.serialize()) : []
        }
    }
}

class nis1Node{
    protocol: string;
    domain: string;
    port: number;

    constructor(protocol: string, domain: string, port: number){
        this.protocol = protocol;
        this.domain = domain;
        this.port = port;
    }

    serialize(){
        return {
            protocol: this.protocol,
            domain: this.domain,
            port: this.port
        };
    }
}