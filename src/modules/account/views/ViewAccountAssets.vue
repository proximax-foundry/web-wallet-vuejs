<template>
    <div>
        <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
            <AccountComponent :address="address" class="mb-6" />
            <AccountTabs :address="address" selected="assets" />
            <div class='border-2 border-t-0  '>
                <DataTable :value="assets" :paginator="true" :rows="10" dataKey="id" ref="dt" @page="onPage($event)" style="position: unset;"
                    @update:rows="updateRow($event)" :loading="loading" :rowsPerPageOptions="[10, 20, 30, 40, 50]"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    responsiveLayout="scroll">
                    <template #empty>
                        No assets found.
                    </template>

                    <Column field="id" header="Asset ID">
                        <template #body="{ data }" headerClass="w-96">
                            <a :href="explorerLink(data.id)" target=_new class="col-span-2">
                                <div
                                    class="text-blue-primary uppercase w-min-max text-xs mt-1.5 cursor-pointer text-blue-primary pr-7 ">
                                    {{ data.id }}</div>
                            </a>
                        </template>
                    </Column>
                    <Column field="name" header="Namespace">
                        <template #body="{ data }">
                            <div class="flex items-center  pr-7 ">
                                <img v-if="displayTokenName(data.name).name == 'XPX'"
                                    src="@/modules/account/img/proximax-logo.svg"
                                    class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                                <img v-else-if="displayTokenName(data.name).name == 'XAR'"
                                    src="@/modules/account/img/xarcade-logo.svg"
                                    class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                                <img v-else-if="displayTokenName(data.name).name == 'METX'"
                                    src="@/modules/account/img/metx-logo.svg"
                                    class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                                <div v-else-if="data.name == '-'" />
                                <img v-else src="@/modules/dashboard/img/icon-proximax-logo-gray.svg"
                                    class='inline-block h-6 w-6 mr-2 '>
                                <div v-if="displayTokenName(data.name).registered" class="inline-block text-xs ml-2 mt-1">
                                    {{ displayTokenName(data.name).name }}</div>
                                <div v-else class="inline-block text-xs ml-2 cursor-pointer mt-1">{{ data.name }}</div>
                            </div>
                        </template>
                    </Column>

                    <Column field="amount" header="Balance">
                        <template #body="{ data }">
                            <div>{{ data.amount }}</div>
                        </template>
                    </Column>

                    <Column field="creator" header="Creator">
                        <template #body="{ data }">
                            <img v-if="data.isCreator" src="@/assets/img/icon-green-tick.svg" class="h-5 w-5">
                            <img v-else src="@/assets/img/icon-red-x.svg" class="h-5 w-5">
                        </template>
                    </Column>
                    <Column header="Actions ">
                        <template #body="{ data }">
                            <div v-if="data.isCreator">
                                <AssetAction  :address="address" :id="data.id" :is-creator="true" />
                            </div>
                            <div v-else>
                                <AssetAction  :address="address" :id="data.id" :is-creator="false" />
                            </div>
                      
                            </template>
                    </Column>
                </DataTable>
                <div class="flex my-3 px-6 flex-col w-full ml-auto mr-auto gap-2 sm:flex-row sm:items-center">
                    <router-link :to="{ name: 'ViewTransferCreate' }"
                        class=" bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center "><img
                            src="@/assets/img/icon-transfer-white.svg"
                            class="  inline-block w-4 h-4 mt-0.5  cursor-pointer mr-1">{{ $t('general.transfer')
                            }}</router-link>
                    <router-link :to="{ name: 'ViewServicesMainnetSwap' }"
                        class="bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center  "><img
                            src="@/assets/img/navi/icon-swap.svg" class="w-4 h-4 inline-block relative mr-1">{{
                                $t('general.swap') }}</router-link>
                    <router-link :to="{ name: 'ViewServicesAssetsCreate' }"
                        class="bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center"><img
                            src="@/assets/img/icon-plus.svg" class="inline-block w-4 h-4 mr-2">{{ $t('asset.createNewAsset')
                            }}</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { effectScope,  ref, watch } from "vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { Helper } from '@/util/typeHelper';
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { AppState } from "@/state/appState";
import { Address, MosaicId } from "tsjs-xpx-chain-sdk";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { networkState } from "@/state/networkState";
import AssetAction from "../components/AssetAction.vue";

