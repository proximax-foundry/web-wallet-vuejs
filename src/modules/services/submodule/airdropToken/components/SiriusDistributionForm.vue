<script setup lang="ts">
import { ref, watch } from 'vue'
import { 
  PublicAccount, NetworkType, MosaicId, Account,
  AccountHttp, MosaicHttp, Convert, Address
} from 'tsjs-xpx-chain-sdk';
import { SimpleSDA } from '@/models/sda'
// import {parse} from 'csv-parse'
import {sum} from 'mathjs'
import {DistributeListInterface, Sirius} from "@/models/sirius"
import { AppState } from '@/state/appState';
import {networkState} from "@/state/networkState";
import * as mathjs from "mathjs"

const distributePublicKey = ref("");
let intiatorPrivateKey = ref('');

let api = "https://api-2.testnet2.xpxsirius.io";
let explorerURL = "https://bctestnetexplorer.xpxsirius.io";
let accountHttp = new AccountHttp(api);
let mosaicHttp = new MosaicHttp(api);
// let data = reactive<DataInterface>({
//   assetList: []
// });

let assetList = ref<SimpleSDA[]>([]);
let assetSelected = ref("");
let aggregateNum = ref(10);
let distributionList = ref<DistributeListInterface[]>([]);
let totalRecipients = ref(0);
let totalDistributeAmount = ref(0);
let txnsHash = ref<string[]>([]);

// all status flags
let noAssetFound = ref(false);
let fileError = ref(false);
let assetNotEnough = ref(false);
let assetWrongDivisibility = ref("");
let distributeDone = ref(false);
let distributionError = ref("");
let distributing = ref(false);

let knownToken = [{
    namespace: "prx.xpx",
    name: "XPX"
  },
  {
    namespace: "prx.metx",
    name: "METX"
  },{
    namespace: "xarcade.xar",
    name: "XAR"
  }];

let scanDistributorAsset = async() =>{
  noAssetFound.value = false;
  assetSelected.value = "";
  let assets = await Sirius.scanAsset(distributePublicKey.value);

  assetList.value = assets;

  if(assets.length === 0){
    noAssetFound.value = true;
  }
}

let distribute = async()=>{
  distributionError.value = "";
  distributeDone.value = false;
  if(distributing.value){
    return;
  }

  if(assetNotEnough.value || assetWrongDivisibility.value){
    return;
  }
  else if(assetSelected.value === ""){
    distributionError.value = "Please select SDA";
    return;
  }
  else if(totalRecipients.value === 0){
    distributionError.value = "No recipient to distribute";
    return;
  }
  else if(distributePublicKey.value === '' || distributePublicKey.value.length !== 64 || !Convert.isHexString(distributePublicKey.value)){
    distributionError.value = "Please fill in distributor public key";
    return;
  }

  let totalLockHashTxn = Math.ceil(totalRecipients.value/ aggregateNum.value);

  let totalLockHashFee = totalLockHashTxn * Sirius.getLockFundTransactionFee();
  let totalLockHashToken = totalLockHashTxn * networkState.currentNetworkProfileConfig!.lockedFundsPerAggregate!;

  let selectedSda = assetList.value.find(x => x.id === assetSelected.value);
  let aggregateTxns = Sirius.createDistributeAggregateTransactions(distributePublicKey.value, distributionList.value, aggregateNum.value, selectedSda!);
  let totalAggregateTxnsFee = sum(aggregateTxns.map(x=> x.maxFee.compact()));
  let totalInitiatorFee = sum(totalLockHashFee, totalLockHashToken, totalAggregateTxnsFee);

  let xpxNeeded = totalInitiatorFee / Math.pow(10, AppState.nativeToken.divisibility);

  let initiator = Sirius.createAccount(intiatorPrivateKey.value);
  let initiatorSda = await Sirius.scanAsset(initiator.publicKey);

  let initiatorXPX = initiatorSda.find(x => x.namespaceName === AppState.nativeToken.fullNamespace.trim());

  if(initiatorXPX){
    if(xpxNeeded > initiatorXPX.amount){
      distributionError.value = `Initiator do not have enough XPX (${initiatorXPX.amount}), need ${xpxNeeded}`;
      return;
    }
  }
  else{
    distributionError.value = "Initiator do not have any XPX";
    return;
  }

  distributing.value = true;
  let allTxnsHash  = await Sirius.signAllAbtAndAnnounce(aggregateTxns, initiator);
  distributing.value = false;

  distributeDone.value = true;
  intiatorPrivateKey.value = "";

  txnsHash.value = allTxnsHash;
}

