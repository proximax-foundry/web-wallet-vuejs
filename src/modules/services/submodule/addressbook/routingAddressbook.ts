export const AddressbookRoutes = [
  {
    path: '/add-contact',
    name: 'ViewServicesAddressBookAddContact',
    component: () => import('@/modules/services/submodule/addressbook/views/ViewServicesAddressBookAddContact.vue'),
    meta: {
      title: "Add Contact",
    }
  },

  {
    path: '/edit-contact/:contactAddress/:contactPublicKey',
    name: 'ViewServicesAddressBookEditContact',
    props: true,
    component: () => import('@/modules/services/submodule/addressbook/views/ViewServicesAddressBookEditContact.vue'),
    meta: {
      title: "Edit Contact",
    }
  },

  {
    path: '/address-book',
    name: 'ViewServicesAddressBook',
    component: () => import('@/modules/services/submodule/addressbook/views/ViewServicesAddressBook.vue'),
    meta: {
      title: "Address Book",
    }
  },

  {
    path: '/import-contacts',
    name: 'ViewServicesAddressBookImport',
    component: () => import('@/modules/services/submodule/addressbook/views/ViewServicesAddressBookImport.vue'),
    meta: {
      title: "Import Backup Address Book",
    }
  },

  {
    path: '/import-contacts-account',
    name: 'ViewServicesAddressBookImportAccount',
    component: () => import('@/modules/services/submodule/addressbook/views/ViewServicesAddressBookImportAccount.vue'),
    meta: {
      title: "Import Account Address Book",
    }
  },

  {
    path: '/export-contacts',
    name: 'ViewServicesAddressBookExport',
    component: () => import('@/modules/services/submodule/addressbook/views/ViewServicesAddressBookExport.vue'),
    meta: {
      title: "Export Group Address Book",
    }
  },
  {
    path: '/export-contacts-select',
    name: 'ViewServicesAddressBookExportSelect',
    component: () => import('@/modules/services/submodule/addressbook/views/ViewServicesAddressBookExportSelect.vue'),
    meta: {
      title: "Export Select Address Book",
    }
  }
];

