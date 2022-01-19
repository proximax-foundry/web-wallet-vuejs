import { walletState } from "@/state/walletState";
import { readonly, ref } from "vue";
import { Address, Account, SignedTransaction, AccountInfo, TransactionHttp, PublicAccount, LinkAction, NamespaceId, AliasActionType, Password, AggregateTransaction, Deadline} from "tsjs-xpx-chain-sdk";
import { WalletUtils } from "@/util/walletUtils";
import { ChainUtils } from "@/util/chainUtils";
import { networkState } from "@/state/networkState";
import { AutoAnnounceSignedTransaction, HashAnnounceBlock, AnnounceType, listenerState } from "@/state/listenerState";
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";
import { Helper } from "@/util/typeHelper";
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { BuildTransactions } from '@/util/buildTransactions';
import { ChainAPICall } from "@/models/REST/chainAPICall"
import { WalletAccount } from "@/models/walletAccount";
import { OtherAccount } from "@/models/otherAccount";
import { e } from "mathjs";
import { Namespace } from "@/models/namespace";

const networkType = networkState.currentNetworkProfile.network.type;
const Hash = networkState.currentNetworkProfile.generationHash;

const verifyPublicKey = async(add: string):Promise<boolean> => {
  const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
   let verify = new Promise<boolean>((resolve,reject)=>{ 
    const accountPublicKey = WalletUtils.getAccInfo(add);
    accountPublicKey.then(accountinfo => {
      if (accountinfo.publicKey === invalidPublicKey) {
        console.warn(`The receiver's public key is not valid for sending encrypted messages`);
        resolve(true)
      }
      else
        resolve(false)
    })
      .catch(error => {
        reject('Err: ' + error)
      })  
  })
    let result = await verify
    return Boolean(result)
}

const verifyAddress = (currentAdd :string, add :string) => {
  const address = (add !== undefined && add !== null && add !== '') ? add.split('-').join('') : '';
  let isPassed = false;
  let errMessage = '';
  if (address !== null && address !== undefined && address.length === 40) {
    if (WalletUtils.verifyNetworkAddressEqualsNetwork(currentAdd, add.toUpperCase())) {
      isPassed = true;
    } else {
      isPassed = false;
      errMessage = 'Recipient Address Network unsupported';
    }
  } else {
    isPassed = false;
  }
  return {
    isPassed, errMessage
  }
}



const checkAvailableContact = (recipient :string) :boolean=> {
  const wallet = walletState.currentLoggedInWallet;
  let isInContacts = true;
  if (wallet.contacts != undefined) {
    isInContacts = wallet.contacts.find((element) => element.address == recipient)? true: false;
  }
  return (isInContacts || (wallet.accounts.find((element) => element.address ===recipient))  || (wallet.others.find((element) => element.address === recipient))) ? true : false;
}

const getNamespacesListByAddress = (address: string) :Namespace [] => {
  let namespacelist = []; 
  if (walletState.currentLoggedInWallet.others.find(account => account.address === address)) {
    namespacelist = walletState.currentLoggedInWallet.others.find(account => account.address == address).namespaces.filter(namespace => namespace.active === true);
  } else if (walletState.currentLoggedInWallet.accounts.find(account => account.address === address)){
    namespacelist = walletState.currentLoggedInWallet.accounts.find(account => account.address == address).namespaces.filter(namespace => namespace.active === true);
  } 
  return namespacelist;
}

const getNamespaceByAssetId= (address: string,assetId: string) :string=> {
  let namespacelist = getNamespacesListByAddress(address);
 let name = ""
  if (namespacelist.length > 0) {
    namespacelist.forEach((namespaceElement) => {
        if (namespaceElement.linkType == 1) {
          if(namespaceElement.linkedId == assetId){
            name = namespaceElement.name
          }
        } 
    });
  }
  if(name!=""){
    return name
  }else{
    return assetId;
  }
  
}

const getContact = () => {
  const wallet = walletState.currentLoggedInWallet;
    let contact = [];
    wallet.accounts.forEach((element) => {
      let accountAddress = Address.createFromRawAddress(element.address).pretty()
      contact.push({
          value: accountAddress,
          label: element.name+ " - Internal Account ",
      });
    });
  
  if (wallet.contacts != undefined) {
    wallet.contacts.forEach((element) => {
      let accountAddress = Address.createFromRawAddress(element.address).pretty()
      contact.push({
        value: accountAddress,
        label: element.name + " - Contact From Address Book",
      });
    });
  }
  return contact;
}

