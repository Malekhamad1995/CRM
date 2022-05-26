import { PortfolioView } from '../../Views/Home';
import { PortfolioViewProfileManagement } from '../../Views/Home/PortfolioView/PortfolioViewProfileManagement/PortfolioViewProfileManagement';

export const PortfolioRoutes = [
  {
    path: '/view',
    name: 'PortfolioView:portfolio',
    component: PortfolioView,
    layout: '/home/portfolio',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'PortfolioView:portfolio',
        isDisabled: true,
        route: '/home/portfolio',
        groupName: 'property-management',
      },
    ],
  },
  {
    path: '/open-file',
    name: 'PortfolioView:portfolio',
    component: PortfolioViewProfileManagement,
    layout: '/home/portfolio',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'PortfolioView:portfolio',
        isDisabled: false,
        route: '/home/portfolio',
        groupName: 'property-management',
      },
      {
        name: 'PortfolioView:open-file',
        isDisabled: true,
        route: '/home/portfolio/open-file',
      },
    ],
  },
];
