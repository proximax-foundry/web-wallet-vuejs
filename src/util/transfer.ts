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
  calculateFee,
  TransactionBuilder,
  Password,
} from "tsjs-xpx-chain-sdk";
import { BuildTransactions } from '@/util/buildTransactions';
//line246
// import { mergeMap, timeout, filter, map, first, skip } from 'rxjs/operators';
import { environment } from '@/environment/environment';
import { networkState } from "@/state/networkState";
import { NetworkStateUtils } from "@/state/utils/networkStateUtils";
import { walletState } from "@/state/walletState";
import { ChainUtils } from '@/util/chainUtils';
import { WalletUtils } from '@/util/walletUtils'
import { Helper } from "@/util/typeHelper";
// const config = require("@/../config/config.json");
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";
import { listenerState, AutoAnnounceSignedTransaction, HashAnnounceBlock, AnnounceType } from "@/state/listenerState";


async function getAccInfo(address :string) :Promise<PublicAccount> {
  let accountInfo = await WalletUtils.getAccInfo(address).then(accountinfo => accountinfo.publicAccount);
  return accountInfo;
}

export const createTransaction = async (recipient :string, sendXPX :string, messageText :string, mosaicsSent :{amount: number ,id :string}[], mosaicDivisibility :number[], walletPassword :string, senderAccName :string, cosigner :string, encryptedMsg :string) : Promise<boolean>  => {
  // verify password
  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword)
  
  if (!verify) {
    return Promise.resolve(false);
  }

  const hash = networkState.currentNetworkProfile.generationHash

  let networkType = networkState.currentNetworkProfile.network.type
  const recipientAddress = recipient;

  let xpxAmount = parseFloat(sendXPX) * Math.pow(10, 6);

  let mosaics = [];
  if (xpxAmount > 0) {
    mosaics.push(new Mosaic(new MosaicId(networkState.currentNetworkProfile.network.currency.assetId), UInt64.fromUint(Number(xpxAmount))));
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
  let transactionBuilder = new BuildTransactions(networkType)
  /* let transactionBuilder = new TransactionBuilderFactory(); */
  // calculate fee strategy

  if (ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE || ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE_TEST) {
    transactionBuilder.setFeeStrategy(FeeCalculationStrategy.ZeroFeeCalculationStrategy) ;
    //FeeCalculationStrategy.ZeroFeeCalculationStrategy
  }

  // to get sender's private key
  let accountDetails, multisigAccountDetails, multisigPublicAccount;
  if (!cosigner) { // no cosigner, get private key from sender acc name
    accountDetails = walletState.currentLoggedInWallet.accounts.find((element) => element.name === senderAccName);
  } else {
    // a multisig, get cosigner's private key
    accountDetails = walletState.currentLoggedInWallet.accounts.find((element) => element.address === cosigner);
    // get multisig account info
    multisigAccountDetails = walletState.currentLoggedInWallet.others.find((element) => element.name === senderAccName).publicKey;
    multisigPublicAccount = PublicAccount.createFromPublicKey(multisigAccountDetails, networkType);
  }

  /* console.log('Getting acc details from: ' + accountDetails.address); */
  
  let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv)


  // sending encrypted message

  let msg;
  if (encryptedMsg) {
    let accountInfo = await getAccInfo(recipientAddress)
    msg = EncryptedMessage.create(messageText, accountInfo, privateKey);
  } else {
    msg = PlainMessage.create(messageText);
  }

  let transferTransaction = transactionBuilder.transfer(Address.createFromRawAddress(recipientAddress),msg,mosaics)

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

    const aggregateBondedTransaction = transactionBuilder.aggregateBonded(innerTxn)
    console.log('aggregateBondedTransaction');
    console.log(aggregateBondedTransaction);
    // if (otherCosigners.length > 0) {
    //   return cosignatoryAccount.signTransactionWithCosignatories(bondedCreated, otherCosigners, generationHash);
    // }
    const aggregateBondedTransactionSigned = account.sign(aggregateBondedTransaction, hash);
    console.log('aggregateBondedTransactionSigned');
    console.log(aggregateBondedTransactionSigned);
    const hashLockTransaction = transactionBuilder.hashLock(new Mosaic(new MosaicId(environment.mosaicXpxInfo.id), UInt64.fromUint(Number(10000000))),UInt64.fromUint(environment.lockFundDuration),aggregateBondedTransactionSigned)
    const hashLockTransactionSigned = account.sign(hashLockTransaction, hash);

   
      try {
        let hashLockAutoAnnounceSignedTx = new AutoAnnounceSignedTransaction(hashLockTransactionSigned);
        hashLockAutoAnnounceSignedTx.announceAtBlock = listenerState.currentBlock + 1;
        let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(aggregateBondedTransactionSigned);
        autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(hashLockTransactionSigned.hash);
        autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
        autoAnnounceSignedTx.type = AnnounceType.BONDED;
        ListenerStateUtils.addAutoAnnounceSignedTransaction(hashLockAutoAnnounceSignedTx);
        ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);
      } catch (error) {
        console.log(error);
      }
      
    
  }
  return Promise.resolve(true)
}



/**
 *
 *
 * @param message
 * @memberof ViewTransferComponent
 */

const calculate_fee = (message :string , amount :string, mosaic :{id :string ,amount :string}[]) :string=> {
  let mosaicsToSend = validateMosaicsToSend(amount, mosaic);
  let transactionBuilder = new BuildTransactions(networkState.currentNetworkProfile.network.type)
  if (ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE || ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE_TEST) {
    transactionBuilder.setFeeStrategy(FeeCalculationStrategy.ZeroFeeCalculationStrategy) ;
    //FeeCalculationStrategy.ZeroFeeCalculationStrategy
  }
  const x = TransferTransaction.calculateSize(PlainMessage.create(message).size(), mosaicsToSend.length);
  const b = calculateFee(x, transactionBuilder.getFeeStrategy());
  let fee;
  if (parseInt(message, 10) > 0) {
    fee = Helper.amountFormatterSimple(b.compact());
  } else if (parseInt(message, 10) === 0 && mosaicsToSend.length === 0) {
    if (transactionBuilder.getFeeStrategy() === FeeCalculationStrategy.ZeroFeeCalculationStrategy)
      fee = '0.000000';
    else {
      fee = TransferTransaction.calculateSize(parseInt(message, 10), mosaicsToSend.length) * transactionBuilder.getFeeStrategy() / 1000000;
      fee = fee.toString()
      //fee = '0.037250';
    }
  } else {
    fee = Helper.amountFormatterSimple(b.compact());
  }
  return fee;
}

/**
 *
 *
 * @returns
 * @memberof CreateTransferComponent
 */
const validateMosaicsToSend = (amountXpx :string, boxOtherMosaics :{id :string,amount :string}[]) :string[] | {id :string,amount :string}[]=> {
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
const addZeros = (cant : number, amount :string = '0' ):string => {
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


export const makeTransaction = readonly({
  calculate_fee
})

