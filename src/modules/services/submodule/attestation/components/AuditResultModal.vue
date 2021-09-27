<template>
  <div>
    <div  :title="item.fileHash?'Click to show transaction details': 'This card has no information to show'"  @click="toggleModal = !toggleModal" class=" md:mt-4 lg:mt-10 border-8 border-solid border-gray-300 mt-4 sm:grid sm:grid-cols-4 transform hover:scale-105 cursor-pointer ">
      <div class="sm:col-span-3 p-2 ">
        <div class="grid grid-cols-4 mt-3">
          <div class="col-span-3 text-left pl-2 ">
                <b class="break-all text-sm">{{ toOriginal(item.filename) }}</b>
                <div v-if = "item.fileHash!=''">
                  <b class="text-sm">File Hash:</b>
                  <div class="break-all text-sm mt-1 ">{{item.fileHash}}</div>
                </div>
                <div v-if = "item.fileHash!=''">
                  <b class="text-sm">Date:</b>
                  <div class="break-all text-sm mt-1 ">{{item.date}}</div>
                </div>
                <div v-if = "item.fileHash==''">
                  <div class="break-all text-sm mt-1 +">{{item.result}}</div>
              </div>
          </div>
        </div>
      </div>
      <div class="sm:col-span-1  text-center w-full" :style="item.fileHash ? 'background: -webkit-linear-gradient(bottom,#306FB5,#5DA7DC)' : 'background: -webkit-linear-gradient(bottom,#A30000,#D10000)'">
        <div class="inline-block h-full">
          <div class="h-full flex">
            <img v-if = "item.fileHash!=''" src="@/modules/services/submodule/voting/img/badge-silver-proximax-sirius-wallet.svg" class="w-24 h-24 self-center my-4">
            <img v-else src="@/assets/img/error.svg" class="w-24 h-24 self-center my-4">
          </div>
        </div>
      </div>
    </div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
    <div v-if="toggleModal && item.fileHash!=''" class="popup-outer absolute flex z-50">
      <div class="transition ease-in duration-300 w-popup px-6 py-6 bg-white rounded-3xl shadow-xl">
        <div class="delete-position">
          <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
        </div>
        <p class="font-bold text-blue-500 text-lg border-b-2 mb-3">Attested File</p>
        <div class = "grid grid-cols-2">
          <div class= " col-span-1">
            <div class = "flex">
              <p class=" font-bold mt-1 text-txl text-left">{{item.transaction.nameType.toUpperCase()}}</p>
              <img src="@/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg" class="w-12 h-12 ">
              <p class="font-bold ml-2 mt-1 text-orange-primary text-txl ">SENT</p>
            </div>
            <div class = "flex mb-10 mt-4">
              <p class="font-bold  mt-1 text-left text-lg ">Effective Fee: </p>
              <img src="@/assets/img/icon-prx-xpx-blue.svg" class = "ml-6 mt-1 w-7 h-7">
              <p class="ml-2 mt-1 text-left text-lg">{{item.transaction.fee}} XPX</p>
            </div>
            <div class = "flex ">
              <p class = " font-bold text-left text-xs">Original File Name:  </p>
              <p class = " ml-1 text-xs text-left break-all">{{toOriginal(item.filename)}} </p>
            </div>
            <div class = "flex mt-2 mb-8">
              <p class = "font-bold text-left text-xs">Private: </p>
              <p class = " ml-1  text-xs">{{item.transaction.privateFile? "Yes": "No"}}</p>
            </div>
            <div class = "flex mt-2">
              <p class = "font-bold text-left text-xs">Height: </p>
              <p class = " ml-1  text-xs">{{item.transaction.data.transactionInfo.height.lower}}</p>
            </div>
            <div class = "flex mt-2">
              <p class = "font-bold text-left text-xs">Type : </p>
              <p class = "  ml-1  text-xs">4154</p>
            </div>
            <div class = "flex mt-2">
              <p class = "font-bold text-left text-xs">From: </p>
              <p class = " ml-1  break-all text-xs"> {{item.transaction.senderAddress}}</p>
            </div>
            <div class = "flex mt-2">
              <p class = "font-bold text-left text-xs">To: </p>
              <p class = " ml-1  text-xs">{{item.transaction.recipientAddress}}</p>
            </div>
          </div>
          <div>
            <div class="sm:col-span-1 block w-full md:inline-block bg-gray-200 rounded-2xl">
              <div class="col-span-1 text-center w-full pt-2 rounded-2xl rounded-b-none" style="background: -webkit-linear-gradient(bottom,#C46200,#F27900)">
                <div class="inline-block h-full">
                  <div class="h-full flex">
                    <img src="@/modules/services/submodule/voting/img/badge-silver-proximax-sirius-wallet.svg" class="w-24 h-24 self-center">
                  </div>
                </div>
              </div>
              <div class="p-4">
                <div class = "mb-2">
                  <div class="font-bold text-xs text-left block">Signer:</div>
                  <div class=" text-xs text-left block break-all">{{item.transaction.sender.publicKey}}</div>
                </div>
                <div class = "mb-2">
                  <div class="font-bold text-xs text-left block">Signature:</div>
                  <div class=" text-xs text-left block break-all">{{item.transaction.data.signature}}</div>
                </div>
                <div class = "mb-2">
                  <div class="font-bold text-xs text-left block">Hash:</div>
                  <div class=" text-xs text-left block break-all">{{item.hash}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal && item.fileHash!=''" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script lang = 'ts'>
import { defineComponent } from 'vue';
import { ResultAuditInterface} from '@/util/attestationUtils'
export default defineComponent({
  name: 'AuditResultModal',
  props: ['auditResult'],
  data() {
    return {
      toggleModal: false,
      item: this.auditResult as ResultAuditInterface
    };
  },methods:{
    toOriginal:(fullName: string) :string =>{
    let x = fullName.split("_[")
    const fileName = x[0]
    x = x[1].split("]")
    const fileExtension = x[1]
   
    return fileName+fileExtension
  }
  }
  
});
</script>
