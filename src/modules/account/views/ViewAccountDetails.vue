<template>
  <div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="address" class="mb-6"/>
       <div v-if="showModal" class="mb-8">
        <div class="border border-green-300 pl-6 pb-3 bg-green-50">
          <div class="flex items-center gap-3">
            <img src='@/assets/img/icon-green-tick.svg' class='h-10 w-10 pt-3 mr-2 '>
            <div class="flex flex-col w-full">
              <div class="flex">
                <div class="text-xs text-green-500 font-semibold pt-3">{{$t('general.congratz')}}</div>
                <img  @click="showModal=false" src="@/assets/img/delete.svg" class="w-5 ml-auto mr-1 cursor-pointer">
              </div>
              <div class="text-xxs mt-1">{{$t('account.accountCreated')}}{{$t('general.pkWarning')}}</div>
            </div>
          </div>
        </div>
      </div>
      <AccountTabs :address="address" selected="details"/>
      <div class='border-2 border-t-0 pb-6 px-6 pt-2'>
        <div class="flex flex-col sm:flex-row justify-between sm:items-center mt-3">
          <div class="flex flex-col ">
            <div class = ' text-xxs text-blue-primary font-semibold uppercase'>{{$t('general.currentBalance')}}</div>
            <div class="flex">
              <div class = 'text-md font-bold '>{{splitBalance.left}} </div>
              <div class = 'text-md font-bold' v-if='splitBalance.right!=null'>.</div>
              <div class='text-xs mt-1.5 font-bold'>{{splitBalance.right}}</div>
              <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
              <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5 mt-0.5'>
            </div>
            <div class = 'text-txs text-gray-400 mt-0.5'>{{$t('general.estimateUSD')}} {{currencyConvert}}</div>
          </div>
          <div v-if="networkType ==168 " class='flex mt-2 sm:mt-0 '>
            <a  :href="topUpUrl" target="_blank" class='flex bg-navy-primary rounded-md py-0.5 px-3 cursor-pointer'>
              <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5  cursor-pointer '>
              <div class='text-xs mt-0.5 font-semibold text-white'>{{$t('general.topUp',{tokenName: currentNativeTokenName})}}</div>
              <img src="@/modules/dashboard/img/icon-link-new-white.svg" class='h-5 w-5  cursor-pointer '>
            </a>
          </div>
        </div>
        <div class='my-6 gray-line'></div>
        <div class = 'text-xxs text-blue-primary mt-2 font-semibold uppercase'>{{$t('general.publicKey')}}</div>
          <div class= 'flex'>
            <div id="public" class="text-xs font-semibold mt-1 break-all truncate md:text-clip md:w-auto" :copyValue="acc?acc.publicKey:''" :title="acc?acc.publicKey:''" :copySubject="$t('general.publicKey')">{{acc?acc.publicKey:''}}</div>
            <font-awesome-icon icon="copy" @click="copy('public')" :title="$t('general.copy')" class="ml-2 mt-0.5 pb-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
          </div>
          <div v-if='!other_acc' class='my-6 gray-line'></div>
          <div v-if='!other_acc' >
            <div class = 'text-xxs text-blue-primary mt-0.5 font-semibold uppercase'>{{$t('general.privateKey')}}</div>
            <div class='flex '>
              <div v-if="!showPwPK && !showPK" class='break-all font-semibold truncate md:text-clip md:w-auto'>****************************************************************</div>
              <PkPasswordModal v-if="!showPwPK && !showPK" :account = 'acc' />
            </div>
            <div class='flex'>
              <div id="private" class="text-xs mt-1 font-semibold break-all truncate md:text-clip md:w-auto" type="text" :copyValue="privateKey" :title="privateKey" copySubject="Private Key" v-if="showPK">{{privateKey}}</div>
              <font-awesome-icon title='Copy' icon="copy" @click="copy('private')" class="ml-2 pb-1 w-5 h-5 text-blue-link cursor-pointer " v-if="showPK"></font-awesome-icon>
              <font-awesome-icon icon="eye-slash" title='Hide Private Key' class="text-blue-link relative cursor-pointer ml-1" @click="showPwPK = false; showPK = false" v-if="showPK"></font-awesome-icon>
            </div>
            <div class = 'text-txs mt-2 text-red-400 border px-1.5 py-2 border-red-400 rounded-md'>{{$t('general.pkWarning')}}</div>
        </div>
        <div class='my-6 gray-line'  ></div>
      
          <div  class="flex  flex-col">
            <div class="text-xxs text-blue-primary font-semibold uppercase ">Linked Account</div>
            <div class="flex items-center">
              <router-link class="truncate" v-if="linkedAccountKey!='' && linkedAccountKey!='0'.repeat(64)" :to="{ name: 'ViewAccountDetails', params: { address: findAccountAddress(linkedAccountKey)}}">
                <div class="text-xs mt-1 font-semibold break-all  truncate md:text-clip md:w-auto">{{linkedAccountKey}}</div>
              </router-link>
              <div v-else class="text-xs ">No Linked Account</div>
              <router-link v-if="!isDelegate()" :to="{ name: 'ViewAccountDelegate', params: { address: address}}">
                <font-awesome-icon v-if="linkedAccountKey!='' && linkedAccountKey!='0'.repeat(64)" title="Unlink account" icon="unlink"  class="ml-2 w-4 h-4 text-blue-primary cursor-pointer"></font-awesome-icon>
                <font-awesome-icon v-else title="Delegate account" icon="link"  class="ml-2 w-4 h-4 text-blue-primary cursor-pointer"></font-awesome-icon>
              </router-link>
              
            </div>
          </div>
        <div class='my-6 gray-line' ></div>
          <div class="flex  flex-col">
            <div class="text-xxs text-blue-primary font-semibold uppercase">Alias</div>
            <div class="flex items-center">
              <div v-if="!linkedNamespace.length" class="text-xs "> No Alias </div>
              <div v-for="(name,index) of linkedNamespace" :key="index" class="text-xs mt-1 font-semibold break-all">
                <a :href="explorerLink(name)" target=_new>
                  <div class="cursor-pointer">{{name}}<span v-if="index!=linkedNamespace.length-1">,</span></div> 
                  </a>
              </div>
              <router-link v-if="!isDelegate()" :to="{ name: 'ViewAccountAliasAddressToNamespace', params: { address: address}}" >
                 <font-awesome-icon v-if="!linkedNamespace.length" title="Alias to namespace" icon="link"  class="ml-2 w-4 h-4 mt-0.5 text-blue-primary cursor-pointer"></font-awesome-icon>
                 <font-awesome-icon v-else title="Unlink namespace" icon="unlink"  class="ml-2 w-4 h-4 mt-0.5 text-blue-primary cursor-pointer"></font-awesome-icon>
              </router-link>
            </div>
          </div>
        <div class="flex mt-6 flex-col sm:flex-row w-auto gap-10 sm:gap-0 justify-between ">
          <PdfPasswordModal v-if='!other_acc' />
          <!-- <router-link v-if="!isDelegate()" :to="{ name: 'ViewAccountAliasAddressToNamespace', params: { address: address}}" class="text-center text-xs px-3 blue-btn cursor-pointer py-3" ><img src="@/assets/img/link-icon.svg" class = 'h-3 w-3 mr-1 inline-block' style= "transform: rotateY(180deg)" >{{$t('general.linkToNamespace')}}</router-link>
          <router-link v-if="!isDelegate()" :to="{ name: 'ViewAccountDelegate', params: { address: address}}" class="text-center blue-btn cursor-pointer py-3 px-3"><img src="@/assets/img/icon-multisig.svg" class = 'h-3 w-3 mr-1 inline-block' style= "transform: rotateY(180deg)" >{{$t('delegate.delegateAcc')}}</router-link> -->
          <DeleteAccountModal v-if="!isDefault && !other_acc "  :account ='acc' />
        </div>
      </div>
    </div>
