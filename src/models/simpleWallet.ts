import type { SimpleAccount } from "./simpleAccount";
import type { AddressBook } from "./addressBook";
import type { Label } from "./label";

export class SimpleWallet {
  name: string;
  networkName: string;
  accounts: SimpleAccount[];
  contacts: AddressBook[] = [];
  labels: Label[] = [];

  constructor(name: string, networkName: string, accounts: SimpleAccount[]) {
    this.name = name;
    this.networkName = networkName;
    this.accounts = accounts;
  }
}
