// import { readonly } from "vue";
// import {
  // Deadline,
  // PublicAccount,
  // TransactionType,
  // MosaicId,
// } from "tsjs-xpx-chain-sdk";
// import { appStore } from "@/store/app";
// import { siriusStore } from "@/store/sirius";
// import { environment } from '../environment/environment.js';
// import { namespaces } from '../util/namespaces.js';
// function getItemMosaicStorage() {
//   return environment.nameKeyMosaicStorage;
// }

/**
*
*
* @returns {MosaicsStorage[]}
* @memberof MosaicService
*/
// const getMosaicsFromStorage = () => {
//   const dataStorage = localStorage.getItem(getItemMosaicStorage());
//   return (dataStorage !== null && dataStorage !== undefined) ? JSON.parse(dataStorage) : [];
// }

// const getMosaicId = (id) => {
//   return new MosaicId(id);
// }

// const getMosaics = (mosaicIsd) => {
//   return siriusStore.mosaicHttp.getMosaics(mosaicIsd);
// }

// const getLinkedMosaicId = (namespace) => {
//   return siriusStore.namespaceHttp.getLinkedMosaicId(namespace);
// }

// const getMosaicsName = async(mosaicsId) => {
//   return await siriusStore.mosaicHttp.getMosaicsNames(mosaicsId).toPromise(); // Update-sdk-dragon
// }

// const searchMosaicFromNamespace = async (findMosaicsByNamespace) => {
//   const mosaicsTosaved = [];
//   if (findMosaicsByNamespace.length > 0) {
//     const searchMosaicById = [];
//     const savedLinked = [];
//     // recorro todos los mosaics id o namespaces id
//     for (const id of findMosaicsByNamespace) {
//       // convierto ese mosaico id a nemespace id
//       const namespaceId = namespaces.getNamespaceId([id.id.lower, id.id.higher]);
//       const mosaicIdLinked = await getLinkedMosaicId(namespaceId).toPromise();
//       if (mosaicIdLinked) {
//         savedLinked.push({
//           mosaicId: mosaicIdLinked,
//           namespaceId
//         });
//         searchMosaicById.push(mosaicIdLinked);
//       }
//     }

//     if (searchMosaicById.length > 0) {
//       const otherMosaicsFound = await getMosaics(searchMosaicById).toPromise();
//       const mosaicsName = await getMosaicsName(savedLinked.map(x => x.mosaicId));
//       // console.log('---mosaicsName---', mosaicsName);
//       otherMosaicsFound.forEach(infoMosaic => {
//         const dataFiltered = savedLinked.find(x => x.mosaicId.toHex() === infoMosaic.mosaicId.toHex());
//         const mosaicIdFiltered = (dataFiltered) ? [dataFiltered.namespaceId.id.lower, dataFiltered.namespaceId.id.higher] : null;
//         if (mosaicIdFiltered) {
//           mosaicsTosaved.push({
//             idMosaic: [infoMosaic.mosaicId.id.lower, infoMosaic.mosaicId.id.higher],
//             isNamespace: mosaicIdFiltered,
//             mosaicNames: (mosaicsName) ? mosaicsName.find(x => x.mosaicId.toHex() === dataFiltered.mosaicId.toHex()) : null,
//             mosaicInfo: infoMosaic
//           });
//         }
//       });
//     }
//   }

//   return mosaicsTosaved;
// }

// const searchInfoMosaics = async(mosaicsId) => {
//   try {
//     const mosaicsTosaved = [];
//     if (mosaicsId.length > 0) {
//       const findMosaicsByNamespace = [];
//       // le paso todos los mosaicsIds a la consulta
//       const mosaicsFound = await getMosaics(mosaicsId).toPromise();
//       // console.log('mosaicsFound', mosaicsFound);
//       // Recorro los mosaics Ids
//       mosaicsId.forEach(element => {
//         // Filtra si el mosaico id fue encontrado
//         const existMosaic = mosaicsFound.find(x => x.mosaicId.id.toHex() === element.id.toHex());
//         if (!existMosaic) {
//           // Si no fue encontrado, busca mosaicos por namespace
//           findMosaicsByNamespace.push(element);
//         }
//       });

//       // console.log('findMosaicsByNamespace', findMosaicsByNamespace);
//       // Search mosaics by namespace Id
//       if (findMosaicsByNamespace.length > 0) {
//         // busca los namespaceId de los mosaicos que no fueron encontrados
//         const otherMosaics = await searchMosaicFromNamespace(findMosaicsByNamespace);
//         // console.log('otherMosaics', otherMosaics);
//         otherMosaics.forEach(element => {
//           mosaicsTosaved.push(element);
//         });
//       }


