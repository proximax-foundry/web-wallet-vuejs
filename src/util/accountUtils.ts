import { walletState } from "@/state/walletState";
import { readonly, ref } from "vue";
import { Address, Account, SignedTransaction, TransactionHttp, PublicAccount, NamespaceId, AliasActionType} from "tsjs-xpx-chain-sdk";
import { WalletUtils } from "@/util/walletUtils";
import { ChainUtils } from "@/util/chainUtils";
import { networkState } from "@/state/networkState";
import { AutoAnnounceSignedTransaction, HashAnnounceBlock, AnnounceType, listenerState } from "@/state/listenerState";
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";
import { Helper } from "@/util/typeHelper";
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { BuildTransactions } from '@/util/buildTransactions';

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
  const isPassed = ref(false);
  const errMessage = ref('');
  if (address !== null && address !== undefined && address.length === 40) {
    if (WalletUtils.verifyNetworkAddressEqualsNetwork(currentAdd, add.toUpperCase())) {
      isPassed.value = true;
    } else {
      isPassed.value = false;
      errMessage.value = 'Recipient Address Network unsupported';
    }
  } else {
    isPassed.value = false;
  }
  return {
    isPassed, errMessage
  }
}

const checkAvailableContact = (recipient :string) :boolean=> {
  const wallet = walletState.currentLoggedInWallet;
  let isInContacts = true;
  if (wallet.contacts != undefined) {
    isInContacts = (wallet.contacts.findIndex((element) => element.address == recipient) == -1);
  }
  return (isInContacts && (wallet.accounts.findIndex((element) => element.address == recipient) == -1)) ? false : true;
}

const getNamespacesListByAddress = (address: string) => {
  let namespacelist = [];
  if (walletState.currentLoggedInWallet.others.find(account => account.address === address)) {
    namespacelist = walletState.currentLoggedInWallet.others.find(account => account.address == address).namespaces.filter(namespace => namespace.active === true);
  } else if (walletState.currentLoggedInWallet.accounts.find(account => account.address === address)){
    namespacelist = walletState.currentLoggedInWallet.accounts.find(account => account.address == address).namespaces.filter(namespace => namespace.active === true);
  } 
  return namespacelist;
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
      Label = namespaceElement.name;
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
  console.log(account);
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
};

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
    hashLockAutoAnnounceSignedTx.announceAtBlock = listenerState.currentBlock + 1;

    let autoAnnounceSignedTx = new AutoAnnounceSignedTransaction(aggregateTx);
    autoAnnounceSignedTx.hashAnnounceBlock = new HashAnnounceBlock(hashSigned.hash);
    autoAnnounceSignedTx.hashAnnounceBlock.annouceAfterBlockNum = 1;
    autoAnnounceSignedTx.type = AnnounceType.BONDED;

    ListenerStateUtils.addAutoAnnounceSignedTransaction(hashLockAutoAnnounceSignedTx);
    ListenerStateUtils.addAutoAnnounceSignedTransaction(autoAnnounceSignedTx);
}

const linkAddressToNamespace = (senderAddress: string, walletPassword: string, namespacesID: string, linkType: string, namespacesAddress: string, isCosigner: string) => {
  
  const namespaceTransaction = linkAddressToNamespaceTransaction(namespacesID, linkType, namespacesAddress);
  const senderAccount = getAccountDetail(senderAddress, walletPassword);

  if (isCosigner != null) {
    const multisigAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.address === isCosigner);
    const multisigOther = walletState.currentLoggedInWallet.others.find((element) => element.address === isCosigner);
    const multisigPublicKey = multisigAccount ? multisigAccount.publicKey : multisigOther.publicKey;
    const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, networkType);
    let innerTx = [namespaceTransaction.toAggregate(multisigPublicAccount)];
    let newBuildTx = new BuildTransactions(networkType);
    const aggreateBondedTx = newBuildTx.aggregateBonded(innerTx);
    const signaggregateBondedTxn = senderAccount.sign(aggreateBondedTx, Hash);

    let hashLockTx = newBuildTx.hashLock(
        Helper.createAsset(networkState.currentNetworkProfile.network.currency.assetId, 10000000), 
        Helper.createUint64FromNumber(200),
        signaggregateBondedTxn);
    let signedHashlock = senderAccount.sign(hashLockTx, Hash);
    multiSigAnnouce(signaggregateBondedTxn, signedHashlock);
  } else if (isCosigner == null) {
    const signTransaction = senderAccount.sign(namespaceTransaction, Hash);
    announceTransaction(signTransaction);
  }
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
  linkAddressToNamespace
});