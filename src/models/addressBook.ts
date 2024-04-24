
export class AddressBook{

    name: string;
    address: string;
    group: string;
    publicKey: string | null;
    version: number;

    constructor(name: string, address: string, group: string, version: number = 0, publicKey: string =null){
        this.name = name;
        this.address = address;
        this.group = group;
        this.version = version;
        this.publicKey = publicKey;
    }
}