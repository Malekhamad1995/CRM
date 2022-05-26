import { UnitInvoicePaymentDue } from '../../../UnitsView/UnitsReservationView/Sections/UnitInvoicePaymentDue';
import {
  Details,
  ReferenceDetails,
  Earnings,
  ChequeRequestsView,
} from '../Sections';
import { LeasingTransactionsPermissions } from '../../../../../Permissions';

export const LeasingTransactionsProfileTabs = [
  {
    label: 'details',
    component: Details,
    permissionsList: Object.values(LeasingTransactionsPermissions),
    permissionsId: [LeasingTransactionsPermissions.ViewTransactionsDetails.permissionsId,
    LeasingTransactionsPermissions.ViewContactDetails.permissionsId]
  },
  {
    label: 'reference-details',
    component: ReferenceDetails,
    permissionsList: Object.values(LeasingTransactionsPermissions),
    permissionsId: LeasingTransactionsPermissions.ViewReferenceDetails.permissionsId
  },
  {
    label: 'earnings',
    component: Earnings,
    permissionsList: Object.values(LeasingTransactionsPermissions),
    permissionsId: LeasingTransactionsPermissions.ViewEarning.permissionsId
  },
  {
    label: 'invoices-payments-due',
    component: UnitInvoicePaymentDue,
    permissionsList: Object.values(LeasingTransactionsPermissions),
    permissionsId: LeasingTransactionsPermissions.ViewInvoicesInLeaseTransactions.permissionsId
  },
  {
    label: 'cheque-requests',
    component: ChequeRequestsView,
    permissionsList: Object.values(LeasingTransactionsPermissions),
    permissionsId: LeasingTransactionsPermissions.ViewChequeRequestDetails.permissionsId
  },
];
