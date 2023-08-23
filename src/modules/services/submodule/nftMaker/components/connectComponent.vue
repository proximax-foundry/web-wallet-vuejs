<template>
<div>
  <button v-if="address==''" @click="toggleModal=!toggleModal" class="px-3 bg-blue-600 dark:bg-blue-600 rounded-lg py-1.5 text-white">Connect</button>
  <div v-else @mouseover="toggleWallet = true" @mouseout="toggleWallet = false" class="px-3 py-1 rounded-md bg-blue-600 dark:bg-blue-600 flex items-center cursor-pointer" :title="address">
    <img src="@/modules/services/submodule/nftMaker/img/wallet.svg" class="w-8 h-8">
    <div class="truncate w-24 ml-1 text-white">{{address}}</div>
  </div>
  <div v-if="toggleWallet" @mouseover="toggleWallet = true" @mouseout="toggleWallet = false" class=" relative">
    <div class="absolute bg-white w-full border border-t-0 rounded-md ">
      <div @click="removeSessionStorage()" class="px-3 py-2 cursor-pointer">Disconnect</div>
    </div>
  </div>
  <transition
    enter-active-class="animate__animated animate__fadeInDown"
    leave-active-class="animate__animated animate__fadeOutUp"
  >
      <div v-if="toggleModal" class="popup-outer-lang absolute flex z-50 ">
      <div class="modal-popup-box ">
        <div class="bg-blue-300 text-center py-2 rounded-t-2xl text-lg font-semibold ">Connect Wallet</div>
        <div class="flex px-6 pt-2 pb-24 border-b-[2px] dark:border-blue-600 border-blue-600 dark:bg-[#171717]">
          <div v-if="!mobileQrPage" @click="generateMobileQr()" class=" flex flex-col items-center cursor-pointer hover:bg-blue-300 dark:hover:bg-[#ffb6c1] py-1.5 px-2 rounded-md">
              <img src="@/modules/services/submodule/nftMaker/img/proximax-logo.png" class="w-10 h-10" >
              <div class="font-semibold text-xs dark:text-white">Mobile Wallet</div>
          </div>
          <div v-if="mobileQrPage">
            <div class="my-6" v-html="qr"/>
            <div class="text-gray-500 text-center">Please scan the QR above with Sirius Mobile App to connect.</div>
          </div>
          
        </div>
        <div class="flex justify-center dark:bg-[#171717]">
          <button class="my-3 py-1.5 px-6 text-center text-white bg-blue-700 dark:bg-blue-600 rounded-xl">Learn how to connect</button>
        </div>
      </div>
    </div>
  </transition>
  <div @click="closeModal()" v-if="toggleModal" class="fixed inset-0 opacity-50 bg-gray-600 dark:bg-[#171717] z-20"></div>
</div>
</template>

<script lang="ts" setup>
import { shallowRef } from "@vue/reactivity"
import { Peer } from "peerjs"
import QRCode from 'qrcode'
import { NetworkType, PublicAccount } from "tsjs-xpx-chain-sdk"
import { getCurrentInstance, onMounted } from "vue";

const toggleModal = shallowRef(false)
const toggleWallet = shallowRef(false)
const qr = shallowRef('')
const address = shallowRef('')
const mobileQrPage = shallowRef(false)
const internalInstance = getCurrentInstance()
const emitter = internalInstance!.appContext.config.globalProperties.emitter
const generateRandomString = (length :number) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const generateMobileQr = () =>{
  
  const peer = new Peer(); 
  const secret = "Welcome to the NFT wallet. Please sign the message below to verify your identity. Your custom challenge is: " + generateRandomString(64)

  peer.on("open", async()=> {
    const qrValue = {
      type: "connect",
      recvId: peer.id,
      secret: secret,
      origin: window.location.origin,
      generationHash: "56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9", //testnet2
    };
    qr.value = await QRCode.toString(JSON.stringify(qrValue))
    mobileQrPage.value = true
  });
  peer.on("connection", (conn) => {
    conn.on("data", (data :any) => {
      const signerPubAcc = PublicAccount.createFromPublicKey(data.publicKey, NetworkType.TEST_NET)
      const isValid = signerPubAcc.verifySignature(secret, data.signature)
      if (isValid) {
        conn.send("success")
        sessionStorage.setItem('userPublicKey',signerPubAcc.publicKey)
        fetchSessionStorage()
        emitter.emit('Mobile Wallet Connected')
        peer.disconnect()
        closeModal()
      } else {
        console.error("signature doesn't match!")
      }
    });
  });
}
const fetchSessionStorage = () =>{
  const publicKey = sessionStorage.getItem('userPublicKey')
  if(publicKey!=null){
    address.value = PublicAccount.createFromPublicKey(publicKey, NetworkType.TEST_NET).address.pretty()
  }else{
    address.value = ""
  }
}

const removeSessionStorage = () =>{
  sessionStorage.removeItem('userPublicKey')
  emitter.emit('Mobile Wallet Disconnected')
  fetchSessionStorage()
}
onMounted(()=>{
  fetchSessionStorage()
})
const closeModal = () =>{
  toggleModal.value = false
  qr.value = ''
  mobileQrPage.value = false
}
</script>

<style scoped>
.popup-outer-lang{
  top: 80px; left: 0; right: 0; margin-left: auto; margin-right: auto; max-width: 300px;
}
.modal-popup-box{
  @apply transition ease-in duration-300 w-[500px] bg-white shadow-xl rounded-2xl ;
}
</style>