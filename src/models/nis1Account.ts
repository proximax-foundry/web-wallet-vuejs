export class nis1Account{

    address: string;
    publicKey: string;
    balance: number;

    constructor(address: string, publicKey: string, balance?: number){
        this.address = address;
        this.publicKey = publicKey;
        this.balance = balance ? balance : 0;
    }

}