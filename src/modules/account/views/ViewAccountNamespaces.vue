<template>
    
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="address" class="mb-6"/>
      <AccountTabs :address="address" selected="namespaces"/>
      <div class="border-2 border-t-0 pb-3" >
        <DataTable :value="namespaces" :paginator="true"  :rows="10"
        dataKey="id" 
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown" :rowsPerPageOptions="[10,20,30,40,50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        responsiveLayout="scroll">
        <template #empty>
            No namespaces found.
        </template>
        <template #loading>
            Loading namespaces data. Please wait.
        </template>

        <Column field="id" header="ID" >
            <template #body="{data}" bodyStyle="	min-width: max-content;">
                <a :href="explorerLink(data.id)" target=_new class="col-span-2"><div  class="min-w-min uppercase inline-block text-xs mt-1.5 cursor-pointer text-blue-primary pr-7 ">{{data.id}}</div></a>
            </template>
        </Column>
        <Column field="name" header="Name"  >
            <template #body="{data}">
                {{data.name}}
            </template>
            
        </Column>
        <Column field="linked" header="Linked Asset/Address" >
            <template #body="{data}">
                <div class="truncate">{{data.linkedAssetAddress}}</div>
            </template>
        </Column>
        <Column field="expiry" header="Expiry" >
            <template #body="{data}">
               {{data.expiringBlock}}
            </template>
        </Column>
        <Column field="active" header="Active"  >
            <template #body="{data}">
               <img v-if="data.isActive" src="@/assets/img/icon-green-tick.svg" class="h-5 w-5 ml-1">
                <img v-else src="@/assets/img/icon-red-x.svg" class="h-5 w-5 ml-1">
            </template>
        </Column>
        <Column field="actions" header="Actions" >
            <template #body="{data,index}">
              <NamespaceAction :address="address" :id="data.id" :name="data.name"></NamespaceAction>
            </template>
            
        </Column>
    </DataTable>
        <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="mt-2 bg-blue-primary py-3 mx-6 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-52 "><img src="@/assets/img/icon-plus.svg" class="inline-block mr-2">{{$t('namespace.registerNewNamespace')}}</router-link>
      </div>
        
    </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { AppState } from "@/state/appState";
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { Address } from "tsjs-xpx-chain-sdk";
import { computed, ref, watch } from "vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue"
import NamespaceAction from '../components/NamespaceAction.vue';
    
  const props = defineProps({
    address: String
  }) 

  const acc = computed(()=>{
    if(!walletState.currentLoggedInWallet){
      return null
    }
    let acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == props.address) || walletState.currentLoggedInWallet.others.find((add) => add.address == props.address);
    if(!acc){
      return null
    }
    return acc
  })

  const toggleMenu = ref([])

  const isHover = ref([])

  const namespaces = computed(()=>{
    if(!acc.value){
      return
    }
    let namespaces :{name:string,id: string,linkedAssetAddress:string,expiringBlock: number | string,isActive: boolean }[] =[]
    for(let i=0;i<acc.value.namespaces.length;i++){
      let namespace = acc.value.namespaces[i]
      if(!namespace.endHeight){
        namespace.endHeight = 0
      }
       namespaces.push({
        name:namespace.name,
        id: namespace.idHex,
        linkedAssetAddress: namespace.linkedId!=''?namespace.linkType==2?Address.createFromRawAddress(namespace.linkedId).pretty():namespace.linkedId:'-',
        expiringBlock: namespace.endHeight,
        isActive: validateExpiry(namespace.name)? true : Number(namespace.endHeight) > AppState.readBlockHeight ?true: false 
      })
    }
    return namespaces
  })

  const validateExpiry = (name :string)=>{
    if(name.includes('prx')){
      return true
    }
    return false
  }
  

  const init = async() =>{
    /* await getNamespaceInfo() */
    for(let i = 0;i<namespaces.value.length;i++){
      isHover.value.push(false)
      toggleMenu.value.push(false)
    }
  }
  
  if(AppState.isReady){
    init();
  }else{
    let readyWatcher = watch(AppState, (value) => {
      if(value.isReady){
        init();
        readyWatcher();
      }
    });
  }

   const explorerLink = namespaceId=>{ 
    if(!networkState.currentNetworkProfile){
      return ''
    }
    return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute + '/' + namespaceId
  }


</script>

