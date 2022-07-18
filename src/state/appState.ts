import { reactive } from "vue";
import { BuildTransactions } from "../util/buildTransactions"
import { ChainAPICall } from "../models/REST/chainAPICall"
import { NetworkType, MosaicId, NamespaceId, NamespaceInfo } from "tsjs-xpx-chain-sdk";
import { AssetInfo } from "../models/assetInfo";
import { Namespace } from "../models/namespace";

interface NativeToken{
    label: string,
    fullNamespace: string,
    assetId: string, 
    divisibility: number,
    creator: string
}

interface TxnActivityLog{
    txnHash: string,
    accPubKey: string,
    announced: boolean,
    status: string,
    statusMsg: string,
    relatedAddress: string[],
    checkedNum: number
}

interface TxnCosignLog{
    txnHash: string,
    accPubKey: string,
    announced: boolean,
    status: string,
    statusMsg: string,
    relatedAddress: string[],
    checkedNum: number
}

interface TxnSwapLog{
    txnHash: string,
    accPubKey: string,
    status: string,
    statusMsg: string,
    relatedAddress: string[],
    checkedNum: number
}

interface appStateInterface {
    buildTxn: BuildTransactions | null
    nativeToken: NativeToken;
    chainAPI: ChainAPICall | null;
    networkType: NetworkType;
    nodeFullURL: string;
    nodeURL: string;
    wsNodeFullURL: string;
    readyStates: Map<string, boolean>
    isReady: boolean,
    isPendingTxnAnnounce: boolean,
    // trackingTxnHash: string[],
    assetsInfo: AssetInfo[],
    namespacesInfo: Namespace[],
    pendingAssetsInfo: string[],
    pendingNamespacesName: NamespaceInfo[],
    readBlockHeight: number,
    txnActivityLog: TxnActivityLog[],
    txnCosignLog: TxnCosignLog[],
    txnSwapLog: TxnSwapLog[],
    txnActivityLogNum: number,
    txnCosignLogNum: number,
}

export const AppState = reactive<appStateInterface>({
    buildTxn: null,
    nativeToken: {
        assetId: '',
        divisibility: 6,
        fullNamespace: 'prx.xpx',
        label: 'XPX',
        creator: ''
    },
    chainAPI: null,
    networkType: NetworkType.TEST_NET, 
    nodeFullURL: '',
    nodeURL: '',
    wsNodeFullURL: '',
    readyStates: new Map(),
    isReady: false,
    isPendingTxnAnnounce: false,
    // trackingTxnHash: [],
    assetsInfo: [],
    namespacesInfo: [],
    pendingAssetsInfo: [],
    pendingNamespacesName: [],
    // pendingNamespacesInfo: [],
    readBlockHeight: 0,
    txnActivityLog: [],
    txnCosignLog: [],
    txnSwapLog: [],
    txnActivityLogNum: 0,
    txnCosignLogNum: 0,
  });