import {
    Deadline,
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
    CosignatureTransaction,
    Password,
    TransactionType,
    TransactionHash,
    TransactionQueryParams,
    MetadataQueryParams,
    TransactionGroupType,
    MosaicQueryParams,
    MetadataType,
    Order,
    TransactionSortingField,
    TransactionFieldOrder,
    MosaicFieldOrder,
    MosaicSortingField,
    Order_v2
} from "tsjs-xpx-chain-sdk";
import Base64 from 'crypto-js/enc-base64';
import { OtherAcountType } from "../models/const/otherAccountType";
import * as math from "mathjs";

export class Helper {

    static createPasswordInstance(password: string) {
        return new Password(password);
    }

    static createPlainMessage(message: string): PlainMessage {
        return PlainMessage.create(message);
    }

    static createEncryptedMessage(message: string, recipientPublicKey: string, networkType: NetworkType, senderPrivateKey: string): EncryptedMessage {
        const publicAccount = PublicAccount.createFromPublicKey(recipientPublicKey, networkType);
        return EncryptedMessage.create(message, publicAccount, senderPrivateKey);
    }

    static createEncryptedMessageFromEncoded(payload: string): EncryptedMessage {
        return EncryptedMessage.createFromPayload(payload);
    }

    static createUint64FromNumber(number: number): UInt64 {
        return UInt64.fromUint(number);
    }

