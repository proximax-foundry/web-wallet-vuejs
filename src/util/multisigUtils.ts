import {
  Account,
  Address,
  AggregateTransaction,
  PublicAccount,
  MultisigCosignatoryModification,
  MultisigCosignatoryModificationType,
  Password,
  MultisigAccountGraphInfo,
} from "tsjs-xpx-chain-sdk";
import { WalletUtils } from "@/util/walletUtils";
import { walletState } from '@/state/walletState'
import { networkState } from "@/state/networkState";
import { TransactionUtils } from "@/util/transactionUtils";
import type { WalletAccount } from '@/models/walletAccount';
import { AppState } from "@/state/appState";
import type { OtherAccount } from "@/models/otherAccount";
import { Helper } from "./typeHelper";

export class MultisigUtils {
  static verifyContactPublicKey(address: string): Promise<{ status: boolean, publicKey: string }> {
    const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
    return new Promise((resolve) => {
      const accountInfo = WalletUtils.getAccInfo(address);
      accountInfo.then(
        (account) => {
          if (account.publicKey == invalidPublicKey) {
            console.warn(`The receiver's public key is not valid for sending encrypted messages`);
            resolve({ status: false, publicKey: account.publicKey });
          } else {
            resolve({ status: true, publicKey: account.publicKey });
          }
        },
        (error) => {
          console.warn('Err: ' + error);
          resolve({ status: false, publicKey: "" })
        }
      );
    });
  }


  static getAggregateFee = async (publicKey: string, addedCosigners: string[], numApprove: number, numDelete: number, removeCosign?: string[]): Promise<string > => {
    const wallet = walletState.currentLoggedInWallet
  
    if (!AppState.chainAPI || !wallet) {
      throw new Error("Service unavailable")
  }
    const acc = wallet.accounts.find(acc => acc.publicKey == publicKey) || wallet.others.find(acc => acc.publicKey == publicKey)
    if (!acc) {
      throw new Error("Account not found")
    }
    const multisigCosignatory: MultisigCosignatoryModification[] = [];
    let cosignatory: PublicAccount | null = null
    for (let cosignKey of addedCosigners) {
      if (cosignKey.length == 64) {
        cosignatory = PublicAccount.createFromPublicKey(cosignKey, AppState.networkType);
      } else if (cosignKey.length == 40 || cosignKey.length == 46) {
        let address = Address.createFromRawAddress(cosignKey);

        try {
          let accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(address)
          cosignatory = PublicAccount.createFromPublicKey(accInfo.publicKey, AppState.networkType);
        } catch (error) {
          console.log(error);
        }
      }
      if (cosignatory) {
        multisigCosignatory.push(new MultisigCosignatoryModification(
          MultisigCosignatoryModificationType.Add,
          cosignatory,
        ));
      }

    }
    let cosignatories: PublicAccount[] = []
    if (removeCosign) {
      removeCosign.forEach((element, index) => {

        cosignatories[addedCosigners.length + index] = PublicAccount.createFromPublicKey(element, AppState.networkType);
        multisigCosignatory.push(new MultisigCosignatoryModification(
          MultisigCosignatoryModificationType.Remove,
          cosignatories[addedCosigners.length + index],
        ));
      });
    }
    if (!AppState.buildTxn) {
      throw new Error("Service unavailable")
    }
    let txBuilder = AppState.buildTxn

    let publicAcc = PublicAccount.createFromPublicKey(publicKey, AppState.networkType)
    const findAcc = acc.multisigInfo.find(element => element.level === 0)
    if (!findAcc) {
      throw new Error("Account not found")
    }
    let relativeNumApproveTransaction = numApprove - findAcc.minApproval;
    let relativeNumDeleteUser = numDelete - findAcc.minRemoval
    let convertIntoMultisigTransaction = txBuilder.modifyMultisigAccountBuilder()
      .minApprovalDelta(relativeNumApproveTransaction)
      .minRemovalDelta(relativeNumDeleteUser)
      .modifications(multisigCosignatory)
      .build()
    let aggregateBondedTx = txBuilder.aggregateBondedBuilder()
      .innerTransactions([convertIntoMultisigTransaction.toAggregate(publicAcc)])
      .build()
    return Helper.amountFormatterSimple(aggregateBondedTx.maxFee.compact(), AppState.nativeToken.divisibility)

  }

