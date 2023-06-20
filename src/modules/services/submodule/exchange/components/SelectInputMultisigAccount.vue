<template>
    <div>
        <button v-if="accounts.length && !isSelected" class="blue-btn py-2 px-3 mt-3" @click="isSelected = true">Select
            Multisig Account</button>
            <div v-if="accounts.length && isSelected && !selectedAccountInfo" class="text-xs mt-3 text-blue-primary ">Select Multisig Account</div>

            <Dropdown :showClear="true" v-if="isSelected" v-model=selectedAccountInfo :style="{ 'width': '100%' }" :options=accounts :filter="true"
                :filterFields="['label', 'value']" emptyFilterMessage=" "
                @change="selectAccount($event.value?.label, $event.value?.value); $emit('update:modelValue', $event.value?.value); $emit('select-multisig-account', $event.value?.value);">
                <!-- For the display of the account information -->
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="account-item-value account-item">
                        <div class='flex'>
                            <div v-html="selectedImg" />
                            <div class='flex flex-col ml-2 text-left'>
                                <div class='text-blue-primary font-semibold text-xxs uppercase' style="line-height: 9px;">
                                    Selected Multisig Account</div>
                                <div class='mt-1 text-tsm font-bold'>{{ slotProps.value.label }}</div>
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
import { ref, getCurrentInstance, toRefs, watch, PropType } from 'vue';
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { walletState } from '@/state/walletState';


const isSelected = ref(false)

const props = defineProps({
    selectedAddress: {
        type: String as PropType<string | null>,
        required: false
    }
})

defineEmits([
    'select-multisig-account', 'update:modelValue'
])

const { selectedAddress } = toRefs(props)

const accounts = ref<{ label: string, value: string }[]>([])

const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
themeConfig.init();
let jdenticonConfig = themeConfig.jdenticonConfig;


const selectedAccountInfo = ref<{ label: string, value: string } | null>(null)

watch(selectedAddress, (n) => {
    selectAccount(null, null)
    const selectedAccount = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == n);
    const hasMultisigInfo = selectedAccount.multisigInfo.find(info => info.level == 0)
    accounts.value = hasMultisigInfo ? [...selectedAccount.multisigInfo].filter(info => info.level < 0).map(x => {
        const allAccounts = [...walletState.currentLoggedInWallet.accounts, ...walletState.currentLoggedInWallet.others]
        const address = allAccounts.find(acc => acc.publicKey == x.publicKey).address
        return {
            label: walletState.currentLoggedInWallet.convertAddressToName(address),
            value: address,
        }
    }) : []

})

watch(selectedAccountInfo,n=> {
    if(n == null){
        isSelected.value = false;
    }
})


const selectedImg = ref<string | null>(null);
const selectAccount = (accountName: string | null, accountAddress: string | null) => {
    if (accountName == null && accountAddress == null) {
        selectedAccountInfo.value = null
        emitter.emit("select-multisig-account", null)
        return
    }
    emitter.emit("select-multisig-account", accountAddress)
    selectedAccountInfo.value.label = accountName;
    selectedAccountInfo.value.value = accountAddress;
    selectedImg.value = toSvg(accountAddress, 25, jdenticonConfig);
};


</script>
  