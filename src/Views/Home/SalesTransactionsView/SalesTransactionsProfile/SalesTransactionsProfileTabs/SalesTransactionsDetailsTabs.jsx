import { TransactionsDetails, ContactDetails } from '../Sections';
import { SalesTransactionsPermissions } from '../../../../../Permissions';

export const SalesTransactionsDetailsTabsData = [
  {
    label: 'transaction-details',
    component: TransactionsDetails,
    permissionsList: Object.values(SalesTransactionsPermissions),
    permissionsId: SalesTransactionsPermissions.ViewTransactionsDetails.permissionsId
  },
  {
    label: 'contact-details',
    component: ContactDetails,
    permissionsList: Object.values(SalesTransactionsPermissions),
    permissionsId: SalesTransactionsPermissions.ViewContactDetails.permissionsId
  },
];
