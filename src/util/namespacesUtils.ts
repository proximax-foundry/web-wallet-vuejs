// import { readonly, computed } from "vue";
import {
  NamespaceMosaicIdGenerator,
  NetworkType,
  RegisterNamespaceTransaction,
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

  static getRootNamespaceTransactionFee =(networkType: NetworkType, generationHash: string, namespaceName: string, duration: number) :number => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    const registerRootNamespaceTransaction = buildTransactions.registerRootNamespace(namespaceName, UInt64.fromUint(duration));
    return registerRootNamespaceTransaction.maxFee.compact();
  }

  static getSubNamespaceTransactionFee =(networkType: NetworkType, generationHash: string, namespaceName: string, subNamespace: string) :number => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    const registerSubNamespaceTransaction = buildTransactions.registersubNamespace(namespaceName, subNamespace);
    return registerSubNamespaceTransaction.maxFee.compact();
  }

  static calculateDuration = (duration: number): number =>{
    // 5760 = 4 * 60 * 24 -> 15sec per block
    return duration * 5760;
  }

  static listNamespaces = (address:string) => {
    const namespacesAccount = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address).namespaces.filter(namespace => namespace.active === true);
    const namespacesList = namespacesAccount.length;
    let namespacesArr = [];
    if(namespacesList > 0){
      namespacesAccount.forEach((namespaceElement) => {
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
    const namespacesAccount = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address).namespaces.filter(namespace => namespace.active === true);
    const namespacesList = namespacesAccount.length;
    let namespacesArr = [];
    if(namespacesList > 0){
      namespacesAccount.forEach((namespaceElement) => {
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
}