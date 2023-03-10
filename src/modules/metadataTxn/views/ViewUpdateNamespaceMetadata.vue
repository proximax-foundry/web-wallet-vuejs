<template>
  <div>
    <div class='w-10/12 ml-auto mr-auto'>
      <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8">
        <div class="xl:col-span-2 p-12">
          <div class="font-semibold mb-4">Update Namespace Metadata</div>
          <div v-if="showBalanceErr" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
            <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2">
              <font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute"
                style="top: 3px; left:4px"></font-awesome-icon>
            </div>
            <div class="inline-block text-xs">{{ $t('general.insufficientBalance') }}</div>
          </div>
          <div class=" error error_box mb-5" v-if="err != ''">{{ err }}</div>
          <div class="flex items-center">
            <div v-html="svgString" class="inline-block" />
            <div class="ml-2">
              <div class="text-blue-primary text-xxs font-bold uppercase mb-1">{{ $t('namespace.namespaceCreatedBy') }}
              </div>
              <div class="font-bold text-black text-sm">{{ accountName }}</div>
            </div>
          </div>
          <div v-if="targetAccIsMultisig" class="text-left mt-2 mb-5 ml-4">
            <div v-if="cosigners.length > 0">
              <div class="text-tsm">
                {{ $t('general.initiateBy') }}:
                <span class="font-bold" v-if="cosigners.length == 1">
                  {{ cosigners[0].name }}
                </span>
                <span class="font-bold" v-else>
                  <select class="" v-model="selectedCosigner">
                    <option v-for="(cosigner, item) in  cosigners" :value="findAcc(cosigner.publicKey)?.publicKey"
                      :key="item">
                      {{ cosigner.name }}
                    </option>
                  </select>
                </span>
              </div>
            </div>
            <div class="error" v-else>
              {{ $t('general.noCosigner') }}
            </div>
          </div>
          <div class="border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5">
            <img src="@/modules/services/submodule/namespaces/img/icon-namespace.svg">
            <div class="ml-1">
              <div class="uppercase text-blue-primary font-semibold text-xxs">NAMESPACE</div>
              <div class="text-black text-sm font-bold">{{ namespaceName }}</div>
            </div>
          </div>
          <div class="mt-2" v-if="existingScopedMetadataKeys.length && scopedMetadataKeySelectable">
            <div @click="showKeys = !showKeys" class="text-blue-primary text-xs cursor-pointer mb-1.5">Select Existing
              Scoped Metadata Key</div>
            <div v-for="(metadata, index) in existingScopedMetadataKeys" :key="index">
              <div v-if="showKeys" class="flex justify-center cursor-pointer"
                @click="scopedMetadataKeyType = metadata.type, inputScopedMetadataKey = metadata.value, checkOldValue(), showKeys = false">
                <div v-if="index % 2 == 0" class="text-xs py-2 bg-gray-100 pl-2 w-full">{{ metadata.value }}</div>
                <div v-if="index % 2 == 1" class="text-xs py-2 pl-2 w-full">{{ metadata.value }}</div>
                <div v-if="index % 2 == 0"
                  class="ml-auto pr-2 text-xxs py-2 font-semibold uppercase text-blue-primary bg-gray-100">
                  {{ $t('general.select') }}</div>
                <div v-if="index % 2 == 1" class="ml-auto mr-2 text-xxs py-2 font-semibold uppercase text-blue-primary">
                  {{ $t('general.select') }}</div>
              </div>
            </div>
          </div>
          <div v-if="scopedMetadataKeySelectable">
            <MetadataInput :hex="scopedMetadataKeyType == 2" class="mt-5" v-model="inputScopedMetadataKey"
              placeholder="Scoped Metadata Key" v-debounce:1000="checkOldValue"
              :toolTip="`${scopedMetadataKeyType == 1 ? 'Accepts up to 8 bytes' : 'Accepts 16 hexadecimals'}`"
              :showError="showScopedKeyErr"
              :errorMessage="`${scopedMetadataKeyType == 1 ? 'Exceeded 8 bytes' : inputScopedMetadataKey.length > 16 ? 'Exceeded 16 hexadecimals' : 'Input needs to be even number'}`" />
            <div class="flex gap-3 ">
              <div class="flex gap-2">
                <input type="radio" id="regular" value="1" v-model="scopedMetadataKeyType">
                <label for="regular">UTF-8</label>
              </div>
              <div class="flex gap-2">
                <input type="radio" id="hexa" value="2" v-model="scopedMetadataKeyType">
                <label for="hexa">Hexadecimal</label>
              </div>
            </div>
            <MetadataInput class="mt-2" v-model="oldValue" :disabled="true" placeholder="Current Value" />
          </div>
          <div class="my-3" v-else>
            <div class="border border-blue-primary p-4 bg-blue-100 rounded mt-5">
              <div class="flex flex-col gap-0.5">
                <div class="uppercase text-xxs font-semibold text-blue-primary">Selected Scoped Metadata Key</div>
                <div class="flex">
                  <div class="font-semibold">{{ scopedMetadataKey }}</div>
                  <div class="ml-3 text-gray-400 font-semibold">{{ scopedMetadataKeyType == 1 ? "UTF-8" : "HEX" }}</div>
                </div>
                <div class="flex">
                  <div class="font-semibold" v-if="scopedMetadataKeyType == 1">{{ scopedMetadataKeyHex }}</div>
                  <div v-if="scopedMetadataKeyType == 1" class="ml-3 text-gray-400 font-semibold">HEX</div>
                </div>
              </div>
            </div>
            <div class="border border-blue-primary p-4 bg-blue-100 rounded mt-5">
              <div class="uppercase text-xxs text-blue-primary font-semibold">CURRENT VALUE</div>
              <div class="font-semibold">{{ oldValue }}</div>
            </div>
          </div>
          <MetadataInput class="mt-2" v-model="newValue" placeholder="New Value" />
        </div>
        <div class="bg-navy-primary py-6 px-12 xl:col-span-1">
          <TransactionFeeDisplay :transaction-fee="transactionFee" :total-fee-formatted="totalFeeFormatted"
            :get-multi-sig-cosigner="getMultiSigCosigner" :check-cosign-balance="checkCosignBalance"
            :lock-fund-currency="lockFund" :lock-fund-tx-fee="lockFundTxFee" :balance="accBalance"
            :selected-acc-add="selectedAccAdd" />
          <div class='text-xs text-white my-5'>{{ $t('general.enterPasswordContinue') }}</div>
          <PasswordInput :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')"
            v-model="walletPassword" icon="lock" class="mt-5 mb-3" />
          <button type="submit" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
            @click="updateMetadata()" :disabled="disableAddBtn">
            Update Namespace Metadata
          </button>
          <div class="text-center">
            <router-link :to="{ name: 'ViewServicesNamespace' }"
              class='content-center text-xs text-white border-b-2 border-white'>{{ $t('general.cancel') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Helper } from "@/util/typeHelper";
import { computed, ref, watch } from "vue";
import PasswordInput from "@/components/PasswordInput.vue";
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
import { useI18n } from 'vue-i18n'
import { MultisigUtils } from "@/util/multisigUtils";
import { walletState } from "@/state/walletState";
import { TransactionUtils, findAcc } from "@/util/transactionUtils";
import { AppState } from '@/state/appState';
import {
  Convert, NamespaceMetadataTransactionBuilder,
  AggregateTransaction, AggregateBondedTransactionBuilder, UInt64,
  MetadataQueryParams, MetadataType, NamespaceMetadataTransaction,
  NamespaceId,
  Account,
  PublicAccount
} from 'tsjs-xpx-chain-sdk';
import type { WalletAccount } from '@/models/walletAccount';
import type { OtherAccount } from '@/models/otherAccount';
import { ThemeStyleConfig } from '@/models/stores';
import { toSvg } from 'jdenticon';
import { networkState } from '@/state/networkState';
import MetadataInput from '@/modules/metadataTxn/components/MetadataInput.vue'
import { WalletUtils } from '@/util/walletUtils';
import isValidUtf8 from 'utf-8-validate';
import { useRouter } from 'vue-router';

const props = defineProps({
  targetId: String,
  scopedMetadataKey: String,
})

const router = useRouter()
let showKeys = ref(false)
let scopedMetadataKeySelectable = ref(true);
let scopedMetadataKeyType = ref(1);
let targetPublicAccount = ref<PublicAccount | null>(null);
let targetNamespace = ref<NamespaceId | null>(null);
let targetAccIsMultisig = ref(false);
let scopedMetadataKeyHex = ref("");
let inputScopedMetadataKey = ref("");
let selectedAcc = ref<WalletAccount | OtherAccount>();
let txnBuilder: NamespaceMetadataTransactionBuilder;
let aggregateTxnBuilder: AggregateBondedTransactionBuilder;
let metadataTxn: NamespaceMetadataTransaction;
let aggregateTxn: AggregateTransaction;
const oldValue = ref("");
const newValue = ref("");
const themeConfig: any = new ThemeStyleConfig('ThemeStyleConfig');
themeConfig.init();
const svgString = computed(() => toSvg(selectedAcc.value ? selectedAcc.value.address : '', 40, themeConfig.jdenticonConfig))
const accountName = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return ""
  }
  return selectedAcc.value ? walletState.currentLoggedInWallet.convertAddressToName(selectedAcc.value.address, true) : ''
})
const existingScopedMetadataKeys = ref<{ value: string, type: number }[]>([])
const defaultAcc = walletState.currentLoggedInWallet ? walletState.currentLoggedInWallet.selectDefaultAccount() : null
const selectedAccAdd = ref(defaultAcc ? defaultAcc.address : '');
const accBalance = ref(Helper.toCurrencyFormat(defaultAcc ? defaultAcc.balance : 0, AppState.nativeToken.divisibility));
const removeDoubleZero = (string: string) => {
  let isZero = string.endsWith('00')
  if (isZero) {
    string = string.substring(0, string.length - 2);
    string = removeDoubleZero(string)
  }
  return string
}

