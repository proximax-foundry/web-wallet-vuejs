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
import { WalletAccount } from "@/models/walletAccount";
import { networkState } from "../state/networkState";
import { ChainUtils } from "../util/chainUtils";
import { WalletUtils } from "../util/walletUtils";
import { ChainAPICall } from "../models/REST/chainAPICall";
import { BuildTransactions } from "../util/buildTransactions";
import { Helper } from "./typeHelper";
import { AssetSupplyType } from "nem-library";

interface assetSelectionInterface {
  label: string,
  value: string,
}


export class AssetsUtils {

  static getTransactionFee =(networkType: NetworkType, generationHash: string, owner:PublicAccount, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number) :number => {

    const buildTransactions = new BuildTransactions(networkType, generationHash);
    // owner: PublicAccount, supplyMutable: boolean, transferable: boolean, divisibility: number, duration?: UInt64
    const registerMosaicTransactionFee = buildTransactions.mosaicDefinition(owner, supplyMutable, transferable, divisibility, UInt64.fromUint(duration));
    return registerMosaicTransactionFee.maxFee.compact();
  };

  static getMosaicSupplyChangeTransaction = (networkType: NetworkType, generationHash: string, owner: PublicAccount, mosaicId: MosaicId, changeType: number, delta: UInt64) => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    let supplyChangeType: MosaicSupplyType;
    supplyChangeType = (changeType==1)?MosaicSupplyType.Increase:MosaicSupplyType.Decrease;
    const getMosaicSupplyChangeTransactionFee = buildTransactions.buildMosaicSupplyChange(mosaicId, supplyChangeType, delta);
    return getMosaicSupplyChangeTransactionFee.maxFee.compact();
  };

  static getAssets = (account: WalletAccount, owner: string) => {
    const assetSelection: Array<assetSelectionInterface> = [];
    const filterAsset = account.assets.filter((asset) => asset.owner === owner);
    if(filterAsset.length > 0){
      filterAsset.forEach((asset) => {
        assetSelection.push({
          label: asset.idHex + ' > ' + Helper.amountFormatterSimple(asset.amount, asset.divisibility) + ' XPX',
          value: asset.idHex,
        });
      });
    }
    return assetSelection;
  }
}

