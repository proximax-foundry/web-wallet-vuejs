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
    AggregateTransaction, CosignatureTransaction, MosaicNonce,
    NamespaceId, Address, AccountInfo, MosaicId, AliasType, Transaction,
    MultisigAccountGraphInfo,MultisigAccountInfo,QueryParams, TransactionQueryParams
} from "tsjs-xpx-chain-sdk"
import { computed } from "vue";
import { Helper, LooseObject } from "./typeHelper";
import { WalletStateUtils } from "@/state/utils/walletStateUtils";
import { OtherAccount } from "@/models/otherAccount";
import { Namespace } from "@/models/namespace";
import { Account as myAccount } from "@/models/account";
import { TransactionUtils } from "./transactionUtils"
import { Account as NEM_Account, NetworkTypes, NEMLibrary } from "nem-library";
import { AddressBook } from "@/models/addressBook"
import {AppState} from "@/state/appState";

const config = require("@/../config/config.json");

const localNetworkType = computed(() => ChainUtils.getNetworkType(AppState.networkType));
const chainAPICall = computed(()=> AppState.chainAPI);

export class WalletUtils {

    static verifyWalletPassword(name: string, networkName: string, password: string): boolean{
        const wallet = walletState.wallets.filterByNetworkNameAndName(networkName, name);
        if (!wallet) {
            if (config.debug) {
                console.error(
                    "wallet not found",
                    name, networkName
                );
            }
            return false;
        }

        if (config.debug) {
            console.log("verifyWalletPassword triggered with", name, networkName);
        }

        const account = wallet.accounts[0];

        const common: SecretKeyPair = {
            password: password,
            privateKey: ""
        };

        if(account){
            if (
                !Crypto.passwordToPrivateKey(
                common,
                account,
                account.algo == "pass:bip32" ? WalletAlgorithm.Pass_bip32 : account.algo
                )
            ) {
                console.log('fail');
                return false;
            }
            else{
                if (!ChainUtils.isPrivateKeyValid(common.privateKey)) {
                    return false;
                }
                else{
                    const checkingAddress = Account.createFromPrivateKey(common.privateKey, localNetworkType.value).address.plain();
                    
                    if(checkingAddress !== account.address){
                        return false;
                    }
                }
            }
            return true;
        }

        return false;
        
    }
    
    static async getTotalBalanceWithCurrentNetwork(): Promise<Wallet> {

        const wallet = walletState.currentLoggedInWallet as Wallet;

        let namespace = "";
        let currentNetworkProfile: ChainProfile;

        if (networkState.currentNetworkProfile) {
            namespace = networkState.currentNetworkProfile!.network.currency.namespace;
            currentNetworkProfile = networkState.currentNetworkProfile as ChainProfile;
        }
        else {
            return wallet;
        }

        const nativeTokenNamespace = new NamespaceId(namespace);
        let amount = 0;
        return new Promise(async (resolve) => {
            const accountsInfo = await WalletUtils.fetchAccountInfoCurrentWalletAccounts();

            const nativeNetworkMosaicId = await chainAPICall.value.namespaceAPI.getLinkedMosaicId(nativeTokenNamespace);

            if (accountsInfo) {
                const accInfo: AccountInfo[] = accountsInfo as AccountInfo[];

                wallet.accounts.forEach((account) => {
                    account.assets = [];
                    const mosaicList: MosaicId[] = [];
                    const mosaicAmount: LooseObject = {};
                    const singleAccInfo = accInfo.find((element) => element.address['address'] == account.address);
                    if (singleAccInfo != undefined) {

                        for (const mosaic of singleAccInfo.mosaics) {
                            if (mosaic.id.toHex() === nativeNetworkMosaicId.toHex()) {
                                amount = mosaic.amount.compact();
                                const newAsset = new Asset(mosaic.id.toHex(), currentNetworkProfile.network.currency.divisibility, false, true);
                                newAsset.amount = amount;
                                account.assets.push(newAsset);
                                account.updateBalance(nativeNetworkMosaicId.toHex());
                            } else {
                                mosaicList.push(mosaic.id);
                                mosaicAmount[mosaic.id.toHex()] = mosaic.amount.compact();
                            }
                        }

                        chainAPICall.value.assetAPI.getMosaics(mosaicList).then((mosaicInfo) => {
                            mosaicInfo.forEach((asset) => {
                                const newAsset = new Asset(asset.mosaicId.toHex(), asset.divisibility, asset.isSupplyMutable(), asset.isTransferable(), asset.owner.publicKey);
                                newAsset.supply = asset.supply.compact();
                                newAsset.amount = mosaicAmount[newAsset.idHex]
                                newAsset.duration = asset.duration ? asset.duration.compact() : null;
                                account.assets.push(newAsset);
                            })
                        });

                    } else {
                        account.balance = 0;
                    }
                    resolve(wallet);
                });
            }
            else {
                resolve(wallet);
            }
        });
    }

