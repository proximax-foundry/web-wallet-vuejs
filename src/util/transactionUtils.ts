import { readonly } from "vue";
import {
    Account,
    Address,
    Deadline,
    EncryptedMessage,
    // NetworkCurrencyMosaic,
    // FeeCalculationStrategy,
    Mosaic,
    MosaicId,
    UInt64,
    MosaicProperties,
    MosaicSupplyType,
    // MosaicService,
    MosaicNonce,
    PlainMessage,
    TransferTransaction,
    TransactionHttp,
    TransactionBuilderFactory,
    PublicAccount,
    AccountHttp,
    AccountInfo
} from "tsjs-xpx-chain-sdk";
import * as FeeCalculationStrategy from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/FeeCalculationStrategy';
import { announceAggregateBonded, announceLockfundAndWaitForConfirmation } from '../util/listener.js';
// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';
import { walletState } from "../state/walletState";
import { networkState } from "../state/networkState";

const divisibility = 6;
const xpxMosaicId = "";
const lockFundDuration = 10000;

export class TransactionUtils{

    static async getAccInfo(address: Address, accountHttp: AccountHttp): AccountInfo | null{
        // return await getPublicKey(recipientAddress, siriusStore.accountHttp);
        let promise = new Promise<AccountInfo | null>((resolve) => {
          const accountInfo = accountHttp.getAccountInfo(address);
          accountInfo.subscribe(
            (acc) => {
              // console.log(acc);
              resolve(acc);
            },
            (error) => {
              console.warn('Err: ' + error);
              resolve(null);
            }
          );
        });
        let publicKey = await promise;
        // console.log(publicKey);
        return publicKey;
    }

    static amountFormatterSimple(amount, d = 6) {
        const amountDivisibility = Number(amount) / Math.pow(10, d);
        return amountDivisibility.toLocaleString('en-us', {
          minimumFractionDigits: d
        });
    }

    static createTransaction = (recipient, sendXPX, messageText, mosaicsSent, mosaicDivisibility, walletPassword, senderAccName, cosigner = '', encryptedMsg) => {
        // verify password
        // console.log('Pw after createTransaction: ' + walletPassword);
        let verify = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword);
        if(verify < 1){
          return verify;
        }
        const add = fetch(siriusStore._buildAPIEndpointURL(siriusStore.state.selectedChainNode) + '/block/1').then((res) => res.json()).then((data) => { return data.meta.generationHash });
      
        return add.then(async(hash) => {
          let networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
          const recipientAddress = Address.createFromRawAddress(recipient);
      
          let xpxAmount = parseFloat(sendXPX) * Math.pow(10, 6);
      
          var mosaics = [];
          if(xpxAmount > 0){
            mosaics.push(new Mosaic(new MosaicId(xpxMosaicId), UInt64.fromUint(Number(xpxAmount))));
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
          let accountDetails, multisigAccountDetails, multisigPublicAccount;
          if(!cosigner){ // no cosigner, get private key from sender acc name
            accountDetails = appStore.getAccDetails(senderAccName);
          }else{
            // a multisig, get cosigner's private key
            accountDetails = appStore.getAccDetailsByAddress(cosigner);
            // get multisig account info
            multisigAccountDetails = appStore.getAccDetails(senderAccName);
            multisigPublicAccount = PublicAccount.createFromPublicKey(multisigAccountDetails.publicAccount.publicKey, networkType);
          }
      
          console.log('Getting acc details from: ' + accountDetails.address);
          let privateKey = appStore.decryptPrivateKey(walletPassword, accountDetails.encrypted, accountDetails.iv);
      
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
          const transactionHttp = new TransactionHttp(siriusStore._buildAPIEndpointURL(siriusStore.state.selectedChainNode));
      
          if(!cosigner){ // no cosigner, normal transaction
            const signedTransaction = account.sign(transferTransaction, hash);
            transactionHttp
              .announce(signedTransaction)
              .subscribe(() => {
                return true;
              }, err => console.error(err));
          }else{ // there is a cosigner, aggregate transaction
            console.log('multisigPublicAccount');
            console.log(multisigPublicAccount);
            const innerTxn = [transferTransaction.toAggregate(multisigPublicAccount)];
      
            const aggregateBondedTransaction = transactionBuilder.aggregateBonded()
              .deadline(Deadline.create())
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
              .duration(UInt64.fromUint(lockFundDuration))
              .mosaic(new Mosaic(new MosaicId(xpxMosaicId), UInt64.fromUint(Number(10000000))))
              .signedTransaction(aggregateBondedTransactionSigned)
              .networkType(networkType)
              .build();
            const hashLockTransactionSigned = account.sign(hashLockTransaction, hash);
      
            (async ()=>{
              try {
                  const confirmedTx = await announceLockfundAndWaitForConfirmation(account.address, hashLockTransactionSigned, hashLockTransactionSigned.hash, transactionHttp);
                  console.log('confirmedTx');
                  console.log(confirmedTx);
                  // eslint-disable-next-line no-unused-vars
                  var aggregateTx = await announceAggregateBonded(account.address, aggregateBondedTransactionSigned, aggregateBondedTransactionSigned.hash, confirmedTx, transactionHttp )
                  console.log('aggregateTx');
                  console.log(aggregateTx);
                  console.log("Done");
              } catch (error) {
                  console.log(error);
              }
            })();
          }
        });
      }

