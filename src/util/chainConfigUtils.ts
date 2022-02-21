import { 
  Deadline
} from "tsjs-xpx-chain-sdk";
import { networkState } from "../state/networkState";
import { ChronoUnit } from "@js-joda/core"
import { UnitConverter } from '@/util/unitConverter';
import { TimeUnit } from '@/models/const/timeUnit';

export class ChainConfigUtils{

    static getABTMaxSafeDuration(): number{
      let targetTime = networkState.currentNetworkProfileConfig.blockGenerationTargetTime;
      let abtLifeTime = networkState.currentNetworkProfileConfig.maxBondedTransactionLifetime;

      const targetTimeInSeconds = UnitConverter.configReturn(targetTime, TimeUnit.SECOND);
      const abtLifeTimeInSeconds = UnitConverter.configReturn(abtLifeTime, TimeUnit.SECOND);

      let safeMaxBlockDuration = Math.floor(abtLifeTimeInSeconds/targetTimeInSeconds) - 1;

      return safeMaxBlockDuration;
    }

    static getABTMaxSafeDeadline(): Deadline{
      let abtLifeTime = networkState.currentNetworkProfileConfig.maxBondedTransactionLifetime;

      const abtLifeTimeInSeconds = UnitConverter.configReturn(abtLifeTime, TimeUnit.SECOND);

      let safeMaxDeadline = Deadline.createForBonded(abtLifeTimeInSeconds - 5, ChronoUnit.SECONDS);

      return safeMaxDeadline;
    }
}