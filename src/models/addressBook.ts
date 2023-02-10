
export class AddressBook{

    name: string;
    address: string;
    group: string;
    publicKey: string;

    constructor(name: string, address: string, group: string, publicKey?: string){
        this.name = name;
        this.address = address;
        this.group = group;
        this.publicKey = publicKey;
    }
}