import { 
  Deadline
} from "tsjs-xpx-chain-sdk";
import { networkState } from "../state/networkState";
import { ChronoUnit } from "@js-joda/core"
import { UnitConverter } from '@/util/unitConverter';
import { TimeUnit } from '@/models/const/timeUnit';

export class ChainConfigUtils{

    static getABTMaxSafeDuration(): number{
      if(!networkState.currentNetworkProfileConfig){
        throw new Error("Service unavailable")
      }
      let targetTime = networkState.currentNetworkProfileConfig.blockGenerationTargetTime; 
      const targetTimeInSeconds = UnitConverter.configReturn(targetTime, TimeUnit.SECOND);

      let abtLifeTimeInSeconds = ChainConfigUtils.getABTMinConfigSeconds();

      let safeMaxBlockDuration = Math.floor(abtLifeTimeInSeconds/targetTimeInSeconds) - 1;

      return safeMaxBlockDuration;
    }

    static getABTMaxSafeDeadline(): Deadline{
      let abtLifeTimeInSeconds = ChainConfigUtils.getABTMinConfigSeconds();

      let safeMaxDeadline = Deadline.createForBonded(abtLifeTimeInSeconds - 5, ChronoUnit.SECONDS);

      return safeMaxDeadline;
    }

    static getABTMinConfigSeconds(): number{
      if(!networkState.currentNetworkProfileConfig){
        throw new Error("Service unavailable")
      }
      let abtMaxLifeTime = networkState.currentNetworkProfileConfig.maxBondedTransactionLifetime;
      let lockFundsMaxDuration = networkState.currentNetworkProfileConfig.maxHashLockDuration;

      const abtMaxLifeTimeInSeconds = UnitConverter.configReturn(abtMaxLifeTime, TimeUnit.SECOND);
      const lockFundsDurationInSeconds = UnitConverter.configReturn(lockFundsMaxDuration, TimeUnit.SECOND);

      let abtLifeTimeInSeconds = Math.min(abtMaxLifeTimeInSeconds, lockFundsDurationInSeconds);

      return abtLifeTimeInSeconds;
    }
}