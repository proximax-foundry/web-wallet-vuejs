<template>
  <div>

    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="address" class="mb-6" />
      <AccountTabs :address="address" selected="details" />
      <div class="border-2 border-t-0 filter shadow-lg lg:grid lg:grid-cols-3">
        <div class="lg:col-span-2 py-6 pr-6">
          <div class='pl-6'>
            <div class=" error error_box mb-5" v-if="err != ''">{{ err }}</div>
          </div>
          <div v-if="isMultisig" class="text-left mt-2 mb-5 ml-6">
            <div v-if="walletCosignerList.cosignerList.length > 0">
              <div class="text-tsm">
                {{ $t('general.initiateBy') }}:
                <span class="font-bold" v-if="walletCosignerList.cosignerList.length == 1">
                  {{ walletCosignerList.cosignerList[0].name }}
                </span>
                <span class="font-bold" v-else>
                  <select class="" v-model="selectedCosignPublicKey">
                    <option v-for="(element, item) in  walletCosignerList.cosignerList" :value="findAcc(element.publicKey)?.publicKey"
                      :key="item">
                      {{ element.name }}
                    </option>
                  </select>
                </span>
              </div>
            </div>
          </div>
          <div v-if="!delegateValue">
            <div class="text-xs font-semibold pl-6">{{ $t('general.delegate') }}</div>
            <div class="text-xxs pl-6 mt-2">{{ $t('delegate.notLinked') }}</div>
            <div class="mt-4"></div>
            <div class="ml-6 my-7 gray-line" />
            <div class="pl-6">
              <div class='text-xs text-blue-primary mt-0.5 font-semibold uppercase'>{{ $t('general.privateKey') }}</div>
              <div class="flex">
                <div id="private" class="truncate text-xs mt-1 font-semibold" type="text" :copyValue="privateKey"
                  :copySubject="$t('general.privateKey')">{{ privateKey }}</div>
                <font-awesome-icon :title="$t('general.copy')" icon="copy" @click="copy('private')"
                  class="ml-2 pb-1 w-5 h-5 text-blue-link mt-0.5 cursor-pointer "></font-awesome-icon>
              </div>
              <div class='text-txs mt-1 text-red-400 border px-1.5 py-2 border-red-400 rounded-md'>
                {{ $t('general.pkWarning') }}</div>
            </div>
          </div>
          <div v-else>
            <div class="text-xs font-semibold pl-6">{{ $t('delegate.accDelegated') }}</div>
            <div class="ml-6 px-3 py-2 mt-3 bg-green-100">
              <img src='@/assets/img/icon-blue-tick.svg' class='h-3 w-3 inline-block mr-2'>
              <div class="text-xs  mt-2 inline-block">{{ $t('delegate.linked') }}</div>
            </div>

            <div class="border border-blue-300 rounded-md ml-6 p-3 mt-3 bg-blue-50 overflow-x-auto">
              <div class="text-xs inline-block">{{ $t('delegate.publicKeyOfDelegate') }}</div>
              <font-awesome-icon icon="copy" @click="copy('delegatePublicKey')" :title="$t('general.copy')"
                class="inline-block float-right mt-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
              <div class="text-xs mt-0.5 font-semibold" id="delegatePublicKey" :copyValue="delegateAcc"
                :copySubject="$t('delegate.delegatePublicKey')">{{ delegateAcc }}</div>
            </div>
          </div>
        </div>
        <div class='bg-navy-primary p-6 lg:col-span-1'>
          <TransactionFeeDisplay :fund-status="fundStatus" :is-multisig="isMultisig" :is-cosigner="isCosigner"
            :on-partial="onPartial" :transaction-fee="transactionFee" :total-fee-formatted="totalFeeFormatted"
            :get-multi-sig-cosigner="walletCosignerList" :check-cosign-balance="checkCosignBalance"
            :lock-fund-currency="lockFund" :lock-fund-tx-fee="lockFundTxFee" :balance="accBalance"
            :selected-acc-add="selectedAccAdd" />
          <div class="mt-5" />
          <div class='font-semibold text-xs text-white mb-1.5'>{{ $t('general.enterPasswordContinue') }}</div>
          <PasswordInput :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')"
            :showError="showPasswdError" v-model="walletPassword" />
          <div class="mt-3">
            <button type="submit" class=' w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto'
              @click="createDelegate" v-if="delegateValue" :disabled="disableLinkBtn">{{ $t('delegate.unlinkAcc')
              }}</button>
            <button type="submit" class=' w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto'
              @click="createDelegate" v-if="!delegateValue" :disabled="disableLinkBtn">{{ $t('delegate.delegateAcc')
              }}</button>
          </div>
          <div class="text-center">
            <router-link :to="{ name: 'ViewAccountDetails', params: { address: address } }"
              class="content-center text-xs text-white underline">{{ $t('general.cancel') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed,  watch } from "vue";
import PasswordInput from '@/components/PasswordInput.vue';
import TransactionFeeDisplay from "@/modules/services/components/TransactionFeeDisplay.vue";
import { walletState } from '@/state/walletState';
import { WalletUtils } from "@/util/walletUtils";
import { networkState } from "@/state/networkState";
import { ChainAPICall } from "@/models/REST/chainAPICall"
import { ChainUtils } from "@/util/chainUtils"
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { LinkAction, PublicAccount } from "tsjs-xpx-chain-sdk";
import { useI18n } from 'vue-i18n';
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { Account } from "tsjs-xpx-chain-sdk";
import { AppState } from '@/state/appState';
import { TransactionUtils, findAcc } from '@/util/transactionUtils';
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { MultisigUtils } from "@/util/multisigUtils";
import { AccountUtils } from "@/util/accountUtils";
import type { WalletAccount } from "@/models/walletAccount";
import type { OtherAccount } from "@/models/otherAccount";

const p = defineProps({
  address: {
    type: String,
    required: true
  }
})
const { t } = useI18n();
const privKeyPattern = "^(0x|0X)?[a-fA-F0-9].{63,65}$";
let privateKey = ref('')
let showPrivateKeyError = ref(true)
const walletPassword = ref("");
const showPasswdError = ref(false);
const err = ref("");
const defaultAcc = walletState.currentLoggedInWallet ? walletState.currentLoggedInWallet.selectDefaultAccount() : null
const selectedAccAdd = ref(defaultAcc ? defaultAcc.address : '');
const accBalance = ref(Helper.toCurrencyFormat(defaultAcc ? defaultAcc.balance : 0, AppState.nativeToken.divisibility));
const acc = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return null
  }
  let acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == p.address) || walletState.currentLoggedInWallet.others.find((add) => add.address == p.address);
  if (!acc) {
    return null
  }
  return acc
})
const getCosignerList = () => {
  if (!acc.value) {
    return {hasCosigner:false, cosignerList: []}
  }
  return MultisigUtils.getCosignerInWallet(acc.value.publicKey)
}

