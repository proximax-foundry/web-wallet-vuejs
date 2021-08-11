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
            <div class="tree scroll">
              <ul>
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary z-10"></div>
  </div>
</template>

<script>
import { inject, ref } from 'vue';
import {walletState} from '@/state/walletState'
import { WalletUtils } from '@/util/walletUtils';
import {Address, MultisigAccountGraphInfo} from  "tsjs-xpx-chain-sdk"
import {Helper} from '@/util/typeHelper'
import { networkState } from '@/state/networkState';
export default{
  name: 'MultisigSchemeModal',
  props: ['multiSigAccount'],

  setup(p){
      const toggleModal = ref(false);
    
    //account
    let graph = [];
    let layer = [];
    let newlayer = [];
    const wallet = walletState.currentLoggedInWallet 
    p.multiSigAccount.multisigInfo.forEach( (multiSig, i) => {
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
            newlayer.push({address:Address.createFromPublicKey(multiSig.publicKey, networkState.currentNetworkProfile.network.type).plain(), name: accountName, label: label, cosign: multiSig.cosignaturies });
          }
        });
      }
    });
    layer = newlayer;
    graph.push(layer);
 
    
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

.single, .single-middle {
  margin: 0 auto 20px;
  background: #fff;
}

.single-middle::before{
  content: "";
  position: absolute;
  top: -20px;
  left: 50%;
  width: 2px;
  height: 20px;
  background: #D6D6D6;
}

.multiple-wrapper {
  position: relative;
  display: inline-block;
}

.multiple-wrapper-connector{
  height: 2px;
  background: #dedede;
  position: relative;
}

.multiple-wrapper::after {
  content: "";
  position: absolute;
  left: 50%;
  top: -20px;
  width: 2px;
  height: 10px;
  background: #dedede;
}

.multiple-wrapper li {
  position: relative;
  display: inline-block;
  padding: 0 10px;
}


li{
  .multiple {
    margin: 0 auto 40px;
  }

  .multiple::before {
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    height: 10px;
    background: #dedede;
  }
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
    width: 50%;
    border-left: 2px solid #dedede;
  }

  li:last-child::before{
    right: 50%;
    width: 50%;
    border-right: 2px solid #dedede;
  }
}

</style>