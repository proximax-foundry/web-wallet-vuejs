<template>
  <TransactionLayout class="mt-8">
    <template #white>
      <div class='font-semibold mb-4'>{{ $t('general.createNamespace') }}</div>
          <div v-if="showNoBalance" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
            <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon
                icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div>
            <div class="inline-block text-xs">{{ $t('general.insufficientBalance') }}</div>
          </div>
          <div class="error error_box" v-if="err != ''">{{ err }}</div>
          <div class="mt-4">
            <div class="flex gap-1 mt-3">
              <SelectInputAccount :type="'namespace'" :label="'create namespace'" @select-account="selectAccountAddress" />
              <SelectInputMultisigAccount :selected-address="selectedAddress" @select-multisig-account="selectMultisigAccount" />
            </div>
            <div v-if="selectedMultisigAddress" class="mt-3">
              <MultisigInput :select-default-address="selectedMultisigAddress"
                :select-default-name="selectedMultisigName" :type="'namespace'" @close-multisig="closeMultisig" />
            </div>
            <SelectInputParentNamespace @select-namespace="updateNamespaceSelection" @clear-namespace="removeNamespace"
              ref="nsRef" v-model="selectNamespace"
              :address="selectedMultisigAddress ? selectedMultisigAddress : selectedAddress" class="mt-5"
              :disabled="disableSelectNamespace" />
            <div class="lg:grid lg:grid-cols-2 mt-5">
              <div class="mb-5 lg:mb-0 lg:mr-2">
                <TextInputTooltip :disabled="disableNamespaceName" :placeholder="$t('general.name')"
                  :errorMessage="namespaceErrorMessage" v-model="namespaceName" v-debounce:1000="checkNamespace"
                  icon="id-card-alt" :showError="showNamespaceNameError" class="w-full inline-block"
                  :toolTip="$t('namespace.namespaceNameMsg1') + '<br><br>' + $t('namespace.namespaceNameMsg2') + '<br><br>' + $t('namespace.namespaceNameMsg3')"
                  tabindex="0" />
              </div>
              <div class="mb-5 lg:mb-0 lg:ml-2">
                <DurationInputClean :disabled="disabledDuration" v-model="duration" :max="maxDurationInDays"
                  :placeholder="$t('namespace.duration')" @set-default-duration="setDefaultDuration"
                  :showError="showDurationErr"
                  :toolTip="$t('namespace.durationMsg') + '<br>' + `${maxDurationInDays === 365 ? '1 ' + $t('general.year') : ''}` + ' (' + `${maxDurationInDays}` + $t('general.day', maxDurationInDays) + ').'" />
              </div>
            </div>
          </div>
    </template>

    <template #navy>
      <TxnSummary :signer-native-token-balance="balance" :namespace-rental-fee-currency="rentalFeeCurrency"
            :native-token-balance="selectedMultisigAddress ? multisigBalance : balance" :lock-fund="lockFund" :lock-fund-tx-fee="lockFundTxFee"
            :selected-multisig-address="selectedMultisigAddress" :txn-fee="transactionFeeExact" :total-fee="totalFee" />
          <button type="submit" class="mt-3 w-full blue-btn py-4 disabled:opacity-50 disabled:cursor-auto text-white"
            :disabled="disableCreate" @click="createNamespace">{{ $t('namespace.registerNamespace') }}</button>
          <div class="text-center">
            <router-link :to="{ name: 'ViewDashboard' }"
              class='content-center text-xs text-white border-b-2 border-white'>{{ $t('general.cancel') }}</router-link>
          </div>
    </template>

    <template #description>
      <div class="mb-8 sm:pr-1">
          <a href="https://bcdocs.xpxsirius.io/docs/built-in-features/namespace/" target=_new
            class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex">{{ $t('general.namespaceQues')
            }}</a>
          <div class="text-gray-400 text-tsm my-3 sm:pr-2">{{ $t('namespace.namespaceAns') }}</div>
        </div>
        <div class="mb-8">
          <a href="https://t.me/proximaxhelpdesk" target=_new
            class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex">{{ $t('general.feedback') }}</a>
          <div class="text-gray-400 text-tsm my-3">{{ $t('general.feedbackDescription') }}</div>
        </div>
    </template>
  </TransactionLayout>
</template>
 
