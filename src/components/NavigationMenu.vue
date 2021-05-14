<template>
  <div class="relative text-center">
    <font-awesome-icon @click="showhideMenu();" icon="bars" :class="menuColorClass" class="menuBar absolute w-4 cursor-pointer" style="right: 7px; top: 9px;" v-if="showBar"></font-awesome-icon>
    <nav class="navbar" ref="navbarRef" v-if="showMenu">
      <router-link class="col" class-active="active" :to="{ name : 'ViewDashboard'}">Dashboard</router-link>
      <router-link class="col" class-active="active" :to="{ name : 'ViewCreateTransfer'}">Transfer</router-link>
      <router-link class="col" class-active="active" :to="{ name : 'ViewDisplayAllAccounts'}" :class="{'router-link-active': subIsActive(['/view-all-accounts', '/select-type-creation-account', '/create-account', '/import-account', '/delete-account', '/details-account', '/created-account', '/convert-account-multisign', '/edit-account-multisign'])}">Accounts</router-link>
      <!-- <router-link class="col" class-active="active" :to="/create-mosaic" :class="{'router-link-active': subIsActive(['/export-wallet', '/add-contacts'])}">Services</router-link> -->
      <router-link class="col" class-active="active" :to="{ name : 'ViewAllServices'}" :class="{'router-link-active': subIsActive(['/export-wallet', '/wallets', '/create-mosaic', '/address-book', '/add-contacts', '/delete-wallet-confirmed' , '/nodes'])}">Services</router-link>
    </nav>
    <nav class="navbar h-9" v-else>
    </nav>
  </div>
</template>

<script>
import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';
export default{
  components: { FontAwesomeIcon },
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
