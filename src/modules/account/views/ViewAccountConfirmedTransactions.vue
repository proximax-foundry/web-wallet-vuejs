<template>
<div>
    
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <AccountComponent :address="address" class="mb-6"/>
        <AccountTabs :address="address" selected='txn' />
        <div class="flex my-2  gap-5 flex-none text-xs md:text-sm">
            <div class="border rounded-md text-white py-2 px-4" style="background: #007CFF">Confirmed</div>
            <router-link :to="{name:'ViewAccountPendingTransactions', params: { address: address}}" class="border opacity-60 hover:opacity-100 cursor-pointer  rounded-md text-white py-2 px-5" style="background: #f3a91d">Pending</router-link>
            <router-link :to="{name:'ViewAccountFailedTransactions', params: { address: address}}" class="border opacity-60 hover:opacity-100 cursor-pointer  rounded-md text-white py-2 px-5" style="background: #DC143C">Failed</router-link>
          </div>
        <div class="bg-white px-2 " >
            <div class="flex flex-col gap-3 mt-3">
               
                <div v-if="selectedTxnType === TransactionFilterType.ACCOUNT" class="flex items-center">
                    <div class="h-3 w-3 bg-green-300 inline-block mr-1"></div> <span class="text-xs text-gray-500">{{$t('dashboard.accountAdded')}}</span>
                    <div class="h-3 w-3 bg-red-300 inline-block mr-1 ml-3"></div> <span class="text-xs text-gray-500">{{$t('dashboard.accountRemoved')}}</span>
                </div>
                <div v-else-if="selectedTxnType === TransactionFilterType.EXCHANGE" class="flex items-center">
                    <div class="h-3 w-3 bg-green-300 inline-block mr-1"></div> <span class="text-xs text-gray-500">{{$t('dashboard.buyOffer')}}</span>
                    <div class="h-3 w-3 bg-red-300 inline-block mr-1 ml-3"></div> <span class="text-xs text-gray-500">{{$t('dashboard.sellOffer')}}</span>
                </div>
                <div v-if="selectedTxnType === TransactionFilterType.ASSET" class="flex items-center">
                    <div class="h-3 w-3 bg-green-300 inline-block mr-1"></div> <span class="text-xs text-gray-500">{{$t('general.enabled')}}</span>
                    <div class="h-3 w-3 bg-red-300 inline-block mr-1 ml-3"></div> <span class="text-xs text-gray-500">{{$t('general.disabled')}}</span>
                </div>
                
                
                <select v-model="selectedTxnType" @change="changeSearchTxnType" class="w-44 border uppercase border-gray-200 px-2 py-1 focus:outline-none">
                    <option value="all" class="text-sm ">ALL</option>
                    <option v-bind:key="txnType.value" v-for="txnType in txnTypeList" :value="txnType.value" class="text-sm ">{{ txnType.value.toUpperCase() }}</option>
                </select>
                
            </div>
            <div v-if="boolIsTxnFetched" class="mt-3">
                <MixedTxnDataTable v-if="selectedTxnType === 'all'" :selectedGroupType="transactionGroupType.CONFIRMED"  :transactions="mixedTransactions" :currentAddress="accAddress"></MixedTxnDataTable>
                <TransferTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.TRANSFER" :selectedGroupType="transactionGroupType.CONFIRMED"  :transactions="transferTransactions" :currentAddress="accAddress"></TransferTxnDataTable>
                <AccountTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.ACCOUNT" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="accountTransactions" :currentAddress="accAddress"></AccountTxnDataTable>
                <AggregateTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.AGGREGATE" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="aggregateTransactions" :currentAddress="accAddress"></AggregateTxnDataTable>
                <AliasTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.ALIAS" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="aliasTransactions" :currentAddress="accAddress"></AliasTxnDataTable>
                <AssetTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.ASSET" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="assetTransactions" :currentAddress="accAddress"></AssetTxnDataTable>
                <ChainTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.CHAIN" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="chainTransactions" :currentAddress="accAddress"></ChainTxnDataTable>
                <ExchangeTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.EXCHANGE" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="exchangeTransactions" :currentAddress="accAddress"></ExchangeTxnDataTable>
                <LinkTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.LINK" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="linkTransactions" :currentAddress="accAddress"></LinkTxnDataTable>
                <LockTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.LOCK" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="lockTransactions" :currentAddress="accAddress"></LockTxnDataTable>
                <MetadataTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.METADATA" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="metadataTransactions" :currentAddress="accAddress"></MetadataTxnDataTable>
                <NamespaceTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.NAMESPACE" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="namespaceTransactions" :currentAddress="accAddress"></NamespaceTxnDataTable>
                <RestrictionTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.RESTRICTION" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="restrictionTransactions" :currentAddress="accAddress"></RestrictionTxnDataTable>
                <SecretTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.SECRET" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="secretTransactions" :currentAddress="accAddress"></SecretTxnDataTable>
                <SdaExchangeTxnDT v-else-if="selectedTxnType === TransactionFilterType.SDA_EXCHANGE"  :transactions="sdaExchangeTransactions"></SdaExchangeTxnDT>

            </div>
            <div v-else class="border-t border-b border-gray-200 text-gray-400 text-xs mt-10">
                <div class="border-t border-b border-gray-200 my-3 py-6 px-2">
                    <div class="flex justify-center items-center border-gray-400">
                        <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-navy-primary mr-2"></div>
                        {{$t('dashboard.fetchingTx')}}
                    </div>
                </div>
            </div>
            <a :href="linkToExplorer()" target=_new v-if="searchedTransactions.length==10"><div class="text-right text-xs text-blue-primary mt-3" >View more...</div></a>
        </div>
    </div>
