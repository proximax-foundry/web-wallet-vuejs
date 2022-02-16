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
  AggregateTransaction,
  NamespaceId,
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
import { AppState } from "@/state/appState";
import { WalletAccount } from "@/models/walletAccount";
import { OtherAccount } from "@/models/otherAccount";

async function getAccInfo(address :string) :Promise<PublicAccount> {
  let accountInfo = await WalletUtils.getAccInfo(address).then(accountinfo => accountinfo.publicAccount);
  return accountInfo;
}


export const createTransaction = async (recipient :string, sendXPX :string, messageText :string, mosaicsSent :{amount: number ,id :string}[], mosaicDivisibility :number[], walletPassword :string, senderAccAddress :string, selectedCosigner :string, cosignerList :{publicKey :string}[],encryptedMsg :string) : Promise<boolean>  => {
  // verify password
  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword)
  
  if (!verify) {
    return Promise.resolve(false);
  }

  const hash = networkState.currentNetworkProfile.generationHash

  let networkType =AppState.networkType
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
  let transactionBuilder = AppState.buildTxn

  let initiatorAcc :WalletAccount
  let senderAcc :WalletAccount | OtherAccount
  let senderPublicAccount :PublicAccount;
  if (!selectedCosigner) { 
    initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === senderAccAddress);
  } else {
    // initiator acc details
    initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedCosigner);
    //sender acc details
    senderAcc =  walletState.currentLoggedInWallet.others.find((element) => element.address=== senderAccAddress) || walletState.currentLoggedInWallet.accounts.find((element) => element.address=== senderAccAddress) 
    let publicKey =senderAcc.publicKey
    senderPublicAccount = PublicAccount.createFromPublicKey(publicKey, networkType);
  }

  
  let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), initiatorAcc.encrypted, initiatorAcc.iv)


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

  if (!selectedCosigner) { // no cosigner, normal transaction
    const signedTransaction = account.sign(transferTransaction, hash);
    transactionHttp
      .announce(signedTransaction)
      .subscribe(() => {
        return true;
      }, err => console.error(err));
  } else { // there is a cosigner, aggregate  bonded transaction
    let cosignerAcc :Account[] =  []
    cosignerList.forEach((signer) => {
      const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.publicKey === signer.publicKey)
      let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
      cosignerAcc.push(Account.createFromPrivateKey(privateKey, networkType));
    });
    let selectedWalletSigner = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==selectedCosigner) 
    let selectedSignerPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), selectedWalletSigner.encrypted, selectedWalletSigner.iv);
    let selectedSignerAccount = Account.createFromPrivateKey(selectedSignerPrivateKey,networkType)
    let index = cosignerAcc.findIndex(acc=>acc.address.plain()==selectedCosigner)
    cosignerAcc.splice(index,1)
    const innerTxn = [transferTransaction.toAggregate(senderPublicAccount)];
    const aggregateBondedTransaction = transactionBuilder.aggregateBonded(innerTxn)
    const aggregateBondedTransactionSigned = selectedSignerAccount.signTransactionWithCosignatories(aggregateBondedTransaction,cosignerAcc, hash);
    const nativeTokenNamespace = networkState.currentNetworkProfile.network.currency.namespace;
    const lockingAtomicFee = networkState.currentNetworkProfileConfig.lockedFundsPerAggregate ?? 0;
    const hashLockTransaction = transactionBuilder.hashLock(
      new Mosaic(new NamespaceId(nativeTokenNamespace), UInt64.fromUint(lockingAtomicFee)),
      UInt64.fromUint(1000),
      aggregateBondedTransactionSigned,
    );
    const hashLockTransactionSigned = selectedSignerAccount.sign(hashLockTransaction, hash)
    let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(aggregateBondedTransactionSigned);
    autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(hashLockTransactionSigned.hash);
    autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
    autoAnnounceSignedTx.type = AnnounceType.BONDED;

    ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);

    AppState.chainAPI.transactionAPI.announce(hashLockTransactionSigned);
    AppState.isPendingTxnAnnounce = true;
  }
  
  return Promise.resolve(true)
}



/**
 *
 *
 * @param message
 * @memberof ViewTransferComponent
 */
//random account info
const test_address = "VAIHSS-J72IDB-S5FGEB-G5JHV6-6PNG3T-YDWMZV-FA27" 
const test_publicKey = "18B87A14FD660B6F8AFCA0430BB9C668B15B7B14162C78048248B941F7ED93CE"

const getMosaic =(amount :string, mosaic :{id :string ,amount :string}[]) :Mosaic[]=>{
  let mosaics :Mosaic[]= []
  if (parseInt(amount) > 0) {
    mosaics.push(new Mosaic(new MosaicId(networkState.currentNetworkProfile.network.currency.assetId), UInt64.fromUint(Number(amount))));
  }
  if (mosaic.length > 0) {
    mosaic.forEach((mosaicSentInfo, index) => {
      if (parseInt(mosaicSentInfo.amount) > 0) {
        mosaics.push(
          new Mosaic(
            new MosaicId(mosaicSentInfo.id),
            UInt64.fromUint(Number(mosaicSentInfo.amount)))
          )
        }
        
      })
    }
  return mosaics
}

const calculate_aggregate_fee = (message :string , amount :string, mosaic :{id :string ,amount :string}[]):string=> {
  
  let mosaics = getMosaic(amount,mosaic)
  let transactionBuilder = AppState.buildTxn
  let transferTransaction = transactionBuilder.transfer(Address.createFromRawAddress(test_address),PlainMessage.create(message),mosaics)
  return  Helper.amountFormatterSimple(transactionBuilder.aggregateBonded([transferTransaction.toAggregate(PublicAccount.createFromPublicKey(test_publicKey,AppState.networkType))]).maxFee.compact(),AppState.nativeToken.divisibility )
}

const calculate_fee = (message :string , amount :string, mosaic :{id :string ,amount :string}[]) :string=> {
 /*  let mosaicsToSend = validateMosaicsToSend(amount, mosaic); */
  let transactionBuilder = AppState.buildTxn
  let mosaics = getMosaic(amount,mosaic)
  
  return Helper.amountFormatterSimple(transactionBuilder.transfer(Address.createFromRawAddress(test_address),PlainMessage.create(message), mosaics).maxFee.compact(), AppState.nativeToken.divisibility)
 
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
  calculate_fee,
  calculate_aggregate_fee
})

