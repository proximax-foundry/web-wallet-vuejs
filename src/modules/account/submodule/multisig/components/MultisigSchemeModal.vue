<template>
  <div>
    <img src="@/modules/account/submodule/multisig/img/icon-flow-multisig-multilevel-button.svg" class="w-6 h-6 inline-block mr-6 cursor-pointer" @click="toggleModal = !toggleModal">
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <div class="w-104 text-center pb-10">
            <h1 class="default-title font-bold mt-10">{{$t('accounts.scheme')}}</h1>
            <div class="tree overflow-auto ">
              <ul >
                <li class="multiple-wrapper">
                  <div class="box-line single " >
                    <div >
                      <div class="font-bold">{{ graph.name}}</div>
                      <div>{{ graph.cosign.length==0?'Account':'Multisig Account' }}</div>
                    </div>
                  </div>
                <ul class = "flex ">
                  <li v-for="(item, index) in graph.cosign" :key="index"  >
                    <div :class="` ${(item.cosign.length>0)?'box-line': 'box'} single`" >
                      <div>
                        <div class="font-bold">{{ item.name}}</div>
                        <div>{{item.cosign.length==0?'Account':'Multisig Account' }}</div>
                      </div>
                    </div>
                  <ul class = "flex " >
                    <li v-for="(childItem, childIndex) in item.cosign" :key="childIndex" >
                        <div :class="` ${(childItem.cosign.length>0)?'box-line': 'box'} single`" >
                          <div>{{childItem.cosign.length==0?'Account':'Multisig Account' }}</div>
                           <div class="font-bold">{{ childItem.name}}</div>
                        </div>
                    <ul class = "flex " >
                      <li v-for="(grandChildItem, grandChildIndex) in childItem.cosign" :key="grandChildIndex" >
                      <div class="box" >
                        <div>
                          <div class="font-bold">{{ grandChildItem.name}}</div>
                          <div>Account</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>        
          </ul>
        </li>
      </ul>
                
                  
              <!-- <ul>
                <li v-for="(item, index) in graph" :key="index" style="block mb-10">
                  <ul :class="`${ ( item.length > 1)?'multiple-wrapper':''}`" >
                    <li v-for="(layerItem, acc) in item" :key="acc"  :ref="`${acc}class`">
                      <div class="box" :class="`${(item.length == 1 && index == 0)?'single':''} ${(item.length == 1 && index > 0)?'single-middle':''} ${item.length > 1 && index > 0?'multiple':''}`">
                        <div>
                          <div class="font-bold">{{ layerItem.name }}</div>
                          <div>{{ layerItem.cosign.length==0?'Account':'Multisig Account' }}</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul> -->

            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary z-10"></div>
  </div>
</template>

