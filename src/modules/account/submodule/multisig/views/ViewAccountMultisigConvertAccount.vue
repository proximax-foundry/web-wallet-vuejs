<template>
 <div>
  <div class='flex cursor-pointer'>
    <img src='@/assets/img/chevron_left.svg'>
    <router-link :to="{name: 'ViewMultisigHome',params:{name:acc.name}}" class='text-blue-primary text-xs mt-0.5'>Back</router-link>
  </div>
  <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
  <AccountComponent :address="acc.address" class="mb-10"/>
    <div class = 'flex text-xs font-semibold border-b-2'>
      <router-link :to="{name: 'ViewAccountDetails',params:{address:acc.address}}" class= 'w-32 text-center '>Account Details</router-link>
      <router-link :to="{name:'ViewAccountAssets', params: { address: acc.address}}" class= 'w-18 text-center'>Assets</router-link>
      <div class= 'w-18 text-center border-b-2 pb-3 border-yellow-500'>Multisig</div>
      <router-link v-if="isMultisig" :to="{name:'ViewMultisigScheme', params: { address: acc.address}}" class= 'w-18 text-center'>Scheme</router-link>
      <router-link :to="{name:'ViewAccountSwap', params: { address: acc.address}}" class= 'w-18 text-center'>Swap</router-link>
      <MoreAccountOptions :address="acc.address"/>
    </div>
    
    <div class="border-2 border-t-0 filter shadow-lg lg:grid lg:grid-cols-3" >
      <div class="lg:col-span-2 py-6 pr-6">
        <div class="text-xs font-semibold pl-6">Manage Cosignatories</div>
        <div class='pl-6'>
           <div class=" error error_box mb-5" v-if="err!=''">{{ err }}</div>
        </div>
        <div class="mt-4"></div>
        <div class="flex flex-col gap-2">
          <div v-for="(coSignAddress, index) in coSign" :key="index" >
            <div class="flex">
              <img  src="@/modules/account/submodule/multisig/img/icon-delete-red.svg" @click="deleteCoSigAddressInput(index)" class="w-4 h-4 text-gray-500 cursor-pointer mt-3 mx-1"  >
              <TextInput class='w-5/12 mr-2 ' :placeholder="`Cosignatory${index+1}`"  v-model="contactName[index]" :disabled="true"  />
              <TextInput class='w-7/12 mr-2 ' placeholder="Address/Public Key" errorMessage="Invalid Input" :showError="showAddressError[index]" v-model="coSign[index]" />
              <div v-if="showAddressError[index]==true " class="mt-16"/>
              <div @click="toggleContact[index]=!toggleContact[index]" class=' border  cursor-pointer flex flex-col justify-center  p-2' style="height:2.66rem">
                <font-awesome-icon icon="id-card-alt" class=" text-blue-primary ml-auto mr-auto "></font-awesome-icon>
                <div class='text-xxs text-blue-primary font-semibold'>SELECT</div>
              </div>
            </div>
            
            <div v-if="toggleContact[index]" class="pl-6 ">
              <div class=" border">
                <div class='text-xxs text-gray-300 font-semibold py-2 px-2'>IMPORT FROM ADDRESS BOOK</div>
                <div v-for="(item, number) in contact" :key="number" class="cursor-pointer">
                  <div @click="contactName[index]=item.label;coSign[index]=item.value;toggleContact[index]=false" class="flex justify-center">
                    <div v-if="number%2==0" class="text-xs py-2 bg-gray-100 pl-2 w-full">{{item.label}}</div>
                    <div v-if="number%2==1" class="text-xs py-2 pl-2 w-full">{{item.label}}</div>
                    <div v-if="number%2==0" class="ml-auto pr-2 text-xxs py-2 font-semibold text-blue-primary bg-gray-100">SELECT</div>
                    <div v-if="number%2==1" class="ml-auto mr-2 text-xxs py-2 font-semibold text-blue-primary">SELECT</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
       </div>
        <button class="pl-6 font-semibold text-xs mt-1 text-blue-primary outline-none focus:outline-none disabled:opacity-50  disabled:cursor-auto" @click="addCoSig" :disabled="addCoSigButton">+ Add New Cosignatory</button>
        <div class="ml-6 my-7 gray-line"/> 
        <div class="pl-6 text-xs font-semibold mb-3">Scheme</div>
        <div class='flex gap-2 pl-6'>
          <div class="border w-6/12">
          <div class="border-b-2 text-xxs text-center py-1">TRANSACTIONS APPROVAL</div>
            <div class='flex justify-around'>
              <button class="text-blue-primary disabled:opacity-50" @click="numApproveTransaction--" :disabled="numApproveTransaction<=0">-</button>
              <input type="number" class=" w-4 outline-none text-xs font-bold" :min=0 @keypress="validateApproval" :max="maxNumApproveTransaction" v-model="numApproveTransaction" >
              <button class="text-blue-primary disabled:opacity-50" :disabled="numApproveTransaction>=maxNumApproveTransaction " @click="numApproveTransaction++">+</button>
            </div>
            <div class="text-xxs border-t-2 text-center py-1">OF {{maxNumApproveTransaction}} COSIGNATORIES</div>
          </div>
          <div class="border w-6/12">
            <div class="border-b-2 text-xxs text-center py-1">ACCOUNT DELETION APPROVAL</div>
            <div class='flex justify-around'>
              <button class="text-blue-primary disabled:opacity-50" @click="numDeleteUser--" :disabled="numDeleteUser<=0">-</button>
              <input type="number" class=" w-4 outline-none text-xs font-bold" :min=0 @keypress="validateDelete" :max="maxNumDeleteUser" v-model="numDeleteUser" >
              <button class="text-blue-primary disabled:opacity-50" :disabled="numDeleteUser>=maxNumDeleteUser " @click="numDeleteUser++">+</button>
            </div>
            <div class="text-xxs border-t-2 text-center py-1">OF {{maxNumDeleteUser}} COSIGNATORIES</div>
          </div>
        </div>
      </div>
      <div class='bg-navy-primary p-6 lg:col-span-1'>
        <div class='font-semibold text-xxs text-blue-primary'>ACCOUNT CURRENT BALANCE</div>
        <div class='flex text-white'>
          <div class = 'text-md font-bold '>{{splitBalance.left}} </div>
          <div class = 'text-md font-bold' v-if='splitBalance.right!=null'>.</div>
          <div class='text-xs mt-1.5 font-bold'>{{splitBalance.right}}</div>
          <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
          <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
        </div>
        <div v-if="fundStatus" class="mt-2 grid bg-yellow-50 p-3 rounded-md" >
          <div class="flex gap-2">
            <img  src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
            <div class="flex-cols">
               <div class="text-txs">Your account has insufficient amount of XPX. Please top up first before continue transacting on this page.</div>
               <a v-if="networkState.chainNetwork == 0" class="text-xs text-blue-primary font-semibold underline " href="https://www.proximax.io/en/xpx" target="_blank">Top Up XPX<img src="@/modules/dashboard/img/icon-new-page-link.svg" class="w-3 h-3 ml-2 inline-block"></a>
               <a v-if="networkState.chainNetwork == 1" class="text-xs text-blue-primary font-semibold underline " href="https://bctestnetfaucet.xpxsirius.io/#/" target="_blank">Top Up XPX<img src="@/modules/dashboard/img/icon-new-page-link.svg" class="w-3 h-3 ml-2 inline-block"></a>
               <a v-if="networkState.chainNetwork == 2" class="text-xs text-blue-primary font-semibold underline " href="https://bctestnet2faucet.xpxsirius.io/#/" target="_blank">Top Up XPX<img src="@/modules/dashboard/img/icon-new-page-link.svg" class="w-3 h-3 ml-2 inline-block"></a>
            </div>
          </div>
        </div>
        <div v-if="onPartial" class="mt-2 grid bg-yellow-50 p-3 rounded-md" >
          <div class="flex gap-2">
            <img  src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
            <div class="text-txs">Your account has transaction(s) on partial.</div>
          </div>
        </div>
        <div v-if="isMultisig" class="mt-2 grid bg-yellow-50 p-3 rounded-md" >
          <div class="flex gap-2">
            <img  src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
            <div class="text-txs">Your account is already a multisig.</div>
          </div>
        </div>
        <div class="flex mt-4 text-white">
          <div class='text-xs '>Lockfund Fee</div>
          <div class="text-xs  ml-auto">{{lockFundCurrency}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div class="flex mt-0.5 text-white">
          <div class='text-xs '>LockFund Tx Fee</div>
          <div class="text-xs  ml-auto">{{lockFundTxFee}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div class='border-b-2 border-gray-600 my-2'/>
        <div class="flex  text-white">
          <div class='text-xs '>Aggregate Fee</div>
          <div class="text-xs  ml-auto">{{aggregateFee}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div class='border-b-2 border-gray-600 my-2'/>
        <div class="flex text-white">
          <div class=' font-bold text-xs '>TOTAL</div>
          <div class="text-xs  ml-auto">{{totalFee}}</div>
          <div class ='ml-1 text-xs'>{{currentNativeTokenName}}</div>
        </div>
        <div class="mt-5"/>
        <div class='font-semibold text-xs text-white mb-1.5'>Enter your password to continue</div>
        <PasswordInput  :placeholder="$t('signin.enterpassword')" errorMessage="Wallet password is required" :showError="showPasswdError" v-model="passwd" :disabled="disabledPassword" />
        <div class="mt-3"><button type="submit" class=' w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto'  @click="convertAccount()" :disabled="disableSend">Update Cosignatories</button></div>
        <div class="text-center">
          <router-link :to="{name: 'ViewMultisigHome',params:{name:acc.name}}" class="content-center text-xs text-white underline" >Cancel</router-link>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { computed, ref, inject, watch, getCurrentInstance } from 'vue';
import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue'
import TextInput from '@/components/TextInput.vue'
import AddCosignModal from '@/modules/account/submodule/multisig/components/AddCosignModal.vue';
import { multiSign } from '@/util/multiSignatory';
import { walletState } from '@/state/walletState';
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import MoreAccountOptions from "@/modules/account/components/MoreAccountOptions.vue";
import {
  Address,
    PublicAccount
} from "tsjs-xpx-chain-sdk"
import { networkState } from '@/state/networkState';
import {useI18n} from 'vue-i18n'
import { Helper } from '@/util/typeHelper';
import { AppState } from '@/state/appState';
import { TransactionUtils } from '@/util/transactionUtils';
export default {
  name: 'ViewConvertAccountMultisig',
  components: {
    PasswordInput,
    TextInput,
    AccountComponent,
    MoreAccountOptions
  },
  props: {
    name: String,
  },
  setup(p){
    const {t} = useI18n();
    const router = useRouter();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const err = ref('');
    const fundStatus = ref(false);
    const accountName = ref(p.name);
    const accountNameDisplay = ref(p.name);
    const passwd = ref('');
    const showPasswdError = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const numApproveTransaction = ref(1);
    const numDeleteUser = ref(1);
    const maxNumApproveTransaction = ref(0);
    const maxNumDeleteUser = ref(0);
    const publicKeyPattern = "^[0-9A-Fa-f]{64}$";
    const addressPatternShort = "^[0-9A-Za-z]{40}$";
    const addressPatternLong = "^[0-9A-Za-z-]{46}$";
    const coSign = ref([]);
    const contactName = ref([])
    const selectedAddresses = ref([]);
    const showAddressError = ref([]);
    const toggleContact = ref([])
    const onPartial = ref(false);
    const space=ref(false)
    let isMultisig = computed(()=>{
      return multiSign.checkIsMultiSig(acc.address)
    }) 
     const lockFundCurrency = computed(() =>
      Helper.convertToCurrency(
        networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
        networkState.currentNetworkProfile.network.currency.divisibility
      )
    );
    const lockFundTxFee = computed(()=>{ 
      if(networkState.currentNetworkProfile){ 
        return Helper.convertToExact(TransactionUtils.getLockFundFee(AppState.networkType, networkState.currentNetworkProfile.generationHash), AppState.nativeToken.divisibility);
      }
      return 0;  
    });
    const aggregateFee = ref(0)
    
     // get account details
    const acc =  walletState.currentLoggedInWallet.accounts.find(acc =>acc.name ===p.name) ;
    if(acc== undefined){
      router.push({ name: "ViewAccountDisplayAll"});
    }
    let updateAggregateFee=()=>{
      multiSign.getAggregateFee(acc.publicKey,coSign.value,numApproveTransaction.value,numDeleteUser.value).then(fee=>{
       aggregateFee.value=fee
     })
    }
    updateAggregateFee()
    const totalFee = computed(()=>{
        return  Math.round((aggregateFee.value + parseInt(lockFundCurrency.value) + lockFundTxFee.value)*1000000)/1000000 
    })
    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);
    const accountBalance = computed(() => {
      if(walletState.currentLoggedInWallet){
        return Helper.toCurrencyFormat(acc.balance, currentNativeTokenDivisibility.value);
      }else{
        return 0
      }
    });
    const contact = computed(() => {
      return multiSign.generateContact(acc.address,acc.name)
    });
     const splitBalance = computed(()=>{
      let split = accountBalance.value.split(".")
      if (split[1]!=undefined){
        return {left:split[0],right:split[1]}
      }else{
        return {left:split[0], right:null}
      }
    })
    const disableSend = computed(() => !(
      !isMultisig.value && !onPartial.value && passwd.value.match(passwdPattern) && coSign.value.length > 0  &&  (err.value == '' || (err.value == t('scriptvalues.walletpasswordvalidation',{name : walletState.currentLoggedInWallet.name}))) && (showAddressError.value.every(value => value == false)) == true && (numDeleteUser.value > 0) && (numApproveTransaction.value > 0)
    ));
    const addCoSigButton = computed(() => {
      var status = false;
      if(acc.balance >= 10.0445 && !onPartial.value){
        for(var i = 0; i < coSign.value.length; i++){
          if(showAddressError.value[i] != ''){
            status = true;
            break;
          }else if(coSign.value[i].length < 40){
            status = true;
            break;
          }
        }
        
      }else{
        status = true;
      }
      return status;
    });
    const clear = () => {
      coSign.value = [];
      selectedAddresses.value = [];
      showAddressError.value = [];
      passwd.value = '';
      numApproveTransaction.value = 1;
      maxNumApproveTransaction.value = 0;
      numDeleteUser.value = 1;
      maxNumDeleteUser.value = 0;
    };
    const convertAccount = async() => {
      let convertstatus = await multiSign.convertAccount(coSign.value, numApproveTransaction.value, numDeleteUser.value, acc.name, passwd.value);
      if(!convertstatus){
        err.value = t('scriptvalues.walletpasswordvalidation',{name : walletState.currentLoggedInWallet.name});
      }else{
        // transaction made
        err.value = '';
        // toggleAnounceNotification.value = true;
        // var audio = new Audio(require('@/assets/audio/ding.ogg'));
        // audio.play();
        clear();
      } 
    };
    watch(() => [...coSign.value], (n) => {
      for(var i = 0; i < coSign.value.length; i++){
        if((coSign.value[i].length == 64) || (coSign.value[i].length == 46) || (coSign.value[i].length == 40)){
          checkCosign(i)
          if(coSign.value[i]==acc.address || coSign.value[i]==Helper.createAddress(acc.address).pretty() || coSign.value[i]==acc.publicKey ){
            showAddressError.value[i] = true;
            err.value = "Cosigner cannot be this account itself"
          }
          else if(!coSign.value[i].match(publicKeyPattern) && (coSign.value[i].length == 64)){
            showAddressError.value[i] = true;
          }else if(!coSign.value[i].match(addressPatternLong) && (coSign.value[i].length == 46)){
            showAddressError.value[i] = true;
          }else if(!coSign.value[i].match(addressPatternShort) && (coSign.value[i].length == 40)){
            showAddressError.value[i] = true;
          }else{
            showAddressError.value[i] = false;
            const unique = Array.from(new Set(n));
            if(unique.length != n.length){
              err.value = t('scriptvalues.cosignerexists');
            }else{
              err.value = '';
            }
          }
        }else{
          showAddressError.value[i] = true;
        }
      }
    }, {deep:true});

    watch(() => [...showAddressError.value], (n) => {
      if(n.every(value=>value==false)){
        updateAggregateFee()
      }
      
    }, {deep:true});
    
    
 
    const addCoSig = () => {
      coSign.value.push('');
      // addresses.value.push('');
      showAddressError.value.push(false);
      maxNumApproveTransaction.value += 1;
      maxNumDeleteUser.value += 1;
    };
    const deleteCoSigAddressInput = (i) => {
     /*  console.log('Delete index: ' + i); */
      if(maxNumApproveTransaction.value > 0){
        maxNumApproveTransaction.value -= 1;
      }
      if(maxNumDeleteUser.value > 0){
        maxNumDeleteUser.value -= 1;
      }
      if(numDeleteUser.value > maxNumDeleteUser.value){
        numDeleteUser.value = maxNumDeleteUser.value;
      }
      if(numApproveTransaction.value > maxNumApproveTransaction.value){
        numApproveTransaction.value = maxNumApproveTransaction.value;
      }
      coSign.value.splice(i, 1);
      contactName.value.splice(i, 1)
     /*  console.log(coSign.value) */
      selectedAddresses.value.splice(i, 1);
      showAddressError.value.splice(i,1)
    }
    const validateApproval = (e) => {
      if((numApproveTransaction.value * 10*(~~(maxNumApproveTransaction.value/10)) + e.charCode - 48) > maxNumApproveTransaction.value){
        e.preventDefault();
      }
    }
    let deleteUserErrorMsg = 'Number of cosignatories for deletion approval is more than number of cosignatories for this account';
    let approveTransactionErrMsg = 'Number of cosignatories for transaction approval is more than number of cosignatories for this account';
    watch(numApproveTransaction, (n) => {
      updateAggregateFee()
      if(maxNumApproveTransaction.value == 0 && n > 1){
        err.value = approveTransactionErrMsg;
      }else if((n > maxNumApproveTransaction.value) && (n !=1 && maxNumApproveTransaction.value != 0 )){
        err.value = approveTransactionErrMsg;
      }else if(maxNumApproveTransaction.value>0 && n<=0){
        err.value = "Number of cosignatories for transaction approval cannot be less than 1"
      }else{
        // check again for num delete user
        if((numDeleteUser.value > maxNumDeleteUser.value) && (numDeleteUser.value !=1 && maxNumDeleteUser.value != 0 )){
          err.value = deleteUserErrorMsg;
        }else{
          err.value = '';
        }
      }
    });
    const validateDelete = (e) => {
      if((numDeleteUser.value * 10*(~~(maxNumDeleteUser.value/10)) + e.charCode - 48) > maxNumDeleteUser.value){
        e.preventDefault();
      }
    }
    watch(numDeleteUser, (n) => {
      updateAggregateFee()
      if(maxNumDeleteUser.value == 0 && n > 1){
        err.value = deleteUserErrorMsg;
      }else if((n > maxNumDeleteUser.value) && (n !=1 && maxNumDeleteUser.value != 0 )){
        err.value = deleteUserErrorMsg;
      }else if(maxNumDeleteUser.value>0 && n<=0){
        err.value = "Number of cosignatories for deletion approval cannot be less than 1"
      }else{
        // check again for num approval transaction
        if((numApproveTransaction.value > maxNumApproveTransaction.value) && (numApproveTransaction.value !=1 && maxNumApproveTransaction.value != 0 )){
          err.value = approveTransactionErrMsg;
        }else{
          err.value = '';
        }
      }
    });
    const disabledPassword = computed(() => (onPartial.value || isMultisig.value ));
   
    setTimeout(()=> {
      if(accountBalance.value < 10.0445){
        fundStatus.value = true;
      }else{
        fundStatus.value = false;
      }
    }, 500);
    watch(accountBalance, (n) => {
      if(n < 10.0445){
        fundStatus.value = true;
      }else{
        fundStatus.value = false;
      }
    });
    // check if onPartial
    multiSign.onPartial(PublicAccount.createFromPublicKey(acc.publicKey,networkState.currentNetworkProfile.network.type)).then(verify=>
      onPartial.value = verify
    )
    
    const checkCosign = (index) =>{
      if (coSign.value[index].length == 40 || coSign.value[index].length == 46) {
        try {
          multiSign.verifyContactPublicKey(coSign.value[index]).then(result=>{
            if(result.status==false){
              showAddressError.value[index] = true
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
    
    // check if this address has cosigner
    emitter.on('ADD_CONTACT_COSIGN', payload => {
      multiSign.verifyContactPublicKey(payload.address).then((res)=>{
        if(res.status){
          // add into cosig
          coSign.value[payload.index] = res.publicKey;
          selectedAddresses.value.push(payload.address);
        }else{
          // display warning
          setTimeout(()=> {
            emitter.emit('NOTIFICATION', {
              status: true,
              message: t('scriptvalues.publickeyvalidation'),
              notificationType: 'warn'
            });
          }, 500);
        }
      });
    });
    return {
      networkState,
      toggleContact,
      contact,
      space,
      currentNativeTokenName,
      splitBalance,
      contactName,
      err,
      disableSend,
      numApproveTransaction,
      numDeleteUser,
      maxNumApproveTransaction,
      maxNumDeleteUser,
      fundStatus,
      accountNameDisplay,
      accountName,
      acc,
      passwd,
      showPasswdError,
      showAddressError,
      addCoSig,
      coSign,
      addCoSigButton,
      deleteCoSigAddressInput,
      selectedAddresses,
      clear,
      convertAccount,
      disabledPassword,
      onPartial,
      isMultisig,
      passwdPattern,
      validateApproval,
      validateDelete,
      lockFundCurrency,
      lockFundTxFee,
      aggregateFee,
      totalFee
    };
  },
}
</script>
<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>