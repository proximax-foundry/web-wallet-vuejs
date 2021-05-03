import { readonly } from "vue";
import {
  UInt64,
} from "tsjs-xpx-chain-sdk";
import { siriusStore } from "@/store/sirius";
import { environment } from '../environment/environment.js';

const filterBlockStorage = (height) => {
  const blocksStorage = localStorage.getItem(environment.nameKeyBlockStorage);
  if (blocksStorage) {
    // console.log('blocksStorage', blocksStorage);
    const parsedData = JSON.parse(blocksStorage);
    return parsedData.find(x => new UInt64([x.height.lower, x.height.higher]).compact() === height);
  }
  return null;
}

const validateBlock = (blockInfo) => {
  if (blockInfo.numTransactions && blockInfo.numTransactions >= 1) {
    const blocksStorage = localStorage.getItem(environment.nameKeyBlockStorage);
    if (blocksStorage) {
      const parsedData = JSON.parse(blocksStorage);
      parsedData.unshift(blockInfo);
      localStorage.setItem(environment.nameKeyBlockStorage, JSON.stringify(parsedData.slice(0, 100)));
    } else {
      localStorage.setItem(environment.nameKeyBlockStorage, JSON.stringify([blockInfo]));
    }
  }
}

const getBlockInfo = (height = 1) => {
  return siriusStore.blockHttp.getBlockByHeight(height);
}

export const dataBridge = readonly({
  filterBlockStorage,
  validateBlock,
  getBlockInfo,
});