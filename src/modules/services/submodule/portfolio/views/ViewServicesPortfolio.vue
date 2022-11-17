<template>
  <div class="lg:ml-60 mt-10 lg:mt-16 flex-grow px-5 pt-5">
    <div class="w-11/12 ml-auto mr-auto">
      <div class="flex">
        <div class='py-3 px-6 lg:flex items-center'>
          <div class="text-xl mr-2 mb-2">Portfolio</div>
          <MultiDropdownPortfolioAccountComponent :account="accounts" @checked='onCheck'/>
        </div>        
      </div>
    </div>
      <div class='mt-2 py-3 '>
        <div class="w-11/12 ml-auto mr-auto border-2">
          <AssetComponent :accountAsset="mosaics"/>
        </div>
      </div>
    <div class="mb-36"/>
  </div>
</template>

<script>
import AssetComponent from '@/modules/services/submodule/portfolio/components/AssetComponent.vue';
import { walletState } from '@/state/walletState';
import { computed, ref } from "vue";
import { accountUtils } from "@/util/accountUtils";
import { AppState } from '@/state/appState';
import MultiDropdownPortfolioAccountComponent from '@/modules/services/submodule/portfolio/components/MultiDropdownPortfolioAccountComponent.vue'

export default{
    name: "ViewServicesPortfolio",
    components:{
      AssetComponent,
      MultiDropdownPortfolioAccountComponent
    },

    setup(){
    const selectedAccount = ref([])
    const mosaics = ref([])
    const accounts = computed(
      () => {
        if(!walletState.currentLoggedInWallet){
          return null;
        }
        else if(walletState.currentLoggedInWallet){
          if(walletState.currentLoggedInWallet.others){
          const accounts = walletState.currentLoggedInWallet.accounts.map((acc)=>{
            return {
              name: acc.name,
              publicKey: acc.publicKey,
              address: acc.address
            }
          })
          const otherAccounts = walletState.currentLoggedInWallet.others.map((acc)=>{
            return {
              name: acc.name,
              publicKey: acc.publicKey,
              address: acc.address,
              type: acc.type
            }
          })
          const concatOther = accounts.concat(otherAccounts)
          return concatOther.filter(item => {
            return item.type !== "DELEGATE";
          })
          }
          else{
            const accounts =  walletState.currentLoggedInWallet.accounts;
            return accounts
          }
        }
      }
    );
    const onCheck = (val) =>{
      selectedAccount.value = val
      loadWalletAsset()
    }
    const loadWalletAsset = async() =>{
      if(!AppState.isReady){
        setTimeout(loadWalletAsset, 1000);
        return; 
      }
      var walletAsset = [];
      for(let j=0 ; j<selectedAccount.value.length; j++){
        let account = await accountUtils.getAccountFromAddress(selectedAccount.value[j].address)
            walletAsset.push({
                publicKey: selectedAccount.value[j].publicKey,
                mosaics: account.mosaics
            });
        }
      mosaics.value = walletAsset
    }
    loadWalletAsset()
      return {
        mosaics,
        onCheck,
        accounts,
        selectedAccount,
      }
    }
}

</script>