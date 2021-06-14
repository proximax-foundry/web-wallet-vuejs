export const AddressbookRoutes = [
  {
    path: '/add-contacts',
    name: 'ViewAddressBookAddContacts',
    component: () => import('@/modules/services/submodule/addressbook/views/ViewServicesAddressBookAddContacts.vue'),
    meta: {
      title: "Add Contacts",
    }
  },
  {
    path: '/address-book',
    name: 'ViewAddressBook',
    component: () => import('@/modules/services/submodule/addressbook/views/ViewServicesAddressBook.vue'),
    meta: {
      title: "Address Book",
    }
  },
];

