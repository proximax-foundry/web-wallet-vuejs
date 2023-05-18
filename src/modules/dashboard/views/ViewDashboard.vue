<template>
  <div>
    <div class="px-2 sm:px-10 bg-gray-200 pb-4 pt-5">
      <div class="max-w-screen-sm m-auto">
        <div class="shadow-md w-full relative overflow-x-hidden address_div px-7 py-3 rounded flex flex-col bg-white text-black">
          <div class="text-center py-3">
            <div class="text-center my-2"><div class="inline-block"><span class="font-bold text-xl">{{ selectedAccountBalanceFront }}</span>{{ selectedAccountBalanceBack?'.':'' }}<span class="text-md">{{ selectedAccountBalanceBack }}</span> <span class="font-bold text-xl">{{ currentNativeTokenName }}</span></div><img src="@/modules/dashboard/img/icon-xpx.svg" class="inline-block w-6 h-6 ml-3 relative" style="top: -6px;"></div>
            <router-link :to="'/details-account/' + selectedAccountAddressPlain" class="inline-block text-xs font-bold text-blue-primary cursor-pointer">{{ selectedAccountName }}<img src="@/modules/dashboard/img/icon-blue-chevron-right.svg" class="inline-block w-5 h-5 ml-1 relative" style="top: -2px"></router-link>
            <div class="mb-8">
              <div class="flex items-center justify-center">
                <div id="address" class="inline-block font-bold outline-none break-all text-xs lg:text-tsm" :copyValue="selectedAccountAddressPlain" :copySubject="$t('general.address')">{{ selectedAccountAddressShort }}</div>

                <img src="@/modules/dashboard/img/icon-copy.svg" class="w-4 cursor-pointer ml-4 inline-block" @click="copy('address')">
                <AddressQRModal :accountAddressQR="addressQR" :notIncludeWord="true" />      
              </div>
            </div>
            <div>
              <a :href="faucetLink" target=_new class="inline-block text-center mr-2" v-if="faucetLink">
                <div class="inline-block rounded-full bg-blue-primary w-8 h-8">
                  <div class="h-full w-full flex items-center justify-center">
                    <img src="@/modules/dashboard/img/icon-balance-white.svg" class="w-5 h-5">
                  </div>
                </div><br>
                <div class="text-xxs text-gray-400 inline-block uppercase">{{$t('general.topUp')}}</div>
              </a>
              <router-link :to="{ name: 'ViewTransferCreate'}" class="inline-block text-center mx-2">
                <div class="inline-block rounded-full bg-blue-primary w-8 h-8">
                  <div class="h-full w-full flex items-center justify-center">
                    <img src="@/modules/dashboard/img/icon-transfer-white.svg" class="w-5 h-5">
                  </div>
                </div><br>
                <div class="text-xxs text-gray-400 inline-block uppercase">{{$t('general.transfer')}}</div>
              </router-link>
              <!-- <router-link :to="{ name: 'ViewServicesStackingBuy'}" class="inline-block text-center mx-2.5" v-if="isPublicNetwork">
                <div class="inline-block rounded-full bg-blue-primary w-8 h-8">
                  <div class="flex items-center justify-center h-full w-full">
                    <font-awesome-icon icon="shopping-bag" class="h-5 w-5 text-white" />
                  </div>
                </div><br>
                <div class="text-xxs text-gray-400 inline-block uppercase">{{$t('general.buy')}}</div>
              </router-link> -->
              <router-link :to="{ name: 'ViewServicesMainnetSwap'}" class="inline-block text-center mx-3" v-if="isPublicNetwork">
                <div class="inline-block rounded-full bg-blue-primary w-8 h-8">
                  <div class="h-full w-full flex items-center justify-center">
                    <img src="@/modules/dashboard/img/icon-swap-white.svg" class="w-5 h-5">
                  </div>
                </div><br>
                <div class="text-xxs text-gray-400 inline-block uppercase">{{$t('general.swap')}}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-left px-2 sm:px-10 bg-gray-200">
      <div class="transition-all flex items-end">
        <div class="text-xs inline-block px-3 rounded-t-sm py-3" :class="`${ displayBoard=='asset'?'bg-white text-gray-primary':'cursor-pointer' }`" @click="displayBoard='asset'">{{$t('general.asset',2)}}</div>
        <div class="text-xs inline-block px-3 rounded-t-sm py-3" :class="`${ displayBoard=='overview'?'bg-white text-gray-primary':'cursor-pointer' }`" @click="displayBoard='overview'">Activities</div>
      </div>
    </div>
    <div class="bg-white px-2 sm:px-10 " v-if="displayBoard=='overview'">
      <div class="text-txs text-gray-400 mt-10 mb-2"><b class="text-gray-700 uppercase ">Pending Transactions</b></div>
      <PendingDataTable :transaction="pendingTransactions" />
      <div class="text-txs text-gray-400 mt-10 mb-2"><b class="text-gray-700 uppercase">{{$t('dashboard.recentTransactions')}}</b> </div>
      <MixedTxnDataTable :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="recentTransactions" @openDecryptMsg="openDecryptMsgModal"></MixedTxnDataTable>
      <a :href="linkToExplorer()" target=_blank v-if="searchedTransactions.length==10"><div class="text-right text-xs text-blue-primary mt-3" >View more...</div></a>
      
    </div>
    <div class="bg-white px-2 sm:px-10 pt-12" v-else-if="displayBoard=='asset'">
      <DashboardAssetDataTable :assets="accountAssets" />
    </div>
    
  </div>
