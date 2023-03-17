<template>
  <div v-if="!isMultiSig(selectedAccAdd)" class='font-bold text-xs text-blue-primary uppercase'>
    {{ $t('general.signerAcc') }}</div>
  <div v-else class='font-bold text-xs text-blue-primary uppercase'>{{ $t('general.multisigAcc') }}</div>
  <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1">
    <div class='font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase'>
      {{ $t('general.currentBalance') }}</div>
    <span class='ml-auto lg:col-span-2 col-span-3' v-html="splitCurrency(balance)"></span>
    <div class="flex">
      <div class='ml-1 text-blue-400 font-bold'>{{ currentNativeTokenName }}</div>
      <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
    </div>
  </div>
  <div v-if="fundStatus" class="mt-2 grid bg-yellow-50 p-3 rounded-md">
    <div class="flex gap-2">
      <img src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
      <div class="flex-cols">
        <div class="text-txs">{{ $t('general.insufficientBalanceWarning', { tokenName: currentNativeTokenName }) }}</div>
        <a v-if="networkType == 168" class="text-xs text-blue-primary font-semibold underline " :href="topUpUrl"
          target="_blank">{{ $t('general.topUp', { tokenName: currentNativeTokenName }) }}<img
            src="@/modules/dashboard/img/icon-new-page-link.svg" class="w-3 h-3 ml-2 inline-block"></a>
      </div>
    </div>
  </div>
  <div v-if="isMultisig && !isCosigner" class="mt-2 bg-yellow-50 p-3 rounded-md mb-2">
    <div class="flex items-center gap-2">
      <img src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
      <div class="text-txs">{{ $t('general.noCosigner') }}</div>
    </div>
  </div>
  <div v-if="onPartial" class="mt-2 grid bg-yellow-50 p-3 rounded-md">
    <div class="flex gap-2">
      <img src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
      <div class="text-txs">{{ $t('general.hasPartial') }}</div>
    </div>
  </div>
  <div v-if="isMultisigAlready" class="mt-2 grid bg-yellow-50 p-3 rounded-md">
    <div class="flex gap-2">
      <img src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
      <div class="text-txs">{{ $t('multisig.alreadyMultisig') }}</div>
    </div>
  </div>
  <div v-if="noNamespace" class="mt-2 bg-yellow-50 p-3 rounded-md mb-2">
    <div class="flex items-center gap-2">
      <img src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
      <div class="text-txs">{{ $t('namespace.noNamespace') }}</div>
    </div>
  </div>
  <div class='border-b-2 border-gray-600 mt-2' />
  <div v-if="sendXPX"
    class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs pt-2">
    <div class='font-semibold lg:col-span-2 col-span-3'>{{ $t('transfer.transferAmount') }}</div>
    <div v-if="isNaN(parseFloat(sendXPX))" class="lg:col-span-2 col-span-3 ml-auto">0</div>
    <div v-else class="lg:col-span-2 col-span-3 ml-auto">{{ sendXPX }}</div>
    <div class='ml-1 text-blue-400'>{{ currentNativeTokenName }}</div>
  </div>
  <div v-if="isMultiSig(selectedAccAdd) && selectedMosaic">
    <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs"
      v-for="(mosaic, index) in mosaicsCreated" :key="index">
      <div v-if="isNaN(parseFloat(selectedMosaic[index].amount))" class="lg:col-span-4 col-span-6 ml-auto">0</div>
      <div v-else class="lg:col-span-4 col-span-6 ml-auto">{{ selectedMosaic[index].amount }}</div>
      <div class="ml-1 text-blue-400" :index="index"> {{ displayAssetName(selectedMosaic[index].namespace) }} </div>
    </div>
  </div>
  <div v-if="assetRentalFeeCurrency"
    class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs pt-2">
    <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.assetRentalFee') }}</div>
    <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(assetRentalFeeCurrency)"></div>
    <div class='ml-1 text-blue-400'>{{ currentNativeTokenName }}</div>
  </div>
  <div v-if="namespaceRentalFeeCurrency"
    class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs pt-2">
    <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.namespacerentalFee') }}</div>
    <div class='ml-auto lg:col-span-2 col-span-3' v-html="splitCurrency(namespaceRentalFeeCurrency)"></div>
    <div class='ml-1 text-blue-400'>{{ currentNativeTokenName }}</div>
  </div>
  <div v-if="!isMultiSig(selectedAccAdd)">
    <div v-if="lockFundCurrencyConvert"
      class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs pt-2">
      <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.lockFund') }}</div>
      <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(lockFundCurrencyConvert)"></div>
      <div class='ml-1 text-blue-400'>{{ currentNativeTokenName }}</div>
    </div>
    <div v-if="lockFundTxFeeConvert"
      class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs pt-2">
      <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.lockFundTxFee') }}</div>
      <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(lockFundTxFeeConvert)"></div>
      <div class='ml-1 text-blue-400'>{{ currentNativeTokenName }}</div>
    </div>
    <div
      class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-2">
      <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.transactionFee') }}</div>
      <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(transactionFee)"></div>
      <div class='ml-1 text-blue-400'>{{ currentNativeTokenName }}</div>
    </div>
    <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between border-gray-600 text-white text-xs pt-3">
      <div class="font-bold uppercase lg:col-span-2 col-span-3">{{ $t('general.total') }}</div>
      <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(totalFeeFormatted)"></div>
      <div class='ml-1 mt-0.5 text-blue-400'>{{ currentNativeTokenName }}</div>
    </div>
    <div v-if="selectedMosaic" class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-white text-xs"
      v-for="(mosaic, index) in mosaicsCreated" :key="index">
      <div v-if="isNaN(parseFloat(selectedMosaic[index].amount))" class="lg:col-span-4 col-span-6 ml-auto">0</div>
      <div v-else class="lg:col-span-4 col-span-6 ml-auto">{{ selectedMosaic[index].amount }}</div>
      <div class="ml-1 text-blue-400" :index="index"> {{ displayAssetName(selectedMosaic[index].namespace) }} </div>
    </div>
  </div>
  <div v-else>
    <div v-if="getMultiSigCosigner && getMultiSigCosigner.cosignerList.length > 0">
      <div class='font-bold text-xs text-blue-primary uppercase pt-3'>{{ $t('general.signerAcc') }}</div>
      <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1">
        <div class='font-semibold text-xxs mt-2  lg:col-span-2 col-span-3 text-blue-primary uppercase'>
          {{ $t('general.currentBalance') }}</div>
        <span class='ml-auto font-bold lg:col-span-2 col-span-3' v-if="getMultiSigCosigner.cosignerList.length == 1">{{
          Helper.amountFormatterSimple(getMultiSigCosigner.cosignerList[0].balance, 0) }}</span>
        <span class='ml-auto font-bold lg:col-span-2 col-span-3' v-else>{{ checkCosignBalance }}</span>
        <div class="flex">
          <div class='ml-1 text-blue-400 font-bold'>{{ currentNativeTokenName }}</div>
          <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
        </div>
      </div>
      <div class='border-b-2 border-gray-600 mt-2' />
      <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs pt-2">
        <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.aggregateFee') }}</div>
        <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(transactionFee)"></div>
        <div class='ml-1 text-blue-400'>{{ currentNativeTokenName }}</div>
      </div>
      <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs pt-2">
        <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.lockFund') }}</div>
        <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(lockFundCurrency ?? 0)"></div>
        <div class='ml-1 text-blue-400'>{{ currentNativeTokenName }}</div>
      </div>
      <div
        class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between border-gray-600 border-b items-center text-gray-200 text-xs py-2">
        <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.lockFundTxFee') }}</div>
        <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(lockFundTxFee ?? 0)"></div>
        <div class='ml-1 text-blue-400'>{{ currentNativeTokenName }}</div>
      </div>
      <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between border-gray-600 text-white text-xs pt-3">
        <div class="font-bold uppercase lg:col-span-2 col-span-3">{{ $t('general.total') }}</div>
        <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(totalFeeFormatted)"></div>
        <div class='ml-1 mt-0.5 text-blue-400'>{{ currentNativeTokenName }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, type PropType } from 'vue';
