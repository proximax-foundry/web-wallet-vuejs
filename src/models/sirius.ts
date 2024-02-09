import {
    AccountHttp, TransactionHttp, TransactionQueryParams, TransactionType,
    NamespaceId, Address,
    TransactionGroupType, TransactionHash,
    ChainHttp, EmptyMessage,
    BlockHttp, TransactionSortingField, Order_v2, NetworkHttp,
    Deadline, NetworkType, Account, PublicAccount, NamespaceHttp, MosaicHttp, HashLockTransaction,
    Mosaic, UInt64, TransferTransaction, AggregateTransaction, LimitType, MosaicId, TransactionBuilder, TransactionBuilderFactory, InnerTransaction, SignedTransaction, PlainMessage
} from 'tsjs-xpx-chain-sdk';
import { bignumber, sum, multiply, number as mathNumber } from "mathjs";
import { ChronoUnit } from '@js-joda/core';
import { SimpleSDA } from './sda'
import { ChainConfigUtils } from "../util/chainConfigUtils";
import { networkState } from "../state/networkState";
import { AppState } from "../state/appState";

export interface DistributeListInterface {
    publicKeyOrAddress: string
    amount: number
    message: string
}

let knownToken = [{
    namespace: "prx.xpx",
    name: "XPX"
},
{
    namespace: "prx.metx",
    name: "METX"
}, {
    namespace: "xarcade.xar",
    name: "XAR"
}];

// let api = "https://api-2.testnet2.xpxsirius.io";
// let explorerURL = "https://bctestnetexplorer.xpxsirius.io";

// let accountHttp = new AccountHttp(api);
// let mosaicHttp = new MosaicHttp(api);

// let transactionBuilder = new TransactionBuilderFactory()

export class Sirius {

    static createAccount(privateKey: string) {
        return Account.createFromPrivateKey(privateKey, AppState.networkType,1);
    }

    static async scanAsset(publicKey: string): Promise<SimpleSDA[]> {
        let distributorPublicAccount = PublicAccount.createFromPublicKey(publicKey, AppState.networkType);

        try {
            let accountInfo = await AppState.chainAPI!.accountAPI.getAccountInfo(distributorPublicAccount.address);

            let assetIds: MosaicId[] = accountInfo.mosaics.map(asset => asset.id as MosaicId);

            let assetsInfo = await AppState.chainAPI!.assetAPI.getMosaics(assetIds);
            let assetsNames = await AppState.chainAPI!.assetAPI.getMosaicsNames(assetIds);

            let assetList = accountInfo.mosaics.map(assetData => {
                let assetIdHex = assetData.id.toHex();
                let divisibility = assetsInfo.find(x => x.mosaicId.toHex() === assetIdHex)!.divisibility;
                let assetNames = assetsNames.find(x => x.mosaicId.toHex() === assetIdHex)!.names;
                let assetName = assetNames.length ? assetNames[0].name : "";
                let knownAsset = knownToken.find(x => x.namespace === assetName);
                let asset: SimpleSDA = {
                    id: assetIdHex,
                    amount: divisibility ? assetData.amount.compact() / Math.pow(10, divisibility) : assetData.amount.compact(),
                    divisibility: divisibility,
                    namespaceName: assetName
                };

                asset.label = knownAsset ? knownAsset.name : (asset.namespaceName ? asset.namespaceName : asset.id.toUpperCase());

                return asset;
            });

            return assetList;
        } catch (error) {
            return [];
        }
    }

