/* eslint-disable */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


/*
declare module "*.vue" {
  import { defineComponent  } from "vue";
  const component: ReturnType<typeof defineComponent >;
  export default component;
}
*/

/*
declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}
*/

import mitt from 'mitt';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    emitter: mitt;
  }
}

declare module 'vue-password';