<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{ name: "ViewDashboard" }' class='text-blue-primary text-xs mt-0.5'>{{ $t('general.back')
      }}</router-link>
    </div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <AccountComponent :address="address" class="mb-6" />
      <AccountTabs :address="address" selected="multisig" />
      <div class=' p-6 border-2 border-t-0 filter shadow-lg mb-6'>
        <div class="flex cursor-pointer">
          <router-link :to="{ name: 'ViewMultisigHome', params: { address: address } }"
            class="border-2 border-blue-primary p-1 mb-3 w-16 text-blue-primary text-xs text-center font-semibold ">{{
              $t('general.multisig') }}</router-link>
          <div
            class="border-2 border-blue-primary p-1 mb-3 w-16 text-white bg-blue-primary text-xs text-center font-semibold ">
            {{ $t('general.scheme') }}</div>
        </div>
        <div class="overflow-auto w-full border-2  " :style="`${viewType2 == 1 ? ' transform: rotate(180deg);' : ''}`">
          <blocks-tree :data="graph" :horizontal="viewType == 0" :collapsable="collapsable"
            :props="{ label: 'label', name: 'name', balance: 'balance', numApproveTx: 'numApproveTx', numRemoval: 'numRemoval', children: 'children' }">
            <template #node="{ data }">
              <div class="flex flex-col justify-center p-1.5 h-20 cursor-pointer "
                @click="navigate(prettyAddress(data.label))"
                :style="`${viewType2 == 1 ? ' transform: rotate(180deg);' : ''}width: 16.5rem`">
                <div class="text-xs text-left text-blue-500 font-bold">{{ data.name }}</div>
                <div class="flex gap-1">
                  <div :id="data.label" :copyValue="prettyAddress(data.label)" :copySubject="$t('general.address')"
                    class="font-bold text-left text-xs mt-0.5">{{ displayAddress(data.label) }}</div>
                  <font-awesome-icon icon="copy" :title="$t('general.copy')" @mouseover="isHover = true"
                    @mouseout="isHover = false" @click="copy(data.label)"
                    class="w-5 h-5 text-blue-primary cursor-pointer "></font-awesome-icon>
                </div>
                <div v-if="data.balance != -1" class="flex">
                  <div class='text-xs font-bold '>{{ splitBalance(data.balance).left }} </div>
                  <div class='text-xs font-bold' v-if='splitBalance(data.balance).right != null'>.</div>
                  <div class='text-xxs mt-0.5 '>{{ splitBalance(data.balance).right }}</div>
                  <div class='ml-1 text-xs  font-bold'>{{ currentNativeTokenName }}</div>
                  <img src="@/modules/account/img/proximax-logo.svg" class='h-4 w-4 '>
                </div>
                <div class="flex gap-3">
                  <div class="text-xxs text-gray-500">
                    {{ $t('multisig.approvalScheme', { approval: data.numApproveTx, maxApproval: data.children.length })
                    }}</div>
                  <div class="text-xxs text-gray-500">
                    {{ $t('multisig.deletionScheme', { deletion: data.numRemoval, maxDeletion: data.children.length }) }}
                  </div>
                  <div class="flex gap-1 ml-auto">
                    <div v-if='data.children.length > 0' class=' ml-auto bg-green-500 rounded-2xl'
                      :title="$t('general.multisigTitle')">
                      <img src="@/assets/img/icon-multisig.svg" class='h-4 w-5 mr-1' style="transform: rotateY(180deg)">
                    </div>
                    <div v-if='data.children.length > 0 && findAccountWithAddress(data.label) != undefined'
                      class='p-0.5 bg-purple-500 rounded-2xl' :title="$t('general.ownerTitle')">
                      <img src="@/assets/img/icon-key.svg" class='h-3 w-3 mr-1'>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </blocks-tree>
        </div>
      </div>
      <div class="font-semibold ">{{ $t('multisig.viewSettings') }}</div>
      <div>
        <input name='view-type' type='radio' value='0' v-model="viewType" :checked='true'>
        <label class='text-left py-3 text-xs pl-4'>{{ $t('multisig.horizontal') }}</label>
      </div>
      <input name='view-type' type='radio' value='1' v-model="viewType">
      <label class='text-left py-3 text-xs pl-4'> {{ $t('multisig.vertical') }}</label>
      <div>
        <input name='view-type-2' type='radio' value='0' v-model="viewType2" :checked='true'>
        <label v-if="viewType == 0" class='text-left py-3 text-xs pl-4'> {{ $t('multisig.rightToLeft') }}</label>
        <label v-if="viewType == 1" class='text-left py-3 text-xs pl-4'> {{ $t('multisig.topToBottom') }}</label>
      </div>
      <input name='view-type-2' type='radio' value='1' v-model="viewType2">
      <label v-if="viewType == 0" class='text-left py-3 text-xs pl-4'> {{ $t('multisig.leftToRight') }}</label>
      <label v-if="viewType == 1" class='text-left py-3 text-xs pl-4'> {{ $t('multisig.bottomToTop') }}</label>
      <div>
        <input type="checkbox" @click="collapsable = !collapsable">
        <label class='text-left py-3 text-xs pl-4'>{{ $t('multisig.collapsible') }}</label>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { walletState } from '@/state/walletState'
