<template>
  <div>
    <div class="w-10/12 ml-auto mr-auto mt-5">
      <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8">
        <div class="xl:col-span-2 p-12">
          <div class="text-sm font-semibold mb-2">Register as Issuer</div>
          <div v-if="addressAliasError" class="text-red-500 text-xs">
            Account already has alias
          </div>
          <SelectInputAccount />
          <SelectInputMultisigAccount
            class="md:mt-3"
            :selected-address="selectedAddress"
          />
          <div class="h-3"></div>
          <FieldValidationInput
            placeholder="Department name"
            :showError="showNamespaceErr"
            v-model="namespaceInput"
            v-debounce:1000="checkNamespace"
          />
          <div class="text-red-500 text-xs pt-1">{{ namespaceErrMsg }}</div>
        </div>
        <div
          class="bg-navy-primary py-6 px-6 xl:col-span-1 flex flex-col justify-center"
        >
          <div class="font-semibold text-xs text-white mb-1.5">
            {{ $t("general.enterPasswordContinue") }}
          </div>
          <PasswordInput
            :placeholder="$t('general.enterPassword')"
            :errorMessage="$t('general.passwordRequired')"
            v-model="walletPassword"
            icon="lock"
            class="mt-5 mb-3"
          />
          <button
            type="submit"
            class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
            :disabled="disableCreate"
            @click="registerAsIssuer"
          >
            {{ $t("general.transfer") }}
          </button>
          <div class="text-center">
            <router-link
              :to="{ name: 'ViewDashboard' }"
              class="content-center text-xs text-white underline"
              >{{ $t("general.cancel") }}</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from "vue";
import PasswordInput from "@/components/PasswordInput.vue";
import SelectInputAccount from "../components/SelectInputAccount.vue";
import SelectInputMultisigAccount from "../components/SelectInputMultisigAccount.vue";
import FieldValidationInput from "@/modules/transfer/components/FieldValidationInput.vue";
import { networkState } from "@/state/networkState";
import { AppState } from "@/state/appState";
import {
  Account,
  Address,
  AliasActionType,
  Convert,
  NamespaceId,
  Password,
  PlainMessage,
  PublicAccount,
  UInt64,
} from "tsjs-xpx-chain-sdk";
import { walletState } from "@/state/walletState";
import { WalletUtils } from "@/util/walletUtils";
import { TransactionUtils } from "@/util/transactionUtils";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
const passwdPattern = "^[^ ]{8,}$";
const walletPassword = ref("");

const disableCreate = computed(() => {
  return !(
    walletPassword.value.match(passwdPattern) &&
    !showNamespaceErr.value &&
    selectedAddress.value
  );
});
const showNamespaceErr = ref(true);

const namespaceErrMsg = ref("");

const namespaceInput = ref("");

const selectedMultisigAddress = ref<string | null>(null);

const selectedAddress = ref<string | null>(null);

emitter.on("select-account", (address: string) => {
  selectedAddress.value = address;
});

emitter.on("select-multisig-account", (address: string) => {
  selectedMultisigAddress.value = address;
});

const reservedRootNamespace = computed(() => {
  return (
    networkState.currentNetworkProfileConfig?.reservedRootNamespaceNames
      .split(",")
      .map((ns) => ns.trim()) ?? []
  );
});

const maxNamespaceLength = computed(
  () => networkState.currentNetworkProfileConfig?.maxNameSize ?? 0
);

const namespacePattern = `^[0-9a-z]{2,${maxNamespaceLength.value}}$`;

const checkNamespace = async () => {
  if (namespaceInput.value.trim()) {
    if (reservedRootNamespace.value.includes(namespaceInput.value.trim())) {
      showNamespaceErr.value = true;
      namespaceErrMsg.value = "Reserved name";
      return;
    }
    showNamespaceErr.value = !namespaceInput.value.match(namespacePattern);

    if (showNamespaceErr.value) {
      namespaceErrMsg.value = "Invalid name";
    } else {
      AppState.chainAPI.namespaceAPI
        .getNamespace(new NamespaceId(namespaceInput.value))
        .then(() => {
          showNamespaceErr.value = true;
          namespaceErrMsg.value = "Name exists";
        });
    }
  }
};

