<template>
  <div id="langSelector">
    <Multiselect
      :options="options"
      mode="single"
      :canDeselect="canDeselect"
      @change="makeSelection"
      v-model="$i18n.locale"
      :maxHeight="maxHeight"
      :caret="caretOption"
      ref="multiselect"
      @mouseover="openList"
      @mouseleave="closeList"
    >
      <template v-slot:singlelabel="{ value }">
        <div class="multiselect-single-label font-bold text-gray-600">
          {{ value.selected }}
        </div>
      </template>

      <template v-slot:option="{ option }">
        <span class="inline-block ml-3">{{ option.label }}</span>
      </template>
    </Multiselect>
  </div>
</template>

<script>
import { ref } from 'vue';
import Multiselect from '@vueform/multiselect';

export default{
  name: 'SelectLanguagePlugin',

  setup(){
    const selectModel = ref(0);
    const multiselect = ref(null);
    const maxHeight = ref(300);
    const canDeselect = ref(false);
    const caretOption = ref(false);
    const options = [
      { value: 'en', label: 'English',  selected: 'EN', icon: 'gb' },
      { value: 'zh', label: '中文'   ,   selected: 'CH',icon: 'cn' },
      { value: 'ru', label: 'русский',  selected: 'RU',icon: 'ru' },
      { value: 'es', label: 'Español',  selected: 'ES',icon:'es'}
    ]

    const selected = ref('EN')

    const makeSelection =() => {
      console.log('Change language')
    };

    const openList = () => {
      multiselect.value.open();
    }

    const closeList = () => {
      multiselect.value.close();
    }

    return {
      selected,
      options,
      selectModel,
      makeSelection,
      maxHeight,
      canDeselect,
      caretOption,
      openList,
      closeList,
      multiselect,
    };
  },

  components: {
    Multiselect,
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/multiselect.scss";
#langSelector ::v-deep {
  top: 7px;
  position: absolute;
  .multiselect-input{
    border-bottom: 0px !important;
  }
  .multiselect{
    width: 90px;
  }
  .multiselect-options{
    overflow-y: hidden !important;
  }
  .multiselect-single-label{
    font-size: 13px;
  }
  .multiselect-option{
    padding: 5px !important;
    min-height: 30px !important;
    font-size: 13px;
  }
}

</style>
