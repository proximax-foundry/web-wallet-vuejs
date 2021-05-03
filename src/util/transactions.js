import { readonly } from "vue";
import {
  Deadline,
  PublicAccount,
  TransactionType,
} from "tsjs-xpx-chain-sdk";
import { appStore } from "@/store/app";
// import { proximaxProvider } from '../util/proximaxProvider.js';
import { namespaces } from '../util/namespaces.js';
import { environment } from '../environment/environment.js';


// let provider =  proximaxProvider;

const getNameTypeTransaction = (type) => {
  return Object.keys(arraTypeTransaction).find(
    elm => arraTypeTransaction[elm].id === type
  );
}

const arraTypeTransaction = {
  transfer: {
    id: TransactionType.TRANSFER,
    name: 'Transfer'
  },
  registerNameSpace: {
    id: TransactionType.REGISTER_NAMESPACE,
    name: 'Register Namespace'
  },
  mosaicDefinition: {
    id: TransactionType.MOSAIC_DEFINITION,
    name: 'Mosaic Definition'
  },
  mosaicSupplyChange: {
    id: TransactionType.MOSAIC_SUPPLY_CHANGE,
    name: 'Mosaic Supply Change'
  },
  modifyMultisigAccount: {
    id: TransactionType.MODIFY_MULTISIG_ACCOUNT,
    name: 'Modify Multisig Account'
  },
  aggregateComplete: {
    id: TransactionType.AGGREGATE_COMPLETE,
    name: 'Aggregate Complete'
  },
  aggregateBonded: {
    id: TransactionType.AGGREGATE_BONDED,
    name: 'Aggregate Bonded'
  },
  mosaicAlias: {
    id: TransactionType.MOSAIC_ALIAS,
    name: 'Mosaic Alias'
  },
  addressAlias: {
    id: TransactionType.ADDRESS_ALIAS,
    name: 'Address Alias'
  },
  lock: {
    id: TransactionType.LOCK,
    name: 'LockFund'
  },
  accountLink: {
    id: TransactionType.LINK_ACCOUNT,
    name: 'Account Link'
  }
  /*secretLock: {
    id: TransactionType.SECRET_LOCK,
    name: "Secret lock"
  },*/
  /* secretProof: {
    id: TransactionType.SECRET_PROOF,
    name: "Secret proof"
  }*/
};

const formatTransaction = (transaction, names) => {
  let keyName = getNameTypeTransaction(transaction.type);
  transaction.typeName = arraTypeTransaction[keyName].name;
  transaction.transferType = formatTransfer(transaction);
  let senderName = names.find((element) =>  element.address == getSender(transaction));
  transaction.senderName = (senderName)?senderName.name:'';
  transaction.senderAddress = appStore.pretty(getSender(transaction));
  let recipientAddress = getRecipient(transaction, keyName);
  let recipientName = names.find((element) =>  element.address == recipientAddress);
  transaction.recipientName = (recipientName)?recipientName.name:'';
  if(recipientAddress.length > 10){
    transaction.recipientAddress = appStore.pretty(recipientAddress);
  }
  transaction.recipientAddress = appStore.pretty(recipientAddress);
  transaction.block = transaction.transactionInfo.height.compact();
  transaction.data = transaction;
  transaction.hash = transaction.transactionInfo.hash;
  return transaction;
}

