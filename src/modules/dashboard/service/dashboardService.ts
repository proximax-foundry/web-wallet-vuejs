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
    ModifyMetadataTransaction,
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
    CosignatureSignedTransaction
} from "tsjs-xpx-chain-sdk";
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
import { DashboardTip, DashboardTipList, RowDashboardTip, TipType, AmountType, OtherAsset } from "../model/dashboardClasses"

const networkAPIEndpoint = computed(() => ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));
const localNetworkType = computed(() => ChainUtils.getNetworkType(networkState.currentNetworkProfile?.network.type));
const namespaceIdFirstCharacterString = "89ABCDEF";
const nativeTokenName = computed(()=> networkState.currentNetworkProfile?.network.currency.name);
const nativeTokenAssetId = computed(()=> networkState.currentNetworkProfile?.network.currency.assetId);
const nativeTokenNamespaceId = computed(()=> networkState.currentNetworkProfile?.network.currency.namespaceId);
const nativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile?.network.currency.divisibility);

export class DashboardService {

    wallet: Wallet;

    constructor(wallet: Wallet){
        this.wallet = wallet;
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

        let publicAccount = Helper.createPublicAccount(account.publicKey, localNetworkType.value);

        let fullTransaction: Transaction[] = [];
        let queryParams = Helper.createQueryParams(100);

        let transactions: Transaction[] = await TransactionUtils.getTransactions(publicAccount, queryParams);
        
        fullTransaction = fullTransaction.concat(transactions);

        while (transactions.length === 100) {
            let lastId = transactions[transactions.length - 1].transactionInfo.id;
            queryParams = Helper.createQueryParams(100, lastId);
            transactions = await TransactionUtils.getTransactions(publicAccount, queryParams);
            fullTransaction = fullTransaction.concat(transactions);
        }

        return fullTransaction;
    }

    static async getAccountAllUnconfirmedTransactions(account: myAccount): Promise<Transaction[]>{

        let publicAccount = Helper.createPublicAccount(account.publicKey, localNetworkType.value);

        let fullTransaction: Transaction[] = [];
        let queryParams = Helper.createQueryParams(100);

        let transactions: Transaction[] = await TransactionUtils.getUnconfirmedTransactions(publicAccount, queryParams);
        
        fullTransaction = fullTransaction.concat(transactions);

        while (transactions.length === 100) {
            let lastId = transactions[transactions.length - 1].transactionInfo.id;
            queryParams = Helper.createQueryParams(100, lastId);
            transactions = await TransactionUtils.getUnconfirmedTransactions(publicAccount, queryParams);
            fullTransaction = fullTransaction.concat(transactions);
        }

        return fullTransaction;
    }

    static async getAccountAllPartialTransactions(account: myAccount): Promise<Transaction[]>{

        let publicAccount = Helper.createPublicAccount(account.publicKey, localNetworkType.value);

        let fullTransaction: Transaction[] = [];
        let queryParams = Helper.createQueryParams(100);

        let transactions: Transaction[] = await TransactionUtils.getPartialTransactions(publicAccount, queryParams);
        
        fullTransaction = fullTransaction.concat(transactions);

        while (transactions.length === 100) {
            let lastId = transactions[transactions.length - 1].transactionInfo.id;
            queryParams = Helper.createQueryParams(100, lastId);
            transactions = await TransactionUtils.getPartialTransactions(publicAccount, queryParams);
            fullTransaction = fullTransaction.concat(transactions);
        }

        return fullTransaction;
    }

    async fetchConfirmedTransactions(){

        let transactions = await this.getAllAccountTransactions();
        let dashboardTransactions: DashboardTransaction[] = this.formatConfirmedTransaction(transactions);
        return dashboardTransactions;
    }

    async fetchUnconfirmedTransactions(){

        let transactions = await this.getAllAccountUnconfirmedTransactions();

        let dashboardTransactions: DashboardTransaction[] = this.formatUnconfirmedTransaction(transactions);
        return dashboardTransactions;
    }

    async fetchPartialTransactions(){

        let transactions = await this.getAllAccountPartialTransactions();

        let dashboardTransactions: DashboardTransaction[] = this.formatUnconfirmedTransaction(transactions);
        return { txns: transactions, formatted: dashboardTransactions};
    }

    formatConfirmedWithTransaction(txs: Transaction[]){
        let dashboardTransactions: DashboardTransaction[] = this.formatConfirmedTransaction(txs);
        return dashboardTransactions;
    }

    formatUnconfirmedWithTransaction(txs: Transaction[]){
        let dashboardTransactions: DashboardTransaction[] = this.formatUnconfirmedTransaction(txs);
        return dashboardTransactions;
    }

