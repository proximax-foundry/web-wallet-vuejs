import { walletState } from "@/state/walletState";
import {
  Address,
  Account,
  SignedTransaction,
  PublicAccount,
  LinkAction,
  NamespaceId,
  AliasActionType,
  Password,
  AddressAliasTransaction,
  AccountLinkTransaction,
} from "tsjs-xpx-chain-sdk";
import { WalletUtils } from "@/util/walletUtils";
import { networkState } from "@/state/networkState";
import type { WalletAccount } from "@/models/walletAccount";
import type { OtherAccount } from "@/models/otherAccount";
import type { Namespace } from "@/models/namespace";
import { AppState } from "@/state/appState";
import { TransactionUtils } from "./transactionUtils";

export class AccountUtils {
  static verifyPublicKey = async (add: string): Promise<boolean> => {
    const invalidPublicKey =
      "0000000000000000000000000000000000000000000000000000000000000000";
    return new Promise<boolean>((resolve) => {
      const accountPublicKey = WalletUtils.getAccInfo(add);
      accountPublicKey
        .then((accountinfo) => {
          if (accountinfo.publicKey === invalidPublicKey) {
            console.warn(
              `The receiver's public key is not valid for sending encrypted messages`
            );
            resolve(true);
          } else resolve(false);
        })
        .catch(() => {
          resolve(true);
        });
    });
  };

  static verifyAddress = (currentAdd: string, add: string) => {
    const address =
      add !== undefined && add !== null && add !== ""
        ? add.split("-").join("")
        : "";
    let isPassed = false;
    let errMessage = "";
    if (address !== null && address !== undefined && address.length === 40) {
      if (
        WalletUtils.verifyNetworkAddressEqualsNetwork(
          currentAdd,
          add.toUpperCase()
        )
      ) {
        isPassed = true;
      } else {
        isPassed = false;
        errMessage = "Recipient Address Network unsupported";
      }
    } else {
      isPassed = false;
    }
    return {
      isPassed,
      errMessage,
    };
  };

  static checkAvailableContact = (recipient: string): boolean => {
    const wallet = walletState.currentLoggedInWallet;
    if (!wallet) {
      throw new Error("Service unavailable");
    }
    let isInContacts = true;
    recipient = Address.createFromRawAddress(recipient).plain();
    isInContacts = wallet.contacts.find(
      (element) => element.address == recipient
    )
      ? true
      : false;
    return isInContacts ||
      wallet.accounts.find((element) => element.address === recipient) ||
      wallet.others.find((element) => element.address === recipient)
      ? true
      : false;
  };

  static getNamespaceListByAddress = (address: string): Namespace[] => {
    if (!walletState.currentLoggedInWallet) {
      throw new Error("Service unavailable");
    }
    let namespacelist: Namespace[] = [];
    const findAcc = walletState.currentLoggedInWallet.accounts.find(
      (account) => account.address === address
    );
    if (findAcc) {
      namespacelist = findAcc.namespaces.filter(
        (namespace) => namespace.active === true
      );
      return namespacelist;
    }
    const findOtherAcc = walletState.currentLoggedInWallet.others.find(
      (account) => account.address == address
    );
    if (findOtherAcc) {
      namespacelist = findOtherAcc.namespaces.filter(
        (namespace) => namespace.active === true
      );
      return namespacelist;
    }

    return namespacelist;
  };

  static getContact = () => {
    if (!walletState.currentLoggedInWallet) {
      throw new Error("Service unavailable");
    }
    const wallet = walletState.currentLoggedInWallet;
    const contact: { value: string; label: string }[] = [];
    wallet.accounts.forEach((element) => {
      const accountAddress = Address.createFromRawAddress(
        element.address
      ).pretty();
      contact.push({
        value: accountAddress,
        label: element.name + " - Internal Account ",
      });
    });

    if (wallet.contacts != undefined) {
      wallet.contacts.forEach((element) => {
        const accountAddress = Address.createFromRawAddress(
          element.address
        ).pretty();
        contact.push({
          value: accountAddress,
          label: element.name + " - Contact From Address Book",
        });
      });
    }
    return contact;
  };

