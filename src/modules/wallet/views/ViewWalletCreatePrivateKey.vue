<template>
  <div>
    <div v-if="!newWallet" class="container mx-auto md:grid md:grid-cols-2 md:mt-10 lg:px-20 xl:px-40 gap-4">
      <IntroTextComponent />
      <div class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md">
        <router-link :to="{ name: 'ViewWalletCreateSelection' }"
          class="text-xs m-2 text-blue-primary items-center flex"><img src="@/assets/img/chevron_left.svg"
            class="w-5 inline-block">{{ $t('general.back') }}</router-link>
        <form @submit.prevent="createWallet">
          <div class="text-sm text-center mt-20 font-semibold">{{ $t('wallet.createWallet') }} </div>
          <div class="text-xxs text-center text-blue-primary mb-5 font-bold uppercase">{{ $t('general.fromPrivateKey') }}
          </div>
          <p class='w-9/12 ml-auto mr-auto text-xs text-center'>{{ $t('wallet.privateKeyDescription') }}</p>
          <div class="mt-4 w-8/12 ml-auto mr-auto">
            <div class="error error_box" v-if="err != ''">{{ err }}</div>
          </div>
          <SelectNetworkInput />
          <div class="mt-3 w-8/12 ml-auto mr-auto">
            <PasswordInput :placeholder="$t('general.privateKey')" :errorMessage="$t('general.invalidPrivateKey')"
              icon="key" :showError="showPkError" v-model="privateKeyInput" />
            <TextInput class="mt-3" :placeholder="$t('wallet.namePlaceholder')" :errorMessage="$t('wallet.nameErrMsg')"
              v-model="walletName" icon="wallet" />
            <PasswordInput class="mt-3" :placeholder="$t('wallet.enterPassword')"
              :errorMessage="$t('wallet.passwordErrMsg')" :showError="showPasswdError" icon="lock" v-model="passwd" />
            <PasswordInput class="mt-3" :placeholder="$t('wallet.confirmPassword')"
              :errorMessage="$t('wallet.confirmPasswordErrMsg')" :showError="showConfirmPasswdError" icon="lock"
              v-model="confirmPasswd" />
          </div>
          <button type="submit"
            class="mt-3 text-center  font-bold blue-btn py-3 block ml-auto mr-auto w-8/12 disabled:opacity-50"
            :disabled="disableCreate">{{ $t('wallet.createWallet') }}</button>
          <div class='mt-12 text-center text-xs mb-1 '>{{ $t('wallet.haveWallet') }}</div>
          <div class="text-center  text-xs text-blue-primary font-semibold"><router-link :to="{ name: 'Home' }">{{
            $t('wallet.signInHere') }} ></router-link></div>
          <div class='h-20'></div>
        </form>
      </div>
    </div>
    <div v-else class="mr-auto ml-auto w-8/12">
      <div class="mb-8">
        <div class="border border-green-300 px-6 pb-3 bg-green-50">
          <div class="flex items-center gap-3">
            <img src='@/assets/img/icon-green-tick.svg' class='h-10 w-10 pt-3 mr-2 '>
            <div class="flex flex-col w-full">
              <div class="flex">
                <div class="text-xs text-green-500 font-semibold pt-3">{{ $t('general.congratz') }}</div>
              </div>
              <div class="text-xxs mt-1">{{ $t('wallet.walletCreated') }} {{ $t('general.pkWarning') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class='border-2 shadow-lg filter mb-10 bg-white'>
        <div class='flex'>
          <div v-html='svgString'></div>
          <div class='flex flex-col justify-center ml-4'>
            <div class='flex '>
              <div class='font-semibold text-md'>{{ accName }}</div>
            </div>
            <div class='flex'>
              <div id="address" :copyValue="address" :copySubject="$t('general.address')"
                class='text-xs font-semibold mt-1'>{{ address }} </div>
              <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy('address')"
                class="ml-2 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="border p-6 bg-white">
        <div class='text-xxs text-blue-primary mt-2 font-semibold uppercase'>{{ $t('general.publicKey') }}</div>
        <div class='flex'>
          <div id="public" class="text-xs font-semibold mt-1 break-all" :copyValue="publicKey"
            :copySubject="$t('general.publicKey')">{{ publicKey }}</div>
          <font-awesome-icon icon="copy" @click="copy('public')" :title="$t('general.copy')"
            class="ml-2 mt-0.5 pb-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
        </div>
        <div class='my-6 gray-line'></div>
        <div>
          <div class='text-xxs text-blue-primary mt-0.5 font-semibold uppercase'>{{ $t('general.privateKey') }}</div>
          <div class='flex '>
            <div v-if="!toggleModal" class='break-all font-semibold'>
              ****************************************************************</div>
            <font-awesome-icon icon="eye" :title="$t('general.view') + ' ' + $t('general.privateKey')"
              class="text-blue-link relative cursor-pointer ml-1" v-if="!toggleModal"
              @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <div class='flex'>
            <div id="private" class="text-xs mt-1 font-semibold break-all" type="text" :copyValue="privateKey"
              :copySubject="$t('general.privateKey')" v-if="toggleModal">{{ privateKey }}</div>
            <font-awesome-icon :title="$t('general.copy')" icon="copy" @click="copy('private')"
              class="ml-2 pb-1 w-5 h-5 text-blue-link mt-0.5 cursor-pointer " v-if="toggleModal"></font-awesome-icon>
            <font-awesome-icon icon="eye-slash" :title="$t('general.hide') + ' ' + $t('general.privateKey')"
              class="text-blue-link relative cursor-pointer mt-0.5 ml-1" v-if="toggleModal"
              @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <div class='text-txs mt-2 text-red-400 border px-1.5 py-2 border-red-400 rounded-md'>{{ $t('general.pkWarning')
          }}
          </div>
        </div>
        <div class='my-6 gray-line'></div>
        <div class='flex'>
          <div @click="saveWalletPaper" class=" blue-btn cursor-pointer py-3 px-3 ">{{ $t('general.downloadPaperWallet')
          }}
          </div>
          <router-link class="ml-auto" :to="{ name: 'Home' }">
            <div class=" blue-btn cursor-pointer py-3 px-3  ">{{ $t('wallet.continueLogIn') }}</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang ="ts">
import { computed, ref } from 'vue';
import { useToast } from "primevue/usetoast";
import TextInput from '@/components/TextInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { copyToClipboard } from '@/util/functions';
import { Wallets } from "@/models/wallets";
import { WalletUtils } from '@/util/walletUtils';
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { useI18n } from 'vue-i18n'
import IntroTextComponent from '@/components/IntroTextComponent.vue'
import SelectNetworkInput from '@/components/SelectNetworkInput.vue';
import { AppState } from '@/state/appState';
import { Account } from "tsjs-xpx-chain-sdk";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { toSvg } from "jdenticon";
import jsPDF from 'jspdf';
import qrcode from 'qrcode';
import { pdfWalletPaperImg } from '@/modules/account/pdfPaperWalletBackground';
import type { WalletAccount } from '@/models/walletAccount';


const { t } = useI18n();
const toast = useToast();
const selectedNetworkType = computed(() => AppState.networkType);
const selectedNetworkName = computed(() => networkState.chainNetworkName);
const err = ref("");
const newWallet = ref<WalletAccount | null>(null);
const walletName = ref("");
const passwd = ref("");
const privateKey = ref("");
const confirmPasswd = ref("");
const privateKeyInput = ref("");
const showPasswdError = ref(false);
const privKeyPattern = "^(0x|0X)?[a-fA-F0-9].{63,65}$";
const passwdPattern = "^[^ ]{8,}$";
const toggleModal = ref(false)
const address = ref('')
const publicKey = ref('')
const accName = ref('')
const themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
themeConfig.init();
const svgString = ref(toSvg(address.value, 100, themeConfig.jdenticonConfig));
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
const disableCreate = computed(
  () => !(
    walletName.value !== "" &&
    passwd.value.match(passwdPattern) &&
    confirmPasswd.value === passwd.value &&
    privateKeyInput.value.match(privKeyPattern)
  )
);
const showPkError = computed(
  () => !privateKeyInput.value.match(privKeyPattern) && privateKeyInput.value != ""
);

// true to show error
const showConfirmPasswdError = computed(
  () => (confirmPasswd.value != passwd.value && confirmPasswd.value != '')
);

const createWallet = () => {
  err.value = "";
  let wallets = new Wallets();

  if (wallets.filterByNetworkNameAndName(selectedNetworkName.value, walletName.value)) {
    err.value = t('wallet.walletNameExist');
  } else {
    let password = WalletUtils.createPassword(passwd.value);

    const walletAccount = WalletUtils.addNewWalletWithPrivateKey(walletState.wallets, privateKeyInput.value, password, walletName.value, selectedNetworkName.value, selectedNetworkType.value);

    privateKey.value = privateKeyInput.value;
    newWallet.value = walletAccount;
    accName.value = walletAccount.name
    let account = Account.createFromPrivateKey(privateKey.value, selectedNetworkType.value)
    address.value = account.address.pretty()
    publicKey.value = account.publicKey
  }
};

const generateQR = async (url: string, size = 2, margin = 0) => {
  return await qrcode.toString(url, { width: size, margin: margin });
}

const saveWalletPaper = async () => {
  const doc = new jsPDF({
    unit: 'px'
  });
  doc.addImage(pdfWalletPaperImg, 'JPEG', 120, 60, 205, 132);

  // QR Code Address
  doc.addImage(await generateQR(privateKey.value, 1, 0), "JPEG", 133, 120, 151.5, 105);

  // Addres number
  doc.setFontSize(8);
  doc.setTextColor('#000000');
  doc.text(address.value, 146, 164, { maxWidth: 132 });
  doc.save('Your_Paper_Wallet');
}


</script>
<style scoped>
.popup-outer-create-wallet {

  top: 40px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;

}</style>