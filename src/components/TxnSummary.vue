<template>
  <div v-if="selectedMultisigAddress">
    <DisplaySelectedAccount>
      <template #selectedAcc>
        {{ $t("general.multisigAcc") }}
      </template>
      <template #accBalance>
        <div v-html="splitCurrency(nativeTokenBalance ?? 0)"></div>
      </template>
    </DisplaySelectedAccount>

    <div
      v-if="
        nativeAmount || namespaceRentalFeeCurrency || assetRentalFeeCurrency
      "
    >
      <TransactionFeeLayout>
        <template #transactionType>
          <div v-if="nativeAmount">
            {{ $t("transfer.transferAmount") }}
          </div>
          <div v-else-if="namespaceRentalFeeCurrency">
            {{ $t("general.namespacerentalFee") }}
          </div>
          <div v-else-if="assetRentalFeeCurrency">
            {{ $t("general.assetRentalFee") }}
          </div>
        </template>
        <template #transactionTypeFee>
          <div v-if="nativeAmount">
            <div v-html="splitCurrency(nativeAmount ?? 0)"></div>
          </div>
          <div v-else-if="namespaceRentalFeeCurrency">
            <div v-html="splitCurrency(namespaceRentalFeeCurrency ?? 0)"></div>
          </div>
          <div v-else-if="assetRentalFeeCurrency">
            <div v-html="splitCurrency(assetRentalFeeCurrency ?? 0)"></div>
          </div>
        </template>
      </TransactionFeeLayout>
    </div>
    <div
      v-if="selectedAssets"
      class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-white text-xs"
      v-for="(asset, index) in selectedAssets"
      :key="index"
    >
      <div
        v-if="isNaN(parseFloat(asset.amount)) && asset.id != null"
        class="lg:col-span-4 col-span-6 ml-auto"
      >
        0
      </div>
      <div v-else class="lg:col-span-4 col-span-6 ml-auto">
        {{ asset.amount }}
      </div>
      <div class="ml-1 text-blue-400" :index="index" v-if="asset.id != null">
        {{
          displayAssetName(asset.namespace == "" ? asset.id : asset.namespace)
        }}
      </div>
    </div>
    <div class="border-b-2 border-gray-600 my-2" />
  </div>
  <!-- { end of multisig summary } -->
  <!-- { beginning of signer summary } -->
  <DisplaySelectedAccount>
    <template #selectedAcc>
      {{ $t("general.signerAcc") }}
    </template>
    <template #accBalance>
      <div
        v-html="
          splitCurrency(
            selectedMultisigAddress
              ? signerNativeTokenBalance
              : nativeTokenBalance ?? 0
          )
        "
      ></div>
    </template>
  </DisplaySelectedAccount>
  <div class="border-b-2 border-gray-600 mt-2" />
  <div v-if="!selectedMultisigAddress">
    <div
      v-if="
        nativeAmount || namespaceRentalFeeCurrency || assetRentalFeeCurrency
      "
    >
      <TransactionFeeLayout>
        <template #transactionType>
          <div v-if="nativeAmount">
            {{ $t("transfer.transferAmount") }}
          </div>
          <div v-else-if="namespaceRentalFeeCurrency">
            {{ $t("general.namespacerentalFee") }}
          </div>
          <div v-else-if="assetRentalFeeCurrency">
            {{ $t("general.assetRentalFee") }}
          </div>
        </template>
        <template #transactionTypeFee>
          <div v-if="nativeAmount">
            <div v-html="splitCurrency(nativeAmount ?? 0)"></div>
          </div>
          <div v-else-if="namespaceRentalFeeCurrency">
            <div v-html="splitCurrency(namespaceRentalFeeCurrency ?? 0)"></div>
          </div>
          <div v-else-if="assetRentalFeeCurrency">
            <div v-html="splitCurrency(assetRentalFeeCurrency ?? 0)"></div>
          </div>
        </template>
      </TransactionFeeLayout>
    </div>
    <div
      v-if="selectedAssets"
      class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-white text-xs"
      v-for="(asset, index) in selectedAssets"
      :key="index"
    >
      <div
        v-if="isNaN(parseFloat(asset.amount)) && asset.id != null"
        class="lg:col-span-4 col-span-6 ml-auto"
      >
        0
      </div>
      <div v-else class="lg:col-span-4 col-span-6 ml-auto">
        {{ asset.amount }}
      </div>
      <div class="ml-1 text-blue-400" :index="index" v-if="asset.id != null">
        {{
          displayAssetName(asset.namespace == "" ? asset.id : asset.namespace)
        }}
      </div>
    </div>
  </div>

  <TransactionFeeLayout>
    <template #transactionType>
      {{
        selectedMultisigAddress != null
          ? $t("general.aggregateFee")
          : $t("general.transactionFee")
      }}
    </template>
    <template #transactionTypeFee>
      <div v-html="splitCurrency(txnFee)"></div>
    </template>
  </TransactionFeeLayout>

  <div v-if="selectedMultisigAddress != null">
    <TransactionFeeLayout>
      <template #transactionType>
        {{ $t("general.lockFund") }}
      </template>
      <template #transactionTypeFee>
        <div v-html="splitCurrency(lockFund ?? 0)"></div>
      </template>
    </TransactionFeeLayout>

    <TransactionFeeLayout>
      <template #transactionType>
        {{ $t("general.lockFundTxFee") }}
      </template>
      <template #transactionTypeFee>
        <div v-html="splitCurrency(lockFundTxFee ?? 0)"></div>
      </template>
    </TransactionFeeLayout>
  </div>

  <div class="border-b-2 border-gray-600 mt-2" />

  <TransactionFeeLayout>
    <template #transactionType>
      <div class="uppercase">total</div>
    </template>
    <template #transactionTypeFee>
      <div v-html="splitCurrency(totalFee)"></div>
    </template>
  </TransactionFeeLayout>
</template>

<script setup lang="ts">
import { AppState } from "@/state/appState";
import DisplaySelectedAccount from "./DisplaySelectedAccount.vue";
import TransactionFeeLayout from "./TransactionFeeLayout.vue";
import { computed } from "vue";
import { networkState } from "@/state/networkState";

defineProps({
  selectedMultisigAddress: {
    type: String || null,
  },
  nativeTokenBalance: {
    type: Number,
    required: true,
  },
  selectedAssets: {
    type: Array<{
      id: string;
      balance: number;
      namespace: string;
      divisibility: number;
      amount: string;
    }>,
    required: false,
  },
  lockFund: {
    type: Number,
    required: true,
  },
  txnFee: {
    type: Number,
    required: true,
  },
  lockFundTxFee: {
    type: Number,
    required: true,
  },
  totalFee: {
    type: Number,
    required: true,
  },
  nativeAmount: {
    type: String,
    required: false,
  },
  signerNativeTokenBalance: {
    type: Number,
    required: true,
  },
  namespaceRentalFeeCurrency: {
    type: String,
    required: false,
  },
  assetRentalFeeCurrency: {
    type: String,
    required: false,
  },
});

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

const splitCurrency = (amount: string | number) => {
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

const networkType = computed(() => AppState.networkType);

const topUpUrl = computed(() => {
  if (
    networkType.value == 168 &&
    networkState.chainNetworkName == "Sirius Testnet 1"
  ) {
    return "https://bctestnetfaucet.xpxsirius.io/#/";
  } else if (
    networkType.value == 168 &&
    networkState.chainNetworkName == "Sirius Testnet 2"
  ) {
    return "https://bctestnet2faucet.xpxsirius.io/#/";
  } else {
    return "";
  }
});
</script>
