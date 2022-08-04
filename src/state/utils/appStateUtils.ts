import { AppState } from "../appState";

export class AppStateUtils{

  static setStateReady(stateName: string){
    AppState.readyStates.set(stateName, true);

    AppStateUtils.checkIsReady();
  }

  static addNewReadyStates(stateName: string){
    AppState.readyStates.set(stateName, false);
    AppState.isReady = false;
  }

  static checkIsReady(){
    let totalNum = AppState.readyStates.size;
    let totalReady = 0;

    AppState.readyStates.forEach((value, key)=>{
      if(value){
        totalReady++;
      }
    })

    if(totalReady === totalNum){
      AppState.isReady = true;
    }
  }

  static updateActivityLogNum(){
    AppState.txnActivityLogNum = AppState.txnActivityLog.length;
  }

  static addCosignLogNum(){
    AppState.txnCosignLogNum = AppState.txnCosignLogNum + 1;
  }

  static doLogout(){
    AppState.pendingAssetsInfo = [];
    AppState.pendingNamespacesName = [];
    AppState.readBlockHeight = 0;
    AppState.txnActivityLog = [];
    AppState.txnCosignLog = [];
    AppState.txnSwapLog = [];
    AppState.txnActivityLogNum = 0;
    AppState.txnCosignLogNum = 0;
  }
}