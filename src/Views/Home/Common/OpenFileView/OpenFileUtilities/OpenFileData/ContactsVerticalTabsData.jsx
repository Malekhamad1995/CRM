import { ContactsPermissions } from '../../../../../../Permissions';
import {
  AssociatedContactsComponent,
  ContactProfileActivitiesComponent,
  ContactProfileDocumentsComponent,
  ContactProfileLeadsComponent,
  ContactProfileMaintenanceComponent,
  ContactProfileTransactionsComponent,
  ContactProfileUnitsComponent,
  ContactProfileUserAccessComponent,
  ContactsInformationComponent,
  DuplicatesContactsComponent,
} from '../../../../ContactsView';

export const ContactsVerticalTabsData = [
  {
    label: 'contact-information',
    component: ContactsInformationComponent,
    permissionsList: Object.values(ContactsPermissions),
    permissionsId: ContactsPermissions.ViewContactInformation.permissionsId,
  },
  {
    label: 'associated-contacts',
    component: AssociatedContactsComponent,
    permissionsList: Object.values(ContactsPermissions),
    permissionsId: ContactsPermissions.ViewAssociatedContacts.permissionsId,
  },

  {
    label: 'leads',
    component: ContactProfileLeadsComponent,
    permissionsList: Object.values(ContactsPermissions),
    permissionsId: ContactsPermissions.ViewLeads.permissionsId,
  },
  {
    label: 'units',
    component: ContactProfileUnitsComponent,
    permissionsList: Object.values(ContactsPermissions),
    permissionsId: ContactsPermissions.ViewUnit.permissionsId,
  },
  {
    label: 'activities',
    component: ContactProfileActivitiesComponent,
    permissionsList: Object.values(ContactsPermissions),
    permissionsId: ContactsPermissions.ViewActivity.permissionsId,
  },
  {
    label: 'documents',
    component: ContactProfileDocumentsComponent,
    permissionsList: Object.values(ContactsPermissions),
    permissionsId: ContactsPermissions.ViewDocuments.permissionsId,
  },
  {
    label: 'transactions-history',
    component: ContactProfileTransactionsComponent,
    permissionsList: Object.values(ContactsPermissions),
    permissionsId: ContactsPermissions.ViewUnitHistoryTransaction.permissionsId,
  },
  {
    label: 'assigned-agents',
    component: ContactProfileUserAccessComponent,
    permissionsList: Object.values(ContactsPermissions),
    permissionsId: ContactsPermissions.ViewUsersAccessOnContact.permissionsId,
  },
  {
    label: 'duplicates',
    component: DuplicatesContactsComponent,
    permissionsList: Object.values(ContactsPermissions),
    permissionsId: ContactsPermissions.ViewDuplicateForThisContact.permissionsId,
  },
  { label: 'maintenance-services', component: ContactProfileMaintenanceComponent },
];
