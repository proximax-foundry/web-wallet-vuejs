import { walletState } from "@/state/walletState";
import { readonly, ref } from 'vue'
import {
  Address
} from "tsjs-xpx-chain-sdk";
import {WalletUtils} from '@/util/walletUtils'



const verifyPublicKey = (add: String): boolean => {
  const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
  let address;
  address = Address.createFromRawAddress(add.toLocaleUpperCase());
  let valid = true
  const accountPublicKey = WalletUtils.getAccountPublicKey(address);
  accountPublicKey.then(publicKey => {
    if (publicKey === invalidPublicKey) {
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
/* accountInfo.subscribe(
  (acc) => {
      if (acc.publicKey === invalidPublicKey) {
          console.warn(`The receiver's public key is not valid for sending encrypted messages`);
          resolve(true)
      } 
      resolve(false);
  },
  (error) => {
      console.warn('Err: ' + error);
      resolve(true);
  }
); */
/* const verifyRecipientInfo = (recipient, accountHttp) => {
  return new Promise((resolve, reject) => {
    verifyPublicKey(recipient, accountHttp).then((res) => {
      resolve(res);
    }).catch(function (error) {
      // handle error
      reject("Error is: " + error);
    })
  });
} */

function verifyNetworkAddressEqualsNetwork(currentPrimaryAdd, add) {
  if ((currentPrimaryAdd.length === 40 || currentPrimaryAdd.length === 46) && (add.length === 40 || add.length === 46)) {
    if (currentPrimaryAdd.charAt(0) === 'S' && add.charAt(0) === 'S') {
      // NetworkType.MIJIN_TEST
      return true;
    } else if (currentPrimaryAdd.charAt(0) === 'M' && add.charAt(0) === 'M') {
      // NetworkType.MIJIN
      return true;
    } else if (currentPrimaryAdd.charAt(0) === 'V' && add.charAt(0) === 'V') {
      // NetworkType.TEST_NET
      return true;
    } else if (currentPrimaryAdd.charAt(0) === 'X' && add.charAt(0) === 'X') {
      // NetworkType.MAIN_NET
      return true;
    } else if (currentPrimaryAdd.charAt(0) === 'W' && add.charAt(0) === 'W') {
      // NetworkType.PRIVATE_TEST
      return true;
    } else if (currentPrimaryAdd.charAt(0) === 'Z' && add.charAt(0) === 'Z') {
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