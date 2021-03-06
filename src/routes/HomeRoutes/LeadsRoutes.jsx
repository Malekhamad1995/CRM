import {
  LeadsView,
  LeadsManagementView,
  LeadsMergeView,
  LeadsProfileManagementView,
} from '../../Views/Home';

export const LeadsRoutes = [
  {
    path: '/add',
    name: 'homeLayout.leadsManagementView.leads-management-view',
    component: LeadsManagementView,
    layout: '/home/leads',
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
        route: '/home/leads/view',
        groupName: 'call-center',
      },
      {
        name: 'homeLayout.leadsManagementView.leads-management-view',
        isDisabled: true,
        route: '/home/leads/add',
      },
    ],
  },
  {
    path: '/edit',
    name: 'homeLayout.leadsManagementView.leads-management-view',
    component: LeadsManagementView,
    layout: '/home/leads',
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
        route: '/home/leads/view',
        groupName: 'call-center',
      },
      {
        name: 'homeLayout.leadsManagementView.leads-management-view',
        isDisabled: true,
        route: '/home/leads/edit',
      },
    ],
  },
  {
    path: '/lead-profile-edit',
    name: 'LeadsProfileManagementView:lead-profile-edit',
    component: LeadsProfileManagementView,
    layout: '/home/leads',
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
        route: '/home/leads/view',
        groupName: 'call-center',
      },
      {
        name: 'LeadsProfileManagementView:lead-profile-edit',
        isDisabled: true,
        route: '/home/leads/lead-profile-edit',
      },
    ],
  },
  {
    path: '/view',
    name: 'LeadsView:leads',
    component: LeadsView,
    layout: '/home/leads',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LeadsView:leads',
        isDisabled: false,
        route: '/home/leads/view',
        groupName: 'call-center',
      },
    ],
  },
  {
    path: '/merge',
    name: 'homeLayout.leadsManagementView.leads-management-view',
    component: LeadsMergeView,
    layout: '/home/leads',
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
        route: '/home/leads/view',
        groupName: 'call-center',
      },
      {
        name: 'homeLayout.leadsManagementView.merge-leads',
        isDisabled: true,
        route: '/home/leads/merge',
      },
    ],
  },
];