//       if (mosaicsFound.length > 0) {
//         const mosaicsName = await getMosaicsName(mosaicsId);
//         mosaicsFound.forEach(infoMosaic => {
//           try {
//             const existMosaicName = (mosaicsName) ? mosaicsName.find(x => x.mosaicId.toHex() === infoMosaic.mosaicId.toHex()) : null;
//             mosaicsTosaved.push({
//               idMosaic: [infoMosaic.mosaicId.id.lower, infoMosaic.mosaicId.id.higher],
//               isNamespace: (existMosaicName && existMosaicName.names && existMosaicName.names.length > 0) ?
//                 [existMosaicName.names[0].namespaceId.id.lower, existMosaicName.names[0].namespaceId.id.higher] :
//                 null,
//               mosaicNames: existMosaicName,
//               mosaicInfo: infoMosaic
//             });
//           } catch (error) {
//             // console.log('Has ocurred a error with search mosaics', error);
//           }
//         });
//       }
//     }

//     saveMosaicStorage(mosaicsTosaved);
//     return mosaicsTosaved;
//   } catch (error) {
//     console.error('Has ocurred a error with search mosaics', error);
//   }
// }

// const saveMosaicStorage = async(mosaicsTosaved) => {
//   if (mosaicsTosaved) {
//     let mosaicsStorage = getMosaicsFromStorage();
//     for (const element of mosaicsTosaved) {
//       if (mosaicsStorage.length > 0) {
//         const mosaicIdToSaved = getMosaicId(element.idMosaic).toHex();
//         const elementStorage = mosaicsStorage.find(x => getMosaicId(x.idMosaic).toHex() === mosaicIdToSaved);
//         if (elementStorage) {
//           if (elementStorage.isNamespace && !element.isNamespace) {
//             try {
//               const mosaicIdLinked = await getLinkedMosaicId(namespaces.getNamespaceId(elementStorage.isNamespace)).toPromise();
//               if (mosaicIdLinked && (mosaicIdLinked.toHex() === mosaicIdToSaved)) {
//                 element.isNamespace = elementStorage.isNamespace;
//               }
//             } catch (error) {
//               console.log('Error: ' + error);
//             }
//           }
//         }
//         mosaicsStorage = mosaicsStorage.filter(x => this.proximaxProvider.getMosaicId(x.idMosaic).toHex() !== mosaicIdToSaved);
//       }
//       mosaicsStorage.push(element);
//     }

//     localStorage.setItem(this.getItemMosaicStorage(), JSON.stringify(mosaicsStorage));
//     setMosaicChanged();
//   }
// }

// const setMosaicChanged = () => {
//   mosaicChangedSubject.next(increment + 1);
// }

// const filterMosaics = async(mosaicsId = null, byAccount = '') => {
//   if (mosaicsId) {
//     const mosaicsFromStorage = getMosaicsFromStorage();
//     if (mosaicsFromStorage.length > 0) {
//       const dataReturn = [];
//       const toSearch = [];
//       mosaicsId.forEach(element => {
//         const existMosaic = mosaicsFromStorage.find(x => getMosaicId(x.idMosaic).toHex() === element.toHex());
//         if (existMosaic) {
//           dataReturn.push(existMosaic);
//         } else {
//           // tslint:disable-next-line: no-shadowed-variable
//           const existMosaic = mosaicsFromStorage.find(x => (x.isNamespace) ? getMosaicId(x.isNamespace).toHex() === element.toHex() : undefined);
//           if (existMosaic) {
//             dataReturn.push(existMosaic);
//           } else {
//             toSearch.push(element);
//           }
//         }
//       });

//       // console.log('toSearch --> ', toSearch);
//       if (toSearch.length > 0) {
//         const mosaicsSearched = await searchInfoMosaics(toSearch);
//         if (mosaicsSearched && mosaicsSearched.length > 0) {
//           mosaicsSearched.forEach(element => {
//             dataReturn.push(element);
//           });
//         }
//       }

//       // console.log('aqui 11......', dataReturn);

//       return this.filterMosaicToReturn(dataReturn);
//     } else {
//       const infoMosaics = await searchInfoMosaics(mosaicsId);
//       // console.log('infoMosaics --> ', infoMosaics);
//       return this.filterMosaicToReturn(infoMosaics);
//     }
//   } else {
//     const name = (byAccount !== '') ? byAccount : this.walletService.currentAccount.name;
//     const accountInfo = this.walletService.filterAccountInfo(name);
//     if (accountInfo && accountInfo.accountInfo && accountInfo.accountInfo.mosaics && accountInfo.accountInfo.mosaics.length > 0) {
//       return filterMosaics(accountInfo.accountInfo.mosaics.map(x => x.id));
//     } else {
//       return [];
//     }
//   }
// }



// export const mosaic = readonly({
//   getMosaics,
//   getMosaicId,
//   // filterMosaics,
//   searchInfoMosaics,
//   getMosaicsFromStorage,
//   getItemMosaicStorage,
// });