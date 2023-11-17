import { reactive } from "vue";

interface transactionStateInterface {
    lockHashPayload: String
    transactionPayload: String
}

export const TransactionState = reactive<transactionStateInterface>({
    lockHashPayload: '',
    transactionPayload: ''
  });