const convertUtf8 = (scopedMetadataKey: string) => {
  scopedMetadataKey = removeDoubleZero(scopedMetadataKey)
  let bytes = Convert.hexToUint8(scopedMetadataKey);
  if (isValidUtf8(Buffer.from(bytes))) {
    scopedMetadataKey = Convert.decodeHexToUtf8(scopedMetadataKey)
  }
  return scopedMetadataKey

}
const fetchExistingKey = () => {
  if (!AppState.chainAPI) {
    return
  }
  let metadataQueryParams = new MetadataQueryParams()
  metadataQueryParams.metadataType = MetadataType.NAMESPACE
  metadataQueryParams.targetId = targetNamespace.value as NamespaceId
  AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams).then(metadata => {
    metadata.metadataEntries.forEach(metadataEntry => {
      existingScopedMetadataKeys.value.push({
        value: metadataEntry.scopedMetadataKey.toHex() == convertUtf8(metadataEntry.scopedMetadataKey.toHex()) ? metadataEntry.scopedMetadataKey.toHex() : convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
        type: metadataEntry.scopedMetadataKey.toHex() == convertUtf8(metadataEntry.scopedMetadataKey.toHex()) ? 2 : 1
      })
    })
  })
}
const handleParamTargetId = async () => {
  if (!AppState.chainAPI) {
    return
  }
  if (props.targetId && props.targetId.length === 16 && Convert.isHexString(props.targetId)) {
    let uint64Id = UInt64.fromHex(props.targetId);
    let namespaceId = new NamespaceId([uint64Id.lower, uint64Id.higher]);
    targetNamespace.value = namespaceId;
    txnBuilder.targetNamespaceId(targetNamespace.value as NamespaceId);
  }
  else if (props.targetId) {
    try {
      let namespaceId = new NamespaceId(props.targetId);
      targetNamespace.value = namespaceId;
      txnBuilder.targetNamespaceId(targetNamespace.value as NamespaceId);
    } catch (error) {
      return;
    }
  }

  let namespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespace(targetNamespace.value as NamespaceId);
  targetPublicAccount.value = namespaceInfo.owner;
  txnBuilder.targetPublicKey(targetPublicAccount.value as PublicAccount);

  if (!walletState.currentLoggedInWallet) {
    return
  }
  selectedAcc.value = walletState.currentLoggedInWallet.accounts.find(acc => acc.publicKey === namespaceInfo.owner.publicKey) || walletState.currentLoggedInWallet.others.find(acc => acc.publicKey === namespaceInfo.owner.publicKey);
  if (selectedAcc.value) {
    targetAccIsMultisig.value = selectedAcc.value.getDirectParentMultisig().length ? true : false
  }
}
const namespaceName = computed(() => {
  if (!selectedAcc.value) {
    return ''
  }
  if (props.targetId && props.targetId.length == 16 && Convert.isHexString(props.targetId)) {
    let foundNamespace = selectedAcc.value.namespaces.find(namespace => namespace.idHex == props.targetId)
    return foundNamespace ? foundNamespace.name : ""
  }
  return props.targetId ?? ""

})
const otherAcc = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return null
  }
  if (targetPublicAccount.value) {
    return walletState.currentLoggedInWallet.others.find(acc => acc.publicKey === (targetPublicAccount.value as PublicAccount).publicKey)
  }
  return null
})

