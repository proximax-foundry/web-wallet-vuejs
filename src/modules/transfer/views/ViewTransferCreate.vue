<template>
  <div class="flex justify-between text-md">
    <div>
      <span class="text-gray-300">{{$t('common.transfer')}}></span>
      <span class="text-blue-primary font-bold">{{$t('transfer.makeTransaction')}}</span>
    </div>
    <div>
      <!-- <router-link :to="{ name: 'ViewServices' }" class="font-bold">All Services</router-link> -->
    </div>
  </div>
  <div class="mt-2 py-3 gray-line text-center">
    <form @submit.prevent="create" class="mt-10">
      <fieldset class="w-full">
        <div class="mb-5 border-b border-gray-200">
          <div class="error error_box" v-if="err != ''">{{ err }}</div>
          <div v-if="moreThanOneAccount" class="text-left p-4">
            <div class="mb-1 cursor-pointer z-20 border-b border-gray-200" @click="showMenu = !showMenu">
              <div class="font-bold text-xs">
                {{ selectedAccName }}
                <span v-if="isMultiSigBool" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200 text-gray-800">
                  {{$t('common.multisig')}}
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
                        {{$t('common.multisig')}}
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
                {{$t('common.cosigner')}}:
                <span class="font-bold" v-if="getWalletCosigner().length == 1"> 
                  {{ getWalletCosigner()[0].name }} ({{$t('common.balance')}}:{{  getWalletCosigner()[0].balance }} XPX)
                    <span v-if="getWalletCosigner()[0].balance <lockFundTotalFee.value" class="error">
                      - {{$t('common.insufficientBalance')}}
                    </span>
                </span>
                <span class="font-bold" v-else>
                  <select v-model="cosignAddress">
                    <option v-for="(element, item) in  getWalletCosigner()" :value="element.address" :key="item">
                      {{ element.name }} ({{$t('common.balance')}}: {{ element.balance }} XPX)
                    </option>
                  </select>
                </span>
                <div v-if="cosignerBalanceInsufficient" class="error">
                  - {{$t('common.insufficientBalance')}}
                </div>
              </div>
            </div>
            <div class="error" v-else>
             {{$t('common.noCosigner')}} 
            </div>
          </div>
          <SelectInputPlugin v-if="showContactSelection" :placeholder="$t('common.contact',2)" errorMessage=""  v-model="selectContact" :options="contact" @default-selected="selectContact = 0"  @show-selection="updateAdd"/>
          <div class="flex">
            <div class="flex-grow mr-5">
              <TextInput :placeholder="$t('common.recipient')" :errorMessage="addressErrorMsg" :showError="showAddressError" v-model="recipient" icon="wallet" :disabled="disableRecipient"/>
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
                {{$t('common.balance')}}: 
              <span class="text-xs">
                {{ balance }} XPX
              </span>
            </div>
          </div>
          <SupplyInput v-model="sendXPX" :title="$t('common.send')" :balance="Number(balance)" :placeholder="$t('transfer.enterAmount')" type="text" icon="coins" :showError="showBalanceErr" :errorMessage="$t('common.insufficientBalance')" :decimal="6" class="mt-5" :disabled="disableSupply"/>
        </div>
        <div v-for="(mosaic, index) in mosaicsCreated" :key="index">
          <MosaicInput :placeholder="$t('common.selectAsset')" errorMessage="" v-model="selectedMosaic[index].id" :index="index" :options="mosaics" :disableOptions="selectedMosaic" @show-mosaic-selection="updateMosaic" @remove-mosaic-selected="removeMosaic"/>
          <SupplyInput v-if="selectedMosaic[index].id != 0"  :title="$t('common.send')" v-model="selectedMosaic[index].amount" :balance="getSelectedMosaicBalance[index]" :placeholder="$t('transfer.enterAmount')" type="text" icon="coins" :showError="showBalanceErr" :errorMessage="$t('common.insufficientBalance')" :decimal="mosaicSupplyDivisibility[index]"/>
        </div>
        <div>
          <button class="mb-5 hover:shadow-lg bg-white hover:bg-gray-100 rounded-3xl border-2 font-bold px-6 py-2 border-blue-primary text-blue-primary outline-none focus:outline-none disabled:opacity-50" :disabled="addMosaicsButton" @click="displayMosaicsOption">
            (+) {{$t('transfer.addAssets')}} 
          </button>
        </div>
        <div class="mb-5 border-t pt-4 border-gray-200">
          <div class="rounded-2xl bg-gray-100 p-5">
            <input id="regularMsg" type="radio" name="msgOption" value="regular" v-model="msgOption" @change="clearMsg()" :disabled="disableRegularMsg == 1"/>
            <label for="regularMsg" class="cursor-pointer font-bold ml-4 mr-5"> 
              {{$t('common.regular')}}
            </label>
            <input id="hexMsg" type="radio" name="msgOption" value="hex" v-model="msgOption" @change="clearMsg()" :disabled="disableHexMsg == 1"/>
            <label for="hexMsg" class="cursor-pointer font-bold ml-4"
              >{{$t('common.hexadecimal')}}
              </label>
          </div>
        </div>
        <div class="mb-5" v-if="!encryptedMsgDisable">
          <div class="rounded-2xl bg-gray-100 p-5">
            <input id="encryptedMsg"  type="checkbox" value="encryptedMsg" v-model="encryptedMsg" :disabled="disableEncryptMsg == 1"/>
            <label for="encryptedMsg" class="cursor-pointer font-bold ml-4 mr-5 text-tsm">
              {{$t('common.encrypted')}}
            </label>
          </div>
        </div>
        <TransferTextareaInput :placeholder="$t('common.message')" errorMessage="" v-model="messageText" :remainingChar="remainingChar" :limit="messageLimit" icon="comment" class="mt-5" :msgOpt="msgOption" :disabled="disableMsgInput"/>
        <div class="rounded-2xl bg-gray-100 p-5">
          <div class="inline-block mr-4 text-xs">
            <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1 text-gray-500"/>
            {{$t('common.unconfirmed')}}: {{ effectiveFee }} XPX
          </div>
        </div>
        <div class="p-4 rounded-xl bg-gray-100 mt-2 items-center w-full text-xs text-gray-800 " v-if="isMultiSig(selectedAccAdd)">
          <div class="text-center">
            <div class="inline-block">
              <div class="flex">
                <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline-block mr-1 self-center"/>
                <div class="inline-block self-center text-left">
                  <div>{{$t('common.lockFund')}}: {{ lockFundCurrency }} {{ currencyName }}</div>
                  <div> {{$t('common.unconfirmed')}}: {{ lockFundTxFee }}{{ currencyName }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PasswordInput :placeholder="$t('common.enterWalletPassword')" :errorMessage="$t('common.enterPassword',{name: walletName })" :showError="showPasswdError" v-model="walletPassword" icon="lock" class="mt-5" :disabled="disablePassword"/>
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput()">
            {{$t('common.clear')}}
          </button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate" @click="makeTransfer()">
            {{$t('common.create')}}
          </button>
        </div>
      </fieldset>
    </form>
    <AddContactModal :toggleModal="togglaAddContact" :saveAddress="recipient" />
    <ConfirmSendModal :toggleModal="toggleConfirm" />
  </div>
</template>
<script>
import { Helper } from "@/util/typeHelper";
import { computed, ref, getCurrentInstance, watch } from "vue";
import TextInput from "@/components/TextInput.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import SelectInputPlugin from "@/components/SelectInputPlugin.vue";
import MosaicInput from "@/modules/transfer/components/MosaicInput.vue";
import SupplyInput from "@/components/SupplyInput.vue";
import TransferTextareaInput from "@/modules/transfer/components/TransferTextareaInput.vue";
import {
  createTransaction,
  makeTransaction,
} from "@/util/transfer"; //getMosaicsAllAccounts
import AddContactModal from "@/modules/transfer/components/AddContactModal.vue";
import ConfirmSendModal from "@/modules/transfer/components/ConfirmSendModal.vue";
import {useI18n} from 'vue-i18n'
import { multiSign } from "@/util/multiSignatory";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { accountUtils } from "@/util/accountUtils";
import { TransactionUtils } from "@/util/transactionUtils";
import { WalletUtils } from "@/util/walletUtils";

export default { 
  name: "ViewTransferCreate",
  components: {
    TextInput,
    PasswordInput,
    MosaicInput,
    SelectInputPlugin,
    SupplyInput,
    TransferTextareaInput,
    AddContactModal,
    ConfirmSendModal,
  },
  setup() {
    const {t} = useI18n();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const showContactSelection = ref(false);
    const showBalanceErr = ref(false);
    const selectContact = ref("0");
    const recipient = ref("");
    const msgOption = ref("regular");
    const messageText = ref("");
    const walletPassword = ref("");
    const err = ref("");
    const showMenu = ref(false);
    const encryptedMsg = ref("");
    const currentSelectedName = ref("");
    const togglaAddContact = ref(false);
    const selectedMosaic = ref([]);
    const mosaicsCreated = ref([]);
    const mosaicsSelected = ref([]);
    const selectedMosaicAmount = ref([]);
    const mosaicSupplyDivisibility = ref([]);
    const currentlySelectedMosaic = ref([]);
    const sendXPX = ref("0");
    const encryptedMsgDisable = ref(true);
    const toggleConfirm = ref(false);
    const forceSend = ref(false);
    const effectiveFee = ref("0.037750");
    const cosignAddress = ref("");
    const disableAllInput = ref(false);
    const disableRecipient = computed(() => disableAllInput.value);
    const disableSupply = computed(() => disableAllInput.value);
    const disableRegularMsg = computed(() => disableAllInput.value);
    const disableHexMsg = computed(() => disableAllInput.value);
    const disableEncryptMsg = computed(() => disableAllInput.value);
    const disableMsgInput = computed(() => disableAllInput.value);
    const disablePassword = computed(() => disableAllInput.value);
    const cosignerBalanceInsufficient = ref(false);
    

    const walletName = walletState.currentLoggedInWallet.name
    const currencyName = computed(
      () => networkState.currentNetworkProfile.network.currency.name
    );
    /* chainNetwork.getCurrencyName() */

    // console.log('chainNetwork.getProfileConfig().lockedFundsPerAggregate')
    // console.log(chainNetwork.getProfileConfig().lockedFundsPerAggregate)
    // console.log(siriusStore.state.currentNetworkProfileConfig.maxMessageSize)
    const lockFund = computed(() =>
      Helper.convertToExact(
        networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
        networkState.currentNetworkProfile.network.currency.divisibility
      )
    );
    /*  chainNetwork.getProfileConfig().lockedFundsPerAggregate */
    /*  chainNetwork.getCurrencyDivisibility() */
    const lockFundCurrency = computed(() =>
      Helper.convertToCurrency(
        networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
        networkState.currentNetworkProfile.network.currency.divisibility
      )
    );
    /*  chainNetwork.getProfileConfig().lockedFundsPerAggregate */
    /*  chainNetwork.getCurrencyDivisibility() */
    const lockFundTxFee = ref(0.0445);
    const lockFundTotalFee = computed(
      () => lockFund.value + lockFundTxFee.value
    );

    // const messageLimit = computed(()=> chainNetwork.getProfileConfig().maxMessageSize - 1);
    const messageLimit = computed(
      () => networkState.currentNetworkProfileConfig.maxMessageSize - 1
    );
    /*  siriusStore.state.currentNetworkProfileConfig.maxMessageSize - 1 */

    const addressPatternShort = "^[0-9A-Za-z]{40}$";
    const addressPatternLong = "^[0-9A-Za-z-]{46}$";

    const addMsg = ref("");
    const remainingChar = ref(0);
    const showAddressError = ref(false);
    const addressErrorMsg = computed(() => {
      let addErrDefault = t('transfer.invalidRecipient');
      return addMsg.value ? addMsg.value : addErrDefault;
    });

    const passwdPattern = "^[^ ]{8,}$";
    const showPasswdError = ref(false);
    const disableCreate = computed(() => {
      // console.log(walletPassword.value.match(passwdPattern) && !showAddressError.value && recipient.value.length > 0);
      return !(
        walletPassword.value.match(passwdPattern) &&
        !showAddressError.value &&
        recipient.value.length > 0
      );
    });

    const isMultiSig = (address) => {
      const account = walletState.currentLoggedInWallet.accounts.find(
        (account) => account.address === address
      );
      let isMulti = false;
      /*   appStore.getAccDetailsByAddress(address); */
      if (account != undefined) {
        isMulti = account.getDirectParentMultisig().length ? true : false;
      }

      /* if(account.isMultisign != undefined){
        if(account.isMultisign != '' || account.isMultisign != null){
          if(account.isMultisign.cosignatories != undefined){
            if(account.isMultisign.cosignatories.length > 0){
              isMulti = true;
            }
          }
        }
      } */
      return isMulti;
    };

    // get balance
    const selectedAccName = ref(
      walletState.currentLoggedInWallet.selectDefaultAccount().name
    );
    /* appStore.getFirstAccName() */
    const selectedAccAdd = ref(
      walletState.currentLoggedInWallet.selectDefaultAccount().address
    );
    /* appStore.getFirstAccAdd() */
    const balance = computed(() => {
      if (walletState.currentLoggedInWallet) {
        return walletState.currentLoggedInWallet.accounts.find(
          (element) => element.address === selectedAccAdd.value
        ).balance;
      } else {
        return "0";
      }
    });
    const isMultiSigBool = ref(
      isMultiSig(
        selectedAccAdd.value
      )
    );
    /*  appStore.getFirstAccAdd() */

    // enable and disable inputs based on cosign balance
   
    if (isMultiSigBool.value) {
      let cosigner = multiSign.fetchMultiSigCosigners(selectedAccAdd.value)
      if (cosigner.length > 0) {
        if (cosigner[0].balance < lockFundTotalFee.value) {
          disableAllInput.value = true;
          cosignerBalanceInsufficient.value = true;
        } else {
          disableAllInput.value = false;
          cosignerBalanceInsufficient.value = false;
        }
      } else {
        disableAllInput.value = true;
      }
    }

    const getWalletCosigner = () =>{
      return multiSign.fetchMultiSigCosigners(selectedAccAdd.value)
    }
    
    // check account balance at first load
    if (balance.value < lockFundTotalFee.value) {
      showBalanceErr.value = true;
    }

    const accounts = computed(() =>{
      if(!walletState.currentLoggedInWallet)
        return [];
      return walletState.currentLoggedInWallet.accounts;
    });
    /*  appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts */
    const moreThanOneAccount = computed(() => {
      /*  if(appStore.state.currentLoggedInWallet!=undefined){
        return (appStore.getWalletByName(appStore.state.currentLoggedInWallet.name).accounts.length > 1)?true:false;
      }else{
        return false;
      } */
      return accounts.value.length > 1;
    });

    const changeSelection = (i) => {
      selectedAccName.value = i.name;
      selectedAccAdd.value = i.address;
      // balance.value = i.balance;
      balance.value == 0? (showBalanceErr.value = true): (showBalanceErr.value = false);
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;
      // reset mosaic selection
      selectedMosaic.value = [];
      mosaicsCreated.value = [];
      selectedMosaicAmount.value = [];
      mosaicSupplyDivisibility.value = [];
    };
    // get cosigner if available
  /*   const getWalletCosigner = async() => {
        return new Promise((resolve, reject) => {
         multiSign.fetchMultiSigCosigners(selectedAccAdd.value)
        .then(response => {
          
          response.list.forEach(element=>{
            list.push({address: element.address , name: element.name, balance: element.balance}) 
          })
          resolve(list)
        })
        .catch(() => reject)
  })
    }; */

 
    const contact = computed(() => {
      if(!walletState.currentLoggedInWallet){
        return [];
      }
      const wallet = walletState.currentLoggedInWallet;
      var contact = [];
      wallet.accounts.forEach((element) => {
        contact.push({
          value: element.address,
          label: element.name + " -"+t('transfer.ownerAccount'),
        });
      });
      if (wallet.contacts != undefined) {
        wallet.contacts.forEach((element) => {
          contact.push({
            value: element.address,
            label: element.name + " -"+t('common.contact',1),
          });
        });
      }
      return contact;
      /* appStore.getContact() */
    });

    const clearInput = () => {
      selectContact.value = "0";
      walletPassword.value = "";
      recipient.value = "";
      encryptedMsgDisable.value = true;
      messageText.value = "";
      sendXPX.value = "0";
      emitter.emit("CLEAR_SELECT", 0);
      selectedMosaic.value = [];
      mosaicsCreated.value = [];
      selectedMosaicAmount.value = [];
      mosaicSupplyDivisibility.value = [];
      showContactSelection.value = false;
    };

    const clearMsg = () => {
      messageText.value = "";
      emitter.emit("CLEAR_TEXTAREA", 0);
    };

    // update select
    const updateAdd = (e) => {
      recipient.value = e;
    };
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
          err.value = t('common.invalidPassword');
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

    const getSelectedMosaicBalance = (index) => {
      const account = walletState.currentLoggedInWallet.accounts.find(
        (account) => account.address === selectedAccAdd.value
      );
      let mosaic = account.assets.find(
        (asset) => asset.idHex == selectedMosaic[index].id
      );
      /* let mosaic = appStore.getMosaicInfo(selectedAccAdd.value, selectedMosaic[index].id); */
      if (mosaic != undefined) {
        return mosaic.amount;
      } else {
        return "0";
      }
    };

    // get mosaics of current selected account
    // getMosaicsAllAccounts(appStore, siriusStore);
    const addMosaicsButton = computed(() => {
      if (!disableSupply.value) {
        let account;
        if(!walletState.currentLoggedInWallet){
          account = undefined;
        }else{
          account = walletState.currentLoggedInWallet.accounts.find(
            (element) => element.name == selectedAccName.value
          );
        }
        
        if (account != undefined) {
          if (account.assets != undefined) {
            if (
              account.assets.length == 0 ||
              mosaicsCreated.value.length == account.assets.length
            ) {
              return true;
            } else {
              return false;
            }
          }
        }
        /* let mosaic = appStore.getAccDetails(selectedAccName.value).mosaic; */

        return true;
      } else {
        return true;
      }
    });

    // generate mosaic selector
    const mosaics = computed(() => {
      var mosaicOption = [];
      if(!walletState.currentLoggedInWallet){
        return mosaicOption;
      }
      const account = walletState.currentLoggedInWallet.accounts.find(
        (element) => element.name == selectedAccName.value
      );
      if (account.assets.length > 0) {
        /*   appStore.getAccDetails(selectedAccName.value).mosaic.length > 0 */
        account.assets.forEach((i, index) => {
          /*  appStore.getAccDetails(selectedAccName.value).mosaic.forEach((i, index) */
          mosaicOption.push({
            val: i.idHex,
            /*  i.id */
            text: i.idHex + " >"+t('common.balance') +": " +Helper.amountFormatterSimple(i.amount,i.divisibility),
            id: index + 1,
          });
        });
      }
      return mosaicOption;
    });

    const displayMosaicsOption = () => {
      mosaicsCreated.value.push(0);
      selectedMosaic.value.push({ id: 0, amount: "0" });
    };

    // update mosaic
    const updateMosaic = (e) => {
      // get mosaic info and format divisibility in supply input
      const account = walletState.currentLoggedInWallet.accounts.find(
        (account) => account.address === selectedAccAdd.value
      );
      let mosaic = account.assets.find(
        (asset) => asset.idHex == selectedMosaic.value[e.index].id
      );
      /*  const mosaic = appStore.getMosaicInfo(selectedAccAdd.value, selectedMosaic.value[e.index].id); */
      selectedMosaic.value[e.index].amount = "0";
      mosaicSupplyDivisibility.value[e.index] = mosaic.divisibility;
      emitter.emit("CLOSE_MOSAIC_INSUFFICIENT_ERR", false);
    };

    const removeMosaic = (e) => {
      mosaicsCreated.value.splice(e.index, 1);
      selectedMosaic.value.splice(e.index, 1);
      mosaicSupplyDivisibility.value.splice(e.index, 1);
    };
    
    watch(selectedAccAdd, (n, o) => {
      isMultiSigBool.value = isMultiSig(n);
      if (isMultiSigBool.value) {
        
          let cosigner = multiSign.fetchMultiSigCosigners(n)
          if (cosigner.length > 0) {
            cosignAddress.value = cosigner[0].address;
            if (cosigner[0].balance < lockFundTotalFee.value) {
              disableAllInput.value = true;
              // console.log('disableAllInput();')
            } else {
              disableAllInput.value = false;
              // console.log('enableAllInput();')
            }
          } else {
            disableAllInput.value = true;
          }
      }
      else {
        disableAllInput.value = false;
      }   
    })
    

    watch(cosignAddress, (n, o) => {
      if (n != o) {
         let cosigners = multiSign.fetchMultiSigCosigners(selectedAccAdd.value)
          if (
          cosigners.find((element) => element.address == n).balance <
          lockFundTotalFee.value
        ) {
          cosignerBalanceInsufficient.value = true;
        } else {
          cosignerBalanceInsufficient.value = false;
        }
        
      }
    });

    watch(balance, (n) => {
      if (n == 0) {
        showBalanceErr.value = true;
      }
    });
  
    watch(recipient, (add) => {
      if (
        (recipient.value.length == 46 &&
          recipient.value.match(addressPatternLong)) ||
        (recipient.value.length == 40 &&
          recipient.value.match(addressPatternShort))
      ) {
        if(!walletState.currentLoggedInWallet){
          return;
        }
        const verifyRecipientAddress = accountUtils.verifyAddress(
          walletState.currentLoggedInWallet.selectDefaultAccount().address,
          recipient.value
        );
        /* appStore.getCurrentAdd(appStore.state.currentLoggedInWallet.name) */
        showAddressError.value = !verifyRecipientAddress.isPassed.value;
        addMsg.value = verifyRecipientAddress.errMessage.value;
      } else {
        recipient.value.length > 0
          ? (showAddressError.value = true)
          : (showAddressError.value = false);
      }

      // show and hide encrypted message option
      if (add.match(addressPatternLong) || add.match(addressPatternShort)) {
         accountUtils.verifyPublicKey(recipient.value).then(verify =>
          encryptedMsgDisable.value = verify
         )
      } else {
        encryptedMsgDisable.value = true;
      }
    });

    watch(currentSelectedName, (n, o) => {
      if (n != o) {
        recipient.value = "";
      }
    });

    watch(messageText, (n, o) => {
      if (n != o) {
        effectiveFee.value = makeTransaction.calculate_fee(
          n,
          sendXPX.value,
          selectedMosaic.value
        );
        if (encryptedMsg.value && messageText.value) {
          remainingChar.value = TransactionUtils.getFakeEncryptedMessageSize(messageText.value);
        } else {
          remainingChar.value = TransactionUtils.getPlainMessageSize(messageText.value);
        }
      }
    });

    watch(encryptedMsgDisable, (n) => {
      if (!n) {
        encryptedMsg.value = "";
      }
    });

    watch(encryptedMsg, (n) => {
      if (n) {
        if (messageText.value) {
          remainingChar.value = TransactionUtils.getFakeEncryptedMessageSize(messageText.value);
        }
      } else {
        remainingChar.value = TransactionUtils.getPlainMessageSize(messageText.value);
      }
    });

    emitter.on("CLOSE_MODAL", (payload) => {
      togglaAddContact.value = payload;
      clearInput();
    });

    // confirm modal
    emitter.on("CLOSE_CONFIRM_SEND_MODAL", (payload) => {
      toggleConfirm.value = payload;
    });

    emitter.on("CONFIRM_PROCEED_SEND", (payload) => {
      // console.log('Force send: ' + payload);
      // console.log('PW:' + walletPassword.value);
      if (payload) {
        forceSend.value = payload;
        toggleConfirm.value = false;
        makeTransfer();
      }
    });

    return {
      moreThanOneAccount,
      showMenu,
      currentSelectedName,
      selectedAccName,
      selectedAccAdd,
      addressErrorMsg,
      showAddressError,
      balance,
      showBalanceErr,
      err,
      contact,
      recipient,
      sendXPX,
      messageText,
      msgOption,
      showContactSelection,
      selectContact,
      walletPassword,
      disableCreate,
      clearInput,
      showPasswdError,
      updateAdd,
      addMosaicsButton,
      clearMsg,
      accounts,
      changeSelection,
      encryptedMsgDisable,
      encryptedMsg,
      makeTransfer,
      togglaAddContact,
      displayMosaicsOption,
      selectedMosaic,
      mosaicsCreated,
      mosaicsSelected,
      mosaics,
      selectedMosaicAmount,
      getSelectedMosaicBalance,
      mosaicSupplyDivisibility,
      updateMosaic,
      currentlySelectedMosaic,
      removeMosaic,
      toggleConfirm,
      isMultiSig,
      isMultiSigBool,
      effectiveFee,
      cosignAddress,
      getWalletCosigner,
      disableRecipient,
      disableSupply,
      disableRegularMsg,
      disableHexMsg,
      disableEncryptMsg,
      disableMsgInput,
      disablePassword,
      cosignerBalanceInsufficient,
      messageLimit,
      remainingChar,
      lockFundCurrency,
      currencyName,
      lockFundTxFee,
      lockFundTotalFee,
      walletName
    };
  },
};
</script>
<style scoped lang="scss">
.slide-enter-active {
  -moz-transition-duration: 1s;
  -webkit-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
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

.slide-enter-to,
.slide-leave-from {
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}

.optionDiv:hover {
  background: #d9ebff;
}
</style>
