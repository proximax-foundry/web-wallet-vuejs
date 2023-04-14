<template>
    <Tree :value="account" selectionMode="single" v-model:selectionKeys="selectedNode" :expandedKeys="expandedKeys"
      :filter="true" filterMode="strict" @node-select="onNodeSelect" @node-expand="expandTree"
      @node-collapse="collapseTree">
    </Tree>
  </template>

  <script setup lang="ts">
  import { defineComponent, ref } from "vue";
  
  defineComponent({
    name: "SelectMultisigInput",
  });
  const emits = defineEmits([
    'node-select'
  ])
  
  defineProps({
    account: {},
    selectedNode: {}
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