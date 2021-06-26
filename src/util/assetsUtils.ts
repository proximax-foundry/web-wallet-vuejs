import {
  Account,
  Address,
  Deadline,
  EncryptedMessage,
  // NetworkCurrencyMosaic,
  // FeeCalculationStrategy,
  Mosaic,
  MosaicId,
  UInt64,
  MosaicProperties,
  MosaicSupplyType,
  // MosaicService,
  MosaicNonce,
  PlainMessage,
  TransferTransaction,
  TransactionHttp,
  TransactionBuilderFactory,
  PublicAccount,
  AccountHttp,
  AccountInfo,
  FeeCalculationStrategy,
  NetworkType,
  Transaction,
  TransactionType,
  AggregateTransaction,
  CosignatureTransaction
} from "tsjs-xpx-chain-sdk";
// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';
import { walletState } from "../state/walletState";
import { networkState } from "../state/networkState";
import { ChainUtils } from "../util/chainUtils";
import { WalletUtils } from "../util/walletUtils";
import { ChainAPICall } from "../models/REST/chainAPICall";
import { BuildTransactions } from "../util/buildTransactions";
import { Helper } from "./typeHelper";

export class AssetsUtils {

  static getTransactionFee =(networkType: NetworkType, generationHash: string, owner:PublicAccount, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number) :number => {

    const buildTransactions = new BuildTransactions(networkType, generationHash);
    // owner: PublicAccount, supplyMutable: boolean, transferable: boolean, divisibility: number, duration?: UInt64
    const registerMosaicTransaction = buildTransactions.mosaicDefinition(owner, supplyMutable, transferable, divisibility, UInt64.fromUint(duration));
    return registerMosaicTransaction.maxFee.compact();
  };

  static getMosaicChangeTransaction = (networkType: NetworkType, generationHash: string, owner: PublicAccount, mosaicId: MosaicId, changeType: MosaicSupplyType, delta: UInt64) => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    const registerMosaicSupplyChangeTransaction = buildTransactions.buildMosaicSupplyChange(mosaicId, changeType, delta);
    return registerMosaicSupplyChangeTransaction.maxFee.compact();
  };
}