import { AppState } from '@/state/appState';
import { walletState } from '@/state/walletState';
import { Helper } from "@/util/typeHelper";
import { networkState } from "@/state/networkState";

defineProps({
  transactionFee: {
    type: Number,
    required: true
  },
  lockFundCurrency: {
    type: Number,
    required: false
  },
  lockFundTxFee: {
    type: Number,
    required: false
  },
  totalFeeFormatted: {
    type: String,
    required: true
  },
  selectedAccAdd: {
    type: String,
    required: true
  },
  balance: {
    type: String,
    required: true
  },
  sendXPX: String,
  getMultiSigCosigner: {
    type: Object as PropType<{ hasCosigner: boolean, cosignerList: { publicKey: string, name: string, balance: number, address: string }[] }>,
    required: false
  },
  checkCosignBalance: String,
  selectedMosaic: Object,
  mosaicsCreated: Object,
  assetRentalFeeCurrency: String,
  namespaceRentalFeeCurrency: String,
  fundStatus: Boolean,
  isMultisig: Boolean,
  isCosigner: Boolean,
  onPartial: Boolean,
  isMultisigAlready: Boolean,
  lockFundCurrencyConvert: String,
  lockFundTxFeeConvert: String,
  noNamespace: Boolean,
})
const currentNativeTokenName = computed(() => AppState.nativeToken.label);
const isMultiSig = (address: string) => {
  if (walletState.currentLoggedInWallet) {
    const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address) || walletState.currentLoggedInWallet.others.find((account) => account.address == address);
    if (!account) {
      return false
    }
    return account.getDirectParentMultisig().length > 0
  }
  return false
};
const splitCurrency = (amount: string | number) => {
  let split = amount.toString().split(".")
  if (split[1] != undefined) {
    return '<span class="font-semibold text-sm">' + split[0] + '</span>.<span class="font-semibold text-xs">' + split[1] + '</span>';
  } else {
    return '<span class="font-semibold text-sm">' + split[0] + '</span>';
  }
};

const displayAssetName = (asset: string) => {

  // if there name less than 7 word, does not need to truncate
  if (asset.length <= 7) {
    return asset
  }
  else {
    let part1 = asset.slice(0, 3)
    let part2 = asset.slice(-4)
    return part1 + "..." + part2
  }
}
const topUpUrl = computed(() => {
  if (networkType.value == 168 && networkState.chainNetworkName == 'Sirius Testnet 1') {
    return 'https://bctestnetfaucet.xpxsirius.io/#/'
  } else if (networkType.value == 168 && networkState.chainNetworkName == 'Sirius Testnet 2') {
    return 'https://bctestnet2faucet.xpxsirius.io/#/'
  } else {
    return ''
  }
})

const networkType = computed(() => AppState.networkType)

</script>