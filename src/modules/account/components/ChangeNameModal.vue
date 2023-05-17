<template>
   <img src="@/modules/account/img/edit-icon.svg"  class="w-4 h-4 text-black cursor-pointer mt-1 ml-1" @click=" toggleModal = !toggleModal" >
      <div v-if="toggleModal" class="popup-outer-lang fixed flex z-50">
        <div class="modal-popup-box "> 
            <div v-if="!isOther">
                <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
                <div class= 'text-center mt-2 text-xs font-semibold'>Change Name</div>
                <TextInput class="mt-3" :placeholder="$t('account.namePlaceholder')" :errorMessage="$t('account.enterAccountName')" v-model="accountName" icon="wallet" />
                <div class="flex justify-center mt-3">
                    <button @click="changeName()"  class = ' blue-btn font-semibold py-2 cursor-pointer text-center w-7/12 disabled:opacity-50 disabled:cursor-auto' :disabled="disabledConfirm">{{$t('general.confirm')}}</button>
                </div>
            </div>
            <div v-else-if="isOther && !isEdit">
                <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
                <div class= 'text-center mt-2 text-xs font-semibold'>Add to Address Book</div>
                <TextInputClean :placeholder="$t('general.name')" :errorMessage="$t('general.nameRequired')" v-model="contactName" icon="id-card-alt" class="w-full md:w-96 inline-block mt-3  mr-2" />
                <TextInputClean :placeholder="$t('general.address')" v-model="addressCopy" :disabled="true" icon="wallet" class="w-full md:w-96 inline-block mr-2" />
                <div class="flex justify-center">
                    <button @click="saveContact()"  class = ' blue-btn font-semibold py-2 cursor-pointer text-center w-7/12 disabled:opacity-50 disabled:cursor-auto' :disabled="disabledAdd">{{$t('general.add')}}</button>
                </div>
            </div>
            <div v-else>
                <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
                <div class= 'text-center mt-2 text-xs font-semibold'>Edit Address Book</div>
                <TextInputClean :placeholder="$t('general.name')" :errorMessage="$t('general.nameRequired')" v-model="contactName" icon="id-card-alt"  class="w-full md:w-96 inline-block mt-3  mr-2" />
                <TextInputClean :placeholder="$t('general.address')"  v-model="addressCopy" :disabled="true" icon="wallet" class="w-full md:w-96 inline-block mr-2" />
                <div class="flex justify-center">
                    <button @click="editContact()"  class = ' blue-btn font-semibold py-2 cursor-pointer text-center w-7/12 disabled:opacity-50 disabled:cursor-auto' :disabled="disabledAdd">{{$t('general.add')}}</button>
                </div>
            </div>
            <div class= 'text-center cursor-pointer text-xs font-semibold text-blue-link mt-2' @click="toggleModal = !toggleModal;err=''">{{$t('general.cancel')}}</div>
        </div>
      </div>
    <div @click="toggleModal = !toggleModal;err = '';" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
</template>

<script setup lang='ts'>
import { walletState } from "@/state/walletState";
import { computed, defineComponent, ref } from "vue"
import { useI18n } from "vue-i18n";
import PasswordInput from '@/components/PasswordInput.vue';
import TextInput from '@/components/TextInput.vue'
import TextInputClean from '@/components/TextInputClean.vue';
import { Address } from "tsjs-xpx-chain-sdk";
import { AddressBook } from "@/models/addressBook";
import { AppState } from "@/state/appState";

