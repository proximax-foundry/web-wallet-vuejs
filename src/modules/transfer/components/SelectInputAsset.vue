<template>
    <div>
        <Dropdown :showClear="true" v-model="selectedAssets[index]" :style="{ 'width': '100%' }" :options=assetWhiteList
            :filter="true" :filterFields="['id', 'namespace']" emptyFilterMessage=" " placeholder="Select Asset"
            :virtualScrollerOptions="{ lazy: true, onLazyLoad: onLazyLoad, showLoader: true, loading: loading, delay: 0, itemSize: 38 }"
            @change="selectAsset($event.value); $emit('update:modelValue', $event.value?.value);">
            <template #value="slotProps">
                <div v-if="slotProps.value.id">
                    <div class='flex justify-between'>
                        <div class='flex flex-col ml-2 text-left'>
                            <div class='text-blue-primary font-semibold text-xxs uppercase' style="line-height: 9px;">
                                Selected Asset</div>
                            <div class='mt-1 text-tsm font-bold'>{{ displayAssetFullName(slotProps.value.namespace == "" ?
                                slotProps.value.id :
                                slotProps.value.namespace) }}</div>
                        </div>
                        <div class='mt-1 text-tsm font-bold'>Balance: {{ slotProps.value.balance }}</div>
                    </div>
                </div>
            </template>
            <template #option="slotProps">
                <div class="account-item">
                    <div class='flex justify-between'>

                        <div class='mt-1 text-tsm font-bold'>{{ displayAssetFullName(slotProps.option.namespace == "" ?
                            slotProps.option.id :
                            slotProps.option.namespace) }}</div>
                        <div class='mt-1 text-tsm font-bold'>Balance: {{ slotProps.option.balance }}</div>
                    </div>
                </div>
            </template>
        </Dropdown>
    </div>
</template>
  
<script setup lang="ts">
import { AppState } from '@/state/appState';
import { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';
import {  MosaicId } from 'tsjs-xpx-chain-sdk';
import { ref, toRefs,  PropType, computed } from 'vue';

const props = defineProps({
    index: {
        type: Number,
        required: true
    },
    assetOptions: {
        type: Object as PropType<{ id: string, balance: number, namespace: string, divisibility: number, hasUpdated: boolean }[]>,
        required: true
    },
    selectedAssets: {
        type: Object as PropType<{ id: string, balance: number, amount: string, namespace: string, divisibility: number }[]>,
        required: false
    }
})

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

const displayAssetFullName = (name: string) => {
    const findKnownToken = knownToken.find(token => token.namespace == name)
    if (findKnownToken) {
        return findKnownToken.name
    }

    return name
}

defineEmits([
    'select-asset', 'update:modelValue'
])

const { assetOptions, selectedAssets, index } = toRefs(props);

const loading = ref(false);

const assetWhiteList = computed(() => {
    const selectedIdsSet = new Set(selectedAssets.value.map(asset => asset.id));

    return assetOptions.value.filter(asset => !selectedIdsSet.has(asset.id));
});



const onLazyLoad = async (event: VirtualScrollerLazyEvent) => {
    if (loading.value) {
        return
    }
    loading.value = true;

    const { first, last } = event;
    const selectedMosaicIds: MosaicId[] = []

    for (let i = first; i < last; i++) {
        if (assetOptions.value[i].hasUpdated) {
            continue;
        }
        selectedMosaicIds.push(new MosaicId(assetOptions.value[i].id))
    }
    if (!selectedMosaicIds.length) {
        loading.value = false;
        return
    }
    const names = await AppState.chainAPI.assetAPI.getMosaicsNames(selectedMosaicIds)
    const assetProperties = await AppState.chainAPI.assetAPI.getMosaics(selectedMosaicIds)

    let nameIndex = 0;
    let propertyIndex = 0;
    const indexMap = new Map<string, number>();
    names.forEach((mosaic, index) => {
        indexMap.set(mosaic.mosaicId.toHex(), index);
    });

    assetProperties.sort((a, b) => {
        const indexA = indexMap.get(a.mosaicId.toHex());
        const indexB = indexMap.get(b.mosaicId.toHex());
        return indexA - indexB;
    });

    for (let i = first; i < last; i++) {
        if (!names[nameIndex]) {
            continue;
        }
        const asset = assetOptions.value.find(asset => asset.id == names[nameIndex].mosaicId.toHex())
        if (!asset) {
            continue;
        }
        asset.namespace = names[nameIndex].names.length ? names[nameIndex].names[0].name : '';
        asset.balance = asset.balance / Math.pow(10, assetProperties[propertyIndex].divisibility)
        asset.divisibility = assetProperties[propertyIndex].divisibility
        asset.hasUpdated = true;

        nameIndex++
        propertyIndex++
    }


    loading.value = false;

}

const selectAsset = (asset: { id: string, balance: number, namespace: string, divisibility: number }) => {
    if (asset == null) {
        selectedAssets.value.splice(index.value, 1)

        return
    }
    selectedAssets.value[index.value].balance = asset.balance
    selectedAssets.value[index.value].id = asset.id
    selectedAssets.value[index.value].namespace = asset.namespace
    selectedAssets.value[index.value].divisibility = asset.divisibility
    selectedAssets.value[index.value].amount = '0'


};



</script>
  