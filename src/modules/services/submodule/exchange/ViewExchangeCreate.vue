<template>
  <TransactionLayout class="mt-8">
    <template #white>
      <div>Create SDA-SDA Exchange</div>
      <div v-if="!selectedAddress" class="text-xs mt-3 text-blue-primary">
        Select Account to Create / Initiate Transaction
      </div>
      <SelectInputAccount />
      <SelectInputMultisigAccount
        class="md:mt-3"
        :selected-address="selectedAddress"
      />
      <div class="text-blue-primary text-xs mt-3">Asset to Give</div>
      <SelectInputAsset
        :selected-address="selectedAddress"
        :selected-multisig-address="selectedMultisigAddress"
      />
      <InputAmount
        class="mt-3"
        placeholder="Asset Amount"
        v-model="amountToGive"
        :decimal="assetToGive ? assetToGive.divisibility : 0"
      />
      <div
        class="text-red-500 text-xs"
        v-if="parseFloat(amountToGive) > assetToGive?.amount"
      >
        Insufficient Balance
      </div>
      <div class="text-blue-primary text-xs mt-3">Asset to Receive</div>
      <InputId
        class="mt-3"
        v-model="assetToReceive"
        :show-error="!assetValid"
        v-debounce:1000="checkAsset"
      />
      <InputAmount
        class="mt-3"
        placeholder="Asset Amount"
        v-model="amountToReceive"
        :decimal="
          assetToReceiveProperties ? assetToReceiveProperties.divisibility : 0
        "
      />
      <div
        class="text-red-500 text-xs"
        v-if="parseFloat(amountToReceive) > assetToReceiveProperties?.supply"
      >
        Exceeded Maximum Supply
      </div>
      <InputAmount
        class="mt-3"
        placeholder="Duration (Block)"
        v-model="duration"
        :decimal="0"
      />
      <div v-if="parseInt(duration) <= 57600" class="text-xs">
        Approximately {{ convertSecondsToDHMS(parseInt(duration) * 15) }}
      </div>
      <div class="text-red-500 text-xs" v-if="parseInt(duration) > 57600">
        Exceeded maximum duration
      </div>
    </template>

    <template #navy>
      <!-- { beginning of cost summary } -->
      <!-- { beginning of multisig summary } -->
      <div v-if="selectedMultisigAddress">
        <div class="font-bold text-xs text-blue-primary uppercase">
          {{ $t("general.multisigAcc") }}
        </div>

        <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1">
          <div
            class="font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase"
          >
            {{ $t("general.currentBalance") }}
          </div>
          <span
            class="ml-auto lg:col-span-2 col-span-3"
            v-html="getNativeTokenBalance(selectedMultisigAddress)"
          ></span>
          <div class="flex">
            <div class="ml-1 text-blue-400 font-bold">
              {{ AppState.nativeToken.label }}
            </div>
            <img
              src="@/modules/account/img/proximax-logo.svg"
              class="ml-1 h-5 w-5 mt-0.5"
            />
          </div>
        </div>

        <div
          v-if="assetToGive"
          class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1 items-center"
        >
          <div
            class="font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase"
          >
            Asset to Give
          </div>
          <span class="ml-auto lg:col-span-2 col-span-3">
            {{ amountToGive }}</span
          >
          <span class="ml-1 text-blue-400 text-xs">{{
            displayAssetName(
              assetToGive.namespace.length
                ? assetToGive.namespace
                : assetToGive.id
            )
          }}</span>
        </div>

        <div
          v-if="assetValid"
          class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1 items-center"
        >
          <div
            class="font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase"
          >
            Asset to Receive
          </div>
          <span class="ml-auto lg:col-span-2 col-span-3">{{
            amountToReceive
          }}</span>
          <span class="ml-1 text-blue-400 text-xs">{{
            displayAssetName(assetToReceiveProperties.namespace)
          }}</span>
        </div>

        <div class="border-b-2 border-gray-600 my-2" />
      </div>
      <!-- { end of multisig summary } -->
      <!-- { beginning of signer summary } -->
      <div class="font-bold text-xs text-blue-primary uppercase">
        {{ $t("general.signerAcc") }}
      </div>

      <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1">
        <div
          class="font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase"
        >
          {{ $t("general.currentBalance") }}
        </div>
        <span
          class="ml-auto lg:col-span-2 col-span-3"
          v-html="getNativeTokenBalance(selectedAddress)"
        ></span>
        <div class="flex">
          <div class="ml-1 text-blue-400 font-bold">
            {{ AppState.nativeToken.label }}
          </div>
          <img
            src="@/modules/account/img/proximax-logo.svg"
            class="ml-1 h-5 w-5 mt-0.5"
          />
        </div>
      </div>
      <div class="border-b-2 border-gray-600 mt-2" />
      <div v-if="!selectedMultisigAddress">
        <div
          v-if="assetToGive"
          class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1 items-center"
        >
          <div
            class="font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase"
          >
            Asset to Give
          </div>
          <span class="ml-auto lg:col-span-2 col-span-3 font-semibold">
            {{ amountToGive }}</span
          >
          <span class="ml-1 text-blue-400 text-xs">{{
            displayAssetName(
              assetToGive.namespace.length
                ? assetToGive.namespace
                : assetToGive.id
            )
          }}</span>
        </div>

        <div
          v-if="assetValid"
          class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1 items-center"
        >
          <div
            class="font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase"
          >
            Asset to Receive
          </div>
          <span class="ml-auto lg:col-span-2 col-span-3 font-semibold">{{
            amountToReceive
          }}</span>
          <span class="ml-1 text-blue-400 text-xs">{{
            displayAssetName(assetToReceiveProperties.namespace)
          }}</span>
        </div>
      </div>

      <div
        class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs py-2"
      >
        <div class="font-semibold lg:col-span-2 col-span-3">
          {{
            isMultisig
              ? $t("general.aggregateFee")
              : $t("general.transactionFee")
          }}
        </div>
        <div
          class="lg:col-span-2 col-span-3 ml-auto"
          v-html="splitCurrency(txnFee)"
        ></div>
        <div class="ml-1 text-blue-400">{{ AppState.nativeToken.label }}</div>
      </div>
      <div
        v-if="isMultisig"
        class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs"
      >
        <div class="font-semibold lg:col-span-2 col-span-3">
          {{ $t("general.lockFund") }}
        </div>
        <div
          class="lg:col-span-2 col-span-3 ml-auto"
          v-html="splitCurrency(lockFund ?? 0)"
        ></div>
        <div class="ml-1 text-blue-400">{{ AppState.nativeToken.label }}</div>
      </div>
      <div
        v-if="isMultisig"
        class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs py-2"
      >
        <div class="font-semibold lg:col-span-2 col-span-3">
          {{ $t("general.lockFundTxFee") }}
        </div>
        <div
          class="lg:col-span-2 col-span-3 ml-auto"
          v-html="splitCurrency(lockFundTxFee ?? 0)"
        ></div>
        <div class="ml-1 text-blue-400">{{ AppState.nativeToken.label }}</div>
      </div>
      <div class="border-b-2 border-gray-600 mt-2" />
      <div
        class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs py-2"
      >
        <div class="font-semibold lg:col-span-2 col-span-3 uppercase">
          Total
        </div>
        <div
          class="lg:col-span-2 col-span-3 ml-auto"
          v-html="splitCurrency(totalFee)"
        ></div>
        <div class="ml-1 text-blue-400">{{ AppState.nativeToken.label }}</div>
      </div>
      <!-- { end of signer summary } -->
      <!-- { end of cost summary } -->

      <div class="font-semibold text-xs text-white mb-1.5">
        {{ $t("general.enterPasswordContinue") }}
      </div>
      <PasswordInput
        :placeholder="$t('general.enterPassword')"
        v-model="walletPassword"
        icon="lock"
        class="mt-5 mb-3"
      />
      <button
        class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
        @click="exchangeCreate()"
      >
        Sell
      </button>
      <div class="text-center">
        <router-link
          :to="{ name: 'ViewDashboard' }"
          class="content-center text-xs text-white underline"
          >{{ $t("general.cancel") }}</router-link
        >
      </div>
    </template>
  </TransactionLayout>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, computed, watch } from "vue";
