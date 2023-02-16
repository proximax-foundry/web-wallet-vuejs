import { NetworkType, PublicAccount } from 'tsjs-xpx-chain-sdk';
import { MultisigInfo } from './multisigInfo';
import { Asset } from './asset';
import { Namespace } from './namespace';
import { walletState } from '@/state/walletState';

export class Account{
    name: string;
    balance: number = 0;
    publicKey: string;
    address: string;
    multisigInfo: MultisigInfo[] = [];
    assets: Asset[] = [];
    nonHoldingAssets: Asset[] = [];
    namespaces: Namespace[] = [];
    linkedPublicKey: string = "";
    totalCreatedAsset: number | null = null;
    totalTxns: number = -1; // temp store total txns number, -1 to indicate not updated - include embedded, exclude cosigning
    assetsLastUpdate: number = Date.now();

    constructor(name: string, publicKey: string, address: string){
        this.name = name;
        this.publicKey = publicKey;
        this.address = address;
    }

    fixAddress(networkType: NetworkType): void{
        this.address = PublicAccount.createFromPublicKey(this.publicKey, networkType).address.plain();
    }

    addAsset(asset: Asset): void{
        this.assets.push(asset);
    }

    findAsset(id: string): Asset | undefined{
        return this.assets.find((asset)=> asset.idHex === id);
    }

    removeAsset(id: string): void{
        const index = this.assets.findIndex((asset)=> asset.idHex === id);

        if(index > -1){
            this.assets.splice(index, 1);
        }
    }

    removeAssetByIndex(index: number): void{

        this.assets.splice(index, 1);
    }

    addNamespace(namespace: Namespace): void{
        this.namespaces.push(namespace);
    }

    removeNamespace(id: string): void{
        const index = this.namespaces.findIndex((namespace)=> namespace.idHex === id);

        if(index > -1){
            this.namespaces.splice(index, 1);
        }
    }

    findNamespaceNameByAsset(assetId: string): Namespace[] | null{

        let foundNamespaces = this.namespaces.filter((ns)=> ns.linkedId === assetId);

        return foundNamespaces ? foundNamespaces: null;
    }

    updateMultisigInfo(multisigInfo: MultisigInfo[]): void{
        this.multisigInfo = multisigInfo;
    }

    getAssetBalance(assetId :string): number | null{
        let asset = this.assets.find((asset)=> asset.idHex === assetId);
        return asset ? asset.amount: null;
    }

    updateBalance(assetId: string): void{
        this.balance = this.getAssetBalance(assetId) || 0;
    }

    getDirectChildMultisig(): string[]{

        let temp: MultisigInfo[] = this.multisigInfo.filter(( multiInfo)=> multiInfo.level === -1);

        return temp.length ? Account.getMultisigInfoPublicKey(temp) : [];
    }

    getDirectParentMultisig(): string[]{

        let temp: MultisigInfo[] = this.multisigInfo.filter(( multiInfo)=> multiInfo.level === 1);

        return Account.getMultisigInfoPublicKey(temp);
    }

    addNonHoldingAsset(asset: Asset){
        let nonHoldingAssetsId = this.nonHoldingAssets.map((asset)=> asset.idHex);
        
        if(!nonHoldingAssetsId.includes(asset.idHex)){
            this.nonHoldingAssets.push(asset);
        }
    }

    static getMultisigInfoPublicKey(multisigInfo: MultisigInfo[]): string[]{
        let publicKeyArray: string[] = [];

        publicKeyArray = multisigInfo.map((multiInfo)=> multiInfo.publicKey)

        return publicKeyArray;
    }
}

export const setDefaultAccInStorage = (address) =>{
     
    sessionStorage.setItem('defaultAcc',address)
    walletState.currentLoggedInWallet.setDefaultAccountByAddress(address)
  }