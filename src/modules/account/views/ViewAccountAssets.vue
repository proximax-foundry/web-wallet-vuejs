<template>
    <div>
        <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
            <AccountComponent :address="address" class="mb-6" />
            <AccountTabs :address="address" selected="assets" />
            <div class='border-2 border-t-0  '>
                <AssetDataTable :assets="mosaics" :address="address" />
                <div class="flex my-3 px-6 flex-col w-full ml-auto mr-auto gap-2 sm:flex-row sm:items-center">
                    <router-link :to="{ name: 'ViewTransferCreate' }"
                        class=" bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center "><img
                            src="@/assets/img/icon-transfer-white.svg"
                            class="  inline-block w-4 h-4 mt-0.5  cursor-pointer mr-1">{{ $t('general.transfer') }}</router-link>
                    <router-link :to="{ name: 'ViewServicesMainnetSwap' }"
                        class="bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center  "><img
                            src="@/assets/img/navi/icon-swap.svg"
                            class="w-4 h-4 inline-block relative mr-1">{{ $t('general.swap') }}</router-link>
                    <router-link :to="{ name: 'ViewServicesAssetsCreate' }"
                        class="bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center"><img
                            src="@/assets/img/icon-plus.svg"
                            class="inline-block w-4 h-4 mr-2">{{ $t('asset.createNewAsset') }}</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, } from "vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { walletState } from '@/state/walletState';
import { Helper } from '@/util/typeHelper';
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import AssetDataTable from "@/modules/account/components/AssetDataTable.vue";

const p = defineProps({
    address: {
        type: String,
        required: true
    }
})
const wallet = walletState.currentLoggedInWallet
const acc = computed(() => {
    if (!wallet) {
        return null
    }
    let currentAccount = wallet.accounts.find(account => account.address == p.address)
    if (currentAccount != undefined) {
        return currentAccount
    } else {
        return wallet.others.filter(accounts => accounts.type === "MULTISIG").find(account => account.address == p.address)
    }
})

const mosaics = computed(() => {

    var mosaicOption:{i:number,id:string,name:string,balance:string,isCreator:boolean}[] = [];
    if (!walletState.currentLoggedInWallet) {
        return mosaicOption;
    }
    const account = walletState.currentLoggedInWallet.accounts.find(
        (element) => element.address == p.address
    ) || walletState.currentLoggedInWallet.others.find(
        (element) => element.address == p.address)
    if (!account) {
        return mosaicOption
    }
    account.assets.forEach((i, index) => {
        mosaicOption.push({
            i: index,
            id: i.idHex,
            name: (i.namespaceNames.length > 0 ? formatNamespaceName(i.namespaceNames) : '-'),
            balance: Helper.toCurrencyFormat(i.amount, i.divisibility??0),
            isCreator: acc.value ? (i.creator == acc.value.publicKey ? true : false) : false
        });
    });

    return mosaicOption

});

const formatNamespaceName = (namespaceNames :string[]) => {
    return namespaceNames.join(" / ")
}

       


</script>

