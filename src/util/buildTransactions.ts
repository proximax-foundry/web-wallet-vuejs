import {
    Password,
    SimpleWallet,
    MosaicInfo,
    TransactionHttp,
    ChainConfigHttp,
    AccountHttp,
    MosaicHttp,
    NamespaceHttp,
    MosaicService,
    NamespaceService,
    TransactionStatusError,
    SignedTransaction,
    NamespaceId,
    QueryParams,
    NetworkType,
    Account,
    PublicAccount,
    TransferTransaction,
    Deadline,
    Mosaic,
    MosaicId,
    UInt64,
    PlainMessage,
    Address,
    Transaction,
    MosaicSupplyChangeTransaction,
    RegisterNamespaceTransaction,
    AccountInfo,
    MosaicNonce,
    MosaicProperties,
    TransactionStatus,
    TransactionAnnounceResponse,
    MosaicSupplyType,
    AliasActionType,
    ChainHttp,
    NamespaceInfo,
    MultisigAccountInfo,
    AggregateTransaction,
    CosignatureTransaction,
    BlockHttp,
    BlockInfo,
    MosaicAliasTransaction,
    Convert,
    RawAddress,
    MosaicDefinitionTransaction,
    TransactionBuilderFactory,
    FeeCalculationStrategy,
    InnerTransaction,
    HashLockTransaction,
    ModifyMultisigAccountTransaction,
    MultisigCosignatoryModification,
    AddressAliasTransaction,
    AccountLinkTransaction,
    LinkAction,
    Crypto,
    MultisigAccountGraphInfo,
    WalletAlgorithm
} from 'tsjs-xpx-chain-sdk';
import { WalletUtils } from "./walletUtils";

export class BuildTransaction {

    //environment.deadlineTransfer.deadline, environment.deadlineTransfer.chronoUnit

    transactionBuilderFactory: TransactionBuilderFactory;

    constructor(feeStrategy: FeeCalculationStrategy, networkType: NetworkType, generationHash?: string) {
        this.transactionBuilderFactory = new TransactionBuilderFactory();
        this.transactionBuilderFactory.feeCalculationStrategy = feeStrategy;
        this.transactionBuilderFactory.networkType = networkType;
        this.transactionBuilderFactory.generationHash = generationHash ? generationHash: "";
    }

    updateCustomFee(feePerByte: number) {
        this.transactionBuilderFactory.feeCalculationStrategy = feePerByte;
    }

    updateGenerationHash(generationHash: string) {
        this.transactionBuilderFactory.generationHash = generationHash;
    }


    transfer(recipient: Address | NamespaceId, message?: any, sendingMosaics?: Mosaic[]): TransferTransaction {
        let mosaics: any = [];

        if (sendingMosaics) {
            if (sendingMosaics.length)
                mosaics = sendingMosaics;
        }

        return this.transactionBuilderFactory.transfer()
            .deadline(Deadline.create())
            .recipient(recipient)
            .mosaics(mosaics)
            .message(message)
            .build();
    }

    /**
     *
     * @param {NetworkType} network
     * @param {MosaicId} mosaicId
     * @param {MosaicSupplyType} mosaicSupplyType
     * @param {UInt64} delta
     * @returns {MosaicSupplyChangeTransaction}
  
     */
    buildMosaicSupplyChange(
        network: NetworkType,
        mosaicId: MosaicId,
        mosaicSupplyType: MosaicSupplyType,
        delta: UInt64
    ): MosaicSupplyChangeTransaction {

        return this.transactionBuilderFactory.mosaicSupplyChange()
            .deadline(Deadline.create())
            .mosaicId(mosaicId)
            .direction(mosaicSupplyType)
            .delta(delta)
            .networkType(network)
            .build();

    }

    mosaicDefinition(network: NetworkType, owner: PublicAccount, 
        supplyMutable: boolean, transferable: boolean, 
        divisibility: number, duration?: number): MosaicDefinitionTransaction {
        const nonce = WalletUtils.createNonceRandom();

        return this.transactionBuilderFactory.mosaicDefinition()
            .deadline(Deadline.create())
            .mosaicNonce(nonce)
            .mosaicId(MosaicId.createFromNonce(nonce, owner))
            .mosaicProperties(
                MosaicProperties.create({
                    supplyMutable: supplyMutable,
                    transferable: transferable,
                    divisibility: divisibility,
                    duration: (duration) ? UInt64.fromUint(duration) : undefined
                })
            )
            .networkType(network)
            .build();
    }

