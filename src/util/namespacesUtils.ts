// import { readonly, computed } from "vue";
import {
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


export class NamespacesUtils {

  // static async getAccInfo(address: Address, accountHttp: AccountHttp): Promise<AccountInfo> {

  //   const chainAPICall = new ChainAPICall(networkAPIEndpoint.value);

  //   const accountInfo = await chainAPICall.accountAPI.getAccountInfo(address);
  //   // console.log(publicKey);
  //   return accountInfo;
  // }

  static getTransactionFee =(networkType: NetworkType, generationHash: string, namespaceName: string, duration: number) :number => {
    let buildTransactions = new BuildTransactions(networkType, generationHash);
    const registerRootNamespaceTransaction = buildTransactions.registerRootNamespace(namespaceName, UInt64.fromUint(duration));
    return registerRootNamespaceTransaction.maxFee.compact();
  }

}