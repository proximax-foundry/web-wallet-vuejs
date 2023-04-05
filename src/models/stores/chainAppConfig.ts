import { StoreProperties } from "./storeProperties";

export class ChainAppConfig extends StoreProperties {
  defaultPollPublicKey: string = "";
  attestationAddress: string = "";
  swapAccount: SwapAccount | null = null;
  swapAllowedMosaics: SwapAllowedMosaic[] = [];
  coingeckoUrl: string = "";

  constructor(storeName: string) {
    super(storeName + "_appConfig");
  }

  serialize() {
    return {
      defaultPollPublicKey: this.defaultPollPublicKey,
      attestationAddress: this.attestationAddress,
      swapAccount: this.swapAccount ? this.swapAccount.serialize() : null,
      swapAllowedMosaics: this.swapAllowedMosaics
        ? this.swapAllowedMosaics.map((i) => i.serialize())
        : null,
      coingeckoUrl: this.coingeckoUrl,
    };
  }
}

class SwapAccount {
  addressAccountMultisig: string;
  addressAccountSimple: string;

  constructor(addressAccountMultisig: string, addressAccountSimple: string) {
    this.addressAccountMultisig = addressAccountMultisig;
    this.addressAccountSimple = addressAccountSimple;
  }

  serialize() {
    return {
      addressAccountMultisig: this.addressAccountMultisig,
      addressAccountSimple: this.addressAccountSimple,
    };
  }
}

class SwapAllowedMosaic {
  fullName: string;
  namespace: string;
  name: string;
  divisibility: number;

  constructor(
    namespace: string,
    name: string,
    divisibility: number,
    fullName: string
  ) {
    this.namespace = namespace;
    this.name = name;
    this.divisibility = divisibility;
    this.fullName = fullName;
  }

  serialize() {
    return {
      namespace: this.namespace,
      name: this.name,
      divisibility: this.divisibility,
      fullName: this.fullName,
    };
  }
}
