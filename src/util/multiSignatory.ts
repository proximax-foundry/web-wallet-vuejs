import { readonly } from "vue";
import {
  Account,
  Address,
  AggregateTransaction,
  PublicAccount,
  MultisigCosignatoryModification,
  MultisigCosignatoryModificationType,
  AccountInfo, 
  Password,
  MultisigAccountGraphInfo,
} from "tsjs-xpx-chain-sdk";
import qrcode from 'qrcode-generator';
import { WalletUtils } from "@/util/walletUtils";
import { walletState } from '@/state/walletState'
import { networkState } from "@/state/networkState"; 
import { TransactionUtils } from "@/util/transactionUtils";
import { WalletAccount } from '@/models/walletAccount';
import { AppState } from "@/state/appState";
import { OtherAccount } from "@/models/otherAccount";
import { Helper } from "./typeHelper";
import { ChainUtils } from "./chainUtils";

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
        resolve({status:false,publicKey: ""})
      }
    );
  });
}

function generateContact(selected :string,name: string) :{value: string,label:string}[]{
  const wallet = walletState.currentLoggedInWallet
  let contact = [];
  let accounts = wallet.accounts.filter(account => account.name!= name)
  accounts.forEach((element) => {
    if (element.address == selected)  {

    }else{
      contact.push({
        value: element.publicKey,
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
      ChainUtils.getAccountInfo(address).then(accountInfo => {
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

const getAggregateFee = async (publicKey :string,addedCosigners: string[],numApprove :number,numDelete :number,removeCosign? :string[]) :Promise<string>=>{
  const acc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==publicKey) || walletState.currentLoggedInWallet.others.find(acc=>acc.publicKey==publicKey)
  const multisigCosignatory = []; 
  let cosignatory 
    for(let cosignKey of addedCosigners){
      if (cosignKey.length == 64) {
        cosignatory = PublicAccount.createFromPublicKey(cosignKey, AppState.networkType);
      } else if (cosignKey.length == 40 || cosignKey.length == 46) {
        let address = Address.createFromRawAddress(cosignKey);

        try {
          let publicKey = await getPublicKey(address);
          cosignatory = PublicAccount.createFromPublicKey(publicKey, AppState.networkType);
        } catch (error) {
          console.log(error);
        }
      }

      multisigCosignatory.push(new MultisigCosignatoryModification(
        MultisigCosignatoryModificationType.Add,
        cosignatory,
      ));
    }
    if(removeCosign){
      removeCosign.forEach((element, index) => {
        if(!cosignatory){
          cosignatory = []
        }
        cosignatory[addedCosigners.length + index] = PublicAccount.createFromPublicKey(element, AppState.networkType);
        multisigCosignatory.push(new MultisigCosignatoryModification(
          MultisigCosignatoryModificationType.Remove,
          cosignatory[addedCosigners.length + index],
        ));
      });
    }
    let txBuilder = AppState.buildTxn
    let publicAcc = PublicAccount.createFromPublicKey(publicKey,AppState.networkType)
    let relativeNumApproveTransaction = numApprove- acc.multisigInfo.find(element => element.level === 0).minApproval;
    let relativeNumDeleteUser = numDelete - acc.multisigInfo.find(element => element.level === 0).minRemoval
    let convertIntoMultisigTransaction = txBuilder.modifyMultisigAccountBuilder()
    .minApprovalDelta(relativeNumApproveTransaction)
    .minRemovalDelta(relativeNumDeleteUser)
    .modifications( multisigCosignatory)
    .build() 
    let aggregateBondedTx = txBuilder.aggregateBondedBuilder()
    .innerTransactions([convertIntoMultisigTransaction.toAggregate(publicAcc)])
    .build()
  return Helper.amountFormatterSimple(aggregateBondedTx.maxFee.compact(),AppState.nativeToken.divisibility)
  
}

const convertMultisigQr = async (coSign :string[], numApproveTransaction :number, numDeleteUser :number,accPublicKey :string ) :Promise<string> =>{
  const multisigCosignatory = [];
  let cosignatory :PublicAccount
  for(let cosignKey of coSign ){
    if (cosignKey.length == 64) {
      cosignatory = PublicAccount.createFromPublicKey(cosignKey, AppState.networkType);
    } else if (cosignKey.length == 40 || cosignKey.length == 46) {
      let address = Address.createFromRawAddress(cosignKey);

      try {
        let publicKey = await getPublicKey(address);
        cosignatory = PublicAccount.createFromPublicKey(publicKey, AppState.networkType);
      } catch (error) {
        console.log(error);
      }
    }

    multisigCosignatory.push(new MultisigCosignatoryModification(
      MultisigCosignatoryModificationType.Add,
      cosignatory,
    ));
  }

  const txBuilder = AppState.buildTxn
  const convertIntoMultisigTransaction = txBuilder.modifyMultisigAccountBuilder()
  .minApprovalDelta(numApproveTransaction)
  .minRemovalDelta(numDeleteUser)
  .modifications(multisigCosignatory)
  .build()
  
  const aggregateBondedTransaction = txBuilder.aggregateBondedBuilder()
  .innerTransactions([convertIntoMultisigTransaction.toAggregate(PublicAccount.createFromPublicKey(accPublicKey,AppState.networkType))])
  .build()
  const qr = qrcode(0, 'H');
  let data = {
    payload:aggregateBondedTransaction.serialize(),
    callbackUrl: null
  }
  qr.addData(JSON.stringify(data));
  qr.make();
  return qr.createSvgTag()
}

/* coSign: array() */
async function convertAccount(coSign :string[], numApproveTransaction :number, numDeleteUser :number, accountToConvertName :string, walletPassword :string)  :Promise<boolean>{
  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPassword)
  if (!verify) {
    return verify;
  }
  
  const multisigCosignatory = [];
  
  const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.name ===accountToConvertName)
  
  
  let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
  const accountToConvert = Account.createFromPrivateKey(privateKey, AppState.networkType);

  let cosignatory 
  for(let cosignKey of coSign ){
    if (cosignKey.length == 64) {
      cosignatory = PublicAccount.createFromPublicKey(cosignKey, AppState.networkType);
    } else if (cosignKey.length == 40 || cosignKey.length == 46) {
      let address = Address.createFromRawAddress(cosignKey);

      try {
        let publicKey = await getPublicKey(address);
        cosignatory = PublicAccount.createFromPublicKey(publicKey, AppState.networkType);
      } catch (error) {
        console.log(error);
      }
    }

    multisigCosignatory.push(new MultisigCosignatoryModification(
      MultisigCosignatoryModificationType.Add,
      cosignatory,
    ));
  }
  const txBuilder = AppState.buildTxn
  const convertIntoMultisigTransaction = txBuilder.modifyMultisigAccountBuilder()
  .minApprovalDelta(numApproveTransaction)
  .minRemovalDelta(numDeleteUser)
  .modifications(multisigCosignatory)
  .build()
  
  const aggregateBondedTransaction = txBuilder.aggregateBondedBuilder()
  .innerTransactions([convertIntoMultisigTransaction.toAggregate(accountToConvert.publicAccount)])
  .build()
  
  const signedAggregateBondedTransaction = accountToConvert.sign(aggregateBondedTransaction, networkState.currentNetworkProfile.generationHash);
  let lockFundsTransaction =  TransactionUtils.lockFundTx(signedAggregateBondedTransaction)
  const lockFundsTransactionSigned = accountToConvert.sign(lockFundsTransaction, networkState.currentNetworkProfile.generationHash);
  TransactionUtils.announceLF_AND_addAutoAnnounceABT(lockFundsTransactionSigned,signedAggregateBondedTransaction)
      
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
    /* reject('Err: ' + error) */
  })
})

  let result = await isPartial 
  return Boolean(result)
    
}
  



function getMultisigAccountGraphInfo(address :string) :Promise<MultisigAccountGraphInfo>{
  return WalletUtils.getMultisigAccGraphInfo( Address.createFromRawAddress(address ));
}


function checkIsMultiSig(accountAddress :string) :boolean{
    /* let account = walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress)?walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress):  walletState.currentLoggedInWallet.others.find(element=>element.address ===accountAddress) */
    let wallet = walletState.currentLoggedInWallet
    if(!wallet){
      return false
    }
    let account
      if (wallet.accounts.find(element => element.address ===accountAddress) === undefined && wallet.others.find(element => element.address ===accountAddress) === undefined){
        account = null
      } else if (wallet.accounts.find(element => element.address ===accountAddress) === undefined){
        account = wallet.others.find(element => element.address ===accountAddress) 
      } else if (wallet.others.find(element => element.address ===accountAddress) === undefined){
        account = wallet.accounts.find(element => element.address ===accountAddress)
      }
    
    let verify = false;
      
    verify = account.getDirectParentMultisig().length? true: false
    
      return Boolean(verify);
  
}

function checkHasMultiSig(accountAddress :string) :boolean{
  /* let account = walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress)?walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress):  walletState.currentLoggedInWallet.others.find(element=>element.address ===accountAddress) */
  let wallet = walletState.currentLoggedInWallet
  if(!wallet){
    return false
  }
  let account
    if (wallet.accounts.find(element => element.address ===accountAddress) === undefined && wallet.others.find(element => element.address ===accountAddress) === undefined){
      account = null
    } else if (wallet.accounts.find(element => element.address ===accountAddress) === undefined){
      account = wallet.others.find(element => element.address ===accountAddress)
      
    } else if (wallet.others.find(element => element.address ===accountAddress) === undefined){
      account = wallet.accounts.find(element => element.address ===accountAddress)
    }
  
  let verify = false;
    
  let tempArr = account.multisigInfo.filter(account=>account.level == -1)
  verify = tempArr.length>0 ? true: false
  
    return Boolean(verify);

}


function getCosignerInWallet(publicKey :string) :{hasCosigner:boolean,cosignerList:string[]}{
  if(!walletState.currentLoggedInWallet){
    return {hasCosigner:false,cosignerList: []}
  }
  let accounts = walletState.currentLoggedInWallet.accounts.map(
    (acc)=>{ 
      return { 
        publicKey: acc.publicKey,
        isMultisig: acc.getDirectParentMultisig().length ? true: false,
        multisigInfo: acc.multisigInfo,
      }; 
    });
    
   let otherAccounts =walletState.currentLoggedInWallet.others.filter((acc)=> acc.type === "MULTISIG").map(
    (acc)=>{ 
      return { 
        publicKey: acc.publicKey,
        isMultisig: true,
        multisigInfo: acc.multisigInfo,
      }; 
    });

    let totalAcc = accounts.concat(otherAccounts);
    let foundAcc = totalAcc.find(acc=>acc.publicKey==publicKey) 
    if(!foundAcc){
      return {hasCosigner:false,cosignerList: []}
    }
    let allTopCosignerList = []
    totalAcc.forEach(acc=>{
      if (!acc.isMultisig && acc.multisigInfo.filter(acc=>acc.level==-1).length>0){
        allTopCosignerList.push(acc)
      }
    })
    let multisigDepth = networkState.currentNetworkProfileConfig.maxMultisigDepth
    let filteredCosignerList = []
    for(let i =1;i<=multisigDepth;i++){
      let multisigLevel = foundAcc.multisigInfo.filter(acc=>acc.level==i)
      multisigLevel.forEach(info=>{
        allTopCosignerList.forEach(acc=>{
          if (acc.publicKey==info.publicKey){
            filteredCosignerList.push(info.publicKey)
          }
        })
      })
    }
    let hasCosigner = false
    if(filteredCosignerList.length>0){
      hasCosigner=true
    }
  return {hasCosigner:hasCosigner,cosignerList:filteredCosignerList}
}

/* function enableACT (account: WalletAccount|OtherAccount, addedCosigners : string[],signersInWallet? : number) :boolean{
  let enoughSigner= false
  
  let count = Math.max(account.multisigInfo.find(acc=>acc.level==0).minApproval,account.multisigInfo.find(acc=>acc.level==0).minRemoval) 
  if(signersInWallet!=undefined){
    if (count<=signersInWallet){
      enoughSigner = true
    }
  }
  let number =0
  let allAddedCosignInWallet = false
  for(let signer of addedCosigners){
    let findAcc =  walletState.currentLoggedInWallet.accounts.find(element => element.publicKey === signer) || walletState.currentLoggedInWallet.accounts.find(element => element.address == signer)
    if(findAcc!=undefined){
      number++
      if(findAcc.getDirectParentMultisig().length>0){
        number--
      }
    }
  } 
 
  if(number==addedCosigners.length){
    allAddedCosignInWallet=true
  }
  if (enoughSigner==true && allAddedCosignInWallet){
    return true
  }else if(signersInWallet==undefined && allAddedCosignInWallet){
    return true
  }else{
    return false
  }
} */

const editMultisigQr = async (multisigAccount :WalletAccount | OtherAccount,coSign :string[],removeCosign :string[], numApproveTransaction :number, numDeleteUser :number ) :Promise<string> =>{
  const multisigCosignatory = [];
  const cosignatory :PublicAccount[]=[] 
  for(let [index,cosignKey] of coSign.entries() ){
    if (cosignKey.length == 64) { 
      cosignatory[index] = PublicAccount.createFromPublicKey(cosignKey, AppState.networkType);
    } else if (cosignKey.length == 40 || cosignKey.length == 46) {
      // option to accept address
      let address = Address.createFromRawAddress(cosignKey);
      try {
        let publicKey = await getPublicKey(address); 
        cosignatory[index] = PublicAccount.createFromPublicKey(publicKey, AppState.networkType);
      } catch (error) {
        console.log(error);
      }
    }

    multisigCosignatory.push(new MultisigCosignatoryModification(
      MultisigCosignatoryModificationType.Add,
      cosignatory[index],
    ));
  }

  removeCosign.forEach((element, index) => {
    cosignatory[coSign.length + index] = PublicAccount.createFromPublicKey(element, AppState.networkType);
    multisigCosignatory.push(new MultisigCosignatoryModification(
      MultisigCosignatoryModificationType.Remove,
      cosignatory[coSign.length + index],
    ));
  });

  let relativeNumApproveTransaction = numApproveTransaction - multisigAccount.multisigInfo.find(element => element.level === 0).minApproval;
  let relativeNumDeleteUser = numDeleteUser - multisigAccount.multisigInfo.find(element => element.level === 0).minRemoval
  let publicAcc = PublicAccount.createFromPublicKey(multisigAccount.publicKey,AppState.networkType)
  const txBuilder = AppState.buildTxn
  const modifyMultisigTransaction = txBuilder.modifyMultisigAccountBuilder()
  .minApprovalDelta(relativeNumApproveTransaction)
  .minRemovalDelta(relativeNumDeleteUser)
  .modifications(multisigCosignatory)
  .build()
  
  const aggregateBondedTransaction = txBuilder.aggregateBondedBuilder()
  .innerTransactions([modifyMultisigTransaction.toAggregate(publicAcc)])
  .build()
  const qr = qrcode(0, 'H');
  let data = {
    payload:aggregateBondedTransaction.serialize(),
    callbackUrl: null
  }
  qr.addData(JSON.stringify(data));
  qr.make();
  return qr.createSvgTag()
}

// modify multisig
async function modifyMultisigAccount(selectedCosign: string,coSign :string[], removeCosign :string[], numApproveTransaction :number, numDeleteUser :number, multisigAccount :WalletAccount | OtherAccount, walletPassword :string) :Promise<boolean> {

  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPassword);
  if (! verify) {
    return verify
  }

  const multisigCosignatory = [];

  const cosignatory :PublicAccount[]=[] 
  for(let [index,cosignKey] of coSign.entries() ){
    if (cosignKey.length == 64) { 
      cosignatory[index] = PublicAccount.createFromPublicKey(cosignKey, AppState.networkType);
    } else if (cosignKey.length == 40 || cosignKey.length == 46) {
      // option to accept address
      let address = Address.createFromRawAddress(cosignKey);
      try {
        let publicKey = await getPublicKey(address); 
        cosignatory[index] = PublicAccount.createFromPublicKey(publicKey, AppState.networkType);
      } catch (error) {
        console.log(error);
      }
    }

    multisigCosignatory.push(new MultisigCosignatoryModification(
      MultisigCosignatoryModificationType.Add,
      cosignatory[index],
    ));
  }

  removeCosign.forEach((element, index) => {
    cosignatory[coSign.length + index] = PublicAccount.createFromPublicKey(element, AppState.networkType);
    multisigCosignatory.push(new MultisigCosignatoryModification(
      MultisigCosignatoryModificationType.Remove,
      cosignatory[coSign.length + index],
    ));
  });
  let relativeNumApproveTransaction = numApproveTransaction - multisigAccount.multisigInfo.find(element => element.level === 0).minApproval;
  let relativeNumDeleteUser = numDeleteUser - multisigAccount.multisigInfo.find(element => element.level === 0).minRemoval
  const txBuilder = AppState.buildTxn
  const modifyMultisigTransaction = txBuilder.modifyMultisigAccountBuilder()
  .minApprovalDelta(relativeNumApproveTransaction)
  .minRemovalDelta(relativeNumDeleteUser)
  .modifications(multisigCosignatory)
  .build()
 
  let publicAcc = PublicAccount.createFromPublicKey(multisigAccount.publicKey,AppState.networkType)
  let aggregateBondedTransaction = txBuilder.aggregateBondedBuilder()
  .innerTransactions([modifyMultisigTransaction.toAggregate(publicAcc)])
  .build()

  let initiator = walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==selectedCosign) 
  let initiatorPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), initiator.encrypted, initiator.iv);
  let initiatorAccount = Account.createFromPrivateKey(initiatorPrivateKey,AppState.networkType)
  const signedAggregateBondedTransaction =  initiatorAccount.sign(aggregateBondedTransaction,networkState.currentNetworkProfile.generationHash)
  const lockFundsTransaction = TransactionUtils.lockFundTx(signedAggregateBondedTransaction)
  const lockFundsTransactionSigned = initiatorAccount.sign(lockFundsTransaction, networkState.currentNetworkProfile.generationHash);
  TransactionUtils.announceLF_AND_addAutoAnnounceABT(lockFundsTransactionSigned,signedAggregateBondedTransaction)

  return verify
}

 

//level 1 = cosigner







export const multiSign = readonly({
  // config,
  getCosignerInWallet,
  getPublicKey,
  generateContact,
  verifyContactPublicKey,
  convertAccount,
  onPartial,
  checkIsMultiSig,
  checkHasMultiSig,
  getMultisigAccountGraphInfo,
  modifyMultisigAccount,
  getAggregateFee,
  convertMultisigQr,
  editMultisigQr
  /* enableACT */
});