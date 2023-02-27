import { UnconfirmedTransaction } from "./unconfirmedTransaction";

export class UnconfirmedNamespaceTransaction extends UnconfirmedTransaction {
  namespaceId: string = "";
  namespaceName: string = "";
  registerType: number = 0;
  registerTypeName: string = "";
  isExtend: boolean = false;
  duration?: number = 0;
  parentId?: string = "";
  parentName?: string = "";

  constructor(txnHash: string) {
    super(txnHash);
  }
}
