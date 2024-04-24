<template>
    <div>
        <div class='border-2 xl:grid xl:grid-cols-3'>
            <div class="xl:col-span-2 p-12">
                <div>SDA-SDA Exchange </div>
                <div v-if="!selectedAddress" class="text-xs mt-3 text-blue-primary ">Select Account to Create / Initiate
                    Transaction</div>
                <SelectInputAccount />
                <SelectInputMultisigAccount class="md:mt-3 " :selected-address="selectedAddress" />
                <!-- <div class="text-blue-primary mt-3">Price</div>
                <div> {{/*  Math.trunc( */rate.toFixed(6) /* * Math.pow(10, offerInfo?.mosaicGiveDivisibility) )/ Math.pow(10,
                    offerInfo?.mosaicGiveDivisibility) */ }}
                    {{ displayAssetName(offerInfo?.mosaicGiveName) }}/{{ displayAssetName(offerInfo?.mosaicGetName) }}
                </div> -->
                <div class="text-blue-primary mt-3">Available Amount</div>
                <div>{{ Helper.toCurrencyFormat(offerInfo?.currentMosaicGiveAmount.compact() / Math.pow(10, offerInfo?.mosaicGiveDivisibility),offerInfo?.mosaicGiveDivisibility) }} {{
                    displayAssetName(offerInfo?.mosaicGiveName) }}</div>

                <div class="text-blue-primary mt-3">Minimum Offer </div>
                <div>{{ Helper.toCurrencyFormat(baseRatio[0] / Math.pow(10, offerInfo?.mosaicGetDivisibility),offerInfo?.mosaicGetDivisibility) }} {{
                    displayAssetName(offerInfo?.mosaicGetName) }} : {{ Helper.toCurrencyFormat(baseRatio[1] /
        Math.pow(10, offerInfo?.mosaicGiveDivisibility),offerInfo?.mosaicGiveDivisibility) }} {{ displayAssetName(offerInfo?.mosaicGiveName) }}
                </div>

                <div class="text-blue-primary mt-3">Amount to give ({{ displayAssetName(offerInfo?.mosaicGetName) }}) </div>

                <InputAmount placeholder="Asset Amount" v-model="amountToPay"
                    :decimal="offerInfo?.mosaicGetDivisibility ?? 0" />
                <div class="text-red-500 text-xs" v-if="parseFloat(amountToPay) > giveAssetBalance">Insufficient
                    Balance</div>
                <div class="text-red-500 text-xs"
                    v-if="parseFloat(amountToPay) < (baseRatio[0] / Math.pow(10, offerInfo?.mosaicGetDivisibility))">Less
                    than minimum offer amount </div>

                <div class="mt-2 text-xs text-gray-600">Available to give: {{  Helper.toCurrencyFormat( giveAssetBalance, offerInfo?.mosaicGetDivisibility )}} {{
                    displayAssetName(offerInfo?.mosaicGetName) }}</div>
                <div class="flex mt-2">

                    <div class="text-gray-600 text-xs "> I will receive {{ Helper.toCurrencyFormat(amountToGet,
                        offerInfo?.mosaicGiveDivisibility) }} {{ displayAssetName(offerInfo?.mosaicGiveName) }}</div>
                    <div class="text-red-500 text-xs ml-2"
                        v-if="Math.trunc(amountToGet * Math.pow(10, offerInfo?.mosaicGiveDivisibility)) / Math.pow(10, offerInfo?.mosaicGiveDivisibility) > (offerInfo?.currentMosaicGiveAmount.compact() / Math.pow(10, offerInfo?.mosaicGiveDivisibility))">
                        (Exceed Available Amount of {{ displayAssetName(offerInfo?.mosaicGiveName) }})</div>
                </div>

                <div class="text-gray-600 text-xs mt-2" v-if=" Math.trunc(exceededAmount*Math.pow(10,offerInfo?.mosaicGetDivisibility))/ Math.pow(10,offerInfo?.mosaicGetDivisibility)> 0">{{ Helper.toCurrencyFormat(exceededAmount,
                    offerInfo?.mosaicGetDivisibility) }} {{ displayAssetName(offerInfo?.mosaicGetName) }} will be ignored
                </div>

                <div class="text-blue-primary mt-3">Actual offer</div>
                <div v-if="parseFloat(amountToPay) >= (baseRatio[0] / Math.pow(10, offerInfo?.mosaicGetDivisibility))">{{
                    Helper.toCurrencyFormat(parseFloat(amountToPay) - exceededAmount,
                        offerInfo?.mosaicGetDivisibility) }} {{
            displayAssetName(offerInfo?.mosaicGetName) }} : {{ Helper.toCurrencyFormat(amountToGet,
        offerInfo?.mosaicGiveDivisibility) }} {{ displayAssetName(offerInfo?.mosaicGiveName) }}
                </div>
                <div v-else> 0 {{
                    displayAssetName(offerInfo?.mosaicGetName) }} : 0 {{ displayAssetName(offerInfo?.mosaicGiveName) }}
                </div>

            </div>
            <div class='bg-navy-primary py-6 px-6 xl:col-span-1'>
                <div v-if="selectedMultisigAddress">
                    <div class='font-bold text-xs text-blue-primary uppercase'>{{ $t('general.multisigAcc') }}</div>

                    <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1">
                        <div class='font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase'>
                            {{ $t('general.currentBalance') }}</div>
                        <span class='ml-auto lg:col-span-2 col-span-3'
                            v-html="getNativeTokenBalance(selectedMultisigAddress)"></span>
                        <div class="flex">
                            <div class='ml-1 text-blue-400 font-bold'>{{ AppState.nativeToken.label }}</div>
                            <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
                        </div>
                    </div>

                    <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1 items-center">
                        <div class='font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase'>
                            Asset to Give</div>
                        <span class='ml-auto lg:col-span-2 col-span-3 font-semibold '> {{ Helper.toCurrencyFormat(parseFloat(amountToPay) -
                            exceededAmount, offerInfo?.mosaicGetDivisibility)  }}</span>
                        <span class="ml-1 text-blue-400 text-xs">{{ displayAssetName(offerInfo?.mosaicGetName) }}</span>

                    </div>



                    <div class='border-b-2 border-gray-600 my-2' />
                </div>

                <div class='font-bold text-xs text-blue-primary uppercase'>{{ $t('general.signerAcc') }}</div>

                <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1">
                    <div class='font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase'>
                        {{ $t('general.currentBalance') }}</div>
                    <span class='ml-auto lg:col-span-2 col-span-3' v-html="getNativeTokenBalance(selectedAddress)"></span>
                    <div class="flex">
                        <div class='ml-1 text-blue-400 font-bold'>{{ AppState.nativeToken.label }}</div>
                        <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
                    </div>
                </div>
                <div class='border-b-2 border-gray-600 mt-2' />
                <div v-if="!selectedMultisigAddress">
                    <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1 items-center">
                        <div class='font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase'>
                            Asset to Give</div>
                        <span class='ml-auto lg:col-span-2 col-span-3 font-semibold'>{{ Helper.toCurrencyFormat(parseFloat(amountToPay) -
                            exceededAmount, offerInfo?.mosaicGetDivisibility)  }}</span>
                        <span class="ml-1 text-blue-400 text-xs">{{ displayAssetName(offerInfo?.mosaicGetName) }}</span>

                    </div>
                </div>

                <div
                    class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between  items-center text-gray-200 text-xs py-2">
                    <div class="font-semibold lg:col-span-2 col-span-3">{{ isMultisig ? $t('general.aggregateFee') :
                        $t('general.transactionFee') }}</div>
                    <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(txnFee)"></div>
                    <div class='ml-1 text-blue-400'>{{ AppState.nativeToken.label }}</div>
                </div>
                <div v-if="isMultisig"
                    class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs ">
                    <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.lockFund') }}</div>
                    <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(lockFund ?? 0)"></div>
                    <div class='ml-1 text-blue-400'>{{ AppState.nativeToken.label }}</div>
                </div>
                <div v-if="isMultisig"
                    class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between  items-center text-gray-200 text-xs py-2">
                    <div class="font-semibold lg:col-span-2 col-span-3">{{ $t('general.lockFundTxFee') }}</div>
                    <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(lockFundTxFee ?? 0)"></div>
                    <div class='ml-1 text-blue-400'>{{ AppState.nativeToken.label }}</div>
                </div>
                <div class='border-b-2 border-gray-600 mt-2' />
                <div
                    class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between  items-center text-gray-200 text-xs py-2">
                    <div class="font-semibold lg:col-span-2 col-span-3 uppercase">Total</div>
                    <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(totalFee)"></div>
                    <div class='ml-1 text-blue-400'>{{ AppState.nativeToken.label }}</div>
                </div>

                <div class='font-semibold text-xs text-white mb-1.5'>{{ $t('general.enterPasswordContinue') }}</div>
                <PasswordInput :placeholder="$t('general.enterPassword')" v-model="walletPassword" icon="lock"
                    class="mt-5 mb-3" />
                <button class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="exchangeSell()">
                    Sell
                </button>
                <div class="text-center">
                    <router-link :to="{ name: 'ViewExchangeListing' }"
                        class="content-center text-xs text-white underline">{{
                            $t('general.cancel') }}</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AppState } from '@/state/appState';
