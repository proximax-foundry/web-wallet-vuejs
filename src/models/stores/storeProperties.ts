const walletKey = 'sw';

export class StoreProperties{

    storeName: string;

    constructor(storeName: string){
        this.storeName = storeName;
    }

    init() {
        const stateFromLocalStorage = localStorage.getItem(this.storeName);

        if (stateFromLocalStorage) {
                if(typeof stateFromLocalStorage === 'string'){
                    Object.assign(this, JSON.parse(stateFromLocalStorage));
                }
                else{
                    Object.assign(this, stateFromLocalStorage);
                }
        }
    }

    saveToLocalStorage(){
        const stateCopy = Object.assign({}, this);
        delete stateCopy.storeName;
        localStorage.setItem(this.storeName, JSON.stringify(stateCopy));
    }
}