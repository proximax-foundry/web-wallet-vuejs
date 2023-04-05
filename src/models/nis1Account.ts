// class balance{
//     xar: number;
//     xpx: number;
// }

export class nis1Account {
  address: string;
  publicKey: string;
  balance: any;

  constructor(address: string, publicKey: string) {
    this.address = address;
    this.publicKey = publicKey;
    this.balance = [];
  }
}