watch(otherAcc, async (n) => {
  if (n) {
    if (!walletState.currentLoggedInWallet) {
      return
    }
    selectedAcc.value = walletState.currentLoggedInWallet.accounts.find(acc => acc.publicKey === (targetPublicAccount.value as PublicAccount).publicKey) || walletState.currentLoggedInWallet.others.find(acc => acc.publicKey === (targetPublicAccount.value as PublicAccount).publicKey);
    if (selectedAcc.value) {
      targetAccIsMultisig.value = selectedAcc.value.getDirectParentMultisig().length ? true : false
    }
  }
}, { deep: true })

const handleParamScopedMetadataKey = () => {
  if (props.scopedMetadataKey) {
    scopedMetadataKeySelectable.value = false;

    inputScopedMetadataKey.value = props.scopedMetadataKey;

    if (props.scopedMetadataKey.length === 16 && Convert.isHexString(props.scopedMetadataKey)) {
      scopedMetadataKeyType.value = 2;
      scopedMetadataKeyHex.value = props.scopedMetadataKey;
      txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex.value));

    }
    else {
      scopedMetadataKeyType.value = 1;
      let tempHexData = Convert.utf8ToHex(props.scopedMetadataKey);
      const hexDataBytes = tempHexData.length / 2;

      if (tempHexData.length && hexDataBytes <= 8) {
        if ((tempHexData.length / 2) < 8) {
          tempHexData = tempHexData + "00".repeat(8 - hexDataBytes);
        }
        scopedMetadataKeyHex.value = tempHexData;
        txnBuilder.scopedMetadataKey(UInt64.fromHex(scopedMetadataKeyHex.value));

      }
    }
  }
}

