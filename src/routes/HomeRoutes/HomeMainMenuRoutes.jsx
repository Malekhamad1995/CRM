// import { PermissionsExtract } from '../../Helper';
// import {
//   // FormBuilderPermissions,
//   // LookupItemPermissions,
//   // LookupTypePermissions,
//   ContactsPermissions,
//   PropertiesPermissions,
//   UnitPermissions,
// } from '../../Permissions';

import {
  LeadsSalesPermissions,
  UnitsSalesPermissions,
  ActivitiesSalesPermissions,
} from '../../Permissions/Sales';
import { ContactsPermissions, ReportsPermissions } from '../../Permissions/CRM';
import { PropertiesPermissionsCRM } from '../../Permissions/PropertiesPermissions';
import {
  UnitsLeasePermissions,
  LeadsLeasePermissions,
  ActivitiesLeasePermissions,
} from '../../Permissions/Lease';
import {
  LeadsCAllCenterPermissions,
  ActivitiesCallCenterPermissions,
  QACallCenterPermissions
} from '../../Permissions/CallCenter';
import {
  PropertyManagementListPermissions,
  UnitPermissions,
  PortfolioPermissions,
  OrdersPermissions,
  OperatingCostsPermissions,
  MaintenanceContractsPermissions,
  LeadsPermissions,
  IncidentsPermissions,
  AssetsPermissions,
  ActivitesPermissions,
  WorkOrdersPermissions,
  UserLoginPermissions,
  BusinessGroupsPermissions,
  TeamPermissions,
  RolesPermissions,
  ImageGalleryPermissions,
  LocationsPermissions,
  AdminDashboardPermissions , 
  TeamLeadDashboardPermissions , 
  AgentDashboardPermissions , 
  BranchesPermissions , 
} from '../../Permissions';
import {
  SalesTransactionsPermissions,
  LeasingTransactionsPermissions,
  InvoicesPermissions,
} from '../../Permissions/Accounts';

import { AgentsPermissions, RotationSchemaPermissions } from '../../Permissions/AgentManagementPermissions';
import {
  LookupsPermissions,
  ActivityTypePermissions,
  TemplatesPermissions,
  FormBuilderPermissions
} from '../../Permissions/SystemParametersPermissions';

import { ExceptionPermissionsHelper } from '../../Helper/ExceptionPermissions.Helper' ; 

let contactExceptionPermission = ExceptionPermissionsHelper() || false;


