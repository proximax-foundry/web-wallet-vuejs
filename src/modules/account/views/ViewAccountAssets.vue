<template>
  <div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="address" class="mb-6"/>
      <AccountTabs :address="address" selected="assets"/>
    <div class='border-2 border-t-0  px-6'>
        <AssetDataTable :assets="mosaics" :address="address" />
        <div class="flex my-3 px-6 flex-col w-full ml-auto mr-auto gap-2 sm:flex-row sm:items-center">
             <router-link :to="{ name: 'ViewTransferCreate'}" class=" bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center "><img src="@/assets/img/icon-transfer-white.svg" class="  inline-block w-4 h-4 mt-0.5  cursor-pointer mr-1">{{$t('general.transfer')}}</router-link>
            <router-link :to="{ name: 'ViewServicesMainnetSwap'}" class="bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center  "><img src="@/assets/img/navi/icon-swap.svg" class="w-4 h-4 inline-block relative mr-1">{{$t('general.swap')}}</router-link>
            <router-link :to="{ name : 'ViewServicesAssetsCreate'}" class="bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center" ><img src="@/assets/img/icon-plus.svg" class="inline-block w-4 h-4 mr-2">{{$t('asset.createNewAsset')}}</router-link>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import { computed,} from "vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { walletState } from '@/state/walletState';
import { Helper } from '@/util/typeHelper';
import { AppState } from '@/state/appState';
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import AssetDataTable from "@/modules/account/components/AssetDataTable.vue";
export default {
    name:'ViewAccountAssets',
    components:{
        AccountComponent,
        AccountTabs,
        AssetDataTable
    },
    props:{
        address: String,
    },
    setup(p){
        const wallet = walletState.currentLoggedInWallet 
        const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
        const acc= computed(()=>{
            if(!wallet){
                return null
            }
            let currentAccount=wallet.accounts.find(account=> account.address == p.address)
            if (currentAccount!=undefined){
            return currentAccount
            }else{
            return wallet.others.filter(accounts=>accounts.type === "MULTISIG").find(account=>account.address == p.address)
            }
        })
        const isMultiSig = computed(() => {
            if(!acc.value){
                return false
            }
            let isMulti = acc.value.getDirectParentMultisig().length? true: false
            return isMulti;
        });  
        let isDelegate = ()=>{
            if(!walletState.currentLoggedInWallet){
                return false
            }
            let account = walletState.currentLoggedInWallet.others.find(acc=>acc.address==p.address)
            if(account){
                return account.type=="DELEGATE"?true:false
            }else{
                return false
            }
        }
        const mosaics = computed(() => {
            
            var mosaicOption = [];
            if(!walletState.currentLoggedInWallet){
                return mosaicOption;
            }
            const account = walletState.currentLoggedInWallet.accounts.find(
                (element) => element.address == p.address
            ) ||  walletState.currentLoggedInWallet.others.find(
                (element) => element.address == p.address)
            if(!account){
                return mosaicOption
            }
            account.assets.forEach((i,index) => {
            mosaicOption.push({
                i:index,
                id: i.idHex,
                name: (i.namespaceNames.length>0?i.namespaceNames[0]:'-'),
                balance: Helper.toCurrencyFormat(i.amount,i.divisibility),
                isCreator: acc.value? (i.creator == acc.value.publicKey? true:false):false
            });
            });
            
            return mosaicOption
            
        });

       
        const splitBalance = balance=>{
            let split = balance.split(".")
            if (split[1]!=undefined){
                return {left:split[0],right:split[1]}
            }else{
                return {left:split[0], right:null}
            }
        }
       
       
        return{
            acc,
            isDelegate,
            isMultiSig,
            mosaics,
            splitBalance,
            currentNativeTokenName,
        }
    }
}
</script>

<style scoped>
.p-paginator .p-paginator-current {
        margin-left: auto;
    }

    .p-progressbar {
        height: .5rem;
        background-color: #D8DADC;
    }
    .p-progressbar .p-progressbar-value {
        background-color: #607D8B;
    }

    .p-datepicker {
        min-width: 25rem;
    }

    .p-datepicker td {
        font-weight: 400;
    }

    .p-datatable.p-datatable-customers .p-datatable-header {
        padding: 1rem;
        text-align: left;
        font-size: 1.5rem;
    }

    .p-datatable.p-datatable-customers .p-paginator {
        padding: 1rem;
    }

    .p-datatable.p-datatable-customers .p-datatable-thead > tr > th {
        text-align: left;
    }

    .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td {
        cursor: auto;
    }

    .p-datatable.p-datatable-customers .p-dropdown-label:not(.p-placeholder) {
        text-transform: uppercase;
    }

</style>