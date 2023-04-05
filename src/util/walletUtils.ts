import { networkState } from "../state/networkState";
import { walletState } from "../state/walletState";
import { ChainUtils } from "../util/chainUtils";
import { Wallet } from "../models/wallet";
import { Wallets } from "../models/wallets";
import { WalletAccount } from "../models/walletAccount";
import { nis1Account } from "../models/nis1Account";
import type { ChainProfile } from "../models/stores/chainProfile";
import { Asset } from "../models/asset";
import { ChainAPICall } from "../models/REST/chainAPICall";
import type { SecretKeyPair } from "../models/interface/secretKeyPair";
import { MultisigInfo } from "../models/multisigInfo";
import { knownToken } from "../models/sirius";
import { bignumber } from "mathjs";
import {
  SimpleWallet,
  Password,
  RawAddress,
  Convert,
  Crypto,
  WalletAlgorithm,
  PublicAccount,
  Account,
  NetworkType,
  AggregateTransaction,
  CosignatureTransaction,
  NamespaceInfo,
  NamespaceId,
  Address,
  AccountInfo,
  MosaicId,
  AliasType,
  MultisigAccountGraphInfo,
  MosaicInfo,
  TransactionQueryParams,
  TransactionGroupType,
  TransactionSearch,
  MosaicSearch,
  MosaicQueryParams,
  MosaicNames,
  Order_v2,
  TransactionSortingField,
  MosaicCreatorFilters,
  LinkAction,
} from "tsjs-xpx-chain-sdk";
import { Helper, type LooseObject } from "./typeHelper";
import { WalletStateUtils } from "@/state/utils/walletStateUtils";
import { OtherAccount } from "@/models/otherAccount";
import { Namespace } from "@/models/namespace";
import type { Account as MyAccount } from "@/models/account";
import { TransactionUtils } from "./transactionUtils";
import { AddressBook } from "@/models/addressBook";
import { AppState } from "@/state/appState";
import { Label } from "@/models/label";
import { AssetInfo } from "@/models/assetInfo";
import { OtherAcountType } from "@/models/const/otherAccountType";

const dataPerRequest = 50;
const assetInfoSessionKey = "assetsInfo";
const namespaceInfoSessionKey = "namespacesInfo";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface AccountAssetHold {
  publicKey: string;
  totalPages: number;
  totalEntries: number;
  currentPage: number;
  assetsInfo: AssetInfo[];
}

interface CreatorAssets {
  publicKey: string;
  assetsInfo: AssetInfo[];
}

export class WalletUtils {
  static async walletAssetsInfoSync(wallet: Wallet) {
    const idsHex = AppState.assetsInfo.map((x) => x.idHex);

    for (let i = 0; i < wallet.accounts.length; ++i) {
      for (let y = 0; y < wallet.accounts[i].assets.length; ++y) {
        const newAsset = wallet.accounts[i].assets[y];
        const assetIdHex = wallet.accounts[i].assets[y].idHex;
        const index = idsHex.indexOf(assetIdHex);

        if (index > -1) {
          const knowAssetInfo = AppState.assetsInfo[index];

          if (knowAssetInfo) {
            WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
            newAsset.updateExactAmount();
            newAsset.updateExpirationBlock();
          }
        } else {
          AppState.pendingAssetsInfo.push(assetIdHex);
        }
      }
    }

    for (let i = 0; i < wallet.others.length; ++i) {
      for (let y = 0; y < wallet.others[i].assets.length; ++y) {
        const newAsset = wallet.others[i].assets[y];
        const assetIdHex = wallet.others[i].assets[y].idHex;

        const index = idsHex.indexOf(assetIdHex);

        if (index > -1) {
          const knowAssetInfo = AppState.assetsInfo[index];

          if (knowAssetInfo) {
            WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
            newAsset.updateExactAmount();
            newAsset.updateExpirationBlock();
          }
        } else {
          AppState.pendingAssetsInfo.push(assetIdHex);
        }

        // if(y !== 0 && y % 50 === 0){
        //     await delay(50);
        // }
      }
    }
  }

  static checkDuplicateNamespace() {
    const idNamespacesOrigin = AppState.namespacesInfo.map((x) => x.idHex);
    const idNamespaces = Array.from(
      new Set(AppState.namespacesInfo.map((x) => x.idHex))
    );

    if (idNamespacesOrigin.length === idNamespaces.length) {
      return;
    }

    const namespaces: Namespace[] = [];

    for (let i = 0; i < idNamespaces.length; ++i) {
      const index = idNamespacesOrigin.indexOf(idNamespaces[i]);

      if (index > -1) {
        const namespace = AppState.namespacesInfo[index];

        namespaces.push(namespace);
      }
    }

    AppState.namespacesInfo = namespaces;
    sessionStorage.setItem(namespaceInfoSessionKey, JSON.stringify(namespaces));
  }

  static checkDuplicateAssetInfo() {
    const idAssetsOrigin = AppState.assetsInfo.map((x) => x.idHex);
    const idAssets = Array.from(
      new Set(AppState.assetsInfo.map((x) => x.idHex))
    );

    if (idAssetsOrigin.length === idAssets.length) {
      return;
    }

    const assetsInfo: AssetInfo[] = [];

    for (let i = 0; i < idAssets.length; ++i) {
      const index = idAssetsOrigin.indexOf(idAssets[i]);

      if (index > -1) {
        const assetInfo = AppState.assetsInfo[index];
        assetsInfo.push(assetInfo);
      }
    }

    AppState.assetsInfo = assetsInfo;
    sessionStorage.setItem(assetInfoSessionKey, JSON.stringify(assetsInfo));
  }

  static syncAccNamespaceName() {
    if (walletState.currentLoggedInWallet === null) {
      throw new Error("Service unavailable");
    }

    const wallet = walletState.currentLoggedInWallet;

    const namespaces = AppState.namespacesInfo;

    for (let i = 0; i < wallet.accounts.length; ++i) {
      const assetList = wallet.accounts[i].assets;

      for (let y = 0; y < assetList.length; ++y) {
        const namespaceAlias = namespaces.filter(
          (x) => x.linkedId === assetList[y].idHex
        );

          assetList[y].namespaceNames = namespaceAlias.map((x) => x.name);
      }

      // let namespace = namespaces.find(x => x.linkedId === wallet.accounts[i].address);

      // if(namespace){
      //     wallet.accounts[i] = [namespace.name];
      // }
    }

    for (let i = 0; i < wallet.others.length; ++i) {
      const assetList = wallet.others[i].assets;

      for (let y = 0; y < assetList.length; ++y) {
        const namespaceAlias = namespaces.filter(
          (x) => x.linkedId === assetList[y].idHex
        );


        assetList[y].namespaceNames = namespaceAlias.map((x) => x.name);
      }
    }
  }

  static async updateAccTxnEntries(accs: MyAccount[]) {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const txnQP = new TransactionQueryParams();

    txnQP.pageSize = 10;
    txnQP.embedded = true;
    txnQP.sortField = TransactionSortingField.BLOCK;
    txnQP.order = Order_v2.DESC;

    const allPubKey = accs.map((x) => x.publicKey);
    let txnSearchResults: TransactionSearch[] = [];

    let requests = [];

    for (let i = 0; i < allPubKey.length; ++i) {
      try {
        txnQP.publicKey = allPubKey[i];
        requests.push(
          AppState.chainAPI.transactionAPI.searchTransactions(
            TransactionGroupType.CONFIRMED,
            txnQP
          )
        );

        if (requests.length === 50) {
          const tempResults = await Promise.all<TransactionSearch>(requests);

          txnSearchResults = txnSearchResults.concat(tempResults);

          requests = [];
          await delay(250);
        }
      } catch (error) {
        continue;
      }
    }

    if (requests.length) {
      const tempResults = await Promise.all<TransactionSearch>(requests);

      txnSearchResults = txnSearchResults.concat(tempResults);

      requests = [];
    }

    for (let i = 0; i < txnSearchResults.length; ++i) {
      const queryingPublicKey = allPubKey[i];
      const totalEntries = txnSearchResults[i].pagination.totalEntries;

      const acc = accs.find((x) => x.publicKey === queryingPublicKey);
      if (acc) {
        acc.totalTxns = totalEntries;
      }
    }
  }

  static async transactionConfirmed(txnHashes: string[]) {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    if (txnHashes.length === 0) {
      return;
    }

    const confirmedTransactions =
      await AppState.chainAPI.transactionAPI.getTransactions(txnHashes);

    let relatedAddress: string[] = [];

    for (let i = 0; i < confirmedTransactions.length; ++i) {
      const txn = confirmedTransactions[i];

      const addresses =
        TransactionUtils.extractConfirmedRelatedAddressByTransactionType(txn);

      relatedAddress = relatedAddress.concat(addresses.map((x) => x.plain()));
    }

    if (walletState.currentLoggedInWallet === null) {
      throw new Error("Service unavailable");
    }

    const wallet = walletState.currentLoggedInWallet;

    const relatedWalletAccs = wallet.accounts.filter((x) =>
      relatedAddress.includes(x.address)
    );
    const relatedOtherAccs = wallet.others.filter((x) =>
      relatedAddress.includes(x.address)
    );
    const allAccounts: MyAccount[] = relatedWalletAccs
      .map((x) => x as MyAccount)
      .concat(relatedOtherAccs.map((x) => x as MyAccount));

    WalletUtils.updateAccTxnEntries(allAccounts);

    WalletUtils.confirmedTransactionRefresh(allAccounts);
  }

  static updateAllAccountsAssetNamespace(changedAssetId: string[]) {
    if (walletState.currentLoggedInWallet === null) {
      throw new Error("Service unavailable");
    }

    const assetsInfo = AppState.assetsInfo.filter((x) =>
      changedAssetId.includes(x.idHex)
    );
    const wallet = walletState.currentLoggedInWallet;

    for (let i = 0; i < wallet.accounts.length; ++i) {
      for (let y = 0; y < wallet.accounts[i].assets.length; ++y) {
        const assetId = wallet.accounts[i].assets[y].idHex;

        if (!changedAssetId.includes(assetId)) {
          continue;
        }

        const assetInfo = assetsInfo.find((x) => x.idHex === assetId);

        if (assetInfo) {
          wallet.accounts[i].assets[y].namespaceNames =
            assetInfo.namespaceNames;
        }
      }
    }

    for (let i = 0; i < wallet.others.length; ++i) {
      for (let y = 0; y < wallet.others[i].assets.length; ++y) {
        const assetId = wallet.others[i].assets[y].idHex;

        if (!changedAssetId.includes(assetId)) {
          continue;
        }

        const assetInfo = assetsInfo.find((x) => x.idHex === assetId);

        if (assetInfo) {
          wallet.others[i].assets[y].namespaceNames = assetInfo.namespaceNames;
        }
      }
    }
  }

  static getAllAccs(wallet: Wallet): MyAccount[] {
    const accs = wallet.accounts.map((x) => x as MyAccount);
    const othersAcc = wallet.others.map((x) => x as MyAccount);

    return accs.concat(othersAcc);
  }

  static async recheckAssetsNames() {
    if (walletState.currentLoggedInWallet === null) {
      throw new Error("Service unavailable");
    }
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }

    const wallet = walletState.currentLoggedInWallet;

    const accs = WalletUtils.getAllAccs(wallet);
    const accsPubKey = accs.map((x) => x.publicKey);
    const nonCreatorAssetsInfo = AppState.assetsInfo.filter((x) => {
      if (!x.creator) {
        throw new Error("Service unavailable");
      }
      return !accsPubKey.includes(x.creator);
    });
    const data = nonCreatorAssetsInfo.map((x) => new MosaicId(x.idHex));
    const dataPlain = nonCreatorAssetsInfo.map((x) => x.idHex);

    const numOfRequest = Math.ceil(data.length / dataPerRequest);

    const changedAssetId: string[] = [];

    const assetsInfoIdHex = AppState.assetsInfo.map((x) => x.idHex);

    for (let i = 0; i < numOfRequest; ++i) {
      const startIndex = i * dataPerRequest;
      const endIndex = (i + 1) * dataPerRequest;

      const requestData: MosaicId[] = data.slice(startIndex, endIndex);
      const requestDataPlain = dataPlain.slice(startIndex, endIndex);

      try {
        const tempAssetNames = await AppState.chainAPI.assetAPI.getMosaicsNames(
          requestData
        );

        const foundAssetIds: string[] = [];

        for (let y = 0; y < tempAssetNames.length; ++y) {
          const currentAssetId = tempAssetNames[i].mosaicId.toHex();

          foundAssetIds.push(currentAssetId);

          const index = assetsInfoIdHex.indexOf(currentAssetId);

          if (index > -1) {
            const assetInfo = AppState.assetsInfo[index];
            const oldNames = assetInfo.namespaceNames.join(",");

            assetInfo.namespaceNames = tempAssetNames[i].names.map(
              (x) => x.name
            );

            const newNames = assetInfo.namespaceNames.join(",");

            if (oldNames !== newNames) {
              changedAssetId.push(currentAssetId);
            }
          }
        }

        const notFoundAssetId = requestDataPlain.filter(
          (x) => !foundAssetIds.includes(x)
        );

        for (let i = 0; i < notFoundAssetId.length; ++i) {
          const index = assetsInfoIdHex.indexOf(notFoundAssetId[i]);

          if (index > -1) {
            const assetInfo = AppState.assetsInfo[index];
            const oldNames = assetInfo.namespaceNames.join(",");

            assetInfo.namespaceNames = [];

            const newNames = assetInfo.namespaceNames.join(",");

            if (oldNames !== newNames) {
              changedAssetId.push(notFoundAssetId[i]);
            }
          }
        }
      } catch (error) {
        continue;
      }
    }

