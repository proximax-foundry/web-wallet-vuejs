<template>
<div class="mx-12 md:mx-36 lg:mx-60 xl:mx-84 pt-8">
    <div class="dark:text-white">Edit Existing Item</div>
    <div class="mt-2 dark:text-white">Selected Asset ID</div>
    <div class=" text-blue-600">{{assetId}}</div>
    <div class="mt-4 dark:text-white">Description</div>
    <textarea type="text " v-model="newDescription" placeholder="Prepare a detailed description of your item" class="w-full px-3  py-1.5 mt-1 border focus:outline-none border-black"></textarea>
    <div class="mt-4 dark:text-white mb-2">Properties</div>
    <div v-for="(attributeKey,index) of newAttributeKeys" :key="index" >
        <div class="flex gap-2 mb-2" >
            <img src="@/modules/services/submodule/nftMaker/img/icon-delete-red.svg" class="w-4 h-4 cursor-pointer mt-2.5" @click="removeProperty(index)">
            <div class="w-full">
                <TextInputVue placeholder="Property name" v-model="newAttributeKeys[index]" />
            </div>
            <div class="w-full">
                <TextInputVue placeholder="Property value" v-model="newAttributeValues[index]" />
            </div>
        </div>
    </div>
    <div class="text-blue-600 font-semibold w-[70px] text-xs mt-2 cursor-pointer dark:text-blue-600" @click="addProperty()">+ Add more</div>
    <!-- <div class="mt-4 dark:text-white">Royalties</div>
    <div class="my-2 text-gray-500 text-xs" >Collect a fee (XPX) when a user re-sells an item you created.</div>
    <NumberInput v-model="royalties" :decimal="6"/> -->
    <button @click="updateMetadataTxn()" class="dark:bg-blue-600 flex px-5 ml-auto mr-auto mt-3 py-1.5 bg-blue-600 text-white rounded-md disabled:opacity-50" :disabled="disabledUpdate">Update Item</button>
    <!--qr modal-->
    <transition enter-active-class="animate__animated animate__fadeInDown" leave-active-class="animate__animated animate__fadeOutUp">
        <div v-if="toggleModal" class="popup-outer-lang absolute flex z-50 ">
            <div class="modal-popup-box ">
                <div v-html="qr" class="w-8/12 ml-auto mr-auto py-3" />
                <div class="text-gray-500 ml-auto mr-auto w-8/12">Please scan the QR above with Sirius Mobile App to sign the transaction.</div>
                <div @click="toggleModal=false;qr=''" class="cursor-pointer flex justify-center my-3 bg-blue-600 dark:bg-blue-600 w-24 rounded-lg text-white py-1.5 ml-auto mr-auto">Close</div>
            </div>
        </div>
    </transition>
    <div @click="toggleModal=false;qr=''" v-if="toggleModal" class="fixed inset-0 opacity-50 bg-gray-600 dark:bg-[#171717] z-20"></div>