import SelectInputAccount from "./components/SelectInputAccount.vue";
import SelectInputAsset from "./components/SelectInputAsset.vue";
import InputAmount from "./components/InputAmount.vue";
import InputId from "./components/InputId.vue";
import {
  Account,
  Address,
  Deadline,
  ExchangeSdaHttp,
  MosaicId,
  NamespaceId,
  Password,
  PlaceSdaExchangeOfferTransaction,
  PublicAccount,
  SdaExchangeOffer,
  UInt64,
} from "tsjs-xpx-chain-sdk";
import { AppState } from "@/state/appState";
import SelectInputMultisigAccount from "./components/SelectInputMultisigAccount.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import TransactionLayout from "@/components/TransactionLayout.vue";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { WalletUtils } from "@/util/walletUtils";
import { TransactionUtils } from "@/util/transactionUtils";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { Helper } from "@/util/typeHelper";
import { lastValueFrom } from "rxjs";

const convertSecondsToDHMS = (seconds: number): string => {
  const day = Math.floor(seconds / (24 * 3600));
  const hour = Math.floor((seconds % (24 * 3600)) / 3600);
  const minute = Math.floor((seconds % 3600) / 60);
  const second = seconds % 60;

  let result = "";

  if (day > 0) {
    result += `${day} day${day > 1 ? "s" : ""} `;
  }
  if (hour > 0) {
    result += `${hour} hour${hour > 1 ? "s" : ""} `;
  }
  if (minute > 0) {
    result += `${minute} min${minute > 1 ? "s" : ""} `;
  }
  if (second > 0) {
    result += `${second} second${second > 1 ? "s" : ""}`;
  }

  return result.trim();
};

