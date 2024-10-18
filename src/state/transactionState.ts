import { reactive } from "vue";

interface transactionStateInterface {
    lockHashPayload: string
    transactionPayload: string
    unsignedTransactionPayload: string | string[]
    selectedAddress: string
    selectedMultisigAddress: string
}

export const TransactionState = reactive<transactionStateInterface>({
    lockHashPayload: '',
    transactionPayload: '',
    unsignedTransactionPayload: '',
    selectedAddress: '',
    selectedMultisigAddress: '',
  });