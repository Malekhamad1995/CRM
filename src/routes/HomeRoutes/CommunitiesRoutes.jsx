
import { CommunityAddView, CommunityEditView } from '../../Views/Home/LocationViews/CommunityView/CommunityManagementView';
import { CommunityView } from '../../Views/Home/LocationViews/CommunityView/CommunityView';


export const CommunitiesRoutes = [
  {
    path: '/view',
    name: 'LocationView:Communitie',
    component: CommunityView,
    layout: '/home/Communitie',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:Communitie',
        isDisabled: false,
        route: '/home/Communitie/view',
        groupName: 'LocationView:locations',
      },
    ],
  },
  {
    path: '/add',
    name: 'LocationView:add',
    component: CommunityAddView,
    layout: '/home/Communitie',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:Communitie',
        isDisabled: false,
        route: '/home/Communitie/view',
        groupName: 'LocationView:locations',
      },
      {
        name: 'LocationView:add',
        isDisabled: false,
        route: '/home/Communitie/add',

      },
    ],
  },
  {
    path: '/edit',
    name: 'LocationView:edit',
    component: CommunityEditView,
    layout: '/home/Communitie',
    default: false,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'LocationView:Communitie',
        isDisabled: false,
        route: '/home/Communitie/view',
        groupName: 'LocationView:locations',
      },
      {
        name: 'LocationView:edit',
        isDisabled: false,
        route: '/home/Communitie/edit',
      },
    ],
  },
];
