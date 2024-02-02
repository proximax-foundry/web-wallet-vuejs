<template>
    <Tree :value="contacts" selectionMode="single"  :expandedKeys="expandedKeys"
    :filter="true" filterMode="strict" v-on:node-select="onNodeSelect" @node-expand="expandTree"
    @node-collapse="collapseTree">
  </Tree>
</template>

<script setup lang="ts">
    import {defineComponent, ref } from 'vue';
    import type { TreeExpandedKeys,  } from "primevue/tree";
    import type {TreeNode } from "primevue/treenode"

    defineComponent({
        name: 'SelectAccountAndContact'
    })
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
      
    });

    const expandedKeys = ref<TreeExpandedKeys>({})

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

<style>
.p-tree .p-tree-filter-container input {
    border: 1px solid black;
    padding-left: 5px;
}
</style>