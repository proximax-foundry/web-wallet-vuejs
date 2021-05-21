<template>
<div class="flex justify-between text-sm">
  <div><span class="text-gray-400">Accounts > Multisign ></span> <span class="text-blue-primary font-bold">Convert to Multisig Account</span></div>
  <div>
    <router-link :to="{name: 'ViewDisplayAllAccounts'}" class="font-bold" active-class="accounts">View All Accounts</router-link>
  </div>
</div>
<div class='mt-2 py-3 gray-line'>
  <div class="container mx-auto text-center">
    <div class="mx-auto pt-5 lg:px-20">
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-8 items-center">
        <div class="text-left w-full relative">
          <div class="text-xs font-bold mb-1">{{ accountNameDisplay }}</div>
          <div>{{ acc.address }}</div>
        </div>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-red-100 mb-8" v-if="fundStatus">
        <div class="text-center w-full">
          <div class="border border-gray-500 rounded-full w-8 h-8 inline-block relative">
            <font-awesome-icon icon="times" class="w-5 h-5 text-gray-500 inline-block absolute" style="top:5px; right: 5px;"></font-awesome-icon>
          </div>
          <div class="font-bold text-sm">Insufficient Balance</div>
          <p class="text-xs mt-3">10.044500 XPX required to cover LockFund.</p>
        </div>
      </div>
      <div class="flex justify-between p-4 rounded-xl border-red-800 border-2 bg-white mb-8" v-if="isMultisig">
        <div class="text-center w-full">
          <div class="border border-gray-500 rounded-full w-8 h-8 inline-block relative">
            <font-awesome-icon icon="times" class="w-5 h-5 text-gray-500 inline-block absolute" style="top:5px; right: 5px;"></font-awesome-icon>
          </div>
          <div class="font-bold text-sm">Is Multisig</div>
        </div>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8" v-if="onPartial">
        <div class="text-center w-full">
          <div class="w-8 h-8 inline-block relative">
            <font-awesome-icon icon="bell" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:5px; right: 5px;"></font-awesome-icon>
          </div>
          <div class="font-bold text-sm">Partial</div>
          <p class="text-xs mt-3">Has transactions in partial</p>
        </div>
      </div>
      <div>
        <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
        <div class="block mt-2 font-bold text-md lg:inline-block lg:mr-20">Scheme for ></div>
        <div class="mt-2 lg:inline-block lg:mr-20">
          <span class="font-bold">Approve transactions:</span>
          <div class="ml-2 border rounded-2xl p-2 py-2 inline-block">
            <input type="number" required min="0" :max="maxNumApproveTransaction" v-model="numApproveTransaction" class="text-right outline-none" @keypress="validateApproval">
          </div> of {{ maxNumApproveTransaction }} cosignatories</div>
        <div class="mt-2 lg:inline-block">
          <span class="font-bold">Delete users:</span>
          <div class="ml-2 border rounded-2xl p-2 py-2 inline-block">
            <input type="number" required min="0" :max="maxNumDeleteUser" v-model="numDeleteUser" class="text-right outline-none" @keypress="validateDelete">
          </div> of {{ maxNumDeleteUser }} cosignatories</div>
      </div>
      <div class="mt-16">
        <div v-for="(coSignAddress, index) in coSign" :key="index" class="flex">
          <font-awesome-icon icon="trash-alt" class="w-4 h-4 text-gray-500 hover:text-gray-400 cursor-pointer mr-3 mt-3" @click="deleteCoSigAddressInput(index)"></font-awesome-icon>
          <TextInput placeholder="Cosignatory Account Address or Public Key" errorMessage="Valid Cosignatory Account Address or Public Key is required" :showError="showAddressError[index]" v-model="coSign[index]" icon="key" class="flex-grow" />
          <AddCosignModal :cosignPublicKeyIndex="index" :selectedAddress="selectedAddresses" />
        </div>
        <div class="text-lg" v-if="!coSign.length">Add at least 1 cosignatories</div>
        <button class="my-8 hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none disabled:opacity-50  disabled:cursor-auto" @click="addCoSig" :disabled="addCoSigButton">(+) Add cosignatory</button>
      </div>
      <div class="p-4 rounded-xl bg-gray-100 my-2 w-full text-xs text-gray-800">
        <img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1"> Unconfirmed/Recommended Fee: 0.042750 XPX
      </div>
      <div class="p-4 rounded-xl bg-gray-100 mb-8 items-center w-full text-xs text-gray-800">
        <div class="text-center">
          <div class="inline-block">
            <div class="flex">
              <img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline-block mr-1 self-center">
              <div class="inline-block self-center text-left">
                <div>LockFund: 10.000000 XPX</div>
                <div>Unconfirmed/Recommended Fee: 0.044500 XPX</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PasswordInput placeholder="Enter Wallet Password" errorMessage="Wallet password is required to convert to MultiSig Account" :showError="showPasswdError" v-model="passwd" icon="lock" :disabled="disabledPassword" />
      <div class="mt-10">
        <button type="button" class="default-btn mr-5 focus:outline-none" @click="clear()">Clear</button>
        <button type="submit" class="default-btn py-1 disabled:opacity-50 disabled:cursor-auto" @click="convertAccount()" :disabled="disableSend">Send</button>
      </div>
    </div>
  </div>
  <NotificationModal :toggleModal="toggleAnounceNotification" msg="Unconfirmed transaction" notiType="noti" time='2500' />

