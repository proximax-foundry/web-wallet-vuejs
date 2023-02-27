// import { Helper } from "./typeHelper";

interface NetworkAddress{
  isPassed: boolean,
  errMessage: string
}

export class AddressBookUtils {

  static verifyNetworkAddressEqualsNetwork(currentPrimaryAdd:string, add:string):boolean {
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
    return false
  }

  static verifyNetworkAddress(currentAdd:string, add:string): NetworkAddress {
    const address = (add !== undefined && add !== null && add !== '') ? add.split('-').join('') : '';

    let verification: NetworkAddress = {
      isPassed: false,
      errMessage: ''
    };

    if (address !== null && address !== undefined && address.length === 40) {
      if(this.verifyNetworkAddressEqualsNetwork(currentAdd, add.toUpperCase())){
        verification.isPassed =  true;
      }else{
        verification.isPassed = false;
        verification.errMessage = 'Recipient Address Network unsupported';
      }
    }else{
      verification.isPassed = false;
    }
    return verification;
  }
}