    /*
        static async getBlockHeight() {
            try {
               let queryParams = new TransactionQueryParams();
               let recipientAddress = process.env.siriusRecipient;
               let transactionHttp = new TransactionHttp(process.env.siriusNode);
                queryParams.recipientAddress = Address.createFromRawAddress(recipientAddress).plain();
               queryParams.embedded = true;
                queryParams.order = Order_v2.ASC;
                queryParams.sortField = TransactionSortingField.BLOCK;
                queryParams.type = [TransactionType.TRANSFER];
               var searchTrx = await transactionHttp.searchTransactions(TransactionGroupType.CONFIRMED, queryParams).toPromise();
                let network = new NetworkHttp(process.env.networkType);
               let block = new BlockHttp(process.env.siriusNode, network);
             //  console.log(block);
                let blockHeight = searchTrx.transactions.filter(trx => {
                    trx.type == TransactionType.TRANSFER;
                    let blockheight = trx.transactionInfo.height.lower;
    
                    return blockheight;
                }).map(data => data.transactionInfo.height.lower);
    
                console.log(blockHeight);
    
             return blockHeight;
            } catch (error) {
                console.log(error);
                return 0;
            }
        }
    
        static async getCurrentBlockTimestamp() {
           try {
                let networkHttp = new NetworkHttp(NetworkType.MAIN_NET);
                let blockHttp = new BlockHttp(process.env.siriusNode, networkHttp);
    
                let chainHttpAPI = new ChainHttp(process.env.siriusNode);
                const latestBlock = await chainHttpAPI.getBlockchainHeight().toPromise();
                let currentBlock = latestBlock.compact();
                const getCurrentBlockHeight = await blockHttp.getBlockByHeight(currentBlock).toPromise();
                const getCurrentTimestamp = new Date(getCurrentBlockHeight.timestamp.compact() + Deadline.timestampNemesisBlock * 1000).getTime();
    
                return {timeStamp: getCurrentTimestamp, blockHeight: currentBlock };
           } catch (error) {
                console.log(error);
                return {timeStamp: 0, blockHeight: 0};
           }
        }
    
        static async getBlockTimestamp(blockHeight: number) {
        try {
             let networkHttp = new NetworkHttp(NetworkType.MAIN_NET);
             let blockHttp = new BlockHttp(process.env.siriusNode, networkHttp);
    
             const blockInfo = await blockHttp.getBlockByHeight(blockHeight).toPromise();
             const getCurrentTimestamp = new Date(blockInfo.timestamp.compact() + Deadline.timestampNemesisBlock * 1000).getTime();
    
             return getCurrentTimestamp;
        } catch (error) {
             return 0;
        }
        }
        */
    static createDistributeAggregateTransactions(distributorPublicKey: string, distributionList: DistributeListInterface[], aggregateNum: number, sda: SimpleSDA, currentNodeTime: UInt64): AggregateTransaction[] {

        let distributorPublicAccount = PublicAccount.createFromPublicKey(distributorPublicKey, AppState.networkType);
        let txns: AggregateTransaction[] = [];

        let totalTxnCount = Math.ceil(distributionList.length / aggregateNum);
        // let transferList = [];
        let transferTxns: TransferTransaction[] = [];
        let atomicMultiplier = Math.pow(10, sda.divisibility);
        let assetId = sda.namespaceName ? new NamespaceId(sda.namespaceName) : new MosaicId(sda.id);

        for (let i = 0; i < distributionList.length; ++i) {

            let atomicRaw = multiply(bignumber(distributionList[i].amount), atomicMultiplier);
            let atomicAmount = Number(atomicRaw.toString());

            let recipient: Address;

            if(distributionList[i].publicKeyOrAddress.length === 64){
                let publicAccount = PublicAccount.createFromPublicKey(distributionList[i].publicKeyOrAddress, AppState.networkType);
                recipient = publicAccount.address;
            }
            else{
                recipient = Address.createFromRawAddress(distributionList[i].publicKeyOrAddress);
            }

            let mosaicToSend = new Mosaic(assetId, UInt64.fromUint(atomicAmount))
            let message
            if(distributionList[i].message){
                message = PlainMessage.create(distributionList[i].message)
            }else{
                message = EmptyMessage
            }
            let transferTxn = AppState.buildTxn!.transfer(recipient, message, [mosaicToSend]);

            transferTxns.push(transferTxn);
        }

        for (let i = 0; i < totalTxnCount; ++i) {

            let startIndex = i * aggregateNum;
            let endIndex = (i + 1) * aggregateNum;

            let transferTxnRange = transferTxns.slice(startIndex, endIndex);

            let innerTxn: InnerTransaction[] = [];

            for (let x = 0; x < transferTxnRange.length; ++x) {
                innerTxn.push(transferTxnRange[x].toAggregateV1(distributorPublicAccount));
            }

            let aggregateTransaction = AppState.buildTxn!.aggregateBonded(innerTxn, currentNodeTime);

            txns.push(aggregateTransaction);
        }

        return txns;
    }

