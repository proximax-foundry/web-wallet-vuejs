import { networkState } from "../state/networkState"
import { walletState } from "../state/walletState"
import { ChainUtils } from "../util/chainUtils"
import { Wallet } from "../models/wallet"
import { Wallets } from "../models/wallets"
import { WalletAccount } from "../models/walletAccount"
import { nis1Account } from "../models/nis1Account"
import { ChainProfile } from "../models/stores/chainProfile"
import { Asset } from "../models/asset";
import { ChainAPICall } from "../models/REST/chainAPICall"
import { SecretKeyPair } from "../models/interface/secretKeyPair"
import { MultisigInfo } from "../models/multisigInfo"
import {
    SimpleWallet, Password, RawAddress, Convert, Crypto,
    WalletAlgorithm, PublicAccount, Account, NetworkType,
    AggregateTransaction, CosignatureTransaction, NamespaceInfo,
    NamespaceId, Address, AccountInfo, MosaicId, AliasType,
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
    MosaicCreatorFilters
} from "tsjs-xpx-chain-sdk";
import { Helper, LooseObject } from "./typeHelper";
import { WalletStateUtils } from "@/state/utils/walletStateUtils";
import { OtherAccount } from "@/models/otherAccount";
import { Namespace } from "@/models/namespace";
import { Account as MyAccount } from "@/models/account";
import { TransactionUtils } from "./transactionUtils"
import { AddressBook } from "@/models/addressBook"
import { AppState } from "@/state/appState";
import { Label } from "@/models/label"
import { AssetInfo } from "@/models/assetInfo"
import { OtherAcountType } from "@/models/const/otherAccountType"

const dataPerRequest = 50;
const assetInfoSessionKey = "assetsInfo";
const namespaceInfoSessionKey = "namespacesInfo";

const delay = ms => new Promise(res => setTimeout(res, ms));

interface AccountAssetHold{
    publicKey: string;
    totalPages: number;
    totalEntries: number;
    currentPage: number;
    assetsInfo: AssetInfo[];
}

interface CreatorAssets{
    publicKey: string;
    assetsInfo: AssetInfo[];
}

export class WalletUtils {

    static async walletAssetsInfoSync(wallet: Wallet){
        
        let idsHex = AppState.assetsInfo.map(x => x.idHex);

        for(let i=0; i < wallet.accounts.length; ++i){

            for(let y=0; y < wallet.accounts[i].assets.length; ++y){
                let newAsset = wallet.accounts[i].assets[y];
                let assetIdHex = wallet.accounts[i].assets[y].idHex;
                let index = idsHex.indexOf(assetIdHex);

                if(index > -1){
                    let knowAssetInfo = AppState.assetsInfo[index];

                    if (knowAssetInfo) {
                        WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
                        newAsset.updateExactAmount();
                        newAsset.updateExpirationBlock();
                    }
                }
                else {
                    AppState.pendingAssetsInfo.push(assetIdHex);
                }
            }
        }

        for(let i=0; i < wallet.others.length; ++i){

            for(let y=0; y < wallet.others[i].assets.length; ++y){
                let newAsset = wallet.others[i].assets[y];
                let assetIdHex = wallet.others[i].assets[y].idHex;

                let index = idsHex.indexOf(assetIdHex);

                if(index > -1){
                    let knowAssetInfo = AppState.assetsInfo[index];

                    if (knowAssetInfo) {
                        WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
                        newAsset.updateExactAmount();
                        newAsset.updateExpirationBlock();
                    }
                }
                else {
                    AppState.pendingAssetsInfo.push(assetIdHex);
                }

                // if(y !== 0 && y % 50 === 0){
                //     await delay(50);
                // }
            }
        }
    }

    static checkDuplicateNamespace(){
        
        let idNamespacesOrigin = AppState.namespacesInfo.map(x => x.idHex);
        let idNamespaces = Array.from(new Set(AppState.namespacesInfo.map(x => x.idHex)));

        if(idNamespacesOrigin.length === idNamespaces.length){
            return;
        }

        let namespaces: Namespace[] = [];

        for(let i = 0; i < idNamespaces.length; ++i){

            let index = idNamespacesOrigin.indexOf(idNamespaces[i]);

            if(index > -1){
                let namespace = AppState.namespacesInfo[index];

                namespaces.push(namespace);
            }
        }

        AppState.namespacesInfo = namespaces;
        sessionStorage.setItem(namespaceInfoSessionKey, JSON.stringify(namespaces));
    }

    static checkDuplicateAssetInfo(){
        
        let idAssetsOrigin = AppState.assetsInfo.map(x => x.idHex);
        let idAssets = Array.from(new Set(AppState.assetsInfo.map(x => x.idHex)));

        if(idAssetsOrigin.length === idAssets.length){
            return;
        }

        let assetsInfo: AssetInfo[] = [];

        for(let i = 0; i < idAssets.length; ++i){

            let index = idAssetsOrigin.indexOf(idAssets[i]);

            if(index > -1){
                let assetInfo = AppState.assetsInfo[index];
                assetsInfo.push(assetInfo);
            }
        }
            
        AppState.assetsInfo = assetsInfo;
        sessionStorage.setItem(assetInfoSessionKey, JSON.stringify(assetsInfo));
    }

    static syncAccNamespaceName(){

        if(walletState.currentLoggedInWallet === null){
            return;
        }

        let wallet = walletState.currentLoggedInWallet;

        let namespaces = AppState.namespacesInfo;

        for(let i =0; i < wallet.accounts.length; ++i){

            let assetList = wallet.accounts[i].assets;

            for(let y =0; y < assetList.length; ++y){
                let namespaceAlias = namespaces.filter(x => x.linkedId === assetList[y].idHex);

                if(namespaceAlias.length === 0){
                    continue;
                }

                assetList[y].namespaceNames = namespaceAlias.map(x => x.name);
            }

            // let namespace = namespaces.find(x => x.linkedId === wallet.accounts[i].address);

            // if(namespace){
            //     wallet.accounts[i] = [namespace.name];
            // }
        }

        for(let i =0; i < wallet.others.length; ++i){

            let assetList = wallet.others[i].assets;

            for(let y =0; y < assetList.length; ++y){
                let namespaceAlias = namespaces.filter(x => x.linkedId === assetList[y].idHex);

                if(namespaceAlias.length === 0){
                    continue;
                }

                assetList[y].namespaceNames = namespaceAlias.map(x => x.name);
            }
        }
    }

    static async updateAccTxnEntries(accs: MyAccount[]){

        let txnQP = new TransactionQueryParams();

        txnQP.pageSize = 10;
        txnQP.embedded = true;
        txnQP.sortField = TransactionSortingField.BLOCK;
        txnQP.order = Order_v2.DESC;
    
        let allPubKey = accs.map(x => x.publicKey);
        let txnSearchResults: TransactionSearch[] = [];

        let requests = [];

        for(let i =0; i < allPubKey.length; ++i){

          try {
            txnQP.publicKey = allPubKey[i];
            requests.push(AppState.chainAPI.transactionAPI.searchTransactions(TransactionGroupType.CONFIRMED, txnQP));

            if(requests.length === 50){
                let tempResults = await Promise.all<TransactionSearch>(requests);

                txnSearchResults = txnSearchResults.concat(tempResults);

                requests = [];
                await delay(250);
            }
          } catch (error) {
            continue;
          }
        }

        if(requests.length){
            let tempResults = await Promise.all<TransactionSearch>(requests);

            txnSearchResults = txnSearchResults.concat(tempResults);

            requests = [];
        }

        for(let i = 0; i < txnSearchResults.length; ++i){

            let queryingPublicKey = allPubKey[i];
            let totalEntries = txnSearchResults[i].pagination.totalEntries;

            let acc = accs.find(x => x.publicKey === queryingPublicKey);
            acc.totalTxns = totalEntries;
        }
    }

    static async transactionConfirmed(txnHashes: string[]){

        if(txnHashes.length === 0){
            return;
        }

        let confirmedTransactions = await AppState.chainAPI.transactionAPI.getTransactions(txnHashes);

        let relatedAddress = [];

        for(let i =0; i < confirmedTransactions.length; ++i){
            let txn = confirmedTransactions[i];

            let addresses = TransactionUtils.extractConfirmedRelatedAddressByTransactionType(txn);

            relatedAddress = relatedAddress.concat(addresses.map(x=> x.plain()))
        }

        if(walletState.currentLoggedInWallet === null){
            return;
        }

        let wallet = walletState.currentLoggedInWallet as Wallet;

        let relatedWalletAccs = wallet.accounts.filter(x => relatedAddress.includes(x.address));
        let relatedOtherAccs = wallet.others.filter(x => relatedAddress.includes(x.address));
        let allAccounts: MyAccount[] = relatedWalletAccs.map(x => x as MyAccount).concat(relatedOtherAccs.map(x => x as MyAccount));

        WalletUtils.updateAccTxnEntries(allAccounts);

        WalletUtils.confirmedTransactionRefresh(allAccounts);
    }

    static updateAllAccountsAssetNamespace(changedAssetId: string[]){

        if(walletState.currentLoggedInWallet === null){
            return;
        }

        let assetsInfo = AppState.assetsInfo.filter(x => changedAssetId.includes(x.idHex));
        let wallet = walletState.currentLoggedInWallet;

        for(let i =0 ; i < wallet.accounts.length; ++i){
            for(let y=0; y < wallet.accounts[i].assets.length; ++y){

                let assetId = wallet.accounts[i].assets[y].idHex;
                
                if(!changedAssetId.includes(assetId)){
                    continue;
                }

                let assetInfo = assetsInfo.find(x => x.idHex === assetId);

                if(assetInfo){
                    wallet.accounts[i].assets[y].namespaceNames = assetInfo.namespaceNames;
                }
            }
        }

        for(let i =0 ; i < wallet.others.length; ++i){
            for(let y=0; y < wallet.others[i].assets.length; ++y){

                let assetId = wallet.others[i].assets[y].idHex;
                
                if(!changedAssetId.includes(assetId)){
                    continue;
                }

                let assetInfo = assetsInfo.find(x => x.idHex === assetId);

                if(assetInfo){
                    wallet.others[i].assets[y].namespaceNames = assetInfo.namespaceNames;
                }
            }
        }
    }

    static getAllAccs(wallet: Wallet): MyAccount[]{

        let accs = wallet.accounts.map(x => x as MyAccount);
        let othersAcc = wallet.others.map(x => x as MyAccount);

        return accs.concat(othersAcc);
    }

