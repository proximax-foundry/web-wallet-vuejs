<template>
    <div>
    <a @click="toggleModal = !toggleModal" ><img src="@/assets/img/globe-white.svg" class="h-4 w-4 inline-block relative mr-2 " style="top: -1px">
        <span v-if="isActive">On</span>
        <span v-if="!isActive">Off</span>
    </a>
      <transition
        enter-active-class="animate__animated animate__fadeInDown"
        leave-active-class="animate__animated animate__fadeOutUp"
      >
        <div v-show="toggleModal" class="popup-outer-lang fixed flex z-40">
          <div class="modal-popup-box m-2">
            <div class="delete-position mt-2 mr-1 cursor-pointer" @click="toggleModal = false">
              <img src="@/assets/img/delete.svg" class="w-5 inline-block">
            </div>
            <div class="w-104">
              <h1 class="default-title my-3 sm:my-5">Sound Settings</h1>
            </div>
            <div>
                <label class="switch">
                    <span v-if="isActive">On</span>
                    <span v-if="!isActive">Off</span>
                    <input type="checkbox" class="switch" v-model="checkedValue">
                    <span class="slider round"></span>
                </label>
            </div>
          </div>
        </div>
      </transition>
      <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-white z-10"></div>
    </div>
  </template>
  
  <script lang="ts">
  import { computed, ref, WritableComputedRef } from 'vue';
  export default{
    name: 'adjustSoundSetting',
    setup(){
      const toggleModal = ref(false);
      const currentState = ref(JSON.parse(sessionStorage.getItem("soundSetting")));
     
      const isActive = computed(()=>{
        sessionStorage.setItem("soundSetting", String(currentState.value));
        return currentState.value
      })

      const checkedValue: WritableComputedRef<boolean> = computed({
            get(): boolean {
                return currentState.value
            },
            set(newValue: boolean): void {
                currentState.value = newValue;
                toggleModal.value = !toggleModal.value;
            },
        });

  
      return{
        isActive,
        checkedValue,
        toggleModal,
      };
    },
  };
  </script>
  
  <style scoped>
  /* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
  </style>