</template>

<script>
import PendingDataTable from "@/modules/account/components/PendingDataTable.vue"
import { computed, defineComponent, ref, getCurrentInstance, watch } from 'vue';
import { TransactionFilterType, TransactionFilterTypes } from '@/modules/dashboard/model/transactions/transaction';
import MixedTxnDataTable from '@/modules/dashboard/components/TransactionDataTable/MixedTxnDataTable.vue';
import DashboardAssetDataTable from '@/modules/dashboard/components/DashboardAssetDataTable.vue';
import AddressQRModal from '@/modules/dashboard/components/AddressQRModal.vue';
import { copyToClipboard, getXPXcurrencyPrice } from '@/util/functions';
import { Helper } from '@/util/typeHelper';
// eslint-disable-next-line no-unused-vars
import { useToast } from "primevue/usetoast";
import { walletState } from '@/state/walletState';
import { ChainUtils } from '@/util/chainUtils';
import { networkState } from "@/state/networkState";
import { DashboardService } from '@/modules/dashboard/service/dashboardService';
import qrcode from 'qrcode-generator';
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { listenerState } from '@/state/listenerState';
import { WalletUtils } from '@/util/walletUtils';
import {AppState} from '@/state/appState'
import { useI18n } from 'vue-i18n';
import { TransactionType, NetworkType } from 'tsjs-xpx-chain-sdk';


