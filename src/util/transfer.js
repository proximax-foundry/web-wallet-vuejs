import {
  Account,
  Address,
  Deadline,
  EncryptedMessage,
  TransactionHttp,
  // NetworkCurrencyMosaic,
  PlainMessage,
  TransactionBuilderFactory,
  FeeCalculationStrategy,
  // MosaicHttp,
  Mosaic,
  MosaicId,
  UInt64,
  MosaicProperties,
  MosaicSupplyType,
  // MosaicService,
  MosaicNonce,
  // Listener,
} from "tsjs-xpx-chain-sdk";
// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';
import { environment } from '../environment/environment.js';
// import { subscribeConfirmed } from '../util/listener.js';

const config = require("@/../config/config.json");


async function getAccInfo(address, accountHttp){
  // return await getPublicKey(recipientAddress, siriusStore.accountHttp);
  let promise = new Promise((resolve) => {
    const accountInfo = accountHttp.getAccountInfo(address);
    accountInfo.subscribe(
      (acc) => {
        // console.log(acc);
        resolve(acc);
      },
      (error) => {
        console.warn('Err: ' + error);
      }
    );
  });
  let publicKey = await promise;
  // console.log(publicKey);
  return publicKey;
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

export const makeTransaction = (recipient, sendXPX, messageText, mosaicsSent, mosaicDivisibility, walletPassword, senderAccName, encryptedMsg, appStore, siriusStore) => {
  // verify password
  let verify = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword);
  if(verify < 1){
    return verify;
  }
  const add = fetch(siriusStore.state.selectedChainNode + '/block/1').then((res) => res.json()).then((data) => { return data.meta.generationHash });

  return add.then(async(hash) => {
    let networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
    const recipientAddress = Address.createFromRawAddress(recipient);

    let xpxAmount = parseFloat(sendXPX) * Math.pow(10, 6);

    var mosaics = [];
    if(xpxAmount > 0){
      mosaics.push(new Mosaic(new MosaicId(environment.mosaicXpxInfo.id), UInt64.fromUint(Number(xpxAmount))));
    }
    if(mosaicsSent.length > 0){
      mosaicsSent.forEach((mosaicSentInfo, index) => {
        if(mosaicSentInfo.amount>0){
          mosaics.push(
            new Mosaic(
              new MosaicId(mosaicSentInfo.id),
              UInt64.fromUint(Number(mosaicSentInfo.amount * Math.pow(10, mosaicDivisibility[index])))
            )
          );
        }
      });
    }

    var transactionBuilder = new TransactionBuilderFactory();

    // calculate fee strategy
    let networkName = siriusStore.getNetworkByType(networkType);
    if(networkName === config.networkType.PRIVATE || networkName === config.networkType.PRIVATE_TEST){
      transactionBuilder.feeCalculationStrategy = FeeCalculationStrategy.ZeroFeeCalculationStrategy;
    }
    else{
      transactionBuilder.feeCalculationStrategy = FeeCalculationStrategy.MiddleFeeCalculationStrategy;
    }

    // to get sender's private key
    let accountDetails = appStore.getAccDetails(senderAccName)
    let privateKey = appStore.decryptPrivateKey(sessionStorage.getItem('walletPassword'), accountDetails.encrypted, accountDetails.iv);

    // sending encrypted message
    let msg;
    if(encryptedMsg){
      let accountInfo = await getAccInfo(recipientAddress, siriusStore.accountHttp);
      msg = EncryptedMessage.create(messageText, accountInfo, privateKey);
    }else{
      msg = PlainMessage.create(messageText);
    }

    var transferTransaction = transactionBuilder.transfer()
      .deadline(Deadline.create())
      .mosaics(mosaics)
      .message(msg)
      .networkType(networkType)
      .recipient(recipientAddress)
      .build();

    const account = Account.createFromPrivateKey(privateKey, networkType);
    const signedTransaction = account.sign(transferTransaction, hash);
    const transactionHttp = new TransactionHttp(siriusStore.state.selectedChainNode);

    // subscribeConfirmed(account.address, appStore, siriusStore);

    transactionHttp
      .announce(signedTransaction)
      .subscribe(() => {
        // console.log(x);
        return true;
      }, err => console.error(err));
  });
}

export const mosaicTransaction = (divisibility, supply, duration, durationType, mutable, transferable, walletPassword, accountName, appStore, siriusStore) => {

    // verify password
  let verify = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword);
  if(verify < 1){
    return verify;
  }
  const add = fetch(siriusStore.state.selectedChainNode + '/block/1').then((res) => res.json()).then((data) => { return data.meta.generationHash });

  return add.then((hash) => {

    let accountDetails = appStore.getAccDetails(accountName);
    // var mosaicDuration = (1 * 365 * 24 * 60 * 4 ); // 1 year - 15 sec per block
    // var mosaicDuration;
    // if(durationType == 'month'){
    //   mosaicDuration = parseInt(duration) * 30 * 24 * 60 * 4;
    // }else{
    //   mosaicDuration = parseInt(duration) * 365 * 24 * 60 * 4;
    // }

    let privateKey = appStore.decryptPrivateKey(sessionStorage.getItem('walletPassword'), accountDetails.encrypted, accountDetails.iv);
    let networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
    const account = Account.createFromPrivateKey(privateKey, networkType);

    var transactionBuilder = new TransactionBuilderFactory();
    const nonce = MosaicNonce.createRandom();
    var mosaicDefinitionTransaction = transactionBuilder.mosaicDefinition()
      .deadline(Deadline.create(environment.deadlineTransfer.deadline, environment.deadlineTransfer.chronoUnit))
      .mosaicNonce(nonce)
      .mosaicId(MosaicId.createFromNonce(nonce, account))
      .mosaicProperties(
        MosaicProperties.create({
          supplyMutable: (mutable)?true:false,
          transferable: (transferable)?true:false,
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

    var innerTxn = [
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
    const transactionHttp = new TransactionHttp(siriusStore.state.selectedChainNode);

    // subscribeConfirmed(account.address, appStore, siriusStore);

    transactionHttp
      .announce(signedTransaction)
      .subscribe((x) => {
        console.log(x);
        // console.log('annoucement is made here');
        return true;
      }, err => console.error(err));
  });
}
