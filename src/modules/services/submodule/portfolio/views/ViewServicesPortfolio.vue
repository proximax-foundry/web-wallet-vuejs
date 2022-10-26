<template>
  <div class="lg:ml-60 mt-10 lg:mt-16 flex-grow px-5 pt-5">
    <div class="w-11/12 ml-auto mr-auto">
      <div class='border-2 py-3 px-6'>
          <div>Overview</div>
      </div>
    </div>
      <div class='mt-2 py-3 '>
        <div class="w-11/12 ml-auto mr-auto">
          <PortfolioAssetDataTable :assets="mosaics" />
        </div>
      </div>
    <div class="mb-36"/>
  </div>
</template>

<script>
import PortfolioAssetDataTable from '@/modules/services/submodule/portfolio/components/PortfolioAssetDataTable.vue';
import { walletState } from '@/state/walletState';
import { computed } from "vue";

export default{
    name: "ViewServicesPortfolio",
    components:{
      PortfolioAssetDataTable
    },

    setup(){
    const accounts = computed(
      () => {
        if(!walletState.currentLoggedInWallet){
          return null;
          }else{
            const accounts =  walletState.currentLoggedInWallet.accounts;
            return accounts
          }
        }
    );
    const mosaics = computed(() =>{
      var walletAsset = [];
      var totalAsset = []
      for(let j=0 ; j<accounts.value.length; j++){
      accounts.value[j].assets.forEach((i,index) => {
            walletAsset.push({
                i:index,
                id: i.idHex,
                name: (i.namespaceNames.length>0?i.namespaceNames[0]:""),
                balance: i.amount,
            });
            });
        }
      totalAsset = walletAsset.reduce((obj, item) => {  
      let find = obj.find(i => i.id === item.id);  
      let _d = {  
       ...item
      }
      find ? (find.balance += item.balance ) : obj.push(_d);
      return obj;
      }, [])
        return totalAsset
    })

      return {
        mosaics,
      }
    }

}

</script>