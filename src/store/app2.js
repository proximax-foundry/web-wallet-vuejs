import { computed, reactive, ref, watch } from "vue";
import {
  Account,
  Address,
  Convert,
  Crypto,
  Password,
  SimpleWallet,
  WalletAlgorithm,
  XpxMosaicProperties,
  NamespaceId,
  AccountHttp,
  ChainHttp,
  BlockHttp,
  NetworkHttp,
  NodeHttp,
  MosaicHttp,
  NamespaceHttp,
  ChainConfigHttp,
  TransactionHttp
} from "tsjs-xpx-chain-sdk";

//import { startListening, stopListening, addListenerstoAccount, initListenerSetting } from '../util/listener2.js';
import { ListenerStore } from '../util/listener2'
//import { multiSign } from '../util/multiSignatory.js';

const config = require("@/../config/config.json");

export class App {
  constructor() {
    this.name = "Sirius Wallet";
    this.version = require("@/../package.json").version;

    this.currentWallet = ref(null);
    this.isLogin = ref(false);
    this.connectors = new ListenerStore();

    this.state = reactive({
      darkTheme: false,
      wallets: this.getWallets(),
      currentLoggedInNetwork: '',
      currentConnectedEndpoint: '',
      currentConnectedEndpointPort: 3000,
      currentLoggedInWallet: computed(() => this.currentWallet.value),
      loggedInWalletFirstAccount: computed(() => {
        if (!this.currentWallet.value) {
          return undefined;
        }
        return this.currentWallet.value.accounts.find((element) => element.default);
      }),
    });

    this.accountHttp = computed(() => new AccountHttp(this._buildAPIEndpointURL()));
    this.blockHttp = computed(() => new BlockHttp(this._buildAPIEndpointURL()));
    this.chainHttp = computed(() => new ChainHttp(this._buildAPIEndpointURL()));
    this.networkHttp = computed(() => new NetworkHttp(this._buildAPIEndpointURL()));
    this.nodeHttp = computed(() => new NodeHttp(this._buildAPIEndpointURL()));
    this.mosaicHttp = computed(() => new MosaicHttp(this._buildAPIEndpointURL()));
    this.namespaceHttp = computed(() => new NamespaceHttp(this._buildAPIEndpointURL()));
    this.chainConfigHttp = computed(() => new ChainConfigHttp(this._buildAPIEndpointURL()));
    this.transactionHttp = computed(()=> new TransactionHttp(this._buildAPIEndpointURL()));

    this.init();

    watch(
      ()=> this.isLogin,
      (newValues)=>{

        if(newValues){
          this.getXPXBalance(this.state.currentLoggedInWallet)
        }
      }
    )
  }

  getWallets() {
    if (!localStorage.getItem(config.localStorage.walletKey)) {
      localStorage.setItem(config.localStorage.walletKey, "[]");
    }
    return JSON.parse(localStorage.getItem(config.localStorage.walletKey));
  }

  explorerBlockHttp = (compactBlock) => {
    return `${config.chainExplorer.url}/${config.chainExplorer.blockRoute}/${compactBlock}`;
  }

  explorerPublicKeyHttp = (publicKey) => {
    return `${config.chainExplorer.url}/${config.chainExplorer.publicKeyRoute}/${publicKey}`;
  }

  updateSetting(endpoint, port, networkName){
    this.state.currentNetworkName = networkName;
    this.state.currentConnectedEndpoint = endpoint;
    this.state.currentConnectedEndpointPort = port;
  }

  toggleDarkTheme() {
    if (config.debug) {
      console.log("toggleDarkTheme triggered");
    }
  
    this.state.darkTheme = !this.state.darkTheme;
  }

  static isPrivateKeyValid(privateKey) {
    if (privateKey.length !== 64 && privateKey.length !== 66) {
      return false;
    } else if (!Convert.isHexString(privateKey)) {
      return false;
    } else {
      return true;
    }
  }

  verifyExistingAccount(privateKey, networkType){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    const account = Account.createFromPrivateKey(privateKey, networkType);
    return (wallet.accounts.findIndex((element) => element.address == account.address.address) >= 0 ) ? true : false ;
  }

  getWalletByName(walletName) {

    return this.getWalletByNameAndNetwork(walletName, this.state.currentLoggedInNetwork);
  }

  getWalletByNameAndNetwork(walletName, networkName) {
    walletName =
      walletName.includes(" ") === true
        ? walletName.split(" ").join("_")
        : walletName;
    return this.state.wallets.find((element) => element.name == walletName && element.networkName == networkName);
  }

