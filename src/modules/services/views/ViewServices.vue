<template>
  <div class='mt-2 py-3'>
    <div class="grid xs-grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
      <ServiceTile :key="index" :service="item" :showMenuCall="showMenu[index]" :i="index" v-for="(item, index) in services" />
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, ref, computed } from "vue";
import ServiceTile from '@/modules/services/components/ServiceTile.vue';
import {useI18n} from 'vue-i18n'

export default {
  name: 'ViewServices',
  components: {
    ServiceTile,
  },

  setup() {
    const {t} = useI18n();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const currentMenu = ref('');
    const showMenu = ref([]);
    const services = ref([
      {name: computed(() => t('common.namespaces')), desc: computed(() => t('services.namespaceDescription')), img: 'icon-namespace-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: computed(() => t('common.register')), link: ''},
        {name: computed(() => t('services.extendDuration')), link: ''}
      ]},
      {name: computed(() => t('common.assets')), desc: computed(() => t('services.assetsDescription')), img: 'icon-mosaics-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: computed(() => t('common.create')), link: 'ViewServicesAssetsCreate'},
        {name: computed(() => t('services.modifySupply')), link: 'ViewServicesAssetsModifySupplyChange'},
        {name: computed(() => t('services.linkToNamespace')), link: 'ViewServicesAssetsLinkToNamespace'}
      ]},
      {name: computed(() => t('services.mainnetSwap')), desc: computed(() => t('services.swapDescription')), img: 'icon-swap-process-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        { name: computed(() => t('common.nis1')), link: 'ViewServicesMainnetSwapNIS1ToSirius'},
        { name: computed(() => t('common.eth')), link: 'ViewServicesMainnetSwapEthOptions'},
        { name: computed(() => t('common.bsc')), link: 'ViewServicesMainnetSwapBscOptions'},
      ]},
      {name: computed(() => t('services.addressBook')), desc: computed(() => t('services.addressBookDescription')), img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: computed(() => t('common.list')), link: 'ViewServicesAddressBook'},
        {name: computed(() => t('services.addContacts')), link: 'ViewServicesAddressBookAddContacts'},
      ]},
      {name: computed(() => t('common.wallet',1)), desc: computed(() => t('services.walletsDescription')), img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: computed(() => t('services.changePassword')), link: ''},
        {name: computed(() => t('common.export')), link: 'ViewWalletExport'},
        {name: computed(() => t('common.delete')), link: 'ViewWallets'},
      ]},
      {name: computed(() => t('common.transaction',2)), desc: computed(() => t('services.transactionDescription')), img: 'icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: computed(() => t('common.explorer')), link: 'ViewServicesExplorer'},
        {name: computed(() => t('common.partial')), link: 'ViewServicesExplorerPartial'},
      ]},
      {name: computed(() => t('common.nodes')), desc: computed(() => t('services.nodesDescription')), img: 'icon-nodes-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: computed(() => t('common.blockchain')), link: 'ViewServicesNodes'},
        {name: computed(() => t('common.storage')), link: ''},
        {name: computed(() => t('common.streaming')), link: ''},
      ]},
      {name: computed(() => t('common.attestation')), desc: computed(() => t('services.attestDescription')), img: 'icon-attestation-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: computed(() => t('common.attest')), link: 'ViewServicesAttestationCreate'},
        {name: computed(() => t('common.audit')), link: 'ViewServicesAttestationAudit'},
      ]},
      {name: computed(() => t('common.notifications')), desc: computed(() => t('services.notificationDescription')), img: 'icon-notifications-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: computed(() => t('common.notifications')), link: 'ViewServicesNotifications'},
      ]},
      {name: computed(() => t('common.voting')), desc: computed(() => t('services.voteDescription')), img: 'icon-voting-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: computed(() => t('vote.createPoll')), link: 'ViewServicesVotingCreatePoll'},
        {name: computed(() => t('common.vote')), link: 'ViewServicesVotingPoll'},
        {name: computed(() => t('services.viewResults')), link: ''},
      ]},
      {name: computed(() => t('common.storage')), desc: computed(() => t('services.storageDescription')), img: 'icon-storage-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: computed(() => t('common.file',2)), link: 'ViewServicesStorageMyFile'},
        {name: computed(() => t('services.uploadFile')), link: 'ViewServicesStorageUploadFile'},
        {name: computed(() => t('services.sendShare')), link: ''}
      ]},
      {name: computed(() => t('gift.siriusGift')), desc: computed(() => t('services.siriusGiftDescription')), img: 'icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: computed(() => t('common.create')), link: 'ViewServicesSiriusGiftCreateGift'},
        {name: computed(() => t('common.redeem')), link: 'ViewServicesSiriusGiftRedeem'},
      ]},
      {name: computed(() => t('services.aggregateTransactions')), desc: computed(() => t('services.aggregateDescription')), img: 'icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: computed(() => t('common.complete')), link: ''},
        {name: computed(() => t('common.bonded')), link: ''},
      ]},
      {name: computed(() => t('services.crosschainSwap')), desc: computed(() => t('services.crosschainDescription')), img: 'icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: computed(() => t('services.secredLock')), link: ''},
        {name: computed(() => t('services.secredProof')), link: ''},
      ]},
     {name: computed(() => t('common.invoice')), desc: computed(() => t('services.invoiceDescription')), img: 'icon-invoice-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: computed(() => t('common.create')), link: ''},
      ]},
      {name: computed(() => t('common.superContracts')), desc: computed(() => t('services.superContractsDescription')), img: 'icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: computed(() => t('common.create')), link: ''},
        {name: computed(() => t('common.status')), link: ''},
      ]},
      {name: computed(() => t('common.chat')), desc: computed(() => t('services.chatDescription')), img: 'icon-chat-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: computed(() => t('common.start')), link: ''},
      ]},
      {name: computed(() => t('services.videoConferencing')), desc: computed(() => t('services.videoConferencingDescription')), img: 'icon-streaming-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: computed(() => t('common.start')), link: ''},
        {name: computed(() => t('common.schedule')), link: ''},
      ]},
    ]);

    // get num of accounts
    var num_service = services.value.length;
    var i = 0;
    while(i < num_service){
      showMenu.value[i] = false;
      i++;
    }

    emitter.on("SHOW_MENU_TRIGGER", payload => {
      showMenu.value[payload] = true;
      currentMenu.value = payload;
    });
    emitter.on("CLOSE_MENU_TRIGGER", payload => {
      showMenu.value[payload] = false;
      currentMenu.value = payload;
    });

    emitter.on("CLOSE_ALL_MENU_TRIGGER", () => {
      var j = 0;
      while(j < num_service){
        showMenu.value[j] = false;
        j++;
      }
    });

    emitter.on('PAGE_CLICK', () => {
      if(currentMenu.value === ''){
        var k = 0;
        while(k < num_service){
          showMenu.value[k] = false;
          k++;
        }
      }
    });

    emitter.on('HOVER_OVER_MENU_TRIGGER', index => {
      currentMenu.value = index;
    });

    emitter.on('HOVER_OUT_MENU_TRIGGER', () => {
      currentMenu.value = '';
    });

    return {
      showMenu,
      services,
    };
  },
}
</script>
