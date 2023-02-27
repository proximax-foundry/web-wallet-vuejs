import { SimpleWallet } from "./simpleWallet";
import { AddressBook } from "./addressBook";
import { Label } from "./label";
import { SimpleAccount } from "./simpleAccount";

const walletKey = "sw";

export class SimpleWallets {
  wallets: SimpleWallet[] = [];

  constructor() {
    this.fetchFromLocalStorage();
  }

  fetchFromLocalStorage(): void {
    const tempWallets = localStorage.getItem(walletKey);

    try {
      if (tempWallets) {
        this.wallets = Reconstruct.reconstructAll(JSON.parse(tempWallets));
      } else {
        this.wallets = [];
      }
    } catch (error) {
      this.wallets = [];
    }
  }

  savetoLocalStorage(): void {
    localStorage.setItem(walletKey, JSON.stringify(this.wallets));
  }

  saveMyWalletOnlytoLocalStorage(myWallet: SimpleWallet): void {
    const newWalletsInstance = new SimpleWallets();

    const walletIndex = newWalletsInstance.wallets.findIndex(
      (wallet) =>
        wallet.name === myWallet.name &&
        wallet.networkName === myWallet.networkName
    );

    newWalletsInstance.wallets[walletIndex] = myWallet;

    localStorage.setItem(walletKey, JSON.stringify(newWalletsInstance.wallets));
  }
}

class Reconstruct {
  static reconstructAll(JSON_Wallets: SimpleWallet[]): SimpleWallet[] {
    const wallets: SimpleWallet[] = [];

    for (let i = 0; i < JSON_Wallets.length; ++i) {
      const accounts: SimpleAccount[] = [];

      for (let k = 0; k < JSON_Wallets[i].accounts.length; ++k) {
        const tempAccount = JSON_Wallets[i].accounts[k];

        const newWalletAccount = Reconstruct.recreateSimpleAccount(tempAccount);

        accounts.push(newWalletAccount);
      }

      const contacts: AddressBook[] = [];

      for (let k = 0; k < JSON_Wallets[i].contacts.length; ++k) {
        const tempContact = JSON_Wallets[i].contacts[k];

        contacts.push(Reconstruct.recreateAddressBook(tempContact));
      }
      const labels: Label[] = [];
      if (JSON_Wallets[i].labels) {
        for (let k = 0; k < JSON_Wallets[i].labels.length; ++k) {
          const tempLabel = JSON_Wallets[i].labels[k];
          labels.push(Reconstruct.recreateLabel(tempLabel));
        }
      }

      const newWallet = new SimpleWallet(
        JSON_Wallets[i].name,
        JSON_Wallets[i].networkName,
        accounts
      );
      newWallet.contacts = contacts;
      newWallet.labels = labels;
      wallets.push(newWallet);
    }

    return wallets;
  }

  static recreateAddressBook(addressBook: AddressBook): AddressBook {
    let group;
    if (!addressBook.group) {
      group = "-none-";
    } else {
      group = addressBook.group;
    }
    const newAddressBook = new AddressBook(
      addressBook.name,
      addressBook.address,
      group,
      addressBook.publicKey
    );
    return newAddressBook;
  }

  static recreateLabel(label: Label): Label {
    return new Label(label.name, label.addresses);
  }

  static recreateSimpleAccount(tempAccount: SimpleAccount): SimpleAccount {
    const newAccount = new SimpleAccount(
      tempAccount.name,
      tempAccount.publicKey,
      tempAccount.address,
      tempAccount.algo,
      tempAccount.encrypted,
      tempAccount.iv
    );

    return newAccount;
  }
}
