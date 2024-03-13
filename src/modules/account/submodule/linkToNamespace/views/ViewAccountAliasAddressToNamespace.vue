<template>
 
  <div>
    <Sidebar v-model:visible="toggleContact" :baseZIndex="10000" position="full">
            <SelectAccountAndContact :contacts="contacts" @node-select="onNodeSelect" />
        </Sidebar>
    <div class="w-10/12 mx-auto mt-5">
      <AccountComponent :address="address" class="mb-6" />
      <AccountTabs :address="address" selected="details" />
      <div class="border-2 border-t-0 filter shadow-lg xl:grid xl:grid-cols-3">
        <div class="lg:col-span-2 py-6 px-6">
          <div
            v-if="walletCosignerList.cosignerList.length"
            class="text-tsm flex gap-2 items-center"
          >
            <div>{{ $t("general.initiateBy") }}:</div>
            <Dropdown
              v-model="selectedCosigner"
              :options="cosignerOptions"
              class="text-tsm"
              option-label="name"
            >
            </Dropdown>
          </div>
          <div class="font-semibold mt-3">
            {{
              selectedAction.value == "Link"
                ? $t("general.linkToNamespace")
                : $t("namespace.manageNamespace")
            }}
          </div>
          <div class="flex flex-col">
            <Dropdown
              class="my-3"
              :placeholder="$t('namespace.selectAction')"
              v-model="selectedAction"
              :options="actionsOptions"
              option-label="label"
              :disabled="disableNamespace"
            ></Dropdown>
            <Dropdown
              :placeholder="$t('namespace.selectNamespace')"
              v-model="selectedNamespace"
              option-label="label"
              :options="namespaceOptions"
              option-disabled="disabled"
              :disabled="disableNamespace"
            ></Dropdown>
          </div>
          <div class="flex mt-3 gap-1">
            <AddressInputClean
              :placeholder="$t('general.addAccAddress')"
              v-model="namespaceAddress"
              :errorMessage="addressErrorMsg"
              :showError="showAddressError"
              :disabled="
                disableNamespace ||
                selectedAction.value == 'Unlink' ||
                selectedNamespace == null
              "
            />
            <button
            
            
              class="border rounded-md cursor-pointer flex flex-col justify-around p-2"
              @click="toggleContact=true"
              :disabled="selectedNamespace == null"
            >
              <font-awesome-icon
                icon="id-card-alt"
                :class="selectedNamespace != null && selectedAction.value == 'Link'? 'text-blue-primary':'text-gray-400'"
                class=" ml-auto mr-auto"
              ></font-awesome-icon>
              <div 
              :class="selectedNamespace != null && selectedAction.value == 'Link'? 'text-blue-primary':'text-gray-400'"
              class="text-xxs font-semibold uppercase">
                {{ $t("general.select") }}
              </div>
            </button>
          </div>
        </div>
        <div class="bg-navy-primary p-6 lg:col-span-1">
          <TransactionFeeDisplay
            :transaction-fee="String(trxFee)"
            :total-fee-formatted="String(totalFee)"
            :get-multi-sig-cosigner="walletCosignerList"
            :check-cosign-balance="String(checkCosignBalance)"
            :lock-fund-currency="String(lockFund)"
            :lock-fund-tx-fee="String(lockFundTxFee)"
            :balance="accountDisplayBalance"
            :selected-acc-add="address"
            :is-cosigner="isCosigner"
            :fund-status="fundStatus"/>
          <div class="mt-3"></div>
          <button
            class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
            @click="aliasAddressToNamespace"
            :disabled="disableCreate"
          >
            {{selectedAction.value == 'Unlink'? $t("namespace.unlinkNamespace")  : $t("general.linkToNamespace") }}
          </button>
        
          <div class="text-center">
            <router-link
              :to="{ name: 'ViewAccountDetails', params: { address: address } }"
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
import PasswordInput from "@/components/PasswordInput.vue";
import { networkState } from "@/state/networkState";
import { accountUtils } from "@/util/accountUtils";
import { walletState } from "@/state/walletState";
import { WalletUtils } from "@/util/walletUtils";
import { Address, AliasActionType, NamespaceId } from "tsjs-xpx-chain-sdk";
import { ref, computed, watch } from "vue";
import { Helper } from "@/util/typeHelper";
import { useI18n } from "vue-i18n";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { MultisigUtils } from "@/util/multisigUtils";
import AddressInputClean from "@/modules/transfer/components/AddressInputClean.vue";
import { AppState } from "@/state/appState";
import { TransactionUtils } from "@/util/transactionUtils";
import { useRouter } from "vue-router";
import TransactionFeeDisplay from "@/modules/services/components/TransactionFeeDisplay.vue";
import SelectAccountAndContact from "@/components/SelectAccountAndContact.vue";
import type {TreeNode } from "primevue/treenode"
import { TransactionState } from "@/state/transactionState";

