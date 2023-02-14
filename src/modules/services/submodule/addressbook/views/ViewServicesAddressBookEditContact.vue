<template>

  <div>
    
    <div class='w-9/12 ml-auto mr-auto mt-5'>
      <div class ='flex text-xs font-semibold border-b-2 menu_title_div'>
        <router-link :to="{ name: 'ViewServicesAddressBook' }" class= 'w-18 text-center border-b pb-3'>{{$t('general.list')}}</router-link>
        <router-link :to="{ name: 'ViewServicesAddressBookImport' }" class= 'w-18 text-center border-b pb-3'>{{$t('general.import')}}</router-link>
        <router-link :to="{ name: 'ViewServicesAddressBookExport' }" class= 'w-18 text-center border-b pb-3'>{{$t('general.export')}}</router-link>
      </div>
      <div class="border border-gray-100 p-5 filter drop-shadow-xl mt-10 bg-white">
        <div class="text-md mb-5 font-semibold">{{$t('addressBook.editContact')}}</div>
        <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
        <div class='mt-2 py-3 text-center px-0 flex'>
          <TextInputClean :placeholder="$t('general.name')" :errorMessage="$t('general.nameRequired')" v-model="contactName" icon="id-card-alt" :showError="showNameErr" class="w-52 inline-block mr-2" />
          <TextInputClean :placeholder="$t('general.address')" :errorMessage="addErr" v-model="addressOrPk" icon="wallet" :showError="showAddErr" class="w-96 inline-block mr-2" />
          <SelectInputPluginClean v-model="selectContactGroups" placeholder="Group" :options="contactGroups" selectDefault="-none-" ref="selectGroupDropdown" class="w-60 inline-block mr-2" />
          <button type="submit" class="default-btn py-1 disabled:opacity-50 h-12 flex items-center" :disabled="disableSave" @click="SaveContact()"><img src="@/modules/services/submodule/addressbook/img/icon-save.svg" class="inline-block mr-2">{{$t('addressBook.saveAddress')}}</button>
        </div>
      </div>
    </div>
    <AddCustomGroupModal :toggleModal="isDisplayAddCustomPanel" :groups="contactGroups" />
  </div>