let loadCSV = (e: any)=>{
  fileError.value = false;
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = async (e: any) => {
    const fileData = e.target.result;
    
    try {
      let distResultCsvData: any[] = [];

      let totalLine = fileData.split(/\r?\n/);

      for(let i =1; i < totalLine.length; i++){
        let lineData = totalLine[i].trim();
        if(lineData === ""){
          break;
        }
        let data = lineData.split(",");
        distResultCsvData.push({
          publicKeyOrAddress: data[0],
          amount: data[1]
        });
      }
      // let distResultCsvData: any = await new Promise(function(resolve, reject) {
      //   parse(fileData, {from_line: 2, columns: ["publicKey", "amount"]}, (err, rows)=>{
      //       if(err){
      //           reject(err);
      //       }else{
      //           resolve(rows);
      //       }
      //   });
      // });

      let isInvalidData = false;
      distributionList.value = [];
      let tempData: DistributeListInterface[] = [];

      if(distResultCsvData && distResultCsvData.length){

        for(let i=0; i < distResultCsvData.length; ++i){
          let publicKeyOrAddress = distResultCsvData[i].publicKeyOrAddress.trim().replaceAll("-","");
          let originAmount = distResultCsvData[i].amount.trim();
          let amount = parseFloat(distResultCsvData[i].amount.trim());

          if(publicKeyOrAddress.length === 64){
            if(!Convert.isHexString(publicKeyOrAddress)){
              isInvalidData = true; 
              console.log("Invalid recipient publicKey found");
              break;
            }
          }
          else if(publicKeyOrAddress.length === 40){
            let tempAddress = Address.createFromRawAddress(publicKeyOrAddress);
            if(tempAddress.networkType !== AppState.networkType){
              isInvalidData = true;
              console.log("Invalid recipient address found");
              break;
            }
          }
          else{
            isInvalidData = true;
            console.log("Invalid recipient found");
            break;
          }
          
          let newAmountLength = amount.toString().length;

          if(isNaN(amount)){
            isInvalidData = true;
            console.log("Invalid amount found");
            break;
          }
          else if(newAmountLength !== originAmount.length){
            let strippedDecimal = originAmount.length - newAmountLength;

            if(amount.toString() + "0".repeat(strippedDecimal) !== originAmount){
              isInvalidData = true;
              console.log("Invalid amount found");
              break;
            }
          }

          let newData: DistributeListInterface = {
            publicKeyOrAddress: publicKeyOrAddress,
            amount: amount
          }; 

          tempData.push(newData);
        }
      }

      if(!isInvalidData){
        totalRecipients.value = distResultCsvData.length;
        totalDistributeAmount.value = sum(tempData.map( (x) => x.amount));
        distributionList.value = tempData; 
      }
      else{
        fileError.value = true;
        distributionList.value = [];
        totalRecipients.value = 0;
        totalDistributeAmount.value = 0;
      }
      
    } catch (error) {
      fileError.value = true;
    }
       
  }
  reader.readAsText(file);
}

let createTxnExplorerLink = (txnHash: string) =>{
  let explorerRoute = networkState.currentNetworkProfile!.chainExplorer;
  return explorerRoute.url + "/" + explorerRoute.hashRoute + "/" + txnHash
}

let dropFieldActive = ref(false);

let setInactive = () =>{
  dropFieldActive.value = false;
}

let setActive = () =>{
  dropFieldActive.value = true;
}

let checkDistributorAssetAmount = (selectedAssetId: string)=>{
  if(selectedAssetId){
    let data = assetList.value.find(x => x.id === selectedAssetId);

    if(totalDistributeAmount.value > data!.amount){
      assetNotEnough.value = true;
    }
    else{
      assetNotEnough.value = false;
    }
  }
  else{
    assetNotEnough.value = false;
  }
}

let checkDistributorAssetAmountDecimal = (selectedAssetId: string)=>{
  if(selectedAssetId){
    let data = assetList.value.find(x => x.id === selectedAssetId );

    let invalidDivisibility = distributionList.value.find(x =>{
      let bigNumberAmount = mathjs.bignumber(x.amount);
      let atomicAmount = mathjs.multiply(bigNumberAmount, Math.pow(10, data!.divisibility));
      let atomic = Number(atomicAmount.toString());
      return Math.trunc(atomic) !== atomic
    });

    if(invalidDivisibility){
      assetWrongDivisibility.value = "Invalid distribution amount, maximum decimal place is " + data!.divisibility;
    }
    else{
      assetWrongDivisibility.value = "";
    }
  }
  else{
    assetWrongDivisibility.value = "";
  }
}

