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
  Wallet,
} from "tsjs-xpx-chain-sdk";
//line 489,491
// import { environment } from '../environment/environment.js';
import { NetworkStateUtils } from "@/state/utils/networkStateUtils";
import { WalletUtils } from "@/util/walletUtils";
import { walletState } from '@/state/walletState'
import { networkState } from "@/state/networkState"; // chainNetwork
import { announceAggregateBonded, announceLockfundAndWaitForConfirmation, modifyMultisigAnnounceLockfundAndWaitForConfirmation, modifyMultisigAnnounceAggregateBonded } from '../util/listener.js';
const walletKey = "sw";

function verifyContactPublicKey(address :string) {
  const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
  return new Promise((resolve) => {
    const accountInfo = WalletUtils.getAccInfo(address);
    accountInfo.then(
      (account) => {
        if (account.publicKey == invalidPublicKey) {
          console.warn(`The receiver's public key is not valid for sending encrypted messages`);
          resolve({ status: false });
        } else {
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

function generateContact(selected) {
  const wallet = walletState.currentLoggedInWallet
  let contact = [];
  wallet.accounts.forEach((element) => {
    if (selected.indexOf(element.address) < 0) {
      contact.push({
        value: element.address,
        label: element.name + ' - Owner account',
      });
    }
  });
  if (wallet.contacts != undefined) {
    wallet.contacts.forEach((element) => {
      if (selected.indexOf(element.address) < 0) {
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
    try {
      WalletUtils.getAccInfo(address).then(accountInfo => {
        resolve(accountInfo.publicKey)
      }).catch(error => {
        console.log(error)
        reject(false)
      })
    } catch(error){
      reject(false);
      console.log(error)
    }
  })
}

/* coSign: array() */
function convertAccount(coSign, numApproveTransaction, numDeleteUser, accountToConvertName, walletPassword) {
  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPassword)
  if (!verify) {
    return verify;
  }
  const generationHash =  networkState.currentNetworkProfile.generationHash
  
    const multisigCosignatory = [];
    // console.log('Account to convert name: ' + accountToConvertName);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.name ===accountToConvertName)
   /*  appStore.getAccDetails(accountToConvertName); */
    const networkType = networkState.currentNetworkProfile.network.type
    let privateKey = WalletUtils.decryptPrivateKey(walletPassword, accountDetails.encrypted, accountDetails.iv);
    const accountToConvert = Account.createFromPrivateKey(privateKey, networkType);

    const cosignatory = [];
    coSign.forEach(async (cosignKey, index) => {
      if (cosignKey.length == 64) {
        cosignatory[index] = PublicAccount.createFromPublicKey(cosignKey, networkType);
      } else if (cosignKey.length == 40 || cosignKey.length == 46) {
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

    const transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint));
    (async () => {
      try {
        const confirmedTx = await announceLockfundAndWaitForConfirmation(accountToConvert.address, lockFundsTransactionSigned, lockFundsTransactionSigned.hash, transactionHttp);
        console.log('confirmedTx');
        console.log(confirmedTx);
        // eslint-disable-next-line no-unused-vars
        let aggregateTx = await announceAggregateBonded(accountToConvert.address, signedAggregateBoundedTransaction, signedAggregateBoundedTransaction.hash, confirmedTx, transactionHttp)
        console.log('aggregateTx');
        console.log(aggregateTx);
        console.log("Done");
      } catch (error) {
        console.log(error);
      }
    })();
  
}

function getAggregateBondedTransactions(publicAccount) {
  return WalletUtils.getAggregateBondedTransactions(publicAccount)
}

function onPartial(publicAccount) {
  return new Promise((resolve) => {
    getAggregateBondedTransactions(publicAccount).then((txOnpartial) => {
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
  return WalletUtils.getMultisigAccInfo(address);
}

function getMultisigAccountGraphInfo(address) {
  return WalletUtils.getMultisigAccGraphInfo(address);
}

/* function updateAccountMultisigGraphInfo(accountAddress) {
  return new Promise((resolve) => {
    const address = Address.createFromRawAddress(accountAddress);
    getMultisigAccountGraphInfo(address).then(info => {
      const wallet = walletState.currentLoggedInWallet;
      const account = wallet.accounts.find((element) => element.address == accountAddress);
      const multigraph = [];
      // console.log('info.multisigAccounts');
      // console.log(accountAddress + ' ' + account.name);
      // console.log(info.multisigAccounts);
      info.multisigAccounts.forEach((multi) => {
        // console.log(multi);
        multi.forEach((m) => {
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
          walletKey,
          JSON.stringify(walletState)
        );
      } catch (err) {
        console.error("checkIsMultiSig error caught", err);
      }
    }, error => {
      console.log(error);
    });
  });
} */

function checkIsMultiSig(accountAddress) {
  return new Promise((resolve) => {
    const address = Address.createFromRawAddress(accountAddress);
    multisigAccountInfo(address).then(info => {
      const wallet = walletState.currentLoggedInWallet
      const account = wallet.accounts.find((element) => element.address == accountAddress);
      
      let verify = false;
      
      if (account != undefined) {
        verify = account.getDirectParentMultisig().length ? true : false;
      }
      resolve(verify);
      try {
        sessionStorage.setItem(
          'currentWalletSession',
          JSON.stringify(wallet)
        );
        localStorage.setItem(
          walletKey,
          JSON.stringify(walletState)
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

/* function updateAccountsMultiSign() {
  const wallet = walletState.currentLoggedInWallet
  wallet.accounts.forEach(async (element) => {
    try {
      await checkIsMultiSig(element.address);
      await updateAccountMultisigGraphInfo(element.address);
    } catch (err) {
      console.log(err);
      console.error("updateAccountsMultiSign error caught", err);
    }
  });
  return 'invalid_wallet';
} */

/* function createMultiSigAccount(walletName) {
  const wallet = appStore.getWalletByName(walletName);
  wallet.accounts.forEach((element) => {
    if (element.isMultisign) {
      if (element.isMultisign.cosignatories.length == 0) {
        console.log(element.address)
        element.isMultisign.multisigAccounts.forEach((multisig) => {
          let multisigStatus = wallet.accounts.find((element) => element.address === multisig.address.address);
          if (!multisigStatus) {
            console.log(multisig)
            appStore.updateCreatedMultiSigToWallet(multisig.publicKey, multisig.address.address);
          }
        });
        updateAccountsMultiSign(walletName);
        // get latest xpx amount
        appStore.getXPXBalance(walletName, siriusStore).then(() => {
          appStore.updateWalletConfig(wallet);
        });
      }
    }
  });
} */

const removeUnrelatedMultiSig = () => {
  const wallet = walletState.currentLoggedInWallet
  let multiSigAccounts = wallet.accounts.filter((element) => element.encrypted === undefined);
  let removeMultiSig = [];
  multiSigAccounts.forEach((element) => {
    let validMultiSig = false;
    
    if (element.getDirectParentMultisig().length) {
          validMultiSig = true;
    }
    if (!validMultiSig) {
      removeMultiSig.push(element.address);
    }
  });
  // remove multisig account
  if(multiSigAccounts.length > 0){
    const wallet = walletState.currentLoggedInWallet
    multiSigAccounts.forEach((multisig) => {
      const accountIndex = wallet.accounts.findIndex((element) => element.address === multisig.address );
      // console.log('Remove index: ' + accountIndex + ' ' + multisig.address);
      wallet.accounts.splice(accountIndex, 1);
    });
    
    sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
    localStorage.setItem(
      walletKey,
      JSON.stringify(walletState)
    );
  }
};

const cosignMiltisigTransaction = (signedAggregateBoundedTransaction, walletPassword) => {
  // console.log('signedAggregateBoundedTransaction')
  // console.log(signedAggregateBoundedTransaction)
  let coSignAddress = signedAggregateBoundedTransaction.account;
  // console.log('co: ' + coSignAddress)
  const accountDetails =  walletState.currentLoggedInWallet.accounts.find(element => element.address === coSignAddress)
  const networkType = networkState.currentNetworkProfile.network.type
  let privateKey = WalletUtils.decryptPrivateKey(walletPassword, accountDetails.encrypted, accountDetails.iv);
  const account = Account.createFromPrivateKey(privateKey, networkType);

  const cosignAggregateBondedTransaction = (signedAggregateBoundedTransaction, account) => {
    const cosignatureTransaction = CosignatureTransaction.create(signedAggregateBoundedTransaction);
    let signStatus = account.signCosignatureTransaction(cosignatureTransaction);
    return signStatus;
  };
  getAggregateBondedTransactions(account.publicAccount).then((transactions) => {
    console.log(transactions);
    for (const aggregateTx of transactions) {
      // view transaction details...
      let cosigned = aggregateTx.signedByAccount(account.publicAccount);
      if (!cosigned && aggregateTx.transactionInfo.hash === signedAggregateBoundedTransaction.transactionInfo.hash) {
        let cosignatureSignedTransaction = cosignAggregateBondedTransaction(aggregateTx, account);
        let transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint))
        transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction);
      }
    }
  });
};

/* const createNewMultiSigAccount = (publicKey, address) => {
  // const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
  // check if multiSig is already in wallet
  // console.log('publicAccount');
  // console.log(publicAccount);
  const wallet = walletState.currentLoggedInWallet
  let multiSig = wallet.accounts.find((element) => element.address === address);
  if (!multiSig) {
    appStore.updateCreatedMultiSigToWallet(publicKey, address);
  }
} */

// modify multisig
function modifyMultisigAccount(coSign, removeCosign, numApproveTransaction, numDeleteUser, cosigners, multisigAccount, walletPassword) {

  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPassword);
  if (! verify) {
    return verify;
  }

  const generationHash = networkState.currentNetworkProfile.generationHash

 
    const multisigCosignatory = [];
    let coSigner = [];
    const networkType = networkState.currentNetworkProfile.network.type;
    if (cosigners.length > 0) {
      cosigners.forEach((signer) => {
        const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.address === signer.address)
        let privateKey = WalletUtils.decryptPrivateKey(walletPassword, accountDetails.encrypted, accountDetails.iv);
        coSigner.push(Account.createFromPrivateKey(privateKey, networkType));
      });
    }

    const cosignatory = [];
    coSign.forEach(async (cosignKey, index) => {
      if (cosignKey.length == 64) {
        cosignatory[index] = PublicAccount.createFromPublicKey(cosignKey, networkType);
      } else if (cosignKey.length == 40 || cosignKey.length == 46) {
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

    removeCosign.forEach((element, index) => {
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

    if (coSigner.length > 0) {
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

      const transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint));
      (async () => {
        try {
          let lockFundListeners = [];
          let aggregateBoundedListeners = [];
          let confirmedTx = [];
          let aggregateTx = [];
          // transactions.forEach(async(transaction, item) =>{
          let item = 0;
          for (const transaction of transactions) {
            //lockFundListeners[item] = siriusStore.chainWSListener;
            confirmedTx[item] = await modifyMultisigAnnounceLockfundAndWaitForConfirmation(lockFundListeners[item], transaction.coSignerAccount.address, transaction.lockFundsTransactionSigned, transaction.lockFundsTransactionSigned.hash, transactionHttp);
            //aggregateBoundedListeners[item] = siriusStore.chainWSListener;
            aggregateTx[item] = await modifyMultisigAnnounceAggregateBonded(aggregateBoundedListeners[item], transaction.coSignerAccount.address, transaction.signedAggregateBoundedTransaction, transaction.signedAggregateBoundedTransaction.hash, confirmedTx[item], transactionHttp);
            ++item;
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
 
}

const fetchMultiSigCosigners = (multiSigAddress) => {

  const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address === multiSigAddress);
  let list = [];
  let numCosigner = account.getDirectParentMultisig().length;   //number of cosigners
  if (numCosigner > 0) {
    const cosignWalletAccount = account.multisigInfo.find((element) => element.level === 0)
    for (let i = 0; i < numCosigner; i++) {
      list.push({ address: cosignWalletAccount.getCosignaturiesAddress[i], name: walletState.currentLoggedInWallet.convertAddressToName(cosignWalletAccount.getCosignaturiesAddress[i]) });
    }
    const multisigAccount = walletState.currentLoggedInWallet.others.find((element) => element.address === multiSigAddress) //others
    const cosignOtherAccount = multisigAccount.multisigInfo.find((element) => element.level === 0)
    for (let i = 0; i < numCosigner; i++) {
      list.push({ address: cosignOtherAccount.getCosignaturiesAddress[i], name: walletState.currentLoggedInWallet.convertAddressToName(cosignOtherAccount.getCosignaturiesAddress[i]) });
    }
  }
  return { list: list, length: numCosigner };
}



function fetchWalletCosigner(address) {
  let cosign = multiSign.fetchMultiSigCosigners(address);
  let list = [];
  cosign.list.forEach((element) => {
    const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address);
    list.push({ balance: account.balance, address: element.address, name: element.name });
  });
  list.sort((a, b) => (a.balance < b.balance) ? 1 : -1);
  return { list: list, numCosigner: cosign.length };
}

export const multiSign = readonly({
  // config,
  getPublicKey,
  generateContact,
  verifyContactPublicKey,
  convertAccount,
  onPartial,
  checkIsMultiSig,
  /* updateAccountsMultiSign, */
  cosignMiltisigTransaction,
  /* createNewMultiSigAccount, */
  /* updateAccountMultisigGraphInfo, */
  getMultisigAccountGraphInfo,
  modifyMultisigAccount,
  fetchMultiSigCosigners,
  fetchWalletCosigner,
  removeUnrelatedMultiSig,
 /*  createMultiSigAccount, */
});
