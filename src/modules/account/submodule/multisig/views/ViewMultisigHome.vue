<template>
  <div>
  
  <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
    <AccountComponent :address="address" class="mb-10"/>
    <AccountTabs :address="address" selected="multisig"/>
    <div class=' p-6 border-2 border-t-0 filter shadow-lg'>
      <div v-if="isMultisig" class="flex cursor-pointer">
        <div class="border-2 border-blue-primary p-1 mb-3 w-16 text-white bg-blue-primary text-xs text-center font-semibold ">{{$t('general.multisig')}}</div>
        <router-link :to="{name:'ViewMultisigScheme', params: { address: address}}" class="border-2 border-blue-primary p-1 mb-3 w-16 text-blue-primary text-xs text-center font-semibold ">{{$t('general.scheme')}}</router-link>
      </div>
      <div class='text-xs font-semibold'>{{$t('multisig.accountCosignatories')}}</div>
      <div class='border p-4 my-3 '>
       <div class="flex flex-col gap-2">
        <div v-for="(cosigner,index) in cosignerAccountsList" :key="index">
            <div class="border w-full cursor-pointer rounded-md p-3" @click="navigate(cosigner.address)">
              <div class="text-txs font-semibold text-blue-primary">{{cosigner.name}}</div>
              <div class="flex">
                <div :id="`cosignerAddress${index}`" :copyValue="cosigner.address" :copySubject="$t('general.address')" :title="cosigner.address" class="truncate md:text-clip w-44 md:w-full text-txs font-bold mt-1">{{cosigner.address}}</div>
                <font-awesome-icon icon="copy" @mouseover="isHover = true" @mouseout="isHover = false" :title="$t('general.copy')" @click="copy(`cosignerAddress${index}`)" class="ml-2 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
                <img v-if="findAccountWithAddress(cosigner.address)" class="w-5 h-5 ml-auto" src="@/assets/img/chevron_right.svg" >
              </div>
            </div>
        </div>
       </div>
        <div v-if="!isMultisig" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
        <div class='flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 text-center justify-center '>
          <span v-if="!isMultisig"> {{$t('multisig.noCosigner',{name:acc?acc.name:''})}}</span>
        </div>
      </div>
      <router-link :to="{ name: isMultisig ? 'ViewMultisigEditAccount' : 'ViewMultisigConvertAccount', params: { address: address}}" class="blue-btn py-2 px-2 ">{{$t('multisig.manageCosignatories')}}</router-link>
      <div class="gray-line my-8"></div>
      <div class='text-xs font-semibold'>{{$t('multisig.cosignatoryOf')}}</div>
      <div class='border p-4 mt-3'>
        <div class="flex flex-col gap-2">
          <div v-for="(multisig,index) in multisigAccountsList" :key="index">
            <div class="border w-full cursor-pointer rounded-md p-3" @click="navigate(multisig.address)">
              <div class="text-txs font-semibold text-blue-primary">{{multisig.name}}</div>
              <div class="flex">
                <div :id="`multisigAddress${index}`" :copyValue="multisig.address" :title="multisig.address" :copySubject="$t('general.address')" class="truncate md:text-clip w-44 md:w-full text-txs font-bold mt-1">{{multisig.address}}</div>
                <font-awesome-icon icon="copy" @mouseover="isHover = true" @mouseout="isHover = false" :title="$t('general.copy')" @click="copy(`multisigAddress${index}`)" class="ml-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
                  <img v-if="findAccountWithAddress(multisig.address)" class="w-5 h-5 ml-auto" src="@/assets/img/chevron_right.svg">
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isCosigner" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
        <div v-if="!isCosigner" class='flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 justify-center text-center'>
          <span v-if="!isCosigner"> {{$t('multisig.noMultisig',{name:acc?acc.name:''})}}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { walletState } from '@/state/walletState';
