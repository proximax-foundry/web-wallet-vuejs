<template>
  <div>
    <div class="px-2 sm:px-10 bg-gray-200 pb-8 pt-5">
      <div class="md:grid md:grid-cols-4">
        <div class="pr-2">
          <div class="shadow-md w-full relative overflow-x-hidden address_div px-7 py-3 rounded-lg balance-div flex flex-col justify-between bg-navy-primary text-white">
            <div class="text-right">
              <div class="inline-block text-txs font-bold text-blue-primary pappflex items-center rounded-b-sm"><img src="@/modules/dashboard/img/icon-bookmark.svg" class="w-3 h-3 mr-1 inline-block">DEFAULT ACCOUNT</div><br>
              <div class="inline-block text-txs underline xl:text-sm cursor-pointer" @click="openSetDefaultModal = !openSetDefaultModal">My Personal Account</div>
            </div>
            <div>
              <div class="mt-1 text-gray-300 text-txs">CURRENT BALANCE</div>
              <div class="flex items-center"><div class="inline-block"><span class="font-bold text-lg">{{ selectedAccountBalanceFront }}</span>{{ selectedAccountBalanceBack?'.':'' }}<span class="text-xs">{{ selectedAccountBalanceBack }}</span> <span class="font-bold text-lg">{{ currentNativeTokenName }}</span></div><img src="@/modules/dashboard/img/icon-xpx.svg" class="inline-block w-4 h-4 ml-4"></div>
              <div class="text-gray-300 text-txs mt-1">Estimate US$ {{ currencyConvert }}</div>
            </div>
            <div class="flex justify-between mt-2">
              <div>
                <router-link :to="{ name: 'ViewTransferCreate'}"  class="flex items-center mb-3"><img src="@/assets/img/icon-header-account.svg" class="w-4 h-4 cursor-pointer mr-1"><div class="text-xs font-bold inline-block" style="margin-top: 1px">Top Up XPX</div><img src="@/modules/dashboard/img/icon-info.svg" class="w-3 h-3 ml-2 inline-block"></router-link>
              </div>
              <router-link :to="{ name: 'ViewTransferCreate'}"  class="flex items-center mb-3"><img src="@/modules/dashboard/img/icon-send-xpx.svg" class="w-4 h-4 cursor-pointer mr-1"><div class="text-xs font-bold" style="margin-top: 1px">Transfer XPX</div></router-link>
            </div>
            
          </div>
        </div>
        <div class="px-2">
          <div class="shadow-md w-full relative inline-block overflow-x-hidden address_div bg-gray-50 px-5 py-4 rounded-lg default-div">
            <div class="text-gray-400 text-txs mt-7 mb-2">WALLET ADDRESS</div>
            <div class="flex items-center justify-between mb-8">
              <div id="address" class="font-bold outline-none break-all text-tsm" :copyValue="selectedAccountAddressPlain" copySubject="Address">{{ selectedAccountAddress }}</div>
              <img src="@/modules/dashboard/img/icon-copy.svg" class="w-4 cursor-pointer ml-4" @click="copy('address')">
            </div>
            <div class="flex justify-between w-full">
              <div class="my-2 flex items-center"><a href="https://bctestnetfaucet.xpxsirius.io/#/" target=_new><img src="@/modules/dashboard/img/icon-qr_code.svg" class="w-4 h-4 cursor-pointer mr-1 inline-block"><span class="text-xs" style="margin-top: 1px">Request XPX</span></a></div>
              <div class="my-2 flex items-center"><img src="@/modules/dashboard/img/icon-key.svg" class="w-4 h-4 cursor-pointer mr-1"><div class="text-xs" style="margin-top: 1px">Convert to Multisig</div></div>
            </div>
          </div>
        </div>
        <div class="col-span-2 pl-2">
          <div class="shadow-md w-full relative overflow-x-hidden address_div bg-navy-primary px-7 py-4 rounded-lg transaction-div flex flex-row justify-evenly items-center text-white">
            <div class="text-center">
              <div class="flex items-center justify-center"><img src="@/modules/dashboard/img/icon-successful-transaction.svg" class="w-4 h-4 cursor-pointer mr-1 inline-block"><div class="inline-block text-md">{{ filteredConfirmedTransactions.length }}</div></div>
              <div class="text-xs mt-3">Succesful<br>Transactions</div>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center"><img src="@/modules/dashboard/img/icon-unconfirmed-transaction.svg" class="w-4 h-4 cursor-pointer mr-1 inline-block"><div class="inline-block text-md">{{ filteredUnconfirmedTransactions.length }}</div></div>
              <div class="text-xs mt-3">Unconfirmed<br>Transactions</div>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center"><img src="@/modules/dashboard/img/icon-waiting-for-transaction.svg" class="w-4 h-4 cursor-pointer mr-1 inline-block"><div class="inline-block text-md">{{ filteredPartialTransactions.length }}</div></div>
              <div class="text-xs mt-3">Waiting for<br>Signing</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-left px-2 sm:px-10 bg-gray-200">
      <div class="transition-all flex items-end">
        <div class="text-xs inline-block px-3 rounded-t-sm py-3" :class="`${ displayBoard=='overview'?'bg-white text-gray-primary':'cursor-pointer' }`" @click="displayBoard='overview'">Overview</div>
        <div class="text-xs inline-block px-3 rounded-t-sm py-3" :class="`${ displayBoard=='asset'?'bg-white text-gray-primary':'cursor-pointer' }`" @click="displayBoard='asset'">Assets</div>
        <div class="text-xs inline-block px-3 rounded-t-sm py-3" :class="`${ displayBoard=='namespace'?'bg-white text-gray-primary':'cursor-pointer' }`" @click="displayBoard='namespace'">Namespaces</div>
        <div class="text-xs inline-block px-3 rounded-t-sm py-3" :class="`${ displayBoard=='transaction'?'bg-white text-gray-primary':'cursor-pointer' }`" @click="displayBoard='transaction'">All Transactions</div>
      </div>
    </div>
    <div class="bg-white px-2 sm:px-10 pt-12" v-if="displayBoard=='overview'">
      <div class="text-txs text-gray-400"><b class="text-gray-700">ASSETS</b> ({{ selectedAccountAssetsCount }} - <span class="cursor-pointer" @click="displayBoard='asset'">View all</span>)</div>
      <DashboardAssetDataTable :assets="selectedAccount.assets.slice(0, 5)" :account="selectedAccount" :currentPublicKey="selectedAccountPublicKey" />
      <div class="text-txs text-gray-400 mt-10"><b class="text-gray-700">NAMESPACES</b> ({{ selectedAccountNamespaceCount }} - View all)</div>
      <DashboardNamespaceDataTable :namespaces="selectedAccount.namespaces.slice(0, 5)" :currentBlockHeight="currentBlock" :account="selectedAccount" />
      <div class="text-txs text-gray-400 mt-10"><b class="text-gray-700">RECENT TRANSACTIONS</b> ({{ filteredConfirmedTransactions.length }} - View all)</div>
      <DashboardDataTable :showBlock="true" :showAction="true" @openMessage="openMessageModal" @confirmedFilter="doFilterConfirmed" @openDecryptMsg="openDecryptMsgModal" :transactions="finalConfirmedTransaction.sort((a, b) => b.block - a.block).slice(0, 5)" v-if="isShowConfirmed" type="confirmed" :currentAddress="selectedAccountAddressPlain"></DashboardDataTable>
      <div class="mt-10 flex">
        <div class=" md:w-1/2">
          <div class="mb-8 font-bold uppercase text-txs">Create something new</div>
          <div class="flex flex-wrap">
            <div class="flex items-center w-80 mb-2">
              <div class="bg-gray-100 rounded-md w-12 h-12 inline-block"></div>
              <div class="inline-block ml-2 dashboard-link">
                <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="text-tsm mb-1 relative top-1 text-blue-link">Create Namespace</router-link>
                <p class="text-txs w-60">Create an on-chain unique place for your business and your assets.</p>
              </div>
            </div>
            <div class="flex items-center w-80 mb-2">
              <div class="bg-gray-100 rounded-md w-12 h-12 inline-block"></div>
              <div class="inline-block ml-2 dashboard-link">
                <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="text-tsm mb-1 relative top-1 text-blue-link">Create an Asset</router-link>
                <p class="text-txs w-60">An asset could be a token that has a unique identifier and configurable properties.</p>
              </div>
            </div>
            <div class="flex items-center w-80mb-2">
              <div class="bg-gray-100 rounded-md w-12 h-12 inline-block"></div>
              <div class="inline-block ml-2 dashboard-link">
                <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="text-tsm mb-1 relative top-1 text-blue-link">Create New Account</router-link>
                <p class="text-txs w-60">Create an on-chain unique place for your business and your assets.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="md:w-1/2">
          <div class="mb-8 font-bold text-txs uppercase">Getting started guide</div>
          <div class="text-tsm">
            <div class="mb-2"><a href=#>Guide Overview <img src="@/modules/dashboard/img/icon-new-page-link.svg" class="w-3 h-3 ml-2 inline-block"></a></div>
            <div class="mb-2"><a href=#>What is ProximaX Sirius Chain <img src="@/modules/dashboard/img/icon-new-page-link.svg" class="w-3 h-3 ml-2 inline-block"></a></div>
            <div class="mb-2"><a href=#>What is Namespace <img src="@/modules/dashboard/img/icon-new-page-link.svg" class="w-3 h-3 ml-2 inline-block"></a></div>
            <div class="mb-2"><a href=#>What is Asset <img src="@/modules/dashboard/img/icon-new-page-link.svg" class="w-3 h-3 ml-2 inline-block"></a></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white px-2 sm:px-10 pt-12" v-else-if="displayBoard=='asset'">
      <DashboardAssetDataTable :assets="selectedAccount.assets" :account="selectedAccount" :currentPublicKey="selectedAccountPublicKey" />
    </div>
    <div class="bg-white px-2 sm:px-10 pt-12" v-else-if="displayBoard=='namespace'">
      <DashboardNamespaceDataTable :namespaces="selectedAccount.namespaces" :currentBlockHeight="currentBlock" :account="selectedAccount" />
    </div>
    <div class="bg-white px-2 sm:px-10 pt-12" v-else-if="displayBoard=='transaction'">
      <DashboardDataTable :showBlock="true" :showAction="true" @openMessage="openMessageModal" @confirmedFilter="doFilterConfirmed" @openDecryptMsg="openDecryptMsgModal" :transactions="finalConfirmedTransaction.sort((a, b) => b.block - a.block)" v-if="isShowConfirmed" type="confirmed" :currentAddress="selectedAccountAddressPlain"></DashboardDataTable>
    </div>
    <SetAccountDefaultModal @dashboardSelectAccount="updateSelectedAccount" :toggleModal="openSetDefaultModal" />
  </div>
