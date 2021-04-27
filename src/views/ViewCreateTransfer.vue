<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">Transfer ></span> <span class="text-blue-primary font-bold">Make a Transaction</span></div>
    <div>
      <!-- <router-link to="/select-type-creation-account" class="font-bold">Back to Services</router-link> -->
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center'>
    <form @submit.prevent="create" class="mt-10">
      <fieldset class="w-full">
        <div class="mb-5 border-b border-gray-200">
          <div class="error error_box" v-if="err!=''">{{ err }}</div>
          <div v-if="moreThanOneAccount" class="text-left p-4">
            <div class="mb-1 cursor-pointer z-20 border-b border-gray-200" @click="showMenu = !showMenu">
              <div class="font-bold text-xs">{{ selectedAccName }}</div>
              <div class="text-gray-400 mt-1 text-sm ">{{ selectedAccAdd }}</div>
            </div>
            <transition name="slide">
            <div v-if="showMenu" class="z-10">
              <div :key="item.address" :i="index" v-for="(item, index) in accounts" class="p-2 cursor-pointer" :class="item.name==selectedAccName?'bg-blue-primary text-white font-bold':'text-gray-800 bg-gray-50 optionDiv'" @click="changeSelection(item)" :title="'Address is ' + item.address">
                <div>{{ item.name }}</div>
              </div>
            </div>
            </transition>
            <input type="hidden" v-model="currentSelectedName">
          </div>
          <SelectInput v-if="showContactSelection" placeholder="Contact" errorMessage="" v-model="selectContact" :options="contact" @default-selected="selectContact=0" @show-selection="updateAdd" />
          <div class="flex">
            <div class="flex-grow mr-5">
              <TextInput placeholder="Recipient" :errorMessage="addressErrorMsg" :showError="showAddressError" v-model="recipient" icon="wallet" />
            </div>
            <div class="flex-none">
              <div class="rounded-full bg-gray-300 w-14 h-14 cursor-pointer relative" style="top: -5px;" @click="showContactSelection = !showContactSelection">
                <font-awesome-icon icon="id-card-alt" class="h-20 w-20 inline text-blue-primary absolute" style="top:-12px; left: 19px;"></font-awesome-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="text-left p-3 pb-0 border-l-8 border-gray-100">
          <div class="bg-gray-100 rounded-2xl p-3">
            <div class="inline-block mr-4 tfaddext-tsm"><img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1">Balance: <span class="text-xs">{{ appStore.getFirstAccBalance(selectedAccAdd) }} XPX</span></div>
          </div>
          <SupplyInput v-model="sendXPX" title="Send" :balance="Number(appStore.getFirstAccBalance(selectedAccAdd))" placeholder="Enter Amount" type="text" icon="coins" :showError="showBalanceErr" errorMessage="Insufficient balance" :decimal="6" class="mt-5" />
        </div>
        <div v-for="(mosaic, index) in mosaicsCreated" :key="index">
          <MosaicInput placeholder="Select mosaic" errorMessage="" v-model="selectedMosaic[index].id" :index="index" :options="mosaics" :disableOptions="selectedMosaic" @show-mosaic-selection="updateMosaic" @remove-mosaic-selected="removeMosaic" />
          <SupplyInput v-if="selectedMosaic[index].id!=0" v-model="selectedMosaic[index].amount" :balance="getSelectedMosaicBalance[index]" placeholder="Enter Amount" type="text" icon="coins" :showError="showBalanceErr" errorMessage="Insufficient balance" :decimal="mosaicSupplyDivisibility[index]" />
        </div>
        <div>
          <button class="mb-5 hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none disabled:opacity-50" :disabled="addMosaicsButton" @click="displayMosaicsOption">(+) Add Mosaics</button>
        </div>
        <div class="mb-5 border-t pt-4 border-gray-200">
          <div class="rounded-2xl bg-gray-100 p-5">
            <input id="regularMsg" type="radio" name="msgOption" value="regular" v-model="msgOption" @change="clearMsg()" /><label for="regularMsg" class="cursor-pointer font-bold ml-4 mr-5">Regular</label>
            <input id="hexMsg" type="radio" name="msgOption" value="hex" v-model="msgOption" @change="clearMsg()" /><label for="hexMsg" class="cursor-pointer font-bold ml-4">Hexadecimal</label>
          </div>
        </div>
        <div class="mb-5" v-if="!encryptedMsgDisable">
          <div class="rounded-2xl bg-gray-100 p-5">
            <input id="encryptedMsg" type="checkbox" value="encryptedMsg" v-model="encryptedMsg" /><label for="encryptedMsg" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">Encrypted</label>
          </div>
        </div>
        <TextareaInput placeholder="Message" errorMessage="" v-model="messageText" icon="comment" class="mt-5" :msgOpt="msgOption" />
        <div class="rounded-2xl bg-gray-100 p-5 mb-5">
          <div class="inline-block mr-4 text-xs"><img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Unconfirmed/Recommended Fee:  0.042750 XPX</div>
        </div>
        <PasswordInput placeholder="Enter Your Wallet Password" :errorMessage="'Please enter your wallet ' + appStore.state.currentLoggedInWallet.name + '\'s password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">Clear</button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate" @click="makeTransfer();">Create</button>
        </div>
      </fieldset>
    </form>
    <AddContactModal :toggleModal="togglaAddContact" :saveAddress="recipient" />
    <NotificationModal :toggleModal="toggleAnounceNotification" msg="Unconfirmed transaction" notiType="noti" time='2500' />
    <ConfirmSendModal :toggleModal="toggleConfirm" />
  </div>
