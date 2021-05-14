import { readonly } from "vue";
import {
  Account,
  Address,
  AggregateTransaction,
  CosignatureTransaction,
  Deadline,
  PublicAccount,
  LockFundsTransaction,
  ModifyMultisigAccountTransaction,
  // MultisigAccountGraphInfo,
  MultisigCosignatoryModification,
  MultisigCosignatoryModificationType,
  NetworkCurrencyMosaic,
  TransactionHttp,
  UInt64,
  QueryParams,
} from "tsjs-xpx-chain-sdk";

// import { environment } from '../environment/environment.js';

import { appStore } from "@/store/app";
import { siriusStore } from "@/store/sirius";
import { announceAggregateBonded, announceLockfundAndWaitForConfirmation, modifyMultisigAnnounceLockfundAndWaitForConfirmation, modifyMultisigAnnounceAggregateBonded } from '../util/listener.js';
// 
const config = require("@/../config/config.json");

function verifyContactPublicKey(add, accountHttp){
  const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
  let address;
  address = Address.createFromRawAddress(add.toLocaleUpperCase());
  return new Promise((resolve) => {
    const accountInfo = accountHttp.getAccountInfo(address);
    accountInfo.subscribe(
      (account) => {
        if (account.publicKey == invalidPublicKey) {
          console.warn(`The receiver's public key is not valid for sending encrypted messages`);
          resolve({status: false});
        }else{
          let payload = { status: true, publicKey: account.publicKey };
          resolve(payload);
        }
      },
      (error) => {
        console.warn('Err: ' + error);
        resolve(true);
      }
    );
  });
}

function generateContact(selected){
  const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
  var contact = [];
  wallet.accounts.forEach((element) => {
    if(selected.indexOf(element.address) < 0){
      contact.push({
        value: element.address,
        label: element.name + ' - Owner account',
      });
    }
  });
  if(wallet.contacts != undefined){
    wallet.contacts.forEach((element) => {
      if(selected.indexOf(element.address) < 0){
        contact.push({
          value: element.address,
          label: element.name + ' - Contact',
        });
      }
    });
  }
  return contact;
}

const getPublicKey = (address) => {
  return new Promise((resolve, reject) => {
    siriusStore.accountHttp.getAccountInfo(address).subscribe(accountInfo => {
      resolve(accountInfo.publicKey);
    }, error => {
      reject('invalid');
      console.error(error);
    }, () => {
        console.log('done.');
    });
  });
}

/* coSign: array() */
function convertAccount(coSign, numApproveTransaction, numDeleteUser, accountToConvertName, walletPassword){

  let verify = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword);
  if(verify < 1){
    return verify;
  }

  const add = fetch(siriusStore._buildAPIEndpointURL(siriusStore.state.selectedChainNode) + '/block/1').then((res) => res.json()).then((data) => { return data.meta.generationHash });

  return add.then( async (generationHash) => {
    const multisigCosignatory = [];
    // console.log('Account to convert name: ' + accountToConvertName);
    const accountDetails = appStore.getAccDetails(accountToConvertName);

    const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
    let privateKey = appStore.decryptPrivateKey(walletPassword, accountDetails.encrypted, accountDetails.iv);
    const accountToConvert = Account.createFromPrivateKey(privateKey, networkType);

    const cosignatory = [];
    coSign.forEach( async (cosignKey, index) => {
      if(cosignKey.length == 64){
        cosignatory[index] = PublicAccount.createFromPublicKey(cosignKey, networkType);
      }else if(cosignKey.length == 40 || cosignKey.length == 46){
        let address = Address.createFromRawAddress(cosignKey);

        try {
          let publicKey;
          publicKey = await getPublicKey(address);
          cosignatory[index] = PublicAccount.createFromPublicKey(publicKey, networkType);
        } catch (error) {
          console.log(error);
        }
      }

      multisigCosignatory.push(new MultisigCosignatoryModification(
        MultisigCosignatoryModificationType.Add,
        cosignatory[index],
      ));
    });

    const convertIntoMultisigTransaction = ModifyMultisigAccountTransaction.create(
      Deadline.create(),
      numApproveTransaction,
      numDeleteUser,
      multisigCosignatory,
      networkType
    );

    const aggregateTransaction = AggregateTransaction.createBonded(
      Deadline.create(),
      [convertIntoMultisigTransaction.toAggregate(accountToConvert.publicAccount)],
      networkType
    );

    const signedAggregateBoundedTransaction = accountToConvert.sign(aggregateTransaction, generationHash);

    const lockFundsTransaction = LockFundsTransaction.create(
      Deadline.create(),
      NetworkCurrencyMosaic.createRelative(10),
      UInt64.fromUint(1000),
      signedAggregateBoundedTransaction,
      networkType
    );

    const lockFundsTransactionSigned = accountToConvert.sign(lockFundsTransaction, generationHash);

    const transactionHttp = new TransactionHttp(siriusStore._buildAPIEndpointURL(siriusStore.state.selectedChainNode));
    (async ()=>{
      try {
          const confirmedTx = await announceLockfundAndWaitForConfirmation(accountToConvert.address, lockFundsTransactionSigned, lockFundsTransactionSigned.hash, transactionHttp);
          console.log('confirmedTx');
          console.log(confirmedTx);
          // eslint-disable-next-line no-unused-vars
          var aggregateTx = await announceAggregateBonded(accountToConvert.address, signedAggregateBoundedTransaction, signedAggregateBoundedTransaction.hash, confirmedTx, transactionHttp )
          console.log('aggregateTx');
          console.log(aggregateTx);
          console.log("Done");
      } catch (error) {
          console.log(error);
      }
    })();
  });
}

