<template>
  <div>
    <DataTable
    :value="assets"
     :paginator="true" class="p-datatable-customers" :rows="10"
        dataKey="id" :rowHover="true" 
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown" :rowsPerPageOptions="[10,20,30,40,50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        responsiveLayout="scroll"
      >
      <!-- <Column style="width: 250px" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">{{$t('general.assetId')}}</div>
            <div class="uppercase font-bold text-txs">{{data.namespaceNames[0]? data.namespaceNames[0] : data.idHex}}</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">{{$t('general.amount')}}</div>
            <div class="uppercase font-bold text-txs">
                <div class="mb-1 text-txs">{{ data.amount}}</div>
             </div>
          </div>
        </template>
      </Column> -->
     
      <Column field="assetId" :header="$t('general.assetId')" headerStyle="text-transform:uppercase" style="`wideScreen?'min-width: 200px'?'width: 200px'  ` " >
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{data.namespaceNames[0]? data.namespaceNames[0] : data.idHex}}</span>
        </template>
      </Column>
      <Column field="amount" :header="$t('general.amount')" headerStyle="text-transform:uppercase" style="`wideScreen?'min-width: 180px'?'width: 180px'`" >
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{data.amount}}</span>
        </template>
      </Column>
     <!--  <Column style="width: 50px">
        <template #body="{data,index}">
          <div class="text-txs text-center lg:mr-2" @mouseover="hoverOverMenu(index)" @mouseout="hoverOutMenu">
            <img src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block" @click="showMenu(index)">
            <div v-if="isMenuShow[index]" class="mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div role="none" class="my-2">
                <router-link :to="{ name: 'ViewServicesAssetsModifySupplyChange', params: {assetId: data.idHex, address: data.address} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.modifySupply')}}</router-link>
                <router-link :to="{ name: 'ViewServicesAssetsLinkToNamespace', params: {assetId: data.idHex, address: data.address} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.linkToNamespace')}}</router-link>
                <a :href="data.explorerLink" class="block hover:bg-gray-100 transition duration-200 p-2 z-20" target=_new>{{$t('general.viewInExplorer')}}<img src="@/modules/dashboard/img/icon-link-new.svg" class="inline-block ml-2 relative -top-1"></a>
              </div>
            </div>
          </div>
        </template>
      </Column> -->
      <template #empty>
        {{$t('general.noRecord')}}
      </template>
      <template #loading>
         {{$t('dashboard.fetchingTx')}}
      </template>
    </DataTable>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance, watch, toRefs, onUnmounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tooltip from 'primevue/tooltip';

export default{
  components: { DataTable, Column },
  name: 'AssetDataTable',
  props: {
    assets: Array,
  },
  directives: {
    'tooltip': Tooltip
  },

  setup(props, context){

    const wideScreen = ref(false);
    const screenResizeHandler = () => {
      if(window.innerWidth < 1024){
        wideScreen.value = false;
      }else{
        wideScreen.value = true;
      }
    };
    screenResizeHandler();

    onUnmounted(() => {
      window.removeEventListener("resize", screenResizeHandler);
    });

    const { assets } = toRefs(props);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const accountAssets = ref();
    const isMenuShow = ref([]);
    const isNsListShow = ref([]);
    /* watch(assets,n=>{
      for(let i = 0; i< n.length ; i ++){
        isMenuShow.value[i] = false;
        isNsListShow.value[i] = false;
      }
    },{deep:true}) */
   
    onMounted(() => {
      window.addEventListener("resize", screenResizeHandler);
    });

    

    
    const borderColor = ref('border border-gray-400');

    /* const showNsList = (i) => {
      currentNsMenu.value = i;
      isNsListShow.value[i] = !isNsListShow.value[i];
    }

    const showMenu = (i) => {
      currentMenu.value = i;
      isMenuShow.value[i] = !isMenuShow.value[i];
    }

    // emitted from App.vue when click on any part of the page
    emitter.on('PAGE_CLICK', () => {
      var j = 0;
      while(j < isNsListShow.value.length){
        if(j != currentNsMenu.value){
          isNsListShow.value[j] = false;
        }
        j++;
      }

      var k = 0;
      while(k < isMenuShow.value.length){
        if(k != currentMenu.value){
          isMenuShow.value[k] = false;
        }
        k++;
      }
    });

    const currentMenu = ref('empty');
    const currentNsMenu = ref('empty');

    const hoverOverMenu = (i) => {
      currentMenu.value = i;
    };

    const hoverOutMenu = () => {
      currentMenu.value = 'empty';
    };

    const hoverOverNsList = (i) => {
      currentNsMenu.value = i;
    };

    const hoverOutNsList = () => {
      currentNsMenu.value = 'empty';
    };
 */
    return {
      borderColor,
      /* showMenu,
      showNsList,
      isMenuShow,
      isNsListShow, */
      accountAssets,
    /*   hoverOverMenu,
      hoverOutMenu,
      hoverOverNsList,
      hoverOutNsList, */
      wideScreen,
    }
  }
}
</script>

<style lang="scss" scoped>
.p-datatable-tbody{
  td{
    font-size: 11px;
  }
}

.pop-option:after {
  content: '';
  display: block;
  position: absolute;
  top: -6px;
  right: 20px;
  width: 10px;
  height: 10px;
  background: #FFFFFF;
  border-left:1px solid #E4E4E4;
  border-top:1px solid #E4E4E4;
  -moz-transform:rotate(45deg);
  -webkit-transform:rotate(45deg);
  z-index: 2;
}

::v-deep(.p-paginator) {
    .p-paginator-current {
        
        padding: 1rem;
        padding-right:0.5rem;
        color: gray;
        font-size: 12px;
        
    }

    .p-paginator-bottom {
        display:flex;
        align-items: center;
        justify-content: space-between;
    }
    /* .p-paginator-last {
        padding-right:0.5rem;
    } */
    .p-link{
        margin-top: 0px;
    }
    .p-paginator-last.p-link{
        margin-right:0.5rem;
    }
}




::v-deep(.p-datatable.p-datatable-customers) {
        
    .p-dropdown{
        margin-top:0px;
    }
    .p-dropdown-trigger{
        margin-left: auto;
    }
    .p-dropdown-trigger-icon{
        width:50px
    }

    .p-inputtext{
        font-size:12px;
        text-align: center;
    }
    .p-paginator-rpp-options{
        width: 60px;
        border:1px solid;
        border-color:gray;
        font-size: 12px;
    }
    .p-paginator-rpp-options:hover{
        border-color: #007cff
    }
    .p-paginator-page.p-highlight{
        background: #EFF6FF;
        border-color: #EFF6FF;
        color: #1D4ED8;
        border-radius: 50%;
    }
}
</style>