import {  ref, computed } from "vue";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { multiSign } from '@/util/multiSignatory';
import {Address, PublicAccount} from  "tsjs-xpx-chain-sdk"
import { networkState } from '@/state/networkState';
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { AppState } from '@/state/appState';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
export default {
    name: "ViewMultisigHome",
    props: {
        address: String
    },
    components:{
      AccountComponent,
      AccountTabs
    },
    setup(p){
      const {t} = useI18n()
      const toast = useToast();
      const acc = computed(()=>{
        if(!walletState.currentLoggedInWallet){
          return null
        }
        let acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == p.address) || walletState.currentLoggedInWallet.others.find((add) => add.address == p.address);
        if(!acc){
          return null
        }
        return acc
      })
      const getPlainAddress = address => {
        return Address.createFromRawAddress(address).plain()
      }
      const findAccountWithAddress = address =>{
        let plainAddress = getPlainAddress(address)
          const findAcc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==plainAddress) | walletState.currentLoggedInWallet.others.find(acc=>acc.address==plainAddress) 
          if(findAcc==undefined){
            return false
          }
          return true
      }
      const isMultisig = ref(false) 
      const isCosigner = ref(false)
      const networkType = AppState.networkType
      const convertAddress = publicKey =>{ 
        return Address.createFromPublicKey(publicKey, networkType)
      }
      const findAccount = publicKey =>{
        return walletState.currentLoggedInWallet.accounts.find(account=>account.address == convertAddress(publicKey).plain())?walletState.currentLoggedInWallet.accounts.find(account=>account.address == convertAddress(publicKey).plain()): walletState.currentLoggedInWallet.others.find(account=>account.address == convertAddress(publicKey).plain())
      }
      const getAccountName = (publicKey) =>{
        const address = PublicAccount.createFromPublicKey(publicKey,networkType).address.plain()
        const contact = walletState.currentLoggedInWallet.contacts.find((contact) => contact.address==address);
        if (contact){
          return contact.name
        }else{
          return findAccount(publicKey) ? findAccount(publicKey).name : `Cosigner-${convertAddress(publicKey).plain().substr(-4)}`
        }
      }
      let multisigAccountsList = computed(()=>{
        if(!acc.value){
          return []
        }
        let multisigAccountsList= []
        let multisigAccounts =  acc.value.multisigInfo.filter(info=>info.level== -1)
        multisigAccounts.forEach(account=>multisigAccountsList.push({name: getAccountName(account.publicKey),address:  PublicAccount.createFromPublicKey(account.publicKey,networkType).address.pretty()}))
        return multisigAccountsList
      },{deep:true})
      let cosignerAccountsList = computed(()=>{
        if(!acc.value){
          return []
        }
        let cosignerAccountsList= []
        let cosignerAccounts =  acc.value.multisigInfo.filter(info=>info.level== 1)
        cosignerAccounts.forEach(account=>cosignerAccountsList.push({name: getAccountName(account.publicKey),address:  PublicAccount.createFromPublicKey(account.publicKey,networkType).address.pretty()}))
        return cosignerAccountsList
      },{deep:true})
      
      //check if account is a cosigner
      let verifyHasMultisig = multiSign.checkHasMultiSig(acc.value?acc.value.address:'')
      isCosigner.value = verifyHasMultisig;
      //check if account is a multisig
      let verifyMultisig = multiSign.checkIsMultiSig(acc.value?acc.value.address:'')
      isMultisig.value = verifyMultisig;
    
      const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject +' '+ t('general.copied'), group: 'br', life: 3000});
    };
    const isHover = ref(false)
    const router = useRouter()
    const navigate = (address) =>{
      if(findAccountWithAddress(address) && !isHover.value){
        router.push({ name: 'ViewAccountDetails', params: { address:getPlainAddress(address) }})
      }
    }
      return{
        findAccountWithAddress,
        isHover,
        navigate,
        copy,
        isMultisig,
        acc,
        isCosigner,
        multisigAccountsList,
        cosignerAccountsList
      }
    }
}
</script>

<style>
</style>