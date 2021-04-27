import { readonly } from "vue";
import {
  NamespaceId,
} from "tsjs-xpx-chain-sdk";
import { environment } from '../environment/environment.js';
import { siriusStore } from "@/store/sirius";

const saveNamespaceStorage = async (namespaceInfo) => {
  // console.log('\n\n\n ----namespaceInfo----', namespaceInfo, '\n\n\n');
  const namespacesStorage = getNamespacesStorage();
  const names = await siriusStore.namespaceHttp.getNamespacesName(namespaceInfo.map(x => x.id)).toPromise();
  console.log('----names---', names);
  const namespacesFound = [];
  for (const info of namespaceInfo) {
    namespacesFound.push({
      id: [info.id.id.lower, info.id.id.higher],
      idToHex: info.id.toHex(),
      namespaceName: names.find(name => name.namespaceId.toHex() === info.id.toHex()),
      namespaceInfo: info
    });
  }

  const namespaceToSaved = namespacesFound.slice(0);
  if (namespacesStorage.length > 0 && namespaceToSaved.length > 0) {
    for (const namespacesSaved of namespacesStorage) {
      const existNamespace = namespaceToSaved.find(b => b.idToHex === namespacesSaved.idToHex);
      // console.log('----existe?----', existNamespace);
      if (!existNamespace) {
        namespaceToSaved.push(namespacesSaved);
      }
    }
  }

  // console.log('-TODO LO QUE GUARDARÉ', namespaceToStorage);
  localStorage.setItem(environment.nameKeyNamespaces, JSON.stringify(namespaceToSaved));
  this.fillNamespacesDefaultAccount();
}

const getNamespacesStorage = () => {
  const namespacesStorage = localStorage.getItem(environment.nameKeyNamespaces);
  return (namespacesStorage !== null && namespacesStorage !== undefined) ? JSON.parse(namespacesStorage) : [];
}

function getNamespace(namespace) {
  return siriusStore.namespaceHttp.getNamespace(namespace);
}

function getNamespaceId(id) {
  return new NamespaceId(id);
}

const getNamespaceFromId = async (namespaceId, recursive = true) => {
  const dataFound = [];
  const missingId = [];
  const namespacesStorage = getNamespacesStorage();
  if (namespacesStorage.length > 0 && namespaceId.length > 0) {
    for (const id of namespaceId) {
      const x = namespacesStorage.find(next => next.idToHex === id.toHex());
      if (x && Object.keys(x).length > 0) {
        dataFound.push(x);
      } else {
        missingId.push(id);
      }
    }
  } else {
    namespaceId.forEach(id => {
      missingId.push(id);
    });
  }

  if (missingId.length > 0 && recursive) {
    for (const id of missingId) {
      try {
        // Gets array of NamespaceInfo for an account
        const namespaceInfo = await getNamespace(id).toPromise();
        if (namespaceInfo && Object.keys(namespaceInfo).length > 0) {
          await saveNamespaceStorage([namespaceInfo]);
        }
        // disable-next-line no-unused-vars
      } catch (error) {
        // console.log('----Search namespaces from accounts error----', error);
      }
    }
    return getNamespaceFromId(namespaceId, false);
  }

  return dataFound;
}


export const namespaces = readonly({
  getNamespaceId,
  getNamespaceFromId,
});