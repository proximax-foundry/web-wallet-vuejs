<template>
  <div class="md:grid md:grid-cols-2 mb-8">
    <div class="w-full text-center md:text-left mx-0 lg:mx-5">
      <div class="font-bold hover:bg-gray-100 cursor-pointer inline-block py-1 px-2 pl-0 rounded-lg" @click="openSetDefaultModal = !openSetDefaultModal">
        <font-awesome-icon icon="caret-down" class="h-5 w-5 text-gray-600 inline-block"></font-awesome-icon>&nbsp;{{ selectedAccountName }} 
        <div v-if="isMultisig" class="text-xs font-normal ml-1 inline-block px-2 py-1 rounded bg-blue-200" >MultiSig</div>
        <div v-if="isDefault" class="text-xs font-normal ml-1 inline-block px-2 py-1 rounded bg-yellow-200">Default</div>
      </div>
      <div class="text-xs mb-2">
        <div class="relative inline-block overflow-x-hidden address_div">
          <div class="absolute z-20 h-full"></div>
          <div
            id="address"
            class=" outline-none z-10 break-all" :copyValue="selectedAccountAddressPlain" copySubject="Address"
          >{{ selectedAccountAddress }}</div>
        </div>
        <div class="mt-2 sm:inline-block relative">
          <font-awesome-icon icon="copy" @click="copy('address')" class="w-5 h-5 text-gray-500 text-md cursor-pointer inline mx-2" style="top: 3px;"></font-awesome-icon>
          <img src="@/modules/dashboard/img/icon-qr-code.svg" @click="showAddressQRModal = true" class="w-5 inline absolute">
        </div>
      </div>
      <div class="text-center md:text-left">
        <div class="inline-block mr-4"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 h-5 inline mr-1"><span class="text-xs">{{ selectedAccountBalance }} {{ currentNativeTokenName }}</span></div>
        <div class="inline-block" v-if="displayConvertion"><img src="@/assets/img/icon-usd-blue.svg" class="w-5 inline mr-1"><span class="text-xs" >USD {{ currencyConvert }}</span></div>
      </div>
    </div>

    <div class="w-full mt-5 md:mt-0">
      <div class="text-md text-center sm:text-right lg:text-left">Transactions: <span>{{ confirmedTransactions.length + unconfirmedTransactions.length }}</span></div>
      <div class="xs:text-center sm:text-right lg:text-left">
        <div class="mt-2">
          <div class="rounded-full bg-blue-primary text-white w-24 h-15 px-2 py-1 mr-3 inline-block" :class="confirmedTransactions.length>0?'cursor-pointer':''" @click="clickConfirmedTransaction()">
            <div class="flex justify-between">
              <div class="rounded-full text-white border pt-1 pl-1 w-6 h-6 relative"><font-awesome-icon icon="check" class="w-4 h-3 absolute" style="top: 6px;"></font-awesome-icon></div>
              <div class="text-xs font-bold flex items-center">{{ filteredConfirmedTransactions.length }}</div>
            </div>
          </div>
          <div class="rounded-full bg-blue-300 text-white w-24 h-15 px-2 py-1 mr-3 inline-block" :class="unconfirmedTransactions.length>0?'cursor-pointer':''" @click="clickUnconfirmedTransaction()">
            <div class="flex justify-between">
              <div class="rounded-full text-white border pt-1 pl-1 w-6 h-6 relative"><font-awesome-icon icon="exclamation" class="w-4 h-3 absolute" style="left: 8px; top: 6px;"></font-awesome-icon></div>
              <div class="text-xs font-bold flex items-center">{{ unconfirmedTransactions.length }}</div>
            </div>
          </div>
          <div class="rounded-full bg-yellow-500 text-white w-24 h-15 px-2 py-1 inline-block" :class="partialTransactions.length>0?'cursor-pointer':''" @click="clickPartialTransactions()">
            <div class="flex justify-between">
              <img src="@/modules/dashboard/img/icon-transaction-partial-white.svg" class="w-6 h-6" />
              <div class="text-xs font-bold flex items-center">{{ partialTransactions.length }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12">
    <div class="col-start-2 col-span-10">
      <div class="grid grid-cols-12">
          <div class="text-md col-start-5 col-span-2 rounded font-thick " 
          :class="namespaceAssetView == 0 ? 'bg-blue-500 text-white' : 'bg-gray-400 text-black'" @click="namespaceAssetView = 0">
            Namespaces
          </div>
          <div class="text-md col-span-2 rounded" 
            :class="namespaceAssetView == 1 ? 'bg-blue-500 text-white' : 'bg-gray-400 text-black'" @click="namespaceAssetView = 1">
            Other Assets
          </div>
      </div>
      <div class="grid grid-cols-12">
        <div class="col-span-12 py-2">
          <NamespaceDataTable v-if="namespaceAssetView == 0" :namespaces="selectedAccountNamespaces" />
          <AssetDataTable v-if="namespaceAssetView == 1" :assets="selectedAccountAssets" />
        </div>
      </div>
    </div>
  </div>

  <div>
    <DashboardDataTable :showBlock="true" @confirmedFilter="doFilterConfirmed" :transactions="finalConfirmedTransaction.sort((a, b) => b.block - a.block)" v-if="isShowConfirmed"></DashboardDataTable>
    <DashboardDataTable :showBlock="false" :transactions="unconfirmedTransactions" v-if="isShowUnconfirmed"></DashboardDataTable>
    <PartialDashboardDataTable :transactions="partialTransactions.sort((a, b) => b.deadline - a.deadline)" v-if="isShowPartial"></PartialDashboardDataTable>
    <SetAccountDefaultModal @dashboardSelectAccount="updateSelectedAccount" :toggleModal="openSetDefaultModal" />
    <AddressQRModal :showModal="showAddressQRModal" :qrDataString="addressQR" :addressName="selectedAccountName" />
  </div>
</template>

<script>
import { computed, defineComponent, ref, getCurrentInstance, watch, reactive } from 'vue';
import DashboardDataTable from '@/modules/dashboard/components/DashboardDataTable.vue';
import AssetDataTable from '@/modules/dashboard/components/AssetDataTable.vue';
import NamespaceDataTable from '@/modules/dashboard/components/NamespaceDataTable.vue';
import PartialDashboardDataTable from '@/components/PartialDashboardDataTable.vue';
import SetAccountDefaultModal from '@/modules/dashboard/components/SetAccountDefaultModal.vue';
import AddressQRModal from '@/modules/dashboard/components/AddressQRModal.vue';
import { copyToClipboard, getXPXcurrencyPrice } from '@/util/functions';
import { Helper } from '@/util/typeHelper';
import { transactions } from '@/util/transactions.js';
// eslint-disable-next-line no-unused-vars
import { PublicAccount, Order, QueryParams } from "tsjs-xpx-chain-sdk";
import { transferEmitter } from '@/util/listener.js';
import { useToast } from "primevue/usetoast";
import { Wallet } from "@/models/wallet";
import { walletState } from '@/state/walletState';
import { ChainUtils } from '@/util/chainUtils';
import { networkState } from "@/state/networkState";
import { AccountAPI } from '@/models/REST/account';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { DashboardService } from '../service/dashboardService';
import * as qrcode from 'qrcode-generator';
// import { dashboardUtils } from '@/util/dashboardUtils';

export default defineComponent({
  name: 'ViewDashboard',
  components: {
    DashboardDataTable,
    PartialDashboardDataTable,
    SetAccountDefaultModal,
    AddressQRModal,
    AssetDataTable,
    NamespaceDataTable
  },

  setup(){
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const showAddressQRModal = ref(false);
    const namespaceAssetView = ref(0);

    const displayConvertion = ref(false);
    const openSetDefaultModal = ref(false);

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);

    let currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount() ? walletState.currentLoggedInWallet.selectDefaultAccount() : walletState.currentLoggedInWallet.accounts[0];
    currentAccount.default = true;

    let selectedAccount = ref(currentAccount);

    const selectedAccountPublicKey = computed(()=> selectedAccount.value.publicKey);
    const selectedAccountAddress = computed(()=> Helper.createAddress(selectedAccount.value.address).pretty());
    const selectedAccountAddressPlain = computed(()=> selectedAccount.value.address);
    const selectedAccountDirectChilds = computed(()=> {
      let multisigInfo = selectedAccount.value.multisigInfo.find((x)=> x.level === 0);

      if(multisigInfo){
        return multisigInfo.getMultisigAccountsAddress();
      }
      else{
        return [];
      }
    });

    const selectedAccountNamespaces = computed(()=>{
      
      let formattedNamespaces = [];
      let namespaces = selectedAccount.value.namespaces;

      for(let i=0; i < namespaces.length; ++i){
        
        let linkName = ""

        switch (namespaces[i].linkType) {
          case 1:
            linkName = "Asset";
            break;
          case 2:
            linkName = "Address";
            break;
        
          default:
            break;
        }

        let data = {
          idHex: namespaces[i].idHex,
          name: namespaces[i].idHex,
          linkType: linkName,
          linkedId: linkName === "Address" ? Helper.createAddress(namespaces[i].linkedId).pretty() : namespaces[i].linkedId,
          active: namespaces[i].active
        };
        
        formattedNamespaces.push(data);
      }

      return formattedNamespaces;
    });

    const selectedAccountAssets = computed(()=>{

      let formattedAssets = [];
      let assets = selectedAccount.value.assets;

      for(let i=0; i < assets.length; ++i){

        let namespaceAlias = [];

        let assetId = assets[i].idHex;

        if(assetId === networkState.currentNetworkProfile.network.currency.assetId){
          continue;
        }

        let namespaces = selectedAccount.value.findNamespaceNameByAsset(assetId);

        for(let i =0; i < namespaces.length; ++i){
          let aliasData = {
            idHex: namespaces[i].idHex,
            name: namespaces[i].name
          };

          namespaceAlias.push(aliasData);
        }

        let data = {
          idHex: assetId,
          owner: assets[i].owner,
          amount: Helper.toCurrencyFormat(assets[i].getExactAmount(), assets[i].divisibility),
          alias: namespaceAlias,
          active: true
        };
        
        formattedAssets.push(data);
      }

      return formattedAssets;
    });

    const selectedAccountBalance = computed(
      () => {          
        return Helper.toCurrencyFormat(selectedAccount.value.balance, currentNativeTokenDivisibility.value);
      }
    );

    const selectedAccountName = computed(
      () => {
        return selectedAccount.value.name;
      }
    );

    const addressQR = computed(
      () => {
        let qr = qrcode(10, 'H');
        qr.addData(selectedAccountAddress.value);
        qr.make();
        return qr.createDataURL();
      }
    )

    const isDefault = computed(()=> selectedAccount.value.default ? true : false );
    let isMultisig = computed(()=> selectedAccount.value.multisigInfo.find((multisigInfo)=> multisigInfo.level == 1) ? true : false);

    const getCurrencyPrice = () => {
      let balance = selectedAccount.value.balance;
      getXPXcurrencyPrice(balance).then((total) => {
        currencyConvert.value = Helper.toCurrencyFormat(total, 6);
      });
    };

    let confirmedTransactions = ref([]);
    let unconfirmedTransactions = ref([]);
    let partialTransactions = ref([]);

    let finalConfirmedTransaction = ref([]);
    
    let allConfirmedTransactions = ref([]);
    let allUnconfirmedTransactions = ref([]);
    let allPartialTransactions = ref([]);
    let filteredConfirmedTransactions = ref([]);

    watch(allConfirmedTransactions, (newValue) => {
        let addressToSearch = [selectedAccountAddressPlain.value];
        addressToSearch = addressToSearch.concat(selectedAccountDirectChilds.value);
        filteredConfirmedTransactions.value = newValue.filter((tx)=> tx.relatedAddress.some((address)=> addressToSearch.includes(address)));
        finalConfirmedTransaction.value = filteredConfirmedTransactions.value;
    });

    DashboardService.fetchConfirmedTransactions(walletState.currentLoggedInWallet).then((txs)=>{
      //console.log(txs);
      allConfirmedTransactions.value = txs;
    });

    let filteredUnconfirmedTransactions = computed(()=> []);
    let filteredPartialTransactions = computed(()=> []);

    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);

      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    
    // get USD conversion
    const currencyConvert = ref('');

    if(networkState.currentNetworkProfile.network.currency.name === "XPX"){
      displayConvertion.value = true;
      getCurrencyPrice();

      watch(selectedAccountBalance, () => {
        getCurrencyPrice();
      });
    }

    // const confirmedTransactions = ref<ConfirmedTransaction[]>([]);
    // const unconfirmedTransactions = ref<UnconfirmedTransaction[]>([]);
    // const aggregateBondedTransactions = ref<AggregateBondedTransaction[]>([]);
    // const pageSize:number = 10;
    const isShowConfirmed = ref(true);
    const isShowUnconfirmed = ref(false);
    const isShowPartial = ref(false);

    const clickConfirmedTransaction = () => {
      isShowConfirmed.value = true;
      isShowUnconfirmed.value = false;
      isShowPartial.value = false;
    };

    const clickUnconfirmedTransaction = () => {
      if(unconfirmedTransactions.value.length > 0){
        isShowUnconfirmed.value = true;
        isShowConfirmed.value = false;
        isShowPartial.value = false;
      }
    };

    const clickPartialTransactions = () => {
      if(partialTransactions.value.length > 0){
        isShowPartial.value = true;
        isShowConfirmed.value = false;
        isShowUnconfirmed.value = false;
      }
    };

    const doFilterConfirmed = (input)=>{
      
      if(input == ""){
        finalConfirmedTransaction.value = filteredConfirmedTransactions.value;
        return;
      }

      let indexOfType = input.indexOf(':');
      let type = "none";
      let value = "";

      if(indexOfType > -1){
        type = input.substr(0,input.indexOf(':'));
        value = input.substr(input.indexOf(':')+1);
      }

      if(value){
        switch (type) {
          case "ns":
          case 'namespace':
            let nsToSearch = new RegExp(value.toUpperCase());
            if(["'",'"', "-"].includes(value.substr(0, 1))){
              let convertingValue = value.substr(1);
              if(convertingValue == ""){
                return;
              }
              try {
                let nsHex = Helper.createNamespaceId(convertingValue.toLowerCase()).toHex().toUpperCase();
                
                if(value.substr(0, 1) === "-"){
                  if(convertingValue === networkState.currentNetworkProfile.network.currency.namespace){
                    let assetToSearch = new RegExp(networkState.currentNetworkProfile.network.currency.assetId.toUpperCase());
                    finalConfirmedTransaction.value = filteredConfirmedTransactions.value.filter((tx)=> tx.relatedAsset.some((asset)=> assetToSearch.test(asset)));
                    return;
                  }
                  else{
                    nsToSearch = new RegExp(nsHex);
                    let mosaicAliasTx = filteredConfirmedTransactions.value.find(
                      (tx)=> tx.typeName === "Mosaic Alias" && tx.relatedNamespace.some((ns)=> nsToSearch.test(ns))
                    );

                    if(mosaicAliasTx){
                      let assetsToSearch = mosaicAliasTx.relatedAsset;
                      finalConfirmedTransaction.value = filteredConfirmedTransactions.value.filter((tx)=> tx.relatedAsset.some((asset)=> assetsToSearch.include(asset)));
                      return;
                    }
                    else{
                      let addressAliasTx = filteredConfirmedTransactions.value.find(
                        (tx)=> tx.typeName === "Address Alias" && tx.relatedNamespace.some((ns)=> nsToSearch.test(ns))
                      );

                      if(addressAliasTx){
                        let addressToSearch = addressAliasTx.relatedAddress;
                        finalConfirmedTransaction.value = filteredConfirmedTransactions.value.filter((tx)=> tx.relatedAddress.some((address)=> addressToSearch.include(address)));
                        return;
                      }
                    }
                    
                    return;
                  }
                }
                else{
                  nsToSearch = new RegExp(nsHex);
                }
                
              } catch (error) {
                return;
              }
            }

            finalConfirmedTransaction.value = filteredConfirmedTransactions.value.filter((tx)=> tx.relatedNamespace.some((ns)=> nsToSearch.test(ns)));
            break;
          case 'address':
          case 'add':
            let addressToSearch = new RegExp(value.toUpperCase().split('-').join(""));
            finalConfirmedTransaction.value = filteredConfirmedTransactions.value.filter((tx)=> tx.relatedAddress.some((address)=> addressToSearch.test(address)));
            break;
          case 'pk':
          case 'publicKey':
          case 'publickey':
            let pkToSearch = new RegExp(value.toUpperCase());
            finalConfirmedTransaction.value = filteredConfirmedTransactions.value.filter((tx)=> tx.relatedPublicKey.some((pk)=> pkToSearch.test(pk)));
            break;
          case 'asset':
          case 'mosaic':
            let assetToSearch = new RegExp(value.toUpperCase());
            finalConfirmedTransaction.value = filteredConfirmedTransactions.value.filter((tx)=> tx.relatedAsset.some((asset)=> assetToSearch.test(asset)));
            break;
          case 'hash':
            let hashToSearch = new RegExp(value.toUpperCase());
            finalConfirmedTransaction.value = filteredConfirmedTransactions.value.filter((tx)=> hashToSearch.test(tx.hash));
            break;
          case 'none':
          default:
            let searchString = new RegExp(value);
            finalConfirmedTransaction.value = filteredConfirmedTransactions.value.filter((tx)=> tx.searchString.some((searchStr)=> searchString.test(searchStr)));
            break;
        }
      }
      else{
        let searchString = new RegExp(input);
        finalConfirmedTransaction.value = filteredConfirmedTransactions.value.filter((tx)=> tx.searchString.some((searchStr)=> searchString.test(searchStr)));
      }
    }

    const updateSelectedAccount = (data)=>{     
      if(data.type == 0){
        selectedAccount.value = walletState.currentLoggedInWallet.accounts.find((account)=> account.name === data.name);
      }
      else{
        selectedAccount.value = walletState.currentLoggedInWallet.others.find((account)=> account.name === data.name);
      }
    }

    // const generateNames = () => {
    //   // let wallet = new Wallet(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletState.currentLoggedInWallet.accounts);
    //   if (walletState.currentLoggedInWallet) {

    //     let contact : Array<contactInterface> = [];
    //     var accountCount = walletState.currentLoggedInWallet.accounts.length;
    //     walletState.currentLoggedInWallet.accounts.forEach((element, index) => {
    //       contact.push({
    //         address: element.address,
    //         name: element.name + ' - Owner\'s account',
    //         id: (index + 1),
    //       });
    //     });
    //     if(walletState.currentLoggedInWallet.contacts!=undefined){
    //       walletState.currentLoggedInWallet.contacts.forEach((element, index) => {
    //         contact.push({
    //           address: element.address,
    //           name: element.name + ' - Contact',
    //           id: (accountCount + index + 1),
    //         });
    //       });
    //     }
    //     return contact;
    //   }else{
    //     return '';
    //   }
    // };
    // let names = generateNames();

    // let accountApiInstance = new AccountAPI(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint));

    // const getTransaction = (publicAccount, item, pageSize:number, lastId:string = '') => {
    //   let order = Order.ASC;
    //   let qp = new QueryParams(pageSize, lastId, order);
    //   let lastTransactionID = lastId;
    //   // format names
    //   accountApiInstance.transactions(publicAccount, qp).then(tx => {
    //     if( tx.length > 0 ){
    //       tx.forEach((t)=>{
    //         let formattedTransaction = dashboardUtils.formatTransaction(t, names);
    //         confirmedTransactions.value.push(formattedTransaction);
    //         // lastTransactionID = t.transactionInfo.id;
    //         lastTransactionID = null;
    //       })
    //     }
    //     if(tx.length == pageSize){
    //       // run again
    //       getTransaction(publicAccount, item, pageSize, lastTransactionID);
    //     }
    //   }, error => {
    //     console.error(error);
    //   });
    // };

    // const getUnconfirmedTransaction = (publicAccount, item, pageSize, lastId = null) => {
    //   let order = Order.ASC;
    //   let qp = new QueryParams(pageSize, lastId, order);
    //   let lastTransactionID = lastId;
    //   accountApiInstance.unconfirmedTransactions(publicAccount, qp).then(tx => {
    //     if( tx.length > 0 ){
    //       tx.forEach((t)=>{
    //         let formattedTransaction = dashboardUtils.formatTransaction(t, names);
    //         unconfirmedTransactions.value.push(formattedTransaction);
    //         // lastTransactionID = t.transactionInfo.id;
    //         lastTransactionID = null;
    //       })
    //     }
    //     if(tx.length == pageSize){
    //       // run again
    //       getUnconfirmedTransaction(publicAccount, item, pageSize, lastTransactionID);
    //     }
    //   }, error => {
    //     console.error(error);
    //   });
    // };

    // const getAggregateBondedTransaction = (publicAccount, item, pageSize, lastId = null) => {
    //   let order = Order.ASC;
    //   let qp = new QueryParams(pageSize, lastId, order);
    //   let lastTransactionID = lastId;
    //   accountApiInstance.aggregateBondedTransactions(publicAccount, qp).then(tx => {
    //     // console.log('AggregateBonded - partial length: ' + tx.length);
    //     if( tx.length > 0 ){
    //       tx.forEach((t)=>{
    //         // console.log(t)
    //         let formattedTransaction = dashboardUtils.formatAggregateBondedTransaction(t, names);
    //         aggregateBondedTransactions.value.push(formattedTransaction);
    //         lastTransactionID = t.transactionInfo.id;
    //       });
    //     }
    //     if(tx.length == pageSize){
    //       // run again
    //       getAggregateBondedTransaction(publicAccount, item, pageSize, lastTransactionID);
    //     }
    //   }, error => {
    //     console.error(error);
    //   });
    // };

    // // eslint-disable-next-line no-unused-vars
    // const getConfirmedAllTransactions = () => {
    //   walletState.currentLoggedInWallet.accounts.forEach((item) => {
    //     const publicAccount = PublicAccount.createFromPublicKey(item.publicAccount.publicKey, ChainUtils.getNetworkType(networkState.chainNetwork));
    //     getTransaction(publicAccount, item, pageSize);
    //     getUnconfirmedTransaction(publicAccount, item, pageSize);
    //     getAggregateBondedTransaction(publicAccount, item, pageSize);
    //   });
    // };

    // getConfirmedAllTransactions();

    /*transferEmitter.on("UPDATE_DASHBOARD", payload => {
        switch(payload.from){
          case 'confirmed':{
            // console.log(payload.from)
            // console.log(payload.transaction)
            let formattedconfirmedListenerTransaction = transactions.formatTransaction(payload.transaction, names);
            confirmedTransactions.value.push(formattedconfirmedListenerTransaction);
            // console.log('Confirmed rows after addition: ' + confirmedTransactions.value.length)
            break;
          }
          case 'unconfirmedAdded':{
            // console.log(payload.from)
            // console.log(payload.transaction)
            let formattedUnconfirmedAddedTransaction = transactions.formatTransaction(payload.transaction, names);
            unconfirmedTransactions.value.push(formattedUnconfirmedAddedTransaction);
            break;
          }
          case 'aggregateBondedAdded':{
            // console.log(payload.from);
            // console.log(payload.transaction);
            payload.transaction.innerTransactions.forEach( (innerTransaction) =>{
              if(transactions.getNameTypeTransaction(innerTransaction.type) == 'modifyMultisigAccount'){
                let formattedaggregateBondedAddedListenerTransaction = transactions.formatAggregateBondedTransaction(payload.transaction, names);
                aggregateBondedTransactions.value.push(formattedaggregateBondedAddedListenerTransaction);
              }else{
                let formattedConfirmedListenerTransaction = transactions.formatTransaction(payload.transaction, names);
                confirmedTransactions.value.push(formattedConfirmedListenerTransaction);
              }
            });
            // console.log('Aggregate bonded rows after addition: ' + confirmedTransactions.value.length)
            break;
          }
          case 'cosignatureAdded':{
            console.log(payload.from)
            console.log(payload.transaction)
            // let formattedCosignatureAddedListenerTransaction = transactions.formatTransaction(payload.transaction, names);
            // confirmedTransactions.value.push(formattedCosignatureAddedListenerTransaction);
            break;
          }
          case 'unconfirmedRemoved':{
            // console.log(payload.from)
            // console.log('Hash to remove: ' + payload.hash)
            let remaining = unconfirmedTransactions.value.filter((element) => element.hash != payload.hash);
            // console.log('after unconfirmedRemoved: ' + remaining.length);
            // unconfirmedTransactions.value = Object.assign({}, remaining);
            unconfirmedTransactions.value = remaining;
            break;
          }
          case 'aggregateBondedRemoved':{
            // console.log(payload.from)
            // console.log('Hash to remove: ' + payload.hash)
            // check on dashboarddatatable
            let remaining = unconfirmedTransactions.value.filter((element) => element.hash != payload.hash);
            // console.log('after aggregateBondedRemoved: ' + remaining.length);
            unconfirmedTransactions.value = remaining;
            // check on partialdatatable
            let partialRemaining = aggregateBondedTransactions.value.filter((element) => element.hash != payload.hash);
            // console.log('after partialAggregateBondedRemoved: ' + partialRemaining.length);
            aggregateBondedTransactions.value = partialRemaining;
            break;
          }
        }
        // getConfirmedAllTransactions();
    });
    */


    emitter.on('CLOSE_SET_DEFAULT_ACCOUNT_MODAL', payload => {
      if(payload){
        openSetDefaultModal.value = false;
      }
    });

    emitter.on('CLOSE_MODAL', () => {
      showAddressQRModal.value = false;
    });

    return {
      copy,
      selectedAccountBalance,
      selectedAccountName,
      confirmedTransactions,
      unconfirmedTransactions,
      partialTransactions,
      isShowConfirmed,
      isShowUnconfirmed,
      isShowPartial,
      clickConfirmedTransaction,
      clickUnconfirmedTransaction,
      clickPartialTransactions,
      openSetDefaultModal,
      currencyConvert,
      displayConvertion,
      currentNativeTokenName,
      selectedAccountAddress,
      selectedAccountAddressPlain,
      updateSelectedAccount,
      isDefault,
      isMultisig,
      finalConfirmedTransaction,
      doFilterConfirmed,
      filteredConfirmedTransactions,
      addressQR,
      showAddressQRModal,
      namespaceAssetView,
      selectedAccountNamespaces,
      selectedAccountAssets
    };
  }
});
</script>
<style lang="scss" scoped>
.address_div{
    top: 4px;
}

#address{
  width: 350px;
  @extend .text-xs !optional;
}

@media (min-width: 640px) {
  .address_div{
    top: 0px;
  }
}

@media (min-width: 1280px) {
  .address_div{
    top: 4px;
  }

  #address{
    width: 480px;
    @extend .text-sm !optional;
  }
}

</style>