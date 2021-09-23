<template>
  <div>
    <div v-if='item.fileHash!=""' :title="'Click to show transaction details'"  @click="toggleModal = !toggleModal" class="md:mx-10 lg:mx-20 border-8 border-solid border-gray-300 mt-4 sm:grid sm:grid-cols-4">
      <div class="sm:col-span-3 p-4">
        <div class="grid grid-cols-4 mt-3">
          <div class="col-span-3 text-left pl-2 flex">
              <div class="self-center">
                <p class="audit-title">{{ item.filename }}</p>
                <div v-if = "item.fileHash!=''">
                  <b class="text-sm">File Hash:</b>
                  <div class="break-all text-sm mt-1 text-blue-500">{{item.fileHash}}</div>
                </div>
                <div v-if = "item.fileHash!=''">
                  <b class="text-sm">Date:</b>
                  <div class="break-all text-sm mt-1 text-blue-500">{{item.date}}</div>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div class="sm:col-span-1 text-center w-full" style="background: -webkit-linear-gradient(bottom,#306FB5,#5DA7DC)">
        <div class="inline-block h-full">
        <div class="h-full flex">
          <img src="@/modules/services/submodule/voting/img/badge-silver-proximax-sirius-wallet.svg" class="w-24 h-24 self-center my-4">
        </div>
        </div>
      </div>
    </div>
    <div v-else :title="'This card has no information to show'" class="md:mx-10 lg:mx-20 border-8 border-solid border-gray-300 mt-4 sm:grid sm:grid-cols-4">
      <div class="sm:col-span-3 p-4">
        <div class="grid grid-cols-4 mt-3">
          <div class="col-span-3 text-left pl-2 flex">
              <div class="self-center">
                <p class="audit-title">{{ item.filename }}</p>
                <div v-if = "item.fileHash!=''">
                  <b class="text-sm">File Hash:</b>
                  <div class="break-all text-sm mt-1 text-blue-500">{{item.fileHash}}</div>
                </div>
                <div v-if = "item.fileHash!=''">
                  <b class="text-sm">Date:</b>
                  <div class="break-all text-sm mt-1 text-blue-500">{{item.date}}</div>
                </div>
                <div v-if = "item.fileHash==''">
                  <div class="break-all text-sm mt-1 text-blue-500">{{item.result}}</div>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div class="sm:col-span-1 text-center w-full" style="background: -webkit-linear-gradient(bottom,#D10000,#D10000)">
        <div class="inline-block h-full">
        <div class="h-full flex">
          <img src="@/assets/img/error.svg" class="w-24 h-24 self-center my-4">
        </div>
        </div>
      </div>
    </div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <h1 class="default-title">Attested File</h1>
          <p class="text-sm mt-5">{{item.transaction.nameType.toUpperCase()}}</p>
          <p>EffectiveFee : {{item.transaction.fee}}</p>
          <p>File Name : {{item.filename}} </p>
          <p>Private: {{item.transaction.privateFile? true : false}}</p>
          <p>Height : {{item.transaction.data.transactionInfo.height.lower}}</p>
          <p>Type : 4154</p>
          <p>From: {{item.transaction.senderAddress}}</p>
          <p>To: {{item.transaction.recipientAddress}}</p>
          <p>Signer : {{item.transaction.sender.publicKey}}</p>
          <p>Signature: {{item.transaction.data.signature}}</p>
          <p>Hash: {{item.hash}}</p>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
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
  },
  
});
</script>