const { address } = defineProps<{ address: string }>();
const { t } = useI18n();
const selectedCosigner = ref({ name: "", value: "" });
const actionsOptions = [
  { value: "Link", label: t("general.link") },
  { value: "Unlink", label: t("general.unlink") },
];
const selectedAction = ref({ value: "Link", label: t("general.link") });
const selectedNamespace = ref<{ value: string; label: string }>(null);

const findAcc = (publicKey: string) => {
  let accounts = walletState.currentLoggedInWallet.accounts.map((acc) => {
    return {
      name: acc.name,
      balance: acc.balance,
      address: acc.address,
      publicKey: acc.publicKey,
      isMultisig: acc.getDirectParentMultisig().length ? true : false,
      multisigInfo: acc.multisigInfo,
    };
  });

  let otherAccounts = walletState.currentLoggedInWallet.others
    .filter((acc) => acc.type === "MULTISIG")
    .map((acc) => {
      return {
        name: acc.name,
        balance: acc.balance,
        address: acc.address,
        publicKey: acc.publicKey,
        isMultisig: true,
        multisigInfo: acc.multisigInfo,
      };
    });
  return accounts
    .concat(otherAccounts)
    .find((acc) => acc.publicKey == publicKey);
};

const acc = computed(() => {
  return (
    walletState.currentLoggedInWallet?.accounts.find(
      (acc) => acc.address == address
    ) ||
    walletState.currentLoggedInWallet.others.find(
      (acc) => acc.address == address
    )
  );
});

const err = ref("");

const namespaceAddress = ref("");
const showAddressError = ref(true);
const addressErrorMsg = ref("");
const passwordPattern = "^[^ ]{8,}$";
const addressPatternShort = "^[0-9A-Za-z]{40}$";
const addressPatternLong = "^[0-9A-Za-z-]{46}$";
const lockFund = computed(() => {
  if (!networkState.currentNetworkProfileConfig) {
    return 0;
  }
  return Helper.convertToExact(
    networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
    AppState.nativeToken.divisibility
  );
});
const lockFundTxFee = computed(() => {
  if (networkState.currentNetworkProfile) {
    return Helper.convertToExact(
      TransactionUtils.getLockFundFee(),
      AppState.nativeToken.divisibility
    );
  } else {
    return 0;
  }
});
const walletName = walletState.currentLoggedInWallet
  ? walletState.currentLoggedInWallet.name
  : "";

const trxFee = ref(0);

const totalFee = computed(() => {
  let tokenDivisibility = AppState.nativeToken.divisibility;
  if (walletCosignerList.value.hasCosigner) {
    if (tokenDivisibility == 0) {
      return Math.trunc(trxFee.value + lockFund.value + lockFundTxFee.value);
    } else {
      return (
        Math.round(
          (trxFee.value + lockFund.value + lockFundTxFee.value) *
            Math.pow(10, AppState.nativeToken.divisibility)
        ) / Math.pow(10, AppState.nativeToken.divisibility)
      );
    }
  } else {
    return trxFee.value;
  }
});

const accountBalance = computed(() => {
  if (!acc.value) {
    return 0;
  }
  return acc.value.balance;
});
const currentNativeTokenDivisibility = computed(
  () => AppState.nativeToken.divisibility
);
const accountDisplayBalance = computed(() => {
  if (walletState.currentLoggedInWallet) {
    return Helper.toCurrencyFormat(
      accountBalance.value,
      currentNativeTokenDivisibility.value
    );
  } else {
    return "0";
  }
});

