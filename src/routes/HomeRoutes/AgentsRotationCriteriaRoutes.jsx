import { AgentsRotationCriteriaView } from '../../Views/Home/AgentsView/AgentsRotationCriteriaView/AgentsRotationCriteriaView';
import { RotationCriteriaManageView } from '../../Views/Home/AgentsView/AgentsRotationCriteriaView/Sections/RotationCriteriaManageView/RotationCriteriaManageView';
import { RotationSchemaViewDetails } from '../../Views/Home/AgentsView/AgentsRotationCriteriaView/Sections/RotationSchemaViewDetails/RotationSchemaViewDetails'
export const AgentsRotationCriteriaRoutes = [
  {
    path: '/view',
    name: 'Agents:rotation-schema',
    component: AgentsRotationCriteriaView,
    layout: '/home/rotation-criteria',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'Agents:rotation-schema',
        isDisabled: true,
        route: '/home/rotation-criteria/view',
        groupName: 'agent-management',
      },
    ],
  },
  {
    path: '/manage',
    name: 'Agents:rotation',
    component: RotationCriteriaManageView,
    layout: '/home/rotation-criteria',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'Agents:rotation-schema',
        isDisabled: false,
        route: '/home/rotation-criteria/view',
        groupName: 'agent-management',
      },
      {
        name: 'Agents:Assign-new-agents',
        isDisabled: true,
        route: '/home/rotation-criteria/manage',
      },
    ],
  },
  {
    path: '/View-details',
    name: 'Agents:rotationn',
    component: RotationSchemaViewDetails,
    layout: '/otation-criteria',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'Agents:rotation-schema',
        isDisabled: false,
        route: '/home/rotation-criteria/view',
        groupName: 'agent-management',
      },
      {
        name: 'Agents:View-details',
        isDisabled: true,
        route: '/home/rotation-criteria/View-details',
      },
    ],
  },
];
