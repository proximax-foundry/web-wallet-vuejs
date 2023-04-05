import { reactive } from "vue";
import {
  ChainProfileNames,
  ChainProfile,
  ChainProfileConfig,
} from "../models/stores/";

interface networkStateInterface {
  chainNetwork: number;
  chainNetworkName: string;
  currentNetworkProfile: ChainProfile | null;
  currentNetworkProfileConfig: ChainProfileConfig | null;
  selectedAPIEndpoint: string;
  availableNetworks: string[];
  blockHeight?: number;
}

export const networkState = reactive<networkStateInterface>({
  chainNetwork: 0,
  chainNetworkName: "",
  currentNetworkProfile: null,
  currentNetworkProfileConfig: null,
  selectedAPIEndpoint: "",
  availableNetworks: ChainProfileNames.createDefault().names.map(
    (val) => val.name
  ),
  blockHeight: 0,
});
