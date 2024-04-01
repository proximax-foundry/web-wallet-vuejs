<template>
    <div>
        <div class='border-2 xl:grid xl:grid-cols-3'>
            <div class="xl:col-span-2 p-12">
                <div>SDA-SDA Exchange - Remove Offer</div>
                <div v-if="cosignerList.length" class="text-blue-primary  mt-3">Select Initiator</div>
                <SelectInputCosignerAccount :cosigner-list="cosignerList" />
                <div v-if="isMultisig && !cosignerList.length" class="text-red-500">Cosigner not found</div>
                <div class="border border-blue-300 rounded-md p-3 mt-3 bg-blue-50">
                    <div class="flex items-center gap-2">
                        <div v-html="svgString"></div>
                        <div class="flex flex-col gap-0.5">
                            <div class="uppercase text-xxs text-blue-primary">Selected Account</div>
                            <div class="font-semibold">{{ accountName }}</div>
                        </div>
                    </div>
                </div>
                <div class="text-blue-primary mt-3">Amount to give </div>
                <div>{{ offerInfo?.currentMosaicGiveAmount.compact() / Math.pow(10, offerInfo?.mosaicGiveDivisibility) }} {{
                    displayAssetName(offerInfo?.mosaicGiveName) }}</div>

                <div class="text-blue-primary mt-3">Amount to get </div>
                <div>{{ offerInfo?.currentMosaicGetAmount.compact() / Math.pow(10, offerInfo?.mosaicGetDivisibility) }} {{
                    displayAssetName(offerInfo?.mosaicGetName) }}</div>
            </div>
        </div>
        <div class='bg-navy-primary py-6 px-6 xl:col-span-1'>
            <div v-if="isMultisig">
                <div class='font-bold text-xs text-blue-primary uppercase'>{{ $t('general.multisigAcc') }}</div>

                <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1">
                    <div class='font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase'>
                        {{ $t('general.currentBalance') }}</div>
                    <span class='ml-auto lg:col-span-2 col-span-3' v-html="getNativeTokenBalance(owner)"></span>
                    <div class="flex">
                        <div class='ml-1 text-blue-400 font-bold'>{{ AppState.nativeToken.label }}</div>
                        <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
                    </div>
                </div>



                <div class='border-b-2 border-gray-600 my-2' />
            </div>
            <div class='font-bold text-xs text-blue-primary uppercase'>{{ $t('general.signerAcc') }}</div>

            <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1">
                <div class='font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase'>
                    {{ $t('general.currentBalance') }}</div>
                <span class='ml-auto lg:col-span-2 col-span-3'
                    v-html="getNativeTokenBalance(isMultisig ? selectedCosignerAddress : owner)"></span>
                <div class="flex">
                    <div class='ml-1 text-blue-400 font-bold'>{{ AppState.nativeToken.label }}</div>
                    <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
                </div>
            </div>
            <div class='border-b-2 border-gray-600 mt-2' />


            <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between  items-center text-gray-200 text-xs py-2">
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
            <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between  items-center text-gray-200 text-xs py-2">
                <div class="font-semibold lg:col-span-2 col-span-3 uppercase">Total</div>
                <div class="lg:col-span-2 col-span-3 ml-auto" v-html="splitCurrency(totalFee)"></div>
                <div class='ml-1 text-blue-400'>{{ AppState.nativeToken.label }}</div>
            </div>

            <div class='font-semibold text-xs text-white mb-1.5'>{{ $t('general.enterPasswordContinue') }}</div>
            <PasswordInput :placeholder="$t('general.enterPassword')" v-model="walletPassword" icon="lock"
                class="mt-5 mb-3" />
            <button class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="removeOffer()">
                Sell
            </button>
            <div class="text-center">
                <router-link :to="{ name: 'ViewExchangeListing' }" class="content-center text-xs text-white underline">{{
                    $t('general.cancel') }}</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ThemeStyleConfig } from '@/models/stores';
import { AppState } from '@/state/appState';
import { walletState } from '@/state/walletState';
import { MultisigUtils } from '@/util/multisigUtils';
import { toSvg } from 'jdenticon';
import { useToast } from 'primevue/usetoast';
import { lastValueFrom } from 'rxjs';
import { Account, Address, Deadline, ExchangeSdaHttp, MosaicId, Password, PublicAccount, RemoveSdaExchangeOffer, RemoveSdaExchangeOfferTransaction, SdaOfferInfo } from 'tsjs-xpx-chain-sdk';
import { computed, getCurrentInstance, ref, watch } from 'vue'
import SelectInputCosignerAccount from './components/SelectInputCosignerAccount.vue';
import { TransactionUtils } from '@/util/transactionUtils';
import { Helper } from '@/util/typeHelper';
import { networkState } from '@/state/networkState';
import PasswordInput from "@/components/PasswordInput.vue";
import { WalletUtils } from '@/util/walletUtils';
import { useRouter } from 'vue-router';
import { UInt64 } from "tsjs-xpx-chain-sdk";

interface SdaOfferWithDivisibilityAndNamespace extends SdaOfferInfo {
    mosaicGiveDivisibility?: number,
    mosaicGetDivisibility?: number
    mosaicGiveName?: string,
    mosaicGetName?: string
}

