// import { readonly, computed } from "vue";
import {
  NamespaceMosaicIdGenerator,
  NamespaceId,
  NetworkType,
  RegisterNamespaceTransaction,
  UInt64,
  MosaicId,
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
import { async } from "rxjs";


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
    console.log(namespacesArr)
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



  static listNamespacesToLink = async (address:string, actionType: string) => {
    const accountNamespaces = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address).namespaces.filter(namespace => namespace.active === true);
    const namespacesNum = accountNamespaces.length;

    interface namespaceOption{
      label: string,
      value: string,
      level: number,
    }

    if(namespacesNum > 0){
      // let namespacesArr = new Promise((resolve) => {
        const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
        // let namespaces = [];
        // accountNamespaces.forEach( (namespaceElement) => {
        //   // if(actionType=='link'){
        //   (async() => {  
        //     const nativeTokenNamespace = new NamespaceId(namespaceElement.name);
        //     let nativeNetworkMosaicId: MosaicId;
            
        //       try {
        //         nativeNetworkMosaicId = await chainAPICall.namespaceAPI.getLinkedMosaicId(nativeTokenNamespace);
        //       } catch(err) {
        //         nativeNetworkMosaicId = null;
        //       }
            
        //     let namespaceLabel: string;
        //     if(nativeNetworkMosaicId){
        //       namespaceLabel = namespaceElement.name + ' - (Linked to Asset) - ' + nativeNetworkMosaicId.toHex();
        //     }else{
        //       namespaceLabel = namespaceElement.name;
        //     }
          
        //   // }
        //   const level = namespaceElement.name.split('.');
        //   namespaces.push({
        //     value: namespaceElement.idHex,
        //     label: namespaceLabel,
        //     level: level.length
        //   });
        //   })();
        // });

        let namespaces:namespaceOption[] = await Promise.all(accountNamespaces.map(async (namespaceElement): Promise<namespaceOption> => {
          const level = namespaceElement.name.split('.');
          const nativeTokenNamespace = new NamespaceId(namespaceElement.name);
          let nativeNetworkMosaicId: MosaicId;
          try {
            nativeNetworkMosaicId = await chainAPICall.namespaceAPI.getLinkedMosaicId(nativeTokenNamespace);
          } catch(err) {
            nativeNetworkMosaicId = null;
          }
          let namespaceLabel: string;
          if(nativeNetworkMosaicId){
            namespaceLabel = namespaceElement.name + ' - (Linked to Asset) - ' + nativeNetworkMosaicId.toHex();
          }else{
            namespaceLabel = namespaceElement.name;
          }
          return {
            value: namespaceElement.idHex,
            label: namespaceLabel,
            level: level.length
          }
        }));

        namespaces.sort((a, b) => {
          if (a.label > b.label) return 1;
          if (a.label < b.label) return -1;
          return 0;
        });
        namespaces.sort((a, b) => {
          if (a.level > b.level) return 1;
          if (a.level < b.level) return -1;
          return 0;
        });
        return namespaces;
    //     resolve(namespaces);
    // });
    // let b = await namespacesArr.then(a => {
    //   return a;
    // });
    // return b;
    }else{
      return [];
    }
  }

}