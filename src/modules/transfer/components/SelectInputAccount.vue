<template>
    <div class="w-full">
        <div v-if="!selectedAccountInfo" class="text-blue-primary font-semibold uppercase text-xxs mt-3">Select Account to create / initiate transfer</div>
        <Dropdown v-model=selectedAccountInfo :style="{ 'width': '100%' }" :options=accounts :filter="true"
            :filterFields="['label','value']" emptyFilterMessage=" "  placeholder="Select Account"
            @change="selectAccount($event.value?.label, $event.value?.value); $emit('update:modelValue', $event.value?.value); $emit('select-account', $event.value?.value);">
            <!-- For the display of  account information -->
            <template #value="slotProps">
                <div v-if="slotProps.value" class="account-item-value account-item">
                    <div class='flex'>
                        <div v-html="selectedImg" />
                        <div class='flex flex-col ml-2 text-left'>
                            <div class='text-blue-primary font-semibold text-xxs uppercase' style="line-height: 9px;">
                                Selected Account to create / initiate transfer</div>
                            <div class='mt-2 text-tsm font-bold'>{{ slotProps.value.label }}</div>
                        </div>
                    </div>
                </div>
            </template>
            <!-- For the display of the dropdown option -->
            <template #option="slotProps">
                <div class="account-item">
                    <div class='flex'>
                        <div v-html="toSvg(slotProps.option.value, 20, jdenticonConfig)" />
                        <div class='text-xs ml-2 font-semibold'>{{ slotProps.option.label }}</div>
                    </div>
                </div>
            </template>
        </Dropdown>
    </div>
</template>
  
<script setup lang="ts">
import { walletState } from '@/state/walletState';
import { computed, ref, getCurrentInstance } from 'vue';
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';

defineEmits([
    'select-account', 'update:modelValue'
])

const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
themeConfig.init();
let jdenticonConfig = themeConfig.jdenticonConfig;

const accounts = computed(() => {
    if (!walletState.currentLoggedInWallet) {
        return []
    }
    const cosignerAccounts = walletState.currentLoggedInWallet.accounts.filter(acc=> acc.multisigInfo.length == 0 || acc.multisigInfo.find(info=>info.level == 0).cosignaturies.length == 0 )
    return [...cosignerAccounts].map((cosignerAcc) => {
        return {
            value: cosignerAcc.address,
            label: walletState.currentLoggedInWallet.convertAddressToName(cosignerAcc.address, true)
        }
    })
})

const selectedAccountInfo = ref(null)

const selectedImg = ref(null);
const selectAccount = (accountName: string, accountAddress: string) => {
    if (accountName == null && accountAddress == null) {
        selectedAccountInfo.value = null
        emitter.emit("select-account", null)
        return
    }
    emitter.emit("select-account", accountAddress)
    selectedAccountInfo.value.label = accountName;
    selectedAccountInfo.value.value = accountAddress;
    selectedImg.value = toSvg(accountAddress, 25, jdenticonConfig);
};


</script>
  