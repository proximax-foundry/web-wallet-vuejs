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
  NamespaceId,
  MosaicDefinitionTransaction
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

interface assetSelectionInterface {
  label: string,
  value: string,
}


export class AssetsUtils {

  static createAssetTransaction = (networkType: NetworkType, generationHash: string, owner:PublicAccount, supply: number, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number, changeType:number):AggregateTransaction => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    const assetDefinition = buildTransactions.mosaicDefinition(owner, supplyMutable, transferable, divisibility, UInt64.fromUint(AssetsUtils.calculateDuration(duration)));
    const assetDefinitionTx = assetDefinition.toAggregate(owner);
    let supplyChangeType: MosaicSupplyType;
    supplyChangeType = (changeType==1)?MosaicSupplyType.Increase:MosaicSupplyType.Decrease;
    const assetSupplyChangeTx = buildTransactions.buildMosaicSupplyChange(assetDefinition.mosaicId, supplyChangeType, UInt64.fromUint(AssetsUtils.addZeros(divisibility, supply))).toAggregate(owner);
    return buildTransactions.aggregateComplete([assetDefinitionTx, assetSupplyChangeTx]);
  }

  // static assetSupplyChangeTransaction = (networkType: NetworkType, generationHash: string, owner:PublicAccount, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number):MosaicDefinitionTransaction => {
  //   const buildTransactions = new BuildTransactions(networkType, generationHash);
  //   return buildTransactions.buildMosaicSupplyChange(owner, supplyMutable, transferable, divisibility, UInt64.fromUint(AssetsUtils.calculateDuration(duration)));
  // }

  static createAssetTransactionFee = (networkType: NetworkType, generationHash: string, owner:PublicAccount, supply: number, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number, changeType: number) :number => {
    const createAssetTransaction = AssetsUtils.createAssetTransaction(networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration, changeType);
    return createAssetTransaction.maxFee.compact();
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

  static calculateDuration = (durationInDay: number): number =>{
    // 5760 = 4 * 60 * 24 -> 15sec per block
    return durationInDay * 5760;
  }

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

  /**
   * Method to add leading zeros
   *
   * @param cant Quantity of zeros to add
   * @param amount Amount to add zeros
   */
  static addZeros(cant: any, amount = 0) :number{
    let realAmount: any;
    if (cant > 0) {
      let decimal: any;
      if (amount === 0) {
        decimal = this.addDecimals(cant);
        realAmount = `0${decimal}`;
      } else {
        const arrAmount = amount.toString().replace(/,/g, '').split('.');
        if (arrAmount.length < 2) {
          decimal = this.addDecimals(cant);
          // console.debug('decimal 1', decimal);
        } else {
          const arrDecimals = arrAmount[1].split('');
          decimal = this.addDecimals(cant - arrDecimals.length, arrAmount[1]);
          // console.debug('decimal 2', decimal);
        }
        realAmount = `${arrAmount[0]}${decimal}`;
      }
    } else {
      realAmount = amount;
    }

    // console.debug('realAmount', realAmount);
    return realAmount;
  }

  /**
   * Method to add leading zeros
   *
   * @param cant Quantity of zeros to add
   * @param amount Amount to add zeros
   */
   static addDecimals(cant: any, amount = '0') {
    // console.debug('cant', cant);
    const x = '0';
    if (amount === '0') {
      for (let index = 0; index < cant - 1; index++) {
        amount += x;
      }
    } else {
      for (let index = 0; index < cant; index++) {
        amount += x;
      }
    }

    // console.debug(amount);
    return amount;
  }

  static createAsset = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, owner:PublicAccount, supply:number, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number) => {
    let createAssetAggregateTransaction = AssetsUtils.createAssetTransaction(networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration, 1);
    const accAddress = Address.createFromRawAddress(selectedAddress);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find((account) => account.address == accAddress.plain());
    const encryptedPassword = WalletUtils.createPassword(walletPassword);
    let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, accountDetails.encrypted, accountDetails.iv);
    const account = Account.createFromPrivateKey(privateKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
    let signedTx = account.sign(createAssetAggregateTransaction, networkState.currentNetworkProfile.generationHash);
    let apiEndpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort);
    let chainAPICall = new ChainAPICall(apiEndpoint);
    chainAPICall.transactionAPI.announce(signedTx);
    return signedTx.hash;
  }
}

