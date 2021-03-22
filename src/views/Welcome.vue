<template>
  <div class="container mx-auto text-center md:px-20 lg:px-40 mt-10">
    <h1 class="big-title">ProximaX Sirius Wallet</h1>
    <h2>The secure interface that connects to the Proximax Sirius platform.</h2>
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-10">
      <div class="text-center p-5">
        <img src="../assets/img/icon-blockchain-full-color-80h-proximax-sirius-wallet.svg" class="w-36 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-md md:text-md lg:text-lg">Blockchain</div>
        <div class=" sm:text-tsm md:text-tmd lg:text-tlg">Multisig, aggregated tx, cross chain, metadata.</div>
      </div>
      <div class="text-center p-5">
        <img src="../assets/img/icon-storage-full-color-80h-proximax-sirius-wallet.svg" class="w-36 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-md md:text-md lg:text-lg">Storage</div>
        <div class=" sm:text-tsm md:text-tmd lg:text-tlg">P2P decentralised storage for any type of file.</div>
      </div>
      <div class="text-center p-5">
        <img src="../assets/img/icon-streaming-full-color-80h-proximax-sirius-wallet.svg" class="w-36 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-md md:text-md lg:text-lg">Streaming</div>
        <div class=" sm:text-tsm md:text-tmd lg:text-tlg">P2P decentralised streaming for video and chat.</div>
      </div>
      <div class="text-center p-5">
        <img src="../assets/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg" class="w-36 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-md md:text-md lg:text-lg">Supercontracts</div>
        <div class=" sm:text-tsm md:text-tmd lg:text-tlg">Easily modifiable digital contracts.</div>
      </div>
    </div>
    <div class="inline-block mt-5">
      <div class="gray-line py-16 grid xs:grid-cols-1 md:grid-cols-3">
        <div class="px-5 self-center">
          <SignInModal />
        </div>
        <div class="px-5">
          <SignInSiriusIDModal />
        </div>
        <div class="px-5 self-center"><router-link to="/create" class="block big-default-btn my-3 self-center">Create</router-link></div>
      </div>
    </div>
    <NotificationModal :toggleModal="toggleModal" :msg="msg" notiType="noti" time='1500' />
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import SignInSiriusIDModal from '@/components/SignInSiriusIDModal.vue'
import SignInModal from '@/components/SignInModal.vue'
import NotificationModal from '@/components/NotificationModal.vue';
export default {
  name: 'Welcome',
  props: ['toggle', 'modalMsg'],
  components: {
    SignInSiriusIDModal,
    SignInModal,
    NotificationModal
  },

  setup(p){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const toggleModal = ref(false);
    const msg = ref(p.modalMsg);

    if(p.toggle){
      toggleModal.value = true;
    }
    emitter.on("CLOSE_NOTIFICATION", payload => {
      toggleModal.value = payload;
    });
    return {
      toggleModal,
      msg
    };
  },
}
</script>
