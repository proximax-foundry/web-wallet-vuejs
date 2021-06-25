import { readonly } from "vue";
import {
  Account,
  Address,
  Deadline,
  EncryptedMessage,
  // NetworkCurrencyMosaic,
  Mosaic,
  MosaicId,
  UInt64,
  MosaicProperties,
  MosaicSupplyType,
  FeeCalculationStrategy,
  // MosaicService,
  MosaicNonce,
  PlainMessage,
  TransferTransaction,
  TransactionHttp,
  TransactionBuilderFactory,
  PublicAccount,
  NetworkType,
  calculateFee
} from "tsjs-xpx-chain-sdk";

import { announceAggregateBonded, announceLockfundAndWaitForConfirmation } from '../util/listener.js';
// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';
import { environment } from '../environment/environment.js';
import { appStore } from "@/store/app";
import { siriusStore } from "@/store/sirius";
import { networkState } from "@/state/networkState";
import { NetworkStateUtils } from "@/state/utils/networkStateUtils";
import { walletState } from "@/state/walletState";
import { ChainUtils } from '@/util/chainUtils';
import { WalletUtils } from '@/util/walletUtils'
const config = require("@/../config/config.json");


async function getAccInfo(address) {
  // return await getPublicKey(recipientAddress, siriusStore.accountHttp);



  let accountInfo = await WalletUtils.getAccountInfo(address);
  return accountInfo;
}

function amountFormatterSimple(amount, d = 6) {
  const amountDivisibility = Number(amount) / Math.pow(10, d);
  return amountDivisibility.toLocaleString('en-us', {
    minimumFractionDigits: d
  });
}


// export const getMosaicsAllAccounts = (appStore, siriusStore) => {
//   const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
//   wallet.accounts.forEach((account) => {
//     const mosaicService = new MosaicService(siriusStore.accountHttp, siriusStore.mosaicHttp, siriusStore.namespaceHttp);
//     const address = Address.createFromRawAddress(account.address);
//     mosaicService
//       .mosaicsAmountViewFromAddress(address)
//       .pipe(
//           mergeMap((_) => _)
//       )
//       .subscribe(mosaic => {
//         console.warn(mosaic)
//         // account.mosaic.push({ id: mosaic.fullName(), amount: mosaic.relativeAmount(), divisibility: mosaic.mosaicInfo.divisibility });
//       },
//         err => console.error(err));
//   });
// };

