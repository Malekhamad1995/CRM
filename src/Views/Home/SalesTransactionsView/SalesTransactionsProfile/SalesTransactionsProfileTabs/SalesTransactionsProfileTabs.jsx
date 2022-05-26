import { UnitInvoicePaymentDue } from '../../../UnitsView/UnitsReservationView/Sections/UnitInvoicePaymentDue';
import {
  Details,
  ReferenceDetails,
  Earnings,
  Documents,
  ChequeRequestsView,
} from '../Sections';

import { SalesTransactionsPermissions } from '../../../../../Permissions';

export const SalesTransactionsProfileTabsData = [
  {
    label: 'details',
    component: Details,
    permissionsList: Object.values(SalesTransactionsPermissions),
    permissionsId: (SalesTransactionsPermissions.ViewTransactionsDetails.permissionsId,
      SalesTransactionsPermissions.ViewContactDetails.permissionsId)
  },
  {
    label: 'reference-details',
    component: ReferenceDetails,
    permissionsList: Object.values(SalesTransactionsPermissions),
    permissionsId: SalesTransactionsPermissions.ViewReferenceDetails.permissionsId
  },
  {
    label: 'earnings',
    component: Earnings,
    permissionsList: Object.values(SalesTransactionsPermissions),
    permissionsId: SalesTransactionsPermissions.ViewEarning.permissionsId
  },
  {
    label: 'invoices-payments-due',
    component: UnitInvoicePaymentDue,
    permissionsList: Object.values(SalesTransactionsPermissions),
    permissionsId: SalesTransactionsPermissions.ViewInvoicesInSalesTransactions.permissionsId
  },
  {
    label: 'cheque-requests',
    component: ChequeRequestsView,
    permissionsList: Object.values(SalesTransactionsPermissions),
    permissionsId: SalesTransactionsPermissions.ViewChequeRequestDetails.permissionsId
  },
  {
    label: 'documents',
    component: Documents,
    permissionsList: Object.values(SalesTransactionsPermissions),
    permissionsId: SalesTransactionsPermissions.ViewDecumentInSalesTransactions.permissionsId
  },
];
