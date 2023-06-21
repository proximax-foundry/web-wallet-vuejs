<template>
    <div>
        <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
            <div class='border-2 xl:grid xl:grid-cols-3'>
                <div class="xl:col-span-2 p-12">
                    <div>SDA Exchange - Sell</div>
                    <div v-if="!selectedAddress" class="text-xs mt-3 text-blue-primary ">Select Account to Create / Initiate
                        Transaction</div>
                    <SelectInputAccount />
                    <SelectInputMultisigAccount class="md:mt-3 " :selected-address="selectedAddress" />
                    <div class="text-blue-primary text-xs mt-3">Asset to Give</div>
                    <SelectInputAsset :selected-address="selectedAddress"
                        :selected-multisig-address="selectedMultisigAddress" />
                    <InputAmount class="mt-3" placeholder="Asset Amount" v-model="amountToGive"
                        :decimal="assetToGive ? assetToGive.divisibility : 0" />
                    <div class="text-red-500 text-xs" v-if="parseFloat(amountToGive) > assetToGive?.amount">Insufficient
                        Balance</div>
                    <div class="text-blue-primary text-xs mt-3">Asset to Receive</div>
                    <InputId class="mt-3" v-model="assetToReceive" :show-error="!assetValid" v-debounce:1000="checkAsset" />
                    <InputAmount class="mt-3" placeholder="Asset Amount" v-model="amountToReceive"
                        :decimal="assetToReceiveProperties ? assetToReceiveProperties.divisibility : 0" />
                    <div class="text-red-500 text-xs" v-if="parseFloat(amountToReceive) > assetToReceiveProperties?.supply">
                        Exceeded Maximum Supply</div>
                    <InputAmount class="mt-3" placeholder="Duration (Block)" v-model="duration" :decimal="0" />
                    <div v-if="parseInt(duration) <= 57600" class="text-xs">Approximately {{
                        convertSecondsToDHMS(parseInt(duration) * 15) }} </div>
                    <div class="text-red-500 text-xs" v-if="parseInt(duration) > 57600">Exceeded maximum duration</div>
                </div>
                <div class='bg-navy-primary py-6 px-6 xl:col-span-1'>
                    <div class="mt-5" />
                    <div class='font-semibold text-xs text-white mb-1.5'>{{ $t('general.enterPasswordContinue') }}</div>
                    <PasswordInput :placeholder="$t('general.enterPassword')"
                        v-model="walletPassword" icon="lock" class="mt-5 mb-3" />
                    <button class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
                        @click="exchangeSell()">
                        Sell
                    </button>
                    <div class="text-center">
                        <router-link :to="{ name: 'ViewDashboard' }" class="content-center text-xs text-white underline">{{
                            $t('general.cancel') }}</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, getCurrentInstance, computed } from 'vue';
import SelectInputAccount from './components/SelectInputAccount.vue';
import SelectInputAsset from './components/SelectInputAsset.vue';
import InputAmount from './components/InputAmount.vue';
import InputId from './components/InputId.vue';
import { Account, Deadline, MosaicId, NamespaceId, Password, PlaceSdaExchangeOfferTransaction, PublicAccount, SdaExchangeOffer, UInt64 } from 'tsjs-xpx-chain-sdk';
import { AppState } from '@/state/appState';
import SelectInputMultisigAccount from './components/SelectInputMultisigAccount.vue';
import PasswordInput from "@/components/PasswordInput.vue";
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletUtils } from '@/util/walletUtils';
import { TransactionUtils } from '@/util/transactionUtils';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';


const convertSecondsToDHMS = (seconds: number): string => {
    const day = Math.floor(seconds / (24 * 3600));
    const hour = Math.floor((seconds % (24 * 3600)) / 3600);
    const minute = Math.floor((seconds % 3600) / 60);
    const second = seconds % 60;

    let result = "";

    if (day > 0) {
        result += `${day} day${day > 1 ? 's' : ''} `;
    }
    if (hour > 0) {
        result += `${hour} hour${hour > 1 ? 's' : ''} `;
    }
    if (minute > 0) {
        result += `${minute} min${minute > 1 ? 's' : ''} `;
    }
    if (second > 0) {
        result += `${second} second${second > 1 ? 's' : ''}`;
    }

    return result.trim();
}

const router = useRouter();

const toast = useToast();

const internalInstance = getCurrentInstance();

const emitter = internalInstance.appContext.config.globalProperties.emitter;

const selectedAddress = ref<string | null>(null)

const selectedMultisigAddress = ref<string | null>(null)

const assetToGive = ref<{ id: string, amount: number, namespace: string, divisibility: number }>(null)

const assetValid = ref(false)

const amountToGive = ref('0')

const amountToReceive = ref('0')

const walletPassword = ref('')

const assetToReceive = ref('')

const duration = ref('57600')

const assetToReceiveProperties = ref<{ supply: number, divisibility: number } | null>(null)

const isMultisig = computed(() => selectedMultisigAddress.value != null)


emitter.on("select-account", (address: string) => {
    selectedAddress.value = address
})

emitter.on("select-multisig-account", (address: string) => {
    selectedMultisigAddress.value = address

})

emitter.on("select-asset", (asset: { id: string, amount: number, namespace: string, divisibility: number }) => {
    assetToGive.value = asset
})