export const createTransaction = async (recipient, sendXPX, messageText, mosaicsSent, mosaicDivisibility, walletPassword, senderAccName, cosigner = '', encryptedMsg) => {
  // verify password
  // console.log('Pw after createTransaction: ' + walletPassword);
  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword)
  /*let verify = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword); 
 */
  if (!verify) {
    return verify;
  }

  const hash = networkState.currentNetworkProfile.generationHash
  /* const add = fetch(siriusStore._buildAPIEndpointURL(siriusStore.state.selectedChainNode) + '/block/1').then((res) => res.json()).then((data) => { return data.meta.generationHash }); */


  let networkType = networkState.currentNetworkProfile.network.type
  const recipientAddress = Address.createFromRawAddress(recipient);

  let xpxAmount = parseFloat(sendXPX) * Math.pow(10, 6);

  let mosaics = [];
  if (xpxAmount > 0) {
    mosaics.push(new Mosaic(new MosaicId(environment.mosaicXpxInfo.id), UInt64.fromUint(Number(xpxAmount))));
  }
  if (mosaicsSent.length > 0) {
    mosaicsSent.forEach((mosaicSentInfo, index) => {
      if (mosaicSentInfo.amount > 0) {
        mosaics.push(
          new Mosaic(
            new MosaicId(mosaicSentInfo.id),
            UInt64.fromUint(Number(mosaicSentInfo.amount * Math.pow(10, mosaicDivisibility[index])))
          )
        );
      }
    });
  }

  let transactionBuilder = new TransactionBuilderFactory();
  // calculate fee strategy

  if (ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE || ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE_TEST) {
    transactionBuilder.feeCalculationStrategy = FeeCalculationStrategy.ZeroFeeCalculationStrategy;
    //FeeCalculationStrategy.ZeroFeeCalculationStrategy
  }
  else {
    transactionBuilder.feeCalculationStrategy = FeeCalculationStrategy.MiddleFeeCalculationStrategy;
  }

  // to get sender's private key
  let accountDetails, multisigAccountDetails, multisigPublicAccount;
  if (!cosigner) { // no cosigner, get private key from sender acc name
    accountDetails = walletState.currentLoggedInWallet.accounts.find((element) => element.name == senderAccName);
  } else {
    // a multisig, get cosigner's private key
    accountDetails = walletState.currentLoggedInWallet.accounts.find((element) => element.address == cosigner);
    // get multisig account info
    multisigAccountDetails = walletState.currentLoggedInWallet.accounts.find((element) => element.name == senderAccName).publicKey;
    multisigPublicAccount = PublicAccount.createFromPublicKey(multisigAccountDetails, networkType);
  }

  /* console.log('Getting acc details from: ' + accountDetails.address); */
  let privateKey = WalletUtils.decryptPrivateKey(walletPassword, accountDetails.encrypted, accountDetails.iv)


  // sending encrypted message

  let msg;
  if (encryptedMsg) {
    let accountInfo = await getAccInfo(recipientAddress)
    msg = EncryptedMessage.create(messageText, accountInfo, privateKey);
  } else {
    msg = PlainMessage.create(messageText);
  }

  let transferTransaction = transactionBuilder.transfer()
    .deadline(Deadline.create(environment.deadlineTransfer.deadline, environment.deadlineTransfer.chronoUnit))
    .mosaics(mosaics)
    .message(msg)
    .networkType(networkType)
    .recipient(recipientAddress)
    .build();

  const account = Account.createFromPrivateKey(privateKey, networkType);
  const transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint));

  if (!cosigner) { // no cosigner, normal transaction
    const signedTransaction = account.sign(transferTransaction, hash);
    transactionHttp
      .announce(signedTransaction)
      .subscribe(() => {
        return true;
      }, err => console.error(err));
  } else { // there is a cosigner, aggregate transaction
    console.log('multisigPublicAccount');
    console.log(multisigPublicAccount);
    const innerTxn = [transferTransaction.toAggregate(multisigPublicAccount)];

    const aggregateBondedTransaction = transactionBuilder.aggregateBonded()
      .deadline(Deadline.create(environment.deadlineTransfer.deadline, environment.deadlineTransfer.chronoUnit))
      .innerTransactions(innerTxn)
      .networkType(networkType)
      .build();
    console.log('aggregateBondedTransaction');
    console.log(aggregateBondedTransaction);
    // if (otherCosigners.length > 0) {
    //   return cosignatoryAccount.signTransactionWithCosignatories(bondedCreated, otherCosigners, generationHash);
    // }
    const aggregateBondedTransactionSigned = account.sign(aggregateBondedTransaction, hash);
    console.log('aggregateBondedTransactionSigned');
    console.log(aggregateBondedTransactionSigned);
    const hashLockTransaction = transactionBuilder.hashLock()
      .deadline(Deadline.create())
      .duration(UInt64.fromUint(environment.lockFundDuration))
      .mosaic(new Mosaic(new MosaicId(environment.mosaicXpxInfo.id), UInt64.fromUint(Number(10000000))))
      .signedTransaction(aggregateBondedTransactionSigned)
      .networkType(networkType)
      .build();
    const hashLockTransactionSigned = account.sign(hashLockTransaction, hash);

    (async () => {
      try {
        const confirmedTx = await announceLockfundAndWaitForConfirmation(account.address, hashLockTransactionSigned, hashLockTransactionSigned.hash, transactionHttp);
        console.log('confirmedTx');
        console.log(confirmedTx);
        // eslint-disable-next-line no-unused-vars
        let aggregateTx = await announceAggregateBonded(account.address, aggregateBondedTransactionSigned, aggregateBondedTransactionSigned.hash, confirmedTx, transactionHttp)
        console.log('aggregateTx');
        console.log(aggregateTx);
        console.log("Done");
      } catch (error) {
        console.log(error);
      }
    })();
  }

}

