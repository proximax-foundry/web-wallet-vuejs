export class Currency {
  name: string;
  namespace: string;
  assetId: string | null = null;
  namespaceId: string;
  divisibility: number;

  constructor(
    name: string,
    namespace: string,
    namespaceId: string,
    divisibility: number,
    assetId?: string
  ) {
    this.name = name;
    this.namespace = namespace;
    this.assetId = assetId ? assetId : null;
    this.namespaceId = namespaceId;
    this.divisibility = divisibility;
  }

  static createDefault(): Currency {
    return new Currency("XPX", "prx.xpx", "bffb42a19116bdf6", 6, "");
  }

  serialize() {
    return {
      name: this.name,
      namespace: this.namespace,
      assetId: this.assetId,
      namespaceId: this.namespaceId,
      divisibility: this.divisibility,
    };
  }
}
