<template>
  <div>
    <div class='px-6 py-4 border-2 shadow-lg filter '>
        <div class='flex items-center'>
            <div v-html='svgString'></div>
            <div class='flex flex-col justify-center ml-4'>
                <div class="text-red-500 text-xs" v-if="err!=''">{{ err }}</div>
                <div class='flex '>
                    <div class = '  font-semibold text-md' v-if='showName'>{{ accountNameDisplay }}</div>
                    <input class='outline-none ml-4 font-semibold text-md'  v-model='accountName' v-if='!showName'/>
                    <img src="@/modules/account/img/edit-icon.svg"  v-if='showName && !other_acc' @click='showName=!showName' :title="$t('account.editName')" class="w-4 h-4 text-black cursor-pointer mt-1 ml-1" >
                    <img src="@/modules/account/img/edit-icon.svg"  v-if='!showName'  @click="changeName()" :title="$t('account.confirmName')" class="w-4 h-4 text-black cursor-pointer mt-1 ml-1" >
                </div>
                <div class= 'flex'>
                    <div id="address" :copyValue="prettyAddress" :copySubject="$t('general.address')" class = 'text-xs font-semibold mt-1 break-all'>{{prettyAddress}} </div>
                    <font-awesome-icon icon="copy" :title="$t('general.copy')" @click="copy('address')" class="ml-3 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
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
       
          <div class='my-4 gray-line'/>
          <div class = 'mt-4 text-xxs text-blue-primary font-semibold uppercase'>{{$t('general.currentBalance')}}</div>
          <div class='flex my-1'>
            <div class = 'text-md font-bold '>{{splitBalance.left}} </div>
            <div class = 'text-md font-bold' v-if='splitBalance.right!=null'>.</div>
            <div class='text-xs mt-1.5 font-bold'>{{splitBalance.right}}</div>
            <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
            <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5 mt-0.5'>
            <div v-if="networkType ==168 " class='flex ml-auto gap-6 '>
              <a  :href="topUpUrl" target="_blank" class='flex bg-navy-primary rounded-md py-0.5 px-3 cursor-pointer'>
                <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5  cursor-pointer '>
                <div class='text-xs mt-0.5 font-semibold text-white'>{{$t('general.topUp',{tokenName: currentNativeTokenName})}}</div>
                <img src="@/modules/dashboard/img/icon-link-new-white.svg" class='h-5 w-5  cursor-pointer '>
              </a>
            </div>
          </div>
          <div class = 'text-txs text-gray-400 '>{{$t('general.estimateUSD')}} {{currencyConvert}}</div>
          
          <div class = 'text-xxs text-blue-primary mt-2 font-semibold uppercase'>{{$t('general.publicKey')}}</div>
          <div class= 'flex'>
            <div id="public" class="text-xs font-semibold mt-1 break-all" :copyValue="acc?acc.publicKey:''" :copySubject="$t('general.publicKey')">{{acc?acc.publicKey:''}}</div>
            <font-awesome-icon icon="copy" @click="copy('public')" :title="$t('general.copy')" class="ml-2 mt-0.5 pb-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
          </div>
          <div  class="mt-2" v-if='!other_acc' >
          <div class = 'text-xxs text-blue-primary mt-0.5 font-semibold uppercase'>{{$t('general.privateKey')}}</div>
          <div class='flex '>
            <div v-if="!showPwPK && !showPK" class='break-all font-semibold'>****************************************************************</div>
            <PkPasswordModal v-if="!showPwPK && !showPK" :account = 'acc' />
          </div>
          <div class='flex'>
            <div id="private" class="text-xs mt-1 font-semibold break-all" type="text" :copyValue="privateKey" copySubject="Private Key" v-if="showPK">{{privateKey}}</div>
            <font-awesome-icon title='Copy' icon="copy" @click="copy('private')" class="ml-2 pb-1 w-5 h-5 text-blue-link cursor-pointer " v-if="showPK"></font-awesome-icon>
            <font-awesome-icon icon="eye-slash" title='Hide Private Key' class="text-blue-link relative cursor-pointer ml-1" @click="showPwPK = false; showPK = false" v-if="showPK"></font-awesome-icon>
          </div>
          <div class = 'text-txs mt-1 text-red-400 border px-1.5 py-2 border-red-400 rounded-md'>{{$t('general.pkWarning')}}</div>
          <div v-if="linkedAccountKey!='' && linkedAccountKey!='0'.repeat(64)" class="flex  flex-col">
            <div class="text-xxs text-blue-primary mt-2 font-semibold uppercase">Linked Account Key</div>
            <div class="text-xs mt-1 font-semibold break-all">{{linkedAccountKey}}</div>
          </div>
          <div v-if="linkedNamespace.length" class="flex  flex-col">
            <div class="text-xxs text-blue-primary mt-2 font-semibold uppercase">Linked Namespace</div>
            <div class="text-xs mt-1 font-semibold break-all">{{linkedNamespace}}</div>
          </div>
          <div class='flex items-center mt-3'>
            <PdfPasswordModal v-if='!other_acc' />
            <router-link v-if="!isDelegate()" :to="{ name: 'ViewAccountAliasAddressToNamespace', params: { address: address}}" class="text-xs ml-3 blue-btn cursor-pointer py-3 px-3" ><img src="@/assets/img/link-icon.svg" class = 'h-4 w-4 mr-1 inline-block' style= "transform: rotateY(180deg)" >{{$t('general.linkToNamespace')}}</router-link>
            <router-link v-if="!isDelegate()" :to="{ name: 'ViewAccountDelegate', params: { address: address}}" class="ml-3 blue-btn cursor-pointer py-3 px-3"><img src="@/assets/img/icon-multisig.svg" class = 'h-3 w-3 mr-1 inline-block' style= "transform: rotateY(180deg)" >{{$t('delegate.delegateAcc')}}</router-link>
            <DeleteAccountModal v-if="!isDefault && !other_acc " :account ='acc' />
          </div>
      </div>
    </div>
  </div>
    
