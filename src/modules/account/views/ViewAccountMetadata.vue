<template>
<div>
    <div class='flex cursor-pointer'>
        <img src='@/assets/img/chevron_left.svg'>
        <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>{{$t('general.back')}}</router-link>
    </div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <AccountComponent :address="account.address" class="mb-10"/>
        <div class = 'flex text-xs font-semibold border-b-2 menu_title_div'>
        <router-link :to="{name: 'ViewAccountDetails',params:{address:account.address}}" class= 'w-32 text-center '>{{$t('account.accountDetails')}}</router-link>
        <router-link :to="{name:'ViewAccountAssets', params: { address: account.address}}" class= 'w-18 text-center'>{{$t('general.asset',2)}}</router-link>
        <router-link :to="{name:'ViewMultisigHome', params: { name: account.name}}" class= 'w-18 text-center'>{{$t('general.multisig')}}</router-link>
        <router-link v-if="isMultisig" :to="{name:'ViewMultisigScheme', params: { address: account.address}}" class= 'w-18 text-center'>{{$t('general.scheme')}}</router-link>
        <router-link :to="{name:'ViewAccountSwap', params: { address: account.address}}" class= 'w-18 text-center'>{{$t('general.swap')}}</router-link>
        <MoreAccountOptions :address="account.address" :selected="true"/>
        </div>
        <div class="border-2 border-t-0 filter shadow-lg lg:grid lg:grid-cols-3" >
            <div class="lg:col-span-2 py-6 px-6">
                <div class='pl-6'>
                    <div class=" error error_box mb-5" v-if="err!=''">{{ err }}</div>
                </div>
                <div v-if="isMultisig" class="text-left mt-2 mb-5 "> 
                    <div v-if="cosigners.length > 0">
                        <div class="text-tsm">
                            {{$t('general.initiateBy')}}:
                            <span class="font-bold" v-if="cosigners.length == 1"> 
                            {{ cosigners[0].name }} 
                            </span>
                            <span class="font-bold" v-else>
                            <select class="" v-model="selectedCosigner">
                                <option v-for="(cosigner, item) in  cosigners" :value="findAcc(cosigner.publicKey).publicKey" :key="item">
                                {{ cosigner.name }} 
                                </option>
                            </select>
                            </span>
                        </div>
                    </div>
                    <div class="error" v-else>
                    {{$t('general.noCosigner')}} 
                    </div>
                </div>
                <div class="font-semibold mb-4">Add Account Metadata</div>
                <div class="border border-blue-300 rounded-md p-3 mt-3 bg-blue-50">
                    <div class="flex items-center gap-2">
                        <div v-html="svgString"  />
                        <div class="flex flex-col gap-0.5">
                            <div class="uppercase text-xxs text-blue-primary">Selected Account</div>
                            <div class="font-semibold">{{account.name}}</div>
                        </div>
                    </div>
                </div>
                <MetadataInput class="mt-5" v-model="scopedMetadataKey" placeholder="Scoped Metadata Key" v-debounce:1000="checkOldValue" />
                <MetadataInput class="mt-2" v-model="oldValue" :disabled="true" placeholder="Old Value"/>
                <MetadataInput class="mt-2" v-model="newValue"  placeholder="New Value"/>
            </div>
            <div class='bg-navy-primary p-6 lg:col-span-1'>
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
                <button type="submit" class="w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto" @click="accountMetadataTx()" :disabled="disableAddBtn">
                    Add Metadata
                </button>
                <div class="text-center">
                    <router-link :to="{name: 'ViewAccountDetails',params:{name:address}}" class="content-center text-xs text-white underline" >{{$t('general.cancel')}}</router-link>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { ThemeStyleConfig } from '@/models/stores';
import { toSvg } from "jdenticon";
import { walletState } from '@/state/walletState';
import { Helper } from '@/util/typeHelper';
import MetadataInput from '@/components/MetadataInput.vue';
import { multiSign } from '@/util/multiSignatory';
import { AppState } from '@/state/appState';
import { networkState } from '@/state/networkState';
import { TransactionUtils } from '@/util/transactionUtils';
import { WalletUtils } from '@/util/walletUtils';
import { useI18n } from 'vue-i18n';
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import MoreAccountOptions from "@/modules/account/components/MoreAccountOptions.vue";
import PasswordInput from '@/components/PasswordInput.vue';
import { ref, computed,watch } from "vue";
import { accountUtils } from '@/util/accountUtils';
export default {
    name: 'ViewAccountMetadata',
    components: {
        AccountComponent,
        MoreAccountOptions,
        PasswordInput,
        MetadataInput
    },
    props: {
        address: String,
    },
    setup(p) {
        const {t} = useI18n()
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
        const accountPublicKey = computed(()=>{
            if(account.value){
                return account.value.publicKey
            }else{
                return ''
            }
        })
        const updateAggregateFee = ()=>{
            aggregateFee.value = accountUtils.calculateMetadataAggregateFee(oldValue.value,newValue.value)
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
        const selectedCosigner = ref('')
        if(cosigners.value.length>0){
            selectedCosigner.value = cosigners.value[0].publicKey
        }
        
        const balance = computed(()=>{
            if(isMultisig.value){
                if(selectedCosigner.value){
                    return findAcc(selectedCosigner.value).balance
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

        const findAcc = (publicKey)=>{
            return allAvailableAccounts.value.find(acc=>acc.publicKey==publicKey)
        }
        const walletPassword = ref('')
        const checkOldValue = ()=>{
            try{
                accountUtils.checkMetadataOldValue(accountPublicKey.value,scopedMetadataKey.value).then(returnedValue=>{
                oldValue.value = returnedValue
            })
            }catch{
                oldValue.value = ''
            }
            
        }
        const err = ref('')
        const accountMetadataTx = ()=>{
            if(WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPassword.value)){
                if(isMultisig.value){
                    accountUtils.accountMetadataTx(accountPublicKey.value,scopedMetadataKey.value,newValue.value,oldValue.value,walletPassword.value,findAcc(selectedCosigner.value).publicKey)
                }else{
                    accountUtils.accountMetadataTx(accountPublicKey.value,scopedMetadataKey.value,newValue.value,oldValue.value,walletPassword.value)
                }
                scopedMetadataKey.value=""
                oldValue.value = ""
                newValue.value=""
                walletPassword.value=""
                
            }else{
                err.value = t('general.walletPasswordInvalid',{name:walletState.currentLoggedInWallet.name})
            }
        }
        watch(oldValue,n=>{
            updateAggregateFee()
        })
        watch(newValue,n=>{
            updateAggregateFee()
        })
        watch(scopedMetadataKey,n=>{
            if(n==""){
                oldValue.value = ""
            }
        })
        return{
            svgString,
            accountName,
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
            accountMetadataTx,
            disableAddBtn,
            err,
            selectedCosigner,
            findAcc,
            account
        }
    },
}
</script>
