import {
  Account,
  Address,
  NamespaceId,
  PublicAccount,
  RegisterNamespaceTransaction,
  UInt64,
  MosaicId,
  AggregateTransaction,
} from "tsjs-xpx-chain-sdk";
import { walletState } from "../state/walletState";
import { networkState } from "../state/networkState";
import { WalletUtils } from "../util/walletUtils";
import { ChainAPICall } from "../models/REST/chainAPICall";
import {  listenerState } from "@/state/listenerState";
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";
import { AppState } from "@/state/appState";
import { TransactionUtils } from "./transactionUtils";
import qrcode from 'qrcode-generator';
import { bitOr } from "mathjs";
export class NamespaceUtils {

  static async getLinkedMosaic(namespaceId: NamespaceId, endpoint: string): Promise<MosaicId>{
     let rest = new ChainAPICall(endpoint);
     let mosaicId = await rest.namespaceAPI.getLinkedMosaicId(namespaceId);

     return mosaicId;
  }

  static async getLinkedAddress(namespaceId: NamespaceId, endpoint: string): Promise<Address>{
    let rest = new ChainAPICall(endpoint);
    let address = await rest.namespaceAPI.getLinkedAddress(namespaceId);

    return address;
 }

  static rootNamespaceTransaction = ( namespaceName: string, duration: number):RegisterNamespaceTransaction => {
    let buildTransactions = AppState.buildTxn;
    return buildTransactions.registerRootNamespace(namespaceName, UInt64.fromUint(NamespaceUtils.calculateDuration(duration)));
  }

  static subNamespaceTransaction = ( rootNamespace: string, subNamespace: string):RegisterNamespaceTransaction => {
    let buildTransactions = AppState.buildTxn;
    return buildTransactions.registersubNamespace(rootNamespace, subNamespace);
  }

  static getRootNamespaceTransactionFee = ( namespaceName: string) :number => {
    let registerRootNamespaceTransaction = NamespaceUtils.rootNamespaceTransaction( namespaceName, 10);
    return registerRootNamespaceTransaction.maxFee.compact();
  }

  static getSubNamespaceTransactionFee = ( subNamespace: string, rootNamespace: string) :number => {
    let registerSubNamespaceTransaction = NamespaceUtils.subNamespaceTransaction(rootNamespace, subNamespace);
    return registerSubNamespaceTransaction.maxFee.compact();
  }

