<template>
    <div class='mt-2 py-3 '>
        <div class="w-11/12 ml-auto mr-auto border-2 p-2">
            <SelectInputAccount />
            <SelectInputMultisigAccount class="md:mt-3 " :selected-address="selectedAddress" />
            <div class="mt-2 dark:text-white">Name</div>
            <TextInput placeholder="Name your item" v-model="name"/>
            <div class="mt-4 dark:text-white">Description</div>
            <textarea type="text " v-model="description" placeholder="Prepare a detailed description of your item" class="w-full px-3  py-1.5 mt-1 border focus:outline-none border-black"></textarea>
            <div class="mt-4 dark:text-white">External Link</div>
            <TextInput placeholder="https://yoursite.io/item/123"  v-model="externalLink"  />
            <div class="mt-4 dark:text-white">Properties</div>
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
                <div class="text-blue-600 font-semibold text-xs cursor-pointer dark:text-blue-600 cursor-pointer" @click="addProperty()">+ Add more</div>
            </div>
            <!-- <div class="mt-4 dark:text-white">Royalties</div>
            <div class="my-2 text-gray-500 text-xs" >Collect a fee (XPX) when a user re-sells an item you created.</div>
            <NumberInput v-model="royalties" :decimal="6"/> -->
            <div class='font-semibold'>Enter your password to continue</div>
            <PasswordInput  :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')" :showError="showPasswdError" v-model="walletPassword" icon="lock" class="mt-5 mb-3" :disabled="disablePassword"/>
            <div class="error error_box" v-if="err!=''">{{ err }}</div>
            <button @click="createItem()" class="dark:bg-blue-600 flex px-5 ml-auto mr-auto mt-3 py-1.5 bg-blue-600 text-white rounded-md disabled:opacity-50" :disabled="disabledCreate">Create Item</button>
            
        <!--qr modal-->
        <!--<transition enter-active-class="animate__animated animate__fadeInDown" leave-active-class="animate__animated animate__fadeOutUp">
                <div v-if="toggleModal" class="popup-outer-lang absolute flex z-50 ">
                    <div class="modal-popup-box ">
                        <div v-html="qr" class="w-8/12 ml-auto mr-auto py-3" />
                        <div class="text-gray-500 ml-auto mr-auto w-8/12">Please scan the QR above with Sirius Mobile App to sign the transaction.</div>
                        <div @click="toggleModal=false;qr=''" class="cursor-pointer flex justify-center my-3 bg-blue-600 dark:bg-blue-600 w-24 rounded-lg text-white py-1.5 ml-auto mr-auto">Close</div>
                    </div>
                </div>
            </transition>
            <div @click="toggleModal=false;qr=''" v-if="toggleModal" class="fixed inset-0 opacity-50 bg-gray-600 dark:bg-[#171717] z-20"></div>
        -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import {  computed, getCurrentInstance, shallowRef, watch, ref} from 'vue';
import TextInput from '@/modules/services/submodule/nftMaker/components/TextInput.vue';
import NumberInput from '@/components/NumberInput.vue';
import { Account, AccountHttp, Address, AggregateBondedTransactionBuilder, AggregateBondedV1TransactionBuilder, AggregateCompleteTransactionBuilder, AggregateCompleteV1TransactionBuilder, Convert, Deadline, InnerTransaction, MosaicDefinitionTransactionBuilder, MosaicId, MosaicLevy, MosaicMetadataTransactionBuilder, MosaicModifyLevyTransactionBuilder, MosaicNonce, MosaicProperties,MosaicSupplyChangeTransactionBuilder, MosaicSupplyType, NetworkType, Password, PublicAccount, UInt64 } from 'tsjs-xpx-chain-sdk';
import SelectInputAccount from "@/modules/services/submodule/nftMaker/components/SelectInputAccount.vue";
import SelectInputMultisigAccount from "@/modules/services/submodule/nftMaker/components/SelectInputMultisigAccount.vue";
import PasswordInput from '@/components/PasswordInput.vue';
import { AppState } from '@/state/appState';
import { TransactionUtils } from '@/util/transactionUtils';
import { WalletUtils } from '@/util/walletUtils';
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletAccount } from '@/models/walletAccount';

