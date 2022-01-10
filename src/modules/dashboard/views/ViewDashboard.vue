<template>
  <div>
    <div class="px-2 sm:px-10 bg-gray-200 pb-4 pt-5">
      <div class="md:grid md:grid-cols-2 xl:grid-cols-3">
        <div class="block md:hidden">
          <div class="shadow-md w-full relative overflow-x-hidden address_div px-7 py-3 rounded flex flex-col bg-white text-black">
            <div class="text-center py-3">
              <div class="text-center my-2"><div class="inline-block"><span class="font-bold text-xl">{{ selectedAccountBalanceFront }}</span>{{ selectedAccountBalanceBack?'.':'' }}<span class="text-md">{{ selectedAccountBalanceBack }}</span> <span class="font-bold text-xl">{{ currentNativeTokenName }}</span></div><img src="@/modules/dashboard/img/icon-xpx.svg" class="inline-block w-6 h-6 ml-3 relative" style="top: -6px;"></div>
              <div class="inline-block text-xs font-bold text-blue-primary cursor-pointer" @click="openSetDefaultModal = !openSetDefaultModal">{{ selectedAccountName }}<img src="@/modules/dashboard/img/icon-blue-chevron-right.svg" class="inline-block w-5 h-5 ml-1 relative" style="top: -2px"></div>
              <div class="mb-8">
                <div id="address" class="inline-block font-bold outline-none break-all text-xs lg:text-tsm" :copyValue="selectedAccountAddressPlain" copySubject="Address">{{ selectedAccountAddressShort }}</div>
                <img src="@/modules/dashboard/img/icon-copy.svg" class="w-4 cursor-pointer ml-4 inline-block" @click="copy('address')">
              </div>
              <div>
                <router-link :to="{ name: 'ViewTransferCreate'}" class="inline-block text-center mr-2">
                  <div class="inline-block rounded-full bg-blue-primary w-8 h-8">
                    <div class="h-full w-full flex items-center justify-center">
                      <img src="@/modules/dashboard/img/icon-balance-white.svg" class="w-5 h-5">
                    </div>
                  </div><br>
                  <div class="text-xxs text-gray-400 inline-block uppercase">Top Up</div>
                </router-link>
                <router-link :to="{ name: 'ViewTransferCreate'}" class="inline-block text-center mx-2">
                  <div class="inline-block rounded-full bg-blue-primary w-8 h-8">
                    <div class="h-full w-full flex items-center justify-center">
                      <img src="@/modules/dashboard/img/icon-transfer-white.svg" class="w-5 h-5">
                    </div>
                  </div><br>
                  <div class="text-xxs text-gray-400 inline-block uppercase">Transfer</div>
                </router-link>
                <router-link :to="{ name: 'ViewTransferCreate'}" class="inline-block text-center ml-2">
                  <div class="inline-block rounded-full bg-blue-primary w-8 h-8">
                    <div class="h-full w-full flex items-center justify-center">
                      <img src="@/modules/dashboard/img/icon-swap-white.svg" class="w-5 h-5">
                    </div>
                  </div><br>
                  <div class="text-xxs text-gray-400 inline-block uppercase">Swap</div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="pr-2 hidden md:inline-block">
          <div class="shadow-md w-full relative overflow-x-hidden address_div px-7 py-3 rounded-lg balance-div flex flex-col justify-between bg-navy-primary text-white">
            <div class="text-right">
              <div class="inline-block text-txs font-bold text-blue-primary pappflex items-center rounded-b-sm"><img src="@/modules/dashboard/img/icon-bookmark.svg" class="w-3 h-3 mr-1 inline-block">DEFAULT ACCOUNT</div><br>
              <div class="inline-block text-txs underline xl:text-sm cursor-pointer" @click="openSetDefaultModal = !openSetDefaultModal">{{ selectedAccountName }}</div>
            </div>
            <div>
              <div class="text-gray-300 text-txs">CURRENT BALANCE</div>
              <div class="flex items-center"><div class="inline-block"><span class="font-bold text-lg">{{ selectedAccountBalanceFront }}</span>{{ selectedAccountBalanceBack?'.':'' }}<span class="text-xs">{{ selectedAccountBalanceBack }}</span> <span class="font-bold text-lg">{{ currentNativeTokenName }}</span></div><img src="@/modules/dashboard/img/icon-xpx.svg" class="inline-block w-4 h-4 ml-4"></div>
              <div class="text-gray-300 text-txs mt-1">Estimate US$ {{ currencyConvert }}</div>
            </div>
            <div class="flex justify-between mt-2">
              <div>
                <router-link :to="{ name: 'ViewTransferCreate'}"  class="flex items-center mb-3"><img src="@/assets/img/icon-header-account.svg" class="w-4 h-4 cursor-pointer mr-1"><div class="text-xxs md:text-xs font-bold inline-block" style="margin-top: 1px">Top Up</div><img src="@/modules/dashboard/img/icon-info.svg" class="w-3 h-3 ml-2 inline-block"></router-link>
              </div>
              <div class="flex items-center mb-3"><img src="@/modules/dashboard/img/icon-swap.svg" class="w-4 h-4 cursor-pointer mr-1"><div class="text-xxs md:text-xs font-bold text-gray-500" style="margin-top: 1px">Swap</div></div>
            </div>
          </div>
        </div>
        <div class="sm:pl-2 xl:px-2 hidden md:inline-block">
          <div class="shadow-md w-full relative inline-block overflow-x-hidden address_div bg-gray-50 px-5 py-4 rounded-lg default-div">
            <div class="text-gray-400 text-txs mt-7 mb-2">WALLET ADDRESS</div>
            <div class="flex items-center justify-between mb-8">
              <div id="address" class="font-bold outline-none break-all text-xs lg:text-tsm h-8" :copyValue="selectedAccountAddressPlain" copySubject="Address">{{ selectedAccountAddress }}</div>
              <img src="@/modules/dashboard/img/icon-copy.svg" class="w-4 cursor-pointer ml-4" @click="copy('address')">
            </div>
            <div class="flex justify-between w-full">
              <div class="my-2 flex items-center"><a href="https://bctestnetfaucet.xpxsirius.io/#/" target=_new><img src="@/modules/dashboard/img/icon-qr_code.svg" class="w-4 h-4 cursor-pointer mr-1 inline-block"><span class="text-xs font-bold" style="margin-top: 1px">Scan QR Code</span></a></div>
              <div class="my-2 flex items-center"><img src="@/modules/dashboard/img/icon-multisig-blue.svg" class="w-4 h-4 cursor-pointer mr-1"><div class="text-xs font-bold" style="margin-top: 1px">Convert to Multisig</div></div>
            </div>
          </div>
        </div>
        <div class="pl-2 hidden xl:inline-block">
          <div class="shadow-md w-full relative overflow-x-hidden address_div bg-navy-primary px-7 py-3 rounded-lg transaction-div text-white">
            <div class="text-tsm mt-7">Recent Transfers</div>
            <div class="text-gray-400 text-tsm mt-4 mb-2 h-12">Invite your families and friends to create Sirius Wallet account and start transferring to their accounts.</div>
            <router-link :to="{ name: 'ViewTransferCreate'}"  class="flex items-center mt-5"><img src="@/assets/img/icon-transfer.svg" class="w-4 h-4 cursor-pointer mr-1"><div class="text-xxs md:text-xs font-bold" style="margin-top: 1px">Transfer {{currentNativeTokenName}}</div></router-link>
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
      <div class="text-txs text-gray-400 mt-10"><b class="text-gray-700">RECENT TRANSACTIONS</b> ({{ accountConfirmedTxnsCount }} - View all)</div>
      <MixedTxnDataTable :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="recentTransactions" @openDecryptMsg="openDecryptMsgModal"></MixedTxnDataTable>
      <div class="mt-10 md:flex ml-5 md:ml-0">
        <div class="w-full md:w-1/2">
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
            <div class="flex items-center w-80 mb-2">
              <div class="bg-gray-100 rounded-md w-12 h-12 inline-block"></div>
              <div class="inline-block ml-2 dashboard-link">
                <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="text-tsm mb-1 relative top-1 text-blue-link">Create New Account</router-link>
                <p class="text-txs w-60">Create an on-chain unique place for your business and your assets.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/2 mt-7 md:mt-0">
          <div class="mb-8 font-bold text-txs uppercase">Getting started guide</div>
          <div class="text-xs sm:text-tsm">
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
      <div class="text-right">
        <select v-model="selectedTxnType" @change="changeSearchTxnType" class="border border-gray-200 px-2 py-1 focus:outline-none">
          <option value="all" class="text-sm">All</option>
          <option v-bind:key="txnType.value" v-for="txnType in txnTypeList" :value="txnType.value" class="text-sm">{{ txnType.label}}</option>
        </select>
      </div>
      <MixedTxnDataTable v-if="selectedTxnType === 'all'" :selectedGroupType="transactionGroupType.CONFIRMED" @openMessage="openMessageModal" @openDecryptMsg="openDecryptMsgModal" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></MixedTxnDataTable>
      <TransferTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.TRANSFER" :selectedGroupType="transactionGroupType.CONFIRMED" @openMessage="openMessageModal" @openDecryptMsg="openDecryptMsgModal" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></TransferTxnDataTable>
      <AccountTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.ACCOUNT" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></AccountTxnDataTable>
      <AggregateTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.AGGREGATE" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></AggregateTxnDataTable>
      <AliasTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.ALIAS" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></AliasTxnDataTable>
      <AssetTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.ASSET" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></AssetTxnDataTable>
      <ChainTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.CHAIN" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></ChainTxnDataTable>
      <ExchangeTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.EXCHANGE" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></ExchangeTxnDataTable>
      <LinkTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.LINK" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></LinkTxnDataTable>
      <LockTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.LOCK" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></LockTxnDataTable>
      <MetadataTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.METADATA" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></MetadataTxnDataTable>
      <NamespaceTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.NAMESPACE" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></NamespaceTxnDataTable>
      <RestrictionTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.RESTRICTION" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></RestrictionTxnDataTable>
      <SecretTxnDataTable v-else-if="selectedTxnType === TransactionFilterType.SECRET" :selectedGroupType="transactionGroupType.CONFIRMED" :transactions="searchedTransactions" :currentAddress="selectedAccountAddressPlain"></SecretTxnDataTable>
    </div>
    <SetAccountDefaultModal @dashboardSelectAccount="updateSelectedAccount" :toggleModal="openSetDefaultModal" />
  </div>
