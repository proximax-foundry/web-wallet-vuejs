<template>
  <div>

    <div class='w-10/12 ml-auto mr-auto'>
      <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8">
        <div class="xl:col-span-2 p-6 lg:p-12">
          <div class="lg:flex lg:justify-between lg:items-center">
            <div class='font-semibold mb-4 inline-block mt-1'>{{ $t('asset.modifyAssetSupply') }}</div>
            <div class="flex items-center">
              <div v-html="svgString" class="inline-block" />
              <div class="ml-2">
                <div class="text-blue-primary text-xxs font-bold uppercase mb-1">{{ $t('asset.assetCreatedBy') }}</div>
                <div class="font-bold text-black text-sm">{{ selectedAccName }}</div>
              </div>
            </div>
          </div>
          <div v-if="!assetMutable" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
            <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon
                icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div>
            <div class="inline-block text-xs">Asset is immutable</div>
          </div>
          <div v-if="showNoBalance" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
            <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon
                icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div>
            <div class="inline-block text-xs">{{ $t('general.insufficientBalance') }}</div>
          </div>
          <div v-else-if="isNotCosigner" class="rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center">
            <div class="rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"><font-awesome-icon
                icon="exclamation" class="text-yellow-500 h-3 w-3 absolute"
                style="top: 5px; left:7px"></font-awesome-icon></div>
            <div class="inline-block text-xs">{{ $t('general.noCosigner') }}</div>
          </div>
          <div class="error error_box" v-if="err != ''">{{ err }}</div>
          <div class="text-right w-full">
            <div v-if="getMultiSigCosigner.cosignerList.length > 0" class="inline-block">
              <div class="text-tsm text-left mt-3">{{ $t('general.initiateBy') }}:
                <span class="font-bold" v-if="getMultiSigCosigner.cosignerList.length == 1">{{
                  getMultiSigCosigner.cosignerList[0].name }} ({{ $t('general.balance') }}: {{
    Helper.amountFormatterSimple(getMultiSigCosigner.cosignerList[0].balance, 0) }}
                  {{ currentNativeTokenName }}) <span
                    v-if="getMultiSigCosigner.cosignerList[0].balance < lockFundTotalFee" class="error">- {{
                      $t('general.insufficientBalance') }}</span></span>
                <span class="font-bold" v-else><select v-model="cosignerAddress">
                    <option v-for="(cosigner, item) in getMultiSigCosigner.cosignerList" :value="cosigner.address"
                      :key="item">{{ cosigner.name }} ({{ $t('general.balance') }}: {{ cosigner.balance }} {{
                        currentNativeTokenName }})</option>
                  </select></span>
                <div v-if="cosignerBalanceInsufficient" class="error">- {{ $t('general.insufficientBalance') }}</div>
              </div>
            </div>
          </div>
          <div class="border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5">
            <img src="@/modules/services/submodule/assets/img/icon-asset.svg">
            <div class="ml-1">
              <div class="uppercase text-blue-primary font-semibold text-xxs">{{ $t('general.assetId') }}</div>
              <div class="text-black text-sm font-bold">{{ selectAsset }}</div>
            </div>
          </div>
          <div class="border border-gray-200 p-4 rounded mt-5">
            <div class="lg:grid lg:grid-cols-2">
              <div class="my-3">
                <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">{{ $t('asset.currentSupply') }}<img
                    src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;"
                    v-tooltip.bottom="{ value: '<tiptext>' + $t('asset.supplyMsg2') + '<br>' + $t('asset.supplyMsg3') + '</tiptext>', escape: true }">
                </div>
                <div class="text-black font-bold text-sm">{{ assetBalance }}</div>
              </div>
              <div class="my-3">
                <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">{{ $t('general.divisibility') }}<img
                    src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;"
                    v-tooltip.bottom="{ value: '<tiptext>' + $t('asset.divisibilityMsg4') + '<br><br>' + $t('asset.divisibilityMsg2') + '<br>' + $t('asset.divisibilityMsg3') + '</tiptext>', escape: true }">
                </div>
                <div class="text-black font-bold text-sm">{{ assetDivisibility }}</div>
              </div>
              <div class="my-3">
                <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">{{ $t('general.transferable') }}<img
                    src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;"
                    v-tooltip.bottom="{ value: '<tiptext>' + $t('asset.transferableMsg') + '</tiptext>', escape: true }">
                </div>
                <div class="uppercase text-black font-bold text-sm">{{ assetTransferable ? $t('general.yes') :
                  $t('general.no') }}</div>
              </div>
              <div class="my-3">
                <div class="text-xxs text-blue-primary uppercase mb-1 font-bold">{{ $t('general.supplyMutable') }}<img
                    src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;"
                    v-tooltip.bottom="{ value: '<tiptext>' + $t('asset.supplyMutableMsg') + '</tiptext>', escape: true }">
                </div>
                <div class="uppercase text-black font-bold text-sm">{{ assetMutable ? $t('general.yes') : $t('general.no')
                }}</div>
              </div>
            </div>
          </div>
          <div class="lg:grid lg:grid-cols-2 mt-5">
            <SelectModificationType :title="$t('asset.modificationType')" class="lg:mr-4"
              v-model="selectIncreaseDecrease" />
            <SupplyInputClean :disabled="showNoBalance || isNotCosigner" v-model="supply"
              :balance="(maxAssetSupply - assetSupply)"
              :placeholder="$t('asset.quantityOf', { value: selectIncreaseDecrease })" type="text" icon="coins"
              :showError="showSupplyErr"
              :errorMessage="selectIncreaseDecrease == 'increase' ? ' The total asset supply should not exceed 900T' : ' You have exceeded the maximum value for decrease asset supply.'"
              :divisibility="Number(assetDivisibility)" class="lg:ml-4" />
          </div>
        </div>
        <div class="bg-navy-primary py-6 px-12 xl:col-span-1">
          <TransactionFeeDisplay :transaction-fee="Number(transactionFee)" :total-fee-formatted="totalFeeFormatted"
            :get-multi-sig-cosigner="getMultiSigCosigner" :check-cosign-balance="checkCosignBalance.toString()"
            :lock-fund-currency="Number(lockFundCurrency)" :lock-fund-tx-fee="lockFundTxFee" :balance="balance.toString()"
            :selected-acc-add="selectedAccAdd" />
          <div class='text-xs text-white mt-5 mb-1.5'>{{ $t('general.enterPasswordContinue') }}</div>
          <PasswordInput :placeholder="$t('general.password')" :errorMessage="$t('general.passwordRequired')"
            :showError="showPasswdError" v-model="walletPassword" :disabled="disabledPassword" />
          <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white"
            :disabled="disableModify" @click="modifyAsset">{{ $t('asset.modifyAssetSupply') }}</button>
          <div class="text-center">
            <router-link :to="{ name: 'ViewDashboard' }"
              class='content-center text-xs text-white border-b-2 border-white'>{{ $t('general.cancel') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue';
import SupplyInputClean from '@/components/SupplyInputClean.vue';
import SelectModificationType from '@/modules/services/submodule/assets/components/SelectModificationType.vue';
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { AssetsUtils } from '@/util/assetsUtils';
import { WalletUtils } from '@/util/walletUtils';
import { toSvg } from "jdenticon";
import { useI18n } from 'vue-i18n';
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { MultisigUtils } from '@/util/multisigUtils';
import { AppState } from '@/state/appState';
import { isMultiSig, TransactionUtils, findAcc, findAccWithAddress } from '@/util/transactionUtils';
import type { Account } from '@/models/account';

const props = defineProps({
  assetId: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
})

const { t } = useI18n();
const router = useRouter();
const currentNativeTokenName = computed(() => AppState.nativeToken.label);
const showSupplyErr = ref(false);
const walletPassword = ref('');
const err = ref('');
const disabledPassword = ref(false);
const disabledSupply = ref(false);
const disabledSelectIncreaseDecrease = ref(false);
const passwdPattern = "^[^ ]{8,}$";
const showPasswdError = ref(false);

const cosignerBalanceInsufficient = ref(false);
const cosignerAddress = ref('');

const lockFund = computed(() => {
  if (networkState.currentNetworkProfileConfig) {
    return Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate as number, AppState.nativeToken.divisibility)
  } else {
    return 0
  }
})
const lockFundCurrency = computed(() => {
  if (networkState.currentNetworkProfileConfig) {
    return Helper.convertToCurrency(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate as number, AppState.nativeToken.divisibility)
  } else {
    return 0
  }
})

const lockFundTxFee = computed(() => {
  if (networkState.currentNetworkProfile) {
    return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
  }
  return 0;
});
const lockFundTotalFee = computed(() => lockFund.value + lockFundTxFee.value);


const disableModify = computed(() => !(
  walletPassword.value.match(passwdPattern) && (Number(supply.value) > 0) && !showSupplyErr.value && !showNoBalance.value && !isNotCosigner.value
));


const selectedAccName = computed(() => {
  if (!account.value) {
    return ''
  }
  return account.value.name
})
const selectedAccAdd = computed(() => {
  if (!account.value) {
    return ''
  }
  return account.value.address
})
const balanceNumber = computed(() => {
  if (!account.value) {
    return 0
  }
  return account.value.balance
})

const balance = computed(() => {
  if (!account.value) {
    return 0
  }
  return Helper.toCurrencyFormat(account.value.balance, AppState.nativeToken.divisibility)
})

const supply = ref('0');
const plainAddress = Helper.createAddress(props.address).plain()
let account = computed(() => {
  if (walletState.currentLoggedInWallet) {
    return walletState.currentLoggedInWallet.accounts.find(account => account.address == plainAddress) || walletState.currentLoggedInWallet.others.find(account => account.address == plainAddress);
  } else {
    return null
  }
})


let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
themeConfig.init();

const svgString = ref(toSvg(props.address, 40, themeConfig.jdenticonConfig));

const selectIncreaseDecrease = ref('increase');
let maxAssetSupply = 900000000000000;

const asset = computed(() => {
  if (!account.value) {
    return null
  }
  return account.value.assets.find(asset => asset.idHex === props.assetId);
})
const assetAmount = computed(() => {
  if (!asset.value) {
    return 0
  }
  return asset.value.amount
})
const selectAsset = computed(() => {
  if (!asset.value) {
    return ''
  }
  return asset.value.idHex
})
const assetTransferable = computed(() => {
  if (!asset.value) {
    return false
  }
  return asset.value.transferable
})
const assetMutable = computed(() => {
  if (!asset.value) {
    return false
  }
  return asset.value.supplyMutable
})
const assetDivisibility = computed(() => {
  if (!asset.value) {
    return 0
  }
  return asset.value.divisibility
})

const assetSupply = computed(() => {
  if (!asset.value) {
    return 0
  }
  return asset.value.supply / Math.pow(10, asset.value.divisibility ? asset.value.divisibility : 0)
})
const accounts = computed(() => {
  if (walletState.currentLoggedInWallet) {
    const acc = walletState.currentLoggedInWallet.accounts.map((x) => x as Account);
    const otherAcc = walletState.currentLoggedInWallet.others.map((x) => x as Account);
    if (walletState.currentLoggedInWallet.others) {
      const concatOther = acc.concat(otherAcc)
      return concatOther;
    } else {
      return acc;
    }
  } else {
    return [];
  }
});
const getMultiSigCosigner = computed(() => {
  const account = accounts.value.find(acc => acc.address == selectedAccAdd.value) as Account
  let cosigners = MultisigUtils.getCosignerInWallet(account.publicKey)
  let list: { hasCosigner: boolean, cosignerList: { publicKey: string, name: string, balance: number, address: string }[] } = { hasCosigner: cosigners.hasCosigner, cosignerList: [] }
  cosigners.cosignerList.forEach(publicKey => {
    const acc = findAcc(publicKey)
    if (acc) {
      list.cosignerList.push({ publicKey: publicKey, name: acc.name, balance: acc.balance, address: acc.address })
    }
  })
  return list
});

cosignerAddress.value = getMultiSigCosigner.value.cosignerList.length > 0 ? getMultiSigCosigner.value.cosignerList[0].address : ''

watch(getMultiSigCosigner, n => {
  if (n.cosignerList.length > 0) {
    cosignerAddress.value = n.cosignerList.length > 0 ? getMultiSigCosigner.value.cosignerList[0].address : ''
  }
})
const isNotCosigner = computed(() => getMultiSigCosigner.value.cosignerList.length == 0 && isMultiSig(selectedAccAdd.value));

const showNoBalance = computed(() => {
  if (isNotCosigner.value) {
    return balanceNumber.value < (transactionFeeExact.value);
  } else {
    return balanceNumber.value < (transactionFeeExact.value + lockFundTotalFee.value);
  }
});

// get cosigner
// if it is a multisig
const cosigner = computed(() => {
  if (getMultiSigCosigner.value.cosignerList.length > 0) {
    if (getMultiSigCosigner.value.cosignerList.length > 1) {
      return cosignerAddress.value;
    } else {
      let findAccount = findAcc(getMultiSigCosigner.value.cosignerList[0].publicKey)
      return findAccount ? findAccount.address : "";
    }
  } else {
    return '';
  }
});

const transactionFee = computed(() => {
  if (!AppState.isReady) {
    return '0'
  }
  return Helper.convertToCurrency(AssetsUtils.getMosaicSupplyChangeTransactionFee(props.assetId, selectIncreaseDecrease.value, parseFloat(supply.value), Number(assetDivisibility.value)), AppState.nativeToken.divisibility);
})
const transactionFeeExact = computed(() => {
  if (!AppState.isReady) {
    return 0
  }
  return Helper.convertToExact(AssetsUtils.getMosaicSupplyChangeTransactionFee(props.assetId, selectIncreaseDecrease.value, parseFloat(supply.value), Number(assetDivisibility.value)), AppState.nativeToken.divisibility);
})

watch(assetMutable, n => {
  if (!n) {
    disabledSelectIncreaseDecrease.value = true;
    disabledSupply.value = true;
    disabledPassword.value = true;
  } else {
    disabledSelectIncreaseDecrease.value = false;
    disabledSupply.value = false;
    disabledPassword.value = false;
  }
}, { immediate: true })


const modifyAsset = () => {
  if (!walletState.currentLoggedInWallet) {
    return
  }
  let verifyPassword = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword.value)
  if (!verifyPassword) {
    err.value = t('general.walletPasswordInvalid', { name: walletState.currentLoggedInWallet.name })
    return
  }
  if (cosigner.value) {
    AssetsUtils.changeAssetSupplyMultiSig(cosigner.value, walletPassword.value, selectAsset.value, selectIncreaseDecrease.value, Number(supply.value), Number(assetDivisibility.value), selectedAccAdd.value);
  } else {
    AssetsUtils.changeAssetSupply(selectedAccAdd.value, walletPassword.value, selectAsset.value, selectIncreaseDecrease.value, Number(supply.value), Number(assetDivisibility.value));
  }
  router.push({ name: "ViewAccountPendingTransactions", params: { address: selectedAccAdd.value } })
};

