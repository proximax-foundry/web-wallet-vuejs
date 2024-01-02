<template>
    <Tree :value="account" selectionMode="single" v-on:update:selection-keys="selectedMultisig" :expandedKeys="expandedKeys"
      :filter="true" filterMode="strict" v-on:node-select="onSelect" @node-expand="expandTree"
      @node-collapse="collapseTree">
    </Tree>
  </template>

  <script setup lang="ts">
  import {defineComponent, ref, type PropType} from 'vue';
  import type {TreeNode } from "primevue/treenode"
  defineComponent({
    name: "SelectMultisigInput",
  });
  const emits = defineEmits([
    'select'
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
        selectedMultisig: {
            type: Object as PropType<TreeNode>,
            required: true,
        },
    });
  
  const expandedKeys = ref({});
  
  const onSelect = (event) => {
    emits("select", event);
  };
  
  const expandTree = (expanded) => {
    expandedKeys.value[expanded.key] = true;
  };
  
  const collapseTree = () => {
    expandedKeys.value = {};
  };
  </script>