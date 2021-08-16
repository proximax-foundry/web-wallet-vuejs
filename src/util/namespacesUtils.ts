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


export class NamespacesUtils {

  static rootNamespaceTransaction = (networkType: NetworkType, generationHash: string, namespaceName: string, duration: number):RegisterNamespaceTransaction => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    return buildTransactions.registerRootNamespace(namespaceName, UInt64.fromUint(NamespacesUtils.calculateDuration(duration)));
  }

  static subNamespaceTransaction = (networkType: NetworkType, generationHash: string, rootNamespace: string, subNamespace: string):RegisterNamespaceTransaction => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    return buildTransactions.registersubNamespace(rootNamespace, subNamespace);
  }

  static getRootNamespaceTransactionFee = (networkType: NetworkType, generationHash: string, namespaceName: string, duration: number) :number => {
    let registerRootNamespaceTransaction = NamespacesUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    return registerRootNamespaceTransaction.maxFee.compact();
  }

  static getSubNamespaceTransactionFee = (networkType: NetworkType, generationHash: string, subNamespace: string, rootNamespace: string) :number => {
    let registerSubNamespaceTransaction = NamespacesUtils.subNamespaceTransaction(networkType, generationHash, rootNamespace, subNamespace);
    return registerSubNamespaceTransaction.maxFee.compact();
  }

  static calculateDuration = (durationInDay: number): number =>{
    // 5760 = 4 * 60 * 24 -> 15sec per block
    return durationInDay * 5760;
  }

  static listNamespaces = (address:string) => {
    const accountNamespaces = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address).namespaces.filter(namespace => namespace.active === true);
    const namespacesNum = accountNamespaces.length;
    let namespacesArr = [];
    if(namespacesNum > 0){
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
    const accountNamespaces = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address).namespaces.filter(namespace => namespace.active === true);
    const namespacesNum = accountNamespaces.length;
    let namespacesArr = [];
    if(namespacesNum > 0){
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
    let multiSig = account.getDirectParentMultisig();
    if(multiSig.length>0){
      const cosigner = walletState.currentLoggedInWallet.accounts.filter(account => {
        if(multiSig.indexOf(account.publicKey) >= 0 ){
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
    let registerRootNamespaceTransaction = NamespacesUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    const account = NamespacesUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(registerRootNamespaceTransaction, networkState.currentNetworkProfile.generationHash);
    NamespacesUtils.annouce(signedTx);
    return signedTx.hash;
  }

  static createSubNamespace = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, subNamespace: string, rootNamespace: string) => {
    let registerSubNamespaceTransaction = NamespacesUtils.subNamespaceTransaction(networkType, generationHash, rootNamespace, subNamespace);
    const account = NamespacesUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(registerSubNamespaceTransaction, networkState.currentNetworkProfile.generationHash);
    NamespacesUtils.annouce(signedTx);
  }

  static createRootNamespaceMultisig = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, namespaceName: string, duration: number, multiSigAddress:string) => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    let registerRootNamespaceTransaction = NamespacesUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    const account = NamespacesUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisigPublicKey = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress).publicKey;
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
    NamespacesUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);
  }

  static createSubNamespaceMultisig = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, subNamespace: string, rootNamespace: string, multiSigAddress:string) => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    let registerSubNamespaceTransaction = NamespacesUtils.subNamespaceTransaction(networkType, generationHash, rootNamespace, subNamespace);
    const account = NamespacesUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisigPublicKey = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress).publicKey;
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
    NamespacesUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);
  }

  static extendNamespace = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, namespaceName: string, duration: number) => {
    let extendNamespaceTx = NamespacesUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    const account = NamespacesUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(extendNamespaceTx, networkState.currentNetworkProfile.generationHash);
    NamespacesUtils.annouce(signedTx);
  }

  static extendNamespaceMultisig = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, namespaceName: string, duration: number, multiSigAddress:string) => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    let extendNamespaceTx = NamespacesUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    const account = NamespacesUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisigPublicKey = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress).publicKey;
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
    NamespacesUtils.multiSigAnnouce(aggregateBondedTxSigned, signedHashlock);
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