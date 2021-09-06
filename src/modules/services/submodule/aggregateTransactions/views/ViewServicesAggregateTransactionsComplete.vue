<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">Aggregate Transactions ></span> <span class="text-blue-primary font-bold">{{$t('welcome.create')}}</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">{{$t('services.allservices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center md:grid md:grid-cols-6'>
    <div class="md:col-span-4">
      <form @submit.prevent="createMosaic">
        <fieldset class="w-full">
          <!-- <div class="mb-5">
            <div v-if="showNoBalance" class="border-2 rounded-3xl border-red-700 w-full h-24 text-center p-4">
              <div class="h-5 text-center">
                <div class="rounded-full w-8 h-8 border border-gray-500 inline-block relative"><font-awesome-icon icon="times" class="text-gray-500 h-5 w-5 absolute" style="top: 5px; left:8px"></font-awesome-icon></div><br>
                <div class="inline-block text-tsm">{{$t('accounts.insufficientbalance')}}</div>
              </div>
            </div>
            <div v-if="isNotCosigner" class="border-2 rounded-3xl border-yellow-400 w-full h-24 text-center p-4">
              <div class="h-5 text-center">
                <div class="rounded-full w-8 h-8 border border-yellow-500 inline-block relative"><font-awesome-icon icon="exclamation" class="text-yellow-500 h-5 w-5 absolute" style="top: 5px; left:11px"></font-awesome-icon></div><br>
                <div class="inline-block text-tsm">{{$t('accounts.cosigwarning2')}}</div>
              </div>
            </div>
            <div class="error error_box" v-if="err!=''">{{ err }}</div>
            <div v-if="moreThanOneAccount" class="text-left p-4">
              <div class="mb-1 cursor-pointer z-20 border-b border-gray-200" @click="showMenu = !showMenu">
                <div class="font-bold text-xs">{{ selectedAccName }} <span v-if="isMultiSigBool" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">{{$t('accounts.multisig')}}</span></div>
                <div class="text-gray-400 mt-1 text-sm ">{{ selectedAccAdd }}</div>
              </div>
              <transition name="slide">
              <div v-if="showMenu" class="z-10">
                <div :key="item.address" :i="index" v-for="(item, index) in accounts" class="p-2 cursor-pointer" :class="item.name==selectedAccName?'bg-blue-primary text-white font-bold':'text-gray-800 bg-gray-50 optionDiv'" @click="changeSelection(item)" :title="'Address is ' + item.address">
                  <div>{{ item.name }} <span v-if="isMultiSig(item.address)" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">{{$t('accounts.multisig')}}</span></div>
                </div>
              </div>
              </transition>
              <input type="hidden" v-model="currentSelectedName">
            </div>
            <div v-else class="text-left p-4">
              <div class="mb-1 z-20 border-b border-gray-200">
                <div class="font-bold text-xs">{{ selectedAccName }} <span v-if="isMultiSigBool" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">{{$t('accounts.multisig')}}</span></div>
                <div class="text-gray-400 mt-1 text-sm ">{{ selectedAccAdd }}</div>
              </div>
            </div>
            <div v-if="getMultiSigCosigner.list.length > 0">
              <div class="text-tsm text-left ml-4">{{$t('transfer.cosigner')}}:
                <span class="font-bold" v-if="getMultiSigCosigner.list.length == 1">{{ getMultiSigCosigner.list[0].name }} ({{$t('services.balance')}}: {{ getMultiSigCosigner.list[0].balance }} XPX) <span v-if="getMultiSigCosigner.list[0].balance < lockFundTotalFee" class="error">- {{$t('accounts.insufficientbalance')}}</span></span>
                <span class="font-bold" v-else><select v-model="cosignerAddress"><option v-for="(cosigner, item) in getMultiSigCosigner.list" :value="cosigner.address" :key="item">{{ cosigner.name }} ({{$t('services.balance')}}: {{ cosigner.balance }} XPX)</option></select></span>
                <div v-if="cosignerBalanceInsufficient" class="error">- {{$t('accounts.insufficientbalance')}}</div>
              </div>
            </div>
          </div>
          <div class="mt-10">
            <button type="button" class="default-btn mr-5 focus:outline-none disabled:opacity-50" :disabled="disabledClear" @click="clearInput">{{$t('signin.clear')}}</button>
            <button type="button" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate" @click="createMosaic">{{$t('welcome.create')}}</button>
          </div> -->
        <div class="mb-5 border-b border-gray-200">
                    <span class="text-gray-300 font-bold">Simple Transcation 1</span>

          <div class="error error_box" v-if="err != ''">{{ err }}</div>
          <div v-if="moreThanOneAccount" class="text-left p-4">
            <div class="mb-1 cursor-pointer z-20 border-b border-gray-200" @click="showMenu = !showMenu">
              <div class="font-bold text-xs">
                {{ selectedAccName }}
                <span v-if="isMultiSigBool" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">
                  {{$t('accounts.multisig')}}
                </span>
              </div>
              <div class="text-gray-400 mt-1 text-sm">{{ selectedAccAdd }}</div>
            </div>
            <transition name="slide">
              <div v-if="showMenu" class="z-10">
                <div :key="item.address" :i="index" v-for="(item, index) in accounts" class="p-2 cursor-pointer" :class=" item.name == selectedAccName ? 'bg-blue-primary text-white font-bold': 'text-gray-800 bg-gray-50 optionDiv'"
                  @click="changeSelection(item)" :title="'Address is ' + item.address" >
                  <div>
                    {{ item.name }}
                    <span
                      v-if="isMultiSig(item.address)" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">
                        {{$t('accounts.multisig')}}
                    </span>
                  </div>
                </div>
              </div>
            </transition>
            <input type="hidden" v-model="currentSelectedName" />
          </div>
          <div v-if="isMultiSigBool" class="text-left mt-2 mb-5 ml-4"> 
            <div v-if="getWalletCosigner().length > 0">
              <div class="text-tsm">
                {{$t('transfer.cosigner')}}:
                <span class="font-bold" v-if="getWalletCosigner().length == 1"> 
                  {{ getWalletCosigner()[0].name }} ({{$t('services.balance')}}:{{  getWalletCosigner()[0].balance }} XPX)
                    <span v-if="getWalletCosigner()[0].balance <lockFundTotalFee.value" class="error">
                      - {{$t('accounts.insufficientbalance')}}
                    </span>
                </span>
                <span class="font-bold" v-else>
                  <select v-model="cosignAddress">
                    <option v-for="(element, item) in  getWalletCosigner()" :value="element.address" :key="item">
                      {{ element.name }} ({{$t('services.balance')}}: {{ element.balance }} XPX)
                    </option>
                  </select>
                </span>
                <div v-if="cosignerBalanceInsufficient" class="error">
                  - {{$t('accounts.insufficientbalance')}}
                </div>
              </div>
            </div>
            <div class="error" v-else>
             {{$t('transfer.nocosigner')}} 
            </div>
          </div>
          <SelectInputPlugin v-if="showContactSelection" :placeholder="$t('accounts.contacts')" errorMessage=""  v-model="selectContact" :options="contact" @default-selected="selectContact = 0"  @show-selection="updateAdd"/>
          <div class="flex">
            <div class="flex-grow mr-5">
              <TextInput :placeholder="$t('dashboard.recipient')" :errorMessage="addressErrorMsg" :showError="showAddressError" v-model="recipient" icon="wallet" :disabled="disableRecipient"/>
            </div>
            <div class="flex-none">
              <div class="rounded-full bg-gray-300 w-14 h-14 cursor-pointer relative" style="top: -5px" @click="showContactSelection = !showContactSelection">
                <font-awesome-icon icon="id-card-alt" class="h-20 w-20 inline text-blue-primary absolute" style="top: -12px; left: 19px"> 
                </font-awesome-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="text-left p-3 pb-0 border-l-8 border-gray-100">
          <div class="bg-gray-100 rounded-2xl p-3">
            <div class="inline-block mr-4 tfaddext-tsm">
              <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1"/>
                {{$t('services.balance')}}: 
              <span class="text-xs">
                {{ balance }} XPX
              </span>
            </div>
          </div>
          <SupplyInput v-model="sendXPX" :title="$t('accounts.send')" :balance="Number(balance)" :placeholder="$t('transfer.enteramount')" type="text" icon="coins" :showError="showBalanceErr" :errorMessage="$t('accounts.insufficientbalance')" :decimal="6" class="mt-5" :disabled="disableSupply"/>
        </div>
        <div v-for="(mosaic, index) in mosaicsCreated" :key="index">
          <MosaicInput :placeholder="$t('transfer.selectmosaic')" errorMessage="" v-model="selectedMosaic[index].id" :index="index" :options="mosaics" :disableOptions="selectedMosaic" @show-mosaic-selection="updateMosaic" @remove-mosaic-selected="removeMosaic"/>
          <SupplyInput v-if="selectedMosaic[index].id != 0"  :title="$t('accounts.send')" v-model="selectedMosaic[index].amount" :balance="getSelectedMosaicBalance[index]" :placeholder="$t('transfer.enteramount')" type="text" icon="coins" :showError="showBalanceErr" :errorMessage="$t('accounts.insufficientbalance')" :decimal="mosaicSupplyDivisibility[index]"/>
        </div>
        <div>
          <button class="mb-5 hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none disabled:opacity-50" :disabled="addMosaicsButton" @click="displayMosaicsOption">
            (+) {{$t('transfer.addmosaics')}} 
          </button>
        </div>
        <div class="mb-5 border-t pt-4 border-gray-200">
          <div class="rounded-2xl bg-gray-100 p-5">
            <input id="regularMsg" type="radio" name="msgOption" value="regular" v-model="msgOption" @change="clearMsg()" :disabled="disableRegularMsg == 1"/>
            <label for="regularMsg" class="cursor-pointer font-bold ml-4 mr-5"> 
              {{$t('transfer.regular')}}
            </label>
            <input id="hexMsg" type="radio" name="msgOption" value="hex" v-model="msgOption" @change="clearMsg()" :disabled="disableHexMsg == 1"/>
            <label for="hexMsg" class="cursor-pointer font-bold ml-4"
              >{{$t('transfer.hexadecimal')}}
              </label>
          </div>
        </div>
        <div class="mb-5" v-if="!encryptedMsgDisable">
          <div class="rounded-2xl bg-gray-100 p-5">
            <input id="encryptedMsg"  type="checkbox" value="encryptedMsg" v-model="encryptedMsg" :disabled="disableEncryptMsg == 1"/>
            <label for="encryptedMsg" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">
              {{$t('transfer.encrypted')}}
            </label>
          </div>
        </div>
        <TransferTextareaInput :placeholder="$t('dashboard.message')" errorMessage="" v-model="messageText" :remainingChar="remainingChar" :limit="messageLimit" icon="comment" class="mt-5" :msgOpt="msgOption" :disabled="disableMsgInput"/>
        <div class="rounded-2xl bg-gray-100 p-5">
          <div class="inline-block mr-4 text-xs">
            <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500"/>
            {{$t('accounts.unconfirmed')}}: {{ effectiveFee }} XPX
          </div>
        </div>
        <div class="p-4 rounded-xl bg-gray-100 mt-2 items-center w-full text-xs text-gray-800 " v-if="isMultiSig(selectedAccAdd)">
          <div class="text-center">
            <div class="inline-block">
              <div class="flex">
                <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline-block mr-1 self-center"/>
                <div class="inline-block self-center text-left">
                  <div>{{$t('accounts.lockfund')}}: {{ lockFundCurrency }} {{ currencyName }}</div>
                  <div> {{$t('accounts.unconfirmed')}}: {{ lockFundTxFee }}{{ currencyName }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput()">
            {{$t('signin.clear')}}
          </button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate" @click="makeTransfer()">
            Save
          </button>
        </div>
        </fieldset>
      </form>
    <AddContactModal :toggleModal="togglaAddContact" :saveAddress="recipient" />
    <ConfirmSendModal :toggleModal="toggleConfirm" />
    </div>
    <div class="md:col-span-2 px-10 text-left mt-10 text-tsm md:text-tsm md:mt-5 relative">
          <span class="text-gray-300 font-bold">My Transactions</span>
            <div>
              
            </div>
          <div class="text-center align-text-bottom inset-x-0 bottom-0 absolute ">
            <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate" @click="makeTransfer()">
            Send aggregate
           </button>
          </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue';
import SupplyInput from '@/components/SupplyInput.vue';
import NumberInput from '@/modules/services/submodule/assets/components/NumberInput.vue';
import { ChainProfileConfig } from "@/models/stores/";
import { Wallet } from "@/models/wallet";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { Currency } from "@/models/currency";
import { Helper } from '@/util/typeHelper';
import { ChainUtils } from '@/util/chainUtils';
import { AssetsUtils } from '@/util/assetsUtils';
import { WalletUtils } from '@/util/walletUtils';
import AddContactModal from "@/modules/transfer/components/AddContactModal.vue";
import ConfirmSendModal from "@/modules/transfer/components/ConfirmSendModal.vue";
import TransferTextareaInput from "@/modules/transfer/components/TransferTextareaInput.vue";
import SelectInputPlugin from "@/components/SelectInputPlugin.vue";
import MosaicInput from "@/modules/transfer/components/MosaicInput.vue";
import TextInput from "@/components/TextInput.vue";



export default {
  name: 'ViewServicesAggregateTransactionsComplete',
  components: {
    TextInput,
    MosaicInput,
    SelectInputPlugin,
    SupplyInput,
    TransferTextareaInput,
    AddContactModal,
    ConfirmSendModal,
  },

  setup(){
    const err = ref('');
    const showMenu = ref(false);
    const currentSelectedName = ref('');
    const disabledClear = ref(false);
    const walletName = walletState.currentLoggedInWallet.name
    const cosignerBalanceInsufficient = ref(false);
    const cosignerAddress = ref('');
    const recipient = ref('');

    const disableCreate = computed(() => !(
      false
    ));

    const isMultiSig = (address) => {
      const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == address);
      const other = walletState.currentLoggedInWallet.others.find((account) => account.address == address);
      let isMulti = false;
      const accountDirectParent = account?account.getDirectParentMultisig():[];
      const otherDirectParent = other?other.getDirectParentMultisig():[];
      if((accountDirectParent.length + otherDirectParent.length) > 0){
        isMulti = true;
      }
      return isMulti;
    };

    const selectedAccName = ref(walletState.currentLoggedInWallet.selectDefaultAccount().name);
    const selectedAccAdd = ref(walletState.currentLoggedInWallet.selectDefaultAccount().address);
    const balance = ref(Helper.toCurrencyFormat(walletState.currentLoggedInWallet.selectDefaultAccount().balance, networkState.currentNetworkProfile.network.currency.divisibility));
    const balanceNumber = ref(walletState.currentLoggedInWallet.selectDefaultAccount().balance);
    const isMultiSigBool = ref(isMultiSig(walletState.currentLoggedInWallet.selectDefaultAccount().address));

    const supply = ref('0');

    const showNoBalance = ref(false);
    const isNotCosigner = computed(() => getMultiSigCosigner.value.list.length == 0 && isMultiSig(selectedAccAdd.value));

    const accounts = computed( () => {
      if(walletState.currentLoggedInWallet){
        if(walletState.currentLoggedInWallet.others){
          const concatOther = walletState.currentLoggedInWallet.accounts.concat(walletState.currentLoggedInWallet.others)
          return concatOther;
        } else{
          return walletState.currentLoggedInWallet.accounts;
        }
      } else{
        return [];
      }
    });

    const moreThanOneAccount = computed(()=>{
      return accounts.value.length > 1;
    });

    const getMultiSigCosigner = computed(() => {
      return AssetsUtils.getCosignerList(selectedAccAdd.value);
    });

    const changeSelection = (i) => {
      selectedAccName.value = i.name;
      selectedAccAdd.value = i.address;
      balance.value = i.balance;
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;
    }

    const clearInput = () => {
      console.log('clear button is pressed');
    };

    watch(currentSelectedName, (n, o) => {
      if(n!=o){
        recipient.value = '';
      }
    });


    const createMosaic = () => {
      console.log('create button is pressed')
    };

    const cosigner = ref('');
    // get cosigner
    watch(getMultiSigCosigner, (n) => {
      // if it is a multisig
      if(n.list.length > 0){
        if(n.list.length > 1){
          cosigner.value = cosignerAddress.value;
        }else{
          cosigner.value = n.list[0].address;
        }
      }else{
        cosigner.value = '';
      }
    });
 
 
    const contact = computed(() => {
      if(!walletState.currentLoggedInWallet){
        return [];
      }
      const wallet = walletState.currentLoggedInWallet;
      var contact = [];
      wallet.accounts.forEach((element) => {
        contact.push({
          value: element.address,
          label: element.name + " -"+t('transfer.owneraccount'),
        });
      });
      if (wallet.contacts != undefined) {
        wallet.contacts.forEach((element) => {
          contact.push({
            value: element.address,
            label: element.name + " -"+t('services.contact'),
          });
        });
      }
      return contact;
      /* appStore.getContact() */
    });

      const makeTransfer = () => {
      if (sendXPX.value == "0" && !forceSend.value) {
        toggleConfirm.value = true;
      } else {
        // console.log(recipient.value.toUpperCase() + ' : ' + walletPassword.value + ' : ' + selectedAccName.value + ' : ' + encryptedMsg.value + ' : ' + walletPassword.value)
        let selectedCosign;
        if (isMultiSigBool.value) {
          // if this is a multisig, get cosigner name along
          let selectedCosignList = getWalletCosigner();
          if (selectedCosignList.length > 1) {
            selectedCosign = cosignAddress.value;
          } else {
            selectedCosign = getWalletCosigner()[0].address;
          }
        }
        let transferStatus = createTransaction(
          recipient.value.toUpperCase(),
          sendXPX.value,
          messageText.value,
          selectedMosaic.value,
          mosaicSupplyDivisibility.value,
          walletPassword.value,
          selectedAccName.value,
          selectedCosign,
          encryptedMsg.value
        );
        if (!transferStatus) {
          err.value = t('scriptvalues.walletpasswordvalidation',{name : walletState.currentLoggedInWallet.name});
        } else {
          // transaction made
          err.value = "";
          // check if address is saved in the contact list
          // if not display add contact model
          if (!accountUtils.checkAvailableContact(recipient.value)) {
            /* appStore.checkAvailableContact(recipient.value) */
            // add new contact
            togglaAddContact.value = true;
          } else {
            clearInput();
          }
          // show notification
          // getMosaicsAllAccounts(appStore, siriusStore);
          // play notification sound
          forceSend.value = false;
        }
      }
    };

    return {
      recipient,
      disabledClear,
      accounts,
      moreThanOneAccount,
      showMenu,
      currentSelectedName,
      selectedAccName,
      selectedAccAdd,
      balance,
      balanceNumber,
      showNoBalance,
      err,
      disableCreate,
      clearInput,
      changeSelection,
      createMosaic,
      isMultiSig,
      isMultiSigBool,
      getMultiSigCosigner,
      cosignerBalanceInsufficient,
      cosignerAddress,
      isNotCosigner,
      walletName
    }
  },

}
</script>
<style scoped lang="scss">

.slide-enter-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
   -moz-transition-timing-function: ease-in;
   -webkit-transition-timing-function: ease-in;
   -o-transition-timing-function: ease-in;
   transition-timing-function: ease-in;
}

.slide-leave-active {
   -moz-transition-duration: 1s;
   -webkit-transition-duration: 1s;
   -o-transition-duration: 1s;
   transition-duration: 1s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave-from {
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}

.optionDiv:hover{
  background: #D9EBFF;
}

</style>
