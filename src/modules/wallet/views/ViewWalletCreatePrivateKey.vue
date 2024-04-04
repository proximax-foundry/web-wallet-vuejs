<template>
  <div
    class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md"
  >
    <router-link
      :to="{ name: 'ViewWalletCreateSelection' }"
      class="text-xs m-2 text-blue-primary items-center flex"
      ><img src="@/assets/img/chevron_left.svg" class="w-5 inline-block" />{{
        $t("general.back")
      }}</router-link
    >
    <form @submit.prevent="onSubmit">
      <div class="text-sm text-center font-semibold">
        {{ $t("wallet.createWallet") }}
      </div>
      <div
        class="text-xxs text-center text-blue-primary mb-5 font-bold uppercase"
      >
        {{ $t("general.fromPrivateKey") }}
      </div>
      <p class="w-9/12 ml-auto mr-auto text-xs text-center">
        {{ $t("wallet.privateKeyDescription") }}
      </p>
      <div class="mt-4 w-8/12 ml-auto mr-auto">
        <div class="error error_box" v-if="err != ''">{{ err }}</div>
      </div>
      <SelectNetworkInput />
      <div class="mt-3 w-8/12 ml-auto mr-auto">
        <PasswordInput
          :placeholder="$t('general.privateKey')"
          :errors="privKeyErr"
          v-model="privKey"
        />
        <TextInput
          :placeholder="$t('wallet.namePlaceholder')"
          :errors="nameErr"
          v-model="name"
        />
        <PasswordInput
          :placeholder="$t('wallet.enterPassword')"
          v-model="password"
          :errors="passwordErr"
        />
        <PasswordInput
          :placeholder="$t('wallet.confirmPassword')"
          :errors="confirmPasswordErr"
          v-model="confirmPassword"
        />
      </div>
      <button
        type="submit"
        class="mt-3 text-center font-bold blue-btn py-3 block ml-auto mr-auto w-8/12 disabled:opacity-50"
      >
        {{ $t("wallet.createWallet") }}
      </button>
      <div class="mt-12 text-center text-xs  mb-1">
        {{ $t("wallet.haveWallet") }}
      </div>
      <div class="text-center text-xs text-blue-primary font-semibold">
        <router-link :to="{ name: 'Home' }"
          >{{ $t("wallet.signInHere") }} ></router-link
        >
      </div>
      <div class="h-8"></div>
    </form>
  </div>
  <Dialog
    v-model:visible="toggleDialog"
    :closable="false"
    :dismissableMask="false"
    :closeOnEscape="false"
    class="lg:w-9/12"
    modal
  >
    <div class="mr-auto ml-auto w-10/12 mt-3">
      <div class="mb-8">
        <div class="border border-green-300 px-6 pb-3 bg-green-50">
          <div class="flex items-center gap-3">
            <img
              src="@/assets/img/icon-green-tick.svg"
              class="h-10 w-10 pt-3 mr-2"
            />
            <div class="flex flex-col w-full">
              <div class="flex">
                <div class="text-xs text-green-500 font-semibold pt-3">
                  {{ $t("general.congratz") }}
                </div>
              </div>
              <div class="text-xxs mt-1">
                {{ $t("wallet.walletCreated") }} {{ $t("general.pkWarning") }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="border-2 shadow-lg filter mb-10 bg-white">
        <div class="flex items-center">
          <div v-html="svgString"></div>
          <div class="flex flex-col justify-center ml-4">
            <div class="flex">
              <div class="font-semibold text-md">{{ accName }}</div>
            </div>
            <div class="flex">
              <div
                id="address"
                :copyValue="address"
                copySubject="Address"
                class="text-xs font-semibold mt-1 w-36 truncate md:w-auto"
              >
                {{ address }}
              </div>
              <font-awesome-icon
                icon="copy"
                :title="$t('general.copy')"
                @click="copy('address')"
                class="ml-2 w-5 h-5 text-blue-link cursor-pointer"
              ></font-awesome-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="border p-6 bg-white">
        <div class="text-xxs text-blue-primary mt-2 font-semibold uppercase">
          {{ $t("general.publicKey") }}
        </div>
        <div class="flex">
          <div
            id="public"
            class="text-xs font-semibold mt-1 break-all w-44 truncate md:w-auto"
            :copyValue="publicKey"
            :copySubject="$t('general.publicKey')"
          >
            {{ publicKey }}
          </div>
          <font-awesome-icon
            icon="copy"
            @click="copy('public')"
            :title="$t('general.copy')"
            class="ml-2 mt-0.5 pb-1 w-5 h-5 text-blue-link cursor-pointer"
          ></font-awesome-icon>
        </div>
        <div class="my-6 gray-line"></div>
        <div>
          <div
            class="text-xxs text-blue-primary mt-0.5 font-semibold uppercase"
          >
            {{ $t("general.privateKey") }}
          </div>
          <div class="flex">
            <div
              v-if="!showPk"
              class="break-all font-semibold w-44 truncate md:w-auto"
            >
              ****************************************************************
            </div>
            <font-awesome-icon
              icon="eye"
              :title="$t('general.view') + ' ' + $t('general.privateKey')"
              class="text-blue-link relative cursor-pointer ml-1"
              v-if="!showPk"
              @click="showPk = !showPk"
            ></font-awesome-icon>
          </div>
          <div class="flex">
            <div
              id="private"
              class="text-xs mt-1 font-semibold break-all w-44 truncate md:w-auto"
              type="text"
              :copyValue="privateKey"
              :copySubject="$t('general.privateKey')"
              v-if="showPk"
            >
              {{ privateKey }}
            </div>
            <font-awesome-icon
              :title="$t('general.copy')"
              icon="copy"
              @click="copy('private')"
              class="ml-2 pb-1 w-5 h-5 text-blue-link mt-0.5 cursor-pointer"
              v-if="showPk"
            ></font-awesome-icon>
            <font-awesome-icon
              icon="eye-slash"
              :title="$t('general.hide') + ' ' + $t('general.privateKey')"
              class="text-blue-link relative cursor-pointer mt-0.5 ml-1"
              v-if="showPk"
              @click="showPk = !showPk"
            ></font-awesome-icon>
          </div>
          <div
            class="text-txs mt-2 text-red-400 border px-1.5 py-2 border-red-400 rounded-md"
          >
            {{ $t("general.pkWarning") }}
          </div>
        </div>
        <div class="my-6 gray-line"></div>
        <div class="flex flex-col md:flex-row gap-3 text-center">
          <div
            @click="saveWalletPaper"
            class="blue-btn cursor-pointer py-3 px-3"
          >
            {{ $t("general.downloadPaperWallet") }}
          </div>
          <router-link class="md:ml-auto" :to="{ name: 'Home' }"
            ><div class="blue-btn cursor-pointer py-3 px-3">
              {{ $t("wallet.continueLogIn") }}
            </div></router-link
          >
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import { computed, watch, ref } from "vue";
import { useToast } from "primevue/usetoast";
import TextInput from "@/zodComponents/TextInput.vue";
import PasswordInput from "@/zodComponents/PasswordInput.vue";
import { copyToClipboard } from "@/util/functions";
import { Wallets } from "@/models/wallets";
import { WalletUtils } from "@/util/walletUtils";
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { useI18n } from "vue-i18n";
import SelectNetworkInput from "@/components/SelectNetworkInput.vue";
import { AppState } from "@/state/appState";
import { Account } from "tsjs-xpx-chain-sdk";
import { ThemeStyleConfig } from "@/models/stores/themeStyleConfig";
import { toSvg } from "jdenticon";
import jsPDF from "jspdf";
import qrcode from "qrcode-generator";
import { pdfWalletPaperImg } from "@/modules/account/pdfPaperWalletBackground";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

const { t } = useI18n();
const toast = useToast();
const privKeyPattern = "^(0x|0X)?[a-fA-F0-9]{64}$";
const passwdPattern = "^[^ ]{8,}$";

const validationSchema = toTypedSchema(
  zod
    .object({
      privKey: zod.string().regex(new RegExp(privKeyPattern),{message:t('general.invalidPrivateKey')}) , 
      name: zod.string().min(1, { message: t("wallet.nameErrMsg") }),
      password: zod.string().regex(new RegExp(passwdPattern), {
        message: t("wallet.passwordErrMsg"),
      }),
      confirmPassword: zod.string().regex(new RegExp(passwdPattern), {
        message: t("wallet.passwordErrMsg"),
      }),
    })
    .refine(({ password, confirmPassword }) => confirmPassword == password, {
      message: t("wallet.confirmPasswordErrMsg"),
      path: ["confirmPassword"],
    })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema,
  initialValues: {
    privKey:"",
    name: "",
    password: "",
    confirmPassword: "",
  },
});
const { value: privKey, errors: privKeyErr } = useField<string>("privKey");
const { value: name, errors: nameErr } = useField<string>("name");
const { value: password, errors: passwordErr } = useField<string>("password");
const { value: confirmPassword, errors: confirmPasswordErr } =
  useField<string>("confirmPassword");

