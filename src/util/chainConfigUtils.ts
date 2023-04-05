import { Deadline } from "tsjs-xpx-chain-sdk";
import { networkState } from "../state/networkState";
import { ChronoUnit } from "@js-joda/core";
import { UnitConverter } from "@/util/unitConverter";
import { TimeUnit } from "@/models/const/timeUnit";

export class ChainConfigUtils {
  static getABTMaxSafeDuration(): number {
    if (!networkState.currentNetworkProfileConfig) {
      throw new Error("Service unavailable");
    }
    const targetTime =
      networkState.currentNetworkProfileConfig.blockGenerationTargetTime;
    const targetTimeInSeconds = UnitConverter.configReturn(
      targetTime,
      TimeUnit.SECOND
    );

    const abtLifeTimeInSeconds = ChainConfigUtils.getABTMinConfigSeconds();

    const safeMaxBlockDuration =
      Math.floor(abtLifeTimeInSeconds / targetTimeInSeconds) - 1;

    return safeMaxBlockDuration;
  }

  static getABTMaxSafeDeadline(): Deadline {
    const abtLifeTimeInSeconds = ChainConfigUtils.getABTMinConfigSeconds();

    const safeMaxDeadline = Deadline.createForBonded(
      abtLifeTimeInSeconds - 5,
      ChronoUnit.SECONDS
    );

    return safeMaxDeadline;
  }

  static getABTMinConfigSeconds(): number {
    if (!networkState.currentNetworkProfileConfig) {
      throw new Error("Service unavailable");
    }
    const abtMaxLifeTime =
      networkState.currentNetworkProfileConfig.maxBondedTransactionLifetime;
    const lockFundsMaxDuration =
      networkState.currentNetworkProfileConfig.maxHashLockDuration;

    const abtMaxLifeTimeInSeconds = UnitConverter.configReturn(
      abtMaxLifeTime,
      TimeUnit.SECOND
    );
    const lockFundsDurationInSeconds = UnitConverter.configReturn(
      lockFundsMaxDuration,
      TimeUnit.SECOND
    );

    const abtLifeTimeInSeconds = Math.min(
      abtMaxLifeTimeInSeconds,
      lockFundsDurationInSeconds
    );

    return abtLifeTimeInSeconds;
  }
}