import { watch, ref, computed } from "vue";
import { networkState } from '@/state/networkState';
import { Address, PublicAccount } from 'tsjs-xpx-chain-sdk';
import { Helper } from '@/util/typeHelper';
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { AppState } from '@/state/appState';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { setDefaultAccInStorage } from '@/models/account';
import "vue3-blocks-tree/dist/vue3-blocks-tree.css";

const p = defineProps({
  address: {
    type: String,
    required: true
  }
})
const toast = useToast();
const { t } = useI18n();
const isHover = ref(false)
const wallet = walletState.currentLoggedInWallet
const currentAccount = computed(() => {
  if (!wallet) {
    return null
  }
  let currentAccount = wallet.accounts.find(account => account.address == p.address) || wallet.others.filter(accounts => accounts.type === "MULTISIG").find(account => account.address == p.address)
  if (!currentAccount) {
    return null
  } else {
    return currentAccount
  }
})
const multisigAccounts = computed(() => {
  if (!currentAccount.value) {
    return []
  }
  return currentAccount.value.multisigInfo.filter(accounts => accounts.level >= 0)
})
const networkType = AppState.networkType
const convertAddress = (publicKey: string) => {
  return Address.createFromPublicKey(publicKey, networkType)

}
const label = (length: number) => {
  return length > 0 ? t('general.multisig').toUpperCase() + '-' : t('general.cosigner') + '-'
}
const findAccount = (publicKey: string) => {
  if (!wallet) {
    return
  }
  return wallet.accounts.find(account => account.address == convertAddress(publicKey).plain())
}
const getAccountName = (publicKey: string, length: number) => {
  if (!wallet) {
    return ""
  }
  const address = PublicAccount.createFromPublicKey(publicKey, networkType).address.plain()
  const contact = wallet.contacts.find((contact) => contact.address == address);
  if (contact) {
    return contact.name
  } else {
    const acc = findAccount(publicKey)
    return acc ? acc.name : label(length) + convertAddress(publicKey).plain().substr(-4)
  }

}
const findCosignLength = (publicKey: string) => {
  if (!multisigAccounts.value) {
    return 0
  }
  const findAcc = multisigAccounts.value.find(account => account.publicKey == publicKey)

  return findAcc ? findAcc.cosignaturies.length : 0
};

const findAccountWithAddress = (address: string, includeOthers?: boolean) => {
  if (!wallet) {
    return
  }
  let plainAddress = Address.createFromRawAddress(address).plain()
  if (includeOthers) {
    return wallet.accounts.find(account => account.address == plainAddress) || wallet.others.find(account => account.address == plainAddress)
  }
  return wallet.accounts.find(account => account.address == plainAddress)
}

const checkOtherAcc = (address: string) => {
  if (!wallet) {
    return
  }
  let plainAddress = Address.createFromRawAddress(address).plain()
  if (wallet.others.find(acc => acc.address == plainAddress)) {
    return true
  }
  return false
}

const findCosign = (publicKey: string) => {
  const findAcc = multisigAccounts.value.find(account => account.publicKey == publicKey)
  return findAcc ? findAcc.cosignaturies : []
}

const getApproveTx = (publicKey: string) => {
  const findAcc = multisigAccounts.value.find(account => account.publicKey == publicKey)
  return findAcc ? findAcc.minApproval : 0
}

const getRemoval = (publicKey: string) => {
  const findAcc = multisigAccounts.value.find(account => account.publicKey == publicKey)
  return findAcc ? findAcc.minRemoval : 0
}

const getBalance = (publicKey: string) => {
  if (!wallet) {
    return -1
  }
  let acc = wallet.accounts.find(acc => acc.publicKey == publicKey) ? wallet.accounts.find(acc => acc.publicKey == publicKey) : wallet.others.find(acc => acc.publicKey == publicKey)
  if (acc) {
    return acc.balance
  } else {
    return -1
  }
}