  static namespaceOption = (address: string, linkOption: string) => {
    const namespace: {
      value: string;
      label: string;
      level: string;
      disabled: boolean;
    }[] = [];
    const namespacelist = this.getNamespaceListByAddress(address);
    if (namespacelist.length <= 0) {
      return namespace;
    }
    namespacelist.forEach((namespaceElement) => {
      const level = namespaceElement.name;
      let isDisabled: boolean = false;
      let linkName: string;
      let linkLabel: string;
      let Label: string = "";
      if (namespaceElement.linkedId != "") {
        isDisabled = linkOption == "Link" ? true : false;
        if (namespaceElement.linkType == 1) {
          linkName = "Asset";
          linkLabel = namespaceElement.linkedId;
          isDisabled = true;
        } else if (namespaceElement.linkType == 2) {
          linkName = "Address";
          linkLabel = Address.createFromRawAddress(
            namespaceElement.linkedId
          ).pretty();
        } else {
          linkName = "Address";
          linkLabel = Address.createFromRawAddress(
            namespaceElement.linkedId
          ).pretty();
          isDisabled = true;
        }
        Label =
          namespaceElement.name +
          " (Linked to " +
          linkName +
          ") - " +
          linkLabel;
      } else if (namespaceElement.linkedId == "") {
        isDisabled = linkOption == "Link" ? false : true;
        Label = namespaceElement.name + "(Current unused namespace)";
      }
      namespace.push({
        value: namespaceElement.name,
        label: Label,
        level: level,
        disabled: isDisabled,
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

    return namespace;
  };

  static getMultisig = (address: string) => {
    const wallet = walletState.currentLoggedInWallet;
    if (!wallet) {
      throw new Error("Service unavailable");
    }
    const account = wallet.accounts.find(
      (account) => account.address == address
    );
    const other = wallet.others.find((account) => account.address == address);
    const accountDirectParent = account
      ? account.getDirectParentMultisig()
      : [];
    const otherDirectParent = other ? other.getDirectParentMultisig() : [];
    if ((accountDirectParent.length > 0 || otherDirectParent.length) > 0) {
      return true;
    }
    return false;
  };

  static getAccountDetail = (
    senderAddress: string,
    walletPassword: string
  ): Account => {
    const wallet = walletState.currentLoggedInWallet;
    if (!wallet) {
      throw new Error("Service unavailable");
    }
    const accountAddress = Address.createFromRawAddress(senderAddress);
    const accountDetails = wallet.accounts.find(
      (account) => account.address == accountAddress.plain()
    );
    const passwordInstance = WalletUtils.createPassword(walletPassword);
    if (!accountDetails) {
      throw new Error("Account not found");
    }
    const privateKey = WalletUtils.decryptPrivateKey(
      passwordInstance,
      accountDetails.encrypted,
      accountDetails.iv
    );
    const account = Account.createFromPrivateKey(
      privateKey,
      AppState.networkType
    );
    return account;
  };

  static linkNamespaceToAddressTransaction = (
    namespaceID: string,
    linkType: string,
    namespaceAddress: string
  ): AddressAliasTransaction => {
    const transactionBuilder = AppState.buildTxn;
    if (!transactionBuilder) {
      throw new Error("Service unavailable");
    }
    const tempLinkType =
      linkType == "Link" ? AliasActionType.Link : AliasActionType.Unlink;
    const namespaceId = new NamespaceId(namespaceID);
    const linkNamespaceAdd = Address.createFromRawAddress(namespaceAddress);
    const namespaceTransaction = transactionBuilder
      .addressAliasBuilder()
      .actionType(tempLinkType)
      .namespaceId(namespaceId)
      .address(linkNamespaceAdd)
      .build();
    return namespaceTransaction;
  };

  static delegateTransaction = (
    publicKey: string,
    delegateAction: LinkAction
  ): AccountLinkTransaction => {
    const txBuilder = AppState.buildTxn;
    if (!txBuilder) {
      throw new Error("Service unavailable");
    }
    const delegateTransaction = txBuilder
      .accountLinkBuilder()
      .remoteAccountKey(publicKey)
      .linkAction(delegateAction)
      .build();
    return delegateTransaction;
  };

  static getLinkNamespaceToAddressTransactionFee = (
    isMultisig: boolean,
    namespaceAddress: string,
    namespaceId: string,
    linkType: string
  ): number => {
    const linkAddressToNamespaceTx = this.linkNamespaceToAddressTransaction(
      namespaceId,
      linkType,
      namespaceAddress
    );
    if (!AppState.buildTxn) {
      throw new Error("Service unavailable");
    }
    if (!isMultisig) {
      return linkAddressToNamespaceTx.maxFee.compact();
    } else {
      const publicKey = "0".repeat(64);
      const aggregateBondedTx = AppState.buildTxn.aggregateBonded([
        linkAddressToNamespaceTx.toAggregate(
          PublicAccount.createFromPublicKey(publicKey, AppState.networkType)
        ),
      ]);
      return aggregateBondedTx.maxFee.compact();
    }
  };

  static linkNamespaceToAddress = (
    selectedCosign: string,
    isMultisig: boolean,
    multisigAccount: WalletAccount | OtherAccount,
    walletPassword: string,
    namespaceID: string,
    linkType: string,
    namespaceAddress: string
  ): boolean => {
    if (
      !walletState.currentLoggedInWallet ||
      !networkState.currentNetworkProfile
    ) {
      throw new Error("Service unavailable");
    }
    const namespaceTransaction = this.linkNamespaceToAddressTransaction(
      namespaceID,
      linkType,
      namespaceAddress
    );
    const senderAddress = multisigAccount.address;
    const senderAccount = this.getAccountDetail(senderAddress, walletPassword);
    if (!senderAccount) {
      return false;
    }
    let signedTransaction: SignedTransaction;
    if (!isMultisig) {
      // normal account
      signedTransaction = senderAccount.sign(
        namespaceTransaction,
        networkState.currentNetworkProfile.generationHash
      );
      TransactionUtils.announceTransaction(signedTransaction);
    } else {
      //multisig account

      const multisigPublicAccount = PublicAccount.createFromPublicKey(
        multisigAccount.publicKey,
        AppState.networkType
      );
      const innerTx = [namespaceTransaction.toAggregate(multisigPublicAccount)];
      const aggregateBondedTx = TransactionUtils.aggregateBondedTx(innerTx);
      const accountDetails = walletState.currentLoggedInWallet.accounts.find(
        (element) => element.publicKey === selectedCosign
      );
      if (!accountDetails) {
        throw new Error("Account not found");
      }
      const privateKey = WalletUtils.decryptPrivateKey(
        new Password(walletPassword),
        accountDetails.encrypted,
        accountDetails.iv
      );
      const initiatorAcc = Account.createFromPrivateKey(
        privateKey,
        AppState.networkType
      );
      const signedAggregateBondedTransaction = initiatorAcc.sign(
        aggregateBondedTx,
        networkState.currentNetworkProfile.generationHash
      );
      const lockFundsTransaction = TransactionUtils.lockFundTx(
        signedAggregateBondedTransaction
      );
      const lockFundsTransactionSigned = initiatorAcc.sign(
        lockFundsTransaction,
        networkState.currentNetworkProfile.generationHash
      );
      TransactionUtils.announceLF_AND_addAutoAnnounceABT(
        lockFundsTransactionSigned,
        signedAggregateBondedTransaction
      );
    }
    return true;
  };

  static createDelegateTransaction = (
    selectedCosign: string,
    isMultisig: boolean,
    multisigAccount: WalletAccount | OtherAccount,
    walletPassword: string,
    accPublicKey: string,
    delegateAction: LinkAction
  ): boolean => {
    if (
      !walletState.currentLoggedInWallet ||
      !networkState.currentNetworkProfile
    ) {
      throw new Error("Service unavailable");
    }
    const delegateTx = this.delegateTransaction(accPublicKey, delegateAction);

    let signedTransaction: SignedTransaction;
    if (!isMultisig) {
      //normal account
      const senderAddress = multisigAccount.address;
      const senderAccount = this.getAccountDetail(
        senderAddress,
        walletPassword
      );
      if (!senderAccount) {
        return false;
      }
      signedTransaction = senderAccount.sign(
        delegateTx,
        networkState.currentNetworkProfile.generationHash
      );
      TransactionUtils.announceTransaction(signedTransaction);
      return true;
    } //multisig account
    const multisigPublicAccount = PublicAccount.createFromPublicKey(
      multisigAccount.publicKey,
      AppState.networkType
    );
    const innerTx = [delegateTx.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = TransactionUtils.aggregateBondedTx(innerTx);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find(
      (element) => element.publicKey === selectedCosign
    );
    if (!accountDetails) {
      throw new Error("Account not found");
    }
    const privateKey = WalletUtils.decryptPrivateKey(
      new Password(walletPassword),
      accountDetails.encrypted,
      accountDetails.iv
    );
    const initiatorAcc = Account.createFromPrivateKey(
      privateKey,
      AppState.networkType
    );
    const signedAggregateBondedTransaction = initiatorAcc.sign(
      aggregateBondedTx,
      networkState.currentNetworkProfile.generationHash
    );

    signedTransaction = signedAggregateBondedTransaction;
    const lockFundsTransaction = TransactionUtils.lockFundTx(
      signedAggregateBondedTransaction
    );
    const lockFundsTransactionSigned = initiatorAcc.sign(
      lockFundsTransaction,
      networkState.currentNetworkProfile.generationHash
    );
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(
      lockFundsTransactionSigned,
      signedAggregateBondedTransaction
    );
    return true;
  };

  static getDelegateFee = (isMultisig: boolean): number => {
    const txBuilder = AppState.buildTxn;
    if (!txBuilder) {
      throw new Error("Service unavailable");
    }
    const delegateAction = LinkAction.Link;
    const publicKey = "0".repeat(64);
    const delegateTx = this.delegateTransaction(publicKey, delegateAction);

    if (!isMultisig) {
      return (
        delegateTx.maxFee.compact() /
        Math.pow(10, AppState.nativeToken.divisibility)
      );
    } else {
      const innerTx = [
        delegateTx.toAggregate(
          PublicAccount.createFromPublicKey(publicKey, AppState.networkType)
        ),
      ];
      return (
        txBuilder.aggregateBonded(innerTx).maxFee.compact() /
        Math.pow(10, AppState.nativeToken.divisibility)
      );
    }
  };
}
