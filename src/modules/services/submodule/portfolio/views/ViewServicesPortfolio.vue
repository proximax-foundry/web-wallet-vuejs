<template>
  <div class="lg:ml-60 mt-10 lg:mt-16 flex-grow px-5 pt-5">
    <div class="w-11/12 ml-auto mr-auto">
      <div class='border-2 py-3 px-6'>
          <div>Overview</div>
      </div>
    </div>
      <div class='mt-2 py-3 '>
        <div class="w-11/12 ml-auto mr-auto flex flex-col gap-3">
          <AccountPortfolioComponent :key="index" :account="item" v-for="(item, index) in accounts" />
        </div>
      </div>
    <div class="mb-36"/>
  </div>
</template>

<script>
import AccountPortfolioComponent from '@/modules/services/submodule/portfolio/components/AccountPortfolioComponent.vue';
import { walletState } from '@/state/walletState';
import { computed } from "vue";

export default{
    name: "ViewServicesPortfolio",
    components:{
        AccountPortfolioComponent
    },

    setup(){
      const totalAcc = computed(()=>{

      if(!walletState.currentLoggedInWallet){
        return [];
      }
      let accounts = walletState.currentLoggedInWallet.accounts.map(
        (acc)=>{ 
          return { 
            name: acc.name,
            balance: acc.balance,
            address: acc.address,
            publicKey: acc.publicKey,
            isMultisig: acc.getDirectParentMultisig().length ? true: false,
            multisigInfo: acc.multisigInfo,
          }; 
        });
        
      
      let otherAccounts =walletState.currentLoggedInWallet.others.filter((acc)=> acc.type === "MULTISIG").map(
        (acc)=>{ 
          return { 
            name: acc.name,
            balance: acc.balance,
            address: acc.address,
            publicKey: acc.publicKey,
            isMultisig: true,
            multisigInfo: acc.multisigInfo,
          }; 
        });

        return accounts.concat(otherAccounts);

      });
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

      return {
        accounts
      }
    }

}

</script>