    formatConfirmedTransaction(transactions: Transaction[]): DashboardTransaction[] {
        let formattedTransactions: DashboardTransaction[] = [];

        for (let i = 0; i < transactions.length; ++i) {

            let dashboardTransaction: DashboardTransaction = {
                id: transactions[i].transactionInfo.id,
                typeName: TransactionUtils.getTransactionTypeName(transactions[i].type),
                signer: transactions[i].signer.publicKey,
                size: transactions[i].size,
                signerAddress: transactions[i].signer.address.plain(),
                signerAddressPretty: transactions[i].signer.address.pretty(),
                signerDisplay: this.addressConvertToName(transactions[i].signer.address.plain()),
                hash: transactions[i].transactionInfo.hash,
                block: transactions[i].transactionInfo.height.compact(),
                formattedDeadline: Helper.convertDisplayDateTimeFormatShort(transactions[i].deadline.value.toString()),
                relatedAddress: [],
                relatedAsset: [],
                relatedNamespace: [],
                relatedPublicKey: [],
                searchString: [],
                extractedData: {},
                displayList: new Map<string, string>(),
                transferList: [],
                displayTips: [],
                cosignatures: null,
                signedPublicKeys: [transactions[i].signer.publicKey],
                maxFee: Helper.convertToExact(transactions[i].maxFee.compact(), 6),
                otherAssets: [],
            };
            dashboardTransaction.searchString.push(dashboardTransaction.block.toString());
            dashboardTransaction.searchString.push(dashboardTransaction.hash);

            // dashboardTransaction.relatedAddress.push(transactions[i].signer.address.plain());
            // dashboardTransaction.relatedPublicKey.push(dashboardTransaction.signer);

            let tempData: DashboardInnerTransaction;
            let totalLength: number = 1;

            switch (transactions[i].type) {
                case TransactionType.ADDRESS_ALIAS:
                    let addressAliasTx = transactions[i] as AddressAliasTransaction;
                    tempData = this.extractTransactionAddressAlias(addressAliasTx);
                    break;
                case TransactionType.ADD_EXCHANGE_OFFER:
                    let addExchangeOfferTx = transactions[i] as AddExchangeOfferTransaction;
                    tempData = this.extractTransactionAddExchangeOffer(addExchangeOfferTx);
                    break;
                case TransactionType.AGGREGATE_BONDED:
                    let aggregateBondedTx = transactions[i] as AggregateTransaction;
                    if(aggregateBondedTx.cosignatures.length){
                        dashboardTransaction.cosignatures = { 
                            cosigners: aggregateBondedTx.cosignatures.map(
                                (x)=> { return { publicKey: x.signer.publicKey, address: x.signer.address.plain()}}
                            )
                        };
                        dashboardTransaction.signedPublicKeys = dashboardTransaction.signedPublicKeys.concat(dashboardTransaction.cosignatures.cosigners.map(x => x.publicKey));
                    }   
                    totalLength = aggregateBondedTx.innerTransactions.length;
                    dashboardTransaction.innerTransactions = [];
                    tempData = {
                        signer: aggregateBondedTx.signer.publicKey,
                        relatedAsset: [],
                        relatedNamespace: [],
                        relatedPublicKey: [],
                        signerAddress: aggregateBondedTx.signer.address.plain(),
                        relatedAddress: [],
                        typeName: TransactionUtils.getTransactionTypeName(aggregateBondedTx.type),
                        searchString: [],
                        extractedData: {},
                        displayList: new Map<string, string>(),
                        transferList: [],
                        displayTips: [],
                        signerPublicKeys: [aggregateBondedTx.signer.publicKey]
                    };

                    for (let y = 0; y < totalLength; ++y) {
                        let tempInnerData = this.extractInnerTransaction(aggregateBondedTx.innerTransactions[y]);

                        tempData.relatedAddress = tempData.relatedAddress.concat(tempInnerData.relatedAddress);
                        tempData.relatedAsset = tempData.relatedAsset.concat(tempInnerData.relatedAsset);
                        tempData.relatedNamespace = tempData.relatedNamespace.concat(tempInnerData.relatedNamespace);
                        tempData.relatedPublicKey = tempData.relatedPublicKey.concat(tempInnerData.relatedPublicKey);
                        tempData.searchString = tempData.searchString.concat(tempInnerData.searchString);

                        dashboardTransaction.innerTransactions.push(tempInnerData);
                    }
                    break;
                case TransactionType.AGGREGATE_COMPLETE:
                    let aggregateCompleteTx = transactions[i] as AggregateTransaction;
                    if(aggregateCompleteTx.cosignatures.length){
                        dashboardTransaction.cosignatures = { 
                            cosigners: aggregateCompleteTx.cosignatures.map(
                                (x)=> { return { publicKey: x.signer.publicKey, address: x.signer.address.plain()}}
                            )
                        };
                        dashboardTransaction.signedPublicKeys = dashboardTransaction.signedPublicKeys.concat(dashboardTransaction.cosignatures.cosigners.map(x => x.publicKey));
                    }     
                    totalLength = aggregateCompleteTx.innerTransactions.length;
                    dashboardTransaction.innerTransactions = [];

                    tempData = {
                        signer: aggregateCompleteTx.signer.publicKey,
                        relatedAsset: [],
                        relatedNamespace: [],
                        relatedPublicKey: [],
                        signerAddress: aggregateCompleteTx.signer.address.plain(),
                        relatedAddress: [],
                        typeName: TransactionUtils.getTransactionTypeName(aggregateCompleteTx.type),
                        searchString: [],
                        extractedData: {},
                        displayList: new Map<string, string>(),
                        displayTips: [],
                        signerPublicKeys: [aggregateCompleteTx.signer.publicKey]
                    };

                    for (let x = 0; x < totalLength; ++x) {
                        let tempInnerData = this.extractInnerTransaction(aggregateCompleteTx.innerTransactions[x]);

                        tempData.relatedAddress = tempData.relatedAddress.concat(tempInnerData.relatedAddress);
                        tempData.relatedAsset = tempData.relatedAsset.concat(tempInnerData.relatedAsset);
                        tempData.relatedNamespace = tempData.relatedNamespace.concat(tempInnerData.relatedNamespace);
                        tempData.relatedPublicKey = tempData.relatedPublicKey.concat(tempInnerData.relatedPublicKey);
                        tempData.searchString = tempData.searchString.concat(tempInnerData.searchString);

                        dashboardTransaction.innerTransactions.push(tempInnerData);
                    }
                    break;
                case TransactionType.CHAIN_CONFIGURE:
                    let chainConfigureTx = transactions[i] as ChainConfigTransaction;
                    tempData = this.extractTransactionChainConfig(chainConfigureTx);
                    break;
                case TransactionType.CHAIN_UPGRADE:
                    let chainUpgradeTx = transactions[i] as ChainUpgradeTransaction;
                    tempData = this.extractTransactionChainUpgrade(chainUpgradeTx);
                    break;
                case TransactionType.EXCHANGE_OFFER:
                    let exchangeOfferTx = transactions[i] as ExchangeOfferTransaction;
                    tempData = this.extractTransactionExchangeOffer(exchangeOfferTx);
                    break;
                case TransactionType.REMOVE_EXCHANGE_OFFER:
                    let removeExchangeOfferTx = transactions[i] as RemoveExchangeOfferTransaction;
                    tempData = this.extractTransactionRemoveExchangeOffer(removeExchangeOfferTx);
                    break;
                case TransactionType.LINK_ACCOUNT:
                    let accountLinkTx = transactions[i] as AccountLinkTransaction;
                    tempData = this.extractTransactionAccountLink(accountLinkTx);
                    break;
                case TransactionType.LOCK:
                    let lockFundTx = transactions[i] as LockFundsTransaction;
                    tempData = this.extractTransactionLockFunds(lockFundTx);
                    break;
                case TransactionType.MODIFY_ACCOUNT_METADATA:
                    let modifyAccountMetadataTx = transactions[i] as ModifyMetadataTransaction;
                    tempData = this.extractTransactionModifyAccountMetadata(modifyAccountMetadataTx);
                    break;
                case TransactionType.MODIFY_MOSAIC_METADATA:
                    let modifyMosaicMetadataTx = transactions[i] as ModifyMetadataTransaction;
                    tempData = this.extractTransactionModifyMosaicMetadata(modifyMosaicMetadataTx);
                    break;
                case TransactionType.MODIFY_NAMESPACE_METADATA:
                    let modifyNamespaceMetadataTx = transactions[i] as ModifyMetadataTransaction;
                    tempData = this.extractTransactionModifyNamespaceMetadata(modifyNamespaceMetadataTx);
                    break;
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
                    let accAddressModifyTx = transactions[i] as AccountAddressRestrictionModificationTransaction;
                    tempData = this.extractTransactionAccountAddressRestriction(accAddressModifyTx);
                    break;
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
                    let accMosaicModifyTx = transactions[i] as AccountMosaicRestrictionModificationTransaction;
                    tempData = this.extractTransactionAccountMosaicRestriction(accMosaicModifyTx);
                    break;
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
                    let accOperationModifyTx = transactions[i] as AccountOperationRestrictionModificationTransaction;
                    tempData = this.extractTransactionAccountOperationRestriction(accOperationModifyTx);
                    break;
                case TransactionType.MODIFY_MULTISIG_ACCOUNT:
                    let modifyMultisigAccountTx = transactions[i] as ModifyMultisigAccountTransaction;
                    tempData = this.extractTransactionModifyMultisigAccount(modifyMultisigAccountTx);
                    break;
                case TransactionType.MOSAIC_ALIAS:
                    let mosaicAliasTx = transactions[i] as MosaicAliasTransaction;
                    tempData = this.extractTransactionMosaicAlias(mosaicAliasTx);
                    break;
                case TransactionType.MOSAIC_DEFINITION:
                    let mosaicDefinitionTx = transactions[i] as MosaicDefinitionTransaction;
                    tempData = this.extractTransactionMosaicDefinition(mosaicDefinitionTx);
                    break;
                case TransactionType.MOSAIC_SUPPLY_CHANGE:
                    let mosaicSupplyTx = transactions[i] as MosaicSupplyChangeTransaction;
                    tempData = this.extractTransactionMosaicSupplyChange(mosaicSupplyTx);
                    break;
                case TransactionType.REGISTER_NAMESPACE:
                    let registerNamespaceTx = transactions[i] as RegisterNamespaceTransaction;
                    tempData = this.extractTransactionRegisterNamespace(registerNamespaceTx);
                    break;
                case TransactionType.SECRET_LOCK:
                    let secretLockTx = transactions[i] as SecretLockTransaction;
                    tempData = this.extractTransactionSecretLock(secretLockTx);
                    break;
                case TransactionType.SECRET_PROOF:
                    let secretProofTx = transactions[i] as SecretProofTransaction;
                    tempData = this.extractTransactionSecretProof(secretProofTx);
                    break;
                case TransactionType.TRANSFER:
                    let transferTx = transactions[i] as TransferTransaction;
                    tempData = this.extractTransactionTransfer(transferTx);
                    break;
                default:
                    break;
            }

            dashboardTransaction.relatedAddress = dashboardTransaction.relatedAddress.concat(tempData.relatedAddress);
            dashboardTransaction.relatedAsset = dashboardTransaction.relatedAsset.concat(tempData.relatedAsset);
            dashboardTransaction.relatedNamespace = dashboardTransaction.relatedNamespace.concat(tempData.relatedNamespace);
            dashboardTransaction.relatedPublicKey = dashboardTransaction.relatedPublicKey.concat(tempData.relatedPublicKey);
            dashboardTransaction.searchString = dashboardTransaction.searchString.concat(tempData.searchString);
            dashboardTransaction.extractedData = tempData.extractedData;
            dashboardTransaction.displayList = tempData.displayList;
            dashboardTransaction.transferList = tempData.transferList ? tempData.transferList: [];
            dashboardTransaction.displayTips = tempData.displayTips;
            dashboardTransaction.otherAssets = tempData.otherAssets;

            dashboardTransaction.relatedAddress = Array.from(new Set(dashboardTransaction.relatedAddress));
            dashboardTransaction.relatedAsset = Array.from(new Set(dashboardTransaction.relatedAsset));
            dashboardTransaction.relatedNamespace = Array.from(new Set(dashboardTransaction.relatedNamespace));
            dashboardTransaction.relatedPublicKey = Array.from(new Set(dashboardTransaction.relatedPublicKey));
            dashboardTransaction.searchString = Array.from(new Set(dashboardTransaction.searchString));

            formattedTransactions.push(dashboardTransaction);
        }

        return formattedTransactions;
    }

