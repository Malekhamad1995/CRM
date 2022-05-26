import {
  PropertiesManagementView,
  PropertiesView,
  PropertiesProfileManagementView,
} from '../../Views/Home';

import { PropertiesPermissionsCRM } from '../../Permissions/PropertiesPermissions';

export const PropertiesCrmRoutes = [
  {
    path: '/view',
    name: 'PropertiesView:properties',
    component: PropertiesView,
    layout: '/home/Properties-CRM',
    default: true,
    isRoute: true,
    authorize: true,
    roles: Object.values(PropertiesPermissionsCRM),
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'PropertiesView:properties',
        isDisabled: false,
        route: '/home/Properties-CRM/view',
        groupName: 'crm',
      },
    ],
  },
  {
    path: '/add',
    name: 'homeLayout.propertiesManagementView.properties-management-view',
    component: PropertiesManagementView,
    layout: '/home/Properties-CRM',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'PropertiesView:properties',
        isDisabled: false,
        route: '/home/Properties-CRM/view',
        groupName: 'crm',
      },
      {
        name: 'homeLayout.propertiesManagementView.properties-management-view',
        isDisabled: true,
        route: '/home/propertiesadd',
      },
    ],
  },
  {
    path: '/edit',
    name: 'homeLayout.propertiesManagementView.properties-management-view',
    component: PropertiesManagementView,
    layout: '/home/Properties-CRM',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'PropertiesView:properties',
        isDisabled: false,
        route: '/home/Properties-CRM/view',
        groupName: 'crm',
      },
      {
        name: 'homeLayout.propertiesManagementView.properties-management-view',
        isDisabled: true,
        route: '/home/Properties-CRM/edit',
      },
    ],
  },
  {
    path: '/property-profile-edit',
    name: 'PropertiesProfileManagementView:property-profile-edit',
    component: PropertiesProfileManagementView,
    layout: '/home/Properties-CRM',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'PropertiesView:properties',
        isDisabled: false,
        route: '/home/Properties-CRM/view',
        groupName: 'crm',
      },
      {
        name: 'PropertiesProfileManagementView:property-profile-edit',
        isDisabled: true,
        route: '/home/Properties-CRM/property-profile-edit',
      },
    ],
  },
];
