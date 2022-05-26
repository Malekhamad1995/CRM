import { PropertiesPermissionsCRM, PropertyManagementListPermissions } from '../../../../../../Permissions';
import {
  PropertiesFinanceCompanyComponent,
  PropertiesDocumentsComponent,
  PropertiesProfileMarketingComponent,
  PropertiesProfileSpecificationComponent,
  PropertiesProfileMapComponent,
  PropertiesProfileImagesComponent,
  PropertiesInformationComponent,
  OperatingCostsViewComponent,
  PropertiesUnitComponent
} from '../../../../PropertiesView/PropertiesProfileManagementView/Sections';

export const PropertiesVerticalTabsData = [
  {
    label: 'Property-info',
    component: PropertiesInformationComponent,
    permissionsList: Object.values(PropertiesPermissionsCRM),
    permissionsId: PropertiesPermissionsCRM.ViewPropertyDetails.permissionsId,
  },
  {
    label: 'Unit',
    component: PropertiesUnitComponent,
    permissionsList: Object.values(PropertiesPermissionsCRM),

  },
  {
    label: 'Images',
    component: PropertiesProfileImagesComponent,
    permissionsList: Object.values(PropertiesPermissionsCRM),
    permissionsId: PropertiesPermissionsCRM.ViewPropertyImages.permissionsId,
  },
  {
    label: 'Finance-Company',
    component: PropertiesFinanceCompanyComponent,
    permissionsList: Object.values(PropertiesPermissionsCRM),
    permissionsId: PropertiesPermissionsCRM.ViewFinancialCompany.permissionsId,
  },
  {
    label: 'marketing',
    component: PropertiesProfileMarketingComponent,
    permissionsList: Object.values(PropertiesPermissionsCRM),
    permissionsId: PropertiesPermissionsCRM.ViewPropertyMarketingInfo.permissionsId,
  },
  {
    label: 'Specification',
    component: PropertiesProfileSpecificationComponent,
    permissionsList: Object.values(PropertiesPermissionsCRM),
    permissionsId: PropertiesPermissionsCRM.ViewPropertySpecifications.permissionsId,
  },
  {
    label: 'Map',
    component: PropertiesProfileMapComponent,
    permissionsList: Object.values(PropertiesPermissionsCRM),
    permissionsId: PropertiesPermissionsCRM.ViewPropertyLocationonMap.permissionsId,
  },
  {
    label: 'Documents',
    component: PropertiesDocumentsComponent,
    permissionsList: Object.values(PropertiesPermissionsCRM),
    permissionsId: PropertiesPermissionsCRM.ViewPropertyDocuments.permissionsId,
  },
  {
    label: 'operating-costs',
    component: OperatingCostsViewComponent,
    permissionsList: Object.values(PropertiesPermissionsCRM),
    permissionsId: PropertiesPermissionsCRM.ViewOperatingCostRecordsForProperty.permissionsId,
  },
];

export const PropertiesVerticalTabsData2 = [
  {
    label: 'Property-info',
    component: PropertiesInformationComponent,
    permissionsList: Object.values(PropertyManagementListPermissions),
    permissionsId: PropertyManagementListPermissions.ViewPropertyDetails.permissionsId,

  },
  {
    label: 'Unit',
    component: PropertiesUnitComponent,
        permissionsList: Object.values(PropertyManagementListPermissions)

  },
  {
    label: 'Images',
    component: PropertiesProfileImagesComponent,
    permissionsList: Object.values(PropertyManagementListPermissions),
    permissionsId: PropertyManagementListPermissions.ViewPropertyImageLocation.permissionsId,
  },
  {
    label: 'Finance-Company',
    component: PropertiesFinanceCompanyComponent,
    permissionsList: Object.values(PropertyManagementListPermissions),
    permissionsId: PropertyManagementListPermissions.ViewAllCompanyFinance.permissionsId,
  },
  {
    label: 'marketing',
    component: PropertiesProfileMarketingComponent,
    permissionsList: Object.values(PropertyManagementListPermissions),
    permissionsId: PropertyManagementListPermissions.ViewPropertyMarketingDetails.permissionsId,
  },
  {
    label: 'Specification',
    component: PropertiesProfileSpecificationComponent,
    permissionsList: Object.values(PropertyManagementListPermissions),
    permissionsId: PropertyManagementListPermissions.ViewPropertySpecificationDetails.permissionsId,

  },
  {
    label: 'Map',
    component: PropertiesProfileMapComponent,

  },
  {
    label: 'Documents',
    component: PropertiesDocumentsComponent

  },
  {
    label: 'operating-costs',
    component: OperatingCostsViewComponent,
    permissionsList: Object.values(PropertyManagementListPermissions),
    permissionsId: PropertyManagementListPermissions.ViewOperatingCostDetails.permissionsId,
  },
];