watch(selectIncreaseDecrease, (n) => {
  if (n == 'increase') {
    showSupplyErr.value = parseFloat(supply.value) > (maxAssetSupply - assetSupply.value);
  }
  else {
    if (assetSupply.value == assetAmount.value) {
      showSupplyErr.value = parseFloat(supply.value) > assetSupply.value - 1;
    }
    else {
      showSupplyErr.value = parseFloat(supply.value) > (assetAmount.value);
    }
  }
});

watch(supply, (n) => {
  if (selectIncreaseDecrease.value == 'increase') {
    showSupplyErr.value = parseFloat(n) > (maxAssetSupply - assetSupply.value);
  }
  else {
    if (assetSupply.value == assetAmount.value) {
      showSupplyErr.value = parseFloat(n) > assetSupply.value - 1;
    }
    else {
      showSupplyErr.value = parseFloat(n) > (assetAmount.value);
    }
  }
});

const totalFee = computed(() => {
  // if multisig
  if (isMultiSig(selectedAccAdd.value)) {
    return lockFundTotalFee.value + transactionFeeExact.value;
  } else {
    return transactionFeeExact.value;
  }
});

const totalFeeFormatted = computed(() => {
  return Helper.amountFormatterSimple(totalFee.value, 0);
});

const setFormInput = (isValidate: boolean) => {
  disabledPassword.value = isValidate;
  disabledSupply.value = isValidate;
  disabledSelectIncreaseDecrease.value = isValidate;
};

watch(totalFee, (n) => {
  if (Number(balance.value) < n) {
    setFormInput(true);
  } else {
    setFormInput(false);
  }
});

watch(showNoBalance, (n) => {
  if (n) {
    setFormInput(true);
  } else {
    setFormInput(false);
  }
});

watch(isNotCosigner, (n) => {
  if (n) {
    setFormInput(true)
  } else {
    setFormInput(false);
  }
});


const checkCosignBalance = computed(() => {
  let findAccount = findAccWithAddress(cosignerAddress.value)
  return findAccount ? findAccount.balance : 0;
})

const assetBalance = computed(() => {
  if (!walletState.currentLoggedInWallet) {
        return "";
    }
    const account = walletState.currentLoggedInWallet.accounts.find(
        (element) => element.address == props.address
    ) || walletState.currentLoggedInWallet.others.find(
        (element) => element.address == props.address)
    if (!account) {
        return ""
    }
    let asset = account.assets.find((element) => element.idHex == props.assetId)
    if(asset){
    return Helper.toCurrencyFormat(asset.amount, asset.divisibility?asset.divisibility:0)
    }else{
      return ""
    }
})

</script>
<style scoped lang="scss"></style>