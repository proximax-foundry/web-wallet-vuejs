import { walletState } from "@/state/walletState";
import { readonly } from "vue";
import { Address, Account, SignedTransaction,PublicAccount, LinkAction, NamespaceId, AliasActionType, Password, AddressAliasTransaction, AccountLinkTransaction} from "tsjs-xpx-chain-sdk";
import { WalletUtils } from "@/util/walletUtils";
import { ChainUtils } from "@/util/chainUtils";
import { networkState } from "@/state/networkState";
import { WalletAccount } from "@/models/walletAccount";
import { OtherAccount } from "@/models/otherAccount";
import { Namespace } from "@/models/namespace";
import { AppState } from "@/state/appState";
import { TransactionUtils } from "./transactionUtils";

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
  recipient = Address.createFromRawAddress(recipient).plain()
  if (wallet.contacts != undefined) {
    isInContacts = wallet.contacts.find((element) => element.address == recipient)? true: false;
  }
  return (isInContacts || (wallet.accounts.find((element) => element.address ===recipient))  || (wallet.others.find((element) => element.address === recipient))) ? true : false;
}

const getNamespaceListByAddress = (address: string) :Namespace [] => {
  if(!walletState.currentLoggedInWallet){
    return []
  }
  let namespacelist = []; 
  if (walletState.currentLoggedInWallet.others.find(account => account.address === address)) {
    namespacelist = walletState.currentLoggedInWallet.others.find(account => account.address == address).namespaces.filter(namespace => namespace.active === true);
  } else if (walletState.currentLoggedInWallet.accounts.find(account => account.address === address)){
    namespacelist = walletState.currentLoggedInWallet.accounts.find(account => account.address == address).namespaces.filter(namespace => namespace.active === true);
  } 
  return namespacelist;
}