<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import TextInputTooltip from '@/components/TextInputTooltip.vue';
import SelectInputParentNamespace from '@/modules/services/submodule/namespaces/components/SelectInputParentNamespace.vue';
import DurationInputClean from '@/modules/services/submodule/namespaces/components/DurationInputClean.vue';
import SelectInputAccount from '@/components/SelectInputAccount.vue';
import SelectInputMultisigAccount from '@/components/SelectInputMultisigAccount.vue';
import MultisigInput from "@/components/MultisigInput.vue"
import TxnSummary from "@/components/TxnSummary.vue"
import TransactionLayout from "@/components/TransactionLayout.vue";
import { networkState } from "@/state/networkState";
import { Helper } from '@/util/typeHelper';
import { NamespaceUtils } from '@/util/namespaceUtils';
import { ChainUtils } from '@/util/chainUtils';
import { TransactionUtils } from '@/util/transactionUtils';
import { UnitConverter } from '@/util/unitConverter';
import { TimeUnit } from '@/models/const/timeUnit';
import { AppState } from '@/state/appState';
import { useI18n } from 'vue-i18n';
import type {TreeNode } from "primevue/treenode"
import { Address, UInt64 } from 'tsjs-xpx-chain-sdk';
import { TransactionState } from '@/state/transactionState';

const router = useRouter();
const { t } = useI18n();
const nsRef = ref(null);
const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;

const disableNamespaceName = ref(false);
const disableSelectNamespace = ref(false);
const namespaceName = ref('');
const showDurationErr = ref(false);
const duration = ref('1');
const err = ref('');
const namespaceErrorMessage = ref(t('namespace.validName'));
const currentSelectedName = ref('');
const disabledDuration = ref(false);
const disabledClear = ref(false);
const passwdPattern = "^[^ ]{8,}$";
const showPasswdError = ref(false);
const maxNamespaceLength = computed(() => {
  if (networkState.currentNetworkProfileConfig) {
    return networkState.currentNetworkProfileConfig.maxNameSize;
  } else {
    return 0
  }
})
const namespacePattern = `^[0-9a-z]{2,${maxNamespaceLength.value}}$`;
const showNamespaceNameError = ref(false);
const maxDurationInDays = computed(() => {
  if (networkState.currentNetworkProfileConfig) {
    return Math.floor(UnitConverter.configReturn(networkState.currentNetworkProfileConfig.maxNamespaceDuration, TimeUnit.DAY))
  } else {
    return 0
  }
})
const selectNamespace = ref('');

const rentalFee = computed(() => {
  if (selectNamespace.value) {
    if (selectNamespace.value == '1') {
      if (Number(duration.value) > 0) {
        return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock * NamespaceUtils.calculateDuration(Number(duration.value)), AppState.nativeToken.divisibility);
      } else {
        return Helper.convertToExact(networkState.currentNetworkProfileConfig.rootNamespaceRentalFeePerBlock, AppState.nativeToken.divisibility);
      }
    } else {
      return Helper.convertToExact(networkState.currentNetworkProfileConfig.childNamespaceRentalFee, AppState.nativeToken.divisibility);
    }
  } else {
    return 0;
  }
});

const rentalFeeCurrency = computed(() => Helper.toCurrencyFormat(rentalFee.value, AppState.nativeToken.divisibility));

const lockFund = computed(() => {
  if (networkState.currentNetworkProfileConfig) {
    return Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, AppState.nativeToken.divisibility)
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
  namespaceName.value.match(namespacePattern) && (!showDurationErr.value) && (!showNoBalance.value) && !showNamespaceNameError.value && selectNamespace.value
));

const selectedMultisigAddress = ref<string | null>(null)
const selectedMultisigName = ref<string | null>(null)
const selectedAddress = ref<string | null>(null)
const balance = ref(0);
const multisigBalance = ref(0)

const fetchAccountBalance = async (address: string) => {
  if (!AppState.chainAPI) {
    return
  }
  if (!address) {
    return
  }
  try {
    const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(address))
    const findIndex = accInfo.mosaics.findIndex(asset => asset.id.toHex() == AppState.nativeToken.assetId)
    if (findIndex != -1) {
      return accInfo.mosaics[findIndex].amount.compact() / Math.pow(10, AppState.nativeToken.divisibility)
    }
    else {
      return 0
    }
  }
  catch (e) {
    return 0
  }
}

