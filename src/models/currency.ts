export class Currency{

    name: string;
    namespace: string;
    assetId: string | null = null;
    namespaceId: string;
    divisibility: number;

    constructor(name: string, namespace: string, assetId: string, namespaceId: string, divisibility: number){
        this.name = name;
        this.namespace = namespace;
        this.namespaceId = assetId;
        this.namespaceId = namespaceId;
        this.divisibility = divisibility;
    }

    static createDefault(){
        return new Currency("XPX", "prx.xpx", "", "bffb42a19116bdf6", 6);
    }

    serialize(){
        return {
            name: this.name,
            namespace: this.namespace,
            mosaicId: this.assetId,
            namespaceId: this.namespaceId,
            divisibility: this.divisibility
        };
    }
}