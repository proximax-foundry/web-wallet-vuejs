<template>
  <div>
  <div class='flex cursor-pointer'>
    <img src='@/assets/img/chevron_left.svg'>
    <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
  </div>
  <div class='w-9/12 ml-auto mr-auto '>
    <div class = 'flex text-xs font-semibold border-b-2'>
      <router-link :to="{name: 'ViewAccountDetails',params:{address:acc.address}}" class= 'w-18 text-center '>Details</router-link>
      <div class= 'w-18 text-center border-b-4 pb-3 border-yellow-500'>Multisig</div>
    </div>
    <div class='font-semibold mt-8'>Multisig Settings</div>
    <div class='mt-6 p-6 border '>
      <div class='text-xs font-semibold'>Account Cosignatories</div>
      <div class='border border-4 p-4 my-3'>
        <!-- <div v-if="isMultisig">im a multisig</div> -->
        <div v-if="!isMultisig" class='text-blue-primary text-xs text-center font-semibold'>Nothing to show.</div>
        <div class='flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 text-center'>
          <span v-if="!isMultisig">"{{acc.name}}" does not have any cosignatory accounts.When you add at least one (1) cosignatory, your account will automatically converted into multisig account.</span>
        </div>
      </div>
      <router-link :to="{ name: isMultisig ? 'ViewMultisigEditAccount' : 'ViewMultisigConvertAccount', params: { name: acc.name}}" class="blue-btn py-2 px-2 ">Manage Cosignatories</router-link>
      <div class="gray-line my-8"></div>
      <div class='text-xs font-semibold'>Cosignatory of</div>
      <div class='border border-4 p-4 mt-3'>
        <!-- <div v-if="isCosigner">Im a cosigner</div> -->
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
import { watch, ref, computed, getCurrentInstance } from "vue";
import { multiSign } from '@/util/multiSignatory';
export default {
    name: "ViewMultisigHome",
    props: {
        name: String
    },
    setup(p){
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

       //check if account is a cosigner
        let verifyHasMultisig = multiSign.checkHasMultiSig(acc.address)
        isCosigner.value = verifyHasMultisig;
       //check if account is a multisig
        let verifyMultisig = multiSign.checkIsMultiSig(acc.address)
        isMultisig.value = verifyMultisig;
      
       
        return{
          isMultisig,
          acc,
          isCosigner
        }
    }
}

</script>

<style>

</style>