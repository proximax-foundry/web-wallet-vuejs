<template>
    <div class='w-10/12 ml-auto mr-auto mt-5'>
        <div class="border filter shadow-lg mt-8">
            <div class="xl:col-span-2 p-12">
                <SelectInputAccount />
                <SelectInputMultisigAccount class="md:mt-3 " :selected-address="selectedAddress" />
                <div class="mt-2">Name</div>
                <TextInput placeholder="Name your item" v-model="name"/>
                <div class="mt-4">Description</div>
                <textarea type="text " v-model="description" placeholder="Prepare a detailed description of your item" class="w-full px-3  py-1.5 mt-1 border focus:outline-none border-black"></textarea>
                <div class="mt-4">Upload Image</div>
                    <input
                    id="file"
                    type="file"
                    class="inputfile"
                    :disabled = "disabled"
                    @change="imageChange"
                    />
                    <img
                    v-if="selectedImage"
                    id="createfileImage"
                    :src="selectedImage"
                    alt=""
                    data-black-overlay="6"
                    />
                    <label for="file" title="No File Chosen">
                    <i v-if="!selectedImage" class="feather-upload" />
                        
                        
                    </label>
                <div class="mt-4">Properties</div>
                <div v-for="(attributeName,index) of attributeNames" :key="index" >
                    <div class="flex gap-2 mb-2" >
                        <img src="@/modules/services/submodule/nftMaker/img/icon-delete-red.svg" class="w-4 h-4 cursor-pointer mt-2.5" @click="removeProperty(index)">
                        <div class="w-full">
                            <TextInput placeholder="Property name" errorMessage="More than 8 bytes." v-model="attributeNames[index]" />
                        </div>
                        <div class="w-full">
                            <TextInput placeholder="Property value" v-model="attributeValues[index]" />
                        </div>
                    </div>
                </div>
                <div class="w-[80px] mt-2">
                    <div class="text-blue-600 font-semibold text-xs cursor-pointer cursor-pointer" @click="addProperty()">+ Add more</div>
                </div>
                <div class="mt-4">
                    <button type="submit" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" :disabled="disabledCreate" @click="createNft()">
                        Create Nft
                    </button>
                </div>
            </div>

            <!--qr modal-->
            <transition enter-active-class="animate__animated animate__fadeInDown" leave-active-class="animate__animated animate__fadeOutUp">
                <div v-if="toggleModal && !showPasswdError" class="popup-outer-lang absolute flex z-50 ">
                    <div class="modal-popup-box ">
                        <div v-html="qr" class="w-8/12 ml-auto mr-auto py-3" />
                        <div class="text-gray-500 ml-auto mr-auto w-8/12">Please scan the QR above with MOEI Mobile App to sign the transaction.</div>
                        <div @click="toggleModal=false;qr=''" class="cursor-pointer flex justify-center my-3 bg-blue-600 w-24 rounded-lg text-white py-1.5 ml-auto mr-auto">Close</div>
                    </div>
                </div>
            </transition>
            <div @click="toggleModal=false;qr=''" v-if="toggleModal" class="fixed inset-0 opacity-50 bg-gray-600 z-20"></div>        
        </div>
    </div>
</template>

<script lang="ts" setup>
import {  computed, getCurrentInstance, shallowRef, ref} from 'vue';
import TextInput from '@/modules/services/submodule/nftMaker/components/TextInput.vue';
import SelectInputAccount from "@/modules/services/submodule/nftMaker/components/SelectInputAccount.vue";
import SelectInputMultisigAccount from "@/modules/services/submodule/nftMaker/components/SelectInputMultisigAccount.vue";
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { useToast } from "primevue/usetoast";;
import { Peer } from "peerjs";
import QRCode from 'qrcode'


//initialize variables
const toast = useToast();
const selectedMultisigAddress = ref<string | null>(null)
const selectedAddress = ref<string | null>(null)
const name = shallowRef('')
const description = shallowRef('')
const file = shallowRef<Blob>(null)
const fileName = shallowRef('')
const selectedImage = shallowRef('')
const attributeNames = ref(['']) 
const attributeValues = ref([''])
const publicKey = shallowRef('')
const qr = shallowRef('')
const toggleModal = shallowRef(false)
const showPasswdError = ref(false);
const disabled = ref(false);
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

//convert both array values into object keys and values
const getAttributeObject = () =>{
    return attributeNames.value.reduce((key,value,index)=>{
        return {...key, [value]: attributeValues.value[index]};
    },{})
}

//create button validation
const disabledCreate = computed(()=>{
    console.log(!attributeNames.value.every(name=>name!=''))
    return !attributeNames.value.every(name=>name!='') || !attributeValues.value.every(name=>name!='') || name.value=='' || file.value == null || publicKey.value == ''
})

//reset inputs
const resetInputs = () =>{
    name.value = ''
    description.value = ''
    file.value = null
    attributeNames.value = []
    attributeValues.value = []

    selectedImage.value = ''
}

