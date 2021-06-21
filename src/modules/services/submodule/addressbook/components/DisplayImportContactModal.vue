<template>
  <div>
    <a @click="toggleModal = !toggleModal" class="font-bold" active-class="accounts">Import Contact</a>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal; closeModel()"></font-awesome-icon>
          </div>
          <div class="w-104">
            <h1 class="default-title font-bold my-10">Import address</h1>
              <div class="bg-blue-200 text-left text-sm p-2 rounded-lg text-gray-800 mb-2" v-if="contactAdded > 0">{{ contactAdded }} contact{{ (contactAdded>1)?'s':'' }} imported to address book</div>
              <div class="bg-yellow-200 text-left text-sm p-2 rounded-lg text-gray-800 mb-2" v-if="contactExisted > 0">{{ contactExisted }} contact{{ (contactExisted>1)?'s':'' }} already exist in address book</div>
              <div class="bg-red-200 text-left text-sm p-2 rounded-lg text-gray-800 mb-2" v-if="contactInvalidAddress.length > 0">{{ contactInvalidAddress.length }} contact{{ (contactInvalidAddress.length > 1)?'s':'' }} with invalid address</div>
              <div v-if="contactInvalidAddress.length > 0" class="text-left text-gray-800 mt-5">
                <div class="font-bold mb-2">Contact{{ (contactInvalidAddress.length > 1)?'s':'' }} not imported:</div>
                <div v-for="contact, index in contactInvalidAddress" :key="index" class="text-left mb-2">
                  <div class="inline-block mr-3 w-40">{{contact.label}}</div>
                  <div class="inline-block">{{contact.address}}</div>
                </div>
              </div>
              <div class="px-10 py-5 my-5">
                <form enctype="multipart/form-data">
                  <input type="file" @change="onFileChange">
                </form>
              </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal; closeModel()" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary z-30"></div>
  </div>
</template>

<script>
import { inject, getCurrentInstance, ref } from "vue";
import { verifyAddress } from '@/util/functions';
import { useToast } from "primevue/usetoast";
export default{
  name: 'DisplayImportContactModal',
  props: [

  ],
  components: {
  },
  data() {
    return {
      toggleModal: false,
    };
  },

  setup(){
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    // const appStore = inject("appStore");
    const csv = ref([]);
    const contactAdded = ref(0);
    const contactExisted = ref(0);
    const contactInvalidAddress = ref([]);
    const onFileChange = (e) => {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      createInput(files[0]);
    };

    const closeModel = () => {
      contactAdded.value = 0;
      contactExisted.value = 0;
      contactInvalidAddress.value = [];
    };

    const createInput = (file) => {
      let promise = new Promise((resolve) => {
        var reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsText(file);
      });

      promise.then(
        result => {
          // const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
          /* handle a successful result */
          var array = result.match(/[^\r\n]+/g);
          let exist = [];
          let addContact = [];
          let errContact = [];
          array.shift();
          array.forEach(element => {
            var label, address;
            var arr = element.split(',');
            if(arr.length > 2){
              // merge all array as label except the last
              let str = '';
              for(var a = 0; a < arr.length -1 ; ++a){
                str = str + arr[a] + ',';
              }
              label = str;
            }else{
              label = arr[0];
            }
            address = arr[1];

            // check if address or name is already in the contact book
            // check for existing account address in wallet
            const accountAddIndex = wallet.accounts.findIndex((element) => element.address == arr[1]);
            // check for existing account name in wallet
            const accountNameIndex = wallet.accounts.findIndex((element) => element.name.toLowerCase() == arr[0].toLowerCase());
            const contactAddIndex = (wallet.contacts!=undefined)?wallet.contacts.findIndex((element) => element.address == arr[1]):(-1);
            const contactNameIndex =(wallet.contacts!=undefined)?wallet.contacts.findIndex((element) => element.name.toLowerCase() == arr[0].toLowerCase()):(-1);

            if(contactAddIndex >= 0 || accountAddIndex >= 0){
              exist.push({label: label, address: address });
            }else if( contactNameIndex >= 0 || accountNameIndex >= 0 ){
              // const verifyContactAddress = verifyAddress(appStore.getCurrentAdd(appStore.state.currentLoggedInWallet.name), address);
              if(verifyContactAddress.isPassed.value){
                addContact.push({label: label + ' - 2', address: address });
              }else{
                errContact.push({label: label, address: address });
              }
            }else{
              // const verifyContactAddress = verifyAddress(appStore.getCurrentAdd(appStore.state.currentLoggedInWallet.name), address);
              if(verifyContactAddress.isPassed.value){
                addContact.push({label: label, address: address });
              }else{
                errContact.push({label: label, address: address });
              }
            }
          });
          if(exist.length > 0){
            // display error
            contactExisted.value = exist.length;
          }
          if(addContact.length > 0){
            addContact.forEach((element) => {
              wallet.contacts.push({
                name: element.label,
                address: element.address,
              });
            });
            appStore.updateWalletConfig(wallet);
            contactAdded.value = addContact.length;
            emitter.emit('REFRESH_CONTACT_LIST', true);
            toast.add({severity:'info', summary: 'Address Book', detail: 'New contact' + ((contactAdded.value>1)?'s':'') + ' imported to Address Book', group: 'br', life: 5000});
          }
          contactInvalidAddress.value = errContact;
        },
        error => {
          /* handle an error */
          console.log(error);
        }
      );
    };
    return{
      csv,
      contactAdded,
      contactExisted,
      contactInvalidAddress,
      onFileChange,
      closeModel,
    };
  },
}
</script>
