<template>
  <div @click="showPanel = !showPanel" class="cursor-pointer flex justify-between mt-2 p-2 hover:bg-gray-100 text-tsm font-bold">{{ nameType }} 
    <font-awesome-icon icon="chevron-down" class="text-black w-4 h-4 mr-1 mt-1" v-if="!showPanel"></font-awesome-icon>
    <font-awesome-icon icon="chevron-up" class="text-black w-4 h-4 mr-1 mt-1" v-else></font-awesome-icon>
  </div>
  <transition name="slide">
    <div v-if="showPanel">
      <div style="max-height: 200px; overflow-y: scroll;" class="break-words p-2">
        <div class="subcontent">
          <div>
            <div class="text-green-600 font-bold" v-if="isReceived">{{$t('dashboard.transactionReceived')}}&nbsp;&nbsp;<img src="@/modules/dashboard/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg" class="w-4 h-4 inline-block"></div>
            <div class="text-red-500 font-bold" v-else>{{$t('dashboard.transactionSent')}}&nbsp;&nbsp;<img src="@/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg" class="w-4 h-4 inline-block"></div>
          </div>
          <div>
            <div>{{$t('common.type')}}:</div>
            <div>{{ innerTransaction.type }}</div>
          </div>
          <div v-if="amount > 0">
            <div>{{$t('common.amount')}}:</div>
            <div>{{ amount }} XPX</div>
          </div>
          <div>
            <div>{{$t('common.from')}}:</div><br>
            <div>{{ innerTransaction.signer.address.address }}</div>
          </div>
          <div>
            <div>{{$t('common.to')}}:</div><br>
            <div>{{ innerTransaction.recipient.address }}</div>
          </div>
          <div v-if="!innerTransaction.message.type && innerTransaction.message.payload != ''">
            <div>{{$t('common.message')}}:</div><br>
            <div>{{ innerTransaction.message.payload }}</div>
          </div>
          <div v-if="innerTransaction.message.type && innerTransaction.message.payload != ''">
            <div>{{$t('dashboard.encryptedMessage')}}:</div><br>
            <div v-if="isShowLogin && !isShowMessage && isReceived" class="w-full mt-2 bg-gray-100 p-3 pt-4 rounded-xl">
              <div class="error error_box mb-2 w-full" style="text-align: center" v-if="err!=''">{{ err }}</div>
              <!-- <TextInput v-if="validPublicKey" placeholder="Recipient Public Key" errorMessage="Recipient Public key required" v-model="recipientPublicKey" icon="id-card-alt" :showError="showPublicKeyErr" class="w-full" /> -->
              <PasswordInput placeholder="Enter Wallet Password" errorMessage="Password Required" :showError="showPasswdError" v-model="walletPassword" icon="lock" class="w-full" />
              <div class="text-center w-full">
                <button type="button" class="small-default-btn mr-3 focus:outline-none" @click="isShowLogin = !isShowLogin">{{$t('common.cancel')}}</button>
                <button type="button" class="small-default-btn disabled:opacity-50" :disabled="disableDecrypt" @click="decryptMessage()">{{$t('common.decrypt')}}</button>
              </div>
            </div>
            <div class="text-center py-4 bg-gray-100 mt-1" v-if="!isShowLogin && !isShowMessage && isReceived"><button class="small-default-btn" @click="isShowLogin = !isShowLogin">{{$t('dashboard.decryptMessage')}}</button></div>
            <div v-if="isShowMessage && isReceived" class="p-2 bg-gray-100 rounded-r-2xl">
              <div style="text-align: center; display: block; margin: 0px; font-weight: normal">{{ encryptedMessage }}</div><br>
              <div class="text-center"><button type="button" class="small-default-btn focus:outline-none inline-block" @click="isShowLogin = !isShowLogin; isShowMessage = !isShowMessage">{{$t('dashboard.hideMessage')}}</button></div>
            </div>
            <div v-if="isShowLogin && !isShowMessage && !isReceived" class="w-full mt-2 bg-gray-100 p-3 pt-4 rounded-xl">
              <div class="error error_box mb-2 w-full" style="text-align: center" v-if="err!=''">{{ err }}</div>
              <TextInput v-if="validPublicKey" placeholder="Recipient Public Key" errorMessage="Recipient Public key required" v-model="recipientPublicKey" icon="id-card-alt" :showError="showPublicKeyErr" class="w-full" />
              <PasswordInput placeholder="Enter Wallet Password" errorMessage="Password Required" :showError="showPasswdError" v-model="walletPassword" icon="lock" class="w-full" />
              <div class="text-center w-full">
                <button type="button" class="small-default-btn mr-3 focus:outline-none" @click="isShowLogin = !isShowLogin">{{$t('common.cancel')}}</button>
                <button type="button" class="small-default-btn disabled:opacity-50" :disabled="disableDecrypt" @click="decryptMessage()">{{$t('common.decrypt')}}</button>
              </div>
            </div>
            <div class="text-center py-4 bg-gray-100 mt-1" v-if="!isShowLogin && !isShowMessage && !isReceived"><button class="small-default-btn" @click="isShowLogin = !isShowLogin">{{$t('dashboard.decryptMessage')}}</button></div>
            <div v-if="isShowMessage && !isReceived" class="p-2 bg-gray-100 rounded-r-2xl">
              <div style="text-align: center; display: block; margin: 0px; font-weight: normal">{{ encryptedMessage }}</div><br>
              <div class="text-center"><button type="button" class="small-default-btn focus:outline-none inline-block" @click="isShowLogin = !isShowLogin; isShowMessage = !isShowMessage">{{$t('dashboard.hideMessage')}}</button></div>
            </div>
          </div>
          <div>
            <div>{{$t('dashboard.signerAddress')}}:</div><br>
            <div>{{ innerTransaction.signer.address.address }}</div>
          </div>
          <div>
            <div>{{$t('dashboard.signerPublicKey')}}:</div><br>
            <div>{{ innerTransaction.signer.publicKey }}</div>
          </div>
          <div>
            <div>{{$t('common.signature')}}:</div><br>
            <div>{{ innerTransaction.signature }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed, inject, ref } from "vue";
