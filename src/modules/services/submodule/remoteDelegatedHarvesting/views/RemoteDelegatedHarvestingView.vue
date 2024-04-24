<template>
    <div class="border filter shadow-lg flex w-8/12 mx-auto mt-8 p-6 justify-between">
        <div class="flex flex-col items-center gap-2 text-sm">
            <div>Harvesting Status</div>
            <div>INACTIVE</div>
        </div>
        <div class="flex flex-col items-center gap-2">
            <div>Blocks made</div>
            <div>0</div>
        </div>
        <div class="flex flex-col items-center gap-2">
            <div>Fees Collected</div>
            <div>0</div>
        </div>
    </div>
    <div class="border filter shadow-lg flex flex-col gap-3  w-8/12 mx-auto mt-8 p-6 ">
        <div>Remote Delegated Harvesting</div>
        <div class="ml-8">
            <div>Node URL</div>
            <input type="text" class="border px-3 py-1">
        </div>
        <div>Keys Info</div>
        <div class="ml-8">
            <div>Node Public Key</div>
            <input type="text" class="border px-3 py-1">
            <div>Remote Public Key</div>
            <input type="text" class="border px-3 py-1">
            <div>Remote Private Key</div>
            <input type="text" class="border px-3 py-1">
        </div>
        <button >Harvest</button>
    </div>
</template>

<script setup lang="ts">
import { firstValueFrom } from 'rxjs';
import { AccountLinkTransaction, AggregateTransaction, NodeHttp, NodeLinkTransaction, TransferTransaction, VrfLinkTransaction } from 'tsjs-xpx-chain-sdk';
import { PeerInfo } from 'tsjs-xpx-chain-sdk/dist/src/model/node/NodePeers';
import { watch } from 'vue';
import { onMounted, ref } from 'vue';

const nodeList = ref<PeerInfo[]>([])



/* const stopWatch = watch(()=>AppState.chainAPI,async n=>{
    if(!n) return
    const nodePeers = await n.nodeAPI.getNodePeers()

    
    console.log(nodePeers)
    nodeList.value = nodePeers.peersInfo
    stopWatch()
},{immediate:true}) */

onMounted(async()=>{
    const nodeHttp = new NodeHttp('https://bctestnet2.brimstone.xpxsirius.io')
    const nodePeers = await firstValueFrom(nodeHttp.getNodePeers())
    nodeList.value = nodePeers.peersInfo
})

const harvest =  async() =>{
    
    /* const accLinkTxn = AccountLinkTransaction.create()
    const vrfLinkTxn = VrfLinkTransaction.create()
    const nodeLinkTxn = NodeLinkTransaction.create()
    const transferTxn = TransferTransaction.create()

    const innerTxn = [
        accLinkTxn.toAggregate(),
        vrfLinkTxn.toAggregate(),
        nodeLinkTxn.toAggregate(),
        transferTxn.toAggregate()
    ]
    const abtTxn = AggregateTransaction.createBonded() */
}
</script>