import { useToast } from 'primevue/usetoast';
import { lastValueFrom } from 'rxjs';
import { Account, Address, Deadline, ExchangeSdaHttp, MosaicId, Password, 
    PlaceSdaExchangeOfferTransaction, PublicAccount, SdaExchangeOffer, SdaOfferInfo, 
    UInt64, XpxMosaicProperties } from 'tsjs-xpx-chain-sdk';
import { computed, getCurrentInstance, ref, watch } from 'vue';
import InputAmount from './components/InputAmount.vue';
import SelectInputAccount from './components/SelectInputAccount.vue';
import SelectInputMultisigAccount from './components/SelectInputMultisigAccount.vue';
import { Helper } from '@/util/typeHelper';
import { walletState } from '@/state/walletState';
import { TransactionUtils } from '@/util/transactionUtils';
import { networkState } from '@/state/networkState';
import PasswordInput from "@/components/PasswordInput.vue";
import { WalletUtils } from '@/util/walletUtils';
import { useRouter } from 'vue-router';

const reduceFraction = (numerator: number, denominator: number): [number, number] => {
    // Find the greatest common divisor (GCD) using Euclid's algorithm
    const gcd = (a: number, b: number): number => {
        if (b === 0) {
            return a;
        }
        return gcd(b, a % b);
    }

    const commonDivisor = gcd(numerator, denominator);

    // Reduce the fraction
    const reducedNumerator = numerator / commonDivisor;
    const reducedDenominator = denominator / commonDivisor;
    // Return the reduced fraction
    return [reducedNumerator, reducedDenominator];
}


