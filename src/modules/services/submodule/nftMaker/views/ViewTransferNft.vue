<template>
    <div class="mx-12 md:mx-36 lg:mx-60 xl:mx-84 pt-8">
        <div class="font-semibold dark:text-white">Transfer Item</div>
        <div class="mt-2 dark:text-white">Sender</div>
        <div class=" text-blue-600">{{senderAddress}}</div>
        <div class="mt-2 dark:text-white">Selected Asset ID</div>
        <div class=" text-blue-600">{{assetId}}</div>
        <div class="mt-2 dark:text-white">Recipient</div>
        <div class="flex border border-black dark:bg-white justify-between px-3 py-1.5 items-center">
            <input type="text"  v-model="recipientAddress" placeholder="Address/Namespace" v-debounce:4000="checkRecipient()" class="w-full focus:outline-none">
            <img v-if="!isValidAddress" src="@/modules/services/submodule/nftMaker/img/icon-red-x.svg" class="h-5 w-5 ml-3">
            <img v-else src="@/modules/services/submodule/nftMaker/img/icon-green-tick.svg" class="h-5 w-5 ml-3">
        </div>
        <div class="mt-2 dark:text-white">Message</div>
        <textarea type="text " v-model="message" placeholder="Send a message" class="w-full px-3  py-1.5 mt-1 border focus:outline-none border-black"></textarea>
        <div v-if="isValidEncryption">
            <input type="checkbox" v-model="encrypted">
            <label class="ml-2">Encrypt Message</label>
        </div>
        <div class="h-3 text-red-500" v-if="msgErr">{{msgErr}}</div>
        <button class="dark:bg-blue-600 flex px-5 ml-auto mr-auto mt-2 py-1.5 bg-blue-600 text-white rounded-md disabled:opacity-50" :disabled="disabledTransfer" @click="transfer()">Transfer</button>

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
import { AccountHttp, Address, AggregateBondedTransactionBuilder, Convert, Deadline, Mosaic, MosaicId, NamespaceHttp, NamespaceId, NetworkType, PlainMessage, PublicAccount, TransferTransactionBuilder, UInt64 } from 'tsjs-xpx-chain-sdk';
import { computed, getCurrentInstance, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import QRCode from "qrcode"

    //property passed from parent page
    const props = defineProps({
        assetId: String
    })
    
    //initialize variables
    const testnetUrl = 'https://api-2.testnet2.xpxsirius.io'
    const addressPatternShort = "^[0-9A-Za-z]{40}$";
    const addressPatternLong = "^[0-9A-Za-z-]{46}$";
    const toggleModal = shallowRef(false)
    const qr = shallowRef('')
    const publicKey = shallowRef('') 
    const encrypted = shallowRef(false)
    const msgErr = shallowRef('')
    const isValidAddress = shallowRef(false)
    const recipientAddress = shallowRef('')
    const senderAddress = shallowRef('')
    const message = shallowRef('')
    const isValidEncryption = shallowRef(false)
    const internalInstance = getCurrentInstance() 
    const emitter = internalInstance!.appContext.config.globalProperties.emitter
    const router = useRouter()

    //check address encryptable, is recipient input valid, is recipient valid to encrypt msg
    watch(recipientAddress,n=>{
        checkEncryptable(n);
        if(n.length==40 || n.length==46){
            checkEncryptable(n);
            checkRecipient()
        }else{
            isValidAddress.value = false
        }
    })
    const checkRecipient = async() =>{
        try {
            let address = Address.createFromRawAddress(recipientAddress.value);
            let networkOk = address.networkType == NetworkType.TEST_NET 
            if(!networkOk){
                isValidAddress.value = false;
            }
            else{
                checkEncryptable(recipientAddress.value);
                isValidAddress.value = true;
            }
        } catch (error) {
            try{
                let namespaceId = new NamespaceId(recipientAddress.value);
                const address = await checkNamespace(namespaceId)
                if(address){
                    recipientAddress.value = address.plain();
                    isValidAddress.value = true;
                    checkEncryptable(recipientAddress.value);
                }else{
                    isValidAddress.value = false;
                }
            }
            catch(error){
                isValidAddress.value = false;
            }
        }
    }
    const checkEncryptable = (address :string) =>{
        // show and hide encrypted message option
        if (address.match(addressPatternLong) || address.match(addressPatternShort)) {
            verifyPublicKey(address)
        } else {
            isValidEncryption.value = false
            isValidAddress.value = false
        }
    }
    const checkNamespace = async (namespaceId :NamespaceId)=>{
        const namespaceHttp = new NamespaceHttp(testnetUrl)
        return await namespaceHttp.getLinkedAddress(namespaceId).toPromise()
    }

    const verifyPublicKey = async(address: string) => {
        const invalidPublicKey = '0'.repeat(64)
        const accountHttp = new AccountHttp(testnetUrl)
        try {
            let accInfo = await accountHttp.getAccountInfo(Address.createFromRawAddress(address)).toPromise()
            if(accInfo.publicKey == invalidPublicKey){
                isValidEncryption.value = false
            }else{
                isValidEncryption.value = true
            }
        } catch (error) {
            isValidEncryption.value = false
        }
    }

    //check if msg exceeds 1kb(1024 bytes)
    watch(message,n=>{
        let tempHexData = Convert.utf8ToHex(n)
        let hexDataBytes = tempHexData.length / 2
        if(hexDataBytes>1024){
            msgErr.value = 'Message limit is 1024 bytes'
        }else{
            msgErr.value = ''
        }
    })

    //define when transfer button is disabled
    const disabledTransfer = computed(()=>{
        return !isValidAddress.value  || msgErr.value != '' || publicKey.value == ''
    })
    //transfer asset
    const transfer = async() =>{
        if(props.assetId==undefined){
            return
        }
        const publicAccount = PublicAccount.createFromPublicKey(publicKey.value,NetworkType.TEST_NET)
        const accountHttp = new AccountHttp(testnetUrl)
        const multisigInfo = await accountHttp.getMultisigAccountInfo(publicAccount.address).toPromise()
        const isMultisig = multisigInfo.cosignatories.length>0
        let msg = PlainMessage.create(message.value); 

        let transferBuilder = new TransferTransactionBuilder()
        let transferTx= transferBuilder
        .recipient(Address.createFromRawAddress(recipientAddress.value))
        .mosaics([new Mosaic(new MosaicId(props.assetId),UInt64.fromUint(1))])
        .message(msg)
        .networkType(NetworkType.TEST_NET)
        .build()

        let aggregateBondedBuilder = new AggregateBondedTransactionBuilder() 
        let aggregateBondedTx = aggregateBondedBuilder
        .deadline(Deadline.create())
        .innerTransactions([transferTx.toAggregate(publicAccount)])
        .networkType(NetworkType.TEST_NET)
        .build()
        const data = {
            payload: isMultisig?aggregateBondedTx.serialize():transferTx.serialize(),
            type:'sign',
            generationHash: "56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9", //testnet2
            encrypted: encrypted.value,
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
            senderAddress.value = PublicAccount.createFromPublicKey(n,NetworkType.TEST_NET).address.pretty()
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