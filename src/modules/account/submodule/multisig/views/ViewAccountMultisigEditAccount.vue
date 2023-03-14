<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5 '>
      <AccountComponent :address="address" class="mb-6" />
      <AccountTabs :address="address" selected="multisig" />
      <div class="border-2 border-t-0 lg:grid lg:grid-cols-3">
        <div class="lg:col-span-2 py-6 pr-6">
          <div class="text-left mt-2 mb-5 ml-6">
            <div v-if="walletCosignerList.cosignerList.length > 0">
              <div class="text-tsm">
                {{ $t('general.initiateBy') }}:
                <span class="font-bold" v-if="walletCosignerList.cosignerList.length == 1">
                  {{ walletCosignerList.cosignerList[0].name }}
                </span>
                <span class="font-bold" v-else>
                  <select class="" v-model="selectedCosignPublicKey">
                    <option v-for="(element, item) in  walletCosignerList.cosignerList"
                      :value="findAcc(element.publicKey)?.publicKey" :key="item">
                      {{ element.name }}
                    </option>
                  </select>
                </span>
              </div>
            </div>
          </div>
          <div class="text-xs font-semibold pl-6">{{ $t('multisig.manageCosignatories') }}</div>
          <div class='pl-6'>
            <div class=" error error_box mb-5" v-if="err != ''">{{ err }}</div>
          </div>
          <div class="mt-4"></div>

          <div class="flex flex-col gap-2">
            <div v-for="(publicKey, index) in cosignaturies" :key="index">
              <div class="flex">
                <img v-if="checkRemoval(publicKey)" @click="restoreFromRemovalList(publicKey)"
                  src="@/modules/account/submodule/multisig/img/icon-delete-red.svg"
                  class="w-4 h-4 text-gray-500 cursor-pointer mt-3 mx-1">
                <img v-else @click="addToRemovalList(publicKey)"
                  src="@/modules/account/submodule/multisig/img/icon-delete-gray.svg"
                  class="w-4 h-4 text-gray-500 cursor-pointer mt-3 mx-1">
                <TextInput class='w-5/12 mr-2 ' v-model="cosignerName[index]" :disabled="true" />
                <TextInput class='w-7/12' v-model="cosignaturies[index]" :disabled="true" />
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2 mt-2">
            <div v-for="(coSignAddress, index) in coSign" :key="index">
              <div class="flex">
                <img src="@/modules/account/submodule/multisig/img/icon-delete-red.svg"
                  @click="deleteCoSigAddressInput(index)" class="w-4 h-4 text-gray-500 cursor-pointer mt-3 mx-1">
                <TextInput class='w-5/12 mr-2 ' :placeholder="$t('multisig.cosignatory') + `${index + 1}`"
                  v-model="contactName[index]" :disabled="true" />
                <TextInputClean class='w-7/12 mr-2 ' :placeholder="$t('general.publicKey')"
                  :errorMessage="$t('general.invalidInput')" :showError="showAddressError[index]"
                  v-model="coSign[index]" />
                <!-- <div v-if="showAddressError[index]==true " class=""/> -->
                <div @click="toggleContact[index] = !toggleContact[index]"
                  class=' border  cursor-pointer flex flex-col justify-center  p-2' style="height:2.66rem">
                  <font-awesome-icon icon="id-card-alt" class=" text-blue-primary ml-auto mr-auto "></font-awesome-icon>
                  <div class='text-xxs text-blue-primary font-semibold uppercase'>{{ $t('general.select') }}</div>
                </div>
              </div>
              <div v-if="toggleContact[index]">
                <Sidebar v-model:visible="toggleContact[index]" :baseZIndex="10000" position="full">
                  <SelectAccountAndContact v-bind="index" :contacts="contact" :index="index"
                    :selectedNode="selectedNode[index]" @node-select="onNodeSelect($event, index)" />
                </Sidebar>
              </div>
            </div>
          </div>
          <button
            class="pl-6 font-semibold text-xs mt-1 text-blue-primary outline-none focus:outline-none disabled:opacity-50  disabled:cursor-auto"
            @click="addCoSig" :disabled="addCoSigButton">+ {{ $t('multisig.addNewCosignatory') }}</button>
          <div class="ml-6 my-7 gray-line" />
          <div class="pl-6 text-xs font-semibold mb-3">{{ $t('general.scheme') }}</div>
          <div class='flex gap-2 pl-6'>
            <div class="border w-6/12">
              <div class="border-b-2 text-xxs text-center py-1 uppercase">{{ $t('multisig.transactionsApproval') }}</div>
              <div class='flex justify-around'>
                <button class="text-blue-primary disabled:opacity-50" @click="numApproveTransaction--"
                  :disabled="numApproveTransaction <= 0">-</button>
                <input type="number" class=" w-4 outline-none text-xs font-bold" :min=0 @keypress="validateApproval"
                  :max="maxNumApproveTransaction" v-model="numApproveTransaction">
                <button class="text-blue-primary disabled:opacity-50"
                  :disabled="numApproveTransaction >= maxNumApproveTransaction"
                  @click="numApproveTransaction++">+</button>
              </div>
              <div class="text-xxs border-t-2 text-center py-1 uppercase">
                {{ $t('multisig.ofCosignatories', { value: maxNumApproveTransaction }) }}</div>
            </div>
            <div class="border w-6/12">
              <div class="border-b-2 text-xxs text-center py-1 uppercase">{{ $t('multisig.accountDeletionApproval') }}
              </div>
              <div class='flex justify-around'>
                <button class="text-blue-primary disabled:opacity-50" @click="numDeleteUser--"
                  :disabled="numDeleteUser <= 0">-</button>
                <input type="number" class=" w-4 outline-none text-xs font-bold" :min=0 @keypress="validateDelete"
                  :max="maxNumDeleteUser" v-model="numDeleteUser">
                <button class="text-blue-primary disabled:opacity-50" :disabled="numDeleteUser >= maxNumDeleteUser"
                  @click="numDeleteUser++">+</button>
              </div>
              <div class="text-xxs border-t-2 text-center py-1 uppercase">
                {{ $t('multisig.ofCosignatories', { value: maxNumDeleteUser }) }}</div>
            </div>
          </div>
        </div>
        <div class='bg-navy-primary p-6 lg:col-span-1'>
          <TransactionFeeDisplay :fund-status="fundStatus" :is-multisig="isMultisig" :is-cosigner="isCoSigner"
            :on-partial="onPartial" :transaction-fee="aggregateFee" :total-fee-formatted="totalFeeFormatted"
            :get-multi-sig-cosigner="walletCosignerList" :check-cosign-balance="checkCosignBalance"
            :lock-fund-currency="lockFundCurrency" :lock-fund-tx-fee="lockFundTxFee" :balance="accBalance"
            :selected-acc-add="selectedAccAdd" />
          <div class="mt-5" />
          <div class='font-semibold text-xs text-white mb-1.5'>{{ $t('general.enterPasswordContinue') }}</div>
          <PasswordInput :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')"
            v-model="passwd" :disabled="disabledPassword" />
          <div class="mt-3"><button type="submit"
              class=' w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto' @click="modifyAccount()"
              :disabled="disableSend">{{ $t('multisig.updateCosignatories') }}</button></div>
          <div class="text-center">
            <router-link :to="{ name: 'ViewMultisigHome', params: { address: address } }"
              class="content-center text-xs text-white underline">{{ $t('general.cancel') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue'
import TextInput from '@/components/TextInput.vue'
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
import TextInputClean from '@/components/TextInputClean.vue'
import { walletState } from '@/state/walletState';
import {
  PublicAccount, Address
} from "tsjs-xpx-chain-sdk"
import { networkState } from '@/state/networkState';
import { useI18n } from 'vue-i18n'
import { Helper } from '@/util/typeHelper';
import SelectAccountAndContact from "@/components/SelectAccountAndContact.vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { TransactionUtils, findAcc } from '@/util/transactionUtils';
import { AppState } from '@/state/appState';
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { MultisigUtils } from '@/util/multisigUtils';
import type { MultisigInfo } from '@/models/multisigInfo';
import type { WalletAccount } from '@/models/walletAccount';
import type { OtherAccount } from '@/models/otherAccount';
import type { TreeNode } from 'primevue/tree';


const p = defineProps({
  address: {
    type: String,
    required: true
  }
})
const { t } = useI18n();
const router = useRouter();
const err = ref('');
const fundStatus = ref(false);

const passwd = ref('');
const passwdPattern = "^[^ ]{8,}$";
const publicKeyPattern = "^[0-9A-Fa-f]{64}$";

const coSign = ref<string[]>([]);
const removeCosign = ref<string[]>([]);
const selectedAddresses = ref([]);
const showAddressError = ref<boolean[]>([]);
const onPartial = ref(false);
const toggleContact = ref<boolean[]>([])
const selectedNode = ref<TreeNode>([]);
const selectMainCosign = ref('');
const selectOtherCosign = ref([]);
const contactName = ref<string[]>([])
const defaultAcc = walletState.currentLoggedInWallet ? walletState.currentLoggedInWallet.selectDefaultAccount() : null
const selectedAccAdd = ref(defaultAcc ? defaultAcc.address : '');
const accBalance = ref(Helper.toCurrencyFormat(defaultAcc ? defaultAcc.balance : 0, AppState.nativeToken.divisibility));
// current wallet
const wallet = walletState.currentLoggedInWallet;
// get account details initialization
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
const aggregateFee = ref(0)
let updateAggregateFee = () => {
  if (!acc.value) {
    return
  }
  MultisigUtils.getAggregateFee(acc.value.publicKey, coSign.value, numApproveTransaction.value, numDeleteUser.value, removeCosign.value).then(fee => {
    aggregateFee.value = fee
  })
}

const cosignaturies = computed(() => {
  if (!acc.value) {
    return []
  }
  let cosignaturies: string[] = []
  acc.value.multisigInfo.filter(element => element.level === 1).forEach(cosigner => {
    cosignaturies.push(cosigner.publicKey)
  })
  return cosignaturies
})
const numApproveTransaction = ref(acc.value ? (acc.value.multisigInfo.find(acc => acc.level == 0) as MultisigInfo).minApproval : 0);
const numDeleteUser = ref(acc.value ? (acc.value.multisigInfo.find(acc => acc.level == 0) as MultisigInfo).minRemoval : 0);
const cosignerName = computed(() => {
  if (!wallet) {
    return []
  }
  let name: string[] = []
  cosignaturies.value.forEach(publicKey => {
    let address = Address.createFromPublicKey(publicKey, AppState.networkType).plain()
    let contact = wallet.contacts.find((contact) => contact.address == address);
    const findAcc = wallet.accounts.find(acc => acc.publicKey === publicKey)
    if (contact) {
      name.push(contact.name)
    }
    else if (findAcc) {
      name.push(findAcc.name)
    } else {
      let address = Address.createFromPublicKey(publicKey, AppState.networkType).plain().substr(-4)
      name.push(t('general.cosigner') + '-' + address)
    }
  })
  return name
})
updateAggregateFee()

const getCosignerList = () => {
  if (!acc.value) {
    return { hasCosigner: false, cosignerList: [] }
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

const selectedCosignPublicKey = ref(walletCosignerList.value.cosignerList[0] ? walletCosignerList.value.cosignerList[0].publicKey : '')

watch(walletCosignerList, n => {
  if (n.cosignerList.length) {
    selectedCosignPublicKey.value = n.cosignerList[0] ? n.cosignerList[0].publicKey : ''
  }
}, { deep: true })

const isMultisig = computed(() => {
  if (!acc.value) {
    return false
  }
  return MultisigUtils.checkIsMultiSig(acc.value.address)
})
const disableSend = computed(() => !(
  isMultisig.value && !onPartial.value && passwd.value.match(passwdPattern) && err.value == '' || err.value == t('general.walletPasswordInvalid', { name: wallet ? wallet.name : '' }) && (showAddressError.value.indexOf(true) == -1) && (numDeleteUser.value >= 0) && (numApproveTransaction.value > 0)
));
const disabledPassword = computed(() => !(!onPartial.value && isMultisig.value && !fundStatus.value && isCoSigner.value));
const isCoSigner = computed(() => {
  return getCosignerList().hasCosigner;
})

const addCoSigButton = computed(() => {
  var status = false;
  if (accountBalance.value >= totalFee.value && isCoSigner.value) {
    for (var i = 0; i < coSign.value.length; i++) {
      if (showAddressError.value[i]) {
        status = true;
        break;
      } else if (coSign.value[i].length < 40) {
        status = true;
        break;
      }
    }
  } else {
    status = true;
  }
  return status;
});

const totalFee = computed(() => {
  let tokenDivisibility = AppState.nativeToken.divisibility
  if (tokenDivisibility == 0) {
    return Math.trunc(aggregateFee.value + lockFundCurrency.value + lockFundTxFee.value)
  } else {
    return Math.round((aggregateFee.value + lockFundCurrency.value + lockFundTxFee.value) * Math.pow(10, tokenDivisibility)) / Math.pow(10, tokenDivisibility)
  }
})

const clear = () => {
  coSign.value = [];
  contactName.value = [];
  removeCosign.value = [];
  selectedAddresses.value = [];
  showAddressError.value = [];
  passwd.value = '';
  numApproveTransaction.value = acc.value ? (acc.value.multisigInfo.find(acc => acc.level === 0) as MultisigInfo).minApproval : 0;
  numDeleteUser.value = acc.value ? (acc.value.multisigInfo.find(acc => acc.level === 0) as MultisigInfo).minRemoval : 0;
  selectMainCosign.value = '';
  selectOtherCosign.value = [];
  err.value = '';
};

const modifyAccount = async () => {
  let signer: { address: string }[] = [];

  cosigners.value.cosignerList.forEach((publicKey: string) => {
    if (!walletState.currentLoggedInWallet) {
      return
    }
    const account = walletState.currentLoggedInWallet.accounts.find(acc => acc.publicKey == publicKey)
    if (account) {
      signer.push({ address: account.address })
    }
  })
  let modifyStatus = await MultisigUtils.modifyMultisigAccount(selectedCosignPublicKey.value, coSign.value, removeCosign.value, numApproveTransaction.value, numDeleteUser.value, acc.value as WalletAccount | OtherAccount, passwd.value);
  console.log(modifyStatus);
  if (!modifyStatus) {
    err.value = t('general.walletPasswordInvalid', { name: walletState.currentLoggedInWallet?.name });
  } else {
    // transaction made
    err.value = '';
    /* var audio = new Audio(require('@/assets/audio/ding.ogg'));
    audio.play(); */
    clear();
    router.push({ name: "ViewAccountPendingTransactions", params: { address: p.address } })
  }
};

watch(() => [...coSign.value], (n) => {
  if (!acc.value) {
    return
  }
  let duplicateCosign = false
  let duplicateOwner = false
  if (coSign.value.length > 0) {
    for (var i = 0; i < coSign.value.length; i++) {
      if ((coSign.value[i].length == 64)) {
        if ((coSign.value[i] == acc.value.publicKey) && (duplicateOwner == false)) {
          duplicateOwner = true
          showAddressError.value[i] = true;
          err.value = t('multisig.selectedAccErr')
        }
        else if (!coSign.value[i].match(publicKeyPattern) && (coSign.value[i].length == 64)) {
          showAddressError.value[i] = true;
        } else {
          showAddressError.value[i] = false;
          const unique = Array.from(new Set(n));
          // check newly added cosigner address
          if (unique.length != n.length) {
            err.value = t('multisig.duplicatedCosigner');
          } else {
            // check already added cosigner address
            for (let j = 0; j < cosignaturies.value.length; j++) {
              if (coSign.value[i] == cosignaturies.value[j]) {
                duplicateCosign = true
                err.value = t('multisig.duplicatedCosigner');
              }
            }
            if (duplicateCosign == false && duplicateOwner == false) {
              err.value = '';
            }
          }
        }
      } else {
        showAddressError.value[i] = true;
      }
    }
  }
  // there is no cosign left
  else {
    err.value = '';
  }
}, { deep: true });
watch(() => [...showAddressError.value], (n) => {
  if (!acc.value) {
    return
  }
  if (n.every(value => value == false)) {
    updateAggregateFee()
  }

}, { deep: true });

watch(() => [removeCosign.value], (n) => {
  updateAggregateFee()
}, { deep: true });

const contact = computed(() => {
  if (!acc.value) {
    return []
  }
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

const onNodeSelect = (node: { key: string, label: string, data: string, selectable: boolean }, index: number) => {
  makeNodeSelectable(index)
  if (node.label) {
    contactName.value[index] = node.label
  }
  // check if it is in the address book
  if (node.key[0] == "1") {
    changeToPublicKey(node.data, index)
  }
  else {
    coSign.value[index] = node.data
  }
  coSign.value[index] = node.data
  toggleContact.value[index] = false
  // this is too make it turn blue
  selectedNode.value[index][node.key] = true
  node.selectable = false
}

const changeToPublicKey = (address: string, index: number) => {
  try {
    MultisigUtils.verifyContactPublicKey(address).then(result => {
      if (result.status == true) {
        coSign.value[index] = result.publicKey
      }
      else {
        err.value = t('multisig.noPublicKey')
      }
    })
  } catch (error) {
    err.value = t('multisig.noPublicKey')
  }
}

const makeNodeSelectable = (index: number) => {
  // if there is previously unselectable value make it selectable
  if (Object.keys(selectedNode.value[index]).length !== 0) {
    let selectedNodeIndex = Object.keys(selectedNode.value[index])[0].split('-')
    contact.value[parseInt(selectedNodeIndex[0])].children[parseInt(selectedNodeIndex[1])].selectable = true
    selectedNode.value[index] = {}
  }
}

const accountBalance = computed(() => {
  if (!acc.value) {
    return 0
  }
  return acc.value.balance
})

const addCoSig = () => {
  coSign.value.push('');
  selectedNode.value.push({})
  showAddressError.value.push(false);
};
const deleteCoSigAddressInput = (i: number) => {
  makeNodeSelectable(i)
  coSign.value.splice(i, 1);
  toggleContact.value.splice(i, 1);
  selectedNode.value.splice(i, 1)
  contactName.value.splice(i, 1);
  showAddressError.value.splice(i, 1);
  selectedAddresses.value.splice(i, 1);
}
// add cosigner to remove list
const addToRemovalList = (publicKey: string) => {
  if (!onPartial.value && !fundStatus.value && isCoSigner.value) {
    removeCosign.value = []
    removeCosign.value.push(publicKey);
  }
};
const checkRemoval = (publicKey: string) => {
  let verifyRemoval = false;
  if (removeCosign.value.length > 0) {
    removeCosign.value.forEach((element) => {
      if (element == publicKey) {
        verifyRemoval = true;
      }
    });
  }
  return verifyRemoval;
};
const restoreFromRemovalList = (publicKey: string) => {
  const index = removeCosign.value.indexOf(publicKey);
  if (index > -1) {
    removeCosign.value.splice(index, 1);
  }
}

const maxNumApproveTransaction = computed(() => {
  return getCosigns() - removeCosign.value.length + coSign.value.length;
});
const maxNumDeleteUser = computed(() => {
  return getCosigns() - removeCosign.value.length + coSign.value.length;
});
const getCosigns = () => {
  if (acc.value) {
    return acc.value.getDirectParentMultisig().length
  } else {
    return 0
  }
}

// refecth min number for both scheme if there is changes in max num for both approval and deletion
watch(maxNumApproveTransaction, (n, o) => {
  if (n < o) {
    if (numApproveTransaction.value > n) {
      numApproveTransaction.value = maxNumApproveTransaction.value
    }
    if (numDeleteUser.value > n) {
      numDeleteUser.value = maxNumDeleteUser.value
    }
  }
});
watch(maxNumDeleteUser, (n, o) => {
  if (n < o) {
    if (numApproveTransaction.value > n) {
      numApproveTransaction.value = maxNumApproveTransaction.value
    }
    if (numDeleteUser.value > n) {
      numDeleteUser.value = maxNumDeleteUser.value
    }
  }
});
const validateApproval = (e: KeyboardEvent) => {
  if ((numApproveTransaction.value * 10 * (~~(maxNumApproveTransaction.value / 10)) + e.charCode - 48) > maxNumApproveTransaction.value) {
    e.preventDefault();
  }
}
let deleteUserErrorMsg = t('multisig.deletionExceedMax');
let approveTransactionErrMsg = t('multisig.approvalExceedMax');
watch(numApproveTransaction, (n) => {
  updateAggregateFee()
  if (maxNumApproveTransaction.value == 0 && n > 1) {
    err.value = approveTransactionErrMsg;
  } else if ((n > maxNumApproveTransaction.value) && (n != 1 && maxNumApproveTransaction.value != 0)) {
    err.value = approveTransactionErrMsg;
  } else if (maxNumApproveTransaction.value > 0 && n <= 0) {
    err.value = t('multisig.approvalAtLeastOne')
  } else {
    // check again for num delete user
    if ((numDeleteUser.value > maxNumDeleteUser.value) && (numDeleteUser.value != 1 && maxNumDeleteUser.value != 0)) {
      err.value = deleteUserErrorMsg;
    } else {
      err.value = '';
    }
  }
});
const validateDelete = (e: KeyboardEvent) => {
  if ((numDeleteUser.value * 10 * (~~(maxNumDeleteUser.value / 10)) + e.charCode - 48) > maxNumDeleteUser.value) {
    e.preventDefault();
  }
}
watch(numDeleteUser, (n) => {
  updateAggregateFee()
  if (maxNumDeleteUser.value == 0 && n > 1) {
    err.value = deleteUserErrorMsg;
  } else if ((n > maxNumDeleteUser.value) && (n != 1 && maxNumDeleteUser.value != 0)) {
    err.value = deleteUserErrorMsg;
  } else if (maxNumDeleteUser.value > 0 && n <= 0) {
    err.value = t('multisig.deletionAtLeastOne')
  } else {
    // check again for num approval transaction
    if ((numApproveTransaction.value > maxNumApproveTransaction.value) && (numApproveTransaction.value != 1 && maxNumApproveTransaction.value != 0)) {
      err.value = approveTransactionErrMsg;
    } else {
      err.value = '';
    }
  }
});
// get cosigners in this wallet for this multisig;
const cosigners = computed(() => {
  let cosigner = getCosignerList();
  return cosigner;
});

// check if onPartial
try {
  if (acc.value) {
    MultisigUtils.onPartial(PublicAccount.createFromPublicKey(acc.value.publicKey, AppState.networkType)).then(onPartialBoolean => onPartial.value = onPartialBoolean)
  }
} catch (error) {

}
const findAccount = findAcc(selectedCosignPublicKey.value)
if (findAccount) {
  if (findAccount.balance < totalFee.value) {
    fundStatus.value = true
  }
}

watch(selectedCosignPublicKey, (n) => {
  const findAccount = findAcc(n)
  if (!findAccount) {
    return
  }
  if (findAccount.balance < totalFee.value) {
    fundStatus.value = true
  } else {
    fundStatus.value = false
  }
});

const totalFeeFormatted = computed(() => {
  return Helper.amountFormatterSimple(totalFee.value, 0);
});


const checkCosignBalance = computed(() => {
  const findAccount = findAcc(selectedCosignPublicKey.value)
  let cosignBalance = findAccount ? findAccount.balance : 0;
  return Helper.toCurrencyFormat(cosignBalance, 3);
})


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

select {
  min-width: 150px;
  padding: 5px;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}</style>