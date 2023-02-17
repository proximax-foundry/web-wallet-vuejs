<template>
    <Tree :value="contacts" selectionMode="single" v-model:selectionKeys="selectedNode" :expandedKeys="expandedKeys" :filter="true" filterMode="strict" @node-select="onNodeSelect" @node-expand="expandTree" @node-collapse="collapseTree" >
    </Tree>
</template>

<script setup lang="ts">
    import {defineComponent, ref} from 'vue';

    defineComponent({
        name: 'SelectAccountAndContact'
    })
    const emits = defineEmits([
        'node-select'
    ])
    const props = defineProps({
        contacts : {},
        selectedNode : {}
    })

    const expandedKeys = ref({})

    function onNodeSelect(node){
        emits("node-select", node)
    }

    function expandTree(expanded){
        expandedKeys.value = {}
        expandedKeys.value[expanded.key] = true
    }

    function collapseTree(){
        expandedKeys.value = {}
    }
    
</script>