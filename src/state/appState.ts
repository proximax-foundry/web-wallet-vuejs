import { reactive } from "vue";
import { BuildTransactions } from "../util/buildTransactions"
import { ChainAPICall } from "../models/REST/chainAPICall"
import { NetworkType } from "tsjs-xpx-chain-sdk";

interface NativeToken{
    label: string
    fullNamespace: string
    assetId: string, 
    divisibility: number,
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
    isPendingTxnAnnounce: boolean
}

export const AppState = reactive<appStateInterface>({
    buildTxn: null,
    nativeToken: {
        assetId: '',
        divisibility: 6,
        fullNamespace: 'prx.xpx',
        label: 'XPX'
    },
    chainAPI: null,
    networkType: NetworkType.TEST_NET, 
    nodeFullURL: '',
    nodeURL: '',
    wsNodeFullURL: '',
    readyStates: new Map(),
    isReady: false,
    isPendingTxnAnnounce: false
  });