const selectedNetworkType = computed(() => AppState.networkType);
const selectedNetworkName = computed(() => networkState.chainNetworkName);

const err = ref("");
const newWallet = ref(null);
const privateKey = ref("");
const showPk = ref(false);
const toggleDialog = ref(false);
const address = ref("");
const publicKey = ref("");
const accName = ref("");
const themeConfig = new ThemeStyleConfig("ThemeStyleConfig");
themeConfig.init();
const svgString = ref(toSvg(address.value, 100, themeConfig.jdenticonConfig));
const copy = (id :string) => {
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

const onSubmit = handleSubmit(({ name, password,privKey }) => {
  err.value = "";
  let wallets = new Wallets();

  if (
    wallets.filterByNetworkNameAndName(
      selectedNetworkName.value,
      name
    )
  ) {
    err.value = t("wallet.walletNameExist");
  } else {
    let pass = WalletUtils.createPassword(password);

    if (privKey.substring(0, 2) == "0x") {
      privKey = privKey.substring(2);
    }
    const walletAccount = WalletUtils.addNewWalletWithPrivateKey(
      walletState.wallets,
      privKey,
      pass,
      name,
      selectedNetworkName.value,
      selectedNetworkType.value
    );
    privateKey.value = privKey;
    newWallet.value = walletAccount;
    accName.value = walletAccount.name;
    let account = Account.createFromPrivateKey(
      privateKey.value,
      selectedNetworkType.value,
      1
    );
    address.value = account.address.pretty();
    publicKey.value = account.publicKey;
    resetForm()
  }
});
const generateQR = (url, size = 2, margin = 0) => {
  const qr = qrcode(10, "H");
  qr.addData(url);
  qr.make();
  return qr.createDataURL(size, margin);
};
const saveWalletPaper = () => {
  const doc = new jsPDF({
    unit: "px",
  });
  doc.addImage(pdfWalletPaperImg, "JPEG", 120, 60, 205, 132);

  // QR Code Address
  doc.addImage(generateQR(privateKey.value, 1, 0), "JPEG", 151.5, 105, 40, 40);

  // Addres number
  doc.setFontSize(8);
  doc.setTextColor("#000000");
  doc.text(address.value, 146, 164, { maxWidth: 132 });
  doc.save("Your_Paper_Wallet");
};


watch(newWallet, (n) => {
  if (n) {
    toggleDialog.value = true;
  }
});
</script>