</template>

<script>
import { computed, defineComponent, ref, getCurrentInstance, watch } from 'vue';
import {ResolvedNamespace} from '@/modules/dashboard/model/resolvedNamespace';
import {AmountType, TipType} from '@/modules/dashboard/model/dashboardClasses';
import DashboardDataTable from '@/modules/dashboard/components/DashboardDataTable.vue';
import DashboardPartialDataTable from '@/modules/dashboard/components/DashboardPartialDataTable.vue';
import DashboardAssetDataTable from '@/modules/dashboard/components/DashboardAssetDataTable.vue';
import DashboardNamespaceDataTable from '@/modules/dashboard/components/DashboardNamespaceDataTable.vue';
import PartialDashboardDataTable from '@/components/PartialDashboardDataTable.vue';
import SetAccountDefaultModal from '@/modules/dashboard/components/SetAccountDefaultModal.vue';
import AddressQRModal from '@/modules/dashboard/components/AddressQRModal.vue';
import MessageModal from '@/modules/dashboard/components/MessageModal.vue';
import DecryptMessageModal from '@/modules/dashboard/components/DecryptMessageModal.vue';
import CosignModal from '@/modules/dashboard/components/CosignModal.vue';
import { copyToClipboard, getXPXcurrencyPrice } from '@/util/functions';
import { Helper } from '@/util/typeHelper';
// eslint-disable-next-line no-unused-vars
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
//import Dialog from 'primevue/dialog';
import { listenerState } from '@/state/listenerState';
import { WalletUtils } from '@/util/walletUtils';



