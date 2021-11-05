import { readonly, computed } from "vue";
import {
  Account,
  Address,
  AliasType,
  NamespaceMosaicIdGenerator,
  NamespaceId,
  NetworkType,
  PublicAccount,
  RegisterNamespaceTransaction,
  SignedTransaction,
  TransactionBuilderFactory,
  UInt64,
  MosaicId,
} from "tsjs-xpx-chain-sdk";
// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';
import { walletState } from "../state/walletState";
import { networkState } from "../state/networkState";
import { ChainUtils } from "../util/chainUtils";
import { WalletUtils } from "../util/walletUtils";
import { ChainAPICall } from "../models/REST/chainAPICall";
import { Namespace } from "@/models/namespace";
import { BuildTransactions } from "../util/buildTransactions";
import { Helper } from "./typeHelper";
import { WalletAccount } from "@/models/walletAccount";
import { AutoAnnounceSignedTransaction, HashAnnounceBlock, AnnounceType, listenerState } from "@/state/listenerState";
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";


export class NamespaceUtils {

  static async getLinkedMosaic(namespaceId: NamespaceId, endpoint: string): Promise<MosaicId>{
     let rest = new ChainAPICall(endpoint);
     let mosaicId = await rest.namespaceAPI.getLinkedMosaicId(namespaceId);

     return mosaicId;
  }

  static async getLinkedAddress(namespaceId: NamespaceId, endpoint: string): Promise<Address>{
    let rest = new ChainAPICall(endpoint);
    let address = await rest.namespaceAPI.getLinkedAddress(namespaceId);

    return address;
 }

