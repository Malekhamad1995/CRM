import { ContactProfileManagementView, ContactsManagementView, ContactsView } from '../../Views/Home';

export const ContactsLeaseRoutes = [
  {
    path: '/view',
    name: 'ContactsView:contacts',
    component: ContactsView,
    layout: '/home/contact-lease',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'ContactsView:contacts',
        isDisabled: false,
        route: '/home/contact-lease/view',
        groupName: 'leasing',
      },
    ],
  },
  {
    path: '/add',
    name: 'homeLayout.contactsManagementView.contacts-management-view',
    component: ContactsManagementView,
    layout: '/home/contact-lease',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'ContactsView:contacts',
        isDisabled: false,
        route: '/home/contact-lease/view',
        groupName: 'leasing',
      },
      {
        name: 'homeLayout.contactsManagementView.contacts-management-view',
        isDisabled: true,
        route: '/home/contact-lease/add',
      },
    ],
  },
  {
    path: '/contact-profile-edit',
    name: 'ContactProfileManagementView:contact-profile-edit',
    component: ContactProfileManagementView,
    layout: '/home/contact-lease',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'ContactsView:contacts',
        isDisabled: false,
        route: '/home/contact-lease/view',
        groupName: 'leasing',
      },
      {
        name: 'ContactProfileManagementView:contact-profile-edit',
        isDisabled: true,
        route: '/home/contact-lease/contact-profile-edit',
      },
    ],
  },
  {
    path: '/contact-profile-add',
    name: 'ContactProfileManagementView:contact-profile-add',
    component: ContactProfileManagementView,
    layout: '/home/contact-lease',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'ContactsView:contacts',
        isDisabled: false,
        route: '/home/contact-lease/view',
        groupName: 'leasing',
      },
      {
        name: 'ContactProfileManagementView:contact-profile-add',
        isDisabled: true,
        route: '/home/contact-lease/contact-profile-add',
      },
    ],
  },
  {
    path: '/edit',
    name: 'homeLayout.contactsManagementView.contacts-management-view',
    component: ContactsManagementView,
    layout: '/home/contact-lease',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'ContactsView:contacts',
        isDisabled: false,
        route: '/home/contact-lease/view',
        groupName: 'leasing',
      },
      {
        name: 'homeLayout.contactsManagementView.contacts-management-view',
        isDisabled: true,
        route: '/home/contact-lease/edit',
      },
    ],
  },
];
