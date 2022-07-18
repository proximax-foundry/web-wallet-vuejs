<template>
  <div>
    <DataTable
      :value="transaction"
      :paginator="true"
      :rows="20"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      responsiveLayout="scroll"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      >
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">{{$t('dashboard.txHash')}}</div>
            <div class=" uppercase font-bold text-txs">
              <span class="text-txs text-blue-primary cursor-pointer" v-if="data.groupType!='In Queue'"  @click="gotoHashExplorer(data.hash)" v-tooltip.right="data.hash">{{data.hash.substring(0, 20) }}...</span>
              <span class="text-txs" v-else v-tooltip.right="data.hash">{{data.hash.substring(0, 20) }}...</span>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('dashboard.type')}}</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-txs mr-2">{{data.type}}</div>
              <div>
                <img src="@/modules/dashboard/img/icon-txn-in.svg" class="inline-block w-5" v-if="data.in_out === true">
                <img src="@/modules/dashboard/img/icon-txn-out.svg" class="inline-block w-5" v-else-if="data.in_out === false">
              </div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5" v-if="data.recipient != '' && data.recipient != null">Receipient</div>
            <div class="uppercase font-bold text-txs">
              <span v-if="data.recipient === '' || data.recipient === null"></span>
              <span v-tooltip.right="Helper.createAddress(data.recipient).pretty()" v-else-if="data.recipientNamespaceName" class="truncate inline-block text-txs">{{ data.recipientNamespaceName }}</span>
              <span v-tooltip.right="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-block text-txs">{{ data.recipient.substring(0, 20) }}...</span>
            </div>
          </div>
        </template>
      </Column>
      <Column style="width: 200px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('general.sender')}}</div>
            <div class="uppercase font-bold text-txs">
              <span v-if="data.sender === '' || data.sender === null"></span>
              <span v-else v-tooltip.right="Helper.createAddress(data.sender).pretty()" class="truncate inline-block text-txs">
                <a :href="getPublicKeyExplorerUrl(data.sender)" target="_blank">
                  {{ data.sender.substring(0, 20) }}...
                </a>
              </span>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('dashboard.txAmount')}}</div>
            <div class="text-txs uppercase font-bold" >{{ data.amountTransfer ? data.amountTransfer:'-' }} <b v-if="data.amountTransfer">{{ nativeTokenName }}</b></div>
          </div>
        </template>
      </Column>
      <Column :header="$t('dashboard.inOut')" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-txn-in.svg" class="inline-block" v-if="data.in_out === true">
            <img src="@/modules/dashboard/img/icon-txn-out.svg" class="inline-block" v-else-if="data.in_out === false">
          </div>
        </template>
      </Column>
      <Column field="hash" :header="$t('dashboard.txHash')" headerStyle="width:100px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span v-if="data.groupType!='In Queue'" @click="gotoHashExplorer(data.hash)" class="cursor-pointer text-txs text-blue-primary" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</span>
          <span v-else class="text-txs" v-tooltip.bottom="data.hash">{{data.hash.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column field="type" :header="$t('dashboard.type')" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">{{data.type}}</span>
        </template>
      </Column>
      <Column field="formattedDeadline" :header="$t('general.deadline')" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span class="text-txs">{{Helper.formatDeadline(data.deadline)}}</span>
        </template>
      </Column>
      <Column field="signer" :header="$t('general.sender')" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span v-if="data.sender === '' || data.sender === null"></span>
          <span v-else v-tooltip.bottom="Helper.createAddress(data.sender).pretty()" class="truncate inline-block text-txs">
            <a :href="getPublicKeyExplorerUrl(data.sender)" target="_blank">
              {{ data.sender }}
            </a>
          </span>
        </template>
      </Column>
      <Column field="recipient" :header="$t('general.recipient')" headerStyle="width:110px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <span v-if="data.recipient === '' || data.recipient === null"></span>
          <span v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else-if="data.recipientNamespaceName" class="truncate inline-block text-txs">{{ data.recipientNamespaceName }}</span>
          <span v-tooltip.bottom="Helper.createAddress(data.recipient).pretty()" v-else class="truncate inline-block text-txs">{{ data.recipient.substring(0, 20) }}...</span>
        </template>
      </Column>
      <Column :header="$t('general.amount')" headerStyle="width:90px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-txs" >{{ data.amountTransfer ? data.amountTransfer:'-' }} <b v-if="data.amountTransfer">{{ nativeTokenName }}</b></div>
        </template>
      </Column>
      <Column :header="$t('general.sda')" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div class="text-center">
            <img src="@/modules/dashboard/img/icon-proximax-logo-gray.svg" class="inline-block" v-if="checkOtherAsset(data.sda)" v-tooltip.left="'<tiptitle>' +t('general.sdaFull')+'</tiptitle><tiptext>' + displayAsset(data.sda) + '</tiptext>'">
            <span v-else>-</span>
          </div>
        </template>
      </Column>
      <Column :header="$t('general.message')" headerStyle="width:40px;text-transform:uppercase" v-if="wideScreen">
        <template #body="{data}">
          <div>
            <img src="@/modules/dashboard/img/icon-message.svg" v-tooltip.left="{ value: '<tiptitle>' + data.messageTypeTitle + '</tiptitle><tiptext>' + data.message + '</tiptext>', escape: true }" class="inline-block" v-if="data.message && data.messageType !== 1">
            <div v-else class="w-full text-center">-</div>
          </div>
        </template>
      </Column>
      <Column headerStyle="width:50px">
        <template #body="{data}">
            <!-- <img v-if="data.groupType=='unconfirmed'" src="@/modules/dashboard/img/icon-open_in_new_black.svg" @click="gotoHashExplorer(data.hash)" class="cursor-pointer"> -->
            <div v-if="data.groupType=='unconfirmed'" class="cursor-pointer">Unconfirmed</div>
            <router-link v-else-if="data.groupType=='partial'" :to="{ name: 'ViewTransactionSign', params: {txnHash: data.hash}}" class="bg-orange-action text-white font-bold text-xxs text-center p-3 flex items-center justify-center">
                <img src="@/modules/transaction/img/icon-sign-own.svg" class="mr-2">
                {{$t('transaction.waitingSignature_s')}}
            </router-link>
            <div v-if="data.groupType=='In Queue'">In Queue</div>
        </template>
      </Column>
      <template #empty>
        {{$t('general.noRecord')}}
      </template>
      <template #loading>
          {{$t('dashboard.fetchingTx')}}
    </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import Tooltip from 'primevue/tooltip';
export default {
   name:'PendingDataTable',
   directives: {
    'tooltip': Tooltip
  },
}
</script>
<script setup lang='ts'>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Helper } from '@/util/typeHelper';
import { networkState } from '@/state/networkState';
import { AppState } from '@/state/appState';

    const props = defineProps({
        transaction: Array
    })
    const nativeToken = computed(()=>AppState.nativeToken.label)
    const wideScreen = ref(false) 
    const screenResizeHandler = () => {
        if(window.innerWidth < 1024){
            wideScreen.value = false;
        }else{
            wideScreen.value = true;
        }
    };
    screenResizeHandler();

    onMounted(() => { 
      window.addEventListener("resize", screenResizeHandler);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", screenResizeHandler);
    });

    const hashExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.hashRoute);
    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const publicKeyExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.publicKeyRoute);
    const getPublicKeyExplorerUrl = (publicKey :string) :string=>{
      return explorerBaseURL.value + publicKeyExplorerURL.value + "/" + publicKey
    }
    const getHashExplorerUrl = (hash) =>{
      return explorerBaseURL.value + hashExplorerURL.value + "/" + hash
    }
    const gotoHashExplorer = (hash)=>{
      window.open(explorerBaseURL.value + hashExplorerURL.value + "/" + hash, "_blank");
    }

    const checkOtherAsset = (assets) => {
      if(assets){
        if(assets.length > 0){
          return true;
        }
      }
      return false;
    }

    const d = (assets) :Promise<string> => {
      return displayAsset(assets).then(data => {
        return data;
      })
    }

    const convertLocalTime = (dateTimeInJSON)=>{
      return Helper.convertDisplayDateTimeFormat24(dateTimeInJSON);
    };

    const displayAsset = async (assets) => {
      let asset_divs = '';
      if(assets.length > 0){
        for(const asset of assets){
          let asset_div = await displayAssetDiv(asset);
          asset_divs += asset_div;
        }
        return asset_divs;
      }
    }

    const displayAssetDiv = async (asset) => {
      let otherAsset = await AppState.chainAPI.assetAPI.getMosaic(asset.assetid);
      let asset_div;
      let arrayAsset = []
      arrayAsset.push(asset.assetid);

      let nsAsset = await AppState.chainAPI.assetAPI.getMosaicsNames(arrayAsset);
      if(nsAsset[0].names.length > 0){
        asset_div = (Helper.convertToExact(asset.amount, otherAsset.divisibility) + ' ' + nsAsset[0].names[0].name);
      }else{
        asset_div = (asset.asset + ' - ' + Helper.convertToExact(asset.amount, otherAsset.divisibility) + AppState.nativeToken.label);
      }
      return asset_div;
    }
</script>
