import { GalleryCityView } from '../../Views/Home';

export const GalleryCityRoutes = [
  {
    path: '/view',
    name: 'ImagesGalleryGroup:city-gallery',
    component: GalleryCityView,
    layout: '/home/city-gallery',
    default: true,
    isRoute: true,
    authorize: true,
    roles: [],
    isDisabled: false,
    isExact: true,
    breadcrumbs: [
      {
        name: 'ImagesGalleryGroup:city-gallery',
        isDisabled: true,
        route: '/home/city-gallery/view',
        groupName: 'images-gallery',
      },
    ],
  },
];