const props = defineProps({
    owner: String,
    pair: String
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

const walletPassword = ref('')

const getNativeTokenBalance = (address: string) => {
    if (!address) {
        return '0'
    }
    const plainAddress = Address.createFromRawAddress(address).plain()
    const findAcc = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == plainAddress) || walletState.currentLoggedInWallet.others.find(acc => acc.address == plainAddress)
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

const displayAssetName = (name: string) => {
    const findKnownToken = knownToken.find(token => token.namespace == name)
    if (findKnownToken) {
        return findKnownToken.name
    }
    return name
}

const themeConfig: any = new ThemeStyleConfig('ThemeStyleConfig');
themeConfig.init();

const svgString = computed(() => toSvg(props.owner, 40, themeConfig.jdenticonConfig))

const accountName = computed(() => {
    const plainAddress = Address.createFromRawAddress(props.owner).plain()
    return walletState.currentLoggedInWallet.convertAddressToName(plainAddress, true)
})

const selectedCosignerAddress = ref(null)

const internalInstance = getCurrentInstance();

const emitter = internalInstance.appContext.config.globalProperties.emitter;

emitter.on("select-cosigner-account", (address: string) => {
    selectedCosignerAddress.value = address

})

const isMultisig = computed(() => {
    const plainAddress = Address.createFromRawAddress(props.owner).plain()
    const findAcc = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == plainAddress) || walletState.currentLoggedInWallet.others.find(acc => acc.address == plainAddress)
    return findAcc.getDirectParentMultisig().length
})

const cosignerList = computed(() => {
    if (!isMultisig.value) {
        return []
    }
    const plainAddress = Address.createFromRawAddress(props.owner).plain()
    const findAcc = walletState.currentLoggedInWallet.accounts.find(acc => acc.address == plainAddress) || walletState.currentLoggedInWallet.others.find(acc => acc.address == plainAddress)
    return MultisigUtils.getCosignerInWallet(findAcc.publicKey).cosignerList
})

const offerInfo = ref<SdaOfferWithDivisibilityAndNamespace | null>(null)

const toast = useToast()

const giveAsset = props.pair.split('/')[0]

const getAsset = props.pair.split('/')[1]

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

}

const stopWatch = watch(AppState, async (n, o) => {
    if (n.isReady) {
        await fetchExchange()
        stopWatch()
    }
}, { immediate: true })

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
    const removeSdaExchangeTxn = RemoveSdaExchangeOfferTransaction.create(
        Deadline.create(),
        [new RemoveSdaExchangeOffer(
            new MosaicId(AppState.nativeToken.assetId),
            new MosaicId(AppState.nativeToken.assetId))
        ], AppState.networkType
    )
    if (!isMultisig.value) {
        return removeSdaExchangeTxn.maxFee?.compact() / Math.pow(10, AppState.nativeToken.divisibility)
    }
    const multisigAcc = [...walletState.currentLoggedInWallet.accounts, ...walletState.currentLoggedInWallet.others].find(acc => acc.address == Address.createFromRawAddress(props.owner).plain())
    const innerTxn = [removeSdaExchangeTxn.toAggregate(PublicAccount.createFromPublicKey(multisigAcc.publicKey, AppState.networkType, 1))];
    return AppState.buildTxn.aggregateBonded(innerTxn).maxFee.compact() / Math.pow(10, AppState.nativeToken.divisibility)

})

const totalFee = computed(() => {
    if (isMultisig.value) {
        return Math.round((lockFund.value + lockFundTxFee.value + txnFee.value)
            * Math.pow(10, AppState.nativeToken.divisibility)) /
            Math.pow(10, AppState.nativeToken.divisibility)
    }

    return txnFee.value
})
const router = useRouter()

const removeOffer = async() => {
    if (isMultisig.value && !selectedCosignerAddress.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: "Initiator not selected",
            group: 'br-custom',
            life: 1000
        });
        return
    } if (walletPassword.value.length < 8) {
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

    const plainAddress = Address.createFromRawAddress(props.owner).plain()
    const initiatorAcc =  walletState.currentLoggedInWallet.accounts.find(acc => acc.address == (isMultisig.value? selectedCosignerAddress.value :plainAddress))

    const privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword.value), initiatorAcc.encrypted, initiatorAcc.iv)
    walletPassword.value = ""

    const removeSdaExchangeTxn = RemoveSdaExchangeOfferTransaction.create(
        Deadline.create(),
        [new RemoveSdaExchangeOffer(
            offerInfo.value.mosaicIdGive as MosaicId ,
            offerInfo.value.mosaicIdGet as MosaicId)
        ], AppState.networkType
    )

    const acc = Account.createFromPrivateKeyV1(privateKey, AppState.networkType)
    const generationHash = networkState.currentNetworkProfile.generationHash
    if (!isMultisig.value) {
        const signedTransaction = acc.sign(removeSdaExchangeTxn, generationHash);
        await TransactionUtils.announceTransaction(signedTransaction)
    }else{
        const multisigAcc = [...walletState.currentLoggedInWallet.accounts, ...walletState.currentLoggedInWallet.others].find(acc => acc.address == plainAddress)
        const innerTxn = [removeSdaExchangeTxn.toAggregate(PublicAccount.createFromPublicKey(multisigAcc.publicKey, AppState.networkType, 1))];
        const nodeTime = await AppState.chainAPI.nodeAPI.getNodeTime();
        const aggregateBondedTransaction = AppState.buildTxn.aggregateBonded(innerTxn, new UInt64(nodeTime.sendTimeStamp!));
        const aggregateBondedTransactionSigned = acc.sign(aggregateBondedTransaction, generationHash);

        const hashLockTransaction = TransactionUtils.lockFundTx(aggregateBondedTransactionSigned)
        const hashLockTransactionSigned = acc.sign(hashLockTransaction, generationHash)
        TransactionUtils.announceLF_AND_addAutoAnnounceABT(hashLockTransactionSigned, aggregateBondedTransactionSigned)
    }
    router.push({ name: "ViewAccountPendingTransactions", params: { address: acc.address.plain() } })
}

</script>