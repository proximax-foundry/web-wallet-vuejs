export const AddressbookRoutes = [
  {
    path: '/add-contacts',
    name: 'ViewServicesAddressBookAddContacts',
    component: () => import('@/modules/services/submodule/addressbook/views/ViewServicesAddressBookAddContacts.vue'),
    meta: {
      title: "Add Contacts",
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
      title: "Import Address Book",
    }
  },

  {
    path: '/export-contacts',
    name: 'ViewServicesAddressBookExport',
    component: () => import('@/modules/services/submodule/addressbook/views/ViewServicesAddressBookExport.vue'),
    meta: {
      title: "Export Address Book",
    }
  },
];

