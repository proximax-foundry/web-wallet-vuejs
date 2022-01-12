import {
    Account,
    Address,
    Deadline,
    EncryptedMessage,
    // NetworkCurrencyMosaic,
    // FeeCalculationStrategy,
    Mosaic,
    MosaicId,
    UInt64,
    MosaicProperties,
    MosaicSupplyType,
    // MosaicService,
    MosaicNonce,
    PlainMessage,
    TransferTransaction,
    TransactionHttp,
    TransactionBuilderFactory,
    PublicAccount,
    AccountHttp,
    AccountInfo,
    FeeCalculationStrategy,
    NetworkType,
    NamespaceId,
    Transaction,
    TransactionType,
    AggregateTransaction,
    CosignatureTransaction,
    QueryParams,
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
    InnerTransaction,
    ExchangeOfferType,
    HashType,
    RestrictionType,
    AccountRestrictionModification,
    SignedTransaction,
    CosignatureSignedTransaction,
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
    AccountRestrictionTransaction,
    RestrictionModificationType,
    MosaicRemoveLevyTransaction,
    MosaicModifyLevyTransaction,
    MetadataType,
    AliasActionType,
    MultisigCosignatoryModificationType,
    MetadataQueryParams,
    MetadataEntry,
    Convert
} from "tsjs-xpx-chain-sdk";
import { HashType as myHashType } from "./../../../models/const/hashType"
import { TransactionUtils } from "../../../util/transactionUtils";
import { Helper } from "../../../util/typeHelper";
import { DashboardTransaction, Tip,
    TransferList, DashboardInnerTransaction, TransactionCosigner
  } from "./transaction";
import { Wallet } from "@/models/wallet"
import { Account as myAccount } from "@/models/account";
import { networkState } from "@/state/networkState";
import { computed } from "vue";
import { ChainUtils } from "@/util/chainUtils";
import { DashboardTip, DashboardTipList, RowDashboardTip, TipType, AmountType, OtherAsset } from "../model/dashboardClasses";
import { ConfirmedTransferTransaction, UnconfirmedTransferTransaction, PartialTransferTransaction,
    ConfirmedAggregateTransaction, UnconfirmedAggregateTransaction, PartialAggregateTransaction,
    ConfirmedAliasTransaction, UnconfirmedAliasTransaction, PartialAliasTransaction,
    ConfirmedAssetTransaction, UnconfirmedAssetTransaction, PartialAssetTransaction,
    ConfirmedChainTransaction, UnconfirmedChainTransaction, PartialChainTransaction,
    ConfirmedExchangeTransaction, UnconfirmedExchangeTransaction, PartialExchangeTransaction,
    ConfirmedLinkTransaction, UnconfirmedLinkTransaction, PartialLinkTransaction,
    ConfirmedLockTransaction, UnconfirmedLockTransaction, PartialLockTransaction,
    ConfirmedMetadataTransaction, UnconfirmedMetadataTransaction, PartialMetadataTransaction,
    ConfirmedAccountTransaction, UnconfirmedAccountTransaction, PartialAccountTransaction,
    ConfirmedNamespaceTransaction, UnconfirmedNamespaceTransaction, PartialNamespaceTransaction,
    ConfirmedRestrictionTransaction, UnconfirmedRestrictionTransaction, PartialRestrictionTransaction,
    ConfirmedSecretTransaction, UnconfirmedSecretTransaction, PartialSecretTransaction, 
    ConfirmedTransaction, UnconfirmedTransaction, PartialTransaction, 
    SDA, AliasNamespace, TxnExchangeOffer, RestrictionModification, TxnList } from "../model/transactions/transaction";
import { Account as MyAccount } from "../../../models/account";
import { AppState } from "@/state/appState";

const networkAPIEndpoint = computed(() => ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));
const localNetworkType = computed(() => ChainUtils.getNetworkType(networkState.currentNetworkProfile?.network.type));
const namespaceIdFirstCharacterString = "89ABCDEF";
const nativeTokenName = computed(()=> networkState.currentNetworkProfile?.network.currency.name);
const nativeTokenAssetId = computed(()=> networkState.currentNetworkProfile?.network.currency.assetId);
const nativeTokenNamespaceId = computed(()=> networkState.currentNetworkProfile?.network.currency.namespaceId);
const nativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile?.network.currency.divisibility);

export class DashboardService {

    wallet: Wallet;
    selectedAccount: MyAccount;
    savedAggregateTxn: AggregateTransaction[] = [];

    constructor(wallet: Wallet, selectedAccount: MyAccount){
        this.wallet = wallet;
        this.selectedAccount = selectedAccount;
    }

    async searchTxns(transactionGroupType: TransactionGroupType, transactionQueryParams: TransactionQueryParams): Promise<TransactionSearch>{

        let transactionSearchResult: TransactionSearch = await AppState.chainAPI.transactionAPI.searchTransactions(transactionGroupType, transactionQueryParams);

        return transactionSearchResult;
    }

    // ---------------------------TransferTransaction / Mixed Transaction---------------------------------------------------
    async formatPartialMixedTxns(txns: Transaction[]): Promise<PartialTransferTransaction[]>{

        let formatedTxns : PartialTransferTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialTransferTransaction, formattedTxn) as PartialTransferTransaction;
            
            let sdas: SDA[] = [];

