export const AddressbookRoutes = [
  {
    path: '/add-contacts',
    name: 'ViewAddressBookAddContacts',
    component: () => import('@/modules/addressbook/views/ViewAddressBookAddContacts.vue'),
    meta: {
      title: "Add Contacts",
    }
  },
  {
    path: '/address-book',
    name: 'ViewAddressBook',
    component: () => import('@/modules/addressbook/views/ViewAddressBook.vue'),
    meta: {
      title: "Address Book",
    }
  },
];