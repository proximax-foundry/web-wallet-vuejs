<template>
  <div class="lg:ml-60 mt-10 lg:mt-16 flex-grow px-5 pt-5">
    <div class="w-11/12 ml-auto mr-auto">
      <div class="flex">
        <div class='py-3 px-6 lg:flex items-center'>
          <div class="text-xl mr-2 mb-2">Portfolio</div>
          <div>
            <MultiSelect
            v-model="selectedAccount"
            :options=accounts
            optionLabel="name"
            placeholder="Select Accounts"
            :filter="true"
            class="multiselect-custom"
            @change="loadWalletAsset()"
            >
              <template #value="slotProps">
                <div class="account-item account-item-value" v-for="option of slotProps.value" :key="option.code">
                  <div>{{option.name}}</div>
                </div>
                <template v-if="!slotProps.value || slotProps.value.length === 0">
                  Select Accounts
                </template>
              </template>
              <template #option="slotProps">
                <div class="account-item">
                  <div>{{slotProps.option.name}}</div>
                </div>
              </template>
            </MultiSelect>
          </div>
        </div>        
      </div>
    </div>
      <div class='mt-2 py-3 '>
        <div class="w-11/12 ml-auto mr-auto border-2">
          <PortfolioAssetDataTable :assets="mosaics" />
        </div>
      </div>
    <div class="mb-36"/>
  </div>
</template>

<script>
import PortfolioAssetDataTable from '@/modules/services/submodule/portfolio/components/PortfolioAssetDataTable.vue';
import { walletState } from '@/state/walletState';
import { computed, ref } from "vue";
import { accountUtils } from "@/util/accountUtils";
import { AppState } from '@/state/appState';
import MultiSelect from 'primevue/multiselect';

export default{
    name: "ViewServicesPortfolio",
    components:{
      PortfolioAssetDataTable,
      MultiSelect
    },

    setup(){
    const selectedAccount = ref([])
    const mosaics = ref([])
    const accounts = computed(
      () => {
        if(!walletState.currentLoggedInWallet){
          return null;
        }
        else{
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
            const accounts =  walletState.currentLoggedInWallet.accounts.map((acc)=>{
              return {
                name: acc.name,
                publicKey: acc.publicKey,
                address: acc.address
              }
            })
            return accounts
          }
        }
      }
    );
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
        let mosaics_list = [];
        let AssetList = [];
        let newAssetList = [];
        let assetLength = 0;
        let totalAssetList = [];
        if(!walletAsset.length){
          mosaics.value = [];
        }else{
          for(let j=0; j<walletAsset.length; j++){
            mosaics_list = walletAsset[j].mosaics
            assetLength += walletAsset[j],mosaics.length
            AssetList[j] = await accountUtils.formatAccountAsset(mosaics_list, walletAsset[j].publicKey)
            newAssetList = newAssetList.concat(AssetList[j])
          }
          totalAssetList = newAssetList.reduce((obj, item) => {  
          let find = obj.find(i => i.id === item.id);  
          let _d = {  
          ...item
          }
          find ? (find.balance += item.balance ) : obj.push(_d);
          return obj;
          }, [])
          mosaics.value = totalAssetList
        }
        console.log(typeof walletAsset)
        console.log(walletAsset.length)
        console.log(mosaics)
    }
    loadWalletAsset()
      return {
        mosaics,
        accounts,
        selectedAccount,
        loadWalletAsset
      }
    }
}

</script>
<style lang="scss" scoped>
.p-multiselect {
    width: 18rem;
}

::v-deep(.multiselect-custom) {
    .p-multiselect-label:not(.p-placeholder) {
        padding-top: .25rem;
        padding-bottom: .25rem;
    }

    .account-item-value {
        padding: .25rem .5rem;
        border-radius: 3px;
        display: inline-flex;
        margin-right: .5rem;
        background-color: var(--primary-color);
        color: var(--primary-color-text);
    }
}
</style>