//initialize variables
const testnetUrl = 'https://api-2.testnet2.xpxsirius.io'
const selectedMultisigAddress = ref<string | null>(null)
const selectedAddress = ref<string | null>(null)
const nativeTokenBalance = ref(0)
const signerNativeTokenBalance = ref(0)
const name = shallowRef('')
const description = shallowRef('')
const externalLink = shallowRef('')
const attributeNames = ref(['']) 
const attributeValues = ref([''])
const royalties = shallowRef('0')
const publicKey = shallowRef('')
const qr = shallowRef('')
const walletPassword = ref("");
const err = ref('');
const showPasswdError = ref(false);
const disableAllInput = ref(false);
const disablePassword = computed(() => disableAllInput.value);
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
/*const fetchSessionStorage = () =>{
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
})*/


//convert both array values into object keys and values
const getAttributeObject = () =>{
    return attributeNames.value.reduce((key,value,index)=>{
        return {...key, [value]: attributeValues.value[index]};
    },{})
}

//create button validation
const disabledCreate = computed(()=>{
    console.log(!attributeNames.value.every(name=>name!=''))
    return !attributeNames.value.every(name=>name!='') || !attributeValues.value.every(name=>name!='') || name.value=='' || externalLink.value == '' || publicKey.value == '' || walletPassword.value == ''
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
    resetInputs()
    let initiatorAcc = walletState.currentLoggedInWallet.accounts.find((element) => element.address === selectedAddress.value);
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword.value), initiatorAcc.encrypted, initiatorAcc.iv)
    console.log(publicKey.value)
    console.log(privateKey)
    const publicAccount = PublicAccount.createFromPublicKey(publicKey.value,NetworkType.TEST_NET)
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
      console.log(signedTransaction)
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

    // TransactionUtils.announceLF_AND_addAutoAnnounceABT()

}

const txnFee = computed(()=>{
    const txnBuilder = !selectedMultisigAddress.value? AppState.buildTxn.aggregateCompleteBuilder() : AppState.buildTxn.aggregateBondedBuilder()

    
})


const fetchSignerNativeBalance = async () => {
    if (!AppState.chainAPI) {
        return
    }
    try {
        const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(selectedAddress.value))
        const findNativeToken = accInfo.mosaics.findIndex(asset => asset.id.toHex() == AppState.nativeToken.assetId)
        if (findNativeToken != -1) {
            signerNativeTokenBalance.value = accInfo.mosaics[findNativeToken].amount.compact() / Math.pow(10, AppState.nativeToken.divisibility)
        } else {
            signerNativeTokenBalance.value = 0
        }
    } catch (_) {
        signerNativeTokenBalance.value = 0
    }
}

const fetchAsset = async (address: string) => {
    if (!AppState.chainAPI) {
        return
    }
    if (!address) {
        return
    }
    try {
        const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(address))
        const findNativeToken = accInfo.mosaics.find(asset=>asset.id.toHex() == AppState.nativeToken.assetId)

        if (!findNativeToken) {
            nativeTokenBalance.value = 0
            return
        } 
            nativeTokenBalance.value = findNativeToken.amount.compact() / Math.pow(10,AppState.nativeToken.divisibility)
        
    } catch (error) {
        nativeTokenBalance.value = 0
    }

}

watch([selectedAddress, selectedMultisigAddress], async ([n, mn]) => {
    //reload asset
    if(n == null){
        nativeTokenBalance.value = 0
    }
    if (n != null && mn == null) {
        signerNativeTokenBalance.value = 0
       
        await fetchAsset(n)
    } else if (n != null && mn != null) {
        await fetchSignerNativeBalance()
        await fetchAsset(mn)
    }

})

// account is clicked
emitter.on("select-account", async (address: string) => {
    selectedAddress.value = address
    const accountInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(selectedAddress.value))
    publicKey.value = accountInfo.publicKey
})

emitter.on("select-multisig-account", (address: string) => {
    selectedMultisigAddress.value = address
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