import { readonly } from "vue";
import {
  Account,
  Address,
  AggregateTransaction,
  Deadline,
  PublicAccount,
  LockFundsTransaction,
  ModifyMultisigAccountTransaction,
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
import { announceAggregateBonded, announceLockfundAndWaitForConfirmation } from '../util/listener.js';
const config = require("@/../config/config.json");


export class MultiSign {
  
}

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
  var accountCount = 0;
  wallet.accounts.forEach((element, index) => {
    if(selected.indexOf(element.address) < 0){
      contact.push({
        val: element.address,
        text: element.name + ' - Owner account',
        id: (index + 1),
      });
      accountCount +=1;
    }
  });
  if(wallet.contacts!=undefined){
    wallet.contacts.forEach((element, index) => {
      if(selected.indexOf(element.address) < 0){
        contact.push({
          val: element.address,
          text: element.name + ' - Contact',
          id: (accountCount + index + 1),
        });
      }
    });
  }
  return contact;
}

/* coSign: array() */
function convertAccount(coSign, numApproveTransaction, numDeleteUser, accountToConvertName, walletPassword){

  let verify = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword);
  if(verify < 1){
    return verify;
  }

  const add = fetch(siriusStore.state.selectedChainNode + '/block/1').then((res) => res.json()).then((data) => { return data.meta.generationHash });

  return add.then((generationHash) => {
    const multisigCosignatory = [];
    console.log('Account to convert name: ' + accountToConvertName);
    const accountDetails = appStore.getAccDetails(accountToConvertName);

    const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
    // const cosignatoryAccountOriginatorPublicKey = accountDetails.publicAccount.publicKey;
    // const cosignatoryAccountOriginator = PublicAccount.createFromPublicKey(cosignatoryAccountOriginatorPublicKey, networkType);
    let privateKey = appStore.decryptPrivateKey(sessionStorage.getItem('walletPassword'), accountDetails.encrypted, accountDetails.iv);
    const accountToConvert = Account.createFromPrivateKey(privateKey, networkType);
    console.log(accountToConvert)
    // multisigCosignatory.push(new MultisigCosignatoryModification(
    //   MultisigCosignatoryModificationType.Add,
    //   cosignatoryAccountOriginator,
    // ));

    const cosignatory = [];
    coSign.forEach((publicKey, index) => {
      cosignatory[index] = PublicAccount.createFromPublicKey(publicKey, networkType);
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

    const transactionHttp = new TransactionHttp(siriusStore.state.selectedChainNode);
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

function checkIsMultiSig(accountAddress){
  return new Promise((resolve, reject) => {
    const address = Address.createFromRawAddress(accountAddress);
    multisigAccountInfo(address).subscribe(info => {
      const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
      const account = wallet.accounts.find((element) => element.address == accountAddress);
      account.isMultisign = info;
      resolve(true);
    }, error => {
      console.error(error);
      reject(false);
    });
  });
}

function updateAccountsMultiSign(walletName){
  const wallet = appStore.getWalletByName(walletName);
  try {
    wallet.accounts.forEach((element) => {
      const accountAddress = Address.createFromRawAddress(element.address);
      multisigAccountInfo(accountAddress).subscribe(info => {
        const account = wallet.accounts.find((e) => e.address == element.address);
        account.isMultisign = info;
      }, error => {
          console.error(error);
      });
    });
    localStorage.setItem(
      config.localStorage.walletKey,
      JSON.stringify(appStore.state.wallets)
    );
  } catch (err) {
    if (config.debug) {
      console.error("updateAccountsMultiSign error caught", err);
    }
    return 'invalid_wallet';
  }
}

export const multiSign = readonly({
  // config,
  generateContact,
  verifyContactPublicKey,
  convertAccount,
  onPartial,
  checkIsMultiSig,
  updateAccountsMultiSign,
});