const showNoBalance = computed(() => {
  if (!selectedAddress.value) {
    return
  }
  if(selectedMultisigAddress.value) {
    if(multisigBalance.value < rentalFee.value){
      return true
    }
    else if(balance.value < (transactionFeeExact.value + lockFundTotalFee.value)){
      return true
    }
    else{
      return false
    }
  } else {
    return balance.value < (rentalFee.value + transactionFeeExact.value);
  }
});

// validate enough fee to create namespace
if (balance.value < rentalFee.value) {
  disabledClear.value = true;
  disabledDuration.value = true;
  disableNamespaceName.value = true;
  disableSelectNamespace.value = true;
} else {
  disabledClear.value = false;
  disabledDuration.value = false;
  disableNamespaceName.value = false;
  disableSelectNamespace.value = false;
}

const transactionFee = ref(0);
const transactionFeeExact = ref(0);

const removeNamespace = () => {
  selectNamespace.value = '';
}

const updateNamespaceSelection = (namespaceNameSelected) => {
  let fee = 0;
  if (namespaceNameSelected == '1') {
    duration.value = '1';
    //root
    disabledDuration.value = false;
    if (namespaceName.value.trim().length > 0 && !showNamespaceNameError.value) {
      fee = NamespaceUtils.getRootNamespaceTransactionFee(namespaceName.value);
      transactionFee.value = Number(Helper.convertToCurrency(fee, AppState.nativeToken.divisibility));
      transactionFeeExact.value = Helper.convertToExact(fee, AppState.nativeToken.divisibility);
    }
  } else {
    duration.value = '0';
    //subnamespace
    disabledDuration.value = true;
    if (namespaceName.value.trim().length > 0 && !showNamespaceNameError.value) {
      fee = NamespaceUtils.getSubNamespaceTransactionFee(namespaceNameSelected, namespaceName.value);
      transactionFee.value = Number(Helper.convertToCurrency(fee, AppState.nativeToken.divisibility));
      transactionFeeExact.value = Helper.convertToExact(fee, AppState.nativeToken.divisibility);
    }
  }
};

watch(selectNamespace, newValue => {
  if (!newValue) {
    disableNamespaceName.value = true;
    disabledDuration.value = true;
  } else {
    disableNamespaceName.value = false;
  }
}, { immediate: true })

const createNamespace = () => {
  let buildTransactions = AppState.buildTxn;
  if (selectNamespace.value === '1') {
    let unsignedRegisterRootNamespaceTransaction = buildTransactions.registerRootNamespace(namespaceName.value, UInt64.fromUint(NamespaceUtils.calculateDuration(Number(duration.value)))).serialize();
    TransactionState.unsignedTransactionPayload = unsignedRegisterRootNamespaceTransaction
  } else {
    let unsignedRegisterSubNamespaceTransaction = buildTransactions.registersubNamespace(selectNamespace.value, namespaceName.value).serialize();
    TransactionState.unsignedTransactionPayload = unsignedRegisterSubNamespaceTransaction
  }
  TransactionState.selectedAddress = selectedAddress.value
  TransactionState.selectedMultisigAddress = selectedMultisigAddress.value
  router.push({ name: "ViewConfirmTransaction" })
};

watch(duration, (newValue) => {
  if (parseInt(newValue) > maxDurationInDays.value) {
    duration.value = `${maxDurationInDays.value}`;
  }
});

const setDefaultDuration = () => {
  duration.value = '1';
}

// calculate fees
const totalFee = computed(() => {
  // if multisig
  if (selectedMultisigAddress.value) {
    let totalArray = [lockFund.value, lockFundTxFee.value, transactionFeeExact.value]
    return Helper.safeSum(totalArray);
  } else {
    return rentalFee.value + transactionFeeExact.value;
  }
});

watch(totalFee, (newValue) => {
  if (balance.value < newValue) {
    disableSelectNamespace.value = true;
  } else {
    disableSelectNamespace.value = false;
  }
});

const reservedRootNamespace = computed(() => {
  if (networkState.currentNetworkProfileConfig) {
    return networkState.currentNetworkProfileConfig.reservedRootNamespaceNames.split(",").map(ns => ns.trim());
  } else {
    return []
  }
})

const isReservedRootNamespace = () => {
  if (selectNamespace.value === "1" && reservedRootNamespace.value.includes(namespaceName.value.trim())) {
    showNamespaceNameError.value = true;
    namespaceErrorMessage.value = t('namespace.reservedName');

    return true;
  }
  return false;
}

