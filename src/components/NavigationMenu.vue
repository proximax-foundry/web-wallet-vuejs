<template>
  <div class="relative text-center">
    <nav class="navbar h-9 text-white font-bold">
      <router-link class="col" :to="{ name : 'ViewServices'}">ProximaX Swap Service</router-link>
      <a class="text-white font-bold" @click="getExplorerUrl">Explorer</a>
    </nav>
  </div>
</template>

<script>
import { computed } from "vue";
import { walletState } from '@/state/walletState';
import { networkState } from "@/state/networkState";
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
  setup(){
    const publicKeyExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.publicKeyRoute);
    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const wallet = walletState.currentLoggedInWallet.accounts[0];
   
    const getExplorerUrl = () =>{
      const explorerurl = window.open(explorerBaseURL.value + publicKeyExplorerURL.value + "/" + wallet.publicKey);
      return explorerurl;
    }
    return {
      getExplorerUrl
    }
  },
}
</script>
