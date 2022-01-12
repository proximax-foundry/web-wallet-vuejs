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
}