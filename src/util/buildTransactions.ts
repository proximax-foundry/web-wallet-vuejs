import {
    SignedTransaction,
    NamespaceId,
    NetworkType,
    PublicAccount,
    Deadline,
    Mosaic,
    MosaicId,
    UInt64,
    Address,
    TransferTransaction,
    TransferTransactionBuilder,
    MosaicSupplyChangeTransaction,
    MosaicSupplyChangeTransactionBuilder,
    RegisterNamespaceTransaction,
    RegisterRootNamespaceTransactionBuilder,
    RegisterSubNamespaceTransactionBuilder,
    MosaicProperties,
    MosaicSupplyType,
    AliasActionType,
    AggregateTransaction,
    AggregateBondedTransactionBuilder,
    AggregateCompleteTransactionBuilder,
    MosaicDefinitionTransaction,
    MosaicDefinitionTransactionBuilder,
    TransactionBuilderFactory,
    FeeCalculationStrategy,
    InnerTransaction,
    HashLockTransaction,
    HashLockTransactionBuilder,
    ModifyMultisigAccountTransaction,
    ModifyMultisigAccountTransactionBuilder,
    AddressAliasTransaction,
    AddressAliasTransactionBuilder,
    AccountLinkTransaction,
    AccountLinkTransactionBuilder,
    MultisigCosignatoryModification,
    MosaicAliasTransaction,
    MosaicAliasTransactionBuilder,
    AccountMetadataTransaction,
    AccountMetadataTransactionBuilder,
    MosaicMetadataTransaction,
    MosaicMetadataTransactionBuilder,
    NamespaceMetadataTransaction,
    NamespaceMetadataTransactionBuilder,
    LinkAction,
    Message,
    EmptyMessage,
    TransactionHash,
    AggregateCompleteV1TransactionBuilder,
    AggregateBondedV1TransactionBuilder
} from 'tsjs-xpx-chain-sdk';
import { WalletUtils } from "./walletUtils";
import { Helper } from "./typeHelper";
import { ChainConfigUtils } from "./chainConfigUtils";

export class BuildTransactions {

    //environment.deadlineTransfer.deadline, environment.deadlineTransfer.chronoUnit

    transactionBuilderFactory: TransactionBuilderFactory;

