<template>
  <div class="relative text-center">
    <font-awesome-icon @click="showhideMenu();" icon="bars" :class="menuColorClass" class="menuBar absolute w-4 cursor-pointer" style="right: 7px; top: 9px;" v-if="showBar"></font-awesome-icon>
    <nav class="navbar" ref="navbarRef" v-if="showMenu">
      <router-link class="col" class-active="active" to="/dashboard" exact>Dashboard</router-link>
      <router-link class="col" class-active="active" to="/" exact>Transfer</router-link>
      <router-link class="col" class-active="active" to="/view-all-accounts" exact>Accounts</router-link>
      <router-link class="col" class-active="active" to="/export-wallet" exact>Services</router-link>
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
