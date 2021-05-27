import { reactive } from "vue";
import { ChainProfileNames } from "../models/stores/chainProfileNames"

export const networkState = reactive({
    chainNetwork: 0,
    chainNetworkName:'',
    currentNetworkProfile: {},
    currentNetworkProfileConfig: {},
    selectedAPIEndpoint: "",
    networkAPIEndpoints: [],
    availableNetworks: ChainProfileNames.createDefault().names,
    blockHeight: '',
  });