function getAggregateBondedTransactions(publicAccount) {
  return siriusStore.accountHttp.aggregateBondedTransactions(publicAccount, new QueryParams(100));
}

function onPartial(publicAccount){
  return new Promise((resolve) => {
    getAggregateBondedTransactions(publicAccount).subscribe((txOnpartial) => {
      let isPartial = false;
      if (txOnpartial !== null && txOnpartial.length > 0) {
        for (const tx of txOnpartial) {
          for (let i = 0; i < tx.innerTransactions.length; i++) {
            isPartial = (tx.innerTransactions[i].signer.publicKey === publicAccount.publicKey);
            if (isPartial) {
              break;
            }
          }
          if (isPartial) {
            break;
          }
        }
      }
      resolve(isPartial);
    });
  });
}

function multisigAccountInfo(address) {
  return siriusStore.accountHttp.getMultisigAccountInfo(address);
}

function getMultisigAccountGraphInfo(address) {
  return siriusStore.accountHttp.getMultisigAccountGraphInfo(address);
}

function updateAccountMultisigGraphInfo(accountAddress){
  return new Promise((resolve) => {
    const address = Address.createFromRawAddress(accountAddress);
    getMultisigAccountGraphInfo(address).subscribe(info => {
      const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
      const account = wallet.accounts.find((element) => element.address == accountAddress);
      const multigraph = [];
      // console.log('info.multisigAccounts');
      // console.log(accountAddress + ' ' + account.name);
      // console.log(info.multisigAccounts);
      info.multisigAccounts.forEach(( multi ) => {
        // console.log(multi);
        multi.forEach((m) =>{
          // console.log(m)
          // console.log(m.address)
          multigraph.push(m);
        })
      });
      account.multisigAccountGraphInfo = multigraph;
      resolve(info);
      try {
        sessionStorage.setItem(
          'currentWalletSession',
          JSON.stringify(wallet)
        );
        localStorage.setItem(
          config.localStorage.walletKey,
          JSON.stringify(appStore.state.wallets)
        );
      } catch (err) {
        console.error("checkIsMultiSig error caught", err);
      }
    }, error => {
      console.log(error);
    });
  });
}

function checkIsMultiSig(accountAddress){
  return new Promise((resolve) => {
    const address = Address.createFromRawAddress(accountAddress);
    multisigAccountInfo(address).subscribe(info => {
      const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
      const account = wallet.accounts.find((element) => element.address == accountAddress);
      account.isMultisign = info;
      let verify = false;
      if(account.isMultisign != '' || account.isMultisign != null){
        if(account.isMultisign.cosignatories != undefined){
          if(account.isMultisign.cosignatories.length > 0){
            verify = true;
          }
        }
      }
      resolve(verify);
      try {
        sessionStorage.setItem(
          'currentWalletSession',
          JSON.stringify(wallet)
        );
        localStorage.setItem(
          config.localStorage.walletKey,
          JSON.stringify(appStore.state.wallets)
        );
      } catch (err) {
        console.error("checkIsMultiSig error caught", err);
      }
      // eslint-disable-next-line no-unused-vars
    }, error => {
      resolve(false);
    });
  });
}

function updateAccountsMultiSign(walletName){
  const wallet = appStore.getWalletByName(walletName);
  wallet.accounts.forEach( async (element) => {
    try {
      await checkIsMultiSig(element.address);
      await updateAccountMultisigGraphInfo(element.address);
    } catch (err) {
      console.log(err);
      console.error("updateAccountsMultiSign error caught", err);
    }
  });
  return 'invalid_wallet';
}

