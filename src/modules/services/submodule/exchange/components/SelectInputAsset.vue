<template>
    <div>
        <Dropdown v-model=selectedAsset :style="{ 'width': '100%' }" :options=assetOptions :filter="true"
            :filterFields="['id', 'namespace']" emptyFilterMessage=" "
            :virtualScrollerOptions="{ lazy: true, onLazyLoad: onLazyLoad, showLoader: true, loading: loading, delay: 0, itemSize: 38 }"
            @change="selectAsset($event.value); $emit('update:modelValue', $event.value.value); $emit('select-asset', $event.value.value);">
            <template #value="slotProps">
                <div v-if="slotProps.value">
                    <div class='flex justify-between'>
                        <div class='flex flex-col ml-2 text-left'>
                            <div class='text-blue-primary font-semibold text-xxs uppercase' style="line-height: 9px;">
                                Selected Asset</div>
                            <div class='mt-1 text-tsm font-bold'>{{ displayAssetFullName(slotProps.value.namespace == "" ? slotProps.value.id :
                                slotProps.value.namespace )}}</div>
                        </div>
                        <div class='mt-1 text-tsm font-bold'>Balance: {{ slotProps.value.amount }}</div>
                    </div>
                </div>
            </template>
            <template #option="slotProps">
                <div class="account-item">
                    <div class='flex justify-between'>

                        <div class='mt-1 text-tsm font-bold'>{{ displayAssetFullName(slotProps.option.namespace == "" ? slotProps.option.id :
                                slotProps.option.namespace )}}</div>
                        <div class='mt-1 text-tsm font-bold'>Balance: {{ slotProps.option.amount }}</div>
                    </div>
                </div>
            </template>
        </Dropdown>
    </div>
</template>
  
<script setup lang="ts">
import { AppState } from '@/state/appState';
import { VirtualScrollerLazyEvent } from 'primevue/virtualscroller';
import { Address, MosaicId } from 'tsjs-xpx-chain-sdk';
import { ref, getCurrentInstance, toRefs, watch, PropType } from 'vue';

const props = defineProps({
    selectedAddress: {
        type: String as PropType<string | null>,
        required: false
    },
    selectedMultisigAddress: {
        type: String as PropType<string | null>,
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

const { selectedAddress, selectedMultisigAddress } = toRefs(props);

const assetOptions = ref<{ id: string, amount: number, namespace: string, divisibility: number, isCreator: boolean, isTransferable: boolean, hasUpdated: boolean }[]>([])
const loading = ref(false);

const fetchAssets = async (address: string | null) => {
    if (!AppState.chainAPI) {
        return
    }
    if (!address) {
        return
    }
    selectAsset(null)
    assetOptions.value = [];

        const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(address))
    for (let i = 0; i < accInfo.mosaics.length; i++) {
        const asset = accInfo.mosaics[i];
        assetOptions.value.push({
            id: asset.id.toHex(),
            amount: asset.amount.compact(),
            divisibility: 0,
            namespace: '',
            isCreator: false,
            isTransferable: false,
            hasUpdated: false
        })
    } 
    
    
}

const selectedAsset = ref<{ id: string, amount: number, namespace: string, divisibility: number } | null>(null)




watch([selectedAddress, selectedMultisigAddress],([n,mn])=>{
    selectedAsset.value = null;
    //reload asset
    if(n != null && mn == null){
        fetchAssets(n)
    }else if(n!= null && mn!= null){
       
        fetchAssets(mn)
    }
})


const onLazyLoad = async (event: VirtualScrollerLazyEvent) => {
    if(loading.value){
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
        asset.amount = asset.amount / Math.pow(10, assetProperties[propertyIndex].divisibility)
        asset.divisibility = assetProperties[propertyIndex].divisibility
        asset.isCreator = selectedMultisigAddress.value? (selectedMultisigAddress.value === assetProperties[propertyIndex].owner.address.plain() ? true : false) : (selectedMultisigAddress.value === assetProperties[propertyIndex].owner.address.plain() ? true : false)
        asset.isTransferable = assetProperties[propertyIndex].isTransferable()
        asset.hasUpdated = true;

        nameIndex++
        propertyIndex++
    }


    loading.value = false;

}


const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;

const selectAsset = (asset: { id: string, amount: number, namespace: string, divisibility: number, isCreator: boolean, isTransferable: boolean }) => {
    emitter.emit("select-asset", asset)
    selectedAsset.value = asset;

};


</script>
  