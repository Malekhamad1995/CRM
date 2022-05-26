import { WorkOrdersView, WorkOrdersManagementView, WorkOrderAddOnlyView } from '../../Views/Home';

export const WorkOrdersRoutes = [
  {
    path: '/view',
    name: 'WorkOrdersView:work-orders',
    component: WorkOrdersView,
    layout: '/home/work-orders',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'WorkOrdersView:work-orders',
        isDisabled: true,
        route: '/home/work-orders',
        groupName: 'property-management',
      },
    ],
  },
  {
    path: '/edit',
    name: 'WorkOrdersManagementView:edit',
    component: WorkOrdersManagementView,
    layout: '/home/work-orders',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'WorkOrdersView:work-orders',
        isDisabled: false,
        route: '/home/work-orders',
        groupName: 'property-management',
      },
      {
        name: 'WorkOrdersManagementView:edit',
        isDisabled: true,
        route: '/home/work-orders/edit',
      },
    ],
  },
  {
    path: '/add',
    name: 'WorkOrdersManagementView:add',
    component: WorkOrderAddOnlyView,
    layout: '/home/work-orders',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'WorkOrdersView:work-orders',
        isDisabled: false,
        route: '/home/work-orders',
        groupName: 'property-management',
      },
      {
        name: 'WorkOrdersManagementView:add',
        isDisabled: true,
        route: '/home/work-orders/add',
      },
    ],
  },
];
