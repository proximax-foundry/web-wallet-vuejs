<template>
  <div
    class="border filter shadow-lg flex w-8/12 mx-auto mt-8 p-6 justify-between"
  >
    <div class="flex flex-col items-center gap-2 text-sm">
      <div>Harvesting Status</div>
      <div>INACTIVE</div>
    </div>
    <div class="flex flex-col items-center gap-2">
      <div>Blocks made</div>
      <div>0</div>
    </div>
    <div class="flex flex-col items-center gap-2">
      <div>Fees Collected</div>
      <div>0</div>
    </div>
  </div>
  <form @submit.prevent="harvest">
    <div
      class="border filter shadow-lg flex flex-col gap-3 w-8/12 mx-auto mt-8 p-6"
    >
      <div>Remote Delegated Harvesting</div>
      <div class="ml-8">
        <div>Node URL</div>
        <NodeUrlDropdown v-model="selectedNode" />
        <div class="text-red-500 text-xs text-left my-1.5">
          {{ selectedNodeErr[0] ?? "" }}
        </div>
      </div>
      <div>Keys Info</div>
      <div class="ml-8">
        <TextInput
          :disabled="true"
          v-model="nodePublicKey"
          :errors="[]"
          placeholder="Node Public Key"
        ></TextInput>
        <div class="flex flex-col gap-3 py-3">
          <div
            v-for="({ value, name }, index) in selections"
            :key="index"
            class="flex align-items-center"
          >
            <RadioButton
              class="border rounded-full bg-white"
              v-model="createNew"
              :inputId="index.toString()"
              :value="value"
            />
            <label :for="index.toString()" class="ml-2">{{ name }}</label>
          </div>
        </div>

        <TextInput
          v-if="!createNew"
          v-model="remotePrivateKey"
          placeholder="Remote Private Key"
          :errors="remotePrivateKeyErr"
        ></TextInput>
        <PasswordInput
          :placeholder="$t('general.password')"
          v-model="password"
          :errors="passwordErr"
        />
      </div>
      <button>Harvest</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import NodeUrlDropdown from "../components/NodeUrlDropdown.vue";
import TextInput from "../components/TextInput.vue";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  Account,
  AccountLinkAction,
  AccountLinkTransaction,
  AggregateTransaction,
  Deadline,
  LinkAction,
  NodeLinkTransaction,
  Password,
  PlainMessage,
  PublicAccount,
  TransferTransaction,
  VrfLinkTransaction,
} from "tsjs-xpx-chain-sdk";
import { AppState } from "@/state/appState";
import { walletState } from "@/state/walletState";
import { WalletUtils } from "@/util/walletUtils";
import { networkState } from "@/state/networkState";
import PasswordInput from "../components/PasswordInput.vue";
import { useRouter } from "vue-router";
import RadioButton from "primevue/radiobutton";

const privKeyPattern = "^(0x|0X)?[a-fA-F0-9]{64}$";
const passwordPattern = "^[^ ]{8,}$";

const { t } = useI18n();
const router = useRouter();

const selections = [
  {
    name: "Generate new remote account",
    value: true,
  },
  {
    name: "Import an account",
    value: false,
  },
];

const defaultProps = zod.object({
  createNew: zod.boolean(),
  nodePublicKey: zod.string().refine(key=>{
    try {
        PublicAccount.createFromPublicKey(key, AppState.networkType);
        return true;
      } catch (err) {
        return false;
      }
  }),
  selectedNode: zod.object(
    { value: zod.string(), label: zod.string() },
    { invalid_type_error: "Node Url is required" }
  ),
  password: zod.string().regex(new RegExp(passwordPattern), {
    message: t("wallet.passwordErrMsg"),
  }),
});

const createNewSchema = zod.object({
  createNew: zod.literal(true),
});

const importSchema = zod.object({
  createNew: zod.literal(false),
  remotePrivateKey: zod.string().regex(new RegExp(privKeyPattern), {
    message: t("general.invalidPrivateKey"),
  }),
});

