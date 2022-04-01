<template>
  <div>
    <div class='flex cursor-pointer'>
        <img src='@/assets/img/chevron_left.svg'>
        <router-link :to="{name: 'ViewServicesNamespace'}" class='text-blue-primary text-xs mt-0.5'>{{$t('general.back')}}</router-link>
    </div>
    <div class='w-10/12 ml-auto mr-auto'>
        <div class="border filter shadow-lg xl:grid xl:grid-cols-3 mt-8" >
            <div class="xl:col-span-2 p-12">
                <div class="font-semibold mb-4">Add Namespace Metadata</div>
                <div v-if="showBalanceErr" class="rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
                    <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2">
                        <font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute" style="top: 3px; left:4px"></font-awesome-icon>
                    </div>
                    <div class="inline-block text-xs">{{$t('general.insufficientBalance')}}</div>
                </div>
                <div class="flex items-center">
                    <div v-html="svgString" class="inline-block" />
                    <div class="ml-2">
                    <div class="text-blue-primary text-xxs font-bold uppercase mb-1">{{$t('namespace.namespaceCreatedBy')}}</div>
                    <div class="font-bold text-black text-sm">{{ accountName}}</div>
                    </div>
                </div>
                 <div v-if="isMultisig" class="text-left mt-2 mb-5 ml-4"> 
                    <div v-if="cosigners.length > 0">
                    <div class="text-tsm">
                        {{$t('general.initiateBy')}}:
                        <span class="font-bold" v-if="cosigners.length == 1"> 
                        {{ cosigners[0].name }} 
                        </span>
                        <span class="font-bold" v-else>
                        <select class="" v-model="selectedCosigner">
                            <option v-for="(cosigner, item) in  cosigners" :value="cosigner.publicKey" :key="item">
                            {{ cosigner.name }} 
                            </option>
                        </select>
                        </span>
                    </div>
                    </div>
                    <div class="error" v-else>
                    {{$t('general.initiateBy')}} 
                    </div>
                </div>
                <div class="border border-blue-primary p-4 bg-blue-100 flex items-center rounded mt-5">
                    <img src="@/modules/services/submodule/namespaces/img/icon-namespace.svg">
                    <div class="ml-1">
                        <div class="uppercase text-blue-primary font-semibold text-xxs">NAMESPACE</div>
                        <div class="text-black text-sm font-bold">{{ namespaceName }}</div>
                    </div>
                </div>
                <MetadataInput class="mt-5" v-model="scopedMetadataKey" placeholder="Scoped Metadata Key" v-debounce:1000="checkOldValue"/>
                <MetadataInput class="mt-2" v-model="oldValue" :disabled="true" placeholder="Old Value"/>
                <MetadataInput class="mt-2" v-model="newValue"  placeholder="New Value"/>
            </div>
            <div class="bg-navy-primary py-6 px-12 xl:col-span-1">
                <div v-if="!isMultisig" class='font-semibold text-xxs text-blue-primary uppercase'>{{$t('general.accCurrentBalance')}}</div>
                <div v-else class='font-semibold text-xxs text-blue-primary uppercase'>{{$t('general.initiatorCurrentBalance')}}</div>
                <div class="flex my-1 text-white">
                    <div class = 'text-md font-bold '>{{splitBalance.left}} </div>
                    <div class = 'text-md font-bold ' v-if='splitBalance.right!=null'>.</div>
                    <div class='text-xs mt-1.5 font-bold'>{{splitBalance.right}}</div>
                    <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
                    <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5 mt-0.5'>
                </div>
                <div class="flex  text-white">
                    <div class='text-xs '>{{$t('general.lockFund')}}</div>
                    <div class="text-xs  ml-auto">{{lockFund}}</div>
                    <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
                </div>
                <div class="flex  text-white">
                    <div class='text-xs '>{{$t('general.lockFundTxFee')}}</div>
                    <div class="text-xs  ml-auto">{{lockFundTxFee}}</div>
                    <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
                </div>
                <div class='border-b-2 border-gray-600 my-2'/>
                <div class="flex  text-white">
                    <div class='text-xs '>{{$t('general.aggregateFee')}}</div>
                    <div class="text-xs  ml-auto">{{aggregateFee}}</div>
                    <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
                </div>
                <div class='border-b-2 border-gray-600 my-2'/>
                <div class="flex  text-white">
                    <div class='text-xs '>{{$t('general.total')}}</div>
                    <div class="text-xs  ml-auto">{{totalFee}}</div>
                    <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
                </div>
                <div class='text-xs text-white my-5'>{{$t('general.enterPasswordContinue')}}</div>
                <PasswordInput  :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')"  v-model="walletPassword" icon="lock" class="mt-5 mb-3" />
                <button type="submit" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="namespaceMetadataTx()" :disabled="disableAddBtn">
                    Add Metadata
                </button>
                <div class="text-center">
                <router-link :to="{name: 'ViewServicesNamespace'}" class='content-center text-xs text-white border-b-2 border-white'>{{$t('general.cancel')}}</router-link>
                </div>
            </div>
        </div>

        <div class="sm:grid sm:grid-cols-2 mt-10 lg:mt-16">
        <div class="mb-8 sm:pr-1">
            <a href="https://bcdocs.xpxsirius.io/docs/built-in-features/namespace/" target=_new class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex">{{$t('general.namespaceQues')}}</a>
            <div class="text-gray-400 text-tsm my-3 sm:pr-2">{{$t('namespace.namespaceAns')}}</div>
        </div>
        <div class="mb-8">
            <a href="https://t.me/proximaxhelpdesk" target=_new class="sm:h-9 lg:h-5 text-blue-primary font-bold text-tsm items-start flex">{{$t('general.feedback')}}</a>
            <div class="text-gray-400 text-tsm my-3">{{$t('general.feedbackDescription')}}</div>
        </div>
        </div>
  </div>
  </div>
