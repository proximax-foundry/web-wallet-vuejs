import { AccountHttp, NamespaceHttp, NamespaceId, Address, AccountInfo, XpxMosaicProperties, MosaicId } from "tsjs-xpx-chain-sdk";
import { networkState } from "../state/networkState"
import { walletState } from "../state/walletState"
import { ChainUtils } from "../util/chainUtils"
import { Wallet } from "../models/wallet"
import { ChainProfile } from "../models/stores/chainProfile"
import { Asset } from "../models/asset";
import { ChainAPICall } from "../models/REST/chainAPICall"
import {
    SimpleWallet, Password, RawAddress, Convert, Crypto,
    WalletAlgorithm, PublicAccount, Account, NetworkType, 
    AggregateTransaction, CosignatureTransaction, MosaicNonce
} from "tsjs-xpx-chain-sdk"

export class WalletUtils {

    static async getTotalBalanceWithCurrentNetwork(): Promise<Wallet> {

        const wallet = walletState.currentLoggedInWallet as Wallet;

        let namespace = "";
        let currentNetworkProfile: ChainProfile;

        if (networkState.currentNetworkProfile) {
            namespace = networkState.currentNetworkProfile?.network.currency.namespace;
            currentNetworkProfile = networkState.currentNetworkProfile as ChainProfile;
        }
        else {
            return wallet;
        }

        let chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));

        const nativeTokenNamespace = new NamespaceId(namespace);
        let amount = 0;
        return new Promise(async (resolve) => {
            let accountsInfo = await WalletUtils.fetchAccountInfoCurrentWalletAccounts();

            let nativeNetworkMosaicId = await chainAPICall.namespaceAPI.getLinkedMosaicId(nativeTokenNamespace);

            if (accountsInfo) {
                let accInfo: AccountInfo[] = accountsInfo as AccountInfo[];

                wallet.accounts.forEach((account) => {
                    account.assets = [];
                    const mosaicList: MosaicId[] = [];
                    const mosaicAmount = {};
                    const address = accInfo.find((element) => element.address['address'] == account.address);
                    if (address != undefined) {

                        for (const mosaic of address.mosaics) {
                            if (mosaic.id.toHex() === nativeNetworkMosaicId.toHex()) {
                                amount = mosaic.amount.compact() / Math.pow(10, currentNetworkProfile.network.currency.divisibility);
                                let newAsset = new Asset(mosaic.id.toHex(), currentNetworkProfile.network.currency.divisibility, false, true);
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
                                let newAsset = new Asset(asset.mosaicId.toHex(), asset.divisibility, asset.isSupplyMutable(), asset.isTransferable(), asset.owner.publicKey);
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

        let wallet = walletState.currentLoggedInWallet;
        let networkTypeId = networkState.currentNetworkProfile?.network.type;

        if (!wallet || !networkTypeId) {
            return false;
        }

        let networkType = ChainUtils.getNetworkType(networkTypeId);
        const addresses: Address[] = [];
        wallet.accounts.forEach((element) => {
            addresses.push(Address.createFromPublicKey(element.publicKey, networkType));
        });

        let currentNetworkProfile: ChainProfile;

        if (networkState.currentNetworkProfile) {
            currentNetworkProfile = networkState.currentNetworkProfile as ChainProfile;
        }
        else {
            return false;
        }

        let chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, currentNetworkProfile.httpPort));

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

    importWallet() {

    }

    exportWallet() {

    }

    /**
   *
   *
   * @param {*} address
   * @returns
   */
    createAddressFromEncode(address: any) {
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
    createAccountSimple(walletName: string, password: Password, network: number): SimpleWallet {
        return SimpleWallet.create(walletName, password, network);
    }

    /**
     *
     *
     * @param {string} value
     * @returns {Password}
     * @memberof ProximaxProvider
     */
    createPassword(value: string): Password {
        return new Password(value);
    }

    /**
     * Create account simple
     *
     * @param {string} nameWallet
     * @param {Password} password
     * @param {string} privateKey
     * @param {number} network
     * @returns {SimpleWallet}
     * @memberof ProximaxProvider
     */
    createAccountFromPrivateKey(nameWallet: string, password: Password, privateKey: string, network: number): SimpleWallet {
        return SimpleWallet.createFromPrivateKey(nameWallet, password, privateKey, network);
    }

    /**
     *
     *
     * @param {Password} password
     * @param {string} encryptedKey
     * @param {string} iv
     * @returns {string}
     * @memberof ProximaxProvider
     */
    decryptPrivateKey(password: Password, encryptedKey: string, iv: string): string {
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
    checkAddress(privateKey: string, net: NetworkType, address: string): boolean {
        return (Account.createFromPrivateKey(privateKey, net).address.plain() === address) ? true : false;
    }



    /**
     *
     *
     * @param {string} publicKey
     * @param {NetworkType} [network=environment.typeNetwork.value]
     * @returns {PublicAccount}
     * @memberof ProximaxProvider
     */
    createPublicAccount(publicKey: string, network: NetworkType): PublicAccount {
        return PublicAccount.createFromPublicKey(publicKey, network);
    }

    /**
     *
     *
     * @param {string} publicKey
     * @param {NetworkType} networkType
     * @returns {Address}
     * @memberof ProximaxProvider
     */
    createAddressFromPublicKey(publicKey: string, networkType: NetworkType): Address {
        return Address.createFromPublicKey(publicKey, networkType);
    }

    cosignAggregateBondedTransaction(transaction: AggregateTransaction, account: Account) {
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

    createFromRawAddress(address: string): Address {
        return Address.createFromRawAddress(address);
    }

    static createNonceRandom() {
        const nonce = MosaicNonce.createRandom();
        return nonce;
    }

    getPublicAccountFromPrivateKey(privateKey: string, net: NetworkType): PublicAccount {
        return Account.createFromPrivateKey(privateKey, net).publicAccount;
    }

    generateNewAccount(network: NetworkType): Account {
        return Account.generateNewAccount(network);
    }

    getNamespaceId(id: string | number[]): NamespaceId {
        return new NamespaceId(id);
    }

    getMosaicId(id: string | number[]): MosaicId {
        return new MosaicId(id);
    }

    isHexString(data: string): boolean {
        return Convert.isHexString(data);
    }

    /**
     *
     * @returns {boolean}
  
     */
     isPrivateNet(network: NetworkType): boolean {
        return network === NetworkType.PRIVATE || network === NetworkType.PRIVATE_TEST;
    }

    /**
     *
     *
     * @param {string} data
     * @returns
  
     */
    isValidKeyPublicPrivate(data: string) {
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
     validateAddress(address: string) {
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
    verifyNetworkAddressEqualsNetwork(value: string, value2: string) {
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
    static getWalletAlgorithm() {
        return WalletAlgorithm;
    }
}

interface commonInterface {
    password: string,
    privateKey: string
}