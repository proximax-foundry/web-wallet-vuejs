<template>
<div class="lg:ml-60 mt-10 lg:mt-16 flex-grow px-5 pt-5">
    <div class="w-11/12 ml-auto mr-auto">
      <div class="flex">
        <div class='py-3 px-6 lg:flex items-center'>
          <div class="text-xl mr-2 mb-2">Create New item</div>
        </div>        
      </div>
    </div>
    <div v-if="!isConnected" class="text-center text-red-600 bg-red-300 rounded-lg ml-auto mr-auto w-52 py-1.5">Wallet is not connected</div>
    <div class='mt-2 py-3 '>
        <div class="w-11/12 ml-auto mr-auto border-2 p-2">
            <div class="mt-2 dark:text-white">Name</div>
            <TextInputVue placeholder="Name your item" v-model="name"/>
            <div class="mt-4 dark:text-white">Description</div>
            <textarea type="text " v-model="description" placeholder="Prepare a detailed description of your item" class="w-full px-3  py-1.5 mt-1 border focus:outline-none border-black"></textarea>
            <div class="mt-4 dark:text-white">External Link</div>
            <TextInputVue placeholder="https://yoursite.io/item/123"  v-model="externalLink"  />
            <div class="mt-4 dark:text-white">Properties</div>
            <div v-for="(attributeName,index) of attributeNames" :key="index" >
                <div class="flex gap-2 mb-2" >
                    <img src="@/modules/services/submodule/nftMaker/img/icon-delete-red.svg" class="w-4 h-4 cursor-pointer mt-2.5" @click="removeProperty(index)">
                    <div class="w-full">
                        <TextInputVue placeholder="Property name" errorMessage="More than 8 bytes." v-model="attributeNames[index]" />
                    </div>
                    <div class="w-full">
                        <TextInputVue placeholder="Property value" v-model="attributeValues[index]" />
                    </div>
                </div>
            </div>
            <div class="w-[80px] mt-2">
                <div class="text-blue-600 font-semibold text-xs cursor-pointer dark:text-blue-600 cursor-pointer" @click="addProperty()">+ Add more</div>
            </div>
            <!-- <div class="mt-4 dark:text-white">Royalties</div>
            <div class="my-2 text-gray-500 text-xs" >Collect a fee (XPX) when a user re-sells an item you created.</div>
            <NumberInput v-model="royalties" :decimal="6"/> -->
            <button @click="createItem()" class="dark:bg-blue-600 flex px-5 ml-auto mr-auto mt-3 py-1.5 bg-blue-600 text-white rounded-md disabled:opacity-50" :disabled="disabledCreate">Create Item</button>
            
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
    </div>
</div>
</template>

<script lang="ts" setup>
import {  computed, getCurrentInstance, shallowRef, watch, ref} from 'vue';
import TextInputVue from '@/components/TextInput.vue';
import NumberInput from '@/components/NumberInput.vue';
import { AccountHttp, AggregateBondedTransactionBuilder, AggregateCompleteTransactionBuilder, Convert, Deadline, InnerTransaction, MosaicDefinitionTransactionBuilder, MosaicId, MosaicLevy, MosaicMetadataTransactionBuilder, MosaicModifyLevyTransactionBuilder, MosaicNonce, MosaicProperties,MosaicSupplyChangeTransactionBuilder, MosaicSupplyType, NetworkType, PublicAccount, UInt64 } from 'tsjs-xpx-chain-sdk';
import QRCode from 'qrcode'

//initialize variables
const testnetUrl = 'https://api-2.testnet2.xpxsirius.io'
const name = shallowRef('')
const description = shallowRef('')
const externalLink = shallowRef('')
const attributeNames = ref(['']) 
const attributeValues = ref([''])
const royalties = shallowRef('0')
const toggleModal = shallowRef(false)
const publicKey = shallowRef('')
const qr = shallowRef('')
const isConnected = shallowRef(false)
const internalInstance = getCurrentInstance() 
const emitter = internalInstance!.appContext.config.globalProperties.emitter

//add and remove property
const addProperty = () =>{
    attributeNames.value.push('')
    attributeValues.value.push('')
}

