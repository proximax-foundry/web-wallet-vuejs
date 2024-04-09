<template>
    <div class="w-10/12 ml-auto mr-auto mt-5">
        <AccountComponent :address="address" class="mb-6"/>
        <AccountTabs :address="address" :selected="selected"/>
    </div>
    <slot />
</template>

<script setup lang="ts">
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue"
defineProps({
    address: {
        type: String,
        required: true
    },
    selected: {
        type: String,
        required: true
    }
})
</script>