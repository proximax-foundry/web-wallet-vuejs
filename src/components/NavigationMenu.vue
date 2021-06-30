<template>
  <div class="relative text-center">
    <font-awesome-icon @click="showhideMenu();" icon="bars" :class="menuColorClass" class="menuBar absolute w-4 cursor-pointer" style="right: 7px; top: 9px;" v-if="showBar"></font-awesome-icon>
    <nav class="navbar" ref="navbarRef" v-if="showMenu">
      <router-link class="col" class-active="active" :to="{ name : 'ViewDashboard'}">Dashboard</router-link>
      <router-link class="col" class-active="active" :to="{ name : 'ViewTransferCreate'}">Transfer</router-link>
      <router-link class="col" class-active="active" :to="{ name : 'ViewAccountDisplayAll'}" :class="{'router-link-active': subIsActive([
        '/view-all-accounts',
        '/select-type-creation-account',
        '/create-account',
        '/import-account',
        '/delete-account',
        '/details-account',
        '/created-account',
        '/convert-account-multisign',
        '/edit-account-multisign',
        '/delegate',
        '/alias-address-to-namespace',
      ])}">Accounts</router-link>
      <router-link class="col" class-active="active" :to="{ name : 'ViewServices'}" :class="{'router-link-active': subIsActive([
        '/export-wallet',
        '/wallets',
        '/create-asset',
        '/address-book',
        '/add-contacts',
        '/delete-wallet-confirmed' ,
        '/nodes',
        '/multisig-multi-level',
        '/create-namespace',
        '/extend-namespace',
        '/asset-supply-change',
        '/swap-account-list',
        '/create-attestation',
        '/audit-attestation',
        '/notifications',
        '/create-poll',
        '/polls',
        '/vote-poll',
        '/my-file',
        '/upload-file',
        '/create-gift',
        '/redeem-gift-card',
        '/explorer',
        '/partial',
        '/swap-nis1-sirius',
        '/swap-sirius-eth',
        '/swap-sirius-bsc',
      ])}">Services</router-link>
    </nav>
    <nav class="navbar h-9" v-else>
    </nav>
  </div>
</template>

<script>
export default{
  name: 'NavigationMenu',
  data() {
    return {
      showMenu: false,
      showBar : false,
      wideScreen: false,
      menuColorClass: 'text-gray-700'
    };
  },
  methods: {
    showhideMenu: function (){
      this.showMenu = !this.showMenu;
      if(this.showMenu){
        this.menuColorClass = 'text-gray-300';
      }else{
        this.menuColorClass = 'text-gray-700';
      }
    },
    navMenuHandler: function (){
      if(window.innerWidth < '768'){
        this.wideScreen = false;
        this.showBar = true;
        this.showMenu = false;
      }else{
        this.wideScreen = true;
        this.showBar = false;
        this.showMenu = true;
      }
    },
    subIsActive(input) {
      const paths = Array.isArray(input) ? input : [input]
      return paths.some(path => {
        return this.$route.path.indexOf(path) === 0 // current path starts with this path string
      })
    }
  },
  created() {
    this.navMenuHandler();
    window.addEventListener("resize", this.navMenuHandler);
  },
  unmounted() {
    window.removeEventListener("resize", this.navMenuHandler);
  },
}
</script>
