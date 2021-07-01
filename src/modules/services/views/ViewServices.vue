<template>
  <div class='mt-2 py-3'>
    <div class="grid xs-grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
      <ServiceTile :key="index" :service="item" :showMenuCall="showMenu[index]" :i="index" v-for="(item, index) in services" />
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, ref } from "vue";
import ServiceTile from '@/modules/services/components/ServiceTile.vue';

export default {
  name: 'ViewServices',
  components: {
    ServiceTile,
  },

  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const currentMenu = ref('');
    const showMenu = ref([]);
    const services = ref([
      {name: 'Namespaces', desc: 'Create namespaces and sub-namespaces', img: 'icon-namespace-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Register', link: 'ViewServicesNamespaceCreate'},
        {name: 'Extend Duration', link: 'ViewServicesNamespaceExtend'}
      ]},
      {name: 'Assets', desc: 'Create digital representations with customized properties', img: 'icon-mosaics-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Create', link: 'ViewServicesAssetsCreate'},
        {name: 'Modify Supply', link: 'ViewServicesAssetsModifySupplyChange'},
        {name: 'Link to Namespace', link: 'ViewServicesAssetsLinkToNamespace'}
      ]},
      {name: 'Mainnet Swap', desc: 'Swap from NEM to Sirius', img: 'icon-swap-process-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        { name: 'NIS1', link: 'ViewServicesMainnetSwapNIS1ToSirius'},
        { name: 'ETH', link: 'ViewServicesMainnetSwapEthOptions'},
        { name: 'BSC', link: 'ViewServicesMainnetSwapBscOptions'},
      ]},
      {name: 'Address Book', desc: 'Assign labels to addresses', img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'List', link: 'ViewServicesAddressBook'},
        {name: 'Add Contacts', link: 'ViewServicesAddressBookAddContacts'},
      ]},
      {name: 'Wallets', desc: 'Manage your wallets', img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Change Password', link: ''},
        {name: 'Export', link: 'ViewWalletExport'},
        {name: 'Delete', link: 'ViewWallets'},
      ]},
      {name: 'Transactions', desc: 'Explorer all transactions', img: 'icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Explorer', link: 'ViewServicesExplorer'},
        {name: 'Partial', link: 'ViewServicesExplorerPartial'},
      ]},
      {name: 'Nodes', desc: 'Add and edit nodes', img: 'icon-nodes-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Blockchain', link: 'ViewServicesNodes'},
        {name: 'Storage', link: ''},
        {name: 'Streaming', link: ''},
      ]},
      {name: 'Attestation', desc: 'Proof of existence and origination', img: 'icon-attestation-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Attest', link: 'ViewServicesAttestationCreate'},
        {name: 'Audit', link: 'ViewServicesAttestationAudit'},
      ]},
      {name: 'Notifications', desc: 'Check alerts and information about your accounts', img: 'icon-notifications-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Notifications', link: 'ViewServicesNotifications'},
      ]},
      {name: 'Voting', desc: 'Create, vote, and view results', img: 'icon-voting-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Create Poll', link: 'ViewServicesVotingCreatePoll'},
        {name: 'Vote', link: 'ViewServicesVotingPoll'},
        {name: 'View Results', link: ''},
      ]},
      {name: 'Storage', desc: 'Upload and download your files and encrypt them', img: 'icon-storage-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Files', link: 'ViewServicesStorageMyFile'},
        {name: 'Upload File', link: 'ViewServicesStorageUploadFile'},
        {name: 'Send / Share', link: ''},
      ]},
      {name: 'Sirius Gift', desc: 'Create a redeemable gift', img: 'icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Create', link: 'ViewServicesSiriusGiftCreateGift'},
        {name: 'Redeem', link: 'ViewServicesSiriusGiftRedeem'},
      ]},
      {name: 'Aggregate Transactions', desc: 'Merge multiple transactions into one', img: 'icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: 'Complete', link: ''},
        {name: 'Bonded', link: ''},
      ]},
      {name: 'Cross-Chain Swaps', desc: 'Atomic Cross-Chain Swap between public and private networks', img: 'icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: 'Secred Lock', link: ''},
        {name: 'Secred Proof', link: ''},
      ]},
      {name: 'Invoice', desc: 'Create and manage invoices', img: 'icon-invoice-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: 'Create', link: ''},
      ]},
      {name: 'Supercontracts', desc: 'Create and execute logical flows for digital contract obligations', img: 'icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: 'Create', link: ''},
        {name: 'Status', link: ''},
      ]},
      {name: 'Chat', desc: 'Encrypted live chat', img: 'icon-chat-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: 'Start', link: ''},
      ]},
      {name: 'Video Conferencing', desc: 'Encrypted live video streaming', img: 'icon-streaming-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu:[
        {name: 'Start', link: ''},
        {name: 'Schedule', link: ''},
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
