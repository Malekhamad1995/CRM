// import {
//   ContactsView,
//   ContactsManagementView,
//   ContactProfileManagementView,
//   ContactsMergeView,
// } from '../../Views/Home';
// import { ContactsPermissions } from '../../Permissions';

import { ContactsPermissions } from '../../Permissions/CRM';
import {
  ContactProfileManagementView,
  ContactsManagementView,
  ContactsMergeView,
  ContactsView,
} from '../../Views/Home';

export const ContactsCrmRoutes = [
  {
    path: '/add',
    name: 'homeLayout.contactsManagementView.Contacts-CRM',
    component: ContactsManagementView,
    layout: '/home/Contacts-CRM',
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
        route: '/home/Contacts-CRM/view',
        groupName: 'crm',
      },
      {
        name: 'homeLayout.contactsManagementView.contacts-management-view',
        isDisabled: true,
        route: '/home/Contacts-CRM/add',
      },
    ],
  },
  {
    path: '/contact-profile-edit',
    name: 'ContactProfileManagementView:contact-profile-edit',
    component: ContactProfileManagementView,
    layout: '/home/Contacts-CRM',
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
        route: '/home/Contacts-CRM/view',
        groupName: 'crm',
      },
      {
        name: 'ContactProfileManagementView:contact-profile-edit',
        isDisabled: true,
        route: '/home/Contacts-CRM/contact-profile-edit',
      },
    ],
  },
  {
    path: '/contact-profile-add',
    name: 'ContactProfileManagementView:contact-profile-add',
    component: ContactProfileManagementView,
    layout: '/home/Contacts-CRM',
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
        route: '/home/Contacts-CRM/view',
        groupName: 'crm',
      },
      {
        name: 'ContactProfileManagementView:contact-profile-add',
        isDisabled: true,
        route: '/home/Contacts-CRM/contact-profile-add',
      },
    ],
  },
  {
    path: '/edit',
    name: 'homeLayout.contactsManagementView.contacts-management-view',
    component: ContactsManagementView,
    layout: '/home/Contacts-CRM',
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
        route: '/home/Contacts-CRM/view',
        groupName: 'crm',
      },
      {
        name: 'homeLayout.contactsManagementView.contacts-management-view',
        isDisabled: true,
        route: '/home/Contacts-CRM/edit',
      },
    ],
  },
  {
    path: '/view',
    name: 'ContactsView:contacts',
    component: ContactsView,
    layout: '/home/Contacts-CRM',
    default: true,
    isRoute: true,
    authorize: true,
    roles: Object.values(ContactsPermissions),
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'ContactsView:contacts',
        isDisabled: false,
        route: '/home/Contacts-CRM/view',
        groupName: 'crm',
      },
    ],
  },
  {
    path: '/merge',
    name: 'ContactsView:contacts',
    component: ContactsMergeView,
    layout: '/home/Contacts-CRM',
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
        route: '/home/Contacts-CRM/view',
        groupName: 'crm',
      },
      {
        name: 'homeLayout.contactsManagementView.merge-contacts',
        isDisabled: true,
        route: '/home/Contacts-CRM/merge',
      },
    ],
  },
];
