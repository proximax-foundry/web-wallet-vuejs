import { useToast } from "primevue/usetoast";
import { ref } from 'vue';
import { environment } from '../environment/environment.js';


// copy address keys
export const copyKeyFunc = (id:string):void => {
  const toast = useToast();
  // Credits: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
  let copyText = document.getElementById(id) as HTMLInputElement;
  /* Select the text field */
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



const getCoingecko = (coinId)=> {
  return fetch(`${environment.coingecko.url}${coinId}`).then((res) => res.json()).then((data) => { return data.market_data.current_price.usd });
}

export const currencyconverter = async (balance: number):Promise<number> => {
  let total:number;
  let coinId = 'proximax';
  let rate = await getCoingecko(coinId);
  total = rate * balance;
  return total;
}

