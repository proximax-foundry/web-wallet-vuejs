<template>
  <div>
    <div class="w-10/12 ml-auto mr-auto">
      <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8">
        <div class="xl:col-span-2 p-12">
          <div class="font-semibold mb-4">Harvester Transaction</div>
          <div
            v-if="showNoBalance"
            class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center"
          >
            <div
              class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"
            >
              <font-awesome-icon
                icon="times"
                class="text-red-500 h-3 w-3 absolute"
                style="top: 3px; left: 4px"
              ></font-awesome-icon>
            </div>
            <div class="inline-block text-xs">
              {{ $t("general.insufficientBalance") }}
            </div>
          </div>
          <div class="error error_box" v-if="err != ''">{{ err }}</div>
          <div class="mt-4">
            <div class="flex gap-1 mt-3">
              <SelectInputAccount :type="'dynamic'" :label="'Add Harvester'" />
              <SelectInputMultisigAccount :selected-address="selectedAddress" />
            </div>
            <div v-if="selectedMultisigAddress" class="mt-3">
              <MultisigInput
                :select-default-address="selectedMultisigAddress"
                :select-default-name="selectedMultisigName"
                label="Multisig account selected"
                :type="'dynamic'"
              />
            </div>
          </div>
          <div class="mt-3">
            <SelectActionType
              title="Type"
              v-model="actionType"
              :disabled="false"
            />
          </div>
          <div class="">
            <PublicKeyInputClean
              placeholder="Harvester Key"
              v-model="harvesterKey"
              v-debounce:1000="checkHarvester"
              :showError="showHarvesterError"
            />
          </div>
        </div>
        <div class="bg-navy-primary py-6 px-6 xl:col-span-1">
          <TxnSummary
            :signer-native-token-balance="balance"
            :native-token-balance="
              selectedMultisigAddress ? multisigBalance : balance
            "
            :lock-fund="lockFund"
            :lock-fund-tx-fee="lockFundTxFee"
            :selected-multisig-address="selectedMultisigAddress"
            :txn-fee="transactionFeeExact"
            :total-fee="Number(totalFeeFormatted)"
          />
          <div class="text-xs text-white my-5">
            {{ $t("general.enterPasswordContinue") }}
          </div>
          <PasswordInput
            :placeholder="$t('general.password')"
            :errorMessage="$t('general.passwordRequired')"
            :showError="showPasswdError"
            v-model="walletPassword"
            :disabled="disabledPassword"
          />
          <button
            type="submit"
            class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white"
            :disabled="disableSubmit"
            @click="createTxn"
          >
            Create harvester transaction
          </button>
          <div class="text-center">
            <router-link
              :to="{ name: 'ViewServices' }"
              class="content-center text-xs text-white border-b-2 border-white"
              >{{ $t("general.cancel") }}</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import PublicKeyInputClean from "@/modules/services/submodule/harvester/components/PublicKeyInputClean.vue";
import SelectInputAccount from "@/modules/transfer/components/SelectInputAccount.vue";
import SelectActionType from "@/modules/services/submodule/harvester/components/SelectActionType.vue";
import SelectInputMultisigAccount from "@/modules/transfer/components/SelectInputMultisigAccount.vue";
import MultisigInput from "@/modules/transfer/components/MultisigInput.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import TxnSummary from "@/components/TxnSummary.vue";
import { useI18n } from "vue-i18n";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from "@/util/typeHelper";
import { WalletUtils } from "@/util/walletUtils";
import { AppState } from "@/state/appState";
import { TransactionUtils } from "@/util/transactionUtils";
import {
  AddHarvesterTransactionBuilder,
  Address,
  HarvesterInfo,
  PublicAccount,
  RemoveHarvesterTransactionBuilder,
  UInt64
} from "tsjs-xpx-chain-sdk";
import type { TreeNode } from "primevue/treenode";
import { TransactionState } from "@/state/transactionState";

const toast = useToast();
const router = useRouter();

const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
const walletPassword = ref("");
const { t } = useI18n();
const err = ref("");
const passwdPattern = "^[^ ]{8,}$";
const showPasswdError = ref(false);
const disableAllInput = ref(false);
const actionType = ref("");
const harvesterKey = ref("");
const showHarvesterError = ref(true);
const ownerPublicAccount = ref<PublicAccount | null>();
const multisigPublicAccount = ref<PublicAccount | null>();
const harvesterPublicAccount = ref<PublicAccount | null>();
const disabledPassword = computed(
  () => showNoBalance.value || disableAllInput.value
);

