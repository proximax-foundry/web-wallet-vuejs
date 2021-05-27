import { Account } from './account';
import { nis1Account } from './nis1Account';
import { MultisigInfo } from './multisigInfo';
import { Asset } from './asset';
import { Namespace } from './namespace';

export class WalletAccount extends Account{

    default: boolean = false;
    isBrain: boolean = false;
    isPopulated: boolean = false;
    algo: string;
    encrypted: string;
    iv: string;
    nis1Account: nis1Account = null;
    multisigInfo: MultisigInfo[] = null;
    assets: Asset[] = null;
    namespaces: Namespace[] = null;

    constructor(name: string, publicKey: string, address: string, algo: string, encrypted: string, iv: string){
        super(name, publicKey, address);
        
        this.algo = algo;
        this.encrypted = encrypted;
        this.iv = iv;
    }

    addAsset(asset: Asset){
        this.assets.push(asset);
    }

    removeAsset(id: string){
        var index = this.assets.findIndex((asset)=> asset.idHex === id);

        this.assets.splice(index, 1);
    }

    addNamespace(namespace: Namespace){
        this.namespaces.push(namespace);
    }

    removeNamespace(id: string){
        var index = this.namespaces.findIndex((namespace)=> namespace.idHex === id);

        this.namespaces.splice(index, 1);
    }

    updateMultisigInfo(multisigInfo: MultisigInfo[]){
        this.multisigInfo = multisigInfo;
    }
}