const knownToken = [
  {
    namespace: "prx.xpx",
    name: "XPX",
  },
  {
    namespace: "prx.metx",
    name: "METX",
  },
  {
    namespace: "xarcade.xar",
    name: "XAR",
  },
];

const displayAssetName = (name: string) => {
  const findKnownToken = knownToken.find((token) => token.namespace == name);
  if (findKnownToken) {
    return findKnownToken.name;
  }

  return name.length == 16
    ? name.substring(0, 4) +
        "..." +
        name.substring(name.length - 4, name.length + 1)
    : name;
};

const router = useRouter();

const toast = useToast();

const internalInstance = getCurrentInstance();

const emitter = internalInstance.appContext.config.globalProperties.emitter;

const selectedAddress = ref<string | null>(null);

const selectedMultisigAddress = ref<string | null>(null);

const assetToGive = ref<{
  id: string;
  amount: number;
  namespace: string;
  divisibility: number;
}>(null);

const assetValid = ref(false);

const amountToGive = ref("0");

const amountToReceive = ref("0");

const walletPassword = ref("");

const assetToReceive = ref("");

const duration = ref("57600");

const assetToReceiveProperties = ref<{
  supply: number;
  divisibility: number;
  namespace: string;
} | null>(null);

const isMultisig = computed(() => selectedMultisigAddress.value != null);

const splitCurrency = (amount: number) => {
  let split = amount.toString().split(".");
  if (split[1] != undefined) {
    return (
      '<span class="font-semibold text-sm">' +
      split[0] +
      '</span>.<span class="font-semibold text-xs">' +
      split[1] +
      "</span>"
    );
  } else {
    return '<span class="font-semibold text-sm">' + split[0] + "</span>";
  }
};

const lockFund = computed(() =>
  Helper.convertToExact(
    networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
    AppState.nativeToken.divisibility
  )
);
const lockFundTxFee = computed(() => {
  return Helper.convertToExact(
    TransactionUtils.getLockFundFee(),
    AppState.nativeToken.divisibility
  );
});

const txnFee = computed(() => {
  if (!AppState.isReady) {
    return 0;
  }
  const sdaExchangeOfferTxn = PlaceSdaExchangeOfferTransaction.create(
    Deadline.create(),
    [
      new SdaExchangeOffer(
        new MosaicId(AppState.nativeToken.assetId),
        UInt64.fromUint(
          parseFloat(amountToGive.value) *
            Math.pow(10, assetToGive.value?.divisibility ?? 0)
        ),
        new MosaicId(AppState.nativeToken.assetId),
        UInt64.fromUint(
          parseFloat(amountToReceive.value) *
            Math.pow(10, assetToReceiveProperties.value?.divisibility ?? 0)
        ),
        UInt64.fromUint(parseInt(duration.value))
      ),
    ],
    AppState.networkType
  );
  if (!isMultisig.value) {
    return (
      sdaExchangeOfferTxn.maxFee?.compact() /
      Math.pow(10, AppState.nativeToken.divisibility)
    );
  }
  const multisigAcc = [
    ...walletState.currentLoggedInWallet.accounts,
    ...walletState.currentLoggedInWallet.others,
  ].find((acc) => acc.address == selectedMultisigAddress.value);
  const innerTxn = [
    sdaExchangeOfferTxn.toAggregateV1(
      PublicAccount.createFromPublicKey(
        multisigAcc.publicKey,
        AppState.networkType
      )
    ),
  ];
  return (
    AppState.buildTxn.aggregateBonded(innerTxn).maxFee.compact() /
    Math.pow(10, AppState.nativeToken.divisibility)
  );
});

