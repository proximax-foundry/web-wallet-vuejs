import { Account } from './account';
import { MultisigInfo } from './multisigInfo';
import { Asset } from './asset';
import { Namespace } from './namespace';
import { WalletAcountType } from "./const/otherAccountType"

export class OtherAccount extends Account{

    multisigInfo: MultisigInfo[] = [];
    assets: Asset[] = [];
    namespaces: Namespace[] = [];
    type: WalletAcountType;

    constructor(name: string, publicKey: string, address: string, type: WalletAcountType){
        super(name, publicKey, address);
        this.type = type;
    }

    addAsset(asset: Asset){
        this.assets.push(asset);
    }

    removeAsset(id: string){
        const index = this.assets.findIndex((asset)=> asset.idHex === id);

        this.assets.splice(index, 1);
    }

    addNamespace(namespace: Namespace){
        this.namespaces.push(namespace);
    }

    removeNamespace(id: string){
        const index = this.namespaces.findIndex((namespace)=> namespace.idHex === id);

        this.namespaces.splice(index, 1);
    }

    updateMultisigInfo(multisigInfo: MultisigInfo[]){
        this.multisigInfo = multisigInfo;
    }

    getNativeTokenBalance(assetId :string){
        return this.assets.find((asset)=> asset.idHex === assetId)?.amount;
    }

    getNativeTokenBalanceByNamespaceId(namespaceId :string){
        return this.assets.find((asset)=> asset.namespaceId.includes(namespaceId))?.amount;
    }

    updateBalance(assetId: string){
        this.balance = this.getNativeTokenBalance(assetId) || 0;
    }
}