export const mosaicTransaction = (divisibility, supply, duration, durationType, mutable, transferable, walletPassword, accountName, appStore, siriusStore) => {

  // verify password
  let verify = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword);
  if (verify < 1) {
    return verify;
  }
  const add = fetch(siriusStore._buildAPIEndpointURL(siriusStore.state.selectedChainNode) + '/block/1').then((res) => res.json()).then((data) => { return data.meta.generationHash });

  return add.then((hash) => {

    let accountDetails = appStore.getAccDetails(accountName);
    // var mosaicDuration = (1 * 365 * 24 * 60 * 4 ); // 1 year - 15 sec per block
    // var mosaicDuration;
    // if(durationType == 'month'){
    //   mosaicDuration = parseInt(duration) * 30 * 24 * 60 * 4;
    // }else{
    //   mosaicDuration = parseInt(duration) * 365 * 24 * 60 * 4;
    // }

    let privateKey = appStore.decryptPrivateKey(walletPassword, accountDetails.encrypted, accountDetails.iv);
    let networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
    const account = Account.createFromPrivateKey(privateKey, networkType);

    let transactionBuilder = new TransactionBuilderFactory();
    const nonce = MosaicNonce.createRandom();
    let mosaicDefinitionTransaction = transactionBuilder.mosaicDefinition()
      .deadline(Deadline.create(environment.deadlineTransfer.deadline, environment.deadlineTransfer.chronoUnit))
      .mosaicNonce(nonce)
      .mosaicId(MosaicId.createFromNonce(nonce, account))
      .mosaicProperties(
        MosaicProperties.create({
          supplyMutable: (mutable) ? true : false,
          transferable: (transferable) ? true : false,
          divisibility: divisibility,
          // duration: (duration) ? UInt64.fromUint(mosaicDuration) : undefined
          duration: undefined
        })
      )
      .networkType(networkType)
      .build();

    let supp = parseFloat(supply) * Math.pow(10, divisibility);
    const mosaicSupplyChangeTransaction = transactionBuilder.mosaicSupplyChange()
      .deadline(Deadline.create(environment.deadlineTransfer.deadline, environment.deadlineTransfer.chronoUnit))
      .mosaicId(mosaicDefinitionTransaction.mosaicId)
      .direction(MosaicSupplyType.Increase)
      .delta(UInt64.fromUint(supp))
      .networkType(networkType)
      .build();

    let innerTxn = [
      mosaicDefinitionTransaction.toAggregate(account.publicAccount),
      mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)
    ]

    const aggregateTransaction = transactionBuilder.aggregateComplete()
      .deadline(Deadline.create(environment.deadlineTransfer.deadline, environment.deadlineTransfer.chronoUnit))
      .innerTransactions(innerTxn)
      .networkType(networkType)
      .build();

    transactionBuilder.fee = amountFormatterSimple(aggregateTransaction.maxFee.compact());
    // console.log('TF: '+transactionBuilder.fee);
    const signedTransaction = account.sign(aggregateTransaction, hash);
    const transactionHttp = new TransactionHttp(siriusStore._buildAPIEndpointURL(siriusStore.state.selectedChainNode));

    transactionHttp
      .announce(signedTransaction)
      .subscribe((x) => {
        console.log(x);
        // console.log('annoucement is made here');
        return true;
      }, err => console.error(err));
  });
}