const conditionalSchema = zod.discriminatedUnion("createNew", [
  createNewSchema,
  importSchema,
]);

const integratedSchema = zod.intersection(conditionalSchema, defaultProps);

const validationSchema = toTypedSchema(integratedSchema);

const { handleSubmit, setFieldError } = useForm({
  validationSchema,
  initialValues: {
    createNew: true,
    selectedNode: null,
    password: "",
  },
});

const { value: selectedNode, errors: selectedNodeErr } = useField<{
  value: string;
  label: string;
} | null>("selectedNode");
const { value: nodePublicKey} =
  useField<string>("nodePublicKey");
const { value: createNew } = useField<boolean>("createNew");

const { value: remotePrivateKey, errors: remotePrivateKeyErr } =
  useField<string>("remotePrivateKey");
const { value: password, errors: passwordErr } = useField<string>("password");
watch(selectedNode, (n) => {
  if (n) {
    nodePublicKey.value = n.value;
  }
});

const harvest = handleSubmit(
  async ({ selectedNode, createNew, password, ...key }) => {
    const { value } = selectedNode;
    let remoteAcc: Account;
    if ("remotePrivateKey" in key) {
      const { remotePrivateKey } = key;
      remoteAcc = Account.createFromPrivateKeyV2(
        remotePrivateKey,
        AppState.networkType
      );
    } else {
      remoteAcc = Account.generateNewAccount(AppState.networkType, 2);
    }

    const vrfAcc = Account.generateNewAccount(AppState.networkType, 2);
    if (
      !WalletUtils.verifyWalletPassword(
        walletState.currentLoggedInWallet.name,
        networkState.chainNetworkName,
        password
      )
    ) {
      setFieldError(
        "password",
        t("general.walletPasswordInvalid", {
          name: walletState.currentLoggedInWallet.name,
        })
      );
      return;
    }
    const publicAcc = PublicAccount.createFromPublicKey(
      walletState.currentLoggedInWallet.accounts[0].publicKey,
      AppState.networkType,
      2
    );
    const accLinkTxn = AccountLinkTransaction.create(
      Deadline.create(),
      remoteAcc.publicKey,
      LinkAction.Link,
      AppState.networkType
    );
    const vrfLinkTxn = VrfLinkTransaction.create(
      Deadline.create(),
      vrfAcc.publicKey,
      AccountLinkAction.Link,
      AppState.networkType
    );
    const nodeLinkTxn = NodeLinkTransaction.create(
      Deadline.create(),
      value,
      AccountLinkAction.Link,
      AppState.networkType
    );
    const transferTxn = TransferTransaction.create(
      Deadline.create(),
      PublicAccount.createFromPublicKey(value, AppState.networkType).address,
      [],
      PlainMessage.create(remoteAcc.privateKey),
      AppState.networkType
    );

    const innerTxns = [
      accLinkTxn.toAggregate(publicAcc),
      vrfLinkTxn.toAggregate(publicAcc),
      nodeLinkTxn.toAggregate(publicAcc),
      transferTxn.toAggregate(publicAcc),
    ];
    const abtTxn = AggregateTransaction.createComplete(
      Deadline.create(),
      innerTxns,
      AppState.networkType,
      []
    );
    const acc = walletState.currentLoggedInWallet.accounts[0];
    const privateKey = WalletUtils.decryptPrivateKey(
      new Password(password),
      acc.encrypted,
      acc.iv
    );
    const signedTxn = Account.createFromPrivateKeyV2(
      privateKey,
      AppState.networkType
    ).sign(abtTxn, networkState.currentNetworkProfile.generationHash);
    AppState.chainAPI.transactionAPI.announce(signedTxn);
    console.log(signedTxn.hash);
    /*   TransactionState.unsignedTransactionPayload = abtTxn.serialize();
    TransactionState.selectedAddress =
      walletState.currentLoggedInWallet.accounts[0].address;
    router.push({ name: "ViewConfirmTransaction" });*/
  }
);
</script>