const namespacesOption = (address: string, linkOption: string) => {
  let namespace = [];
  let namespacelist = getNamespacesListByAddress(address);
  if (namespacelist.length > 0) {
    namespacelist.forEach((namespaceElement) => {
    const level = namespaceElement.name.split('.');
    let isDisabled: boolean;
    let linkName: string;
    let linkLabel: string;
    let Label: string;
    if (namespaceElement.linkedId != '') {
      isDisabled = (linkOption == 'Link' ? true : false);
      if (namespaceElement.linkType == 1) {
        linkName = "Asset";
        linkLabel = namespaceElement.linkedId;
        isDisabled = true;
      } else if (namespaceElement.linkType == 2) {
        linkName = "Address";
        linkLabel = Address.createFromRawAddress(namespaceElement.linkedId).pretty();
      } else {
        linkName = "Address";
        linkLabel = Address.createFromRawAddress(namespaceElement.linkedId).pretty();
        isDisabled = true;
      }
      Label = namespaceElement.name + ' (Linked to ' + linkName + ') - ' + linkLabel;
  } else if (namespaceElement.linkedId == '') {
    isDisabled = (linkOption == 'Link' ? false : true);
    Label = namespaceElement.name +'(Current unused namespace)';
  }
    namespace.push({
      value: namespaceElement.name,
      label: Label,
      level: level,
      disabled: isDisabled
    });
  });
    namespace.sort((a, b) => {
      if (a.label > b.label) return 1;
      if (a.label < b.label) return -1;
        return 0;
    });

    namespace.sort((a, b) => {
      if (a.level > b.level) return 1;
      if (a.level < b.level) return -1;
        return 0;
    });
  }

  return namespace;
}

const getCosignerList = (address: string) => {
  let cosignList = [];
  if (getMultisig(address)) {
    const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address);
    const other = walletState.currentLoggedInWallet.others.find((account) => account.address == address);
    let multiSig = account?account.getDirectParentMultisig():[];
    let multiSigOther = other?other.getDirectParentMultisig():[];

    if (multiSig.length != 0 || multiSigOther.length != 0) {
      const cosigner = walletState.currentLoggedInWallet.accounts.filter(account => multiSig.indexOf(account.publicKey) > -1 ||  multiSigOther.indexOf(account.publicKey) > -1);
      if (cosigner.length > 0) {
        cosigner.forEach((cosign) => {
          cosignList.push({
            name: cosign.name,
            address: cosign.address,
            publicKey :cosign.publicKey
          });
        });
      } 
    } 
  } 
  return cosignList;
}

const getMultisig = (address:string) => {
  const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address);
  const other = walletState.currentLoggedInWallet.others.find((account) => account.address == address);
  let isMulti = false;
  const accountDirectParent = account?account.getDirectParentMultisig():[];
  const otherDirectParent = other?other.getDirectParentMultisig():[];
  if((accountDirectParent.length > 0 || otherDirectParent.length) > 0){
    isMulti = true;
  }
  
  return isMulti;
}

const getAccountDetail = (senderAddress: string, walletPassword: string): Account => {
  const accountAddress = Address.createFromRawAddress(senderAddress);
  const accountDetails = walletState.currentLoggedInWallet.accounts.find((account) => account.address == accountAddress.plain());
  const passwordInstance = WalletUtils.createPassword(walletPassword);
  const privateKey = WalletUtils.decryptPrivateKey(passwordInstance, accountDetails.encrypted, accountDetails.iv);
  const account = Account.createFromPrivateKey(privateKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
  
  return account;
}

const linkAddressToNamespaceTransaction = (namespacesID: string, linkType: string, namespacesAddress: string) => {
  const transactionBuilder = new BuildTransactions(networkType, Hash);
  const linktype = (linkType == 'Link') ? AliasActionType.Link : AliasActionType.Unlink;
  const namespacesid = new NamespaceId(namespacesID);
  const linkNamesapceAdd = Address.createFromRawAddress(namespacesAddress);
  const namespaceTransaction= transactionBuilder.addressAlias(linktype, namespacesid, linkNamesapceAdd);
  
  return namespaceTransaction;
}

const getLinkAddressToNamespaceTransactionFee = (namespacesAddress: string, namespaceId: string, linkType: string) :number => {
  const linkAddressToNamespaceTrxFee = linkAddressToNamespaceTransaction(namespaceId, linkType, namespacesAddress);
  
  return linkAddressToNamespaceTrxFee.maxFee.compact();
}

const announceTransaction = (signedTransaction:SignedTransaction) => {
  const transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint));
  transactionHttp
    .announce(signedTransaction)
    .subscribe(() => {
        return true;
    }, err => console.error(err)); 
}

