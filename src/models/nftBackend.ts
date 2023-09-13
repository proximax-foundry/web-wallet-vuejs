export class NftBackend{

    url: string;

    constructor(url){
        this.url = url;
    }

    serialize(){
        return {
            url: this.url,
        };
    }
}