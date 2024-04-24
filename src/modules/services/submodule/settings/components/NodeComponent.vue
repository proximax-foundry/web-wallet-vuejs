<template>
  <div class="border border-gray-200 px-2 py-1 h-12">
    <div class="uppercase text-gray-400 font-light text-txs text-left mb-2">
      {{ $t("general.block") }}
    </div>
    <input
      disabled="true"
      v-model="blockHeight"
      type="text"
      class="text_input"
    />
  </div>

  <div class="border border-gray-200 px-2 py-1 h-12 mt-5">
    <div class="uppercase text-gray-400 font-light text-txs text-left mb-2">
      {{ $t("node.currentNode") }}
    </div>
    <input
      disabled="true"
      v-model="currentNode"
      type="text"
      class="text_input"
    />
  </div>
  <Dropdown
  @change="makeNodeSelection"
    class="w-full mt-5 text-left"
    v-model="selected"
    :options="options"
    option-label="name"
    :placeholder="$t('node.nodeList')"
  />
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { networkState } from "@/state/networkState";
import { NetworkStateUtils } from "@/state/utils/networkStateUtils";
import { walletState } from "@/state/walletState";
import { WalletUtils } from "@/util/walletUtils";
import { useI18n } from "vue-i18n";
import { DropdownChangeEvent } from "primevue/dropdown";
import { Wallet } from "@/models/wallet";

const toast = useToast();
const { t } = useI18n();
const showSelectTitle = ref(true);

const options = computed<{ value: string; name: string }[]>(() => {
  if (!networkState.currentNetworkProfile) {
    return [];
  }
  let nodeList = [];

  networkState.currentNetworkProfile.apiNodes.forEach((node) => {
    nodeList.push({
      value: node,
      name: NetworkStateUtils.buildAPIEndpointURL(node),
    });
  });
  return nodeList;
});

const currentNode = computed(() =>
  NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint)
);
const blockHeight = computed(() =>
  networkState.currentNetworkProfileConfig
    ? networkState.currentNetworkProfileConfig.chainHeight
    : 0
);
const selected = ref({ name: "", value: "" });
watch(
  () => networkState.selectedAPIEndpoint,
  (n) => {
    if (n) {
      selected.value = {
        name: NetworkStateUtils.buildAPIEndpointURL(n),
        value: NetworkStateUtils.buildAPIEndpointURL(n),
      };
    }
  },
  { immediate: true }
);
const makeNodeSelection = async (event: DropdownChangeEvent) => {
  if (event.value.value != networkState.selectedAPIEndpoint) {
    showSelectTitle.value = true;
    NetworkStateUtils.updateChainNode(event.value);
    await WalletUtils.refreshAllAccountDetails(
      walletState.currentLoggedInWallet as Wallet,
      networkState.currentNetworkProfile
    );
    toast.add({
      severity: "success",
      summary: t("nodes.nodes"),
      detail: t("node.nodeUpdated"),
      group: "br-custom",
      life: 5000,
    });
  }
};
</script>
<style lang="scss" scoped>
.text_input {
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-tsm text-gray-600 font-bold bg-white;
}
</style>
