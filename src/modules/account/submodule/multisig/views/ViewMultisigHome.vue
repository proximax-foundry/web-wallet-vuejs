<template>
  <div>
  <div class='flex cursor-pointer'>
    <img src='@/assets/img/chevron_left.svg'>
    <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>{{$t('general.back')}}</router-link>
  </div>
  <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
    <AccountComponent :address="acc.address" class="mb-10"/>
    <div class="flex text-xs font-semibold border-b-2 menu_title_div">
      <router-link :to="{name: 'ViewAccountDetails',params:{address:acc.address}}" class= 'w-32 text-center '>{{$t('account.accountDetails')}}</router-link>
      <router-link :to="{name:'ViewAccountAssets', params: { address: acc.address}}" class= 'w-18 text-center'>{{$t('general.asset',2)}}</router-link>
      <div class= 'w-18 text-center border-b-2 pb-3 border-yellow-500'>{{$t('general.multisig')}}</div>
      <router-link v-if="isMultisig" :to="{name:'ViewMultisigScheme', params: { address: acc.address}}" class= 'w-18 text-center'>{{$t('general.scheme')}}</router-link>
      <router-link :to="{name:'ViewAccountSwap', params: { address: acc.address}}" class= 'w-18 text-center'>{{$t('general.swap')}}</router-link>
      <MoreAccountOptions :address="acc.address"/>
    </div>
    
    <div class=' p-6 border-2 border-t-0 filter shadow-lg'>
      <div class='text-xs font-semibold'>{{$t('multisig.accountCosignatories')}}</div>
      <div class='border p-4 my-3 '>
       <div class="flex flex-col gap-2">
        <div v-for="(cosigner,index) in cosignerAccountsList" :key="index">
            <div class="border w-full rounded-md p-3">
              <div class="text-txs font-semibold text-blue-primary">{{cosigner.name}}</div>
              <div class="flex">
                <div :id="`cosignerAddress${index}`" :copyValue="cosigner.address" :copySubject="$t('general.address')" class="text-txs font-bold mt-1">{{cosigner.address}}</div>
                <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy(`cosignerAddress${index}`)" class="ml-2 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
               <!--  <img src="@/assets/img/chevron_right.svg" class="w-5 h-5 ml-auto"> -->
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isMultisig" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
        <div class='flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 text-center justify-center '>
          <span v-if="!isMultisig"> {{$t('multisig.noCosigner',{name:acc.name})}}</span>
        </div>
      </div>
      <router-link :to="{ name: isMultisig ? 'ViewMultisigEditAccount' : 'ViewMultisigConvertAccount', params: { name: acc.name}}" class="blue-btn py-2 px-2 ">{{$t('multisig.manageCosignatories')}}</router-link>
      <div class="gray-line my-8"></div>
      <div class='text-xs font-semibold'>{{$t('multisig.cosignatoryOf')}}</div>
      <div class='border p-4 mt-3'>
        <div class="flex flex-col gap-2">
          <div v-for="(multisig,index) in multisigAccountsList" :key="index">
            <div class="border w-full rounded-md p-3">
              <div class="text-txs font-semibold text-blue-primary">{{multisig.name}}</div>
              <div class="flex">
                <div :id="`multisigAddress${index}`" :copyValue="multisig.address" :copySubject="$t('general.address')" class="text-txs font-bold mt-1">{{multisig.address}}</div>
                <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy(`multisigAddress${index}`)" class="ml-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
                 <!-- <img src="@/assets/img/chevron_right.svg" class="w-5 h-5 ml-auto"> -->
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isCosigner" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
        <div v-if="!isCosigner" class='flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 justify-center text-center'>
          <span v-if="!isCosigner"> {{$t('multisig.noMultisig',{name:acc.name})}}</span>
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
import MoreAccountOptions from "@/modules/account/components/MoreAccountOptions.vue";
import { AppState } from '@/state/appState';
import { useI18n } from 'vue-i18n';
export default {
    name: "ViewMultisigHome",
    props: {
        address: String
    },
    components:{
      AccountComponent,
      MoreAccountOptions
    },
    setup(p){
      const {t} = useI18n()
      const toast = useToast();
      var acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == p.address);
      const other_acc = walletState.currentLoggedInWallet.others.filter(accounts=>accounts.type === "MULTISIG").find((add) => add.name == p.address);
      if(!acc){
          if(other_acc)
          {
            acc = other_acc;
          }
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
        let multisigAccountsList= []
        let multisigAccounts =  acc.multisigInfo.filter(info=>info.level== -1)
        multisigAccounts.forEach(account=>multisigAccountsList.push({name: getAccountName(account.publicKey),address:  PublicAccount.createFromPublicKey(account.publicKey,networkType).address.pretty()}))
        return multisigAccountsList
      },{deep:true})
      let cosignerAccountsList = computed(()=>{
        let cosignerAccountsList= []
        let cosignerAccounts =  acc.multisigInfo.filter(info=>info.level== 1)
        cosignerAccounts.forEach(account=>cosignerAccountsList.push({name: getAccountName(account.publicKey),address:  PublicAccount.createFromPublicKey(account.publicKey,networkType).address.pretty()}))
        return cosignerAccountsList
      },{deep:true})
      
      //check if account is a cosigner
      let verifyHasMultisig = multiSign.checkHasMultiSig(acc.address)
      isCosigner.value = verifyHasMultisig;
      //check if account is a multisig
      let verifyMultisig = multiSign.checkIsMultiSig(acc.address)
      isMultisig.value = verifyMultisig;
    
      const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject +' '+ t('general.copied'), group: 'br', life: 3000});
    };
      
      return{
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