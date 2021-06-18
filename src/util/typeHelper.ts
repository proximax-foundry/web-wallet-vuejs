import { 
    Message, NetworkType, 
    PublicAccount, Account,
    UInt64,
    PlainMessage, EncryptedMessage, 
    MosaicId, Mosaic, NamespaceId,
    Transaction, InnerTransaction, 
    Address,
    MosaicSupplyType,
    MosaicNonce,
    WalletAlgorithm,
    AliasActionType,
} from "tsjs-xpx-chain-sdk";
import Base64 from 'crypto-js/enc-base64';
import { WalletAcountType } from "../models/const/otherAccountType";

export class Helper{

    static createPlainMessage(message: string){
        return PlainMessage.create(message);
    }

    static createEncryptedMessage(message: string, recipientPublicKey: string, networkType: NetworkType, senderPrivateKey: string){
        const publicAccount = PublicAccount.createFromPublicKey(recipientPublicKey, networkType);
        return EncryptedMessage.create(message, publicAccount, senderPrivateKey);
    }

    static createUint64FromNumber(number: number){
        return UInt64.fromUint(number);
    }

    static createAsset(mosaicId: string | number[], amount: number){
        return new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(amount));
    }

    static createAssetId(mosaicId: string | number[]){
        return new MosaicId(mosaicId);
    }

    static createNamespaceId(name: string | number[]){
        return new NamespaceId(name)
    }

    static appendInnerTransaction(transactions: Transaction[], publicKeyTosign: string, innerTransactions:InnerTransaction[]){
        const networkType = transactions[0].networkType;
        const publicAccount = PublicAccount.createFromPublicKey(publicKeyTosign, networkType);

        transactions.forEach((transaction)=>{
            innerTransactions.push(transaction.toAggregate(publicAccount));
        });

        return innerTransactions;
    }

    static createInnerTransaction(transactions: Transaction[], publicKeyTosign: string){
        const networkType = transactions[0].networkType;
        const publicAccount = PublicAccount.createFromPublicKey(publicKeyTosign, networkType);
        const newInnerTransaction: InnerTransaction[] = [];

        transactions.forEach((transaction)=>{
            newInnerTransaction.push(transaction.toAggregate(publicAccount));
        });

        return newInnerTransaction;
    }

    static createAddress(address: string){
        return Address.createFromRawAddress(address);
    }

    static getMosaicSupplyType(){
        return MosaicSupplyType;
    }

    static createPublicAccount(publicKey: string, network: NetworkType){
        return PublicAccount.createFromPublicKey(publicKey, network);
    }

    static createNonceRandom() {
        const nonce = MosaicNonce.createRandom();
        return nonce;
    }

    static getWalletAlgorithm(){
        return WalletAlgorithm;
    }

    static getOtherWalletAccountType(){
        return WalletAcountType;
    }

    static getAliasActionType(){
        return AliasActionType;
    }

    static base64decode(toDecode: string){
        return Base64.parse(toDecode);
    }

    static base64encode(toEncode: string){
        return Base64.stringify(toEncode);
    }
}

export interface LooseObject {
    [key: string]: any
}