<template>
  <div class="lg:ml-60 mt-10 lg:mt-16 flex-grow px-5 pt-5">
    <div class="w-11/12 ml-auto mr-auto mt-3 py-3">
      <div>Services</div>
      <div class='border ml-auto mr-auto mt-6 filter shadow-lg'>
        <div class='flex  flex-wrap items-center justify-around p-3 gap-4'>
          <router-link  v-if="nodeEnv != 'production'" :to="{ name: 'ViewServicesPortfolio' }" class='w-40 '>
            <img src="@/modules/services/submodule/portfolio/img/icon-portfolio.svg"
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18">
            <div class='text-center text-xs font-semibold'>Portfolio</div>
          </router-link>
          <router-link :to="{ name: 'ViewServicesAirdropToken' }" class='w-40 '>
            <img src="@/modules/services/submodule/portfolio/img/icon-portfolio.svg"
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18">
            <div class='text-center text-xs font-semibold'>Airdrop Token Utility</div>
          </router-link>
          <div class="w-40"  v-if="nodeEnv != 'production'" @click="toggle">
            <img src="@/modules/services/submodule/portfolio/img/icon-portfolio.svg"
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18">
            <div class='text-center text-xs font-semibold'>SDA Exchange</div>
          </div>
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
          <div class='w-40 ' @click="select">
            <img src="@/modules/services/submodule/portfolio/img/icon-portfolio.svg"
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18">
            <div class='text-center text-xs font-semibold'>Nft Maker</div>
          </div>
          <Menu ref="option" id="overlay_menu" :model="options" :popup="true" />
          <router-link :to="{ name: 'ViewServicesNftDistribution' }" class='w-40 '>
            <img src="@/modules/services/submodule/portfolio/img/icon-portfolio.svg"
              class="ml-auto mr-auto mt-4 mb-3 h-18 w-18">
            <div class='text-center text-xs font-semibold'>Nft Distribution </div>
          </router-link>
        </div>
      </div>
    </div>
    <!-- <div class='mt-2 py-3'>
      <div class="grid xs-grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <ServiceTile :key="index" :service="item" :showMenuCall="showMenu[index]" :i="index" v-for="(item, index) in services" />
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { AppState } from "@/state/appState";
import Menu from 'primevue/menu';
import { useRouter } from 'vue-router'
import { ref} from "vue";
const nodeEnv =  process.env.VITE_NODE_ENV
const networkType = AppState.networkType
const menu = ref();
const option = ref();
const toggle = (event) => {
  menu.value.toggle(event);
};
const select = (event) => {
  option.value.toggle(event);
};

const router = useRouter()

const items = ref([
  {
    label: 'Create SDA Exchange',
    command: () => {
      router.push('/exchange/create')
    }
  },
  {
    label: 'View SDA Listing',
    command: () => {
      router.push('/exchange/listing')
    }
  }
]);

const options = ref([
  {
    label: 'Create Nft',
    command: () => {
      router.push('/view-nft-maker')
    }
  },
  {
    label: 'View Nft',
    command: () => {
      router.push('/view-nft')
    }
  }
]);


</script>

<!-- <script lang="ts">
import { getCurrentInstance, ref, computed } from "vue";
import ServiceTile from '@/modules/services/components/ServiceTile.vue';
import { useI18n } from 'vue-i18n'

