import { UnitPermissions } from '../../../../../../Permissions';
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
} from '../../../../UnitsLeaseView/UnitsLeaseProfileManagementView/Sections';
import { Marketing } from '../../../../UnitsSalesView/UnitsSalesProfileManagement/Sections/Marketing/Marketing';

import {
    UnitProfileReferanceDetailsComponent,
    UnitParkingComponent,
} from '../../../../UnitsView/UnitsProfileManagementView/Sections';

export const UnitsVerticalTabsDataUnitsPropertyManagement = [
    {
        label: 'unit-details',
        component: LeaseUnitInformationComponent,
        permissionsList: Object.values(UnitPermissions),
        permissionsId: UnitPermissions.ViewUnitDetails.permissionsId,
    },
    {
        label: 'parking',
        component: UnitParkingComponent,
        permissionsList: Object.values(UnitPermissions),
        permissionsId: UnitPermissions.ViewParkingInfoForUnit.permissionsId,
    },
    {
        label: 'images',
        component: LeaseUnitProfileImagesComponent,
        permissionsList: Object.values(UnitPermissions),
        permissionsId: UnitPermissions.ViewUnitImages.permissionsId,
    },
    {
        label: 'map',
        component: LeaseUnitProfileMapComponent,
        permissionsList: Object.values(UnitPermissions),
        permissionsId: UnitPermissions.ViewUnitLocationOnMap.permissionsId,
    },
    {
        label: 'documents',
        component: LeaseUnitProfileDocumentsComponent,
        permissionsList: Object.values(UnitPermissions),
        permissionsId: UnitPermissions.ViewDocumentsForUnit.permissionsId,
    },
    {
        label: 'remarks',
        component: LeaseUnitProfileRemarksComponent,
        permissionsList: Object.values(UnitPermissions),
        permissionsId: UnitPermissions.ViewRemarksForUnit.permissionsId,
    },
    {
        label: 'open-house',
        component: LeaseUnitProfileOpenHouseComponent,
        permissionsList: Object.values(UnitPermissions),
        permissionsId: UnitPermissions.ViewOpenHouseForUnit.permissionsId,
    },
    {
        label: 'activities',
        component: LeaseUnitProfileActivitiesComponent,
        permissionsList: Object.values(UnitPermissions),
        permissionsId: UnitPermissions.ViewTheActivitiesForUnit.permissionsId,
    },
    {
        label: 'payment-details',
        component: LeaseUnitProfilePaymentDetailsComponent,
        permissionsList: Object.values(UnitPermissions),
        permissionsId: UnitPermissions.ViewPaymentDetailsForUnit.permissionsId,
    },
    {
        label: 'marketing',
        component: Marketing,
        permissionsList: Object.values(UnitPermissions),
        permissionsId: UnitPermissions.ViewUnitMarketingInfo.permissionsId,
    },
    {
        label: 'management',
        component: LeaseUnitProfileManagementComponent,
        // permissionsList: Object.values(UnitPermissions),
        // permissionsId: UnitPermissions.ViewManagemntForUnit.permissionsId,
    },
    {
        label: 'refernce-details',
        component: UnitProfileReferanceDetailsComponent,
        permissionsList: Object.values(UnitPermissions),
        permissionsId: UnitPermissions.ViewReferenceDetailsForUnit.permissionsId,
    },
    {
        label: 'payables',
        component: LeaseUnitProfilePayablesComponent,
        // permissionsList: Object.values(UnitPermissions),
        // permissionsId: UnitPermissions.ViewPayablesForUnit.permissionsId,
    }
];
