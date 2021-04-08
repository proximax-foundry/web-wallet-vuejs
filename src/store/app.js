import { computed, reactive, ref, readonly } from "vue";

import {
  Account,
  Address,
  Convert,
  Crypto,
  Password,
  SimpleWallet,
  WalletAlgorithm,
} from "tsjs-xpx-chain-sdk";
import { getMosaics } from '../util/transfer.js';

const sdk = require('tsjs-xpx-chain-sdk');

const config = require("@/../config/config.json");

const name = "Sirius Wallet";

const currentWallet = ref(null);

function getWallets() {
  if (!localStorage.getItem(config.localStorage.walletKey)) {
    localStorage.setItem(config.localStorage.walletKey, "[]");
  }
  return JSON.parse(localStorage.getItem(config.localStorage.walletKey));
}

const state = reactive({
  darkTheme: false,
  wallets: getWallets(),
  currentLoggedInWallet: computed(() => currentWallet.value),
  loggedInWalletFirstAccount: computed(() => {
    if (!currentWallet.value) {
      return undefined;
    }
    return currentWallet.value.accounts.find((element) => element.default);
  }),
});

const explorerBlockHttp = (compactBlock) => {
  return `${config.chainExplorer.url}/${config.chainExplorer.blockRoute}/${compactBlock}`;
};

const explorerPublicKeyHttp = (publicKey) => {
  return `${config.chainExplorer.url}/${config.chainExplorer.publicKeyRoute}/${publicKey}`;
};

function toggleDarkTheme() {
  if (config.debug) {
    console.log("toggleDarkTheme triggered");
  }

  state.darkTheme = !state.darkTheme;
}

function isPrivateKeyValid(privateKey) {
  if (privateKey.length !== 64 && privateKey.length !== 66) {
    return false;
  } else if (!Convert.isHexString(privateKey)) {
    return false;
  } else {
    return true;
  }
}

function getWalletByName(walletName) {
  walletName =
    walletName.includes(" ") === true
      ? walletName.split(" ").join("_")
      : walletName;
  return state.wallets.find((element) => element.name == walletName);
}

function getWalletIndexByName(walletName) {
  walletName =
    walletName.includes(" ") === true
      ? walletName.split(" ").join("_")
      : walletName;
  return state.wallets.findIndex((element) => element.name == walletName);
}

/* benjamin lai */
function getAccountByWallet(walletName){
  const wallet = getWalletByName(walletName);
  const account = wallet.accounts.find((element) => element.default == true);
  return account;
}

function importWallet(decryptedData, network){
  let walletName = decryptedData.name;
  walletName = (walletName.includes(' ') === true) ? walletName.split(' ').join('_') : walletName;
  if(getWalletByName(walletName) == undefined){
    if (decryptedData.accounts[0].network == network) {
      const accounts = [];
      if (decryptedData.accounts.length !== undefined) {
        for (const element of decryptedData.accounts) {
          accounts.push(element);
        }
      } else {
        // invalid without account
        return 'invalid_wallet';
      }

      const wallet = {
        name: walletName,
        accounts: accounts
      }
      state.wallets.push(wallet);
      try {
        localStorage.setItem(
          config.localStorage.walletKey,
          JSON.stringify(state.wallets)
        );
      } catch (err) {
        if (config.debug) {
          console.error("importWallet error caught", err);
        }
        return 'invalid_wallet';
      }
      return 'wallet_added';
    } else {
      // invalid network type error message
      return 'invalid_network';
    }
  } else {
    // wallet already exist message
    return 'existed_wallet';
  }
}

function addNewWallet(walletName, password, networkType, privateKey) {
  let wallet = getWalletByName(walletName);
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
  };

  const account = wallet.open(encryptedPasswd);

  const address = {
    address: wallet.address.address,
    networktype: wallet.networke
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
    pk: account.privateKey,
    encrypted: wallet.encryptedPrivateKey.encryptedKey,
    iv: wallet.encryptedPrivateKey.iv,
    network: wallet.network,
    balance: '0.000000',
  });

  state.wallets.push(newWallet);
  try {
    localStorage.setItem(
      config.localStorage.walletKey,
      JSON.stringify(state.wallets)
    );
  } catch (err) {
    if (config.debug) {
      console.error("addNewWallet error caught", err);
    }
    return 0;
  }
  return 1;
}

function verifyWalletPassword(walletName, password){
  const wallet = getWalletByName(walletName);
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
  // if (!account) {
  //   if (config.debug) {
  //     console.error(
  //       "loginToWallet triggered with invalid accounts",
  //       walletName
  //     );
  //   }
  //   return -1;
  // }
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
    !isPrivateKeyValid(common.privateKey) ||
    !Account.createFromPrivateKey(
      common.privateKey,
      account.network
    ).address.plain() === pretty(account.address)
  ) {
    return 0;
  }

  return 1;
}