const createTxnBuilder = () => {
  if (!AppState.buildTxn) {
    return
  }
  txnBuilder = AppState.buildTxn.namespaceMetadataBuilder();
  aggregateTxnBuilder = AppState.buildTxn.aggregateBondedBuilder();
}

const loadCurrentMetadataValue = async () => {
  if (targetNamespace.value && scopedMetadataKeyHex.value && AppState.chainAPI) {

    let metadataQueryParams = new MetadataQueryParams();
    metadataQueryParams.targetId = targetNamespace.value as NamespaceId;
    metadataQueryParams.metadataType = MetadataType.NAMESPACE;
    metadataQueryParams.scopedMetadataKey = UInt64.fromHex(scopedMetadataKeyHex.value);

    let searchResults = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);
    if (searchResults.metadataEntries.length) {
      oldValue.value = searchResults.metadataEntries[0].value;

    }

  }
  txnBuilder.oldValue(oldValue.value);
}

const metadataTxnAssignNewValue = () => {
  txnBuilder.value(newValue.value);
}

const buildMetadataTxn = () => {
  metadataTxn = txnBuilder.calculateDifferences().build();
}

const buildAggregateTxn = () => {
  if (metadataTxn) {
    aggregateTxn = aggregateTxnBuilder.innerTransactions([metadataTxn.toAggregate(targetPublicAccount.value as PublicAccount)]).build();
  }
}

