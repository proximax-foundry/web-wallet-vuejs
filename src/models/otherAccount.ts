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

    addAsset(asset: Asset): void{
        this.assets.push(asset);
    }

    removeAsset(id: string): void{
        const index = this.assets.findIndex((asset)=> asset.idHex === id);

        this.assets.splice(index, 1);
    }

    addNamespace(namespace: Namespace): void{
        this.namespaces.push(namespace);
    }

    removeNamespace(id: string): void{
        const index = this.namespaces.findIndex((namespace)=> namespace.idHex === id);

        this.namespaces.splice(index, 1);
    }

    updateMultisigInfo(multisigInfo: MultisigInfo[]): void{
        this.multisigInfo = multisigInfo;
    }

    getNativeTokenBalance(assetId :string): number | null{
        return this.assets.find((asset)=> asset.idHex === assetId)?.amount;
    }

    getNativeTokenBalanceByNamespaceId(namespaceId :string): number | null{
        return this.assets.find((asset)=> asset.namespaceId.includes(namespaceId))?.amount;
    }

    updateBalance(assetId: string): void{
        let tokenBalance = this.getNativeTokenBalance(assetId);
        this.balance = tokenBalance ? tokenBalance : 0;
    }
}