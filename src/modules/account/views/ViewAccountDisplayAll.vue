<template>
  <div>
    <div class='my-4 w-11/12 ml-auto mr-auto flex flex-row-reverse'>
      <router-link :to="{name:'ViewAccountCreateSelectType'}" >
        <div class="mt-3 sm:mt-0 text-center w-44 text-white bg-blue-primary rounded-md font-semibold text-xs p-2">+ {{$t('general.createNewAcc')}}</div>
      </router-link>
    </div>
    <div class='mt-2 py-3 '>
      <div class="w-11/12 ml-auto mr-auto flex flex-col gap-3">
        <div class="grid grid-cols-5">
          <div class="flex items-center col-span-2">
            <font-awesome-icon icon="search" class="text-blue-link mr-1"></font-awesome-icon>
            <input v-model="filterQuery" type="text" class="py-2 px-2 outline-none text-xs text-black" :placeholder="$t('general.search')">
          </div>
          <div class="col-span-3">
            <LabelComponent />
          </div>
        </div>
        <AccountTile :key="index" :account="item" v-for="(item, index) in filteredAccounts" />
      </div>
    </div>
    <div class="mb-36"/>
  </div>
</template>
<script>
import { ref,computed, getCurrentInstance } from "vue";
import AccountTile from '@/modules/account/components/AccountTile.vue';
import { walletState } from '@/state/walletState';
import { AppState } from '@/state/appState';
import LabelComponent from'@/modules/account/components/LabelComponent.vue'
export default {
  name:"ViewAccountDisplayAll",
  components: {
    AccountTile,
    LabelComponent
  },

  setup() { 
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const totalAcc = computed(()=>{

      if(!walletState.currentLoggedInWallet){
        return [];
      }
      let accounts = walletState.currentLoggedInWallet.accounts.map(
        (acc)=>{ 
          return { 
            name: acc.name,
            balance: acc.balance,
            address: acc.address,
            publicKey: acc.publicKey,
            isMultisig: acc.getDirectParentMultisig().length ? true: false,
            multisigInfo: acc.multisigInfo,
          }; 
        });
        
       
       let otherAccounts =walletState.currentLoggedInWallet.others.filter((acc)=> acc.type === "MULTISIG").map(
        (acc)=>{ 
          return { 
            name: acc.name,
            balance: acc.balance,
            address: acc.address,
            publicKey: acc.publicKey,
            isMultisig: true,
            multisigInfo: acc.multisigInfo,
          }; 
        });

        return accounts.concat(otherAccounts);
      
    });

    const isCosigner = (publicKey)=>{
      let account = totalAcc.value
  
      let verify = false;
    
      let tempArr = account.find(acc=>acc.publicKey==publicKey).multisigInfo.filter(account=>account.level == -1)
      verify = tempArr.length>0 ? true: false
      
      return Boolean(verify);
    }

    const cosignInWallet = publicKey=>{
      let acc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==publicKey)? walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==publicKey) : walletState.currentLoggedInWallet.others.find(acc=>acc.publicKey==publicKey)
      let cosignerList = acc.getDirectParentMultisig()
      let cosignerNum = acc.getDirectParentMultisig().length
      let found = false
      for(let i=0; i<cosignerNum;i++){
        if(totalAcc.value.find(acc=>acc.publicKey==cosignerList[i])!= undefined){
          found= true
          break;
        }else{
          continue;
        }
      }
      return found
    }
    
    const accountStructure = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return []
      }
      let accountStructure = {normalAcc:[],multisig:[]}
      
      totalAcc.value.forEach(account=>{
        if(account.multisigInfo.find(multisigAcc=>multisigAcc.level==-1)==undefined && account.multisigInfo.find(multisigAcc=>multisigAcc.level==1)==undefined){
          accountStructure.normalAcc.push(account.publicKey)
        }
      }) //add normal accounts into accountStructure(No cosigners nor multisig)
    
      let delegateAccounts = walletState.currentLoggedInWallet.others.filter(account=>account.type=="DELEGATE")
      delegateAccounts.forEach(delegateAcc=>{
        accountStructure.normalAcc.push(delegateAcc.publicKey)
      })//add delegate accounts into accountStructure
      
      totalAcc.value.forEach(acc=>{
        if(isCosigner(acc.publicKey) &&acc.isMultisig&& !cosignInWallet(acc.publicKey)){ //cosigner account which its cosigner is not in wallet
          let children = acc.multisigInfo.filter(multisig=>multisig.level==-1)//filter direct child
          let childObject = []
          
          children.forEach(child=>{//each direct child
            let grandchildAddresses = child.getMultisigAccountsAddress(AppState.networkType)// find each child's childen
            let grandChildObject = [] 
            grandchildAddresses.forEach(address=>{//for each grandchild
              let acc = totalAcc.value.find(account=>account.address==address)
              if(acc!= undefined){
                grandChildObject.push(acc.publicKey)//get grandchild
              }
            })
            childObject.push({publicKey:child.publicKey,cosignOf:grandChildObject})//push grandchild into child
          })
          accountStructure.multisig.push({publicKey:acc.publicKey,cosignOf:childObject})//push child into parent
        }else if(isCosigner(acc.publicKey)&& !acc.isMultisig){//top level cosigner
          let children = acc.multisigInfo.filter(multisig=>multisig.level==-1)//filter direct child
          let childObject = []
          
          children.forEach(child=>{//each direct child
            let grandchildAddresses = child.getMultisigAccountsAddress(AppState.networkType)// find each child's childen
            let grandChildObject = [] 
            grandchildAddresses.forEach(address=>{//for each child's children
              let acc = totalAcc.value.find(account=>account.address==address)
              let greatGrandChildObject = []
              if(acc!=undefined){
                let greatGrandChild = acc.multisigInfo.filter(multisig=>multisig.level==-1)
                greatGrandChild.forEach(multisig=>{//for each grandchild's children
                  let acc = totalAcc.value.find(account=>account.publicKey==multisig.publicKey)
                  if(acc!=undefined){
                    greatGrandChildObject.push(acc.publicKey)//get great grandchild
                  }
                })
                grandChildObject.push({publicKey:acc.publicKey,cosignOf:greatGrandChildObject}) //push great grandchild into grandchild
              }
            })
            childObject.push({publicKey:child.publicKey,cosignOf:grandChildObject})//push grandchild into child
          })
          accountStructure.multisig.push({publicKey:acc.publicKey,cosignOf:childObject})//push child into parent
        }else{//multisig accounts that are in middle or bottom levels
          //do nothing
        }
      })
      return accountStructure
    },{deep:true})

    const labelNames = ref([])
    const accounts = computed(
      () => {
        if(walletState.currentLoggedInWallet){
          if(walletState.currentLoggedInWallet.others){
            const concatOther = walletState.currentLoggedInWallet.accounts.concat(walletState.currentLoggedInWallet.others)
            let filteredAcc = []
            labelNames.value.forEach(name=>{
              let findLabel = walletState.currentLoggedInWallet.labels.find(label=>label.name==name)
              if(findLabel){
                findLabel.addresses.forEach(address=>{
                  let findAcc = concatOther.find(acc=>acc.address==address)
                  filteredAcc.push(findAcc)
                })
              }
            })
            filteredAcc =  Array.from(new Set(filteredAcc))
            if(labelNames.value.length){
              return filteredAcc
            }else{
              return concatOther
            }
          } else{
            const accounts =  walletState.currentLoggedInWallet.accounts;
            let filteredAcc = []
            labelNames.value.forEach(name=>{
              let findLabel = walletState.currentLoggedInWallet.labels.find(label=>label.name==name)
              if(findLabel){
                findLabel.addresses.forEach(address=>{
                  let findAcc = accounts.find(acc=>acc.address==address)
                  filteredAcc.push(findAcc)
                })
              }
              
            })
            filteredAcc =  Array.from(new Set(filteredAcc))
            if(labelNames.value.length){
              return filteredAcc
            }else{
              return accounts
            }
          }
        } else{
          return null;
        }
      }
    );

    emitter.on('filterByLabel',e=>{
      labelNames.value = e
    })

    const filterQuery = ref("");
    const filteredAccounts = computed(() => {
    const query = filterQuery.value.toLowerCase();
      if(filterQuery.value == ""){
        return accounts.value;
      }
      return accounts.value.filter((item) =>{
        return Object.values(item).some((word) =>
          String(word).toLowerCase().includes(query));
      });
  });

    return {
      accounts,
      filterQuery,
      filteredAccounts
    };
  },
}
</script>

<style scoped>
.explicitLeft{
  @media (min-width: 1024px) { margin-left: 40rem}
  
}
</style>