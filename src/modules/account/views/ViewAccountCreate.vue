<template>
  <div>
    <div class="flex cursor-pointer">
      <img src="@/assets/img/chevron_left.svg" />
      <router-link
        :to="{ name: 'ViewAccountCreateSelectType' }"
        class="text-blue-primary text-xs mt-0.5"
        >{{ $t("general.back") }}</router-link
      >
    </div>
    <div class="border w-8/12 ml-auto mr-auto mt-6 filter shadow-lg">
      <div class="text-lg text-center font-bold mt-10">
        {{ $t("general.createNewAcc") }}
      </div>
      <div class="error error_box mb-2 w-8/12 ml-auto mr-auto" v-if="err != ''">
        {{ err }}
      </div>

      <form
        :validation-schema="validationSchema"
        @submit="createAccount"
        class="w-8/12 ml-auto mr-auto"
      >
        <ZodTextInput
        class="mt-4"
          :errors="accountNameErrors"
          v-model="accountName"
          :placeholder="$t('account.namePlaceholder')"
        />
        <div class="mt-4"/>
        <ZodPasswordInput
          :errors="passwordErrors"
          v-model="password"
          :placeholder="$t('general.enterPassword')"
        />

        <div class="flex justify-center">
          <button class="blue-btn mt-4 px-6 py-2 ml-auto mr-auto">
            Create
          </button>
        </div>
      </form>

      <div class="mt-10"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { WalletUtils } from "@/util/walletUtils";
import { WalletAccount } from "@/models/walletAccount";
import { useI18n } from "vue-i18n";
import { AppState } from "@/state/appState";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import z from "zod";
import ZodTextInput from "@/components/ZodTextInput.vue";
import ZodPasswordInput from "@/components/ZodPasswordInput.vue";

const { t } = useI18n();

const err = ref("");

const router = useRouter();

const validationSchema = toTypedSchema(
  z.object({
    accountName: z
      .string()
      .nonempty(t("account.enterAccountName"))
      .max(16, { message: "Maximum length is 16" }),
    password: z
      .string()
      .nonempty(t("general.passwordRequired"))
      .min(8, { message: "Minimum length is 8" }),
  })
);

const { handleSubmit } = useForm({
  validationSchema,
});

const { value: accountName, errors: accountNameErrors } =
  useField<string>("accountName");

const { value: password, errors: passwordErrors } =
  useField<string>("password");

const createAccount = handleSubmit((values) => {
  if (!walletState.currentLoggedInWallet) {
    return;
  }

  const verifyExistingAccountName =
    walletState.currentLoggedInWallet.accounts.find(
      (element) => element.name == accountName.value
    );

  if (!verifyExistingAccountName) {
    var result = WalletUtils.verifyWalletPassword(
      walletState.currentLoggedInWallet.name,
      networkState.chainNetworkName,
      values.password
    );

    if (!result) {
      err.value = t("general.walletPasswordInvalid", {
        name: walletState.currentLoggedInWallet!.name,
      });
    } else {
      // create account
      let password = WalletUtils.createPassword(values.password);
      const account = WalletUtils.generateNewAccount(AppState.networkType);
      const wallet = WalletUtils.createAccountSimpleFromPrivateKey(
        accountName.value,
        password,
        account.privateKey,
        AppState.networkType
      );

      let walletAccount = new WalletAccount(
        accountName.value,
        account.publicKey,
        account.address.plain(),
        "pass:bip32",
        wallet.encryptedPrivateKey.encryptedKey,
        wallet.encryptedPrivateKey.iv
      );
      walletState.currentLoggedInWallet.accounts.push(walletAccount);
      walletState.wallets.saveMyWalletOnlytoLocalStorage(
        walletState.currentLoggedInWallet
      );
      router.push({
        name: "ViewAccountDetails",
        params: { address: account.address.plain(), accountCreated: "true" },
      });
    }
  } else {
    err.value = t("account.nameTaken");
  }
});
</script>
