<template>
  <img
    src="@/modules/dashboard/img/icon-more-options.svg"
    class="w-4 h-4 cursor-pointer ml-2 mt-0.5"
    @click="toggle"
  />
  <Menu ref="menu" :model="items" :popup="true">
  </Menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Menu from "primevue/menu";

const {id, address,name } = defineProps<{
    address: string,
    id: string,
    name:string
}>()


const {t} = useI18n()
const menu = ref();
const router = useRouter()
const items = ref([
  {

    label: t('general.extendDuration'),
    command: () => {
        router.push({ name: 'ViewServicesNamespaceExtend', params: { address: address, namespaceId:id} })
    }
  },
  {

    label: "View Metadata",
    command: () => {
        router.push({ name: 'ViewNamespaceMetadata', params: { namespaceId: name, address: address } })
    },
  },

]);

const toggle = (event: Event) => {
  menu.value.toggle(event);
};
</script>
