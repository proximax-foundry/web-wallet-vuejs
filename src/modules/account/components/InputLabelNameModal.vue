<template>
    <div class="w-full mt-3 border border-gray-200 px-2 py-2 rounded-md">
        <div class="flex flex-col w-full">
            <div class="uppercase text-gray-500 font-light text-xxs text-left  ">New Label Name</div>
            <input type="text" v-model="modelValue" :disabled="selectLabel == ''" class="w-full font-semibold text-tsm outline-none mt-1">
        </div>
    </div>
    <div
        class="blue-btn font-semibold py-2 text-center mt-3 ml-auto mr-auto w-7/12" :class="`${!(modelValue)?'opacity-50':'cursor-pointer'}`"
        @click="confirmChange()">
        {{ $t("general.confirm") }}
    </div>
    <div class="text-center cursor-pointer text-xs font-semibold text-blue-link mt-2" @click="cancelChange()">
        {{ $t("general.cancel") }}
    </div>
</template>

<script setup lang="ts">
import { walletState } from '@/state/walletState';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref } from 'vue';

const props = defineProps({
    selectLabel: {
        type: String,
        required: true,
    },
});

const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
const toast = useToast()
const modelValue = ref<string | null>(null)

defineEmits(['cancel-change-label', 'update-select'])

const confirmChange = () => {
    if (!walletState.currentLoggedInWallet || !modelValue.value) {
        return;
    }
    let label = walletState.currentLoggedInWallet.labels.find(
        (label) => label.name == props.selectLabel
    );
    if (!label) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Invalid",
            group: 'br-custom',
            life: 5000
        });
    }
    else{
        label.name = modelValue.value
        walletState.wallets.saveMyWalletOnlytoLocalStorage(
            walletState.currentLoggedInWallet
        );
        toast.add({
            severity: "info",
            summary: "Label",
            detail: props.selectLabel + " is changed to " + modelValue.value,
            group: "br-custom",
            life: 5000,
        });
        emitter.emit('cancel-change-label', false);
        emitter.emit('update-select', modelValue.value);
    }
}

const cancelChange = () => {
    emitter.emit('cancel-change-label', false);
};
</script>