    formatUnconfirmedTransaction(transactions: Transaction[]): DashboardTransaction[] {
        let formattedTransactions: DashboardTransaction[] = [];

        for (let i = 0; i < transactions.length; ++i) {
            let dashboardTransaction: DashboardTransaction = {
                id: transactions[i].transactionInfo.id,
                typeName: TransactionUtils.getTransactionTypeName(transactions[i].type),
                signer: transactions[i].signer.publicKey,
                size: transactions[i].size,
                signerAddress: transactions[i].signer.address.plain(),
                signerAddressPretty: transactions[i].signer.address.pretty(),
                signerDisplay: this.addressConvertToName(transactions[i].signer.address.plain()),
                hash: transactions[i].transactionInfo.hash,
                formattedDeadline: Helper.convertDisplayDateTimeFormat(transactions[i].deadline.value.toString()),
                relatedAddress: [],
                relatedAsset: [],
                relatedNamespace: [],
                relatedPublicKey: [],
                searchString: [],
                extractedData: {},
                displayList: new Map<string, string>(),
                transferList: [],
                displayTips: [],
                cosignatures: null,
                signedPublicKeys: [transactions[i].signer.publicKey],
                otherAssets: []
            };

            dashboardTransaction.searchString.push(dashboardTransaction.hash);

            // dashboardTransaction.relatedAddress.push(transactions[i].signer.address.plain());
            // dashboardTransaction.relatedPublicKey.push(dashboardTransaction.signer);

            let tempData: DashboardInnerTransaction;
            let totalLength: number = 1;

            switch (transactions[i].type) {
                case TransactionType.ADDRESS_ALIAS:
                    let addressAliasTx = transactions[i] as AddressAliasTransaction;
                    tempData = this.extractTransactionAddressAlias(addressAliasTx);
                    break;
                case TransactionType.ADD_EXCHANGE_OFFER:
                    let addExchangeOfferTx = transactions[i] as AddExchangeOfferTransaction;
                    tempData = this.extractTransactionAddExchangeOffer(addExchangeOfferTx);
                    break;
                case TransactionType.AGGREGATE_BONDED:
                    let aggregateBondedTx = transactions[i] as AggregateTransaction;
                    if(aggregateBondedTx.cosignatures.length){
                        dashboardTransaction.cosignatures = { 
                            cosigners: aggregateBondedTx.cosignatures.map(
                                (x)=> { return { publicKey: x.signer.publicKey, address: x.signer.address.plain()}}
                            )
                        };
                        dashboardTransaction.signedPublicKeys = dashboardTransaction.signedPublicKeys.concat(dashboardTransaction.cosignatures.cosigners.map(x => x.publicKey));
                    }
                    totalLength = aggregateBondedTx.innerTransactions.length;
                    dashboardTransaction.innerTransactions = [];
                    tempData = {
                        signer: aggregateBondedTx.signer.publicKey,
                        relatedAsset: [],
                        relatedNamespace: [],
                        relatedPublicKey: [],
                        signerAddress: aggregateBondedTx.signer.address.plain(),
                        relatedAddress: [],
                        typeName: TransactionUtils.getTransactionTypeName(aggregateBondedTx.type),
                        searchString: [],
                        extractedData: {},
                        displayList: new Map<string, string>(),
                        transferList: [],
                        displayTips: [],
                        signerPublicKeys: [aggregateBondedTx.signer.publicKey]
                    };

                    for (let y = 0; y < totalLength; ++y) {
                        let tempInnerData = this.extractInnerTransaction(aggregateBondedTx.innerTransactions[y]);

                        tempData.relatedAddress = tempData.relatedAddress.concat(tempInnerData.relatedAddress);
                        tempData.relatedAsset = tempData.relatedAsset.concat(tempInnerData.relatedAsset);
                        tempData.relatedNamespace = tempData.relatedNamespace.concat(tempInnerData.relatedNamespace);
                        tempData.relatedPublicKey = tempData.relatedPublicKey.concat(tempInnerData.relatedPublicKey);
                        tempData.searchString = tempData.searchString.concat(tempInnerData.searchString);

                        dashboardTransaction.innerTransactions.push(tempInnerData);
                    }
                    break;
                case TransactionType.AGGREGATE_COMPLETE:
                    let aggregateCompleteTx = transactions[i] as AggregateTransaction;
                    if(aggregateCompleteTx.cosignatures.length){
                        dashboardTransaction.cosignatures = { 
                            cosigners: aggregateCompleteTx.cosignatures.map(
                                (x)=> { return { publicKey: x.signer.publicKey, address: x.signer.address.plain()}}
                            )
                        };
                        dashboardTransaction.signedPublicKeys = dashboardTransaction.signedPublicKeys.concat(dashboardTransaction.cosignatures.cosigners.map(x => x.publicKey));
                    }
                    totalLength = aggregateCompleteTx.innerTransactions.length;
                    dashboardTransaction.innerTransactions = [];

                    tempData = {
                        signer: aggregateCompleteTx.signer.publicKey,
                        relatedAsset: [],
                        relatedNamespace: [],
                        relatedPublicKey: [],
                        signerAddress: aggregateCompleteTx.signer.address.plain(),
                        relatedAddress: [],
                        typeName: TransactionUtils.getTransactionTypeName(aggregateCompleteTx.type),
                        searchString: [],
                        extractedData: {},
                        displayList: new Map<string, string>(),
                        displayTips: [],
                        signerPublicKeys: [aggregateCompleteTx.signer.publicKey]
                    };

                    for (let x = 0; x < totalLength; ++x) {
                        let tempInnerData = this.extractInnerTransaction(aggregateCompleteTx.innerTransactions[x]);

                        tempData.relatedAddress = tempData.relatedAddress.concat(tempInnerData.relatedAddress);
                        tempData.relatedAsset = tempData.relatedAsset.concat(tempInnerData.relatedAsset);
                        tempData.relatedNamespace = tempData.relatedNamespace.concat(tempInnerData.relatedNamespace);
                        tempData.relatedPublicKey = tempData.relatedPublicKey.concat(tempInnerData.relatedPublicKey);
                        tempData.searchString = tempData.searchString.concat(tempInnerData.searchString);

                        dashboardTransaction.innerTransactions.push(tempInnerData);
                    }
                    break;
                case TransactionType.CHAIN_CONFIGURE:
                    let chainConfigureTx = transactions[i] as ChainConfigTransaction;
                    tempData = this.extractTransactionChainConfig(chainConfigureTx);
                    break;
                case TransactionType.CHAIN_UPGRADE:
                    let chainUpgradeTx = transactions[i] as ChainUpgradeTransaction;
                    tempData = this.extractTransactionChainUpgrade(chainUpgradeTx);
                    break;
                case TransactionType.EXCHANGE_OFFER:
                    let exchangeOfferTx = transactions[i] as ExchangeOfferTransaction;
                    tempData = this.extractTransactionExchangeOffer(exchangeOfferTx);
                    break;
                case TransactionType.REMOVE_EXCHANGE_OFFER:
                    let removeExchangeOfferTx = transactions[i] as RemoveExchangeOfferTransaction;
                    tempData = this.extractTransactionRemoveExchangeOffer(removeExchangeOfferTx);
                    break;
                case TransactionType.LINK_ACCOUNT:
                    let accountLinkTx = transactions[i] as AccountLinkTransaction;
                    tempData = this.extractTransactionAccountLink(accountLinkTx);
                    break;
                case TransactionType.LOCK:
                    let lockFundTx = transactions[i] as LockFundsTransaction;
                    tempData = this.extractTransactionLockFunds(lockFundTx);
                    break;
                case TransactionType.MODIFY_ACCOUNT_METADATA:
                    let modifyAccountMetadataTx = transactions[i] as ModifyMetadataTransaction;
                    tempData = this.extractTransactionModifyAccountMetadata(modifyAccountMetadataTx);
                    break;
                case TransactionType.MODIFY_MOSAIC_METADATA:
                    let modifyMosaicMetadataTx = transactions[i] as ModifyMetadataTransaction;
                    tempData = this.extractTransactionModifyMosaicMetadata(modifyMosaicMetadataTx);
                    break;
                case TransactionType.MODIFY_NAMESPACE_METADATA:
                    let modifyNamespaceMetadataTx = transactions[i] as ModifyMetadataTransaction;
                    tempData = this.extractTransactionModifyNamespaceMetadata(modifyNamespaceMetadataTx);
                    break;
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS:
                    let accAddressModifyTx = transactions[i] as AccountAddressRestrictionModificationTransaction;
                    tempData = this.extractTransactionAccountAddressRestriction(accAddressModifyTx);
                    break;
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC:
                    let accMosaicModifyTx = transactions[i] as AccountMosaicRestrictionModificationTransaction;
                    tempData = this.extractTransactionAccountMosaicRestriction(accMosaicModifyTx);
                    break;
                case TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION:
                    let accOperationModifyTx = transactions[i] as AccountOperationRestrictionModificationTransaction;
                    tempData = this.extractTransactionAccountOperationRestriction(accOperationModifyTx);
                    break;
                case TransactionType.MODIFY_MULTISIG_ACCOUNT:
                    let modifyMultisigAccountTx = transactions[i] as ModifyMultisigAccountTransaction;
                    tempData = this.extractTransactionModifyMultisigAccount(modifyMultisigAccountTx);
                    break;
                case TransactionType.MOSAIC_ALIAS:
                    let mosaicAliasTx = transactions[i] as MosaicAliasTransaction;
                    tempData = this.extractTransactionMosaicAlias(mosaicAliasTx);
                    break;
                case TransactionType.MOSAIC_DEFINITION:
                    let mosaicDefinitionTx = transactions[i] as MosaicDefinitionTransaction;
                    tempData = this.extractTransactionMosaicDefinition(mosaicDefinitionTx);
                    break;
                case TransactionType.MOSAIC_SUPPLY_CHANGE:
                    let mosaicSupplyTx = transactions[i] as MosaicSupplyChangeTransaction;
                    tempData = this.extractTransactionMosaicSupplyChange(mosaicSupplyTx);
                    break;
                case TransactionType.REGISTER_NAMESPACE:
                    let registerNamespaceTx = transactions[i] as RegisterNamespaceTransaction;
                    tempData = this.extractTransactionRegisterNamespace(registerNamespaceTx);
                    break;
                case TransactionType.SECRET_LOCK:
                    let secretLockTx = transactions[i] as SecretLockTransaction;
                    tempData = this.extractTransactionSecretLock(secretLockTx);
                    break;
                case TransactionType.SECRET_PROOF:
                    let secretProofTx = transactions[i] as SecretProofTransaction;
                    tempData = this.extractTransactionSecretProof(secretProofTx);
                    break;
                case TransactionType.TRANSFER:
                    let transferTx = transactions[i] as TransferTransaction;
                    tempData = this.extractTransactionTransfer(transferTx);
                    break;
                default:
                    break;
            }

            dashboardTransaction.relatedAddress = dashboardTransaction.relatedAddress.concat(tempData.relatedAddress);
            dashboardTransaction.relatedAsset = dashboardTransaction.relatedAsset.concat(tempData.relatedAsset);
            dashboardTransaction.relatedNamespace = dashboardTransaction.relatedNamespace.concat(tempData.relatedNamespace);
            dashboardTransaction.relatedPublicKey = dashboardTransaction.relatedPublicKey.concat(tempData.relatedPublicKey);
            dashboardTransaction.searchString = dashboardTransaction.searchString.concat(tempData.searchString);
            dashboardTransaction.extractedData = tempData.extractedData;
            dashboardTransaction.displayList = tempData.displayList;
            dashboardTransaction.transferList = tempData.transferList ? tempData.transferList: [];
            dashboardTransaction.displayTips = tempData.displayTips;

            dashboardTransaction.relatedAddress = Array.from(new Set(dashboardTransaction.relatedAddress));
            dashboardTransaction.relatedAsset = Array.from(new Set(dashboardTransaction.relatedAsset));
            dashboardTransaction.relatedNamespace = Array.from(new Set(dashboardTransaction.relatedNamespace));
            dashboardTransaction.relatedPublicKey = Array.from(new Set(dashboardTransaction.relatedPublicKey));
            dashboardTransaction.searchString = Array.from(new Set(dashboardTransaction.searchString));

            formattedTransactions.push(dashboardTransaction);
        }

        return formattedTransactions;
    }

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

