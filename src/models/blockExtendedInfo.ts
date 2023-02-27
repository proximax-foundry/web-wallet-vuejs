export class BlockExtendedInfo {
  block: number;
  feeMultiplier?: number;
  receipts?: any[] = [];
  addressResolutions: Resolution[] = [];
  assetResolutions: Resolution[] = [];

  constructor(blockNum: number) {
    this.block = blockNum;
  }

  searchNamespaceResolution(namespaceIdHex: string): ResolutionSearch | null {
    const foundAddress = this.addressResolutions.find(
      (resolution) =>
        resolution.unresolved.toUpperCase() === namespaceIdHex.toUpperCase()
    );
    let type: ResolutionType;
    let resolved: string = "";

    if (foundAddress) {
      type = ResolutionType.ADDRESS;
      resolved = foundAddress.resolved;
      if (resolved) {
        return <ResolutionSearch>{
          type: type,
          value: resolved,
        };
      }
    } else {
      const foundAsset = this.assetResolutions.find(
        (resolution) =>
          resolution.unresolved.toUpperCase() === namespaceIdHex.toUpperCase()
      );

      if (foundAsset) {
        type = ResolutionType.ASSET;
        resolved = foundAsset.resolved;
        if (resolved) {
          return <ResolutionSearch>{
            type: type,
            value: resolved,
          };
        }
      }
    }

    return null;
  }

  serialize() {
    return {
      block: this.block,
      feeMultiplier: this.feeMultiplier ? this.feeMultiplier : null,
      receipt: [],
      addressResolution: this.addressResolutions.map((resolution) =>
        resolution.serialize()
      ),
      assetResolutions: this.assetResolutions.map((resolution) =>
        resolution.serialize()
      ),
    };
  }
}

export class Resolution {
  constructor(public unresolved: string, public resolved: string) {}

  serialize() {
    return {
      unresolved: this.unresolved,
      resolved: this.resolved,
    };
  }
}

interface ResolutionSearch {
  type: ResolutionType;
  value: string;
}

enum ResolutionType {
  ADDRESS = 1,
  ASSET = 2,
}
