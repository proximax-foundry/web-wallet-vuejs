import { firstValueFrom } from "rxjs";
import {
  PaginationQueryParams,
  LiquidityProviderSearch,
  LiquidityProvider,
  LiquidityProviderHttp,
} from "tsjs-xpx-chain-sdk";

export class LiquidityProviderAPI {
  liquidityProviderHttp: LiquidityProviderHttp;

  constructor(endpoint: string) {
    this.liquidityProviderHttp = new LiquidityProviderHttp(endpoint);
  }

  /**
   * Get Liquidity Provider info
   * @param providerKey - provider key.
   */
  getLiquidityProvider(providerKey: string): Promise<LiquidityProvider> {
    return firstValueFrom(this.liquidityProviderHttp.getLiquidityProvider(providerKey));
  }

  /**
   * Search liquidity provider 
   * @param qp - Drive query params.
   */
  searchLiquidityProviders(): Promise<LiquidityProviderSearch> {
    return firstValueFrom(this.liquidityProviderHttp
      .searchLiquidityProviders());
  }

}