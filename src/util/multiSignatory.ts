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
  SignedTransaction,
  Mosaic,
  NamespaceId,
} from "tsjs-xpx-chain-sdk";

//line 483,485
import { NetworkStateUtils } from "@/state/utils/networkStateUtils";
import { WalletUtils } from "@/util/walletUtils";
import { walletState } from '@/state/walletState'
import { networkState } from "@/state/networkState"; // chainNetwork
import { TransactionUtils } from "@/util/transactionUtils";
import { WalletAccount } from '@/models/walletAccount';
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";
import { listenerState, AutoAnnounceSignedTransaction, HashAnnounceBlock, AnnounceType } from "@/state/listenerState";
import { AppState } from "@/state/appState";
import { OtherAccount } from "@/models/otherAccount";

const walletKey = "sw";
const generationHash = networkState.currentNetworkProfile.generationHash
const networkType = AppState.networkType

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
async function convertAccount(coSign :string[], numApproveTransaction :number, numDeleteUser :number, accountToConvertName :string, walletPassword :string)  :Promise<boolean>{
  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPassword)
  if (!verify) {
    return verify;
  }
  const generationHash =  networkState.currentNetworkProfile.generationHash
  
    const multisigCosignatory = [];
    
    const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.name ===accountToConvertName)
   
    const networkType = networkState.currentNetworkProfile.network.type
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
    const accountToConvert = Account.createFromPrivateKey(privateKey, networkType);

    let cosignatory 
    for(let cosignKey of coSign ){
      if (cosignKey.length == 64) {
        cosignatory = PublicAccount.createFromPublicKey(cosignKey, networkType);
      } else if (cosignKey.length == 40 || cosignKey.length == 46) {
        let address = Address.createFromRawAddress(cosignKey);

        try {
          /* let publicKey; */
          let publicKey = await getPublicKey(address);
          cosignatory = PublicAccount.createFromPublicKey(publicKey, networkType);
        } catch (error) {
          console.log(error);
        }
      }

      multisigCosignatory.push(new MultisigCosignatoryModification(
        MultisigCosignatoryModificationType.Add,
        cosignatory,
      ));
    }

    const convertIntoMultisigTransaction = ModifyMultisigAccountTransaction.create(
      Deadline.create(),
      numApproveTransaction,
      numDeleteUser,
      multisigCosignatory,
      networkType
    );

    if(enableACT(accountDetails,coSign)){//aggregate complete
      const aggregateCompleteTransaction = AggregateTransaction.createComplete(
        Deadline.create(),
        [convertIntoMultisigTransaction.toAggregate(accountToConvert.publicAccount)],
        networkType,
        []
      )
      let cosignerDetails :WalletAccount
      let cosignerAccounts :Account[] = []
      for(let i =0;i<numApproveTransaction;i++){
        if(coSign[i].length == 64){
          cosignerDetails = walletState.currentLoggedInWallet.accounts.find(element => element.publicKey ==coSign[i])
        }else{
          cosignerDetails = walletState.currentLoggedInWallet.accounts.find(element => element.address ==coSign[i])
        } 
        let cosignerPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), cosignerDetails.encrypted, cosignerDetails.iv);
        let cosignerAcc = Account.createFromPrivateKey(cosignerPrivateKey,networkType)
        cosignerAccounts.push(cosignerAcc)
      }
      const signedAggregateCompleteTransaction = accountToConvert.signTransactionWithCosignatories(aggregateCompleteTransaction,cosignerAccounts,generationHash)
      let transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint));
      transactionHttp
      .announce(signedAggregateCompleteTransaction)
      .subscribe(x => console.log(x), err => console.error(err))
    }else{//aggregagte bonded
      const aggregateBondedTransaction = AggregateTransaction.createBonded(
        Deadline.create(),
        [convertIntoMultisigTransaction.toAggregate(accountToConvert.publicAccount)],
        networkType
      );
      
      const signedAggregateBondedTransaction = accountToConvert.sign(aggregateBondedTransaction, generationHash);
  
      const nativeTokenNamespace = networkState.currentNetworkProfile.network.currency.namespace;
     
      const lockingAtomicFee = networkState.currentNetworkProfileConfig.lockedFundsPerAggregate ?? 0;
   
  
      const lockFundsTransaction = LockFundsTransaction.create(
        Deadline.create(),
        new Mosaic(new NamespaceId(nativeTokenNamespace), UInt64.fromUint(lockingAtomicFee)),
        UInt64.fromUint(1000),
        signedAggregateBondedTransaction,
        networkType
      );
  
      const lockFundsTransactionSigned = accountToConvert.sign(lockFundsTransaction, generationHash);
      
      let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(signedAggregateBondedTransaction);
      autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(lockFundsTransactionSigned.hash);
      autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
      autoAnnounceSignedTx.type = AnnounceType.BONDED;
      ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);
  
      AppState.chainAPI.transactionAPI.announce(lockFundsTransactionSigned);
  
      AppState.isPendingTxnAnnounce = true;
    }
      
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


