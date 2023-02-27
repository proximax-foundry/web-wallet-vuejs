<template>
  <div class="text-red-300">{{ $t("account.accDeletion") }}</div>
  <SupplyInputClean
    :divisibility="divisibility"
    :model-value="data"
    placeholder="Input value"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import SupplyInputClean from "@/components/SupplyInputClean.vue"

const data = ref("0");
const divisibility = ref(1);

</script>