    static getLockFundTransactionFee(): number {
        // const nativeTokenNamespace = AppState.nativeToken.fullNamespace
        const lockingAtomicFee = networkState.currentNetworkProfileConfig!.lockedFundsPerAggregate ?? 0;
        let transactionHash = new TransactionHash("0".repeat(64), TransactionType.AGGREGATE_BONDED_V1);
        let lockFundTxn = AppState.buildTxn!.hashLock(
            new Mosaic(new NamespaceId("prx.xpx"), UInt64.fromUint(lockingAtomicFee)),
            UInt64.fromUint(ChainConfigUtils.getABTMaxSafeDuration()),
            transactionHash
        );

        return lockFundTxn.maxFee.compact();
    }

    static async signAllAbtAndAnnounce(aggregateBondedTxns: AggregateTransaction[], account: Account): Promise<string[]>{

        interface TxnConfirmationBlock{
            txnHash: string
            block: number | null
        }

        interface TxnLockingSet{
            txnHash: string
            hashLockHash: string
        }

        const lockingAtomicFee = networkState.currentNetworkProfileConfig!.lockedFundsPerAggregate!;
        let signedABTs: SignedTransaction[] = [];
        let signedHashLockTxns: SignedTransaction[] = [];
        let txnsConfirmationBlock: TxnConfirmationBlock[] = [];
        let txnLockingSet: TxnLockingSet[] = [];

        for(let i =0; i < aggregateBondedTxns.length; ++i){

            let signedABT = account.preV2Sign(aggregateBondedTxns[i], networkState.currentNetworkProfile!.generationHash);
            signedABTs.push(signedABT);

            let lockFundTxn = AppState.buildTxn!.hashLock(
                new Mosaic(new NamespaceId(AppState.nativeToken.fullNamespace.trim()), UInt64.fromUint(lockingAtomicFee)),
                UInt64.fromUint(ChainConfigUtils.getABTMaxSafeDuration()),
                signedABT
            );
            let signedHashLockTxn = account.preV2Sign(lockFundTxn, networkState.currentNetworkProfile!.generationHash);
            signedHashLockTxns.push(signedHashLockTxn);

            txnsConfirmationBlock.push({ txnHash: signedABT.hash, block: null});
            txnsConfirmationBlock.push({ txnHash: signedHashLockTxn.hash, block: null});
            txnLockingSet.push({ txnHash:  signedABT.hash, hashLockHash: signedHashLockTxn.hash});
        }

        let allABTAnnounced = false;
 
         for(let i= 0; i < signedHashLockTxns.length; ++i){
 
             await AppState.chainAPI!.transactionAPI.announce(signedHashLockTxns[i]);
         }
 
         console.log("All LockHash Txn announced, pending ABT announcement...");
 
        let announcedABTsHash: string[] = [];

        while(!allABTAnnounced){
             await new Promise(r => setTimeout(r, 15000));
             console.log("Checking LockHash Txn confirmation...");
 
             let latestBlock = await AppState.chainAPI!.chainAPI.getBlockchainHeight();
             let blockHeight = latestBlock;
             let transactionWaiting = signedABTs.filter( x => !announcedABTsHash.includes(x.hash))
 
             for(let i=0; i < transactionWaiting.length; ++i){
                 let lockHashTxnHash = txnLockingSet.find(x => x.txnHash === transactionWaiting[i].hash)!.hashLockHash;
                 let txnStatus = await AppState.chainAPI!.transactionAPI.getTransactionStatus(lockHashTxnHash);
 
                 if(txnStatus.group === TransactionGroupType.CONFIRMED){
                     let confirmedAtHeight = txnStatus.height!.compact();
                     let blockConfirmation = txnsConfirmationBlock.find(x => x.txnHash === lockHashTxnHash);
                     blockConfirmation!.block = confirmedAtHeight;
 
                     if(blockHeight >= (blockConfirmation!.block + 1)){
                         await AppState.chainAPI!.transactionAPI.announceAggregateBonded(transactionWaiting[i]);
                         announcedABTsHash.push(transactionWaiting[i].hash);
                     }
                 }
             }
 
             if(announcedABTsHash.length === signedABTs.length){
                 allABTAnnounced = true;
             }
         }

         return announcedABTsHash;
    }

