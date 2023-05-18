<template>
    <Tree :value="account" selectionMode="single" v-on:update:selection-keys="selectedNode" :expandedKeys="expandedKeys"
      :filter="true" filterMode="strict" v-on:node-select="onNodeSelect" @node-expand="expandTree"
      @node-collapse="collapseTree">
    </Tree>
  </template>

  <script setup lang="ts">
  import {defineComponent, ref, type PropType} from 'vue';
  import type { TreeExpandedKeys, TreeNode } from "primevue/tree";
  
  defineComponent({
    name: "SelectMultisigInput",
  });
  const emits = defineEmits([
    'node-select'
  ])
  
  interface account {
        key: string;
        label: string;
        data: string;
        selectable: boolean;
    }

  defineProps({
        account: {
            type: Array<account>,
            required: true,
        },
        selectedNode: {
            type: Object as PropType<TreeNode>,
            required: true,
        },
    });
  
  const expandedKeys = ref({});
  
  const onNodeSelect = (node) => {
    emits("node-select", node);
  };
  
  const expandTree = (expanded) => {
    expandedKeys.value[expanded.key] = true;
  };
  
  const collapseTree = () => {
    expandedKeys.value = {};
  };
  </script>