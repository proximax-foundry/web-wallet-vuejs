<template>
 <div>
  <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
  <AccountComponent :address="address" class="mb-6"/>
    <AccountTabs :address="address" selected="multisig"/>
    <div class="border-2 border-t-0 lg:grid lg:grid-cols-3" >
      <div class="lg:col-span-2 py-6 pr-6">
        <div class="text-xs font-semibold pl-6">{{$t('multisig.manageCosignatories')}}</div>
        <div class='pl-6'>
           <div class=" error error_box mb-5" v-if="err!=''">{{ err }}</div>
           <div class=" error error_box mb-5" v-if="passwordErr!=''">{{ passwordErr }}</div>
        </div>
        <div class="mt-4"></div>
        <div class="flex flex-col gap-2">
          <div v-for="(coSignAddress, index) in coSign" :key="index" >
            <div class="flex">
              <img  src="@/modules/account/submodule/multisig/img/icon-delete-red.svg" @click="deleteCoSigAddressInput(index)" class="w-4 h-4 text-gray-500 cursor-pointer mt-3 mx-1"  >
              <TextInput class='w-5/12 mr-2 ' :placeholder="$t('multisig.cosignatory') + `${index+1}`"  v-model="contactName[index]" :disabled="true"  />
              <TextInputClean class='w-7/12 mr-2 ' :placeholder="$t('general.publicKey')" :errorMessage="$t('general.invalidInput')" :showError="showAddressError[index]" v-model="coSign[index]" />
              <div v-if="showAddressError[index]==true " class="mt-16"/>
              <div @click="toggleContact[index]=!toggleContact[index]" class=' border  cursor-pointer flex flex-col justify-center  p-2' style="height:2.66rem">
                <font-awesome-icon icon="id-card-alt" class=" text-blue-primary ml-auto mr-auto "></font-awesome-icon>
                <div class='text-xxs text-blue-primary font-semibold uppercase'>{{$t('general.select')}}</div>
              </div>
            </div>
            <div v-if="toggleContact[index]">
              <Sidebar v-model:visible="toggleContact[index]" :baseZIndex="10000" position="full">
                <SelectAccountAndContact v-bind="index" :contacts="contact" :index="index" :selectedNode="selectedNode[index]" @node-select="onNodeSelect($event,index)"/>
              </Sidebar>
            </div>
          </div>
       </div>
        <button class="pl-6 font-semibold text-xs mt-1 text-blue-primary outline-none focus:outline-none disabled:opacity-50  disabled:cursor-auto" @click="addCoSig" :disabled="addCoSigButton">+{{$t('multisig.addNewCosignatory')}}</button>
        <div class="ml-6 my-7 gray-line"/> 
        <div class="pl-6 text-xs font-semibold mb-3">{{$t('general.scheme')}}</div>
        <div class='flex gap-2 pl-6'>
          <div class="border w-6/12">
          <div class="border-b-2 text-xxs text-center py-1 uppercase">{{$t('multisig.transactionsApproval')}}</div>
            <div class='flex justify-around'>
              <button class="text-blue-primary disabled:opacity-50" @click="numApproveTransaction--" :disabled="numApproveTransaction<=0">-</button>
              <input type="number" class=" w-4 outline-none text-xs font-bold" :min=0 @keypress="validateApproval" :max="maxNumApproveTransaction" v-model="numApproveTransaction" >
              <button class="text-blue-primary disabled:opacity-50" :disabled="numApproveTransaction>=maxNumApproveTransaction " @click="numApproveTransaction++">+</button>
            </div>
            <div class="text-xxs border-t-2 text-center py-1 uppercase">{{$t('multisig.ofCosignatories',{value:maxNumApproveTransaction})}}</div>
          </div>
          <div class="border w-6/12">
            <div class="border-b-2 text-xxs text-center py-1 uppercase">{{$t('multisig.accountDeletionApproval')}}</div>
            <div class='flex justify-around'>
              <button class="text-blue-primary disabled:opacity-50" @click="numDeleteUser--" :disabled="numDeleteUser<=0">-</button>
              <input type="number" class=" w-4 outline-none text-xs font-bold" :min=0 @keypress="validateDelete" :max="maxNumDeleteUser" v-model="numDeleteUser" >
              <button class="text-blue-primary disabled:opacity-50" :disabled="numDeleteUser>=maxNumDeleteUser " @click="numDeleteUser++">+</button>
            </div>
            <div class="text-xxs border-t-2 text-center py-1 uppercase">{{$t('multisig.ofCosignatories',{value:maxNumDeleteUser})}}</div>
          </div>
        </div>
      </div>
      <div class='bg-navy-primary p-6 lg:col-span-1'>
        <TransactionFeeDisplay :fund-status="fundStatus" :is-multisig-already="isMultisig" :on-partial="onPartial" :transaction-fee="String(aggregateFee)" :total-fee-formatted="totalFeeFormatted" :lock-fund-currency-convert="lockFundCurrency" :lock-fund-tx-fee-convert="String(lockFundTxFee)" :balance="accBalance" :selected-acc-add="selectedAccAdd"/>
        <div class="mt-5"/>
        <div class='font-semibold text-xs text-white mb-1.5'>{{$t('general.enterPasswordContinue')}}</div>
        <PasswordInput  :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')" :showError="showPasswdError" v-model="passwd" :disabled="disabledPassword" />
        <div class="mt-3"><button type="submit" class=' w-full blue-btn px-3 py-3 disabled:opacity-50 disabled:cursor-auto'  @click="convertAccount()" :disabled="disableSend">{{$t('multisig.updateCosignatories')}}</button></div>
        <div class="text-center">
          <router-link :to="{name: 'ViewMultisigHome',params:{address:address}}" class="content-center text-xs text-white underline" >{{$t('general.cancel')}}</router-link>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { computed, ref, inject, watch, getCurrentInstance } from 'vue';