const props = defineProps({
    isOther: Boolean,
    address: String
})
const addressCopy = ref(props.address)
const {t} = useI18n() 
const disabledConfirm = computed(()=>{ 
    if(accountName.value.trim()!=""  ){
        return false
    }else{
        return true
    }
})
const disabledAdd = computed(()=>{
    if(contactName.value.trim()==""){
        return true
    }else{
        return false
    }
})
const toggleModal = ref(false)
const contactName = ref('')
const accountName = ref('')
const err = ref('')
const changeName = () => {
    if (accountName.value.trim()) {
    const exist_account = walletState.currentLoggedInWallet.accounts.find((accName) => accName.name == accountName.value.trim());
    const exist_other_account = walletState.currentLoggedInWallet.others.find((accName) => accName.name == accountName.value.trim());

    if (!exist_account && !exist_other_account) {
        const acc_index = walletState.currentLoggedInWallet.accounts.findIndex((accAdd) => accAdd.address === props.address);
        if(acc_index == -1){
        const other_acc_index = walletState.currentLoggedInWallet.others.findIndex((accAdd) => accAdd.address === props.address);
        walletState.currentLoggedInWallet.others[other_acc_index].name = accountName.value;
        }
        else{
        walletState.currentLoggedInWallet.accounts[acc_index].name = accountName.value;
        }
        walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
        err.value=""
        accountName.value = ""
        toggleModal.value = false
    } else if (exist_account || exist_other_account) {
        err.value = t('account.nameTaken');
    } else {
        err.value = t('account.failChangeName');
    }
    } else {
    err.value = t('account.nameEmpty');
    }
};
const isEdit = ref(false)
if(props.isOther){
    let findContact = walletState.currentLoggedInWallet.contacts.find(contact=>contact.address==props.address)
    if(findContact){
        isEdit.value = true
    }
}
const saveContact = () => {
    if (contactName.value == ' ') {
        err.value = t('general.nameRequired');
        return 
    }
    const rawAddress = Address.createFromRawAddress(props.address); 
    // let addressBook = new AddressBook(contactName.value, rawAddress.address);
    let addressBook = new AddressBook(contactName.value.trim(), rawAddress.plain(),'-none-')
    const wallet = walletState.currentLoggedInWallet;

    // check for existing account name in wallet
    const accountNameIndex = wallet.accounts.findIndex((account) => account.name.toLowerCase()== contactName.value.toLowerCase().trim());
    const contactAddIndex = (wallet.contacts!=undefined)?wallet.contacts.findIndex((contact) => Address.createFromRawAddress(contact.address).plain() == rawAddress.plain()):(-1);
    const contactNameIndex = (wallet.contacts!=undefined)?wallet.contacts.findIndex((contact) => contact.name.toLowerCase() == contactName.value.toLowerCase().trim()):(-1);

    if(contactAddIndex >= 0){
    err.value = t('addressBook.addressExist');
    }else if( contactNameIndex >= 0 || accountNameIndex >= 0 ){
    err.value = t('addressBook.nameExist');
    }else{
    walletState.currentLoggedInWallet.addAddressBook(addressBook);
    walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
    err.value = '';
    contactName.value = ''
    toggleModal.value = false
    }
}
const publicKey = ref('');
const getPublicKey = async(address) =>{
      try{
        let accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(address))
        if(accInfo.publicKey == "0000000000000000000000000000000000000000000000000000000000000000"){
          publicKey.value = null
        }
        else{
          publicKey.value = accInfo.publicKey
        }
      }
      catch{
        publicKey.value = null
      }
    }
getPublicKey(props.address)
const editContact = ()=>{
    const wallet = walletState.currentLoggedInWallet
    if(!wallet){
        return;
    }
    //get index of editing contact
    const contact = walletState.currentLoggedInWallet.contacts.find(contact=>contact.address ==props.address)
    const contactIndex = walletState.currentLoggedInWallet.contacts.findIndex((contact) => contact.address == props.address);
    //contact list excluding editing contact itself
    let tempContactList = wallet.contacts.filter(tempContact=>tempContact.name.toLowerCase()!=contact.name.toLowerCase().trim()) 
    let findNameInTempContact = tempContactList.find(contact=>contact.name.toLowerCase()==contactName.value.toLowerCase().trim())
    let findNameInAcc = wallet.accounts.find(acc=>acc.name.toLowerCase()==contactName.value.toLowerCase().trim())
    let findAddressInTempContact = tempContactList.find(contact=>Address.createFromRawAddress(contact.address).plain()== Address.createFromRawAddress(props.address).plain())
    if (findNameInTempContact!=undefined || findNameInAcc!=undefined){
        err.value = t('addressBook.nameExist');
    }else if(findAddressInTempContact!=undefined){
        err.value = t('addressBook.addressExist');
    }else{
        walletState.currentLoggedInWallet.updateAddressBook(contactIndex, { name: contactName.value.trim(), address: Address.createFromRawAddress(props.address).plain(), group:'-none-', publicKey: publicKey.value});
        walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
        err.value = '';
        contactName.value = ''
        toggleModal.value = false
    }
}
</script>
