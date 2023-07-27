<template>
    <div v-if="selectedMultisigAddress">
        <div class='font-bold text-xs text-blue-primary uppercase'>{{ $t('general.multisigAcc') }}</div>

        <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1">
            <div class='font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase'>
                {{ $t('general.currentBalance') }}</div>
            <span class='ml-auto lg:col-span-2 col-span-3 ' v-html="splitCurrency(signerNativeTokenBalance ?? 0)"></span>
            <div class="flex">
                <div class='ml-1 text-blue-400 font-bold'>{{ AppState.nativeToken.label }}</div>
                <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
            </div>
        </div>
        <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs pt-2">
            <div class='font-semibold lg:col-span-2 col-span-3'>{{ $t('transfer.transferAmount') }}</div>
            <div v-if="isNaN(parseFloat(nativeAmount))" class="lg:col-span-2 col-span-3 ml-auto">0</div>
            <div v-else class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(nativeAmount ?? 0)"></div>
            <div class='ml-1 text-blue-400'>{{ AppState.nativeToken.label }}</div>
        </div>
        <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-white text-xs" v-for="(asset, index) in selectedAssets"
            :key="index">
            <div v-if="isNaN(parseFloat(asset.amount)) && asset.id != null" class="lg:col-span-4 col-span-6 ml-auto">0</div>
            <div v-else class="lg:col-span-4 col-span-6 ml-auto">{{ asset.amount }}</div>
            <div class="ml-1 text-blue-400" :index="index" v-if="asset.id != null">{{ displayAssetName(asset.namespace == ""
                ?
                asset.id : asset.namespace) }} </div>
        </div>

        <div class='border-b-2 border-gray-600 my-2' />
    </div>
    <!-- { end of multisig summary } -->
    <!-- { beginning of signer summary } -->
    <div class='font-bold text-xs text-blue-primary uppercase'>{{ $t('general.signerAcc') }}</div>

    <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1">
        <div class='font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase'>
            {{ $t('general.currentBalance') }}</div>
        <span class='ml-auto lg:col-span-2 col-span-3' v-html="splitCurrency(nativeTokenBalance ?? 0)"></span>
        <div class="flex">
            <div class='ml-1 text-blue-400 font-bold'>{{ AppState.nativeToken.label }}</div>
            <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
        </div>
    </div>
    <div class='border-b-2 border-gray-600 mt-2' />
    <div v-if="!selectedMultisigAddress" class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs pt-2">
        <div class='font-semibold lg:col-span-2 col-span-3'>{{ $t('transfer.transferAmount') }}</div>
        <div v-if="isNaN(parseFloat(nativeAmount))" class="lg:col-span-2 col-span-3 ml-auto">0</div>
        <div v-else class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(nativeAmount ?? 0)"></div>
        <div class='ml-1 text-blue-400'>{{ AppState.nativeToken.label }}</div>
    </div>
    <div v-if="!selectedMultisigAddress" class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-white text-xs" v-for="(asset, index) in selectedAssets"
        :key="index">
        <div v-if="isNaN(parseFloat(asset.amount)) && asset.id != null" class="lg:col-span-4 col-span-6 ml-auto">0</div>
        <div v-else class="lg:col-span-4 col-span-6 ml-auto">{{ asset.amount }}</div>
        <div class="ml-1 text-blue-400" :index="index" v-if="asset.id != null">{{ displayAssetName(asset.namespace == "" ?
            asset.id : asset.namespace) }} </div>
    </div>
    
    <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between  items-center text-gray-200 text-xs py-2">
        <div class="font-semibold lg:col-span-2 col-span-3">{{ selectedMultisigAddress != null ? $t('general.aggregateFee')
            :
            $t('general.transactionFee') }}</div>
        <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(txnFee)"></div>
        <div class='ml-1 text-blue-400'>{{ AppState.nativeToken.label }}</div>
    </div>
    <div v-if="selectedMultisigAddress != null"
        class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs ">
        <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.lockFund') }}</div>
        <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(lockFund ?? 0)"></div>
        <div class='ml-1 text-blue-400'>{{ AppState.nativeToken.label }}</div>
    </div>
    <div v-if="selectedMultisigAddress != null"
        class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between  items-center text-gray-200 text-xs py-2">
        <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.lockFundTxFee') }}</div>
        <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(lockFundTxFee ?? 0)"></div>
        <div class='ml-1 text-blue-400'>{{ AppState.nativeToken.label }}</div>
    </div>
    <div class='border-b-2 border-gray-600 mt-2' />
    <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between  items-center text-gray-200 text-xs py-2">
        <div class="font-semibold lg:col-span-2 col-span-3 uppercase">Total</div>
        <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(totalFee)"></div>
        <div class='ml-1 text-blue-400'>{{ AppState.nativeToken.label }}</div>
    </div>
</template>

<script setup lang="ts">
import { AppState } from '@/state/appState';

defineProps({
    selectedMultisigAddress: {
        type: String || null,
    },
    nativeTokenBalance: {
        type: Number,
        required: true
    },
    selectedAssets: {
        type: Array<{ id: string, balance: number, namespace: string, divisibility: number, amount: string }>,
        required: true
    },
    lockFund: {
        type: Number,
        required: true
    },
    txnFee: {
        type: Number,
        required: true
    },
    lockFundTxFee: {
        type: Number,
        required: true
    },
    totalFee: {
        type: Number,
        required: true
    },
    nativeAmount: {
        type: String,
        required: true
    },
    signerNativeTokenBalance:{
        type:Number,
        required:true
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


const displayAssetName = (name: string) => {
    const findKnownToken = knownToken.find(token => token.namespace == name)
    if (findKnownToken) {
        return findKnownToken.name
    }
    return name.length == 16 ? name.substring(0, 4) + "..." + name.substring(name.length - 4, name.length + 1) : name
}

const splitCurrency = (amount: string | number) => {
    let split = amount.toString().split(".")
    if (split[1] != undefined) {
        return '<span class="font-semibold text-sm">' + split[0] + '</span>.<span class="font-semibold text-xs">' + split[1] + '</span>';
    } else {
        return '<span class="font-semibold text-sm">' + split[0] + '</span>';
    }
};


</script>