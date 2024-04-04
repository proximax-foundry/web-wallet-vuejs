<template>
  <div
    class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md"
  >
    <router-link
      :to="{ name: 'ViewWalletCreateSelection' }"
      class="text-xs m-2 text-blue-link items-center flex"
      ><img
        src="@/assets/img/chevron_left.svg"
        class="w-5 inline-block"
      />Back</router-link
    >
    <div class="text-lg text-center mt-10 font-semibold">
      {{ $t("wallet.createWallet") }}
    </div>
    <div class="text-xxs text-center text-blue-primary font-bold uppercase">
      {{ $t("wallet.fromBackUp") }}
    </div>
    <div class="text-xs mt-8 ml-auto mr-auto w-8/12 text-center mb-5">
      {{ $t("wallet.backUpDescription") }}
    </div>
    <div class="mx-auto w-8/12">
      <SelectNetwork />
    </div>
    <label class="cursor-pointer">
      <span
        class="mt-3 font-bold text-xs text-center blue-btn py-2 px-10 block ml-auto mr-auto w-8/12"
        >{{ $t("wallet.importFile") }}</span
      >
      <input type="file" @change="readWalletBackup" ref="walletFile" hidden />
    </label>
    <div class="text-center text-xs mt-6 mb-1">
      {{ $t("wallet.haveWallet") }}
    </div>
    <div class="text-center text-xs text-blue-primary font-semibold">
      <router-link :to="{ name: 'Home' }"
        >{{ $t("wallet.signInHere") }} ></router-link
      >
    </div>
    <div class="h-10"></div>
  </div>
</template>

<script setup lang="ts">
import {  ref, computed } from "vue";
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { networkState } from "@/state/networkState";
import { WalletUtils } from "@/util/walletUtils";
import { walletState } from "@/state/walletState";
import SelectNetwork from "@/components/SelectNetwork.vue";
import { useI18n } from "vue-i18n";
import { AppState } from "@/state/appState";

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const { t } = useI18n();
// comparing with default networktype 168 till multiple network selection interface is added
const selectedNetworkType = computed(() => AppState.networkType);
const selectedNetworkName = computed(() => networkState.chainNetworkName);
const walletFile = ref("");
const readWalletBackup = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const file = CryptoJS.enc.Base64.parse(e.target.result);
    try {
      const dataDecryp = JSON.parse(file.toString(CryptoJS.enc.Utf8));

      if (
        dataDecryp.networkName === undefined ||
        dataDecryp.networkName !== selectedNetworkName.value
      ) {
        confirm.require({
          message: t("wallet.importMsg", {
            network: selectedNetworkName.value,
          }),
          header: t("wallet.confirmImport"),
          acceptLabel: t("general.yes"),
          rejectLabel: t("general.no"),
          icon: "pi pi-exclamation-triangle",
          accept: () => {
            var importResult = importBackup(dataDecryp);
            toast.add({
              severity: importResult.status,
              detail: importResult.msg,
              group: "br-custom",
              life: 3000,
            });
            router.push({ name: "Home" });
          },
        });
      } else {
        var importResult = importBackup(dataDecryp);
        toast.add({
          severity: importResult.status,
          detail: importResult.msg,
          group: "br-custom",
          life: 3000,
        });
      }
    } catch (error) {
      let failMsg = t("wallet.importFail");
      toast.add({
        severity: "error",
        detail: failMsg,
        group: "br-custom",
        life: 5000,
      });
    }
  };
  reader.readAsText(file);
};

const importBackup = (dataDecryp) :{msg: string,status: "error" | "success" | "info" | "warn"} => {
  let status :"error" | "success" | "info" | "warn" = "success";
  let message = t("wallet.importSuccess");

  if (WalletUtils.checkIsNewFormat(dataDecryp)) {
    try {
      WalletUtils.importWalletNewFormat(
        walletState.wallets,
        dataDecryp,
        selectedNetworkName.value,
        selectedNetworkType.value
      );
    } catch (error :any) {
      status = "error";

      if (error.name === "SAME_NAME") {
        message = t("wallet.walletNameExist"); //wallet with same name already exist
      } else {
        message = t("wallet.unableImport");
      }
    }
  } else {
    try {
      WalletUtils.importWltOldFormat(
        walletState.wallets,
        dataDecryp,
        selectedNetworkName.value,
        selectedNetworkType.value
      );
    } catch (error :any) {
      status = "error";

      if (error.name === "SAME_NAME") {
        message = t("wallet.walletNameExist");
      } else {
        message = t("wallet.unableImport");
      }
    }
  }

  return {
    msg: message,
    status: status,
  };
};
</script>
