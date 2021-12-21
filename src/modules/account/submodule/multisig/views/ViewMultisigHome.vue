<template>
  <div>
  <div class='flex cursor-pointer'>
    <img src='@/assets/img/chevron_left.svg'>
    <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
  </div>
  <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
    <div class="flex text-xs font-semibold border-b-2 menu_title_div">
      <router-link :to="{name: 'ViewAccountDetails',params:{address:acc.address}}" class= 'w-18 text-center '>Details</router-link>
      <div class= 'w-18 text-center border-b-2 pb-3 border-yellow-500'>Multisig</div>
      <router-link :to="{name:'ViewAccountSwap', params: { address: acc.address}}" class= 'w-18 text-center'>Swap</router-link>
    </div>
    <div class='font-semibold mt-8'>Multisig Settings</div>
    <div class='mt-6 p-6 border filter shadow-lg'>
      <div class='text-xs font-semibold'>Account Cosignatories</div>
      <div class='border border-4 p-4 my-3 '>
       <div class="flex flex-col gap-2">
        <div v-for="(cosigner,index) in cosignerAccountsList" :key="index">
            <div class="border w-full rounded-md p-3">
              <div class="text-txs font-semibold text-blue-primary">{{cosigner.name}}</div>
              <div class="flex">
                <div :id="`cosignerAddress${index}`" :copyValue="cosigner.address" copySubject="Address" class="text-txs font-bold mt-1">{{cosigner.address}}</div>
                <font-awesome-icon icon="copy" title='Copy' @click="copy(`cosignerAddress${index}`)" class="ml-2 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
                <img src="@/assets/img/chevron_right.svg" class="w-5 h-5 ml-auto">
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isMultisig" class='text-blue-primary text-xs text-center font-semibold'>Nothing to show.</div>
        <div class='flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 text-center'>
          <span v-if="!isMultisig">"{{acc.name}}" does not have any cosignatory accounts.When you add at least one (1) cosignatory, your account will automatically converted into multisig account.</span>
        </div>
      </div>
      <router-link :to="{ name: isMultisig ? 'ViewMultisigEditAccount' : 'ViewMultisigConvertAccount', params: { name: acc.name}}" class="blue-btn py-2 px-2 ">Manage Cosignatories</router-link>
      <div class="gray-line my-8"></div>
      <div class='text-xs font-semibold'>Cosignatory of</div>
      <div class='border border-4 p-4 mt-3'>
        <div class="flex flex-col gap-2">
          <div v-for="(multisig,index) in multisigAccountsList" :key="index">
            <div class="border w-full rounded-md p-3">
              <div class="text-txs font-semibold text-blue-primary">{{multisig.name}}</div>
              <div class="flex">
                <div :id="`multisigAddress${index}`" :copyValue="multisig.address" copySubject="Address" class="text-txs font-bold mt-1">{{multisig.address}}</div>
                <font-awesome-icon icon="copy" title='Copy' @click="copy(`multisigAddress${index}`)" class="ml-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
                 <img src="@/assets/img/chevron_right.svg" class="w-5 h-5 ml-auto">
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isCosigner" class='text-blue-primary text-xs text-center font-semibold'>Nothing to show.</div>
        <div v-if="!isCosigner" class='flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 justify-center text-center'>
          <span v-if="!isCosigner">"{{acc.name}}" is not a cosignatory of any accounts.</span>
        </div>
      </div>
      <button class="blue-btn py-2 px-2 mt-3">View Scheme</button>
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
export default {
    name: "ViewMultisigHome",
    props: {
        name: String
    },
    setup(p){
      const toast = useToast();
      var acc = walletState.currentLoggedInWallet.accounts.find((add) => add.name == p.name);
      const other_acc = walletState.currentLoggedInWallet.others.filter(accounts=>accounts.type === "MULTISIG").find((add) => add.name == p.name);
      if(!acc){
          if(other_acc)
          {
            acc = other_acc;
          }
      }
      const isMultisig = ref(false) 
      const isCosigner = ref(false)
      const networkType = networkState.currentNetworkProfile.network.type
      const convertAddress = publicKey =>{ 
        return Address.createFromPublicKey(publicKey, networkType)
      }
      const findAccount = publicKey =>{
        return walletState.currentLoggedInWallet.accounts.find(account=>account.address == convertAddress(publicKey).plain())
      }
      const getAccountName = (publicKey) =>{
        return findAccount(publicKey) ? findAccount(publicKey).name : `Cosigner-${convertAddress(publicKey).plain().substr(-4)}`
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

      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
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