  getWalletIndexByNameAndNetwork(walletName, networkName = undefined) {

    let networkNameToCompare = networkName ? networkName : this.state.currentLoggedInNetwork;

    walletName =
      walletName.includes(" ") === true
        ? walletName.split(" ").join("_")
        : walletName;
    return this.state.wallets.findIndex((element) => element.name == walletName && element.networkName == networkNameToCompare);
  }

  getAccountByWallet(walletName){
    const wallet = this.getWalletByName(walletName);
    const account = wallet.accounts.find((element) => element.default == true);
    return account;
  }

  importWallet(decryptedData, networkName, networkType){
    let walletName = decryptedData.name;
    walletName = (walletName.includes(' ') === true) ? walletName.split(' ').join('_') : walletName;
    if(this.getWalletByNameAndNetwork(walletName, networkName) == undefined){
      //if (decryptedData.accounts[0].network == network) {
        const accounts = [];
        if (decryptedData.accounts.length !== undefined) {
          for (let element of decryptedData.accounts) {
            console.log(element);
            var newAddress = Address.createFromPublicKey(element.publicAccount.publicKey, networkType);
            element.address = newAddress.plain();
            element.network = networkType;
            accounts.push(element);
          }
        } else {
          // invalid without account
          return 'invalid_wallet';
        }
  
        const wallet = {
          name: walletName,
          accounts: accounts,
          networkName: networkName
        }
        this.state.wallets.push(wallet);
        try {
          localStorage.setItem(
            config.localStorage.walletKey,
            JSON.stringify(this.state.wallets)
          );
        } catch (err) {
          if (config.debug) {
            console.error("importWallet error caught", err);
          }
          return 'invalid_wallet';
        }
        return 'wallet_added';
      /*
      } else {
        // invalid network type error message
        return 'invalid_network';
      }
      */
    } else {
      // wallet already exist message
      return 'existed_wallet';
    }
  }

  addNewWallet(networkName, walletName, password, networkType, privateKey) {
    let wallet = this.getWalletByNameAndNetwork(walletName, networkName);
    if (wallet) {
      if (config.debug) {
        console.error(
          "addNewWallet triggered with duplicate wallet name",
          walletName
        );
      }
      return -1;
    }
  
    if (config.debug) {
      console.log("addNewWallet triggered with", walletName);
    }
  
    const encryptedPasswd = new Password(password);
    if (privateKey) {
      wallet = SimpleWallet.createFromPrivateKey(
        walletName,
        encryptedPasswd,
        privateKey,
        networkType
      );
    } else {
      wallet = SimpleWallet.create(walletName, encryptedPasswd, networkType);
    }
  
    const newWallet = {
      name:
        walletName.includes(" ") === true
          ? walletName.split(" ").join("_")
          : walletName,
      accounts: new Array(),
      contacts: new Array(),
      networkName: networkName
    };
  
    const account = wallet.open(encryptedPasswd);
  
    const address = {
      address: wallet.address.address,
      networktype: wallet.network
    }
    const publicKey = {
      publicKey: account.publicKey,
      address: address
    };
  
    newWallet.accounts.push({
      algo: "pass:bip32",
      brain: true,
      default: true,
      firstAccount: true,
      name: "Primary",
      address: wallet.address.address,
      // public: account.publicKey,
      publicAccount: publicKey,
      encrypted: wallet.encryptedPrivateKey.encryptedKey,
      iv: wallet.encryptedPrivateKey.iv,
      network: wallet.network,
      balance: '0.000000',
      isMultisign: null,
      multisigAccountGraphInfo: null,
      nis1Account: null,
      mosaic: null,
    });
  
    this.state.wallets.push(newWallet);
    try {
      localStorage.setItem(
        config.localStorage.walletKey,
        JSON.stringify(this.state.wallets)
      );
    } catch (err) {
      if (config.debug) {
        console.error("addNewWallet error caught", err);
      }
      return 0;
    }
    return account.privateKey;
  }

  verifyExistingAccountName(walletName, accountName){
    const wallet = this.getWalletByName(walletName);
    const account = wallet.accounts.find((element) => element.name.toUpperCase() === accountName.toUpperCase().trim());
    return (account) ? 1 : 0;
  }

