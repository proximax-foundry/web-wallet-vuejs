<template>
<div class="flex justify-between text-sm">
  <div><span class="text-gray-400">Accounts > Multisign ></span> <span class="text-blue-primary font-bold">Edit multisig Account</span></div>
  <div>
    <router-link to="/view-all-accounts" class="font-bold" active-class="accounts">View All Accounts</router-link>
  </div>
</div>
<div class='mt-2 py-3 gray-line'>
  <div class="container mx-auto text-center">
    <div class="mx-auto pt-5 lg:px-20">
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-8 items-center">
        <div class="text-left w-full relative">
          <div class="flex justify-between">
            <div class="inline-block">
              <div class="text-xs font-bold mb-1">{{ accountNameDisplay }}</div>
              <div>{{ acc.address }}</div>
              <div class="text-tsm mt-5" v-if="getWalletCosigner().list.length">Cosigner in this wallet:
                <span class="font-bold" v-if="getWalletCosigner().list.length == 1">{{ getWalletCosigner().list[0].name }}</span>
                <span class="font-bold" v-else><select v-model="cosignAddress"><option v-for="(element, item) in getWalletCosigner().list" value="element.address" :key="item">{{ element.name }}</option></select></span>
              </div>
            </div>
            <div class="inline-block">
              <MultisigSchemeModal :multiSigAccount="acc" class="inline-block mr-3" />
              <img src="../assets/img/icon-collapse-accordion-button.svg" class="w-6 h-6 inline-block cursor-pointer" @click="showCosigners = !showCosigners" v-if="!showCosigners">
              <img src="../assets/img/icon-expand-accordion-button.svg" class="w-6 h-6 inline-block" :class="`${(removeCosign.length==0)?'cursor-pointer':'cursor-auto'}`" @click="(removeCosign.length==0)?(showCosigners = !showCosigners):''" v-else>
            </div>
          </div>
          <transition name="slide">
            <div v-if="showCosigners">
              <div class="text-center text-md mb-5">Cosignatory for this account</div>
              <div v-for="(cosigner, index) in acc.isMultisign.cosignatories" :key="index" class="mb-2 rounded-2xl px-5 py-3 flex justify-between" :class="`${(checkRemoval(cosigner.publicKey))?'bg-yellow-100':'bg-white'}`">
                <div>
                  <div class="font-bold" v-if="wallet.accounts.find((element) => element.publicAccount.publicKey == cosigner.publicKey)">{{ wallet.accounts.find((element) => element.publicAccount.publicKey == cosigner.publicKey).name }} <span v-if="checkRemoval(cosigner.publicKey)" class="font-normal text-xs text-gray-500">(Removing)</span></div>
                  <div class="font-bold" v-else>Consigner-{{ cosigner.address.address.substr(-4) }} <span v-if="checkRemoval(cosigner.publicKey)" class="font-normal text-xs text-gray-500">(Removing)</span></div>
                  <div class="text-tsm">{{ cosigner.publicKey }}</div>
                </div>
                <font-awesome-icon v-if="(!checkRemoval(cosigner.publicKey))" icon="trash-alt" class="w-4 h-4 self-center" :class="`${(onPartial || fundStatus || !isCoSigner)?'text-gray-200 cursor-auto':'text-gray-400 hover:text-gray-600 cursor-pointer'}`" @click="addToRemovalList(cosigner.publicKey)"></font-awesome-icon>
                <a v-else class="self-center text-gray-400 hover:text-gray-600" href="#" @click="restoreFromRemovalList(cosigner.publicKey)"><font-awesome-icon icon="trash-restore" class="inline-block w-4 h-4"></font-awesome-icon> <span class="text-xs">Restore</span></a>

              </div>
            </div>
          </transition>
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
      <div class="flex justify-between p-4 rounded-xl bg-red-100 mb-8" v-if="!isCoSigner">
        <div class="text-center w-full">
          <div class="border border-gray-500 rounded-full w-8 h-8 inline-block relative">
            <font-awesome-icon icon="times" class="w-5 h-5 text-gray-500 inline-block absolute" style="top:5px; right: 5px;"></font-awesome-icon>
          </div>
          <div class="font-bold text-sm">You are not a consigner of the account</div>
          <p class="text-xs mt-3">Requires a valid cosigner to edit this account.</p>
        </div>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8" v-if="onPartial && isCoSigner">
        <div class="text-center w-full">
          <div class="w-8 h-8 inline-block relative">
            <font-awesome-icon icon="bell" class="w-5 h-5 text-yellow-500 inline-block absolute" style="top:5px; right: 5px;"></font-awesome-icon>
          </div>
          <div class="font-bold text-sm">Partial</div>
          <p class="text-xs mt-3">Has transactions in partial</p>
        </div>
      </div>
      <div class="mt-16">
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <div v-for="(coSignAddress, index) in coSign" :key="index" class="flex">
          <font-awesome-icon icon="trash-alt" class="w-4 h-4 text-gray-500 hover:text-gray-400 cursor-pointer mr-3 mt-3" @click="deleteCoSigAddressInput(index)"></font-awesome-icon>
          <TextInput placeholder="Cosignatory Account Address or Public Key" errorMessage="Valid Cosignatory Account Address or Public Key is required" :showError="showAddressError[index]" v-model="coSign[index]" icon="key" class="flex-grow" />
          <add-cosign-modal :cosignPublicKeyIndex="index" :selectedAddress="selectedAddresses"></add-cosign-modal>
        </div>
        <div class="text-lg" v-if="!coSign.length">Add at least 1 consignatories</div>
        <button class="my-8 hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none disabled:opacity-50 disabled:cursor-auto" @click="addCoSig" :disabled="addCoSigButton">(+) Add cosignatory</button>
      </div>
      <div class="mb-10">
        <div class="block mt-2 font-bold text-md lg:inline-block lg:mr-20">Scheme for ></div>
        <div class="mt-2 lg:inline-block lg:mr-20">
          <span class="font-bold">Approve transactions:</span>
          <div class="ml-2 border rounded-2xl p-2 py-2 inline-block">
            <input type="number" required min="0" :max="maxNumApproveTransaction" v-model="numApproveTransaction" class="text-right outline-none">
          </div> of {{ maxNumApproveTransaction }} cosignatories</div>
        <div class="mt-2 lg:inline-block">
          <span class="font-bold">Delete users:</span>
          <div class="ml-2 border rounded-2xl p-2 py-2 inline-block">
            <input type="number" required min="0" :max="maxNumDeleteUser" v-model="numDeleteUser" class="text-right outline-none">
          </div> of {{ maxNumDeleteUser }} cosignatories</div>
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
        <button type="submit" class="default-btn py-1 disabled:opacity-50" @click="modifyAccount()" :disabled="disableSend">Send</button>
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
import MultisigSchemeModal from '@/components/MultisigSchemeModal.vue';
import { transferEmitter } from '../util/listener.js';