    static mosaicTransaction = (divisibility, supply, duration, durationType, mutable, transferable, walletPassword, accountName, appStore, siriusStore) => {

    // verify password
  let verify = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword);
  if(verify < 1){
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

    var transactionBuilder = new TransactionBuilderFactory();
    const nonce = MosaicNonce.createRandom();
    var mosaicDefinitionTransaction = transactionBuilder.mosaicDefinition()
      .deadline(Deadline.create())
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
      .deadline(Deadline.create())
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
      .deadline(Deadline.create())
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

 static calculateFee = (message, amount, mosaic) => {
  let mosaicsToSend = validateMosaicsToSend(amount, mosaic);
  const x = TransferTransaction.calculateSize(PlainMessage.create(message).size(), mosaicsToSend.length);
  const b = FeeCalculationStrategy.calculateFee(x, getFeeStrategy());
  let fee;
  if (message > 0) {
    fee = amountFormatterSimple(b.compact());
  } else if (message === 0 && mosaicsToSend.length === 0) {
    if(getFeeStrategy() === FeeCalculationStrategy.FeeCalculationStrategy.ZeroFeeCalculationStrategy)
      fee = '0.000000';
    else{
      fee = TransferTransaction.calculateSize(message, mosaicsToSend.length) * getFeeStrategy() / 1000000;
      //fee = '0.037250';
    }
  } else {
    fee = amountFormatterSimple(b.compact());
  }
  return fee;
}

 static validateMosaicsToSend = (amountXpx, boxOtherMosaics) => {
  const mosaics = [];

  if (amountXpx !== '' && amountXpx !== null && Number(amountXpx) !== 0) {
    // console.log(amountXpx);
    const arrAmount = amountXpx.toString().replace(/,/g, '').split('.');
    let decimal;
    let realAmount;

    if (arrAmount.length < 2) {
      decimal = addZeros(divisibility);
    } else {
      const arrDecimals = arrAmount[1].split('');
      decimal = addZeros(divisibility - arrDecimals.length, arrAmount[1]);
    }
    realAmount = `${arrAmount[0]}${decimal}`;
    mosaics.push({
      id: xpxMosaicId,
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

    static addZeros = (cant, amount = '0') => {
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

    static getFeeStrategy = () => {
        const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
        var transactionBuilder = new TransactionBuilderFactory();
        // calculate fee strategy
        let networkName = siriusStore.getNetworkByType(networkType);
        if(networkName === config.networkType.PRIVATE || networkName === config.networkType.PRIVATE_TEST){
        transactionBuilder.feeCalculationStrategy = FeeCalculationStrategy.ZeroFeeCalculationStrategy;
        }
        else{
        transactionBuilder.feeCalculationStrategy = FeeCalculationStrategy.MiddleFeeCalculationStrategy;
        }
        return transactionBuilder.feeCalculationStrategy;
    }

    static makeTransaction = readonly({
    calculateFee
    });

    static getFakeEncryptedMessageSize =(message)=>{
    return EncryptedMessage.create(message, PublicAccount.createFromPublicKey("0".repeat(64)), "0".repeat(64)).size();
    }

    static getPlainMessageSize =(message)=>{
    return PlainMessage.create(message).size();
    }

    static convertToCurrency =(value, divisibility)=>{

    const exactValue = value/Math.pow(10, divisibility);

    return new Intl.NumberFormat('en', {maximumFractionDigits: divisibility}).format(exactValue);
    }

    static convertToExact =(value, divisibility)=>{

    return value/Math.pow(10, divisibility);
    }
}