watch(assetSelected, (value) => {
  checkDistributorAssetAmount(value);
  checkDistributorAssetAmountDecimal(value);
});

watch(totalDistributeAmount, (value) => {
  checkDistributorAssetAmount(assetSelected.value);
  checkDistributorAssetAmountDecimal(assetSelected.value);
});

</script>

<template>
  <div class="container">
    <div class="p-2">
      <div>
        <label class="font-semibold">Distributor Account</label>
        <div class="mb-3 w-3/4 flex justify-between">
          <input type="text" class="border border-gray-200 rounded-l-md w-3/4 px-2 py-1 font-sans" v-model="distributePublicKey" placeholder="Enter Distributor Account's Public Key" aria-label="Distributor Account's Public Key" 
          aria-describedby="button-addon">
          <button class="border rounded-r-md border-black w-1/4 px-2 py-1 hover:bg-gray-700 hover:text-white" @click="scanDistributorAsset()" type="button" id="button-addon">Scan SDAs</button>
        </div>
        <div v-if="noAssetFound" class="font-semibold text-red-600" role="alert">
          No SDA found
        </div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <div class="flex flex-col-reverse">
          <select class="w-3/4" v-model="assetSelected" aria-label="Floating label select example">
            <option value="" selected>Select SDA to distribute</option>
                      <option v-for='asset, index in assetList' :key='index' :value="asset.id">
                        {{ asset.amount }} - {{ asset.label }}
                      </option>
          </select>
          <label class="font-medium text-gray-400" for="floatingSelect">Sirius Digital Asset</label>
        </div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <div class="flex flex-col-reverse">
          <select class="w-3/4" v-model="aggregateNum" aria-label="Floating label select example">
            <option value="5" >5</option>
            <option value="10" >10</option>
            <option value="15" >15</option>
            <option value="20" >20</option>
          </select>
          <label class="font-medium text-gray-400" for="floatingSelect">Transactions per aggregate</label>
        </div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <div class="border rounded-md border-gray-200 mb-3 w-3/4">
          <input type="file" class="form-control" @change="loadCSV" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload">
        </div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <div v-if="fileError" class="font-semibold text-red-600" role="alert">
          Invalid file
        </div>
        
        <div v-if="assetNotEnough" class="font-semibold text-red-600" role="alert">
          Total distribution amount exceed selected asset amount (need {{ totalDistributeAmount }})
        </div>
        <div v-if="assetWrongDivisibility" class="font-semibold text-red-600" role="alert">
          {{ assetWrongDivisibility }}
        </div>
      </div>
    </div>
    <div class="p-2" v-if="distributionList.length">
      <div>
        <div class="table w-3/4">
          <div class="table-header-group">
            <div class="table-row">
              <div class="table-cell border-b-2">Recipient (Public Key or Address)</div>
              <div class="table-cell border-b-2">Amount</div>
            </div>
          </div>
          <div class="table-row-group">
            <div class="table-row" v-for="row, index in distributionList" :key="index">
              <div class="table-cell border-b">{{ row.publicKeyOrAddress }}</div>
              <div class="table-cell border-b">{{ row.amount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <div class="flex flex-col-reverse border rounded-md border-gray-200 mb-3 w-3/4 px-2 py-1">
          <input type="password" class="border-none outline-none" v-model="intiatorPrivateKey" autocomplete="off">
          <label for="floatingPassword">Initiator Private Key</label>
        </div>
      </div>
    </div>
    <div class="p-2">
      <div>
        <button type="button" @click="distribute()" v-if="!distributing" :disabled="distributing && !distributeDone" class="blue-btn px-3 py-3 text-md">Distribute</button>
        <button v-if="distributing" class="blue-btn px-3 py-3 text-md" type="button" disabled>
          <span class="animate-spin" role="status" aria-hidden="true"></span>
          Distributing...
        </button>
        <div v-if="distributionError" class="font-semibold text-red-600 mt-2" role="alert">
          {{ distributionError }}
        </div>
        <div v-if="distributeDone" class="font-semibold text-red-600 mt-2" role="alert">
          Distribution Done
        </div>
      </div>
    </div>
    <div class="p-2" v-if="txnsHash.length">
      <div>
        <div class="table w-3/4">
          <div class="table-header-group">
            <div class="table-row">
              <div class="table-cell border-b-2">Transaction Hash</div>
            </div>
          </div>
          <div class="table-row-group">
            <div class="table-row" v-for="txnHash, index in txnsHash" :key="index">
              <div class="table-cell border-b"><a :href="createTxnExplorerLink(txnHash)" >{{ txnHash }}</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}



</style>