</template>
<script>
import { Address } from "tsjs-xpx-chain-sdk";
import { computed, ref, watch, getCurrentInstance, onMounted } from 'vue';
import TextInputClean from '@/components/TextInputClean.vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { AddressBook } from '@/models/addressBook';
import { AddressBookUtils } from '@/util/addressBookUtils';
import { Wallet } from "@/models/wallet";
import { Wallets } from "@/models/wallets";
import { walletState } from '@/state/walletState';
import { WalletStateUtils } from '@/state/utils/walletStateUtils';
import {useI18n} from 'vue-i18n';
import { Helper } from "@/util/typeHelper";
import SelectInputPluginClean from "@/components/SelectInputPluginClean.vue";
import AddCustomGroupModal from "@/modules/services/submodule/addressbook/components/AddCustomGroupModal.vue";
import { AppState } from "@/state/appState";
import { WalletUtils } from "@/util/walletUtils";
export default {
  name: 'ViewServicesAddressBookEditContact',
  components: {
    TextInputClean,
    SelectInputPluginClean,
    AddCustomGroupModal,
  },
  props: {
    contactAddress: String
  },

  setup(props){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const selectGroupDropdown = ref(null);

    const {t} = useI18n();
    const toast = useToast();
    const err = ref('');
    const verifyAdd = ref(true);
    const addMsg = ref('');
    const router = useRouter();
    const selectContactGroups = ref('');

    // load particulars
    var contact = null
    if(walletState.currentLoggedInWallet){
      contact = walletState.currentLoggedInWallet.contacts.find((contact) => Helper.createAddress(contact.address).pretty() == props.contactAddress);
    }
    
    const contactName = ref(contact?contact.name:'');
    const addressOrPk = ref(props.contactAddress)
    const address = ref('');
    const publicKey = ref('');

    const contactGroupsList = ref([]);
    if(walletState.currentLoggedInWallet){
      walletState.currentLoggedInWallet.contacts.forEach((contact) => {
      contactGroupsList.value.push(contact.group);
    });
    }
    

    onMounted(() => {
      selectGroupDropdown.value.select(contact?contact.group:[]);
    });

    function uniqueValue(value, index, self) {
      return self.indexOf(value) === index;
    }

    const defaultList = [t('addressBook.work'),t('addressBook.friend'),t('addressBook.family'),t('addressBook.employee'),t('addressBook.director')];
    const addressBookList = defaultList.concat(contactGroupsList.value);
    var uniqueGroupLabels = addressBookList.filter(uniqueValue);
    uniqueGroupLabels = uniqueGroupLabels.filter((value) => value != '-none-');
    uniqueGroupLabels.sort();

    const action = ref([]);
    action.value.push({value: '-none-', label: ' - '});
    uniqueGroupLabels.forEach((label) => {
      action.value.push({value: label, label});
    });
    action.value.push({value: 'Custom', label: t('addressBook.custom')});

    const contactGroups = computed(() => {
      return action.value;
    });

    const disableSave = computed(
      () => !(
        verifyAdd.value && contactName.value != ''
      )
    );

    const showAddErr = computed(
      () => !verifyAdd.value && address.value != ''
    );

    const showNameErr = computed(
      () => (address.value != '' && contactName.value == '') || (addressOrPk.value != '' && contactName.value == '')
    );

    const addErr = computed(
      () => {
        let addErrDefault = t('general.invalidInput');
        return addMsg.value?addMsg.value:addErrDefault;
      }
    );

    watch(addressOrPk, ()=>{
      if(!walletState.currentLoggedInWallet){
        return;
      }
      if(addressOrPk.value.length <= 63 || addressOrPk.value.length >=65){
        address.value = addressOrPk.value
        const defaultAccount = walletState.currentLoggedInWallet.accounts.find((account) => account.default == true);
        const verifyContactAddress = AddressBookUtils.verifyNetworkAddress(defaultAccount.address, address.value);
        verifyAdd.value = verifyContactAddress.isPassed;
        addMsg.value = verifyContactAddress.errMessage;
      }
      else if(addressOrPk.value.length == 64){
        verifyAdd.value = true
        address.value = WalletUtils.createAddressFromPublicKey(addressOrPk.value, AppState.networkType).address
      }
    });

    const isDisplayAddCustomPanel = ref(false);
    watch(selectContactGroups, (value) => {
      if(value=='Custom'){
        isDisplayAddCustomPanel.value = true;
      }
    });

    const getPublicKey = async(address) =>{
      try{
        let accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(address))
        publicKey.value = accInfo.publicKey
      }
      catch{
        publicKey.value = null
      }
    }

    const SaveContact = async() => {
      const wallet = walletState.currentLoggedInWallet
      if(!wallet){
        return;
      }
      if (addressOrPk.value.length == 64){
        publicKey.value = addressOrPk.value
      }
      else{
        await getPublicKey(address.value)
      }
      //get index of editing contact
      const contactIndex = walletState.currentLoggedInWallet.contacts.findIndex((contact) => Helper.createAddress(contact.address).pretty() == props.contactAddress);
      //contact list excluding editing contact itself
      let tempContactList = wallet.contacts.filter(tempContact=>tempContact.name.toLowerCase()!=contact.name.toLowerCase().trim()) 
      let findNameInTempContact = tempContactList.find(contact=>contact.name.toLowerCase()==contactName.value.toLowerCase().trim())
      let findNameInAcc = wallet.accounts.find(acc=>acc.name.toLowerCase()==contactName.value.toLowerCase().trim())
      let findAddressInTempContact = tempContactList.find(contact=>Address.createFromRawAddress(contact.address).plain()== Address.createFromRawAddress(address.value).plain())
      if (findNameInTempContact!=undefined || findNameInAcc!=undefined){
        err.value = t('addressBook.nameExist');
      }else if(findAddressInTempContact!=undefined){
        err.value = t('addressBook.addressExist');
      }else{
        walletState.currentLoggedInWallet.updateAddressBook(contactIndex, { name: contactName.value.trim(), address: Address.createFromRawAddress(address.value).plain(), group: selectContactGroups.value, publicKey: publicKey.value });
        walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
        toast.add({severity:'info', summary: t('general.addressBook'), detail: t('addressBook.contactUpdated'), group: 'br-custom', life: 5000});
        router.push({name: "ViewServicesAddressBook"});
      }

      
     
    }

    emitter.on('CLOSE_ADDCUSTOMGROUP_PANEL', () => {
      isDisplayAddCustomPanel.value = false;
    });

    emitter.on('ADD_CUSTOM_GROUP', customGroup => {
      action.value.push({value: customGroup, label: customGroup});
      if(selectGroupDropdown.value){
        selectGroupDropdown.value.select(customGroup);
      }
      isDisplayAddCustomPanel.value = false;
    });

    return {
      err,
      addErr,
      contactName,
      address,
      addressOrPk,
      disableSave,
      showAddErr,
      showNameErr,
      SaveContact,
      selectContactGroups,
      contactGroups,
      isDisplayAddCustomPanel,
      selectGroupDropdown,
    }
  },

}
</script>
