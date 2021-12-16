export class CommonTransaction{
  
    hash: string;
    type: string = "";
    maxFee?: number | null = 0;
    signer: string = "";
    signerAddress: string = "";
    signerName: string = "";
    deadline: number | null = null;
  
    constructor(txnHash: string){
      this.hash = txnHash;
    }
}