  verifyWalletPassword(walletName, password, networkName = undefined){
    const wallet = networkName ? this.getWalletByNameAndNetwork(walletName, networkName) : this.getWalletByName(walletName);
    if (!wallet) {
      if (config.debug) {
        console.error(
          "loginToWallet triggered with invalid wallet name",
          walletName
        );
      }
      return -1;
    }
  
    if (config.debug) {
      console.log("loginToWallet triggered with", walletName);
    }
  
    const account = wallet.accounts.find((element) => element.firstAccount);
  
    const common = {
      password: password,
    };
  
    if (
      !Crypto.passwordToPrivateKey(
        common,
        account,
        account.algo == "pass:bip32" ? WalletAlgorithm.Pass_bip32 : account.algo
      )
    ) {
      console.log('fail');
      return 0;
    }
  
    if (
      !App.isPrivateKeyValid(common.privateKey) ||
      !Account.createFromPrivateKey(
        common.privateKey,
        account.network
      ).address.plain() === App.pretty(account.address)
    ) {
      return 0;
    }
  
    return 1;
  }

  deleteWallet(walletName, password, networkName = undefined) {
    /* verify with password benjamin lai 11/3 */
    let verify = networkName ? this.verifyWalletPassword(walletName, password, networkName) : this.verifyWalletPassword(walletName, password);
    if(verify < 1){
      return verify;
    }
    // end verify with password
  
    const walletIndex = networkName ? this.getWalletIndexByNameAndNetwork(walletName, networkName) : this.getWalletIndexByNameAndNetwork(walletName);
    if (walletIndex == -1) {
      if (config.debug) {
        console.error(
          "deleteWallet triggered with non-existing wallet name",
          walletName
        );
      }
      return -1;
    }
  
    if (config.debug) {
      console.log("deleteWallet triggered with", walletName);
    }
  
    if (this.state.wallets.splice(walletIndex, 1).length != 0) {
      localStorage.setItem(
        config.localStorage.walletKey,
        JSON.stringify(this.state.wallets)
      );
      return 1;
    }
    return -1;
  }

  init(){
    const walletSession = JSON.parse(sessionStorage.getItem('currentWalletSession'));
    if(walletSession){
      // session is not null - copy to state
      this.currentWallet.value = walletSession;
      this.isLogin.value = true;
      this.connectors.startListening(this.currentWallet.value.accounts);
      
      return true;
    }
  }

  loginToWallet(walletName, password) {
    const wallet = this.getWalletByName(walletName);
    if (!wallet) {
      if (config.debug) {
        console.error(
          "loginToWallet triggered with invalid wallet name",
          walletName
        );
      }
      return -1;
    }
  
    if (config.debug) {
      console.log("loginToWallet triggered with", walletName);
    }
  
    const account = wallet.accounts.find((element) => element.default == true);
    if (!account) {
      if (config.debug) {
        console.error(
          "loginToWallet triggered with invalid accounts",
          walletName
        );
      }
      return -1;
    }
  
    const common = {
      password: password,
    };
  
    if (
      !Crypto.passwordToPrivateKey(
        common,
        account,
        account.algo == "pass:bip32" ? WalletAlgorithm.Pass_bip32 : account.algo
      )
    ) {
      return 0;
    }
  
    if (
      !App.isPrivateKeyValid(common.privateKey) ||
      !Account.createFromPrivateKey(
        common.privateKey,
        account.network
      ).address.plain() === App.pretty(account.address)
    ) {
      return 0;
    }
    // wallet.accounts.forEach((account) => {
    //   let privateKey = appStore.decryptPrivateKey(password, account.encrypted, account.iv);
    //   const accountDetail = Account.createFromPrivateKey(privateKey, account.network);
    //   console.log(privateKey)
    //   console.log(accountDetail.address)
    //   subscribeConfirmed(accountDetail.address, appStore, siriusStore);
    // });
  
    this.currentWallet.value = wallet;
  
    this.connectors.initListenerSetting(this._buildWSEndpointURL());

    this.connectors.startListening(wallet.accounts);
    //multiSign.updateAccountsMultiSign(walletName);
    this.isLogin.value = true;

    try {
      sessionStorage.setItem(
        'currentWalletSession',
        JSON.stringify(wallet)
      );
    } catch (err) {
      if (config.debug) {
        console.error("updateAccountState error caught", err);
      }
      return 0;
    }
    return 1;
  }

  logoutOfWallet() {
    if (config.debug) {
      console.error("logoutOfWallet triggered");
    }
    this.connectors.stopListening();
    if (!this.currentWallet.value) {
      return false;
    }
    this.currentWallet.value = null;
    sessionStorage.removeItem('currentWalletSession');
    return true;
  }