const formatAggregateBondedTransaction = (transaction, names) => {

  const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);

  // check if signer is in the wallet
  let ownAddress = wallet.accounts.find((element) => element.address == transaction.signer.address.address);

  if(ownAddress){ // signer is in the wallet
    // display own as signer
    let linkedAccountName = names.find((element) =>  element.address == ownAddress.address);
    transaction.linkedAccountName = (linkedAccountName)?linkedAccountName.name:'';
    transaction.linkedAccount = appStore.pretty(ownAddress.address);
    transaction.account = transaction.linkedAccount;
  }else{
    let matchAccount;
    // display first cosig
    console.log('display first cosig');
    // bug fixed for innerTransactions
    let linkedAccountName = names.find((element) =>  element.address == transaction.innerTransactions[0].modifications[0].cosignatoryPublicAccount.address.address);
    transaction.linkedAccountName = (linkedAccountName)?linkedAccountName.name:'';
    transaction.linkedAccount = appStore.pretty(transaction.innerTransactions[0].modifications[0].cosignatoryPublicAccount.address.address);
    // search for own account among cosig
    transaction.innerTransactions.forEach((inner) => {
      inner.modifications.forEach((modification) => {
        console.log('cosignatory account: ' + modification.cosignatoryPublicAccount.address.address);
        matchAccount = wallet.accounts.find((element) => element.address == modification.cosignatoryPublicAccount.address.address);
        console.log(matchAccount);
        if(matchAccount){
          return;
        }
      });
      if(matchAccount){
        return;
      }
    });
    if(matchAccount){
      transaction.account = matchAccount.address;
    }else{
      if(transaction.cosignatures.length > 0){
        transaction.cosignatures.forEach((cosigner) => {
          matchAccount = wallet.accounts.find((element) => element.address == cosigner.signer.address.address);
          transaction.account = matchAccount.address;
        });
      }else{
        transaction.account = '-';
      }
    }
  }

  transaction.formattedDeadline = `${dateFormat(transaction.deadline)}`;
  transaction.totalSigned = 0;
  transaction.isSigned = false;
  wallet.accounts.forEach(element => {
    // const publicAccount = provider.createPublicAccount(element.publicAccount.publicKey);
    let networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
    const publicAccount = PublicAccount.createFromPublicKey(element.publicAccount.publicKey, networkType);
    const x = transaction.signedByAccount(publicAccount);
    if (x) {
      transaction.totalSigned += 1;
      transaction.isSigned = true;
    }
  });
  transaction.hash = transaction.transactionInfo.hash;
  return transaction;
}

const formatTransfer = (transaction) => {
  const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
  const sender = transaction.signer.address.address;
  if(wallet.accounts.find((element) => element.address == sender)){
    return 'out';
    // return '/assets/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.4fb6ecda.svg';
  }else{
    return 'in';
    // return '/assets/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.9d5ca495.svg';
  }
}

const getSender = (transaction) => {
  return transaction.signer.address.address;
}

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
}

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


/*
function getTransactionData (transaction){
  let timestamp, effectiveFee;
  if (transaction.transactionInfo && transaction.transactionInfo.height) {
    const height = transaction.transactionInfo.height.compact();
    if (typeof (height) === 'number') {
      const existBlock = dataBridge.filterBlockStorage(height);
      console.log(existBlock)
      if (existBlock) {
        console.log('In cache', existBlock);
        timestamp = `${dateFormatUTC(new UInt64([existBlock.timestamp.lower, existBlock.timestamp.higher]))} - UTC`;
        const calculateEffectiveFee = amountFormatterSimple(existBlock.feeMultiplier * transaction.data.size);
        effectiveFee = getDataPart(calculateEffectiveFee, 6);
        console.log('Effective fee ---> ', transaction.effectiveFee);
      } else {
        dataBridge.getBlockInfo(height).subscribe(
          next => {
            console.log('Http', next);
            dataBridge.validateBlock(next);
            timestamp = `${dateFormatUTC(next.timestamp)} - UTC`;
            const calculateEffectiveFee = amountFormatterSimple(next.feeMultiplier * transaction.data.size);
            effectiveFee = getDataPart(calculateEffectiveFee, 6);
            console.log('Effective fee ---> ', transaction.effectiveFee);
          }
        );
      }
    } else {
      effectiveFee = getDataPart('0.00000', 6);
    }
  } else {
    effectiveFee = getDataPart('0.00000', 6);
  }
  return {
    timestamp, effectiveFee
  };
}*/

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

export const transactions = readonly({
  arraTypeTransaction,
  formatTransaction,
  dateFormatUTC,
  amountFormatterSimple,
  getNameTypeTransaction,
  getDataPart,
  getAmount,
  getLockFundAmount,
  formatAggregateBondedTransaction,
  amountFormatter,
});