function deleteWallet(walletName, password) {
  /* verify with password benjamin lai 11/3 */
  let verify = verifyWalletPassword(walletName, password);
  if(verify < 1){
    return verify;
  }
  // end verify with password

  const walletIndex = getWalletIndexByName(walletName);
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

  if (state.wallets.splice(walletIndex, 1).length != 0) {
    localStorage.setItem(
      config.localStorage.walletKey,
      JSON.stringify(state.wallets)
    );
    return 1;
  }
  return -1;
}
// check session to verify page has been refreshed
function checkFromSession(appStore, siriusStore){
  const walletSession = JSON.parse(sessionStorage.getItem('currentWalletSession'));
  if(walletSession){
    // session is not null - copy to state
    currentWallet.value = walletSession;
    getMosaics(appStore, siriusStore);
    getXPXBalance(walletSession.name, siriusStore.accountHttp, siriusStore.namespaceHttp).then(() => {
      sessionStorage.setItem('pageRefresh', 'y');
    });
    return true;
  }else{
    // return false to remain not sign in
    sessionStorage.setItem('pageRefresh', 'n');
    return false;
  }
}

function loginToWallet(walletName, password, accountHttp, namespaceHttp) {
  const wallet = getWalletByName(walletName);
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
    !isPrivateKeyValid(common.privateKey) ||
    !Account.createFromPrivateKey(
      common.privateKey,
      account.network
    ).address.plain() === pretty(account.address)
  ) {
    return 0;
  }

  // store password into session
  sessionStorage.setItem('walletPassword', password);

  // get latest xpx amount
  getXPXBalance(walletName, accountHttp, namespaceHttp).then(()=> {
    try {
      const wallet = getWalletByName(walletName);
      currentWallet.value = wallet;
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
  });
}

function logoutOfWallet() {
  if (config.debug) {
    console.error("logoutOfWallet triggered");
  }
  if (!currentWallet.value) {
    return false;
  }
  currentWallet.value = null;
  sessionStorage.removeItem('currentWalletSession');
  return true;
}

// update state after creating account
function updateAccountState(account, networkType, accountName){
  const first_account = state.loggedInWalletFirstAccount;
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
  // get wallet index
  const address = {
    address: account.publicAccount.address.address,
    networktype: account.publicAccount.address.networkType
  }
  const publicKey = {
    publicKey: account.publicAccount.publicKey,
    address: address
  };
  wallet.accounts.push({
    algo: "pass:bip32",
    brain: true,
    default: false,
    firstAccount: true,
    name: accountName,
    address: account.publicAccount.address.address,
    // public: account.public,
    publicAccount: publicKey,
    pk: account.private,
    encrypted: first_account.encrypted,
    iv: first_account.iv,
    network: networkType,
    balance: '0.000000',
  });
  // update currentLoggedInWallet
  currentWallet.value = wallet;
  sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
  // update localStorage
  try {
    localStorage.setItem(
      config.localStorage.walletKey,
      JSON.stringify(state.wallets)
    );
  } catch (err) {
    if (config.debug) {
      console.error("updateAccountState error caught", err);
    }
    return 0;
  }
  return 1;
}

function updateAccountName(name, oriName){
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
  const exist_account = wallet.accounts.find((element) => element.name == name);
  const exist_account_index = wallet.accounts.findIndex((element) => element.name == name);
  const account_index = wallet.accounts.findIndex((element) => element.name == oriName);
  if(exist_account && (exist_account_index != account_index)){
    return 2;
  }
  const account = wallet.accounts.find((element) => element.name == oriName);
  if (!account) {
    if (config.debug) {
      console.error("updateAccountName triggered with invalid account name");
    }
    return -1;
  }
  account.name = name;
  sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
  // update localStorage
  try {
    localStorage.setItem(
      config.localStorage.walletKey,
      JSON.stringify(state.wallets)
    );
  } catch (err) {
    if (config.debug) {
      console.error("updateAccountState error caught", err);
    }
    return 0;
  }
  return 1;
}

function setAccountDefault(address){
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
  wallet.accounts.map(x => {x.default = false;});
  // set account with the address as default
  const account = wallet.accounts.find((element) => element.address == address);
  account.default = true;
  currentWallet.value = wallet;
  sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
  // update localStorage
  try {
    localStorage.setItem(
      config.localStorage.walletKey,
      JSON.stringify(state.wallets)
    );
  } catch (err) {
    if (config.debug) {
      console.error("updateAccountState error caught", err);
    }
    return 0;
  }
  return 1;
}

function getAccDetails(name){
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
  const account = wallet.accounts.find((element) => element.name == name);
  if (!account) {
    if (config.debug) {
      console.error("getAccDetails triggered with invalid account name");
    }
    return -1;
  }
  return account;
}

function getAccountPassword(accountName, password){
  const account = getAccDetails(accountName);
  return decryptPrivateKey(password, account.encrypted, account.iv);
}

function deleteAccount(password, address) {
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
  const accountIndex = wallet.accounts.findIndex((element) => element.address == address);

  const verify = verifyWalletPassword(state.currentLoggedInWallet.name, password);
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
    currentWallet.value = wallet;
    sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
    localStorage.setItem(
      config.localStorage.walletKey,
      JSON.stringify(state.wallets)
    );
    return 1;
  }
  return -1;
}