const getContact = () => {
  if(!walletState.currentLoggedInWallet){
    return []
  }
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

const namespaceOption = (address: string, linkOption: string) => {
  let namespace = [];
  let namespacelist = getNamespaceListByAddress(address);
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
  const account = Account.createFromPrivateKey(privateKey, AppState.networkType);
  
  return account;
}

const linkNamespaceToAddressTransaction = (namespaceID: string, linkType: string, namespaceAddress: string) :AddressAliasTransaction=> {
  const transactionBuilder = AppState.buildTxn
  const tempLinkType = (linkType == 'Link') ? AliasActionType.Link : AliasActionType.Unlink;
  const namespaceId = new NamespaceId(namespaceID);
  const linkNamespaceAdd = Address.createFromRawAddress(namespaceAddress);
  const namespaceTransaction = transactionBuilder.addressAliasBuilder()
  .actionType(tempLinkType)
  .namespaceId(namespaceId)
  .address(linkNamespaceAdd)
  .build()
  return namespaceTransaction;
}

const delegateTransaction = (publicKey: string, delegateAction :LinkAction) :AccountLinkTransaction=> {
  const txBuilder = AppState.buildTxn
  const delegateTransaction = txBuilder.accountLinkBuilder() 
  .remoteAccountKey(publicKey)
  .linkAction(delegateAction)
  .build() 
  return delegateTransaction
}

const getLinkNamespaceToAddressTransactionFee = (isMultisig :boolean,namespaceAddress: string, namespaceId: string, linkType: string) :number => {
  const linkAddressToNamespaceTx = linkNamespaceToAddressTransaction(namespaceId, linkType, namespaceAddress);
  if(!isMultisig){
    return linkAddressToNamespaceTx.maxFee.compact();
  }else{
    let publicKey = "0".repeat(64)
    const aggregateBondedTx = AppState.buildTxn.aggregateBonded([linkAddressToNamespaceTx.toAggregate(PublicAccount.createFromPublicKey(publicKey,AppState.networkType))])
    return aggregateBondedTx.maxFee.compact()
  }
  
}

const linkNamespaceToAddress = (selectedCosign :string,isMultisig :boolean, multisigAccount: WalletAccount | OtherAccount, walletPassword: string, namespaceID: string, linkType: string, namespaceAddress: string) :void=> {
  const namespaceTransaction = linkNamespaceToAddressTransaction(namespaceID, linkType, namespaceAddress);
  const senderAddress = multisigAccount.address
  const senderAccount = getAccountDetail(senderAddress, walletPassword)
  let signedTransaction :SignedTransaction
  if (!isMultisig){ // normal account
   signedTransaction = senderAccount.sign(namespaceTransaction, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceTransaction(signedTransaction)
  }else{ //multisig account
    
    let multisigPublicAccount = PublicAccount.createFromPublicKey(multisigAccount.publicKey, AppState.networkType);
    let innerTx = [namespaceTransaction.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = TransactionUtils.aggregateBondedTx(innerTx);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.publicKey === selectedCosign)
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
    let initiatorAcc = Account.createFromPrivateKey(privateKey, AppState.networkType)
    const signedAggregateBondedTransaction = initiatorAcc.sign(aggregateBondedTx,networkState.currentNetworkProfile.generationHash);
    const lockFundsTransaction = TransactionUtils.lockFundTx(signedAggregateBondedTransaction)
    const lockFundsTransactionSigned = initiatorAcc.sign(lockFundsTransaction, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(lockFundsTransactionSigned,signedAggregateBondedTransaction) 
  }
}

const createDelegateTransaction = (selectedCosign :string,isMultisig :boolean,multisigAccount: WalletAccount, walletPassword: string, accPublicKey: string, delegateAction: LinkAction) :SignedTransaction=>{

  let delegateTx = delegateTransaction(accPublicKey,delegateAction)
  let signedTransaction :SignedTransaction
  if (!isMultisig){ //normal account
    const senderAddress = multisigAccount.address
    const senderAccount = getAccountDetail(senderAddress, walletPassword);
    signedTransaction = senderAccount.sign(delegateTx, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceTransaction(signedTransaction);
  }else{ //multisig account
    let multisigPublicAccount = PublicAccount.createFromPublicKey(multisigAccount.publicKey, AppState.networkType);
    let innerTx = [delegateTx.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = TransactionUtils.aggregateBondedTx(innerTx);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find(element => element.publicKey === selectedCosign)
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
    let initiatorAcc = Account.createFromPrivateKey(privateKey, AppState.networkType)
    const signedAggregateBondedTransaction =  initiatorAcc.sign(aggregateBondedTx,networkState.currentNetworkProfile.generationHash);
    
    signedTransaction = signedAggregateBondedTransaction
    const lockFundsTransaction = TransactionUtils.lockFundTx(signedAggregateBondedTransaction)
    const lockFundsTransactionSigned = initiatorAcc.sign(lockFundsTransaction, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(lockFundsTransactionSigned,signedAggregateBondedTransaction) 

  }
  
  return signedTransaction
}

const getDelegateFee = (isMultisig: boolean) :number=>{
  let txBuilder = AppState.buildTxn
  let delegateAction = LinkAction.Link
  let publicKey = '0'.repeat(64)
  const delegateTx = delegateTransaction(publicKey, delegateAction); 
  if(!isMultisig){
    return delegateTx.maxFee.compact()/Math.pow(10,AppState.nativeToken.divisibility)
  }else{
    let innerTx = [delegateTx.toAggregate(PublicAccount.createFromPublicKey(publicKey,AppState.networkType))];
    return  txBuilder.aggregateBonded(innerTx).maxFee.compact()/Math.pow(10,AppState.nativeToken.divisibility);
  }
 
}


const getValidAccount = async (address: string): Promise<boolean> => {
  let baseUrl = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort)
  const response = await fetch(`${baseUrl}/account/${address}`);
  let add = Address.createFromRawAddress(address);

  let returnResponse: boolean;
  if (response.status == 200) {
    let res = await ChainUtils.getAccountInfo(add);
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
  getNamespaceListByAddress,
  getContact,
  getMultisig,
  namespaceOption,
  getLinkNamespaceToAddressTransactionFee,
  linkNamespaceToAddress,
  createDelegateTransaction,
  getValidAccount,
  getDelegateFee
  //getAccInfo
  //getAccInfoFromPrivateKey
});