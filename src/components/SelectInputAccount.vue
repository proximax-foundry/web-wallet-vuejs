<template>
  <div>
    <Dropdown
      v-model="selectedAccountInfo"
      :style="{ width: '100%' }"
      :options="filteredAccounts"
      :filter="true"
      optionLabel="label"
      emptyFilterMessage=" "
      @change="
        selectAccount($event.value.label, $event.value.value);
        $emit('update:modelValue', $event.value.value);
        $emit('select-account', $event.value.value);
      "
    >
      <!-- For the display of the main transfer account information -->
      <template #value="slotProps">
        <div v-if="slotProps.value" class="account-item-value account-item">
          <div class="flex">
            <div v-html="selectedImg" />
            <div class="flex flex-col ml-2 text-left">
              <div
                class="text-blue-primary font-semibold text-xxs uppercase"
                style="line-height: 9px"
              >
                {{ $t("transfer.transferFrom") }}
              </div>
              <div class="mt-1 text-tsm font-bold">
                {{ slotProps.value.label }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- For the display of the dropdown option -->
      <template #option="slotProps">
        <div class="account-item">
          <div class="flex">
            <div
              v-html="
                convertImage(slotProps.options.value, 50, jdenticonConfig)
              "
            />
            <div class="text-xs ml-2 font-semibold">
              {{ slotProps.option.label }}
            </div>
          </div>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import { walletState } from "@/state/walletState";
import { computed, ref, getCurrentInstance } from "vue";
import { toSvg, type JdenticonConfig } from "jdenticon";
import { ThemeStyleConfig } from "@/models/stores/themeStyleConfig";

const p = defineProps({
  selectDefault: {
    type: String,
    required: true,
  },
});

defineEmits(["select-account", "update:modelValue"]);

const toggleSelection = ref(false);
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
let themeConfig = new ThemeStyleConfig("ThemeStyleConfig");
themeConfig.init();
let jdenticonConfig = ref(themeConfig.jdenticonConfig);

const convertImage = (
  address: string,
  size: number,
  config: JdenticonConfig
) => {
  return toSvg(address, size, config);
};

const accounts = computed(() => {
  let accountList: { value: string; label: string }[] = [];
  const wallet = walletState.currentLoggedInWallet;
  if (!wallet) {
    return accountList;
  }
  wallet.accounts.forEach((acc) => {
    accountList.push({
      value: acc.address,
      label: wallet.convertAddressToName(acc.address, true),
    });
  });
  wallet.others.forEach((account) => {
    accountList.push({
      value: account.address,
      label: wallet.convertAddressToName(account.address, true),
    });
  });
  return accountList;
});

const selectedAccount = computed(() => {
  const findAcc = accounts.value.find((acc) => acc.value == p.selectDefault);
  return findAcc ? findAcc.label : "";
});

const selectedAddress = ref(p.selectDefault);
const selectedAccountInfo = {
  label: selectedAccount.value,
  value: selectedAddress.value,
};
const selectedImg = ref(toSvg(p.selectDefault, 25, jdenticonConfig.value));

const selectAccount = (accountName: string, accountAddress: string) => {
  emitter.emit("select-account", accountAddress);
  selectedAccount.value, (selectedAccountInfo.label = accountName);
  selectedAddress.value, (selectedAccountInfo.value = accountAddress);
  selectedImg.value = toSvg(accountAddress, 25, jdenticonConfig.value);
  toggleSelection.value = !toggleSelection.value;
};

const filterQuery = ref("");

const filteredAccounts = computed(() => {
  const query = filterQuery.value.toLowerCase();
  if (filterQuery.value == "") {
    return accounts.value;
  }
  return accounts.value.filter((items) => {
    return Object.values(items).some((word) =>
      String(word).toLowerCase().includes(query)
    );
  });
});
</script>

<style></style>
