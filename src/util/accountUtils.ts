import { walletState } from "@/state/walletState";
import { readonly, ref } from 'vue'
import {
  Address
} from "tsjs-xpx-chain-sdk";
import {WalletUtils} from '@/util/walletUtils'



const verifyPublicKey = (add: string): boolean => {
  const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
 /*  let address;
  address = Address.createFromRawAddress(add.toLocaleUpperCase()); */
  let valid = true
  const accountPublicKey = WalletUtils.getAccInfo(add);
  accountPublicKey.then(accountinfo => {
    if (accountinfo.publicKey === invalidPublicKey) {
      console.warn(`The receiver's public key is not valid for sending encrypted messages`);
      valid = true
    }
    else
      valid = false
  })
    .catch(error => {
      console.warn('Err: ' + error)
    })
    return valid

}


const verifyNetworkAddressEqualsNetwork = (value: string, value2: string): boolean => {
  if (value!== undefined )
  if(value2!==undefined)
  if ((value.length === 40 || value.length === 46) && (value2.length === 40 || value2.length === 46)) {
      if (value.charAt(0) === 'S' && value2.charAt(0) === 'S') {
          // NetworkType.MIJIN_TEST
          return true;
      } else if (value.charAt(0) === 'M' && value2.charAt(0) === 'M') {
          // NetworkType.MIJIN
          return true;
      } else if (value.charAt(0) === 'V' && value2.charAt(0) === 'V') {
          // NetworkType.TEST_NET
          return true;
      } else if (value.charAt(0) === 'X' && value2.charAt(0) === 'X') {
          // NetworkType.MAIN_NET
          return true;
      } else if (value.charAt(0) === 'W' && value2.charAt(0) === 'W') {
          // NetworkType.PRIVATE_TEST
          return true;
      } else if (value.charAt(0) === 'Z' && value2.charAt(0) === 'Z') {
          // NetworkType.PRIVATE
          return true;
      } else {
          // Address Network unsupported
          return false;
      }
  }
}

const verifyAddress = (currentAdd, add) => {
  const address = (add !== undefined && add !== null && add !== '') ? add.split('-').join('') : '';
  const isPassed = ref(false);
  const errMessage = ref('');
  if (address !== null && address !== undefined && address.length === 40) {
    if (verifyNetworkAddressEqualsNetwork(currentAdd, add.toUpperCase())) {
      isPassed.value = true;
    } else {
      isPassed.value = false;
      errMessage.value = 'Recipient Address Network unsupported';
    }
  } else {
    isPassed.value = false;
  }
  return {
    isPassed, errMessage
  }
}

const checkAvailableContact = (recipient) => {
  const wallet = walletState.currentLoggedInWallet;
  let isInContacts = true;
  if (wallet.contacts != undefined) {
    isInContacts = (wallet.contacts.findIndex((element) => element.address == recipient) == -1);
  }
  return (isInContacts && (wallet.accounts.findIndex((element) => element.address == recipient) == -1)) ? false : true;
}

export const accountUtils = readonly({
  checkAvailableContact,
  verifyAddress,
  verifyPublicKey
});