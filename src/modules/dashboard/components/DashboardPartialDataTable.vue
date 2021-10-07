<template>
  <div>
    <DataTable
      :value="transactions"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      >
      <Column field="typeName" header="Type" headerStyle="width:110px">
        <template #body="{data}">
          <span class="font-semibold">{{data.typeName}}</span>
        </template>
      </Column>
      <Column field="signer" header="Signer" headerStyle="width:110px">
        <template #body="{data}">
          <span :title="data.signer" class="font-semibold truncate inline-block">
            <a :href="getPublicKeyExplorerUrl(data.signer)" target="_blank">
              {{ data.signerDisplay === data.signerAddressPretty ? data.signer : data.signerDisplay }}
            </a>
          </span>
        </template>
      </Column>
      <Column header="Details" >
        <template #body="{data}">
          <div v-if="data.innerTransactions">
            <div v-for="innerTx in data.innerTransactions" :key="innerTx">
              <div class="grid grid-cols-12">
                <div class="col-span-9">
                  <div class="font-bold">
                    <span class="align-middle">{{ innerTx.typeName }} </span>
                  </div>
                  <div class="flex space-x-2 pt-1 pb-1" v-for="displayRow in innerTx.displayTips" :key="displayRow">
                    <span v-for="displayTip in displayRow.rowTips" :key="displayTip" >
                      <span v-if="displayTip.tipType === 'toRightArrow'">
                        <font-awesome-icon icon="arrow-right" class="text-gray-600 inline-block"></font-awesome-icon>
                      </span>
                      <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'asset'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                        <a :href="getAssetExplorerUrl(displayTip.displayValue)" target="_blank">
                          <img class="inline-block" src="@/modules/account/img/icon-mosaics-green-16h.svg" width="15" />
                          {{ displayTip.displayValue }}
                        </a>
                      </span>
                      <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'namespace' || displayTip.tipType === 'namespaceId'" class="text-xs font-semibold bg-yellow-400 inline-block truncate px-2 py-2 rounded">
                        <a :href="getNamespaceExplorerUrl(displayTip.displayValue)" target="_blank">
                          <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                          {{ displayTip.displayValue }}
                        </a>
                      </span>
                      <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'publicKey'" class="text-xs font-semibold bg-gray-300 inline-block truncate px-2 py-2 rounded">
                        <a :href="getPublicKeyExplorerUrl(displayTip.displayValue)" target="_blank">
                          {{ displayTip.displayValue }}
                        </a>
                      </span>
                      <span :title="displayTip.value2" v-else-if="displayTip.tipType === 'publicKeyString'" class="text-xs font-semibold bg-gray-300 inline-block truncate-lg px-2 py-2 rounded">
                        <a :href="getPublicKeyExplorerUrl(displayTip.value2)" target="_blank">
                          {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'empty'" class="border border-black text-xs font-semibold bg-gray-50 inline-block px-2 py-2 rounded">
                        {{ displayTip.displayValue }}
                      </span>
                      <span v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'other'" class="text-xs font-semibold bg-green-50 inline-block px-2 py-2 rounded">
                        {{ displayTip.displayValue }}
                      </span>
                      <span :title="displayTip.value" v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'plain'" class="text-xs font-semibold bg-blue-200 inline-block px-2 py-2 rounded">
                        <a @click="$emit('openMessage', displayTip.value)">
                          {{ displayTip.displayValue }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'message' && displayTip.valueType === 'encrypted'" class="text-xs font-semibold bg-blue-200 inline-block px-2 py-2 rounded">
                        <a @click="$emit('openDecryptMsg', {txType: data.typeName, sender: innerTx.signer, initialSigner: data.signer, message: displayTip.value, recipient: innerTx.extractedData.recipient, recipientType: innerTx.extractedData.recipientType})">
                          {{ displayTip.displayValue }}
                        </a>
                      </span>
                      <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'absoluteAmount'" class="text-xs font-semibold bg-yellow-50 inline-block px-2 py-2 rounded">
                        {{ displayTip.displayValue }}
                      </span>
                      <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'exactAmount'" class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                        {{ displayTip.displayValue }} 
                      </span>
                      <span :title="displayTip.displayValue" v-else-if="displayTip.tipType === 'address'" class="text-xs font-semibold bg-green-300 inline-block truncate px-2 py-2 rounded">
                        <a :href="getAddressExplorerUrl(displayTip.value)" target="_blank">
                          {{ displayTip.displayValue }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'transfer'" class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                        <a :href="getAddressExplorerUrl(displayTip.value)" :title="displayTip.value" class="truncate-lg inline-block" target="_blank">
                          {{ displayTip.displayValue }}
                        </a>
                        <font-awesome-icon icon="arrow-right" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                        <a :href="getAddressExplorerUrl(displayTip.value2)" :title="displayTip.value2" class="truncate-lg inline-block" target="_blank">
                          {{ displayTip.displayValue2 }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'transferUnresolved'" class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                        <a :href="getAddressExplorerUrl(displayTip.value)" :title="displayTip.value" class="truncate-lg inline-block" target="_blank">
                          {{ displayTip.displayValue }}
                        </a>
                        <font-awesome-icon icon="arrow-right" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                        <a :href="getAddressExplorerUrl(displayTip.value2)" :title="displayTip.value2" class="truncate-lg inline-block" target="_blank">
                          {{ displayTip.displayValue2 }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'addressRestrictMod'" class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                        <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                          {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'namespaceAmount'" class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded"> 
                        <a :href="getNamespaceExplorerUrl(displayTip.value2)" target="_blank">
                          {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'assetAmount'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                        <a :href="getAssetExplorerUrl(displayTip.value2)" target="_blank">
                          <img class="inline-block" src="@/modules/account/img/icon-mosaics-green-16h.svg" width="15" />
                          {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'hash'" class="text-xs font-semibold bg-yellow-100 inline-block px-2 py-2 rounded">
                        <a :href="getHashExplorerUrl(displayTip.value)" target="_blank">
                          {{ displayTip.displayValue }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'assetAlias'">
                        <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                          <font-awesome-icon icon="at" class="text-gray-600 inline-block mr-1"></font-awesome-icon>
                          <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                            {{ displayTip.displayValue }}
                          </a>
                        </span>
                        <font-awesome-icon icon="equals" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                        <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                          <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                            <img class="inline-block mr-1" src="@/modules/account/img/icon-mosaics-green-16h.svg" width="15" />
                            {{ displayTip.displayValue2 }}
                          </a>
                        </span>
                      </span>
                      <span v-else-if="displayTip.tipType === 'removeAssetAlias'" >
                        <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                          <font-awesome-icon icon="at" class="text-gray-600 inline-block mr-1"></font-awesome-icon>
                          <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                            {{ displayTip.displayValue }}
                          </a>
                        </span>
                        <font-awesome-icon icon="equals" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                        <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                          <a :href="getAssetExplorerUrl(displayTip.value2)" target="_blank">
                            <img class="inline-block mr-1" src="@/modules/account/img/icon-mosaics-green-16h.svg" width="15" />
                            {{ displayTip.displayValue2 }}
                          </a>
                        </span>
                      </span>
                      <span v-else-if="displayTip.tipType === 'addressAlias'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                        <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                          <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                          <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                            {{ displayTip.displayValue }}
                          </a>
                        </span>
                        <font-awesome-icon icon="equals" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                        <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                          <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                            {{ displayTip.displayValue2 }}
                          </a>
                        </span>
                      </span>
                      <span v-else-if="displayTip.tipType === 'removeAddressAlias'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                        <span class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                          <font-awesome-icon icon="at" class="text-gray-600 inline-block"></font-awesome-icon>
                          <a :href="getNamespaceExplorerUrl(displayTip.value)" target="_blank">
                            {{ displayTip.displayValue }}
                          </a>
                        </span>
                        <font-awesome-icon icon="not-equal" class="ml-2 mr-2 text-gray-600 inline-block"></font-awesome-icon>
                        <span class="text-xs font-semibold bg-green-300 inline-block px-2 py-2 rounded">
                          <a :href="getAddressExplorerUrl(displayTip.value2)" target="_blank">
                            {{ displayTip.displayValue2 }}
                          </a>
                        </span>
                      </span>
                      <span v-else-if="displayTip.tipType === 'linkPublicKey'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                        <font-awesome-icon icon="link" class="ml-2 mr-2 text-blue-600 inline-block"></font-awesome-icon>
                        <a :href="getPublicKeyExplorerUrl(displayTip.value)" target="_blank">
                          {{ displayTip.displayValue }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'unlinkPublicKey'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                        <font-awesome-icon icon="unlink" class="ml-2 mr-2 text-blue-600 inline-block"></font-awesome-icon>
                        <a :href="getPublicKeyExplorerUrl(displayTip.value)" target="_blank">
                          {{ displayTip.displayValue }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'supplyAmount'" class="text-xs font-semibold inline-block px-2 py-2 rounded">
                        {{ displayTip.displayValue }}{{ displayTip.displayValue2 }}
                      </span>
                      <span v-else-if="displayTip.tipType === 'supplyAssetAmount'" class="text-xs font-semibold bg-yellow-300 inline-block px-2 py-2 rounded">
                        <a :href="getAssetExplorerUrl(displayTip.value2)" target="_blank">
                           {{ displayTip.displayValue }}
                          <img class="inline-block ml-1 mr-1" src="@/modules/account/img/icon-mosaics-green-16h.svg" width="15" />{{ displayTip.displayValue2 }}
                        </a>
                      </span>
                      <span v-else-if="displayTip.tipType === 'msgNamespace'" class="text-xs font-semibold bg-yellow-400 inline-block px-2 py-2 rounded">
                        <a :href="getNamespaceExplorerUrl(displayTip.value2)" target="_blank">
                          {{ displayTip.displayValue }} {{ displayTip.displayValue2 }}
                        </a>
                      </span>
                      <span :title="displayTip.displayValue" v-else class="text-xs font-semibold bg-blue-300 inline-block px-2 py-2 rounded">
                        {{ displayTip.displayValue }}
                      </span>
                    </span>
                  </div>
                </div>
                <div class="col-span-3">
                  <div v-if="innerTx.numToApprove">
                    <div>Multisig Info: {{ innerTx.numToApprove }} to Approve</div>
                    <div v-for="cosigner in innerTx.directParent" :key="cosigner">
                      <span class="pt-1 truncate inline-block">
                        <a :href="getPublicKeyExplorerUrl(publicKey)" class="ml-1 mr-1" target="_blank">{{ convertPublicKeyToName(cosigner) }}</a>
                      </span>
                    </div>
                  </div>
                  <div class="mt-2">Signers:</div>
                  <div v-for="publicKey in innerTx.signerPublicKeys" :key="publicKey">
                    <span class="pt-1 truncate inline-block">
                      <a :href="getPublicKeyExplorerUrl(publicKey)" class="ml-1 mr-1" target="_blank">{{ convertPublicKeyToName(publicKey) }}</a>  
                    </span> 
                    <span class="pt-1 inline-block align-middle"> - {{ data.signedPublicKeys.includes(publicKey) ? "signed" : "to sign" }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Column>
      <Column headerStyle="width: 12%" v-if="showAction" header="Action" >
        <template #body="{data}">
          <SplitButton label="Explorer" @click="gotoHashExplorer(data.hash)" icon="pi pi-external-link" class="p-button-help p-mb-2" :model="setSplitButtonItems(data)"></SplitButton>
        </template>
      </Column>
      <template #empty>
        {{$t('services.norecord')}}
      </template>
      <template #loading>
          {{$t('dashboard.loadingmessage')}}
      </template>
    </DataTable>
  </div>
</template>

<script>
import { getCurrentInstance, ref, computed, watch  } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { Helper } from "@/util/typeHelper";
import Tooltip from 'primevue/tooltip';
import { TipType } from '../model/dashboardClasses'
import SplitButton from 'primevue/splitbutton';

export default{
  components: { DataTable, Column, SplitButton },
  name: 'DashboardDataTable',
  props: {
    transactions: Array,
    showBlock: Boolean,
    showAction: Boolean,
    type: String
  },
  emits: ['openMessage', 'openDecryptMsg'],
  directives: {
    'tooltip': Tooltip
  },
  setup(p, context){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const borderColor = ref('border border-gray-400');
    const showTransactionModel = ref(false);
    const modalData = ref(null);
    const filterText = ref("");
    const isShowConfirmed = p.type === "confirmed" ? true : false;
    const isShowUnconfirmed = p.type === "unconfirmed" ? true : false;
    const isShowPartial = p.type === "partial" ? true : false;
    /*
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    */
    watch(
     ()=> filterText.value, (newValue)=>{
       context.emit('confirmedFilter', newValue);
    });

    const nsHint = "\`ns:\` - filter by Namespace (ID or name)";
    const nsHint2 = "\`ns:-\` - filter with Namespace Name alias";
    const nsHint3 = "\`ns:'\` - convert namespace name to Namespace ID, will ignore when invalid";
    const hashHint = "\`hash:\` - filter Transaction Hash ";
    const pkHint = "\`pk:\` - Public Key";
    const assetHint = "\`asset:\` - filter by Asset ID";
    const addressHint = "\`add:\` - filter by Address"; 

    const hints = [hashHint, assetHint, pkHint, addressHint, nsHint, nsHint2, nsHint3].join('\n');

    const currentNetworkType = computed(()=> networkState.currentNetworkProfile.network.type);
    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const blockExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.blockRoute);
    const publicKeyExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.publicKeyRoute);
    const addressExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.addressRoute);
    const hashExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.hashRoute);
    const namespaceExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute);
    const assetExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.assetInfoRoute);

    const convertPublicKeyToName = (publicKey)=>{

      let address = Helper.createPublicAccount(publicKey, currentNetworkType.value).address.plain();
      let name = walletState.currentLoggedInWallet? walletState.currentLoggedInWallet.convertAddressToName(address, true): address;
      
      return name === address ? publicKey : name;
    };

    const dynamicModelComponentDisplay = ref('TransferTransactionModal');

    const clickInputText = () => {
      borderColor.value = 'border border-white-100 drop-shadow';
    };

    const blurInputText = () => {
      borderColor.value = 'border border-gray-400';
    };

    const rowClick = (e) => {
      // console.log(e.data.typeName);
      console.log(e.data);
      switch(e.data.typeName){
        case 'Transfer':
          dynamicModelComponentDisplay.value = 'TransferTransactionModal';
          break;
        case 'LockFund':
          dynamicModelComponentDisplay.value = 'LockFundModal';
          break;
        case 'Aggregate Bonded':
          dynamicModelComponentDisplay.value = 'AggregateBondedModal';
          break;
        case 'Aggregate Complete':
          dynamicModelComponentDisplay.value = 'AggregateBondedModal';
          break;
        default:
          dynamicModelComponentDisplay.value = 'TransferTransactionModal';
      }
      showTransactionModel.value = true;
      // modalData.value = Object.assign({}, e.data);
      modalData.value = e.data;
    };

    emitter.on("CLOSE_MODAL", payload => {
      showTransactionModel.value = payload;
    });

    const emitOpenCosign = (hash) =>{
      context.emit("openCosign", hash);
    }

    const setSplitButtonItems = (data) =>{

      let items = [
            {
                label: 'Cosign',
                icon: 'pi pi-external-link',
                command: () => {
                  emitOpenCosign(data.hash);
                }
            },
        /*
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    //toast.add({severity:'success', summary:'Updated', detail:'Data Updated', life: 3000});
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    //toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
                }
            },
            {
                label: 'Vue Website',
                icon: 'pi pi-external-link',
                command: () => {
                    window.location.href = 'https://vuejs.org/'
                }
            },
            {   label: 'Upload',
                icon: 'pi pi-upload',
                command: () => {
					          //window.location.hash = "/fileupload"
				        }
            }
            */
        ];

      return items;
    }

    const getPublicKeyExplorerUrl = (publicKey) =>{

      return explorerBaseURL.value + publicKeyExplorerURL.value + "/" + publicKey
    }

    const getNamespaceExplorerUrl = (namespaceIdHex) =>{

      return explorerBaseURL.value + namespaceExplorerURL.value + "/" + namespaceIdHex
    }

    const getAssetExplorerUrl = (assetIdHex) =>{

      return explorerBaseURL.value + assetExplorerURL.value + "/" + assetIdHex
    }

    const getAddressExplorerUrl = (address) =>{

      return explorerBaseURL.value + addressExplorerURL.value + "/" + address
    }

    const getHashExplorerUrl = (hash) =>{

      return explorerBaseURL.value + hashExplorerURL.value + "/" + hash
    }

    const gotoHashExplorer = (hash)=>{
      window.open(explorerBaseURL.value + hashExplorerURL.value + "/" + hash, "_blank");
    }

    return {
      borderColor,
      filterText,
      clickInputText,
      blurInputText,
      modalData,
      rowClick,
      showTransactionModel,
      dynamicModelComponentDisplay,
      blockExplorerURL,
      addressExplorerURL,
      assetExplorerURL,
      namespaceExplorerURL,
      hashExplorerURL,
      publicKeyExplorerURL,
      explorerBaseURL,
      hints,
      getPublicKeyExplorerUrl,
      getNamespaceExplorerUrl,
      getAssetExplorerUrl,
      getAddressExplorerUrl,
      getHashExplorerUrl,
      setSplitButtonItems,
      gotoHashExplorer,
      isShowConfirmed,
      isShowUnconfirmed,
      isShowPartial,
      convertPublicKeyToName
    }
  }
}
</script>

<style lang="scss">
.p-datatable-tbody{
  td{
    font-size: 11px;
  }
}

.truncate {
  max-width: 10em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate-lg {
  max-width: 15em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate-lg.inline-block{
  vertical-align: middle;
}

.truncate.inline-block{
  vertical-align: middle;
}

.inline-block{
  .truncate{
    vertical-align: middle;
  }

  .truncate-lg{
    vertical-align: middle;
  }
}

.p-splitbutton-defaultbutton{
  .p-button-label{
    padding-left: 5px;
    padding-right: 5px;
  }
}

.p-menu{
  background-color: white;
  min-width: 105px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 10px;
  padding-bottom: 10px;

  .p-menuitem-link{
    padding-bottom: 3px;
    padding-top: 3px;

    .p-menuitem-icon{
      padding: 5px;
    }

    .p-menuitem-text{
      padding-right: 30px;
    }

    &:hover{
      --tw-bg-opacity: 1;
      background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
    }
  }
}

</style>