<script>
import { inject, ref, computed } from 'vue';
import {walletState} from '@/state/walletState'
import { WalletUtils } from '@/util/walletUtils';
import {Address, MultisigAccountGraphInfo, PublicAccount} from  "tsjs-xpx-chain-sdk"
import {Helper} from '@/util/typeHelper'
import { networkState } from '@/state/networkState';
import { AccountAPI } from '@/models/REST/account';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
export default{
  name: 'MultisigSchemeModal',
  props: ['multiSigAccount'],

  setup(p){
      const toggleModal = ref(false);
    
   
    let levelOneGraph = []
    const wallet = walletState.currentLoggedInWallet 
    
    const currentAccount = wallet.accounts.find(account=> account.address == p.multiSigAccount.address) 
    const multisigAccounts = currentAccount.multisigInfo.filter(accounts=>accounts.level>=0 | accounts.publicKey == p.multiSigAccount.publicKey)
    const networkType = networkState.currentNetworkProfile.network.type
    const convertAddress = publicKey =>{
        return Address.createFromPublicKey(publicKey, networkType)
    }
    const label = length =>{
      return length>0? 'MULTISIG-':'Cosigner-'
    }
    const findAccount = publicKey =>{
      return wallet.accounts.find(account=>account.address == convertAddress(publicKey).plain())
    }
    const getAccountName = (publicKey,length) =>{
      return findAccount(publicKey) ? findAccount(publicKey).name : label(length) + convertAddress(publicKey).plain().substr(-4)
    }
    const findCosignLength = publicKey =>{
      return multisigAccounts.find(account=>account.publicKey == publicKey).cosignaturies.length
    };

    const findCosign = publicKey =>{
      return multisigAccounts.find(account=>account.publicKey == publicKey).cosignaturies
    }
    
    const getGrandChildObject = (cosignaturies)  =>{
      let tempArray = [] 
      for(let i =0; i < cosignaturies.length; i ++){
        tempArray.push( {address: convertAddress(cosignaturies[i]).plain(), name: getAccountName(cosignaturies[i],findCosignLength(cosignaturies[i]))})
      }
    return tempArray
    }

    const getChildObject = (cosignaturies)  =>{
      let tempArray = []
      let cosigns = []
      let tempArray2 = []
      for(let i =0; i < cosignaturies.length; i ++){
        cosigns = findCosign(cosignaturies[i])
        tempArray2 = getGrandChildObject(cosigns)
        tempArray.push( {address: convertAddress(cosignaturies[i]).plain(), name: getAccountName(cosignaturies[i],findCosignLength(cosignaturies[i])),cosign: tempArray2})
      }
     return tempArray
    }
    let graph = ({address: convertAddress(multisigAccounts[0].publicKey).plain(), name: getAccountName(multisigAccounts[0].publicKey,multisigAccounts[0].cosignaturies.length),cosign: multisigAccounts[0].cosignaturies})
    
    multisigAccounts[0].cosignaturies.forEach( (cosigner)=>{
      let cosigns = []
      let tempArray = []
      cosigns = findCosign(cosigner)
      tempArray =  getChildObject(cosigns)
      levelOneGraph.push({address: convertAddress(cosigner).plain(), name: getAccountName(cosigner,findCosignLength(cosigner)),cosign: tempArray})
     
    })
    
    graph.cosign = levelOneGraph
    console.log(graph)
    
     

   
    //account
   
    
    /* p.multiSigAccount.multisigInfo.forEach( (multiSig, i) => {
      let label;
      let accountName;
      let account = wallet.accounts.find((element) => element.address ===  Address.createFromPublicKey(multiSig.publicKey, networkState.currentNetworkProfile.network.type).plain());
      label = (multiSig.cosignaturies.length>0)?'MULTISIG-':'Cosigner-';
      accountName = (account) ? account.name : (label + Address.createFromPublicKey(multiSig.publicKey, networkState.currentNetworkProfile.network.type).plain().substr(-4));
      if(i==0){
        layer.push({ address: Address.createFromPublicKey(multiSig.publicKey, networkState.currentNetworkProfile.network.type).plain(), name: accountName, label: label, cosign: multiSig.cosignaturies });
        graph.push(layer);
      }else{
        layer.forEach((layer) => {
          if(layer.cosign.find((element) => Address.createFromPublicKey(element, networkState.currentNetworkProfile.network.type).plain() === Address.createFromPublicKey(multiSig.publicKey, networkState.currentNetworkProfile.network.type).plain())){
            newlayer.push({address: Address.createFromPublicKey(multiSig.publicKey, networkState.currentNetworkProfile.network.type).plain(), name: accountName, label: label, cosign: multiSig.cosignaturies });
          }else{
            layer = newlayer;
            graph.push(layer);
            newlayer = [];
            //error
            newlayer.push({address:Address.createFromPublicKey(multiSig.publicKey, networkState.currentNetworkProfile.network.type).plain(), name: accountName, label: label, cosign: multiSig.cosignaturies });
          }
        });
      }
    });
    layer = newlayer;
    graph.push(layer); */
 
    
    return {
      graph,
      toggleModal,
    }
  }
}     
   
    
</script>
<style lang="scss" scoped>

.tree{
  transform: rotate(180deg);
}

ul {
  list-style: none;
}

.box {
  display: inline-block;
  border: 1px solid #DAE3ED;
  position: relative;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  > div{
    transform: rotate(180deg);
  }
}
.box-line {
  display: inline-block;
  border: 1px solid #DAE3ED;
  position: relative;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  > div{
    transform: rotate(180deg);
  }
}
.box-line::after{
  content: "";
  position: absolute;
  bottom: -11px;
  left: 50%;
  width: 2px;
  height: 10px;
  background: #dedede;
}
.single{
  margin: 0 auto 20px;
  background: #fff;
}

.single::before{
  content: "";
  position: absolute;
  top: -20px;
  left: 50%;
  width: 2px;
  height: 0px;
  background: #dedede;
}

.multiple-wrapper {
  position: relative;
  display: inline-block;
}

.multiple-wrapper li::after {
  content: "";
  position: absolute;
  left: 50%;
  top: -10px;
  width: 2px;
  height: 10px;
  background: #dedede;
}

.multiple-wrapper li {
  position: relative;
  display: inline-block;
  padding: 0 10px;
}

.multiple-wrapper{
  li::before{
    content: "";
    position: absolute;
    top: -10px;
    border-top: 2px solid #dedede;
    height: 10px;
    width: 100%;
    left: -10px;
  }
    
  li:first-child::before{
    left: 50%;
  }
 
  
  li:last-child::before{
    right: 50%;
    width: 57.9%
    
  }
  li:only-child:last-child::before{
    right: 50%;
    width: 0%
    
  }
}

</style>