import { useRouter } from "vue-router";
import PasswordInput from '@/components/PasswordInput.vue'
import TextInput from '@/components/TextInput.vue'
import TransactionFeeDisplay from '@/modules/services/components/TransactionFeeDisplay.vue';
import TextInputClean from '@/components/TextInputClean.vue'
import {MultisigUtils} from '@/util/multisigUtils'
import { walletState } from '@/state/walletState';
import SelectAccountAndContact from "@/components/SelectAccountAndContact.vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import {
Account,
  Address,
    MultisigCosignatoryModification,
    MultisigCosignatoryModificationType,
    Password,
    PublicAccount
} from "tsjs-xpx-chain-sdk"
import { networkState } from '@/state/networkState';
import {useI18n} from 'vue-i18n'
import { Helper } from '@/util/typeHelper';
import { AppState } from '@/state/appState';
import { TransactionUtils } from '@/util/transactionUtils';
import { WalletUtils } from "@/util/walletUtils";
import { TransactionState } from "@/state/transactionState";
export default {
  name: 'ViewConvertAccountMultisig',
  components: {
    PasswordInput,
    TextInput,
    TextInputClean,
    SelectAccountAndContact,
    AccountComponent,
    AccountTabs,
    TransactionFeeDisplay
  },
  props: {
    address: String,
  },
  setup(p){
    const {t} = useI18n();
    const router = useRouter();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const err = ref('');
    const passwordErr = ref('');
    const fundStatus = ref(false);
    
    const passwd = ref('');
    const showPasswdError = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const numApproveTransaction = ref(1);
    const numDeleteUser = ref(1);
    const maxNumApproveTransaction = ref(0);
    const maxNumDeleteUser = ref(0);
    const publicKeyPattern = "^[0-9A-Fa-f]{64}$";
    const coSign = ref([]);
    const selectedNode = ref([])
    const contactName = ref([])
    const selectedAddresses = ref([]);
    const showAddressError = ref([]);
    const toggleContact = ref([])
    const onPartial = ref(false);
    const space=ref(false)
    const defaultAcc = walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.selectDefaultAccount(): null
    const selectedAccAdd = ref(defaultAcc?defaultAcc.address:'');
    const accBalance = ref(Helper.toCurrencyFormat(defaultAcc?defaultAcc.balance:0, AppState.nativeToken.divisibility));
    const lockFundCurrency = computed(() =>
      Helper.convertToCurrency(
        networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
        AppState.nativeToken.divisibility
      )
    );
    
    const lockFundTxFee = computed(()=>{ 
      if(networkState.currentNetworkProfile){ 
        return Helper.convertToExact(TransactionUtils.getLockFundFee(), AppState.nativeToken.divisibility);
      }
      return 0;  
    });
    const aggregateFee = ref(0)
    
     // get account details
    const acc = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return null
      }
      return walletState.currentLoggedInWallet.accounts.find(acc =>acc.address ===p.address)
    }) 

    let isMultisig = computed(()=>{
      if(!acc.value){
        return
      }
      return MultisigUtils.checkIsMultiSig(acc.value.address)
    }) 
    let updateAggregateFee=()=>{
      if(!acc.value){
        return
      }
      aggregateFee.value = MultisigUtils.getAggregateFee(acc.value.publicKey,coSign.value,numApproveTransaction.value,numDeleteUser.value)
    }
    updateAggregateFee()
    const totalFee = computed(()=>{
      let tokenDivisibility = AppState.nativeToken.divisibility
      if(tokenDivisibility ==0){
        return  Math.trunc(parseFloat(aggregateFee.value) + parseFloat(lockFundCurrency.value) + lockFundTxFee.value)
      }else{
        return Math.round((parseFloat(aggregateFee.value) + parseFloat(lockFundCurrency.value) + lockFundTxFee.value)*Math.pow(10,tokenDivisibility))/Math.pow(10,tokenDivisibility)
      }
        
    })
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const currentNativeTokenDivisibility = computed(()=> AppState.nativeToken.divisibility);
    const accountBalance = computed(() => {
      if(walletState.currentLoggedInWallet){
        return Helper.toCurrencyFormat(acc.value.balance, currentNativeTokenDivisibility.value);
      }else{
        return "0"
      }
    });
    const contact = computed(() => {
      if(!acc.value){
        return false
      }
      const wallet = walletState.currentLoggedInWallet;

      let accounts = wallet.accounts.map(
        (account)=>{
          return { 
            name: account.name,
            publicKey: account.publicKey,
          }
        });
      
      let addressBook = wallet.contacts
      var contacts = [];
      var indexNo = 0
      
      contacts.push({
        "key" : "0",
        "label" : t('general.ownerAcc'),
        "selectable" : false,
        "children" : []
        }
      )
      accounts.forEach((element) => {
        contacts[0].children.push(
          {
            "key" : "0-" + indexNo.toString(),
            "label" : element.name,
            "data" : element.publicKey
          }
        )
        indexNo++
      })

      indexNo = 0
      // getting address book contacts
      contacts.push({
        "key" : "1",
        "label" : t('general.contact'),
        "selectable" : false,
        "children" : []
        }
      )
      
      if (addressBook != undefined) {
        addressBook.forEach((element) => {
          contacts[1].children.push(
          {
            "key" : "1-" + indexNo.toString(),
            "label" : element.name,
            "data" : element.address
          }
        )
        indexNo++
        });
      }
      return contacts
    });

      function onNodeSelect(node, index){
        makeNodeSelectable(index)
        contactName.value[index]  = node.label
        // check if it is in the address book
        if(node.key[0] == "1"){
          changeToPublicKey(node.data, index)
        }
        else{
          coSign.value[index] = node.data
        }
        coSign.value[index] = node.data
        toggleContact.value[index] = false
        // this is too make it turn blue
        selectedNode.value[index][node.key] = true
        node.selectable = false
      }

      function changeToPublicKey(address, index){
        try {
          MultisigUtils.verifyContactPublicKey(address).then(result=>{
            if(result.status==true){
              coSign.value[index] = result.publicKey
            }
            else{
              err.value = t('multisig.noPublicKey')
            }
          })
        } catch (error) {
          err.value = t('multisig.noPublicKey')
        }
      }

      const makeNodeSelectable = (index) => {
        // if there is previously unselectable value make it selectable
        if (Object.keys(selectedNode.value[index]).length !== 0){
          let selectedNodeIndex = Object.keys(selectedNode.value[index])[0].split('-')
          contact.value[selectedNodeIndex[0]].children[selectedNodeIndex[1]].selectable = true
          selectedNode.value[index] = {}
        }
      }

    const disableSend = computed(() => 
      isMultisig.value || 
      onPartial.value || 
      !passwd.value.match(passwdPattern) || 
      coSign.value.length == 0  ||  
      err.value || 
      (showAddressError.value.every(value => value == false)) == false || 
      numDeleteUser.value == 0 || 
      numApproveTransaction.value == 0 ||
      acc.value.balance < totalFee.value
    );
    const addCoSigButton = computed(() => {
      if(!acc.value){
        return false
      }
      var status = false;
      if(acc.value.balance >= totalFee.value && !onPartial.value){
        for(var i = 0; i < coSign.value.length; i++){
          if(showAddressError.value[i] != ''){
            status = true;
            break;
          }else if(coSign.value[i].length < 40){
            status = true;
            break;
          }
        }
      }else{
        status = true;
      }
      return status;
    });
    const clear = () => {
      coSign.value = [];
      selectedAddresses.value = [];
      showAddressError.value = [];
      passwd.value = '';
      numApproveTransaction.value = 1;
      maxNumApproveTransaction.value = 0;
      numDeleteUser.value = 1;
      maxNumDeleteUser.value = 0;
    };
    const convertAccount = async() => {
      const wallet = walletState.currentLoggedInWallet;
      const verify = WalletUtils.verifyWalletPassword(
        wallet.name,
        networkState.chainNetworkName,
        passwd.value
      );
      if(!verify){
        passwordErr.value = t('general.walletPasswordInvalid',{name : walletState.currentLoggedInWallet.name});
      }else{
        // transaction made
        let multisigPayload = {}
        const multisigCosignatory = [];
  
        const accountDetails = wallet.accounts.find(
          (element) => element.name === acc.value.name
        );
        if (!accountDetails) {
          throw new Error("Account not found");
        }
    
        const privateKey = WalletUtils.decryptPrivateKey(
          new Password(passwd.value),
          accountDetails.encrypted,
          accountDetails.iv
        );
        const accountToConvert = Account.createFromPrivateKey(
          privateKey,
          AppState.networkType,1
        );
        if (!AppState.chainAPI) {
          throw new Error("Service unavailable");
        }
        let cosignatory = null;
        for (const cosignKey of coSign.value) {
          if (cosignKey.length == 64) {
            cosignatory = PublicAccount.createFromPublicKey(
              cosignKey,
              AppState.networkType
            );
          } else if (cosignKey.length == 40 || cosignKey.length == 46) {
            const address = Address.createFromRawAddress(cosignKey);
    
            try {
              const accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(
                address
              );
              cosignatory = PublicAccount.createFromPublicKey(
                accInfo.publicKey,
                AppState.networkType
              );
            } catch (error) {
              console.log(error);
            }
          }
          if (cosignatory) {
            multisigCosignatory.push(
              new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                cosignatory
              )
            );
          }
        }
        if (!AppState.buildTxn) {
          throw new Error("Service unavailable");
        }
        const txBuilder = AppState.buildTxn;
        const convertIntoMultisigTransaction = txBuilder
          .modifyMultisigAccountBuilder()
          .minApprovalDelta(numApproveTransaction.value)
          .minRemovalDelta(numDeleteUser.value)
          .modifications(multisigCosignatory)
          .build();

        const nodeTime = await AppState.chainAPI.nodeAPI.getNodeTime();
        multisigPayload = TransactionUtils.signTxnWithPassword(acc.value.address,accountToConvert.address.plain(),passwd.value,convertIntoMultisigTransaction, new UInt64(nodeTime.sendTimeStamp))
        passwordErr.value = '';
        // toggleAnounceNotification.value = true;
        // var audio = new Audio(require('@/assets/audio/ding.ogg'));
        // audio.play();
        clear();
        TransactionState.lockHashPayload = multisigPayload.hashLockTxnPayload
        TransactionState.transactionPayload = multisigPayload.txnPayload
        TransactionState.selectedAddress = p.address
        router.push({ name: "ViewConfirmTransaction" })
      } 
    };
    
    watch(() => [...coSign.value], (n) => {
      let duplicateOwner = false
      if (coSign.value.length > 0)
      {
        for(var i = 0; i < coSign.value.length; i++){
        if((coSign.value[i].length == 64)){
          if((coSign.value[i]==acc.value.publicKey) && (duplicateOwner == false)){
            duplicateOwner = true
            showAddressError.value[i] = true;
            err.value = t('multisig.selectedAccErr')
          }
          else if(!coSign.value[i].match(publicKeyPattern) && (coSign.value[i].length == 64)){
            showAddressError.value[i] = true;
          }else{
            showAddressError.value[i] = false;
            const unique = Array.from(new Set(n));
            if(unique.length != n.length){
              err.value = t('multisig.duplicatedCosigner');
            }else{
              if(duplicateOwner == false){
                err.value = '';
              }
            }
          }
        }else{
          showAddressError.value[i] = true;
        }
      }}
      // there is no cosign left
      else{
        err.value = '';
      }
    }, {deep:true});

    watch(() => [...showAddressError.value], (n) => {
      if(n.every(value=>value==false)){
        updateAggregateFee()
      }
      
    }, {deep:true});
    
    const addCoSig = () => {
      coSign.value.push('');
      selectedNode.value.push({})
      showAddressError.value.push(false);
      maxNumApproveTransaction.value += 1;
      maxNumDeleteUser.value += 1;
    };

    const deleteCoSigAddressInput = (i) => {
      if(maxNumApproveTransaction.value > 0){
        maxNumApproveTransaction.value -= 1;
      }
      if(maxNumDeleteUser.value > 0){
        maxNumDeleteUser.value -= 1;
      }
      if(numDeleteUser.value > maxNumDeleteUser.value){
        numDeleteUser.value = maxNumDeleteUser.value;
      }
      if(numApproveTransaction.value > maxNumApproveTransaction.value){
        numApproveTransaction.value = maxNumApproveTransaction.value;
      }
      makeNodeSelectable(i)
      coSign.value.splice(i, 1);
      selectedNode.value.splice(i, 1);
      contactName.value.splice(i, 1);
      toggleContact.value.splice(i,1);
      selectedAddresses.value.splice(i, 1);
      showAddressError.value.splice(i,1)
    }
    const validateApproval = (e) => {
      if((numApproveTransaction.value * 10*(~~(maxNumApproveTransaction.value/10)) + e.charCode - 48) > maxNumApproveTransaction.value){
        e.preventDefault();
      }
    }
    let deleteUserErrorMsg = t('multisig.deletionExceedMax');
    let approveTransactionErrMsg = t('multisig.approvalExceedMax');
    watch(numApproveTransaction, (n) => {
      updateAggregateFee()
      if(maxNumApproveTransaction.value == 0 && n > 1){
        err.value = approveTransactionErrMsg;
      }else if((n > maxNumApproveTransaction.value) && (n !=1 && maxNumApproveTransaction.value != 0 )){
        err.value = approveTransactionErrMsg;
      }else if(maxNumApproveTransaction.value>0 && n<=0){
        err.value = t('multisig.approvalAtLeastOne')
      }else{
        // check again for num delete user
        if((numDeleteUser.value > maxNumDeleteUser.value) && (numDeleteUser.value !=1 && maxNumDeleteUser.value != 0 )){
          err.value = deleteUserErrorMsg;
        }else{
          err.value = '';
        }
      }
    });
    const validateDelete = (e) => {
      if((numDeleteUser.value * 10*(~~(maxNumDeleteUser.value/10)) + e.charCode - 48) > maxNumDeleteUser.value){
        e.preventDefault();
      }
    }
    watch(numDeleteUser, (n) => {
      updateAggregateFee()
      if(maxNumDeleteUser.value == 0 && n > 1){
        err.value = deleteUserErrorMsg;
      }else if((n > maxNumDeleteUser.value) && (n !=1 && maxNumDeleteUser.value != 0 )){
        err.value = deleteUserErrorMsg;
      }else if(maxNumDeleteUser.value>0 && n<=0){
        err.value = t('multisig.deletionAtLeastOne')
      }else{
        // check again for num approval transaction
        if((numApproveTransaction.value > maxNumApproveTransaction.value) && (numApproveTransaction.value !=1 && maxNumApproveTransaction.value != 0 )){
          err.value = approveTransactionErrMsg;
        }else{
          err.value = '';
        }
      }
    });
    const disabledPassword = computed(() => (onPartial.value || isMultisig.value ));
   
    // check if onPartial
    if(acc.value){
      MultisigUtils.onPartial(PublicAccount.createFromPublicKey(acc.value.publicKey,AppState.networkType)).then(verify=>
      onPartial.value = verify
    )
    }
   
    if(acc.value){
      if(acc.value.balance<totalFee.value){
        fundStatus.value = true
      }
    }
    
    watch(acc, (n) => {
      if(!n){
        return
      }
      if(n.balance<totalFee.value){
        fundStatus.value = true
      }else{
        fundStatus.value = false
      }
    });

    const totalFeeFormatted = computed(() => {
      return Helper.amountFormatterSimple(totalFee.value, 0);
    });

    return {
      networkState,
      toggleContact,
      contact,
      space,
      currentNativeTokenName,
      contactName,
      err,
      disableSend,
      numApproveTransaction,
      numDeleteUser,
      maxNumApproveTransaction,
      maxNumDeleteUser,
      fundStatus,
      acc,
      passwd,
      showPasswdError,
      showAddressError,
      addCoSig,
      coSign,
      addCoSigButton,
      selectedNode,
      deleteCoSigAddressInput,
      onNodeSelect,
      selectedAddresses,
      clear,
      convertAccount,
      disabledPassword,
      onPartial,
      isMultisig,
      passwdPattern,
      validateApproval,
      validateDelete,
      lockFundCurrency,
      lockFundTxFee,
      aggregateFee,
      totalFee,
      totalFeeFormatted,
      selectedAccAdd,
      accBalance,
      passwordErr
    };
  },
}
</script>
<style scoped lang="scss">
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.p-tree::deep{
  .p-tree-container .p-treenode .p-treenode-content{
    padding-left:2px;
    padding-top:2px
  }
  .p-link{
  padding: 0;
  margin: 0;
  }
  .p-inputtext{
      font-size: 1rem;
      text-align: left;
      padding: 0.5rem;
      border: 1px solid #ced4da;
    }
}
  ::deep(.p-inputtext) {
      font-size: 1rem;
      text-align: left;
      padding: 0.5rem;
    }
</style>