<template>
  <div class="w-full mt-0 border border-gray-200 px-2 py-2 rounded-md">
    <div class="flex">
      <div v-html="selectedImg" />
      <div class="flex flex-col ml-2 text-left">
        <div
          class="text-blue-primary font-semibold text-xxs uppercase leading-[9px]"
        >
          {{
            type == "transfer"
              ? $t("transfer.transferFrom") + " " + $t("general.multisig")
              : type == "namespace"
              ? $t("namespace.namespaceCreatedBy") + " " + $t("general.multisig")
              : type == "asset"
              ? $t("asset.assetCreatedBy") + " " + $t("general.multisig")
              : label
          }}
        </div>
        <div class="mt-2 text-tsm font-bold">
          {{ selectDefaultName }}
        </div>
      </div>
      <div class="ml-auto mt-auto mb-auto mr-6">
        <font-awesome-icon
          icon="times"
          class="delete-icon-style"
          @click="closeMultisig()"
        >
        </font-awesome-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toSvg } from "jdenticon";
import { ref, computed } from "vue";
import { ThemeStyleConfig } from "@/models/stores/themeStyleConfig";
const p = defineProps({
  selectDefaultAddress: {
    type: String,
    required: true,
  },
  selectDefaultName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: false,
  },
});
const emit = defineEmits(['close-multisig'])
let themeConfig = new ThemeStyleConfig("ThemeStyleConfig");
themeConfig.init();
let jdenticonConfig = ref(themeConfig.jdenticonConfig);
const selectedImg = computed(() => {
  return toSvg(p.selectDefaultAddress, 25, jdenticonConfig.value);
});
const closeMultisig = () => {
  emit("close-multisig");
};
</script>