    constructor(networkType: NetworkType, generationHash?: string, feeStrategy?: FeeCalculationStrategy) {
        this.transactionBuilderFactory = new TransactionBuilderFactory();
        if(feeStrategy !== undefined)
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

    transfer(recipient: Address | NamespaceId, message?: Message, sendingMosaics?: Mosaic[]): TransferTransaction {
        let mosaics: any = [];

        if (sendingMosaics) {
            if (sendingMosaics.length)
                mosaics = sendingMosaics;
        }

        if(!message){
            message = EmptyMessage;
        }

        return this.transactionBuilderFactory.transfer()
            .deadline(Deadline.create())
            .recipient(recipient)
            .mosaics(mosaics)
            .message(message)
            .build();
    }

    transferBuilder(): TransferTransactionBuilder {

        return this.transactionBuilderFactory.transfer();
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
        mosaicId: MosaicId,
        mosaicSupplyType: MosaicSupplyType,
        delta: UInt64
    ): MosaicSupplyChangeTransaction {

        return this.transactionBuilderFactory.mosaicSupplyChange()
            .deadline(Deadline.create())
            .mosaicId(mosaicId)
            .direction(mosaicSupplyType)
            .delta(delta)
            .build();
    }

    buildMosaicSupplyChangeBuilder(): MosaicSupplyChangeTransactionBuilder {

        return this.transactionBuilderFactory.mosaicSupplyChange();
    }

    mosaicDefinition(owner: PublicAccount, 
        supplyMutable: boolean, transferable: boolean, 
        divisibility: number, duration?: UInt64): MosaicDefinitionTransaction {
        const nonce = Helper.createNonceRandom();

        return this.transactionBuilderFactory.mosaicDefinition()
            .deadline(Deadline.create())
            .mosaicNonce(nonce)
            .mosaicId(MosaicId.createFromNonce(nonce, owner))
            .mosaicProperties(
                MosaicProperties.create({
                    supplyMutable: supplyMutable,
                    transferable: transferable,
                    divisibility: divisibility,
                    duration: (duration) ? duration : undefined
                })
            )
            .build();
    }

    mosaicDefinitionBuilder(): MosaicDefinitionTransactionBuilder {

        return this.transactionBuilderFactory.mosaicDefinition();
    }

    aggregateBonded(innerTxn: InnerTransaction[]): AggregateTransaction {

        let abtDeadline = ChainConfigUtils.getABTMaxSafeDeadline();

        return this.transactionBuilderFactory.aggregateBondedV1()
            .deadline(abtDeadline)
            .innerTransactions(innerTxn)
            .build();
    }

    aggregateBondedBuilder(): AggregateBondedV1TransactionBuilder  {

        let abtDeadline = ChainConfigUtils.getABTMaxSafeDeadline();

        return this.transactionBuilderFactory.aggregateBondedV1().deadline(abtDeadline);
    }

    aggregateComplete(innerTxn: InnerTransaction[]): AggregateTransaction {

        return this.transactionBuilderFactory.aggregateCompleteV1 ()
            .deadline(Deadline.create())
            .innerTransactions(innerTxn)
            .build();
    }

    aggregateCompleteBuilder(): AggregateCompleteV1TransactionBuilder {

        return this.transactionBuilderFactory.aggregateCompleteV1();
    }

    hashLock(mosaic: Mosaic, duration: UInt64, transactionHash: TransactionHash | SignedTransaction): HashLockTransaction {

        let transactionHashToUse = transactionHash instanceof TransactionHash ? transactionHash : new TransactionHash(transactionHash.hash, transactionHash.type);

        return this.transactionBuilderFactory.hashLock()
            .deadline(Deadline.create())
            .duration(duration)
            .mosaic(mosaic)
            .transactionHash(transactionHash)
            .build();
    }

    hashLockBuilder(): HashLockTransactionBuilder {

        return this.transactionBuilderFactory.hashLock();
    }

    modifyMultisigAccount(minApprovalDelta: number, minRemovalDelta: number, modifications: MultisigCosignatoryModification[]): ModifyMultisigAccountTransaction {

        return this.transactionBuilderFactory.modifyMultisig()
            .deadline(Deadline.create())
            .minApprovalDelta(minApprovalDelta)
            .minRemovalDelta(minRemovalDelta)
            .modifications(modifications)
            .build();
    }

    modifyMultisigAccountBuilder(): ModifyMultisigAccountTransactionBuilder {

        return this.transactionBuilderFactory.modifyMultisig();
    }

    addressAlias(aliasActionType: AliasActionType, namespaceId: NamespaceId, address: Address): AddressAliasTransaction {

        return this.transactionBuilderFactory.addressAlias()
            .deadline(Deadline.create())
            .actionType(aliasActionType)
            .address(address)
            .namespaceId(namespaceId)
            .build();
    }

    addressAliasBuilder(): AddressAliasTransactionBuilder {

        return this.transactionBuilderFactory.addressAlias();
    }

    accountLink(remoteAccountKey: string, linkAction: LinkAction): AccountLinkTransaction {

        return this.transactionBuilderFactory.accountLink()
            .deadline(Deadline.create())
            .linkAction(linkAction)
            .remoteAccountKey(remoteAccountKey)
            .build();
    }

    accountLinkBuilder(): AccountLinkTransactionBuilder {

        return this.transactionBuilderFactory.accountLink();
    }

    assetAlias(aliasActionType: AliasActionType, namespaceId: NamespaceId, mosaicId: MosaicId): MosaicAliasTransaction {
        return this.transactionBuilderFactory.mosaicAlias()
            .deadline(Deadline.create())
            .actionType(aliasActionType)
            .namespaceId(namespaceId)
            .mosaicId(mosaicId)
            .build();
    }

    assetAliasBuilder(): MosaicAliasTransactionBuilder {
        return this.transactionBuilderFactory.mosaicAlias();
    }

    mosaicSupplyChange(mosaicId: string, supply: number, mosaicSupplyType: number): MosaicSupplyChangeTransaction {
        return this.transactionBuilderFactory.mosaicSupplyChange()
            .deadline(Deadline.create())
            .mosaicId(new MosaicId(mosaicId))
            .direction(mosaicSupplyType)
            .delta(UInt64.fromUint(supply))
            .build();
    }

    mosaicSupplyChangeBuilder(): MosaicSupplyChangeTransactionBuilder {
        return this.transactionBuilderFactory.mosaicSupplyChange();
    }

    registerRootNamespace(name: string, duration: UInt64 = UInt64.fromUint(100)): RegisterNamespaceTransaction {
        return this.transactionBuilderFactory.registerRootNamespace()
            .deadline(Deadline.create())
            .namespaceName(name)
            .duration(duration)
            .build();
    }

    registerRootNamespaceBuilder(): RegisterRootNamespaceTransactionBuilder {
        return this.transactionBuilderFactory.registerRootNamespace();
    }

    registersubNamespace(rootNamespace: string, subnamespaceName: string): RegisterNamespaceTransaction {

        return this.transactionBuilderFactory.registerSubNamespace()
            .deadline(Deadline.create())
            .namespaceName(subnamespaceName)
            .parentNamespace(rootNamespace)
            .build();
    }

    registersubNamespaceBuilder(): RegisterSubNamespaceTransactionBuilder {

        return this.transactionBuilderFactory.registerSubNamespace();
    }

    accountMetadataBuilder(): AccountMetadataTransactionBuilder{
        return this.transactionBuilderFactory.accountMetadata();
    }

    accountMetadata(oldValue: string, newValue: string, scopedMetadataKey: UInt64, targetPublicKey: PublicAccount): AccountMetadataTransaction{
        return this.transactionBuilderFactory.accountMetadata()
            .deadline(Deadline.create())
            .oldValue(oldValue)
            .value(newValue)
            .scopedMetadataKey(scopedMetadataKey)
            .targetPublicKey(targetPublicKey)
            .calculateDifferences()
            .build();
    }

    namespaceMetadataBuilder(): NamespaceMetadataTransactionBuilder{
        return this.transactionBuilderFactory.namespaceMetadata();
    }

    namespaceMetadata(oldValue: string, newValue: string, scopedMetadataKey: UInt64, targetId: NamespaceId, targetPublicKey: PublicAccount): NamespaceMetadataTransaction{
        return this.transactionBuilderFactory.namespaceMetadata()
            .deadline(Deadline.create())
            .oldValue(oldValue)
            .value(newValue)
            .scopedMetadataKey(scopedMetadataKey)
            .targetPublicKey(targetPublicKey)
            .targetNamespaceId(targetId)
            .calculateDifferences()
            .build();
    }

    assetMetadataBuilder(): MosaicMetadataTransactionBuilder{
        return this.transactionBuilderFactory.mosaicMetadata();
    }

    assetMetadata(oldValue: string, newValue: string, scopedMetadataKey: UInt64, targetId: MosaicId, targetPublicKey: PublicAccount): MosaicMetadataTransaction{
        return this.transactionBuilderFactory.mosaicMetadata()
            .deadline(Deadline.create())
            .oldValue(oldValue)
            .value(newValue)
            .scopedMetadataKey(scopedMetadataKey)
            .targetPublicKey(targetPublicKey)
            .targetMosaicId(targetId)
            .calculateDifferences()
            .build();
    }

    getFeeStrategy(): FeeCalculationStrategy {
        return this.transactionBuilderFactory.feeCalculationStrategy;
    }

    setFeeStrategy(feeStrategy :FeeCalculationStrategy) :void{
        this.transactionBuilderFactory.feeCalculationStrategy = feeStrategy; 
    }
}