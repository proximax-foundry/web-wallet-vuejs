<template>
    <Dropdown
      v-model="selectedNode"
      :options="nodeList"
      optionLabel="label"
      class="w-full px-2"
    >
      
    </Dropdown>
</template>

<script setup lang="ts">
import { firstValueFrom } from 'rxjs';
import {  NodeHttp } from 'tsjs-xpx-chain-sdk';
import { ref,onMounted  } from "vue";
const selectedNode = defineModel<{ value: string; label: string } | null>();

const nodeList = ref<{value:string,label:string}[]>([])

onMounted(async()=>{
    const nodeHttp = new NodeHttp('https://bctestnet2.brimstone.xpxsirius.io')
    const nodePeers = await firstValueFrom(nodeHttp.getNodePeers())
    nodeList.value = nodePeers.peersInfo.map(info=>{
        return{
            value: info.publicKey,
            label:info.host
        }
    })
})
</script>