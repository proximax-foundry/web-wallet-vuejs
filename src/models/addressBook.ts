
export class AddressBook{

    name: string;
    address: string;
    group: string;
    publicKey: string | null;

    constructor(name: string, address: string, group: string, publicKey=null){
        this.name = name;
        this.address = address;
        this.group = group;
        this.publicKey = publicKey;
    }
}