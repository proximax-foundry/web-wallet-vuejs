import { ChainProfile, ChainSwapConfig } from "./stores";

export class AppSetting{

    backupOldWallet: boolean = true;
    theme: any;
    chainSwap: ChainSwapConfig[] = [];
    chainProfile: ChainProfile[] = [];
}