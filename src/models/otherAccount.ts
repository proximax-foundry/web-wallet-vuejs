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

    getAssetBalance(assetId :string): number | null{
        let asset = this.assets.find((asset)=> asset.idHex === assetId);
        return asset ? asset.amount/ Math.pow(10, asset.divisibility): null;
    }

    updateBalance(assetId: string): void{
        this.balance = this.getAssetBalance(assetId) | 0;
    }

    getDirectChildMultisig(): string[]{

        let temp: MultisigInfo[] = this.multisigInfo.filter(( multiInfo)=> multiInfo.level === -1);

        return temp.length ? OtherAccount.getMultisigInfoPublicKey(temp) : [];
    }

    getDirectParentMultisig(): string[]{

        let temp: MultisigInfo[] = this.multisigInfo.filter(( multiInfo)=> multiInfo.level === 1);

        return OtherAccount.getMultisigInfoPublicKey(temp);
    }

    static getMultisigInfoPublicKey(multisigInfo: MultisigInfo[]): string[]{
        let publicKeyArray: string[] = [];

        publicKeyArray = multisigInfo.map((multiInfo)=> multiInfo.publicKey)

        return publicKeyArray;
    }
}