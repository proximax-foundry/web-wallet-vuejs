import { computed, reactive, ref, readonly } from "vue";
import {
  Account,
  Convert,
  Crypto,
  Password,
  SimpleWallet,
  WalletAlgorithm,
} from "tsjs-xpx-chain-sdk";

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
  };

  const account = wallet.open(encryptedPasswd);

  newWallet.accounts.push({
    algo: "pass:bip32",
    brain: true,
    default: true,
    firstAccount: true,
    name: "Primary",
    address: wallet.address.address,
    addresspretty: account.address.pretty(),
    public: account.publicKey,
    pk: account.privateKey,
    encrypted: wallet.encryptedPrivateKey.encryptedKey,
    iv: wallet.encryptedPrivateKey.iv,
    network: wallet.network,
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
    ).address.plain() === account.address
  ) {
    return 0;
  }

  return 1;
}

function deleteWallet(walletName, password) {
  /* verify with password benjamin lai 11/3 */
  let verify = verifyWalletPassword(walletName, password);
  if(verify<1){
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

function checkFromSession(){
  const walletSession = JSON.parse(sessionStorage.getItem('currentWalletSession'));

  if(walletSession){
    // session is not null - copy to state
    currentWallet.value = walletSession;
    // set bool for page refresh sign out hack
    sessionStorage.setItem('pageRefresh', 'y');
    return true;
  }else{
    // return false to remain not sign in
    sessionStorage.setItem('pageRefresh', 'n');
    return false;
  }
}

function loginToWallet(walletName, password) {
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
    ).address.plain() === account.address
  ) {
    return 0;
  }

  currentWallet.value = wallet;
  // set current wallet info to sessionStorage
  sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
  return 1;
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
  wallet.accounts.push({
    algo: "pass:bip32",
    brain: true,
    default: false,
    firstAccount: true,
    name: accountName,
    address: account.addressRaw.address,
    addresspretty: account.address,
    public: account.public,
    pk: account.private,
    encrypted: first_account.encrypted,
    iv: first_account.iv,
    network: networkType,
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
    console.log('hm');
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
  verifyWalletPassword,
  updateAccountState,
  setAccountDefault,
  getAccDetails,
  updateAccountName,
  deleteAccount
});


