<template>
<div class="flex flex-col">
    <div @click="toggleSelection=!toggleSelection" class="border p-2 cursor-pointer w-52 bg-white text-xs justify-between flex">
        <div>Labels</div> 
        <img v-if="!toggleSelection" src="@/modules/account/img/icon-arrow-down.svg" class="w-3 ml-2 h-3" style="margin-top: 0.12em;">
        <img v-else src="@/modules/account/img/icon-arrow-down.svg" class="w-3 ml-2 h-3" style="margin-top: 0.12em;transform: rotate(180deg);">
    </div>
    <div v-if="toggleSelection" class="relative">
        <div class="absolute border-t-0 w-52 border bg-white ">
            <div class="flex flex-col max-h-44 overflow-auto">
                <div v-for="(label,index) in labels" :key="index">
                    <div @click="!isHover?filteredList[index]=!filteredList[index]:''" :class="`${filteredList[index]?'bg-blue-300 flex cursor-pointer p-2 hover:bg-blue-300 ':'flex cursor-pointer p-2 hover:bg-blue-300 '}`">
                        <font-awesome-icon icon="tag" class="w-4 h-4 mr-3 thin"/>
                        <div class="text-xs mt-0.5">{{label.name}}</div>
                        <font-awesome-icon icon="trash" @mouseover="isHover = true" @mouseout="isHover = false" @click="removeLabel(index)" title="Remove label" class='ml-auto w-3 h-3 cursor-pointer mt-0.5'/>
                    </div>
                </div>
                <div @click="toggleModal=true;toggleSelection=false" class="text-xs cursor-pointer flex gap-3 p-2 hover:bg-blue-300 ">
                    <font-awesome-icon icon="plus" class="w-3 h-3 mr-1"/>
                    <div>Create Label</div>
                </div>
            </div>
        </div>
    </div>
</div>
<div v-if="toggleModal" class="popup-outer fixed flex z-50">
    <div class="modal-popup-box ">
        <div>
            <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
            <div class= 'text-center my-2 text-xs font-semibold'>Create Label</div>
            <TextInputClean placeholder="Label Name"  v-model="labelName"  />
            <div @click="createLabel()" class = 'blue-btn font-semibold py-2 cursor-pointer text-center ml-auto mr-auto w-7/12 disabled:opacity-50 disabled:cursor-auto' >{{$t('general.confirm')}}</div>
            <div class= 'text-center cursor-pointer text-xs font-semibold text-blue-link mt-2' @click="toggleModal = false">{{$t('general.cancel')}}</div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
export default {
    name:"LabelComponent"
}
</script>

<script setup lang="ts">
import TextInputClean from '@/components/TextInputClean.vue';
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { walletState } from '@/state/walletState';
import { Label } from '@/models/label';
import { useToast } from 'primevue/usetoast';

    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const toast = useToast();
    const toggleSelection = ref(false)
    const toggleModal = ref(false)
    const isHover = ref(false)
    const err = ref('')
    const labelName = ref('')
    const filteredList = ref<boolean[]>([])
    const labels = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return []
      }else{
        return walletState.currentLoggedInWallet.labels
      }
    })
    for(let i=0;i<labels.value.length;i++){
        filteredList.value.push(false)
    }
    watch(labels,(n,o)=>{
        filteredList.value = []
        for(let i=0;i<n.length;i++){
            filteredList.value.push(false)
        }
    },{deep:true})

    watch(filteredList,n=>{
        let labelNames :string[] = []
        if(n.length!=labels.value.length){
            return
        }
        n.forEach((filteredLabel,index)=>{
            if(filteredLabel){
                labelNames.push(labels.value[index].name)
            }
        })
        emitter.emit('filterByLabel',labelNames)
    },{deep:true})
    const createLabel = async()=>{
        if(!walletState.currentLoggedInWallet){
            return 
        }
        labelName.value = labelName.value.trim()
        if(labelName.value == ""){
            err.value = 'Label name cannot be empty.'
            return
        }
        let findExistingLabel = walletState.currentLoggedInWallet.labels.find(label=>label.name==labelName.value)
        if(findExistingLabel){
            err.value = 'Label is already existed in wallet.'
            return
        }
        let label = new Label(labelName.value,[])
        walletState.currentLoggedInWallet.addLabel(label) 
        await walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet)
        err.value = ''
        labelName.value = ""
        toast.add({severity:'info', summary: 'Label', detail: 'New Label is Created', group: 'br', life: 5000});
        toggleModal.value = false
    }

    const removeLabel = async(index)=>{
        if(!walletState.currentLoggedInWallet){
            return 
        }
        walletState.currentLoggedInWallet.removeLabel(index)
        await walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet)
        toast.add({severity:'info', summary: 'Label', detail: 'Label is removed', group: 'br', life: 5000});
        isHover.value = false
    }

</script>