const getNativeTokenBalance = (address: string) => {
  const findAcc =
    walletState.currentLoggedInWallet.accounts.find(
      (acc) => acc.address == address
    ) ||
    walletState.currentLoggedInWallet.others.find(
      (acc) => acc.address == address
    );
  if (!findAcc) {
    return 0;
  }
  return splitCurrency(findAcc.balance);
};

const getNativeTokenBalanceNumber = (address: string) => {
  const findAcc =
    walletState.currentLoggedInWallet.accounts.find(
      (acc) => acc.address == address
    ) ||
    walletState.currentLoggedInWallet.others.find(
      (acc) => acc.address == address
    );
  if (!findAcc) {
    return 0;
  }
  return findAcc.balance;
};

emitter.on("select-account", (address: string) => {
  selectedAddress.value = address;
});

emitter.on("select-multisig-account", (address: string) => {
  selectedMultisigAddress.value = address;
});

emitter.on(
  "select-asset",
  (asset: {
    id: string;
    amount: number;
    namespace: string;
    divisibility: number;
  }) => {
    assetToGive.value = asset;
  }
);

const checkAsset = async () => {
  try {
    new NamespaceId(assetToReceive.value).fullName;
    const mosaicId = await AppState.chainAPI.namespaceAPI.getLinkedMosaicId(
      new NamespaceId(assetToReceive.value)
    );
    assetToReceive.value = mosaicId.toHex();
    const properties = await AppState.chainAPI.assetAPI.getMosaic(mosaicId);
    const namespaceName = await AppState.chainAPI.assetAPI.getMosaicsNames([
      mosaicId,
    ]);
    assetToReceiveProperties.value = {
      supply: properties.supply.compact(),
      divisibility: properties.divisibility,
      namespace: namespaceName.length
        ? namespaceName[0].names[0].name
        : mosaicId.toHex(),
    };
    assetValid.value = true;
    return;
  } catch (_) {
    assetValid.value = false;
    assetToReceiveProperties.value = null;
  }
  try {
    const id = new MosaicId(assetToReceive.value.toUpperCase());
    const properties = await AppState.chainAPI.assetAPI.getMosaic(id);
    const namespaceName = await AppState.chainAPI.assetAPI.getMosaicsNames([
      id,
    ]);
    assetToReceiveProperties.value = {
      supply: properties.supply.compact(),
      divisibility: properties.divisibility,
      namespace: namespaceName[0]?.names[0]?.name ?? id.toHex(),
    };
    assetValid.value = true;
  } catch (_) {
    assetValid.value = false;
    assetToReceiveProperties.value = null;
  }
};

watch(amountToGive, (n) => {
  if (isNaN(parseFloat(n))) {
    amountToGive.value = "0";
  }
});

watch(amountToReceive, (n) => {
  if (isNaN(parseFloat(n))) {
    amountToReceive.value = "0";
  }
});

const totalFee = computed(() => {
  if (isMultisig.value) {
    return (
      Math.round(
        (lockFund.value + lockFundTxFee.value + txnFee.value) *
          Math.pow(10, AppState.nativeToken.divisibility)
      ) / Math.pow(10, AppState.nativeToken.divisibility)
    );
  }

  if (
    assetToGive.value &&
    assetToGive.value.id.toLowerCase() ==
      AppState.nativeToken.assetId.toLowerCase()
  ) {
    return parseFloat(amountToGive.value) + txnFee.value;
  }
  return txnFee.value;
});

