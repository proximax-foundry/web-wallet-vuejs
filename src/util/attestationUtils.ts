import * as CryptoJS from 'crypto-js'
import { PublicAccount, KeyPair, Convert, Password, PlainMessage, FeeCalculationStrategy, NetworkType, TransactionHttp, Mosaic, MosaicId, UInt64, NamespaceId, TransactionInfo, BlockInfo, TransferTransaction, Transaction } from 'tsjs-xpx-chain-sdk';
import { SignedTransaction, Address, Account } from 'tsjs-xpx-chain-sdk';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import { privateImg,publicImg } from '@/modules/services/submodule/attestation/pdfBackground';
import { walletState } from '@/state/walletState';
import { WalletUtils } from './walletUtils';
import { ChainProfile } from '@/models/stores';
import { networkState } from '@/state/networkState';
import { BuildTransactions } from './buildTransactions';
import { ChainUtils } from './chainUtils';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { saveAs } from 'file-saver'
import qrcode from 'qrcode-generator';
import { listenerState } from '@/state/listenerState';
import { BlockAPI } from '@/models/REST/block';
import { transactionTypeName, TransactionUtils } from './transactionUtils';
import { dashboardUtils } from './dashboardUtils';
import { Helper } from '@/util/typeHelper';
import moment from 'moment'
export class Verifier {
    static Hash: any;

    public static verifyPublicApostille(data: string, payload: string): boolean {
        if (this.isApostille(payload)) {
            if (this.isPublicApostille(payload)) {
                const fileHash = Verifier.retrieveHash(payload, data);
                this.Hash = fileHash
                return fileHash === payload.substring(10);
            }
            console.log('NOT_PUBLIC_APOSTILLE')
        }
        console.log('NOT_APOSTILLE')

    }
    public static verifyPrivateApostille(signer: PublicAccount, data: string, payload: string): boolean {
        if (this.isApostille(payload)) {
            if (this.isPrivateApostille(payload)) {
                const contentHash = Verifier.retrieveHash(payload, data);
                this.Hash = contentHash;
                const fileHash = this.hexStringToByte(contentHash.toString());
                const contentHashSig = Convert.hexToUint8(payload.substring(10));
                const publicKey = Convert.hexToUint8(signer.publicKey);
                return KeyPair.verify(publicKey, fileHash, contentHashSig);
            }
            console.log('NOT_PRIVATE_APOSTILLE')
        }
        console.log('NOT_APOSTILLE')
    }
    public static hexStringToByte(str) {
        if (!str) {
            return new Uint8Array();
        }
        let a = [];
        for (let i = 0, len = str.length; i < len; i += 2) {
            a.push(parseInt(str.substr(i, 2), 16));
        }

        return new Uint8Array(a);
    }

    public static isApostille(payload: string): boolean {
        return (payload.substring(0, 8) === 'fe4e5459');
    }

    public static isPublicApostille(payload: string): boolean {
        const hashingByte = payload.substring(8, 10);
        return (hashingByte === '01' || hashingByte === '02' || hashingByte === '03' ||
            hashingByte === '08' || hashingByte === '09');
    }
    public static isPrivateApostille(payload: string): boolean {
        const hashingByte = payload.substring(8, 10);
        return (hashingByte === '81' || hashingByte === '82' || hashingByte === '83' ||
            hashingByte === '88' || hashingByte === '89');
    }

    private static retrieveHash(apostilleHash, data) {
        // Get checksum
        const checksum = apostilleHash.substring(0, 10);
        // Get the version byte
        const hashingVersionBytes = checksum.substring(8);
        // Hash depending of version byte
        if (hashingVersionBytes === '01' || hashingVersionBytes === '81') {
            // console.log("MD5")
            return CryptoJS.MD5(data).toString(CryptoJS.enc.Hex);
        } else if (hashingVersionBytes === '02' || hashingVersionBytes === '82') {
            // console.log("SHA1")
            return CryptoJS.SHA1(data).toString(CryptoJS.enc.Hex);
        } else if (hashingVersionBytes === '03' || hashingVersionBytes === '83') {
            // console.log("SHA256")
            return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
        } else if (hashingVersionBytes === '08' || hashingVersionBytes === '88') {
            // console.log("SHA3")
            return CryptoJS.SHA3(data, { outputLength: 256 }).toString(CryptoJS.enc.Hex);
        } else {
            // console.log("SHA3")
            return CryptoJS.SHA3(data, { outputLength: 512 }).toString(CryptoJS.enc.Hex);
        }
    }

}


