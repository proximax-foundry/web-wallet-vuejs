<template>
  <div>
    <AddContactModal :toggleModal="togglaAddContact" :saveAddress="recipientInput" />
    <ConfirmSendModal :toggleModal="toggleConfirm" />
    <div class='w-10/12 ml-auto mr-auto mt-5'>
      <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8">
        <div class="xl:col-span-2 p-12">
          <div class="text-sm font-semibold ">{{ $t('transfer.newTransfer') }}</div>
          <div class=" error error_box mb-5" v-if="err != ''">{{ err }}</div>
          <div v-if="isNotCosigner" class="rounded-md bg-yellow-200 w-full p-2 flex items-center justify-center">
            <div class="rounded-full w-5 h-5 bg-yellow-100 inline-block relative mr-2"><font-awesome-icon
                icon="exclamation" class="text-yellow-500 h-3 w-3 absolute"
                style="top: 5px; left:7px"></font-awesome-icon></div>
            <div class="inline-block text-xs">{{ $t('general.noCosigner') }}</div>
          </div>
          <div v-else-if="showBalanceErr" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
            <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2"><font-awesome-icon
                icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon></div>
            <div class="inline-block text-xs">{{ $t('general.insufficientBalance') }}</div>
          </div>
          <div class="mt-4" />
          <SelectInputAccount v-model="selectedAccAdd" :selectDefault="selectedAccAdd" />
          <div v-if="isMultiSigBool" class="text-left mt-2 mb-5 ml-4">
            <div v-if="getWalletCosigner.cosignerList.length > 0">
              <div class="text-tsm">
                {{ $t('general.initiateBy') }}:
                <span class="font-bold" v-if="getWalletCosigner.cosignerList.length == 1">
                  {{ getWalletCosigner.cosignerList[0].name }} ({{ $t('general.balance') }}:{{
                    getWalletCosigner.cosignerList[0].balance }} {{ currentNativeTokenName }})
                </span>
                <span class="font-bold" v-else>
                  <select class="" v-model="cosignAddress">
                    <option v-for="(element, item) in  getWalletCosigner.cosignerList"
                      :value="findAcc(element.publicKey)?.address" :key="item">
                      {{ element.name }} ({{ $t('general.balance') }}: {{ element.balance }} {{ currentNativeTokenName }})
                    </option>
                  </select>
                </span>
                <div v-if="cosignerBalanceInsufficient" class="error">
                  {{ $t('general.insufficientBalance') }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex mt-3 gap-1">
            <AddressInputClean :placeholder="$t('transfer.transferPlaceholder')" v-model="recipientInput"
              v-debounce:1000="checkRecipient" :showError="showAddressError" :disabled="disableRecipient" />
            <div @click="toggleContact = !toggleContact"
              class=' border rounded-md cursor-pointer flex flex-col justify-around p-2 '>
              <font-awesome-icon icon="id-card-alt" class=" text-blue-primary ml-auto mr-auto "></font-awesome-icon>
              <div class='text-xxs text-blue-primary font-semibold uppercase'>{{ $t('general.select') }}</div>
            </div>
          </div>
          <!-- Pop Up when select icon is clicked -->
          <Sidebar v-model:visible="toggleContact" :baseZIndex="10000" position="full">
            <SelectAccountAndContact :contacts="contacts" :selectedNode="selectedNode" @node-select="onNodeSelect" />
          </Sidebar>

          <div v-for="(mosaic, index) in mosaicsCreated" :key="index">
            <MosaicInput :placeholder="$t('transfer.selectAsset')" errorMessage="" v-model="selectedMosaic[index].id"
              :index="index" :options="mosaics" :disableOptions="selectedMosaic" @show-mosaic-selection="updateMosaic"
              @remove-mosaic-selected="removeMosaic" />
            <TransferInputClean v-if="selectedMosaic[index].id != '0'" v-model="selectedMosaic[index].amount"
              :placeholder="$t('transfer.assetAmount')" type="text" :showError="showAssetBalanceErr[index]"
              :decimal="mosaicSupplyDivisibility[index]" />
          </div>
          <div>
            <button
              class="my-2 font-semibold text-xs text-blue-primary outline-none focus:outline-none disabled:opacity-50"
              :disabled="addMosaicsButton || mosaics.length == 0" @click="displayMosaicsOption">
              + {{ $t('transfer.addAssets') }}
            </button>
          </div>
          <TransferInputClean v-model="sendXPX" :balance="Number(balance)" :placeholder="$t('transfer.transferAmount')"
            :logo="true" type="text" :showError="showBalanceErr" :decimal="6" :disabled="disableSupply" />
          <TransferTextareaInput class="pt-4" :placeholder="$t('general.message')"
            :errorMessage="$t('general.limitExceed')" v-model="messageText" :remainingChar="remainingChar"
            :showError="showLimitErr" :limit="messageLimit" icon="comment" :msgOpt="msgOption"
            :disabled="disableMsgInput" />
          <div class="mb-5" v-if="!encryptedMsgDisable">
            <input id="encryptedMsg" type="checkbox" value="encryptedMsg" v-model="encryptedMsg"
              :disabled="disableEncryptMsg" />
            <label for="encryptedMsg" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">
              {{ $t('transfer.enableEncryption') }}
            </label>
          </div>
        </div>
        <div class='bg-navy-primary py-6 px-6 xl:col-span-1'>
          <TransactionFeeDisplay :send-x-p-x="sendXPX" :selected-mosaic="selectedMosaic" :mosaics-created="mosaicsCreated"
            :transaction-fee="effectiveFee" :total-fee-formatted="String(totalFee)"
            :get-multi-sig-cosigner="getWalletCosigner" :check-cosign-balance="checkCosignBalance"
            :lock-fund-currency="lockFundCurrency" :lock-fund-tx-fee="lockFundTxFee" :balance="String(balance)"
            :selected-acc-add="selectedAccAdd" />
          <div class="mt-5" />
          <div class='font-semibold text-xs text-white mb-1.5'>{{ $t('general.enterPasswordContinue') }}</div>
          <PasswordInput :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')"
            :showError="showPasswdError" v-model="walletPassword" icon="lock" class="mt-5 mb-3"
            :disabled="disablePassword" />
          <button type="submit" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
            :disabled="disableCreate" @click="makeTransfer()">
            {{ $t('general.transfer') }}
          </button>
          <div class="text-center">
            <router-link :to="{ name: 'ViewDashboard' }" class="content-center text-xs text-white underline">{{
              $t('general.cancel') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Helper } from "@/util/typeHelper";
import { computed, ref, getCurrentInstance, watch } from "vue";
import PasswordInput from "@/components/PasswordInput.vue";
import MosaicInput from "@/modules/transfer/components/MosaicInput.vue";
import TransferTextareaInput from "@/modules/transfer/components/TransferTextareaInput.vue";
import {
  createTransaction,
  makeTransaction,
} from "@/util/transfer"; //getMosaicsAllAccounts
import AddContactModal from "@/modules/transfer/components/AddContactModal.vue";
import ConfirmSendModal from "@/modules/transfer/components/ConfirmSendModal.vue";
import { useI18n } from 'vue-i18n'
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { isMultiSig, TransactionUtils, findAccWithAddress, findAcc } from '@/util/transactionUtils';
import { ChainUtils } from '@/util/chainUtils';
import { NamespaceUtils } from '@/util/namespaceUtils';
import SelectInputAccount from "@/components/SelectInputAccount.vue";
import SelectAccountAndContact from "@/components/SelectAccountAndContact.vue";
import AddressInputClean from "@/modules/transfer/components/AddressInputClean.vue"
import TransferInputClean from "@/modules/transfer/components/TransferInputClean.vue"
import { AppState } from '@/state/appState';
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
import type { NamespaceId } from 'tsjs-xpx-chain-sdk';
import { useRouter } from 'vue-router';
import { MultisigUtils } from "@/util/multisigUtils";
import { AccountUtils } from "@/util/accountUtils";
import type { WalletAccount } from "@/models/walletAccount";
import type { TreeNode } from "primevue/tree";
import type { OtherAccount } from "@/models/otherAccount";
import type { Asset } from "@/models/asset";

const router = useRouter()
const currentNativeTokenName = computed(() => AppState.nativeToken.label);
const toggleContact = ref(false)
const { t } = useI18n();
const selectedNodeIndex = ref()
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const showContactSelection = ref(false);
const showAssetBalanceErr = ref<boolean[]>([])
const selectContact = ref("0");
const recipientInput = ref("");
const selectedNode = ref<TreeNode>({})
const msgOption = ref("regular");
const messageText = ref("");
const walletPassword = ref("");
const err = ref("");
const encryptedMsg = ref("");
const togglaAddContact = ref(false);
interface selectedMosaic{
  id:number,
  amount:string,
  namespace:string
}
const selectedMosaic = ref<{ id: string, amount: string , namespace: string }[]>([]);
const mosaicsCreated = ref<number[]>([]);
const selectedMosaicAmount = ref([]);
const mosaicSupplyDivisibility = ref<number[]>([]);
const sendXPX = ref("0");
const encryptedMsgDisable = ref(true);
const toggleConfirm = ref(false);
const forceSend = ref(false);
const isNotCosigner = ref(false);
const cosignAddress = ref("");

const disableAllInput = ref(false);
const disableRecipient = computed(() => disableAllInput.value);
const disableSupply = computed(() => disableAllInput.value);
const disableEncryptMsg = computed(() => disableAllInput.value);
const disableMsgInput = computed(() => disableAllInput.value);
const disablePassword = computed(() => disableAllInput.value);
const cosignerBalanceInsufficient = ref(false);
const networkType = AppState.networkType;
const chainAPIEndpoint = computed(() => ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile?.httpPort));

const lockFund = computed(() => {
  if (!networkState.currentNetworkProfileConfig || !networkState.currentNetworkProfileConfig.lockedFundsPerAggregate) {
    return 0
  }
  return Helper.convertToExact(
    networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
    AppState.nativeToken.divisibility
  )
}
);
const lockFundCurrency = computed(() => {
  if (!networkState.currentNetworkProfileConfig || !networkState.currentNetworkProfileConfig.lockedFundsPerAggregate) {
    return 0
  }
  return Helper.convertToExact(
    networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
    AppState.nativeToken.divisibility
  )
});

const lockFundTxFee = computed(() => {
  if (networkState.currentNetworkProfile) {
    return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
  }
  return 0;
});
const lockFundTotalFee = computed(
  () => lockFund.value + lockFundTxFee.value
);

const messageLimit = computed(() => {
  if (!networkState.currentNetworkProfileConfig || !networkState.currentNetworkProfileConfig.maxMessageSize) {
    return 0
  }
  return networkState.currentNetworkProfileConfig.maxMessageSize - 1
});
const addressPatternShort = "^[0-9A-Za-z]{40}$";
const addressPatternLong = "^[0-9A-Za-z-]{46}$";
const remainingChar = ref(0);
const showAddressError = ref(true);
const passwdPattern = "^[^ ]{8,}$";
const showPasswdError = ref(false);
const showLimitErr = ref(false);

const wallet = walletState.currentLoggedInWallet
const selectedAccName = ref(
  wallet ? (wallet.selectDefaultAccount() as WalletAccount).name : ''
);
const selectedAccAdd = ref(
  wallet ? (wallet.selectDefaultAccount() as WalletAccount).address : ''
);

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
const getWalletCosigner = computed(() => {
  if (networkState.currentNetworkProfileConfig) {
    const findAccount = accounts.value.find(acc => acc.address == selectedAccAdd.value)
    let cosigners = MultisigUtils.getCosignerInWallet(findAccount ? findAccount.publicKey : '')
    let list: { publicKey: string, name: string, balance: number, address: string }[] = []

    cosigners.cosignerList.forEach(publicKey => {
      const findAccount = findAcc(publicKey)
      if (findAccount) {
        list.push({ publicKey: publicKey, name: findAccount.name, balance: findAccount.balance, address: findAccount.address })
      }
    })
    return { hasCosigner: cosigners.hasCosigner, cosignerList: list }
  } else {
    return { hasCosigner: false, cosignerList: [] }
  }
})

const isMultiSigBool = computed(() => {
  return isMultiSig(selectedAccAdd.value)
}
)

const effectiveFee = ref(isMultiSigBool.value ? makeTransaction.calculate_aggregate_fee(
  messageText.value,
  sendXPX.value,
  selectedMosaic.value as { id: string, amount: string }[]
) : makeTransaction.calculate_fee(
  messageText.value,
  sendXPX.value,
  selectedMosaic.value as { id: string, amount: string }[]
))
if (isMultiSigBool.value && wallet) {
  let cosigner = getWalletCosigner.value.cosignerList
  if (cosigner.length > 0) {
    const findAcc = wallet.accounts.find(acc => acc.publicKey == cosigner[0].publicKey)
    if (findAcc) {
      cosignAddress.value = findAcc.address
    }
    const findAccount = findAccWithAddress(cosignAddress.value)
    if (findAccount && findAccount.balance < lockFundTotalFee.value + Number(effectiveFee.value)) {
      disableAllInput.value = true;
      cosignerBalanceInsufficient.value = true;
    } else {
      disableAllInput.value = false;
      cosignerBalanceInsufficient.value = false;
    }
  } else {
    disableAllInput.value = true;
  }
}

const checkCosignBalance = computed(() => {
  const findAccount = findAccWithAddress(cosignAddress.value)
  let cosignBalance = findAccount ? findAccount.balance : 0;
  return Helper.toCurrencyFormat(cosignBalance, AppState.nativeToken.divisibility);
})

const balance = computed(() => {
  if (walletState.currentLoggedInWallet) {
    const findAcc = accounts.value.find((element) => element.address === selectedAccAdd.value)
    if (!findAcc) {
      return 0
    }
    return findAcc.balance
  }
  return 0;
});

const contacts = computed(() => {

  const wallet = walletState.currentLoggedInWallet;
  if (!wallet) {
    return []
  }
  let accounts = wallet.accounts.map(
    (account) => {
      return {
        name: account.name,
        publicKey: account.publicKey,
      }
    });

  let addressBook = wallet.contacts
  var contacts: { key: string, label: string, selectable: boolean, children: { key: string, label: string, data: string, selectable: boolean }[] }[] = [];
  var indexNo = 0

  contacts.push({
    key: "0",
    label: t('general.ownerAcc'),
    selectable: false,
    children: []
  }
  )
  accounts.forEach((element) => {
    contacts[0].children.push(
      {
        key: "0-" + indexNo.toString(),
        label: element.name,
        data: element.publicKey,
        selectable: false
      }
    )
    indexNo++
  })

  indexNo = 0
  // getting address book contacts
  contacts.push({
    key: "1",
    label: t('general.contact'),
    selectable: false,
    children: []
  }
  )

  if (addressBook != undefined) {
    addressBook.forEach((element) => {
      contacts[1].children.push(
        {
          key: "1-" + indexNo.toString(),
          label: element.name,
          data: element.address,
          selectable: false
        }
      )
      indexNo++
    });
  }
  return contacts
});

const onNodeSelect = (node: { key: string, label: string, data: string, selectable: boolean }) => {
  makeNodeSelectable()
  toggleContact.value = false
  recipientInput.value = node.data
  // this is too make it turn blue
  selectedNode.value[node.key] = true
  node.selectable = false
}


const makeNodeSelectable = () => {
  // if there is previously unselectable value make it selectable
  if (Object.keys(selectedNode.value).length !== 0) {
    selectedNodeIndex.value = Object.keys(selectedNode.value)[0].split('-')
    contacts.value[selectedNodeIndex.value[0]].children[selectedNodeIndex.value[1]].selectable = true
    selectedNode.value = {}
  }
}

const clearInput = () => {
  selectContact.value = "0";
  walletPassword.value = "";
  recipientInput.value = "";
  encryptedMsgDisable.value = true;
  messageText.value = "";
  sendXPX.value = "0";
  emitter.emit("CLEAR_SELECT", 0);
  selectedMosaic.value = [];
  mosaicsCreated.value = [];
  selectedMosaicAmount.value = [];
  mosaicSupplyDivisibility.value = [];
  showContactSelection.value = false;
};



const makeTransfer = async () => {
  if (!wallet) {
    return
  }
  if (sendXPX.value == "0" && !forceSend.value) {
    toggleConfirm.value = true;
  } else {

    let selectedCosign = "";
    if (isMultiSigBool.value) {

      let selectedCosignList = getWalletCosigner.value.cosignerList;
      if (selectedCosignList.length > 1) {
        selectedCosign = cosignAddress.value;
      } else {
        const findAcc = wallet.accounts.find(acc => acc.publicKey == selectedCosignList[0].publicKey)
        if (findAcc) {
          selectedCosign = findAcc.address
        }
      }
    }
    let transferStatus = await createTransaction(
      recipientInput.value.toUpperCase(),
      sendXPX.value,
      messageText.value,
      selectedMosaic.value as { id: string, amount: string }[],
      mosaicSupplyDivisibility.value,
      walletPassword.value,
      selectedAccAdd.value,
      selectedCosign,
      encryptedMsg.value
    );
    if (!transferStatus) {
      err.value = t('general.walletPasswordInvalid', { name: walletState.currentLoggedInWallet?.name });
    } else {

      err.value = "";

      if (!AccountUtils.checkAvailableContact(recipientInput.value)) {

        // add new contact
        togglaAddContact.value = true;
      } else {
        router.push({ name: "ViewAccountPendingTransactions", params: { address: selectedAccAdd.value } })
        clearInput();
      }
      forceSend.value = false;

    }
  }
};

const addMosaicsButton = computed(() => {
  if (!disableSupply.value) {
    let account;
    if (!walletState.currentLoggedInWallet) {
      account = undefined;
    } else {
      account = walletState.currentLoggedInWallet.accounts.find(
        (element) => element.name == selectedAccName.value) ||
        walletState.currentLoggedInWallet.others.find(
          (element) => element.name == selectedAccName.value)
    }

    if (account != undefined) {
      if (account.assets != undefined) {
        if (
          account.assets.length == 0 ||
          mosaicsCreated.value.length == mosaics.value.length
        ) {
          return true;
        } else {
          return false;
        }
      }
    }

    return true;
  } else {
    return true;
  }
});

const checkIsNaN = (string: string) => {
  return isNaN(parseFloat(string)) ? 0 : parseFloat(string)
}

const totalFee = computed(() => {
  let tokenDivisibility = AppState.nativeToken.divisibility
  if (!isMultiSig(selectedAccAdd.value)) {
    if (tokenDivisibility == 0) {
      return Math.trunc(checkIsNaN(sendXPX.value.replace(/,/g, '')) + effectiveFee.value)
    } else {
      return Math.round((checkIsNaN(sendXPX.value.replace(/,/g, '')) + effectiveFee.value) * Math.pow(10, tokenDivisibility)) / Math.pow(10, tokenDivisibility)
    }
  } else {
    if (tokenDivisibility == 0) {
      return Math.trunc(effectiveFee.value + lockFundTxFee.value + lockFund.value)
    } else {
      return Math.round((effectiveFee.value + lockFundTxFee.value + lockFund.value) * Math.pow(10, tokenDivisibility)) / Math.pow(10, tokenDivisibility)
    }
  }
})

const showBalanceErr = computed(() => {
  if (isMultiSigBool.value) {
    if (parseFloat(sendXPX.value) > balance.value || !(showAssetBalanceErr.value.every(value => value == false))) {
      return true
    } else {
      return false
    }
  } else {
    if (totalFee.value > balance.value || !(showAssetBalanceErr.value.every(value => value == false))) {
      return true
    } else {
      return false
    }
  }
})
const disableCreate = computed(() => {
  return !(
    walletPassword.value.match(passwdPattern) &&
    !showAddressError.value &&
    recipientInput.value.length > 0 &&
    (showAssetBalanceErr.value.every(value => value == false)) &&
    !showBalanceErr.value &&
    !showLimitErr.value

  );
});

const mosaics = computed(() => {
  var mosaicOption: { val: string, balance: string, label: string, id: number, disabled: boolean }[] = [];
  if (!walletState.currentLoggedInWallet) {
    return mosaicOption;
  }
  const account = walletState.currentLoggedInWallet.accounts.find(
    (element) => element.name == selectedAccName.value
  ) || walletState.currentLoggedInWallet.others.find(
    (element) => element.name == selectedAccName.value) as WalletAccount | OtherAccount
  if (account.assets.length > 0) {
    let index = 0;
    for (let asset of account.assets) {

      if (asset.rawAmount === 0) {
        continue;
      }

      if (!asset.namespaceNames.includes(AppState.nativeToken.fullNamespace)) {
        mosaicOption.push({
          val: asset.idHex,
          balance: t('general.balance') + ":" + Helper.toCurrencyFormat(asset.amount, asset.divisibility ?? 0),
          label: (asset.namespaceNames.length > 0 ? asset.namespaceNames[0] : asset.idHex),
          id: index + 1,
          disabled: false
        });
        index += 1;
      }
    }
  }
  return mosaicOption;
});
for (let i = 0; i < mosaics.value.length; i++) {
  showAssetBalanceErr.value.push(false)
}

const displayMosaicsOption = () => {
  mosaicsCreated.value.push(0);
  selectedMosaic.value.push({ id: "0", amount: "0", namespace: "" });
};
// update mosaic
const updateMosaic = (e: { index: number }) => {
  if (!wallet) {
    return
  }
  // get mosaic info and format divisibility in supply input
  const account = wallet.accounts.find((account) => account.address === selectedAccAdd.value) || wallet.others.find((account) => account.address === selectedAccAdd.value)
  let mosaic = (account as WalletAccount | OtherAccount).assets.find(
    (asset) => asset.idHex == selectedMosaic.value[e.index].id
  ) as Asset
  // enable back the option
  for (let i in mosaics.value) {
    mosaics.value[i].disabled = false
  }
  // disable all the options choosen
  mosaics.value.forEach(o1 => selectedMosaic.value.some(o2 => {
    if (o1.val == o2.id) {
      o1.disabled = true;
    }
  }));

  // check is namespace is link to asset
  if (mosaic.namespaceNames.length >= 1) {
    selectedMosaic.value[e.index].namespace = mosaic.namespaceNames[0]
  }
  else {
    selectedMosaic.value[e.index].namespace = mosaic.idHex
  }
  selectedMosaic.value[e.index].amount = "0";
  mosaicSupplyDivisibility.value[e.index] = mosaic.divisibility ?? 0;
  emitter.emit("CLOSE_MOSAIC_INSUFFICIENT_ERR", false);
};

const removeMosaic = (e: { index: number }) => {
  if (selectedMosaic.value[e.index] != undefined && selectedMosaic.value[e.index].id != "0") {
    // enabling back the option
    mosaics.value[mosaics.value.findIndex(item => item.val === selectedMosaic.value[e.index].id)].disabled = false
  }
  selectedMosaic.value.splice(e.index, 1);
  showAssetBalanceErr.value.splice(e.index, 1)
  mosaicSupplyDivisibility.value.splice(e.index, 1);
  mosaicsCreated.value.splice(e.index, 1);
};



watch(selectedAccAdd, () => {
  if (!wallet) {
    return
  }
  isNotCosigner.value = false
  showAssetBalanceErr.value = []
  for (let i = 0; i < mosaics.value.length; i++) {
    showAssetBalanceErr.value.push(false)
  }
  if (isMultiSigBool.value) {

    let cosigner = getWalletCosigner.value.cosignerList
    if (cosigner.length > 0) {
      const findAcc = wallet.accounts.find(acc => acc.publicKey == cosigner[0].publicKey)
      if (findAcc) {
        cosignAddress.value = findAcc.address;
      }
      if (cosigner[0].balance < lockFundTotalFee.value) {
        disableAllInput.value = true;
      } else {
        disableAllInput.value = false;
      }
    } else {
      isNotCosigner.value = true
      disableAllInput.value = true;
    }
  }
  else {
    disableAllInput.value = false;
  }
})

watch(cosignAddress, (n, o) => {
  if (n != o) {
    const findAcc = accounts.value.find((element) => element.address == n)
    if (findAcc &&
      findAcc.balance <
      lockFundTotalFee.value + Number(effectiveFee.value)
    ) {
      cosignerBalanceInsufficient.value = true;
      disableAllInput.value = true;
    } else {
      cosignerBalanceInsufficient.value = false;
      disableAllInput.value = false
    }

  }
});

watch(recipientInput, n => {
  checkEncryptable(n);
  if (n.length == 40 || n.length == 46) {
    checkEncryptable(n);
    checkRecipient()
  } else {
    showAddressError.value = true
  }
})
const checkRecipient = () => {
  if (!walletState.currentLoggedInWallet) {
    return;
  }
  try {
    let recipientAddress = Helper.createAddress(recipientInput.value);
    let networkOk = Helper.checkAddressNetwork(recipientAddress, networkType);
    if (!networkOk) {
      showAddressError.value = true;
    }
    else {
      checkEncryptable(recipientInput.value);
      showAddressError.value = false;
    }
  } catch (error) {
    try {
      let namespaceId = Helper.createNamespaceId(recipientInput.value);
      checkNamespace(namespaceId).then((address) => {
        recipientInput.value = address.plain();
        showAddressError.value = false;
        checkEncryptable(recipientInput.value);
      }).catch((error) => {
        showAddressError.value = true;
      });
    }
    catch (error) {
      /* console.log(error); */
      showAddressError.value = true;
    }
  }
}
const checkEncryptable = (add: string) => {
  // show and hide encrypted message option
  if (add.match(addressPatternLong) || add.match(addressPatternShort)) {
    AccountUtils.verifyPublicKey(recipientInput.value).then(verify =>
      encryptedMsgDisable.value = verify
    ).catch(() => encryptedMsgDisable.value = true)
  } else {
    encryptedMsgDisable.value = true;
    showAddressError.value = true
  }
}
const checkNamespace = async (nsId: NamespaceId) => {
  return await NamespaceUtils.getLinkedAddress(nsId, chainAPIEndpoint.value);
}
const updateFee = () => {
  effectiveFee.value = isMultiSig(selectedAccAdd.value) ? makeTransaction.calculate_aggregate_fee(
    messageText.value,
    sendXPX.value,
    selectedMosaic.value as { id: string, amount: string }[]
  ) : makeTransaction.calculate_fee(
    messageText.value,
    sendXPX.value,
    selectedMosaic.value as { id: string, amount: string }[]
  );
}
watch(selectedAccName, (n, o) => {
  if (n != o) {
    makeNodeSelectable()
    recipientInput.value = "";
    updateFee()
  }
});
watch(sendXPX, (n, o) => {
  if (n != o) {
    updateFee()
  }
});

watch(messageText, (n, o) => {
  if (n != o) {
    updateFee()
    if (encryptedMsg.value && messageText.value) {
      remainingChar.value = TransactionUtils.getFakeEncryptedMessageSize(messageText.value);
    } else {
      remainingChar.value = TransactionUtils.getPlainMessageSize(messageText.value);
    }
    if (messageText.value.length > messageLimit.value || remainingChar.value > messageLimit.value) {
      showLimitErr.value = true;
    }
    else {
      showLimitErr.value = false;
    }
  }
});
const getMosaicBalanceById = (id: string) => {
  let accAddress = selectedAccAdd.value
  if (!wallet) {
    return
  }
  let acc = (wallet.accounts.find(acc => acc.address == accAddress) ? wallet.accounts.find(acc => acc.address == accAddress) : wallet.others.find(acc => acc.address == accAddress)) as WalletAccount | OtherAccount
  return acc.getAssetBalance(id)
}

watch(encryptedMsgDisable, (n) => {
  if (!n) {
    encryptedMsg.value = "";
  }
});
watch(encryptedMsg, (n) => {
  if (n) {
    if (messageText.value) {
      remainingChar.value = TransactionUtils.getFakeEncryptedMessageSize(messageText.value);
      if (messageText.value.length > messageLimit.value || remainingChar.value > messageLimit.value) {
        showLimitErr.value = true;
      }
      else {
        showLimitErr.value = false;
      }
    }
  } else {
    remainingChar.value = TransactionUtils.getPlainMessageSize(messageText.value);
    if (messageText.value.length > messageLimit.value || remainingChar.value > messageLimit.value) {
      showLimitErr.value = true;
    }
    else {
      showLimitErr.value = false;
    }
  }
});

watch(() => [...selectedMosaic.value], (n) => {
  updateFee()
  for (let i = 0; i < n.length; i++) {
    const balance = getMosaicBalanceById(n[i].id as string)
    if (balance && parseFloat(n[i].amount) > balance) {
      showAssetBalanceErr.value[i] = true
    } else {
      showAssetBalanceErr.value[i] = false
    }
  }
}, { deep: true });


emitter.on("CLOSE_CONTACT_MODAL", (payload: boolean) => {
  togglaAddContact.value = payload;
  router.push({ name: "ViewAccountPendingTransactions", params: { address: selectedAccAdd.value } })
  clearInput();
});
emitter.on("select-account", (address: string) => {
  if (!wallet) {
    return
  }
  const findAcc = wallet.accounts.find(acc => acc.address == address)
  selectedAccName.value = findAcc ? findAcc.name : (wallet.others.find(acc => acc.address == address) as OtherAccount).name
  selectedAccAdd.value = address;
  selectedMosaic.value = [];
  mosaicsCreated.value = [];
  selectedMosaicAmount.value = [];
  mosaicSupplyDivisibility.value = [];
});

// confirm modal
emitter.on("CLOSE_CONFIRM_SEND_MODAL", (payload: boolean) => {
  toggleConfirm.value = payload;
});
emitter.on("CONFIRM_PROCEED_SEND", (payload: boolean) => {

  if (payload) {
    forceSend.value = payload;
    toggleConfirm.value = false;
    makeTransfer();
  }
});


</script>
<style scoped lang="scss">
.slide-enter-active {
  -moz-transition-duration: 1s;
  -webkit-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
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
  background: #d9ebff;
}

.p-tree::deep {
  .p-tree-container .p-treenode .p-treenode-content {
    padding-left: 2px;
    padding-top: 2px
  }

  .p-link {
    padding: 0;
    margin: 0;
  }

  .p-inputtext {
    font-size: 1rem;
    text-align: left;
    padding: 0.5rem;
    border: 1px solid #ced4da;
  }
}

::deep(.p-inputtext) {
  font-size: 1rem;
  text-align: left;
  padding: 0.5rem;
}
</style>