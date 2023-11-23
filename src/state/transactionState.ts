import { reactive } from "vue";

interface transactionStateInterface {
    lockHashPayload: string
    transactionPayload: string
    selectedAddress: string
}

export const TransactionState = reactive<transactionStateInterface>({
    lockHashPayload: '',
    transactionPayload: '',
    selectedAddress: ''
  });