function getCurrentAdd(walletName){
  const wallet = getWalletByName(walletName);
  const account = wallet.accounts.find((element) => element.firstAccount);
  return account.address;
}

function saveContact(contactName, contactAddress){
  contactAddress = contactAddress.split('-').join('')
  // verify address and name
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
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
        JSON.stringify(state.wallets)
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

function fetchAccountInfo(wallet, accountHttp){
  const addresses = [];
  wallet.accounts.forEach((element) => {
    console.log('Element:');
    console.log(element);
    console.log(element.publicAccount.publicKey);
    console.log(element.network);
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

function getTotalBalance(){
  const wallet = getWalletByName(appStore.state.currentLoggedInWallet.name);
  let balance = 0;
  wallet.accounts.forEach((item) => {
    balance += parseFloat(item.balance);
  });
  return balance.toFixed(6);
}

// get XPX balance for each account in the current logged in wallet and update state
function getXPXBalance(walletName, accountHttp, namespaceHttp){

  const wallet = getWalletByName(walletName);
  const xpxNamespace = new sdk.NamespaceId('prx.xpx');
  let xpxAmount = 0;
  return new Promise((resolve) => {
    fetchAccountInfo(wallet, accountHttp).then((res)=>{
      wallet.accounts.forEach((add) => {
        const address = res.find((element) => element.address.address == add.address);
        if(address != undefined){
          namespaceHttp.getLinkedMosaicId(xpxNamespace).subscribe((xpxMosaicId)=>{
            for(const mosaic of address.mosaics){
              if(mosaic.id.toHex() === xpxMosaicId.toHex() ){
                xpxAmount = mosaic.amount.compact() / Math.pow(10, sdk.XpxMosaicProperties.MOSAIC_PROPERTIES.divisibility);
              }
            }
            add.balance = String(parseFloat(xpxAmount).toFixed(6));
          });
        }else{
          add.balance = '0.000000';
        }
      });
      resolve(wallet);
    });
  });
}

function updateXPXBalance(walletName, accountHttp, namespaceHttp){
  // get latest xpx amount
  getXPXBalance(walletName, accountHttp, namespaceHttp).then(()=> {
    try {
      const wallet = getWalletByName(walletName);
      currentWallet.value = wallet;
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

function getFirstAccName(){
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
  const acc = wallet.accounts.find((element) => element.default == true);
  return acc.name;
}

function getFirstAccAdd(){
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
  const acc = wallet.accounts.find((element) => element.default == true);
  return acc.address;
}

function getFirstAccBalance(address){
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
  const acc = wallet.accounts.find((element) => element.address == address);
  return acc.balance;

  // const address = Address.createFromRawAddress(accountDetails.address);
  // siriusStore.accountHttp
  // .getAccountInfo(address)
  // .subscribe(accountInfo => console.log(accountInfo.balance), err => console.error(err));
}

function displayBalance(){
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
  if(wallet.accounts.length == 1){
    let amount = 0;
    wallet.accounts.forEach((element)=> {
      amount = element.balance;
    });
    return amount;
  }
}

// return mosaic divisibility
function getMosaicInfo(add, mosaicId){
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
  const account = wallet.accounts.find((element) => element.address = add);
  const mosaic = account.mosaic.find((element) => element.id == mosaicId);
  return mosaic;
}


function getContact(){
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
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

function verifyPublicKey(add, accountHttp){
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

function verifyRecipientInfo(recipient,accountHttp) {
  return new Promise((resolve, reject) => {
    verifyPublicKey(recipient, accountHttp).then((res) => {
      resolve(res);
    }).catch(function(error) {
      // handle error
      reject("Error is: " + error);
    })
  });
}

function checkAvailableContact(recipient){
  const wallet = getWalletByName(state.currentLoggedInWallet.name);
  let isInContacts = true;
  if(wallet.contacts != undefined){
    isInContacts = (wallet.contacts.findIndex((element) => element.address == recipient) == -1);
  }
  return ( isInContacts && (wallet.accounts.findIndex((element) => element.address == recipient) == -1))?false:true;
}

function pretty(address){
  return address.replace(/([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})([a-zA-Z0-9]{4})/, "$1-$2-$3-$4-$5-$6-$7");
}

function decryptPrivateKey(password, encryptedKey, iv) {
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

export const appStore = readonly({
  name,
  version: require("@/../package.json").version,
  state,
  explorerBlockHttp,
  explorerPublicKeyHttp,
  toggleDarkTheme,
  importWallet,
  addNewWallet,
  deleteWallet,
  loginToWallet,
  logoutOfWallet,
  getWalletByName,
  getAccountByWallet,
  checkFromSession,
  getTotalBalance,
  verifyWalletPassword,
  updateAccountState,
  setAccountDefault,
  getAccDetails,
  updateAccountName,
  deleteAccount,
  getCurrentAdd,
  saveContact,
  getContact,
  displayBalance,
  getFirstAccName,
  getFirstAccAdd,
  getFirstAccBalance,
  verifyRecipientInfo,
  // makeTransaction,
  checkAvailableContact,
  getMosaicInfo,
  updateXPXBalance,
  pretty,
  decryptPrivateKey,
  getAccountPassword,
});


