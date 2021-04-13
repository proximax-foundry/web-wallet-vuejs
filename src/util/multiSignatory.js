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
} from "tsjs-xpx-chain-sdk";

// import { environment } from '../environment/environment.js';

import { appStore } from "@/store/app";
import { siriusStore } from "@/store/sirius";
import { announceAggregateBonded, announceLockfundAndWaitForConfirmation } from '../util/listener.js';
// const config = require("@/../config/config.json");


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

export const multiSign = readonly({
  // config,
  generateContact,
  verifyContactPublicKey,
  convertAccount,
});
