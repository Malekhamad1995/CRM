import { TransactionsDetails, ContactDetails } from '../Sections';
import { LeasingTransactionsPermissions } from '../../../../../Permissions';

export const LeasingTransactionsDetailsTabs = [
  {
    label: 'transaction-details',
    component: TransactionsDetails,
    permissionsList: Object.values(LeasingTransactionsPermissions),
    permissionsId: LeasingTransactionsPermissions.ViewTransactionsDetails.permissionsId
  },
  {
    label: 'contact-details',
    component: ContactDetails,
    permissionsList: Object.values(LeasingTransactionsPermissions),
    permissionsId: LeasingTransactionsPermissions.ViewContactDetails.permissionsId
  },
];
