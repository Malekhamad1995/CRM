import { HistoryComponent } from '../Sections/HistoryComponent/HistoryComponent';
import { UnitsSalesPermissions } from '../../../Permissions/Sales/UnitsSalesPermissions';
import { TransactionHistoryComponent } from '../Sections/TransactionHistoryComponent/TransactionHistoryComponent';

export const HistoryComponentTabs = [
  {
    label: 'history',
    component: HistoryComponent,
    permissionsList: Object.values(UnitsSalesPermissions),
    permissionsId: UnitsSalesPermissions.ViewUnitHistory.permissionsId,
  },
  { label: 'transaction-history', component: TransactionHistoryComponent },
];
