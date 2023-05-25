<template>
  <div>
  
  <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
    <AccountComponent :address="address" class="mb-6"/>
    <AccountTabs :address="address" selected="multisig"/>
    <div class=' p-6 border-2 border-t-0 '>
      <div v-if="isMultisig" class="flex cursor-pointer">
        <div class="border-2 border-blue-primary p-1 mb-3 w-16 text-white bg-blue-primary text-xs text-center font-semibold ">{{$t('general.multisig')}}</div>
        <router-link :to="{name:'ViewMultisigScheme', params: { address: address}}" class="border-2 border-blue-primary p-1 mb-3 w-16 text-blue-primary text-xs text-center font-semibold ">{{$t('general.scheme')}}</router-link>
      </div>
      <div class='text-xs font-semibold'>{{$t('multisig.accountCosignatories')}}</div>
      <div class='border p-4 my-3 '>
       <div class="flex flex-col gap-2">
        <div v-for="(cosigner,index) in cosignerAccountsList" :key="index">
            <div class="border w-full cursor-pointer rounded-md p-3" @click="navigate(cosigner.address)">
              <div class="text-txs font-semibold text-blue-primary">{{cosigner.name}}</div>
              <div class="flex">
                <div :id="`cosignerAddress${index}`" :copyValue="cosigner.address" :copySubject="$t('general.address')" :title="cosigner.address" class="truncate md:text-clip md:w-auto text-txs font-bold mt-1">{{cosigner.address}}</div>
                <font-awesome-icon icon="copy" @mouseover="isHover = true" @mouseout="isHover = false" :title="$t('general.copy')" @click="copy(`cosignerAddress${index}`)" class="ml-2 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
                <img v-if="findAccountWithAddress(cosigner.address)" class="w-5 h-5 ml-auto" src="@/assets/img/chevron_right.svg" >
              </div>
            </div>
        </div>
       </div>
        <div v-if="!isMultisig" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
        <div class='flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 text-center justify-center '>
          <span v-if="!isMultisig"> {{$t('multisig.noCosigner',{name:acc?acc.name:''})}}</span>
        </div>
      </div>
      <router-link :to="{ name: isMultisig ? 'ViewMultisigEditAccount' : 'ViewMultisigConvertAccount', params: { address: address}}" class="blue-btn py-2 px-2 ">{{$t('multisig.manageCosignatories')}}</router-link>
      <div class="gray-line my-8"></div>
      <div class='text-xs font-semibold'>{{$t('multisig.cosignatoryOf')}}</div>
      <div class='border p-4 mt-3'>
        <div v-if="multisigLength" class="w-full">
          <button
            class="mr-5 w-32 blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
            @click="expandTree()"
          >
            Expand All
          </button>
          <button
            class="w-32 blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto"
            @click="collapseTree()">
            Collapse All
          </button>
          <Tree v-model:expandedKeys="expandedKeys" :value="multisigAddress" :filter="true" filterMode="strict" @node-select="onNodeSelect" selectionMode="single" class="pt-1.5"></Tree>
        </div>
        <div v-if="!multisigLength" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
        <div v-if="!multisigLength" class='flex text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 justify-center text-center'>
          <span v-if="!multisigLength"> {{$t('multisig.noMultisig',{name:acc?acc.name:''})}}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { walletState } from '@/state/walletState';
