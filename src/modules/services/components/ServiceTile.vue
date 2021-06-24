<template>
  <div class="p-3 text-center">
    <img :src="`${require('@/modules/services/img/' + service.img)}`" style="width: 80px; height: 80px;" class="inline-block mb-3" :class="(service.enable)?'':'filtergrayscale'">
    <div class="text-sm mb-2 font-bold" :class="(service.enable)?'text-gray-800':'text-gray-300'">{{ service.name }}</div>
    <div class="text-xs" :class="(service.enable)?'text-gray-800':'text-gray-300'">{{ service.desc }}</div>
    <div class="relative inline-block text-left" @mouseover="hoverOverMenu" @mouseout="hoverOutMenu">
      <div>
        <button type="button" @click="showHideMenu();" class="justify-center px-4 py-2 text-gray-700 focus:outline-none" id="options-menu" aria-expanded="true" aria-haspopup="true">
          <font-awesome-icon icon="caret-down" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </button>
      </div>
      <div :class="showMenuCall?'':'hidden'" class="absolute w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <div class="py-1" role="none">
          <div v-for="(option, item) in service.menu" :key="item">
            <router-link v-if="option.link!=''" :to="{name: option.link}" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">{{ option.name }}</router-link>
            <div v-else class="block px-2 py-1 text-xs text-gray-300">{{ option.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";

export default{
  name: 'ServiceTile',
  props: ['service', 'showMenuCall', 'i'],
  setup(p){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const showHideMenu = () => {
      // show.value = !show.value;
      emitter.emit("CLOSE_ALL_MENU_TRIGGER");
      if(p.showMenuCall){
        emitter.emit("CLOSE_MENU_TRIGGER", p.i);
      }else{
        emitter.emit("SHOW_MENU_TRIGGER", p.i);
      }
    };

    const hoverOverMenu = () => {
      emitter.emit("HOVER_OVER_MENU_TRIGGER", p.i);
    };

    const hoverOutMenu = () => {
      emitter.emit("HOVER_OUT_MENU_TRIGGER");
    };

    return {
      showHideMenu,
      hoverOverMenu,
      hoverOutMenu,
    }
  },
}
</script>
<style lang="scss" scoped>
.filtergrayscale{
  -webkit-filter: grayscale(100%) opacity(50%);
  filter: grayscale(100%) opacity(50%);
  color: gray;
}
</style>