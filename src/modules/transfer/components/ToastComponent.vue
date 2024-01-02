<template>
    <Toast position="top-left" group="tl" />
    <Toast position="top-right" group="tr" />
    <Toast position="center" group="center" />
    <Toast position="bottom-left" group="bl" />
    <Toast position="bottom-right" group="br" style="word-break: break-all;" />
    <Toast position="top-right" group="tr-wait">
      <template #message="slotProps">
        <div style="width: 100%" class="grid grid-cols-12">
          <div class="col-span-2">
            <i class="pi pi-spin pi-spinner" style="font-size: 2.5rem"></i>
          </div>
          <div class="col-span-10">
            <div class="font-semibold">{{slotProps.message.summary}}</div>
          </div>
          <div class="col-span-12">
            <div class="text-sm">{{slotProps.message.detail}}</div>
            <div class="mt-1 text-xs">{{slotProps.message.detail2}}</div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize : 1}rem`" v-if="slotProps.message.url">
              <a :href="slotProps.message.url" target="_blank">
              {{slotProps.message.detail3}}
              </a>
            </div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize : 1}rem`" v-else>{{slotProps.message.detail3}}</div>
          </div> 
        </div>
      </template>
    </Toast>
    <Toast position="top-right" group="tr-custom">
      <template #message="slotProps">
        <div style="width: 100%" class="grid grid-cols-12">
          <div class="col-span-2">
            <i v-if="slotProps.message.severity === 'success'" class="pi pi-check-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'error'" class="pi pi-times-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'info'" class="pi pi-info-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'warn'" class="pi pi-exclamation-circle" style="font-size: 2.5rem"></i>
          </div>
          <div class="col-span-10">
            <div class="font-semibold">{{slotProps.message.summary}}</div>
          </div>
          <div class="col-span-12">
            <div class="text-sm">{{slotProps.message.detail}}</div>
            <div class="mt-1 text-xs">{{slotProps.message.detail2}}</div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize : 1}rem`" v-if="slotProps.message.url">
              <a :href="slotProps.message.url" target="_blank">
              {{slotProps.message.detail3}}
              </a>
            </div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize : 1}rem`" v-else>{{slotProps.message.detail3}}</div>
          </div> 
        </div>
      </template>
    </Toast>
    <Toast position="bottom-right" group="br-custom">
      <template #message="slotProps">
        <div style="width: 100%" class="grid grid-cols-12">
          <div class="col-span-2">
            <i v-if="slotProps.message.severity === 'success'" class="pi pi-check-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'error'" class="pi pi-times-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'info'" class="pi pi-info-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'warn'" class="pi pi-exclamation-circle" style="font-size: 2.5rem"></i>
          </div>
          <div class="col-span-10">
            <div class="font-semibold">{{slotProps.message.summary}}</div>
          </div>
          <div class="col-span-12">
            <div class="text-sm">{{slotProps.message.detail}}</div>
            <div class="mt-1 text-xs">{{slotProps.message.detail2}}</div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize : 1}rem`" v-if="slotProps.message.url">
              <a :href="slotProps.message.url" target="_blank">
              {{slotProps.message.detail3}}
              </a>
            </div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize : 1}rem`" v-else>{{slotProps.message.detail3}}</div>
            <div :style="`font-size: ${slotProps.message.detail4 && slotProps.message.detail4.length > 64 ? 0.4 : 0.5}rem`" >{{slotProps.message.detail4}}</div>
          </div> 
        </div>
      </template>
    </Toast>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';

</script>