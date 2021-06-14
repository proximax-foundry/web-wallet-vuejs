import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    props: true,
    component: () => import('@/views/Welcome.vue'),
    meta: {
      title: "Welcome to Sirius Web Wallet",
    }
  },
  {
    path: '/create',
    name: 'CreateWalletSelection',
    component: () => import('@/views/CreateWalletSelection.vue'),
    meta: {
      title: "Select Wallet Creation Type",
    }
  },
  {
    path: '/wallets',
    name: 'ViewWallets',
    props: true,
    component: () => import('@/views/ViewWallets.vue'),
    meta: {
      title: "View all wallets stored on device",
    }
  },
  {
    path: '/create-wallet',
    name: 'ViewCreateNewWallet',
    component: () => import('@/views/ViewCreateNewWallet.vue'),
    meta: {
      title: "Create wallet",
    }
  },
  {
    path: '/import-wallet',
    name: 'ViewCreatePrivateKeyWallet',
    component: () => import('@/views/ViewCreatePrivateKeyWallet.vue'),
    meta: {
      title: "Create wallet from private key",
    }
  },
  {
    path: '/dashboard',
    name: 'ViewDashboard',
    component: () => import('@/views/ViewDashboard.vue'),
    meta: {
      title: "Dashboard",
    }
  },
  {
    path: '/delete-wallet-confirmed/:name',
    name: 'ViewDeleteConfirmation',
    props: true,
    component: () => import('@/views/ViewDeleteConfirmation.vue'),
    meta: {
      title: "Confirm remove wallet?",
    }
  },
  {
    path: '/view-all-accounts',
    name: 'ViewDisplayAllAccounts',
    props: true,
    component: () => import('@/views/ViewDisplayAllAccounts.vue'),
    meta: {
      title: "View all accounts",
    }
  },
  {
    path: '/select-type-creation-account',
    name: 'SelectTypeCreateAccount',
    props: true,
    component: () => import('@/views/ViewSelectTypeCreateAccount.vue'),
    meta: {
      title: "View all accounts",
    }
  },
  {
    path: '/create-account',
    name: 'ViewCreateAccount',
    component: () => import('@/views/ViewCreateAccount.vue'),
    meta: {
      title: "Create account",
    }
  },
  {
    path: '/created-account',
    name: 'createdAccount',
    props: true,
    component: () => import('@/views/ViewCreatedAccount.vue'),
    meta: {
      title: "Created account",
    }
  },
  {
    path: '/import-account',
    name: 'ViewCreateAccountPrivateKey',
    component: () => import('@/views/ViewCreateAccountPrivateKey.vue'),
    meta: {
      title: "Import account",
    }
  },
  {
    path: '/details-account/:address',
    name: 'ViewAccountDetails',
    props: true,
    component: () => import('@/views/ViewAccountDetails.vue'),
    meta: {
      title: "Account details",
    }
  },
  {
    path: '/delete-account/:name',
    name: 'ViewDeleteAccount',
    props: true,
    component: () => import('@/views/ViewDeleteAccount.vue'),
    meta: {
      title: "Delete account",
    }
  },
  {
    path: '/convert-account-multisign/:name?',
    name: 'ViewConvertAccountMultisig',
    props: true,
    component: () => import('@/views/ViewConvertAccountMultisig.vue'),
    meta: {
      title: "Convert to Multisig Account",
    }
  },
  {
    path: '/edit-account-multisign/:name',
    name: 'ViewEditAccountMultisig',
    props: true,
    component: () => import('@/views/ViewEditAccountMultisig.vue'),
    meta: {
      title: "Edit Multisig Account",
    }
  },
  {
    path: '/export-wallet',
    name: 'ViewExportWallet',
    component: () => import('@/views/ViewExportWallet.vue'),
    meta: {
      title: "Export wallet",
    }
  },
  {
    path: '/create-transfer',
    name: 'ViewCreateTransfer',
    component: () => import('@/views/ViewCreateTransfer.vue'),
    meta: {
      title: "Create Transfer",
    }
  },
  {
    path: '/add-contacts',
    name: 'ViewAddContacts',
    component: () => import('@/views/ViewAddContacts.vue'),
    meta: {
      title: "Add Contacts",
    }
  },
  {
    path: '/create-mosaic',
    name: 'ViewCreateMosaic',
    component: () => import('@/views/ViewCreateMosaic.vue'),
    meta: {
      title: "Add Contacts",
    }
  },
  {
    path: '/services',
    name: 'ViewAllServices',
    component: () => import('@/views/ViewAllServices.vue'),
    meta: {
      title: "Services",
    }
  },
  {
    path: '/address-book',
    name: 'ViewAddressBook',
    component: () => import('@/views/ViewAddressBook.vue'),
    meta: {
      title: "Address Book",
    }
  },
  {
    path: '/add-contacts',
    name: 'ViewAddContacts',
    component: () => import('@/views/ViewAddContacts.vue'),
    meta: {
      title: "Add Contacts",
    }
  },
  {
    path: '/nodes',
    name: 'ViewNodes',
    component: () => import('@/views/ViewNodes.vue'),
    meta: {
      title: "Nodes",
    }
  },
  {
    path: '/multisig-multi-level',
    name: 'ViewMultisigMultiLevel',
    component: () => import('@/views/ViewMultisigMultiLevel.vue'),
    meta: {
      title: "View All Multisig Accounts",
    }
  },
]
// createdAccount

const router = createRouter({
  history: createWebHashHistory(), //createWebHistory(process.env.BASE_URL),
  routes
})

export default router
