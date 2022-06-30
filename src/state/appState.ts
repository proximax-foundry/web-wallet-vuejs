import { reactive } from "vue";
import { BuildTransactions } from "../util/buildTransactions"
import { ChainAPICall } from "../models/REST/chainAPICall"
import { NetworkType, MosaicId, NamespaceId } from "tsjs-xpx-chain-sdk";
import { AssetInfo } from "../models/assetInfo";
import { Namespace } from "../models/namespace";

interface NativeToken{
    label: string
    fullNamespace: string
    assetId: string, 
    divisibility: number,
    creator: string
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
    trackingTxnHash: string[],
    assetsInfo: AssetInfo[],
    namespacesInfo: Namespace[],
    pendingAssetsInfo: MosaicId[],
    pendingNamespacesName: NamespaceId[],
    pendingNamespacesInfo: NamespaceId[],
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
    trackingTxnHash: [],
    assetsInfo: [],
    namespacesInfo: [],
    pendingAssetsInfo: [],
    pendingNamespacesName: [],
    pendingNamespacesInfo: []
  });