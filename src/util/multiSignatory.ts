import { readonly } from "vue";
import {
  Account,
  Address,
  AggregateTransaction,
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
  AccountInfo, 
  Password,
  MultisigAccountGraphInfo,

} from "tsjs-xpx-chain-sdk";
//line 483,485
// import { environment } from '../environment/environment.js';
import { NetworkStateUtils } from "@/state/utils/networkStateUtils";
import { WalletUtils } from "@/util/walletUtils";
import { walletState } from '@/state/walletState'
import { networkState } from "@/state/networkState"; // chainNetwork
import { announceAggregateBonded, announceLockfundAndWaitForConfirmation, modifyMultisigAnnounceLockfundAndWaitForConfirmation, modifyMultisigAnnounceAggregateBonded } from '../util/listener.js';
import { TransactionUtils } from "@/util/transactionUtils";
import { WalletAccount } from "@/models/walletAccount.js";
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";
import { listenerState, AutoAnnounceSignedTransaction, HashAnnounceBlock, AnnounceType } from "@/state/listenerState";

const walletKey = "sw";


function verifyContactPublicKey(address :string) :Promise<{status: boolean, publicKey: string}>{
  const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
  return new Promise((resolve) => {
    const accountInfo = WalletUtils.getAccInfo(address);
    accountInfo.then(
      (account) => {
        if (account.publicKey == invalidPublicKey) {
          console.warn(`The receiver's public key is not valid for sending encrypted messages`);
          resolve({ status: false, publicKey: account.publicKey});
        } else {
          resolve({ status: true, publicKey: account.publicKey });
        }
      },
      (error) => {
        console.warn('Err: ' + error);
      }
    );
  });
}