</div>
</template>

<script setup lang='ts'>
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { TransactionFilterType, TransactionFilterTypes } from "@/modules/dashboard/model/transactions/transactionFilterType";
import { DashboardService } from "@/modules/dashboard/service/dashboardService";
import { walletState } from "@/state/walletState";
import { Helper } from "@/util/typeHelper";
import { computed, ref, watch } from "vue";
import MixedTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/MixedTxnDataTable.vue';
import TransferTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/TransferTxnDataTable.vue';
import AccountTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/AccountTxnDT.vue';
import AggregateTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/AggregateTxnDT.vue';
import AliasTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/AliasTxnDT.vue';
import AssetTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/AssetTxnDT.vue';
import ChainTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/ChainTxnDT.vue';
import ExchangeTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/ExchangeTxnDT.vue';
import LinkTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/LinkTxnDT.vue';
import LockTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/LockTxnDT.vue';
import MetadataTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/MetadataTxnDT.vue';
import NamespaceTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/NamespaceTxnDT.vue';
import RestrictionTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/RestrictionTxnDT.vue';
import SecretTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/SecretTxnDT.vue';
import { AppState } from "@/state/appState";
import { Transaction } from "tsjs-xpx-chain-sdk";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { networkState } from "@/state/networkState";
import { ConfirmedSdaExchangeTransaction } from "@/modules/dashboard/model/transactions/confirmed/sdaExchange";
import SdaExchangeTxnDT from "@/modules/dashboard/components/TransactionDataTable/SdaExchangeTxnDT.vue";

    const props = defineProps({
        address: String
    })
    let selectedTxnType = ref("all") 
    let transactionGroupType = Helper.getTransactionGroupType()
    let selectedTxnGroupType = transactionGroupType.CONFIRMED; 
    const searchedTransactions = ref([]); 
    const mixedTransactions  = ref([]);
    const transferTransactions  = ref([]);
    const accountTransactions = ref([]);
    const aggregateTransactions = ref([]);
    const aliasTransactions = ref([]);
    const assetTransactions = ref([]);
    const namespaceTransactions = ref([]);
    const metadataTransactions = ref([]);
    const exchangeTransactions = ref([]);
    const lockTransactions = ref([]);
    const linkTransactions = ref([]);
    const restrictionTransactions = ref([]);
    const secretTransactions = ref([]);
    const chainTransactions = ref([]);
    const sdaExchangeTransactions = ref<ConfirmedSdaExchangeTransaction []>([])
    let boolIsTxnFetched = ref(false);
    let allTxnQueryParams = Helper.createTransactionQueryParams();
    let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);
    allTxnQueryParams.updateFieldOrder(blockDescOrderSortingField);

    let txnTypeList = Object.entries(TransactionFilterType).map(([label, value])=>({label, value}));
    const acc = computed(()=>{
        if(!walletState.currentLoggedInWallet){
            return null
        }
        let acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == props.address) || walletState.currentLoggedInWallet.others.find((add) => add.address == props.address);
        if(!acc){
            return null
        }
        return acc
    })
    const accAddress = computed(()=> acc.value?acc.value.address:'');
    let dashboardService = new DashboardService(walletState.currentLoggedInWallet, acc.value);
    const formatConfirmedTransaction = async(transactions :Transaction[])=>{
        let formattedTxns = [];
        allTxnQueryParams.embedded = true;
        switch(selectedTxnType.value){ 
        case TransactionFilterType.TRANSFER:
            formattedTxns = await dashboardService.formatConfirmedMixedTxns(transactions);
            break;
        case TransactionFilterType.ACCOUNT:
            formattedTxns = await dashboardService.formatConfirmedAccountTransaction(transactions);
            break;
        case TransactionFilterType.AGGREGATE:
            formattedTxns = await dashboardService.formatConfirmedAggregateTransaction(transactions);
            break;
        case TransactionFilterType.RESTRICTION:
            formattedTxns = await dashboardService.formatConfirmedRestrictionTransaction(transactions);
            break;
        case TransactionFilterType.SECRET:
            formattedTxns = await dashboardService.formatConfirmedSecretTransaction(transactions);
            break;
        case TransactionFilterType.ALIAS:
            formattedTxns = await dashboardService.formatConfirmedAliasTransaction(transactions);
            break;
        case TransactionFilterType.ASSET:
            formattedTxns = await dashboardService.formatConfirmedAssetTransaction(transactions);
            break;
        case TransactionFilterType.METADATA:
            formattedTxns = await dashboardService.formatConfirmedMetadataTransaction(transactions);
            break;
        case TransactionFilterType.CHAIN:
            formattedTxns = await dashboardService.formatConfirmedChainTransaction(transactions);
            break;
        case TransactionFilterType.EXCHANGE:
            formattedTxns = await dashboardService.formatConfirmedExchangeTransaction(transactions);
            break;
        case TransactionFilterType.LINK:
            formattedTxns = await dashboardService.formatConfirmedLinkTransaction(transactions);
            break;
        case TransactionFilterType.LOCK:
            formattedTxns = await dashboardService.formatConfirmedLockTransaction(transactions);
            break;
        case TransactionFilterType.NAMESPACE:
            formattedTxns = await dashboardService.formatConfirmedNamespaceTransaction(transactions);
            break;

        case TransactionFilterType.SDA_EXCHANGE:
            formattedTxns = await dashboardService.formatConfirmedSdaExchangeTransaction(transactions)
            break;

        default:
            allTxnQueryParams.embedded = false;
            formattedTxns = await dashboardService.formatConfirmedMixedTxns(transactions);
            break;
        }

        return formattedTxns;
    }

    const changeSearchTxnType = () =>{
      boolIsTxnFetched.value = false;
      searchedTransactions.value = [];
      let txnFilterGroup = selectedTxnType.value; 
      allTxnQueryParams.embedded = true
      /* allTxnQueryParams.firstLevel = false */

      switch (txnFilterGroup) {
        case TransactionFilterType.TRANSFER:
          allTxnQueryParams.type = TransactionFilterTypes.getTransferTypes();
          break;
        case TransactionFilterType.ACCOUNT:
          allTxnQueryParams.type = TransactionFilterTypes.getAccountTypes();
          break;
        case TransactionFilterType.ASSET:
          allTxnQueryParams.type = TransactionFilterTypes.getAssetTypes();
          break;
        case TransactionFilterType.ALIAS:
          allTxnQueryParams.type = TransactionFilterTypes.getAliasTypes();
          break;
        case TransactionFilterType.NAMESPACE:
          allTxnQueryParams.type = TransactionFilterTypes.getNamespaceTypes();
          break;
        case TransactionFilterType.METADATA:
          allTxnQueryParams.type = TransactionFilterTypes.getMetadataTypes();
          break;
        case TransactionFilterType.CHAIN:
          allTxnQueryParams.type = TransactionFilterTypes.getChainTypes();
          break;
        case TransactionFilterType.EXCHANGE:
          allTxnQueryParams.type = TransactionFilterTypes.getExchangeTypes();
          break;
        case TransactionFilterType.AGGREGATE:
          allTxnQueryParams.type = TransactionFilterTypes.getAggregateTypes();
          break;
        case TransactionFilterType.LINK:
          allTxnQueryParams.type = TransactionFilterTypes.getLinkTypes();
          break;
        case TransactionFilterType.LOCK:
          allTxnQueryParams.type = TransactionFilterTypes.getLockTypes();
          break;
        case TransactionFilterType.SECRET:
          allTxnQueryParams.type = TransactionFilterTypes.getSecretTypes();
          break;
        case TransactionFilterType.RESTRICTION:
          allTxnQueryParams.type = TransactionFilterTypes.getRestrictionTypes();
          break;
        case TransactionFilterType.SDA_EXCHANGE:
          allTxnQueryParams.type = TransactionFilterTypes.getSdaExchangeTypes();
          break;

        default:
          allTxnQueryParams.type = undefined;
          allTxnQueryParams.embedded = false
          allTxnQueryParams.firstLevel = true
          break;
      }

      searchTransaction();
    }

    const linkToExplorer = ()=>{ 
        if(!networkState.currentNetworkProfile){ 
            return ''
        }
        return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.addressRoute + '/' + props.address
      }

    const searchTransaction = async() =>{
        allTxnQueryParams.pageSize = 10
        allTxnQueryParams.pageNumber = 1;
        allTxnQueryParams.publicKey = acc.value.publicKey;
        
        let transactionSearchResult = await dashboardService.searchTxns(selectedTxnGroupType, allTxnQueryParams);
        let formattedTxns = await formatConfirmedTransaction(transactionSearchResult.transactions);
        let txnFilterGroup = selectedTxnType.value;
        switch (txnFilterGroup) {
          case TransactionFilterType.TRANSFER:
            transferTransactions.value = formattedTxns
            searchedTransactions.value = transferTransactions.value
            break;
          case TransactionFilterType.ACCOUNT:
            accountTransactions.value = formattedTxns
            searchedTransactions.value = accountTransactions.value
            break;
          case TransactionFilterType.ASSET:
            assetTransactions.value = formattedTxns
            searchedTransactions.value = assetTransactions.value
            break;
          case TransactionFilterType.ALIAS:
            aliasTransactions.value = formattedTxns
            searchedTransactions.value = aliasTransactions.value
            break;
          case TransactionFilterType.NAMESPACE:
            namespaceTransactions.value = formattedTxns
            searchedTransactions.value = namespaceTransactions.value
            break;
          case TransactionFilterType.METADATA:
            metadataTransactions.value = formattedTxns
            searchedTransactions.value = metadataTransactions.value
            break;
          case TransactionFilterType.CHAIN:
            chainTransactions.value = formattedTxns
            searchedTransactions.value = chainTransactions.value
            break;
          case TransactionFilterType.EXCHANGE:
            exchangeTransactions.value = formattedTxns
            searchedTransactions.value = exchangeTransactions.value
            break;
          case TransactionFilterType.AGGREGATE:
            aggregateTransactions.value = formattedTxns
            searchedTransactions.value = aggregateTransactions.value
            break;
          case TransactionFilterType.LINK:
            linkTransactions.value = formattedTxns
            searchedTransactions.value = linkTransactions.value
            break;
          case TransactionFilterType.LOCK:
            lockTransactions.value = formattedTxns
            searchedTransactions.value = lockTransactions.value
            break;
          case TransactionFilterType.SECRET:
            secretTransactions.value = formattedTxns
            searchedTransactions.value = secretTransactions.value
            break;
          case TransactionFilterType.RESTRICTION:
            restrictionTransactions.value = formattedTxns
            searchedTransactions.value = restrictionTransactions.value
            break;
            case TransactionFilterType.SDA_EXCHANGE:
            sdaExchangeTransactions.value = formattedTxns
            searchedTransactions.value = restrictionTransactions.value
            break;
          default:
            mixedTransactions.value = formattedTxns
            searchedTransactions.value = mixedTransactions.value
            break;
        }
        boolIsTxnFetched.value = true;
    }
    const init = ()=>{
      searchTransaction()
    }

    if(AppState.isReady){ 
      init();
    }
    else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
          init();
          readyWatcher();
        }
      });
    }

</script>