import {
  Account,
  Address,
  AliasActionType,
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
  CosignatureTransaction,
  NamespaceId
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

  static getMosaicDefinitionTransactionFee =(networkType: NetworkType, generationHash: string, owner:PublicAccount, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number) :number => {

    const buildTransactions = new BuildTransactions(networkType, generationHash);
    // owner: PublicAccount, supplyMutable: boolean, transferable: boolean, divisibility: number, duration?: UInt64
    const registerMosaicTransaction = buildTransactions.mosaicDefinition(owner, supplyMutable, transferable, divisibility, UInt64.fromUint(duration));
    return registerMosaicTransaction.maxFee.compact();
  };

  static getMosaicSupplyChangeTransactionFee = (networkType: NetworkType, generationHash: string, owner: PublicAccount, mosaicId: MosaicId, changeType: number, delta: UInt64) => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    let supplyChangeType: MosaicSupplyType;
    supplyChangeType = (changeType==1)?MosaicSupplyType.Increase:MosaicSupplyType.Decrease;
    const mosaicSupplyChangeTransaction = buildTransactions.buildMosaicSupplyChange(mosaicId, supplyChangeType, delta);
    return mosaicSupplyChangeTransaction.maxFee.compact();
  };

  static getLinkAssetToNamespaceTransactionFee = (networkType: NetworkType, generationHash: string, mosaicId: MosaicId, namespaceId: NamespaceId, linkType: string) => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    let aliasActionType: AliasActionType;
    aliasActionType = (linkType=='link')?AliasActionType.Link:AliasActionType.Unlink;
    const linkAssetToNamespaceTransaction = buildTransactions.assetAlias( aliasActionType, namespaceId, mosaicId);
    return linkAssetToNamespaceTransaction.maxFee.compact();
  };

  static getOwnedAssets = (address: string) => {
    const assetSelection: Array<assetSelectionInterface> = [];
    const account = walletState.currentLoggedInWallet.accounts.find(account => account.address === address);
    const filterAsset = account.assets.filter((asset) => asset.owner === account.publicKey);
    if(filterAsset.length > 0){
      filterAsset.forEach((asset) => {
        assetSelection.push({
          label: asset.idHex + ' > ' + Helper.amountFormatterSimple(asset.amount, asset.divisibility),
          value: asset.idHex,
        });
      });
    }
    return assetSelection;
  }

  static getCosignerList(address: string){
    const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address);
    const cosigners = account.multisigInfo.find(multi => multi.level == 1);
    if(cosigners != undefined){
      const cosignAddress = cosigners.getCosignaturiesAddress(networkState.currentNetworkProfile.network.type);
      let cosignList = [];
      if(cosignAddress.length > 0){
        cosignAddress.forEach((cosign) => {
          const cosignAcc = walletState.currentLoggedInWallet.accounts.find(account => account.address === cosign);
          if(!cosignAcc){
            cosignList.push({
              name: cosignAcc.name,
              address: cosignAcc.address,
              balance: cosignAcc.balance,
            });
          }
        });
      }
      return { list: cosignList };
    }else{
      return { list: [] };
    }
  }
}

