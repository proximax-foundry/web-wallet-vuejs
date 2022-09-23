<template>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang fixed flex z-50">
        <div class="modal-popup-box">
          <div class="text-tsm mb-5 font-bold text-center">Select Token</div>
          <div class="w-full px-3 py-1 flex justify-between mb-3 mt-3 md:mt-0 md:mb-0 border-gray-300 border">
            <input v-model="strFilteredToken" type="text" class="w-28 outline-none text-xs float-left" :placeholder="$t('general.search')">
            <img src="@/modules/services/submodule/addressbook/img/icon-search_black.svg" class="inline-block">
          </div>
          <div class="mt-2">
            <div class="text-txs text-right mr-2 mt-2 text-gray-400">Balance</div>
            <div class="mb-2 flex justify-between items-center hover:bg-blue-200 p-2 duration-200 transition-all cursor-pointer" v-for="token, index in tokens" :key="index">
              <div class="text-xs text-gray-700"><img :src="require('@/modules/services/submodule/stacking/img/tokens/' + token.img)" class="inline-block w-6 h-6 mr-1" />{{ token.name }}</div>
              <div class="text-xs text-gray-700">{{ token.balance }}</div>
            </div>
          </div>
          <div class='text-center cursor-pointer text-xs font-semibold text-blue-link mt-2' @click="closeModal">{{$t('general.close')}}</div>
        </div>
      </div>
    </transition>
    <div v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
</template>
<script>
import { ref } from "vue";

export default {
  name: 'SelectTokenModal',
  emit: ['closeModal'],
  props:{
    toggleModal: Boolean
  },
  setup(props, {emit}){
    const closeModal = () => {
      emit('closeModal');
    }

    const strFilteredToken = ref('');

    const tokens = [
      { img: 'usdt-48.png', name: 'USDT', balance: 1234.5 },
      { img: 'usdc-48.png', name: 'USDC', balance: 1234.5 },
      { img: 'usdp-48.png', name: 'USDP', balance: 1234.5 },
      { img: 'busd-48.png', name: 'BUSD', balance: 1234.5 },
    ];

    return {
      strFilteredToken,
      closeModal,
      tokens,
    }
  }
}
</script>
