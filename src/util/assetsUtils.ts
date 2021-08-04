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
  MosaicAliasTransaction,
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
  MosaicDefinitionTransaction,
  MosaicSupplyChangeTransaction
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

  static createAssetTransaction = (networkType: NetworkType, generationHash: string, owner:PublicAccount, supply: number, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number, changeType:boolean):AggregateTransaction => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    const assetDefinition = buildTransactions.mosaicDefinition(owner, supplyMutable, transferable, divisibility, UInt64.fromUint(AssetsUtils.calculateDuration(duration)));
    const assetDefinitionTx = assetDefinition.toAggregate(owner);
    let supplyChangeType: MosaicSupplyType;
    supplyChangeType = (changeType)?MosaicSupplyType.Increase:MosaicSupplyType.Decrease;
    const assetSupplyChangeTx = buildTransactions.buildMosaicSupplyChange(assetDefinition.mosaicId, supplyChangeType, UInt64.fromUint(AssetsUtils.addZeros(divisibility, supply))).toAggregate(owner);
    return buildTransactions.aggregateComplete([assetDefinitionTx, assetSupplyChangeTx]);
  }

  static assetSupplyChangeTransaction = (networkType: NetworkType, generationHash: string, mosaidStringId: string, changeType: boolean, supply: number, divisibility:number):MosaicSupplyChangeTransaction => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    let supplyChangeType: MosaicSupplyType;
    supplyChangeType = (changeType)?MosaicSupplyType.Increase:MosaicSupplyType.Decrease;
    return buildTransactions.buildMosaicSupplyChange(new MosaicId(mosaidStringId), supplyChangeType, UInt64.fromUint(AssetsUtils.addZeros(divisibility, supply)));
  }

  static linkAssetToNamespaceTransaction = (networkType: NetworkType, generationHash: string, mosaicId: MosaicId, namespaceId: NamespaceId, linkType: string) :MosaicAliasTransaction => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    let aliasActionType: AliasActionType;
    aliasActionType = (linkType=='link')?AliasActionType.Link:AliasActionType.Unlink;
    return buildTransactions.assetAlias( aliasActionType, namespaceId, mosaicId);
  };

  static createAssetTransactionFee = (networkType: NetworkType, generationHash: string, owner:PublicAccount, supply: number, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number, changeType: boolean) :number => {
    const createAssetTransaction = AssetsUtils.createAssetTransaction(networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration, changeType);
    return createAssetTransaction.maxFee.compact();
  };

  static getMosaicSupplyChangeTransactionFee = (networkType: NetworkType, generationHash: string, mosaicId: string, changeType: boolean, supply: number, divisibility: number) => {
    const mosaicSupplyChangeTx = AssetsUtils.assetSupplyChangeTransaction(networkType, generationHash, mosaicId, changeType, supply, divisibility);
    return mosaicSupplyChangeTx.maxFee.compact();
  };

  static getLinkAssetToNamespaceTransactionFee = (networkType: NetworkType, generationHash: string, mosaicId: MosaicId, namespaceId: NamespaceId, linkType: string) :number => {
    const linkAssetToNamespaceTx = AssetsUtils.linkAssetToNamespaceTransaction(networkType, generationHash, mosaicId, namespaceId, linkType);
    return linkAssetToNamespaceTx.maxFee.compact();
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

  static getOwnedAssetsPermutable = (address: string) => {
    const assetSelection: Array<assetSelectionInterface> = [];
    const account = walletState.currentLoggedInWallet.accounts.find(account => account.address === address );
    const filterAsset = account.assets.filter(asset => (asset.owner === account.publicKey && asset.supplyMutable === true));
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
    let createAssetAggregateTransaction = AssetsUtils.createAssetTransaction(networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration, true);
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

  static changeAssetSupply = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, mosaicId: string, changeType: boolean, supply: number, divisibility: number) => {
    let createAssetAggregateTransaction = AssetsUtils.assetSupplyChangeTransaction(networkType, generationHash, mosaicId, changeType, supply, divisibility);
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

  static linkedNamespaceToAsset = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, mosaicId: MosaicId, namespaceId: NamespaceId, linkType: string) => {
    const linkAssetToNamespaceTx = AssetsUtils.linkAssetToNamespaceTransaction(networkType, generationHash, mosaicId, namespaceId, linkType);
    const accAddress = Address.createFromRawAddress(selectedAddress);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find((account) => account.address == accAddress.plain());
    const encryptedPassword = WalletUtils.createPassword(walletPassword);
    let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, accountDetails.encrypted, accountDetails.iv);
    const account = Account.createFromPrivateKey(privateKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
    let signedTx = account.sign(linkAssetToNamespaceTx, networkState.currentNetworkProfile.generationHash);
    let apiEndpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort);
    let chainAPICall = new ChainAPICall(apiEndpoint);
    chainAPICall.transactionAPI.announce(signedTx);
    return signedTx.hash;
  }


  static listActiveNamespacesToLink = (address:string, linkOption: string) => {
    const accountNamespaces = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address).namespaces.filter(namespace => namespace.active === true);
    console.log(accountNamespaces)
    const namespacesNum = accountNamespaces.length;
    let namespacesArr = [];
    if(namespacesNum > 0){
      accountNamespaces.forEach((namespaceElement) => {
        const level = namespaceElement.name.split('.');
        let isDisabled: boolean;
        let label:string = '';
        if(namespaceElement.linkedId != ''){
          isDisabled = (linkOption=='link'?true:false);
          let linkName:string;
          let linkLabel:string;

          switch (namespaceElement.linkType) {
            case 1:
              linkName = "Asset";
              linkLabel = namespaceElement.linkedId;
              break;
            case 2:
              linkName = "Address";
              linkLabel = Helper.createAddress(namespaceElement.linkedId).pretty()
              break;
            default:
              break;
          }

          label = namespaceElement.name + ' (Linked to ' + linkName + ') - ' + linkLabel;
        }else{
          isDisabled = (linkOption=='link'?false:true);
          label = namespaceElement.name;
        }
        namespacesArr.push({
          value: namespaceElement.idHex,
          label: label,
          disabled: isDisabled,
          level: level
        });
      });

      namespacesArr.sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      });
      namespacesArr.sort((a, b) => {
        if (a.level > b.level) return 1;
        if (a.level < b.level) return -1;
        return 0;
      });
    }
    return namespacesArr;
  }
}

