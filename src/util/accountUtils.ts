import { walletState } from "@/state/walletState";
import { readonly, ref } from 'vue'
import {
  Address
} from "tsjs-xpx-chain-sdk";
import {WalletUtils} from '@/util/walletUtils'


const verifyPublicKey = async(add: string):Promise<boolean> => {
  const invalidPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
   let verify = new Promise<boolean>((resolve,reject)=>{ 
    const accountPublicKey = WalletUtils.getAccInfo(add);
    accountPublicKey.then(accountinfo => {
      if (accountinfo.publicKey === invalidPublicKey) {
        console.warn(`The receiver's public key is not valid for sending encrypted messages`);
        resolve(true)
      }
      else
        resolve(false)
    })
      .catch(error => {
        reject('Err: ' + error)
      })
      
  })
    let result = await verify
    return Boolean(result)
  

}


const verifyAddress = (currentAdd :string, add :string) => {
  const address = (add !== undefined && add !== null && add !== '') ? add.split('-').join('') : '';
  const isPassed = ref(false);
  const errMessage = ref('');
  if (address !== null && address !== undefined && address.length === 40) {
    if (WalletUtils.verifyNetworkAddressEqualsNetwork(currentAdd, add.toUpperCase())) {
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

const checkAvailableContact = (recipient :string) :boolean=> {
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