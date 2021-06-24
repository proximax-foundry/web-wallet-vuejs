<template>
  <div class="flex justify-between text-md">
    <div>
      <span class="text-gray-300">Transfer ></span>
      <span class="text-blue-primary font-bold">Make a Transaction</span>
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
            <div
              class="mb-1 cursor-pointer z-20 border-b border-gray-200"
              @click="showMenu = !showMenu"
            >
              <div class="font-bold text-xs">
                {{ selectedAccName }}
                <span
                  v-if="isMultiSigBool"
                  class="
                    text-xs
                    font-normal
                    ml-2
                    inline-block
                    py-1
                    px-2
                    rounded
                    bg-blue-200
                    text-gray-800
                  "
                  >Multisig</span
                >
              </div>
              <div class="text-gray-400 mt-1 text-sm">{{ selectedAccAdd }}</div>
            </div>
            <transition name="slide">
              <div v-if="showMenu" class="z-10">
                <div
                  :key="item.address"
                  :i="index"
                  v-for="(item, index) in accounts"
                  class="p-2 cursor-pointer"
                  :class="
                    item.name == selectedAccName
                      ? 'bg-blue-primary text-white font-bold'
                      : 'text-gray-800 bg-gray-50 optionDiv'
                  "
                  @click="changeSelection(item)"
                  :title="'Address is ' + item.address"
                >
                  <div>
                    {{ item.name }}
                    <span
                      v-if="isMultiSig(item.address)"
                      class="
                        text-xs
                        font-normal
                        ml-2
                        inline-block
                        py-1
                        px-2
                        rounded
                        bg-blue-200
                        text-gray-800
                      "
                      >Multisig</span
                    >
                  </div>
                </div>
              </div>
            </transition>
            <input type="hidden" v-model="currentSelectedName" />
          </div>
          <div v-if="isMultiSigBool" class="text-left mt-2 mb-5 ml-4">
            <div v-if="getWalletCosigner().list.length > 0">
              <div class="text-tsm">
                Cosigner:
                <span
                  class="font-bold"
                  v-if="getWalletCosigner().list.length == 1"
                  >{{ getWalletCosigner().list[0].name }} (Balance:
                  {{ getWalletCosigner().list[0].balance }} XPX)
                  <span
                    v-if="
                      getWalletCosigner().list[0].balance <
                      lockFundTotalFee.value
                    "
                    class="error"
                    >- Insufficient balance</span
                  ></span
                >
                <span class="font-bold" v-else
                  ><select v-model="cosignAddress">
                    <option
                      v-for="(element, item) in getWalletCosigner().list"
                      :value="element.address"
                      :key="item"
                    >
                      {{ element.name }} (Balance: {{ element.balance }} XPX)
                    </option>
                  </select></span
                >
                <div v-if="cosignerBalanceInsufficient" class="error">
                  - Insufficient balance
                </div>
              </div>
            </div>
            <div class="error" v-else>No eligible cosigner in this wallet</div>
          </div>
          <SelectInputPlugin
            v-if="showContactSelection"
            placeholder="Contact"
            errorMessage=""
            v-model="selectContact"
            :options="contact"
            @default-selected="selectContact = 0"
            @show-selection="updateAdd"
          />
          <div class="flex">
            <div class="flex-grow mr-5">
              <TextInput
                placeholder="Recipient"
                :errorMessage="addressErrorMsg"
                :showError="showAddressError"
                v-model="recipient"
                icon="wallet"
                :disabled="disableRecipient"
              />
            </div>
            <div class="flex-none">
              <div
                class="
                  rounded-full
                  bg-gray-300
                  w-14
                  h-14
                  cursor-pointer
                  relative
                "
                style="top: -5px"
                @click="showContactSelection = !showContactSelection"
              >
                <font-awesome-icon
                  icon="id-card-alt"
                  class="h-20 w-20 inline text-blue-primary absolute"
                  style="top: -12px; left: 19px"
                ></font-awesome-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="text-left p-3 pb-0 border-l-8 border-gray-100">
          <div class="bg-gray-100 rounded-2xl p-3">
            <div class="inline-block mr-4 tfaddext-tsm">
              <img
                src="@/assets/img/icon-prx-xpx-blue.svg"
                class="w-5 inline mr-1"
              />Balance: <span class="text-xs">{{ balance }} XPX</span>
            </div>
          </div>
          <SupplyInput
            v-model="sendXPX"
            title="Send"
            :balance="Number(balance)"
            placeholder="Enter Amount"
            type="text"
            icon="coins"
            :showError="showBalanceErr"
            errorMessage="Insufficient balance"
            :decimal="6"
            class="mt-5"
            :disabled="disableSupply"
          />
        </div>
        <div v-for="(mosaic, index) in mosaicsCreated" :key="index">
          <MosaicInput
            placeholder="Select mosaic"
            errorMessage=""
            v-model="selectedMosaic[index].id"
            :index="index"
            :options="mosaics"
            :disableOptions="selectedMosaic"
            @show-mosaic-selection="updateMosaic"
            @remove-mosaic-selected="removeMosaic"
          />
          <SupplyInput
            v-if="selectedMosaic[index].id != 0"
            v-model="selectedMosaic[index].amount"
            :balance="getSelectedMosaicBalance[index]"
            placeholder="Enter Amount"
            type="text"
            icon="coins"
            :showError="showBalanceErr"
            errorMessage="Insufficient balance"
            :decimal="mosaicSupplyDivisibility[index]"
          />
        </div>
        <div>
          <button
            class="
              mb-5
              hover:shadow-lg
              bg-white
              hover:bg-gray-100
              rounded-3xl
              border-2
              font-bold
              px-6
              py-2
              border-blue-primary
              text-blue-primary
              outline-none
              focus:outline-none
              disabled:opacity-50
            "
            :disabled="addMosaicsButton"
            @click="displayMosaicsOption"
          >
            (+) Add Mosaics
          </button>
        </div>
        <div class="mb-5 border-t pt-4 border-gray-200">
          <div class="rounded-2xl bg-gray-100 p-5">
            <input
              id="regularMsg"
              type="radio"
              name="msgOption"
              value="regular"
              v-model="msgOption"
              @change="clearMsg()"
              :disabled="disableRegularMsg == 1"
            /><label for="regularMsg" class="cursor-pointer font-bold ml-4 mr-5"
              >Regular</label
            >
            <input
              id="hexMsg"
              type="radio"
              name="msgOption"
              value="hex"
              v-model="msgOption"
              @change="clearMsg()"
              :disabled="disableHexMsg == 1"
            /><label for="hexMsg" class="cursor-pointer font-bold ml-4"
              >Hexadecimal</label
            >
          </div>
        </div>
        <div class="mb-5" v-if="!encryptedMsgDisable">
          <div class="rounded-2xl bg-gray-100 p-5">
            <input
              id="encryptedMsg"
              type="checkbox"
              value="encryptedMsg"
              v-model="encryptedMsg"
              :disabled="disableEncryptMsg == 1"
            /><label
              for="encryptedMsg"
              class="cursor-pointer font-bold ml-4 mr-5 text-tsm"
              >Encrypted</label
            >
          </div>
        </div>
        <TransferTextareaInput
          placeholder="Message"
          errorMessage=""
          v-model="messageText"
          :remainingChar="remainingChar"
          :limit="messageLimit"
          icon="comment"
          class="mt-5"
          :msgOpt="msgOption"
          :disabled="disableMsgInput"
        />
        <div class="rounded-2xl bg-gray-100 p-5">
          <div class="inline-block mr-4 text-xs">
            <img
              src="@/assets/img/icon-prx-xpx-blue.svg"
              class="w-5 inline mr-1 text-gray-500"
            />Unconfirmed/Recommended Fee: {{ effectiveFee }} XPX
          </div>
        </div>
        <div
          class="
            p-4
            rounded-xl
            bg-gray-100
            mt-2
            items-center
            w-full
            text-xs text-gray-800
          "
          v-if="isMultiSig(selectedAccAdd)"
        >
          <div class="text-center">
            <div class="inline-block">
              <div class="flex">
                <img
                  src="@/assets/img/icon-prx-xpx-blue.svg"
                  class="w-5 inline-block mr-1 self-center"
                />
                <div class="inline-block self-center text-left">
                  <div>LockFund: {{ lockFundCurrency }} {{ currencyName }}</div>
                  <div>
                    Unconfirmed/Recommended Fee: {{ lockFundTxFee }}
                    {{ currencyName }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PasswordInput
          placeholder="Enter Wallet Password"
          :errorMessage="
            'Please enter wallet ' +
            walletState.currentLoggedInWallet.name +
            '\'s password'
          "
          :showError="showPasswdError"
          v-model="walletPassword"
          icon="lock"
          class="mt-5"
          :disabled="disablePassword"
        />
        <div class="mt-10">
          <button
            type="button"
            class="default-btn mr-5 focus:outline-none"
            @click="clearInput()"
          >
            Clear
          </button>
          <button
            type="submit"
            class="default-btn py-1 disabled:opacity-50"
            :disabled="disableCreate"
            @click="makeTransfer()"
          >
            Create
          </button>
        </div>
      </fieldset>
    </form>
    <AddContactModal :toggleModal="togglaAddContact" :saveAddress="recipient" />
    <ConfirmSendModal :toggleModal="toggleConfirm" />
  </div>
</template>
<script >
import { computed, ref, inject, getCurrentInstance, watch } from "vue";
import TextInput from "@/components/TextInput.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import SelectInputPlugin from "@/components/SelectInputPlugin.vue";
import MosaicInput from "@/modules/transfer/components/MosaicInput.vue";
import SupplyInput from "@/components/SupplyInput.vue";
import TransferTextareaInput from "@/modules/transfer/components/TransferTextareaInput.vue";
import {
  createTransaction,
  makeTransaction,
  getFakeEncryptedMessageSize,
  getPlainMessageSize,
  convertToExact,
  convertToCurrency,
} from "@/util/transfer.js"; //getMosaicsAllAccounts
import AddContactModal from "@/modules/transfer/components/AddContactModal.vue";
import ConfirmSendModal from "@/modules/transfer/components/ConfirmSendModal.vue";

import { multiSign } from "@/util/multiSignatory";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { accountUtils } from "@/util/accountUtils";
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
    /* const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const chainNetwork = inject("chainNetwork"); */
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
    const sendXPX = ref(0);
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

    const currencyName = computed(
      () => networkState.currentNetworkProfile.network.currency.name
    );
    /* chainNetwork.getCurrencyName() */

    // console.log('chainNetwork.getProfileConfig().lockedFundsPerAggregate')
    // console.log(chainNetwork.getProfileConfig().lockedFundsPerAggregate)
    // console.log(siriusStore.state.currentNetworkProfileConfig.maxMessageSize)
    const lockFund = computed(() =>
      convertToExact(
        networkState.currentNetworkProfileConfig.lockedFundsPerAggregate,
        networkState.currentNetworkProfile.network.currency.divisibility
      )
    );
    /*  chainNetwork.getProfileConfig().lockedFundsPerAggregate */
    /*  chainNetwork.getCurrencyDivisibility() */
    const lockFundCurrency = computed(() =>
      convertToCurrency(
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
      let addErrDefault = "Invalid Recipient";
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
      const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address === address);
      let isMulti = false;
      /*   appStore.getAccDetailsByAddress(address); */
      /*  let isMulti = false; */
       isMulti = account.getDirectParentMultisig() ? true : false;
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
      walletState.currentLoggedInWallet.selectDefaultAccount.name
    );
    /* appStore.getFirstAccName() */
    const selectedAccAdd = ref(
      walletState.currentLoggedInWallet.selectDefaultAccount.address
    );
    /* appStore.getFirstAccAdd() */
    const balance = computed(() => {
      if (walletState.currentLoggedInWallet) {
        return walletState.currentLoggedInWallet.selectDefaultAccount.balance;
        /* appStore.getBalanceByAddress(selectedAccAdd.value); */
      } else {
        return 0;
      }
    });
    const isMultiSigBool = ref(
      isMultiSig(
        walletState.currentLoggedInWallet.selectDefaultAccount.address
      )
    );
    /*  appStore.getFirstAccAdd() */

    // enable and disable inputs based on cosign balance
    if (isMultiSigBool.value) {
      let cosign = multiSign.fetchWalletCosigner(selectedAccAdd.value);
      if (cosign.list.length > 0) {
        if (cosign.list[0].balance < lockFundTotalFee.value) {
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

    // check account balance at first load
    if (balance.value < lockFundTotalFee.value) {
      showBalanceErr.value = true;
    }

    const accounts = computed(() => walletState.currentLoggedInWallet.accounts);
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
      balance.value == 0
        ? (showBalanceErr.value = true)
        : (showBalanceErr.value = false);
      showMenu.value = !showMenu.value;
      currentSelectedName.value = i.name;
      isMultiSigBool.value = isMultiSig(i.address);
      // set default of cosinger if multiple return
      if (isMultiSigBool.value) {
        let cosign = multiSign.fetchWalletCosigner(i.address);
        if (cosign.list.length > 0) {
          cosignAddress.value = cosign.list[0].address;
          // console.log('cosign.list[0].balance');
          // console.log(cosign.list[0].balance);
          if (cosign.list[0].balance < lockFundTotalFee.value) {
            disableAllInput.value = true;
            // console.log('disableAllInput();')
          } else {
            disableAllInput.value = false;
            // console.log('enableAllInput();')
          }
        } else {
          disableAllInput.value = true;
        }
      } else {
        disableAllInput.value = false;
      }

      // reset mosaic selection
      selectedMosaic.value = [];
      mosaicsCreated.value = [];
      selectedMosaicAmount.value = [];
      mosaicSupplyDivisibility.value = [];
    };

    // get cosigner if available
    const getWalletCosigner = () => {
      let cosign = multiSign.fetchMultiSigCosigners(selectedAccAdd.value);
      let list = [];
      cosign.list.forEach((element) => {
        const account = walletState.currentLoggedInWallet.accounts.find(
          (account) => account.address === element.address
        );
        /*  appStore.getAccDetailsByAddress(element.address) */
        list.push({
          balance: account.balance,
          address: element.address,
          name: element.name,
        });
      });
      list.sort((a, b) => (a.balance < b.balance ? 1 : -1));
      return { list: list, numCosigner: cosign.numCosigner };
    };

    const contact = computed(() => {
      const wallet = walletState.currentLoggedInWallet;
      var contact = [];
      wallet.accounts.forEach((element) => {
        contact.push({
          value: element.address,
          label: element.name + " - Owner account",
        });
      });
      if (wallet.contacts != undefined) {
        wallet.contacts.forEach((element) => {
          contact.push({
            value: element.address,
            label: element.name + " - Contact",
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
      sendXPX.value = 0;
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
      if (sendXPX.value == 0 && !forceSend.value) {
        toggleConfirm.value = true;
      } else {
        // console.log(recipient.value.toUpperCase() + ' : ' + walletPassword.value + ' : ' + selectedAccName.value + ' : ' + encryptedMsg.value + ' : ' + walletPassword.value)
        let selectedCosign;
        if (isMultiSigBool.value) {
          // if this is a multisig, get cosigner name along
          let selectedCosignList = getWalletCosigner().list;
          if (selectedCosignList.length > 1) {
            selectedCosign = cosignAddress.value;
          } else {
            selectedCosign = getWalletCosigner().list[0].address;
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
          err.value = "Invalid wallet password";
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

    const getSelectedMosaicBalance = (index)=> {
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
        return 0;
      }
    };

    // get mosaics of current selected account
    // getMosaicsAllAccounts(appStore, siriusStore);
    const addMosaicsButton = computed(() => {
      if (!disableSupply.value) {
        const mosaic = walletState.currentLoggedInWallet.accounts.find(
          (element) => element.name == selectedAccName.value
        ).assets;
        /* let mosaic = appStore.getAccDetails(selectedAccName.value).mosaic; */
        if (mosaic != undefined) {
          if (
            mosaic.length == 0 ||
            mosaicsCreated.value.length == mosaic.length
          ) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      } else {
        return true;
      }
    });

    // generate mosaic selector
    const mosaics = computed(() => {
      var mosaicOption = [];
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
            text: i.idHex + " > Balance: " + i.amount.toFixed(i.divisibility),
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

    watch(cosignAddress, (n, o) => {
      if (n != o) {
        let cosign = multiSign.fetchWalletCosigner(selectedAccAdd.value);

        if (
          cosign.list.find((element) => element.address == n).balance <
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
        const verifyRecipientAddress = accountUtils.verifyAddress(
          walletState.currentLoggedInWallet.selectDefaultAccount.address,
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
        encryptedMsgDisable.value = accountUtils.verifyPublicKey(
          recipient.value
        );
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
        effectiveFee.value = makeTransaction.calculateFee(
          n,
          sendXPX.value,
          selectedMosaic.value
        );
        if (encryptedMsg.value && messageText.value) {
          remainingChar.value = getFakeEncryptedMessageSize(messageText.value);
        } else {
          remainingChar.value = getPlainMessageSize(messageText.value);
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
          remainingChar.value = getFakeEncryptedMessageSize(messageText.value);
        }
      } else {
        remainingChar.value = getPlainMessageSize(messageText.value);
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
