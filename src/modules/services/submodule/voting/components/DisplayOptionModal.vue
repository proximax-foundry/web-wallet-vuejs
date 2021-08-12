<template>
  <div>
    <a @click="toggleModal = !toggleModal" class="text-blue-primary font-bold">{{$t('common.viewAll')}}</a>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <div class="w-104">
            <h1 class="default-title font-bold my-10">{{$t('common.option',1)}}{{ (options.length>1?'s':'') }}</h1>
              <div class="px-10 py-5 my-5" v-if="options.length > 0">
                <div class="text-left grid grid-cols-3">
                  <div class="inline-block mr-4 mt-3 text-xs text-left col-span-1" v-for="(option, index) in options" :key="index">
                    <div class="text-sm"> {{ option.name }}</div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>

export default{
  name: 'DisplayOptionModal',
  props: [
    'options'
  ],
  data() {
    return {
      toggleModal: false,
    };
  },

  setup(){
    return{
    };
  },
}
</script>
