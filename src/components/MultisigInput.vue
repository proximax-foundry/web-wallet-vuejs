<template>
    <div class="w-full h-16 mt-0 border border-gray-200 px-2 py-2 rounded-md">
        <div class="flex">
            <div v-html="selectedImg" />
            <div class="flex flex-col ml-2 text-left">
              <div
                class="text-blue-primary font-semibold text-xxs uppercase"
                style="line-height: 9px"
              >
              {{$t('transfer.transferFrom')}} {{ $t("general.multisig") }}
              </div>
              <div class="mt-2 text-base font-bold ">
                {{ selectDefaultName }}
              </div>
            </div>
            <div class="ml-auto mt-auto mb-auto mr-6">
              <font-awesome-icon icon="times" class="delete-icon-style" @click="closeMultisig()">
              </font-awesome-icon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toSvg } from "jdenticon";
import { ref, computed, getCurrentInstance } from "vue";
import { ThemeStyleConfig } from "@/models/stores/themeStyleConfig";
const p = defineProps({
  selectDefaultAddress: {
    type: String,
    required: true,
  },
  selectDefaultName: {
    type: String,
    required: true,
  }
});
const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
let themeConfig = new ThemeStyleConfig("ThemeStyleConfig");
themeConfig.init();
let jdenticonConfig = ref(themeConfig.jdenticonConfig);
const selectedImg = computed(() => {
    return toSvg(p.selectDefaultAddress, 25, jdenticonConfig.value)
});

const closeMultisig = () => {
  emitter.emit("CLOSE_MULTISIG")
}
</script>