    WalletUtils.updateAllAccountsAssetNamespace(changedAssetId);
  }

  static checkRemovedMultisig(otherAccounts: OtherAccount[]): string[] {
    if (walletState.currentLoggedInWallet === null) {
      throw new Error("Service unavailable");
    }

    const pubKeyNeedToRemove: string[] = [];

    const allAccountsPubKey = walletState.currentLoggedInWallet.accounts.map(
      (x) => x.publicKey
    );

    for (let i = 0; i < otherAccounts.length; ++i) {
      const directCosigners = otherAccounts[i].getDirectParentMultisig();
      const foundCosigners = allAccountsPubKey.filter((value) =>
        directCosigners.includes(value)
      );

      if (foundCosigners.length === 0) {
        pubKeyNeedToRemove.push(otherAccounts[i].publicKey);
      }
    }

    return pubKeyNeedToRemove;
  }

  static async checkConfirmedTxnChecking() {
    if (walletState.currentLoggedInWallet === null) {
      throw new Error("Service unavailable");
    }
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }

    const txnQP = new TransactionQueryParams();

    txnQP.pageSize = 10;
    txnQP.embedded = true;
    txnQP.sortField = TransactionSortingField.BLOCK;
    txnQP.order = Order_v2.DESC;

    const accAccount = walletState.currentLoggedInWallet.accounts.map(
      (x) => x as MyAccount
    );
    const otherAccount = walletState.currentLoggedInWallet.others.map(
      (x) => x as MyAccount
    );
    const allAccounts: MyAccount[] = accAccount.concat(otherAccount);
    const allPubKey = allAccounts.map((x) => x.publicKey);
    let txnSearchResults: TransactionSearch[] = [];

    let requests = [];

    for (let i = 0; i < allPubKey.length; ++i) {
      try {
        txnQP.publicKey = allPubKey[i];
        requests.push(
          AppState.chainAPI.transactionAPI.searchTransactions(
            TransactionGroupType.CONFIRMED,
            txnQP
          )
        );

        if (requests.length === 50) {
          const tempResults = await Promise.all<TransactionSearch>(requests);

          txnSearchResults = txnSearchResults.concat(tempResults);

          requests = [];
          await delay(250);
        }
      } catch (error) {
        continue;
      }
    }

    if (requests.length) {
      const tempResults = await Promise.all<TransactionSearch>(requests);

      txnSearchResults = txnSearchResults.concat(tempResults);

      requests = [];
    }

    const accsNeedUpdate: MyAccount[] = [];

    for (let i = 0; i < txnSearchResults.length; ++i) {
      const queryingPublicKey = allPubKey[i];
      const totalEntries = txnSearchResults[i].pagination.totalEntries;

      const acc = allAccounts.find((x) => x.publicKey === queryingPublicKey);
      if (!acc) {
        throw new Error("Account not found");
      }
      if (acc.totalTxns !== -1 && acc.totalTxns !== totalEntries) {
        accsNeedUpdate.push(acc);
      }

      acc.totalTxns = totalEntries;
    }

    WalletUtils.confirmedTransactionRefresh(accsNeedUpdate);
  }

  static checkLoadedDataUsable(networkName: string) {
    const sessionLastNetworkName = sessionStorage.getItem("lastNetworkName");

    if (sessionLastNetworkName && sessionLastNetworkName !== networkName) {
      AppState.assetsInfo = [];
      AppState.namespacesInfo = [];
      AppState.pendingAssetsInfo = [];
      AppState.pendingNamespacesName = [];

      if (sessionStorage.getItem(assetInfoSessionKey)) {
        sessionStorage.removeItem(assetInfoSessionKey);
      }

      if (sessionStorage.getItem(namespaceInfoSessionKey)) {
        sessionStorage.removeItem(namespaceInfoSessionKey);
      }
    }
  }

  static verifyWalletPassword(
    name: string,
    networkName: string,
    password: string
  ): boolean {
    const wallet = walletState.wallets.filterByNetworkNameAndName(
      networkName,
      name
    );
    if(!wallet){
      return false
    }

    const account = wallet.accounts[0];

    const common: SecretKeyPair = {
      password: password,
      privateKey: "",
    };

    if (account) {
      if (
        !Crypto.passwordToPrivateKey(
          common,
          account,
          account.algo == "pass:bip32"
            ? WalletAlgorithm.Pass_bip32
            : account.algo
        )
      ) {
        console.log("fail");
        return false;
      } else {
        if (!ChainUtils.isPrivateKeyValid(common.privateKey)) {
          console.log("Not valid private key");
          return false;
        } else {
          const checkingAddress = Account.createFromPrivateKey(
            common.privateKey,
            AppState.networkType
          ).address.plain();

          if (checkingAddress !== account.address) {
            return false;
          }
        }
      }
      return true;
    }

    return false;
  }

  static getAggregateBondedTransactions = (
    publicAccount: PublicAccount
  ): Promise<AggregateTransaction[]> => {
    if (!networkState.currentNetworkProfile) {
      throw new Error("Service unavailable");
    }
    const chainAPICall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(
        networkState.selectedAPIEndpoint,
        networkState.currentNetworkProfile.httpPort
      )
    );
    return new Promise((resolve, reject) => {
      try {
        const txnQueryParams = new TransactionQueryParams();
        txnQueryParams.pageSize = 100;
        chainAPICall.accountAPI
          .aggregateBondedTransactions(publicAccount, txnQueryParams)
          .then((transactions) => {
            resolve(transactions);
          })
          .catch((error) => {
            console.warn(error);
            reject(false);
          });
      } catch (err) {
        console.warn(err);
        reject(false);
      }
    });
  };

  static getMultisigAccGraphInfo(
    address: Address
  ): Promise<MultisigAccountGraphInfo> {
    if (!networkState.currentNetworkProfile) {
      throw new Error("Service unavailable");
    }
    const chainAPICall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(
        networkState.selectedAPIEndpoint,
        networkState.currentNetworkProfile.httpPort
      )
    );
    return new Promise((resolve, reject) => {
      try {
        chainAPICall.accountAPI
          .getMultisigAccountGraphInfo(address)
          .then((accountInfo) => {
            resolve(accountInfo);
          })
          .catch((error) => {
            console.warn(error);
            reject(false);
          });
      } catch (err) {
        console.warn(err);
        reject(false);
      }
    });
  }

  static getAccInfo(add: string): Promise<AccountInfo> {
    if (!networkState.currentNetworkProfile) {
      throw new Error("Service unavailable");
    }
    const chainAPICall = new ChainAPICall(
      ChainUtils.buildAPIEndpoint(
        networkState.selectedAPIEndpoint,
        networkState.currentNetworkProfile.httpPort
      )
    );
    const address = Address.createFromRawAddress(add);
    return new Promise((resolve, reject) => {
      try {
        chainAPICall.accountAPI
          .getAccountInfo(address)
          .then((accountInfo) => {
            resolve(accountInfo);
          })
          .catch((error) => {
            console.warn(error);
            reject(false);
          });
      } catch (err) {
        console.warn(err);
        reject(false);
      }
    });
  }

  /**
   *
   *
   * @param {*} address
   * @returns
   */
  static createAddressFromEncode(address: string): Address {
    return Address.createFromRawAddress(
      RawAddress.addressToString(Convert.hexToUint8(address))
    );
  }

  /**
   *
   *
   * @param {string} walletName
   * @param {Password} password
   * @param {number} network
   * @returns {SimpleWallet}
   */
  static createAccountSimple(
    walletName: string,
    password: Password,
    network: NetworkType
  ): SimpleWallet {
    return SimpleWallet.create(walletName, password, network);
  }

  static createAccountSimpleFromPrivateKey(
    walletName: string,
    password: Password,
    privateKey: string,
    network: NetworkType
  ): SimpleWallet {
    return SimpleWallet.createFromPrivateKey(
      walletName,
      password,
      privateKey,
      network
    );
  }

  static createAccountSimpleFromEncryptedPrivateKey(
    walletName: string,
    encryptedPrivateKey: string,
    iv: string,
    publicKey: string,
    network: NetworkType
  ): SimpleWallet {
    return SimpleWallet.createFromEncryptedKey(
      walletName,
      encryptedPrivateKey,
      iv,
      publicKey,
      network
    );
  }

  /**
   *
   *
   * @param {string} value
   * @returns {Password}
   */
  static createPassword(value: string): Password {
    return new Password(value);
  }

  /**
   * Create account
   * @param {string} privateKey
   * @param {NetworkType} network
   * @returns {Account}
   */
  static createAccountFromPrivateKey(
    privateKey: string,
    network: NetworkType
  ): Account {
    return Account.createFromPrivateKey(privateKey, network);
  }

  /**
   *
   *
   * @param {Password} password
   * @param {string} encryptedKey
   * @param {string} iv
   * @returns {string}
   */
  static decryptPrivateKey(
    password: Password,
    encryptedKey: string,
    iv: string
  ): string {
    const common: commonInterface = {
      password: password.value,
      privateKey: "",
    };

    const wallet: { encrypted: string; iv: string } = {
      encrypted: encryptedKey,
      iv,
    };

    Crypto.passwordToPrivateKey(common, wallet, WalletAlgorithm.Pass_bip32);
    return common.privateKey;
  }

  /**
   * Check if Address it is correct
   * @param privateKey privateKey
   * @param address address
   * @return checkAddress
   */
  static checkAddress(
    privateKey: string,
    net: NetworkType,
    address: string
  ): boolean {
    return Account.createFromPrivateKey(privateKey, net).address.plain() ===
      address
      ? true
      : false;
  }

  static createPublicAccount(
    publicKey: string,
    network: NetworkType
  ): PublicAccount {
    return PublicAccount.createFromPublicKey(publicKey, network);
  }

  static createAddressFromPublicKey(
    publicKey: string,
    networkType: NetworkType
  ): Address {
    return Address.createFromPublicKey(publicKey, networkType);
  }

  static cosignAggregateBondedTransaction(
    transaction: AggregateTransaction,
    account: Account
  ) {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const cosignatureTransaction = CosignatureTransaction.create(transaction);

    return AppState.chainAPI.transactionAPI.announceAggregateBondedCosignature(
      account.signCosignatureTransaction(cosignatureTransaction)
    );
  }

  static createFromRawAddress(address: string): Address {
    return Address.createFromRawAddress(address);
  }

  static getPublicAccountFromPrivateKey(
    privateKey: string,
    net: NetworkType
  ): PublicAccount {
    return Account.createFromPrivateKey(privateKey, net).publicAccount;
  }

  static generateNewAccount(network: NetworkType): Account {
    return Account.generateNewAccount(network);
  }

  static getNamespaceId(id: string | number[]): NamespaceId {
    return new NamespaceId(id);
  }

  static getMosaicId(id: string | number[]): MosaicId {
    return new MosaicId(id);
  }

  static isHexString(data: string): boolean {
    return Convert.isHexString(data);
  }

  /**
     *
     * @returns {boolean}
  
     */
  static isPrivateNet(network: NetworkType): boolean {
    return (
      network === NetworkType.PRIVATE || network === NetworkType.PRIVATE_TEST
    );
  }

  /**
     *
     *
     * @param {string} data
     * @returns
  
     */
  static isValidKeyPublicPrivate(data: string): boolean {
    if (data !== null && data.length === 64) {
      return this.isHexString(data);
    } else {
      return false;
    }
  }

  /**
     *
     *
     * @param {string} address
     * @returns
  
     */
  static validateAddress(address: string): boolean {
    if (address !== "") {
      const addressTrimAndUpperCase = address
        .trim()
        .toUpperCase()
        .replace(/-/g, "");
      if (addressTrimAndUpperCase.length === 40) {
        if (address.charAt(0) === "S") {
          return true;
        } else if (address.charAt(0) === "M") {
          return true;
        } else if (address.charAt(0) === "V") {
          return true;
        } else if (address.charAt(0) === "X") {
          return true;
        } else if (address.charAt(0) === "W") {
          return true;
        } else if (address.charAt(0) === "Z") {
          return true;
        }
      }
    }

    return false;
  }

  /**
     *
     *
     * @param {string} value
     * @param {string} value2
     * @returns
  
     */
  static verifyNetworkAddressEqualsNetwork(
    value: string,
    value2: string
  ): boolean {
    if (
      (value.length === 40 || value.length === 46) &&
      (value2.length === 40 || value2.length === 46)
    ) {
      if (value.charAt(0) === "S" && value2.charAt(0) === "S") {
        // NetworkType.MIJIN_TEST
        return true;
      } else if (value.charAt(0) === "M" && value2.charAt(0) === "M") {
        // NetworkType.MIJIN
        return true;
      } else if (value.charAt(0) === "V" && value2.charAt(0) === "V") {
        // NetworkType.TEST_NET
        return true;
      } else if (value.charAt(0) === "X" && value2.charAt(0) === "X") {
        // NetworkType.MAIN_NET
        return true;
      } else if (value.charAt(0) === "W" && value2.charAt(0) === "W") {
        // NetworkType.PRIVATE_TEST
        return true;
      } else if (value.charAt(0) === "Z" && value2.charAt(0) === "Z") {
        // NetworkType.PRIVATE
        return true;
      } else {
        // Address Network unsupported
        return false;
      }
    }
    return false;
  }

  /**
     *
     *
     * @returns {WalletAlgorithm}
  
     */
  static getWalletAlgorithm(): typeof WalletAlgorithm {
    return WalletAlgorithm;
  }

  static importWltOldFormat(
    wallets: Wallets,
    parsedObj: any,
    networkName: string,
    networkType: NetworkType
  ): void {
    const wltFile: oldWltFile = parsedObj;

    if (wallets.filterByNetworkNameAndName(networkName, wltFile.name)) {
      const error = new Error("Wallet with same name already exist");
      error.name = "SAME_NAME";
      throw error;
    }

    const walletAccounts: WalletAccount[] = [];

    wltFile.accounts
      .filter((acc) => acc.encrypted)
      .forEach((account) => {
        const walletAccount = new WalletAccount(
          account.name,
          account.publicAccount.publicKey,
          account.publicAccount.address.address,
          account.algo,
          account.encrypted,
          account.iv
        );

        if (account.nis1Account) {
          walletAccount.nis1Account = new nis1Account(
            account.nis1Account.address,
            account.nis1Account.publicKey
          );
        }

        walletAccount.default = account.default;
        walletAccount.isBrain = account.brain;
        walletAccount.fixAddress(networkType);
        walletAccounts.push(walletAccount);
      });

    const newWallet = new Wallet(wltFile.name, networkName, walletAccounts);

    wallets.wallets.push(newWallet);

    wallets.savetoLocalStorage();
  }

  static importWalletNewFormat(
    wallets: Wallets,
    parsedObj: any,
    networkName: string,
    networkType: NetworkType
  ): void {
    const wltFile: Wallet = parsedObj;

    if (wallets.filterByNetworkNameAndName(networkName, wltFile.name)) {
      const error = new Error("Wallet with same name already exist");
      error.name = "SAME_NAME";
      throw error;
    }

    const walletAccounts: WalletAccount[] = [];

    wltFile.accounts.forEach((account) => {
      const walletAccount = new WalletAccount(
        account.name,
        account.publicKey,
        account.address,
        account.algo,
        account.encrypted,
        account.iv
      );

      if (account.nis1Account) {
        walletAccount.nis1Account = new nis1Account(
          account.nis1Account.address,
          account.nis1Account.publicKey
        );
      }

      walletAccount.default = account.default;
      walletAccount.isBrain = account.isBrain;

      walletAccount.fixAddress(networkType);

      walletAccounts.push(walletAccount);
    });

    const newWallet = new Wallet(wltFile.name, networkName, walletAccounts);

    if (Array.isArray(wltFile.contacts)) {
      try {
        for (let i = 0; i < wltFile.contacts.length; ++i) {
          const group = wltFile.contacts[i].group
            ? wltFile.contacts[i].group
            : "";
          const newAddressBook = new AddressBook(
            wltFile.contacts[i].name,
            wltFile.contacts[i].address,
            group
          );
          newWallet.addAddressBook(newAddressBook);
        }
      } catch (error) {}
    }

    if (Array.isArray(wltFile.labels)) {
      try {
        for (let i = 0; i < wltFile.labels.length; ++i) {
          const newLabel = new Label(
            wltFile.labels[i].name,
            wltFile.labels[i].addresses
          );
          newWallet.addLabel(newLabel);
        }
      } catch (error) {}
    }

    wallets.wallets.push(newWallet);

    wallets.savetoLocalStorage();
  }

  static createNewWalletAccountFromOldFormat(
    jsonString: string
  ): WalletAccount {
    const wltAccount: oldAccountStructure = JSON.parse(jsonString);

    const walletAccount = new WalletAccount(
      wltAccount.name,
      wltAccount.publicAccount.publicKey,
      wltAccount.publicAccount.address.address,
      wltAccount.algo,
      wltAccount.encrypted,
      wltAccount.iv
    );

    if (wltAccount.nis1Account) {
      walletAccount.nis1Account = new nis1Account(
        wltAccount.nis1Account.address,
        wltAccount.nis1Account.publicKey
      );
    }

    walletAccount.default = wltAccount.default;
    walletAccount.isBrain = wltAccount.brain;

    return walletAccount;
  }

  static checkIsNewFormat(base64Wlt: any): boolean {
    const wltFile: Wallet = base64Wlt; //Helper.base64decode(base64Wlt);

    if (wltFile.accounts[0].publicKey) {
      return true;
    } else {
      return false;
    }
  }

  static checkIsNewFormatAccountRaw(jsonString: string): boolean {
    const account: LooseObject = JSON.parse(jsonString);

    if (account.publicKey) {
      return true;
    } else {
      return false;
    }
  }

  static export(wallet: Wallet): string {
    const exportingData = wallet.convertToSimpleWallet();

    const walletJSON = JSON.stringify(exportingData);
    const wordArray = Helper.base64decode(walletJSON);
    return Helper.base64encode(wordArray);
  }

  static exportAccount(wallet: Wallet, exportingPublicKey: string): string {
    const dataToExport = wallet.convertToSimpleWallet();

    dataToExport.accounts = dataToExport.accounts.filter(
      (acc) => acc.publicKey === exportingPublicKey
    );

    const walletJSON = JSON.stringify(dataToExport);
    const wordArray = Helper.base64decode(walletJSON);
    return Helper.base64encode(wordArray);
  }

  static async updateWalletMultisigInfo(wallet: Wallet): Promise<void> {
    for (let i = 0; i < wallet.accounts.length; ++i) {
      try {
        const multisigInfo: MultisigInfo[] =
          await WalletUtils.getMultisigDetails(wallet.accounts[i].address);

        wallet.accounts[i].multisigInfo = multisigInfo;
      } catch (error) {
        const multisigInfo: MultisigInfo[] = [];
        multisigInfo.push(
          new MultisigInfo(wallet.accounts[i].publicKey, 0, [], [], 0, 0)
        );
        wallet.accounts[i].multisigInfo = multisigInfo;
      }
    }
  }

  static updateMultisigsDetails(walletAccounts: WalletAccount[]): void {
    for (let i = 0; i < walletAccounts.length; ++i) {
      WalletUtils.updateMultisigDetails(walletAccounts[i]);
    }
  }

  static async updateWalletOtherAccountMultisigInfo(
    wallet: Wallet
  ): Promise<void> {
    for (let i = 0; i < wallet.others.length; ++i) {
      try {
        const multisigInfo: MultisigInfo[] =
          await WalletUtils.getMultisigDetails(wallet.others[i].address);

        wallet.others[i].multisigInfo = multisigInfo;
      } catch (error) {
        const multisigInfo: MultisigInfo[] = [];
        multisigInfo.push(
          new MultisigInfo(wallet.others[i].publicKey, 0, [], [], 0, 0)
        );
        wallet.others[i].multisigInfo = multisigInfo;
      }
    }
  }

  static updateOtherAccountMultisigsDetails(
    otherAccounts: OtherAccount[]
  ): void {
    for (let i = 0; i < otherAccounts.length; ++i) {
      WalletUtils.updateMultisigDetails(otherAccounts[i]);
    }
  }

  static async updateMultisigDetails(walletAccount: MyAccount): Promise<void> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const address = Helper.createAddress(walletAccount.address);

    try {
      const graphInfo =
        await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(address);

      const multisigInfos: MultisigInfo[] = [];

      graphInfo.multisigAccounts.forEach((value, key) => {
        const level = key;

        for (let i = 0; i < value.length; ++i) {
          const multiInfo = value[i];

          const newMultisigInfo = new MultisigInfo(
            multiInfo.account.publicKey,
            level,
            multiInfo.cosignatories.map((c) => c.publicKey),
            multiInfo.multisigAccounts.map((c) => c.publicKey),
            multiInfo.minApproval,
            multiInfo.minRemoval
          );

          multisigInfos.push(newMultisigInfo);
        }
      });

      walletAccount.multisigInfo = multisigInfos;
    } catch (error) {
      console.log("Multisig not found for " + walletAccount.address);
    }
  }

  static async getMultisigDetails(
    addressInString: string
  ): Promise<MultisigInfo[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const address = Helper.createAddress(addressInString);
    const multisigInfos: MultisigInfo[] = [];

    const graphInfo =
      await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(address);

    graphInfo.multisigAccounts.forEach((value, key) => {
      const level = key;

      for (let i = 0; i < value.length; ++i) {
        const multiInfo = value[i];

        const newMultisigInfo = new MultisigInfo(
          multiInfo.account.publicKey,
          level,
          multiInfo.cosignatories.map((c) => c.publicKey),
          multiInfo.multisigAccounts.map((c) => c.publicKey),
          multiInfo.minApproval,
          multiInfo.minRemoval
        );

        multisigInfos.push(newMultisigInfo);
      }
    });

    return multisigInfos;
  }

  static populateOtherSingleAccountTypeMultisig(acc: WalletAccount): string[] {
    if (!walletState.currentLoggedInWallet) {
      throw new Error("Service unavailable");
    }
    const othersList: string[] = [];

    const publicKeys = acc.getDirectChildMultisig();

    for (let y = 0; y < publicKeys.length; ++y) {
      if (
        walletState.currentLoggedInWallet.others.find(
          (other) => other.publicKey === publicKeys[y]
        )
      ) {
        continue;
      } else if (
        walletState.currentLoggedInWallet.accounts.find(
          (account) => account.publicKey === publicKeys[y]
        )
      ) {
        continue;
      }

      othersList.push(publicKeys[y]);

      const publicAccount = Helper.createPublicAccount(
        publicKeys[y],
        AppState.networkType
      );

      const address = publicAccount.address.plain();

      const stripedAddress = address.substring(address.length - 4);

      const newOtherAccount = new OtherAccount(
        "MULTISIG-" + stripedAddress,
        publicKeys[y],
        address,
        Helper.getOtherWalletAccountType().MULTISIG_CHILD
      );

      walletState.currentLoggedInWallet.others.push(newOtherAccount);
    }

    return othersList;
  }

  static populateOtherAccountTypeMultisig(wallet: Wallet): void {
    const othersList: string[] = [];

    for (let i = 0; i < wallet.accounts.length; ++i) {
      const publicKeys = wallet.accounts[i].getDirectChildMultisig();

      for (let y = 0; y < publicKeys.length; ++y) {
        if (wallet.others.find((other) => other.publicKey === publicKeys[y])) {
          continue;
        } else if (
          wallet.accounts.find((account) => account.publicKey === publicKeys[y])
        ) {
          continue;
        }

        othersList.push(publicKeys[y]);

        const publicAccount = Helper.createPublicAccount(
          publicKeys[y],
          AppState.networkType
        );

        const address = publicAccount.address.plain();

        const stripedAddress = address.substring(address.length - 4);

        const newOtherAccount = new OtherAccount(
          "MULTISIG-" + stripedAddress,
          publicKeys[y],
          address,
          Helper.getOtherWalletAccountType().MULTISIG_CHILD
        );

        wallet.others.push(newOtherAccount);
      }
    }

    wallet.others = wallet.others.filter(
      (otherAcc) =>
        othersList.includes(otherAcc.publicKey) ||
        otherAcc.type === Helper.getOtherWalletAccountType().DELEGATE_VALIDATE
    );
  }

  static async refreshAccountsInfo(
    accs: MyAccount[],
    addInLinkedAccount: boolean = false
  ): Promise<string[]> {
    if (!walletState.currentLoggedInWallet || !AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const tempLinkedList: string[] = [];
    const list1: Address[] = accs.map(
      (acc) =>
        PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType)
          .address
    );
    let accountsInfo: AccountInfo[] = [];
    const allWalletAccountPubKey: string[] =
      walletState.currentLoggedInWallet.accounts
        .map((x) => x.publicKey)
        .concat(
          walletState.currentLoggedInWallet.others.map((x) => x.publicKey)
        );

    const numOfRequest = Math.ceil(list1.length / dataPerRequest);
    const assetsInfoId = AppState.assetsInfo.map((x) => x.idHex);

    for (let i = 0; i < numOfRequest; ++i) {
      const startIndex = i * dataPerRequest;
      const endIndex = (i + 1) * dataPerRequest;

      const requestData = list1.slice(startIndex, endIndex);

      try {
        const tempAccountsInfo =
          await AppState.chainAPI.accountAPI.getAccountsInfo(requestData);

        accountsInfo = accountsInfo.concat(tempAccountsInfo);
      } catch (error) {
        continue;
      }
    }

    for (let i = 0; i < accs.length; ++i) {
      const accountInfo = accountsInfo.find(
        (x) => x.address.plain() === accs[i].address
      );

      if (!accountInfo) {
        continue;
      }

      const oldLinkedPublicKey = accs[i].linkedPublicKey;
      const isWalletAccount = accs[i] instanceof WalletAccount;

      if (
        oldLinkedPublicKey &&
        oldLinkedPublicKey !== accountInfo.linkedAccountKey
      ) {
        // if(accs[i] instanceof WalletAccount){
        //     walletState.currentLoggedInWallet.removeOtherAccount(oldLinkedPublicKey);
        // }
        // else if(accs[i] instanceof OtherAccount){
        //     walletState.currentLoggedInWallet.removeOtherAccount(oldLinkedPublicKey);
        // }
        walletState.currentLoggedInWallet.removeOtherAccount(
          oldLinkedPublicKey
        );
      }

      accs[i].linkedPublicKey = accountInfo.linkedAccountKey;

      if (
        addInLinkedAccount &&
        isWalletAccount &&
        accountInfo.linkedAccountKey !== "0".repeat(64)
      ) {
        const linkedPublicAccount = Helper.createPublicAccount(
          accountInfo.linkedAccountKey,
          AppState.networkType
        );

        const newAddress = linkedPublicAccount.address.plain();
        const stripedAddress = newAddress.substring(newAddress.length - 4);

        const newOtherAccount = new OtherAccount(
          "ACCOUNT-LINK-" + stripedAddress,
          accountInfo.linkedAccountKey,
          newAddress,
          Helper.getOtherWalletAccountType().DELEGATE_VALIDATE
        );

        if (!allWalletAccountPubKey.includes(accountInfo.linkedAccountKey)) {
          walletState.currentLoggedInWallet.others.push(newOtherAccount);

          tempLinkedList.push(accountInfo.linkedAccountKey);
        }
      }

      const oldAccAssets: string[] = accs[i].assets.map((x) => x.idHex);

      const holdingAssets: string[] = [];

      for (let y = 0; y < accountInfo.mosaics.length; ++y) {
        const asset = accountInfo.mosaics[y];
        const assetIdHex = asset.id.toHex();

        holdingAssets.push(assetIdHex);

        const foundIndex = oldAccAssets.indexOf(assetIdHex);

        if (foundIndex > -1) {
          // asset exist
          const existingAsset = accs[i].assets[foundIndex];

          existingAsset.rawAmount = asset.amount.compact();
          existingAsset.updateExactAmount();
        } else {
          // not found
          const newAsset = new Asset(assetIdHex);
          newAsset.rawAmount = asset.amount.compact();

          const assetInfoFoundIndex = assetsInfoId.indexOf(assetIdHex);

          if (assetInfoFoundIndex > -1) {
            const knowAssetInfo = AppState.assetsInfo[assetInfoFoundIndex];
            WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
            newAsset.updateExactAmount();
            newAsset.updateExpirationBlock();
          } else {
            // if (!AppState.pendingAssetsInfo.find(x => x.toHex() === assetIdHex)) {
            AppState.pendingAssetsInfo.push(assetIdHex);
            // }
          }

          accs[i].assets.push(newAsset);
        }

        if (assetIdHex === AppState.nativeToken.assetId) {
          accs[i].updateBalance(AppState.nativeToken.assetId);
        }
      }
      accs[i].updateBalance(AppState.nativeToken.assetId);

      const nonHoldingAssets = oldAccAssets.filter(
        (x) => !holdingAssets.includes(x)
      );
      const removingAssetIndex: number[] = [];

      for (let y = 0; y < nonHoldingAssets.length; ++y) {
        const index = oldAccAssets.indexOf(nonHoldingAssets[y]);

        if (index > -1) {
          removingAssetIndex.push(index);

          const asset = accs[i].assets[index];

          if (asset.creator && asset.creator === accs[i].publicKey) {
            asset.amount = 0;
            asset.rawAmount = 0;
            accs[i].addNonHoldingAsset(asset);
          }
        }
      }

      for (let y = removingAssetIndex.length - 1; y >= 0; --y) {
        accs[i].removeAssetByIndex(removingAssetIndex[y]);
      }
    }

    return tempLinkedList;
  }

  static async updateAccountsInfo(
    accs: MyAccount[],
    addInLinkedAccount: boolean = false
  ): Promise<string[]> {
    if (!walletState.currentLoggedInWallet || !AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const tempLinkedList: string[] = [];
    const list1: Address[] = accs.map(
      (acc) =>
        PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType)
          .address
    );
    let accountsInfo: AccountInfo[] = [];
    const allWalletAccountPubKey: string[] =
      walletState.currentLoggedInWallet.accounts
        .map((x) => x.publicKey)
        .concat(
          walletState.currentLoggedInWallet.others.map((x) => x.publicKey)
        );

    const numOfRequest = Math.ceil(list1.length / dataPerRequest);
    const idsHex = AppState.assetsInfo.map((x) => x.idHex);

    for (let i = 0; i < numOfRequest; ++i) {
      const startIndex = i * dataPerRequest;
      const endIndex = (i + 1) * dataPerRequest;

      const requestData = list1.slice(startIndex, endIndex);

      try {
        const tempAccountsInfo =
          await AppState.chainAPI.accountAPI.getAccountsInfo(requestData);

        accountsInfo = accountsInfo.concat(tempAccountsInfo);
      } catch (error) {
        continue;
      }
    }

    for (let i = 0; i < accs.length; ++i) {
      const accountInfo = accountsInfo.find(
        (x) => x.address.plain() === accs[i].address
      );

      if (!accountInfo) {
        continue;
      }

      const isWalletAccount = accs[i] instanceof WalletAccount;

      accs[i].linkedPublicKey = accountInfo.linkedAccountKey;

      if (
        addInLinkedAccount &&
        isWalletAccount &&
        accountInfo.linkedAccountKey !== "0".repeat(64)
      ) {
        const linkedPublicAccount = Helper.createPublicAccount(
          accountInfo.linkedAccountKey,
          AppState.networkType
        );

        const newAddress = linkedPublicAccount.address.plain();
        const stripedAddress = newAddress.substring(newAddress.length - 4);

        const newOtherAccount = new OtherAccount(
          "ACCOUNT-LINK-" + stripedAddress,
          accountInfo.linkedAccountKey,
          newAddress,
          Helper.getOtherWalletAccountType().DELEGATE_VALIDATE
        );

        if (!allWalletAccountPubKey.includes(accountInfo.linkedAccountKey)) {
          walletState.currentLoggedInWallet.others.push(newOtherAccount);

          tempLinkedList.push(accountInfo.linkedAccountKey);
        }
      }

      // let assets: Asset[] = [];

      for (let y = 0; y < accountInfo.mosaics.length; ++y) {
        const asset = accountInfo.mosaics[y];
        const assetIdHex = asset.id.toHex();

        const newAsset = new Asset(assetIdHex);
        newAsset.rawAmount = asset.amount.compact();

        const foundIndex = idsHex.indexOf(assetIdHex);

        if (foundIndex > -1) {
          const knowAssetInfo = AppState.assetsInfo[foundIndex];

          if (knowAssetInfo) {
            WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
            newAsset.updateExactAmount();
            newAsset.updateExpirationBlock();
          }
        } else {
          // if (!AppState.pendingAssetsInfo.find(x => x.toHex() === assetIdHex)) {
          AppState.pendingAssetsInfo.push(assetIdHex);
          // }
        }

        // assets.push(newAsset);
        accs[i].assets.push(newAsset);

        if (assetIdHex === AppState.nativeToken.assetId) {
          accs[i].updateBalance(AppState.nativeToken.assetId);
        }
      }
      // accs[i].assets = assets;
      // accs[i].updateBalance(AppState.nativeToken.assetId);
    }

    return tempLinkedList;
  }

  static async updateWalletAccountsInfo(
    wallet: Wallet,
    addInLinkedAccount: boolean = false
  ): Promise<void> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const tempLinkedList: string[] = [];
    const list1: Address[] = wallet.accounts.map(
      (acc) =>
        PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType)
          .address
    );
    const list2: Address[] = wallet.others.map(
      (acc) =>
        PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType)
          .address
    );
    const accountAddressList = list1.concat(list2);
    let accountsInfo: AccountInfo[] = [];
    const allWalletAccountPubKey: string[] = wallet.accounts
      .map((x) => x.publicKey)
      .concat(wallet.others.map((x) => x.publicKey));

    const numOfRequest = Math.ceil(accountAddressList.length / dataPerRequest);
    const idsHex = AppState.assetsInfo.map((x) => x.idHex);

    for (let i = 0; i < numOfRequest; ++i) {
      const startIndex = i * dataPerRequest;
      const endIndex = (i + 1) * dataPerRequest;

      const requestData = accountAddressList.slice(startIndex, endIndex);

      try {
        const tempAccountsInfo =
          await AppState.chainAPI.accountAPI.getAccountsInfo(requestData);

        accountsInfo = accountsInfo.concat(tempAccountsInfo);
      } catch (error) {
        continue;
      }
    }

    for (let i = 0; i < wallet.accounts.length; ++i) {
      const accountInfo = accountsInfo.find(
        (x) => x.address.plain() === wallet.accounts[i].address
      );

      if (!accountInfo) {
        continue
      }

      if (
        addInLinkedAccount &&
        accountInfo.linkedAccountKey !== "0".repeat(64)
      ) {
        wallet.accounts[i].linkedPublicKey = accountInfo.linkedAccountKey;

        const linkedPublicAccount = Helper.createPublicAccount(
          accountInfo.linkedAccountKey,
          AppState.networkType
        );

        const newAddress = linkedPublicAccount.address.plain();
        const stripedAddress = newAddress.substring(newAddress.length - 4);

        const newOtherAccount = new OtherAccount(
          "ACCOUNT-LINK-" + stripedAddress,
          accountInfo.linkedAccountKey,
          newAddress,
          Helper.getOtherWalletAccountType().DELEGATE_VALIDATE
        );
        const accInfo = accountInfo;
        if (
          !wallet.others.find(
            (other) => other.publicKey === accInfo.linkedAccountKey
          )
        ) {
          wallet.others.push(newOtherAccount);
        }

        if (!allWalletAccountPubKey.includes(accountInfo.linkedAccountKey)) {
          wallet.others.push(newOtherAccount);

          tempLinkedList.push(accountInfo.linkedAccountKey);
        }
      }

      const assets: Asset[] = [];

      for (let y = 0; y < accountInfo.mosaics.length; ++y) {
        const asset = accountInfo.mosaics[y];
        const assetIdHex = asset.id.toHex();

        const newAsset = new Asset(assetIdHex);
        newAsset.rawAmount = asset.amount.compact();

        // wallet.accounts[i].assets.push(newAsset);

        if (assetIdHex === AppState.nativeToken.assetId) {
          const foundIndex = idsHex.indexOf(assetIdHex);

          if (foundIndex > -1) {
            const knowAssetInfo = AppState.assetsInfo[foundIndex];

            WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
            newAsset.updateExactAmount();

            wallet.accounts[i].updateBalance(assetIdHex);
          }
        }

        assets.push(newAsset);
      }
      wallet.accounts[i].assets = assets;
      wallet.accounts[i].assetsLastUpdate = Date.now();
      wallet.accounts[i].updateBalance(AppState.nativeToken.assetId);
    }

    for (let i = 0; i < wallet.others.length; ++i) {
      const accountInfo = accountsInfo.find(
        (x) => x.address.plain() === wallet.others[i].address
      );

      if (!accountInfo) {
        continue;
      }

      if (accountInfo.linkedAccountKey !== "0".repeat(64)) {
        wallet.others[i].linkedPublicKey = accountInfo.linkedAccountKey;
      }

      const assets: Asset[] = [];

      for (let y = 0; y < accountInfo.mosaics.length; ++y) {
        const asset = accountInfo.mosaics[y];
        const assetIdHex = asset.id.toHex();
        const newAsset = new Asset(assetIdHex);
        newAsset.rawAmount = asset.amount.compact();

        // wallet.others[i].assets.push(newAsset);

        if (assetIdHex === AppState.nativeToken.assetId) {
          const foundIndex = idsHex.indexOf(assetIdHex);

          if (foundIndex > -1) {
            const knowAssetInfo = AppState.assetsInfo[foundIndex];

            WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
            newAsset.updateExactAmount();

            wallet.others[i].updateBalance(assetIdHex);
          }
        }
        assets.push(newAsset);
      }
      wallet.others[i].assets = assets;
      wallet.others[i].assetsLastUpdate = Date.now();
      wallet.others[i].updateBalance(AppState.nativeToken.assetId);
    }

    // if (addInLinkedAccount) {
    //     wallet.others = wallet.others.filter((otherAcc) => tempLinkedList.includes(otherAcc.publicKey) || otherAcc.type === Helper.getOtherWalletAccountType().MULTISIG_CHILD);
    // }
  }

  static async refreshAccountsNamespaceInfo(accs: MyAccount[]): Promise<void> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const list1: Address[] = accs.map(
      (acc) =>
        PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType)
          .address
    );
    let namespacesInfo: NamespaceInfo[] = [];

    const numOfRequest = Math.ceil(list1.length / dataPerRequest);

    for (let i = 0; i < numOfRequest; ++i) {
      const startIndex = i * dataPerRequest;
      const endIndex = (i + 1) * dataPerRequest;

      const requestData = list1.slice(startIndex, endIndex);

      try {
        const tempNamespaceInfo =
          await AppState.chainAPI.namespaceAPI.getNamespacesFromAccounts(
            requestData
          );

        namespacesInfo = namespacesInfo.concat(tempNamespaceInfo);
      } catch (error) {
        continue;
      }
    }

    for (let i = 0; i < accs.length; ++i) {
      const allOwnerNamespace = namespacesInfo.filter(
        (x) => x.owner.publicKey === accs[i].publicKey
      );

      if (allOwnerNamespace.length) {
        const namespacesInstance = allOwnerNamespace.map((nsInfo) => {
          const nsId = nsInfo.id.toHex();
          const knowNamespaceInfo = AppState.namespacesInfo.find(
            (x) => x.idHex === nsId
          );

          const newNamespaceInstance =
            WalletUtils.namespaceInfoToNamespace(nsInfo);

          if (knowNamespaceInfo) {
            newNamespaceInstance.name = knowNamespaceInfo.name;
            WalletUtils.namespaceInfoToNamespaceSync(nsInfo, knowNamespaceInfo);
          } else {
            AppState.pendingNamespacesName.push(nsInfo);
          }

          return newNamespaceInstance;
        });

        const oldAccNamespace = accs[i].namespaces.map((x) => x.idHex);
        const stillValidNamespace = namespacesInstance.map((x) => x.idHex);

        const removingNamespace = oldAccNamespace.filter(
          (x) => !stillValidNamespace.includes(x)
        );

        for (let y = 0; y < namespacesInstance.length; ++y) {
          const nsId = namespacesInstance[y].idHex;
          const existingNamespace = accs[i].namespaces.find(
            (x) => x.idHex === nsId
          );

          if (existingNamespace) {
            WalletUtils.namespaceToNamespaceSync(
              existingNamespace,
              namespacesInstance[y]
            );
          } else {
            accs[i].namespaces.push(namespacesInstance[y]);
          }
        }

        for (let y = 0; y < removingNamespace.length; ++y) {
          accs[i].removeNamespace(removingNamespace[y]);
        }
      }
    }
  }

  static async updateAccountsNamespaceInfo(accs: MyAccount[]): Promise<void> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const list1: Address[] = accs.map(
      (acc) =>
        PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType)
          .address
    );
    let namespacesInfo: NamespaceInfo[] = [];

    const numOfRequest = Math.ceil(list1.length / dataPerRequest);

    for (let i = 0; i < numOfRequest; ++i) {
      const startIndex = i * dataPerRequest;
      const endIndex = (i + 1) * dataPerRequest;

      const requestData = list1.slice(startIndex, endIndex);

      try {
        const tempNamespaceInfo =
          await AppState.chainAPI.namespaceAPI.getNamespacesFromAccounts(
            requestData
          );

        namespacesInfo = namespacesInfo.concat(tempNamespaceInfo);
      } catch (error) {
        continue;
      }
    }

    for (let i = 0; i < accs.length; ++i) {
      const allOwnerNamespace = namespacesInfo.filter(
        (x) => x.owner.publicKey === accs[i].publicKey
      );

      if (allOwnerNamespace.length) {
        const namespacesInstance = allOwnerNamespace.map((nsInfo) => {
          const knowNamespaceInfo = AppState.namespacesInfo.find(
            (x) => x.idHex === nsInfo.id.toHex()
          );

          const newNamespaceInstance =
            WalletUtils.namespaceInfoToNamespace(nsInfo);

          if (knowNamespaceInfo) {
            newNamespaceInstance.name = knowNamespaceInfo.name;
            WalletUtils.namespaceInfoToNamespaceSync(nsInfo, knowNamespaceInfo);
          } else {
            AppState.pendingNamespacesName.push(nsInfo);
          }
          return newNamespaceInstance;
        });
        accs[i].namespaces = namespacesInstance;
      }
    }
  }

  static async updateWalletAccountsNamespaceInfo(
    wallet: Wallet
  ): Promise<void> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const list1: Address[] = wallet.accounts.map(
      (acc) =>
        PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType)
          .address
    );
    const list2: Address[] = wallet.others.map(
      (acc) =>
        PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType)
          .address
    );
    const accountAddressList = list1.concat(list2);
    let namespacesInfo: NamespaceInfo[] = [];

    const numOfRequest = Math.ceil(accountAddressList.length / dataPerRequest);

    for (let i = 0; i < numOfRequest; ++i) {
      const startIndex = i * dataPerRequest;
      const endIndex = (i + 1) * dataPerRequest;

      const requestData = accountAddressList.slice(startIndex, endIndex);

      try {
        const tempNamespaceInfo =
          await AppState.chainAPI.namespaceAPI.getNamespacesFromAccounts(
            requestData
          );

        namespacesInfo = namespacesInfo.concat(tempNamespaceInfo);
      } catch (error) {
        continue;
      }
    }

    for (let i = 0; i < wallet.accounts.length; ++i) {
      const allOwnerNamespace = namespacesInfo.filter(
        (x) => x.owner.publicKey === wallet.accounts[i].publicKey
      );

      if (allOwnerNamespace.length) {
        const namespacesInstance = allOwnerNamespace.map((nsInfo) => {
          const knowNamespaceInfo = AppState.namespacesInfo.find(
            (x) => x.idHex === nsInfo.id.toHex()
          );

          const newNamespaceInstance =
            WalletUtils.namespaceInfoToNamespace(nsInfo);

          if (knowNamespaceInfo) {
            newNamespaceInstance.name = knowNamespaceInfo.name;
            WalletUtils.namespaceInfoToNamespaceSync(nsInfo, knowNamespaceInfo);
          } else {
            AppState.pendingNamespacesName.push(nsInfo);
          }
          return newNamespaceInstance;
        });
        wallet.accounts[i].namespaces = namespacesInstance;
      }
    }

    for (let i = 0; i < wallet.others.length; ++i) {
      const allOwnerNamespace = namespacesInfo.filter(
        (x) => x.owner.publicKey === wallet.others[i].publicKey
      );

      if (allOwnerNamespace.length) {
        const namespacesInstance = allOwnerNamespace.map((nsInfo) => {
          const knowNamespaceInfo = AppState.namespacesInfo.find(
            (x) => x.idHex === nsInfo.id.toHex()
          );

          const newNamespaceInstance =
            WalletUtils.namespaceInfoToNamespace(nsInfo);

          if (knowNamespaceInfo) {
            newNamespaceInstance.name = knowNamespaceInfo.name;
            WalletUtils.namespaceInfoToNamespaceSync(nsInfo, knowNamespaceInfo);
          } else {
            AppState.pendingNamespacesName.push(nsInfo);
          }
          return newNamespaceInstance;
        });
        wallet.others[i].namespaces = namespacesInstance;
      }
    }
  }

  static assetInfoToAsset(assetInfo: AssetInfo): Asset {
    const asset = new Asset(assetInfo.idHex);
    asset.divisibility = assetInfo.divisibility;
    asset.supplyMutable = assetInfo.supplyMutable;
    asset.transferable = assetInfo.transferable;
    asset.supply = assetInfo.supply;
    asset.creator = assetInfo.creator;
    asset.duration = assetInfo.duration;
    asset.height = assetInfo.height;
    asset.namespaceNames = assetInfo.namespaceNames;

    return asset;
  }

  static assetInfoCreateFromMosaicInfo(assetInfo: MosaicInfo): AssetInfo {
    const asset = new AssetInfo(
      assetInfo.mosaicId.toHex(),
      assetInfo.divisibility,
      assetInfo.isSupplyMutable(),
      assetInfo.isTransferable(),
      assetInfo.owner.publicKey
    );
    asset.supply = assetInfo.supply.compact();
    asset.duration = assetInfo.duration ? assetInfo.duration.compact() : null;
    asset.height = assetInfo.height.compact();

    return asset;
  }

  static assetUpdateFromAssetInfo(
    assetInfo: AssetInfo,
    assetToUpdate: Asset
  ): void {
    assetToUpdate.divisibility = assetInfo.divisibility;
    assetToUpdate.supplyMutable = assetInfo.supplyMutable;
    assetToUpdate.transferable = assetInfo.transferable;
    assetToUpdate.supply = assetInfo.supply;
    assetToUpdate.creator = assetInfo.creator;
    assetToUpdate.duration = assetInfo.duration;
    assetToUpdate.height = assetInfo.height;
    assetToUpdate.namespaceNames = assetInfo.namespaceNames;
  }

  static assetInfoUpdateFromAssetInfo(
    assetInfo: AssetInfo,
    assetInfoToUpdate: AssetInfo,
    updateNames: boolean = false
  ): void {
    assetInfoToUpdate.divisibility = assetInfo.divisibility;
    assetInfoToUpdate.supplyMutable = assetInfo.supplyMutable;
    assetInfoToUpdate.transferable = assetInfo.transferable;
    assetInfoToUpdate.supply = assetInfo.supply;
    assetInfoToUpdate.creator = assetInfo.creator;
    assetInfoToUpdate.duration = assetInfo.duration;
    assetInfoToUpdate.height = assetInfo.height;
    if (updateNames) {
      assetInfoToUpdate.namespaceNames = assetInfo.namespaceNames;
    }
    if (assetInfo.doneChecking) {
      assetInfoToUpdate.doneChecking = assetInfo.doneChecking;
    }
  }

  static namespaceInfoToNamespace(nsInfo: NamespaceInfo): Namespace {
    const namespace = new Namespace(nsInfo.id.toHex());
    namespace.active = nsInfo.active;
    namespace.startHeight = nsInfo.startHeight.compact();
    namespace.endHeight = nsInfo.endHeight.compact();
    namespace.owner = nsInfo.owner.publicKey;
    namespace.parentId = nsInfo.isSubnamespace()
      ? nsInfo.parentNamespaceId().toHex()
      : "";
    namespace.linkType = nsInfo.alias.type;

    if (nsInfo.alias.type !== AliasType.None) {
      if (nsInfo.alias.type == AliasType.Address) {
        namespace.linkedId = nsInfo.alias.address
          ? nsInfo.alias.address.plain()
          : "";
      } else {
        namespace.linkedId = nsInfo.alias.mosaicId
          ? nsInfo.alias.mosaicId.toHex()
          : "";
      }
    }

    return namespace;
  }

  static namespaceInfoToNamespaceSync(
    nsInfo: NamespaceInfo,
    cachedData: Namespace
  ): void {
    cachedData.active = nsInfo.active;
    cachedData.startHeight = nsInfo.startHeight.compact();
    try {
      cachedData.endHeight = nsInfo.endHeight.compact();
    } catch (error) {
      cachedData.endHeight = nsInfo.endHeight.toHex();
    }
    cachedData.owner = nsInfo.owner.publicKey;
    // cachedData.parentId = nsInfo.isSubnamespace() ? nsInfo.parentNamespaceId().toHex() : "";
    cachedData.linkType = nsInfo.alias.type;
    if (nsInfo.alias.type !== AliasType.None) {
      if (nsInfo.alias.type == AliasType.Address) {
        cachedData.linkedId = nsInfo.alias.address
          ? nsInfo.alias.address.plain()
          : "";
      } else {
        cachedData.linkedId = nsInfo.alias.mosaicId
          ? nsInfo.alias.mosaicId.toHex()
          : "";
      }
    }
    else{
      cachedData.linkedId = "";
     } 
  }

  static namespaceToNamespaceSync(
    nsToUpdate: Namespace,
    nsUpdateFrom: Namespace
  ): void {
    nsToUpdate.active = nsUpdateFrom.active;
    nsToUpdate.startHeight = nsUpdateFrom.startHeight;
    nsToUpdate.endHeight = nsUpdateFrom.endHeight;
    nsToUpdate.owner = nsUpdateFrom.owner;
    nsToUpdate.linkType = nsUpdateFrom.linkType;
    nsToUpdate.linkedId = nsUpdateFrom.linkedId;
  }

  static async reloadAddedAccount(accountName: string) {
    if (walletState.currentLoggedInWallet === null) {
      throw new Error("Service unavailable");
    }
    const acc = walletState.currentLoggedInWallet.accounts.find(
      (x) => x.name === accountName
    );

    if (!acc) {
      throw new Error("Account not found");
    }

    const otherAcc = walletState.currentLoggedInWallet.others.find(
      (x) => x.publicKey === acc?.publicKey
    );

    if (otherAcc) {
      walletState.currentLoggedInWallet.removeOtherAccount(otherAcc.publicKey);
    }

    await WalletUtils.updateMultisigDetails(acc);

    const addedAccPubKey =
      WalletUtils.populateOtherSingleAccountTypeMultisig(acc);
    const addedAccPubKey2 = await WalletUtils.updateAccountsInfo([acc], true);
    await WalletUtils.updateAccountsNamespaceInfo([acc]);

    const allAddedAcc = addedAccPubKey.concat(addedAccPubKey2);

    WalletUtils.getAccsCreatorExtraAssets([acc]);

    if (allAddedAcc.length) {
      WalletUtils.loadOtherAccounts(allAddedAcc);
    } else {
      WalletUtils.runAssetNamespaceInfoLoadBackground(false);
    }
  }

  static async refreshOtherAccounts(otherAccounts: OtherAccount[]) {
    if (walletState.currentLoggedInWallet === null) {
      throw new Error("Service unavailable");
    }

    for (let i = 0; i < otherAccounts.length; ++i) {
      WalletUtils.updateMultisigDetails(otherAccounts[i]);
    }

    await WalletUtils.refreshAccountsInfo(otherAccounts, false);
    await WalletUtils.refreshAccountsNamespaceInfo(otherAccounts);

    await WalletUtils.getAccsCreatorExtraAssets(otherAccounts);
    WalletUtils.runAssetNamespaceInfoLoadBackground(false);
  }

  static async loadOtherAccounts(allAddedAccPubKey: string[]) {
    if (walletState.currentLoggedInWallet === null) {
      throw new Error("Service unavailable");
    }

    const accs: MyAccount[] = walletState.currentLoggedInWallet.others.filter(
      (x) => allAddedAccPubKey.includes(x.publicKey)
    );

    for (let i = 0; i < accs.length; ++i) {
      WalletUtils.updateMultisigDetails(accs[i]);
    }

    await WalletUtils.updateAccountsInfo(accs, false);
    await WalletUtils.updateAccountsNamespaceInfo(accs);

    await WalletUtils.getAccsCreatorExtraAssets(accs);
    WalletUtils.runAssetNamespaceInfoLoadBackground(false);
  }

  static async confirmedTransactionRefresh(accs: MyAccount[]): Promise<void> {
    if (walletState.currentLoggedInWallet === null || !AppState.chainAPI) {
      throw new Error("Service unavailable");
    }

    const chainHeight = await AppState.chainAPI.chainAPI.getBlockchainHeight();

    AppState.readBlockHeight = chainHeight;

    const allPubKey = accs.map((x) => x.publicKey);
    const otherAccounts = walletState.currentLoggedInWallet.others.filter(
      (x) =>
        x.type === OtherAcountType.MULTISIG_CHILD &&
        allPubKey.includes(x.publicKey)
    );

    for (let i = 0; i < accs.length; ++i) {
      await WalletUtils.updateMultisigDetails(accs[i]);
    }

    const pubKeyToRemove = WalletUtils.checkRemovedMultisig(otherAccounts);

    for (let i = 0; i < pubKeyToRemove.length; ++i) {
      walletState.currentLoggedInWallet.removeOtherAccount(pubKeyToRemove[i]);
    }

    const newAccs: MyAccount[] = accs.filter(
      (x) => !pubKeyToRemove.includes(x.publicKey)
    );
    const newWalletAccs: WalletAccount[] = newAccs
      .filter((x) => x instanceof WalletAccount)
      .map((x) => x as WalletAccount);
    const otherAccs: OtherAccount[] = newAccs
      .filter((x) => x instanceof OtherAccount)
      .map((x) => x as OtherAccount);

    let allAddedAccPubKey: string[] = [];

    for (let i = 0; i < newWalletAccs.length; ++i) {
      const addedAccPubKey = WalletUtils.populateOtherSingleAccountTypeMultisig(
        newWalletAccs[i]
      );

      allAddedAccPubKey = allAddedAccPubKey.concat(addedAccPubKey);
    }

    if (newWalletAccs.length) {
      const newAddedAccPubKey = await WalletUtils.refreshAccountsInfo(
        newWalletAccs,
        true
      );
      await WalletUtils.refreshAccountsNamespaceInfo(newWalletAccs);

      allAddedAccPubKey = allAddedAccPubKey.concat(newAddedAccPubKey);

      WalletUtils.syncAccNamespaceName();
    }

    await WalletUtils.getAccsCreatorExtraAssets(newWalletAccs);
    if (otherAccs.length) {
      WalletUtils.refreshOtherAccounts(otherAccs);
    }

    if (allAddedAccPubKey.length) {
      WalletUtils.loadOtherAccounts(allAddedAccPubKey);
    }

    if (allAddedAccPubKey.length === 0 && otherAccs.length === 0) {
      WalletUtils.runAssetNamespaceInfoLoadBackground(false);
    }
  }

  static async refreshAllAccountDetails(
    wallet: Wallet,
    networkProfile: ChainProfile
  ): Promise<void> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    if (wallet === null) {
      return;
    }

    wallet.isReady = false;
    wallet.others = [];

    try {
      const chainHeight =
        await AppState.chainAPI.chainAPI.getBlockchainHeight();

      const extraNamespaceTokensToLoad = knownToken.map(x => x.namespace).filter(x => x !== networkProfile.network.currency.namespace);

      const nativeAssetNamespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespace(
        Helper.createNamespaceId(networkProfile.network.currency.namespace)
      );

      const assetId = nativeAssetNamespaceInfo.alias.mosaicId!;

      /*const assetId = await AppState.chainAPI.namespaceAPI.getLinkedMosaicId(
        Helper.createNamespaceId(networkProfile.network.currency.namespace)
      );*/
      const nativeAssetInfo = await AppState.chainAPI.assetAPI.getMosaic(
        assetId
      );

      AppState.readBlockHeight = chainHeight;
      AppState.nativeToken.assetId = assetId.toHex();
      AppState.nativeToken.creator = nativeAssetInfo.owner.publicKey;
      AppState.nativeToken.divisibility = nativeAssetInfo.divisibility;
      networkProfile.network.currency.assetId = assetId.toHex();
      networkProfile.network.currency.divisibility =
        nativeAssetInfo.divisibility;
      networkProfile.saveToLocalStorage();

      let namespacePromises: Array<Promise<NamespaceInfo>> = [];

      for(let i =0; i < extraNamespaceTokensToLoad.length; ++i){
        namespacePromises.push(
          AppState.chainAPI.namespaceAPI.getNamespace(
            Helper.createNamespaceId(extraNamespaceTokensToLoad[i])
          )
        );
      }

      let loadedNamespaceInfoSettled = await Promise.allSettled(namespacePromises)

      const firstAssetInfo = new AssetInfo(
        assetId.toHex(),
        nativeAssetInfo.divisibility,
        nativeAssetInfo.isSupplyMutable(),
        nativeAssetInfo.isTransferable(),
        nativeAssetInfo.owner.publicKey
      );

      firstAssetInfo.supply = nativeAssetInfo.supply.compact();
      firstAssetInfo.namespaceNames = [AppState.nativeToken.fullNamespace];
      firstAssetInfo.doneChecking = true;

      if (!AppState.assetsInfo.find((x) => x.idHex === firstAssetInfo.idHex)) {
        AppState.assetsInfo.push(firstAssetInfo);
      }

      const nativeTokenNamespace: Namespace = {
        active: true,
        startHeight: 1,
        endHeight: bignumber("0x" + "F".repeat(16)).toString(),
        idHex: Helper.createNamespaceId(networkProfile.network.currency.namespace).toHex(),
        linkedId: assetId.toHex(),
        linkType: AliasType.Mosaic,
        name: networkProfile.network.currency.namespace,
        owner: nativeAssetNamespaceInfo.owner.publicKey,
        parentId: nativeAssetNamespaceInfo.isSubnamespace() ? nativeAssetNamespaceInfo.parentNamespaceId().toHex(): ""
      }

      if(!AppState.namespacesInfo.find((x)=> x.name === nativeTokenNamespace.name)){
        AppState.namespacesInfo.push(nativeTokenNamespace);
      }

      for(let i = 0; i < loadedNamespaceInfoSettled.length; ++i){

        let linkedId: string;

        if(loadedNamespaceInfoSettled[i].status !== "fulfilled"){
          continue;
        }

        let namespaceInfo = await namespacePromises[i];

        switch(namespaceInfo.alias.type){
          case AliasType.Address:
            linkedId = namespaceInfo.alias.address!.plain();
            break;
          case AliasType.Mosaic:
            linkedId = namespaceInfo.alias.mosaicId!.toHex();
            break;
          default:
            linkedId = "";
            break;
        }

        const tokenNamespace: Namespace = {
          active: namespaceInfo.active,
          startHeight: namespaceInfo.startHeight.compact(),
          endHeight: bignumber("0x" + namespaceInfo.endHeight.toHex()).toString(),
          idHex: namespaceInfo.id.toHex(),
          linkedId: linkedId,
          linkType: namespaceInfo.alias.type,
          name: extraNamespaceTokensToLoad[i],
          owner: namespaceInfo.owner.publicKey,
          parentId: namespaceInfo.isSubnamespace() ? namespaceInfo.parentNamespaceId().toHex(): ""
        }

        if(!AppState.namespacesInfo.find((x)=> x.name === tokenNamespace.name)){
          AppState.namespacesInfo.push(tokenNamespace);
        }
      }


      await WalletUtils.updateWalletMultisigInfo(wallet);
      WalletUtils.populateOtherAccountTypeMultisig(wallet);
      await WalletUtils.updateWalletOtherAccountMultisigInfo(wallet);
      await WalletUtils.updateWalletAccountsInfo(wallet, true);
      await WalletUtils.updateWalletAccountsNamespaceInfo(wallet);
      WalletUtils.backgroundWalletLoad(wallet);
    } catch (error) {
      console.log(error);
    }

    walletState.wallets.saveMyWalletOnlytoLocalStorage(wallet);
    wallet.isReady = true;
  }

  static async backgroundWalletLoad(wallet: Wallet) {
    await WalletUtils.walletAssetsInfoSync(wallet);
    await WalletUtils.getWalletCreatorExraAssets(wallet);

    WalletUtils.runAssetNamespaceInfoLoadBackground();
  }

  static runAssetNamespaceInfoLoadBackground(runSync: boolean = true) {
    if (AppState.pendingAssetsInfo.length) {
      // console.log("getPendingAssetsInfo");
      WalletUtils.getPendingAssetsInfo();
    }

    if (AppState.pendingNamespacesName.length) {
      // console.log("getPendingNamespaceName");
      WalletUtils.getPendingNamespaceName();
    }

    if (runSync) {
      // console.log("syncAccNamespaceName");
      WalletUtils.syncAccNamespaceName();
    }
  }

  /**
   * Get non holding assets of accounts (creator)
   * @param wallet
   */
  static async getWalletCreatorExraAssets(wallet: Wallet): Promise<void> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const queryParams: MosaicQueryParams = new MosaicQueryParams();
    queryParams.pageSize = 100;
    queryParams.pageNumber = 1;

    let accsAssetHold: AccountAssetHold[] = [];
    let assetSearchList = [];

    for (let i = 0; i < wallet.accounts.length; ++i) {
      queryParams.ownerFilters = new MosaicCreatorFilters(
        wallet.accounts[i].publicKey
      );
      queryParams.ownerFilters.holding = false;

      assetSearchList.push(
        AppState.chainAPI.assetAPI.searchMosaics(queryParams)
      );

      if (assetSearchList.length === 50) {
        const assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(
          assetSearchList
        );

        const tempAccsAssetHold =
          WalletUtils.extractAccsAssetSearch(assetSearches);
        accsAssetHold = accsAssetHold.concat(tempAccsAssetHold);
        assetSearchList = [];

        await delay(250);
      }
    }

    for (let i = 0; i < wallet.others.length; ++i) {
      queryParams.ownerFilters = new MosaicCreatorFilters(
        wallet.others[i].publicKey
      );
      queryParams.ownerFilters.holding = false;

      assetSearchList.push(
        AppState.chainAPI.assetAPI.searchMosaics(queryParams)
      );

      if (assetSearchList.length === 50) {
        const assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(
          assetSearchList
        );

        const tempAccsAssetHold =
          WalletUtils.extractAccsAssetSearch(assetSearches);
        accsAssetHold = accsAssetHold.concat(tempAccsAssetHold);
        assetSearchList = [];

        await delay(250);
      }
    }

    if (assetSearchList.length) {
      const assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(
        assetSearchList
      );

      const tempAccsAssetHold =
        WalletUtils.extractAccsAssetSearch(assetSearches);
      accsAssetHold = accsAssetHold.concat(tempAccsAssetHold);
      assetSearchList = [];

      await delay(250);
    }

    const allAccs: MyAccount[] = wallet.accounts
      .map((x) => x as MyAccount)
      .concat(wallet.others.map((x) => x as MyAccount));
    let subsequenceQueryData: CreatorAssets[] = [];

    for (let i = 0; i < accsAssetHold.length; ++i) {
      const totalPages = accsAssetHold[i].totalPages;
      const queryingPublicKey = accsAssetHold[i].publicKey;

      for (let y = 2; y <= totalPages; ++y) {
        queryParams.ownerFilters = new MosaicCreatorFilters(queryingPublicKey);
        queryParams.ownerFilters.holding = false;
        queryParams.pageNumber = y;

        assetSearchList.push(
          AppState.chainAPI.assetAPI.searchMosaics(queryParams)
        );

        if (assetSearchList.length === 50) {
          const assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(
            assetSearchList
          );

          const creatorAssets = WalletUtils.assignAccAsset(assetSearches);
          subsequenceQueryData = subsequenceQueryData.concat(creatorAssets);
          assetSearchList = [];

          await delay(250);
        }
      }
    }

    if (assetSearchList.length) {
      const assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(
        assetSearchList
      );

      const creatorAssets = WalletUtils.assignAccAsset(assetSearches);
      subsequenceQueryData = subsequenceQueryData.concat(creatorAssets);
      assetSearchList = [];
    }

    for (let i = 0; i < accsAssetHold.length; ++i) {
      const filteredData = subsequenceQueryData.filter(
        (x) => x.publicKey === accsAssetHold[i].publicKey
      );

      if (filteredData.length) {
        accsAssetHold[i].assetsInfo = accsAssetHold[i].assetsInfo.concat(
          ...filteredData.map((x) => x.assetsInfo)
        );
      }
    }

    const accPublicKeyWithAsset = accsAssetHold.map((x) => x.publicKey);
    let assetList: AssetInfo[] = [];

    for (let i = 0; i < allAccs.length; ++i) {
      const currentPublicKey = allAccs[i].publicKey;

      if (accPublicKeyWithAsset.includes(currentPublicKey)) {
        const acc = accsAssetHold.find((x) => x.publicKey === currentPublicKey);
        if (!acc) {
          throw new Error("Account not found");
        }
        const currentAssetsInfo = acc.assetsInfo;
        assetList = assetList.concat(currentAssetsInfo);
        allAccs[i].nonHoldingAssets = assetList.map((x) =>
          WalletUtils.assetInfoToAsset(x)
        );
      }
    }

    WalletUtils.addAppStateAssetInfo(assetList);
    WalletUtils.updatePendingAssetInfo(assetList);
  }

  static async getAccsCreatorExtraAssets(accs: MyAccount[]): Promise<void> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const queryParams: MosaicQueryParams = new MosaicQueryParams();
    queryParams.pageSize = 100;
    queryParams.pageNumber = 1;

    let assetSearchList = [];
    let accsAssetHold: AccountAssetHold[] = [];

    for (let i = 0; i < accs.length; ++i) {
      queryParams.ownerFilters = new MosaicCreatorFilters(accs[i].publicKey);
      queryParams.ownerFilters.holding = false;

      assetSearchList.push(
        AppState.chainAPI.assetAPI.searchMosaics(queryParams)
      );

      if (assetSearchList.length === 50) {
        const assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(
          assetSearchList
        );

        const tempAccsAssetHold =
          WalletUtils.extractAccsAssetSearch(assetSearches);
        accsAssetHold = accsAssetHold.concat(tempAccsAssetHold);
        assetSearchList = [];

        await delay(250);
      }
    }

    if (assetSearchList.length) {
      const assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(
        assetSearchList
      );

      const tempAccsAssetHold =
        WalletUtils.extractAccsAssetSearch(assetSearches);
      accsAssetHold = accsAssetHold.concat(tempAccsAssetHold);
      assetSearchList = [];

      await delay(250);
    }

    let subsequenceQueryData: CreatorAssets[] = [];

    for (let i = 0; i < accsAssetHold.length; ++i) {
      const totalPages = accsAssetHold[i].totalPages;
      const queryingPublicKey = accsAssetHold[i].publicKey;

      for (let y = 2; y <= totalPages; ++y) {
        queryParams.ownerFilters = new MosaicCreatorFilters(queryingPublicKey);
        queryParams.ownerFilters.holding = false;
        queryParams.pageNumber = y;

        assetSearchList.push(
          AppState.chainAPI.assetAPI.searchMosaics(queryParams)
        );

        if (assetSearchList.length === 50) {
          const assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(
            assetSearchList
          );

          const creatorAssets = WalletUtils.assignAccAsset(assetSearches);
          subsequenceQueryData = subsequenceQueryData.concat(creatorAssets);
          assetSearchList = [];

          await delay(250);
        }
      }
    }

    if (assetSearchList.length) {
      const assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(
        assetSearchList
      );

      const creatorAssets = WalletUtils.assignAccAsset(assetSearches);
      subsequenceQueryData = subsequenceQueryData.concat(creatorAssets);
      assetSearchList = [];
    }

    for (let i = 0; i < accsAssetHold.length; ++i) {
      const filteredData = subsequenceQueryData.filter(
        (x) => x.publicKey === accsAssetHold[i].publicKey
      );

      if (filteredData.length) {
        accsAssetHold[i].assetsInfo = accsAssetHold[i].assetsInfo.concat(
          ...filteredData.map((x) => x.assetsInfo)
        );
      }
    }

    const accPublicKeyWithAsset = accsAssetHold.map((x) => x.publicKey);
    let assetList: AssetInfo[] = [];

    for (let i = 0; i < accs.length; ++i) {
      const currentPublicKey = accs[i].publicKey;

      if (accPublicKeyWithAsset.includes(currentPublicKey)) {
        const acc = accsAssetHold.find((x) => x.publicKey === currentPublicKey);
        if (!acc) {
          throw new Error("Account not found");
        }
        const currentAssetsInfo = acc.assetsInfo;
        assetList = assetList.concat(currentAssetsInfo);
        accs[i].nonHoldingAssets = assetList.map((x) =>
          WalletUtils.assetInfoToAsset(x)
        );
      }
    }

    if (assetList.length) {
      WalletUtils.addAppStateAssetInfo(assetList);
    }

    WalletUtils.updatePendingAssetInfo(assetList);
  }

  static updatePendingAssetInfo(assetsInfo: AssetInfo[]) {
    if (assetsInfo.length === 0) {
      return;
    }

    const idToCompare = assetsInfo.map((x) => x.idHex);
    const pendingAssetsInfo = Array.from(new Set(AppState.pendingAssetsInfo));
    const newList: string[] = pendingAssetsInfo.filter(
      (x) => !idToCompare.includes(x)
    );

    // for(let i=0; i < AppState.pendingAssetsInfo.length; ++i){
    //     let foundPendingInfo = assetsInfo.find( x => x.idHex === AppState.pendingAssetsInfo[i]);

    //     if(!foundPendingInfo){
    //         newList.push(AppState.pendingAssetsInfo[i]);
    //     }
    // }

    AppState.pendingAssetsInfo = newList;
  }

  static addAppStateAssetInfo(assetsInfo: AssetInfo[]) {
    if (assetsInfo.length === 0) {
      return;
    }

    const assetsInfoId = AppState.assetsInfo.map((x) => x.idHex);

    for (let i = 0; i < assetsInfo.length; ++i) {
      const index = assetsInfoId.indexOf(assetsInfo[i].idHex);

      if (index === -1) {
        AppState.assetsInfo.push(assetsInfo[i]);
      } else {
        const assetInfo = AppState.assetsInfo[index];
        WalletUtils.assetInfoUpdateFromAssetInfo(
          assetsInfo[i],
          assetInfo,
          assetsInfo[i].namespaceNames.length > 0
        );
      }
    }

    sessionStorage.setItem(
      assetInfoSessionKey,
      JSON.stringify(AppState.assetsInfo)
    );
  }

  static assignAccAsset(assetsSearches: MosaicSearch[]) {
    const data: CreatorAssets[] = [];

    for (let i = 0; i < assetsSearches.length; ++i) {
      if (assetsSearches[i].mosaicsInfo.length) {
        const assetsInfo = assetsSearches[i].mosaicsInfo;
        const tempAssetsInfo = assetsInfo.map((x) =>
          WalletUtils.assetInfoCreateFromMosaicInfo(x)
        );
        const creatorAsset: CreatorAssets = {
          assetsInfo: tempAssetsInfo,
          publicKey: assetsSearches[i].mosaicsInfo[0].owner.publicKey,
        };
        data.push(creatorAsset);
      }
    }
    return data;
  }

  static extractAccsAssetSearch(
    assetsSearches: MosaicSearch[]
  ): AccountAssetHold[] {
    const accsAssetHold: AccountAssetHold[] = [];

    for (let i = 0; i < assetsSearches.length; ++i) {
      if (assetsSearches[i].pagination.totalEntries) {
        const assetsInfo = assetsSearches[i].mosaicsInfo;
        const newAccAssetHold: AccountAssetHold = {
          publicKey: assetsSearches[i].mosaicsInfo[0].owner.publicKey,
          totalPages: assetsSearches[i].pagination.totalPages,
          totalEntries: assetsSearches[i].pagination.totalEntries,
          currentPage: 1,
          assetsInfo: assetsInfo.map((data) =>
            WalletUtils.assetInfoCreateFromMosaicInfo(data)
          ),
        };

        accsAssetHold.push(newAccAssetHold);
      }
    }

    return accsAssetHold;
  }

  static async getPendingNamespaceName() {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const numOfRequest = Math.ceil(
      AppState.pendingNamespacesName.length / dataPerRequest
    );

    const data: NamespaceInfo[] =
      AppState.pendingNamespacesName as NamespaceInfo[];

    AppState.pendingNamespacesName = [];

    for (let i = 0; i < numOfRequest; ++i) {
      const startIndex = i * dataPerRequest;
      const endIndex = (i + 1) * dataPerRequest;

      const requestData: NamespaceInfo[] = data.slice(startIndex, endIndex);
      const requestingData: NamespaceId[] = requestData.map((x) => x.id);

      try {
        const tempNamespaceInfo =
          await AppState.chainAPI.namespaceAPI.getNamespacesName(
            requestingData
          );

        for (let y = 0; y < tempNamespaceInfo.length; ++y) {
          const nsInfo = data.find(
            (x) => x.id.toHex() === tempNamespaceInfo[y].namespaceId.toHex()
          );
          if (!nsInfo) {
            throw new Error("Namespace not found");
          }
          const namespace = WalletUtils.namespaceInfoToNamespace(nsInfo);
          namespace.name = tempNamespaceInfo[y].name;

          AppState.namespacesInfo.push(namespace);
        }
      } catch (error) {
        continue;
      }
    }

    WalletUtils.checkDuplicateNamespace();
    WalletUtils.syncAccNamespaceName();
    WalletUtils.loadAllAccountNamespaceName();
  }

  static async getPendingAssetsInfo() {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const numOfRequest = Math.ceil(
      AppState.pendingAssetsInfo.length / dataPerRequest
    );
    const newAssetsInfo: AssetInfo[] = [];

    const data: MosaicId[] = AppState.pendingAssetsInfo.map(
      (x) => new MosaicId(x)
    );

    AppState.pendingAssetsInfo = [];

    for (let i = 0; i < numOfRequest; ++i) {
      const startIndex = i * dataPerRequest;
      const endIndex = (i + 1) * dataPerRequest;

      const requestData: MosaicId[] = data.slice(startIndex, endIndex);

      try {
        await delay(50);

        const tempAssetsInfo = await AppState.chainAPI.assetAPI.getMosaics(
          requestData
        );
        const tempAssetNames = await AppState.chainAPI.assetAPI.getMosaicsNames(
          requestData
        );

        for (let y = 0; y < tempAssetsInfo.length; ++i) {
          const newAssetInfo = WalletUtils.assetInfoCreateFromMosaicInfo(
            tempAssetsInfo[i]
          );

          const tempNames = tempAssetNames.find(
            (x) => x.mosaicId.toHex() === tempAssetsInfo[i].mosaicId.toHex()
          );

          if (tempNames) {
            newAssetInfo.namespaceNames = tempNames.names.map((x) => x.name);
          }

          newAssetInfo.doneChecking = true;
          newAssetsInfo.push(newAssetInfo);
        }
      } catch (error) {
        continue;
      }
    }

    WalletUtils.addAppStateAssetInfo(newAssetsInfo);
    await WalletUtils.updateAssetInfoNamespaces();
    WalletUtils.checkDuplicateAssetInfo();
    WalletUtils.loadAllAccountAsset();
  }

  static loadAllAccountAsset() {
    if (walletState.currentLoggedInWallet === null) {
      return null;
    }

    const wallet = walletState.currentLoggedInWallet;
    const idsHex = AppState.assetsInfo.map((x) => x.idHex);

    for (let i = 0; i < wallet.accounts.length; ++i) {
      const assets = wallet.accounts[i].assets.filter(
        (x) => x.divisibility === null || x.namespaceNames.length === 0
      );

      for (let y = 0; y < assets.length; ++y) {
        const idHex = assets[y].idHex;
        const index = idsHex.indexOf(idHex);

        if (index > -1) {
          const assetInfo = AppState.assetsInfo[index];

          if (assetInfo) {
            WalletUtils.assetUpdateFromAssetInfo(assetInfo, assets[y]);
            assets[y].updateExactAmount();
            assets[y].updateExpirationBlock();
          }
        }
      }
    }

    for (let i = 0; i < wallet.others.length; ++i) {
      const assets = wallet.others[i].assets.filter(
        (x) => x.divisibility === null || x.namespaceNames.length === 0
      );

      for (let y = 0; y < assets.length; ++y) {
        const idHex = assets[y].idHex;
        const index = idsHex.indexOf(idHex);

        if (index > -1) {
          const assetInfo = AppState.assetsInfo[index];

          if (assetInfo) {
            WalletUtils.assetUpdateFromAssetInfo(assetInfo, assets[y]);
            assets[y].updateExactAmount();
            assets[y].updateExpirationBlock();
          }
        }
      }
    }
  }

  static loadAllAccountNamespaceName() {
    sessionStorage.setItem(
      namespaceInfoSessionKey,
      JSON.stringify(AppState.namespacesInfo)
    );

    if (walletState.currentLoggedInWallet === null) {
      return null;
    }

    const wallet = walletState.currentLoggedInWallet;

    for (let i = 0; i < wallet.accounts.length; ++i) {
      const namespaces = wallet.accounts[i].namespaces.filter(
        (x) => x.name === ""
      );

      for (let y = 0; y < namespaces.length; ++y) {
        const namespaceInfo = AppState.namespacesInfo.find(
          (x) => x.idHex === namespaces[y].idHex
        );
        if (!namespaceInfo) {
          throw new Error("Namespace not found");
        }
        namespaces[y].name = namespaceInfo.name;
      }
    }

    for (let i = 0; i < wallet.others.length; ++i) {
      const namespaces = wallet.others[i].namespaces.filter(
        (x) => x.name === ""
      );

      for (let y = 0; y < namespaces.length; ++y) {
        const namespaceInfo = AppState.namespacesInfo.find(
          (x) => x.idHex === namespaces[y].idHex
        );
        if (!namespaceInfo) {
          throw new Error("Namespace not found");
        }
        namespaces[y].name = namespaceInfo.name;
      }
    }
  }

  static async updateAssetInfoNamespaces() {
    if (walletState.currentLoggedInWallet === null || !AppState.chainAPI) {
      throw new Error("Service unavailable");
    }

    const wallet = walletState.currentLoggedInWallet;
    const allPubKeys = wallet.accounts
      .map((x) => x.publicKey)
      .concat(wallet.others.map((x) => x.publicKey));

    const assetIds: MosaicId[] = AppState.assetsInfo
      .filter((x) => {
        if (!x.creator) {
          throw new Error("Service unavailable");
        }
        return x.doneChecking === false || !allPubKeys.includes(x.creator);
      })
      .map((x) => new MosaicId(x.idHex));

    for (let i = 0; i < AppState.assetsInfo.length; ++i) {
      AppState.assetsInfo[i].doneChecking = true;
    }

    const numOfRequest = Math.ceil(assetIds.length / dataPerRequest);

    for (let i = 0; i < numOfRequest; ++i) {
      const startIndex = i * dataPerRequest;
      const endIndex = (i + 1) * dataPerRequest;

      const requestData: MosaicId[] = assetIds.slice(startIndex, endIndex);

      try {
        const tempAssetNames: MosaicNames[] =
          await AppState.chainAPI.assetAPI.getMosaicsNames(requestData);

        WalletUtils.updateAssetInfoNames(tempAssetNames);
      } catch (error) {}
    }

    sessionStorage.setItem(
      assetInfoSessionKey,
      JSON.stringify(AppState.assetsInfo)
    );
  }

  static updateAssetInfoNames(assetsNames: MosaicNames[]) {
    const idsHex = AppState.assetsInfo.map((x) => x.idHex);

    for (let i = 0; i < assetsNames.length; ++i) {
      const index = idsHex.indexOf(assetsNames[i].mosaicId.toHex());

      if (index > -1) {
        const assetInfo = AppState.assetsInfo[index];
        assetInfo.namespaceNames = assetsNames[i].names.map((x) => x.name);
      }
    }
  }

  static updateAllAccountBalance(wallet: Wallet, assetId: string): void {
    for (let i = 0; i < wallet.accounts.length; ++i) {
      wallet.accounts[i].updateBalance(assetId);
    }

    for (let i = 0; i < wallet.others.length; ++i) {
      wallet.others[i].updateBalance(assetId);
    }
  }

  static initFixOldFormat(
    oldWallets: oldWltFile[],
    networkName: string,
    networkType: NetworkType
  ): void {
    const walletsInstance = new Wallets();
    const wallets: Wallet[] = [];
    const prefix =
      networkType === NetworkType.MAIN_NET
        ? "sw-books-mainnet-"
        : "sw-books-testnet-";

    oldWallets.forEach((wallet) => {
      const newWallet = new Wallet(wallet.name, networkName, []);
      const walletAccounts: WalletAccount[] = [];

      wallet.accounts
        .filter((acc) => acc.encrypted)
        .forEach((account) => {
          const stringJSON = JSON.stringify(account);

          const newWalletAccount =
            WalletUtils.createNewWalletAccountFromOldFormat(stringJSON);
          newWalletAccount.fixAddress(networkType);

          walletAccounts.push(newWalletAccount);
        });

      newWallet.accounts = walletAccounts;

      const allWalletContacts: AddressBook[] =
        WalletUtils.oldFormatCollectAddressBook(wallet.name, prefix);

      newWallet.contacts = allWalletContacts;
      wallets.push(newWallet);
    });

    walletsInstance.wallets = wallets;
    walletsInstance.savetoLocalStorage();
    WalletStateUtils.refreshWallets();
  }

  static oldFormatCollectAddressBook(
    walletName: string,
    prefix: string
  ): AddressBook[] {
    const allWalletContacts: AddressBook[] = [];
    const addressBook = localStorage.getItem(prefix + walletName);
    if (addressBook) {
      const accountAddressBooks: any[] = JSON.parse(addressBook);

      for (let i = 0; i < accountAddressBooks.length; ++i) {
        // if(accountAddressBooks[i].walletContact){
        allWalletContacts.push(
          new AddressBook(
            accountAddressBooks[i].label,
            accountAddressBooks[i].value,
            "-none-"
          )
        );
        // }
      }
    }

    return allWalletContacts;
  }

  static oldFormatToNewFormat(
    oldWallet: oldWltFile,
    networkName: string,
    networkType: NetworkType,
    contacts: AddressBook[]
  ): Wallet {
    const walletAccounts: WalletAccount[] = [];

    oldWallet.accounts
      .filter((acc) => acc.encrypted)
      .forEach((account) => {
        const stringJSON = JSON.stringify(account);

        const newWalletAccount =
          WalletUtils.createNewWalletAccountFromOldFormat(stringJSON);
        newWalletAccount.fixAddress(networkType);

        walletAccounts.push(newWalletAccount);
      });

    const newWallet = new Wallet(oldWallet.name, networkName, walletAccounts);

    newWallet.contacts = contacts;

    return newWallet;
  }

  static addNewWallet(
    allWallets: Wallets,
    password: Password,
    walletName: string,
    networkName: string,
    networkType: NetworkType
  ): tempNewWalletInterface {
    const account = Account.generateNewAccount(networkType);
    const wallet = WalletUtils.createAccountSimpleFromPrivateKey(
      walletName,
      password,
      account.privateKey,
      networkType
    );
    const walletAccounts: WalletAccount[] = [];
    const walletAccount = new WalletAccount(
      "Primary",
      account.publicKey,
      wallet.publicAccount.address.plain(),
      "pass:bip32",
      wallet.encryptedPrivateKey.encryptedKey,
      wallet.encryptedPrivateKey.iv
    );
    walletAccount.isBrain = true;
    walletAccount.default = true;
    walletAccounts.push(walletAccount);
    const newWalletInstance = new Wallet(
      walletName,
      networkName,
      walletAccounts
    );

    allWallets.wallets.push(newWalletInstance);
    allWallets.savetoLocalStorage();

    const data: tempNewWalletInterface = {
      wallet: walletAccount,
      privateKey: account.privateKey,
    };

    return data;
  }

  static addNewWalletWithPrivateKey(
    allWallets: Wallets,
    privateKey: string,
    password: Password,
    walletName: string,
    networkName: string,
    networkType: NetworkType
  ): WalletAccount {
    const account = Account.createFromPrivateKey(privateKey, networkType);
    const wallet = WalletUtils.createAccountSimpleFromPrivateKey(
      walletName,
      password,
      privateKey,
      networkType
    );
    const walletAccounts: WalletAccount[] = [];
    const walletAccount = new WalletAccount(
      "Primary",
      account.publicKey,
      wallet.publicAccount.address.plain(),
      "pass:bip32",
      wallet.encryptedPrivateKey.encryptedKey,
      wallet.encryptedPrivateKey.iv
    );
    walletAccount.isBrain = true;
    walletAccount.default = true;
    walletAccounts.push(walletAccount);
    const newWalletInstance = new Wallet(
      walletName,
      networkName,
      walletAccounts
    );

    allWallets.wallets.push(newWalletInstance);
    allWallets.savetoLocalStorage();

    return walletAccount;
  }

  static getAllMultisigAccount(wallet: Wallet): MyAccount[] {
    let allMultisigAccount: MyAccount[] = [];

    const multisigAccount: MyAccount[] = wallet.accounts.filter(
      (acc) => acc.getDirectParentMultisig().length > 0
    );
    const otherMultisigAccount: MyAccount[] = wallet.others.filter(
      (account) => account.type === "MULTISIG"
    );
    allMultisigAccount = multisigAccount.concat(otherMultisigAccount);

    return allMultisigAccount;
  }

  static getAllMultisigInfoByPublicKey(
    wallet: Wallet,
    publicKey: string
  ): MultisigInfo[] {
    const account = wallet.accounts.find((acc) => acc.publicKey === publicKey);

    if (account) {
      return account.multisigInfo;
    }

    const otherAccount = wallet.others.find(
      (acc) => acc.publicKey === publicKey
    );

    if (otherAccount) {
      return otherAccount.multisigInfo;
    }

    return [];
  }

  static getWalletMultisigInfo(wallet: Wallet): PublicKeyMultisigInfos[] {
    const data: PublicKeyMultisigInfos[] = [];
    const multisigAccounts = WalletUtils.getAllMultisigAccount(wallet);

    for (let i = 0; i < multisigAccounts.length; ++i) {
      const multisigInfos = WalletUtils.getAllMultisigInfoByPublicKey(
        wallet,
        multisigAccounts[i].publicKey
      );
      data.push({
        publicKey: multisigAccounts[i].publicKey,
        multisigInfos: multisigInfos,
      });
    }

    return data;
  }

  static findWalletAccountByPublicKey(
    wallet: Wallet,
    publicKey: string
  ): WalletAccount | null {
    const account = wallet.accounts.find((acc) => acc.publicKey === publicKey);

    if (account) {
      return account;
    }

    return null;
  }

  static findAccountByPublicKey(
    wallet: Wallet,
    publicKey: string
  ): MyAccount | null {
    const account = wallet.accounts.find((acc) => acc.publicKey === publicKey);

    if (account) {
      return account;
    }

    const otherAccount = wallet.others.find(
      (acc) => acc.publicKey === publicKey
    );

    if (otherAccount) {
      return otherAccount;
    }

    return null;
  }

  static findAccountPublicKeyByAddress(
    wallet: Wallet,
    address: string
  ): string | null {
    const account = wallet.accounts.find((acc) => acc.address === address);

    if (account) {
      return account.publicKey;
    }

    const otherAccount = wallet.others.find((acc) => acc.address === address);

    if (otherAccount) {
      return otherAccount.publicKey;
    }

    return null;
  }

  static getFinalCosigner(multisigInfos: MultisigInfo[]): string[] {
    const cosigner: string[] = [];

    const parentSelfOnlyMultisigInfo = multisigInfos.filter(
      (info) => info.level >= 0
    );

    for (let i = 0; i < parentSelfOnlyMultisigInfo.length; ++i) {
      if (parentSelfOnlyMultisigInfo[i].minApproval === 0) {
        cosigner.push(parentSelfOnlyMultisigInfo[i].publicKey);
      }
    }

    return cosigner;
  }

  static getDirectParentCosigner(multisigInfos: MultisigInfo[]): string[] {
    let cosigner: string[] = [];

    const selfMultisigInfo = multisigInfos.filter((info) => info.level === 0);

    cosigner = selfMultisigInfo[0].cosignaturies;

    return cosigner;
  }
}

interface PublicKeyMultisigInfos {
  publicKey: string;
  multisigInfos: MultisigInfo[];
}

interface oldWltFile {
  name: string;
  accounts: oldAccountStructure[];
}

interface oldAccountStructure {
  algo: string;
  address: string;
  brain: boolean;
  default: boolean;
  encrypted: string;
  firstAccount: boolean;
  iv: string;
  name: string;
  network?: 184;
  publicAccount: {
    publicKey: string;
    address: {
      address: string;
      networkType?: number;
    };
  };
  nis1Account: {
    address: string;
    publicKey: string;
  } | null;
}

interface commonInterface {
  password: string;
  privateKey: string;
}

interface tempNewWalletInterface {
  privateKey: string;
  wallet: WalletAccount;
}
