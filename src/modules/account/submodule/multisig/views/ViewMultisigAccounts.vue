<template>
    <div class="md:px-40 xl:px-64">
        <div class="border rounded-md p-3 flex flex-col shadow-lg filter mb-2 w-full">

            <div class="text-blue-primary font-semibold text-xs">{{
                walletState.currentLoggedInWallet.convertAddressToName(plainAddress) }}</div>

            <div class="flex items-center my-1">
                <div :id="address.substring(-4)" :copyValue="address" :copySubject="$t('general.address')"
                    class="truncate  font-semibold text-xs mt-1">
                    {{ address }}</div>
                <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy(address.substring(-4))"
                    class="ml-2 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
            </div>
            <div class="flex items-center ">
                <div class='text-xs font-bold '>{{ splitBalance(accBalance).left }} </div>
                <div class='text-xs font-bold' v-if='splitBalance(accBalance).right != null'>.</div>
                <div class='text-xxs mt-0.5 '>{{ splitBalance(accBalance).right }}</div>
                <div class='ml-1 text-xs  font-bold'>{{ AppState.nativeToken.label }}</div>
                <img src="@/modules/account/img/proximax-logo.svg" class='h-4 w-4 '>
            </div>
        </div>
       <div class="text-blue-primary text-sm font-semibold my-4">Cosignatories of</div>
        <Tree v-model:expandedKeys="expandedKeys" :value="treeValue" :filter="true" filterMode="strict"
            selectionMode="single" class="w-full ">
            <template #default="slotProps">
                <div>{{ slotProps.node.label }}</div>
            </template>
            <template #child="slotProps" class="w-full">
                <div class="border rounded-md p-3 flex flex-col shadow-lg filter mb-2 w-full">
                    <div class="text-blue-primary font-semibold text-xs">{{ slotProps.node.label }}</div>
                    <div class="flex items-center my-1">
                        <div :id="slotProps.node.address.substring(-4)" :copyValue="slotProps.node.address"
                            :copySubject="$t('general.address')" class="truncate  font-semibold text-xs mt-1">
                            {{ slotProps.node.address }}</div>
                        <font-awesome-icon icon="copy" :title="$t('general.copy')"
                            @click="copy(slotProps.node.address.substring(-4))"
                            class="ml-2 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
                    </div>
                    <div class="flex items-center" v-if="slotProps.node.balance">
                        <div class='text-xs font-bold '>{{ splitBalance(slotProps.node.balance).left }} </div>
                        <div class='text-xs font-bold' v-if='splitBalance(slotProps.node.balance).right != null'>.</div>
                        <div class='text-xxs mt-0.5 '>{{ splitBalance(slotProps.node.balance).right }}</div>
                        <div class='ml-1 text-xs  font-bold'>{{ AppState.nativeToken.label }}</div>
                        <img src="@/modules/account/img/proximax-logo.svg" class='h-4 w-4 '>
                    </div>
                </div>
            </template>

        </Tree>
    </div>
</template>

<script setup lang="ts">
import { Address, PublicAccount } from 'tsjs-xpx-chain-sdk';
import { computed, effectScope, ref, watch } from 'vue';
import Tree from 'primevue/tree';
import { AppState } from '@/state/appState';
import { walletState } from '@/state/walletState';
import { WalletUtils } from '@/util/walletUtils';
import { copyToClipboard } from '@/util/functions';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    address: String
})

const toast = useToast()

const { t } = useI18n()

const copy = (id) => {
    let stringToCopy = document.getElementById(id).getAttribute("copyValue");
    let copySubject = document.getElementById(id).getAttribute("copySubject");
    copyToClipboard(stringToCopy);
    toast.add({ severity: 'info', detail: copySubject + ' ' + t('general.copied'), group: 'br-custom', life: 3000 });
};

const plainAddress = Address.createFromRawAddress(props.address).plain()

const accBalance = computed(() => {

    if (!walletState.currentLoggedInWallet) {
        return 0
    }
    const acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == plainAddress) ||
        walletState.currentLoggedInWallet.others.find((add) => add.address == plainAddress);

    return acc.balance
})

