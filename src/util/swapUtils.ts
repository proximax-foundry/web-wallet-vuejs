import jsPDF from 'jspdf';
import qrcode from 'qrcode-generator';
import { Account, Address, AggregateTransaction, SignedTransaction } from "tsjs-xpx-chain-sdk";
import { pdfImg } from '@/modules/services/submodule/mainnetSwap/pdfBackground';
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletUtils } from "@/util/walletUtils";
import { ChainUtils } from "@/util/chainUtils";
import { ChainAPICall } from "@/models/REST/chainAPICall";
import { AppState } from '@/state/appState';

export const abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol',
        type: 'string',
      },
      {
        internalType: 'uint8',
        name: 'decimals',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'cap',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PAUSER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cap',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getRoleMember',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleMemberCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];


export class SwapUtils {
  static generateQRCode = (url: string) :string => {
    const qr = qrcode(0, 'H');
    qr.addData(url);
    qr.make();
    return qr.createDataURL();
  }

  static generateIncomingPdfCert = (networkName: string, swapTimestamp: string, siriusAddress: string, swapToken: string, transactionHash: string, qrImage: string) => {
    const imgData = pdfImg;
    let doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'b1'
    })

    doc.addImage(imgData, 'JPEG', 1, 1, 1000, 707, '', 'NONE')
    doc.setFontSize(50)

    let leftCol = 45, secCol = 280, dateCol = 380;
    let dateRow = 255, addressRow = 315, swapIDRow = 385,
    hashRow = 455, qrRpw = 515;//, signatureRow = 425, hashValueRow = 485

    doc.text(swapTimestamp, dateCol, dateRow)

    doc.text('Sirius Address:', leftCol, addressRow);
    doc.text(siriusAddress, secCol, addressRow );

    doc.text('Swap Token:', leftCol, swapIDRow);
    doc.text(swapToken, secCol, swapIDRow);

    doc.text( networkName + ' Transaction Hash:', leftCol, hashRow);
    doc.text(transactionHash, secCol, hashRow);

    let img = new Image();
    img.src = qrImage;
    doc.addImage(img, 'png', leftCol, qrRpw, 120, 120)

    doc.setProperties({ title: 'Swap Certificate'});
    doc.save('swap_certificate.pdf');
  }

  static generateoutgoingPdfCert = (networkName: string, swapTimestamp: string, siriusAddress: string, swapId: string, transactionHash: string, qrImage: string, siriusTxHash: string) => {
    const imgData = pdfImg;
    let doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'b1'
    })

    doc.addImage(imgData, 'JPEG', 1, 1, 1000, 707, '', 'NONE')
    doc.setFontSize(50)

    let leftCol = 45, secCol = 280, dateCol = 380;
    let dateRow = 255, addressRow = 295, siriusHashRow = 365, swapIDRow = 435,
    hashRow = 505, qrRpw = 565;//, signatureRow = 425, hashValueRow = 485

    doc.text(swapTimestamp, dateCol, dateRow)

    doc.text('Sirius Address:', leftCol, addressRow);
    doc.text(siriusAddress, secCol, addressRow );

    doc.text('Sirius Transaction Hash:', leftCol, siriusHashRow);
    doc.text(siriusTxHash, secCol, siriusHashRow );

    doc.text('SwapID:', leftCol, swapIDRow);
    doc.text(swapId, secCol, swapIDRow);

    doc.text( networkName + ' Transaction Hash:', leftCol, hashRow);
    doc.text(transactionHash, secCol, hashRow);

    let img = new Image();
    img.src = qrImage;
    doc.addImage(img, 'png', leftCol, qrRpw, 120, 120)

    doc.setProperties({ title: 'Swap Certificate'});
    doc.save('swap_certificate.pdf');
  }

  static signTransaction(selectedAddress: string, walletPassword: string, aggreateCompleteTransaction: AggregateTransaction) :SignedTransaction {
    const accAddress = Address.createFromRawAddress(selectedAddress);
    const accountDetails = walletState.currentLoggedInWallet.accounts.find((account) => account.address == accAddress.plain());
    const encryptedPassword = WalletUtils.createPassword(walletPassword);
    let privateKey = WalletUtils.decryptPrivateKey(encryptedPassword, accountDetails.encrypted, accountDetails.iv);
    const account = Account.createFromPrivateKey(privateKey, AppState.networkType, accountDetails.version);
    let signedTx = account.sign(aggreateCompleteTransaction, networkState.currentNetworkProfile.generationHash);
    return signedTx;
  }

  static getETH_GasLimit = async (baseUrl: string):Promise<any> => {
    return fetch(`${baseUrl}/gaslimit/eth`).then(res => res.json());
  }

  static getBSC_GasLimit = async (baseUrl: string):Promise<any> => {
    return fetch(`${baseUrl}/gaslimit/bsc`).then(res => res.json());
  }

  static getETH_SafeGwei = async (baseUrl: string):Promise<any> => {
    return fetch(`${baseUrl}/gasprice/eth`).then(res => res.json());
  }

  static getBSC_SafeGwei = async (baseUrl: string):Promise<any> => {
    return fetch(`${baseUrl}/gasprice/bsc`).then(res => res.json());
  }

  static getOutgoing_SwapTransfer_URL = (baseUrl: string,tokenName?: string): string => {
    if(tokenName){
      return `${baseUrl}/transfer/${tokenName}`;
    }else{
      return `${baseUrl}/transfer`
    }
  }

  static getSwapTokenList = (baseUrl: string): Promise<any> =>{
    return fetch(`${baseUrl}/swapTokenList`).then(res => res.json());
  }

  static checkTokenBalance = (url: string,tokenName: string): Promise<any>=> {
    return fetch(`${url}/checkTokenBalance/${tokenName}`).then((res) => res.json()).then((data) => { return data });
  }

  static getOutgoing_SwapCheckByTxID_URL = (baseUrl: string, txID: string): string => {
    return `${baseUrl}/swapByTx/${txID}`;
  }

  static getOutgoing_SwapCheckByID_URL = (baseUrl: string, swapId: string): string => {
    return `${baseUrl}/swap/${swapId}`;
  }

  static getOutgoing_ETHCheckStatus_URL(baseUrl: string){
    return `${baseUrl}/eth/swapByTx/`;
  }

  static getOutgoing_BSCCheckStatus_URL(baseUrl: string){
    return `${baseUrl}/bsc/swapByTx/`;
  }

  static getOutgoingSwapServiceInfo = (url: string): Promise<any>=> {
    return fetch(url).then((res) => res.json()).then((data) => { return data });
  }

  // outgoing swap server service info
  static getServiceInfoURL(baseUrl: string){
    return `${baseUrl}/service-info`;
  }

  static getIncoming_ETHSwapTransfer_URL = (baseUrl: string,tokenName: string): string => {
    return `${baseUrl}/${tokenName}/transfer`;
  }

  static getIncoming_BSCSwapTransfer_URL = (baseUrl: string,tokenName: string): string => {
    return `${baseUrl}/${tokenName}/transfer`;
  }

  static getIncoming_OldETHSwapTransfer_URL = (baseUrl: string,tokenName: string): string => {
    return `${baseUrl}/expx/${tokenName}/transfer`;
  }

  static getIncoming_OldBSCSwapTransfer_URL = (baseUrl: string,tokenName: string): string => {
    return `${baseUrl}/bxpx/${tokenName}/transfer`;
  }

  static getIncoming_SwapTransfer_URL = (baseUrl: string): string => {
    return `${baseUrl}/transfer`;
  }

  static checkSwapService = (baseUrl: string): string => {
    return `${baseUrl}/checkBalanceOk`;
  }

  static checkSwapPrice = (baseUrl: string): string => {
    return `${baseUrl}/price/latest`;
  }

  static getIncoming_ETHCheckStatus_URL(baseUrl: string){
    return `${baseUrl}/swap-status`;
  }

  static getIncoming_BSCCheckStatus_URL(baseUrl: string, network: string, txnHash: string){
    return `${baseUrl}/swap/${network}/${txnHash}`;
  }

  static getIncoming_OldETHCheckStatus_URL(baseUrl: string, tokenName: string){
    return `${baseUrl}/expx/${tokenName}/swap-status`;
  }

  static getIncoming_OldBSCCheckStatus_URL(baseUrl: string, tokenName: string){
    return `${baseUrl}/bxpx/${tokenName}/swap-status`;
  }

  static fetchOldETHServiceInfo = async (baseUrl: string,tokenName: string) :Promise<paramResponse> => {
    const response = await fetch(`${baseUrl}/expx/${tokenName}/service-info`);
    let data = '';
    if(response.status == 200){
      data = await response.json();
    }
    let returnResponse:paramResponse = {
      status: response.status,
      data: data
    }
    return returnResponse;
  }

  static fetchOldBSCServiceInfo = async (baseUrl: string,tokenName: string) :Promise<paramResponse> => {
    const response = await fetch(`${baseUrl}/bxpx/${tokenName}/service-info`);
    let data = '';
    if(response.status == 200){
      data = await response.json();
    }
    let returnResponse:paramResponse = {
      status: response.status,
      data: data
    }
    return returnResponse;
  }

  static fetchAllSwapServiceInfo = async (baseUrl: string) :Promise<paramResponse> => {
    const response = await fetch(`${baseUrl}/service-info`);
    let data = '';
    if(response.status == 200){
      data = await response.json();
    }
    let returnResponse:paramResponse = {
      status: response.status,
      data: data
    }
    return returnResponse;
  }

  static fetchTokenServiceInfo = async (baseUrl: string,tokenName: string) :Promise<paramResponse> => {
    const response = await fetch(`${baseUrl}/${tokenName}/service-info`);
    let data = '';
    if(response.status == 200){
      data = await response.json();
    }
    let returnResponse:paramResponse = {
      status: response.status,
      data: data
    }
    return returnResponse;
  }
}

interface paramResponse {
  status: number,
  data: any
}