</div>
</template>

<script >
import {getXPXcurrencyPrice } from '@/util/functions';
import { watch, ref, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import TextInput from "@/components/TextInput.vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { walletState } from "@/state/walletState";
import { Helper } from "@/util/typeHelper";
import { networkState } from "@/state/networkState";
import { WalletUtils } from "@/util/walletUtils";
import { useI18n } from 'vue-i18n';
import { pdfWalletPaperImg } from '@/modules/account/pdfPaperWalletBackground';
import jsPDF from 'jspdf';
import qrcode from 'qrcode-generator';
import PkPasswordModal from '@/modules/account/components/PkPasswordModal.vue'
import PdfPasswordModal from '@/modules/account/components/PdfPasswordModal.vue'
import DeleteAccountModal from '@/modules/account/components/DeleteAccountModal.vue'
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { AppState } from '@/state/appState';
import { Address } from 'tsjs-xpx-chain-sdk';

export default {
  name: "ViewAccountDetails",
  components: {
    /* TextInput, */
    PkPasswordModal,
    PdfPasswordModal,
    DeleteAccountModal,
    AccountComponent,
    AccountTabs
  },
  props: {
    address: String,
    accountCreated: Boolean
  },
  setup(p) {
    const {t} = useI18n();
    const toast = useToast();
    const router = useRouter();
    const showModal = ref(false)
    // get account details
    

    let isDelegate = ()=>{
      if(!walletState.currentLoggedInWallet){
        return false
      }
      let account = walletState.currentLoggedInWallet.others.find(acc=>acc.address==p.address)
      if(account){
        return account.type=="DELEGATE"?true:false
      }else{
        return false
      }
    }

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
    
    if(p.accountCreated){
      showModal.value= true
    }
    const isDefault = computed(()=> {
      if(!acc.value){
        return false
      }
      return acc.value.default?true: false
    })
    
    
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const prettyAddress = computed(()=>{
      if(p.address){
        try {
           return Helper.createAddress(p.address).pretty()
        } catch (error) {
        }
      }
      return ''
    })
    const err = ref(false);
    
    
    const showPwPK = ref(false);
    const showPK = ref(false);
    const privateKey = ref("");
    const showPasswdError = ref(false);
    const walletPasswd = ref("");
    const walletPasswdSwap = ref("");
    const walletPasswdWalletPaper  = ref("");
    const showPwSwap = ref(false);
    const showWalletPaperPw = ref(false);
    const showSavePaperWallet = ref(false);
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);

      toast.add({severity:'info', detail: copySubject +' ' + t('general.copied'), group: 'br', life: 3000});
    };

    
    const isMultiSig = computed(() => {
      if(!acc.value){
        return false
      }
      let isMulti = acc.value.getDirectParentMultisig().length? true: false
      return isMulti;
    });  

   

    const verifyWalletPwSwap = () => {
      if (walletPasswdSwap.value == "") {
        err.value = "Please insert wallet password to swap";
        showPwSwap.value = false;
      } else {
        err.value = "";
      }
    };
    
    const currencyConvert = ref('');
     const getCurrencyPrice = () => {
      if(!acc.value){
        return 
      }
      let balance = acc.value.balance;
      getXPXcurrencyPrice(balance).then((total) => {
        currencyConvert.value = Helper.toCurrencyFormat(total, AppState.nativeToken.divisibility);
      });
    };
     
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const currentNativeTokenDivisibility = computed(()=> AppState.nativeToken.divisibility);

    const accountBalance = computed(
      () => {          
        if(!acc.value){
          return "0"
        }
        return Helper.toCurrencyFormat(acc.value.balance, currentNativeTokenDivisibility.value);
      }
    );

    const splitBalance = computed(()=>{
      let split = accountBalance.value.split(".")
      if (split[1]!=undefined){
        return {left:split[0],right:split[1]}
      }else{
        return {left:split[0], right:null}
      }
    })

    if(AppState.nativeToken.label=== "XPX"){
      getCurrencyPrice();

      watch(accountBalance, () => {
        getCurrencyPrice();
      });
    }


    const generateQR = (url, size = 2, margin = 0) => {
      const qr = qrcode(10, 'H');
      qr.addData(url);
      qr.make();
      return qr.createDataURL(size, margin);
    }

    const saveWalletPaper = (password) => {
      const doc = new jsPDF({
        unit: 'px'
      });
      doc.addImage(pdfWalletPaperImg, 'JPEG', 120, 60, 205, 132);

      // QR Code Address
      const passwordInstance = WalletUtils.createPassword(password);
      const walletPrivateKey = WalletUtils.decryptPrivateKey(passwordInstance,acc.value.encrypted,acc.value.iv);
      let privateKey = walletPrivateKey.toUpperCase();
      doc.addImage(generateQR(privateKey, 1, 0), 151.5, 105);

      // Addres number
      doc.setFontSize(8);
      doc.setTextColor('#000000');
      doc.text(prettyAddress.value, 146, 164, { maxWidth: 132 });
      doc.save('Your_Paper_Wallet');
    }

    const networkType = computed(()=>{
    return AppState.networkType
    })
    const topUpUrl = computed(()=>{
      if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 1'){
        return 'https://bctestnetfaucet.xpxsirius.io/#/'
      }else if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 2'){
        return 'https://bctestnet2faucet.xpxsirius.io/#/'
      }else{
        return ''
      }
    }) 

    const linkedAccountKey = ref('')
    const linkedNamespace = ref([])
    const getLinkedAccountKey = async() =>{
      const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(acc.value.address))
      if(accInfo.linkedAccountKey!=undefined){
        linkedAccountKey.value = accInfo.linkedAccountKey 
      }
    }
    const getLinkedNamespace = async() =>{
      const accountNames = await AppState.chainAPI.accountAPI.getAccountsNames([Address.createFromRawAddress(acc.value.address)])
        accountNames[0].names.forEach(name=>{
          linkedNamespace.value.push(name.name)
        })
    }
    
    const explorerLink = namespace=>{ 
          if(!networkState.currentNetworkProfile){
              return ''
          }
          return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute + '/' + namespace
      }

    const findAccountAddress = publicKey=>{ 
        if(!walletState.currentLoggedInWallet){
            return ''
        }
        let account =  walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==publicKey) || walletState.currentLoggedInWallet.others.find(acc=>acc.publicKey==publicKey)
        return account.address

    }
    const init = async() =>{ 
      if(!acc.value){
        return
      }
      await getLinkedAccountKey()
      getLinkedNamespace()
    }
   
    if(AppState.isReady){
      if(!acc.value){
        return
      }
      init();
    }else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
          init();
          readyWatcher();
        }
      });
    }

    emitter.on("revealPK", (e) => {
      showPK.value = e;
    });
    emitter.on("pkValue", (e) => {
      privateKey.value = e
    });
    
    emitter.on("unlockWalletPaper", (e) => {
      saveWalletPaper(e)
    });
   

    return {
      findAccountAddress,
      linkedAccountKey,
      linkedNamespace,
      topUpUrl,
      networkState,
      showModal,
      splitBalance,
      other_acc,
      currencyConvert,
      isMultiSig,
      currentNativeTokenName,
      isDefault,
      err,
      showPK,
      showPwPK,
      showPasswdError,
      walletPasswd,
      walletPasswdSwap,
      showPwSwap,
      isDelegate,
      acc,
      verifyWalletPwSwap,
      copy,
      privateKey,
      showWalletPaperPw,
      showSavePaperWallet,
      walletPasswdWalletPaper,
      saveWalletPaper,
      networkType,
      explorerLink
    };
  }
};
</script>
<style scoped>
.popup-outer-create-wallet{
  
  top: 40px; left: 0; right: 0; margin-left: auto; margin-right: auto; max-width: 400px;

}
</style>