export default defineComponent({
  name: 'ViewDashboard',
  props:{
    type: String
  },
  components: {
    PendingDataTable,
    MixedTxnDataTable,
    DashboardAssetDataTable,
    AddressQRModal,
  },
  setup(props){
    const {t} = useI18n();
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const displayBoard = ref('asset');
    const showAddressQRModal = ref(false);
    const showMessageModal = ref(false);
    const showDecryptMessageModal  = ref(false)
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

    const isPublicNetwork = computed(()=>{
      return AppState.networkType == NetworkType.TEST_NET || AppState.networkType == NetworkType.MAIN_NET;
    });

    if(props.type == 'transaction'){
      displayBoard.value = 'transaction';
    }
    watch(props, (n)=> {
      if(n.type == 'transaction'){
        displayBoard.value = 'transaction';
      }
    });
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
    const cosignAggregateBondedTransaction = (signedAggregateBondedTransaction, account) => {
      const cosignatureTransaction = Helper.createCosignatureTransaction(signedAggregateBondedTransaction);
      return account.signCosignatureTransaction(cosignatureTransaction);
    };
    // const cosignTransaction = (account)=>{
    //   let selectedPartialTx = rawPartialTransactions.value.find((x)=> x.transactionInfo.hash === selectedCosignHash.value);
    //   if(selectedPartialTx){
    //     let cosignatureSignedTransaction = cosignAggregateBondedTransaction(selectedPartialTx, account);
    //     ChainUtils.announceCosignTransaction(cosignatureSignedTransaction);
    //   }
    //   showCosignModal.value = false;
    // }
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const currentNativeTokenDivisibility = computed(()=> AppState.nativeToken.divisibility);
    const currentNativeTokenId = computed(()=> AppState.nativeToken.assetId);
    const displyFaucet = computed(() => {
      return (AppState.networkType == NetworkType.TEST_NET)?true:false;
    });
    const faucetLink = computed(() => {
      if(displyFaucet.value){
        if(networkState.chainNetworkName == 'Sirius Testnet 1'){
          return 'https://bctestnetfaucet.xpxsirius.io/#/';
        }else if(networkState.chainNetworkName == 'Sirius Testnet 2'){
          return 'https://bctestnet2faucet.xpxsirius.io/#/';
        }else{
          return false;
        }
      }else{
        if(AppState.networkType == NetworkType.MAIN_NET){
          return 'https://www.proximax.io/en/xpx';
        }else{
          return false;
        }
      }
    });
    // let currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount() ? walletState.currentLoggedInWallet.selectDefaultAccount() : walletState.currentLoggedInWallet.accounts[0];
    // currentAccount.default = true;
    // const selectedAccount = ref(currentAccount);
    let selectedAccount = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return null
      }
      return walletState.currentLoggedInWallet.selectDefaultAccount()
    })
    const accountAssets = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return [];
      }
      let defaultAccAsset = selectedAccount.value.assets;
      let filteredAsset = defaultAccAsset.filter(asset=>asset.rawAmount!=0);
      return filteredAsset; 
    })
    const currentBlock = computed(() => AppState.readBlockHeight);

    const selectedAccountPublicKey = computed(()=> selectedAccount.value.publicKey);
    // const selectedAccountAddress = computed(()=> Helper.createAddress(selectedAccount.value.address).pretty().substring(0, 13) + '....' + Helper.createAddress(selectedAccount.value.address).pretty().substring(Helper.createAddress(selectedAccount.value.address).pretty().length - 11));
    const selectedAccountAddress = computed(()=> {
      if(selectedAccount.value){
        return Helper.createAddress(selectedAccount.value.address).pretty()
      }else{
        return null
      }
    });
    const selectedAccountAddressPlain = computed(()=> selectedAccount.value?selectedAccount.value.address:null);
    const selectedAccountAddressShort = computed(() => {
      if(selectedAccount.value){
        let prettyAddress = Helper.createAddress(selectedAccount.value.address).pretty();
        let firstPartAddress = prettyAddress.substring(0, 11);
        let secondPartAddress = prettyAddress.substring(prettyAddress.length - 11);
        return firstPartAddress + '...' + secondPartAddress;
      }else{
        return null
      }
    });
    const selectedAccountDirectChilds = computed(()=> {
      let multisigInfo = selectedAccount.value.multisigInfo.find((x)=> x.level === 0);
      if(multisigInfo){
        return multisigInfo.getMultisigAccountsAddress(AppState.networkType);
      }
      else{
        return [];
      }
    });
    const selectedAccountNamespaceCount = computed(()=>{
      return selectedAccount.value.namespaces.length;
    });
    const selectedAccountAssetsCount = computed(()=>{
      return selectedAccount.value.assets.filter(x => x.idHex !== currentNativeTokenId.value).length;
    });
    const selectedAccountBalance = computed(
      () => {
        if(!selectedAccount.value){
          return null
        }else{
            return Helper.toCurrencyFormat(selectedAccount.value?selectedAccount.value.balance:0, currentNativeTokenDivisibility.value);
        }
      }
    );
    const selectedAccountBalanceFront = computed(
      () => {
        if(selectedAccountBalance.value){
          let balance = selectedAccountBalance.value.split('.');
          return balance[0];
        }else{
          return null
        }
      }
    );
    const selectedAccountBalanceBack = computed(
      () => {
        if(selectedAccountBalance.value){
          let balance = selectedAccountBalance.value.split('.');
          return balance[1];
        }else{
          return null
        }
      }
    );
    const selectedAccountName = computed(
      () => {
        if(selectedAccount.value){
          return selectedAccount.value.name;
        }else{
          return null
        }
      }
    );
    const addressQR = computed(
      () => {
        if(selectedAccountAddress.value){
          let qr = qrcode(15, 'H');
          qr.addData(selectedAccountAddress.value);
          qr.make();
          return qr.createDataURL();
        }else{
          return null
        }
      }
    )
    let dashboardService = new DashboardService(walletState.currentLoggedInWallet, selectedAccount.value);
    let accountConfirmedTxnsCount = ref(0);
    let updateAccountTransactionCount = async()=>{
      let transactionsCount = await dashboardService.getAccountTransactionsCount(selectedAccount.value);
      accountConfirmedTxnsCount.value = transactionsCount.confirmed;
    };
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);

      toast.add({severity:'info', detail: copySubject + ' ' +t('general.copied'), group: 'br-custom', life: 3000});
    };
    // setup transaction loading
    const recentTransactions = ref([]);
    const searchedTransactions = ref([]);
    const recentTransferTransactions = ref([]);
    let allTxnQueryParams = Helper.createTransactionQueryParams();
    let transactionGroupType = Helper.getTransactionGroupType();
    let selectedTxnGroupType = transactionGroupType.CONFIRMED;
    let selectedTxnType = ref("all");
    let txnTypeList = Object.entries(TransactionFilterType).map(([label, value])=>({label, value}));
    let endOfRecords = false;
    let searchingTxn = ref(false);
    let boolIsTxnFetched = ref(true);
    let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);
    allTxnQueryParams.updateFieldOrder(blockDescOrderSortingField);
    allTxnQueryParams.embedded = true;
    let loadRecentTransactions = async()=>{
      let txnQueryParams = Helper.createTransactionQueryParams();
      txnQueryParams.pageSize = 1;
      txnQueryParams.publicKey = selectedAccount.value.publicKey;
      txnQueryParams.embedded = true;
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
      let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.CONFIRMED, txnQueryParams);
      let formattedTxns = await dashboardService.formatConfirmedMixedTxns(transactionSearchResult.transactions);
      recentTransactions.value = formattedTxns.slice(0, 5);
      searchedTransactions.value = formattedTxns;
    };
    let loadRecentTransferTransactions = async()=>{
      let txnQueryParams = Helper.createTransactionQueryParams();
      txnQueryParams.pageSize = 20;
      txnQueryParams.type = TransactionFilterTypes.getTransferTypes();
      txnQueryParams.publicKey = selectedAccount.value.publicKey;
      txnQueryParams.embedded = true;
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
      let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.CONFIRMED, txnQueryParams);
      if(transactionSearchResult.transactions.length){
        let formattedTxns = await dashboardService.formatConfirmedMixedTxns(transactionSearchResult.transactions);
        recentTransferTransactions.value = formattedTxns;
        recentTransferTxnRow.value = formatRecentTransfer(formattedTxns).slice(0, 3);
      }
    };
    const reloadSearchTxns = () =>{
      allTxnQueryParams.pageNumber = 1;
      endOfRecords = false;

      searchTransaction();
    }
    const loadMoreTxns = () =>{
      searchTransaction(true);
    }
    const searchTransaction = async(loadMore = false) =>{
      allTxnQueryParams.pageNumber = loadMore ? allTxnQueryParams.pageSize + 1 : 1;
      allTxnQueryParams.publicKey = selectedAccount.value.publicKey;
      if(allTxnQueryParams.type.length === 0 || 
        allTxnQueryParams.type.includes(TransactionType.AGGREGATE_COMPLETE) ||
        allTxnQueryParams.type.includes(TransactionType.AGGREGATE_BONDED)){
        allTxnQueryParams.firstLevel = false;
      }
      else{
        allTxnQueryParams.firstLevel = true;
      }
      searchingTxn.value = true;
      let transactionSearchResult = await dashboardService.searchTxns(selectedTxnGroupType, allTxnQueryParams);
      if(transactionSearchResult.pagination.pageNumber <= allTxnQueryParams.pageNumber){
        endOfRecords = true;
      }else{
        endOfRecords = false;
      }
      searchingTxn.value = false;
      let formattedTxns = [];
      switch (selectedTxnGroupType) {
        case transactionGroupType.CONFIRMED:
          formattedTxns = await formatConfirmedTransaction(transactionSearchResult.transactions);
          break;
        case transactionGroupType.UNCONFIRMED:
          formattedTxns = await formatUnconfirmedTransaction(transactionSearchResult.transactions);
          break;
        case transactionGroupType.PARTIAL:
          formattedTxns = await formatPartialTransaction(transactionSearchResult.transactions);
          break;
      }
      if(loadMore){
        let tempTxns = searchedTransactions.value.concat(formattedTxns);
        searchedTransactions.value = removeDuplicateTxn(tempTxns);
      }
      else{
        searchedTransactions.value = formattedTxns;
      }
      boolIsTxnFetched.value = true;
    }
    
    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const addressExplorerURL = computed(()=> explorerBaseURL.value + networkState.currentNetworkProfile.chainExplorer.addressRoute);
    const hashExplorerURL = computed(()=> explorerBaseURL.value + networkState.currentNetworkProfile.chainExplorer.hashRoute);
    const recentTransferTxnRow = ref([]);
    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();
    const jdenticonConfig = themeConfig.jdenticonConfig;
    const formatRecentTransfer = (transactions) => {
      let transferTxn = [];
      let nativeTokenTxns = transactions.filter(txn => txn.amountTransfer > 0);
      for(const txn of nativeTokenTxns){
        let formattedTransferTxn = {};
        if(selectedAccountAddressPlain.value == txn.sender && selectedAccountAddressPlain.value == txn.recipient){
          continue;
        }
        else if(selectedAccountAddressPlain.value == txn.sender){
          formattedTransferTxn.transferContact = walletState.currentLoggedInWallet.convertAddressToNamePretty(txn.recipient, true);
          formattedTransferTxn.transferContactAddress = txn.recipient;
          formattedTransferTxn.amount = '-' + Helper.toCurrencyFormat(txn.amountTransfer, AppState.nativeToken.divisibility);
        }else{
          formattedTransferTxn.transferContact = walletState.currentLoggedInWallet.convertAddressToNamePretty(txn.sender, true).substring(0, 30);
          formattedTransferTxn.transferContactAddress = txn.sender;
          formattedTransferTxn.amount = Helper.toCurrencyFormat(txn.amountTransfer, AppState.nativeToken.divisibility);
        }
        
        if(formattedTransferTxn.transferContact.length > 20){
            formattedTransferTxn.transferContact = formattedTransferTxn.transferContact.substring(0, 17) + "...";
        }
        formattedTransferTxn.hash = txn.hash;
        transferTxn.push(formattedTransferTxn);
      }
      return transferTxn;
    }
    const formatConfirmedTransaction = async(transactions)=>{
      let formattedTxns = [];
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
        default:
          formattedTxns = await dashboardService.formatConfirmedMixedTxns(transactions);
          break;
      }
      return formattedTxns;
    }
    const formatUnconfirmedTransaction = async(transactions)=>{
      let formattedTxns = [];
      switch(selectedTxnType.value){
        case TransactionFilterType.TRANSFER:
          formattedTxns = await dashboardService.formatUnconfirmedMixedTxns(transactions);
          break;
        case TransactionFilterType.ACCOUNT:
          formattedTxns = await dashboardService.formatUnconfirmedAccountTransaction(transactions);
          break;
        case TransactionFilterType.AGGREGATE:
          formattedTxns = await dashboardService.formatUnconfirmedAggregateTransaction(transactions);
          break;
        case TransactionFilterType.RESTRICTION:
          formattedTxns = await dashboardService.formatUnconfirmedRestrictionTransaction(transactions);
          break;
        case TransactionFilterType.SECRET:
          formattedTxns = await dashboardService.formatUnconfirmedSecretTransaction(transactions);
          break;
        case TransactionFilterType.ALIAS:
          formattedTxns = await dashboardService.formatUnconfirmedAliasTransaction(transactions);
          break;
        case TransactionFilterType.ASSET:
          formattedTxns = await dashboardService.formatUnconfirmedAssetTransaction(transactions);
          break;
        case TransactionFilterType.METADATA:
          formattedTxns = await dashboardService.formatUnconfirmedMetadataTransaction(transactions);
          break;
        case TransactionFilterType.CHAIN:
          formattedTxns = await dashboardService.formatUnconfirmedChainTransaction(transactions);
          break;
        case TransactionFilterType.EXCHANGE:
          formattedTxns = await dashboardService.formatUnconfirmedExchangeTransaction(transactions);
          break;
        case TransactionFilterType.LINK:
          formattedTxns = await dashboardService.formatUnconfirmedLinkTransaction(transactions);
          break;
        case TransactionFilterType.LOCK:
          formattedTxns = await dashboardService.formatUnconfirmedLockTransaction(transactions);
          break;
        case TransactionFilterType.NAMESPACE:
          formattedTxns = await dashboardService.formatUnconfirmedNamespaceTransaction(transactions);
          break;
      }
      return formattedTxns;
    }
    const formatPartialTransaction = async(transactions)=>{
      let formattedTxns = [];
      switch(selectedTxnType.value){
        case TransactionFilterType.TRANSFER:
          formattedTxns = await dashboardService.formatPartialMixedTxns(transactions);
          break;
        case TransactionFilterType.ACCOUNT:
          formattedTxns = await dashboardService.formatPartialAccountTransaction(transactions);
          break;
        case TransactionFilterType.AGGREGATE:
          formattedTxns = await dashboardService.formatPartialAggregateTransaction(transactions);
          break;
        case TransactionFilterType.RESTRICTION:
          formattedTxns = await dashboardService.formatPartialRestrictionTransaction(transactions);
          break;
        case TransactionFilterType.SECRET:
          formattedTxns = await dashboardService.formatPartialSecretTransaction(transactions);
          break;
        case TransactionFilterType.ALIAS:
          formattedTxns = await dashboardService.formatPartialAliasTransaction(transactions);
          break;
        case TransactionFilterType.ASSET:
          formattedTxns = await dashboardService.formatPartialAssetTransaction(transactions);
          break;
        case TransactionFilterType.METADATA:
          formattedTxns = await dashboardService.formatPartialMetadataTransaction(transactions);
          break;
        case TransactionFilterType.CHAIN:
          formattedTxns = await dashboardService.formatPartialChainTransaction(transactions);
          break;
        case TransactionFilterType.EXCHANGE:
          formattedTxns = await dashboardService.formatPartialExchangeTransaction(transactions);
          break;
        case TransactionFilterType.LINK:
          formattedTxns = await dashboardService.formatPartialLinkTransaction(transactions);
          break;
        case TransactionFilterType.LOCK:
          formattedTxns = await dashboardService.formatPartialLockTransaction(transactions);
          break;
        case TransactionFilterType.NAMESPACE:
          formattedTxns = await dashboardService.formatPartialNamespaceTransaction(transactions);
          break;
      }
      return formattedTxns;
    }
    const changeTxnGroupType = (txnGroupType) =>{
      searchedTransactions.value = [];
      switch (txnGroupType) {
        case transactionGroupType.CONFIRMED:
          selectedTxnGroupType = transactionGroupType.CONFIRMED;
          break;
        case transactionGroupType.UNCONFIRMED:
          selectedTxnGroupType = transactionGroupType.UNCONFIRMED;
          break;
        case transactionGroupType.PARTIAL:
          selectedTxnGroupType = transactionGroupType.PARTIAL;
          break;
      }
      searchTransaction();
    }
    const changeSearchTxnType = () =>{
      boolIsTxnFetched.value = false;
      searchedTransactions.value = [];
      let txnFilterGroup = selectedTxnType.value;
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
        default:
          allTxnQueryParams.type = undefined;
          break;
      }
      searchTransaction();
    }
    const removeDuplicateTxn = (txns) =>{
      let result = txns.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.hash === value.hash
        ))
      )
      return result;
    }
    emitter.on('CLOSE_MODAL', () => {
      showAddressQRModal.value = false;
      showMessageModal.value = false;
      showCosignModal.value = false;
      showDecryptMessageModal.value = false;
    });
    
    emitter.on('DEFAULT_ACCOUNT_SWITCHED',async(payload) => {
      // currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount();
      // currentAccount.default = true;
      // selectedAccount.value = currentAccount;
      // recentTransferTxn();
      updateAccountTransactionCount();
      loadRecentTransactions();
      loadRecentTransferTransactions();
      await loadUnconfirmedTransactions();
      await loadPartialTransactions();
      loadInQueueTransactions();
    });

    const unconfirmedTxns = ref([])
    const partialTxns = ref([])
    const inQueueTxns = ref([])
    const pendingTransactions = computed(()=>{
        return unconfirmedTxns.value.concat(inQueueTxns.value).concat(partialTxns.value)
    }) 
    let loadUnconfirmedTransactions = async()=>{
        if(!selectedAccount.value){
            return
        }
        let txnQueryParams = Helper.createTransactionQueryParams(); 
        txnQueryParams.pageSize = 1;
        txnQueryParams.address = selectedAccountAddressPlain.value
        txnQueryParams.embedded = true;
        txnQueryParams.updateFieldOrder(blockDescOrderSortingField); 
        let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.UNCONFIRMED, txnQueryParams);
        let formattedTxns = await dashboardService.formatUnconfirmedMixedTxns(transactionSearchResult.transactions);
        //groupType = 'unconfirmed'
        unconfirmedTxns.value = formattedTxns
    }

    let loadPartialTransactions = async() => {
        if(!selectedAccount.value){
            return
        }
        let dashboardService = new DashboardService(walletState.currentLoggedInWallet, selectedAccount.value);
        let txnQueryParams = Helper.createTransactionQueryParams();
        txnQueryParams.pageSize = 100;
        txnQueryParams.address = selectedAccountAddressPlain.value
        let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.PARTIAL, txnQueryParams);
        let formattedTxns = await dashboardService.formatPartialMixedTxns(transactionSearchResult.transactions);
        //groupType = 'partial'
        partialTxns.value  = formattedTxns
    };

    let loadInQueueTransactions = ()=>{
        if(!selectedAccount.value){
            return
        }
        let txns = []
        listenerState.autoAnnounceSignedTransaction.forEach((tx)=>{
            let txn = TransactionMapping.createFromPayload(tx.signedTransaction.payload)
            let aggregateTxn = TransactionUtils.castToAggregate(txn)
            if (aggregateTxn.innerTransactions.find(tx=>tx.signer.address.plain()==props.address)!=undefined ||
            tx.signedTransaction.signer == acc.value.publicKey){
                txns.push({
                    type: 'Aggregate Bonded',
                    hash: tx.signedTransaction.hash,
                    deadline: txn.deadline.value,
                    groupType: 'In Queue',
                    recipient: '',
                    sender: '',
                    amount: '',
                    message: '',
                    sda: ''
                })
            }
        })
        inQueueTxns.value =txns
    }
    const init = async()=>{
      updateAccountTransactionCount();
      loadRecentTransactions();
      loadRecentTransferTransactions();
      await loadUnconfirmedTransactions();
      await loadPartialTransactions();
      loadInQueueTransactions();
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

    const linkToExplorer = ()=>{ 
        if(!networkState.currentNetworkProfile){ 
            return ''
        }
        return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.addressRoute + '/' + selectedAccount.value.address
      }

    return {
      isPublicNetwork,
      pendingTransactions,
      toSvg,
      addressExplorerURL,
      hashExplorerURL,
      currentBlock,
      displayBoard,
      copy,
      selectedAccountBalance,
      selectedAccountBalanceFront,
      selectedAccountBalanceBack,
      selectedAccountName,
      selectedAccountPublicKey,
      currentNativeTokenName,
      selectedAccountAddress,
      selectedAccountAddressPlain,
      selectedAccountAddressShort,
      recentTransactions,
      searchedTransactions, 
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
      // openCosignModal,
      signerPublicKey,
      signedPublicKey,
      // cosignTransaction,
      //decryptedMessage,
      manualPublicKey,
      publicKeyToUse,
      initialSignerPublicKey,
      isInitialSender,
      cosignModalKey,
      decryptMessageKey,
      txHash,
      accountConfirmedTxnsCount,
      txnTypeList,
      transactionGroupType,
      changeSearchTxnType,
      changeTxnGroupType,
      selectedTxnType,
      TransactionFilterType,
      recentTransferTxnRow,
      jdenticonConfig,
      faucetLink,
      boolIsTxnFetched,
      accountAssets,
      linkToExplorer
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