<template>
    <div class="w-full">
        <div v-if="!selectedAccountInfo" class="text-blue-primary font-semibold uppercase text-xxs">
            <div v-if="type == 'transfer'">Select Account to create / initiate transfer</div>
            <div v-else-if="type == 'namespace'">Select Account to create namespace</div>
            <div v-else-if="type == 'asset'">Select Account to create asset</div>
            <div v-else>Select Account to {{ label }}</div>
        </div>
        <Dropdown v-model=selectedAccountInfo :style="{ 'width': '100%' }" :options=accounts :filter="true"
            :filterFields="['label','value','publicKey']" emptyFilterMessage=" "  placeholder="Select Account"
            @change="selectAccount($event.value?.label, $event.value?.value, $event.value?.publicKey, $event.value?.version); $emit('update:modelValue', $event.value?.value); $emit('select-account', $event.value?.value); $emit('select-account-public-key', $event.value?.publicKey);">
            <!-- For the display of  account information -->
            <template #value="slotProps">
                <div v-if="slotProps.value" class="account-item-value account-item">
                    <div class='flex'>
                        <div v-html="selectedImg" />
                        <div v-if="type == 'transfer'" class='flex flex-col ml-2 text-left'>
                            <div class='text-blue-primary font-semibold text-xxs uppercase' style="line-height: 9px;">
                                Selected Account to create / initiate transfer</div>
                            <div class='mt-2 text-tsm font-bold'>{{ slotProps.value.label }}</div>
                        </div>
                        <div v-else-if="type == 'namespace'" class='flex flex-col ml-2 text-left'>
                            <div class='text-blue-primary font-semibold text-xxs uppercase' style="line-height: 9px;">
                                Selected Account to create namespace</div>
                            <div class='mt-2 text-tsm font-bold'>{{ slotProps.value.label }}</div>
                        </div>
                        <div v-else-if="type == 'asset'" class='flex flex-col ml-2 text-left'>
                            <div class='text-blue-primary font-semibold text-xxs uppercase' style="line-height: 9px;">
                                Selected Account to create asset</div>
                            <div class='mt-2 text-tsm font-bold'>{{ slotProps.value.label }}</div>
                        </div>
                        <div v-else class='flex flex-col ml-2 text-left'>
                            <div class='text-blue-primary font-semibold text-xxs uppercase' style="line-height: 9px;">
                                Selected Account to {{ label }}</div>
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

const props = defineProps({
    type: {
        type: String,
        required: true
    },
    label:{
        type: String,
        required: false
    }
})

defineEmits([
    'select-account', 'select-account-public-key', 'select-account-version', 'update:modelValue'
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
            label: walletState.currentLoggedInWallet.convertAddressToName(cosignerAcc.address, true),
            publicKey: cosignerAcc.publicKey,
            version: cosignerAcc.version
        }
    })
})

const selectedAccountInfo = ref(null)

const selectedImg = ref(null);
const selectAccount = (accountName: string, 
    accountAddress: string, accountPublicKey: string,
    accountVersion: number) => {
    if (accountName == null && accountAddress == null && accountPublicKey == null) {
        selectedAccountInfo.value = null
        emitter.emit("select-account", null)
        emitter.emit("select-account-public-key", null)
        emitter.emit("select-account-version", 0)
        return
    }
    emitter.emit("select-account", accountAddress)
    emitter.emit("select-account-public-key", accountPublicKey)
    emitter.emit("select-account-version", accountVersion)
    selectedAccountInfo.value.label = accountName;
    selectedAccountInfo.value.value = accountAddress;
    selectedAccountInfo.value.publicKey = accountPublicKey;
    selectedImg.value = toSvg(accountAddress, 25, jdenticonConfig);
};


</script>
  