  updateAccountState(account, networkType, accountName){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    // get wallet index
    const addressObject = {
      address: account.address.address,
      networktype: networkType
    };
    const publicKey = {
      publicKey: account.publicKey,
      address: addressObject
    };
  
    const acc = {
      algo: "pass:bip32",
      brain: true,
      default: false,
      firstAccount: false,
      name: accountName.trim().replace(/ /g,"_"),
      address: account.address.address,
      publicAccount: publicKey,
      encrypted: account.encryptedPrivateKey.encryptedKey,
      iv: account.encryptedPrivateKey.iv,
      network: networkType,
      balance: '0.000000',
      isMultisign: null,
      multisigAccountGraphInfo: null,
      nis1Account: null,
      mosaic: null,
    };
  
    wallet.accounts.push(acc);
    // update currentLoggedInWallet
    this.currentWallet.value = wallet;
  
    // enable listener
    //addListenerstoAccount(acc);
  
    sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
    // update localStorage
    try {
      localStorage.setItem(
        config.localStorage.walletKey,
        JSON.stringify(this.state.wallets)
      );
    } catch (err) {
      if (config.debug) {
        console.error("updateAccountState error caught", err);
      }
      return 0;
    }
    return 1;
  }

  updateCurrentWallet(account){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    wallet.accounts.push(account);
    // enable listener
    //addListenerstoAccount(account);
    sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
    // update localStorage
    try {
      localStorage.setItem(
        config.localStorage.walletKey,
        JSON.stringify(this.state.wallets)
      );
    } catch (err) {
      if (config.debug) {
        console.error("updateAccountState error caught", err);
      }
      return 0;
    }
    return 1;
  }

  updateAccountName(name, oriName){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    const exist_account = wallet.accounts.find((element) => element.name == name.trim());
    const exist_account_index = wallet.accounts.findIndex((element) => element.name == name.trim());
    const account_index = wallet.accounts.findIndex((element) => element.name == oriName);
  
    if(exist_account && (exist_account_index != account_index)){
      return 2;
    }
  
    // get account
    const account = wallet.accounts.find((element) => element.name == oriName);
    if (!account) {
      if (config.debug) {
        console.error("updateAccountName triggered with invalid account name");
      }
      return -1;
    }
    account.name = name.trim().replace(/ /g,"_");
    sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
    // update localStorage
    try {
      localStorage.setItem(
        config.localStorage.walletKey,
        JSON.stringify(this.state.wallets)
      );
    } catch (err) {
      if (config.debug) {
        console.error("updateAccountState error caught", err);
      }
      return 0;
    }
    return 1;
  }

  setAccountDefault(address){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    wallet.accounts.map(x => {x.default = false;});
    // set account with the address as default
    const account = wallet.accounts.find((element) => element.address == address);
    account.default = true;
    this.currentWallet.value = wallet;
    sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
    // update localStorage
    try {
      localStorage.setItem(
        config.localStorage.walletKey,
        JSON.stringify(this.state.wallets)
      );
    } catch (err) {
      if (config.debug) {
        console.error("updateAccountState error caught", err);
      }
      return 0;
    }
    return 1;
  }

  getAccDetails(name){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    const account = wallet.accounts.find((element) => element.name == name);
    if (!account) {
      if (config.debug) {
        console.error("getAccDetails triggered with invalid account name");
      }
      return -1;
    }
    return account;
  }

  getAccDetailsByAddress(address){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    const account = wallet.accounts.find((element) => element.address == address);
    console.log('searching for this: ' + address);
    console.log(account);
    if (!account) {
      if (config.debug) {
        console.error("getAccDetails triggered with invalid account address");
      }
      return -1;
    }
    return account;
  }

  getAccountPassword(accountName, password){
    const account = this.getAccDetails(accountName);
    return this.decryptPrivateKey(password, account.encrypted, account.iv);
  }

  deleteAccount(password, address) {
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    const accountIndex = wallet.accounts.findIndex((element) => element.address == address);
  
    const verify = this.verifyWalletPassword(this.state.currentLoggedInWallet.name, password);
    if(verify<1){
      return verify;
    }
    // end verify with password
    if (accountIndex < 0) {
      if (config.debug) {
        console.error("deleteAccount triggered with non-existing account name");
      }
      return -1;
    }
    if (wallet.accounts.splice(accountIndex, 1).length != 0) {
      this.currentWallet.value = wallet;
      sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
      localStorage.setItem(
        config.localStorage.walletKey,
        JSON.stringify(this.state.wallets)
      );
      return 1;
    }
    return -1;
  }