const removeProperty = (i :number) => {
    attributeNames.value.splice(i, 1);
    attributeValues.value.splice(i, 1)
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
        isConnected.value= true
    }else{
        isConnected.value = false
    }
},{immediate:true})

//convert both array values into object keys and values
const getAttributeObject = () =>{
    return attributeNames.value.reduce((key,value,index)=>{
        return {...key, [value]: attributeValues.value[index]};
    },{})
}

//create button validation
const disabledCreate = computed(()=>{
    console.log(!attributeNames.value.every(name=>name!=''))
    return !attributeNames.value.every(name=>name!='') || !attributeValues.value.every(name=>name!='') || name.value=='' || externalLink.value == '' || publicKey.value == ''
})

//reset inputs
const resetInputs = () =>{
    name.value = ''
    description.value = ''
    externalLink.value = ''
    attributeNames.value = []
    attributeValues.value = []
    royalties.value = '0'
}

//create nft transaction
const createItem = async() =>{
    const newValue = {
        name: name.value, 
        description: description.value,
        image: externalLink.value,  
        attributes: getAttributeObject()
    }
    resetInputs()
    const publicAccount = PublicAccount.createFromPublicKey(publicKey.value,NetworkType.TEST_NET)
    const accountHttp = new AccountHttp(testnetUrl)
    const multisigInfo = await accountHttp.getMultisigAccountInfo(publicAccount.address).toPromise()
    const isMultisig = multisigInfo.cosignatories.length>0
    const assetDefinitionBuilder = new MosaicDefinitionTransactionBuilder()
    const nonce = MosaicNonce.createRandom(); 
    const assetDefinitionTx = assetDefinitionBuilder
    .deadline(Deadline.create())
    .mosaicNonce(nonce)
    .mosaicId(MosaicId.createFromNonce(nonce, publicAccount)) 
    .mosaicProperties( 
        MosaicProperties.create({
            supplyMutable: false, 
            transferable: true,
            divisibility: 0,
            duration: undefined
        })
    )
    .networkType(NetworkType.TEST_NET)
    .build();
    
    const assetSupplyChangeBuilder = new MosaicSupplyChangeTransactionBuilder()
    const assetSupplyChangeTx =  assetSupplyChangeBuilder
    .deadline(Deadline.create())
    .mosaicId(assetDefinitionTx.mosaicId)
    .direction(MosaicSupplyType.Increase)
    .delta(UInt64.fromUint(1))
    .networkType(NetworkType.TEST_NET)
    .build()

    const mosaicMetadataBuilder = new MosaicMetadataTransactionBuilder()
    const mosaicMetadataTx = mosaicMetadataBuilder
    .deadline(Deadline.create())
    .targetPublicKey(publicAccount)
    .targetMosaicId(assetDefinitionTx.mosaicId) 
    .scopedMetadataKey(UInt64.fromHex(Convert.utf8ToHex('nft.json')))
    .value(JSON.stringify(newValue))
    .oldValue('')
    .calculateDifferences()
    .networkType(NetworkType.TEST_NET)
    .build()

    const mosaicLevyBuilder = new MosaicModifyLevyTransactionBuilder()
    const mosaicLevyTx = mosaicLevyBuilder
    .deadline(Deadline.create())
    .mosaicId(assetDefinitionTx.mosaicId) 
    .mosaicLevy(
        MosaicLevy.createWithAbsoluteFee(
            publicAccount.address,
            new MosaicId('13bfc518e40549d7'), 
            parseFloat(royalties.value)*Math.pow(10,6)
        )
    )
    .networkType(NetworkType.TEST_NET)
    .build()

    let innerTx :InnerTransaction[]
    = [assetDefinitionTx.toAggregate(publicAccount),assetSupplyChangeTx.toAggregate(publicAccount),mosaicMetadataTx.toAggregate(publicAccount)] 
    
     
    if(parseFloat(royalties.value)>0){
        innerTx.push(mosaicLevyTx.toAggregate(publicAccount))
    }
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

</script>

<style scoped>
.popup-outer-lang{
  top: 80px; left: 0; right: 0; margin-left: auto; margin-right: auto; max-width: 500px;
}
.modal-popup-box{
  @apply transition ease-in duration-300 w-[500px] bg-white shadow-xl rounded-2xl ;
}
</style>