const exceededAmount = computed(() => {
    if (parseFloat(amountToPay.value) < (baseRatio.value[0] / Math.pow(10, offerInfo.value?.mosaicGetDivisibility))) {
        return 0
    }
    return( parseFloat(amountToPay.value) * Math.pow(10,offerInfo.value?.mosaicGetDivisibility)% baseRatio.value[0])/Math.pow(10,offerInfo.value?.mosaicGetDivisibility)
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

const amountToPay = ref('0')

const amountToGet = computed(() => {
    return parseFloat(amountToPay.value) * rate.value - exceededAmount.value * rate.value
})

const internalInstance = getCurrentInstance();

const emitter = internalInstance.appContext.config.globalProperties.emitter;

const walletPassword = ref('')

const selectedAddress = ref<string | null>(null)

const selectedMultisigAddress = ref<string | null>(null)


const lockFund = computed(() =>
    Helper.convertToExact(
        networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
        AppState.nativeToken.divisibility
    )
);
const lockFundTxFee = computed(() => {
    return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
});


const txnFee = computed(() => {
    if (!AppState.isReady) {
        return 0
    }
    const sdaExchangeOfferTxn = PlaceSdaExchangeOfferTransaction.create(
        Deadline.create(),
        [new SdaExchangeOffer(
            new MosaicId(AppState.nativeToken.assetId),
            UInt64.fromUint(parseFloat(amountToPay.value) * Math.pow(10, offerInfo.value?.mosaicGetDivisibility ?? 0)),
            new MosaicId(AppState.nativeToken.assetId),
            UInt64.fromUint(amountToGet.value * Math.pow(10, offerInfo.value?.mosaicGiveDivisibility ?? 0)),
            offerInfo.value?.deadline
        ),
        ], AppState.networkType
    )
    if (!isMultisig.value) {
        return sdaExchangeOfferTxn.maxFee?.compact() / Math.pow(10, AppState.nativeToken.divisibility)
    }
    const multisigAcc = [...walletState.currentLoggedInWallet.accounts, ...walletState.currentLoggedInWallet.others].find(acc => acc.address == selectedMultisigAddress.value)
    const innerTxn = [sdaExchangeOfferTxn.toAggregate(PublicAccount.createFromPublicKey(multisigAcc.publicKey, AppState.networkType, multisigAcc.version))];
    return AppState.buildTxn.aggregateBonded(innerTxn).maxFee.compact() / Math.pow(10, AppState.nativeToken.divisibility)

})

emitter.on("select-account", (address: string) => {
    selectedAddress.value = address
})

emitter.on("select-multisig-account", (address: string) => {
    selectedMultisigAddress.value = address

})



const displayAssetName = (name: string) => {
    const findKnownToken = knownToken.find(token => token.namespace == name)
    if (findKnownToken) {
        return findKnownToken.name
    }
    return name
}

const totalFee = computed(() => {
    if (isMultisig.value) {
        return Math.round((lockFund.value + lockFundTxFee.value + txnFee.value)
            * Math.pow(10, AppState.nativeToken.divisibility)) /
            Math.pow(10, AppState.nativeToken.divisibility)
    }

    if (offerInfo.value && offerInfo.value.mosaicIdGet.id.toHex().toLowerCase() == AppState.nativeToken.assetId.toLowerCase()) {
        return Math.round((parseFloat(amountToPay.value) - exceededAmount.value + txnFee.value)
            * Math.pow(10, AppState.nativeToken.divisibility)) /
            Math.pow(10, AppState.nativeToken.divisibility)
    }
    return txnFee.value
})

interface SdaOfferWithDivisibilityAndNamespace extends SdaOfferInfo {
    mosaicGiveDivisibility?: number,
    mosaicGetDivisibility?: number
    mosaicGiveName?: string,
    mosaicGetName?: string
}

const props = defineProps({
    type: String,
    owner: String,
    pair: String
})

const offerInfo = ref<SdaOfferWithDivisibilityAndNamespace | null>(null)

const rate = ref(0)

const toast = useToast()

const giveAsset = props.pair.split('/')[props.type == 'Sell' ? 0 : 1]

const getAsset = props.pair.split('/')[props.type == 'Sell' ? 1 : 0]

const giveAssetBalance = ref(0)

const getNativeTokenBalance = (address: string) => {
    const findAcc = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == address) || walletState.currentLoggedInWallet.others.find(acc => acc.address == address)
    if (!findAcc) {
        return 0;
    }
    return splitCurrency(findAcc.balance)

}

const splitCurrency = (amount: number) => {
    let split = amount.toString().split(".")
    if (split[1] != undefined) {
        return '<span class="font-semibold text-sm">' + split[0] + '</span>.<span class="font-semibold text-xs">' + split[1] + '</span>';
    } else {
        return '<span class="font-semibold text-sm">' + split[0] + '</span>';
    }
};

const baseRatio = computed(() => {
    if (!offerInfo.value) {
        return reduceFraction(0, 0)
    }
    const numerator = offerInfo.value.initialMosaicGiveAmount.compact() /* / Math.pow(10, offerInfo.value.mosaicGiveDivisibility ?? 0) * Math.pow(10, 6) */
    const denominator = offerInfo.value.initialMosaicGetAmount.compact() /* / Math.pow(10, offerInfo.value.mosaicGetDivisibility ?? 0) * Math.pow(10, 6) */
    return reduceFraction(denominator, numerator)
})


watch(offerInfo, n => {

    if (n.mosaicGetDivisibility) {
        amountToPay.value = (baseRatio.value[0] / Math.pow(10, n.mosaicGetDivisibility)).toString()
    }
}, { deep: true })



const isMultisig = computed(() => selectedMultisigAddress.value != null)



const fetchExchange = async () => {

    if (!giveAsset || !getAsset) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Invalid",
            group: 'br-custom',
            life: 1000
        });
        return;
    }
    const sdaExchangeHttp = new ExchangeSdaHttp(AppState.nodeFullURL)
    const accountExchangeOffers = await lastValueFrom(sdaExchangeHttp.getAccountSdaExchangeOffers(Address.createFromRawAddress(props.owner)))
    offerInfo.value = accountExchangeOffers.sdaOfferBalances.find(offer => offer.mosaicIdGive.toHex() == giveAsset && offer.mosaicIdGet.toHex() == getAsset)
    if (!offerInfo.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Offer not found",
            group: 'br-custom',
            life: 1000
        });
        return;
    }
    const namespaceInfo = await AppState.chainAPI.assetAPI.getMosaicsNames([offerInfo.value.mosaicIdGet as MosaicId, offerInfo.value.mosaicIdGive as MosaicId])
    const assetInfo = await AppState.chainAPI.assetAPI.getMosaics([offerInfo.value.mosaicIdGet as MosaicId, offerInfo.value.mosaicIdGive as MosaicId])

    offerInfo.value.mosaicGetName = namespaceInfo[0].names.length ? namespaceInfo[0].names[0].name : offerInfo.value.mosaicIdGet.toHex()
    offerInfo.value.mosaicGiveName = namespaceInfo[1].names.length ? namespaceInfo[1].names[0].name : offerInfo.value.mosaicIdGive.toHex()
    offerInfo.value.mosaicGetDivisibility = assetInfo.find(info => info.mosaicId.toHex() == offerInfo.value.mosaicIdGet.toHex()).divisibility
    offerInfo.value.mosaicGiveDivisibility = assetInfo.find(info => info.mosaicId.toHex() == offerInfo.value.mosaicIdGive.toHex()).divisibility
    rate.value = (offerInfo.value.initialMosaicGiveAmount.compact() / Math.pow(10, offerInfo.value.mosaicGiveDivisibility)) / (offerInfo.value.initialMosaicGetAmount.compact() / Math.pow(10, offerInfo.value.mosaicGetDivisibility))
}

