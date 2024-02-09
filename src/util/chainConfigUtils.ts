import { 
  Deadline,
  UInt64
} from "tsjs-xpx-chain-sdk";
import { networkState } from "../state/networkState";
import { ChronoUnit } from "@js-joda/core"
import { UnitConverter } from '@/util/unitConverter';
import { TimeUnit } from '@/models/const/timeUnit';

export class ChainConfigUtils{

    static getABTMaxSafeDuration(): number{
      let targetTime = networkState.currentNetworkProfileConfig.blockGenerationTargetTime; 
      const targetTimeInSeconds = UnitConverter.configReturn(targetTime, TimeUnit.SECOND);

      let abtLifeTimeInSeconds = ChainConfigUtils.getABTMinConfigSeconds();

      let safeMaxBlockDuration = Math.floor(abtLifeTimeInSeconds/targetTimeInSeconds) - 1;

      return safeMaxBlockDuration;
    }

    static getABTMaxSafeDeadline(currentNodeTimetamp?: UInt64): Deadline{
      let abtLifeTimeInSeconds = ChainConfigUtils.getABTMinConfigSeconds();

      let safeMaxDeadline: Deadline;

      if(currentNodeTimetamp){
        let deadlineUint64 = UInt64.fromUint(currentNodeTimetamp.compact() + ((abtLifeTimeInSeconds - 5) * 1000));

        safeMaxDeadline = Deadline.createFromUint64(deadlineUint64);
      }
      else{
        safeMaxDeadline = Deadline.createForBonded(abtLifeTimeInSeconds - 5, ChronoUnit.SECONDS);
      }

      return safeMaxDeadline;
    }

    static getABTMinConfigSeconds(): number{
      let abtMaxLifeTime = networkState.currentNetworkProfileConfig.maxBondedTransactionLifetime;
      let lockFundsMaxDuration = networkState.currentNetworkProfileConfig.maxHashLockDuration;

      const abtMaxLifeTimeInSeconds = UnitConverter.configReturn(abtMaxLifeTime, TimeUnit.SECOND);
      const lockFundsDurationInSeconds = UnitConverter.configReturn(lockFundsMaxDuration, TimeUnit.SECOND);

      let abtLifeTimeInSeconds = Math.min(abtMaxLifeTimeInSeconds, lockFundsDurationInSeconds);

      return abtLifeTimeInSeconds;
    }
}