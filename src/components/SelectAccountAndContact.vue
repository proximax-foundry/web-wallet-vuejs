<template>
    <Tree :value="contacts" selectionMode="single" v-model:selectionKeys="selectedNode" :expandedKeys="expandedKeys"
        :filter="true" filterMode="strict" @node-select="onNodeSelect(selectedNode)" @node-expand="expandTree(selectedNode)"
        @node-collapse="collapseTree">
    </Tree>
</template>

<script setup lang="ts">
import { defineComponent, ref, type PropType } from 'vue';

defineComponent({
    name: 'SelectAccountAndContact'
})
const emits = defineEmits([
    'node-select'
])
interface contact {
    key: string,
    label: string,
    selectable: boolean,
    children: []
}

defineProps({
    contacts: {
        type: Array<contact>,
        required: true
    },
    selectedNode: {
        type: Object as PropType<contact>,
        required: true
    }
})

const expandedKeys = ref<Record<string, boolean>>({})

function onNodeSelect(node: contact) {
    emits("node-select", node)
}

function expandTree(expanded: contact) {
    expandedKeys.value = {}
    expandedKeys.value[expanded.key] = true
}

function collapseTree() {
    expandedKeys.value = {}
}

</script>