const walletCosignerList = computed(() => {
  let cosigners = getCosignerList()
  let list: { hasCosigner: boolean, cosignerList: { publicKey: string, name: string, balance: number, address: string }[] } = { hasCosigner: cosigners.hasCosigner, cosignerList: [] }
  cosigners.cosignerList.forEach(publicKey => {
    const acc = findAcc(publicKey)
    if (acc) {
      list.cosignerList.push({ publicKey: publicKey, name: acc.name, balance: acc.balance, address: acc.address })
    }
  })
  return list
})

const isCosigner = computed(() => {
  if (!acc.value) {
    return false
  }
  return (MultisigUtils.getCosignerInWallet(acc.value.publicKey).cosignerList.length > 0) ? true : false;
});

const selectedCosignPublicKey = ref(walletCosignerList.value.cosignerList[0] ? walletCosignerList.value.cosignerList[0].publicKey : '')

watch(walletCosignerList, n => {
  if (n.cosignerList.length) {
    selectedCosignPublicKey.value = n.cosignerList[0] ? n.cosignerList[0].publicKey : ''
  }
}, { deep: true })

let onPartial = ref(false)

const checkIsPartial = () => {
  if (!acc.value) {
    return
  }
  MultisigUtils.onPartial(PublicAccount.createFromPublicKey(acc.value.publicKey, AppState.networkType))
    .then(onPartialBoolean => onPartial.value = onPartialBoolean)
    .catch(()=> {
      onPartial.value = false
    })
}
checkIsPartial()

const lockFund = computed(() => {
  if (!networkState.currentNetworkProfileConfig || !networkState.currentNetworkProfileConfig.lockedFundsPerAggregate) {
    return 0
  }
  return Helper.convertToExact(networkState.currentNetworkProfileConfig.lockedFundsPerAggregate, AppState.nativeToken.divisibility)
})

const lockFundTxFee = computed(() => {
  if (networkState.currentNetworkProfile) {
    return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
  }
  return 0;
});

const isMultisig = computed(() => {
  if (!acc.value) {
    return false
  }
  return acc.value.getDirectParentMultisig().length >0
});

let transactionFee = computed(() => {
  return AccountUtils.getDelegateFee(isMultisig.value)

})

