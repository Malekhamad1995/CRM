import { IncidentsView } from '../../Views/Home/IncidentsView/IncidentsView';
import { IncidentsManagementView } from '../../Views/Home/IncidentsView/IncidentsManagementView';

export const IncidentsRoutes = [
  {
    path: '/view',
    name: 'WorkOrdersView:Incidents',
    component: IncidentsView,
    layout: '/home/Incidents',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'IncidentsView:Incidents',
        isDisabled: true,
        route: '/home/Incidents',
        groupName: 'property-management',
      },
    ],
  },
  {
    path: '/edit',
    name: 'IncidentsManagementView:edit',
    component: IncidentsManagementView,
    layout: '/home/Incidents',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'IncidentsView:Incidents',
        isDisabled: false,
        route: '/home/Incidents',
        groupName: 'property-management',
      },
      {
        name: 'IncidentsView:EditIncidents',
        isDisabled: true,
        route: '/home/Incidents/edit',
      },
    ],
  },
  {
    path: '/add',
    name: 'IncidentsManagementView:add',
    component: IncidentsManagementView,
    layout: '/home/Incidents',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'IncidentsView:Incidents',
        isDisabled: false,
        route: '/home/Incidents',
        groupName: 'property-management',
      },
      {
        name: 'IncidentsView:AddIncidents',
        isDisabled: true,
        route: '/home/Incidents/add',
      },
    ],
  },
];