const updateAggregateFee = () => {
  if (aggregateTxn) {
    aggregateFee.value = aggregateTxn.maxFee.compact() / Math.pow(10, AppState.nativeToken.divisibility)
  }
}

const init = async () => {
  createTxnBuilder();
  await handleParamTargetId();
  handleParamScopedMetadataKey();
  await loadCurrentMetadataValue();
  metadataTxnAssignNewValue();
  buildMetadataTxn();
  buildAggregateTxn();
  updateAggregateFee();
  fetchExistingKey()
}

if (AppState.isReady) {
  init();
}
else {
  let readyWatcher = watch(AppState, (value) => {
    if (value.isReady) {
      init();
      readyWatcher();
    }
  });
}

const { t } = useI18n();
const walletPassword = ref("");
const err = ref("");
const walletName = walletState.currentLoggedInWallet ? walletState.currentLoggedInWallet.name : ''
const lockFund = computed(() => {
  if (!networkState.currentNetworkProfileConfig) {
    return 0
  }
  return Helper.convertToExact(
    networkState.currentNetworkProfileConfig.lockedFundsPerAggregate ?? 0,
    AppState.nativeToken.divisibility
  )
});

const lockFundTxFee = computed(() => {
  if (networkState.currentNetworkProfile) {
    return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
  }
  return 0;
});

const passwdPattern = "^[^ ]{8,}$";
const showScopedKeyErr = computed(() => {
  if (scopedMetadataKeyType.value == 1) { //regular
    let tempHexData = Convert.utf8ToHex(inputScopedMetadataKey.value);
    let hexDataBytes = tempHexData.length / 2;
    if (hexDataBytes > 8) {
      return true
    } else {
      return false
    }
  } else { //hexa
    if ((inputScopedMetadataKey.value.length > 16)) {
      return true
    }
    else if (inputScopedMetadataKey.value.length % 2 === 1) {
      return true
    }
    else {
      return false
    }
  }
})

const showBalanceErr = computed(() => {
  if (balance.value < totalFee.value) {
    return true
  } else {
    return false
  }
})

const disableAddBtn = computed(() => {
  return (showScopedKeyErr.value == true || inputScopedMetadataKey.value == '' || newValue.value == '' || !walletPassword.value.match(passwdPattern) || showBalanceErr.value == true)
})

const accounts = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return [];
  }
  let accounts = walletState.currentLoggedInWallet.accounts.map(
    (acc) => {
      return {
        name: acc.name,
        balance: acc.balance,
        address: acc.address,
        publicKey: acc.publicKey,
        isMultisig: acc.getDirectParentMultisig().length ? true : false
      };
    });


  let otherAccounts = walletState.currentLoggedInWallet.others.filter((acc) => acc.type === "MULTISIG").map(
    (acc) => {
      return {
        name: acc.name,
        balance: acc.balance,
        address: acc.address,
        publicKey: acc.publicKey,
        isMultisig: true
      };
    });
  return accounts.concat(otherAccounts);

});

