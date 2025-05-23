<template>
    <div class='border-2 py-3 px-6'>
        <div class='flex'>
            <div v-html='svgString'></div>
            <div class='flex flex-col justify-center ml-4'>
                <div class="text-red-500 text-xs" v-if="err!=''">{{ err }}</div>
                <div class='flex '>
                    <div class = '  font-semibold text-md' v-if='showName'>{{ accountNameDisplay }}</div>
                    <div class='font-semibold text-xs mt-1.5' v-if="accountNameChange !== accountNameDisplay">({{ accountNameChange }})</div>
                    <input class='outline-none ml-4 font-semibold text-md'  v-model='accountName' v-if='!showName'/>
                    <changeNameModal :address="address" :isOther="other_acc==null?false:true"/>
                </div>
                <div class= 'flex gap-2'>
                    <div id="address" :copyValue="prettyAddress" :title="prettyAddress" :copySubject="$t('general.address')" class = 'truncate md:text-clip w-44 md:w-full text-xs font-semibold mt-1'>{{prettyAddress}} </div>
                    <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy('address')" class=" w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
                </div>
                <div class='flex gap-2'> 
                    <div  v-if='isDefault' class = ' px-1 py-0.5 flex mt-0.5 bg-blue-primary rounded-sm' :title="$t('general.defaultTitle')">
                    <img src="@/modules/account/img/icon-pin.svg" class = 'h-4 w-4 ' >
                    <p class = 'font-semibold text-white text-xxs pt-px cursor-default uppercase'  >{{$t('general.default')}}</p>
                    </div>
                    <div v-if='isMultiSig' class = ' px-1 py-0.5 flex mt-0.5 bg-orange-primary rounded-sm ' :title="$t('general.multisigTitle')">
                        <img v-if='isMultiSig' src="@/assets/img/icon-key.svg" class = 'h-4 w-4 mr-1' >
                        <p v-if='isMultiSig' class = 'font-semibold text-white text-xxs pt-px cursor-default uppercase' >{{$t('general.multisig')}}</p>
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
import changeNameModal from './ChangeNameModal.vue'
export default {
name:"AccountComponent",
props:{
    address: String
},
components:{
  changeNameModal
},
setup(p){
    const {t} = useI18n();
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
   const other_acc = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return null
      }
     return walletState.currentLoggedInWallet.others.find((add) => add.address == p.address);
   })
    let err = ref("")
    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig'); 
    const prettyAddress = computed(()=>{
      if(p.address){
        try {
           return Helper.createAddress(p.address).pretty()
        } catch (error) {
        }
      }
      return ''
    })
    themeConfig.init();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const isDefault = computed(()=> {
      if(!acc.value){
        return false
      }
      return acc.value.default?true: false
    })
    const isMultiSig = computed(() => {
      if(!acc.value){
        return false
      }
      let isMulti = acc.value.getDirectParentMultisig().length? true: false
      return isMulti;
    }); 
    const accountName = ref('');
    const accountNameChange = computed(() => acc.value ? acc.value.name: '');
    accountName.value = acc.value?acc.value.name: ''
    const accountNameDisplay = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return ''
      }
      return walletState.currentLoggedInWallet.convertAddressToName(p.address,true)
    });
    const svgString = ref(toSvg(p.address, 75, themeConfig.jdenticonConfig));    
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
          err.value = t('account.nameTaken');
        } else {
          err.value = t('account.failChangeName');
        }
      } else {
        err.value = t('account.nameEmpty');
      }
    };
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);

      toast.add({severity:'info', detail: copySubject +' '+ t('general.copied'), group: 'br-custom', life: 3000});
    };

    emitter.on("change-name", (name) => {
      accountNameChange.value = name
    })
    
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
        err,
        other_acc,
        accountNameChange
    }
}
}
</script>

<style>

</style>