//create nft transaction
/*const createItem = async() =>{

    let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword.value)

    if (!verify) {
      return false
    }

    const hash = networkState.currentNetworkProfile.generationHash

    let networkType = AppState.networkType

    const newValue = {
        name: name.value, 
        description: description.value,
        image: externalLink.value,  
        attributes: getAttributeObject()
    }
    let initiatorAcc: WalletAccount
    let senderPublicAccount: PublicAccount;
    if (!selectedMultisigAddress.value) {
      initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedAddress.value);
    } else {
      // initiator acc details
      initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedAddress.value);
      const accountInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(selectedMultisigAddress.value))
      senderPublicAccount = PublicAccount.createFromPublicKey(accountInfo.publicKey, networkType);
    }
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword.value), initiatorAcc.encrypted, initiatorAcc.iv)

    const publicAccount = selectedMultisigAddress.value ? senderPublicAccount : PublicAccount.createFromPublicKey(publicKey.value,networkType)
    const assetDefinitionBuilder = AppState.buildTxn.mosaicDefinitionBuilder()
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
    .build();
    
    const assetSupplyChangeBuilder = AppState.buildTxn.buildMosaicSupplyChangeBuilder()
    const assetSupplyChangeTx =  assetSupplyChangeBuilder
    .deadline(Deadline.create())
    .mosaicId(assetDefinitionTx.mosaicId)
    .direction(MosaicSupplyType.Increase)
    .delta(UInt64.fromUint(1))
    .build()

    const mosaicMetadataBuilder = AppState.buildTxn.assetMetadataBuilder()
    const mosaicMetadataTx = mosaicMetadataBuilder
    .deadline(Deadline.create())
    .targetPublicKey(publicAccount)
    .targetMosaicId(assetDefinitionTx.mosaicId) 
    .scopedMetadataKey(UInt64.fromHex(Convert.utf8ToHex('nft.json')))
    .value(JSON.stringify(newValue))
    .oldValue('')
    .calculateDifferences()
    .build()

   

    let innerTx :InnerTransaction[]
    = [assetDefinitionTx.toAggregateV1(publicAccount),assetSupplyChangeTx.toAggregateV1(publicAccount),mosaicMetadataTx.toAggregateV1(publicAccount)] 
    
     
   
    let aggregateTxBuilder = selectedMultisigAddress.value? AppState.buildTxn.aggregateBondedBuilder() : AppState.buildTxn.aggregateCompleteBuilder()
    const aggregateTx = aggregateTxBuilder
    .deadline(Deadline.create())
    .innerTransactions(innerTx)
    .build()
    
    const account = Account.createFromPrivateKey(privateKey, networkType, 1);

    if (!selectedMultisigAddress.value) { // no cosigner, normal transaction
      const signedTransaction = account.preV2Sign(aggregateTx, hash);
      TransactionUtils.announceTransaction(signedTransaction)
    } else { // there is a cosigner, aggregate  bonded transaction
      let selectedWalletSigner = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == selectedAddress.value)
      let selectedSignerPrivateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword.value), selectedWalletSigner.encrypted, selectedWalletSigner.iv);
      let selectedSignerAccount = Account.createFromPrivateKey(selectedSignerPrivateKey, networkType, 1)
      const aggregateBondedTransactionSigned = selectedSignerAccount.preV2Sign(aggregateTx, hash);

      const hashLockTransaction = TransactionUtils.lockFundTx(aggregateBondedTransactionSigned)
      const hashLockTransactionSigned = selectedSignerAccount.preV2Sign(hashLockTransaction, hash)
      TransactionUtils.announceLF_AND_addAutoAnnounceABT(hashLockTransactionSigned, aggregateBondedTransactionSigned)
    }
    resetInputs()
}*/

const nftBackendUrl = computed(()=> networkState.currentNetworkProfile.nftBackend.url);

const createNft = async() =>{
  if(!publicKey.value){
    return
  }

  let form = new FormData()
  form.append('owner', selectedAddress.value)
  form.append('creator', publicKey.value)
  form.append('file',file.value)
  form.append('name',name.value)
  form.append('description',description.value)
  form.append('properties',JSON.stringify(getAttributeObject()))
  let txnPayload = ""

  try{
    const res = await fetch(nftBackendUrl.value + '/nfts/create',{
        method: 'POST',
        body: form
    })
    const response :{txnPayload: string} = await res.json()
    txnPayload = response.txnPayload
    resetInputs()
    }
    catch(e){
        toast.add({severity:'error', summary: "Failed", detail:'Failed to create NFT', group: 'br', life: 3000});
    }

    const peer = new Peer(); 
        peer.on("open", async () => {
            const data = {
                type:'reqPeerID',
                generationHash: networkState.currentNetworkProfile.generationHash, //testnet2
                recvId: peer.id
            } 
            qr.value = await QRCode.toString(JSON.stringify(data))
            toggleModal.value = true
        })
        peer.on("connection", (conn) => {
            conn.on("data", async (data) => {
                let payload = {
                    type: 'txn',
                    payload: txnPayload
                }
                if(data == 'requestTxnSigning'){
                    conn.send(payload) 
                }else if(data === 'txnHash'){
                    conn.send("success"); 
                    toast.add({severity:'success', summary: "Success", detail:'NFT successfully created', group: 'br', life: 3000});
                }
            });
        });
  }


  const imageChange= (e) => {
    if (e.target.files && e.target.files.length > 0) {
      file.value = e.target.files[0];
      fileName.value = file.value.name
      selectedImage.value = URL.createObjectURL(file.value);
    }
  }

// account is clicked
emitter.on("select-account", (address: string) => {
    selectedAddress.value = address
    const accountInfo = walletState.currentLoggedInWallet.accounts.find(account=>account.address == selectedAddress.value)
    publicKey.value = accountInfo.publicKey
})

emitter.on("select-multisig-account", (address: string) => {
    selectedMultisigAddress.value = address
    if(!selectedMultisigAddress.value){
        return
    }
    const accountInfo = walletState.currentLoggedInWallet.accounts.find(account=>account.address == selectedMultisigAddress.value)
    publicKey.value = accountInfo.publicKey
})

</script>

<style scoped>
.popup-outer-lang{
  top: 80px; left: 0; right: 0; margin-left: auto; margin-right: auto; max-width: 500px;
}
.modal-popup-box{
  @apply transition ease-in duration-300 w-[500px] bg-white shadow-xl rounded-2xl ;
}
</style>