export const pdfcertificatePublic = (base64ImageString: string, ntyData: NtyDataInterface) => {
    let date = new Date();
    const doc = new jsPDF();
    doc.addImage(publicImg, 'JPEG', 0, 0, 210, 298);
    doc.addImage(base64ImageString, 'gif', 52, 244, 51, 50);
    doc.setTextColor(0, 0, 0);
    doc.text((`${ntyData.fileName}${ntyData.extensionFile}`),55, 89 );
    doc.text(date.toUTCString(),55, 99 );
    doc.setFontSize(13);
    doc.text( ntyData.owner.pretty(),55, 109);
    doc.text( ntyData.tags,55, 120)
    doc.setFontSize(12);
    doc.text(ntyData.owner.plain(),20, 155 );
    doc.text(ntyData.dedicatedAccount, 20, 174, );
    doc.setFontSize(10.9);
    doc.text(ntyData.txHash,20, 195 );
    doc.setFontSize(7);
    if (ntyData.fileHash.length > 74) {
      doc.text(ntyData.fileHash.slice(0, 74),20, 214 );
      doc.text( ntyData.fileHash.slice(74), 20, 217,);
    } else {
      doc.text(ntyData.fileHash,20, 214);
    }
    return doc.output('blob');
  }
export const pdfcertificatePrivate = (base64ImageString: string, ntyData: NtyDataInterface) => {
    // console.log('ntyData-----> ', ntyData);

    let date = new Date();
    let doc = new jsPDF();
    doc.addImage(privateImg, 'JPEG', 0, 0, 210, 298);
    doc.addImage(base64ImageString, 'gif', 52, 244, 51, 50);
    doc.setTextColor(0, 0, 0);
    doc.text((`${ntyData.fileName}${ntyData.extensionFile}`),55, 89);

    doc.text(date.toUTCString(),55, 99 );
    doc.setFontSize(13);
    doc.text( ntyData.owner.plain(),55, 109);
    doc.text(ntyData.tags,55, 120 );
    doc.setFontSize(12);

    doc.text(ntyData.owner.plain(),20, 155);
    doc.text(ntyData.dedicatedAccount,20, 174 );
    doc.setFontSize(10.9);
    doc.text(ntyData.dedicatedPrivateKey,20, 195 );
    doc.text(ntyData.txHash,20, 214 );
    doc.setFontSize(7);
    if (ntyData.fileHash.length > 74) {
        doc.text( ntyData.fileHash.slice(0, 74),20, 233);
        doc.text(ntyData.fileHash.slice(74),20, 236 );
    } else {
        doc.text( ntyData.fileHash,20, 233);
    }
    return doc.output('blob');
}
export const encryptData= (data: string) =>{
    const a: any = "3";
    switch (a) {
      case "1":
        return CryptoJS.MD5(data);
      case "2":
        return CryptoJS.SHA1(data);
      case "3":
        return CryptoJS.SHA256(data);
      case "4":
        return CryptoJS.SHA3(data);
      case "5":
        return CryptoJS.SHA512(data);
    }
  }

const getFileExtension = (filename: string) => {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename): undefined;
  }
