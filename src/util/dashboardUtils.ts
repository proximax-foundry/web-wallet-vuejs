import { readonly } from "vue";
import {
  Deadline,
  PublicAccount,
  TransactionType,
  Transaction,
} from "tsjs-xpx-chain-sdk";
import { appStore } from "@/store/app";
// import { proximaxProvider } from '../util/proximaxProvider.js';
import { namespaces } from '../util/namespaces.js';
import { environment } from '../environment/environment.js';
import { transactionTypeName } from '@/util/transactionUtils';
import { walletState } from '@/state/walletState';
import { ConfirmedTransaction, UnconfirmedTransaction, AggregateBondedTransaction } from '@/models/interface/transaction';
import { contactInterface } from '@/models/interface/contact';

// let provider =  proximaxProvider;

const getNameTypeTransaction = (type) => {
  return Object.keys(transactionTypeName).find(
    elm => transactionTypeName[elm].id === type
  );
}


const formatTransaction = (transaction:ConfirmedTransaction, names:contactInterface[]) :ConfirmedTransaction => {
  let keyName = getNameTypeTransaction(transaction.type);
  transaction.typeName = transactionTypeName[keyName].name;
  transaction.transferType = formatTransfer(transaction);
  let senderName = names.find((element) =>  element.address == getSender(transaction));
  transaction.senderName = (senderName)?senderName.name:'';
  transaction.senderAddress = getSender(transaction);
  let recipientAddress = getRecipient(transaction, keyName);
  let recipientName = names.find((element) =>  element.address == recipientAddress);
  transaction.recipientName = (recipientName)?recipientName.name:'';
  if(recipientAddress.length >= 40){
    transaction.recipientAddress = recipientAddress;
  }
  transaction.block = transaction.transactionInfo.height.compact();
  transaction.data = transaction;
  transaction.hash = transaction.transactionInfo.hash;
  return transaction;
};


// const formatAggregateBondedTransaction = (transaction:AggregateBondedTransaction, names:contactInterface[]) :AggregateBondedTransaction => {
//   console.log(transaction);
//   const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);

//   // 1st matching - check if signer is in the wallet
//   let signerInWallet = wallet.accounts.find((element) => element.address == transaction.signer.address['address']);

//   if(signerInWallet){ // signer is in the wallet
//     // display own as signer
//     console.log('1st level')
//     let linkedAccountName = names.find((element) =>  element.address == signerInWallet.address);
//     transaction.linkedAccountName = (linkedAccountName)?linkedAccountName.name:'';
//     transaction.linkedAccount = appStore.pretty(signerInWallet.address);
//     transaction.account = transaction.linkedAccount;
//   }else{
//     // display first cosig
//     // bug fixed for innerTransactions
//     // 2nd matching - match innertransaction.modification.address to wallet's accounts or contact list
//     // search for own account among cosig
//     console.log('2nd level')
//     let matchAccount;
//     transaction.innerTransactions.forEach((inner) => {
//       if(inner.modifications != undefined){
//         inner.modifications.forEach((modification) => {
//           let matchStatus;
//           matchStatus = wallet.accounts.find((element) => element.address == modification.cosignatoryPublicAccount.address.address);
//           if(matchStatus){
//             matchAccount = matchStatus;
//           }
//         });
//       }
//     });
//     if(matchAccount){
//       transaction.account = matchAccount.address;
//       let linkedAccountName = names.find((element) =>  element.address == matchAccount.address);
//       transaction.linkedAccountName = (linkedAccountName)?linkedAccountName.name:'';
//       transaction.linkedAccount = appStore.pretty(matchAccount.address);
//     }else{
//       // 3rd matching - match among cosignatures in transaction
//       console.log('3rd level')
//       let isMatchAccount:boolean = false;
//       if(transaction.cosignatures.length > 0){
//         transaction.cosignatures.forEach((cosigner) => {
//           matchAccount = wallet.accounts.find((element) => element.address == cosigner.signer.address.address);
//           if(matchAccount){
//             transaction.account = matchAccount.address;
//             let linkedAccountName = names.find((element) =>  element.address == matchAccount.address);
//             transaction.linkedAccountName = (linkedAccountName)?linkedAccountName.name:'';
//             isMatchAccount = true;
//           }
//         });
//       }
//       if(!isMatchAccount){
//         console.log('4th level')
//         // 4th matching - search in multisign property in state
//         let cosigner = getAccountsInfoTiedMultiSig(transaction.innerTransactions[0].signer.publicKey);
//         // if there is more than 1 signer, temporarily assign the first one to be displayed in partial datatable
//         if(cosigner.length > 0){
//           // if(cosigner.length > 1){
//             transaction.account = cosigner[0].address;
//             let linkedAccountName = names.find((element) =>  element.address == cosigner[0].address);
//             transaction.linkedAccountName = (linkedAccountName)?linkedAccountName.name:'';
//           // }
//         }else{
//           transaction.account = '';
//         }
//       }
//     }
//   }