const multiSigAnnouce = (aggregateTx:SignedTransaction, hashSigned:SignedTransaction) => {
  let hashLockAutoAnnounceSignedTx = new AutoAnnounceSignedTransaction(hashSigned);
  hashLockAutoAnnounceSignedTx.announceAtBlock = listenerState.currentBlock
  let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(aggregateTx);
  
  autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(hashSigned.hash);
  autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
  autoAnnounceSignedTx.type = AnnounceType.BONDED;

  ListenerStateUtils.addAutoAnnounceSignedTransaction(hashLockAutoAnnounceSignedTx);
  ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);
}


const linkAddressToNamespace = (isMultisig :boolean,cosigners: [], multisigAccount: WalletAccount | OtherAccount, walletPassword: string, namespacesID: string, linkType: string, namespacesAddress: string) :SignedTransaction=> {
  const namespaceTransaction = linkAddressToNamespaceTransaction(namespacesID, linkType, namespacesAddress);
  const senderAddress = multisigAccount.address
  const senderAccount = getAccountDetail(senderAddress, walletPassword)
  let signedTransaction :SignedTransaction
  if (!isMultisig){ // normal account
   signedTransaction = senderAccount.sign(namespaceTransaction, Hash);
    announceTransaction(signedTransaction);
  }else{ //multisig account
    let enoughSigner= false
    let aggregateTransaction :AggregateTransaction
    let multisigPublicAccount = PublicAccount.createFromPublicKey(multisigAccount.publicKey, networkType);
    let innerTx = [namespaceTransaction.toAggregate(multisigPublicAccount)];
    //check if all cosigners are in wallet and they are non multisig
    let count = multisigAccount.multisigInfo.find(acc=>acc.level==0).minApproval
    if (count<=cosigners.length){
      enoughSigner = true
    }
    let coSigner :Account[] = [];
    cosigners.forEach((signer) => { 
      const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.publicKey === signer)
      let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
      coSigner.push(Account.createFromPrivateKey(privateKey, networkType));
    });
    if(enoughSigner){ //aggregate complete
      let firstCosigner = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==coSigner[0].address.plain()) 
      let cosignerPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), firstCosigner.encrypted, firstCosigner.iv);
      coSigner.splice(0,1)
      let account = Account.createFromPrivateKey(cosignerPrivateKey,networkType) 
      
      aggregateTransaction = AggregateTransaction.createComplete(
        Deadline.create(), 
        innerTx,
        networkType,
        []
      )
      let signedAggregateCompleteTransaction = account.signTransactionWithCosignatories(
        aggregateTransaction,coSigner,Hash
      )
      announceTransaction(signedAggregateCompleteTransaction)
      signedTransaction = signedAggregateCompleteTransaction
    }else{ //aggregate bonded
      let newBuildTx = new BuildTransactions(networkType);
      const aggreateBondedTx = newBuildTx.aggregateBonded(innerTx);
      let transactions :{signedAggregateBondedTransaction:SignedTransaction,lockFundsTransactionSigned:SignedTransaction}[] = [];
      coSigner.forEach(signer=>{
        const signedAggregateBondedTransaction = signer.sign(aggreateBondedTx, Hash);
      
        let hashLockTx = newBuildTx.hashLock(
          Helper.createAsset(networkState.currentNetworkProfile.network.currency.assetId, 10000000), 
          Helper.createUint64FromNumber(200),
          signedAggregateBondedTransaction 
        );

      const lockFundsTransactionSigned = signer.sign(hashLockTx, Hash);

      transactions.push({ signedAggregateBondedTransaction: signedAggregateBondedTransaction, lockFundsTransactionSigned: lockFundsTransactionSigned });
      })
      signedTransaction = transactions[transactions.length-1].signedAggregateBondedTransaction
      for (const transaction of transactions) {
        multiSigAnnouce(transaction.signedAggregateBondedTransaction,transaction.lockFundsTransactionSigned)
      }
    }
  }
  return signedTransaction
}
const createDelegatTransaction = (isMultisig :boolean,cosigners: [],multisigAccount: WalletAccount, walletPassword: string, accPublicKey: string, delegateAction: LinkAction) :SignedTransaction=>{

  const senderAddress = multisigAccount.address
  const senderAccount = getAccountDetail(senderAddress, walletPassword);
  const transactionBuilder = new BuildTransactions(networkType, Hash);
  const delegateTransaction = transactionBuilder.accountLink(accPublicKey, delegateAction); 
  let signedTransaction :SignedTransaction
  if (!isMultisig){ //normal account
    signedTransaction = senderAccount.sign(delegateTransaction, Hash);
    announceTransaction(signedTransaction);
  }else{ //multisig account
    let enoughSigner= false
    let aggregateTransaction :AggregateTransaction
    let multisigPublicAccount = PublicAccount.createFromPublicKey(multisigAccount.publicKey, networkType);
    let innerTx = [delegateTransaction.toAggregate(multisigPublicAccount)];
    //check if all cosigners are in wallet and they are non multisig
    let count = Math.max(multisigAccount.multisigInfo.find(acc=>acc.level==0).minApproval,multisigAccount.multisigInfo.find(acc=>acc.level==0).minRemoval) 
    if (count<=cosigners.length){
      enoughSigner = true
    }
    let coSigner :Account[] = [];
    cosigners.forEach((signer) => { 
      const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.publicKey === signer)
      let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
      coSigner.push(Account.createFromPrivateKey(privateKey, networkType));
    });
    if(enoughSigner){ //aggregate complete
      let firstCosigner = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==coSigner[0].address.plain()) 
      let cosignerPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), firstCosigner.encrypted, firstCosigner.iv);
      coSigner.splice(0,1)
      let account = Account.createFromPrivateKey(cosignerPrivateKey,networkType) 
      
      aggregateTransaction = AggregateTransaction.createComplete(
        Deadline.create(), 
        innerTx,
        networkType,
        []
      )
      let signedAggregateCompleteTransaction = account.signTransactionWithCosignatories(
        aggregateTransaction,coSigner,Hash
      )
      announceTransaction(signedAggregateCompleteTransaction)
      signedTransaction = signedAggregateCompleteTransaction
    }else{//aggregate bonded
      let newBuildTx = new BuildTransactions(networkType);
      const aggreateBondedTx = newBuildTx.aggregateBonded(innerTx);
      let transactions :{signedAggregateBondedTransaction:SignedTransaction,lockFundsTransactionSigned:SignedTransaction}[] = [];
      coSigner.forEach(signer=>{
        const signedAggregateBondedTransaction = signer.sign(aggreateBondedTx, Hash);
      
        let hashLockTx = newBuildTx.hashLock(
          Helper.createAsset(networkState.currentNetworkProfile.network.currency.assetId, 10000000), 
          Helper.createUint64FromNumber(200),
          signedAggregateBondedTransaction 
        );

      const lockFundsTransactionSigned = signer.sign(hashLockTx, Hash);

      transactions.push({ signedAggregateBondedTransaction: signedAggregateBondedTransaction, lockFundsTransactionSigned: lockFundsTransactionSigned });
      })
      signedTransaction = transactions[transactions.length-1].signedAggregateBondedTransaction
      for (const transaction of transactions) {
        multiSigAnnouce(transaction.signedAggregateBondedTransaction,transaction.lockFundsTransactionSigned)
      }
    }

  }
  
  
    
  
  return signedTransaction
}


const getValidAccount = async (address: string): Promise<boolean> => {
  let baseUrl = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort)
  const response = await fetch(`${baseUrl}/account/${address}`);
  //console.log(response);
  const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
  let add = Address.createFromRawAddress(address);

  let returnResponse: boolean;
  if (response.status == 200) {
    let res = await chainAPICall.accountAPI.getAccountInfo(add);
    if (res.linkedAccountKey == "0".repeat(64)) {
      if (res.accountType == 3) {
        returnResponse = true;
      } else {
        returnResponse = false;
      }
    }
  } else if (response.status == 404) {
    returnResponse = true;
  } else {
    returnResponse = false;
  }
  return returnResponse;
}


export const accountUtils = readonly({
  checkAvailableContact,
  verifyAddress,
  verifyPublicKey,
  getNamespacesListByAddress,
  getContact,
  getMultisig,
  getCosignerList,
  namespacesOption,
  getLinkAddressToNamespaceTransactionFee,
  linkAddressToNamespace,
  createDelegatTransaction,
  getValidAccount,
  getNamespaceByAssetId
  //getAccInfo
  //getAccInfoFromPrivateKey
});