const p = defineProps({
    address: String
})

const displayTokenName = (name: string) => {
    if (name == 'prx.xpx') {
        return { name: 'XPX', registered: true }
    } else if (name == 'prx.metx') {
        return { name: 'METX', registered: true }
    } else if (name == 'xarcade.xar') {
        return { name: 'XAR', registered: true }
    } else {
        return { name: name, registered: false }
    }
}

const lazyParams = ref<{ page: number, rows: number }>({
    page: 0,
    rows: 10
})

const dt = ref()

interface Asset {
    i: number,
    id: string,
    amount: string,
    name: string,
    isCreator: boolean,
    isLoaded: boolean

}

const updateRow = (rows: number) => {
    lazyParams.value.rows = rows
}

const assets = ref<Asset[]>([])

const explorerLink = (assetId: string) => {
    if (!networkState.currentNetworkProfile) {
        return ''
    }
    return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.assetInfoRoute + '/' + assetId
}


const fetchAssets = async () => {
    try {
        const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(p.address))
        return accInfo.mosaics.map((asset, index) => {
            return {
                i: index,
                id: asset.id.toHex(),
                amount: asset.amount.compact().toString(),
                name: "",
                isCreator: false,
                isLoaded: false
            }
        })
    } catch (_) {
        return <Asset[]>[]
    }
}

const scope = effectScope()

const loading = ref(false)

scope.run(() => {
    const hasTriggered = ref(false)
    const stopWatch = watch(AppState, async n => {
        if (n.isReady && !hasTriggered.value) {
            loading.value = true;
            assets.value = await fetchAssets()
            hasTriggered.value = true
            lazyLoad()
            loading.value = false;

            stopWatch()
            scope.stop()

        }
    }, { immediate: true })

})

const onPage = (event: { page: number, pageCount: number, rows: number }) => {
    const { page, rows } = event
    lazyParams.value = {
        page: page,
        rows: rows
    }
    lazyLoad()
};

const lazyLoad = async () => {
    loading.value = true;
    const { page, rows } = lazyParams.value
    const assetIds: MosaicId[] = []
    for (let i = 0; i < rows; i++) {
        const index = (page * rows) + (i)
        if (!assets.value[index]) {
            continue;
        }
        if (assets.value[index].isLoaded) {
            continue;
        }
        const asset = assets.value[index]
        assetIds.push(new MosaicId(asset.id))
    }
    if (!assetIds.length) {
        loading.value = false;

        return
    }
    const names = await AppState.chainAPI.assetAPI.getMosaicsNames(assetIds)
    const assetProperties = await AppState.chainAPI.assetAPI.getMosaics(assetIds)

    const assetIdToIndexMap: { [key: string]: number } = {};
    assetIds.forEach((asset, index) => {
        assetIdToIndexMap[asset.toHex()] = index;
    });

    assetProperties.sort((a, b) => {
        const indexA = assetIdToIndexMap[a.mosaicId.toHex()];
        const indexB = assetIdToIndexMap[b.mosaicId.toHex()];
        return indexA - indexB;
    });

    for (let i = 0; i < assetIds.length; i++) {

        const findAsset = assets.value.find(asset => asset.id == assetIds[i].toHex())
        findAsset.name = names[i].names[0]?.name ?? '-'
        findAsset.amount = Helper.toCurrencyFormat(parseFloat(findAsset.amount) / Math.pow(10, assetProperties[i].divisibility), assetProperties[i].divisibility)
        findAsset.isCreator = assetProperties[i].owner.address.plain() == Address.createFromRawAddress(p.address).plain()
        findAsset.isLoaded = true;
    }


    loading.value = false;


}


</script>

<style>
.p-datatable,.p-datatable-thead {
    position: unset !important;
}
</style>