const splitBalance = (balance: number) => {
    if (!balance) {
        return { left: null, right: null }
    }
    let split = balance.toString().split(".")
    if (split[1] != undefined) {
        return { left: split[0], right: split[1] }
    } else {
        return { left: split[0], right: null }
    }
}

interface MultisigInfoWithBalance {
    balance: number
    level: number;
    cosignatories: string[];
    multisigAccounts: string[];
    publicKey: string;
    minApproval: number;
    minRemoval: number;
}

const expandedKeys = ref<boolean[]>([]);


const getMultisigInfo = async () => {
    const graphInfo =
        await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(Address.createFromRawAddress(props.address));
    const multisigInfos: MultisigInfoWithBalance[] = [];

    for (const [key, value] of graphInfo.multisigAccounts) {
        const level = key;
        for (const multiInfo of value) {
            const { account, cosignatories, multisigAccounts, minApproval, minRemoval } = multiInfo;

            const newMultisigInfo = {
                publicKey: account.publicKey,
                level: level,
                cosignatories: cosignatories.map((cosign) => cosign.publicKey),
                multisigAccounts: multisigAccounts.map((cosign) => cosign.publicKey),
                minApproval: minApproval,
                minRemoval: minRemoval,
                balance: 0
            };

            multisigInfos.push(newMultisigInfo);
        }
    }
    return multisigInfos
}


const processedMultisigInfo = ref<MultisigInfoWithBalance[] | null>(null)

const updateBalance = async () => {

    const addresses = processedMultisigInfo.value.map(info => PublicAccount.createFromPublicKey(info.publicKey, AppState.networkType).address)

    const accInfo = await AppState.chainAPI.accountAPI.getAccountsInfo(addresses)
    for (let i = 0; i < processedMultisigInfo.value.length; i++) {
        const accIndex = accInfo.findIndex(acc => acc.publicKey == processedMultisigInfo.value[i].publicKey)
        if (accIndex == -1) {
            continue
        }
        const findXpx = accInfo[accIndex].mosaics.find(acc => acc.id.toHex() == AppState.nativeToken.assetId)
        if (findXpx) {
            processedMultisigInfo.value[i].balance = findXpx.amount.compact() / Math.pow(10, AppState.nativeToken.divisibility)
        }

    }

}

const treeValue = computed(() => {
    let multisigAccounts: { key: string, label: string, selectable: boolean, children: { key: string, label: string, selectable: boolean, address: string, type: string, balance: number }[] }[] = [];

    if (!processedMultisigInfo.value) {
        return multisigAccounts
    }

    const levelBelowZero = [...processedMultisigInfo.value.filter(info => info.level < 0)]
    const lowestLevel = Math.min(...levelBelowZero.map(info => info.level))

    if (lowestLevel == Infinity) {
        return multisigAccounts
    }

    for (let i = 0; i < Math.abs(lowestLevel); i++) {
        const multisigAccCurrentLevel = levelBelowZero.filter((accounts) => accounts.level == -Math.abs(i + 1)).map(acc => {
            return {
                address: WalletUtils.createAddressFromPublicKey(acc.publicKey, AppState.networkType).pretty(),
                balance: acc.balance
            }

        })

        multisigAccounts.push({
            key: (i + 1).toString(),
            label: "Level " + (i + 1).toString(),
            selectable: false,
            children: multisigAccCurrentLevel.map((info, index) => {
                return {
                    type: "child",
                    key: '0-' + index.toString(),
                    balance: info.balance,
                    label: walletState.currentLoggedInWallet.convertAddressToName(Address.createFromRawAddress(info.address).plain(), true),
                    address: info.address,
                    selectable: true
                }
            })
        })


    }

    return multisigAccounts
})

const scope = effectScope()

scope.run(() => {
    const hasTriggered = ref(false)

    const stopWatch = watch(AppState, async n => {
        if (n.isReady && !hasTriggered.value) {
            hasTriggered.value = true
            processedMultisigInfo.value = await getMultisigInfo()
            await updateBalance()
            stopWatch()
            scope.stop()
        }

    },{immediate:true})
})


</script>

<style >
.p-treenode-label {
    width: 100%;
}
</style>