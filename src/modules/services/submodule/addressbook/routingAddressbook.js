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
];