const removeUnrelatedMultiSig = (walletName) => {
  const wallet = appStore.getWalletByName(walletName);
  let multiSigAccounts = wallet.accounts.filter((element) => element.encrypted === undefined);
  let removeMultiSig = [];
  multiSigAccounts.forEach( (element) => {
    let validMultiSig = false;
    if(element.isMultisign){
      element.isMultisign.cosignatories.forEach((account) => {
        if(wallet.accounts.find(element => element.address == account.address.address)){
          validMultiSig = true;
        }
      });
    }
    if(!validMultiSig){
      removeMultiSig.push(element.address);
    }
  });
  // remove multisig account
  appStore.removeMultiSigAccount(removeMultiSig);
};

const cosignMiltisigTransaction = (signedAggregateBoundedTransaction, walletPassword) => {
  let coSignAddress = signedAggregateBoundedTransaction.account;
  const accountDetails = appStore.getAccDetailsByAddress(coSignAddress);
  const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
  let privateKey = appStore.decryptPrivateKey(walletPassword, accountDetails.encrypted, accountDetails.iv);
  const account = Account.createFromPrivateKey(privateKey, networkType);

  const cosignAggregateBondedTransaction = (signedAggregateBoundedTransaction, account) => {
    const cosignatureTransaction = CosignatureTransaction.create(signedAggregateBoundedTransaction);
    let signStatus = account.signCosignatureTransaction(cosignatureTransaction);
    return signStatus;
  };
  siriusStore.accountHttp.aggregateBondedTransactions(account.publicAccount).subscribe((transactions)=>{
    console.log(transactions);
    for(const aggregateTx of transactions){
      // view transaction details...
      let cosigned = aggregateTx.signedByAccount(account.publicAccount);
      if(!cosigned && aggregateTx.transactionInfo.hash === signedAggregateBoundedTransaction.transactionInfo.hash){
          let cosignatureSignedTransaction = cosignAggregateBondedTransaction(aggregateTx, account);
          siriusStore.transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction);
      }
    }
  });
};

const createNewMultiSigAccount = (publicAccount) => {
  const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
  // check if multiSig is already in wallet
  const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
  let multiSig = wallet.accounts.find((element) => element.address === publicAccount.address.address);
  if(multiSig){
    return;
  }

  const addressObject = {
    address: publicAccount.address.address,
    networktype: networkType
  };
  const publicKey = {
    publicKey: publicAccount.publicKey,
    address: addressObject
  };
  const account = {
    default: false,
    firstAccount: false,
    name: 'MULTISIG-' + publicAccount.address.address.substr(-4),
    address: publicAccount.address.address,
    publicAccount: publicKey,
    balance: 0,
    isMultisign: null,
    multisigAccountGraphInfo: null,
    nis1Account: null,
    mosaic: null,
  };
  appStore.updateCurrentWallet(account);
}

