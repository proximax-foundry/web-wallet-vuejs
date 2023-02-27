import {
  ModifyMultisigAccountTransaction,
  MultisigAccountInfo,
  MultisigCosignatoryModificationType,
  Address,
} from "tsjs-xpx-chain-sdk";
import { AppState } from "@/state/appState";

export class CosignUtils {
  static findAllLevelCosigners(
    multisigAccountsInfoMap: Map<number, MultisigAccountInfo[]>
  ): string[] {
    let cosigners: string[] = [];

    const allKeys = [...multisigAccountsInfoMap.keys()];

    for (let i = 0; i < allKeys.length; ++i) {
      const level = allKeys[i];

      const multisigAccountsInfo = multisigAccountsInfoMap.get(level);
      if (!multisigAccountsInfo) {
        throw new Error("Service Unavailable");
      }
      const thisLevelCosigners =
        CosignUtils.findCosigners(multisigAccountsInfo);
      cosigners = cosigners.concat(thisLevelCosigners);
    }

    cosigners = Array.from(new Set(cosigners));

    return cosigners;
  }

  static findCosigners(multisigAccountsInfo: MultisigAccountInfo[]): string[] {
    const cosigners: string[] = [];

    for (let i = 0; i < multisigAccountsInfo.length; ++i) {
      if (
        multisigAccountsInfo[i].minApproval === 0 &&
        multisigAccountsInfo[i].minRemoval === 0
      ) {
        cosigners.push(multisigAccountsInfo[i].account.publicKey);
      }
    }

    return cosigners;
  }

  static isFulllySigned(
    multisigAccountInfo: MultisigAccountInfo,
    signedSigners: string[]
  ): boolean {
    if (multisigAccountInfo.isMultisig()) {
      const minApproval = multisigAccountInfo.minApproval;

      const intersectedCosigners = multisigAccountInfo.cosignatories.filter(
        (cosigner) => signedSigners.includes(cosigner.publicKey)
      );

      return intersectedCosigners.length >= minApproval;
    } else {
      return signedSigners.includes(multisigAccountInfo.account.publicKey);
    }
  }

  /**
   * @param modifyMultisigAccountTransaction
   * @param signedSigners - check only the direct cosigner of the txn signer
   */
  static async isModifyMultisigFullySigned(
    modifyMultisigAccountTransaction: ModifyMultisigAccountTransaction,
    signedSigners: string[]
  ): Promise<boolean> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    const removalCount = modifyMultisigAccountTransaction.modifications.filter(
      (mod) => mod.type === MultisigCosignatoryModificationType.Remove
    ).length;
    const addCount = modifyMultisigAccountTransaction.modifications.filter(
      (mod) => mod.type === MultisigCosignatoryModificationType.Add
    ).length;
    const addedPublicKeys = modifyMultisigAccountTransaction.modifications
      .filter((mod) => mod.type === MultisigCosignatoryModificationType.Add)
      .map((mod) => mod.cosignatoryPublicAccount.publicKey);

    try {
      if (!modifyMultisigAccountTransaction.signer) {
        throw new Error("Service unavailable");
      }
      const multisigInfo =
        await AppState.chainAPI.accountAPI.getMultisigAccountInfo(
          modifyMultisigAccountTransaction.signer.address
        );
      const minApproval = multisigInfo.minApproval;
      const minRemoval = multisigInfo.minRemoval;
      const cosinatories = multisigInfo.cosignatories.map(
        (cosigner) => cosigner.publicKey
      );

      const intersectedCosigners = cosinatories.filter((cosigner) =>
        signedSigners.includes(cosigner)
      );

      let isApproved = true;
      if (
        modifyMultisigAccountTransaction.minApprovalDelta !== 0 ||
        modifyMultisigAccountTransaction.minRemovalDelta !== 0
      ) {
        isApproved = intersectedCosigners.length >= minApproval ? true : false;
      }

      let isRemovalApproved = true;
      if (removalCount) {
        isRemovalApproved =
          intersectedCosigners.length >= minRemoval ? true : false;
      }

      let isAddingCosigned = true;
      if (addCount) {
        const addedIntersectedCosigner = addedPublicKeys.filter((cosigner) =>
          signedSigners.includes(cosigner)
        );
        isAddingCosigned =
          addedIntersectedCosigner.length === addedPublicKeys.length;
      }

      const approval = isApproved && isRemovalApproved && isAddingCosigned;

      return approval;
    } catch (error) {
      let isAddingCosigned = true;
      if (addCount) {
        const addedIntersectedCosigner = addedPublicKeys.filter((cosigner) =>
          signedSigners.includes(cosigner)
        );
        isAddingCosigned =
          addedIntersectedCosigner.length === addedPublicKeys.length;
      }

      const approval = isAddingCosigned;

      return approval;
    }
  }

  static async getAllDeepModifyMultisigCosigners(
    modifyMultisigAccountTransaction: ModifyMultisigAccountTransaction
  ): Promise<string[]> {
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    let neededSigners: string[] = [];

    const addedPublicKeys = modifyMultisigAccountTransaction.modifications
      .filter((mod) => mod.type === MultisigCosignatoryModificationType.Add)
      .map((mod) => mod.cosignatoryPublicAccount.publicKey);
    let oriCosigners: string[] = [];
    let searchingCosigners: string[] = [];
    if (!modifyMultisigAccountTransaction.signer) {
      throw new Error("Service unavailable");
    }
    const signer = modifyMultisigAccountTransaction.signer.publicKey;

    try {
      const multisigInfo =
        await AppState.chainAPI.accountAPI.getMultisigAccountInfo(
          modifyMultisigAccountTransaction.signer.address
        );
      oriCosigners = multisigInfo.cosignatories.map(
        (cosigner) => cosigner.publicKey
      );
    } catch (error) {
      neededSigners.push(signer);
    }

    searchingCosigners = oriCosigners.concat(addedPublicKeys);

    for (let i = 0; i < searchingCosigners.length; ++i) {
      try {
        const multisigGraphInfo =
          await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(
            Address.createFromPublicKey(
              searchingCosigners[i],
              AppState.networkType
            )
          );

        const allCosigner = CosignUtils.findAllLevelCosigners(
          multisigGraphInfo.multisigAccounts
        );

        neededSigners = neededSigners.concat(allCosigner);
      } catch (error) {
        neededSigners.push(searchingCosigners[i]);
      }
    }

    neededSigners = Array.from(new Set(neededSigners));

    return neededSigners;
  }

  static async getAllFlatModifyMultisigCosigners(
    modifyMultisigAccountTransaction: ModifyMultisigAccountTransaction
  ): Promise<string[]> {
    if (!modifyMultisigAccountTransaction.signer) {
      throw new Error("Service unavailable");
    }
    if (!AppState.chainAPI) {
      throw new Error("Service unavailable");
    }
    let neededSigners: string[] = [];

    const addedPublicKeys = modifyMultisigAccountTransaction.modifications
      .filter((mod) => mod.type === MultisigCosignatoryModificationType.Add)
      .map((mod) => mod.cosignatoryPublicAccount.publicKey);
    let oriCosigners: string[] = [];

    try {
      const multisigInfo =
        await AppState.chainAPI.accountAPI.getMultisigAccountInfo(
          modifyMultisigAccountTransaction.signer.address
        );
      oriCosigners = multisigInfo.cosignatories.map(
        (cosigner) => cosigner.publicKey
      );
    } catch (error) {}

    neededSigners = oriCosigners.concat(addedPublicKeys);

    neededSigners = Array.from(new Set(neededSigners));

    return neededSigners;
  }
}
