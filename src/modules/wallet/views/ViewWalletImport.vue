<template>
  <div class="container mx-auto md:grid md:grid-cols-2 md:mt-10 lg:px-20 xl:px-40 ">
    <IntroTextComponent />
    <div class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md">
        <router-link :to="{ name: 'ViewWalletCreateSelection' }" class="text-xs m-2 text-blue-link items-center flex"><img src="@/assets/img/chevron_left.svg" class="w-5 inline-block">Back</router-link>
        <div class="text-lg text-center mt-16">Create Wallet</div>
        <div class="text-xs text-center text-blue-link">FROM A WALLET BACKUP</div>
        <div class="text-xs mt-8 ml-auto mr-auto w-7/12">If you have a previously backed up wallet, please import the file here.</div>
        <div class = 'mt-6 text-center text-xs'>Current Network: </div>
        <div class = 'text-center'>{{networkState.chainNetworkName}}</div>
        <label class = "cursor-pointer">
            <span class = 'mt-5 font-bold text-center default-btn block ml-auto mr-auto w-7/12'>Import File</span>
            <input type="file" @change="readWalletBackup" ref="walletFile" hidden />
        </label>
        <!-- <button  class = 'mt-5 font-bold text-center default-btn block ml-auto mr-auto w-7/12'>Import File</button> -->
        <div class ='text-center text-xs mt-6 mb-1'>Already have Sirius wallet account?</div>
        <div class ="text-center  text-xs text-blue-link"><router-link :to="{ name: 'Home' }">Sign in here ></router-link></div>
        <div class = 'h-28'></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject, ref, computed } from 'vue';
import CryptoJS from 'crypto-js';
import IntroTextComponent from '@/components/IntroTextComponent.vue'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { ChainUtils } from '@/util/chainUtils';
import { networkState } from "@/state/networkState";
import { WalletUtils } from '@/util/walletUtils';
import { walletState } from '@/state/walletState';

export default defineComponent({
  name: 'ViewWalletCreateSelection',
  components: {
    IntroTextComponent,
  },
  setup(){
    const confirm = useConfirm();
    const toast = useToast();
    // comparing with default networktype 168 till multiple network selection interface is added
    const selectedNetworkType = computed(()=> ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
    const selectedNetworkName = computed(()=> networkState.chainNetworkName);
    const walletFile = ref('');
    const readWalletBackup = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        const file = CryptoJS.enc.Base64.parse(e.target.result);
        try {
          const dataDecryp = JSON.parse(file.toString(CryptoJS.enc.Utf8));

          if(dataDecryp.networkName === undefined || dataDecryp.networkName !== selectedNetworkName.value){
            confirm.require({
              message: `You are about to import a wallet into ${selectedNetworkName.value}. Proceed ?`,
              header: 'Confirm Import',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                var importResult = importBackup(dataDecryp);
                toast.add({severity: importResult.status, detail: importResult.msg, group: 'br', life: 3000});
              },
            });
          }
          else{
            var importResult = importBackup(dataDecryp);
            toast.add({severity: importResult.status, detail: importResult.msg, group: 'br', life: 3000});
          }
        } catch (error) {
          let failMsg = 'Unable to add wallet. Invalid file.';
          toast.add({severity:'error', summary:'Import Failed', detail: failMsg, group: 'br', life: 5000});
        }
      }
      reader.readAsText(file);
    };

    const importBackup = (dataDecryp) =>{

      let status = "success";
      let message = "Import Successful";

      if(WalletUtils.checkIsNewFormat(dataDecryp)){
          try {
            WalletUtils.importWalletNewFormat(walletState.wallets, dataDecryp, selectedNetworkName.value, selectedNetworkType.value);

          } catch (error) {
            status = "error";

            if(error.name === "SAME_NAME"){
              message = error.message;
            }
            else{
              message = "Unable to import wallet";
            }
          }
      }
      else{
        try {
          WalletUtils.importWltOldFormat(walletState.wallets, dataDecryp, selectedNetworkName.value, selectedNetworkType.value);
        } catch (error) {
          status = "error";

          if(error.name === "SAME_NAME"){
            message = error.message;
          }
          else{
            message = "Unable to import wallet";
          }
        }
      }
      
      return {
        msg: message,
        status: status
      };
      
    };
    
    
    return {
      networkState,
      walletFile,
      readWalletBackup
    };
  },
});
</script>

<style>
.radio-toolbar input[type="radio"] {
  opacity: 0;
  width: 0;
  
}
.radio-toolbar label {
    display: inline-block;
    border: 1px solid #D3D3D3;
    width: 59%
}


</style>