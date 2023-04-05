import {
  Account,
  Address,
  NamespaceId,
  PublicAccount,
  RegisterNamespaceTransaction,
  UInt64,
  MosaicId,
} from "tsjs-xpx-chain-sdk";
import { walletState } from "../state/walletState";
import { networkState } from "../state/networkState";
import { WalletUtils } from "../util/walletUtils";
import { ChainAPICall } from "../models/REST/chainAPICall";
import { listenerState } from "@/state/listenerState";
import { ChainProfileConfig } from "@/models/stores/chainProfileConfig";
import { AppState } from "@/state/appState";
import { TransactionUtils } from "./transactionUtils";

export class NamespaceUtils {
  static async getLinkedMosaic(
    namespaceId: NamespaceId,
    endpoint: string
  ): Promise<MosaicId> {
    const rest = new ChainAPICall(endpoint);
    const mosaicId = await rest.namespaceAPI.getLinkedMosaicId(namespaceId);

    return mosaicId;
  }

  static async getLinkedAddress(
    namespaceId: NamespaceId,
    endpoint: string
  ): Promise<Address> {
    const rest = new ChainAPICall(endpoint);
    const address = await rest.namespaceAPI.getLinkedAddress(namespaceId);

    return address;
  }

  static rootNamespaceTransaction = (
    namespaceName: string,
    duration: number
  ): RegisterNamespaceTransaction => {
    if (!AppState.buildTxn) {
      throw new Error("Service unavailable");
    }
    const buildTransactions = AppState.buildTxn;
    return buildTransactions.registerRootNamespace(
      namespaceName,
      UInt64.fromUint(NamespaceUtils.calculateDuration(duration))
    );
  };

  static subNamespaceTransaction = (
    rootNamespace: string,
    subNamespace: string
  ): RegisterNamespaceTransaction => {
    if (!AppState.buildTxn) {
      throw new Error("Service unavailable");
    }
    const buildTransactions = AppState.buildTxn;
    return buildTransactions.registersubNamespace(rootNamespace, subNamespace);
  };

  static getRootNamespaceTransactionFee = (namespaceName: string): number => {
    const registerRootNamespaceTransaction =
      NamespaceUtils.rootNamespaceTransaction(namespaceName, 10);
    return registerRootNamespaceTransaction.maxFee.compact();
  };

  static getSubNamespaceTransactionFee = (
    subNamespace: string,
    rootNamespace: string
  ): number => {
    const registerSubNamespaceTransaction =
      NamespaceUtils.subNamespaceTransaction(rootNamespace, subNamespace);
    return registerSubNamespaceTransaction.maxFee.compact();
  };

  static calculateDuration = (durationInDay: number): number => {
    const chainConfig = new ChainProfileConfig(networkState.chainNetworkName);
    chainConfig.init();
    const blockTargetTime = parseInt(chainConfig.blockGenerationTargetTime);
    const blockTargetTimeByDay = (60 * 60 * 24) / blockTargetTime;
    // 5760 = 4 * 60 * 24 -> 15sec per block
    return Math.floor(durationInDay * blockTargetTimeByDay);
  };