import {  ref, computed } from "vue";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { multiSign } from '@/util/multiSignatory';
import {Address, PublicAccount} from  "tsjs-xpx-chain-sdk"
import { networkState } from '@/state/networkState';
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { AppState } from '@/state/appState';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { setDefaultAccInStorage } from '@/models/account';
import { MultisigInfo } from '@/models/multisigInfo';
import { WalletUtils } from '@/util/walletUtils';
import Tree from 'primevue/tree';
export default {
    name: "ViewMultisigHome",
    props: {
        address: String
    },
    components:{
      AccountComponent,
      AccountTabs
    },
    setup(p){
      const {t} = useI18n()
      const toast = useToast();
      const acc = computed(()=>{
        if(!walletState.currentLoggedInWallet){
          return null
        }
        let acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == p.address) || walletState.currentLoggedInWallet.others.find((add) => add.address == p.address);
        if(!acc){
          return null
        }
        return acc
      })
      const getPlainAddress = address => {
        return Address.createFromRawAddress(address).plain()
      }
      const findAccountWithAddress = address =>{
        let plainAddress = getPlainAddress(address)
          const findAcc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==plainAddress) || walletState.currentLoggedInWallet.others.find(acc=>acc.address==plainAddress) 
          if(findAcc==undefined){
            return false
          }
          return true
      }
      const checkOtherAcc = address =>{
        let plainAddress = Address.createFromRawAddress(address).plain()
        if(walletState.currentLoggedInWallet.others.find(acc=>acc.address==plainAddress)){
          return true
        }
        return false
      }
      const isMultisig = ref(false) 
      const networkType = AppState.networkType
      const convertAddress = publicKey =>{ 
        return Address.createFromPublicKey(publicKey, networkType)
      }
      const findAccount = publicKey =>{
        return walletState.currentLoggedInWallet.accounts.find(account=>account.address == convertAddress(publicKey).plain())?walletState.currentLoggedInWallet.accounts.find(account=>account.address == convertAddress(publicKey).plain()): walletState.currentLoggedInWallet.others.find(account=>account.address == convertAddress(publicKey).plain())
      }
      const getAccountName = (publicKey) =>{
        const address = PublicAccount.createFromPublicKey(publicKey,networkType).address.plain()
        const contact = walletState.currentLoggedInWallet.contacts.find((contact) => contact.address==address);
        if (contact){
          return contact.name
        }else{
          return findAccount(publicKey) ? findAccount(publicKey).name : `Cosigner-${convertAddress(publicKey).plain().substr(-4)}`
        }
      }
      
      let cosignerAccountsList = computed(()=>{
        if(!acc.value){
          return []
        }
        let cosignerAccountsList= []
        let cosignerAccounts =  acc.value.multisigInfo.filter(info=>info.level== 1)
        cosignerAccounts.forEach(account=>cosignerAccountsList.push({name: getAccountName(account.publicKey),address:  PublicAccount.createFromPublicKey(account.publicKey,networkType).address.pretty()}))
        return cosignerAccountsList
      },{deep:true})
      
      //check if account is a multisig
      let verifyMultisig = multiSign.checkIsMultiSig(acc.value?acc.value.address:'')
      isMultisig.value = verifyMultisig;
    
      const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject +' '+ t('general.copied'), group: 'br-custom', life: 3000});
    };
    const isHover = ref(false)
    const router = useRouter()
    const setDefaultAcc = (name)=>{
      if(walletState.currentLoggedInWallet.accounts.find(acc=>acc.name==name)){
        walletState.currentLoggedInWallet.setDefaultAccountByName(name)
      }
    }
    const getAccountNameByAddress = (address)=>{
      let findAcc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address ==address) || walletState.currentLoggedInWallet.others.find(acc=>acc.address ==address)
      if(findAcc){
        return findAcc.name
      }else{
        return ""
      }
    }

    const navigate = (address) =>{
      if(findAccountWithAddress(address) && !isHover.value && !checkOtherAcc(address)){
        setDefaultAcc(getAccountNameByAddress(Address.createFromRawAddress(address).plain()))
        setDefaultAccInStorage(Address.createFromRawAddress(address).plain())
        router.push({ name: 'ViewAccountDetails', params: { address:getPlainAddress(address) }})
      }else if(findAccountWithAddress(address)){
        router.push({ name: 'ViewAccountDetails', params: { address:getPlainAddress(address) }})
      }
      if(!networkState.currentNetworkProfile){
        return ''
      }
      if(!findAccountWithAddress(address,true)){
        window.open(networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.addressRoute + '/' + address)
      }
    }
    const multisigAddress = ref([]);
    const multisigLength = ref(0);
    const generateMultisigInfoBelowLevelZero = async (strAddress) => {
      if (!AppState.isReady) {
        setTimeout(generateMultisigInfoBelowLevelZero, 1000);
        return;
      }
      if (!AppState.chainAPI) {
        return;
      }
      let address = Address.createFromRawAddress(strAddress);
      let graphInfo =
        await AppState.chainAPI.accountAPI.getMultisigAccountGraphInfo(address);
      let multisigInfos= [];
      graphInfo.multisigAccounts.forEach((value, key) => {
        const level = key;
        for (let i = 0; i < value.length; ++i) {
          let multiInfo = value[i];
          let newMultisigInfo = new MultisigInfo(
            multiInfo.account.publicKey,
            level,
            multiInfo.cosignatories.map((cosign) => cosign.publicKey),
            multiInfo.multisigAccounts.map((cosign) => cosign.publicKey),
            multiInfo.minApproval,
            multiInfo.minRemoval
          );
          multisigInfos.push(newMultisigInfo);
        }
      });
      var multisigAccounts = [];
      var indexNo = 0
      multisigAccounts.push({
        key: "0",
        label: "Level 1",
        selectable: false,
        children: []
      })
      multisigAccounts.push({
        key: "1",
        label: "Level 2",
        selectable: false,
        children: []
      })
      multisigAccounts.push({
        key: "2",
        label: "Level 3",
        selectable: false,
        children: []
      })

      const multisigAccBelowLevelZero = multisigInfos.filter((accounts) => accounts.level < 0 ).map(acc => WalletUtils.createAddressFromPublicKey(acc.publicKey, AppState.networkType).plain())
      const multisigAccLevelNOne = multisigInfos.filter((accounts) => accounts.level == -1 ).map(acc => WalletUtils.createAddressFromPublicKey(acc.publicKey, AppState.networkType).pretty())

      multisigAccLevelNOne.forEach((element) => {
        multisigAccounts[0].children.push(
          {
            key: '0-' + indexNo.toString(),
            label: getAccountNameByAddress(Address.createFromRawAddress(element).plain())?getAccountNameByAddress(Address.createFromRawAddress(element).plain()):element,
            data: element,
            selectable: true
          }
        )
        indexNo++
      })
      indexNo = 0

      const multisigAccLevelNTwo = multisigInfos.filter((accounts) => accounts.level == -2 ).map(acc => WalletUtils.createAddressFromPublicKey(acc.publicKey, AppState.networkType).pretty())

      multisigAccLevelNTwo.forEach((element) => {
        multisigAccounts[1].children.push(
          {
            key: '1-' + indexNo.toString(),
            label: getAccountNameByAddress(Address.createFromRawAddress(element).plain())?getAccountNameByAddress(Address.createFromRawAddress(element).plain()):element,
            data: element,
            selectable: true
          }
        )
        indexNo++
      })
      indexNo = 0

      const multisigAccLevelNThree = multisigInfos.filter((accounts) => accounts.level == -3 ).map(acc => WalletUtils.createAddressFromPublicKey(acc.publicKey, AppState.networkType).pretty())

      multisigAccLevelNThree.forEach((element) => {
        multisigAccounts[2].children.push(
          {
            key: '2-' + indexNo.toString(),
            label: getAccountNameByAddress(Address.createFromRawAddress(element).plain())?getAccountNameByAddress(Address.createFromRawAddress(element).plain()):element,
            data: element,
            selectable: true
          }
        )
        indexNo++
      })
      indexNo = 0

      multisigAddress.value = multisigAccounts
      multisigLength.value = multisigAccBelowLevelZero.length;
      expandTree()
    };
    generateMultisigInfoBelowLevelZero(p.address)

    const onNodeSelect = (node) => {
      if(findAccountWithAddress(node.data) && !isHover.value && !checkOtherAcc(node.data)){
        setDefaultAcc(getAccountNameByAddress(Address.createFromRawAddress(node.data).plain()))
        setDefaultAccInStorage(Address.createFromRawAddress(node.data).plain())
        router.push({ name: 'ViewAccountDetails', params: { address:getPlainAddress(node.data) }})
      }else if(findAccountWithAddress(node.data)){
        router.push({ name: 'ViewAccountDetails', params: { address:getPlainAddress(node.data) }})
      }
      if(!networkState.currentNetworkProfile){
        return ''
      }
      if(!findAccountWithAddress(node.data,true)){
        window.open(networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.addressRoute + '/' + node.data)
      }
    }

    const expandedKeys = ref({});
    const expandTree = () => {
        for (let node of multisigAddress.value) {
            expandNode(node);
        }

        expandedKeys.value = { ...expandedKeys.value };
    };
    const collapseTree = () => {
        expandedKeys.value = {};
    };
    const expandNode = (node) => {
        if (node.children && node.children.length) {
            expandedKeys.value[node.key] = true;
        }
    };

      return{
        findAccountWithAddress,
        isHover,
        navigate,
        copy,
        isMultisig,
        acc,
        cosignerAccountsList,
        multisigAddress,
        multisigLength,
        onNodeSelect,
        expandedKeys,
        expandTree,
        collapseTree
      }
    }
}
</script>

<style scoped lang="scss">
.p-tree::v-deep{
  border: none;
  padding: 0;
  .p-link {
    margin-top: 0px;
  }
  .p-treenode-children {
    padding: 0 0 0 1rem;
  }
  .p-tree-container .p-treenode .p-treenode-content {
    border-radius: 6px;
    transition: box-shadow 0.2s;
    padding: 0.5rem;
  }
  .p-treenode-label{
    border: 1px solid rgb(231, 231, 234);
    border-radius: 6px;
    padding: 20px 12px;
    width: 100%;
    font-size: 10px;
    line-height: 12px;
    font-weight: 700;
  }
  .p-tree-filter-container{
    width: 99%;
    border: 1px solid rgb(231, 231, 234);
    border-radius: 6px;
    padding: 6px 10px;
    margin: 6px 0px
  }
  .p-tree-filter{
    width: 98%;
    outline: none;
    height: 40px;
    border: none;
  }
}
</style>