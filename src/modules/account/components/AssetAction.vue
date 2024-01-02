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
import { ref } from "vue";
import Menu from "primevue/menu";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const {id, address, isCreator} = defineProps<{
    address: string,
    id: string,
    isCreator: boolean
}>()
const {t} = useI18n()
const menu = ref();
const router = useRouter()
const items = ref([
  {
    visible: isCreator,
    label: t("general.modifySupply"),
    command: () => {
        router.push({
              name: 'ViewServicesAssetsModifySupplyChange',
              params: { assetId: id, address: address }})
    },
  },
  {
    visible: isCreator,
    label:t("general.linkToNamespace"),
    command: () => {
        router.push({
              name: 'ViewServicesAssetsLinkToNamespace',
              params: { assetId: id, address: address }})
    },
  },
  {
    visible:true,
    label: 'View Metadata',
    command: () => {
        router.push({
              name: 'ViewAssetMetadata',
              params: { assetId: id, address: address },
            })
    },
  }
]);

const toggle = (event: Event) => {
  menu.value.toggle(event);
};
</script>
