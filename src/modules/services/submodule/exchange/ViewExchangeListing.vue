<template>
    <div>
        <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5 border-2 p-3">
            <div class='flex text-xs flex-wrap font-semibold  gap-3 mb-3'>
                <button @click="selected = 'xpx'"
                    :class="`${selected == 'xpx' ? 'border-b-2  text-blue-primary border-blue-primary' : ''}`"
                    class='w-12 text-center py-3 word-break'>XPX</button>
                <button @click="selected = 'metx'"
                    :class="`${selected == 'metx' ? 'border-b-2  text-blue-primary border-blue-primary' : ''}`"
                    class='w-12 text-center py-3 word-break'>METX</button>
                <!-- <button @click="selected = 'others'"
                    :class="`${selected == 'others' ? 'border-b-2  text-blue-primary border-blue-primary' : ''}`"
                    class='w-12 text-center py-3 word-break'>OTHERS</button> -->

            </div>
            <DataTable :value="allListings" :paginator="true" :rows="10" responsiveLayout="scroll"
                scrollDirection="horizontal" :alwaysShowPaginator="false"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" class="w-full "  >
                <template #empty>
                    No exchanges found.
                </template>
                <Column field="deadline" header="Deadline"></Column>

                <Column field="type" header="Type">
                    <template #body="{ data }">
                        <div :class="data.type == 'Sell' ? 'text-red-500' : 'text-green-500'">{{ data.type }}</div>
                    </template>
                </Column>
                <Column field="rate" header="Price">
                    <template #body="{ data }">
                        <div class="flex">
                            <div class="mr-1">{{ data.rate }}</div>
                            <div class="text-blue-primary">{{ data.pair }}</div>
                        </div>

                    </template>
                </Column>
                <Column field="giveAmount" header="SDA Amount">
                    <template #body="{ data }">
                        <div class="flex">
                            <div class="mr-1">{{ data.giveAmount }}</div>
                            <div class="text-blue-primary">{{ data.pair.split('/')[0] }}</div>
                        </div>

                    </template>
                </Column>
                <Column field="getAmount"  :header="`${selected.toUpperCase()} Amount`">
                    <template #body="{ data }">
                        <div class="flex">
                            <div class="mr-1">{{ data.getAmount }}</div>
                            <!-- <div class="text-blue-primary">{{  data.pair.split('/')[1]  }}</div> -->
                        </div>

                    </template>
                </Column>
                <Column field="owner" header="Maker">
                    <template #body="{ data }">
                        <div>{{ formatAddress(data.owner) }}</div>

                    </template>
                </Column>
                <Column header="Action">
                    <template #body="{ data }">
                        <router-link :to="{ name: 'ViewExchangeBuy', query: { p: data.idPair, o: data.owner } }">
                            <button class="blue-btn py-2 px-3 ">Exchange</button>
                        </router-link>

                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">

import { AppState } from '@/state/appState';
import { ExchangeSdaHttp, MosaicId, NamespaceId, SdaExchangeOfferType, SdaOfferInfoWithOwner } from 'tsjs-xpx-chain-sdk';
import { computed, ref, watch } from 'vue'
import { lastValueFrom } from 'rxjs';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

interface SdaExchangeWithDivisibilityAndNamespace extends SdaOfferInfoWithOwner {
    mosaicGiveDivisibility?: number,
    mosaicGetDivisibility?: number
    mosaicGiveName?: string,
    mosaicGetName?: string
}

const knownToken = [{
    namespace: "prx.xpx",
    name: "XPX"
},
{
    namespace: "prx.metx",
    name: "METX"
}, {
    namespace: "xarcade.xar",
    name: "XAR"
}];

const formatAddress = (address: string) => {
    return address.substring(0, 4) + '...' + address.substring(address.length - 4, address.length + 1)
}

const displayAssetName = (name: string) => {
    const findKnownToken = knownToken.find(token => token.namespace == name)
    if (findKnownToken) {
        return findKnownToken.name
    }

    return name.length == 16 ? name.substring(0, 4) + "..." : name
}

