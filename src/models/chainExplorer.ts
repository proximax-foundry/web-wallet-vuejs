export class ChainExplorer{

    url: string;
    blockRoute: string = "";
    publicKeyRoute: string = "";
    addressRoute: string = "";
    hashRoute: string = "";
    namespaceInfoRoute: string = "";
    assetInfoRoute: string = "";

    constructor(url){
        this.url = url;
    }

    static createDefault(): ChainExplorer{
        const chainExplorer = new ChainExplorer("https://bctestnetexplorer.xpxsirius.io");
        chainExplorer.blockRoute = "#/result/blockHeight";
        chainExplorer.publicKeyRoute = "#/result/publicKey";
        chainExplorer.addressRoute = "#/result/address";
        chainExplorer.hashRoute = "#/result/hash";
        chainExplorer.namespaceInfoRoute = "#/result/namespaceInfo";
        chainExplorer.assetInfoRoute = "#/result/assetInfo";
        return chainExplorer;
    }

    serialize(){
        return {
            url: this.url,
            blockRoute: this.blockRoute,
            publicKeyRoute: this.publicKeyRoute,
            addressRoute: this.addressRoute,
            hashRoute: this.hashRoute,
            namespaceInfoRoute: this.namespaceInfoRoute,
            assetInfoRoute: this.assetInfoRoute
        };
    }
}