import { transactions } from '@/util/transactions.js';
import TextInput from '@/components/TextInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Account, Address, EncryptedMessage, PublicAccount } from "tsjs-xpx-chain-sdk";
import {useI18n} from 'vue-i18n'

export default{
  name: 'SubTransfer',
  props: {
    'innerTransaction': Object,
    'sender': Object,
  },

  components: {
    TextInput,
    PasswordInput,
  },

  setup(p){
    const {t} = useI18n();
    const appStore = inject("appStore");
    // const siriusStore = inject("siriusStore");
    const nameType = ref('');
    const showPanel = ref(false);
    const isReceived = ref(false);
    const isShowLogin = ref(false);
    const err = ref('');
    const recipientPublicKey = ref('');
    const walletPassword = ref('');
    const showPublicKeyErr = ref(false);
    const showPasswdError = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const publicKeyPattern = "^[0-9A-Fa-f]{64}$";
    const isShowMessage = ref(false);
    const encryptedMessage = ref('');
    const amount = ref('');

    const disableDecrypt = computed(() => {
      if(walletPassword.value.match(passwdPattern)){
        if(validPublicKey.value){
          if( recipientPublicKey.value.match(publicKeyPattern)){
            return false;
          }else{
            return true;
          }
        }else{
          return false;
        }
      }else{
        return true;
      }
    });

    const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
    const account = wallet.accounts.find((element) => element.address == p.innerTransaction.recipient.address);
    isReceived.value = (account) ? true:false;

    nameType.value = transactions.arraTypeTransaction[transactions.getNameTypeTransaction(p.innerTransaction.type)].name;

    //get amount
    if(p.innerTransaction.mosaics != undefined){
      if (p.innerTransaction.mosaics.length > 0) {
        transactions.getAmount(p.innerTransaction.mosaics[0].id, p.innerTransaction).then((amountParts) => {
          amount.value = amountParts.part1 + amountParts.part2;
        });
        amount.value = '';
      }
    }else{
      amount.value = '';
    }
    // get recipient addresss
    let isValidPublicKey = false;
    // const initiate = () => {
    //   let recipientAddress = p.innerTransaction.recipient.address;
    //   appStore.verifyPublicKey(recipientAddress, siriusStore.accountHttp).then((valid) => {
    //     isValidPublicKey = valid;
    //   });
    // }
    // initiate();
    if(!isReceived.value){
      isValidPublicKey = true;
    }

    const validPublicKey = computed( () => {
      return isValidPublicKey;
    });

    const decryptMessage = () => {
      if(appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword.value)){

        const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
        let plainMessage;
        if(isReceived.value){
          const accountDetails = appStore.getAccDetailsByAddress(p.innerTransaction.recipient.address);

          // let verified = false;
          // // check if recipient public key is required, then validate
          // if(validPublicKey.value){
          //   if(validPublicKey.value != accountDetails.publicAccount.publicKey){
          //     err.value = 'Public Key is invalid';
          //   }else{
          //     verified = true;
          //   }
          // }else{
          //   verified = true;
          // }
          // if(verified){
          let privateKey = appStore.decryptPrivateKey(walletPassword.value, accountDetails.encrypted, accountDetails.iv);
          const certificateAccount = Account.createFromPrivateKey(privateKey, networkType);
          plainMessage = certificateAccount.decryptMessage(new EncryptedMessage(p.innerTransaction.message.payload), p.sender);
          // }
        }else{
          let address = Address.createFromRawAddress(p.sender.address.address);
          const accountDetails = appStore.getAccDetailsByAddress(address.address);
          let privateKey = appStore.decryptPrivateKey(walletPassword.value, accountDetails.encrypted, accountDetails.iv);
          let recipientPublicAccount = PublicAccount.createFromPublicKey(recipientPublicKey.value, networkType);
          plainMessage = EncryptedMessage.decrypt(p.transaction.message, privateKey, recipientPublicAccount);
        }
        err.value = '';
        isShowMessage.value = true;
        encryptedMessage.value = plainMessage.payload;
      }else{
        err.value = t('common.enterPassword',{name : walletState.currentLoggedInWallet.name});
      }
    }

    return {
      appStore,
      validPublicKey,
      isShowLogin,
      err,
      recipientPublicKey,
      walletPassword,
      showPublicKeyErr,
      showPasswdError,
      nameType,
      showPanel,
      isReceived,
      decryptMessage,
      disableDecrypt,
      isShowMessage,
      encryptedMessage,
      amount,
    }
  }
}
</script>

<style lang="scss" scoped>
.subcontent {
  margin: 15px auto;
  > div{
    font-size: 12px; 
    margin-bottom: 5px;
    div:first-child{
      font-weight: bold; display: inline-block; text-align: right; margin-right: 5px;
    }
    div:nth-child(2){
      display: inline-block;
    }
  }
}

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
</style>