const checkHarvester = () => {
  try {
    harvesterPublicAccount.value = PublicAccount.createFromPublicKey(
      harvesterKey.value,
      AppState.networkType
    );
    showHarvesterError.value = false;
  } catch (error) {
    showHarvesterError.value = true;
  }
};
/** */
try {
  ownerPublicAccount.value = WalletUtils.createPublicAccount(
    walletState.currentLoggedInWallet
      ? walletState.currentLoggedInWallet.selectDefaultAccount().publicKey
      : "",
    AppState.networkType
  );
} catch (error) {
  console.log(error);
}

const transactionFee = computed(() => {
  if (!AppState.isReady) {
    return "0";
  } else {
    let txn = AppState.buildTxn.addHarvester(Helper.samplePubAcc());
    if (selectedMultisigAddress.value) {
      let aggTxn = AppState.buildTxn.aggregateBonded([
        txn.toAggregateV1(Helper.samplePubAcc()),
      ]);
      return Helper.amountFormatterSimple(
        aggTxn.maxFee.compact(),
        AppState.nativeToken.divisibility
      );
    } else {
      return Helper.amountFormatterSimple(
        txn.maxFee.compact(),
        AppState.nativeToken.divisibility
      );
    }
  }
});

const transactionFeeExact = computed(() => {
  return Helper.convertNumberMinimumFormat(
    Number(transactionFee.value),
    AppState.nativeToken.divisibility
  );
});

const lockFund = computed(() => {
  if (networkState.currentNetworkProfileConfig) {
    return Helper.convertToExact(
      networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
      AppState.nativeToken.divisibility
    );
  } else {
    return 0;
  }
});

const lockFundTxFee = computed(() => {
  if (networkState.currentNetworkProfile) {
    return Helper.convertToExact(
      TransactionUtils.getLockFundFee(),
      AppState.nativeToken.divisibility
    );
  }
  return 0;
});
const lockFundTotalFee = computed(() => lockFund.value + lockFundTxFee.value);

const disableSubmit = computed(
  () =>
    !walletPassword.value.match(passwdPattern) ||
    harvesterKey.value == "" ||
    showHarvesterError.value ||
    showNoBalance.value ||
    !selectedAddress.value ||
    !ownerPublicAccount.value ||
    !actionType.value
);

const selectedMultisigAddress = ref<string | null>(null);
const selectedMultisigName = ref<string | null>(null);
const selectedAddress = ref<string | null>(null);
const balance = ref(0);
const multisigBalance = ref(0);

const fetchAccountBalance = async (address: string) => {
  if (!AppState.chainAPI) {
    return;
  }
  if (!address) {
    return;
  }
  try {
    const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(
      Address.createFromRawAddress(address)
    );
    const findIndex = accInfo.mosaics.findIndex(
      (asset) => asset.id.toHex() == AppState.nativeToken.assetId
    );
    if (findIndex != -1) {
      return (
        accInfo.mosaics[findIndex].amount.compact() /
        Math.pow(10, AppState.nativeToken.divisibility)
      );
    } else {
      return 0;
    }
  } catch (e) {
    return 0;
  }
};

const showNoBalance = computed(() => {
  if (!selectedAddress.value) {
    return;
  }
  if (selectedMultisigAddress.value) {
    if (balance.value < transactionFeeExact.value + lockFundTotalFee.value) {
      return true;
    } else {
      return false;
    }
  } else {
    return balance.value < transactionFeeExact.value;
  }
});

watch(selectedAddress, async (newValue, oldValue) => {
  if (newValue == null) {
    balance.value = 0;
    selectedMultisigName.value = null;
    selectedMultisigAddress.value = null;
    multisigPublicAccount.value = null;
  } else if (newValue != oldValue) {
    selectedMultisigName.value = null;
    selectedMultisigAddress.value = null;
    multisigPublicAccount.value = null;
    balance.value = await fetchAccountBalance(newValue);
  }
});