</template>

<script>
import { ThemeStyleConfig } from '@/models/stores';
import {ref, computed, watch} from 'vue'
import { toSvg } from "jdenticon";
import { walletState } from '@/state/walletState';
import { Helper } from '@/util/typeHelper';
import MetadataInput from '@/modules/services/submodule/namespaces/components/MetadataInput.vue';
import { multiSign } from '@/util/multiSignatory';
import { AppState } from '@/state/appState';
import { networkState } from '@/state/networkState';
import { TransactionUtils } from '@/util/transactionUtils';
import { NamespaceUtils } from '@/util/namespaceUtils';
import PasswordInput from "@/components/PasswordInput.vue";
import { WalletUtils } from '@/util/walletUtils';
export default {
    name: "ViewServicesNamespaceMetadata",
    components:{
        MetadataInput,
        PasswordInput
    },
    props:{
        address: String,
        namespaceId:String
    },
    setup(p){
        const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
        const lockFund = computed(() =>
            Helper.convertToExact(
                networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
                AppState.nativeToken.divisibility
            )
        );
        const lockFundTxFee = computed(()=>{
            return Helper.convertToExact(
                TransactionUtils.getLockFundFee(), 
                AppState.nativeToken.divisibility
            );
        });
        const aggregateFee = ref(0)
        const totalFee = computed(()=>{
            let tokenDivisibility = AppState.nativeToken.divisibility
            if(tokenDivisibility==0){
                return Math.trunc(lockFund.value+lockFundTxFee.value+aggregateFee.value)
            }else{
                return Math.round((lockFund.value+lockFundTxFee.value+aggregateFee.value)*Math.pow(10,tokenDivisibility))/Math.pow(10,tokenDivisibility)
            }
        })
        const scopedMetadataKey = ref('')
        const oldValue = ref('')
        const newValue = ref('')
        const themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
        themeConfig.init();
        const svgString = ref(toSvg(p.address, 40, themeConfig.jdenticonConfig));
        const plainAddress = Helper.createAddress(p.address).plain()
        const allAvailableAccounts = computed(()=>{
            if(walletState.currentLoggedInWallet){
                let acc = walletState.currentLoggedInWallet.accounts
                let otherAcc = walletState.currentLoggedInWallet.othersa
                let totalAcc = otherAcc? acc.concat(otherAcc):acc
                totalAcc.map(acc=>{
                   return{
                       name:acc.name,
                       balance:acc.balance,
                       publicKey:acc.publicKey
                   }
                })
                return totalAcc
            }else{
                return null
            }
        })
        const account = computed(()=>{
            if(walletState.currentLoggedInWallet){
                return walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==plainAddress) || walletState.currentLoggedInWallet.others.find(acc=>acc.address==plainAddress) 
            }else{
                return null
            }
        })
        const accountName = computed(()=>{
            if(account.value){
                return account.value.name
            }else{
                return ''
            }
        })
        const namespaceName = computed(()=>{
            if(account.value){
                return account.value.namespaces.find(namespace=>namespace.idHex==p.namespaceId).name
            }else{
                return ''
            }
        })
        const updateAggregateFee = ()=>{
            aggregateFee.value = NamespaceUtils.calculateMetadataAggregateFee(namespaceName.value,oldValue.value,newValue.value)
        }
        updateAggregateFee()
        const isMultisig = computed(()=>{
            if(account.value){
                return account.value.getDirectParentMultisig().length>0
            }else{
                return false
            }
        })
        
        const cosigners = computed(()=>{
            if(multiSign.getCosignerInWallet(account.value.publicKey).cosignerList.length){
                if(allAvailableAccounts.value){
                    return multiSign.getCosignerInWallet(account.value.publicKey).cosignerList.map(cosigner=>{
                        let foundCosigner = allAvailableAccounts.value.find(acc=>acc.publicKey==cosigner)
                        return{
                            name: foundCosigner.name,
                            publicKey:cosigner,
                            balance:foundCosigner.balance
                        }
                    })
                }else{
                    return []
                }
            
            }else{
                return []
            }
        })
        const selectedCosigner = ref(null)
        if(cosigners.value.length>0){
            selectedCosigner.value = cosigners.value[0]
        }
        
        const balance = computed(()=>{
            if(isMultisig.value){
                if(selectedCosigner.value){
                    return selectedCosigner.value.balance
                }else{
                    return 0
                }
            }else{
                if(account.value){
                    return account.value.balance
                }else{
                    return 0
                }
            }
        })
        const passwdPattern = "^[^ ]{8,}$";
        const disableAddBtn = computed(()=>{
            return (scopedMetadataKey.value==''||newValue.value==''||!walletPassword.value.match(passwdPattern)||showBalanceErr.value==true)
        })

        const splitBalance = computed(()=>{
            let accBalance = Helper.toCurrencyFormat(balance.value, AppState.nativeToken.divisibility)
            let split = accBalance.split(".")
            if (split[1]!=undefined){
                return {left:split[0],right:split[1]}
            }else{
                return {left:split[0], right:null}
            }
        })

        const showBalanceErr = computed(()=>{
            
                if(balance.value<totalFee.value){
                    return true
                }else{
                    return false
                }
            
        })
        const walletPassword = ref('')
        const checkOldValue = ()=>{
            try{
                NamespaceUtils.checkMetadataOldValue(namespaceName.value,scopedMetadataKey.value).then(returnedValue=>{
                oldValue.value = returnedValue
            })
            }catch{
                oldValue.value = ''
            }
            
        }

        const namespaceMetadataTx = ()=>{
            if(WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPassword.value)){
                if(isMultisig.value){
                    NamespaceUtils.namespaceMetadataTx(account.value.publicKey,namespaceName.value,scopedMetadataKey.value,newValue.value,oldValue.value,walletPassword.value,selectedCosigner.value.publicKey)
                }else{
                    NamespaceUtils.namespaceMetadataTx(account.value.publicKey,namespaceName.value,scopedMetadataKey.value,newValue.value,oldValue.value,walletPassword.value)
                }
                scopedMetadataKey.value=""
                oldValue.value = ""
                newValue.value=""
                walletPassword.value=""
                
            }
        }
        watch(oldValue,n=>{
            updateAggregateFee()
        })
        watch(newValue,n=>{
            updateAggregateFee()
        })
        return{
            svgString,
            accountName,
            namespaceName,
            scopedMetadataKey,
            oldValue,
            newValue,
            isMultisig,
            cosigners,
            currentNativeTokenName,
            lockFund,
            lockFundTxFee,
            splitBalance,
            aggregateFee,
            totalFee,
            walletPassword,
            showBalanceErr,
            checkOldValue,
            namespaceMetadataTx,
            disableAddBtn
        }
    }
}
</script>

<style>

</style>