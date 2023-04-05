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
            <div class="mb-2 flex justify-between items-center hover:bg-blue-200 p-2 duration-200 transition-all cursor-pointer" v-for="token, index in displayTokens" :key="index" @click="$emit('selectToken', token.name)">
              <div class="text-xs text-gray-700"><img :src="'/src/modules/services/submodule/staking/img/tokens/' + token.img" class="inline-block w-6 h-6 mr-1" />{{ token.name }}</div>
              <div class="text-xs text-gray-700">{{ token.balance }}</div>
            </div>
          </div>
          <div class='text-center cursor-pointer text-xs font-semibold text-blue-link mt-2' @click="$emit('closeModal')">{{$t('general.close')}}</div>
        </div>
      </div>
    </transition>
    <div v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";

  const props = defineProps({
    toggleModal: Boolean,
    tokens:{
      type: Array<{name:string, balance:number, img: string}>,
      required: true
    }
  })

  defineEmits(['closeModal', 'selectToken'])

    const strFilteredToken = ref('');

    const displayTokens = computed(() => {
      if(strFilteredToken.value.length > 0){
        return props.tokens.filter(token => token.name.includes(strFilteredToken.value.toUpperCase()));
      }else{
        return props.tokens;
      }
    })

</script>