export const buildApostille = (ntyData: NtyDataInterface, rawFileContent: string) => {
    const zip = new JSZip();
    const date = new Date();
    const url = `http://bctestnetexplorer.xpxsirius.io/#/result/hash/${ntyData.txHash}`;
    const title = ntyData.fileName;
    const qr = qrcode(10, 'H');
    qr.addData(url);
    qr.make();
    console.log(ntyData.extensionFile)
    if (ntyData.extensionFile == '.undefined'){
      ntyData.extensionFile = ''
    }
    // Add Certificate PDF to zip
    const dateFull = `${date.getFullYear()}-${("00" + (date.getMonth() + 1)).slice(-2)}-${("00" + (date.getDate())).slice(-2)}`;
    //const nameCertificate = `Certificate of ${title} --Apostille TX ${ntyData.txHash} --Date ${dateFull.toString()}.pdf`;
    const nameCertificate = `${title}_[Certificate].pdf`;
    if (Verifier.isPrivateApostille(ntyData.fileHash)) {
        zip.file(nameCertificate, pdfcertificatePrivate(qr.createDataURL(), ntyData), { comment: 'application/pdf' });
    } else if (Verifier.isPublicApostille(ntyData.fileHash)) {
        zip.file(nameCertificate, pdfcertificatePublic(qr.createDataURL(), ntyData), { comment: 'application/pdf' });
    }

    // Add Original File to zip

    //const nameFile = `${title} --Apostille TX ${ntyData.txHash} --Date ${dateFull.toString()}${ntyData.extensionFile}`;
    const nameFile = `${title}_[${ntyData.txHash}]${ntyData.extensionFile}`
    zip.file(`${nameFile}`, (CryptoJS.enc.Base64.stringify(rawFileContent)), { base64: true, comment: ntyData.typeFile });
    return {
        zipFile: zip,
        qrCode: qr.createDataURL()
    };
}
 const setWhiteList = (transaction: SignedZipInterface) => {
  let whiteListTransaction: SignedZipInterface[] = [];
  whiteListTransaction.push(transaction);
  return whiteListTransaction
}