  static rootNamespaceTransaction = (networkType: NetworkType, generationHash: string, namespaceName: string, duration: number):RegisterNamespaceTransaction => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    return buildTransactions.registerRootNamespace(namespaceName, UInt64.fromUint(NamespaceUtils.calculateDuration(duration)));
  }

  static subNamespaceTransaction = (networkType: NetworkType, generationHash: string, rootNamespace: string, subNamespace: string):RegisterNamespaceTransaction => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    return buildTransactions.registersubNamespace(rootNamespace, subNamespace);
  }

  static getRootNamespaceTransactionFee = (networkType: NetworkType, generationHash: string, namespaceName: string, duration: number) :number => {
    let registerRootNamespaceTransaction = NamespaceUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    return registerRootNamespaceTransaction.maxFee.compact();
  }

  static getSubNamespaceTransactionFee = (networkType: NetworkType, generationHash: string, subNamespace: string, rootNamespace: string) :number => {
    let registerSubNamespaceTransaction = NamespaceUtils.subNamespaceTransaction(networkType, generationHash, rootNamespace, subNamespace);
    return registerSubNamespaceTransaction.maxFee.compact();
  }

  static calculateDuration = (durationInDay: number): number =>{
    let chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
    chainConfig.init();
    let blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);
    let blockTargetTimeByDay = Math.floor((60 * 60 * 24) / blockTargetTime);
    // 5760 = 4 * 60 * 24 -> 15sec per block
    return durationInDay * blockTargetTimeByDay;
  }

  static listNamespaces = (address:string) => {
    const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address);
    const accountNamespaces = account?account.namespaces.filter(namespace => namespace.active === true):[];
    const other = walletState.currentLoggedInWallet.others.find((account) => account.address === address);
    const otherNamespaces = other?other.namespaces.filter(namespace => namespace.active === true):[];
    const accountNamespacesNum = accountNamespaces.length;
    const otherNamespacesNum = otherNamespaces.length;
    let namespacesArr = [];
    if((accountNamespacesNum + otherNamespacesNum) > 0){
      if(accountNamespacesNum > 0){
        accountNamespaces.forEach((namespaceElement) => {
          const level = namespaceElement.name.split('.');
          let isDisabled: boolean;
          if(level.length > 2){
            isDisabled = true;
          }else{
            isDisabled = false;
          }
          namespacesArr.push({
            value: namespaceElement.name,
            label: namespaceElement.name,
            disabled: isDisabled,
            level: level
          });
        });
      }

      if(otherNamespacesNum > 0){
        otherNamespaces.forEach((namespaceElement) => {
          const level = namespaceElement.name.split('.');
          let isDisabled: boolean;
          if(level.length > 2){
            isDisabled = true;
          }else{
            isDisabled = false;
          }
          namespacesArr.push({
            value: namespaceElement.name,
            label: namespaceElement.name,
            disabled: isDisabled,
            level: level
          });
        });
      }

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

  static listRootNamespaces = (address:string) => {
    const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address);
    const accountNamespaces = account?account.namespaces.filter(namespace => namespace.active === true):[];
    const other = walletState.currentLoggedInWallet.others.find((account) => account.address === address);
    const otherNamespaces = other?other.namespaces.filter(namespace => namespace.active === true):[];
    const accountNamespacesNum = accountNamespaces.length;
    const otherNamespacesNum = otherNamespaces.length;
    let namespacesArr = [];
    if((accountNamespacesNum + otherNamespacesNum) > 0){
      if(accountNamespacesNum > 0){
        accountNamespaces.forEach((namespaceElement) => {
          const level = namespaceElement.name.split('.');
          let isDisabled: boolean = false;
          if(level.length == 1){
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level
            });
          }
        });
      }

      if(otherNamespacesNum > 0){
        otherNamespaces.forEach((namespaceElement) => {
          const level = namespaceElement.name.split('.');
          let isDisabled: boolean = false;
          if(level.length == 1){
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level
            });
          }
        });
      }

      namespacesArr.sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      });
    }
    return namespacesArr;
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

  static getSenderAccount = (selectedAddress:string, walletPassword:string) :Account => {
    const accAddress = Address.createFromRawAddress(selectedAddress);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find((account) => account.address == accAddress.plain());
    const encryptedPassword = WalletUtils.createPassword(walletPassword);
    let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, accountDetails.encrypted, accountDetails.iv);
    const account = Account.createFromPrivateKey(privateKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
    return account;
  }

  static createRootNamespace = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, namespaceName: string, duration: number) => {
    let registerRootNamespaceTransaction = NamespaceUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(registerRootNamespaceTransaction, networkState.currentNetworkProfile.generationHash);
    NamespaceUtils.annouce(signedTx);
    return signedTx.hash;
  }

  static createSubNamespace = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, subNamespace: string, rootNamespace: string) => {
    let registerSubNamespaceTransaction = NamespaceUtils.subNamespaceTransaction(networkType, generationHash, rootNamespace, subNamespace);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(registerSubNamespaceTransaction, networkState.currentNetworkProfile.generationHash);
    NamespaceUtils.annouce(signedTx);
  }

  static createRootNamespaceMultisig = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, namespaceName: string, duration: number, multiSigAddress:string) => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    let registerRootNamespaceTransaction = NamespaceUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisSigAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress);
    const multisSigOther = walletState.currentLoggedInWallet.others.find((element) => element.address === multiSigAddress);
    const multisigPublicKey = multisSigAccount?multisSigAccount.publicKey:multisSigOther.publicKey;

    const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, networkType);
    const innerTxn = [registerRootNamespaceTransaction.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    const aggregateBondedTxSigned = account.sign(aggregateBondedTx, generationHash);

    let hashLockTx = buildTransactions.hashLock(
      Helper.createAsset(networkState.currentNetworkProfile.network.currency.assetId, 10000000),
      Helper.createUint64FromNumber(200),
      aggregateBondedTxSigned
    );

    let signedHashlock = account.sign(hashLockTx, generationHash);
    NamespaceUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);
  }

  static createSubNamespaceMultisig = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, subNamespace: string, rootNamespace: string, multiSigAddress:string) => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    let registerSubNamespaceTransaction = NamespaceUtils.subNamespaceTransaction(networkType, generationHash, rootNamespace, subNamespace);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisSigAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress);
    const multisSigOther = walletState.currentLoggedInWallet.others.find((element) => element.address === multiSigAddress);
    const multisigPublicKey = multisSigAccount?multisSigAccount.publicKey:multisSigOther.publicKey;

    const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, networkType);
    const innerTxn = [registerSubNamespaceTransaction.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    const aggregateBondedTxSigned = account.sign(aggregateBondedTx, generationHash);

    let hashLockTx = buildTransactions.hashLock(
      Helper.createAsset(networkState.currentNetworkProfile.network.currency.assetId, 10000000),
      Helper.createUint64FromNumber(200),
      aggregateBondedTxSigned
    );

    let signedHashlock = account.sign(hashLockTx, generationHash);
    NamespaceUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);
  }

  static extendNamespace = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, namespaceName: string, duration: number) => {
    let extendNamespaceTx = NamespaceUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(extendNamespaceTx, networkState.currentNetworkProfile.generationHash);
    NamespaceUtils.annouce(signedTx);
  }

  static extendNamespaceMultisig = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, namespaceName: string, duration: number, multiSigAddress:string) => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    let extendNamespaceTx = NamespaceUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisSigAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress);
    const multisSigOther = walletState.currentLoggedInWallet.others.find((element) => element.address === multiSigAddress);
    const multisigPublicKey = multisSigAccount?multisSigAccount.publicKey:multisSigOther.publicKey;

    const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, networkType);
    const innerTxn = [extendNamespaceTx.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    const aggregateBondedTxSigned = account.sign(aggregateBondedTx, generationHash);

    let hashLockTx = buildTransactions.hashLock(
      Helper.createAsset(networkState.currentNetworkProfile.network.currency.assetId, 10000000),
      Helper.createUint64FromNumber(200),
      aggregateBondedTxSigned
    );

    let signedHashlock = account.sign(hashLockTx, generationHash);
    NamespaceUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);
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