  /* coSign: array() */
  static async convertAccount(coSign: string[], numApproveTransaction: number, numDeleteUser: number, accountToConvertName: string, walletPassword: string): Promise<boolean> {
    const wallet = walletState.currentLoggedInWallet
    if (!wallet) {
      throw new Error("Service unavailable")
    }
    let verify = WalletUtils.verifyWalletPassword(wallet.name, networkState.chainNetworkName, walletPassword)
    if (!verify) {
      return verify;
    }

    const multisigCosignatory = [];

    const accountDetails = wallet.accounts.find(element => element.name === accountToConvertName)
    if (!accountDetails) {
      throw new Error("Account not found")
    }

    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv);
    const accountToConvert = Account.createFromPrivateKey(privateKey, AppState.networkType);
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable")
    }
    let cosignatory: PublicAccount | null = null
    for (let cosignKey of coSign) {
      if (cosignKey.length == 64) {
        cosignatory = PublicAccount.createFromPublicKey(cosignKey, AppState.networkType);
      } else if (cosignKey.length == 40 || cosignKey.length == 46) {
        let address = Address.createFromRawAddress(cosignKey);

        try {
          let accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(address)
          cosignatory = PublicAccount.createFromPublicKey(accInfo.publicKey, AppState.networkType);
        } catch (error) {
          console.log(error);
        }
      }
      if (cosignatory) {
        multisigCosignatory.push(new MultisigCosignatoryModification(
          MultisigCosignatoryModificationType.Add,
          cosignatory,
        ));
      }
    }
    if (!AppState.buildTxn) {
      throw new Error("Service unavailable")
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
    if (!networkState.currentNetworkProfile) {
      throw new Error("Service unavailable")
    }
    const signedAggregateBondedTransaction = accountToConvert.sign(aggregateBondedTransaction, networkState.currentNetworkProfile.generationHash);
    let lockFundsTransaction = TransactionUtils.lockFundTx(signedAggregateBondedTransaction)
    const lockFundsTransactionSigned = accountToConvert.sign(lockFundsTransaction, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(lockFundsTransactionSigned, signedAggregateBondedTransaction)

    return verify
  }

  static getAggregateBondedTransactions(publicAccount: PublicAccount): Promise<AggregateTransaction[]> {
    return WalletUtils.getAggregateBondedTransactions(publicAccount)
  }

  static async onPartial(publicAccount: PublicAccount): Promise<boolean> {
    const txOnPartial = await MultisigUtils.getAggregateBondedTransactions(publicAccount)
    if (txOnPartial.length) {
      for (const tx of txOnPartial) {
        for (let i = 0; i < tx.innerTransactions.length; i++) {
          if (tx.innerTransactions[i].signer.publicKey === publicAccount.publicKey) {
            return true
          }
        }
      }
    }
    return false

  }




  static getMultisigAccountGraphInfo(address: string): Promise<MultisigAccountGraphInfo> {
    return WalletUtils.getMultisigAccGraphInfo(Address.createFromRawAddress(address));
  }


  static checkIsMultiSig(accountAddress: string): boolean {
    /* let account = walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress)?walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress):  walletState.currentLoggedInWallet.others.find(element=>element.address ===accountAddress) */
    let wallet = walletState.currentLoggedInWallet
    if (!wallet) {
      throw new Error("Service unavailable")
    }
    let account: WalletAccount | OtherAccount | undefined = wallet.accounts.find(element => element.address === accountAddress) || wallet.others.find(element => element.address === accountAddress)
    if (!account) {
      throw new Error("Account not found")
    }
    return account.getDirectParentMultisig().length > 0
  }

  static checkHasMultiSig(accountAddress: string): boolean {
    /* let account = walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress)?walletState.currentLoggedInWallet.accounts.find(element=>element.address ===accountAddress):  walletState.currentLoggedInWallet.others.find(element=>element.address ===accountAddress) */
    let wallet = walletState.currentLoggedInWallet
    if (!wallet) {
      throw new Error("Service unavailable")
    }
    let account: WalletAccount | OtherAccount | undefined = wallet.accounts.find(element => element.address === accountAddress) || wallet.others.find(element => element.address === accountAddress)
    if (!account) {
      throw new Error("Account not found")
    }

    return account.multisigInfo.filter(account => account.level == -1).length > 0

  }


  static getCosignerInWallet(publicKey: string): { hasCosigner: boolean, cosignerList: string[] } {
    if (!walletState.currentLoggedInWallet) {
      throw new Error("Service unavailable")
    }
    if (!networkState.currentNetworkProfileConfig) {
      throw new Error("Service unavailable")
    }
    let accounts = walletState.currentLoggedInWallet.accounts.map(
      (acc) => {
        return {
          publicKey: acc.publicKey,
          isMultisig: acc.getDirectParentMultisig().length ? true : false,
          multisigInfo: acc.multisigInfo,
        };
      });

    let otherAccounts = walletState.currentLoggedInWallet.others.filter((acc) => acc.type === "MULTISIG").map(
      (acc) => {
        return {
          publicKey: acc.publicKey,
          isMultisig: true,
          multisigInfo: acc.multisigInfo,
        };
      });

    let totalAcc = accounts.concat(otherAccounts);
    let foundAcc = totalAcc.find(acc => acc.publicKey == publicKey)
    if (!foundAcc) {
      throw new Error("Account not found")
    }
    let allTopCosignerList: typeof totalAcc = []
    totalAcc.forEach(acc => {
      if (!acc.isMultisig && acc.multisigInfo.filter(acc => acc.level == -1).length > 0) {
        allTopCosignerList.push(acc)
      }
    })
    let multisigDepth = networkState.currentNetworkProfileConfig.maxMultisigDepth
    if (!multisigDepth) {
      throw new Error("Service unavailable")
    }
    let filteredCosignerList: string[] = []
    for (let i = 1; i <= multisigDepth; i++) {
      let multisigLevel = foundAcc.multisigInfo.filter(acc => acc.level == i)
      multisigLevel.forEach(info => {
        allTopCosignerList.forEach(acc => {
          if (acc.publicKey == info.publicKey) {
            filteredCosignerList.push(info.publicKey)
          }
        })
      })
    }
    let hasCosigner = false
    if (filteredCosignerList.length > 0) {
      hasCosigner = true
    }
    return { hasCosigner: hasCosigner, cosignerList: filteredCosignerList }
  }

  /* static enableACT (account: WalletAccount|OtherAccount, addedCosigners : string[],signersInWallet? : number) :boolean{
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

  // modify multisig
  static async modifyMultisigAccount(selectedCosign: string, coSign: string[], removeCosign: string[], numApproveTransaction: number, numDeleteUser: number, multisigAccount: WalletAccount | OtherAccount, walletPassword: string): Promise<boolean> {
    const wallet = walletState.currentLoggedInWallet
    if (!wallet) {
      throw new Error("Service unavailable")
    }
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable")
    }
    if (!WalletUtils.verifyWalletPassword(wallet.name, networkState.chainNetworkName, walletPassword)) {
      return false
    }

    const multisigCosignatory: MultisigCosignatoryModification[] = [];

    const cosignatory: PublicAccount[] = []
    for (let [index, cosignKey] of coSign.entries()) {
      if (cosignKey.length == 64) {
        cosignatory[index] = PublicAccount.createFromPublicKey(cosignKey, AppState.networkType);
      } else if (cosignKey.length == 40 || cosignKey.length == 46) {
        // option to accept address
        let address = Address.createFromRawAddress(cosignKey);
        try {
          let accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(address)
          cosignatory[index] = PublicAccount.createFromPublicKey(accInfo.publicKey, AppState.networkType);
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
    const findAcc = multisigAccount.multisigInfo.find(element => element.level === 0)
    if (!findAcc) {
      throw new Error("Account not found")
    }
    let relativeNumApproveTransaction = numApproveTransaction - findAcc.minApproval;
    let relativeNumDeleteUser = numDeleteUser - findAcc.minRemoval
    if (!AppState.buildTxn) {
      throw new Error("Service unavailable")
    }
    const txBuilder = AppState.buildTxn
    const modifyMultisigTransaction = txBuilder.modifyMultisigAccountBuilder()
      .minApprovalDelta(relativeNumApproveTransaction)
      .minRemovalDelta(relativeNumDeleteUser)
      .modifications(multisigCosignatory)
      .build()

    let publicAcc = PublicAccount.createFromPublicKey(multisigAccount.publicKey, AppState.networkType)
    let aggregateBondedTransaction = txBuilder.aggregateBondedBuilder()
      .innerTransactions([modifyMultisigTransaction.toAggregate(publicAcc)])
      .build()

    let initiator = wallet.accounts.find(acc => acc.publicKey == selectedCosign)
    if (!initiator) {
      throw new Error("Account not found")
    }
    if (!networkState.currentNetworkProfile) {
      throw new Error("Service unavailable")
    }
    let initiatorPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), initiator.encrypted, initiator.iv);
    let initiatorAccount = Account.createFromPrivateKey(initiatorPrivateKey, AppState.networkType)
    const signedAggregateBondedTransaction = initiatorAccount.sign(aggregateBondedTransaction, networkState.currentNetworkProfile.generationHash)
    const lockFundsTransaction = TransactionUtils.lockFundTx(signedAggregateBondedTransaction)
    const lockFundsTransactionSigned = initiatorAccount.sign(lockFundsTransaction, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(lockFundsTransactionSigned, signedAggregateBondedTransaction)

    return true
  }

}