export const hexStringToByte = (data: string) => {
  if (!data) {
    return new Uint8Array();
  }
  let a = [];
  for (let i = 0, len = data.length; i < len; i += 2) {
    a.push(parseInt(data.substr(i, 2), 16));
  }
  return new Uint8Array(a);
}
export const preparePublicApostille = (rawFileContent :string,tag :string ,fileName: string ,fileType :string, file: any, walletPassword: string) :{result: boolean,base64ImageString: string, whiteListTransaction:SignedZipInterface[]} | boolean=> {
    // console.log(this.nameFile);
    // create a hash prefix (dice si es privado o publico)
    let result = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword);
    if (!result){
      return false
    }
    const apostilleHashPrefix = 'fe4e545903'; // checkSum
    // create an encrypted hash (contenido del archivo)
    const hash = encryptData(file.toString());
    // concatenates the hash prefix and the result gives the apostilleHash
    const apostilleHash = apostilleHashPrefix + hash.toString();
    // Generate an account to send the transaction with the apostilleHash
    const attestationAddress = 'VDYN53XXEGKK3XHQYEK6ZBMNJPXN57ZBHXA3AW55'
    const sinkAddress = Address.createFromRawAddress(attestationAddress);
    // Create an account from my private key
    const accountDetails = walletState.currentLoggedInWallet.selectDefaultAccount()
    let privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv)
    const myAccount = Account.createFromPrivateKey(privateKey, networkState.currentNetworkProfile.network.type);
    // Arm the transaction type transfer
    // console.log('MY NETWORK --->', this.walletService.currentAccount.network);
    

    
    let transactionBuilder = new BuildTransactions( networkState.currentNetworkProfile.network.type)
    // Zero fee is added
    if (ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE || ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE_TEST) {
        transactionBuilder.setFeeStrategy(FeeCalculationStrategy.ZeroFeeCalculationStrategy) ;
    }
    let transferTransaction = transactionBuilder.transfer(sinkAddress, PlainMessage.create(JSON.stringify(apostilleHash)))
    
    // console.log('TRANSACTION BUILDED ---> ', transferTransaction);
    // Sign the transaction
    const generationHash = networkState.currentNetworkProfile.generationHash
    const signedTransaction = myAccount.sign(transferTransaction, generationHash); // Update-sdk-dragon
    // console.log('TRANSACTION SIGNED ---> ', signedTransaction);
    const date = new Date();
    let ntyData = {
      fileName: fileName.slice(0, fileName.lastIndexOf('.')),
      extensionFile: `.${getFileExtension(fileName)}`,
      tags: tag,
      fileHash: apostilleHash,
      owner: myAccount.address,
      fromMultisig: myAccount.address,
      dedicatedAccount: sinkAddress.plain(),
      dedicatedPrivateKey: 'Not show',
      txHash: signedTransaction.hash.toLowerCase(),
      txMultisigHash: '',
      timeStamp: date.toUTCString(),
      typeFile: fileType
    };
    
    // console.log(this.ntyData);
    const apostilleBuilder = buildApostille(ntyData, rawFileContent);
    let base64ImageString = apostilleBuilder.qrCode;
    let whiteListTransaction = setWhiteList({
      signedTransaction,
      storeInDfms: false,
      zip: apostilleBuilder.zipFile,
      nty: ntyData
    });
    const transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint))
    transactionHttp
      .announce(signedTransaction)
      .subscribe()
      result = true
    return {result, base64ImageString, whiteListTransaction}
  }

  export const preparePrivateApostille = (rawFileContent :string,tag :string ,fileName: string ,fileType :string, file: any, walletPassword: string) :{result: boolean,base64ImageString: string, whiteListTransaction:SignedZipInterface[]} | boolean=> {
    // Create an account from my private key
    let result = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword);
    if (!result){
      return false
    }
    const accountDetails = walletState.currentLoggedInWallet.selectDefaultAccount()
    const privateKey = WalletUtils.decryptPrivateKey(new Password(walletPassword), accountDetails.encrypted, accountDetails.iv)
    const ownerAccount = Account.createFromPrivateKey(privateKey, networkState.currentNetworkProfile.network.type);
    // create an encrypted hash
    const hash = encryptData(file.toString());
    // The string contentHash is converted to byte
    const fileHash = hexStringToByte(hash.toString());
    // Create pair of owner keys
    const ownerKeypair = KeyPair.createKeyPairFromPrivateKeyString(privateKey);
    // FileHash is signed with ownerKeypair
    const contentHashSig = KeyPair.sign(ownerKeypair, fileHash);
    // create a prefix hash
    const apostilleHashPrefix = 'fe4e545983';
    // Concatenates the hash prefix and the result gives the apostille hash
    const apostilleHash = apostilleHashPrefix + Convert.uint8ToHex(contentHashSig).toLowerCase();
    // Encrypt the title
    const fileNameHash = encryptData(fileName);
    // Sign the fileNameHash with the ownerKeypair
    const fileNameHashSign = KeyPair.sign(ownerKeypair, hexStringToByte(fileNameHash.toString()));
    // Take the first 32 UINT8 to get the private key
    const dedicatedPrivateKey = Convert.uint8ToHex(fileNameHashSign.slice(0, 32));
    // Create an account from the dedicatedPrivateKey to send a transaction with apostilleHash message
    const dedicatedAccount = Account.createFromPrivateKey(dedicatedPrivateKey, networkState.currentNetworkProfile.network.type);
    // Build the transfer type transaction
    // console.log('MY NETWORK --->', this.walletService.currentAccount.network);
    
    let transactionBuilder = new BuildTransactions( networkState.currentNetworkProfile.network.type)
    // Zero fee is added
    if (ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE || ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type) === NetworkType.PRIVATE_TEST) {
        transactionBuilder.setFeeStrategy(FeeCalculationStrategy.ZeroFeeCalculationStrategy) ;
    }
    let transferTransaction = transactionBuilder.transfer(Address.createFromRawAddress(dedicatedAccount.address.plain()), PlainMessage.create(JSON.stringify(apostilleHash)))

    
    // Zero fee is added
    // console.log('TRANSACTION BUILDER ---> ', transferTransaction);
    // Sign the transaction
    const generationHash = networkState.currentNetworkProfile.generationHash;
    const signedTransaction = ownerAccount.sign(transferTransaction, generationHash);  // Update-sdk-dragon
    // console.log('TRANSACTION SIGNED ---> ', signedTransaction);
    const date = new Date();
    let ntyData = {
      fileName: fileName.slice(0, fileName.lastIndexOf('.')),
      extensionFile: `.${getFileExtension(fileName)}`,
      tags: tag,
      fileHash: apostilleHash,
      owner: ownerAccount.address,
      fromMultisig: ownerAccount.address,
      dedicatedAccount: dedicatedAccount.address.plain(),
      dedicatedPrivateKey, // (this.apostilleCreateForm.get('typePrivatePublic').value == true) ? None (public sink) : nty.dedicatedPrivateKey,
      txHash: signedTransaction.hash.toLowerCase(),
      txMultisigHash: '',
      timeStamp: date.toUTCString(),
      typeFile: fileType
    };

    const apostilleBuilder = buildApostille(ntyData, rawFileContent);
    let base64ImageString = apostilleBuilder.qrCode;
    // announce the transaction
    let  whiteListTransaction = setWhiteList({
      signedTransaction,
      storeInDfms: false,
      zip: apostilleBuilder.zipFile,
      nty: ntyData
    });
    const transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint))
    transactionHttp
      .announce(signedTransaction)
      .subscribe();
    result = true
    return {result,base64ImageString, whiteListTransaction}

  }

  const setAccountWalletStorage = (nty: NtyDataInterface) => {
    let proxinty = JSON.parse(localStorage.getItem('proxi-nty'));
    if (!proxinty) {
      localStorage.setItem('proxi-nty', JSON.stringify([nty]));
    } else {
      proxinty.push(nty);
      localStorage.setItem('proxi-nty', JSON.stringify(proxinty));
    }
  }

  
  export const downloadSignedFiles = (data: SignedZipInterface) =>{
    setAccountWalletStorage(data.nty);
    const date = new Date();
    if (Object.keys(data.zip.files).length > 1) {
      data.zip.generateAsync({
        type: "blob"
      }).then((content: any) => {
        // console.log('content', content);
        /*if (data.storeInDfms) {
          // console.log(this.file);
          const dateFull = `${date.getFullYear()}-${("00" + (date.getMonth() + 1)).slice(-2)}-${("00" + (date.getDate())).slice(-2)}`;
          const fileName = `PROXIsigned -- Do not Edit --"${dateFull}".zip`;

          const file = await new File([content], fileName);
          const data = await this.storageService.buildDataStorage(file, atob(this.b6)).then(
            next => {
              //saveAs(content, `${next.data.dataHash}.zip`)  ;
              saveAs(content, fileName);
            }
          );
          /*const bufferContent = await this.convertBlobToBuffer(content);
          const streamContent = await StreamHelper.buffer2Stream(bufferContent);
          const ipfConnection = new IpfsConnection(
            environment.storageConnection.host,
            environment.storageConnection.port,
            environment.storageConnection.options
          );
          const ifpsClient = new IpfsClient(ipfConnection);
          ifpsClient.addStream(streamContent).subscribe(hash => {
            // console.log('---STORAGE HASH---', hash);
            saveAs(content, `${hash}.zip`);
          });
        } */
          const dateFull = `${date.getFullYear()}-${("00" + (date.getMonth() + 1)).slice(-2)}-${("00" + (date.getDate())).slice(-2)}`;
          //const fileName = `PROXIsigned -- Do not Edit --"${dateFull}".zip`;
          const fileName = `${data.nty.fileName}_[ProximaX_Attest_${dateFull}].zip`;
          saveAs(content, fileName);
        
      });
    }
  }