</template>
<script>
import { computed, ref, inject, getCurrentInstance, watch } from 'vue';
import TextInput from '@/components/TextInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInput from '@/components/SelectInput.vue';
import MosaicInput from '@/components/MosaicInput.vue';
import SupplyInput from '@/components/SupplyInput.vue';
import TextareaInput from '@/components/TextareaInput.vue';
import { makeTransaction } from '../util/transfer.js'; //getMosaicsAllAccounts
import AddContactModal from '@/components/AddContactModal.vue';
import NotificationModal from '@/components/NotificationModal.vue';
import ConfirmSendModal from '@/components/ConfirmSendModal.vue';
import { verifyAddress } from '../util/functions.js';

export default {
  name: 'ViewCreateAccount',
  components: {
    TextInput,
    PasswordInput,
    MosaicInput,
    SelectInput,
    SupplyInput,
    TextareaInput,
    AddContactModal,
    NotificationModal,
    ConfirmSendModal,
  },

  setup(){
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const showContactSelection = ref(false);
    const showBalanceErr = ref(false);
    const selectContact = ref("0");
    const recipient = ref('');
    const msgOption = ref('regular');
    const messageText = ref('');
    const walletPassword = ref('');
    const err = ref('');
    const showMenu = ref(false);
    const encryptedMsg = ref('');
    const currentSelectedName = ref('');
    const togglaAddContact = ref(false);
    const toggleAnounceNotification = ref(false);
    const selectedMosaic = ref([]);
    const mosaicsCreated = ref([]);
    const mosaicsSelected = ref([]);
    const selectedMosaicAmount = ref([]);
    const mosaicSupplyDivisibility = ref([]);
    const currentlySelectedMosaic = ref([]);
    const sendXPX = ref('0.000000');
    const encryptedMsgDisable = ref(true);
    const toggleConfirm = ref(false);
    const forceSend = ref(false);

    const addressPatternShort = "^[0-9A-Za-z]{40}$";
    const addressPatternLong = "^[0-9A-Za-z-]{46}$";

    const addMsg = ref('');
    const showAddressError = ref(false);
    const addressErrorMsg = computed(
      () => {
        let addErrDefault = 'Invalid Recipient';
        return addMsg.value?addMsg.value:addErrDefault;
      }
    );

    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern) && !showAddressError.value && recipient.value.length > 0
    ));

    // get balance
    const selectedAccName = ref(appStore.getFirstAccName());
    const selectedAccAdd = ref(appStore.getFirstAccAdd());
    const balance = ref(appStore.getFirstAccBalance(selectedAccAdd.value));

    const accounts = computed( () => appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts);
    const moreThanOneAccount = computed(()=> (appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts.length > 1)?true:false);

    const changeSelection = (i) => {
      selectedAccName.value = i.name;
      selectedAccAdd.value = i.address;
      balance.value = i.balance;
      (balance.value==0)?showBalanceErr.value = true:showBalanceErr.value = false;
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;

      // reset mosaic selection
      selectedMosaic.value = [];
      mosaicsCreated.value = [];
      selectedMosaicAmount.value = [];
      mosaicSupplyDivisibility.value = [];
    }

    // get mosaic info

    const contact = computed(() => {
      return appStore.getContact();
    });

    const clearInput = () => {
      selectContact.value = '0';
      walletPassword.value = '';
      recipient.value = '';
      encryptedMsgDisable.value = true;
      messageText.value = '';
      sendXPX.value = '0.000000';
      emitter.emit("CLEAR_SELECT", 0);
      selectedMosaic.value = [];
      mosaicsCreated.value = [];
      selectedMosaicAmount.value = [];
      mosaicSupplyDivisibility.value = [];
    };

    const clearMsg = () => {
      messageText.value = '';
      emitter.emit("CLEAR_TEXTAREA", 0);
    }

    // update select
    const updateAdd = (e) => {
      recipient.value = e;
    };

    const makeTransfer = () => {
      if(sendXPX.value == 0 && !forceSend.value){
        toggleConfirm.value = true;
      }else{
        console.log(recipient.value.toUpperCase() + ' : ' + walletPassword.value + ' : ' + selectedAccName.value + ' : ' + encryptedMsg.value)
        let transferStatus = makeTransaction(recipient.value.toUpperCase(), sendXPX.value, messageText.value, selectedMosaic.value, mosaicSupplyDivisibility.value, walletPassword.value, selectedAccName.value, encryptedMsg.value, appStore, siriusStore);
        if(!transferStatus){
          err.value = 'Invalid wallet password';
        }else{
          // transaction made
          err.value = '';
          // check if address is saved in the contact list
          // if not display add contact model
          if(!appStore.checkAvailableContact(recipient.value)){
            // add new contact
            togglaAddContact.value = true;
          }else{
            clearInput();
          }
          // shpw notification
          toggleAnounceNotification.value = true;
          // getMosaicsAllAccounts(appStore, siriusStore);
          // play notification sound
          var audio = new Audio(require('@/assets/audio/ding.ogg'));
          audio.play();
          forceSend.value = false;
        }
      }
    };

    const getSelectedMosaicBalance = (index) =>{
      let mosaic = appStore.getMosaicInfo(selectedAccAdd, selectedMosaic[index].id);
      if(mosaic!=undefined){
        return mosaic.amount;
      }else{
        return '0';
      }
    };

    // get mosaics of current selected account
    // getMosaicsAllAccounts(appStore, siriusStore);
    const addMosaicsButton = computed(() => {
      let mosaic = appStore.getAccDetails(selectedAccName.value).mosaic;
      if(mosaic != undefined){
        if((mosaic.length == 0) || (mosaicsCreated.value.length == mosaic.length)){
          return true;
        }else{
          return false;
        }
      }
      return true;
    });
    // generate mosaic selector
    const mosaics = computed(() => {
        var mosaicOption = [];
        if(appStore.getAccDetails(selectedAccName.value).mosaic.length > 0){
          appStore.getAccDetails(selectedAccName.value).mosaic.forEach((i, index)=>{
            mosaicOption.push({
              val: i.id,
              text: i.id + ' > Balance: ' + i.amount.toFixed(i.divisibility),
              id: (index + 1),
            });
          });
        }
        return mosaicOption;
    });

    const displayMosaicsOption = () => {
      mosaicsCreated.value.push(0);
      selectedMosaic.value.push({ id: 0, amount: "0" });
    };

    // update mosaic
    const updateMosaic = (e) => {
      // get mosaic info and format divisibility in supply input
      const mosaic = appStore.getMosaicInfo(selectedAccAdd.value, selectedMosaic.value[e.index].id);
      selectedMosaic.value[e.index].amount = '0';
      mosaicSupplyDivisibility.value[e.index] = mosaic.divisibility;
      emitter.emit('CLOSE_MOSAIC_INSUFFICIENT_ERR', false);
    };

    const removeMosaic = (e) => {
      mosaicsCreated.value.splice(e.index, 1);
      selectedMosaic.value.splice(e.index, 1);
      mosaicSupplyDivisibility.value.splice(e.index, 1);
    }

    watch(balance, (n) => {
      if(n == '0.000000'){
        showBalanceErr.value = true;
      }
    });

    watch(recipient, (add) => {
      if((recipient.value.length == 46 && recipient.value.match(addressPatternLong)) || (recipient.value.length == 40 && recipient.value.match(addressPatternShort))) {
        const verifyRecipientAddress = verifyAddress(appStore.getCurrentAdd(appStore.state.currentLoggedInWallet.name), recipient.value);
        showAddressError.value = !verifyRecipientAddress.isPassed.value;
        addMsg.value = verifyRecipientAddress.errMessage.value;
      }else{
        (recipient.value.length>0)?(showAddressError.value = true):(showAddressError.value = false);
      }

      // show and hide encrypted message option
      if(add.match(addressPatternLong) || add.match(addressPatternShort)){
        appStore.verifyRecipientInfo(recipient.value, siriusStore.accountHttp).then((res)=>{
          encryptedMsgDisable.value = res;
        });
      }else{
        encryptedMsgDisable.value = true;
      }
    });

    watch(currentSelectedName, (n, o) => {
      if(n!=o){
        recipient.value = '';
      }
    });

    emitter.on("CLOSE_MODAL", payload => {
      togglaAddContact.value = payload;
      clearInput();
    });

    emitter.on("CLOSE_NOTIFICATION", payload => {
      toggleAnounceNotification.value = payload;
    });

    // confirm modal
    emitter.on("CLOSE_CONFIRM_SEND_MODAL", payload => {
      toggleConfirm.value = payload;
    });

    emitter.on("CONFIRM_PROCEED_SEND", payload => {
      console.log('Force send: ' + payload);
      console.log('PW:' + walletPassword.value);
      if(payload){
        forceSend.value = payload;
        toggleConfirm.value = false;
        makeTransfer();
      }
    });

    return {
      appStore,
      moreThanOneAccount,
      showMenu,
      currentSelectedName,
      selectedAccName,
      selectedAccAdd,
      addressErrorMsg,
      showAddressError,
      balance,
      showBalanceErr,
      err,
      contact,
      recipient,
      sendXPX,
      messageText,
      msgOption,
      showContactSelection,
      selectContact,
      walletPassword,
      disableCreate,
      clearInput,
      showPasswdError,
      updateAdd,
      addMosaicsButton,
      clearMsg,
      accounts,
      changeSelection,
      encryptedMsgDisable,
      encryptedMsg,
      makeTransfer,
      togglaAddContact,
      toggleAnounceNotification,
      displayMosaicsOption,
      selectedMosaic,
      mosaicsCreated,
      mosaicsSelected,
      mosaics,
      selectedMosaicAmount,
      getSelectedMosaicBalance,
      mosaicSupplyDivisibility,
      updateMosaic,
      currentlySelectedMosaic,
      removeMosaic,
      toggleConfirm,
    }
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

.optionDiv:hover{
  background: #D9EBFF;
}
</style>
