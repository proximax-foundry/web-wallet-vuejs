import {appSetting} from '@/config/appSetting';
import {RequestOptions} from 'tsjs-xpx-chain-sdk';

export class RequestAuth {

    static getApiKeyHeader(): RequestOptions | undefined{
        if(appSetting.restApiKey){
            return new RequestOptions({apikey: appSetting.restApiKey});
        }
        else{
            return undefined;
        }
    }

    static getAuthHeader(): RequestOptions | undefined{
        if(appSetting.restApiKey){
            return RequestAuth.getApiKeyHeader();
        }
        else{
            return undefined;
        }
    }
}