const fetchGiveAssetBalance = async (address: string) => {
    try {
        const accountInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(address))
        const findAsset = accountInfo.mosaics.find(asset => asset.id.toHex() == offerInfo.value.mosaicIdGet.toHex())
        if (!findAsset) {
            giveAssetBalance.value = 0
            return
        }
        giveAssetBalance.value = findAsset.amount.compact() / Math.pow(10, offerInfo.value.mosaicGetDivisibility)
    } catch (error) {
        giveAssetBalance.value = 0
    }

}


watch(amountToPay, n => {
    if (isNaN(parseFloat(n))) {
        amountToPay.value = '0'
    }
})

watch([selectedAddress, selectedMultisigAddress], ([n, mn]) => {
    giveAssetBalance.value = 0
    //reload asset
    if (n != null && mn == null) {
        fetchGiveAssetBalance(n)
    } else if (n != null && mn != null) {

        fetchGiveAssetBalance(mn)
    }
})

const stopWatch = watch(AppState, async (n, o) => {
    if (n.isReady) {
        await fetchExchange()
        stopWatch()
    }
}, { immediate: true })

const getNativeTokenBalanceNumber = (address: string) => {
    const findAcc = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == address) || walletState.currentLoggedInWallet.others.find(acc => acc.address == address)
    if (!findAcc) {
        return 0;
    }
    return findAcc.balance

}