const addressAliasError = ref(false);
watch([selectedAddress, selectedMultisigAddress], async ([n, mn]) => {
  if (n == null) {
    addressAliasError.value = false;
  }
  if (n != null && mn == null) {
    AppState.chainAPI.namespaceAPI
      .getNamespacesFromAccount(Address.createFromRawAddress(n))
      .then((namespaces) => {
        addressAliasError.value = namespaces.length > 0;
      });
  } else if (n != null && mn != null) {
    AppState.chainAPI.namespaceAPI
      .getNamespacesFromAccount(Address.createFromRawAddress(mn))
      .then((namespaces) => {
        addressAliasError.value = namespaces.length > 0;
      });
  }
});

watch(showNamespaceErr, (n) => {
  if (!n) {
    namespaceErrMsg.value = "";
  }
});

watch(namespaceInput, (n) => {
  if (n == "") {
    showNamespaceErr.value = true;
  }
});
const toast = useToast();

const registerAsIssuer = () => {
  const verifyPassword = WalletUtils.verifyWalletPassword(
    walletState.currentLoggedInWallet.name,
    networkState.chainNetworkName,
    walletPassword.value
  );
  if (!verifyPassword) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Password is incorrect",
      group: "br-custom",
      life: 1000,
    });
    return;
  }
  const initiatorAcc = walletState.currentLoggedInWallet.accounts.find(
    (acc) => acc.address == selectedAddress.value
  );

  const privateKey = WalletUtils.decryptPrivateKey(
    new Password(walletPassword.value),
    initiatorAcc.encrypted,
    initiatorAcc.iv
  );
  walletPassword.value = "";
  const issuer = selectedMultisigAddress.value ?? selectedAddress.value;
  const nemesisAcc = PublicAccount.createFromPublicKey(
    networkState.currentNetworkProfileConfig.publicKey,
    AppState.networkType
  );
  const findIssuer =
    walletState.currentLoggedInWallet.accounts.find(
      (acc) => acc.address == issuer
    ) ||
    walletState.currentLoggedInWallet.others.find(
      (acc) => acc.address == issuer
    );

  const transferTxn = AppState.buildTxn
    .transferBuilder()
    .mosaics([])
    .message(
      PlainMessage.create("Register issuer department: " + namespaceInput.value)
    )
    .recipient(nemesisAcc.address)
    .build();

  const subnamespaceTxn = AppState.buildTxn
    .registersubNamespaceBuilder()
    .parentNamespace("ae.gov")
    .namespaceName(namespaceInput.value)
    .build();

  let hexValue = Convert.utf8ToHex("issuer");
  let tempHexData = hexValue.padEnd(16, "0");

  const namespaceMetadataTxn = AppState.buildTxn
    .namespaceMetadataBuilder()
    .scopedMetadataKey(UInt64.fromHex(tempHexData))
    .targetPublicKey(nemesisAcc)
    .targetNamespaceId(new NamespaceId("ae.gov." + namespaceInput.value))
    .oldValue("")
    .value(namespaceInput.value)
    .calculateDifferences()
    .build();

  const namespaceAliasTxn = AppState.buildTxn
    .addressAliasBuilder()
    .actionType(AliasActionType.Link)
    .namespaceId(new NamespaceId("ae.gov." + namespaceInput.value))
    .address(Address.createFromRawAddress(issuer))
    .build();

  const innerTxns = [
    transferTxn.toAggregateV1(
      PublicAccount.createFromPublicKey(
        findIssuer.publicKey,
        AppState.networkType
      )
    ),
    subnamespaceTxn.toAggregateV1(nemesisAcc),
    namespaceMetadataTxn.toAggregateV1(nemesisAcc),
    namespaceAliasTxn.toAggregateV1(nemesisAcc),
  ];

  const abtTxn = AppState.buildTxn
    .aggregateBondedBuilder()
    .innerTransactions(innerTxns)
    .build();

  const signer = Account.createFromPrivateKeyV1(
    privateKey,
    AppState.networkType
  );
  const signedAbt = signer.preV2Sign(
    abtTxn,
    networkState.currentNetworkProfile.generationHash
  );

  const hashLockTxn = TransactionUtils.lockFundTx(signedAbt);
  const signedHashLockTxn = signer.preV2Sign(
    hashLockTxn,
    networkState.currentNetworkProfile.generationHash
  );
  TransactionUtils.announceLF_AND_addAutoAnnounceABT(
    signedHashLockTxn,
    signedAbt
  );

  useRouter().push({
    name: "ViewAccountPendingTransactions",
    params: { address: selectedAddress.value },
  });
};
</script>
