<template>
  <div class="border rounded-lg border-gray-200 p-3 filter shadow-lg cursor-pointer" @click="navigate()">
    <div class="flex gap-2 ">
      <div class="mt-auto mb-auto" v-html="svgString"></div>
      <div class="flex flex-col  ">
        <div class="text-blue-primary font-bold text-xs mb-0.5">{{ accountName }}</div>
        <div class="flex justify-around">
          <div :id="account.address" :title="prettyAddress(account.address)"
            class="text-xs font-bold mt-0.5 mr-2  truncate md:text-clip w-44 md:w-full"
            :copyValue="prettyAddress(account.address)" :copySubject="$t('general.address')">
            {{ prettyAddress(account.address) }}</div>
          <font-awesome-icon @mouseover="isHoverCopy = true" @mouseout="isHoverCopy = false" icon="copy"
            @click="copy(account.address)"
            class="w-5 h-5 text-blue-primary cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex">
          <div class='text-xs font-bold '>{{ splitBalance.left }} </div>
          <div class='text-xs font-bold' v-if='splitBalance.right != null'>.</div>
          <div class='text-xxs mt-0.5 '>{{ splitBalance.right }}</div>
          <div class='ml-1 text-xs  font-bold'>{{ currentNativeTokenName }}</div>
          <img src="@/modules/account/img/proximax-logo.svg" class='h-4 w-4 '>
        </div>
        <div class='flex gap-2 '>
          <div v-if='account instanceof WalletAccount && account.default' class='px-1 py-0.5 flex items-center bg-blue-primary rounded-sm'
            :title="$t('general.defaultTitle')">
            <img src="@/modules/account/img/icon-pin.svg" class='h-4 w-4 '>
            <p class='font-semibold text-white text-xxs pt-px cursor-default uppercase'>{{ $t('general.default') }}</p>
          </div>
          <div v-if='isMultiSig' class='px-1 py-0.5 flex items-center bg-green-500 rounded-sm '
            :title="$t('general.multisigTitle')">
            <img src="@/assets/img/icon-multisig.svg" class='h-3 w-3 mr-1'>
            <p class='font-semibold text-white text-xxs pt-px cursor-default uppercase'>{{ $t('general.multisig') }}</p>
          </div>
          <div v-if='isMultiSig && !otherAccount(account.address)'
            class='px-1 py-0.5 flex items-center bg-purple-500 rounded-sm' :title="$t('general.ownerTitle')">
            <img src="@/assets/img/icon-key.svg" class='h-4 w-4 mr-1'>
            <p class='font-semibold text-white text-xxs pt-px cursor-default uppercase'>{{ $t('general.owner') }}</p>
          </div>
        </div>
      </div>
      <div class="flex  2xl:visible pt-4 ">
        <div v-for="(label, index) in labels" :key="index">
          <div v-if="label.isLabeled" class="text-xs mr-3 border bg-gray-300 rounded-md p-1">{{ label.name }}</div>
        </div>
      </div>
      <div class="ml-auto mt-auto mb-auto  ">
        <img src="@/assets/img/navi/icon-default-account-drop-down.svg" class=" h-6 w-6 cursor-pointer"
          @mouseover="isHover = true" @mouseout="isHover = false" @click="displayDefaultAccountMenu = true">
        <div class="relative" @mouseover="isHover = true" @mouseout="isHover = false">
          <div v-if="displayDefaultAccountMenu"
            class="mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2"
            role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div role="none" class="my-2">
              <!-- <router-link  :to="{ name: 'ViewAccountDetails', params: { address: account.address }}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">{{$t('general.details')}}</router-link> -->
              <!-- <hr class="solid"> -->
              <div class="p-2 z-20 text-xs text-gray-400">Change Labels</div>
              <div v-for="(label, index) in labels" :key="index">
                <div @click="updateLabel(label.name)" class="flex justify-between p-2 cursor-pointer ">
                  <div class=" text-xs ">{{ label.name }}</div>
                  <img v-if="label.isLabeled" src="@/assets/img/icon-green-tick.svg" class="h-4 w-4 ">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" >
import { computed, getCurrentInstance, ref, type PropType } from "vue";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { walletState } from '@/state/walletState';
import { Helper } from '@/util/typeHelper';
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { AppState } from '@/state/appState';
import { Address } from 'tsjs-xpx-chain-sdk';
import { useRouter } from 'vue-router';
import { Account, setDefaultAccInStorage } from '@/models/account';
import { WalletAccount } from "@/models/walletAccount";