const router = useRouter()

const exchangeSell = async () => {
    if (selectedAddress.value == null) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Account is not selected",
            group: 'br-custom',
            life: 1000
        });
        return
    }

    if (parseFloat(amountToPay.value) < (baseRatio.value[0] / Math.pow(10, offerInfo.value.mosaicGetDivisibility))) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Less than minimum offer amount",
            group: 'br-custom',
            life: 1000
        });
        return
    }

    if (parseFloat(amountToPay.value) - exceededAmount.value > giveAssetBalance.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Insufficient balance",
            group: 'br-custom',
            life: 1000
        });
        return
    }

    if (Math.trunc(amountToGet.value * Math.pow(10, offerInfo.value.mosaicGiveDivisibility))/ Math.pow(10, offerInfo.value.mosaicGiveDivisibility)  > (offerInfo.value.currentMosaicGiveAmount.compact() / Math.pow(10, offerInfo.value.mosaicGiveDivisibility))) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Exceed available amount of " + displayAssetName(offerInfo.value.mosaicGiveName),
            group: 'br-custom',
            life: 1000
        });
        return
    }

    const signerBalance = getNativeTokenBalanceNumber(selectedAddress.value)
    if (isMultisig.value && (signerBalance < totalFee.value)) {

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Insufficient Balance",
            group: 'br-custom',
            life: 1000
        });
        return

    }

    if (offerInfo.value && offerInfo.value.mosaicIdGet.id.toHex().toLowerCase() == AppState.nativeToken.assetId.toLowerCase() && !isMultisig.value && signerBalance < totalFee.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Insufficient Balance",
            group: 'br-custom',
            life: 1000
        });
        return
    }

    if (walletPassword.value.length < 8) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "password must be at least 8 characters",
            group: 'br-custom',
            life: 1000
        });
        return;
    }

    if (!WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword.value)) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Incorrect password",
            group: 'br-custom',
            life: 1000
        });                                     
        return;
    }
   
    const initiatorAcc = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == selectedAddress.value)

    const sdaExchangeOfferTxn = PlaceSdaExchangeOfferTransaction.create(
        Deadline.create(),
        [new SdaExchangeOffer(
            offerInfo.value.mosaicIdGet as MosaicId,
            UInt64.fromUint(Math.trunc((parseFloat(amountToPay.value) - exceededAmount.value) * Math.pow(10, offerInfo.value.mosaicGetDivisibility))),
            offerInfo.value.mosaicIdGive as MosaicId,
            UInt64.fromUint(Math.trunc(amountToGet.value * Math.pow(10, offerInfo.value.mosaicGiveDivisibility))),
            UInt64.fromUint(57600)
        ),
        ], AppState.networkType
    )

    const privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword.value), initiatorAcc.encrypted, initiatorAcc.iv)
    walletPassword.value = ""

    const acc = Account.createFromPrivateKey(privateKey, AppState.networkType, initiatorAcc.version);
    const generationHash = networkState.currentNetworkProfile.generationHash
    if (isMultisig.value) {
        const multisigAcc = [...walletState.currentLoggedInWallet.accounts, ...walletState.currentLoggedInWallet.others].find(acc => acc.address == selectedMultisigAddress.value)
        const innerTxn = [sdaExchangeOfferTxn.toAggregate(PublicAccount.createFromPublicKey(multisigAcc.publicKey, AppState.networkType, multisigAcc.version))];
        const nodeTime = await AppState.chainAPI.nodeAPI.getNodeTime();
        const aggregateBondedTransaction = AppState.buildTxn.aggregateBonded(innerTxn, new UInt64(nodeTime.sendTimeStamp!))
        const aggregateBondedTransactionSigned = acc.sign(aggregateBondedTransaction, generationHash);

        const hashLockTransaction = TransactionUtils.lockFundTx(aggregateBondedTransactionSigned)
        const hashLockTransactionSigned = acc.sign(hashLockTransaction, generationHash)
        TransactionUtils.announceLF_AND_addAutoAnnounceABT(hashLockTransactionSigned, aggregateBondedTransactionSigned)
    } else {
        const signedTransaction = acc.sign(sdaExchangeOfferTxn, generationHash);
        await TransactionUtils.announceTransaction(signedTransaction)
    }
    router.push({ name: "ViewAccountPendingTransactions", params: { address: acc.address.plain() } })





}

</script>