export default {
  name: 'ViewServices',
  // components: {
  //   ServiceTile,
  // },

  setup() {
    const { t } = useI18n();


    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const currentMenu = ref('');
    const showMenu = ref([]);
    const services = ref([
      {
        name: computed(() => t('services.namespaces')), desc: computed(() => t('services.namespacedescription')), img: 'icon-namespace-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu: [
          { name: computed(() => t('services.register')), link: 'ViewServicesNamespaceCreate' },
          { name: computed(() => t('services.extendduration')), link: 'ViewServicesNamespaceExtend' }
        ]
      },
      {
        name: computed(() => t('services.assets')), desc: computed(() => t('services.mosaicsdescription')), img: 'icon-mosaics-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu: [
          { name: computed(() => t('welcome.create')), link: 'ViewServicesAssetsCreate' },
          { name: computed(() => t('services.modifysupply')), link: 'ViewServicesAssetsModifySupplyChange' },
          { name: computed(() => t('services.linktonamespace')), link: 'ViewServicesAssetsLinkToNamespace' }
        ]
      },
      {
        name: computed(() => t('services.mainnetswap')), desc: computed(() => t('services.swapdescription')), img: 'icon-swap-process-color-80h-proximax-sirius-wallet.svg', enable: true, menu: [
          { name: computed(() => t('services.nis1')), link: 'ViewServicesMainnetSwapNIS1ToSirius' },
          { name: computed(() => t('services.eth')), link: 'ViewServicesMainnetSwapEthOptions' },
          { name: computed(() => t('services.bsc')), link: 'ViewServicesMainnetSwapBscOptions' },
        ]
      },
      {
        name: computed(() => t('services.addressbook')), desc: computed(() => t('services.addressbookdescription')), img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu: [
          { name: computed(() => t('services.list')), link: 'ViewServicesAddressBook' },
          { name: computed(() => t('services.addcontacts')), link: 'ViewServicesAddressBookAddContact' },
        ]
      },
      {
        name: computed(() => t('Header.wallet')), desc: computed(() => t('services.walletsdescription')), img: 'icon-address-book-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu: [
          { name: computed(() => t('services.changepassword')), link: '' },
          { name: computed(() => t('accounts.export')), link: 'ViewWalletExport' },
          { name: computed(() => t('accounts.delete')), link: 'ViewWallets' },
        ]
      },
      {
        name: computed(() => t('dashboard.transactions')), desc: computed(() => t('services.transactiondescription')), img: 'icon-transaction-explorer-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu: [
          { name: computed(() => t('services.explorer')), link: '' },
          { name: computed(() => t('accounts.partial')), link: '' },
        ]
      },
      {
        name: computed(() => t('services.nodes')), desc: computed(() => t('services.nodesdescription')), img: 'icon-nodes-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu: [
          { name: computed(() => t('welcome.blockchain')), link: 'ViewServicesNodes' },
          { name: computed(() => t('welcome.storage')), link: '' },
          { name: computed(() => t('welcome.streaming')), link: '' },
        ]
      },
      {
        name: computed(() => t('services.notifications')), desc: computed(() => t('services.notificationdescription')), img: 'icon-notifications-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu: [
          { name: computed(() => t('services.notifications')), link: 'ViewServicesNotifications' },
        ]
      },
      {
        name: computed(() => t('services.voting')), desc: computed(() => t('services.votedescription')), img: 'icon-voting-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu: [
          { name: computed(() => t('services.createpoll')), link: 'ViewServicesVotingCreatePoll' },
          { name: computed(() => t('services.vote')), link: 'ViewServicesVotingPoll' },
          { name: computed(() => t('services.viewresults')), link: '' },
        ]
      },
      {
        name: computed(() => t('welcome.storage')), desc: computed(() => t('services.storagedescription')), img: 'icon-storage-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu: [
          { name: computed(() => t('services.files')), link: 'ViewServicesStorageMyFile' },
          { name: computed(() => t('services.uploadfile')), link: 'ViewServicesStorageUploadFile' },
          { name: computed(() => t('services.sendshare')), link: '' }
        ]
      },
      {
        name: computed(() => t('services.siriusgift')), desc: computed(() => t('services.siriusgiftdescription')), img: 'icon-gift-sirius-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu: [
          { name: computed(() => t('services.redeem')), link: 'ViewServicesSiriusGiftRedeem' },
        ]
      },
      {
        name: computed(() => t('services.aggregatetransactions')), desc: computed(() => t('services.aggregatetransactions')), img: 'icon-aggregate-transactions-full-color-80h-proximax-sirius-wallet.svg', enable: true, menu: [
          { name: computed(() => t('services.complete')), link: 'ViewServicesAggregateTransactionsComplete' },
          { name: computed(() => t('services.bonded')), link: '' },
        ]
      },
      {
        name: computed(() => t('services.crosschainswap')), desc: computed(() => t('services.crosschaindescription')), img: 'icon-cross-chain-swap-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu: [
          { name: computed(() => t('services.secredlock')), link: '' },
          { name: computed(() => t('services.secredproof')), link: '' },
        ]
      },
      {
        name: computed(() => t('services.invoice')), desc: computed(() => t('services.invoicedescription')), img: 'icon-invoice-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu: [
          { name: computed(() => t('welcome.create')), link: '' },
        ]
      },
      {
        name: computed(() => t('welcome.supercontracts')), desc: computed(() => t('services.supercontractsdescription')), img: 'icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu: [
          { name: computed(() => t('welcome.create')), link: '' },
          { name: computed(() => t('services.status')), link: '' },
        ]
      },
      {
        name: computed(() => t('services.chat')), desc: computed(() => t('services.chatdescription')), img: 'icon-chat-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu: [
          { name: computed(() => t('services.start')), link: '' },
        ]
      },
      {
        name: computed(() => t('services.videoconferencing')), desc: computed(() => t('services.videoconferencingdescription')), img: 'icon-streaming-full-color-80h-proximax-sirius-wallet.svg', enable: false, menu: [
          { name: computed(() => t('services.start')), link: '' },
          { name: computed(() => t('services.schedule')), link: '' },
        ]
      },
    ]);

    // get num of accounts
    var num_service = services.value.length;
    var i = 0;
    while (i < num_service) {
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
      while (j < num_service) {
        showMenu.value[j] = false;
        j++;
      }
    });

    emitter.on('PAGE_CLICK', () => {
      if (currentMenu.value === '') {
        var k = 0;
        while (k < num_service) {
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
</script> -->