    static async recheckAssetsNames(){

        if(walletState.currentLoggedInWallet === null){
            return;
        }

        let wallet = walletState.currentLoggedInWallet as Wallet;

        let accs = WalletUtils.getAllAccs(wallet);
        let accsPubKey = accs.map(x => x.publicKey);
        let nonCreatorAssetsInfo = AppState.assetsInfo.filter(x => !accsPubKey.includes(x.creator));
        let data = nonCreatorAssetsInfo.map(x => new MosaicId(x.idHex));
        let dataPlain = nonCreatorAssetsInfo.map(x => x.idHex);

        let numOfRequest = Math.ceil(data.length / dataPerRequest);

        let changedAssetId: string[] = [];

        let assetsInfoIdHex = AppState.assetsInfo.map(x => x.idHex);

        for (let i = 0; i < numOfRequest; ++i) {
            let startIndex = i * dataPerRequest;
            let endIndex = (i + 1) * dataPerRequest;

            let requestData: MosaicId[] = data.slice(startIndex, endIndex);
            let requestDataPlain = dataPlain.slice(startIndex, endIndex);

            try {
                let tempAssetNames = await AppState.chainAPI.assetAPI.getMosaicsNames(requestData);

                let foundAssetIds: string[] = [];

                for (let y = 0; y < tempAssetNames.length; ++y) {
                    
                    let currentAssetId = tempAssetNames[i].mosaicId.toHex();

                    foundAssetIds.push(currentAssetId);

                    let index = assetsInfoIdHex.indexOf(currentAssetId);

                    if (index > -1) {
                        let assetInfo = AppState.assetsInfo[index];
                        let oldNames = assetInfo.namespaceNames.join(",");
                        
                        assetInfo.namespaceNames = tempAssetNames[i].names.map(x => x.name);

                        let newNames = assetInfo.namespaceNames.join(",");

                        if(oldNames !== newNames){
                            changedAssetId.push(currentAssetId);
                        }
                    }
                }
                
                let notFoundAssetId = requestDataPlain.filter(x => !foundAssetIds.includes(x));

                for(let i = 0; i < notFoundAssetId.length; ++i){
                    let index = assetsInfoIdHex.indexOf(notFoundAssetId[i]);
                    
                    if (index > -1) {
                        let assetInfo = AppState.assetsInfo[index];
                        let oldNames = assetInfo.namespaceNames.join(",");
                        
                        assetInfo.namespaceNames = [];

                        let newNames = assetInfo.namespaceNames.join(",");

                        if(oldNames !== newNames){
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
    
    static checkRemovedMultisig(otherAccounts: OtherAccount[]): string[]{

        if (walletState.currentLoggedInWallet === null) {
            return [];
        }

        let pubKeyNeedToRemove: string[] = [];

        let allAccountsPubKey = walletState.currentLoggedInWallet.accounts.map(x => x.publicKey);

        for(let i =0; i < otherAccounts.length; ++i){
            let directCosigners = otherAccounts[i].getDirectParentMultisig();
            const foundCosigners = allAccountsPubKey.filter(value => directCosigners.includes(value));

            if(foundCosigners.length === 0){
                pubKeyNeedToRemove.push(otherAccounts[i].publicKey);
            }
        }

        return pubKeyNeedToRemove;
    }

    static async checkConfirmedTxnChecking(){

        if(walletState.currentLoggedInWallet === null){
            return;
        }

        let txnQP = new TransactionQueryParams();

        txnQP.pageSize = 10;
        txnQP.embedded = true;
        txnQP.sortField = TransactionSortingField.BLOCK;
        txnQP.order = Order_v2.DESC;
    
        let accAccount = (walletState.currentLoggedInWallet as Wallet).accounts.map(x=> x as MyAccount);
        let otherAccount = (walletState.currentLoggedInWallet as Wallet).others.map(x => x as MyAccount);
        let allAccounts: MyAccount[] = accAccount.concat(otherAccount);
        let allPubKey = allAccounts.map(x => x.publicKey);
        let txnSearchResults: TransactionSearch[] = [];

        let requests = [];

        for(let i =0; i < allPubKey.length; ++i){

          try {
            txnQP.publicKey = allPubKey[i];
            requests.push(AppState.chainAPI.transactionAPI.searchTransactions(TransactionGroupType.CONFIRMED, txnQP));

            if(requests.length === 50){
                let tempResults = await Promise.all<TransactionSearch>(requests);

                txnSearchResults = txnSearchResults.concat(tempResults);

                requests = [];
                await delay(250);
            }
          } catch (error) {
            continue;
          }
        }

        if(requests.length){
            let tempResults = await Promise.all<TransactionSearch>(requests);

            txnSearchResults = txnSearchResults.concat(tempResults);

            requests = [];
        }

        let accsNeedUpdate: MyAccount[] = [];

        for(let i = 0; i < txnSearchResults.length; ++i){

            let queryingPublicKey = allPubKey[i];
            let totalEntries = txnSearchResults[i].pagination.totalEntries;

            let acc = allAccounts.find(x => x.publicKey === queryingPublicKey);

            if(acc.totalTxns !== -1 && acc.totalTxns !== totalEntries){
                accsNeedUpdate.push(acc);
            }

            acc.totalTxns = totalEntries;
        }

        WalletUtils.confirmedTransactionRefresh(accsNeedUpdate);
    }

    static checkLoadedDataUsable(networkName: string){
        let sessionLastNetworkName = sessionStorage.getItem("lastNetworkName");

        if(sessionLastNetworkName && sessionLastNetworkName !== networkName){
            AppState.assetsInfo = [];
            AppState.namespacesInfo = [];
            AppState.pendingAssetsInfo = [];
            AppState.pendingNamespacesName = [];

            if(sessionStorage.getItem(assetInfoSessionKey)){
                sessionStorage.removeItem(assetInfoSessionKey);
            }

            if(sessionStorage.getItem(namespaceInfoSessionKey)){
                sessionStorage.removeItem(namespaceInfoSessionKey);
            }
        }
    }

    /**
     * Auto detect version, use only at login
     * @param name 
     * @param networkName 
     * @param password 
     * @returns detectedSchemeVersion
     */
    static signInVerifyWalletPassword(name: string, networkName: string, password: string): number {
        try {
            const returnData = WalletUtils.decryptWalletPrivateKey(name, networkName, password);

            const defaultVersion = returnData.version ?? 2;

            const checkingAddress = Account.createFromPrivateKey(returnData.privateKey, AppState.networkType, defaultVersion).address.plain();

            if (checkingAddress === returnData.address) {
                return defaultVersion;
            }
            else{
                const checkingAddressV2 = Account.createFromPrivateKey(returnData.privateKey, AppState.networkType, 2).address.plain();

                if (checkingAddressV2 === returnData.address) {
                    return 2;
                }

                const checkingAddressV1 = Account.createFromPrivateKey(returnData.privateKey, AppState.networkType, 1).address.plain();

                if (checkingAddressV1 === returnData.address) {
                    return 1;
                }
            }

            return 0;
        } catch (error) {
            return 0;
        }

    }

    static decryptWalletPrivateKey(name: string, networkName: string, password: string){

        const wallet = walletState.wallets.filterByNetworkNameAndName(networkName, name);
        if (!wallet) {
            throw new Error("Wallet not found");
        }

        const account = wallet.accounts[0];

        const common: SecretKeyPair = {
            password: password,
            privateKey: ""
        };

        if (account) {
            if (
                !Crypto.passwordToPrivateKey(
                    common,
                    account,
                    account.algo == "pass:bip32" ? WalletAlgorithm.Pass_bip32 : account.algo
                )
            ) {
                throw new Error("Unable to decrypt private key");
            }
            else {
                if (!ChainUtils.isPrivateKeyValid(common.privateKey)) {
                    throw new Error("Not valid private key");
                }

                return {
                    privateKey: common.privateKey,
                    publicKey: account.publicKey,
                    address: account.address, 
                    version: account.version
                };
            }
        }

        throw new Error("Unable to proceed decrypt private key");
    }

    static verifyWalletPassword(name: string, networkName: string, password: string): boolean {
        
        try {
            const returnData = WalletUtils.decryptWalletPrivateKey(name, networkName, password);

            const checkingAddress = Account.createFromPrivateKey(returnData.privateKey, AppState.networkType, returnData.version).address.plain();

            if (checkingAddress !== returnData.address) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    static fetchAccountInfoCurrentWalletAccounts(): false | Promise<AccountInfo[]> {

        const wallet = walletState.currentLoggedInWallet as Wallet;
        const networkType = AppState.networkType;

        if (!wallet || !networkType) {
            return false;
        }

        const addresses: Address[] = [];
        wallet.accounts.forEach((element: WalletAccount) => {
            addresses.push(Address.createFromPublicKey(element.publicKey, networkType));
        });

        let currentNetworkProfile: ChainProfile;

        if (networkState.currentNetworkProfile) {
            currentNetworkProfile = networkState.currentNetworkProfile as ChainProfile;
        }
        else {
            return false;
        }

        return new Promise((resolve, reject) => {
            try {
                AppState.chainAPI.accountAPI.getAccountsInfo(addresses).then(accountInfo => {
                    resolve(accountInfo);
                }).catch((error) => {
                    console.warn(error);
                    reject(false);
                });
            } catch (err) {
                console.warn(err);
                reject(false);
            }
        });
    }
    static getAggregateBondedTransactions = (publicAccount: PublicAccount): Promise<AggregateTransaction[]> => {
        const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
        return new Promise((resolve, reject) => {
            try {
                let txnQueryParams = new TransactionQueryParams();
                txnQueryParams.pageSize = 100;
                chainAPICall.accountAPI.aggregateBondedTransactions(publicAccount, txnQueryParams).then(transactions => {
                    resolve(transactions);
                }).catch((error) => {
                    console.warn(error);
                    reject(false);
                });
            } catch (err) {
                console.warn(err);
                reject(false);
            }
        });
    }


    static getMultisigAccGraphInfo(address: Address): Promise<MultisigAccountGraphInfo> {
        const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
        return new Promise((resolve, reject) => {
            try {
                chainAPICall.accountAPI.getMultisigAccountGraphInfo(address).then(accountInfo => {
                    resolve(accountInfo);
                }).catch((error) => {
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
        const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
        let address = Address.createFromRawAddress(add);
        return new Promise((resolve, reject) => {
            try {
                chainAPICall.accountAPI.getAccountInfo(address).then(accountInfo => {
                    resolve(accountInfo);
                }).catch((error) => {
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
        return Address.createFromRawAddress(RawAddress.addressToString(Convert.hexToUint8(address)));
    }


    /**
     *
     *
     * @param {string} walletName
     * @param {Password} password
     * @param {number} network
     * @returns {SimpleWallet}
     */
    static createAccountSimple(walletName: string, password: Password, network: NetworkType, version: number): SimpleWallet {
        return SimpleWallet.create(walletName, password, network, version);
    }

    static createAccountSimpleFromPrivateKey(walletName: string, password: Password, privateKey: string, network: NetworkType, version: number): SimpleWallet {
        return SimpleWallet.createFromPrivateKey(walletName, password, privateKey, network, version)
    }

    static createAccountSimpleFromEncryptedPrivateKey(walletName: string, encryptedPrivateKey: string, iv: string, publicKey: string, network: NetworkType, version: number): SimpleWallet {
        return SimpleWallet.createFromEncryptedKey(walletName, encryptedPrivateKey, iv, publicKey, network, version);
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
    static createAccountFromPrivateKey(privateKey: string, network: NetworkType, version: number): Account {
        return Account.createFromPrivateKey(privateKey, network, version);
    }

    /**
     *
     *
     * @param {Password} password
     * @param {string} encryptedKey
     * @param {string} iv
     * @returns {string}
     */
    static decryptPrivateKey(password: Password, encryptedKey: string, iv: string): string {
        const common: commonInterface = {
            password: password.value,
            privateKey: ''
        };

        const wallet: { encrypted: string; iv: string; } = {
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
    static checkAddress(privateKey: string, net: NetworkType, address: string, version: number): boolean {
        return (Account.createFromPrivateKey(privateKey, net, version).address.plain() === address) ? true : false;
    }

    // static createPublicAccount(publicKey: string, network: NetworkType, version: number): PublicAccount {
    //     return PublicAccount.createFromPublicKey(publicKey, network, version);
    // }

    static createAddressFromPublicKey(publicKey: string, networkType: NetworkType): Address {
        return Address.createFromPublicKey(publicKey, networkType);
    }

    static cosignAggregateBondedTransaction(transaction: AggregateTransaction, account: Account) {
        const cosignatureTransaction = CosignatureTransaction.create(transaction);

        let chainProfile;
        if (networkState.currentNetworkProfile) {
            chainProfile = networkState.currentNetworkProfile as ChainProfile;
        }
        else {
            return Promise.reject(new Error('chainProfile is null'));
        }

        const endpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, chainProfile.httpPort);

        return AppState.chainAPI.transactionAPI.announceAggregateBondedCosignature(
            account.signCosignatureTransaction(cosignatureTransaction)
        );
    }

    static createFromRawAddress(address: string): Address {
        return Address.createFromRawAddress(address);
    }

    static getPublicAccountFromPrivateKey(privateKey: string, net: NetworkType, version: number): PublicAccount {
        return Account.createFromPrivateKey(privateKey, net, version).publicAccount;
    }

    static generateNewAccount(network: NetworkType, version: number): Account {
        return Account.generateNewAccount(network, version);
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
        return network === NetworkType.PRIVATE || network === NetworkType.PRIVATE_TEST;
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
        if (address !== '') {
            const addressTrimAndUpperCase = address.trim().toUpperCase().replace(/-/g, '');
            if (addressTrimAndUpperCase.length === 40) {
                if (address.charAt(0) === 'S') {
                    return true;
                } else if (address.charAt(0) === 'M') {
                    return true;
                } else if (address.charAt(0) === 'V') {
                    return true;
                } else if (address.charAt(0) === 'X') {
                    return true;
                } else if (address.charAt(0) === 'W') {
                    return true;
                } else if (address.charAt(0) === 'Z') {
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
    static verifyNetworkAddressEqualsNetwork(value: string, value2: string): boolean {
        if ((value.length === 40 || value.length === 46) && (value2.length === 40 || value2.length === 46)) {
            if (value.charAt(0) === 'S' && value2.charAt(0) === 'S') {
                // NetworkType.MIJIN_TEST
                return true;
            } else if (value.charAt(0) === 'M' && value2.charAt(0) === 'M') {
                // NetworkType.MIJIN
                return true;
            } else if (value.charAt(0) === 'V' && value2.charAt(0) === 'V') {
                // NetworkType.TEST_NET
                return true;
            } else if (value.charAt(0) === 'X' && value2.charAt(0) === 'X') {
                // NetworkType.MAIN_NET
                return true;
            } else if (value.charAt(0) === 'W' && value2.charAt(0) === 'W') {
                // NetworkType.PRIVATE_TEST
                return true;
            } else if (value.charAt(0) === 'Z' && value2.charAt(0) === 'Z') {
                // NetworkType.PRIVATE
                return true;
            } else {
                // Address Network unsupported
                return false;
            }
        }
    }

    /**
     *
     *
     * @returns {WalletAlgorithm}
  
     */
    static getWalletAlgorithm(): typeof WalletAlgorithm {
        return WalletAlgorithm;
    }

    static importWltOldFormat(wallets: Wallets, parsedObj: any, networkName: string, networkType: NetworkType): void {
        const wltFile: oldWltFile = parsedObj;

        if (wallets.filterByNetworkNameAndName(networkName, wltFile.name)) {
            let error = new Error("Wallet with same name already exist");
            error.name = "SAME_NAME";
            throw error;
        }

        const walletAccounts: WalletAccount[] = [];

        wltFile.accounts.filter(acc => acc.encrypted).forEach((account) => {
            const walletAccount = new WalletAccount(account.name,
                account.publicAccount.publicKey, account.publicAccount.address.address, account.algo,
                account.encrypted, account.iv, 0);

            if (account.nis1Account) {
                walletAccount.nis1Account = new nis1Account(account.nis1Account.address, account.nis1Account.publicKey);
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

    static importWalletNewFormat(wallets: Wallets, parsedObj: any, networkName: string, networkType: NetworkType): void {
        const wltFile: Wallet = parsedObj;

        if (wallets.filterByNetworkNameAndName(networkName, wltFile.name)) {
            let error = new Error("Wallet with same name already exist");
            error.name = "SAME_NAME";
            throw error;
        }

        const walletAccounts: WalletAccount[] = [];

        wltFile.accounts.forEach((account) => {
            const walletAccount = new WalletAccount(account.name,
                account.publicKey, account.address, account.algo,
                account.encrypted, account.iv, account.version ?? 0);

            if (account.nis1Account) {
                walletAccount.nis1Account = new nis1Account(account.nis1Account.address, account.nis1Account.publicKey);
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
                    let group = wltFile.contacts[i].group ? wltFile.contacts[i].group : '';
                    let newAddressBook = new AddressBook(wltFile.contacts[i].name, wltFile.contacts[i].address, group, wltFile.contacts[i].version ?? 0, wltFile.contacts[i].publicKey);
                    newWallet.addAddressBook(newAddressBook);
                }
            } catch (error) {

            }
        }

        if (Array.isArray(wltFile.labels)) {
            try {
                for (let i = 0; i < wltFile.labels.length; ++i) {

                    let newLabel = new Label(wltFile.labels[i].name, wltFile.labels[i].addresses);
                    newWallet.addLabel(newLabel);
                }
            } catch (error) {

            }
        }

        wallets.wallets.push(newWallet);

        wallets.savetoLocalStorage();
    }


    static createNewWalletAccountFromOldFormat(jsonString: string): WalletAccount {
        const wltAccount: oldAccountStructure = JSON.parse(jsonString);

        const walletAccount = new WalletAccount(wltAccount.name,
            wltAccount.publicAccount.publicKey, wltAccount.publicAccount.address.address, wltAccount.algo,
            wltAccount.encrypted, wltAccount.iv, 0);

        if (wltAccount.nis1Account) {
            walletAccount.nis1Account = new nis1Account(wltAccount.nis1Account.address, wltAccount.nis1Account.publicKey);
        }

        walletAccount.default = wltAccount.default;
        walletAccount.isBrain = wltAccount.brain;

        return walletAccount;
    }

    static checkIsNewFormat(base64Wlt: any): boolean {
        const wltFile: Wallet = base64Wlt;//Helper.base64decode(base64Wlt);

        if (wltFile.accounts[0].publicKey) {
            return true;
        }
        else {
            return false;
        }
    }

    static checkIsNewFormatAccountRaw(jsonString: string): boolean {

        const account: LooseObject = JSON.parse(jsonString);

        if (account.publicKey) {
            return true;
        }
        else {
            return false;
        }
    }

    static export(wallet: Wallet): string {

        const exportingData = wallet.convertToSimpleWallet();

        const walletJSON = JSON.stringify(exportingData);

        return Helper.base64encode(walletJSON);
    }

    static exportAccount(wallet: Wallet, exportingPublicKey: string): string {

        let dataToExport = wallet.convertToSimpleWallet();

        dataToExport.accounts = dataToExport.accounts.filter(acc => acc.publicKey === exportingPublicKey);

        const walletJSON = JSON.stringify(dataToExport);

        return Helper.base64encode(walletJSON);
    }

    static async updateWalletMultisigInfo(wallet: Wallet): Promise<void> {

        for (let i = 0; i < wallet.accounts.length; ++i) {

            try {
                let multisigInfo: MultisigInfo[] = await WalletUtils.getMultisigDetails(wallet.accounts[i].address);

                wallet.accounts[i].multisigInfo = multisigInfo;
            } catch (error) {
                let multisigInfo: MultisigInfo[] = [];
                multisigInfo.push(new MultisigInfo(wallet.accounts[i].publicKey, 0, [], [], 0, 0));
                wallet.accounts[i].multisigInfo = multisigInfo;
            }
        }
    }

    static updateMultisigsDetails(walletAccounts: WalletAccount[]): void {

        for (let i = 0; i < walletAccounts.length; ++i) {
            WalletUtils.updateMultisigDetails(walletAccounts[i]);
        }
    }

    static async updateWalletOtherAccountMultisigInfo(wallet: Wallet): Promise<void> {

        for (let i = 0; i < wallet.others.length; ++i) {

            try {
                let multisigInfo: MultisigInfo[] = await WalletUtils.getMultisigDetails(wallet.others[i].address);

                wallet.others[i].multisigInfo = multisigInfo;
            } catch (error) {
                let multisigInfo: MultisigInfo[] = [];
                multisigInfo.push(new MultisigInfo(wallet.others[i].publicKey, 0, [], [], 0, 0));
                wallet.others[i].multisigInfo = multisigInfo;
            }
        }
    }

    static updateOtherAccountMultisigsDetails(otherAccounts: OtherAccount[]): void {

        for (let i = 0; i < otherAccounts.length; ++i) {
            WalletUtils.updateMultisigDetails(otherAccounts[i]);
        }
    }

    static async updateMultisigDetails(walletAccount: MyAccount): Promise<void> {

        const address = Helper.createAddress(walletAccount.address);

        try {
            const graphInfo = await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(address);

            let multisigInfos: MultisigInfo[] = [];

            graphInfo.multisigAccounts.forEach((value, key) => {
                const level = key;

                for (let i = 0; i < value.length; ++i) {

                    let multiInfo = value[i];

                    let newMultisigInfo = new MultisigInfo(
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
            // console.log("Multisig not found for " + walletAccount.address);
            let multisigInfo: MultisigInfo[] = [];
            multisigInfo.push(new MultisigInfo(walletAccount.publicKey, 0, [], [], 0, 0));
            walletAccount.multisigInfo = multisigInfo;
        }
    }

    static async getMultisigDetails(addressInString: string): Promise<MultisigInfo[]> {

        const address = Helper.createAddress(addressInString);
        let multisigInfos: MultisigInfo[] = [];

        const graphInfo = await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(address);

        graphInfo.multisigAccounts.forEach((value, key) => {
            const level = key;

            for (let i = 0; i < value.length; ++i) {

                let multiInfo = value[i];

                let newMultisigInfo = new MultisigInfo(
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

        let othersList: string[] = [];

        let publicKeys = acc.getDirectChildMultisig();

        for (let y = 0; y < publicKeys.length; ++y) {

            if (walletState.currentLoggedInWallet.others.find((other) => other.publicKey === publicKeys[y])) {
                continue;
            }
            else if (walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey === publicKeys[y])) {
                continue;
            }

            othersList.push(publicKeys[y]);

            let publicAccount = Helper.createPublicAccount(publicKeys[y], AppState.networkType)

            let address = publicAccount.address.plain();

            let stripedAddress = address.substring(address.length - 4);

            let newOtherAccount = new OtherAccount("MULTISIG-" + stripedAddress, publicKeys[y], address, Helper.getOtherWalletAccountType().MULTISIG_CHILD, 0);

            walletState.currentLoggedInWallet.others.push(newOtherAccount);
        }

        return othersList;
    }

    static populateOtherAccountTypeMultisig(wallet: Wallet): void {

        let othersList: string[] = [];

        for (let i = 0; i < wallet.accounts.length; ++i) {

            let publicKeys = wallet.accounts[i].getDirectChildMultisig();

            for (let y = 0; y < publicKeys.length; ++y) {

                if (wallet.others.find((other) => other.publicKey === publicKeys[y])) {
                    continue;
                }
                else if (wallet.accounts.find((account) => account.publicKey === publicKeys[y])) {
                    continue;
                }

                othersList.push(publicKeys[y]);

                let publicAccount = Helper.createPublicAccount(publicKeys[y], AppState.networkType)

                let address = publicAccount.address.plain();

                let stripedAddress = address.substring(address.length - 4);

                let newOtherAccount = new OtherAccount("MULTISIG-" + stripedAddress, publicKeys[y], address, Helper.getOtherWalletAccountType().MULTISIG_CHILD, 0);

                wallet.others.push(newOtherAccount);
            }
        }

        wallet.others = wallet.others.filter((otherAcc) => othersList.includes(otherAcc.publicKey) || otherAcc.type === Helper.getOtherWalletAccountType().DELEGATE_VALIDATE)
    }

    static async refreshAccountsInfo(accs: MyAccount[], addInLinkedAccount: boolean = false): Promise<string[]> {

        let tempLinkedList: string[] = [];
        const list1: Address[] = accs.map((acc) => PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType).address)
        let accountsInfo: AccountInfo[] = [];
        let allWalletAccountPubKey: string[] =
            walletState.currentLoggedInWallet.accounts.map(x => x.publicKey).concat(
                walletState.currentLoggedInWallet.others.map(x => x.publicKey)
            );

        let numOfRequest = Math.ceil(list1.length / dataPerRequest);
        let assetsInfoId = AppState.assetsInfo.map(x => x.idHex);

        for (let i = 0; i < numOfRequest; ++i) {
            let startIndex = i * dataPerRequest;
            let endIndex = (i + 1) * dataPerRequest;

            let requestData = list1.slice(startIndex, endIndex);

            try {
                let tempAccountsInfo = await AppState.chainAPI.accountAPI.getAccountsInfo(requestData);

                accountsInfo = accountsInfo.concat(tempAccountsInfo)
            } catch (error) {
                continue;
            }
        }

        for (let i = 0; i < accs.length; ++i) {

            let accountInfo = accountsInfo.find(x => x.address.plain() === accs[i].address);

            if (!accountInfo) {
                continue;
            }

            let oldLinkedPublicKey = accs[i].linkedPublicKey;
            let isWalletAccount = accs[i] instanceof WalletAccount;

            // if(oldLinkedPublicKey && oldLinkedPublicKey !== accountInfo.linkedAccountKey){
                // if(accs[i] instanceof WalletAccount){
                //     walletState.currentLoggedInWallet.removeOtherAccount(oldLinkedPublicKey);
                // }
                // else if(accs[i] instanceof OtherAccount){
                //     walletState.currentLoggedInWallet.removeOtherAccount(oldLinkedPublicKey);
                // }
                // walletState.currentLoggedInWallet.removeOtherAccount(oldLinkedPublicKey);
            // }

            accs[i].version = accountInfo.version ?? 1;
            accs[i].linkedPublicKey = accountInfo.linkedAccountKey ?? "";
            accs[i].supplementalPublicKeys = accountInfo.supplementalPublicKeys ?? null;

            // if (addInLinkedAccount && isWalletAccount && accountInfo.linkedAccountKey && accountInfo.linkedAccountKey !== "0".repeat(64)) {

            //     let linkedPublicAccount = Helper.createPublicAccount(accountInfo.linkedAccountKey, AppState.networkType);

            //     let newAddress = linkedPublicAccount.address.plain();
            //     let stripedAddress = newAddress.substring(newAddress.length - 4);

            //     let newOtherAccount = new OtherAccount("ACCOUNT-LINK-" + stripedAddress, accountInfo.linkedAccountKey, newAddress, Helper.getOtherWalletAccountType().DELEGATE_VALIDATE, 0);

            //     if (!allWalletAccountPubKey.includes(accountInfo.linkedAccountKey)) {
            //         walletState.currentLoggedInWallet.others.push(newOtherAccount);

            //         tempLinkedList.push(accountInfo.linkedAccountKey);
            //     }
            // }

            let oldAccAssets: string[] = accs[i].assets.map(x => x.idHex);

            let holdingAssets: string[] = [];

            for (let y = 0; y < accountInfo.mosaics.length; ++y) {
                let asset = accountInfo.mosaics[y];
                let assetIdHex = asset.id.toHex();

                holdingAssets.push(assetIdHex);

                let foundIndex = oldAccAssets.indexOf(assetIdHex);

                if(foundIndex > -1){
                    // asset exist
                    let existingAsset = accs[i].assets[foundIndex];

                    existingAsset.rawAmount = asset.amount.compact();
                    existingAsset.updateExactAmount();
                }
                else{
                    // not found
                    let newAsset = new Asset(assetIdHex);
                    newAsset.rawAmount = asset.amount.compact();

                    let assetInfoFoundIndex = assetsInfoId.indexOf(assetIdHex);

                    if (assetInfoFoundIndex > -1) {
                        let knowAssetInfo = AppState.assetsInfo[assetInfoFoundIndex];
                        WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
                        newAsset.updateExactAmount();
                        newAsset.updateExpirationBlock();
                    }
                    else {
                        // if (!AppState.pendingAssetsInfo.find(x => x.toHex() === assetIdHex)) {
                            AppState.pendingAssetsInfo.push(assetIdHex);
                        // }
                    }

                    accs[i].assets.push(newAsset);
                }

                if(assetIdHex === AppState.nativeToken.assetId){
                    accs[i].updateBalance(AppState.nativeToken.assetId)
                }
            }
            accs[i].updateBalance(AppState.nativeToken.assetId);
            
            let nonHoldingAssets = oldAccAssets.filter(x => !holdingAssets.includes(x));
            let removingAssetIndex: number[] = [];

            for(let y =0; y < nonHoldingAssets.length; ++y){
                let index = oldAccAssets.indexOf(nonHoldingAssets[y]);

                if(index > -1){

                    removingAssetIndex.push(index);

                    let asset = accs[i].assets[index];

                    if(asset.creator && asset.creator === accs[i].publicKey){
                        asset.amount = 0;
                        asset.rawAmount = 0;
                        accs[i].addNonHoldingAsset(asset);
                    }
                }
            }

            for(let y = removingAssetIndex.length - 1; y >= 0; --y){
                accs[i].removeAssetByIndex(removingAssetIndex[y]);
            }
        }

        return tempLinkedList;
    }

    static async updateAccountsInfo(accs: MyAccount[], addInLinkedAccount: boolean = false): Promise<string[]> {

        let tempLinkedList: string[] = [];
        const list1: Address[] = accs.map((acc) => PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType).address)
        let accountsInfo: AccountInfo[] = [];
        let allWalletAccountPubKey: string[] =
            walletState.currentLoggedInWallet.accounts.map(x => x.publicKey).concat(
                walletState.currentLoggedInWallet.others.map(x => x.publicKey)
            );

        let numOfRequest = Math.ceil(list1.length / dataPerRequest);
        let idsHex = AppState.assetsInfo.map(x => x.idHex);

        for (let i = 0; i < numOfRequest; ++i) {
            let startIndex = i * dataPerRequest;
            let endIndex = (i + 1) * dataPerRequest;

            let requestData = list1.slice(startIndex, endIndex);

            try {
                let tempAccountsInfo = await AppState.chainAPI.accountAPI.getAccountsInfo(requestData);

                accountsInfo = accountsInfo.concat(tempAccountsInfo)
            } catch (error) {
                continue;
            }
        }

        for (let i = 0; i < accs.length; ++i) {

            let accountInfo = accountsInfo.find(x => x.address.plain() === accs[i].address);

            if (!accountInfo) {
                continue;
            }

            let isWalletAccount = accs[i] instanceof WalletAccount;

            accs[i].version = accountInfo.version ?? 1;
            accs[i].linkedPublicKey = accountInfo.linkedAccountKey;
            accs[i].supplementalPublicKeys = accountInfo.supplementalPublicKeys ?? null;

            // if (addInLinkedAccount && isWalletAccount && accountInfo.linkedAccountKey && accountInfo.linkedAccountKey !== "0".repeat(64)) {

            //     let linkedPublicAccount = Helper.createPublicAccount(accountInfo.linkedAccountKey, AppState.networkType);

            //     let newAddress = linkedPublicAccount.address.plain();
            //     let stripedAddress = newAddress.substring(newAddress.length - 4);

            //     let newOtherAccount = new OtherAccount("ACCOUNT-LINK-" + stripedAddress, accountInfo.linkedAccountKey, newAddress, Helper.getOtherWalletAccountType().DELEGATE_VALIDATE);

            //     if (!allWalletAccountPubKey.includes(accountInfo.linkedAccountKey)) {
            //         walletState.currentLoggedInWallet.others.push(newOtherAccount);

            //         tempLinkedList.push(accountInfo.linkedAccountKey);
            //     }
            // }

            // let assets: Asset[] = [];

            for (let y = 0; y < accountInfo.mosaics.length; ++y) {
                let asset = accountInfo.mosaics[y];
                let assetIdHex = asset.id.toHex();

                let newAsset = new Asset(assetIdHex);
                newAsset.rawAmount = asset.amount.compact();

                let foundIndex = idsHex.indexOf(assetIdHex);

                if(foundIndex > -1){
                    let knowAssetInfo = AppState.assetsInfo[foundIndex];

                    if (knowAssetInfo) {
                        WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
                        newAsset.updateExactAmount();
                        newAsset.updateExpirationBlock();
                    }
                }
                else {
                    // if (!AppState.pendingAssetsInfo.find(x => x.toHex() === assetIdHex)) {
                        AppState.pendingAssetsInfo.push(assetIdHex);
                    // }
                }

                // assets.push(newAsset);
                accs[i].assets.push(newAsset);

                if(assetIdHex === AppState.nativeToken.assetId){
                    accs[i].updateBalance(AppState.nativeToken.assetId)
                }
            }
            // accs[i].assets = assets;
            // accs[i].updateBalance(AppState.nativeToken.assetId);
        }

        return tempLinkedList;
    }

    static async updateWalletAccountsInfo(wallet: Wallet, addInLinkedAccount: boolean = false): Promise<void> {

        let tempLinkedList: string[] = [];
        const list1: Address[] = wallet.accounts.map((acc) => PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType).address)
        const list2: Address[] = wallet.others.map((acc) => PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType).address);
        let accountAddressList = list1.concat(list2);
        let accountsInfo: AccountInfo[] = [];
        let allWalletAccountPubKey: string[] =
            wallet.accounts.map(x => x.publicKey).concat(
                wallet.others.map(x => x.publicKey)
            );

        let numOfRequest = Math.ceil(accountAddressList.length / dataPerRequest);
        let idsHex = AppState.assetsInfo.map(x => x.idHex);

        for (let i = 0; i < numOfRequest; ++i) {
            let startIndex = i * dataPerRequest;
            let endIndex = (i + 1) * dataPerRequest;

            let requestData = accountAddressList.slice(startIndex, endIndex);

            try {
                let tempAccountsInfo = await AppState.chainAPI.accountAPI.getAccountsInfo(requestData);

                accountsInfo = accountsInfo.concat(tempAccountsInfo)
            } catch (error) {
                continue;
            }
        }


        for (let i = 0; i < wallet.accounts.length; ++i) {

            let accountInfo = accountsInfo.find(x => x.address.plain() === wallet.accounts[i].address);

            if (!accountInfo) {
                continue;
            }

            wallet.accounts[i].version = accountInfo.version ?? 2;
            wallet.accounts[i].linkedPublicKey = accountInfo.linkedAccountKey ?? "";
            wallet.accounts[i].supplementalPublicKeys = accountInfo.supplementalPublicKeys ?? null;

            // if (addInLinkedAccount && accountInfo.linkedAccountKey && accountInfo.linkedAccountKey !== "0".repeat(64)) {

            //     wallet.accounts[i].linkedPublicKey = accountInfo.linkedAccountKey;

            //     let linkedPublicAccount = Helper.createPublicAccount(accountInfo.linkedAccountKey, AppState.networkType);

            //     let newAddress = linkedPublicAccount.address.plain();
            //     let stripedAddress = newAddress.substring(newAddress.length - 4);

            //     let newOtherAccount = new OtherAccount("ACCOUNT-LINK-" + stripedAddress, accountInfo.linkedAccountKey, newAddress, Helper.getOtherWalletAccountType().DELEGATE_VALIDATE);

            //     if (!wallet.others.find((other) => other.publicKey === accountInfo.linkedAccountKey)) {
            //         wallet.others.push(newOtherAccount);
            //     }

            //     if (!allWalletAccountPubKey.includes(accountInfo.linkedAccountKey)) {
            //         wallet.others.push(newOtherAccount);

            //         tempLinkedList.push(accountInfo.linkedAccountKey);
            //     }
            // }

            let assets: Asset[] = [];

            for (let y = 0; y < accountInfo.mosaics.length; ++y) {
                let asset = accountInfo.mosaics[y];
                let assetIdHex = asset.id.toHex();

                let newAsset = new Asset(assetIdHex);
                newAsset.rawAmount = asset.amount.compact();

                // wallet.accounts[i].assets.push(newAsset);

                if(assetIdHex === AppState.nativeToken.assetId){
                    let foundIndex = idsHex.indexOf(assetIdHex);

                    if(foundIndex > -1){
                        let knowAssetInfo = AppState.assetsInfo[foundIndex];

                        WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
                        newAsset.updateExactAmount();
                        
                        wallet.accounts[i].updateBalance(assetIdHex)
                    }
                }

                assets.push(newAsset);
            }
            wallet.accounts[i].assets = assets;
            wallet.accounts[i].assetsLastUpdate = Date.now();
            wallet.accounts[i].updateBalance(AppState.nativeToken.assetId);
        }

        for (let i = 0; i < wallet.others.length; ++i) {

            let accountInfo = accountsInfo.find(x => x.address.plain() === wallet.others[i].address);

            if (!accountInfo) {
                continue;
            }

            wallet.others[i].version = accountInfo.version;
            wallet.others[i].linkedPublicKey = accountInfo.linkedAccountKey ?? "";
            wallet.others[i].supplementalPublicKeys = accountInfo.supplementalPublicKeys ?? null;

            let assets: Asset[] = [];

            for (let y = 0; y < accountInfo.mosaics.length; ++y) {
                let asset = accountInfo.mosaics[y];
                let assetIdHex = asset.id.toHex();
                let newAsset = new Asset(assetIdHex);
                newAsset.rawAmount = asset.amount.compact();

                // wallet.others[i].assets.push(newAsset);

                if(assetIdHex === AppState.nativeToken.assetId){
                    let foundIndex = idsHex.indexOf(assetIdHex);

                    if(foundIndex > -1){
                        let knowAssetInfo = AppState.assetsInfo[foundIndex];

                        WalletUtils.assetUpdateFromAssetInfo(knowAssetInfo, newAsset);
                        newAsset.updateExactAmount();
                        
                        wallet.others[i].updateBalance(assetIdHex)
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

        const list1: Address[] = accs.map((acc) => PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType).address)
        let namespacesInfo: NamespaceInfo[] = [];

        let numOfRequest = Math.ceil(list1.length / dataPerRequest);

        for (let i = 0; i < numOfRequest; ++i) {
            let startIndex = i * dataPerRequest;
            let endIndex = (i + 1) * dataPerRequest;

            let requestData = list1.slice(startIndex, endIndex);

            try {
                let tempNamespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespacesFromAccounts(requestData);

                namespacesInfo = namespacesInfo.concat(tempNamespaceInfo)
            } catch (error) {
                continue;
            }
        }

        for (let i = 0; i < accs.length; ++i) {

            let allOwnerNamespace = namespacesInfo.filter(x => x.owner.publicKey === accs[i].publicKey);

            if (allOwnerNamespace.length) {
                let namespacesInstance = allOwnerNamespace.map((nsInfo) => {
                    let nsId = nsInfo.id.toHex();
                    let knowNamespaceInfo = AppState.namespacesInfo.find(x => x.idHex === nsId);

                    let newNamespaceInstance = WalletUtils.namespaceInfoToNamespace(nsInfo);

                    if (knowNamespaceInfo) {
                        newNamespaceInstance.name = knowNamespaceInfo.name;
                        WalletUtils.namespaceInfoToNamespaceSync(nsInfo, knowNamespaceInfo);
                    }
                    else {
                        AppState.pendingNamespacesName.push(nsInfo);
                    }
                    
                    return newNamespaceInstance;
                });

                let oldAccNamespace = accs[i].namespaces.map(x => x.idHex);
                let stillValidNamespace = namespacesInstance.map(x => x.idHex);

                let removingNamespace = oldAccNamespace.filter(x => !stillValidNamespace.includes(x));

                for(let y =0; y < namespacesInstance.length; ++y){
                    let nsId = namespacesInstance[y].idHex;
                    let existingNamespace = accs[i].namespaces.find(x => x.idHex === nsId)

                    if(existingNamespace){
                        WalletUtils.namespaceToNamespaceSync(existingNamespace, namespacesInstance[y]);
                    }
                    else{
                        accs[i].namespaces.push(namespacesInstance[y]);
                    }
                }

                for(let y =0; y < removingNamespace.length; ++y){

                    accs[i].removeNamespace(removingNamespace[y]);
                }
            }
        }
    }

    static async updateAccountsNamespaceInfo(accs: MyAccount[]): Promise<void> {

        const list1: Address[] = accs.map((acc) => PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType).address)
        let namespacesInfo: NamespaceInfo[] = [];

        let numOfRequest = Math.ceil(list1.length / dataPerRequest);

        for (let i = 0; i < numOfRequest; ++i) {
            let startIndex = i * dataPerRequest;
            let endIndex = (i + 1) * dataPerRequest;

            let requestData = list1.slice(startIndex, endIndex);

            try {
                let tempNamespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespacesFromAccounts(requestData);

                namespacesInfo = namespacesInfo.concat(tempNamespaceInfo)
            } catch (error) {
                continue;
            }
        }

        for (let i = 0; i < accs.length; ++i) {

            let allOwnerNamespace = namespacesInfo.filter(x => x.owner.publicKey === accs[i].publicKey);

            if (allOwnerNamespace.length) {
                let namespacesInstance = allOwnerNamespace.map((nsInfo) => {
                    let knowNamespaceInfo = AppState.namespacesInfo.find(x => x.idHex === nsInfo.id.toHex());

                    let newNamespaceInstance = WalletUtils.namespaceInfoToNamespace(nsInfo);

                    if (knowNamespaceInfo) {
                        newNamespaceInstance.name = knowNamespaceInfo.name;
                        WalletUtils.namespaceInfoToNamespaceSync(nsInfo, knowNamespaceInfo);
                    }
                    else {
                        AppState.pendingNamespacesName.push(nsInfo);
                    }
                    return newNamespaceInstance;
                });
                accs[i].namespaces = namespacesInstance;
            }
        }
    }

    static async updateWalletAccountsNamespaceInfo(wallet: Wallet): Promise<void> {

        const list1: Address[] = wallet.accounts.map((acc) => PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType).address)
        const list2: Address[] = wallet.others.map((acc) => PublicAccount.createFromPublicKey(acc.publicKey, AppState.networkType).address);
        let accountAddressList = list1.concat(list2);
        let namespacesInfo: NamespaceInfo[] = [];

        let numOfRequest = Math.ceil(accountAddressList.length / dataPerRequest);

        for (let i = 0; i < numOfRequest; ++i) {
            let startIndex = i * dataPerRequest;
            let endIndex = (i + 1) * dataPerRequest;

            let requestData = accountAddressList.slice(startIndex, endIndex);

            try {
                let tempNamespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespacesFromAccounts(requestData);

                namespacesInfo = namespacesInfo.concat(tempNamespaceInfo)
            } catch (error) {
                continue;
            }
        }

        for (let i = 0; i < wallet.accounts.length; ++i) {

            let allOwnerNamespace = namespacesInfo.filter(x => x.owner.publicKey === wallet.accounts[i].publicKey);

            if (allOwnerNamespace.length) {
                let namespacesInstance = allOwnerNamespace.map((nsInfo) => {
                    let knowNamespaceInfo = AppState.namespacesInfo.find(x => x.idHex === nsInfo.id.toHex());

                    let newNamespaceInstance = WalletUtils.namespaceInfoToNamespace(nsInfo);

                    if (knowNamespaceInfo) {
                        newNamespaceInstance.name = knowNamespaceInfo.name;
                        WalletUtils.namespaceInfoToNamespaceSync(nsInfo, knowNamespaceInfo);
                    }
                    else {
                        AppState.pendingNamespacesName.push(nsInfo);
                    }
                    return newNamespaceInstance;
                });
                wallet.accounts[i].namespaces = namespacesInstance;
            }
        }

        for (let i = 0; i < wallet.others.length; ++i) {

            let allOwnerNamespace = namespacesInfo.filter(x => x.owner.publicKey === wallet.others[i].publicKey);

            if (allOwnerNamespace.length) {
                let namespacesInstance = allOwnerNamespace.map((nsInfo) => {
                    let knowNamespaceInfo = AppState.namespacesInfo.find(x => x.idHex === nsInfo.id.toHex());

                    let newNamespaceInstance = WalletUtils.namespaceInfoToNamespace(nsInfo);

                    if (knowNamespaceInfo) {
                        newNamespaceInstance.name = knowNamespaceInfo.name;
                        WalletUtils.namespaceInfoToNamespaceSync(nsInfo, knowNamespaceInfo);
                    }
                    else {
                        AppState.pendingNamespacesName.push(nsInfo);
                    }
                    return newNamespaceInstance;
                });
                wallet.others[i].namespaces = namespacesInstance;
            }
        }
    }

    static assetInfoToAsset(assetInfo: AssetInfo): Asset {
        let asset = new Asset(assetInfo.idHex);
        asset.divisibility = assetInfo.divisibility;
        asset.supplyMutable = assetInfo.supplyMutable;
        asset.disableLocking = assetInfo.disableLocking;
        asset.supplyForceImmutable = assetInfo.supplyForceImmutable;
        asset.restrictable = assetInfo.restrictable;
        asset.supplyMutable = assetInfo.supplyMutable;
        asset.supply = assetInfo.supply;
        asset.creator = assetInfo.creator;
        asset.duration = assetInfo.duration;
        asset.height = assetInfo.height;
        asset.namespaceNames = assetInfo.namespaceNames;

        return asset;
    }

    static assetInfoCreateFromMosaicInfo(assetInfo: MosaicInfo): AssetInfo {
        let asset = new AssetInfo(
            assetInfo.mosaicId.toHex(),
            assetInfo.divisibility,
            assetInfo.isSupplyMutable(),
            assetInfo.isTransferable(),
            assetInfo.isRestrictable(),
            assetInfo.isSupplyForceImmutable(),
            assetInfo.isDisableLocking(),
            assetInfo.owner.publicKey
        );
        asset.supply = assetInfo.supply.compact();
        asset.duration = assetInfo.duration.compact();
        asset.height = assetInfo.height.compact();

        return asset;
    }

    static assetUpdateFromAssetInfo(assetInfo: AssetInfo, assetToUpdate: Asset): void {
        assetToUpdate.divisibility = assetInfo.divisibility;
        assetToUpdate.supplyMutable = assetInfo.supplyMutable;
        assetToUpdate.transferable = assetInfo.transferable;
        assetToUpdate.restrictable = assetInfo.restrictable;
        assetToUpdate.disableLocking = assetInfo.disableLocking;
        assetToUpdate.supplyForceImmutable = assetInfo.supplyForceImmutable;
        assetToUpdate.supply = assetInfo.supply;
        assetToUpdate.creator = assetInfo.creator;
        assetToUpdate.duration = assetInfo.duration;
        assetToUpdate.height = assetInfo.height;
        assetToUpdate.namespaceNames = assetInfo.namespaceNames;
    }

    static assetInfoUpdateFromAssetInfo(assetInfo: AssetInfo, assetInfoToUpdate: AssetInfo, updateNames: boolean = false): void {
        assetInfoToUpdate.divisibility = assetInfo.divisibility;
        assetInfoToUpdate.supplyMutable = assetInfo.supplyMutable;
        assetInfoToUpdate.transferable = assetInfo.transferable;
        assetInfoToUpdate.restrictable = assetInfo.restrictable;
        assetInfoToUpdate.supplyForceImmutable = assetInfo.supplyForceImmutable;
        assetInfoToUpdate.disableLocking = assetInfo.disableLocking;
        assetInfoToUpdate.supply = assetInfo.supply;
        assetInfoToUpdate.creator = assetInfo.creator;
        assetInfoToUpdate.duration = assetInfo.duration;
        assetInfoToUpdate.height = assetInfo.height;
        if(updateNames){
            assetInfoToUpdate.namespaceNames = assetInfo.namespaceNames;
        }
        if(assetInfo.doneChecking){
            assetInfoToUpdate.doneChecking = assetInfo.doneChecking;
        }
    }

    static namespaceInfoToNamespace(nsInfo: NamespaceInfo): Namespace {

        let namespace = new Namespace(nsInfo.id.toHex());
        namespace.active = nsInfo.active;
        namespace.startHeight = nsInfo.startHeight.compact();
        namespace.endHeight = nsInfo.endHeight.compact();
        namespace.owner = nsInfo.owner.publicKey;
        namespace.parentId = nsInfo.isSubnamespace() ? nsInfo.parentNamespaceId().toHex() : "";
        namespace.linkType = nsInfo.alias.type;
        if (nsInfo.alias.type !== AliasType.None) {
            namespace.linkedId = nsInfo.alias.type === AliasType.Address ?
                nsInfo.alias.address.plain() : nsInfo.alias.mosaicId.toHex()
        }

        return namespace;
    }

    static namespaceInfoToNamespaceSync(nsInfo: NamespaceInfo, cachedData: Namespace): void {

        cachedData.active = nsInfo.active;
        cachedData.startHeight = nsInfo.startHeight.compact();
        try{
            cachedData.endHeight = nsInfo.endHeight.compact();
        }catch(error){
            cachedData.endHeight = nsInfo.endHeight.toHex();
        }
        cachedData.owner = nsInfo.owner.publicKey;
        // cachedData.parentId = nsInfo.isSubnamespace() ? nsInfo.parentNamespaceId().toHex() : "";
        cachedData.linkType = nsInfo.alias.type;
        if (nsInfo.alias.type !== AliasType.None) {
            cachedData.linkedId = nsInfo.alias.type === AliasType.Address ?
                nsInfo.alias.address.plain() : nsInfo.alias.mosaicId.toHex()
        }
    }

    static namespaceToNamespaceSync(nsToUpdate: Namespace, nsUpdateFrom: Namespace): void {

        nsToUpdate.active = nsUpdateFrom.active;
        nsToUpdate.startHeight = nsUpdateFrom.startHeight;
        nsToUpdate.endHeight = nsUpdateFrom.endHeight;
        nsToUpdate.owner = nsUpdateFrom.owner;
        nsToUpdate.linkType = nsUpdateFrom.linkType;
        nsToUpdate.linkedId = nsUpdateFrom.linkedId;
    }
    
    static async reloadAddedAccount(accountName: string) {
        if (walletState.currentLoggedInWallet === null) {
            return;
        }
        let acc = (walletState.currentLoggedInWallet as Wallet).accounts.find(x => x.name === accountName);

        if (!acc) {
            return;
        }

        let otherAcc = walletState.currentLoggedInWallet.others.find(x => x.publicKey === acc.publicKey);

        if(otherAcc){
            walletState.currentLoggedInWallet.removeOtherAccount(otherAcc.publicKey);
        }

        await WalletUtils.updateMultisigDetails(acc);

        let addedAccPubKey = WalletUtils.populateOtherSingleAccountTypeMultisig(acc);
        let addedAccPubKey2 = await WalletUtils.updateAccountsInfo([acc], true);
        await WalletUtils.updateAccountsNamespaceInfo([acc]);

        let allAddedAcc = addedAccPubKey.concat(addedAccPubKey2);

        WalletUtils.getAccsCreatorExtraAssets([acc]);

        if(allAddedAcc.length){
            WalletUtils.loadOtherAccounts(allAddedAcc);
        }
        else{
            WalletUtils.runAssetNamespaceInfoLoadBackground(false);
        }
    }

    static async refreshOtherAccounts(otherAccounts: OtherAccount[]) {
        if (walletState.currentLoggedInWallet === null) {
            return;
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
            return;
        }

        let accs: MyAccount[] = (walletState.currentLoggedInWallet as Wallet).others.filter(x => allAddedAccPubKey.includes(x.publicKey));

        for (let i = 0; i < accs.length; ++i) {
            WalletUtils.updateMultisigDetails(accs[i]);
        }

        await WalletUtils.updateAccountsInfo(accs, false);
        await WalletUtils.updateAccountsNamespaceInfo(accs);
        
        await WalletUtils.getAccsCreatorExtraAssets(accs);
        WalletUtils.runAssetNamespaceInfoLoadBackground(false);
    }

    static async confirmedTransactionRefresh(accs: MyAccount[]): Promise<void> {
        if (walletState.currentLoggedInWallet === null) {
            return;
        }

        let chainHeight = await AppState.chainAPI.chainAPI.getBlockchainHeight();

        AppState.readBlockHeight = chainHeight;

        let allPubKey = accs.map(x => x.publicKey);
        let otherAccounts = (walletState.currentLoggedInWallet as Wallet).others.filter(x => x.type === OtherAcountType.MULTISIG_CHILD && allPubKey.includes(x.publicKey));

        for(let i = 0; i < accs.length; ++i){
            await WalletUtils.updateMultisigDetails(accs[i]);
        }

        let pubKeyToRemove = WalletUtils.checkRemovedMultisig(otherAccounts);

        for(let i = 0; i < pubKeyToRemove.length; ++i){
            walletState.currentLoggedInWallet.removeOtherAccount(pubKeyToRemove[i]);
        }

        let newAccs: MyAccount[] = accs.filter(x => !pubKeyToRemove.includes(x.publicKey));
        let newWalletAccs: WalletAccount[] = newAccs.filter(x => x instanceof WalletAccount).map(x => x as WalletAccount);
        let otherAccs: OtherAccount[] = newAccs.filter(x => x instanceof OtherAccount).map(x => x as OtherAccount);

        let allAddedAccPubKey: string[] = [];

        for(let i = 0; i < newWalletAccs.length; ++i){
            let addedAccPubKey = WalletUtils.populateOtherSingleAccountTypeMultisig(newWalletAccs[i]);

            allAddedAccPubKey = allAddedAccPubKey.concat(addedAccPubKey);
        }

        if(newWalletAccs.length){
            let newAddedAccPubKey = await WalletUtils.refreshAccountsInfo(newWalletAccs, true);
            await WalletUtils.refreshAccountsNamespaceInfo(newWalletAccs);

            allAddedAccPubKey = allAddedAccPubKey.concat(newAddedAccPubKey);

            WalletUtils.syncAccNamespaceName();
        }
        
        await WalletUtils.getAccsCreatorExtraAssets(newWalletAccs);
        if(otherAccs.length){
            WalletUtils.refreshOtherAccounts(otherAccs)
        }

        if(allAddedAccPubKey.length){
            WalletUtils.loadOtherAccounts(allAddedAccPubKey);
        }

        if(allAddedAccPubKey.length === 0 && otherAccs.length === 0){
            WalletUtils.runAssetNamespaceInfoLoadBackground(false);
        }
    }

    static async refreshAllAccountDetails(wallet: Wallet, networkProfile: ChainProfile): Promise<void> {

        if (wallet === null) {
            return;
        }

        wallet.isReady = false;
        wallet.others = [];

        try {
            let chainHeight = await AppState.chainAPI.chainAPI.getBlockchainHeight();
            let assetId = await AppState.chainAPI.namespaceAPI.getLinkedMosaicId(Helper.createNamespaceId(networkProfile.network.currency.namespace));
            let nativeAssetInfo = await AppState.chainAPI.assetAPI.getMosaic(assetId);

            AppState.readBlockHeight = chainHeight;
            AppState.nativeToken.assetId = assetId.toHex();
            AppState.nativeToken.creator = nativeAssetInfo.owner.publicKey;
            AppState.nativeToken.divisibility = nativeAssetInfo.divisibility;
            networkProfile.network.currency.assetId = assetId.toHex();
            networkProfile.network.currency.divisibility = nativeAssetInfo.divisibility;
            networkProfile.saveToLocalStorage();

            let firstAssetInfo = new AssetInfo(
                assetId.toHex(), nativeAssetInfo.divisibility,
                nativeAssetInfo.isSupplyMutable(),
                nativeAssetInfo.isTransferable(),
                nativeAssetInfo.isRestrictable(),
                nativeAssetInfo.isSupplyForceImmutable(),
                nativeAssetInfo.isDisableLocking(),
                nativeAssetInfo.owner.publicKey
            );

            firstAssetInfo.supply = nativeAssetInfo.supply.compact();
            firstAssetInfo.namespaceNames = [AppState.nativeToken.fullNamespace];
            firstAssetInfo.doneChecking = true;

            if (!AppState.assetsInfo.find(x => x.idHex === firstAssetInfo.idHex)) {
                AppState.assetsInfo.push(firstAssetInfo);
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

    static runAssetNamespaceInfoLoadBackground(runSync: boolean = true){
        
        if (AppState.pendingAssetsInfo.length) {
            // console.log("getPendingAssetsInfo");
            WalletUtils.getPendingAssetsInfo();
        }

        if (AppState.pendingNamespacesName.length) {
            // console.log("getPendingNamespaceName");
            WalletUtils.getPendingNamespaceName();
        }

        if(runSync){
            // console.log("syncAccNamespaceName");
            WalletUtils.syncAccNamespaceName();
        }
    }

    /**
     * Get non holding assets of accounts (creator)
     * @param wallet 
     */
    static async getWalletCreatorExraAssets(wallet: Wallet): Promise<void> {

        let queryParams: MosaicQueryParams = new MosaicQueryParams();
        queryParams.pageSize = 100;
        queryParams.pageNumber = 1;

        let accsAssetHold: AccountAssetHold[] = [];
        let assetSearchList = [];

        for (let i = 0; i < wallet.accounts.length; ++i) {

            queryParams.ownerFilters = new MosaicCreatorFilters(wallet.accounts[i].publicKey);
            queryParams.ownerFilters.holding = false;

            assetSearchList.push(AppState.chainAPI.assetAPI.searchMosaics(queryParams));

            if (assetSearchList.length === 50) {
                let assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(assetSearchList);

                const tempAccsAssetHold = WalletUtils.extractAccsAssetSearch(assetSearches);
                accsAssetHold = accsAssetHold.concat(tempAccsAssetHold);
                assetSearchList = [];

                await delay(250);
            }
        }

        for (let i = 0; i < wallet.others.length; ++i) {

            queryParams.ownerFilters = new MosaicCreatorFilters(wallet.others[i].publicKey);
            queryParams.ownerFilters.holding = false;

            assetSearchList.push(AppState.chainAPI.assetAPI.searchMosaics(queryParams));

            if (assetSearchList.length === 50) {
                let assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(assetSearchList);

                const tempAccsAssetHold = WalletUtils.extractAccsAssetSearch(assetSearches);
                accsAssetHold = accsAssetHold.concat(tempAccsAssetHold);
                assetSearchList = [];

                await delay(250);
            }
        }

        if (assetSearchList.length) {
            let assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(assetSearchList);

            const tempAccsAssetHold = WalletUtils.extractAccsAssetSearch(assetSearches);
            accsAssetHold = accsAssetHold.concat(tempAccsAssetHold);
            assetSearchList = [];

            await delay(250);
        }

        let allAccs: MyAccount[] = wallet.accounts.map(x => x as MyAccount).concat(wallet.others.map(x => x as MyAccount));
        let subsequenceQueryData: CreatorAssets[] = [];

        for(let i = 0; i < accsAssetHold.length; ++i){
            let totalPages = accsAssetHold[i].totalPages;
            let queryingPublicKey = accsAssetHold[i].publicKey;

            for(let y=2; y <= totalPages; ++y){

                queryParams.ownerFilters = new MosaicCreatorFilters(queryingPublicKey);
                queryParams.ownerFilters.holding = false;
                queryParams.pageNumber = y;

                assetSearchList.push(AppState.chainAPI.assetAPI.searchMosaics(queryParams));

                if (assetSearchList.length === 50) {
                    let assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(assetSearchList);

                    let creatorAssets = WalletUtils.assignAccAsset(assetSearches);
                    subsequenceQueryData = subsequenceQueryData.concat(creatorAssets);
                    assetSearchList = [];

                    await delay(250);
                }
            }
        }

        if (assetSearchList.length) {
            let assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(assetSearchList);

            let creatorAssets = WalletUtils.assignAccAsset(assetSearches);
            subsequenceQueryData = subsequenceQueryData.concat(creatorAssets);
            assetSearchList = [];
        }

        for(let i=0; i < accsAssetHold.length; ++i){

            let filteredData = subsequenceQueryData.filter(x => x.publicKey === accsAssetHold[i].publicKey);

            if(filteredData.length){
                accsAssetHold[i].assetsInfo = accsAssetHold[i].assetsInfo.concat(...filteredData.map(x=> x.assetsInfo));
            }
        }

        let accPublicKeyWithAsset = accsAssetHold.map(x => x.publicKey);
        let assetList: AssetInfo[] = [];

        for(let i=0; i < allAccs.length; ++i){

            let currentPublicKey = allAccs[i].publicKey;

            if(accPublicKeyWithAsset.includes(currentPublicKey)){
                let currentAssetsInfo = accsAssetHold.find(x=> x.publicKey === currentPublicKey).assetsInfo;
                assetList = assetList.concat(currentAssetsInfo);
                allAccs[i].nonHoldingAssets = assetList.map(x => WalletUtils.assetInfoToAsset(x));
            }
        }
        
        WalletUtils.addAppStateAssetInfo(assetList);
        WalletUtils.updatePendingAssetInfo(assetList);
    }

    static async getAccsCreatorExtraAssets(accs: MyAccount[]): Promise<void> {

        let queryParams: MosaicQueryParams = new MosaicQueryParams();
        queryParams.pageSize = 100;
        queryParams.pageNumber = 1;

        let assetSearchList = [];
        let accsAssetHold: AccountAssetHold[] = [];

        for (let i = 0; i < accs.length; ++i) {
            queryParams.ownerFilters = new MosaicCreatorFilters(accs[i].publicKey);
            queryParams.ownerFilters.holding = false;

            assetSearchList.push(AppState.chainAPI.assetAPI.searchMosaics(queryParams));

            if (assetSearchList.length === 50) {
                let assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(assetSearchList);

                const tempAccsAssetHold = WalletUtils.extractAccsAssetSearch(assetSearches);
                accsAssetHold = accsAssetHold.concat(tempAccsAssetHold);
                assetSearchList = [];

                await delay(250);
            }
        }

        if (assetSearchList.length) {
            let assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(assetSearchList);

            const tempAccsAssetHold = WalletUtils.extractAccsAssetSearch(assetSearches);
            accsAssetHold = accsAssetHold.concat(tempAccsAssetHold);
            assetSearchList = [];

            await delay(250);
        }

        let subsequenceQueryData: CreatorAssets[] = [];

        for(let i = 0; i < accsAssetHold.length; ++i){
            let totalPages = accsAssetHold[i].totalPages;
            let queryingPublicKey = accsAssetHold[i].publicKey;

            for(let y=2; y <= totalPages; ++y){

                queryParams.ownerFilters = new MosaicCreatorFilters(queryingPublicKey);
                queryParams.ownerFilters.holding = false;
                queryParams.pageNumber = y;

                assetSearchList.push(AppState.chainAPI.assetAPI.searchMosaics(queryParams));

                if (assetSearchList.length === 50) {
                    let assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(assetSearchList);

                    let creatorAssets = WalletUtils.assignAccAsset(assetSearches);
                    subsequenceQueryData = subsequenceQueryData.concat(creatorAssets);
                    assetSearchList = [];

                    await delay(250);
                }
            }
        }

        if (assetSearchList.length) {
            let assetSearches: MosaicSearch[] = await Promise.all<MosaicSearch>(assetSearchList);

            let creatorAssets = WalletUtils.assignAccAsset(assetSearches);
            subsequenceQueryData = subsequenceQueryData.concat(creatorAssets);
            assetSearchList = [];
        }

        for(let i=0; i < accsAssetHold.length; ++i){

            let filteredData = subsequenceQueryData.filter(x => x.publicKey === accsAssetHold[i].publicKey);

            if(filteredData.length){
                accsAssetHold[i].assetsInfo = accsAssetHold[i].assetsInfo.concat(...filteredData.map(x=> x.assetsInfo));
            }
        }

        let accPublicKeyWithAsset = accsAssetHold.map(x => x.publicKey);
        let assetList: AssetInfo[] = [];

        for(let i=0; i < accs.length; ++i){

            let currentPublicKey = accs[i].publicKey;

            if(accPublicKeyWithAsset.includes(currentPublicKey)){
                let currentAssetsInfo = accsAssetHold.find(x=> x.publicKey === currentPublicKey).assetsInfo;
                assetList = assetList.concat(currentAssetsInfo);
                accs[i].nonHoldingAssets = assetList.map(x => WalletUtils.assetInfoToAsset(x));
            }
        }

        if(assetList.length){
            WalletUtils.addAppStateAssetInfo(assetList);
        }

        WalletUtils.updatePendingAssetInfo(assetList);
    }

    static updatePendingAssetInfo(assetsInfo: AssetInfo[]){

        if(assetsInfo.length === 0){
            return;
        }

        let idToCompare = assetsInfo.map(x => x.idHex);
        let pendingAssetsInfo = Array.from(new Set(AppState.pendingAssetsInfo));
        let newList: string[] = pendingAssetsInfo.filter(x => !idToCompare.includes(x));

        // for(let i=0; i < AppState.pendingAssetsInfo.length; ++i){
        //     let foundPendingInfo = assetsInfo.find( x => x.idHex === AppState.pendingAssetsInfo[i]);
            
        //     if(!foundPendingInfo){
        //         newList.push(AppState.pendingAssetsInfo[i]);
        //     }
        // }

        AppState.pendingAssetsInfo = newList;
    }

    static addAppStateAssetInfo(assetsInfo: AssetInfo[]){

        if(assetsInfo.length === 0){
            return;
        }

        let assetsInfoId = AppState.assetsInfo.map(x => x.idHex);

        for(let i=0; i < assetsInfo.length; ++i){
            let index = assetsInfoId.indexOf(assetsInfo[i].idHex);

            if(index === -1){
                AppState.assetsInfo.push(assetsInfo[i]);
            }
            else{
                let assetInfo = AppState.assetsInfo[index];
                WalletUtils.assetInfoUpdateFromAssetInfo(assetsInfo[i], assetInfo, assetsInfo[i].namespaceNames.length > 0);
            }
        }

        sessionStorage.setItem(assetInfoSessionKey, JSON.stringify(AppState.assetsInfo));
    }

    static assignAccAsset(assetsSearches: MosaicSearch[]){

        let data: CreatorAssets[] = [];

        for(let i = 0; i < assetsSearches.length; ++i){
            if(assetsSearches[i].mosaicsInfo.length){
                let assetsInfo = assetsSearches[i].mosaicsInfo;
                let tempAssetsInfo = assetsInfo.map(x => 
                    WalletUtils.assetInfoCreateFromMosaicInfo(x)
                )
                let creatorAsset: CreatorAssets = {
                    assetsInfo: tempAssetsInfo,
                    publicKey: assetsSearches[i].mosaicsInfo[0].owner.publicKey
                }
                data.push(creatorAsset);
            }
        }
        return data;
    }

    static extractAccsAssetSearch(assetsSearches: MosaicSearch[]): AccountAssetHold[]{

        let accsAssetHold: AccountAssetHold[] = [];

        for(let i = 0; i < assetsSearches.length; ++i){
            if(assetsSearches[i].pagination.totalEntries){
                let assetsInfo = assetsSearches[i].mosaicsInfo;
                let newAccAssetHold: AccountAssetHold = {
                    publicKey: assetsSearches[i].mosaicsInfo[0].owner.publicKey,
                    totalPages: assetsSearches[i].pagination.totalPages,
                    totalEntries: assetsSearches[i].pagination.totalEntries,
                    currentPage: 1,
                    assetsInfo: assetsInfo.map(data => WalletUtils.assetInfoCreateFromMosaicInfo(data))
                }

                accsAssetHold.push(newAccAssetHold);
            }
        }

        return accsAssetHold;
    }

    static async getPendingNamespaceName() {
        let numOfRequest = Math.ceil(AppState.pendingNamespacesName.length / dataPerRequest);

        let data: NamespaceInfo[] = AppState.pendingNamespacesName as NamespaceInfo[];

        AppState.pendingNamespacesName = [];

        for (let i = 0; i < numOfRequest; ++i) {
            let startIndex = i * dataPerRequest;
            let endIndex = (i + 1) * dataPerRequest;

            let requestData: NamespaceInfo[] = data.slice(startIndex, endIndex);
            let requestingData: NamespaceId[] = requestData.map(x => x.id);

            try {
                let tempNamespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespacesName(requestingData);

                for (let y = 0; y < tempNamespaceInfo.length; ++y) {

                    let nsInfo = data.find(x => x.id.toHex() === tempNamespaceInfo[y].namespaceId.toHex());
                    let namespace = WalletUtils.namespaceInfoToNamespace(nsInfo);
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

        let numOfRequest = Math.ceil(AppState.pendingAssetsInfo.length / dataPerRequest);
        let newAssetsInfo: AssetInfo[] = [];

        let data: MosaicId[] = AppState.pendingAssetsInfo.map(x => new MosaicId(x));

        AppState.pendingAssetsInfo = [];

        for (let i = 0; i < numOfRequest; ++i) {
            let startIndex = i * dataPerRequest;
            let endIndex = (i + 1) * dataPerRequest;

            let requestData: MosaicId[] = data.slice(startIndex, endIndex);

            try {
                await delay(50);

                let tempAssetsInfo = await AppState.chainAPI.assetAPI.getMosaics(requestData);
                let tempAssetNames = await AppState.chainAPI.assetAPI.getMosaicsNames(requestData);

                for (let y = 0; y < tempAssetsInfo.length; ++i) {
                    let newAssetInfo = WalletUtils.assetInfoCreateFromMosaicInfo(tempAssetsInfo[i]);

                    let tempNames = tempAssetNames.find(x => x.mosaicId.toHex() === tempAssetsInfo[i].mosaicId.toHex());

                    if (tempNames) {
                        newAssetInfo.namespaceNames = tempNames.names.map(x => x.name);
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

    static loadAllAccountAsset(){

        if(walletState.currentLoggedInWallet === null){
            return null;
        }

        let wallet = walletState.currentLoggedInWallet;
        let idsHex = AppState.assetsInfo.map(x => x.idHex);

        for(let i = 0; i < wallet.accounts.length; ++i){

            let assets = wallet.accounts[i].assets.filter(x => x.divisibility === null || x.namespaceNames.length === 0);

            for(let y=0; y < assets.length; ++y){
                let idHex = assets[y].idHex;
                let index = idsHex.indexOf(idHex);

                if(index > -1){
                    let assetInfo = AppState.assetsInfo[index];

                    if(assetInfo){
                        WalletUtils.assetUpdateFromAssetInfo(assetInfo, assets[y]);
                        assets[y].updateExactAmount();
                        assets[y].updateExpirationBlock();
                    }
                }
            }
        }

        for(let i = 0; i < wallet.others.length; ++i){
            let assets = wallet.others[i].assets.filter(x => x.divisibility === null || x.namespaceNames.length === 0);

            for(let y=0; y < assets.length; ++y){

                let idHex = assets[y].idHex;
                let index = idsHex.indexOf(idHex);

                if(index > -1){
                    let assetInfo = AppState.assetsInfo[index];

                    if(assetInfo){
                        WalletUtils.assetUpdateFromAssetInfo(assetInfo, assets[y]);
                        assets[y].updateExactAmount();
                        assets[y].updateExpirationBlock();
                    }
                }
            }
        }
    }

    static loadAllAccountNamespaceName(){

        sessionStorage.setItem(namespaceInfoSessionKey, JSON.stringify(AppState.namespacesInfo));

        if(walletState.currentLoggedInWallet === null){
            return null;
        }

        let wallet = walletState.currentLoggedInWallet;

        for(let i = 0; i < wallet.accounts.length; ++i){

            let namespaces = wallet.accounts[i].namespaces.filter(x => x.name === "");

            for(let y=0; y < namespaces.length; ++y){
                let namespaceInfo = AppState.namespacesInfo.find(x => x.idHex === namespaces[y].idHex);
                namespaces[y].name = namespaceInfo.name;
            }
        }

        for(let i = 0; i < wallet.others.length; ++i){
            let namespaces = wallet.others[i].namespaces.filter(x => x.name === "");

            for(let y=0; y < namespaces.length; ++y){
                let namespaceInfo = AppState.namespacesInfo.find(x => x.idHex === namespaces[y].idHex);
                namespaces[y].name = namespaceInfo.name;
            }
        }  
    }

    static async updateAssetInfoNamespaces(){

        if(walletState.currentLoggedInWallet === null){
            return;
        }

        let wallet = walletState.currentLoggedInWallet;
        let allPubKeys = wallet.accounts.map(x => x.publicKey).concat(wallet.others.map(x => x.publicKey));

        let assetIds: MosaicId[] = AppState.assetsInfo.filter(x => x.doneChecking === false || !allPubKeys.includes(x.creator)).map(x => new MosaicId(x.idHex));

        for(let i=0; i < AppState.assetsInfo.length; ++i){
            AppState.assetsInfo[i].doneChecking = true;
        }

        let numOfRequest = Math.ceil(assetIds.length / dataPerRequest);

        for (let i = 0; i < numOfRequest; ++i) {
            let startIndex = i * dataPerRequest;
            let endIndex = (i + 1) * dataPerRequest;

            let requestData: MosaicId[] = assetIds.slice(startIndex, endIndex);

            try {
                let tempAssetNames: MosaicNames[] = await AppState.chainAPI.assetAPI.getMosaicsNames(requestData);

                WalletUtils.updateAssetInfoNames(tempAssetNames);

            } catch (error) {
                
            }
        }

        sessionStorage.setItem(assetInfoSessionKey, JSON.stringify(AppState.assetsInfo));
    }

    static updateAssetInfoNames(assetsNames: MosaicNames[]){

        let idsHex = AppState.assetsInfo.map(x => x.idHex);

        for(let i = 0; i < assetsNames.length; ++i){
            let index = idsHex.indexOf(assetsNames[i].mosaicId.toHex());

            if(index > -1){
                let assetInfo = AppState.assetsInfo[index];
                assetInfo.namespaceNames = assetsNames[i].names.map(x => x.name);
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

    static initFixOldFormat(oldWallets: oldWltFile[], networkName: string, networkType: NetworkType): void {
        let walletsInstance = new Wallets();
        let wallets: Wallet[] = [];
        let prefix = networkType === NetworkType.MAIN_NET ? "sw-books-mainnet-" : "sw-books-testnet-";

        oldWallets.forEach((wallet) => {

            let newWallet = new Wallet(wallet.name, networkName, []);
            let walletAccounts: WalletAccount[] = [];

            wallet.accounts.filter(acc => acc.encrypted).forEach((account) => {

                let stringJSON = JSON.stringify(account);

                let newWalletAccount = WalletUtils.createNewWalletAccountFromOldFormat(stringJSON);
                newWalletAccount.fixAddress(networkType);

                walletAccounts.push(newWalletAccount);
            });

            newWallet.accounts = walletAccounts;

            let allWalletContacts: AddressBook[] = WalletUtils.oldFormatCollectAddressBook(wallet.name, prefix);

            newWallet.contacts = allWalletContacts;
            wallets.push(newWallet);
        });

        walletsInstance.wallets = wallets;
        walletsInstance.savetoLocalStorage();
        WalletStateUtils.refreshWallets();
    }

    static oldFormatCollectAddressBook(walletName: string, prefix: string): AddressBook[] {
        let allWalletContacts: AddressBook[] = [];

        if (localStorage.getItem(prefix + walletName)) {
            let accountAddressBooks: any[] = JSON.parse(localStorage.getItem(prefix + walletName));

            for (let i = 0; i < accountAddressBooks.length; ++i) {
                // if(accountAddressBooks[i].walletContact){
                allWalletContacts.push(new AddressBook(accountAddressBooks[i].label, accountAddressBooks[i].value, "-none-"));
                // }
            }
        }

        return allWalletContacts;
    }

    static oldFormatToNewFormat(oldWallet: oldWltFile, networkName: string, networkType: NetworkType, contacts: AddressBook[]): Wallet {
        let walletAccounts: WalletAccount[] = [];

        oldWallet.accounts.filter(acc => acc.encrypted).forEach((account) => {

            let stringJSON = JSON.stringify(account);

            let newWalletAccount = WalletUtils.createNewWalletAccountFromOldFormat(stringJSON);
            newWalletAccount.fixAddress(networkType);

            walletAccounts.push(newWalletAccount);
        });

        let newWallet = new Wallet(oldWallet.name, networkName, walletAccounts);

        newWallet.contacts = contacts;

        return newWallet;
    }

    static addNewWallet(allWallets: Wallets, password: Password, walletName: string, networkName: string, networkType: NetworkType, version: number): tempNewWalletInterface {
        const account = Account.generateNewAccount(networkType, version);
        const wallet = WalletUtils.createAccountSimpleFromPrivateKey(walletName, password, account.privateKey, networkType, version);
        let walletAccounts: WalletAccount[] = [];
        let walletAccount = new WalletAccount('Primary', account.publicKey, wallet.publicAccount.address.plain(), "pass:bip32", 
                wallet.encryptedPrivateKey.encryptedKey, wallet.encryptedPrivateKey.iv, wallet.version);
        walletAccount.isBrain = true;
        walletAccount.default = true;
        walletAccounts.push(walletAccount);
        let newWalletInstance = new Wallet(walletName, networkName, walletAccounts);

        allWallets.wallets.push(newWalletInstance);
        allWallets.savetoLocalStorage();

        let data: tempNewWalletInterface = {
            wallet: walletAccount,
            privateKey: account.privateKey
        };

        return data;
    }

    static addNewWalletWithPrivateKey(allWallets: Wallets, privateKey: string, password: Password, walletName: string, networkName: string, networkType: NetworkType, version: number): WalletAccount {
        console.log(version);
        const account = Account.createFromPrivateKey(privateKey, networkType, version);
        const wallet = WalletUtils.createAccountSimpleFromPrivateKey(walletName, password, privateKey, networkType, version);
        console.log(wallet);
        let walletAccounts: WalletAccount[] = [];
        let walletAccount = new WalletAccount('Primary', account.publicKey, wallet.publicAccount.address.plain(), "pass:bip32", wallet.encryptedPrivateKey.encryptedKey, wallet.encryptedPrivateKey.iv, version);
        console.log(walletAccount);
        walletAccount.isBrain = true;
        walletAccount.default = true;
        walletAccounts.push(walletAccount);
        let newWalletInstance = new Wallet(walletName, networkName, walletAccounts);

        allWallets.wallets.push(newWalletInstance);
        allWallets.savetoLocalStorage();

        return walletAccount;
    }

    static getAllMultisigAccount(wallet: Wallet): MyAccount[] {

        let allMultisigAccount: MyAccount[] = [];

        let multisigAccount: MyAccount[] = wallet.accounts.filter((acc) => acc.getDirectParentMultisig().length > 0);
        let otherMultisigAccount: MyAccount[] = wallet.others.filter((account) => account.type === "MULTISIG");
        allMultisigAccount = multisigAccount.concat(otherMultisigAccount);

        return allMultisigAccount;
    }

    static getAllMultisigInfoByPublicKey(wallet: Wallet, publicKey: string): MultisigInfo[] {

        let account: WalletAccount = wallet.accounts.find((acc) => acc.publicKey === publicKey);

        if (account) {
            return account.multisigInfo;
        }

        let otherAccount: OtherAccount = wallet.others.find((acc) => acc.publicKey === publicKey);

        if (otherAccount) {
            return otherAccount.multisigInfo;
        }

        return [];
    }

    static getWalletMultisigInfo(wallet: Wallet): PublicKeyMultisigInfos[] {

        let data: PublicKeyMultisigInfos[] = [];
        let multisigAccounts = WalletUtils.getAllMultisigAccount(wallet);

        for (let i = 0; i < multisigAccounts.length; ++i) {
            let multisigInfos = WalletUtils.getAllMultisigInfoByPublicKey(wallet, multisigAccounts[i].publicKey);
            data.push({
                publicKey: multisigAccounts[i].publicKey,
                multisigInfos: multisigInfos
            });
        }

        return data;
    }

    static findWalletAccountByPublicKey(wallet: Wallet, publicKey: string): WalletAccount | null {
        let account: WalletAccount = wallet.accounts.find((acc) => acc.publicKey === publicKey);

        if (account) {
            return account;
        }

        return null;
    }

    static findAccountByPublicKey(wallet: Wallet, publicKey: string): MyAccount | null {
        let account: WalletAccount = wallet.accounts.find((acc) => acc.publicKey === publicKey);

        if (account) {
            return account;
        }

        let otherAccount: OtherAccount = wallet.others.find((acc) => acc.publicKey === publicKey);

        if (otherAccount) {
            return otherAccount;
        }

        return null;
    }

    static findAccountPublicKeyByAddress(wallet: Wallet, address: string): string | null {
        let account: WalletAccount = wallet.accounts.find((acc) => acc.address === address);

        if (account) {
            return account.publicKey;
        }

        let otherAccount: OtherAccount = wallet.others.find((acc) => acc.address === address);

        if (otherAccount) {
            return otherAccount.publicKey;
        }

        return null;
    }


    static getFinalCosigner(multisigInfos: MultisigInfo[]): string[] {
        let cosigner: string[] = [];

        let parentSelfOnlyMultisigInfo = multisigInfos.filter(info => info.level >= 0);

        for (let i = 0; i < parentSelfOnlyMultisigInfo.length; ++i) {
            if (parentSelfOnlyMultisigInfo[i].minApproval === 0) {
                cosigner.push(parentSelfOnlyMultisigInfo[i].publicKey);
            }
        }

        return cosigner;
    }

    static getDirectParentCosigner(multisigInfos: MultisigInfo[]): string[] {
        let cosigner: string[] = [];

        let selfMultisigInfo = multisigInfos.filter(info => info.level === 0);

        cosigner = selfMultisigInfo[0].cosignaturies;

        return cosigner;
    }

    static async updateAddressBookGetVersion(contacts: AddressBook[]){

        const nonUpdatedContacts = contacts.filter(x => x.version === 0);
        const addresses = nonUpdatedContacts.map(x => Address.createFromRawAddress(x.address));
        const splitAmount = 80;

        if(addresses.length === 0){
            return;
        }

        const lastPage = Math.ceil(addresses.length/ splitAmount);

        let accountsInfo: AccountInfo[] = [];

        for(let i =0; i < lastPage; ++i){

            const startIndex = i * splitAmount;
            const splitAddresses = addresses.slice(startIndex, startIndex + splitAmount);
            const tempAccountsInfo = await AppState.chainAPI.accountAPI.getAccountsInfo(splitAddresses);

            accountsInfo = accountsInfo.concat(tempAccountsInfo)
            
            if(i !== (lastPage - 1)){
                await delay(250);
            }
        }

        for (let i = 0; i < nonUpdatedContacts.length; ++i) {

            let contact = nonUpdatedContacts[i];
            let accountInfo = accountsInfo.find(x => x.address.plain() === contact.address);

            if (!accountInfo) {
                continue;
            }

            contact.version = accountInfo.version;
        }
    }

    static removeUnknownVersionAcc(wallet: Wallet){

        const deletingAccs = wallet.accounts.filter(x => x.version === 0); 
        wallet.accounts = wallet.accounts.filter(x => x.version !== 0);
        // wallet.others = wallet.others.filter(x => x.version !== 0);

        const deletingContacts = wallet.contacts.filter(x => x.version === 0);
        wallet.contacts = wallet.contacts.filter(x => x.version !== 0);
    }
}

interface PublicKeyMultisigInfos {
    publicKey: string,
    multisigInfos: MultisigInfo[]
}

interface oldWltFile {
    name: string,
    accounts: oldAccountStructure[]
}

interface oldAccountStructure {
    algo: string,
    address: string,
    brain: boolean,
    default: boolean,
    encrypted: string,
    firstAccount: boolean,
    iv: string,
    name: string,
    network?: 184,
    publicAccount: {
        publicKey: string,
        address: {
            address: string,
            networkType?: number
        }
    },
    nis1Account: {
        address: string,
        publicKey: string
    } | null
}

interface commonInterface {
    password: string,
    privateKey: string
}

interface tempNewWalletInterface {
    privateKey: string,
    wallet: WalletAccount
}