const checkAsset = async () => {
    try {
        new NamespaceId(assetToReceive.value).fullName
        const mosaicId = await AppState.chainAPI.namespaceAPI.getLinkedMosaicId(new NamespaceId(assetToReceive.value))
        assetToReceive.value = mosaicId.toHex()
        const properties = await AppState.chainAPI.assetAPI.getMosaic(mosaicId)
        assetToReceiveProperties.value = { supply: properties.supply.compact(), divisibility: properties.divisibility }
        assetValid.value = true;
        return;
    } catch (_) {
        assetValid.value = false;
        assetToReceiveProperties.value = null;
    }
    try {

        const id = new MosaicId(assetToReceive.value.toUpperCase())
        const properties = await AppState.chainAPI.assetAPI.getMosaic(id)
        assetToReceiveProperties.value = { supply: properties.supply.compact(), divisibility: properties.divisibility }
        assetValid.value = true;
    } catch (_) {
        assetValid.value = false;
        assetToReceiveProperties.value = null;
    }
}

const exchangeSell = async() => {
    console.log('hi')
    if(selectedAddress.value == null){
        toast.add({
          severity:'error', 
          summary: 'Error', 
          detail: "Account is not selected",
          group: 'br-custom',
          life: 1000
       });
        return
    }

    if(!assetToGive.value || !assetValid.value){
        toast.add({
          severity:'error', 
          summary: 'Error', 
          detail: "Asset is not selected",
          group: 'br-custom',
          life: 1000
       });
        return
    }

    if(parseFloat(amountToReceive.value) <=0 || parseFloat(amountToGive.value) <= 0 ){
        toast.add({
          severity:'error', 
          summary: 'Error', 
          detail: "Asset amount cannot be 0",
          group: 'br-custom',
          life: 1000
       });
        return
    }

    if(parseFloat(amountToGive.value) > assetToGive.value?.amount){
        toast.add({
          severity:'error', 
          summary: 'Error', 
          detail: "Insufficient balance",
          group: 'br-custom',
          life: 1000
       });
        return
    }

    if(parseFloat(amountToReceive.value) > assetToReceiveProperties.value?.supply){
        toast.add({
          severity:'error', 
          summary: 'Error', 
          detail: "Exceeded maximum supply",
          group: 'br-custom',
          life: 1000
       });
        return
    }

    if(parseInt(duration.value) > 57600 ||  parseInt(duration.value) <=0){
        toast.add({
          severity:'error', 
          summary: 'Error', 
          detail: "Invalid duration",
          group: 'br-custom',
          life: 1000
       });
        return
    }

    if(walletPassword.value.length < 8){
        toast.add({
          severity:'error', 
          summary: 'Error', 
          detail: "password must be at least 8 characters",
          group: 'br-custom',
          life: 1000
       });
        return;
    }

    if (!WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword.value)) {
        toast.add({
          severity:'error', 
          summary: 'Error', 
          detail: "Incorrect password",
          group: 'br-custom',
          life: 1000
       });
        return;
    }
    const initiatorAcc = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == selectedAddress.value)

    //work on txn 
    const sdaExchangeOfferTxn = PlaceSdaExchangeOfferTransaction.create(
        Deadline.create(),
        [new SdaExchangeOffer(
            new MosaicId(assetToGive.value.id),
            UInt64.fromUint(parseFloat(amountToGive.value) * Math.pow(10, assetToGive.value.divisibility)),
            new MosaicId(assetToReceive.value),
            UInt64.fromUint(parseFloat(amountToReceive.value) * Math.pow(10, assetToReceiveProperties.value.divisibility)),
            UInt64.fromUint(parseInt(duration.value))
        )], AppState.networkType
    )
    
    const privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword.value), initiatorAcc.encrypted, initiatorAcc.iv)
    walletPassword.value = ""

    const acc = Account.createFromPrivateKeyV1(privateKey, AppState.networkType)
    const generationHash = networkState.currentNetworkProfile.generationHash
    if (isMultisig.value) {
        const multisigAcc = [...walletState.currentLoggedInWallet.accounts, ...walletState.currentLoggedInWallet.others].find(acc => acc.address == selectedMultisigAddress.value)
        const innerTxn = [sdaExchangeOfferTxn.toAggregateV1(PublicAccount.createFromPublicKey(multisigAcc.publicKey, AppState.networkType))];
        const aggregateBondedTransaction = AppState.buildTxn.aggregateBonded(innerTxn)
        const aggregateBondedTransactionSigned = acc.preV2Sign(aggregateBondedTransaction, generationHash);

        const hashLockTransaction = TransactionUtils.lockFundTx(aggregateBondedTransactionSigned)
        const hashLockTransactionSigned = acc.preV2Sign(hashLockTransaction, generationHash)
        TransactionUtils.announceLF_AND_addAutoAnnounceABT(hashLockTransactionSigned, aggregateBondedTransactionSigned)
    }else{
        const signedTransaction = acc.preV2Sign(sdaExchangeOfferTxn, generationHash);
        await TransactionUtils.announceTransaction(signedTransaction)
    }
    router.push({ name: "ViewAccountPendingTransactions",params:{address:acc.address.plain()} })

  


}



</script>