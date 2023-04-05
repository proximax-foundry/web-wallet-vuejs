import type { ChainProfile, ChainSwapConfig } from "./stores";

export interface ChainProfileKey {
  [key: string]: ChainProfile
}

export interface ChainSwapKey {
  [key: string]: ChainSwapConfig
}

export class AppSetting{

  backupOldWallet: boolean = true;
  theme: any;
  chainSwap: ChainSwapKey = {};
  chainProfile: ChainProfileKey = {};
}