const fundStatus = computed(() => {
  var fundStatus = false;
  if (walletCosignerList.value.hasCosigner) {
    if (findAcc(selectedCosignPublicKey.value)) {
      if (findAcc(selectedCosignPublicKey.value).balance < totalFee.value) {
        fundStatus = true;
      } else {
        fundStatus = false;
      }
    }
  } else {
    if (accountBalance.value < totalFee.value) {
      fundStatus = true;
    }
  }
  return fundStatus;
});

const disableCreate = computed(() => {
  return !(
    fundStatus.value == false &&
    namespaceAddress.value != "" &&
    selectedNamespace.value.value != null &&
    showAddressError.value == false
  );
});

const namespaceOptions = computed(() => {
  return accountUtils.namespaceOption(address, selectedAction.value.value);
});

const activeNamespaces = computed(() => {
  const acc =
    walletState.currentLoggedInWallet?.accounts.find(
      (acc) => acc.address == address
    ) ||
    walletState.currentLoggedInWallet?.others.find(
      (acc) => acc.address == address
    );
  return acc.namespaces.filter((namespace) => namespace.active == true);
});
const walletCosignerList = computed<{
  hasCosigner: boolean;
  cosignerList: {
    publicKey: string;
    name: string;
    balance: number;
    address: string;
  }[];
}>(() => {
  if (networkState.currentNetworkProfileConfig) {
    let cosigners = MultisigUtils.getCosignerInWallet(
      acc.value.publicKey ? acc.value.publicKey : ""
    );

    const list = cosigners.cosignerList.map((publicKey) => {
      return {
        publicKey,
        name: findAcc(publicKey).name,
        balance: findAcc(publicKey).balance,
        address: findAcc(publicKey).address,
      };
    });

    let hasList = false
    if(list.length > 0){
      hasList = true
    }

    return { hasCosigner: hasList, cosignerList: list };
  } else {
    return { hasCosigner: false, cosignerList: [] };
  }
});

const cosignerOptions = computed(() => {
  return walletCosignerList.value.cosignerList.map((cosigner) => {
    return {
      name: cosigner.name,
      value: cosigner.publicKey,
    };
  });
});

const selectedCosignPublicKey = ref("");
watch(
  selectedCosigner,
  (n) => {
    if (n.value != "") {
      selectedCosignPublicKey.value = n.value
    }
    else{
      selectedCosignPublicKey.value = ""
    }
  },
  { deep: true }
);

const isCosigner = computed(() => {
  if (!acc.value) {
    return false;
  }
  return MultisigUtils.getCosignerInWallet(acc.value.publicKey).cosignerList
    .length > 0
    ? true
    : false;
});

const disableNamespace = computed(() => {
  return (!isCosigner.value && walletCosignerList.value.hasCosigner) ||
    !activeNamespaces.value.length
    ? true
    : false;
});

watch(
  selectedAction,
  () => {
    namespaceAddress.value = "";
    selectedNamespace.value = null;
  },
  { immediate: true }
);

watch(selectedNamespace, (namespaceValues) => {
  const getnamespacelist = accountUtils.getNamespaceListByAddress(address);
  const namespacelist = getnamespacelist.find(
    (namespace) => namespace.name === selectedNamespace.value?.value
  );
  if (selectedAction.value.value == "Unlink" && namespaceValues != null) {
    namespaceAddress.value = Address.createFromRawAddress(
      namespacelist.linkedId
    ).pretty();
  } else if (
    selectedAction.value.value == "Link" &&
    namespaceAddress.value != "" &&
    namespaceValues.value != null
  ) {
    let namespaceAdd = Address.createFromRawAddress(
      namespaceAddress.value
    ).plain();
    trxFee.value = accountUtils.getLinkNamespaceToAddressTransactionFee(
      walletCosignerList.value.hasCosigner,
      namespaceAdd,
      selectedNamespace.value?.value,
      selectedAction.value.value
    ) / Math.pow(10,AppState.nativeToken.divisibility)
  }
});

