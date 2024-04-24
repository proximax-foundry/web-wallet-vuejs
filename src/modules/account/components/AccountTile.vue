<template>
  <div
    class="border rounded-lg border-gray-200 p-3 filter shadow-lg cursor-pointer"
    @click="navigate()"
  >
    <div class="flex gap-2">
      <div class="mt-auto mb-auto" v-html="svgString"></div>
      <div class="flex flex-col">
        <div class="text-blue-primary font-bold text-xs mb-0.5">
          {{ accountName }}
        </div>
        <div class="flex justify-around">
          <div
            :id="account.address"
            :title="prettyAddress(account.address)"
            class="text-xs font-bold mt-0.5 mr-2 truncate md:text-clip w-44 md:w-full"
            :copyValue="prettyAddress(account.address)"
            :copySubject="$t('general.address')"
          >
            {{ prettyAddress(account.address) }}
          </div>
          <font-awesome-icon
            @mouseover="isHoverCopy = true"
            @mouseout="isHoverCopy = false"
            icon="copy"
            @click="copy(account.address)"
            class="w-5 h-5 text-blue-primary cursor-pointer inline-block"
          ></font-awesome-icon>
        </div>
        <div class="flex">
          <div class="text-xs font-bold">{{ splitBalance.left }}</div>
          <div class="text-xs font-bold" v-if="splitBalance.right != null">
            .
          </div>
          <div class="text-xxs mt-0.5">{{ splitBalance.right }}</div>
          <div class="ml-1 text-xs font-bold">{{ currentNativeTokenName }}</div>
          <img src="@/modules/account/img/proximax-logo.svg" class="h-4 w-4" />
        </div>
        <div class="flex gap-2">
          <div
            class="px-1 py-0.5 flex items-center bg-blue-primary rounded-sm"
            title="Account Version"
          >
            <p
              class="font-semibold text-white text-xxs pt-px cursor-default uppercase"
            >
              v{{ accVersion }}
            </p>
          </div>
          <div
            v-if="(account as WalletAccount)?.default"
            class="px-1 py-0.5 flex items-center bg-blue-primary rounded-sm"
            :title="$t('general.defaultTitle')"
          >
            <img src="@/modules/account/img/icon-pin.svg" class="h-4 w-4" />
            <p
              class="font-semibold text-white text-xxs pt-px cursor-default uppercase"
            >
              {{ $t("general.default") }}
            </p>
          </div>
          <div
            v-if="isMultiSig"
            class="px-1 py-0.5 flex items-center bg-green-500 rounded-sm"
            :title="$t('general.multisigTitle')"
          >
            <img src="@/assets/img/icon-multisig.svg" class="h-3 w-3 mr-1" />
            <p
              class="font-semibold text-white text-xxs pt-px cursor-default uppercase"
            >
              {{ $t("general.multisig") }}
            </p>
          </div>
          <div
            v-if="isMultiSig && !otherAccount(account.address)"
            class="px-1 py-0.5 flex items-center bg-purple-500 rounded-sm"
            :title="$t('general.ownerTitle')"
          >
            <img src="@/assets/img/icon-key.svg" class="h-4 w-4 mr-1" />
            <p
              class="font-semibold text-white text-xxs pt-px cursor-default uppercase"
            >
              {{ $t("general.owner") }}
            </p>
          </div>
        </div>
      </div>
      <div class="absolute flex invisible 2xl:visible pt-4 explicitLeft">
        <div v-for="(label, index) in labels" :key="index">
          <div
            v-if="label.isLabeled"
            class="text-xs mr-3 border bg-gray-300 rounded-md p-1"
          >
            {{ label.name }}
          </div>
        </div>
      </div>
      <img
        src="@/assets/img/navi/icon-default-account-drop-down.svg"
        class="h-6 w-6 cursor-pointer my-auto ml-auto"
        @mouseover="isHover = true"
        @mouseout="isHover = false"
        @click="toggle"
      />
      <Menu ref="menu" :model="items" :popup="true"> </Menu>
    </div>
  </div>
  <EditLabelModal :toggleModal="toggleLabelChange"/>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
import { copyToClipboard } from "@/util/functions";
import { useToast } from "primevue/usetoast";
import { walletState } from "@/state/walletState";
import { Helper } from "@/util/typeHelper";
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from "@/models/stores/themeStyleConfig";
import { AppState } from "@/state/appState";
import { useI18n } from "vue-i18n";
import { Address } from "tsjs-xpx-chain-sdk";
import { useRouter } from "vue-router";
import { setDefaultAccInStorage } from "@/models/account";
import { OtherAccount } from "@/models/otherAccount";
import { WalletAccount } from "@/models/walletAccount";
import EditLabelModal from "./EditLabelModal.vue";
import Menu from "primevue/menu";
import { Wallet } from "@/models/wallet";

