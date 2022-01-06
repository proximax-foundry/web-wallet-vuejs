<template>
    <div class='border-2 shadow-lg filter'>
        <div class='flex'>
            <div v-html='svgString'></div>
            <div class='flex flex-col justify-center ml-4'>
                <div class="text-red-500 text-xs" v-if="err!=''">{{ err }}</div>
                <div class='flex '>
                    <div class = '  font-semibold text-md' v-if='showName'>{{ accountNameDisplay }}</div>
                    <input class='outline-none ml-4 font-semibold text-md'  v-model='accountName' v-if='!showName'/>
                    <img src="@/modules/account/img/edit-icon.svg"  v-if='showName' @click='showName=!showName' title='Edit Account Name' class="w-4 h-4 text-black cursor-pointer mt-1 ml-1" >
                    <img src="@/modules/account/img/edit-icon.svg"  v-if='!showName'  @click="changeName()" title='Confirm Account Name' class="w-4 h-4 text-black cursor-pointer mt-1 ml-1" >
                </div>
                <div class= 'flex'>
                    <div id="address" :copyValue="prettyAddress" copySubject="Address" class = 'text-xs font-semibold mt-1'>{{prettyAddress}} </div>
                    <font-awesome-icon icon="copy" title='Copy' @click="copy('address')" class="ml-2 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
                </div>
                <div class='flex gap-2'> 
                    <div  v-if='isDefault' class = ' px-1 py-0.5 flex mt-0.5 bg-blue-primary rounded-sm'>
                    <img src="@/modules/account/img/icon-pin.svg" class = 'h-4 w-4 ' title='This is your default account everytime you login'>
                    <p class = 'font-semibold text-white text-xxs pt-px cursor-default' title='This is your default account everytime you login' >DEFAULT</p>
                    </div>
                    <div v-if='isMultiSig' class = ' px-1 py-0.5 flex mt-0.5 bg-orange-primary rounded-sm '>
                        <img v-if='isMultiSig' src="@/assets/img/icon-key.svg" class = 'h-4 w-4 mr-1' title='This is your default account everytime you login'>
                        <p v-if='isMultiSig' class = 'font-semibold text-white text-xxs pt-px cursor-default' title='This is a multisig account' >MULTISIG</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { walletState } from '@/state/walletState';
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { watch, ref, computed, getCurrentInstance } from "vue";
import { toSvg } from "jdenticon";
import { useI18n } from 'vue-i18n';
import { Helper } from '@/util/typeHelper';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
export default {
name:"AccountComponent",
props:{
    address: String
},
setup(p){
    const {t} = useI18n();
    const toast = useToast();
    let acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == p.address);
    const other_acc = walletState.currentLoggedInWallet.others.find((add) => add.address == p.address);
    if(!acc){
      if(other_acc)
      {
        acc = other_acc;
      }
    }
    let err = ref("")
    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig'); 
    const prettyAddress = Helper.createAddress(acc.address).pretty();
    themeConfig.init();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const isDefault = (acc.default == true) ? true: false
    const isMultiSig = computed(() => {
      let isMulti = acc.getDirectParentMultisig().length? true: false
      return isMulti;
    });  
    const accountName = ref(acc.name);
    const accountNameDisplay = ref(acc.name);
    const svgString = ref(toSvg(acc.address, 100, themeConfig.jdenticonConfig));    
    const showName = ref(true);
    const changeName = () => {
      if (accountName.value.trim()) {
        const exist_account = walletState.currentLoggedInWallet.accounts.find((accName) => accName.name == accountName.value.trim());
        const exist_other_account = walletState.currentLoggedInWallet.others.find((accName) => accName.name == accountName.value.trim());

        if (!exist_account && !exist_other_account) {
          const acc_index = walletState.currentLoggedInWallet.accounts.findIndex((accAdd) => accAdd.address === p.address);
          if(acc_index == -1){
            const other_acc_index = walletState.currentLoggedInWallet.others.findIndex((accAdd) => accAdd.address === p.address);
            walletState.currentLoggedInWallet.others[other_acc_index].name = accountName.value;
          }
          else{
            walletState.currentLoggedInWallet.accounts[acc_index].name = accountName.value;
          }
          walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
          showName.value = true;
          accountNameDisplay.value = accountName.value;
          err.value=""
          err.value = "";
        } else if (exist_account || exist_other_account) {
          err.value = t('scriptvalues.accountnametaken');
        } else {
          err.value = t('scriptvalues.accountnamevalidation');
        }
      } else {
        err.value = t('scriptvalues.inputaccountname');
      }
    };
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);

      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };
    
    return{
        accountName,
        accountNameDisplay,
        showName,
        svgString,
        isDefault,
        isMultiSig,
        prettyAddress,
        changeName,
        copy,
        err
    }
}
}
</script>

<style>

</style>