interface childObject{
    label: string;
    name: string;
    balance: number;
    numApproveTx: number;
    numRemoval: number;
    children: childObject[]
}[]
//level1
const getChildObject = (cosignaturies: string[]) => {
  let tempArray: childObject[] = []
  let cosigns = []
  for (let i = 0; i < cosignaturies.length; i++) {
    cosigns = findCosign(cosignaturies[i])
    tempArray.push({
      label: convertAddress(cosignaturies[i]).pretty(),
      name: getAccountName(cosignaturies[i], findCosignLength(cosignaturies[i])),
      balance: getBalance(cosignaturies[i]),
      numApproveTx: getApproveTx(cosignaturies[i]),
      numRemoval: getRemoval(cosignaturies[i]),
      children: getChildObject(cosigns)
    }) //keep on looping to the end
  }
  return tempArray
}
//level 0 (selected account)
let graph:childObject = {
  label: '',
  name: '',
  balance: 0,
  numApproveTx: 0,
  numRemoval: 0,
  children: []
}
if (multisigAccounts.value[0]) {
  graph = {
    label: convertAddress(multisigAccounts.value[0].publicKey).pretty(),
    name: getAccountName(multisigAccounts.value[0].publicKey, multisigAccounts.value[0].cosignaturies.length),
    balance: getBalance(multisigAccounts.value[0].publicKey),
    numApproveTx: getApproveTx(multisigAccounts.value[0].publicKey),
    numRemoval: getRemoval(multisigAccounts.value[0].publicKey),
    children: getChildObject(multisigAccounts.value[0].cosignaturies)
  }
}

watch(() => currentAccount, n => {
  if (!multisigAccounts.value[0]) {
    return
  }
  graph = {
    label: convertAddress(multisigAccounts.value[0].publicKey).pretty(),
    name: getAccountName(multisigAccounts.value[0].publicKey, multisigAccounts.value[0].cosignaturies.length),
    balance: getBalance(multisigAccounts.value[0].publicKey),
    numApproveTx: getApproveTx(multisigAccounts.value[0].publicKey),
    numRemoval: getRemoval(multisigAccounts.value[0].publicKey),
    children: getChildObject(multisigAccounts.value[0].cosignaturies)
  }
}, { deep: true })


let displayAddress = (address: string) => {
  let part1 = address.slice(0, 13)
  let part2 = address.slice(35, 46)
  return part1 + "..." + part2
}
const currentNativeTokenName = computed(() => AppState.nativeToken.label);
const currentNativeTokenDivisibility = computed(() => AppState.nativeToken.divisibility);
const splitBalance = (balance: number) => {
  let formattedBalance = Helper.toCurrencyFormat(balance, currentNativeTokenDivisibility.value);
  let split = formattedBalance.split(".")
  if (split[1] != undefined) {
    return { left: split[0], right: split[1] }
  } else {
    return { left: split[0], right: null }
  }
}
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
const prettyAddress = (address: string) => {
  return Address.createFromRawAddress(address).pretty()

}
const viewType = ref(0)
const viewType2 = ref(1)
const collapsable = ref(false)
const router = useRouter()
const setDefaultAcc = (name: string) => {
  if (!wallet) {
    return
  }
  if (wallet.accounts.find(acc => acc.name == name)) {
    wallet.setDefaultAccountByName(name)
  }
}
const getAccountNameByAddress = (address: string) => {
  if (!wallet) {
    return ""
  }
  let findAcc = wallet.accounts.find(acc => acc.address == address) || wallet.others.find(acc => acc.address == address)
  return findAcc ? findAcc.name : ""
}

const navigate = (address: string) => {
  if (findAccountWithAddress(address, true) && !isHover.value && !checkOtherAcc(address)) {
    setDefaultAcc(getAccountNameByAddress(Address.createFromRawAddress(address).plain()))
    setDefaultAccInStorage(Address.createFromRawAddress(address).plain())
    router.push({ name: 'ViewAccountDetails', params: { address: Address.createFromRawAddress(address).plain() } })
  } else if (findAccountWithAddress(address, true)) {
    router.push({ name: 'ViewAccountDetails', params: { address: Address.createFromRawAddress(address).plain() } })
  }
  if (!networkState.currentNetworkProfile) {
    return ''
  }
  if (!findAccountWithAddress(address, true)) {
    window.open(networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.addressRoute + '/' + address)
  }
}


</script>

<style  scoped></style>