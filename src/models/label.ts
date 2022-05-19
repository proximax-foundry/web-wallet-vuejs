export class Label{

    name: string;
    address: string[];

    constructor(name: string, address:string[]){
        this.name = name;
        this.address = address;
    }

    addAddress(address: string){
        this.address.push(address)
    }

    removeAddress(index: number): void{
        this.address.splice(index, 1);
    }
}