const aggregateFee = ref(0);

watch(scopedMetadataKeyType, n => {
  checkOldValue()
  if (n == 2) {
    if (!Convert.isHexString(inputScopedMetadataKey.value)) {
      inputScopedMetadataKey.value = ''
    }
  }
})
const checkOldValue = async () => {
  if (showScopedKeyErr.value || inputScopedMetadataKey.value.length == 0) {
    return
  }
  let tempHexData = ''
  if (scopedMetadataKeyType.value == 1) { //utf8
    let hexValue = Convert.utf8ToHex(inputScopedMetadataKey.value)
    tempHexData = hexValue + "00".repeat((16 - hexValue.length) / 2)
  } else { //hex
    tempHexData = "00".repeat((16 - inputScopedMetadataKey.value.length) / 2) + inputScopedMetadataKey.value
  }
  if (!AppState.chainAPI) {
    return
  }
  let metadataQueryParams = new MetadataQueryParams();
  metadataQueryParams.targetId = targetNamespace.value as NamespaceId;
  metadataQueryParams.metadataType = MetadataType.NAMESPACE;
  metadataQueryParams.scopedMetadataKey = UInt64.fromHex(tempHexData);
  let searchResults = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams);
  if (searchResults.metadataEntries.length) {
    oldValue.value = searchResults.metadataEntries[0].value;
  } else {
    oldValue.value = ""
  }
}

const updateMetadata = () => {
  if (!walletState.currentLoggedInWallet || !AppState.buildTxn || !networkState.currentNetworkProfile) {
    return
  }
  if (!WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword.value)) {
    err.value = t('general.walletPasswordInvalid', { name: walletName })
    return
  }

  let tempHexData = ''
  if (scopedMetadataKeyType.value == 1) { //utf8
    let hexValue = Convert.utf8ToHex(inputScopedMetadataKey.value)
    tempHexData = hexValue + "00".repeat((16 - hexValue.length) / 2)
  } else { //hex
    tempHexData = "00".repeat((16 - inputScopedMetadataKey.value.length) / 2) + inputScopedMetadataKey.value
  }
  let namespaceMetadataTransaction = txnBuilder
    .targetPublicKey(targetPublicAccount.value as PublicAccount)
    .targetNamespaceId(targetNamespace.value as NamespaceId)
    .scopedMetadataKey(UInt64.fromHex(tempHexData))
    .value(newValue.value)
    .oldValue(oldValue.value)
    .calculateDifferences()
    .build()
  let aggregateTx = targetAccIsMultisig.value ?
    aggregateTxnBuilder.innerTransactions([namespaceMetadataTransaction.toAggregate(targetPublicAccount.value as PublicAccount)]).build() :
    AppState.buildTxn.aggregateCompleteBuilder().innerTransactions([namespaceMetadataTransaction.toAggregate(targetPublicAccount.value as PublicAccount)]).build()
  let signer = targetAccIsMultisig.value ?
    walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == selectedCosigner.value) :
    walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == (targetPublicAccount.value as PublicAccount).publicKey)
  let encryptedPassword = WalletUtils.createPassword(walletPassword.value);
  if (!signer) {
    return
  }
  let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, signer.encrypted, signer.iv);
  let signerAcc = Account.createFromPrivateKey(privateKey, AppState.networkType);
  let signedAggregateTransaction = signerAcc.sign(aggregateTx, networkState.currentNetworkProfile.generationHash);
  if (targetAccIsMultisig.value) {
    let lockHashTx = TransactionUtils.lockFundTx(signedAggregateTransaction)
    let signedLockHashTransaction = signerAcc.sign(lockHashTx, networkState.currentNetworkProfile.generationHash);
    TransactionUtils.announceLF_AND_addAutoAnnounceABT(signedLockHashTransaction, signedAggregateTransaction)
  } else {
    TransactionUtils.announceTransaction(signedAggregateTransaction)
  }
  inputScopedMetadataKey.value = ""
  oldValue.value = ""
  newValue.value = ""
  walletPassword.value = ""
  router.push({ name: 'ViewAccountPendingTransactions', params: { address: (targetPublicAccount.value as PublicAccount).address.plain() } })
}