function generateContact(selected :string) :string[]{
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

const getPublicKey = (address :Address) :Promise<AccountInfo['publicKey']>=> {
  return new Promise((resolve, reject) => {
    try {
      TransactionUtils.getAccInfo(address).then(accountInfo => {
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
function convertAccount(coSign :string[], numApproveTransaction :number, numDeleteUser :number, accountToConvertName :string, walletPassword :string)  :boolean{
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
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
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

   /*  const transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint)); */
    (async () => {
      try {
        let hashLockAutoAnnounceSignedTx = new AutoAnnounceSignedTransaction(lockFundsTransactionSigned);
        hashLockAutoAnnounceSignedTx.announceAtBlock = listenerState.currentBlock + 1;
        let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(signedAggregateBoundedTransaction);
        autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(lockFundsTransactionSigned.hash);
        autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
        autoAnnounceSignedTx.type = AnnounceType.BONDED;
        ListenerStateUtils.addAutoAnnounceSignedTransaction(hashLockAutoAnnounceSignedTx);
        ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);
      /*   const confirmedTx = await announceLockfundAndWaitForConfirmation(accountToConvert.address, lockFundsTransactionSigned, lockFundsTransactionSigned.hash, transactionHttp);
        console.log('confirmedTx');
        console.log(confirmedTx);
        // eslint-disable-next-line no-unused-vars
        let aggregateTx = await announceAggregateBonded(accountToConvert.address, signedAggregateBoundedTransaction, signedAggregateBoundedTransaction.hash, confirmedTx, transactionHttp)
        console.log('aggregateTx');
        console.log(aggregateTx);
        console.log("Done"); */
        
      } catch (error) {
        console.log(error);
      }
    })();
  return verify
}

function getAggregateBondedTransactions(publicAccount :PublicAccount) :Promise<AggregateTransaction[]>{
  return WalletUtils.getAggregateBondedTransactions(publicAccount)
}

async function onPartial(publicAccount :PublicAccount) :Promise<boolean>{
  
  let isPartial = new Promise<boolean>((resolve,reject)=>{
  getAggregateBondedTransactions(publicAccount).then((txOnpartial) => {
    if (txOnpartial !== null && txOnpartial.length > 0) {
      for (const tx of txOnpartial) {
        for (let i = 0; i < tx.innerTransactions.length; i++) {
          if (tx.innerTransactions[i].signer.publicKey === publicAccount.publicKey){
            resolve(true)
            break;
          }
        }
      }
    }
  }).catch(error => {
    reject('Err: ' + error)
  })
})

  let result = await isPartial 
  return Boolean(result)
    
}
  



function getMultisigAccountGraphInfo(address :string) :Promise<MultisigAccountGraphInfo>{
  return WalletUtils.getMultisigAccGraphInfo( Address.createFromRawAddress(address ));
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

function checkIsMultiSig(accountAddress :string) :boolean{
    let account = walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress)
    
    
    let verify = false;
      
    verify = account.getDirectParentMultisig().length? true: false
    
    
  /*   try {
      sessionStorage.setItem(
        'currentWalletSession',
        JSON.stringify(walletState.currentLoggedInWallet)
      );
      localStorage.setItem(
        walletKey,
        JSON.stringify(walletState)
      );
    } catch (err) {
      console.error("checkIsMultiSig error caught", err);
    } */
     /*  if (account != undefined) {
        verify = account.getDirectParentMultisig().length ? true : false;
      } */
      return verify;
      
      // eslint-disable-next-line no-unused-vars
  
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

const removeUnrelatedMultiSig = () :void=> {
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
    
    /* sessionStorage.setItem('currentWalletSession', JSON.stringify(wallet));
    localStorage.setItem(
      walletKey,
      JSON.stringify(walletState)
    ); */
  }
};

/* const cosignMultisigTransaction = (signedAggregateBoundedTransaction , walletPassword) => {
  // console.log('signedAggregateBoundedTransaction')
  // console.log(signedAggregateBoundedTransaction)
  let coSignAddress = signedAggregateBoundedTransaction.cosignatures.signer;
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
 */
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
function modifyMultisigAccount(coSign :string[], removeCosign :string[], numApproveTransaction :number, numDeleteUser :number, cosigners :{address :string}[] , multisigAccount :WalletAccount, walletPassword :string) :boolean | Promise<modifyMultisigAnnounceAggregateBonded>{

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
        let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
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

    let relativeNumApproveTransaction = numApproveTransaction - multisigAccount.multisigInfo.find(element => element.level === 0).minApproval;
    let relativeNumDeleteUser = numDeleteUser - multisigAccount.multisigInfo.find(element => element.level === 0).minRemoval

    const convertIntoMultisigTransaction = ModifyMultisigAccountTransaction.create(
      Deadline.create(),
      relativeNumApproveTransaction,
      relativeNumDeleteUser,
      multisigCosignatory,
      networkType
    );

    const aggregateTransaction = AggregateTransaction.createBonded(
      Deadline.create(),
      [convertIntoMultisigTransaction.toAggregate(PublicAccount.createFromPublicKey(multisigAccount.publicKey,networkState.currentNetworkProfile.network.type))],
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

 

//level 1 = cosigner


 const fetchMultiSigCosigners = (multiSigAddress :string) :Array<{list :{address :string, name: string , balance: number}}> =>{
  let account = walletState.currentLoggedInWallet.accounts.find(element => element.address === multiSigAddress)
  let cosigners = account.multisigInfo.filter(element => element.level === 1)
  let list = [];
  cosigners.forEach(cosigner=>{
    let isInWallet = walletState.currentLoggedInWallet.accounts.find(account => account.publicKey === cosigner.publicKey)? true: false
    if(isInWallet){ //if cosigner in current wallet
      let account = walletState.currentLoggedInWallet.accounts.find(account => account.publicKey === cosigner.publicKey)
      list.push({ address: account.address, name: account.name , balance: account.balance})
    }else{ //cosigner not in this wallet
     /*  let convertedAddress = Helper.createPublicAccount(cosigner.publicKey,networkState.currentNetworkProfile.network.type).address.plain()
      
        list.push({ address: convertedAddress, name: convertedAddress.substr(-4) , balance: undefined})
       */
      
    }
  })
  list.sort((a, b) => (a.balance < b.balance) ? 1 : -1);
  console.log(list)
  return list
 
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
  /* cosignMultisigTransaction, */
  /* createNewMultiSigAccount, */
  /* updateAccountMultisigGraphInfo, */
  getMultisigAccountGraphInfo,
  modifyMultisigAccount,
  fetchMultiSigCosigners,
  removeUnrelatedMultiSig,
 /*  createMultiSigAccount, */
});