//   transaction.formattedDeadline = `${dateFormat(transaction.deadline)}`;
//   transaction.totalSigned = 0;
//   transaction.isSigned = false;
//   wallet.accounts.forEach(element => {
//     // const publicAccount = provider.createPublicAccount(element.publicAccount.publicKey);
//     let networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
//     const publicAccount = PublicAccount.createFromPublicKey(element.publicAccount.publicKey, networkType);
//     const x = transaction.signedByAccount(publicAccount);
//     if (x) {
//       transaction.totalSigned += 1;
//       transaction.isSigned = true;
//     }
//   });
//   transaction.hash = transaction.transactionInfo.hash;
//   return transaction;
// }

const getAccountsInfoTiedMultiSig = (signerPublicKey) => {
  let cosigner = [];
  const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
  wallet.accounts.forEach(account => {
    if(account.isMultisign != undefined){
      if(account.isMultisign.multisigAccounts != undefined){
        if(account.isMultisign.multisigAccounts.length > 0){
          account.isMultisign.multisigAccounts.forEach(multisig => {
            console.log(multisig.publicKey + ' ' + signerPublicKey)
            if(multisig.publicKey == signerPublicKey){
              cosigner.push({address: account.publicAccount.address.address});
            }
          });
        }
      }
    }
  });
  return cosigner;
};

const formatTransfer = (transaction) => {
  const sender = transaction.signer.address.address;
  if(walletState.currentLoggedInWallet?.accounts.find((element) => element.address == sender)){
    return 'out';
  }else{
    return 'in';
  }
};

const getSender = (transaction) => {
  return transaction.signer.address.address;
};

const getRecipient = (transaction, keyName) => {
  let address;
  switch(keyName){
    case 'transfer':{
      address = transaction.recipient.address;
      break;
    }
    case 'aggregateBonded':{
      if(transaction.innerTransactions[0].recipient != undefined){
        address = transaction.innerTransactions[0].recipient.address;
      }else{
        address = '-';
      }
      break;
    }
    default:
      address = '-';
  }
  return address;
};


const dateFormat = (deadline) => {
  return new Date(
    deadline.value.toString() + Deadline.timestampNemesisBlock * 1000
  ).toLocaleString();
}

const dateFormatUTC = (date) => {
  return new Date(date.compact() + 1459468800 * 1000).toLocaleString();
}

const amountFormatterSimple = (amount, d = 6) => {
  const amountDivisibility = Number(amount) / Math.pow(10, d);
  return amountDivisibility.toLocaleString('en-us', {
    minimumFractionDigits: d
  });
}

const getDataPart = (data, cantPart) => {
  return {
    part1: data.slice(0, data.length - cantPart),
    part2: data.slice(-cantPart)
  };
}

const getAmount = async (id, transaction) => {
  let d = 6;
  const n = await namespaces.getNamespaceFromId([id]);
  // eslint-disable-next-line no-unused-vars
  let namespaceName = id.toHex();
  if ((n.length > 0)) {
    namespaceName = (n[0].namespaceName.name === 'prx.xpx') ? 'XPX' : n[0].namespaceName.name;
    const x = environment.swapAllowedMosaics.find(r => `${r.namespaceId}.${r.name}` === n[0].namespaceName.name);
    if (x) { d = x.divisibility; }
  }
  const amount = amountFormatterSimple(transaction.mosaics[0].amount.compact(), d);
  return getDataPart(amount.toString(), d);
}

const getLockFundAmount = async (id, transaction) => {
  let d = 6;
  const n = await namespaces.getNamespaceFromId([id]);
  // console.log('n: ' + n)
  // eslint-disable-next-line no-unused-vars
  let namespaceName = id.toHex();
  // console.log('namespaceName')
  // console.log(namespaceName)
  if ((n.length > 0)) {
    namespaceName = (n[0].namespaceName.name === 'prx.xpx') ? 'XPX' : n[0].namespaceName.name;
    const x = environment.swapAllowedMosaics.find(r => `${r.namespaceId}.${r.name}` === n[0].namespaceName.name);
    if (x) { d = x.divisibility; }
  }
  const amount = amountFormatterSimple(transaction.mosaic.amount.compact(), d);
  return getDataPart(amount.toString(), d);
}

const amountFormatter = (amountParam, manualDivisibility = 0) => {
  // console.log('amountParam', amountParam);
  // const divisibility = (manualDivisibility === 0) ? manualDivisibility : mosaic.properties.divisibility;
  // console.log('divisibility', divisibility);
  const amountDivisibility = Number(amountParam / Math.pow(10, manualDivisibility));
  // console.log('amountDivisibility', amountDivisibility);
  const amountFormatter = amountDivisibility.toLocaleString('en-us', { minimumFractionDigits: manualDivisibility });
  // console.log('amountFormatter', amountFormatter);
  return amountFormatter;
}

export const dashboardUtils = readonly({
  formatTransaction,
  dateFormatUTC,
  amountFormatterSimple,
  getNameTypeTransaction,
  getDataPart,
  getAmount,
  getLockFundAmount,
  // formatAggregateBondedTransaction,
  amountFormatter,
  getAccountsInfoTiedMultiSig,
});