  static listNamespaces = (
    address: string
  ): { value: string; label: string; disabled: boolean; level: string[] }[] => {
    const wallet = walletState.currentLoggedInWallet;
    if (!wallet) {
      throw new Error("Service unavailable");
    }
    const account = wallet.accounts.find(
      (account) => account.address === address
    );
    const accountNamespaces = account
      ? account.namespaces.filter((namespace) => namespace.active === true)
      : [];
    const other = wallet.others.find((account) => account.address === address);
    const otherNamespaces = other
      ? other.namespaces.filter((namespace) => namespace.active === true)
      : [];

    const accountNamespacesNum = accountNamespaces.length;
    const otherNamespacesNum = otherNamespaces.length;
    const namespacesArr: {
      value: string;
      label: string;
      disabled: boolean;
      level: string[];
    }[] = [];
    if (accountNamespacesNum + otherNamespacesNum > 0) {
      if (accountNamespacesNum > 0) {
        accountNamespaces.forEach((namespaceElement) => {
          const level = namespaceElement.name.split(".");
          let isDisabled: boolean;
          if (level.length > 2) {
            isDisabled = true;
          } else {
            isDisabled = false;
          }

          if (typeof namespaceElement.endHeight === "string") {
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level,
            });
            return;
          }
          if (!namespaceElement.endHeight) {
            throw new Error("Service unavailable");
          }
          const blockDifference =
            namespaceElement.endHeight - AppState.readBlockHeight;

          if (blockDifference > 0) {
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level,
            });
          }
        });
      }

      if (otherNamespacesNum > 0) {
        otherNamespaces.forEach((namespaceElement) => {
          const level = namespaceElement.name.split(".");
          let isDisabled: boolean;
          if (level.length > 2) {
            isDisabled = true;
          } else {
            isDisabled = false;
          }

          if (typeof namespaceElement.endHeight === "string") {
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level,
            });
            return;
          }
          if (!namespaceElement.endHeight) {
            throw new Error("Service unavailable");
          }
          const blockDifference =
            namespaceElement.endHeight - listenerState.currentBlock;

          if (blockDifference > 0) {
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level,
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
  };

  static listRootNamespaces = (
    address: string
  ): { value: string; label: string; disabled: boolean; level: string[] }[] => {
    const wallet = walletState.currentLoggedInWallet;
    if (!wallet) {
      throw new Error("Service unavailable");
    }
    const account = wallet.accounts.find(
      (account) => account.address === address
    );
    const accountNamespaces = account
      ? account.namespaces.filter((namespace) => namespace.active === true)
      : [];
    const other = wallet.others.find((account) => account.address === address);
    const otherNamespaces = other
      ? other.namespaces.filter((namespace) => namespace.active === true)
      : [];
    const accountNamespacesNum = accountNamespaces.length;
    const otherNamespacesNum = otherNamespaces.length;
    const namespacesArr: {
      value: string;
      label: string;
      disabled: boolean;
      level: string[];
    }[] = [];
    if (accountNamespacesNum + otherNamespacesNum > 0) {
      if (accountNamespacesNum > 0) {
        accountNamespaces.forEach((namespaceElement) => {
          const level = namespaceElement.name.split(".");
          const isDisabled: boolean = false;
          if (level.length == 1) {
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level,
            });
          }
        });
      }

      if (otherNamespacesNum > 0) {
        otherNamespaces.forEach((namespaceElement) => {
          const level = namespaceElement.name.split(".");
          const isDisabled: boolean = false;
          if (level.length == 1) {
            namespacesArr.push({
              value: namespaceElement.name,
              label: namespaceElement.name,
              disabled: isDisabled,
              level: level,
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
  };

  static getSenderAccount = (
    selectedAddress: string,
    walletPassword: string
  ): Account => {
    const wallet = walletState.currentLoggedInWallet;
    if (!wallet) {
      throw new Error("Service unavailable");
    }
    const accAddress = Address.createFromRawAddress(selectedAddress);
    const accountDetails = wallet.accounts.find(
      (account) => account.address == accAddress.plain()
    );
    if (!accountDetails) {
      throw new Error("Account not found");
    }
    const encryptedPassword = WalletUtils.createPassword(walletPassword);
    const privateKey = WalletUtils.decryptPrivateKey(
      encryptedPassword,
      accountDetails.encrypted,
      accountDetails.iv
    );
    const account = Account.createFromPrivateKey(
      privateKey,
      AppState.networkType
    );
    return account;
  };

  static createRootNamespace = (
    selectedAddress: string,
    walletPassword: string,
    namespaceName: string,
    duration: number
  ): void => {
    if (!networkState.currentNetworkProfile) {
      throw new Error("Service unavailable");
    }
    const registerRootNamespaceTransaction =
      NamespaceUtils.rootNamespaceTransaction(namespaceName, duration);
    const account = NamespaceUtils.getSenderAccount(
      selectedAddress,
      walletPassword
    );
    const signedTx = account.sign(
      registerRootNamespaceTransaction,
      networkState.currentNetworkProfile.generationHash
    );
    TransactionUtils.announceTransaction(signedTx);
  };

  static createSubNamespace = (
    selectedAddress: string,
    walletPassword: string,
    subNamespace: string,
    rootNamespace: string
  ): void => {
    if (!networkState.currentNetworkProfile) {
      throw new Error("Service unavailable");
    }
    const registerSubNamespaceTransaction =
      NamespaceUtils.subNamespaceTransaction(rootNamespace, subNamespace);
    const account = NamespaceUtils.getSenderAccount(
      selectedAddress,
      walletPassword
    );
    const signedTx = account.sign(
      registerSubNamespaceTransaction,
      networkState.currentNetworkProfile.generationHash
    );
    TransactionUtils.announceTransaction(signedTx);
  };

  static createRootNamespaceMultisig = (
    selectedAddress: string,
    walletPassword: string,
    namespaceName: string,
    duration: number,
    multiSigAddress: string
  ): void => {
    const wallet = walletState.currentLoggedInWallet;
    if (!wallet) {
      throw new Error("Service unavailable");
    }
    if (!AppState.buildTxn) {
      throw new Error("Service unavailable");
    }
    const buildTransactions = AppState.buildTxn;
    const registerRootNamespaceTransaction =
      NamespaceUtils.rootNamespaceTransaction(namespaceName, duration);
    const account = NamespaceUtils.getSenderAccount(
      selectedAddress,
      walletPassword
    );
    const multisigAccount = wallet.accounts.find(
      (element) => element.address === multiSigAddress
    );
    const multisigOther = wallet.others.find(
      (element) => element.address === multiSigAddress
    );
    const multisigPublicKey = multisigAccount
      ? multisigAccount.publicKey
      : multisigOther?.publicKey;
    if (!multisigPublicKey) {
      throw new Error("Account not found");
    }
    const multisigPublicAccount = PublicAccount.createFromPublicKey(
      multisigPublicKey,
      AppState.networkType
    );
    const innerTxn = [
      registerRootNamespaceTransaction.toAggregate(multisigPublicAccount),
    ];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    if (!networkState.currentNetworkProfile) {
      throw new Error("Service unavailable");
    }
    const aggregateBondedTxSigned = account.sign(
      aggregateBondedTx,
      networkState.currentNetworkProfile.generationHash
    );

    const hashLockTx = TransactionUtils.lockFundTx(aggregateBondedTxSigned);
    const signedHashlock = account.sign(
      hashLockTx,
      networkState.currentNetworkProfile.generationHash
    );
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(
      signedHashlock,
      aggregateBondedTxSigned
    );
  };

  static createSubNamespaceMultisig = (
    selectedAddress: string,
    walletPassword: string,
    subNamespace: string,
    rootNamespace: string,
    multiSigAddress: string
  ): void => {
    const wallet = walletState.currentLoggedInWallet;
    if (!wallet) {
      throw new Error("Service unavailable");
    }
    if (!AppState.buildTxn) {
      throw new Error("Service unavailable");
    }
    const buildTransactions = AppState.buildTxn;
    const registerSubNamespaceTransaction =
      NamespaceUtils.subNamespaceTransaction(rootNamespace, subNamespace);
    const account = NamespaceUtils.getSenderAccount(
      selectedAddress,
      walletPassword
    );
    const multisigAccount = wallet.accounts.find(
      (element) => element.address === multiSigAddress
    );
    const multisigOther = wallet.others.find(
      (element) => element.address === multiSigAddress
    );
    const multisigPublicKey = multisigAccount
      ? multisigAccount.publicKey
      : multisigOther?.publicKey;
    if (!multisigPublicKey) {
      throw new Error("Account not found");
    }
    const multisigPublicAccount = PublicAccount.createFromPublicKey(
      multisigPublicKey,
      AppState.networkType
    );
    const innerTxn = [
      registerSubNamespaceTransaction.toAggregate(multisigPublicAccount),
    ];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    if (!networkState.currentNetworkProfile) {
      throw new Error("Service unavailable");
    }
    const aggregateBondedTxSigned = account.sign(
      aggregateBondedTx,
      networkState.currentNetworkProfile.generationHash
    );

    const hashLockTx = TransactionUtils.lockFundTx(aggregateBondedTxSigned);
    const signedHashlock = account.sign(
      hashLockTx,
      networkState.currentNetworkProfile.generationHash
    );
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(
      signedHashlock,
      aggregateBondedTxSigned
    );
  };

  static extendNamespace = (
    selectedAddress: string,
    walletPassword: string,
    namespaceName: string,
    duration: number
  ): void => {
    if (!networkState.currentNetworkProfile) {
      throw new Error("Service unavailable");
    }
    const extendNamespaceTx = NamespaceUtils.rootNamespaceTransaction(
      namespaceName,
      duration
    );
    const account = NamespaceUtils.getSenderAccount(
      selectedAddress,
      walletPassword
    );
    const signedTx = account.sign(
      extendNamespaceTx,
      networkState.currentNetworkProfile.generationHash
    );
    TransactionUtils.announceTransaction(signedTx);
  };

  static extendNamespaceMultisig = (
    selectedAddress: string,
    walletPassword: string,
    namespaceName: string,
    duration: number,
    multiSigAddress: string
  ): void => {
    const wallet = walletState.currentLoggedInWallet;
    if (!wallet) {
      throw new Error("Service unavailable");
    }
    if (!AppState.buildTxn) {
      throw new Error("Service unavailable");
    }
    const buildTransactions = AppState.buildTxn;
    const extendNamespaceTx = NamespaceUtils.rootNamespaceTransaction(
      namespaceName,
      duration
    );
    const account = NamespaceUtils.getSenderAccount(
      selectedAddress,
      walletPassword
    );
    const multisigAccount = wallet.accounts.find(
      (element) => element.address === multiSigAddress
    );
    const multisigOther = wallet.others.find(
      (element) => element.address === multiSigAddress
    );
    const multisigPublicKey = multisigAccount
      ? multisigAccount.publicKey
      : multisigOther?.publicKey;
    if (!multisigPublicKey) {
      throw new Error("Account not found");
    }
    const multisigPublicAccount = PublicAccount.createFromPublicKey(
      multisigPublicKey,
      AppState.networkType
    );
    const innerTxn = [extendNamespaceTx.toAggregate(multisigPublicAccount)];
    const aggregateBondedTx = buildTransactions.aggregateBonded(innerTxn);
    if (!networkState.currentNetworkProfile) {
      throw new Error("Service unavailable");
    }
    const aggregateBondedTxSigned = account.sign(
      aggregateBondedTx,
      networkState.currentNetworkProfile.generationHash
    );
    const hashLockTx = TransactionUtils.lockFundTx(aggregateBondedTxSigned);
    const signedHashlock = account.sign(
      hashLockTx,
      networkState.currentNetworkProfile.generationHash
    );
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(
      signedHashlock,
      aggregateBondedTxSigned
    );
  };
}
