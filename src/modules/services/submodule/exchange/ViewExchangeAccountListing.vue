<template>
    <div>
        <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5 border-2 p-3">
            <div class="border border-blue-300 rounded-md p-3 mt-3 bg-blue-50">
                <div class="flex items-center gap-2">
                    <div v-html="svgString"></div>
                    <div class="flex flex-col gap-0.5">
                        <div class="uppercase text-xxs text-blue-primary">Selected Account</div>
                        <div class="font-semibold">{{ accountName }}</div>
                    </div>
                </div>
            </div>
            <div class="ml-4 my-3">SDA Offers</div>
            <DataTable :value="accountSdaExchanges" :paginator="true" :rows="10" responsiveLayout="scroll"
                scrollDirection="horizontal" :alwaysShowPaginator="false"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" class="w-full">
                <template #empty>
                    No exchanges found.
                </template>
                <Column field="deadline" header="Deadline"></Column>
                <Column field="give" header="Give">
                    <template #body="{ data }">
                        <div class="flex">
                            <div class="mr-1">{{ data.giveAmount }}</div>
                            <div class="text-blue-primary">{{ data.pair.split('/')[0] }}</div>
                        </div>

                    </template>
                </Column>
                <Column field="get" header="Get">
                    <template #body="{ data }">
                        <div class="flex">
                            <div class="mr-1">{{ data.getAmount }}</div>
                            <div class="text-blue-primary">{{  data.pair.split('/')[1]  }}</div>
                        </div>

                    </template>
                </Column>
                <Column header="Action">
                    <template #body="{ data }">
                        <router-link :to="{  name: 'ViewExchangeRemove', query: { p: data.idPair, o: address }}">
                            <button class="blue-btn py-2 px-3 ">Remove</button>
                        </router-link>

                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AppState } from '@/state/appState';
import { lastValueFrom } from 'rxjs';
import { Address, ExchangeSdaHttp, SdaOfferInfo } from 'tsjs-xpx-chain-sdk';
import { watch, ref, computed, getCurrentInstance } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { walletState } from '@/state/walletState';
import { ThemeStyleConfig } from '@/models/stores';
import { toSvg } from 'jdenticon';

const props = defineProps({
    address: {
        type: String,
        required: true
    }
})

interface SdaExchangeWithDivisibilityAndNamespace extends SdaOfferInfo {
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


const displayAssetName = (name: string) => {
    const findKnownToken = knownToken.find(token => token.namespace == name)
    if (findKnownToken) {
        return findKnownToken.name
    }
    return name
}
const accountName = computed(() => {
    return walletState.currentLoggedInWallet.convertAddressToName(props.address, true)
})

const themeConfig: any = new ThemeStyleConfig('ThemeStyleConfig');
themeConfig.init();
const svgString = computed(() => toSvg(props.address, 40, themeConfig.jdenticonConfig))

const accountSdaExchanges = ref<{ idPair:string,deadline: string, giveAmount: number, getAmount: number, pair: string }[]>([])

const fetchListing = async () => {
    let listingInfo: SdaExchangeWithDivisibilityAndNamespace[] = []
    const sdaExchangeHttp = new ExchangeSdaHttp(AppState.nodeFullURL)
    const sdaExchanges = await lastValueFrom(sdaExchangeHttp.getAccountSdaExchangeOffers(Address.createFromRawAddress(props.address)))
    listingInfo = sdaExchanges.sdaOfferBalances
    for (let i = 0; i < listingInfo.length; i++) {

        const namespaceInfo = await AppState.chainAPI.assetAPI.getMosaicsNames([listingInfo[i].mosaicIdGet, listingInfo[i].mosaicIdGive])
        const assetInfo = await AppState.chainAPI.assetAPI.getMosaics([listingInfo[i].mosaicIdGet, listingInfo[i].mosaicIdGive])
        listingInfo[i].mosaicGetName = namespaceInfo[0].names.length ? namespaceInfo[0].names[0].name : listingInfo[i].mosaicIdGet.toHex()
        listingInfo[i].mosaicGiveName = namespaceInfo[1].names.length ? namespaceInfo[1].names[0].name : listingInfo[i].mosaicIdGive.toHex()
        listingInfo[i].mosaicGetDivisibility = assetInfo.find(info => info.mosaicId.toHex() == listingInfo[i].mosaicIdGet.toHex()).divisibility
        listingInfo[i].mosaicGiveDivisibility = assetInfo.find(info => info.mosaicId.toHex() == listingInfo[i].mosaicIdGive.toHex()).divisibility
    }
    const currentHeight = await AppState.chainAPI.chainAPI.getBlockchainHeight()
    accountSdaExchanges.value = listingInfo.map(offer => {
        return {
            idPair: `${offer.mosaicIdGive.toHex()}/${offer.mosaicIdGet.toHex()}`,
            pair: `${displayAssetName(offer.mosaicGiveName)}/${displayAssetName(offer.mosaicGetName)} `,
            giveAmount: offer.initialMosaicGiveAmount.compact() / Math.pow(10, offer.mosaicGiveDivisibility),
            getAmount: offer.initialMosaicGetAmount.compact() / Math.pow(10, offer.mosaicGetDivisibility),
            deadline: new Date(Date.now() + ((offer.deadline.compact() - currentHeight) * 15000)).toLocaleString(),
        }
    })
}

const stopWatch = watch(AppState, async n => {
    if (n.isReady) {
        await fetchListing()
        stopWatch()
    }
}, { immediate: true })

</script>