import { RouteRecordRaw } from 'vue-router';
export const TransactionRoutes: RouteRecordRaw[] = [
  

  {
    path: '/sign/:txnHash',
    name: 'ViewTransactionSign',
    props: true,
    component: () => import('@/modules/transaction/views/ViewTransactionSign.vue'),
    meta: {
      title: "Sign Transaction",
    }
  },
  {
    path: '/view-confirmation-transaction/:txnPayload/:hashLockTxnPayload?/:selectedAddress',
    name: 'ViewConfirmTransaction',
    props: true,
    component: () => import('@/modules/transaction/components/ConfirmationTxn.vue'),
    meta: {
      title: "Confirmation Transaction",
    }
  }
];