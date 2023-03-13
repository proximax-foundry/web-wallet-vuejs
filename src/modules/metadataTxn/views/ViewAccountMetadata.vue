<template>
    <div>
        <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
            <AccountComponent :address="address" class="mb-6" />
            <AccountTabs :address="address" selected="metadata" />
            <div class="border-2 border-t-0 ">
                <AccountMetadataDatatableVue :publicKey="acc ? acc.publicKey : '0'.repeat(64)"
                    :accMetadata="accountMetadata" />
                <router-link :to="{ name: 'ViewUpdateAccountMetadata', params: { targetPublicKey: acc ? acc.publicKey : '0'.repeat(64) } }">
                    <button class="mx-6 my-4 blue-btn py-3 px-3 flex items-center">
                        <img src="@/assets/img/icon-plus.svg" class="inline-block w-4 h-4 mr-2">
                        Create New Account Metadata
                    </button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { AppState } from "@/state/appState"
import { walletState } from "@/state/walletState"
import { Convert, MetadataQueryParams, MetadataType, PublicAccount } from "tsjs-xpx-chain-sdk"
import { computed, ref, watch } from "vue"
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import AccountMetadataDatatableVue from "../components/AccountMetadataDatatable.vue";
import isValidUtf8 from 'utf-8-validate';
import { Buffer } from 'buffer';

window.Buffer = Buffer;
const props = defineProps({
    address: {
        type: String,
        required: true
    }
})
const acc = computed(() => {
    if (!walletState.currentLoggedInWallet) {
        return null
    }
    let acc = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == props.address)
        || walletState.currentLoggedInWallet.others.find(acc => acc.address == props.address)
    if (!acc) {
        return null
    }
    return acc
})


const accountMetadata = ref<{ scopedMetadataKeyUtf8: string | null, scopedMetadataKeyHex: string, value: string }[]>([])



const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


const fetchAccountMetadata = async () => {
    if (!acc.value || !AppState.chainAPI) {
        return
    }
    let metadataQueryParams = new MetadataQueryParams()
    metadataQueryParams.metadataType = MetadataType.ACCOUNT
    metadataQueryParams.pageSize = 100;
    metadataQueryParams.pageNumber = 1;
    metadataQueryParams.targetKey = PublicAccount.createFromPublicKey(acc.value.publicKey, AppState.networkType)
    let searchedMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams)
    for (let i = 0; i < searchedMetadata.metadataEntries.length; i++) {
        let metadataEntry = searchedMetadata.metadataEntries
        accountMetadata.value.push({
            scopedMetadataKeyUtf8: metadataEntry[i].scopedMetadataKey.toHex() == convertUtf8(metadataEntry[i].scopedMetadataKey.toHex()) ? null : convertUtf8(metadataEntry[i].scopedMetadataKey.toHex()),
            scopedMetadataKeyHex: metadataEntry[i].scopedMetadataKey.toHex(),
            value: metadataEntry[i].value
        })
    }
    let totalPageNumber = searchedMetadata.pagination.totalPages
    await delay(250)
    for (let i = 2; i <= totalPageNumber; i++) {
        let metadataQueryParams = new MetadataQueryParams()
        metadataQueryParams.metadataType = MetadataType.ACCOUNT
        metadataQueryParams.pageSize = 100
        metadataQueryParams.pageNumber = i;
        metadataQueryParams.targetKey = acc.value.publicKey
        let searchedMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams)
        for (let i = 0; i < searchedMetadata.metadataEntries.length; i++) {
            let metadataEntry = searchedMetadata.metadataEntries
            accountMetadata.value.push({
                scopedMetadataKeyUtf8: metadataEntry[i].scopedMetadataKey.toHex() == convertUtf8(metadataEntry[i].scopedMetadataKey.toHex()) ? null : convertUtf8(metadataEntry[i].scopedMetadataKey.toHex()),
                scopedMetadataKeyHex: metadataEntry[i].scopedMetadataKey.toHex(),
                value: metadataEntry[i].value
            })
            await delay(250)
        }
    }
}

const removeDoubleZero = (string: string) => {
    let isZero = string.endsWith('00')
    if (isZero) {
        string = string.substring(0, string.length - 2);
        string = removeDoubleZero(string)
    }
    return string
}

const convertUtf8 = (scopedMetadataKey: string) => {
    scopedMetadataKey = removeDoubleZero(scopedMetadataKey)
    let bytes = Convert.hexToUint8(scopedMetadataKey);
    if (isValidUtf8(Buffer.from(bytes))) {
        scopedMetadataKey = Convert.decodeHexToUtf8(scopedMetadataKey)
    }
    return scopedMetadataKey

}
const init = async () => {
    fetchAccountMetadata()
    /* fetchNamespaceMetadata()
    fetchAssetMetadata() */

}

if (AppState.isReady) {
    init();
}
else {
    let readyWatcher = watch(AppState, (value) => {
        if (value.isReady) {
            init();
            readyWatcher();
        }
    });
}

</script>
