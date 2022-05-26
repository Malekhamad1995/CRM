import { UnitsSalesPermissions } from '../../../../../../Permissions';
import {
  UnitInformationComponent,
  UnitProfileImagesComponent,
  UnitProfileMapComponent,
  UnitProfileDocumentsComponent,
  UnitProfileRemarksComponent,
  UnitProfileOpenHouseComponent,
  UnitProfileActivitiesComponent,
  UnitProfileSaleDetailsComponent,
  UnitProfileBuyerSummaryComponent,
  UnitProfilePaymentPlanComponent,
  OwnersUnit
} from '../../../../UnitsSalesView';
import { Marketing } from '../../../../UnitsSalesView/UnitsSalesProfileManagement/Sections/Marketing/Marketing';

import {
  UnitProfileReferanceDetailsComponent,
  UnitParkingComponent,
} from '../../../../UnitsView/UnitsProfileManagementView/Sections';
import {
  UnitInformationComponent as LeaseUnitInformationComponent,
  UnitProfileImagesComponent as LeaseUnitProfileImagesComponent,
  UnitProfileMapComponent as LeaseUnitProfileMapComponent,
  UnitProfileDocumentsComponent as LeaseUnitProfileDocumentsComponent,
  UnitProfileRemarksComponent as LeaseUnitProfileRemarksComponent,
  UnitProfileOpenHouseComponent as LeaseUnitProfileOpenHouseComponent,
  UnitProfileActivitiesComponent as LeaseUnitProfileActivitiesComponent,
  UnitProfilePaymentDetailsComponent as LeaseUnitProfilePaymentDetailsComponent,
  UnitProfileManagementComponent as LeaseUnitProfileManagementComponent,
  UnitProfilePayablesComponent as LeaseUnitProfilePayablesComponent,
  OwnersUnit as LeaseUnitProfileOwnersComponent,
} from '../../../../UnitsLeaseView/UnitsLeaseProfileManagementView/Sections';

import { UnitsLeasePermissions } from '../../../../../../Permissions/Lease/UnitsLeasePermissions';

export const UnitsVerticalTabsData = {
  rent: [
    {
      label: 'unit-details',
      component: LeaseUnitInformationComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewUnitDetails.permissionsId,
    },
    {
      label: 'parking',
      component: UnitParkingComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewParkingInfoForUnit.permissionsId,
    },
    {
      label: 'images',
      component: LeaseUnitProfileImagesComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewUnitImages.permissionsId,
    },
    {
      label: 'map',
      component: LeaseUnitProfileMapComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewUnitLocationOnMap.permissionsId,
    },
    {
      label: 'documents',
      component: LeaseUnitProfileDocumentsComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewDocumentsForUnit.permissionsId,
    },
    {
      label: 'remarks',
      component: LeaseUnitProfileRemarksComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewRemarksForUnit.permissionsId,
    },
    {
      label: 'open-house',
      component: LeaseUnitProfileOpenHouseComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewOpenHouseForUnit.permissionsId,
    },
    {
      label: 'activities',
      component: LeaseUnitProfileActivitiesComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewTheActivitiesForUnit.permissionsId,
    },
    {
      label: 'lease-details',
      component: LeaseUnitProfilePaymentDetailsComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewPaymentDetailsForUnit.permissionsId,
    },
    {
      label: 'marketing',
      component: Marketing,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewUnitMarketingInfo.permissionsId,
    },
    {
      label: 'management',
      component: LeaseUnitProfileManagementComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewManagemntForUnit.permissionsId,
    },
    {
      label: 'refernce-details',
      component: UnitProfileReferanceDetailsComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewReferenceDetailsForUnit.permissionsId,
    },
    {
      label: 'payables',
      component: LeaseUnitProfilePayablesComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.ViewPayablesForUnit.permissionsId,
    },
    {
      label: 'owners',
      component: LeaseUnitProfileOwnersComponent,
      permissionsList: Object.values(UnitsLeasePermissions),
      permissionsId: UnitsLeasePermissions.GetAllOwnersByUnitId.permissionsId,
    },
  ],
  sale: [
    {
      label: 'unit-details',
      component: UnitInformationComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewUnitDetails.permissionsId,
    },
    {
      label: 'parking',
      component: UnitParkingComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewParkingInfoForUnit.permissionsId,
    },
    {
      label: 'map',
      component: UnitProfileMapComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewUnitLocationOnMap.permissionsId,
    },
    {
      label: 'images',
      component: UnitProfileImagesComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewUnitImages.permissionsId,
    },
    {
      label: 'documents',
      component: UnitProfileDocumentsComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewDocumentsForUnit.permissionsId,
    },

    {
      label: 'remarks',
      component: UnitProfileRemarksComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewRemarksForUnit.permissionsId,
    },
    {
      label: 'marketing',
      component: Marketing,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewUnitMarketingInfo.permissionsId,
    },
    {
      label: 'activities',
      component: UnitProfileActivitiesComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewTheActivitiesForUnit.permissionsId,
    },
    {
      label: 'sales-details',
      component: UnitProfileSaleDetailsComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewSaleDetailsForUnit.permissionsId,
    },
    {
      label: 'buyer-summary',
      component: UnitProfileBuyerSummaryComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewBuyerSummaryForUnit.permissionsId,
    },
    {
      label: 'refernce-details',
      component: UnitProfileReferanceDetailsComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewReferenceDetailsForUnit.permissionsId,
    },
    {
      label: 'payment-plans',
      component: UnitProfilePaymentPlanComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewPaymentPlansForUnit.permissionsId,
    },
    {
      label: 'open-house',
      component: UnitProfileOpenHouseComponent,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.ViewOpenHouseForUnit.permissionsId,
    },
    {
      label: 'owners',
      component: OwnersUnit,
      permissionsList: Object.values(UnitsSalesPermissions),
      permissionsId: UnitsSalesPermissions.GetAllOwnersByUnitId.permissionsId,
    },
  ],
};
