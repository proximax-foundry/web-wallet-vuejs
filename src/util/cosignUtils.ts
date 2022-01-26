import { ModifyMultisigAccountTransaction, MultisigAccountInfo, MultisigCosignatoryModificationType,
    Address
} from "tsjs-xpx-chain-sdk";
import { AppState } from "@/state/appState";

export class CosignUtils{

    static findAllLevelCosigners(multisigAccountsInfoMap: Map<number, MultisigAccountInfo[]>): string[]{

        let cosigners: string[] = [];

        let allKeys = [...multisigAccountsInfoMap.keys()];

        for(let i =0; i < allKeys.length; ++i){
            let level = allKeys[i];

            let multisigAccountsInfo = multisigAccountsInfoMap.get(level); 
            
            let thisLevelCosigners = CosignUtils.findCosigners(multisigAccountsInfo);
            cosigners = cosigners.concat(thisLevelCosigners);
        }

        cosigners = Array.from(new Set(cosigners));

        return cosigners;
    }


    static findCosigners(multisigAccountsInfo: MultisigAccountInfo[]): string[]{

        let cosigners: string[] = [];

        for(let i =0; i < multisigAccountsInfo.length; ++i){
            if(multisigAccountsInfo[i].minApproval === 0 && multisigAccountsInfo[i].minRemoval === 0){
                cosigners.push(multisigAccountsInfo[i].account.publicKey);
            }
        }

        return cosigners;
    }

    static isFulllySigned(multisigAccountInfo:MultisigAccountInfo, signedSigners: string[]): boolean{

        if(multisigAccountInfo.isMultisig()){
            let minApproval = multisigAccountInfo.minApproval;

            let intersectedCosigners = multisigAccountInfo.cosignatories.filter(cosigner => signedSigners.includes(cosigner.publicKey));

            return intersectedCosigners.length >= minApproval;

        }else{
            return signedSigners.includes(multisigAccountInfo.account.publicKey);
        }
    }

    /**
    * @param modifyMultisigAccountTransaction
    * @param signedSigners - check only the direct cosigner of the txn signer
    */
    static async isModifyMultisigFullySigned(modifyMultisigAccountTransaction: ModifyMultisigAccountTransaction, signedSigners: string[]): Promise<boolean>{

        let removalCount = modifyMultisigAccountTransaction.modifications.filter(mod=>mod.type === MultisigCosignatoryModificationType.Remove).length;
        let addCount = modifyMultisigAccountTransaction.modifications.filter(mod=>mod.type === MultisigCosignatoryModificationType.Add).length;
        let addedPublicKeys = modifyMultisigAccountTransaction.modifications.filter(mod=>mod.type === MultisigCosignatoryModificationType.Add).map(mod=> mod.cosignatoryPublicAccount.publicKey);

        try {
            let multisigInfo = await AppState.chainAPI.accountAPI.getMultisigAccountInfo(modifyMultisigAccountTransaction.signer.address);
            let minApproval = multisigInfo.minApproval;    
            let minRemoval = multisigInfo.minRemoval;
            let cosinatories = multisigInfo.cosignatories.map(cosigner => cosigner.publicKey);

            let intersectedCosigners = cosinatories.filter(cosigner => signedSigners.includes(cosigner));

            let isApproved = true;
            if(modifyMultisigAccountTransaction.minApprovalDelta !== 0 || modifyMultisigAccountTransaction.minRemovalDelta !== 0){
                isApproved = intersectedCosigners.length >= minApproval ? true : false;
            }
            
            let isRemovalApproved = true;
            if(removalCount){
                isRemovalApproved = intersectedCosigners.length >= minRemoval ? true : false;
            }

            let isAddingCosigned = true;
            if(addCount){
                let addedIntersectedCosigner = addedPublicKeys.filter(cosigner => signedSigners.includes(cosigner));
                isAddingCosigned = addedIntersectedCosigner.length === addedPublicKeys.length;
            }

            let approval =  isApproved && isRemovalApproved && isAddingCosigned;

            return approval;
            
        } catch (error) {
            let isAddingCosigned = true;
            if(addCount){
                let addedIntersectedCosigner = addedPublicKeys.filter(cosigner => signedSigners.includes(cosigner));
                isAddingCosigned = addedIntersectedCosigner.length === addedPublicKeys.length;
            }

            let approval = isAddingCosigned;

            return approval;
        }
    }

