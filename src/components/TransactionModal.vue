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
          <div class="">
            <h1 class="default-title font-bold my-10">Transaction Information</h1>
            <div class="text-left md:justify-start md:flex md:items-stretch">
              <div class="block md:w-7/12 md:inline-block">
                <div><span class="font-bold text-md">Transfer</span><img src="../assets/img/arrow-transaction-receive-green-proximax-sirius-explorer.svg" class="w-5 h-5 inline-block"> <span class="font-bold text-md">{{ d.flow=='in'?'Received':'Sent' }}</span></div>
                <div class="text-xs my-2">{{ d.date }}</div>
                <div><span class="font-bold">Effective Fee:</span> <img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mx-2"><span class="text-xs">{{ d.fee }}</span> <span class="text-sm">XPX</span></div>
                <div class="content">
                  <div>
                    <div>Height:</div>
                    <div>{{ d.height }}</div>
                  </div>
                  <div>
                    <div>Type:</div>
                    <div>{{ d.typeid }}</div>
                  </div>
                  <div>
                    <div>From:</div>
                    <div>{{ d.sender }}</div>
                  </div>
                  <div>
                    <div>To:</div>
                    <div>{{ d.recipient }}</div>
                  </div>
                </div>
                <div>
                  <div class="font-bold text-xs mb-2">Message</div>
                  <div class="text-sm">{{ d.msg }}</div>
                </div>
                <div class="mt-5">
                  <span class="font-bold text-md">Amount: </span> <img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline ml-2"> <span>{{ d.balance }} XPX</span>
                </div>
              </div>
              <div class="block md:w-5/12 md:inline-block bg-gray-200 rounded-2xl p-2">
                <div class="font-bold text-xs mb-1 block">Signer:</div>
                <div class="w w-96 md:w-full">{{ d.sender }}</div>
                <div class="font-bold text-xs mb-1 block">Signature:</div>
                <div class="w w-96 md:w-full">{{ d.signature }}</div>
                <div class="font-bold text-xs mb-1 block">Hash:</div>
                <div class="w w-96 md:w-full">{{ d.hash }}</div>
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

export default{
  name: 'TransactionModal',
  props: [
    'showModal',
    'd'
  ],
  data() {
    return {
      hover: false,
    };
  },
  methods: {
    closeModal: function() {
      this.emitter.emit("CLOSE_MODAL", false);
    },
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