<template>
<img @click="visibleLeft = true" src="@/modules/services/submodule/nftMaker/img/icon-menu.svg" class="w-12 h-12 cursor-pointer"/>
<Sidebar v-model:visible="visibleLeft" class="bg-white dark:bg-[#141414] border dark:border-0" :baseZIndex="10000">
    <div class="px-6 py-3 flex flex-col gap-2">
        <div class="cursor-pointer text-2xl dark:text-white mb-24" >NFT Maker Tool</div>
        <div class="cursor-pointer dark:text-white">NFT Marketplace</div>
        <router-link to="/view-nft" @click="visibleLeft = false" class="cursor-pointer dark:text-white">View NFT</router-link >
        <router-link @click="visibleLeft = false" class="dark:text-white" to="/create-nft">Create NFT</router-link>
        <div class="cursor-pointer dark:text-white">Settings</div>
        <div class="flex items-center">
            <div class="dark:text-white mr-2">Dark Theme</div>
            <InputSwitch v-model="isDark"/>
        </div>
       
    </div>
</Sidebar>

</template>

<script setup lang="ts">
import Sidebar from 'primevue/sidebar';
import { shallowRef } from 'vue';
import {useDark} from '@vueuse/core'
import InputSwitch from 'primevue/inputswitch';

const visibleLeft = shallowRef(false)

const isDark = useDark()

</script>

<style>

</style>