    static fetchAccountInfoCurrentWalletAccounts(): false | Promise<AccountInfo[]> {

        const wallet = walletState.currentLoggedInWallet;
        const networkTypeId = networkState.currentNetworkProfile!.network.type;

        if (!wallet || !networkTypeId) {
            return false;
        }

        const networkType = ChainUtils.getNetworkType(networkTypeId);
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
                chainAPICall.value.accountAPI.getAccountsInfo(addresses).then(accountInfo => {
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
    static getAggregateBondedTransactions = (publicAccount :PublicAccount) :Promise<AggregateTransaction[]> =>{
        const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
        return new Promise((resolve, reject) => {
            try {
                let txnQueryParams = new TransactionQueryParams();
                txnQueryParams.pageSize = 100;
                chainAPICall.accountAPI.aggregateBondedTransactions(publicAccount,txnQueryParams).then(transactions => {
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


    static getMultisigAccGraphInfo(address :Address): Promise<MultisigAccountGraphInfo> {
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

    static getAccInfo(add :string):Promise<AccountInfo> {
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
    static createAddressFromEncode(address: string) : Address {
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
     static createAccountSimple(walletName: string, password: Password, network: NetworkType): SimpleWallet {
        return SimpleWallet.create(walletName, password, network);
    }

    static createAccountSimpleFromPrivateKey(walletName: string, password: Password, privateKey: string, network: NetworkType): SimpleWallet{
        return SimpleWallet.createFromPrivateKey(walletName, password, privateKey, network)
    }

    static createAccountSimpleFromEncryptedPrivateKey(walletName: string, encryptedPrivateKey: string, iv: string, publicKey: string, network: NetworkType): SimpleWallet{
        return SimpleWallet.createFromEncryptedKey(walletName, encryptedPrivateKey, iv, publicKey, network);
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
     static createAccountFromPrivateKey(privateKey: string, network: NetworkType): Account {
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
     static checkAddress(privateKey: string, net: NetworkType, address: string): boolean {
        return (Account.createFromPrivateKey(privateKey, net).address.plain() === address) ? true : false;
    }

     static createPublicAccount(publicKey: string, network: NetworkType): PublicAccount {
        return PublicAccount.createFromPublicKey(publicKey, network);
    }

    static createAddressFromPublicKey(publicKey: string, networkType: NetworkType): Address {
        return Address.createFromPublicKey(publicKey, networkType);
    }

    static cosignAggregateBondedTransaction(transaction: AggregateTransaction, account: Account) {
        const cosignatureTransaction = CosignatureTransaction.create(transaction);

        let chainProfile;
        if(networkState.currentNetworkProfile){
            chainProfile = networkState.currentNetworkProfile as ChainProfile;
        }
        else{
            return Promise.reject(new Error('chainProfile is null'));
        }

        const endpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, chainProfile.httpPort);

        return chainAPICall.value.transactionAPI.announceAggregateBondedCosignature(
            account.signCosignatureTransaction(cosignatureTransaction)
        );
    }

    static createFromRawAddress(address: string): Address {
        return Address.createFromRawAddress(address);
    }

    static getPublicAccountFromPrivateKey(privateKey: string, net: NetworkType): PublicAccount {
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
        return network === NetworkType.PRIVATE || network === NetworkType.PRIVATE_TEST;
    }

    /**
     *
     *
     * @param {string} data
     * @returns
  
     */
    static isValidKeyPublicPrivate(data: string) : boolean{
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
    static validateAddress(address: string) : boolean{
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

    static importWltOldFormat(wallets: Wallets, parsedObj: any, networkName: string, networkType: NetworkType): void{
        const wltFile: oldWltFile = parsedObj;

        if(wallets.filterByNetworkNameAndName(networkName, wltFile.name)){
            let error = new Error("Wallet with same name already exist");
            error.name = "SAME_NAME";
            throw error;
        }

        const walletAccounts: WalletAccount[] = [];

        wltFile.accounts.forEach((account)=>{
            const walletAccount = new WalletAccount(account.name, 
                account.publicAccount.publicKey, account.publicAccount.address.address, account.algo, 
                account.encrypted, account.iv);

            if(account.nis1Account){
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

    static importWalletNewFormat(wallets: Wallets, parsedObj: any, networkName: string, networkType: NetworkType): void{
        const wltFile: Wallet = parsedObj;

        if(wallets.filterByNetworkNameAndName(networkName, wltFile.name)){
            let error = new Error("Wallet with same name already exist");
            error.name = "SAME_NAME";
            throw error;
        }

        const walletAccounts: WalletAccount[] = [];

        wltFile.accounts.forEach((account)=>{
            const walletAccount = new WalletAccount(account.name, 
                account.publicKey, account.address, account.algo, 
                account.encrypted, account.iv);

            if(account.nis1Account){
                walletAccount.nis1Account = new nis1Account(account.nis1Account.address, account.nis1Account.publicKey);
            }

            walletAccount.default = account.default;
            walletAccount.isBrain = account.isBrain;

            walletAccount.fixAddress(networkType);

            walletAccounts.push(walletAccount);
        });

        const newWallet = new Wallet(wltFile.name, networkName, walletAccounts);

        if(Array.isArray(wltFile.contacts)){
            try {
                for(let i=0; i < wltFile.contacts.length; ++i){
                    let group = wltFile.contacts[i].group ? wltFile.contacts[i].group : '';
                    let newAddressBook = new AddressBook(wltFile.contacts[i].name, wltFile.contacts[i].address, group);
                    newWallet.addAddressBook(newAddressBook);
                }
            } catch (error) {
                
            }
        }

        wallets.wallets.push(newWallet);

        wallets.savetoLocalStorage();
    }


    static createNewWalletAccountFromOldFormat(jsonString: string): WalletAccount{
        const wltAccount: oldAccountStructure = JSON.parse(jsonString);

        const walletAccount = new WalletAccount(wltAccount.name, 
            wltAccount.publicAccount.publicKey, wltAccount.publicAccount.address.address, wltAccount.algo, 
            wltAccount.encrypted, wltAccount.iv);

        if(wltAccount.nis1Account){
            walletAccount.nis1Account = new nis1Account(wltAccount.nis1Account.address, wltAccount.nis1Account.publicKey);
        }

        walletAccount.default = wltAccount.default;
        walletAccount.isBrain = wltAccount.brain;

        return walletAccount;
    }

    static checkIsNewFormat(base64Wlt: any): boolean{
        const wltFile: Wallet = base64Wlt;//Helper.base64decode(base64Wlt);

        if(wltFile.accounts[0].publicKey){
            return true;
        }
        else{
            return false;
        }
    }

    static checkIsNewFormatAccountRaw(jsonString: string): boolean{

        const account: LooseObject = JSON.parse(jsonString);

        if(account.publicKey){
            return true;
        }
        else{
            return false;
        }
    }

    static export(wallet: Wallet): string{

        const exportingData = {
            name: wallet.name,
            networkName: wallet.networkName,
            accounts: wallet.accounts,
            contacts: wallet.contacts
        };

        const walletJSON = JSON.stringify(exportingData);

        return Helper.base64encode(walletJSON);
    }

    static exportAccount(wallet: Wallet, exportingPublicKey: string): string{

        const exportingData = {
            name: wallet.name,
            networkName: wallet.networkName,
            accounts: wallet.accounts.find(acc => acc.publicKey === exportingPublicKey),
            contacts: wallet.contacts
        };

        const walletJSON = JSON.stringify(exportingData);

        return Helper.base64encode(walletJSON);
    }

    static async updateWalletMultisigInfo(wallet: Wallet): Promise<void>{

        //WalletUtils.updateMultisigsDetails(wallet.accounts);

        for(let i = 0; i < wallet.accounts.length; ++i ){

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

    static updateMultisigsDetails(walletAccounts: WalletAccount[]): void{
        
        walletAccounts.forEach(walletAccount => {
            WalletUtils.updateMultisigDetails(walletAccount);
        });
    }

    static async updateWalletOtherAccountMultisigInfo(wallet: Wallet): Promise<void>{

        //WalletUtils.updateOtherAccountMultisigsDetails(wallet.others);

        for(let i = 0; i < wallet.others.length; ++i ){

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

    static updateOtherAccountMultisigsDetails(otherAccounts: OtherAccount[]): void{
        
        otherAccounts.forEach(walletAccount => {
            WalletUtils.updateMultisigDetails(walletAccount);
        });
    }

    static async updateMultisigDetails(walletAccount: WalletAccount| OtherAccount): Promise<void>{

        const address = Helper.createAddress(walletAccount.address);

        const graphInfo = await chainAPICall.value.accountAPI.getMultisigAccountGraphInfo(address);

        let multisigInfos: MultisigInfo[] = [];

        graphInfo.multisigAccounts.forEach((value, key)=>{
            const level = key;

            for(let i =0; i < value.length; ++i){

                let multiInfo = value[i];

                let newMultisigInfo = new MultisigInfo(
                    multiInfo.account.publicKey, 
                    level, 
                    multiInfo.cosignatories.map((c)=> c.publicKey), 
                    multiInfo.multisigAccounts.map((c)=> c.publicKey),
                    multiInfo.minApproval,
                    multiInfo.minRemoval
                );

                multisigInfos.push(newMultisigInfo);
            }
        });

        walletAccount.multisigInfo = multisigInfos;
    }

    static async getMultisigDetails(addressInString: string): Promise<MultisigInfo[]>{

        const address = Helper.createAddress(addressInString);

        const graphInfo = await chainAPICall.value.accountAPI.getMultisigAccountGraphInfo(address);

        let multisigInfos: MultisigInfo[] = [];

        graphInfo.multisigAccounts.forEach((value, key)=>{
            const level = key;

            for(let i =0; i < value.length; ++i){

                let multiInfo = value[i];

                let newMultisigInfo = new MultisigInfo(
                    multiInfo.account.publicKey, 
                    level, 
                    multiInfo.cosignatories.map((c)=> c.publicKey), 
                    multiInfo.multisigAccounts.map((c)=> c.publicKey),
                    multiInfo.minApproval,
                    multiInfo.minRemoval
                );

                multisigInfos.push(newMultisigInfo);
            }
        });

        return multisigInfos;
    }

    static populateOtherAccountTypeMultisig(wallet: Wallet): void{

        let othersList: string[] = [];

        for(let i = 0; i < wallet.accounts.length; ++i){

            let publicKeys = wallet.accounts[i].getDirectChildMultisig();

            for(let y = 0; y < publicKeys.length; ++y){

                othersList.push(publicKeys[y]);

                if(wallet.others.find((other)=> other.publicKey === publicKeys[y])){
                    continue;
                }
                else if(wallet.accounts.find((account)=> account.publicKey === publicKeys[y])){
                    continue;
                }

                let publicAccount = Helper.createPublicAccount(publicKeys[y], localNetworkType.value) 

                let address = publicAccount.address.plain();

                let stripedAddress = address.substr(-4);

                let newOtherAccount = new OtherAccount("MULTISIG-" + stripedAddress, publicKeys[y], address, Helper.getOtherWalletAccountType().MULTISIG_CHILD);
            
                wallet.others.push(newOtherAccount);
            }
        }

        wallet.others = wallet.others.filter((otherAcc)=> othersList.includes(otherAcc.publicKey) || otherAcc.type === Helper.getOtherWalletAccountType().DELEGATE_VALIDATE )
    }

    static async updateWalletAccountDetails(wallet: Wallet, addInLinkedAccount: boolean = false): Promise<void>{

        let tempAssets: Asset[] = [];
        let tempLinkedList: string[] = [];

        for(let i = 0; i < wallet.accounts.length; ++i ){

            let account = wallet.accounts[i];

            let publicAccount = Helper.createPublicAccount(account.publicKey, localNetworkType.value) 

            let accountInfo;

            try {
                accountInfo = await chainAPICall.value.accountAPI.getAccountInfo(publicAccount.address);
            } catch (error) {
                continue;
            }

            if(accountInfo.linkedAccountKey !== "0".repeat(64) && addInLinkedAccount){

                tempLinkedList.push(accountInfo.linkedAccountKey);

                let linkedPublicAccount = Helper.createPublicAccount(accountInfo.linkedAccountKey, localNetworkType.value);

                let newAddress = linkedPublicAccount.address.plain();
                let stripedAddress = newAddress.substr(-4);

                let newOtherAccount = new OtherAccount("ACCOUNT-LINK-" + stripedAddress, accountInfo.linkedAccountKey, newAddress, Helper.getOtherWalletAccountType().DELEGATE_VALIDATE);
            
                if(!wallet.others.find((other)=> other.publicKey === accountInfo.linkedAccountKey)){
                    wallet.others.push(newOtherAccount);
                }
            }

            let namespaceInfos = await chainAPICall.value.namespaceAPI.getNamespacesFromAccount(publicAccount.address);

            let namespaces: Namespace[] = [];
            let tempNamespaceIds: NamespaceId[] = [];

            for(let i=0; i < namespaceInfos.length; ++i){

                let namespaceId = namespaceInfos[i].id;

                tempNamespaceIds.push(namespaceId);

                let newNamespace = new Namespace(namespaceInfos[i].id.toHex());
                newNamespace.active = namespaceInfos[i].active;

                if(namespaceInfos[i].isSubnamespace()){
                    newNamespace.parentId = namespaceInfos[i].parentNamespaceId().toHex();
                }

                newNamespace.startHeight = namespaceInfos[i].startHeight.compact();
                newNamespace.endHeight = namespaceInfos[i].endHeight.compact();
                
                if(namespaceInfos[i].hasAlias()){
                    newNamespace.linkType = namespaceInfos[i].alias.type.valueOf();

                    switch (newNamespace.linkType) {
                        case AliasType.Mosaic:
                            newNamespace.linkedId = namespaceInfos[i].alias.mosaicId.toHex()
                            break;
                        case AliasType.Address:
                            newNamespace.linkedId = namespaceInfos[i].alias.address.plain();
                            break;
                    
                        default:
                            break;
                    }
                }

                namespaces.push(newNamespace);
            }

            let namespaceNames = await chainAPICall.value.namespaceAPI.getNamespacesName(tempNamespaceIds);

            for(let i = 0; i < namespaceNames.length; ++i){
                let existingNamespace = namespaces.find((ns)=> ns.idHex === namespaceNames[i].namespaceId.toHex())

                existingNamespace.name = namespaceNames[i].name;
            }

            account.namespaces = namespaces;

            let assets: Asset[] = [];
            //let assetAmount: LooseObject = [];

            for(let i=0; i < accountInfo.mosaics.length; ++i){
                let mosaic = accountInfo.mosaics[i];
                let mosaicIdHex = mosaic.id.toHex();

                let existingAsset = tempAssets.find((asset)=> asset.idHex === mosaicIdHex);

                if(existingAsset){
                    let newAsset = existingAsset.duplicateNewInstance(); 
                    newAsset.amount = mosaic.amount.compact();
                    assets.push(newAsset);
                }
                else{
                    let assetInfo = await chainAPICall.value.assetAPI.getMosaic(mosaic.id);
                    let newTempAsset = new Asset(mosaicIdHex, assetInfo.divisibility, assetInfo.isSupplyMutable(), assetInfo.isTransferable(), assetInfo.owner.publicKey);
                    newTempAsset.duration = assetInfo.duration.compact();
                    newTempAsset.supply = assetInfo.supply.compact();
                    newTempAsset.height = assetInfo.height.compact();

                    let assetNames = await chainAPICall.value.assetAPI.getMosaicsNames([mosaic.id])

                    if(assetNames[0].names.length){
                        newTempAsset.namespaceNames = assetNames[0].names.map(nsName => nsName.name);
                    }

                    tempAssets.push(newTempAsset);

                    let newAsset = newTempAsset.duplicateNewInstance();
                    newAsset.amount = mosaic.amount.compact();
                    assets.push(newAsset);
                }
            }
            account.assets= assets;
        }

        if(addInLinkedAccount){
            wallet.others = wallet.others.filter((otherAcc)=> tempLinkedList.includes(otherAcc.publicKey) || otherAcc.type === Helper.getOtherWalletAccountType().MULTISIG_CHILD);
        }
    }

    static async updateOtherAccountDetails(wallet: Wallet): Promise<void>{

        let tempAssets: Asset[] = [];

        for(let i = 0; i < wallet.others.length; ++i ){

            let otherAccount = wallet.others[i];

            let publicAccount = Helper.createPublicAccount(otherAccount.publicKey, localNetworkType.value) 

            let accountInfo = await chainAPICall.value.accountAPI.getAccountInfo(publicAccount.address);

            let namespaceInfos = await chainAPICall.value.namespaceAPI.getNamespacesFromAccount(publicAccount.address);

            let namespaces: Namespace[] = [];
            let tempNamespaceIds: NamespaceId[] = [];

            for(let i=0; i < namespaceInfos.length; ++i){

                let namespaceId = namespaceInfos[i].id;

                tempNamespaceIds.push(namespaceId);

                let newNamespace = new Namespace(namespaceInfos[i].id.toHex());
                newNamespace.active = namespaceInfos[i].active;

                if(namespaceInfos[i].isSubnamespace()){
                    newNamespace.parentId = namespaceInfos[i].parentNamespaceId().toHex();
                }

                newNamespace.startHeight = namespaceInfos[i].startHeight.compact();
                newNamespace.endHeight = namespaceInfos[i].endHeight.compact();
                
                if(namespaceInfos[i].hasAlias()){
                    newNamespace.linkType = namespaceInfos[i].alias.type.valueOf();

                    switch (newNamespace.linkType) {
                        case AliasType.Mosaic:
                            newNamespace.linkedId = namespaceInfos[i].alias.mosaicId.toHex()
                            break;
                        case AliasType.Address:
                            newNamespace.linkedId = namespaceInfos[i].alias.address.plain();
                            break;
                    
                        default:
                            break;
                    }
                }

                namespaces.push(newNamespace);
            }

            let namespaceNames = await chainAPICall.value.namespaceAPI.getNamespacesName(tempNamespaceIds);

            for(let i = 0; i < namespaceNames.length; ++i){
                let existingNamespace = namespaces.find((ns)=> ns.idHex === namespaceNames[i].namespaceId.toHex())

                existingNamespace.name = namespaceNames[i].name;
            }

            otherAccount.namespaces = namespaces;

            let assets: Asset[] = [];
            //let assetAmount: LooseObject = [];

            for(let i=0; i < accountInfo.mosaics.length; ++i){
                let mosaic = accountInfo.mosaics[i];
                let mosaicIdHex = mosaic.id.toHex();

                let existingAsset = tempAssets.find((asset)=> asset.idHex === mosaicIdHex);

                if(existingAsset){
                    let newAsset = existingAsset.duplicateNewInstance(); 
                    newAsset.amount = mosaic.amount.compact();
                    assets.push(newAsset);
                    otherAccount.addAsset(newAsset);
                }
                else{
                    let assetInfo = await chainAPICall.value.assetAPI.getMosaic(mosaic.id);

                    let newTempAsset = new Asset(mosaicIdHex, assetInfo.divisibility, assetInfo.isSupplyMutable(), assetInfo.isTransferable(), assetInfo.owner.publicKey);
                    newTempAsset.duration = assetInfo.duration.compact();
                    newTempAsset.supply = assetInfo.supply.compact();

                    let assetNames = await chainAPICall.value.assetAPI.getMosaicsNames([mosaic.id])

                    if(assetNames[0].names.length){
                        newTempAsset.namespaceNames = assetNames[0].names.map(nsName => nsName.name);
                    }

                    tempAssets.push(newTempAsset);

                    let newAsset = newTempAsset.duplicateNewInstance();
                    newAsset.amount = mosaic.amount.compact();
                    assets.push(newAsset);
                    otherAccount.addAsset(newAsset);
                }
            }
        }
    }

    
    static createNis1AccountWithPrivateKey(privateKey: string, isTestnet: boolean = false) {
        NEMLibrary.reset();
        let networkType: NetworkTypes;
        if (isTestnet) {
            networkType = NetworkTypes.TEST_NET;
        }
        else {
            networkType = NetworkTypes.MAIN_NET;
        }
        NEMLibrary.bootstrap(networkType);
        let tempAccount = NEM_Account.createWithPrivateKey(privateKey);
        let publicKey = tempAccount.publicKey;
        let new_nis1Account = new nis1Account(tempAccount.address.plain(), publicKey)
        return new_nis1Account;
    }

    static async confirmedTransactionRefresh(wallet: Wallet, currencyMosaicId: string): Promise<void>{
        if(wallet === null){
            return;
        }
        //wallet.others = [];

        await WalletUtils.updateWalletMultisigInfo(wallet);
        WalletUtils.populateOtherAccountTypeMultisig(wallet);
        await WalletUtils.updateWalletAccountDetails(wallet, true);
        await WalletUtils.updateWalletOtherAccountMultisigInfo(wallet);
        await WalletUtils.updateOtherAccountDetails(wallet);

        WalletUtils.updateAllAccountBalance(wallet, currencyMosaicId);

        walletState.wallets.saveMyWalletOnlytoLocalStorage(wallet);
    }

    static async refreshAllAccountDetails(wallet: Wallet, networkProfile: ChainProfile): Promise<void>{

        if(wallet === null){
            return;
        }

        wallet.isReady = false;
        wallet.others = [];

        await WalletUtils.updateWalletMultisigInfo(wallet);
        WalletUtils.populateOtherAccountTypeMultisig(wallet);
        await WalletUtils.updateWalletAccountDetails(wallet, true);
        await WalletUtils.updateWalletOtherAccountMultisigInfo(wallet);
        await WalletUtils.updateOtherAccountDetails(wallet);

        try {
            let assetId = await ChainUtils.getLinkedMosaicId(Helper.createNamespaceId(networkProfile.network.currency.namespace));

            AppState.nativeToken.assetId = assetId.toHex();
            networkProfile.network.currency.assetId = assetId.toHex();
            networkProfile.saveToLocalStorage();

            WalletUtils.updateAllAccountBalance(wallet, assetId.toHex());
        } catch (error) {
            console.log(error);   
        }

        walletState.wallets.saveMyWalletOnlytoLocalStorage(wallet);
        wallet.isReady = true;

        console.log(wallet);
    }

    static updateAllAccountBalance(wallet: Wallet, assetId: string): void{

        for(let i = 0; i < wallet.accounts.length; ++i){
            wallet.accounts[i].updateBalance(assetId);
        }

        for(let i = 0; i < wallet.others.length; ++i){
            wallet.others[i].updateBalance(assetId);
        }
    }

    static initFixOldFormat(walletsToCheck: Wallets): void{
        let walletsInstance = new Wallets();
        let wallets: Wallet[] = [];

        walletsToCheck.wallets.forEach((wallet)=>{

            let walletAccounts: WalletAccount[] = [];

            wallet.accounts.forEach((account)=>{

                let stringJSON = JSON.stringify(account);

                if(WalletUtils.checkIsNewFormatAccountRaw(stringJSON)){
                    walletAccounts.push(account);
                }
                else{
                    let newWalletAccount = WalletUtils.createNewWalletAccountFromOldFormat(stringJSON);
        
                    walletAccounts.push(newWalletAccount);
                }
            });

            wallet.accounts = walletAccounts;
            wallets.push(wallet);
        });

        walletsInstance.wallets = wallets;
        walletsInstance.savetoLocalStorage();
        WalletStateUtils.refreshWallets();
    }

    static addNewWallet(allWallets: Wallets, password: Password, walletName: string, networkName: string, networkType: NetworkType): tempNewWalletInterface{
        const account = Account.generateNewAccount(networkType);
        const wallet = WalletUtils.createAccountSimpleFromPrivateKey(walletName, password, account.privateKey, networkType);
        let walletAccounts: WalletAccount[] = [];
        let walletAccount = new WalletAccount('Primary', account.publicKey, wallet.publicAccount.address.plain(), "pass:bip32", wallet.encryptedPrivateKey.encryptedKey, wallet.encryptedPrivateKey.iv);
        walletAccount.isBrain = true;
        walletAccount.default = true;
        walletAccounts.push(walletAccount);
        let newWalletInstance = new Wallet(walletName, networkName, walletAccounts);

        allWallets.wallets.push(newWalletInstance);
        allWallets.savetoLocalStorage();

        let data:tempNewWalletInterface = {
            wallet: walletAccount,
            privateKey: account.privateKey
        };

        return data;
    }

    static addNewWalletWithPrivateKey(allWallets: Wallets, privateKey: string, password: Password, walletName: string, networkName: string, networkType: NetworkType): WalletAccount{
        const account = Account.createFromPrivateKey(privateKey, networkType);
        const wallet = WalletUtils.createAccountSimpleFromPrivateKey(walletName, password, privateKey, networkType);
        let walletAccounts: WalletAccount[] = [];
        let walletAccount = new WalletAccount('Primary', account.publicKey, wallet.publicAccount.address.plain(), "pass:bip32", wallet.encryptedPrivateKey.encryptedKey, wallet.encryptedPrivateKey.iv);
        walletAccount.isBrain = true;
        walletAccount.default = true;
        walletAccounts.push(walletAccount);
        let newWalletInstance = new Wallet(walletName, networkName, walletAccounts);

        allWallets.wallets.push(newWalletInstance);
        allWallets.savetoLocalStorage();

        return walletAccount;
    }

    static getAllMultisigAccount(wallet: Wallet): myAccount[]{

        let allMultisigAccount: myAccount[] = [];

        // console.log(wallet.accounts);
        // console.log(wallet.others);
        // console.log(wallet.others.length);
        let multisigAccount: myAccount[] = wallet.accounts.filter((acc)=> acc.getDirectParentMultisig().length > 0);
        let otherMultisigAccount: myAccount[] = wallet.others.filter((account)=> account.type === "MULTISIG");

        // console.log(multisigAccount);
        // console.log(otherMultisigAccount);
        allMultisigAccount = multisigAccount.concat(otherMultisigAccount);

        return allMultisigAccount;
    }

    static getAllMultisigInfoByPublicKey(wallet: Wallet, publicKey: string): MultisigInfo[]{

        let account: WalletAccount = wallet.accounts.find((acc)=> acc.publicKey === publicKey);

        if(account){
            return account.multisigInfo;
        }
    
        let otherAccount: OtherAccount = wallet.others.find((acc)=> acc.publicKey === publicKey);

        if(otherAccount){
            return otherAccount.multisigInfo;
        }

        return [];
    }

    static getWalletMultisigInfo(wallet: Wallet): PublicKeyMultisigInfos[]{

        let data: PublicKeyMultisigInfos[] = [];
        let multisigAccounts = WalletUtils.getAllMultisigAccount(wallet);

        // console.log(multisigAccounts);
        for(let i = 0; i < multisigAccounts.length; ++i){
            let multisigInfos = WalletUtils.getAllMultisigInfoByPublicKey(wallet, multisigAccounts[i].publicKey);
            //let parentCosigner = WalletUtils.getDirectParentCosigner(multisigInfos);
            data.push({
                publicKey: multisigAccounts[i].publicKey,
                multisigInfos: multisigInfos
            });
        }

        // console.log(data);

        return data;
    }

    static findWalletAccountByPublicKey(wallet: Wallet, publicKey: string): WalletAccount | null{
        let account: WalletAccount = wallet.accounts.find((acc)=> acc.publicKey === publicKey);

        if(account){
            return account;
        }

        return null;
    }

    static findAccountByPublicKey(wallet: Wallet, publicKey: string): myAccount | null{
        let account: WalletAccount = wallet.accounts.find((acc)=> acc.publicKey === publicKey);

        if(account){
            return account;
        }
    
        let otherAccount: OtherAccount = wallet.others.find((acc)=> acc.publicKey === publicKey);

        if(otherAccount){
            return otherAccount;
        }

        return null;
    }

    static findAccountPublicKeyByAddress(wallet: Wallet, address: string): string | null{
        let account: WalletAccount = wallet.accounts.find((acc)=> acc.address === address);

        if(account){
            return account.publicKey;
        }
    
        let otherAccount: OtherAccount = wallet.others.find((acc)=> acc.address === address);

        if(otherAccount){
            return otherAccount.publicKey;
        }

        return null;
    }
        

    static getFinalCosigner(multisigInfos: MultisigInfo[]): string[]{
        let cosigner: string[] = [];

        let parentSelfOnlyMultisigInfo = multisigInfos.filter(info => info.level >= 0);

        for(let i = 0; i < parentSelfOnlyMultisigInfo.length; ++i){
            if(parentSelfOnlyMultisigInfo[i].minApproval === 0){
                cosigner.push(parentSelfOnlyMultisigInfo[i].publicKey);
            }
        }

        return cosigner;
    }

    static getDirectParentCosigner(multisigInfos: MultisigInfo[]): string[]{
        let cosigner: string[] = [];

        let selfMultisigInfo = multisigInfos.filter(info => info.level === 0);

        cosigner = selfMultisigInfo[0].cosignaturies;

        return cosigner;
    }
}

interface PublicKeyMultisigInfos{
    publicKey: string,
    multisigInfos: MultisigInfo[]
}

interface oldWltFile{
    name: string,
    accounts: oldAccountStructure[]
}

interface oldAccountStructure{
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

interface tempNewWalletInterface{
    privateKey: string,
    wallet: WalletAccount
}