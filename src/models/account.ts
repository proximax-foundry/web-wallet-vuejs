
export class Account{
    name: string;
    balance: number = 0;
    publicKey: string;
    address: string;

    constructor(name: string, publicKey: string, address: string){
        this.name = name;
        this.publicKey = publicKey;
        this.address = address;
    }
}