</div>
</template>
<script lang="ts" setup>
import { AccountHttp, AggregateBondedTransactionBuilder, AggregateCompleteTransactionBuilder, Convert, Deadline, InnerTransaction, MetadataHttp, MetadataQueryParams, MetadataType, MosaicId, MosaicLevy, MosaicMetadataTransactionBuilder, MosaicModifyLevyTransactionBuilder, NetworkType, PublicAccount, UInt64 } from 'tsjs-xpx-chain-sdk';
import { computed, getCurrentInstance, ref, shallowRef, watch } from 'vue';
import TextInputVue from '@/components/TextInput.vue';
import NumberInput from '@/components/NumberInput.vue';
import { useRouter } from 'vue-router';
import UTF8 from 'utf-8'
import QRCode from 'qrcode'

    //property passed from parent page
    const props = defineProps({
        assetId: String
    })
    
    //initialize variables
    const testnetUrl = 'https://api-2.testnet2.xpxsirius.io'
    const publicKey = shallowRef('')
    const internalInstance = getCurrentInstance() 
    const emitter = internalInstance!.appContext.config.globalProperties.emitter
    const router = useRouter()
    const newDescription = shallowRef('')
    const newAttributeKeys = ref([''])
    const newAttributeValues = ref([''])
    const oldValue = ref()
    /* const royalties = shallowRef('0') */
    const toggleModal = shallowRef(false)
    const qr = shallowRef('')
    //convert both array values into object keys and values
    
    const newValue = computed(()=>{ 
        return{
            name: oldValue.value?.name, 
            description: newDescription.value,
            image: oldValue.value?.image,  
            attributes: attributeObject.value
        }
    })

    const attributeObject = computed(() =>{
        return newAttributeKeys.value.reduce((key,value,index)=>{
            return {...key, [value]: newAttributeValues.value[index]};
        },{})
    })

    const disabledUpdate = computed(()=>{
        return JSON.stringify(oldValue.value) == JSON.stringify(newValue.value) || !newAttributeKeys.value.every(key=>key!='') || !newAttributeValues.value.every(value=>value!='')
    })

    //add and remove property
    const addProperty = () =>{
        newAttributeKeys.value.push('')
        newAttributeValues.value.push('')
    }

    const removeProperty = (i :number) => {
        newAttributeKeys.value.splice(i, 1);
        newAttributeValues.value.splice(i, 1)
    } 

    //functions to get convert utf8 from hex
    const removeDoubleZero = (string :string) =>{
        let isZero = string.endsWith('00')
        if(isZero){
            string = string.substring(0, string.length - 2);
            string = removeDoubleZero(string)
        }
        return string
    }

    const convertUtf8 = (scopedMetadataKey :string)=>{
        scopedMetadataKey =  removeDoubleZero(scopedMetadataKey )
        let bytes = Convert.hexToUint8(scopedMetadataKey ); 
        if(!UTF8.isNotUTF8(bytes)){
            scopedMetadataKey  = Convert.decodeHexToUtf8(scopedMetadataKey)
        }
        return scopedMetadataKey
        
    }

    //fetch existing description and properties
    const fetchCurrentMetadata = async() =>{
        if(props.assetId == undefined){
            return
        }
        let publicAccount = PublicAccount.createFromPublicKey(publicKey.value,NetworkType.TEST_NET)
        const metadataHttp = new MetadataHttp(testnetUrl) 
        let metadataQueryParams = new MetadataQueryParams()  
        try {
            metadataQueryParams.metadataType = MetadataType.MOSAIC 
            metadataQueryParams.targetKey = publicAccount
            metadataQueryParams.targetId = new MosaicId(props.assetId)
        } catch (error) {
            router.push('/view-nft')
        }
        let searchedMetadata = await metadataHttp.searchMetadata(metadataQueryParams).toPromise() 
        let metadataEntry = searchedMetadata.metadataEntries[0]
        if(!metadataEntry){
            router.push('/view-nft')
        }
        if(convertUtf8(metadataEntry.scopedMetadataKey.toHex()) == 'nft.json'){
            oldValue.value = JSON.parse(metadataEntry.value)
            newDescription.value = oldValue.value.description
            newAttributeKeys.value =  Object.keys(oldValue.value.attributes).map((key)=> {
                return key 
            })
            newAttributeValues.value = Object.keys(oldValue.value.attributes).map((key)=> {
                return oldValue.value.attributes[key] 
            })
        }
    }

    //update metadata txn
    const updateMetadataTxn = async() =>{
        if(!props.assetId){
            return
        }
        const publicAccount = PublicAccount.createFromPublicKey(publicKey.value,NetworkType.TEST_NET)
        const accountHttp = new AccountHttp(testnetUrl) 
        const multisigInfo = await accountHttp.getMultisigAccountInfo(publicAccount.address).toPromise()
        const isMultisig = multisigInfo.cosignatories.length>0
        const mosaicMetadataBuilder = new MosaicMetadataTransactionBuilder() 
        const mosaicMetadataTx = mosaicMetadataBuilder
        .deadline(Deadline.create())
        .targetPublicKey(publicAccount)
        .targetMosaicId(new MosaicId(props.assetId)) 
        .scopedMetadataKey(UInt64.fromHex(Convert.utf8ToHex('nft.json'))) 
        .value(JSON.stringify(newValue.value))
        .oldValue(JSON.stringify(oldValue.value)) 
        .calculateDifferences()
        .networkType(NetworkType.TEST_NET)
        .build()

        /* const mosaicLevyBuilder = new MosaicModifyLevyTransactionBuilder()
        const mosaicLevyTx = mosaicLevyBuilder
        .deadline(Deadline.create())
        .mosaicId(new MosaicId(props.assetId)) 
        .mosaicLevy(
            MosaicLevy.createWithAbsoluteFee(
                publicAccount.address,
                new MosaicId('13bfc518e40549d7'), 
                parseFloat(royalties.value)*Math.pow(10,6)
            )
        )
        .networkType(NetworkType.TEST_NET)
        .build() */ 

        let innerTx :InnerTransaction[] = [mosaicMetadataTx.toAggregate(publicAccount)] 
        
        /* if(parseFloat(royalties.value)>0){
            innerTx.push(mosaicLevyTx.toAggregate(publicAccount))
        } */
        let aggregateTxBuilder :AggregateBondedTransactionBuilder | AggregateCompleteTransactionBuilder
        aggregateTxBuilder = isMultisig? new AggregateBondedTransactionBuilder() : new AggregateCompleteTransactionBuilder()
        const aggregateTx = aggregateTxBuilder
        .deadline(Deadline.create())
        .innerTransactions(innerTx)
        .networkType(NetworkType.TEST_NET)
        .build()
        
        const data = {
            payload:aggregateTx.serialize(),
            type:'sign',
            generationHash: "56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9", //testnet2
            callbackUrl: null
        } 
        qr.value = await QRCode.toString(JSON.stringify(data))
        toggleModal.value = true
    }

    //get public key from session storage
    const fetchSessionStorage = () =>{
    const searchStorage = sessionStorage.getItem('userPublicKey') 
        if(searchStorage!=null){
            publicKey.value = PublicAccount.createFromPublicKey(searchStorage, NetworkType.TEST_NET).publicKey
        }else{
            publicKey.value = ""  
        }
    }

    fetchSessionStorage()

    //listens to wallet connection events, update publicKey
    emitter.on('Mobile Wallet Connected',()=>{
        fetchSessionStorage()
    })

    emitter.on('Mobile Wallet Disconnected',()=>{
        fetchSessionStorage()
    })

    //check if wallet is connected
    watch(publicKey,n=>{ 
        if(n.length){
            fetchCurrentMetadata()
        }else{
            router.push('/view-nft')
        }
    },{immediate:true}) 

</script>

<style scoped>
.popup-outer-lang{
  top: 80px; left: 0; right: 0; margin-left: auto; margin-right: auto; max-width: 500px;
}
.modal-popup-box{
  @apply transition ease-in duration-300 w-[500px] bg-white shadow-xl rounded-2xl ;
}
</style>