<template>
<div class="flex justify-between text-sm">
  <div><span class="text-gray-400">Accounts > Multisign ></span> <span class="text-blue-primary font-bold">Convert to Multisig Account</span></div>
  <div>
    <router-link :to="{name: 'ViewDisplayAllAccounts'}" class="font-bold" active-class="accounts">View All Accounts</router-link>
  </div>
</div>
<div class='mt-2 py-3 gray-line'>
  <div class="container mx-auto text-center">
    <div class="mx-auto pt-5 lg:px-20">
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-8 items-center">
        <div class="text-left w-full relative">
          <div class="text-xs font-bold mb-1">{{ accountNameDisplay }}</div>
          <div>{{ acc.address }}</div>
        </div>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-red-100 mb-8" v-if="fundStatus">
        <div class="text-center w-full">
          <div class="border border-gray-500 rounded-full w-8 h-8 inline-block relative">
            <font-awesome-icon icon="times" class="w-5 h-5 text-gray-500 inline-block absolute" style="top:5px; right: 5px;"></font-awesome-icon>
          </div>
          <div class="font-bold text-sm">Insufficient Balance</div>
          <p class="text-xs mt-3">10.044500 XPX required to cover LockFund.</p>
        </div>
      </div>
      <div>
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <div class="block mt-2 font-bold text-md lg:inline-block lg:mr-20">Scheme for ></div>
        <div class="mt-2 lg:inline-block lg:mr-20">
          <span class="font-bold">Approve transactions:</span>
          <div class="ml-2 border rounded-2xl p-2 py-2 inline-block">
            <input type="number" required min="0" :max="maxNumApproveTransaction" v-model="numApproveTransaction" class="text-right outline-none">
          </div> of {{ maxNumApproveTransaction }} cosignatories</div>
        <div class="mt-2 lg:inline-block">
          <span class="font-bold">Delete users:</span>
          <div class="ml-2 border rounded-2xl p-2 py-2 inline-block">
            <input type="number" required min="0" :max="maxNumDeleteUser" v-model="numDeleteUser" class="text-right outline-none">
          </div> of {{ maxNumDeleteUser }} cosignatories</div>
      </div>
      <div class="mt-16">
        <div v-for="(coSignAddress, index) in coSign" :key="index" class="flex relative">
          <font-awesome-icon icon="trash-alt" class="w-4 h-4 text-gray-500 hover:text-gray-400 cursor-pointer mr-3 mt-3" @click="deleteCoSigAddressInput(index)"></font-awesome-icon>
          <TextInput placeholder="Cosignatory Account Public Key" errorMessage="Valid Cosignatory Account Public Key is required" :showError="showAddressError[index]" v-model="coSign[index]" icon="key" class="flex-grow" />
          <font-awesome-icon icon="id-card-alt" class="w-4 h-4 text-gray-500 hover:text-gray-400 cursor-pointer ml-3 mt-3" @click="displayAddContactModal(index);"></font-awesome-icon>
        </div>
        <div class="text-lg" v-if="!coSign.length">Add at least 1 consignatories</div>
        <button class="my-8 hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none disabled:opacity-50" @click="addCoSig" :disabled="addCoSigButton">(+) Add cosignatory</button>
      </div>
      <div class="p-4 rounded-xl bg-gray-100 my-2 w-full text-xs text-gray-800">
        <img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1"> Unconfirmed/Recommended Fee: 0.042750 XPX
      </div>
      <div class="p-4 rounded-xl bg-gray-100 mb-8 items-center w-full text-xs text-gray-800">
        <div class="text-center">
          <div class="inline-block">
            <div class="flex">
              <img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline-block mr-1 self-center">
              <div class="inline-block self-center text-left">
                <div>LockFund: 10.000000 XPX</div>
                <div>Unconfirmed/Recommended Fee: 0.044500 XPX</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PasswordInput placeholder="Enter Wallet Password" errorMessage="Wallet password is required to convert to MultiSig Account" :showError="showPasswdError" v-model="passwd" icon="lock" />
      <div class="mt-10">
        <button type="button" class="default-btn mr-5 focus:outline-none" @click="toggleModal = !toggleModal">Clear</button>
        <button type="submit" class="default-btn py-1 disabled:opacity-50" @click="deleteAccount();" :disabled="disableSend">Send</button>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { computed, ref, inject, watch } from 'vue';
