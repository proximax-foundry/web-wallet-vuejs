import {
  Account,
  Address,
  Deadline,
  EncryptedMessage,
  TransactionHttp,
  // EmptyMessage,
  NetworkCurrencyMosaic,
  PlainMessage,
  TransactionBuilderFactory,
  FeeCalculationStrategy
} from "tsjs-xpx-chain-sdk";
// const sdk = require('tsjs-xpx-chain-sdk');
const config = require("@/../config/config.json");

// function getPublicKey(address, accountHttp){

// }

async function getAccInfo(address, accountHttp){
  // return await getPublicKey(recipientAddress, siriusStore.accountHttp);
  let promise = new Promise((resolve) => {
    const accountInfo = accountHttp.getAccountInfo(address);
    accountInfo.subscribe(
      (acc) => {
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


export const makeTransaction = (recipient, sendXPX, messageText, walletPassword, senderAccName, encryptedMsg, appStore, siriusStore) => {
  // verify password
  let verify = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword);
  if(verify < 1){
    return verify;
  }
  const add = fetch('http://bctestnet1.brimstone.xpxsirius.io:3000/block/1').then((res) => res.json()).then((data) => { return data.meta.generationHash });

  return add.then(async(hash) => {
    // console.log(hash)
    let networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
    const recipientAddress = Address.createFromRawAddress(recipient);

    let xpxAmount = parseFloat(sendXPX.substring(1));

    var mosaics = [];
    if(xpxAmount > 0){
      mosaics.push(NetworkCurrencyMosaic.createRelative(xpxAmount));
    }

    var buildTransfer = new TransactionBuilderFactory();

    // calculate fee strategy
    let networkName = siriusStore.getNetworkByType(networkType);
    if(networkName === config.networkType.PRIVATE || networkName === config.networkType.PRIVATE_TEST){
      buildTransfer.feeCalculationStrategy = FeeCalculationStrategy.ZeroFeeCalculationStrategy;
    }
    else{
      buildTransfer.feeCalculationStrategy = FeeCalculationStrategy.MiddleFeeCalculationStrategy;
    }

    // to get sender's private key
    let acc = appStore.getAccDetails(senderAccName)

    // sending encrypted message
    let msg;
    if(encryptedMsg){
      let accInfo = await getAccInfo(recipientAddress, siriusStore.accountHttp);
      msg = EncryptedMessage.create(messageText, accInfo, acc.pk);
    }else{
      msg = PlainMessage.create(messageText);
    }

    // console.log(msg);

    var transferTransaction = buildTransfer.transfer()
      .deadline(Deadline.create())
      .mosaics(mosaics)
      .message(msg)
      .networkType(networkType)
      .recipient(recipientAddress)
      .build();
    // console.log(hash)
    const account = Account.createFromPrivateKey(acc.pk, networkType);
    const signedTransaction = account.sign(transferTransaction, hash);
    const transactionHttp = new TransactionHttp('http://bctestnet1.brimstone.xpxsirius.io:3000');
    transactionHttp
      .announce(signedTransaction)
      .subscribe((x) => {
        console.log(x);
        return true;
      }, err => console.error(err));
  });
}