/**
 *
 *
 * @param message
 * @memberof ViewTransferComponent
 */

const calculate_fee = (message, amount, mosaic) => {
  let mosaicsToSend = validateMosaicsToSend(amount, mosaic);
  const x = TransferTransaction.calculateSize(PlainMessage.create(message).size(), mosaicsToSend.length);
  const b = calculateFee(x, getFeeStrategy());
  let fee;
  if (message > 0) {
    fee = amountFormatterSimple(b.compact());
  } else if (message === 0 && mosaicsToSend.length === 0) {
    if (getFeeStrategy() === FeeCalculationStrategy.ZeroFeeCalculationStrategy)
      fee = '0.000000';
    else {
      fee = TransferTransaction.calculateSize(message, mosaicsToSend.length) * getFeeStrategy() / 1000000;
      fee = fee.toString()
      //fee = '0.037250';
    }
  } else {
    fee = amountFormatterSimple(b.compact());
  }
  return fee;
}

/**
 *
 *
 * @returns
 * @memberof CreateTransferComponent
 */
const validateMosaicsToSend = (amountXpx, boxOtherMosaics) => {
  const mosaics = [];

  if (amountXpx !== '' && amountXpx !== null && Number(amountXpx) !== 0) {
    // console.log(amountXpx);
    const arrAmount = amountXpx.toString().replace(/,/g, '').split('.');
    let decimal;
    let realAmount;

    if (arrAmount.length < 2) {
      decimal = addZeros(environment.mosaicXpxInfo.divisibility);
    } else {
      const arrDecimals = arrAmount[1].split('');
      decimal = addZeros(environment.mosaicXpxInfo.divisibility - arrDecimals.length, arrAmount[1]);
    }
    realAmount = `${arrAmount[0]}${decimal}`;
    mosaics.push({
      id: environment.mosaicXpxInfo.id,
      amount: realAmount
    });
  }

  boxOtherMosaics.forEach(element => {
    if (element.id !== '' && element.amount !== '' && Number(element.amount) !== 0) {
      const arrAmount = element.amount.toString().replace(/,/g, '').split('.');
      let realAmount;
      realAmount = arrAmount[0];
      mosaics.push({
        id: element.id,
        amount: realAmount
      });
    }
  });
  return mosaics;
}

/**
   *
   *
   * @param {*} cant
   * @param {string} [amount='0']
   * @returns
   * @memberof CreateTransferComponent
   */
const addZeros = (cant, amount = '0') => {
  const x = '0';
  if (amount === '0') {
    for (let index = 0; index < cant - 1; index++) {
      amount += x;
    }
  } else {
    for (let index = 0; index < cant; index++) {
      amount += x;
    }
  }
  return amount;
}

const getFeeStrategy = () => {

  let transactionBuilder = new TransactionBuilderFactory();

  if (ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE || ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE_TEST) {
    transactionBuilder.feeCalculationStrategy = FeeCalculationStrategy.ZeroFeeCalculationStrategy;
  }
  else {
    transactionBuilder.feeCalculationStrategy = FeeCalculationStrategy.MiddleFeeCalculationStrategy;
  }
  return transactionBuilder.feeCalculationStrategy;
}

export const makeTransaction = readonly({
  calculate_fee
})

export const getFakeEncryptedMessageSize =(message)=>{
  return EncryptedMessage.create(message,  PublicAccount.createFromPublicKey("0".repeat(64)), "0".repeat(64)).size();
}

export const getPlainMessageSize =(message)=>{
  return PlainMessage.create(message).size( ); 
}

export const convertToCurrency =(value, divisibility)=>{
   
  const exactValue = value/Math.pow(10, divisibility);
  
  return new Intl.NumberFormat('en', {maximumFractionDigits: divisibility}).format(exactValue);
}  

export const convertToExact =(value, divisibility)=>{
   
  return value/Math.pow(10, divisibility);
}