watch(selectedMultisigAddress, async (multisigNewValue, multisigOldValue) => {
  if (multisigNewValue == null) {
    multisigBalance.value = 0;
    selectedMultisigName.value = null;
    selectedMultisigAddress.value = null;
    multisigPublicAccount.value = null;
    balance.value = await fetchAccountBalance(selectedAddress.value);
  } else if (multisigNewValue != multisigOldValue) {
    multisigBalance.value = await fetchAccountBalance(multisigNewValue);
  }
});

// calculate fees
const totalFee = computed(() => {
  // if multisig
  if (selectedMultisigAddress.value) {
    return lockFundTotalFee.value + transactionFeeExact.value;
  } else {
    return transactionFeeExact.value;
  }
});

const totalFeeFormatted = computed(() => {
  return Helper.amountFormatterSimple(totalFee.value, 0);
});

const createTxn = async () => {
  let verifyPassword = WalletUtils.verifyWalletPassword(
    walletState.currentLoggedInWallet.name,
    networkState.chainNetworkName,
    walletPassword.value
  );
  if (!verifyPassword) {
    err.value = t("general.walletPasswordInvalid", {
      name: walletState.currentLoggedInWallet.name,
    });
    return;
  }
  let txnObj: {
      txnPayload: string;
      hashLockTxnPayload?: string;
    },
    {} = {};

  let txnBuilder:
    | AddHarvesterTransactionBuilder
    | RemoveHarvesterTransactionBuilder;

  const isAdding = actionType.value === "add";

  if (isAdding) {
    txnBuilder = AppState.buildTxn.addHarvesterBuilder();
  } else {
    txnBuilder = AppState.buildTxn.removeHarvesterBuilder();
  }

  try {
    const harvesterInfo: HarvesterInfo[] =
      await AppState.chainAPI.harvesterAPI.getAccountHarvestingHarvesterInfo(
        Helper.createPublicAccount(harvesterKey.value, AppState.networkType)
      );
    if (isAdding && harvesterInfo.length) {
      // harvester already added and is harvesting
      toast.add({
        severity: "error",
        detail: "Harvester key found, it is already added",
        group: "br-custom",
        life: 10000,
      });
      return;
    } else if (!isAdding && harvesterInfo.length === 0) {
      // harvester not exist, no need remove
      toast.add({
        severity: "error",
        detail: "Harvester key not found, does not need to be removed",
        group: "br-custom",
        life: 10000,
      });
      return;
    }
  } catch (error) {
    return;
  }

  if (selectedMultisigAddress.value) {
    const txn = txnBuilder.harvesterKey(harvesterPublicAccount.value).build();
    const innerTxn = txn.toAggregateV1(multisigPublicAccount.value);
    const innerTxns = [innerTxn];
    const nodeTime = await AppState.chainAPI.nodeAPI.getNodeTime();
    txnObj = TransactionUtils.signTxnWithPassword(
      selectedAddress.value,
      selectedMultisigAddress.value,
      walletPassword.value,
      null,
      innerTxns,
      new UInt64(nodeTime.sendTimeStamp!)
    );
  } else {
    const txn = txnBuilder.harvesterKey(harvesterPublicAccount.value).build();
    txnObj = TransactionUtils.signTxnWithPassword(
      selectedAddress.value,
      null,
      walletPassword.value,
      txn
    );
  }
  TransactionState.lockHashPayload = txnObj.hashLockTxnPayload;
  TransactionState.transactionPayload = txnObj.txnPayload;
  TransactionState.selectedAddress = selectedAddress.value;
  router.push({ name: "ViewConfirmTransaction" });
};

emitter.on("select-account", (address: string) => {
  selectedAddress.value = address;
});

emitter.on("select-account-public-key", (publicKey: string) => {
  ownerPublicAccount.value = WalletUtils.createPublicAccount(
    publicKey,
    AppState.networkType
  );
});

emitter.on("select-multisig-account", (node: TreeNode) => {
  selectedMultisigName.value = node.label;
  selectedMultisigAddress.value = node.value;
  multisigPublicAccount.value = WalletUtils.createPublicAccount(
    node.publicKey,
    AppState.networkType
  );
});
emitter.on("CLOSE_MULTISIG", () => {
  selectedMultisigName.value = null;
  selectedMultisigAddress.value = null;
});
</script>
<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

::deep(.p-inputtext) {
  font-size: 1rem;
  text-align: left;
  padding: 0.5rem;
}
</style>