const totalFee = computed(() => {
  let tokenDivisibility = AppState.nativeToken.divisibility
  if (targetAccIsMultisig.value) {
    if (tokenDivisibility == 0) {
      return Math.trunc(lockFund.value + lockFundTxFee.value + aggregateFee.value)
    } else {
      return Math.round((lockFund.value + lockFundTxFee.value + aggregateFee.value) * Math.pow(10, tokenDivisibility)) / Math.pow(10, tokenDivisibility)
    }
  } else {
    return aggregateFee.value
  }

})

const cosigners = computed(() => {
  if (!walletState.currentLoggedInWallet || !targetPublicAccount.value) {
    return []
  }
  if (MultisigUtils.getCosignerInWallet(targetPublicAccount.value.publicKey).cosignerList.length) {
    if (accounts.value) {
      return MultisigUtils.getCosignerInWallet(targetPublicAccount.value.publicKey).cosignerList.map(cosigner => {
        let foundCosigner = accounts.value.find(acc => acc.publicKey == cosigner)
        return {
          name: foundCosigner ? foundCosigner.name : "",
          publicKey: cosigner,
          balance: foundCosigner ? foundCosigner.balance : 0
        }
      })
    } else {
      return []
    }
  } else {
    return []
  }
})
const selectedCosigner = ref('')

if (cosigners.value.length > 0) {
  selectedCosigner.value = cosigners.value[0].publicKey
}

watch(() => cosigners, n => {
  if (n.value.length) {
    selectedCosigner.value = cosigners.value[0].publicKey
  }
}, { deep: true })

const balance = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return 0
  }
  if (targetAccIsMultisig.value) {
    const findAccount = findAcc(selectedCosigner.value)
    if (selectedCosigner.value && findAccount) {
      return findAccount.balance
    } else {
      return 0
    }
  } else {
    if (selectedAcc.value) {
      return selectedAcc.value.balance
    } else {
      return 0
    }
  }
});

const transactionFee = computed(() => {
  return aggregateFee.value
})

const totalFeeFormatted = computed(() => {
  return Helper.amountFormatterSimple(totalFee.value, 0);
});

const getMultiSigCosigner = computed(() => {
  const account = accounts.value.find(acc => acc.address == selectedAccAdd.value)
  let cosigners = MultisigUtils.getCosignerInWallet(account ? account.publicKey : "")
  let list: { hasCosigner: boolean, cosignerList: { publicKey: string, name: string, balance: number, address: string }[] } = { hasCosigner: cosigners.hasCosigner, cosignerList: [] }
  cosigners.cosignerList.forEach(publicKey => {
    const acc = findAcc(publicKey)
    if (acc) {
      list.cosignerList.push({ publicKey: publicKey, name: acc.name, balance: acc.balance, address: acc.address })
    }
  })
  return list
});

const checkCosignBalance = computed(() => {
  const findAccount = findAcc(selectedCosigner.value)
  let cosignBalance = findAccount ? findAccount.balance : 0;
  return Helper.toCurrencyFormat(cosignBalance, 3);
})
watch(oldValue, n => {
  txnBuilder.oldValue(n)
  buildMetadataTxn()
  buildAggregateTxn()
  updateAggregateFee()
})
watch(newValue, n => {
  txnBuilder.value(n)
  buildMetadataTxn()
  buildAggregateTxn()
  updateAggregateFee()
})
watch(inputScopedMetadataKey, n => {
  if (n == "") {
    oldValue.value = ""
  }
})



</script>
