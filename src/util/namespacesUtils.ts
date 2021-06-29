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

  static calculateDuration = (durationInDay: number): number =>{
    // 5760 = 4 * 60 * 24 -> 15sec per block
    return durationInDay * 5760;
  }

  static listNamespaces = (address:string) => {
    const account:WalletAccount = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address);
    const namespacesAccount = account.namespaces.filter(namespace => namespace.active === true);
    const namespacesList:number = namespacesAccount.length;
    let namespacesArr = [];
    if(namespacesList > 0){
      namespacesAccount.forEach((namespaceElement) => {
        let level:number = 0;
        // check for level 2
        if(namespaceElement.parentId){
          const parentNamespace = account.namespaces.find(namespace => namespace.idHex == namespaceElement.parentId);
          if(parentNamespace){
            // check for level 3
            const grandparentNamespace = account.namespaces.find(namespace => namespace.idHex == parentNamespace.parentId);
            if(grandparentNamespace){
              level = 3;
            }else{
              level = 2;
            }
          }else{
            level = 1;
          }
        }else{
          level = 1;
        }
        let isDisabled: boolean;
        if(level > 2){
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
    const account:WalletAccount = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address);
    const namespacesAccount = account.namespaces.filter(namespace => namespace.active === true);
    const namespacesList:number = namespacesAccount.length;
    let namespacesArr = [];
    if(namespacesList > 0){
      namespacesAccount.forEach((namespaceElement) => {
        let level:number = 0;
        // check for level 2
        if(namespaceElement.parentId){
          const parentNamespace = account.namespaces.find(namespace => namespace.idHex == namespaceElement.parentId);
          if(parentNamespace){
            // check for level 3
            const grandparentNamespace = account.namespaces.find(namespace => namespace.idHex == parentNamespace.parentId);
            if(grandparentNamespace){
              level = 3;
            }else{
              level = 2;
            }
          }else{
            level = 1;
          }
        }else{
          level = 1;
        }
        let isDisabled: boolean;
        if(level > 2){
          isDisabled = true;
        }else{
          isDisabled = false;
        }
        if(level == 1){
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
}