function getCosignerInWallet(publicKey :string) :{hasCosigner:boolean,cosignerList:any[]}{
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
    let allTopCosignerList = []
    totalAcc.forEach(acc=>{
      if (!acc.isMultisig && acc.multisigInfo.filter(acc=>acc.level==-1).length>0){
        allTopCosignerList.push(acc)
      }
    })
    let level3 = foundAcc.multisigInfo.filter(acc=>acc.level==3)
    let level2 = foundAcc.multisigInfo.filter(acc=>acc.level==2)
    let level1 = foundAcc.multisigInfo.filter(acc=>acc.level==1)
    
    let filteredCosignerList = []
    level3.forEach(info=>{
      allTopCosignerList.forEach(acc=>{
        if (acc.publicKey==info.publicKey){
          filteredCosignerList.push(info.publicKey)
        }
      })
    })
    level2.forEach(info=>{
      allTopCosignerList.forEach(acc=>{
        if (acc.publicKey==info.publicKey){
          filteredCosignerList.push(info.publicKey)
        }
      })
    })
    level1.forEach(info=>{
      allTopCosignerList.forEach(acc=>{
        if (acc.publicKey==info.publicKey){
          filteredCosignerList.push(info.publicKey)
        }
      })
    })
    let hasCosigner = false
    if(filteredCosignerList.length>0){
      hasCosigner=true
    }
    return {hasCosigner:hasCosigner,cosignerList:filteredCosignerList}
}

function enableACT (account: WalletAccount|OtherAccount, addedCosigners : string[],signersInWallet? : number) :boolean{
  let enoughSigner= false
  
  //check if all cosigners are in wallet and they are non multisig
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
}

// modify multisig
async function modifyMultisigAccount(coSign :string[], removeCosign :string[], numApproveTransaction :number, numDeleteUser :number, cosigners :{address :string}[] , multisigAccount :WalletAccount | OtherAccount, walletPassword :string) :Promise<boolean> {

  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPassword);
  if (! verify) {
    return verify
  }

  const multisigCosignatory = [];

  const cosignatory :PublicAccount[]=[] 
  for(let [index,cosignKey] of coSign.entries() ){
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
  }

  removeCosign.forEach((element, index) => {
    cosignatory[coSign.length + index] = PublicAccount.createFromPublicKey(element, networkType);
    multisigCosignatory.push(new MultisigCosignatoryModification(
      MultisigCosignatoryModificationType.Remove,
      cosignatory[coSign.length + index],
    ));
  });
  let relativeNumApproveTransaction = numApproveTransaction - multisigAccount.multisigInfo.find(element => element.level === 0).minApproval;
  let relativeNumDeleteUser = numDeleteUser - multisigAccount.multisigInfo.find(element => element.level === 0).minRemoval
  
  const modifyMultisigTransaction = ModifyMultisigAccountTransaction.create(
    Deadline.create(),
    relativeNumApproveTransaction,
    relativeNumDeleteUser,
    multisigCosignatory,
    networkType
  );

  let aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [modifyMultisigTransaction.toAggregate(PublicAccount.createFromPublicKey(multisigAccount.publicKey,networkType))],
    networkType
  );

  let coSigner :Account[] = [];

  cosigners.forEach((signer) => {
    const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.address === signer.address)
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
    coSigner.push(Account.createFromPrivateKey(privateKey, networkType));
  });
  
  if (enableACT(multisigAccount,coSign,cosigners.length,)) {//aggregate complete
    let firstCosigner = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==coSigner[0].address.plain()) 
    let cosignerPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), firstCosigner.encrypted, firstCosigner.iv);
    coSigner.splice(0,1)
    let account = Account.createFromPrivateKey(cosignerPrivateKey,networkType)
    coSign.forEach(signer=>{
      const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.publicKey === signer)
      let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
      coSigner.push(Account.createFromPrivateKey(privateKey, networkType));
    })
    
    aggregateTransaction = AggregateTransaction.createComplete(
      Deadline.create(),
      [modifyMultisigTransaction.toAggregate(PublicAccount.createFromPublicKey(multisigAccount.publicKey,networkType))],
      networkType,
      []
    )
    let signedAggregateCompleteTransaction = account.signTransactionWithCosignatories(
      aggregateTransaction,coSigner,generationHash
    )
    let transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint));
    transactionHttp
    .announce(signedAggregateCompleteTransaction)
    .subscribe(x => console.log(x), err => console.error(err))
    
  }else{ //aggregate bonded
    let firstCosigner = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==coSigner[0].address.plain()) 
    let cosignerPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), firstCosigner.encrypted, firstCosigner.iv);
    let firstSignerAccount = Account.createFromPrivateKey(cosignerPrivateKey,networkType)
    coSigner.splice(0,1)
    const signedAggregateBondedTransaction =  firstSignerAccount.signTransactionWithCosignatories(
      aggregateTransaction,coSigner,generationHash
    )

    const nativeTokenNamespace = networkState.currentNetworkProfile.network.currency.namespace;
    const lockingAtomicFee = networkState.currentNetworkProfileConfig.lockedFundsPerAggregate ?? 0;

    const lockFundsTransaction = LockFundsTransaction.create(
      Deadline.create(),
      new Mosaic(new NamespaceId(nativeTokenNamespace), UInt64.fromUint(lockingAtomicFee)),
      UInt64.fromUint(1000),
      signedAggregateBondedTransaction,
      networkType
    );
   
    const lockFundsTransactionSigned = firstSignerAccount.sign(lockFundsTransaction, generationHash);
   
    let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(signedAggregateBondedTransaction);
    autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(lockFundsTransactionSigned.hash);
    autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
    autoAnnounceSignedTx.type = AnnounceType.BONDED;

    ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);

    AppState.chainAPI.transactionAPI.announce(lockFundsTransactionSigned);
    AppState.isPendingTxnAnnounce = true;
  }
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
});