<template>
  <div>
    <div class='w-10/12 ml-auto mr-auto'>
      <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8">
        <div class="xl:col-span-2 p-12">
          <div class='font-semibold mb-4'>{{ $t('asset.createAssets') }}</div>
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
          <div class="mt-4">
            <SelectInputAccount @select-account="changeSelection" v-model="selectedAccAdd"
              :selectDefault="defaultAcc ? defaultAcc.address : ''" />
            <div v-if="getMultiSigCosigner.cosignerList.length > 0">
              <div class="text-tsm text-left mt-3">{{ $t('general.initiateBy') }}:
                <span class="font-bold" v-if="getMultiSigCosigner.cosignerList.length == 1">{{
                  getMultiSigCosigner.cosignerList[0].name }} ({{ $t('general.balance') }}: {{
    Helper.amountFormatterSimple(getMultiSigCosigner.cosignerList[0].balance, 0) }}
                  {{ currentNativeTokenName }})</span>
                <span class="font-bold" v-else><select v-model="cosignerAddress">
                    <option v-for="(cosigner, item) in getMultiSigCosigner.cosignerList" :value="cosigner.address"
                      :key="item">{{ cosigner.name }} ({{ $t('general.balance') }}: {{ cosigner.balance }} {{
                        currentNativeTokenName }})</option>
                  </select></span>
                <div v-if="cosignerBalanceInsufficient" class="error">- {{ $t('general.insufficientBalance') }}</div>
              </div>
            </div>
            <div class="lg:grid lg:grid-cols-2 mt-5">
              <div class="lg:mr-2">
                <SupplyInputClean :disabled="showNoBalance || isNotCosigner || disabledInput" v-model="supply"
                  :balance="Number.MAX_VALUE" :placeholder="$t('general.supply')" type="text"
                  @show-error="updateSupplyErr" :divisibility="Number(divisibility)"
                  :toolTip="$t('asset.supplyMsg1') + ' <br><br>' + $t('asset.supplyMsg2') + '<br>' + $t('asset.supplyMsg3')" />
              </div>
              <div class="lg:ml-2">
                <NumberInputClean :disabled="showNoBalance || isNotCosigner || disabledInput" v-model="divisibility"
                  :max="6" :placeholder="$t('general.divisibility')" :showError="showDivisibilityErr"
                  :toolTip="$t('asset.divisibilityMsg1') + ' <br><br>' + $t('asset.divisibilityMsg2') + '<br>' + $t('asset.divisibilityMsg3')" />
              </div>
            </div>
            <div class="lg:grid lg:grid-cols-2">
              <div class="mb-5 lg:mb-0 lg:mr-2">
                <CheckInput :disabled="showNoBalance || isNotCosigner || disabledInput" v-model="isTransferable"
                  :title="$t('general.transferable')" :toolTip="$t('asset.transferableMsg')"
                  @click="!showNoBalance ? (isTransferable = !isTransferable) : ''" />
              </div>
              <div class="mb-5 lg:mb-0 lg:ml-2">
                <CheckInput :disabled="showNoBalance || isNotCosigner || disabledInput" v-model="isMutable"
                  :title="$t('general.supplyMutable')" :toolTip="$t('asset.supplyMutableMsg')"
                  @click="!showNoBalance ? (isMutable = !isMutable) : ''" />
              </div>
            </div>
          </div>
        </div>
        <div class="bg-navy-primary py-6 px-6 xl:col-span-1">
          <TransactionFeeDisplay :asset-rental-fee-currency="rentalFeeCurrency.toString()"
            :transaction-fee="Number(transactionFee)" :total-fee-formatted="totalFeeFormatted"
            :get-multi-sig-cosigner="getMultiSigCosigner" :check-cosign-balance="checkCosignBalance.toString()"
            :lock-fund-currency="Number(lockFundCurrency)" :lock-fund-tx-fee="lockFundTxFee" :balance="balance.toString()"
            :selected-acc-add="selectedAccAdd" />
          <div class='text-xs text-white my-5'>{{ $t('general.enterPasswordContinue') }}</div>
          <PasswordInput :placeholder="$t('general.password')" :errorMessage="$t('general.passwordRequired')"
            :showError="showPasswdError" v-model="walletPassword" :disabled="disabledPassword" />
          <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white"
            :disabled="disableCreate" @click="createAsset">{{ $t('asset.createAssets') }}</button>
          <div class="text-center">
            <router-link :to="{ name: 'ViewDashboard' }"
              class='content-center text-xs text-white border-b-2 border-white'>{{ $t('general.cancel') }}</router-link>
          </div>
        </div>
      </div>

      <div class="sm:grid sm:grid-cols-2 mt-10 lg:mt-16">
        <div class="mb-8">
          <a href="https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/" target=_new
            class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm flex items-start">{{ $t('general.assetQues') }}</a>
          <div class="text-gray-400 text-xs lg:text-tsm my-3 sm:pr-2">{{ $t('asset.assetAns') }}</div>
        </div>
        <div class="mb-8">
          <a href="https://t.me/proximaxhelpdesk" target=_new
            class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex">{{ $t('general.feedback') }}</a>
          <div class="text-gray-400 text-tsm my-3">{{ $t('general.feedbackDescription') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import SelectInputAccount from '@/components/SelectInputAccount.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import SupplyInputClean from '@/components/SupplyInputClean.vue';
import CheckInput from '@/components/CheckInput.vue';
import NumberInputClean from '@/modules/services/submodule/assets/components/NumberInputClean.vue';
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
import { useI18n } from 'vue-i18n'
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { AssetsUtils } from '@/util/assetsUtils';
import { WalletUtils } from '@/util/walletUtils';
import { MultisigUtils } from '@/util/multisigUtils';
import { AppState } from '@/state/appState';
import { TransactionUtils, isMultiSig, findAcc, findAccWithAddress } from '@/util/transactionUtils';
import type { PublicAccount } from 'tsjs-xpx-chain-sdk';
import type { Account } from '@/models/account';


const router = useRouter();

const currentNativeTokenName = computed(() => AppState.nativeToken.label);
const showSupplyErr = ref(false);
const walletPassword = ref('');
const { t } = useI18n();
const err = ref('');
const currentSelectedName = ref('');
const divisibility = ref('0');
const showDivisibilityErr = ref(false);
const isTransferable = ref(false);
const isMutable = ref(false);
const disabledPassword = computed(() => showNoBalance.value || isNotCosigner.value || disableAllInput.value);
const disabledInput = computed(() => disableAllInput.value)
const disabledClear = ref(false);
const disabledDuration = ref(false);
const durationOption = ref('month');
const duration = ref('1');
const showDurationErr = ref(false);
const passwdPattern = "^[^ ]{8,}$";
const showPasswdError = ref(false);
const durationCheckDisabled = ref(false);
const cosignerBalanceInsufficient = ref(false);
const cosignerAddress = ref('');
const supply = ref('0');
const disableAllInput = ref(false);


const ownerPublicAccount = ref<PublicAccount>()
try {
  ownerPublicAccount.value = WalletUtils.createPublicAccount(walletState.currentLoggedInWallet ? (walletState.currentLoggedInWallet.selectDefaultAccount() as Account).publicKey : '', AppState.networkType)
} catch (error) {
  console.log(error)
}
const transactionFee = ref(0)


watch(AppState,n=>{
  if(n.buildTxn && ownerPublicAccount.value){
    transactionFee.value = Helper.convertToExact(AssetsUtils.createAssetTransactionFee(ownerPublicAccount.value, Number(supply.value), isMutable.value, isTransferable.value, Number(divisibility.value)), AppState.nativeToken.divisibility);
  }
},{immediate:true})


const rentalFee = computed(() => {
  if (networkState.currentNetworkProfileConfig) {
    return Helper.convertToExact(networkState.currentNetworkProfileConfig.mosaicRentalFee as number, AppState.nativeToken.divisibility)
  } else {
    return 0
  }
})
const rentalFeeCurrency = computed(() => {
  if (networkState.currentNetworkProfileConfig) {
    return Helper.convertToCurrency(networkState.currentNetworkProfileConfig.mosaicRentalFee as number, AppState.nativeToken.divisibility)
  } else {
    return 0
  }
})
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

const disableCreate = computed(() => !(
  walletPassword.value.match(passwdPattern) && (divisibility.value != '') && (Number(supply.value) > 0) && (!showSupplyErr.value) && (!showDurationErr.value) && (!showNoBalance.value) && (!isNotCosigner.value)
));

const defaultAcc = walletState.currentLoggedInWallet ? walletState.currentLoggedInWallet.selectDefaultAccount() : null
const selectedAccName = ref(defaultAcc ? defaultAcc.name : '');
const selectedAccAdd = ref(defaultAcc ? defaultAcc.address : '');
const balance = computed(()=>{
  const findAcc = accounts.value.find(acc=>acc.address == selectedAccAdd.value)
  if(findAcc){
    return findAcc.balance
  }
  return 0
})

const isMultiSigBool = ref(isMultiSig(defaultAcc ? defaultAcc.address : ''));

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
  if(!AppState.buildTxn){
    return { hasCosigner: false, cosignerList: [] }
  }
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

const isNotCosigner = computed(() => getMultiSigCosigner.value.cosignerList.length == 0 && isMultiSig(selectedAccAdd.value));

const showNoBalance = computed(() => {
  if (isNotCosigner.value) {
    return balance.value < (rentalFee.value + transactionFee.value);
  } else {
    return balance.value < (rentalFee.value + transactionFee.value + lockFundTotalFee.value);
  }
});

if (balance.value < (rentalFee.value + Number(transactionFee.value))) {
  if (!isNotCosigner.value) {
    // showNoBalance.value = true;
  }
  disabledClear.value = true;
  disabledDuration.value = true;
  durationCheckDisabled.value = true;
} else {
  disabledClear.value = false;
  disabledDuration.value = false;
  durationCheckDisabled.value = false;
}


const changeSelection = (address: string) => {
  const account = accounts.value.find(acc => acc.address == selectedAccAdd.value) as Account
  selectedAccName.value = account.name;
  selectedAccAdd.value = address;
  currentSelectedName.value = account.name;
  ownerPublicAccount.value = WalletUtils.createPublicAccount(account.publicKey, AppState.networkType);
}

const clearInput = () => {
  walletPassword.value = '';
  divisibility.value = '0';
  supply.value = '0';
  duration.value = '1';
  durationOption.value = 'month';
  disabledDuration.value = false;
  isTransferable.value = false;
  isMutable.value = false;
};



// calculate fees
const totalFee = computed(() => {
  // if multisig
  if (isMultiSig(selectedAccAdd.value)) {
    return lockFundTotalFee.value + transactionFee.value;
  } else {
    return rentalFee.value + transactionFee.value;
  }
});

const totalFeeFormatted = computed(() => {
  return Helper.amountFormatterSimple(totalFee.value, 0);
});

const updateSupplyErr = (bolError: boolean) => {
  showSupplyErr.value = bolError;
}

const createAsset = () => {
  if (!walletState.currentLoggedInWallet) {
    return
  }
  let verifyPassword = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword.value)
  if (!verifyPassword) {
    err.value = t('general.walletPasswordInvalid', { name: walletState.currentLoggedInWallet.name })
    return
  }
  if (ownerPublicAccount.value) {
    if (cosigner.value) {
      AssetsUtils.createAssetMultiSig(cosigner.value, walletPassword.value, ownerPublicAccount.value, Number(supply.value), isMutable.value, isTransferable.value, Number(divisibility.value));
    } else {
      AssetsUtils.createAsset(selectedAccAdd.value, walletPassword.value, ownerPublicAccount.value, Number(supply.value), isMutable.value, isTransferable.value, Number(divisibility.value));
    }
  }
  clearInput();
  router.push({ name: "ViewAccountPendingTransactions", params: { address: selectedAccAdd.value } })
};

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

cosignerAddress.value = getMultiSigCosigner.value.cosignerList.length > 0 ? getMultiSigCosigner.value.cosignerList[0].address : ''

watch(getMultiSigCosigner, n => {
  if (n.cosignerList.length > 0) {
    cosignerAddress.value = n.cosignerList.length > 0 ? getMultiSigCosigner.value.cosignerList[0].address : ''
  }
})

const checkCosignBalance = computed(() => {
  let findAccount = findAccWithAddress(cosignerAddress.value)
  return findAccount ? findAccount.balance : 0;
})

/* if (isMultiSigBool.value && walletState.currentLoggedInWallet) {
  let cosigner = getMultiSigCosigner.value.cosignerList
  if (cosigner.length > 0) {
    let findAccount = walletState.currentLoggedInWallet.accounts.find(acc => acc.publicKey == cosigner[0].publicKey)
    if (findAccount) {
      cosignerAddress.value = findAccount.address
    }
    const findCosignerAccount = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == cosignerAddress.value)
    if (findCosignerAccount && findCosignerAccount.balance < lockFundTotalFee.value) {
      disableAllInput.value = true;
      cosignerBalanceInsufficient.value = true;
    } else {
      disableAllInput.value = false;
      cosignerBalanceInsufficient.value = false;
    }
  } else {
    disableAllInput.value = true;
  }
} */
watch(selectedAccAdd, (n) => {
  isMultiSigBool.value = isMultiSig(n);
  if (isMultiSigBool.value && walletState.currentLoggedInWallet) {
    let cosigner = getMultiSigCosigner.value.cosignerList
    if (cosigner.length > 0) {
      let findAccount = walletState.currentLoggedInWallet.accounts.find(acc => acc.publicKey == cosigner[0].publicKey)
      if (findAccount) {
        cosignerAddress.value = findAccount.address
      }
      const findCosignerAccount = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == cosignerAddress.value)
      if (findCosignerAccount && findCosignerAccount.balance < lockFundTotalFee.value) {
        disableAllInput.value = true;
        cosignerBalanceInsufficient.value = true;
      } else {
        disableAllInput.value = false;
        cosignerBalanceInsufficient.value = false;
      }
    } else {
      disableAllInput.value = true;
      cosignerBalanceInsufficient.value = true;
    }
  } else {
    disableAllInput.value = false;
    cosignerBalanceInsufficient.value = false;
  }
},{immediate:true});

const cosignerBalance = computed(()=>{
  const findAcc =  accounts.value.find((element) => element.address == cosignerAddress.value)
  if(findAcc){
    return findAcc.balance
  }
  return 0
})
watch(cosignerBalance, (n, o) => {
  if (n != o) {
   
    if (
      n <
      lockFundTotalFee.value
    ) {
      cosignerBalanceInsufficient.value = true;
      disableAllInput.value = true;
    } else {
      cosignerBalanceInsufficient.value = false;
      disableAllInput.value = false
    }

  }
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
input[type=number] {
  -moz-appearance: textfield;
}

::deep(.p-inputtext) {
  font-size: 1rem;
  text-align: left;
  padding: 0.5rem;
}</style>