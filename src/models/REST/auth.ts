import {networkState} from '@/state/networkState';
import {RequestOptions} from 'tsjs-xpx-chain-sdk';

export class RequestAuth {

    static getApiKeyHeader(): RequestOptions | undefined{
        if(networkState.currentNetworkProfile.apikey){
            return new RequestOptions({apikey: networkState.currentNetworkProfile.apikey});
        }
        else{
            return undefined;
        }
    }

    static getAuthHeader(): RequestOptions | undefined{
        if(networkState.currentNetworkProfile.apikey){
            return RequestAuth.getApiKeyHeader();
        }
        else{
            return undefined;
        }
    }
}