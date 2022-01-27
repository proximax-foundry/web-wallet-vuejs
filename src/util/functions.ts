import { useToast } from "primevue/usetoast";
import { ref } from 'vue';
import { Address } from "tsjs-xpx-chain-sdk";

// copy address keys
export const copyKeyFunc = (id:string, ):void => {
  const toast = useToast();
  // Credits: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
  let copyText = document.getElementById(id) as HTMLInputElement;
  /* Select the text field */
  //copyText.innerText;
  copyText?.select();
  copyText?.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");
  let titleType : string;
  if(id=='private'){
    titleType = 'Private key';
  }else if(id=='public'){
    titleType = 'Public key';
  }else if(id=='pollIndexAddress'){
    titleType = 'Poll Index Address';
  }else{
    titleType = 'Address';
  }

  // toast.add({severity:'info', summary: titleType + ' copied', detail: copyText.value, group: 'br', life: 5000});
};


export const copyToClipboard = (data: string): boolean => {
  /*const listener = (e: ClipboardEvent) => {
    e.clipboardData.setData('text/plain', data);
    e.preventDefault();
    document.removeEventListener('copy', listener);
  };
  document.addEventListener('copy', listener);
  document.execCommand('copy');*/
  let textInput :any;

  try {
    textInput = document.createElement('textarea');
    textInput.setAttribute('readonly', true);
    textInput.setAttribute('contenteditable', true);
    textInput.style.position = 'fixed';
    textInput.value = data;
    document.body.appendChild(textInput);
    textInput.focus();
    textInput.select();

    const range = document.createRange();
    range.selectNodeContents(textInput);

    const textSelection = window.getSelection();
    textSelection.removeAllRanges();
    textSelection.addRange(range);

    textInput.setSelectionRange(0, textInput.value.length);
    document.execCommand('copy');
  } catch (err) {
    console.error(err);
  } finally {
    document.body.removeChild(textInput);
  }
  return true;

}


const getCoingecko = (coinId: string): Promise<number>=> {
  return fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`).then((res) => res.json()).then((data) => { return data.market_data.current_price.usd });
}

export const getCoingeckoCoinPrice = (coinId: string): Promise<any>=> {
  return fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`).then((res) => res.json()).then((data) => { return data.market_data.current_price });
}

export const getCurrentPriceUSD = (url: string): Promise<any>=> {
  return fetch(url).then((res) => res.json()).then((data) => { return data });
}

export const getXPXcurrencyPrice = async (balance: number):Promise<number> => {
  let total:number;
  let coinId = 'proximax';
  let rate = await getCoingecko(coinId);
  total = rate * balance;
  return total;
}




// export const getPrettyAddress = (address: string) => {
//   const prettyAddress = Address.createFromRawAddress(address);
//   return prettyAddress.pretty();
// }