                if(Array.from(namespaceIdFirstCharacterString).includes(mosaicIdHex.substr(0, 1)) ){
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

                if(mosaicIdHex == networkState.currentNetworkProfile.network.currency.assetId.toUpperCase()){
                    txnAmount = transferTx.mosaics[i].amount.compact();
                }

                let resolved = false;

                if(mosaicIdHex.toUpperCase() === nativeTokenAssetId.value.toUpperCase() || mosaicIdHex.toUpperCase() === nativeTokenNamespaceId.value.toUpperCase()){
                    newTransfer.value = nativeTokenAssetId.value.toUpperCase();
                    valueType = "asset";
                    newTransfer.valueDisplay = "XPX";
                    newTransfer.amount = newTransfer.amount / Math.pow(10, nativeTokenDivisibility.value);
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
                        (async() => {
                            let otherAsset = await DashboardService.displayOtherAsset(newTransfer.amount, newTransfer.value, transferTx.mosaics[i].id);
                            transactionDetails.otherAssets.push(otherAsset);
                        })();
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

            let exactAmount: number = cost/ Math.pow(10, nativeTokenDivisibility.value);

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

            let exactAmount: number = cost/ Math.pow(10, nativeTokenDivisibility.value);

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

    extractTransactionModifyAccountMetadata(modifyAccountMetadataTx: ModifyMetadataTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: modifyAccountMetadataTx.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [modifyAccountMetadataTx.signer.publicKey],
            signerAddress: modifyAccountMetadataTx.signer.address.plain(),
            relatedAddress: [modifyAccountMetadataTx.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(modifyAccountMetadataTx.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [modifyAccountMetadataTx.signer.publicKey]
        };

        let metadataId = modifyAccountMetadataTx.metadataId;
        let metadataType = "Address";

        let modifications = [];
        let modificationsTip: DashboardTip[] = [];

        for (let i = 0; i < modifyAccountMetadataTx.modifications.length; ++i) {
            let key = modifyAccountMetadataTx.modifications[i].key;
            let type = modifyAccountMetadataTx.modifications[i].type === 0 ? "Add" : "Remove";
            let value = modifyAccountMetadataTx.modifications[i].value;

            modifications.push({
                key: key,
                value: value,
                type: type
            });

            modificationsTip.push(DashboardService.createSimpleStringTip(`${type}-${key}:${value}`));
        }

        let data = {
            metadataId: metadataId,
            metadataType: metadataType,
            modifications: modifications
        };

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();
            
        let metadataIdTip = DashboardService.createStringTip(data.metadataId, "Metadata ID:");
        let metadataTypeTip = DashboardService.createSimpleStringTip(data.metadataType);

        let allTip: DashboardTip[] = [ metadataIdTip, metadataTypeTip];

        allTip = allTip.concat(modificationsTip);

        newRowTip.rowTips = allTip;

        transactionDetails.displayTips.push(newRowTip);

        // transactionDetails.displayList.set("Type", `${data.metadataType}`);
        // transactionDetails.displayList.set("Address", `${data.metadataId}`);
        // transactionDetails.displayList.set("Modifications", data.modifications.map((modi)=> `${modi.type}: '${modi.value}' into '${modi.key}' key`).join("<br>"));

        transactionDetails.relatedAddress.push(metadataId);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionModifyMosaicMetadata(modifyMosaicMetadataTx: ModifyMetadataTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: modifyMosaicMetadataTx.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [modifyMosaicMetadataTx.signer.publicKey],
            signerAddress: modifyMosaicMetadataTx.signer.address.plain(),
            relatedAddress: [modifyMosaicMetadataTx.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(modifyMosaicMetadataTx.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [modifyMosaicMetadataTx.signer.publicKey]
        };

        let metadataId = modifyMosaicMetadataTx.metadataId;
        let metadataType = "Asset";

        let modifications = [];
        let modificationsTip: DashboardTip[] = [];

        for (let i = 0; i < modifyMosaicMetadataTx.modifications.length; ++i) {
            let key = modifyMosaicMetadataTx.modifications[i].key;
            let type = modifyMosaicMetadataTx.modifications[i].type === 0 ? "Add" : "Remove";
            let value = modifyMosaicMetadataTx.modifications[i].value;

            modifications.push({
                key: key,
                value: value,
                type: type
            });

            modificationsTip.push(DashboardService.createSimpleStringTip(`${type}-${key}:${value}`));
        }

        let data = {
            metadataId: metadataId,
            metadataType: metadataType,
            modifications: modifications
        };

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();
            
        let metadataIdTip = DashboardService.createStringTip(data.metadataId, "Metadata ID:");
        let metadataTypeTip = DashboardService.createSimpleStringTip(data.metadataType);

        let allTip: DashboardTip[] = [ metadataIdTip, metadataTypeTip];

        allTip = allTip.concat(modificationsTip);

        newRowTip.rowTips = allTip;

        transactionDetails.displayTips.push(newRowTip);

        // transactionDetails.displayList.set("Type", `${data.metadataType}`);
        // transactionDetails.displayList.set("Asset ID", `${data.metadataId}`);
        // transactionDetails.displayList.set("Modifications", data.modifications.map((modi)=> `${modi.type}: '${modi.value}' into '${modi.key}' key`).join("<br>"));

        transactionDetails.relatedAsset.push(metadataId);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

    extractTransactionModifyNamespaceMetadata(modifyNamespaceMetadataTx: ModifyMetadataTransaction): DashboardInnerTransaction {
        let transactionDetails: DashboardInnerTransaction = {
            signer: modifyNamespaceMetadataTx.signer.publicKey,
            relatedAsset: [],
            relatedNamespace: [],
            relatedPublicKey: [modifyNamespaceMetadataTx.signer.publicKey],
            signerAddress: modifyNamespaceMetadataTx.signer.address.plain(),
            relatedAddress: [modifyNamespaceMetadataTx.signer.address.plain()],
            typeName: TransactionUtils.getTransactionTypeName(modifyNamespaceMetadataTx.type),
            searchString: [],
            extractedData: {},
            displayList: new Map<string, string>(),
            displayTips: [],
            signerPublicKeys: [modifyNamespaceMetadataTx.signer.publicKey]
        };

        let metadataId = modifyNamespaceMetadataTx.metadataId;
        let metadataType = "Namespace";

        let modifications = [];
        let modificationsTip: DashboardTip[] = [];

        for (let i = 0; i < modifyNamespaceMetadataTx.modifications.length; ++i) {
            let key = modifyNamespaceMetadataTx.modifications[i].key;
            let type = modifyNamespaceMetadataTx.modifications[i].type === 0 ? "Add" : "Remove";
            let value = modifyNamespaceMetadataTx.modifications[i].value;

            modifications.push({
                key: key,
                value: value,
                type: type
            });

            modificationsTip.push(DashboardService.createSimpleStringTip(`${type}-${key}:${value}`));
        }

        let data = {
            metadataId: metadataId,
            metadataType: metadataType,
            modifications: modifications
        };

        transactionDetails.extractedData = data;

        let newRowTip = new RowDashboardTip();
            
        let metadataIdTip = DashboardService.createStringTip(data.metadataId, "Metadata ID:");
        let metadataTypeTip = DashboardService.createSimpleStringTip(data.metadataType);

        let allTip: DashboardTip[] = [ metadataIdTip, metadataTypeTip];

        allTip = allTip.concat(modificationsTip);

        newRowTip.rowTips = allTip;

        transactionDetails.displayTips.push(newRowTip);

        // transactionDetails.displayList.set("Type", `${data.metadataType}`);
        // transactionDetails.displayList.set("Namespace ID", `${data.metadataId}`);
        // transactionDetails.displayList.set("Modifications", data.modifications.map((modi)=> `${modi.type}: '${modi.value}' into '${modi.key}' key`).join("<br>"));

        transactionDetails.relatedNamespace.push(metadataId);

        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAsset);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedAddress);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedPublicKey);
        transactionDetails.searchString = transactionDetails.searchString.concat(transactionDetails.relatedNamespace);

        return transactionDetails;
    }

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
            assetAmountTip.value = (data.assetAmount / Math.pow(10, nativeTokenDivisibility.value)).toString();
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
            case TransactionType.MODIFY_ACCOUNT_METADATA:
                let modifyAccountMetadataTx = innerTransaction as ModifyMetadataTransaction;
                tempData = this.extractTransactionModifyAccountMetadata(modifyAccountMetadataTx);
                break;
            case TransactionType.MODIFY_MOSAIC_METADATA:
                let modifyMosaicMetadataTx = innerTransaction as ModifyMetadataTransaction;
                tempData = this.extractTransactionModifyMosaicMetadata(modifyMosaicMetadataTx);
                break;
            case TransactionType.MODIFY_NAMESPACE_METADATA:
                let modifyNamespaceMetadataTx = innerTransaction as ModifyMetadataTransaction;
                tempData = this.extractTransactionModifyNamespaceMetadata(modifyNamespaceMetadataTx);
                break;
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
        return amount > 0 ? amount / Math.pow(10, nativeTokenDivisibility.value) : 0;
    }

    static displayOtherAsset = async(amount: number, assetId: string, mosaic_id: MosaicId) => {
        // let apiEndpoint = ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort);
        // let chainAPICall = new ChainAPICall(apiEndpoint);
        // let asset = await chainAPICall.assetAPI.getMosaic(mosaic_id);

        // let assetarray = []
        // assetarray.push(mosaic_id);
        // let nsAsset = await chainAPICall.assetAPI.getMosaicsNames(assetarray);

        let otherAsset = new OtherAsset();
        otherAsset.amount = amount;
        otherAsset.asset = assetId;
        otherAsset.assetid = mosaic_id;
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

