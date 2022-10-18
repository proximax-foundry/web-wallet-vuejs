<template>
    <div class="border rounded-lg border-gray-200 p-3 filter shadow-lg">
        <div class="flex flex-col">
            <div class="text-blue-primary font-bold text-xs mb-0.5">{{accountName}}</div>
            <PortfolioAssetDataTable :assets="account.assets" />
        </div>
    </div>
</template>

<script>
import { walletState } from '@/state/walletState';
import { computed } from "vue";
import PortfolioAssetDataTable from '@/modules/services/submodule/portfolio/components/PortfolioAssetDataTable.vue';

export default{
    name: 'AccountPortfolioComponent',
    components:{
    PortfolioAssetDataTable
},
    props:{
        account: String,
    },
    setup(p){
        const accountName = computed(() => {
        // check if address is in adress book
        const contact = walletState.currentLoggedInWallet.contacts.find((contact) => contact.address == p.account.address);
        if(contact){
            return contact.name;
        }else{
            return p.account.name;
        }
        })

        return{
            accountName,
        }
    }
}
</script>