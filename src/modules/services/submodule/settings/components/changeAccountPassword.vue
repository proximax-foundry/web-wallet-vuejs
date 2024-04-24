<template>
  <Dialog
    v-model:visible="toggleModal"
    modal
    :draggable="false"
    :dismissableMask="true"
    :closable="false"
    class="w-96"
  >
    <div v-if="!toggleChangePasswrd">
      <h1 class="default-title my-3 text-center sm:my-5">Change Password</h1>
      <div class="error error_box mb-3" v-if="err != ''">{{ err }}</div>
      <div class="text-center mt-2 text-xs font-semibold">
        Enter Current Password
      </div>
      <PasswordInput
        class="my-3"
        v-model="walletPasswd"
        :placeholder="$t('general.password')"
        :errorMessage="$t('general.passwordRequired')"
      />
      <div
        @click="verifyWalletPwPk()"
        class="blue-btn font-semibold py-2 cursor-pointer text-center ml-auto mr-auto w-7/12 disabled:opacity-50 disabled:cursor-auto"
        :disabled="disableShow"
      >
        {{ $t("general.confirm") }}
      </div>
      <div
        class="text-center cursor-pointer text-xs font-semibold text-blue-link mt-2"
        @click="
          toggleModal = !toggleModal;
          walletPasswd = '';
        "
      >
        {{ $t("general.cancel") }}
      </div>
    </div>
    <div v-else>
      <h1 class="default-title my-3 sm:my-5 text-center">Change Password</h1>
      <div class="error error_box mb-3" v-if="err != ''">{{ err }}</div>
      <div class="text-center mt-2 text-xs font-semibold">
        Enter New Password
      </div>
      <PasswordInput
        class="mt-3"
        :placeholder="$t('wallet.enterPassword')"
        :errorMessage="$t('wallet.passwordErrMsg')"
        :showError="showPasswdError"
        icon="lock"
        v-model="walletPasswd"
      />
      <PasswordInput
        class="mt-3"
        :placeholder="$t('wallet.confirmPassword')"
        :errorMessage="$t('wallet.confirmPasswordErrMsg')"
        :showError="showConfirmPasswdError"
        icon="lock"
        v-model="confirmPasswd"
      />
      <button
        @click="
          changeWalletPasswd(), (toggleModal = !toggleModal);
          (walletPasswd = ''), (toggleChangePasswrd = false);
        "
        class="blue-btn font-semibold py-2 mt-3 cursor-pointer text-center ml-auto mr-auto w-7/12 disabled:opacity-50 disabled:cursor-auto"
        :disabled="disableCreate"
      >
        {{ $t("general.confirm") }}
      </button>
      <div
        class="text-center cursor-pointer text-xs font-semibold text-blue-link mt-2"
        @click="
          toggleModal = !toggleModal;
          (walletPasswd = ''), (toggleChangePasswrd = false);
        "
      >
        {{ $t("general.cancel") }}
      </div>
    </div>
  </Dialog>
  <a @click="toggleModal = !toggleModal"
    ><img
      src="@/assets/img/globe-white.svg"
      class="h-4 w-4 inline-block relative mr-2"
      style="top: -1px"
    />
    <Button
      label="Change Password"
      class="p-button-sm p-button-outlined p-button-secondary"
    />
  </a>
</template>

<script lang="ts" setup>
import PasswordInput from "@/components/PasswordInput.vue";
import { computed, ref } from "vue";
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { WalletUtils } from "@/util/walletUtils";
import { useI18n } from "vue-i18n";
import { AppState } from "@/state/appState";
import { WalletAccount } from "@/models/walletAccount";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { Wallet } from "@/models/wallet"

const { t } = useI18n();
const toggleModal = ref(false);
const toggleChangePasswrd = ref(false);
const showPasswdError = ref(false);
const passwdPattern = "^[^ ]{8,}$";
const router = useRouter();
const toast = useToast();
let err = ref("");
let walletPasswd = ref("");
let passwd = ref("");
const confirmPasswd = ref("");

const disableShow = computed(() => !walletPasswd.value.match(passwdPattern));

const disableCreate = computed(
  () =>
    walletPasswd.value.match(passwdPattern) === null ||
    confirmPasswd.value !== walletPasswd.value
);

const showConfirmPasswdError = computed(
  () => confirmPasswd.value != walletPasswd.value && confirmPasswd.value != ""
);

const clearInput = () => {
  walletPasswd.value = "";
  confirmPasswd.value = "";
};

const logout = () => {
  walletState.isLogin = false;
  router.push({ name: "Home" });
};

const verifyWalletPwPk = () => {
  if (
    WalletUtils.verifyWalletPassword(
      walletState.currentLoggedInWallet.name,
      networkState.chainNetworkName,
      walletPasswd.value
    )
  ) {
    // pw is correct
    toggleChangePasswrd.value = true;
    passwd.value = walletPasswd.value;
    clearInput();
    err.value = "";
  } else {
    let walletName = walletState.currentLoggedInWallet.name;
    err.value = t("general.walletPasswordInvalid", { name: walletName });
  }
};
const showSuccess = () => {
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Your Password has changed",
    group: "br",
    life: 3000,
  });
};

const changeWalletPasswd = () => {
  for (let i = 0; i < walletState.currentLoggedInWallet.accounts.length; i++) {
    let currentAccount = walletState.currentLoggedInWallet.accounts[i];
    const passwordInstance = WalletUtils.createPassword(passwd.value);
    const walletPrivateKey = WalletUtils.decryptPrivateKey(
      passwordInstance,
      currentAccount.encrypted,
      currentAccount.iv
    );
    let password = WalletUtils.createPassword(walletPasswd.value);
    const wallet = WalletUtils.createAccountSimpleFromPrivateKey(
      currentAccount.name,
      password,
      walletPrivateKey,
      AppState.networkType,
      currentAccount.version
    );
    let walletAccount = new WalletAccount(
      currentAccount.name,
      currentAccount.publicKey,
      wallet.publicAccount.address.plain(),
      "pass:bip32",
      wallet.encryptedPrivateKey.encryptedKey,
      wallet.encryptedPrivateKey.iv,
      currentAccount.version
    );
    walletState.currentLoggedInWallet.accounts[i].encrypted =
      walletAccount.encrypted;
    walletState.currentLoggedInWallet.accounts[i].iv = walletAccount.iv;
  }
  walletState.wallets.saveMyWalletOnlytoLocalStorage(
    walletState.currentLoggedInWallet as Wallet
  );
  showSuccess();
  logout();
};
</script>