export interface SignedZipInterface {
    signedTransaction: SignedTransaction;
    storeInDfms: boolean;
    zip: JSZip;
    nty: NtyDataInterface;
    downloaded?: boolean;
  }
  
  
  export interface NtyDataInterface {
    fileName: string;
    extensionFile: string;
    tags?: string;
    fileHash: string;
    owner: Address;
    fromMultisig: Address;
    dedicatedAccount: string;
    dedicatedPrivateKey: string;
    txHash: string;
    txMultisigHash: string;
    timeStamp: string;
    typeFile?: string;
  }


  ////audit
  export interface GetHashName {
    success: boolean,
    hash: string
  }
  export interface TransactionsInterface {
    // data: Transaction;
    data: any;
    dateFile?: string;
    description?: string;
    effectiveFee?: null;
    nameType: string;
    timestamp?: string;
    fee: string;
    feePart: {
      part1: string;
      part2: string;
    };
    sender: PublicAccount;
    recipientRentalFeeSink: string;
    recipient: Address;
    recipientAddress: string;
    receive: boolean;
    senderAddress: string;
    fileName?: string;
    privateFile?: boolean;
    name?: string;
    hash?: string;
    height?: number;
  }
  export interface ResultAuditInterface {
    filename: string;
    owner: Address | NamespaceId | string;
    fileHash: string;
    result: string;
    hash: string;
    date?: string;
    method?: string;
    transaction?: TransactionsInterface;
  }
  const returnHexaNumber = (s: any) => {
    let regExp = /[0-9A-Fa-f]{6}/g;
    return (typeof s === 'string' && regExp.test(s));
  }
  const getHashName= (name: string):GetHashName =>{
    let dataR: any = {
      success: false,
      hash: null
    }
    let arrayName = name.split("[")
    let arrayNameV = arrayName.map(x => x.trim().slice(0, 64)).find(x => returnHexaNumber(x) == true && x.length == 64)
    if (arrayNameV) {
      dataR = {
        success: true,
        hash: arrayNameV
      }
    }
    
    return dataR
  }
  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const convertDateTimeFormat = (dateTime: string): string =>{
    let dateFormat = "L";
    let date = new Date(dateTime);
    
    return moment(date).locale('en').format(dateFormat);
  }
  const validateBlock = (blockInfo: BlockInfo) => {
    if (blockInfo.numTransactions && blockInfo.numTransactions >= 1) {
      const blocksStorage = localStorage.getItem("sw-blocks");
      if (blocksStorage) {
        const parsedData = JSON.parse(blocksStorage);
        parsedData.unshift(blockInfo);
        localStorage.setItem("sw-blocks", JSON.stringify(parsedData.slice(0, 100)));
      } else {
        localStorage.setItem("sw-blocks", JSON.stringify([blockInfo]));
      }
    }
  } 
  const verify = (data: any, infTrans :TransferTransaction): boolean =>{
    if (Verifier.isPublicApostille(infTrans.message.payload.replace(/['"]+/g, ''))) {
      return Verifier.verifyPublicApostille(data, infTrans.message.payload.replace(/['"]+/g, ''))
    }
    if (Verifier.isPrivateApostille(infTrans.message.payload.replace(/['"]+/g, ''))) {
      return Verifier.verifyPrivateApostille(infTrans.signer, data, infTrans.message.payload.replace(/['"]+/g, ''))
    } 
  }
  
  const validateIsRecipient = (transaction: Transaction) => {
    let recipient = null;
    let recipientPretty = null;
    let isReceive = false;
    if (transaction['recipient'] !== undefined) {
      recipient = transaction['recipient'];
      recipientPretty = recipient.pretty();
      const currentWallet = walletState.currentLoggedInWallet
      if (currentWallet.accounts) {
        if (currentWallet.accounts.find(element => Address.createFromRawAddress(element.address).pretty() === recipientPretty)) {
          isReceive = true;
        }
      }
    }

    return {
      recipient,
      recipientPretty,
      isReceive
    };
  }
  const getDataPart = (data: string, cantPart: number) => {
    return {
      part1: data.slice(0, data.length - cantPart),
      part2: data.slice(-cantPart)
    };
  }

  const getRentalFeeSink = (transaction: Transaction) => {
    let mosaicRentalFeeSink = {
      public_key: '94A9BB9660037E622C8F626E061DB1557CBBED0338402E82E796168E80EF9765',
      address_public_test: 'XC5ZZN-SYLOXO-EQIAAF-N6B5S6-QAQSFF-5TEVC4-XLTV'
    }
    let namespaceRentalFeeSink = {
      public_key: '9FF38184F03950C09FFFF4A90C171E4C3C566985EEACA486A59CC8B607C10BF6',
      address_public_test: 'XA7KWF-N5CMLV-G7W3OH-Z5CV3G-3VYH3N-5EQQTK-OVJH'
    }
    if (transaction['mosaics'] === undefined) {
      if (transaction.type === transactionTypeName.registerNameSpace.id) {
        return namespaceRentalFeeSink.address_public_test;
      } else if (
        transaction.type === transactionTypeName.mosaicDefinition.id ||
        transaction.type === transactionTypeName.mosaicSupplyChange.id
      ) {
        return mosaicRentalFeeSink.address_public_test;
      } else {
        return '-';
      }
    }
  }
  const getStructureDashboard = (transaction: Transaction, othersTransactions?: TransactionsInterface[], group?: string): TransactionsInterface =>{
    if (othersTransactions && othersTransactions.length > 0) {
      try {
        const existTransction = othersTransactions.filter(next => next.data.transactionInfo.hash === transaction.transactionInfo.hash);
        if (existTransction && existTransction.length > 0) {
          return null;
        }
      } catch (error) {
        return null;
      }
    }

    const keyType = dashboardUtils.getNameTypeTransaction(transaction.type); 
    if (keyType !== undefined) {
     /*  const dataTransaction = this.validateIsSwapTransaction(transaction, keyType, group); */
      const feeFormatter =  Helper.amountFormatterSimple(transaction.maxFee.compact());
      const rentalFeeSink = getRentalFeeSink(transaction);
      const responseIsRecipient = validateIsRecipient(transaction);

      let responseTransaction = {
        data: transaction,
        nameType: keyType,
        fee: feeFormatter,
        feePart: getDataPart(feeFormatter, 6),
        sender: transaction.signer,
        recipientRentalFeeSink: rentalFeeSink,
        recipient: responseIsRecipient.recipient,
        recipientAddress: responseIsRecipient.recipientPretty,
        receive: responseIsRecipient.isReceive,
        senderAddress: transaction['signer'].address.pretty(),
      };

      if(group === "confirmed" && transaction.transactionInfo.height){
        responseTransaction['height'] = transaction.transactionInfo.height.compact();
      }

      return responseTransaction;
    }
    return null;
  }
  export const verifyHash = async(transactionSearch: {file :File,resultData :any,hash :string}[],transactions: TransferTransaction[], auditResults: ResultAuditInterface[]) :Promise<ResultAuditInterface[]> => {
    // console.log('\n\n\n\nValue of trasaction', transactions, '\n\n\n\nEnd value\n\n');
    //this.searching = false;
    transactionSearch.forEach(async element => {
      const arrayName = element.file.name;
      const findHash = transactions.find(el => element.hash.toUpperCase() === el.transactionInfo.hash);
      if (findHash !== undefined) {
        const dateFile = await getUTCDateTime(findHash.transactionInfo)
        if (verify(element.resultData, findHash)) {
          let originalName = '';
          let method = '';
          originalName = arrayName
          const apostillePrivatePrefix = 'fe4e545983';
          const apostillePublicPrefix = 'fe4e545903';
          const prefixHash = findHash.message.payload.replace(/['"]+/g, '').substr(0, 10);


          let transaction = getStructureDashboard(findHash);
          transaction.dateFile = String(dateFile) ;
          transaction.fileName = originalName;

          if (prefixHash === apostillePublicPrefix) {
            transaction.privateFile = false;
          } else if (prefixHash === apostillePrivatePrefix) {
            transaction.privateFile = true;
          }

          let find = []
          if (findHash.transactionInfo.hash) {
            find = auditResults.filter(el => el.hash === findHash.transactionInfo.hash);
          } else {
            find = auditResults.filter(el => el.filename === originalName);
          }
          if (find.length === 0) {
            auditResults.push({
              filename: originalName,
              owner: Address.createFromRawAddress(transaction.senderAddress).pretty(),
              fileHash: findHash.message.payload.replace(/['"]+/g, ''),
              result: 'Document apostille',
              hash: findHash.transactionInfo.hash,
              date: String(dateFile) ,
              method: method,
              transaction: transaction,
            } );
          }
        } else {

          auditResults.push({
            filename: element.file.name,
            owner: '',
            fileHash: '',
            result: 'Modified document',
            hash: ''
          });
        }
      } else {
        auditResults.push({
          filename: element.file.name,
          owner: '',
          fileHash: '',
          result: 'No result found',
          hash: ''
        });
        
      }
    });
     return new Promise(resolve => {
       console.log(auditResults)
        resolve(auditResults);
    });
  }
  const getUTCDateTime = (transactionInfo: TransactionInfo) => new Promise((resolve, reject) => {
    const height = transactionInfo.height.compact();
    let UTCDateTime = "";
    if (typeof (height) === 'number') {
     /*  const existBlock = this.dataBridge.filterBlockStorage(height);
      if (existBlock) {
        UTCDateTime = `${this.transactionService.dateFormatPureUTC(new UInt64([existBlock.timestamp.lower, existBlock.timestamp.higher]))}`;
        UTCDateTime = this.convertDateTimeFormat(UTCDateTime);
        resolve(UTCDateTime);
      }  */
      const blockapi = new BlockAPI(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint))
        blockapi.getBlockByHeight(height).then(
          next => {
            validateBlock(next);
            UTCDateTime = new Date(next.timestamp.compact() + 1459468800 * 1000).toISOString();
            UTCDateTime = convertDateTimeFormat(UTCDateTime);
            resolve(UTCDateTime);
          }
        );
    }
  })

  export const fileTour = async(file: any [])=> {
    const hash = [];
    let transactionsSearch :{file :File,resultData :any,hash :string}[] = []
    let auditResults: ResultAuditInterface[] = []
    for (let index = 0; index < file.length; index++) {
      const el = file[index];
      console.log(el)
      if (el.type === 'application/zip') {
        const jszip = new JSZip();
        await jszip.loadAsync(el).then(async (zip) => {
          if (Object.keys(zip.files).length >= 2) {
            for (let filename of Object.keys(zip.files)) {
              await zip.files[filename].async('blob').then(async (blobFile) => {
                const blobClone = Object.assign({}, blobFile);
                /* blobClone.type = await zip.files[filename].comment; */
                const file = await new File([blobClone.type], zip.files[filename].name, { type: zip.files[filename].comment });
                let verifyName = file.name.substr(0, 15);
                if (verifyName !== 'Certificate') {
                  const modifiedFile = await new File([blobFile], zip.files[filename].name, { type: zip.files[filename].comment });
                const uploadedFileContent = await toBase64(file)
                  const hashName: GetHashName = getHashName(file.name)
                  if (hashName.success) {
                    file[index] = modifiedFile;
                    transactionsSearch.push({ file: file, resultData: uploadedFileContent, hash: hashName.hash });
                    hash.push(hashName.hash);
                  } else {
                    auditResults.push({
                      filename: el.name,
                      owner: '',
                      fileHash: '',
                      result: 'the filename does not contain the hash located in the certificate',
                      hash: ''
                    });
                  }
                }
              });
            }
          } else {
            auditResults.push({
              filename: el.name,
              owner: '',
              fileHash: '',
              result: 'The file does not contain valid data to audit',
              hash: ''
            });
          }
        });
      } else {
        const hashName: GetHashName = getHashName(el.name)
        if (hashName.success) {
          const uploadedFileContent = await toBase64(el)
          transactionsSearch.push({ file: el, resultData: uploadedFileContent, hash: hashName.hash });
          hash.push(hashName.hash);
        } else {
          auditResults.push({
            filename: el.name,
            owner: '',
            fileHash: '',
            result: 'the filename does not contain the hash located in the certificate',
            hash: ''
          });
        }
      }
    }
    return{hash, transactionsSearch,auditResults};
  }