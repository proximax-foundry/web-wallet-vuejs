<template>
<div class="flex items-center">
    <div v-if="!first" class="hline flex-shrink-0"></div>
    <div :class="` ${first?'border-l-4 single ': ''}mb-2 flex-shrink-0 h-20 border-2 rounded-sm bg-white w-64 `"  :style ="`${first?'border-left-color:#007cff':''}`">
        <div class="p-1.5">
            <div class="text-xs text-blue-500 font-bold">{{ name}}</div>
            <div class="flex gap-1">
                <div :id="address" :copyValue="prettyAddress(address)" copySubject="Address" class="font-bold text-xs mt-0.5">{{displayAddress(address)}}</div>
                <font-awesome-icon icon="copy" title='Copy' @click="copy(address)" class="w-5 h-5 text-blue-primary cursor-pointer "></font-awesome-icon>
            </div>
            <div v-if="balance!=-1" class="flex">
                <div class = 'text-xs font-bold '>{{splitBalance(balance).left}} </div>
                <div class = 'text-xs font-bold' v-if='splitBalance(balance).right!=null'>.</div>
                <div class='text-xxs mt-0.5 '>{{splitBalance(balance).right}}</div>
                <div class = 'ml-1 text-xs  font-bold'>{{currentNativeTokenName}}</div>
                <img src="@/modules/account/img/proximax-logo.svg" class='h-4 w-4 '>
            </div>
            <div class="flex gap-3">
                <div  v-if='cosign.length>0' class="text-xxs text-gray-500">S:{{numApproveTx}}-of-{{cosign.length}}</div>
                <div v-if='cosign.length>0' class="text-xxs text-gray-500">D:{{numRemoval}}-of-{{cosign.length}}</div>
                <div class="flex gap-1 ml-auto">
                    <div v-if='cosign.length>0' class = ' ml-auto bg-green-500 rounded-2xl' title='This is a multisig account'>
                    <img src="@/assets/img/icon-multisig.svg" class = 'h-4 w-5 mr-1' style= "transform: rotateY(180deg)" >
                    </div>
                    <div v-if='cosign.length>0 && findAccountWithAddress(address)!=undefined' class = 'p-0.5 bg-purple-500 rounded-2xl' title='You own this multisig account' >
                    <img src="@/assets/img/icon-key.svg" class = 'h-3 w-3 mr-1' >
                    </div>
                </div>
            </div>
        </div> 
    </div>
    <div v-if="cosign.length>0" class="hline"></div>
</div>
</template>

<script>
import { computed } from "vue";
import { Helper } from '@/util/typeHelper';
import { networkState } from '@/state/networkState';
import { Address } from 'tsjs-xpx-chain-sdk';
import { walletState } from '@/state/walletState';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
export default {
    name:"AccountSchemeTile",
    props:{
        first: Boolean,
        name: String,
        address: String,
        balance: Number,
        numApproveTx: Number,
        numRemoval: Number,
        cosign: Array
    },
    setup(){
        const toast = useToast();
        const wallet = walletState.currentLoggedInWallet 
        let displayAddress = address=>{
            let part1 = address.slice(0,13)
            let part2 = address.slice(35,46)
            return part1+"..."+part2
        }
        const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
        const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);
        const splitBalance = balance =>{    
            let formattedBalance =  Helper.toCurrencyFormat(balance, currentNativeTokenDivisibility.value);
            let split = formattedBalance.split(".")
            if (split[1]!=undefined){
            return {left:split[0],right:split[1]}
            }else{
            return {left:split[0], right:null} 
            }
        } 
        const findAccountWithAddress = address =>{
            let plainAddress = Address.createFromRawAddress(address).plain()
            return wallet.accounts.find(account=>account.address == plainAddress)
        }
        const copy = (id) =>{
            let stringToCopy = document.getElementById(id).getAttribute("copyValue");
            let copySubject = document.getElementById(id).getAttribute("copySubject");
            copyToClipboard(stringToCopy);

            toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
        };
        const prettyAddress = address => Address.createFromRawAddress(address).pretty()
    return{
        copy,
        findAccountWithAddress,
        displayAddress,
        currentNativeTokenName,
        currentNativeTokenDivisibility,
        splitBalance,
        prettyAddress
    }
    }
}
</script>

<style scoped>
.hline { 
    width:20px; 
    height:2px; 
    background: rgb(209 213 219)
}
</style>