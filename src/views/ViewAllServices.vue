<template>
  <div class='mt-2 py-3'>
    <div class="grid xs-grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
      <ServiceTile :key="index" :service="item" :showMenuCall="showMenu[index]" :i="index" v-for="(item, index) in services" />
      <!-- <div v-for="(item, index) in services" :key="index">{{ item.name }}</div> -->
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, ref } from "vue";
import ServiceTile from '@/components/ServiceTile.vue';

export default {
  name: 'ViewAllServices',
  components: {
    ServiceTile,
  },

  setup(p) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const currentMenu = ref('');
    const toggleModal = false;
    const showMenu = ref([]);
    const services = ref([
      {name: 'Accounts', desc: 'Manage your accounts', img: 'icon-accounts-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Accounts', link: '/view-all-accounts'},
        {name: 'Multisig', link: ''},
        {name: 'Restrictions', link: ''},
        {name: 'Metadata', link: ''},
        {name: 'Delegate', link: ''},
        {name: 'Link to Namespace', link: ''}
      ]},
      {name: 'Namespaces', desc: 'Create namespaces and sub-namespaces', img: 'icon-namespace-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Register', link: ''},
        {name: 'Extend Duration', link: ''}
      ]},
      {name: 'Mosaics', desc: 'Create digital representations with customized properties', img: 'icon-mosaics-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Create', link: '/create-mosaic'},
        {name: 'Modify Supply', link: ''},
        {name: 'Link to Namespace', link: ''}
      ]},
      {name: 'Mainnet Swap', desc: 'Swap from NEM to Sirius', img: 'icon-swap-process-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Transfer Assets', link: ''},
      ]},
      {name: 'Address Book', desc: 'Assign labels to addresses', img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'List', link: ''},
        {name: 'Add Contacts', link: ''},
      ]},
      {name: 'Wallets', desc: 'Manage your wallets', img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Change Password', link: ''},
        {name: 'Export', link: '/export-wallet'},
        {name: 'Delete', link: '/wallets'},
      ]},
      {name: 'Transactions', desc: 'Explorer all transactions', img: 'icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Change Password', link: ''},
        {name: 'Explorer', link: ''},
        {name: 'Partial', link: ''},
      ]},
      {name: 'Nodes', desc: 'Add and edit nodes', img: 'icon-nodes-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Blockchain', link: ''},
        {name: 'Storage', link: ''},
        {name: 'Streaming', link: ''},
      ]},
      {name: 'Attestation', desc: 'Proof of existence and origination', img: 'icon-attestation-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Attest', link: ''},
        {name: 'Audit', link: ''},
      ]},
      {name: 'Notifications', desc: 'Check alerts and information about your accounts', img: 'icon-notifications-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Notifications', link: ''},
      ]},
      {name: 'Voting', desc: 'Create, vote, and view results', img: 'icon-voting-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Create Poll', link: ''},
        {name: 'Vote', link: ''},
        {name: 'View Results', link: ''},
      ]},
      {name: 'Storage', desc: 'Upload and download your files and encrypt them', img: 'icon-storage-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Files', link: ''},
        {name: 'Upload File', link: ''},
        {name: 'Send / Share', link: ''},
      ]},
      {name: 'Sirius Gift', desc: 'Create a redeemable gift', img: 'icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu:[
        {name: 'Create', link: ''},
        {name: 'Redeem', link: ''},
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

    if(p.deleteAccount=='success'){
      toggleModal.value = true;
    }

    emitter.on("CLOSE_NOTIFICATION", payload => {
      toggleModal.value = payload;
    });

    emitter.on('PAGE_CLICK', () => {
      console.log('click: ' + currentMenu.value);
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
      toggleModal,
      showMenu,
      services,
    };
  },
}
</script>