            if(txns[i].type === TransactionType.TRANSFER){
                let transferTxn = txns[i] as TransferTransaction;
                txn.message = transferTxn.message.payload;
                txn.messageType = transferTxn.message.type;

                if(txn.messageType === MessageType.PlainMessage){
                    let newType = this.convertToSwapType(txn.message);
                
                    if(newType){
                        txn.type = newType;
                    }
                }

                switch(txn.messageType){
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
                let recipientIsNamespace = transferTxn.recipient instanceof NamespaceId ? true : false;

                let recipient;

                if(transferTxn.recipient instanceof NamespaceId){
                    txn.recipientNamespaceId = transferTxn.recipient.toHex();
                    recipient = await DashboardService.getAddressAlias(transferTxn.recipient);
                    let namespacesName = await DashboardService.getNamespacesName([transferTxn.recipient]);
                    txn.recipientNamespaceName = namespacesName[0].name;
                }
                else{
                    recipient = transferTxn.recipient;
                }

                txn.recipient = recipient.plain();
                txn.sender = transferTxn.signer.address.plain();
                txn.in_out = this.selectedAccount.address === txn.sender ? false: true;

                for(let y = 0; y < transferTxn.mosaics.length; ++y){

                    let rawAmount = transferTxn.mosaics[y].amount.compact();
                    let actualAmount = rawAmount;

                    let assetId;
                    let isSendWithNamespace = DashboardService.isNamespace(transferTxn.mosaics[y].id);

                    if(isSendWithNamespace){
                        let namespaceId = new NamespaceId(transferTxn.mosaics[y].id.toDTO().id);
                        assetId = await DashboardService.getAssetAlias(namespaceId);
                    }
                    else{
                        assetId = transferTxn.mosaics[y].id;
                    }

                    let assetIdHex = assetId.toHex();

                    if([nativeTokenAssetId.value, nativeTokenNamespaceId.value].includes(assetIdHex)){
                        txn.amountTransfer = DashboardService.convertToExactNativeAmount(actualAmount);
                        continue;
                    }

                    let newSDA: SDA = {
                        amount: rawAmount,
                        divisibility: 0,
                        id: assetIdHex,
                        amountIsRaw: true,
                        sendWithNamespace: isSendWithNamespace
                    };

                    if(isSendWithNamespace){
                        let namespaceId = transferTxn.mosaics[y].id;

                        newSDA.sendWithAlias = {
                            idHex: namespaceId.toHex(),
                            id: namespaceId.toDTO().id
                        }
                    }

                    sdas.push(newSDA);
                }

                let namespaceIds = sdas.filter(sda => sda.sendWithNamespace).map(sda => Helper.createNamespaceId(sda.sendWithAlias.id));

                let allAssetId = sdas.filter(sda =>{ 
                    return sda.amountIsRaw
                }).map(sda => Helper.createAssetId(sda.id));

                if(namespaceIds.length || allAssetId.length){
                    let namespacesNames: NamespaceName[] = [];
                    namespacesNames = await AppState.chainAPI.namespaceAPI.getNamespacesName(namespaceIds);
                    let assetsProperties = await AppState.chainAPI.assetAPI.getMosaics(allAssetId);
                    let aliasNames: MosaicNames[] = await AppState.chainAPI.assetAPI.getMosaicsNames(allAssetId);

                    for(let x= 0; x < sdas.length; ++x){

                        let assetProperties = assetsProperties.filter(aliasName=> aliasName.mosaicId.toHex() === sdas[x].id)[0];

                        sdas[x].divisibility = assetProperties.divisibility;
                        sdas[x].amount = DashboardService.convertToExactAmount(sdas[x].amount, assetProperties.divisibility);
                        sdas[x].amountIsRaw = false;

                        let mosaicNames: MosaicNames = aliasNames.filter(aliaName => aliaName.mosaicId.toHex() === sdas[x].id)[0];
                        let currentAliasNames: NamespaceName[] = mosaicNames.names;
                        sdas[x].currentAlias = currentAliasNames.map(currentAlias =>{ 
                            return { name: currentAlias.name, id: currentAlias.namespaceId.toDTO().id, idHex: currentAlias.namespaceId.toHex() }
                        });

                        if(sdas[x].sendWithAlias){
                            sdas[x].sendWithAlias.name = namespacesNames
                                .filter(nsName => nsName.namespaceId.toHex() === sdas[x].sendWithAlias.idHex)
                                .map(nsName => nsName.name)[0]
                        }
                    }
                }
            }
            txn.sda = sdas;
            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatUnconfirmedMixedTxns(txns: Transaction[]): Promise<UnconfirmedTransferTransaction[]>{

        let formatedTxns : UnconfirmedTransferTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedTransferTransaction, formattedTxn) as UnconfirmedTransferTransaction;
            
            let sdas: SDA[] = [];

            if(txns[i].type === TransactionType.TRANSFER){
                let transferTxn = txns[i] as TransferTransaction;
                txn.message = transferTxn.message.payload;
                txn.messageType = transferTxn.message.type;

                if(txn.messageType === MessageType.PlainMessage){
                    let newType = this.convertToSwapType(txn.message);
                
                    if(newType){
                        txn.type = newType;
                    }
                }

                switch(txn.messageType){
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
                let recipientIsNamespace = transferTxn.recipient instanceof NamespaceId ? true : false;

                let recipient;

                if(transferTxn.recipient instanceof NamespaceId){
                    txn.recipientNamespaceId = transferTxn.recipient.toHex();
                    recipient = await DashboardService.getAddressAlias(transferTxn.recipient);
                    let namespacesName = await DashboardService.getNamespacesName([transferTxn.recipient]);
                    txn.recipientNamespaceName = namespacesName[0].name;
                }
                else{
                    recipient = transferTxn.recipient;
                }

                txn.recipient = recipient.plain();
                txn.sender = transferTxn.signer.address.plain();
                txn.in_out = this.selectedAccount.address === txn.sender ? false: true;

                for(let y = 0; y < transferTxn.mosaics.length; ++y){

                    let rawAmount = transferTxn.mosaics[y].amount.compact();
                    let actualAmount = rawAmount;

                    let assetId;
                    let isSendWithNamespace = DashboardService.isNamespace(transferTxn.mosaics[y].id);

                    if(isSendWithNamespace){
                        let namespaceId = new NamespaceId(transferTxn.mosaics[y].id.toDTO().id);
                        assetId = await DashboardService.getAssetAlias(namespaceId);
                    }
                    else{
                        assetId = transferTxn.mosaics[y].id;
                    }

                    let assetIdHex = assetId.toHex();

                    if([nativeTokenAssetId.value, nativeTokenNamespaceId.value].includes(assetIdHex)){
                        txn.amountTransfer = DashboardService.convertToExactNativeAmount(actualAmount);
                        continue;
                    }

                    let newSDA: SDA = {
                        amount: rawAmount,
                        divisibility: 0,
                        id: assetIdHex,
                        amountIsRaw: true,
                        sendWithNamespace: isSendWithNamespace
                    };

                    if(isSendWithNamespace){
                        let namespaceId = transferTxn.mosaics[y].id;

                        newSDA.sendWithAlias = {
                            idHex: namespaceId.toHex(),
                            id: namespaceId.toDTO().id
                        }
                    }

                    sdas.push(newSDA);
                }

                let namespaceIds = sdas.filter(sda => sda.sendWithNamespace).map(sda => Helper.createNamespaceId(sda.sendWithAlias.id));

                let allAssetId = sdas.filter(sda =>{ 
                    return sda.amountIsRaw
                }).map(sda => Helper.createAssetId(sda.id));

                if(namespaceIds.length || allAssetId.length){
                    let namespacesNames: NamespaceName[] = [];
                    namespacesNames = await AppState.chainAPI.namespaceAPI.getNamespacesName(namespaceIds);
                    let assetsProperties = await AppState.chainAPI.assetAPI.getMosaics(allAssetId);
                    let aliasNames: MosaicNames[] = await AppState.chainAPI.assetAPI.getMosaicsNames(allAssetId);

                    for(let x= 0; x < sdas.length; ++x){

                        let assetProperties = assetsProperties.filter(aliasName=> aliasName.mosaicId.toHex() === sdas[x].id)[0];

                        sdas[x].divisibility = assetProperties.divisibility;
                        sdas[x].amount = DashboardService.convertToExactAmount(sdas[x].amount, assetProperties.divisibility);
                        sdas[x].amountIsRaw = false;

                        let mosaicNames: MosaicNames = aliasNames.filter(aliaName => aliaName.mosaicId.toHex() === sdas[x].id)[0];
                        let currentAliasNames: NamespaceName[] = mosaicNames.names;
                        sdas[x].currentAlias = currentAliasNames.map(currentAlias =>{ 
                            return { name: currentAlias.name, id: currentAlias.namespaceId.toDTO().id, idHex: currentAlias.namespaceId.toHex() }
                        });

                        if(sdas[x].sendWithAlias){
                            sdas[x].sendWithAlias.name = namespacesNames
                                .filter(nsName => nsName.namespaceId.toHex() === sdas[x].sendWithAlias.idHex)
                                .map(nsName => nsName.name)[0]
                        }
                    }
                }
            }
            txn.sda = sdas;
            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedMixedTxns(txns: Transaction[]): Promise<ConfirmedTransferTransaction[]>{

        let formatedTxns : ConfirmedTransferTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedTransferTransaction, formattedTxn) as ConfirmedTransferTransaction;

            let sdas: SDA[] = [];

            if(txns[i].type === TransactionType.TRANSFER){
                let transferTxn = txns[i] as TransferTransaction;
                txn.message = transferTxn.message.payload;
                txn.messageType = transferTxn.message.type;

                if(txn.messageType === MessageType.PlainMessage){
                    let newType = this.convertToSwapType(txn.message);
                
                    if(newType){
                        txn.type = newType;
                    }
                }
                switch(txn.messageType){
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
                let recipientIsNamespace = transferTxn.recipient instanceof NamespaceId ? true : false;

                if(transferTxn.recipient instanceof NamespaceId){
                    txn.recipientNamespaceId = transferTxn.recipient.toHex();
                    let namespacesName = await DashboardService.getNamespacesName([transferTxn.recipient]);
                    txn.recipientNamespaceName = namespacesName[0].name;
                }

                let recipient = await DashboardService.getRecipient(transferTxn, txn.block);

                txn.recipient = recipient.plain();
                txn.sender = transferTxn.signer.address.plain();
                txn.in_out = this.selectedAccount.address === txn.sender ? false: true;

                for(let y = 0; y < transferTxn.mosaics.length; ++y){

                    let rawAmount = transferTxn.mosaics[y].amount.compact();
                    let actualAmount = rawAmount;
                    let isSendWithNamespace = DashboardService.isNamespace(transferTxn.mosaics[y].id);
                    let assetId = await DashboardService.getResolvedAsset(transferTxn.mosaics[y].id, txn.block);
                    let assetIdHex = assetId.toHex();

                    if([nativeTokenAssetId.value, nativeTokenNamespaceId.value].includes(assetIdHex)){
                        txn.amountTransfer = DashboardService.convertToExactNativeAmount(actualAmount);
                        continue;
                    }

                    let newSDA: SDA = {
                        amount: rawAmount,
                        divisibility: 0,
                        id: assetIdHex,
                        amountIsRaw: true,
                        sendWithNamespace: isSendWithNamespace
                    };

                    if(isSendWithNamespace){
                        let namespaceId = transferTxn.mosaics[y].id;

                        newSDA.sendWithAlias = {
                            idHex: namespaceId.toHex(),
                            id: namespaceId.toDTO().id
                        }
                    }

                    sdas.push(newSDA);
                }

                let namespaceIds = sdas.filter(sda => sda.sendWithNamespace).map(sda => Helper.createNamespaceId(sda.sendWithAlias.id));

                let allAssetId = sdas.filter(sda =>{ 
                    return sda.amountIsRaw
                }).map(sda => Helper.createAssetId(sda.id));

                if(namespaceIds.length || allAssetId.length){
                    let namespacesNames: NamespaceName[] = [];
                    namespacesNames = await AppState.chainAPI.namespaceAPI.getNamespacesName(namespaceIds);
                    let assetsProperties = await AppState.chainAPI.assetAPI.getMosaics(allAssetId);
                    let aliasNames: MosaicNames[] = await AppState.chainAPI.assetAPI.getMosaicsNames(allAssetId);

                    for(let x= 0; x < sdas.length; ++x){

                        let assetProperties = assetsProperties.filter(aliasName=> aliasName.mosaicId.toHex() === sdas[x].id)[0];

                        sdas[x].divisibility = assetProperties.divisibility;
                        sdas[x].amount = DashboardService.convertToExactAmount(sdas[x].amount, assetProperties.divisibility);
                        sdas[x].amountIsRaw = false;

                        let mosaicNames: MosaicNames = aliasNames.filter(aliaName => aliaName.mosaicId.toHex() === sdas[x].id)[0];
                        let currentAliasNames: NamespaceName[] = mosaicNames.names;
                        sdas[x].currentAlias = currentAliasNames.map(currentAlias =>{ 
                            return { name: currentAlias.name, id: currentAlias.namespaceId.toDTO().id, idHex: currentAlias.namespaceId.toHex() }
                        });

                        if(sdas[x].sendWithAlias){
                            sdas[x].sendWithAlias.name = namespacesNames
                                .filter(nsName => nsName.namespaceId.toHex() === sdas[x].sendWithAlias.idHex)
                                .map(nsName => nsName.name)[0]
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
    async formatUnconfirmedAccountTransaction(txns: Transaction[]): Promise<UnconfirmedAccountTransaction[]>{

        let formatedTxns : UnconfirmedAccountTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedAccountTransaction, formattedTxn) as UnconfirmedAccountTransaction;

            if(txns[i].type === TransactionType.MODIFY_MULTISIG_ACCOUNT){
                let modifyMultisigTxn = txns[i] as ModifyMultisigAccountTransaction;

                txn.approvalDelta = modifyMultisigTxn.minApprovalDelta;
                txn.removalDelta = modifyMultisigTxn.minRemovalDelta;
                txn.addedCosigner = modifyMultisigTxn.modifications.filter(x => x.type === MultisigCosignatoryModificationType.Add)
                    .map(x => x.cosignatoryPublicAccount.publicKey);
                txn.removedCosigner = modifyMultisigTxn.modifications.filter(x => x.type === MultisigCosignatoryModificationType.Remove)
                    .map(x => x.cosignatoryPublicAccount.publicKey);

                try {
                    let multisigInfo = await AppState.chainAPI.accountAPI.getMultisigAccountInfo(modifyMultisigTxn.signer.address);

                    if(multisigInfo){
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

    async formatConfirmedAccountTransaction(txns: Transaction[]): Promise<ConfirmedAccountTransaction[]>{

        let formatedTxns : ConfirmedAccountTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedAccountTransaction, formattedTxn) as ConfirmedAccountTransaction;
            
            if(txns[i].type === TransactionType.MODIFY_MULTISIG_ACCOUNT){
                let modifyMultisigTxn = txns[i] as ModifyMultisigAccountTransaction;

                txn.approvalDelta = modifyMultisigTxn.minApprovalDelta;
                txn.removalDelta = modifyMultisigTxn.minRemovalDelta;
                txn.addedCosigner = modifyMultisigTxn.modifications.filter(x => x.type === MultisigCosignatoryModificationType.Add)
                    .map(x => x.cosignatoryPublicAccount.publicKey);
                txn.removedCosigner = modifyMultisigTxn.modifications.filter(x => x.type === MultisigCosignatoryModificationType.Remove)
                    .map(x => x.cosignatoryPublicAccount.publicKey);
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatPartialAccountTransaction(txns: Transaction[]): Promise<PartialAccountTransaction[]>{

        let formatedTxns : PartialAccountTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialAccountTransaction, formattedTxn) as PartialAccountTransaction;
            
            if(txns[i].type === TransactionType.MODIFY_MULTISIG_ACCOUNT){
                let modifyMultisigTxn = txns[i] as ModifyMultisigAccountTransaction;

                txn.approvalDelta = modifyMultisigTxn.minApprovalDelta;
                txn.removalDelta = modifyMultisigTxn.minRemovalDelta;
                txn.addedCosigner = modifyMultisigTxn.modifications.filter(x => x.type === MultisigCosignatoryModificationType.Add)
                    .map(x => x.cosignatoryPublicAccount.publicKey);
                txn.removedCosigner = modifyMultisigTxn.modifications.filter(x => x.type === MultisigCosignatoryModificationType.Remove)
                    .map(x => x.cosignatoryPublicAccount.publicKey);

                try {
                    let multisigInfo = await AppState.chainAPI.accountAPI.getMultisigAccountInfo(modifyMultisigTxn.signer.address);

                    if(multisigInfo){
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
    async formatUnconfirmedAliasTransaction(txns: Transaction[]): Promise<UnconfirmedAliasTransaction[]>{

        let formatedTxns : UnconfirmedAliasTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedAliasTransaction, formattedTxn) as UnconfirmedAliasTransaction;

            if(txns[i].type === TransactionType.ADDRESS_ALIAS){
                let addressAliasTxn = txns[i] as AddressAliasTransaction;

                txn.address = addressAliasTxn.address.plain();
                txn.aliasType = addressAliasTxn.actionType;
                txn.aliasTypeName = addressAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";
        
                let nsId = addressAliasTxn.namespaceId;

                try {
                    let nsName = await DashboardService.getNamespacesName([nsId]);

                    txn.aliasName = nsName[0].name;
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.MOSAIC_ALIAS){
                let assetAliasTxn = txns[i] as MosaicAliasTransaction;

                txn.assetId = assetAliasTxn.mosaicId.toHex();
                txn.aliasType = assetAliasTxn.actionType;
                txn.aliasTypeName = assetAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";
        
                let nsId = assetAliasTxn.namespaceId;

                try {
                    let nsName = await DashboardService.getNamespacesName([nsId]);

                    txn.aliasName = nsName[0].name;
                } catch (error) {
                    
                }
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedAliasTransaction(txns: Transaction[]): Promise<ConfirmedAliasTransaction[]>{

        let formatedTxns : ConfirmedAliasTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedAliasTransaction, formattedTxn) as ConfirmedAliasTransaction;
            
            if(txns[i].type === TransactionType.ADDRESS_ALIAS){
                let addressAliasTxn = txns[i] as AddressAliasTransaction;

                txn.address = addressAliasTxn.address.plain();
                txn.aliasType = addressAliasTxn.actionType;
                txn.aliasTypeName = addressAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";
        
                let nsId = addressAliasTxn.namespaceId;

                try {
                    let nsName = await DashboardService.getNamespacesName([nsId]);

                    txn.aliasName = nsName[0].name;
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.MOSAIC_ALIAS){
                let assetAliasTxn = txns[i] as MosaicAliasTransaction;

                txn.assetId = assetAliasTxn.mosaicId.toHex();
                txn.aliasType = assetAliasTxn.actionType;
                txn.aliasTypeName = assetAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";
        
                let nsId = assetAliasTxn.namespaceId;

                try {
                    let nsName = await DashboardService.getNamespacesName([nsId]);

                    txn.aliasName = nsName[0].name;
                } catch (error) {
                    
                }
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatPartialAliasTransaction(txns: Transaction[]): Promise<PartialAliasTransaction[]>{

        let formatedTxns : PartialAliasTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialAliasTransaction, formattedTxn) as PartialAliasTransaction;
            
            if(txns[i].type === TransactionType.ADDRESS_ALIAS){
                let addressAliasTxn = txns[i] as AddressAliasTransaction;

                txn.address = addressAliasTxn.address.plain();
                txn.aliasType = addressAliasTxn.actionType;
                txn.aliasTypeName = addressAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";
        
                let nsId = addressAliasTxn.namespaceId;

                try {
                    let nsName = await DashboardService.getNamespacesName([nsId]);

                    txn.aliasName = nsName[0].name;
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.MOSAIC_ALIAS){
                let assetAliasTxn = txns[i] as MosaicAliasTransaction;

                txn.assetId = assetAliasTxn.mosaicId.toHex();
                txn.aliasType = assetAliasTxn.actionType;
                txn.aliasTypeName = assetAliasTxn.actionType === AliasActionType.Link ? "Link" : "Unlink";
        
                let nsId = assetAliasTxn.namespaceId;

                try {
                    let nsName = await DashboardService.getNamespacesName([nsId]);

                    txn.aliasName = nsName[0].name;
                } catch (error) {
                    
                }
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    //-------------Metadata Txn-----------------------------------------------------------
    async formatUnconfirmedMetadataTransaction(txns: Transaction[]): Promise<UnconfirmedMetadataTransaction[]>{

        let formatedTxns : UnconfirmedMetadataTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedMetadataTransaction, formattedTxn) as UnconfirmedMetadataTransaction;

            if(txns[i].type === TransactionType.MOSAIC_METADATA_V2){
                let assetMetadataTxn = txns[i] as MosaicMetadataTransaction;

                let assetId = assetMetadataTxn.targetMosaicId.toHex();

                txn.metadataType = MetadataType.MOSAIC;
                txn.metadataTypeName = "Asset";
                txn.scopedMetadataKey = assetMetadataTxn.scopedMetadataKey.toHex();
                txn.targetId = assetId;
                txn.targetPublicKey = assetMetadataTxn.targetPublicKey.publicKey;
                txn.sizeChanged = assetMetadataTxn.valueSizeDelta;
                txn.valueChange = Convert.uint8ToHex(assetMetadataTxn.valueDifferences);

                try {
                    let assetName = await DashboardService.getAssetName(assetId);

                    if(assetName.names.length){
                        txn.targetIdName = assetName.names[0].name;
                    }

                    let assetMetadataEntry = await DashboardService.getAssetMetadata(assetMetadataTxn.targetMosaicId, assetMetadataTxn.scopedMetadataKey);
                    
                    if(assetMetadataEntry){
                        txn.oldValue = assetMetadataEntry.value;
                        txn.newValue = DashboardService.applyValueChange(txn.oldValue, txn.valueChange, txn.sizeChanged);
                    }

                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.NAMESPACE_METADATA_V2){
                let namespaceMetadataTxn = txns[i] as NamespaceMetadataTransaction;

                let nsId = namespaceMetadataTxn.targetNamespaceId.toHex();

                txn.metadataType = MetadataType.NAMESPACE;
                txn.metadataTypeName = "Namespace";
                txn.scopedMetadataKey = namespaceMetadataTxn.scopedMetadataKey.toHex();
                txn.targetId = nsId;
                txn.targetPublicKey = namespaceMetadataTxn.targetPublicKey.publicKey;
                txn.sizeChanged = namespaceMetadataTxn.valueSizeDelta;
                txn.valueChange = Convert.uint8ToHex(namespaceMetadataTxn.valueDifferences);

                try {
                    let nsName = await DashboardService.getNamespacesName([NamespaceId.createFromEncoded(nsId)]);

                    if(nsName.length){
                        txn.targetIdName = nsName[0].name;
                    }

                    let nsMetadataEntry = await DashboardService.getNamespaceMetadata(namespaceMetadataTxn.targetNamespaceId, namespaceMetadataTxn.scopedMetadataKey);
                    
                    if(nsMetadataEntry){
                        txn.oldValue = nsMetadataEntry.value;
                        txn.newValue = DashboardService.applyValueChange(txn.oldValue, txn.valueChange, txn.sizeChanged);
                    }
                    
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.ACCOUNT_METADATA_V2){
                let accountMetadataTxn = txns[i] as AccountMetadataTransaction;

                txn.metadataType = MetadataType.ACCOUNT;
                txn.metadataTypeName = "Account";

                txn.scopedMetadataKey = accountMetadataTxn.scopedMetadataKey.toHex();
                txn.targetPublicKey = accountMetadataTxn.targetPublicKey.publicKey;
                txn.sizeChanged = accountMetadataTxn.valueSizeDelta;
                txn.valueChange = Convert.uint8ToHex(accountMetadataTxn.valueDifferences);

                try {
                    let nsMetadataEntry = await DashboardService.getAccountMetadata(accountMetadataTxn.targetPublicKey, accountMetadataTxn.scopedMetadataKey);
                    
                    if(nsMetadataEntry){
                        txn.oldValue = nsMetadataEntry.value;
                        txn.newValue = DashboardService.applyValueChange(txn.oldValue, txn.valueChange, txn.sizeChanged);
                    }
                } catch (error) {
                    
                }
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedMetadataTransaction(txns: Transaction[]): Promise<ConfirmedMetadataTransaction[]>{

        let formatedTxns : ConfirmedMetadataTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedMetadataTransaction, formattedTxn) as ConfirmedMetadataTransaction;
            
            if(txns[i].type === TransactionType.MOSAIC_METADATA_V2){
                let assetMetadataTxn = txns[i] as MosaicMetadataTransaction;

                let assetId = assetMetadataTxn.targetMosaicId.toHex();

                txn.metadataType = MetadataType.MOSAIC;
                txn.metadataTypeName = "Asset";
                txn.scopedMetadataKey = assetMetadataTxn.scopedMetadataKey.toHex();
                txn.targetId = assetId;
                txn.targetPublicKey = assetMetadataTxn.targetPublicKey.publicKey;
                txn.sizeChanged = assetMetadataTxn.valueSizeDelta;

                try {
                    let assetName = await DashboardService.getAssetName(assetId);

                    if(assetName.names.length){
                        txn.targetIdName = assetName.names[0].name;
                    }
                    
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.NAMESPACE_METADATA_V2){
                let namespaceMetadataTxn = txns[i] as NamespaceMetadataTransaction;

                let nsId = namespaceMetadataTxn.targetNamespaceId.toHex();

                txn.metadataType = MetadataType.NAMESPACE;
                txn.metadataTypeName = "Namespace";
                txn.scopedMetadataKey = namespaceMetadataTxn.scopedMetadataKey.toHex();
                txn.targetId = nsId;
                txn.targetPublicKey = namespaceMetadataTxn.targetPublicKey.publicKey;
                txn.sizeChanged = namespaceMetadataTxn.valueSizeDelta;

                try {
                    let nsName = await DashboardService.getNamespacesName([NamespaceId.createFromEncoded(nsId)]);

                    if(nsName.length){
                        txn.targetIdName = nsName[0].name;
                    }
                    
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.ACCOUNT_METADATA_V2){
                let accountMetadataTxn = txns[i] as AccountMetadataTransaction;

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

    async formatPartialMetadataTransaction(txns: Transaction[]): Promise<PartialMetadataTransaction[]>{

        let formatedTxns : PartialMetadataTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialMetadataTransaction, formattedTxn) as PartialMetadataTransaction;
            
            if(txns[i].type === TransactionType.MOSAIC_METADATA_V2){
                let assetMetadataTxn = txns[i] as MosaicMetadataTransaction;

                let assetId = assetMetadataTxn.targetMosaicId.toHex();

                txn.metadataType = MetadataType.MOSAIC;
                txn.metadataTypeName = "Asset";
                txn.scopedMetadataKey = assetMetadataTxn.scopedMetadataKey.toHex();
                txn.targetId = assetId;
                txn.targetPublicKey = assetMetadataTxn.targetPublicKey.publicKey;
                txn.sizeChanged = assetMetadataTxn.valueSizeDelta;
                txn.valueChange = Convert.uint8ToHex(assetMetadataTxn.valueDifferences);

                try {
                    let assetName = await DashboardService.getAssetName(assetId);

                    if(assetName.names.length){
                        txn.targetIdName = assetName.names[0].name;
                    }

                    let assetMetadataEntry = await DashboardService.getAssetMetadata(assetMetadataTxn.targetMosaicId, assetMetadataTxn.scopedMetadataKey);
                    
                    if(assetMetadataEntry){
                        txn.oldValue = assetMetadataEntry.value;
                        txn.newValue = DashboardService.applyValueChange(txn.oldValue, txn.valueChange, txn.sizeChanged);
                    }
                    
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.NAMESPACE_METADATA_V2){
                let namespaceMetadataTxn = txns[i] as NamespaceMetadataTransaction;

                let nsId = namespaceMetadataTxn.targetNamespaceId.toHex();

                txn.metadataType = MetadataType.NAMESPACE;
                txn.metadataTypeName = "Namespace";
                txn.scopedMetadataKey = namespaceMetadataTxn.scopedMetadataKey.toHex();
                txn.targetId = nsId;
                txn.targetPublicKey = namespaceMetadataTxn.targetPublicKey.publicKey;
                txn.sizeChanged = namespaceMetadataTxn.valueSizeDelta;
                txn.valueChange = Convert.uint8ToHex(namespaceMetadataTxn.valueDifferences);

                try {
                    let nsName = await DashboardService.getNamespacesName([NamespaceId.createFromEncoded(nsId)]);

                    if(nsName.length){
                        txn.targetIdName = nsName[0].name;
                    }

                    let nsMetadataEntry = await DashboardService.getNamespaceMetadata(namespaceMetadataTxn.targetNamespaceId, namespaceMetadataTxn.scopedMetadataKey);
                    
                    if(nsMetadataEntry){
                        txn.oldValue = nsMetadataEntry.value;
                        txn.newValue = DashboardService.applyValueChange(txn.oldValue, txn.valueChange, txn.sizeChanged);
                    }
                    
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.ACCOUNT_METADATA_V2){
                let accountMetadataTxn = txns[i] as AccountMetadataTransaction;

                txn.metadataType = MetadataType.ACCOUNT;
                txn.metadataTypeName = "Account";

                txn.scopedMetadataKey = accountMetadataTxn.scopedMetadataKey.toHex();
                txn.targetPublicKey = accountMetadataTxn.targetPublicKey.publicKey;
                txn.sizeChanged = accountMetadataTxn.valueSizeDelta;
                txn.valueChange = Convert.uint8ToHex(accountMetadataTxn.valueDifferences);

                try {
                    let nsMetadataEntry = await DashboardService.getAccountMetadata(accountMetadataTxn.targetPublicKey, accountMetadataTxn.scopedMetadataKey);
                    
                    if(nsMetadataEntry){
                        txn.oldValue = nsMetadataEntry.value;
                        txn.newValue = DashboardService.applyValueChange(txn.oldValue, txn.valueChange, txn.sizeChanged);
                    }
                } catch (error) {
                    
                }
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    //-------------Aggregate Txn-----------------------------------------------------------
    async formatUnconfirmedAggregateTransaction(txns: Transaction[]): Promise<UnconfirmedAggregateTransaction[]>{

        let formatedTxns : UnconfirmedAggregateTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedAggregateTransaction, formattedTxn) as UnconfirmedAggregateTransaction;

            if(txns[i].type === TransactionType.AGGREGATE_BONDED || txns[i].type === TransactionType.AGGREGATE_COMPLETE){
                let aggregateTxn = await this.autoFindAggregateTransaction(txn.hash);
                txn.aggregateLength = aggregateTxn.innerTransactions.length;
                
                for(let x=0; x < aggregateTxn.innerTransactions.length; ++x){
                    let txnType = aggregateTxn.innerTransactions[x].type;
                    let listFound = txn.txnList.find(txn => txn.type === txnType);
                    
                    if(listFound){
                        listFound.total += 1;
                    }
                    else{
                        let txnList: TxnList = {
                            type: txnType,
                            name: TransactionUtils.getTransactionTypeName(txnType),
                            total: 1
                        }; 
                        txn.txnList.push(txnList);
                    }
                }
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedAggregateTransaction(txns: Transaction[]): Promise<ConfirmedAggregateTransaction[]>{

        let formatedTxns : ConfirmedAggregateTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedAggregateTransaction, formattedTxn) as ConfirmedAggregateTransaction;
            
            if(txns[i].type === TransactionType.AGGREGATE_BONDED || txns[i].type === TransactionType.AGGREGATE_COMPLETE){
                let aggregateTxn = await this.autoFindAggregateTransaction(txn.hash);
                txn.aggregateLength = aggregateTxn.innerTransactions.length;
                
                for(let x=0; x < aggregateTxn.innerTransactions.length; ++x){
                    let txnType = aggregateTxn.innerTransactions[x].type;
                    let listFound = txn.txnList.find(txn => txn.type === txnType);
                    
                    if(listFound){
                        listFound.total += 1;
                    }
                    else{
                        let txnList: TxnList = {
                            type: txnType,
                            name: TransactionUtils.getTransactionTypeName(txnType),
                            total: 1
                        }; 
                        txn.txnList.push(txnList);
                    }
                }
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatPartialAggregateTransaction(txns: Transaction[]): Promise<PartialAggregateTransaction[]>{

        let formatedTxns : PartialAggregateTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialAggregateTransaction, formattedTxn) as PartialAggregateTransaction;
            
            if(txns[i].type === TransactionType.AGGREGATE_BONDED || txns[i].type === TransactionType.AGGREGATE_COMPLETE){
                let aggregateTxn = await this.autoFindAggregateTransaction(txn.hash);
                txn.aggregateLength = aggregateTxn.innerTransactions.length;
                
                for(let x=0; x < aggregateTxn.innerTransactions.length; ++x){
                    let txnType = aggregateTxn.innerTransactions[x].type;
                    let listFound = txn.txnList.find(txn => txn.type === txnType);
                    
                    if(listFound){
                        listFound.total += 1;
                    }
                    else{
                        let txnList: TxnList = {
                            type: txnType,
                            name: TransactionUtils.getTransactionTypeName(txnType),
                            total: 1
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
    async formatUnconfirmedAssetTransaction(txns: Transaction[]): Promise<UnconfirmedAssetTransaction[]>{

        let formatedTxns : UnconfirmedAssetTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedAssetTransaction, formattedTxn) as UnconfirmedAssetTransaction;

            if(txns[i].type === TransactionType.MOSAIC_DEFINITION){
                let assetDefinitionTxn = txns[i] as MosaicDefinitionTransaction;

                txn.assetId = assetDefinitionTxn.mosaicId.toHex();
                txn.divisibility = assetDefinitionTxn.mosaicProperties.divisibility;
                txn.duration = assetDefinitionTxn.mosaicProperties.duration ? 
                    assetDefinitionTxn.mosaicProperties.duration.compact() : undefined;
                txn.transferable = assetDefinitionTxn.mosaicProperties.transferable;
                txn.supplyMutable = assetDefinitionTxn.mosaicProperties.supplyMutable;
                txn.nonce = assetDefinitionTxn.mosaicNonce.toNumber();
            }
            else if(txns[i].type === TransactionType.MOSAIC_SUPPLY_CHANGE){
                let assetSupplyChangeTxn = txns[i] as MosaicSupplyChangeTransaction;

                let assetId = assetSupplyChangeTxn.mosaicId.toHex();

                txn.assetId = assetId;
                txn.supplyDelta = assetSupplyChangeTxn.delta.compact();
                txn.supplyDeltaIsRaw = true;

                if(assetSupplyChangeTxn.direction === MosaicSupplyType.Decrease){
                    txn.supplyDelta = -txn.supplyDelta;
                }

                try {
                    let assetInfo = await DashboardService.getAssetInfo(assetId);

                    txn.supplyDelta = DashboardService.convertToExactAmount(txn.supplyDelta, assetInfo.divisibility);

                    txn.supplyDeltaIsRaw = false;
                    
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.MODIFY_MOSAIC_LEVY){
                let assetModifyLevyTxn = txns[i] as MosaicModifyLevyTransaction;

                let assetId = assetModifyLevyTxn.mosaicId.toHex();
                let levyAssetId = assetModifyLevyTxn.mosaicLevy.mosaicId.toHex();
                let levyAmount = assetModifyLevyTxn.mosaicLevy.fee.compact();

                txn.assetId = assetId;
                txn.levyAssetId = levyAssetId;
                txn.levyAssetAmount = levyAmount;
                txn.levyAssetAmountIsRaw = true;
                txn.levyType = assetModifyLevyTxn.mosaicLevy.type;
                txn.levyRecipient = assetModifyLevyTxn.mosaicLevy.recipient.plain();

                try {
                    let assetName = await DashboardService.getAssetName(assetId);

                    if(assetName.names.length){
                        txn.namespaceName = assetName.names[0].name;
                    }

                    let levyAssetInfo = await DashboardService.getAssetInfo(levyAssetId);

                    txn.levyAssetAmount = DashboardService.convertToExactAmount(levyAmount, levyAssetInfo.divisibility);

                    txn.levyAssetAmountIsRaw = false;

                    let levyAssetName = await DashboardService.getAssetName(levyAssetId);

                    if(levyAssetName.names.length){
                        txn.levyAssetName = levyAssetName.names[0].name;
                    }
                
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.REMOVE_MOSAIC_LEVY){
                let assetRemoveLevyTxn = txns[i] as MosaicRemoveLevyTransaction;

                let assetId = assetRemoveLevyTxn.mosaicId.toHex();

                txn.assetId = assetId;
                
                try {
                    let assetName = await DashboardService.getAssetName(assetId);

                    if(assetName.names.length){
                        txn.namespaceName = assetName.names[0].name;
                    }
                
                } catch (error) {
                    
                }
            }
            
            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedAssetTransaction(txns: Transaction[]): Promise<ConfirmedAssetTransaction[]>{

        let formatedTxns : ConfirmedAssetTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedAssetTransaction, formattedTxn) as ConfirmedAssetTransaction;
            
            if(txns[i].type === TransactionType.MOSAIC_DEFINITION){
                let assetDefinitionTxn = txns[i] as MosaicDefinitionTransaction;

                txn.assetId = assetDefinitionTxn.mosaicId.toHex();
                txn.divisibility = assetDefinitionTxn.mosaicProperties.divisibility;
                txn.duration = assetDefinitionTxn.mosaicProperties.duration ? 
                    assetDefinitionTxn.mosaicProperties.duration.compact() : undefined;
                txn.transferable = assetDefinitionTxn.mosaicProperties.transferable;
                txn.supplyMutable = assetDefinitionTxn.mosaicProperties.supplyMutable;
                txn.nonce = assetDefinitionTxn.mosaicNonce.toNumber();
            }
            else if(txns[i].type === TransactionType.MOSAIC_SUPPLY_CHANGE){
                let assetSupplyChangeTxn = txns[i] as MosaicSupplyChangeTransaction;

                let assetId = assetSupplyChangeTxn.mosaicId.toHex();

                txn.assetId = assetId;
                txn.supplyDelta = assetSupplyChangeTxn.delta.compact();
                txn.supplyDeltaIsRaw = true;

                if(assetSupplyChangeTxn.direction === MosaicSupplyType.Decrease){
                    txn.supplyDelta = -txn.supplyDelta;
                }

                try {
                    let assetInfo = await DashboardService.getAssetInfo(assetId);

                    txn.supplyDelta = DashboardService.convertToExactAmount(txn.supplyDelta, assetInfo.divisibility);

                    txn.supplyDeltaIsRaw = false;
                    
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.MODIFY_MOSAIC_LEVY){
                let assetModifyLevyTxn = txns[i] as MosaicModifyLevyTransaction;

                let assetId = assetModifyLevyTxn.mosaicId.toHex();
                let levyAssetId = assetModifyLevyTxn.mosaicLevy.mosaicId.toHex();
                let levyAmount = assetModifyLevyTxn.mosaicLevy.fee.compact();

                txn.assetId = assetId;
                txn.levyAssetId = levyAssetId;
                txn.levyAssetAmount = levyAmount;
                txn.levyAssetAmountIsRaw = true;
                txn.levyType = assetModifyLevyTxn.mosaicLevy.type;
                txn.levyRecipient = assetModifyLevyTxn.mosaicLevy.recipient.plain();

                try {
                    let assetName = await DashboardService.getAssetName(assetId);

                    if(assetName.names.length){
                        txn.namespaceName = assetName.names[0].name;
                    }

                    let levyAssetInfo = await DashboardService.getAssetInfo(levyAssetId);

                    txn.levyAssetAmount = DashboardService.convertToExactAmount(levyAmount, levyAssetInfo.divisibility);

                    txn.levyAssetAmountIsRaw = false;

                    let levyAssetName = await DashboardService.getAssetName(levyAssetId);

                    if(levyAssetName.names.length){
                        txn.levyAssetName = levyAssetName.names[0].name;
                    }
                
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.REMOVE_MOSAIC_LEVY){
                let assetRemoveLevyTxn = txns[i] as MosaicRemoveLevyTransaction;

                let assetId = assetRemoveLevyTxn.mosaicId.toHex();

                txn.assetId = assetId;
                
                try {
                    let assetName = await DashboardService.getAssetName(assetId);

                    if(assetName.names.length){
                        txn.namespaceName = assetName.names[0].name;
                    }
                
                } catch (error) {
                    
                }
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatPartialAssetTransaction(txns: Transaction[]): Promise<PartialAssetTransaction[]>{

        let formatedTxns : PartialAssetTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialAssetTransaction, formattedTxn) as PartialAssetTransaction;
            
            if(txns[i].type === TransactionType.MOSAIC_DEFINITION){
                let assetDefinitionTxn = txns[i] as MosaicDefinitionTransaction;

                txn.assetId = assetDefinitionTxn.mosaicId.toHex();
                txn.divisibility = assetDefinitionTxn.mosaicProperties.divisibility;
                txn.duration = assetDefinitionTxn.mosaicProperties.duration ? 
                    assetDefinitionTxn.mosaicProperties.duration.compact() : undefined;
                txn.transferable = assetDefinitionTxn.mosaicProperties.transferable;
                txn.supplyMutable = assetDefinitionTxn.mosaicProperties.supplyMutable;
                txn.nonce = assetDefinitionTxn.mosaicNonce.toNumber();
            }
            else if(txns[i].type === TransactionType.MOSAIC_SUPPLY_CHANGE){
                let assetSupplyChangeTxn = txns[i] as MosaicSupplyChangeTransaction;

                let assetId = assetSupplyChangeTxn.mosaicId.toHex();

                txn.assetId = assetId;
                txn.supplyDelta = assetSupplyChangeTxn.delta.compact();
                txn.supplyDeltaIsRaw = true;

                if(assetSupplyChangeTxn.direction === MosaicSupplyType.Decrease){
                    txn.supplyDelta = -txn.supplyDelta;
                }

                try {
                    let assetInfo = await DashboardService.getAssetInfo(assetId);

                    txn.supplyDelta = DashboardService.convertToExactAmount(txn.supplyDelta, assetInfo.divisibility);

                    txn.supplyDeltaIsRaw = false;
                    
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.MODIFY_MOSAIC_LEVY){
                let assetModifyLevyTxn = txns[i] as MosaicModifyLevyTransaction;

                let assetId = assetModifyLevyTxn.mosaicId.toHex();
                let levyAssetId = assetModifyLevyTxn.mosaicLevy.mosaicId.toHex();
                let levyAmount = assetModifyLevyTxn.mosaicLevy.fee.compact();

                txn.assetId = assetId;
                txn.levyAssetId = levyAssetId;
                txn.levyAssetAmount = levyAmount;
                txn.levyAssetAmountIsRaw = true;
                txn.levyType = assetModifyLevyTxn.mosaicLevy.type;
                txn.levyRecipient = assetModifyLevyTxn.mosaicLevy.recipient.plain();

                try {
                    let assetName = await DashboardService.getAssetName(assetId);

                    if(assetName.names.length){
                        txn.namespaceName = assetName.names[0].name;
                    }

                    let levyAssetInfo = await DashboardService.getAssetInfo(levyAssetId);

                    txn.levyAssetAmount = DashboardService.convertToExactAmount(levyAmount, levyAssetInfo.divisibility);

                    txn.levyAssetAmountIsRaw = false;

                    let levyAssetName = await DashboardService.getAssetName(levyAssetId);

                    if(levyAssetName.names.length){
                        txn.levyAssetName = levyAssetName.names[0].name;
                    }
                
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.REMOVE_MOSAIC_LEVY){
                let assetRemoveLevyTxn = txns[i] as MosaicRemoveLevyTransaction;

                let assetId = assetRemoveLevyTxn.mosaicId.toHex();

                txn.assetId = assetId;
                
                try {
                    let assetName = await DashboardService.getAssetName(assetId);

                    if(assetName.names.length){
                        txn.namespaceName = assetName.names[0].name;
                    }
                
                } catch (error) {
                    
                }
            }

            formatedTxns.push(txn);
        }
    
        return formatedTxns;
    }

    //-------------Chain Txn-----------------------------------------------------------
    async formatUnconfirmedChainTransaction(txns: Transaction[]): Promise<UnconfirmedChainTransaction[]>{

        let formatedTxns : UnconfirmedChainTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedChainTransaction, formattedTxn) as UnconfirmedChainTransaction;

            if(txns[i].type === TransactionType.CHAIN_CONFIGURE){
                let chainConfigureTxn = txns[i] as ChainConfigTransaction;

                txn.applyHeightDelta = chainConfigureTxn.applyHeightDelta.compact();
            }
            else if(txns[i].type === TransactionType.CHAIN_UPGRADE){
                let chainUpgradeTxn = txns[i] as ChainUpgradeTransaction;

                txn.upgradePeriod = chainUpgradeTxn.upgradePeriod.compact();
                txn.newVersion = chainUpgradeTxn.newBlockchainVersion.toHex()
            }
            
            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedChainTransaction(txns: Transaction[]): Promise<ConfirmedChainTransaction[]>{

        let formatedTxns : ConfirmedChainTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedChainTransaction, formattedTxn) as ConfirmedChainTransaction;
            
            if(txns[i].type === TransactionType.CHAIN_CONFIGURE){
                let chainConfigureTxn = txns[i] as ChainConfigTransaction;

                txn.applyHeightDelta = chainConfigureTxn.applyHeightDelta.compact();
            }
            else if(txns[i].type === TransactionType.CHAIN_UPGRADE){
                let chainUpgradeTxn = txns[i] as ChainUpgradeTransaction;

                txn.upgradePeriod = chainUpgradeTxn.upgradePeriod.compact();
                txn.newVersion = chainUpgradeTxn.newBlockchainVersion.toHex()
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatPartialChainTransaction(txns: Transaction[]): Promise<PartialChainTransaction[]>{

        let formatedTxns : PartialChainTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialChainTransaction, formattedTxn) as PartialChainTransaction;
            
            if(txns[i].type === TransactionType.CHAIN_CONFIGURE){
                let chainConfigureTxn = txns[i] as ChainConfigTransaction;

                txn.applyHeightDelta = chainConfigureTxn.applyHeightDelta.compact();
            }
            else if(txns[i].type === TransactionType.CHAIN_UPGRADE){
                let chainUpgradeTxn = txns[i] as ChainUpgradeTransaction;

                txn.upgradePeriod = chainUpgradeTxn.upgradePeriod.compact();
                txn.newVersion = chainUpgradeTxn.newBlockchainVersion.toHex()
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    //-------------Exchange Txn-----------------------------------------------------------
    async formatUnconfirmedExchangeTransaction(txns: Transaction[]): Promise<UnconfirmedExchangeTransaction[]>{

        let formatedTxns : UnconfirmedExchangeTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedExchangeTransaction, formattedTxn) as UnconfirmedExchangeTransaction;

            if(txns[i].type === TransactionType.EXCHANGE_OFFER){
                txn.isTakingOffer = true;
                let exchangeOfferTxn = txns[i] as ExchangeOfferTransaction;

                for(let i = 0; i < exchangeOfferTxn.offers.length; ++i){
                    let tempExchangeOffer = exchangeOfferTxn.offers[i];

                    let assetId = tempExchangeOffer.mosaicId.toHex();
                    let amount = tempExchangeOffer.mosaicAmount.compact();

                    let newTxnExchangeOffer: TxnExchangeOffer = {
                        amount: amount,
                        amountIsRaw: true,
                        assetId: assetId,
                        cost: DashboardService.convertToExactNativeAmount(tempExchangeOffer.cost.compact()),
                        owner: tempExchangeOffer.owner.publicKey,
                        type: tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy", 
                    }; 

                    try {
                        let assetInfo = await DashboardService.getAssetInfo(assetId);

                        newTxnExchangeOffer.amountIsRaw = false;
                        newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(amount, assetInfo.divisibility);
                        
                        let assetName = await DashboardService.getAssetName(assetId);

                        if(assetName.names.length){
                            newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
                        }

                    } catch (error) {
                        
                    }                    

                    txn.exchangeOffers.push(newTxnExchangeOffer);
                }
            }
            else if(txns[i].type === TransactionType.ADD_EXCHANGE_OFFER){

                let addExchangeOfferTxn = txns[i] as AddExchangeOfferTransaction;

                for(let i = 0; i < addExchangeOfferTxn.offers.length; ++i){
                    let tempExchangeOffer = addExchangeOfferTxn.offers[i];

                    let assetId = tempExchangeOffer.mosaicId.toHex();
                    let amount = tempExchangeOffer.mosaicAmount.compact();

                    let newTxnExchangeOffer: TxnExchangeOffer = {
                        amount: amount,
                        amountIsRaw: true,
                        assetId: assetId,
                        cost: DashboardService.convertToExactNativeAmount(tempExchangeOffer.cost.compact()),
                        duration: tempExchangeOffer.duration.compact(),
                        type: tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy", 
                    }; 

                    try {
                        let assetInfo = await DashboardService.getAssetInfo(assetId);

                        newTxnExchangeOffer.amountIsRaw = false;
                        newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(amount, assetInfo.divisibility);

                        let assetName = await DashboardService.getAssetName(assetId);

                        if(assetName.names.length){
                            newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
                        }

                    } catch (error) {
                        
                    }                    

                    txn.exchangeOffers.push(newTxnExchangeOffer);
                }
            }
            else if(txns[i].type === TransactionType.REMOVE_EXCHANGE_OFFER){

                let removeExchangeOfferTxn = txns[i] as RemoveExchangeOfferTransaction;

                for(let i = 0; i < removeExchangeOfferTxn.offers.length; ++i){
                    let tempExchangeOffer = removeExchangeOfferTxn.offers[i];

                    let assetId = tempExchangeOffer.mosaicId.toHex();

                    let newTxnExchangeOffer: TxnExchangeOffer = {
                        assetId: assetId,
                        type: tempExchangeOffer.offerType === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy", 
                    }; 

                    try {
                        let assetName = await DashboardService.getAssetName(assetId);

                        if(assetName.names.length){
                            newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
                        }

                    } catch (error) {
                        
                    }                    

                    txn.exchangeOffers.push(newTxnExchangeOffer);
                }
            }

            let allBuyOffers = txn.exchangeOffers.filter(x => x.type === "Buy");
            let allSellOffers = txn.exchangeOffers.filter(x => x.type === "Sell");

            txn.exchangeOffers = txn.isTakingOffer ? allSellOffers.concat(allBuyOffers) : allBuyOffers.concat(allSellOffers);
            
            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedExchangeTransaction(txns: Transaction[]): Promise<ConfirmedExchangeTransaction[]>{

        let formatedTxns : ConfirmedExchangeTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedExchangeTransaction, formattedTxn) as ConfirmedExchangeTransaction;

            if(txns[i].type === TransactionType.EXCHANGE_OFFER){
                txn.isTakingOffer = true;
                let exchangeOfferTxn = txns[i] as ExchangeOfferTransaction;

                for(let i = 0; i < exchangeOfferTxn.offers.length; ++i){
                    let tempExchangeOffer = exchangeOfferTxn.offers[i];

                    let assetId = tempExchangeOffer.mosaicId.toHex();
                    let amount = tempExchangeOffer.mosaicAmount.compact();

                    let newTxnExchangeOffer: TxnExchangeOffer = {
                        amount: amount,
                        amountIsRaw: true,
                        assetId: assetId,
                        cost: DashboardService.convertToExactNativeAmount(tempExchangeOffer.cost.compact()),
                        owner: tempExchangeOffer.owner.publicKey,
                        type: tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy", 
                    }; 

                    try {
                        let assetInfo = await DashboardService.getAssetInfo(assetId);

                        newTxnExchangeOffer.amountIsRaw = false;
                        newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(amount, assetInfo.divisibility);

                        let assetName = await DashboardService.getAssetName(assetId);

                        if(assetName.names.length){
                            newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
                        }

                    } catch (error) {
                        
                    }                    

                    txn.exchangeOffers.push(newTxnExchangeOffer);
                }
            }
            else if(txns[i].type === TransactionType.ADD_EXCHANGE_OFFER){

                let addExchangeOfferTxn = txns[i] as AddExchangeOfferTransaction;

                for(let i = 0; i < addExchangeOfferTxn.offers.length; ++i){
                    let tempExchangeOffer = addExchangeOfferTxn.offers[i];

                    let assetId = tempExchangeOffer.mosaicId.toHex();
                    let amount = tempExchangeOffer.mosaicAmount.compact();

                    let newTxnExchangeOffer: TxnExchangeOffer = {
                        amount: amount,
                        amountIsRaw: true,
                        assetId: assetId,
                        cost: DashboardService.convertToExactNativeAmount(tempExchangeOffer.cost.compact()),
                        duration: tempExchangeOffer.duration.compact(),
                        type: tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy", 
                    }; 

                    try {
                        let assetInfo = await DashboardService.getAssetInfo(assetId);

                        newTxnExchangeOffer.amountIsRaw = false;
                        newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(amount, assetInfo.divisibility);

                        let assetName = await DashboardService.getAssetName(assetId);

                        if(assetName.names.length){
                            newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
                        }

                    } catch (error) {
                        
                    }                    

                    txn.exchangeOffers.push(newTxnExchangeOffer);
                }
            }
            else if(txns[i].type === TransactionType.REMOVE_EXCHANGE_OFFER){

                let removeExchangeOfferTxn = txns[i] as RemoveExchangeOfferTransaction;

                for(let i = 0; i < removeExchangeOfferTxn.offers.length; ++i){
                    let tempExchangeOffer = removeExchangeOfferTxn.offers[i];

                    let assetId = tempExchangeOffer.mosaicId.toHex();

                    let newTxnExchangeOffer: TxnExchangeOffer = {
                        assetId: assetId,
                        type: tempExchangeOffer.offerType === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy", 
                    }; 

                    try {
                        let assetName = await DashboardService.getAssetName(assetId);

                        if(assetName.names.length){
                            newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
                        }

                    } catch (error) {
                        
                    }                    

                    txn.exchangeOffers.push(newTxnExchangeOffer);
                }
            }

            let allBuyOffers = txn.exchangeOffers.filter(x => x.type === "Buy");
            let allSellOffers = txn.exchangeOffers.filter(x => x.type === "Sell");

            txn.exchangeOffers = txn.isTakingOffer ? allSellOffers.concat(allBuyOffers) : allBuyOffers.concat(allSellOffers);

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatPartialExchangeTransaction(txns: Transaction[]): Promise<PartialExchangeTransaction[]>{

        let formatedTxns : PartialExchangeTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialExchangeTransaction, formattedTxn) as PartialExchangeTransaction;
            
            if(txns[i].type === TransactionType.EXCHANGE_OFFER){
                txn.isTakingOffer = true;
                let exchangeOfferTxn = txns[i] as ExchangeOfferTransaction;

                for(let i = 0; i < exchangeOfferTxn.offers.length; ++i){
                    let tempExchangeOffer = exchangeOfferTxn.offers[i];

                    let assetId = tempExchangeOffer.mosaicId.toHex();
                    let amount = tempExchangeOffer.mosaicAmount.compact();

                    let newTxnExchangeOffer: TxnExchangeOffer = {
                        amount: amount,
                        amountIsRaw: true,
                        assetId: assetId,
                        cost: DashboardService.convertToExactNativeAmount(tempExchangeOffer.cost.compact()),
                        owner: tempExchangeOffer.owner.publicKey,
                        type: tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy", 
                    }; 

                    try {
                        let assetInfo = await DashboardService.getAssetInfo(assetId);

                        newTxnExchangeOffer.amountIsRaw = false;
                        newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(amount, assetInfo.divisibility);

                        let assetName = await DashboardService.getAssetName(assetId);

                        if(assetName.names.length){
                            newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
                        }

                    } catch (error) {
                        
                    }                    

                    txn.exchangeOffers.push(newTxnExchangeOffer);
                }
            }
            else if(txns[i].type === TransactionType.ADD_EXCHANGE_OFFER){

                let addExchangeOfferTxn = txns[i] as AddExchangeOfferTransaction;

                for(let i = 0; i < addExchangeOfferTxn.offers.length; ++i){
                    let tempExchangeOffer = addExchangeOfferTxn.offers[i];

                    let assetId = tempExchangeOffer.mosaicId.toHex();
                    let amount = tempExchangeOffer.mosaicAmount.compact();

                    let newTxnExchangeOffer: TxnExchangeOffer = {
                        amount: amount,
                        amountIsRaw: true,
                        assetId: assetId,
                        cost: DashboardService.convertToExactNativeAmount(tempExchangeOffer.cost.compact()),
                        duration: tempExchangeOffer.duration.compact(),
                        type: tempExchangeOffer.type === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy", 
                    }; 

                    try {
                        let assetInfo = await DashboardService.getAssetInfo(assetId);

                        newTxnExchangeOffer.amountIsRaw = false;
                        newTxnExchangeOffer.amount = DashboardService.convertToExactAmount(amount, assetInfo.divisibility);

                        let assetName = await DashboardService.getAssetName(assetId);

                        if(assetName.names.length){
                            newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
                        }

                    } catch (error) {
                        
                    }                    

                    txn.exchangeOffers.push(newTxnExchangeOffer);
                }
            }
            else if(txns[i].type === TransactionType.REMOVE_EXCHANGE_OFFER){

                let removeExchangeOfferTxn = txns[i] as RemoveExchangeOfferTransaction;

                for(let i = 0; i < removeExchangeOfferTxn.offers.length; ++i){
                    let tempExchangeOffer = removeExchangeOfferTxn.offers[i];

                    let assetId = tempExchangeOffer.mosaicId.toHex();

                    let newTxnExchangeOffer: TxnExchangeOffer = {
                        assetId: assetId,
                        type: tempExchangeOffer.offerType === ExchangeOfferType.SELL_OFFER ? "Sell" : "Buy", 
                    }; 

                    try {
                        let assetName = await DashboardService.getAssetName(assetId);

                        if(assetName.names.length){
                            newTxnExchangeOffer.assetNamespace = assetName.names[0].name;
                        }

                    } catch (error) {
                        
                    }                    

                    txn.exchangeOffers.push(newTxnExchangeOffer);
                }
            }

            let allBuyOffers = txn.exchangeOffers.filter(x => x.type === "Buy");
            let allSellOffers = txn.exchangeOffers.filter(x => x.type === "Sell");

            txn.exchangeOffers = txn.isTakingOffer ? allSellOffers.concat(allBuyOffers) : allBuyOffers.concat(allSellOffers);

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    //-------------Link Txn-----------------------------------------------------------
    async formatUnconfirmedLinkTransaction(txns: Transaction[]): Promise<UnconfirmedLinkTransaction[]>{

        let formatedTxns : UnconfirmedLinkTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedLinkTransaction, formattedTxn) as UnconfirmedLinkTransaction;

            if(txns[i].type === TransactionType.LINK_ACCOUNT){

                let linkAccTxn = txns[i] as AccountLinkTransaction;

                txn.action = linkAccTxn.linkAction === LinkAction.Link ? "Link" : "Unlink";

                txn.remotePublicKey = linkAccTxn.remoteAccountKey;
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedLinkTransaction(txns: Transaction[]): Promise<ConfirmedLinkTransaction[]>{

        let formatedTxns : ConfirmedLinkTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedLinkTransaction, formattedTxn) as ConfirmedLinkTransaction;
            
            if(txns[i].type === TransactionType.LINK_ACCOUNT){

                let linkAccTxn = txns[i] as AccountLinkTransaction;

                txn.action = linkAccTxn.linkAction === LinkAction.Link ? "Link" : "Unlink";

                txn.remotePublicKey = linkAccTxn.remoteAccountKey;
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatPartialLinkTransaction(txns: Transaction[]): Promise<PartialLinkTransaction[]>{

        let formatedTxns : PartialLinkTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialLinkTransaction, formattedTxn) as PartialLinkTransaction;
            
            if(txns[i].type === TransactionType.LINK_ACCOUNT){

                let linkAccTxn = txns[i] as AccountLinkTransaction;

                txn.action = linkAccTxn.linkAction === LinkAction.Link ? "Link" : "Unlink";

                txn.remotePublicKey = linkAccTxn.remoteAccountKey;
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    //-------------Lock Txn-----------------------------------------------------------
    async formatUnconfirmedLockTransaction(txns: Transaction[]): Promise<UnconfirmedLockTransaction[]>{

        let formatedTxns : UnconfirmedLockTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedLockTransaction, formattedTxn) as UnconfirmedLockTransaction;

            let lockFundTxn = txns[i] as LockFundsTransaction;
            
            txn.lockHash = lockFundTxn.hash;
            txn.duration = lockFundTxn.duration.compact();

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedLockTransaction(txns: Transaction[]): Promise<ConfirmedLockTransaction[]>{

        let formatedTxns : ConfirmedLockTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedLockTransaction, formattedTxn) as ConfirmedLockTransaction;
            
            let lockFundTxn = txns[i] as LockFundsTransaction;

            txn.lockHash = lockFundTxn.hash;
            txn.duration = lockFundTxn.duration.compact();

            try {
                let txnStatus = await AppState.chainAPI.transactionAPI.getTransactionStatus(lockFundTxn.hash);
                txn.isRefunded = txnStatus.group === TransactionGroupType.CONFIRMED;
            } catch (error) {
                txn.isRefunded = false;
            }

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatPartialLockTransaction(txns: Transaction[]): Promise<PartialLockTransaction[]>{

        let formatedTxns : PartialLockTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialLockTransaction, formattedTxn) as PartialLockTransaction;
            
            let lockFundTxn = txns[i] as LockFundsTransaction;

            txn.lockHash = lockFundTxn.hash;
            txn.duration = lockFundTxn.duration.compact();

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    //-------------Namespace Txn-----------------------------------------------------------
    async formatUnconfirmedNamespaceTransaction(txns: Transaction[]): Promise<UnconfirmedNamespaceTransaction[]>{

        let formatedTxns : UnconfirmedNamespaceTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedNamespaceTransaction, formattedTxn) as UnconfirmedNamespaceTransaction;

            if(txns[i].type === TransactionType.REGISTER_NAMESPACE){
                let registerTxn = txns[i] as RegisterNamespaceTransaction;
                
                txn.namespaceName = registerTxn.namespaceName;

                if(registerTxn.namespaceType === NamespaceType.RootNamespace){
                    txn.duration = registerTxn.duration.compact();
                    txn.registerType = NamespaceType.RootNamespace;
                    txn.registerTypeName = "Root namespace";
                }
                else{
                    txn.registerType = NamespaceType.SubNamespace;
                    txn.registerTypeName = "Sub namespace";
                    txn.parentId = registerTxn.parentId.toHex();
                    let namespaceName = await DashboardService.getNamespacesName([registerTxn.parentId]);
                    txn.parentName = namespaceName[0].name;
                }

                txn.namespaceId = registerTxn.namespaceId.toHex();
            }
            
            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedNamespaceTransaction(txns: Transaction[]): Promise<ConfirmedNamespaceTransaction[]>{

        let formatedTxns : ConfirmedNamespaceTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedNamespaceTransaction, formattedTxn) as ConfirmedNamespaceTransaction;
            
            if(txns[i].type === TransactionType.REGISTER_NAMESPACE){
                let registerTxn = txns[i] as RegisterNamespaceTransaction;
                
                txn.namespaceName = registerTxn.namespaceName;

                if(registerTxn.namespaceType === NamespaceType.RootNamespace){
                    txn.duration = registerTxn.duration.compact();
                    txn.registerType = NamespaceType.RootNamespace;
                    txn.registerTypeName = "Root namespace";
                }
                else{
                    txn.registerType = NamespaceType.SubNamespace;
                    txn.registerTypeName = "Sub namespace";
                    txn.parentId = registerTxn.parentId.toHex();
                    let namespaceName = await DashboardService.getNamespacesName([registerTxn.parentId]);
                    txn.parentName = namespaceName[0].name;
                }

                txn.namespaceId = registerTxn.namespaceId.toHex();
            }
            
            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatPartialNamespaceTransaction(txns: Transaction[]): Promise<PartialNamespaceTransaction[]>{

        let formatedTxns : PartialNamespaceTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialNamespaceTransaction, formattedTxn) as PartialNamespaceTransaction;
            
            if(txns[i].type === TransactionType.REGISTER_NAMESPACE){
                let registerTxn = txns[i] as RegisterNamespaceTransaction;
                
                txn.namespaceName = registerTxn.namespaceName;

                if(registerTxn.namespaceType === NamespaceType.RootNamespace){
                    txn.duration = registerTxn.duration.compact();
                    txn.registerType = NamespaceType.RootNamespace;
                    txn.registerTypeName = "Root namespace";
                }
                else{
                    txn.registerType = NamespaceType.SubNamespace;
                    txn.registerTypeName = "Sub namespace";
                    txn.parentId = registerTxn.parentId.toHex();
                    let namespaceName = await DashboardService.getNamespacesName([registerTxn.parentId]);
                    txn.parentName = namespaceName[0].name;
                }

                txn.namespaceId = registerTxn.namespaceId.toHex();
            }
            
            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    //-------------Restriction Txn-----------------------------------------------------------
    async formatUnconfirmedRestrictionTransaction(txns: Transaction[]): Promise<UnconfirmedRestrictionTransaction[]>{

        let formatedTxns : UnconfirmedRestrictionTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedRestrictionTransaction, formattedTxn) as UnconfirmedRestrictionTransaction;

            if(txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS){

                let accAddressRestrictionTxn = txns[i] as AccountAddressRestrictionModificationTransaction;

                txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(accAddressRestrictionTxn.restrictionType).action;

                for(let i = 0; i < accAddressRestrictionTxn.modifications.length; ++i){
                    
                    let modification = accAddressRestrictionTxn.modifications[i];

                    let newRestrictionModification: RestrictionModification = {
                        action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
                        value: modification.value
                    };
                    txn.modification.push(newRestrictionModification);
                }
            }
            else if(txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC){

                let accAssetRestrictionTxn = txns[i] as AccountMosaicRestrictionModificationTransaction;

                txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(accAssetRestrictionTxn.restrictionType).action;

                for(let i = 0; i < accAssetRestrictionTxn.modifications.length; ++i){
                    
                    let modification = accAssetRestrictionTxn.modifications[i];

                    let newRestrictionModification: RestrictionModification = {
                        action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
                        value: new MosaicId(modification.value).toHex()
                    };

                    try {
                        let assetId = newRestrictionModification.value;
                        if(assetId === nativeTokenAssetId.value){
                            newRestrictionModification.name = nativeTokenName.value;
                        }
                        else{
                            let assetName = await DashboardService.getAssetName(assetId);

                            if(assetName.names.length){
                                newRestrictionModification.name = assetName.names[0].name;
                            }
                        }

                    } catch (error) {
                        
                    } 

                    txn.modification.push(newRestrictionModification);
                }
            }
            else if(txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION){

                let accOperationRestrictionTxn = txns[i] as AccountOperationRestrictionModificationTransaction;

                txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(accOperationRestrictionTxn.restrictionType).action;

                for(let i = 0; i < accOperationRestrictionTxn.modifications.length; ++i){
        
                    let modification = accOperationRestrictionTxn.modifications[i];

                    let newRestrictionModification: RestrictionModification = {
                        action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
                        value: TransactionUtils.getTransactionTypeNameByEnum(modification.value)
                    };

                    txn.modification.push(newRestrictionModification);
                }
            }

            let allAddModification = txn.modification.filter(x => x.action === "Add");
            let allRemoveModification = txn.modification.filter(x => x.action === "Remove");

            txn.modification = allAddModification.concat(allRemoveModification);

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedRestrictionTransaction(txns: Transaction[]): Promise<ConfirmedRestrictionTransaction[]>{

        let formatedTxns : ConfirmedRestrictionTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedRestrictionTransaction, formattedTxn) as ConfirmedRestrictionTransaction;
            
            if(txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS){

                let accAddressRestrictionTxn = txns[i] as AccountAddressRestrictionModificationTransaction;

                txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(accAddressRestrictionTxn.restrictionType).action;

                for(let i = 0; i < accAddressRestrictionTxn.modifications.length; ++i){
                    
                    let modification = accAddressRestrictionTxn.modifications[i];

                    let newRestrictionModification: RestrictionModification = {
                        action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
                        value: modification.value
                    };
                    txn.modification.push(newRestrictionModification);
                }
            }
            else if(txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC){

                let accAssetRestrictionTxn = txns[i] as AccountMosaicRestrictionModificationTransaction;

                txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(accAssetRestrictionTxn.restrictionType).action;

                for(let i = 0; i < accAssetRestrictionTxn.modifications.length; ++i){
                    
                    let modification = accAssetRestrictionTxn.modifications[i];

                    let newRestrictionModification: RestrictionModification = {
                        action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
                        value: new MosaicId(modification.value).toHex()
                    };

                    try {
                        let assetId = newRestrictionModification.value;
                        if(assetId === nativeTokenAssetId.value){
                            newRestrictionModification.name = nativeTokenName.value;
                        }
                        else{
                            let assetName = await DashboardService.getAssetName(assetId);

                            if(assetName.names.length){
                                newRestrictionModification.name = assetName.names[0].name;
                            }
                        }

                    } catch (error) {
                        
                    } 

                    txn.modification.push(newRestrictionModification);
                }
            }
            else if(txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION){

                let accOperationRestrictionTxn = txns[i] as AccountOperationRestrictionModificationTransaction;

                txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(accOperationRestrictionTxn.restrictionType).action;

                for(let i = 0; i < accOperationRestrictionTxn.modifications.length; ++i){
        
                    let modification = accOperationRestrictionTxn.modifications[i];

                    let newRestrictionModification: RestrictionModification = {
                        action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
                        value: TransactionUtils.getTransactionTypeNameByEnum(modification.value)
                    };

                    txn.modification.push(newRestrictionModification);
                }
            }

            let allAddModification = txn.modification.filter(x => x.action === "Add");
            let allRemoveModification = txn.modification.filter(x => x.action === "Remove");

            txn.modification = allAddModification.concat(allRemoveModification);

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatPartialRestrictionTransaction(txns: Transaction[]): Promise<PartialRestrictionTransaction[]>{

        let formatedTxns : PartialRestrictionTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialRestrictionTransaction, formattedTxn) as PartialRestrictionTransaction;
            
            if(txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS){

                let accAddressRestrictionTxn = txns[i] as AccountAddressRestrictionModificationTransaction;

                txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(accAddressRestrictionTxn.restrictionType).action;

                for(let i = 0; i < accAddressRestrictionTxn.modifications.length; ++i){
                    
                    let modification = accAddressRestrictionTxn.modifications[i];

                    let newRestrictionModification: RestrictionModification = {
                        action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
                        value: modification.value
                    };
                    txn.modification.push(newRestrictionModification);
                }
            }
            else if(txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC){

                let accAssetRestrictionTxn = txns[i] as AccountMosaicRestrictionModificationTransaction;

                txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(accAssetRestrictionTxn.restrictionType).action;

                for(let i = 0; i < accAssetRestrictionTxn.modifications.length; ++i){
                    
                    let modification = accAssetRestrictionTxn.modifications[i];

                    let newRestrictionModification: RestrictionModification = {
                        action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
                        value: new MosaicId(modification.value).toHex()
                    };

                    try {
                        let assetId = newRestrictionModification.value;

                        if(assetId === nativeTokenAssetId.value){
                            newRestrictionModification.name = nativeTokenName.value;
                        }
                        else{
                            let assetName = await DashboardService.getAssetName(assetId);

                            if(assetName.names.length){
                                newRestrictionModification.name = assetName.names[0].name;
                            }
                        }
                        
                    } catch (error) {
                        
                    } 

                    txn.modification.push(newRestrictionModification);
                }
            }
            else if(txns[i].type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION){

                let accOperationRestrictionTxn = txns[i] as AccountOperationRestrictionModificationTransaction;

                txn.restrictionTypeOutput = DashboardService.getRestrictionTypeName(accOperationRestrictionTxn.restrictionType).action;

                for(let i = 0; i < accOperationRestrictionTxn.modifications.length; ++i){
        
                    let modification = accOperationRestrictionTxn.modifications[i];

                    let newRestrictionModification: RestrictionModification = {
                        action: modification.modificationType === RestrictionModificationType.Add ? "Add" : "Remove",
                        value: TransactionUtils.getTransactionTypeNameByEnum(modification.value)
                    };

                    txn.modification.push(newRestrictionModification);
                }
            }

            let allAddModification = txn.modification.filter(x => x.action === "Add");
            let allRemoveModification = txn.modification.filter(x => x.action === "Remove");

            txn.modification = allAddModification.concat(allRemoveModification);

            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    //-------------Secret Txn-----------------------------------------------------------
    async formatUnconfirmedSecretTransaction(txns: Transaction[]): Promise<UnconfirmedSecretTransaction[]>{

        let formatedTxns : UnconfirmedSecretTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatUnconfirmedTransaction(txns[i]);
            let txn = UnconfirmedTransaction.convertToSubClass(UnconfirmedSecretTransaction, formattedTxn) as UnconfirmedSecretTransaction;

            if(txns[i].type === TransactionType.SECRET_LOCK){
                let secretLockTxn = txns[i] as SecretLockTransaction;
                txn.duration = secretLockTxn.duration.compact();
                txn.secret = secretLockTxn.secret;
                txn.recipient = secretLockTxn.recipient.plain();
                txn.amount = secretLockTxn.mosaic.amount.compact();
                txn.hashType = myHashType[secretLockTxn.hashType];

                let isNamespace = DashboardService.isNamespace(secretLockTxn.mosaic.id);

                try {
                    if(!isNamespace){
                        txn.assetId = secretLockTxn.mosaic.id.toHex();

                        let assetsNames = await DashboardService.getAssetsName([secretLockTxn.mosaic.id]);

                        if(assetsNames[0].names.length){
                            txn.namespaceName = assetsNames[0].names[0].name;
                        }
                    }
                    else{
                        let namespaceId = new NamespaceId(secretLockTxn.mosaic.id.toDTO().id);
                        let linkedAssetId = await DashboardService.getAssetAlias(namespaceId);

                        txn.assetId = linkedAssetId.toHex();
                        txn.isSendWithNamespace = true;

                        let nsNames = await DashboardService.getNamespacesName([namespaceId]);
                        txn.namespaceName = nsNames[0].name;
                    }

                    if(txn.namespaceName && txn.namespaceName === "prx.xpx"){
                        txn.namespaceName = nativeTokenName.value;
                    }

                    let assetInfo = await DashboardService.getAssetInfo(txn.assetId);

                    if(assetInfo.divisibility > 0){
                        txn.amount = DashboardService.convertToExactAmount(txn.amount, assetInfo.divisibility);
                    }
                    
                    txn.amountIsRaw = false;                    
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.SECRET_PROOF){
                let secretProofTxn = txns[i] as SecretProofTransaction;
                txn.secret = secretProofTxn.secret;
                txn.recipient = secretProofTxn.recipient.plain();
                txn.hashType = myHashType[secretProofTxn.hashType];
                txn.proof = secretProofTxn.proof;
            }
            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatConfirmedSecretTransaction(txns: Transaction[]): Promise<ConfirmedSecretTransaction[]>{

        let formatedTxns : ConfirmedSecretTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatConfirmedTransaction(txns[i]);
            let txn = ConfirmedTransaction.convertToSubClass(ConfirmedSecretTransaction, formattedTxn) as ConfirmedSecretTransaction;

            if(txns[i].type === TransactionType.SECRET_LOCK){
                let secretLockTxn = txns[i] as SecretLockTransaction;
                txn.duration = secretLockTxn.duration.compact();
                txn.secret = secretLockTxn.secret;
                txn.recipient = secretLockTxn.recipient.plain();
                txn.amount = secretLockTxn.mosaic.amount.compact();
                txn.hashType = myHashType[secretLockTxn.hashType];

                let isNamespace = DashboardService.isNamespace(secretLockTxn.mosaic.id);
                let resolvedAssetId = await DashboardService.getResolvedAsset(secretLockTxn.mosaic.id, txn.block); 

                txn.assetId = resolvedAssetId.toHex();

                try {
                    if(!isNamespace){
                        let assetsNames = await DashboardService.getAssetsName([secretLockTxn.mosaic.id]);

                        if(assetsNames[0].names.length){
                            txn.namespaceName = assetsNames[0].names[0].name;
                        }
                    }
                    else{
                        txn.isSendWithNamespace = true;
                        let namespaceId = new NamespaceId(secretLockTxn.mosaic.id.toDTO().id);

                        let nsNames = await DashboardService.getNamespacesName([namespaceId]);
                        txn.namespaceName = nsNames[0].name;
                    }

                    if(txn.namespaceName && txn.namespaceName === "prx.xpx"){
                        txn.namespaceName = nativeTokenName.value;
                    }

                    let assetInfo = await DashboardService.getAssetInfo(txn.assetId);

                    if(assetInfo.divisibility > 0){
                        txn.amount = DashboardService.convertToExactAmount(txn.amount, assetInfo.divisibility);
                    }
                    
                    txn.amountIsRaw = false;                    
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.SECRET_PROOF){
                let secretProofTxn = txns[i] as SecretProofTransaction;
                txn.secret = secretProofTxn.secret;
                txn.recipient = secretProofTxn.recipient.plain();
                txn.hashType = myHashType[secretProofTxn.hashType];
                txn.proof = secretProofTxn.proof;
            }
            formatedTxns.push(txn);
        }

        return formatedTxns;
    }

    async formatPartialSecretTransaction(txns: Transaction[]): Promise<PartialSecretTransaction[]>{

        let formatedTxns : PartialSecretTransaction[] = [];

        for(let i=0; i < txns.length; ++i){
            let formattedTxn = await this.formatPartialTransaction(txns[i]);
            let txn = PartialTransaction.convertToSubClass(PartialSecretTransaction, formattedTxn) as PartialSecretTransaction;

            if(txns[i].type === TransactionType.SECRET_LOCK){
                let secretLockTxn = txns[i] as SecretLockTransaction;
                txn.duration = secretLockTxn.duration.compact();
                txn.secret = secretLockTxn.secret;
                txn.recipient = secretLockTxn.recipient.plain();
                txn.amount = secretLockTxn.mosaic.amount.compact();
                txn.hashType = myHashType[secretLockTxn.hashType];

                let isNamespace = DashboardService.isNamespace(secretLockTxn.mosaic.id);

                try {
                    if(!isNamespace){
                        txn.assetId = secretLockTxn.mosaic.id.toHex();

                        let assetsNames = await DashboardService.getAssetsName([secretLockTxn.mosaic.id]);

                        if(assetsNames[0].names.length){
                            txn.namespaceName = assetsNames[0].names[0].name;
                        }
                    }
                    else{
                        let namespaceId = new NamespaceId(secretLockTxn.mosaic.id.toDTO().id);
                        let linkedAssetId = await DashboardService.getAssetAlias(namespaceId);

                        txn.assetId = linkedAssetId.toHex();
                        txn.isSendWithNamespace = true;

                        let nsNames = await DashboardService.getNamespacesName([namespaceId]);
                        txn.namespaceName = nsNames[0].name;
                    }

                    if(txn.namespaceName && txn.namespaceName === "prx.xpx"){
                        txn.namespaceName = nativeTokenName.value;
                    }

                    let assetInfo = await DashboardService.getAssetInfo(txn.assetId);

                    if(assetInfo.divisibility > 0){
                        txn.amount = DashboardService.convertToExactAmount(txn.amount, assetInfo.divisibility);
                    }
                    
                    txn.amountIsRaw = false;                    
                } catch (error) {
                    
                }
            }
            else if(txns[i].type === TransactionType.SECRET_PROOF){
                let secretProofTxn = txns[i] as SecretProofTransaction;
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
    async formatPartialTransaction(txn: Transaction): Promise<PartialTransaction>{

        let transactionInfo: TransactionInfo | AggregateTransactionInfo = txn.transactionInfo;
        let txnHash = transactionInfo instanceof AggregateTransactionInfo ? 
            transactionInfo.aggregateHash : transactionInfo.hash;

        let formattedTxn = new PartialTransaction(txnHash);
        formattedTxn.type = TransactionUtils.getTransactionTypeName(txn.type);
        formattedTxn.maxFee = transactionInfo instanceof AggregateTransactionInfo ? 
            null : DashboardService.convertToExactNativeAmount(txn.maxFee.compact());

        formattedTxn.signer = txn.signer.publicKey;
        formattedTxn.signerAddress = txn.signer.address.plain();

        let deadline = null;

        if(transactionInfo instanceof AggregateTransactionInfo){
            try {
                let aggregateTxn = await this.autoFindAggregateTransaction(txnHash);
                
                deadline = aggregateTxn.deadline.adjustedValue.compact();
            } catch (error) {
                    
            }   
        }
        else{
            deadline = txn.deadline.adjustedValue.compact();
        }
        formattedTxn.deadline = deadline;

        if(txn.type === TransactionType.AGGREGATE_BONDED || txn.type === TransactionType.AGGREGATE_COMPLETE){
            let aggregateTxn = txn as AggregateTransaction;

            for(let i = 0; i < aggregateTxn.cosignatures.length; ++i){
                formattedTxn.cosignedPublickKey.push(aggregateTxn.cosignatures[i].signer.publicKey);
            }
        }

        return formattedTxn;
    }

    async formatUnconfirmedTransaction(txn: Transaction): Promise<UnconfirmedTransaction>{

        let transactionInfo: TransactionInfo | AggregateTransactionInfo = txn.transactionInfo;
        let txnHash = transactionInfo instanceof AggregateTransactionInfo ? 
            transactionInfo.aggregateHash : transactionInfo.hash;

        let formattedTxn = new UnconfirmedTransaction(txnHash);
        formattedTxn.type = TransactionUtils.getTransactionTypeName(txn.type);
        formattedTxn.maxFee = transactionInfo instanceof AggregateTransactionInfo ? 
            null : DashboardService.convertToExactNativeAmount(txn.maxFee.compact());

        formattedTxn.signer = txn.signer.publicKey;
        formattedTxn.signerAddress = txn.signer.address.plain();

        let deadline = null;

        if(transactionInfo instanceof AggregateTransactionInfo){
            try {
                let aggregateTxn = await this.autoFindAggregateTransaction(txnHash);
                
                deadline = aggregateTxn.deadline.adjustedValue.compact();
            } catch (error) {

            }   
        }
        else{
            deadline = txn.deadline.adjustedValue.compact();
        }

        formattedTxn.deadline = deadline;

        return formattedTxn;
    }

    async formatConfirmedTransaction(txn: Transaction): Promise<ConfirmedTransaction>{

        let transactionInfo: TransactionInfo | AggregateTransactionInfo = txn.transactionInfo;
        let txnHash = transactionInfo instanceof AggregateTransactionInfo ? 
            transactionInfo.aggregateHash : transactionInfo.hash;

        let blockHeight: number = 0;
        let txnBytes: number = 0;
        let deadline = null;

        if(transactionInfo instanceof AggregateTransactionInfo){
            //let aggregateTxn = await this.autoFindAggregateTransaction(txnHash);
            blockHeight = transactionInfo.height.compact();
            //txnBytes = aggregateTxn.serialize().length / 2;
            //deadline = aggregateTxn.deadline.adjustedValue.compact();
        }
        else if(txn.type === TransactionType.AGGREGATE_BONDED || txn.type === TransactionType.AGGREGATE_COMPLETE){
            let aggregateTxn = await this.autoFindAggregateTransaction(txnHash);
            blockHeight = aggregateTxn.transactionInfo.height.compact();
            txnBytes = aggregateTxn.serialize().length / 2;
            deadline = aggregateTxn.deadline.adjustedValue.compact();
        }
        else{
            blockHeight = transactionInfo.height.compact();

            // wait SDK to fix
            try {
                txnBytes = txn.serialize().length / 2;
            } catch (error) {
                console.log(error);
            }
            
            deadline = txn.deadline.adjustedValue.compact();
        }

        let blockInfo = await AppState.chainAPI.blockAPI.getBlockByHeight(blockHeight);

        let fee = txnBytes * blockInfo.feeMultiplier;

        let formattedTxn: ConfirmedTransaction = new ConfirmedTransaction(txnHash);
        formattedTxn.block = blockHeight;
        formattedTxn.deadline = deadline;
        formattedTxn.type = TransactionUtils.getTransactionTypeName(txn.type);
        formattedTxn.maxFee = transactionInfo instanceof AggregateTransactionInfo ? 
            null : DashboardService.convertToExactNativeAmount(txn.maxFee.compact());

        formattedTxn.signer = txn.signer.publicKey;
        formattedTxn.signerAddress = txn.signer.address.plain();

        formattedTxn.fee = DashboardService.convertToExactNativeAmount(fee);

        if(transactionInfo instanceof AggregateTransactionInfo){
            formattedTxn.fee = null;
        }

        formattedTxn.timestamp = new Date(blockInfo.timestamp.compact() + Deadline.timestampNemesisBlock * 1000).toISOString()

        return formattedTxn;
    }

    searchAggregateTransaction(hash: string): AggregateTransaction | null{
        let txnFound = this.savedAggregateTxn.find(txn => txn.transactionInfo.hash === hash);

        if(txnFound){
            return txnFound;
        }

        return null;
    }

    async autoFindAggregateTransaction(hash: string): Promise<AggregateTransaction> | null{

        let foundTxn = this.searchAggregateTransaction(hash);

        if(foundTxn){
            return foundTxn;
        }

        let statusGroup = "";
        let txn: Transaction = null;

        while (txn === null && statusGroup !== "confirmed" && statusGroup !== "error"){

            try {
                let txnStatus = await AppState.chainAPI.transactionAPI.getTransactionStatus(hash);

                statusGroup = txnStatus.group;

                switch (statusGroup) {
                    case TransactionGroupType.CONFIRMED:
                        try {
                            txn = await AppState.chainAPI.transactionAPI.getTransaction(hash);
                        } catch (error) {
                            statusGroup = "error"
                        }
                        
                        break;

                    case TransactionGroupType.UNCONFIRMED:
                        try {
                            txn = await AppState.chainAPI.transactionAPI.getUnconfirmedTransaction(hash);
                        } catch (error) {
                            
                        }
                        break;
                    case TransactionGroupType.PARTIAL:
                        try {
                            txn = await AppState.chainAPI.transactionAPI.getPartialTransaction(hash);
                        } catch (error) {
                            
                        }
                        break;
                
                    default:
                        statusGroup = "error";
                        break;
                }
            } catch (error) {
                statusGroup = "error";
            }
        }

        if(statusGroup === "error" || txn === null){
            return null;
        }
        else{
            let aggregateTxn = txn as AggregateTransaction
            this.addAggregateTxns(aggregateTxn as AggregateTransaction);
            return aggregateTxn;
        }
    }
    
    addAggregateTxns(txn: AggregateTransaction): boolean{

        let txnFound = this.savedAggregateTxn.find(txn => txn.transactionInfo.hash === txn.transactionInfo.hash);

        if(txnFound){
            return false;
        }
        else{
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
    static applyValueChange(oldValue: string,  valueChange: string, sizeDelta: number): string{

        let newSize = (Convert.utf8ToHex(oldValue).length /2) + sizeDelta;
        let oldValueBytes = Convert.hexToUint8(Convert.utf8ToHex(oldValue));
        let valueChangeBytes = Convert.hexToUint8(valueChange);

        let valueUint8Array = new Uint8Array(newSize);

        for(let i = 0; i < valueUint8Array.length; ++i){
            valueUint8Array[i] = oldValueBytes[i] ^ valueChangeBytes[i];
        }

        return Convert.decodeHexToUtf8(Convert.uint8ToHex(valueUint8Array));
    }

    static async getAssetInfo(assetId: string): Promise<MosaicInfo>{
        let mosaicId = new MosaicId(assetId);
        let assetInfo = await AppState.chainAPI.assetAPI.getMosaic(mosaicId);
 
        return assetInfo;
     }

     static async getAssetName(assetId: string): Promise<MosaicNames>{
        let mosaicId = new MosaicId(assetId);
        let assetNames = await AppState.chainAPI.assetAPI.getMosaicsNames([mosaicId]);
 
        return assetNames[0];
     }

    static async getAssetsName(mosaicIds: MosaicId[]): Promise<MosaicNames[]>{
        let assetNames = await AppState.chainAPI.assetAPI.getMosaicsNames(mosaicIds);
 
        return assetNames;
     }

    static async getNamespacesName(namespaceIds: NamespaceId[]): Promise<NamespaceName[]>{
        let namespacesName = await AppState.chainAPI.namespaceAPI.getNamespacesName(namespaceIds);
 
        return namespacesName;
    }

    static async getAddressAlias(namespaceId: NamespaceId): Promise<Address>{
       let address = await AppState.chainAPI.namespaceAPI.getLinkedAddress(namespaceId);

       return address;
    }

    static async getAssetAlias(namespaceId: NamespaceId): Promise<MosaicId>{

        let assetId = await AppState.chainAPI.namespaceAPI.getLinkedMosaicId(namespaceId);

       return assetId;
    }

    static async getAssetMetadata(assetId: MosaicId, scopedMetadataKey: UInt64): Promise<MetadataEntry>{
        let metadataQP = new MetadataQueryParams();
        metadataQP.metadataType = MetadataType.MOSAIC;
        metadataQP.scopedMetadataKey = scopedMetadataKey;
        metadataQP.targetId = assetId;

        let metadataResult = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQP);

        return metadataResult.metadataEntries.length ? metadataResult.metadataEntries[0] : null;
    }

    static async getNamespaceMetadata(nsId: NamespaceId, scopedMetadataKey: UInt64): Promise<MetadataEntry>{
        let metadataQP = new MetadataQueryParams();
        metadataQP.metadataType = MetadataType.NAMESPACE;
        metadataQP.scopedMetadataKey = scopedMetadataKey;
        metadataQP.targetId = nsId;

        let metadataResult = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQP);

        return metadataResult.metadataEntries.length ? metadataResult.metadataEntries[0] : null;
    }

    static async getAccountMetadata(targetKey: PublicAccount, scopedMetadataKey: UInt64): Promise<MetadataEntry>{
        let metadataQP = new MetadataQueryParams();
        metadataQP.metadataType = MetadataType.ACCOUNT;
        metadataQP.scopedMetadataKey = scopedMetadataKey;
        metadataQP.targetKey = targetKey;

        let metadataResult = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQP);

        return metadataResult.metadataEntries.length ? metadataResult.metadataEntries[0] : null;
    }

    static async getRecipient(transferTxn: TransferTransaction, blockHeight: number): Promise<Address>{

        let recipient: Address = null;

        if(transferTxn.recipient instanceof NamespaceId){

            let receipts = await AppState.chainAPI.blockAPI.getBlockReceipts(blockHeight);

            for(let i=0; i < receipts.addressResolutionStatements.length; ++i){
                let unresolved = receipts.addressResolutionStatements[i].unresolved;
                let resolved = receipts.addressResolutionStatements[i].resolutionEntries[0].resolved;
                if(unresolved instanceof MosaicId){ // actually is namespaceId
                    let namespaceIdHex: string = unresolved.toHex();

                    if(transferTxn.recipient.toHex() !== namespaceIdHex){
                        continue;
                    }

                    if(resolved instanceof AddressAlias){
                        recipient = resolved.address;
                        break;
                    }
                    else{
                        continue;
                    }
                }
                else{
                    continue;
                }
            }
        }
        else{
            recipient = transferTxn.recipient;
        }

        return recipient;
    }

    static isNamespace(mosaicId: MosaicId): boolean{
        return Array.from(namespaceIdFirstCharacterString).includes(mosaicId.toHex().toUpperCase().substring(0, 1));
    }

    static async getResolvedAsset(mosaicId: MosaicId, blockHeight: number): Promise<MosaicId>{

        let resolvedAsset: MosaicId = null;

        if(DashboardService.isNamespace(mosaicId)){

            let receipts = await AppState.chainAPI.blockAPI.getBlockReceipts(blockHeight);

            for(let i=0; i < receipts.mosaicResolutionStatements.length; ++i){
                let unresolved = receipts.mosaicResolutionStatements[i].unresolved;
                let resolved = receipts.mosaicResolutionStatements[i].resolutionEntries[0].resolved;
                if(unresolved instanceof MosaicId){ // actually is namespaceId
                    let namespaceIdHex: string = unresolved.toHex();

                    if(mosaicId.toHex() !== namespaceIdHex){
                        continue;
                    }

                    if(resolved instanceof MosaicAlias){
                        resolvedAsset = resolved.mosaicId;
                        break;
                    }
                    else{
                        continue;
                    }
                }
                else{
                    continue;
                }
            }
        }
        else{
            resolvedAsset = mosaicId;
        }

        return resolvedAsset;
    }

    static getRestrictionTypeName(restrictionType: RestrictionType){

        let restrictionTypeName = {
            action: '',
            type: ''
        };

        switch(restrictionType){
            case RestrictionType.AllowAddress:
                restrictionTypeName.action = "Allow";
                restrictionTypeName.type = "Address"
                break;
            case RestrictionType.BlockAddress:
                restrictionTypeName.action = "Block";
                restrictionTypeName.type = "Address"
                break;
            case RestrictionType.AllowMosaic:
                restrictionTypeName.action = "Allow";
                restrictionTypeName.type = "SDA"
                break;
            case RestrictionType.BlockMosaic:
                restrictionTypeName.action = "Block";
                restrictionTypeName.type = "SDA"
                break;
            case RestrictionType.AllowTransaction:
                restrictionTypeName.action = "Allow";
                restrictionTypeName.type = "Transaction Type"
                break;
            case RestrictionType.BlockTransaction:
                restrictionTypeName.action = "Block";
                restrictionTypeName.type = "Transaction Type"
                break;
            default:
                break;
        }

        return restrictionTypeName;
    }

    async getAllAccountTransactions(): Promise<Transaction[]>{

        let transactions: Transaction[] = [];

        for(let i = 0; i < this.wallet.accounts.length; ++i){
            let accountTransactions = await DashboardService.getAccountAllTransactions(this.wallet.accounts[i]);
            transactions = transactions.concat(accountTransactions);
        }

        for(let i = 0; i < this.wallet.others.length; ++i){
            let accountTransactions = await DashboardService.getAccountAllTransactions(this.wallet.others[i]);
            transactions = transactions.concat(accountTransactions);
        }

        return transactions.filter((transaction, index, array) =>
            index === array.findIndex(foundTx => foundTx.transactionInfo.id === transaction.transactionInfo.id));
    }

    async getAllAccountUnconfirmedTransactions(): Promise<Transaction[]>{

        let transactions: Transaction[] = [];

        for(let i = 0; i < this.wallet.accounts.length; ++i){
            let accountTransactions = await DashboardService.getAccountAllUnconfirmedTransactions(this.wallet.accounts[i]);
            transactions = transactions.concat(accountTransactions);
        }

        for(let i = 0; i < this.wallet.others.length; ++i){
            let accountTransactions = await DashboardService.getAccountAllUnconfirmedTransactions(this.wallet.others[i]);
            transactions = transactions.concat(accountTransactions);
        }

        return transactions.filter((transaction, index, array) =>
            index === array.findIndex(foundTx => foundTx.transactionInfo.id === transaction.transactionInfo.id));
    }

    async getAllAccountPartialTransactions(): Promise<Transaction[]>{

        let transactions: Transaction[] = [];

        for(let i = 0; i < this.wallet.accounts.length; ++i){
            let accountTransactions = await DashboardService.getAccountAllPartialTransactions(this.wallet.accounts[i]);
            transactions = transactions.concat(accountTransactions);
        }

        for(let i = 0; i < this.wallet.others.length; ++i){
            let accountTransactions = await DashboardService.getAccountAllPartialTransactions(this.wallet.others[i]);
            transactions = transactions.concat(accountTransactions);
        }

        return transactions.filter((transaction, index, array) =>
            index === array.findIndex(foundTx => foundTx.transactionInfo.id === transaction.transactionInfo.id));
    }

    static async getAccountAllTransactions(account: myAccount): Promise<Transaction[]>{
        let pageNum = 1;
        let publicAccount = Helper.createPublicAccount(account.publicKey, localNetworkType.value);

        let fullTransaction: Transaction[] = [];
        let queryParams = new TransactionQueryParams()
        queryParams.pageSize = 100;
        queryParams.pageNumber = pageNum;

        let transactions: Transaction[] = await TransactionUtils.getTransactions(publicAccount, queryParams);
        
        fullTransaction = fullTransaction.concat(transactions);

        while (transactions.length === 100) {
            pageNum += 1;
            queryParams.pageNumber = pageNum;
            let lastId = transactions[transactions.length - 1].transactionInfo.id;
            // queryParams = Helper.createQueryParams(100, lastId);
            transactions = await TransactionUtils.getTransactions(publicAccount, queryParams);
            fullTransaction = fullTransaction.concat(transactions);
        }

        return fullTransaction;
    }

    static async getAccountAllUnconfirmedTransactions(account: myAccount): Promise<Transaction[]>{
        let pageNum = 1;
        let publicAccount = Helper.createPublicAccount(account.publicKey, localNetworkType.value);

        let fullTransaction: Transaction[] = [];
        let queryParams = new TransactionQueryParams()
        queryParams.pageSize = 100;
        queryParams.pageNumber = pageNum;

        let transactions: Transaction[] = await TransactionUtils.getUnconfirmedTransactions(publicAccount, queryParams);
        
        fullTransaction = fullTransaction.concat(transactions);

        while (transactions.length === 100) {
            pageNum += 1;
            queryParams.pageNumber = pageNum;
            let lastId = transactions[transactions.length - 1].transactionInfo.id;
            // queryParams = Helper.createQueryParams(100, lastId);
            transactions = await TransactionUtils.getUnconfirmedTransactions(publicAccount, queryParams);
            fullTransaction = fullTransaction.concat(transactions);
        }

        return fullTransaction;
    }

    static async getAccountAllPartialTransactions(account: myAccount): Promise<Transaction[]>{
        let pageNum = 1;
        let publicAccount = Helper.createPublicAccount(account.publicKey, localNetworkType.value);

        let fullTransaction: Transaction[] = [];
        let queryParams = new TransactionQueryParams()
        queryParams.pageSize = 100;
        queryParams.pageNumber = pageNum;

        let transactions: Transaction[] = await TransactionUtils.getPartialTransactions(publicAccount, queryParams);

        if(transactions){
            fullTransaction = fullTransaction.concat(transactions);

            while (transactions && transactions.length === 100) {
                pageNum += 1;
                queryParams.pageNumber = pageNum;
                let lastId = transactions[transactions.length - 1].transactionInfo.id;
                // queryParams = Helper.createQueryParams(100, lastId);
                transactions = await TransactionUtils.getPartialTransactions(publicAccount, queryParams);
                
                if(transactions){
                    fullTransaction = fullTransaction.concat(transactions);
                }
            }
        }
        
        return fullTransaction;
    }

    async getAccountTransactionsCount(account: myAccount){

        let transactionsCount = {
            confirmed: 0,
            unconfirmed: 0,
            partial: 0
        };

        let txnQueryParams = new TransactionQueryParams();
        txnQueryParams.address = account.address;

        let searchConfirmedTxnResult = await TransactionUtils.searchTransactions(TransactionGroupType.CONFIRMED, txnQueryParams);
        let searchUnconfirmedTxnResult = await TransactionUtils.searchTransactions(TransactionGroupType.UNCONFIRMED, txnQueryParams);
        let searchPartialTxnResult = await TransactionUtils.searchTransactions(TransactionGroupType.PARTIAL, txnQueryParams);

        transactionsCount.confirmed = searchConfirmedTxnResult.pagination.totalEntries;
        transactionsCount.unconfirmed = searchUnconfirmedTxnResult.pagination.totalEntries;
        transactionsCount.partial = searchPartialTxnResult.pagination.totalEntries;

        return transactionsCount;
    }

    convertToSwapType(txnMessage: string){
        let newType = null;
        
        try {
            if(txnMessage){
               let messageData = JSON.parse(txnMessage);

               if(messageData.type){
                    switch (messageData.type) {
                        case 'Swap':
                            newType = 'Swap (nis1-XPX)';
                            break;
                        case 'Swap-bsc-xpx':
                            newType = 'Swap (BSC-XPX)';
                            break;
                        case 'Swap-xpx-bsc':
                            newType = 'Swap (XPX-BSC)';
                            break;
                        case 'Swap-xpx-bsc-fees':
                            newType = 'Swap Fee (XPX-BSC)';
                            break;
                        default:
                            break;
                    }
               }
            }
        } catch (error) {

        }    

        return newType;
    }

    // async fetchConfirmedTransactions(){

    //     let transactions = await this.getAllAccountTransactions();
    //     let dashboardTransactions: DashboardTransaction[] = this.formatConfirmedTransaction(transactions);
    //     return dashboardTransactions;
    // }

    // async fetchUnconfirmedTransactions(){

    //     let transactions = await this.getAllAccountUnconfirmedTransactions();

    //     let dashboardTransactions: DashboardTransaction[] = this.formatUnconfirmedTransaction(transactions);
    //     return dashboardTransactions;
    // }

    // async fetchPartialTransactions(){

    //     let transactions = await this.getAllAccountPartialTransactions();

    //     let dashboardTransactions: DashboardTransaction[] = this.formatUnconfirmedTransaction(transactions);
    //     return { txns: transactions, formatted: dashboardTransactions};
    // }

    // formatConfirmedWithTransaction(txs: Transaction[]){
    //     let dashboardTransactions: DashboardTransaction[] = this.formatConfirmedTransaction(txs);
    //     return dashboardTransactions;
    // }

    // formatUnconfirmedWithTransaction(txs: Transaction[]){
    //     let dashboardTransactions: DashboardTransaction[] = this.formatUnconfirmedTransaction(txs);
    //     return dashboardTransactions;
    // }

    // formatConfirmedTransaction(transactions: Transaction[]): DashboardTransaction[] {
    //     let formattedTransactions: DashboardTransaction[] = [];

    //     for (let i = 0; i < transactions.length; ++i) {

    //         let dashboardTransaction: DashboardTransaction = {
    //             id: transactions[i].transactionInfo.id,
    //             typeName: TransactionUtils.getTransactionTypeName(transactions[i].type),
    //             signer: transactions[i].signer.publicKey,
    //             size: transactions[i].size,
    //             signerAddress: transactions[i].signer.address.plain(),
    //             signerAddressPretty: transactions[i].signer.address.pretty(),
    //             signerDisplay: this.addressConvertToName(transactions[i].signer.address.plain()),
    //             hash: transactions[i].transactionInfo.hash,
    //             block: transactions[i].transactionInfo.height.compact(),
    //             formattedDeadline: Helper.convertDisplayDateTimeFormat24(transactions[i].deadline.value.toString()),
    //             relatedAddress: [],
    //             relatedAsset: [],
    //             relatedNamespace: [],
    //             relatedPublicKey: [],
    //             searchString: [],
    //             extractedData: {},
    //             displayList: new Map<string, string>(),
    //             transferList: [],
    //             displayTips: [],
    //             cosignatures: null,
    //             signedPublicKeys: [transactions[i].signer.publicKey],
    //             maxFee: Helper.convertToExact(transactions[i].maxFee.compact(), 6),
    //             otherAssets: [],
    //         };
    //         dashboardTransaction.searchString.push(dashboardTransaction.block.toString());
    //         dashboardTransaction.searchString.push(dashboardTransaction.hash);

    //         // dashboardTransaction.relatedAddress.push(transactions[i].signer.address.plain());
    //         // dashboardTransaction.relatedPublicKey.push(dashboardTransaction.signer);

    //         let tempData: DashboardInnerTransaction;
    //         let totalLength: number = 1;

    //         switch (transactions[i].type) {
    //             case TransactionType.ADDRESS_ALIAS:
    //                 let addressAliasTx = transactions[i] as AddressAliasTransaction;
    //                 tempData = this.extractTransactionAddressAlias(addressAliasTx);
    //                 break;
    //             case TransactionType.ADD_EXCHANGE_OFFER:
    //                 let addExchangeOfferTx = transactions[i] as AddExchangeOfferTransaction;
    //                 tempData = this.extractTransactionAddExchangeOffer(addExchangeOfferTx);
    //                 break;
    //             case TransactionType.AGGREGATE_BONDED:
    //                 let aggregateBondedTx = transactions[i] as AggregateTransaction;
    //                 if(aggregateBondedTx.cosignatures.length){
    //                     dashboardTransaction.cosignatures = { 
    //                         cosigners: aggregateBondedTx.cosignatures.map(
    //                             (x)=> { return { publicKey: x.signer.publicKey, address: x.signer.address.plain()}}
    //                         )
    //                     };
    //                     dashboardTransaction.signedPublicKeys = dashboardTransaction.signedPublicKeys.concat(dashboardTransaction.cosignatures.cosigners.map(x => x.publicKey));
    //                 }   
    //                 totalLength = aggregateBondedTx.innerTransactions.length;
    //                 dashboardTransaction.innerTransactions = [];
    //                 tempData = {
    //                     signer: aggregateBondedTx.signer.publicKey,
    //                     relatedAsset: [],
    //                     relatedNamespace: [],
    //                     relatedPublicKey: [],
    //                     signerAddress: aggregateBondedTx.signer.address.plain(),
    //                     relatedAddress: [],
    //                     typeName: TransactionUtils.getTransactionTypeName(aggregateBondedTx.type),
    //                     searchString: [],
    //                     extractedData: {},
    //                     displayList: new Map<string, string>(),
    //                     transferList: [],
    //                     displayTips: [],
    //                     signerPublicKeys: [aggregateBondedTx.signer.publicKey]
    //                 };

    //                 for (let y = 0; y < totalLength; ++y) {
    //                     let tempInnerData = this.extractInnerTransaction(aggregateBondedTx.innerTransactions[y]);

    //                     tempData.relatedAddress = tempData.relatedAddress.concat(tempInnerData.relatedAddress);
    //                     tempData.relatedAsset = tempData.relatedAsset.concat(tempInnerData.relatedAsset);
    //                     tempData.relatedNamespace = tempData.relatedNamespace.concat(tempInnerData.relatedNamespace);
    //                     tempData.relatedPublicKey = tempData.relatedPublicKey.concat(tempInnerData.relatedPublicKey);
    //                     tempData.searchString = tempData.searchString.concat(tempInnerData.searchString);

    //                     dashboardTransaction.innerTransactions.push(tempInnerData);
    //                 }
    //                 break;
    //             case TransactionType.AGGREGATE_COMPLETE:
    //                 let aggregateCompleteTx = transactions[i] as AggregateTransaction;
    //                 if(aggregateCompleteTx.cosignatures.length){
    //                     dashboardTransaction.cosignatures = { 
    //                         cosigners: aggregateCompleteTx.cosignatures.map(
    //                             (x)=> { return { publicKey: x.signer.publicKey, address: x.signer.address.plain()}}
    //                         )
    //                     };
    //                     dashboardTransaction.signedPublicKeys = dashboardTransaction.signedPublicKeys.concat(dashboardTransaction.cosignatures.cosigners.map(x => x.publicKey));
    //                 }     
    //                 totalLength = aggregateCompleteTx.innerTransactions.length;
    //                 dashboardTransaction.innerTransactions = [];

    //                 tempData = {
    //                     signer: aggregateCompleteTx.signer.publicKey,
    //                     relatedAsset: [],
    //                     relatedNamespace: [],
    //                     relatedPublicKey: [],
    //                     signerAddress: aggregateCompleteTx.signer.address.plain(),
    //                     relatedAddress: [],
    //                     typeName: TransactionUtils.getTransactionTypeName(aggregateCompleteTx.type),
    //                     searchString: [],
    //                     extractedData: {},
    //                     displayList: new Map<string, string>(),
    //                     displayTips: [],
    //                     signerPublicKeys: [aggregateCompleteTx.signer.publicKey]
    //                 };

    //                 for (let x = 0; x < totalLength; ++x) {
    //                     let tempInnerData = this.extractInnerTransaction(aggregateCompleteTx.innerTransactions[x]);

    //                     tempData.relatedAddress = tempData.relatedAddress.concat(tempInnerData.relatedAddress);
    //                     tempData.relatedAsset = tempData.relatedAsset.concat(tempInnerData.relatedAsset);
    //                     tempData.relatedNamespace = tempData.relatedNamespace.concat(tempInnerData.relatedNamespace);
    //                     tempData.relatedPublicKey = tempData.relatedPublicKey.concat(tempInnerData.relatedPublicKey);
    //                     tempData.searchString = tempData.searchString.concat(tempInnerData.searchString);

    //                     dashboardTransaction.innerTransactions.push(tempInnerData);
    //                 }
    //                 break;
    //             case TransactionType.CHAIN_CONFIGURE:
    //                 let chainConfigureTx = transactions[i] as ChainConfigTransaction;
    //                 tempData = this.extractTransactionChainConfig(chainConfigureTx);
    //                 break;
    //             case TransactionType.CHAIN_UPGRADE:
    //                 let chainUpgradeTx = transactions[i] as ChainUpgradeTransaction;
    //                 tempData = this.extractTransactionChainUpgrade(chainUpgradeTx);
    //                 break;
    //             case TransactionType.EXCHANGE_OFFER:
    //                 let exchangeOfferTx = transactions[i] as ExchangeOfferTransaction;
    //                 tempData = this.extractTransactionExchangeOffer(exchangeOfferTx);
    //                 break;
    //             case TransactionType.REMOVE_EXCHANGE_OFFER:
    //                 let removeExchangeOfferTx = transactions[i] as RemoveExchangeOfferTransaction;
    //                 tempData = this.extractTransactionRemoveExchangeOffer(removeExchangeOfferTx);
    //                 break;
    //             case TransactionType.LINK_ACCOUNT:
    //                 let accountLinkTx = transactions[i] as AccountLinkTransaction;
    //                 tempData = this.extractTransactionAccountLink(accountLinkTx);
    //                 break;
    //             case TransactionType.LOCK:
    //                 let lockFundTx = transactions[i] as LockFundsTransaction;
    //                 tempData = this.extractTransactionLockFunds(lockFundTx);
    //                 break;
    //             // case TransactionType.MODIFY_ACCOUNT_METADATA:
    //             //     let modifyAccountMetadataTx = transactions[i] as ModifyMetadataTransaction;
    //             //     tempData = this.extractTransactionModifyAccountMetadata(modifyAccountMetadataTx);
    //             //     break;
    //             // case TransactionType.MODIFY_MOSAIC_METADATA:
    //             //     let modifyMosaicMetadataTx = transactions[i] as ModifyMetadataTransaction;
    //             //     tempData = this.extractTransactionModifyMosaicMetadata(modifyMosaicMetadataTx);
    //             //     break;
    //             // case TransactionType.MODIFY_NAMESPACE_METADATA:
    //             //     let modifyNamespaceMetadataTx = transactions[i] as ModifyMetadataTransaction;
    //             //     tempData = this.extractTransactionModifyNamespaceMetadata(modifyNamespaceMetadataTx);
    //             //     break;
    //             case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
    //                 let accAddressModifyTx = transactions[i] as AccountAddressRestrictionModificationTransaction;
    //                 tempData = this.extractTransactionAccountAddressRestriction(accAddressModifyTx);
    //                 break;
    //             case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
    //                 let accMosaicModifyTx = transactions[i] as AccountMosaicRestrictionModificationTransaction;
    //                 tempData = this.extractTransactionAccountMosaicRestriction(accMosaicModifyTx);
    //                 break;
    //             case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
    //                 let accOperationModifyTx = transactions[i] as AccountOperationRestrictionModificationTransaction;
    //                 tempData = this.extractTransactionAccountOperationRestriction(accOperationModifyTx);
    //                 break;
    //             case TransactionType.MODIFY_MULTISIG_ACCOUNT:
    //                 let modifyMultisigAccountTx = transactions[i] as ModifyMultisigAccountTransaction;
    //                 tempData = this.extractTransactionModifyMultisigAccount(modifyMultisigAccountTx);
    //                 break;
    //             case TransactionType.MOSAIC_ALIAS:
    //                 let mosaicAliasTx = transactions[i] as MosaicAliasTransaction;
    //                 tempData = this.extractTransactionMosaicAlias(mosaicAliasTx);
    //                 break;
    //             case TransactionType.MOSAIC_DEFINITION:
    //                 let mosaicDefinitionTx = transactions[i] as MosaicDefinitionTransaction;
    //                 tempData = this.extractTransactionMosaicDefinition(mosaicDefinitionTx);
    //                 break;
    //             case TransactionType.MOSAIC_SUPPLY_CHANGE:
    //                 let mosaicSupplyTx = transactions[i] as MosaicSupplyChangeTransaction;
    //                 tempData = this.extractTransactionMosaicSupplyChange(mosaicSupplyTx);
    //                 break;
    //             case TransactionType.REGISTER_NAMESPACE:
    //                 let registerNamespaceTx = transactions[i] as RegisterNamespaceTransaction;
    //                 tempData = this.extractTransactionRegisterNamespace(registerNamespaceTx);
    //                 break;
    //             case TransactionType.SECRET_LOCK:
    //                 let secretLockTx = transactions[i] as SecretLockTransaction;
    //                 tempData = this.extractTransactionSecretLock(secretLockTx);
    //                 break;
    //             case TransactionType.SECRET_PROOF:
    //                 let secretProofTx = transactions[i] as SecretProofTransaction;
    //                 tempData = this.extractTransactionSecretProof(secretProofTx);
    //                 break;
    //             case TransactionType.TRANSFER:
    //                 let transferTx = transactions[i] as TransferTransaction;
    //                 tempData = this.extractTransactionTransfer(transferTx);
    //                 break;
    //             default:
    //                 break;
    //         }

    //         dashboardTransaction.relatedAddress = dashboardTransaction.relatedAddress.concat(tempData.relatedAddress);
    //         dashboardTransaction.relatedAsset = dashboardTransaction.relatedAsset.concat(tempData.relatedAsset);
    //         dashboardTransaction.relatedNamespace = dashboardTransaction.relatedNamespace.concat(tempData.relatedNamespace);
    //         dashboardTransaction.relatedPublicKey = dashboardTransaction.relatedPublicKey.concat(tempData.relatedPublicKey);
    //         dashboardTransaction.searchString = dashboardTransaction.searchString.concat(tempData.searchString);
    //         dashboardTransaction.extractedData = tempData.extractedData;
    //         dashboardTransaction.displayList = tempData.displayList;
    //         dashboardTransaction.transferList = tempData.transferList ? tempData.transferList: [];
    //         dashboardTransaction.displayTips = tempData.displayTips;
    //         dashboardTransaction.otherAssets = tempData.otherAssets;

    //         dashboardTransaction.relatedAddress = Array.from(new Set(dashboardTransaction.relatedAddress));
    //         dashboardTransaction.relatedAsset = Array.from(new Set(dashboardTransaction.relatedAsset));
    //         dashboardTransaction.relatedNamespace = Array.from(new Set(dashboardTransaction.relatedNamespace));
    //         dashboardTransaction.relatedPublicKey = Array.from(new Set(dashboardTransaction.relatedPublicKey));
    //         dashboardTransaction.searchString = Array.from(new Set(dashboardTransaction.searchString));

    //         formattedTransactions.push(dashboardTransaction);
    //     }

    //     return formattedTransactions;
    // }

    // formatUnconfirmedTransaction(transactions: Transaction[]): DashboardTransaction[] {
    //     let formattedTransactions: DashboardTransaction[] = [];

    //     for (let i = 0; i < transactions.length; ++i) {
    //         let dashboardTransaction: DashboardTransaction = {
    //             id: transactions[i].transactionInfo.id,
    //             typeName: TransactionUtils.getTransactionTypeName(transactions[i].type),
    //             signer: transactions[i].signer.publicKey,
    //             size: transactions[i].size,
    //             signerAddress: transactions[i].signer.address.plain(),
    //             signerAddressPretty: transactions[i].signer.address.pretty(),
    //             signerDisplay: this.addressConvertToName(transactions[i].signer.address.plain()),
    //             hash: transactions[i].transactionInfo.hash,
    //             formattedDeadline: Helper.convertDisplayDateTimeFormat(transactions[i].deadline.value.toString()),
    //             relatedAddress: [],
    //             relatedAsset: [],
    //             relatedNamespace: [],
    //             relatedPublicKey: [],
    //             searchString: [],
    //             extractedData: {},
    //             displayList: new Map<string, string>(),
    //             transferList: [],
    //             displayTips: [],
    //             cosignatures: null,
    //             signedPublicKeys: [transactions[i].signer.publicKey],
    //             otherAssets: []
    //         };

    //         dashboardTransaction.searchString.push(dashboardTransaction.hash);

    //         // dashboardTransaction.relatedAddress.push(transactions[i].signer.address.plain());
    //         // dashboardTransaction.relatedPublicKey.push(dashboardTransaction.signer);

    //         let tempData: DashboardInnerTransaction;
    //         let totalLength: number = 1;

    //         switch (transactions[i].type) {
    //             case TransactionType.ADDRESS_ALIAS:
    //                 let addressAliasTx = transactions[i] as AddressAliasTransaction;
    //                 tempData = this.extractTransactionAddressAlias(addressAliasTx);
    //                 break;
    //             case TransactionType.ADD_EXCHANGE_OFFER:
    //                 let addExchangeOfferTx = transactions[i] as AddExchangeOfferTransaction;
    //                 tempData = this.extractTransactionAddExchangeOffer(addExchangeOfferTx);
    //                 break;
    //             case TransactionType.AGGREGATE_BONDED:
    //                 let aggregateBondedTx = transactions[i] as AggregateTransaction;
    //                 if(aggregateBondedTx.cosignatures.length){
    //                     dashboardTransaction.cosignatures = { 
    //                         cosigners: aggregateBondedTx.cosignatures.map(
    //                             (x)=> { return { publicKey: x.signer.publicKey, address: x.signer.address.plain()}}
    //                         )
    //                     };
    //                     dashboardTransaction.signedPublicKeys = dashboardTransaction.signedPublicKeys.concat(dashboardTransaction.cosignatures.cosigners.map(x => x.publicKey));
    //                 }
    //                 totalLength = aggregateBondedTx.innerTransactions.length;
    //                 dashboardTransaction.innerTransactions = [];
    //                 tempData = {
    //                     signer: aggregateBondedTx.signer.publicKey,
    //                     relatedAsset: [],
    //                     relatedNamespace: [],
    //                     relatedPublicKey: [],
    //                     signerAddress: aggregateBondedTx.signer.address.plain(),
    //                     relatedAddress: [],
    //                     typeName: TransactionUtils.getTransactionTypeName(aggregateBondedTx.type),
    //                     searchString: [],
    //                     extractedData: {},
    //                     displayList: new Map<string, string>(),
    //                     transferList: [],
    //                     displayTips: [],
    //                     signerPublicKeys: [aggregateBondedTx.signer.publicKey]
    //                 };

    //                 for (let y = 0; y < totalLength; ++y) {
    //                     let tempInnerData = this.extractInnerTransaction(aggregateBondedTx.innerTransactions[y]);

    //                     tempData.relatedAddress = tempData.relatedAddress.concat(tempInnerData.relatedAddress);
    //                     tempData.relatedAsset = tempData.relatedAsset.concat(tempInnerData.relatedAsset);
    //                     tempData.relatedNamespace = tempData.relatedNamespace.concat(tempInnerData.relatedNamespace);
    //                     tempData.relatedPublicKey = tempData.relatedPublicKey.concat(tempInnerData.relatedPublicKey);
    //                     tempData.searchString = tempData.searchString.concat(tempInnerData.searchString);

    //                     dashboardTransaction.innerTransactions.push(tempInnerData);
    //                 }
    //                 break;
    //             case TransactionType.AGGREGATE_COMPLETE:
    //                 let aggregateCompleteTx = transactions[i] as AggregateTransaction;
    //                 if(aggregateCompleteTx.cosignatures.length){
    //                     dashboardTransaction.cosignatures = { 
    //                         cosigners: aggregateCompleteTx.cosignatures.map(
    //                             (x)=> { return { publicKey: x.signer.publicKey, address: x.signer.address.plain()}}
    //                         )
    //                     };
    //                     dashboardTransaction.signedPublicKeys = dashboardTransaction.signedPublicKeys.concat(dashboardTransaction.cosignatures.cosigners.map(x => x.publicKey));
    //                 }
    //                 totalLength = aggregateCompleteTx.innerTransactions.length;
    //                 dashboardTransaction.innerTransactions = [];

    //                 tempData = {
    //                     signer: aggregateCompleteTx.signer.publicKey,
    //                     relatedAsset: [],
    //                     relatedNamespace: [],
    //                     relatedPublicKey: [],
    //                     signerAddress: aggregateCompleteTx.signer.address.plain(),
    //                     relatedAddress: [],
    //                     typeName: TransactionUtils.getTransactionTypeName(aggregateCompleteTx.type),
    //                     searchString: [],
    //                     extractedData: {},
    //                     displayList: new Map<string, string>(),
    //                     displayTips: [],
    //                     signerPublicKeys: [aggregateCompleteTx.signer.publicKey]
    //                 };

    //                 for (let x = 0; x < totalLength; ++x) {
    //                     let tempInnerData = this.extractInnerTransaction(aggregateCompleteTx.innerTransactions[x]);

    //                     tempData.relatedAddress = tempData.relatedAddress.concat(tempInnerData.relatedAddress);
    //                     tempData.relatedAsset = tempData.relatedAsset.concat(tempInnerData.relatedAsset);
    //                     tempData.relatedNamespace = tempData.relatedNamespace.concat(tempInnerData.relatedNamespace);
    //                     tempData.relatedPublicKey = tempData.relatedPublicKey.concat(tempInnerData.relatedPublicKey);
    //                     tempData.searchString = tempData.searchString.concat(tempInnerData.searchString);

    //                     dashboardTransaction.innerTransactions.push(tempInnerData);
    //                 }
    //                 break;
    //             case TransactionType.CHAIN_CONFIGURE:
    //                 let chainConfigureTx = transactions[i] as ChainConfigTransaction;
    //                 tempData = this.extractTransactionChainConfig(chainConfigureTx);
    //                 break;
    //             case TransactionType.CHAIN_UPGRADE:
    //                 let chainUpgradeTx = transactions[i] as ChainUpgradeTransaction;
    //                 tempData = this.extractTransactionChainUpgrade(chainUpgradeTx);
    //                 break;
    //             case TransactionType.EXCHANGE_OFFER:
    //                 let exchangeOfferTx = transactions[i] as ExchangeOfferTransaction;
    //                 tempData = this.extractTransactionExchangeOffer(exchangeOfferTx);
    //                 break;
    //             case TransactionType.REMOVE_EXCHANGE_OFFER:
    //                 let removeExchangeOfferTx = transactions[i] as RemoveExchangeOfferTransaction;
    //                 tempData = this.extractTransactionRemoveExchangeOffer(removeExchangeOfferTx);
    //                 break;
    //             case TransactionType.LINK_ACCOUNT:
    //                 let accountLinkTx = transactions[i] as AccountLinkTransaction;
    //                 tempData = this.extractTransactionAccountLink(accountLinkTx);
    //                 break;
    //             case TransactionType.LOCK:
    //                 let lockFundTx = transactions[i] as LockFundsTransaction;
    //                 tempData = this.extractTransactionLockFunds(lockFundTx);
    //                 break;
    //             // case TransactionType.MODIFY_ACCOUNT_METADATA:
    //             //     let modifyAccountMetadataTx = transactions[i] as ModifyMetadataTransaction;
    //             //     tempData = this.extractTransactionModifyAccountMetadata(modifyAccountMetadataTx);
    //             //     break;
    //             // case TransactionType.MODIFY_MOSAIC_METADATA:
    //             //     let modifyMosaicMetadataTx = transactions[i] as ModifyMetadataTransaction;
    //             //     tempData = this.extractTransactionModifyMosaicMetadata(modifyMosaicMetadataTx);
    //             //     break;
    //             // case TransactionType.MODIFY_NAMESPACE_METADATA:
    //             //     let modifyNamespaceMetadataTx = transactions[i] as ModifyMetadataTransaction;
    //             //     tempData = this.extractTransactionModifyNamespaceMetadata(modifyNamespaceMetadataTx);
    //             //     break;
    //             case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
    //                 let accAddressModifyTx = transactions[i] as AccountAddressRestrictionModificationTransaction;
    //                 tempData = this.extractTransactionAccountAddressRestriction(accAddressModifyTx);
    //                 break;
    //             case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
    //                 let accMosaicModifyTx = transactions[i] as AccountMosaicRestrictionModificationTransaction;
    //                 tempData = this.extractTransactionAccountMosaicRestriction(accMosaicModifyTx);
    //                 break;
    //             case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
    //                 let accOperationModifyTx = transactions[i] as AccountOperationRestrictionModificationTransaction;
    //                 tempData = this.extractTransactionAccountOperationRestriction(accOperationModifyTx);
    //                 break;
    //             case TransactionType.MODIFY_MULTISIG_ACCOUNT:
    //                 let modifyMultisigAccountTx = transactions[i] as ModifyMultisigAccountTransaction;
    //                 tempData = this.extractTransactionModifyMultisigAccount(modifyMultisigAccountTx);
    //                 break;
    //             case TransactionType.MOSAIC_ALIAS:
    //                 let mosaicAliasTx = transactions[i] as MosaicAliasTransaction;
    //                 tempData = this.extractTransactionMosaicAlias(mosaicAliasTx);
    //                 break;
    //             case TransactionType.MOSAIC_DEFINITION:
    //                 let mosaicDefinitionTx = transactions[i] as MosaicDefinitionTransaction;
    //                 tempData = this.extractTransactionMosaicDefinition(mosaicDefinitionTx);
    //                 break;
    //             case TransactionType.MOSAIC_SUPPLY_CHANGE:
    //                 let mosaicSupplyTx = transactions[i] as MosaicSupplyChangeTransaction;
    //                 tempData = this.extractTransactionMosaicSupplyChange(mosaicSupplyTx);
    //                 break;
    //             case TransactionType.REGISTER_NAMESPACE:
    //                 let registerNamespaceTx = transactions[i] as RegisterNamespaceTransaction;
    //                 tempData = this.extractTransactionRegisterNamespace(registerNamespaceTx);
    //                 break;
    //             case TransactionType.SECRET_LOCK:
    //                 let secretLockTx = transactions[i] as SecretLockTransaction;
    //                 tempData = this.extractTransactionSecretLock(secretLockTx);
    //                 break;
    //             case TransactionType.SECRET_PROOF:
    //                 let secretProofTx = transactions[i] as SecretProofTransaction;
    //                 tempData = this.extractTransactionSecretProof(secretProofTx);
    //                 break;
    //             case TransactionType.TRANSFER:
    //                 let transferTx = transactions[i] as TransferTransaction;
    //                 tempData = this.extractTransactionTransfer(transferTx);
    //                 break;
    //             default:
    //                 break;
    //         }

    //         dashboardTransaction.relatedAddress = dashboardTransaction.relatedAddress.concat(tempData.relatedAddress);
    //         dashboardTransaction.relatedAsset = dashboardTransaction.relatedAsset.concat(tempData.relatedAsset);
    //         dashboardTransaction.relatedNamespace = dashboardTransaction.relatedNamespace.concat(tempData.relatedNamespace);
    //         dashboardTransaction.relatedPublicKey = dashboardTransaction.relatedPublicKey.concat(tempData.relatedPublicKey);
    //         dashboardTransaction.searchString = dashboardTransaction.searchString.concat(tempData.searchString);
    //         dashboardTransaction.extractedData = tempData.extractedData;
    //         dashboardTransaction.displayList = tempData.displayList;
    //         dashboardTransaction.transferList = tempData.transferList ? tempData.transferList: [];
    //         dashboardTransaction.displayTips = tempData.displayTips;

    //         dashboardTransaction.relatedAddress = Array.from(new Set(dashboardTransaction.relatedAddress));
    //         dashboardTransaction.relatedAsset = Array.from(new Set(dashboardTransaction.relatedAsset));
    //         dashboardTransaction.relatedNamespace = Array.from(new Set(dashboardTransaction.relatedNamespace));
    //         dashboardTransaction.relatedPublicKey = Array.from(new Set(dashboardTransaction.relatedPublicKey));
    //         dashboardTransaction.searchString = Array.from(new Set(dashboardTransaction.searchString));

    //         formattedTransactions.push(dashboardTransaction);
    //     }

    //     return formattedTransactions;
    // }

    extractTransactionTransfer(transferTx: TransferTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: transferTx.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [transferTx.signer.publicKey],
            signerAddress: transferTx.signer.address.plain(),
            relatedAddress: [transferTx.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(transferTx.type),
            searchString: [],
            transferList: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [transferTx.signer.publicKey],
            otherAssets: [],
        };

        let sendTo = "";
        let toType = "";

        if (transferTx.recipient instanceof NamespaceId) {
            let recipientNamespaceIdHex = transferTx.recipient.toHex().toUpperCase();
            transactionDetails.relatedNamespace.push(recipientNamespaceIdHex);
            sendTo = recipientNamespaceIdHex;
            toType = "namespace";
        }
        else {
            let plainRecipientAddress = transferTx.recipient.plain();
            transactionDetails.relatedAddress.push(transferTx.recipient.plain());
            sendTo = plainRecipientAddress;
            toType = "address";
        }

        let fromToRowTip = new RowDashboardTip();

        // sender
        let senderDisplay = this.addressConvertToName(transactionDetails.signerAddress);
        //let senderTip: DashboardTip = DashboardService.createAddressTip(senderDisplay, transactionDetails.signerAddress);

        // to who
        //let recipientTip: DashboardTip = toType === "namespace" ? DashboardService.createNamespaceIDTip(sendTo): DashboardService.createAddressTip(this.addressConvertToName(sendTo), sendTo);

        let transferTip;

        if(toType === "namespace"){
            transferTip = DashboardService.createTransferUnresolvedTip(transactionDetails.signerAddress, senderDisplay, sendTo, sendTo);
        }
        else{
            transferTip = DashboardService.createTransferTip(transactionDetails.signerAddress, senderDisplay, sendTo, this.addressConvertToName(sendTo));
        }

        // fromToRowTip.rowTips.push(senderTip);
        // fromToRowTip.rowTips.push(DashboardService.createToRightArrowTip());
        fromToRowTip.rowTips.push(transferTip);

        let messageTypeString: string;
        let messageType: string;

        if (transferTx.message.payload.length === 0) {
            messageTypeString = "Empty message";
            messageType = "empty";
        }
        else if (transferTx.message.type === 0) {
            messageTypeString = "Plain message";
            messageType = "plain";
        } else if (transferTx.message.type === 1) {
            messageTypeString = "Encrypted message";
            messageType = "encrypted";
        }
        else {
            messageTypeString = "Other message";
            messageType = "other";
        }

        let messageTip = new DashboardTip(TipType.MESSAGE);
        messageTip.displayValue = messageTypeString;
        messageTip.valueType = messageType;
        messageTip.value = transferTx.message.payload;

        fromToRowTip.rowTips.push(messageTip);

        transactionDetails.displayTips.push(fromToRowTip);

        let newRowTip = new RowDashboardTip();
        newRowTip.rowTips.push(messageTip);

        let transfer: TransferList[] = [];

        let txnAmount: number;

        if (transferTx.mosaics.length) {
            for (let i = 0; i < transferTx.mosaics.length; ++i) {
                let valueType = "asset"; 
                let mosaicIdHex = transferTx.mosaics[i].id.toHex().toUpperCase();

                if(Array.from(namespaceIdFirstCharacterString).includes(mosaicIdHex.substring(0, 1)) ){
                    valueType = "namespace";
                    transactionDetails.relatedNamespace.push(mosaicIdHex);
                }else{
                    transactionDetails.relatedAsset.push(mosaicIdHex);
                }
                
                let newTransfer: TransferList = {
                    from: transactionDetails.signerAddress,
                    to: sendTo,
                    toType: toType,
                    sendingType: valueType,
                    value: mosaicIdHex,
                    valueDisplay: mosaicIdHex,
                    amount: transferTx.mosaics[i].amount.compact()
                };

                if(mosaicIdHex.toUpperCase() === nativeTokenAssetId.value.toUpperCase()){
                    txnAmount = transferTx.mosaics[i].amount.compact();
                }

                let resolved = false;

                if(mosaicIdHex.toUpperCase() === nativeTokenAssetId.value.toUpperCase() || mosaicIdHex.toUpperCase() === nativeTokenNamespaceId.value.toUpperCase()){
                    newTransfer.value = nativeTokenAssetId.value.toUpperCase();
                    valueType = "asset";
                    newTransfer.valueDisplay = "XPX";
                    newTransfer.amount = DashboardService.convertToExactNativeAmount(newTransfer.amount);
                    resolved = true;
                }

                transfer.push(newTransfer);
                transactionDetails.transferList.push(newTransfer);

                let newRowTip = new RowDashboardTip();

                //let sendingAmountTip: DashboardTip = resolved ? DashboardService.createExactAmountTip(newTransfer.amount) : DashboardService.createAbsoluteAmountTip(newTransfer.amount);
                // send what
                //let sendingTip: DashboardTip = valueType === "asset" ? DashboardService.createAssetTip(newTransfer.valueDisplay, newTransfer.value) : DashboardService.createNamespaceIDTip(newTransfer.value);

                let amountTip: DashboardTip;

                if(valueType === "asset"){
                    amountTip = DashboardService.createAssetAmountTip(newTransfer.amount, newTransfer.value, newTransfer.valueDisplay, true);

                    // get other assets
                    if(mosaicIdHex.toUpperCase() != nativeTokenAssetId.value.toUpperCase() && mosaicIdHex.toUpperCase() != nativeTokenNamespaceId.value.toUpperCase()){
                        let otherAsset = DashboardService.displayOtherAsset(newTransfer.amount, newTransfer.value, transferTx.mosaics[i].id);
                        transactionDetails.otherAssets.push(otherAsset);
                    }
                }else{
                    amountTip = DashboardService.createNamespaceAmountTip(newTransfer.amount, newTransfer.value, newTransfer.valueDisplay, true);
                }

                newRowTip.rowTips.push(amountTip);
                //newRowTip.rowTips.push(sendingTip);              
                
                transactionDetails.displayTips.push(newRowTip);
            }

        }

        let data = {
            transferList: transfer,
            recipient: sendTo,
            recipientType: toType,
            recipientName: this.addressConvertToName(sendTo),
            messageTypeString: messageTypeString,
            messageType: messageType,
            messagePayload: transferTx.message.payload,
            amount: txnAmount?Helper.convertToExact(txnAmount, 6):'',
        };

        //transactionDetails.displayTips.push(newRowTip);

        transactionDetails.extractedData = data;

        //transactionDetails.displayList.set("Address", data.address);
        //transactionDetails.displayList.set("Namespace ID", data.namespaceId);


        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionAddressAlias(addressAliasTransaction: AddressAliasTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: addressAliasTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [addressAliasTransaction.namespaceId.toHex().toUpperCase()],
            relatedPublicKey: [addressAliasTransaction.signer.publicKey],
            signerAddress: addressAliasTransaction.signer.address.plain(),
            relatedAddress: [addressAliasTransaction.signer.address.plain(), addressAliasTransaction.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(addressAliasTransaction.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [addressAliasTransaction.signer.publicKey]
        };

        let linkType = addressAliasTransaction.actionType === 0 ? "Link" : "Unlink";

        let data = {
            linkType: linkType,
            address: addressAliasTransaction.address.pretty(),
            addressPlain: addressAliasTransaction.address.plain(),
            namespaceId: addressAliasTransaction.namespaceId.toHex().toUpperCase(),
        }

        let newRowTip = new RowDashboardTip();
        let addressDisplay = this.addressConvertToName(data.addressPlain);
        let namespaceIdDisplay = data.namespaceId;

        if(linkType === "Link"){
            newRowTip.rowTips.push(DashboardService.createAddressAliasTip(data.namespaceId, namespaceIdDisplay, data.addressPlain, addressDisplay));
        }
        else{
            newRowTip.rowTips.push(DashboardService.createRemoveAddressAliasTip(data.namespaceId, namespaceIdDisplay, data.addressPlain, addressDisplay));
        }

        transactionDetails.displayTips.push(newRowTip);

        transactionDetails.extractedData = data;

        // transactionDetails.displayList.set("Address", data.address);
        // transactionDetails.displayList.set("Namespace ID", data.namespaceId);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionAddExchangeOffer(addExchangeOfferTransaction: AddExchangeOfferTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: addExchangeOfferTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [addExchangeOfferTransaction.signer.publicKey],
            signerAddress: addExchangeOfferTransaction.signer.address.plain(),
            relatedAddress: [addExchangeOfferTransaction.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(addExchangeOfferTransaction.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [addExchangeOfferTransaction.signer.publicKey]
        };

        let offerArray = [];

        for (let i = 0; i < addExchangeOfferTransaction.offers.length; ++i) {
            let cost = addExchangeOfferTransaction.offers[i].cost.compact();
            let duration = addExchangeOfferTransaction.offers[i].duration.compact();
            let mosaicAmount = addExchangeOfferTransaction.offers[i].mosaicAmount.compact();
            let assetId = addExchangeOfferTransaction.offers[i].mosaicId.toHex().toUpperCase();
            let type = addExchangeOfferTransaction.offers[i].type === 0 ? "Sell offer" : "Buy offer";

            offerArray.push({
                cost: cost,
                duration: duration,
                assetAmount: mosaicAmount,
                assetId: assetId,
                type: type
            });

            let exactAmount: number = DashboardService.convertToExactNativeAmount(cost);

            let newRowTip = new RowDashboardTip();
            
            let typeTip = DashboardService.createSimpleStringTip(type);
            let durationTip = DashboardService.createDurationTip(duration)
            let assetAmountTip = DashboardService.createAbsoluteAmountTip(mosaicAmount);
            let assetTip = DashboardService.createAssetTip(assetId);
            let costTip = DashboardService.createStringTip(exactAmount.toString(), "Cost:", nativeTokenName.value);

            newRowTip.rowTips.push(typeTip);
            newRowTip.rowTips.push(durationTip);
            newRowTip.rowTips.push(assetAmountTip);
            newRowTip.rowTips.push(assetTip);
            newRowTip.rowTips.push(costTip);

            transactionDetails.displayTips.push(newRowTip);
        }

        let data = {
            offers: offerArray
        };

        transactionDetails.extractedData = data;

        /*
        transactionDetails.displayList.set("Offers Added", data.offers.map(
            (offer)=> `${offer.type}: ${offer.assetAmount} ${offer.assetId} for ${offer.cost} per unit (Duration: ${offer.duration} blocks)`).join('<br>')
        );
        */

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionChainConfig(chainConfigTransaction: ChainConfigTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: chainConfigTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [chainConfigTransaction.signer.publicKey],
            signerAddress: chainConfigTransaction.signer.address.plain(),
            relatedAddress: [chainConfigTransaction.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(chainConfigTransaction.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [chainConfigTransaction.signer.publicKey]
        };

        let data = {
            applyHeightDelta: chainConfigTransaction.applyHeightDelta.compact(),
            networkConfig: chainConfigTransaction.networkConfig,
            supportedEntityVersions: chainConfigTransaction.supportedEntityVersions
        };

        let newRowTip = new RowDashboardTip();
            
        let applyHeightDeltaTip = DashboardService.createStringTip(data.applyHeightDelta.toString(), "Apply after", "blocks");

        newRowTip.rowTips.push(applyHeightDeltaTip);

        transactionDetails.displayTips.push(newRowTip);

        transactionDetails.extractedData = data;

        //transactionDetails.displayList.set("Apply after", `${data.applyHeightDelta} `);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionChainUpgrade(chainUpgradeTransaction: ChainUpgradeTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: chainUpgradeTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [chainUpgradeTransaction.signer.publicKey],
            signerAddress: chainUpgradeTransaction.signer.address.plain(),
            relatedAddress: [chainUpgradeTransaction.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(chainUpgradeTransaction.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [chainUpgradeTransaction.signer.publicKey]
        };

        let data = {
            newVersion: chainUpgradeTransaction.newBlockchainVersion.compact(),
            upgradePeriod: chainUpgradeTransaction.upgradePeriod.compact()
        }

        let newRowTip = new RowDashboardTip();
            
        let versionTip = DashboardService.createStringTip(data.newVersion.toString(), "New version:");
        let upgradePeriodTip = DashboardService.createStringTip(data.upgradePeriod.toString(), "Upgrade period:" + "blocks");

        newRowTip.rowTips.push(versionTip);
        newRowTip.rowTips.push(upgradePeriodTip);

        transactionDetails.displayTips.push(newRowTip);

        transactionDetails.extractedData = data;

        // transactionDetails.displayList.set("New Version", `${data.newVersion}`);
        // transactionDetails.displayList.set("Upgrade Period", `${data.upgradePeriod} blocks`);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionExchangeOffer(exchangeOfferTransaction: ExchangeOfferTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: exchangeOfferTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [exchangeOfferTransaction.signer.publicKey],
            signerAddress: exchangeOfferTransaction.signer.address.plain(),
            relatedAddress: [exchangeOfferTransaction.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(exchangeOfferTransaction.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [exchangeOfferTransaction.signer.publicKey]
        };

        let exchangeOfferArray = [];

        for (let i = 0; i < exchangeOfferTransaction.offers.length; ++i) {
            let cost = exchangeOfferTransaction.offers[i].cost.compact();
            let owner = exchangeOfferTransaction.offers[i].owner; // Owner of the offer we want to accept
            let mosaicAmount = exchangeOfferTransaction.offers[i].mosaicAmount.compact();
            let assetId = exchangeOfferTransaction.offers[i].mosaicId.toHex().toUpperCase();
            let type = exchangeOfferTransaction.offers[i].type === 0 ? "Sell offer" : "Buy offer";

            exchangeOfferArray.push({
                cost: cost,
                owner: owner,
                assetAmount: mosaicAmount,
                assetId: assetId,
                type: type
            });

            let exactAmount: number = DashboardService.convertToExactNativeAmount(cost);

            let newRowTip = new RowDashboardTip();
            
            let typeTip = DashboardService.createSimpleStringTip(type);
            let publicKeyTip = DashboardService.createStringTip(owner.publicKey, "Owner: ")
            let assetAmountTip = DashboardService.createAbsoluteAmountTip(mosaicAmount);
            let assetTip = DashboardService.createAssetTip(assetId);
            let costTip = DashboardService.createStringTip(exactAmount.toString(), "Cost:", nativeTokenName.value);

            newRowTip.rowTips.push(typeTip);
            newRowTip.rowTips.push(publicKeyTip);
            newRowTip.rowTips.push(assetAmountTip);
            newRowTip.rowTips.push(assetTip);
            newRowTip.rowTips.push(costTip);

            transactionDetails.displayTips.push(newRowTip);
        }

        let data = {
            exchangeOffers: exchangeOfferArray
        };

        transactionDetails.extractedData = data;

        // transactionDetails.displayList.set("Offer Exchanges", data.exchangeOffers.map(
        //     (arr)=> `${arr.type}: Offer ${arr.assetAmount} ${arr.assetId} from ${arr.owner} for ${arr.cost} per unit`).join("<br>")
        // );

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionRemoveExchangeOffer(removeExchangeOfferTransaction: RemoveExchangeOfferTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: removeExchangeOfferTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [removeExchangeOfferTransaction.signer.publicKey],
            signerAddress: removeExchangeOfferTransaction.signer.address.plain(),
            relatedAddress: [removeExchangeOfferTransaction.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(removeExchangeOfferTransaction.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [removeExchangeOfferTransaction.signer.publicKey]
        };

        let offerRemoveArray = [];

        for (let i = 0; i < removeExchangeOfferTransaction.offers.length; ++i) {
            let assetId = removeExchangeOfferTransaction.offers[i].mosaicId.toHex().toUpperCase();
            let type = removeExchangeOfferTransaction.offers[i].offerType === 0 ? "Sell offer" : "Buy offer";

            offerRemoveArray.push({
                assetId: assetId,
                type: type
            });
            transactionDetails.relatedAsset.push(assetId);

            let newRowTip = new RowDashboardTip();
            
            let typeTip = DashboardService.createSimpleStringTip(type);
            let assetTip = DashboardService.createAssetTip(assetId);

            newRowTip.rowTips.push(typeTip);
            newRowTip.rowTips.push(assetTip);

            transactionDetails.displayTips.push(newRowTip);
        }

        let data = {
            offersRemove: offerRemoveArray
        };

        transactionDetails.extractedData = data;

        //transactionDetails.displayList.set("Removed Offers", data.offersRemove.map((arr)=> `${arr.type}: ${arr.assetId}`).join("<br>"));

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionAccountLink(accountLinkTransaction: AccountLinkTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: accountLinkTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [accountLinkTransaction.signer.publicKey],
            signerAddress: accountLinkTransaction.signer.address.plain(),
            relatedAddress: [accountLinkTransaction.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(accountLinkTransaction.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [accountLinkTransaction.signer.publicKey]
        };

        let publicKey = accountLinkTransaction.remoteAccountKey;

        let data = {
            remoteAccountKey: publicKey,
            linkAction: accountLinkTransaction.linkAction === 0 ? "Link" : "Unlink"
        }

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();
        let remoteAddress = PublicAccount.createFromPublicKey(data.remoteAccountKey, localNetworkType.value).address.plain();
        let remoteAddressPretty = PublicAccount.createFromPublicKey(data.remoteAccountKey, localNetworkType.value).address.pretty();
        let searchedAddress = this.addressConvertToName(remoteAddress);
        let publicKeyDisplay = searchedAddress === remoteAddressPretty ? data.remoteAccountKey: searchedAddress;

        if(data.linkAction === "Link"){
            newRowTip.rowTips.push(DashboardService.createAccountLinkTip(data.remoteAccountKey, publicKeyDisplay));
        }
        else{
            newRowTip.rowTips.push(DashboardService.createAccountUnlinkTip(data.remoteAccountKey, publicKeyDisplay));
        }

        transactionDetails.displayTips.push(newRowTip);

        // transactionDetails.displayList.set("Action", `${data.linkAction}`);
        // transactionDetails.displayList.set("Linked Account", `${data.remoteAccountKey}`);   

        transactionDetails.relatedPublicKey.push(publicKey);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionLockFunds(lockFundsTransaction: LockFundsTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: lockFundsTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [lockFundsTransaction.signer.publicKey],
            signerAddress: lockFundsTransaction.signer.address.plain(),
            relatedAddress: [lockFundsTransaction.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(lockFundsTransaction.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [lockFundsTransaction.signer.publicKey]
        };

        let lockedHash = lockFundsTransaction.hash;
        let mosaicIdHex = lockFundsTransaction.mosaic.id.toHex().toUpperCase();

        let data = {
            lockedHash: lockFundsTransaction.hash,
            duration: lockFundsTransaction.duration.compact(),
            mosaicId: mosaicIdHex,
            mosaicAmount: lockFundsTransaction.mosaic.amount.compact()
        };

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();
            
        let lockHashTip = DashboardService.createTxHashTip(data.lockedHash);
        let durationTip = DashboardService.createDurationTip(data.duration);

        let assetAmountTip = DashboardService.createAssetAmountTip(DashboardService.convertToExactNativeAmount(data.mosaicAmount), data.mosaicId, "XPX", true);
        // let assetIdTip = DashboardService.createAssetTip(data.mosaicId);
        // let mosaicAmountTip = DashboardService.createExactAmountTip(DashboardService.convertToExactNativeAmount(data.mosaicAmount));

        //assetIdTip.displayValue = "XPX";

        newRowTip.rowTips.push(lockHashTip);
        newRowTip.rowTips.push(durationTip);
        newRowTip.rowTips.push(assetAmountTip);
        // newRowTip.rowTips.push(assetIdTip);

        transactionDetails.displayTips.push(newRowTip);

        // transactionDetails.displayList.set("Locked Hash", `${data.lockedHash}`);
        // transactionDetails.displayList.set("Duration", `${data.duration} blocks`);
        // transactionDetails.displayList.set("Asset ID", `${data.mosaicId}`);
        // transactionDetails.displayList.set("Asset Amount", `${data.mosaicAmount}`);

        transactionDetails.searchString.push(lockedHash);
        transactionDetails.relatedAsset.push(mosaicIdHex);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    // extractTransactionModifyAccountMetadata(modifyAccountMetadataTx: ModifyMetadataTransaction): DashboardInnerTransaction {
    //     let transactionDetails: DashboardInnerTransaction = {
    //         signer: modifyAccountMetadataTx.signer.publicKey,
    //         relatedAsset: [],
    //         relatedNamespace: [],
    //         relatedPublicKey: [modifyAccountMetadataTx.signer.publicKey],
    //         signerAddress: modifyAccountMetadataTx.signer.address.plain(),
    //         relatedAddress: [modifyAccountMetadataTx.signer.address.plain()],
    //         typeName: TransactionUtils.getTransactionTypeName(modifyAccountMetadataTx.type),
    //         searchString: [],
    //         extractedData: {},
    //         displayList: new Map<string, string>(),
    //         displayTips: [],
    //         signerPublicKeys: [modifyAccountMetadataTx.signer.publicKey]
    //     };

    //     let metadataId = modifyAccountMetadataTx.metadataId;
    //     let metadataType = "Address";

    //     let modifications = [];
    //     let modificationsTip: DashboardTip[] = [];

    //     for (let i = 0; i < modifyAccountMetadataTx.modifications.length; ++i) {
    //         let key = modifyAccountMetadataTx.modifications[i].key;
    //         let type = modifyAccountMetadataTx.modifications[i].type === 0 ? "Add" : "Remove";
    //         let value = modifyAccountMetadataTx.modifications[i].value;

    //         modifications.push({
    //             key: key,
    //             value: value,
    //             type: type
    //         });

    //         modificationsTip.push(DashboardService.createSimpleStringTip(`${type}-${key}:${value}`));
    //     }

    //     let data = {
    //         metadataId: metadataId,
    //         metadataType: metadataType,
    //         modifications: modifications
    //     };

    //     transactionDetails.extractedData = data;

    //     let newRowTip = new RowDashboardTip();
            
    //     let metadataIdTip = DashboardService.createStringTip(data.metadataId, "Metadata ID:");
    //     let metadataTypeTip = DashboardService.createSimpleStringTip(data.metadataType);

    //     let allTip: DashboardTip[] = [ metadataIdTip, metadataTypeTip];

    //     allTip = allTip.concat(modificationsTip);

    //     newRowTip.rowTips = allTip;

    //     transactionDetails.displayTips.push(newRowTip);

    //     // transactionDetails.displayList.set("Type", `${data.metadataType}`);
    //     // transactionDetails.displayList.set("Address", `${data.metadataId}`);
    //     // transactionDetails.displayList.set("Modifications", data.modifications.map((modi)=> `${modi.type}: '${modi.value}' into '${modi.key}' key`).join("<br>"));

    //     transactionDetails.relatedAddress.push(metadataId);

    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

    //     return transactionDetails;
    // }

    // extractTransactionModifyMosaicMetadata(modifyMosaicMetadataTx: ModifyMetadataTransaction): DashboardInnerTransaction {
    //     let transactionDetails: DashboardInnerTransaction = {
    //         signer: modifyMosaicMetadataTx.signer.publicKey,
    //         relatedAsset: [],
    //         relatedNamespace: [],
    //         relatedPublicKey: [modifyMosaicMetadataTx.signer.publicKey],
    //         signerAddress: modifyMosaicMetadataTx.signer.address.plain(),
    //         relatedAddress: [modifyMosaicMetadataTx.signer.address.plain()],
    //         typeName: TransactionUtils.getTransactionTypeName(modifyMosaicMetadataTx.type),
    //         searchString: [],
    //         extractedData: {},
    //         displayList: new Map<string, string>(),
    //         displayTips: [],
    //         signerPublicKeys: [modifyMosaicMetadataTx.signer.publicKey]
    //     };

    //     let metadataId = modifyMosaicMetadataTx.metadataId;
    //     let metadataType = "Asset";

    //     let modifications = [];
    //     let modificationsTip: DashboardTip[] = [];

    //     for (let i = 0; i < modifyMosaicMetadataTx.modifications.length; ++i) {
    //         let key = modifyMosaicMetadataTx.modifications[i].key;
    //         let type = modifyMosaicMetadataTx.modifications[i].type === 0 ? "Add" : "Remove";
    //         let value = modifyMosaicMetadataTx.modifications[i].value;

    //         modifications.push({
    //             key: key,
    //             value: value,
    //             type: type
    //         });

    //         modificationsTip.push(DashboardService.createSimpleStringTip(`${type}-${key}:${value}`));
    //     }

    //     let data = {
    //         metadataId: metadataId,
    //         metadataType: metadataType,
    //         modifications: modifications
    //     };

    //     transactionDetails.extractedData = data;

    //     let newRowTip = new RowDashboardTip();
            
    //     let metadataIdTip = DashboardService.createStringTip(data.metadataId, "Metadata ID:");
    //     let metadataTypeTip = DashboardService.createSimpleStringTip(data.metadataType);

    //     let allTip: DashboardTip[] = [ metadataIdTip, metadataTypeTip];

    //     allTip = allTip.concat(modificationsTip);

    //     newRowTip.rowTips = allTip;

    //     transactionDetails.displayTips.push(newRowTip);

    //     // transactionDetails.displayList.set("Type", `${data.metadataType}`);
    //     // transactionDetails.displayList.set("Asset ID", `${data.metadataId}`);
    //     // transactionDetails.displayList.set("Modifications", data.modifications.map((modi)=> `${modi.type}: '${modi.value}' into '${modi.key}' key`).join("<br>"));

    //     transactionDetails.relatedAsset.push(metadataId);

    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

    //     return transactionDetails;
    // }

    // extractTransactionModifyNamespaceMetadata(modifyNamespaceMetadataTx: ModifyMetadataTransaction): DashboardInnerTransaction {
    //     let transactionDetails: DashboardInnerTransaction = {
    //         signer: modifyNamespaceMetadataTx.signer.publicKey,
    //         relatedAsset: [],
    //         relatedNamespace: [],
    //         relatedPublicKey: [modifyNamespaceMetadataTx.signer.publicKey],
    //         signerAddress: modifyNamespaceMetadataTx.signer.address.plain(),
    //         relatedAddress: [modifyNamespaceMetadataTx.signer.address.plain()],
    //         typeName: TransactionUtils.getTransactionTypeName(modifyNamespaceMetadataTx.type),
    //         searchString: [],
    //         extractedData: {},
    //         displayList: new Map<string, string>(),
    //         displayTips: [],
    //         signerPublicKeys: [modifyNamespaceMetadataTx.signer.publicKey]
    //     };

    //     let metadataId = modifyNamespaceMetadataTx.metadataId;
    //     let metadataType = "Namespace";

    //     let modifications = [];
    //     let modificationsTip: DashboardTip[] = [];

    //     for (let i = 0; i < modifyNamespaceMetadataTx.modifications.length; ++i) {
    //         let key = modifyNamespaceMetadataTx.modifications[i].key;
    //         let type = modifyNamespaceMetadataTx.modifications[i].type === 0 ? "Add" : "Remove";
    //         let value = modifyNamespaceMetadataTx.modifications[i].value;

    //         modifications.push({
    //             key: key,
    //             value: value,
    //             type: type
    //         });

    //         modificationsTip.push(DashboardService.createSimpleStringTip(`${type}-${key}:${value}`));
    //     }

    //     let data = {
    //         metadataId: metadataId,
    //         metadataType: metadataType,
    //         modifications: modifications
    //     };

    //     transactionDetails.extractedData = data;

    //     let newRowTip = new RowDashboardTip();
            
    //     let metadataIdTip = DashboardService.createStringTip(data.metadataId, "Metadata ID:");
    //     let metadataTypeTip = DashboardService.createSimpleStringTip(data.metadataType);

    //     let allTip: DashboardTip[] = [ metadataIdTip, metadataTypeTip];

    //     allTip = allTip.concat(modificationsTip);

    //     newRowTip.rowTips = allTip;

    //     transactionDetails.displayTips.push(newRowTip);

    //     // transactionDetails.displayList.set("Type", `${data.metadataType}`);
    //     // transactionDetails.displayList.set("Namespace ID", `${data.metadataId}`);
    //     // transactionDetails.displayList.set("Modifications", data.modifications.map((modi)=> `${modi.type}: '${modi.value}' into '${modi.key}' key`).join("<br>"));

    //     transactionDetails.relatedNamespace.push(metadataId);

    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
    //     transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

    //     return transactionDetails;
    // }

    extractTransactionAccountAddressRestriction(accAddressRestrictModification: AccountAddressRestrictionModificationTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: accAddressRestrictModification.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [accAddressRestrictModification.signer.publicKey],
            signerAddress: accAddressRestrictModification.signer.address.plain(),
            relatedAddress: [accAddressRestrictModification.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(accAddressRestrictModification.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [accAddressRestrictModification.signer.publicKey]
        };

        let restrictionType = accAddressRestrictModification.restrictionType == RestrictionType.AllowAddress ? "Allow Address" : "Block Address";

        let modifications = [];
        let modificationsTip: DashboardTip[] = [];

        for (let i = 0; i < accAddressRestrictModification.modifications.length; ++i) {
            let modificationType = accAddressRestrictModification.modifications[i].modificationType === 0 ? "Add" : "Remove";
            let address: string = accAddressRestrictModification.modifications[i].value;

            modifications.push({
                modificationType: modificationType,
                address: address
            });

            let addressName = this.addressConvertToName(address);
            modificationsTip.push(DashboardService.createSimpleStringTip(`${modificationType} ${addressName}`));

            transactionDetails.relatedAddress.push(address);
        }

        let data = {
            restrictionType: restrictionType,
            modifications: modifications
        };

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();
            
        let restrictionTypeTip = DashboardService.createStringTip(data.restrictionType);

        let allTip: DashboardTip[] = [ restrictionTypeTip];

        allTip = allTip.concat(modificationsTip);

        newRowTip.rowTips = allTip;

        transactionDetails.displayTips.push(newRowTip);

        // transactionDetails.displayList.set("Type", `${data.restrictionType}`);
        // transactionDetails.displayList.set("Modifications", data.modifications.map((modi)=> `${modi.modificationType} ${modi.address}`).join("<br>"));

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionAccountMosaicRestriction(accMosaicRestrictModification: AccountMosaicRestrictionModificationTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: accMosaicRestrictModification.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [accMosaicRestrictModification.signer.publicKey],
            signerAddress: accMosaicRestrictModification.signer.address.plain(),
            relatedAddress: [accMosaicRestrictModification.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(accMosaicRestrictModification.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [accMosaicRestrictModification.signer.publicKey]
        };

        let restrictionType = accMosaicRestrictModification.restrictionType == RestrictionType.AllowMosaic ? "Allow Asset" : "Block Asset";

        let modifications = [];
        let modificationsTip: DashboardTip[] = [];

        for (let i = 0; i < accMosaicRestrictModification.modifications.length; ++i) {
            let modificationType = accMosaicRestrictModification.modifications[i].modificationType === 0 ? "Add" : "Remove";
            let assetId = accMosaicRestrictModification.modifications[i].value;
            let assetIdHex = Helper.createAssetId(assetId).toHex().toUpperCase();

            modifications.push({
                modificationType: modificationType,
                assetIdHex: assetIdHex
            });

            transactionDetails.relatedAsset.push(assetIdHex);

            modificationsTip.push(DashboardService.createSimpleStringTip(`${modificationType} ${assetIdHex}`));
        }

        let data = {
            restrictionType: restrictionType,
            modifications: modifications
        };

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();
        let restrictionTypeTip = DashboardService.createStringTip(data.restrictionType);

        let allTip: DashboardTip[] = [ restrictionTypeTip];
        allTip = allTip.concat(modificationsTip);

        newRowTip.rowTips = allTip;
        transactionDetails.displayTips.push(newRowTip);

        // transactionDetails.displayList.set("Type", `${data.restrictionType}`);
        // transactionDetails.displayList.set("Modifications", data.modifications.map((modi)=> `${modi.modificationType} - ${modi.assetIdHex}`).join("<br>"));

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionAccountOperationRestriction(accOperationRestrictModification: AccountOperationRestrictionModificationTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: accOperationRestrictModification.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [accOperationRestrictModification.signer.publicKey],
            signerAddress: accOperationRestrictModification.signer.address.plain(),
            relatedAddress: [accOperationRestrictModification.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(accOperationRestrictModification.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [accOperationRestrictModification.signer.publicKey]
        };

        let restrictionType = accOperationRestrictModification.restrictionType == RestrictionType.AllowTransaction ? "Allow Transaction" : "Block Transaction";

        let modifications = [];
        let modificationsTip: DashboardTip[] = [];

        for (let i = 0; i < accOperationRestrictModification.modifications.length; ++i) {
            let modificationType = accOperationRestrictModification.modifications[i].modificationType === 0 ? "Add" : "Remove";
            let transactionType: TransactionType = accOperationRestrictModification.modifications[i].value;
            let transactionName = TransactionUtils.getTransactionTypeNameByEnum(transactionType);

            modifications.push({
                modificationType: modificationType,
                transactionName: transactionName
            });

            modificationsTip.push(DashboardService.createSimpleStringTip(`${modificationType} ${transactionName}`));
        }

        let data = {
            restrictionType: restrictionType,
            modifications: modifications
        };

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();
        let restrictionTypeTip = DashboardService.createStringTip(data.restrictionType);

        let allTip: DashboardTip[] = [ restrictionTypeTip];
        allTip = allTip.concat(modificationsTip);

        newRowTip.rowTips = allTip;
        transactionDetails.displayTips.push(newRowTip);

        // transactionDetails.displayList.set("Type", `${data.restrictionType}`);
        // transactionDetails.displayList.set("Modifications", data.modifications.map((modi)=> `${modi.modificationType} - ${modi.transactionName}`).join("<br>"));

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionModifyMultisigAccount(modifyMultisigAccountTransaction: ModifyMultisigAccountTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: modifyMultisigAccountTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [modifyMultisigAccountTransaction.signer.publicKey],
            signerAddress: modifyMultisigAccountTransaction.signer.address.plain(),
            relatedAddress: [modifyMultisigAccountTransaction.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(modifyMultisigAccountTransaction.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [modifyMultisigAccountTransaction.signer.publicKey]
        };

        let modificationArray = [];
        let modificationsTip: DashboardTip[] = [];

        for (let i = 0; i < modifyMultisigAccountTransaction.modifications.length; ++i) {
            let cosignerPublicKey = modifyMultisigAccountTransaction.modifications[i].cosignatoryPublicAccount.publicKey;
            let type = modifyMultisigAccountTransaction.modifications[i].type === 0 ? "Add" : "Remove";

            transactionDetails.relatedPublicKey.push(cosignerPublicKey);
            transactionDetails.relatedAddress.push(modifyMultisigAccountTransaction.modifications[i].cosignatoryPublicAccount.address.plain());

            modificationArray.push({
                cosignerPublicKey: cosignerPublicKey,
                type: type
            });

            let modify = type === "Add" ? "+" : "-";

            if(type === "Add"){
                transactionDetails.signerPublicKeys.push(cosignerPublicKey);
            }

            let cosignerDisplay = this.publickKeyConvertToName(cosignerPublicKey);

            let modifyTip = DashboardService.createPublicKeyStringTip(cosignerPublicKey, cosignerDisplay, modify)

            modificationsTip.push(modifyTip);
        }

        let data = {
            minApproval: modifyMultisigAccountTransaction.minApprovalDelta,
            minRemoval: modifyMultisigAccountTransaction.minRemovalDelta,
            modifications: modificationArray
        }

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();
        let multisigMinApproveTip = DashboardService.createStringTip(`Min.Approval: ${data.minApproval}`);
        let multisigMinRemoveTip = DashboardService.createStringTip(`Min.Removal: ${data.minRemoval}`);

        let allTip: DashboardTip[] = [ multisigMinApproveTip, multisigMinRemoveTip];
        allTip = allTip.concat(modificationsTip);

        newRowTip.rowTips = allTip;
        transactionDetails.displayTips.push(newRowTip);

        // transactionDetails.displayList.set("Minimum Approval", `${data.minApproval}`);
        // transactionDetails.displayList.set("Minimum Removal", `${data.minRemoval}`);
        // transactionDetails.displayList.set("Modifications", data.modifications.map((modi)=> `${modi.type} ${modi.cosignerPublicKey}`).join("<br>"));

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionMosaicAlias(mosaicAliasTx: MosaicAliasTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: mosaicAliasTx.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [mosaicAliasTx.signer.publicKey],
            signerAddress: mosaicAliasTx.signer.address.plain(),
            relatedAddress: [mosaicAliasTx.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(mosaicAliasTx.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [mosaicAliasTx.signer.publicKey]
        };

        let mosaicIdHex = mosaicAliasTx.mosaicId.toHex().toUpperCase();
        let namespaceIdHex = mosaicAliasTx.namespaceId.toHex().toUpperCase();
        let linkType = mosaicAliasTx.actionType === 0 ? "Link" : "Unlink";

        let data = {
            mosaicIdHex: mosaicIdHex,
            namespaceIdHex: namespaceIdHex,
            linkType: linkType,
        };

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();
        let namespaceIdDisplay = data.namespaceIdHex === nativeTokenNamespaceId.value.toUpperCase() ? "prx.xpx" : data.namespaceIdHex;

        if(linkType === "Link"){
            newRowTip.rowTips.push(DashboardService.createAssetAliasTip(namespaceIdHex, namespaceIdDisplay, mosaicIdHex, mosaicIdHex));
        }
        else{
            newRowTip.rowTips.push(DashboardService.createRemoveAssetAliasTip(namespaceIdHex, namespaceIdDisplay, mosaicIdHex, mosaicIdHex));
        }

        transactionDetails.displayTips.push(newRowTip);

        // transactionDetails.displayList.set("Action", linkType);
        // transactionDetails.displayList.set("Asset ID", mosaicIdHex);
        // transactionDetails.displayList.set("Namespace ID", namespaceIdHex);

        transactionDetails.relatedAsset.push(mosaicIdHex);
        transactionDetails.relatedNamespace.push(namespaceIdHex);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionMosaicDefinition(mosaicDefinitionTransaction: MosaicDefinitionTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: mosaicDefinitionTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [mosaicDefinitionTransaction.signer.publicKey],
            signerAddress: mosaicDefinitionTransaction.signer.address.plain(),
            relatedAddress: [mosaicDefinitionTransaction.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(mosaicDefinitionTransaction.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [mosaicDefinitionTransaction.signer.publicKey]
        };

        let mosaicIdHex = mosaicDefinitionTransaction.mosaicId.toHex().toUpperCase();
        let nonceString = "";//mosaicDefinitionTransaction.nonce.nonce.toString();
        let properties = mosaicDefinitionTransaction.mosaicProperties;

        let data = {
            mosaicIdHex: mosaicIdHex,
            nonce: nonceString,
            properties: {
                divisibility: properties.divisibility,
                supplyMutable: properties.supplyMutable ? "TRUE" : "FALSE",
                transferable: properties.transferable ? "TRUE" : "FALSE",
                duration: properties.duration ? properties.duration.compact() : 0
            }
        };

        let newRowTip = new RowDashboardTip();

        newRowTip.rowTips.push(DashboardService.createAssetTip(mosaicIdHex, mosaicIdHex));
        //newRowTip.rowTips.push(DashboardService.createStringTip(`Nonce: ${nonceString}`));
        newRowTip.rowTips.push(DashboardService.createStringTip(`Divisibility: ${properties.divisibility}`));
        newRowTip.rowTips.push(DashboardService.createStringTip(`Supply Mutable: ${properties.supplyMutable}`));
        newRowTip.rowTips.push(DashboardService.createStringTip(`Transferable: ${properties.transferable}`));

        if(data.properties.duration !== 0){
            newRowTip.rowTips.push(DashboardService.createDurationTip(data.properties.duration));
        }

        transactionDetails.displayTips.push(newRowTip);

        transactionDetails.extractedData = data;

        // transactionDetails.displayList.set("Asset ID", mosaicIdHex);
        // transactionDetails.displayList.set("Nonce", nonceString);
        // transactionDetails.displayList.set("Divisibility", `${data.properties.divisibility}`);
        // transactionDetails.displayList.set("Supply Mutable", data.properties.supplyMutable);
        // transactionDetails.displayList.set("Transferable", data.properties.transferable);
        // transactionDetails.displayList.set("Duration", data.properties.duration === 0 ? "No Expiration" : `${data.properties.duration} blocks`);

        transactionDetails.relatedAsset.push(mosaicIdHex);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionMosaicSupplyChange(mosaicSupplyChangeTransaction: MosaicSupplyChangeTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: mosaicSupplyChangeTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [mosaicSupplyChangeTransaction.signer.publicKey],
            signerAddress: mosaicSupplyChangeTransaction.signer.address.plain(),
            relatedAddress: [mosaicSupplyChangeTransaction.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(mosaicSupplyChangeTransaction.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [mosaicSupplyChangeTransaction.signer.publicKey]
        };

        let mosaicIdHex = mosaicSupplyChangeTransaction.mosaicId.toHex().toUpperCase();
        let deltaAmount = mosaicSupplyChangeTransaction.delta.compact();
        let direction = mosaicSupplyChangeTransaction.direction === 0 ? "Decrease" : "Increase";

        let data = {
            mosaicIdHex: mosaicIdHex,
            deltaAmount: deltaAmount,
            direction: direction,
        };

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();

        //newRowTip.rowTips.push(DashboardService.createAssetTip(mosaicIdHex, mosaicIdHex));

        newRowTip.rowTips.push(DashboardService.createSupplyAssetAmountTip(deltaAmount, false, mosaicIdHex, mosaicIdHex, direction === "Increase"));
        //newRowTip.rowTips.push(DashboardService.createSupplyAmountTip(deltaAmount, false, direction === "Increase"));

        transactionDetails.displayTips.push(newRowTip);

        // transactionDetails.displayList.set("Asset ID", mosaicIdHex);
        // transactionDetails.displayList.set("Type", direction);
        // transactionDetails.displayList.set("Delta Amount", `${deltaAmount}`);

        transactionDetails.relatedAsset.push(mosaicIdHex);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionRegisterNamespace(registerNamespaceTx: RegisterNamespaceTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: registerNamespaceTx.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [registerNamespaceTx.signer.publicKey],
            signerAddress: registerNamespaceTx.signer.address.plain(),
            relatedAddress: [registerNamespaceTx.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(registerNamespaceTx.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [registerNamespaceTx.signer.publicKey]
        };

        let namespaceIdHex = registerNamespaceTx.namespaceId.toHex().toUpperCase();
        let namespaceName = registerNamespaceTx.namespaceName;
        let parentId = registerNamespaceTx.parentId ? registerNamespaceTx.parentId.toHex().toUpperCase() : null;
        let duration = registerNamespaceTx.duration ? registerNamespaceTx.duration.compact() : null;
        let type = registerNamespaceTx.namespaceType === 0 ? "RootNamespace" : "SubNamespace";

        let data = {
            namespaceIdHex: namespaceIdHex,
            namespaceName: namespaceName,
            parentId: parentId,
            duration: duration,
            type: type
        };

        let newRowTip = new RowDashboardTip();

        newRowTip.rowTips.push(DashboardService.createStringTip(type, "Type: "));
        let namespaceTip = DashboardService.createNamespaceIDTip(namespaceName, namespaceIdHex);
        namespaceTip.valueType = "fixed";
        newRowTip.rowTips.push(namespaceTip);
        
        if(parentId){
            newRowTip.rowTips.push(DashboardService.createMsgNamespaceTip(parentId, parentId, "Parent ID:"));
        }

        if(duration){
            newRowTip.rowTips.push(DashboardService.createDurationTip(duration));
        }
        
        transactionDetails.displayTips.push(newRowTip);

        transactionDetails.extractedData = data;

        // transactionDetails.displayList.set("Type", type);
        // transactionDetails.displayList.set("Namespace ID", namespaceIdHex);
        // transactionDetails.displayList.set("Name", namespaceName);
        // transactionDetails.displayList.set("Duration", `${duration} blocks`);

        transactionDetails.relatedNamespace.push(namespaceIdHex);
        transactionDetails.relatedNamespace.push(namespaceName);

        
        if (parentId) {
            transactionDetails.relatedNamespace.push(parentId);
            //transactionDetails.displayList.set("Parent ID", parentId);
        } 

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionSecretLock(secretLockTx: SecretLockTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: secretLockTx.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [secretLockTx.signer.publicKey],
            signerAddress: secretLockTx.signer.address.plain(),
            relatedAddress: [secretLockTx.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(secretLockTx.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [secretLockTx.signer.publicKey]
        };

        let assetIdHex = secretLockTx.mosaic.id.toHex().toUpperCase();
        let assetAmount = secretLockTx.mosaic.amount.compact();
        let address = secretLockTx.recipient.pretty();
        let addressPlain = secretLockTx.recipient.plain();
        let secret = secretLockTx.secret;
        let duration = secretLockTx.duration.compact();
        let hashType = "";

        switch (secretLockTx.hashType) {
            case HashType.Op_Sha3_256:
                hashType = "Op_Sha3_256";
                break;
            case HashType.Op_Keccak_256:
                hashType = "Op_Keccak_256";
                break;
            case HashType.Op_Hash_160:
                hashType = "Op_Hash_160";
                break;
            case HashType.Op_Hash_256:
                hashType = "Op_Hash_256";
                break;
        }

        let data = {
            assetIdHex: assetIdHex,
            assetAmount: assetAmount,
            secret: secret,
            duration: duration,
            hashType: hashType,
            address: address,
            addressPlain: addressPlain
        };

        let newRowTip = new RowDashboardTip();

        let recipientDisplay = this.addressConvertToName(addressPlain);
        let senderDisplay = this.addressConvertToName(transactionDetails.signerAddress)
        newRowTip.rowTips.push(DashboardService.createTransferTip(transactionDetails.signerAddress, senderDisplay, addressPlain, recipientDisplay));
        
        let newRow2Tip = new RowDashboardTip();

        let assetAmountTip = DashboardService.createAssetAmountTip(data.assetAmount, data.assetIdHex, data.assetIdHex, false);

        if(data.assetIdHex === nativeTokenAssetId.value){
            assetAmountTip.displayValue2 = "XPX";
            assetAmountTip.value = DashboardService.convertToExactNativeAmount(data.assetAmount).toString();
            assetAmountTip.valueType = AmountType.EXACT;
        }

        newRow2Tip.rowTips.push(assetAmountTip);
        newRow2Tip.rowTips.push(DashboardService.createStringTip(data.hashType, "Hash Type:"));
        newRow2Tip.rowTips.push(DashboardService.createStringTip(data.secret, "Secret:"));

        transactionDetails.displayTips.push(newRowTip);
        transactionDetails.displayTips.push(newRow2Tip);

        transactionDetails.extractedData = data;

        // transactionDetails.displayList.set("Hash Type", hashType);
        // transactionDetails.displayList.set("Secret", secret);
        // transactionDetails.displayList.set("Duration", `${duration} blocks`);
        // transactionDetails.displayList.set("Asset ID", assetIdHex);
        // transactionDetails.displayList.set("Asset Amount", `${assetAmount}`);
        // transactionDetails.displayList.set("Address", address);

        transactionDetails.relatedAsset.push(assetIdHex);
        transactionDetails.relatedAddress.push(addressPlain);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionSecretProof(secretProofTx: SecretProofTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: secretProofTx.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [secretProofTx.signer.publicKey],
            signerAddress: secretProofTx.signer.address.plain(),
            relatedAddress: [secretProofTx.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(secretProofTx.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [secretProofTx.signer.publicKey]
        };

        let proof = secretProofTx.proof;
        let address = secretProofTx.recipient.pretty();
        let addressPlain = secretProofTx.recipient.plain();
        let secret = secretProofTx.secret;
        let hashType = "";

        switch (secretProofTx.hashType) {
            case HashType.Op_Sha3_256:
                hashType = "Op_Sha3_256";
                break;
            case HashType.Op_Keccak_256:
                hashType = "Op_Keccak_256";
                break;
            case HashType.Op_Hash_160:
                hashType = "Op_Hash_160";
                break;
            case HashType.Op_Hash_256:
                hashType = "Op_Hash_256";
                break;
        }

        let data = {
            proof: proof,
            secret: secret,
            address: address,
            addressPlain: addressPlain,
            hashType: hashType
        };

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();

        let recipientDisplay = this.addressConvertToName(addressPlain);
        let senderDisplay = this.addressConvertToName(transactionDetails.signerAddress)
        newRowTip.rowTips.push(DashboardService.createTransferTip(transactionDetails.signerAddress, senderDisplay, address, recipientDisplay));
        
        let newRow2Tip = new RowDashboardTip();

        newRow2Tip.rowTips.push(DashboardService.createStringTip(data.hashType, "Hash Type:"));
        newRow2Tip.rowTips.push(DashboardService.createStringTip(data.secret, "Secret:"));
        newRow2Tip.rowTips.push(DashboardService.createStringTip(data.proof, "Proof:"));

        transactionDetails.displayTips.push(newRowTip);
        transactionDetails.displayTips.push(newRow2Tip);

        // transactionDetails.displayList.set("Hash Type", hashType);
        // transactionDetails.displayList.set("Secret", secret);
        // transactionDetails.displayList.set("Proof", proof);
        // transactionDetails.displayList.set("Address", address);

        transactionDetails.relatedAddress.push(addressPlain);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractInnerTransaction(innerTransaction: InnerTransaction): DashboardInnerTransaction {

        let transactionDetails: DashboardInnerTransaction = {
            signer: innerTransaction.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [innerTransaction.signer.publicKey],
            signerAddress: innerTransaction.signer.address.plain(),
            relatedAddress: [innerTransaction.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(innerTransaction.type),
            searchString: [],
            transferList: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [innerTransaction.signer.publicKey]
        };

        let tempData: DashboardInnerTransaction;

        switch (innerTransaction.type) {
            case TransactionType.ADDRESS_ALIAS:
                let addressAliasTx = innerTransaction as AddressAliasTransaction;
                tempData = this.extractTransactionAddressAlias(addressAliasTx);
                break;
            case TransactionType.ADD_EXCHANGE_OFFER:
                let addExchangeOfferTx = innerTransaction as AddExchangeOfferTransaction;
                tempData = this.extractTransactionAddExchangeOffer(addExchangeOfferTx);
                break;
            case TransactionType.CHAIN_CONFIGURE:
                let chainConfigureTx = innerTransaction as ChainConfigTransaction;
                tempData = this.extractTransactionChainConfig(chainConfigureTx);
                break;
            case TransactionType.CHAIN_UPGRADE:
                let chainUpgradeTx = innerTransaction as ChainUpgradeTransaction;
                tempData = this.extractTransactionChainUpgrade(chainUpgradeTx);
                break;
            case TransactionType.EXCHANGE_OFFER:
                let exchangeOfferTx = innerTransaction as ExchangeOfferTransaction;
                tempData = this.extractTransactionExchangeOffer(exchangeOfferTx);
                break;
            case TransactionType.REMOVE_EXCHANGE_OFFER:
                let removeExchangeOfferTx = innerTransaction as RemoveExchangeOfferTransaction;
                tempData = this.extractTransactionRemoveExchangeOffer(removeExchangeOfferTx);
                break;
            case TransactionType.LINK_ACCOUNT:
                let accountLinkTx = innerTransaction as AccountLinkTransaction;
                tempData = this.extractTransactionAccountLink(accountLinkTx);
                break;
            case TransactionType.LOCK:
                let lockFundTx = innerTransaction as LockFundsTransaction;
                tempData = this.extractTransactionLockFunds(lockFundTx);
                break;
            // case TransactionType.MODIFY_ACCOUNT_METADATA:
            //     let modifyAccountMetadataTx = innerTransaction as ModifyMetadataTransaction;
            //     tempData = this.extractTransactionModifyAccountMetadata(modifyAccountMetadataTx);
            //     break;
            // case TransactionType.MODIFY_MOSAIC_METADATA:
            //     let modifyMosaicMetadataTx = innerTransaction as ModifyMetadataTransaction;
            //     tempData = this.extractTransactionModifyMosaicMetadata(modifyMosaicMetadataTx);
            //     break;
            // case TransactionType.MODIFY_NAMESPACE_METADATA:
            //     let modifyNamespaceMetadataTx = innerTransaction as ModifyMetadataTransaction;
            //     tempData = this.extractTransactionModifyNamespaceMetadata(modifyNamespaceMetadataTx);
            //     break;
            case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
                let accAddressModifyTx = innerTransaction as AccountAddressRestrictionModificationTransaction;
                tempData = this.extractTransactionAccountAddressRestriction(accAddressModifyTx);
                break;
            case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
                let accMosaicModifyTx = innerTransaction as AccountMosaicRestrictionModificationTransaction;
                tempData = this.extractTransactionAccountMosaicRestriction(accMosaicModifyTx);
                break;
            case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
                let accOperationModifyTx = innerTransaction as AccountOperationRestrictionModificationTransaction;
                tempData = this.extractTransactionAccountOperationRestriction(accOperationModifyTx);
                break;
            case TransactionType.MODIFY_MULTISIG_ACCOUNT:
                let modifyMultisigAccountTx = innerTransaction as ModifyMultisigAccountTransaction;
                tempData = this.extractTransactionModifyMultisigAccount(modifyMultisigAccountTx);
                break;
            case TransactionType.MOSAIC_ALIAS:
                let mosaicAliasTx = innerTransaction as MosaicAliasTransaction;
                tempData = this.extractTransactionMosaicAlias(mosaicAliasTx);
                break;
            case TransactionType.MOSAIC_DEFINITION:
                let mosaicDefinitionTx = innerTransaction as MosaicDefinitionTransaction;
                tempData = this.extractTransactionMosaicDefinition(mosaicDefinitionTx);
                break;
            case TransactionType.MOSAIC_SUPPLY_CHANGE:
                let mosaicSupplyTx = innerTransaction as MosaicSupplyChangeTransaction;
                tempData = this.extractTransactionMosaicSupplyChange(mosaicSupplyTx);
                break;
            case TransactionType.REGISTER_NAMESPACE:
                let registerNamespaceTx = innerTransaction as RegisterNamespaceTransaction;
                tempData = this.extractTransactionRegisterNamespace(registerNamespaceTx);
                break;
            case TransactionType.SECRET_LOCK:
                let secretLockTx = innerTransaction as SecretLockTransaction;
                tempData = this.extractTransactionSecretLock(secretLockTx);
                break;
            case TransactionType.SECRET_PROOF:
                let secretProofTx = innerTransaction as SecretProofTransaction;
                tempData = this.extractTransactionSecretProof(secretProofTx);
                break;
            case TransactionType.TRANSFER:
                let transferTx = innerTransaction as TransferTransaction;
                tempData = this.extractTransactionTransfer(transferTx);
                break;
            default:
                break;
        }

        transactionDetails.relatedAddress = tempData.relatedAddress;
        transactionDetails.relatedAsset = tempData.relatedAsset;
        transactionDetails.relatedNamespace = tempData.relatedNamespace;
        transactionDetails.relatedPublicKey = tempData.relatedPublicKey;
        transactionDetails.searchString = tempData.searchString;
        transactionDetails.extractedData = tempData.extractedData;
        transactionDetails.displayList = tempData.displayList;
        transactionDetails.transferList = tempData.transferList ? tempData.transferList: [];
        transactionDetails.displayTips = tempData.displayTips;
        transactionDetails.otherAssets = tempData.otherAssets ? tempData.otherAssets: [];

        return transactionDetails;
    }

    addressConvertToName(address: string){
        let name = this.wallet.convertAddressToName(address);
        
        return name === address ? Address.createFromRawAddress(name).pretty() : name;
    }

    publickKeyConvertToName(publicKey: string){
        let address = PublicAccount.createFromPublicKey(publicKey, localNetworkType.value).address.plain();
        let name = this.wallet.convertAddressToName(address);
        
        return name === address ? publicKey : name;
    }

    static createNamespaceIDTip(displayValue: string, value?: string): DashboardTip{
        let newTip = new DashboardTip(TipType.NAMESPACE_ID);
        newTip.displayValue = displayValue;
        newTip.value = value ? value: displayValue;
        return newTip;
    }

    static createNamespaceStringTip(displayValue: string, value?: string): DashboardTip{
        let newTip = new DashboardTip(TipType.NAMESPACE_STR);
        newTip.displayValue = displayValue;
        newTip.value = value ? value: displayValue;
        return newTip;
    }

    static createMsgNamespaceTip(value: string, displayValue: string, pre: string = ""): DashboardTip{
        let newTip = new DashboardTip(TipType.MSG_NAMESPACE);
        newTip.displayValue = pre;
        newTip.value = pre;
        newTip.displayValue2 = displayValue;
        newTip.value2 = value;
        return newTip;
    }

    static createAssetTip(displayValue: string, value?: string): DashboardTip{
        let newTip = new DashboardTip(TipType.ASSET);
        newTip.displayValue = displayValue;
        newTip.value = value ? value: displayValue;
        return newTip;
    }

    static createPublicKeyTip(displayValue: string, value?: string): DashboardTip{
        let newTip = new DashboardTip(TipType.PUBLIC_KEY);
        newTip.displayValue = displayValue;
        newTip.value = value ? value: displayValue;
        return newTip;
    }
    static createPublicKeyStringTip(publicKey:string, displayValue: string, pre: string): DashboardTip{
        let newTip = new DashboardTip(TipType.PUBLIC_KEY_STRING);
        newTip.displayValue = pre;
        newTip.displayValue2 = displayValue;
        newTip.value = pre;
        newTip.value2 = publicKey;
        return newTip;
    }

    static createAddressTip(displayValue: string, value?: string): DashboardTip{
        let newTip = new DashboardTip(TipType.ADDRESS);
        newTip.displayValue = displayValue;
        newTip.value = value ? value: displayValue;
        return newTip;
    }

    static createToRightArrowTip(): DashboardTip{
        let newTip = new DashboardTip(TipType.TO_RIGHT_ARROW);
        return newTip;
    }

    static createAbsoluteAmountTip(amount: number): DashboardTip{
        let newTip = new DashboardTip(TipType.ABSOLUTE_AMOUNT);
        newTip.value = amount.toString();
        newTip.displayValue = Helper.toCurrencyFormat(amount, 0); 
        return newTip;
    }

    static createExactAmountTip(amount: number): DashboardTip{
        let newTip = new DashboardTip(TipType.EXACT_AMOUNT);
        newTip.value = amount.toString();
        newTip.displayValue = Helper.toCurrencyFormat(amount, 0); 
        return newTip;
    }

    static createSimpleStringTip(messageString: string): DashboardTip{
        let newTip = new DashboardTip(TipType.STRING);
        newTip.value = messageString;
        newTip.displayValue = messageString; 
        return newTip;
    }

    static createStringTip(messageString: string, pre: string = "", post: string =""): DashboardTip{
        let newTip = new DashboardTip(TipType.STRING);
        newTip.value = messageString;
        newTip.displayValue = pre + " " + messageString + " " + post; 
        return newTip;
    }

    static createDurationTip(duration: number): DashboardTip{
        let newTip = new DashboardTip(TipType.DURATION);
        newTip.value = duration.toString();
        newTip.displayValue = "Duration: " + duration + " blocks"; 
        return newTip;
    }

    static createTxHashTip(txHash: string): DashboardTip{
        let newTip = new DashboardTip(TipType.HASH);
        newTip.value = txHash;
        newTip.displayValue = "Hash: " + txHash; 
        return newTip;
    }

    static createAssetAmountTip(amount: number, assetId: string, assetDisplay: string, amountExact: boolean, divisibility: number = 0): DashboardTip{
        let newTip = new DashboardTip(TipType.ASSET_AMOUNT);
        newTip.value = amount.toString();
        newTip.value2 = assetId;
        newTip.displayValue = amountExact ? Helper.toCurrencyFormat(amount, divisibility) : amount.toString();
        newTip.displayValue2 = assetDisplay;
        newTip.valueType = amountExact ? AmountType.EXACT: AmountType.RAW;

        return newTip;
    }

    static createSupplyAmountTip(amount: number, amountExact: boolean, increase: boolean): DashboardTip{
        let newTip = new DashboardTip(TipType.SUPPLY_AMOUNT);
        newTip.value = increase ? "+": "-";
        newTip.value2 = amount.toString();
        newTip.displayValue = newTip.value;
        newTip.displayValue2 = amount.toString();
        newTip.valueType2= amountExact ? AmountType.EXACT: AmountType.RAW;

        return newTip;
    }

    static createSupplyAssetAmountTip(amount: number, amountExact: boolean, assetDisplay: string, assetId: string, increase: boolean): DashboardTip{
        let newTip = new DashboardTip(TipType.SUPPLY_ASSET_AMOUNT);
        newTip.value = increase ? amount.toString(): "-" + amount.toString();
        newTip.value2 = assetId;
        newTip.displayValue = increase ? "+" + amount.toString() : newTip.value;
        newTip.displayValue2 = assetDisplay;
        newTip.valueType= amountExact ? AmountType.EXACT: AmountType.RAW;

        return newTip;
    }

    static createNamespaceAmountTip(amount: number, namespaceId: string, namespaceDisplay: string, amountExact: boolean = false): DashboardTip{
        let newTip = new DashboardTip(TipType.NAMESPACE_AMOUNT);
        newTip.value = amount.toString();
        newTip.value2 = namespaceId;
        newTip.displayValue = amount.toString();
        newTip.displayValue2 = namespaceDisplay;
        newTip.valueType = amountExact ? AmountType.EXACT: AmountType.RAW;

        return newTip;
    }

    static createTransferTip(addressFrom: string, addressFromDisplay: string, addressTo: string, addressToDisplay): DashboardTip{
        let newTip = new DashboardTip(TipType.TRANSFER);
        newTip.value = addressFrom;
        newTip.value2 = addressTo;
        newTip.displayValue = addressFromDisplay;
        newTip.displayValue2 = addressToDisplay;

        return newTip;
    }

    static createTransferUnresolvedTip(addressFrom: string, addressFromDisplay: string, addressTo: string, addressToDisplay): DashboardTip{
        let newTip = new DashboardTip(TipType.TRANSFER_UNRESOLVED);
        newTip.value = addressFrom;
        newTip.value2 = addressTo;
        newTip.displayValue = addressFromDisplay;
        newTip.displayValue2 = addressToDisplay;

        return newTip;
    }

    static createAssetAliasTip(namespaceId: string, namespaceDisplay: string, assetId: string, assetDisplay: string): DashboardTip{
        let newTip = new DashboardTip(TipType.ASSET_ALIAS);
        newTip.value = namespaceId;
        newTip.value2 = assetId;
        newTip.displayValue = namespaceDisplay;
        newTip.displayValue2 = assetDisplay;

        return newTip;
    }

    static createRemoveAssetAliasTip(namespaceId: string, namespaceDisplay: string, assetId: string, assetDisplay: string): DashboardTip{
        let newTip = new DashboardTip(TipType.REMOVE_ASSET_ALIAS);
        newTip.value = namespaceId;
        newTip.value2 = assetId;
        newTip.displayValue = namespaceDisplay;
        newTip.displayValue2 = assetDisplay;

        return newTip;
    }

    static createAddressAliasTip(namespaceId: string, namespaceDisplay: string, address: string, addressDisplay: string): DashboardTip{
        let newTip = new DashboardTip(TipType.ADDRESS_ALIAS);
        newTip.value = namespaceId;
        newTip.value2 = address;
        newTip.displayValue = namespaceDisplay;
        newTip.displayValue2 = addressDisplay;

        return newTip;
    }

    static createRemoveAddressAliasTip(namespaceId: string, namespaceDisplay: string, address: string, addressDisplay: string): DashboardTip{
        let newTip = new DashboardTip(TipType.REMOVE_ADDRESS_ALIAS);
        newTip.value = namespaceId;
        newTip.value2 = address;
        newTip.displayValue = namespaceDisplay;
        newTip.displayValue2 = addressDisplay;

        return newTip;
    }

    static createAccountLinkTip(publicKey: string, publicKeyDisplay): DashboardTip{
        let newTip = new DashboardTip(TipType.LINK_PUBLICKEY);
        newTip.value = publicKey;
        newTip.displayValue = publicKeyDisplay;

        return newTip;
    }

    static createAccountUnlinkTip(publicKey: string, publicKeyDisplay): DashboardTip{
        let newTip = new DashboardTip(TipType.UNLINK_PUBLICKEY);
        newTip.value = publicKey;
        newTip.displayValue = publicKeyDisplay;

        return newTip;
    }

    static convertToExactNativeAmount(amount: number){
        if(nativeTokenDivisibility.value === 0){
            return amount;
        }
        return amount > 0 ? amount / Math.pow(10, nativeTokenDivisibility.value) : 0;
    }

    static convertToExactAmount(amount: number, divisibility: number){
        if(divisibility === 0){
            return amount;
        }
        return amount > 0 ? amount / Math.pow(10, divisibility) : 0;
    }

    static displayOtherAsset = (amount: number, assetId: string, mosaic_id: MosaicId) => {
        // let apiEndpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort);
        // let chainAPICall = new ChainAPICall(apiEndpoint);
        // let asset = await chainAPICall.assetAPI.getMosaic(mosaic_id);

        // let assetarray = []
        // assetarray.push(mosaic_id);
        // let nsAsset = await chainAPICall.assetAPI.getMosaicsNames(assetarray);

        let otherAsset = new OtherAsset();
        otherAsset.amount = amount;
        otherAsset.asset = assetId;
        otherAsset.assetId = mosaic_id;
        // if(nsAsset[0].names.length > 0){
        //     otherAsset.isLinked = true;
        //     otherAsset.asset = nsAsset[0].names[0].name;
        // }else{
        //     otherAsset.isLinked = false;
        //     otherAsset.asset = assetId;
        // }
        return otherAsset;
    }
}