const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
const { account } = defineProps<{ account: WalletAccount | OtherAccount }>();
console.log(account);
const menu = ref();
const toggleLabelChange = ref(false)
const toast = useToast();
const { t } = useI18n();
const multisig_add = ref("");
const labels = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return [];
  } else {
    let labels = [];
    walletState.currentLoggedInWallet.labels.forEach((label) => {
      let isLabeled = false;
      if (label.addresses.includes(account.address)) {
        isLabeled = true;
      }
      labels.push({
        name: label.name,
        isLabeled: isLabeled,
      });
    });
    return labels;
  }
});

const toggle = (event: Event) => {
  menu.value.toggle(event);
};

const items = computed(() => {
  return [
    {
      label: "Change Labels",
      command: () => {
        toggleLabelChange.value = true
      },
    },
  ].concat(
    labels.value.map((label) => {
      return {
        label: label.name,
        command: () => {
          updateLabel(label.name);
        },
      };
    })
  );
});
const updateLabel = async (name) => {
  if (!walletState.currentLoggedInWallet) {
    return;
  }
  let label = walletState.currentLoggedInWallet.labels.find(
    (label) => label.name == name
  );
  let address = Address.createFromRawAddress(account.address).plain();
  if (!label) {
    return;
  }
  let index = label.addresses.findIndex((add) => add == address);
  if (index >= 0) {
    label.removeAddress(index);
    walletState.wallets.saveMyWalletOnlytoLocalStorage(
      walletState.currentLoggedInWallet as Wallet
    );
    toast.add({
      severity: "info",
      summary: "Label",
      detail: accountName.value + " is removed as " + name,
      group: "br-custom",
      life: 5000,
    });
    return;
  }
  label.addresses.push(address);
  walletState.wallets.saveMyWalletOnlytoLocalStorage(
    walletState.currentLoggedInWallet as Wallet
  );
  toast.add({
    severity: "info",
    summary: "Label",
    detail: accountName.value + " is added as " + name,
    group: "br-custom",
    life: 5000,
  });
};
const accountName = computed(() => {
  // check if address is in adress book
  const contact = walletState.currentLoggedInWallet.contacts.find(
    (contact) => contact.address == account.address
  );
  if (contact) {
    return contact.name;
  } else {
    return account.name;
  }
});

const currentNativeTokenName = computed(() => AppState.nativeToken.label);
const currentNativeTokenDivisibility = computed(
  () => AppState.nativeToken.divisibility
);
const accountBalance = computed(() => {
  return Helper.toCurrencyFormat(
    account.balance,
    currentNativeTokenDivisibility.value
  );
});
const splitBalance = computed(() => {
  let split = accountBalance.value.split(".");
  if (split[1] != undefined) {
    return { left: split[0], right: split[1] };
  } else {
    return { left: split[0], right: null };
  }
});
let themeConfig = new ThemeStyleConfig("ThemeStyleConfig");
themeConfig.init();
const svgString = ref(toSvg(account.address, 50, themeConfig.jdenticonConfig));
const copy = (id) => {
  let stringToCopy = document.getElementById(id).getAttribute("copyValue");
  let copySubject = document.getElementById(id).getAttribute("copySubject");
  copyToClipboard(stringToCopy);

  toast.add({
    severity: "info",
    detail: copySubject + " " + t("general.copied"),
    group: "br-custom",
    life: 3000,
  });
};
const accVersion = computed(()=> {
  if(!account){
    return 0
  }
  return account.version
})
const isMultiSig = computed(() => {
  let isMulti = account.getDirectParentMultisig().length ? true : false;
  return isMulti;
});
const otherAccount = (address) => {
  const other_account = walletState.currentLoggedInWallet.others.find(
    (others) => others.address == address
  );
  if (other_account != null && other_account.type == "MULTISIG") {
    multisig_add.value = other_account.address;
  }
  return other_account;
};
const prettyAddress = (address) => {
  const prettierAddress = Helper.createAddress(address).pretty();
  return prettierAddress;
};
const isHover = ref(false);
const isHoverCopy = ref(false);

const router = useRouter();
const setDefaultAcc = () => {
  if (otherAccount(account.address) == undefined) {
    walletState.currentLoggedInWallet.setDefaultAccountByName(account.name);
  } else {
    return;
  }
};

const navigate = () => {
  if (isHover.value || isHoverCopy.value) {
    return;
  }
  if (!(account as OtherAccount)?.type) {
    setDefaultAcc();
    setDefaultAccInStorage(account.address);
    router.push({
      name: "ViewAccountDetails",
      params: { address: account.address },
    });
  } else {
    router.push({
      name: "ViewAccountDetails",
      params: { address: account.address },
    });
  }
};

emitter.on("cancel-change-label", (toggle: boolean) => {
    toggleLabelChange.value = toggle
})

</script>
<style scoped>

@media (min-width: 1024px) {
  .explicitLeft {
    margin-left: 39.3rem;
  }
}
</style>
