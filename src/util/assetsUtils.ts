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
  MosaicSupplyChangeTransaction,
  SignedTransaction,
} from "tsjs-xpx-chain-sdk";
// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';
import { walletState } from "../state/walletState";
import { WalletAccount } from "@/models/walletAccount";
import { networkState } from "../state/networkState";
import { ChainUtils } from "../util/chainUtils";
import { WalletUtils } from "../util/walletUtils";
import { ChainAPICall } from "../models/REST/chainAPICall";
import { BuildTransactions } from "../util/buildTransactions";
import { AutoAnnounceSignedTransaction, HashAnnounceBlock, AnnounceType, listenerState } from "@/state/listenerState";
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";
import { Helper } from "./typeHelper";
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";

interface assetSelectionInterface {
  label: string,
  value: string,
}


export class AssetsUtils {

  static createAssetTransaction = (networkType: NetworkType, generationHash: string, owner:PublicAccount, supply: number, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number, changeType:string):AggregateTransaction => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    const assetDefinition = buildTransactions.mosaicDefinition(owner, supplyMutable, transferable, divisibility, UInt64.fromUint(AssetsUtils.calculateDuration(duration)));
    const assetDefinitionTx = assetDefinition.toAggregate(owner);
    let supplyChangeType: MosaicSupplyType;
    supplyChangeType = (changeType=='increase')?MosaicSupplyType.Increase:MosaicSupplyType.Decrease;
    const assetSupplyChangeTx = buildTransactions.buildMosaicSupplyChange(assetDefinition.mosaicId, supplyChangeType, UInt64.fromUint(AssetsUtils.addZeros(divisibility, supply))).toAggregate(owner);
    return buildTransactions.aggregateComplete([assetDefinitionTx, assetSupplyChangeTx]);
  }

  static assetSupplyChangeTransaction = (networkType: NetworkType, generationHash: string, mosaidStringId: string, changeType: string, supply: number, divisibility:number):MosaicSupplyChangeTransaction => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    let supplyChangeType: MosaicSupplyType;
    supplyChangeType = (changeType=='increase')?MosaicSupplyType.Increase:MosaicSupplyType.Decrease;
    return buildTransactions.buildMosaicSupplyChange(new MosaicId(mosaidStringId), supplyChangeType, UInt64.fromUint(AssetsUtils.addZeros(divisibility, supply)));
  }

  static linkAssetToNamespaceTransaction = (networkType: NetworkType, generationHash: string, mosaicIdString: string, namespaceString: string, linkType: string) :MosaicAliasTransaction => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    let aliasActionType: AliasActionType;
    aliasActionType = (linkType=='link')?AliasActionType.Link:AliasActionType.Unlink;
    return buildTransactions.assetAlias( aliasActionType, new NamespaceId(namespaceString), new MosaicId(mosaicIdString));
  };

  static createAssetTransactionFee = (networkType: NetworkType, generationHash: string, owner:PublicAccount, supply: number, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number, changeType: string) :number => {
    const createAssetTransaction = AssetsUtils.createAssetTransaction(networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration, changeType);
    return createAssetTransaction.maxFee.compact();
  };

  static getMosaicSupplyChangeTransactionFee = (networkType: NetworkType, generationHash: string, mosaicId: string, changeType: string, supply: number, divisibility: number) => {
    const mosaicSupplyChangeTx = AssetsUtils.assetSupplyChangeTransaction(networkType, generationHash, mosaicId, changeType, supply, divisibility);
    return mosaicSupplyChangeTx.maxFee.compact();
  };

  static getLinkAssetToNamespaceTransactionFee = (networkType: NetworkType, generationHash: string, mosaicId: string, namespaceId: string, linkType: string) :number => {
    const linkAssetToNamespaceTx = AssetsUtils.linkAssetToNamespaceTransaction(networkType, generationHash, mosaicId, namespaceId, linkType);
    return linkAssetToNamespaceTx.maxFee.compact();
  };

  static calculateDuration = (durationInDay: number): number =>{
    let chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
    chainConfig.init();
    let blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);
    let blockTargetTimeByDay = (60 * 60 * 24) / blockTargetTime;
    // 5760 = 4 * 60 * 24 -> 15sec per block
    return Math.floor(durationInDay * blockTargetTimeByDay);
  }

  static getOwnedAssets = (address: string) => {
    const assetSelection: Array<assetSelectionInterface> = [];
    const account = walletState.currentLoggedInWallet.accounts.find(account => account.address === address);
    const other = walletState.currentLoggedInWallet.others.find(account => account.address === address);
    const filterAccountAsset = account?account.assets.filter((asset) => asset.owner === account.publicKey):[];
    const filterOtherAsset = other?other.assets.filter((asset) => asset.owner === other.publicKey):[];
    if(filterAccountAsset.length > 0){
      filterAccountAsset.forEach((asset) => {
        assetSelection.push({
          label: asset.idHex + ' > ' + Helper.amountFormatterSimple(asset.amount, asset.divisibility),
          value: asset.idHex,
        });
      });
    }
    if(filterOtherAsset.length > 0){
      filterOtherAsset.forEach((asset) => {
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
    const account = walletState.currentLoggedInWallet.accounts.find(account => account.address === address);
    const other = walletState.currentLoggedInWallet.others.find(account => account.address === address);
    const filterAccountAsset = account?account.assets.filter(asset => (asset.owner === account.publicKey && asset.supplyMutable === true)):[];
    const filterOtherAsset = other?other.assets.filter(asset => (asset.owner === other.publicKey && asset.supplyMutable === true)):[];
    if(filterAccountAsset.length > 0){
      filterAccountAsset.forEach((asset) => {
        assetSelection.push({
          label: asset.idHex + ' > ' + Helper.amountFormatterSimple(asset.amount, asset.divisibility),
          value: asset.idHex,
        });
      });
    }

    if(filterOtherAsset.length > 0){
      filterOtherAsset.forEach((asset) => {
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
    const other = walletState.currentLoggedInWallet.others.find((account) => account.address == address);
    let multiSig = account?account.getDirectParentMultisig():[];
    let multiSigOther = other?other.getDirectParentMultisig():[];
    if(multiSig.length > 0 || multiSigOther.length > 0){
      const cosigner = walletState.currentLoggedInWallet.accounts.filter(account => {
        if(multiSig.indexOf(account.publicKey) >= 0 || multiSigOther.indexOf(account.publicKey) >= 0){
          return true;
        }
      });
      let cosignList = [];
      if(cosigner.length > 0){
        cosigner.forEach((cosign) => {
          cosignList.push({
            name: cosign.name,
            address: cosign.address,
            balance: cosign.balance,
          });
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
        } else {
          const arrDecimals = arrAmount[1].split('');
          decimal = this.addDecimals(cant - arrDecimals.length, arrAmount[1]);
        }
        realAmount = `${arrAmount[0]}${decimal}`;
      }
    } else {
      realAmount = amount;
    }
    return realAmount;
  }

  /**
   * Method to add leading zeros
   *
   * @param cant Quantity of zeros to add
   * @param amount Amount to add zeros
   */
   static addDecimals(cant: any, amount = '0') {
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
    return amount;
  }

  static getSenderAccount = (selectedAddress:string, walletPassword:string) :Account => {
    const accAddress = Address.createFromRawAddress(selectedAddress);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find((account) => account.address == accAddress.plain());
    const encryptedPassword = WalletUtils.createPassword(walletPassword);
    let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, accountDetails.encrypted, accountDetails.iv);
    const account = Account.createFromPrivateKey(privateKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
    return account;
  }

  static createAsset = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, owner:PublicAccount, supply:number, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number) => {
    let createAssetAggregateTransaction = AssetsUtils.createAssetTransaction(networkType, generationHash, owner, supply, supplyMutable, transferable, divisibility, duration, 'increase');
    const account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(createAssetAggregateTransaction, networkState.currentNetworkProfile.generationHash);
    AssetsUtils.annouce(signedTx);
  }

  static createAssetMultiSig = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, owner:PublicAccount, supply:number, supplyMutable: boolean, transferable:boolean, divisibility: number, duration: number, multiSigAddress: string) => {
    const buildTransactions = new BuildTransactions(networkType, generationHash);
    const assetDefinition = buildTransactions.mosaicDefinition(owner, supplyMutable, transferable, divisibility, UInt64.fromUint(AssetsUtils.calculateDuration(duration)));
    const assetDefinitionTx = assetDefinition.toAggregate(owner);
    let supplyChangeType: MosaicSupplyType;
    supplyChangeType = MosaicSupplyType.Increase;
    const assetSupplyChangeTx = buildTransactions.buildMosaicSupplyChange(assetDefinition.mosaicId, supplyChangeType, UInt64.fromUint(AssetsUtils.addZeros(divisibility, supply))).toAggregate(owner);

    const account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisSigAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress);
    const multisSigOther = walletState.currentLoggedInWallet.others.find((element) => element.address === multiSigAddress);
    const multisigPublicKey = multisSigAccount?multisSigAccount.publicKey:multisSigOther.publicKey;

    const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, networkType);

    const innerTxn = [assetDefinitionTx.toAggregate(multisigPublicAccount),assetSupplyChangeTx.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    const aggregateBondedTxSigned = account.sign(aggregateBondedTx, generationHash);
    let hashLockTx = buildTransactions.hashLock(
      Helper.createAsset(networkState.currentNetworkProfile.network.currency.assetId, 10000000),
      Helper.createUint64FromNumber(200),
      aggregateBondedTxSigned
    );
    let signedHashlock = account.sign(hashLockTx, generationHash);
    AssetsUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);
  }

  static changeAssetSupply = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, mosaicId: string, changeType: string, supply: number, divisibility: number) => {
    let createAssetAggregateTransaction = AssetsUtils.assetSupplyChangeTransaction(networkType, generationHash, mosaicId, changeType, supply, divisibility);
    const account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(createAssetAggregateTransaction, networkState.currentNetworkProfile.generationHash);
    AssetsUtils.annouce(signedTx);
  }

  static changeAssetSupplyMultiSig = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, mosaicId: string, changeType: string, supply: number, divisibility: number, multiSigAddress: string) => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    let createAssetAggregateTransaction = AssetsUtils.assetSupplyChangeTransaction(networkType, generationHash, mosaicId, changeType, supply, divisibility);
    const account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisSigAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress);
    const multisSigOther = walletState.currentLoggedInWallet.others.find((element) => element.address === multiSigAddress);
    const multisigPublicKey = multisSigAccount?multisSigAccount.publicKey:multisSigOther.publicKey;

    const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, networkType);
    const innerTxn = [createAssetAggregateTransaction.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    const aggregateBondedTxSigned = account.sign(aggregateBondedTx, generationHash);

    let hashLockTx = buildTransactions.hashLock(
      Helper.createAsset(networkState.currentNetworkProfile.network.currency.assetId, 10000000),
      Helper.createUint64FromNumber(200),
      aggregateBondedTxSigned
    );

    let signedHashlock = account.sign(hashLockTx, generationHash);
    AssetsUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);
  }

  static linkedNamespaceToAsset = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, mosaicIdString: string, namespaceString: string, linkType: string) => {
    const linkAssetToNamespaceTx = AssetsUtils.linkAssetToNamespaceTransaction(networkType, generationHash, mosaicIdString, namespaceString, linkType);
    const account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(linkAssetToNamespaceTx, networkState.currentNetworkProfile.generationHash);
    AssetsUtils.annouce(signedTx);
  }

  static linkedNamespaceToAssetMultiSig = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, mosaicIdString: string, namespaceString: string, linkType: string, multiSigAddress: string) => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    const linkAssetToNamespaceTx = AssetsUtils.linkAssetToNamespaceTransaction(networkType, generationHash, mosaicIdString, namespaceString, linkType);
    const account = AssetsUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisSigAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress);
    const multisSigOther = walletState.currentLoggedInWallet.others.find((element) => element.address === multiSigAddress);
    const multisigPublicKey = multisSigAccount?multisSigAccount.publicKey:multisSigOther.publicKey;

    const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, networkType);
    const innerTxn = [linkAssetToNamespaceTx.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    const aggregateBondedTxSigned = account.sign(aggregateBondedTx, generationHash);

    let hashLockTx = buildTransactions.hashLock(
      Helper.createAsset(networkState.currentNetworkProfile.network.currency.assetId, 10000000),
      Helper.createUint64FromNumber(200),
      aggregateBondedTxSigned
    );

    let signedHashlock = account.sign(hashLockTx, generationHash);
    AssetsUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);
  }

  static listActiveNamespacesToLink = (assetId: string, address:string, linkOption: string) => {
    // const accountNamespaces = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address).namespaces.filter(namespace => namespace.active === true);

    const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address);
    const accountNamespaces = account?account.namespaces.filter(namespace => namespace.active === true):[];
    const other = walletState.currentLoggedInWallet.others.find((account) => account.address === address);
    const otherNamespaces = other?other.namespaces.filter(namespace => namespace.active === true):[];

    let namespacesNum:number;
    let fetchedNamespace:Array<any>;

    if(accountNamespaces.length > 0){
      namespacesNum = accountNamespaces.length;
      fetchedNamespace = accountNamespaces;
    }else{
      namespacesNum = otherNamespaces.length;
      fetchedNamespace = otherNamespaces;
    }

    let namespacesArr = [];
    if(namespacesNum > 0){
      fetchedNamespace.forEach((namespaceElement) => {
        console.log(namespaceElement)
        const level = namespaceElement.name.split('.');
        let isDisabled: boolean;
        let label:string = '';
        let namespaceName:string = '';
        if(namespaceElement.linkedId != ''){
          let linkName:string;
          let linkLabel:string;

          switch (namespaceElement.linkType) {
            case 1:
              linkName = "Asset";
              linkLabel = namespaceElement.linkedId;
              isDisabled = (linkOption=='link'?true:false);
              break;
            case 2:
              linkName = "Address";
              linkLabel = Helper.createAddress(namespaceElement.linkedId).pretty()
              isDisabled = true;
              break;
            default:
              break;
          }

          label = namespaceElement.name + ' (Linked to ' + linkName + ') - ' + linkLabel;
          namespaceName = namespaceElement.name;
        }else{
          isDisabled = (linkOption=='link'?false:true);
          label = namespaceElement.name;
          namespaceName = namespaceElement.name;
        }
        if(linkOption == 'link'){
          namespacesArr.push({
            // value: namespaceElement.idHex,
            value: namespaceName,
            label: label,
            disabled: isDisabled,
            level: level
          });
        }
        if(linkOption == 'unlink' && namespaceElement.linkedId == assetId){
          namespacesArr.push({
            // value: namespaceElement.idHex,
            value: namespaceName,
            label: label,
            disabled: isDisabled,
            level: level
          });
        }
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

  static annouce = (signedTransaction:SignedTransaction ) => {
    let apiEndpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort);
    let chainAPICall = new ChainAPICall(apiEndpoint);
    chainAPICall.transactionAPI.announce(signedTransaction);
  }

  static multiSigAnnouce = (aggregateTx:SignedTransaction, hashSigned:SignedTransaction) => {
    let hashLockAutoAnnounceSignedTx = new AutoAnnounceSignedTransaction(hashSigned);
    hashLockAutoAnnounceSignedTx.announceAtBlock = listenerState.currentBlock + 1;

    let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(aggregateTx);
    autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(hashSigned.hash);
    autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
    autoAnnounceSignedTx.type = AnnounceType.BONDED;

    ListenerStateUtils.addAutoAnnounceSignedTransaction(hashLockAutoAnnounceSignedTx);
    ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);
  }
}