export default {
  name: 'ViewEditAccountMultisig',
  components: {
    FontAwesomeIcon,
    PasswordInput,
    TextInput,
    AddCosignModal,
    NotificationModal,
    MultisigSchemeModal,
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
    const removeCosign = ref([]);
    const selectedAddresses = ref([]);
    const showAddressError = ref([]);
    const toggleAnounceNotification = ref(false);
    const onPartial = ref(false);
    const isMultisig = ref(false);
    const showCosigners = ref(false);
    const cosignAddress = ref('');

    const disableSend = computed(() => !(
      isMultisig.value && !onPartial.value && passwd.value.match(passwdPattern) && coSign.value.length > 0  &&  err.value == '' && (showAddressError.value.indexOf(true) == -1) && (numDeleteUser.value > 0) && (numApproveTransaction.value > 0)
    ));

    const disabledPassword = computed(() => !(!onPartial.value && isMultisig.value && !fundStatus.value && isCoSigner.value));

    const addCoSigButton = computed(() => {
      var status = false;
      if(accountBalance() >= 10.0445 && isCoSigner.value){
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

    const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
    const isCoSigner = computed(() => {
      const currentAccount = getAcccountDetails();
      let isCoSig = false;
      currentAccount.isMultisign.cosignatories.forEach((cosigner) => {
        if(wallet.accounts.findIndex((element) => element.address == cosigner.address.address) > -1 ){
          isCoSig = true;
        }
      });
      return isCoSig;
    })

    const clear = () => {
      coSign.value = [];
      selectedAddresses.value = [];
      showAddressError.value = [];
      passwd.value = '';
      numApproveTransaction.value = acc.isMultisign.minApproval;
      maxNumApproveTransaction.value = acc.isMultisign.cosignatories.length;
      numDeleteUser.value = acc.isMultisign.minRemoval;
      maxNumDeleteUser.value = acc.isMultisign.cosignatories.length;
    };

    const modifyAccount = () => {
      console.log(removeCosign.value);
      // get cosign address
      let cosigner = getWalletCosigner();
      let cosignerAdd;
      if(cosigner.length > 1){
        cosignerAdd = cosignAddress.value;
      }else{
        cosignerAdd = cosigner.list[0].address;
      }

      let modifyStatus = multiSign.modifyMultisigAccount(coSign.value, removeCosign.value, numApproveTransaction.value, numDeleteUser.value, cosignerAdd, acc, passwd.value);
      console.log(modifyStatus);
      // if(!modifyStatus){
      //   err.value = 'Invalid wallet password';
      // }else{
      //   // transaction made
      //   err.value = '';
      //   toggleAnounceNotification.value = true;
      //   var audio = new Audio(require('@/assets/audio/ding.ogg'));
      //   audio.play();
      //   clear();
      // }
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

    const getAcccountDetails = () => {
      return appStore.getAccDetails(p.name);
    };

    const accountBalance = () => {
      return appStore.getAccDetails(p.name).balance;
    };

    const addCoSig = () => {
      coSign.value.push('');
      // addresses.value.push('');
      showAddressError.value.push(false);
      // maxNumApproveTransaction.value += 1;
      // maxNumDeleteUser.value += 1;
    };

    const deleteCoSigAddressInput = (i) => {
      // maxNumApproveTransaction.value -= 1;
      // maxNumDeleteUser.value -= 1;
      // if(numDeleteUser.value > maxNumDeleteUser.value){
      //   numDeleteUser.value = maxNumDeleteUser.value;
      // }

      // if(numApproveTransaction.value > maxNumApproveTransaction.value){
      //   numApproveTransaction.value = maxNumApproveTransaction.value;
      // }
      coSign.value.splice(i, 1);
      selectedAddresses.value.splice(i, 1);
    }

    // add cosigner to remove list
    const addToRemovalList = (publicKey) => {
      if(!onPartial.value && !fundStatus.value && isCoSigner.value){
        removeCosign.value.push(publicKey);
        console.log('Add to removal list: ' + publicKey);
      }
    };

    const checkRemoval = (publicKey) => {
      let verify = false;
      if(removeCosign.value.length > 0){
        removeCosign.value.forEach((element) => {
          if(element == publicKey){
            verify = true;
          }
        });
      }
      return verify;
    };

    const restoreFromRemovalList = (publicKey) => {
      const index = removeCosign.value.indexOf(publicKey);
      if (index > -1) {
        removeCosign.value.splice(index, 1);
      }
    }

    const getWalletCosigner = () => {
      return multiSign.fetchMultiSigCosigners(acc.address)
    }

    // get account details
    const acc = getAcccountDetails();
    maxNumDeleteUser.value = acc.isMultisign.cosignatories.length;
    maxNumApproveTransaction.value = acc.isMultisign.cosignatories.length;
    numApproveTransaction.value = acc.isMultisign.minApproval;
    numDeleteUser.value = acc.isMultisign.minRemoval;

    if(acc==-1 && acc.default){
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

    // detech partial transaction announcement from listener
    transferEmitter.on('ANNOUNCE_AGGREGATE_BONDED' , payload => {
      if(payload.status){
        multiSign.onPartial(acc.publicAccount).then((onPartialBoolean) => {
          onPartial.value = onPartialBoolean;
        })
        clear();
      }
    });

    // detech co signiture added from listener
    transferEmitter.on('ANNOUNCE_COSIGNITURE_ADDED' , payload => {
      if(payload.status){
        if(acc.isMultisign != null){
          isMultisig.value = true;
          onPartial.value = false;
        }else{
          isMultisig.value = false;
        }
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
      modifyAccount,
      disabledPassword,
      toggleAnounceNotification,
      onPartial,
      isMultisig,
      isCoSigner,
      showCosigners,
      wallet,
      removeCosign,
      addToRemovalList,
      restoreFromRemovalList,
      checkRemoval,
      getWalletCosigner,
      cosignAddress,
    };
  },
}
</script>
<style scoped lang="scss">
.slide-enter-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
   -moz-transition-timing-function: ease-in-out;
   -webkit-transition-timing-function: ease-in-out;
   -o-transition-timing-function: ease-in-out;
   transition-timing-function: ease-in-out;
}

.slide-leave-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave-from {
   max-height: 1000px;
   overflow: hidden;
}

.slide-enter-from, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}

select{
  min-width: 150px;
  padding: 5px;
}

</style>