import { useRouter } from "vue-router";
import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';
import PasswordInput from '@/components/PasswordInput.vue'
import TextInput from '@/components/TextInput.vue'

export default {
  name: 'ViewDeleteAccount',
  components: {
    FontAwesomeIcon,
    PasswordInput,
    TextInput,
  },
  props: {
    name: String,
  },
  setup(p){
    const appStore = inject("appStore");
    const err = ref(false);
    const fundStatus = ref(false);
    const disableSend = ref(false);
    const accountName = ref(p.name);
    const accountNameDisplay = ref(p.name);
    const router = useRouter();
    const passwd = ref('');
    const showPasswdError = ref(false);
    const numApproveTransaction = ref(1);
    const numDeleteUser = ref(1);
    const maxNumApproveTransaction = ref(0);
    const maxNumDeleteUser = ref(0);
    const addressPattern = "^[0-9A-Fa-f]{64}$";
    const coSign = ref([]);
    // const addresses = [];
    const showAddressError = ref([]);

    const addCoSigButton = computed(() => {
      var status = false;
      for(var i = 0; i < coSign.value.length; i++){
        if(!coSign.value[i].match(addressPattern)){
          status = true;
          break;
        }
      }
      return status;
    });

    watch(() => [...coSign.value], (n) => {
      for(var i = 0; i < coSign.value.length; i++){
        if(!coSign.value[i].match(addressPattern)){
          showAddressError.value[i] = true;
        }else{
          showAddressError.value[i] = false;
          //search for similar matching
          // var match = existingAdd.findIndex((element) => element == coSign.value[i]);
          // if(match != -1 && i != 0){
          //   console.log('Match index: '+ match);
          //   console.log('coSign of ' + i + ': '+ coSign.value[i]);
          //   err.value = "Cosignee already exist";
          //   break;
          // }else{
          //   err.value = '';
          // }
          const unique = Array.from(new Set(n));
          if(unique.length != n.length){
            err.value = "Cosignee already exist";
          }else{
            err.value = '';
          }
        }
      }
    }, {deep:true});

    const getAcccountDetails = () => {
      return appStore.getAccDetails(p.name);
    };

    const addCoSig = () => {
      coSign.value.push('');
      // addresses.value.push('');
      showAddressError.value.push(false);
      maxNumApproveTransaction.value += 1;
      maxNumDeleteUser.value += 1;
    };

    const deleteCoSigAddressInput = (i) => {
      maxNumApproveTransaction.value -= 1;
      maxNumDeleteUser.value -= 1;
      if(numDeleteUser.value > maxNumDeleteUser.value){
        numDeleteUser.value = maxNumDeleteUser.value;
      }

      if(numApproveTransaction.value > maxNumApproveTransaction.value){
        numApproveTransaction.value = maxNumApproveTransaction.value;
      }
      coSign.value.splice(i, 1);
    }

    // get account details
    const acc = getAcccountDetails();
    if(acc==-1 && acc.default){
      router.push({ name: "ViewDisplayAllAccounts"});
    }

    const displayAddContactModal = (i) => {
      console.log(i)
    }

    return {
      err,
      disableSend,
      numApproveTransaction,
      numDeleteUser,
      maxNumApproveTransaction,
      maxNumDeleteUser,
      fundStatus,
      accountNameDisplay,
      accountName,
      acc,
      passwd,
      showPasswdError,
      showAddressError,
      addCoSig,
      coSign,
      addCoSigButton,
      deleteCoSigAddressInput,
      displayAddContactModal
    };
  },
}
</script>