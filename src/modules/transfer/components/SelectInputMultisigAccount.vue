<template>
    <div>
        <button v-if="accounts.length && !isSelected && selectedAddress" class=' border rounded-md cursor-pointer flex flex-col justify-center py-1  px-1.5 ' 
        @click="isSelected = true">
            <font-awesome-icon icon="id-card-alt" class=" text-blue-primary ml-auto mr-auto "></font-awesome-icon>
            <div class='text-xxs text-blue-primary font-semibold uppercase ml-auto mr-auto'>{{ $t('general.select') }}</div>
            <div class='text-xxs text-blue-primary font-semibold uppercase ml-auto mr-auto'>{{ $t('general.multisig') }}</div>
        </button>

        <Sidebar v-model:visible="isSelected" :baseZIndex="10000" position="full">
            <Tree :showClear="true" v-if="isSelected && accounts.length" :style="{ 'width': '100%' }" :value="accounts" :filter="true"
                selectionMode="single" :filterFields="['label', 'value']" emptyFilterMessage=" " @node-select="onNodeSelect">
            </Tree>
        </Sidebar>
           

    </div>
</template>
  
<script setup lang="ts">
import { ref, getCurrentInstance, toRefs, watch, PropType } from 'vue';
import { walletState } from '@/state/walletState';
import {  PublicAccount } from 'tsjs-xpx-chain-sdk';
import { AppState } from '@/state/appState';
import type {TreeNode } from "primevue/treenode"

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

watch(selectedAddress, (n) => {
    if(n == null){
        accounts.value = []
        return
    }
    const selectedAccount = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == n);
    const hasMultisigInfo = selectedAccount.multisigInfo.find(info => info.level == 0)
    accounts.value = hasMultisigInfo ? [...selectedAccount.multisigInfo].filter(info => info.level < 0).map(x => {
        const allAccounts = [...walletState.currentLoggedInWallet.accounts, ...walletState.currentLoggedInWallet.others]
        const findAcc = allAccounts.find(acc => acc.publicKey == x.publicKey)
        return {
            label: findAcc?  walletState.currentLoggedInWallet.convertAddressToName(findAcc.address) : PublicAccount.createFromPublicKey(x.publicKey,AppState.networkType).address.plain() ,
            value: PublicAccount.createFromPublicKey(x.publicKey,AppState.networkType).address.plain(),
            publicKey: x.publicKey
        }
    }) : []

})

const onNodeSelect = (node: TreeNode) => {
    emitter.emit('update:modelValue', node?.value); 
    emitter.emit('select-multisig-account', node);
    isSelected.value = false;
};

</script>
  