<template>
    <div>
            <Dropdown :showClear="true" v-if="accounts.length" v-model=selectedAccountInfo :style="{ 'width': '100%' }" :options=accounts :filter="true"
                :filterFields="['label', 'value']" emptyFilterMessage=" "
                @change="selectAccount($event.value?.label, $event.value?.value); $emit('update:modelValue', $event.value?.value); $emit('select-cosigner-account', $event.value?.value);">
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
                        <div class='flex items-center'>
                            <div v-html="toSvg(slotProps.option.value, 20, jdenticonConfig)" />
                            <div class='text-xs ml-2 font-semibold'>{{ slotProps.option.label }}</div>
                        </div>
                    </div>
                </template>
            </Dropdown>
           

    </div>
</template>
  
<script setup lang="ts">
import { ref, getCurrentInstance, toRefs, watch } from 'vue';
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { walletState } from '@/state/walletState';
import {  PublicAccount } from 'tsjs-xpx-chain-sdk';
import { AppState } from '@/state/appState';

const isSelected = ref(false)

const props = defineProps({
    cosignerList: {
        type: Array<string>,
        required: false
    }
})

defineEmits([
    'select-cosigner-account', 'update:modelValue'
])

const { cosignerList } = toRefs(props)

const accounts = ref<{ label: string, value: string }[]>([])

const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
themeConfig.init();
let jdenticonConfig = themeConfig.jdenticonConfig;


const selectedAccountInfo = ref<{ label: string, value: string } | null>(null)

watch(cosignerList,n=>{
    
    accounts.value = n.map(publicKey =>{
        const allAccounts = [...walletState.currentLoggedInWallet.accounts, ...walletState.currentLoggedInWallet.others]
        const findAcc = allAccounts.find(acc => acc.publicKey == publicKey)
        return{
            label: findAcc?  walletState.currentLoggedInWallet.convertAddressToName(findAcc.address) : PublicAccount.createFromPublicKey(publicKey,AppState.networkType).address.plain() ,
            value: PublicAccount.createFromPublicKey(publicKey,AppState.networkType).address.plain(),
        }
    })

},{deep:true,immediate:true})

const selectedImg = ref<string | null>(null);

const selectAccount = (accountName: string | null, accountAddress: string | null) => {
    if (accountName == null && accountAddress == null) {
        selectedAccountInfo.value = null
        emitter.emit("select-cosigner-account", null)
        return
    }
    emitter.emit("select-cosigner-account", accountAddress)
    selectedAccountInfo.value.label = accountName;
    selectedAccountInfo.value.value = accountAddress;
    selectedImg.value = toSvg(accountAddress, 25, jdenticonConfig);
};


</script>
  