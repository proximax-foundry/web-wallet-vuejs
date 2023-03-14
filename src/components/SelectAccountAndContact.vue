<template>
  <Tree :value="contacts" selectionMode="single" v-on:update:selection-keys="selectedNode" :expandedKeys="expandedKeys"
    :filter="true" filterMode="strict" v-on:node-select="onNodeSelect" @node-expand="expandTree"
    @node-collapse="collapseTree">
  </Tree>
</template>

<script setup lang="ts">
import type { TreeExpandedKeys, TreeNode } from "primevue/tree";
import { defineComponent, ref, type PropType } from "vue";

defineComponent({
  name: "SelectAccountAndContact",
});
const emits = defineEmits([
  'node-select'
])

interface contact {
  key: string;
  label: string;
  selectable: boolean;
  children: { key: string, label: string, data: string }[];
}

defineProps({
  contacts: {
    type: Array<contact>,
    required: true,
  },
  selectedNode: {
    type: Object as PropType<TreeNode>,
    required: true,
  },
});

const expandedKeys = ref<TreeExpandedKeys>({});

const onNodeSelect = (node: TreeNode) => {
  emits("node-select", node);
};

const expandTree = (expanded: TreeNode) => {
  expandedKeys.value[expanded.key as string] = true;
};

const collapseTree = () => {
  expandedKeys.value = {};
};
</script>
