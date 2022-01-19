<template>
  <div>
    <div class='mt-4 w-11/12 ml-auto mr-auto border-b-2 '>
      <div class = 'flex text-xxs md:text-xs font-semibold '>
        <div class= 'w-18 text-center border-b-2 pb-4 lg:pb-3 border-yellow-500'>Overview</div>
        <router-link :to="{ name: 'ViewNormalAccount'}"  class=" w-28 text-center "  style="width:6.5rem">My Accounts</router-link>
        <router-link :to="{ name: 'ViewMultisigAccount'}" class="text-center " style="width:9rem">Multisig Accounts</router-link>
        <router-link :to="{ name: 'ViewOtherAccount'}" class="text-center " style="width:8rem">Other Accounts</router-link>
      </div>
    </div>
    <div class='my-4 w-11/12 ml-auto mr-auto '>
      <router-link :to="{name:'ViewAccountCreateSelectType'}" >
          <div class="float-right mb-4 text-center w-44 text-white bg-blue-primary rounded-md font-semibold text-xs p-2">+ Create New Account</div>
      </router-link>
    </div>
    <div class='mt-2 py-3 '>
      <div class="w-11/12 ml-auto mr-auto flex flex-col gap-3">
        <AccountTile :key="index" :account="item" :showMenuCall="showMenu[index]" :i="index" v-for="(item, index) in accounts" />
      </div>
    </div>
  </div>
</template>
<script>
import { computed, getCurrentInstance, ref } from "vue";
import AccountTile from '@/modules/account/components/AccountTile.vue';
import { useToast } from "primevue/usetoast";
import { walletState } from '@/state/walletState';
import { networkState } from "@/state/networkState";
import { AppState } from '@/state/appState';



export default {
  name:"ViewAccountDisplayAll",
  props:[
    'deleteAccount'
  ],
  components: {
    AccountTile,
  },

  setup(p) {
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const currentMenu = ref('');
    const showMenu = ref([]);
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
    var num_acc = totalAcc.value.length;
    var i = 0;

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

    console.log(accountStructure.value)
    
    while(i < num_acc){
      showMenu.value[i] = false;
      i++;
    }
    
    emitter.on("SHOW_MENU_TRIGGER", payload => {
      showMenu.value[payload] = true;
      currentMenu.value = payload;
    });
    
    emitter.on("CLOSE_MENU_TRIGGER", payload => {
      showMenu.value[payload] = false;
      currentMenu.value = payload;
    });

    emitter.on("CLOSE_ALL_MENU_TRIGGER", () => {
      var j = 0;
      while(j < num_acc){
        showMenu.value[j] = false;
        j++;
      }
    });

    if(p.deleteAccount == 'success'){
      toast.add({severity:'success', summary: 'Notification', detail: 'Account has been removed successfully', group: 'br', life: 5000});
    }

    const accounts = computed(
      () => {
        if(walletState.currentLoggedInWallet){
          if(walletState.currentLoggedInWallet.others){
            const concatOther = walletState.currentLoggedInWallet.accounts.concat(walletState.currentLoggedInWallet.others)
            return concatOther;
          } else{
            return walletState.currentLoggedInWallet.accounts;
          }
        } else{
          return null;
        }
      }
    );
    

    // emitted from App.vue when click on any part of the page
    emitter.on('PAGE_CLICK', () => {
      if(currentMenu.value === ''){
        var k = 0;
        while(k < num_acc){
          showMenu.value[k] = false;
          k++;
        }
      }
    });

    emitter.on('HOVER_OVER_MENU_TRIGGER', index => {
      currentMenu.value = index;
    });

    emitter.on('HOVER_OUT_MENU_TRIGGER', () => {
      currentMenu.value = '';
    });

    return {
      walletState,
      accounts,
      showMenu
    };
  },
}
</script>