watch(namespaceAddress, (namespaceAddressValue) => {
  if (
    (namespaceAddressValue.length == 46 &&
      namespaceAddressValue.match(addressPatternLong)) ||
    (namespaceAddressValue.length == 40 &&
      namespaceAddressValue.match(addressPatternShort))
  ) {
    const verifynamespaceAddress = accountUtils.verifyAddress(
      address,
      namespaceAddress.value
    );
    if (verifynamespaceAddress.isPassed == false) {
      addressErrorMsg.value = "Invalid Address";
      showAddressError.value = true;
    } else {
      let namespaceAdd = Address.createFromRawAddress(
        namespaceAddressValue
      ).plain();
      trxFee.value = accountUtils.getLinkNamespaceToAddressTransactionFee(
        walletCosignerList.value.hasCosigner,
        namespaceAdd,
        selectedNamespace.value?.value,
        selectedAction.value.value
      )/ Math.pow(10,AppState.nativeToken.divisibility)

      addressErrorMsg.value = "";
      showAddressError.value = false;
    }
  } else {
    showAddressError.value = true;
  }
});
const router = useRouter();
const aliasAddressToNamespace = () => {
    let acc = walletState.currentLoggedInWallet.accounts.find(
      (acc) => acc.address == address
    )
      ? walletState.currentLoggedInWallet.accounts.find(
          (acc) => acc.address == address
        )
      : walletState.currentLoggedInWallet.others.find(
          (acc) => acc.address == address
        );
    err.value = "";
    const transactionBuilder = AppState.buildTxn
    const tempLinkType = (selectedAction.value.value == 'Link') ? AliasActionType.Link : AliasActionType.Unlink;
    const namespaceId = new NamespaceId(selectedNamespace.value?.value);
    const linkNamespaceAdd = Address.createFromRawAddress(namespaceAddress.value);
    const unsignedNamespaceTransaction = transactionBuilder.addressAliasBuilder()
    .actionType(tempLinkType)
    .namespaceId(namespaceId)
    .address(linkNamespaceAdd)
    .build()

    if(selectedCosignPublicKey.value){
      let cosignerAddress = walletState.currentLoggedInWallet.accounts.find((account) => account.publicKey == selectedCosignPublicKey.value).address
      TransactionState.selectedAddress = cosignerAddress
      TransactionState.selectedMultisigAddress = acc.address
    }else{
      TransactionState.selectedAddress = acc.address
    }

    TransactionState.unsignedTransactionPayload = unsignedNamespaceTransaction.serialize()
    router.push({ name: "ViewConfirmTransaction" })
};

const checkCosignBalance = computed(() => {
  let findAccount = findAcc(selectedCosignPublicKey.value);
  return findAccount ? findAccount.balance : 0;
});

watch(
  walletCosignerList,
  (n) => {
    if (n.cosignerList.length) {
      selectedCosigner.value = {
        name: n.cosignerList[0].name,
        value: n.cosignerList[0].publicKey,
      };
    }
  },
  { immediate: true }
);

const toggleContact = ref(false)

const onNodeSelect = (node: TreeNode) => {
    toggleContact.value = false
    namespaceAddress.value = node.data
}

const contacts = computed(() => {
    const wallet = walletState.currentLoggedInWallet;

    if (!wallet) {
        return <{ key: string, label: string, selectable: boolean, children: { key: string, label: string, data: string }[] }[]>[];
    }
    const totalAcc = [...wallet.accounts, ...wallet.others]
    if (wallet.contacts.length) {
        return <{ key: string, label: string, selectable: boolean, children: { key: string, label: string, data: string }[] }[]>[{
            key: '0',
            label: t('general.ownerAcc'),
            selectable: false,
            children: totalAcc.map((acc, index) => {
                return {
                    key: "0-" + index.toString(),
                    label: acc.name,
                    data: Address.createFromRawAddress(acc.address).pretty(),
                    selectable: true
                }
            })
        }, {
            key: '1',
            label: t('general.contact'),
            selectable: false,
            children: wallet.contacts.map((contact, index) => {
                return {
                    key: "1-" + index.toString(),
                    label: contact.name,
                    data: Address.createFromRawAddress(contact.address).pretty(),
                    selectable: true
                }
            })
        }];
    }
    return <{ key: string, label: string, selectable: boolean, children: { key: string, label: string, data: string }[] }[]>[{
        key: '0',
        label: t('general.ownerAcc'),
        selectable: false,
        children: totalAcc.map((acc, index) => {
            return {
                key: "0-" + index.toString(),
                label: acc.name,
                data: Address.createFromRawAddress(acc.address).pretty(),
                selectable: true
            }
        })
    }]



});
</script>