    static createAsset(mosaicId: string | number[], amount: number): Mosaic {
        return new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(amount));
    }

    static createAssetId(mosaicId: string | number[]): MosaicId {
        return new MosaicId(mosaicId);
    }

    static createNamespaceId(name: string | number[]): NamespaceId {
        return new NamespaceId(name)
    }

    static appendInnerTransaction(transactions: Transaction[], publicKeyTosign: string, innerTransactions: InnerTransaction[]): InnerTransaction[] {
        const networkType = transactions[0].version.networkType;
        const publicAccount = PublicAccount.createFromPublicKey(publicKeyTosign, networkType);

        transactions.forEach((transaction) => {
            innerTransactions.push(transaction.toAggregateV1(publicAccount));
        });

        return innerTransactions;
    }

    static createInnerTransaction(transactions: Transaction[], publicKeyTosign: string): InnerTransaction[] {
        const networkType = transactions[0].version.networkType;
        const publicAccount = PublicAccount.createFromPublicKey(publicKeyTosign, networkType);
        const newInnerTransaction: InnerTransaction[] = [];

        transactions.forEach((transaction) => {
            newInnerTransaction.push(transaction.toAggregateV1(publicAccount));
        });

        return newInnerTransaction;
    }

    static createAddress(address: string): Address {
        return Address.createFromRawAddress(address);
    }

    static checkAddressNetwork(address: Address, networkType: NetworkType) {
        return address.networkType === networkType;
    }

    static getMosaicSupplyType(): typeof MosaicSupplyType {
        return MosaicSupplyType;
    }

    static createPublicAccount(publicKey: string, network: NetworkType): PublicAccount {
        return PublicAccount.createFromPublicKey(publicKey, network);
    }

    static createAccount(privateKey: string, network: NetworkType): Account {
        return Account.createFromPrivateKey(privateKey, network,1);
    }

    static createNonceRandom(): MosaicNonce {
        const nonce = MosaicNonce.createRandom();
        return nonce;
    }

    static createTransactionHash(hash: string, transactionType: number) {
        return new TransactionHash(hash, transactionType);
    }

    static createTransactionQueryParams(): TransactionQueryParams {
        return new TransactionQueryParams();
    }

    static createMetadataQueryParams(): MetadataQueryParams {
        return new MetadataQueryParams();
    }

    static createTransactionFieldOrder(order: Order_v2, sortingField: TransactionSortingField): TransactionFieldOrder {
        return new TransactionFieldOrder(sortingField, order);
    }

    static createAssetFieldOrder(sortingField: MosaicSortingField, order: Order_v2): MosaicFieldOrder {
        return new MosaicFieldOrder(sortingField, order);
    }

    static getQueryParamOrder(): typeof Order {
        return Order;
    }

    static getQueryParamOrder_v2(): typeof Order_v2 {
        return Order_v2;
    }

    static getTransactionSortField(): typeof TransactionSortingField {
        return TransactionSortingField;
    }

    static getAssetSortField(): typeof MosaicSortingField {
        return MosaicSortingField;
    }

    static getTransactionGroupType(): typeof TransactionGroupType {
        return TransactionGroupType;
    }

    static getWalletAlgorithm(): typeof WalletAlgorithm {
        return WalletAlgorithm;
    }

    static getOtherWalletAccountType(): typeof OtherAcountType {
        return OtherAcountType;
    }

    static getAliasActionType(): typeof AliasActionType {
        return AliasActionType;
    }

    static base64decode(toDecode: string): any {
        return Base64.parse(toDecode);
    }

    static base64encode(toEncode: string): string {
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

    static convertDisplayDateTimeFormat24(dateTimeJSON: string): string {
        const date = new Date(dateTimeJSON);

        return new Intl.DateTimeFormat('default', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false,
        }).format(date);
    }

    static formatDeadline(timestamp: number): string {
        return Helper.convertDisplayDateTimeFormat24(new Date(timestamp + Deadline.timestampNemesisBlock * 1000).toISOString());
    }

    static formatDeadlineTimestamp(timestamp: number): number {
        return timestamp + Deadline.timestampNemesisBlock * 1000;
    }

    static formatFixedDateTime(dateTimeJSON: string): string {

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

    static convertToExact = (value: number, divisibility: number): number => {

        return value / Math.pow(10, divisibility);
    }

    static convertToAbsolute = (value: number, divisibility: number): number => {

        return value * Math.pow(10, divisibility);
    }

    static convertNumberMinimumFormat(value: number, decimalPoint: number) {
        return parseFloat(value.toFixed(decimalPoint));
    }

    static createQueryParams(pageSize: number, idToStartFrom?: string | undefined) {
        return new QueryParams(pageSize, idToStartFrom);
    }

    static checkIsJSON(data: string): boolean {
        try {
            JSON.parse(data);
            return true;
        } catch (error) {
            return false;
        }
    }

    static createCosignatureTransaction(signedABT) {
        return CosignatureTransaction.create(signedABT);
    }

    static validateBuildSelectAccountBalance(balanceAccount: number, feeTransaction: number, rental: number): boolean {
        const totalFee = feeTransaction + rental;
        return balanceAccount >= totalFee;
    }

    static IsoTimeRemoveFormat(time: string){
        let tempTime = time.substring(0, 19);

        return tempTime.replace("T", " ");
    }

    static toUppercase(value: string){
        return value.toUpperCase();
    }

    static safeMultiply(value1: number, value2: number): number{
        return math.bignumber(math.multiply(math.bignumber(value1), math.bignumber(value2)).toString()).toNumber();
    }

    static safeMultiplyCeilDecimals(value1: number, value2: number, decimals: number): number{
        return math.ceil(
            math.bignumber(math.multiply(math.bignumber(value1), math.bignumber(value2)).toString())
        , decimals).toNumber();
    }

    static safeDivideCeilDecimals(value1: number, value2: number, decimals: number): number{
        return math.ceil(
            math.bignumber(math.divide(math.bignumber(value1), math.bignumber(value2)).toString())
        , decimals).toNumber();
    }

    static safeSum(value: Array<number>): number{
        return math.number(math.sum(math.bignumber(value)));
    }

    static bigNumber(value: number): math.BigNumber{
        return math.bignumber(value);
    }

    static samplePubAcc(): PublicAccount{
        return PublicAccount.createFromPublicKey("0".repeat(64), NetworkType.TEST_NET);
    }
}

export interface LooseObject {
    [key: string]: any
}