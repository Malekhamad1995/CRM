import { TemplatesView } from '../../Views/Home';

export const TemplatesRoutes = [
  {
    path: '/view',
    name: 'TemplatesView:templates',
    component: TemplatesView,
    layout: '/home/templates',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'TemplatesView:templates',
        isDisabled: true,
        route: '/home/templates/view',
        groupName: 'system-parameters',
      },
    ],
  },
];
