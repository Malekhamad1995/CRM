import {
  LeadsSalesView,
  LeadsSalesManagementView,
  LeadsSalesProfileManagementView,
  LeadsSalesMergeView,
} from '../../Views/Home';

import { LeadsSalesPermissions } from '../../Permissions/Sales/LeadsSalesPermissions';


export const LeadsSalesRoutes = [
  {
    path: '/add',
    name: 'homeLayout.leadsManagementView.leads-management-view',
    component: LeadsSalesManagementView,
    layout: '/home/lead-sales',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LeadsView:leads',
        isDisabled: false,
        route: '/home/lead-sales/view',
        groupName: 'sales',
      },
      {
        name: 'homeLayout.leadsManagementView.leads-management-view',
        isDisabled: true,
        route: '/home/lead-sales/add',
      },
    ],
  },
  {
    path: '/edit',
    name: 'homeLayout.leadsManagementView.leads-management-view',
    component: LeadsSalesManagementView,
    layout: '/home/lead-sales',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LeadsView:leads',
        isDisabled: false,
        route: '/home/lead-sales/view',
        groupName: 'sales',
      },
      {
        name: 'homeLayout.leadsManagementView.leads-management-view',
        isDisabled: true,
        route: '/home/lead-sales/edit',
      },
    ],
  },
  {
    path: '/lead-profile-edit',
    name: 'LeadsProfileManagementView:lead-profile-edit',
    component: LeadsSalesProfileManagementView,
    layout: '/home/lead-sales',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LeadsView:leads',
        isDisabled: false,
        route: '/home/lead-sales/view',
        groupName: 'sales',
      },
      {
        name: 'LeadsProfileManagementView:lead-profile-edit',
        isDisabled: true,
        route: '/home/lead-sales/lead-profile-edit',
      },
    ],
  },
  {
    path: '/view',
    name: 'LeadsView:leads',
    component: LeadsSalesView,
    layout: '/home/lead-sales',
    default: true,
    isRoute: true,
    authorize: true,
    roles: Object.values(LeadsSalesPermissions),
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LeadsView:leads',
        isDisabled: false,
        route: '/home/lead-sales/view',
        groupName: 'sales',
      },
    ],
  },
  {
    path: '/merge',
    name: 'homeLayout.leadsManagementView.leads-management-view',
    component: LeadsSalesMergeView,
    layout: '/home/lead-sales',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LeadsView:leads',
        isDisabled: false,
        route: '/home/lead-sales/view',
        groupName: 'sales',
      },
      {
        name: 'homeLayout.leadsManagementView.merge-leads',
        isDisabled: true,
        route: '/home/lead-sales/merge',
      },
    ],
  },
];
