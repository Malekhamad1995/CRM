import { UnitsSalesPermissions } from '../../../../../../Permissions';
import { UnitProfileSaleDetailsComponent } from '../../../../UnitsSalesView';
import { AgentInfoSaleRelatedComponent } from '../../../../UnitsSalesView/UnitsSalesStatusManagementView/Sections';
import { UnitInvoicePaymentDue } from '../../../../UnitsView/UnitsReservationView/Sections/UnitInvoicePaymentDue';
import { UnitRemindersCoponent } from '../../../../UnitsView/UnitsReservationView/Sections/UnitRemindersCoponent';
import { UnitSaleComponent } from '../../../../UnitsView/UnitsReservationView/Sections/UnitSaleComponent';

export const UnitReservationTabsData = {
  sale: [
    {
      label: 'sale',
      component: UnitSaleComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId:
        UnitsSalesPermissions.ViewSellerBuyerNamesForSoldReservedTransactions.permissionsId,
    },

    {
      label: 'details',
      component: UnitProfileSaleDetailsComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId:
        UnitsSalesPermissions.ViewPricingDetailsForSoldReservedTransactions.permissionsId,
      props: { isReadOnly: true },
    },

    {
      label: 'invoice-payments-due',
      component: UnitInvoicePaymentDue,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewInvoicesForSoldReservedTransactions.permissionsId,
    },

    {
      label: 'contact-details',
      component: AgentInfoSaleRelatedComponent,
      // permissionsList: Object.values(UnitsSalesPermissions),
      // permissionsId: UnitsSalesPermissions.ViewUnitDetails.permissionsId,
      props: { isReadOnly: true },
    },

    {
      label: 'reminders',
      component: UnitRemindersCoponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewRemindersOnSoldReservedTransactions.permissionsId,
    },
  ],
  rent: [
    { label: 'tenant' },
    { label: 'details' },
    { label: 'invoice-payments-due' },
    { label: 'contact-details' },
    { label: 'reminders' },
  ],
};
