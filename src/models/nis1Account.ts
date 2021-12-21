class balance{
    xar: number;
    xpx: number;
}

export class nis1Account{

    address: string;
    publicKey: string;
    balance: balance;

    constructor(address: string, publicKey: string, balance?: balance){
        this.address = address;
        this.publicKey = publicKey;
        this.balance = balance;
    }

}