    aggregateBonded(network: NetworkType, innerTxn: InnerTransaction[]): AggregateTransaction {

        return this.transactionBuilderFactory.aggregateBonded()
            .deadline(Deadline.create())
            .innerTransactions(innerTxn)
            .networkType(network)
            .build();
    }

    aggregateComplete(network: NetworkType, innerTxn: InnerTransaction[]): AggregateTransaction {

        return this.transactionBuilderFactory.aggregateComplete()
            .deadline(Deadline.create())
            .innerTransactions(innerTxn)
            .networkType(network)
            .build();
    }

    hashLock(mosaic: Mosaic, duration: UInt64, signedTransaction: SignedTransaction, network: NetworkType): HashLockTransaction {

        return this.transactionBuilderFactory.hashLock()
            .deadline(Deadline.create())
            .duration(duration)
            .mosaic(mosaic)
            .signedTransaction(signedTransaction)
            .networkType(network)
            .build();
    }

    modifyMultisigAccount(minApprovalDelta: number, minRemovalDelta: number, modifications: MultisigCosignatoryModification[], network: NetworkType): ModifyMultisigAccountTransaction {

        return this.transactionBuilderFactory.modifyMultisig()
            .deadline(Deadline.create())
            .minApprovalDelta(minApprovalDelta)
            .minRemovalDelta(minRemovalDelta)
            .modifications(modifications)
            .networkType(network)
            .build();
    }

    addressAlias(aliasActionType: AliasActionType, namespaceId: NamespaceId, address: Address, network: NetworkType): AddressAliasTransaction {

        return this.transactionBuilderFactory.addressAlias()
            .deadline(Deadline.create())
            .actionType(aliasActionType)
            .address(address)
            .namespaceId(namespaceId)
            .networkType(network)
            .build();
    }

    accountLink(network: NetworkType, remoteAccountKey: string, linkAction: LinkAction) {

        return this.transactionBuilderFactory.accountLink()
            .deadline(Deadline.create())
            .linkAction(linkAction)
            .remoteAccountKey(remoteAccountKey)
            .networkType(network)
            .build();
    }

    assetAlias(aliasActionType: AliasActionType, namespaceId: NamespaceId, mosaicId: MosaicId, network: NetworkType) {
        return this.transactionBuilderFactory.mosaicAlias()
            .deadline(Deadline.create())
            .actionType(aliasActionType)
            .namespaceId(namespaceId)
            .mosaicId(mosaicId)
            .networkType(network)
            .build();
    }

    mosaicSupplyChange(mosaicId: string, supply: number, mosaicSupplyType: number, network: NetworkType): MosaicSupplyChangeTransaction {
        return this.transactionBuilderFactory.mosaicSupplyChange()
            .deadline(Deadline.create())
            .mosaicId(new MosaicId(mosaicId))
            .direction(mosaicSupplyType)
            .delta(UInt64.fromUint(supply))
            .networkType(network)
            .build();
    }

    registerRootNamespace(name: string, network: NetworkType, duration: number = 100): RegisterNamespaceTransaction {
        return this.transactionBuilderFactory.registerRootNamespace()
            .deadline(Deadline.create())
            .namespaceName(name)
            .duration(UInt64.fromUint(duration))
            .networkType(network)
            .build();

    }

    registersubNamespace(rootNamespace: string, subnamespaceName: string, network: NetworkType): RegisterNamespaceTransaction {

        return this.transactionBuilderFactory.registerSubNamespace()
            .deadline(Deadline.create())
            .namespaceName(subnamespaceName)
            .parentNamespace(rootNamespace)
            .networkType(network)
            .build();
    }

    getFeeStrategy(): FeeCalculationStrategy {
        return this.transactionBuilderFactory.feeCalculationStrategy;
    }
}