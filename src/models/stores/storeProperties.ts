export class StoreProperties {
  storeName: string;

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  init(): void {
    const stateFromLocalStorage = localStorage.getItem(this.storeName);

    if (stateFromLocalStorage) {
      if (typeof stateFromLocalStorage === "string") {
        Object.assign(this, JSON.parse(stateFromLocalStorage));
      } else {
        Object.assign(this, stateFromLocalStorage);
      }
    }
  }

  saveToLocalStorage(): void {
    const data = StateCopy.removeStateNameStringify(JSON.stringify(this));

    localStorage.setItem(this.storeName, data);
  }
}

class StateCopy {
  static removeStateNameStringify(json: string): any {
    const storeCopy = JSON.parse(json);

    delete storeCopy.storeName;
    return JSON.stringify(storeCopy);
  }
}