</template>

<script>
import { computed, defineComponent, ref, getCurrentInstance, watch } from 'vue';
import {ResolvedNamespace} from '@/modules/dashboard/model/resolvedNamespace';
import { TransactionFilterType, TransactionFilterTypes } from '@/modules/dashboard/model/transactions/transaction';
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

import DashboardAssetDataTable from '@/modules/dashboard/components/DashboardAssetDataTable.vue';
import DashboardNamespaceDataTable from '@/modules/dashboard/components/DashboardNamespaceDataTable.vue';

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
import { DashboardService } from '@/modules/dashboard/service/dashboardService';
import qrcode from 'qrcode-generator';
//import Dialog from 'primevue/dialog';
import { listenerState } from '@/state/listenerState';
import { WalletUtils } from '@/util/walletUtils';

export default defineComponent({
  name: 'ViewDashboard',
  props:{
    type: String
  },
  components: {
    SetAccountDefaultModal,
    MixedTxnDataTable,
    TransferTxnDataTable,
    AccountTxnDataTable,
    AggregateTxnDataTable,
    AliasTxnDataTable,
    AssetTxnDataTable,
    ChainTxnDataTable,
    ExchangeTxnDataTable,
    LinkTxnDataTable,
    LockTxnDataTable,
    MetadataTxnDataTable,
    NamespaceTxnDataTable,
    RestrictionTxnDataTable,
    SecretTxnDataTable,
    DashboardAssetDataTable,
    DashboardNamespaceDataTable,
  },

  setup(props){
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

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);
    const currentNativeTokenId = computed(()=> networkState.currentNetworkProfile.network.currency.assetId);

    let currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount() ? walletState.currentLoggedInWallet.selectDefaultAccount() : walletState.currentLoggedInWallet.accounts[0];
    currentAccount.default = true;

    const selectedAccount = ref(currentAccount);

    const currentBlock = computed(() => listenerState.currentBlock);

    const selectedAccountPublicKey = computed(()=> selectedAccount.value.publicKey);
    // const selectedAccountAddress = computed(()=> Helper.createAddress(selectedAccount.value.address).pretty().substring(0, 13) + '....' + Helper.createAddress(selectedAccount.value.address).pretty().substring(Helper.createAddress(selectedAccount.value.address).pretty().length - 11));
    const selectedAccountAddress = computed(()=> Helper.createAddress(selectedAccount.value.address).pretty());
    const selectedAccountAddressPlain = computed(()=> selectedAccount.value.address);
    const selectedAccountAddressShort = computed(() => {
      let prettyAddress = Helper.createAddress(selectedAccount.value.address).pretty();
      let firstPartAddress = prettyAddress.substr(0, 11);
      let secondPartAddress = prettyAddress.substr(-11);
      return firstPartAddress + '...' + secondPartAddress;
    });
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
      return selectedAccount.value.assets.filter(x => x.idHex !== currentNativeTokenId.value).length;
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

    let dashboardService = new DashboardService(walletState.currentLoggedInWallet, selectedAccount.value);

    let accountConfirmedTxnsCount = ref(0);

    let updateAccountTransactionCount = async()=>{
      let transactionsCount = await dashboardService.getAccountTransactionsCount(currentAccount);
      
      accountConfirmedTxnsCount.value = transactionsCount.confirmed;
    };

    updateAccountTransactionCount();

    /*
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
    */
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

    let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);

    allTxnQueryParams.updateFieldOrder(blockDescOrderSortingField);
    allTxnQueryParams.embedded = true;
    // allTxnQueryParams.address = selectedAccountAddressPlain.value;

    let loadRecentTransactions = async()=>{
      let txnQueryParams = Helper.createTransactionQueryParams();
      txnQueryParams.pageSize = 1;
      txnQueryParams.address = selectedAccountAddressPlain.value;
      txnQueryParams.embedded = true;
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);

      let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.CONFIRMED, txnQueryParams);

      let formattedTxns = await dashboardService.formatConfirmedMixedTxns(transactionSearchResult.transactions);
      recentTransactions.value = formattedTxns.slice(0, 5);
      searchedTransactions.value = formattedTxns;
    };

    loadRecentTransactions();

    let loadRecentTransferTransactions = async()=>{
      let txnQueryParams = Helper.createTransactionQueryParams();
      txnQueryParams.pageSize = 1;
      txnQueryParams.type = TransactionFilterTypes.getTransferTypes();
      txnQueryParams.signerPublicKey = selectedAccountPublicKey.value;
      txnQueryParams.embedded = true;
      txnQueryParams.updateFieldOrder(blockDescOrderSortingField);

      let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.CONFIRMED, txnQueryParams);

      let txnQueryParams2 = Helper.createTransactionQueryParams();
      txnQueryParams2.pageSize = 1;
      txnQueryParams2.type = TransactionFilterTypes.getTransferTypes();
      txnQueryParams2.recipientAddress = selectedAccountAddressPlain.value;
      txnQueryParams2.embedded = true;
      txnQueryParams2.updateFieldOrder(blockDescOrderSortingField);

      let transactionSearchResult2 = await dashboardService.searchTxns(transactionGroupType.CONFIRMED, txnQueryParams2);

      let tempTxns = [];

      if(transactionSearchResult.transactions.length){
        let formattedTxns = await dashboardService.formatConfirmedMixedTxns(transactionSearchResult2.transactions);

        tempTxns = formattedTxns;
      }

      if(transactionSearchResult2.transactions.length){
        let formattedTxns2 = await dashboardService.formatConfirmedMixedTxns(transactionSearchResult2.transactions);
        tempTxns = tempTxns.concat(formattedTxns2);
      }
      
      recentTransferTransactions.value = removeDuplicateTxn(tempTxns);
    };

    loadRecentTransferTransactions();

    const reloadSearchTxns = () =>{
      allTxnQueryParams.pageNumber = 1;
      endOfRecords = false;

      searchTransactions();
    }

    const loadMoreTxns = () =>{
      searchTransactions(true);
    }

    const searchTransaction = async(loadMore = false) =>{

      allTxnQueryParams.pageNumber = loadMore ? allTxnQueryParams.pageSize + 1 : 1;
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
      openSetDefaultModal,
      currencyConvert,
      displayConvertion,
      currentNativeTokenName,
      selectedAccountAddress,
      selectedAccountAddressPlain,
      selectedAccountAddressShort,
      updateSelectedAccount,
      isDefault,
      isMultisig,
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
      TransactionFilterType
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