export default defineComponent({
  name: 'ViewDashboard',
  components: {
    SetAccountDefaultModal,
    DashboardDataTable,
    //PartialDashboardDataTable,
    DashboardAssetDataTable,
    DashboardNamespaceDataTable,    
  },

  setup(){
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const displayBoard = ref('overview');

    const showAddressQRModal = ref(false);
    const showMessageModal = ref(false);
    const showDecryptMessageModal  = ref(false);

    const displayConvertion = ref(false);
    const openSetDefaultModal = ref(false);
    const showCosignModal = ref(false);
    const txMessage = ref("");
    const messagePayload = ref("");
    const publicKeyToUse = ref('');
    const recipientAddress = ref("");
    const signedPublicKey = ref([]);
    const signerPublicKey = ref([]);
    const txHash = ref("");
    //const decryptedMessage = ref('');
    const manualPublicKey = ref(false);
    const initialSignerPublicKey = ref('');
    const isInitialSender = ref(false);
    const cosignModalKey = ref(0);
    const decryptMessageKey = ref(0);

    const openMessageModal = (message)=>{
      messagePayload.value = message;
      showMessageModal.value = true;
    }

    const openDecryptMsgModal = async (data)=>{
      let txType = data.txType;
      let recipient = data.recipient;
      let recipientType = data.recipientType;
      let autoRecipientPublicKey = false;
      isInitialSender.value = false;
      let txSender = data.sender;
      initialSignerPublicKey.value = data.initialSigner;
      messagePayload.value = data.message;
      publicKeyToUse.value = "";
      manualPublicKey.value = false;
      //recipientAddress.value = data.recipient;

      if(txType === "Transfer" || txType === "Aggregate Complete"){
        autoRecipientPublicKey = true;

        let senderAccount = WalletUtils.findWalletAccountByPublicKey(walletState.currentLoggedInWallet, txSender);

        if(senderAccount){
          isInitialSender.value = true;
        }
      }
      else{
        let senderAccount = WalletUtils.findWalletAccountByPublicKey(walletState.currentLoggedInWallet, initialSignerPublicKey.value);

        if(senderAccount){
          isInitialSender.value = true;
        }
      }

      if(recipientType === "address"){
        let accountPublicKey = WalletUtils.findAccountPublicKeyByAddress(walletState.currentLoggedInWallet, recipient);

        if(accountPublicKey){
          publicKeyToUse.value = accountPublicKey;
        }
        else{
          let accountInfo = await ChainUtils.getAccountInfo(Helper.createAddress(recipient));

          if(accountInfo.publicKey === "0".repeat(64)){
            manualPublicKey.value = true;
          }
          else{
            publicKeyToUse.value = accountInfo.publicKey;
          }
        }
      }
      else{
        let address = await ChainUtils.getNamespaceLinkedAddress(recipient);

        if(address){
          let accountPublicKey = WalletUtils.findAccountPublicKeyByAddress(walletState.currentLoggedInWallet, recipient);

          if(accountPublicKey){
            publicKeyToUse.value = accountPublicKey;
          }
          else{
            let accountInfo = await ChainUtils.getAccountInfo(address);

            if(accountInfo.publicKey === "0".repeat(64)){
              manualPublicKey.value = true;
            }
            else{
              publicKeyToUse.value = accountInfo.publicKey;
            }
          }
        }
        else{
          manualPublicKey.value = true;
        }
      }

      if(!autoRecipientPublicKey){
        manualPublicKey.value = true;
      }

      decryptMessageKey.value++;
      showDecryptMessageModal.value = true;
    }

    const selectedCosignHash = ref("");

    const openCosignModal = (hash) =>{
      
      selectedCosignHash.value = hash;
      txHash.value = hash;

      let selectedPartialTx = allPartialTransactions.value.find((x)=> x.hash === hash);

      if(selectedPartialTx){
        let allSignerPublicKeys = selectedPartialTx.innerTransactions.map((x)=> x.signerPublicKeys);
        let flatSignerPublicKeys = Array.from(new Set([].concat(...allSignerPublicKeys)));
        // console.log(flatSignerPublicKeys);
        // console.log(selectedPartialTx.signedPublicKeys);
        signerPublicKey.value = flatSignerPublicKeys;
        signedPublicKey.value = selectedPartialTx.signedPublicKeys;

        cosignModalKey.value++;
        showCosignModal.value = true;
      }
    }

    const cosignAggregateBondedTransaction = (signedAggregateBoundedTransaction, account) => {
      const cosignatureTransaction = Helper.createCosignatureTransaction(signedAggregateBoundedTransaction);
      return account.signCosignatureTransaction(cosignatureTransaction);
    };

    const cosignTransaction = (account)=>{

      let selectedPartialTx = rawPartialTransactions.value.find((x)=> x.transactionInfo.hash === selectedCosignHash.value);

      if(selectedPartialTx){
        let cosignatureSignedTransaction = cosignAggregateBondedTransaction(selectedPartialTx, account);
        ChainUtils.announceCosignTransaction(cosignatureSignedTransaction);
      }

      showCosignModal.value = false;
    }

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);

    let currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount() ? walletState.currentLoggedInWallet.selectDefaultAccount() : walletState.currentLoggedInWallet.accounts[0];
    currentAccount.default = true;

    const selectedAccount = ref(currentAccount);

    const currentBlock = computed(() => listenerState.currentBlock);

    const selectedAccountPublicKey = computed(()=> selectedAccount.value.publicKey);
    // const selectedAccountAddress = computed(()=> Helper.createAddress(selectedAccount.value.address).pretty().substring(0, 13) + '....' + Helper.createAddress(selectedAccount.value.address).pretty().substring(Helper.createAddress(selectedAccount.value.address).pretty().length - 11));
    const selectedAccountAddress = computed(()=> Helper.createAddress(selectedAccount.value.address).pretty());
    const selectedAccountAddressPlain = computed(()=> selectedAccount.value.address);
    const selectedAccountDirectChilds = computed(()=> {
      let multisigInfo = selectedAccount.value.multisigInfo.find((x)=> x.level === 0);

      if(multisigInfo){
        return multisigInfo.getMultisigAccountsAddress(networkState.currentNetworkProfile.network.type);
      }
      else{
        return [];
      }
    });

    const selectedAccountNamespaceCount = computed(()=>{
      return selectedAccount.value.namespaces.length;
    });

    const selectedAccountAssetsCount = computed(()=>{
      return selectedAccount.value.assets.length;
    });

    const selectedAccountBalance = computed(
      () => {
        return Helper.toCurrencyFormat(selectedAccount.value.balance, currentNativeTokenDivisibility.value);
      }
    );

    const selectedAccountBalanceFront = computed(
      () => {
        let balance = selectedAccountBalance.value.split('.');
        return balance[0];
      }
    );

    const selectedAccountBalanceBack = computed(
      () => {
        let balance = selectedAccountBalance.value.split('.');
        return balance[1];
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
    let filteredConfirmedTransactions = computed(()=>{

      if(allConfirmedTransactions.value.length === 0){
        return [];
      }

      let addressToSearch = [selectedAccountAddressPlain.value];
      // addressToSearch = addressToSearch.concat(selectedAccountDirectChilds.value);
      return allConfirmedTransactions.value.filter((tx)=> tx.relatedAddress.some((address)=> addressToSearch.includes(address)));
    })

    let filteredUnconfirmedTransactions = computed(()=>{

      if(allUnconfirmedTransactions.value.length === 0){
        return [];
      }

      let addressToSearch = [selectedAccountAddressPlain.value];
      // addressToSearch = addressToSearch.concat(selectedAccountDirectChilds.value);
      return allUnconfirmedTransactions.value.filter((tx)=> tx.relatedAddress.some((address)=> addressToSearch.includes(address)));
    })

    watch(filteredConfirmedTransactions, (newValue) => {
      finalConfirmedTransaction.value = newValue;
    });

    let selfKnownNamespace = [];
    let selfKnownAsset = [];
    let assetIdToQuery = [];
    let namespaceIdToQuery = [];
    let namespaceList = [];
    let assetList = [];
    let dashboardService = new DashboardService(walletState.currentLoggedInWallet);
    let blockResolvedData = [];

    // const exactConfirmedTransactionUnresolvedInfo = () =>{
      
    //   for(let i =0; i < allConfirmedTransactions.value.length; ++i){
        
    //   }
    // }

    // const exactUnconfirmedTransactionUnresolvedInfo = () =>{

    // }

    dashboardService.fetchConfirmedTransactions().then((txs)=>{
      //console.log(txs);
      allConfirmedTransactions.value = txs;

      for(let i = 0; i < txs.length; ++i){
        if(txs[i].typeName === "Register Namespace"){
          selfKnownNamespace.push({
            id: txs[i].extractedData.namespaceIdHex,
            name: txs[i].extractedData.namespaceName,
            parentId: txs[i].extractedData.parentId
          });
        }
        else if(txs[i].typeName === "Mosaic Definition" ){
          selfKnownAsset.push({ 
            id: txs[i].extractedData.mosaicIdHex, 
            divisibility:  txs[i].extractedData.divisibility
          });
        }

        if(txs[i].innerTransactions){
          for(let y = 0; y < txs[i].innerTransactions.length; ++y){
            if(txs[i].innerTransactions[y].typeName === "Register Namespace"){
              selfKnownNamespace.push({
                id: txs[i].innerTransactions[y].extractedData.namespaceIdHex,
                name: txs[i].innerTransactions[y].extractedData.namespaceName,
                parentId: txs[i].innerTransactions[y].extractedData.parentId
              });
            }
            else if(txs[i].innerTransactions[y].typeName === "Mosaic Definition" ){
              selfKnownAsset.push({ 
                id: txs[i].innerTransactions[y].extractedData.mosaicIdHex, 
                divisibility: txs[i].innerTransactions[y].extractedData.properties.divisibility}
              );
            }
          }
        }
      }

      let addressToSearch = [selectedAccountAddressPlain.value];
      // addressToSearch = addressToSearch.concat(selectedAccountDirectChilds.value);
      filteredConfirmedTransactions.value = allConfirmedTransactions.value.filter((tx)=> tx.relatedAddress.some((address)=> addressToSearch.includes(address)));

      updateAllConfirmedTransaction();
    });

    const updateAllConfirmedTransaction = () =>{

      for(let i = 0; i < allConfirmedTransactions.value.length; ++i){

        for(let y=0; y < allConfirmedTransactions.value[i].displayTips.length; ++y){

            // below are the namespace Id to name
            let namespaceDisplayTip = allConfirmedTransactions.value[i].displayTips[y].rowTips.filter(x=> x.tipType === TipType.NAMESPACE_ID);

            for(let tip=0; tip < namespaceDisplayTip.length; ++tip){
              if(namespaceDisplayTip[tip].valueType === "fixed"){
                continue;
              }
              namespaceDisplayTip[tip].displayValue = getCompleteName(namespaceDisplayTip[tip].value);
            }

            let aliasAssetDisplayTip = allConfirmedTransactions.value[i].displayTips[y].rowTips.filter(x=> x.tipType === TipType.ASSET_ALIAS);

            for(let tip=0; tip < aliasAssetDisplayTip.length; ++tip){
              aliasAssetDisplayTip[tip].displayValue = getCompleteName(aliasAssetDisplayTip[tip].value);
            }

            let aliasAddressDisplayTip = allConfirmedTransactions.value[i].displayTips[y].rowTips.filter(x=> x.tipType === TipType.ADDRESS_ALIAS);

            for(let tip=0; tip < aliasAddressDisplayTip.length; ++tip){
              aliasAddressDisplayTip[tip].displayValue = getCompleteName(aliasAddressDisplayTip[tip].value);
            }

            let msgNamespaceDisplayTip = allConfirmedTransactions.value[i].displayTips[y].rowTips.filter(x=> x.tipType === TipType.MSG_NAMESPACE);

            for(let tip=0; tip < msgNamespaceDisplayTip.length; ++tip){
              msgNamespaceDisplayTip[tip].displayValue2 = getCompleteName(msgNamespaceDisplayTip[tip].value2);
            }

            // below are the amount absolute to exact
            let supplyAssetAmountDisplayTip = allConfirmedTransactions.value[i].displayTips[y].rowTips.filter(x=> x.tipType === TipType.SUPPLY_ASSET_AMOUNT && x.valueType === AmountType.RAW);

            for(let tip=0; tip < supplyAssetAmountDisplayTip.length; ++tip){
              let assetInfo = findSelfKnowAssetInfo(supplyAssetAmountDisplayTip[tip].value2); 

              if(assetInfo){
                let newAmount = Helper.convertToCurrency(parseFloat(supplyAssetAmountDisplayTip[tip].value), assetInfo.divisibility);
                let oldAmount = supplyAssetAmountDisplayTip[tip].value;
                supplyAssetAmountDisplayTip[tip].value = newAmount;
                supplyAssetAmountDisplayTip[tip].displayValue = oldAmount > 0 ? "+" + newAmount: newAmount;
                supplyAssetAmountDisplayTip[tip].valueType = AmountType.EXACT;
              }
            }

            let assetAmountDisplayTip = allConfirmedTransactions.value[i].displayTips[y].rowTips.filter(x=> x.tipType === TipType.ASSET_AMOUNT && x.valueType === AmountType.RAW);

            for(let tip=0; tip < assetAmountDisplayTip.length; ++tip){
              let assetInfo = findSelfKnowAssetInfo(assetAmountDisplayTip[tip].value2); 

              if(assetInfo){
                let newAmount = Helper.convertToCurrency(parseFloat(assetAmountDisplayTip[tip].value), assetInfo.divisibility);
                assetAmountDisplayTip[tip].value = newAmount;
                assetAmountDisplayTip[tip].displayValue = newAmount;
                assetAmountDisplayTip[tip].valueType = AmountType.EXACT;
              }
            }

            let supplyAmountDisplayTip = allConfirmedTransactions.value[i].displayTips[y].rowTips.filter(x=> x.tipType === TipType.SUPPLY_AMOUNT && x.valueType === AmountType.RAW);

            for(let tip=0; tip < supplyAmountDisplayTip.length; ++tip){
              let assetInfo = findSelfKnowAssetInfo(supplyAmountDisplayTip[tip].value2); 

              if(assetInfo){
                let newAmount = Helper.convertToCurrency(parseFloat(supplyAmountDisplayTip[tip].value), assetInfo.divisibility);
                let oldAmount = supplyAssetAmountDisplayTip[tip].value;
                supplyAssetAmountDisplayTip[tip].value = newAmount;
                supplyAssetAmountDisplayTip[tip].displayValue = oldAmount > 0 ? "+" + newAmount: newAmount;
                supplyAssetAmountDisplayTip[tip].valueType = AmountType.EXACT;
              }
            }
            // SUPPLY_AMOUNT NAMESPACE_AMOUNT
        }

        if(!allConfirmedTransactions.value[i].innerTransactions){
          continue;
        }
        for(let y=0; y < allConfirmedTransactions.value[i].innerTransactions.length; ++y){
          for(let z=0; z < allConfirmedTransactions.value[i].innerTransactions[y].displayTips.length; ++z){

            // below are the namespace Id to name
            let namespaceDisplayTip = allConfirmedTransactions.value[i].innerTransactions[y].displayTips[z].rowTips.filter(x=> x.tipType === TipType.NAMESPACE_ID);

            for(let tip=0; tip < namespaceDisplayTip.length; ++tip){
              if(namespaceDisplayTip[tip].valueType === "fixed"){
                continue;
              }
              namespaceDisplayTip[tip].displayValue = getCompleteName(namespaceDisplayTip[tip].value);
            }

            let aliasAssetDisplayTip = allConfirmedTransactions.value[i].innerTransactions[y].displayTips[z].rowTips.filter(x=> x.tipType === TipType.ASSET_ALIAS);

            for(let tip=0; tip < aliasAssetDisplayTip.length; ++tip){
              aliasAssetDisplayTip[tip].displayValue = getCompleteName(aliasAssetDisplayTip[tip].value);
            }

            let aliasAddressDisplayTip = allConfirmedTransactions.value[i].innerTransactions[y].displayTips[z].rowTips.filter(x=> x.tipType === TipType.ADDRESS_ALIAS);

            for(let tip=0; tip < aliasAddressDisplayTip.length; ++tip){
              aliasAddressDisplayTip[tip].displayValue = getCompleteName(aliasAddressDisplayTip[tip].value);
            }

            let msgNamespaceDisplayTip = allConfirmedTransactions.value[i].innerTransactions[y].displayTips[z].rowTips.filter(x=> x.tipType === TipType.MSG_NAMESPACE);

            for(let tip=0; tip < msgNamespaceDisplayTip.length; ++tip){
              msgNamespaceDisplayTip[tip].displayValue2 = getCompleteName(msgNamespaceDisplayTip[tip].value2);
            }

            // below are the amount absolute to exact
            let supplyAssetAmountDisplayTip = allConfirmedTransactions.value[i].innerTransactions[y].displayTips[z].rowTips.filter(x=> x.tipType === TipType.SUPPLY_ASSET_AMOUNT && x.valueType === AmountType.RAW);

            for(let tip=0; tip < supplyAssetAmountDisplayTip.length; ++tip){
              let assetInfo = findSelfKnowAssetInfo(supplyAssetAmountDisplayTip[tip].value2); 

              if(assetInfo){
                let newAmount = Helper.convertToCurrency(parseFloat(supplyAssetAmountDisplayTip[tip].value), assetInfo.divisibility);
                let oldAmount = supplyAssetAmountDisplayTip[tip].value;
                supplyAssetAmountDisplayTip[tip].value = newAmount;
                supplyAssetAmountDisplayTip[tip].displayValue = oldAmount > 0 ? "+" + newAmount: newAmount;
                supplyAssetAmountDisplayTip[tip].valueType = AmountType.EXACT;
              }
            }

            let assetAmountDisplayTip = allConfirmedTransactions.value[i].innerTransactions[y].displayTips[z].rowTips.filter(x=> x.tipType === TipType.ASSET_AMOUNT && x.valueType === AmountType.RAW);

            for(let tip=0; tip < assetAmountDisplayTip.length; ++tip){
              let assetInfo = findSelfKnowAssetInfo(assetAmountDisplayTip[tip].value2); 

              if(assetInfo){
                let newAmount = Helper.convertToCurrency(parseFloat(assetAmountDisplayTip[tip].value), assetInfo.divisibility);
                assetAmountDisplayTip[tip].value = newAmount;
                assetAmountDisplayTip[tip].displayValue = newAmount;
                assetAmountDisplayTip[tip].valueType = AmountType.EXACT;
              }
            }

            let supplyAmountDisplayTip = allConfirmedTransactions.value[i].innerTransactions[y].displayTips[z].rowTips.filter(x=> x.tipType === TipType.SUPPLY_AMOUNT && x.valueType === AmountType.RAW);

            for(let tip=0; tip < supplyAmountDisplayTip.length; ++tip){
              let assetInfo = findSelfKnowAssetInfo(supplyAmountDisplayTip[tip].value2); 

              if(assetInfo){
                let newAmount = Helper.convertToCurrency(parseFloat(supplyAmountDisplayTip[tip].value), assetInfo.divisibility);
                let oldAmount = supplyAssetAmountDisplayTip[tip].value;
                supplyAssetAmountDisplayTip[tip].value = newAmount;
                supplyAssetAmountDisplayTip[tip].displayValue = oldAmount > 0 ? "+" + newAmount: newAmount;
                supplyAssetAmountDisplayTip[tip].valueType = AmountType.EXACT;
              }
            }
          }
        }
      }
    }

    const findSelfKnowAssetInfo = (id) =>{
      let assetInfo = selfKnownAsset.find(x => x.id === id);

      if(!assetInfo){
        assetIdToQuery.push(id);
      }

      return assetInfo ? assetInfo : null;
    }

    const getCompleteName = (id)=>{
      let namespace = selfKnownNamespace.find(x=> x.id === id);

      if(!namespace){
        namespaceIdToQuery.push(id);
        return id;
      }
      let fullNameArray = [namespace.name];
      let done = true;

      if(namespace.parentId){
        done = false;
      }

      while(!done){
        let parentId = namespace.parentId;

        if(!parentId){
          done = true;
          break;
        }

        namespace = selfKnownNamespace.find(x=> x.id === parentId);
        fullNameArray.unshift(namespace.name);
      }

      return fullNameArray.join(".");
    } 

    dashboardService.fetchUnconfirmedTransactions().then((txs)=>{
      allUnconfirmedTransactions.value = txs;

      let addressToSearch = [selectedAccountAddressPlain.value];
      // addressToSearch = addressToSearch.concat(selectedAccountDirectChilds.value);
      filteredUnconfirmedTransactions.value = allUnconfirmedTransactions.value.filter((tx)=> tx.relatedAddress.some((address)=> addressToSearch.includes(address)));
    });

    let rawPartialTransactions = ref([]);
    //let filteredPartialTransactions = ref([]);

    let filteredPartialTransactions = computed(()=>{

      if(allPartialTransactions.value.length === 0){
        return [];
      }

      let addressToSearch = [selectedAccountAddressPlain.value];
      addressToSearch = addressToSearch.concat(selectedAccountDirectChilds.value);
      return allPartialTransactions.value.filter((tx)=> tx.relatedAddress.some((address)=> addressToSearch.includes(address)));
    })
    
    /*
    const refreshPartialTransaction = () =>{
      let addressToSearch = [selectedAccountAddressPlain.value];
      addressToSearch = addressToSearch.concat(selectedAccountDirectChilds.value);
      filteredPartialTransactions.value = allPartialTransactions.value.filter((tx)=> tx.relatedAddress.some((address)=> addressToSearch.includes(address)));
    }
    */

    let publicKeysMultisigInfo = [];
    //  = computed(()=>{
    //   if(walletState.isLogin){
    //     return WalletUtils.getWalletMultisigInfo(walletState.currentLoggedInWallet);
    //   }
    //   else{
    //     return [];
    //   }
    // });
    let publicKeyToQuery = ref([]);

    // let count = 1;

    // let tempInterval = setInterval(()=>{
    //   if(count > 100){
    //     clearInterval(tempInterval);
    //   }
    //   count++;
    //   console.log(walletState.wallets.isReady);
    //   console.log(walletState.currentLoggedInWallet.accounts[0].multisigInfo);
    //   console.log(walletState.currentLoggedInWallet.others[0].multisigInfo);
    //   console.log(WalletUtils.getWalletMultisigInfo(walletState.currentLoggedInWallet));
    // }, 50);

    const updatePartialTransaction = ()=>{

      if(walletState.currentLoggedInWallet === null){
        return;
      }

      if(!walletState.currentLoggedInWallet.isReady){
        setTimeout(()=>{
          updatePartialTransaction();
        }, 1000)
        return;
      }
      publicKeysMultisigInfo = WalletUtils.getWalletMultisigInfo(walletState.currentLoggedInWallet);

      for(let i = 0; i < allPartialTransactions.value.length; ++i){
        for(let x = 0; x < allPartialTransactions.value[i].innerTransactions.length; ++x){
          
          let newSignerPublicKeys = [];
          let signerPublicKeys = allPartialTransactions.value[i].innerTransactions[x].signerPublicKeys;

          //console.log(signerPublicKeys);

          for(let y=0; y < signerPublicKeys.length; ++y){
            // console.log(signerPublicKeys[y]);
            let foundMultisigInfo = publicKeysMultisigInfo.find(pkMultisigInfo=> pkMultisigInfo.publicKey === signerPublicKeys[y]);
            
            //console.log(foundMultisigInfo);
            if(foundMultisigInfo){
              let allCosigners = WalletUtils.getFinalCosigner(foundMultisigInfo.multisigInfos);
              let directCosigner = WalletUtils.getDirectParentCosigner(foundMultisigInfo.multisigInfos);
              allPartialTransactions.value[i].innerTransactions[x].directParent = directCosigner;
              allPartialTransactions.value[i].innerTransactions[x].numToApprove = directCosigner.length;
              newSignerPublicKeys = newSignerPublicKeys.concat(allCosigners);
            }
            else{
              let foundInWallet = WalletUtils.findAccountByPublicKey(walletState.currentLoggedInWallet, signerPublicKeys[y]);
              
              if(!foundInWallet){
                publicKeyToQuery.value.push(signerPublicKeys[y]);
              }
              newSignerPublicKeys = newSignerPublicKeys.concat(signerPublicKeys[y]);
            }
          }
          allPartialTransactions.value[i].innerTransactions[x].signerPublicKeys = Array.from(new Set(newSignerPublicKeys));
        }
      }

      //refreshPartialTransaction();
    };

    dashboardService.fetchPartialTransactions().then((partialData)=>{
      rawPartialTransactions.value = partialData.txns;
      allPartialTransactions.value = partialData.formatted;

      let addressToSearch = [selectedAccountAddressPlain.value];
      addressToSearch = addressToSearch.concat(selectedAccountDirectChilds.value);
      filteredPartialTransactions.value = allPartialTransactions.value.filter((tx)=> tx.relatedAddress.some((address)=> addressToSearch.includes(address)));
    
      updatePartialTransaction();
    });

    emitter.on("TXN_CONFIRMED", (num)=>{
      let newConfirmTxNum = num;

      let newTxs = [];
      let confirmedTxHashes = listenerState.allConfirmedTransactionsHash.slice(-newConfirmTxNum);

      txHashLoop:
      for(let i = 0; i < confirmedTxHashes.length; ++i){

        if(allConfirmedTransactions.value.find((tx)=> tx.hash === confirmedTxHashes[i])){
          continue;
        }

        addressTransactionLoop:
        for(let x = 0; x < listenerState.confirmedTransactions.length; ++x){
          let foundTx = listenerState.confirmedTransactions[i].confirmedTransactions.find((tx)=> confirmedTxHashes.includes(tx.transactionInfo.hash));
        
          if(foundTx){
            newTxs.push(foundTx);
            break addressTransactionLoop;
          }
        }
      }

      if(newTxs.length > 0){
        let formatedTxs = dashboardService.formatConfirmedWithTransaction(newTxs);
        allConfirmedTransactions.value = formatedTxs.concat(allConfirmedTransactions.value);

        allUnconfirmedTransactions.value = allUnconfirmedTransactions.value.filter((tx)=> !listenerState.allConfirmedTransactionsHash.includes(tx.hash));
        allPartialTransactions.value = allPartialTransactions.value.filter((tx)=> !listenerState.allConfirmedTransactionsHash.includes(tx.hash));
      }
    })

    emitter.on("TXN_UNCONFIRMED", (num)=>{

      let newUnconfirmedTxnCount = num;
      let newTxs = [];
      let unconfirmedTxHashes = listenerState.allUnconfirmedTransactionsHash.slice(-newUnconfirmedTxnCount);

      txHashLoop:
      for(let i = 0; i < unconfirmedTxHashes.length; ++i){

        if(allUnconfirmedTransactions.value.find((tx)=> tx.hash === unconfirmedTxHashes[i])){
          continue;
        }

        addressTransactionLoop:
        for(let x = 0; x < listenerState.unconfirmedTransactions.length; ++x){
          let foundTx = listenerState.unconfirmedTransactions[i].unconfirmedTransactions.find((tx)=> unconfirmedTxHashes.includes(tx.transactionInfo.hash));
        
          if(foundTx){
            newTxs.push(foundTx);
            break addressTransactionLoop;
          }
        }
      }

      if(newTxs.length > 0){
        let formatedTxs = dashboardService.formatUnconfirmedWithTransaction(newTxs);
        allUnconfirmedTransactions.value = formatedTxs.concat(allUnconfirmedTransactions.value);

        allPartialTransactions.value = allPartialTransactions.value.filter((tx)=> !listenerState.allUnconfirmedTransactionsHash.includes(tx.hash));
      }
    });

    emitter.on("COSIGNER_SIGNED", (num)=>{

      let newCosignTxnCount = num;
      let cosignTxns = listenerState.allCosignatureAdded.slice(-newCosignTxnCount);

      txHashLoop:
      for(let i = 0; i < cosignTxns.length; ++i){

        if(allPartialTransactions.value.find((tx)=> tx.hash === cosignTxns[i])){
          let partialTransaction = allPartialTransactions.value.find((tx)=> tx.hash === cosignTxns[i]);

          for(let x = 0; x < partialTransaction.innerTransactions.length; ++x){
            partialTransaction.innerTransactions[x].signedPublicKeys = partialTransaction.innerTransactions[x].signedPublicKeys.concat(cosignTxns[i].signer);
          }
        }
      }
      //refreshPartialTransaction();
    });

    emitter.on("ABT_ADDED", (num)=>{
      let newPartialTxnCount = num;
      let newTxs = [];
      let partialTxHashes = listenerState.allAggregateBondedTransactionHash.slice(-newPartialTxnCount);

      txHashLoop:
      for(let i = 0; i < partialTxHashes.length; ++i){

        if(allPartialTransactions.value.find((tx)=> tx.hash === partialTxHashes[i])){
          continue;
        }

        addressTransactionLoop:
        for(let x = 0; x < listenerState.aggregateBondedTransaction.length; ++x){
          let foundTx = listenerState.aggregateBondedTransaction[i].aggregateBonded.find((tx)=> partialTxHashes[i] === tx.transactionInfo.hash);
        
          if(foundTx){
            newTxs.push(foundTx);
            break addressTransactionLoop;
          }
        }
      }

      if(newTxs.length > 0){
        rawPartialTransactions.value = rawPartialTransactions.value.concat(newTxs)
        let formatedTxs = dashboardService.formatUnconfirmedWithTransaction(newTxs);
        allPartialTransactions.value = formatedTxs.concat(allPartialTransactions.value);
        updatePartialTransaction();
      }
    });

    emitter.on("TXN_ERROR", (hash)=>{
      allUnconfirmedTransactions.value = allUnconfirmedTransactions.value.filter((tx)=> ![hash].includes(tx.hash));
      allPartialTransactions.value = allPartialTransactions.value.filter((tx)=> ![hash].includes(tx.hash));
    });

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
      if(filteredUnconfirmedTransactions.value.length > 0){
        isShowUnconfirmed.value = true;
        isShowConfirmed.value = false;
        isShowPartial.value = false;
      }
    };

    const clickPartialTransactions = () => {
      if(filteredPartialTransactions.value.length > 0){
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
      }else{
        selectedAccount.value = walletState.currentLoggedInWallet.others.find((account)=> account.name === data.name);
      }
      walletState.currentLoggedInWallet.setDefaultAccountByName(data.name);
      walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
    }

    emitter.on('CLOSE_SET_DEFAULT_ACCOUNT_MODAL', payload => {
      if(payload){
        openSetDefaultModal.value = false;
      }
    });

    emitter.on('CLOSE_MODAL', () => {
      showAddressQRModal.value = false;
      showMessageModal.value = false;
      showCosignModal.value = false;
      showDecryptMessageModal.value = false;
    });

    return {
      currentBlock,
      displayBoard,
      copy,
      selectedAccountBalance,
      selectedAccountBalanceFront,
      selectedAccountBalanceBack,
      selectedAccountName,
      selectedAccountPublicKey,
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
      filteredUnconfirmedTransactions,
      doFilterConfirmed,
      filteredConfirmedTransactions,
      filteredPartialTransactions,
      addressQR,
      showAddressQRModal,
      showMessageModal,
      showDecryptMessageModal,
      selectedAccount,
      selectedAccountNamespaceCount,
      // selectedAccountNamespaces,
      // selectedAccountAssets,
      selectedAccountAssetsCount,
      openMessageModal,
      openDecryptMsgModal,
      messagePayload,
      recipientAddress,
      showCosignModal,
      openCosignModal,
      signerPublicKey,
      signedPublicKey,
      cosignTransaction,
      //decryptedMessage,
      manualPublicKey,
      publicKeyToUse,
      initialSignerPublicKey,
      isInitialSender,
      cosignModalKey,
      decryptMessageKey,
      txHash,
    };
  }
});
</script>
<style lang="scss" scoped>

.address_div{
  top: 4px;
}

.p-dialog .p-dialog-header{
  padding: 1rem 1.25rem;
}

.p-dialog .p-dialog-header .p-dialog-title{
  font-size: 1rem;
}

#address{
  @extend .text-xs !optional;
}

.default-div{
  @apply text-gray-100;
  background: #33344A;
  background-position: right top;
  background-repeat: no-repeat;
  background-size: 250px;
  height: 184px;
}

.balance-div{
  height: 184px;
}

.transaction-div{
  height: 184px;
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
    @extend .text-sm !optional;
  }
}

.dashboard-link{
  position: relative; top: -4px;
}

</style>