const exchangeCreate = async () => {
  if (selectedAddress.value == null) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Account is not selected",
      group: "br-custom",
      life: 1000,
    });
    return;
  }

  if (!assetToGive.value || !assetValid.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Asset is not selected",
      group: "br-custom",
      life: 1000,
    });
    return;
  }

  if (
    parseFloat(amountToReceive.value) <= 0 ||
    parseFloat(amountToGive.value) <= 0
  ) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Asset amount cannot be 0",
      group: "br-custom",
      life: 1000,
    });
    return;
  }

  if (parseFloat(amountToGive.value) > assetToGive.value?.amount) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Insufficient balance",
      group: "br-custom",
      life: 1000,
    });
    return;
  }

  if (
    parseFloat(amountToReceive.value) > assetToReceiveProperties.value?.supply
  ) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Exceeded maximum supply",
      group: "br-custom",
      life: 1000,
    });
    return;
  }

  if (parseInt(duration.value) > 57600 || parseInt(duration.value) <= 0) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Invalid duration",
      group: "br-custom",
      life: 1000,
    });
    return;
  }
  const signerBalance = getNativeTokenBalanceNumber(selectedAddress.value);
  if (isMultisig.value && signerBalance < totalFee.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Insufficient Balance",
      group: "br-custom",
      life: 1000,
    });
    return;
  }

  if (
    assetToGive.value.id.toLowerCase() ==
      AppState.nativeToken.assetId.toLowerCase() &&
    !isMultisig.value &&
    signerBalance < totalFee.value
  ) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Insufficient Balance",
      group: "br-custom",
      life: 1000,
    });
    return;
  }

  if (walletPassword.value.length < 8) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "password must be at least 8 characters",
      group: "br-custom",
      life: 1000,
    });
    return;
  }

  if (
    !WalletUtils.verifyWalletPassword(
      walletState.currentLoggedInWallet.name,
      networkState.chainNetworkName,
      walletPassword.value
    )
  ) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Incorrect password",
      group: "br-custom",
      life: 1000,
    });
    return;
  }
  const sdaExchangeHttp = new ExchangeSdaHttp(AppState.nodeFullURL);
  try {
    const accountExchangeOffers = await lastValueFrom(
      sdaExchangeHttp.getAccountSdaExchangeOffers(
        Address.createFromRawAddress(
          selectedMultisigAddress.value ?? selectedAddress.value
        )
      )
    );
    const findExistingPair = accountExchangeOffers.sdaOfferBalances.find(
      (offer) =>
        offer.mosaicIdGive.toHex().toLowerCase() ==
          assetToGive.value.id.toLowerCase() &&
        offer.mosaicIdGet.toHex().toLowerCase() ==
          assetToReceive.value.toLowerCase()
    );
    if (findExistingPair) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "You cannot create an existing pair from this account",
        group: "br-custom",
        life: 1000,
      });
      return;
    }
  } catch (error) {}

  const initiatorAcc = walletState.currentLoggedInWallet.accounts.find(
    (acc) => acc.address == selectedAddress.value
  );
  const sdaExchangeOfferTxn = PlaceSdaExchangeOfferTransaction.create(
    Deadline.create(),
    [
      new SdaExchangeOffer(
        new MosaicId(assetToGive.value.id),
        UInt64.fromUint(
          parseFloat(amountToGive.value) *
            Math.pow(10, assetToGive.value.divisibility)
        ),
        new MosaicId(assetToReceive.value),
        UInt64.fromUint(
          parseFloat(amountToReceive.value) *
            Math.pow(10, assetToReceiveProperties.value.divisibility)
        ),
        UInt64.fromUint(parseInt(duration.value))
      ),
    ],
    AppState.networkType
  );

  const privateKey = WalletUtils.decryptPrivateKey(
    new Password(walletPassword.value),
    initiatorAcc.encrypted,
    initiatorAcc.iv
  );
  walletPassword.value = "";

  const acc = Account.createFromPrivateKeyV1(privateKey, AppState.networkType);
  const generationHash = networkState.currentNetworkProfile.generationHash;
  if (isMultisig.value) {
    const multisigAcc = [
      ...walletState.currentLoggedInWallet.accounts,
      ...walletState.currentLoggedInWallet.others,
    ].find((acc) => acc.address == selectedMultisigAddress.value);
    const innerTxn = [
      sdaExchangeOfferTxn.toAggregateV1(
        PublicAccount.createFromPublicKey(
          multisigAcc.publicKey,
          AppState.networkType
        )
      ),
    ];
    const nodeTime = await AppState.chainAPI.nodeAPI.getNodeTime();
    const aggregateBondedTransaction = AppState.buildTxn.aggregateBonded(
      innerTxn,
      new UInt64(nodeTime.sendTimeStamp!)
    );
    const aggregateBondedTransactionSigned = acc.preV2Sign(
      aggregateBondedTransaction,
      generationHash
    );

    const hashLockTransaction = TransactionUtils.lockFundTx(
      aggregateBondedTransactionSigned
    );
    const hashLockTransactionSigned = acc.preV2Sign(
      hashLockTransaction,
      generationHash
    );
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(
      hashLockTransactionSigned,
      aggregateBondedTransactionSigned
    );
  } else {
    const signedTransaction = acc.preV2Sign(
      sdaExchangeOfferTxn,
      generationHash
    );
    await TransactionUtils.announceTransaction(signedTransaction);
  }
  router.push({
    name: "ViewAccountPendingTransactions",
    params: { address: acc.address.plain() },
  });
};
</script>
