export class Label{

    name: string;
    addresses: string[];

    constructor(name: string, address:string[]){
        this.name = name;
        this.addresses = address;
    }

    addAddress(address: string){
        this.addresses.push(address)
    }

    removeAddress(index: number): void{
        this.addresses.splice(index, 1);
    }
}