// modify multisig
function modifyMultisigAccount(coSign, removeCosign, numApproveTransaction, numDeleteUser, cosigners, multisigAccount, walletPassword){

  let verify = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword);
  if(verify < 1){
    return verify;
  }

  const add = fetch(siriusStore._buildAPIEndpointURL(siriusStore.state.selectedChainNode) + '/block/1').then((res) => res.json()).then((data) => { return data.meta.generationHash });

  return add.then( async (generationHash) => {
    const multisigCosignatory = [];
    let coSigner = [];
    const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
    if(cosigners.length > 0){
      cosigners.forEach((signer) => {
        const accountDetails = appStore.getAccDetailsByAddress(signer.address);
        let privateKey = appStore.decryptPrivateKey(walletPassword, accountDetails.encrypted, accountDetails.iv);
        coSigner.push(Account.createFromPrivateKey(privateKey, networkType));
      });
    }

    const cosignatory = [];
    coSign.forEach( async (cosignKey, index) => {
      if(cosignKey.length == 64){
        cosignatory[index] = PublicAccount.createFromPublicKey(cosignKey, networkType);
      }else if(cosignKey.length == 40 || cosignKey.length == 46){
        // option to accept address
        let address = Address.createFromRawAddress(cosignKey);

        try {
          let publicKey;
          publicKey = await getPublicKey(address);
          cosignatory[index] = PublicAccount.createFromPublicKey(publicKey, networkType);
        } catch (error) {
          console.log(error);
        }
      }

      multisigCosignatory.push(new MultisigCosignatoryModification(
        MultisigCosignatoryModificationType.Add,
        cosignatory[index],
      ));
    });

    removeCosign.forEach( (element, index) => {
      cosignatory[coSign.length + index] = PublicAccount.createFromPublicKey(element, networkType);
      multisigCosignatory.push(new MultisigCosignatoryModification(
        MultisigCosignatoryModificationType.Remove,
        cosignatory[coSign.length + index],
      ));
    });

    let relativeNumApproveTransaction = numApproveTransaction - multisigAccount.isMultisign.minApproval;
    let relativeNumDeleteUser = numDeleteUser - multisigAccount.isMultisign.minRemoval

    const convertIntoMultisigTransaction = ModifyMultisigAccountTransaction.create(
      Deadline.create(),
      relativeNumApproveTransaction,
      relativeNumDeleteUser,
      multisigCosignatory,
      networkType
    );

    const aggregateTransaction = AggregateTransaction.createBonded(
      Deadline.create(),
      [convertIntoMultisigTransaction.toAggregate(multisigAccount.publicAccount)],
      networkType
    );

    if(coSigner.length > 0){
      let transactions = [];
      coSigner.forEach((coSignerAccount) => {
        const signedAggregateBoundedTransaction = coSignerAccount.sign(aggregateTransaction, generationHash);

        const lockFundsTransaction = LockFundsTransaction.create(
          Deadline.create(),
          NetworkCurrencyMosaic.createRelative(10),
          UInt64.fromUint(1000),
          signedAggregateBoundedTransaction,
          networkType
        );

        const lockFundsTransactionSigned = coSignerAccount.sign(lockFundsTransaction, generationHash);

        transactions.push({ coSignerAccount: coSignerAccount, signedAggregateBoundedTransaction: signedAggregateBoundedTransaction, lockFundsTransactionSigned: lockFundsTransactionSigned });
      });

      const transactionHttp = new TransactionHttp(siriusStore._buildAPIEndpointURL(siriusStore.state.selectedChainNode));
      (async ()=>{
        try {
          let lockFundListeners = [];
          let aggregateBoundedListeners = [];
          let confirmedTx = [];
          let aggregateTx = [];
          // transactions.forEach(async(transaction, item) =>{
          let item = 0;
          for (const transaction of transactions) {
            lockFundListeners[item] = siriusStore.chainWSListener;
            confirmedTx[item] = await modifyMultisigAnnounceLockfundAndWaitForConfirmation(lockFundListeners[item], transaction.coSignerAccount.address, transaction.lockFundsTransactionSigned, transaction.lockFundsTransactionSigned.hash, transactionHttp);
            aggregateBoundedListeners[item] = siriusStore.chainWSListener;
            aggregateTx[item] = await modifyMultisigAnnounceAggregateBonded(aggregateBoundedListeners[item], transaction.coSignerAccount.address, transaction.signedAggregateBoundedTransaction, transaction.signedAggregateBoundedTransaction.hash, confirmedTx[item], transactionHttp );
            ++item;
          }
        } catch (error) {
            console.log(error);
        }
      })();
    }
  });
}

const fetchMultiSigCosigners = (multiSigAddress) => {
  const account = appStore.getAccDetailsByAddress(multiSigAddress);
  if(account.isMultisign.cosignatories){
    let list = [];
    let numCosigner = account.isMultisign.cosignatories.length;
    if(numCosigner > 0){
      if( numCosigner > 1 ){
        account.isMultisign.cosignatories.forEach((element) => {
          let cosignAccount = appStore.getAccDetailsByAddress(element.address.address);
          if(cosignAccount != -1){
            list.push({ address: element.address.address, name: cosignAccount.name });
          }
        });
      }else{
        console.log(account.isMultisign.cosignatories.length)
        let cosignAccount = appStore.getAccDetailsByAddress(account.isMultisign.cosignatories[0].address.address);
        if(cosignAccount != -1){
          list.push({ address: account.isMultisign.cosignatories[0].address.address, name: cosignAccount.name });
        }
      }
    }else{
      list = [];
    }
    return { list: list, length: numCosigner };
  }else{
    return {
      list: [],
      length: 0
    };
  }
}

function fetchWalletCosigner(address){
  let cosign = multiSign.fetchMultiSigCosigners(address);
  let list = [];
  cosign.list.forEach((element) => {
    const account = appStore.getAccDetailsByAddress(element.address);
    list.push({ balance: account.balance, address: element.address, name: element.name });
  });
  list.sort((a, b) => (a.balance < b.balance) ? 1 : -1);
  return { list:list, numCosigner: cosign.numCosigner };
}

export const multiSign = readonly({
  // config,
  getPublicKey,
  generateContact,
  verifyContactPublicKey,
  convertAccount,
  onPartial,
  checkIsMultiSig,
  updateAccountsMultiSign,
  cosignMiltisigTransaction,
  createNewMultiSigAccount,
  updateAccountMultisigGraphInfo,
  getMultisigAccountGraphInfo,
  modifyMultisigAccount,
  fetchMultiSigCosigners,
  fetchWalletCosigner,
  removeUnrelatedMultiSig
});