  getCurrentAdd(walletName){
    const wallet = this.getWalletByName(walletName);
    const account = wallet.accounts.find((element) => element.firstAccount);
    return account.address;
  }

  saveContact(contactName, contactAddress){
    contactAddress = contactAddress.split('-').join('')
    // verify address and name
    const wallet =this.getWalletByName(this.state.currentLoggedInWallet.name);
    // check for existing account address in wallet
    const accountAddIndex = wallet.accounts.findIndex((element) => element.address == contactAddress);
    // check for existing account name in wallet
    const accountNameIndex = wallet.accounts.findIndex((element) => element.name.toLowerCase() == contactName.toLowerCase());
    const contactAddIndex = (wallet.contacts!=undefined)?wallet.contacts.findIndex((element) => element.address == contactAddress):(-1);
    const contactNameIndex =(wallet.contacts!=undefined)?wallet.contacts.findIndex((element) => element.name.toLowerCase() == contactName.toLowerCase()):(-1);
    const errMsg = ref('');
  
    if(contactAddIndex >= 0 || accountAddIndex >= 0 || contactNameIndex >= 0 || accountNameIndex >= 0 ){
      errMsg.value = 'Address or Name already exist';
    }
  
    if(wallet.contacts == undefined){
      wallet.contacts = [];
    }
  
    if(!errMsg.value){
      // add into contact list
      wallet.contacts.push({
        name: contactName,
        address: contactAddress,
      });
      sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
      // update localStorage
      try {
        localStorage.setItem(
          config.localStorage.walletKey,
          JSON.stringify(this.state.wallets)
        );
      } catch (err) {
        if (config.debug) {
          console.error("saveContact error caught", err);
        }
        return 0;
      }
      return true;
    }else{
      return errMsg.value;
    }
  }

  fetchAccountInfo(wallet, accountHttp){
    const addresses = [];
    wallet.accounts.forEach((element) => {
      addresses.push(Address.createFromPublicKey(element.publicAccount.publicKey, element.network));
    });
  
    return new Promise((resolve, reject) => {
      try{
        accountHttp.getAccountsInfo(addresses).subscribe(accountInfo => {
          resolve(accountInfo);
        }, error => {
          console.warn(error);
          reject(false);
        });
      }catch(err){
        console.warn(err);
        reject(false);
      }
    });
  }

  getTotalBalance(){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    let balance = 0;
    
    if(!wallet){
      return balance.toFixed(6);
    }
  
    wallet.accounts.forEach((item) => {
      balance += parseFloat(item.balance);
    });
    return balance.toFixed(6);
  }

  // get XPX balance for each account in the current logged in wallet and update state
  getXPXBalance(walletName){

    const wallet = this.getWalletByName(walletName);
    const xpxNamespace = new NamespaceId('prx.xpx');
    let xpxAmount = 0;
    return new Promise((resolve) => {
      this.fetchAccountInfo(wallet, this.accountHttp).then((res)=>{
        wallet.accounts.forEach((add) => {
          const account = wallet.accounts.find((e) => e.address == add.address);
          account.mosaic = [];
          const mosaicList = [];
          const mosaicAmount = {};
          
          const address = res.find((element) => element.address.address == add.address);
          if(address != undefined){

            this.namespaceHttp.getLinkedMosaicId(xpxNamespace).subscribe((xpxMosaicId) => {

              for(const mosaic of address.mosaics){
                if(mosaic.id.toHex() === xpxMosaicId.toHex() ){
                  xpxAmount = mosaic.amount.compact() / Math.pow(10, XpxMosaicProperties.MOSAIC_PROPERTIES.divisibility);
                }else{
                  mosaicList.push(mosaic.id);
                  mosaicAmount[mosaic.id.toHex()] = mosaic.amount.compact();
                }
              }
              this.mosaicHttp.getMosaics(mosaicList).subscribe((mosaicInfo) => {
                mosaicInfo.forEach((mosaic) => {
                  account.mosaic.push({ id: mosaic.mosaicId.toHex(), amount: mosaicAmount[mosaic.mosaicId.toHex()]/Math.pow(10, mosaic.divisibility), divisibility: mosaic.divisibility })
                })
              }, error => {
                  console.error(error);
              }, () => {
                  // console.log('Get balance of ' + add.address );
              })
              account.balance = String(parseFloat(xpxAmount).toFixed(6));
            });
          }else{
            account.balance = '0.000000';
          }
        });
        resolve(wallet);
      });
    });
  }