const notRootNamespaceOwner = async () => {
  if (selectNamespace.value === "1" && namespaceName.value.trim()) {
    try {
      let namespaceInfo = await ChainUtils.getNamespaceInfo(Helper.createNamespaceId(namespaceName.value));

      if (selectedMultisigAddress.value) {
        if (namespaceInfo.owner.address.plain() !== selectedMultisigAddress.value) {
          showNamespaceNameError.value = true;
          namespaceErrorMessage.value = t('namespace.nameRegistered');

          return true;
        }
      }
      else {
        if (namespaceInfo.owner.address.plain() !== selectedAddress.value) {
          showNamespaceNameError.value = true;
          namespaceErrorMessage.value = t('namespace.nameRegistered');

          return true;
        }
      }
    } catch (error) {
      return false;
    }
  }
  return false;
}

const checkNamespace = async () => {
  if (namespaceName.value.trim()) {
    if (isReservedRootNamespace()) {
      return;
    }
    else {
      showNamespaceNameError.value = namespaceName.value.match(namespacePattern) ? false : true;
      if (showNamespaceNameError.value) {
        namespaceErrorMessage.value = t('namespace.validName');
      }
      else {
        let isNotOwner = await notRootNamespaceOwner();

        if (isNotOwner) {
          return;
        }

        let fee = 0;

        if (selectNamespace.value == '1') {

          //root
          if (namespaceName.value.trim().length > 0 && !showNamespaceNameError.value) {
            fee = NamespaceUtils.getRootNamespaceTransactionFee(namespaceName.value);
            transactionFee.value = Number(Helper.convertToCurrency(fee, AppState.nativeToken.divisibility));
            transactionFeeExact.value = Helper.convertToExact(fee, AppState.nativeToken.divisibility);
          }
        } else {
          //sub
          if (namespaceName.value.trim().length > 0 && !showNamespaceNameError.value) {
            fee = NamespaceUtils.getSubNamespaceTransactionFee(namespaceName.value, selectNamespace.value);
            transactionFee.value = Number(Helper.convertToCurrency(fee, AppState.nativeToken.divisibility));
            transactionFeeExact.value = Helper.convertToExact(fee, AppState.nativeToken.divisibility);
          }
        }
      }
    }
  }
}

const clearInput = () => {
  namespaceName.value = ''
  selectNamespace.value = ''
  nsRef.value.clearLabel();
  showNamespaceNameError.value = false
  setDefaultDuration()
  selectedMultisigName.value = null
  selectedMultisigAddress.value = null
}

watch(selectedAddress, async (newValue, oldValue) => {
  if (newValue == null) {
    balance.value = 0
    clearInput()
  }
  else if (newValue != oldValue) {
    clearInput()
    balance.value = await fetchAccountBalance(newValue)
  }
})

watch(selectedMultisigAddress, async (multisigNewValue, multisigOldValue) => {
  if (multisigNewValue == null) {
    multisigBalance.value = 0
    clearInput()
    balance.value = await fetchAccountBalance(selectedAddress.value)
  }
  else if (multisigNewValue != multisigOldValue) {
    selectNamespace.value = ''
    namespaceName.value = ''
    nsRef.value.clearLabel();
    showNamespaceNameError.value = false
    setDefaultDuration()
    multisigBalance.value = await fetchAccountBalance(multisigNewValue)
  }
})

watch(namespaceName, newValue => {
  if (selectNamespace.value === '') {
    showNamespaceNameError.value = false;
    namespaceErrorMessage.value = '';
  }
  else {
    if (newValue.length == 0) {
      showNamespaceNameError.value = true;
      namespaceErrorMessage.value = t('namespace.validName');
    }
  }
})

const selectAccountAddress = (address: string) => {
    selectedAddress.value = address
}

const selectMultisigAccount = (node: TreeNode) => {
    selectedMultisigName.value = node.label
    selectedMultisigAddress.value = node.value
}

const closeMultisig = () => {
    selectedMultisigName.value = null
    selectedMultisigAddress.value = null
}

</script>
<style scoped lang="scss">
.slide-enter-active {
  -moz-transition-duration: 1s;
  -webkit-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
  -moz-transition-timing-function: ease-in;
  -webkit-transition-timing-function: ease-in;
  -o-transition-timing-function: ease-in;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  -moz-transition-duration: 1s;
  -webkit-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
  -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}

.optionDiv:hover {
  background: #D9EBFF;
}

::deep(.p-inputtext) {
  font-size: 1rem;
  text-align: left;
  padding: 0.5rem;
}
</style>