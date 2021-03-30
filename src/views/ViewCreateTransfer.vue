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
              <div :key="item.address" :i="index" v-for="(item, index) in accounts" class="p-2 cursor-pointer" :class="item.name==selectedAccName?'bg-blue-primary text-white font-bold':'text-gray-800 bg-gray-50'" @click="changeSelection(item)" :title="'Address is ' + item.addressraw">
                <div>{{ item.name }}</div>
              </div>
            </div>
            </transition>
            <input type="hidden" v-model="currentSelectedName">
          </div>
          <SelectInput v-if="showContactSelection" placeholder="Contact" errorMessage="" v-model="selectContact" :options="contact" @default-selected="selectContact=0" @show-selection="updateAdd" />
          <div class="flex">
            <div class="flex-grow mr-5">
              <TextInput placeholder="Recipient" errorMessage="Invalid Recipient" :showError="showAddressError" v-model="recipient" icon="wallet" />
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
            <div class="inline-block mr-4 text-tsm"><img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1">Balance: <span class="text-xs">{{ balance }} XPX</span></div>
          </div>
          <SendInput v-model="sendXPX" placeholder="Enter Amount" type="text" icon="coins" :showError="showBalanceErr" errorMessage="Insufficient balance" :options="{ currency: 'USD', precision: 6, autoDecimalMode:true, distractionFree: false, allowNegative: false }" class="mt-5" />
        </div>
        <div>
          <button class="mb-5 hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none disabled:opacity-50" :disabled="addMosaicsButton">(+) Add Mosaics</button>
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
        <TextareaInput placeholder="Message" errorMessage="Invalid message" v-model="messageText" icon="comment" class="mt-5" :msgOpt="msgOption" />
        <div class="rounded-2xl bg-gray-100 p-5 mb-5">
          <div class="inline-block mr-4 text-xs"><img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500">Unconfirmed/Recommended Fee:  0.042750 XPX</div>
        </div>
        <PasswordInput placeholder="Enter Your Wallet Password" :errorMessage="'Please enter your wallet ' + appStore.state.currentLoggedInWallet.name + '\'s password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">Clear</button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate">Create</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>
import { computed, ref, inject, getCurrentInstance, watch } from 'vue';
// import { useRouter } from "vue-router";
import TextInput from '@/components/TextInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import SelectInput from '@/components/SelectInput.vue';
import SendInput from '@/components/SendInput.vue';
import TextareaInput from '@/components/TextareaInput.vue';


export default {
  name: 'ViewCreateAccount',
  components: {
    TextInput,
    PasswordInput,
    SelectInput,
    SendInput,
    TextareaInput,
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

    const addressPattern = "^[0-9A-Za-z-]{40,46}$";
    const showAddressError = computed(()=>{
      if(recipient.value != ''){
        if(recipient.value.match(addressPattern)){
          return false;
        }else{
          return true;
        }
      }else{
        return false;
      }
    });

    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const disableCreate = computed(() => !(
      walletPassword.value.match(passwdPattern)
    ));
    // get balance
    const selectedAccName = ref(appStore.getFirstAccName());
    const selectedAccAdd = ref(appStore.getFirstAccAdd());
    // const balance = ref(appStore.getFirstAccBalance());
    const balance = ref('0.000000');
    balance.value = appStore.getFirstAccBalance();
    if(balance.value == '0.000000'){
      showBalanceErr.value = true;
    }

    const accounts = computed( () => appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts);
    const sendXPX = ref('0.000000');
    const moreThanOneAccount = computed(()=> (appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts.length > 1)?true:false);

    const changeSelection = (i) => {
      selectedAccName.value = i.name;
      selectedAccAdd.value = i.addressraw;
      balance.value = i.balance;
      (balance.value==0)?showBalanceErr.value = true:showBalanceErr.value = false;
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;
    }

    const encryptedMsgDisable = ref(true);

    const addMosaicsButton = computed(() => {
      return true;
    });

    const contact = computed(() => {
      return appStore.getContact();
    });

    const clearInput = () => {
      walletPassword.value = '';
      emitter.emit("CLEAR_SELECT", 0);
    };

    const clearMsg = () => {
      messageText.value = '';
      emitter.emit("CLEAR_TEXTAREA", 0);
    }

    const updateAdd = (e) => {
      recipient.value = e;
    };

    watch(recipient, (add) => {
      if(add.match(addressPattern)){
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

    return {
      appStore,
      moreThanOneAccount,
      showMenu,
      currentSelectedName,
      selectedAccName,
      selectedAccAdd,
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
    }
  },

}
</script>
<style scoped lang="scss">

.slide-enter-active {
   -moz-transition-duration: 1.5s;
   -webkit-transition-duration: 1.5s;
   -o-transition-duration: 1.5s;
   transition-duration: 1.5s;
   -moz-transition-timing-function: ease-in;
   -webkit-transition-timing-function: ease-in;
   -o-transition-timing-function: ease-in;
   transition-timing-function: ease-in;
}

.slide-leave-active {
   -moz-transition-duration: 1.5s;
   -webkit-transition-duration: 1.5s;
   -o-transition-duration: 1.5s;
   transition-duration: 1.5s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave {
   max-height: 100px;
   overflow: hidden;
}

.slide-enter, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}
</style>
