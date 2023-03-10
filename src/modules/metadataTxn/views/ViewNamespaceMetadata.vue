<template>
    <div>
        <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
            <AccountComponent :address="address" class="mb-6" />
            <AccountTabs :address="address" selected="namespaces" />
            <div class='border-2 border-t-0 '>
                <router-link :to="{ name: 'ViewAccountNamespaces', params: { address: address } }">
                    <div class="flex cursor-pointer items-center pt-3 px-3">
                        <img src='@/assets/img/chevron_left.svg'>
                        <div class="text-blue-primary text-xs">{{ $t('general.back') }}</div>
                    </div>
                </router-link>
                <div class="border border-blue-primary p-4 bg-blue-100 flex flex-col rounded mt-5 mx-6 mb-5">
                    <div>
                        <div class="uppercase text-blue-primary font-semibold text-xxs">NAMESPACE ID</div>
                        <div class="text-black text-sm font-bold ">{{ namespaceName }}</div>
                    </div>
                    <div>
                        <div class="uppercase text-blue-primary font-semibold text-xxs mt-3">Name</div>
                        <div class="text-black text-sm font-bold ">{{ namespaceId }}</div>
                    </div>
                </div>
                <DataTable :value="namespaceMetadata" :paginator="true" :rows="10" dataKey="id"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown"
                    :rowsPerPageOptions="[10, 20, 30, 40, 50]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    responsiveLayout="scroll">
                    <Column field="scopedMetadataKey" header="Scoped Metadata Key"
                        style="`wideScreen?'min-width: 200px'?'width: 200px'  ` ">
                        <template #body="{ data }">
                            <div class="flex">
                                <div>{{ data.scopedMetadataKeyHex }}</div>
                                <div class="ml-3 text-gray-400 font-semibold" v-if="data.scopedMetadataKeyUtf8">hex</div>
                            </div>
                            <div class="flex" v-if="data.scopedMetadataKeyUtf8">
                                <div>{{ data.scopedMetadataKeyUtf8 }}</div>
                                <div class="ml-3 text-gray-400 font-semibold">utf-8</div>
                            </div>
                        </template>
                    </Column>
                    <Column field="currentValue" header="Current Value"
                        style="`wideScreen?'min-width: 180px'?'width: 180px'`">
                        <template #body="{ data }">
                            <span class="  text-xs">{{ data.value }}</span>
                        </template>
                    </Column>
                    <Column field="action" header="Action" style="`wideScreen?'min-width: 180px'?'width: 180px'`">
                        <template #body="{ data }">
                            <router-link
                                :to="{ name: 'ViewUpdateNamespaceMetadata', params: { targetId: namespaceId, scopedMetadataKey: data.scopedMetadataKeyUtf8 ? data.scopedMetadataKeyUtf8 : data.scopedMetadataKeyHex } }">
                                <img src="@/modules/account/img/edit-icon.svg" title="Update Metadata"
                                    class="inline-block w-3 h-3 text-black cursor-pointer  ml-1">
                            </router-link>
                        </template>
                    </Column>
                    <template #empty>
                        {{ $t('general.noRecord') }}
                    </template>
                    <template #loading>
                        {{ $t('dashboard.fetchingTx') }}
                    </template>
                </DataTable>
                <router-link :to="{ name: 'ViewUpdateNamespaceMetadata', params: { targetId: namespaceId } }"><button
                        class="mx-6 my-4 blue-btn py-3 px-3 flex items-center"><img src="@/assets/img/icon-plus.svg"
                            class="inline-block w-4 h-4 mr-2">Create New Namespace Metadata</button></router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, watch } from 'vue';
import { Address, Convert, MetadataQueryParams, MetadataType, NamespaceId } from 'tsjs-xpx-chain-sdk';
import { AppState } from '@/state/appState';
import isValidUtf8 from 'utf-8-validate';

const props = defineProps({
    namespaceId: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }

})
const namespaceName = ref('-')
const getNamespaceName = async () => {
    if (!AppState.chainAPI) {
        return
    }
    let namespaceInfo = await AppState.chainAPI.namespaceAPI.getNamespace(new NamespaceId(props.namespaceId))
    namespaceName.value = namespaceInfo.id.toHex()
}
const namespaceMetadata = ref<{ scopedMetadataKeyUtf8: string | null, scopedMetadataKeyHex: string, value: string }[]>([])
const publicKey = ref('')
const getPublicKey = async () => {
    if (!AppState.chainAPI) {
        return
    }
    let accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(props.address))
    publicKey.value = accInfo.publicKey
}
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
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
const fetchNamespaceMetadata = async () => {
    if (!AppState.chainAPI) {
        return
    }
    let metadataQueryParams = new MetadataQueryParams()
    metadataQueryParams.metadataType = MetadataType.NAMESPACE
    metadataQueryParams.pageSize = 100;
    metadataQueryParams.pageNumber = 1;
    metadataQueryParams.targetId = new NamespaceId(props.namespaceId)
    metadataQueryParams.targetKey = publicKey.value
    let searchedMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams)
    for (let i = 0; i < searchedMetadata.metadataEntries.length; i++) {
        let metadataEntry = searchedMetadata.metadataEntries
        namespaceMetadata.value.push({
            scopedMetadataKeyUtf8: metadataEntry[i].scopedMetadataKey.toHex() == convertUtf8(metadataEntry[i].scopedMetadataKey.toHex()) ? null : convertUtf8(metadataEntry[i].scopedMetadataKey.toHex()),
            scopedMetadataKeyHex: metadataEntry[i].scopedMetadataKey.toHex(),
            value: metadataEntry[i].value
        })
    }
    let totalPageNumber = searchedMetadata.pagination.totalPages
    await delay(250)
    for (let i = 2; i <= totalPageNumber; i++) {
        let metadataQueryParams = new MetadataQueryParams()
        metadataQueryParams.metadataType = MetadataType.NAMESPACE
        metadataQueryParams.pageSize = 100
        metadataQueryParams.pageNumber = i;
        metadataQueryParams.targetId = props.namespaceId
        metadataQueryParams.targetKey = publicKey.value
        let searchedMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams)
        for (let i = 0; i < searchedMetadata.metadataEntries.length; i++) {
            let metadataEntry = searchedMetadata.metadataEntries
            namespaceMetadata.value.push({
                scopedMetadataKeyUtf8: metadataEntry[i].scopedMetadataKey.toHex() == convertUtf8(metadataEntry[i].scopedMetadataKey.toHex()) ? null : convertUtf8(metadataEntry[i].scopedMetadataKey.toHex()),
                scopedMetadataKeyHex: metadataEntry[i].scopedMetadataKey.toHex(),
                value: metadataEntry[i].value
            })
            await delay(250)
        }
    }
}

const init = async () => {
    await getPublicKey()
    await getNamespaceName()
    fetchNamespaceMetadata()

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

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-paginator-current {

        padding: 1rem;
        padding-right: 0.5rem;
        font-size: 12px;

    }

    .p-paginator-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .p-dropdown {
        margin-top: 0px;
    }

    .p-highlight {
        border-radius: 9999px;
    }

}</style>