  updateXPXBalance(walletName){
    // get latest xpx amount
    this.getXPXBalance(walletName).then(()=> {
      try {
        const wallet = this.getWalletByName(walletName);
        this.currentWallet.value = wallet;
        sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
      } catch (err) {
        if (config.debug) {
          console.error("updateAccountState error caught", err);
        }
        return 0;
      }
      return 1;
    });
  }

  getFirstAccName(){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    const acc = wallet.accounts.find((element) => element.default == true);
    return acc.name;
  }

  getFirstAccAdd(){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    const acc = wallet.accounts.find((element) => element.default == true);
    return acc.address;
  }

  getFirstAccBalance(address){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    const acc = wallet.accounts.find((element) => element.address == address);
    return acc.balance;
  }

  displayBalance(){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    if(wallet.accounts.length == 1){
      let amount = 0;
      wallet.accounts.forEach((element)=> {
        amount = element.balance;
      });
      return amount;
    }
  }

  getMosaicInfo(address, mosaicId){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    const account = wallet.accounts.find((element) => element.address == address);
    const mosaic = account.mosaic.find((element) => element.id == mosaicId);
    return mosaic;
  }

  getContact(){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    var contact = [];
    var accountCount = wallet.accounts.length;
    wallet.accounts.forEach((element, index) => {
      contact.push({
        val: element.address,
        text: element.name + ' - Owner account',
        id: (index + 1),
      });
    });
    if(wallet.contacts!=undefined){
      wallet.contacts.forEach((element, index) => {
        contact.push({
          val: element.address,
          text: element.name + ' - Contact',
          id: (accountCount + index + 1),
        });
      });
    }
    return contact;
  }

  verifyPublicKey(add, accountHttp){
    const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
    let address;
    address = Address.createFromRawAddress(add.toLocaleUpperCase());
    return new Promise((resolve) => {
      const accountInfo = accountHttp.getAccountInfo(address);
      accountInfo.subscribe(
        (acc) => {
          if (acc.publicKey === invalidPublicKey) {
            console.warn(`The receiver's public key is not valid for sending encrypted messages`);
            resolve(true)
          }
          resolve(false);
        },
        (error) => {
          console.warn('Err: ' + error);
          resolve(true);
        }
      );
    });
  }

  verifyRecipientInfo(recipient,accountHttp) {
    return new Promise((resolve, reject) => {
      this.verifyPublicKey(recipient, accountHttp).then((res) => {
        resolve(res);
      }).catch(function(error) {
        // handle error
        reject("Error is: " + error);
      })
    });
  }

  checkAvailableContact(recipient){
    const wallet = this.getWalletByName(this.state.currentLoggedInWallet.name);
    let isInContacts = true;
    if(wallet.contacts != undefined){
      isInContacts = (wallet.contacts.findIndex((element) => element.address == recipient) == -1);
    }
    return ( isInContacts && (wallet.accounts.findIndex((element) => element.address == recipient) == -1))?false:true;
  }

  static pretty(address){
    return Address.createFromRawAddress(address).pretty();
    //return address.replace(/([a-zA-Z0-9]{6})([a-zA-Z0-9]{6})([a-zA-Z0-9]{6})([a-zA-Z0-9]{6})([a-zA-Z0-9]{6})([a-zA-Z0-9]{6})([a-zA-Z0-9]{4})/, "$1-$2-$3-$4-$5-$6-$7");
  }

  decryptPrivateKey(password, encryptedKey, iv) {
    const common = {
      password: password,
      privateKey: ''
    };
  
    const wallet = {
      encrypted: encryptedKey,
      iv,
    };
  
    Crypto.passwordToPrivateKey(common, wallet, WalletAlgorithm.Pass_bip32);
    return common.privateKey;
  }

  _buildAPIEndpointURL(){

    var portNumber = this.state.currentConnectedEndpointPort;
    var host = this.state.currentConnectedEndpoint;
      
    return location.protocol=='https:' ? `https://${host}` : `http://${host}:${portNumber}`;
  }

  _buildWSEndpointURL(){

    var portNumber = this.state.currentConnectedEndpointPort;
    var host = this.state.currentConnectedEndpoint;
      
    return location.protocol=='https:' ? `wss://${host}` : `ws://${host}:${portNumber}`;
  }
}