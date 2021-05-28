import { ref } from 'vue';
import { environment } from '../environment/environment.js';

// copy address keys
export const copyKeyFunc = (id, toast) => {
  // Credits: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
  var copyText = document.getElementById(id);
  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");
  let titleType;
  if(id=='private'){
    titleType = 'Private key';
  }else if(id=='public'){
    titleType = 'Public key';
  }else{
    titleType = 'Address';
  }
  toast.add({severity:'info', summary: titleType + ' copied', detail: copyText.value, group: 'br', life: 5000});
};


// verify address

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

export const verifyAddress = (currentAdd, add) => {
  const address = (add !== undefined && add !== null && add !== '') ? add.split('-').join('') : '';
  const isPassed = ref(false);
  const errMessage = ref('');
  if (address !== null && address !== undefined && address.length === 40) {
    if(verifyNetworkAddressEqualsNetwork(currentAdd, add.toUpperCase())){
      isPassed.value =  true;
    }else{
      isPassed.value = false;
      errMessage.value = 'Recipient Address Network unsupported';
    }
  }else{
    isPassed.value = false;
  }
  return {
    isPassed, errMessage
  }
}


const getCoingecko = (coinId) => {
  return fetch(`${environment.coingecko.url}${coinId}`).then((res) => res.json()).then((data) => { return data.market_data.current_price.usd });
}

export const currencyconverter = async (balance) => {
  let total;
  let coinId = 'proximax';
  let rate = await getCoingecko(coinId);
  total = rate * balance;
  return total;
}

