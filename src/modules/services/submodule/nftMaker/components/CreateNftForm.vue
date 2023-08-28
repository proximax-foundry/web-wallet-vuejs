<template>
    <div class='w-10/12 ml-auto mr-auto mt-5'>
        <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8">
            <div class="xl:col-span-2 p-12">
                <div v-if="showBalanceErr"
                    class="mb-3 rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
                    <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2">
                        <font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute"
                            style="top: 3px; left:4px"></font-awesome-icon></div>
                    <div class="inline-block text-xs">{{ $t('general.insufficientBalance') }}</div>
                </div>
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
            </div>
            <div class="bg-navy-primary py-6 px-6 xl:col-span-1">
                <DisplayFee :signer-native-token-balance="signerNativeTokenBalance"
                         :native-token-balance="nativeTokenBalance" :lock-fund="lockFund"
                        :lock-fund-tx-fee="lockFundTxFee" :selected-multisig-address="selectedMultisigAddress"
                        :txn-fee="txnFee" :total-fee="totalFee"/>
                <div class='font-semibold text-xs text-white mb-1.5'>{{$t('general.enterPasswordContinue')}}</div>
                <PasswordInput class="mt-5 mb-3" :placeholder="$t('general.password')" :errorMessage="$t('general.passwordRequired')" :showError="showPasswdError" v-model="walletPassword" />
                <button type="submit" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" :disabled="disabledCreate" @click="createItem()">
                    Create Nft
                </button>
                <div class="text-center">
                    <router-link :to="{name: 'ViewDashboard'}" class='content-center text-xs text-white border-b-2 border-white'>{{$t('general.cancel')}}</router-link>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script lang="ts" setup>
import {  computed, getCurrentInstance, shallowRef, watch, ref} from 'vue';
import TextInput from '@/modules/services/submodule/nftMaker/components/TextInput.vue';
import { Account, Address, Convert, Deadline, InnerTransaction, MosaicId, MosaicNonce, MosaicProperties, MosaicSupplyType, Password, PublicAccount, UInt64 } from 'tsjs-xpx-chain-sdk';
import SelectInputAccount from "@/modules/services/submodule/nftMaker/components/SelectInputAccount.vue";
import SelectInputMultisigAccount from "@/modules/services/submodule/nftMaker/components/SelectInputMultisigAccount.vue";
import PasswordInput from '@/components/PasswordInput.vue';
import DisplayFee from "@/modules/services/submodule/nftMaker/components/DisplayFee.vue";
import { AppState } from '@/state/appState';
import { TransactionUtils } from '@/util/transactionUtils';
import { WalletUtils } from '@/util/walletUtils';
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletAccount } from '@/models/walletAccount';
import { Helper } from '@/util/typeHelper';

//initialize variables
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

}

const txnFee = computed(()=>{

    const newValue = {
        name: name.value, 
        description: description.value,
        image: externalLink.value,  
        attributes: getAttributeObject()
    }
    const publicAccount = PublicAccount.createFromPublicKey('0'.repeat(64), AppState.networkType)
    const assetDefinitionBuilder = AppState.buildTxn.mosaicDefinitionBuilder()
    const nonce = MosaicNonce.createRandom(); 
    const assetDefinitionTx = assetDefinitionBuilder
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
    .mosaicId(assetDefinitionTx.mosaicId)
    .direction(MosaicSupplyType.Increase)
    .delta(UInt64.fromUint(1))
    .build()

    const mosaicMetadataBuilder = AppState.buildTxn.assetMetadataBuilder()
    const mosaicMetadataTx = mosaicMetadataBuilder
    .targetPublicKey(publicAccount)
    .targetMosaicId(assetDefinitionTx.mosaicId) 
    .scopedMetadataKey(UInt64.fromHex(Convert.utf8ToHex('nft.json')))
    .value(JSON.stringify(newValue))
    .oldValue('')
    .calculateDifferences()
    .build()

    let innerTx :InnerTransaction[]
    = [assetDefinitionTx.toAggregateV1(publicAccount),assetSupplyChangeTx.toAggregateV1(publicAccount),mosaicMetadataTx.toAggregateV1(publicAccount)] 


    const txnBuilder = !selectedMultisigAddress.value? AppState.buildTxn.aggregateCompleteBuilder() : AppState.buildTxn.aggregateBondedBuilder()

    const aggregateTx = txnBuilder
    .innerTransactions(innerTx)
    .build()

    return aggregateTx.maxFee.compact() / Math.pow(10,AppState.nativeToken.divisibility) 
})

const lockFund = computed(() =>
    Helper.convertToExact(
        networkState?.currentNetworkProfileConfig.lockedFundsPerAggregate,
        AppState.nativeToken.divisibility
    )
);

const lockFundTxFee = computed(() => {
    if (networkState.currentNetworkProfile) {
        return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
    }
    return 0;
});

const totalFee = computed(() => {
    let tokenDivisibility = AppState.nativeToken.divisibility
    if (!selectedMultisigAddress.value) {
        if (tokenDivisibility == 0) {
            return txnFee.value
        } else {
            return (txnFee.value * Math.pow(10, tokenDivisibility)) / Math.pow(10, tokenDivisibility)
        }
    } else {
        if (tokenDivisibility == 0) {
            return (txnFee.value + lockFundTxFee.value + lockFund.value)
        } else {
            return (txnFee.value + lockFundTxFee.value + lockFund.value) * Math.pow(10, tokenDivisibility) / Math.pow(10, tokenDivisibility)
        }
    }
})

const showBalanceErr = computed(() => {
    if (!selectedAddress.value) {
        return false
    }
    else if (selectedMultisigAddress.value) {
        if (totalFee.value > signerNativeTokenBalance.value) {
            return true
        } else {
            return false
        }
    } else {
        if (totalFee.value > nativeTokenBalance.value) {
            return true
        } else {
            return false
        }
    }
})

const fetchSignerNativeBalance = async () => {
    if (!AppState.chainAPI) {
        return
    }
    try {
        const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(selectedAddress.value))
        const findNativeToken = accInfo.mosaics.find(asset => asset.id.toHex() == AppState.nativeToken.assetId)
        if (!findNativeToken) {
            signerNativeTokenBalance.value = 0
            return
        } 
            signerNativeTokenBalance.value = findNativeToken.amount.compact() / Math.pow(10,AppState.nativeToken.divisibility)
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