  static calculateDuration = (durationInDay: number): number =>{
    let chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
    chainConfig.init();
    let blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);
    let blockTargetTimeByDay = (60 * 60 * 24) / blockTargetTime;
    // 5760 = 4 * 60 * 24 -> 15sec per block
    return Math.floor(durationInDay * blockTargetTimeByDay);
  }

  static listNamespaces = (address:string) => {
    const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address);
    const accountNamespaces = account?account.namespaces.filter(namespace => namespace.active === true):[];
    const other = walletState.currentLoggedInWallet.others.find((account) => account.address === address);
    const otherNamespaces = other ? other.namespaces.filter(namespace => namespace.active === true) : [];

    const accountNamespacesNum = accountNamespaces.length;
    const otherNamespacesNum = otherNamespaces.length;
    let namespacesArr = [];
    if((accountNamespacesNum + otherNamespacesNum) > 0){
      if(accountNamespacesNum > 0){
        accountNamespaces.forEach((namespaceElement) => {
          let blockDifference = namespaceElement.endHeight - listenerState.currentBlock;

          const level = namespaceElement.name.split('.');
          let isDisabled: boolean;
          if(level.length > 2){
            isDisabled = true;
          }else{
            isDisabled = false;
          }
          if (blockDifference > 0) {
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level
            });
          }
        });
      }

      if(otherNamespacesNum > 0){
        otherNamespaces.forEach((namespaceElement) => {
          let blockDifference = namespaceElement.endHeight - listenerState.currentBlock;

          const level = namespaceElement.name.split('.');
          let isDisabled: boolean;
          if(level.length > 2){
            isDisabled = true;
          }else{
            isDisabled = false;
          }
          if (blockDifference > 0) {
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level
            });
          }
        });
      }

      namespacesArr.sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      });
      namespacesArr.sort((a, b) => {
        if (a.level > b.level) return 1;
        if (a.level < b.level) return -1;
        return 0;
      });
    }
    return namespacesArr;
  }

  static listRootNamespaces = (address:string) => {
    const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address);
    const accountNamespaces = account?account.namespaces.filter(namespace => namespace.active === true):[];
    const other = walletState.currentLoggedInWallet.others.find((account) => account.address === address);
    const otherNamespaces = other?other.namespaces.filter(namespace => namespace.active === true):[];
    const accountNamespacesNum = accountNamespaces.length;
    const otherNamespacesNum = otherNamespaces.length;
    let namespacesArr = [];
    if((accountNamespacesNum + otherNamespacesNum) > 0){
      if(accountNamespacesNum > 0){
        accountNamespaces.forEach((namespaceElement) => {
          const level = namespaceElement.name.split('.');
          let isDisabled: boolean = false;
          if(level.length == 1){
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level
            });
          }
        });
      }

      if(otherNamespacesNum > 0){
        otherNamespaces.forEach((namespaceElement) => {
          const level = namespaceElement.name.split('.');
          let isDisabled: boolean = false;
          if(level.length == 1){
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level
            });
          }
        });
      }

      namespacesArr.sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      });
    }
    return namespacesArr;
  }

  static getCosignerList(address: string){
    const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address);
    const other = walletState.currentLoggedInWallet.others.find((account) => account.address == address);
    let multiSig = account?account.getDirectParentMultisig():[];
    let multiSigOther = other?other.getDirectParentMultisig():[];
    if(multiSig.length > 0 || multiSigOther.length > 0){
      const cosigner = walletState.currentLoggedInWallet.accounts.filter(account => {
        if(multiSig.indexOf(account.publicKey) >= 0 || multiSigOther.indexOf(account.publicKey) >= 0){
          return true;
        }
      });
      let cosignList = [];
      if(cosigner.length > 0){
        cosigner.forEach((cosign) => {
          cosignList.push({
            name: cosign.name,
            address: cosign.address,
            balance: cosign.balance,
          });
        });
      }
      return { list: cosignList };
    }else{
      return { list: [] };
    }
  }

  static getSenderAccount = (selectedAddress:string, walletPassword:string) :Account => {
    const accAddress = Address.createFromRawAddress(selectedAddress);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find((account) => account.address == accAddress.plain());
    const encryptedPassword = WalletUtils.createPassword(walletPassword);
    let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, accountDetails.encrypted, accountDetails.iv);
    const account = Account.createFromPrivateKey(privateKey, AppState.networkType);
    return account;
  }

  static createRootNamespaceQr = (isMultisig :boolean, owner :PublicAccount,namespaceName: string, duration: number) :string=>{
    let registerRootNamespaceTransaction :RegisterNamespaceTransaction | AggregateTransaction
    if(!isMultisig){
      registerRootNamespaceTransaction = NamespaceUtils.rootNamespaceTransaction(namespaceName, duration);
    }else{
      let innerTxn = registerRootNamespaceTransaction.toAggregate(owner)
      let txnBuilder = AppState.buildTxn
      registerRootNamespaceTransaction = txnBuilder.aggregateBonded([innerTxn])
    }
    const qr = qrcode(0, 'H');
    let data = {
      payload: registerRootNamespaceTransaction.serialize(),
      callbackUrl: null
    }
    qr.addData(JSON.stringify(data));
    qr.make();
    return qr.createSvgTag()
    
  }

  static createSubNamespaceQr = (isMultisig :boolean, owner :PublicAccount,rootNamespace: string, subNamespace :string) :string=>{
    let registerSubNamespaceTransaction :RegisterNamespaceTransaction | AggregateTransaction
    
    registerSubNamespaceTransaction = NamespaceUtils.subNamespaceTransaction( rootNamespace, subNamespace);
    if(isMultisig){
      let innerTxn = registerSubNamespaceTransaction.toAggregate(owner)
      let txnBuilder = AppState.buildTxn
      registerSubNamespaceTransaction = txnBuilder.aggregateBonded([innerTxn])
    }
    
    const qr = qrcode(0, 'H');
    let data = {
      payload: registerSubNamespaceTransaction.serialize(),
      callbackUrl: null
    }
    qr.addData(JSON.stringify(data));
    qr.make();
    
    return qr.createSvgTag()
    
  }

  static createRootNamespace = (selectedAddress: string, walletPassword: string,  namespaceName: string, duration: number) => {
    let registerRootNamespaceTransaction = NamespaceUtils.rootNamespaceTransaction( namespaceName, duration);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(registerRootNamespaceTransaction, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceTransaction(signedTx); 
    return signedTx.hash;
  }

  static createSubNamespace = (selectedAddress: string, walletPassword: string, subNamespace: string, rootNamespace: string) => {
    let registerSubNamespaceTransaction = NamespaceUtils.subNamespaceTransaction( rootNamespace, subNamespace);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(registerSubNamespaceTransaction, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceTransaction(signedTx);
  }

  static createRootNamespaceMultisig = (selectedAddress: string, walletPassword: string, namespaceName: string, duration: number, multiSigAddress:string) => {
    let buildTransactions = AppState.buildTxn;
    let registerRootNamespaceTransaction = NamespaceUtils.rootNamespaceTransaction(namespaceName, duration);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisSigAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress);
    const multisSigOther = walletState.currentLoggedInWallet.others.find((element) => element.address === multiSigAddress);
    const multisigPublicKey = multisSigAccount?multisSigAccount.publicKey:multisSigOther.publicKey;

    const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, AppState.networkType);
    const innerTxn = [registerRootNamespaceTransaction.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    const aggregateBondedTxSigned = account.sign(aggregateBondedTx, networkState.currentNetworkProfile.generationHash);

    let hashLockTx = TransactionUtils.lockFundTx(aggregateBondedTxSigned)
    let signedHashlock = account.sign(hashLockTx, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(signedHashlock,aggregateBondedTxSigned );
  }

  static createSubNamespaceMultisig = (selectedAddress: string, walletPassword: string, subNamespace: string, rootNamespace: string, multiSigAddress:string) => {
    let buildTransactions = AppState.buildTxn;
    let registerSubNamespaceTransaction = NamespaceUtils.subNamespaceTransaction( rootNamespace, subNamespace);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisSigAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress);
    const multisSigOther = walletState.currentLoggedInWallet.others.find((element) => element.address === multiSigAddress);
    const multisigPublicKey = multisSigAccount?multisSigAccount.publicKey:multisSigOther.publicKey;

    const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, AppState.networkType);
    const innerTxn = [registerSubNamespaceTransaction.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    const aggregateBondedTxSigned = account.sign(aggregateBondedTx, networkState.currentNetworkProfile.generationHash);

    let hashLockTx = TransactionUtils.lockFundTx(aggregateBondedTxSigned)
    let signedHashlock = account.sign(hashLockTx, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(signedHashlock,aggregateBondedTxSigned );
  }

  static extendNamespaceQr = (isMultisig :boolean, owner: PublicAccount ,namespaceName: string, duration: number )=>{
    let extendNamespaceTx :RegisterNamespaceTransaction | AggregateTransaction 
    extendNamespaceTx = NamespaceUtils.rootNamespaceTransaction( namespaceName, duration);
    if(isMultisig){
      let innerTxn = extendNamespaceTx.toAggregate(owner)
      let txnBuilder = AppState.buildTxn
      extendNamespaceTx = txnBuilder.aggregateBonded([innerTxn])
    }
    const qr = qrcode(0, 'H');
    let data = {
      payload: extendNamespaceTx.serialize(),
      callbackUrl: null
    }
    qr.addData(JSON.stringify(data));
    qr.make();
    
    return qr.createSvgTag()
  }

  static extendNamespace = (selectedAddress: string, walletPassword: string, namespaceName: string, duration: number) => {
    let extendNamespaceTx = NamespaceUtils.rootNamespaceTransaction( namespaceName, duration);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);
    let signedTx = account.sign(extendNamespaceTx, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceTransaction(signedTx);
  }

  static extendNamespaceMultisig = (selectedAddress: string, walletPassword: string, namespaceName: string, duration: number, multiSigAddress:string) => {
    let buildTransactions = AppState.buildTxn;
    let extendNamespaceTx = NamespaceUtils.rootNamespaceTransaction( namespaceName, duration);
    const account = NamespaceUtils.getSenderAccount(selectedAddress, walletPassword);

    const multisSigAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.address === multiSigAddress);
    const multisSigOther = walletState.currentLoggedInWallet.others.find((element) => element.address === multiSigAddress);
    const multisigPublicKey = multisSigAccount?multisSigAccount.publicKey:multisSigOther.publicKey;

    const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, AppState.networkType);
    const innerTxn = [extendNamespaceTx.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    const aggregateBondedTxSigned = account.sign(aggregateBondedTx, networkState.currentNetworkProfile.generationHash);

    let hashLockTx = TransactionUtils.lockFundTx(aggregateBondedTxSigned)
    let signedHashlock = account.sign(hashLockTx, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(signedHashlock,aggregateBondedTxSigned );
  }

}