<template>
    <div class="mx-12 justify-center pt-8">
        <div class="font-semibold  dark:text-white mb-2">My items</div>
        <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 items-center ">
            <div v-for="(asset, index) of assets" :key="index">
                <div class="flex flex-col ">
                    <router-link :to="`/nft-details/${asset.id}`">
                        <img class="img" :src="asset.image">
                    </router-link>
                    <div class="dark:text-white">{{ asset.name }}</div>
                    <div class="dark:text-white">Asset ID:</div>
                    <div class="dark:text-white break-all">{{ asset.id }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script setup lang="ts">
import { AccountHttp, Convert, MetadataHttp, MetadataQueryParams, MetadataType, MosaicHttp, MosaicId, NetworkType, PublicAccount } from 'tsjs-xpx-chain-sdk';
import { ref, watch } from 'vue';
import isValidUTF8 from 'utf-8-validate';;

const props = defineProps({
    publicKeys: {
        type: Array<{ publicKey: string }>,
        required: true
    }
})
const testnetUrl = 'https://api-2.testnet2.xpxsirius.io'
interface displayAsset {
    image: string,
    name: string,
    id: string
}

const assets = ref<displayAsset[]>([])

//functions to get convert utf8 from hex
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
    if (!isValidUTF8(Buffer.from(bytes))) {
        scopedMetadataKey = Convert.decodeHexToUtf8(scopedMetadataKey)
    }
    return scopedMetadataKey

}

//fetch nfts from account
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const fetchNft = async () => {
    if (!props.publicKeys) {
        return
    }
    else {
        if (props.publicKeys.length == 0) {
            assets.value = []
        } else {
            assets.value = []
            for (let j = 0; j < props.publicKeys.length; j++) {
                let dataPerRequest = 100
                let publicAccount = PublicAccount.createFromPublicKey(props.publicKeys[j]?.publicKey, NetworkType.TEST_NET)
                const accountHttp = new AccountHttp(testnetUrl)
                const metadataHttp = new MetadataHttp(testnetUrl)
                const mosaicHttp = new MosaicHttp(testnetUrl)
                const accountInfo = await accountHttp.getAccountInfo(publicAccount.address).toPromise()
                const mosaicIds: MosaicId[] = accountInfo.mosaics.map(mosaic => mosaic.id) //get all account mosaics
                let numOfRequest = Math.ceil(mosaicIds.length / dataPerRequest)
                let nftIds: string[] = [] //filter nft ids
                for (let i = 0; i < numOfRequest; i++) { //max 100 requests per api call
                    let startIndex = i * dataPerRequest
                    let endIndex = (i + 1) * dataPerRequest
                    let requestData = mosaicIds.slice(startIndex, endIndex)
                    let mosaicInfos = await mosaicHttp.getMosaics(requestData).toPromise()
                    let filteredMosaicInfos = mosaicInfos.filter(mosaicInfo => {
                        return mosaicInfo.supply.compact() == 1 &&
                            mosaicInfo.divisibility == 0 &&
                            mosaicInfo.isTransferable() == true &&
                            mosaicInfo.isSupplyMutable() == false
                    })
                    let tempNftHexIds = filteredMosaicInfos.map(mosaicInfo => mosaicInfo.mosaicId.id.toHex())

                    nftIds = nftIds.concat(tempNftHexIds)
                }
                let metadataQueryParams = new MetadataQueryParams()
                metadataQueryParams.metadataType = MetadataType.MOSAIC
                metadataQueryParams.pageSize = 100;
                metadataQueryParams.pageNumber = 1;
                metadataQueryParams.targetKey = props.publicKeys[j]?.publicKey
                let searchedMetadata = await metadataHttp.searchMetadata(metadataQueryParams).toPromise()
                for (let i = 0; i < searchedMetadata.metadataEntries.length; i++) {
                    let metadataEntry = searchedMetadata.metadataEntries[i]
                    if (convertUtf8(metadataEntry.scopedMetadataKey.toHex()) == 'nft.json') {
                        assets.value.push({
                            name: JSON.parse(metadataEntry.value).name,
                            image: JSON.parse(metadataEntry.value).image,
                            id: metadataEntry.targetId.toHex()
                        })
                    }
                }
                let totalPageNumber = searchedMetadata.pagination.totalPages
                await delay(250)
                for (let i = 2; i <= totalPageNumber; i++) {
                    let metadataQueryParams = new MetadataQueryParams()
                    metadataQueryParams.metadataType = MetadataType.MOSAIC
                    metadataQueryParams.pageSize = 100
                    metadataQueryParams.pageNumber = i;
                    metadataQueryParams.targetKey = props.publicKeys[j].publicKey
                    let searchedMetadata = await metadataHttp.searchMetadata(metadataQueryParams).toPromise()
                    for (let i = 0; i < searchedMetadata.metadataEntries.length; i++) {
                        let metadataEntry = searchedMetadata.metadataEntries[i]
                        if (convertUtf8(metadataEntry.scopedMetadataKey.toHex()) == 'nft.json') {
                            assets.value.push({
                                name: JSON.parse(metadataEntry.value).name,
                                image: JSON.parse(metadataEntry.value).image,
                                id: metadataEntry.targetId.toHex()
                            })
                        }
                        await delay(250)
                    }
                }
            }
        }
    }
}

watch(() => props.publicKeys?.length, () => {
    fetchNft()
})


</script>
    
<style scoped>
.img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    width: 200px;
    height: 150px;
}
</style>