</div>
</template>

<script>
import { computed, ref, inject, watch, getCurrentInstance } from 'vue';
import { useRouter } from "vue-router";
import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';
import PasswordInput from '@/components/PasswordInput.vue'
import TextInput from '@/components/TextInput.vue'
import AddCosignModal from '../components/AddCosignModal.vue';
import { multiSign } from '../util/multiSignatory.js';
import NotificationModal from '@/components/NotificationModal.vue';
import { transferEmitter } from '../util/listener.js';

export default {
  name: 'ViewConvertAccountMultisig',
  components: {
    FontAwesomeIcon,
    PasswordInput,
    TextInput,
    AddCosignModal,
    NotificationModal,
  },
  props: {
    name: String,
  },
  setup(p){
    const router = useRouter();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const err = ref(false);
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
    const selectedAddresses = ref([]);
    const showAddressError = ref([]);
    const toggleAnounceNotification = ref(false);
    const onPartial = ref(false);
    const isMultisig = ref(false);

    const disableSend = computed(() => !(
      !isMultisig.value && !onPartial.value && passwd.value.match(passwdPattern) && coSign.value.length > 0  &&  err.value == '' && (showAddressError.value.indexOf(true) == -1) && (numDeleteUser.value > 0) && (numApproveTransaction.value > 0)
    ));

    const addCoSigButton = computed(() => {
      var status = false;
      if(accountBalance() >= 10.0445 && !onPartial.value){
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

    const convertAccount = () => {
      let convertstatus = multiSign.convertAccount(coSign.value, numApproveTransaction.value, numDeleteUser.value, acc.name, passwd.value);
      if(!convertstatus){
        err.value = 'Invalid wallet password';
      }else{
        // transaction made
        err.value = '';
        toggleAnounceNotification.value = true;
        var audio = new Audio(require('@/assets/audio/ding.ogg'));
        audio.play();
        clear();
      }
    };

    emitter.on("CLOSE_NOTIFICATION", payload => {
      toggleAnounceNotification.value = payload;
    });

    watch(() => [...coSign.value], (n) => {
      for(var i = 0; i < coSign.value.length; i++){
        if((coSign.value[i].length == 64) || (coSign.value[i].length == 46) || (coSign.value[i].length == 40)){
          if(!coSign.value[i].match(publicKeyPattern) && (coSign.value[i].length == 64)){
            showAddressError.value[i] = true;
          }else if(!coSign.value[i].match(addressPatternLong) && (coSign.value[i].length == 46)){
            showAddressError.value[i] = true;
          }else if(!coSign.value[i].match(addressPatternShort) && (coSign.value[i].length == 40)){
            showAddressError.value[i] = true;
          }else{
            showAddressError.value[i] = false;

            const unique = Array.from(new Set(n));
            if(unique.length != n.length){
              err.value = "Cosigner already exist";
            }else{
              err.value = '';
            }
          }
        }else{
          showAddressError.value[i] = true;
        }
      }
    }, {deep:true});

    const accountBalance = () => {
      if(appStore.state.currentLoggedInWallet){
        return appStore.getAccDetails(p.name).balance;
      }
    };

    const addCoSig = () => {
      coSign.value.push('');
      // addresses.value.push('');
      showAddressError.value.push(false);
      maxNumApproveTransaction.value += 1;
      maxNumDeleteUser.value += 1;
    };

    const deleteCoSigAddressInput = (i) => {
      console.log('Delete index: ' + i);
      if(maxNumApproveTransaction.value > 1){
        maxNumApproveTransaction.value -= 1;
      }
      if(maxNumDeleteUser.value > 1){
        maxNumDeleteUser.value -= 1;
      }
      if(numDeleteUser.value > maxNumDeleteUser.value){
        numDeleteUser.value = maxNumDeleteUser.value;
      }

      if(numApproveTransaction.value > maxNumApproveTransaction.value){
        numApproveTransaction.value = maxNumApproveTransaction.value;
      }
      coSign.value.splice(i, 1);
      selectedAddresses.value.splice(i, 1);
    }

    const validateApproval = (e) => {
      if((~~(numApproveTransaction.value/10)) > (~~(maxNumApproveTransaction.value/10))){
        e.preventDefault();
      }else{
        if((numApproveTransaction.value * 10*(~~(maxNumApproveTransaction.value/10)) + e.charCode - 48) > maxNumApproveTransaction.value){
          e.preventDefault();
        }
      }
    }

     watch(numApproveTransaction, (n) => {
      if(n > maxNumApproveTransaction.value){
        err.value = 'Number of cosignatories for Approve transaction is more than number of cosignatories for this account';
      }else{
        err.value = '';
      }
    });

    const validateDelete = (e) => {
      if((~~(numDeleteUser.value/10)) > (~~(maxNumDeleteUser.value/10))){
        e.preventDefault();
      }else{
        if((numDeleteUser.value * 10*(~~(maxNumDeleteUser.value/10)) + e.charCode - 48) > maxNumDeleteUser.value){
          e.preventDefault();
        }
      }
    }

    watch(numDeleteUser, (n) => {
      if(n > maxNumDeleteUser.value){
        err.value = 'Number of cosignatories for Delete users is more than number of cosignatories for this account';
      }else{
        err.value = '';
      }
    });

    const disabledPassword = computed(() => (onPartial.value || isMultisig.value ));

    // get account details
    const acc =  appStore.getAccDetails(p.name);
    if(acc==-1){
      router.push({ name: "ViewDisplayAllAccounts"});
    }
    setTimeout(()=> {
      if(accountBalance() < 10.0445){
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
    multiSign.onPartial(acc.publicAccount).then((onPartialBoolean) => {
      onPartial.value = onPartialBoolean;
    });

    // check if this address has cosigner
    try{
      multiSign.checkIsMultiSig(acc.address).then((isMultiSigBoolean) => {
        isMultisig.value = isMultiSigBoolean;
      });
    }catch(err) {
      isMultisig.value = false;
    }

    emitter.on('ADD_CONTACT_COSIGN', payload => {
      multiSign.verifyContactPublicKey(payload.address, siriusStore.accountHttp).then((res)=>{
        if(res.status){
          // add into cosig
          coSign.value[payload.index] = res.publicKey;
          selectedAddresses.value.push(payload.address);
        }else{
          // display warning
          setTimeout(()=> {
            emitter.emit('NOTIFICATION', {
              status: true,
              message: 'Public key is not available for this address.',
              notificationType: 'warn'
            });
          }, 500);
        }
      });
    });

    // detect partial transaction announcement from listener
    transferEmitter.on('ANNOUNCE_AGGREGATE_BONDED' , payload => {
      if(payload.status && payload.address == acc.address){
        onPartial.value = true;
        clear();
      }
    });

    // detect co signiture added from listener
    transferEmitter.on('ANNOUNCE_COSIGNITURE_ADDED' , payload => {
      if(payload.status && payload.address == acc.address){
        isMultisig.value = true;
        onPartial.value = false;
      }else{
        isMultisig.value = false;
      }
    });

    return {
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
      toggleAnounceNotification,
      onPartial,
      isMultisig,
      passwdPattern,
      validateApproval,
      validateDelete,
    };
  },
}
</script>