export const MainMenu = [
  {
    groupId: 1,
    order: 1,
    description: '',
   // routerLink: '/home',
   // routerLinkActiveOptions: { exact: true },
    icon: 'mdi mdi-home-outline c-blue',
    iconActive: 'mdi mdi-home-outline c-white',
    isDisabled: false,
    roles: [
      ...Object.values(AdminDashboardPermissions) ,
      ...Object.values(TeamLeadDashboardPermissions) ,
      ...Object.values(AgentDashboardPermissions),
    ],
    name: 'dashboard',
  },
  {
    groupId: 6,
    order: 3,
    description: '',
    icon: 'mdi mdi-chart-bar-stacked c-blue-lighter',
    iconActive: 'mdi mdi-chart-bar-stacked c-white',
    isDisabled: false,
    roles: [
      ...Object.values(UnitsSalesPermissions),
      ...Object.values(LeadsSalesPermissions),
      ...Object.values(ActivitiesSalesPermissions),
    ],
    name: 'sales',
  },
  {
    groupId: 7,
    order: 4,
    description: '',
    icon: 'mdi mdi-home-import-outline c-blue-lighter',
    iconActive: 'mdi mdi-home-import-outline c-white',
    isDisabled: false,
    roles: [
      ...Object.values(UnitsLeasePermissions),
      ...Object.values(LeadsLeasePermissions),
      ...Object.values(ActivitiesLeasePermissions),
    ],
    name: 'leasing',
  },
  {
    groupId: 2,
    order: 5,
    description: '',
    icon: 'mdi mdi-account-multiple-outline c-blue-lighter',
    iconActive: 'mdi mdi-account-multiple-outline c-white',
    isDisabled: false,
    roles: [
      ...Object.values(LeadsCAllCenterPermissions),
      ...Object.values(ActivitiesCallCenterPermissions),
      ...Object.values(QACallCenterPermissions)
    ],
    name: 'call-center',
  },
  {
    groupId: 4,
    order: 11,
    description: '',
    icon: 'mdi mdi-cog-outline c-blue-lighter',
    iconActive: 'mdi mdi-cog-outline c-white',
    isDisabled: false,
    roles: [
      ...Object.values(UserLoginPermissions),
      ...Object.values(BusinessGroupsPermissions),
      ...Object.values(TeamPermissions),
      ...Object.values(RolesPermissions),
      ...Object.values(BranchesPermissions)
    ],
    name: 'system-admin',
  },
  {
    groupId: 11,
    order: 6,
    description: '',
    icon: 'mdi mdi-home-city-outline c-blue-lighter',
    iconActive: 'mdi mdi-home-city-outline c-white',
    isDisabled: false,
    roles: [
      ...Object.values(PropertyManagementListPermissions),
      ...Object.values(UnitPermissions),
      ...Object.values(PortfolioPermissions),
      ...Object.values(OrdersPermissions),
      ...Object.values(WorkOrdersPermissions),
      ...Object.values(OperatingCostsPermissions),
      ...Object.values(MaintenanceContractsPermissions),
      ...Object.values(LeadsPermissions),
      ...Object.values(IncidentsPermissions),
      ...Object.values(AssetsPermissions),
      ...Object.values(ActivitesPermissions),
    ],
    name: 'property-management',
  },
  {
    groupId: 12,
    order: 7,
    description: '',
    icon: 'mdi mdi-book-account-outline c-blue-lighter',
    iconActive: 'mdi mdi-book-account-outline c-white',
    isDisabled: false,
    roles: [
      ...Object.values(SalesTransactionsPermissions),
      ...Object.values(LeasingTransactionsPermissions),
      ...Object.values(InvoicesPermissions),
    ],
    name: 'accounts',
  },
  // {
  //   groupId: 13,
  //   order: 6,
  //   description: "",
  //   icon: "mdi mdi-newspaper-variant-multiple c-blue-lighter",
  //   iconActive: "mdi mdi-newspaper-variant-multiple c-white",
  //   isDisabled: false,
  //   roles: [],
  //   name: "TemplatesView:templates",
  // },
  {
    groupId: 15,
    order: 2,
    description: '',
    icon: 'mdi mdi-headphones c-blue-lighter',
    iconActive: 'mdi mdi-headphones c-white',
    isDisabled: false,
    roles : contactExceptionPermission  ?  [...Object.values(PropertiesPermissionsCRM), ...Object.values(ReportsPermissions)]: [...Object.values(ContactsPermissions), ...Object.values(PropertiesPermissionsCRM), ...Object.values(ReportsPermissions)],
    name: 'crm',
  },
  // {
  //   groupId: 14,
  //   order: 6,
  //   description: '',
  //   icon: 'mdi mdi-account-multiple-outline c-blue-lighter',
  //   iconActive: 'mdi mdi-account-multiple-outline c-white',
  //   isDisabled: false,
  //   roles: [],
  //   name: 'my-lead',
  // },
  {
    groupId: 16,
    order: 10,
    description: '',
    icon: 'mdi mdi-view-list-outline c-blue-lighter',
    iconActive: 'mdi mdi-view-list-outline c-white',
    isDisabled: false,
    roles: [
      ...Object.values(LookupsPermissions),
      ...Object.values(ActivityTypePermissions),
      ...Object.values(TemplatesPermissions),
      ...Object.values(FormBuilderPermissions),
    ],
    name: 'system-parameters',
  },
  {
    groupId: 17,
    order: 9,
    description: '',
    icon: 'mdi mdi-tooltip-image-outline c-blue-lighter',
    iconActive: 'mdi mdi-tooltip-image-outline c-white',
    isDisabled: false,
    roles: [...Object.values(ImageGalleryPermissions)],
    name: 'images-gallery',
  },
  {
    groupId: 18,
    order: 5,
    description: '',
    icon: 'mdi mdi-account-tie c-blue-lighter',
    iconActive: 'mdi mdi-account-tie c-white',
    isDisabled: false,
    roles: [
      ...Object.values(AgentsPermissions),
      ...Object.values(RotationSchemaPermissions),
    ],
    name: 'agent-management',
  },
  {
    groupId: 19,
    order: 8,
    description: '',
    icon: 'mdi mdi-google-maps c-blue-lighter',
    iconActive: 'mdi mdi-google-maps c-white',
    isDisabled: false,
    roles: [
      ...Object.values(LocationsPermissions),
    ],
    name: 'LocationView:locations',
  },
];
