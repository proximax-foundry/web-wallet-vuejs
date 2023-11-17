import { reactive } from "vue";

interface transactionStateInterface {
    lockHashPayload: String
    transactionPayload: String
    selectedAddress: String
}

export const TransactionState = reactive<transactionStateInterface>({
    lockHashPayload: '',
    transactionPayload: '',
    selectedAddress: ''
  });