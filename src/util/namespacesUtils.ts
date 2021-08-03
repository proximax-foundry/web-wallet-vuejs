import { readonly, computed } from "vue";
import {
  Account,
  Address,
  NamespaceMosaicIdGenerator,
  NetworkType,
  RegisterNamespaceTransaction,
  TransactionBuilderFactory,
  UInt64,
} from "tsjs-xpx-chain-sdk";
// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';
import { walletState } from "../state/walletState";
import { networkState } from "../state/networkState";
import { ChainUtils } from "../util/chainUtils";
import { WalletUtils } from "../util/walletUtils";
import { ChainAPICall } from "../models/REST/chainAPICall";
import { BuildTransactions } from "../util/buildTransactions";
import { Helper } from "./typeHelper";
import { WalletAccount } from "@/models/walletAccount";


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

  static createRootNamespace = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, namespaceName: string, duration: number) => {
    let registerRootNamespaceTransaction = NamespacesUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    const accAddress = Address.createFromRawAddress(selectedAddress);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find((account) => account.address == accAddress.plain());
    const encryptedPassword = WalletUtils.createPassword(walletPassword);
    let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, accountDetails.encrypted, accountDetails.iv);
    const account = Account.createFromPrivateKey(privateKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
    let signedTx = account.sign(registerRootNamespaceTransaction, networkState.currentNetworkProfile.generationHash);
    let apiEndpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort);
    let chainAPICall = new ChainAPICall(apiEndpoint);
    chainAPICall.transactionAPI.announce(signedTx);
    return signedTx.hash;
  }

  static createSubNamespace = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, subNamespace: string, rootNamespace: string) => {
    // console.log('Root: ' + rootNamespace + ' Sub: ' + subNamespace);
    let registerSubNamespaceTransaction = NamespacesUtils.subNamespaceTransaction(networkType, generationHash, rootNamespace, subNamespace);
    const accAddress = Address.createFromRawAddress(selectedAddress);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find((account) => account.address == accAddress.plain());
    const encryptedPassword = WalletUtils.createPassword(walletPassword);
    let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, accountDetails.encrypted, accountDetails.iv);
    const account = Account.createFromPrivateKey(privateKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
    let signedTx = account.sign(registerSubNamespaceTransaction, networkState.currentNetworkProfile.generationHash);
    let apiEndpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort);
    let chainAPICall = new ChainAPICall(apiEndpoint);
    chainAPICall.transactionAPI.announce(signedTx);
    return signedTx.hash;
  }

  static extendNamespace = (selectedAddress: string, walletPassword: string, networkType: NetworkType, generationHash: string, namespaceName: string, duration: number) => {
    let registerRootNamespaceTransaction = NamespacesUtils.rootNamespaceTransaction(networkType, generationHash, namespaceName, duration);
    const accAddress = Address.createFromRawAddress(selectedAddress);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find((account) => account.address == accAddress.plain());
    const encryptedPassword = WalletUtils.createPassword(walletPassword);
    let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, accountDetails.encrypted, accountDetails.iv);
    const account = Account.createFromPrivateKey(privateKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
    let signedTx = account.sign(registerRootNamespaceTransaction, networkState.currentNetworkProfile.generationHash);
    let apiEndpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort);
    let chainAPICall = new ChainAPICall(apiEndpoint);
    chainAPICall.transactionAPI.announce(signedTx);
    return signedTx.hash;
  }
}