const p = defineProps({
  account: {
    type: Account,
    required: true
  }
})

const toast = useToast();
const multisig_add = ref("");
const displayDefaultAccountMenu = ref(false)

const labels = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return []
  } else {
    let labels :{name:string, isLabeled: boolean}[] = []
    walletState.currentLoggedInWallet.labels.forEach(label => {
      let isLabeled = false
      if (label.addresses.includes(p.account.address)) {
        isLabeled = true
      }
      labels.push({
        name: label.name,
        isLabeled: isLabeled
      })
    })
    return labels
  }
})

const updateLabel = async (name :string) => {
  if (!walletState.currentLoggedInWallet) {
    return
  }
  let label = walletState.currentLoggedInWallet.labels.find(label => label.name == name)
  let address = Address.createFromRawAddress(p.account.address).plain()
  if (!label) {
    return
  }
  let index = label.addresses.findIndex(add => add == address)
  if (index >= 0) {
    label.removeAddress(index)
    walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet)
    toast.add({ severity: 'info', summary: 'Label', detail: accountName.value + ' is removed as ' + name, group: 'br-custom', life: 5000 });
    return
  }
  label.addresses.push(address)
  walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet)
  toast.add({ severity: 'info', summary: 'Label', detail: accountName.value + ' is added as ' + name, group: 'br-custom', life: 5000 });
}

const accountName = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return ""
  }
  // check if address is in adress book
  const contact = walletState.currentLoggedInWallet.contacts.find((contact) => contact.address == p.account.address);
  if (contact) {
    return contact.name;
  } else {
    return p.account.name;
  }
})

const currentNativeTokenName = computed(() => AppState.nativeToken.label);
const currentNativeTokenDivisibility = computed(() => AppState.nativeToken.divisibility);
const accountBalance = computed(
  () => {
    return Helper.toCurrencyFormat(p.account.balance, currentNativeTokenDivisibility.value);
  }
);

const splitBalance = computed(() => {
  let split = accountBalance.value.split(".")
  if (split[1] != undefined) {
    return { left: split[0], right: split[1] }
  } else {
    return { left: split[0], right: null }
  }
})

let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
themeConfig.init();

const svgString = ref(toSvg(p.account.address, 50, themeConfig.jdenticonConfig));

const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;

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

const isMultiSig = computed(() => {
  let isMulti = p.account.getDirectParentMultisig().length ? true : false
  return isMulti;
});

const otherAccount = (address :string) => {
  if (!walletState.currentLoggedInWallet) {
    return 
  }

  const other_account = walletState.currentLoggedInWallet.others.find(others => others.address == address);
  if (other_account != null && other_account.type == 'MULTISIG') {
    multisig_add.value = other_account.address;
  }
  return other_account;
};

const prettyAddress = (address :string) => {
  const prettierAddress = Helper.createAddress(address).pretty();
  return prettierAddress;
};

const isHover = ref(false)
const isHoverCopy = ref(false)
emitter.on('PAGE_CLICK', () => {
  if (!isHover.value && !displayDefaultAccountMenu.value) {
  } else if (!isHover.value && displayDefaultAccountMenu.value) {
    displayDefaultAccountMenu.value = false
  }
});

const router = useRouter()
const setDefaultAcc = () => {
  if (!walletState.currentLoggedInWallet) {
    return 
  }
  if (!otherAccount(p.account.address)) {
    walletState.currentLoggedInWallet.setDefaultAccountByName(p.account.name)
  }

}

const navigate = () => {
  if (isHover.value || isHoverCopy.value) {
    return
  }

  if (p.account instanceof WalletAccount) {
    setDefaultAcc()
    setDefaultAccInStorage(p.account.address)
    router.push({ name: 'ViewAccountDetails', params: { address: p.account.address } })
  } else {
    router.push({ name: 'ViewAccountDetails', params: { address: p.account.address } })
  }
}


</script>
<style scoped>
.pop-option:after {
  content: '';
  display: block;
  position: absolute;
  top: -6px;
  right: 10px;
  width: 10px;
  height: 10px;
  background: #FFFFFF;
  border-left: 1px solid #E4E4E4;
  border-top: 1px solid #E4E4E4;
  -moz-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}

.explicitLeft {
  @media (min-width: 1024px) {
    margin-left: 39.3rem
  }

}</style>