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
    QueryParams,
} from "tsjs-xpx-chain-sdk";
import Base64 from 'crypto-js/enc-base64';
import { WalletAcountType } from "../models/const/otherAccountType";

export class Helper{

    static createPlainMessage(message: string): PlainMessage{
        return PlainMessage.create(message);
    }

    static createEncryptedMessage(message: string, recipientPublicKey: string, networkType: NetworkType, senderPrivateKey: string): EncryptedMessage{
        const publicAccount = PublicAccount.createFromPublicKey(recipientPublicKey, networkType);
        return EncryptedMessage.create(message, publicAccount, senderPrivateKey);
    }

    static createUint64FromNumber(number: number): UInt64{
        return UInt64.fromUint(number);
    }

    static createAsset(mosaicId: string | number[], amount: number): Mosaic{
        return new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(amount));
    }

    static createAssetId(mosaicId: string | number[]): MosaicId{
        return new MosaicId(mosaicId);
    }

    static createNamespaceId(name: string | number[]): NamespaceId{
        return new NamespaceId(name)
    }

    static appendInnerTransaction(transactions: Transaction[], publicKeyTosign: string, innerTransactions:InnerTransaction[]): InnerTransaction[]{
        const networkType = transactions[0].networkType;
        const publicAccount = PublicAccount.createFromPublicKey(publicKeyTosign, networkType);

        transactions.forEach((transaction)=>{
            innerTransactions.push(transaction.toAggregate(publicAccount));
        });

        return innerTransactions;
    }

    static createInnerTransaction(transactions: Transaction[], publicKeyTosign: string): InnerTransaction[]{
        const networkType = transactions[0].networkType;
        const publicAccount = PublicAccount.createFromPublicKey(publicKeyTosign, networkType);
        const newInnerTransaction: InnerTransaction[] = [];

        transactions.forEach((transaction)=>{
            newInnerTransaction.push(transaction.toAggregate(publicAccount));
        });

        return newInnerTransaction;
    }

    static createAddress(address: string): Address{
        return Address.createFromRawAddress(address);
    }

    static getMosaicSupplyType(): typeof MosaicSupplyType{
        return MosaicSupplyType;
    }

    static createPublicAccount(publicKey: string, network: NetworkType): PublicAccount{
        return PublicAccount.createFromPublicKey(publicKey, network);
    }

    static createNonceRandom(): MosaicNonce {
        const nonce = MosaicNonce.createRandom();
        return nonce;
    }

    static getWalletAlgorithm(): typeof WalletAlgorithm{
        return WalletAlgorithm;
    }

    static getOtherWalletAccountType(): typeof WalletAcountType{
        return WalletAcountType;
    }

    static getAliasActionType(): typeof AliasActionType{
        return AliasActionType;
    }

    static base64decode(toDecode: string): any{
        return Base64.parse(toDecode);
    }

    static base64encode(toEncode: string): string{
        return Base64.stringify(toEncode);
    }

    static amountFormatterSimple(amount: number, d: number = 6): string {
        const amountDivisibility = Number(amount) / Math.pow(10, d);
        return amountDivisibility.toLocaleString('en-us', {
          minimumFractionDigits: d
        });
      }
    
      static convertDisplayDateTimeFormat(dateTimeJSON: string): string {
        const date = new Date(dateTimeJSON);
    
        return new Intl.DateTimeFormat('default', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric'
          }).format(date);
      }
    
      static formatFixedDateTime(dateTimeJSON: string): string  {
    
        const newDate = new Date(dateTimeJSON);
    
        return new Intl.DateTimeFormat('en-GB',
          {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric'
          }).format(newDate);
      }
    
      static numberToJSONDate(dateNumber: number): string {
        const newDate = new Date(dateNumber);
    
        return newDate.toISOString();
      }
    
      static convertToCurrency(value: number, divisibility: number): string {
    
        const exactValue = value / Math.pow(10, divisibility);
    
        return new Intl.NumberFormat('en', { maximumFractionDigits: divisibility }).format(exactValue);
      }

      static toCurrencyFormat(value: number, divisibility: number): string {
    
        const exactValue = value;
    
        return new Intl.NumberFormat('en', { maximumFractionDigits: divisibility }).format(exactValue);
      }
    
      static convertToExact = (value: number, divisibility: number): number  => {
    
        return value / Math.pow(10, divisibility);
      }
    
      static convertToAbsolute = (value: number, divisibility: number): number => {
    
        return value * Math.pow(10, divisibility);
      }

      static convertNumberMinimumFormat(value:number, decimalPoint: number){
        return parseFloat(value.toFixed(decimalPoint));
      }

      static createQueryParams(pageSize: number, idToStartFrom?: string | undefined){
          return new QueryParams(pageSize, idToStartFrom);
      }

      static checkIsJSON(data: string): boolean{
        try {
            JSON.parse(data);
            return true;
        } catch (error) {
            return false;
        }
      }
}

export interface LooseObject {
    [key: string]: any
}