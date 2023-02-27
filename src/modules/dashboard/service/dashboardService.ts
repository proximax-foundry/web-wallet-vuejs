import {
  Address,
  Deadline,
  MosaicId,
  UInt64,
  MosaicSupplyType,
  TransferTransaction,
  PublicAccount,
  NamespaceId,
  Transaction,
  TransactionType,
  AggregateTransaction,
  AddressAliasTransaction,
  AddExchangeOfferTransaction,
  ChainConfigTransaction,
  ChainUpgradeTransaction,
  ExchangeOfferTransaction,
  RemoveExchangeOfferTransaction,
  AccountLinkTransaction,
  LockFundsTransaction,
  MosaicMetadataTransaction,
  AccountMetadataTransaction,
  NamespaceMetadataTransaction,
  AccountMosaicRestrictionModificationTransaction,
  AccountOperationRestrictionModificationTransaction,
  AccountAddressRestrictionModificationTransaction,
  ModifyMultisigAccountTransaction,
  MosaicAliasTransaction,
  MosaicDefinitionTransaction,
  MosaicSupplyChangeTransaction,
  RegisterNamespaceTransaction,
  SecretLockTransaction,
  SecretProofTransaction,
  type InnerTransaction,
  ExchangeOfferType,
  RestrictionType,
  TransactionQueryParams,
  TransactionGroupType,
  TransactionSearch,
  TransactionInfo,
  AggregateTransactionInfo,
  AddressAlias,
  MosaicAlias,
  NamespaceName,
  MosaicNames,
  MessageType,
  NamespaceType,
  LinkAction,
  MosaicInfo,
  RestrictionModificationType,
  MosaicRemoveLevyTransaction,
  MosaicModifyLevyTransaction,
  MetadataType,
  AliasActionType,
  MultisigCosignatoryModificationType,
  MetadataQueryParams,
  MetadataEntry,
  Convert,
} from "tsjs-xpx-chain-sdk";
import { HashType as myHashType } from "./../../../models/const/hashType";
import { TransactionUtils } from "../../../util/transactionUtils";
import { Helper } from "../../../util/typeHelper";
import type { Wallet } from "@/models/wallet";
import type { Account as myAccount } from "@/models/account";
import { computed } from "vue";
import {
  ConfirmedTransferTransaction,
  UnconfirmedTransferTransaction,
  PartialTransferTransaction,
  ConfirmedAggregateTransaction,
  UnconfirmedAggregateTransaction,
  PartialAggregateTransaction,
  ConfirmedAliasTransaction,
  UnconfirmedAliasTransaction,
  PartialAliasTransaction,
  ConfirmedAssetTransaction,
  UnconfirmedAssetTransaction,
  PartialAssetTransaction,
  ConfirmedChainTransaction,
  UnconfirmedChainTransaction,
  PartialChainTransaction,
  ConfirmedExchangeTransaction,
  UnconfirmedExchangeTransaction,
  PartialExchangeTransaction,
  ConfirmedLinkTransaction,
  UnconfirmedLinkTransaction,
  PartialLinkTransaction,
  ConfirmedLockTransaction,
  UnconfirmedLockTransaction,
  PartialLockTransaction,
  ConfirmedMetadataTransaction,
  UnconfirmedMetadataTransaction,
  PartialMetadataTransaction,
  ConfirmedAccountTransaction,
  UnconfirmedAccountTransaction,
  PartialAccountTransaction,
  ConfirmedNamespaceTransaction,
  UnconfirmedNamespaceTransaction,
  PartialNamespaceTransaction,
  ConfirmedRestrictionTransaction,
  UnconfirmedRestrictionTransaction,
  PartialRestrictionTransaction,
  ConfirmedSecretTransaction,
  UnconfirmedSecretTransaction,
  PartialSecretTransaction,
  ConfirmedTransaction,
  UnconfirmedTransaction,
  PartialTransaction,
  type SDA,
  type TxnExchangeOffer,
  type RestrictionModification,
  type TxnList,
  InnerAccountTransaction,
  InnerAliasTransaction,
  InnerAssetTransaction,
  InnerChainTransaction,
  InnerExchangeTransaction,
  InnerLinkTransaction,
  InnerLockTransaction,
  InnerMetadataTransaction,
  InnerNamespaceTransaction,
  InnerRestrictionTransaction,
  InnerSecretTransaction,
  InnerTransaction as MyInnerTxn,
  InnerTransferTransaction,
} from "../model/transactions/transaction";
import type { Account as MyAccount } from "../../../models/account";
import { AppState } from "@/state/appState";
import i18n from "@/i18n";

const namespaceIdFirstCharacterString = "89ABCDEF";
const nativeTokenNamespaceId = computed(() =>
  new NamespaceId(AppState.nativeToken.fullNamespace).toHex()
);

export enum MsgType {
  NONE = 0,
  GREEN = 1,
  RED = 2,
  INFO = 3,
}

export interface TxnDetails {
  type: MsgType;
  value: string | number;
  label?: string;
  short?: string;
  hover?: string;
}

export enum InnerTxnLegendType {
  NONE = 0,
  ADD_REMOVE = 1,
  TRUE_FALSE = 2,
  BUY_SELL = 3,
  ALLOW_BLOCK = 4,
}

export interface InnerTxnDetails {
  typeName: string;
  signer: string;
  signerAddressPretty: string;
  signerAddressPlain: string;
  infos: TxnDetails[];
  legendType: InnerTxnLegendType;
  sdas: string[];
}


export class DashboardService {
  wallet: Wallet;
  selectedAccount: MyAccount;
  savedAggregateTxn: AggregateTransaction[] = [];

  constructor(wallet: Wallet, selectedAccount: MyAccount) {
    this.wallet = wallet;
    this.selectedAccount = selectedAccount;
  }

  async searchTxns(
    transactionGroupType: TransactionGroupType,
    transactionQueryParams: TransactionQueryParams
  ): Promise<TransactionSearch> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const transactionSearchResult: TransactionSearch =
      await AppState.chainAPI.transactionAPI.searchTransactions(
        transactionGroupType,
        transactionQueryParams
      );

