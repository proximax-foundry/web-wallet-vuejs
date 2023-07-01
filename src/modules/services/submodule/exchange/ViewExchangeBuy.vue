<template>
    <div>
        <div class='border-2 xl:grid xl:grid-cols-3'>
            <div class="xl:col-span-2 p-12">
                <div>SDA-SDA Exchange - Buy</div>
                <div v-if="!selectedAddress" class="text-xs mt-3 text-blue-primary ">Select Account to Create / Initiate
                    Transaction</div>
                <SelectInputAccount />
                <SelectInputMultisigAccount class="md:mt-3 " :selected-address="selectedAddress" />
                <div class="mt-3 text-blue-primary">Account Balance</div>
                <div>{{ getAssetBalance }} {{ displayAssetName(offerInfo?.mosaicGetName) }}</div>
                <div class="text-blue-primary mt-3">Exchange Rate</div>
                <div> 1 {{ displayAssetName(offerInfo?.mosaicGetName) }} = {{ rate }} {{
                    displayAssetName(offerInfo?.mosaicGiveName) }}</div>



                <!-- <div class="text-blue-primary mt-3">Available {{ displayAssetName(offerInfo?.mosaicGetName) }} amount</div>
                <div>{{ offerInfo?.currentMosaicGetAmount.compact() / Math.pow(10, offerInfo?.mosaicGetDivisibility) }} {{
                    displayAssetName(offerInfo?.mosaicGetName) }}</div> -->
                <div class="text-blue-primary mt-3">Amount to give ({{ displayAssetName(offerInfo?.mosaicGetName) }}) </div>

                <InputAmount placeholder="Asset Amount" v-model="amountToPay"
                    :decimal="offerInfo?.mosaicGetDivisibility ?? 0" />

                <div class="text-blue-primary mt-3">Amount to receive ({{ displayAssetName(offerInfo?.mosaicGiveName) }} )
                </div>

                <InputAmount placeholder="Asset Amount" v-model="amountToBuy"
                    :decimal="offerInfo?.mosaicGiveDivisibility ?? 0" />

            </div>
            <div class='bg-navy-primary py-6 px-6 xl:col-span-1'>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AppState } from '@/state/appState';
import { useToast } from 'primevue/usetoast';
import { lastValueFrom } from 'rxjs';
import { Address, ExchangeSdaHttp, MosaicId, SdaOfferInfo } from 'tsjs-xpx-chain-sdk';
import { getCurrentInstance, ref, watch } from 'vue';
import InputAmount from './components/InputAmount.vue';
import SelectInputAccount from './components/SelectInputAccount.vue';
import SelectInputMultisigAccount from './components/SelectInputMultisigAccount.vue';

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

const amountToBuy = ref('0')
const amountToPay = ref('0')

const internalInstance = getCurrentInstance();

const emitter = internalInstance.appContext.config.globalProperties.emitter;

const selectedAddress = ref<string | null>(null)

const selectedMultisigAddress = ref<string | null>(null)

emitter.on("select-account", (address: string) => {
    selectedAddress.value = address
})

emitter.on("select-multisig-account", (address: string) => {
    selectedMultisigAddress.value = address

})

const displayAssetName = (name: string) => {
    const findKnownToken = knownToken.find(token => token.namespace == name)
    if (findKnownToken) {
        return findKnownToken.name
    }
    return name
}

interface SdaOfferWithDivisibilityAndNamespace extends SdaOfferInfo {
    mosaicGiveDivisibility?: number,
    mosaicGetDivisibility?: number
    mosaicGiveName?: string,
    mosaicGetName?: string
}

const props = defineProps({
    owner: String,
    pair: String
})

const offerInfo = ref<SdaOfferWithDivisibilityAndNamespace | null>(null)

const rate = ref(0)

const toast = useToast()

const giveAsset = props.pair.split('/')[0]

const getAsset = props.pair.split('/')[1]

const getAssetBalance = ref(0)

const fetchExchange = async () => {

    if (!giveAsset || !getAsset) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Invalid",
            group: 'br-custom',
            life: 1000
        });
        return;
    }
    const sdaExchangeHttp = new ExchangeSdaHttp(AppState.nodeFullURL)
    const accountExchangeOffers = await lastValueFrom(sdaExchangeHttp.getAccountSdaExchangeOffers(Address.createFromRawAddress(props.owner)))
    offerInfo.value = accountExchangeOffers.sdaOfferBalances.find(offer => offer.mosaicIdGive.toHex() == giveAsset && offer.mosaicIdGet.toHex() == getAsset)
    if (!offerInfo.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Offer not found",
            group: 'br-custom',
            life: 1000
        });
        return;
    }
    const namespaceInfo = await AppState.chainAPI.assetAPI.getMosaicsNames([offerInfo.value.mosaicIdGet as MosaicId, offerInfo.value.mosaicIdGive as MosaicId])
    const assetInfo = await AppState.chainAPI.assetAPI.getMosaics([offerInfo.value.mosaicIdGet as MosaicId, offerInfo.value.mosaicIdGive as MosaicId])
    offerInfo.value.mosaicGetName = namespaceInfo[0].names.length ? namespaceInfo[0].names[0].name : offerInfo.value.mosaicIdGet.toHex()
    offerInfo.value.mosaicGiveName = namespaceInfo[1].names.length ? namespaceInfo[1].names[0].name : offerInfo.value.mosaicIdGive.toHex()
    offerInfo.value.mosaicGetDivisibility = assetInfo.find(info => info.mosaicId.toHex() == offerInfo.value.mosaicIdGet.toHex()).divisibility
    offerInfo.value.mosaicGiveDivisibility = assetInfo.find(info => info.mosaicId.toHex() == offerInfo.value.mosaicIdGive.toHex()).divisibility
    rate.value = (offerInfo.value.initialMosaicGiveAmount.compact() / Math.pow(10, offerInfo.value.mosaicGiveDivisibility))/ (offerInfo.value.initialMosaicGetAmount.compact() / Math.pow(10, offerInfo.value.mosaicGetDivisibility)) 
}

const fetchGetAssetBalance = async (address: string) => {
    const accountInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(address))
    const findAsset = accountInfo.mosaics.find(asset => asset.id.toHex() == offerInfo.value.mosaicIdGet.toHex())
    if (!findAsset) {
        getAssetBalance.value = 0
        return
    }
    getAssetBalance.value = findAsset.amount.compact() / Math.pow(10, offerInfo.value.mosaicGetDivisibility)
}

watch([selectedAddress, selectedMultisigAddress], ([n, mn]) => {
    getAssetBalance.value = 0
    //reload asset
    if (n != null && mn == null) {
        fetchGetAssetBalance(n)
    } else if (n != null && mn != null) {

        fetchGetAssetBalance(mn)
    }
})

const stopWatch = watch(AppState, async (n, o) => {
    if (n.isReady) {
        await fetchExchange()
        stopWatch()
    }
}, { immediate: true })


</script>