    static async getAllDeepModifyMultisigCosigners(modifyMultisigAccountTransaction: ModifyMultisigAccountTransaction): Promise<string[]>{
        let neededSigners: string[] = [];

        let removalCount = modifyMultisigAccountTransaction.modifications.filter(mod=>mod.type === MultisigCosignatoryModificationType.Remove).length;
        let addCount = modifyMultisigAccountTransaction.modifications.filter(mod=>mod.type === MultisigCosignatoryModificationType.Add).length;
        let addedPublicKeys = modifyMultisigAccountTransaction.modifications.filter(mod=>mod.type === MultisigCosignatoryModificationType.Add).map(mod=> mod.cosignatoryPublicAccount.publicKey);
        let removedPublicKeys = modifyMultisigAccountTransaction.modifications.filter(mod=>mod.type === MultisigCosignatoryModificationType.Remove).map(mod=> mod.cosignatoryPublicAccount.publicKey);
        let oriCosigners: string[] = [];
        let searchingCosigners: string[] = [];

        let signer = modifyMultisigAccountTransaction.signer.publicKey;

        try {
            let multisigInfo = await AppState.chainAPI.accountAPI.getMultisigAccountInfo(modifyMultisigAccountTransaction.signer.address);
            let minApproval = multisigInfo.minApproval;    
            let minRemoval = multisigInfo.minRemoval;
            oriCosigners = multisigInfo.cosignatories.map(cosigner => cosigner.publicKey);
            
        } catch (error) {
            neededSigners.push(signer);
        }

        searchingCosigners = oriCosigners.concat(addedPublicKeys);

        for(let i =0; i < searchingCosigners.length; ++i){

            try {
                let multisigGraphInfo = await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(Address.createFromPublicKey(searchingCosigners[i], AppState.networkType));

                let allCosigner = CosignUtils.findAllLevelCosigners(multisigGraphInfo.multisigAccounts);

                neededSigners = neededSigners.concat(allCosigner);
            } catch (error) {
                neededSigners.push(searchingCosigners[i]);
            }
        }

        neededSigners = Array.from(new Set(neededSigners));

        return neededSigners;
    }

    static async getAllFlatModifyMultisigCosigners(modifyMultisigAccountTransaction: ModifyMultisigAccountTransaction): Promise<string[]>{
        let neededSigners: string[] = [];

        let removalCount = modifyMultisigAccountTransaction.modifications.filter(mod=>mod.type === MultisigCosignatoryModificationType.Remove).length;
        let addCount = modifyMultisigAccountTransaction.modifications.filter(mod=>mod.type === MultisigCosignatoryModificationType.Add).length;
        let addedPublicKeys = modifyMultisigAccountTransaction.modifications.filter(mod=>mod.type === MultisigCosignatoryModificationType.Add).map(mod=> mod.cosignatoryPublicAccount.publicKey);
        let removedPublicKeys = modifyMultisigAccountTransaction.modifications.filter(mod=>mod.type === MultisigCosignatoryModificationType.Remove).map(mod=> mod.cosignatoryPublicAccount.publicKey);
        let oriCosigners: string[] = [];
        let searchingCosigners: string[] = [];

        let signer = modifyMultisigAccountTransaction.signer.publicKey;

        try {
            let multisigInfo = await AppState.chainAPI.accountAPI.getMultisigAccountInfo(modifyMultisigAccountTransaction.signer.address);
            let minApproval = multisigInfo.minApproval;    
            let minRemoval = multisigInfo.minRemoval;
            oriCosigners = multisigInfo.cosignatories.map(cosigner => cosigner.publicKey);
            
        } catch (error) {

        }

        neededSigners = oriCosigners.concat(addedPublicKeys);

        neededSigners = Array.from(new Set(neededSigners));

        return neededSigners;
    }
}