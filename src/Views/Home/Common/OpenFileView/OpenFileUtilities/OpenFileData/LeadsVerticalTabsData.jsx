import { LeadsSalesPermissions } from '../../../../../../Permissions/Sales/LeadsSalesPermissions';
import {
  LeadInformationComponent,
  LeadProfileUnitsComponent,
  LeadActivitiesComponent
} from '../../../../LeadsSalesView/LeadsSalesProfileManagementView/Sections';
import { LeadsLeasePermissions } from '../../../../../../Permissions/Lease/LeadsLeasePermissions';
import { LeadsCAllCenterPermissions } from '../../../../../../Permissions/CallCenter/LeadsCallCenterPermissions';
import { LeadsPermissions } from '../../../../../../Permissions';

export const LeadsVerticalTabsData = [
  {
    label: 'lead-information',
    component: LeadInformationComponent,
    permissionsList: [
      ...Object.values(LeadsSalesPermissions),
      ...Object.values(LeadsLeasePermissions),
      ...Object.values(LeadsCAllCenterPermissions),
    ],
    permissionsId: [
      LeadsSalesPermissions.ViewLeadDetails.permissionsId,
      LeadsLeasePermissions.ViewLeadDetails.permissionsId,
      LeadsCAllCenterPermissions.ViewLeadDetails.permissionsId,
    ],
  },
  {
    label: 'activities',
    component: LeadActivitiesComponent,
  },
  
  {
    label: 'matching',
    component: LeadProfileUnitsComponent,
    permissionsList: [
      ...Object.values(LeadsSalesPermissions),
      ...Object.values(LeadsLeasePermissions),
      ...Object.values(LeadsCAllCenterPermissions),
    ],
    permissionsId: [
      LeadsSalesPermissions.ViewMatchingUnits.permissionsId,
      LeadsLeasePermissions.ViewMatchingUnits.permissionsId,
      LeadsCAllCenterPermissions.ViewMatchingUnits.permissionsId,
    ],
  },
];

export const LeadsVerticalTabsData2 = [
  {
    label: 'lead-information',
    component: LeadInformationComponent,
    permissionsList: Object.values(LeadsPermissions),
    permissionsId: LeadsPermissions.ViewLeadDetails.permissionsId,
  },

  {
    label: 'activities',
    component: LeadActivitiesComponent,
  },
  {
    label: 'matching',
    component: LeadProfileUnitsComponent,
    permissionsList: Object.values(LeadsPermissions),
    permissionsId: LeadsPermissions.ViewMatchingUnits.permissionsId,
  },

];
