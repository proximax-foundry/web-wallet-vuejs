import { AccountHttp, NamespaceHttp, NamespaceId, Address, AccountInfo, XpxMosaicProperties, MosaicId } from "tsjs-xpx-chain-sdk";
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
} from "tsjs-xpx-chain-sdk"
import { computed } from "vue";
import { Helper, LooseObject } from "./typeHelper";
import { WalletStateUtils } from "@/state/utils/walletStateUtils";
import { AccountAPI } from "@/models/REST/account";

const config = require("@/../config/config.json");

const localNetworkType = computed(() => ChainUtils.getNetworkType(networkState.currentNetworkProfile?.network.type));

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

        const account = wallet.accounts.find((element: WalletAccount) => element.default == true);

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

        const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));

        const nativeTokenNamespace = new NamespaceId(namespace);
        let amount = 0;
        return new Promise(async (resolve) => {
            const accountsInfo = await WalletUtils.fetchAccountInfoCurrentWalletAccounts();

            const nativeNetworkMosaicId = await chainAPICall.namespaceAPI.getLinkedMosaicId(nativeTokenNamespace);

            if (accountsInfo) {
                const accInfo: AccountInfo[] = accountsInfo as AccountInfo[];

                wallet.accounts.forEach((account) => {
                    account.assets = [];
                    const mosaicList: MosaicId[] = [];
                    const mosaicAmount: LooseObject = {};
                    const address = accInfo.find((element) => element.address['address'] == account.address);
                    if (address != undefined) {

                        for (const mosaic of address.mosaics) {
                            if (mosaic.id.toHex() === nativeNetworkMosaicId.toHex()) {
                                amount = mosaic.amount.compact() / Math.pow(10, currentNetworkProfile.network.currency.divisibility);
                                const newAsset = new Asset(mosaic.id.toHex(), currentNetworkProfile.network.currency.divisibility, false, true);
                                newAsset.amount = amount;
                                account.assets.push(newAsset);
                                account.updateBalance(nativeNetworkMosaicId.toHex());
                            } else {
                                mosaicList.push(mosaic.id);
                                mosaicAmount[mosaic.id.toHex()] = mosaic.amount.compact();
                            }
                        }

                        chainAPICall.assetAPI.getMosaics(mosaicList).then((mosaicInfo) => {
                            mosaicInfo.forEach((asset) => {
                                const newAsset = new Asset(asset.mosaicId.toHex(), asset.divisibility, asset.isSupplyMutable(), asset.isTransferable(), asset.owner.publicKey);
                                newAsset.supply = asset.supply.compact();
                                newAsset.amount = mosaicAmount[newAsset.idHex] / Math.pow(10, asset.divisibility)
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

        const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, currentNetworkProfile.httpPort));

        return new Promise((resolve, reject) => {
            try {
                chainAPICall.accountAPI.getAccountsInfo(addresses).then(accountInfo => {
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

    static getAccountHttp(){
        
        const accountAPI = new AccountAPI(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort))
        return accountAPI.accountHttp
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
     static createAccountSimple(walletName: string, password: Password, network: number): SimpleWallet {
        return SimpleWallet.create(walletName, password, network);
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
     * Create account simple
     *
     * @param {string} nameWallet
     * @param {Password} password
     * @param {string} privateKey
     * @param {NetworkType} network
     * @returns {SimpleWallet}
     */
     static createAccountFromPrivateKey(nameWallet: string, password: Password, privateKey: string, network: NetworkType): SimpleWallet {
        return SimpleWallet.createFromPrivateKey(nameWallet, password, privateKey, network);
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

        return new ChainAPICall(endpoint).transactionAPI.announceAggregateBondedCosignature(
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

    static importWltOldFormat(base64Wlt: string, networkName: string, networkType: NetworkType): void{
        const wltFile: oldWltFile = Helper.base64decode(base64Wlt);

        const wallets = new Wallets();

        if(!wallets.filterByNetworkNameAndName(networkName, wltFile.name)){
            throw new Error("Wallet with same name already exist");
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

    static importWalletNewFormat(base64Wlt: string, networkName: string, networkType: NetworkType): void{
        const wltFile: Wallet = Helper.base64decode(base64Wlt);

        const wallets = new Wallets();

        if(!wallets.filterByNetworkNameAndName(networkName, wltFile.name)){
            throw new Error("Wallet with same name already exist");
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

    static checkIsNewFormat(base64Wlt: string): boolean{
        const wltFile: Wallet = Helper.base64decode(base64Wlt);

        if(wltFile.accounts[0].publicKey){
            return true;
        }
        else{
            return false;
        }
    }

    static checkIsNewFormatAccountRaw(jsonString: string): boolean{

        console.log(jsonString);

        const account: LooseObject = JSON.parse(jsonString);

        if(account.publicKey){
            return true;
        }
        else{
            return false;
        }
    }

    static export(wallet: Wallet): string{

        const walletJSON = JSON.stringify(wallet);

        return Helper.base64encode(walletJSON);
    }

    static updateWalletMultisigInfo(wallet: Wallet): void{

        WalletUtils.updateMultisigsDetails(wallet.accounts);
    }

    static updateMultisigsDetails(walletAccounts: WalletAccount[]): void{
        
        walletAccounts.forEach(walletAccount => {
            WalletUtils.updateMultisigDetails(walletAccount);
        });
    }

    static async updateMultisigDetails(walletAccount: WalletAccount): Promise<void>{

        const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));

        const address = Helper.createAddress(walletAccount.address);

        const graphInfo = await chainAPICall.accountAPI.getMultisigAccountGraphInfo(address);

        let multisigInfos: MultisigInfo[] = [];

        graphInfo.multisigAccounts.forEach((value, key)=>{
            const level = key;

            value.forEach((multiInfo)=>{
                let newMultisigInfo = new MultisigInfo(
                    multiInfo.account.publicKey, 
                    level, 
                    multiInfo.cosignatories.map((c)=> c.publicKey), 
                    multiInfo.multisigAccounts.map((c)=> c.publicKey),
                    multiInfo.minApproval,
                    multiInfo.minRemoval
                );

                multisigInfos.push(newMultisigInfo);
            });
        });

        walletAccount.multisigInfo = multisigInfos;

        walletState.wallets.savetoLocalStorage();
    }

    static populateOtherAccountTypeMultisig(wallet: Wallet): void{

        console.log(wallet);
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