    return transactionSearchResult;
  }

  // ---------------------------TransferTransaction / Mixed Transaction---------------------------------------------------
  async formatPartialMixedTxns(
    txns: Transaction[]
  ): Promise<PartialTransferTransaction[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const formatedTxns: PartialTransferTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialTransferTransaction,
        formattedTxn
      ) as PartialTransferTransaction;

      const sdas: SDA[] = [];

      if (txns[i].type === TransactionType.TRANSFER) {
        const transferTxn = txns[i] as TransferTransaction;
        txn.message = transferTxn.message.payload;
        txn.messageType = transferTxn.message.type;

        // if(txn.messageType === MessageType.PlainMessage){
        //     let newType = this.convertToSwapType(txn.message);

        //     if(newType){
        //         txn.type = newType;
        //     }
        // }

        switch (txn.messageType) {
          case MessageType.PlainMessage:
            txn.messageTypeTitle = "Plain Message";
            break;
          case MessageType.EncryptedMessage:
            txn.messageTypeTitle = "Encrypted Message";
            break;
          case MessageType.HexadecimalMessage:
            txn.messageTypeTitle = "Hexadecimal Message";
            break;
        }

        let recipient;

        if (transferTxn.recipient instanceof NamespaceId) {
          txn.recipientNamespaceId = transferTxn.recipient.toHex();
          recipient = await DashboardService.getAddressAlias(
            transferTxn.recipient
          );
          const namespacesName = await DashboardService.getNamespacesName([
            transferTxn.recipient,
          ]);
          txn.recipientNamespaceName = namespacesName[0].name;
        } else {
          recipient = transferTxn.recipient;
        }

        txn.recipient = recipient.plain();
        if (!transferTxn.signer) {
          throw new Error("Service unavailable");
        }
        txn.sender = transferTxn.signer.address.plain();
        txn.in_out = this.selectedAccount.address === txn.sender ? false : true;

        for (let y = 0; y < transferTxn.mosaics.length; ++y) {
          const rawAmount = transferTxn.mosaics[y].amount.compact();
          const actualAmount = rawAmount;

          let assetId;
          const isSendWithNamespace = DashboardService.isNamespace(
            transferTxn.mosaics[y].id
          );

          if (isSendWithNamespace) {
            const namespaceId = new NamespaceId(
              transferTxn.mosaics[y].id.toDTO().id
            );
            assetId = await DashboardService.getAssetAlias(namespaceId);
          } else {
            assetId = transferTxn.mosaics[y].id;
          }

          const assetIdHex = assetId.toHex();

          if (
            [
              AppState.nativeToken.assetId,
              nativeTokenNamespaceId.value,
            ].includes(assetIdHex)
          ) {
            txn.amountTransfer +=
              DashboardService.convertToExactNativeAmount(actualAmount);
            continue;
          }

          const newSDA: SDA = {
            amount: rawAmount,
            divisibility: 0,
            id: assetIdHex,
            amountIsRaw: true,
            sendWithNamespace: isSendWithNamespace,
          };

          if (isSendWithNamespace) {
            const namespaceId = transferTxn.mosaics[y].id;

            newSDA.sendWithAlias = {
              idHex: namespaceId.toHex(),
              id: namespaceId.toDTO().id,
            };
          }

          sdas.push(newSDA);
        }

        const namespaceIds = sdas
          .filter((sda) => sda.sendWithNamespace)
          .map((sda) => {
            if (!sda.sendWithAlias) {
              throw new Error("Service unavailable");
            }
            return Helper.createNamespaceId(sda.sendWithAlias.id);
          });

        const allAssetId = sdas
          .filter((sda) => {
            return sda.amountIsRaw;
          })
          .map((sda) => Helper.createAssetId(sda.id));

        if (namespaceIds.length || allAssetId.length) {
          let namespacesNames: NamespaceName[] = [];
          namespacesNames =
            await AppState.chainAPI.namespaceAPI.getNamespacesName(
              namespaceIds
            );
          const assetsProperties = await AppState.chainAPI.assetAPI.getMosaics(
            allAssetId
          );
          const aliasNames: MosaicNames[] =
            await AppState.chainAPI.assetAPI.getMosaicsNames(allAssetId);

          for (let x = 0; x < sdas.length; ++x) {
            const assetProperties = assetsProperties.filter(
              (aliasName) => aliasName.mosaicId.toHex() === sdas[x].id
            )[0];

            sdas[x].divisibility = assetProperties.divisibility;
            sdas[x].amount = DashboardService.convertToExactAmount(
              sdas[x].amount,
              assetProperties.divisibility
            );
            sdas[x].amountIsRaw = false;

            const mosaicNames: MosaicNames = aliasNames.filter(
              (aliaName) => aliaName.mosaicId.toHex() === sdas[x].id
            )[0];
            const currentAliasNames: NamespaceName[] = mosaicNames.names;
            sdas[x].currentAlias = currentAliasNames.map((currentAlias) => {
              return {
                name: currentAlias.name,
                id: currentAlias.namespaceId.toDTO().id,
                idHex: currentAlias.namespaceId.toHex(),
              };
            });
            const { sendWithAlias } = sdas[x];
            if (sendWithAlias) {
              sendWithAlias.name = namespacesNames
                .filter(
                  (nsName) => nsName.namespaceId.toHex() === sendWithAlias.idHex
                )
                .map((nsName) => nsName.name)[0];
            }
          }
        }
      }
      txn.sda = sdas;
      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatUnconfirmedMixedTxns(
    txns: Transaction[]
  ): Promise<UnconfirmedTransferTransaction[]> {
    const formatedTxns: UnconfirmedTransferTransaction[] = [];
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedTransferTransaction,
        formattedTxn
      ) as UnconfirmedTransferTransaction;

      const sdas: SDA[] = [];

      if (txns[i].type === TransactionType.TRANSFER) {
        const transferTxn = txns[i] as TransferTransaction;
        txn.message = transferTxn.message.payload;
        txn.messageType = transferTxn.message.type;

        if (txn.messageType === MessageType.PlainMessage) {
          const newType = this.convertToSwapType(txn.message);

          if (newType) {
            txn.type = newType;
          }
        }

        switch (txn.messageType) {
          case MessageType.PlainMessage:
            txn.messageTypeTitle = "Plain Message";
            break;
          case MessageType.EncryptedMessage:
            txn.messageTypeTitle = "Encrypted Message";
            break;
          case MessageType.HexadecimalMessage:
            txn.messageTypeTitle = "Hexadecimal Message";
            break;
        }

        let recipient;

        if (transferTxn.recipient instanceof NamespaceId) {
          txn.recipientNamespaceId = transferTxn.recipient.toHex();
          recipient = await DashboardService.getAddressAlias(
            transferTxn.recipient
          );
          const namespacesName = await DashboardService.getNamespacesName([
            transferTxn.recipient,
          ]);
          txn.recipientNamespaceName = namespacesName[0].name;
        } else {
          recipient = transferTxn.recipient;
        }

        txn.recipient = recipient.plain();
        if (!transferTxn.signer) {
          throw new Error("Service unavailable");
        }
        txn.sender = transferTxn.signer.address.plain();
        txn.in_out = this.selectedAccount.address === txn.sender ? false : true;

        for (let y = 0; y < transferTxn.mosaics.length; ++y) {
          const rawAmount = transferTxn.mosaics[y].amount.compact();
          const actualAmount = rawAmount;

          let assetId;
          const isSendWithNamespace = DashboardService.isNamespace(
            transferTxn.mosaics[y].id
          );

          if (isSendWithNamespace) {
            const namespaceId = new NamespaceId(
              transferTxn.mosaics[y].id.toDTO().id
            );
            assetId = await DashboardService.getAssetAlias(namespaceId);
          } else {
            assetId = transferTxn.mosaics[y].id;
          }

          const assetIdHex = assetId.toHex();

          if (
            [
              AppState.nativeToken.assetId,
              nativeTokenNamespaceId.value,
            ].includes(assetIdHex)
          ) {
            txn.amountTransfer +=
              DashboardService.convertToExactNativeAmount(actualAmount);
            continue;
          }

          const newSDA: SDA = {
            amount: rawAmount,
            divisibility: 0,
            id: assetIdHex,
            amountIsRaw: true,
            sendWithNamespace: isSendWithNamespace,
          };

          if (isSendWithNamespace) {
            const namespaceId = transferTxn.mosaics[y].id;

            newSDA.sendWithAlias = {
              idHex: namespaceId.toHex(),
              id: namespaceId.toDTO().id,
            };
          }

          sdas.push(newSDA);
        }

        const namespaceIds = sdas
          .filter((sda) => sda.sendWithNamespace)
          .map((sda) => {
            if (!sda.sendWithAlias) {
              throw new Error("Service unavailable");
            }
            return Helper.createNamespaceId(sda.sendWithAlias.id);
          });

        const allAssetId = sdas
          .filter((sda) => {
            return sda.amountIsRaw;
          })
          .map((sda) => Helper.createAssetId(sda.id));

        if (namespaceIds.length || allAssetId.length) {
          let namespacesNames: NamespaceName[] = [];
          namespacesNames =
            await AppState.chainAPI.namespaceAPI.getNamespacesName(
              namespaceIds
            );
          const assetsProperties = await AppState.chainAPI.assetAPI.getMosaics(
            allAssetId
          );
          const aliasNames: MosaicNames[] =
            await AppState.chainAPI.assetAPI.getMosaicsNames(allAssetId);

          for (let x = 0; x < sdas.length; ++x) {
            const assetProperties = assetsProperties.filter(
              (aliasName) => aliasName.mosaicId.toHex() === sdas[x].id
            )[0];

            sdas[x].divisibility = assetProperties.divisibility;
            sdas[x].amount = DashboardService.convertToExactAmount(
              sdas[x].amount,
              assetProperties.divisibility
            );
            sdas[x].amountIsRaw = false;

            const mosaicNames: MosaicNames = aliasNames.filter(
              (aliaName) => aliaName.mosaicId.toHex() === sdas[x].id
            )[0];
            const currentAliasNames: NamespaceName[] = mosaicNames.names;
            sdas[x].currentAlias = currentAliasNames.map((currentAlias) => {
              return {
                name: currentAlias.name,
                id: currentAlias.namespaceId.toDTO().id,
                idHex: currentAlias.namespaceId.toHex(),
              };
            });
            const { sendWithAlias } = sdas[x];
            if (sendWithAlias) {
              sendWithAlias.name = namespacesNames
                .filter(
                  (nsName) => nsName.namespaceId.toHex() === sendWithAlias.idHex
                )
                .map((nsName) => nsName.name)[0];
            }
          }
        }
      }
      txn.sda = sdas;
      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedMixedTxns(
    txns: Transaction[]
  ): Promise<ConfirmedTransferTransaction[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const formatedTxns: ConfirmedTransferTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedTransferTransaction,
        formattedTxn
      ) as ConfirmedTransferTransaction;

      const sdas: SDA[] = [];

      if (txns[i].type === TransactionType.TRANSFER) {
        const transferTxn = txns[i] as TransferTransaction;
        txn.message = transferTxn.message.payload;
        txn.messageType = transferTxn.message.type;

        if (txn.messageType === MessageType.PlainMessage) {
          const newType = this.convertToSwapType(txn.message);

          if (newType) {
            txn.type = newType;
          }
        }
        switch (txn.messageType) {
          case MessageType.PlainMessage:
            txn.messageTypeTitle = "Plain Message";
            break;
          case MessageType.EncryptedMessage:
            txn.messageTypeTitle = "Encrypted Message";
            break;
          case MessageType.HexadecimalMessage:
            txn.messageTypeTitle = "Hexadecimal Message";
            break;
        }

        if (transferTxn.recipient instanceof NamespaceId) {
          txn.recipientNamespaceId = transferTxn.recipient.toHex();
          const namespacesName = await DashboardService.getNamespacesName([
            transferTxn.recipient,
          ]);
          txn.recipientNamespaceName = namespacesName[0].name;
        }

        const recipient = await DashboardService.getRecipient(
          transferTxn,
          txn.block
        );
        if (!recipient) {
          throw new Error("Service unavailable");
        }
        txn.recipient = recipient.plain();
        if (!transferTxn.signer) {
          throw new Error("Service unavailable");
        }
        txn.sender = transferTxn.signer.address.plain();
        txn.in_out = this.selectedAccount.address === txn.sender ? false : true;

        for (let y = 0; y < transferTxn.mosaics.length; ++y) {
          const rawAmount = transferTxn.mosaics[y].amount.compact();
          const actualAmount = rawAmount;
          const isSendWithNamespace = DashboardService.isNamespace(
            transferTxn.mosaics[y].id
          );
          const assetId = await DashboardService.getResolvedAsset(
            transferTxn.mosaics[y].id,
            txn.block
          );
          if (!assetId) {
            throw new Error("Service unavailable");
          }
          const assetIdHex = assetId.toHex();

          if (
            [
              AppState.nativeToken.assetId,
              nativeTokenNamespaceId.value,
            ].includes(assetIdHex)
          ) {
            txn.amountTransfer +=
              DashboardService.convertToExactNativeAmount(actualAmount);
            continue;
          }

          const newSDA: SDA = {
            amount: rawAmount,
            divisibility: 0,
            id: assetIdHex,
            amountIsRaw: true,
            sendWithNamespace: isSendWithNamespace,
          };

          if (isSendWithNamespace) {
            const namespaceId = transferTxn.mosaics[y].id;

            newSDA.sendWithAlias = {
              idHex: namespaceId.toHex(),
              id: namespaceId.toDTO().id,
            };
          }

          sdas.push(newSDA);
        }

        const namespaceIds = sdas
          .filter((sda) => sda.sendWithNamespace)
          .map((sda) => {
            if (!sda.sendWithAlias) {
              throw new Error("Service unavailable");
            }
            return Helper.createNamespaceId(sda.sendWithAlias.id);
          });

        const allAssetId = sdas
          .filter((sda) => {
            return sda.amountIsRaw;
          })
          .map((sda) => Helper.createAssetId(sda.id));

        if (namespaceIds.length || allAssetId.length) {
          let namespacesNames: NamespaceName[] = [];
          namespacesNames =
            await AppState.chainAPI.namespaceAPI.getNamespacesName(
              namespaceIds
            );
          const assetsProperties = await AppState.chainAPI.assetAPI.getMosaics(
            allAssetId
          );
          const aliasNames: MosaicNames[] =
            await AppState.chainAPI.assetAPI.getMosaicsNames(allAssetId);

          for (let x = 0; x < sdas.length; ++x) {
            const assetProperties = assetsProperties.filter(
              (aliasName) => aliasName.mosaicId.toHex() === sdas[x].id
            )[0];

            sdas[x].divisibility = assetProperties.divisibility;
            sdas[x].amount = DashboardService.convertToExactAmount(
              sdas[x].amount,
              assetProperties.divisibility
            );
            sdas[x].amountIsRaw = false;

            const mosaicNames: MosaicNames = aliasNames.filter(
              (aliaName) => aliaName.mosaicId.toHex() === sdas[x].id
            )[0];
            const currentAliasNames: NamespaceName[] = mosaicNames.names;
            sdas[x].currentAlias = currentAliasNames.map((currentAlias) => {
              return {
                name: currentAlias.name,
                id: currentAlias.namespaceId.toDTO().id,
                idHex: currentAlias.namespaceId.toHex(),
              };
            });
            const { sendWithAlias } = sdas[x];
            if (sendWithAlias) {
              sendWithAlias.name = namespacesNames
                .filter(
                  (nsName) => nsName.namespaceId.toHex() === sendWithAlias.idHex
                )
                .map((nsName) => nsName.name)[0];
            }
          }
        }
      }
      txn.sda = sdas;
      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //----------Account Transaction----------------------------------------------------------
  async formatUnconfirmedAccountTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedAccountTransaction[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const formatedTxns: UnconfirmedAccountTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedAccountTransaction,
        formattedTxn
      ) as UnconfirmedAccountTransaction;

      if (txns[i].type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {
        const modifyMultisigTxn = txns[i] as ModifyMultisigAccountTransaction;

        txn.approvalDelta = modifyMultisigTxn.minApprovalDelta;
        txn.removalDelta = modifyMultisigTxn.minRemovalDelta;
        txn.addedCosigner = modifyMultisigTxn.modifications
          .filter((x) => x.type === MultisigCosignatoryModificationType.Add)
          .map((x) => x.cosignatoryPublicAccount.publicKey);
        txn.removedCosigner = modifyMultisigTxn.modifications
          .filter((x) => x.type === MultisigCosignatoryModificationType.Remove)
          .map((x) => x.cosignatoryPublicAccount.publicKey);

        try {
          if (!modifyMultisigTxn.signer) {
            throw new Error("Service unavailable");
          }
          const multisigInfo =
            await AppState.chainAPI.accountAPI.getMultisigAccountInfo(
              modifyMultisigTxn.signer.address
            );

          if (multisigInfo) {
            txn.oldApprovalNumber = multisigInfo.minApproval;
            txn.oldRemovalNumber = multisigInfo.minRemoval;
          }
        } catch (error) {
          txn.oldApprovalNumber = 0;
          txn.oldRemovalNumber = 0;
        }
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedAccountTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedAccountTransaction[]> {
    const formatedTxns: ConfirmedAccountTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedAccountTransaction,
        formattedTxn
      ) as ConfirmedAccountTransaction;

      if (txns[i].type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {
        const modifyMultisigTxn = txns[i] as ModifyMultisigAccountTransaction;

        txn.approvalDelta = modifyMultisigTxn.minApprovalDelta;
        txn.removalDelta = modifyMultisigTxn.minRemovalDelta;
        txn.addedCosigner = modifyMultisigTxn.modifications
          .filter((x) => x.type === MultisigCosignatoryModificationType.Add)
          .map((x) => x.cosignatoryPublicAccount.publicKey);
        txn.removedCosigner = modifyMultisigTxn.modifications
          .filter((x) => x.type === MultisigCosignatoryModificationType.Remove)
          .map((x) => x.cosignatoryPublicAccount.publicKey);
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialAccountTransaction(
    txns: Transaction[]
  ): Promise<PartialAccountTransaction[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const formatedTxns: PartialAccountTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialAccountTransaction,
        formattedTxn
      ) as PartialAccountTransaction;

      if (txns[i].type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {
        const modifyMultisigTxn = txns[i] as ModifyMultisigAccountTransaction;

        txn.approvalDelta = modifyMultisigTxn.minApprovalDelta;
        txn.removalDelta = modifyMultisigTxn.minRemovalDelta;
        txn.addedCosigner = modifyMultisigTxn.modifications
          .filter((x) => x.type === MultisigCosignatoryModificationType.Add)
          .map((x) => x.cosignatoryPublicAccount.publicKey);
        txn.removedCosigner = modifyMultisigTxn.modifications
          .filter((x) => x.type === MultisigCosignatoryModificationType.Remove)
          .map((x) => x.cosignatoryPublicAccount.publicKey);

        try {
          if (!modifyMultisigTxn.signer) {
            throw new Error("Service unavailable");
          }
          const multisigInfo =
            await AppState.chainAPI.accountAPI.getMultisigAccountInfo(
              modifyMultisigTxn.signer.address
            );

          if (multisigInfo) {
            txn.oldApprovalNumber = multisigInfo.minApproval;
            txn.oldRemovalNumber = multisigInfo.minRemoval;
          }
        } catch (error) {
          txn.oldApprovalNumber = 0;
          txn.oldRemovalNumber = 0;
        }
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //------------------Alias Transaction--------------------------------------------------------------------
  async formatUnconfirmedAliasTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedAliasTransaction[]> {
    const formatedTxns: UnconfirmedAliasTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedAliasTransaction,
        formattedTxn
      ) as UnconfirmedAliasTransaction;

      if (txns[i].type === TransactionType.ADDRESS_ALIAS) {
        const addressAliasTxn = txns[i] as AddressAliasTransaction;

        txn.address = addressAliasTxn.address.plain();
        txn.aliasType = addressAliasTxn.actionType;
        txn.aliasTypeName =
          addressAliasTxn.actionType === AliasActionType.Link
            ? "Link"
            : "Unlink";

        const nsId = addressAliasTxn.namespaceId;

        try {
          const nsName = await DashboardService.getNamespacesName([nsId]);

          txn.aliasName = nsName[0].name;
        } catch (error) {}
      } else if (txns[i].type === TransactionType.MOSAIC_ALIAS) {
        const assetAliasTxn = txns[i] as MosaicAliasTransaction;

        txn.assetId = assetAliasTxn.mosaicId.toHex();
        txn.aliasType = assetAliasTxn.actionType;
        txn.aliasTypeName =
          assetAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";

        const nsId = assetAliasTxn.namespaceId;

        try {
          const nsName = await DashboardService.getNamespacesName([nsId]);

          txn.aliasName = nsName[0].name;
        } catch (error) {}
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedAliasTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedAliasTransaction[]> {
    const formatedTxns: ConfirmedAliasTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedAliasTransaction,
        formattedTxn
      ) as ConfirmedAliasTransaction;

      if (txns[i].type === TransactionType.ADDRESS_ALIAS) {
        const addressAliasTxn = txns[i] as AddressAliasTransaction;

        txn.address = addressAliasTxn.address.plain();
        txn.aliasType = addressAliasTxn.actionType;
        txn.aliasTypeName =
          addressAliasTxn.actionType === AliasActionType.Link
            ? "Link"
            : "Unlink";

        const nsId = addressAliasTxn.namespaceId;

        try {
          const nsName = await DashboardService.getNamespacesName([nsId]);

          txn.aliasName = nsName[0].name;
        } catch (error) {}
      } else if (txns[i].type === TransactionType.MOSAIC_ALIAS) {
        const assetAliasTxn = txns[i] as MosaicAliasTransaction;

        txn.assetId = assetAliasTxn.mosaicId.toHex();
        txn.aliasType = assetAliasTxn.actionType;
        txn.aliasTypeName =
          assetAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";

        const nsId = assetAliasTxn.namespaceId;

        try {
          const nsName = await DashboardService.getNamespacesName([nsId]);

          txn.aliasName = nsName[0].name;
        } catch (error) {}
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialAliasTransaction(
    txns: Transaction[]
  ): Promise<PartialAliasTransaction[]> {
    const formatedTxns: PartialAliasTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialAliasTransaction,
        formattedTxn
      ) as PartialAliasTransaction;

      if (txns[i].type === TransactionType.ADDRESS_ALIAS) {
        const addressAliasTxn = txns[i] as AddressAliasTransaction;

        txn.address = addressAliasTxn.address.plain();
        txn.aliasType = addressAliasTxn.actionType;
        txn.aliasTypeName =
          addressAliasTxn.actionType === AliasActionType.Link
            ? "Link"
            : "Unlink";

        const nsId = addressAliasTxn.namespaceId;

        try {
          const nsName = await DashboardService.getNamespacesName([nsId]);

          txn.aliasName = nsName[0].name;
        } catch (error) {}
      } else if (txns[i].type === TransactionType.MOSAIC_ALIAS) {
        const assetAliasTxn = txns[i] as MosaicAliasTransaction;

        txn.assetId = assetAliasTxn.mosaicId.toHex();
        txn.aliasType = assetAliasTxn.actionType;
        txn.aliasTypeName =
          assetAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";

        const nsId = assetAliasTxn.namespaceId;

        try {
          const nsName = await DashboardService.getNamespacesName([nsId]);

          txn.aliasName = nsName[0].name;
        } catch (error) {}
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //-------------Metadata Txn-----------------------------------------------------------
  async formatUnconfirmedMetadataTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedMetadataTransaction[]> {
    const formatedTxns: UnconfirmedMetadataTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedMetadataTransaction,
        formattedTxn
      ) as UnconfirmedMetadataTransaction;

      if (txns[i].type === TransactionType.MOSAIC_METADATA_V2) {
        const assetMetadataTxn = txns[i] as MosaicMetadataTransaction;

        const assetId = assetMetadataTxn.targetMosaicId.toHex();

        txn.metadataType = MetadataType.MOSAIC;
        txn.metadataTypeName = "Asset";
        txn.scopedMetadataKey = assetMetadataTxn.scopedMetadataKey.toHex();
        txn.targetId = assetId;
        txn.targetPublicKey = assetMetadataTxn.targetPublicKey.publicKey;
        txn.sizeChanged = assetMetadataTxn.valueSizeDelta;
        txn.valueChange = Convert.uint8ToHex(assetMetadataTxn.valueDifferences);

        try {
          const assetName = await DashboardService.getAssetName(assetId);

          if (assetName.names.length) {
            txn.targetIdName = assetName.names[0].name;
          }

          const assetMetadataEntry = await DashboardService.getAssetMetadata(
            assetMetadataTxn.targetMosaicId,
            assetMetadataTxn.scopedMetadataKey
          );

          if (assetMetadataEntry) {
            txn.oldValue = assetMetadataEntry.value;
            txn.newValue = DashboardService.applyValueChange(
              txn.oldValue,
              txn.valueChange,
              txn.sizeChanged
            );
          } else {
            txn.newValue = DashboardService.applyValueChange(
              "",
              txn.valueChange,
              txn.sizeChanged
            );
          }
        } catch (error) {}
      } else if (txns[i].type === TransactionType.NAMESPACE_METADATA_V2) {
        const namespaceMetadataTxn = txns[i] as NamespaceMetadataTransaction;

        const nsId = namespaceMetadataTxn.targetNamespaceId.toHex();

        txn.metadataType = MetadataType.NAMESPACE;
        txn.metadataTypeName = "Namespace";
        txn.scopedMetadataKey = namespaceMetadataTxn.scopedMetadataKey.toHex();
        txn.targetId = nsId;
        txn.targetPublicKey = namespaceMetadataTxn.targetPublicKey.publicKey;
        txn.sizeChanged = namespaceMetadataTxn.valueSizeDelta;
        txn.valueChange = Convert.uint8ToHex(
          namespaceMetadataTxn.valueDifferences
        );

        try {
          const nsName = await DashboardService.getNamespacesName([
            NamespaceId.createFromEncoded(nsId),
          ]);

          if (nsName.length) {
            txn.targetIdName = nsName[0].name;
          }

          const nsMetadataEntry = await DashboardService.getNamespaceMetadata(
            namespaceMetadataTxn.targetNamespaceId,
            namespaceMetadataTxn.scopedMetadataKey
          );

          if (nsMetadataEntry) {
            txn.oldValue = nsMetadataEntry.value;
            txn.newValue = DashboardService.applyValueChange(
              txn.oldValue,
              txn.valueChange,
              txn.sizeChanged
            );
          } else {
            txn.newValue = DashboardService.applyValueChange(
              "",
              txn.valueChange,
              txn.sizeChanged
            );
          }
        } catch (error) {}
      } else if (txns[i].type === TransactionType.ACCOUNT_METADATA_V2) {
        const accountMetadataTxn = txns[i] as AccountMetadataTransaction;

        txn.metadataType = MetadataType.ACCOUNT;
        txn.metadataTypeName = "Account";

        txn.scopedMetadataKey = accountMetadataTxn.scopedMetadataKey.toHex();
        txn.targetPublicKey = accountMetadataTxn.targetPublicKey.publicKey;
        txn.sizeChanged = accountMetadataTxn.valueSizeDelta;
        txn.valueChange = Convert.uint8ToHex(
          accountMetadataTxn.valueDifferences
        );

        try {
          const nsMetadataEntry = await DashboardService.getAccountMetadata(
            accountMetadataTxn.targetPublicKey,
            accountMetadataTxn.scopedMetadataKey
          );

          if (nsMetadataEntry) {
            txn.oldValue = nsMetadataEntry.value;
            txn.newValue = DashboardService.applyValueChange(
              txn.oldValue,
              txn.valueChange,
              txn.sizeChanged
            );
          } else {
            txn.newValue = DashboardService.applyValueChange(
              "",
              txn.valueChange,
              txn.sizeChanged
            );
          }
        } catch (error) {}
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedMetadataTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedMetadataTransaction[]> {
    const formatedTxns: ConfirmedMetadataTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedMetadataTransaction,
        formattedTxn
      ) as ConfirmedMetadataTransaction;

      if (txns[i].type === TransactionType.MOSAIC_METADATA_V2) {
        const assetMetadataTxn = txns[i] as MosaicMetadataTransaction;

        const assetId = assetMetadataTxn.targetMosaicId.toHex();

        txn.metadataType = MetadataType.MOSAIC;
        txn.metadataTypeName = "Asset";
        txn.scopedMetadataKey = assetMetadataTxn.scopedMetadataKey.toHex();
        txn.targetId = assetId;
        txn.targetPublicKey = assetMetadataTxn.targetPublicKey.publicKey;
        txn.sizeChanged = assetMetadataTxn.valueSizeDelta;

        try {
          const assetName = await DashboardService.getAssetName(assetId);

          if (assetName.names.length) {
            txn.targetIdName = assetName.names[0].name;
          }
        } catch (error) {}
      } else if (txns[i].type === TransactionType.NAMESPACE_METADATA_V2) {
        const namespaceMetadataTxn = txns[i] as NamespaceMetadataTransaction;

        const nsId = namespaceMetadataTxn.targetNamespaceId.toHex();

        txn.metadataType = MetadataType.NAMESPACE;
        txn.metadataTypeName = "Namespace";
        txn.scopedMetadataKey = namespaceMetadataTxn.scopedMetadataKey.toHex();
        txn.targetId = nsId;
        txn.targetPublicKey = namespaceMetadataTxn.targetPublicKey.publicKey;
        txn.sizeChanged = namespaceMetadataTxn.valueSizeDelta;

        try {
          const nsName = await DashboardService.getNamespacesName([
            NamespaceId.createFromEncoded(nsId),
          ]);

          if (nsName.length) {
            txn.targetIdName = nsName[0].name;
          }
        } catch (error) {}
      } else if (txns[i].type === TransactionType.ACCOUNT_METADATA_V2) {
        const accountMetadataTxn = txns[i] as AccountMetadataTransaction;

        txn.metadataType = MetadataType.ACCOUNT;
        txn.metadataTypeName = "Account";

        txn.scopedMetadataKey = accountMetadataTxn.scopedMetadataKey.toHex();
        txn.targetPublicKey = accountMetadataTxn.targetPublicKey.publicKey;
        txn.sizeChanged = accountMetadataTxn.valueSizeDelta;
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialMetadataTransaction(
    txns: Transaction[]
  ): Promise<PartialMetadataTransaction[]> {
    const formatedTxns: PartialMetadataTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialMetadataTransaction,
        formattedTxn
      ) as PartialMetadataTransaction;

      if (txns[i].type === TransactionType.MOSAIC_METADATA_V2) {
        const assetMetadataTxn = txns[i] as MosaicMetadataTransaction;

        const assetId = assetMetadataTxn.targetMosaicId.toHex();

        txn.metadataType = MetadataType.MOSAIC;
        txn.metadataTypeName = "Asset";
        txn.scopedMetadataKey = assetMetadataTxn.scopedMetadataKey.toHex();
        txn.targetId = assetId;
        txn.targetPublicKey = assetMetadataTxn.targetPublicKey.publicKey;
        txn.sizeChanged = assetMetadataTxn.valueSizeDelta;
        txn.valueChange = Convert.uint8ToHex(assetMetadataTxn.valueDifferences);

        try {
          const assetName = await DashboardService.getAssetName(assetId);

          if (assetName.names.length) {
            txn.targetIdName = assetName.names[0].name;
          }

          const assetMetadataEntry = await DashboardService.getAssetMetadata(
            assetMetadataTxn.targetMosaicId,
            assetMetadataTxn.scopedMetadataKey
          );

          if (assetMetadataEntry) {
            txn.oldValue = assetMetadataEntry.value;
            txn.newValue = DashboardService.applyValueChange(
              txn.oldValue,
              txn.valueChange,
              txn.sizeChanged
            );
          } else {
            txn.newValue = DashboardService.applyValueChange(
              "",
              txn.valueChange,
              txn.sizeChanged
            );
          }
        } catch (error) {}
      } else if (txns[i].type === TransactionType.NAMESPACE_METADATA_V2) {
        const namespaceMetadataTxn = txns[i] as NamespaceMetadataTransaction;

        const nsId = namespaceMetadataTxn.targetNamespaceId.toHex();

        txn.metadataType = MetadataType.NAMESPACE;
        txn.metadataTypeName = "Namespace";
        txn.scopedMetadataKey = namespaceMetadataTxn.scopedMetadataKey.toHex();
        txn.targetId = nsId;
        txn.targetPublicKey = namespaceMetadataTxn.targetPublicKey.publicKey;
        txn.sizeChanged = namespaceMetadataTxn.valueSizeDelta;
        txn.valueChange = Convert.uint8ToHex(
          namespaceMetadataTxn.valueDifferences
        );

        try {
          const nsName = await DashboardService.getNamespacesName([
            NamespaceId.createFromEncoded(nsId),
          ]);

          if (nsName.length) {
            txn.targetIdName = nsName[0].name;
          }

          const nsMetadataEntry = await DashboardService.getNamespaceMetadata(
            namespaceMetadataTxn.targetNamespaceId,
            namespaceMetadataTxn.scopedMetadataKey
          );

          if (nsMetadataEntry) {
            txn.oldValue = nsMetadataEntry.value;
            txn.newValue = DashboardService.applyValueChange(
              txn.oldValue,
              txn.valueChange,
              txn.sizeChanged
            );
          } else {
            txn.newValue = DashboardService.applyValueChange(
              "",
              txn.valueChange,
              txn.sizeChanged
            );
          }
        } catch (error) {}
      } else if (txns[i].type === TransactionType.ACCOUNT_METADATA_V2) {
        const accountMetadataTxn = txns[i] as AccountMetadataTransaction;

        txn.metadataType = MetadataType.ACCOUNT;
        txn.metadataTypeName = "Account";

        txn.scopedMetadataKey = accountMetadataTxn.scopedMetadataKey.toHex();
        txn.targetPublicKey = accountMetadataTxn.targetPublicKey.publicKey;
        txn.sizeChanged = accountMetadataTxn.valueSizeDelta;
        txn.valueChange = Convert.uint8ToHex(
          accountMetadataTxn.valueDifferences
        );

        try {
          const nsMetadataEntry = await DashboardService.getAccountMetadata(
            accountMetadataTxn.targetPublicKey,
            accountMetadataTxn.scopedMetadataKey
          );

          if (nsMetadataEntry) {
            txn.oldValue = nsMetadataEntry.value;
            txn.newValue = DashboardService.applyValueChange(
              txn.oldValue,
              txn.valueChange,
              txn.sizeChanged
            );
          } else {
            txn.newValue = DashboardService.applyValueChange(
              "",
              txn.valueChange,
              txn.sizeChanged
            );
          }
        } catch (error) {}
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //-------------Aggregate Txn-----------------------------------------------------------
  async formatUnconfirmedAggregateTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedAggregateTransaction[]> {
    const formatedTxns: UnconfirmedAggregateTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedAggregateTransaction,
        formattedTxn
      ) as UnconfirmedAggregateTransaction;

      if (
        txns[i].type === TransactionType.AGGREGATE_BONDED ||
        txns[i].type === TransactionType.AGGREGATE_COMPLETE
      ) {
        let aggregateTxn: AggregateTransaction | null = txns[
          i
        ] as AggregateTransaction;

        if (aggregateTxn.innerTransactions.length === 0) {
          aggregateTxn = await this.autoFindAggregateTransaction(txn.hash);
        }
        if (!aggregateTxn) {
          throw new Error("Service unavailable");
        }
        txn.aggregateLength = aggregateTxn.innerTransactions.length;
        txn.cosigners = aggregateTxn.cosignatures.map(
          (cosignature) => cosignature.signer.publicKey
        );

        for (let x = 0; x < aggregateTxn.innerTransactions.length; ++x) {
          const txnType = aggregateTxn.innerTransactions[x].type;
          const listFound = txn.txnList.find((txn) => txn.type === txnType);

          if (listFound) {
            listFound.total += 1;
          } else {
            const txnList: TxnList = {
              type: txnType,
              name: TransactionUtils.getTransactionTypeName(txnType),
              total: 1,
            };
            txn.txnList.push(txnList);
          }
        }
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedAggregateTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedAggregateTransaction[]> {
    const formatedTxns: ConfirmedAggregateTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedAggregateTransaction,
        formattedTxn
      ) as ConfirmedAggregateTransaction;

      if (
        txns[i].type === TransactionType.AGGREGATE_BONDED ||
        txns[i].type === TransactionType.AGGREGATE_COMPLETE
      ) {
        let aggregateTxn: AggregateTransaction | null = txns[
          i
        ] as AggregateTransaction;

        if (aggregateTxn.innerTransactions.length === 0) {
          aggregateTxn = await this.autoFindAggregateTransaction(txn.hash);
        }
        if (!aggregateTxn) {
          throw new Error("Service unavailable");
        }
        txn.aggregateLength = aggregateTxn.innerTransactions.length;
        txn.cosigners = aggregateTxn.cosignatures.map(
          (cosignature) => cosignature.signer.publicKey
        );

        for (let x = 0; x < aggregateTxn.innerTransactions.length; ++x) {
          const txnType = aggregateTxn.innerTransactions[x].type;
          const listFound = txn.txnList.find((txn) => txn.type === txnType);

          if (listFound) {
            listFound.total += 1;
          } else {
            const txnList: TxnList = {
              type: txnType,
              name: TransactionUtils.getTransactionTypeName(txnType),
              total: 1,
            };
            txn.txnList.push(txnList);
          }
        }
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialAggregateTransaction(
    txns: Transaction[]
  ): Promise<PartialAggregateTransaction[]> {
    const formatedTxns: PartialAggregateTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialAggregateTransaction,
        formattedTxn
      ) as PartialAggregateTransaction;

      if (
        txns[i].type === TransactionType.AGGREGATE_BONDED ||
        txns[i].type === TransactionType.AGGREGATE_COMPLETE
      ) {
        let aggregateTxn: AggregateTransaction | null = txns[
          i
        ] as AggregateTransaction;

        if (aggregateTxn.innerTransactions.length === 0) {
          aggregateTxn = await this.autoFindAggregateTransaction(txn.hash);
        }
        if (!aggregateTxn) {
          throw new Error("Service unavailable");
        }
        txn.aggregateLength = aggregateTxn.innerTransactions.length;
        txn.cosigners = aggregateTxn.cosignatures.map(
          (cosignature) => cosignature.signer.publicKey
        );

        for (let x = 0; x < aggregateTxn.innerTransactions.length; ++x) {
          const txnType = aggregateTxn.innerTransactions[x].type;
          const listFound = txn.txnList.find((txn) => txn.type === txnType);

          if (listFound) {
            listFound.total += 1;
          } else {
            const txnList: TxnList = {
              type: txnType,
              name: TransactionUtils.getTransactionTypeName(txnType),
              total: 1,
            };
            txn.txnList.push(txnList);
          }
        }
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //-------------Asset Txn-----------------------------------------------------------
  async formatUnconfirmedAssetTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedAssetTransaction[]> {
    const formatedTxns: UnconfirmedAssetTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedAssetTransaction,
        formattedTxn
      ) as UnconfirmedAssetTransaction;

      if (txns[i].type === TransactionType.MOSAIC_DEFINITION) {
        const assetDefinitionTxn = txns[i] as MosaicDefinitionTransaction;

        txn.assetId = assetDefinitionTxn.mosaicId.toHex();
        txn.divisibility = assetDefinitionTxn.mosaicProperties.divisibility;
        txn.duration = assetDefinitionTxn.mosaicProperties.duration
          ? assetDefinitionTxn.mosaicProperties.duration.compact()
          : undefined;
        txn.transferable = assetDefinitionTxn.mosaicProperties.transferable;
        txn.supplyMutable = assetDefinitionTxn.mosaicProperties.supplyMutable;
        txn.nonce = assetDefinitionTxn.mosaicNonce.toNumber();
      } else if (txns[i].type === TransactionType.MOSAIC_SUPPLY_CHANGE) {
        const assetSupplyChangeTxn = txns[i] as MosaicSupplyChangeTransaction;

        const assetId = assetSupplyChangeTxn.mosaicId.toHex();

        txn.assetId = assetId;
        txn.supplyDelta = assetSupplyChangeTxn.delta.compact();
        txn.supplyDeltaIsRaw = true;

        if (assetSupplyChangeTxn.direction === MosaicSupplyType.Decrease) {
          txn.supplyDelta = -txn.supplyDelta;
        }

        try {
          const assetInfo = await DashboardService.getAssetInfo(assetId);

          txn.supplyDelta = DashboardService.convertToExactAmount(
            txn.supplyDelta,
            assetInfo.divisibility
          );

          txn.supplyDeltaIsRaw = false;
        } catch (error) {}
      } else if (txns[i].type === TransactionType.MODIFY_MOSAIC_LEVY) {
        const assetModifyLevyTxn = txns[i] as MosaicModifyLevyTransaction;

        const assetId = assetModifyLevyTxn.mosaicId.toHex();
        const levyAssetId = assetModifyLevyTxn.mosaicLevy.mosaicId.toHex();
        const levyAmount = assetModifyLevyTxn.mosaicLevy.fee.compact();

        txn.assetId = assetId;
        txn.levyAssetId = levyAssetId;
        txn.levyAssetAmount = levyAmount;
        txn.levyAssetAmountIsRaw = true;
        txn.levyType = assetModifyLevyTxn.mosaicLevy.type;
        txn.levyRecipient = assetModifyLevyTxn.mosaicLevy.recipient.plain();

        try {
          const assetName = await DashboardService.getAssetName(assetId);

          if (assetName.names.length) {
            txn.namespaceName = assetName.names[0].name;
          }

          const levyAssetInfo = await DashboardService.getAssetInfo(
            levyAssetId
          );

          txn.levyAssetAmount = DashboardService.convertToExactAmount(
            levyAmount,
            levyAssetInfo.divisibility
          );

          txn.levyAssetAmountIsRaw = false;

          const levyAssetName = await DashboardService.getAssetName(
            levyAssetId
          );

          if (levyAssetName.names.length) {
            txn.levyAssetName = levyAssetName.names[0].name;
          }
        } catch (error) {}
      } else if (txns[i].type === TransactionType.REMOVE_MOSAIC_LEVY) {
        const assetRemoveLevyTxn = txns[i] as MosaicRemoveLevyTransaction;

        const assetId = assetRemoveLevyTxn.mosaicId.toHex();

        txn.assetId = assetId;

        try {
          const assetName = await DashboardService.getAssetName(assetId);

          if (assetName.names.length) {
            txn.namespaceName = assetName.names[0].name;
          }
        } catch (error) {}
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedAssetTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedAssetTransaction[]> {
    const formatedTxns: ConfirmedAssetTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedAssetTransaction,
        formattedTxn
      ) as ConfirmedAssetTransaction;

      if (txns[i].type === TransactionType.MOSAIC_DEFINITION) {
        const assetDefinitionTxn = txns[i] as MosaicDefinitionTransaction;

        txn.assetId = assetDefinitionTxn.mosaicId.toHex();
        txn.divisibility = assetDefinitionTxn.mosaicProperties.divisibility;
        txn.duration = assetDefinitionTxn.mosaicProperties.duration
          ? assetDefinitionTxn.mosaicProperties.duration.compact()
          : undefined;
        txn.transferable = assetDefinitionTxn.mosaicProperties.transferable;
        txn.supplyMutable = assetDefinitionTxn.mosaicProperties.supplyMutable;
        txn.nonce = assetDefinitionTxn.mosaicNonce.toNumber();
      } else if (txns[i].type === TransactionType.MOSAIC_SUPPLY_CHANGE) {
        const assetSupplyChangeTxn = txns[i] as MosaicSupplyChangeTransaction;

        const assetId = assetSupplyChangeTxn.mosaicId.toHex();

        txn.assetId = assetId;
        txn.supplyDelta = assetSupplyChangeTxn.delta.compact();
        txn.supplyDeltaIsRaw = true;

        if (assetSupplyChangeTxn.direction === MosaicSupplyType.Decrease) {
          txn.supplyDelta = -txn.supplyDelta;
        }

        try {
          const assetInfo = await DashboardService.getAssetInfo(assetId);

          txn.supplyDelta = DashboardService.convertToExactAmount(
            txn.supplyDelta,
            assetInfo.divisibility
          );

          txn.supplyDeltaIsRaw = false;
        } catch (error) {}
      } else if (txns[i].type === TransactionType.MODIFY_MOSAIC_LEVY) {
        const assetModifyLevyTxn = txns[i] as MosaicModifyLevyTransaction;

        const assetId = assetModifyLevyTxn.mosaicId.toHex();
        const levyAssetId = assetModifyLevyTxn.mosaicLevy.mosaicId.toHex();
        const levyAmount = assetModifyLevyTxn.mosaicLevy.fee.compact();

        txn.assetId = assetId;
        txn.levyAssetId = levyAssetId;
        txn.levyAssetAmount = levyAmount;
        txn.levyAssetAmountIsRaw = true;
        txn.levyType = assetModifyLevyTxn.mosaicLevy.type;
        txn.levyRecipient = assetModifyLevyTxn.mosaicLevy.recipient.plain();

        try {
          const assetName = await DashboardService.getAssetName(assetId);

          if (assetName.names.length) {
            txn.namespaceName = assetName.names[0].name;
          }

          const levyAssetInfo = await DashboardService.getAssetInfo(
            levyAssetId
          );

          txn.levyAssetAmount = DashboardService.convertToExactAmount(
            levyAmount,
            levyAssetInfo.divisibility
          );

          txn.levyAssetAmountIsRaw = false;

          const levyAssetName = await DashboardService.getAssetName(
            levyAssetId
          );

          if (levyAssetName.names.length) {
            txn.levyAssetName = levyAssetName.names[0].name;
          }
        } catch (error) {}
      } else if (txns[i].type === TransactionType.REMOVE_MOSAIC_LEVY) {
        const assetRemoveLevyTxn = txns[i] as MosaicRemoveLevyTransaction;

        const assetId = assetRemoveLevyTxn.mosaicId.toHex();

        txn.assetId = assetId;

        try {
          const assetName = await DashboardService.getAssetName(assetId);

          if (assetName.names.length) {
            txn.namespaceName = assetName.names[0].name;
          }
        } catch (error) {}
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialAssetTransaction(
    txns: Transaction[]
  ): Promise<PartialAssetTransaction[]> {
    const formatedTxns: PartialAssetTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialAssetTransaction,
        formattedTxn
      ) as PartialAssetTransaction;

      if (txns[i].type === TransactionType.MOSAIC_DEFINITION) {
        const assetDefinitionTxn = txns[i] as MosaicDefinitionTransaction;

        txn.assetId = assetDefinitionTxn.mosaicId.toHex();
        txn.divisibility = assetDefinitionTxn.mosaicProperties.divisibility;
        txn.duration = assetDefinitionTxn.mosaicProperties.duration
          ? assetDefinitionTxn.mosaicProperties.duration.compact()
          : undefined;
        txn.transferable = assetDefinitionTxn.mosaicProperties.transferable;
        txn.supplyMutable = assetDefinitionTxn.mosaicProperties.supplyMutable;
        txn.nonce = assetDefinitionTxn.mosaicNonce.toNumber();
      } else if (txns[i].type === TransactionType.MOSAIC_SUPPLY_CHANGE) {
        const assetSupplyChangeTxn = txns[i] as MosaicSupplyChangeTransaction;

        const assetId = assetSupplyChangeTxn.mosaicId.toHex();

        txn.assetId = assetId;
        txn.supplyDelta = assetSupplyChangeTxn.delta.compact();
        txn.supplyDeltaIsRaw = true;

        if (assetSupplyChangeTxn.direction === MosaicSupplyType.Decrease) {
          txn.supplyDelta = -txn.supplyDelta;
        }

        try {
          const assetInfo = await DashboardService.getAssetInfo(assetId);

          txn.supplyDelta = DashboardService.convertToExactAmount(
            txn.supplyDelta,
            assetInfo.divisibility
          );

          txn.supplyDeltaIsRaw = false;
        } catch (error) {}
      } else if (txns[i].type === TransactionType.MODIFY_MOSAIC_LEVY) {
        const assetModifyLevyTxn = txns[i] as MosaicModifyLevyTransaction;

        const assetId = assetModifyLevyTxn.mosaicId.toHex();
        const levyAssetId = assetModifyLevyTxn.mosaicLevy.mosaicId.toHex();
        const levyAmount = assetModifyLevyTxn.mosaicLevy.fee.compact();

        txn.assetId = assetId;
        txn.levyAssetId = levyAssetId;
        txn.levyAssetAmount = levyAmount;
        txn.levyAssetAmountIsRaw = true;
        txn.levyType = assetModifyLevyTxn.mosaicLevy.type;
        txn.levyRecipient = assetModifyLevyTxn.mosaicLevy.recipient.plain();

        try {
          const assetName = await DashboardService.getAssetName(assetId);

          if (assetName.names.length) {
            txn.namespaceName = assetName.names[0].name;
          }

          const levyAssetInfo = await DashboardService.getAssetInfo(
            levyAssetId
          );

          txn.levyAssetAmount = DashboardService.convertToExactAmount(
            levyAmount,
            levyAssetInfo.divisibility
          );

          txn.levyAssetAmountIsRaw = false;

          const levyAssetName = await DashboardService.getAssetName(
            levyAssetId
          );

          if (levyAssetName.names.length) {
            txn.levyAssetName = levyAssetName.names[0].name;
          }
        } catch (error) {}
      } else if (txns[i].type === TransactionType.REMOVE_MOSAIC_LEVY) {
        const assetRemoveLevyTxn = txns[i] as MosaicRemoveLevyTransaction;

        const assetId = assetRemoveLevyTxn.mosaicId.toHex();

        txn.assetId = assetId;

        try {
          const assetName = await DashboardService.getAssetName(assetId);

          if (assetName.names.length) {
            txn.namespaceName = assetName.names[0].name;
          }
        } catch (error) {}
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //-------------Chain Txn-----------------------------------------------------------
  async formatUnconfirmedChainTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedChainTransaction[]> {
    const formatedTxns: UnconfirmedChainTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedChainTransaction,
        formattedTxn
      ) as UnconfirmedChainTransaction;

      if (txns[i].type === TransactionType.CHAIN_CONFIGURE) {
        const chainConfigureTxn = txns[i] as ChainConfigTransaction;

        txn.applyHeightDelta = chainConfigureTxn.applyHeightDelta.compact();
      } else if (txns[i].type === TransactionType.CHAIN_UPGRADE) {
        const chainUpgradeTxn = txns[i] as ChainUpgradeTransaction;

        txn.upgradePeriod = chainUpgradeTxn.upgradePeriod.compact();
        txn.newVersion = chainUpgradeTxn.newBlockchainVersion.toHex();
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedChainTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedChainTransaction[]> {
    const formatedTxns: ConfirmedChainTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedChainTransaction,
        formattedTxn
      ) as ConfirmedChainTransaction;

      if (txns[i].type === TransactionType.CHAIN_CONFIGURE) {
        const chainConfigureTxn = txns[i] as ChainConfigTransaction;

        txn.applyHeightDelta = chainConfigureTxn.applyHeightDelta.compact();
      } else if (txns[i].type === TransactionType.CHAIN_UPGRADE) {
        const chainUpgradeTxn = txns[i] as ChainUpgradeTransaction;

        txn.upgradePeriod = chainUpgradeTxn.upgradePeriod.compact();
        txn.newVersion = chainUpgradeTxn.newBlockchainVersion.toHex();
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialChainTransaction(
    txns: Transaction[]
  ): Promise<PartialChainTransaction[]> {
    const formatedTxns: PartialChainTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialChainTransaction,
        formattedTxn
      ) as PartialChainTransaction;

      if (txns[i].type === TransactionType.CHAIN_CONFIGURE) {
        const chainConfigureTxn = txns[i] as ChainConfigTransaction;

        txn.applyHeightDelta = chainConfigureTxn.applyHeightDelta.compact();
      } else if (txns[i].type === TransactionType.CHAIN_UPGRADE) {
        const chainUpgradeTxn = txns[i] as ChainUpgradeTransaction;

        txn.upgradePeriod = chainUpgradeTxn.upgradePeriod.compact();
        txn.newVersion = chainUpgradeTxn.newBlockchainVersion.toHex();
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //-------------Exchange Txn-----------------------------------------------------------
  async formatUnconfirmedExchangeTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedExchangeTransaction[]> {
    const formatedTxns: UnconfirmedExchangeTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedExchangeTransaction,
        formattedTxn
      ) as UnconfirmedExchangeTransaction;

      if (txns[i].type === TransactionType.EXCHANGE_OFFER) {
        txn.isTakingOffer = true;
        const exchangeOfferTxn = txns[i] as ExchangeOfferTransaction;

        for (let i = 0; i < exchangeOfferTxn.offers.length; ++i) {
          const tempExchangeOffer = exchangeOfferTxn.offers[i];

          const assetId = tempExchangeOffer.mosaicId.toHex();
          const amount = tempExchangeOffer.mosaicAmount.compact();

          const newTxnExchangeOffer: TxnExchangeOffer = {
            amount: amount,
            amountIsRaw: true,
            assetId: assetId,
            cost: DashboardService.convertToExactNativeAmount(
              tempExchangeOffer.cost.compact()
            ),
            owner: tempExchangeOffer.owner.publicKey,
            type:
              tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER
                ? "Sell"
                : "Buy",
          };

          try {
            const assetInfo = await DashboardService.getAssetInfo(assetId);

            newTxnExchangeOffer.amountIsRaw = false;
            newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(
              amount,
              assetInfo.divisibility
            );

            const assetName = await DashboardService.getAssetName(assetId);

            if (assetName.names.length) {
              newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
            }
          } catch (error) {}

          txn.exchangeOffers.push(newTxnExchangeOffer);
        }
      } else if (txns[i].type === TransactionType.ADD_EXCHANGE_OFFER) {
        const addExchangeOfferTxn = txns[i] as AddExchangeOfferTransaction;

        for (let i = 0; i < addExchangeOfferTxn.offers.length; ++i) {
          const tempExchangeOffer = addExchangeOfferTxn.offers[i];

          const assetId = tempExchangeOffer.mosaicId.toHex();
          const amount = tempExchangeOffer.mosaicAmount.compact();

          const newTxnExchangeOffer: TxnExchangeOffer = {
            amount: amount,
            amountIsRaw: true,
            assetId: assetId,
            cost: DashboardService.convertToExactNativeAmount(
              tempExchangeOffer.cost.compact()
            ),
            duration: tempExchangeOffer.duration.compact(),
            type:
              tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER
                ? "Sell"
                : "Buy",
          };

          try {
            const assetInfo = await DashboardService.getAssetInfo(assetId);

            newTxnExchangeOffer.amountIsRaw = false;
            newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(
              amount,
              assetInfo.divisibility
            );

            const assetName = await DashboardService.getAssetName(assetId);

            if (assetName.names.length) {
              newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
            }
          } catch (error) {}

          txn.exchangeOffers.push(newTxnExchangeOffer);
        }
      } else if (txns[i].type === TransactionType.REMOVE_EXCHANGE_OFFER) {
        const removeExchangeOfferTxn = txns[
          i
        ] as RemoveExchangeOfferTransaction;

        for (let i = 0; i < removeExchangeOfferTxn.offers.length; ++i) {
          const tempExchangeOffer = removeExchangeOfferTxn.offers[i];

          const assetId = tempExchangeOffer.mosaicId.toHex();

          const newTxnExchangeOffer: TxnExchangeOffer = {
            assetId: assetId,
            type:
              tempExchangeOffer.offerType === ExchangeOfferType.SELL_OFFER
                ? "Sell"
                : "Buy",
          };

          try {
            const assetName = await DashboardService.getAssetName(assetId);

            if (assetName.names.length) {
              newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
            }
          } catch (error) {}

          txn.exchangeOffers.push(newTxnExchangeOffer);
        }
      }

      const allBuyOffers = txn.exchangeOffers.filter((x) => x.type === "Buy");
      const allSellOffers = txn.exchangeOffers.filter((x) => x.type === "Sell");

      txn.exchangeOffers = txn.isTakingOffer
        ? allSellOffers.concat(allBuyOffers)
        : allBuyOffers.concat(allSellOffers);

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedExchangeTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedExchangeTransaction[]> {
    const formatedTxns: ConfirmedExchangeTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedExchangeTransaction,
        formattedTxn
      ) as ConfirmedExchangeTransaction;

      if (txns[i].type === TransactionType.EXCHANGE_OFFER) {
        txn.isTakingOffer = true;
        const exchangeOfferTxn = txns[i] as ExchangeOfferTransaction;

        for (let i = 0; i < exchangeOfferTxn.offers.length; ++i) {
          const tempExchangeOffer = exchangeOfferTxn.offers[i];

          const assetId = tempExchangeOffer.mosaicId.toHex();
          const amount = tempExchangeOffer.mosaicAmount.compact();

          const newTxnExchangeOffer: TxnExchangeOffer = {
            amount: amount,
            amountIsRaw: true,
            assetId: assetId,
            cost: DashboardService.convertToExactNativeAmount(
              tempExchangeOffer.cost.compact()
            ),
            owner: tempExchangeOffer.owner.publicKey,
            type:
              tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER
                ? "Sell"
                : "Buy",
          };

          try {
            const assetInfo = await DashboardService.getAssetInfo(assetId);

            newTxnExchangeOffer.amountIsRaw = false;
            newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(
              amount,
              assetInfo.divisibility
            );

            const assetName = await DashboardService.getAssetName(assetId);

            if (assetName.names.length) {
              newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
            }
          } catch (error) {}

          txn.exchangeOffers.push(newTxnExchangeOffer);
        }
      } else if (txns[i].type === TransactionType.ADD_EXCHANGE_OFFER) {
        const addExchangeOfferTxn = txns[i] as AddExchangeOfferTransaction;

        for (let i = 0; i < addExchangeOfferTxn.offers.length; ++i) {
          const tempExchangeOffer = addExchangeOfferTxn.offers[i];

          const assetId = tempExchangeOffer.mosaicId.toHex();
          const amount = tempExchangeOffer.mosaicAmount.compact();

          const newTxnExchangeOffer: TxnExchangeOffer = {
            amount: amount,
            amountIsRaw: true,
            assetId: assetId,
            cost: DashboardService.convertToExactNativeAmount(
              tempExchangeOffer.cost.compact()
            ),
            duration: tempExchangeOffer.duration.compact(),
            type:
              tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER
                ? "Sell"
                : "Buy",
          };

          try {
            const assetInfo = await DashboardService.getAssetInfo(assetId);

            newTxnExchangeOffer.amountIsRaw = false;
            newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(
              amount,
              assetInfo.divisibility
            );

            const assetName = await DashboardService.getAssetName(assetId);

            if (assetName.names.length) {
              newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
            }
          } catch (error) {}

          txn.exchangeOffers.push(newTxnExchangeOffer);
        }
      } else if (txns[i].type === TransactionType.REMOVE_EXCHANGE_OFFER) {
        const removeExchangeOfferTxn = txns[
          i
        ] as RemoveExchangeOfferTransaction;

        for (let i = 0; i < removeExchangeOfferTxn.offers.length; ++i) {
          const tempExchangeOffer = removeExchangeOfferTxn.offers[i];

          const assetId = tempExchangeOffer.mosaicId.toHex();

          const newTxnExchangeOffer: TxnExchangeOffer = {
            assetId: assetId,
            type:
              tempExchangeOffer.offerType === ExchangeOfferType.SELL_OFFER
                ? "Sell"
                : "Buy",
          };

          try {
            const assetName = await DashboardService.getAssetName(assetId);

            if (assetName.names.length) {
              newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
            }
          } catch (error) {}

          txn.exchangeOffers.push(newTxnExchangeOffer);
        }
      }

      const allBuyOffers = txn.exchangeOffers.filter((x) => x.type === "Buy");
      const allSellOffers = txn.exchangeOffers.filter((x) => x.type === "Sell");

      txn.exchangeOffers = txn.isTakingOffer
        ? allSellOffers.concat(allBuyOffers)
        : allBuyOffers.concat(allSellOffers);

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialExchangeTransaction(
    txns: Transaction[]
  ): Promise<PartialExchangeTransaction[]> {
    const formatedTxns: PartialExchangeTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialExchangeTransaction,
        formattedTxn
      ) as PartialExchangeTransaction;

      if (txns[i].type === TransactionType.EXCHANGE_OFFER) {
        txn.isTakingOffer = true;
        const exchangeOfferTxn = txns[i] as ExchangeOfferTransaction;

        for (let i = 0; i < exchangeOfferTxn.offers.length; ++i) {
          const tempExchangeOffer = exchangeOfferTxn.offers[i];

          const assetId = tempExchangeOffer.mosaicId.toHex();
          const amount = tempExchangeOffer.mosaicAmount.compact();

          const newTxnExchangeOffer: TxnExchangeOffer = {
            amount: amount,
            amountIsRaw: true,
            assetId: assetId,
            cost: DashboardService.convertToExactNativeAmount(
              tempExchangeOffer.cost.compact()
            ),
            owner: tempExchangeOffer.owner.publicKey,
            type:
              tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER
                ? "Sell"
                : "Buy",
          };

          try {
            const assetInfo = await DashboardService.getAssetInfo(assetId);

            newTxnExchangeOffer.amountIsRaw = false;
            newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(
              amount,
              assetInfo.divisibility
            );

            const assetName = await DashboardService.getAssetName(assetId);

            if (assetName.names.length) {
              newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
            }
          } catch (error) {}

          txn.exchangeOffers.push(newTxnExchangeOffer);
        }
      } else if (txns[i].type === TransactionType.ADD_EXCHANGE_OFFER) {
        const addExchangeOfferTxn = txns[i] as AddExchangeOfferTransaction;

        for (let i = 0; i < addExchangeOfferTxn.offers.length; ++i) {
          const tempExchangeOffer = addExchangeOfferTxn.offers[i];

          const assetId = tempExchangeOffer.mosaicId.toHex();
          const amount = tempExchangeOffer.mosaicAmount.compact();

          const newTxnExchangeOffer: TxnExchangeOffer = {
            amount: amount,
            amountIsRaw: true,
            assetId: assetId,
            cost: DashboardService.convertToExactNativeAmount(
              tempExchangeOffer.cost.compact()
            ),
            duration: tempExchangeOffer.duration.compact(),
            type:
              tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER
                ? "Sell"
                : "Buy",
          };

          try {
            const assetInfo = await DashboardService.getAssetInfo(assetId);

            newTxnExchangeOffer.amountIsRaw = false;
            newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(
              amount,
              assetInfo.divisibility
            );

            const assetName = await DashboardService.getAssetName(assetId);

            if (assetName.names.length) {
              newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
            }
          } catch (error) {}

          txn.exchangeOffers.push(newTxnExchangeOffer);
        }
      } else if (txns[i].type === TransactionType.REMOVE_EXCHANGE_OFFER) {
        const removeExchangeOfferTxn = txns[
          i
        ] as RemoveExchangeOfferTransaction;

        for (let i = 0; i < removeExchangeOfferTxn.offers.length; ++i) {
          const tempExchangeOffer = removeExchangeOfferTxn.offers[i];

          const assetId = tempExchangeOffer.mosaicId.toHex();

          const newTxnExchangeOffer: TxnExchangeOffer = {
            assetId: assetId,
            type:
              tempExchangeOffer.offerType === ExchangeOfferType.SELL_OFFER
                ? "Sell"
                : "Buy",
          };

          try {
            const assetName = await DashboardService.getAssetName(assetId);

            if (assetName.names.length) {
              newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
            }
          } catch (error) {}

          txn.exchangeOffers.push(newTxnExchangeOffer);
        }
      }

      const allBuyOffers = txn.exchangeOffers.filter((x) => x.type === "Buy");
      const allSellOffers = txn.exchangeOffers.filter((x) => x.type === "Sell");

      txn.exchangeOffers = txn.isTakingOffer
        ? allSellOffers.concat(allBuyOffers)
        : allBuyOffers.concat(allSellOffers);

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //-------------Link Txn-----------------------------------------------------------
  async formatUnconfirmedLinkTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedLinkTransaction[]> {
    const formatedTxns: UnconfirmedLinkTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedLinkTransaction,
        formattedTxn
      ) as UnconfirmedLinkTransaction;

      if (txns[i].type === TransactionType.LINK_ACCOUNT) {
        const linkAccTxn = txns[i] as AccountLinkTransaction;

        txn.action =
          linkAccTxn.linkAction === LinkAction.Link ? "Link" : "Unlink";

        txn.remotePublicKey = linkAccTxn.remoteAccountKey;
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedLinkTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedLinkTransaction[]> {
    const formatedTxns: ConfirmedLinkTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedLinkTransaction,
        formattedTxn
      ) as ConfirmedLinkTransaction;

      if (txns[i].type === TransactionType.LINK_ACCOUNT) {
        const linkAccTxn = txns[i] as AccountLinkTransaction;

        txn.action =
          linkAccTxn.linkAction === LinkAction.Link ? "Link" : "Unlink";

        txn.remotePublicKey = linkAccTxn.remoteAccountKey;
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialLinkTransaction(
    txns: Transaction[]
  ): Promise<PartialLinkTransaction[]> {
    const formatedTxns: PartialLinkTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialLinkTransaction,
        formattedTxn
      ) as PartialLinkTransaction;

      if (txns[i].type === TransactionType.LINK_ACCOUNT) {
        const linkAccTxn = txns[i] as AccountLinkTransaction;

        txn.action =
          linkAccTxn.linkAction === LinkAction.Link ? "Link" : "Unlink";

        txn.remotePublicKey = linkAccTxn.remoteAccountKey;
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //-------------Lock Txn-----------------------------------------------------------
  async formatUnconfirmedLockTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedLockTransaction[]> {
    const formatedTxns: UnconfirmedLockTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedLockTransaction,
        formattedTxn
      ) as UnconfirmedLockTransaction;

      const lockFundTxn = txns[i] as LockFundsTransaction;

      txn.lockHash = lockFundTxn.hash;
      txn.duration = lockFundTxn.duration.compact();
      const amount = lockFundTxn.mosaic.amount.compact();
      txn.amountLocking = AppState.nativeToken.divisibility
        ? amount / Math.pow(10, AppState.nativeToken.divisibility)
        : amount;

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedLockTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedLockTransaction[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const formatedTxns: ConfirmedLockTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedLockTransaction,
        formattedTxn
      ) as ConfirmedLockTransaction;

      const lockFundTxn = txns[i] as LockFundsTransaction;

      txn.lockHash = lockFundTxn.hash;
      txn.duration = lockFundTxn.duration.compact();

      const amount = lockFundTxn.mosaic.amount.compact();
      txn.amountLocking = AppState.nativeToken.divisibility
        ? amount / Math.pow(10, AppState.nativeToken.divisibility)
        : amount;

      try {
        const txnStatus =
          await AppState.chainAPI.transactionAPI.getTransactionStatus(
            lockFundTxn.hash
          );
        txn.isRefunded = txnStatus.group === TransactionGroupType.CONFIRMED;
      } catch (error) {
        txn.isRefunded = false;
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialLockTransaction(
    txns: Transaction[]
  ): Promise<PartialLockTransaction[]> {
    const formatedTxns: PartialLockTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialLockTransaction,
        formattedTxn
      ) as PartialLockTransaction;

      const lockFundTxn = txns[i] as LockFundsTransaction;

      txn.lockHash = lockFundTxn.hash;
      txn.duration = lockFundTxn.duration.compact();
      const amount = lockFundTxn.mosaic.amount.compact();
      txn.amountLocking = AppState.nativeToken.divisibility
        ? amount / Math.pow(10, AppState.nativeToken.divisibility)
        : amount;

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //-------------Namespace Txn-----------------------------------------------------------
  async formatUnconfirmedNamespaceTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedNamespaceTransaction[]> {
    const formatedTxns: UnconfirmedNamespaceTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedNamespaceTransaction,
        formattedTxn
      ) as UnconfirmedNamespaceTransaction;

      if (txns[i].type === TransactionType.REGISTER_NAMESPACE) {
        const registerTxn = txns[i] as RegisterNamespaceTransaction;

        txn.namespaceName = registerTxn.namespaceName;

        if (registerTxn.namespaceType === NamespaceType.RootNamespace) {
          txn.duration = registerTxn.duration?.compact();
          txn.registerType = NamespaceType.RootNamespace;
          txn.registerTypeName = "Root namespace";
        } else {
          if (!registerTxn.parentId) {
            throw new Error("Service unavailable");
          }
          txn.registerType = NamespaceType.SubNamespace;
          txn.registerTypeName = "Sub namespace";
          txn.parentId = registerTxn.parentId.toHex();
          const namespaceName = await DashboardService.getNamespacesName([
            registerTxn.parentId,
          ]);
          txn.parentName = namespaceName[0].name;
        }

        txn.namespaceId = registerTxn.namespaceId.toHex();
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedNamespaceTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedNamespaceTransaction[]> {
    const formatedTxns: ConfirmedNamespaceTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedNamespaceTransaction,
        formattedTxn
      ) as ConfirmedNamespaceTransaction;

      if (txns[i].type === TransactionType.REGISTER_NAMESPACE) {
        const registerTxn = txns[i] as RegisterNamespaceTransaction;

        txn.namespaceName = registerTxn.namespaceName;

        if (registerTxn.namespaceType === NamespaceType.RootNamespace) {
          txn.duration = registerTxn.duration?.compact();
          txn.registerType = NamespaceType.RootNamespace;
          txn.registerTypeName = "Root namespace";
        } else {
          if (!registerTxn.parentId) {
            throw new Error("Service unavailable");
          }
          txn.registerType = NamespaceType.SubNamespace;
          txn.registerTypeName = "Sub namespace";
          txn.parentId = registerTxn.parentId.toHex();
          const namespaceName = await DashboardService.getNamespacesName([
            registerTxn.parentId,
          ]);
          txn.parentName = namespaceName[0].name;
        }

        txn.namespaceId = registerTxn.namespaceId.toHex();
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialNamespaceTransaction(
    txns: Transaction[]
  ): Promise<PartialNamespaceTransaction[]> {
    const formatedTxns: PartialNamespaceTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialNamespaceTransaction,
        formattedTxn
      ) as PartialNamespaceTransaction;

      if (txns[i].type === TransactionType.REGISTER_NAMESPACE) {
        const registerTxn = txns[i] as RegisterNamespaceTransaction;

        txn.namespaceName = registerTxn.namespaceName;

        if (registerTxn.namespaceType === NamespaceType.RootNamespace) {
          txn.duration = registerTxn.duration?.compact();
          txn.registerType = NamespaceType.RootNamespace;
          txn.registerTypeName = "Root namespace";
        } else {
          if (!registerTxn.parentId) {
            throw new Error("Service unavailable");
          }
          txn.registerType = NamespaceType.SubNamespace;
          txn.registerTypeName = "Sub namespace";
          txn.parentId = registerTxn.parentId.toHex();
          const namespaceName = await DashboardService.getNamespacesName([
            registerTxn.parentId,
          ]);
          txn.parentName = namespaceName[0].name;
        }

        txn.namespaceId = registerTxn.namespaceId.toHex();
      }

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //-------------Restriction Txn-----------------------------------------------------------
  async formatUnconfirmedRestrictionTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedRestrictionTransaction[]> {
    const formatedTxns: UnconfirmedRestrictionTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedRestrictionTransaction,
        formattedTxn
      ) as UnconfirmedRestrictionTransaction;

      if (txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS) {
        const accAddressRestrictionTxn = txns[
          i
        ] as AccountAddressRestrictionModificationTransaction;

        txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
          accAddressRestrictionTxn.restrictionType
        ).action;

        for (
          let i = 0;
          i < accAddressRestrictionTxn.modifications.length;
          ++i
        ) {
          const modification = accAddressRestrictionTxn.modifications[i];

          const newRestrictionModification: RestrictionModification = {
            action:
              modification.modificationType === RestrictionModificationType.Add
                ? "Add"
                : "Remove",
            value: modification.value,
          };
          txn.modification.push(newRestrictionModification);
        }
      } else if (
        txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC
      ) {
        const accAssetRestrictionTxn = txns[
          i
        ] as AccountMosaicRestrictionModificationTransaction;

        txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
          accAssetRestrictionTxn.restrictionType
        ).action;

        for (let i = 0; i < accAssetRestrictionTxn.modifications.length; ++i) {
          const modification = accAssetRestrictionTxn.modifications[i];

          const newRestrictionModification: RestrictionModification = {
            action:
              modification.modificationType === RestrictionModificationType.Add
                ? "Add"
                : "Remove",
            value: new MosaicId(modification.value).toHex(),
          };

          try {
            const assetId = newRestrictionModification.value;
            if (assetId === AppState.nativeToken.assetId) {
              newRestrictionModification.name = AppState.nativeToken.label;
            } else {
              const assetName = await DashboardService.getAssetName(assetId);

              if (assetName.names.length) {
                newRestrictionModification.name = assetName.names[0].name;
              }
            }
          } catch (error) {}

          txn.modification.push(newRestrictionModification);
        }
      } else if (
        txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION
      ) {
        const accOperationRestrictionTxn = txns[
          i
        ] as AccountOperationRestrictionModificationTransaction;

        txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
          accOperationRestrictionTxn.restrictionType
        ).action;

        for (
          let i = 0;
          i < accOperationRestrictionTxn.modifications.length;
          ++i
        ) {
          const modification = accOperationRestrictionTxn.modifications[i];

          const newRestrictionModification: RestrictionModification = {
            action:
              modification.modificationType === RestrictionModificationType.Add
                ? "Add"
                : "Remove",
            value: TransactionUtils.getTransactionTypeNameByEnum(
              modification.value
            ),
          };

          txn.modification.push(newRestrictionModification);
        }
      }

      const allAddModification = txn.modification.filter(
        (x) => x.action === "Add"
      );
      const allRemoveModification = txn.modification.filter(
        (x) => x.action === "Remove"
      );

      txn.modification = allAddModification.concat(allRemoveModification);

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedRestrictionTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedRestrictionTransaction[]> {
    const formatedTxns: ConfirmedRestrictionTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedRestrictionTransaction,
        formattedTxn
      ) as ConfirmedRestrictionTransaction;

      if (txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS) {
        const accAddressRestrictionTxn = txns[
          i
        ] as AccountAddressRestrictionModificationTransaction;

        txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
          accAddressRestrictionTxn.restrictionType
        ).action;

        for (
          let i = 0;
          i < accAddressRestrictionTxn.modifications.length;
          ++i
        ) {
          const modification = accAddressRestrictionTxn.modifications[i];

          const newRestrictionModification: RestrictionModification = {
            action:
              modification.modificationType === RestrictionModificationType.Add
                ? "Add"
                : "Remove",
            value: modification.value,
          };
          txn.modification.push(newRestrictionModification);
        }
      } else if (
        txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC
      ) {
        const accAssetRestrictionTxn = txns[
          i
        ] as AccountMosaicRestrictionModificationTransaction;

        txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
          accAssetRestrictionTxn.restrictionType
        ).action;

        for (let i = 0; i < accAssetRestrictionTxn.modifications.length; ++i) {
          const modification = accAssetRestrictionTxn.modifications[i];

          const newRestrictionModification: RestrictionModification = {
            action:
              modification.modificationType === RestrictionModificationType.Add
                ? "Add"
                : "Remove",
            value: new MosaicId(modification.value).toHex(),
          };

          try {
            const assetId = newRestrictionModification.value;
            if (assetId === AppState.nativeToken.assetId) {
              newRestrictionModification.name = AppState.nativeToken.label;
            } else {
              const assetName = await DashboardService.getAssetName(assetId);

              if (assetName.names.length) {
                newRestrictionModification.name = assetName.names[0].name;
              }
            }
          } catch (error) {}

          txn.modification.push(newRestrictionModification);
        }
      } else if (
        txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION
      ) {
        const accOperationRestrictionTxn = txns[
          i
        ] as AccountOperationRestrictionModificationTransaction;

        txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
          accOperationRestrictionTxn.restrictionType
        ).action;

        for (
          let i = 0;
          i < accOperationRestrictionTxn.modifications.length;
          ++i
        ) {
          const modification = accOperationRestrictionTxn.modifications[i];

          const newRestrictionModification: RestrictionModification = {
            action:
              modification.modificationType === RestrictionModificationType.Add
                ? "Add"
                : "Remove",
            value: TransactionUtils.getTransactionTypeNameByEnum(
              modification.value
            ),
          };

          txn.modification.push(newRestrictionModification);
        }
      }

      const allAddModification = txn.modification.filter(
        (x) => x.action === "Add"
      );
      const allRemoveModification = txn.modification.filter(
        (x) => x.action === "Remove"
      );

      txn.modification = allAddModification.concat(allRemoveModification);

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialRestrictionTransaction(
    txns: Transaction[]
  ): Promise<PartialRestrictionTransaction[]> {
    const formatedTxns: PartialRestrictionTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialRestrictionTransaction,
        formattedTxn
      ) as PartialRestrictionTransaction;

      if (txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS) {
        const accAddressRestrictionTxn = txns[
          i
        ] as AccountAddressRestrictionModificationTransaction;

        txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
          accAddressRestrictionTxn.restrictionType
        ).action;

        for (
          let i = 0;
          i < accAddressRestrictionTxn.modifications.length;
          ++i
        ) {
          const modification = accAddressRestrictionTxn.modifications[i];

          const newRestrictionModification: RestrictionModification = {
            action:
              modification.modificationType === RestrictionModificationType.Add
                ? "Add"
                : "Remove",
            value: modification.value,
          };
          txn.modification.push(newRestrictionModification);
        }
      } else if (
        txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC
      ) {
        const accAssetRestrictionTxn = txns[
          i
        ] as AccountMosaicRestrictionModificationTransaction;

        txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
          accAssetRestrictionTxn.restrictionType
        ).action;

        for (let i = 0; i < accAssetRestrictionTxn.modifications.length; ++i) {
          const modification = accAssetRestrictionTxn.modifications[i];

          const newRestrictionModification: RestrictionModification = {
            action:
              modification.modificationType === RestrictionModificationType.Add
                ? "Add"
                : "Remove",
            value: new MosaicId(modification.value).toHex(),
          };

          try {
            const assetId = newRestrictionModification.value;

            if (assetId === AppState.nativeToken.assetId) {
              newRestrictionModification.name = AppState.nativeToken.label;
            } else {
              const assetName = await DashboardService.getAssetName(assetId);

              if (assetName.names.length) {
                newRestrictionModification.name = assetName.names[0].name;
              }
            }
          } catch (error) {}

          txn.modification.push(newRestrictionModification);
        }
      } else if (
        txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION
      ) {
        const accOperationRestrictionTxn = txns[
          i
        ] as AccountOperationRestrictionModificationTransaction;

        txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
          accOperationRestrictionTxn.restrictionType
        ).action;

        for (
          let i = 0;
          i < accOperationRestrictionTxn.modifications.length;
          ++i
        ) {
          const modification = accOperationRestrictionTxn.modifications[i];

          const newRestrictionModification: RestrictionModification = {
            action:
              modification.modificationType === RestrictionModificationType.Add
                ? "Add"
                : "Remove",
            value: TransactionUtils.getTransactionTypeNameByEnum(
              modification.value
            ),
          };

          txn.modification.push(newRestrictionModification);
        }
      }

      const allAddModification = txn.modification.filter(
        (x) => x.action === "Add"
      );
      const allRemoveModification = txn.modification.filter(
        (x) => x.action === "Remove"
      );

      txn.modification = allAddModification.concat(allRemoveModification);

      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //-------------Secret Txn-----------------------------------------------------------
  async formatUnconfirmedSecretTransaction(
    txns: Transaction[]
  ): Promise<UnconfirmedSecretTransaction[]> {
    const formatedTxns: UnconfirmedSecretTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
      const txn = UnconfirmedTransaction.convertToSubClass(
        UnconfirmedSecretTransaction,
        formattedTxn
      ) as UnconfirmedSecretTransaction;

      if (txns[i].type === TransactionType.SECRET_LOCK) {
        const secretLockTxn = txns[i] as SecretLockTransaction;
        txn.duration = secretLockTxn.duration.compact();
        txn.secret = secretLockTxn.secret;
        txn.recipient = secretLockTxn.recipient.plain();
        txn.amount = secretLockTxn.mosaic.amount.compact();
        txn.hashType = myHashType[secretLockTxn.hashType];

        const isNamespace = DashboardService.isNamespace(
          secretLockTxn.mosaic.id
        );

        try {
          if (!isNamespace) {
            txn.assetId = secretLockTxn.mosaic.id.toHex();

            const assetsNames = await DashboardService.getAssetsName([
              secretLockTxn.mosaic.id,
            ]);

            if (assetsNames[0].names.length) {
              txn.namespaceName = assetsNames[0].names[0].name;
            }
          } else {
            const namespaceId = new NamespaceId(
              secretLockTxn.mosaic.id.toDTO().id
            );
            const linkedAssetId = await DashboardService.getAssetAlias(
              namespaceId
            );

            txn.assetId = linkedAssetId.toHex();
            txn.isSendWithNamespace = true;

            const nsNames = await DashboardService.getNamespacesName([
              namespaceId,
            ]);
            txn.namespaceName = nsNames[0].name;
          }

          if (
            txn.namespaceName &&
            txn.namespaceName === AppState.nativeToken.fullNamespace
          ) {
            txn.namespaceName = AppState.nativeToken.label;
          }

          const assetInfo = await DashboardService.getAssetInfo(txn.assetId);

          if (assetInfo.divisibility > 0) {
            txn.amount = DashboardService.convertToExactAmount(
              txn.amount,
              assetInfo.divisibility
            );
          }

          txn.amountIsRaw = false;
        } catch (error) {}
      } else if (txns[i].type === TransactionType.SECRET_PROOF) {
        const secretProofTxn = txns[i] as SecretProofTransaction;
        txn.secret = secretProofTxn.secret;
        txn.recipient = secretProofTxn.recipient.plain();
        txn.hashType = myHashType[secretProofTxn.hashType];
        txn.proof = secretProofTxn.proof;
      }
      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatConfirmedSecretTransaction(
    txns: Transaction[]
  ): Promise<ConfirmedSecretTransaction[]> {
    const formatedTxns: ConfirmedSecretTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatConfirmedTransaction(txns[i]);
      const txn = ConfirmedTransaction.convertToSubClass(
        ConfirmedSecretTransaction,
        formattedTxn
      ) as ConfirmedSecretTransaction;

      if (txns[i].type === TransactionType.SECRET_LOCK) {
        const secretLockTxn = txns[i] as SecretLockTransaction;
        txn.duration = secretLockTxn.duration.compact();
        txn.secret = secretLockTxn.secret;
        txn.recipient = secretLockTxn.recipient.plain();
        txn.amount = secretLockTxn.mosaic.amount.compact();
        txn.hashType = myHashType[secretLockTxn.hashType];

        const isNamespace = DashboardService.isNamespace(
          secretLockTxn.mosaic.id
        );
        const resolvedAssetId = await DashboardService.getResolvedAsset(
          secretLockTxn.mosaic.id,
          txn.block
        );
        if (!resolvedAssetId) {
          throw new Error("Service unavailable");
        }
        txn.assetId = resolvedAssetId.toHex();

        try {
          if (!isNamespace) {
            const assetsNames = await DashboardService.getAssetsName([
              secretLockTxn.mosaic.id,
            ]);

            if (assetsNames[0].names.length) {
              txn.namespaceName = assetsNames[0].names[0].name;
            }
          } else {
            txn.isSendWithNamespace = true;
            const namespaceId = new NamespaceId(
              secretLockTxn.mosaic.id.toDTO().id
            );

            const nsNames = await DashboardService.getNamespacesName([
              namespaceId,
            ]);
            txn.namespaceName = nsNames[0].name;
          }

          if (
            txn.namespaceName &&
            txn.namespaceName === AppState.nativeToken.fullNamespace
          ) {
            txn.namespaceName = AppState.nativeToken.label;
          }

          const assetInfo = await DashboardService.getAssetInfo(txn.assetId);

          if (assetInfo.divisibility > 0) {
            txn.amount = DashboardService.convertToExactAmount(
              txn.amount,
              assetInfo.divisibility
            );
          }

          txn.amountIsRaw = false;
        } catch (error) {}
      } else if (txns[i].type === TransactionType.SECRET_PROOF) {
        const secretProofTxn = txns[i] as SecretProofTransaction;
        txn.secret = secretProofTxn.secret;
        txn.recipient = secretProofTxn.recipient.plain();
        txn.hashType = myHashType[secretProofTxn.hashType];
        txn.proof = secretProofTxn.proof;
      }
      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  async formatPartialSecretTransaction(
    txns: Transaction[]
  ): Promise<PartialSecretTransaction[]> {
    const formatedTxns: PartialSecretTransaction[] = [];

    for (let i = 0; i < txns.length; ++i) {
      const formattedTxn = await this.formatPartialTransaction(txns[i]);
      const txn = PartialTransaction.convertToSubClass(
        PartialSecretTransaction,
        formattedTxn
      ) as PartialSecretTransaction;

      if (txns[i].type === TransactionType.SECRET_LOCK) {
        const secretLockTxn = txns[i] as SecretLockTransaction;
        txn.duration = secretLockTxn.duration.compact();
        txn.secret = secretLockTxn.secret;
        txn.recipient = secretLockTxn.recipient.plain();
        txn.amount = secretLockTxn.mosaic.amount.compact();
        txn.hashType = myHashType[secretLockTxn.hashType];

        const isNamespace = DashboardService.isNamespace(
          secretLockTxn.mosaic.id
        );

        try {
          if (!isNamespace) {
            txn.assetId = secretLockTxn.mosaic.id.toHex();

            const assetsNames = await DashboardService.getAssetsName([
              secretLockTxn.mosaic.id,
            ]);

            if (assetsNames[0].names.length) {
              txn.namespaceName = assetsNames[0].names[0].name;
            }
          } else {
            const namespaceId = new NamespaceId(
              secretLockTxn.mosaic.id.toDTO().id
            );
            const linkedAssetId = await DashboardService.getAssetAlias(
              namespaceId
            );

            txn.assetId = linkedAssetId.toHex();
            txn.isSendWithNamespace = true;

            const nsNames = await DashboardService.getNamespacesName([
              namespaceId,
            ]);
            txn.namespaceName = nsNames[0].name;
          }

          if (
            txn.namespaceName &&
            txn.namespaceName === AppState.nativeToken.fullNamespace
          ) {
            txn.namespaceName = AppState.nativeToken.label;
          }

          const assetInfo = await DashboardService.getAssetInfo(txn.assetId);

          if (assetInfo.divisibility > 0) {
            txn.amount = DashboardService.convertToExactAmount(
              txn.amount,
              assetInfo.divisibility
            );
          }

          txn.amountIsRaw = false;
        } catch (error) {}
      } else if (txns[i].type === TransactionType.SECRET_PROOF) {
        const secretProofTxn = txns[i] as SecretProofTransaction;
        txn.secret = secretProofTxn.secret;
        txn.recipient = secretProofTxn.recipient.plain();
        txn.hashType = myHashType[secretProofTxn.hashType];
        txn.proof = secretProofTxn.proof;
      }
      formatedTxns.push(txn);
    }

    return formatedTxns;
  }

  //------------- format groupType transaction ------------------------------------------
  async formatPartialTransaction(
    txn: Transaction
  ): Promise<PartialTransaction> {
    if (!txn.transactionInfo) {
      throw new Error("Service unavailable");
    }
    const transactionInfo: TransactionInfo | AggregateTransactionInfo =
      txn.transactionInfo;
    const txnHash =
      transactionInfo instanceof AggregateTransactionInfo
        ? transactionInfo.aggregateHash
        : transactionInfo.hash ?? "";
    if (!txn.signer) {
      throw new Error("Service unavailable");
    }
    let initiator = txn.signer.publicKey;

    const formattedTxn = new PartialTransaction(txnHash);
    formattedTxn.type = TransactionUtils.getTransactionTypeName(txn.type);
    formattedTxn.maxFee =
      transactionInfo instanceof AggregateTransactionInfo
        ? null
        : DashboardService.convertToExactNativeAmount(txn.maxFee.compact());

    formattedTxn.signer = txn.signer.publicKey;
    formattedTxn.signerAddress = txn.signer.address.plain();

    let deadline = null;

    if (transactionInfo instanceof AggregateTransactionInfo) {
      try {
        const aggregateTxn = await this.autoFindAggregateTransaction(txnHash);
        if (aggregateTxn && aggregateTxn.signer) {
          deadline = aggregateTxn.deadline.adjustedValue.compact();
          initiator = aggregateTxn.signer.publicKey;
        }
      } catch (error) {}
    } else {
      deadline = txn.deadline.adjustedValue.compact();
    }
    formattedTxn.deadline = deadline;
    formattedTxn.initiator = initiator;

    if (
      txn.type === TransactionType.AGGREGATE_BONDED ||
      txn.type === TransactionType.AGGREGATE_COMPLETE
    ) {
      const aggregateTxn = txn as AggregateTransaction;

      for (let i = 0; i < aggregateTxn.cosignatures.length; ++i) {
        formattedTxn.cosignedPublickKey.push(
          aggregateTxn.cosignatures[i].signer.publicKey
        );
      }
    }

    return formattedTxn;
  }

  async formatUnconfirmedTransaction(
    txn: Transaction
  ): Promise<UnconfirmedTransaction> {
    if (!txn.transactionInfo) {
      throw new Error("Service unavailable");
    }
    const transactionInfo: TransactionInfo | AggregateTransactionInfo =
      txn.transactionInfo;
    const txnHash =
      transactionInfo instanceof AggregateTransactionInfo
        ? transactionInfo.aggregateHash
        : transactionInfo.hash ?? "";
    if (!txn.signer) {
      throw new Error("Service unavailable");
    }
    let initiator = txn.signer.publicKey;

    const formattedTxn = new UnconfirmedTransaction(txnHash);
    formattedTxn.type = TransactionUtils.getTransactionTypeName(txn.type);
    formattedTxn.maxFee =
      transactionInfo instanceof AggregateTransactionInfo
        ? null
        : DashboardService.convertToExactNativeAmount(txn.maxFee.compact());

    formattedTxn.signer = txn.signer.publicKey;
    formattedTxn.signerAddress = txn.signer.address.plain();

    let deadline = null;

    if (transactionInfo instanceof AggregateTransactionInfo) {
      try {
        const aggregateTxn = await this.autoFindAggregateTransaction(txnHash);
        if (aggregateTxn && aggregateTxn.signer) {
          deadline = aggregateTxn.deadline.adjustedValue.compact();
          initiator = aggregateTxn.signer.publicKey;
        }
      } catch (error) {}
    } else {
      deadline = txn.deadline.adjustedValue.compact();
    }

    formattedTxn.deadline = deadline;
    formattedTxn.initiator = initiator;

    return formattedTxn;
  }

  async formatConfirmedTransaction(
    txn: Transaction
  ): Promise<ConfirmedTransaction> {
    if (!txn.transactionInfo) {
      throw new Error("Service unavailable");
    }
    const transactionInfo: TransactionInfo | AggregateTransactionInfo =
      txn.transactionInfo;
    const txnHash =
      transactionInfo instanceof AggregateTransactionInfo
        ? transactionInfo.aggregateHash
        : transactionInfo.hash ?? "";

    let blockHeight: number = 0;
    let txnBytes: number = 0;
    let deadline = null;
    if (!txn.signer) {
      throw new Error("Service unavailable");
    }
    let initiator = txn.signer.publicKey;

    if (transactionInfo instanceof AggregateTransactionInfo) {
      const aggregateTxn = await this.autoFindAggregateTransaction(txnHash);
      if (!aggregateTxn || !aggregateTxn.signer) {
        throw new Error("Service unavailable");
      }
      initiator = aggregateTxn.signer.publicKey;
      blockHeight = transactionInfo.height.compact();
      //txnBytes = aggregateTxn.serialize().length / 2;
      //deadline = aggregateTxn.deadline.adjustedValue.compact();
    } else if (
      txn.type === TransactionType.AGGREGATE_BONDED ||
      txn.type === TransactionType.AGGREGATE_COMPLETE
    ) {
      let aggregateTxn: AggregateTransaction | null =
        txn as AggregateTransaction;

      if (aggregateTxn.innerTransactions.length === 0) {
        aggregateTxn = await this.autoFindAggregateTransaction(txnHash);
      }
      if (!aggregateTxn?.transactionInfo) {
        throw new Error("Service unavailable");
      }
      blockHeight = aggregateTxn.transactionInfo.height.compact();
      txnBytes = aggregateTxn.serialize().length / 2;
      deadline = aggregateTxn.deadline.adjustedValue.compact();
    } else {
      blockHeight = transactionInfo.height.compact();

      // wait SDK to fix
      try {
        txnBytes = txn.serialize().length / 2;
      } catch (error) {
        console.log(error);
      }

      deadline = txn.deadline.adjustedValue.compact();
    }
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const blockInfo = await AppState.chainAPI.blockAPI.getBlockByHeight(
      blockHeight
    );

    const fee = txnBytes * blockInfo.feeMultiplier;

    const formattedTxn: ConfirmedTransaction = new ConfirmedTransaction(
      txnHash
    );
    formattedTxn.block = blockHeight;
    formattedTxn.deadline = deadline;
    formattedTxn.type = TransactionUtils.getTransactionTypeName(txn.type);
    formattedTxn.maxFee =
      transactionInfo instanceof AggregateTransactionInfo
        ? null
        : DashboardService.convertToExactNativeAmount(txn.maxFee.compact());

    formattedTxn.signer = txn.signer.publicKey;
    formattedTxn.signerAddress = txn.signer.address.plain();
    formattedTxn.initiator = initiator;

    formattedTxn.fee = DashboardService.convertToExactNativeAmount(fee);

    if (transactionInfo instanceof AggregateTransactionInfo) {
      formattedTxn.fee = null;
    }

    formattedTxn.timestamp = new Date(
      blockInfo.timestamp.compact() + Deadline.timestampNemesisBlock * 1000
    ).toISOString();

    return formattedTxn;
  }

  searchAggregateTransaction(hash: string): AggregateTransaction | null {
    const txnFound = this.savedAggregateTxn.find(
      (txn) => txn.transactionInfo?.hash === hash
    );

    if (txnFound) {
      return txnFound;
    }

    return null;
  }

  async autoFindAggregateTransaction(
    hash: string
  ): Promise<AggregateTransaction | null> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const foundTxn = this.searchAggregateTransaction(hash);

    if (foundTxn) {
      return foundTxn;
    }

    let statusGroup = "";
    let txn: Transaction | null = null;

    while (
      txn === null &&
      statusGroup !== "confirmed" &&
      statusGroup !== "error"
    ) {
      try {
        const txnStatus =
          await AppState.chainAPI.transactionAPI.getTransactionStatus(hash);
        if (!txnStatus.group) {
          throw new Error("Service unavailable");
        }
        statusGroup = txnStatus.group;

        switch (statusGroup) {
          case TransactionGroupType.CONFIRMED:
            try {
              txn = await AppState.chainAPI.transactionAPI.getTransaction(hash);
            } catch (error) {
              statusGroup = "error";
            }

            break;

          case TransactionGroupType.UNCONFIRMED:
            try {
              txn =
                await AppState.chainAPI.transactionAPI.getUnconfirmedTransaction(
                  hash
                );
            } catch (error) {}
            break;
          case TransactionGroupType.PARTIAL:
            try {
              txn =
                await AppState.chainAPI.transactionAPI.getPartialTransaction(
                  hash
                );
            } catch (error) {}
            break;

          default:
            statusGroup = "error";
            break;
        }
      } catch (error) {
        statusGroup = "error";
      }
    }

    if (statusGroup === "error" || txn === null) {
      return null;
    } else {
      const aggregateTxn = txn as AggregateTransaction;
      this.addAggregateTxns(aggregateTxn as AggregateTransaction);
      return aggregateTxn;
    }
  }

  addAggregateTxns(txn: AggregateTransaction): boolean {
    const txnFound = this.savedAggregateTxn.find(
      (txn) => txn.transactionInfo?.hash === txn.transactionInfo?.hash
    );

    if (txnFound) {
      return false;
    } else {
      this.savedAggregateTxn.push(txn);
      return true;
    }
  }

  //-----------------------end-------------------------------

  /**
   * @param oldValue - string
   * @param valueChange - hex string
   * @param sizeDelta
   */
  static applyValueChange(
    oldValue: string,
    valueChange: string,
    sizeDelta: number
  ): string {
    const newSize = Convert.utf8ToHex(oldValue).length / 2 + sizeDelta;
    const oldValueBytes = Convert.hexToUint8(Convert.utf8ToHex(oldValue));
    const valueChangeBytes = Convert.hexToUint8(valueChange);

    const valueUint8Array = new Uint8Array(newSize);

    for (let i = 0; i < valueUint8Array.length; ++i) {
      valueUint8Array[i] = oldValueBytes[i] ^ valueChangeBytes[i];
    }

    return Convert.decodeHexToUtf8(Convert.uint8ToHex(valueUint8Array));
  }

  static async getAssetInfo(assetId: string): Promise<MosaicInfo> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const mosaicId = new MosaicId(assetId);
    const assetInfo = await AppState.chainAPI.assetAPI.getMosaic(mosaicId);

    return assetInfo;
  }

  static async getAssetName(assetId: string): Promise<MosaicNames> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const mosaicId = new MosaicId(assetId);
    const assetNames = await AppState.chainAPI.assetAPI.getMosaicsNames([
      mosaicId,
    ]);

    return assetNames[0];
  }

  static async getAssetsName(mosaicIds: MosaicId[]): Promise<MosaicNames[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const assetNames = await AppState.chainAPI.assetAPI.getMosaicsNames(
      mosaicIds
    );

    return assetNames;
  }

  static async getNamespacesName(
    namespaceIds: NamespaceId[]
  ): Promise<NamespaceName[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const namespacesName =
      await AppState.chainAPI.namespaceAPI.getNamespacesName(namespaceIds);

    return namespacesName;
  }

  static async getAddressAlias(namespaceId: NamespaceId): Promise<Address> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const address = await AppState.chainAPI.namespaceAPI.getLinkedAddress(
      namespaceId
    );

    return address;
  }

  static async getAssetAlias(namespaceId: NamespaceId): Promise<MosaicId> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const assetId = await AppState.chainAPI.namespaceAPI.getLinkedMosaicId(
      namespaceId
    );

    return assetId;
  }

  static async getAssetMetadata(
    assetId: MosaicId,
    scopedMetadataKey: UInt64
  ): Promise<MetadataEntry | null> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const metadataQP = new MetadataQueryParams();
    metadataQP.metadataType = MetadataType.MOSAIC;
    metadataQP.scopedMetadataKey = scopedMetadataKey;
    metadataQP.targetId = assetId;

    const metadataResult = await AppState.chainAPI.metadataAPI.searchMetadatas(
      metadataQP
    );

    return metadataResult.metadataEntries.length
      ? metadataResult.metadataEntries[0]
      : null;
  }

  static async getNamespaceMetadata(
    nsId: NamespaceId,
    scopedMetadataKey: UInt64
  ): Promise<MetadataEntry | null> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const metadataQP = new MetadataQueryParams();
    metadataQP.metadataType = MetadataType.NAMESPACE;
    metadataQP.scopedMetadataKey = scopedMetadataKey;
    metadataQP.targetId = nsId;

    const metadataResult = await AppState.chainAPI.metadataAPI.searchMetadatas(
      metadataQP
    );

    return metadataResult.metadataEntries.length
      ? metadataResult.metadataEntries[0]
      : null;
  }

  static async getAccountMetadata(
    targetKey: PublicAccount,
    scopedMetadataKey: UInt64
  ): Promise<MetadataEntry | null> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const metadataQP = new MetadataQueryParams();
    metadataQP.metadataType = MetadataType.ACCOUNT;
    metadataQP.scopedMetadataKey = scopedMetadataKey;
    metadataQP.targetKey = targetKey;

    const metadataResult = await AppState.chainAPI.metadataAPI.searchMetadatas(
      metadataQP
    );

    return metadataResult.metadataEntries.length
      ? metadataResult.metadataEntries[0]
      : null;
  }

  static async getRecipient(
    transferTxn: TransferTransaction,
    blockHeight: number
  ): Promise<Address | null> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }

    let recipient: Address | null = null;

    if (transferTxn.recipient instanceof NamespaceId) {
      const receipts = await AppState.chainAPI.blockAPI.getBlockReceipts(
        blockHeight
      );

      for (let i = 0; i < receipts.addressResolutionStatements.length; ++i) {
        const unresolved = receipts.addressResolutionStatements[i].unresolved;
        const resolved =
          receipts.addressResolutionStatements[i].resolutionEntries[0].resolved;
        if (unresolved instanceof MosaicId) {
          // actually is namespaceId
          const namespaceIdHex: string = unresolved.toHex();

          if (transferTxn.recipient.toHex() !== namespaceIdHex) {
            continue;
          }

          if (resolved instanceof AddressAlias) {
            return resolved.address;
            break;
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    } else {
      recipient = transferTxn.recipient;
    }

    return recipient;
  }

  static isNamespace(mosaicId: MosaicId): boolean {
    return Array.from(namespaceIdFirstCharacterString).includes(
      mosaicId.toHex().toUpperCase().substring(0, 1)
    );
  }

  static async getResolvedAsset(
    mosaicId: MosaicId,
    blockHeight: number
  ): Promise<MosaicId | null> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    let resolvedAsset: MosaicId | null = null;

    if (DashboardService.isNamespace(mosaicId)) {
      const receipts = await AppState.chainAPI.blockAPI.getBlockReceipts(
        blockHeight
      );

      for (let i = 0; i < receipts.mosaicResolutionStatements.length; ++i) {
        const unresolved = receipts.mosaicResolutionStatements[i].unresolved;
        const resolved =
          receipts.mosaicResolutionStatements[i].resolutionEntries[0].resolved;
        if (unresolved instanceof MosaicId) {
          // actually is namespaceId
          const namespaceIdHex: string = unresolved.toHex();

          if (mosaicId.toHex() !== namespaceIdHex) {
            continue;
          }

          if (resolved instanceof MosaicAlias) {
            resolvedAsset = resolved.mosaicId;
            break;
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    } else {
      resolvedAsset = mosaicId;
    }

    return resolvedAsset;
  }

  static getRestrictionTypeName(restrictionType: RestrictionType) {
    const restrictionTypeName = {
      action: "",
      type: "",
    };

    switch (restrictionType) {
      case RestrictionType.AllowAddress:
        restrictionTypeName.action = "Allow";
        restrictionTypeName.type = "Address";
        break;
      case RestrictionType.BlockAddress:
        restrictionTypeName.action = "Block";
        restrictionTypeName.type = "Address";
        break;
      case RestrictionType.AllowMosaic:
        restrictionTypeName.action = "Allow";
        restrictionTypeName.type = "SDA";
        break;
      case RestrictionType.BlockMosaic:
        restrictionTypeName.action = "Block";
        restrictionTypeName.type = "SDA";
        break;
      case RestrictionType.AllowTransaction:
        restrictionTypeName.action = "Allow";
        restrictionTypeName.type = "Transaction Type";
        break;
      case RestrictionType.BlockTransaction:
        restrictionTypeName.action = "Block";
        restrictionTypeName.type = "Transaction Type";
        break;
      default:
        break;
    }

    return restrictionTypeName;
  }

  async getAllAccountTransactions(): Promise<Transaction[]> {
    let transactions: Transaction[] = [];

    for (let i = 0; i < this.wallet.accounts.length; ++i) {
      const accountTransactions =
        await DashboardService.getAccountAllTransactions(
          this.wallet.accounts[i]
        );
      transactions = transactions.concat(accountTransactions);
    }

    for (let i = 0; i < this.wallet.others.length; ++i) {
      const accountTransactions =
        await DashboardService.getAccountAllTransactions(this.wallet.others[i]);
      transactions = transactions.concat(accountTransactions);
    }

    return transactions.filter(
      (transaction, index, array) =>
        index ===
        array.findIndex(
          (foundTx) =>
            foundTx.transactionInfo?.id === transaction.transactionInfo?.id
        )
    );
  }

  async getAllAccountUnconfirmedTransactions(): Promise<Transaction[]> {
    let transactions: Transaction[] = [];

    for (let i = 0; i < this.wallet.accounts.length; ++i) {
      const accountTransactions =
        await DashboardService.getAccountAllUnconfirmedTransactions(
          this.wallet.accounts[i]
        );
      transactions = transactions.concat(accountTransactions);
    }

    for (let i = 0; i < this.wallet.others.length; ++i) {
      const accountTransactions =
        await DashboardService.getAccountAllUnconfirmedTransactions(
          this.wallet.others[i]
        );
      transactions = transactions.concat(accountTransactions);
    }

    return transactions.filter(
      (transaction, index, array) =>
        index ===
        array.findIndex(
          (foundTx) =>
            foundTx.transactionInfo?.id === transaction.transactionInfo?.id
        )
    );
  }

  async getAllAccountPartialTransactions(): Promise<Transaction[]> {
    let transactions: Transaction[] = [];

    for (let i = 0; i < this.wallet.accounts.length; ++i) {
      const accountTransactions =
        await DashboardService.getAccountAllPartialTransactions(
          this.wallet.accounts[i]
        );
      transactions = transactions.concat(accountTransactions);
    }

    for (let i = 0; i < this.wallet.others.length; ++i) {
      const accountTransactions =
        await DashboardService.getAccountAllPartialTransactions(
          this.wallet.others[i]
        );
      transactions = transactions.concat(accountTransactions);
    }

    return transactions.filter(
      (transaction, index, array) =>
        index ===
        array.findIndex(
          (foundTx) =>
            foundTx.transactionInfo?.id === transaction.transactionInfo?.id
        )
    );
  }

  static async getAccountAllTransactions(
    account: myAccount
  ): Promise<Transaction[]> {
    let pageNum = 1;
    const publicAccount = Helper.createPublicAccount(
      account.publicKey,
      AppState.networkType
    );

    let fullTransaction: Transaction[] = [];
    const queryParams = new TransactionQueryParams();
    queryParams.pageSize = 100;
    queryParams.pageNumber = pageNum;

    let transactions: Transaction[] = await TransactionUtils.getTransactions(
      publicAccount,
      queryParams
    );

    fullTransaction = fullTransaction.concat(transactions);

    while (transactions.length === 100) {
      pageNum += 1;
      queryParams.pageNumber = pageNum;
      // queryParams = Helper.createQueryParams(100, lastId);
      transactions = await TransactionUtils.getTransactions(
        publicAccount,
        queryParams
      );
      fullTransaction = fullTransaction.concat(transactions);
    }

    return fullTransaction;
  }

  static async getAccountAllUnconfirmedTransactions(
    account: myAccount
  ): Promise<Transaction[]> {
    let pageNum = 1;
    const publicAccount = Helper.createPublicAccount(
      account.publicKey,
      AppState.networkType
    );

    let fullTransaction: Transaction[] = [];
    const queryParams = new TransactionQueryParams();
    queryParams.pageSize = 100;
    queryParams.pageNumber = pageNum;

    let transactions: Transaction[] =
      await TransactionUtils.getUnconfirmedTransactions(
        publicAccount,
        queryParams
      );

    fullTransaction = fullTransaction.concat(transactions);

    while (transactions.length === 100) {
      pageNum += 1;
      queryParams.pageNumber = pageNum;
      // queryParams = Helper.createQueryParams(100, lastId);
      transactions = await TransactionUtils.getUnconfirmedTransactions(
        publicAccount,
        queryParams
      );
      fullTransaction = fullTransaction.concat(transactions);
    }

    return fullTransaction;
  }

  static async getAccountAllPartialTransactions(
    account: myAccount
  ): Promise<Transaction[]> {
    let pageNum = 1;
    const publicAccount = Helper.createPublicAccount(
      account.publicKey,
      AppState.networkType
    );

    let fullTransaction: Transaction[] = [];
    const queryParams = new TransactionQueryParams();
    queryParams.pageSize = 100;
    queryParams.pageNumber = pageNum;

    let transactions: Transaction[] =
      await TransactionUtils.getPartialTransactions(publicAccount, queryParams);

    if (transactions) {
      fullTransaction = fullTransaction.concat(transactions);

      while (transactions && transactions.length === 100) {
        pageNum += 1;
        queryParams.pageNumber = pageNum;
        // queryParams = Helper.createQueryParams(100, lastId);
        transactions = await TransactionUtils.getPartialTransactions(
          publicAccount,
          queryParams
        );

        if (transactions) {
          fullTransaction = fullTransaction.concat(transactions);
        }
      }
    }

    return fullTransaction;
  }

  async getAccountTransactionsCount(account: myAccount) {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const transactionsCount = {
      confirmed: 0,
      unconfirmed: 0,
      partial: 0,
    };

    const txnQueryParams = new TransactionQueryParams();
    txnQueryParams.address = account.address;

    const searchConfirmedTxnResult =
      await AppState.chainAPI.transactionAPI.searchTransactions(
        TransactionGroupType.CONFIRMED,
        txnQueryParams
      );
    const searchUnconfirmedTxnResult =
      await AppState.chainAPI.transactionAPI.searchTransactions(
        TransactionGroupType.UNCONFIRMED,
        txnQueryParams
      );
    const searchPartialTxnResult =
      await AppState.chainAPI.transactionAPI.searchTransactions(
        TransactionGroupType.PARTIAL,
        txnQueryParams
      );

    transactionsCount.confirmed =
      searchConfirmedTxnResult.pagination.totalEntries;
    transactionsCount.unconfirmed =
      searchUnconfirmedTxnResult.pagination.totalEntries;
    transactionsCount.partial = searchPartialTxnResult.pagination.totalEntries;

    return transactionsCount;
  }

  convertToSwapType(txnMessage: string) {
    let newType = null;

    try {
      if (txnMessage) {
        const messageData = JSON.parse(txnMessage);

        if (messageData.type) {
          switch (messageData.type) {
            case "Swap":
              newType = "Swap" + " (nis1-XPX)";
              break;
            case "Swap-bsc-xpx":
              newType = "Swap" + " (BSC-XPX)";
              break;
            case "Swap-xpx-bsc":
              newType = "Swap" + " (XPX-BSC)";
              break;
            case "Swap-xpx-bsc-fees":
              newType = "Swap Fee" + " (XPX-BSC)";
              break;
            default:
              break;
          }
        }
      }
    } catch (error) {}

    return newType;
  }

  // -----------------------------------extract Transfer only---------------------------------------------------
  async extractConfirmedTransfer(
    transferTxn: TransferTransaction,
    blockNum: number
  ): Promise<InnerTransferTransaction> {
    if (!transferTxn.signer) {
      throw new Error("Service unavailable");
    }
    const txnDetails = new InnerTransferTransaction();

    txnDetails.signer = transferTxn.signer.publicKey;
    txnDetails.signerAddress = transferTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(transferTxn.type);

    const sdas: SDA[] = [];

    txnDetails.message = transferTxn.message.payload;
    txnDetails.messageType = transferTxn.message.type;

    if (txnDetails.messageType === MessageType.PlainMessage) {
      const newType = this.convertToSwapType(txnDetails.message);

      if (newType) {
        txnDetails.type = newType;
      }
    }
    switch (txnDetails.messageType) {
      case MessageType.PlainMessage:
        txnDetails.messageTypeTitle = "Plain Message";
        break;
      case MessageType.EncryptedMessage:
        txnDetails.messageTypeTitle = "Encrypted Message";
        break;
      case MessageType.HexadecimalMessage:
        txnDetails.messageTypeTitle = "Hexadecimal Message";
        break;
    }

    if (transferTxn.recipient instanceof NamespaceId) {
      txnDetails.recipientNamespaceId = transferTxn.recipient.toHex();
      const namespacesName = await DashboardService.getNamespacesName([
        transferTxn.recipient,
      ]);
      txnDetails.recipientNamespaceName = namespacesName[0].name;
    }

    const recipient = await DashboardService.getRecipient(
      transferTxn,
      blockNum
    );
    if (recipient) {
      txnDetails.recipient = recipient.plain();
    }
    txnDetails.sender = transferTxn.signer.address.plain();
    txnDetails.in_out =
      this.selectedAccount.address === txnDetails.sender ? false : true;

    for (let y = 0; y < transferTxn.mosaics.length; ++y) {
      const rawAmount = transferTxn.mosaics[y].amount.compact();
      const actualAmount = rawAmount;
      const isSendWithNamespace = DashboardService.isNamespace(
        transferTxn.mosaics[y].id
      );
      const assetId = await DashboardService.getResolvedAsset(
        transferTxn.mosaics[y].id,
        blockNum
      );
      if (!assetId) {
        throw new Error("Service unavailable");
      }
      const assetIdHex = assetId.toHex();

      if (
        [AppState.nativeToken.assetId, nativeTokenNamespaceId.value].includes(
          assetIdHex
        )
      ) {
        txnDetails.amountTransfer =
          DashboardService.convertToExactNativeAmount(actualAmount);
        continue;
      }

      const newSDA: SDA = {
        amount: rawAmount,
        divisibility: 0,
        id: assetIdHex,
        amountIsRaw: true,
        sendWithNamespace: isSendWithNamespace,
      };

      if (isSendWithNamespace) {
        const namespaceId = transferTxn.mosaics[y].id;

        newSDA.sendWithAlias = {
          idHex: namespaceId.toHex(),
          id: namespaceId.toDTO().id,
        };
      }

      sdas.push(newSDA);
    }

    const namespaceIds = sdas
      .filter((sda) => sda.sendWithNamespace)
      .map((sda) => {
        if (!sda.sendWithAlias) {
          throw new Error("Service unavailable");
        }
        return Helper.createNamespaceId(sda.sendWithAlias.id);
      });

    const allAssetId = sdas
      .filter((sda) => {
        return sda.amountIsRaw;
      })
      .map((sda) => Helper.createAssetId(sda.id));
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    if (namespaceIds.length || allAssetId.length) {
      let namespacesNames: NamespaceName[] = [];
      namespacesNames = await AppState.chainAPI.namespaceAPI.getNamespacesName(
        namespaceIds
      );
      const assetsProperties = await AppState.chainAPI.assetAPI.getMosaics(
        allAssetId
      );
      const aliasNames: MosaicNames[] =
        await AppState.chainAPI.assetAPI.getMosaicsNames(allAssetId);

      for (let x = 0; x < sdas.length; ++x) {
        const assetProperties = assetsProperties.filter(
          (aliasName) => aliasName.mosaicId.toHex() === sdas[x].id
        )[0];

        sdas[x].divisibility = assetProperties.divisibility;
        sdas[x].amount = DashboardService.convertToExactAmount(
          sdas[x].amount,
          assetProperties.divisibility
        );
        sdas[x].amountIsRaw = false;

        const mosaicNames: MosaicNames = aliasNames.filter(
          (aliaName) => aliaName.mosaicId.toHex() === sdas[x].id
        )[0];
        const currentAliasNames: NamespaceName[] = mosaicNames.names;
        sdas[x].currentAlias = currentAliasNames.map((currentAlias) => {
          return {
            name: currentAlias.name,
            id: currentAlias.namespaceId.toDTO().id,
            idHex: currentAlias.namespaceId.toHex(),
          };
        });
        const { sendWithAlias } = sdas[x];
        if (sendWithAlias) {
          sendWithAlias.name = namespacesNames
            .filter(
              (nsName) => nsName.namespaceId.toHex() === sendWithAlias.idHex
            )
            .map((nsName) => nsName.name)[0];
        }
      }
    }
    txnDetails.sda = sdas;
    return txnDetails;
  }

  async extractUnconfirmedTransfer(
    transferTxn: TransferTransaction
  ): Promise<InnerTransferTransaction> {
    const txnDetails = await this.extractPartialTransfer(transferTxn);

    if (txnDetails.messageType === MessageType.PlainMessage) {
      const newType = this.convertToSwapType(txnDetails.message ?? "");

      if (newType) {
        txnDetails.type = newType;
      }
    }
    return txnDetails;
  }

  async extractPartialTransfer(
    transferTxn: TransferTransaction
  ): Promise<InnerTransferTransaction> {
    const txnDetails = new InnerTransferTransaction();
    if (!transferTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = transferTxn.signer.publicKey;
    txnDetails.signerAddress = transferTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(transferTxn.type);

    const sdas: SDA[] = [];

    txnDetails.message = transferTxn.message.payload;
    txnDetails.messageType = transferTxn.message.type;

    switch (txnDetails.messageType) {
      case MessageType.PlainMessage:
        txnDetails.messageTypeTitle = "Plain Message";
        break;
      case MessageType.EncryptedMessage:
        txnDetails.messageTypeTitle = "Encrypted Message";
        break;
      case MessageType.HexadecimalMessage:
        txnDetails.messageTypeTitle = "Hexadecimal Message";
        break;
    }

    let recipient;

    if (transferTxn.recipient instanceof NamespaceId) {
      txnDetails.recipientNamespaceId = transferTxn.recipient.toHex();
      recipient = await DashboardService.getAddressAlias(transferTxn.recipient);
      const namespacesName = await DashboardService.getNamespacesName([
        transferTxn.recipient,
      ]);
      txnDetails.recipientNamespaceName = namespacesName[0].name;
    } else {
      recipient = transferTxn.recipient;
    }

    txnDetails.recipient = recipient.plain();
    txnDetails.sender = transferTxn.signer.address.plain();
    txnDetails.in_out =
      this.selectedAccount.address === txnDetails.sender ? false : true;

    for (let y = 0; y < transferTxn.mosaics.length; ++y) {
      const rawAmount = transferTxn.mosaics[y].amount.compact();
      const actualAmount = rawAmount;

      let assetId;
      const isSendWithNamespace = DashboardService.isNamespace(
        transferTxn.mosaics[y].id
      );

      if (isSendWithNamespace) {
        const namespaceId = new NamespaceId(
          transferTxn.mosaics[y].id.toDTO().id
        );
        assetId = await DashboardService.getAssetAlias(namespaceId);
      } else {
        assetId = transferTxn.mosaics[y].id;
      }

      const assetIdHex = assetId.toHex();

      if (
        [AppState.nativeToken.assetId, nativeTokenNamespaceId.value].includes(
          assetIdHex
        )
      ) {
        txnDetails.amountTransfer =
          DashboardService.convertToExactNativeAmount(actualAmount);
        continue;
      }

      const newSDA: SDA = {
        amount: rawAmount,
        divisibility: 0,
        id: assetIdHex,
        amountIsRaw: true,
        sendWithNamespace: isSendWithNamespace,
      };

      if (isSendWithNamespace) {
        const namespaceId = transferTxn.mosaics[y].id;

        newSDA.sendWithAlias = {
          idHex: namespaceId.toHex(),
          id: namespaceId.toDTO().id,
        };
      }

      sdas.push(newSDA);
    }

    const namespaceIds = sdas
      .filter((sda) => sda.sendWithNamespace)
      .map((sda) => {
        if (!sda.sendWithAlias) {
          throw new Error("Service unavailable");
        }
        return Helper.createNamespaceId(sda.sendWithAlias.id);
      });

    const allAssetId = sdas
      .filter((sda) => {
        return sda.amountIsRaw;
      })
      .map((sda) => Helper.createAssetId(sda.id));
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    if (namespaceIds.length || allAssetId.length) {
      let namespacesNames: NamespaceName[] = [];
      namespacesNames = await AppState.chainAPI.namespaceAPI.getNamespacesName(
        namespaceIds
      );
      const assetsProperties = await AppState.chainAPI.assetAPI.getMosaics(
        allAssetId
      );
      const aliasNames: MosaicNames[] =
        await AppState.chainAPI.assetAPI.getMosaicsNames(allAssetId);

      for (let x = 0; x < sdas.length; ++x) {
        const assetProperties = assetsProperties.filter(
          (aliasName) => aliasName.mosaicId.toHex() === sdas[x].id
        )[0];

        sdas[x].divisibility = assetProperties.divisibility;
        sdas[x].amount = DashboardService.convertToExactAmount(
          sdas[x].amount,
          assetProperties.divisibility
        );
        sdas[x].amountIsRaw = false;

        const mosaicNames: MosaicNames = aliasNames.filter(
          (aliaName) => aliaName.mosaicId.toHex() === sdas[x].id
        )[0];
        const currentAliasNames: NamespaceName[] = mosaicNames.names;
        sdas[x].currentAlias = currentAliasNames.map((currentAlias) => {
          return {
            name: currentAlias.name,
            id: currentAlias.namespaceId.toDTO().id,
            idHex: currentAlias.namespaceId.toHex(),
          };
        });
        const { sendWithAlias } = sdas[x];
        if (sendWithAlias) {
          sendWithAlias.name = namespacesNames
            .filter(
              (nsName) => nsName.namespaceId.toHex() === sendWithAlias.idHex
            )
            .map((nsName) => nsName.name)[0];
        }
      }
    }
    txnDetails.sda = sdas;
    return txnDetails;
  }

  async extractNonconfirmedTransfer(
    transferTxn: TransferTransaction,
    txnGroupType: TransactionGroupType = TransactionGroupType.UNCONFIRMED
  ): Promise<InnerTransferTransaction> {
    if (txnGroupType === TransactionGroupType.UNCONFIRMED) {
      return await this.extractUnconfirmedTransfer(transferTxn);
    } else {
      return await this.extractPartialTransfer(transferTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Modify Multisig only---------------------------------------------------
  async extractConfirmedModifyMultisig(
    modifyMultisigTxn: ModifyMultisigAccountTransaction
  ): Promise<InnerAccountTransaction> {
    const txnDetails = new InnerAccountTransaction();
    if (!modifyMultisigTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = modifyMultisigTxn.signer.publicKey;
    txnDetails.signerAddress = modifyMultisigTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      modifyMultisigTxn.type
    );

    txnDetails.approvalDelta = modifyMultisigTxn.minApprovalDelta;
    txnDetails.removalDelta = modifyMultisigTxn.minRemovalDelta;
    txnDetails.addedCosigner = modifyMultisigTxn.modifications
      .filter((x) => x.type === MultisigCosignatoryModificationType.Add)
      .map((x) => x.cosignatoryPublicAccount.publicKey);
    txnDetails.removedCosigner = modifyMultisigTxn.modifications
      .filter((x) => x.type === MultisigCosignatoryModificationType.Remove)
      .map((x) => x.cosignatoryPublicAccount.publicKey);

    return txnDetails;
  }

  async extractUnconfirmedModifyMultisig(
    modifyMultisigTxn: ModifyMultisigAccountTransaction
  ): Promise<InnerAccountTransaction> {
    return await this.extractPartialModifyMultisig(modifyMultisigTxn);
  }

  async extractPartialModifyMultisig(
    modifyMultisigTxn: ModifyMultisigAccountTransaction
  ): Promise<InnerAccountTransaction> {
    const txnDetails = new InnerAccountTransaction();
    if (!modifyMultisigTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = modifyMultisigTxn.signer.publicKey;
    txnDetails.signerAddress = modifyMultisigTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      modifyMultisigTxn.type
    );

    txnDetails.approvalDelta = modifyMultisigTxn.minApprovalDelta;
    txnDetails.removalDelta = modifyMultisigTxn.minRemovalDelta;
    txnDetails.addedCosigner = modifyMultisigTxn.modifications
      .filter((x) => x.type === MultisigCosignatoryModificationType.Add)
      .map((x) => x.cosignatoryPublicAccount.publicKey);
    txnDetails.removedCosigner = modifyMultisigTxn.modifications
      .filter((x) => x.type === MultisigCosignatoryModificationType.Remove)
      .map((x) => x.cosignatoryPublicAccount.publicKey);
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    try {
      const multisigInfo =
        await AppState.chainAPI.accountAPI.getMultisigAccountInfo(
          modifyMultisigTxn.signer.address
        );

      if (multisigInfo) {
        txnDetails.oldApprovalNumber = multisigInfo.minApproval;
        txnDetails.oldRemovalNumber = multisigInfo.minRemoval;
      }
    } catch (error) {
      txnDetails.oldApprovalNumber = 0;
      txnDetails.oldRemovalNumber = 0;
    }

    return txnDetails;
  }

  async extractModifyMultisig(
    modifyMultisigTxn: ModifyMultisigAccountTransaction,
    txnGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED
  ): Promise<InnerAccountTransaction> {
    if (txnGroupType === TransactionGroupType.CONFIRMED) {
      return await this.extractConfirmedModifyMultisig(modifyMultisigTxn);
    } else if (txnGroupType === TransactionGroupType.UNCONFIRMED) {
      return await this.extractUnconfirmedModifyMultisig(modifyMultisigTxn);
    } else {
      return await this.extractPartialModifyMultisig(modifyMultisigTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Address Alias only---------------------------------------------------
  async extractAddressAlias(
    addressAliasTxn: AddressAliasTransaction
  ): Promise<InnerAliasTransaction> {
    const txnDetails = new InnerAliasTransaction();
    if (!addressAliasTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = addressAliasTxn.signer.publicKey;
    txnDetails.signerAddress = addressAliasTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      addressAliasTxn.type
    );

    txnDetails.address = addressAliasTxn.address.plain();
    txnDetails.aliasType = addressAliasTxn.actionType;
    txnDetails.aliasTypeName =
      addressAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";

    const nsId = addressAliasTxn.namespaceId;

    try {
      const nsName = await DashboardService.getNamespacesName([nsId]);

      txnDetails.aliasName = nsName[0].name;
    } catch (error) {}

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Asset Alias only---------------------------------------------------
  async extractAssetAlias(
    assetAliasTxn: MosaicAliasTransaction
  ): Promise<InnerAliasTransaction> {
    const txnDetails = new InnerAliasTransaction();
    if (!assetAliasTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = assetAliasTxn.signer.publicKey;
    txnDetails.signerAddress = assetAliasTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      assetAliasTxn.type
    );

    txnDetails.assetId = assetAliasTxn.mosaicId.toHex();
    txnDetails.aliasType = assetAliasTxn.actionType;
    txnDetails.aliasTypeName =
      assetAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";

    const nsId = assetAliasTxn.namespaceId;

    try {
      const nsName = await DashboardService.getNamespacesName([nsId]);

      txnDetails.aliasName = nsName[0].name;
    } catch (error) {}

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Account Metadata_v2 only---------------------------------------------------
  async extractConfirmedAccountMetadata(
    accMetadataTxn: AccountMetadataTransaction
  ): Promise<InnerMetadataTransaction> {
    const txnDetails = new InnerMetadataTransaction();
    if (!accMetadataTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = accMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = accMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      accMetadataTxn.type
    );

    txnDetails.metadataType = MetadataType.ACCOUNT;
    txnDetails.metadataTypeName = "Account";

    txnDetails.scopedMetadataKey = accMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetPublicKey = accMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = accMetadataTxn.valueSizeDelta;

    return txnDetails;
  }

  async extractUnconfirmedAccountMetadata(
    accMetadataTxn: AccountMetadataTransaction
  ): Promise<InnerMetadataTransaction> {
    return await this.extractPartialAccountMetadata(accMetadataTxn);
  }

  async extractPartialAccountMetadata(
    accMetadataTxn: AccountMetadataTransaction
  ): Promise<InnerMetadataTransaction> {
    const txnDetails = new InnerMetadataTransaction();
    if (!accMetadataTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = accMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = accMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      accMetadataTxn.type
    );

    txnDetails.metadataType = MetadataType.ACCOUNT;
    txnDetails.metadataTypeName = "Account";

    txnDetails.scopedMetadataKey = accMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetPublicKey = accMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = accMetadataTxn.valueSizeDelta;
    txnDetails.valueChange = Convert.uint8ToHex(
      accMetadataTxn.valueDifferences
    );

    try {
      const nsMetadataEntry = await DashboardService.getAccountMetadata(
        accMetadataTxn.targetPublicKey,
        accMetadataTxn.scopedMetadataKey
      );

      if (nsMetadataEntry) {
        txnDetails.oldValue = nsMetadataEntry.value;
        txnDetails.newValue = DashboardService.applyValueChange(
          txnDetails.oldValue,
          txnDetails.valueChange,
          txnDetails.sizeChanged
        );
      } else {
        txnDetails.newValue = DashboardService.applyValueChange(
          "",
          txnDetails.valueChange,
          txnDetails.sizeChanged
        );
      }
    } catch (error) {}

    return txnDetails;
  }

  async extractAccMetadata(
    accMetadataTxn: AccountMetadataTransaction,
    txnGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED
  ): Promise<InnerMetadataTransaction> {
    if (txnGroupType === TransactionGroupType.CONFIRMED) {
      return await this.extractConfirmedAccountMetadata(accMetadataTxn);
    } else if (txnGroupType === TransactionGroupType.UNCONFIRMED) {
      return await this.extractUnconfirmedAccountMetadata(accMetadataTxn);
    } else {
      return await this.extractPartialAccountMetadata(accMetadataTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Namespace Metadata_v2 only---------------------------------------------------
  async extractConfirmedNamespaceMetadata(
    nsMetadataTxn: NamespaceMetadataTransaction
  ): Promise<InnerMetadataTransaction> {
    const txnDetails = new InnerMetadataTransaction();
    if (!nsMetadataTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = nsMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = nsMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      nsMetadataTxn.type
    );

    const nsId = nsMetadataTxn.targetNamespaceId.toHex();

    txnDetails.metadataType = MetadataType.NAMESPACE;
    txnDetails.metadataTypeName = "Namespace";
    txnDetails.scopedMetadataKey = nsMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetId = nsId;
    txnDetails.targetPublicKey = nsMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = nsMetadataTxn.valueSizeDelta;

    try {
      const nsName = await DashboardService.getNamespacesName([
        NamespaceId.createFromEncoded(nsId),
      ]);

      if (nsName.length) {
        txnDetails.targetIdName = nsName[0].name;
      }
    } catch (error) {}

    return txnDetails;
  }

  async extractUnconfirmedNamespaceMetadata(
    nsMetadataTxn: NamespaceMetadataTransaction
  ): Promise<InnerMetadataTransaction> {
    return await this.extractPartialNamespaceMetadata(nsMetadataTxn);
  }

  async extractPartialNamespaceMetadata(
    nsMetadataTxn: NamespaceMetadataTransaction
  ): Promise<InnerMetadataTransaction> {
    const txnDetails = new InnerMetadataTransaction();
    if (!nsMetadataTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = nsMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = nsMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      nsMetadataTxn.type
    );

    const nsId = nsMetadataTxn.targetNamespaceId.toHex();

    txnDetails.metadataType = MetadataType.NAMESPACE;
    txnDetails.metadataTypeName = "Namespace";
    txnDetails.scopedMetadataKey = nsMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetId = nsId;
    txnDetails.targetPublicKey = nsMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = nsMetadataTxn.valueSizeDelta;
    txnDetails.valueChange = Convert.uint8ToHex(nsMetadataTxn.valueDifferences);

    try {
      const nsName = await DashboardService.getNamespacesName([
        NamespaceId.createFromEncoded(nsId),
      ]);

      if (nsName.length) {
        txnDetails.targetIdName = nsName[0].name;
      }

      const nsMetadataEntry = await DashboardService.getNamespaceMetadata(
        nsMetadataTxn.targetNamespaceId,
        nsMetadataTxn.scopedMetadataKey
      );

      if (nsMetadataEntry) {
        txnDetails.oldValue = nsMetadataEntry.value;
        txnDetails.newValue = DashboardService.applyValueChange(
          txnDetails.oldValue,
          txnDetails.valueChange,
          txnDetails.sizeChanged
        );
      } else {
        txnDetails.newValue = DashboardService.applyValueChange(
          "",
          txnDetails.valueChange,
          txnDetails.sizeChanged
        );
      }
    } catch (error) {}

    return txnDetails;
  }

  async extractNamespaceMetadata(
    nsMetadataTxn: NamespaceMetadataTransaction,
    txnGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED
  ): Promise<InnerMetadataTransaction> {
    if (txnGroupType === TransactionGroupType.CONFIRMED) {
      return await this.extractConfirmedNamespaceMetadata(nsMetadataTxn);
    } else if (txnGroupType === TransactionGroupType.UNCONFIRMED) {
      return await this.extractUnconfirmedNamespaceMetadata(nsMetadataTxn);
    } else {
      return await this.extractPartialNamespaceMetadata(nsMetadataTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Asset Metadata_v2 only---------------------------------------------------
  async extractConfirmedAssetMetadata(
    assetMetadataTxn: MosaicMetadataTransaction
  ): Promise<InnerMetadataTransaction> {
    const txnDetails = new InnerMetadataTransaction();
    if (!assetMetadataTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = assetMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = assetMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      assetMetadataTxn.type
    );

    const assetId = assetMetadataTxn.targetMosaicId.toHex();

    txnDetails.metadataType = MetadataType.MOSAIC;
    txnDetails.metadataTypeName = "Asset";
    txnDetails.scopedMetadataKey = assetMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetId = assetId;
    txnDetails.targetPublicKey = assetMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = assetMetadataTxn.valueSizeDelta;

    try {
      const assetName = await DashboardService.getAssetName(assetId);

      if (assetName.names.length) {
        txnDetails.targetIdName = assetName.names[0].name;
      }
    } catch (error) {}

    return txnDetails;
  }

  async extractUnconfirmedAssetMetadata(
    assetMetadataTxn: MosaicMetadataTransaction
  ): Promise<InnerMetadataTransaction> {
    return await this.extractPartialAssetMetadata(assetMetadataTxn);
  }

  async extractPartialAssetMetadata(
    assetMetadataTxn: MosaicMetadataTransaction
  ): Promise<InnerMetadataTransaction> {
    const txnDetails = new InnerMetadataTransaction();
    if (!assetMetadataTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = assetMetadataTxn.signer.publicKey;
    txnDetails.signerAddress = assetMetadataTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      assetMetadataTxn.type
    );

    const assetId = assetMetadataTxn.targetMosaicId.toHex();

    txnDetails.metadataType = MetadataType.MOSAIC;
    txnDetails.metadataTypeName = "Asset";
    txnDetails.scopedMetadataKey = assetMetadataTxn.scopedMetadataKey.toHex();
    txnDetails.targetId = assetId;
    txnDetails.targetPublicKey = assetMetadataTxn.targetPublicKey.publicKey;
    txnDetails.sizeChanged = assetMetadataTxn.valueSizeDelta;
    txnDetails.valueChange = Convert.uint8ToHex(
      assetMetadataTxn.valueDifferences
    );

    try {
      const assetName = await DashboardService.getAssetName(assetId);

      if (assetName.names.length) {
        txnDetails.targetIdName = assetName.names[0].name;
      }

      const assetMetadataEntry = await DashboardService.getAssetMetadata(
        assetMetadataTxn.targetMosaicId,
        assetMetadataTxn.scopedMetadataKey
      );

      if (assetMetadataEntry) {
        txnDetails.oldValue = assetMetadataEntry.value;
        txnDetails.newValue = DashboardService.applyValueChange(
          txnDetails.oldValue,
          txnDetails.valueChange,
          txnDetails.sizeChanged
        );
      } else {
        txnDetails.newValue = DashboardService.applyValueChange(
          "",
          txnDetails.valueChange,
          txnDetails.sizeChanged
        );
      }
    } catch (error) {}

    return txnDetails;
  }

  async extractAssetMetadata(
    assetMetadataTxn: MosaicMetadataTransaction,
    txnGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED
  ): Promise<InnerMetadataTransaction> {
    if (txnGroupType === TransactionGroupType.CONFIRMED) {
      return await this.extractConfirmedAssetMetadata(assetMetadataTxn);
    } else if (txnGroupType === TransactionGroupType.UNCONFIRMED) {
      return await this.extractUnconfirmedAssetMetadata(assetMetadataTxn);
    } else {
      return await this.extractPartialAssetMetadata(assetMetadataTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Secret Proof only---------------------------------------------------
  extractSecretProof(
    secretProofTxn: SecretProofTransaction
  ): InnerSecretTransaction {
    const txnDetails = new InnerSecretTransaction();
    if (!secretProofTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = secretProofTxn.signer.publicKey;
    txnDetails.signerAddress = secretProofTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      secretProofTxn.type
    );

    txnDetails.secret = secretProofTxn.secret;
    txnDetails.recipient = secretProofTxn.recipient.plain();
    txnDetails.hashType = myHashType[secretProofTxn.hashType];
    txnDetails.proof = secretProofTxn.proof;

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Secret Lock only---------------------------------------------------
  async extractConfirmedSecretLock(
    secretLockTxn: SecretLockTransaction,
    blockNum: number
  ): Promise<InnerSecretTransaction> {
    const txnDetails = new InnerSecretTransaction();
    if (!secretLockTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = secretLockTxn.signer.publicKey;
    txnDetails.signerAddress = secretLockTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      secretLockTxn.type
    );

    txnDetails.duration = secretLockTxn.duration.compact();
    txnDetails.secret = secretLockTxn.secret;
    txnDetails.recipient = secretLockTxn.recipient.plain();
    txnDetails.amount = secretLockTxn.mosaic.amount.compact();
    txnDetails.hashType = myHashType[secretLockTxn.hashType];

    const isNamespace = DashboardService.isNamespace(secretLockTxn.mosaic.id);
    const resolvedAssetId = await DashboardService.getResolvedAsset(
      secretLockTxn.mosaic.id,
      blockNum
    );
    if (!resolvedAssetId) {
      throw new Error("Service unavailable");
    }
    txnDetails.assetId = resolvedAssetId.toHex();

    try {
      if (!isNamespace) {
        const assetsNames = await DashboardService.getAssetsName([
          secretLockTxn.mosaic.id,
        ]);

        if (assetsNames[0].names.length) {
          txnDetails.namespaceName = assetsNames[0].names[0].name;
        }
      } else {
        txnDetails.isSendWithNamespace = true;
        const namespaceId = new NamespaceId(secretLockTxn.mosaic.id.toDTO().id);

        const nsNames = await DashboardService.getNamespacesName([namespaceId]);
        txnDetails.namespaceName = nsNames[0].name;
      }

      if (
        txnDetails.namespaceName &&
        txnDetails.namespaceName === AppState.nativeToken.fullNamespace
      ) {
        txnDetails.namespaceName = AppState.nativeToken.label;
      }

      const assetInfo = await DashboardService.getAssetInfo(txnDetails.assetId);

      if (assetInfo.divisibility > 0) {
        txnDetails.amount = DashboardService.convertToExactAmount(
          txnDetails.amount,
          assetInfo.divisibility
        );
      }

      txnDetails.amountIsRaw = false;
    } catch (error) {}
    return txnDetails;
  }

  async extractUnconfirmedSecretLock(
    secretLockTxn: SecretLockTransaction
  ): Promise<InnerSecretTransaction> {
    return this.extractPartialSecretLock(secretLockTxn);
  }

  async extractPartialSecretLock(
    secretLockTxn: SecretLockTransaction
  ): Promise<InnerSecretTransaction> {
    const txnDetails = new InnerSecretTransaction();
    if (!secretLockTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = secretLockTxn.signer.publicKey;
    txnDetails.signerAddress = secretLockTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      secretLockTxn.type
    );

    txnDetails.duration = secretLockTxn.duration.compact();
    txnDetails.secret = secretLockTxn.secret;
    txnDetails.recipient = secretLockTxn.recipient.plain();
    txnDetails.amount = secretLockTxn.mosaic.amount.compact();
    txnDetails.hashType = myHashType[secretLockTxn.hashType];

    const isNamespace = DashboardService.isNamespace(secretLockTxn.mosaic.id);

    try {
      if (!isNamespace) {
        txnDetails.assetId = secretLockTxn.mosaic.id.toHex();

        const assetsNames = await DashboardService.getAssetsName([
          secretLockTxn.mosaic.id,
        ]);

        if (assetsNames[0].names.length) {
          txnDetails.namespaceName = assetsNames[0].names[0].name;
        }
      } else {
        const namespaceId = new NamespaceId(secretLockTxn.mosaic.id.toDTO().id);
        const linkedAssetId = await DashboardService.getAssetAlias(namespaceId);

        txnDetails.assetId = linkedAssetId.toHex();
        txnDetails.isSendWithNamespace = true;

        const nsNames = await DashboardService.getNamespacesName([namespaceId]);
        txnDetails.namespaceName = nsNames[0].name;
      }

      if (
        txnDetails.namespaceName &&
        txnDetails.namespaceName === AppState.nativeToken.fullNamespace
      ) {
        txnDetails.namespaceName = AppState.nativeToken.label;
      }

      const assetInfo = await DashboardService.getAssetInfo(txnDetails.assetId);

      if (assetInfo.divisibility > 0) {
        txnDetails.amount = DashboardService.convertToExactAmount(
          txnDetails.amount,
          assetInfo.divisibility
        );
      }

      txnDetails.amountIsRaw = false;
    } catch (error) {}

    return txnDetails;
  }

  async extractNonconfirmedSecretLock(
    secretLockTxn: SecretLockTransaction,
    txnGroupType: TransactionGroupType = TransactionGroupType.UNCONFIRMED
  ): Promise<InnerSecretTransaction> {
    if (txnGroupType === TransactionGroupType.UNCONFIRMED) {
      return await this.extractUnconfirmedSecretLock(secretLockTxn);
    } else {
      return await this.extractPartialSecretLock(secretLockTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Register Namespace only---------------------------------------------------
  async extractRegisterNamespace(
    registerNSTxn: RegisterNamespaceTransaction
  ): Promise<InnerNamespaceTransaction> {
    const txnDetails = new InnerNamespaceTransaction();
    if (!registerNSTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = registerNSTxn.signer.publicKey;
    txnDetails.signerAddress = registerNSTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      registerNSTxn.type
    );

    txnDetails.namespaceName = registerNSTxn.namespaceName;

    if (registerNSTxn.namespaceType === NamespaceType.RootNamespace) {
      txnDetails.duration = registerNSTxn.duration?.compact();
      txnDetails.registerType = NamespaceType.RootNamespace;
      txnDetails.registerTypeName = "Root namespace";
      if (!AppState.chainAPI) {
        throw new Error("Service unavailable");
      }
      try {
        await AppState.chainAPI.namespaceAPI.getNamespace(
          registerNSTxn.namespaceId
        );

        txnDetails.isExtend = true;
      } catch (error) {}
    } else {
      if (!registerNSTxn.parentId) {
        throw new Error("Service unavailable");
      }
      txnDetails.registerType = NamespaceType.SubNamespace;
      txnDetails.registerTypeName = "Sub namespace";
      txnDetails.parentId = registerNSTxn.parentId.toHex();
      const namespaceName = await DashboardService.getNamespacesName([
        registerNSTxn.parentId,
      ]);
      txnDetails.parentName = namespaceName[0].name;
    }

    txnDetails.namespaceId = registerNSTxn.namespaceId.toHex();

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Asset Definition only---------------------------------------------------
  extractAssetDefinition(
    assetDefTxn: MosaicDefinitionTransaction
  ): InnerAssetTransaction {
    const txnDetails = new InnerAssetTransaction();
    if (!assetDefTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = assetDefTxn.signer.publicKey;
    txnDetails.signerAddress = assetDefTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(assetDefTxn.type);

    txnDetails.assetId = assetDefTxn.mosaicId.toHex();
    txnDetails.divisibility = assetDefTxn.mosaicProperties.divisibility;
    txnDetails.duration = assetDefTxn.mosaicProperties.duration
      ? assetDefTxn.mosaicProperties.duration.compact()
      : undefined;
    txnDetails.transferable = assetDefTxn.mosaicProperties.transferable;
    txnDetails.supplyMutable = assetDefTxn.mosaicProperties.supplyMutable;
    txnDetails.nonce = assetDefTxn.mosaicNonce.toNumber();

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Asset Supply Change only---------------------------------------------------
  async extractAssetSupplyChange(
    assetSupplyChangeTxn: MosaicSupplyChangeTransaction
  ): Promise<InnerAssetTransaction> {
    const txnDetails = new InnerAssetTransaction();
    if (!assetSupplyChangeTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = assetSupplyChangeTxn.signer.publicKey;
    txnDetails.signerAddress = assetSupplyChangeTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      assetSupplyChangeTxn.type
    );

    const assetId = assetSupplyChangeTxn.mosaicId.toHex();

    txnDetails.assetId = assetId;
    txnDetails.supplyDelta = assetSupplyChangeTxn.delta.compact();
    txnDetails.supplyDeltaIsRaw = true;

    if (assetSupplyChangeTxn.direction === MosaicSupplyType.Decrease) {
      txnDetails.supplyDelta = -txnDetails.supplyDelta;
    }

    try {
      const assetInfo = await DashboardService.getAssetInfo(assetId);

      txnDetails.supplyDelta = DashboardService.convertToExactAmount(
        txnDetails.supplyDelta,
        assetInfo.divisibility
      );

      txnDetails.supplyDeltaIsRaw = false;
    } catch (error) {}

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Asset Modify Levy only---------------------------------------------------
  async extractAssetModifyLevy(
    assetModifyLevyTxn: MosaicModifyLevyTransaction
  ): Promise<InnerAssetTransaction> {
    const txnDetails = new InnerAssetTransaction();
    if (!assetModifyLevyTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = assetModifyLevyTxn.signer.publicKey;
    txnDetails.signerAddress = assetModifyLevyTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      assetModifyLevyTxn.type
    );

    const assetId = assetModifyLevyTxn.mosaicId.toHex();
    const levyAssetId = assetModifyLevyTxn.mosaicLevy.mosaicId.toHex();
    const levyAmount = assetModifyLevyTxn.mosaicLevy.fee.compact();

    txnDetails.assetId = assetId;
    txnDetails.levyAssetId = levyAssetId;
    txnDetails.levyAssetAmount = levyAmount;
    txnDetails.levyAssetAmountIsRaw = true;
    txnDetails.levyType = assetModifyLevyTxn.mosaicLevy.type;
    txnDetails.levyRecipient = assetModifyLevyTxn.mosaicLevy.recipient.plain();

    try {
      const assetName = await DashboardService.getAssetName(assetId);

      if (assetName.names.length) {
        txnDetails.namespaceName = assetName.names[0].name;
      }

      const levyAssetInfo = await DashboardService.getAssetInfo(levyAssetId);

      txnDetails.levyAssetAmount = DashboardService.convertToExactAmount(
        levyAmount,
        levyAssetInfo.divisibility
      );

      txnDetails.levyAssetAmountIsRaw = false;

      const levyAssetName = await DashboardService.getAssetName(levyAssetId);

      if (levyAssetName.names.length) {
        txnDetails.levyAssetName = levyAssetName.names[0].name;
      }
    } catch (error) {}

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Asset Remove Levy only---------------------------------------------------
  async extractAssetRemoveLevy(
    assetRemoveLevyTxn: MosaicRemoveLevyTransaction
  ): Promise<InnerAssetTransaction> {
    const txnDetails = new InnerAssetTransaction();
    if (!assetRemoveLevyTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = assetRemoveLevyTxn.signer.publicKey;
    txnDetails.signerAddress = assetRemoveLevyTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      assetRemoveLevyTxn.type
    );

    const assetId = assetRemoveLevyTxn.mosaicId.toHex();

    txnDetails.assetId = assetId;

    try {
      const assetName = await DashboardService.getAssetName(assetId);

      if (assetName.names.length) {
        txnDetails.namespaceName = assetName.names[0].name;
      }
    } catch (error) {}

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Account Operation Restriction only---------------------------------------------------
  extractAccOperationRestriction(
    accOperationRestrictTxn: AccountOperationRestrictionModificationTransaction
  ): InnerRestrictionTransaction {
    const txnDetails = new InnerRestrictionTransaction();
    if (!accOperationRestrictTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = accOperationRestrictTxn.signer.publicKey;
    txnDetails.signerAddress = accOperationRestrictTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      accOperationRestrictTxn.type
    );

    txnDetails.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
      accOperationRestrictTxn.restrictionType
    ).action;

    for (let i = 0; i < accOperationRestrictTxn.modifications.length; ++i) {
      const modification = accOperationRestrictTxn.modifications[i];

      const newRestrictionModification: RestrictionModification = {
        action:
          modification.modificationType === RestrictionModificationType.Add
            ? "Add"
            : "Remove",
        value: TransactionUtils.getTransactionTypeNameByEnum(
          modification.value
        ),
      };

      txnDetails.modification.push(newRestrictionModification);
    }

    const allAddModification = txnDetails.modification.filter(
      (x) => x.action === "Add"
    );
    const allRemoveModification = txnDetails.modification.filter(
      (x) => x.action === "Remove"
    );

    txnDetails.modification = allAddModification.concat(allRemoveModification);

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Account Address Restriction only---------------------------------------------------
  extractAccAddressRestriction(
    accAddressRestrictTxn: AccountAddressRestrictionModificationTransaction
  ): InnerRestrictionTransaction {
    const txnDetails = new InnerRestrictionTransaction();
    if (!accAddressRestrictTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = accAddressRestrictTxn.signer.publicKey;
    txnDetails.signerAddress = accAddressRestrictTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      accAddressRestrictTxn.type
    );

    txnDetails.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
      accAddressRestrictTxn.restrictionType
    ).action;

    for (let i = 0; i < accAddressRestrictTxn.modifications.length; ++i) {
      const modification = accAddressRestrictTxn.modifications[i];

      const newRestrictionModification: RestrictionModification = {
        action:
          modification.modificationType === RestrictionModificationType.Add
            ? "Add"
            : "Remove",
        value: modification.value,
      };
      txnDetails.modification.push(newRestrictionModification);
    }

    const allAddModification = txnDetails.modification.filter(
      (x) => x.action === "Add"
    );
    const allRemoveModification = txnDetails.modification.filter(
      (x) => x.action === "Remove"
    );

    txnDetails.modification = allAddModification.concat(allRemoveModification);

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Account Asset Restriction only---------------------------------------------------
  async extractAccAssetRestriction(
    accAssetRestrictTxn: AccountMosaicRestrictionModificationTransaction
  ): Promise<InnerRestrictionTransaction> {
    const txnDetails = new InnerRestrictionTransaction();
    if (!accAssetRestrictTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = accAssetRestrictTxn.signer.publicKey;
    txnDetails.signerAddress = accAssetRestrictTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      accAssetRestrictTxn.type
    );

    txnDetails.restrictionTypeOutput = DashboardService.getRestrictionTypeName(
      accAssetRestrictTxn.restrictionType
    ).action;

    for (let i = 0; i < accAssetRestrictTxn.modifications.length; ++i) {
      const modification = accAssetRestrictTxn.modifications[i];

      const newRestrictionModification: RestrictionModification = {
        action:
          modification.modificationType === RestrictionModificationType.Add
            ? "Add"
            : "Remove",
        value: new MosaicId(modification.value).toHex(),
      };

      try {
        const assetId = newRestrictionModification.value;

        if (assetId === AppState.nativeToken.assetId) {
          newRestrictionModification.name = AppState.nativeToken.label;
        } else {
          const assetName = await DashboardService.getAssetName(assetId);

          if (assetName.names.length) {
            newRestrictionModification.name = assetName.names[0].name;
          }
        }
      } catch (error) {}

      txnDetails.modification.push(newRestrictionModification);
    }

    const allAddModification = txnDetails.modification.filter(
      (x) => x.action === "Add"
    );
    const allRemoveModification = txnDetails.modification.filter(
      (x) => x.action === "Remove"
    );

    txnDetails.modification = allAddModification.concat(allRemoveModification);

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Lock Hash only---------------------------------------------------
  async extractConfirmedLockHash(
    lockFundTxn: LockFundsTransaction
  ): Promise<InnerLockTransaction> {
    const txnDetails = new InnerLockTransaction();
    if (!lockFundTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = lockFundTxn.signer.publicKey;
    txnDetails.signerAddress = lockFundTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(lockFundTxn.type);

    txnDetails.lockHash = lockFundTxn.hash;
    txnDetails.duration = lockFundTxn.duration.compact();

    const amount = lockFundTxn.mosaic.amount.compact();
    txnDetails.amountLocking = AppState.nativeToken.divisibility
      ? amount / Math.pow(10, AppState.nativeToken.divisibility)
      : amount;

    try {
      if (!AppState.chainAPI) {
        throw new Error("Service unavailable");
      }
      const txnStatus =
        await AppState.chainAPI.transactionAPI.getTransactionStatus(
          lockFundTxn.hash
        );
      txnDetails.isRefunded =
        txnStatus.group === TransactionGroupType.CONFIRMED;
    } catch (error) {
      txnDetails.isRefunded = false;
    }

    return txnDetails;
  }

  extractUnconfirmedLockHash(
    lockFundTxn: LockFundsTransaction
  ): InnerLockTransaction {
    return this.extractPartialLockHash(lockFundTxn);
  }

  extractPartialLockHash(
    lockFundTxn: LockFundsTransaction
  ): InnerLockTransaction {
    const txnDetails = new InnerLockTransaction();
    if (!lockFundTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = lockFundTxn.signer.publicKey;
    txnDetails.signerAddress = lockFundTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(lockFundTxn.type);

    txnDetails.lockHash = lockFundTxn.hash;
    txnDetails.duration = lockFundTxn.duration.compact();

    const amount = lockFundTxn.mosaic.amount.compact();
    txnDetails.amountLocking = AppState.nativeToken.divisibility
      ? amount / Math.pow(10, AppState.nativeToken.divisibility)
      : amount;

    return txnDetails;
  }

  async extractLockHash(
    lockFundTxn: LockFundsTransaction,
    txnGroupType: TransactionGroupType = TransactionGroupType.CONFIRMED
  ): Promise<InnerLockTransaction> {
    if (txnGroupType === TransactionGroupType.CONFIRMED) {
      return await this.extractConfirmedLockHash(lockFundTxn);
    }
    if (txnGroupType === TransactionGroupType.UNCONFIRMED) {
      return this.extractUnconfirmedLockHash(lockFundTxn);
    } else {
      return this.extractPartialLockHash(lockFundTxn);
    }
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Account Link only---------------------------------------------------
  extractAccountLink(accLinkTxn: AccountLinkTransaction): InnerLinkTransaction {
    const txnDetails = new InnerLinkTransaction();
    if (!accLinkTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = accLinkTxn.signer.publicKey;
    txnDetails.signerAddress = accLinkTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(accLinkTxn.type);

    txnDetails.action =
      accLinkTxn.linkAction === LinkAction.Link ? "Link" : "Unlink";

    txnDetails.remotePublicKey = accLinkTxn.remoteAccountKey;

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Chain Upgrade only---------------------------------------------------
  extractChainUpgrade(
    chainUpdateTxn: ChainUpgradeTransaction
  ): InnerChainTransaction {
    const txnDetails = new InnerChainTransaction();
    if (!chainUpdateTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = chainUpdateTxn.signer.publicKey;
    txnDetails.signerAddress = chainUpdateTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      chainUpdateTxn.type
    );

    txnDetails.upgradePeriod = chainUpdateTxn.upgradePeriod.compact();
    txnDetails.newVersion = chainUpdateTxn.newBlockchainVersion.toHex();

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Chain Configure only---------------------------------------------------
  extractChainConfig(
    chainConfigureTxn: ChainConfigTransaction
  ): InnerChainTransaction {
    const txnDetails = new InnerChainTransaction();
    if (!chainConfigureTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = chainConfigureTxn.signer.publicKey;
    txnDetails.signerAddress = chainConfigureTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      chainConfigureTxn.type
    );

    txnDetails.applyHeightDelta = chainConfigureTxn.applyHeightDelta.compact();

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Add Exchange Offer only---------------------------------------------------
  async extractAddExchangeOffer(
    addExchangeOfferTxn: AddExchangeOfferTransaction
  ): Promise<InnerExchangeTransaction> {
    const txnDetails = new InnerExchangeTransaction();
    if (!addExchangeOfferTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = addExchangeOfferTxn.signer.publicKey;
    txnDetails.signerAddress = addExchangeOfferTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      addExchangeOfferTxn.type
    );

    for (let i = 0; i < addExchangeOfferTxn.offers.length; ++i) {
      const tempExchangeOffer = addExchangeOfferTxn.offers[i];

      const assetId = tempExchangeOffer.mosaicId.toHex();
      const amount = tempExchangeOffer.mosaicAmount.compact();

      const newTxnExchangeOffer: TxnExchangeOffer = {
        amount: amount,
        amountIsRaw: true,
        assetId: assetId,
        cost: DashboardService.convertToExactNativeAmount(
          tempExchangeOffer.cost.compact()
        ),
        duration: tempExchangeOffer.duration.compact(),
        type:
          tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER
            ? "Sell"
            : "Buy",
      };

      try {
        const assetInfo = await DashboardService.getAssetInfo(assetId);

        newTxnExchangeOffer.amountIsRaw = false;
        newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(
          amount,
          assetInfo.divisibility
        );

        const assetName = await DashboardService.getAssetName(assetId);

        if (assetName.names.length) {
          newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
        }
      } catch (error) {}

      txnDetails.exchangeOffers.push(newTxnExchangeOffer);
    }

    const allBuyOffers = txnDetails.exchangeOffers.filter(
      (x) => x.type === "Buy"
    );
    const allSellOffers = txnDetails.exchangeOffers.filter(
      (x) => x.type === "Sell"
    );

    txnDetails.exchangeOffers = txnDetails.isTakingOffer
      ? allSellOffers.concat(allBuyOffers)
      : allBuyOffers.concat(allSellOffers);

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Remove Exchange Offer only---------------------------------------------------
  async extractRemoveExchangeOffer(
    removeExchangeOfferTxn: RemoveExchangeOfferTransaction
  ): Promise<InnerExchangeTransaction> {
    const txnDetails = new InnerExchangeTransaction();
    if (!removeExchangeOfferTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = removeExchangeOfferTxn.signer.publicKey;
    txnDetails.signerAddress = removeExchangeOfferTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      removeExchangeOfferTxn.type
    );

    for (let i = 0; i < removeExchangeOfferTxn.offers.length; ++i) {
      const tempExchangeOffer = removeExchangeOfferTxn.offers[i];

      const assetId = tempExchangeOffer.mosaicId.toHex();

      const newTxnExchangeOffer: TxnExchangeOffer = {
        assetId: assetId,
        type:
          tempExchangeOffer.offerType === ExchangeOfferType.SELL_OFFER
            ? "Sell"
            : "Buy",
      };

      try {
        const assetName = await DashboardService.getAssetName(assetId);

        if (assetName.names.length) {
          newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
        }
      } catch (error) {}

      txnDetails.exchangeOffers.push(newTxnExchangeOffer);
    }

    const allBuyOffers = txnDetails.exchangeOffers.filter(
      (x) => x.type === "Buy"
    );
    const allSellOffers = txnDetails.exchangeOffers.filter(
      (x) => x.type === "Sell"
    );

    txnDetails.exchangeOffers = txnDetails.isTakingOffer
      ? allSellOffers.concat(allBuyOffers)
      : allBuyOffers.concat(allSellOffers);

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  // -----------------------------------extract Exchange Offer only---------------------------------------------------
  async extractExchangeOffer(
    exchangeOfferTxn: ExchangeOfferTransaction
  ): Promise<InnerExchangeTransaction> {
    const txnDetails = new InnerExchangeTransaction();
    if (!exchangeOfferTxn.signer) {
      throw new Error("Service unavailable");
    }
    txnDetails.signer = exchangeOfferTxn.signer.publicKey;
    txnDetails.signerAddress = exchangeOfferTxn.signer.address.plain();
    txnDetails.type = TransactionUtils.getTransactionTypeName(
      exchangeOfferTxn.type
    );

    txnDetails.isTakingOffer = true;

    for (let i = 0; i < exchangeOfferTxn.offers.length; ++i) {
      const tempExchangeOffer = exchangeOfferTxn.offers[i];

      const assetId = tempExchangeOffer.mosaicId.toHex();
      const amount = tempExchangeOffer.mosaicAmount.compact();

      const newTxnExchangeOffer: TxnExchangeOffer = {
        amount: amount,
        amountIsRaw: true,
        assetId: assetId,
        cost: DashboardService.convertToExactNativeAmount(
          tempExchangeOffer.cost.compact()
        ),
        owner: tempExchangeOffer.owner.publicKey,
        type:
          tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER
            ? "Sell"
            : "Buy",
      };

      try {
        const assetInfo = await DashboardService.getAssetInfo(assetId);

        newTxnExchangeOffer.amountIsRaw = false;
        newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(
          amount,
          assetInfo.divisibility
        );

        const assetName = await DashboardService.getAssetName(assetId);

        if (assetName.names.length) {
          newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
        }
      } catch (error) {}

      txnDetails.exchangeOffers.push(newTxnExchangeOffer);
    }

    const allBuyOffers = txnDetails.exchangeOffers.filter(
      (x) => x.type === "Buy"
    );
    const allSellOffers = txnDetails.exchangeOffers.filter(
      (x) => x.type === "Sell"
    );

    txnDetails.exchangeOffers = txnDetails.isTakingOffer
      ? allSellOffers.concat(allBuyOffers)
      : allBuyOffers.concat(allSellOffers);

    return txnDetails;
  }
  // --------------------------------------end------------------------------------------------------------------

  async extractPartialInnerTransaction(
    innerTransaction: InnerTransaction
  ): Promise<InnerTxnDetails | null> {
    let transactionDetails: InnerTxnDetails | null = null;

    let tempData: MyInnerTxn;

    switch (innerTransaction.type) {
      case TransactionType.ADDRESS_ALIAS:
        {
          const addressAliasTx = innerTransaction as AddressAliasTransaction;
          tempData = await this.extractAddressAlias(addressAliasTx);
          const addressAliasFormat = tempData as InnerAliasTransaction;

          const infos: TxnDetails[] = [];

          const namespaceInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Namespace",
            value: addressAliasFormat.aliasName,
          };
          infos.push(namespaceInfo);

          const actionInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Action",
            value: addressAliasFormat.aliasTypeName,
          };
          infos.push(actionInfo);

          const addressInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Address",
            value: addressAliasFormat.address ?? "",
          };
          infos.push(addressInfo);

          transactionDetails = {
            signer: addressAliasFormat.signer,
            signerAddressPlain: addressAliasFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              addressAliasFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: addressAliasFormat.type,
          };
        }
        break;
      case TransactionType.MOSAIC_ALIAS:
        {
          const mosaicAliasTx = innerTransaction as MosaicAliasTransaction;
          tempData = await this.extractAssetAlias(mosaicAliasTx);
          const assetAliasFormat = tempData as InnerAliasTransaction;

          const infos: TxnDetails[] = [];

          const namespaceInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Namespace",
            value: assetAliasFormat.aliasName,
          };
          infos.push(namespaceInfo);

          const actionInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Action",
            value: assetAliasFormat.aliasTypeName,
          };
          infos.push(actionInfo);

          const assetInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Asset",
            value: assetAliasFormat.assetId ?? "",
          };
          infos.push(assetInfo);

          transactionDetails = {
            signer: assetAliasFormat.signer,
            signerAddressPlain: assetAliasFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              assetAliasFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: assetAliasFormat.type,
          };
        }
        break;
      case TransactionType.ADD_EXCHANGE_OFFER:
        {
          const addExchangeOfferTx =
            innerTransaction as AddExchangeOfferTransaction;
          tempData = await this.extractAddExchangeOffer(addExchangeOfferTx);
          const addExchangeOfferFormat = tempData as InnerExchangeTransaction;

          const infos: TxnDetails[] = [];

          for (
            let i = 0;
            i < addExchangeOfferFormat.exchangeOffers.length;
            ++i
          ) {
            const offer = addExchangeOfferFormat.exchangeOffers[i];
            const offeringAssetString =
              `${offer.amount} ${offer.assetId}` + offer.assetNamespace
                ? ` (${offer.assetNamespace})`
                : "";
            const costString = `${offer.cost} ${AppState.nativeToken.label}`;
            const offerInfo: TxnDetails = {
              type: offer.type === "Buy" ? MsgType.GREEN : MsgType.RED,
              value:
                costString +
                " - " +
                offeringAssetString +
                `. Duration: ${offer.duration}`,
            };
            infos.push(offerInfo);
          }

          transactionDetails = {
            signer: addExchangeOfferFormat.signer,
            signerAddressPlain: addExchangeOfferFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              addExchangeOfferFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.BUY_SELL,
            typeName: addExchangeOfferFormat.type,
          };
        }
        break;
      case TransactionType.EXCHANGE_OFFER:
        {
          const exchangeOfferTx = innerTransaction as ExchangeOfferTransaction;
          tempData = await this.extractExchangeOffer(exchangeOfferTx);
          const exchangeOfferFormat = tempData as InnerExchangeTransaction;

          const infos: TxnDetails[] = [];

          for (let i = 0; i < exchangeOfferFormat.exchangeOffers.length; ++i) {
            const offer = exchangeOfferFormat.exchangeOffers[i];
            const offeringAssetString =
              `${offer.amount} ${offer.assetId}` + offer.assetNamespace
                ? ` (${offer.assetNamespace})`
                : "";
            const costString = `${offer.cost} ${AppState.nativeToken.label}`;
            const ownerPublicAccount = PublicAccount.createFromPublicKey(
              offer.owner ?? "",
              AppState.networkType
            );
            const owner = this.wallet.convertAddressToName(
              ownerPublicAccount.address.plain()
            );
            const offerInfo: TxnDetails = {
              type: offer.type === "Buy" ? MsgType.RED : MsgType.GREEN,
              value:
                costString + " - " + offeringAssetString + `. From: ${owner}`,
            };
            infos.push(offerInfo);
          }

          transactionDetails = {
            signer: exchangeOfferFormat.signer,
            signerAddressPlain: exchangeOfferFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              exchangeOfferFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.BUY_SELL,
            typeName: exchangeOfferFormat.type,
          };
        }
        break;
      case TransactionType.REMOVE_EXCHANGE_OFFER:
        {
          const removeExchangeOfferTx =
            innerTransaction as RemoveExchangeOfferTransaction;
          tempData = await this.extractRemoveExchangeOffer(
            removeExchangeOfferTx
          );
          const removeExchangeOfferFormat =
            tempData as InnerExchangeTransaction;

          const infos: TxnDetails[] = [];

          for (
            let i = 0;
            i < removeExchangeOfferFormat.exchangeOffers.length;
            ++i
          ) {
            const offer = removeExchangeOfferFormat.exchangeOffers[i];
            const offeringAssetString =
              `${offer.assetId}` + offer.assetNamespace
                ? ` (${offer.assetNamespace})`
                : "";

            const offerInfo: TxnDetails = {
              type: offer.type === "Buy" ? MsgType.GREEN : MsgType.RED,
              value: offeringAssetString,
            };
            infos.push(offerInfo);
          }

          transactionDetails = {
            signer: removeExchangeOfferFormat.signer,
            signerAddressPlain: removeExchangeOfferFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              removeExchangeOfferFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.BUY_SELL,
            typeName: removeExchangeOfferFormat.type,
          };
        }
        break;
      case TransactionType.CHAIN_CONFIGURE:
        {
          const chainConfigureTx = innerTransaction as ChainConfigTransaction;
          tempData = this.extractChainConfig(chainConfigureTx);
          const chainConfigFormat = tempData as InnerChainTransaction;

          const infos: TxnDetails[] = [];

          const applyHeightDeltaInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Apply after blocks",
            value: chainConfigFormat.applyHeightDelta ?? "",
          };
          infos.push(applyHeightDeltaInfo);

          transactionDetails = {
            signer: chainConfigFormat.signer,
            signerAddressPlain: chainConfigFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              chainConfigFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: chainConfigFormat.type,
          };
        }
        break;
      case TransactionType.CHAIN_UPGRADE:
        {
          const chainUpgradeTx = innerTransaction as ChainUpgradeTransaction;
          tempData = this.extractChainUpgrade(chainUpgradeTx);
          const chainUpgradeFormat = tempData as InnerChainTransaction;

          const infos: TxnDetails[] = [];

          const versionInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "New Version",
            value: chainUpgradeFormat.newVersion ?? "",
          };
          infos.push(versionInfo);

          const upgradePeriodInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Upgrade After Blocks",
            value: chainUpgradeFormat.upgradePeriod ?? "",
          };
          infos.push(upgradePeriodInfo);

          transactionDetails = {
            signer: chainUpgradeFormat.signer,
            signerAddressPlain: chainUpgradeFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              chainUpgradeFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: chainUpgradeFormat.type,
          };
        }
        break;

      case TransactionType.LINK_ACCOUNT:
        {
          const accountLinkTx = innerTransaction as AccountLinkTransaction;
          tempData = this.extractAccountLink(accountLinkTx);
          const accountLinkFormat = tempData as InnerLinkTransaction;

          const infos: TxnDetails[] = [];

          const linkInfo: TxnDetails = {
            type:
              accountLinkFormat.action === "Link" ? MsgType.GREEN : MsgType.RED,
            value: accountLinkFormat.remotePublicKey,
          };
          infos.push(linkInfo);

          transactionDetails = {
            signer: accountLinkFormat.signer,
            signerAddressPlain: accountLinkFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              accountLinkFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.ADD_REMOVE,
            typeName: accountLinkFormat.type,
          };
        }
        break;
      case TransactionType.LOCK:
        {
          const lockFundTx = innerTransaction as LockFundsTransaction;
          tempData = await this.extractLockHash(
            lockFundTx,
            TransactionGroupType.PARTIAL
          );
          const lockFundFormat = tempData as InnerLockTransaction;

          const infos: TxnDetails[] = [];

          const hashInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Hash",
            value: lockFundFormat.lockHash,
          };
          infos.push(hashInfo);

          const durationInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Action",
            value: lockFundFormat.duration,
          };

          infos.push(durationInfo);

          const lockingInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Locking Amount",
            value:
              lockFundFormat.amountLocking + ` ${AppState.nativeToken.label}`,
          };
          infos.push(lockingInfo);

          transactionDetails = {
            signer: lockFundFormat.signer,
            signerAddressPlain: lockFundFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              lockFundFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: lockFundFormat.type,
          };
        }
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
        {
          const accAddressRestrictionTx =
            innerTransaction as AccountAddressRestrictionModificationTransaction;
          tempData = this.extractAccAddressRestriction(accAddressRestrictionTx);
          const accAddressRestrictionFormat =
            tempData as InnerRestrictionTransaction;

          const infos: TxnDetails[] = [];

          const actionInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Action",
            value: accAddressRestrictionFormat.restrictionTypeOutput,
          };

          infos.push(actionInfo);

          for (
            let i = 0;
            i < accAddressRestrictionFormat.modification.length;
            ++i
          ) {
            const modification = accAddressRestrictionFormat.modification[i];

            const restrictInfo: TxnDetails = {
              type: modification.action === "Add" ? MsgType.GREEN : MsgType.RED,
              value: modification.value,
              short: this.wallet.convertAddressToName(modification.value),
            };

            infos.push(restrictInfo);
          }

          transactionDetails = {
            signer: accAddressRestrictionFormat.signer,
            signerAddressPlain: accAddressRestrictionFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              accAddressRestrictionFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.ALLOW_BLOCK,
            typeName: accAddressRestrictionFormat.type,
          };
        }
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
        {
          const accMosaicModifyTx =
            innerTransaction as AccountMosaicRestrictionModificationTransaction;
          tempData = await this.extractAccAssetRestriction(accMosaicModifyTx);
          const accAssetRestrictionFormat =
            tempData as InnerRestrictionTransaction;

          const infos: TxnDetails[] = [];

          const actionInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Action",
            value: accAssetRestrictionFormat.restrictionTypeOutput,
          };

          infos.push(actionInfo);

          for (
            let i = 0;
            i < accAssetRestrictionFormat.modification.length;
            ++i
          ) {
            const modification = accAssetRestrictionFormat.modification[i];

            const restrictInfo: TxnDetails = {
              type: modification.action === "Add" ? MsgType.GREEN : MsgType.RED,
              value:
                modification.value + modification.name
                  ? `(${modification.name})`
                  : "",
            };

            infos.push(restrictInfo);
          }

          transactionDetails = {
            signer: accAssetRestrictionFormat.signer,
            signerAddressPlain: accAssetRestrictionFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              accAssetRestrictionFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.ALLOW_BLOCK,
            typeName: accAssetRestrictionFormat.type,
          };
        }
        break;
      case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
        {
          const accOperationModifyTx =
            innerTransaction as AccountOperationRestrictionModificationTransaction;
          tempData = this.extractAccOperationRestriction(accOperationModifyTx);
          const accOperationRestrictionFormat =
            tempData as InnerRestrictionTransaction;

          const infos: TxnDetails[] = [];

          const actionInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Action",
            value: accOperationRestrictionFormat.restrictionTypeOutput,
          };

          infos.push(actionInfo);

          for (
            let i = 0;
            i < accOperationRestrictionFormat.modification.length;
            ++i
          ) {
            const modification = accOperationRestrictionFormat.modification[i];

            const restrictInfo: TxnDetails = {
              type: modification.action === "Add" ? MsgType.GREEN : MsgType.RED,
              value: modification.value,
            };

            infos.push(restrictInfo);
          }

          transactionDetails = {
            signer: accOperationRestrictionFormat.signer,
            signerAddressPlain: accOperationRestrictionFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              accOperationRestrictionFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.ALLOW_BLOCK,
            typeName: accOperationRestrictionFormat.type,
          };
        }
        break;
      case TransactionType.MODIFY_MULTISIG_ACCOUNT:
        {
          const modifyMultisigAccountTx =
            innerTransaction as ModifyMultisigAccountTransaction;
          tempData = await this.extractModifyMultisig(
            modifyMultisigAccountTx,
            TransactionGroupType.PARTIAL
          );
          const modifyMultisigFormat = tempData as InnerAccountTransaction;

          const infos: TxnDetails[] = [];

          let approvalChanges: string;

          if (modifyMultisigFormat.approvalDelta === 0) {
            approvalChanges = "";
          } else if (modifyMultisigFormat.approvalDelta > 0) {
            approvalChanges = ` (+${modifyMultisigFormat.approvalDelta})`;
          } else {
            approvalChanges = ` (${modifyMultisigFormat.approvalDelta})`;
          }

          const minApprovalInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Minimum Approval",
            value: modifyMultisigFormat.oldApprovalNumber + approvalChanges,
          };

          infos.push(minApprovalInfo);

          let removalChanges: string;

          if (modifyMultisigFormat.removalDelta === 0) {
            removalChanges = "";
          } else if (modifyMultisigFormat.removalDelta > 0) {
            removalChanges = ` (+${modifyMultisigFormat.removalDelta})`;
          } else {
            removalChanges = ` (${modifyMultisigFormat.removalDelta})`;
          }

          const minRemovalInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Minimum Removal",
            value: modifyMultisigFormat.oldRemovalNumber + removalChanges,
          };

          infos.push(minRemovalInfo);

          for (let i = 0; i < modifyMultisigFormat.addedCosigner.length; ++i) {
            const publicAccount = PublicAccount.createFromPublicKey(
              modifyMultisigFormat.addedCosigner[i],
              AppState.networkType
            );
            const tryShortName = this.wallet.convertAddressToName(
              publicAccount.address.plain()
            );
            const shortName =
              tryShortName === publicAccount.address.plain()
                ? ""
                : tryShortName;
            const addCosignerInfo: TxnDetails = {
              type: MsgType.GREEN,
              value: modifyMultisigFormat.addedCosigner[i],
              short: shortName,
            };

            infos.push(addCosignerInfo);
          }

          for (
            let i = 0;
            i < modifyMultisigFormat.removedCosigner.length;
            ++i
          ) {
            const publicAccount = PublicAccount.createFromPublicKey(
              modifyMultisigFormat.removedCosigner[i],
              AppState.networkType
            );
            const removeCosignerInfo: TxnDetails = {
              type: MsgType.GREEN,
              value: modifyMultisigFormat.removedCosigner[i],
              short: this.wallet.convertAddressToName(
                publicAccount.address.plain()
              ),
            };

            infos.push(removeCosignerInfo);
          }

          transactionDetails = {
            signer: modifyMultisigFormat.signer,
            signerAddressPlain: modifyMultisigFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              modifyMultisigFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.ADD_REMOVE,
            typeName: modifyMultisigFormat.type,
          };
        }
        break;
      case TransactionType.MOSAIC_DEFINITION:
        {
          const mosaicDefinitionTx =
            innerTransaction as MosaicDefinitionTransaction;
          tempData = this.extractAssetDefinition(mosaicDefinitionTx);
          const assetDefFormat = tempData as InnerAssetTransaction;

          const infos: TxnDetails[] = [];

          const assetInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Asset",
            value: assetDefFormat.assetId,
          };

          infos.push(assetInfo);

          const assetDivisibilityInfo: TxnDetails = {
            type: MsgType.INFO,
            value: `Divisibility: ${assetDefFormat.divisibility}`,
          };

          infos.push(assetDivisibilityInfo);

          const assetTransferableInfo: TxnDetails = {
            type: assetDefFormat.transferable ? MsgType.GREEN : MsgType.RED,
            value: `Transferable`,
          };

          infos.push(assetTransferableInfo);

          const assetSupplyMutableInfo: TxnDetails = {
            type: assetDefFormat.supplyMutable ? MsgType.GREEN : MsgType.RED,
            value: `Supply Mutable`,
          };

          infos.push(assetSupplyMutableInfo);

          if (assetDefFormat.duration) {
            const assetDurationInfo: TxnDetails = {
              type: MsgType.NONE,
              label: "Duration",
              value: assetDefFormat.duration,
            };

            infos.push(assetDurationInfo);
          }

          transactionDetails = {
            signer: assetDefFormat.signer,
            signerAddressPlain: assetDefFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              assetDefFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.TRUE_FALSE,
            typeName: assetDefFormat.type,
          };
        }
        break;
      case TransactionType.MOSAIC_SUPPLY_CHANGE:
        {
          const mosaicSupplyTx =
            innerTransaction as MosaicSupplyChangeTransaction;
          tempData = await this.extractAssetSupplyChange(mosaicSupplyTx);
          const assetSupplyFormat = tempData as InnerAssetTransaction;

          const infos: TxnDetails[] = [];

          const assetInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Asset",
            value:
              assetSupplyFormat.assetId +
              (assetSupplyFormat.namespaceName
                ? ` (${assetSupplyFormat.namespaceName})`
                : ""),
          };

          infos.push(assetInfo);
          if (!assetSupplyFormat.supplyDelta) {
            throw new Error("Service unavailable");
          }
          const assetSupplyInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Delta",
            value:
              assetSupplyFormat.supplyDelta > 0
                ? `+${assetSupplyFormat.supplyDelta}`
                : assetSupplyFormat.supplyDelta,
          };

          infos.push(assetSupplyInfo);

          transactionDetails = {
            signer: assetSupplyFormat.signer,
            signerAddressPlain: assetSupplyFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              assetSupplyFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: assetSupplyFormat.type,
          };
        }
        break;
      case TransactionType.MODIFY_MOSAIC_LEVY:
        {
          const assetLevyTx = innerTransaction as MosaicModifyLevyTransaction;
          tempData = await this.extractAssetModifyLevy(assetLevyTx);
          const assetLevyFormat = tempData as InnerAssetTransaction;

          const infos: TxnDetails[] = [];

          const assetInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Asset",
            value:
              assetLevyFormat.assetId + assetLevyFormat.namespaceName
                ? ` (${assetLevyFormat.namespaceName})`
                : "",
          };

          infos.push(assetInfo);

          const levyAssetInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Levy Asset",
            value:
              assetLevyFormat.levyAssetAmount +
              " " +
              assetLevyFormat.levyAssetId +
              assetLevyFormat.levyAssetName
                ? ` (${assetLevyFormat.levyAssetName})`
                : "",
          };

          infos.push(levyAssetInfo);

          const levyAssetRecipientInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Levy Recipient",
            value: assetLevyFormat.levyRecipient ?? "",
            short: this.wallet.convertAddressToName(
              assetLevyFormat.levyRecipient ?? ""
            ),
          };

          infos.push(levyAssetRecipientInfo);

          transactionDetails = {
            signer: assetLevyFormat.signer,
            signerAddressPlain: assetLevyFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              assetLevyFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: assetLevyFormat.type,
          };
        }
        break;
      case TransactionType.REMOVE_MOSAIC_LEVY:
        {
          const assetRemoveLevyTx =
            innerTransaction as MosaicRemoveLevyTransaction;
          tempData = await this.extractAssetRemoveLevy(assetRemoveLevyTx);
          const removeAssetLevyFormat = tempData as InnerAssetTransaction;

          const infos: TxnDetails[] = [];

          const assetInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Asset",
            value:
              removeAssetLevyFormat.assetId +
              removeAssetLevyFormat.namespaceName
                ? ` (${removeAssetLevyFormat.namespaceName})`
                : "",
          };

          infos.push(assetInfo);

          transactionDetails = {
            signer: removeAssetLevyFormat.signer,
            signerAddressPlain: removeAssetLevyFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              removeAssetLevyFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: removeAssetLevyFormat.type,
          };
        }
        break;
      case TransactionType.REGISTER_NAMESPACE:
        {
          const registerNamespaceTx =
            innerTransaction as RegisterNamespaceTransaction;
          tempData = await this.extractRegisterNamespace(registerNamespaceTx);
          const registerNamespaceFormat = tempData as InnerNamespaceTransaction;

          const infos: TxnDetails[] = [];

          const typeInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Type",
            value:
              registerNamespaceFormat.registerTypeName +
              (registerNamespaceFormat.isExtend ? " (Extend)" : " (Register)"),
          };

          infos.push(typeInfo);

          const nameInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Name",
            value: registerNamespaceFormat.namespaceName,
          };

          infos.push(nameInfo);

          if (registerNamespaceFormat.parentName) {
            const parentNameInfo: TxnDetails = {
              type: MsgType.NONE,
              label: "Parent Name",
              value: registerNamespaceFormat.parentName,
            };

            infos.push(parentNameInfo);
          }

          if (registerNamespaceFormat.duration) {
            const durationInfo: TxnDetails = {
              type: MsgType.NONE,
              label: "Duration",
              value: registerNamespaceFormat.duration.toString(),
            };

            infos.push(durationInfo);
          }

          transactionDetails = {
            signer: registerNamespaceFormat.signer,
            signerAddressPlain: registerNamespaceFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              registerNamespaceFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: registerNamespaceFormat.type,
          };
        }
        break;
      case TransactionType.SECRET_LOCK:
        {
          const secretLockTx = innerTransaction as SecretLockTransaction;
          tempData = await this.extractNonconfirmedSecretLock(
            secretLockTx,
            TransactionGroupType.PARTIAL
          );
          const secretLockFormat = tempData as InnerSecretTransaction;

          const infos: TxnDetails[] = [];
          const sdas = [];

          const sdaString =
            `${secretLockFormat.amount} ${secretLockFormat.assetId}` +
            secretLockFormat.namespaceName
              ? ` (${secretLockFormat.namespaceName})`
              : "";

          sdas.push(sdaString);

          const recipientInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Recipient",
            value: secretLockFormat.recipient,
            short: this.wallet.convertAddressToName(secretLockFormat.recipient),
          };

          infos.push(recipientInfo);

          const hashTypeInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Hash Type",
            value: secretLockFormat.hashType,
          };

          infos.push(hashTypeInfo);

          const secretInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Secret",
            value: secretLockFormat.secret,
          };

          infos.push(secretInfo);

          const durationInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Duration",
            value: secretLockFormat.duration,
          };

          infos.push(durationInfo);

          transactionDetails = {
            signer: secretLockFormat.signer,
            signerAddressPlain: secretLockFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              secretLockFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: sdas,
            legendType: InnerTxnLegendType.NONE,
            typeName: secretLockFormat.type,
          };
        }
        break;
      case TransactionType.SECRET_PROOF:
        {
          const secretProofTx = innerTransaction as SecretProofTransaction;
          tempData = this.extractSecretProof(secretProofTx);
          const secretProofFormat = tempData as InnerSecretTransaction;

          const infos: TxnDetails[] = [];

          const recipientInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Recipient",
            value: secretProofFormat.recipient,
            short: this.wallet.convertAddressToName(
              secretProofFormat.recipient
            ),
          };

          infos.push(recipientInfo);

          const hashTypeInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Hash Type",
            value: secretProofFormat.hashType,
          };

          infos.push(hashTypeInfo);

          const secretInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Secret",
            value: secretProofFormat.secret,
          };

          infos.push(secretInfo);

          const proofInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Proof",
            value: secretProofFormat.proof ?? "",
          };

          infos.push(proofInfo);

          transactionDetails = {
            signer: secretProofFormat.signer,
            signerAddressPlain: secretProofFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              secretProofFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: secretProofFormat.type,
          };
        }
        break;
      case TransactionType.TRANSFER:
        {
          const transferTx = innerTransaction as TransferTransaction;
          tempData = await this.extractNonconfirmedTransfer(
            transferTx,
            TransactionGroupType.PARTIAL
          );
          const transferFormat = tempData as InnerTransferTransaction;
          const sdas = [];
          const infos: TxnDetails[] = [];

          let shortName = this.wallet.convertAddressToName(
            transferFormat.recipient ?? ""
          );

          if (
            shortName === transferFormat.recipient &&
            transferFormat.recipientNamespaceName
          ) {
            shortName = transferFormat.recipientNamespaceName;
          } else if (shortName === transferFormat.recipient) {
            shortName = "";
          }

          const recipientInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Recipient",
            value: Address.createFromRawAddress(
              transferFormat.recipient ?? ""
            ).pretty(),
            short: shortName,
          };

          infos.push(recipientInfo);

          if (transferFormat.message) {
            const msgInfo: TxnDetails = {
              type: MsgType.NONE,
              label: transferFormat.messageTypeTitle,
              value:
                transferFormat.messageType === MessageType.EncryptedMessage
                  ? "xxxxxx"
                  : transferFormat.message,
            };

            infos.push(msgInfo);
          }

          if (transferFormat.amountTransfer) {
            sdas.push(
              `${transferFormat.amountTransfer} ${AppState.nativeToken.label}`
            );
          }

          for (let i = 0; i < transferFormat.sda.length; ++i) {
            const tempSDA = transferFormat.sda[i];
            let sdaString = "";
            if (tempSDA.currentAlias && tempSDA.currentAlias.length) {
              sdaString =
                tempSDA.amount +
                ` ${tempSDA.id} ` +
                `(${tempSDA.currentAlias[0].name})`;
            } else {
              sdaString = tempSDA.amount + " " + tempSDA.id;
            }
            sdas.push(sdaString);
          }

          transactionDetails = {
            signer: transferFormat.signer,
            signerAddressPlain: transferFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              transferFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: sdas,
            legendType: InnerTxnLegendType.NONE,
            typeName: transferFormat.type,
          };
        }
        break;

      case TransactionType.ACCOUNT_METADATA_V2:
        {
          const accMetadataTx = innerTransaction as AccountMetadataTransaction;
          tempData = await this.extractAccMetadata(
            accMetadataTx,
            TransactionGroupType.PARTIAL
          );
          const accMetadataFormat = tempData as InnerMetadataTransaction;
          const infos: TxnDetails[] = [];

          const targetPublicAccount = PublicAccount.createFromPublicKey(
            accMetadataFormat.targetPublicKey,
            AppState.networkType
          );
          const targetAddress = targetPublicAccount.address.plain();

          const accountInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Account",
            value: targetPublicAccount.address.plain(),
            short: this.wallet.convertAddressToName(targetAddress),
          };

          infos.push(accountInfo);

          const scopedMetadataKeyInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Scoped Metadata Key",
            value: accMetadataFormat.scopedMetadataKey,
          };

          infos.push(scopedMetadataKeyInfo);

          if (accMetadataFormat.oldValue) {
            const oldValueInfo: TxnDetails = {
              type: MsgType.NONE,
              label: "Current Value",
              value: accMetadataFormat.oldValue,
            };

            infos.push(oldValueInfo);
          }

          const newValueInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "New Value",
            value: accMetadataFormat.newValue ?? "",
          };

          infos.push(newValueInfo);

          transactionDetails = {
            signer: accMetadataFormat.signer,
            signerAddressPlain: accMetadataFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              accMetadataFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: accMetadataFormat.type,
          };
        }
        break;

      case TransactionType.NAMESPACE_METADATA_V2:
        {
          const nsMetadataTx = innerTransaction as NamespaceMetadataTransaction;
          tempData = await this.extractNamespaceMetadata(
            nsMetadataTx,
            TransactionGroupType.PARTIAL
          );
          const namespaceMetadataFormat = tempData as InnerMetadataTransaction;

          const infos: TxnDetails[] = [];

          const namespaceInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Namespace",
            value: namespaceMetadataFormat.targetIdName
              ? namespaceMetadataFormat.targetIdName
              : namespaceMetadataFormat.targetId ?? "",
          };

          infos.push(namespaceInfo);

          const scopedMetadataKeyInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Scoped Metadata Key",
            value: namespaceMetadataFormat.scopedMetadataKey,
          };

          infos.push(scopedMetadataKeyInfo);

          if (namespaceMetadataFormat.oldValue) {
            const oldValueInfo: TxnDetails = {
              type: MsgType.NONE,
              label: "Current Value",
              value: namespaceMetadataFormat.oldValue,
            };

            infos.push(oldValueInfo);
          }

          const newValueInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "New Value",
            value: namespaceMetadataFormat.newValue ?? "",
          };

          infos.push(newValueInfo);

          transactionDetails = {
            signer: namespaceMetadataFormat.signer,
            signerAddressPlain: namespaceMetadataFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              namespaceMetadataFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: namespaceMetadataFormat.type,
          };
        }
        break;

      case TransactionType.MOSAIC_METADATA_V2:
        {
          const assetMetadataTx = innerTransaction as MosaicMetadataTransaction;
          tempData = await this.extractAssetMetadata(
            assetMetadataTx,
            TransactionGroupType.PARTIAL
          );
          const assetMetadataFormat = tempData as InnerMetadataTransaction;

          const infos: TxnDetails[] = [];

          const namespaceInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Asset",
            value: assetMetadataFormat.targetIdName
              ? assetMetadataFormat.targetIdName
              : assetMetadataFormat.targetId ?? "",
          };

          infos.push(namespaceInfo);

          const scopedMetadataKeyInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "Scoped Metadata Key",
            value: assetMetadataFormat.scopedMetadataKey,
          };

          infos.push(scopedMetadataKeyInfo);

          if (assetMetadataFormat.oldValue) {
            const oldValueInfo: TxnDetails = {
              type: MsgType.NONE,
              label: "Current Value",
              value: assetMetadataFormat.oldValue,
            };

            infos.push(oldValueInfo);
          }

          const newValueInfo: TxnDetails = {
            type: MsgType.NONE,
            label: "New Value",
            value: assetMetadataFormat.newValue ?? "",
          };

          infos.push(newValueInfo);

          transactionDetails = {
            signer: assetMetadataFormat.signer,
            signerAddressPlain: assetMetadataFormat.signerAddress,
            signerAddressPretty: Address.createFromRawAddress(
              assetMetadataFormat.signerAddress
            ).pretty(),
            infos: infos,
            sdas: [],
            legendType: InnerTxnLegendType.NONE,
            typeName: assetMetadataFormat.type,
          };
        }
        break;

      default:
        return null;
    }

    return transactionDetails;
  }

  addressConvertToName(address: string) {
    const name = this.wallet.convertAddressToName(address);

    return name === address
      ? Address.createFromRawAddress(name).pretty()
      : name;
  }

  publickKeyConvertToName(publicKey: string) {
    const address = PublicAccount.createFromPublicKey(
      publicKey,
      AppState.networkType
    ).address.plain();
    const name = this.wallet.convertAddressToName(address);

    return name === address ? publicKey : name;
  }

  static convertToExactNativeAmount(amount: number) {
    if (AppState.nativeToken.divisibility === 0) {
      return amount;
    }
    return amount > 0
      ? amount / Math.pow(10, AppState.nativeToken.divisibility)
      : 0;
  }

  static convertToExactAmount(amount: number, divisibility: number) {
    if (divisibility === 0) {
      return amount;
    }
    return amount > 0 ? amount / Math.pow(10, divisibility) : 0;
  }
}