</template>

<script setup>
import { walletState } from '@/state/walletState';
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { watch, ref, computed, getCurrentInstance, defineComponent, onBeforeMount } from "vue";
import { toSvg } from "jdenticon";
import { useI18n } from 'vue-i18n';
import { Helper } from '@/util/typeHelper';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { AppState } from '@/state/appState';
import { networkState } from '@/state/networkState';
import {getXPXcurrencyPrice } from '@/util/functions';
import PkPasswordModal from '@/modules/account/components/PkPasswordModal.vue'
import PdfPasswordModal from '@/modules/account/components/PdfPasswordModal.vue'
import DeleteAccountModal from '@/modules/account/components/DeleteAccountModal.vue'
import { Address, AddressAliasTransaction, AliasTransaction, TransactionGroupType, TransactionQueryParams } from 'tsjs-xpx-chain-sdk';
    defineComponent({
      name:"AccountComponent",
    }) 
    const p = defineProps({
      address: String
    })
    
    const privateKey = ref("");
    const showPwPK = ref(false);
    const showPK = ref(false);
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
    accountName.value = acc.value?acc.value.name: ''
    const accountNameDisplay = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return ''
      }
      return walletState.currentLoggedInWallet.convertAddressToName(p.address,true)
    });
    const svgString = ref(toSvg(p.address, 70, themeConfig.jdenticonConfig));    
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

      toast.add({severity:'info', detail: copySubject +' '+ t('general.copied'), group: 'br', life: 3000});
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

    getCurrencyPrice();
     
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

    const networkType = computed(()=>{
      return AppState.networkType
    })
    const topUpUrl = computed(()=>{
      if(!networkState){
        return ''
      }
      if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 1'){
        return 'https://bctestnetfaucet.xpxsirius.io/#/'
      }else if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 2'){
        return 'https://bctestnet2faucet.xpxsirius.io/#/'
      }else{
        return ''
      }
    }) 

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
    const linkedAccountKey = ref('')
    const linkedNamespace = ref('')
    const getLinkedAccountKey = async() =>{
      const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(acc.value.address))
      if(accInfo.linkedAccountKey!=undefined){
        linkedAccountKey.value = accInfo.linkedAccountKey
      }
    }
    const getLinkedNamespace = async() =>{
      const names = await AppState.chainAPI.accountAPI.getAccountsNames([Address.createFromRawAddress(acc.value.address)])
      if(names[0].names[0]){
        linkedNamespace.value = names[0].names[0].name
      }
    }

    const init = async() =>{ 
      if(!acc.value){
        return
      }
      await getLinkedAccountKey()
      getLinkedNamespace()
    }
   
    if(AppState.isReady){
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
    

</script>

<style>

</style>