    /*
     static async stakingDistribute(walletPrivateKey, distributeAcc){
         
 
         let harvestersReward = [];
 
         for(let i= 5; i < scanResultCsvData.length; ++i){
             let reward = parseFloat(scanResultCsvData[i][3]);
             let atomicReward = mathjs.multiply(mathjs.bignumber(reward), 1000000).toNumber();
             harvestersReward.push({
                 amount: reward,
                 atomicAmount: atomicReward,
                 recipientPublicKey: scanResultCsvData[i][1],
                 address: PublicAccount.createFromPublicKey(scanResultCsvData[i][1], siriusNetworkType).address.plain()
             });
         }
 
         let totalDistributionAtomicAmount = mathjs.sum(harvestersReward.map(x=> x.atomicAmount));
         let totalDistributionAmount = mathjs.sum(harvestersReward.map(x=> x.amount));
 
         let totalAddressToDistribute = harvestersReward.length;
 
         let networkHttp = new NetworkHttp(siriusSelfNode);
         let txnHttp = new TransactionHttp(siriusSelfNode);
         let assetHttp = new MosaicHttp(siriusSelfNode, networkHttp);
         let chainHttp = new ChainHttp(siriusSelfNode);
         let blockHttp = new BlockHttp(siriusSelfNode, networkHttp);
         let accountHttp = new AccountHttp(siriusSelfNode, networkHttp);
         let namespaceHttp = new NamespaceHttp(siriusSelfNode, networkHttp);
 
         let blockInfo = await blockHttp.getBlockByHeight(1).toPromise();
 
         let genHash = blockInfo.generationHash;
 
         // set wallet - signer
         let account = Account.createFromPrivateKey(walletPrivateKey, siriusNetworkType);
         let distributionAccPublicAccount = PublicAccount.createFromPublicKey(distributeAcc, siriusNetworkType);
 
         let accountsInfo = await accountHttp.getAccountsInfo([account.address, distributionAccPublicAccount.address]).toPromise();
 
         let xpxAssetId = await namespaceHttp.getLinkedMosaicId(new NamespaceId("prx.xpx")).toPromise();;
         xpxAssetId = xpxAssetId.id.toHex().toUpperCase();
 
         let xpxAsset = accountsInfo[0].mosaics.find(x => x.id.toHex().toUpperCase() === xpxAssetId);
         let xpxAssetBalance = xpxAsset ? xpxAsset.amount.compact() / Math.pow(10, 6) : 0;
 
         let linkedAssetId = await namespaceHttp.getLinkedMosaicId(new NamespaceId(sdaNamespace)).toPromise();
         let sdaAssetBalance = 0;
 
         if(linkedAssetId){
             let assetInfo = await assetHttp.getMosaic(linkedAssetId).toPromise();
             let accountInfo = accountsInfo[1] ? accountsInfo[1] : accountsInfo[0]; 
             let sdaAsset = accountInfo.mosaics.find(x => x.id.toHex().toUpperCase() === linkedAssetId.id.toHex().toUpperCase());
             sdaAssetBalance = sdaAsset ? sdaAsset.amount.compact() / Math.pow(10, assetInfo.divisibility) : 0;
         }
 
         if(totalDistributionAmount > sdaAssetBalance){
             sseClients.broadCastLog("Insufficient SDA to send, need " + totalDistributionAmount);
             console.log("Insufficient SDA to send, need " + totalDistributionAmount);
             process.env.siriusDistributing = "";
             return;
         }
 
         let blocksPerHour = 4 * 60; // 15 seconds avg
 
         let lockHashTransaction = HashLockTransaction.create(
             Deadline.create(),
             new Mosaic(new NamespaceId("prx.xpx"), UInt64.fromUint(10 * Math.pow(10, 6))),
             UInt64.fromUint((blocksPerHour * 48) - 1),
             new TransactionHash("0".repeat(64), TransactionType.AGGREGATE_BONDED),
             siriusNetworkType
         );
 
         let totalLockHashTxn = Math.ceil(totalAddressToDistribute/ 10);
         let totalLockHashFee = totalLockHashTxn * (10 + (lockHashTransaction.maxFee.compact() / Math.pow(10, 6) )); 
         
         let transferTxns = [];
         let transactionsData = [];
 
         for(let i=0; i < harvestersReward.length; ++i){
             let unitAmount = harvestersReward[i].atomicAmount;
             //let unitAmount = 1;
             let transferTxn = TransferTransaction.create(
                 Deadline.create(),
                 Address.createFromRawAddress(harvestersReward[i].address),
                 [
                     new Mosaic(new NamespaceId(sdaNamespace), UInt64.fromUint(unitAmount))
                 ],
                 EmptyMessage,
                 siriusNetworkType
             );
             transferTxns.push(transferTxn);
 
             let txnRecord = {
                 address: harvestersReward[i].address,
                 amount: harvestersReward[i].amount,
                 harvester: harvestersReward[i].recipientPublicKey,
                 txnHash: "",
                 status: "",
                 lockHash: ""
             };
 
             transactionsData.push(txnRecord);
         }
 
         let aggregateTxnFee = 0;
         let transasctionSets = [];
         let lockHashAmount = 10;
 
         for(let i=0; i < totalLockHashTxn; ++i){
 
             let startIndex = i * 10;
             let endIndex = (i + 1) * 10;
 
             let transferTxnRange = transferTxns.slice(startIndex, endIndex);
             let transactionsDataRange = transactionsData.slice(startIndex, endIndex);
 
             let innerTxn = [];
 
             for(let x=0; x < transferTxnRange.length; ++x){
                 innerTxn.push(transferTxnRange[x].toAggregate(distributionAccPublicAccount));
             }
 
             let aggregateTransaction = AggregateTransaction.createBonded(
                 Deadline.createForBonded((60 * 48) - 5, ChronoUnit.MINUTES), // 48 hours - 5 minutes
                 innerTxn,
                 siriusNetworkType,
                 []
             );
 
             aggregateTxnFee += aggregateTransaction.maxFee.compact() / Math.pow(10, 6);
 
             let signedAggBondedTxn = account.sign(aggregateTransaction, genHash);
 
             let lockHashTransaction = HashLockTransaction.create(
                 Deadline.create(),
                 new Mosaic(new NamespaceId("prx.xpx"), UInt64.fromUint(lockHashAmount * Math.pow(10, 6))),
                 UInt64.fromUint((blocksPerHour * 48) - 1),
                 signedAggBondedTxn,
                 siriusNetworkType
             );
 
             let signedLockHashTxn = account.sign(lockHashTransaction, genHash);
 
             for(let x=0; x < transactionsDataRange.length; ++x){
                 transactionsDataRange[x].lockHash = signedLockHashTxn.hash;
                 transactionsDataRange[x].txnHash = signedAggBondedTxn.hash;
             }
 
             let transasctionSet = {
                 signedABT: signedAggBondedTxn,
                 signedLockHashTxn: signedLockHashTxn,
                 lockConfirmedAt: null,
                 done: false
             }
 
             transasctionSets.push(transasctionSet);
         }
 
         let totalFeeNeeded = totalLockHashFee + aggregateTxnFee;
 
         if(totalFeeNeeded > xpxAssetBalance){
             sseClients.broadCastLog("Insufficient XPX, need " + totalFeeNeeded);
             console.log("Insufficient XPX, need " + totalFeeNeeded);
             process.env.siriusDistributing = "";
             return;
         }
 
         sseClients.broadCastLog("Distributing...");
         console.log("Distributing...");
 
         let allABTAnnounced = false;
 
         for(let i= 0; i < transasctionSets.length; ++i){
 
             await txnHttp.announce(transasctionSets[i].signedLockHashTxn).toPromise();
         }
 
         sseClients.broadCastLog("All LockHash Txn announced, pending ABT announcement...");
         console.log("All LockHash Txn announced, pending ABT announcement...");
 
         while(!allABTAnnounced){
             await new Promise(r => setTimeout(r, 15000));
 
             sseClients.broadCastLog("Checking LockHash Txn confirmation...");
             console.log("Checking LockHash Txn confirmation...");
 
             let latestBlock = await chainHttp.getBlockchainHeight().toPromise();
             let blockHeight = latestBlock.compact();
 
             for(let i=0; i < transasctionSets.length; ++i){
                 let txnStatus = await txnHttp.getTransactionStatus(transasctionSets[i].signedLockHashTxn.hash).toPromise();
 
                 if(txnStatus.group === TransactionGroupType.CONFIRMED){
                     let confirmedAtHeight = txnStatus.height.compact();
                     transasctionSets[i].lockConfirmedAt = confirmedAtHeight;
 
                     if(blockHeight >= (confirmedAtHeight + 1)){
                         await txnHttp.announceAggregateBonded(transasctionSets[i].signedABT).toPromise();
                         transasctionSets[i].done = true;
                         sseClients.broadCastLog("ABT "+ transasctionSets[i].signedABT.hash + " announced...");
                     }
                 }
             }
 
             let transactionSetsDone = transasctionSets.filter(x => x.done);
 
             if(transactionSetsDone.length === transasctionSets.length){
                 allABTAnnounced = true;
             }
         }
 
         Sirius.setStakingDistributionDone(transactionsData, sseClients);
     }
     */

}