const totalFee = computed(() => {
  if (isMultisig.value) { //aggregate bonded
    return transactionFee.value + lockFund.value + lockFundTxFee.value
  } else {
    return transactionFee.value
  }
})

const accountBalance = computed(() => {
  if (!acc.value) {
    return 0
  }
  return acc.value.balance
})



const fundStatus = computed(() => {
  var fundStatus = false
  if (isMultisig.value) {
    const acc = findAcc(selectedCosignPublicKey.value)
    if (acc) {
      if (acc.balance < totalFee.value) {
        fundStatus = true
      } else {
        fundStatus = false
      }
    }
  } else {
    if (accountBalance.value < totalFee.value) {
      fundStatus = true
    }
  }
  return fundStatus
})

watch(privateKey, n => {
  if (!n.match(privKeyPattern)) {
    showPrivateKeyError.value = true
  } else {
    showPrivateKeyError.value = false
  }
})
//const delegateValue = ref(false);

const delegateAcc = ref('');
const AccPublicKey = ref("");
const router = useRouter();
const toast = useToast();
const passwdPattern = "^[^ ]{8,}$";
const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));
const walletName = walletState.currentLoggedInWallet ? walletState.currentLoggedInWallet.name : ''
const disableLinkBtn = computed(() => {
  if (onPartial.value || fundStatus.value || (!isCosigner.value && isMultisig.value)) {
    return true
  } else if (!delegateValue.value) {
    if (walletPassword.value.match(passwdPattern)) {
      return false
    } else {
      return true
    }
  } else if (delegateValue.value) {
    if (walletPassword.value.match(passwdPattern)) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
});

const copy = (id: string) => {
  let element = document.getElementById(id);
  if (element) {
    let stringToCopy = element.getAttribute("copyValue");
    let copySubject = element.getAttribute("copySubject");
    if (stringToCopy) {
      copyToClipboard(stringToCopy);
      toast.add({
        severity: "info",
        detail: copySubject + " copied",
        group: "br-custom",
        life: 3000,
      });
    }
  }
};

const verifyDelegateAcc = async () => {
  if (!acc.value) {
    return
  }
  if (acc.value) {
    const publicAccount = Helper.createPublicAccount(acc.value.publicKey, AppState.networkType);
    const accountInfo = await chainAPICall.accountAPI.getAccountInfo(publicAccount.address);

    delegateAcc.value = accountInfo.linkedAccountKey;
  }

};

verifyDelegateAcc();
watch(() => acc, () => {
  verifyDelegateAcc()
}, { deep: true })

const delegateValue = computed(() => {
  let delegateBoolean = false
  if (delegateAcc.value != '') {
    if (delegateAcc.value === "0".repeat(64)) {
      delegateBoolean = false;
    } else if (delegateAcc.value !== "0".repeat(64)) {
      delegateBoolean = true;
    }
  }
  return delegateBoolean;
});

const generatePrivateKey = async () => {
  privateKey.value = Account.generateNewAccount(AppState.networkType).privateKey;
}
generatePrivateKey();

const createDelegate = async () => {
  const account = WalletUtils.createAccountFromPrivateKey(privateKey.value, AppState.networkType);
  if (account) {
    AccPublicKey.value = account.publicKey;

  }
  if (WalletUtils.verifyWalletPassword(walletName, networkState.chainNetworkName, walletPassword.value)) {
   
    if (delegateAcc.value !== "0".repeat(64)) { //unlink
      AccountUtils.createDelegateTransaction(selectedCosignPublicKey.value, isMultisig.value, acc.value as WalletAccount | OtherAccount, walletPassword.value, delegateAcc.value, LinkAction.Unlink);
      walletPassword.value = ""
      err.value = ""
    } else if (AccPublicKey.value != "") { //link
      AccountUtils.createDelegateTransaction(selectedCosignPublicKey.value, isMultisig.value, acc.value as WalletAccount  | OtherAccount, walletPassword.value, AccPublicKey.value, LinkAction.Link);
      walletPassword.value = ""
      err.value = ""
    } 
    router.push({ name: "ViewAccountPendingTransactions", params: { address: p.address } })
  } else {
    err.value = t('general.walletPasswordInvalid', { name: walletName });
  }
};

const totalFeeFormatted = computed(() => {
  return Helper.amountFormatterSimple(totalFee.value, 0);
});


const checkCosignBalance = computed(() => {
  const findAccount = findAcc(selectedCosignPublicKey.value)
  let cosignBalance =  findAccount ? findAccount.balance : 0;
  return Helper.toCurrencyFormat(cosignBalance, 3);
})


</script>
<style> [v-cloak] {
   display: none;
 }
</style>