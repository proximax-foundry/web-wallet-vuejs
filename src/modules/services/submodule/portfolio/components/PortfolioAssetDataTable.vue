<template>
    <div>
        <DataTable :value="assets" :paginator="true" :rows="10" dataKey="id"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 30, 40, 50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" responsiveLayout="scroll">
            <Column style="width: 200px" headerClass="hidden" v-if="!wideScreen">
                <template #body="{ data }">
                    <div>
                        <div class="uppercase text-xxs font-bold mb-1">Asset ID</div>
                        <div class="uppercase cursor-pointer font-bold text-txs">
                            <a :href="explorerLink(data.id)" target=_blank>
                                <div class=" uppercase inline-block text-xs mt-1.5 cursor-pointer text-blue-primary pr-7 ">
                                    {{ data.id }}</div>
                            </a>
                        </div>
                    </div>
                    <div>
                        <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Alias</div>
                        <div class="flex items-center  pr-7 ">
                            <img v-if="data.name == 'prx.xpx'" src="@/modules/account/img/proximax-logo.svg"
                                class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                            <img v-else-if="data.name == 'xarcade.xar'" src="@/modules/account/img/xarcade-logo.svg"
                                class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                            <img v-else-if="data.name == 'prx.metx'" src="@/modules/account/img/metx-logo.svg"
                                class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                            <div v-else-if="!data.name">-</div>
                            <img v-else src="@/modules/dashboard/img/icon-proximax-logo-gray.svg"
                                class='inline-block h-6 w-6 mr-2 '>
                            <div v-if="displayTokenName(data.name).registered"
                                class="inline-block text-xs ml-2 mt-1 cursor-pointer text-blue-primary"><a
                                    :href="explorerNamespaceLink(data.name)" target=_blank>{{
                                        displayTokenName(data.name).name }}</a></div>
                            <div v-else class="inline-block text-xs ml-2 cursor-pointer text-blue-primary mt-1"><a
                                    :href="explorerNamespaceLink(data.name)" target=_blank>{{ data.name }}</a></div>
                        </div>
                    </div>
                    <div>
                        <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Balance</div>
                        <div class="uppercase font-bold text-xs truncate">{{ Helper.toCurrencyFormat(data.balance,
                            data.divisibility) }}</div>
                    </div>
                </template>
            </Column>
            <Column field="assetId" :header="$t('general.assetId')" v-if="wideScreen">
                <template #body="{ data }">
                    <a :href="explorerLink(data.id)" target=_blank>
                        <div class=" uppercase inline-block text-xs mt-1.5 cursor-pointer text-blue-primary pr-7 ">
                            {{ data.id }}</div>
                    </a>
                </template>
            </Column>
            <Column field="alias" header="Alias" v-if="wideScreen">
                <template #body="{ data }">
                    <div class="flex items-center  pr-7 ">
                        <img v-if="data.name == 'prx.xpx'" src="@/modules/account/img/proximax-logo.svg"
                            class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                        <img v-else-if="data.name == 'xarcade.xar'" src="@/modules/account/img/xarcade-logo.svg"
                            class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                        <img v-else-if="data.name == 'prx.metx'" src="@/modules/account/img/metx-logo.svg"
                            class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                        <div v-else-if="!data.name">-</div>
                        <img v-else src="@/modules/dashboard/img/icon-proximax-logo-gray.svg"
                            class='inline-block h-6 w-6 mr-2 '>
                        <div v-if="displayTokenName(data.name).registered"
                            class="inline-block text-xs ml-2 mt-1 cursor-pointer text-blue-primary"><a
                                :href="explorerNamespaceLink(data.name)" target=_blank>{{ displayTokenName(data.name).name
                                }}</a></div>
                        <div v-else class="inline-block text-xs ml-2 cursor-pointer text-blue-primary mt-1"><a
                                :href="explorerNamespaceLink(data.name)" target=_blank>{{ data.name }}</a></div>
                    </div>
                </template>
            </Column>
            <Column field="amount" :header="$t('general.amount')" v-if="wideScreen">
                <template #body="{ data }">
                    <span class="uppercase font-semibold text-xs">{{ Helper.toCurrencyFormat(data.balance,
                        data.divisibility) }}</span>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script lang="ts" setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Helper } from '@/util/typeHelper';
import { networkState } from '@/state/networkState';
import { onMounted, onUnmounted, ref } from 'vue';

const wideScreen = ref(false);
const screenResizeHandler = () => {
    if (window.innerWidth < 1024) {
        wideScreen.value = false;
    } else {
        wideScreen.value = true;
    }
};
screenResizeHandler();

onUnmounted(() => {
    window.removeEventListener("resize", screenResizeHandler);
});

onMounted(() => {
    window.addEventListener("resize", screenResizeHandler);
});

defineProps({
    assets: {
        type: Array<{ i: number, id: string, name: string, balance: number }>,
        required: true
    }
})

const displayTokenName = (name: string) => {
    if (name == 'prx.xpx') {
        return { name: 'XPX', registered: true }
    } else if (name == 'prx.metx') {
        return { name: 'METX', registered: true }
    } else if (name == 'xarcade.xar') {
        return { name: 'XAR', registered: true }
    } else {
        return { name: name, registered: false }
    }
}
const explorerLink = (assetId: string) => {
    if (!networkState.currentNetworkProfile) {
        return ''
    }
    return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.assetInfoRoute + '/' + assetId
}

const explorerNamespaceLink = (namespace: string) => {
    if (!networkState.currentNetworkProfile) {
        return ''
    }
    return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute + '/' + namespace
}

</script>

<style lang="scss" scoped>
::deep(.p-paginator) {
    .p-paginator-current {

        padding: 1rem;
        padding-right: 0.5rem;
        font-size: 12px;

    }

    .p-paginator-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .p-dropdown {
        margin-top: 0px;
    }

    .p-highlight {
        border-radius: 9999px;
    }

}
</style>