<template>
    <div class="lg:ml-60 mt-10 lg:mt-16 flex-grow px-5 pt-5">
      <div class="w-11/12 ml-auto mr-auto">
        <div class="flex">
          <div class='py-3 px-6 lg:flex items-center'>
            <div class="text-xl mr-2 mb-2">NFT</div>
            <MultiDropdownPortfolioAccountComponent :account="accounts" @checked='onCheck'/>
          </div>        
        </div>
      </div>
        <div class='mt-2 py-3 '>
          <div class="w-11/12 ml-auto mr-auto border-2">
            <DisplayNFTComponent :publicKeys="WalletPublicKeys" />
            <div>{{publicKey}}</div>
          </div>
        </div>
      <div class="mb-36"/>
    </div>
  </template>

<script>
import DisplayNFTComponent from '@/modules/services/submodule/nft/components/DisplayNFTComponent.vue';
import { walletState } from '@/state/walletState';
import { computed, ref } from "vue";
import MultiDropdownPortfolioAccountComponent from '@/modules/services/submodule/portfolio/components/MultiDropdownPortfolioAccountComponent.vue'

export default{
    name: "ViewServicesPortfolio",
    components:{
      MultiDropdownPortfolioAccountComponent,
      DisplayNFTComponent
    },

    setup(){
    const selectedAccount = ref([])
    const accounts = computed(
      () => {
        if(walletState.currentLoggedInWallet){
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
          }else{
            const accounts =  walletState.currentLoggedInWallet.accounts.map((acc)=>{
                return {
                name: acc.name,
                publicKey: acc.publicKey,
                address: acc.address
                }
            });
            return accounts
          }
        }else{
            return null
        }
      }
    );
    const onCheck = (val) =>{
      selectedAccount.value = val
    }
    const WalletPublicKeys = computed(() =>{
      if(selectedAccount.value){
        var walletPublicKey = [];
        for(let j=0 ; j<selectedAccount.value.length; j++){
            walletPublicKey.push({
                publicKey: selectedAccount.value[j].publicKey
            });
          }
        return walletPublicKey
      }else{
        return null
      }
    })
    
      return {
        WalletPublicKeys,
        onCheck,
        accounts,
        selectedAccount
      }
    }
}

</script>