const selected = ref('xpx')
const sellExchange = ref<{ owner: string, idPair: string, deadline: string, pair: string, rate: number, giveAmount: number, getAmount: number }[]>([])
const buyExchange = ref<{ owner: string, idPair: string, deadline: string, pair: string, rate: number, giveAmount: number, getAmount: number }[]>([])
const fetchGetListing = async () => {
    let listingInfo: SdaExchangeWithDivisibilityAndNamespace[] = []
    let assetId: string
    if (selected.value == 'xpx') {
        assetId = AppState.nativeToken.assetId
    }
    if (selected.value == 'metx') {
        const id = await AppState.chainAPI.namespaceAPI.getLinkedMosaicId(new NamespaceId('prx.metx'))
        assetId = id.id.toHex()
    }
    const sdaExchangeHttp = new ExchangeSdaHttp(AppState.nodeFullURL)
    listingInfo = await lastValueFrom(sdaExchangeHttp.getExchangeSdaOffers(SdaExchangeOfferType.GET, new MosaicId(assetId)))
    for (let i = 0; i < listingInfo.length; i++) {
        const namespaceInfo = await AppState.chainAPI.assetAPI.getMosaicsNames([listingInfo[i].mosaicIdGet, listingInfo[i].mosaicIdGive])
        const assetInfo = await AppState.chainAPI.assetAPI.getMosaics([listingInfo[i].mosaicIdGet, listingInfo[i].mosaicIdGive])
        listingInfo[i].mosaicGetName = namespaceInfo[0].names.length ? namespaceInfo[0].names[0].name : listingInfo[i].mosaicIdGet.toHex()
        listingInfo[i].mosaicGiveName = namespaceInfo[1].names.length ? namespaceInfo[1].names[0].name : listingInfo[i].mosaicIdGive.toHex()
        listingInfo[i].mosaicGetDivisibility = assetInfo.find(info => info.mosaicId.toHex() == listingInfo[i].mosaicIdGet.toHex()).divisibility
        listingInfo[i].mosaicGiveDivisibility = assetInfo.find(info => info.mosaicId.toHex() == listingInfo[i].mosaicIdGive.toHex()).divisibility
    }

    const currentHeight = await AppState.chainAPI.chainAPI.getBlockchainHeight()
    sellExchange.value = listingInfo.map(info => {
        return {
            owner: info.owner.address.pretty(),
            idPair: `${info.mosaicIdGive.toHex()}/${info.mosaicIdGet.toHex()}`,
            deadline: new Date(Date.now() + ((info.deadline.compact() - currentHeight) * 15000)).toLocaleString(),
            pair: `${displayAssetName(info.mosaicGiveName)}/${displayAssetName(info.mosaicGetName)} `,
            giveAmount: info.currentMosaicGiveAmount.compact() / Math.pow(10, info.mosaicGiveDivisibility),
            getAmount: info.currentMosaicGetAmount.compact() / Math.pow(10, info.mosaicGetDivisibility),
            rate: (info.initialMosaicGiveAmount.compact() / Math.pow(10, info.mosaicGiveDivisibility)) / (info.initialMosaicGetAmount.compact() / Math.pow(10, info.mosaicGetDivisibility))
        }
    })
}

const fetchGiveListing = async () => {
    let listingInfo: SdaExchangeWithDivisibilityAndNamespace[] = []
    let assetId
    if (selected.value == 'xpx') {
        assetId = AppState.nativeToken.assetId
    }
    if (selected.value == 'metx') {
        const id = await AppState.chainAPI.namespaceAPI.getLinkedMosaicId(new NamespaceId('prx.metx'))
        assetId = id.id.toHex()
    }
    const sdaExchangeHttp = new ExchangeSdaHttp(AppState.nodeFullURL)
    listingInfo = await lastValueFrom(sdaExchangeHttp.getExchangeSdaOffers(SdaExchangeOfferType.GIVE, new MosaicId(assetId)))
    for (let i = 0; i < listingInfo.length; i++) {
        const namespaceInfo = await AppState.chainAPI.assetAPI.getMosaicsNames([listingInfo[i].mosaicIdGet, listingInfo[i].mosaicIdGive])
        const assetInfo = await AppState.chainAPI.assetAPI.getMosaics([listingInfo[i].mosaicIdGet, listingInfo[i].mosaicIdGive])
        listingInfo[i].mosaicGetName = namespaceInfo[0].names.length ? namespaceInfo[0].names[0].name : listingInfo[i].mosaicIdGet.toHex()
        listingInfo[i].mosaicGiveName = namespaceInfo[1].names.length ? namespaceInfo[1].names[0].name : listingInfo[i].mosaicIdGive.toHex()
        listingInfo[i].mosaicGetDivisibility = assetInfo.find(info => info.mosaicId.toHex() == listingInfo[i].mosaicIdGet.toHex()).divisibility
        listingInfo[i].mosaicGiveDivisibility = assetInfo.find(info => info.mosaicId.toHex() == listingInfo[i].mosaicIdGive.toHex()).divisibility
    }

    const currentHeight = await AppState.chainAPI.chainAPI.getBlockchainHeight()
    buyExchange.value = listingInfo.map(info => {
        return {
            owner: info.owner.address.pretty(),
            idPair: `${info.mosaicIdGet.toHex()}/${info.mosaicIdGive.toHex()}`,
            deadline: new Date(Date.now() + ((info.deadline.compact() - currentHeight) * 15000)).toLocaleString(),
            pair: `${displayAssetName(info.mosaicGetName)}/${displayAssetName(info.mosaicGiveName)} `,
            giveAmount: info.currentMosaicGiveAmount.compact() / Math.pow(10, info.mosaicGiveDivisibility),
            getAmount: info.currentMosaicGetAmount.compact() / Math.pow(10, info.mosaicGetDivisibility),
            rate: (info.initialMosaicGetAmount.compact() / Math.pow(10, info.mosaicGetDivisibility)) / (info.initialMosaicGiveAmount.compact() / Math.pow(10, info.mosaicGiveDivisibility))
        }
    })
}

const allListings = computed(() => {
   return [...sellExchange.value.map((info) => {
        return {
            type: 'Sell',
            owner: info.owner,
            idPair: info.idPair,
            deadline: info.deadline,
            pair: info.pair,
            giveAmount: info.giveAmount,
            getAmount: info.getAmount,
            rate: info.rate
        }
    }),

    ...buyExchange.value.map((info) => {
        return {
            type: 'Buy',
            owner: info.owner,
            idPair: info.idPair,
            deadline: info.deadline,
            pair: info.pair,
            giveAmount: info.giveAmount,
            getAmount: info.getAmount,
            rate: info.rate
        }
    })].sort((a,b)=> new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
})

watch(selected, async () => {
    await fetchGetListing()
    await fetchGiveListing()
})

const stopWatch = watch(AppState, async n => {
    if (n.isReady) {
        await fetchGetListing()
        await fetchGiveListing()
        stopWatch()
    }
}, { immediate: true })


</script>