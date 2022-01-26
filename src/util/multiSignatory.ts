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

const walletKey = "sw";


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
    // console.log('Account to convert name: ' + accountToConvertName);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.name ===accountToConvertName)
   /*  appStore.getAccDetails(accountToConvertName); */
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

    const aggregateTransaction = AggregateTransaction.createBonded(
      Deadline.create(),
      [convertIntoMultisigTransaction.toAggregate(accountToConvert.publicAccount)],
      networkType
    );

    const signedAggregateBoundedTransaction = accountToConvert.sign(aggregateTransaction, generationHash);

    const nativeTokenNamespace = networkState.currentNetworkProfile.network.currency.namespace;
    // const nativeTokenDivisibility = networkState.currentNetworkProfile.network.currency.divisibility;
    const lockingAtomicFee = networkState.currentNetworkProfileConfig.lockedFundsPerAggregate ?? 0;
    // const lockingFee = nativeTokenDivisibility ? lockingAtomicFee / Math.pow(10, nativeTokenDivisibility) : lockingAtomicFee;

    const lockFundsTransaction = LockFundsTransaction.create(
      Deadline.create(),
      new Mosaic(new NamespaceId(nativeTokenNamespace), UInt64.fromUint(lockingAtomicFee)),
      UInt64.fromUint(1000),
      signedAggregateBoundedTransaction,
      networkType
    );

    const lockFundsTransactionSigned = accountToConvert.sign(lockFundsTransaction, generationHash);

   /*  const transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint)); */
    (async () => {
      try {
        // let hashLockAutoAnnounceSignedTx = new AutoAnnounceSignedTransaction(lockFundsTransactionSigned);
        // hashLockAutoAnnounceSignedTx.announceAtBlock = listenerState.currentBlock + 1;
        let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(signedAggregateBoundedTransaction);
        autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(lockFundsTransactionSigned.hash);
        autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
        autoAnnounceSignedTx.type = AnnounceType.BONDED;
        // ListenerStateUtils.addAutoAnnounceSignedTransaction(hashLockAutoAnnounceSignedTx);
        ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);

        AppState.chainAPI.transactionAPI.announce(lockFundsTransactionSigned);

        AppState.isPendingTxnAnnounce = true;
      /*   const confirmedTx = await announceLockfundAndWaitForConfirmation(accountToConvert.address, lockFundsTransactionSigned, lockFundsTransactionSigned.hash, transactionHttp);
        console.log('confirmedTx');
        console.log(confirmedTx);
        // eslint-disable-next-line no-unused-vars
        let aggregateTx = await announceAggregateBonded(accountToConvert.address, signedAggregateBoundedTransaction, signedAggregateBoundedTransaction.hash, confirmedTx, transactionHttp)
        console.log('aggregateTx');
        console.log(aggregateTx);
        console.log("Done"); */
        
      } catch (error) {
        console.log(error);
      }
    })();
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
    console.log(allTopCosignerList)
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

// modify multisig
async function modifyMultisigAccount(coSign :string[], removeCosign :string[], numApproveTransaction :number, numDeleteUser :number, cosigners :{address :string}[] , multisigAccount :WalletAccount, walletPassword :string) :Promise<boolean> {

  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPassword);
  if (! verify) {
    return verify
  }

  const generationHash = networkState.currentNetworkProfile.generationHash

  const multisigCosignatory = [];

  const networkType = networkState.currentNetworkProfile.network.type;

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
        //toast?
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
  console.log(relativeNumApproveTransaction)
  console.log(relativeNumDeleteUser)
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

 
  
  let enoughSigner= false
  
  //check if all cosigners are in wallet and they are non multisig
  let count = Math.max(multisigAccount.multisigInfo.find(acc=>acc.level==0).minApproval,multisigAccount.multisigInfo.find(acc=>acc.level==0).minRemoval) 
  if (count<=cosigners.length){
    enoughSigner = true
  }
  let number =0
  let addedCosignInWallet = false
  for(let signer of coSign){
    let findAcc =  walletState.currentLoggedInWallet.accounts.find(element => element.publicKey === signer)
    if(findAcc!=undefined){
      number++
    }
  } 
  if(number==coSign.length){
    addedCosignInWallet=true
  }
  let coSigner :Account[] = [];

  cosigners.forEach((signer) => {
    const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.address === signer.address)
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
    coSigner.push(Account.createFromPrivateKey(privateKey, networkType));
  });
  
  
  if (enoughSigner&&addedCosignInWallet) {//aggregate complete
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

    /* let aggregateTransaction = AggregateTransaction.createBonded(
      Deadline.create(),
      [modifyMultisigTransaction.toAggregate(PublicAccount.createFromPublicKey(multisigAccount.publicKey,networkType))],
      networkType
    ); */
    let transactions :{signedAggregateBondedTransaction:SignedTransaction,lockFundsTransactionSigned:SignedTransaction}[] = [];
    
    coSigner.forEach((coSignerAccount) => {
      const signedAggregateBondedTransaction = coSignerAccount.sign(aggregateTransaction, generationHash);
      
      const lockFundsTransaction = LockFundsTransaction.create(
        Deadline.create(),
        NetworkCurrencyMosaic.createRelative(10),
        UInt64.fromUint(1000),
        signedAggregateBondedTransaction,
        networkType
      );

      const lockFundsTransactionSigned = coSignerAccount.sign(lockFundsTransaction, generationHash);

      transactions.push({ signedAggregateBondedTransaction: signedAggregateBondedTransaction, lockFundsTransactionSigned: lockFundsTransactionSigned });
    });
    
  
    for (const transaction of transactions) {
      let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(transaction.signedAggregateBondedTransaction);
      autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(transaction.lockFundsTransactionSigned.hash);
      autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
      autoAnnounceSignedTx.type = AnnounceType.BONDED;

      ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);

      AppState.chainAPI.transactionAPI.announce(transaction.lockFundsTransactionSigned);
      AppState.isPendingTxnAnnounce = true;
    }
  }
  
    
  
  
  return verify
}

 

//level 1 = cosigner


 const fetchMultiSigCosigners = (multiSigAddress :string) :Array<{list :{address :string, name: string , balance: number}}> =>{
  let account = walletState.currentLoggedInWallet.accounts.find(element => element.address === multiSigAddress)? walletState.currentLoggedInWallet.accounts.find(element => element.address === multiSigAddress) : walletState.currentLoggedInWallet.others.find(element => element.address === multiSigAddress)
  if (account == undefined){
    return []
  }
  let cosigners = account.multisigInfo.filter(element => element.level === 1)
  
  let list = [];
  
    cosigners.forEach(cosigner=>{
      let isInWallet = walletState.currentLoggedInWallet.accounts.find(account => account.publicKey === cosigner.publicKey)? true: false
      if(isInWallet){ //if cosigner in current wallet
        let account = walletState.currentLoggedInWallet.accounts.find(account => account.publicKey === cosigner.publicKey)
        list.push({ address: account.address, name: account.name , balance: account.balance})
      }else{ //cosigner not in this wallet
      /*  let convertedAddress = Helper.createPublicAccount(cosigner.publicKey,networkState.currentNetworkProfile.network.type).address.plain()
        
          list.push({ address: convertedAddress, name: convertedAddress.substr(-4) , balance: undefined})
        */
        
      }
    })
  
  list.sort((a, b) => (a.balance < b.balance) ? 1 : -1);
  return list
 
}




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
  fetchMultiSigCosigners,
});