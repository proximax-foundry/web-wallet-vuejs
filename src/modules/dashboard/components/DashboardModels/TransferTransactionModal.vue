<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="showModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box relative">
          <div class="delete-position" style=" position: absolute; right: 15px;">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="closeModal();"></font-awesome-icon>
          </div>
          <div>
            <h1 class="default-title font-bold my-5">Transaction Information</h1>
            <div class="text-left md:justify-start md:flex md:items-stretch">
              <div class="block md:w-7/12 md:inline-block">
                <!-- <div class="relative"><span class="font-bold text-md mr-3">Transfer</span><img :src="`../../assets/img/arrow-transaction-${transaction.transferType=='in'?'receive-in-green-proximax-sirius-explorer':'sender-out-orange-proximax-sirius-explorer'}.svg`" class="w-7 h-7 inline-block absolute" style="top:-2px;"> <span class="ml-8 font-bold text-md">{{ transaction.transferType=='in'?'Received':'Sent' }}</span></div> -->
                <div class="relative"><span class="font-bold text-md mr-3">Transfer</span>
                  <img src="@/modules/dashboard/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg" class="w-7 h-7 inline-block absolute" style="top:-2px;" v-if="transaction.transferType=='in'">
                  <img src="@/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg" class="w-7 h-7 inline-block absolute" style="top:-2px;" v-else>
                  &nbsp;<span class="ml-8 font-bold text-md">{{ transaction.transferType=='in'?'Received':'Sent' }}</span></div>
                <div class="text-xs my-2">{{ timestamp }}</div>
                <div v-if="effectiveFee"><span class="font-bold">Effective Fee:</span> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mx-2"><span class="text-xs">{{ effectiveFee.part1 }}{{ effectiveFee.part2 }}</span> <span class="text-sm">XPX</span></div>
                <div class="content">
                  <div v-if="transaction.block">
                    <div>Height:</div>
                    <div>{{ transaction.block }}</div>
                  </div>
                  <div>
                    <div>Type:</div>
                    <div>{{ transaction.type }}</div>
                  </div>
                  <div>
                    <div>From:</div>
                    <div>{{ transaction.senderAddress }}</div>
                  </div>
                  <div>
                    <div>To:</div>
                    <div>{{ transaction.recipientAddress }}</div>
                  </div>
                </div>
                <!-- <div v-if="transaction.message.payload">
                  <div class="font-bold text-xs mb-2">Message</div>
                  <div class="text-sm">{{ transaction.message.payload }}</div>
                </div>
                 -->
                <div v-if="!transaction.message.type && transaction.message.payload != ''">
                  <div>Message:</div><br>
                  <div>{{ transaction.message.payload }}</div>
                </div>
                <div v-if="transaction.message.type && transaction.message.payload != ''">
                  <div class="font-semibold">Encrypted Message:</div>
                  <div v-if="isShowLogin && !isShowMessage && (transaction.transferType=='in')" class="mt-2 bg-gray-100 p-3 pt-4 rounded-xl mr-2">
                    <div class="error error_box mb-2 w-full" style="text-align: center" v-if="err!=''">{{ err }}</div>
                    <!-- <TextInput v-if="validPublicKey" placeholder="Recipient Public Key" errorMessage="Recipient Public key required" v-model="recipientPublicKey" icon="id-card-alt" :showError="showPublicKeyErr" class="w-full" /> -->
                    <PasswordInput placeholder="Enter Wallet Password to Decrypt" errorMessage="Password Required" :showError="showPasswdError" v-model="walletPassword" icon="lock" class="w-full" />
                    <div class="text-center w-full">
                      <button type="button" class="small-default-btn mr-3 focus:outline-none" @click="isShowLogin = !isShowLogin">Cancel</button>
                      <button type="button" class="small-default-btn disabled:opacity-50" :disabled="disableDecrypt" @click="decryptMessage()">Decrypt</button>
                    </div>
                  </div>
                  <div class="text-center py-4 bg-gray-100 mt-1 mr-2" v-if="!isShowLogin && !isShowMessage && (transaction.transferType=='in')"><button class="small-default-btn" @click="isShowLogin = !isShowLogin">Decrypt Message</button></div>
                  <div v-if="isShowMessage && (transaction.transferType=='in')" class="p-2 bg-gray-100 rounded-r-2xl">
                    <div style="text-align: center; display: block; margin: 0px; font-weight: normal">{{ encryptedMessage }}</div><br>
                    <div class="text-center"><button type="button" class="small-default-btn focus:outline-none inline-block" @click="isShowLogin = !isShowLogin; isShowMessage = !isShowMessage">Hide message</button></div>
                  </div>
                  <div v-if="isShowLogin && !isShowMessage && !(transaction.transferType=='in')" class="mt-2 bg-gray-100 p-3 pt-4 rounded-xl mr-2">
                    <div class="error error_box mb-2 w-full" style="text-align: center" v-if="err!=''">{{ err }}</div>
                    <TextInput placeholder="Recipient Address or Public Key" errorMessage="Recipient Address or Public key required" v-model="recipientAddressPublicKey" icon="id-card-alt" :showError="showPublicKeyErr" class="w-full" />
                    <PasswordInput placeholder="Enter Wallet Password" errorMessage="Password Required" :showError="showPasswdError" v-model="walletPassword" icon="lock" class="w-full" />
                    <div class="text-center w-full">
                      <button type="button" class="small-default-btn mr-3 focus:outline-none" @click="isShowLogin = !isShowLogin">Cancel</button>
                      <button type="button" class="small-default-btn disabled:opacity-50" :disabled="disableDecrypt" @click="decryptMessage()">Decrypt</button>
                    </div>
                  </div>
                  <div class="text-center py-4 bg-gray-100 mt-1 mr-2" v-if="!isShowLogin && !isShowMessage && !(transaction.transferType=='in')"><button class="small-default-btn" @click="isShowLogin = !isShowLogin">Show Message</button></div>
                  <div v-if="isShowMessage && !(transaction.transferType=='in')" class="p-2 bg-gray-100 rounded-r-2xl">
                    <div class="text-tsm text-gray-500">{{ encryptErr }}</div>
                    <div style="text-align: center; display: block; margin: 0px; font-weight: normal">{{ encryptedMessage }}</div><br>
                    <div class="text-center"><button type="button" class="small-default-btn focus:outline-none inline-block" @click="isShowLogin = !isShowLogin; isShowMessage = !isShowMessage">Hide message</button></div>
                  </div>
                </div>

                <div class="mt-5" v-if="amount!='0.000000'">
                  <span class="font-bold text-md">Amount: </span> <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-2"> <span>{{ amount }} XPX</span>
                </div>
              </div>
              <div class="block md:w-5/12 md:inline-block bg-gray-200 rounded-2xl p-2">
                <div class="font-bold text-xs mb-1 block">Signer:</div>
                <div class="w w-96 md:w-full">{{ transaction.signer.address.address }}</div>
                <div class="font-bold text-xs mb-1 block mt-3">Signature:</div>
                <div class="w w-96 md:w-full">{{ transaction.signature }}</div>
                <div class="font-bold text-xs mb-1 block mt-3">Hash:</div>
                <div class="w w-96 md:w-full">{{ transaction.transactionInfo.hash }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="closeModal();" v-if="showModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>
import { computed, inject, getCurrentInstance, ref, watch } from "vue";
import { transactions } from '@/util/transactions.js';
import TextInput from '@/components/TextInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Account, Address, EncryptedMessage, PublicAccount } from "tsjs-xpx-chain-sdk";
import { dataBridge } from '@/util/dataBridge.js';
import { multiSign } from '@/util/multiSignatory';
import {
  UInt64,
} from "tsjs-xpx-chain-sdk";

export default{

  name: 'TransferTransactionModal',
  props: {
    'showModal': Boolean,
    'transaction': Object,
  },

  components: {
    TextInput,
    PasswordInput,
  },

  setup(p) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    // const siriusStore = inject("siriusStore");
    const hover = ref(false);
    const timestamp = ref('');
    const effectiveFee = ref('');
    const amount = ref('0.000000');
    const transferTypeIcon = ref('');
    const isShowLogin = ref(false);
    const err = ref('');
    const recipientAddressPublicKey = ref('');
    const walletPassword = ref('');
    const showPublicKeyErr = ref(false);
    const showPasswdError = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const publicKeyPattern = "^[0-9A-Fa-f]{64}$";
    const addressPatternShort = "^[0-9A-Za-z]{40}$";
    const addressPatternLong = "^[0-9A-Za-z-]{46}$";
    const isShowMessage = ref(false);
    const encryptedMessage = ref('');
    const encryptErr = ref('');

    const disableDecrypt = computed(() => {
      if(walletPassword.value.match(passwdPattern)){
        if((recipientAddressPublicKey.value.length == 64) || (recipientAddressPublicKey.value.length == 46) || (recipientAddressPublicKey.value.length == 40)){
          if(recipientAddressPublicKey.value.match(publicKeyPattern) && (recipientAddressPublicKey.value.length == 64)){
            return false
          }else if(recipientAddressPublicKey.value.match(addressPatternLong) && (recipientAddressPublicKey.value.length == 46)){
            return false
          }else if(recipientAddressPublicKey.value.match(addressPatternShort) && (recipientAddressPublicKey.value.length == 40)){
            return false;
          }else{
            return true;
          }
        }else{
          return true;
        }
      }else{
        return true;
      }
    });

    let isValidPublicKey = false;
    // const initiate = (address) => {
    //   appStore.verifyPublicKey(address, siriusStore.accountHttp).then((valid) => {
    //     isValidPublicKey = valid;
    //   });
    // }
    if(p.transaction != undefined){
      if(!p.transaction.transferType=='in'){
        isValidPublicKey = true;
      }
      //initiate(p.transaction.recipient);
    }

    const validPublicKey = computed( () => {
      return isValidPublicKey;
    });

    const decryptMessage = async () => {
      if(appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword.value)){

        const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
        let plainMessage;
        // decrypt message on the recipient panel
        if(p.transaction.transferType=='in'){
          let address = Address.createFromRawAddress(p.transaction.recipient)
          const accountDetails = appStore.getAccDetailsByAddress(address.address);

          let privateKey = appStore.decryptPrivateKey(walletPassword.value, accountDetails.encrypted, accountDetails.iv);
          const certificateAccount = Account.createFromPrivateKey(privateKey, networkType);
          err.value = '';
          plainMessage = certificateAccount.decryptMessage(new EncryptedMessage(p.transaction.message.payload), p.transaction.signer);
          isShowMessage.value = true;
          encryptedMessage.value = plainMessage.payload;
        }else{
          // decrypt message on the sender's panel
          let publicKey;
          let invalid = false;
          if(recipientAddressPublicKey.value.length == 64){
            publicKey = recipientAddressPublicKey.value;
          }else if(recipientAddressPublicKey.value.length == 40 || recipientAddressPublicKey.value.length == 46){
            let address = Address.createFromRawAddress(recipientAddressPublicKey.value);
            try {
              publicKey = await multiSign.getPublicKey(address);
            } catch (error) {
              if(error == 'invalid'){
                invalid = true;
              }
            }
          }
          if(!invalid){
            let address = Address.createFromRawAddress(p.transaction.senderAddress)
            const accountDetails = appStore.getAccDetailsByAddress(address.address);
            let privateKey = appStore.decryptPrivateKey(walletPassword.value, accountDetails.encrypted, accountDetails.iv);
            let recipientPublicAccount = PublicAccount.createFromPublicKey(publicKey, networkType);
            plainMessage = EncryptedMessage.decrypt(p.transaction.message, privateKey, recipientPublicAccount);
            isShowMessage.value = true;
            encryptedMessage.value = plainMessage.payload;
            if(plainMessage.payload ==''){
              encryptErr.value = "Recipient's public key might be invalid with empty message decrypted";
            }
          }else{
            err.value = "Recipient address/public key is incorrect";
          }
        }
      }else{
        err.value = "Wallet password is incorrect";
      }
    }

    const closeModal = () => {
      emitter.emit("CLOSE_MODAL", false);
    };

    watch(() => p.showModal, () => {
      if(p.showModal){
        if (p.transaction.transactionInfo && p.transaction.transactionInfo.height) {
          const height = p.transaction.transactionInfo.height.compact();
          if (typeof (height) === 'number') {
            const existBlock = dataBridge.filterBlockStorage(height);
            if (existBlock) {

              timestamp.value = `${transactions.dateFormatUTC(new UInt64([existBlock.timestamp.lower, existBlock.timestamp.higher]))} - UTC`;
              const calculateEffectiveFee = transactions.amountFormatterSimple(existBlock.feeMultiplier * p.transaction.data.size);
              effectiveFee.value = transactions.getDataPart(calculateEffectiveFee, 6);

            } else {
              dataBridge.getBlockInfo(height).subscribe(
                next => {

                  dataBridge.validateBlock(next);
                  timestamp.value = `${transactions.dateFormatUTC(next.timestamp)} - UTC`;
                  const calculateEffectiveFee = transactions.amountFormatterSimple(next.feeMultiplier * p.transaction.data.size);
                  effectiveFee.value = transactions.getDataPart(calculateEffectiveFee, 6);

                }
              );
            }
          } else {
            effectiveFee.value = transactions.getDataPart('0.00000', 6);
          }
        } else {
          effectiveFee.value = transactions.getDataPart('0.00000', 6);
        }
        if(p.transaction.mosaics != undefined){
          if (p.transaction.mosaics.length > 0) {
            const id = p.transaction.mosaics[0].id;
            console.log(id)
            transactions.getAmount(id, p.transaction).then((amountParts) => {
              amount.value = amountParts.part1 + amountParts.part2;
            });
            amount.value = '';
          }
        }else{
          amount.value = '';
        }

        if(p.transaction.transferType=='in'){
          transferTypeIcon.value = '@/modules/dashboard/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg';
        }else{
          transferTypeIcon.value = '@/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg';
        }
      }
    }, {immediate: true})

    return {
      hover,
      closeModal,
      timestamp,
      effectiveFee,
      amount,
      transferTypeIcon,
      isShowLogin,
      err,
      recipientAddressPublicKey,
      walletPassword,
      showPublicKeyErr,
      showPasswdError,
      isShowMessage,
      encryptedMessage,
      disableDecrypt,
      decryptMessage,
      validPublicKey,
      encryptErr,
    };
  }
}
</script>

<style lang="scss">
.w{
  word-wrap: break-word; font-size:12px;
  margin-bottom: 5px;
  display: block;
}
.content {
  margin: 15px auto;
  > div{
    @apply text-xs; 
    margin-bottom: 5px;
    div:first-child{
      font-weight: bold; display: inline-block; text-align: right; margin-right: 5px; width: 50px;
    }
    div:nth-child(2){
      display: inline-block;
    }
  }
}
</style>