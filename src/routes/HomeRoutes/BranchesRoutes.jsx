import { BranchView } from '../../Views/Home/Administration/BranchesView';

export const BranchesRoutes = [
  {
    path: '/view',
    name: 'Branches',
    component: BranchView,
    layout: '/home/branches',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: false,
    breadcrumbs: [
      {
        name: 'Branches',
        isDisabled: true,
        route: '/home/branches/view',
        groupName: 'system-admin',
      },
    ],
  }
];
