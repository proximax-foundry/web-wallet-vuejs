<template>
  <div>
    <a href="#" @click="toggleModal = !toggleModal" class="block big-default-btn my-3 self-center">Sign In With SiriusID</a>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <h1 class="default-title">Sign in your wallet by scanning this QR Code using your SiriusID app.</h1>
          <p class="text-sm mt-5">This popup will close automatically when your sign in from the SiriusID app.</p>
          <img src="/img/download.gif" class="inline-block w-40 mb-10 mt-6">
          <p>Don't have app? Download it from your store</p>
          <div class="flex justify-center my-3">
            <a href="https://apps.apple.com/us/app/proximax-siriusid/id1496615202" target=_new class="inline-block mr-2"><img src="/img/app-store.png" class="w-32"></a>
            <a href="https://play.google.com/store/apps/details?id=io.proximax.siriusID" target=_new class="inline-block ml-2"><img src="/img/google-play.png" class="w-32"></a>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>

export default {
  name: 'SignInSiriusIDModal',
  data() {
    return {
      toggleModal: false
    };
  },
}
</script>
