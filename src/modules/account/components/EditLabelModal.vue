<template>
    <Dialog
      v-bind:visible="toggleModal"
      modal
      header="Change Label Name"
      :draggable="false"
      :dismissableMask="true"
      :closable="false"
      class="w-96"
    >
      <div>
        <Dropdown v-model=selectedLabel :style="{ 'width': '100%' }" :options=labels :filter="true"
            emptyFilterMessage=" "  placeholder="Select Label"
            @change="selectLabel($event.value);">
            <!-- For the display of  account information -->
            <template #value="slotProps">
                <div v-if="slotProps.value" class="account-item-value account-item">
                    <div class='flex'>
                        <div class='flex flex-col ml-2 text-left'>
                            <div class='text-blue-primary font-semibold text-xxs uppercase' style="line-height: 9px;">
                                Selected Label</div>
                            <div class='mt-2 text-tsm font-bold'>{{ slotProps.value }}</div>
                        </div>
                    </div>
                </div>
            </template>
            <!-- For the display of the dropdown option -->
            <template #option="slotProps">
                <div class="account-item">
                    <div class='flex'>
                        <div class='text-xs ml-2 font-semibold'>{{ slotProps.option }}</div>
                    </div>
                </div>
            </template>
        </Dropdown>
        <InputLabelNameModal :selectLabel="selectedLabel"/>
      </div>
    </Dialog>
  </template>

<script lang="ts" setup>
import { computed, getCurrentInstance, ref } from "vue";
import { walletState } from "@/state/walletState";
import InputLabelNameModal from "./InputLabelNameModal.vue";
import Dialog from "primevue/dialog";


defineProps({
    toggleModal: {
        type: Boolean,
        required: true
    },
})

const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
const selectedLabel = ref<string>('')

const labels = computed(() => {
    if (!walletState.currentLoggedInWallet) {
        return []
    }
    const accLabels = walletState.currentLoggedInWallet.labels.map(x => x.name)
    return accLabels
})

const selectLabel = (label: string) => {
    if (label == null) {
        return
    }
    selectedLabel.value = label
};

emitter.on("update-select", (updatedLabel: string) => {
    selectedLabel.value = updatedLabel
})

</script>

<style>
.p-dialog-header {
  display: flex;
  justify-content: center;
}
</style>